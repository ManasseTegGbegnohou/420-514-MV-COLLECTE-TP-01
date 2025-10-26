import { Router } from 'express';
import { getMovies, createMovie, getMovie, updateMovie, deleteMovie } from '../../controllers/v2/MovieController.ts';
import { authenticateToken, requireAdmin } from '../../middlewares/auth.ts';
import { validateMovie, handleValidationErrors } from '../../middlewares/validation.ts';

const router = Router();

// GET /api/v2/movies (public)
router.get('/', getMovies);

// POST /api/v2/movies (admin only)
router.post('/', authenticateToken, requireAdmin, validateMovie, handleValidationErrors, createMovie);

// GET /api/v2/movies/:id (public)
router.get('/:id', getMovie);

// PATCH /api/v2/movies/:id (admin only)
router.patch('/:id', authenticateToken, requireAdmin, validateMovie, handleValidationErrors, updateMovie);

// DELETE /api/v2/movies/:id (admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteMovie);

export default router;
