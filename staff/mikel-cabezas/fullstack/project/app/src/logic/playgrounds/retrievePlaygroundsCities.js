import { validators, utils } from '../../../com'
const { validateToken } = validators

export default (token, searchQuery) => {
    validateToken(token);
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/cities/${searchQuery}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status !== 200)
                return res.json().then(({ error: message }) => { throw new Error(message) })
            return res.json()
        })
}
