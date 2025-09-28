import { Router } from 'express';
import { addEpisode, updateEpisodeWatchedStatus } from '../controllers/EpisodeController.ts';

const router = Router();

// POST /api/episodes
router.post('/', addEpisode);

// PATCH /api/episodes/:id
router.patch('/:id', updateEpisodeWatchedStatus);

export default router;
