import { sendErrorResponse } from '../utils/api-response.util';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

/**
 * Middleware to authenticate the request by verifying the JWT token.
 * If valid, the decoded user information is attached to the request object.
 * Otherwise, it sends an error response for missing or invalid tokens.
 */

enum UserRoles {
  ADMIN = 'Admin',
  USER = 'User',
}

export const authenticate = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return sendErrorResponse(res, 401, {
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT.SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(res, 400, {
      message: 'Invalid token.',
      error,
    });
  }
};

/**
 * Middleware to check if the user has an admin role.
 * Allows the request to proceed if the user is an admin; otherwise, sends a forbidden error response.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const user = (req as any).user;

  if (!user || user.role !== UserRoles.ADMIN) {
    return sendErrorResponse(res, 403, {
      message: 'Forbidden: You are not authorized to perform this action',
    });
  }

  next();
};

/**
 * Middleware to check if the user has a regular user role.
 * Allows the request to proceed if the user is a regular user; otherwise, sends a forbidden error response.
 */
export const isUser = (req: Request, res: Response, next: NextFunction): any => {
  const user = (req as any).user;

  if (!user || !Object.values(UserRoles).includes(user.role)) {
    return sendErrorResponse(res, 403, {
      message: 'Forbidden: You are not authorized to perform this action',
    });
  }

  next();
};
