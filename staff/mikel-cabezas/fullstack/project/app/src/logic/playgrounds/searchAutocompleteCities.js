import { validators, utils } from '../../../com'
const { validateToken, validateText, validateId } = validators

export default (token, word) => {
    validateToken(token);
    validateText(word)
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
