const { User } = require('../../data/models')
// const randomString = require('../helpers/randomString')

const {
    validators: { validateUniqueString },
    errors: { ExistenceError }
} = require('com')
/**
 * 
 * @param {string} uniqueString the user string
 * @returns {void} does not return anything
 *
 * @throws {ExistenceError} on non-string name and email (sync)
 * 
 */

module.exports = async function recoverPassword(uniqueString) {
    try {
        validateUniqueString(uniqueString)
        const user = await User.findOne({ uniqueString })
        if (!user) throw new ExistenceError('user not found')
        const mailSent = await user.updateOne({ isValid: true })
        if (mailSent) {
            return user.isValid
        }
    } catch (error) {
        throw error
    }
}