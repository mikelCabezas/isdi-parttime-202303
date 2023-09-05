const { handleErrors } = require('.')


module.exports = handleErrors(async (req, res) => {
    res.send('Server UP')
})



