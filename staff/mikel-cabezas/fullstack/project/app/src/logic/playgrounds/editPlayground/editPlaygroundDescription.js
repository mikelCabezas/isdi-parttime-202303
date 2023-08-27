import { EXPO_PUBLIC_API_URL } from '@env'

// import { validators, utils } from 'com'
// import { isTokenValid } from 'com/utils'

// const { isTokenValid } = utils
// const { validateToken, validateText } = validators

export default function editPlayGroundExposition(token, playgroundId, description) {
    // validateToken(token)
    // validateText(name)
    // validateText(description)
    console.log(process.env.EXPO_PUBLIC_API_URL)

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
