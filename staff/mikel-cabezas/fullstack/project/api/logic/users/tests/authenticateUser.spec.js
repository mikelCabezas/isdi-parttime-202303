const { expect } = require('chai')
const authenticateUser = require('../authenticateUser')
const { cleanUp, generate } = require('../../helpers/tests/index.js')
const { User } = require('../../../data/models')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { errors: { ExistenceError, AuthError, ContentError } } = require('com')


describe('authenticateUser', () => {
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

    it('should return the user id on successful authentication', async () => {
        const userId = await authenticateUser(user.email, user.password)
        expect(userId).to.be.a('string')
    })

    it('should throw an ExistenceError if the user does not exist', async () => {
        try {
            await authenticateUser('nonexistent@example.com', 'password')
        } catch (error) {
            expect(error).to.be.instanceOf(ExistenceError)
            expect(error.message).to.equal('user not found')
        }
    })

    it('should throw an AuthError if the user is not valid', async () => {

        try {
            await authenticateUser(user.email, user.password)
        } catch (error) {
            expect(error).to.be.instanceOf(AuthError)
            expect(error.message).to.equal('Verify your account please. Check your email')
        }
    })

    it('should throw an AuthError if the password is incorrect', async () => {
        try {
            await authenticateUser(user.email, 'wrongpassword')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthError)
            expect(error.message).to.equal('wrong credentials')
        }
    })

    // SYNC errors

    it('should throw a TypeError if email is not a string', () => {
        expect(() => authenticateUser(123, user.password)).to.throw(TypeError, 'Email is not a string')
    })

    it('should throw a TypeError if password is not a string', () => {
        expect(() => authenticateUser(user.email, 123)).to.throw(TypeError, 'Password is not a string')
    })

    it('should throw a ContentError if email is empty', () => {
        expect(() => authenticateUser('', user.password)).to.throw(Error, 'Email is empty')
    })

    it('should throw a ContentError if password is empty', () => {
        expect(() => authenticateUser(user.email, '')).to.throw(Error, 'Password is empty')
    })

    it('should throw a ContentError if email is not in the correct format', () => {
        expect(() => authenticateUser('invalidemail', user.password)).to.throw(Error, 'Invalid email format')
    })
})