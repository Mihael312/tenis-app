import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import sessionsRoutes from './routes/sessions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public/dist')));

// Serve static files
app.get('/public', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dist', 'index.html'));
});

// Routes
app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
