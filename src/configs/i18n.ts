export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'si'],
  langDirection: {
    en: 'ltr',
    si: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
