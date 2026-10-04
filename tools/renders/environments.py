"""Entornos reutilizáveis: jardim, cidade e orla (vistos através das janelas ou de terraços)."""

import random

import bpy

import kit
from kit import box


def garden(y0, width=40, x_center=6):
    """Jardim com deck, gramado, árvores e mata ao fundo (para salas térreas)."""
    deck = kit.mat_wood(light=(0.5, 0.4, 0.3), dark=(0.36, 0.27, 0.19), planks=True, plank_len=2.4, plank_w=0.14,
                        name='gdeck', rough=0.6)
    box(x_center - width / 2, y0, -0.2, x_center + width / 2, y0 + 3.2, -0.02, deck, bevel=0)
    box(x_center - 80, y0 + 3.2, -0.4, x_center + 80, y0 + 90, -0.04, kit.mat_grass((0.09, 0.2, 0.045)), bevel=0)
    spots = ((-4.5, 8, 9, 3.6), (2.5, 11, 11, 4.4), (8, 6.5, 8, 3.2), (-11, 5, 8, 3.0), (-1.5, 16, 12, 4.8))
    for i, (dx, dy, h, c) in enumerate(spots):
        kit.tree(x_center + dx, y0 + dy, height=h, crown=c, seed=60 + i)
    for i in range(6):
        kit.shrub(x_center - 7 + i * 2.6, y0 + 4.2, radius=0.9, height=1.2, seed=80 + i)
    kit.treeline(x_center - 90, x_center + 90, y0 + 37, count=50, seed=9, color=(0.13, 0.21, 0.07))


def city(origin_z=0.0, y0=60, depth=1400, width=2400, seed=1, density=0.22, haze=((0.62, 0.66, 0.72), 120, 1500),
         lit=0.25, glow=3.0, count=420, tone=1.0, glass_roughness=0.06):
    """Skyline procedural. `origin_z` é a altura do observador (andar do apartamento)."""
    rnd = random.Random(seed)
    ground = kit.mat_hazy((0.32, 0.31, 0.29), haze, name=f'cityground{seed}')
    box(-width, y0 - 40, -origin_z - 1, width, y0 + depth + 400, -origin_z, ground, bevel=0)
    walls = ((0.46, 0.44, 0.41), (0.3, 0.29, 0.27), (0.56, 0.53, 0.48), (0.2, 0.2, 0.21), (0.42, 0.36, 0.3))
    glass = ((0.05, 0.07, 0.09), (0.04, 0.05, 0.05), (0.08, 0.09, 0.1))
    walls = tuple(tuple(c * tone for c in w) for w in walls)
    bases = [kit.mat_windows_grid(wall=w, glass=glass[i % len(glass)], density=lit, strength=glow, haze=haze,
                                  bay=2.6 + (i % 3) * 0.9, win_w=0.82 + (i % 2) * 0.1, win_h=0.72 + (i % 3) * 0.08,
                                  glass_roughness=glass_roughness, name=f'facade{seed}{i}') for i, w in enumerate(walls)]
    for _ in range(count):
        y = y0 + rnd.random() ** 0.8 * depth
        x = rnd.uniform(-width / 2, width / 2) * (0.3 + 0.7 * (y - y0) / depth)
        w = rnd.uniform(14, 34)
        d = rnd.uniform(14, 30)
        h = rnd.choice((rnd.uniform(12, 40), rnd.uniform(30, 90), rnd.uniform(60, 140)))
        if origin_z:
            # Perto do observador os prédios ficam abaixo da linha de visão (vista de andar alto).
            h = min(h, origin_z + 10 + 0.07 * abs(y - y0))
        z0 = -origin_z
        box(x - w / 2, y, z0, x + w / 2, y + d, z0 + h, rnd.choice(bases), bevel=0, name='Building')


def seafront(origin_z=0.0, shore_y=180, haze=((0.72, 0.78, 0.84), 300, 6000), road=True):
    """Mar até o horizonte, faixa de areia e morros com silhueta ao fundo (para coberturas na orla)."""
    sea = kit.mat_simple((0.02, 0.07, 0.1), rough=0.12, name='sea')
    nt = sea.node_tree
    bsdf = nt.nodes['Principled BSDF']
    coord = nt.nodes.new('ShaderNodeTexCoord')
    mapping = nt.nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value = (0.08, 0.3, 0.08)
    nt.links.new(coord.outputs['Object'], mapping.inputs['Vector'])
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 6
    noise.inputs['Detail'].default_value = 8
    nt.links.new(mapping.outputs['Vector'], noise.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.25
    nt.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    box(-8000, shore_y, -origin_z - 1, 8000, 9000, -origin_z, sea, bevel=0)
    sand = kit.mat_hazy((0.78, 0.7, 0.58), haze, rough=0.9, name='sand')
    box(-3000, shore_y - 60, -origin_z - 1, 3000, shore_y, -origin_z + 0.2, sand, bevel=0)
    if road:
        asphalt = kit.mat_hazy((0.2, 0.2, 0.2), haze, name='road')
        box(-3000, shore_y - 80, -origin_z - 1, 3000, shore_y - 60, -origin_z + 0.1, asphalt, bevel=0)
    # Morros ao fundo à esquerda
    hill = kit.mat_hazy((0.12, 0.16, 0.1), ((0.72, 0.62, 0.6), 600, 6000), rough=0.9, name='hill')
    tex = bpy.data.textures.new('hilltex', 'CLOUDS')
    tex.noise_scale = 80
    for i, (hx, hy, r, h) in enumerate(((-1900, 2600, 520, 520), (-1450, 2300, 380, 470), (-2600, 3200, 700, 640))):
        obj = kit.sphere(hx, hy, 0, r, hill, scale=(1, 0.8, h / r), subdiv=5, name='Hill')
        obj.location.z = -origin_z
        mod = obj.modifiers.new('Displace', 'DISPLACE')
        mod.texture = tex
        mod.strength = 60
        mod.texture_coords = 'GLOBAL'
