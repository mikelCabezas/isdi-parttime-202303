const { retrieveCitiesFromDatabase } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { city } = req.params


    return retrieveCitiesFromDatabase(userId, city)
        .then(playgrounds => res.status(200).send(playgrounds))

})