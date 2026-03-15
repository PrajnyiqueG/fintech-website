
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  published_at: string | null
  created_at: string
  view_count: number
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'contacts'>('posts')
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', excerpt: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      const [postsRes, contactsRes] = await Promise.all([
        fetch('/api/admin/blog'),
        fetch('/api/admin/contacts')
      ])
      if (postsRes.status === 401 || postsRes.status === 403) {
        router.push('/admin/login')
        return
      }
      const postsData = await postsRes.json()
      const contactsData = await contactsRes.json()
      setPosts(postsData.posts || [])
      setContacts(contactsData.submissions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published })
    })
    fetchData()
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      setShowNewPost(false)
      setNewPost({ title: '', content: '', excerpt: '' })
      fetchData()
    } finally {
      setSaving(false)
    }
  }

  const updateContactStatus = async (id: string, status: string) => {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    fetchData()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button onClick={logout} className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
            <p className="text-3xl font-bold text-green-600">{posts.filter(p => p.published).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">New Contacts</p>
            <p className="text-3xl font-bold text-blue-600">{contacts.filter(c => c.status === 'new').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {([['posts', 'Blog Posts'], ['contacts', 'Contact Submissions']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Blog Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Blog Posts</h2>
              <button
                onClick={() => setShowNewPost(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                + New Post
              </button>
            </div>

            {showNewPost && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">Create New Post</h3>
                <form onSubmit={createPost} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Excerpt (optional)"
                    value={newPost.excerpt}
                    onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    placeholder="Content (Markdown supported)"
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button type="button" onClick={() => setShowNewPost(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.length === 0 && (
                <p className="p-6 text-center text-gray-500 dark:text-gray-400">No posts yet. Create your first post!</p>
              )}
              {posts.map(post => (
                <div key={post.id} className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(post.created_at).toLocaleDateString()} · {post.view_count} views
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      post.published
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Submissions</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.length === 0 && (
                <p className="p-6 text-center text-gray-500 dark:text-gray-400">No contact submissions yet.</p>
              )}
              {contacts.map(contact => (
                <div key={contact.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{contact.email}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{contact.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(contact.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        contact.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        contact.status === 'replied' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        contact.status === 'spam' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>{contact.status}</span>
                      <select
                        value={contact.status}
                        onChange={e => updateContactStatus(contact.id, e.target.value)}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="spam">Spam</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
