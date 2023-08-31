const { expect } = require('chai')
const confirmNewEmail = require('../sendConfirmNewEmail.js');
const {
    validators: { validateEmail },
    errors: { DuplicityError, ExistenceError, FormatError, AuthError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

describe('confirmNewEmail', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    let _user

    let token
    let sendEmailCalled

    beforeEach(async () => {
        _user = generate.user()
        await cleanUp()



        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: true, uniqueString: _user.uniqueString, password: hashedPassword })

        const payload = { sub: user.uniqueString }
        const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should send a confirmation email with a valid token', async () => {
        const emailSent = await confirmNewEmail(user.name, user.email, token)
        expect(emailSent).to.be.true
    })

    it('should throw an error if the user ID is invalid', async () => {
        try {
            const invalidID = '123456789101112131415123'

            await confirmNewEmail(invalidID, 'newemail@example.com', 'invalidToken')
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('token is not valid')
        }
    })


})