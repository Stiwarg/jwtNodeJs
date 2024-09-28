// Nuevo: Controlador para la logica del chat ( envio y recepción de mensaje ).
// Gestiona las acciones relacionadas con el chat desde rutas HTTP, como cargar el historial de mensajes o enviar nuevos mensajes
import { ChatRepository } from '../database/chat-repository.js';

// Controlador para obtener el historial del chat
export const getChat = async ( req, res ) => {
    try {
        console.log("Este es el usuario que esta en el chat: ",req.session.user );
        console.log("Estas son las cookies: ", req.cookies );
        if ( !req.session.user ) {
            // Verificación de sesión
            return res.status( 401 ).send('User not authenticated');
        }
        const messages = await ChatRepository.getChatHistory();
        res.render('chat', {
            messages, username: req.session.user.username
        });
    } catch (error) {
        console.error('Error al cargar el chat:', error);
        return res.status( 500 ).send('Error al cargar el chat.');
    }
}

// Controlador para guardar un nuevo mensaje
export const postMessage = async ( req, res ) => {
    const { message } = req.body;
    // Obtener el userId desde la sesión
    const userId = req.session.user._id;
    // Obtener el nombre de usuario desde la sesión
    const username = req.session.user.username;

    try {
        const newMessage = await ChatRepository.saveMessage({ message, userId, username });
        return res.status(200).json( newMessage );
    } catch (error) {
        return res.status( 500 ).send('Error al guardar el mensaje.')
    }
} 