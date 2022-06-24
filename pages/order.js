import Loading from '@/components/atoms/Loading'
import Layout from '@/components/common/Layout'
import Customer from '@/components/organisms/Order/Customer'
import Information from '@/components/organisms/Order/Information'
import Address from '@/components/organisms/Order/Address'
import { getData } from '@/functions/fetch'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { putData } from '@/functions/put'

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

  const { data: linesData } = getData(
    id
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?order=${id}`
      : undefined,
    session?.accessToken
  )
  const { results: lines } = linesData ?? {}

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

  /**
   * Update Data
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
    <Layout>
      {order && lines ? (
        <div className='max-w-screen-2xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-3 gap-5'>
            {order && <Information {...order} />}

            {customer && address && (
              <Customer customer={customer} address={address} />
            )}

            {order && <Address order={order} updateAddress={updateOrder} />}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}
