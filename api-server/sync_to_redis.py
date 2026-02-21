#!/usr/bin/env python3
"""
Script para sincronizar archivos de memoria a Redis/Upstash
Ejecutar periódicamente (cada 5 minutos) o manualmente cuando cambien archivos
"""

import os
import json
from datetime import datetime

# Intentar importar redis
try:
    import redis
except ImportError:
    print("Instalando redis...")
    os.system("pip3 install --break-system-packages redis -q")
    import redis

WORKSPACE_DIR = '/root/.openclaw/workspace'

FILES_TO_SYNC = [
    'IDENTITY.md', 'USER.md', 'SOUL.md', 'MEMORY.md',
    'AGENTS.md', 'TOOLS.md', 'HEARTBEAT.md', 'BOOTSTRAP.md',
]

def sync_files():
    """Sincroniza archivos a Redis"""
    
    # Conectar a Redis (Upstash)
    r = redis.Redis(
        host=os.environ.get('UPSTASH_REDIS_REST_URL', '').replace('https://', '').replace('.upstash.io', '.upstash.io'),
        port=6379,
        password=os.environ.get('UPSTASH_REDIS_REST_TOKEN'),
        ssl=True,
        decode_responses=True
    )
    
    synced = []
    errors = []
    
    for filename in FILES_TO_SYNC:
        filepath = os.path.join(WORKSPACE_DIR, filename)
        
        if not os.path.exists(filepath):
            errors.append(f"{filename}: no existe")
            continue
        
        try:
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Guardar en Redis con TTL de 24 horas
            data = {
                'content': content,
                'updated_at': datetime.now().isoformat(),
                'size': len(content)
            }
            
            r.setex(
                f'miki:memory:{filename}',
                86400,  # 24 horas
                json.dumps(data)
            )
            
            synced.append(filename)
            print(f"✅ {filename}: sincronizado ({len(content)} bytes)")
            
        except Exception as e:
            errors.append(f"{filename}: {str(e)}")
            print(f"❌ {filename}: error - {e}")
    
    # Guardar lista de archivos disponibles
    r.setex('miki:memory:files', 86400, json.dumps(synced))
    
    print(f"\n📊 Resumen: {len(synced)} sincronizados, {len(errors)} errores")
    return synced, errors

if __name__ == '__main__':
    # Verificar variables de entorno
    if not os.environ.get('UPSTASH_REDIS_REST_URL'):
        print("❌ Error: UPSTASH_REDIS_REST_URL no configurada")
        print("Configura las variables de entorno de Upstash primero")
        exit(1)
    
    if not os.environ.get('UPSTASH_REDIS_REST_TOKEN'):
        print("❌ Error: UPSTASH_REDIS_REST_TOKEN no configurada")
        exit(1)
    
    print("🔄 Sincronizando archivos de memoria a Redis...\n")
    sync_files()
