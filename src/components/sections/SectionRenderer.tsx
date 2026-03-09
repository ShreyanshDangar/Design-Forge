import React, { useState, useRef, useEffect } from 'react'
import { CanvasElement, useCanvasStore } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { useTypographyStore } from '../../stores/typographyStore'

interface SectionRendererProps { element: CanvasElement }
const SectionRenderer = ({ element }: SectionRendererProps) => {
  const { activeTheme } = useColorStore()
  const { headingFont, bodyFont, display, h1, h2, body } = useTypographyStore()
  const { updateElement, selectedIds } = useCanvasStore()
  const colors = activeTheme.colors
  const templateId = (element.content?.templateId as string) || ''
  const isSelected = selectedIds.includes(element.id)
  if (element.type === 'text') {
    const content = element.content || {}
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState((content.text as string) || 'Text')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useEffect(() => {
      setEditText((content.text as string) || 'Text')
    }, [content.text])

    useEffect(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.select()
      }
    }, [isEditing])
    const handleDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsEditing(true)
    }
    const handleBlur = () => {
      setIsEditing(false)
      updateElement(element.id, {
        content: { ...element.content, text: editText }
      })
    }
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false)
        setEditText((content.text as string) || 'Text')
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleBlur()
      }
    }
    const textStyle = {
      fontFamily: (content.fontFamily as string) || 'Inter',
      fontSize: (content.fontSize as number) || 16,
      fontWeight: (content.fontWeight as number) || 400,
      color: (content.color as string) || colors.textPrimary,
      textAlign: (content.textAlign as 'left' | 'center' | 'right') || 'left',
      lineHeight: 1.4
    }
    if (isEditing) {
      return (
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full resize-none border-2 border-accent rounded bg-transparent outline-none"
          style={{
            ...textStyle,
            padding: '8px'
          }}
        />
      )
    }
    return (
      <div
        className={`w-full h-full flex items-center overflow-hidden cursor-text ${isSelected ? 'hover:bg-accent/5' : ''}`}
        style={{
          ...textStyle,
          justifyContent: content.textAlign === 'center' ? 'center' : content.textAlign === 'right' ? 'flex-end' : 'flex-start',
          padding: '8px'
        }}
        onDoubleClick={handleDoubleClick}
        title="Double-click to edit"
      >
        {(content.text as string) || 'Double-click to edit'}
      </div>
    )
  }
  if (element.type === 'shape') {
    const content = element.content || {}
    const shapeType = (content.shapeType as string) || 'rectangle'
    const fill = (content.fill as string) || colors.primary
    const stroke = (content.stroke as string) || 'transparent'
    const strokeWidth = (content.strokeWidth as number) || 0
    const borderRadius = (content.borderRadius as number) || 0
    const opacity = ((content.opacity as number) ?? 100) / 100

    const renderShape = () => {
      switch (shapeType) {
        case 'circle':
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <ellipse
                cx="50" cy="50" rx="48" ry="48"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth * 2}
                opacity={opacity}
              />
            </svg>
          )
        case 'triangle':
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="50,5 95,95 5,95"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth * 2}
                opacity={opacity}
              />
            </svg>
          )
        case 'star':
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth * 2}
                opacity={opacity}
              />
            </svg>
          )
        case 'hexagon':
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="50,3 93,25 93,75 50,97 7,75 7,25"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth * 2}
                opacity={opacity}
              />
            </svg>
          )
        case 'line':
          return (
            <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
              <line
                x1="0" y1="5" x2="100" y2="5"
                stroke={fill}
                strokeWidth={Math.max(strokeWidth, 2) * 2}
                opacity={opacity}
              />
            </svg>
          )
        case 'rectangle':
        default:
          return (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: fill,
                border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : 'none',
                borderRadius: borderRadius,
                opacity: opacity
              }}
            />
          )
      }
    }

    return <div className="w-full h-full">{renderShape()}</div>
  }
  const customBgColor = element.content?.backgroundColor as string | undefined
  const renderNavSimple = () => (
    <nav className="w-full h-full flex items-center justify-between px-8 bg-background-primary border-b border-border" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-primary" style={{ backgroundColor: colors.primary }} />
        <span style={{ fontFamily: headingFont, color: colors.textPrimary, fontWeight: 700, fontSize: 18 }}>Brand</span>
      </div>
      <div className="flex items-center gap-6">
        {['Home', 'About', 'Services', 'Contact'].map(item => (
          <span key={item} style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14, fontWeight: 500 }} className="cursor-pointer hover:text-primary transition-colors">{item}</span>
        ))}
        <button className="px-4 py-2 rounded font-medium transition-transform hover:scale-105" style={{ backgroundColor: colors.primary, color: colors.textOnPrimary, fontFamily: bodyFont, fontSize: 14 }}>Get Started</button>
      </div>
    </nav>
  )
  const renderNavCentered = () => (
    <nav className="w-full h-full flex items-center justify-between px-8 bg-background-primary border-b border-border" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="flex items-center gap-6 flex-1">
        {['Shop', 'Collections', 'New'].map(item => (
          <span key={item} style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14, fontWeight: 500 }} className="cursor-pointer hover:text-primary transition-colors">{item}</span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 flex-1">
        <span style={{ fontFamily: headingFont, color: colors.textPrimary, fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>BRAND.</span>
      </div>
      <div className="flex items-center justify-end gap-6 flex-1">
        {['Search', 'Account', 'Cart (0)'].map(item => (
          <span key={item} style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }} className="cursor-pointer hover:text-primary transition-colors">{item}</span>
        ))}
      </div>
    </nav>
  )
  const renderNavTransparent = () => (
    <nav className="w-full h-full flex items-center justify-between px-8 backdrop-blur-sm bg-white/10" style={{ backgroundColor: customBgColor || 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: headingFont, color: colors.textPrimary, fontWeight: 600, fontSize: 18 }}>minimal.</span>
      </div>
      <div className="flex items-center gap-8">
        {['Work', 'Studio', 'News'].map(item => (
          <span key={item} style={{ fontFamily: bodyFont, color: colors.textPrimary, fontSize: 14, opacity: 0.8 }} className="cursor-pointer hover:opacity-100 transition-opacity">{item}</span>
        ))}
        <span style={{ fontFamily: bodyFont, color: colors.textPrimary, fontSize: 14, fontWeight: 600 }} className="cursor-pointer">Menu</span>
      </div>
    </nav>
  )
  const renderHeroCentered = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8" style={{ backgroundColor: customBgColor || colors.background }}>
      <span className="uppercase tracking-widest mb-4" style={{ fontFamily: bodyFont, color: colors.accent, fontSize: 12, fontWeight: 600 }}>Welcome to the future</span>
      <h1 className="mb-4 max-w-3xl" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: display.fontSize, fontWeight: display.fontWeight, lineHeight: display.lineHeight }}>Build something amazing today</h1>
      <p className="mb-8 max-w-xl" style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: body.fontSize, lineHeight: body.lineHeight }}>Create beautiful websites with our powerful design tools. No coding required. Just drag, drop, and launch.</p>
      <div className="flex items-center gap-4">
        <button className="px-6 py-3 rounded" style={{ backgroundColor: colors.primary, color: colors.textOnPrimary, fontFamily: bodyFont, fontWeight: 500 }}>Get Started Free</button>
        <button className="px-6 py-3 rounded border" style={{ borderColor: colors.border, color: colors.textPrimary, fontFamily: bodyFont, fontWeight: 500 }}>Learn More</button>
      </div>
    </div>
  )
  const renderHeroSplit = () => (
    <div className="w-full h-full flex items-center px-8" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="flex-1 pr-8">
        <span className="uppercase tracking-widest mb-4 block" style={{ fontFamily: bodyFont, color: colors.accent, fontSize: 12, fontWeight: 600 }}>Introducing</span>
        <h1 className="mb-4" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: h1.fontSize, fontWeight: h1.fontWeight, lineHeight: h1.lineHeight }}>The future of web design</h1>
        <p className="mb-6" style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: body.fontSize, lineHeight: body.lineHeight }}>Powerful tools that help you create stunning websites in minutes, not hours.</p>
        <button className="px-6 py-3 rounded" style={{ backgroundColor: colors.primary, color: colors.textOnPrimary, fontFamily: bodyFont, fontWeight: 500 }}>Start Building</button>
      </div>
      <div className="flex-1 h-4/5 rounded-lg" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }} />
    </div>
  )
  const renderFeaturesGrid = () => (
    <div className="w-full h-full px-8 py-12" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="text-center mb-8">
        <h2 style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: h2.fontSize, fontWeight: h2.fontWeight }}>Everything you need</h2>
        <p className="mt-2" style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: body.fontSize }}>Powerful features to help you succeed</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 rounded-lg" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
            <div className="w-10 h-10 rounded mb-4" style={{ backgroundColor: `${colors.primary}20` }} />
            <h3 className="mb-2" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 18, fontWeight: 600 }}>Feature {i}</h3>
            <p style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>A powerful feature that helps you accomplish your goals faster.</p>
          </div>
        ))}
      </div>
    </div>
  )
  const renderTestimonial = () => (
    <div className="w-full h-full flex flex-col items-center justify-center px-8" style={{ backgroundColor: customBgColor || colors.surface }}>
      <div className="w-16 h-16 rounded-full mb-6" style={{ backgroundColor: `${colors.primary}30` }} />
      <p className="text-center max-w-2xl mb-6 italic" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 24, lineHeight: 1.5 }}>"This tool completely transformed how we approach web design. It's incredibly intuitive and powerful."</p>
      <span style={{ fontFamily: bodyFont, color: colors.textPrimary, fontWeight: 600 }}>Jane Smith</span>
      <span style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>CEO at TechCorp</span>
    </div>
  )
  const renderLogoCloud = () => (
    <div className="w-full h-full flex flex-col items-center justify-center px-8" style={{ backgroundColor: customBgColor || colors.background }}>
      <p className="mb-6" style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>Trusted by leading companies</p>
      <div className="flex items-center gap-12">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-24 h-8 rounded" style={{ backgroundColor: `${colors.textSecondary}20` }} />)}
      </div>
    </div>
  )
  const renderPricing = () => (
    <div className="w-full h-full px-8 py-12" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="text-center mb-8">
        <h2 style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: h2.fontSize, fontWeight: h2.fontWeight }}>Simple, transparent pricing</h2>
      </div>
      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
        {['Basic', 'Pro', 'Enterprise'].map((plan, i) => (
          <div key={plan} className="p-6 rounded-lg" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, outline: i === 1 ? `2px solid ${colors.primary}` : 'none' }}>
            <h3 className="mb-2" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 18, fontWeight: 600 }}>{plan}</h3>
            <div className="mb-4">
              <span style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 36, fontWeight: 700 }}>${[9, 29, 99][i]}</span>
              <span style={{ fontFamily: bodyFont, color: colors.textSecondary }}>/mo</span>
            </div>
            <button className="w-full py-2 rounded mb-4" style={{ backgroundColor: i === 1 ? colors.primary : 'transparent', color: i === 1 ? colors.textOnPrimary : colors.textPrimary, border: `1px solid ${colors.border}`, fontFamily: bodyFont }}>Get Started</button>
            <ul className="space-y-2">{['Feature one', 'Feature two', 'Feature three'].map(f => <li key={f} style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>{f}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  )
  const renderCTA = () => (
    <div className="w-full h-full flex flex-col items-center justify-center px-8" style={{ backgroundColor: customBgColor || colors.primary }}>
      <h2 className="mb-4 text-center" style={{ fontFamily: headingFont, color: colors.textOnPrimary, fontSize: h2.fontSize, fontWeight: h2.fontWeight }}>Ready to get started?</h2>
      <p className="mb-6 text-center" style={{ fontFamily: bodyFont, color: colors.textOnPrimary, opacity: 0.9 }}>Join thousands of satisfied customers today</p>
      <button className="px-6 py-3 rounded" style={{ backgroundColor: colors.background, color: colors.textPrimary, fontFamily: bodyFont, fontWeight: 500 }}>Start Free Trial</button>
    </div>
  )
  const renderFooter = () => (
    <footer className="w-full h-full px-8 py-8" style={{ backgroundColor: customBgColor || colors.surface }}>
      <div className="grid grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.primary }} />
            <span style={{ fontFamily: headingFont, color: colors.textPrimary, fontWeight: 600 }}>Brand</span>
          </div>
          <p style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>Building the future of web design.</p>
        </div>
        {['Product', 'Company', 'Resources'].map(section => (
          <div key={section}>
            <h4 className="mb-3" style={{ fontFamily: bodyFont, color: colors.textPrimary, fontWeight: 600, fontSize: 14 }}>{section}</h4>
            <ul className="space-y-2">{['Link one', 'Link two', 'Link three'].map(link => <li key={link} style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>{link}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t" style={{ borderColor: colors.border }}>
        <p style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 12 }}>2024 Brand. All rights reserved.</p>
      </div>
    </footer>
  )
  const renderContactSplit = () => (
    <div className="w-full h-full flex" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="flex-1 p-12 flex flex-col justify-center bg-background-secondary" style={{ backgroundColor: colors.surface }}>
        <h2 className="mb-2" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 24, fontWeight: 700 }}>Get in touch</h2>
        <p className="mb-8" style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>We'd love to hear from you. Fill out the form below.</p>
        <div className="space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 rounded border border-border bg-background-primary" />
            <div className="h-10 rounded border border-border bg-background-primary" />
          </div>
          <div className="h-10 rounded border border-border bg-background-primary" />
          <div className="h-24 rounded border border-border bg-background-primary" />
          <button className="w-full h-10 rounded font-medium" style={{ backgroundColor: colors.primary, color: colors.textOnPrimary }}>Send Message</button>
        </div>
      </div>
      <div className="flex-1 p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: colors.primary, backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="font-semibold mb-1" style={{ fontFamily: headingFont, color: colors.textPrimary }}>Visit us</h3>
            <p style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>123 Design Street<br />Creative City, DC 10101</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1" style={{ fontFamily: headingFont, color: colors.textPrimary }}>Contact</h3>
            <p style={{ fontFamily: bodyFont, color: colors.textSecondary, fontSize: 14 }}>hello@example.com<br />+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  )
  const renderContactSimple = () => (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4" style={{ backgroundColor: customBgColor || colors.background }}>
      <h2 className="mb-2 text-center" style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 28, fontWeight: 700 }}>Contact Us</h2>
      <p className="mb-8 text-center max-w-lg" style={{ fontFamily: bodyFont, color: colors.textSecondary }}>Have questions? We're here to help.</p>
      <div className="w-full max-w-md space-y-4 bg-background-primary p-6 rounded-xl border border-border shadow-sm" style={{ backgroundColor: colors.surface }}>
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: colors.textSecondary }}>Email</label>
          <div className="h-10 rounded border border-border w-full bg-background-secondary" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: colors.textSecondary }}>Message</label>
          <div className="h-24 rounded border border-border w-full bg-background-secondary" />
        </div>
        <button className="w-full h-10 rounded font-medium mt-2" style={{ backgroundColor: colors.primary, color: colors.textOnPrimary }}>Submit</button>
      </div>
    </div>
  )
  const renderContactCards = () => (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-8" style={{ backgroundColor: customBgColor || colors.background }}>
      <div className="mb-10 text-center">
        <h2 style={{ fontFamily: headingFont, color: colors.textPrimary, fontSize: 24, fontWeight: 700 }}>Get in touch</h2>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { title: 'Sales', email: 'sales@company.com', desc: 'Expert advice for your team' },
          { title: 'Support', email: 'help@company.com', desc: 'Assistance with our products' },
          { title: 'Press', email: 'press@company.com', desc: 'Media and partnership inquiries' }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-xl border border-border flex flex-col items-center text-center transition-all hover:shadow-md" style={{ backgroundColor: colors.surface }}>
            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="mb-1 font-semibold" style={{ fontFamily: headingFont, color: colors.textPrimary }}>{item.title}</h3>
            <p className="mb-4 text-sm" style={{ fontFamily: bodyFont, color: colors.textSecondary }}>{item.desc}</p>
            <span className="text-sm font-medium" style={{ color: colors.primary }}>{item.email}</span>
          </div>
        ))}
      </div>
    </div>
  )
  const renderDefault = () => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.surface, border: `1px dashed ${colors.border}` }}>
      <span style={{ fontFamily: bodyFont, color: colors.textSecondary }}>{element.sectionType}</span>
    </div>
  )
  const renderers: Record<string, () => React.ReactElement> = {
    'navbar-simple': renderNavSimple,
    'navbar-centered': renderNavCentered,
    'navbar-transparent': renderNavTransparent,
    'hero-centered': renderHeroCentered, 'hero-split': renderHeroSplit, 'hero-split-reverse': renderHeroSplit, 'hero-minimal': renderHeroCentered, 'hero-gradient': renderHeroCentered,
    'features-grid-3': renderFeaturesGrid, 'features-grid-4': renderFeaturesGrid, 'features-alternating': renderFeaturesGrid, 'features-bento': renderFeaturesGrid,
    'testimonial-single': renderTestimonial, 'testimonials-carousel': renderTestimonial, 'testimonials-grid': renderTestimonial,
    'logo-cloud': renderLogoCloud, 'stats-section': renderLogoCloud,
    'pricing-3-col': renderPricing, 'pricing-2-col': renderPricing, 'pricing-comparison': renderPricing,
    'cta-simple': renderCTA, 'cta-split': renderCTA, 'cta-banner': renderCTA, 'cta-newsletter': renderCTA,
    'footer-4-col': renderFooter, 'footer-simple': renderFooter, 'footer-cta': renderFooter, 'footer-minimal': renderFooter,
    'contact-split': renderContactSplit,
    'contact-simple': renderContactSimple,
    'contact-cards': renderContactCards
  }
  const renderer = renderers[templateId] || renderDefault
  return <div className="w-full h-full overflow-hidden">{renderer()}</div>
}
export { SectionRenderer }