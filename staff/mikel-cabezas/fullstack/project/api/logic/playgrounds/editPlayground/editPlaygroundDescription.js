const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId, validateText },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string} userId 
 * @param {string} playgroundId 
 * @param {string} title 
 * @param {string} text 
 * @param {string} image 
 * @param {string} visibility 
 * @returns {Promise<Object>} returns a promise object contains de edited playground 
 * 
 * @throws {TypeError} on non-string userId, playgroundId, image, title and text (sync)
 * @throws {ContentError} on empty userId, playgroundId, image, title and text (sync)
 * @throws {FormatError} wrong format on image (sync)
 * 
 * @throws {ExistenceError} on playground not found (async)
 */
module.exports = (userId, playgroundId, description) => {
    try {
        validateId(userId)
        validateId(playgroundId)
        validateText(description)

        return Promise.all([
            User.findById(userId).lean(),
            Playground.findById(playgroundId)

        ])
            .then(([user, playground]) => {
                if (!user) throw new ExistenceError('User not found')
                if (!playground) throw new ExistenceError('Playground not found')

                return playground.updateOne({
                    description: description
                    // 'sunExposition.shady': sunExposition.shady,
                    // 'sunExposition.sunny': sunExposition.sunny,
                    // 'sunExposition.partial': sunExposition.partial
                })
            })

    } catch (error) {
        console.log(error.message)
        return error.message
    }

}

