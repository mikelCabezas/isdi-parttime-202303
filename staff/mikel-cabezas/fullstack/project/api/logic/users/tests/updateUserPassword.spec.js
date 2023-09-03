const { expect } = require('chai')
const updateUserPassword = require('../updateUserPassword.js')
const {
    validators: { validateUserId, validatePassword, validateNewPassword },
    errors: { ExistenceError, ContentError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('updateUserPassword', () => {
    before(async () => await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`))

    let user
    let _user

    beforeEach(async () => {
        _user = generate.user()
        await cleanUp()
        console.log(_user.password)
        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should update the user password', async () => {
        const newPassword = 'newPassword123'
        const repeatPassword = 'newPassword123'

        await updateUserPassword(user.id, _user.password, newPassword, repeatPassword)
        const updatedUser = await User.findById(user._id).lean()
        expect(updatedUser).to.not.be.null
        expect(updatedUser.password).to.not.equal(user.password)

        const checkNewPasswordMatch = await bcrypt.compare(newPassword, updatedUser.password)
        expect(checkNewPasswordMatch).to.be.true
    })

    it('should throw an error if the user does not exist', async () => {
        const invalidID = '123456789101112131415123'
        try {
            await updateUserPassword(invalidID, _user.password, 'newPassword123', 'newPassword123')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw an error if the current password is incorrect', async () => {
        try {
            await updateUserPassword(user.id, 'wrongPassword', 'newPassword123', 'newPassword123')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('Current password does not match')
        }
    })

    it('should throw an error if the new password is the same as the current password', async () => {
        try {
            await updateUserPassword(user.id, _user.password, _user.password, _user.password)
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('New password must be different as previous password')
        }
    })

    it('should throw an error if the new password and confirmation do not match', async () => {
        try {
            await updateUserPassword(user.id, _user.password, 'newPassword123', 'newPassword456')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('New password and new password confirmation does not match')
        }
    })

})