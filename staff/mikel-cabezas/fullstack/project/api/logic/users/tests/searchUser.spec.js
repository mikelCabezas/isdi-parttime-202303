const { expect } = require('chai')
const searchUser = require('../searchUser.js')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const {
    errors: { ExistenceError }
} = require('com')

describe('searchUser', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    let _user

    beforeEach(async () => {
        _user = generate.user()
        await cleanUp()
        console.log('_user.uniqueString X', _user.uniqueString)
        const hashedPassword = await bcrypt.hash(_user.password, 10)
        user = await User.create({ name: _user.name, email: _user.email, favs: _user.favs, isValid: _user.isValid, uniqueString: _user.uniqueString, password: hashedPassword })
    })

    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should find a user by unique string', async () => {
        const foundUser = await searchUser(user.uniqueString)
        expect(foundUser).to.be.true
    })

    it('should return null if the user is not found', async () => {
        try {
            await searchUser('12345678')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal(`user not found`)
        }
    })
})