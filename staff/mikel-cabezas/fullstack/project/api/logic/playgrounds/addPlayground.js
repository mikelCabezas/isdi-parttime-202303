require('dotenv').config()
const fetch = require('node-fetch');

const { Playground } = require('../../data/models')
const context = require('../context')
const { validators: { validateUserId, validateText, validateToken, validateArray, validateURL }, errors: { ExistenceError, ContentError }
} = require('com')

/**
 * 
 * @param {string*} userId 
 * @param {string*} name 
 * @param {string*} description 
 * @param {string<Array>*} sunExposition
 * @param {string<Array>*} elements
 * @param {string<Array>*} images
 * @param {string*} location 
 * @returns {Promise<Object>} returns a promise object contains de new post 
 * 
 * @throws {TypeError} on non-string id, image, title and text (sync)
 * @throws {ContentError} on empty id, image, title or text  (sync)
 * @throws {FormatError} wrong format on image (sync)
 */

module.exports = async (token, userId, name, description, sunExposition, elements, images, location) => {
    validateUserId(userId)
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)


    validateText(name)
    validateText(description)
    validateArray(elements)
    validateArray(images)
    validateArray(location)
    images.map(image => validateURL(image))
    try {
        if (location.length !== 2) throw new ContentError('Invalid array length')
        const latitude = location[0]
        const longitude = location[1]
        const coordinates = [latitude, longitude]
        return Playground.find(
            {
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: location },
                        $maxDistance: 20
                    }
                }
            }
        )
            .then(playgrounds => {
                [coordinates, playgrounds]
                if (playgrounds.length > 0) throw new ExistenceError('New playgrounds cannot are near than 20 meters than other.')
                // if (playgrounds.length === 0) {
                return fetch(`https://maps-api.apple.com/v1/reverseGeocode?loc=${location}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token.accessToken}`,
                    },
                })
                    .then(res => {
                        if (res.status !== 200)
                            return res.json().then(({ error: message }) => { throw new Error(message.message) })

                        return res.json()
                    })
                    .then(mapsResponse => {
                        return Playground.create({
                            author: userId,
                            name: name,
                            description: description,
                            sunExposition: sunExposition,
                            elements: elements,
                            images: images,
                            visibility: 'public',
                            location: {
                                coordinates: location,
                                // dateCreated: Date.now,
                                city: mapsResponse.results[0].structuredAddress.locality,
                                street: mapsResponse.results[0].structuredAddress.fullThoroughfare,
                                state: mapsResponse.results[0].structuredAddress.administrativeArea,
                                country: mapsResponse.results[0].country
                            }
                        })
                    })
                    .then(playground => playground)
                // }
            })
    } catch (error) {
        throw error
    }
}