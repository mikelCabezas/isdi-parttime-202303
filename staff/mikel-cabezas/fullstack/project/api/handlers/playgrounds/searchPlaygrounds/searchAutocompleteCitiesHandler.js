const mapkitAccessToken = require('../../../logic/helpers/mapkitAccessToken')

const { searchAutocompleteCities } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { city } = req.params

    return mapkitAccessToken()
        .then(accessToken => {
            return searchAutocompleteCities(accessToken, userId, city)
                .then(posts => res.status(200).send(posts))
                .catch(error => error.message)
        })
})