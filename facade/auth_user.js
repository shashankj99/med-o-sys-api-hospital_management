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

    /**
     * Method to check if user has that role
     * @param roles
     */
    static has_role(roles)
    {
        // get roles from object
        const rolesFromObj = this.userObj.roles;

        // check if some of the array value falls in the roleFrom object array
        return roles.some(role => rolesFromObj.includes(role));
    }
}

module.exports = AuthUser;
