"""Kit de cena para as imagens arquitetônicas da NOVA (Blender 4.5 / Cycles).

Reúne materiais, primitivas, mobiliário, vegetação, iluminação e câmera.
Cada cena em `scenes/` importa este módulo, monta a geometria e chama `render()`.
"""

import math
import os
import random

import bpy
from mathutils import Vector

OUT_DIR = os.environ.get('NOVA_RENDER_OUT', os.path.join(os.path.dirname(__file__), 'out'))
QUALITY = float(os.environ.get('NOVA_RENDER_QUALITY', '1'))  # 0.25 = prévia rápida

# ---------------------------------------------------------------------------
# Cena e render
# ---------------------------------------------------------------------------


def reset(seed=7):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _cache.clear()
    _leaf_objects.clear()
    random.seed(seed)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    cy = sc.cycles
    cy.device = 'CPU'
    cy.use_denoising = True
    cy.denoiser = 'OPENIMAGEDENOISE'
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = 0.02
    cy.max_bounces = 10
    cy.diffuse_bounces = 4
    cy.glossy_bounces = 4
    cy.transmission_bounces = 8
    cy.transparent_max_bounces = 16
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.blur_glossy = 1.0
    cy.sample_clamp_indirect = 8.0
    sc.render.film_transparent = False
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Base Contrast'
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '8'
    return sc


SCALE = float(os.environ.get('NOVA_RENDER_SCALE', '0.6667'))  # 2400 px -> 1600 px, a maior largura usada no site
SAMPLES_CAP = int(os.environ.get('NOVA_RENDER_SAMPLES', '32'))  # o denoiser (OIDN) cuida do ruído restante
MAX_DIFFUSE_BOUNCES = int(os.environ.get('NOVA_RENDER_BOUNCES', '4'))


def render(name, width, height, samples=128, exposure=0.0, look='AgX - Base Contrast', full_res=False):
    sc = bpy.context.scene
    sc.render.resolution_x = width
    sc.render.resolution_y = height
    if QUALITY < 1:
        sc.render.resolution_percentage = max(10, int(100 * min(1.0, QUALITY * 2)))
    else:
        sc.render.resolution_percentage = 100 if full_res else int(100 * SCALE)
    sc.cycles.samples = max(8, int(min(samples, SAMPLES_CAP) * QUALITY))
    sc.cycles.diffuse_bounces = min(sc.cycles.diffuse_bounces, MAX_DIFFUSE_BOUNCES)
    sc.cycles.glossy_bounces = min(sc.cycles.glossy_bounces, 3)
    sc.cycles.adaptive_threshold = max(sc.cycles.adaptive_threshold, 0.03)
    sc.view_settings.exposure = exposure
    sc.view_settings.look = look
    os.makedirs(OUT_DIR, exist_ok=True)
    sc.render.filepath = os.path.join(OUT_DIR, f'{name}.png')
    bpy.ops.render.render(write_still=True)
    print(f'[nova] rendered {name}')


# ---------------------------------------------------------------------------
# Céu e luz
# ---------------------------------------------------------------------------


