import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
    userId: string;
    target: 'movie' | 'episode';
    targetId: string;
    score: number;
    review?: string;
    createdAt: Date;
    updatedAt: Date;
}

const RatingSchema = new Schema<IRating>({
    _id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    target: {
        type: String,
        enum: ['movie', 'episode'],
        required: true
    },
    targetId: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    review: {
        type: String,
        maxlength: 2000
    }
}, {
    timestamps: true,
    _id: false
});

// Indexes
RatingSchema.index({ userId: 1 });
RatingSchema.index({ targetId: 1 });
RatingSchema.index({ target: 1 });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
