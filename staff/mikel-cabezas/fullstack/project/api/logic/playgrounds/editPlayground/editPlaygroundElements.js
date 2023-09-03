const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId, validateObject },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string} userId 
 * @param {string} playgroundId 
 * @param {string} title 
 * @param {string} text 
 * @param {string} image 
 * @param {string} visibility 
 * @returns {Promise<Object>} returns a promise object contains de edited playground 
 * 
 * @throws {TypeError} on non-string userId, playgroundId, image, title and text (sync)
 * @throws {ContentError} on empty userId, playgroundId, image, title and text (sync)
 * @throws {FormatError} wrong format on image (sync)
 * 
 * @throws {ExistenceError} on playground not found (async)
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