def sky(sun_elevation, sun_rotation, strength=0.18, sun_energy=3.2, sun_color=(1.0, 0.86, 0.7),
        sun_angle=1.2, air=1.0, dust=1.0, ozone=1.0, sun_disc=False):
    """Céu físico (Nishita) com uma lâmpada solar alinhada a ele para sombras limpas."""
    sc = bpy.context.scene
    for obj in [o for o in sc.objects if o.name.startswith('Sun')]:
        bpy.data.objects.remove(obj, do_unlink=True)
    world = bpy.data.worlds.new('World')
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes['Background']
    tex = nt.nodes.new('ShaderNodeTexSky')
    tex.sky_type = 'NISHITA'
    tex.sun_disc = sun_disc
    tex.sun_elevation = math.radians(sun_elevation)
    tex.sun_rotation = math.radians(sun_rotation)
    tex.air_density = air
    tex.dust_density = dust
    tex.ozone_density = ozone
    nt.links.new(tex.outputs['Color'], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = strength

    if sun_energy > 0:
        light = bpy.data.lights.new('Sun', 'SUN')
        light.energy = sun_energy
        light.color = sun_color
        light.angle = math.radians(sun_angle)
        obj = bpy.data.objects.new('Sun', light)
        sc.collection.objects.link(obj)
        obj.rotation_euler = (math.radians(90 - sun_elevation), 0, math.radians(sun_rotation + 180))
    return world


def area_light(location, size, energy, color=(1.0, 0.82, 0.62), rotation=(0, 0, 0), shape='RECTANGLE',
               size_y=None, visible=False):
    light = bpy.data.lights.new('Area', 'AREA')
    light.energy = energy
    light.color = color
    light.shape = shape
    light.size = size
    if size_y is not None:
        light.size_y = size_y
    obj = bpy.data.objects.new('Area', light)
    obj.location = location
    obj.rotation_euler = [math.radians(a) for a in rotation]
    obj.visible_camera = visible
    bpy.context.scene.collection.objects.link(obj)
    return obj


def point_light(location, energy, color=(1.0, 0.78, 0.55), radius=0.05):
    light = bpy.data.lights.new('Point', 'POINT')
    light.energy = energy
    light.color = color
    light.shadow_soft_size = radius
    obj = bpy.data.objects.new('Point', light)
    obj.location = location
    bpy.context.scene.collection.objects.link(obj)
    return obj


def camera(location, target=None, lens=24, rotation=None, shift_x=0.0, shift_y=0.0, dof_target=None,
           fstop=8.0, sensor=36):
    """Câmera com lente de arquitetura: mantém verticais retas (sem inclinação) e usa shift."""
    sc = bpy.context.scene
    cam = bpy.data.cameras.new('Camera')
    cam.lens = lens
    cam.sensor_width = sensor
    cam.shift_x = shift_x
    cam.shift_y = shift_y
    cam.clip_end = 2000
    obj = bpy.data.objects.new('Camera', cam)
    sc.collection.objects.link(obj)
    obj.location = location
    if rotation is not None:
        obj.rotation_euler = [math.radians(a) for a in rotation]
    elif target is not None:
        direction = Vector(target) - Vector(location)
        yaw = math.atan2(direction.y, direction.x) - math.pi / 2
        obj.rotation_euler = (math.radians(90), 0, yaw)
    if dof_target is not None:
        cam.dof.use_dof = True
        cam.dof.focus_distance = (Vector(dof_target) - Vector(location)).length
        cam.dof.aperture_fstop = fstop
    sc.camera = obj
    return obj


# ---------------------------------------------------------------------------
# Materiais
# ---------------------------------------------------------------------------

_cache = {}


def _new_material(name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes['Principled BSDF']
    return mat, nt, bsdf


def _coords(nt, scale=(1, 1, 1), rotation=(0, 0, 0)):
    coord = nt.nodes.new('ShaderNodeTexCoord')
    mapping = nt.nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value = scale
    mapping.inputs['Rotation'].default_value = [math.radians(a) for a in rotation]
    nt.links.new(coord.outputs['Object'], mapping.inputs['Vector'])
    return mapping.outputs['Vector']


def _bump(nt, bsdf, height_socket, strength=0.1, distance=0.02):
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    bump.inputs['Distance'].default_value = distance
    nt.links.new(height_socket, bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return bump


def _ramp(nt, fac_socket, stops):
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    elements = ramp.color_ramp.elements
    elements[0].position, elements[0].color = stops[0][0], (*stops[0][1], 1)
    elements[1].position, elements[1].color = stops[-1][0], (*stops[-1][1], 1)
    for position, color in stops[1:-1]:
        el = elements.new(position)
        el.color = (*color, 1)
    nt.links.new(fac_socket, ramp.inputs['Fac'])
    return ramp


def mat_plaster(color=(0.86, 0.84, 0.8), rough=0.9, name=None, bump=0.04):
    key = name or f'plaster{color}{rough}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    vec = _coords(nt, scale=(3, 3, 3))
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 6
    noise.inputs['Detail'].default_value = 8
    nt.links.new(vec, noise.inputs['Vector'])
    darker = tuple(c * 0.93 for c in color)
    ramp = _ramp(nt, noise.outputs['Fac'], [(0.35, darker), (0.65, color)])
    nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = rough
    _bump(nt, bsdf, noise.outputs['Fac'], strength=bump, distance=0.01)
    _cache[key] = mat
    return mat


def mat_concrete(color=(0.52, 0.5, 0.47), name=None, board=False):
    key = name or f'concrete{color}{board}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    vec = _coords(nt)
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 3.5
    noise.inputs['Detail'].default_value = 12
    noise.inputs['Roughness'].default_value = 0.62
    nt.links.new(vec, noise.inputs['Vector'])
    dark = tuple(c * 0.78 for c in color)
    light = tuple(min(1, c * 1.1) for c in color)
    ramp = _ramp(nt, noise.outputs['Fac'], [(0.3, dark), (0.55, color), (0.75, light)])
    height = noise.outputs['Fac']
    if board:
        wave = nt.nodes.new('ShaderNodeTexWave')
        wave.wave_type = 'BANDS'
        wave.bands_direction = 'Z'
        wave.inputs['Scale'].default_value = 1.6
        wave.inputs['Distortion'].default_value = 2
        wave.inputs['Detail'].default_value = 4
        nt.links.new(vec, wave.inputs['Vector'])
        mix = nt.nodes.new('ShaderNodeMix')
        mix.data_type = 'RGBA'
        mix.blend_type = 'MULTIPLY'
        mix.inputs['Factor'].default_value = 0.18
        nt.links.new(ramp.outputs['Color'], mix.inputs['A'])
        nt.links.new(wave.outputs['Color'], mix.inputs['B'])
        nt.links.new(mix.outputs['Result'], bsdf.inputs['Base Color'])
        height = wave.outputs['Fac']
    else:
        nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.82
    _bump(nt, bsdf, height, strength=0.18, distance=0.02)
    _cache[key] = mat
    return mat


def mat_wood(light=(0.55, 0.36, 0.2), dark=(0.33, 0.19, 0.09), rough=0.45, scale=1.0, planks=False,
             plank_len=1.8, plank_w=0.22, direction='X', name=None, coat=0.0):
    key = name or f'wood{light}{dark}{planks}{direction}{scale}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    stretch = (0.35 * scale, 9 * scale, 9 * scale) if direction == 'X' else (9 * scale, 0.35 * scale, 9 * scale)
    if direction == 'Z':
        stretch = (9 * scale, 9 * scale, 0.35 * scale)
    vec = _coords(nt, scale=stretch)
    grain = nt.nodes.new('ShaderNodeTexNoise')
    grain.inputs['Scale'].default_value = 2.2
    grain.inputs['Detail'].default_value = 10
    grain.inputs['Distortion'].default_value = 1.4
    nt.links.new(vec, grain.inputs['Vector'])
    ramp = _ramp(nt, grain.outputs['Fac'], [(0.3, dark), (0.5, tuple((a + b) / 2 for a, b in zip(light, dark))),
                                             (0.72, light)])
    color = ramp.outputs['Color']
    height = grain.outputs['Fac']
    if planks:
        raw = _coords(nt)
        brick = nt.nodes.new('ShaderNodeTexBrick')
        brick.inputs['Scale'].default_value = 1.0
        brick.inputs['Mortar Size'].default_value = 0.0025
        brick.inputs['Brick Width'].default_value = plank_len
        brick.inputs['Row Height'].default_value = plank_w
        brick.offset = 0.37
        brick.inputs['Color1'].default_value = (0.82, 0.82, 0.82, 1)
        brick.inputs['Color2'].default_value = (1.0, 1.0, 1.0, 1)
        brick.inputs['Mortar'].default_value = (0.2, 0.2, 0.2, 1)
        if direction == 'Y':
            rot = nt.nodes.new('ShaderNodeVectorRotate')
            rot.rotation_type = 'Z_AXIS'
            rot.inputs['Angle'].default_value = math.radians(90)
            nt.links.new(raw, rot.inputs['Vector'])
            nt.links.new(rot.outputs['Vector'], brick.inputs['Vector'])
        else:
            nt.links.new(raw, brick.inputs['Vector'])
        mix = nt.nodes.new('ShaderNodeMix')
        mix.data_type = 'RGBA'
        mix.blend_type = 'MULTIPLY'
        mix.inputs['Factor'].default_value = 1.0
        nt.links.new(color, mix.inputs['A'])
        nt.links.new(brick.outputs['Color'], mix.inputs['B'])
        color = mix.outputs['Result']
        inv = nt.nodes.new('ShaderNodeMath')
        inv.operation = 'SUBTRACT'
        inv.inputs[0].default_value = 1.0
        nt.links.new(brick.outputs['Fac'], inv.inputs[1])
        height = inv.outputs['Value']
    nt.links.new(color, bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Coat Weight'].default_value = coat
    _bump(nt, bsdf, height, strength=0.12 if planks else 0.05, distance=0.01)
    _cache[key] = mat
    return mat


def mat_stone(color=(0.78, 0.72, 0.62), vein=(0.62, 0.56, 0.46), rough=0.55, scale=1.0, marble=False, name=None):
    key = name or f'stone{color}{vein}{marble}{scale}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    vec = _coords(nt, scale=(1.4 * scale, 1.4 * scale, 5 * scale) if not marble else (scale, scale, scale))
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 1.6 if marble else 3.0
    noise.inputs['Detail'].default_value = 14
    noise.inputs['Distortion'].default_value = 3.5 if marble else 0.8
    nt.links.new(vec, noise.inputs['Vector'])
    if marble:
        ramp = _ramp(nt, noise.outputs['Fac'], [(0.0, color), (0.47, color), (0.5, vein), (0.53, color), (1.0, color)])
    else:
        ramp = _ramp(nt, noise.outputs['Fac'], [(0.25, vein), (0.5, color), (0.8, tuple(min(1, c * 1.05) for c in color))])
    nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = rough
    _bump(nt, bsdf, noise.outputs['Fac'], strength=0.03 if marble else 0.15, distance=0.01)
    _cache[key] = mat
    return mat


def mat_simple(color, rough=0.5, metal=0.0, name=None, sheen=0.0, coat=0.0, subsurface=0.0):
    key = name or f'simple{color}{rough}{metal}{sheen}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Sheen Weight'].default_value = sheen
    bsdf.inputs['Coat Weight'].default_value = coat
    bsdf.inputs['Subsurface Weight'].default_value = subsurface
    _cache[key] = mat
    return mat


def mat_fabric(color, rough=0.95, name=None, scale=180):
    key = name or f'fabric{color}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    vec = _coords(nt)
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = scale
    noise.inputs['Detail'].default_value = 4
    nt.links.new(vec, noise.inputs['Vector'])
    dark = tuple(c * 0.86 for c in color)
    ramp = _ramp(nt, noise.outputs['Fac'], [(0.3, dark), (0.7, color)])
    nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Sheen Weight'].default_value = 0.6
    bsdf.inputs['Sheen Roughness'].default_value = 0.5
    _bump(nt, bsdf, noise.outputs['Fac'], strength=0.25, distance=0.003)
    _cache[key] = mat
    return mat


def mat_window_glass(tint=(0.9, 0.93, 0.94), reflect=0.12, name=None):
    """Vidro fino para janelas: reflexo de Fresnel sobre transparência, sem refração."""
    key = name or f'wglass{tint}{reflect}'
    if key in _cache:
        return _cache[key]
    mat = bpy.data.materials.new(key)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    glossy = nt.nodes.new('ShaderNodeBsdfGlossy')
    glossy.inputs['Roughness'].default_value = 0.02
    transparent = nt.nodes.new('ShaderNodeBsdfTransparent')
    transparent.inputs['Color'].default_value = (*tint, 1)
    fresnel = nt.nodes.new('ShaderNodeFresnel')
    fresnel.inputs['IOR'].default_value = 1.5
    add = nt.nodes.new('ShaderNodeMath')
    add.operation = 'ADD'
    add.inputs[1].default_value = reflect - 0.04
    add.use_clamp = True
    # Só a face de entrada reflete: na face de trás o Fresnel geraria reflexão interna total (preto).
    geometry = nt.nodes.new('ShaderNodeNewGeometry')
    front = nt.nodes.new('ShaderNodeMath')
    front.operation = 'SUBTRACT'
    front.inputs[0].default_value = 1.0
    nt.links.new(geometry.outputs['Backfacing'], front.inputs[1])
    front_fresnel = nt.nodes.new('ShaderNodeMath')
    front_fresnel.operation = 'MULTIPLY'
    nt.links.new(fresnel.outputs['Fac'], front_fresnel.inputs[0])
    nt.links.new(front.outputs['Value'], front_fresnel.inputs[1])
    nt.links.new(front_fresnel.outputs['Value'], add.inputs[0])
    path = nt.nodes.new('ShaderNodeLightPath')
    fac = nt.nodes.new('ShaderNodeMath')
    fac.operation = 'MULTIPLY'
    inv = nt.nodes.new('ShaderNodeMath')
    inv.operation = 'SUBTRACT'
    inv.inputs[0].default_value = 1.0
    nt.links.new(path.outputs['Is Shadow Ray'], inv.inputs[1])
    nt.links.new(add.outputs['Value'], fac.inputs[0])
    nt.links.new(inv.outputs['Value'], fac.inputs[1])
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(fac.outputs['Value'], mix.inputs['Fac'])
    nt.links.new(transparent.outputs['BSDF'], mix.inputs[1])
    nt.links.new(glossy.outputs['BSDF'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    _cache[key] = mat
    return mat


def mat_water(color=(0.55, 0.78, 0.8), name='water'):
    if name in _cache:
        return _cache[name]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    glass = nt.nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['IOR'].default_value = 1.333
    glass.inputs['Roughness'].default_value = 0.02
    glass.inputs['Color'].default_value = (*color, 1)
    transparent = nt.nodes.new('ShaderNodeBsdfTransparent')
    transparent.inputs['Color'].default_value = (*color, 1)
    path = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(path.outputs['Is Shadow Ray'], mix.inputs['Fac'])
    nt.links.new(glass.outputs['BSDF'], mix.inputs[1])
    nt.links.new(transparent.outputs['BSDF'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    coord = nt.nodes.new('ShaderNodeTexCoord')
    mapping = nt.nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value = (1, 2.2, 1)
    nt.links.new(coord.outputs['Object'], mapping.inputs['Vector'])
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 2.5
    noise.inputs['Detail'].default_value = 6
    nt.links.new(mapping.outputs['Vector'], noise.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.12
    bump.inputs['Distance'].default_value = 0.05
    nt.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], glass.inputs['Normal'])
    _cache[name] = mat
    return mat


def mat_emission(color=(1.0, 0.8, 0.55), strength=8.0, name=None):
    key = name or f'emit{color}{strength}'
    if key in _cache:
        return _cache[key]
    mat = bpy.data.materials.new(key)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    emit = nt.nodes.new('ShaderNodeEmission')
    emit.inputs['Color'].default_value = (*color, 1)
    emit.inputs['Strength'].default_value = strength
    nt.links.new(emit.outputs['Emission'], out.inputs['Surface'])
    _cache[key] = mat
    return mat


def mat_glow_shade(color=(1.0, 0.86, 0.68), strength=4.0, name=None):
    """Cúpula de luminária em tecido: difusa por fora, emissiva por transmissão."""
    key = name or f'shade{color}{strength}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = 0.9
    bsdf.inputs['Emission Color'].default_value = (*color, 1)
    bsdf.inputs['Emission Strength'].default_value = strength
    _cache[key] = mat
    return mat


def mat_grass(color=(0.16, 0.24, 0.07), name='grass'):
    if name in _cache:
        return _cache[name]
    mat, nt, bsdf = _new_material(name)
    vec = _coords(nt, scale=(1, 1, 1))
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 0.8
    noise.inputs['Detail'].default_value = 10
    nt.links.new(vec, noise.inputs['Vector'])
    fine = nt.nodes.new('ShaderNodeTexNoise')
    fine.inputs['Scale'].default_value = 140
    nt.links.new(vec, fine.inputs['Vector'])
    ramp = _ramp(nt, noise.outputs['Fac'], [(0.3, tuple(c * 0.7 for c in color)), (0.7, tuple(c * 1.25 for c in color))])
    nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.85
    _bump(nt, bsdf, fine.outputs['Fac'], strength=0.6, distance=0.02)
    _cache[name] = mat
    return mat


def mat_leaf(color=(0.11, 0.2, 0.05), name=None, variation=0.35):
    key = name or f'leaf{color}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    info = nt.nodes.new('ShaderNodeObjectInfo')
    ramp = _ramp(nt, info.outputs['Random'], [
        (0.0, tuple(c * (1 - variation) for c in color)),
        (0.5, color),
        (1.0, (color[0] * 1.5 + 0.03, color[1] * 1.3 + 0.02, color[2] * 1.1))])
    nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.5
    bsdf.inputs['Subsurface Weight'].default_value = 0.0
    bsdf.inputs['Transmission Weight'].default_value = 0.0
    translucent = nt.nodes.new('ShaderNodeBsdfTranslucent')
    nt.links.new(ramp.outputs['Color'], translucent.inputs['Color'])
    mix = nt.nodes.new('ShaderNodeMixShader')
    mix.inputs['Fac'].default_value = 0.3
    out = nt.nodes['Material Output']
    nt.links.new(bsdf.outputs['BSDF'], mix.inputs[1])
    nt.links.new(translucent.outputs['BSDF'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    _cache[key] = mat
    return mat


def mat_art(colors, name, scale=1.4, seed=0.0):
    """Tela abstrata: manchas de cor suaves, sem padrão reconhecível."""
    if name in _cache:
        return _cache[name]
    mat, nt, bsdf = _new_material(name)
    vec = _coords(nt, scale=(scale, scale, scale))
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.noise_dimensions = '4D'
    noise.inputs['W'].default_value = seed
    noise.inputs['Scale'].default_value = 1.2
    noise.inputs['Detail'].default_value = 2
    noise.inputs['Distortion'].default_value = 0.6
    nt.links.new(vec, noise.inputs['Vector'])
    stops = [(i / (len(colors) - 1), c) for i, c in enumerate(colors)]
    ramp = _ramp(nt, noise.outputs['Fac'], stops)
    ramp.color_ramp.interpolation = 'CONSTANT'
    nt.links.new(ramp.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.85
    _cache[name] = mat
    return mat


def mat_windows_grid(wall=(0.56, 0.54, 0.5), glass=(0.035, 0.04, 0.05), lit=(1.0, 0.74, 0.48), density=0.0,
                     strength=3.0, bay=2.8, floor=3.2, win_w=0.72, win_h=0.62, haze=None, name=None,
                     glass_roughness=0.06):
    """Fachada de edifício: janelas em grade (por andar e por vão) com fração acesa ao entardecer."""
    key = name or f'wgrid{wall}{density}{strength}{haze}{bay}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)

    def math(op, a, b=None):
        node = nt.nodes.new('ShaderNodeMath')
        node.operation = op
        for i, value in enumerate((a, b)):
            if value is None:
                continue
            if isinstance(value, (int, float)):
                node.inputs[i].default_value = value
            else:
                nt.links.new(value, node.inputs[i])
        return node.outputs['Value']

    coord = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(coord.outputs['Object'], sep.inputs['Vector'])
    u = math('DIVIDE', math('ADD', sep.outputs['X'], sep.outputs['Y']), bay)
    v = math('DIVIDE', sep.outputs['Z'], floor)
    window = math('MULTIPLY', math('LESS_THAN', math('FRACT', u), win_w), math('LESS_THAN', math('FRACT', v), win_h))
    cell = nt.nodes.new('ShaderNodeCombineXYZ')
    nt.links.new(math('FLOOR', u), cell.inputs['X'])
    nt.links.new(math('FLOOR', v), cell.inputs['Y'])
    info = nt.nodes.new('ShaderNodeObjectInfo')
    nt.links.new(info.outputs['Random'], cell.inputs['Z'])
    noise = nt.nodes.new('ShaderNodeTexWhiteNoise')
    noise.noise_dimensions = '3D'
    nt.links.new(cell.outputs['Vector'], noise.inputs['Vector'])
    lit_cell = math('LESS_THAN', noise.outputs['Value'], density)
    glow = math('MULTIPLY', math('MULTIPLY', window, lit_cell), strength)

    mix_color = nt.nodes.new('ShaderNodeMix')
    mix_color.data_type = 'RGBA'
    mix_color.inputs['A'].default_value = (*wall, 1)
    mix_color.inputs['B'].default_value = (*glass, 1)
    nt.links.new(window, mix_color.inputs['Factor'])
    nt.links.new(mix_color.outputs['Result'], bsdf.inputs['Base Color'])
    rough = nt.nodes.new('ShaderNodeMapRange')
    rough.inputs['To Min'].default_value = 0.75
    rough.inputs['To Max'].default_value = glass_roughness
    nt.links.new(window, rough.inputs['Value'])
    nt.links.new(rough.outputs['Result'], bsdf.inputs['Roughness'])
    bsdf.inputs['Emission Color'].default_value = (*lit, 1)
    nt.links.new(glow, bsdf.inputs['Emission Strength'])
    if haze is not None:
        _apply_haze(nt, bsdf, haze)
    _cache[key] = mat
    return mat


def _apply_haze(nt, bsdf, haze):
    """Perspectiva atmosférica barata: mistura com uma cor de névoa pela distância à câmera."""
    color, start, end = haze
    out = nt.nodes['Material Output']
    cam = nt.nodes.new('ShaderNodeCameraData')
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = start
    mr.inputs['From Max'].default_value = end
    mr.inputs['To Min'].default_value = 0.0
    mr.inputs['To Max'].default_value = 0.92
    nt.links.new(cam.outputs['View Distance'], mr.inputs['Value'])
    emit = nt.nodes.new('ShaderNodeEmission')
    emit.inputs['Color'].default_value = (*color, 1)
    emit.inputs['Strength'].default_value = 1.0
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(mr.outputs['Result'], mix.inputs['Fac'])
    nt.links.new(bsdf.outputs['BSDF'], mix.inputs[1])
    nt.links.new(emit.outputs['Emission'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])


def mat_hazy(color, haze, rough=0.8, name=None):
    key = name or f'hazy{color}{haze}'
    if key in _cache:
        return _cache[key]
    mat, nt, bsdf = _new_material(key)
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = rough
    _apply_haze(nt, bsdf, haze)
    _cache[key] = mat
    return mat


# ---------------------------------------------------------------------------
# Geometria
# ---------------------------------------------------------------------------


def _link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def box(x0, y0, z0, x1, y1, z1, mat=None, bevel=0.004, name='Box', segments=2):
    """Caixa definida pelos cantos mínimo e máximo (em metros)."""
    mesh = bpy.data.meshes.new(name)
    xs, ys, zs = sorted((x0, x1)), sorted((y0, y1)), sorted((z0, z1))
    verts = [(x, y, z) for x in xs for y in ys for z in zs]
    faces = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = _link(bpy.data.objects.new(name, mesh))
    if mat is not None:
        obj.data.materials.append(mat)
    if bevel > 0:
        mod = obj.modifiers.new('Bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = 'ANGLE'
        mod.harden_normals = False
    for poly in mesh.polygons:
        poly.use_smooth = bevel > 0 and segments > 2
    return obj


def soft_box(x0, y0, z0, x1, y1, z1, mat, radius=0.04, name='Cushion'):
    """Caixa com cantos bem arredondados (almofadas, colchões)."""
    obj = box(x0, y0, z0, x1, y1, z1, mat, bevel=radius, segments=6, name=name)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def cylinder(x, y, z0, z1, radius, mat=None, vertices=48, name='Cylinder', bevel=0.0, radius_top=None):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius,
                                    radius2=radius if radius_top is None else radius_top,
                                    depth=z1 - z0, location=(x, y, (z0 + z1) / 2))
    obj = bpy.context.active_object
    obj.name = name
    if mat is not None:
        obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    if bevel > 0:
        mod = obj.modifiers.new('Bevel', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        mod.limit_method = 'ANGLE'
    return obj


def sphere(x, y, z, radius, mat=None, scale=(1, 1, 1), name='Sphere', subdiv=4):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdiv, radius=radius, location=(x, y, z))
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    if mat is not None:
        obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def plane(x0, y0, x1, y1, z, mat=None, name='Plane'):
    return box(x0, y0, z - 0.001, x1, y1, z, mat, bevel=0, name=name)


def rotate(obj, degrees, pivot=None, axis='Z'):
    index = 'XYZ'.index(axis)
    if pivot is not None:
        p = Vector(pivot)
        offset = obj.location - p
        rot = [0, 0, 0]
        rot[index] = math.radians(degrees)
        from mathutils import Euler
        offset.rotate(Euler(rot))
        obj.location = p + offset
    rotation = list(obj.rotation_euler)
    rotation[index] += math.radians(degrees)
    obj.rotation_euler = rotation
    return obj


def beam(p0, p1, width, height, mat, name='Beam'):
    """Barra retangular entre dois pontos (vigas, longarinas, corrimãos)."""
    a, b = Vector(p0), Vector(p1)
    direction = b - a
    length = direction.length
    obj = box(-length / 2, -width / 2, -height / 2, length / 2, width / 2, height / 2, mat, bevel=0.002, name=name)
    obj.location = (a + b) / 2
    obj.rotation_euler = direction.to_track_quat('X', 'Z').to_euler()
    return obj


def turn_around(build_fn, degrees=180):
    """Executa `build_fn` e gira tudo o que ela criou em torno da origem (ex.: mar atrás da câmera)."""
    before = set(bpy.context.scene.objects)
    build_fn()
    for obj in set(bpy.context.scene.objects) - before:
        rotate(obj, degrees, pivot=(0, 0, obj.location.z))


def slats(x0, y0, x1, y1, z0, z1, count, mat, depth=0.06, axis='X', name='Slats'):
    """Brise de ripas verticais distribuídas entre dois pontos."""
    objs = []
    for i in range(count):
        t = (i + 0.5) / count
        if axis == 'X':
            x = x0 + (x1 - x0) * t
            w = (x1 - x0) / count * 0.45
            objs.append(box(x - w / 2, y0, z0, x + w / 2, y0 + depth, z1, mat, bevel=0.003, name=name))
        else:
            y = y0 + (y1 - y0) * t
            w = (y1 - y0) / count * 0.45
            objs.append(box(x0, y - w / 2, z0, x0 + depth, y + w / 2, z1, mat, bevel=0.003, name=name))
    return objs


def glazing(x0, y0, x1, y1, z0, z1, frame_mat, glass_mat, mullions=4, frame=0.05, depth=0.06,
            transom=None, name='Glazing'):
    """Pano de vidro com caixilhos finos. Funciona alinhado ao eixo X ou Y."""
    along_x = abs(x1 - x0) >= abs(y1 - y0)
    objs = []
    if along_x:
        y = y0
        objs.append(box(x0, y - depth / 2, z0, x1, y + depth / 2, z0 + frame, frame_mat, name=name))
        objs.append(box(x0, y - depth / 2, z1 - frame, x1, y + depth / 2, z1, frame_mat, name=name))
        for i in range(mullions + 1):
            x = x0 + (x1 - x0) * i / mullions
            objs.append(box(x - frame / 2, y - depth / 2, z0, x + frame / 2, y + depth / 2, z1, frame_mat, name=name))
        if transom:
            objs.append(box(x0, y - depth / 2, transom - frame / 2, x1, y + depth / 2, transom + frame / 2, frame_mat))
        pane = box(x0, y - 0.006, z0, x1, y + 0.006, z1, glass_mat, bevel=0, name=name + 'Pane')
    else:
        x = x0
        objs.append(box(x - depth / 2, y0, z0, x + depth / 2, y1, z0 + frame, frame_mat, name=name))
        objs.append(box(x - depth / 2, y0, z1 - frame, x + depth / 2, y1, z1, frame_mat, name=name))
        for i in range(mullions + 1):
            y = y0 + (y1 - y0) * i / mullions
            objs.append(box(x - depth / 2, y - frame / 2, z0, x + depth / 2, y + frame / 2, z1, frame_mat, name=name))
        if transom:
            objs.append(box(x - depth / 2, y0, transom - frame / 2, x + depth / 2, y1, transom + frame / 2, frame_mat))
        pane = box(x - 0.006, y0, z0, x + 0.006, y1, z1, glass_mat, bevel=0, name=name + 'Pane')
    pane.visible_shadow = True
    objs.append(pane)
    return objs


def curtain(x0, x1, y, z0, z1, mat, folds=14, amplitude=0.05, name='Curtain'):
    """Cortina leve: faixa ondulada ao longo de X."""
    mesh = bpy.data.meshes.new(name)
    steps = folds * 12
    verts, faces = [], []
    for i in range(steps + 1):
        t = i / steps
        x = x0 + (x1 - x0) * t
        dy = math.sin(t * folds * 2 * math.pi) * amplitude
        verts.append((x, y + dy, z0))
        verts.append((x, y + dy, z1))
    for i in range(steps):
        a = i * 2
        faces.append((a, a + 2, a + 3, a + 1))
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = _link(bpy.data.objects.new(name, mesh))
    obj.data.materials.append(mat)
    for poly in mesh.polygons:
        poly.use_smooth = True
    mod = obj.modifiers.new('Solid', 'SOLIDIFY')
    mod.thickness = 0.004
    return obj


def mat_sheer(color=(0.95, 0.93, 0.89), name='sheer'):
    if name in _cache:
        return _cache[name]
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    trans = nt.nodes.new('ShaderNodeBsdfTranslucent')
    trans.inputs['Color'].default_value = (*color, 1)
    transparent = nt.nodes.new('ShaderNodeBsdfTransparent')
    diffuse = nt.nodes.new('ShaderNodeBsdfDiffuse')
    diffuse.inputs['Color'].default_value = (*color, 1)
    mix1 = nt.nodes.new('ShaderNodeMixShader')
    mix1.inputs['Fac'].default_value = 0.5
    nt.links.new(trans.outputs['BSDF'], mix1.inputs[1])
    nt.links.new(diffuse.outputs['BSDF'], mix1.inputs[2])
    mix2 = nt.nodes.new('ShaderNodeMixShader')
    mix2.inputs['Fac'].default_value = 0.45
    nt.links.new(mix1.outputs['Shader'], mix2.inputs[1])
    nt.links.new(transparent.outputs['BSDF'], mix2.inputs[2])
    nt.links.new(mix2.outputs['Shader'], out.inputs['Surface'])
    _cache[name] = mat
    return mat


# ---------------------------------------------------------------------------
# Vegetação
# ---------------------------------------------------------------------------

_leaf_objects = {}


def _leaf(kind='broad'):
    if kind in _leaf_objects:
        return _leaf_objects[kind]
    mesh = bpy.data.meshes.new('Leaf' + kind)
    if kind == 'broad':
        verts = [(0, 0, 0), (0.05, 0.02, 0.06), (0, 0.0, 0.14), (-0.05, 0.02, 0.06)]
    elif kind == 'large':
        verts = [(0, 0, 0), (0.12, 0.03, 0.14), (0, 0.0, 0.34), (-0.12, 0.03, 0.14)]
    else:  # grama / folhas finas
        verts = [(-0.008, 0, 0), (0.008, 0, 0), (0.002, 0.04, 0.5), (-0.002, 0.04, 0.5)]
    faces = [(0, 1, 2, 3)]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new('Leaf' + kind, mesh)
    _link(obj)
    obj.hide_render = True
    obj.hide_viewport = True
    obj.location = (0, 0, -100)
    _leaf_objects[kind] = obj
    return obj


def _scatter(emitter, leaf_obj, count, size, size_random=0.5, emit='VOLUME', mat=None, seed=0):
    mod = emitter.modifiers.new('Leaves', 'PARTICLE_SYSTEM')
    psys = emitter.particle_systems[-1]
    psys.seed = seed
    st = psys.settings
    st.type = 'HAIR'
    st.use_advanced_hair = True
    st.count = count
    st.hair_length = 1.0
    st.emit_from = emit
    st.distribution = 'RAND'
    st.render_type = 'OBJECT'
    st.instance_object = leaf_obj
    st.particle_size = size
    st.size_random = size_random
    st.use_rotations = True
    st.rotation_mode = 'NOR'
    st.rotation_factor_random = 0.85
    st.phase_factor_random = 2.0
    emitter.show_instancer_for_render = False
    emitter.show_instancer_for_viewport = False
    if mat is not None:
        leaf_obj.data.materials.clear()
        leaf_obj.data.materials.append(mat)
    return mod


def tree(x, y, height=6.0, crown=2.4, leaf_color=(0.1, 0.19, 0.05), bark=(0.18, 0.14, 0.11), density=1.0,
         seed=0, clusters=22, kind='broad', crown_height=None, trunk_radius=None):
    """Árvore: tronco, galhos e copa irregular formada por várias nuvens de folhas instanciadas."""
    rnd = random.Random(seed)
    ch = crown_height or crown * 1.1
    trunk_r = trunk_radius or 0.08 + height * 0.016
    trunk_mat = mat_concrete(bark, name=f'bark{bark}')
    crown_base = height - ch * 2 * 0.85
    cylinder(x, y, 0, crown_base + ch * 0.6, trunk_r, trunk_mat, vertices=16, radius_top=trunk_r * 0.55, name='Trunk')
    leaf_mat = mat_leaf(leaf_color, name=f'leaf{leaf_color}')
    leaf_obj = _leaf(kind)
    leaf_obj.data.materials.clear()
    leaf_obj.data.materials.append(leaf_mat)
    center = Vector((x, y, height - ch))
    for i in range(clusters):
        # ponto aleatório dentro do elipsoide da copa, com viés para a casca externa
        while True:
            v = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1)))
            if v.length <= 1:
                break
        v = v.normalized() * (v.length ** 0.45)
        pos = center + Vector((v.x * crown * 0.72, v.y * crown * 0.72, v.z * ch * 0.7))
        r = crown * rnd.uniform(0.2, 0.36)
        start = Vector((x, y, crown_base + ch * rnd.uniform(0.2, 0.6)))
        d = pos - start
        if d.length > 0.3:
            b = cylinder(0, 0, 0, 1, trunk_r * 0.32, trunk_mat, vertices=8, name='Branch', radius_top=trunk_r * 0.12)
            b.scale = (1, 1, d.length)
            b.location = (start + pos) / 2
            b.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
        em = sphere(pos.x, pos.y, pos.z, r, None, scale=(1, 1, rnd.uniform(0.65, 0.85)), name='Crown', subdiv=2)
        count = int(3400 * density * (r ** 2))
        _scatter(em, leaf_obj, max(150, count), size=1.15 if kind == 'broad' else 0.9, seed=seed * 31 + i,
                 emit='VOLUME')
    return True


def treeline(x0, x1, y, count=40, height=(9, 16), color=(0.05, 0.09, 0.03), seed=0, depth=12.0):
    """Massa de árvores distante: copas sobrepostas (silhuetas baratas com deslocamento)."""
    rnd = random.Random(seed)
    mat = mat_simple(color, rough=0.9, name=f'treeline{color}')
    tex = bpy.data.textures.new('treeline_tex', 'CLOUDS')
    tex.noise_scale = 1.2
    for i in range(count):
        px = x0 + (x1 - x0) * (i + rnd.uniform(-0.5, 0.5)) / count
        py = y + rnd.uniform(0, depth)
        h = rnd.uniform(*height)
        r = h * rnd.uniform(0.34, 0.48)
        obj = sphere(px, py, h - r * 0.9, r, mat, scale=(1.2, 1.0, 0.9), name='Treeline', subdiv=4)
        mod = obj.modifiers.new('Displace', 'DISPLACE')
        mod.texture = tex
        mod.strength = r * 0.4
        mod.texture_coords = 'GLOBAL'
    # sub-bosque para esconder a base das copas
    for i in range(count):
        px = x0 + (x1 - x0) * (i + rnd.uniform(-0.5, 0.5)) / count
        r = rnd.uniform(2.5, 4.0)
        obj = sphere(px, y - 2 + rnd.uniform(0, 3), r * 0.5, r, mat, scale=(1.4, 1.0, 0.7), name='Underbrush', subdiv=3)
        mod = obj.modifiers.new('Displace', 'DISPLACE')
        mod.texture = tex
        mod.strength = r * 0.35
        mod.texture_coords = 'GLOBAL'


def treeline_y(x, y0, y1, count=40, seed=0, **kwargs):
    """Linha de árvores ao longo do eixo Y (laterais da cena)."""
    rnd_objects_before = set(bpy.context.scene.objects)
    treeline(y0, y1, 0, count=count, seed=seed, **kwargs)
    for obj in set(bpy.context.scene.objects) - rnd_objects_before:
        px, py = obj.location.x, obj.location.y
        obj.location.x = x + py
        obj.location.y = px


def shrub(x, y, radius=0.6, height=0.7, color=(0.12, 0.21, 0.06), seed=0, count=900):
    leaf_obj = _leaf('broad')
    mat = mat_leaf(color, name=f'leaf{color}')
    leaf_obj.data.materials.clear()
    leaf_obj.data.materials.append(mat)
    em = sphere(x, y, height * 0.5, radius, None, scale=(1, 1, height / (2 * radius)), name='Shrub', subdiv=2)
    _scatter(em, leaf_obj, count, size=0.8, seed=seed)
    return em


def grass_patch(x0, y0, x1, y1, color=(0.12, 0.2, 0.05), density=60, seed=0):
    """Tufos de grama ornamental (capim) — para bordas de jardim, não para gramado inteiro."""
    blade = _leaf('blade')
    mat = mat_leaf(color, name=f'blade{color}')
    blade.data.materials.clear()
    blade.data.materials.append(mat)
    em = plane(x0, y0, x1, y1, 0.0, None, name='GrassEmitter')
    area = abs((x1 - x0) * (y1 - y0))
    mod = em.modifiers.new('Grass', 'PARTICLE_SYSTEM')
    psys = em.particle_systems[-1]
    psys.seed = seed
    st = psys.settings
    st.type = 'HAIR'
    st.use_advanced_hair = True
    st.count = int(area * density)
    st.emit_from = 'FACE'
    st.render_type = 'OBJECT'
    st.instance_object = blade
    st.particle_size = 1.0
    st.size_random = 0.6
    st.use_rotations = True
    st.rotation_mode = 'GLOB_Z'
    st.rotation_factor_random = 0.25
    st.phase_factor_random = 2.0
    em.show_instancer_for_render = False
    return mod


def potted_plant(x, y, floor=0.0, height=1.6, pot_mat=None, leaf_color=(0.09, 0.2, 0.06), seed=0, pot_r=0.22):
    pot_mat = pot_mat or mat_simple((0.14, 0.13, 0.12), rough=0.6, name='potdark')
    cylinder(x, y, floor, floor + 0.42, pot_r, pot_mat, radius_top=pot_r * 1.08, bevel=0.01, name='Pot')
    cylinder(x, y, floor + 0.38, floor + 0.4, pot_r * 1.02, mat_simple((0.1, 0.07, 0.05), rough=1, name='soil'))
    rnd = random.Random(seed)
    stem_mat = mat_simple((0.2, 0.15, 0.1), rough=0.8, name='stem')
    leaf_obj = _leaf('broad')
    mat = mat_leaf(leaf_color, name=f'leafL{leaf_color}')
    leaf_obj.data.materials.clear()
    leaf_obj.data.materials.append(mat)
    for i in range(3):
        top = floor + height * rnd.uniform(0.75, 1.0)
        cx = x + rnd.uniform(-0.2, 0.2)
        cy = y + rnd.uniform(-0.2, 0.2)
        stem = cylinder(x, y, floor + 0.4, top, 0.012, stem_mat, vertices=8, name='Stem')
        stem.rotation_euler = (math.atan2(cy - y, top) * 0.6, -math.atan2(cx - x, top) * 0.6, 0)
        em = sphere(cx, cy, top - height * 0.18, height * 0.22, None, scale=(1, 1, 1.25), subdiv=2, name='PlantCrown')
        _scatter(em, leaf_obj, 320, size=1.25, seed=seed * 7 + i)


# ---------------------------------------------------------------------------
# Mobiliário
# ---------------------------------------------------------------------------


def sofa(x, y, floor=0.0, length=3.0, depth=1.0, rotation=0, fabric=None, base_mat=None, chaise=False):
    fabric = fabric or mat_fabric((0.78, 0.74, 0.68), name='sofafabric')
    base_mat = base_mat or mat_simple((0.12, 0.11, 0.1), rough=0.6, name='sofabase')
    parts = []
    parts.append(box(x, y, floor, x + length, y + depth, floor + 0.12, base_mat, bevel=0.01))
    parts.append(soft_box(x + 0.02, y + 0.02, floor + 0.12, x + length - 0.02, y + depth - 0.02, floor + 0.38, fabric, 0.05))
    seats = 3 if length > 2.4 else 2
    seat_w = (length - 0.06) / seats
    for i in range(seats):
        sx = x + 0.03 + i * seat_w
        parts.append(soft_box(sx, y + 0.05, floor + 0.36, sx + seat_w - 0.02, y + depth - 0.3, floor + 0.47, fabric, 0.06))
        parts.append(soft_box(sx + 0.02, y + depth - 0.3, floor + 0.36, sx + seat_w - 0.04, y + depth - 0.06, floor + 0.8,
                              fabric, 0.08))
    parts.append(soft_box(x, y + 0.02, floor + 0.36, x + 0.16, y + depth - 0.02, floor + 0.62, fabric, 0.06))
    parts.append(soft_box(x + length - 0.16, y + 0.02, floor + 0.36, x + length, y + depth - 0.02, floor + 0.62, fabric, 0.06))
    if chaise:
        parts.append(soft_box(x + length - 0.95, y - 0.75, floor + 0.08, x + length - 0.02, y + 0.06, floor + 0.44, fabric, 0.06))
        parts.append(box(x + length - 0.95, y - 0.75, floor, x + length - 0.02, y + 0.02, floor + 0.1, base_mat, bevel=0.01))
    # almofadas decorativas
    pillow = mat_fabric((0.55, 0.42, 0.3), name='pillowrust')
    pillow2 = mat_fabric((0.9, 0.88, 0.84), name='pillowcream')
    parts.append(soft_box(x + 0.25, y + depth - 0.42, floor + 0.47, x + 0.7, y + depth - 0.28, floor + 0.88, pillow, 0.07))
    parts.append(soft_box(x + length - 0.8, y + depth - 0.42, floor + 0.47, x + length - 0.32, y + depth - 0.28, floor + 0.9,
                          pillow2, 0.07))
    return _group_rotate(parts, rotation, (x, y))


def _group_rotate(parts, rotation, pivot):
    if rotation:
        for p in parts:
            rotate(p, rotation, pivot=(pivot[0], pivot[1], 0))
    return parts


def lounge_chair(x, y, floor=0.0, rotation=0, leather=None, wood=None):
    leather = leather or mat_simple((0.32, 0.17, 0.08), rough=0.42, name='leathercognac', coat=0.2)
    wood = wood or mat_wood(name='chairwood', light=(0.32, 0.2, 0.11), dark=(0.18, 0.1, 0.05))
    parts = [
        box(x, y, floor, x + 0.05, y + 0.85, floor + 0.38, wood),
        box(x + 0.75, y, floor, x + 0.8, y + 0.85, floor + 0.38, wood),
        box(x, y + 0.02, floor + 0.36, x + 0.8, y + 0.07, floor + 0.4, wood),
        soft_box(x + 0.05, y + 0.02, floor + 0.3, x + 0.75, y + 0.72, floor + 0.44, leather, 0.05),
    ]
    back = soft_box(x + 0.05, y + 0.6, floor + 0.38, x + 0.75, y + 0.78, floor + 0.95, leather, 0.06)
    rotate(back, -14, pivot=(x, y + 0.65, floor + 0.4), axis='X')
    parts.append(back)
    return _group_rotate(parts, rotation, (x, y))


def coffee_table(x, y, floor=0.0, radius=0.55, height=0.34, mat=None, round_=True, length=1.3, depth=0.7):
    mat = mat or mat_stone(name='travertine')
    if round_:
        cylinder(x, y, floor, floor + height, radius, mat, bevel=0.01, name='CoffeeTable')
    else:
        box(x - length / 2, y - depth / 2, floor + height - 0.06, x + length / 2, y + depth / 2, floor + height, mat, bevel=0.008)
        box(x - length / 2 + 0.1, y - depth / 2 + 0.1, floor, x + length / 2 - 0.1, y + depth / 2 - 0.1, floor + height - 0.06,
            mat, bevel=0.008)


def round_table(x, y, floor=0.0, radius=0.5, height=0.74, top=None, base=None):
    """Mesa redonda de pedestal (jantar compacto)."""
    top = top or mat_wood(name='roundtop', light=(0.5, 0.36, 0.22), dark=(0.34, 0.22, 0.12))
    base = base or mat_simple((0.06, 0.06, 0.06), rough=0.4, metal=0.5, name='tablebase')
    cylinder(x, y, floor + height - 0.035, floor + height, radius, top, bevel=0.006, name='TableTop')
    cylinder(x, y, floor + 0.02, floor + height - 0.035, 0.045, base, vertices=24, name='TableLeg')
    cylinder(x, y, floor, floor + 0.025, 0.24, base, bevel=0.004, name='TableBase')


def rug(x0, y0, x1, y1, floor=0.0, color=(0.72, 0.67, 0.6)):
    box(x0, y0, floor, x1, y1, floor + 0.012, mat_fabric(color, name=f'rug{color}', scale=260), bevel=0.004)


def dining_set(x, y, floor=0.0, length=2.4, width=1.0, top_mat=None, chair_mat=None, rotation=0):
    top_mat = top_mat or mat_wood(name='tablewood', light=(0.42, 0.27, 0.15), dark=(0.24, 0.14, 0.07))
    chair_mat = chair_mat or mat_simple((0.1, 0.09, 0.08), rough=0.5, name='chairblack')
    seat = mat_fabric((0.6, 0.55, 0.48), name='chairseat')
    parts = [box(x, y, floor + 0.72, x + length, y + width, floor + 0.76, top_mat, bevel=0.006)]
    parts.append(box(x + 0.3, y + width / 2 - 0.08, floor, x + 0.42, y + width / 2 + 0.08, floor + 0.72, top_mat))
    parts.append(box(x + length - 0.42, y + width / 2 - 0.08, floor, x + length - 0.3, y + width / 2 + 0.08, floor + 0.72, top_mat))
    n = 3 if length > 2 else 2
    for side in (0, 1):
        for i in range(n):
            cx = x + (i + 0.5) * length / n - 0.23
            cy = y - 0.42 if side == 0 else y + width - 0.05
            parts += _chair(cx, cy, floor, chair_mat, seat, flip=side == 1)
    return _group_rotate(parts, rotation, (x, y))


def _chair(x, y, floor, frame, seat, flip=False):
    w, d = 0.46, 0.47
    parts = []
    for dx in (0.02, w - 0.04):
        for dy in (0.02, d - 0.04):
            parts.append(box(x + dx, y + dy, floor, x + dx + 0.025, y + dy + 0.025, floor + 0.45, frame, bevel=0.003))
    parts.append(soft_box(x, y, floor + 0.43, x + w, y + d, floor + 0.49, seat, 0.02))
    by = y + (0.0 if flip else d - 0.04)
    parts.append(soft_box(x, by, floor + 0.49, x + w, by + 0.04, floor + 0.86, seat, 0.02))
    return parts


def pendant(x, y, z_top, drop=1.0, radius=0.18, shape='dome', glow=6.0, color=(1.0, 0.8, 0.55)):
    cord = mat_simple((0.05, 0.05, 0.05), rough=0.5, name='cord')
    cylinder(x, y, z_top - drop, z_top, 0.004, cord, vertices=6, name='Cord')
    z = z_top - drop
    if shape == 'globe':
        sphere(x, y, z - radius, radius, mat_glow_shade((1.0, 0.92, 0.8), glow, name='globeglow'), name='Globe')
        point_light((x, y, z - radius), 35 * radius / 0.18, color, radius=radius * 0.8)
    else:
        brass = mat_simple((0.72, 0.56, 0.32), rough=0.28, metal=1.0, name='brass')
        cylinder(x, y, z - radius * 0.9, z, radius, brass, radius_top=radius * 0.15, name='Dome')
        point_light((x, y, z - radius * 0.7), 45, color, radius=0.06)


def floor_lamp(x, y, floor=0.0, height=1.55, glow=5.0):
    metal = mat_simple((0.06, 0.06, 0.06), rough=0.35, metal=0.6, name='lampblack')
    cylinder(x, y, floor, floor + 0.02, 0.16, metal, name='LampBase')
    cylinder(x, y, floor, floor + height, 0.01, metal, vertices=8, name='LampPole')
    cylinder(x, y, floor + height - 0.05, floor + height + 0.28, 0.2, mat_glow_shade((1.0, 0.9, 0.76), glow, name='lampshade'),
             radius_top=0.16, name='LampShade')
    point_light((x, y, floor + height + 0.1), 30, (1.0, 0.78, 0.52), radius=0.1)


def books(x, y, z, length=0.5, depth=0.22, rotation=0, seed=0):
    rnd = random.Random(seed)
    colors = [(0.75, 0.72, 0.66), (0.28, 0.26, 0.24), (0.55, 0.4, 0.3), (0.84, 0.82, 0.78), (0.4, 0.42, 0.38)]
    px = x
    parts = []
    while px < x + length:
        w = rnd.uniform(0.025, 0.045)
        h = rnd.uniform(0.2, 0.28)
        parts.append(box(px, y, z, px + w, y + depth * rnd.uniform(0.8, 1), z + h,
                         mat_simple(rnd.choice(colors), rough=0.8, name=f'book{rnd.randint(0, 4)}'), bevel=0.002))
        px += w + 0.003
    return _group_rotate(parts, rotation, (x, y))


def vase(x, y, z, height=0.3, radius=0.09, mat=None, shape='bottle'):
    mat = mat or mat_simple((0.86, 0.83, 0.77), rough=0.55, name='ceramic')
    if shape == 'bottle':
        cylinder(x, y, z, z + height * 0.65, radius, mat, radius_top=radius * 0.9, name='Vase')
        cylinder(x, y, z + height * 0.6, z + height, radius * 0.3, mat, radius_top=radius * 0.25, name='VaseNeck')
    else:
        sphere(x, y, z + radius, radius, mat, scale=(1, 1, height / (2 * radius)), name='Vase')


def artwork(x0, x1, y, z0, z1, colors, name, frame=True, toward=-1, seed=0.0):
    """Quadro em parede paralela ao eixo X. `toward` indica para que lado (±Y) fica o ambiente."""
    mat = mat_art(colors, name, seed=seed)
    face = y + 0.035 * toward
    box(x0, min(y, face), z0, x1, max(y, face), z1, mat, bevel=0.003, name='Art')
    if frame:
        fm = mat_simple((0.08, 0.07, 0.06), rough=0.5, name='frame')
        back = y + 0.03 * toward
        box(x0 - 0.025, min(y, back), z0 - 0.025, x1 + 0.025, max(y, back), z1 + 0.025, fm, bevel=0.002, name='Frame')


def bed(x, y, floor=0.0, width=1.9, length=2.1, rotation=0, linen=None, frame_mat=None, throw=None):
    linen = linen or mat_fabric((0.92, 0.9, 0.86), name='linen')
    frame_mat = frame_mat or mat_wood(name='bedwood', light=(0.46, 0.31, 0.18), dark=(0.28, 0.17, 0.08))
    throw = throw or mat_fabric((0.6, 0.5, 0.4), name='throw')
    parts = [box(x - 0.05, y - 0.05, floor, x + width + 0.05, y + length, floor + 0.28, frame_mat, bevel=0.01)]
    parts.append(soft_box(x, y, floor + 0.28, x + width, y + length - 0.05, floor + 0.52, linen, 0.06))
    parts.append(soft_box(x - 0.02, y - 0.02, floor + 0.46, x + width + 0.02, y + length * 0.72, floor + 0.6, linen, 0.07))
    parts.append(soft_box(x - 0.03, y + length * 0.05, floor + 0.5, x + width + 0.03, y + length * 0.32, floor + 0.64, throw, 0.06))
    for px in (x + 0.1, x + width / 2 + 0.05):
        parts.append(soft_box(px, y + length - 0.55, floor + 0.5, px + width / 2 - 0.15, y + length - 0.12, floor + 0.78, linen, 0.1))
    return _group_rotate(parts, rotation, (x, y))
