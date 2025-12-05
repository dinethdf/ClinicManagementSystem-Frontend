export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'si', 'other'],
  langDirection: {
    en: 'ltr',
    si: 'ltr',
    other: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
