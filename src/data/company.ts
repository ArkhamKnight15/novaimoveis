export const company = {
  name: 'NOVA Imóveis',
  /** Domínio público (canonical, Open Graph e dados estruturados). */
  siteUrl: 'https://novaimoveis.com.br',
  shortName: 'NOVA',
  tagline: 'Imóveis selecionados para quem valoriza arquitetura, localização e qualidade de vida.',
  description:
    'Imobiliária de alto padrão com curadoria de imóveis, especialistas locais e um processo de compra e locação transparente do primeiro contato à entrega das chaves.',
  founded: 2018,
  creci: 'CRECI-SP 041.256-J',
  phone: { display: '(11) 3456-7890', href: 'tel:+551134567890' },
  whatsapp: { display: '(11) 98765-4321', href: 'https://wa.me/5511987654321' },
  email: 'contato@novaimoveis.com.br',
  address: {
    street: 'Rua Estados Unidos, 1450',
    district: 'Jardim América',
    city: 'São Paulo',
    state: 'SP',
    zip: '01427-001',
  },
  hours: ['Seg. a sex., das 9h às 19h', 'Sáb., das 10h às 14h'],
  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com/' },
  ],
} as const

export type SocialId = (typeof company.social)[number]['id']
