'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Product } from '@/lib/data/mockProducts'
import { useCartStore } from '@/lib/store/cartStore'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
}

export default function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem(product, quantity)
    
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    setIsAdding(false)
    // TODO: Show toast notification
  }

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleAddToCart}
      disabled={!product.inStock || isAdding}
      className="w-full"
    >
      {isAdding ? 'Aggiungendo...' : 'Aggiungi al Carrello'}
    </Button>
  )
}
