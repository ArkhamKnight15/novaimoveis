"""Living integrado (estar, jantar e cozinha) com pano de vidro para o jardim. Três paletas de acabamento."""

import bpy

import environments
import kit
from kit import box

PALETTES = {
    'oak': {
        'floor': ((0.66, 0.5, 0.34), (0.5, 0.36, 0.23)),
        'wall': (0.84, 0.82, 0.78),
        'feature': ((0.52, 0.34, 0.19), (0.32, 0.2, 0.1)),
        'sofa': (0.82, 0.78, 0.71),
        'rug': (0.74, 0.69, 0.62),
        'cabinet': ((0.6, 0.44, 0.28), (0.42, 0.29, 0.17)),
        'stone': ((0.86, 0.85, 0.82), (0.55, 0.54, 0.52)),
        'accent': (0.52, 0.36, 0.24),
    },
    'walnut': {
        'floor': ((0.42, 0.28, 0.17), (0.26, 0.16, 0.09)),
        'wall': (0.78, 0.75, 0.7),
        'feature': ((0.75, 0.7, 0.62), (0.62, 0.56, 0.48)),
        'sofa': (0.55, 0.5, 0.45),
        'rug': (0.62, 0.58, 0.52),
        'cabinet': ((0.07, 0.07, 0.07), (0.05, 0.05, 0.05)),
        'stone': ((0.32, 0.3, 0.28), (0.72, 0.7, 0.66)),
        'accent': (0.62, 0.48, 0.3),
    },
    'ash': {
        'floor': ((0.74, 0.72, 0.68), (0.66, 0.64, 0.6)),
        'wall': (0.88, 0.87, 0.85),
        'feature': ((0.8, 0.74, 0.64), (0.7, 0.63, 0.52)),
        'sofa': (0.9, 0.88, 0.84),
        'rug': (0.56, 0.55, 0.53),
        'cabinet': ((0.78, 0.66, 0.5), (0.66, 0.53, 0.38)),
        'stone': ((0.93, 0.92, 0.9), (0.6, 0.58, 0.56)),
        'accent': (0.2, 0.3, 0.32),
    },
}


