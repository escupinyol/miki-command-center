'use client';

import { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Zap,
  Activity,
  Calendar
} from 'lucide-react';

interface Stats {
  tasksCompleted: number;
  tasksPending: number;
  sessionsToday: number;
  totalTokens: number;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    tasksCompleted: 0,
    tasksPending: 0,
    sessionsToday: 0,
    totalTokens: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - aquí conectaríamos con la API real
    setTimeout(() => {
      setStats({
        tasksCompleted: 12,
        tasksPending: 5,
        sessionsToday: 3,
        totalTokens: 154320,
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    { 
      label: 'Tareas Completadas', 
      value: stats.tasksCompleted, 
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    { 
      label: 'Pendientes', 
      value: stats.tasksPending, 
      icon: <Clock className="w-5 h-5" />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    { 
      label: 'Sesiones Hoy', 
      value: stats.sessionsToday, 
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Tokens Usados', 
      value: stats.totalTokens.toLocaleString(), 
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Vista General</h2>
          <p className="text-slate-400">Resumen de actividad con Miki</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div 
            key={card.label}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.bg} ${card.color} mb-4`}>
              {card.icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
            <div className="text-sm text-slate-400">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {[
            { action: 'Tarea completada', detail: 'Configurar Kimi CLI', time: 'Hace 5 minutos' },
            { action: 'Nueva tarea', detail: 'Crear dashboard de control', time: 'Hace 30 minutos' },
            { action: 'Sesión iniciada', detail: 'Configuración inicial', time: 'Hace 1 hora' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
              <div>
                <div className="text-white font-medium">{item.action}</div>
                <div className="text-slate-400 text-sm">{item.detail}</div>
              </div>
              <div className="text-slate-500 text-sm">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje de bienvenida */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🦞</div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">¡Hola Diego!</h3>
            <p className="text-slate-400">
              Todo está bajo control. Tienes {stats.tasksPending} tareas pendientes y he completado {stats.tasksCompleted} desde que empezamos. ¿Qué hacemos hoy?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
