import { validators, utils } from '../../../../com'
const { validateToken, validateText, validateId } = validators

export default function editPlayGroundExposition(token, playgroundId, images) {
    validateToken(token)
    validateId(playgroundId)
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/editPlayground/addImages/${playgroundId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ images })
    }).then(res => {
        debugger
        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        // return res.json()
    })
}
