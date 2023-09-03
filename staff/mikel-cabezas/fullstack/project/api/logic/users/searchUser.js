const { User } = require('../../data/models')
const {
    validators: { validateName, validateEmail, validateUniqueString },
    errors: { ExistenceError }
} = require('com')

/**
 * Searches for a user in the database by uniqueString.
 * @async
 * @function searchUser
 * @param {string} uniqueString - The unique string of the user to search for.
 * @throws {ExistenceError} If the user is not found.
 * @returns {Promise<boolean>} Returns true if the user is found.
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