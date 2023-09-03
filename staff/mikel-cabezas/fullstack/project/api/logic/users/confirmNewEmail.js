const { User } = require('../../data/models')
const sendConfirmNewEmail = require('../helpers/sendConfirmNewEmail')
const jwt = require('jsonwebtoken')

const {
    validators: { validateEmail },
    errors: { DuplicityError, ExistenceError, AuthError }
} = require('com')

/**
 * Confirms a new email for a user
 * @async
 * @function confirmNewEmail
 * @param {string} userId - The ID of the user to confirm the new email for
 * @param {string} newEmail - The new email to confirm
 * @throws {ExistenceError} If the user is not found
 * @throws {DuplicityError} If the new email is already associated with another user
 * @throws {AuthError} If the user's account is not verified
 * @throws {Error} If the email confirmation mail could not be sent
 * @returns {boolean} Returns true if the email confirmation mail was sent successfully
 */

module.exports = async function confirmNewEmail(userId, newEmail) {
    try {
        validateEmail(newEmail)

        const user = await User.findById(userId)
        if (!user) throw new ExistenceError('user not found')

        const checkNewEmail = await User.findOne({ email: newEmail })

        if (checkNewEmail) throw new DuplicityError(`This user with email ${newEmail} already exists`)
        if (user.isValid === false) throw new AuthError('Account not verified. Please check your email')

        const payload = { sub: user.uniqueString }
        const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })

        const mailSent = await sendConfirmNewEmail(user.name, newEmail, token)

        if (!mailSent) throw new Error('Mail not sent. Check email settings')
        return true
    } catch (error) {
        throw error
    }
}


