const { expect } = require('chai');
const nodemailerMock = require('nodemailer-mock');
const sendVerifyNewEmail = require('../sendVerifyNewEmail');

describe('sendVerifyNewEmail', () => {
    beforeEach(() => {
        nodemailerMock.mock.reset();
    });

    it('should send an email with the correct options', async () => {
        const email = 'john@example.com';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        await sendVerifyNewEmail(email, token);

        expect(nodemailerMock.mock.sentMail.length).to.equal(0);


    });


});