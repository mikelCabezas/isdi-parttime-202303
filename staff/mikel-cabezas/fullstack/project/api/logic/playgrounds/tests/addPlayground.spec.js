const { expect } = require('chai')
const addPlayground = require('../addPlayground.js')
const {
    validators: { validateUserId, validateText },
    errors: { ExistenceError, ContentError, FormatError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/')
const { User, Playground } = require('../../../data/models')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

describe('addPlayground', () => {
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

        const payload = { sub: user.id }
        const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })

        const preAppleToken = process.env.AMK_API_KEY

        return fetch(`https://maps-api.apple.com/v1/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${preAppleToken}`,
            },
        })
            .then(res => appleToken = res.json(res))
            .then(token => appleToken = token)
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should add a new playground', async () => {
        const newPlayground = await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location.coordinates)
        const playground = await Playground.findById(newPlayground.id).lean()

        expect(playground).to.not.be.null
        expect(playground.author.toString()).to.equal(user.id)
        expect(playground.name).to.equal(_playground.name)
        expect(playground.description).to.equal(_playground.description)
        expect(playground.sunExposition).to.deep.equal(_playground.sunExposition)
        expect(playground.elements.type).to.deep.equal(_playground.elements.type)
        expect(playground.elements.age).to.deep.equal(_playground.elements.age)
        expect(playground.elements.status).to.deep.equal(_playground.elements.status)
        expect(playground.elements.accessibility).to.deep.equal(_playground.elements.accessibility)
        expect(playground.images).to.deep.equal(_playground.images)
        expect(playground.location).to.not.be.null
        expect(playground.location.type).to.be.a('string')
        expect(playground.location.street).to.be.a('string')
        expect(playground.location.state).to.be.a('string')
        expect(playground.location.country).to.be.a('string')
        expect(playground.location.city).to.be.a('string')
        expect(playground.location.coordinates).to.be.an('array')
        expect(playground.location.coordinates).to.have.length(2)
        expect(playground.location._id).to.not.be.null
        expect(playground.location._id).to.be.an('object')

    })

    it('should throw a TypeError if the user is not a string', async () => {
        try {

            await addPlayground(appleToken, 123, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('User is not a string')
        }
    })
    it('should throw a TypeError if the token is not a string', async () => {
        try {

            await addPlayground(123, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('token is not a string')
        }
    })

    it('should throw a TypeError if the name is not a string', async () => {
        try {
            await addPlayground(appleToken, user.id, [], _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Text is not a string')
        }
    })

    it('should throw a ContentError if the name is empty', async () => {
        try {
            await addPlayground(appleToken, user.id, '', _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Text is empty')
        }
    })

    it('should throw a TypeError if the description is not a string', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, 123, _playground.sunExposition, _playground.elements, _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Text is not a string')
        }
    })

    it('should throw a ContentError if the description is empty', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, '', _playground.sunExposition, _playground.elements, _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Text is empty')
        }
    })

    it('should throw Error if the sunExposition is not an array', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, 'sunExposition', _playground.elements, _playground.images, _playground.location)
        } catch (error) {

            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('array is not an array')
        }
    })

    it('should throw Error if the elements is not an array', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, 'elements', _playground.images, _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('array is not an array')
        }
    })

    it('should throw Error if the images is not an array', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, 'images', _playground.location)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('array is not an array')
        }
    })

    it('should throw Error if the location is not an array', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, 'location')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('array is not an array')
        }
    })
    it('should throw Error if the location doen not have 2 elements', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, ['location'])
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Invalid array length')
        }
    })

    it('should throw a FormatError if the images array contains an invalid URL', async () => {
        try {
            const invalidImage = 'invalid_image_url'
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, [invalidImage, invalidImage], _playground.location.coordinates)
        } catch (error) {
            expect(error).to.be.instanceOf(FormatError)
            expect(error.message).to.equal('Invalid url format')
        }
    })

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await addPlayground(process.env.AMK_API_KEY, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location.coordinates)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })
    it('should throw an Error if wants to create one playground near 20 meters', async () => {
        try {
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location.coordinates)
            await addPlayground(appleToken, user.id, _playground.name, _playground.description, _playground.sunExposition, _playground.elements, _playground.images, _playground.location.coordinates)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('New playgrounds cannot are near than 20 meters than other.')
        }
    })
})