'use client';

import { motion } from 'framer-motion';
import { UserCheck, UserX, ScanFace } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BiometricHUD() {
  const [scans, setScans] = useState<{ id: number; status: 'cleared' | 'flagged'; time: string }[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleManualScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    
    try {
      const scanId = `ID-${Math.floor(Math.random() * 9000) + 1000}`;
      const status = Math.random() > 0.2 ? 'cleared' : 'flagged';
      
      const res = await fetch('http://localhost:3001/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, status })
      });
      
      const data = await res.json();
      
      setScans(prev => {
        const newScan = {
          id: data.scanId,
          status: data.status,
          time: new Date(data.timestamp).toLocaleTimeString([], { hour12: false }),
        };
        return [newScan, ...prev].slice(0, 5); // Keep last 5
      });
    } catch (error) {
      console.error('Scan failed', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4 text-[var(--color-terminal-text)]">
        <div className="flex items-center gap-2">
          <ScanFace className="text-[var(--color-aviation-blue)]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Biometric Checkpoint</h3>
        </div>
        <button 
          onClick={handleManualScan}
          disabled={isScanning}
          className="text-xs bg-[var(--color-aviation-blue)] hover:bg-blue-600 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan Passenger'}
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {/* Radar/Scan Animation */}
        <div className={`absolute top-0 right-0 w-12 h-12 border-2 border-[var(--color-aviation-blue)] rounded-full flex items-center justify-center transition-opacity ${isScanning ? 'opacity-100' : 'opacity-20'}`}>
            <motion.div 
              animate={{ rotate: isScanning ? 360 : 0 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-full h-[2px] bg-gradient-to-r from-transparent to-[var(--color-aviation-blue)] origin-left"
            />
        </div>

        <div className="space-y-3 mt-4">
          {scans.map((scan) => (
            <motion.div
              key={scan.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`flex items-center justify-between p-2 rounded border ${
                scan.status === 'cleared' 
                  ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]' 
                  : 'bg-[var(--color-alert-amber)]/10 border-[var(--color-alert-amber)]/30 text-[var(--color-alert-amber)]'
              }`}
            >
              <div className="flex items-center gap-2">
                {scan.status === 'cleared' ? <UserCheck size={16} /> : <UserX size={16} />}
                <span className="text-xs font-mono uppercase">{scan.id}</span>
              </div>
              <span className="text-xs font-mono">{scan.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
