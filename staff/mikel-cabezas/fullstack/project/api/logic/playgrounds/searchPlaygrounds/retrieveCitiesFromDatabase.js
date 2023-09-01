const { User, Playground } = require('../../../data/models')

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
module.exports = (userId, city) => {
    validateUserId(userId)

    return Promise.all([
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
        .then(([user, cities]) => {

            if (!user) new ExistenceError(`User with id ${userId} not found`)
            return cities
            if (cities.length > 0) return cities
            if (cities.length === 0) return null
        })
}