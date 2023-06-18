require('dotenv').config()

const express = require('express')
const { jsonBodyParser, cors } = require('./utils')
const { helloApiController, registerUserController, retrieveUserController, authenticateUserController, updateUserImageController, updateUserNameController, updateUserEmailController, updateUserPasswordController, createPostController, editPostController, deletePostController, retrievePostsController } = require('./controllers')

const api = express()

api.use(cors)

api.post('/', helloApiController)
api.post('/users', jsonBodyParser, registerUserController)
api.get('/users', retrieveUserController)
api.post('/users/auth', jsonBodyParser, authenticateUserController)

api.patch('/users/image', jsonBodyParser, updateUserImageController)
api.patch('/users/username', jsonBodyParser, updateUserNameController)
api.patch('/users/email', jsonBodyParser, updateUserEmailController)
api.patch('/users/password', jsonBodyParser, updateUserPasswordController)

api.post('/posts', jsonBodyParser, createPostController)
api.patch('/posts', jsonBodyParser, editPostController)
api.delete('/posts', jsonBodyParser, deletePostController)
api.get('/posts', retrievePostsController)


api.listen(`${process.env.PORT}`, () => console.log(`server running in port ${process.env.PORT}`))