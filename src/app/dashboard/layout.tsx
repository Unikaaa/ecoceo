export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout senza Header e Footer per dashboard admin
  return <>{children}</>
}
