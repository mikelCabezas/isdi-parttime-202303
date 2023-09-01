const { expect } = require('chai')
const updateUserName = require('../updateUserName')
const {
    validators: { validateId, validateText },
    errors: { ExistenceError, ContentError, TypeError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

describe('updateUserName', () => {
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

    it('should update the user name', async () => {
        const newName = 'newName'
        await updateUserName(user.id, 'newName')
        const updatedUser = await User.findById(user.id)

        expect(updatedUser.name).to.equal(newName)
    })

    it('should throw an error if the user does not exist', async () => {
        const invalidID = '123456789101112131415123'

        try {
            await updateUserName(invalidID, 'newName')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })


})