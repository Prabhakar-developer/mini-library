import { Loan } from '../models/loan.model';

export class AnalyticsService {
    /**
     * Retrieves the list of most borrowed books with pagination.
     * @param page - The page number for pagination
     * @param limit - The number of items per page
     * @returns Promise with paginated list of most borrowed books and their borrow count.
     */
    async getMostBorrowedBooks(page: number, limit: number) {
        const skip = (page - 1) * limit;

        // Fetch the total count of most borrowed books
        const total = await Loan.aggregate([
            { $group: { _id: '$bookId', borrowCount: { $sum: 1 } } }
        ]);

        // Fetch the paginated most borrowed books
        const wishlist = await Loan.aggregate([
            { $group: { _id: '$bookId', borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            { $unwind: '$book' },
            {
                $project: {
                    bookId: '$_id',
                    title: '$book.title',
                    author: '$book.author',
                    borrowCount: 1,
                },
            },
        ]);
        return { wishlist, total: total.length }
    }

    /**
     * Retrieves the list of most active users based on borrowing frequency with pagination.
     * @param page - The page number for pagination
     * @param limit - The number of items per page
     * @returns Promise with paginated list of most active users and their borrow count.
     */
    async getActiveUsers(page: number, limit: number) {
        const skip = (page - 1) * limit;

        // Fetch the total count of most active users
        const total = await Loan.aggregate([
            { $group: { _id: '$userId', borrowCount: { $sum: 1 } } }
        ]);

        // Fetch the paginated active users
        const users = await Loan.aggregate([
            { $group: { _id: '$userId', borrowCount: { $sum: 1 } } },
            { $sort: { borrowCount: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    userId: '$_id',
                    username: '$user.username',
                    firstName: '$user.firstName',
                    lastName: '$user.lastName',
                    borrowCount: 1,
                },
            },
        ]);

        return { users, total: total.length };
    }

    /**
     * Retrieves genre popularity statistics based on book borrow count with pagination.
     * @param page - The page number for pagination
     * @param limit - The number of items per page
     * @returns Promise with paginated genre popularity data.
     */
    async getGenrePopularity(page: number, limit: number) {
        const skip = (page - 1) * limit;

         // Fetch the total count of genre popularity
         const total = await Loan.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            { $unwind: '$book' },
            {
                $group: {
                    _id: '$book.genre',
                    borrowCount: { $sum: 1 },
                },
            }
        ]);

        // Fetch the paginated genre popularity data
        const genre = await Loan.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            { $unwind: '$book' },
            {
                $group: {
                    _id: '$book.genre',
                    borrowCount: { $sum: 1 },
                },
            },
            { $sort: { borrowCount: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    genre: '$_id',
                    borrowCount: 1,
                    _id: 0  
                },
            },
        ]);

        return { genre, total: total.length };
    }
}
