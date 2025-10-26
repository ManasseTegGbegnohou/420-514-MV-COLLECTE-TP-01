import { Router } from 'express';
import { getSeries, createSeries, createSeason, createEpisode, getEpisodes, getSeasons, getEpisode } from '../../controllers/v2/SeriesController.ts';
import { authenticateToken, requireAdmin } from '../../middlewares/auth.ts';
import { validateSeries, validateSeason, validateEpisode, handleValidationErrors } from '../../middlewares/validation.ts';

const router = Router();

// GET /api/v2/series (public)
router.get('/', getSeries);

// POST /api/v2/series (admin only)
router.post('/', authenticateToken, requireAdmin, validateSeries, handleValidationErrors, createSeries);

// POST /api/v2/series/:seriesId/seasons (admin only)
router.post('/:seriesId/seasons', authenticateToken, requireAdmin, validateSeason, handleValidationErrors, createSeason);

// POST /api/v2/series/:seriesId/seasons/:seasonId/episodes (admin only)
router.post('/:seriesId/seasons/:seasonId/episodes', authenticateToken, requireAdmin, validateEpisode, handleValidationErrors, createEpisode);

// GET /api/v2/series/:seriesId/seasons/:seasonId/episodes (public)
router.get('/:seriesId/seasons/:seasonId/episodes', getEpisodes);

// GET /api/v2/series/:seriesId/seasons (public)
router.get('/:seriesId/seasons', getSeasons);

// GET /api/v2/series/:seriesId/seasons/:seasonId/episodes/:episodeId (public)
router.get('/:seriesId/seasons/:seasonId/episodes/:episodeId', getEpisode);

export default router;