def build(palette='oak', sun=(32, 125), view='garden', raw=False):
    p = PALETTES[palette]
    kit.reset(seed=3)
    if palette == 'ash':
        floor = kit.mat_stone(p['floor'][0], p['floor'][1], rough=0.3, name='floor', scale=0.6)
    else:
        floor = kit.mat_wood(light=p['floor'][0], dark=p['floor'][1], planks=True, plank_len=2.6, plank_w=0.24,
                             direction='Y', name='floor', rough=0.32, coat=0.1)
    if raw:
        floor = kit.mat_concrete((0.46, 0.44, 0.41), name='screed')
    wall = kit.mat_plaster(p['wall'], name='wall', rough=0.92) if not raw else kit.mat_concrete((0.62, 0.6, 0.57),
                                                                                                 name='rawwall')
    ceiling = kit.mat_plaster((0.88, 0.87, 0.84), name='ceiling')
    if palette in ('walnut', 'ash'):
        feature = kit.mat_stone(p['feature'][0], p['feature'][1], rough=0.6, name='feature', scale=1.2)
    else:
        feature = kit.mat_wood(light=p['feature'][0], dark=p['feature'][1], direction='Z', name='feature', rough=0.5)
    frame = kit.mat_simple((0.04, 0.04, 0.04), rough=0.35, metal=0.4, name='frame')
    glass = kit.mat_window_glass(name='glass', reflect=0.06)
    cabinet = kit.mat_wood(light=p['cabinet'][0], dark=p['cabinet'][1], direction='Z', name='cabinet', rough=0.45)
    stone = kit.mat_stone(p['stone'][0], p['stone'][1], rough=0.2, marble=True, name='countertop', scale=0.8)
    black = kit.mat_simple((0.03, 0.03, 0.03), rough=0.25, name='blackglass', coat=0.6)

    W, D, H = 12.0, 8.0, 3.4
    # Envoltória
    box(-0.3, -0.3, -0.2, W + 0.3, D + 0.3, 0, floor, bevel=0)
    box(-0.3, -0.3, H, W + 0.3, D + 0.3, H + 0.3, ceiling, bevel=0)
    box(-0.3, -0.3, 0, W + 0.3, 0, H, wall, bevel=0)
    box(W, -0.3, 0, W + 0.3, D, H, wall, bevel=0)
    # Parede lateral esquerda com painel de destaque (ripado ou pedra)
    box(-0.3, 0, 0, 0, D, H, wall, bevel=0)
    if palette in ('walnut', 'ash') and not raw:
        box(0, 0.6, 0, 0.04, 7.4, H, feature, bevel=0.002)
    elif not raw:
        kit.slats(0.0, 0.6, 0.0, 7.4, 0, H, 70, feature, depth=0.05, axis='Y')
        box(-0.01, 0.6, 0, 0.0, 7.4, H, kit.mat_simple((0.06, 0.05, 0.04), rough=0.8, name='slatback'), bevel=0)
    # Rasgo de luz no forro
    box(1.0, 0.9, H - 0.03, 11.0, 1.0, H - 0.01, kit.mat_emission((1.0, 0.86, 0.68), 4.0, name='slot'), bevel=0)

    # Pano de vidro do fundo (y = D) e jardim
    box(-0.3, D, 0, 0.3, D + 0.3, H, wall, bevel=0)
    box(W - 0.3, D, 0, W + 0.3, D + 0.3, H, wall, bevel=0)
    kit.glazing(0.3, D, W - 0.3, D, 0, H, frame, glass, mullions=5, frame=0.045)
    portal = kit.area_light((W / 2, D + 0.2, H / 2), W - 0.6, 1.0, rotation=(90, 0, 0), size_y=H)
    portal.data.cycles.is_portal = True

    if view == 'garden':
        environments.garden(D + 0.3, x_center=W / 2)
    elif view == 'sea':
        environments.seafront(origin_z=38, shore_y=120)
        box(-20, D + 0.3, -0.25, W + 20, D + 4.5, -0.02, kit.mat_wood(name='balcony', light=(0.5, 0.4, 0.3),
                                                                     dark=(0.36, 0.27, 0.19)), bevel=0)
        box(-20, D + 4.5, -0.02, W + 20, D + 4.56, 1.05, kit.mat_window_glass(name='balcrail', reflect=0.12), bevel=0)
    else:
        environments.city(origin_z=70, y0=D + 60, seed=7, lit=0.12, glow=2.0)
        box(-20, D + 0.3, -0.25, W + 20, D + 3.0, -0.02, kit.mat_concrete((0.6, 0.58, 0.55), name='balc'), bevel=0)
        box(-20, D + 3.0, -0.02, W + 20, D + 3.06, 1.05, kit.mat_window_glass(name='balcrail', reflect=0.12), bevel=0)

    if raw:
        _construction_site(W, D, H)
        _sky(view, sun)
        return

    # Estar
    kit.rug(1.0, 1.8, 5.6, 6.4, color=p['rug'])
    sofa_fabric = kit.mat_fabric(p['sofa'], name='sofa')
    kit.sofa(1.85, 2.3, length=3.4, depth=1.05, rotation=90, fabric=sofa_fabric)
    kit.coffee_table(3.2, 4.0, radius=0.6, height=0.32)
    kit.coffee_table(3.9, 3.2, radius=0.32, height=0.42, mat=kit.mat_simple((0.08, 0.07, 0.06), rough=0.3, name='sidetable'))
    kit.vase(3.1, 3.9, 0.32, height=0.28, radius=0.08)
    kit.books(3.3, 4.15, 0.32, length=0.3, depth=0.2, seed=2)
    kit.lounge_chair(4.7, 3.2, rotation=-90)
    kit.lounge_chair(4.7, 5.0, rotation=-90)
    kit.floor_lamp(0.7, 6.3, glow=4)
    kit.potted_plant(0.75, 7.25, height=2.1, seed=5)
    kit.potted_plant(11.2, 7.3, height=1.6, seed=6)
    # Aparador baixo
    box(6.6, 0.05, 0, 9.4, 0.5, 0.55, cabinet, bevel=0.006)
    kit.vase(7.0, 0.27, 0.55, height=0.42, radius=0.1)
    kit.vase(7.35, 0.27, 0.55, height=0.22, radius=0.1, shape='round',
             mat=kit.mat_simple(p['accent'], rough=0.5, name='vaseaccent'))
    kit.books(8.2, 0.08, 0.55, length=0.6, depth=0.3, seed=4)
    kit.artwork(6.9, 9.1, 0.0, 1.0, 2.5, [(0.85, 0.82, 0.76), (0.7, 0.6, 0.48), (0.3, 0.27, 0.24), (0.86, 0.84, 0.8)],
                'art1', toward=1, seed=1.5)

    # Jantar
    kit.dining_set(5.6, 5.6, length=2.6, width=1.05)
    for px in (6.3, 6.9, 7.5):
        kit.pendant(px + 0.1, 6.12, H, drop=1.45, radius=0.13, shape='globe', glow=5)

    # Cozinha (parede x = W)
    box(W - 0.65, 0.2, 0, W, 4.6, 2.7, cabinet, bevel=0.004)
    for yy in (1.3, 2.4, 3.5):
        box(W - 0.66, yy - 0.004, 0.05, W - 0.65, yy + 0.004, 2.65, kit.mat_simple((0.02, 0.02, 0.02), name='gap'), bevel=0)
    box(W - 0.67, 1.35, 0.95, W - 0.65, 2.35, 2.2, black, bevel=0.002)
    box(W - 0.65, 4.6, 0, W, 6.6, 0.9, cabinet, bevel=0.004)
    box(W - 0.7, 4.6, 0.9, W, 6.6, 0.94, stone, bevel=0.003)
    box(W - 0.02, 4.6, 0.94, W, 6.6, 1.6, stone, bevel=0)
    # Ilha com tampo de pedra em cascata
    box(8.9, 1.2, 0, 10.1, 4.2, 0.9, cabinet, bevel=0.004)
    box(8.85, 1.15, 0.9, 10.15, 4.25, 0.95, stone, bevel=0.003)
    box(8.85, 1.15, 0, 10.15, 1.2, 0.9, stone, bevel=0.002)
    box(8.85, 4.2, 0, 10.15, 4.25, 0.9, stone, bevel=0.002)
    stool = kit.mat_fabric((0.3, 0.27, 0.24), name='stool')
    for sy in (1.7, 2.7, 3.7):
        kit.cylinder(8.45, sy, 0, 0.62, 0.02, frame, vertices=8)
        kit.cylinder(8.45, sy, 0.0, 0.02, 0.2, frame)
        kit.cylinder(8.45, sy, 0.62, 0.7, 0.2, stool, bevel=0.02)
    for py in (1.9, 2.7, 3.5):
        kit.pendant(9.5, py, H, drop=1.25, radius=0.15, shape='dome')
    kit.vase(9.6, 3.6, 0.95, height=0.3, radius=0.06)
    box(9.2, 1.6, 0.95, 9.7, 1.95, 0.99, kit.mat_wood(name='board', light=(0.6, 0.45, 0.3), dark=(0.45, 0.3, 0.18)))

    _sky(view, sun)
    kit.area_light((6, 4, H - 0.02), 6, 120, rotation=(0, 0, 0), size_y=4, color=(1.0, 0.9, 0.78))


