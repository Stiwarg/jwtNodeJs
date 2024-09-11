import express from 'express';
import { PORT, SECRET_JWT_KEY } from '../config/config.js';
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
app.use( ( req, res, next ) => {
    const token = req.cookies.access_token;
    req.session = { user: null };

    try {
        const data = jwt.verify( token, SECRET_JWT_KEY );
        req.session.user = data;
    } catch {}

    next();
});

app.get('/', ( req, res  ) => {
    const { user } = req.session;
    res.render('index', user );
});

app.post('/login', async ( req, res ) => {
    const { username, password } = req.body;

    try {
        const user = await UserRepository.login({ username, password });
        const token = jwt.sign({ id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
            expiresIn: '1h'
            });
        
        res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            })
            .send({ user, token });
    } catch (error) {
        res.status(401).send( error.message );
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
                expiresIn: '1h',
            });
            console.log('Token generado:', token);

            //res.status(200).send({ id, token });
        // Establece una cookie en el cliente con el token de acceso.            
        res
            .cookie('access_token', token, {
                // Esto asegura que la cookue solo sea accesible desde el servidor, lo que mejora la seguridad contra ataque XSS
                httpOnly: true,
                //  Solo envie la cookie a través de HTTPS si la aplicación está en producción 
                secure: process.env.NODE_ENV === 'production',
                // Política de SameSite para prevenir ataques CSRF, asegurando que la cookie solo sea enviada si proviene del mismo sitio
                sameSite: 'strict',
                // Define la duración de la cookie ( 1 hora en milisegundos ).
                maxAge: 1000 * 60 * 60 // 1 hora
            })
            .send({ id, token }); // Envía como respuesta al cliente los detalles usuario y el token JWT  */
    } catch (error) { // manejo de errores.
        // Si ocurre un error, devuelve una respuesta con el código 400 y un mensaje descriptivo del error
        console.log('Error en el backend:', error );
        return res.status(400).send({ error: error.message });
    }

});

app.post('/logout', ( req, res ) => {
    res
        .clearCookie('access_token')
        .json({ message: 'Logout successful' });
});

app.get('/protected', ( req, res ) => {

    const { user } = req.session;
    if ( !user ) return res.status(403).send('Access not authorized');
    res.render('protected', user );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`);
});    