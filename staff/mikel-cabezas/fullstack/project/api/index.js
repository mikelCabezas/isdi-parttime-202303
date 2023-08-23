require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { serverStatusHandler,
    registerUserHandler, retrieveUserHandler, authenticateUserHandler, forgotPasswordHandler, updateUserImageHandler, updateUserNameHandler, updateUserPasswordHandler, validateUserHandler, setNewPasswordHandler, recoverPasswordHandler, searchUserHandler, confirmNewUserEmailHandler, updateUserEmailHandler, checkLoggedInUserHandler,
    checkIfHasPlaygroundsNearHandler, addPlaygroundHandler, retrieveCitiesFromDatabaseHandler, retrieveFromFilterHandler, retrieveCityFromSearchHandler, retrievePlaygroundsFromCityHandler, retrievePlaygroundsHandler, retrieveLikedPlaygroundsHandler, retrievePlaygroundByIdHandler, toggleLikePlaygroundHandler } = require('./handlers')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        const jsonBodyParser = bodyParser.json()
        const api = express()

        api.use(cors())

        api.get('/serverStatus', serverStatusHandler)

        api.get('/user/status', checkLoggedInUserHandler)

        api.post('/user/register', jsonBodyParser, registerUserHandler)
        api.get('/user/searchUser', searchUserHandler)
        api.get('/user/validate/:token', validateUserHandler)

        api.get('/user/recoverPassword/:token', recoverPasswordHandler)
        api.post('/user/forgotPassword', jsonBodyParser, forgotPasswordHandler)
        api.patch('/user/recoverPassword/setNewPassword/', jsonBodyParser, setNewPasswordHandler)

        api.post('/user/confirmUpdateEmail/', jsonBodyParser, confirmNewUserEmailHandler)
        api.get('/user/confirmUpdateEmail/updateEmail/:token/:email', updateUserEmailHandler)

        api.get('/users', retrieveUserHandler)
        api.post('/users/auth', jsonBodyParser, authenticateUserHandler)

        api.patch('/users/image', jsonBodyParser, updateUserImageHandler)
        api.patch('/user/username', jsonBodyParser, updateUserNameHandler)
        // api.patch('/users/email', jsonBodyParser, updateUserEmailHandler)
        api.patch('/user/password', jsonBodyParser, updateUserPasswordHandler)

        // api.get('/playgrounds', retrievePlaygroundsHandler)
        api.post('/playgrounds/', jsonBodyParser, retrievePlaygroundsHandler)
        api.post('/playgrounds/checkNear', jsonBodyParser, checkIfHasPlaygroundsNearHandler)
        api.get('/cities/:city', retrieveCitiesFromDatabaseHandler)
        api.get('/city/:coordinates', retrieveCityFromSearchHandler)
        api.get('/playgrounds/filter/age=:age&elements=:elements&accessible=:accessible&distance=:distance&sunExposition=:sunExposition', retrieveFromFilterHandler)
        api.get('/playgrounds/city/:city', retrievePlaygroundsFromCityHandler)

        api.post(`/addPlayground`, jsonBodyParser, addPlaygroundHandler)

        // api.patch(`/posts/update/:postId`, jsonBodyParser, editPostHandler)
        // api.delete(`/posts/:postId`, deletePostHandler)
        api.get('/user/likedPlaygrounds', retrieveLikedPlaygroundsHandler)
        // api.get('/playgrounds/saved', retrieveSavedPlaygroundsHandler)
        api.get('/playground/:playgroundId', retrievePlaygroundByIdHandler)
        api.patch('/playgrounds/:postId/likes', toggleLikePlaygroundHandler)
        // api.patch('/playgrounds/:postId/saves', toggleSavePlaygroundHandler)


        api.listen(`${process.env.PORT}`, () => console.log(`server running in port ${process.env.PORT}`))
        api.patch('/playgrounds/:postId/likes', toggleLikePlaygroundHandler)
    })
    // .finally(() => mongoose.disconnect())
    .catch(console.error)