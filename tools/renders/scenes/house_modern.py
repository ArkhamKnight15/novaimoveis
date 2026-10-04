"""Residência contemporânea: volume de vidro no térreo, caixa em balanço, piscina e jardim.

Variantes:
  jacaranda  caixa branca, núcleo em madeira e brise de cumaru (Residência Jacarandá)
  ipe        caixa revestida em madeira escura, núcleo e muro em pedra clara (Casa Ipê)
  staged=False  a mesma casa vazia, sem paisagismo nem iluminação (o "antes" do case de home staging)
"""

import kit
from kit import box, glazing, slats


def build(variant='jacaranda', staged=True):
    kit.reset(seed=11)
    plaster = kit.mat_plaster((0.83, 0.81, 0.77), name='facade')
    concrete = kit.mat_concrete((0.5, 0.48, 0.45), name='slab', board=True)
    stone = kit.mat_stone((0.42, 0.39, 0.35), (0.3, 0.28, 0.25), rough=0.7, name='wallstone', scale=1.6)
    wood = kit.mat_wood(light=(0.48, 0.3, 0.16), dark=(0.26, 0.15, 0.07), direction='Z', name='cladding', planks=True,
                        plank_len=0.14, plank_w=6.0)
    slat_wood = kit.mat_wood(light=(0.5, 0.32, 0.17), dark=(0.28, 0.16, 0.08), direction='Z', name='slatwood')
    deck = kit.mat_wood(light=(0.5, 0.36, 0.24), dark=(0.33, 0.22, 0.13), planks=True, plank_len=2.4, plank_w=0.14,
                        name='deck', rough=0.6)
    frame = kit.mat_simple((0.03, 0.03, 0.03), rough=0.35, metal=0.5, name='frame')
    glass = kit.mat_window_glass(name='houseglass', reflect=0.08)
    coping = kit.mat_stone((0.8, 0.77, 0.71), (0.7, 0.66, 0.6), rough=0.5, name='coping', scale=2)
    tile = kit.mat_simple((0.42, 0.66, 0.66), rough=0.25, name='pooltile')
    grass = kit.mat_grass((0.09, 0.2, 0.045))
    floor_in = kit.mat_wood(light=(0.62, 0.47, 0.32), dark=(0.45, 0.32, 0.2), planks=True, plank_len=2.2,
                            plank_w=0.2, name='floorin', rough=0.35)
    wall_in = kit.mat_plaster((0.8, 0.77, 0.72), name='wallin')
    if variant == 'ipe':
        plaster = kit.mat_wood(light=(0.24, 0.15, 0.08), dark=(0.12, 0.07, 0.04), direction='Z', name='darkclad',
                               planks=True, plank_len=0.16, plank_w=6.0, rough=0.55)
        wood = kit.mat_stone((0.8, 0.75, 0.66), (0.68, 0.62, 0.52), rough=0.6, name='travfacade', scale=1.4)
        stone = wood
        slat_wood = kit.mat_wood(light=(0.62, 0.46, 0.3), dark=(0.45, 0.31, 0.18), direction='Z', name='slatlight')
    if not staged:
        grass = kit.mat_grass((0.2, 0.22, 0.09), name='grassdry')

    # Terreno: gramado ao redor e recorte para a piscina (x -1..15, y -7..-3)
    box(-900, -900, -0.6, 900, -7.6, 0, grass, bevel=0)
    box(-900, -7.6, -0.6, -2.2, 900, 0, grass, bevel=0)
    box(21.5, -7.6, -0.6, 900, 900, 0, grass, bevel=0)
    box(-2.2, 10.5, -0.6, 21.5, 900, 0, grass, bevel=0)
    # Deck e bordas da piscina
    box(-2.2, -7.6, -0.6, -1.0, 10.5, 0.03, deck, bevel=0.003)
    box(15.0, -7.6, -0.6, 21.5, -0.6, 0.03, deck, bevel=0.003)
    box(-1.0, -2.6, -0.6, 15.0, -0.6, 0.03, deck, bevel=0.003)
    box(-1.0, -7.6, -0.6, 15.0, -7.4, 0.03, deck, bevel=0.003)
    # Piscina
    box(-1.0, -7.4, -0.9, 15.0, -2.6, -0.88, tile, bevel=0)
    box(-1.0, -7.4, -0.9, -0.98, -2.6, 0, tile, bevel=0)
    box(14.98, -7.4, -0.9, 15.0, -2.6, 0, tile, bevel=0)
    box(-1.0, -2.62, -0.9, 15.0, -2.6, 0, tile, bevel=0)
    box(-1.0, -7.4, -0.9, 15.0, -7.38, 0, tile, bevel=0)
    box(-1.0, -7.4, -0.1, 15.0, -2.6, -0.08, kit.mat_water(), bevel=0)
    for x0, y0, x1, y1 in ((-1.25, -7.65, 15.25, -7.4), (-1.25, -2.6, 15.25, -2.35), (-1.25, -7.4, -1.0, -2.6),
                           (15.0, -7.4, 15.25, -2.6)):
        box(x0, y0, 0, x1, y1, 0.05, coping, bevel=0.006)

    # Laje do térreo e piso interno
    box(-1.0, -0.6, -0.6, 21.5, 10.5, 0.06, concrete, bevel=0.01)
    box(0.2, 0.3, 0.06, 15.8, 8.0, 0.08, floor_in, bevel=0)

    # Térreo: pano de vidro frontal (x 0..12) e núcleo revestido em madeira (x 12..16)
    glazing(0, 0, 12, 0, 0.08, 3.25, frame, glass, mullions=6, frame=0.05)
    glazing(0, 0, 0, 8, 0.08, 3.25, frame, glass, mullions=3, frame=0.05)
    box(12, -0.02, 0.08, 16, 0.25, 3.25, wood, bevel=0.002)
    box(15.75, 0, 0.08, 16, 8, 3.25, wood, bevel=0.002)
    box(0, 8, 0.08, 16, 8.3, 3.25, wall_in, bevel=0)
    box(0, 0, 3.25, 16, 8, 3.3, wall_in, bevel=0)  # forro

    # Laje intermediária com beiral
    box(-1.0, -1.4, 3.25, 21.0, 9.0, 3.6, concrete, bevel=0.008)
    # Volume superior branco em balanço (x 4..21)
    box(4.0, -1.0, 3.6, 21.0, 8.6, 6.9, plaster, bevel=0.01)
    box(3.9, -1.1, 6.9, 21.1, 8.7, 7.05, plaster, bevel=0.006)  # platibanda
    # Rasgo horizontal com brise de ripas
    box(6.0, -1.08, 4.1, 19.0, -0.4, 6.5, wall_in, bevel=0)
    glazing(6.0, -0.45, 19.0, -0.45, 4.1, 6.5, frame, glass, mullions=5, frame=0.04)
    slats(6.0, -1.16, 19.0, -1.16, 4.1, 6.5, 64, slat_wood, depth=0.08)
    box(5.9, -1.2, 4.0, 19.1, -0.95, 4.1, frame, bevel=0.002)
    box(5.9, -1.2, 6.5, 19.1, -0.95, 6.6, frame, bevel=0.002)

    # Muro de pedra vertical que ancora a composição
    box(-1.8, -1.6, 0, -1.1, 10.5, 3.6, stone, bevel=0.01)

    # Muro alto de pedra na variante Ipê
    if variant == 'ipe':
        box(-1.8, -1.6, 3.6, -1.1, 10.5, 7.2, stone, bevel=0.01)

    if staged:
        _staging()
    _landscape(staged)


