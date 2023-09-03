const { expect } = require('chai');
const retrieveCityFromSearch = require('../searchPlaygrounds/retrieveCityFromSearch');
const { ExistenceError, ContentError, TypeError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')
describe('retrieveCityFromSearch', () => {

    let appleToken;
    const city = 'Vilanova i la Geltrú';
    let user
    let _user
    let playground
    let _playground
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    });

    beforeEach(async () => {
        _user = generate.user()
        _playground = generate.playground()
        await cleanUp()

        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: _user.password })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'blabla', state: 'blabla', street: 'bla bla', city: 'Vilanova i la Geltrú' } })
        const preAppleToken = process.env.AMK_API_KEY;

        const response = await fetch(`https://maps-api.apple.com/v1/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${preAppleToken}`,
            },
        });
        appleToken = await response.json();
    })
    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })


    it('should return the city name when given a valid search string', async () => {
        const mockMapsResponse = [41.216249999999974, 1.7312499999999886]

        const result = await retrieveCityFromSearch(appleToken, user.id, city);
        expect(result).to.be.an('array');
        expect(result[0].location.coordinates).to.deep.equal(mockMapsResponse);
    });

    it('should throw an error when given an invalid search string', async () => {
        const mockMapsResponse = [41.216249999999974, 1.7312499999999886]

        try {
            const result = await retrieveCityFromSearch(appleToken, user.id, []);
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('Text is not a string');
        }
    });

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await retrieveCityFromSearch(process.env.AMK_API_KEY, user.id, 'test_city')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })
    it('should throw a TypeError if the userId is not a string', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await retrieveCityFromSearch(appleToken, [], 'test_city');
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('Id is not a string');
        }
    });

    it('should throw an ExistenceError if the user does not exist', async () => {
        const invalidID = '123456789101112131415123';

        try {
            await retrieveCityFromSearch(appleToken, invalidID, 'test_city');
        } catch (error) {
            expect(error).to.be.an.instanceOf(ExistenceError);
            expect(error.message).to.equal('user not found');
        }
    });
});