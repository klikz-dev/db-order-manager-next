import { getData } from '@/functions/fetch'
import { useSession } from 'next-auth/react'
import dateFormat from 'dateformat'
import Line from '../../Line'

export default function Lines({ orderId }) {
  const { data: session } = useSession()

  /**
   * Get Info
   */
  const { data: order } = getData(
    orderId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`
      : undefined,
    session?.accessToken
  )

  console.log(order)

  return (
    <div className='shadow-lg rounded mb-6'>
      <div className='p-4 grid grid-cols-3 gap-5 bg-blue-200'>
        <p>PO #{order?.orderNumber}</p>

        <div>
          <p>
            {order?.shippingFirstName} {order?.shippingLastName}
          </p>
          <p>
            {order?.shippingAddress1} {order?.shippingAddress1},{' '}
            {order?.shippingCity}, {order?.shippingState} {order?.shippingZip},{' '}
            {order?.shippingCountry}
          </p>
        </div>

        <div>
          <p>{order?.email}</p>

          <p>{dateFormat(order?.orderDate)}</p>
        </div>
      </div>

      <hr />

      <div className='p-4'>
        <table className='table-auto w-full border-collapse'>
          <thead className='text-base'>
            <tr>
              <th></th>
              <th>SKU</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Backorder Date</th>
              <th>Email Customer</th>
            </tr>
          </thead>

          <tbody>
            {order?.line_items?.length > 0 &&
              order.line_items.map((line_item, index) => (
                <Line
                  key={index}
                  email={order.email}
                  shippingFirstName={order.shippingFirstName}
                  shippingLastName={order.shippingLastName}
                  {...line_item}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
