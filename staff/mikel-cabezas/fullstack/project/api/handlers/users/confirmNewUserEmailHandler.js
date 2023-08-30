const { confirmNewEmail } = require('../../logic/users')
const { extractUserId } = require('../helpers')
const { handleErrors } = require('../helpers')
const jwt = require('jsonwebtoken')

module.exports = handleErrors((req, res) => {
    debugger
    // const { token } = req.params
    const userId = extractUserId(req)

    const { newEmail } = req.body


    return confirmNewEmail(userId, newEmail)
        .then(() => res.status(204).send())

    // return updateUserEmail(userId, email)
    //     .then(() => res.status(204).send())
})