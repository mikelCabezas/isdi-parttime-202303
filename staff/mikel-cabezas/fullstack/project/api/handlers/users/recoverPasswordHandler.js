const { updatePassword } = require('../../logic/users')
const { handleErrors } = require('../helpers')

module.exports = handleErrors(async (req, res) => {
    const { token } = req.params

    await res.redirect(`${process.env.SCHEMA}/updatePassword/token=${token}`)
})

