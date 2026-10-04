import { image } from '../lib/images'
import type { Differential } from '../types/content'

export const differentials: Differential[] = [
  {
    id: 'curadoria',
    title: 'Curadoria',
    description: 'Selecionamos imóveis com critérios rigorosos.',
    detail:
      'De cada dez imóveis que avaliamos, três entram no portfólio. Visitamos todos, conferimos documentação, planta e conservação antes de mostrá-los a você.',
    image: image('sections/why-curadoria', 'Piscina alinhada ao pavilhão de vidro de uma residência contemporânea'),
  },
  {
    id: 'atendimento',
    title: 'Atendimento personalizado',
    description: 'Cada cliente possui necessidades diferentes.',
    detail:
      'Um único especialista acompanha você do primeiro contato à entrega das chaves, com agenda flexível, visitas por vídeo e respostas no mesmo dia.',
    image: image('sections/why-atendimento', 'Sala de jantar integrada com mesa de madeira e pendentes'),
  },
  {
    id: 'especialistas',
    title: 'Especialistas locais',
    description: 'Conhecimento profundo das regiões onde atuamos.',
    detail:
      'Nossos consultores moram e trabalham nos bairros que atendem. Sabem quais ruas são silenciosas, quais edifícios valorizam e o que vai ser construído na quadra.',
    image: image('sections/why-especialistas', 'Fachada de torre residencial com varandas e jardim'),
  },
  {
    id: 'negociacao',
    title: 'Negociação transparente',
    description: 'Acompanhamos cada etapa do processo.',
    detail:
      'Proposta, contraproposta, análise jurídica e escritura: você acompanha cada etapa, com documentos e prazos compartilhados em tempo real.',
    image: image('sections/why-negociacao', 'Cozinha com ilha em pedra e marcenaria escura'),
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    description: 'Uma experiência imobiliária mais simples e eficiente.',
    detail:
      'Busca com filtros precisos, tour em vídeo, assinatura digital e um painel com o andamento da sua compra ou locação, acessível de qualquer lugar.',
    image: image('sections/why-tecnologia', 'Loft com pé-direito duplo e parede de caixilhos de aço'),
  },
]
