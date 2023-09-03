const { expect } = require('chai')
const editPlaygroundAddImages = require('../editPlayground/editPlaygroundAddImages.js')
const { ExistenceError, ContentError } = require('com').errors
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User, Playground } = require('../../../data/models.js')
const mongoose = require('mongoose')

describe('editPlaygroundAddImages', () => {
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
        const image1 = `http://image-${Math.random()}.com`
        const image2 = `http://image2-${Math.random()}.com`
        const newArrayImages = [playground.images[0], image1, image2]
        const result = await editPlaygroundAddImages(user.id, playground.id, [image1, image2])
        const retrievePlayground = await Playground.findById(playground.id).lean()

        expect(retrievePlayground.images).to.deep.equal(newArrayImages)
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            const image1 = `http://image-${Math.random()}.com`
            const image2 = `http://image2-${Math.random()}.com`
            const invalidID = '123456789101112131415123'
            const result = await editPlaygroundAddImages(invalidID, playground.id, [image1, image2])
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`User not found`)
        }
    })

    it('should throw an ExistenceError if the playground does not exist', async () => {
        try {
            const image1 = `http://image-${Math.random()}.com`
            const image2 = `http://image2-${Math.random()}.com`
            const invalidID = '123456789101112131415123'
            const result = await editPlaygroundAddImages(user.id, invalidID, [image1, image2])
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`Playground not found`)
        }
    })

    it('should throw a TypeError if the userId is not a string', async () => {
        try {
            const image1 = `http://image-${Math.random()}.com`
            const image2 = `http://image2-${Math.random()}.com`
            const result = await editPlaygroundAddImages(123, playground.id, [image1, image2])
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the userId is an empty string', async () => {
        try {
            const image1 = `http://image-${Math.random()}.com`
            const image2 = `http://image2-${Math.random()}.com`
            const result = await editPlaygroundAddImages('', playground.id, [image1, image2])
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })

    it('should throw a TypeError if the playgroundId is not a string', async () => {
        try {
            const image1 = `http://image-${Math.random()}.com`
            const image2 = `http://image2-${Math.random()}.com`
            const result = await editPlaygroundAddImages(user.id, 123, [image1, image2])
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Id is not a string')
        }
    })

    it('should throw a ContentError if the playgroundId is an empty string', async () => {
        try {
            const image1 = `http://image-${Math.random()}.com`
            const image2 = `http://image2-${Math.random()}.com`
            const result = await editPlaygroundAddImages(user.id, '', [image1, image2])
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Id is empty')
        }
    })

    it('should throw a TypeError if the images parameter is not an array', async () => {
        try {
            const result = await editPlaygroundAddImages(user.id, playground.id, 'invalid_images')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('array is not an array')
        }
    })
})