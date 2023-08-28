import { validators } from '../../../com'
const { validatePassword, validateNewPassword, validateToken } = validators
export function updateNewPassword(token, newPassword) {
    validateToken(token)
    validatePassword(newPassword)

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/recoverPassword/setNewPassword/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
    })
        .then(res => {
            if (res.status !== 204)
                return res.json().then(({ error: message }) => { throw new Error(message) })
        })
}