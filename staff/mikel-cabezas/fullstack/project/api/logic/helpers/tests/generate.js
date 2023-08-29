module.exports = {
    user: () => ({
        // _id: `id-${Math.random()}`,
        name: `name-${Math.random()}`,
        email: `email-${Math.random()}@mail.com`,
        password: `password-${Math.random()}`,
        favs: [],
        isValid: true,
        uniqueString: Math.random().toFixed(8) * 100000000,
    }),

    playground: (userId) => ({
        _id: `id-${Math.random()}`,
        author: user._id,
        name: `name-${Math.random()}`,
        description: `description-${Math.random()}`,
        images: `[image-${Math.random()}]`,
        text: `text-${Math.random()}`,
        dateCreated: Date.now,
        lastModify: Date.now,
        likes: [],
        visibility: 'public',
        location: {
            type: 'Point',
            city: `city-${Math.random()}`,
            street: `street-${Math.random()}`,
            state: `state-${Math.random()}`,
            country: `country-${Math.random()}`,
            coordinates: [Math.random(), Math.random()]
        },
        elements: [{
            type: `type-${Math.random()}`,
            age: `age-${Math.random()}`,
            status: `status-${Math.random()}`,
            accessibility: `accessibility-${Math.random()}`,
        },]
    }),
}