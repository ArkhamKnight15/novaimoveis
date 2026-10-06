# NOVA Imóveis

Site completo de uma imobiliária **fictícia** de alto padrão: home cinematográfica, busca com filtros, página de cada imóvel com galeria, favoritos e formulários de briefing, visita e contato.
É um projeto de demonstração: imóveis, valores, pessoas, depoimentos e contatos são inventados, e as imagens foram geradas por computador (veja [Imagens](#imagens)).

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide React e `tailwind-merge`.

**Tipografia:** Instrument Serif (títulos de impacto), Newsreader (títulos editoriais, nomes, preços e citações), Geist (texto e interface) e Geist Mono (rótulos, índices e códigos), todas auto-hospedadas via Fontsource.

## Como executar

Requer Node.js 20 ou superior.

```bash
cd nova-imoveis
npm install
npm run dev       # http://localhost:5173
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos (`tsc -b`) + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção |
| `npm run typecheck` | Só a checagem de tipos |
| `npm run lint` | Lint com oxlint (inclui regras de acessibilidade) |

Em produção, configure o servidor para devolver o `index.html` em qualquer rota (SPA), por exemplo com um rewrite `/* → /index.html` na Vercel ou na Netlify.

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Home: hero com vídeo, busca, números, destaques, diferenciais, sobre, processo, cases, especialistas, depoimentos, FAQ e contato |
| `/imoveis`, `/comprar`, `/alugar` | Busca com filtros e ordenação. A finalidade faz parte do caminho e os filtros ficam na URL (`/comprar?local=leblon&quartos=3`), então qualquer busca pode ser compartilhada |
| `/imoveis/:slug` | Página do imóvel: galeria com lightbox, ficha, características, comodidades, condomínio e valores, localização, corretor e agendamento |
| `/favoritos` | Imóveis salvos (guardados no navegador e sincronizados entre abas) |

## Destaques de experiência

- **Hero cinematográfico.** A imagem aparece de imediato (é o LCP) com um *push-in* lento. Depois do carregamento da página, e só se a conexão permitir, o vídeo é carregado e entra com um *fade* quando começa a tocar. Ele pausa fora da tela e tem botão de pausa (WCAG 2.2.2).
- **Busca do hero** em barra única no desktop e cartão empilhado no celular, com selects próprios acessíveis (padrão *select-only combobox* da WAI-ARIA: setas, Home/End, digitação para buscar e Esc).
- **Busca completa:** finalidade, localização (cidades e bairros com contagem), tipo, preço mínimo e máximo, quartos, banheiros, vagas e área, além de busca livre por nome, bairro ou código. Tem chips removíveis, ordenação, estados de carregamento, erro e vazio, e drawer de filtros no celular.
- **Página do imóvel** com galeria (crossfade, arrastar no celular, miniaturas e lightbox com teclado), resumo fixo com CTAs no desktop e barra de ação fixa no celular.
- **Formulários:** briefing em duas etapas ("Encontrar meu imóvel"), agendamento de visita com dias e horários, e mensagem ao corretor. Todos têm validação, máscara de telefone, foco no primeiro erro e estados de envio, erro e sucesso com protocolo.
- **Microinterações:** navbar que fica translúcida ao rolar e some ao descer, revelação no scroll, contadores animados, zoom e troca de informação nos cards, parallax por CSS, linha do processo que se desenha, comparador antes/depois, acordeão animado, favoritos com notificação e transição entre páginas.
- Com `prefers-reduced-motion`, as animações e o vídeo são desativados.

## Estrutura

```
src/
  components/
    brand/      # logo e ícones de redes sociais
    forms/      # briefing, visita, mensagem e feedback de envio
    layout/     # navbar, menu mobile, footer e layout raiz
    property/   # card, galeria, lightbox, mapa, comodidades, corretor
    search/     # busca do hero, painel de filtros, chips
    ui/         # botão, select, diálogo, acordeão, abas, campos, antes/depois…
  data/         # todo o conteúdo: imóveis, corretores, FAQ, cases, textos institucionais
  hooks/        # rolagem, viewport, formulário, contador, metadados da página
  lib/          # utilitários puros (filtros ↔ URL, formatação, validação, máscara)
  pages/        # uma página por rota (carregadas sob demanda, exceto a home)
  sections/     # seções da home
  services/     # acesso a dados (mock ou API real)
  state/        # favoritos, notificações e diálogos de contato (contextos)
  types/        # contratos de dados
tools/renders/  # cenas do Blender que geram as imagens do site
```

## Dados e API

Os imóveis seguem o tipo `Property` (`src/types/property.ts`): id, título, preço, localização, tipo, quartos, banheiros, área, vagas, descrição, imagens, comodidades, condomínio, corretor etc.

As páginas nunca leem `src/data` diretamente: elas chamam `src/services`. Sem configuração, os serviços respondem com os dados mockados e uma latência simulada. Para usar uma API real, copie `.env.example` para `.env` e defina:

```bash
VITE_API_URL=https://api.seudominio.com.br
```

Os contratos esperados estão documentados no topo de `src/services/properties.ts` (`GET /properties`, `GET /properties/:slug`…) e `src/services/inquiries.ts` (`POST /leads`, `/visits`, `/messages`).

## Vídeo do hero

Coloque o vídeo em `public/videos/hero-real-estate.mp4`. Recomendações: H.264 (ou H.265/AV1 com fallback), 1920×1080, 10 a 20 segundos em loop, sem áudio, até ~8 MB.

Para celulares, adicione também `public/videos/hero-real-estate-mobile.mp4` (por exemplo 720×1280, até ~3 MB). Sem esse arquivo, o celular exibe a imagem estática, e o vídeo de desktop não é baixado em rede móvel. Os caminhos ficam em `src/data/media.ts`.

O vídeo não é carregado com economia de dados ativa, em conexões 2G ou com redução de movimento. Se o arquivo não existir ou falhar, o hero continua com a imagem.

## Imagens

Como o ambiente de desenvolvimento não tinha acesso a bancos de imagens, todas as fotos foram **renderizadas em 3D** com o Blender (Cycles), a partir das cenas em `tools/renders/scenes`. São imagens ilustrativas e devem ser substituídas por fotos reais.

As imagens ficam em `public/images` e seguem a convenção `<nome>-<largura>.webp`:

```
public/images/properties/<slug-do-imóvel>/01-800.webp
public/images/properties/<slug-do-imóvel>/01-1600.webp
```

Para trocar as fotos de um imóvel, substitua os arquivos mantendo os nomes. Para usar outra quantidade de fotos ou outros nomes, edite a lista de `alt` em `src/data/properties.ts`, ou monte o `ImageAsset` com `src`/`srcSet` próprios. Fotos dos corretores: preencha `photo` em `src/data/brokers.ts` (proporção 4:5). Enquanto isso, eles aparecem com um retrato gráfico com monograma.

Para regenerar as imagens (opcional):

```bash
python3 -m venv .venv && .venv/bin/pip install bpy==4.5.4
cd tools/renders
../../.venv/bin/python run.py house_modern          # renderiza a cena (todas as câmeras)
python3 publish.py                                  # converte para WebP em public/images (requer ImageMagick)
```

## Qualidade

- HTML semântico, link para pular ao conteúdo e navegação completa por teclado, incluindo selects, abas, acordeão, galeria, comparador e diálogos (`<dialog>` nativo com foco preso e Esc).
- Contraste AA, foco visível, `aria-*` nos componentes interativos e suporte a `prefers-reduced-motion`.
- Performance: code splitting por página, imagens WebP responsivas com dimensões declaradas (sem *layout shift*), lazy loading, pré-carregamento só da imagem do hero e vídeo carregado sob demanda.
- SEO: título, descrição, canonical e Open Graph por página, dados estruturados (`RealEstateAgent` e `RealEstateListing`), `sitemap.xml` e `robots.txt`.

Antes de publicar, substitua o domínio `novaimoveis.com.br` em `src/data/company.ts` (`siteUrl`), `index.html`, `public/robots.txt` e `public/sitemap.xml`.
