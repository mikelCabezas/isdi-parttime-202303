const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId, validateArray, validateURL },
    errors: { ExistenceError }
} = require('com')

/**
 * Adds images to a playground.
 * @param {string} userId - The ID of the user adding the images.
 * @param {string} playgroundId - The ID of the playground to add the images to.
 * @param {string[]} images - An array of URLs for the images to add.
 * @returns {Promise<object>} - A promise that resolves to the result of the update operation.
 * @throws {ExistenceError} - If the user or playground is not found.
 */

module.exports = async (userId, playgroundId, images) => {
    validateId(userId)
    validateId(playgroundId)
    validateArray(images)
    images.map(image => validateURL(image))

    const [user, playground] = await Promise.all([
        User.findById(userId).lean(),
        Playground.findById(playgroundId)
    ])
    if (!user) throw new ExistenceError('User not found')
    if (!playground) throw new ExistenceError('Playground not found')

    return playground.updateOne({
        $push: { images: images }
    })

}

