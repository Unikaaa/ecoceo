'use client'

import { useState, useEffect } from 'react'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'completed'
  created_at: string
}

interface ContactsStats {
  unread: number
  read: number
  completed: number
}

export default function ContactsSection() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<ContactsStats>({ unread: 0, read: 0, completed: 0 })
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [filter])

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const url = filter === 'all' 
        ? '/api/contacts'
        : `/api/contacts?status=${filter}`
      
      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setContacts(data.contacts || [])
        setStats(data.stats || { unread: 0, read: 0, completed: 0 })
      }
    } catch (error) {
      console.error('Errore recupero contatti:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateContactStatus = async (id: string, newStatus: 'unread' | 'read' | 'completed') => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        fetchContacts() // Ricarica i contatti
        // Notifica il badge per aggiornarsi
        window.dispatchEvent(new CustomEvent('contactsUpdated'))
      }
    } catch (error) {
      console.error('Errore aggiornamento contatto:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Contatti</h2>
        <p className="text-gray-600">Gestisci i messaggi ricevuti dai clienti</p>
      </div>

      {/* Filtri e Contatori */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
            filter === 'all'
              ? 'bg-[#663399] text-white shadow-md hover:bg-[#552288]'
              : 'bg-gray-100 text-[#663399] hover:bg-gray-200 hover:text-[#552288]'
          }`}
        >
          Tutti
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            filter === 'unread'
              ? 'bg-[#663399] text-white shadow-md hover:bg-[#552288]'
              : 'bg-gray-100 text-[#663399] hover:bg-gray-200 hover:text-[#552288]'
          }`}
        >
          Non letti
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
            filter === 'unread'
              ? 'bg-white/30 text-white'
              : 'bg-[#663399]/20 text-[#663399]'
          }`}>
            {stats.unread}
          </span>
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            filter === 'read'
              ? 'bg-[#663399] text-white shadow-md hover:bg-[#552288]'
              : 'bg-gray-100 text-[#663399] hover:bg-gray-200 hover:text-[#552288]'
          }`}
        >
          Letti
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
            filter === 'read'
              ? 'bg-white/30 text-white'
              : 'bg-[#663399]/20 text-[#663399]'
          }`}>
            {stats.read}
          </span>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            filter === 'completed'
              ? 'bg-[#663399] text-white shadow-md hover:bg-[#552288]'
              : 'bg-gray-100 text-[#663399] hover:bg-gray-200 hover:text-[#552288]'
          }`}
        >
          Completati
          <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold ${
            filter === 'completed'
              ? 'bg-white/30 text-white'
              : 'bg-[#663399]/20 text-[#663399]'
          }`}>
            {stats.completed}
          </span>
        </button>
      </div>

      {/* Lista Contatti */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Caricamento...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nessun contatto {filter !== 'all' ? `con stato "${filter}"` : ''}
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`border rounded-lg p-4 transition-all ${
                contact.status === 'unread'
                  ? 'border-[#663399] bg-[#663399]/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        contact.status === 'unread'
                          ? 'bg-[#663399] text-white'
                          : contact.status === 'read'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {contact.status === 'unread'
                        ? 'Non letto'
                        : contact.status === 'read'
                        ? 'Letto'
                        : 'Completato'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong> {contact.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Oggetto:</strong> {contact.subject}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(contact.created_at)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {contact.status !== 'read' && (
                    <button
                      onClick={() => updateContactStatus(contact.id, 'read')}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Segna letto
                    </button>
                  )}
                  {contact.status !== 'completed' && (
                    <button
                      onClick={() => updateContactStatus(contact.id, 'completed')}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Completa
                    </button>
                  )}
                  {contact.status !== 'unread' && (
                    <button
                      onClick={() => updateContactStatus(contact.id, 'unread')}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Non letto
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
