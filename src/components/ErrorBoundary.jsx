import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ background: '#080808', zIndex: 9999 }}
        >
          <div
            className="rounded-2xl overflow-hidden text-center"
            style={{ background: '#F5F0E8', color: '#1A1A1A', maxWidth: '380px', width: '90%' }}
          >
            <div className="px-8 pt-8 pb-4">
              <div
                className="font-display mb-2"
                style={{ fontSize: 'clamp(24px, 5vw, 36px)', letterSpacing: '0.03em' }}
              >
                TECHNICAL DIFFICULTIES
              </div>
              <div
                className="font-mono mb-1"
                style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em' }}
              >
                SOMETHING WENT WRONG
              </div>
            </div>
            <div style={{ borderTop: '2px dashed rgba(26,26,26,0.3)', margin: '0 24px' }} />
            <div className="px-8 pt-4 pb-6">
              <p className="font-body text-sm mb-4" style={{ color: '#555', lineHeight: 1.6 }}>
                The site hit an unexpected error. Try refreshing the page.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <pre
                  className="font-mono text-left mb-4 p-3 rounded-lg overflow-auto"
                  style={{ fontSize: '9px', color: '#888', background: 'rgba(26,26,26,0.08)', maxHeight: '120px' }}
                >
                  {this.state.error.toString()}
                </pre>
              )}
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl px-5 py-3 font-mono text-xs tracking-widest hover:opacity-80 transition-opacity"
                style={{ background: '#1A1A1A', color: '#F5F0E8', letterSpacing: '0.1em', cursor: 'pointer' }}
              >
                RELOAD
              </button>
            </div>
          </div>
          <div
            className="font-mono mt-6"
            style={{ fontSize: '10px', color: '#333', letterSpacing: '0.15em' }}
          >
            billu.works
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
