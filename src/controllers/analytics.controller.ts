import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendErrorResponse, sendSuccessResponse } from '../utils/api-response.util';

const analyticsService = new AnalyticsService();

/**
 * Fetches the list of most borrowed books with pagination.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const getMostBorrowedBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { wishlist, total } = await analyticsService.getMostBorrowedBooks(page, limit);
        sendSuccessResponse(res, 200, {
            message: 'Most borrowed books fetched successfully',
            data: { 
                wishlist, 
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
             },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error fetching most borrowed books',
            error,
        });
    }
};

/**
 * Fetches the list of most active users based on borrowing frequency with pagination.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const getActiveUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { users, total } = await analyticsService.getActiveUsers(page, limit);
        sendSuccessResponse(res, 200, {
            message: 'Active users fetched successfully',
            data: { 
                users, 
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
             },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error fetching active users',
            error,
        });
    }
};

/**
 * Fetches the popularity statistics of books by genre with pagination.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const getGenrePopularity = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { genre, total } = await analyticsService.getGenrePopularity(page, limit);
        sendSuccessResponse(res, 200, {
            message: 'Genre popularity data fetched successfully',
            data: { 
                genre, 
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
             },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error fetching genre popularity data',
            error,
        });
    }
};