const nodemailer = require('nodemailer')

export default async function handler(req, res) {
  const { from, to, subject, html } = JSON.parse(req.body)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
    })
    res.status(200).send()
  } catch (error) {
    res.status(500).send(error)
  }
}
