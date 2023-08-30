require('dotenv').config()
const {
    validators: { validateEmail, validatePassword },
    errors: { ExistenceError, AuthError }
} = require('com')
const bcrypt = require('bcryptjs');
const { User } = require('../../data/models')

/**
 * 
 * @param {string} email the user email
 * @param {string} password the user password
 * @returns {Promise<string>} the user id 
 * 
 * @throws {ContentError} on empty email or password (sync)
 * @throws {TypeError} on non-strings email or password (sync)
 * @throws {FormatError} wrong format on email or password (sync)
 * 
 * @throws {ExistenceError} on users does not exist (async)
 * @throws {AuthError} on failed correlation on db and provided data in order to authorize this action(async)
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