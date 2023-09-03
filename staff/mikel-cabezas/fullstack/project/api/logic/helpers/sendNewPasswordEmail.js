const nodeMailer = require("nodemailer");
require("dotenv").config()

/**
 * Sends a password reset email to the specified email address with a unique token.
 * @param {string} email - The email address to send the password reset email to.
 * @param {string} uniqueString - A unique token to include in the password reset email.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the email was sent successfully, or throws an error if there was a problem with the email settings.
 **
 * Sends the password reset email using the specified transport and mail options.
 * @param {Object} mailOptions - The options for the email to be sent.
 * @param {string} mailOptions.from - The email address to send the email from.
 * @param {string} mailOptions.to - The email address to send the email to.
 * @param {string} mailOptions.subject - The subject line of the email.
 * @param {string} mailOptions.html - The HTML content of the email.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the email was sent successfully, or throws an error if there was a problem with the email settings.
 */

module.exports = async (email, uniqueString) => {
    const transport = nodeMailer.createTransport({
        host: process.env.HOST,
        service: 'mail',
        protocol: 'mail',
        pool: false,
        debug: true,
        logger: true,
        port: 465,
        secure: true,
        transportMethod: 'SMTP',
        requireTLS: true,
        secureConnection: true,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASS,
        },
        tls: {
            secure: true,
            ignoreTLS: true,
            rejectUnauthorized: true
        }
    })

    let mailOptions
    let sender = "Playgrounds Near"
    mailOptions = {
        from: 'Playgrounds Near, <noreply@playgroundsnear.app>',
        to: email,
        subject: 'Reset Password - Playgrounds App',
        html: `<!DOCTYPE html>
            <html lang="en" style="height: 100vh; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <style>
                    h1 {
                        font-size: 21px;
                    }
                    @media screen and (max-width: 767px) {
                        .container {
                            width: 630px;
                        }
                        h1 {
                            font-size: 26px;
                        }
                        p {
                            font-size: 21px;
                        }
                    }
                    </style>
                </head>
                <body style="background: #DAECB5 url(https://playgroundsnear.app/assets/bg-login.png);background-size: cover; min-height: 600px; height: 100vh; margin: auto; padding: 30px;">
                    <div class="container" style="margin-top: 30px; background: rgba(255,255,255,0.87); padding: 30px; border-radius: 25px; text-align: center;width: 100%;width: 630px;margin: auto;box-sizing: border-box;">
                        <img src="https://playgroundsnear.app/assets/logo.png" style="margin: auto; width: 250px; height: auto">
                        <h1 style="text-align:center; font-weight: bold">Reset password</h1>
                        <p style="box-sizing: border-box; word-wrap: break-word; margin: 0 auto;">
                        Hi! If you cannot request to set your password again, please ignore this email.
                        <br>
                        For reset your password, please follow this link:
                            <a href="${process.env.API_URL}/user/recoverPassword/${uniqueString}"> ${process.env.API_URL}/user/recoverPassword/token=${uniqueString}</a>
                        </p>
                    </div>
                </body>
            </html>
             `
    }


    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            throw new Error('Error in mails settings')
        } else return true
    })

}