import { useState } from 'react'
import { useUIStore } from '../../stores/uiStore'
import { useCanvasStore } from '../../stores/canvasStore'
import { useColorStore } from '../../stores/colorStore'
import { useTypographyStore } from '../../stores/typographyStore'
import { Modal, Button } from '../ui'
import { Copy, Download, Check, Code, Image, FileText } from 'lucide-react'

type ExportFormat = 'html-css' | 'html-tailwind' | 'png' | 'style-guide'
const ExportModal = () => {
  const { exportModalOpen, setExportModalOpen } = useUIStore()
  const { pages, currentPageId } = useCanvasStore()
  const currentPage = pages.find(p => p.id === currentPageId)
  const elements = currentPage?.elements || []
  const { activeTheme } = useColorStore()
  const { headingFont, bodyFont, display, h1, h2, body } = useTypographyStore()
  const [format, setFormat] = useState<ExportFormat>('html-css')
  const [copied, setCopied] = useState(false)
  const generateCSS = () => `:root {
  --color-primary: ${activeTheme.colors.primary};
  --color-secondary: ${activeTheme.colors.secondary};
  --color-accent: ${activeTheme.colors.accent};
  --color-background: ${activeTheme.colors.background};
  --color-surface: ${activeTheme.colors.surface};
  --color-text-primary: ${activeTheme.colors.textPrimary};
  --color-text-secondary: ${activeTheme.colors.textSecondary};
  --color-border: ${activeTheme.colors.border};
  --font-heading: "${headingFont}", serif;
  --font-body: "${bodyFont}", sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font-body); background-color: var(--color-background); color: var(--color-text-primary); line-height: 1.6; }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.btn-primary { background-color: var(--color-primary); color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; }
.btn-secondary { background-color: transparent; color: var(--color-text-primary); padding: 12px 24px; border: 1px solid var(--color-border); border-radius: 6px; font-weight: 500; cursor: pointer; }`

  const generateHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Website</title>
<link href="https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g,'+')}:wght@400;600;700&family=${bodyFont.replace(/ /g,'+')}:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<!-- Add your content here -->
</body>
</html>`
  const generateStyleGuide = () => `# Style Guide
## Colors
- Primary: ${activeTheme.colors.primary}
- Secondary: ${activeTheme.colors.secondary}
- Accent: ${activeTheme.colors.accent}
- Background: ${activeTheme.colors.background}
- Surface: ${activeTheme.colors.surface}
- Text Primary: ${activeTheme.colors.textPrimary}
- Text Secondary: ${activeTheme.colors.textSecondary}
- Border: ${activeTheme.colors.border}

## Typography
### Heading Font: ${headingFont}
- Display: ${display.fontSize}px / ${display.fontWeight}
- H1: ${h1.fontSize}px / ${h1.fontWeight}
- H2: ${h2.fontSize}px / ${h2.fontWeight}
### Body Font: ${bodyFont}
- Body: ${body.fontSize}px / ${body.fontWeight}
## Spacing
Base unit: 4px
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px`
  const getContent = () => format === 'html-css' ? generateCSS() : format === 'html-tailwind' ? generateHTML() : format === 'style-guide' ? generateStyleGuide() : ''
  const handleCopy = async () => { await navigator.clipboard.writeText(getContent()); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleDownload = () => {
    const content = getContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = format === 'html-css' ? 'styles.css' : format === 'style-guide' ? 'style-guide.md' : 'index.html'
    a.click(); URL.revokeObjectURL(url)
  }
  const formats: { id: ExportFormat; label: string; icon: typeof Code }[] = [
    { id: 'html-css', label: 'CSS', icon: Code },
    { id: 'html-tailwind', label: 'HTML', icon: FileText },
    { id: 'style-guide', label: 'Style Guide', icon: FileText }
  ]
  return (
    <Modal open={exportModalOpen} onOpenChange={setExportModalOpen} title="Export" size="lg">
      <div className="flex gap-2 mb-4">
        {formats.map(f => <Button key={f.id} variant={format === f.id ? 'secondary' : 'ghost'} size="sm" onClick={() => setFormat(f.id)} className="gap-1.5"><f.icon size={14} />{f.label}</Button>)}
      </div>
      <div className="relative rounded-md bg-background-tertiary border border-border">
        <pre className="p-4 text-sm font-mono text-text-primary overflow-auto max-h-80">{getContent()}</pre>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button variant="secondary" size="sm" onClick={handleCopy}>{copied ? <Check size={14} /> : <Copy size={14} />}</Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}><Download size={14} /></Button>
        </div>
      </div>
    </Modal>
  )
}
export { ExportModal }