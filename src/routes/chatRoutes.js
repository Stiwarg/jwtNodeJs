// Nuevo: Rutas para manejar las interacciones del chat en tiempo real.
// Este archivo define las rutas del chat, permitiendo cargar la vista del chat o enviar un mensaje.
import express from 'express';
import { getChat, postMessage } from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para obtener la página del chat ( requiere estar autenticado )
router.get('/chat', verifyToken, getChat );

// Ruta para enviar un mensaje ( opcional si se utiliza una API )
router.post('/chat', verifyToken, postMessage );

export default router;