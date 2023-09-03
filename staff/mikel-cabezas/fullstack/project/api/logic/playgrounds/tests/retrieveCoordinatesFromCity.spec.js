const { expect } = require('chai')
const retrieveCoordinatesFromCity = require('../searchPlaygrounds/retrieveCoordinatesFromCity')
const { ExistenceError, ContentError, TypeError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')
describe('retrieveCoordinatesFromCity', () => {
    let appleToken
    let user
    let _user
    let playground
    let _playground
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)

        const preAppleToken = process.env.AMK_API_KEY

        const response = await fetch(`https://maps-api.apple.com/v1/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${preAppleToken}`,
            },
        })

        appleToken = await response.json()

        _user = generate.user()
        _playground = generate.playground()
        await cleanUp()

        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: _user.password })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'Spain', state: 'Barcelona', street: 'bla bla', city: 'Vilanova i la Geltrú' } })

    })

    it('should return an array with the expected latitude and longitude when given valid input', async () => {
        const city = 'Barcelona'
        const mockResponse = {
            results: [
                {
                    coordinate: {
                        latitude: 41.3826807,
                        longitude: 2.1770239,
                    },
                },
            ],
        }
        const result = await retrieveCoordinatesFromCity(appleToken, user.id, city)

        expect(result).to.be.an('array')
        expect(result[0]).to.equal(mockResponse.results[0].coordinate.latitude)
        expect(result[1]).to.equal(mockResponse.results[0].coordinate.longitude)
    })

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await retrieveCoordinatesFromCity(process.env.AMK_API_KEY, user.id, 'test_city')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        const city = 'Barcelona'

        try {
            await retrieveCoordinatesFromCity(appleToken, [], city)
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('Id is not a string');
        }
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            await retrieveCoordinatesFromCity(appleToken, invalidID, 'barcelona')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })
})