const { errors: { DuplicityError, ContentError, FormatError, ExistenceError, AuthError } } = require('com')
module.exports = function handleErrors(callback) {
    return function (req, res) {
        try {
            callback(req, res)
                .catch(error => {
                    let status = 500

                    if (error instanceof DuplicityError) {
                        status = 409
                    } else if (error instanceof ExistenceError) {
                        status = 404
                    } else if (error instanceof AuthError) {
                        status = 401
                    } else if (error instanceof ContentError) {
                        status = 401
                    }

                    res.status(status).json({ error: error.message })
                })
        } catch (error) {
            let status = 500

            if (error instanceof ContentError || error instanceof TypeError || error instanceof RangeError || error instanceof FormatError) {
                status = 406
            }
            res.status(status).json({ error: error.message })
        }
    }
}