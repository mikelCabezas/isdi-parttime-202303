const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')
const sendConfirmNewEmail = require('../helpers/sendConfirmNewEmail')
const retrieveUser = require('./retrieveUser')
const jwt = require('jsonwebtoken')

const {
    validators: { validateEmail },
    errors: { DuplicityError, ExistenceError, AuthError }
} = require('com')
/**
 * 
 * @param {string} name the user name 
 * @param {string} email the user email
 * @param {string} password the user password
 * @returns {void} does not return anything
 *
 * @throws {TypeError} on non-string name and email (sync)
 * @throws {ContentError} on empty name, email or password (sync)
 * @throws {FormatError} wrong format on email or password (sync)
 * 
 * @throws {DuplicityError} on already existing user with provided credentials (async)
 * 
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


