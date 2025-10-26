import { Request, Response } from "express";
import { MediaService } from "../../services/mediaService.ts";
import { ValidationService } from "../../services/ValidationService.ts";
import { errorsLogger, operationsLogger } from "../../services/LoggingService.ts";

// POST /series ADMIN ONLY
export const addSerie = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const serieData = req.body;

        // Make sure its a series
        serieData.type = "Serie";

        const validationResult = ValidationService.validateMediaData(serieData);
        if (!validationResult.isValid) {
            errorsLogger.error('Serie validation failed', {
                correlationId,
                url: req.url,
                errors: validationResult.errors,
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ error: "Validation failed",
                details: validationResult.errors 
            });
            return;
        }

        operationsLogger.info('Serie created successfully', {
            correlationId,
            url: req.url,
            serieId: serieData.id,
            title: serieData.title,
            timestamp: new Date().toISOString()
        });

        const newSerie = MediaService.addMedia(serieData);
        res.status(201).json(newSerie);
    } catch (error) {
        errorsLogger.error('Error adding serie', {
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
export const getSerie = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const {id} = req.params;

        if (!Number.isInteger(parseInt(id as string)) || parseInt(id as string) < 0) {
            errorsLogger.error('Serie validation failed', {
                correlationId,
                url: req.url,
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ error: "Invalid id"});
            return;
        }

        const seriesEpisodes = MediaService.getEpisodesBySerieId(parseInt(id as string));
        operationsLogger.info('Serie episodes fetched successfully', {
            correlationId,
            url: req.url,
            serieId: id,
            timestamp: new Date().toISOString()
        });
        res.status(200).json(seriesEpisodes);
    } catch (error) {
        errorsLogger.error('Error fetching episodes', {
            correlationId,
            url: req.url,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}
