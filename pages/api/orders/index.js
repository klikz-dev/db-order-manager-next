export default async function handler(req, res) {
  const { params } = req.body

  const data = await fetch(
    params
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/?${params}`
      : undefined,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    }
  )

  if (data.status !== 200) {
    res.status(data.status).send()
  } else {
    return res.status(200).send(await data.json())
  }
  return res
}
