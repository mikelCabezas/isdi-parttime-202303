import { validators, utils } from '../../../../com'
const { validateToken, validateText, validateId } = validators

export default function editPlayGroundExposition(token, playgroundId, sunExposition) {
    validateToken(token)
    validateId(playgroundId)
    validateText(description)

    console.log(process.env.EXPO_PUBLIC_API_URL)

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/editPlayground/sunExposition/${playgroundId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sunExposition })
    }).then(res => {
        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        // return res.json()
    })
}
