const { User, Playground } = require('../../data/models')
const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {*} userId 
 * @param {*} playgroundId 
 * @returns {Promise<Object>} returns a promise object contains de post with likes updated 
 * 
 * @throws {TypeError} on non-string userId, playgroundId (sync)
 * @throws {ContentError} on empty userId, playgroundId (sync)
 * 
 * @throws {ExistenceError} on post not found (async)
 * 
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

