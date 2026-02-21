import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Archivos permitidos (whitelist de seguridad)
const ALLOWED_FILES = [
  'IDENTITY.md',
  'USER.md', 
  'SOUL.md',
  'MEMORY.md',
  'AGENTS.md',
  'TOOLS.md',
  'HEARTBEAT.md',
  'BOOTSTRAP.md',
];

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || '/root/.openclaw/workspace';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json({ error: 'Archivo no especificado' }, { status: 400 });
    }

    // Validar que el archivo esté en la whitelist
    if (!ALLOWED_FILES.includes(filename)) {
      return NextResponse.json({ error: 'Archivo no permitido' }, { status: 403 });
    }

    // Prevenir path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Nombre de archivo inválido' }, { status: 400 });
    }

    const filePath = join(WORKSPACE_DIR, filename);

    // Verificar que existe
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    // Leer contenido
    const content = await readFile(filePath, 'utf-8');

    return NextResponse.json({ 
      filename,
      content,
      lastModified: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error reading memory file:', error);
    return NextResponse.json({ error: 'Error al leer archivo' }, { status: 500 });
  }
}
