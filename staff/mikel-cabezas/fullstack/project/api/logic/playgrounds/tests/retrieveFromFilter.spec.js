const { expect } = require('chai')
const retrieveFromFilter = require('../searchPlaygrounds/retrieveFromFilter')
const { ExistenceError, ContentError, TypeError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')

describe('retrieveFromFilter', () => {
    let user
    let playground
    const sunExpositionFilter = 'false, false, false'
    const age = 6
    const elements = 'Slide, swing'
    const accessible = 'false'
    const from = {
        latitude: 41.228833,
        longitude: 1.725505
    }
    const distance = 10

    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    beforeEach(async () => {
        await cleanUp()

        user = await User.create({ name: 'Peter Pan', email: 'peter@pan.com', favs: [], isValid: true, uniqueString: '12345678', password: 'password' })

        playground = await Playground.create({
            author: user.id,
            name: 'Playground 1',
            description: 'A playground',
            sunExposition: {
                shady: false,
                sunny: false,
                partial: false,
            },
            elements: [
                {
                    type: 'Slide',
                    age: 1,
                    status: 'Good',
                    accessibility: true,
                },
                {
                    type: 'Swing',
                    age: 1,
                    status: 'Good',
                    accessibility: true,
                },
            ],
            images: ['https://image.sample.com/sample.img'],
            location: {
                type: 'Point',
                coordinates: [41.228833, 1.725505],
                country: 'Spain',
                state: 'Catalunya',
                street: 'Carrer de la Monja que caminava pel cel',
                city: 'Els monjos',
            },
            visibility: 'public',
        })
        await Playground.create({
            author: user.id,
            name: 'Playground 2',
            description: 'A playground num 2',
            sunExposition: {
                shady: true,
                sunny: false,
                partial: true,
            },
            elements: [
                {
                    type: 'Double Swing',
                    age: 1,
                    status: 'Good',
                    accessibility: false,
                },
                {
                    type: 'Climber',
                    age: 2,
                    status: 'Good',
                    accessibility: false,
                },
            ],
            images: ['https://image.sample.com/sample.img'],
            location: {
                type: 'Point',
                coordinates: [41.228833, 1.725505],
                country: 'Spain',
                state: 'Catalunya',
                street: 'Carrer de la Marina',
                city: 'Barcelona',
            },
            visibility: 'public',
        })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should return an array with the expected properties when given valid input', async () => {
        const result = await retrieveFromFilter(user.id, sunExpositionFilter.toString(), age, elements.toString(), accessible, from, distance)
        expect(result).to.be.an('array')
        expect(result[0]).to.deep.equal([from.latitude, from.longitude])
        expect(result[1]).to.be.an('array')
        expect(result[1][0][0]).to.have.property('name', playground.name)
        expect(result[1][0][0]).to.have.property('description', playground.description)
        expect(result[1][0][0]).to.have.property('sunExposition')
        expect(result[1][0][0].sunExposition).to.have.property('shady', playground.sunExposition.shady)
        expect(result[1][0][0].sunExposition).to.have.property('sunny', playground.sunExposition.sunny)
        expect(result[1][0][0].sunExposition).to.have.property('partial', playground.sunExposition.partial)
        expect(result[1][0][0]).to.have.property('elements')
        expect(result[1][0][0].elements).to.be.an('array')
        expect(result[1][0][0].elements[0]).to.have.property('type', playground.elements[0].type)
        expect(result[1][0][0].elements[0]).to.have.property('age', playground.elements[0].age)
        expect(result[1][0][0].elements[0]).to.have.property('accessibility', playground.elements[0].accessibility)
        expect(result[1][0][0].elements[1]).to.have.property('type', playground.elements[1].type)
        expect(result[1][0][0].elements[1]).to.have.property('age', playground.elements[1].age)
        expect(result[1][0][0].elements[1]).to.have.property('accessibility', playground.elements[1].accessibility)
        expect(result[1][0][0]).to.have.property('images')
        expect(result[1][0][0].images).to.be.an('array')
        expect(result[1][0][0]).to.have.property('location')
        expect(result[1][0][0].location).to.have.property('type', playground.location.type)
        expect(result[1][0][0].location).to.have.property('coordinates')
        expect(result[1][0][0].location.coordinates).to.deep.equal(playground.location.coordinates)
        expect(result[1][0][0].location).to.have.property('country', playground.location.country)
        expect(result[1][0][0].location).to.have.property('state', playground.location.state)
        expect(result[1][0][0].location).to.have.property('street', playground.location.street)
        expect(result[1][0][0].location).to.have.property('city', playground.location.city)
        expect(result[1][0][0]).to.have.property('visibility', playground.visibility)
    })
    it('should return an array with the expected properties when given valid input without elements', async () => {
        const result = await retrieveFromFilter(user.id, sunExpositionFilter.toString(), age, 'null', accessible, from, distance)
        expect(result).to.be.an('array')
        expect(result[0]).to.deep.equal([from.latitude, from.longitude])
        expect(result[1]).to.be.an('array')
        expect(result[1][0][0]).to.have.property('name', playground.name)
        expect(result[1][0][0]).to.have.property('description', playground.description)
        expect(result[1][0][0]).to.have.property('sunExposition')
        expect(result[1][0][0].sunExposition).to.have.property('shady', playground.sunExposition.shady)
        expect(result[1][0][0].sunExposition).to.have.property('sunny', playground.sunExposition.sunny)
        expect(result[1][0][0].sunExposition).to.have.property('partial', playground.sunExposition.partial)
        expect(result[1][0][0].elements).to.be.an('array')
        expect(result[1][0][0].elements[0]).to.have.property('type', playground.elements[0].type)
        expect(result[1][0][0].elements[0]).to.have.property('age', playground.elements[0].age)
        expect(result[1][0][0].elements[0]).to.have.property('accessibility', playground.elements[0].accessibility)
        expect(result[1][0][0].elements[1]).to.have.property('type', playground.elements[1].type)
        expect(result[1][0][0].elements[1]).to.have.property('age', playground.elements[1].age)
        expect(result[1][0][0].elements[1]).to.have.property('accessibility', playground.elements[1].accessibility)
        expect(result[1][0][0]).to.have.property('images')
        expect(result[1][0][0].images).to.be.an('array')
        expect(result[1][0][0]).to.have.property('location')
        expect(result[1][0][0].location).to.have.property('type', playground.location.type)
        expect(result[1][0][0].location).to.have.property('coordinates')
        expect(result[1][0][0].location.coordinates).to.deep.equal(playground.location.coordinates)
        expect(result[1][0][0].location).to.have.property('country', playground.location.country)
        expect(result[1][0][0].location).to.have.property('state', playground.location.state)
        expect(result[1][0][0].location).to.have.property('street', playground.location.street)
        expect(result[1][0][0].location).to.have.property('city', playground.location.city)
        expect(result[1][0][0]).to.have.property('visibility', playground.visibility)
    })
    it('should return an array with the expected properties when given valid input with accessible elements', async () => {
        const result = await retrieveFromFilter(user.id, sunExpositionFilter.toString(), age, 'null', 'true', from, 20)
        expect(result).to.be.an('array')
        expect(result[1][0][0].elements[1]).to.have.property('accessibility', true)
    })

    it('should return an array with the expected properties when given valid input with false sunExposition', async () => {
        const result = await retrieveFromFilter(user.id, sunExpositionFilter.toString(), age, 'null', 'true', from, 20)
        expect(result).to.be.an('array')
        expect(result[0]).to.deep.equal([from.latitude, from.longitude])
        expect(result[1]).to.be.an('array')
        expect(result[1][0][0]).to.have.property('name', playground.name)
        expect(result[1][0][0]).to.have.property('description', playground.description)
        expect(result[1][0][0]).to.have.property('sunExposition')
        expect(result[1][0][0].sunExposition).to.have.property('shady', false)
        expect(result[1][0][0].sunExposition).to.have.property('sunny', false)
        expect(result[1][0][0].sunExposition).to.have.property('partial', false)
    })

    it('should throw an ExistenceError if the user is not found', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await retrieveFromFilter(invalidID, sunExpositionFilter, age, elements, accessible, from, distance)
        } catch (error) {
            debugger
            expect(error).to.be.an.instanceOf(ExistenceError)
            expect(error.message).to.equal(`User not found`)
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        const invalidUserId = 123456789

        try {
            await retrieveFromFilter(invalidUserId, sunExpositionFilter, age, elements, accessible, from, distance)
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error)
            expect(error.message).to.equal('Id is not a string')
        }
    })


    it('should throw a ContentError if the userId is empty', async () => {
        const invalidUserId = ''

        try {
            await retrieveFromFilter(invalidUserId, sunExpositionFilter, age, elements, accessible, from, distance)
        } catch (error) {
            expect(error).to.be.an.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })
})