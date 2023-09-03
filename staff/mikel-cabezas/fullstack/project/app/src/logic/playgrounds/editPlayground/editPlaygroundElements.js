import { EXPO_PUBLIC_API_URL } from '@env'
import { validators } from '../../../../com'
const { validateToken, validateText, validateId } = validators

export default function editPlaygroundElements(token, playgroundId, elements) {
    validateToken(token)
    validateId(playgroundId)

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/editPlayground/elements/${playgroundId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ elements })
    }).then(res => {
        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        // return res.json()
    })
}
