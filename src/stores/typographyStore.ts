import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TypeStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  color: string
}
interface TypographyState {
  headingFont: string
  bodyFont: string
  display: TypeStyle
  h1: TypeStyle
  h2: TypeStyle
  h3: TypeStyle
  bodyLarge: TypeStyle
  body: TypeStyle
  bodySmall: TypeStyle
  caption: TypeStyle
  overline: TypeStyle
  recentFonts: string[]
  favoriteFonts: string[]
  setHeadingFont: (font: string) => void
  setBodyFont: (font: string) => void
  updateTypeStyle: (level: keyof Omit<TypographyState, 'headingFont' | 'bodyFont' | 'recentFonts' | 'favoriteFonts' | 'setHeadingFont' | 'setBodyFont' | 'updateTypeStyle' | 'addRecentFont' | 'toggleFavoriteFont'>, updates: Partial<TypeStyle>) => void
  addRecentFont: (font: string) => void
  toggleFavoriteFont: (font: string) => void
}
const defaultHeadingStyle = (size: number, weight: number): TypeStyle => ({
  fontFamily: 'Playfair Display',
  fontSize: size,
  fontWeight: weight,
  lineHeight: 1.2,
  letterSpacing: -0.02,
  textTransform: 'none',
  color: 'textPrimary',
})
const defaultBodyStyle = (size: number): TypeStyle => ({
  fontFamily: 'Inter',
  fontSize: size,
  fontWeight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
  textTransform: 'none',
  color: 'textPrimary',
})
export const useTypographyStore = create<TypographyState>()(
  persist(
    (set) => ({
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
      display: defaultHeadingStyle(72, 700),
      h1: defaultHeadingStyle(48, 600),
      h2: defaultHeadingStyle(36, 600),
      h3: defaultHeadingStyle(24, 600),
      bodyLarge: defaultBodyStyle(18),
      body: defaultBodyStyle(16),
      bodySmall: defaultBodyStyle(14),
      caption: { ...defaultBodyStyle(12), fontWeight: 500 },
      overline: { ...defaultBodyStyle(11), fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.1 },
      recentFonts: [],
      favoriteFonts: [],
      setHeadingFont: (font) => set((state) => ({
        headingFont: font,
        display: { ...state.display, fontFamily: font },
        h1: { ...state.h1, fontFamily: font },
        h2: { ...state.h2, fontFamily: font },
        h3: { ...state.h3, fontFamily: font },
      })),
      setBodyFont: (font) => set((state) => ({
        bodyFont: font,
        bodyLarge: { ...state.bodyLarge, fontFamily: font },
        body: { ...state.body, fontFamily: font },
        bodySmall: { ...state.bodySmall, fontFamily: font },
        caption: { ...state.caption, fontFamily: font },
        overline: { ...state.overline, fontFamily: font },
      })),
      updateTypeStyle: (level, updates) => set((state) => ({
        [level]: { ...state[level], ...updates },
      })),
      addRecentFont: (font) => set((state) => {
        const filtered = state.recentFonts.filter((f) => f !== font)
        return { recentFonts: [font, ...filtered].slice(0, 10) }
      }),
      toggleFavoriteFont: (font) => set((state) => ({
        favoriteFonts: state.favoriteFonts.includes(font)
          ? state.favoriteFonts.filter((f) => f !== font)
          : [...state.favoriteFonts, font],
      })),
    }),
    { name: 'designforge-typography' }
  )
)