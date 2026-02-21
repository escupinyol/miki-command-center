'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  tags: string[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar Kimi CLI',
    description: 'Instalar y configurar Kimi Code CLI con API key',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-02-21',
    tags: ['setup', 'kimi'],
  },
  {
    id: '2',
    title: 'Crear dashboard de control',
    description: 'Dashboard seguro con autenticación para gestionar tareas',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: '2026-02-21',
    tags: ['frontend', 'nextjs'],
  },
  {
    id: '3',
    title: 'Conectar con Vercel',
    description: 'Deploy automático desde GitHub a Vercel',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-02-21',
    tags: ['deploy', 'vercel'],
  },
  {
    id: '4',
    title: 'Investigar mejores prácticas OpenClaw',
    description: 'Buscar dashboards y herramientas de la comunidad',
    status: 'completed',
    priority: 'medium',
    createdAt: '2026-02-21',
    tags: ['research'],
  },
];

const priorityColors = {
  low: 'text-slate-400 bg-slate-500/10',
  medium: 'text-blue-400 bg-blue-500/10',
  high: 'text-amber-400 bg-amber-500/10',
  urgent: 'text-red-400 bg-red-500/10',
};

const statusIcons = {
  pending: <Circle className="w-5 h-5 text-slate-500" />,
  in_progress: <Clock className="w-5 h-5 text-blue-400" />,
  completed: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
};

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
};

export default function Tasks() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = mockTasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                         task.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    all: mockTasks.length,
    pending: mockTasks.filter(t => t.status === 'pending').length,
    in_progress: mockTasks.filter(t => t.status === 'in_progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tareas</h2>
          <p className="text-slate-400">Gestión de tareas y proyectos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Nueva tarea
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Todas' : statusLabels[f]}
              <span className="ml-2 text-xs opacity-70">{stats[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-700/50">
          {filteredTasks.map((task) => (
            <div 
              key={task.id}
              className="p-4 hover:bg-slate-700/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{statusIcons[task.status]}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                      )}
                    </div>
                    
                    <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                      {task.priority === 'low' ? 'Baja' : 
                       task.priority === 'medium' ? 'Media' : 
                       task.priority === 'high' ? 'Alta' : 'Urgente'}
                    </span>
                    
                    {task.tags.map(tag => (
                      <span key={tag} className="text-xs text-slate-500">
                        #{tag}
                      </span>
                    ))}
                    
                    <span className="text-xs text-slate-600 ml-auto">
                      {task.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-slate-400">No hay tareas que coincidan</p>
          </div>
        )}
      </div>
    </div>
  );
}
