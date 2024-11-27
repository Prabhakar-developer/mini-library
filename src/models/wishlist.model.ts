import { Schema, model, Document, Types } from 'mongoose';

type Status = 'Active' | 'Deleted';

export enum WishlistStatus {
    ACTIVE = 'Active',
    DELETED= 'Deleted',
}

export interface IWishlist extends Document {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
    createdAt: Date;
    status: Status;
}

const wishlistSchema = new Schema<IWishlist>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: Object.values(WishlistStatus), default: WishlistStatus.ACTIVE },
});

wishlistSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);
