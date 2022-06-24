import Button from '@/components/atoms/Button'
import { IdentificationIcon, UploadIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export default function Customer({
  customer,
  address,
  orderNote,
  updateOrder,
}) {
  const [note, setNote] = useState(orderNote)

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      orderNote: note,
    })

    if (res.status) {
      setUpdateSuccess('Successfully updated.')
    } else {
      setUpdateError('Server Error. Update Failed')
    }
  }

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
          className='w-full bg-blue-50 rounded text-base h-20'
        />
      </label>

      <Button type='secondary' className='block mt-5' onClick={handleSave}>
        <div className='flex items-center'>
          <UploadIcon width={16} height={16} />
          <span className='leading-4 ml-1'>Save</span>
        </div>
      </Button>

      {updateSuccess && (
        <p className='text-blue-700 text-sm mt-3'>{updateSuccess}</p>
      )}

      {updateError && (
        <p className='text-red-700 text-sm mt-3'>{updateError}</p>
      )}
    </div>
  )
}
