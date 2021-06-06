/**
 * Facade class for user details
 */
class AuthUser
{
    /**
     * method to set the data obtained from the auth middleware
     * @param data
     */
    static user_data(data)
    {
        this.userObj = data;
    }

    /**
     * method to get the user object
     * @returns {*}
     */
    static user()
    {
        return this.userObj.user;
    }

    /**
     * Method to get the roles array
     * @returns {any}
     */
    static roles()
    {
        return this.userObj.roles;
    }

    /**
     * Method to get the hospital object
     * @returns {any}
     */
    static hospital()
    {
        return this.userObj.hospital;
    }
}

module.exports = AuthUser;
