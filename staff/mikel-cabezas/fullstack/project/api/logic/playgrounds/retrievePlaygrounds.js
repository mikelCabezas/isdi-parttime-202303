const { User, Playground } = require('../../data/models')
const mongoose = require('mongoose')

const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Object>} returns a promise object contains de sanatized playgrounds 
  * 
 * @throws {TypeError} on non-string userId (sync)
 * @throws {ContentError} on empty userId (sync)
 * 
 * @throws {ExistenceError} on user not found (async)
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