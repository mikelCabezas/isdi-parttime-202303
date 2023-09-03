const { expect } = require('chai')
const checkIfHasPlaygroundsNear = require('../checkIfHasPlaygroundsNear.js')
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


describe('checkIfHasPlaygroundsNear', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    let _user
    let playground
    let _playground

    beforeEach(async () => {
        await cleanUp()
        _user = generate.user()
        _playground = generate.playground()

        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })

        playground = await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: _playground.location.coordinates, country: 'blabla', state: 'blabla', street: 'bla bla', city: 'bla bla' } })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should return true if there are no playgrounds near the user', async () => {
        const result = await checkIfHasPlaygroundsNear(user.id, [0, 0])
        expect(result).to.be.true
    })

    it('should throw an ExistenceError if there is a playground near the user', async () => {
        try {
            await Playground.create({ author: user.id, name: _playground.name, description: _playground.description, sunExposition: _playground.sunExposition, elements: _playground.elements, images: _playground.images, location: { type: 'Point', coordinates: [0, 0], country: 'blabla', state: 'blabla', street: 'bla bla', city: 'bla bla' } })
            await checkIfHasPlaygroundsNear(user.id, [0, 0])
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('New playgrounds cannot are near than 20 meters than other.')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            const result = await checkIfHasPlaygroundsNear(123, [0, 0])
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('User is not a string')
        }
    })

    it('should throw a ContentError if the userId is an empty string', async () => {
        try {
            const result = await checkIfHasPlaygroundsNear('', [0, 0])
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('User is empty')
        }
    })
})