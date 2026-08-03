import React, { useState } from 'react';
import { Task } from '../../services/volunteerApi';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  tasks: Task[];
  onUpdateStatus?: (id: string, status: Task['status']) => void;
};

const columns: { key: Task['status']; title: string }[] = [
  { key: 'Pending', title: 'Pending' },
  { key: 'In Progress', title: 'In Progress' },
  { key: 'Completed', title: 'Completed' }
];

const KanbanBoard: React.FC<Props> = ({ tasks, onUpdateStatus }) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  React.useEffect(() => setLocalTasks(tasks), [tasks]);

  const move = (id: string, status: Task['status']) => {
    const updated = localTasks.map(t => t.id === id ? { ...t, status } : t);
    setLocalTasks(updated);
    onUpdateStatus?.(id, status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(col => (
        <div key={col.key} className="bg-slate-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2">{col.title}</h4>
          <div className="space-y-2">
            <AnimatePresence>
              {localTasks.filter(t => t.status === col.key).map(task => (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-slate-500">{task.event} • {task.priority}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {col.key !== 'Pending' && <button onClick={() => move(task.id, 'Pending')} className="text-xs px-2 py-1 bg-slate-100 rounded">Move to Pending</button>}
                      {col.key !== 'In Progress' && <button onClick={() => move(task.id, 'In Progress')} className="text-xs px-2 py-1 bg-slate-100 rounded">Move to In Progress</button>}
                      {col.key !== 'Completed' && <button onClick={() => move(task.id, 'Completed')} className="text-xs px-2 py-1 bg-slate-100 rounded">Complete</button>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
