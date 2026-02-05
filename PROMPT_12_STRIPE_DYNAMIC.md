# PROMPT 12 – STRIPE CHECKOUT DINAMICO

## Obiettivo
Creare Stripe Checkout con prezzo dinamico per prodotto personalizzato, inviando configurazione e immagini come metadata.

## Funzionalità

### 1. Prezzo Dinamico
- **Calcolo basato su**: Base price + opzioni personalizzate
- **Esempio**: Base €50 + colore €10 + dimensione €15 = €75
- **Validazione** lato server

### 2. Metadata Stripe
- **Configurazione prodotto**: JSON stringificato
- **URL immagini**: Array di URL immagini caricate
- **User info**: ID utente (se disponibile)
- **Tipo ordine**: "custom" vs "standard"

### 3. Line Items Dinamici
```typescript
{
  price_data: {
    currency: 'eur',
    product_data: {
      name: 'Prodotto Personalizzato',
      description: 'Configurazione: ...',
      images: [url1, url2, ...]
    },
    unit_amount: calculatedPrice * 100
  },
  quantity: 1
}
```

## API Route

### `/api/stripe/checkout-custom/route.ts`
- **Input**: Configurazione prodotto, immagini, prezzo
- **Validazione**: Prezzo e configurazione
- **Stripe Session**: Con metadata esteso
- **Response**: Checkout URL

## Struttura Metadata
```typescript
{
  order_type: 'custom',
  configuration: string, // JSON
  image_urls: string, // JSON array
  base_price: number,
  customizations: string // JSON
}
```

## Note
- Validazione prezzo lato server
- Sanitizzazione configurazione
- Limite dimensione metadata (Stripe: 500 caratteri per key)
- Usare session metadata per dati estesi
