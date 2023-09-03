const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId, validateObject },
    errors: { ExistenceError }
} = require('com')

/**
 * Edits the sun exposition of a playground.
 * @param {string} userId - The ID of the user performing the edit.
 * @param {string} playgroundId - The ID of the playground to edit.
 * @param {Object} sunExposition - The new sun exposition object.
 * @returns {Promise<Object>} - A promise that resolves to the updated playground object.
 * @throws {ExistenceError} - If either the user or the playground is not found.
 */

module.exports = async (userId, playgroundId, sunExposition) => {
    validateId(userId)
    validateId(playgroundId)
    validateObject(sunExposition)
    const [user, playground] = await Promise.all([
        User.findById(userId).lean(),
        Playground.findById(playgroundId)
    ])
    if (!user) throw new ExistenceError('User not found')
    if (!playground) throw new ExistenceError('Playground not found')

    return playground.updateOne({
        sunExposition: sunExposition
    })
}

