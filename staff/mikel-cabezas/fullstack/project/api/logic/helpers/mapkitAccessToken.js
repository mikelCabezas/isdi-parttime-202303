require('dotenv').config()
const fetch = require('node-fetch');
const { validators: { validateToken } } = require('com')

/**
 * Fetches a MapKit access token from Apple Maps API using the provided API key.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the access token.
 * @throws {Error} If the API request fails or returns an error.
 */

module.exports = () => {
    const token = process.env.AMK_API_KEY

    return fetch(`https://maps-api.apple.com/v1/token`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(res => {
            if (res.status !== 200) {
                return res.json().then(({ error: message }) => { throw new Error(message.message) })
            }
            return res.json()
        })
}