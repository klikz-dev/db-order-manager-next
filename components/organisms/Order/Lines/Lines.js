import Line from '../../Line'

export default function Lines({
  orderNumber,
  email,
  shippingFirstName,
  shippingLastName,
  line_items,
}) {
  return (
    <table className='table-auto w-full border-collapse'>
      <thead>
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
              orderNumber={orderNumber}
              email={email}
              shippingFirstName={shippingFirstName}
              shippingLastName={shippingLastName}
              {...line_item}
            />
          ))}
      </tbody>
    </table>
  )
}
