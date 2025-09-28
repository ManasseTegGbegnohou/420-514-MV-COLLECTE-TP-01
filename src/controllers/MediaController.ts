import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";
import { operationsLogger, errorsLogger } from "../services/LoggingService.ts";

// GET /api/medias
export const getAllMedia = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { type, genre, year, status } = req.query;
        const filters: any = {};

        if (type) filters.type = type as string;
        if (genre) filters.genre = genre as string;
        if (year) filters.year = parseInt(year as string);
        if (status) filters.status = status as string;

        // Log the operation
        operationsLogger.info('Getting all media', {
            correlationId,
            filters,
            timestamp: new Date().toISOString()
        });

        const medias = MediaService.getAllMedia(filters);
        res.status(200).json(medias);
    } catch (error) {
        // Log the error
        errorsLogger.error('Error getting all media', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}

// GET /api/medias/:id
export const getMediaById = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const media = MediaService.getMediaById(parseInt(id as string));

        if (!media) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// POST /api/medias
export const addMedia = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const mediaData = req.body;
        
        // Check request body
        if (!mediaData) {
            errorsLogger.error('Media request body is missing', {
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
        
        // Log the operation
        operationsLogger.info('Adding new media', {
            correlationId,
            mediaType: mediaData.type,
            title: mediaData.title,
            timestamp: new Date().toISOString()
        });
        
        const validationResult = ValidationService.validateMediaData(mediaData);

        if (!validationResult.isValid) {
            // Log validation failure
            errorsLogger.error('Media validation failed', {
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

        const newMedia = MediaService.addMedia(mediaData);
        
        // Log successful creation
        operationsLogger.info('Media created successfully', {
            correlationId,
            mediaId: newMedia.id,
            title: newMedia.title,
            timestamp: new Date().toISOString()
        });
        
        res.status(201).json(newMedia);
    } catch (error) {
        // Log the error
        errorsLogger.error('Error adding media', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}

// PUT /api/medias/:id ADMIN ONLY
export const updateMedia = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate each field in updateData
        for (const [fieldName, value] of Object.entries(updateData)) {
            const validationResult = ValidationService.validateField(fieldName, value);
            if (!validationResult.isValid) {
                // Log validation failure
                errorsLogger.error('Media validation failed', {
                    correlationId,
                    errors: validationResult.error,
                    timestamp: new Date().toISOString()
                });
                
                res.status(400).json({ errors: validationResult.error });
                return;
            }
        }

        const updatedMedia = MediaService.updateMedia(parseInt(id as string), updateData);

        if (!updatedMedia) {
            errorsLogger.error('Media not found', {
                correlationId,
                errors: "Media not found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "Media not found" });
            return;
        }

        // Log successful update
        operationsLogger.info('Media updated successfully', {
            correlationId,
            mediaId: updatedMedia.id,
            title: updatedMedia.title,
            timestamp: new Date().toISOString()
        });
        
        res.status(200).json(updatedMedia);
    } catch (error) {
        errorsLogger.error('Error updating media', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}

// DELETE /api/medias/:id ADMIN ONLY
export const deleteMedia = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { id } = req.params;
        const deleted = MediaService.deleteMedia(parseInt(id as string));

        if (!deleted) {
            errorsLogger.error('Media not found', {
                correlationId,
                errors: "Media not found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "Media not found" });
            return;
        }

        // Log successful delete
        operationsLogger.info('Media deleted successfully', {
            correlationId,
            mediaId: id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
        errorsLogger.error('Error deleting media', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}