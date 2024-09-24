import jwt from 'jsonwebtoken';
import { UserRepository } from '../database/user-repository.js';
import { SECRET_JWT_KEY, REFRESH_SECRET_JWT_KEY } from '../config/config.js';

export const protectedRoute = ( req, res ) => {
    const { user } = req.session;
    if ( !user ) return res.status( 403 ).send('Access not authorized');
    res.render('protected',  user );
}

export const refreshToken = async ( req, res ) => {
    const { refresh_token } = req.cookies;

    if ( !refresh_token ) return res.status( 404 ).send('Refresh token missing');
    
    try {
            const data = jwt.verify( refresh_token, REFRESH_SECRET_JWT_KEY );
            const user = await UserRepository.findByRefreshToken( data.id, refresh_token );

            if ( !user ) {
                res.clearCookie('access_token').clearCookie('refresh_token');
                return res.status( 401 ).send('Unauthorized');
            }

            const newAccessToken = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, { expiresIn: '1m'});
            const newRefreshToken = jwt.sign({ id: user._id, username: user.username }, REFRESH_SECRET_JWT_KEY, { expiresIn: '5m'});

            user.refreshToken = newRefreshToken;
            await user.save();

            return res
                    .cookie('access_token', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 1000 * 60
                    })
                    .cookie('refresh_token', newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 1000 * 60 * 5
                    })
                    .send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status( 401 ).send('Token verification failed');
    }

}