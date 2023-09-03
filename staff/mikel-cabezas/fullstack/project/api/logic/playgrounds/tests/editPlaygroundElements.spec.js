const { expect } = require('chai')
const editPlaygroundElements = require('../editPlayground/editPlaygroundElements.js')
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')

describe('editPlaygroundElements', () => {
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

    it('should return the edited playground', async () => {
        const result = await editPlaygroundElements(user.id, playground.id, { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        const retrievePlayground = await Playground.findById(playground.id).lean()

        expect(retrievePlayground.elements[0].type).to.equal('Slide')
        expect(retrievePlayground.elements[0].age).to.equal(1)
        expect(retrievePlayground.elements[0].status).to.equal('Good')
        expect(retrievePlayground.elements[0].accessibility).to.be.false
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'
            const result = await editPlaygroundElements(invalidID, playground.id, { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`User not found`)
        }
    })

    it('should throw an ExistenceError if the playground does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            const result = await editPlaygroundElements(user.id, invalidID, { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`Playground not found`)
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            const result = await editPlaygroundElements(123, playground.id, { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the userId is an empty string', async () => {
        try {
            const result = await editPlaygroundElements('', playground.id, { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })

    it('should throw a TypeError if the playgroundId is not a string', async () => {
        try {
            const result = await editPlaygroundElements(user.id, 123, { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the playgroundId is an empty string', async () => {
        try {
            const result = await editPlaygroundElements(user.id, '', { type: 'Slide', age: 1, status: 'Good', accessibility: false })
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })

    it('should throw a TypeError if the elements parameter is not an object', async () => {
        try {
            const result = await editPlaygroundElements(user.id, playground.id, 'invalid_elements')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('invalid_elements is not an object')
        }
    })
})