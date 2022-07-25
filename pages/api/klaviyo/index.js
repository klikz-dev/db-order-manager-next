import FormData from 'form-data'

export default async function handler(req, res) {
  const { templateId, subject, data, customer } = JSON.parse(req.body)

  var myHeaders = new Headers()

  var formdata = new FormData()
  formdata.append('api_key', process.env.NEXT_PUBLIC_KLAVIYO_TOKEN)
  formdata.append('from_email', 'orders@decoratorsbest.com')
  formdata.append('from_name', 'DecoratorsBest')
  formdata.append('subject', subject)
  formdata.append('to', customer)
  formdata.append('context', JSON.stringify(data))

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  }

  fetch(
    `https://a.klaviyo.com/api/v1/email-template/${templateId}/send`,
    requestOptions
  )
    .then(() => res.status(200).send())
    .catch((error) => console.log('error', error))
}
