
export default function serverStatus() {
    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/serverStatus`, { method: 'GET' })
        .then(res => {
            if (!res || res?.status !== 200) {
                return 'Server is down'
            }
            // alert('Server up')
            return res.status
        })
}