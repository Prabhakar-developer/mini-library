import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/mongodb.config';
import { setupSwagger } from './config/swagger.config';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import healthRoutes from './routes/health.routes';
import reviewsRoutes from './routes/reviews.routes';
import analyticsRoutes from './routes/analytics.routes';
import wishlistRoutes from './routes/wishlist.routes'
import { scheduleDueDateReminders, scheduleNewBookNotifications } from './utils/cron.jobs';
import { config } from './config/config';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Swagger documentation
setupSwagger(app);

// Connect to the database
connectDatabase();

// Initialize cron job.
scheduleNewBookNotifications()
scheduleDueDateReminders()

// Define routes
app.use('/', healthRoutes);
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewsRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/analytics', analyticsRoutes)

// Start the server
const PORT = config.COMMON.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
