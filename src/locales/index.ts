import en from './en.json'
import vi from './vi.json'

export const dictionaries = {
  en,
  vi
}

export const getDictionary = (locale: string) =>
  dictionaries[locale as keyof typeof dictionaries]
