const { User, Playground } = require("../../../data/models")

module.exports = async function cleanUp() {
    await Promise.all([User.deleteMany(), Playground.deleteMany()])
}