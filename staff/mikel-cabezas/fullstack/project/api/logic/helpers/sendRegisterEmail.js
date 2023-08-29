const nodeMailer = require("nodemailer");
require("dotenv").config()

module.exports = async (name, email, token) => {
    const transport = nodeMailer.createTransport({
        host: process.env.HOST,
        service: 'mail',
        protocol: 'mail',
        pool: false,
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
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: true
        }
    })

    const { API_URL } = process.env
    const mailOptions = {
        from: 'Playgrounds Near, <noreply@playgroundsnear.app>',
        to: email,
        subject: 'Email confirmation - Playgrounds App',
        html: `
      <!DOCTYPE html>
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
            <h1 style="text-align:center; font-weight: bold">Hi ${name}, thanks for registering!</h1>
            <p style="box-sizing: border-box; word-wrap: break-word; margin: 0 auto;">
              Follow this link to verify your account:
              <a href="${API_URL}/user/validate/${token}">${API_URL}/user/validate/${token}</a>
            </p>
          </div>
        </body>
      </html>
    `
    }

    try {
        const info = await transport.sendMail(mailOptions)
        console.log('Mail sent!', info)
    } catch (error) {
        console.log('Mail not sent!', error)
    }
}