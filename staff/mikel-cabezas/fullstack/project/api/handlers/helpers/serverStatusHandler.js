const { handleErrors } = require('.')


module.exports = handleErrors(async (req, res) => {
    res.status === 200 ? res.send('Server UP') : res.send('Server DOWN')
})


// const { extractUserId, handleErrors } = require('../helpers')

//     const userId = extractUserId(req)
