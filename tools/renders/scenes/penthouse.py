"""Terraço de cobertura com piscina de borda infinita, com vista para o mar ou para o skyline da cidade."""

import bpy

import environments
import kit
from kit import box


def build(view='sea'):
    kit.reset(seed=41)
    deck = kit.mat_wood(light=(0.52, 0.38, 0.26), dark=(0.34, 0.23, 0.14), planks=True, plank_len=2.4, plank_w=0.14,
                        name='tdeck', rough=0.55)
    stone = kit.mat_stone((0.82, 0.79, 0.73), (0.72, 0.68, 0.62), rough=0.45, name='tstone', scale=1.5)
    tile = kit.mat_simple((0.3, 0.52, 0.55), rough=0.2, name='ptile')
    rail = kit.mat_window_glass(tint=(0.88, 0.92, 0.92), reflect=0.14, name='trail')
    plaster = kit.mat_plaster((0.84, 0.82, 0.78), name='pwall')
    frame = kit.mat_simple((0.04, 0.04, 0.04), rough=0.35, metal=0.5, name='pframe')
    glass = kit.mat_window_glass(name='pglass', reflect=0.08)

    # Piso do terraço com recorte da piscina (x -8..3, y -6..-2.6)
    box(-9, -2.6, -0.4, 9, 6, 0, deck, bevel=0)
    box(3, -6.2, -0.4, 9, -2.6, 0, deck, bevel=0)
    box(-9, -6.2, -0.4, -8, -2.6, 0, stone, bevel=0.004)
    box(-8, -2.75, -0.4, 3, -2.6, 0.02, stone, bevel=0.004)
    box(3, -6.2, -0.4, 3.15, -2.6, 0.02, stone, bevel=0.004)
    box(-8, -6.2, -1.2, 3, -2.6, -1.18, tile, bevel=0)
    box(-8, -6.2, -1.2, -7.98, -2.6, 0, tile, bevel=0)
    box(-8, -6.25, -1.4, 3, -6.2, -0.03, tile, bevel=0)  # borda infinita
    box(-8, -6.2, -0.05, 3, -2.6, -0.02, kit.mat_water(color=(0.6, 0.82, 0.84)), bevel=0)
    box(-9.2, -6.6, -1.6, 9.2, -6.2, -0.3, plaster, bevel=0.004)  # calha da borda
    # Guarda-corpo de vidro
    box(3, -6.25, 0, 9, -6.21, 1.1, rail, bevel=0)
    box(9, -6.25, 0, 9.04, 6, 1.1, rail, bevel=0)
    box(-9.04, -6.25, 0, -9.0, 6, 1.1, rail, bevel=0)
    # Volume da cobertura (fundo) com pano de vidro e interior iluminado
    box(-9, 6, 0, 9, 14, 3.4, plaster, bevel=0)
    box(-9.5, 3.2, 3.2, 9.5, 14, 3.55, plaster, bevel=0.01)  # laje/beiral
    box(-8.6, 5.94, 0.05, 8.6, 6.0, 3.15, kit.mat_emission((1.0, 0.84, 0.64), 1.6, name='interiorglow'), bevel=0)
    kit.glazing(-8.6, 5.9, 8.6, 5.9, 0, 3.2, frame, glass, mullions=6, frame=0.04)
    for lx in (-6, 0, 6):
        kit.area_light((lx, 4.8, 3.15), 2.0, 60, size_y=2)

    # Mobiliário externo
    cushion = kit.mat_fabric((0.9, 0.88, 0.83), name='outcush')
    teak = kit.mat_wood(name='teak', light=(0.48, 0.32, 0.18), dark=(0.3, 0.18, 0.09))
    for lx in (4.0, 5.6):
        box(lx, -5.6, 0, lx + 0.75, -3.5, 0.3, teak, bevel=0.008)
        kit.soft_box(lx + 0.02, -5.55, 0.3, lx + 0.73, -3.55, 0.38, cushion, 0.04)
        back = kit.soft_box(lx + 0.02, -3.95, 0.34, lx + 0.73, -3.25, 0.42, cushion, 0.04)
        kit.rotate(back, 38, pivot=(lx, -3.95, 0.38), axis='X')
    kit.cylinder(7.3, -4.5, 0, 0.45, 0.25, teak)
    kit.sofa(-8.2, 2.6, length=3.2, depth=1.0, fabric=cushion, base_mat=teak)
    kit.coffee_table(-6.6, 1.4, length=1.4, depth=0.8, round_=False, height=0.32, mat=stone)
    kit.lounge_chair(-3.6, 0.6, rotation=-90, leather=cushion, wood=teak)
    planter = kit.mat_concrete((0.56, 0.54, 0.5), name='planter')
    for px, py, seed in ((8.2, 5.0, 3), (-8.2, -1.0, 4), (8.2, -2.0, 5)):
        box(px - 0.6, py - 0.6, 0, px + 0.6, py + 0.6, 0.7, planter, bevel=0.01)
        kit.tree(px, py, height=3.4, crown=1.1, seed=200 + seed, leaf_color=(0.2, 0.26, 0.15), trunk_radius=0.06)
    kit.grass_patch(-8.9, 0, -8.0, 5.8, density=260, seed=6, color=(0.28, 0.3, 0.14))

    if view == 'sea':
        kit.turn_around(lambda: environments.seafront(origin_z=42, shore_y=90))
        kit.sky(14, 235, strength=0.2, sun_energy=4.0, sun_color=(1.0, 0.78, 0.58), dust=0.5, air=1.0, ozone=2.6)
    else:
        environments.city(origin_z=72, y0=-260, depth=-2200, width=3200, seed=11, lit=0.0, glow=0.0,
                          haze=((0.76, 0.74, 0.74), 0, 1600), count=600)
        kit.sky(9, 250, strength=0.24, sun_energy=3.8, sun_color=(1.0, 0.74, 0.5), dust=1.0, ozone=2.4)
    bpy.context.scene.cycles.diffuse_bounces = 4


def main(shots=None):
    shots = shots or ['sea-terrace', 'sea-deck', 'city-terrace', 'city-deck']
    if any(s.startswith('sea') for s in shots):
        build('sea')
        if 'sea-terrace' in shots:
            kit.camera((4.2, -1.6, 1.05), target=(-8.0, -6.8, 1.05), lens=22, shift_y=-0.06)
            kit.render('penthouse-sea-terrace', 2400, 1600, samples=128, exposure=-0.2)
        if 'sea-deck' in shots:
            kit.camera((-2.5, 2.5, 1.2), target=(6.0, -7.0, 0.8), lens=26, dof_target=(4.6, -4.4, 0.3), fstop=8)
            kit.render('penthouse-sea-deck', 2400, 1600, samples=128, exposure=-0.2)
    if any(s.startswith('city') for s in shots):
        build('city')
        if 'city-terrace' in shots:
            kit.camera((4.2, -1.6, 1.05), target=(-8.0, -6.8, 1.05), lens=22, shift_y=-0.06)
            kit.render('penthouse-city-terrace', 2400, 1600, samples=128, exposure=0.0)
        if 'city-deck' in shots:
            kit.camera((-2.5, 2.5, 1.2), target=(6.0, -7.0, 0.8), lens=26, dof_target=(4.6, -4.4, 0.3), fstop=8)
            kit.render('penthouse-city-deck', 2400, 1600, samples=128, exposure=0.0)
