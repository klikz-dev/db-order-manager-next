import dateFormat from 'dateformat'
import Line from '../../Line'

export default function Lines({ line_items }) {
  const order = line_items[0].order

  return (
    <div className='shadow-lg rounded mb-6 border border-gray-600'>
      <div className='p-4 grid grid-cols-5 gap-6 bg-blue-100'>
        <a
          href={`/order/?id=${order?.shopifyOrderId}`}
          target='_blank'
          rel='noreferrer'
          className='font-bold underline'
        >
          PO #{order?.orderNumber}
        </a>

        <div>
          <p className='font-bold'>
            {order?.shippingFirstName} {order?.shippingLastName}
          </p>
          <p>
            {order?.shippingAddress1} {order?.shippingAddress1},{' '}
            {order?.shippingCity}, {order?.shippingState} {order?.shippingZip},{' '}
            {order?.shippingCountry}
          </p>
        </div>

        <div>
          <a href={`mailto:${order?.email}`}>{order?.email}</a>

          <p>{dateFormat(order?.orderDate)}</p>
        </div>

        <div>
          <p>{order?.note}</p>
        </div>

        <div>
          <p className='text-red-700'>{order?.specialShipping}</p>
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
            {line_items?.length > 0 &&
              line_items.map((line_item, index) => (
                <Line
                  key={index}
                  orderNumber={order.orderNumber}
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
