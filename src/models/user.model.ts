import { Schema, model, Document } from 'mongoose';

export type roles = 'Admin' | 'User';

enum Roles {
    Admin = 'Admin',
    User = 'User'
}

export interface IUser extends Document {
    username?: string | null; // optional 
    firstName?: string | null; // optional
    lastName?: string | null; // optional
    email: string;
    password: string;
    role: roles;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: false, unique: true, default: null },
    firstName: { type: String, required: false, default: null },
    lastName: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), required: true },
});

export const User = model<IUser>('User', userSchema);
