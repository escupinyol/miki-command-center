'use client';

import { useState } from 'react';
import { 
  FileText, 
  Brain, 
  Heart, 
  User, 
  Tool,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface MemoryFile {
  name: string;
  path: string;
  type: 'core' | 'daily' | 'config';
  lastModified: string;
  size: string;
}

const memoryFiles: MemoryFile[] = [
  { name: 'IDENTITY.md', path: '/IDENTITY.md', type: 'core', lastModified: '2026-02-21', size: '1.2 KB' },
  { name: 'USER.md', path: '/USER.md', type: 'core', lastModified: '2026-02-21', size: '856 B' },
  { name: 'SOUL.md', path: '/SOUL.md', type: 'core', lastModified: '2026-02-21', size: '2.1 KB' },
  { name: 'MEMORY.md', path: '/MEMORY.md', type: 'core', lastModified: '2026-02-21', size: '3.4 KB' },
  { name: 'AGENTS.md', path: '/AGENTS.md', type: 'config', lastModified: '2026-02-21', size: '1.8 KB' },
  { name: 'TOOLS.md', path: '/TOOLS.md', type: 'config', lastModified: '2026-02-21', size: '642 B' },
  { name: 'HEARTBEAT.md', path: '/HEARTBEAT.md', type: 'config', lastModified: '2026-02-21', size: '234 B' },
];

const dailyNotes = [
  { date: '2026-02-21', title: 'Setup inicial y primeros proyectos', entries: 12 },
];

export default function Memory() {
  const [selectedFile, setSelectedFile] = useState<MemoryFile | null>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'core':
        return <Brain className="w-5 h-5 text-purple-400" />;
      case 'config':
        return <Tool className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Memoria</h2>
        <p className="text-slate-400">Archivos de memoria y configuración de Miki</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* File List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Core Memory */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-white">Memoria Principal</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-700/50">
              {memoryFiles.filter(f => f.type === 'core').map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/30 transition-colors text-left"
                >
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <div className="text-white font-medium">{file.name}</div>
                    <div className="text-xs text-slate-500">{file.size} • {file.lastModified}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Config Files */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center gap-2">
                <Tool className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">Configuración</span>
              </div>
            </div>
            
            <div className="divide-y divide-slate-700/50">
              {memoryFiles.filter(f => f.type === 'config').map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/30 transition-colors text-left"
                >
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <div className="text-white font-medium">{file.name}</div>
                    <div className="text-xs text-slate-500">{file.size} • {file.lastModified}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Daily Notes */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-white">Notas Diarias</span>
            </div>
            
            <div className="space-y-2">
              {dailyNotes.map((note) => (
                <button
                  key={note.date}
                  className="w-full p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <div className="text-white font-medium text-sm">{note.date}</div>
                  <div className="text-slate-400 text-xs mt-1">{note.title}</div>
                  <div className="text-slate-500 text-xs mt-1">{note.entries} entradas</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4">
            <div className="text-sm font-medium text-slate-300 mb-3">Resumen</div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Archivos core</span>
                <span className="text-white">{memoryFiles.filter(f => f.type === 'core').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Configuración</span>
                <span className="text-white">{memoryFiles.filter(f => f.type === 'config').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Notas diarias</span>
                <span className="text-white">{dailyNotes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
