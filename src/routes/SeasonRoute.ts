import { Router } from 'express';
import { addSeason } from '../controllers/SeasonController.ts';

const router = Router();

// POST /api/seasons
router.post('/', addSeason);

export default router;
