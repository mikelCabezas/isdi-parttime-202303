const { editPlaygroundElements } = require('../../../logic/playgrounds/')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)

    const { elements } = req.body
    const { playgroundId } = req.params

    return editPlaygroundElements(userId, playgroundId, elements)
        .then(() => {
            res.status(200).send()
        })
})