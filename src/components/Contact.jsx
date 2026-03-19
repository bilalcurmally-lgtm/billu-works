import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instagram, Linkedin, Github, Send } from 'lucide-react'
import { useMagneticButton } from '../utils/useMagneticButton'
import { useReducedMotion } from '../utils/useReducedMotion'

export default function Contact() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const formRef    = useRef(null)
  const btnRef     = useMagneticButton(0.3)
  const prefersReduced = useReducedMotion()

  const [form, setForm]               = useState({ name: '', email: '', message: '', _gotcha: '' })
  const [status, setStatus]           = useState('idle') // idle | sending | success | error
  const [submittedName, setSubmittedName] = useState('')

  useEffect(() => {
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      })
      gsap.from(formRef.current, {
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReduced])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    // Honeypot — bots fill this hidden field, humans don't
    if (form._gotcha) return

    setStatus('sending')
    setSubmittedName(form.name)
    try {
      // Replace YOUR_FORM_ID with your Formspree form ID
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '', _gotcha: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    background: 'rgba(245,240,232,0.06)',
    border: '1px solid rgba(245,240,232,0.12)',
    color: '#F5F5F0',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '13px',
    fontFamily: 'Inter, system-ui, sans-serif',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-panel py-24 px-6 md:px-12"
    >
      <div className="max-w-2xl mx-auto">

        {/* Headline */}
        <div ref={headRef} className="mb-16 text-center">
          <h2 className="font-heading font-light" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F5F0', lineHeight: 1.2, margin: 0 }}>
            Let's make something
          </h2>
          <h2 className="font-heading font-light" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F5F0', lineHeight: 1.2, margin: 0 }}>
            worth
          </h2>
          <div
            className="font-drama italic"
            style={{ fontSize: 'clamp(36px, 5.5vw, 64px)', color: '#F5F0E8', lineHeight: 1.15 }}
          >
            watching.
          </div>
        </div>

        {/* Ticket-stub form */}
        <div ref={formRef}>
          {status === 'success' ? (
            <div
              className="rounded-2xl text-center py-12 px-8"
              style={{ background: '#F5F0E8', color: '#1A1A1A' }}
            >
              <div className="font-display text-3xl mb-2">TICKET RECEIVED</div>
              <p className="font-mono-jet text-xs tracking-widest" style={{ color: '#666' }}>
                I'll be in touch soon. Thanks, {submittedName || 'friend'}.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#F5F0E8', color: '#1A1A1A' }}
            >
              {/* Form header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <span className="font-mono-jet text-xs tracking-widest" style={{ color: '#888' }}>
                  GET IN TOUCH
                </span>
                <span className="font-mono-jet text-xs" style={{ color: '#aaa' }}>
                  billu.works
                </span>
              </div>

              <div className="ticket-perforation mx-4 mb-5" />

              {/* Honeypot — hidden from humans, bots fill it */}
              <input
                type="text"
                name="_gotcha"
                value={form._gotcha}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="px-6 pb-6 flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="font-mono-jet block mb-1.5" style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Sharma"
                    required
                    style={{ ...inputStyle, background: 'rgba(26,26,26,0.06)', border: '1px solid rgba(26,26,26,0.15)', color: '#1A1A1A' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-mono-jet block mb-1.5" style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}>
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    style={{ ...inputStyle, background: 'rgba(26,26,26,0.06)', border: '1px solid rgba(26,26,26,0.15)', color: '#1A1A1A' }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="font-mono-jet block mb-1.5" style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}>
                    YOUR MESSAGE
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What's on your mind?"
                    required
                    maxLength={2000}
                    style={{ ...inputStyle, background: 'rgba(26,26,26,0.06)', border: '1px solid rgba(26,26,26,0.15)', color: '#1A1A1A', resize: 'vertical', minHeight: '110px' }}
                  />
                </div>

                <div className="ticket-perforation mt-1" />

                {/* Submit */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono-jet text-xs" style={{ color: '#aaa', fontSize: '10px' }}>
                    {status === 'error' ? '⚠ Send failed — try bilal@billu.works' : 'Or email: bilal@billu.works'}
                  </span>
                  <div ref={btnRef}>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="flex items-center gap-2 rounded-xl px-5 py-3 font-mono-jet text-xs tracking-widest transition-opacity hover:opacity-80"
                      style={{
                        background: '#1A1A1A',
                        color: '#F5F0E8',
                        letterSpacing: '0.1em',
                        opacity: status === 'sending' ? 0.5 : 1,
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {status === 'sending' ? 'SENDING...' : 'GET IN TOUCH'}
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-5 mt-10">
          {[
            { Icon: Instagram, href: 'https://instagram.com/', label: 'Instagram' },
            { Icon: Linkedin,  href: 'https://linkedin.com/',  label: 'LinkedIn' },
            { Icon: Github,    href: 'https://github.com/',    label: 'GitHub' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="font-mono-jet text-xs flex items-center gap-1.5 hover:opacity-100 transition-opacity"
              style={{ color: '#444', fontSize: '11px', letterSpacing: '0.1em' }}
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
