require('dotenv').config()
const fetch = require('node-fetch');
const { User, Playground } = require('../../../data/models')

const { validators: { validateToken, validateId }, errors: { ExistenceError }
} = require('com')

/**
 * Retrieves data from the current location.
 * @param {Object} token - The user's access token.
 * @param {string} token.accessToken - The user's access token.
 * @param {string} userId - The user's ID.
 * @param {Array} location - The location coordinates.
 * @param {number} location[0] - The latitude.
 * @param {number} location[1] - The longitude.
 * @returns {Promise<Object>} Returns a promise object containing the new post.
 * @throws {TypeError} On non-string id, image, title and text (sync).
 * @throws {ContentError} On empty id, image, title or text  (sync).
 * @throws {FormatError} Wrong format on image (sync).
 * @throws {ExistenceError} User not found.
 */

module.exports = async (token, userId, location) => {
    validateId(userId)
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)

    const user = await User.findById(userId)
    if (!user) throw new ExistenceError(`user not found`)

    const latitude = location[0]
    const longitude = location[1]
    const coordinates = [latitude, longitude]
    return fetch(`https://maps-api.apple.com/v1/reverseGeocode?loc=${location}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.accessToken}`,
        },
    })
        .then(res => {
            if (res.status !== 200) return res.json().then(({ error: message }) => { throw new Error(message.message) })

            return res.json()
        })
        .then(mapsResponse => {
            mapsResponse.results[0].displayMapRegion.westLongitude > mapsResponse.results[0].displayMapRegion.eastLongitude
                ? longRegion = mapsResponse.results[0].displayMapRegion.westLongitude - mapsResponse.results[0].displayMapRegion.eastLongitude
                : longRegion = mapsResponse.results[0].displayMapRegion.eastLongitude - mapsResponse.results[0].displayMapRegion.westLongitude

            mapsResponse.results[0].displayMapRegion.northLatitude > mapsResponse.results[0].displayMapRegion.southLatitude
                ? latRegion = mapsResponse.results[0].displayMapRegion.northLatitude - mapsResponse.results[0].displayMapRegion.southLatitude
                : latRegion = mapsResponse.results[0].displayMapRegion.southLatitude - mapsResponse.results[0].displayMapRegion.northLatitude

            longRegion > latRegion ? maxDistance = longRegion * 111139 : maxDistance = latRegion * 111139

            return {
                latitude: latitude,
                longitude: longitude,
                city: mapsResponse.results[0].structuredAddress.locality,
                street: mapsResponse.results[0].structuredAddress.fullThoroughfare,
                state: mapsResponse.results[0].structuredAddress.administrativeArea,
                country: mapsResponse.results[0].country,
                regionLatLon: maxDistance
            }
        }).catch(error => {
            throw error
        })
}