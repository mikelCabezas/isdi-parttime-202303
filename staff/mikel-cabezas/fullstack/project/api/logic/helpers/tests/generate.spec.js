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
    })

})