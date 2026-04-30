'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LiveMap from '@/components/LiveMap';
import CrisisToggle from '@/components/CrisisToggle';
import BiometricHUD from '@/components/BiometricHUD';
import ScheduleFlightForm from '@/components/ScheduleFlightForm';
import { Activity, PlaneTakeoff, PlaneLanding, Clock, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const { data: flights, isLoading } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3001/api/flights');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  const updateFlightMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`http://localhost:3001/api/flights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    }
  });

  const selectedFlight = flights?.find((f: any) => f.gate === selectedGate);

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-4 md:px-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-[var(--color-terminal-text)] flex items-center gap-2">
            <Activity className="text-[var(--color-aviation-blue)]" />
            AeroNexus <span className="text-[var(--color-aviation-blue)]">2026</span>
          </h1>
          <p className="text-xs text-[var(--color-terminal-text)] opacity-60 uppercase tracking-widest mt-1">
            Autonomous Airport Operating System
          </p>
        </div>
        <div className="flex gap-4">
          <CrisisToggle />
        </div>
      </header>

      {/* Grid Layout with Container Queries */}
      <div className="@container">
        <div className="grid grid-cols-1 @4xl:grid-cols-12 gap-6">
          
          {/* Main Map Area (Spans 8 columns on large screens) */}
          <div className="col-span-1 @4xl:col-span-8 flex flex-col gap-6 relative">
            <LiveMap flights={flights} onGateClick={setSelectedGate} />

            {/* Interactive Gate Control Panel */}
            {selectedGate && (
              <div className="absolute top-4 right-4 glass-card p-4 w-64 z-10 shadow-2xl bg-[var(--color-terminal-bg)]/90">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-[var(--color-terminal-text)]">Gate {selectedGate} Control</h3>
                  <button onClick={() => setSelectedGate(null)} className="text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                
                {selectedFlight ? (
                  <div className="space-y-3">
                    <div className="text-xs uppercase opacity-70">Active Flight</div>
                    <div className="font-mono text-lg font-bold text-[var(--color-aviation-blue)]">{selectedFlight.id}</div>
                    <div className="text-sm">{selectedFlight.airline} to {selectedFlight.destination}</div>
                    <div className="pt-2 flex flex-col gap-2">
                      <button 
                        onClick={() => updateFlightMutation.mutate({ id: selectedFlight.id, status: 'Boarding' })}
                        className="bg-[#38bdf8]/20 hover:bg-[#38bdf8]/40 text-[#38bdf8] py-1 px-2 rounded text-xs transition-colors"
                      >
                        Start Boarding
                      </button>
                      <button 
                        onClick={() => updateFlightMutation.mutate({ id: selectedFlight.id, status: 'Taxiing' })}
                        className="bg-[var(--color-alert-amber)]/20 hover:bg-[var(--color-alert-amber)]/40 text-[var(--color-alert-amber)] py-1 px-2 rounded text-xs transition-colors"
                      >
                        Pushback / Taxi
                      </button>
                      <button 
                        onClick={() => updateFlightMutation.mutate({ id: selectedFlight.id, status: 'Airborne' })}
                        className="bg-[#10b981]/20 hover:bg-[#10b981]/40 text-[#10b981] py-1 px-2 rounded text-xs transition-colors"
                      >
                        Confirm Takeoff (Clear Gate)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">No scheduled flights for this gate currently.</div>
                )}
              </div>
            )}
            
            {/* Flights List / Schedule */}
            <div className="glass-card p-6 flex-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-terminal-text)] mb-4 flex items-center gap-2">
                <Clock size={16} className="text-[var(--color-aviation-blue)]" />
                Live Operations Log
              </h3>
              
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-white/5 rounded w-full"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[var(--color-terminal-text)]">
                    <thead className="text-xs uppercase bg-[var(--color-terminal-bg)]/50 border-b border-[var(--color-glass-border)]">
                      <tr>
                        <th className="px-4 py-3">Flight ID</th>
                        <th className="px-4 py-3">Airline</th>
                        <th className="px-4 py-3">Dest</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Gate</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights?.map((flight: any) => (
                        <tr key={flight.id} className="border-b border-[var(--color-glass-border)]/50 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-mono">{flight.id}</td>
                          <td className="px-4 py-3">{flight.airline}</td>
                          <td className="px-4 py-3 font-mono">{flight.destination}</td>
                          <td className="px-4 py-3">{flight.time}</td>
                          <td className="px-4 py-3 font-bold">{flight.gate}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs uppercase font-semibold
                              ${flight.status.includes('Delayed') ? 'bg-[var(--color-alert-amber)]/20 text-[var(--color-alert-amber)]' : 
                                flight.status === 'Boarding' ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 
                                'bg-[#10b981]/20 text-[#10b981]'}`
                            }>
                              {flight.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Widgets (Spans 4 columns) */}
          <div className="col-span-1 @4xl:col-span-4 flex flex-col gap-6">
            <BiometricHUD />
            <ScheduleFlightForm />
            
            {/* Quick Stats */}
            <div className="glass-card p-5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-terminal-bg)]/50 rounded-lg border border-[var(--color-glass-border)]">
                <PlaneTakeoff className="text-[#38bdf8] mb-2" size={20} />
                <div className="text-2xl font-bold">124</div>
                <div className="text-xs uppercase opacity-60">Departures</div>
              </div>
              <div className="p-4 bg-[var(--color-terminal-bg)]/50 rounded-lg border border-[var(--color-glass-border)]">
                <PlaneLanding className="text-[#10b981] mb-2" size={20} />
                <div className="text-2xl font-bold">98</div>
                <div className="text-xs uppercase opacity-60">Arrivals</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
