import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";

// POST /series ADMIN ONLY
export const addSerie = (req: Request, res: Response) => {
    try {
        const serieData = req.body;

        // Make sure it's a series
        serieData.type = "Serie";

        const validationResult = ValidationService.validateMediaData(serieData);
        if (!validationResult.isValid) {
            res.status(400).json({ errors: validationResult.errors });
            return;
        }

        const newSerie = MediaService.addMedia(serieData);
        res.status(201).json(newSerie);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
