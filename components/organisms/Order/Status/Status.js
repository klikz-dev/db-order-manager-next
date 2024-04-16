import Button from '@/components/atoms/Button'
import {
  AdjustmentsIcon,
  PencilAltIcon,
  UploadIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import classNames from 'classnames'
import { useState } from 'react'
import Oversized from './Oversized'

export default function Status({ order, updateOrder, trackings }) {
  const { line_items } = order ?? {}

  const [specialShipping, setSpecialShipping] = useState(
    order.shippingMethod?.toLowerCase().includes('2')
      ? '2nd Day'
      : order.shippingMethod?.toLowerCase().includes('over')
      ? 'Overnight'
      : order.shippingMethod?.toLowerCase().includes('international')
      ? 'International'
      : ''
  )

  const [edit, setEdit] = useState(false)
  const [status, setStatus] = useState(order.status)

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      shippingMethod: specialShipping,
      status: status,
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
        <AdjustmentsIcon width={24} height={24} />
        <span className='ml-2 uppercase'>Status</span>
      </h3>

      <div className='flex gap-3 items-center mb-8'>
        {edit ? (
          <>
            <select
              className='w-56 py-1.5 rounded text-base'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='All'>All</option>
              <option value='New'>New</option>
              <option value='Reference# Needed'>Reference# Needed</option>
              <option value='BackOrder Reference# Needed'>
                BackOrder Reference# Needed
              </option>
              <option value='Reference# Needed - Manually'>
                Reference# Needed - Manually
              </option>
              <option value='Stock OK'>Stock OK</option>
              <option value='Hold'>Hold</option>
              <option value='Back Order'>Back Order</option>
              <option value='Cancel'>Cancel</option>
              <option value='Cancel Pending'>Cancel Pending</option>
              <option value='Client OK'>Client OK</option>
              <option value='Pay Manufacturer'>Pay Manufacturer</option>
              <option value='CFA Cut For Approval'>CFA Cut For Approval</option>
              <option value='Discontinued'>Discontinued</option>
              <option value='Call Client'>Call Client</option>
              <option value='Call Manufacturer'>Call Manufacturer</option>
              <option value='Overnight Shipping'>Overnight Shipping</option>
              <option value='2nd Day Shipping'>2nd Day Shipping</option>
              <option value='Return'>Return</option>
              <option value='Processed Back Order'>Processed Back Order</option>
              <option value='Processed Refund'>Processed Refund</option>
              <option value='Processed Cancel'>Processed Cancel</option>
              <option value='Processed Return'>Processed Return</option>
              <option value='Processed'>Processed</option>
            </select>

            <XCircleIcon
              width={16}
              height={16}
              onClick={() => setEdit(false)}
            />
          </>
        ) : (
          <>
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

            <PencilAltIcon
              width={16}
              height={16}
              onClick={() => setEdit(true)}
            />
          </>
        )}
      </div>

      <div className='mb-8'>
        <label className='text-base font-bold mr-2'>Special Shipping: </label>
        <select
          value={specialShipping}
          onChange={(e) => setSpecialShipping(e.target.value)}
          className='bg-blue-50 text-base py-1 mb-2 rounded'
        >
          <option value=''>None</option>
          <option value='Overnight'>Overnight</option>
          <option value='2nd Day'>2nd Day</option>
          <option value='International'>International</option>
        </select>
      </div>

      <div className='mb-4'>
        <label className='block text-base font-bold mb-1'>Tracking:</label>

        <p>{order.customerOrderStatus}</p>
        {trackings?.length > 0 &&
          trackings.map((tracking, index) => (
            <p key={index}>
              {tracking.brand}: {tracking.number}
            </p>
          ))}
      </div>

      <div className='mb-4'>
        <label className='block text-base font-bold mb-1'>
          {'Over-sized items:'}
        </label>

        {line_items?.map((line_item, index) => (
          <Oversized key={index} line_item={line_item} />
        ))}
      </div>

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
