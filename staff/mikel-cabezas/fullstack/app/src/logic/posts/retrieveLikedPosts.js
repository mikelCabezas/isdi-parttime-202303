import { validators } from "com";
const { validateToken } = validators

export default function retrieveLikedPosts(token) {
    validateToken(token);

    return fetch(`${import.meta.env.VITE_API_URL}/posts/liked`, {
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
