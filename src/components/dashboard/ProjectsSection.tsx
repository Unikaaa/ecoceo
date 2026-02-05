'use client'

import { useState } from 'react'

export default function ProjectsSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="projects" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-1">Progetti</h2>
          <p className="text-sm text-gray-600">Gestisci progetti personalizzati</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
        >
          {isOpen ? 'Chiudi' : 'Nuovo Progetto'}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Progetto
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                placeholder="Nome progetto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
            <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                placeholder="Descrizione progetto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stato
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]">
                  <option>In lavorazione</option>
                  <option>Da creare</option>
                  <option>Pronto alla spedizione</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  placeholder="Nome cliente"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                Salva Progetto
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista progetti */}
      <div className="mt-6">
        <div className="text-sm text-gray-500 text-center py-8">
          Lista progetti verrà caricata da Supabase
        </div>
      </div>
    </section>
  )
}
