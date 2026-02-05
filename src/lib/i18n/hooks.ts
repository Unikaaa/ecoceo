'use client'

import { Locale } from './types'
import { getMessages, getNestedTranslation } from './translations'

export function useLocale(): Locale {
  // Always return Italian as default since we removed locale routing
  // You can implement cookie/localStorage based locale selection here if needed
  return 'it'
}

export function useTranslations(namespace?: string) {
  const locale = useLocale()
  const messages = getMessages(locale)

  return (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return getNestedTranslation(messages, fullKey)
  }
}
