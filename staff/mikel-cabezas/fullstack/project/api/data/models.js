const mongoose = require('mongoose')
const { Schema, Schema: { Types: { ObjectId } }, model } = mongoose

const user = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    image: {
        type: String
    },
    favs: {
        type: [ObjectId],
        default: []
    },
    isValid: {
        type: Boolean,
        required: true,
        default: false
    },
    uniqueString: {
        type: String,
        required: true,
    }
})
const contributor = new Schema({
    _id: {
        type: [ObjectId],
        unique: true,
        required: true,
        ref: 'User'
    }
})
const comments = new Schema({
    _id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    author: {
        type: ObjectId,
        required: true
    },
    isUtil: {
        type: Boolean,
    },
    comment: {
        type: String,
        required: true,
        maxLength: 200
    }
})
const location = new Schema({
    type: {
        type: String,
        default: 'Point',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    coordinates: {
        type: Array,
        // length: 2,
        required: true
    }
})
const element = new Schema({
    type: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    accessibility: {
        type: Boolean,
        required: true
    },
})
const issue = new Schema({
    _id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        unique: true
    },
    elements: {
        type: [String],
        required: true,
        // unique: true
    },
    isSolved: {
        type: Boolean,
        default: false
    },
    concept: {
        type: String,
        unique: true
    }
})

const playground = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
        required: true,
        minLength: 1
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastModify: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [ObjectId],
        ref: 'User',
        default: []
    },
    visibility: {
        type: String,
        default: 'public',
    },
    location: {
        type: location,
        required: true,
    },
    elements: {
        type: [element],
        required: true,
    },
    sunExposition: {
        type: Object,
        default: {
            shady: null,
            sunny: null,
            partial: null,
        }
    },
    // issues: {
    //     type: [issue],
    //     ref: 'User',
    //     required: true,
    //     default: []
    // },
    // contributors: {
    //     type: [contributor],
    // },
})
const post = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    likes: {
        type: [ObjectId],
        ref: 'User'
    },
    visibility: {
        type: String,
        default: 'public'
    }
})

const User = model('User', user)
const Playground = model('Playground', playground)
const Post = model('Post', post)

module.exports = {
    User,
    Playground,
    Post
}