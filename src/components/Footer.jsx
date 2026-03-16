export default function Footer() {
  return (
    <footer
      style={{
        background: '#080808',
        borderTop: '1px solid #111',
        borderRadius: '24px 24px 0 0',
      }}
      className="px-6 md:px-12 py-10"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

        {/* Left */}
        <div>
          <div className="font-display text-2xl mb-1" style={{ color: '#F5F5F0', letterSpacing: '0.05em' }}>
            billu.works
          </div>
          <div className="font-mono-jet" style={{ color: '#444', fontSize: '11px', letterSpacing: '0.1em', lineHeight: 1.8 }}>
            Video Editor · Colorist<br />
            Writer · Coding Hopeful
          </div>
        </div>

        {/* Right */}
        <div className="text-right">
          <div className="font-mono-jet mb-1" style={{ color: '#444', fontSize: '11px', letterSpacing: '0.08em', lineHeight: 1.8 }}>
            ©2025 Bilal Curmally<br />
            Built with React + GSAP<br />
            Karachi, Pakistan
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-end mt-8 pt-5"
        style={{ borderTop: '1px solid #111' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse 2s infinite' }}
          />
          <span className="font-mono-jet" style={{ color: '#444', fontSize: '10px', letterSpacing: '0.15em' }}>
            SYSTEM OPERATIONAL
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </footer>
  )
}
