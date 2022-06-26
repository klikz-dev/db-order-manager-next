import Line from './Line'

export default function Lines({ customer, lines }) {
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
        {lines?.length > 0 &&
          lines.map((line, index) => (
            <Line key={index} customer={customer} {...line} />
          ))}
      </tbody>
    </table>
  )
}
