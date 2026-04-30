'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plane, Plus, X } from 'lucide-react';

export default function ScheduleFlightForm() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '', airline: '', destination: '', gate: '', time: ''
  });

  const scheduleMutation = useMutation({
    mutationFn: async (newFlight: any) => {
      const res = await fetch('http://localhost:3001/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlight)
      });
      if (!res.ok) throw new Error('Failed to schedule flight');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      setIsOpen(false);
      setFormData({ id: '', airline: '', destination: '', gate: '', time: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMutation.mutate({
      flightId: formData.id,
      airline: formData.airline,
      destination: formData.destination,
      status: 'Scheduled',
      gate: formData.gate,
      time: formData.time
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="glass-card flex items-center justify-center gap-2 p-4 text-[var(--color-terminal-text)] hover:bg-white/5 transition-colors cursor-pointer"
      >
        <Plus className="text-[#38bdf8]" size={20} />
        <span className="font-semibold uppercase tracking-wider text-sm">Schedule New Flight</span>
      </button>
    );
  }

  return (
    <div className="glass-card p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-terminal-text)] flex items-center gap-2">
          <Plane size={16} className="text-[#38bdf8]" />
          New Flight Entry
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Flight ID (e.g. FL999)" className="bg-black/20 border border-[var(--color-glass-border)] rounded p-2 text-xs" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
          <input required placeholder="Airline" className="bg-black/20 border border-[var(--color-glass-border)] rounded p-2 text-xs" value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Destination (e.g. LAX)" className="bg-black/20 border border-[var(--color-glass-border)] rounded p-2 text-xs" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
          <input required placeholder="Gate (e.g. D5)" className="bg-black/20 border border-[var(--color-glass-border)] rounded p-2 text-xs" value={formData.gate} onChange={e => setFormData({...formData, gate: e.target.value})} />
        </div>
        <input required type="time" className="w-full bg-black/20 border border-[var(--color-glass-border)] rounded p-2 text-xs" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
        
        <button 
          type="submit" 
          disabled={scheduleMutation.isPending}
          className="w-full mt-2 bg-[#38bdf8]/20 hover:bg-[#38bdf8]/40 text-[#38bdf8] font-bold py-2 rounded text-xs transition-colors"
        >
          {scheduleMutation.isPending ? 'Scheduling...' : 'Submit Flight to Queue'}
        </button>
      </form>
    </div>
  );
}
