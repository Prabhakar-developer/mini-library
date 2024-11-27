import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

// Indexes
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true }); // Ensures a user can only review a book once
reviewSchema.index({ rating: -1 }); // Index for sorting by rating (descending)
reviewSchema.index({ createdAt: -1 }); // Index for sorting by recent reviews

export const Review = model<IReview>('Review', reviewSchema);
