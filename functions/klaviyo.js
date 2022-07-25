export default function sendKlaviyoEmail(templateId, subject, data, customer) {
  fetch('/api/klaviyo', {
    method: 'POST',
    body: JSON.stringify({
      templateId: templateId,
      subject: subject,
      data: data,
      customer: customer,
    }),
  })
    .then((res) => {
      return res
    })
    .catch((error) => {
      return error
    })
}
