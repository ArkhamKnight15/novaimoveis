"""Suítes e banheiros: quarto com painel de cabeceira e banheiro com banheira de imersão."""

import bpy

import environments
import kit
from kit import box

BEDROOM_PALETTES = {
    'oak': dict(floor=((0.66, 0.5, 0.34), (0.5, 0.36, 0.23)), wall=(0.85, 0.83, 0.79), panel=((0.55, 0.38, 0.22),
                (0.36, 0.23, 0.12)), linen=(0.93, 0.91, 0.87), throw=(0.62, 0.52, 0.42), rug=(0.78, 0.74, 0.68)),
    'walnut': dict(floor=((0.42, 0.28, 0.17), (0.26, 0.16, 0.09)), wall=(0.74, 0.71, 0.66), panel=((0.36, 0.23, 0.13),
                   (0.2, 0.12, 0.06)), linen=(0.88, 0.86, 0.82), throw=(0.3, 0.32, 0.3), rug=(0.6, 0.57, 0.52)),
    'ash': dict(floor=((0.76, 0.66, 0.52), (0.64, 0.54, 0.4)), wall=(0.9, 0.89, 0.87), panel=((0.82, 0.78, 0.72),
                (0.74, 0.7, 0.64)), linen=(0.95, 0.94, 0.92), throw=(0.42, 0.5, 0.52), rug=(0.7, 0.68, 0.64)),
}


def bedroom(palette='oak', view='garden'):
    kit.reset(seed=51)
    p = BEDROOM_PALETTES[palette]
    W, D, H = 6.0, 5.5, 3.0
    floor = kit.mat_wood(light=p['floor'][0], dark=p['floor'][1], planks=True, plank_len=2.2, plank_w=0.2,
                         direction='X', name='bfloor', rough=0.38)
    wall = kit.mat_plaster(p['wall'], name='bwall')
    panel = kit.mat_wood(light=p['panel'][0], dark=p['panel'][1], direction='Z', name='bpanel', rough=0.5)
    frame = kit.mat_simple((0.04, 0.04, 0.04), rough=0.35, metal=0.4, name='bframe')
    glass = kit.mat_window_glass(name='bglass', reflect=0.06)
    box(-0.3, -0.3, -0.2, W + 0.3, D + 0.3, 0, floor, bevel=0)
    box(-0.3, -0.3, H, W + 0.3, D + 0.3, H + 0.3, kit.mat_plaster((0.88, 0.87, 0.84), name='bceil'), bevel=0)
    box(-0.3, -0.3, 0, 0, D, H, wall, bevel=0)
    box(-0.3, -0.3, 0, W + 0.3, 0, H, wall, bevel=0)
    box(-0.3, D, 0, W + 0.3, D + 0.3, H, wall, bevel=0)
    # Painel de cabeceira com nichos iluminados
    box(0.6, D - 0.12, 0, 4.6, D, H, panel, bevel=0.003)
    box(0.6, D - 0.14, 2.2, 4.6, D - 0.12, 2.22, kit.mat_emission((1.0, 0.82, 0.6), 6, name='bledge'), bevel=0)
    # Pano de vidro lateral (x = W) com cortina leve
    kit.glazing(W, 0.2, W, D - 0.2, 0, H, frame, glass, mullions=3, frame=0.04)
    box(W, -0.3, 0, W + 0.3, 0.2, H, wall, bevel=0)
    box(W, D - 0.2, 0, W + 0.3, D + 0.3, H, wall, bevel=0)
    portal = kit.area_light((W + 0.2, D / 2, H / 2), D - 0.4, 1.0, rotation=(90, 0, 90), size_y=H)
    portal.data.cycles.is_portal = True
    sheer = kit.mat_sheer()
    curtain = kit.curtain(0.0, 1.8, 0, 0.02, H - 0.05, sheer, folds=10, amplitude=0.06)
    curtain.rotation_euler = (0, 0, 1.5708)
    curtain.location = (W - 0.25, D - 1.9, 0)

    if view == 'garden':
        kit.turn_around(lambda: environments.garden(W + 0.3, width=30, x_center=-D / 2), degrees=-90)
    elif view == 'sea':
        kit.turn_around(lambda: environments.seafront(origin_z=38, shore_y=110), degrees=-90)
    else:
        kit.turn_around(lambda: environments.city(origin_z=50, y0=50, seed=13, lit=0.1, glow=2.0), degrees=-90)

    linen = kit.mat_fabric(p['linen'], name='blinen')
    throw = kit.mat_fabric(p['throw'], name='bthrow')
    kit.rug(1.0, 1.4, 4.4, 5.0, color=p['rug'])
    kit.bed(1.65, D - 0.12 - 2.1, width=1.9, length=2.1, linen=linen, throw=throw, frame_mat=panel)
    side = kit.mat_wood(name='bside', light=p['panel'][0], dark=p['panel'][1])
    for nx in (0.85, 3.85):
        box(nx, D - 0.6, 0, nx + 0.6, D - 0.14, 0.5, side, bevel=0.006)
        kit.cylinder(nx + 0.3, D - 0.37, 0.5, 0.82, 0.03, kit.mat_simple((0.6, 0.5, 0.36), rough=0.3, metal=1, name='brass2'))
        kit.cylinder(nx + 0.3, D - 0.37, 0.8, 1.02, 0.15, kit.mat_glow_shade((1.0, 0.9, 0.76), 4, name='bshade'),
                     radius_top=0.12)
        kit.point_light((nx + 0.3, D - 0.37, 0.9), 12, radius=0.05)
    kit.books(0.95, D - 0.55, 0.5, length=0.18, depth=0.2, seed=11)
    kit.vase(4.3, D - 0.4, 0.5, height=0.2, radius=0.06)
    bench = kit.mat_fabric((0.5, 0.42, 0.34), name='bbench')
    kit.soft_box(1.85, 1.75, 0.0, 3.35, 2.2, 0.45, bench, 0.03)
    kit.lounge_chair(4.7, 1.0, rotation=135, leather=kit.mat_fabric((0.82, 0.8, 0.76), name='bchair'))
    kit.potted_plant(5.5, 4.9, height=1.7, seed=12)
    # Cômoda baixa e tela na parede oposta à janela (x = 0)
    box(0, 1.5, 0, 0.45, 3.1, 0.72, side, bevel=0.006)
    kit.vase(0.22, 1.75, 0.72, height=0.32, radius=0.07)
    kit.books(0.06, 2.55, 0.72, length=0.3, depth=0.22, rotation=90, seed=14)
    art = kit.mat_art([(0.3, 0.27, 0.24), (0.86, 0.83, 0.78), p['throw'], (0.9, 0.88, 0.84)], 'bart', seed=3.0)
    box(0, 1.6, 1.15, 0.035, 3.0, 2.25, art, bevel=0.003, name='Art')
    box(0, 1.575, 1.125, 0.03, 3.025, 2.275, kit.mat_simple((0.08, 0.07, 0.06), rough=0.5, name='frame'), bevel=0.002,
        name='Frame')
    kit.sky(24, 270, strength=0.3, sun_energy=4.5, sun_color=(1.0, 0.86, 0.7))
    fill = kit.area_light((W / 2, D / 2, H - 0.05), 3, 60, size_y=3, color=(1.0, 0.88, 0.76))
    fill.visible_glossy = False  # sem o retângulo refletido no vidro
    bpy.context.scene.cycles.diffuse_bounces = 6


