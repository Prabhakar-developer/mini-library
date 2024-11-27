import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { sendSuccessResponse, sendErrorResponse } from '../utils/api-response.util';
import { Types } from 'mongoose';

const reviewService = new ReviewService();

/**
 * Retrieves all reviews for a specific book, identified by `bookId`.
 * @param req - Express request object containing:
 *   - `bookId` in the request parameters, representing the ID of the book for which reviews are fetched.
 * @param res - Express response object used to send the fetched reviews data.
 * @returns A success response containing an array of reviews for the specified book, or an error response if the operation fails.
 */
export const getBookReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { book, reviews, total } = await reviewService.getBookReviews(id, page, limit);

        sendSuccessResponse(res, 200, {
            message: 'Fetched book reviews successfully',
            data: { 
                book,
                allReviews: {
                    reviews, 
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                }
             },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error fetching book reviews',
            error,
        });
    }
};

/**
 * Adds a review for a specific book by the logged-in user.
 * @param req - Express request object containing:
 *   - `bookId` in the request body to specify the book being reviewed.
 *   - `rating` in the request body, an integer from 1 to 5 representing the user's rating.
 *   - `comment` in the request body, an optional text field for review comments.
 * @param res - Express response object used to send the result of the add review action.
 * @returns A success response with the created review details if successful, or an error response if the operation fails.
 */
export const addReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const bookId = req.params.id as string;
        const { rating, comment } = req.body;

        const review = await reviewService.addReview(
            userId,
            bookId,
            rating,
            comment
        );

        sendSuccessResponse(res, 201, {
            message: 'Review added successfully',
            data: { review },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error adding review',
            error,
        });
    }
};