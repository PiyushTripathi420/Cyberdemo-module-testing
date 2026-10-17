require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Task = require('./Models/Task');
const { leaderAgent, workerAgent, reviewerAgent } = require('./agents');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

io.on('connection', (socket) => {
  socket.on('run-workflow', async (userTask) => {
    try {
      // Step 1: Leader Planning
      socket.emit('status', { agent: 'Leader (Claude)', state: 'Planning...' });
      const plan = await leaderAgent(userTask);

      // Step 2: Worker Execution
      socket.emit('status', { agent: 'Worker (GPT-4o)', state: 'Executing...' });
      const result = await workerAgent(plan);

      // Step 3: Reviewer Quality Check
      socket.emit('status', { agent: 'Reviewer (Claude)', state: 'Auditing...' });
      const audit = await reviewerAgent(userTask, result);

      // Save to MongoDB Atlas
      const newTask = new Task({
        title: userTask,
        leaderPlan: plan,
        executionResult: result,
        auditStatus: audit,
        status: 'completed'
      });
      await newTask.save();

      socket.emit('completed', { plan, result, audit });
    } catch (err) {
      socket.emit('error', err.message);
    }
  });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
