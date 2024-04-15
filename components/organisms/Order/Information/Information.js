import Button from '@/components/atoms/Button'
import { InformationCircleIcon, UploadIcon } from '@heroicons/react/solid'
import dateFormat from 'dateformat'
import { useState } from 'react'

export default function Information({
  po,
  orderDate,
  updatedAt,
  manufacturers,
  reference: currentReference,
  updateOrder,
}) {
  const [reference, setReference] = useState(
    currentReference?.replace(/,/g, '\n')?.trim()
  )

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      reference: reference,
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
            <span className='font-bold'>PO #:</span> {po}
          </p>
        </div>

        <p className='mb-2'>
          <span className='font-semibold'>Order Date: </span>
          {dateFormat(orderDate, 'mm/dd/yyyy h:MM:ss TT Z')}
        </p>

        <p className='mb-4'>
          <span className='font-semibold'>Last Processed: </span>
          {dateFormat(updatedAt, 'mm/dd/yyyy h:MM:ss TT Z')}
        </p>

        <label className='block mb-4'>
          <p className='font-semibold mb-1'>Manufacturers:</p>
          <div>
            {manufacturers?.map((item) => (
              <p key={item.name}>
                {item.brand === item.name
                  ? item.name
                  : `${item.name} (${item.brand})`}
              </p>
            ))}
          </div>
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
