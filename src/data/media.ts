import { image } from '../lib/images'

/**
 * Vídeo e imagens institucionais. O vídeo do hero é opcional: sem ele (ou sem suporte
 * a autoplay, ou com economia de dados ativa), o hero exibe a imagem estática.
 */
export const heroMedia = {
  video: {
    desktop: '/videos/hero-real-estate.mp4',
    /**
     * Versão leve (ex.: 720×1280, até ~3 MB) para telas pequenas. Se o arquivo não existir,
     * o celular exibe a imagem estática — o vídeo de desktop não é baixado em redes móveis.
     */
    mobile: '/videos/hero-real-estate-mobile.mp4',
  },
  /** Imóvel retratado no hero (legenda discreta com link). */
  featured: { label: 'Residência Jacarandá, Alto de Pinheiros', to: '/imoveis/residencia-jacaranda-alto-de-pinheiros' },
  poster: image('hero/hero', 'Residência contemporânea iluminada ao entardecer, com piscina em primeiro plano', {
    width: 2560,
    height: 1440,
    widths: [960, 1920, 2560],
  }),
  posterMobile: image('hero/hero-mobile', 'Residência contemporânea iluminada ao entardecer', {
    width: 960,
    height: 1440,
    widths: [720, 960],
  }),
}

export const aboutImage = image(
  'sections/about',
  'Torre residencial com varandas de vidro ao entardecer, em São Paulo',
  { width: 1600, height: 1067 },
)

export const aboutDetailImage = image(
  'sections/about-detail',
  'Brise de madeira e caixilhos de uma residência projetada',
  {
    width: 1200,
    height: 1500,
    widths: [600, 1200],
  },
)

export const ctaImage = image('sections/cta', 'Terraço de cobertura com piscina de borda infinita e vista para o mar', {
  width: 1600,
  height: 1067,
})
