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

export default function SampleProcessor({ brand, updateOrder }) {
  const { data: session } = useSession()

  const { data: linesData, loading } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?brand=${brand}&type=s&limit=1000`
      : undefined,
    session?.accessToken
  )

  const lines = linesData?.results

  const orders =
    lines?.length > 0
      ? lines?.reduce((sum, ele) => {
          sum[ele.order.orderNumber] = sum[ele.order.orderNumber] || []
          sum[ele.order.orderNumber].push(ele)
          return sum
        }, {})
      : {}

  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const [showPhone, setShowPhone] = useState(false)

  useEffect(() => {
    setProcessing(false)
    setSuccess(false)
    if (brand === 'MindTheGap' || brand === 'Walls Republic') {
      setShowPhone(true)
    } else {
      setShowPhone(false)
    }
  }, [brand])

  async function handleProcess(e) {
    e.preventDefault()

    setProcessing(true)

    let startPO = 0
    let endPO = 0

    // const manualPOs = ['534876', '534906', '534911', '534990', '535027']

    const emailContent = Object.keys(orders).map((orderNumber, index) => {
      // if (!manualPOs.includes(orderNumber)) {
      //   return
      // }

      if (index === 0) startPO = orderNumber
      endPO = orderNumber

      const line_items = orders[orderNumber]
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

      const lineItemsContent = line_items.map(
        (line_item) => `
        <tr>
          <td style="border: 1px solid #3A3A3A; text-align: center;">
            ${
              line_item.variant?.product?.manufacturerPartNumber ??
              line_item.orderedProductSKU
            }
          </td>
          <td style="border: 1px solid #3A3A3A; text-align: center;">
            ${line_item.orderedProductTitle}
          </td>
          <td style="border: 1px solid #3A3A3A; text-align: center;">${
            line_item.quantity
          }</td>
          <td style="border: 1px solid #3A3A3A; text-align: center;">Sample</td>
        </tr>
      `
      )

      return `
        <div style="border: 1px solid #1e1e1e; padding: 12px; max-width: 800px;">
          <p style="margin-bottom: 8px;">
            <span style="margin-right: 12px;">PO: <strong>#${orderNumber}</strong></span>
            <span style="margin-right: 12px;">Order Date: <strong>${dateFormat(
              order?.orderDate,
              'mm/dd/yyyy h:MM:ss TT'
            )}</strong></span>
          </p>

          <p style="margin-bottom: 8px;">
            <span style="margin-right: 12px;">Name: <strong>${
              order?.shippingFirstName
            } ${order?.shippingLastName}</strong></span>
            <span style="margin-right: 12px;">${showPhone ? 'Phone: ' : ''}
            <strong>${showPhone ? order?.shippingPhone : ''}</strong></span>
          </p>

          <p style="margin-bottom: 8px;">
            <span style="margin-right: 12px;">
              Address: 
              <strong>${order?.shippingAddress1} ${
        order?.shippingAddress2 ?? ''
      }, ${order?.shippingCity}, ${order?.shippingState} ${
        order?.shippingZip
      }, ${order?.shippingCountry}
              </strong>
            </span>
          </p>

          <p style="margin-bottom: 16px;">
            <span style="margin-right: 12px;">Shipping Method: <strong style="${
              isExpedited && 'color: red;'
            }">${shippingMethod}</strong></span>
          </p>

          <h3 style="margin-bottom: 8px;">Line Items</h3>
          <table style="border-collapse: collapse; width: 540px; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #3A3A3A; text-align: center; width: 100px;"><strong>SKU</strong></th>
                <th style="border: 1px solid #3A3A3A; text-align: center;"><strong>Product Name</strong></th>
                <th style="border: 1px solid #3A3A3A; text-align: center; width: 70px;"><strong>Quantity</strong></th>
                <th style="border: 1px solid #3A3A3A; text-align: center; width: 60px;"><strong>Type</strong></th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsContent.join()}
            </tbody>
          </table>
          
          <div style="margin-bottom: 20px;">
            <a href="${
              process.env.NEXT_PUBLIC_FRONTEND_URL
            }/reference/?brand=${brand}&po=${orderNumber}">Input Reference Number</a>
          </div>
        </div>
      `
    })

    const emailTitle =
      startPO === endPO
        ? `[${supplier[brand].account}] (DecoratorsBest) New Sample PO #${startPO}`
        : `[${supplier[brand].account}] (DecoratorsBest) New Samples PO #${startPO} - PO #${endPO}`

    sendEmail(
      'sample',
      `<Decoratorsbest Customer Success Center>`,
      supplier[brand].sample,
      // 'murrell@decoratorsbest.com',
      emailTitle,
      `<p style="margin-bottom: 20px;">Hello! Thanks for processing the samples! Account ID: <strong>${
        supplier[brand].account
      }</strong></p>${emailContent.join()}`
    )

    const pos = Object.keys(orders).sort((a, b) => (a > b ? 1 : -1))

    // Update Order Status
    for (let i = 0; i < pos.length; i++) {
      const line_items = orders[pos[i]]
      const order = line_items[0].order

      if (order.status === 'New') {
        await updateOrder(order.shopifyOrderId, {
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
          field: `${brand.replace(/ /g, '').replace(/\//g, '')}Sample`,
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
        {processing ? 'Processing...' : 'Process Samples'}
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
        </>
      )}
    </>
  )
}
