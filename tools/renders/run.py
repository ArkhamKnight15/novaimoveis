"""Executa uma cena: python run.py <cena> [shot1,shot2,...]

Variáveis de ambiente:
  NOVA_RENDER_QUALITY  1 = final, 0.25 = prévia rápida
  NOVA_RENDER_OUT      pasta de saída (padrão: ./out)
"""

import importlib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

scene_name = sys.argv[1]
shots = sys.argv[2].split(',') if len(sys.argv) > 2 else None
module = importlib.import_module(f'scenes.{scene_name}')
module.main(shots)
