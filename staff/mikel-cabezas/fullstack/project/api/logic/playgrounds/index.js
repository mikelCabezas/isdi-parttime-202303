module.exports = {
    retrievePlaygrounds: require('./retrievePlaygrounds'),
    searchAutocompleteCities: require('./searchPlaygrounds/searchAutocompleteCities'),
    retrieveDataFromCurrentLocation: require('./searchPlaygrounds/retrieveDataFromCurrentLocation'),
    retrievePlaygroundsFromCity: require('./searchPlaygrounds/retrievePlaygroundsFromCity'),
    retrieveCoordinatesFromCity: require('./searchPlaygrounds/retrieveCoordinatesFromCity'),
    retrieveFromFilter: require('./searchPlaygrounds/retrieveFromFilter'),
    retrieveCitiesFromDatabase: require('./searchPlaygrounds/retrieveCitiesFromDatabase'),
    retrieveCityFromSearch: require('./searchPlaygrounds/retrieveCityFromSearch'),
    checkIfHasPlaygroundsNear: require('./checkIfHasPlaygroundsNear'),
    addPlayground: require('./addPlayground'),
    editPost: require('./editPost'),
    deletePost: require('./deletePost'),
    retrieveLikedPlaygrounds: require('./retrieveLikedPlaygrounds'),
    retrieveSavedPosts: require('./retrieveSavedPosts'),
    retrievePlaygroundById: require('./retrievePlaygroundById'),
    toggleLikePlayground: require('./toggleLikePlayground'),
    toggleSavePost: require('./toggleSavePost')
}