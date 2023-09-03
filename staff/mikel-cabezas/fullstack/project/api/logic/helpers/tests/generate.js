// const booleanRandom = Math.floor(Math.random() * 1)
// const boolean = booleanRandom === 0 ? false : true
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
        images: [`http://image-${Math.random()}.com`],
        visibility: 'public',
        location: {
            type: 'Point',
            city: `city-${Math.random()}`,
            street: `street-${Math.random()}`,
            state: `state-${Math.random()}`,
            country: `country-${Math.random()}`,
            coordinates: [41.216249999999974, 1.7312499999999886]
        },
        elements: [{
            type: `type-${Math.random()}`,
            age: Math.floor(Math.random() * 6) + 1,
            status: `status-${Math.random()}`,
            accessibility: false,
        },],
        sunExposition: {
            "shady": false,
            "sunny": false,
            "partial": false
        },
    }),
}