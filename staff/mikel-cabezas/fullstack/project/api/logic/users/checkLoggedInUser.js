const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')

const {
    validators: { validateName, validateEmail, validatePassword },
    errors: { ExistenceError, AuthError }
} = require('com')
/**
 * 
 * @param {string} userId the user string
 * @returns {void} does not return anything
 *
 * @throws {TypeError} on non-string name and email (sync)
 * @throws {ContentError} on empty name, email or password (sync)
 * @throws {FormatError} wrong format on email or password (sync)
 * 
 * @throws {DuplicityError} on already existing user with provided credentials (async)
 * 
 */

module.exports = async function checkLoggedInUser(userId) {
    // TODO validate unique string
    const _user = await User.findById(userId)
    if (!_user) throw new ExistenceError('user not found')

    if (!_user.isValid) throw new AuthError('Account not verified. Please check your email')

    const user = {
        id: _user.id,
        _id: _user._id,
        name: _user.name,
        email: _user.email,
    }

    return user

}