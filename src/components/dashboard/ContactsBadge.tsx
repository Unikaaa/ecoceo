'use client'

import { useState, useEffect } from 'react'

export default function ContactsBadge() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // Conta sia "unread" che "read" come "Da Leggere"
        const response = await fetch('/api/contacts')
        const data = await response.json()
        if (response.ok && data.contacts) {
          const unreadCount = data.contacts.filter(
            (c: any) => c.status === 'unread' || c.status === 'read'
          ).length
          setUnreadCount(unreadCount)
        }
      } catch (error) {
        console.error('Errore recupero contatti non letti:', error)
      }
    }

    fetchUnreadCount()
    
    // Aggiorna quando viene notificato un cambio
    const handleContactsUpdate = () => {
      fetchUnreadCount()
    }
    window.addEventListener('contactsUpdated', handleContactsUpdate)
    
    // Aggiorna ogni 30 secondi
    const interval = setInterval(fetchUnreadCount, 30000)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('contactsUpdated', handleContactsUpdate)
    }
  }, [])

  // Mostra badge solo se ci sono contatti non letti
  if (unreadCount === null || unreadCount === 0) {
    return null
  }

  return (
    <span className="ml-2 bg-[#663399] text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {unreadCount}
    </span>
  )
}
