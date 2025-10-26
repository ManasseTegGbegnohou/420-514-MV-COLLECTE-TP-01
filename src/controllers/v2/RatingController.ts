import { Request, Response, NextFunction } from 'express';
import { Rating } from '../../models/v2/Rating.ts';
import { Movie } from '../../models/v2/Movie.ts';
import { Episode } from '../../models/v2/Episode.ts';
import { operationsLogger, errorsLogger } from '../../services/LoggingService.ts';
import { CustomError } from '../../middlewares/errorHandler.ts';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// POST /api/v2/ratings
export const createRating = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { target, targetId, score, review } = req.body;
        const userId = req.user!.id;

        // Check if target exists
        let targetExists = false;
        if (target === 'movie') {
            targetExists = !!(await Movie.exists({ _id: targetId }));
        } else if (target === 'episode') {
            targetExists = !!(await Episode.exists({ _id: targetId }));
        }

        if (!targetExists) {
            return next(new CustomError(`Target with ID '${targetId}' not found`, 404, 'TARGET_NOT_FOUND'));
        }

        // Check if user already rated this target
        const existingRating = await Rating.findOne({
            userId,
            target,
            targetId
        });

        if (existingRating) {
            return next(new CustomError('You have already rated this item', 409, 'RATING_EXISTS'));
        }

        // Create rating
        const rating = new Rating({
            _id: `id${Date.now()}`,
            userId,
            target,
            targetId,
            score,
            review
        });

        await rating.save();

        operationsLogger.info('Rating created successfully', {
            correlationId,
            ratingId: rating._id,
            userId,
            target,
            targetId,
            score,
            timestamp: new Date().toISOString()
        });

        res.status(201).json(rating);
    } catch (error) {
        errorsLogger.error('Error creating rating', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/ratings/avg/movie/:movieId
export const getMovieAverageRating = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { movieId } = req.params;

        // Check if movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return next(new CustomError(`Movie with ID '${movieId}' not found`, 404, 'MOVIE_NOT_FOUND'));
        }

        // Calculate average rating
        const result = await Rating.aggregate([
            {
                $match: {
                    target: 'movie',
                    targetId: movie._id
                }
            },
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$score' },
                    totalRatings: { $sum: 1 },
                    scores: { $push: '$score' }
                }
            }
        ]);

        const averageRating = result.length > 0 ? result[0] : {
            averageScore: 0,
            totalRatings: 0,
            scores: []
        };

        operationsLogger.info('Movie average rating calculated', {
            correlationId,
            movieId,
            averageScore: averageRating.averageScore,
            totalRatings: averageRating.totalRatings,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            movieId,
            averageScore: Math.round(averageRating.averageScore * 100) / 100,
            totalRatings: averageRating.totalRatings,
            scores: averageRating.scores
        });
    } catch (error) {
        errorsLogger.error('Error calculating movie average rating', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/ratings/avg/series/:seriesId
export const getSeriesAverageRating = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { seriesId } = req.params;

        // Calculate average rating for all episodes in the series
        const result = await Rating.aggregate([
            {
                $lookup: {
                    from: 'episodes',
                    localField: 'targetId',
                    foreignField: '_id',
                    as: 'episode'
                }
            },
            {
                $unwind: '$episode'
            },
            {
                $match: {
                    target: 'episode',
                    'episode.seriesId': seriesId
                }
            },
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$score' },
                    totalRatings: { $sum: 1 },
                    scores: { $push: '$score' }
                }
            }
        ]);

        const averageRating = result.length > 0 ? result[0] : {
            averageScore: 0,
            totalRatings: 0,
            scores: []
        };

        operationsLogger.info('Series average rating calculated', {
            correlationId,
            seriesId,
            averageScore: averageRating.averageScore,
            totalRatings: averageRating.totalRatings,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            seriesId,
            averageScore: Math.round(averageRating.averageScore * 100) / 100,
            totalRatings: averageRating.totalRatings,
            scores: averageRating.scores
        });
    } catch (error) {
        errorsLogger.error('Error calculating series average rating', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};