def bathroom(palette='travertine'):
    kit.reset(seed=61)
    W, D, H = 4.6, 4.2, 2.9
    if palette == 'travertine':
        wall = kit.mat_stone((0.8, 0.73, 0.62), (0.68, 0.6, 0.48), rough=0.5, name='trav', scale=1.2)
        floor = kit.mat_stone((0.74, 0.68, 0.58), (0.62, 0.55, 0.45), rough=0.5, name='travfloor', scale=1.5)
        vanity = kit.mat_wood(name='vwood', light=(0.5, 0.34, 0.2), dark=(0.32, 0.2, 0.1))
    else:
        wall = kit.mat_stone((0.9, 0.89, 0.87), (0.5, 0.49, 0.48), rough=0.15, marble=True, name='marble', scale=0.7)
        floor = kit.mat_stone((0.86, 0.85, 0.83), (0.45, 0.44, 0.43), rough=0.2, marble=True, name='marblef', scale=0.6)
        vanity = kit.mat_simple((0.06, 0.06, 0.06), rough=0.4, name='vblack')
    ceramic = kit.mat_simple((0.95, 0.94, 0.92), rough=0.12, name='ceramicw', coat=0.5)
    brass = kit.mat_simple((0.72, 0.56, 0.32), rough=0.25, metal=1.0, name='bbrass')
    mirror = kit.mat_simple((0.9, 0.9, 0.9), rough=0.02, metal=1.0, name='mirror')
    frame = kit.mat_simple((0.04, 0.04, 0.04), rough=0.35, metal=0.4, name='baframe')
    box(-0.3, -0.3, -0.2, W + 0.3, D + 0.3, 0, floor, bevel=0)
    box(-0.3, -0.3, H, W + 0.3, D + 0.3, H + 0.3, kit.mat_plaster((0.88, 0.87, 0.84), name='baceil'), bevel=0)
    box(-0.3, -0.3, 0, 0, D, H, wall, bevel=0)
    box(-0.3, -0.3, 0, W + 0.3, 0, H, wall, bevel=0)
    box(W, -0.3, 0, W + 0.3, D, H, wall, bevel=0)
    # Parede do fundo com janela horizontal
    box(-0.3, D, 0, W + 0.3, D + 0.3, 0.9, wall, bevel=0)
    box(-0.3, D, 2.4, W + 0.3, D + 0.3, H, wall, bevel=0)
    box(-0.3, D, 0.9, 0.6, D + 0.3, 2.4, wall, bevel=0)
    box(W - 0.6, D, 0.9, W + 0.3, D + 0.3, 2.4, wall, bevel=0)
    kit.glazing(0.6, D + 0.1, W - 0.6, D + 0.1, 0.9, 2.4, frame, kit.mat_window_glass(name='baglass'), mullions=2)
    portal = kit.area_light((W / 2, D + 0.25, 1.65), W - 1.2, 1.0, rotation=(90, 0, 0), size_y=1.5)
    portal.data.cycles.is_portal = True
    environments.garden(D + 0.3, width=20, x_center=W / 2)
    # Banheira oval
    tub = kit.cylinder(2.3, 2.9, 0, 0.58, 1.0, ceramic, vertices=64, bevel=0.02)
    tub.scale = (0.9, 0.42, 1)
    inner = kit.cylinder(2.3, 2.9, 0.2, 0.54, 0.92, kit.mat_simple((0.9, 0.93, 0.93), rough=0.05, name='tubwater'),
                         vertices=64)
    inner.scale = (0.9, 0.42, 1)
    kit.cylinder(3.25, 2.55, 0, 1.0, 0.012, brass, vertices=12)
    kit.beam((3.25, 2.55, 1.0), (3.05, 2.65, 1.0), 0.02, 0.02, brass)
    # Bancada com cubas e espelho (parede x = 0)
    box(0, 0.4, 0.55, 0.55, 2.6, 0.85, vanity, bevel=0.005)
    box(0, 0.4, 0.85, 0.56, 2.6, 0.88, wall, bevel=0.003)
    for vy in (0.95, 2.05):
        kit.cylinder(0.3, vy, 0.88, 1.02, 0.2, ceramic, vertices=48, bevel=0.01)
        kit.beam((0.02, vy, 1.15), (0.2, vy, 1.15), 0.02, 0.02, brass)
    box(0, 0.5, 1.15, 0.02, 2.5, 2.2, mirror, bevel=0)
    kit.area_light((0.05, 1.5, 2.24), 2.0, 40, rotation=(0, 0, 0), size_y=0.1, color=(1.0, 0.86, 0.68))
    towel = kit.mat_fabric((0.9, 0.88, 0.84), name='towel')
    kit.soft_box(4.0, 0.8, 0.0, 4.5, 1.25, 0.5, kit.mat_wood(name='stool2', light=(0.5, 0.34, 0.2), dark=(0.32, 0.2, 0.1)), 0.02)
    kit.soft_box(4.08, 0.85, 0.5, 4.42, 1.2, 0.6, towel, 0.03)
    kit.potted_plant(4.2, 3.7, height=1.3, seed=21)
    kit.vase(0.3, 1.5, 0.88, height=0.18, radius=0.05)
    kit.sky(30, 180, strength=0.3, sun_energy=4.2, sun_color=(1.0, 0.88, 0.74))
    bpy.context.scene.cycles.diffuse_bounces = 6


