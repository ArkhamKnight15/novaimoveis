"""Converte os renders (PNG) em WebP responsivo dentro de public/images.

    python publish.py [pasta-dos-renders]

Cada destino recebe uma versão por largura (ex.: 01-800.webp e 01-1600.webp), que é a
convenção usada por `image()` em src/lib/images.ts. Requer o ImageMagick (`convert`).
"""

import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUBLIC = os.path.join(ROOT, 'public', 'images')
SOURCE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')

LANDSCAPE = (800, 1600)

PROPERTIES = {
    'residencia-jacaranda-alto-de-pinheiros': ['house-golden', 'house-pool', 'living-oak', 'kitchen-oak', 'dining-oak',
                                               'bedroom-oak'],
    'apartamento-lumiere-vila-nova-conceicao': ['tower-day', 'living-walnut', 'kitchen-walnut', 'dining-walnut',
                                                'bedroom-walnut'],
    'cobertura-atlantica-leblon': ['penthouse-sea-terrace', 'living-sea', 'penthouse-sea-deck', 'bedroom-ash'],
    'loft-galeria-vila-madalena': ['loft-wide', 'loft-mezzanine', 'loft-kitchen', 'loft-living'],
    'casa-ipe-tambore': ['ipe-front', 'ipe-pool', 'living-ash', 'kitchen-ash'],
    'studio-itaim-bibi': ['studio-living', 'studio-kitchen', 'studio-bed', 'studio-view'],
    'casa-mare-jurere-internacional': ['beach-front', 'beach-pool', 'dining-sea', 'bedroom-mare'],
    'apartamento-europa-jardim-europa': ['living-city', 'dining-ash-city', 'kitchen-walnut-alt'],
    'cobertura-batel-curitiba': ['penthouse-city-terrace', 'living-oak-city', 'penthouse-city-deck', 'bedroom-walnut-alt'],
    'residencial-serra-lourdes': ['tower-dusk', 'living-oak-alt', 'kitchen-oak-alt'],
}

SECTIONS = {
    'sections/about': ('tower-dusk', LANDSCAPE, None),
    'sections/about-detail': ('house-detail', (600, 1200), None),
    'sections/cta': ('penthouse-sea-deck', LANDSCAPE, None),
    'sections/why-curadoria': ('house-pool', LANDSCAPE, None),
    'sections/why-atendimento': ('dining-oak', LANDSCAPE, None),
    'sections/why-especialistas': ('tower-day', LANDSCAPE, None),
    'sections/why-negociacao': ('kitchen-walnut', LANDSCAPE, None),
    'sections/why-tecnologia': ('loft-wide', LANDSCAPE, None),
    'cases/retrofit-before': ('living-raw', LANDSCAPE, None),
    'cases/retrofit-after': ('living-walnut', LANDSCAPE, None),
    'cases/loft-before': ('loft-raw', LANDSCAPE, None),
    'cases/loft-after': ('loft-wide', LANDSCAPE, None),
    'cases/staging-before': ('house-before', LANDSCAPE, None),
    'cases/staging-after': ('house-golden', LANDSCAPE, None),
    'hero/hero': ('house-dusk', (960, 1920, 2560), None),
    # Recorte vertical (2:3) para celulares, centrado no interior iluminado
    'hero/hero-mobile': ('house-dusk', (720, 960), '960x1440+700+0'),
}


# Céus e degradês escuros do hero pedem mais qualidade e um grão fino de filme para não
# formar faixas (banding) na compressão.
QUALITY = {'hero/hero': 90, 'hero/hero-mobile': 90}
GRAIN = {'hero/hero': 0.3, 'hero/hero-mobile': 0.3}


def convert(render, dest, widths, crop=None):
    source = os.path.join(SOURCE, f'{render}.png')
    if not os.path.exists(source):
        print(f'  ausente: {render}.png -> {dest}')
        return
    os.makedirs(os.path.dirname(os.path.join(PUBLIC, dest)), exist_ok=True)
    for width in widths:
        target = os.path.join(PUBLIC, f'{dest}-{width}.webp')
        command = ['convert', source]
        if crop:
            # O recorte é definido sobre a imagem normalizada para 2560 px de largura.
            command += ['-resize', '2560x', '-crop', crop, '+repage']
        quality = str(QUALITY.get(dest, 80))
        command += ['-resize', f'{width}x']
        if dest in GRAIN:
            command += ['-attenuate', str(GRAIN[dest]), '+noise', 'Gaussian']
        command += ['-strip', '-quality', quality, '-define', 'webp:method=6',
                    '-define', 'webp:use-sharp-yuv=true', target]
        subprocess.run(command, check=True)
    print(f'  {render} -> {dest}')


def main():
    for slug, renders in PROPERTIES.items():
        for index, render in enumerate(renders, start=1):
            convert(render, f'properties/{slug}/{index:02d}', LANDSCAPE)
    for dest, (render, widths, crop) in SECTIONS.items():
        convert(render, dest, widths, crop)


if __name__ == '__main__':
    main()
