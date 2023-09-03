const { expect } = require('chai');
const retrievePlaygroundsFromCity = require('../searchPlaygrounds/retrievePlaygroundsFromCity');
const { ExistenceError } = require('com').errors;
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

describe('retrievePlaygroundsFromCity', () => {
    let appleToken;
    let user
    let _user
    let playground
    let _playground

    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`);

        const preAppleToken = process.env.AMK_API_KEY;

        const response = await fetch(`https://maps-api.apple.com/v1/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${preAppleToken}`,
            },
        });

        appleToken = await response.json();

        _user = generate.user()
        _playground = generate.playground()
        await cleanUp()

        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: _user.password })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'Spain', state: 'Barcelona', street: 'bla bla', city: 'Vilanova i la Geltrú' } })

    });

    after(async () => {
        await cleanUp();
        await mongoose.disconnect();
    });

    it('should return an array of playgrounds when given valid input', async () => {
        const city = 'Vilanova i la Geltrú';
        const response = await retrievePlaygroundsFromCity(appleToken, user.id, city);

        expect(response).to.be.an('array');
        expect(response[0]).to.be.an('array');
        expect(response[0][0]).to.be.a('number');
        expect(response[0][1]).to.be.a('number');
        expect(response[1]).to.be.an('array');
        expect(response[1][0]).to.be.an('array');
        expect(response[1][0][0]).to.have.property('name');
        expect(response[1][0][0]).to.have.property('description');
        expect(response[1][0][0]).to.have.property('sunExposition');
        expect(response[1][0][0]).to.have.property('elements');
        expect(response[1][0][0]).to.have.property('images');
        expect(response[1][0][0]).to.have.property('location');
    });

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await retrievePlaygroundsFromCity(process.env.AMK_API_KEY, user.id, 'test_city')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await retrievePlaygroundsFromCity(appleToken, [], 'test_city');
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('Id is not a string');
        }
    });

    it('should throw an ExistenceError if the user does not exist', async () => {
        const invalidID = '123456789101112131415123';

        try {
            await retrievePlaygroundsFromCity(appleToken, invalidID, 'test_city');
        } catch (error) {
            expect(error).to.be.an.instanceOf(ExistenceError);
            expect(error.message).to.equal('user not found');
        }
    });
});