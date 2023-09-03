const { expect } = require('chai')
const validateUser = require('../validateUser.js')
const {
    validators: { validateName, validateEmail, validatePassword },
    errors: { DuplicityError, ContentError, FormatError, ExistenceError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('validateUser', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    let _user

    beforeEach(async () => {
        _user = generate.user()
        await cleanUp()

        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should validate the user and set isValid to true', async () => {
        await validateUser(user.uniqueString)
        const updatedUser = await User.findById(user.id)

        expect(updatedUser.isValid).to.be.true
    })

    it('should throw an error if the user does not exist', async () => {
        const invalidUniqueString = '12345678'

        try {
            await validateUser(invalidUniqueString)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw an error if the unique string is not a string', async () => {
        try {
            await validateUser(123)
        } catch (error) {
            expect(error).to.be.instanceOf(TypeError)
            expect(error.message).to.equal('uniqueString is not a string')
        }
    })

    it('should throw an error if the unique string is empty', async () => {
        try {
            await validateUser('')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('uniqueString is not valid')
        }
    })

    it('should throw an error if the unique string lenght is less than 8 characters', async () => {
        try {
            await validateUser('1234567')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('uniqueString is not valid')
        }
    })
})