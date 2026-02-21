'use client';

import { useState } from 'react';
import { 
  FileText, 
  Brain,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface MemoryFile {
  name: string;
  type: 'core' | 'daily' | 'config';
  lastModified: string;
  size: string;
}

export default function Memory() {
  const [files] = useState<MemoryFile[]>([
    { name: 'SOUL.md', type: 'core', lastModified: '2026-02-21', size: '2.4 KB' },
    { name: 'IDENTITY.md', type: 'core', lastModified: '2026-02-21', size: '1.8 KB' },
    { name: 'USER.md', type: 'core', lastModified: '2026-02-21', size: '1.2 KB' },
    { name: 'MEMORY.md', type: 'core', lastModified: '2026-02-21', size: '3.1 KB' },
    { name: 'HEARTBEAT.md', type: 'config', lastModified: '2026-02-21', size: '0.5 KB' },
    { name: '2026-02-21.md', type: 'daily', lastModified: '2026-02-21', size: '4.2 KB' },
  ]);

  const [selectedFile, setSelectedFile] = useState<MemoryFile | null>(null);

  const getFileIcon = (type: MemoryFile['type']) => {
    switch (type) {
      case 'core':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'daily':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTypeLabel = (type: MemoryFile['type']) => {
    switch (type) {
      case 'core':
        return 'Memoria Core';
      case 'daily':
        return 'Nota Diaria';
      default:
        return 'Configuración';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Memoria</h2>
        <p className="text-slate-400">Archivos de memoria y configuración de Miki</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="font-semibold text-white text-sm">Archivos</h3>
          </div>

          <div className="divide-y divide-slate-700/50">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                  selectedFile?.name === file.name
                    ? 'bg-indigo-500/10 border-l-2 border-indigo-500'
                    : 'hover:bg-slate-700/30 border-l-2 border-transparent'
                }`}
              >
                {getFileIcon(file.type)}
                
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{file.name}</div>
                  <div className="text-xs text-slate-500">{getTypeLabel(file.type)}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            ))}
          </div>
        </div>

        {/* File Content */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
          {selectedFile ? (
            <>
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedFile.type)}
                  <div>
                    <div className="font-semibold text-white">{selectedFile.name}</div>
                    <div className="text-sm text-slate-500">
                      {selectedFile.size} • Modificado el {selectedFile.lastModified}
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs ${
                  selectedFile.type === 'core' ? 'bg-purple-500/10 text-purple-400' :
                  selectedFile.type === 'daily' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {getTypeLabel(selectedFile.type)}
                </span>
              </div>

              <div className="p-6">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                  {`# ${selectedFile.name}

Este es el contenido del archivo ${selectedFile.name}.

En una implementación completa, aquí se mostraría el contenido real del archivo leído desde el sistema de archivos o desde una API.

---

Tipo: ${getTypeLabel(selectedFile.type)}
Última modificación: ${selectedFile.lastModified}
Tamaño: ${selectedFile.size}

🦞 Miki - Tu langosta analista-programadora`}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Selecciona un archivo</h3>
              <p className="text-slate-400 max-w-sm">
                Haz clic en cualquier archivo de la lista para ver su contenido.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
