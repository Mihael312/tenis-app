import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.js'; // Import users routes
import sessionsRoutes from './routes/sessions.js'; // Import sessions routes
import mysql from 'mysql2';

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '26012000Mb-',
    database: 'tennis',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the tennis database');
});

export default db;



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/users', usersRoutes);    // Routes for user API
app.use('/sessions', sessionsRoutes); // Routes for session API

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
