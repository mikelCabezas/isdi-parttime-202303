module.exports = {
    registerUserHandler: require('./users/registerUserHandler'),
    searchUserHandler: require('./users/searchUserHandler'),
    validateUserHandler: require('./users/validateUserHandler'),
    forgotPasswordHandler: require('./users/forgotPasswordHandler'),
    recoverPasswordHandler: require('./users/recoverPasswordHandler'),
    setNewPasswordHandler: require('./users/setNewPasswordHandler'),
    retrieveUserHandler: require('./users/retrieveUserHandler'),
    authenticateUserHandler: require('./users/authenticateUserHandler'),
    updateUserNameHandler: require('./users/updateUserNameHandler'),
    updateUserEmailHandler: require('./users/updateUserEmailHandler'),
    updateUserImageHandler: require('./users/updateUserImageHandler'),
    updateUserPasswordHandler: require('./users/updateUserPasswordHandler'),

    checkIfHasPlaygroundsNearHandler: require('./playgrounds/checkIfHasPlaygroundsNearHandler'),
    addPlaygroundHandler: require('./playgrounds/addPlaygroundHandler'),
    editPlaygroundHandler: require('./playgrounds/editPlaygroundHandler'),
    deletePlaygroundostHandler: require('./playgrounds/deletePostHandler'),
    retrievePlaygroundsHandler: require('./playgrounds/retrievePlaygroundsHandler'),
    retrieveCitiesFromDatabaseHandler: require('./playgrounds/searchPlaygrounds/retrieveCitiesFromDatabaseHandler'),
    retrievePlaygroundsFromCityHandler: require('./playgrounds/searchPlaygrounds/retrievePlaygroundsFromCityHandler'),
    retrieveCityFromSearchHandler: require('./playgrounds/searchPlaygrounds/retrieveCityFromSearchHandler'),
    retrieveLikedPlaygroundsHandler: require('./playgrounds/retrieveLikedPlaygroundsHandler'),
    retrieveSavedPostsHandler: require('./playgrounds/retrieveSavedPostsHandler'),
    retrievePlaygroundByIdHandler: require('./playgrounds/retrievePlaygroundByIdHandler'),
    toggleLikePlaygroundHandler: require('./playgrounds/toggleLikePlaygroundHandler'),
    toggleSavePostHandler: require('./playgrounds/toggleSavePostHandler')
}