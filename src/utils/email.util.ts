import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer transporter using SMTP configuration.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends an email with the specified subject and body content to the given recipient.
 * 
 * @param to - Recipient's email address
 * @param subject - Subject of the email
 * @param text - Plain text content of the email
 * @param html - HTML content of the email (optional)
 * @returns Promise resolving when the email is sent
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL, // Sender address
            to,
            subject,
            text,
            html,
        });
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};

/**
 * Sends a due date reminder email to the user.
 * 
 * @param to - Recipient's email address
 * @param bookTitle - Title of the borrowed book
 * @param dueDate - Due date of the borrowed book
 */
export const sendDueDateReminder = async (to: string, bookTitle: string, dueDate: string): Promise<void> => {
    const subject = 'Reminder: Upcoming Due Date for Borrowed Book';
    const text = `Dear User,\n\nThis is a reminder that your borrowed book "${bookTitle}" is due on ${dueDate}. Please make sure to return it on time.\n\nThank you,\nLibrary Team`;
    const html = `<p>Dear User,</p><p>This is a reminder that your borrowed book "<strong>${bookTitle}</strong>" is due on <strong>${dueDate}</strong>. Please make sure to return it on time.</p><p>Thank you,<br>Library Team</p>`;

    await sendEmail(to, subject, text, html);
};

/**
 * Sends a notification email to the user about a new book in their preferred genre.
 * 
 * @param to - Recipient's email address
 * @param bookTitle - Title of the new book
 * @param genre - Genre of the new book
 */
export const sendNewBookNotification = async (to: string, bookTitle: string): Promise<void> => {
    const subject = `New Book Available`;
    const text = `Hello,\n\nA new book titled "${bookTitle}" has been added. Check it out in the library!\n\nBest regards,\nLibrary Team`;
    const html = `<p>Hello,</p><p>A new book titled "<strong>${bookTitle}</strong>" has been added. Check it out in the library!</p><p>Best regards,<br>Library Team</p>`;

    await sendEmail(to, subject, text, html);
};
