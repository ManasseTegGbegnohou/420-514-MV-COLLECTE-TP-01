import { Request, Response } from "express";
import { getLastAction } from "../services/LoggingService.ts";

// GET /api/logs
export const getLastLog = (req: Request, res: Response) => {
    try {
        const lastAction = getLastAction();
        
        if (!lastAction) {
            res.status(404).json({ error: "No logs found" });
            return;
        }

        res.status(200).json(lastAction);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
