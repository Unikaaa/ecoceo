export type Locale = 'it' | 'en' | 'es' | 'rs' | 'cn'

export interface Messages {
  [key: string]: string | Messages
}
