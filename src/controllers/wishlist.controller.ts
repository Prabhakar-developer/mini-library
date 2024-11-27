// controllers/wishlist.controller.ts
import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { sendErrorResponse, sendSuccessResponse } from '../utils/api-response.util';

const wishlistService = new WishlistService();

/**
 * Adds a book to the user's wishlist.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const addWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, bookId } = req.body;
        const wishlistItem = await wishlistService.addWishlist(userId, bookId);

        sendSuccessResponse(res, 201, {
            message: 'Book added to wishlist successfully',
            data: wishlistItem,
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error adding book to wishlist',
            error,
        });
    }
};

/**
 * Retrieves the wishlist for a specific user.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const fetchWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: userId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const { wishlist, total } = await wishlistService.fetchWishlist(userId, page, limit);

        if (!wishlist) {
            sendErrorResponse(res, 404, {
                message: 'Wishlist not found',
            });
        }

        sendSuccessResponse(res, 200, {
            message: 'Wishlist fetched successfully',
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
            message: 'Error fetching wishlist',
            error,
        });
    }
};

/**
 * Soft deletes a book from the user's wishlist by marking it as 'Deleted'.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const softDeleteWishlistItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const wishlistId = req.params.id as string;
        const updatedWishlistItem = await wishlistService.softDeleteWishlistItem(wishlistId);
        sendSuccessResponse(res, 200, {
            message: 'Book removed from wishlist successfully',
            data: updatedWishlistItem,
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error removing book from wishlist',
            error,
        });
    }
};
