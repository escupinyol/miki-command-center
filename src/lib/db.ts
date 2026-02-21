import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Tipos de datos
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  taskCount: number;
  tokensUsed: number;
  costEstimate: number;
  status: 'active' | 'completed';
}

export interface Metric {
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  tokensUsed: number;
  costEstimate: number;
  sessionDuration: number;
}

// Keys para Redis
const KEYS = {
  tasks: 'miki:tasks',
  sessions: 'miki:sessions',
  metrics: 'miki:metrics',
  config: 'miki:config',
};

// Tasks
export async function getTasks(): Promise<Task[]> {
  const tasks = await redis.lrange(KEYS.tasks, 0, -1);
  return tasks.map((t: unknown) => JSON.parse(t as string)).reverse();
}

export async function addTask(task: Task): Promise<void> {
  await redis.lpush(KEYS.tasks, JSON.stringify(task));
}

export async function updateTask(updatedTask: Task): Promise<void> {
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t.id === updatedTask.id);
  if (index === -1) return;
  
  // Eliminar y reinsertar (Redis no tiene update en lista)
  await redis.lrem(KEYS.tasks, 0, JSON.stringify(tasks[index]));
  await redis.lpush(KEYS.tasks, JSON.stringify(updatedTask));
}

// Sessions
export async function getSessions(): Promise<Session[]> {
  const sessions = await redis.lrange(KEYS.sessions, 0, -1);
  return sessions.map((s: unknown) => JSON.parse(s as string)).reverse();
}

export async function addSession(session: Session): Promise<void> {
  await redis.lpush(KEYS.sessions, JSON.stringify(session));
}

// Metrics
export async function getMetrics(days: number = 30): Promise<Metric[]> {
  const metrics = await redis.lrange(KEYS.metrics, 0, days - 1);
  return metrics.map((m: unknown) => JSON.parse(m as string));
}

export async function addMetric(metric: Metric): Promise<void> {
  await redis.lpush(KEYS.metrics, JSON.stringify(metric));
  // Mantener solo últimos 90 días
  await redis.ltrim(KEYS.metrics, 0, 89);
}

// Config
export async function getConfig(): Promise<Record<string, unknown>> {
  const config = await redis.get(KEYS.config);
  return (config as Record<string, unknown>) || {};
}

export async function setConfig(config: Record<string, unknown>): Promise<void> {
  await redis.set(KEYS.config, config);
}

export { redis };
