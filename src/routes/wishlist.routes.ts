// routes/wishlist.router.ts
import { Router } from 'express';
import { addWishlist, fetchWishlist, softDeleteWishlistItem } from '../controllers/wishlist.controller';
import { authenticate, isUser } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management
 */

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Add a book to the user's wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: "60b8d295f8654b3a1aebf9a2"
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to add to wishlist.
 *                 example: "60b8d295f8654b3a1aebf9a3"
 *             required:
 *               - userId
 *               - bookId
 *     responses:
 *       200:
 *         description: Book added to wishlist successfully
 *       400:
 *         description: Bad request
 */
router.post('/add', authenticate, isUser, addWishlist);

/**
 * @swagger
 * /wishlist/fetch/{id}:
 *   get:
 *     summary: Get the wishlist of a user with pagination.
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: "672dbf3d7932a9d2924738ba"
 *         required: true
 *         description: ID of the user
 *       - in: query
 *         name: page
 *         default: 1
 *         schema:
 *           type: integer
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         default: 10
 *         schema:
 *           type: integer
 *         description: The number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: User's wishlist fetched successfully
 *       404:
 *         description: Wishlist not found
 *       500:
 *         description: Server error
 */
router.get('/fetch/:id', authenticate, isUser, fetchWishlist);

/**
 * @swagger
 * /wishlist/delete/{id}:
 *   delete:
 *     summary: Soft deletes a book from the user's wishlist.
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: "672dbf3d7932a9d2924738ba"
 *         required: true
 *         description: ID of the wishlist.
 *     responses:
 *       200:
 *         description: Book removed from wishlist successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/delete/:id', authenticate, isUser, softDeleteWishlistItem);

export default router;
