"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const username = (email.split('@')[0] || 'user').toLowerCase()
      const name = username
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, name })
      })
      const data = await r.json()
      if (!r.ok || !data.success) {
        throw new Error(data.errorMessage || 'Sign up failed')
      }
      router.replace('/login')
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-6 rounded-lg border bg-white">
        <h1 className="text-xl font-semibold">Sign Up</h1>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input value={email} onChange={e=>setEmail(e.target.value)} required type="email" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <Input value={password} onChange={e=>setPassword(e.target.value)} required type="password" className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Confirm Password</label>
            <Input value={confirm} onChange={e=>setConfirm(e.target.value)} required type="password" className="mt-1" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button disabled={loading} className="w-full mt-2">
            {loading ? 'Signing up…' : 'Sign Up'}
          </Button>
          <div className="text-sm text-center text-gray-600">Already have an account? <Link className="text-primary" href="/login">Log In</Link></div>
          <div className="text-sm text-center"><Link className="text-gray-600" href="/">Back to Home</Link></div>
        </div>
      </form>
    </main>
  )
}
