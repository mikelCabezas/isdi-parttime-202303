const { User } = require('../../data/models')
const bcrypt = require('bcryptjs')

const {
    validators: { validateName, validateUniqueString, validatePassword },
    errors: { ExistenceError }
} = require('com')
/**
 * 
 * @param {string} uniqueString the user string
 * @returns {void} does not return anything
 *
 * @throws {TypeError} on non-string name and email (sync)
 * @throws {ContentError} on empty name, email or password (sync)
 * @throws {FormatError} wrong format on email or password (sync)
 * 
 * @throws {DuplicityError} on already existing user with provided credentials (async)
 * 
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

