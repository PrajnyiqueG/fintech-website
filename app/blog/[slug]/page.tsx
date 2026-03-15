
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  author_name: string
  published_at: string
  tags: string[]
  view_count: number
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params?.slug) return
    fetch(`/api/blog/${params.slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Post not found')
        return r.json()
      })
      .then(data => setPost(data.post))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [params?.slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg text-gray-600">Loading...</div></div>
  if (error || !post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
        <Link href="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-8 block">
          ← Back to Blog
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
          <span>{post.author_name}</span>
          <span>·</span>
          <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <span>{post.view_count} views</span>
        </div>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
        />
      </article>
    </main>
  )
}
