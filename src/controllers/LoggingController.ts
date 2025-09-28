import { Request, Response } from "express";
import { errorsLogger, getLastAction, operationsLogger } from "../services/LoggingService.ts";

// GET /api/logs
export const getLastLog = (req: Request, res: Response) => {
    const correlationId = (req as any).correlationId;
    try {
        const lastAction = getLastAction();
        
        if (!lastAction) {
            errorsLogger.error('No logs found', {
                correlationId,
                errors: "No logs found",
                timestamp: new Date().toISOString()
            });
            
            res.status(404).json({ error: "No logs found" });
            return;
        }

        operationsLogger.info('Last log', {
            correlationId,
            lastAction,
            timestamp: new Date().toISOString()
        });

        res.status(200).json(lastAction);
    } catch (error) {
        errorsLogger.error('Error getting last log', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: "Internal server error" });
    }
}
