const request = require('request')

export default async function handler(req, res) {
  const { templateId, subject, data, customer } = JSON.parse(req.body)

  const options = {
    method: 'POST',
    url: `https://a.klaviyo.com/api/v1/email-template/${templateId}/send`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    formData: {
      api_key: process.env.NEXT_PUBLIC_KLAVIYO_TOKEN,
      from_email: 'orders@decoratorsbest.com',
      from_name: 'DecoratorsBest',
      subject: subject,
      to: customer,
      context: JSON.stringify(data),
    },
  }

  try {
    const response = await request(options)
    const data = response.json()

    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error })
  }
}
