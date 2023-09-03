const { User, Playground } = require('../../data/models')
const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('com')

/**
 * Toggles the like status of a playground for a user.
 * @param {string} userId - The ID of the user.
 * @param {string} playgroundId - The ID of the playground.
 * @throws {ExistenceError} If the playground or user is not found.
 * @returns {Promise<Playground>} The updated playground object.
 */

module.exports = async (userId, playgroundId) => {
    validateId(userId)
    validateId(playgroundId)

    const playground = await Playground.findById(playgroundId)
    if (!playground) throw new ExistenceError('playground not found')

    const user = await User.findById(userId)
    if (!user) throw new ExistenceError('user not found')

    const indexLikedPost = playground.likes?.indexOf(userId)
    if (indexLikedPost < 0) {
        playground.likes.push(userId)

        await playground.updateOne({
            likes: playground.likes
        })
    } else {
        playground.likes.splice(indexLikedPost, 1)
        await playground.updateOne({
            likes: playground.likes
        })
    }

    await Playground.findById(playgroundId).then(playground => playground)

    // .then(res => {
    //     debugger
    //     return Playground.findById(playgroundId).then(playground => playground)
    // })
}

