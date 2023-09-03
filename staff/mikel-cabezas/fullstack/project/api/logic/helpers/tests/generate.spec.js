const { expect } = require("chai")
const generate = require("./generate")

describe("generate", () => {

    it("should generate a user with a random name, email, and password", () => {
        const user = generate.user()

        expect(user.name).to.be.a('string')
        expect(user.email).to.be.a('string')
        expect(user.password).to.be.a('string')
        expect(user.favs).to.be.an('array')
    })
    it("should generate a playground", () => {
        const playground = generate.playground()
        expect(playground.name).to.be.a('string')
        expect(playground.description).to.be.a('string')
        expect(playground.images).to.be.an('array')
        expect(playground.text).to.be.a('string')
        expect(playground.visibility).to.be.a('string')

        expect(playground.location).to.be.an('Object')
        expect(playground.location.type).to.be.a('string')
        expect(playground.location.city).to.be.a('string')

        expect(playground.location.state).to.be.a('string')

        expect(playground.location.coordinates).to.be.an('array')

        expect(playground.elements).to.be.an('array')
    })
    it("should return false in accessibility elements", () => {
        expect(booleanRandom).to.be.a(0)
        expect(oolean).to.be.false
    })
    it("should return trie in accessibility elements", () => {
        expect(booleanRandom).to.be.a(1)
        expect(oolean).to.be.trie
    })
})