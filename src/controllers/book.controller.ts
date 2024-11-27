import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { ApiResponse, sendErrorResponse, sendSuccessResponse } from '../utils/api-response.util';
import { config } from '../config/config';

const bookService = new BookService();

/**
 * Fetch books with pagination
 * @param req - The request object containing page and limit query parameters.
 * @param res - The response object to send the results.
 */
export const getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the page and limit from query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Call the service method to fetch books
        const { books, total } = await bookService.fetchBooks(page, limit);

        // Send the response with paginated data
        sendSuccessResponse(res, 200, {
            message: 'Books fetched successfully',
            data: {
                books,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Failed to fetch books',
            error,
        });
    }
};

/**
 * Controller to search for books with filters.
 * @param req - Express request object containing query parameters for filters.
 * @param res - Express response object to return filtered books.
 */
export const searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, author, genre, startDate, endDate } = req.query;

        // Get the page and limit from query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Convert pagination and date values to appropriate types
        const filters = {
            title: title?.toString(),
            author: author?.toString(),
            genre: genre?.toString(),
            startDate: startDate ? new Date(startDate.toString()) : undefined,
            endDate: endDate ? new Date(endDate.toString()) : undefined,
        };

        const { books, total } = await bookService.searchBooks(filters, page, limit);
        sendSuccessResponse(res, 200, {
            message: 'Books retrieved successfully',
            data:  {
                books,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error retrieving books',
            error,
        });
    }
};

/**
 * Add a new book to the collection
 * @param req - The request object containing the book data in the body.
 * @param res - The response object to send the results.
 */
export const addBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: userId } = (req as any).user; 

        const book = await bookService.addBook({
            ...req.body,
            createdBy: userId,
            updatedBy: userId
        });

        // Send success response
        sendSuccessResponse(res, 201, {
            message: 'Book added successfully',
            data: book,
        });
    } catch (error) {
        // Send error response
        sendErrorResponse(res, 500, {
            message: 'Error adding book',
            error,
        });
    }
};

/**
 * Update an existing book's information
 * @param req - The request object containing the updated book data in the body.
 * @param res - The response object to send the results.
 */
export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = req.params.id as string;
        if (!bookId) {
            sendErrorResponse(res, 400, { message: 'Book ID is required.' });
            return;
        }
        const book = await bookService.updateBook(bookId, req.body);

        if (book) {
            // Send success response
            sendSuccessResponse(res, 200, {
                message: 'Book updated successfully',
                data: book,
            });
        } else {
            // Send error if the book was not found
            sendErrorResponse(res, 404, {
                message: 'Book not found',
            });
        }
    } catch (error) {
        console.log(error);
        
        // Send error response for update failure
        sendErrorResponse(res, 500, {
            message: 'Error updating book',
            error,
        });
    }
};

/**
 * Soft delete a book from the collection
 * @param req - The request object containing the book ID in the parameters.
 * @param res - The response object to send the results.
 */
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = req.params.id as string;
        const book = await bookService.softDeleteBook(bookId);

        if (book) {
            // Send success response
            sendSuccessResponse(res, 200, {
                message: 'Book deleted successfully',
                data: book,
            });
        } else {
            // Send error if the book was not found
            sendErrorResponse(res, 404, {
                message: 'Book not found',
            });
        }
    } catch (error) {
        // Send error response for delete failure
        sendErrorResponse(res, 500, {
            message: 'Error deleting book',
            error,
        });
    }  
};

/**
 * Allow a user to borrow a book by ID, updating its availability status.
 * @param req - Express request object containing the bookId in the body.
 * @param res - Express response object to confirm borrowing action.
 */
export const borrowBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = req.params.id as string;
        const days = parseInt(req.params.days as string) || 7;
        const { id: userId } = (req as any).user;

        const book = await bookService.borrowBook(bookId, userId, days);
        sendSuccessResponse(res, 200, {
            message: 'Book borrowed successfully',
            data: book,
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error borrowing book',
            error,
        });
    }
};

/**
 * Allow a user to return a book by loanID, updating its availability status.
 * @param req - Express request object containing the bookId in the body.
 * @param res - Express response object to confirm borrowing action.
 */
export const returnBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const loanId = req.params.id as string;

        const { daysOverdue, penalty } = await bookService.calculatePenaltyForLoan(loanId, config.COMMON.PENALTY_RATE);

        const book = await bookService.returnBook(loanId);
        sendSuccessResponse(res, 200, {
            message: 'Book return successfully',
            data: {
                book,
                daysOverdue, 
                penalty
            }
        });
    } catch (error) {
        sendErrorResponse(res, 500, {
            message: 'Error returning book',
            error,
        });
    }
};
