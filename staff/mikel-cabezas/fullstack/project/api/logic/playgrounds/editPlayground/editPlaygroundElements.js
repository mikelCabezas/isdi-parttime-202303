const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId, validateObject },
    errors: { ExistenceError }
} = require('com')

/**
 * Edits the elements of a playground.
 * @param {string} userId - The ID of the user performing the edit.
 * @param {string} playgroundId - The ID of the playground to edit.
 * @param {Object} elements - The new elements to set for the playground.
 * @returns {Promise} A promise that resolves with the result of the update operation.
 * @throws {ExistenceError} If either the user or the playground is not found.
 */

module.exports = async (userId, playgroundId, elements) => {
    validateId(userId)
    validateId(playgroundId)
    validateObject(elements)

    const [user, playground] = await Promise.all([
        User.findById(userId).lean(),
        Playground.findById(playgroundId)
    ])
    if (!user) throw new ExistenceError('User not found')
    if (!playground) throw new ExistenceError('Playground not found')

    return playground.updateOne({
        elements: elements
    })
}