def _sky(view, sun):
    if view == 'sea':
        kit.sky(24, 120, strength=0.24, sun_energy=4.0, sun_color=(1.0, 0.86, 0.7), dust=0.6, ozone=2.0)
    else:
        kit.sky(sun[0], sun[1], strength=0.32, sun_energy=4.5, sun_color=(1.0, 0.86, 0.7))
    sc = bpy.context.scene
    sc.cycles.diffuse_bounces = 6
    sc.cycles.adaptive_threshold = 0.015


def _construction_site(W, D, H):
    """Estado "antes" da reforma: sem acabamentos nem móveis, com materiais de obra."""
    tarp = kit.mat_simple((0.7, 0.7, 0.68), rough=0.6, name='tarp')
    box(2.0, 2.5, 0, 6.5, 6.0, 0.02, tarp, bevel=0)
    for bx, by in ((7.2, 2.0), (7.6, 2.3), (3.0, 7.0)):
        kit.cylinder(bx, by, 0, 0.36, 0.15, kit.mat_simple((0.86, 0.84, 0.8), rough=0.5, name='bucket'))
    ladder = kit.mat_simple((0.7, 0.68, 0.64), rough=0.4, metal=0.8, name='ladder')
    for side in (0, 0.5):
        kit.beam((5.0 + side, 4.0, 0), (5.0 + side, 4.6, 2.2), 0.04, 0.06, ladder)
    for i in range(6):
        z = 0.3 + i * 0.32
        box(5.0, 4.0 + z * 0.27, z, 5.5, 4.05 + z * 0.27, z + 0.03, ladder, bevel=0)
    plank = kit.mat_wood(name='rawplank', light=(0.62, 0.5, 0.34), dark=(0.48, 0.36, 0.22))
    for i in range(3):
        box(8.0, 5.0 + i * 0.3, 0, 11.0, 5.25 + i * 0.3, 0.04, plank, bevel=0.003)
    kit.cylinder(6.0, 4.0, 1.9, H, 0.004, ladder)
    kit.sphere(6.0, 4.0, 1.86, 0.05, kit.mat_emission((1.0, 0.85, 0.65), 30, name='bulb'))
    kit.point_light((6.0, 4.0, 1.83), 60, (1.0, 0.8, 0.6), radius=0.03)


