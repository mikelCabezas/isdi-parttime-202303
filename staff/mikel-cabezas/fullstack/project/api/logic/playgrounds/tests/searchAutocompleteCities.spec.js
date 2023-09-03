const { expect } = require('chai')
const searchAutocompleteCities = require('../searchPlaygrounds/searchAutocompleteCities');
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('searchAutocompleteCities', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let _playground
    let user
    let _user
    let token
    let appleToken

    beforeEach(async () => {
        await cleanUp()

        _user = generate.user()
        _playground = generate.playground()

        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })

        const preAppleToken = process.env.AMK_API_KEY

        return fetch(`https://maps-api.apple.com/v1/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${preAppleToken}`,
            },
        })
            .then(res => appleToken = res.json(res))
            .then(token => appleToken = token)
    });

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should return an object with results property', async () => {
        const city = 'Vila';
        const response = await searchAutocompleteCities(appleToken, user.id, city);
        debugger
        expect(response).to.be.an('array');
    });

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await searchAutocompleteCities(process.env.AMK_API_KEY, user.id, 'test_city')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })

    it('should throw a TypeError if the userId is not valid', async () => {
        const invalidID = 123;
        debugger
        try {
            await searchAutocompleteCities(appleToken, invalidID, 'test_city');
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('Id is not a string');
        }
    });

    it('should throw an ExistenceError if the user does not exist', async () => {
        const invalidID = '123456789101112131415123'
        debugger
        try {
            await searchAutocompleteCities(appleToken, invalidID, 'test_city');
        } catch (error) {
            expect(error).to.be.an.instanceOf(ExistenceError);
            expect(error.message).to.equal('User not found');
        }
    });
});