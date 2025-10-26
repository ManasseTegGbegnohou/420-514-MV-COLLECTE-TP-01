import { Router } from 'express';
import { addEpisode, updateEpisodeWatchedStatus } from '../../controllers/v1/EpisodeController.ts';
import { deprecationWarning } from '../../middlewares/deprecation.ts';

const router = Router();

// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// POST /api/episodes
router.post('/', addEpisode);

// PATCH /api/episodes/:id
router.patch('/:id', updateEpisodeWatchedStatus);

export default router;
