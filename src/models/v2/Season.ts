import mongoose, { Document, Schema } from 'mongoose';

export interface ISeason extends Document {
    seriesId: string;
    seasonNo: number;
    episodes: number;
    createdAt: Date;
    updatedAt: Date;
}

const SeasonSchema = new Schema<ISeason>({
    _id: {
        type: String,
        required: true
    },
    seriesId: {
        type: String,
        ref: 'Series',
        required: true
    },
    seasonNo: {
        type: Number,
        required: true,
        min: 1
    },
    episodes: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    _id: false
});

// Indexes
SeasonSchema.index({ seriesId: 1 });
SeasonSchema.index({ seasonNo: 1 });

export const Season = mongoose.model<ISeason>('Season', SeasonSchema);
