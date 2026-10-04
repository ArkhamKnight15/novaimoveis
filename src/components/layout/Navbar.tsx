import { Heart, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { mainNavigation } from '../../data/navigation'
import { useHideOnScroll } from '../../hooks/useHideOnScroll'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../lib/cn'
import { pluralize } from '../../lib/format'
import { useFavorites } from '../../state/favorites'
import { useInquiry } from '../../state/inquiry'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { SmartLink } from '../ui/SmartLink'
import { MobileMenu } from './MobileMenu'

/**
 * Navbar fixa: transparente sobre o hero da home e translúcida (com blur) depois da rolagem
 * ou nas demais páginas. Some ao rolar para baixo e volta ao rolar para cima.
 */
export function Navbar() {
  const { pathname } = useLocation()
  const scrolled = useScrolled(32)
  const hidden = useHideOnScroll()
  const { ids } = useFavorites()
  const { openLead } = useInquiry()
  const [menuOpen, setMenuOpen] = useState(false)
  const transparent = pathname === '/' && !scrolled
  const offscreen = hidden && !menuOpen

  // Expõe a altura visível da navbar para elementos fixos/sticky da página (ex.: barra de filtros).
  useEffect(() => {
    document.documentElement.style.setProperty('--nav-offset', offscreen ? '0px' : transparent ? '6rem' : '4.25rem')
  }, [offscreen, transparent])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-out-expo focus-within:translate-y-0',
          offscreen && '-translate-y-full',
        )}
      >
        {/* Gradiente para legibilidade sobre o vídeo */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/55 to-transparent transition-opacity duration-500',
            transparent ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cn(
            'relative border-b transition-[background-color,border-color,color,backdrop-filter] duration-500 ease-out-quart',
            transparent
              ? 'border-white/0 bg-transparent text-white'
              : 'border-line/80 bg-paper/80 text-ink backdrop-blur-xl backdrop-saturate-150',
          )}
        >
          <Container
            className={cn(
              'flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo',
              transparent ? 'h-24' : 'h-[4.25rem]',
            )}
          >
            <Link to="/" aria-label="NOVA Imóveis, página inicial" className="shrink-0 rounded-[2px]">
              <Logo withTagline className="text-[1.3rem]" />
            </Link>

            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-7 xl:gap-10">
                {mainNavigation.map((item) => (
                  <li key={item.to}>
                    {item.to.includes('#') ? (
                      <SmartLink
                        to={item.to}
                        className="link-underline pb-1 text-[0.8125rem] font-medium tracking-[0.02em] opacity-85 transition-opacity hover:opacity-100"
                      >
                        {item.label}
                      </SmartLink>
                    ) : (
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'pb-1 text-[0.8125rem] font-medium tracking-[0.02em] transition-opacity hover:opacity-100',
                            isActive
                              ? 'bg-[linear-gradient(var(--color-gold-400),var(--color-gold-400))] bg-[length:100%_1px] bg-bottom bg-no-repeat opacity-100'
                              : 'link-underline opacity-85',
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/favoritos"
                aria-label={
                  ids.length ? `Favoritos: ${pluralize(ids.length, 'imóvel salvo', 'imóveis salvos')}` : 'Favoritos'
                }
                className="relative flex size-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-current/10"
              >
                <Heart aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.5} />
                {ids.length > 0 && (
                  <span
                    key={ids.length}
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 flex size-[1.05rem] animate-heart-pop items-center justify-center rounded-full bg-gold-500 text-[0.625rem] font-semibold tabular-nums text-ink"
                  >
                    {ids.length}
                  </span>
                )}
              </Link>
              <Button
                variant={transparent ? 'outline-light' : 'solid'}
                size="sm"
                className="ml-2 hidden lg:inline-flex"
                onClick={openLead}
              >
                Encontrar meu imóvel
              </Button>
              <button
                type="button"
                aria-label="Abrir menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                className="flex size-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-current/10 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </Container>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
