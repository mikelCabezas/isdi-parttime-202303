const { User, Playground } = require('../../data/models')
const context = require('../context')
const { ObjectId } = require('mongodb')
const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('com')
/**
 * 
 * @param {string} userId 
 * @returns {Promise<Object>} returns a promise object contains de sanatized filtered liked posts 
 * 
 * @throws {TypeError} on non-string userId (sync)
 * @throws {ContentError} on empty userId (sync)
 * 
 * @throws {ExistenceError} on user not found (async)
 */
module.exports = async userId => {
    validateId(userId)

    const [user, playgrounds] = await Promise.all(
        [await User.findById(userId).lean(),
        await Playground.find({ likes: { $in: userId } }).lean()
        ]
    )
    if (!user) throw new ExistenceError('user not found')
    return playgrounds
}
