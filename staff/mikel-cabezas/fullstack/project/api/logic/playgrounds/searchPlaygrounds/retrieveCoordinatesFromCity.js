const fetch = require('node-fetch');
const { User, Playground } = require('../../../data/models')

const {
    validators: { validateId, validateToken },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves the coordinates of a city using the Apple Maps API.
 * @param {Object} token - The user's access token.
 * @param {string} token.accessToken - The user's access token.
 * @param {string} userId - The ID of the user.
 * @param {string} city - The name of the city to retrieve coordinates for.
 * @returns {Promise<Array<number>>} - A promise that resolves to an array containing the latitude and longitude of the city.
 * @throws {ExistenceError} - If the user is not found.
 * @throws {Error} - If there is an error with the API request.
 */

module.exports = async (token, userId, city) => {
    validateId(userId)
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)

    const user = await User.findById(userId)
    if (!user) throw new ExistenceError(`user not found`)

    return fetch(`https://maps-api.apple.com/v1/geocode?q=${city}&lang=es-ES`, {
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
            const latitude = mapsResponse.results[0].coordinate.latitude
            const longitude = mapsResponse.results[0].coordinate.longitude

            return [latitude, longitude]
        })

}
