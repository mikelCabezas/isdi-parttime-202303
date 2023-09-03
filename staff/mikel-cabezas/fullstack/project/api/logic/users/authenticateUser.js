require('dotenv').config()
const {
    validators: { validateEmail, validatePassword },
    errors: { ExistenceError, AuthError }
} = require('com')
const bcrypt = require('bcryptjs');
const { User } = require('../../data/models')

/**
 * Authenticates a user with the given email and password.
 * @param {string} email - The email of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 * @throws {ExistenceError} If the user does not exist.
 * @throws {AuthError} If the user is not valid or the password is incorrect.
 * @returns {Promise<string>} The ID of the authenticated user.
 */

module.exports = function authenticateUser(email, password) {
    validateEmail(email)
    validatePassword(password)

    return (async () => {
        const user = await User.findOne({ email })
        if (!user) throw new ExistenceError('user not found')
        if (user.isValid === false) throw new AuthError('Verify your account please. Check your email')

        const match = await bcrypt.compare(password, user.password)

        if (!match) throw new AuthError('wrong credentials')

        return user.id

    })()

}