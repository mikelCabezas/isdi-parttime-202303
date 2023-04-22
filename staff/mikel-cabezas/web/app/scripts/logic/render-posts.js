import { homePage } from "../pages/home-page.js";
import {loginPage} from "../pages/login-page.js";
import { posts, savePosts, saveUsers, users } from '../data.js'
import { cutText} from './max-characters.js'
import { toggleOffClassInSection, context, deleteClassOnContainer, addClassOnContainer } from "../ui.js";
import {returnUserImage } from "./helpers/get-user-image.js";
// import {default as homePage} from "../pages/home-page.js";
import { getPostUserName, getPostUserImage, getUserImage, findUserById, getUserName } from "./helpers/data-managers.js"
import { imageToBase64 } from "../localImagesBase64.js";

export function renderPosts(userId) {
    deleteClassOnContainer(homePage, 'off')
    addClassOnContainer(loginPage, 'off')
    const existentArticleElement = homePage.querySelector('.posts')
    existentArticleElement.innerHTML = ''
    if( posts.length >= 1) {
        let recentPostsFirst = posts.toReversed()
        let currentPost
        recentPostsFirst.forEach(article => {
            const date = article.date
            const currentUser = findUserById(userId)

            const author = users.find(user => user.id === article.author)
            const authorID = users.find(user => user.id === article.author).id
            const postId = article.id

            const postsList = existentArticleElement
            const postContainer = document.createElement('article')

            postContainer.classList.add(postId)
            postsList.appendChild(postContainer)

                const postAuthor = document.createElement('div')
                postAuthor.classList.add('post-author')
                postContainer.appendChild(postAuthor)

                    const avatar = document.createElement('div')
                    avatar.classList.add('avatar')
                    postAuthor.appendChild(avatar)

                        const letter = document.createElement('div')
                        letter.classList.add('letter')
                        avatar.appendChild(letter)


                        const imageProfile = document.createElement('img')
                        imageProfile.classList.add('image-profile')
                        imageProfile.classList.add('hidden')
                        avatar.appendChild(imageProfile)


                    const userName = document.createElement('div')
                    userName.classList.add('user-name')
                    postAuthor.appendChild(userName)

                        const user = author.name
                        const userImage = getUserImage(author.id)
                        const separateUserName = user.split(' ')
                        userName.innerText = user
                        if (userImage) {
                            imageProfile.src = userImage
                            imageProfile.classList.remove('hidden')
                        }
                        if (!userImage && separateUserName.length === 1) {
                            letter.innerText = separateUserName[0][0] + separateUserName[0][1]
                        }
                        if (!userImage && separateUserName.length > 1) {
                            letter.innerText = separateUserName[0][0] + separateUserName[1][0]
                        }


                const postImage = document.createElement('img')
                postContainer.appendChild(postImage)
                postImage.src = article.image
                // imageToBase64(postImage, postImage.src)

                const titleAndInteractions = document.createElement('div')
                titleAndInteractions.classList.add('title-and-interactions')
                postContainer.appendChild(titleAndInteractions)
                const totalLikesPost = document.createElement('div')
                const postIdIndex = postId.slice(5)
                
                const postTitle = document.createElement('h3')
                postTitle.classList.add('title')
                postContainer.appendChild(postTitle)
                postContainer.appendChild(totalLikesPost)
                postTitle.innerText = article.title
                
                if (article.likes.length === 1) {
                    totalLikesPost.innerText = article.likes.length + ' like'
                }
                if (article.likes.length > 1) {
                    totalLikesPost.innerText = article.likes.length + ' likes'
                }

                const likePost = document.createElement('div')
                likePost.classList.add('material-symbols-outlined')

                const savePost = document.createElement('div')
                savePost.classList.add('material-symbols-outlined')

                likePost.classList.add('like')
                totalLikesPost.classList.add('total-likes-post')
                titleAndInteractions.appendChild(likePost)
                likePost.innerText = 'favorite'


                savePost.classList.add('save')
                titleAndInteractions.appendChild(savePost)
                savePost.innerText = 'bookmark'


                const isLikedPost = article.likes.find(user => user === userId)
                const findFavPost = currentUser.likedPosts.find(post => post === article.id)

                if(isLikedPost === userId) {
                    likePost.classList.add('filled')
                }
                if(findFavPost === article.id) {
                    savePost.classList.add('filled')
                }

                for(let i = 0; i < article.likes.length; i++) {
                    if(i < 6) {
                        const userId = article.likes[i]
                        const usersLikedPost = document.createElement('div')
                        usersLikedPost.classList.add('users-liked-post')
                        totalLikesPost.appendChild(usersLikedPost)
                        returnUserImage(usersLikedPost, userId)
                    }
                }

                totalLikesPost.onclick = () => {

                    const allUserLikesModal = document.createElement('div')
                    allUserLikesModal.classList.add('overlay')
                    postContainer.append(allUserLikesModal)
                    allUserLikesModal.classList.add('all-users-liked')
                    
                    const allUserLikesContainer = document.createElement('div')
                    allUserLikesContainer.classList.add('all-users-liked-container')
                    allUserLikesModal.append(allUserLikesContainer)

                    const title = document.createElement('h3')
                    title.classList.add('title')
                    allUserLikesContainer.append(title)
                    title.innerText = 'Users liked this post'

                    for(let i = 0; i < article.likes.length; i++) {
                        const userId = article.likes[i]
                        returnUserImage(allUserLikesContainer, userId, 'showName')
                    }


                    const close = document.createElement('button')
                    close.classList.add('close')
                    allUserLikesContainer.append(close)
                    close.innerText = 'Close'

                    close.onclick = (event) => {
                        event.preventDefault
                        allUserLikesModal.innerHTML = ''
                        addClassOnContainer(allUserLikesModal, 'off')
                    }

                }
    
                // article.likes.forEach(userId => {
                //     const usersLikedPost = document.createElement('div')
                //     usersLikedPost.classList.add('users-liked-post')
                //     totalLikesPost.appendChild(usersLikedPost)
                //     returnUserImage(usersLikedPost, userId)
                // })

                // users[0].likedPosts = []
                // users[1].likedPosts = []

                // article.likes = []
                // savePosts()
                // saveUsers()

                savePost.onclick = (event) => {
                    const currentUser = findUserById(userId)
                    const userLikedPosts = currentUser.likedPosts
                    const postId = article.id.slice(5)
                    const indexFavPost = currentUser.likedPosts.findIndex(post => post === article.id)
                    const findFavPost = currentUser.likedPosts.find(post => post === article.id)

                    if(savePost.classList.contains('filled')) {
                        savePost.classList.remove('filled')
                        currentUser.likedPosts.splice(indexFavPost, 1)
                    } else {
                        if(!findFavPost) {
                            savePost.classList.add('filled')
                            currentUser.likedPosts.push(article.id)
                        }
                    }
                    saveUsers()
                    savePosts()
                    renderPosts(userId)
                }



                likePost.onclick = (event) => {
                    const currentUser = findUserById(userId)
                    const userLikedPosts = currentUser.likedPosts
                    const postId = article.id.slice(5)
                    const indexFavPost = currentUser.likedPosts.findIndex(post => post === postId)
                    const indexLikedPost = article.likes.findIndex(user => user === userId)
                    // console.log(userId)
                    // console.log(indexLikedPost)
                    // console.log(article.likes)

                    if(likePost.classList.contains('filled')) {

                        likePost.classList.remove('filled')
                        article.likes.splice(indexLikedPost, 1)
                        if (article.likes.length === 0) {
                            totalLikesPost.innerText = ''
                        }
                        if (article.likes.length === 1) {
                            totalLikesPost.innerText = article.likes.length + ' like'
                        }
                        if (article.likes.length > 1) {
                            totalLikesPost.innerText = article.likes.length + ' likes'
                        }

                    } else {

                        likePost.classList.add('filled')
                        if (article.likes.length > 0) {
                            article.likes.push(userId)
                            totalLikesPost.innerText = article.likes.length + ' likes'
                        }
                        if (article.likes.length === 0) {
                            article.likes.push(userId)
                            totalLikesPost.innerText = article.likes.length + ' like'
                        }
    
                        if(isLikedPost !== postId) {
                            
                            currentUser.likedPosts.push(article.id)
                        }
                    }
                    saveUsers()
                    savePosts()
                    renderPosts(userId)
                }


                const postExcerpt = document.createElement('p')
                postExcerpt.classList.add('excerpt')
                postContainer.appendChild(postExcerpt)
                postExcerpt.innerText = cutText(article.text, 35)

                const postDate = document.createElement('time')
                postDate.classList.add('post-date')
                postContainer.appendChild(postDate)
                postDate.innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

                if(article.lastModify) {
                    const isEdited = document.createElement('div')
                    isEdited.classList.add('post-edited')
                    isEdited.innerText = '(Edited)'
                    postDate.appendChild(isEdited)

                }





            if(userId === authorID) {
                const editForm = document.querySelector('.section.home').querySelector('form.edit-post')
                const editButton = document.createElement('button')
                const editButtonIcon = document.createElement('i')
                editButtonIcon.classList.add('uil-pen')
                editButtonIcon.classList.add('uil')
                editButton.classList.add('edit')
                editButton.classList.add(postId)
                editButton.innerText = 'edit'
                postAuthor.appendChild(editButton)
                editButton.appendChild(editButtonIcon)
                editButton.onclick = (event) => {
                    const postId = event.target.classList.value.split(' ').pop()
                    toggleOffClassInSection(homePage.querySelector('.overlay.edit-post'))
                    const file = document.querySelector('.section.home').querySelector('form.edit-post input[name="file"]')
                    const postImage = document.querySelector('.section.home').querySelector('form.edit-post .post-image')
                    
                    const currentPost = postId.slice(5) - 1
                    const currentImage = posts[currentPost].image
                    postImage.src = currentImage
        
                    const postIdInput = document.querySelector(`form.edit-post input[type="hidden"]`)
                    postIdInput.classList.add(`${postId}`)
        
                    const postTitle = document.querySelector('.section.home').querySelector('form.edit-post .title')
                    const postText = document.querySelector('.section.home').querySelector('form.edit-post textarea')
        
                    
                    // imageToBase64(file, postImage.src)
                    
                    const printImage = file.onchange = function (event) {
                        const file = event.target.files[0]
                        const image = new FileReader()
                        image.onload = () => {
                            const base64 = image.result
                            postImage.src = base64
                        }
                        image.readAsDataURL(file)
                    }
                    postImage.src = posts[currentPost].image
                    postTitle.value = posts[currentPost].title
                    postText.value = posts[currentPost].text
                }
            }
        })
    }
}

