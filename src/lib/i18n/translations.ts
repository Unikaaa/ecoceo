import { Locale, Messages } from './types'
import itMessages from '../../../messages/it.json'
import enMessages from '../../../messages/en.json'
import esMessages from '../../../messages/es.json'
import rsMessages from '../../../messages/rs.json'
import cnMessages from '../../../messages/cn.json'

const messages: Record<Locale, Messages> = {
  it: itMessages,
  en: enMessages,
  es: esMessages,
  rs: rsMessages,
  cn: cnMessages,
}

export function getMessages(locale: Locale): Messages {
  return messages[locale] || messages.it
}

export function getNestedTranslation(messages: Messages, key: string): string {
  const keys = key.split('.')
  let value: any = messages

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}
