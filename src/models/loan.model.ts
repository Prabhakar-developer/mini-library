import { Schema, model, Document } from 'mongoose';

export interface ILoan extends Document {
    userId: Schema.Types.ObjectId;
    bookId: Schema.Types.ObjectId;
    dueDate: Date;
    returned: boolean;
    borrowedAt: Date;
    returnedAt?: Date;
}

const loanSchema = new Schema<ILoan>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    dueDate: { type: Date, required: true },
    returned: { type: Boolean, default: false },
    borrowedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date, default: null },
});

// Index to quickly search by user and book, useful for analytics and reports
loanSchema.index({ userId: 1, bookId: 1 });

export const Loan = model<ILoan>('Loan', loanSchema);
