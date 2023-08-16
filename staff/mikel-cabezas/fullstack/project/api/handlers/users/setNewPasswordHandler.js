const { request } = require('express')
const { setNewPassword } = require('../../logic/users')
const { handleErrors } = require('../helpers')
const { extractUserId } = require('../helpers')


module.exports = handleErrors(async (req, res) => {
    debugger
    const userId = extractUserId(req)
    const { newPassword } = req.body
    setNewPassword(userId, newPassword)
        .then(() => {
            res.status(204).send()
        })
})


// const { extractUserId, handleErrors } = require('../helpers')

//     const userId = extractUserId(req)
