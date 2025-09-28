import { Router } from 'express';
import { getUserFavorites } from '../controllers/UserController.ts';

const router = Router();

// GET /api/users/:id/medias
router.get('/:id/medias', getUserFavorites);

export default router;
