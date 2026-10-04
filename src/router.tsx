import { lazy } from 'react'
import { createBrowserRouter, useParams } from 'react-router'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import type { Purpose } from './types/property'

// Code splitting: a home carrega de imediato; as demais páginas, sob demanda.
const SearchPage = lazy(() => import('./pages/SearchPage').then((module) => ({ default: module.SearchPage })))
const PropertyPage = lazy(() => import('./pages/PropertyPage').then((module) => ({ default: module.PropertyPage })))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then((module) => ({ default: module.FavoritesPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

const searchSegments: Record<string, Purpose | undefined> = { imoveis: undefined, comprar: 'venda', alugar: 'aluguel' }

/**
 * /imoveis, /comprar e /alugar compartilham a mesma rota (e a mesma instância da página),
 * então trocar a finalidade não reinicia filtros abertos nem a rolagem.
 */
function SearchRoute() {
  const { segment = '' } = useParams()
  if (!(segment in searchSegments)) return <NotFoundPage />
  return <SearchPage purpose={searchSegments[segment]} />
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'imoveis/:slug', element: <PropertyPage /> },
      { path: 'favoritos', element: <FavoritesPage /> },
      { path: ':segment', element: <SearchRoute /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
