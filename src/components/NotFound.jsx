export default function NotFound() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: '#080808' }}
    >
      <div className="text-center max-w-md px-6">
        {/* Ticket stub */}
        <div
          className="ticket-shape rounded-2xl mx-auto mb-8 inline-block"
          style={{
            background: '#F5F0E8',
            color: '#1A1A1A',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          <div className="px-8 pt-8 pb-4 text-center">
            <div
              className="font-mono-jet text-xs tracking-[0.2em] uppercase mb-1"
              style={{ color: '#666' }}
            >
              Error 404
            </div>
            <div
              className="font-display tracking-wide"
              style={{ color: '#1A1A1A', fontSize: 'clamp(28px, 5vw, 42px)' }}
            >
              FILM NOT FOUND
            </div>
          </div>

          <div className="ticket-perforation mx-0" />

          <div className="px-8 py-5 text-center">
            <div
              className="font-mono-jet tracking-[0.15em] uppercase"
              style={{ color: '#666', fontSize: '10px' }}
            >
              THIS REEL DOESN'T EXIST
            </div>
          </div>
        </div>

        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono-jet text-xs tracking-widest px-6 py-3 rounded-xl transition-opacity hover:opacity-80"
          style={{
            background: '#F5F0E8',
            color: '#1A1A1A',
            letterSpacing: '0.1em',
            textDecoration: 'none',
          }}
        >
          &larr; BACK TO MAIN FEATURE
        </a>
      </div>
    </div>
  )
}
