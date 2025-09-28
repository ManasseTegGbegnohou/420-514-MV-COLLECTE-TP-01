import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";

// POST /episodes ADMIN ONLY
export const addEpisode = (req: Request, res: Response) => {
    try {
        const { serieId, seasonNumber, title, episodeNumber, duration } = req.body;

        // Validate required fields
        if (!serieId || !seasonNumber || !title || !episodeNumber || !duration) {
            res.status(400).json({ error: "serieId, seasonNumber, title, episodeNumber, and duration are required" });
            return;
        }

        // Validate episode data
        const episodeData = { title, episodeNumber, duration };
        const validationResult = ValidationService.validateEpisodeData(episodeData);
        if (!validationResult.isValid) {
            res.status(400).json({ errors: validationResult.errors });
            return;
        }

        const newEpisode = MediaService.addEpisodeToSeason(serieId, seasonNumber, episodeData);

        if (!newEpisode) {
            res.status(404).json({ error: "Series or season not found" });
            return;
        }

        res.status(201).json(newEpisode);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// PATCH /episodes/:id
export const updateEpisodeWatchedStatus = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { watched } = req.body;

        if (typeof watched !== 'boolean') {
            res.status(400).json({ error: "watched field must be a boolean" });
            return;
        }

        const updatedEpisode = MediaService.updateEpisodeWatchedStatus(parseInt(id as string), watched);

        if (!updatedEpisode) {
            res.status(404).json({ error: "Episode not found" });
            return;
        }

        res.status(200).json(updatedEpisode);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
