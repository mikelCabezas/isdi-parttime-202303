const mapkitAccessToken = require('../../../logic/helpers/mapkitAccessToken')

const { retrievePlaygroundsFromCity } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { city } = req.params

    return mapkitAccessToken()
        .then(accessToken => {
            return retrievePlaygroundsFromCity(accessToken, userId, city)
                .then(playgrounds => res.status(200).send(playgrounds))
                .catch(error => error.message)
        })
})