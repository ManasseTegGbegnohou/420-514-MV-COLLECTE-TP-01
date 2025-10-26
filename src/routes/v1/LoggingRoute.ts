import { Router } from 'express';
import { getLastLog } from '../../controllers/v1/LoggingController.ts';
import { deprecationWarning } from '../../middlewares/deprecation.ts';

const router = Router();

// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// GET /api/logs
router.get('/', getLastLog);

export default router;
