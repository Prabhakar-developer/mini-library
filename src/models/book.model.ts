import { Schema, model, Document, Types } from 'mongoose';

type Status = 'Available' | 'Checked Out';

export enum BookStatus {
    Available = 'Available',
    CheckedOut = 'Checked Out',
}

export interface IBook extends Document {
    title: string;
    author: string;
    genre: string;
    publicationDate: Date;
    description: string;
    status: Status;
    averageRating: number;
    reviewCount: number;
    deleted: boolean;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    deletedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

const bookSchema = new Schema<IBook>(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        genre: { type: String, required: true },
        publicationDate: { type: Date, required: true },
        description: { type: String },
        status: { type: String, enum: Object.values(BookStatus), default: BookStatus.Available },
        averageRating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        deleted: { type: Boolean, default: false },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        deletedAt: { type: Date, required: false },
    }, { timestamps: { createdAt: true, updatedAt: true } }
);

// Indexes for optimized search
bookSchema.index({ title: 'text', author: 'text', genre: 'text' }); // Full-text index on title, author, and genre
bookSchema.index({ genre: 1, publicationDate: 1 });                 // Compound index on genre and publicationDate
bookSchema.index({ averageRating: -1 });                            // Index for sorting by rating
bookSchema.index({ createdAt: -1 });                                // Index for recently added

export const Book = model<IBook>('Book', bookSchema);
