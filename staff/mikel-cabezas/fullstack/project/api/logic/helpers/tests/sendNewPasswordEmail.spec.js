const { expect } = require('chai');
const nodemailerMock = require('nodemailer-mock');
const sendNewPasswordEmail = require('../sendNewPasswordEmail');

describe('sendNewPasswordEmail', () => {

    beforeEach(() => {
        nodemailerMock.mock.reset();
    });


    it('should send an email with the correct options', async () => {
        const email = 'john@example.com';
        const uniqueString = '1234567890';

        await sendNewPasswordEmail(email, uniqueString, nodemailerMock.mock);
    });
});