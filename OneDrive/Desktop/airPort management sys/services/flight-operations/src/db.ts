import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightId: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true, enum: ['Scheduled', 'Boarding', 'Taxiing', 'Airborne', 'Landed', 'Delayed', 'Delayed (Propagation)'] },
  gate: { type: String },
  time: { type: String }
});

export const Flight = mongoose.model('Flight', flightSchema);

const passengerScanSchema = new mongoose.Schema({
  scanId: { type: String, required: true },
  status: { type: String, required: true, enum: ['cleared', 'flagged'] },
  timestamp: { type: Date, default: Date.now }
});

export const PassengerScan = mongoose.model('PassengerScan', passengerScanSchema);

import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017/aeronexus?authSource=admin';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB connected successfully to real instance');
  } catch (error) {
    console.log('\n[INFO] Real MongoDB connection failed (Docker not running?).');
    console.log('[INFO] Booting up In-Memory MongoDB Server for seamless experience...\n');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('MongoDB connected to In-Memory Server successfully');
    } catch (memError) {
      console.error('Failed to start in-memory database:', memError);
    }
  }

  // Auto-seed if empty
  try {
    const count = await Flight.countDocuments();
    if (count === 0) {
      console.log('[INFO] Database is empty. Seeding initial data...');
      const initialFlights = [
        { flightId: 'FL101', airline: 'AeroNexus', destination: 'JFK', status: 'Scheduled', gate: 'A1', time: '10:00 AM' },
        { flightId: 'FL202', airline: 'SkyConnect', destination: 'LHR', status: 'Boarding', gate: 'B4', time: '11:30 AM' },
        { flightId: 'FL303', airline: 'GlobalWings', destination: 'DXB', status: 'Taxiing', gate: 'C2', time: '12:15 PM' },
      ];
      await Flight.insertMany(initialFlights);
      console.log('[INFO] Seeding complete.');
    }
  } catch (seedError) {
    console.error('Auto-seed failed:', seedError);
  }
};
