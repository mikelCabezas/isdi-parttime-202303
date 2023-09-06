const { User } = require('../../data/models')
const {
    validators: { validateUniqueString },
    errors: { ExistenceError }
} = require('com')

/**
 * Validates a user by setting their `isValid` property to `true`.
 * @async
 * @function
 * @param {string} uniqueString - The unique string identifier of the user to validate.
 * @throws {ExistenceError} Throws an error if the user is not found.
 */

module.exports = async function validateUser(uniqueString) {
    validateUniqueString(uniqueString)
    const user = await User.findOne({ uniqueString: uniqueString })
    if (!user) throw new ExistenceError('user not found')

    return user.updateOne({ isValid: true })
}