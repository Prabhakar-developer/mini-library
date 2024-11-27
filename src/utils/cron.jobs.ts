import cron from 'node-cron';
import { Book } from '../models/book.model';
import { IUser, User } from '../models/user.model';
import { sendDueDateReminder, sendNewBookNotification } from './email.util';
import { Loan } from '../models/loan.model';

/**
 * Schedules a daily cron job to send reminders for books due soon.
 * This job runs at 8 AM every day.
 */
export const scheduleDueDateReminders = () => {
    cron.schedule('0 8 * * *', async () => {
        console.log('Running daily due date reminder job');

        try {
            // Set a threshold for books due in the next 3 days
            const today = new Date();
            const reminderThreshold = new Date(today);
            reminderThreshold.setDate(today.getDate() + 3);

            // Find loans that are due within the next 3 days
            const dueSoonLoans = await Loan.find({
                dueDate: { $lte: reminderThreshold },
                returned: false,
            }).populate('userId', 'email').populate('bookId', 'title');

            // Send reminders to each user
            for (const loan of dueSoonLoans) {
                const { userId, bookId, dueDate } = loan;

                if (userId && bookId) {
                    await sendDueDateReminder(
                        (userId as any).email, // User's email
                        (bookId as any).title, // Book title
                        dueDate.toDateString() // Formatted due date
                    );
                    console.log(`Reminder sent to ${(userId as any).email} for book "${(bookId as any).title}" due on ${dueDate}`);
                }
            }
        } catch (error) {
            console.error('Error running due date reminder job:', error);
        }
    });
};

/**
 * Schedules a daily cron job to notify all users about newly added books.
 * The job runs at 9 AM every day.
 */
export const scheduleNewBookNotifications = () => {
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily new book notification job');

        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Fetch books added in the last 24 hours
            const newBooks = await Book.find({ createdAt: { $gte: yesterday } });

            if (newBooks.length === 0) {
                console.log('No new books added in the last 24 hours.');
                return;
            }

            // Get titles of new books
            const bookTitles = newBooks.map(book => book.title);
            const bookTitleList = bookTitles.map(title => `- ${title}`).join('\n');

            // Fetch all users to notify them about new books
            const users = await User.find({});

            // Send notifications to all users
            for (const user of users) {
                await sendNewBookNotification(user.email, bookTitleList);
                console.log(`New book notification sent to ${user.email}`);
            }
        } catch (error) {
            console.error('Error running new book notification job:', error);
        }
    });
};