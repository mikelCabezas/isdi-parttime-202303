const { editPlaygroundSunExposition } = require('../../../logic/playgrounds/')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { sunExposition } = req.body
    const { playgroundId } = req.params

    return editPlaygroundSunExposition(userId, playgroundId, sunExposition)
        .then(() => {
            res.status(200).send()
        })
})