import { Router } from 'express';
import { getAllMedia, getMediaById, addMedia, updateMedia, deleteMedia } from '../controllers/MediaController.ts';

const router = Router();

// GET /api/medias
router.get('/', getAllMedia);

// GET /api/medias/:id
router.get('/:id', getMediaById);

// POST /api/medias
router.post('/', addMedia);

// PUT /api/medias/:id ADMIN ONLY
router.put('/:id', updateMedia);

// DELETE /api/medias/:id ADMIN ONLY
router.delete('/:id', deleteMedia);

export default router;
