const { User } = require('../../data/models')
const {
    validators: { validateUniqueString, validateEmail },
    errors: { ExistenceError, DuplicityError, AuthError }
} = require('com')
const { } = require('com/errors')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {string} uniqueString 
 * @param {string} newEmail 
 * 
 * @returns {Promise<Object>} returns a promise object contains de user with the email updated 
 * 
 * @throws {TypeError} on non-string id and email (sync)
 * @throws {ContentError} on empty id or email (sync)
 * @throws {FormatError} wrong format on email (sync)
 * 
 * @throws {AuthError} on failed correlation on db and provided data in order to authorize this action (async)
 * @throws {DuplicityError} on already existing user with provided credentials (async)

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