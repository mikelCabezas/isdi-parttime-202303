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
module.exports = (userId, age, _elements, accessible, distance, _sunExpositionFilter) => {
    const elements = _elements.split(',');
    const sunExposition = {
        shady: false,
        sunny: false,
        partial: false,
    }

    let sunExpositionFilter
    if (_sunExpositionFilter) {
        sunExpositionFilter = _sunExpositionFilter.split(',');
        sunExpositionFilter.map(sunData => {
            sunData.toLowerCase() === 'shady' ? sunExposition.shady = true : false
            sunData.toLowerCase() === 'sunny' ? sunExposition.sunny = true : false
            sunData.toLowerCase() === 'partial' ? sunExposition.partial = true : false
        })
    }
    let isAccessible
    accessible ? isAccessible = true : isAccessible = [true, false]

    debugger


    validateUserId(userId)

    // return Playground.find({
    //     'elements.type': {
    //         $in: elements
    //     }
    // }).lean().then(playgrounds => {
    //     console.log(playgrounds)
    // })

    return Promise.all([
        User.findById(userId).lean(),
        Playground.find({
            $and: [
                { 'visibility': 'public' },
                { 'elements.type': { $in: elements } },
                { 'sunExposition.shady': sunExposition.shady },
                { 'sunExposition.sunny': sunExposition.sunny },
                { 'sunExposition.partial': sunExposition.partial },
                { 'elements.age': { $lte: age } },
                { 'elements.accessibility': { $in: isAccessible } },
            ]
        }).lean(),
        // }).distinct('location.city').lean(),
        // }, '-_id -likes -images -__v -author -description -name   -location._id -location.street -location.type -elements -sunExposition -dateCreated -lastModify -visibility').lean(),
    ])
        .then(([user, playgrounds]) => {
            console.log(playgrounds)
            if (!user) new ExistenceError(`User with id ${userId} not found`)
            return playgrounds
        })
        .catch(error => {
            console.log(error)
        })
}