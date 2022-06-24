import Button from '@/components/atoms/Button'
import {
  CurrencyDollarIcon,
  PencilAltIcon,
  UploadIcon,
  XIcon,
} from '@heroicons/react/solid'
import { useState } from 'react'

export default function Transaction({
  totalItems,
  totalDiscounts,
  orderSubtotal,
  orderShippingCost,
  orderTax,
  orderTotal,
  updateOrder,
}) {
  const [edit, setEdit] = useState(false)
  const [total, setTotal] = useState(orderTotal)

  const [updateError, setUpdateError] = useState('')

  async function handleSave() {
    const res = await updateOrder({
      orderTotal: total,
    })

    if (res.status) {
      setEdit(false)
    } else {
      setUpdateError('Server Error. Update Failed')
    }
  }

  return (
    <>
      <div className='shadow-lg border rounded px-8 py-4'>
        <h3 className='mb-4 flex items-center'>
          <CurrencyDollarIcon width={24} height={24} />
          <span className='ml-2 uppercase'>Transaction</span>
        </h3>

        <p className='mb-2'>
          <span className='font-bold'>Item Total: </span>$
          {totalItems.toFixed(2)}
        </p>

        <p className='mb-2'>
          <span className='font-bold'>Discount: </span>$
          {totalDiscounts.toFixed(2)}
        </p>

        <p className='mb-2'>
          <span className='font-bold'>Subtotal: </span>$
          {orderSubtotal.toFixed(2)}
        </p>

        <p className='mb-2'>
          <span className='font-bold'>Tax: </span>${orderTax.toFixed(2)}
        </p>

        <p className='mb-4'>
          <span className='font-bold'>Shipping: </span>$
          {orderShippingCost.toFixed(2)}
        </p>

        <div className='flex gap-4 justify-between items-center pb-2 mb-2'>
          <p>
            <span className='font-bold'>Order Total: </span>
            <span className='text-red-700'>
              ${parseFloat(total).toFixed(2)}
            </span>
          </p>

          <Button type='tertiary' onClick={() => setEdit(true)}>
            <div className='flex items-center'>
              <PencilAltIcon width={16} height={16} />
              <span className='leading-4 ml-1'>Adjust</span>
            </div>
          </Button>
        </div>
      </div>

      {edit && (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-zinc-700 bg-opacity-40'>
          <div className='bg-white shadow-lg p-6 rounded'>
            <h4 className='font-semibold mb-6 text-blue-900'>Adjust billed:</h4>

            <div>
              <label className='block text-sm font-bold mb-1'>
                Order Total
              </label>
              <input
                type='number'
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className='bg-blue-50 text-base py-1 mb-2 rounded'
              />
            </div>

            <Button
              type='secondary'
              className='block mt-5'
              onClick={handleSave}
            >
              <div className='flex items-center'>
                <UploadIcon width={16} height={16} />
                <span className='leading-4 ml-1'>Save</span>
              </div>
            </Button>

            <Button
              type='tertiary'
              className='block mt-5 ml-2'
              onClick={() => setEdit(false)}
            >
              <div className='flex items-center'>
                <XIcon width={16} height={16} />
                <span className='leading-4 ml-1'>Dismiss</span>
              </div>
            </Button>

            {updateError && (
              <p className='text-red-700 text-sm mt-3'>{updateError}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
