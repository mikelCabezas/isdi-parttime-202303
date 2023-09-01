const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')

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

module.exports = async function setNewPassword(newPassword) {
    // TODO validate unique string
    const hash = await bcrypt.hash(newPassword, 10)

    await User.updateOne({ password: hash })
}