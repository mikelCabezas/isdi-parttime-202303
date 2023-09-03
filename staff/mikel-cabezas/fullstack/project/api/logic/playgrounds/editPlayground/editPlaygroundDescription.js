const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId, validateText },
    errors: { ExistenceError }
} = require('com')

/**
 * Edits the description of a playground.
 * @param {string} userId - The ID of the user performing the action.
 * @param {string} playgroundId - The ID of the playground to edit.
 * @param {string} description - The new description for the playground.
 * @returns {Promise} A promise that resolves with the result of the update operation.
 * @throws {ExistenceError} If either the user or the playground is not found.
 */

module.exports = async (userId, playgroundId, description) => {
    validateId(userId)
    validateId(playgroundId)
    validateText(description)

    const [user, playground] = await Promise.all([
        User.findById(userId).lean(),
        Playground.findById(playgroundId)
    ])
    if (!user) throw new ExistenceError('User not found')
    if (!playground) throw new ExistenceError('Playground not found')

    return playground.updateOne({
        description: description
    })

}

