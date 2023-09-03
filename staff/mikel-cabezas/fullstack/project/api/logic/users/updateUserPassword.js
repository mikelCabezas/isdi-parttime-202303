const { User } = require('../../data/models')
const bcrypt = require('bcryptjs')
const {
    validators: { validateUserId, validatePassword, validateNewPassword },
    errors: { ExistenceError, ContentError }
} = require('com')
const jwt = require('jsonwebtoken')

/**
 * Updates the password of a user with the given ID.
 * @param {string} userId - The ID of the user to update.
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The new password to set for the user.
 * @param {string} repeatPassword - The new password repeated to confirm it.
 * @returns {Promise<object>} - A promise that resolves to the updated user object.
 * @throws {ExistenceError} - If the user with the given ID does not exist.
 * @throws {ContentError} - If the current password does not match, the new password is the same as the old one, or the new password and its confirmation do not match.
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