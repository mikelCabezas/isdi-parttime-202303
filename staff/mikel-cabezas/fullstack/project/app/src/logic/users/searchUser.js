import { validators, utils } from '../../../com'
const { validateToken, validateText, validateId } = validators
export default (token) => {
    validateToken(token)
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/searchUser`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status !== 200)
                return res.json().then(({ error: message }) => { throw new Error(message) })
            // return res.json()
        })


}