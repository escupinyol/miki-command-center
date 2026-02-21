'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Activity, 
  Brain, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Overview from './components/Overview';
import Tasks from './components/Tasks';
import Sessions from './components/Sessions';
import Memory from './components/Memory';

type Tab = 'overview' | 'tasks' | 'sessions' | 'memory';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar sesión
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.isAuthenticated) {
          router.push('/');
        } else {
          setLoading(false);
        }
      })
      .catch(() => router.push('/'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦞</div>
          <p className="text-slate-400">Cargando Miki Command Center...</p>
        </div>
      </div>
    );
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Vista General', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tareas', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'sessions', label: 'Sesiones', icon: <Activity className="w-5 h-5" /> },
    { id: 'memory', label: 'Memoria', icon: <Brain className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
              🦞
            </div>
            <div>
              <h1 className="font-bold text-white">Miki</h1>
              <p className="text-xs text-slate-400">Command Center</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header móvil */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦞</span>
            <span className="font-bold text-white">Miki</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'sessions' && <Sessions />}
          {activeTab === 'memory' && <Memory />}
        </div>
      </main>
    </div>
  );
}
