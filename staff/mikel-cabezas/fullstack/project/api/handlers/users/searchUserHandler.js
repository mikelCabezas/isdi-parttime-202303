const { request } = require('express')
const { searchUser } = require('../../logic/users')
const { handleErrors } = require('../helpers')
const { extractUserId } = require('../helpers')


module.exports = handleErrors(async (req, res) => {
    const uniqueString = extractUserId(req)
    searchUser(uniqueString)
        .then(() => {
            res.status(200).send()
        })
})


// const { extractUserId, handleErrors } = require('../helpers')

//     const userId = extractUserId(req)
