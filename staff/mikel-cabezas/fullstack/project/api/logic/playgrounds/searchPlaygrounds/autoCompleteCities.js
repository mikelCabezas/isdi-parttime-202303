const fetch = require('node-fetch');

const {
    validators: { validateUserId, validateToken },
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
    validateToken(token.accessToken)
    validateUserId(userId)

    // token, name, description, sunExposition, elements, images, location

    // let mapsResponse
    debugger

    return fetch(`https://maps-api.apple.com/v1/searchAutocomplete?q=${city}&lang=es-ES`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.accessToken}`,
        },
    })

        .then(mapsResponse => {
            try {
                const { results } = mapsResponse

                // const latitude = location.latitude
                // const longitude = location.longitude

                return { results }

            } catch (error) {
                console.log(error.message)
            }
        })
        .catch(error => {
            console.log(error.message)
            return error
        })

}
