import { Request, Response } from "express";
import { UserService } from "../services/UserService.ts";

// GET /api/users/:id/medias
export const getUserFavorites = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const favorites = UserService.getUserFavorites(parseInt(id as string));

        if (favorites.length === 0) {
            res.status(404).json({ error: "No favorites found" });
            return;
        }

        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}