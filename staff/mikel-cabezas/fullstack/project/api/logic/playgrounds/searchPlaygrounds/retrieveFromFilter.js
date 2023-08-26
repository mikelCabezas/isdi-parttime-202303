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
module.exports = (userId, _sunExpositionFilter, age, _elements, accessible, from, distance) => {
    try {
        validateUserId(userId)

        age === 'null' ? age = null : age = age

        let isAccessible
        accessible === 'true' ? isAccessible = true : isAccessible = false
        accessible === 'false' ? isAccessible = false : isAccessible = true

        const sunExposition = {
            shady: false,
            sunny: false,
            partial: false,
        }
        if (_sunExpositionFilter && _sunExpositionFilter !== 'null') {
            const sunExpositionFilter = _sunExpositionFilter.split(',');
            sunExpositionFilter.map(sunData => {
                sunData.toLowerCase() === 'shady' ? sunExposition.shady = true : false
                sunData.toLowerCase() === 'sunny' ? sunExposition.sunny = true : false
                sunData.toLowerCase() === 'partial' ? sunExposition.partial = true : false
            })
        }

        let elements
        if (_elements && _elements !== 'null' && _elements !== []) {
            elements = _elements.split(',');
        } else {
            elements = null
        }


        const query = {
            'visibility': 'public'
        }
        if (_sunExpositionFilter !== 'null') {
            query['sunExposition.shady'] = sunExposition.shady
            query['sunExposition.sunny'] = sunExposition.sunny
            query['sunExposition.partial'] = sunExposition.partial
        }
        if (age) {
            query['elements.age'] = { $lte: age }
        }
        if (isAccessible) {
            query['elements.accessibility'] = { $lte: isAccessible }
        }

        if (elements) {
            query['elements.type'] = { $in: elements }
        }
        if (from) {
            query['location'] = {
                $near: {
                    $geometry: { type: "Point", coordinates: [from.latitude, from.longitude] },
                    $maxDistance: distance * 1000
                }
            }
        }

        return Promise.all([
            User.findById(userId).lean(),
            Playground.find({
                $and: [query]
            }, '-__v -dateCreated -lastModify').lean(),
        ])
            .then(([user, playgrounds]) => {
                if (!user) new ExistenceError(`User with id ${userId} not found`)
                console.log(playgrounds.length)
                return [[from.latitude, from.longitude], [playgrounds]]
            })
            .catch(error => {
                console.log(error)
            })
    } catch (error) {
        console.log(error)
    }
}