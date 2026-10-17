/**
 * Turn a Vimeo or YouTube page URL into an embeddable player URL.
 * Returns null for anything else so callers can fall back to a plain link.
 */
export function getVideoEmbed(url) {
  if (!url || url === '#') return null

  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/)
  if (yt) {
    return {
      provider: 'YouTube',
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&mute=1&rel=0&modestbranding=1`,
    }
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    return {
      provider: 'Vimeo',
      src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&dnt=1&title=0&byline=0&portrait=0`,
    }
  }

  return null
}

export function getProviderName(url) {
  if (/youtu\.?be/.test(url || '')) return 'YouTube'
  if (/vimeo\.com/.test(url || '')) return 'Vimeo'
  return null
}
