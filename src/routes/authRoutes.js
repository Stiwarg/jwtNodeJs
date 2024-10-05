import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { carouselItems } from '../data/carouselItems.js';
const router =  express.Router();

// Ruta de inicio
router.get('/', verifyToken, ( req, res ) => {
    // Asegúrate de que el usuario esté almacenado 
    const user  = req.session?.user || null;

    if ( user ) {
        // Pasa el nombre de usuario a la vista
        return res.render('index', {
            username: user.username, 
            carouselItems
        });
    }
    // Si no hay usuario autenticado, pasa undefined a la vista
    res.render('index', { 
        username: undefined,
        carouselItems
    });
});

// Ruta de login
router.post('/login', login );

// Ruta de registro
router.post('/register', register );

// Ruta de logout
router.post('/logout', verifyToken ,logout );

export default router