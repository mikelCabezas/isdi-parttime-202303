const { expect } = require('chai')
const forgotPassword = require('../forgotPassword.js')
const {
    validators: { validateEmail },
    errors: { DuplicityError, FormatError, ExistenceError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sendNewPasswordEmail = require('../../helpers/sendNewPasswordEmail')

describe('forgotPassword', () => {
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

    it('should send a new password email', async () => {
        const email = user.email
        const emailSent = await forgotPassword(email)
        expect(emailSent).to.be.true
    })

    it('should throw an error if the email is invalid', async () => {
        try {
            const invalidEmail = 'invalidemail_example.com'
            await forgotPassword(invalidEmail)
        } catch (error) {
            expect(error).to.be.instanceOf(FormatError)
            expect(error.message).to.equal(`Invalid email format`)
        }
    })

    it('should throw an error if the email does not exist', async () => {
        try {
            const nonExistingEmail = 'nonexistingemail@example.com'
            await forgotPassword(nonExistingEmail)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`user not found`)
        }
    })
})