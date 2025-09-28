import { Router } from 'express';
import { addSerie } from '../controllers/SerieController.ts';

const router = Router();

// POST /api/series ADMIN ONLY
router.post('/', addSerie);

export default router;
