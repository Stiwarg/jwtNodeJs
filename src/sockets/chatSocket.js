// Nuevo: Lógica para manejar la conexión de sockets y eventos en tiempo real.
// Esto es del lado del servidor 
// Este archivo maneja la conexión de WebSockets y la lógica de envío/recepción de mensajes en tiempo real
import { ChatRepository } from '../database/chat-repository.js';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';
import cookie from 'cookie';

const chatSocket = ( io ) => {

    io.use(( socket, next ) => {
        // Parsearlas cookies manualmente desde la cabecera
        const cookies = socket.handshake.headers.cookie ? cookie.parse( socket.handshake.headers.cookie ) : {};
        const token = cookies['access_token'];
        console.log("Este es el token de chatSocket.js: ", token);

        if ( !token ) {
            return next( new Error('Authentication error: No token provided') );
        }

        // Verificar el token con jsonwebtoken
        jwt.verify( token, SECRET_JWT_KEY, ( err, decoded ) => {
            if ( err ) {
                return next( new Error('Authentication error: Invalid token') );
            }
        
            // Si el token es válido, almacenar la información del usuario en la sesión del socket
            socket.handshake.session = {
                user: {
                    _id: decoded.id,
                    username: decoded.username
                }
            }

        });

        
        // Continuar con la conexion
        next();
    });

    io.on('connection', async ( socket ) => {
        console.log('A user connected:', socket.id);

        // Escuchar el evento 'chat message' del cliente
        socket.on('chat message', async ( msg ) => {
            // Accede al userId desde la sesión del socket
            const userId = socket.handshake.session?.user?._id;
            const username = socket.handshake.session?.user?.username;

            if ( !userId || !username ) {
                console.error('User not authenticated.');
                return;
            }

            if ( !msg.message || msg.message.trim() === '' ) {
                console.error('Empty message not allowed');
                return;
            }

            try {
                console.log("Bandera 27");
                // Guardar el mensaje en la "base de datos"
                const timestamp = new Date();
                console.log("Nuevo mensaje a guardar:", { message: msg.message ,userId, username, timestamp });
                const newMessage = await ChatRepository.saveMessage({ message: msg.message, userId, username });
                console.log("Bandera 28");
                // Obtener la diferencia horaria del servidor ( serverOffset )
                const serverOffset = Date.now() - socket.handshake.time;
                console.log("serverOffset: ", serverOffset );

                // Reenviar el mensaje a todos los usuarios conectados, incluyendo el serverOffset
                io.emit('chat message', { 
                        message: newMessage.message, 
                        timestamp: newMessage.timestamp, 
                        username: newMessage.username,
                        serverOffset 
                    } 
                );
            } catch (error) {
                console.error('Error al guardar el mensaje:', error);
            }
        }); 

        // Manejar la desconixión
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        })
    });

}

// Exportar la función correctamente
export default chatSocket;