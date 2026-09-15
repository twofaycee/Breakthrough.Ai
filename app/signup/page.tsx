'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setMsg('')
    setSuccess(false)
    try {
      const r = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Unable to create your account.')
      setSuccess(true)
      setMsg(d.message || 'Account created. Check your email to finish signing in.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="shell">
    <nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a></nav>
    <section className="formPage">
      <div className="eyebrow">Join the platform</div>
      <h1>Create account</h1>
      <p className="muted">Start watching BREAKTHROUGH in seconds.</p>
      <form onSubmit={submit}>
        <input className="input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        <input className="input" placeholder="Password" type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
        <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
      </form>
      {msg && <div className="notice" style={success ? undefined : { color: '#ffb4b4' }}>{msg}</div>}
      {success && <p className="muted">Once confirmed, <Link href="/login">log in here</Link> and start watching.</p>}
      <p className="muted">Already have an account? <a href="/login">Log in</a></p>
    </section>
  </main>
}
