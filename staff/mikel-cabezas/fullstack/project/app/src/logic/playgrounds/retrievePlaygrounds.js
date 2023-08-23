// import { validators } from "../../../com";
// const { validateToken } = validators

export default (token, userLocation) => {
    // validateToken(token);
    // alert(API_URL)

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/playgrounds/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userLocation })
    }).then(res => {

        if (res.status !== 200)
            return res.json().then(({ error: message }) => { throw new Error(message) })
        return res.json()
    })
}
