import { Request, Response, NextFunction } from 'express';
import { Movie } from '../../models/v2/Movie.ts';
import { operationsLogger, errorsLogger } from '../../services/LoggingService.ts';
import { CustomError } from '../../middlewares/errorHandler.ts';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// GET /api/v2/movies
export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { title, genre, minYear, maxYear, minDuration, maxDuration, page = 1, limit = 20 } = req.query;
        
        // Build filter
        const filter: any = {};
        
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        
        if (genre) {
            filter.genres = { $in: Array.isArray(genre) ? genre : [genre] };
        }
        
        if (minYear || maxYear) {
            filter.releaseDate = {};
            if (minYear) filter.releaseDate.$gte = new Date(`${minYear}-01-01`);
            if (maxYear) filter.releaseDate.$lte = new Date(`${maxYear}-12-31`);
        }
        
        if (minDuration || maxDuration) {
            filter.durationMin = {};
            if (minDuration) filter.durationMin.$gte = parseInt(minDuration as string);
            if (maxDuration) filter.durationMin.$lte = parseInt(maxDuration as string);
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page as string));
        const limitNum = Math.min(200, Math.max(1, parseInt(limit as string)));
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const [movies, total] = await Promise.all([
            Movie.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Movie.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / limitNum);

        operationsLogger.info('Movies retrieved successfully', {
            correlationId,
            total,
            page: pageNum,
            limit: limitNum,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            items: movies,
            total,
            page: pageNum,
            pages,
            limit: limitNum
        });
    } catch (error) {
        errorsLogger.error('Error getting movies', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        return next(new CustomError('Failed to retrieve movies', 500, 'MOVIES_RETRIEVAL_ERROR'));
    }
};

// POST /api/v2/movies (admin only)
export const createMovie = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        // Generate custom ID if not provided
        const movieData = {
            ...req.body,
            _id: req.body._id || `id${Date.now()}`
        };
        
        const movie = new Movie(movieData);
        await movie.save();

        operationsLogger.info('Movie created successfully', {
            correlationId,
            movieId: movie._id,
            title: movie.title,
            timestamp: new Date().toISOString()
        });

        res.status(201).json(movie);
    } catch (error) {
        errorsLogger.error('Error creating movie', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        return next(new CustomError('Failed to create movie', 500, 'MOVIE_CREATION_ERROR'));
    }
};

// GET /api/v2/movies/:id
export const getMovie = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const movie = await Movie.findById(req.params.id);
        
        if (!movie) {
            return next(new CustomError(`Movie with ID '${req.params.id}' not found`, 404, 'MOVIE_NOT_FOUND'));
        }

        operationsLogger.info('Movie retrieved successfully', {
            correlationId,
            movieId: movie._id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(movie);
    } catch (error) {
        errorsLogger.error('Error getting movie', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        return next(new CustomError('Movie not found', 404, 'MOVIE_NOT_FOUND'));
    }
};

// PATCH /api/v2/movies/:id (admin only)
export const updateMovie = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!movie) {
            return next(new CustomError(`Movie with ID '${req.params.id}' not found`, 404, 'MOVIE_NOT_FOUND'));
        }

        operationsLogger.info('Movie updated successfully', {
            correlationId,
            movieId: movie._id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(movie);
    } catch (error) {
        errorsLogger.error('Error updating movie', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        return next(new CustomError('Movie not found', 404, 'MOVIE_NOT_FOUND'));
    }
};

// DELETE /api/v2/movies/:id (admin only)
export const deleteMovie = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return next(new CustomError(`Movie with ID '${req.params.id}' not found`, 404, 'MOVIE_NOT_FOUND'));
        }

        operationsLogger.info('Movie deleted successfully', {
            correlationId,
            movieId: movie._id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        errorsLogger.error('Error deleting movie', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        return next(new CustomError('Movie not found', 404, 'MOVIE_NOT_FOUND'));
    }
};
