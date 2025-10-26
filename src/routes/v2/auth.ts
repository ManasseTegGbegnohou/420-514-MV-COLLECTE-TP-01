import { Router } from 'express';
import { register, login, getMe, updateMe, getUserById } from '../../controllers/v2/AuthController.ts';
import { authenticateToken, requireAdmin } from '../../middlewares/auth.ts';
import { validateUserRegistration, validateUserLogin, handleValidationErrors } from '../../middlewares/validation.ts';

const router = Router();

// POST /api/v2/auth/register
router.post('/register', validateUserRegistration, handleValidationErrors, register);

// POST /api/v2/auth/login
router.post('/login', validateUserLogin, handleValidationErrors, login);

// GET /api/v2/users/me (JWT required)
router.get('/users/me', authenticateToken, getMe);

// PATCH /api/v2/users/me (JWT required)
router.patch('/users/me', authenticateToken, updateMe);

// GET /api/v2/users/:id (admin only)
router.get('/users/:id', authenticateToken, requireAdmin, getUserById);

export default router;
