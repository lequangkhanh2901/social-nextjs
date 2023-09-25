import * as en from './en'
import * as vi from './vi'

export const dictionaries = {
  defaultLocale: 'vi',
  locales: {
    en,
    vi
  },
  languages: [
    {
      key: 'en',
      label: 'EN'
    },
    {
      key: 'vi',
      label: 'VI'
    }
  ]
}

export const DEFAULT_LOCALE = 'en'

export const getDictionary = (locale: string) =>
  dictionaries.locales[locale as keyof typeof dictionaries.locales]
