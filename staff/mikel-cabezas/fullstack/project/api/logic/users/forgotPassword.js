const { User } = require('../../data/models')
const sendNewPasswordEmail = require('../helpers/sendNewPasswordEmail')
const retrieveUser = require('./retrieveUser')
const jwt = require('jsonwebtoken')
const {
    validators: { validateEmail },
    errors: { ExistenceError }
} = require('com')

/**
 * Updates the uniqueString field of a user with a new random string, generates a JWT token with the new uniqueString as the payload, and sends an email with the token to the user's email address.
 * @param {string} email - The email address of the user.
 * @throws {ExistenceError} If no user is found with the given email address.
 * @throws {ValidationError} If the email parameter is not a valid email address.
 * @returns {Promise<boolean>} A Promise that resolves to true if the email was sent successfully.
 */

module.exports = async function forgotPassword(email) {
    try {
        validateEmail(email)
        const randomString = () => {
            const length = 8
            let randomString = ''

            for (let i = 0; i < length; i++) {
                const character = Math.floor((Math.random() * 10) + 1)

                randomString += character
            }
            return randomString
        }
        const uniqueString = randomString()

        const user = await User.findOne({ email })
        if (!user) throw new ExistenceError('user not found')

        await user.updateOne({ uniqueString: uniqueString }).then(user => user)

        const payload = { sub: user.uniqueString }
        const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })
        sendNewPasswordEmail(email, token)

        return true
        // return user
    } catch (error) {
        throw error
    }
}