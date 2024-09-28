import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';

// Middleware para verificar el access token
export const verifyToken  = ( req, res, next ) => {
    const tokenFromCookie = req.cookies.access_token;
    const tokenFromHeader = req.headers.authorization?.split('')[1];
    const token = tokenFromHeader || tokenFromCookie;
    req.session = { user: null };

    if ( token ) {
        try {
            const data = jwt.verify( token, SECRET_JWT_KEY );
            req.session.user = data;
            //console.log('User stored in session:', req.session.user); // Log de depuración
        } catch (error) {
            console.error('Token verification failed:', error.message );
            // Respuesta en cso de error
            return res.status( 403 ).send('Access not authorized');
        }
    }

    next();
}