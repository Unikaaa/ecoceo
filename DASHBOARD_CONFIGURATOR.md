# 🛠️ Dashboard Admin - Configuratore UNIKA

## 📋 Panoramica

Dashboard ultra-semplice per gestire tutti gli elementi del configuratore:
- CRUD inline
- Drag & drop per ordinamento
- Toggle ON/OFF
- Autosave silenzioso
- Zero navigazione complessa

---

## 🎯 Principi di Design

### 1. **CRUD Inline**
- Modifica diretta nelle tabelle/card
- Nessuna pagina separata per edit
- Modali solo quando necessario

### 2. **Velocità**
- Autosave automatico
- Feedback immediato
- Nessun click inutile

### 3. **Semplicità**
- Un solo schermo per sezione
- Toggle invece di checkbox
- Duplica invece di ricreare

---

## 📁 Struttura Dashboard

### Route: `/dashboard/configuratore`

```
/dashboard/configuratore
├── /categorie          # Gestione categorie
├── /tipi-prodotto      # Gestione tipi prodotto
├── /stili              # Gestione stili
├── /dimensioni          # Gestione dimensioni e prezzi
├── /decorazioni         # Gestione decorazioni
├── /sfondi              # Gestione sfondi
└── /configurazioni      # Visualizza configurazioni salvate
```

---

## 🎨 Componenti Dashboard

### 1. **Categorie** (`/dashboard/configuratore/categorie`)

**Vista**: Lista a card con drag & drop

**Campi**:
- Nome (editable inline)
- Slug (auto-generato)
- Descrizione (textarea inline)
- Icona (upload)
- Immagine (upload)
- Toggle Attivo/Disattivo
- Ordine (drag handle)

**Azioni**:
- ➕ Aggiungi nuova categoria
- ✏️ Modifica inline
- 🗑️ Elimina (con conferma)
- 📋 Duplica
- 🔄 Drag per ordinare

**Componente**: `DashboardCategories.tsx`

---

### 2. **Tipi Prodotto** (`/dashboard/configuratore/tipi-prodotto`)

**Vista**: Lista a card filtrata per categoria

**Campi**:
- Nome (editable inline)
- Categoria (select dropdown)
- Thumbnail (upload)
- Descrizione (textarea inline)
- Toggle Attivo/Disattivo
- Ordine (drag handle)

**Azioni**:
- ➕ Aggiungi nuovo tipo
- ✏️ Modifica inline
- 🗑️ Elimina
- 📋 Duplica
- 🔄 Drag per ordinare

**Componente**: `DashboardProductTypes.tsx`

---

### 3. **Stili** (`/dashboard/configuratore/stili`)

**Vista**: Grid di card con preview

**Campi**:
- Nome (editable inline)
- Preview (upload)
- Prezzo extra (input numerico)
- Descrizione (textarea inline)
- Toggle Attivo/Disattivo
- Ordine (drag handle)

**Azioni**:
- ➕ Aggiungi nuovo stile
- ✏️ Modifica inline
- 🗑️ Elimina
- 📋 Duplica

**Componente**: `DashboardStyles.tsx`

---

### 4. **Dimensioni** (`/dashboard/configuratore/dimensioni`)

**Vista**: Tabella editabile

**Campi**:
- Nome (editable)
- Larghezza (cm) - input numerico
- Altezza (cm) - input numerico
- Prezzo base (€) - input numerico
- Toggle Attivo/Disattivo
- Ordine (drag handle)

**Azioni**:
- ➕ Aggiungi nuova dimensione
- ✏️ Modifica inline nella tabella
- 🗑️ Elimina riga
- 📋 Duplica riga

**Componente**: `DashboardSizes.tsx`

---

### 5. **Decorazioni** (`/dashboard/configuratore/decorazioni`)

**Vista**: Grid con preview immagini

