import { Router } from 'express';
import { addSerie, getSerie } from '../../controllers/v1/SerieController.ts';
import { deprecationWarning } from '../../middlewares/deprecation.ts';

const router = Router();

// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// POST /api/series ADMIN ONLY
router.post('/', addSerie);

// GET /api/series/:id/episodes
router.get('/:id/episodes', getSerie);

export default router;