def _staging():
    """Mobiliário, iluminação interna e da piscina — tudo o que o home staging acrescenta."""
    # Interior visível: luz quente, sofá, mesa de jantar e pendentes
    kit.rug(1.2, 1.6, 5.6, 5.4, floor=0.08, color=(0.7, 0.65, 0.58))
    kit.sofa(1.6, 3.6, floor=0.08, length=3.2, depth=1.0)
    kit.coffee_table(3.2, 2.6, floor=0.08, radius=0.55)
    kit.lounge_chair(5.6, 1.4, floor=0.08, rotation=200)
    kit.dining_set(7.6, 3.4, floor=0.08, length=2.6, width=1.0)
    for px in (8.1, 8.9, 9.7):
        kit.pendant(px, 3.9, 3.25, drop=1.35, radius=0.14, shape='globe', glow=9)
    kit.artwork(1.6, 4.6, 7.98, 1.3, 2.6, [(0.82, 0.78, 0.7), (0.62, 0.45, 0.32), (0.25, 0.22, 0.2), (0.86, 0.83, 0.78)],
                'housart', seed=3.0)
    kit.potted_plant(10.8, 1.2, floor=0.08, height=1.8, seed=4)
    kit.floor_lamp(0.9, 4.8, floor=0.08, glow=7)
    for lx in (2.5, 6.5, 10.5, 14):
        kit.area_light((lx, 4.0, 3.2), 1.6, 220, rotation=(0, 0, 0), size_y=4.5)
    # Luz rasante no muro e nas ripas
    kit.area_light((-0.9, -1.0, 0.25), 0.3, 25, rotation=(-80, 0, 0), size_y=0.05)
    for i in range(6):
        kit.point_light((-1.0, -1.0 + i * 1.8, 0.15), 6, radius=0.03)

    # Varanda sob o balanço (x 16..21)
    kit.lounge_chair(17.2, 1.2, floor=0.06, rotation=180)
    kit.lounge_chair(19.0, 1.0, floor=0.06, rotation=165)
    kit.area_light((18.5, 3.0, 3.24), 2.0, 70, size_y=4)

    # Espreguiçadeiras no deck
    lounger = kit.mat_fabric((0.9, 0.88, 0.84), name='loungerfab')
    lframe = kit.mat_simple((0.25, 0.17, 0.1), rough=0.5, name='loungerframe')
    for lx in (16.2, 18.4):
        box(lx, -6.6, 0.03, lx + 0.75, -4.5, 0.3, lframe, bevel=0.008)
        kit.soft_box(lx + 0.02, -6.55, 0.3, lx + 0.73, -4.55, 0.38, lounger, 0.04)
        back = kit.soft_box(lx + 0.02, -4.95, 0.34, lx + 0.73, -4.25, 0.42, lounger, 0.04)
        kit.rotate(back, 38, pivot=(lx, -4.95, 0.38), axis='X')

    # Iluminação da piscina
    for px in (1.5, 5.0, 8.5, 12.0):
        kit.point_light((px, -2.75, -0.45), 22, color=(0.75, 0.95, 1.0), radius=0.08)


