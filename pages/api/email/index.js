const nodemailer = require('nodemailer')

export default async function handler(req, res) {
  const { type, from, to, subject, html, csv } = JSON.parse(req.body)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user:
        type === 'order'
          ? process.env.SMTP_ORDER_USER
          : type === 'sample'
          ? process.env.SMTP_SAMPLE_USER
          : process.env.SMTP_TEST_USER,
      pass:
        type === 'order'
          ? process.env.SMTP_ORDER_PASS
          : type === 'sample'
          ? process.env.SMTP_SAMPLE_PASS
          : process.env.SMTP_TEST_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
      attachments: csv
        ? [
            {
              filename: `${new Date().getTime()}.csv`,
              content: csv,
            },
          ]
        : undefined,
    })
    res.status(200).send()
  } catch (error) {
    res.status(500).send(error)
  }
}
