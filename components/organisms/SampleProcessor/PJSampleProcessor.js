import Loading from '@/components/atoms/Loading'
import { getData } from '@/functions/fetch'
import { useSession } from 'next-auth/react'
import Lines from './Lines'

export default function PJSampleProcessor({ brand }) {
  const { data: session } = useSession()

  const { data: linesData, loading } = getData(
    brand && session?.accessToken
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/?brand=${brand}&type=s&limit=20`
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

  return (
    <>
      {!loading ? (
        <div>
          {lines?.length > 0 ? (
            <>
              {orders &&
                Object.keys(orders).map((orderNumber, index) => (
                  <Lines
                    key={index}
                    line_items={orders[orderNumber]}
                    individualProcess={true}
                  />
                ))}
            </>
          ) : (
            <p className='mx-2 my-8 font-bold text-lg text-blue-700'>
              All set! No New orders here.
            </p>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
