const { expect } = require('chai')
const setNewPassword = require('../setNewPassword.js')
const {
    validators: { validatePassword },
    errors: { DuplicityError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('setNewPassword', () => {
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

    it('should update the user password with a valid new password', async () => {
        const newPassword = '234234234'
        const hash = await bcrypt.hash(newPassword, 10)
        await setNewPassword(user.uniqueString, newPassword)

        const updatedUser = await User.findOne({ uniqueString: user.uniqueString })

        const match = await bcrypt.compare(newPassword, updatedUser.password)

        expect(match).to.be.true
    })

    it('should throw an error if the new password is invalid', async () => {
        try {
            const invalidPassword = '123'
            await setNewPassword(user.uniqueString, invalidPassword)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal(`Password must be higher than 8 characters`)
        }
    })

    it('should throw an error if the user is not found', async () => {
        try {
            const invalidUniqueString = '12345678'
            await setNewPassword(invalidUniqueString, 'newPassword123')

        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal(`user not found`)
        }
    })
})