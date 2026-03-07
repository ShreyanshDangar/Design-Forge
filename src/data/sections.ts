export interface SectionTemplate {
  id: string
  name: string
  category: string
  width: number
  height: number
  preview: string
}
export const sectionTemplates: SectionTemplate[] = [
  { id: 'navbar-simple', name: 'Navbar Simple', category: 'Navigation', width: 1200, height: 64, preview: 'Logo left, Links right (Home/About), CTA Button' },
  { id: 'navbar-centered', name: 'Navbar Centered', category: 'Navigation', width: 1200, height: 64, preview: 'Centered Logo, Split Links, Search Icon' },
  { id: 'navbar-transparent', name: 'Navbar Transparent', category: 'Navigation', width: 1200, height: 64, preview: 'Glass effect, White text, Minimalist layout' },
  { id: 'hero-centered', name: 'Hero Centered', category: 'Hero', width: 1200, height: 600, preview: 'Bold headline, subtext, and dual CTA buttons centered' },
  { id: 'hero-split', name: 'Hero Split', category: 'Hero', width: 1200, height: 600, preview: 'Headline and CTA left, product image right' },
  { id: 'hero-split-reverse', name: 'Hero Split Reverse', category: 'Hero', width: 1200, height: 600, preview: 'Product mockup left, compelling copy right' },
  { id: 'hero-minimal', name: 'Hero Minimal', category: 'Hero', width: 1200, height: 500, preview: 'Clean typography only, no images needed' },
  { id: 'hero-gradient', name: 'Hero Gradient', category: 'Hero', width: 1200, height: 600, preview: 'Vibrant gradient background with floating elements' },
  { id: 'features-grid-3', name: 'Features 3-Column', category: 'Features', width: 1200, height: 400, preview: 'Icon, title, description in 3 equal columns' },
  { id: 'features-grid-4', name: 'Features 4-Column', category: 'Features', width: 1200, height: 350, preview: 'Compact 4-column layout with icons' },
  { id: 'features-alternating', name: 'Features Alternating', category: 'Features', width: 1200, height: 800, preview: 'Image and text alternate left/right each row' },
  { id: 'features-bento', name: 'Features Bento', category: 'Features', width: 1200, height: 500, preview: 'Modern asymmetric grid like Apple bento boxes' },
  { id: 'testimonial-single', name: 'Testimonial Single', category: 'Social Proof', width: 1200, height: 350, preview: 'Large quote with customer photo and name' },
  { id: 'testimonials-carousel', name: 'Testimonials Carousel', category: 'Social Proof', width: 1200, height: 400, preview: 'Auto-sliding testimonial cards with dots' },
  { id: 'testimonials-grid', name: 'Testimonials Grid', category: 'Social Proof', width: 1200, height: 450, preview: 'Three testimonial cards with star ratings' },
  { id: 'logo-cloud', name: 'Logo Cloud', category: 'Social Proof', width: 1200, height: 150, preview: 'Trusted by: row of grayscale client logos' },
  { id: 'stats-section', name: 'Stats Section', category: 'Social Proof', width: 1200, height: 200, preview: 'Big numbers: 10K+ users, 99% uptime, 50+ countries' },
  { id: 'pricing-3-col', name: 'Pricing 3-Column', category: 'Pricing', width: 1200, height: 600, preview: 'Basic, Pro, Enterprise tiers with feature lists' },
  { id: 'pricing-2-col', name: 'Pricing 2-Column', category: 'Pricing', width: 1200, height: 550, preview: 'Monthly vs Annual with toggle switch' },
  { id: 'pricing-comparison', name: 'Pricing Comparison', category: 'Pricing', width: 1200, height: 700, preview: 'Full feature comparison table with checkmarks' },
  { id: 'cta-simple', name: 'CTA Simple', category: 'Call to Action', width: 1200, height: 250, preview: 'Ready to get started? heading with action button' },
  { id: 'cta-split', name: 'CTA Split', category: 'Call to Action', width: 1200, height: 300, preview: 'Compelling copy left, email signup form right' },
  { id: 'cta-banner', name: 'CTA Banner', category: 'Call to Action', width: 1200, height: 200, preview: 'Full-width colored banner with centered CTA' },
  { id: 'cta-newsletter', name: 'CTA Newsletter', category: 'Call to Action', width: 1200, height: 250, preview: 'Subscribe to updates with email input field' },
  { id: 'about-split', name: 'About Split', category: 'Content', width: 1200, height: 450, preview: 'Company story text with team office photo' },
  { id: 'team-grid', name: 'Team Grid', category: 'Content', width: 1200, height: 500, preview: '4 team member cards with photos and titles' },
  { id: 'timeline', name: 'Timeline', category: 'Content', width: 1200, height: 600, preview: 'Company milestones: Founded 2020, Series A 2022...' },
  { id: 'process-steps', name: 'Process Steps', category: 'Content', width: 1200, height: 300, preview: 'How it works: 1. Sign up 2. Configure 3. Launch' },
  { id: 'faq-accordion', name: 'FAQ Accordion', category: 'Content', width: 1200, height: 450, preview: 'Expandable Q&A list with common questions' },
  { id: 'blog-grid', name: 'Blog Grid', category: 'Content', width: 1200, height: 500, preview: 'Latest posts: 3 article cards with thumbnails' },
  { id: 'gallery-grid', name: 'Gallery Grid', category: 'Content', width: 1200, height: 400, preview: 'Masonry-style image gallery with lightbox' },
  { id: 'contact-split', name: 'Contact Split', category: 'Contact', width: 1200, height: 500, preview: 'Split layout: Form on Left, Info/Map on Right' },
  { id: 'contact-simple', name: 'Contact Simple', category: 'Contact', width: 1200, height: 450, preview: 'Centered Form: Name, Email + Message fields' },
  { id: 'contact-cards', name: 'Contact Cards', category: 'Contact', width: 1200, height: 300, preview: 'Grid of 3 Cards: Support, Sales, Office Info' },
  { id: 'footer-4-col', name: 'Footer 4-Column', category: 'Footer', width: 1200, height: 350, preview: 'Logo + tagline, Products, Company, Resources links' },
  { id: 'footer-simple', name: 'Footer Simple', category: 'Footer', width: 1200, height: 80, preview: 'Copyright, social icons, and legal links row' },
  { id: 'footer-cta', name: 'Footer CTA', category: 'Footer', width: 1200, height: 400, preview: 'Newsletter signup above standard footer links' },
  { id: 'footer-minimal', name: 'Footer Minimal', category: 'Footer', width: 1200, height: 60, preview: '2024 Brand. All rights reserved.' },
]
export const sectionCategories = ['Navigation', 'Hero', 'Features', 'Social Proof', 'Pricing', 'Call to Action', 'Content', 'Contact', 'Footer']