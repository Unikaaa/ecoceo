# ✅ Istruzioni Completamento Configuratore

## 🎯 Cosa è stato fatto

### ✅ API Routes completate
- `/api/configurator/sizes` - GET dimensioni (singola o tutte)
- `/api/configurator/decorations` - GET decorazioni (con filtri)
- `/api/configurator/backgrounds` - GET sfondi (singolo o tutti con filtri)
- `/api/configurator/styles/[id]` - GET singolo stile
- `/api/configurator/upload` - POST upload immagini utente

### ✅ Aggiornamenti
- `pricing.ts` - Corretto per usare gli endpoint corretti
- Upload immagini integrato in Step4Customization

---

## 🚧 Da fare manualmente

### 1. **Canvas Editor** (Step 5)

**Opzione A - Fabric.js** (consigliato):
```bash
npm install fabric
```

Poi aggiorna `src/components/configurator/CanvasEditor.tsx`:
- Inizializza canvas con Fabric.js
- Implementa drag & drop
- Implementa resize
- Implementa rotazione

**Opzione B - Konva.js**:
```bash
npm install konva react-konva
```

### 2. **Checkout Stripe personalizzato**

Crea `/api/stripe/checkout-custom/route.ts`:
- Riceve `configurationId` e `totalPrice`
- Crea Stripe Checkout Session
- Passa `configurationId` nei metadata
- Ritorna URL checkout

### 3. **Dashboard Admin**

Crea route `/dashboard/configuratore` con:
- Layout sidebar
- Sezioni per ogni entità (categorie, tipi, stili, etc.)
- CRUD inline
- Drag & drop per ordinamento

**File da creare**:
- `src/app/dashboard/configuratore/page.tsx`
- `src/app/dashboard/configuratore/layout.tsx`
- `src/components/dashboard/configurator/DashboardCategories.tsx`
- `src/components/dashboard/configurator/DashboardProductTypes.tsx`
- `src/components/dashboard/configurator/DashboardStyles.tsx`
- `src/components/dashboard/configurator/DashboardSizes.tsx`
- `src/components/dashboard/configurator/DashboardDecorations.tsx`
- `src/components/dashboard/configurator/DashboardBackgrounds.tsx`

---

## 📋 Checklist Setup

### Database
- [ ] Eseguito `supabase/configurator_schema.sql` su Supabase
- [ ] Verificate tutte le tabelle create
- [ ] Verificato bucket Storage `product-images` esiste

### API
- [x] `/api/configurator/categories` ✅
- [x] `/api/configurator/product-types` ✅
- [x] `/api/configurator/styles` ✅
- [x] `/api/configurator/styles/[id]` ✅
- [x] `/api/configurator/sizes` ✅
- [x] `/api/configurator/decorations` ✅
- [x] `/api/configurator/backgrounds` ✅
- [x] `/api/configurator/upload` ✅
- [x] `/api/configurator/save` ✅
- [ ] `/api/stripe/checkout-custom` ⏳

### Componenti
- [x] Step1Category ✅
- [x] Step2ProductType ✅
- [x] Step3Style ✅
- [x] Step4Customization ✅
- [x] Step5Preview ✅ (placeholder canvas)
- [x] Step6Checkout ✅
- [ ] CanvasEditor (da implementare con Fabric.js/Konva.js) ⏳

### Dashboard
- [ ] Route `/dashboard/configuratore` ⏳
- [ ] CRUD Categorie ⏳
- [ ] CRUD Tipi Prodotto ⏳
- [ ] CRUD Stili ⏳
- [ ] CRUD Dimensioni ⏳
- [ ] CRUD Decorazioni ⏳
- [ ] CRUD Sfondi ⏳

---

## 🔧 Setup Supabase Storage

Se il bucket `product-images` non esiste:

1. Vai su **Supabase Dashboard** → **Storage**
2. Clicca **"New bucket"**
3. Nome: `product-images`
4. Public: ✅ Sì
5. File size limit: 10MB
6. Allowed MIME types: `image/*`

**RLS Policies**:
```sql
-- Policy per upload (service role)
CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'product-images');

-- Policy per lettura pubblica
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

---

## 🧪 Test

### Test API
```bash
# Test categorie
curl http://localhost:3000/api/configurator/categories

# Test dimensioni
curl http://localhost:3000/api/configurator/sizes

# Test upload
curl -X POST http://localhost:3000/api/configurator/upload \
  -F "file=@test.jpg" \
  -F "folder=user-images"
```

### Test Configuratore
1. Vai su `/configura`
2. Completa tutti gli step
3. Verifica salvataggio in Supabase
4. Verifica upload immagini

---

## 📝 Note

- **Upload immagini**: Usa bucket `product-images` su Supabase Storage
- **Pricing**: Calcolo automatico in tempo reale
- **Autosave**: Configurazione salvata ad ogni step
- **Session**: ID salvato in `sessionStorage`

---

## 🚀 Prossimi Step

1. Implementare Canvas Editor (Fabric.js)
2. Creare checkout Stripe personalizzato
3. Implementare Dashboard Admin
4. Test end-to-end completo
