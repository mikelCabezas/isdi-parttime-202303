const { retrieveFromFilter } = require('../../../logic/playgrounds')
const { extractUserId, handleErrors } = require('../../helpers')

module.exports = handleErrors((req, res) => {
    const userId = extractUserId(req)
    const { age, elements, accessible, distance, sunExposition } = req.params
    // const { city, sunExposition, age, elements, accessibility, distance } = req.params

    debugger
    return retrieveFromFilter(userId, age, elements, accessible, distance, sunExposition)
        .then(posts => res.status(200).send(posts))

})