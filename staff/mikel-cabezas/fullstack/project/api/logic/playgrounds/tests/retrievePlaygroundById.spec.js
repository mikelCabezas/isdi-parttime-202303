const { expect } = require('chai')
const retrievePlaygroundById = require('../retrievePlaygroundById.js')
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')

describe('retrievePlaygroundById', () => {
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

        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: _user.password })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'blabla', state: 'blabla', street: 'bla bla', city: 'bla bla' } })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should return the playground with the given id', async () => {
        const result = await retrievePlaygroundById(user.id, playground.id)
        expect(result).to.have.property('name', _playground.name)
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'
            await retrievePlaygroundById(invalidID, playground.id)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`User with id 123456789101112131415123 not found`)
        }
    })

    it('should throw an ExistenceError if the playground does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            const result = await retrievePlaygroundById(user.id, invalidID)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`Playground with id 123456789101112131415123 not found`)
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            const result = await retrievePlaygroundById(123, playground.id)
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the userId is an empty string', async () => {
        try {
            const result = await retrievePlaygroundById('', playground.id)
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })

    it('should throw a TypeError if the playgroundId is not a string', async () => {
        try {
            const result = await retrievePlaygroundById(user.id, 123)
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the playgroundId is an empty string', async () => {
        try {
            const result = await retrievePlaygroundById(user.id, '')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })
})