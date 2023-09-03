const { User, Playground } = require('../../data/models')
const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves a playground by its ID.
 * @param {string} userId - The ID of the user who owns the playground.
 * @param {string} playgroundId - The ID of the playground to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves with the playground object.
 * @throws {ExistenceError} - If either the user or the playground is not found.
 */

module.exports = async (userId, playgroundId) => {
    validateId(userId)
    validateId(playgroundId)
    const [user, playground] = await Promise.all([
        User.findById(userId).lean(),
        Playground.findById(playgroundId, '-date -__v').lean()
    ])
    if (!user) throw new ExistenceError(`User with id ${userId} not found`)
    if (!playground) throw new ExistenceError(`Playground with id ${playgroundId} not found`)

    return playground

}