'use client'

import { useState } from 'react'

export default function BrandSection() {
  const [activeTab, setActiveTab] = useState<'seo' | 'scripts' | 'settings'>('seo')

  return (
    <section id="brand" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-gray-900 mb-1">Brand & SEO</h2>
        <p className="text-sm text-gray-600">Gestisci SEO, script e impostazioni brand</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'seo'
                ? 'border-[#663399] text-[#663399]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'scripts'
                ? 'border-[#663399] text-[#663399]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Script
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#663399] text-[#663399]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Impostazioni
          </button>
        </div>
      </div>

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="UNIKA - Ceramiche Artistiche"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="Descrizione per SEO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (separate da virgola)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="ceramica, arte, artigianato"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Open Graph Image URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="https://..."
            />
          </div>

          <button className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium">
            Salva SEO
          </button>
        </div>
      )}

      {/* Scripts Tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Script Head (Google Analytics, etc.)
            </label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] font-mono text-sm"
              placeholder="<!-- Script da inserire in <head> -->"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Script Body (prima di &lt;/body&gt;)
            </label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] font-mono text-sm"
              placeholder="<!-- Script da inserire prima di </body> -->"
            />
          </div>

          <button className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium">
            Salva Script
          </button>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Brand
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="UNIKA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Contatti
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="info@unika-ceramiche.it"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefono
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="+39 123 456 7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indirizzo
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="Indirizzo completo"
            />
          </div>

          <button className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium">
            Salva Impostazioni
          </button>
        </div>
      )}
    </section>
  )
}
