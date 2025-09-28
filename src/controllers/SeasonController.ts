import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";
import { errorsLogger, operationsLogger } from "../services/LoggingService.ts";

// POST /seasons
export const addSeason = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { serieId, seasonNumber, releaseDate } = req.body;

        // Validate fields
        if (!serieId || !seasonNumber || !releaseDate) {
            errorsLogger.error('Season validation failed', {
                correlationId,
                url: req.url,
                errors: "serieId, seasonNumber, and releaseDate are required",
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ error: "serieId, seasonNumber, and releaseDate are required" });
            return;
        }

        // Validate season data
        const seasonData = { seasonNumber, releaseDate };
        const validationResult = ValidationService.validateSeasonData(seasonData);
        if (!validationResult.isValid) {
            errorsLogger.error('Season validation failed', {
                correlationId,
                url: req.url,
                errors: validationResult.errors,
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ 
                error: "Validation failed",
                details: validationResult.errors 
            });
            return;
        }

        const newSeason = MediaService.addSeasonToSerie(serieId, seasonData);

        if (!newSeason) {
            errorsLogger.error('Series not found', {
                correlationId,
                url: req.url,
                errors: "Series not found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "Series not found" });
            return;
        }

        operationsLogger.info('Season created successfully', {
            correlationId,
            seasonId: newSeason.id,
            seasonNumber: newSeason.seasonNumber,
            timestamp: new Date().toISOString()
        });

        res.status(201).json(newSeason);
    } catch (error) {
        errorsLogger.error('Error adding season', {
            correlationId,
            url: req.url,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}

// GET /api/series/:id/episodes
export const getEpisodesBySerieId = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { id } = req.params;

        // Check if series exists
        const series = MediaService.getMediaById(parseInt(id as string));
        if (!series || series.type !== 'Serie') {
            errorsLogger.error('Series not found', {
                correlationId,
                url: req.url,
                errors: "Series not found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "Series not found" });
            return;
        }

        operationsLogger.info('Episodes fetched successfully', {
            correlationId,
            serieId: id,
            timestamp: new Date().toISOString()
        });

        const episodes = MediaService.getEpisodesBySerieId(parseInt(id as string));
        res.status(200).json(episodes);
    } catch (error) {
        errorsLogger.error('Error getting episodes by serie id', {
            correlationId,
            url: req.url,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}