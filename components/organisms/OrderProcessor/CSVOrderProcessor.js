import Button from '@/components/atoms/Button'
import Loading from '@/components/atoms/Loading'
import sendEmail from '@/functions/email'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Lines from './Lines'
import dateFormat from 'dateformat'
import { supplier } from '@/const/supplier'
import Papa from 'papaparse'

export default function OrderProcessor({ brand, updateOrder }) {
  const { data: session } = useSession()

  const { data: linesData, loading } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?brand=${brand}&type=o`
      : undefined,
    session?.accessToken
  )

  const lines = linesData?.results

  const orders =
    lines?.length > 0
      ? lines?.reduce((sum, ele) => {
          sum[ele.order.po] = sum[ele.order.po] || []
          sum[ele.order.po].push(ele)
          return sum
        }, {})
      : {}

  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setProcessing(false)
    setSuccess(false)
  }, [brand])

  async function handleProcess(e) {
    e.preventDefault()

    setProcessing(true)

    let startPO = 0
    let endPO = 0

    const csvData = []

    Object.keys(orders).map((po, index) => {
      if (index === 0) startPO = po
      endPO = po

      const line_items = orders[po]
      const order = line_items[0].order

      let shippingMethod = order?.shippingMethod
      let isExpedited = false
      if (shippingMethod?.includes('2')) {
        shippingMethod = '2nd Day'
        isExpedited = true
      } else if (
        shippingMethod?.includes('Next') ||
        shippingMethod?.includes('Overnight')
      ) {
        shippingMethod = 'Overnight'
        isExpedited = true
      } else if (shippingMethod?.includes('White')) {
        shippingMethod = 'White Glove'
        isExpedited = true
      } else {
        shippingMethod = 'Ground'
      }

      line_items.map((line_item) => {
        csvData.push({
          'PO #': po,
          SKU: line_item.product?.mpn,
          'Product Name': line_item.product?.title,
          Quantity: line_item.quantity,
          Type: 'Order',
          'Order Date': dateFormat(order?.orderDate, 'mm/dd/yyyy h:MM:ss TT'),
          'Customer Name': `${order?.shippingFirstName} ${order?.shippingLastName}`,
          'Customer Email': order?.email,
          'Customer Phone': order?.shippingPhone,
          'Shipping Address': `${order?.shippingAddress1} ${
            order?.shippingAddress2 ?? ''
          }, ${order?.shippingCity}, ${order?.shippingState} ${
            order?.shippingZip
          }, ${order?.shippingCountry}`,
          'Shipping Method': `${shippingMethod}${
            isExpedited ? ' (Expedited)' : ''
          }`,
        })
      })
    })

    const emailTitle =
      startPO === endPO
        ? `[${supplier[brand].account}] (DecoratorsBest) New Order PO #${startPO}`
        : `[${supplier[brand].account}] (DecoratorsBest) New Orders PO #${startPO} - PO #${endPO}`

    sendEmail(
      'order',
      `<Decoratorsbest Customer Success Center>`,
      supplier[brand].order,
      // 'murrell@decoratorsbest.com',
      emailTitle,
      `<p style="margin-bottom: 20px;">Hello! Thanks for processing the orders! Account ID: <strong>${supplier[brand].account}</strong></p>`,
      Papa.unparse(csvData)
    )

    const pos = Object.keys(orders).sort((a, b) => (a > b ? 1 : -1))

    // Update Order Status
    for (let i = 0; i < pos.length; i++) {
      const line_items = orders[pos[i]]
      const order = line_items[0].order

      if (order.status === 'New') {
        await updateOrder(order.shopifyId, {
          status: 'Reference# Needed',
        })
      }
    }

    // Update PO Config
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

      {success ? (
        <p className='mx-2 my-8 font-bold text-lg text-blue-700'>Complete!</p>
      ) : (
        <>
          {!loading ? (
            <div>
              {lines?.length > 0 ? (
                <>
                  {orders &&
                    Object.keys(orders).map((po, index) => (
                      <Lines key={index} line_items={orders[po]} />
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
        </>
      )}
    </>
  )
}
