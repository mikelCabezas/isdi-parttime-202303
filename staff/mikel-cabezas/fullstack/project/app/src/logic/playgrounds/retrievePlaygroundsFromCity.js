// import { validators } from "../../../com";
// const { validateToken } = validators
import { EXPO_PUBLIC_API_URL } from '@env'

export default (token, city) => {
    // validateToken(token);
    // alert(EXPO_PUBLIC_API_URL)
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
