'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { Locale } from '@/lib/i18n/types'

const locales: { code: Locale; label: string }[] = [
  { code: 'it', label: 'IT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'rs', label: 'RS' },
  { code: 'cn', label: 'CN' },
]

export default function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = (params.locale as Locale) || 'it'

  const handleLocaleChange = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleLocaleChange(e.target.value as Locale)}
      className="text-sm border-none bg-transparent cursor-pointer focus:outline-none"
    >
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.label}
        </option>
      ))}
    </select>
  )
}
