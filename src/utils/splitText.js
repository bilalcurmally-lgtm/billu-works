/**
 * splitText — splits a string into word <span> elements for GSAP stagger.
 * Returns an array of span elements injected into the target element.
 * Free alternative to GSAP SplitText.
 */
export function splitWords(element) {
  const text = element.textContent
  element.textContent = ''
  const spans = text.split(' ').map((word, i, arr) => {
    const span = document.createElement('span')
    span.textContent = word + (i < arr.length - 1 ? '\u00A0' : '')
    span.style.display = 'inline-block'
    span.style.overflow = 'hidden'
    element.appendChild(span)
    return span
  })
  return spans
}

export function splitLines(element) {
  const text = element.textContent
  element.textContent = ''
  const lines = text.split('\n').filter(Boolean)
  const spans = lines.map((line) => {
    const span = document.createElement('span')
    span.textContent = line
    span.style.display = 'block'
    span.style.overflow = 'hidden'
    element.appendChild(span)
    return span
  })
  return spans
}
