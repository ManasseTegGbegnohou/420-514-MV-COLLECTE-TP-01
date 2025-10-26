import { Router } from 'express';
import { addFilm } from '../../controllers/v1/FilmController.ts';
import { deprecationWarning } from '../../middlewares/deprecation.ts';

const router = Router();

// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// POST /api/films ADMIN ONLY
router.post('/', addFilm);

export default router;
