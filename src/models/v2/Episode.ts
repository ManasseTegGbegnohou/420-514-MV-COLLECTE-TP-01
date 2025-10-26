import mongoose, { Document, Schema } from 'mongoose';

export interface IEpisode extends Document {
    seriesId: string;
    seasonId: string;
    epNo: number;
    title: string;
    durationMin: number;
    createdAt: Date;
    updatedAt: Date;
}

const EpisodeSchema = new Schema<IEpisode>({
    _id: {
        type: String,
        required: true
    },
    seriesId: {
        type: String,
        ref: 'Series',
        required: true
    },
    seasonId: {
        type: String,
        ref: 'Season',
        required: true
    },
    epNo: {
        type: Number,
        required: true,
        min: 1
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    durationMin: {
        type: Number,
        required: true,
        min: 1,
        max: 300
    }
}, {
    timestamps: true,
    _id: false
});

// Indexes
EpisodeSchema.index({ seriesId: 1 });
EpisodeSchema.index({ seasonId: 1 });
EpisodeSchema.index({ epNo: 1 });

export const Episode = mongoose.model<IEpisode>('Episode', EpisodeSchema);
