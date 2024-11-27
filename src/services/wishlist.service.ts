import { IWishlist, Wishlist } from '../models/wishlist.model';
import { ObjectId } from 'mongodb';

export class WishlistService {
    /**
     * Adds a book to a user's wishlist.
     *
     * @param userId - The ID of the user who is adding a book to the wishlist.
     * @param bookId - The ID of the book to be added to the user's wishlist.
     * @returns A Promise resolving to the saved wishlist item with only selected fields, or null if save failed.
     */
    async addWishlist(userId: string, bookId: string): Promise<IWishlist | null> {
        const wishlistItem = new Wishlist({
            userId: new ObjectId(userId),
            bookId: new ObjectId(bookId),
        });
        
        // Save the wishlist item to the database and retrieve only specific fields.
        const savedWishlistItem = await wishlistItem.save();
        return Wishlist.findById(savedWishlistItem._id)
            .select('_id userId bookId status')
            .exec();
    }

    /**
     * Retrieves a paginated list of wishlist items for a specified user.
     *
     * @param userId - The ID of the user whose wishlist is to be retrieved.
     * @param page - The page number for pagination.
     * @param limit - The maximum number of items per page.
     * @returns A Promise resolving to an object containing the user's wishlist items and the total count.
     */
    async fetchWishlist(userId: string, page: number, limit: number): Promise<{ wishlist: IWishlist[], total: number }> {
        const skip = (page - 1) * limit;

        // Fetch wishlist items with pagination and get the total count of active wishlist items for the user.
        const [wishlist, total] = await Promise.all([
            Wishlist.find({ userId: new ObjectId(userId), status: 'Active' })
                .skip(skip)
                .limit(limit)
                .populate('bookId', 'title author genre')
                .select('_id userId bookId status')
                .exec(),
            Wishlist.countDocuments({ userId: new ObjectId(userId), status: 'Active' })
        ]);

        return { wishlist, total };
    }

    /**
     * Soft deletes a book from the user's wishlist by setting its status to 'Deleted'.
     *
     * @param id - The ID of the wishlist item to be soft-deleted.
     * @returns A Promise resolving to the updated wishlist object with the `status` set to 'Deleted', or null if the wishlist item was not found.
     */
    async softDeleteWishlistItem(id: string): Promise<IWishlist | null> {
        return Wishlist.findByIdAndUpdate(id, { status: 'Deleted' }, { new: true })
            .select('_id userId bookId status')
            .exec();
    }
}
