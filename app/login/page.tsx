"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await r.json()
      if (!r.ok || !data.success) {
        throw new Error(data.errorMessage || 'Login failed')
      }
      router.replace('/profile')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-6 rounded-lg border bg-white">
        <h1 className="text-xl font-semibold">Log In</h1>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input value={email} onChange={e=>setEmail(e.target.value)} required type="email" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <Input value={password} onChange={e=>setPassword(e.target.value)} required type="password" className="mt-1" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button disabled={loading} className="w-full mt-2">
            {loading ? 'Signing in…' : 'Log In'}
          </Button>
          <div className="text-sm text-center text-gray-600">No account yet? <Link className="text-primary" href="/register">Sign Up</Link></div>
          <div className="text-sm text-center"><Link className="text-gray-600" href="/">Back to Home</Link></div>
        </div>
      </form>
    </main>
  )
}
