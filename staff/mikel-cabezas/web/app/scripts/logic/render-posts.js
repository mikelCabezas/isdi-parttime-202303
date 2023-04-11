import { homePage } from "../pages/home-page.js";
import { posts } from '../data.js'
import { cutText} from './max-characters.js'
import { getCurrentUser } from "./helpers/data-managers.js";



export function renderPosts(userID, userPosts, all) {

    const existentArticleElement = homePage.querySelector('.posts')
    
    existentArticleElement.innerHTML = ''
    if( posts.length >= 1) {
    
        let recentPostsFirst = posts.reverse()
    
        recentPostsFirst.forEach(article => {

            const day = article.date.getDate()
            const month = article.date.getMonth() + 1
            const year = article.date.getFullYear()
            const author = article.author
            const postsList = existentArticleElement

            const printImage = article.image
            const printText = article.text
            const printTitle = article.title
            const printAuthor = author
            const printDate = `${day}/${month}/${year}`

            getCurrentUser(userID)
 

            if(all) {
                const postContainer = document.createElement('article')
                postsList.appendChild(postContainer)
                postContainer.innerHTML = `
                        <img src="${article.image}" >
                        <h3 class="title">${article.title}</h3>
                        <p class="excerpt">${cutText(article.text, 35)}</p>
                        <div class="date-author">
                            <div class="post-author">
                                ${article.author}
                            </div>
                            <div class="post-date">
                                ${article.date.getDate()}/${article.date.getMonth() + 1}/${article.date.getFullYear()}
                            </div>
                        </div>
                   
                    `    
            }

            if(!userPosts && userID !== article.author && !all) {
                const postContainer = document.createElement('article')
                postsList.appendChild(postContainer)
                postContainer.innerHTML = `
                        <img src="${article.image}" >
                        <h3 class="title">${article.title}</h3>
                        <p class="excerpt">${cutText(article.text, 35)}</p>
                        <div class="date-author">
                            <div class="post-author">
                                ${article.author}
                            </div>
                            <div class="post-date">
                                ${article.date.getDate()}/${article.date.getMonth() + 1}/${article.date.getFullYear()}
                            </div>
                        </div>
                   
                    `    
            }
            if(userPosts && userID === article.author && !all) {
                const postContainer = document.createElement('article')
                postsList.appendChild(postContainer)
                postContainer.innerHTML = `
                        <img src="${article.image}" >
                        <h3 class="title">${article.title}</h3>
                        <p class="excerpt">${cutText(article.text, 35)}</p>
                        <div class="date-author">
                            <div class="post-author">
                                ${article.author}
                            </div>
                            <div class="post-date">
                                ${article.date.getDate()}/${article.date.getMonth() + 1}/${article.date.getFullYear()}
                            </div>
                        </div>
                   
                    `    
            }


            
        })
        recentPostsFirst = posts.reverse()
    }
}
