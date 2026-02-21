#!/usr/bin/env python3
"""
API local para servir archivos de memoria al dashboard de Vercel
Ejecutar en el servidor OpenClaw
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from urllib.parse import parse_qs, urlparse

WORKSPACE_DIR = '/root/.openclaw/workspace'

# Archivos permitidos
ALLOWED_FILES = [
    'IDENTITY.md', 'USER.md', 'SOUL.md', 'MEMORY.md',
    'AGENTS.md', 'TOOLS.md', 'HEARTBEAT.md', 'BOOTSTRAP.md',
    'README.md', 'CHANGELOG.md'
]

class APIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)
        
        # CORS headers
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if path == '/health':
            response = {'status': 'ok', 'service': 'miki-files-api'}
        
        elif path == '/files':
            # Listar archivos disponibles
            files = []
            for f in ALLOWED_FILES:
                filepath = os.path.join(WORKSPACE_DIR, f)
                if os.path.exists(filepath):
                    stat = os.stat(filepath)
                    files.append({
                        'name': f,
                        'size': stat.st_size,
                        'modified': stat.st_mtime
                    })
            response = {'files': files}
        
        elif path == '/file':
            filename = params.get('name', [''])[0]
            
            if not filename or filename not in ALLOWED_FILES:
                response = {'error': 'Archivo no permitido'}
            else:
                filepath = os.path.join(WORKSPACE_DIR, filename)
                if os.path.exists(filepath):
                    with open(filepath, 'r') as f:
                        content = f.read()
                    response = {
                        'name': filename,
                        'content': content,
                        'size': len(content)
                    }
                else:
                    response = {'error': 'Archivo no encontrado'}
        
        else:
            response = {'error': 'Ruta no encontrada', 'path': path}
        
        self.wfile.write(json.dumps(response).encode())
    
    def log_message(self, format, *args):
        # Silenciar logs
        pass

def main():
    port = 18790
    server = HTTPServer(('0.0.0.0', port), APIHandler)
    print(f'API de archivos iniciada en puerto {port}')
    print(f'Sirviendo archivos desde: {WORKSPACE_DIR}')
    server.serve_forever()

if __name__ == '__main__':
    main()
