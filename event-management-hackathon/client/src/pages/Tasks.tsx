import React, { useEffect, useState } from 'react';
import * as api from '../services/volunteerApi';
import TaskTable from '../components/tasks/TaskTable';
import KanbanBoard from '../components/tasks/KanbanBoard';
import { useNavigate } from 'react-router-dom';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<api.Task[]>([]);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getTasks().then((r) => {
      setTasks(r);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await api.deleteTask(id);
    setTasks((s) => s.filter((t) => t.id !== id));
  };

  const updateStatus = async (id: string, status: api.Task['status']) => {
    await api.updateTask(id, { status });
    setTasks((s) => s.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-slate-500">Create and assign tasks to volunteers</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 rounded-md p-2">
            <button onClick={() => setView(v => v === 'table' ? 'kanban' : 'table')} className="px-3 py-1 text-sm">Toggle {view === 'table' ? 'Kanban' : 'Table'}</button>
          </div>
          <button onClick={() => nav('/tasks/create')} className="bg-blue-600 text-white px-4 py-2 rounded-md">Create Task</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded animate-pulse" />
          <div className="h-10 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : view === 'table' ? (
        <TaskTable tasks={tasks} onDelete={handleDelete} />
      ) : (
        <KanbanBoard tasks={tasks} onUpdateStatus={updateStatus} />
      )}
    </div>
  );
};

export default TasksPage;
