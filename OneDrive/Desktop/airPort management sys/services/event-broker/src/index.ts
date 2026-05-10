import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const clients: express.Response[] = [];

// SSE Endpoint for frontend to listen to events
app.get('/api/events/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

// Webhook endpoint for microservices to broadcast events
app.post('/api/events/broadcast', (req, res) => {
  const { eventType, payload } = req.body;
  
  console.log(`[Event Broker] Broadcasting: ${eventType}`);
  
  // Send to all connected clients
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ eventType, payload })}\n\n`);
  });

  res.status(200).json({ message: 'Event broadcasted successfully' });
});

app.listen(PORT, () => {
  console.log(`Event Broker Service running on port ${PORT}`);
});
