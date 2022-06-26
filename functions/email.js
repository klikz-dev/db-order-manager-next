export default function sendEmail(from, to, subject, html) {
  fetch('/api/email', {
    method: 'POST',
    body: JSON.stringify({
      from: from,
      to: to,
      subject: subject,
      html: html,
    }),
  })
    .then((res) => {
      return res
    })
    .catch((error) => {
      return error
    })
}
