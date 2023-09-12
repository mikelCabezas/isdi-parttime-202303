const { editPlaygroundAddImages } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { playgroundId } = req.params
    const { images } = req.body
    debugger
    return editPlaygroundAddImages(userId, playgroundId, images)
        .then(() => {
            res.status(200).send()
        })
})