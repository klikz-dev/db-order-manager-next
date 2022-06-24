import Button from '@/components/atoms/Button'
import { DocumentTextIcon, UploadIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export default function Note({ order, updateOrder }) {
  const [specialShipping, setSpecialShipping] = useState(order.specialShipping)
  const [note, setNote] = useState(order.note)

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      specialShipping: specialShipping,
      note: note,
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
        <DocumentTextIcon width={24} height={24} />
        <span className='ml-2 uppercase'>Note</span>
      </h3>

      <div className='mb-2'>
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

      <div className='mb-2'>
        <label className='block text-base font-bold mb-1'>Note</label>
        <textarea
          value={note || ''}
          onChange={(e) => setNote(e.target.value)}
          className='bg-blue-50 text-base py-1 mb-2 rounded w-full h-20'
        />
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
