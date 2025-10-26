import { Request, Response } from "express";
import { UserService } from "../../services/UserService.ts";
import { errorsLogger, operationsLogger } from "../../services/LoggingService.ts";

// GET /api/users/:id/medias
export const getUserFavorites = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const { id } = req.params;
        const favorites = UserService.getUserFavorites(parseInt(id as string));

        if (favorites.length === 0) {
            errorsLogger.error('No favorites found', {
                correlationId,
                url: req.url,
                errors: "No favorites found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "No favorites found" });
            return;
        }

        operationsLogger.info('User favorites fetched successfully', {
            correlationId,
            url: req.url,
            userId: id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(favorites);
    } catch (error) {
        errorsLogger.error('Error getting user favorites', {
            correlationId,
            url: req.url,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}