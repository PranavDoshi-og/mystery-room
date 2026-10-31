import React from 'react';
import { ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

export default function DifficultyBadge({ difficulty, size = 'sm' }) {
  const configs = {
    Easy: {
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      label: 'Easy'
    },
    Medium: {
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Zap,
      label: 'Medium'
    },
    Hard: {
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: ShieldAlert,
      label: 'Hard'
    }
  };

  const current = configs[difficulty] || configs.Medium;
  const Icon = current.icon;
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm gap-2' : 'px-2.5 py-0.5 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center font-mono font-medium rounded-full border ${current.color} ${sizeClasses}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {current.label}
    </span>
  );
}