def _landscape(staged):
    # Mata ao fundo (existe nos dois estados)
    kit.treeline(-140, 160, 60, count=90, seed=1)
    kit.treeline(-200, 220, 110, count=80, height=(14, 22), seed=2, color=(0.04, 0.07, 0.03))
    kit.treeline(-150, 170, -90, count=80, seed=7)
    kit.treeline_y(-70, -90, 60, count=60, seed=8)
    kit.treeline_y(90, -90, 60, count=60, seed=9)
    if not staged:
        return
    # Paisagismo
    kit.tree(-7.5, 7, height=10, crown=3.6, seed=1)
    kit.tree(-3.0, 16, height=12, crown=4.4, seed=2, leaf_color=(0.09, 0.17, 0.05))
    kit.tree(7, 17, height=13, crown=5.0, seed=3)
    kit.tree(17, 15.5, height=11, crown=4.4, seed=4, leaf_color=(0.12, 0.18, 0.06))
    kit.tree(28, 7, height=9.5, crown=3.8, seed=5)
    kit.tree(30, -10, height=7.5, crown=3.0, seed=6)
    for i, sx in enumerate((22.5, 24.0, 25.5)):
        kit.shrub(sx, -2 + i * 0.8, radius=0.8, height=1.1, seed=20 + i)
    for i in range(7):
        kit.shrub(-2.9, -6 + i * 2.4, radius=0.55, height=0.8, seed=40 + i, color=(0.1, 0.19, 0.06))
    kit.grass_patch(-3.6, -7.6, -2.3, 9, density=120, seed=3, color=(0.2, 0.27, 0.08))
    kit.grass_patch(21.6, -7.6, 23, 9, density=120, seed=4, color=(0.2, 0.26, 0.08))


