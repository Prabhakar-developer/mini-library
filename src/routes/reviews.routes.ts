import { Router } from 'express';
import { addReview, getBookReviews } from '../controllers/reviews.controller';
import { authenticate, isUser } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Reviews endpoints
 */

/**
 * @swagger
 * /reviews/fetch/{bookId}:
 *   get:
 *     summary: Get book details with user reviews
 *     description: Fetches book details and all reviews for the specified book, with pagination for the reviews.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           example: "672dbf3d7932a9d2924738ba"
 *         description: The ID of the book to retrieve reviews for.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of reviews per page (default is 10).
 *     responses:
 *       200:
 *         description: Successfully fetched book details and reviews.
 *       400:
 *         description: Bad Request - Invalid book ID format.
 *       404:
 *         description: Not Found - Book or reviews not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/fetch/:id', authenticate, isUser, getBookReviews);

/**
 * @swagger
 * /reviews/add/{id}:
 *   post:
 *     summary: Add a review for a specific book
 *     description: Allows a user to add a review and rating for a book they've borrowed.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the book to be reviewed
 *           example: "60d21b4967d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Rating for the book, from 1 to 5.
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Optional comment for the book review.
 *                 example: "Great book, highly recommend!"
 *     responses:
 *       201:
 *         description: Review added successfully.
 *       400:
 *         description: Bad Request - Missing or invalid input.
 *       401:
 *         description: Unauthorized - User is not logged in.
 *       404:
 *         description: Not Found - Book not found.
 *       500:
 *         description: Internal Server Error - Unexpected error.
 */
router.post('/add/:id', authenticate, isUser, addReview);

export default router;
