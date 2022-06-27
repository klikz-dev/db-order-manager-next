import Loading from '@/components/atoms/Loading'
import Layout from '@/components/common/Layout'
import Customer from '@/components/organisms/Order/Customer'
import Information from '@/components/organisms/Order/Information'
import Address from '@/components/organisms/Order/Address'
import { getData } from '@/functions/fetch'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { putData } from '@/functions/put'
import Transaction from '@/components/organisms/Order/Transaction'
import Status from '@/components/organisms/Order/Status'
import Note from '@/components/organisms/Order/Note'
import Lines from '@/components/organisms/Order/Lines'

export default function Order() {
  const { data: session } = useSession()

  const router = useRouter()
  const { id } = router?.query || {}

  /**
   * Get Info
   */
  const { data: order } = getData(
    id ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}` : undefined,
    session?.accessToken
  )

  const { data: customer } = getData(
    order
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${order?.customerId}`
      : undefined,
    session?.accessToken
  )

  const { data: addressData } = getData(
    order
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addresses/?customer=${order?.customerId}`
      : undefined,
    session?.accessToken
  )
  const address = addressData?.results?.[0]

  const { data: linesData } = getData(
    id
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?order=${id}`
      : undefined,
    session?.accessToken
  )
  const { results: lines } = linesData ?? {}

  console.log(lines)

  /**
   * Update Order
   */
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

  return (
    <Layout title='Order Detail'>
      {order && lines ? (
        <div className='max-w-screen-2xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-3 gap-5'>
            <Information {...order} updateOrder={updateOrder} />

            <Customer
              customer={customer}
              address={address}
              orderNote={order.orderNote}
              updateOrder={updateOrder}
            />

            <Address order={order} updateOrder={updateOrder} />

            <Transaction {...order} updateOrder={updateOrder} />

            <Status order={order} updateOrder={updateOrder} />

            <Note order={order} updateOrder={updateOrder} />
          </div>

          <hr className='my-12' />

          <div>
            <Lines customer={customer} lines={lines} />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}
