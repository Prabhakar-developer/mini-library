import { ILoan, Loan } from '../models/loan.model';
import { Book, IBook, BookStatus } from '../models/book.model';
import { ObjectId } from 'mongodb'

export class BookService {
    /**
     * Fetches books with pagination.
     * Filters out books that are marked as deleted.
     * 
     * @param page - The page number for pagination (default 1).
     * @param limit - The number of books per page (default 10).
     * @returns A paginated list of books and the total count.
     */
    async fetchBooks(page: number = 1, limit: number = 10): Promise<{ books: IBook[], total: number }> {
        // Calculate skip value based on page and limit for pagination
        const skip = (page - 1) * limit;

        // Fetch paginated books and the total count of books in the collection, excluding deleted books
        const [books, total] = await Promise.all([
            Book.find({ deleted: false })
                .skip(skip)
                .limit(limit)
                .select('title author genre publicationDate description status averageRating reviewCount deleted createdBy updatedBy deletedBy createdAt updatedAt deletedAt'),
            Book.countDocuments({ deleted: false })
        ]);

        // Return the paginated result and total count
        return { books, total };
    }

    /**
     * Adds a new book to the collection.
     * 
     * @param details - The details of the book to be added (e.g., title, author, etc.).
     * @returns The created book object.
     */
    async addBook(details: Partial<IBook>): Promise<IBook | null> {
        // Create a new book record in the database
        const book = await Book.create(details);

        // Query the created book to return only specific fields
        return Book.findById(book._id)
            .select('title author genre publicationDate description status averageRating reviewCount deleted createdBy updatedBy deletedBy createdAt updatedAt deletedAt') 
            .exec();
        }

    /**
     * Updates an existing book's details.
     * 
     * @param id - The ID of the book to be updated.
     * @param updates - The fields to update in the book record.
     * @returns The updated book object or null if the book was not found.
     */
    async updateBook(id: string, updates: Partial<IBook>): Promise<IBook | null> {
        // Find the book by ID and update it with the provided details
        return Book.findByIdAndUpdate(id, updates, { new: true })
                    .select('title author genre publicationDate description status averageRating reviewCount deleted createdBy updatedBy deletedBy createdAt updatedAt deletedAt')
                    .exec();
    }

    /**
     * Soft deletes a book by marking it as deleted without removing it from the database.
     * 
     * @param id - The ID of the book to be soft deleted.
     * @returns The updated book object with the `deleted` flag set to true, or null if the book was not found.
     */
    async softDeleteBook(id: string): Promise<IBook | null> {
        // Update the book's `deleted` field to true for soft deletion
        return Book.findByIdAndUpdate(id, { deleted: true }, { new: true })
                    .select('title author genre publicationDate description status averageRating reviewCount deleted createdBy updatedBy deletedBy createdAt updatedAt deletedAt')
                    .exec();
    }

    /**
     * Search for books based on provided filters.
     *
     * @param filters - An object containing search filters: title, author, genre, date range, etc.
     * @param page - Page number for pagination.
     * @param limit - Number of items per page.
     * @returns Paginated results with filtered books.
     */
    async searchBooks (
        filters: {
            title?: string;
            author?: string;
            genre?: string;
            startDate?: Date;
            endDate?: Date;
        },
        page: number,
        limit: number
    ): Promise<{ books: IBook[]; total: number }> {
        // Exclude deleted books
        const query: any = { deleted: false }; 

         // Partial title search with regex
        if (filters.title) {
            query.title = { $regex: filters.title, $options: 'i' };
        }

        // Partial author search with case-insensitive regex
        if (filters.author) {
            query.author = { $regex: filters.author, $options: 'i' };
        }

        // Filter by genre
        if (filters.genre) {
            query.genre = filters.genre;
        }

        // Filter by publication date range
        if (filters.startDate || filters.endDate) {
            query.publicationDate = {};
            if (filters.startDate) query.publicationDate.$gte = filters.startDate;
            if (filters.endDate) query.publicationDate.$lte = filters.endDate;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch matching books with pagination and sorting
        const books = await Book.find(query)
            .sort({ publicationDate: -1 }) // Sort by publication date
            .skip(skip)
            .limit(limit)
            .select('title author genre publicationDate description status averageRating reviewCount deleted createdBy updatedBy deletedBy createdAt updatedAt deletedAt');

        // Count total books matching the query
        const total = await Book.countDocuments(query);

        return { books, total };
    };

    /**
     * Borrow a book by creating a loan record and marking the book as unavailable.
     *
     * @param input - Contains user ID, book ID, and the due date for returning the book.
     * @returns The created loan record.
     * @throws Error if the book is unavailable.
     */
    async borrowBook(bookId: string, userId: string, days: number): Promise<ILoan> {
        // Check if the book is already borrowed
        const existingLoan = await Loan.findOne({ bookId, returned: false });
        if (existingLoan) {
            throw new Error('Book is currently unavailable for borrowing.');
        }

        // Define the due date for book return
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        // Create a new loan record
        const loan = new Loan({
            userId:  new ObjectId(userId),
            bookId: new ObjectId(bookId),
            dueDate,
            returned: false,
        });

        await loan.save();

        // Borrowing a Book
        await Book.findByIdAndUpdate(bookId, { status: BookStatus.CheckedOut })

        return loan;
    }

    /**
     * Return a borrowed book by marking the loan record as returned and updating the book status.
     *
     * @param loanId - The ID of the loan record to be marked as returned.
     * @returns The updated loan record.
     * @throws Error if the loan record is not found or already returned.
     */
    async returnBook(loanId: string): Promise<IBook | null> {
        // Find the loan record
        const loan = await Loan.findById(loanId);
        if (!loan || loan.returned) {
            throw new Error('Loan record not found or already returned');
        }

        const [updateLoan, book] = await Promise.all([
            Loan.findByIdAndUpdate(
                loan._id,
                { returned: true, returnedAt: new Date() },
                { new: true }
            )
            .select('title author genre publicationDate description status averageRating reviewCount deleted createdBy updatedBy deletedBy createdAt updatedAt deletedAt')
            .exec(),
            Book.findByIdAndUpdate(loan.bookId, { status: BookStatus.Available })
        ]);

        return book;
    }
    /**
     * Calculates the overdue penalty for a single loan if the book is overdue.
     *
     * @param loanId - The ID of the loan to check for overdue penalties
     * @param dailyPenaltyRate - The daily penalty rate for overdue books (e.g., $1 per day)
     * @returns The calculated penalty for the loan if overdue, or 0 if not overdue
     */
    async calculatePenaltyForLoan(loanId: string, dailyPenaltyRate: number): Promise<{ daysOverdue: number, penalty: number }> {
        const currentDate = new Date();

        // Fetch the loan details for the specific loan
        const loan = await Loan.findOne({
            _id: new ObjectId(loanId),
            returned: false, // Only consider loans that haven't been returned
        }).select('dueDate');

        if (!loan) {
            throw new Error('Loan not found or already returned');
        }

        // Calculate days overdue
        const daysOverdue = Math.max(
            Math.floor((currentDate.getTime() - loan.dueDate.getTime()) / (1000 * 60 * 60 * 24)),
            0
        );

        // Calculate penalty if the loan is overdue
        const penalty = daysOverdue > 0 ? daysOverdue * dailyPenaltyRate : 0;

        return { daysOverdue, penalty };
    };
}
