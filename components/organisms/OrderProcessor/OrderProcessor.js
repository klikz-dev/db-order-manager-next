import Button from '@/components/atoms/Button'
import Loading from '@/components/atoms/Loading'
import sendEmail from '@/functions/email'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Lines from './Lines'
import dateFormat from 'dateformat'

export default function OrderProcessor({ brand }) {
  const { data: session } = useSession()

  const { data: linesData } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?brand=${brand}&type=o&limit=999`
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

    let startPO = 0
    let endPO = 0

    const emailContent = Object.keys(orders).map((orderNumber, index) => {
      if (index === 0) startPO = orderNumber
      endPO = orderNumber

      const line_items = orders[orderNumber]
      const order = line_items[0].order

      const lineItemsContent = line_items.map(
        (line_item) => `
        <tr>
          <td style="border: 1px solid #3A3A3A; text-align: center;">${line_item.orderedProductSKU}</td>
          <td style="border: 1px solid #3A3A3A; text-align: center;">${line_item.quantity}</td>
          <td style="border: 1px solid #3A3A3A; text-align: center;">Order</td>
        </tr>
      `
      )

      return `
        <div style="border: 1px solid #1e1e1e; padding: 12px; max-width: 800px;">
          <p style="margin-bottom: 8px;">
            <span style="margin-right: 12px;">PO: <strong>#${orderNumber}</strong></span>
            <span style="margin-right: 12px;">Order Date: <strong>#${dateFormat(
              order?.orderDate
            )}</strong></span>
          </p>

          <p style="margin-bottom: 8px;">
            <span style="margin-right: 12px;">Name: <strong>${
              order?.shippingFirstName
            } ${order?.shippingLastName}</strong></span>
            <span style="margin-right: 12px;">Email: <strong>${
              order?.email
            }</strong></span>
            <span style="margin-right: 12px;">Phone: <strong>${
              order?.shippingPhone
            }</strong></span>
          </p>

          <p style="margin-bottom: 8px;">
            <span style="margin-right: 12px;">
              Address: 
              <strong>${order?.shippingAddress1} ${order?.shippingAddress2}, ${
        order?.shippingCity
      }, ${order?.shippingState} ${order?.shippingZip}, ${
        order?.shippingCountry
      }
              </strong>
            </span>
          </p>

          <h3 style="margin-bottom: 8px;">Line Items</h3>
          <table style="border-collapse: collapse; width: 360px;">
            <thead>
              <tr>
                <th style="border: 1px solid #3A3A3A; text-align: center;"><strong>SKU</strong></th>
                <th style="border: 1px solid #3A3A3A; text-align: center;"><strong>Quantity</strong></th>
                <th style="border: 1px solid #3A3A3A; text-align: center;"><strong>Type</strong></th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsContent}
            </tbody>
          </table>
        </div>
      `
    })

    const emailTitle =
      startPO === endPO
        ? `DecoratorsBest New Order PO #${startPO}`
        : `DecoratorsBest New Orders PO #${startPO} - PO #${endPO}`

    sendEmail(
      `<Decoratorsbest Customer Success Center>`,
      'murrell@decoratorsbest.com',
      emailTitle,
      `<p style="margin-bottom: 20px;">Hello! Thanks for processing the orders!</p>${emailContent.join()}`
    )

    const pos = Object.keys(orders).sort((a, b) => (a > b ? 1 : -1))

    const lastPO = pos.length > 0 ? pos[pos.length - 1] : -1

    if (lastPO > 0) {
      await putData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pos/1/`,
        session?.accessToken,
        {
          field: `${brand.replace(/ /g, '')}Order`,
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
        disabled={processing || !lines || lines?.length === 0 || success}
        onClick={handleProcess}
      >
        {processing ? 'Processing...' : 'Process Orders'}
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