# nome do arquivo -> (variante, com staging, céu, câmera, resolução, exposição)
GOLDEN_SKY = dict(sun_elevation=12, sun_rotation=78, strength=0.22, sun_energy=4.6, sun_color=(1.0, 0.72, 0.48))
GOLDEN_CAM = dict(location=(24.0, -17.0, 1.6), target=(8, 3, 1.6), lens=26, shift_y=0.12)
SHOTS = {
    'house-dusk': ('jacaranda', True,
                   dict(sun_elevation=0.5, sun_rotation=-35, strength=0.45, sun_energy=0.8, sun_color=(1.0, 0.5, 0.28),
                        air=1.2, dust=1.6, ozone=3.0),
                   dict(location=(-2.0, -17.5, 1.45), target=(10.5, 4, 1.45), lens=22, shift_y=0.12), (2560, 1440), 0.4),
    'house-golden': ('jacaranda', True, GOLDEN_SKY, GOLDEN_CAM, (2400, 1600), 0.1),
    'house-before': ('jacaranda', False,
                     dict(sun_elevation=35, sun_rotation=200, strength=0.3, sun_energy=1.2, sun_color=(0.9, 0.92, 1.0),
                          dust=3.0), GOLDEN_CAM, (2400, 1600), 0.3),
    'house-pool': ('jacaranda', True,
                   dict(sun_elevation=16, sun_rotation=150, strength=0.2, sun_energy=4.2, sun_color=(1.0, 0.8, 0.6)),
                   dict(location=(16.2, -5.2, 0.55), target=(0, -4.2, 0.9), lens=24, shift_y=0.18,
                        dof_target=(10, -5, 0.5), fstop=11), (2400, 1600), 0.0),
    'house-detail': ('jacaranda', True,
                     dict(sun_elevation=24, sun_rotation=200, strength=0.2, sun_energy=4.4, sun_color=(1.0, 0.86, 0.7)),
                     dict(location=(10.0, -8.0, 1.6), rotation=(105, 0, 8), lens=40), (1600, 2000), 0.0),
    'ipe-front': ('ipe', True,
                  dict(sun_elevation=28, sun_rotation=120, strength=0.24, sun_energy=4.4, sun_color=(1.0, 0.88, 0.74)),
                  dict(location=(-6.5, -16.0, 1.5), target=(9, 2, 1.5), lens=24, shift_y=0.1), (2400, 1600), 0.0),
    'ipe-pool': ('ipe', True,
                 dict(sun_elevation=20, sun_rotation=240, strength=0.22, sun_energy=4.4, sun_color=(1.0, 0.82, 0.64)),
                 dict(location=(-2.2, -8.6, 1.0), target=(14, -2.5, 1.2), lens=22, shift_y=0.12), (2400, 1600), 0.0),
}


def main(shots=None):
    names = shots or list(SHOTS)
    current = None
    for name in names:
        variant, staged, sky, cam, (width, height), exposure = SHOTS[name]
        if current != (variant, staged):
            build(variant, staged)
            current = (variant, staged)
        kit.sky(**sky)
        kit.camera(**cam)
        kit.render(name, width, height, samples=128, exposure=exposure, full_res=width >= 2560)
