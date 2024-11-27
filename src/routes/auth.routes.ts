import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 nullable: true
 *                 example: johndoe
 *                 description: Optional username. If not provided, it will be set to null.
 *               firstName:
 *                 type: string
 *                 nullable: true
 *                 example: john
 *                 description: Optional firstName. If not provided, it will be set to null.
 *               lastName:
 *                 type: string
 *                 nullable: true
 *                 example: doe
 *                 description: Optional lastName. If not provided, it will be set to null.
 *               password:
 *                 type: string
 *                 example: Passw0rd!
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               role:
 *                 type: string
 *                 enum: [Admin, User]
 *                 example: User
 *                 description: The user's role, required. Must be either 'Admin' or 'User'.
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe or johndoe@example.com
 *                 description: Can be either the user's username or email.
 *               password:
 *                 type: string
 *                 example: Passw0rd!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

export default router;
