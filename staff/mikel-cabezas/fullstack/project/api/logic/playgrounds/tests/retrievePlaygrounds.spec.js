const { expect } = require('chai')
const retrievePlaygrounds = require('../retrievePlaygrounds.js')
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

describe('retrievePlaygrounds', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    let _user
    let playground
    let _playground

    beforeEach(async () => {
        _user = generate.user()
        _playground = generate.playground()
        await cleanUp()

        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'blabla', state: 'blabla', street: 'bla bla', city: 'bla bla' } })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should return an array of playgrounds near the user', async () => {
        const result = await retrievePlaygrounds(user.id, { latitude: _playground.location.coordinates[0], longitude: _playground.location.coordinates[1] })
        expect(result).to.be.an('array')
        expect(result[0][0]).to.have.property('name', _playground.name)
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const result = await retrievePlaygrounds('123456789101112131415123', { latitude: _playground.location.coordinates[0], longitude: _playground.location.coordinates[1] })
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            const result = await retrievePlaygrounds(123, { latitude: _playground.location.coordinates[0], longitude: _playground.location.coordinates[1] })
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('User is not a string')
        }
    })

    it('should throw a ContentError if the userId is an empty string', async () => {
        try {
            const result = await retrievePlaygrounds('', { latitude: _playground.location.coordinates[0], longitude: _playground.location.coordinates[1] })
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('User is empty')
        }
    })
})