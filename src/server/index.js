import express from 'express';
import { PORT } from '../config/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from '../routes/authRoutes.js';
import tokenRoutes from '../routes/tokenRoutes.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import chatSocket from '../sockets/chatSocket.js';
import chatRoutes from '../routes/chatRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
// Crear el servidor HTTP
const server = createServer( app );
// Crear servidor de Socket.IO
const io = new Server( server );

// Obtener __dirname en un entorno de ES Modules
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

console.log('Este es el dirname: ',__dirname );

// Configuración de middlewares y vistas
app.set('view engine', 'ejs');
app.use( express.json() );
app.use( cookieParser() );
app.use( cors({ 
    origin: '*', // Permitir todas las solicitudes
    methods: 'GET, POST, PUT, DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
    credentials: true
}));

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname,'../public')));

// Configurar las rutas de autenticación y chat
app.use('/',authRoutes );
app.use('/', tokenRoutes);
app.use( verifyToken );
app.use('/', chatRoutes)

// Inicializar la lógica de sockets para el chat
chatSocket( io );

server.listen(PORT, () => {
    console.log(`Server running on port ${ PORT }`);
});    