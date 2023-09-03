const { User, Playground } = require('../../../data/models')
const {
    validators: { validateId },
    errors: { ExistenceError }
} = require('com')

/**
 * Retrieves playgrounds based on filter criteria.
 * @param {string} userId - The ID of the user making the request.
 * @param {string} _sunExpositionFilter - The sun exposition filter.
 * @param {number} age - The age of the playground.
 * @param {Array} _elements - The elements of the playground.
 * @param {boolean} accessible - Whether the playground is accessible.
 * @param {Object} from - The coordinates of the user's location.
 * @param {number} distance - The maximum distance from the user's location to search for playgrounds.
 * @returns {Promise<Array>} - A promise that resolves to an array containing the user's location and an array of playgrounds that match the filter criteria.
 * @throws {Error} - If there is an error retrieving the playgrounds.
 */

module.exports = (userId, _sunExpositionFilter, age, _elements, accessible, from, distance) => {
    try {
        validateId(userId)
        debugger
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
        debugger
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
            query['elements.accessibility'] = isAccessible
        }

        if (elements) {
            query['elements.type'] = { $in: elements }
        }
        query['location'] = {
            $near: {
                $geometry: { type: "Point", coordinates: [from.latitude, from.longitude] },
                $maxDistance: distance * 1000
            }
        }

        return Promise.all([
            User.findById(userId).lean(),
            Playground.find({
                $and: [query]
            }, '-__v -dateCreated -lastModify').lean(),
        ])
            .then(([user, playgrounds]) => {
                if (!user) throw new ExistenceError(`User not found`)
                return [[from.latitude, from.longitude], [playgrounds]]
            })
    } catch (error) {
        throw error
    }
}