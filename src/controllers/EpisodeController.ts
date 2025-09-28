import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";
import { errorsLogger, operationsLogger } from "../services/LoggingService.ts";

// POST /episodes ADMIN ONLY
export const addEpisode = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { serieId, seasonNumber, title, episodeNumber, duration } = req.body;

        // Validate required fields
        if (!serieId || !seasonNumber || !title || !episodeNumber || !duration) {
            errorsLogger.error('Episode validation failed', {
                correlationId,
                errors: "serieId, seasonNumber, title, episodeNumber, and duration are required",
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ error: "serieId, seasonNumber, title, episodeNumber, and duration are required" });
            return;
        }

        // Validate episode data
        const episodeData = { title, episodeNumber, duration };
        const validationResult = ValidationService.validateEpisodeData(episodeData);
        if (!validationResult.isValid) {
            errorsLogger.error('Episode validation failed', {
                correlationId,
                errors: validationResult.errors,
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ errors: validationResult.errors });
            return;
        }

        const newEpisode = MediaService.addEpisodeToSeason(serieId, seasonNumber, episodeData);

        if (!newEpisode) {
            errorsLogger.error('Series or season not found', {
                correlationId,
                errors: "Series or season not found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "Series or season not found" });
            return;
        }

        operationsLogger.info('Episode created successfully', {
            correlationId,
            episodeId: newEpisode.id,
            title: newEpisode.title,
            timestamp: new Date().toISOString()
        });
        
        res.status(201).json(newEpisode);
    } catch (error) {
        errorsLogger.error('Error adding episode', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}

// PATCH /episodes/:id
export const updateEpisodeWatchedStatus = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { id } = req.params;
        const { watched } = req.body;

        if (typeof watched !== 'boolean') { 
            errorsLogger.error('Episode validation failed', {
                correlationId,
                errors: "watched field must be a boolean",
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ error: "watched field must be a boolean" });
            return;
        }

        const updatedEpisode = MediaService.updateEpisodeWatchedStatus(parseInt(id as string), watched);

        if (!updatedEpisode) {  
            errorsLogger.error('Episode not found', {
                correlationId,
                errors: "Episode not found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "Episode not found" });
            return;
        }

        operationsLogger.info('Episode watched status updated successfully', {
            correlationId,
            episodeId: updatedEpisode.id,
            title: updatedEpisode.title,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(updatedEpisode);
    } catch (error) {   
        errorsLogger.error('Error updating episode watched status', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}
