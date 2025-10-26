import { Router } from 'express';
import { addSeason } from '../../controllers/v1/SeasonController.ts';
import { deprecationWarning } from '../../middlewares/deprecation.ts';

const router = Router();

// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// POST /api/seasons
router.post('/', addSeason);

export default router;
