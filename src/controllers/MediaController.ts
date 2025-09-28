import { Request, Response } from "express";
import { MediaService } from "../services/MediaService.ts";
import { ValidationService } from "../services/ValidationService.ts";

// GET /api/medias
export const getAllMedia = (req: Request, res: Response) => {
    try {
        const { type, genre, year, status } = req.query;
        const filters: any = {};

        if (type) filters.type = type as string;
        if (genre) filters.genre = genre as string;
        if (year) filters.year = parseInt(year as string);
        if (status) filters.status = status as string;

        const medias = MediaService.getAllMedia(filters);
        res.status(200).json(medias);
    } catch (error) {
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
    try {
        const mediaData = req.body;
        const validationResult = ValidationService.validateMediaData(mediaData);

        if (!validationResult.isValid) {
            res.status(400).json({ errors: validationResult.errors });
            return;
        }

        const newMedia = MediaService.addMedia(mediaData);
        res.status(201).json(newMedia);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// PUT /api/medias/:id ADMIN ONLY
export const updateMedia = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate each field in updateData
        for (const [fieldName, value] of Object.entries(updateData)) {
            const validationResult = ValidationService.validateField(fieldName, value);
            if (!validationResult.isValid) {
                res.status(400).json({ errors: validationResult.error });
                return;
            }
        }

        const updatedMedia = MediaService.updateMedia(parseInt(id as string), updateData);

        if (!updatedMedia) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        res.status(200).json(updatedMedia);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// DELETE /api/medias/:id ADMIN ONLY
export const deleteMedia = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = MediaService.deleteMedia(parseInt(id as string));

        if (!deleted) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}