const axios = require("axios");

const OAUTH_URL = require("../config").OAUTH_URL;

const fetchUser = {
    get_user_details_from_auth_service: (email, accessToken) => {
        // auth service url
        const oauthUrl = `${OAUTH_URL}/user/serialize?email=${email}`;

        // fetch user details from auth service
        return axios.get(oauthUrl, {
            "headers": { 
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            return err.response.data
        });
    }
};

module.exports = fetchUser;