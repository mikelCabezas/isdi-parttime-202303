const { expect } = require('chai');
const nodemailerMock = require('nodemailer-mock');
const sendConfirmNewEmail = require('../sendConfirmNewEmail');

describe('sendConfirmNewEmail', () => {
    beforeEach(() => {
        nodemailerMock.mock.reset();
    });

    it('should send an email with the correct options', async () => {
        const name = 'John';
        const email = 'john@example.com';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        await sendConfirmNewEmail(name, email, token, nodemailerMock.mock);

        const mailOptions = nodemailerMock.mock.sentMail[0];
    });


});