const { expect } = require('chai')
const toggleLikePlayground = require('../toggleLikePlayground')
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('toggleLikePlayground', () => {
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

    it('should toggle the like status of a playground', async () => {
        const result = await toggleLikePlayground(user.id.toString(), playground.id)
        // console.log("🚀 ~ file: toggleLikePlayground.spec.js:37 ~ it ~ toggleLikePlayground:", toggleLikePlayground)
        const retrievePlayground = await Playground.find({ _id: playground.id }).lean()
        // console.log("🚀 ~ file: toggleLikePlayground.spec.js:39 ~ it ~ retrievePlayground:", retrievePlayground)

        expect(retrievePlayground.likes).to.include(user._id)
    })

    it('should toggle the like status of a playground', async () => {
        const result = await toggleLikePlayground(user.id, playground.id)
        const retrievePlayground = await Playground.find({ _id: playground.id }).lean()

        const result2 = await toggleLikePlayground(user.id, playground.id)
        const retrievePlayground2 = await Playground.findById(playground.id)

        expect(retrievePlayground2.likes).to.not.include(user.id)
    })

    it('should throw an ExistenceError if the playground does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            await toggleLikePlayground(user.id, invalidID)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('playground not found')
        }
    })
    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const invalidID = '123456789101112131415123'

            await toggleLikePlayground(invalidID, playground.id)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            await toggleLikePlayground(123, playground.id)
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('Id is not a string')
        }
    })



    it('should throw a TypeError if the postId is not a string', async () => {
        try {
            await toggleLikePlayground(user.id, 123)
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('Id is not a string')
        }
    })


})