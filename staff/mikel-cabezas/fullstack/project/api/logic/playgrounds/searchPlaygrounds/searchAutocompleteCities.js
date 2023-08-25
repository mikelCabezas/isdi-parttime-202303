
const { User, Playground } = require('../../../data/models')
const fetch = require('node-fetch');

const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

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

module.exports = (token, userId, city) => {
    validateUserId(userId)

    // token, name, description, sunExposition, elements, images, location

    // let mapsResponse

    return fetch(`https://maps-api.apple.com/v1/searchAutocomplete?q=${city}&lang=es-ES`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.accessToken}`,
        },
    })
        .then(res => {
            if (res.status !== 200)
                return res.json().then(({ error: message }) => { throw new Error(message) })
            return res.json()
        })
        .then(mapsResponse => {
            try {
                const { results } = mapsResponse
                return results
            } catch (error) {
                console.log(error.message)
            }
        })

}
