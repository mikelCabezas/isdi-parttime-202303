import { firebase } from '../../config/firebase.js'

export default async function uploadImages(imagesResized) {
    try {
        let urls
        const urlImagesFirebase = Promise.all(imagesResized.map(async (image, index) => {
            const response = await fetch(image.uri)
            const blob = await response.blob()
            const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1)
            const { ref } = await firebase.storage().ref().child(filename).put(blob)
            return await ref.getDownloadURL()
        }))
        const url = urlImagesFirebase.then(data => {
            console.log(data)
            return data
        })

        return url
    } catch (error) {
        console.log(error.message)
    }
}