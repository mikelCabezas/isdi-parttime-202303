
const { User, Playground } = require('../../../data/models')

const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Object>} returns a promise object contains de sanatized playgrounds 
  * 
 * @throws {TypeError} on non-string userId (sync)
 * @throws {ContentError} on empty userId (sync)
 * 
 * @throws {ExistenceError} on user not found (async)
 */

module.exports = (token, userId, city) => {
    validateUserId(userId)

    return fetch(`https://maps-api.apple.com/v1/geocode?q=${city}&lang=es-ES`, {
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
                const latitude = mapsResponse.results[0].coordinate.latitude
                const longitude = mapsResponse.results[0].coordinate.longitude

                return [latitude, longitude]

            } catch (error) {
                console.log(error.message)
            }
        })

}
