import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LinePage from '@/components/lines/LinePage'
import { getLineBySlug } from '@/lib/lines'

const line = getLineBySlug('custom')

export const metadata: Metadata = {
  title: line?.name ?? 'UNIKA',
  description: line?.description,
}

export default function Page() {
  if (!line) notFound()
  return <LinePage line={line} />
}
