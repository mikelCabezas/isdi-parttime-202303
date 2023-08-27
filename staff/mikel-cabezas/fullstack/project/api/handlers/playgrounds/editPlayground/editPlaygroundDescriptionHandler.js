const { editPlaygroundDescription } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { description } = req.body
    const { playgroundId } = req.params

    return editPlaygroundDescription(userId, playgroundId, description)
        .then(() => {
            res.status(200).send()
        })
})