const { User } = require('../../data/models')
const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves a user by ID.
 * @async
 * @function
 * @param {string} userId - The ID of the user to retrieve.
 * @throws {ExistenceError} If the user is not found.
 * @returns {Promise<Object>} The user object without the password and ID fields.
 */

module.exports = async userId => {
    validateUserId(userId)

    const user = await User.findById(userId, '-password').lean()
    if (!user) throw new ExistenceError('user not found')

    return user
}