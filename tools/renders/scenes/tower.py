"""Torre residencial com lajes em balanço, guarda-corpos de vidro e brises verticais. Versões dia e entardecer."""

import random

import bpy

import environments
import kit
from kit import box


def build(dusk=False):
    kit.reset(seed=31)
    rnd = random.Random(4)
    slab = kit.mat_plaster((0.86, 0.84, 0.8), name='slabwhite', rough=0.7)
    fin = kit.mat_simple((0.42, 0.32, 0.22), rough=0.35, metal=0.8, name='bronze')
    rail = kit.mat_window_glass(tint=(0.85, 0.9, 0.9), reflect=0.12, name='railglass')
    facade = kit.mat_windows_grid(wall=(0.12, 0.11, 0.1), glass=(0.03, 0.035, 0.04), density=0.55 if dusk else 0.0,
                                  strength=4.0 if dusk else 0.0, name='towerglass', bay=2.2, floor=3.3, win_w=0.94,
                                  win_h=0.88)
    soffit = kit.mat_wood(light=(0.55, 0.38, 0.22), dark=(0.38, 0.24, 0.12), name='soffit', direction='X')
    concrete = kit.mat_concrete((0.6, 0.58, 0.55), name='towerbase')
    W, D, F, FH = 22.0, 18.0, 24, 3.3

    # Pódio e térreo com pé-direito duplo
    box(-220, -220, -0.4, 240, 36, 0, kit.mat_concrete((0.46, 0.45, 0.43), name='sidewalk'), bevel=0)
    box(-1, -1, 0, W + 1, D + 1, 0.15, concrete, bevel=0.01)
    lobby = kit.mat_emission((1.0, 0.82, 0.6), 2.5 if dusk else 0.6, name='lobbylight')
    box(1.5, 0.2, 0.15, W - 1.5, D - 1, 6.4, lobby, bevel=0)
    kit.glazing(1.2, 0, W - 1.2, 0, 0.15, 6.5, kit.mat_simple((0.05, 0.05, 0.05), rough=0.4, name='lobbyframe'),
                kit.mat_window_glass(name='lobbyglass', reflect=0.1), mullions=8)
    box(0, -3.5, 6.5, 9, 0.5, 6.8, slab, bevel=0.01)  # marquise
    for i in range(F):
        z = 6.8 + i * FH
        box(0.4, 0.4, z, W - 0.4, D - 0.4, z + FH, facade, bevel=0)
        # laje com balanço frontal e lateral (varandas)
        box(-1.6, -1.8, z + FH - 0.28, W + 1.6, D, z + FH, slab, bevel=0.01)
        box(-1.5, -1.7, z + FH - 0.3, W + 1.5, 0.4, z + FH - 0.28, soffit, bevel=0)
        # guarda-corpo de vidro
        box(-1.55, -1.78, z + FH, W + 1.55, -1.74, z + FH + 1.1, rail, bevel=0)
        box(-1.58, -1.8, z + FH + 1.08, W + 1.58, -1.72, z + FH + 1.12, fin, bevel=0.002)
        box(W + 1.53, -1.8, z + FH, W + 1.57, D, z + FH + 1.1, rail, bevel=0)
    # Brises verticais na lateral e pilares aparentes na frente
    for j in range(16):
        y = 0.6 + j * (D - 1.2) / 15
        box(W + 1.5, y - 0.06, 6.8, W + 1.7, y + 0.06, 6.8 + F * FH, fin, bevel=0.004)
    for j in range(5):
        x = 2 + j * (W - 4) / 4
        box(x - 0.25, -1.5, 6.8, x + 0.25, -1.3, 6.8 + F * FH, slab, bevel=0.01)
    box(-1.8, -2.0, 6.8 + F * FH, W + 1.8, D + 0.2, 6.8 + F * FH + 1.6, slab, bevel=0.01)  # coroamento

    # Jardim e calçada
    box(-6, -9, 0, 30, -7, 0.05, kit.mat_grass((0.09, 0.2, 0.045)), bevel=0)
    for i, x in enumerate((-4, 3, 13, 20, 27)):
        kit.tree(x, -8.5 + rnd.uniform(-0.5, 0.5), height=rnd.uniform(7, 9), crown=2.8, seed=110 + i)
    kit.shrub(9.5, -6.2, radius=1.2, height=1.0, seed=120)
    # Prédios vizinhos
    environments.city(origin_z=0, y0=220, depth=1200, width=1800, seed=5, lit=0.16 if dusk else 0.0,
                      glow=1.0 if dusk else 0.0, count=180, tone=0.4 if dusk else 1.0,
                      glass_roughness=0.4 if dusk else 0.06,
                      haze=((0.018, 0.024, 0.042), 0, 1100) if dusk else ((0.72, 0.78, 0.86), 0, 650))
    for i, x in enumerate((-60, -38, 46, 70, 95)):
        kit.tree(x, 20 + (i % 2) * 18, height=11 + (i % 3), crown=4.2, seed=140 + i)
    if dusk:
        kit.sky(-1.5, 60, strength=1.4, sun_energy=0, air=1.0, dust=1.2, ozone=3.0)
    else:
        kit.sky(48, 150, strength=0.25, sun_energy=4.6, sun_color=(1.0, 0.9, 0.8))
    bpy.context.scene.cycles.diffuse_bounces = 3


def main(shots=None):
    shots = shots or ['day', 'dusk']
    if 'day' in shots:
        build(dusk=False)
        kit.camera((-14.0, -26.0, 1.6), rotation=(112, 0, -24), lens=20)
        kit.render('tower-day', 2400, 1600, samples=128, exposure=0.0)
    if 'dusk' in shots:
        build(dusk=True)
        kit.camera((62.0, -100.0, 1.7), target=(11, 9, 1.7), lens=24, shift_y=0.27)
        kit.render('tower-dusk', 2400, 1600, samples=128, exposure=0.6)
