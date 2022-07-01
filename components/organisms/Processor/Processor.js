import Button from '@/components/atoms/Button'
import Loading from '@/components/atoms/Loading'
import sendEmail from '@/functions/email'
import { getData } from '@/functions/fetch'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Lines from './Lines'

export default function Processor({ brand }) {
  const { data: session } = useSession()

  const { data: ordersData } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/?brand=${brand}`
      : undefined,
    session?.accessToken
  )
  const orders = ordersData?.results

  console.log(orders)
  // const lines = linesData?.results

  // const [orders, setOrders] = useState({})
  // useEffect(() => {
  //   setOrders(
  //     lines?.length > 0
  //       ? lines?.reduce((sum, ele) => {
  //           sum[ele.order] = sum[ele.order] || []
  //           sum[ele.order].push(ele)
  //           return sum
  //         }, {})
  //       : {}
  //   )
  // }, [lines])

  const [processing, setProcessing] = useState(false)

  function handleProcess(e) {
    e.preventDefault()

    setProcessing(true)

    // lines?.length > 0 &&
    //   lines.map((line) => {
    //     sendEmail(
    //       `<Decoratorsbest Customer Success Center>`,
    //       'murrell@decoratorsbest.com',
    //       `${line.orderedProductSKU}`,
    //       `
    //       <p>Hello, Thanks for processing the order!</p>
    //       <p style='margin-top: 20px; margin-bottom: 20px;'>${line.orderedProductSKU}</p>
    //       `
    //     )
    //   })

    // setOrders([])

    setProcessing(false)
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

      {orders?.length > 0 ? (
        <div>
          {orders.map((order, index) => (
            <Lines key={index} orderId={order.shopifyOrderId} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
