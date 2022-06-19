export async function getOrders(year, month, day) {
  const res = await fetch('/api/orders/', {
    method: 'POST',
    body: JSON.stringify({ year: year, month: month, day: day }),
    headers: { 'Content-Type': 'application/json' },
  })
  const orders = await res.json()

  return orders
}
