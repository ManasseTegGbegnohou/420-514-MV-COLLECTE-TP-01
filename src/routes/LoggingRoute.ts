import { Router } from 'express';
import { getLastLog } from '../controllers/LoggingController.ts';

const router = Router();

// GET /api/logs
router.get('/', getLastLog);

export default router;
