const { User, Playground } = require('../../../data/models')
const {
    validators: { validateUserId, validateText },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves cities from the database based on a user ID and a city name.
 * @param {string} userId - The ID of the user.
 * @param {string} city - The name of the city to search for.
 * @returns {Promise<string[]>} - A promise that resolves to an array of city names.
 * @throws {ExistenceError} - If the user with the given ID does not exist.
 */

module.exports = async (userId, city) => {
    validateUserId(userId)
    validateText(city)

    const [user, cities] = await Promise.all([
        User.findById(userId).lean(),
        Playground.find({
            $and: [
                { 'visibility': 'public' },
                { 'location.city': { $regex: city, $options: "i" } }
            ]
            // }).distinct('location.city').lean(),
        }).distinct('location.city').lean(),
        // }, '-_id -likes -images -__v -author -description -name   -location._id -location.street -location.type -elements -sunExposition -dateCreated -lastModify -visibility').lean(),
    ])
    if (!user) throw new ExistenceError(`user not found`)
    return cities
    // if (cities.length > 0) return cities
    // if (cities.length === 0) return null
}