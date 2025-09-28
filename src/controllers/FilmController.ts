import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";

// POST /films
export const addFilm = (req: Request, res: Response) => {
    try {
        const filmData = req.body;

        // Add type to ensure it's a film
        filmData.type = "Film";

        const validationResult = ValidationService.validateMediaData(filmData);
        if (!validationResult.isValid) {
            res.status(400).json({ errors: validationResult.errors });
            return;
        }

        const newFilm = MediaService.addMedia(filmData);
        res.status(201).json(newFilm);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
