import express from 'express';
import { protectedRoute, refreshToken} from '../controllers/tokenController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Ruta protegida
router.get('/protected', verifyToken ,protectedRoute );
router.post('/refresh-token', refreshToken);

export default router;