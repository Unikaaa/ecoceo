'use client'

import { useState, useEffect } from 'react'
import ContactModal from './ContactModal'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'in_elaboration' | 'completed'
  created_at: string
  assigned_to?: string | null
  reply_message?: string | null
  replied_at?: string | null
  priority_color?: string
}

export default function ContactsKanban() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contacts')
      const data = await response.json()

      if (response.ok) {
        // Ordina per priorità e data (più vecchi prima)
        const sorted = (data.contacts || []).sort((a: Contact, b: Contact) => {
          // Prima per priorità (red > yellow > green)
          const priorityOrder = { red: 0, yellow: 1, green: 2 }
          const aPriority = priorityOrder[a.priority_color as keyof typeof priorityOrder] ?? 2
          const bPriority = priorityOrder[b.priority_color as keyof typeof priorityOrder] ?? 2
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }
          
          // Poi per data (più vecchi prima)
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
        
        setContacts(sorted)
      }
    } catch (error) {
      console.error('Errore recupero contatti:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getContactsByStatus = (status: 'unread' | 'in_elaboration' | 'completed') => {
    return contacts.filter(c => {
      if (status === 'unread') {
        return c.status === 'unread' || c.status === 'read'
      }
      return c.status === status
    })
  }

  const getPriorityBadge = (priority: string) => {
    const config = {
      red: { bg: 'bg-red-100', text: 'text-red-800', label: 'Priorità Altissima' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Priorità Media' },
      green: { bg: 'bg-green-100', text: 'text-green-800', label: 'Priorità Bassa' },
    }
    const style = config[priority as keyof typeof config] || config.green
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    )
  }

  const getCardBorder = (priority: string, status: string, columnId: string) => {
    // Se è in elaborazione: bordo azzurro completo
    if (columnId === 'in_elaboration' || status === 'in_elaboration') {
      return 'border-2 border-blue-400'
    }
    // Se è completato: bordo verde completo
    if (columnId === 'completed' || status === 'completed') {
      return 'border-2 border-green-400'
    }
    // Altrimenti: bordo completo colorato per priorità (più sottile)
    const borders = {
      red: 'border-2 border-red-400',
      yellow: 'border-2 border-yellow-400',
      green: 'border-2 border-green-400',
    }
    return borders[priority as keyof typeof borders] || borders.green
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getShortMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedContact(null)
  }

  const handleModalUpdate = (updatedContact?: Contact) => {
    fetchContacts()
    if (updatedContact) {
      setSelectedContact((prev) => {
        if (!prev || prev.id !== updatedContact.id) return prev
        return { ...prev, ...updatedContact }
      })
    }
  }

  const handleDeleteContact = async (id: string) => {
    const confirmed = window.confirm('Eliminare definitivamente questo messaggio?')
    if (!confirmed) return

    try {
      const response = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        alert('Errore durante eliminazione messaggio')
        return
      }

      await fetchContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(null)
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Errore eliminazione messaggio:', error)
      alert('Errore durante eliminazione messaggio')
    }
  }

  const columns = [
    {
      id: 'unread' as const,
      title: 'Da Leggere',
      contacts: getContactsByStatus('unread'),
      bgColor: 'bg-white',
    },
    {
      id: 'in_elaboration' as const,
      title: 'In Elaborazione Messaggio',
      contacts: getContactsByStatus('in_elaboration'),
      bgColor: 'bg-blue-50',
    },
    {
      id: 'completed' as const,
      title: 'Completato',
      contacts: getContactsByStatus('completed'),
      bgColor: 'bg-green-50',
    },
  ]

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Caricamento contatti...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-gray-900 mb-2">Contatti</h2>
        <p className="text-gray-600">Gestisci i messaggi ricevuti dai clienti</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.bgColor} rounded-2xl p-3.5 sm:p-4 lg:p-4 lg:min-h-[600px] border border-gray-200/70`}
          >
            {/* Column Header */}
            <div className="mb-3 pb-3 sm:mb-4 sm:pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                    {column.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-gray-700">{column.contacts.length}</span>
                    <span className="text-xs sm:text-sm text-gray-600">
                  {column.contacts.length === 1 ? 'messaggio' : 'messaggi'}
                    </span>
                  </div>
                </div>

                {/* Badge per tutte le colonne */}
                <div className="shrink-0">
                  {column.id === 'unread' && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] sm:text-xs font-medium">
                      Da Leggere
                    </span>
                  )}
                  {column.id === 'in_elaboration' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-[11px] sm:text-xs font-medium">
                      In Elaborazione
                    </span>
                  )}
                  {column.id === 'completed' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-[11px] sm:text-xs font-medium inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completato
                    </span>
                  )}
                </div>
              </div>
              {/* Badge per tutte le colonne */}
            </div>

            {/* Contacts List */}
            <div className="space-y-3">
              {column.contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Nessun messaggio
                </div>
              ) : (
                column.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                    className={`bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-lg transition-all cursor-pointer ${getCardBorder(contact.priority_color || 'green', contact.status, column.id)}`}
                  >
                    {/* Header con Priority Badge e Data */}
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex-1">
                        {/* Priority Badge */}
                        <div className="mb-2">
                          {getPriorityBadge(contact.priority_color || 'green')}
                        </div>
                        {/* Nome e Email */}
                        <h4 className="font-semibold text-gray-900 mb-1">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      {/* Data in alto a destra */}
                      <div className="text-right ml-3">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(contact.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-900">{contact.subject}</p>
                    </div>

                    {/* Short Message */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {getShortMessage(contact.message)}
                      </p>
                    </div>

                    {/* Footer con Assigned To o Completed Badge */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      {(contact.assigned_to || contact.status === 'completed') && (
                        <>
                        {contact.assigned_to && contact.status === 'completed' && (
                          <p className="text-xs text-green-700 font-medium">
                            Eseguito da: <span className="font-semibold">{contact.assigned_to}</span>
                          </p>
                        )}
                        {contact.assigned_to && contact.status !== 'completed' && (
                          <p className="text-xs text-blue-700 font-medium">
                            In elaborazione da: <span className="font-semibold">{contact.assigned_to}</span>
                          </p>
                        )}
                        {contact.status === 'completed' && (
                          <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Risposta inviata
                          </div>
                        )}
                        </>
                      )}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteContact(contact.id)
                          }}
                          className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleModalUpdate}
      />
    </div>
  )
}
