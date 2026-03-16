import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instagram, Linkedin, Github, Send } from 'lucide-react'
import { useMagneticButton } from '../utils/useMagneticButton'

gsap.registerPlugin(ScrollTrigger)

const PROJECT_TYPES = [
  'Color Grade',
  'Edit + Grade',
  'Edit Only',
  'Brand Film',
  'Documentary',
  'AI Workflow',
  'Other',
]

export default function Contact() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const formRef    = useRef(null)
  const btnRef     = useMagneticButton(0.3)

  const [form, setForm]       = useState({ name: '', type: '', budget: '', message: '' })
  const [status, setStatus]   = useState('idle') // idle | sending | success | error

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // Replace YOUR_FORM_ID with your Formspree form ID
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', type: '', budget: '', message: '' })
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
                I'll be in touch soon. Thanks, {form.name || 'friend'}.
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
                  INQUIRY FORM
                </span>
                <span className="font-mono-jet text-xs" style={{ color: '#aaa' }}>
                  billu.works
                </span>
              </div>

              <div className="ticket-perforation mx-4 mb-5" />

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

                {/* Project type */}
                <div>
                  <label className="font-mono-jet block mb-1.5" style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}>
                    PROJECT TYPE
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, background: 'rgba(26,26,26,0.06)', border: '1px solid rgba(26,26,26,0.15)', color: form.type ? '#1A1A1A' : '#999', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select a type</option>
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="font-mono-jet block mb-1.5" style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}>
                    BUDGET RANGE
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    style={{ ...inputStyle, background: 'rgba(26,26,26,0.06)', border: '1px solid rgba(26,26,26,0.15)', color: form.budget ? '#1A1A1A' : '#999', cursor: 'pointer' }}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500–$2000">$500–$2,000</option>
                    <option value="$2000–$5000">$2,000–$5,000</option>
                    <option value="$5000+">$5,000+</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="font-mono-jet block mb-1.5" style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}>
                    TELL ME ABOUT IT
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What are you working on?"
                    required
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
