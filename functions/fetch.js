export async function getData(params) {
  const res = await fetch('/api/orders/', {
    method: 'POST',
    body: JSON.stringify({ params: params }),
    headers: { 'Content-Type': 'application/json' },
  })
  const orders = await res.json()

  return orders
}
