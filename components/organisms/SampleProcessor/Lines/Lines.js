import classNames from 'classnames'
import dateFormat from 'dateformat'
import Line from '../../Line'

export default function Lines({ line_items }) {
  const order = line_items[0].order

  const specialShipping = order.shippingMethod?.toLowerCase().includes('2')
    ? order.shippingMethod
    : order.shippingMethod?.toLowerCase().includes('over')
    ? order.shippingMethod
    : order.shippingMethod?.toLowerCase().includes('international')
    ? 'International'
    : ''

  return (
    <div className='shadow-lg rounded mb-6 border border-gray-600'>
      <div className='p-4 grid grid-cols-5 gap-6 bg-blue-100'>
        <div>
          <a
            href={`/order/?id=${order?.shopifyId}`}
            target='_blank'
            rel='noreferrer'
            className='font-bold underline'
          >
            PO #{order?.po}
          </a>
          <p className='my-3'>
            <span className='font-bold'>Status:</span>{' '}
            <span
              className={classNames(
                order?.status === 'New'
                  ? 'bg-blue-600 text-white'
                  : order?.status === 'Processed'
                  ? 'bg-purple-600 text-white'
                  : order?.status === 'Stock OK'
                  ? 'bg-gray-200'
                  : order?.status.includes('Cancel')
                  ? 'bg-yellow-800 text-white'
                  : order?.status.includes('Refund')
                  ? 'bg-red-500 text-white'
                  : order?.status.includes('Approval')
                  ? 'bg-lime-700 text-white'
                  : 'bg-white',
                'px-2 py-0.5 rounded-sm'
              )}
            >
              {order?.status}
            </span>
          </p>
        </div>

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
          <p className='text-red-700'>{specialShipping}</p>
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
              <th>Ordered Price</th>
              <th>Current Price</th>
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
                  po={order.po}
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
