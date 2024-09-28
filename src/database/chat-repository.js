// Nuevo: Meodos para gestionar mensajes y chats ( guardar mensajes, cargar historiales ).
import DBLocal from 'db-local';
import crypto from 'crypto';
const { Schema } = new DBLocal({ path: './data'});

// Definir el esquema para los mensajes del chat 
const ChatMessage = Schema('ChatMessage', {
    _id: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: String, required: true }, // Llave foránea al User
    username: { type: String, required: true }, // Guardamos el nombre de usuario tambien para visualización
    timestamp: { type: String, required: true} // Usar String si vamos a guardar en formato ISO
});

export class ChatRepository {

    // Función para guardar un nuevo mensaje
    static async saveMessage({ message, userId, username }) {
        const id = crypto.randomUUID();  
        // Convertir a formato ISO      
        const timestamp = new Date().toISOString();
        console.log("Mensaje a guardar:", { message, userId, username, timestamp });

        const newMessage = await ChatMessage.create({
            _id: id, 
            message,
            userId,
            username,
            timestamp
        }).save();

        console.log("Mensaje guardado:", newMessage); // Verifica que el mensaje se guarde correctamente
        return newMessage;
    }

    // Función para obtener el historial de mensajes
    static async getChatHistory() {
        const messages = await ChatMessage.find({});
        return messages;
    }

    // Función para obtener los mensajes de un usuario especifico
    static async getMessagesByUser( userId ) {
        const messages = await ChatMessage.find({ userId });
        return messages;
    }
}