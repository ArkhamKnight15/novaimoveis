import { useEffect } from 'react'
import { company } from '../data/company'

const DEFAULT_IMAGE = '/og-image.jpg'

interface PageMeta {
  title: string
  description: string
  image?: string
  /** Caminho canônico da página (ex.: "/imoveis/residencia-jacaranda"). */
  path?: string
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

/** Atualiza título, descrição, canonical e Open Graph a cada página da SPA. */
export function usePageMeta({ title, description, image = DEFAULT_IMAGE, path }: PageMeta) {
  useEffect(() => {
    const fullTitle = title.includes(company.shortName) ? title : `${title} | ${company.name}`
    const url = `${company.siteUrl}${path ?? window.location.pathname}`
    const imageUrl = image.startsWith('http') ? image : `${company.siteUrl}${image}`
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, image, path])
}
