import { Request, Response } from "express";
import { MediaService } from "../../services/mediaService.ts";
import { ValidationService } from "../../services/ValidationService.ts";
import { errorsLogger, operationsLogger } from "../../services/LoggingService.ts";

// POST /films
export const addFilm = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const filmData = req.body;

        // Check request body 
        if (!filmData) {
            errorsLogger.error('Film request body is missing', {
                correlationId,
                errors: "Request body is required",
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ 
                error: "Request body is required",
                details: ["Request body cannot be empty"]
            });
            return;
        }

        filmData.type = "Film";

        const validationResult = ValidationService.validateMediaData(filmData);
        if (!validationResult.isValid) {
            errorsLogger.error('Film validation failed', {
                correlationId,
                errors: validationResult.errors,
                timestamp: new Date().toISOString()
            });
            
            res.status(400).json({ 
                error: "Validation failed",
                details: validationResult.errors 
            });
            return;
        }

        const newFilm = MediaService.addMedia(filmData);
        operationsLogger.info('Film created successfully', {
            correlationId,
            filmId: newFilm.id,
            title: newFilm.title,
            timestamp: new Date().toISOString()
        });
        
        res.status(201).json(newFilm);
    } catch (error) {
        errorsLogger.error('Error adding film', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}
