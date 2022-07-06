import Button from '@/components/atoms/Button'
import { InformationCircleIcon, UploadIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import dateFormat from 'dateformat'
import { useState } from 'react'

export default function Information({
  orderNumber,
  status,
  orderDate,
  updatedAt,
  manufacturerList,
  referenceNumber,
  updateOrder,
}) {
  const [manufacturers, setManufacturers] = useState(manufacturerList)
  const [reference, setReference] = useState(referenceNumber)

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      manufacturerList: manufacturers,
      referenceNumber: reference,
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
        <InformationCircleIcon width={24} height={24} />
        <span className='ml-2 uppercase'>Information</span>
      </h3>

      <div className='flex gap-4 justify-between pb-2 mb-2'>
        <p>
          <span className='font-bold'>PO #:</span> {orderNumber}
        </p>

        <p>
          <span className='font-bold'>Status:</span>{' '}
          <span
            className={classNames(
              status === 'New'
                ? 'bg-blue-600 text-white'
                : status === 'Processed'
                ? 'bg-purple-600 text-white'
                : status === 'Stock OK'
                ? 'bg-gray-200'
                : status.includes('Cancel')
                ? 'bg-yellow-800 text-white'
                : status.includes('Refund')
                ? 'bg-red-500 text-white'
                : status.includes('Approval')
                ? 'bg-lime-700 text-white'
                : 'bg-white',
              'px-2 py-0.5 rounded-sm'
            )}
          >
            {status}
          </span>
        </p>
      </div>

      <p className='mb-2'>
        <span className='font-semibold'>Order Date: </span>
        {dateFormat(orderDate)}
      </p>

      <p className='mb-4'>
        <span className='font-semibold'>Last Processed: </span>
        {dateFormat(updatedAt)}
      </p>

      <label className='block mb-4'>
        <p className='font-semibold mb-1'>Manufacturers:</p>
        <textarea
          value={manufacturers || ''}
          onChange={(e) => setManufacturers(e.target.value)}
          className='w-full bg-blue-50 rounded text-base h-20'
        />
      </label>

      <label>
        <p className='font-semibold mb-1'>Reference Number:</p>
        <textarea
          value={reference?.replace(/,/g, '\n')?.trim() || ''}
          onChange={(e) => setReference(e.target.value)}
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
