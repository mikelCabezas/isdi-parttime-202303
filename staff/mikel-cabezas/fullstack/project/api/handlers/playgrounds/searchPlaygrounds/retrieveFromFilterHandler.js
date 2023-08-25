const mapkitAccessToken = require('../../../logic/helpers/mapkitAccessToken')
const { retrieveCoordinatesFromCity, retrieveDataFromCurrentLocation } = require('../../../logic/playgrounds')
const { retrieveFromFilter } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { sunExposition, age, elements, accessible, from, distance } = req.params
    return mapkitAccessToken()
        .then(accessToken => {
            debugger
            const fromIsArray = from.includes(',')

            if (fromIsArray) {
                const coordinates = from.split(',');
                return retrieveDataFromCurrentLocation(accessToken, userId, coordinates)
                    .then(result => {
                        const { coordinates, city, street, state, country, regionLatLon } = result
                        return result
                    })
                    .catch(error => error.message)
            } else {
                debugger
                return retrieveCoordinatesFromCity(accessToken, userId, from)
                    .then(result => result)
                    .catch(error => error.message)
            }
        })
        .then(location => {
            return retrieveFromFilter(userId, sunExposition, age, elements, accessible, location, distance)
                .then(posts => res.status(200).send(posts))
                .catch(error => error.message)
        })
})