import DBLocal from 'db-local';
import crypto from 'crypto';
import { User, UserRepository } from '../database/user-repository.js'

const { Schema } = new DBLocal({ path: './data' });


const Friends = Schema('FriendChat', {
    _id: { type: String, required: true }, 
    friend_id: { type: String, required: true }, // Llava foranea
    user_id: { type: String, required: true },  // Llave foranea
    status: { type: String, default: 'pending' }, // 'pending', 'accepted', 'rejected
    timestamp: { type: String, required: true } // Usar String si vamos a guardar en formato ISO
    
});

export class friendsRepository {

    // Metodo comun para buscar una relación de amistad
    static async findFriendRelationship ( userId, friendId, status ) {
        return await Friends.findOne({ user_id: userId, friend_id: friendId, status: status})
    }

    // Enviar solicitud de amistad
    static async sendFriendRequest({ userId, friendId }) {
        const existingRequest = await this.findFriendRelationship({ user_id: userId, friend_id: friendId, status: 'pending' });

        if ( existingRequest ) throw new Error('Ya existe una solicitud de amistad');

        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        const newFriendRequest = await Friends.create({
            _id: id,
            userId: userId,
            friendId: friendId,
            status: 'pending',
            timestamp
        }).save();

        console.log(`Solicitud de amistad enviada de ${ userId } a ${ friendId }`);
        return newFriendRequest;
    }   

    // Metodo para actualizar el estado de la relación 
    static async updateFriendRequestStatus ( userId, friendId, newStatus ) {
        const friendRequest = await this.findFriendRelationship({  user_id: friendId, friend_id: userId, status: 'pending' });

        if ( !friendRequest ) throw new Error(`No hay solicitud de amistad pendiente de ${ friendId } hacia ${ userId}.`);

        // Cambiar el estado
        await friendRequest.update({ status: newStatus });
        await friendRequest.save();

        console.log(`Solicitud de amistad de ${ friendId } ${ newStatus === 'accepted' ? 'aceptada' : 'rechazada'} por ${ userId }.`);

        return friendRequest;

    }

    // Aceptar solicitud de amistad
    static async acceptFriendRequest ( userId, friendId ) {
        return this.updateFriendRequestStatus({ user_id: friendId, friend_id: userId, status: 'accepted' });
    }

    // Rechazar solicitud de amistad
    static async rejectFriendRequest ( userId, friendId ) {
        return this.updateFriendRequestStatus({ user_id: friendId, friend_id: userId, status: 'rejected'});
    }

    // Ver amigos aceptados
    static async getFriendsList ( userId ) {
        const friends = await Friends.find({ user_id: userId, status: 'accepted' });
        // Obtener los IDs de amigos aceptados
        const friendsIds = friends.map( f => f.friendId );
        // Usamos Promise.all para buscar solo los campos necesarios ( ID y nombre )
        const friendsList = await Promise.all( friendsIds.map( async friendId => {
            const user = await UserRepository.findOne({ _id: friendId });
            return {
                _id: user._id,
                username: user.username
            }
        }));

        console.log('Lista de amigos: ', friendsList );
        return friendsList;
    }

    // Ver solicitudes de amistad pendientes 
    static async getPendiengRequests ( userId ) {
        const pendingRequests = Friends.find({ friendId: userId, status: 'pending' }).map( f => f.userId);

        // Obtener los IDs de las solicitudes de amistad pendientes
        const requestList = await Promise.all( pendingRequests.map( requestId => User.findOne( requestId )));
        console.log('Solicitudes de amistad pendientes: ', requestList );

        return requestList;
    }

    // Eliminar Amigos
    static async removeFriend ( userId, friendId ) {
        const friendRelationship = await this.findFriendRelationship({
            user_id: userId,
            friend_id : friendId,
            status: 'accepted'
        });

        if ( !friendRelationship ) throw new Error('No existe una amistad aceptada entre estos usuarios.')
        
        // Eliminar la relación de amistad
        await friendRelationship.remove();

        console.log(`Amistad eliminada entre ${ userId } y ${ friendId }.`);

        return friendRelationship;
    }
}
