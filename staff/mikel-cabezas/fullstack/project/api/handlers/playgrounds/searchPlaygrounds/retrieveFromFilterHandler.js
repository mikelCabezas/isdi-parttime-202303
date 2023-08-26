const mapkitAccessToken = require('../../../logic/helpers/mapkitAccessToken')
const { retrieveCoordinatesFromCity, retrieveDataFromCurrentLocation } = require('../../../logic/playgrounds')
const { retrieveFromFilter } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { sunExposition, age, elements, accessible, from, distance } = req.params
    return mapkitAccessToken()
        .then(accessToken => {
            const fromIsArray = from.includes(',')

            if (fromIsArray) {
                const coordinates = from.split(',');
                return retrieveDataFromCurrentLocation(accessToken, userId, coordinates)
                    .then(result => result)
                    .catch(error => error.message)
            } else {
                return retrieveCoordinatesFromCity(accessToken, userId, from)
                    .then(result => result)
                    .catch(error => error.message)
            }
        })
        .then(location => {
            const coordinates = {
                latitude: location[0],
                longitude: location[1]
            }
            return retrieveFromFilter(userId, sunExposition, age, elements, accessible, coordinates, distance)
                .then(playgrounds => res.status(200).send(playgrounds))
                .catch(error => error.message)
        })
})