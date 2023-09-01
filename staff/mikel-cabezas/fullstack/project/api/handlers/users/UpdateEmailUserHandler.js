const { request } = require('express')
const { updatePassword } = require('../../logic/users')
const { handleErrors, extractUserId } = require('../helpers')


module.exports = handleErrors(async (req, res) => {
    debugger
    const userId = extractUserId(req)
    const { name, email } = req.body
    updateUserEmail(userId, name, email)
        .then(() => {
            res.status(204).send()
        })
})


// const { extractUserId, handleErrors } = require('../helpers')

//     const userId = extractUserId(req)
