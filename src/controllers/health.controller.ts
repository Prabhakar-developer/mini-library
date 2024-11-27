import { sendSuccessResponse } from '../utils/api-response.util';
import { Request, Response } from 'express';

/**
 * Health check endpoint to ensure the API is running.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns void
 */
export const healthCheck = (req: Request, res: Response): void => {
  // Send a 200 status code response with health status
  sendSuccessResponse(res, 200, {
    message: 'API is up and running',
    data: { status: 'UP' },
  });
};
