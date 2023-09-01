module.exports = {
    registerUser: require('./registerUser'),
    searchUser: require('./searchUser'),
    validateUser: require('./validateUser'),
    forgotPassword: require('./forgotPassword'),
    recoverPassword: require('./recoverPassword'),
    setNewPassword: require('./setNewPassword'),
    // updatePassword: require('./updatePassword'),
    authenticateUser: require('./authenticateUser'),
    retrieveUser: require('./retrieveUser'),
    updateUserName: require('./updateUserName'),
    updateUserEmail: require('./updateUserEmail'),
    confirmNewEmail: require('./confirmNewEmail'),
    updateUserPassword: require('./updateUserPassword'),

    checkLoggedInUser: require('./checkLoggedInUser')
}