# PROMPT 3 – COMPONENTI UI BASE

## Obiettivo
Creare componenti UI riutilizzabili in `/components/ui` con TypeScript e Tailwind.

## Componenti da Creare

### 1. Button
**File**: `components/ui/Button.tsx`

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}
```

**Varianti**:
- `primary`: Colore principale, solido
- `secondary`: Colore secondario
- `outline`: Bordo, sfondo trasparente
- `ghost`: Solo hover effect

### 2. Input
**File**: `components/ui/Input.tsx`

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'number' | 'password'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  label?: string
  required?: boolean
  className?: string
}
```

### 3. Select
**File**: `components/ui/Select.tsx`

**Props**:
```typescript
interface SelectProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
}
```

### 4. Modal
**File**: `components/ui/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

**Funzionalità**:
- Overlay con backdrop
- Chiusura con ESC o click fuori
- Animazione fade in/out
- Focus trap per accessibilità

## Struttura
```
components/
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── Select.tsx
    ├── Modal.tsx
    └── index.ts          # Export barrel
```

## Best Practices
- TypeScript strict types
- Tailwind per styling
- Accessibilità (ARIA, keyboard navigation)
- Responsive design
- Varianti coerenti con design system
