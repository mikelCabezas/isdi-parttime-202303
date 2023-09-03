const { expect } = require('chai');
const nodemailerMock = require('nodemailer-mock');
const sendRegisterEmail = require('../sendRegisterEmail');

describe('sendRegisterEmail', () => {
  beforeEach(() => {
    nodemailerMock.mock.reset();
  });

  it('should send an email with the correct options', async () => {
    const name = 'John';
    const email = 'john@example.com';
    const token = '1234567890';

    await sendRegisterEmail(name, email, token, nodemailerMock.mock);

  });


});