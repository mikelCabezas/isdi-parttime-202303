import { EXPO_PUBLIC_API_URL } from '@env'

// import { validators, utils } from 'com'
// import { isTokenValid } from 'com/utils'

// const { isTokenValid } = utils
// const { validateToken, validateText } = validators

export default function editPlayGroundExposition(token, playgroundId, images) {
    // validateToken(token)
    // validateText(name)
    // validateText(description)
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/editPlayground/addImages/${playgroundId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ images })
    }).then(res => {
        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        // return res.json()
    })
}
