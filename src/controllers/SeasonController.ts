import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";

// POST /seasons
export const addSeason = (req: Request, res: Response) => {
    try {
        const { serieId, seasonNumber, releaseDate } = req.body;

        // Validate fields
        if (!serieId || !seasonNumber || !releaseDate) {
            res.status(400).json({ error: "serieId, seasonNumber, and releaseDate are required" });
            return;
        }

        // Validate season data
        const seasonData = { seasonNumber, releaseDate };
        const validationResult = ValidationService.validateSeasonData(seasonData);
        if (!validationResult.isValid) {
            res.status(400).json({ errors: validationResult.errors });
            return;
        }

        const newSeason = MediaService.addSeasonToSerie(serieId, seasonData);

        if (!newSeason) {
            res.status(404).json({ error: "Series not found" });
            return;
        }

        res.status(201).json(newSeason);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// GET /api/series/:id/episodes
export const getEpisodesBySerieId = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if series exists
        const series = MediaService.getMediaById(parseInt(id as string));
        if (!series || series.type !== 'Serie') {
            res.status(404).json({ error: "Series not found" });
            return;
        }

        const episodes = MediaService.getEpisodesBySerieId(parseInt(id as string));
        res.status(200).json(episodes);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}