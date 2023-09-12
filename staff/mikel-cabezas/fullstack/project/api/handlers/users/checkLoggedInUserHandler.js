const { request } = require('express')
const { checkLoggedInUser } = require('../../logic/users')
const { handleErrors } = require('../helpers')
const { extractUserId } = require('../helpers')


module.exports = handleErrors(async (req, res) => {
    const userId = extractUserId(req)
    debugger
    checkLoggedInUser(userId)
        .then(() => {
            res.status(200).send()
        })
})


// const { extractUserId, handleErrors } = require('../helpers')

//     const userId = extractUserId(req)
