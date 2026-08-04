import { useState } from 'react';
import { motion } from 'framer-motion';

const initialData = [
  { id: 1, user: 'Alice Johnson', action: 'Created new project', date: '2025-07-30', status: 'Completed' },
  { id: 2, user: 'Bob Smith', action: 'Updated billing info', date: '2025-07-29', status: 'Completed' },
  { id: 3, user: 'Carol Davis', action: 'Invited team members', date: '2025-07-29', status: 'Pending' },
  { id: 4, user: 'Dave Wilson', action: 'Deployed to production', date: '2025-07-28', status: 'Completed' },
  { id: 5, user: 'Eve Martinez', action: 'Submitted support ticket', date: '2025-07-28', status: 'In Progress' },
  { id: 6, user: 'Frank Lee', action: 'Generated monthly report', date: '2025-07-27', status: 'Completed' },
];

/**
 * Sortable activity table.
 * Click column headers to toggle ascending/descending sort.
 */
export default function ActivityTable() {
  const [data, setData] = useState(initialData);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key) => {
    const asc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(asc);
    setData((prevData) => [...prevData].sort((a, b) => {
      const valA = a[key], valB = b[key];
      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    }));
  };

  const statusColors = {
    Completed: 'bg-emerald-500/15 text-emerald-400',
    Pending: 'bg-amber-500/15 text-amber-400',
    'In Progress': 'bg-indigo-500/15 text-indigo-400',
  };

  const SortIcon = ({ column }) => (
    <svg className={`w-3.5 h-3.5 inline ml-1 transition-transform ${sortKey === column && !sortAsc ? 'rotate-180' : ''} ${sortKey === column ? 'text-indigo-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <p className="text-sm text-slate-400 mt-1">Latest actions across your platform</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {[['user', 'User'], ['action', 'Action'], ['date', 'Date'], ['status', 'Status']].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors"
                >
                  {label}
                  <SortIcon column={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {row.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{row.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.action}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
