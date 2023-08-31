const { expect } = require('chai')
const registerUser = require('../registerUser.js');
const { cleanUp, generate } = require('../../helpers/tests/index.js')

const { User } = require('../../../data/models.js')
const mongoose = require('mongoose')
const { errors: { DuplicityError, ContentError } } = require("com")

describe('registerUser', () => {


    before(async () => {
        await mongoose.connect(`${process.env.MONGODB_URL_TESTS}`)
    })
    let user
    beforeEach(async () => {
        user = generate.user()
        await cleanUp()
    })
    after(async () => {
        await cleanUp()
        await mongoose.disconnect()
    })
    it("should succeed on creating an user", async () => {
        await registerUser(user.name, user.email, user.password)

        const userRegistered = await User.findOne({ email: user.email })

        expect(userRegistered).to.exist
        expect(userRegistered.name).to.equal(user.name)
        expect(userRegistered.email).to.equal(user.email)
    })
    it('should throw DuplicityError for an existing email', async () => {
        const name = 'Test User';
        const email = 'existing@example.com';
        const password = 'validpassword';

        try {
            console.log(name, email, password)
            await registerUser(name, email, password);
            await registerUser(name, email, password);
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error).to.be.instanceOf(DuplicityError);
            console.log('error.message: ', error.message)
            expect(error.message).to.equal(`This user with email ${email} already exists`);
        }
    });

    it("should fail on unknown error", async () => {
        const errorMessage = "This is an unknown error message";

        try {
            await registerUser(user.name, user.email, user.password);
            throw new Error(errorMessage);
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal(errorMessage);
        }
    });


    // SYNC errors

    it('should fail on non-string name', () => {
        expect(() =>
            registerUser(1, user.email, user.password)
        ).to.throw(Error, 'Name is not a string')
        expect(() =>
            registerUser(true, user.email, user.password)
        ).to.throw(Error, 'Name is not a string')
    })
    it('should fail on empty name', () => {
        expect(() =>
            registerUser('', user.email, user.password)
        ).to.throw(Error, 'Name is empty')
    })


    it('should fail on non-string email', () => {
        expect(() =>
            registerUser(user.name, 1, user.password)
        ).to.throw(Error, 'Email is not a string')
        expect(() =>
            registerUser(user.name, false, user.password)
        ).to.throw(Error, 'Email is not a string')
    })
    it('should fail on empty email', () => {
        expect(() =>
            registerUser(user.name, '', user.password)
        ).to.throw(Error, 'Email is empty')
    })
    it('should fail on wrong email format', () => {
        expect(() =>
            registerUser(user.name, '123@abcd', user.password)
        ).to.throw(Error, 'Invalid email format')
    })



    it('should fail on empty password', () => {
        expect(() =>
            registerUser(user.name, user.email, '')
        ).to.throw(Error, 'Password is empty')
    })
    it('should fail on password less than 8 characters', () => {
        expect(() =>
            registerUser(user.name, user.email, '152')
        ).to.throw(Error, 'Password must be higher than 8 characters')
    })





    // catch(error) {

    //     expect(error).to.be.null
    // }
    //         readFile(`${process.env.DB_PATH}/users.json`, (error, json) => {
    //             expect(error).to.be.null

    //             const users = JSON.parse(json)
    //             const user = users.find(user => user.email === email)

    //             expect(user).to.exist
    //             expect(user.id).to.be.a('string')
    //             expect(user.name).to.equal(name)
    //             expect(user.email).to.equal(email)
    //             expect(user.password).to.equal(password)
    //             expect(user.image).to.be.null
    //             expect(user.favPosts).to.have.lengthOf(0)

    //             done()
    //         })
    // })
    // it('should fail on existing user', done => {
    //     const name = `name-${Math.random()}`
    //     const email = `e-${Math.random()}@gmail.com`
    //     const password = `password-${Math.random()}`

    //     const user = [{ name, email, password }]

    //     const json = JSON.stringify(user)

    //     writeFile(`${process.env.DB_PATH}/users.json`, json, error => {
    //         expect(error).to.be.null
    //         registerUser(name, email, password, error => {
    //             expect(error).to.be.instanceOf(Error)
    //             expect(error.message).to.equal(`user with email ${email} already exists`)

    //             done()
    //         })
    //     })
    // })
    // it('files on empty name', () => {
    //     try {
    //         registerUser('', email, password, () => { })
    //     } catch (error) {
    //         expect(error).to.be.instanceOf(Error)
    //         expect(error.message).to.equal(`Name is empty`)
    //     }
    // })
    // it('files on empty email', () => {
    //     expect(() => registerUser(name, '', password, () => { })).to.Throw(Error, `Email is empty`)
    // })
    // it('files on empty password', () => {
    //     expect(() => registerUser(name, email, '', () => { })).to.Throw(Error, `Password is empty`)
    // })
    // it('files on non-string name', () => {
    //     expect(() => registerUser(undefined, email, password, () => { })).to.Throw(Error, `Name is not a string`)
    //     expect(() => registerUser(1, email, password, () => { })).to.Throw(Error, `Name is not a string`)
    //     expect(() => registerUser(true, email, password, () => { })).to.Throw(Error, `Name is not a string`)
    //     expect(() => registerUser({}, email, password, () => { })).to.Throw(Error, `Name is not a string`)
    //     expect(() => registerUser([], email, password, () => { })).to.Throw(Error, `Name is not a string`)
    // })
    // it('files on non-string email', () => {
    //     expect(() => registerUser(name, undefined, password, () => { })).to.Throw(Error, `Email is not a string`)
    //     expect(() => registerUser(name, 1, password, () => { })).to.Throw(Error, `Email is not a string`)
    //     expect(() => registerUser(name, true, password, () => { })).to.Throw(Error, `Email is not a string`)
    //     expect(() => registerUser(name, {}, password, () => { })).to.Throw(Error, `Email is not a string`)
    //     expect(() => registerUser(name, [], password, () => { })).to.Throw(Error, `Email is not a string`)
    // })

    // after(done => writeFile(`${process.env.DB_PATH}/users.json`, '[]', error => done(error)))
})