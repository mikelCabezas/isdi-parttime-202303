const { User, Post } = require('../../data/models')

const {
    validators: { validateId, validateText },
    errors: { ExistenceError }
} = require('com')

/**
 * @typedef {Object} ExistenceError
 * @property {string} message - Error message
 */

/**
 * Updates the name of a user with the given ID.
 * @param {string} userId - The ID of the user to update.
 * @param {string} newName - The new name to set for the user.
 * @returns {Promise} A promise that resolves with the updated user object.
 * @throws {ExistenceError} If the user with the given ID does not exist.
 */
module.exports = async (userId, newName) => {
    validateId(userId)
    validateText(newName)

    const user = await User.findById(userId)
    if (!user) throw new ExistenceError('user not found')

    return user.updateOne({ name: newName })
}