export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  
  return `ORD-${year}${month}${day}-${random}`
}

export function formatOrderNumber(orderNumber: string): string {
  return orderNumber
}
