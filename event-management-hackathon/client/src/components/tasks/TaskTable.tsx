import React from 'react';
import { Task } from '../../services/volunteerApi';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Props = {
  tasks: Task[];
  onDelete?: (id: string) => void;
};

const statusClass = (s: Task['status']) => {
  switch (s) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100';
  }
};

const TaskTable: React.FC<Props> = ({ tasks, onDelete }) => {
  const nav = useNavigate();
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500">
            <th className="py-2">Task</th>
            <th>Volunteer</th>
            <th>Priority</th>
            <th>Due</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id} className="border-t">
              <td className="py-3">{t.title}</td>
              <td>{t.volunteerId || 'Unassigned'}</td>
              <td>{t.priority}</td>
              <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
              <td><span className={`px-2 py-1 rounded-full text-xs ${statusClass(t.status)}`}>{t.status}</span></td>
              <td className="text-right">
                <button onClick={() => nav(`/tasks/${t.id}`)} className="p-1 rounded-md hover:bg-slate-100 mr-2"><Edit className="h-4 w-4" /></button>
                <button onClick={() => onDelete?.(t.id)} className="p-1 rounded-md hover:bg-slate-100"><Trash2 className="h-4 w-4 text-red-600" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
