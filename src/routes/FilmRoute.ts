import { Router } from 'express';
import { addFilm } from '../controllers/FilmController.ts';

const router = Router();

// POST /api/films ADMIN ONLY
router.post('/', addFilm);

export default router;
