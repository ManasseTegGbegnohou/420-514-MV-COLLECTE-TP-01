import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    role: 'user' | 'admin';
    favorites: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    _id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-zA-Z0-9._-]+$/, 'Username can only contain alphanumeric characters, dots, underscores, and hyphens']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favorites: [{
        type: String,
        ref: 'Movie'
    }]
}, {
    timestamps: true,
    _id: false
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
