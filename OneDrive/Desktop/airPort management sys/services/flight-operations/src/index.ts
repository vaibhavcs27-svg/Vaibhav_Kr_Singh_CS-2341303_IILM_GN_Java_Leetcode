import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, Flight, PassengerScan } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Seed Data Endpoint (for initializing DB)
app.post('/api/flights/seed', async (req, res) => {
  try {
    await Flight.deleteMany({});
    const initialFlights = [
      { flightId: 'FL101', airline: 'AeroNexus', destination: 'JFK', status: 'Scheduled', gate: 'A1', time: '10:00 AM' },
      { flightId: 'FL202', airline: 'SkyConnect', destination: 'LHR', status: 'Boarding', gate: 'B4', time: '11:30 AM' },
      { flightId: 'FL303', airline: 'GlobalWings', destination: 'DXB', status: 'Taxiing', gate: 'C2', time: '12:15 PM' },
    ];
    await Flight.insertMany(initialFlights);
    res.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

app.get('/api/flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    // Map _id to id for the frontend
    const mappedFlights = flights.map(f => ({
      id: f.flightId,
      airline: f.airline,
      destination: f.destination,
      status: f.status,
      gate: f.gate,
      time: f.time
    }));
    res.json(mappedFlights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Manual Flight Update Endpoint
app.put('/api/flights/:id', async (req, res) => {
  try {
    const { status, gate } = req.body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (gate) updateData.gate = gate;
    
    await Flight.updateOne({ flightId: req.params.id }, updateData);
    res.json({ message: 'Flight updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Create New Flight Endpoint
app.post('/api/flights', async (req, res) => {
  try {
    const { flightId, airline, destination, status, gate, time } = req.body;
    const newFlight = new Flight({ flightId, airline, destination, status, gate, time });
    await newFlight.save();
    res.status(201).json({ message: 'Flight created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Creation failed' });
  }
});

// Biometric Scan Endpoint
app.post('/api/scans', async (req, res) => {
  try {
    const { scanId, status } = req.body;
    const newScan = new PassengerScan({ scanId, status });
    await newScan.save();
    
    // Explicit Terminal Logging to show the user
    console.log(`\n========================================`);
    console.log(`[BIOMETRIC SCAN] ID: ${scanId}`);
    console.log(`[RESULT] ${status.toUpperCase()}`);
    console.log(`[TIMESTAMP] ${new Date().toLocaleTimeString()}`);
    console.log(`[DATABASE] Saved to MongoDB successfully`);
    console.log(`========================================\n`);

    res.status(201).json(newScan);
  } catch (error) {
    res.status(500).json({ error: 'Scan failed' });
  }
});

// "Crisis Toggle" propagation endpoint
app.post('/api/flights/delay-propagation', async (req, res) => {
  const { flightId, delayMinutes } = req.body;
  
  try {
    // 1. Delay the specific flight
    await Flight.updateOne({ flightId }, { status: 'Delayed' });
    
    // 2. Simulate propagation: Any 'Scheduled' flight becomes 'Delayed (Propagation)'
    await Flight.updateMany(
      { status: 'Scheduled' }, 
      { status: 'Delayed (Propagation)' } // Note: we should add this to enum if not present, but mongoose might complain if strict
    );
    
    // Emit event to Notification Broker (fire-and-forget)
    fetch('http://localhost:3003/api/events/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'DELAY_PROPAGATION',
        payload: { sourceFlightId: flightId, timestamp: new Date() }
      })
    }).catch(err => console.error('[FlightOps] Failed to reach Event Broker:', err.message));
    
    res.json({ message: 'Delay propagation triggered' });
  } catch (error) {
    res.status(500).json({ error: 'Propagation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Flight Operations Service running on port ${PORT}`);
});
