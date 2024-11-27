import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health endpoints
 */

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Health check endpoint to verify if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is up and running
 */
router.get('/health-check', healthCheck);

export default router;
