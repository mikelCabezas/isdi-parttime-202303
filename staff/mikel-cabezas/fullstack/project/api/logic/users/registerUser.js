const { User } = require('../../data/models')
const sendRegisterEmail = require('../helpers/sendRegisterEmail')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    validators: { validateName, validateEmail, validatePassword },
    errors: { DuplicityError, UnknownError }
} = require('com')

/**
 * Registers a new user with the given name, email, and password.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>} - A promise that resolves when the user is successfully registered.
 * @throws {DuplicityError} - If a user with the given email already exists.
 * @throws {UnknownError} - If an unknown error occurs while registering the user.
 */

module.exports = function registerUser(name, email, password) {
    validateName(name)
    validateEmail(email)
    validatePassword(password)

    const randomString = () => {
        const length = 8
        let randomString = ''

        for (let i = 0; i < length; i++) {
            const character = Math.floor((Math.random() * 10) + 1)
            if (character.length === 2) randomString.slice(0, -2)
            if (character.length === 3) randomString.slice(0, -3)

            randomString += character
        }
        debugger
        if (randomString.length === 9) randomString.slice(0, -1)
        // if (randomString.length === 10) randomString.slice(0, -2)
        // if (randomString.length === 11) randomString.slice(0, -3)
        // if (randomString.length === 12) randomString.slice(0, -4)
        return randomString
    }
    const isValid = false
    const uniqueString = randomString()

    console.log('uniqueString.length', uniqueString.length)

    return (async () => {
        try {
            const hash = await bcrypt.hash(password, 10)

            await User.create({ name, email, password: hash, isValid, uniqueString })
            const payload = { sub: uniqueString }
            const { JWT_SECRET, JWT_RECOVER_EMAIL_EXPIRATION } = process.env
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_RECOVER_EMAIL_EXPIRATION })
            await sendRegisterEmail(name, email, token)
        } catch (error) {
            if (error.message.includes('E11000'))
                throw new DuplicityError(`This user with email ${email} already exists`)

            throw new UnknownError(error.message)
        }
    })()
}