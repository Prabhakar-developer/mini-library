import { Router } from 'express';
import { addBook, updateBook, deleteBook, getBooks, borrowBook, searchBooks, returnBook } from '../controllers/book.controller';
import { authenticate, isAdmin, isUser } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books endpoints
 */

/**
 * @swagger
 * /books/fetch:
 *   get:
 *     summary: Fetch books with pagination
 *     tags: [Books]
 *     parameters:
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
 *         description: Number of books per page (default is 10).
 *     responses:
 *       200:
 *         description: Successfully fetched books with pagination
 *       500:
 *         description: Internal server error
 */
router.get('/fetch', authenticate, getBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search for books with optional filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by book title
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by book author
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by book genre
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by publication start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by publication end date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved books
 *       500:
 *         description: Server error occurred
 */
router.get('/search', authenticate, searchBooks);

/**
 * @swagger
 * /books/add:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Great Gatsby
 *               author:
 *                 type: string
 *                 example: F. Scott Fitzgerald
 *               genre:
 *                 type: string
 *                 example: Classic
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "1925-04-10"
 *               description:
 *                 type: string
 *                 example: "A novel set in the Jazz Age..."
 *     responses:
 *       201:
 *         description: Book added successfully
 *       500:
 *         description: Error adding book
 */
router.post('/add', authenticate, isAdmin, addBook);

/**
 * @swagger
 * /books/update/{id}:
 *   put:
 *     summary: Update book details
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Great Gatsby
 *               author:
 *                 type: string
 *                 example: F. Scott Fitzgerald
 *               genre:
 *                 type: string
 *                 example: Classic
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: "1925-04-10"
 *               description:
 *                 type: string
 *                 example: "A novel set in the Jazz Age..."
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Error updating book
 */
router.put('/update/:id', authenticate, isAdmin, updateBook);

/**
 * @swagger
 * /books/delete/{id}:
 *   delete:
 *     summary: Soft delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Error deleting book
 */
router.delete('/delete/:id', authenticate, isAdmin, deleteBook);

/**
 * @swagger
 * /books/borrow/{id}:
 *   get:
 *     summary: Borrow a book
 *     tags: [Books]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the book to borrow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Book ID is required and must be valid
 *       401:
 *         description: Unauthorized - User must be logged in
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get('/borrow/:id', authenticate, isUser, borrowBook);

/**
 * @swagger
 * /books/return/{id}:
 *   get:
 *     summary: return a book
 *     tags: [Books]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: loan ID of the borrowed book.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: loan ID is required and must be valid
 *       401:
 *         description: Unauthorized - User must be logged in
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get('/return/:id', authenticate, isUser, returnBook);

export default router;
