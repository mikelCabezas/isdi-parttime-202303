const { expect } = require('chai');
const mapkitAccessToken = require('../mapkitAccessToken');
const { TypeError } = require('com').errors;
const nock = require('nock');

describe('mapkitAccessToken', () => {
    it('should return an object with the expected properties when given valid input', async () => {
        const result = await mapkitAccessToken();

        expect(result).to.be.an('object');

        expect(result).to.has.property('accessToken');
    });

    it('should throw an Error if the Apple fecth not return 200 status code', async () => {
        try {
            await mapkitAccessToken()
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Not Authorized')
        }
    })
});