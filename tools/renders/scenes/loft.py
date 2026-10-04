"""Loft industrial com pé-direito de 6 m, mezanino em aço e parede de caixilhos. Versões pronta e bruta (antes)."""

import bpy

import environments
import kit
from kit import box


def steel_grid(x0, x1, y, z0, z1, cols, rows, frame, glass, bar=0.05):
    for i in range(cols + 1):
        x = x0 + (x1 - x0) * i / cols
        box(x - bar / 2, y - 0.04, z0, x + bar / 2, y + 0.04, z1, frame, bevel=0.002)
    for j in range(rows + 1):
        z = z0 + (z1 - z0) * j / rows
        box(x0, y - 0.04, z - bar / 2, x1, y + 0.04, z + bar / 2, frame, bevel=0.002)
    pane = box(x0, y - 0.004, z0, x1, y + 0.004, z1, glass, bevel=0, name='Pane')
    return pane


def build(raw=False):
    kit.reset(seed=21)
    W, D, H, M = 10.0, 8.0, 6.2, 3.0
    concrete = kit.mat_concrete((0.56, 0.54, 0.5), name='loftconcrete', board=True)
    if raw:
        floor = kit.mat_concrete((0.42, 0.4, 0.37), name='rawfloor')
        glass = kit.mat_window_glass(tint=(0.78, 0.76, 0.7), reflect=0.1, name='dirtyglass')
    else:
        floor = kit.mat_wood(light=(0.5, 0.36, 0.24), dark=(0.3, 0.2, 0.12), planks=True, plank_len=1.6, plank_w=0.18,
                             direction='Y', name='demolition', rough=0.5)
        glass = kit.mat_window_glass(name='loftglass', reflect=0.06)
    steel = kit.mat_simple((0.03, 0.03, 0.03), rough=0.4, metal=0.7, name='steel')
    plaster = kit.mat_plaster((0.8, 0.78, 0.74), name='loftplaster')

    box(-0.3, -0.3, -0.2, W + 0.3, D + 0.3, 0, floor, bevel=0)
    box(-0.3, -0.3, H, W + 0.3, D + 0.3, H + 0.3, concrete, bevel=0)
    for bx in (2.5, 5.0, 7.5):
        box(bx - 0.15, -0.3, H - 0.45, bx + 0.15, D, H, concrete, bevel=0.01)
    box(-0.3, -0.3, 0, 0, D, H, concrete, bevel=0)
    box(-0.3, -0.3, 0, W + 0.3, 0, H, plaster if not raw else concrete, bevel=0)
    box(W, -0.3, 0, W + 0.3, D, H, concrete, bevel=0)
    # Parede de caixilhos de aço (y = D)
    box(-0.3, D, 0, W + 0.3, D + 0.3, 0.3, concrete, bevel=0)
    box(-0.3, D, H - 0.3, W + 0.3, D + 0.3, H, concrete, bevel=0)
    steel_grid(0.2, W - 0.2, D + 0.1, 0.3, H - 0.3, 10, 7, steel, glass)
    portal = kit.area_light((W / 2, D + 0.25, H / 2), W, 1.0, rotation=(90, 0, 0), size_y=H)
    portal.data.cycles.is_portal = True
    environments.city(origin_z=9, y0=60, depth=900, width=1400, seed=3, lit=0.0, glow=0,
                      haze=((0.74, 0.77, 0.8), 40, 600), count=260)
    for i, (tx, ty) in enumerate(((2, 16), (8.5, 22), (-6, 19))):
        kit.tree(tx, ty, height=10, crown=4.0, seed=90 + i)

    # Mezanino
    box(0, 0, M, 4.6, D, M + 0.25, concrete, bevel=0.005)
    box(4.45, 0, M - 0.3, 4.6, D, M + 0.25, steel, bevel=0.003)
    if not raw:
        box(0, 0, M + 0.25, 4.6, D, M + 0.27, floor, bevel=0)
        for i in range(70):
            y = 0.1 + i * (D - 0.2) / 69
            box(4.5, y - 0.008, M + 0.27, 4.516, y + 0.008, M + 1.32, steel, bevel=0)
        box(4.48, 0, M + 1.3, 4.6, D, M + 1.34, steel, bevel=0.002)
        kit.bed(1.3, 4.6, floor=M + 0.27, width=1.8, length=2.1, rotation=-90)
        kit.potted_plant(0.6, 7.3, floor=M + 0.27, height=1.4, seed=7)
        # Escada metálica junto à parede frontal
        steps = 14
        for i in range(steps):
            x = 8.6 - i * (3.9 / steps)
            z = (i + 1) * (M + 0.27) / steps
            box(x - 3.9 / steps, 0.15, z - 0.05, x, 1.15, z, kit.mat_wood(name='tread', light=(0.45, 0.3, 0.18),
                                                                          dark=(0.3, 0.18, 0.1)), bevel=0.004)
        kit.beam((4.7, 1.14, M + 0.12), (8.6, 1.14, -0.1), 0.03, 0.25, steel)
        kit.beam((4.7, 0.16, M + 0.12), (8.6, 0.16, -0.1), 0.03, 0.25, steel)

        # Cozinha sob o mezanino
        black = kit.mat_simple((0.05, 0.05, 0.05), rough=0.45, name='loftcab')
        counter = kit.mat_concrete((0.62, 0.6, 0.57), name='countertopc')
        box(0, 0.6, 0, 0.65, 5.4, 0.88, black, bevel=0.004)
        box(0, 0.55, 0.88, 0.7, 5.45, 0.94, counter, bevel=0.004)
        for z in (1.5, 2.1):
            box(0, 1.0, z, 0.32, 5.0, z + 0.04, kit.mat_wood(name='shelf', light=(0.5, 0.35, 0.2), dark=(0.32, 0.2, 0.1)))
            kit.vase(0.16, 1.4, z + 0.04, height=0.22, radius=0.07)
            kit.vase(0.16, 3.2, z + 0.04, height=0.16, radius=0.08, shape='round')
            kit.books(0.05, 4.0, z + 0.04, length=0.5, depth=0.22, rotation=90, seed=int(z * 10))
        # Frente de aço escurecido, cooktop, cuba e torneira
        box(0, 0.6, 0.94, 0.015, 5.4, 1.42, steel, bevel=0)
        box(0.1, 1.4, 0.94, 0.55, 2.1, 0.944, kit.mat_simple((0.02, 0.02, 0.02), rough=0.1, name='cooktop'), bevel=0)
        box(0.12, 3.6, 0.94, 0.52, 4.3, 0.943, kit.mat_simple((0.12, 0.12, 0.12), rough=0.3, metal=0.8, name='sink'),
            bevel=0)
        kit.cylinder(0.07, 3.95, 0.94, 1.26, 0.014, steel)
        kit.beam((0.07, 3.95, 1.25), (0.3, 3.95, 1.25), 0.024, 0.024, steel)
        # Coluna de marcenaria com forno embutido
        cabinet = kit.mat_wood(name='loftcabinet', light=(0.46, 0.31, 0.18), dark=(0.3, 0.19, 0.1))
        box(0, 5.4, 0, 0.65, 7.0, 2.6, cabinet, bevel=0.004)
        box(0.65, 6.198, 0.05, 0.66, 6.202, 2.55, kit.mat_simple((0.02, 0.02, 0.02), name='gap'), bevel=0)
        box(0.65, 5.55, 0.95, 0.67, 6.1, 1.5, black, bevel=0.002)
        # Ilha com tampo em cascata e banquetas
        box(1.9, 1.8, 0, 2.8, 4.2, 0.9, black, bevel=0.004)
        box(1.85, 1.75, 0.9, 2.85, 4.25, 0.95, counter, bevel=0.004)
        box(1.85, 1.75, 0, 2.85, 1.8, 0.9, counter, bevel=0.002)
        box(1.85, 4.2, 0, 2.85, 4.25, 0.9, counter, bevel=0.002)
        seat = kit.mat_simple((0.3, 0.16, 0.08), rough=0.45, name='stoolleather', coat=0.2)
        for sy in (2.3, 3.0, 3.7):
            kit.cylinder(3.2, sy, 0, 0.64, 0.018, steel, vertices=8)
            kit.cylinder(3.2, sy, 0.0, 0.02, 0.19, steel)
            kit.cylinder(3.2, sy, 0.64, 0.72, 0.19, seat, bevel=0.02)
        kit.vase(2.3, 2.1, 0.95, height=0.34, radius=0.07)
        box(2.1, 3.3, 0.95, 2.55, 3.65, 0.99, kit.mat_wood(name='board', light=(0.6, 0.45, 0.3), dark=(0.45, 0.3, 0.18)))
        for py in (2.3, 3.0, 3.7):
            kit.pendant(2.35, py, M, drop=0.9, radius=0.14, shape='dome')
        # Embutidos sob o mezanino
        kit.area_light((1.6, 3.4, M - 0.02), 2.4, 70, size_y=4.4, color=(1.0, 0.86, 0.68))

        # Estar
        kit.rug(5.0, 2.4, 9.4, 6.6, color=(0.62, 0.55, 0.48))
        leather = kit.mat_simple((0.3, 0.16, 0.08), rough=0.45, name='loftleather', coat=0.2)
        kit.sofa(8.6, 5.8, length=3.0, depth=1.0, rotation=-90, fabric=leather)
        kit.coffee_table(7.6, 4.3, length=1.3, depth=0.75, round_=False,
                         mat=kit.mat_wood(name='ctable', light=(0.4, 0.26, 0.14), dark=(0.24, 0.14, 0.07)))
        kit.lounge_chair(5.6, 3.4, rotation=90, leather=kit.mat_fabric((0.7, 0.66, 0.6), name='armfab'))
        kit.floor_lamp(9.3, 7.2, glow=4)
        # Tela grande acima do sofá (parede x = W)
        art = kit.mat_art([(0.2, 0.18, 0.16), (0.86, 0.83, 0.77), (0.66, 0.42, 0.26), (0.9, 0.88, 0.83)],
                          'loftart2', seed=7.0)
        box(W - 0.035, 3.3, 1.55, W, 5.3, 3.05, art, bevel=0.003, name='Art')
        box(W - 0.03, 3.275, 1.525, W, 5.325, 3.075, kit.mat_simple((0.08, 0.07, 0.06), rough=0.5, name='frame'),
            bevel=0.002, name='Frame')
        kit.potted_plant(5.2, 7.3, height=2.4, seed=8)
        kit.artwork(5.6, 8.6, 0.0, 1.6, 3.6, [(0.86, 0.84, 0.8), (0.18, 0.17, 0.16), (0.62, 0.36, 0.2), (0.8, 0.77, 0.7)],
                    'loftart', toward=1, seed=4.0)
        kit.cylinder(7.0, 6.0, H - 0.5, H - 0.48, 0.01, steel)
        for px in (6.4, 7.6, 8.8):
            kit.pendant(px, 4.3, H, drop=2.6, radius=0.2, shape='dome')
    else:
        # Obra: cavaletes, latas, lona e lâmpada pendurada
        tarp = kit.mat_simple((0.72, 0.72, 0.7), rough=0.6, name='tarp')
        box(1.5, 2.0, 0, 3.8, 4.4, 0.03, tarp, bevel=0)
        for i, (bx, by) in enumerate(((6.5, 4.0), (6.9, 4.3), (8.2, 2.2))):
            kit.cylinder(bx, by, 0, 0.35, 0.14, kit.mat_simple((0.85, 0.83, 0.78), rough=0.5, name='bucket'))
        wood = kit.mat_wood(name='plank', light=(0.6, 0.48, 0.32), dark=(0.45, 0.34, 0.2))
        for i in range(4):
            box(3.4 + i * 0.05, 6.5, 0, 6.8, 6.75, 0.05 + i * 0.05, wood, bevel=0.003)
        kit.cylinder(7.2, 3.8, 1.5, H, 0.004, steel)
        kit.sphere(7.2, 3.8, 1.45, 0.05, kit.mat_emission((1.0, 0.85, 0.65), 30, name='bulb'))
        kit.point_light((7.2, 3.8, 1.42), 60, (1.0, 0.8, 0.6), radius=0.03)

    kit.sky(38, 165, strength=0.3, sun_energy=4.5, sun_color=(1.0, 0.9, 0.78))
    fill = kit.area_light((W / 2, D / 2, H - 0.05), 6, 260, size_y=5, color=(1.0, 0.9, 0.8))
    fill.visible_glossy = False  # sem o retângulo refletido nos caixilhos
    sc = bpy.context.scene
    sc.cycles.diffuse_bounces = 6


