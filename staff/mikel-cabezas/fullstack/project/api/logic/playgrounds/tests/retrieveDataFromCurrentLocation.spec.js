const { expect } = require('chai');
const retrieveDataFromCurrentLocation = require('../searchPlaygrounds/retrieveDataFromCurrentLocation');
const { ExistenceError, ContentError, TypeError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')
describe('retrieveDataFromCurrentLocation', () => {
    let appleToken;
    const location = [41.228833, 1.725505];
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

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'blabla', state: 'blabla', street: 'bla bla', city: 'bla bla' } })
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
    it('should return an object with the expected properties when given valid input', async () => {

        const result = await retrieveDataFromCurrentLocation(appleToken, user.id, location);

        expect(result).to.be.an('object');
        expect(result).to.have.property('latitude', location[0]);
        expect(result).to.have.property('longitude', location[1]);
        // expect(result).to.have.property('city', mockResponse.results[0].structuredAddress.locality);
        // expect(result).to.have.property('street', mockResponse.results[0].structuredAddress.fullThoroughfare);
        // expect(result).to.have.property('state', mockResponse.results[0].structuredAddress.administrativeArea);
        // expect(result).to.have.property('country', mockResponse.results[0].country);
        expect(result).to.have.property('regionLatLon');
    });

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await retrieveDataFromCurrentLocation(process.env.AMK_API_KEY, user.id, location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await retrieveDataFromCurrentLocation(appleToken, [], location);
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('Id is not a string');
        }
    });

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            await retrieveDataFromCurrentLocation(appleToken, invalidID, location)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

});
