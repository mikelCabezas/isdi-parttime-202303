
const { User, Playground } = require('../../../data/models')
const fetch = require('node-fetch');

const {
    validators: { validateId, validateToken, validateText },
    errors: { ExistenceError }
} = require('com');

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Object>} returns a promise object contains Z sanatized playgrounds 
  * 
 * @throws {TypeError} on non-string userId (sync)
 * @throws {ContentError} on empty userId (sync)
 * 
 * @throws {ExistenceError} on user not found (async)
 */

module.exports = async (token, userId, city) => {
    debugger
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)
    validateId(userId)
    validateText(city)
    const user = await User.findById(userId)
    if (!user) throw new ExistenceError('User not found')

    return fetch(`https://maps-api.apple.com/v1/searchAutocomplete?q=${city}&lang=es-ES`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.accessToken}`,
        },
    })
        .then(res => {
            if (res.status !== 200)
                return res.json().then(({ error: message }) => { throw new Error(message.message) })
            return res.json()
        })
        .then(mapsResponse => {
            const { results } = mapsResponse
            debugger
            return results
        })
        .catch(error => {
            throw error
        })



}
