const { User, Post } = require('../../data/models')

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
module.exports = (userId, newName) => {
    // Validate input parameters
    validateId(userId)
    validateText(newName)

    // Find the user by ID and update their name
    return User.findById(userId)
        .then(user => {
            if (!user) throw new ExistenceError('user not found')

            return user.updateOne({ name: newName })
        })
}