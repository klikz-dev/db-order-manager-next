export default async function handler(req, res) {
  console.log(req.body)
  const { year, month, day } = req.body

  const data = await fetch(
    year && month && day
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/?limit=1000&year=${year}&month=${month}&day=${day}`
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