**Campi**:
- Nome (editable inline)
- Immagine (upload drag & drop)
- Stile associato (select)
- Categoria associata (select)
- Prezzo extra (input numerico)
- Toggle Attivo/Disattivo
- Ordine (drag handle)

**Azioni**:
- ➕ Aggiungi decorazione
- 📤 Upload multiplo (drag & drop)
- ✏️ Modifica inline
- 🗑️ Elimina
- 📋 Duplica

**Componente**: `DashboardDecorations.tsx`

---

### 6. **Sfondi** (`/dashboard/configuratore/sfondi`)

**Vista**: Grid con preview immagini

**Campi**:
- Nome (editable inline)
- Immagine (upload drag & drop)
- Stile associato (select)
- Categoria associata (select)
- Prezzo extra (input numerico)
- Toggle Attivo/Disattivo
- Ordine (drag handle)

**Azioni**:
- ➕ Aggiungi sfondo
- 📤 Upload multiplo (drag & drop)
- ✏️ Modifica inline
- 🗑️ Elimina
- 📋 Duplica

**Componente**: `DashboardBackgrounds.tsx`

---

### 7. **Configurazioni** (`/dashboard/configuratore/configurazioni`)

**Vista**: Tabella con filtri

**Mostra**:
- Data creazione
- Categoria
- Tipo prodotto
- Stile
- Prezzo totale
- Status (draft, completed, paid)
- Link Stripe (se pagato)

**Azioni**:
- 👁️ Visualizza dettagli
- 📥 Esporta JSON
- 🗑️ Elimina (solo draft)

**Componente**: `DashboardConfigurations.tsx`

---

## 🔧 Funzionalità Comuni

### Autosave
- Salvataggio automatico dopo 2 secondi di inattività
- Indicatore visivo "Salvato" / "Salvataggio..."
- Nessun bottone "Salva" necessario

### Drag & Drop
- Libreria: `@dnd-kit/core` o `react-beautiful-dnd`
- Salvataggio automatico ordine
- Feedback visivo durante drag

### Upload Immagini
- Drag & drop
- Multi-upload
- Preview immediata
- Compressione automatica (opzionale)
- Upload su Supabase Storage

### Toggle Switch
- Componente custom con animazione
- Salvataggio immediato
- Feedback visivo

---

## 📝 Esempio Componente

```tsx
// DashboardCategories.tsx
'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'

export default function DashboardCategories() {
  const [categories, setCategories] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  // Autosave dopo modifiche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (categories.length > 0) {
        saveCategories()
      }
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [categories])

  const saveCategories = async () => {
    setIsSaving(true)
    // API call
    setIsSaving(false)
  }

  // Drag & drop handlers
  // Inline edit handlers
  // Toggle handlers

  return (
    <div>
      {/* Lista categorie con drag & drop */}
    </div>
  )
}
```

---

## 🎨 Design System

### Colori
- Primary: `#663399` (viola)
- Success: `#10b981` (verde)
- Danger: `#ef4444` (rosso)
- Warning: `#f59e0b` (arancione)

### Componenti UI
- Toggle Switch animato
- Input inline editabile
- Card con hover effects
- Modali minimali
- Toast notifications

---

## ✅ Checklist Implementazione

- [ ] Route `/dashboard/configuratore`
- [ ] Layout dashboard configuratore
- [ ] Componente Categorie
- [ ] Componente Tipi Prodotto
- [ ] Componente Stili
- [ ] Componente Dimensioni
- [ ] Componente Decorazioni
- [ ] Componente Sfondi
- [ ] Componente Configurazioni
- [ ] Autosave implementato
- [ ] Drag & drop funzionante
- [ ] Upload immagini funzionante
- [ ] Toggle switch implementato

---

## 🚀 Prossimi Step

1. Implementare componenti dashboard uno per uno
2. Integrare drag & drop
3. Implementare autosave
4. Aggiungere validazioni
5. Testare flusso completo
