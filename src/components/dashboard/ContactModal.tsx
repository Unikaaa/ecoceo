'use client'

import { useState, useEffect } from 'react'

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

interface ContactModalProps {
  contact: Contact | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedContact?: Contact) => void
}

export default function ContactModal({ contact, isOpen, onClose, onUpdate }: ContactModalProps) {
  const [currentContact, setCurrentContact] = useState<Contact | null>(contact)
  const [assignedTo, setAssignedTo] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (contact) {
      setCurrentContact(contact)
      setAssignedTo(contact.assigned_to || '')
      setReplyMessage(contact.reply_message || '')
      setIsAssigning(false)
      setShowConfirmDialog(false)
    }
  }, [contact])

  if (!isOpen || !currentContact) return null

  const handleTakeInCharge = async (closeAfterMove: boolean = false) => {
    if (!assignedTo.trim()) {
      alert('Inserisci il nome di chi prende in carico il messaggio')
      return
    }

    setIsAssigning(true)
    try {
      const response = await fetch('/api/contacts/reply', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: currentContact.id,
          assignedTo: assignedTo.trim(),
          replyMessage: replyMessage.trim(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCurrentContact(result.contact)
        onUpdate(result.contact)
        if (closeAfterMove) {
          onClose()
        }
      } else {
        alert('Errore durante la presa in carico')
      }
    } catch (error) {
      console.error('Errore presa in carico:', error)
      alert('Errore durante la presa in carico')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!assignedTo.trim()) {
      alert('Inserisci il tuo nome per salvare la bozza')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/contacts/reply', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: currentContact.id,
          assignedTo: assignedTo.trim(),
          replyMessage: replyMessage.trim(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCurrentContact(result.contact)
        onUpdate(result.contact)
        onClose()
      }
    } catch (error) {
      console.error('Errore salvataggio bozza:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendReply = async () => {
    if (!assignedTo.trim() || !replyMessage.trim()) {
      alert('Nome e messaggio di risposta sono obbligatori')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/contacts/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: currentContact.id,
          assignedTo: assignedTo.trim(),
          replyMessage: replyMessage.trim(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setCurrentContact(result.contact)
        onUpdate(result.contact)
        onClose()
      }
    } catch (error) {
      console.error('Errore invio risposta:', error)
    } finally {
      setIsSaving(false)
      setShowConfirmDialog(false)
    }
  }

  const handleConfirmSend = () => {
    setShowConfirmDialog(true)
  }

  const isReadOnly = currentContact.status === 'completed'
  const canReply = currentContact.status === 'unread' || currentContact.status === 'read' || currentContact.status === 'in_elaboration'
  const isUnreadFlow = currentContact.status === 'unread' || currentContact.status === 'read'
  const shouldShowReplyComposer = currentContact.status === 'in_elaboration'

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-gray-900 mb-1">{currentContact.subject}</h2>
              <p className="text-sm text-gray-600">
                Da: {currentContact.name} ({currentContact.email})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-black hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Info Contatto */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Data invio:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(currentContact.created_at).toLocaleString('it-IT')}
                  </span>
                </div>
                {currentContact.assigned_to && currentContact.status === 'completed' && (
                  <div>
                    <span className="text-gray-600">Eseguito da:</span>
                    <span className="ml-2 font-medium text-[#663399]">{currentContact.assigned_to}</span>
                  </div>
                )}
                {currentContact.assigned_to && currentContact.status !== 'completed' && (
                  <div>
                    <span className="text-gray-600">In elaborazione da:</span>
                    <span className="ml-2 font-medium text-[#663399]">{currentContact.assigned_to}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Messaggio Originale */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Messaggio del Cliente</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{currentContact.message}</p>
              </div>
            </div>

            {/* Risposta (se completato) */}
            {isReadOnly && currentContact.reply_message && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Risposta Inviata</h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentContact.reply_message}</p>
                  {currentContact.replied_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Inviata il: {new Date(currentContact.replied_at).toLocaleString('it-IT')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Form Risposta (se non completato) */}
            {canReply && (
              <div className="mb-6">
                {isUnreadFlow ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Il tuo nome * <span className="text-xs text-gray-500">(obbligatorio per prendere in carico)</span>
                      </label>
                      <input
                        type="text"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                        placeholder="Es. Daniele"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTakeInCharge(false)}
                        disabled={isAssigning || !assignedTo.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isAssigning ? 'Passaggio in elaborazione...' : 'Rispondi'}
                      </button>
                    </div>
                  </div>
                ) : (
                  shouldShowReplyComposer && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Il tuo nome * <span className="text-xs text-gray-500">(chi sta rispondendo)</span>
                      </label>
                      <input
                        type="text"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                        placeholder="Es. Daniele"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Messaggio di risposta *
                      </label>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                        rows={8}
                        placeholder="Scrivi la tua risposta qui..."
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveDraft}
                        disabled={isSaving || !assignedTo.trim()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Salvataggio...' : 'Salva Bozza'}
                      </button>
                      <button
                        onClick={handleConfirmSend}
                        disabled={isSaving || !assignedTo.trim() || !replyMessage.trim()}
                        className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50"
                      >
                        Invia Messaggio
                      </button>
                    </div>
                  </div>
                  )
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Dialog Conferma Invio */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Conferma Invio</h3>
            <p className="text-gray-600 mb-6">
              Sei sicuro di voler inviare questa email a {currentContact.email}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No, annulla
              </button>
              <button
                onClick={handleSendReply}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Invio...' : 'Sì, invia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
