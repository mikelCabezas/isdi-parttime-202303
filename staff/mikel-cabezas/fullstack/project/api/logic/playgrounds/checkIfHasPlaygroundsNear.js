const { Playground } = require('../../data/models')

const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * Checks if there are any playgrounds near the user's location.
 * @param {string} userId - The ID of the user.
 * @param {Array<number>} userLocation - The location of the user in the form of an array of latitude and longitude.
 * @returns {Promise<boolean>} - A promise that resolves to true if there are no playgrounds near the user's location, or rejects with an ExistenceError if there are.
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