def main(shots=None):
    shots = shots or ['wide', 'mezzanine', 'kitchen', 'living', 'raw']
    finished = [s for s in shots if s != 'raw']
    if finished:
        build(raw=False)
        if 'wide' in finished:
            kit.camera((9.6, 0.7, 1.5), target=(3.0, 7.4, 1.5), lens=18, shift_y=0.12)
            kit.render('loft-wide', 2400, 1600, samples=128, exposure=1.1)
        if 'mezzanine' in finished:
            kit.camera((7.6, 1.6, 1.4), rotation=(102, 0, 52), lens=20)
            kit.render('loft-mezzanine', 2400, 1600, samples=128, exposure=1.1)
        if 'kitchen' in finished:
            kit.camera((5.0, 6.6, 1.35), target=(0.8, 3.1, 1.15), lens=24, shift_y=0.04)
            kit.render('loft-kitchen', 2400, 1600, samples=128, exposure=1.2)
        if 'living' in finished:
            kit.camera((4.9, 1.0, 1.25), target=(9.2, 6.6, 1.1), lens=24, shift_y=0.1)
            kit.render('loft-living', 2400, 1600, samples=128, exposure=1.1)
    if 'raw' in shots:
        build(raw=True)
        kit.camera((9.6, 0.7, 1.5), target=(3.0, 7.4, 1.5), lens=18, shift_y=0.12)
        kit.render('loft-raw', 2400, 1600, samples=128, exposure=1.0)
