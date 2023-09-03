const { User, Playground } = require('../../data/models')
const {
    validators: { validateId, validateUserId, validatePostId },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {*} userId 
 * @param {*} playgroundId 
 * @returns {Promise<Object>} returns a promise object contains de sanatized post 
 * 
 * @throws {TypeError} on non-string userId and/or playgroundId (sync)
 * @throws {ContentError} on empty userId and/or playgroundId (sync) 
 * 
 * @throws {ExistenceError} on user not found (async)
 * */
module.exports = async (userId, playgroundId) => {
    validateId(userId)
    validateId(playgroundId)
    const [user, playground] = await Promise.all([
        User.findById(userId).lean(),
        Playground.findById(playgroundId, '-date -__v').lean()
    ])
    if (!user) throw new ExistenceError(`User with id ${userId} not found`)
    if (!playground) throw new ExistenceError(`Playground with id ${playgroundId} not found`)

    // if (playground.author.toString() !== userId) throw new Error(`Post with id ${playgroundId} does not belong to user with id ${userId}`)
    // delete playground.author
    return playground

}