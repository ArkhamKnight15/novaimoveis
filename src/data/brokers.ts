import type { Broker } from '../types/content'

export const brokers: Broker[] = [
  {
    id: 'marina-costa',
    name: 'Marina Costa',
    role: 'Sócia e diretora comercial',
    specialty: 'Especialista em imóveis de alto padrão',
    region: 'Jardins, Alto de Pinheiros e Rio de Janeiro',
    experience: 14,
    creci: 'CRECI-SP 128.433',
    phone: '(11) 98123-4501',
    email: 'marina@novaimoveis.com.br',
    bio: 'Arquiteta de formação, conduz as negociações mais sensíveis da NOVA, de casas de família a coberturas na orla carioca.',
    languages: ['Português', 'Inglês', 'Francês'],
  },
  {
    id: 'lucas-almeida',
    name: 'Lucas Almeida',
    role: 'Consultor sênior',
    specialty: 'Especialista em Zona Sul',
    region: 'Vila Nova Conceição, Moema, Itaim Bibi e Ibirapuera',
    experience: 9,
    creci: 'CRECI-SP 176.902',
    phone: '(11) 98123-4502',
    email: 'lucas@novaimoveis.com.br',
    bio: 'Conhece cada edifício do entorno do Ibirapuera, inclusive os que nunca chegaram a ser anunciados.',
    languages: ['Português', 'Inglês', 'Espanhol'],
  },
  {
    id: 'beatriz-martins',
    name: 'Beatriz Martins',
    role: 'Consultora de lançamentos',
    specialty: 'Especialista em lançamentos',
    region: 'São Paulo, Belo Horizonte e Litoral Norte',
    experience: 7,
    creci: 'CRECI-SP 201.317',
    phone: '(11) 98123-4503',
    email: 'beatriz@novaimoveis.com.br',
    bio: 'Acompanha incorporadoras desde o terreno e ajuda clientes a escolher a unidade certa ainda na planta.',
    languages: ['Português', 'Inglês'],
  },
  {
    id: 'rafael-mendes',
    name: 'Rafael Mendes',
    role: 'Consultor de investimentos',
    specialty: 'Especialista em investimentos imobiliários',
    region: 'São Paulo, Curitiba e Florianópolis',
    experience: 11,
    creci: 'CRECI-SP 154.880',
    phone: '(11) 98123-4504',
    email: 'rafael@novaimoveis.com.br',
    bio: 'Economista, monta estudos de rentabilidade e liquidez para investidores e famílias que compram mais de um imóvel.',
    languages: ['Português', 'Inglês', 'Italiano'],
  },
]

export function getBroker(id: string): Broker | undefined {
  return brokers.find((broker) => broker.id === id)
}
