const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')
const sendConfirmNewEmail = require('../helpers/sendConfirmNewEmail')
const retrieveUser = require('./retrieveUser')
const jwt = require('jsonwebtoken')

const {
    validators: { validateEmail },
    errors: { DuplicityError }
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

module.exports = function confirmNewEmail(userId, newEmail) {
    // validateEmail(newEmail)

    return User.findById(userId)
        .then(user => {
            const payload = { sub: user.uniqueString }
            const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })
            sendConfirmNewEmail(user.name, newEmail, token)
        })
        .catch(error => error)
}