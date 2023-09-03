import { validators, utils } from '../../../../com'
const { validateToken, validateText, validateId } = validators
// import { isTokenValid } from 'com/utils'


export default function editPlayGroundExposition(token, playgroundId, description) {
    validateToken(token)
    validateId(playgroundId)
    validateText(description)
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/editPlayground/description/${playgroundId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    }).then(res => {
        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        // return res.json()
    })
}
