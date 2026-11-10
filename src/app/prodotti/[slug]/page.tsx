import { redirect } from 'next/navigation'

export default function ProductAliasPage({
  params,
}: {
  params: { slug: string }
}) {
  redirect(`/shop/${params.slug}`)
}
