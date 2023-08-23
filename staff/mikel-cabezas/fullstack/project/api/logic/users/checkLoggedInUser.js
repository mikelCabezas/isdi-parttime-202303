const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')

const {
    validators: { validateName, validateEmail, validatePassword },
    errors: { DuplicityError }
} = require('com')
/**
 * 
 * @param {string} userId the user string
 * @returns {void} does not return anything
 *
 * @throws {TypeError} on non-string name and email (sync)
 * @throws {ContentError} on empty name, email or password (sync)
 * @throws {FormatError} wrong format on email or password (sync)
 * 
 * @throws {DuplicityError} on already existing user with provided credentials (async)
 * 
 */

module.exports = function searchUser(userId) {
    // TODO validate unique string
    return User.findById(userId)
        .then(user => {
            console.log(user)
            return user
        })
        .catch(error => {
            throw error
        })
}