import Line from './Line'

export default function Lines({ lines }) {
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
        </tr>
      </thead>

      <tbody>
        {lines?.length > 0 &&
          lines.map((line, index) => <Line key={index} {...line} />)}
      </tbody>
    </table>
  )
}
