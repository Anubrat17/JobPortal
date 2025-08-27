import "./config/instrument.js";
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize the express app
const app = express();

// Connect to the database
await connectDB();

// Middleware
app.use(cors());

// CRITICAL: Raw body parsing for webhooks BEFORE JSON parsing
app.use('/webhooks', express.raw({ type: 'application/json' }));

// JSON parsing for other routes (after webhook route)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Job Portal API');
});

app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// Webhook route
app.post('/webhooks', clerkWebhooks);

// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});