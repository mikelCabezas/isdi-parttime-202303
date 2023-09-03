const { User, Playground } = require('../../../data/models')
const fetch = require('node-fetch');

const {
    validators: { validateId, validateToken },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves playgrounds from a city using the Apple Maps API and MongoDB's geospatial query operators.
 * @param {Object} token - The user's access token.
 * @param {string} userId - The ID of the user.
 * @param {string} city - The name of the city to search for playgrounds in.
 * @returns {Promise<Array>} - A promise that resolves to an array containing the user's coordinates and an array of playgrounds.
 * @throws {ExistenceError} - If the user with the given ID does not exist.
 * @throws {Error} - If there is an error with the Apple Maps API request.
 */

module.exports = async (token, userId, city) => {
    validateId(userId)
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)

    const user = await User.findById(userId)
    if (!user) throw new ExistenceError(`user not found`)
    // token, name, description, sunExposition, elements, images, location

    // let mapsResponse

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
            let longRegion, latRegion, maxDistance

            const latitude = mapsResponse.results[0].coordinate.latitude
            const longitude = mapsResponse.results[0].coordinate.longitude


            mapsResponse.results[0].displayMapRegion.westLongitude > mapsResponse.results[0].displayMapRegion.eastLongitude ? longRegion = mapsResponse.results[0].displayMapRegion.westLongitude - mapsResponse.results[0].displayMapRegion.eastLongitude : longRegion = mapsResponse.results[0].displayMapRegion.eastLongitude - mapsResponse.results[0].displayMapRegion.westLongitude

            mapsResponse.results[0].displayMapRegion.northLatitude > mapsResponse.results[0].displayMapRegion.southLatitude ? latRegion = mapsResponse.results[0].displayMapRegion.northLatitude - mapsResponse.results[0].displayMapRegion.southLatitude : latRegion = mapsResponse.results[0].displayMapRegion.southLatitude - mapsResponse.results[0].displayMapRegion.northLatitude

            longRegion > latRegion ? maxDistance = longRegion * 111139 : maxDistance = latRegion * 111139

            const coordinates = [latitude, longitude]

            return Playground.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [latitude, longitude] },
                        $maxDistance: maxDistance
                        // $maxDistance: 10000
                    }
                }
            }).lean()
                .then(playgrounds => [coordinates, [playgrounds]])
            // .catch(error => {
            //     throw error
            // })


        })

}
