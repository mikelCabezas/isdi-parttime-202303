const { validateUser } = require('../../logic/users')
const { handleErrors, extractUserId } = require('../helpers')
const jwt = require('jsonwebtoken')

module.exports = handleErrors(async (req, res) => {
    const { token } = req.params
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { sub: uniqueString } = payload

    // validateUser(uniqueString)
    const userValidated = await validateUser(uniqueString)
    if (userValidated)
        await res.redirect(`${process.env.SCHEMA}/UserValidationSuccess`)
})