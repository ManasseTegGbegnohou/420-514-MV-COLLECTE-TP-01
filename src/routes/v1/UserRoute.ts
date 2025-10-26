import { Router } from 'express';
import { getUserFavorites } from '../../controllers/v1/UserController.ts';
import { deprecationWarning } from '../../middlewares/deprecation.ts';

const router = Router();

// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// GET /api/users/:id/medias
router.get('/:id/medias', getUserFavorites);

export default router;
