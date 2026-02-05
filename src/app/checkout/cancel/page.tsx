import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-4">
            Pagamento Annullato
          </h1>
          <p className="text-gray-600 mb-8">
            Il tuo ordine non è stato completato. I prodotti nel carrello sono ancora disponibili.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/cart">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Torna al Carrello
            </Button>
          </Link>
          <Link href="/shop" className="block text-gray-600 hover:text-primary transition">
            Continua lo Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
