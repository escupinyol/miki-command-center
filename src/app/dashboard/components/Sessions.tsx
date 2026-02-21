'use client';

import { useState } from 'react';
import { 
  Play, 
  Square, 
  Clock, 
  Cpu,
  MessageSquare,
  DollarSign
} from 'lucide-react';

interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  duration: string;
  tasksCompleted: number;
  tokensUsed: number;
  costEstimate: number;
  status: 'active' | 'completed';
}

export default function Sessions() {
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      startTime: '2026-02-21 18:00',
      duration: '45 min',
      tasksCompleted: 3,
      tokensUsed: 45230,
      costEstimate: 0.23,
      status: 'active',
    },
    {
      id: '2',
      startTime: '2026-02-21 14:30',
      endTime: '2026-02-21 15:15',
      duration: '45 min',
      tasksCompleted: 2,
      tokensUsed: 32100,
      costEstimate: 0.16,
      status: 'completed',
    },
  ]);

  const totalTokens = sessions.reduce((acc, s) => acc + s.tokensUsed, 0);
  const totalCost = sessions.reduce((acc, s) => acc + s.costEstimate, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Sesiones</h2>
        <p className="text-slate-400">Historial de nuestras sesiones de trabajo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Total Tokens</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Coste Estimado</span>
          </div>
          <div className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Cpu className="w-4 h-4" />
            <span className="text-sm">Sesiones Hoy</span>
          </div>
          <div className="text-2xl font-bold text-white">{sessions.length}</div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="font-semibold text-white">Historial de Sesiones</h3>
        </div>

        <div className="divide-y divide-slate-700/50">
          {sessions.map((session) => (
            <div key={session.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {session.status === 'active' ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                      <Play className="w-3 h-3" />
                      Activa
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-sm">
                      <Square className="w-3 h-3" />
                      Completada
                    </div>
                  )}
                  <span className="text-slate-500">
                    Sesión #{session.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {session.duration}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Inicio</div>
                  <div className="text-white">{session.startTime}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-1">Tareas</div>
                  <div className="text-white">{session.tasksCompleted}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-1">Tokens</div>
                  <div className="text-white">{session.tokensUsed.toLocaleString()}</div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-1">Coste</div>
                  <div className="text-white">${session.costEstimate.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
