import { NextRequest, NextResponse } from 'next/server';

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

// URL del servidor local de archivos
const FILES_API_URL = process.env.FILES_API_URL || 'http://localhost:18790';

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

    // Consultar al servidor local de archivos
    const response = await fetch(`${FILES_API_URL}/file?name=${encodeURIComponent(filename)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || 'Error al obtener archivo' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      filename: data.name,
      content: data.content,
      lastModified: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error reading memory file:', error);
    return NextResponse.json(
      { error: 'Servidor de archivos no disponible' },
      { status: 503 }
    );
  }
}
