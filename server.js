const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Sentiment = require('sentiment');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const sentiment = new Sentiment();

app.use(express.static('public')); // Serve frontend files
app.use(express.json()); // Parse JSON requests

let moodData = { positive: 0, negative: 0, neutral: 0 }; // Mood tally

app.post('/mood', (req, res) => {
  const text = req.body.text;
  const result = sentiment.analyze(text);
  const score = result.score;

  if (score > 0) moodData.positive++;
  else if (score < 0) moodData.negative++;
  else moodData.neutral++;

  io.emit('moodUpdate', moodData); // Broadcast to clients
  res.sendStatus(200);
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));