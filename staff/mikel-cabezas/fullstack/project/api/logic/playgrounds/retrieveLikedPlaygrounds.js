const { User, Playground } = require('../../data/models')
const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves the playgrounds liked by a user.
 * @async
 * @function
 * @param {string} userId - The ID of the user whose liked playgrounds are to be retrieved.
 * @throws {ExistenceError} If the user is not found.
 * @returns {Promise<Array>} An array of playgrounds liked by the user.
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
