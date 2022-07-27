import Button from '@/components/atoms/Button'
import {
  InformationCircleIcon,
  PencilAltIcon,
  UploadIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import classNames from 'classnames'
import dateFormat from 'dateformat'
import { useState } from 'react'

export default function Information({
  orderNumber,
  status: orderStatus,
  orderDate,
  updatedAt,
  manufacturerList,
  referenceNumber,
  updateOrder,
}) {
  const [edit, setEdit] = useState(false)

  const [status, setStatus] = useState(orderStatus)
  const [manufacturers, setManufacturers] = useState(manufacturerList)
  const [reference, setReference] = useState(
    referenceNumber.replace(/,/g, '\n')?.trim()
  )

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      status: status,
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
    <>
      <div className='shadow-lg border rounded px-8 py-4'>
        <h3 className='mb-4 flex items-center'>
          <InformationCircleIcon width={24} height={24} />
          <span className='ml-2 uppercase'>Information</span>
        </h3>

        <div className='flex gap-4 justify-between pb-2 mb-2 h-8'>
          <p>
            <span className='font-bold'>PO #:</span> {orderNumber}
          </p>

          <div className='flex gap-3 items-center'>
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
                  <option value='Stock OK'>Stock OK</option>
                  <option value='Hold'>Hold</option>
                  <option value='Back Order'>Back Order</option>
                  <option value='Cancel'>Cancel</option>
                  <option value='Cancel Pending'>Cancel Pending</option>
                  <option value='Client OK'>Client OK</option>
                  <option value='Pay Manufacturer'>Pay Manufacturer</option>
                  <option value='CFA Cut For Approval'>
                    CFA Cut For Approval
                  </option>
                  <option value='Discontinued'>Discontinued</option>
                  <option value='Call Client'>Call Client</option>
                  <option value='Call Manufacturer'>Call Manufacturer</option>
                  <option value='Overnight Shipping'>Overnight Shipping</option>
                  <option value='2nd Day Shipping'>2nd Day Shipping</option>
                  <option value='Return'>Return</option>
                  <option value='Processed Back Order'>
                    Processed Back Order
                  </option>
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
        </div>

        <p className='mb-2'>
          <span className='font-semibold'>Order Date: </span>
          {dateFormat(orderDate, 'mm/dd/yyyy h:MM:ss TT')}
        </p>

        <p className='mb-4'>
          <span className='font-semibold'>Last Processed: </span>
          {dateFormat(updatedAt, 'mm/dd/yyyy h:MM:ss TT')}
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
            value={reference}
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
    </>
  )
}
