import { Suspense, useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { scrollToSection } from '../../lib/scroll'
import { FavoritesProvider } from '../../state/FavoritesProvider'
import { InquiryProvider } from '../../state/InquiryProvider'
import { ToastProvider } from '../../state/ToastProvider'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { PageFallback } from './PageFallback'

/** As rotas de busca compartilham a mesma chave para não reiniciar a página ao trocar a finalidade. */
function pageKey(pathname: string) {
  return /^\/(imoveis|comprar|alugar)\/?$/.test(pathname) ? 'busca' : pathname
}

export function RootLayout() {
  const { pathname, hash, key } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  // Em navegações internas, leva o foco ao conteúdo (leitores de tela anunciam a nova página).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!hash) mainRef.current?.focus({ preventScroll: true })
  }, [pathname, hash])

  // Ao chegar por âncora (ex.: /#sobre vindo de outra página), corrige a rolagem depois que
  // conteúdos assíncronos acima da seção terminarem de carregar e mudarem a altura da página.
  useEffect(() => {
    if (!hash) return
    const timer = window.setTimeout(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target && Math.abs(target.getBoundingClientRect().top) > 120) scrollToSection(target.id)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return (
    <FavoritesProvider>
      <ToastProvider>
        <InquiryProvider>
          <a
            href="#conteudo"
            className="eyebrow fixed left-4 top-4 z-[70] -translate-y-24 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
          >
            Pular para o conteúdo
          </a>
          <Navbar />
          <main ref={mainRef} id="conteudo" tabIndex={-1} className="outline-none">
            {/* A chave reinicia a animação de entrada a cada troca de página (não no primeiro carregamento). */}
            <div key={pageKey(pathname)} className={key === 'default' ? undefined : 'animate-page-in'}>
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
          <Footer />
          <ScrollRestoration />
        </InquiryProvider>
      </ToastProvider>
    </FavoritesProvider>
  )
}
