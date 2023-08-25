// import { validators } from "../../../com";
// const { validateToken } = validators
import { EXPO_PUBLIC_API_URL } from '@env'

export default (token, word) => {
    // validateToken(token);
    // alert(API_URL)
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/searchAutocomplete/${word}&limitToCountries=ES&lang=es-ES`, {
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
