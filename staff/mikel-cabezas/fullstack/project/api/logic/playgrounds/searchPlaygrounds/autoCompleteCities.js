const fetch = require('node-fetch');
const { User } = require('../../../data/models')
const {
    validators: { validateUserId, validateToken, validateText },
    errors: { ExistenceError }
} = require('com')

/**
 * Searches for autocomplete cities using the Apple Maps API.
 * @param {Object} token - The user's access token.
 * @param {string} token.accessToken - The user's access token.
 * @param {string} userId - The ID of the user making the request.
 * @param {string} city - The city to search for.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the search results.
 * @throws {Error} - If the API request fails or the user is not found.
 */

module.exports = async (token, userId, city) => {
    token?.accessToken ? validateToken(token.accessToken) : validateToken(token)
    validateUserId(userId)
    validateText(city)

    const user = await User.findById(userId)
    if (!user) throw new ExistenceError('User not found')

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
            return { results }
        })
        .catch(error => {
            throw error
        })

}
