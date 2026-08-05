import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`animate-pulse rounded-lg ${isDark ? 'bg-zinc-800/80' : 'bg-zinc-200'} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
    <Skeleton className="h-8 w-36" />
    <Skeleton className="h-3 w-full" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-2 border-b border-zinc-800/50">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export default Skeleton;
