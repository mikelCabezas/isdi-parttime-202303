const mongoose = require('mongoose')
const { expect } = require('chai')
const { User } = require('../../data/models')

describe('User model', () => {
    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL}/${MONGODB_DATABASE_TESTS}`, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        })
    })

    after(async () => {
        await mongoose.connection.close()
    })

    describe('name field', () => {
        it('should be required', async () => {
            const user = new User({ email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.name).to.exist
            }
        })

        it('should be a string', async () => {
            const user = new User({ name: 123, email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.name).to.exist
            }
        })

        it('should be trimmed', async () => {
            const user = new User({ name: '  test  ', email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            await user.validate()
            expect(user.name).to.equal('test')
        })
    })

    describe('email field', () => {
        it('should be required', async () => {
            const user = new User({ name: 'Test', password: 'password', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.email).to.exist
            }
        })

        it('should be a string', async () => {
            const user = new User({ name: 'Test', email: 123, password: 'password', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.email).to.exist
            }
        })

        it('should be trimmed', async () => {
            const user = new User({ name: 'Test', email: '  test@example.com  ', password: 'password', uniqueString: 'unique' })
            await user.validate()
            expect(user.email).to.equal('test@example.com')
        })

        it('should be unique', async () => {
            const user1 = new User({ name: 'Test', email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            const user2 = new User({ name: 'Test', email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            await user1.save()
            try {
                await user2.save()
            } catch (error) {
                expect(error.code).to.equal(11000)
            }
        })
    })

    describe('password field', () => {
        it('should be required', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.password).to.exist
            }
        })

        it('should be a string', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 123, uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.password).to.exist
            }
        })

        it('should have a minimum length of 8', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: '1234567', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.password).to.exist
            }
        })
    })

    describe('image field', () => {
        it('should be a string', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', image: 123, uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.image).to.exist
            }
        })
    })

    describe('favs field', () => {
        it('should be an array of ObjectIds', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', favs: ['123'], uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.favs).to.exist
            }
        })

        it('should have a default value of an empty array', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            await user.validate()
            expect(user.favs).to.be.an('array').that.is.empty
        })
    })

    describe('isValid field', () => {
        it('should be required', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.isValid).to.exist
            }
        })

        it('should be a boolean', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', isValid: 'true', uniqueString: 'unique' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.isValid).to.exist
            }
        })

        it('should have a default value of false', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', uniqueString: 'unique' })
            await user.validate()
            expect(user.isValid).to.be.false
        })
    })

    describe('uniqueString field', () => {
        it('should be required', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password' })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.uniqueString).to.exist
            }
        })

        it('should be a string', async () => {
            const user = new User({ name: 'Test', email: 'test@example.com', password: 'password', uniqueString: 123 })
            try {
                await user.validate()
            } catch (error) {
                expect(error.errors.uniqueString).to.exist
            }
        })
    })
})