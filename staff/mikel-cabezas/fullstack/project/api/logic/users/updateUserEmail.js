const { User } = require('../../data/models')
const {
    validators: { validateUniqueString, validateEmail },
    errors: { ExistenceError, AuthError }
} = require('com')
const { } = require('com/errors')
const jwt = require('jsonwebtoken')

/**
 * Updates the email of a user with the given token and new email.
 * @param {string} token - The token of the user.
 * @param {string} newEmail - The new email to update.
 * @throws {ExistenceError} If the user is not found.
 * @throws {AuthError} If the user's account is not verified.
 */

module.exports = async (token, newEmail) => {
    try {
        console.log('token in function', token)
        const tokenIndex = token.indexOf("=");
        const tokenSliced = token.slice(tokenIndex + 1)
        console.log('tokenSliced in function', tokenSliced)

        const emailIndex = newEmail.indexOf("=");
        const emailSliced = newEmail.slice(emailIndex + 1)

        const payload = jwt.verify(tokenSliced, process.env.JWT_SECRET)
        const uniqueString = payload.sub

        validateUniqueString(uniqueString)
        validateEmail(emailSliced)

        const user = await User.findOne({ uniqueString: uniqueString })
        if (!user) throw new ExistenceError('user not found')
        if (user.isValid === false) throw new AuthError('Account not verified. Please check your email')

        await user.updateOne({ email: emailSliced })
    } catch (error) {
        throw error

    }


}