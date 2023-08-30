const { expect } = require('chai')
const checkLoggedInUser = require('../checkLoggedInUser.js');
const {
    validators: { validateUserId },
    errors: { ExistenceError, AuthError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('checkLoggedInUser', () => {
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

    it('should find a user by ID', async () => {
        const userRegistered = await User.findOne({ email: user.email })
        const retrievedUser = await checkLoggedInUser(userRegistered._id)

        expect(retrievedUser).to.exist
        expect(retrievedUser.name).to.equal(user.name)
        expect(retrievedUser.email).to.equal(user.email)
        expect(retrievedUser.password).to.not.exist
        // expect(retrievedUser._id).to.not.exist
    })

    it('should throw an error if the user does not exist', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await checkLoggedInUser(invalidID)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw an error if the user is not verified', async () => {
        try {
            await user.updateOne({ isValid: false })

            const userRegistered = await User.findOne({ email: user.email })
            await checkLoggedInUser(userRegistered._id)


        } catch (error) {
            expect(error).to.be.instanceOf(AuthError)
            expect(error.message).to.equal('Account not verified. Please check your email')
        }
    })
})