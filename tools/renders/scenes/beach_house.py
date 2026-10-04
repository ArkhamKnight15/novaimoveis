"""Casa de praia horizontal: volumes baixos de pedra e madeira, pátio com piscina e vegetação de restinga."""

import environments
import kit
from kit import box, glazing


def build():
    kit.reset(seed=71)
    sand = kit.mat_stone((0.82, 0.76, 0.64), (0.72, 0.66, 0.54), rough=0.95, name='sandground', scale=0.4)
    stone = kit.mat_stone((0.66, 0.6, 0.52), (0.5, 0.45, 0.38), rough=0.75, name='beachstone', scale=1.8)
    wood = kit.mat_wood(light=(0.56, 0.4, 0.26), dark=(0.38, 0.26, 0.15), direction='Z', name='beachwood', planks=True,
                        plank_len=0.12, plank_w=6.0, rough=0.6)
    plaster = kit.mat_plaster((0.88, 0.86, 0.82), name='beachplaster')
    deck = kit.mat_wood(light=(0.6, 0.48, 0.34), dark=(0.44, 0.33, 0.22), planks=True, plank_len=2.4, plank_w=0.14,
                        name='beachdeck', rough=0.65)
    frame = kit.mat_simple((0.06, 0.06, 0.06), rough=0.4, metal=0.4, name='bframe2')
    glass = kit.mat_window_glass(name='beachglass', reflect=0.1)
    tile = kit.mat_simple((0.5, 0.72, 0.72), rough=0.2, name='beachtile')

    # Terreno de areia com recorte para a piscina (x 1.8..18.2, y -7.7..-3.3)
    box(-400, -3.3, -0.6, 400, 400, 0, sand, bevel=0)
    box(-400, -32, -0.6, 400, -7.7, 0, sand, bevel=0)
    box(-400, -7.7, -0.6, 1.8, -3.3, 0, sand, bevel=0)
    box(18.2, -7.7, -0.6, 400, -3.3, 0, sand, bevel=0)
    # Deck com recorte para a piscina (x 1.8..18.2, y -7.7..-3.3)
    box(-3, -3.3, -0.05, 25, 0.2, 0.04, deck, bevel=0.003)
    box(-3, -9, -0.05, 25, -7.7, 0.04, deck, bevel=0.003)
    box(-3, -7.7, -0.05, 1.8, -3.3, 0.04, deck, bevel=0.003)
    box(18.2, -7.7, -0.05, 25, -3.3, 0.04, deck, bevel=0.003)
    # Piscina no pátio
    box(2, -7.5, -1.0, 18, -3.5, -0.98, tile, bevel=0)
    for x0, y0, x1, y1 in ((2, -7.5, 18, -7.48), (2, -3.52, 18, -3.5), (2, -7.5, 2.02, -3.5), (17.98, -7.5, 18, -3.5)):
        box(x0, y0, -1.0, x1, y1, 0.04, tile, bevel=0)
    box(2, -7.5, -0.08, 18, -3.5, -0.06, kit.mat_water(color=(0.6, 0.84, 0.84)), bevel=0)
    for x0, y0, x1, y1 in ((1.8, -7.7, 18.2, -7.5), (1.8, -3.5, 18.2, -3.3), (1.8, -7.5, 2.0, -3.5), (18.0, -7.5, 18.2, -3.5)):
        box(x0, y0, 0.04, x1, y1, 0.08, stone, bevel=0.005)

    # Pavilhão principal (x 0..22, y 0..9) com beiral de madeira
    box(0, 0, 0, 22, 9, 3.3, plaster, bevel=0.01)
    box(1.5, -0.02, 0.04, 20.5, 0.4, 3.0, kit.mat_emission((1.0, 0.86, 0.68), 1.2, name='beachglow'), bevel=0)
    glazing(1.5, -0.06, 20.5, -0.06, 0.04, 3.0, frame, glass, mullions=8, frame=0.04)
    box(-0.5, -2.4, 3.3, 22.5, 9.5, 3.55, plaster, bevel=0.01)
    box(-0.45, -2.35, 3.28, 22.45, 9.45, 3.3, wood, bevel=0)  # forro de madeira do beiral
    box(-0.5, -2.4, 3.55, 22.5, -2.3, 3.75, plaster, bevel=0.004)
    # Volumes de pedra nas extremidades
    box(-5, -1, 0, 0, 12, 3.9, stone, bevel=0.01)
    box(22, -1, 0, 26, 9, 3.6, wood, bevel=0.004)
    for cx in (4, 11, 18):
        kit.cylinder(cx, -2.0, 0.04, 3.3, 0.1, frame)
    for lx in (4, 9, 14, 19):
        kit.area_light((lx, -1.2, 3.25), 1.0, 30, size_y=1.0)

    # Mobiliário externo
    cushion = kit.mat_fabric((0.92, 0.9, 0.86), name='bcush')
    teak = kit.mat_wood(name='bteak', light=(0.5, 0.34, 0.2), dark=(0.32, 0.2, 0.1))
    for lx in (5.0, 7.0, 9.0):
        box(lx, -2.9, 0.04, lx + 0.75, -0.8, 0.32, teak, bevel=0.008)
        kit.soft_box(lx + 0.02, -2.85, 0.32, lx + 0.73, -0.85, 0.4, cushion, 0.04)
        back = kit.soft_box(lx + 0.02, -1.25, 0.36, lx + 0.73, -0.55, 0.44, cushion, 0.04)
        kit.rotate(back, 38, pivot=(lx, -1.25, 0.4), axis='X')
    kit.sofa(13.0, -2.3, floor=0.04, length=3.0, depth=0.95, fabric=cushion, base_mat=teak)
    kit.coffee_table(14.5, -0.6, floor=0.04, radius=0.5, height=0.3)

    # Restinga: capins, arbustos baixos e coqueiros estilizados
    green = (0.24, 0.3, 0.12)
    for i in range(14):
        kit.shrub(-8 + i * 3.2, -13 + (i % 3) * 1.4, radius=0.9, height=0.9, seed=300 + i, color=(0.16, 0.24, 0.08))
    kit.grass_patch(-10, -16, 32, -9.5, density=40, seed=8, color=green)
    for i, (px, py) in enumerate(((-7, 4), (28, 2), (29, -6), (-9, -6))):
        kit.tree(px, py, height=8 + i, crown=2.6, seed=320 + i, leaf_color=(0.16, 0.24, 0.08))
    kit.turn_around(lambda: environments.seafront(origin_z=0, shore_y=90, haze=((0.78, 0.82, 0.86), 200, 5000), road=False))


def main(shots=None):
    shots = shots or ['front', 'pool']
    build()
    if 'front' in shots:
        kit.sky(18, 230, strength=0.24, sun_energy=4.2, sun_color=(1.0, 0.8, 0.6))
        kit.camera((25.0, -8.8, 1.5), target=(9, 3, 1.5), lens=22, shift_y=0.1)
        kit.render('beach-front', 2400, 1600, samples=128, exposure=0.0)
    if 'pool' in shots:
        kit.sky(10, 200, strength=0.26, sun_energy=3.6, sun_color=(1.0, 0.7, 0.45), dust=1.4)
        kit.camera((21.6, -2.9, 1.15), target=(2.0, -9.5, 0.8), lens=22, shift_y=-0.02)
        kit.render('beach-pool', 2400, 1600, samples=128, exposure=0.0)
