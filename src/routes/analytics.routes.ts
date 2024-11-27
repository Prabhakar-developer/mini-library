import { Router } from 'express';
import { getMostBorrowedBooks, getActiveUsers, getGenrePopularity } from '../controllers/analytics.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /analytics/most-borrowed-books:
 *   get:
 *     summary: Get the list of most borrowed books.
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: Successfully fetched most borrowed books.
 *       500:
 *         description: Internal server error.
 */
router.get('/most-borrowed-books', authenticate, isAdmin, getMostBorrowedBooks);

/**
 * @swagger
 * /analytics/active-users:
 *   get:
 *     summary: Get the list of most active users based on borrowing frequency.
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: Successfully fetched active users.
 *       500:
 *         description: Internal server error.
 */
router.get('/active-users', authenticate, isAdmin, getActiveUsers);

/**
 * @swagger
 * /analytics/genre-popularity:
 *   get:
 *     summary: Get the popularity statistics of books by genre.
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: Successfully fetched genre popularity data.
 *       500:
 *         description: Internal server error.
 */
router.get('/genre-popularity', authenticate, isAdmin, getGenrePopularity);

export default router;
