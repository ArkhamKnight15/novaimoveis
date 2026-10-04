/** Rola até a seção e move o foco para ela (acessível), respeitando a redução de movimento. */
export function scrollToSection(id: string): boolean {
  const element = document.getElementById(id)
  if (!element) return false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1')
  element.focus({ preventScroll: true })
  return true
}
