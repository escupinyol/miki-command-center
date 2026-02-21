import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

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

// Conexión a Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

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

    // Leer de Redis
    const data = await redis.get(`miki:memory:${filename}`);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Archivo no encontrado en caché. Sincronización pendiente.' },
        { status: 404 }
      );
    }

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    return NextResponse.json({
      filename: filename,
      content: parsed.content,
      lastModified: parsed.updated_at,
      size: parsed.size,
    });

  } catch (error) {
    console.error('Error reading memory file:', error);
    return NextResponse.json(
      { error: 'Error al leer archivo de Redis' },
      { status: 500 }
    );
  }
}
