require('dotenv').config()
const fetch = require('node-fetch');

const { validators: { validateToken, validateUserId }, errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string*} token
 * @param {string*} location 
 * @returns {Promise<Object>} returns a promise object contains de new post 
 * 
 * @throws {TypeError} on non-string id, image, title and text (sync)
 * @throws {ContentError} on empty id, image, title or text  (sync)
 * @throws {FormatError} wrong format on image (sync)
 */

module.exports = (token, userId, location) => {
    try {
        validateToken(token.accessToken)
        validateUserId(userId)
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
                if (res.status !== 200)
                    return res.json().then(({ error: message }) => { throw new Error(message) })
                return res.json()
            })
            .then(mapsResponse => {

                if (mapsResponse.results[0].displayMapRegion.westLongitude > mapsResponse.results[0].displayMapRegion.eastLongitude)
                    longRegion = mapsResponse.results[0].displayMapRegion.westLongitude - mapsResponse.results[0].displayMapRegion.eastLongitude
                else
                    longRegion = mapsResponse.results[0].displayMapRegion.eastLongitude - mapsResponse.results[0].displayMapRegion.westLongitude

                if (mapsResponse.results[0].displayMapRegion.northLatitude > mapsResponse.results[0].displayMapRegion.southLatitude)
                    latRegion = mapsResponse.results[0].displayMapRegion.northLatitude - mapsResponse.results[0].displayMapRegion.southLatitude
                else
                    latRegion = mapsResponse.results[0].displayMapRegion.southLatitude - mapsResponse.results[0].displayMapRegion.northLatitude

                if (longRegion > latRegion) maxDistance = longRegion * 111139
                else maxDistance = latRegion * 111139

                return {
                    latitude: latitude,
                    longitude: longitude,
                    city: mapsResponse.results[0].structuredAddress.locality,
                    street: mapsResponse.results[0].structuredAddress.fullThoroughfare,
                    state: mapsResponse.results[0].structuredAddress.administrativeArea,
                    country: mapsResponse.results[0].country,
                    regionLatLon: maxDistance
                }
            })



    } catch (error) {
        console.log(error.message)
        return error.message
    }




}