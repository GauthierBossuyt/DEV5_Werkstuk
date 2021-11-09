class Validation {
    constructor() {}

    /**
     * Checks if the username is valid
     * @param {string} username
     * @return {boolean} that indicates if the username is valid (TRUE) or invalid (FALSE)
     */
    checkUsername(username) {
        if (typeof username == "string") {
            return /^[ A-Za-z0-9]{5,20}$/.test(username);
        } else {
            return false;
        }
    }

    /**
     * Checks if the password is valid
     * @param {string} password
     * @return {boolean} that indicates if the password is valid (TRUE) or invalid (FALSE)
     */
    checkPassword(password) {
        if (typeof password == "string") {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                password
            );
        }
    }

    /**
     * Checks if the email is valid
     * @param {string} email
     * @return {boolean} that indicates if the email is valid (TRUE) or invalid (FALSE)
     */
    checkEmail(email) {
        if (typeof email == "string") {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email
            );
        }
    }
}

module.exports = { Validation };
