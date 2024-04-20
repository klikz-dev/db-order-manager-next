import Line from '../../Line'

export default function Lines({
  po,
  email,
  shippingFirstName,
  shippingLastName,
  lineItems,
}) {
  return (
    <table className='table-auto w-full border-collapse'>
      <thead>
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
        {lineItems?.length > 0 &&
          lineItems.map((lineItem, index) => (
            <Line
              key={index}
              po={po}
              email={email}
              shippingFirstName={shippingFirstName}
              shippingLastName={shippingLastName}
              {...lineItem}
            />
          ))}
      </tbody>
    </table>
  )
}
