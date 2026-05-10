'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CrisisToggle() {
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('http://localhost:3001/api/flights/delay-propagation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: 'FL101', delayMinutes: 45 }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });

  const handleToggle = () => {
    setIsCrisisMode(!isCrisisMode);
    if (!isCrisisMode) {
      mutation.mutate();
    }
  };

  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: isCrisisMode ? 360 : 0, color: isCrisisMode ? 'var(--color-alert-amber)' : 'var(--color-terminal-text)' }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle size={24} />
        </motion.div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-terminal-text)]">
            Delay Propagation
          </h3>
          <p className="text-xs opacity-70">Simulate cascading delays across active gates</p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-alert-amber)] focus:ring-offset-2 focus:ring-offset-[var(--color-terminal-bg)] ${
          isCrisisMode ? 'bg-[var(--color-alert-amber)]' : 'bg-[var(--color-terminal-surface)] border border-[var(--color-glass-border)]'
        }`}
      >
        <span className="sr-only">Toggle Crisis Mode</span>
        <motion.span
          layout
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
          animate={{ x: isCrisisMode ? 36 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
