const { expect } = require('chai')
const updateUserEmail = require('../updateUserEmail.js')
const {
    validators: { validateId, validateEmail },
    errors: { ExistenceError, DuplicityError, AuthError, FormatError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

describe('updateUserEmail', () => {
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

    it('should update the user email with a valid new email', async () => {
        const payload = { sub: user.uniqueString }
        const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })

        const newEmail = 'newemail@example.com'

        await updateUserEmail(`token=${token}`, `newEmail=${newEmail}`)

        const updatedUser = await User.findOne({ uniqueString: user.uniqueString })
        expect(updatedUser.email).to.equal(newEmail)
    })

    it('should throw an error if the user is not verified', async () => {
        try {

            const updatedUser = await user.updateOne({ isValid: false })
            const payload = { sub: updatedUser.uniqueString }
            const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })
            console.log(token)
            await updateUserEmail(`token=${token}`, `newemail@example.com`)
        } catch (error) {
            expect(error).to.be.instanceOf(AuthError)
            expect(error.message).to.equal('Account not verified. Please check your email')
        }
    })

    it('should throw an error if the user does not exist', async () => {
        try {
            const invalidUniqueString = '12345678'
            const payload = { sub: invalidUniqueString }
            const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })

            await updateUserEmail(`token=${token}`, `newemail@example.com`)
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
        const token = jwt.sign({ sub: user.uniqueString }, process.env.JWT_SECRET)

        try {
            await updateUserEmail(`token=${token}`, `newEmail=${newEmail}`)
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.equal(`This user with email ${newEmail} already exists`)
        }
    })

    it('should throw an error if the new email is invalid', async () => {
        try {
            const token = jwt.sign({ sub: user.uniqueString }, process.env.JWT_SECRET)

            await updateUserEmail(`token=${token}`, 'newemail_example.com')
        } catch (error) {
            expect(error).to.be.instanceOf(FormatError)
            expect(error.message).to.equal(`Invalid email format`)
        }
    })
})