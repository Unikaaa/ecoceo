# 🎯 ISTRUZIONI SETUP SISTEMA CONTATTI KANBAN

## 📋 OVERVIEW
Sistema di gestione contatti con tre colonne (Kanban):
- **Da Leggere**: Email non ancora gestite
- **In Elaborazione Messaggio**: Email in fase di risposta
- **Completato**: Email con risposta inviata

## 🗄️ STEP 1: AGGIORNAMENTO DATABASE SUPABASE

### 1.1 Esegui lo script SQL

1. Vai su **Supabase Dashboard** → **SQL Editor**
2. Crea una nuova query
3. Copia e incolla il contenuto di `supabase/update_contacts_table.sql`
4. Clicca **Run** (o premi `Cmd/Ctrl + Enter`)

### 1.2 Verifica le modifiche

Esegui questa query per verificare che tutto sia stato creato correttamente:

```sql
-- Verifica colonne aggiunte
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;

-- Verifica enum aggiornato
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'contact_status')
ORDER BY enumsortorder;

-- Verifica trigger
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'contacts';
```

Dovresti vedere:
- ✅ Colonne: `assigned_to`, `reply_message`, `replied_at`, `priority_color`
- ✅ Enum: `unread`, `read`, `in_elaboration`, `completed`
- ✅ Trigger: `update_contact_priority`

## 📧 STEP 2: CONFIGURAZIONE INVIO EMAIL (OPZIONALE)

### 2.1 Servizi Email Consigliati

Il sistema è pronto per l'invio email, ma attualmente salva solo nel database. Per inviare email reali, puoi integrare:

**Opzione A: Resend** (Consigliato)
```bash
npm install resend
```

**Opzione B: SendGrid**
```bash
npm install @sendgrid/mail
```

**Opzione C: Nodemailer**
```bash
npm install nodemailer
```

### 2.2 Configurazione Resend (Esempio)

1. Crea account su [resend.com](https://resend.com)
2. Ottieni API key
3. Aggiungi a `.env.local`:
```env
RESEND_API_KEY=re_xxxxx
```

4. Modifica `src/app/api/contacts/reply/route.ts`:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Nel POST handler, dopo aver recuperato il contatto:
await resend.emails.send({
  from: 'noreply@tudominio.com',
  to: contact.email,
  subject: `Re: ${contact.subject}`,
  text: replyMessage,
})
```

## 🎨 STEP 3: FUNZIONALITÀ IMPLEMENTATE

### 3.1 Tre Colonne Kanban

- **Da Leggere**: Email con status `unread` o `read`
- **In Elaborazione**: Email con status `in_elaboration`
- **Completato**: Email con status `completed`

### 3.2 Sistema Priorità (Semaforo)

- 🔴 **Rosso** (Alta Priorità): Email più vecchie di 7 giorni
- 🟡 **Giallo** (Media Priorità): Email tra 3 e 7 giorni
- 🟢 **Verde** (Bassa Priorità): Email meno di 3 giorni

La priorità viene calcolata automaticamente dal trigger SQL.

### 3.3 Modal Email

Cliccando su un'email si apre un modal fullscreen con:
- Informazioni complete del cliente
- Messaggio originale
- Form di risposta (se non completato)
- Visualizzazione risposta inviata (se completato)

### 3.4 Workflow Risposta

1. **Clicca "Rispondi"** → Apre form con:
   - Campo "Nome" (obbligatorio) - chi sta rispondendo
   - Campo "Messaggio" (obbligatorio) - testo risposta

2. **Salva Bozza** → Salva senza inviare, sposta in "In Elaborazione"

3. **Invia Messaggio** → Mostra conferma:
   - "Sei sicuro di inviare l'email?"
   - Se Sì: invia e sposta in "Completato"
   - Se No: torna indietro mantenendo il testo

### 3.5 Indicatori Visivi

- **In Elaborazione**: Bordo azzurro, badge "In Elaborazione"
- **Completato**: Badge verde con spunta ✓
- **Priorità**: Bordo sinistro colorato (rosso/giallo/verde) + badge

### 3.6 Ordinamento

- Prima per priorità (rosso → giallo → verde)
- Poi per data (più vecchi prima)

## 🔧 STEP 4: VERIFICA FUNZIONAMENTO

### 4.1 Test Locale

1. Avvia il server:
```bash
npm run dev
```

2. Vai su `http://localhost:3000/dashboard/contacts`

3. Testa il flusso:
   - Clicca su un'email in "Da Leggere"
   - Clicca "Rispondi"
   - Inserisci nome e messaggio
   - Salva bozza → Verifica che si sposti in "In Elaborazione"
   - Apri di nuovo l'email → Verifica che il testo sia salvato
   - Invia messaggio → Verifica che si sposti in "Completato"

### 4.2 Verifica Database

```sql
-- Controlla contatti con priorità
SELECT 
  name,
  email,
  status,
  priority_color,
  assigned_to,
  created_at,
  EXTRACT(DAY FROM (NOW() - created_at)) as giorni_passati
FROM contacts
ORDER BY 
  CASE priority_color
    WHEN 'red' THEN 1
    WHEN 'yellow' THEN 2
    WHEN 'green' THEN 3
  END,
  created_at ASC;
```

## ⚠️ NOTE IMPORTANTI

1. **Invio Email**: Attualmente il sistema salva solo nel database. Per inviare email reali, integra un servizio email (vedi Step 2).

2. **Priorità**: I giorni per le priorità sono configurabili modificando il trigger SQL in `supabase/update_contacts_table.sql`:
   ```sql
   -- Modifica questi valori:
   IF days_passed > 7 THEN  -- Rosso: più di 7 giorni
   ELSIF days_passed >= 3 THEN  -- Giallo: tra 3 e 7 giorni
   ```

3. **RLS Policies**: Assicurati che le RLS policies su `contacts` permettano lettura/scrittura con `service_role_key`.

## 🎯 PROSSIMI PASSI

- [ ] Integrare servizio email reale (Resend/SendGrid)
- [ ] Aggiungere notifiche quando un'email viene assegnata
- [ ] Aggiungere filtri avanzati (per data, priorità, assegnato a)
- [ ] Aggiungere statistiche (tempo medio risposta, email per giorno)
