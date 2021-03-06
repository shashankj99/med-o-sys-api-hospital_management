const axios = require('axios');
const OAUTH_URL = require('../config').OAUTH_URL;
const AuthUser = require('../facade/auth_user');

const auth = (permission) =>
{
    return async (req, res, next) => {
        try {
            // get the access token
            const accessToken = (req.headers['authorization'])
                ? req.headers['authorization']
                : req.query.bearer_token;
    
            // throw error if access token is empty
            if (!accessToken)
                throw new Error('Access token is required');
    
            // auth url to get the user details
            const authUrl = `${OAUTH_URL}/user/permission/check?permission=${permission}`;
    
            // header params for the request
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    "Authorization": accessToken
                }
            };
    
            // make request to the auth service
            return axios.get(authUrl, config)
                .then(response => {
                    // check if the response status is 200 or not
                    if (response.data.status !== 200)
                        return res.status(response.data.status)
                            .json({
                               status: response.data.status,
                               message: response.data.message
                            });
                    
                    // check whether user is permitted or not
                    if (!response.data.data.is_permitted)
                        return res.status(401)
                            .json({
                                status: 403,
                                message: 'Forbidden'
                            });
    
                    // add response to the AuthUser facade
                    AuthUser.user_data(response.data.data);
    
                    return next();
                })
                .catch(err => {
                    return res.status(400)
                        .json({
                           status: 400,
                           message: err.message
                        });
                });
        } catch (error) {
            return res.status(401)
                .json({
                    status: 401,
                    message: error.message
                });
        }   
    }
}

module.exports = auth;
