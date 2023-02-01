export default function sendEmail(type, from, to, subject, html, csv = null) {
  fetch('/api/email', {
    method: 'POST',
    body: JSON.stringify({
      type: type,
      from: from,
      to: to,
      subject: subject,
      html: html,
      csv: csv,
    }),
  })
    .then((res) => {
      return res
    })
    .catch((error) => {
      return error
    })
}
