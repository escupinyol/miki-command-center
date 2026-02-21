'use client';

import { useState } from 'react';
import { 
  Play, 
  Square, 
  Clock, 
  MessageSquare,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  messages: number;
  tokensUsed: number;
  costEstimate: number;
  status: 'active' | 'completed';
  tasks: string[];
}

const mockSessions: Session[] = [
  {
    id: 'sess_001',
    startTime: '2026-02-21T18:00:00Z',
    endTime: '2026-02-21T18:30:00Z',
    duration: 30,
    messages: 45,
    tokensUsed: 15420,
    costEstimate: 0.12,
    status: 'completed',
    tasks: ['Configurar Kimi CLI', 'Crear dashboard'],
  },
  {
    id: 'sess_002',
    startTime: '2026-02-21T17:30:00Z',
    endTime: '2026-02-21T17:45:00Z',
    duration: 15,
    messages: 28,
    tokensUsed: 8920,
    costEstimate: 0.07,
    status: 'completed',
    tasks: ['Conectar GitHub', 'Setup Vercel'],
  },
  {
    id: 'sess_003',
    startTime: '2026-02-21T18:35:00Z',
    duration: 0,
    messages: 12,
    tokensUsed: 3450,
    costEstimate: 0.03,
    status: 'active',
    tasks: ['Desarrollar dashboard'],
  },
];

export default function Sessions() {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'En progreso';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalStats = {
    sessions: mockSessions.length,
    messages: mockSessions.reduce((acc, s) => acc + s.messages, 0),
    tokens: mockSessions.reduce((acc, s) => acc + s.tokensUsed, 0),
    cost: mockSessions.reduce((acc, s) => acc + s.costEstimate, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Sesiones</h2>
        <p className="text-slate-400">Historial de interacciones con Miki</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{totalStats.sessions}</div>
          <div className="text-sm text-slate-400">Sesiones hoy</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{totalStats.messages}</div>
          <div className="text-sm text-slate-400">Mensajes</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{(totalStats.tokens / 1000).toFixed(1)}k</div>
          <div className="text-sm text-slate-400">Tokens</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-400">${totalStats.cost.toFixed(2)}</div>
          <div className="text-sm text-slate-400">Coste estimado</div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
            <div className="col-span-2">Estado</div>
            <div className="col-span-3">Hora</div>
            <div className="col-span-2">Duración</div>
            <div className="col-span-2">Tokens</div>
            <div className="col-span-2">Coste</div>
            <div className="col-span-1"></div>
          </div>
        </div>

        <div className="divide-y divide-slate-700/50">
          {mockSessions.map((session) => (
            <div key={session.id}>
              <div 
                className="px-4 py-4 hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                    {session.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-400 text-sm">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Completada
                      </span>
                    )}
                  </div>
                  
                  <div className="col-span-3 text-white text-sm">
                    {formatTime(session.startTime)}
                  </div>
                  
                  <div className="col-span-2 text-slate-400 text-sm">
                    {formatDuration(session.duration)}
                  </div>
                  
                  <div className="col-span-2 text-slate-300 text-sm">
                    {session.tokensUsed.toLocaleString()}
                  </div>
                  
                  <div className="col-span-2 text-emerald-400 text-sm">
                    ${session.costEstimate.toFixed(3)}
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    {expandedSession === session.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedSession === session.id && (
                <div className="px-4 py-4 bg-slate-800/30 border-t border-slate-700/50">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">{session.messages} mensajes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">{(session.tokensUsed / 1000).toFixed(1)}k tokens</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">{formatDuration(session.duration)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">Tareas trabajadas:</div>
                    <div className="flex flex-wrap gap-2">
                      {session.tasks.map((task, i) => (
                        <span 
                          key={i}
                          className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
