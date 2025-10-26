import mongoose, { Document, Schema } from 'mongoose';

export interface ISeries extends Document {
    title: string;
    genres: string[];
    status: 'ongoing' | 'ended';
    createdAt: Date;
    updatedAt: Date;
}

const SeriesSchema = new Schema<ISeries>({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    genres: [{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30
    }],
    status: {
        type: String,
        enum: ['ongoing', 'ended'],
        default: 'ongoing'
    }
}, {
    timestamps: true,
    _id: false
});

// Indexes
SeriesSchema.index({ title: 1 });
SeriesSchema.index({ genres: 1 });
SeriesSchema.index({ status: 1 });

export const Series = mongoose.model<ISeries>('Series', SeriesSchema);
