const { User } = require('../../data/models')
const bcrypt = require('bcryptjs')


const {
    validators: { validateUserId, validatePassword, validateNewPassword },
    errors: { ExistenceError, ContentError }
} = require('com')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {string} userId 
 * @param {string} currentPassword 
 * @param {string} newPassword 
 * @param {string} repeatPassword 
 * @returns {Promise<Object>} returns a promise object contains de user with the user password updated 
 * 
 * @throws {TypeError} on non-string id and current password, new password, and confirm password (sync)
 * @throws {ContentError} on empty id or current password, new password, and confirm password (sync)
 * @throws {FormatError} wrong format on current password, new password, and confirm password (sync)
 * 
 * @throws {AuthError} on failed correlation on db and provided data in order to authorize this action (async)
 * @throws {ExistenceError} on user not found (async)

 */
module.exports = async (userId, currentPassword, newPassword, repeatPassword) => {
    validateUserId(userId)
    validatePassword(newPassword)
    validatePassword(repeatPassword)


    const user = await User.findById(userId)
    if (!user) throw new ExistenceError('user not found')

    const checkOldNewPasswordsMatch = await bcrypt.compare(currentPassword, user.password)
    if (!checkOldNewPasswordsMatch) throw new ContentError("Current password does not match")

    const checkOldNewPasswordsNotMatch = await bcrypt.compare(newPassword, user.password)
    if (checkOldNewPasswordsNotMatch) throw new ContentError("New password must be different as previous password")

    if (newPassword !== repeatPassword) throw new ContentError("New password and new password confirmation does not match")

    const hash = await bcrypt.hash(newPassword, 10)

    return user.updateOne({ password: hash })
}