import { image } from '../lib/images'
import type { CaseStudy } from '../types/content'

export const caseStudies: CaseStudy[] = [
  {
    id: 'retrofit-vila-nova',
    category: 'Reforma',
    title: 'Apartamento de 1978 transformado em living contínuo',
    location: 'Vila Nova Conceição, São Paulo',
    summary:
      'Compramos com o cliente um apartamento original, com planta compartimentada e instalações antigas. Em sete meses, as paredes internas deram lugar a um living de 90 m² com piso de nogueira e cozinha integrada.',
    before: image('cases/retrofit-before', 'Apartamento antes da reforma, com contrapiso e paredes sem acabamento'),
    after: image(
      'cases/retrofit-after',
      'O mesmo apartamento depois da reforma, com living integrado e piso de nogueira',
    ),
    metrics: [
      { label: 'Valor do imóvel', before: 'R$ 3,9 mi', after: 'R$ 6,1 mi' },
      { label: 'Preço por m²', before: 'R$ 13,7 mil', after: 'R$ 21,4 mil' },
    ],
    result: '+56%',
    duration: '7 meses de obra',
  },
  {
    id: 'galpao-madalena',
    category: 'Arquitetura',
    title: 'Galpão de 1968 convertido em lofts de pé-direito duplo',
    location: 'Vila Madalena, São Paulo',
    summary:
      'Um galpão industrial abandonado virou seis lofts com mezanino. Preservamos a estrutura de concreto e os caixilhos de aço originais e alugamos todas as unidades antes da entrega da obra.',
    before: image('cases/loft-before', 'Galpão vazio antes da conversão, com piso de concreto e janelas antigas'),
    after: image('cases/loft-after', 'Loft finalizado com mezanino em aço, sofá de couro e piso de madeira'),
    metrics: [
      { label: 'Ocupação', before: '0%', after: '100%' },
      { label: 'Renda mensal', before: '—', after: 'R$ 74 mil' },
    ],
    result: '6 de 6',
    duration: 'Unidades locadas antes da entrega',
  },
  {
    id: 'staging-alto-de-pinheiros',
    category: 'Valorização',
    title: 'Paisagismo, iluminação e home staging antes da venda',
    location: 'Alto de Pinheiros, São Paulo',
    summary:
      'A casa estava há catorze meses à venda. Refizemos o paisagismo, projetamos a iluminação externa, mobiliamos os ambientes principais e produzimos um novo ensaio visual. Ela foi vendida em 38 dias.',
    before: image('cases/staging-before', 'Casa vazia, com jardim sem paisagismo, antes do home staging'),
    after: image('cases/staging-after', 'A mesma casa com paisagismo, mobiliário e iluminação, ao pôr do sol'),
    metrics: [
      { label: 'Tempo à venda', before: '14 meses', after: '38 dias' },
      { label: 'Valor de venda', before: 'R$ 7,4 mi', after: 'R$ 8,3 mi' },
    ],
    result: '+12%',
    duration: 'Vendida em 38 dias',
  },
]
