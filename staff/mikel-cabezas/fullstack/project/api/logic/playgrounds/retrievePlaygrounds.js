const { User, Playground } = require('../../data/models')
const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves playgrounds near a given location.
 * @param {string} userId - The ID of the user making the request.
 * @param {Object} location - The location to search for playgrounds near.
 * @param {number} location.latitude - The latitude of the location.
 * @param {number} location.longitude - The longitude of the location.
 * @returns {Promise<Array>} - A promise that resolves to an array of playgrounds near the given location.
 * @throws {ExistenceError} - If the user with the given ID does not exist.
 */

module.exports = async (userId, location) => {
    validateUserId(userId)
    const user = await User.findById(userId)
    if (!user) throw new ExistenceError('user not found')

    const latitude = location.latitude
    const longitude = location.longitude
    const coordinates = [latitude, longitude]
    const playgrounds = Promise.all([
        await Playground.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: coordinates },
                    // $maxDistance: maxDistance
                    $maxDistance: 10000
                }
            }
        }).lean()
    ])
    return playgrounds
    // .then(playgrounds => [playgrounds])
    // .then(playgrounds => playgrounds)

}