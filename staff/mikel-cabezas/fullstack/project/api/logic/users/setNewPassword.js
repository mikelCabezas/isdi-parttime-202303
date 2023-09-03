const { User } = require('../../data/models')
const bcrypt = require('bcryptjs')
const {
    validators: { validateName, validateUniqueString, validatePassword },
    errors: { ExistenceError }
} = require('com')

/**
 * Updates the password of a user with the given unique string.
 * @param {string} uniqueString - The unique string of the user to update.
 * @param {string} newPassword - The new password to set for the user.
 * @throws {ExistenceError} If the user with the given unique string is not found.
 * @throws {Error} If there is an error updating the user's password.
 */

module.exports = function updatePassword(uniqueString, newPassword) {
    validatePassword(newPassword)
    validateUniqueString(uniqueString)
    try {
        return (async () => {
            const user = await User.findOne({ uniqueString: uniqueString })
            if (!user) throw new ExistenceError('user not found')

            const hash = await bcrypt.hash(newPassword, 10)
            await user.updateOne({ password: hash })
            return
        })()
    } catch (error) {
        throw error
    }
}

