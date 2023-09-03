const { User } = require('../../data/models')
const {
    validators: { validateId },
    errors: { ExistenceError, AuthError }
} = require('com')

/**
 * Retrieves a user by their ID and returns their information if they exist and are verified.
 * @async
 * @function checkLoggedInUser
 * @param {string} userId - The ID of the user to retrieve.
 * @throws {ExistenceError} If the user with the given ID does not exist.
 * @throws {AuthError} If the user with the given ID exists but is not verified.
 * @returns {Object} The user's information, including their ID, name, and email.
 */

module.exports = async function checkLoggedInUser(userId) {
    validateId(userId)

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