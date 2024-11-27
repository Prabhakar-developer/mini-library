import { ObjectId } from 'mongodb';
import { Review, IReview } from '../models/review.model';
import { Book, IBook } from '../models/book.model';

export class ReviewService {
    /**
     * Add a review to a book.
     * 
     * @param userId - ID of the user adding the review.
     * @param bookId - ID of the book to be reviewed.
     * @param rating - Rating given by the user (1-5).
     * @param comment - Optional comment for the review.
     * @returns The created review document.
     */
    async addReview(userId: string, bookId: string, rating: number, comment?: string): Promise<IReview> {
        // convert the userId and bookId
        const reviewUserId = new ObjectId(userId); 
        const reviewbookId = new ObjectId(bookId)

        const review = await Review.create({ userId: reviewUserId, bookId: reviewbookId, rating, comment });
        
        // Update average rating in the book model
        const reviews = await Review.find({ bookId: reviewbookId });
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await Book.findByIdAndUpdate(bookId, { averageRating, reviewCount: reviews.length });

        return review;
    }

    /**
     * Get reviews for a specific book.
     * 
     * @param bookId - ID of the book to fetch reviews for.
     * @returns Array of reviews with user info populated.
     */
    async getBookReviews(
        bookId: string,
        page: number,
        limit: number
    ): Promise<{
        book: IBook | null,
        reviews: IReview[];
        total: number;
    }> {
        const reviewBookId = new ObjectId(bookId);
        const skip = (page - 1) * limit;
    
        // Fetch book details
        const book = await Book.findOne({ _id: reviewBookId })
            .select('_id title author genre publicationDate description status averageRating reviewCount')
            .exec();

            

        // Return early if book not found
        if (!book) {
            return {
                book: null,
                reviews: [],
                total: 0
            };
        }

        // Aggregate reviews with user details, sorted by creation date (most recent first) with pagination
        const reviews = await Review.aggregate([
            { $match: { bookId: reviewBookId } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users', // The name of the User collection
                    localField: 'userId', // Field in the Review collection
                    foreignField: '_id', // Field in the User collection
                    as: 'user'
                }
            },
            {
                $unwind: {
                  path: "$user",
                  preserveNullAndEmptyArrays: true // Keeps reviews without a valid user populated
                }
            },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    comment: 1,
                    createdAt: 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.firstName': 1,
                    'user.lastName': 1,
                }
            }
        ]);
    
        // Calculate total number of reviews for the book to provide pagination metadata
        const total = await Review.countDocuments({ bookId: reviewBookId });
    
        return {
            book,
            reviews,
            total,
        };
    }
}
