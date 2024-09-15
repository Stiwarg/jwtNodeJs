import express from 'express';
import { PORT, SECRET_JWT_KEY, REFRESH_SECRET_JWT_KEY } from '../config/config.js';
import { UserRepository } from '../database/user-repository.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.set('view engine', 'ejs');
app.use( express.json() );
app.use( cookieParser() );
app.use( cors({ 
    origin: '*', // Permitir todas las solicitudes
    methods: 'GET, POST, PUT, DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
}));
// Middleware para verificar el access token
app.use( ( req, res, next ) => {
    const tokenFromCookie = req.cookies.access_token;
    const tokenFromHeader = req.headers.authorization?.split('')[1];
    const token = tokenFromHeader || tokenFromCookie;
    req.session = { user: null };

    if ( token ) {
        try {
            const data = jwt.verify( token, SECRET_JWT_KEY );
            req.session.user = data;
            console.log('User stored in session:', req.session.user); // Log de depuración
        } catch ( error ) {
            console.error('Token verification failed:', error.message);
        }
    }
   
    next();
});

// Ruta de ejemplo para la página de inicio
app.get('/', ( req, res  ) => {
    const { user } = req.session;
    res.render('index', user );
});

// Ruta para el login
app.post('/login', async ( req, res ) => {
    const { username, password } = req.body;

    try {
        const user = await UserRepository.login({ username, password });
        //Generación del access token
        const accessToken = jwt.sign({ id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
                expiresIn: 1000 * 60 * 15
            });
        
        // Generación del refresh token ( expira en 7 dias )
        const refreshToken = jwt.sign({ id: user._id, username: user.username },
            REFRESH_SECRET_JWT_KEY,
            { 
                expiresIn: '7d'
            }
            );

        await UserRepository.saveRefreshToken( user._id , refreshToken);
        
        // Guarda el access token en una cookie
        return res
            .cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 15
            })
            .cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 DIAS
            })
            .send({ user, accessToken, refreshToken });
    } catch (error) {
        return res.status(401).send( error.message );
    }
});

// Define la ruta POST para el registro de usuarios. 
app.post('/register', async ( req, res ) => {
    // Extrae el nombre del usuario y la contraseña del cuerpo de la solicitud.
    const { username, password } = req.body;
    console.log({ username, password });

    try {
        console.log('Creando usuario...');
        // Crea un nuevo usuario en la base de datos con el nombre de usuario y la contraseña
        const id = await UserRepository.create({ username, password });
        console.log('Usuario creado:', id);
        // Genera un token JWT con el id del usuario y el nombre de usuario,  usando una clave secreta y con una duración de 1 hora.
        const token = jwt.sign({ id: id._id, username: id.username },
            // Clave secreta que se utiliza para firmar el token.
            SECRET_JWT_KEY,
            {
                // El token expirará en 1 hora.
                expiresIn: '15m',
            });

        const refreshToken = jwt.sign({ id: id._id, username: id.username },

            SECRET_JWT_KEY,
            {
                expiresIn: '7d',
            });

            await UserRepository.saveRefreshToken( id._id, refreshToken );

            console.log('Token generado:', token);

            //res.status(200).send({ id, token });
        // Establece una cookie en el cliente con el token de acceso.            
        return res
            .cookie('access_token', token, {
                // Esto asegura que la cookue solo sea accesible desde el servidor, lo que mejora la seguridad contra ataque XSS
                httpOnly: true,
                //  Solo envie la cookie a través de HTTPS si la aplicación está en producción 
                secure: process.env.NODE_ENV === 'production',
                // Política de SameSite para prevenir ataques CSRF, asegurando que la cookie solo sea enviada si proviene del mismo sitio
                sameSite: 'strict',
                // Define la duración de la cookie ( 1 hora en milisegundos ).
                maxAge: 1000 * 60 * 15 // 1 hora
            })
            .cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 7 
            })
            .send({ id, token, refreshToken }); // Envía como respuesta al cliente los detalles usuario y el token JWT  */
    } catch (error) { // manejo de errores.
        // Si ocurre un error, devuelve una respuesta con el código 400 y un mensaje descriptivo del error
        console.log('Error en el backend:', error );
        return res.status(400).send({ error: error.message });
    }

});

app.post('/logout', async ( req, res ) => {

    //const { refresh_token } = req.cookies;
    const { user } = req.session;

    if ( user ) {
        try {
            await UserRepository.removeRefreshToken( user.id );    

        } catch (error) {
            return res.status( 400 ).send({ error: 'Error removing refresh token' });
        }
        
    }

    res
        .clearCookie('access_token')
        .clearCookie('refresh_token')
        .json({ message: 'Logout successful' });
});
//http://localhost:3025/protected
//http://localhost:3025/refresh-token
app.get('/protected', ( req, res ) => {

    const { user } = req.session;
    if ( !user ) return res.status(403).send('Access not authorized');
    res.render('protected', user );
});

app.post('/refresh-token', async( req, res ) => {
    const { refresh_token } = req.cookies;

    if ( !refresh_token ) return res.status(404).send('Refresh token missing');

    try {

        const data = jwt.verify( refresh_token, REFRESH_SECRET_JWT_KEY );

        const user = await UserRepository.findByRefreshToken( data.id, refresh_token);
        
        if ( !user ) {
            res.clearCookie('access_token').clearCookie('refresh_token');
            return res.status(401).send('Unauthorized');
        }
        
        const newAccessToken = jwt.sign({ id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
                expiresIn: '15m' // Expira en 15 minutos
            }
        );

        const newRefreshToken = jwt.sign({ id: user._id, username: user.username },
            REFRESH_SECRET_JWT_KEY,
            {
                expiresIn: '7d'
            }
        );

        user.refreshToken = newRefreshToken;
        await user.save();
        
        return res
            .cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            sameSite: 'strict',
            maxAge: 1000 * 60 * 15 // 15 minutos
        })
            .cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure:process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
                
        })
            .send({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    } catch (error) {
        return res.status(403).send('Token verification failed');
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`);
});    