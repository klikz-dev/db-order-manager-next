import Button from '@/components/atoms/Button'
import Loading from '@/components/atoms/Loading'
import sendEmail from '@/functions/email'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Lines from './Lines'
import dateFormat from 'dateformat'

export default function SampleProcessor({ brand }) {
  const { data: session } = useSession()

  const { data: linesData } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?brand=${brand}&type=s&limit=999`
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
    return () => {
      setSuccess(false)
    }
  }, [lines])

  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleProcess(e) {
    e.preventDefault()

    setProcessing(true)

    lines?.length > 0 &&
      lines.map(async (line) => {
        await sendEmail(
          `<Decoratorsbest Customer Success Center>`,
          'ashley@decoratorsbest.com',
          `DecoratorsBest New Sample Order PO #${line.order?.orderNumber}`,
          `
          <p><strong>Hello, Thanks for processing the sample order!</strong></p>

          <div style='margin-top: 20px; margin-bottom: 20px;'>
            <h3 style='margin-bottom: 8px;'>Order Information: </h3>
            <p style='margin-bottom: 8px;'>PO: ${line.order?.orderNumber}</p>
            <p style='margin-bottom: 8px;'>SKU: ${line.orderedProductSKU}</p>
            <p style='margin-bottom: 8px;'>Quantity: ${line.quantity}</p>
            <p style='margin-bottom: 32px;'>Ordered Date: ${dateFormat(
              line.order?.orderDate
            )}</p>

            <h3 style='margin-bottom: 8px;'>Customer Information: </h3>
            <p style='margin-bottom: 8px;'>Email: ${line.order?.email}</p>
            <p style='margin-bottom: 8px;'>Name: ${
              line.order?.shippingFirstName
            } ${line.order?.shippingLastName}</p>
            <p style='margin-bottom: 8px;'>Phone: ${
              line.order?.shippingPhone
            }</p>
            <p style='margin-bottom: 8px;'>Address: ${
              line.order?.shippingAddress1
            } ${line.order?.shippingAddress2}, ${line.order?.shippingCity}, ${
            line.order?.shippingState
          } ${line.order?.shippingZip}, ${line.order?.shippingCountry}</p>
          </div>
          `
        )
      })

    const pos = Object.keys(orders).sort((a, b) => (a > b ? 1 : -1))

    const lastPO = pos.length > 0 ? pos[pos.length - 1] : -1

    if (lastPO > 0) {
      await putData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pos/1/`,
        session?.accessToken,
        {
          field: `${brand.replace(/ /g, '')}Sample`,
          lastPO: lastPO,
        }
      )
    }

    setOrders([])
    setProcessing(false)
    setSuccess(true)
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
        {processing ? 'Processing...' : 'Process Samples'}
      </Button>

      {lines ? (
        <div>
          {lines.length > 0 ? (
            <>
              {orders &&
                Object.keys(orders).map((orderNumber, index) => (
                  <Lines key={index} line_items={orders[orderNumber]} />
                ))}
            </>
          ) : (
            <>
              {!success && (
                <p className='mx-2 my-8 font-bold text-lg text-blue-700'>
                  All set! No New orders here.
                </p>
              )}
            </>
          )}
        </div>
      ) : (
        <Loading />
      )}

      {success && (
        <p className='mx-2 my-8 font-bold text-lg text-blue-700'>Complete!</p>
      )}
    </>
  )
}
