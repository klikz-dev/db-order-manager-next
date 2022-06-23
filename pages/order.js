import Loading from '@/components/atoms/Loading'
import Layout from '@/components/common/Layout'
import Customer from '@/components/organisms/Order/Customer'
import Information from '@/components/organisms/Order/Information'
import Address from '@/components/organisms/Order/Address'
import { getData } from '@/functions/fetch'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Order() {
  const { data: session } = useSession()

  const router = useRouter()
  const { id } = router?.query || {}

  const { data: order } = getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}`,
    session?.accessToken
  )

  const { data: linesData } = getData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?order=${id}`,
    session?.accessToken
  )
  const { results: lines } = linesData ?? {}

  const [manufacturers, setManufacturers] = useState('')
  const [reference, setReference] = useState('')

  useEffect(() => {
    setManufacturers(order?.manufacturerList ?? '')
    setReference(order?.referenceNumber ?? '')
  }, [order])

  return (
    <Layout>
      {order && lines ? (
        <div className='max-w-screen-2xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-3 gap-5'>
            <Information
              {...order}
              manufacturers={manufacturers}
              setManufacturers={setManufacturers}
              reference={reference}
              setReference={setReference}
            />

            <Customer
              customerId={order?.customerId}
              accessToken={session?.accessToken}
            />

            {order && (
              <Address order={order} accessToken={session?.accessToken} />
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}
