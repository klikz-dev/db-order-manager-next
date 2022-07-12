import Button from '@/components/atoms/Button'
import Loading from '@/components/atoms/Loading'
import sendEmail from '@/functions/email'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Lines from './Lines'

export default function OrderProcessor({ brand }) {
  const { data: session } = useSession()

  const { data: linesData } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?brand=${brand}&type=o`
      : undefined,
    session?.accessToken
  )
  const lines = linesData?.results

  const [orders, setOrders] = useState({})
  useEffect(() => {
    setOrders(
      lines?.length > 0
        ? lines?.reduce((sum, ele) => {
            sum[ele.order.orderNumber] = sum[ele.order.orderNumber] || []
            sum[ele.order.orderNumber].push(ele)
            return sum
          }, {})
        : {}
    )
  }, [lines])

  const [processing, setProcessing] = useState(false)

  function handleProcess(e) {
    e.preventDefault()

    setProcessing(true)

    lines?.length > 0 &&
      lines.map((line) => {
        sendEmail(
          `<Decoratorsbest Customer Success Center>`,
          'murrell@decoratorsbest.com',
          `${line.orderedProductSKU}`,
          `
          <p>Hello, Thanks for processing the order!</p>
          <p style='margin-top: 20px; margin-bottom: 20px;'>KM SAVOR/BASIL</p>
          `
        )
      })

    setOrders([])

    setProcessing(false)

    const pos = Object.keys(orders).sort((a, b) => (a > b ? 1 : -1))

    const lastPO = pos.length > 0 ? pos[pos.length - 1] : -1

    if (lastPO > 0) {
      putData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pos/1/`,
        session?.accessToken,
        {
          [`${brand}Order`]: lastPO,
        }
      )
    }
  }

  return (
    <>
      <p className='text-red-800 inline-block px-2 py-1 font-bold mb-4'>
        Please do NOT close or refresh the page while processing.
      </p>

      <Button
        type='primary'
        className='mb-6'
        disabled={processing}
        onClick={handleProcess}
      >
        {processing ? 'Processing...' : 'Process Orders'}
      </Button>

      {lines ? (
        <div>
          {orders &&
            Object.keys(orders).map((orderNumber, index) => (
              <Lines key={index} line_items={orders[orderNumber]} />
            ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
