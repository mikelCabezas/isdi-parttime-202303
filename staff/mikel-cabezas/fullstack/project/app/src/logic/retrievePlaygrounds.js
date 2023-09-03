import { validators, utils } from '../../com'
const { validateToken, validateText, validateId } = validators
import { API_URL } from '@env'

export default token => {
    validateToken(token);

    return fetch(`${API_URL}/playgrounds`, {
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
