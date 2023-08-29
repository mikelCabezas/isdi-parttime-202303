const { expect } = require('chai')
const retrieveUser = require('../retrieveUser.js');
const authenticateUser = require('../authenticateUser')
const bcrypt = require('bcryptjs')

const {
    validators: { validateUserId },
    errors: { ExistenceError }
} = require('com')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')


describe('retrieveUser', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })

    let user
    beforeEach(async () => {
        user = generate.user()
        await cleanUp()
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await User.create({ ...user, password: hashedPassword })
    })

    after(async () => {
        await mongoose.disconnect()
        await cleanUp()
    })

    it('should retrieve a user by ID', async () => {

        const userId = await authenticateUser(user.email, user.password)

        const retrievedUser = await retrieveUser(userId)

        expect(retrievedUser).to.exist
        expect(retrievedUser.name).to.equal(user.name)
        expect(retrievedUser.email).to.equal(user.email)
        expect(retrievedUser.password).to.not.exist
        expect(retrievedUser._id).to.not.exist
    })



    it('should throw an error if the user does not exist', async () => {
        const invalidID = '74ecf874b9e532c8cb1c204x'

        try {
            await retrieveUser(invalidID)
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })
})