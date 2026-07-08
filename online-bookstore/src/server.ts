// src/server.ts
import { query } from './config/database';
import dotenv from "dotenv";
import express from "express";

// import cors middleware. it allows that frontend running on separate port/domain,
// take data from backend
import cors from "cors";

// import helmet middleware. it set security headers
// it saves from common web vulnerabilities
import helmet from "helmet";

// import mogan middleware
// it log every API request on console
import morgan from "morgan";

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes'; 
import { errorHandler } from './middleware/error.middleware';

// read env file and load all variables in process.env
dotenv.config();

// create express app instance
const app = express();

                 // Middleware
// parse json body of incoming request and convert it into js object
// without it, req.body is undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// set security related headers in http response header 
app.use(helmet());

// print logs in dev format
// it shows METHODS, url, status codes, response time and size of every request on cnsole 
app.use(morgan('dev'));


                          // Routes 
// authRoute                          
app.use('/api/auth', authRoutes);
// userRoute
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Database Test Route 
app.get('/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW() as current_time');
    res.json({
      success: true,
      message: 'Database Connected!',
      time: result.rows[0].current_time
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: 'Database Connection Failed',
      error: errorMessage
    });
  }
});

// 404 handler - if no route found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler - at last 
app.use(errorHandler);  // Global error handler

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Auth: http://localhost:${PORT}/api/auth`);
    console.log(`User: http://localhost:${PORT}/api/user`);
});