CAMERAS = {
    'bedroom': dict(location=(0.45, 0.4, 1.3), target=(4.4, 4.3, 1.0), lens=22, shift_y=0.02),
    'bedroom-alt': dict(location=(5.6, 1.9, 1.35), target=(1.4, 4.4, 0.95), lens=22, shift_y=0.02),
    'bath': dict(location=(4.3, 0.3, 1.35), target=(1.8, 3.4, 1.0), lens=22, shift_y=0.02),
    'bath-alt': dict(location=(0.7, 0.35, 1.35), target=(3.2, 3.6, 1.0), lens=22, shift_y=0.02),
}

# nome do arquivo -> (tipo de cômodo, parâmetros, câmera)
SHOTS = {
    'bedroom-oak': ('bedroom', dict(palette='oak', view='garden'), 'bedroom'),
    'bedroom-walnut': ('bedroom', dict(palette='walnut', view='city'), 'bedroom'),
    'bedroom-walnut-alt': ('bedroom', dict(palette='walnut', view='city'), 'bedroom-alt'),
    'bedroom-ash': ('bedroom', dict(palette='ash', view='sea'), 'bedroom'),
    'bedroom-mare': ('bedroom', dict(palette='oak', view='sea'), 'bedroom-alt'),
    'bedroom-serra': ('bedroom', dict(palette='ash', view='garden'), 'bedroom-alt'),
    'bath-travertine': ('bathroom', dict(palette='travertine'), 'bath'),
    'bath-marble': ('bathroom', dict(palette='marble'), 'bath'),
    'bath-marble-alt': ('bathroom', dict(palette='marble'), 'bath-alt'),
}


def main(shots=None):
    built = None
    for name in shots or list(SHOTS):
        kind, params, cam = SHOTS[name]
        key = (kind, tuple(sorted(params.items())))
        if key != built:
            (bedroom if kind == 'bedroom' else bathroom)(**params)
            built = key
        kit.camera(**CAMERAS[cam])
        kit.render(name, 2400, 1600, samples=128, exposure=0.6)
