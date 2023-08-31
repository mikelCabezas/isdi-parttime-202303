const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')

const {
    validators: { validateName, validateEmail, validateUniqueString },
    errors: { ExistenceError }
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

module.exports = async function searchUser(uniqueString) {
    validateUniqueString(uniqueString)
    const user = await User.findOne({ uniqueString: uniqueString })
    if (!user) throw new ExistenceError('user not found')
    return true
    // .catch(error => {
    //     throw error
    // })
}