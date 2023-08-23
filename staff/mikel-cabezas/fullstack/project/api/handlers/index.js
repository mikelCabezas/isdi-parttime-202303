module.exports = {
    serverStatusHandler: require('./helpers/serverStatusHandler'),

    registerUserHandler: require('./users/registerUserHandler'),
    searchUserHandler: require('./users/searchUserHandler'),
    validateUserHandler: require('./users/validateUserHandler'),
    forgotPasswordHandler: require('./users/forgotPasswordHandler'),
    recoverPasswordHandler: require('./users/recoverPasswordHandler'),
    setNewPasswordHandler: require('./users/setNewPasswordHandler'),
    updateUserPasswordHandler: require('./users/updateUserPasswordHandler'),
    retrieveUserHandler: require('./users/retrieveUserHandler'),
    authenticateUserHandler: require('./users/authenticateUserHandler'),
    updateUserNameHandler: require('./users/updateUserNameHandler'),
    confirmNewUserEmailHandler: require('./users/confirmNewUserEmailHandler'),
    updateUserEmailHandler: require('./users/updateUserEmailHandler'),
    updateUserImageHandler: require('./users/updateUserImageHandler'),

    checkLoggedInUserHandler: require('./users/checkLoggedInUserHandler'),

    checkIfHasPlaygroundsNearHandler: require('./playgrounds/checkIfHasPlaygroundsNearHandler'),
    addPlaygroundHandler: require('./playgrounds/addPlaygroundHandler'),
    editPlaygroundHandler: require('./playgrounds/editPlaygroundHandler'),
    deletePlaygroundostHandler: require('./playgrounds/deletePostHandler'),
    retrievePlaygroundsHandler: require('./playgrounds/retrievePlaygroundsHandler'),
    retrieveFromFilterHandler: require('./playgrounds/searchPlaygrounds/retrieveFromFilterHandler'),
    retrieveCitiesFromDatabaseHandler: require('./playgrounds/searchPlaygrounds/retrieveCitiesFromDatabaseHandler'),
    retrievePlaygroundsFromCityHandler: require('./playgrounds/searchPlaygrounds/retrievePlaygroundsFromCityHandler'),
    retrieveCityFromSearchHandler: require('./playgrounds/searchPlaygrounds/retrieveCityFromSearchHandler'),
    retrieveLikedPlaygroundsHandler: require('./playgrounds/retrieveLikedPlaygroundsHandler'),
    retrieveSavedPostsHandler: require('./playgrounds/retrieveSavedPostsHandler'),
    retrievePlaygroundByIdHandler: require('./playgrounds/retrievePlaygroundByIdHandler'),
    toggleLikePlaygroundHandler: require('./playgrounds/toggleLikePlaygroundHandler'),
    toggleSavePostHandler: require('./playgrounds/toggleSavePostHandler')
}