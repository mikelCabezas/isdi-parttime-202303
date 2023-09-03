const { User } = require('../../data/models')
const {
    validators: { validateUniqueString },
    errors: { ExistenceError }
} = require('com')

/**
 * Recovers a user's password by setting their `isValid` property to `true`.
 * @async
 * @function recoverPassword
 * @param {string} uniqueString - The unique string associated with the user's account.
 * @throws {ExistenceError} If the user is not found.
 * @throws {Error} If there is an error updating the user's `isValid` property.
 * @returns {boolean} Whether the email was successfully sent or not.
 */

module.exports = async function recoverPassword(uniqueString) {
    try {
        validateUniqueString(uniqueString)
        const user = await User.findOne({ uniqueString })
        if (!user) throw new ExistenceError('user not found')
        const mailSent = await user.updateOne({ isValid: true })
        if (mailSent) {
            return user.isValid
        }
    } catch (error) {
        throw error
    }
}