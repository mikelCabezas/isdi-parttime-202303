const { expect } = require('chai')
const retrieveLikedPlaygrounds = require('../retrieveLikedPlaygrounds.js')
const { ExistenceError, ContentError, TypeError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')

describe('retrieveLikedPlaygrounds', () => {
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

    it('should return an array of playgrounds liked by the user', async () => {
        playground.likes.push(user.id)
        await playground.updateOne({
            likes: playground.likes
        })
        const result = await retrieveLikedPlaygrounds(user.id)
        expect(result).to.be.an('array')
        expect(result[0]).to.have.property('name', _playground.name)
    })
    it('should return an empty array with 0 playgrounds liked by the user', async () => {

        const result = await retrieveLikedPlaygrounds(user.id)
        expect(result).to.be.an('array')
        expect(result).to.have.length(0)
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            const result = await retrieveLikedPlaygrounds(invalidID)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`user not found`)
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            const result = await retrieveLikedPlaygrounds(123)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the userId is an empty string', async () => {
        try {
            const result = await retrieveLikedPlaygrounds('')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })
})