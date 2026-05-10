'use client';

import { motion } from 'framer-motion';

type GateStatus = 'Empty' | 'Docked' | 'Turnaround';

const mockGates = [
  { id: 'A1', x: 50, y: 50, status: 'Docked' as GateStatus },
  { id: 'B4', x: 150, y: 50, status: 'Turnaround' as GateStatus },
  { id: 'C2', x: 250, y: 50, status: 'Empty' as GateStatus },
  { id: 'D5', x: 50, y: 150, status: 'Empty' as GateStatus },
  { id: 'E1', x: 150, y: 150, status: 'Docked' as GateStatus },
  { id: 'F3', x: 250, y: 150, status: 'Turnaround' as GateStatus },
];

const getGateColor = (status: GateStatus) => {
  switch (status) {
    case 'Empty': return '#10b981'; // Emerald 500
    case 'Docked': return '#ef4444'; // Red 500
    case 'Turnaround': return 'var(--color-alert-amber)';
    default: return '#64748b';
  }
};

export default function LiveMap({ flights, onGateClick }: { flights?: any[], onGateClick?: (gateId: string) => void }) {
  // If we had real mappings, we would match flights to gates here
  // For the MVP MVP, we will update the mock map based on the flights data
  
  const gates = mockGates.map(gate => {
    const flight = flights?.find(f => f.gate === gate.id);
    let status: GateStatus = gate.status;
    if (flight) {
       if (flight.status === 'Delayed' || flight.status === 'Delayed (Propagation)') {
           status = 'Docked'; // Keep docked and red if delayed
       } else if (flight.status === 'Boarding') {
           status = 'Turnaround';
       } else if (flight.status === 'Scheduled') {
           status = 'Empty';
       }
    }
    return { ...gate, status };
  });

  return (
    <div className="glass-card p-6 h-[400px] w-full flex items-center justify-center relative overflow-hidden">
      <h3 className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-terminal-text)] opacity-70">
        Terminal Overview
      </h3>
      
      <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
        {/* Terminal Building Path */}
        <path 
          d="M 20 20 L 280 20 L 280 180 L 20 180 Z" 
          fill="rgba(15, 76, 129, 0.1)" 
          stroke="var(--color-aviation-blue)" 
          strokeWidth="2" 
        />
        
        {/* Runways / Taxiways */}
        <path d="M 0 100 L 300 100" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="10,10" />

        {gates.map((gate) => (
          <g key={gate.id}>
            <motion.rect
              x={gate.x - 15}
              y={gate.y - 15}
              width="30"
              height="30"
              rx="4"
              fill={getGateColor(gate.status)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer hover:stroke-white hover:stroke-2"
              whileHover={{ scale: 1.1 }}
              onClick={() => onGateClick && onGateClick(gate.id)}
            />
            <text 
              x={gate.x} 
              y={gate.y + 4} 
              fontSize="10" 
              fill="#fff" 
              textAnchor="middle" 
              fontWeight="bold"
            >
              {gate.id}
            </text>
          </g>
        ))}
      </svg>
      
      <div className="absolute bottom-4 right-4 flex gap-3 text-[10px] uppercase opacity-70">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Empty</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Docked</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--color-alert-amber)]"></div> Turnaround</div>
      </div>
    </div>
  );
}
