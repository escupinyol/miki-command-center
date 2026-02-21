'use client';

import { useState } from 'react';
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Search
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Configurar Kimi CLI',
      status: 'completed',
      priority: 'high',
      createdAt: '2026-02-21',
    },
    {
      id: '2',
      title: 'Crear dashboard de control',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2026-02-21',
    },
    {
      id: '3',
      title: 'Integrar con Vercel',
      status: 'pending',
      priority: 'medium',
      createdAt: '2026-02-21',
    },
  ]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && task.status !== 'completed') ||
      (filter === 'completed' && task.status === 'completed');
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tareas</h2>
          <p className="text-slate-400">Gestiona lo que me pides y lo que voy haciendo</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Nueva tarea
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' && 'Todas'}
              {f === 'pending' && 'Pendientes'}
              {f === 'completed' && 'Completadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">🦞</div>
            <p className="text-slate-400">No hay tareas que coincidan</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {filteredTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors"
              >
                <button className="flex-shrink-0">
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${
                    task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
                  }`}>
                    {task.title}
                  </div>
                  <div className="text-sm text-slate-500">
                    Creada el {task.createdAt}
                  </div>
                </div>
                
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority === 'high' && 'Alta'}
                  {task.priority === 'medium' && 'Media'}
                  {task.priority === 'low' && 'Baja'}
                </span>
                
                <button className="p-2 text-slate-500 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
