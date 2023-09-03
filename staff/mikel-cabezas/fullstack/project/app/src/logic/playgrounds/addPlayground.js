import { validators, utils } from '../../../com'
const { validateToken, validateText } = validators

export default function addPlayground(token, name, description, sunExposition, elements, images, location) {
    validateToken(token)
    validateText(name)
    validateText(description)
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/addPlayground`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, sunExposition, elements, images, location })
    }).then(res => {
        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        // return res.json()
    })
}
