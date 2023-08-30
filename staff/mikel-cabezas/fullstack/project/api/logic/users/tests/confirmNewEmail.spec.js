const { expect } = require('chai')
const confirmNewEmail = require('../confirmNewEmail.js');
const {
    validators: { validateEmail },
    errors: { DuplicityError }
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
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })
        const payload = { sub: user.uniqueString }
        const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })


    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should send a confirmation email with a valid token', async () => {
        await confirmNewEmail(user._id, 'newemail@example.com')

        expect(confirmNewEmail).to.be.true
    })


    it('should throw an error if the user does not exist', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await confirmNewEmail(invalidID, 'newemail@example.com')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw an error if the new email is already in use', async () => {
        const existingUser = generate.user()
        const hashedPassword = await bcrypt.hash(existingUser.password, 10)
        const newEmail = 'newemail@example.com'
        const newUser = User.create({ ...existingUser, email: newEmail, password: hashedPassword })

        try {
            await confirmNewEmail(user._id, 'newemail@example.com')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.equal(`This user with email ${newEmail} already exists`)
        }
    })

    it('should throw an error if the new email is invalid', () => {
        expect(() => confirmNewEmail(user._id, 'invalidemail')).to.throw(Error, 'Invalid email format')
    })
})