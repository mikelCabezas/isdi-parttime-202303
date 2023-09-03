const { User, Playground } = require('../../../data/models')

const {
    validators: { validateText, validateId, validateToken },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves playgrounds near a given city using the Apple Maps API and MongoDB's geospatial query operators.
 * @param {Object} token - The user's access token.
 * @param {string} token.accessToken - The user's access token.
 * @param {string} userId - The ID of the user making the request.
 * @param {string} city - The name of the city to search for playgrounds near.
 * @returns {Promise<Array>} - A promise that resolves to an array of playgrounds near the given city.
 * @throws {ExistenceError} - If the user with the given ID does not exist.
 * @throws {Error} - If there is an error with the Apple Maps API or the MongoDB query.
 */

module.exports = async (token, userId, city) => {
    validateId(userId)
    validateText(city)
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

            return Playground.find(
                {
                    location:
                    {
                        $near:
                        {
                            $geometry: { type: "Point", coordinates: [latitude, longitude] },
                            $maxDistance: 10000
                        }
                    }
                }
            ).lean()
        })

}
