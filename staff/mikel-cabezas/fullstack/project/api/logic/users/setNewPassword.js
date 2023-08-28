const { User } = require('../../data/models')
const bcrypt = require('bcryptjs')

const {
    validators: { validateName, validateEmail, validatePassword },
    errors: { DuplicityError }
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

module.exports = function setNewPassword(uniqueString, newPassword) {
    validatePassword(newPassword)
    // TODO validate unique string
    try {
        return (async () => {
            const user = await User.findOne({ uniqueString: uniqueString })
            const hash = await bcrypt.hash(newPassword, 10)
            await user.updateOne({ password: hash })
            return
        })()
    } catch (error) {
        throw error
    }
}

