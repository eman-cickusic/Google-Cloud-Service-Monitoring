/**
 * Hello Logging Sample Application
 * 
 * This application demonstrates logging in App Engine along with
 * Service Monitoring SLO implementation.
 */

'use strict';

// [START app]
const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');

const app = express();

// Setup logger for express requests
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  expressFormat: true,
  meta: false
}));

// Custom logger for application events
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

/**
 * Basic route that returns a welcome message
 */
app.get('/', (req, res) => {
  logger.info('Hello request received');
  res.status(200).send('Hello World!');
});

/**
 * Example of structured logging
 */
app.get('/log-structured', (req, res) => {
  // Example of logging structured data
  logger.info('Structured log entry', {
    user: 'unknown',
    action: 'test',
    timestamp: new Date().toISOString()
  });
  
  res.status(200).send('Structured log entry created');
});

/**
 * Example of different log levels
 */
app.get('/log-levels', (req, res) => {
  logger.error('This is an error log');
  logger.warn('This is a warning log');
  logger.info('This is an info log');
  logger.debug('This is a debug log');
  
  res.status(200).send('Multiple log levels created');
});

/**
 * Example of user-initiated event with custom field
 */
app.get('/log-event/:eventName', (req, res) => {
  const eventName = req.params.eventName;
  
  logger.info(`Event received: ${eventName}`, {
    eventName: eventName,
    source: 'user-initiated',
    timestamp: new Date().toISOString()
  });
  
  res.status(200).send(`Event "${eventName}" logged`);
});

/**
 * Generate a custom error for testing error reporting
 */
app.get('/error', (req, res) => {
  try {
    // Deliberately throw an error
    throw new Error('Custom test error');
  } catch (err) {
    logger.error('Error generated for testing', {
      error: err.message,
      stack: err.stack
    });
    
    res.status(500).send('Error was logged');
  }
});

/**
 * Generate a random error for SLO testing
 * This endpoint has approximately 1/1000 chance of error by default
 * Modified to 1/20 to trigger SLO alert
 */
app.get('/random-error', (req, res) => {
  // Generate random number between 0 and 19
  const random = Math.floor(Math.random() * 20);
  
  if (random === 0) {
    // ~5% of requests will trigger error (1 in 20)
    logger.error('Random error occurred', {
      probability: '5%',
      random: random
    });
    
    res.status(500).send('Random error occurred');
  } else {
    logger.info('Random success', {
      random: random
    });
    
    res.status(200).send('Random success');
  }
});

/**
 * Health check endpoint for monitoring systems
 */
app.get('/_ah/health', (req, res) => {
  res.status(200).send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).send('Application Error');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
  console.log(`App listening on port ${PORT}`);
});
// [END app]

module.exports = app;
