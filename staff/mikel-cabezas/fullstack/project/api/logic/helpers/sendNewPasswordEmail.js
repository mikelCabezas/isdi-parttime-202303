const nodeMailer = require("nodemailer");
require("dotenv").config()


module.exports = async (email, uniqueString) => {
    try {
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
            // html: `Press <a href="${process.env.API_URL}/validate/${uniqueString}"> here </a> to verify your account`
        }
        console.log(uniqueString)

        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                throw new Error('Error in mails settings')
            } else return true
        })
    } catch (error) {
        throw error
        console.log('Mail not sent!')
    }
}