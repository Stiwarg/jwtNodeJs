import DBLocal from 'db-local';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config/config.js';

const { Schema } = new DBLocal({ path: './data' });

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false, default: '' } // Campo opcional para el refresh token
});

export class UserRepository {
    static async create ({ username, password }) {

        Validation.username( username );
        Validation.password( password );


        const user = await User.findOne({ username });
        console.log("hola :",user );
        
        if ( user ) throw new Error('Username already exists');
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash( password, SALT_ROUNDS)

        console.log('Guardando usuario en la base de datos...');
        // Crea el nuevo usuario y lo guarda
        const newUser = await  User.create({
            _id: id,
            username,
            password: hashedPassword 
        }).save(); 

        console.log('Usuario guardado:', newUser);
        // Excule la contraseña y devuelve el usuario sin ella
        const { password: _, ...publicUser } = newUser;
        // Devuelve el objeto del usuario sin la contraseña
        return publicUser;
    }

    static async  login ({ username, password }) {

        Validation.username( username );
        Validation.password( password );

        const user = User.findOne({ username });
        if ( !user ) throw new Error('Username does not exist');

        const isValid = await bcrypt.compare( password, user.password );
        if ( !isValid ) throw new Error('Password is invalid');
        
        const { password: _, ...publicUser } = user;

        return publicUser;
    
    }

    static async saveRefreshToken( userId , refreshToken ) {
        const user = await User.findOne({ _id: userId });
        if ( !user ) throw new Error('User not found');
        user.refreshToken = refreshToken;
        await user.save();
    }

    static async removeRefreshToken( userId ) {
        console.log('User ID for removal:', userId); // Añade este log para depuración
        const user = await User.findOne({ _id: userId });
        if ( !user ) throw new Error('User not found');
        console.log("se encontro el usuario");
        user.refreshToken = '';
        console.log("se coloco el refresh en null");
        console.log("Hasta aqui llega");
        await user.save(); 
        console.log("Se realizo el guardado");
    }

    static async findByRefreshToken ( userId, refreshToken ) {
        const user = await User.findOne({ _id: userId, refreshToken });
        return user;
    }
}

class Validation {
    // Se puede utilizar tambien Zod para no realizar estas cosas
    static username ( username ) {
        if ( typeof username !== 'string' ) throw new Error('Username must be a string');
        if ( username.length < 3 ) throw new Error('Username must be at least 3 characters long'); 
    }
    static password ( password ) {   
        if ( typeof password !== 'string' ) throw new Error('Password must be a string');
        if ( password.length < 6 ) throw new Error('Password must be at least 6 characters long'); 
    }
}