CAMERAS = {
    'living': dict(location=(6.9, 0.45, 1.3), target=(1.4, 6.9, 1.3), lens=20, shift_y=0.05),
    'living-alt': dict(location=(0.7, 0.8, 1.35), target=(6.5, 7.2, 1.2), lens=22, shift_y=0.04),
    'kitchen': dict(location=(3.6, 0.7, 1.35), target=(11.0, 4.0, 1.35), lens=24, shift_y=0.02),
    'dining': dict(location=(1.6, 0.9, 1.4), target=(7.4, 6.6, 1.2), lens=28, dof_target=(6.9, 6.0, 0.8), fstop=4),
    'view': dict(location=(3.0, 1.0, 1.35), target=(5.0, 9.0, 1.35), lens=24, shift_y=0.03),
    'kitchen-alt': dict(location=(10.7, 6.2, 1.45), target=(8.2, 0.4, 1.1), lens=22, shift_y=0.03),
}

# nome do arquivo -> (paleta, vista, câmera, sol)
SHOTS = {
    'living-oak': ('oak', 'garden', 'living', (30, 125)),
    'kitchen-oak': ('oak', 'garden', 'kitchen', (30, 125)),
    'dining-oak': ('oak', 'garden', 'dining', (30, 125)),
    'living-walnut': ('walnut', 'city', 'living', (22, 220)),
    'kitchen-walnut': ('walnut', 'city', 'kitchen', (22, 220)),
    'dining-walnut': ('walnut', 'city', 'dining', (22, 220)),
    'living-ash': ('ash', 'garden', 'living-alt', (40, 150)),
    'kitchen-ash': ('ash', 'garden', 'kitchen', (40, 150)),
    'living-sea': ('oak', 'sea', 'view', (8, 20)),
    'dining-sea': ('ash', 'sea', 'dining', (8, 20)),
    'living-city': ('walnut', 'city', 'living-alt', (18, 250)),
    'living-raw': ('walnut', 'city', 'living', (22, 220)),
    'dining-ash-city': ('ash', 'city', 'dining', (30, 200)),
    'kitchen-walnut-alt': ('walnut', 'city', 'kitchen-alt', (22, 220)),
    'living-oak-city': ('oak', 'city', 'living-alt', (16, 240)),
    'living-oak-alt': ('oak', 'garden', 'living-alt', (34, 140)),
    'kitchen-oak-alt': ('oak', 'garden', 'kitchen-alt', (34, 140)),
}


def main(shots=None):
    shots = shots or list(SHOTS)
    groups = {}
    for name in shots:
        palette, view, cam, sun = SHOTS[name]
        groups.setdefault((palette, view, sun, name == 'living-raw'), []).append((name, cam))
    for (palette, view, sun, raw), items in groups.items():
        build(palette, sun=sun, view=view, raw=raw)
        for name, cam in items:
            kit.camera(**CAMERAS[cam])
            kit.render(name, 2400, 1600, samples=128, exposure=0.35 if view != 'sea' else 0.15)
