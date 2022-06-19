import Layout from '@/components/common/Layout'
import { getOrders } from '@/functions/getOrders'
import { useEffect, useState } from 'react'
import dateFormat from 'dateformat'

export default function Page() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function fetchData() {
      const ordersData = await getOrders(2022, 5, 20)
      setOrders(ordersData?.results || [])
    }
    fetchData()
  }, [])

  return (
    <Layout>
      <div className='container'>
        <table className='table-auto border-collapse border'>
          <thead>
            <tr>
              <th># PO</th>
              <th>Status</th>
              <th>Date</th>
              <th>Type</th>
              <th>Customer</th>
              <th>Order Total</th>
              <th>Manufacturer</th>
              <th>Ref #</th>
              <th>Note</th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {orders?.length > 0 &&
              orders.map((order) => (
                <tr key={order.shopifyOrderId}>
                  <td>{order.orderNumber}</td>
                  <td>{}</td>
                  <td>{dateFormat(order.orderDate)}</td>
                  <td>{order.orderType}</td>
                  <td>{}</td>
                  <td>{order.orderTotal}</td>
                  <td>{}</td>
                  <td>{order.referenceNumber}</td>
                  <td>{order.note}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
