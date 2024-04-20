import { IdentificationIcon } from '@heroicons/react/solid'

export default function Customer({ customer, customerNote }) {
  return (
    <div className='shadow-lg border rounded px-8 py-4'>
      <h3 className='mb-4 flex items-center'>
        <IdentificationIcon width={24} height={24} />
        <span className='ml-2 uppercase'>Customer</span>
      </h3>

      <div className='flex flex-wrap gap-2 mb-4'>
        {customer?.tags?.split(',').map((tag, index) => (
          <span
            key={index}
            className='px-2 py-0.5 rounded-sm bg-zinc-700 text-sm text-white'
          >
            {tag}
          </span>
        ))}
      </div>

      <p className='mb-2'>
        <span className='font-bold'>Name: </span>
        {customer?.firstName} {customer?.lastName}
      </p>

      <p className='mb-4'>
        <span className='font-semibold'>Email: </span>
        <a href={`mailto:${customer?.email}`}>{customer?.email}</a>
      </p>

      <div className='grid grid-cols-1 gap-4'>
        <div className='mb-4'>
          <p className='font-semibold'>Default Address: </p>
          <p>
            {customer?.address1} {customer?.address2}
          </p>
          <p>
            {customer?.city}, {customer?.state} {customer?.zip},
          </p>
          <p>{customer?.country}</p>
          <p>{customer?.phone}</p>
        </div>

        {/* <div>
          <p className='mb-2'>
            <span className='font-bold'>Total orders: </span>
            {customer?.orderCount}
          </p>

          <p className='mb-2'>
            <span className='font-bold'>Total spent: </span>$
            {customer?.totalSpent.toFixed(2)}
          </p>
        </div> */}
      </div>

      <div className='mb-6'>
        <p className='font-semibold mb-2'>Note from customer:</p>
        <p className='bg-gray-200 p-1 font-bold text-red-800 text-lg'>
          {customerNote}
        </p>
      </div>
    </div>
  )
}
