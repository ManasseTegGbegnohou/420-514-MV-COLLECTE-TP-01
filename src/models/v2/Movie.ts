import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
    title: string;
    genres: string[];
    synopsis?: string;
    releaseDate?: Date;
    durationMin: number;
    createdAt: Date;
    updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>({
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
    synopsis: {
        type: String,
        maxlength: 2000
    },
    releaseDate: {
        type: Date
    },
    durationMin: {
        type: Number,
        required: true,
        min: 1,
        max: 600
    }
}, {
    timestamps: true,
    _id: false
});

// Indexes
MovieSchema.index({ title: 1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ releaseDate: 1 });

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
