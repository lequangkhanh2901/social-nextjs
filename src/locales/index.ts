import * as en from './en'
import * as vi from './vi'

export const dictionaries = {
  en,
  vi
}

export const getDictionary = (locale: string) =>
  dictionaries[locale as keyof typeof dictionaries]
