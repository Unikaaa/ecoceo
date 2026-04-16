'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ImageUploadField from '@/components/dashboard/ImageUploadField'

interface AboutSection {
  id: string
  section_key: string
  title: string
  subtitle: string
  content: string
  image_url: string
  is_active: boolean
}

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  image_url: string
  tags: string[]
  is_featured: boolean
  is_published: boolean
  published_at: string
}

export default function ContenutiPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'about' | 'news'>('about')
  
  // Chi Siamo
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([])
  const [editingAbout, setEditingAbout] = useState<AboutSection | null>(null)
  const [aboutFormData, setAboutFormData] = useState<Partial<AboutSection>>({})
  
  // News
  const [articles, setArticles] = useState<Article[]>([])
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'UNIKA Team',
    category: 'News',
    image_url: '',
    tags: '',
    is_featured: false,
    is_published: true,
  })

  useEffect(() => {
    const authStatus = sessionStorage.getItem('dashboard_auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
      fetchAboutSections()
      fetchArticles()
    }
    setIsLoading(false)
  }, [])

  const fetchAboutSections = async () => {
    try {
      const res = await fetch('/api/about')
      const data = await res.json()
      if (res.ok) setAboutSections(data.sections || [])
    } catch (error) {
      console.error('Errore caricamento Chi Siamo:', error)
    }
  }

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?published=false')
      const data = await res.json()
      if (res.ok) {
        const list = data.articles || []
        if (list.length === 0) {
          await fetch('/api/articles/seed', { method: 'POST' })
          const retry = await fetch('/api/articles?published=false')
          const retryData = await retry.json()
          if (retry.ok) {
            setArticles(retryData.articles || [])
            return
          }
        }
        setArticles(list)
      }
    } catch (error) {
      console.error('Errore caricamento articoli:', error)
    }
  }

  const handleSaveAbout = async () => {
    if (!editingAbout) return

    try {
      const res = await fetch('/api/about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingAbout.id, ...aboutFormData }),
      })

      if (res.ok) {
        await fetchAboutSections()
        setEditingAbout(null)
        setAboutFormData({})
      } else {
        alert('Errore durante il salvataggio')
      }
    } catch (error) {
      console.error('Errore salvataggio:', error)
      alert('Errore durante il salvataggio')
    }
  }

  const handleSaveArticle = async () => {
    try {
      const payload = {
        ...articleFormData,
        tags: articleFormData.tags.split(',').map(t => t.trim()).filter(t => t),
      }

      if (editingArticle) {
        const res = await fetch('/api/articles', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingArticle.id, ...payload }),
        })

        if (res.ok) {
          await fetchArticles()
          resetArticleForm()
        }
      } else {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          await fetchArticles()
          resetArticleForm()
        }
      }
    } catch (error) {
      console.error('Errore salvataggio articolo:', error)
      alert('Errore durante il salvataggio')
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return

    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        await fetchArticles()
      }
    } catch (error) {
      console.error('Errore eliminazione:', error)
    }
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setArticleFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      image_url: article.image_url || '',
      tags: article.tags?.join(', ') || '',
      is_featured: article.is_featured,
      is_published: article.is_published,
    })
    setShowArticleForm(true)
  }

  const resetArticleForm = () => {
    setArticleFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'UNIKA Team',
      category: 'News',
      image_url: '',
      tags: '',
      is_featured: false,
      is_published: true,
    })
    setEditingArticle(null)
    setShowArticleForm(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem('dashboard_auth', 'authenticated')
        setIsAuthenticated(true)
        fetchAboutSections()
        fetchArticles()
      } else {
        setError(data.error || 'Password non corretta')
      }
    } catch (err) {
      setError('Errore durante l\'autenticazione')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    setIsAuthenticated(false)
    setPassword('')
  }

  const getSectionName = (key: string) => {
    const names: { [key: string]: string } = {
      hero: 'Hero (Intestazione)',
      story: 'La Nostra Storia',
      philosophy: 'La Nostra Filosofia',
      signature: 'Firma Finale',
    }
    return names[key] || key
  }

  const isManagedInsidePhilosophy = (key: string) =>
    key === 'philosophy_card_1' || key === 'philosophy_card_2' || key === 'philosophy_card_3'

  const visibleAboutSections = aboutSections.filter(
    (section) => !isManagedInsidePhilosophy(section.section_key)
  )

  const parsePhilosophyImages = (raw?: string | null): [string, string, string] => {
    if (!raw) return ['', '', '']

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return [
          typeof parsed[0] === 'string' ? parsed[0] : '',
          typeof parsed[1] === 'string' ? parsed[1] : '',
          typeof parsed[2] === 'string' ? parsed[2] : '',
        ]
      }
      if (parsed && Array.isArray(parsed.images)) {
        return [
          typeof parsed.images[0] === 'string' ? parsed.images[0] : '',
          typeof parsed.images[1] === 'string' ? parsed.images[1] : '',
          typeof parsed.images[2] === 'string' ? parsed.images[2] : '',
        ]
      }
    } catch {
      // Se non e' JSON, il vecchio formato viene usato come prima immagine
    }

    return [raw, '', '']
  }

  const updatePhilosophyImageAt = (index: number, url: string) => {
    const current = parsePhilosophyImages(aboutFormData.image_url)
    current[index] = url
    setAboutFormData({ ...aboutFormData, image_url: JSON.stringify(current) })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-2 text-center">Dashboard UNIKA</h1>
            <p className="text-gray-600 text-center mb-8">Inserisci la password per accedere</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-[#663399] text-white py-2 px-4 rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                Accedi
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div>
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-2xl sm:text-4xl font-serif text-gray-900 mb-2">Contenuti</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestisci i contenuti del sito: Chi Siamo e News</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'about'
                ? 'bg-[#663399] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chi Siamo
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'news'
                ? 'bg-[#663399] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            News & Blog
          </button>
        </div>

        {/* Chi Siamo Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Modifica i contenuti della pagina "Chi Siamo". Clicca su una sezione per modificarla.
              </p>
            </div>

            {visibleAboutSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getSectionName(section.section_key)}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingAbout(section)
                      setAboutFormData({
                        title: section.title,
                        subtitle: section.subtitle,
                        content: section.content,
                        image_url: section.image_url,
                      })
                    }}
                    className="px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
                  >
                    Modifica
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  {section.title && <p><strong>Titolo:</strong> {section.title}</p>}
                  {section.subtitle && <p><strong>Sottotitolo:</strong> {section.subtitle}</p>}
                  {section.content && (
                    <p><strong>Contenuto:</strong> {section.content.substring(0, 150)}...</p>
                  )}
                  {section.section_key === 'philosophy' && (
                    <p>
                      <strong>Immagini filosofia:</strong>{' '}
                      {parsePhilosophyImages(section.image_url).filter(Boolean).length}/3
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Articoli</h2>
              <button
                onClick={() => setShowArticleForm(true)}
                className="px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                + Nuovo Articolo
              </button>
            </div>

            {showArticleForm && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingArticle ? 'Modifica Articolo' : 'Nuovo Articolo'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titolo *</label>
                    <input
                      type="text"
                      value={articleFormData.title}
                      onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      placeholder="Titolo dell'articolo"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Autore</label>
                      <input
                        type="text"
                        value={articleFormData.author}
                        onChange={(e) => setArticleFormData({ ...articleFormData, author: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <select
                        value={articleFormData.category}
                        onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      >
                        <option value="News">News</option>
                        <option value="Storia">Storia</option>
                        <option value="Tecniche">Tecniche</option>
                        <option value="Consigli">Consigli</option>
                        <option value="Eventi">Eventi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estratto</label>
                    <textarea
                      value={articleFormData.excerpt}
                      onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      rows={2}
                      placeholder="Breve descrizione dell'articolo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto *</label>
                    <textarea
                      value={articleFormData.content}
                      onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      rows={10}
                      placeholder="Contenuto completo dell'articolo (supporta Markdown)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separati da virgola)</label>
                    <input
                      type="text"
                      value={articleFormData.tags}
                      onChange={(e) => setArticleFormData({ ...articleFormData, tags: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      placeholder="ceramica, arte, tutorial"
                    />
                  </div>

                  <ImageUploadField
                    value={articleFormData.image_url}
                    onChange={(url) => setArticleFormData({ ...articleFormData, image_url: url as string })}
                    label="Immagine Articolo"
                  />

                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={articleFormData.is_featured}
                        onChange={(e) => setArticleFormData({ ...articleFormData, is_featured: e.target.checked })}
                        className="w-4 h-4 text-[#663399] border-gray-300 rounded focus:ring-[#663399]"
                      />
                      <span className="text-sm text-gray-700">In Evidenza</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={articleFormData.is_published}
                        onChange={(e) => setArticleFormData({ ...articleFormData, is_published: e.target.checked })}
                        className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">Pubblicato</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveArticle}
                      disabled={!articleFormData.title || !articleFormData.content}
                      className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium disabled:opacity-50"
                    >
                      {editingArticle ? 'Aggiorna' : 'Pubblica'}
                    </button>
                    <button
                      onClick={resetArticleForm}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lista Articoli */}
            {articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-600 mb-4">Nessun articolo ancora.</p>
                <p className="text-sm text-gray-500">Clicca su "Nuovo Articolo" per creare il primo.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start gap-6"
                  >
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">No img</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{article.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {article.author} • {article.category} • {new Date(article.published_at).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {article.is_featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">In Evidenza</span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            article.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {article.is_published ? 'Pubblicato' : 'Bozza'}
                          </span>
                        </div>
                      </div>
                      {article.excerpt && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{article.excerpt}</p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="px-3 py-1 bg-[#663399] text-white rounded hover:bg-[#552288] transition-colors text-sm"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Edit About */}
        {editingAbout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Modifica: {getSectionName(editingAbout.section_key)}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingAbout(null)
                      setAboutFormData({})
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                  <input
                    type="text"
                    value={aboutFormData.title || ''}
                    onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sottotitolo</label>
                  <input
                    type="text"
                    value={aboutFormData.subtitle || ''}
                    onChange={(e) => setAboutFormData({ ...aboutFormData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto</label>
                  <textarea
                    value={aboutFormData.content || ''}
                    onChange={(e) => setAboutFormData({ ...aboutFormData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    rows={10}
                    placeholder="Contenuto della sezione..."
                  />
                </div>
                {editingAbout.section_key === 'philosophy' ? (
                  <div className="space-y-3">
                    <ImageUploadField
                      value={parsePhilosophyImages(aboutFormData.image_url)[0]}
                      onChange={(url) => updatePhilosophyImageAt(0, (url as string) || '')}
                      label="Immagine casella 1 (Atelier)"
                    />
                    <ImageUploadField
                      value={parsePhilosophyImages(aboutFormData.image_url)[1]}
                      onChange={(url) => updatePhilosophyImageAt(1, (url as string) || '')}
                      label="Immagine casella 2 (Dettagli)"
                    />
                    <ImageUploadField
                      value={parsePhilosophyImages(aboutFormData.image_url)[2]}
                      onChange={(url) => updatePhilosophyImageAt(2, (url as string) || '')}
                      label="Immagine casella 3 (Materia)"
                    />
                  </div>
                ) : (
                  <ImageUploadField
                    value={aboutFormData.image_url || ''}
                    onChange={(url) => setAboutFormData({ ...aboutFormData, image_url: url as string })}
                    label="Immagine (opzionale)"
                  />
                )}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveAbout}
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium"
                  >
                    Salva Modifiche
                  </button>
                  <button
                    onClick={() => {
                      setEditingAbout(null)
                      setAboutFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
