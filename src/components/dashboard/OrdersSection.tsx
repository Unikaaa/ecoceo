'use client'

export default function OrdersSection() {
  return (
    <section id="orders" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-gray-900 mb-1">Ordini</h2>
        <p className="text-sm text-gray-600">Visualizza e gestisci ordini</p>
      </div>

      {/* Filtri */}
      <div className="flex gap-3 mb-6">
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] text-sm">
          <option>Tutti gli ordini</option>
          <option>Open</option>
          <option>Closed</option>
          <option>Completed</option>
        </select>
        <input
          type="search"
          placeholder="Cerca ordine..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] text-sm"
        />
      </div>

      {/* Lista ordini */}
      <div className="space-y-3">
        <div className="text-sm text-gray-500 text-center py-8">
          Lista ordini verrà caricata da Supabase
        </div>
      </div>
    </section>
  )
}
