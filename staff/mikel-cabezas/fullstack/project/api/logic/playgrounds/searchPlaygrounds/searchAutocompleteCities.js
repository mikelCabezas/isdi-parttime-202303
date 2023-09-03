const { User, Playground } = require('../../../data/models')
const fetch = require('node-fetch');

const {
    validators: { validateId, validateToken, validateText },
    errors: { ExistenceError }
} = require('com');

/**
 * Searches for autocomplete cities using the Apple Maps API.
 * @param {Object} token - The user's access token.
 * @param {string} token.accessToken - The user's access token.
 * @param {string} userId - The ID of the user.
 * @param {string} city - The name of the city to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 * @throws {Error} - If there is an error with the API request.
 * @throws {ExistenceError} - If the user is not found.
 */

module.exports = async (token, userId, city) => {
    debugger
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)
    validateId(userId)
    validateText(city)
    const user = await User.findById(userId)
    if (!user) throw new ExistenceError(`user not found`)


    return fetch(`https://maps-api.apple.com/v1/searchAutocomplete?q=${city}&lang=es-ES`, {
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
            const { results } = mapsResponse
            return results
        })
        .catch(error => {
            throw error
        })



}
