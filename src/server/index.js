import express from 'express';
import { PORT, SESSION_SECRET } from '../config/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '../routes/authRoutes.js';
import tokenRoutes from '../routes/tokenRoutes.js';
//import session from 'express-session';
import { verifyToken } from '../middleware/authMiddleware.js';

const app = express();
app.set('view engine', 'ejs');
app.use( express.json() );
app.use( cookieParser() );
app.use( cors({ 
    origin: '*', // Permitir todas las solicitudes
    methods: 'GET, POST, PUT, DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
}));

/*app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));*/

app.use('/',authRoutes );
app.use('/', tokenRoutes);
app.use( verifyToken );


app.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`);
});    