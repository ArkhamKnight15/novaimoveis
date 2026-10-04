import type { MouseEvent } from 'react'
import { Link, useLocation, type LinkProps } from 'react-router'
import { scrollToSection } from '../../lib/scroll'

/**
 * Link que entende âncoras ("/#sobre"): na mesma página, rola suavemente até a seção;
 * em outra página, navega e o <ScrollRestoration> cuida da rolagem.
 */
export function SmartLink({ to, onClick, ...props }: LinkProps) {
  const location = useLocation()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented || typeof to !== 'string' || !to.includes('#')) return
    const [path = '', hash = ''] = to.split('#')
    if ((path || '/') === location.pathname && scrollToSection(hash)) {
      event.preventDefault()
      window.history.replaceState(window.history.state, '', `${path || '/'}#${hash}`)
    }
  }

  return <Link to={to} onClick={handleClick} {...props} />
}
