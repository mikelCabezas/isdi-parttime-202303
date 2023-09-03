const { expect } = require('chai');
const retrieveCitiesFromDatabase = require('../searchPlaygrounds/retrieveCitiesFromDatabase');
const { ExistenceError, ContentError, TypeError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')

describe('retrieveCitiesFromDatabase', () => {
    let user;
    let _user;
    let playground;
    let _playground;
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    });

    beforeEach(async () => {
        _user = generate.user()
        _playground = generate.playground()
        await cleanUp()

        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: _user.password })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'Spain', state: 'Barcelona', street: 'bla bla', city: 'Barcelona' } })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should return an array of cities when given valid input', async () => {
        const result = await retrieveCitiesFromDatabase(user.id, 'Barcelona');

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.equal('Barcelona');
    });



    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            await retrieveCitiesFromDatabase(invalidID, 'Barcelona')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        const invalidUserId = 123456789101112131415

        try {
            await retrieveCitiesFromDatabase(invalidUserId, 'Barcelona');
        } catch (error) {
            expect(error).to.be.an.instanceOf(Error);
            expect(error.message).to.equal('User is not a string');
        }
    });

    it('should throw a ContentError if the city is empty', async () => {
        const emptyCity = '';

        try {
            await retrieveCitiesFromDatabase(user.id, emptyCity);
        } catch (error) {
            expect(error).to.be.an.instanceOf(ContentError);
            expect(error.message).to.equal('Text is empty');
        }
    });
});