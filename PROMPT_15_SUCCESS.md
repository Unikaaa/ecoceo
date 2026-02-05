# PROMPT 15 – PAGINA SUCCESSO ORDINE

## Obiettivo
Creare pagina di conferma ordine con riepilogo, messaggio di successo e numero ordine.

## Route
`app/[locale]/checkout/success/page.tsx`

## Funzionalità

### 1. Riepilogo Ordine
- **Numero ordine**: Formattato (es. ORD-20240115-0001)
- **Items**: Lista prodotti ordinati
- **Totale**: Prezzo totale
- **Data ordine**: Formattata
- **Stato**: "Confermato" / "In elaborazione"

### 2. Messaggio Successo
- **Titolo**: "Ordine Confermato!"
- **Messaggio**: Ringraziamento e prossimi passi
- **Icona**: Check verde

### 3. Informazioni Aggiuntive
- **Email conferma**: "Riceverai una email a breve"
- **Tracking**: Link a pagina tracking (futuro)
- **Supporto**: Link contatti

## Dati

### Query Params
- `session_id`: Stripe session ID
- `order_id`: ID ordine (opzionale)

### Fetch Ordine
- **Da session_id**: Recupera ordine associato
- **Da order_id**: Recupera ordine diretto
- **Fallback**: Mostra messaggio generico

## Componenti

### OrderSummary
- Lista items
- Prezzi e quantità
- Totale

### OrderDetails
- Numero ordine
- Data
- Stato
- Email

### NextSteps
- CTA "Continua Shopping"
- Link "Traccia Ordine"
- Link "Contatti"

## Design
- **Layout**: Centrato, pulito
- **Colori**: Verde per successo
- **Spacing**: Generoso
- **Mobile-friendly**

## Note
- Gestire caso ordine non trovato
- Loading state durante fetch
- Error handling
- SEO: noindex per pagina successo
