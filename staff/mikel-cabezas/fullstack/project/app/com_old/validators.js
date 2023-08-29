const { ContentError, FormatError } = require('./errors')
function validateName(name) {
    if (!name) throw new TypeError('Name is empty')
    if (typeof name !== 'string') throw new TypeError('Name is not a string')
    if (!name.trim().length) throw new ContentError('Name is empty')
}

function validateImage(inputImage) {
    if (!inputImage) throw new ContentError('Image is empty')

    switch (inputImage.type) {
        case 'image/jpeg':
        case 'image/gif':
        case 'image/png':
        case 'image/webp':
            return true
    }
    throw new FormatError('File is not a valid image')

    // if (inputImage.type !== 'image/jpeg' || inputImage.type !== 'image/gif' || inputImage.type !== 'image/png' || inputImage.type !== 'image/webp')
    //     throw new FormatError('File is not a valid image')
}

function validateEmail(email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!email) throw new ContentError('Email is empty')
    if (typeof email !== 'string') throw new TypeError('Email is not a string')
    if (!emailRegex.test(email)) throw new FormatError('Invalid email format')
}

function validateText(text) {
    if (typeof text !== 'string') throw new TypeError('Text is not a string')
    if (!text.trim().length) throw new ContentError('Text is empty')
}

function validatePassword(password) {
    if (!password) throw new ContentError('Password is empty')
    if (!password.trim().length > 8) throw new FormatError('Password must be higher than 8 characters')
}

function validateUserId(userId) {
    debugger
    if (typeof userId !== 'string') throw new TypeError('User is not a string')
    if (!userId) throw new ContentError('User is empty')
}

function validatePostId(postId) {
    if (typeof postId !== 'string') throw new TypeError('Post ID is not a string')
    if (!postId) throw new ContentError('Post ID is empty')
}

function validateCallback(callback) {
    if (typeof callback !== 'function') throw new TypeError('Callback is not a function')
}

function validateToken(token, explain = 'token') {
    if (typeof token !== 'string') throw new TypeError(`${explain} is not a string`)
    if (token.split('.').length !== 3) throw new ContentError(`${explain} is not valid`)
}

module.exports = {
    validateName,
    validateImage,
    validateEmail,
    validateText,
    validatePassword,
    validateUserId,
    validatePostId,
    validateCallback,
    validateToken
}