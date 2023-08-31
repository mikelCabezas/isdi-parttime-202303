const { expect } = require('chai')
const recoverPassword = require('../recoverPassword.js')
const {
    validators: { validateName, validateEmail, validatePassword },
    errors: { ExistenceError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('recoverPassword', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    let _user

    beforeEach(async () => {
        _user = generate.user()
        await cleanUp()
        console.log('_user.uniqueString', _user.uniqueString)

        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should recover password with found user by unique string ', async () => {
        const foundUser = await recoverPassword(user.uniqueString)
        expect(foundUser).to.be.true
    })
    it('should throw a ExistenceError if user not found ', async () => {
        try {
            const invalidUniqueString = '12345678'
            await recoverPassword(invalidUniqueString)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`user not found`)
        }
    })
})