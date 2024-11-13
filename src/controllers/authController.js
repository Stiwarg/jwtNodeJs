import { UserRepository } from '../database/user-repository.js';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY, REFRESH_SECRET_JWT_KEY } from '../config/config.js';

export const login = async( req, res ) => {
    const { username, password } = req.body;

    try {
        const user = await UserRepository.login({ username, password });
        const accessToken = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, { expiresIn: '10m' } );
        const refreshToken = jwt.sign({ id: user._id, username: user.username }, REFRESH_SECRET_JWT_KEY, { expiresIn: '5m'} );

        await UserRepository.saveRefreshToken( user._id, refreshToken );

        return res
                .cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 10
                })
                .cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 5
                })
                .status( 200 )
                .send({ user, accessToken, refreshToken });

    } catch (error) {
        return res.status( 401 ).send( error.message );
    }
}

export const register = async ( req, res ) => {
    const { username, password } = req.body;

    try {
        const user = await UserRepository.create({ username, password });
        const accessToken = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: user._id, username: user.username }, REFRESH_SECRET_JWT_KEY, { expiresIn: '5m'});

        await UserRepository.saveRefreshToken( user._id, refreshToken );

        return res  
                .cookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 10 
                })
                .cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 5 
                })
                .status( 200 )
                .send({ user, accessToken, refreshToken });
    } catch (error) {
        console.error('Error en registro: ', error.message );
        return res.status( 400 ).send({ error: error.message });
    }
}

export const logout = async ( req, res ) => {
    const { user } = req.session;

    if ( user ) {
        await UserRepository.removeRefreshToken( user.id );
    }
    
    return res
            .clearCookie('access_token')
            .clearCookie('refresh_token')
            .status( 200 )
            .json({ message: 'Logout successful'});
}

