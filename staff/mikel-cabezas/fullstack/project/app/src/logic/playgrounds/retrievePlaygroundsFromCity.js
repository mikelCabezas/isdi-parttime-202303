import { validators, utils } from '../../../com'
const { validateToken, validateText, validateId } = validators

export default (token, city) => {
    validateToken(token);
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/playgrounds/city/${city}`, {
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
