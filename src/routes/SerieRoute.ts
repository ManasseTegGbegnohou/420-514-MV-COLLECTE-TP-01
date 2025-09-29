import { Router } from 'express';
import { addSerie, getSerie } from '../controllers/SerieController.ts';

const router = Router();

// POST /api/series ADMIN ONLY
router.post('/', addSerie);

// GET /api/series/:id/episodes
router.get('/:id/episodes', getSerie);

export default router;
