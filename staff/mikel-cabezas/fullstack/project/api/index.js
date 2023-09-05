require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { serverStatus,
    registerUserHandler, retrieveUserHandler, authenticateUserHandler, forgotPasswordHandler, updateUserImageHandler, updateUserNameHandler, updateUserPasswordHandler, validateUserHandler, setNewPasswordHandler, recoverPasswordHandler, searchUserHandler, confirmNewUserEmailHandler, updateUserEmailHandler, checkLoggedInUserHandler,
    checkIfHasPlaygroundsNearHandler, addPlaygroundHandler, editPlaygroundSunExpositionHandler, editPlaygroundAddImagesHandler, editPlaygroundDescriptionHandler, editPlaygroundElementsHandler, retrieveCitiesFromDatabaseHandler, retrieveFromFilterHandler, retrieveCityFromSearchHandler, retrievePlaygroundsFromCityHandler, retrievePlaygroundsHandler, retrieveLikedPlaygroundsHandler, retrievePlaygroundByIdHandler, toggleLikePlaygroundHandler, searchAutocompleteCitiesHandler } = require('./handlers')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        const jsonBodyParser = bodyParser.json()
        const api = express()

        api.use(cors())

        api.get('/serverStatus', serverStatus)

        api.get('/user/status', checkLoggedInUserHandler)

        api.post('/user/register', jsonBodyParser, registerUserHandler)
        api.get('/user/searchUser', searchUserHandler)
        api.get('/user/validate/:token', validateUserHandler)

        api.get('/user/recoverPassword/:token', recoverPasswordHandler)
        api.post('/user/forgotPassword', jsonBodyParser, forgotPasswordHandler)
        api.patch('/user/recoverPassword/updatePassword/', jsonBodyParser, setNewPasswordHandler)

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
        api.get('/searchAutocomplete/:city', searchAutocompleteCitiesHandler)
        api.get('/city/:coordinates', retrieveCityFromSearchHandler)
        api.get('/playgrounds/filter/sunExposition=:sunExposition&age=:age&elements=:elements&accessible=:accessible&from=:from&distance=:distance', retrieveFromFilterHandler)
        api.get('/playgrounds/city/:city', retrievePlaygroundsFromCityHandler)

        api.post(`/addPlayground`, jsonBodyParser, addPlaygroundHandler)
        api.patch(`/editPlayground/elements/:playgroundId`, jsonBodyParser, editPlaygroundElementsHandler)
        api.patch(`/editPlayground/description/:playgroundId`, jsonBodyParser, editPlaygroundDescriptionHandler)
        api.patch(`/editPlayground/sunExposition/:playgroundId`, jsonBodyParser, editPlaygroundSunExpositionHandler)
        api.patch(`/editPlayground/addImages/:playgroundId`, jsonBodyParser, editPlaygroundAddImagesHandler)

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