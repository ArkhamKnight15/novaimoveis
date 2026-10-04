import type { NavItem } from '../types/content'

export const mainNavigation: NavItem[] = [
  { label: 'Comprar', to: '/comprar' },
  { label: 'Alugar', to: '/alugar' },
  { label: 'Imóveis', to: '/imoveis' },
  { label: 'Sobre nós', to: '/#sobre' },
  { label: 'Diferenciais', to: '/#diferenciais' },
  { label: 'Contato', to: '/#contato' },
]

export const footerNavigation: { title: string; items: NavItem[] }[] = [
  {
    title: 'Imóveis',
    items: [
      { label: 'Comprar', to: '/comprar' },
      { label: 'Alugar', to: '/alugar' },
      { label: 'Todos os imóveis', to: '/imoveis' },
      { label: 'Favoritos', to: '/favoritos' },
    ],
  },
  {
    title: 'A NOVA',
    items: [
      { label: 'Sobre nós', to: '/#sobre' },
      { label: 'Diferenciais', to: '/#diferenciais' },
      { label: 'Especialistas', to: '/#especialistas' },
      { label: 'Perguntas frequentes', to: '/#faq' },
      { label: 'Contato', to: '/#contato' },
    ],
  },
]
