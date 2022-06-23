import { getData } from '@/functions/fetch'
import { IdentificationIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'

export default function Customer({ customerId, accessToken }) {
  const { data: customer } = getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${customerId}`,
    accessToken
  )

  const { data: addressData } = getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addresses/?customer=${customerId}`,
    accessToken
  )
  const address = addressData?.results?.[0]

  const [note, setNote] = useState('')

  useEffect(() => {
    setNote(customer?.note ?? '')
  }, [customer])

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

      <div className='grid grid-cols-2 gap-4'>
        <div className='mb-4'>
          <p className='font-semibold'>Default Address: </p>
          <p>
            {address?.address1} {address?.address2},
          </p>
          <p>
            {address?.city}, {address?.state} {address?.zip},
          </p>
          <p>{address?.country}</p>
          <p>{address?.phone}</p>
        </div>

        <div>
          <p className='mb-2'>
            <span className='font-bold'>Total orders: </span>
            {customer?.orderCount}
          </p>

          <p className='mb-2'>
            <span className='font-bold'>Total spent: </span>$
            {customer?.totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      <label>
        <p className='font-semibold mb-1'>Note for the customer:</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-full bg-blue-100 text-base h-20'
        />
      </label>
    </div>
  )
}
