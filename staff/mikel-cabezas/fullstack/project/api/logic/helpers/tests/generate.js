module.exports = {
    user: () => ({
        // _id: `id-${Math.random()}`,
        name: `name-${Math.random()}`,
        email: `email-${Math.random()}@mail.com`,
        password: `password-${Math.random()}`,
        favs: [],
        isValid: true,
        uniqueString: Math.floor(10000000 + Math.random() * 80000000).toString()
        // uniqueString: (Math.random() * 100000000).toFixed(0).toString()

    }),

    playground: () => ({
        // _id: `id-${Math.random()}`,
        name: `name-${Math.random()}`,
        description: `description-${Math.random()}`,
        images: [`image-${Math.random()}`],
        text: `text-${Math.random()}`,
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