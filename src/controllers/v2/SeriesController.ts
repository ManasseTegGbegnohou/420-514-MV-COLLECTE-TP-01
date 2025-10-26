import { Request, Response, NextFunction } from 'express';
import { Series } from '../../models/v2/Series.ts';
import { Season } from '../../models/v2/Season.ts';
import { Episode } from '../../models/v2/Episode.ts';
import { operationsLogger, errorsLogger } from '../../services/LoggingService.ts';
import { CustomError } from '../../middlewares/errorHandler.ts';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// GET /api/v2/series
export const getSeries = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { title, genre, status, page = 1, limit = 20 } = req.query;
        
        // Build filter
        const filter: any = {};
        
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        
        if (genre) {
            filter.genres = { $in: Array.isArray(genre) ? genre : [genre] };
        }
        
        if (status) {
            filter.status = status;
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page as string));
        const limitNum = Math.min(200, Math.max(1, parseInt(limit as string)));
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const [series, total] = await Promise.all([
            Series.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Series.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / limitNum);

        operationsLogger.info('Series retrieved successfully', {
            correlationId,
            total,
            page: pageNum,
            limit: limitNum,
            filters: { title, genre, status },
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            items: series,
            total,
            page: pageNum,
            pages,
            limit: limitNum
        });
    } catch (error) {
        errorsLogger.error('Error getting series', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/v2/series (admin only)
export const createSeries = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        // Generate custom ID if not provided
        const seriesData = {
            ...req.body,
            _id: req.body._id || `id${Date.now()}`
        };
        
        const series = new Series(seriesData);
        await series.save();

        operationsLogger.info('Series created successfully', {
            correlationId,
            seriesId: series._id,
            title: series.title,
            timestamp: new Date().toISOString()
        });

        res.status(201).json(series);
    } catch (error) {
        errorsLogger.error('Error creating series', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/series/:seriesId/seasons
export const getSeasons = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { seriesId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        // Check if series exists
        const series = await Series.findById(seriesId);
        if (!series) {
            return next(new CustomError(`Series with ID '${seriesId}' not found`, 404, 'SERIES_NOT_FOUND'));
        }

        // Pagination
        const pageNum = Math.max(1, parseInt(page as string));
        const limitNum = Math.min(200, Math.max(1, parseInt(limit as string)));
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const [seasons, total] = await Promise.all([
            Season.find({ seriesId })
                .sort({ seasonNo: 1 })
                .skip(skip)
                .limit(limitNum),
            Season.countDocuments({ seriesId })
        ]);

        const pages = Math.ceil(total / limitNum);

        operationsLogger.info('Seasons retrieved successfully', {
            correlationId,
            seriesId,
            total,
            page: pageNum,
            limit: limitNum,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            items: seasons,
            total,
            page: pageNum,
            pages,
            limit: limitNum
        });
    } catch (error) {
        errorsLogger.error('Error getting seasons', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/v2/series/:seriesId/seasons (admin only)
export const createSeason = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { seriesId } = req.params;
        const { seasonNo, episodes = 0 } = req.body;

        // Check if series exists
        const series = await Series.findById(seriesId);
        if (!series) {
            return next(new CustomError(`Series with ID '${seriesId}' not found`, 404, 'SERIES_NOT_FOUND'));
        }

        // Check if season already exists
        const existingSeason = await Season.findOne({
            seriesId,
            seasonNo
        });

        if (existingSeason) {
            return next(new CustomError('Season already exists', 409, 'SEASON_EXISTS'));
        }

        const season = new Season({
            _id: `id${Date.now()}`,
            seriesId,
            seasonNo,
            episodes
        });

        await season.save();

        operationsLogger.info('Season created successfully', {
            correlationId,
            seasonId: season._id,
            seriesId,
            seasonNo,
            episodes,
            timestamp: new Date().toISOString()
        });

        res.status(201).json(season);
    } catch (error) {
        errorsLogger.error('Error creating season', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/series/:seriesId/seasons/:seasonId/episodes
export const getEpisodes = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { seriesId, seasonId } = req.params;
        const { minDuration, maxDuration, page = 1, limit = 20 } = req.query;

        // Build filter
        const filter: any = { seriesId, seasonId };
        
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
        const [episodes, total] = await Promise.all([
            Episode.find(filter)
                .sort({ epNo: 1 })
                .skip(skip)
                .limit(limitNum),
            Episode.countDocuments(filter)
        ]);

        const pages = Math.ceil(total / limitNum);

        operationsLogger.info('Episodes retrieved successfully', {
            correlationId,
            seriesId,
            seasonId,
            total,
            page: pageNum,
            limit: limitNum,
            minDuration,
            maxDuration,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            items: episodes,
            total,
            page: pageNum,
            pages,
            limit: limitNum
        });
    } catch (error) {
        errorsLogger.error('Error getting episodes', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/series/:seriesId/seasons/:seasonId/episodes/:episodeId
export const getEpisode = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { seriesId, seasonId, episodeId } = req.params;

        const episode = await Episode.findOne({ 
            _id: episodeId, 
            seriesId, 
            seasonId 
        });
        
        if (!episode) {
            return next(new CustomError(`Episode with ID '${episodeId}' not found`, 404, 'EPISODE_NOT_FOUND'));
        }

        operationsLogger.info('Episode retrieved successfully', {
            correlationId,
            episodeId: episode._id,
            seriesId,
            seasonId,
            epNo: episode.epNo,
            title: episode.title,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(episode);
    } catch (error) {
        errorsLogger.error('Error getting episode', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/v2/series/:seriesId/seasons/:seasonId/episodes (admin only)
export const createEpisode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { seriesId, seasonId } = req.params;
        const { epNo, title, durationMin } = req.body;

        // Check if series exists
        const series = await Series.findById(seriesId);
        if (!series) {
            return next(new CustomError(`Series with ID '${seriesId}' not found`, 404, 'SERIES_NOT_FOUND'));
        }

        // Check if season exists
        const season = await Season.findById(seasonId);
        if (!season) {
            return next(new CustomError(`Season with ID '${seasonId}' not found`, 404, 'SEASON_NOT_FOUND'));
        }

        // Check if episode already exists
        const existingEpisode = await Episode.findOne({
            seriesId,
            seasonId,
            epNo
        });

        if (existingEpisode) {
            return next(new CustomError('Episode already exists', 409, 'EPISODE_EXISTS'));
        }

        const episode = new Episode({
            _id: `id${Date.now()}`,
            seriesId,
            seasonId,
            epNo,
            title,
            durationMin
        });

        await episode.save();

        operationsLogger.info('Episode created successfully', {
            correlationId,
            episodeId: episode._id,
            seriesId,
            seasonId,
            epNo,
            title,
            timestamp: new Date().toISOString()
        });

        res.status(201).json(episode);
    } catch (error) {
        errorsLogger.error('Error creating episode', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};