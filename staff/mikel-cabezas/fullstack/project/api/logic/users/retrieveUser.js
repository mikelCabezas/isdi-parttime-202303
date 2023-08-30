const { User } = require('../../data/models')
const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string} userId user id
 * @returns {Promise<Object>} returns an object with de user
 * 
 * @throws {TypeError} on non-string id (sync)
 * @throws {ContentError} on empty id (sync)
 * 
 * @throws {ExistenceError} on user not found (async)
 */

module.exports = async userId => {
    validateUserId(userId)

    const user = await User.findById(userId, '-password -_id').lean()

    if (!user) throw new ExistenceError('user not found')

    return user
}