import { context } from "../ui"
import { editPost } from '../logic/posts/editPost'
import { useEffect, useState } from "react"
import retrievePostByPostId from "../logic/posts/retrievePostByPostId"

export function EditPostModal({ postId, onCancel, onPostUpdated }) {
    const userId = context.userId

    const [post, setPost] = useState({})

    let newImage
    useEffect(() => {
        try {
            retrievePostByPostId(userId, postId, (error, post) => {
                if (error) {
                    alert(error.message)

                    return
                }
                setPost(post)
            })
        } catch (error) {
            alert(error.message)
        }
    }, [post])

    function handleCancelEditPost(event) {
        event.preventDefault()
        onCancel()
    }
    function handleVisibility(event) {

    }
    function handleUpdateEditPost(event) {
        debugger
        event.preventDefault()
        const title = event.target.parentElement.parentElement.elements['title'].value
        const text = event.target.parentElement.parentElement.elements['text'].value
        const image = event.target.parentElement.parentElement.children['post-image'].src
        const visibility = event.target.parentElement.parentElement.elements.visibility.checked
        try {
            editPost(userId, postId, title, text, image, visibility, error => {
                if (error) {
                    alert(error.message)

                    return
                }
                onPostUpdated()
            })
        } catch (error) {
            alert(error.message)
        }

    }

    function handleConvertImageToBase64() {
        const file = document.querySelector('.edit-post input[type="file"]')
        const imagePostPreview = document.querySelector('.edit-post .post-image')
        const imageTarget = document.querySelector('.edit-post input[type="file"]')
        const printImage = file.onchange = function (event) {
            debugger
            const file = event.target.files[0]
            const image = new FileReader()
            image.onload = () => {
                const base64 = image.result
                newImage = base64
                imagePostPreview.src = base64
                imageTarget.src = base64
            }
            image.readAsDataURL(file)
            return file
        }
    }

    return <div className="overlay edit-post">
        <form className="edit-post">
            <input type="hidden" />

            <label htmlFor="checkbox" className="visibility">Visibility {post.visibility === 'public' && <input type="checkbox" className="visibility" name="visibility" defaultChecked id="" />}
                {post.visibility === 'private' && <input type="checkbox" className="visibility" name="visibility" id="" />} </label>

            {/* <label htmlFor="checkbox" className="visibility">Visibility <input type="checkbox" className="visibility" name="visibility" defaultChecked={post.visibility === 'public' ? 'true' : 'false'} id="" /></label> */}
            <label htmlFor="text">Edit title</label>
            <input type="text" className="title" name="title" defaultValue={post.title} />
            <img className="post-image" name="post-image" src={post.image} alt="" />
            <label htmlFor="file">Edit your image</label>
            <input className="new-image" type="file" name="file" id="" accept=".jpg, .jpeg, .png, .webp" onClick={handleConvertImageToBase64} />
            <label htmlFor="textarea">Edit your process</label>
            <textarea id="" cols="30" rows="5" name="text" defaultValue={post.text}></textarea>
            <div className="buttons">
                <button className="button--edit-post_cancel" type="cancel" onClick={handleCancelEditPost}>Cancel</button>
                <button className="button--edit-post_save" type="submit" onClick={handleUpdateEditPost}>Update post</button>
            </div>
        </form>
    </div>
}