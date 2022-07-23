import Button from '@/components/atoms/Button'
import Loading from '@/components/atoms/Loading'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Reference() {
  const router = useRouter()
  const { brand, po } = router.query

  const { data: session } = useSession()

  console.log(po)

  /**
   * Get Info
   */
  const { data: orderData } = getData(
    po
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/?po=${po}`
      : undefined,
    session?.accessToken
  )

  const order = orderData?.results?.length > 0 ? orderData.results[0] : null

  const { referenceNumber } = order ?? {}

  const [ref, setRef] = useState('')

  /**
   * Update Order
   */
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function updateOrder(data) {
    const res = await putData(
      order
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${order?.shopifyOrderId}/`
        : undefined,
      session?.accessToken,
      data
    )

    return res
  }

  async function saveRef() {
    setUpdating(true)

    const newRef = `${referenceNumber}\r\n${brand}: ${ref}`

    const res = await updateOrder({
      referenceNumber: newRef,
    })

    if (res.status) {
      setUpdateSuccess('Successfully updated.')
    } else {
      setUpdateError('Server Error. Update Failed')
    }

    setUpdating(false)
  }

  if (order) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <div>
          <h3 className='mb-3'>
            {brand} PO #{po} Reference Number
          </h3>

          <div className='flex items-center gap-2'>
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder='ABCD1234'
              className='rounded px-4 py-1 border border-blue-400 outline-none focus:border-blue-700'
            />

            <Button onClick={saveRef} disabled={updating}>
              Save
            </Button>
          </div>

          {updateSuccess && (
            <p className='text-blue-700 text-sm mt-3'>{updateSuccess}</p>
          )}

          {updateError && (
            <p className='text-red-700 text-sm mt-3'>{updateError}</p>
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Loading />
      </div>
    )
  }
}
