const mapkitAccessToken = require('../../logic/helpers/mapkitAccessToken')
const { addPlayground } = require('../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { name, description, sunExposition, elements, images, location } = req.body
    // const { id, author, image, title, text, date, comments, likes, visibility, location } = req.body

    return mapkitAccessToken()
        .then(accessToken => {
            return addPlayground(accessToken, userId, name, description, sunExposition, elements, images, location)
                .then(() => res.status(200).send())
            // .catch(error => res.status(409).send(error.message))
        })
})

