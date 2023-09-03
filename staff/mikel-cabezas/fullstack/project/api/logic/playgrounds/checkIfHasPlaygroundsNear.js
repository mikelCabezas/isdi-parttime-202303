
const { User, Playground } = require('../../data/models')
const fetch = require('node-fetch');

const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Object>} returns a promise object contains Z sanatized playgrounds 
  * 
 * @throws {TypeError} on non-string userId (sync)
 * @throws {ContentError} on empty userId (sync)
 * 
 * @throws {ExistenceError} on user not found (async)
 */

module.exports = (userId, userLocation) => {
    validateUserId(userId)
    const latitude = userLocation[0]
    const longitude = userLocation[1]
    const coordinates = [latitude, longitude]

    return Playground.find(
        {
            location:
            {
                $near:
                {
                    $geometry: { type: "Point", coordinates: userLocation },
                    $maxDistance: 20
                }
            }
        }
    )
        .then(playgrounds => {
            [coordinates, playgrounds]

            if (playgrounds.length > 0) throw new ExistenceError('New playgrounds cannot are near than 20 meters than other.')
            return true
        })
}
