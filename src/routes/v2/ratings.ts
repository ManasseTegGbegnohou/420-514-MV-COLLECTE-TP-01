import { Router } from 'express';
import { createRating, getMovieAverageRating, getSeriesAverageRating } from '../../controllers/v2/RatingController.ts';
import { authenticateToken, requireUser } from '../../middlewares/auth.ts';
import { validateRating, handleValidationErrors } from '../../middlewares/validation.ts';

const router = Router();

// POST /api/v2/ratings (JWT required)
router.post('/', authenticateToken, requireUser, validateRating, handleValidationErrors, createRating);

// GET /api/v2/ratings/avg/movie/:movieId (public)
router.get('/avg/movie/:movieId', getMovieAverageRating);

// GET /api/v2/ratings/avg/series/:seriesId (public)
router.get('/avg/series/:seriesId', getSeriesAverageRating);

export default router;
