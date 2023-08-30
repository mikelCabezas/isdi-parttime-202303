const { expect } = require('chai')
const retrieveUser = require('../retrieveUser.js');
const authenticateUser = require('../authenticateUser.js')
const bcrypt = require('bcryptjs')

const { errors: { ExistenceError } } = require('com')
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
        await cleanUp()
        await mongoose.disconnect()
    })

    it('should retrieve a user by ID', async () => {
        const userRegistered = await User.findOne({ email: user.email }, '-password')
        const retrievedUser = await retrieveUser(userRegistered.id)

        expect(retrievedUser).to.exist
        expect(retrievedUser.name).to.equal(user.name)
        expect(retrievedUser.email).to.equal(user.email)
        expect(retrievedUser.password).to.not.exist
        // expect(retrievedUser._id).to.not.exist
    })



    it('should throw an error if the user does not exist', async () => {
        try {
            await retrieveUser('123456789101112131415123')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })
})