const { addToQueue } = require('../services/queueService');

const queueMiddleware = (type) => async (req, res, next) => {
  try {
    // Skip queuing for non-intensive operations
    if (req.method === 'GET' && !req.path.includes('/heavy')) {
      return next();
    }

    // Add request to queue
    const job = await addToQueue(type, {
      method: req.method,
      path: req.path,
      body: req.body,
      user: req.user
    });

    // Wait for job completion
    const result = await job.finished();

    // Send response
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = queueMiddleware;
