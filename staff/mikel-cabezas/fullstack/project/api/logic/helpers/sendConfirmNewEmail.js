const { validateEmail, validateName, validateToken } = require("com/validators");
const nodeMailer = require("nodemailer");
require("dotenv").config()

/**
 * Sends an email to confirm a new email address for a user's account.
 * @param {string} name - The user's name.
 * @param {string} email - The user's new email address.
 * @param {string} token - The token used to confirm the email change.
 * @returns {boolean} - Returns true if the email was sent successfully.
 */

module.exports = async (name, email, token) => {
    validateName(name)
    validateEmail(email)
    validateToken(token)
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
        // from: 'Playgrounds Near, <info@mikelcabezas.com>',
        to: email,
        subject: 'Confirm new email - Playgrounds App',
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
                        <h1 style="text-align:center; font-weight: bold">Confirm new email</h1>
                        <p style="box-sizing: border-box; word-wrap: break-word; margin: 0 auto;">
                        Hi ${name}! If you cannot request to set this new email for your account, please ignore this email.
                        <br>
                        For change this email (${email}) for your account, please follow this link:
                            <a href="${process.env.API_URL}/user/confirmUpdateEmail/updateEmail/token=${token}/email=${email}"> ${process.env.API_URL}/user/confirmUpdateEmail/updateEmail/token=${token}/email=${email}</a>
                        </p>
                    </div>
                </body>
            </html>`
    }

    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            throw new Error('Mail not sent. Check email settings')
        }

    })
    return true
}