
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
                let longRegion, latRegion, maxDistance

                const latitude = mapsResponse.results[0].coordinate.latitude
                const longitude = mapsResponse.results[0].coordinate.longitude

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

            } catch (error) {
                console.log(error.message)
            }
        })

}
