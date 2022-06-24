import Button from '@/components/atoms/Button'
import { AdjustmentsIcon, UploadIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export default function Status({ order, updateOrder }) {
  const [customerCalled, setCustomerCalled] = useState(
    order.customerCalled === 1
  )
  const [customerChatted, setCustomerChatted] = useState(
    order.customerChatted === 1
  )
  const [customerEmailed, setCustomerEmailed] = useState(
    order.customerEmailed === 1
  )
  const [isFraud, setIsFraud] = useState(order.isFraud === 1)

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      customerCalled: customerCalled ? 1 : 0,
      customerChatted: customerChatted ? 1 : 0,
      customerEmailed: customerEmailed ? 1 : 0,
      isFraud: isFraud ? 1 : 0,
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

      <div className='mb-2'>
        <input
          type='checkbox'
          checked={customerCalled}
          onChange={() => setCustomerCalled(!customerCalled)}
          className='bg-blue-50 text-base rounded'
        />
        <label className='text-base font-bold ml-2'>Customer Called</label>
      </div>

      <div className='mb-2'>
        <input
          type='checkbox'
          checked={customerChatted}
          onChange={() => setCustomerChatted(!customerChatted)}
          className='bg-blue-50 text-base rounded'
        />
        <label className='text-base font-bold ml-2'>Customer Chatted</label>
      </div>

      <div className='mb-2'>
        <input
          type='checkbox'
          checked={customerEmailed}
          onChange={() => setCustomerEmailed(!customerEmailed)}
          className='bg-blue-50 text-base rounded'
        />
        <label className='text-base font-bold ml-2'>Customer Emailed</label>
      </div>

      <div className='mb-2'>
        <input
          type='checkbox'
          checked={isFraud}
          onChange={() => setIsFraud(!isFraud)}
          className='bg-blue-50 text-base rounded'
        />
        <label className='text-base font-bold ml-2'>Fraud Order</label>
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
