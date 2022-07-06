import Layout from '@/components/common/Layout'
import { useEffect, useState } from 'react'
import dateFormat from 'dateformat'
import styles from '@/styles/modules/orders.module.scss'
import Loading from '@/components/atoms/Loading'
import classNames from 'classnames'
import Filter from '@/components/organisms/Filter'
import { addDays } from 'date-fns'
import { getData } from '@/functions/fetch'
import { useSession } from 'next-auth/react'

export default function Orders() {
  const { data: session } = useSession()

  const [ordersURL, setOrdersURL] = useState(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/orders?limit=9999&from=${dateFormat(
      addDays(new Date(), -13),
      'yy-m-d'
    )}&to=${dateFormat(new Date(), 'yy-m-d')}`
  )

  const { data: orders, loading } = getData(ordersURL, session?.accessToken)

  /**
   * Filters
   */
  const [status, setStatus] = useState('All')
  const [order, setOrder] = useState(true)
  const [sample, setSample] = useState(true)
  const [ordersample, setOrdersample] = useState(true)
  const [complete, setComplete] = useState(true)
  const [incomplete, setIncomplete] = useState(true)

  const [filteredOrders, setFilteredOrders] = useState([])

  useEffect(() => {
    setFilteredOrders(
      orders?.results?.filter((o) => {
        if (status !== 'All' && status !== o.status) {
          return false
        }
        if (!order && o.orderType === 'Order') {
          return false
        }
        if (!sample && o.orderType === 'Sample') {
          return false
        }
        if (!ordersample && o.orderType === 'Order/Sample') {
          return false
        }
        if (
          !complete &&
          (o.status === 'Cancel' || o.status?.includes('Processed'))
        ) {
          return false
        }
        if (
          !incomplete &&
          o.status !== 'Cancel' &&
          !o.status?.includes('Processed')
        ) {
          return false
        }
        return true
      })
    )
  }, [orders, status, order, sample, ordersample, complete, incomplete])

  function resetFilters() {
    setStatus('All')
    setOrder(true)
    setSample(true)
    setOrdersample(true)
    setComplete(true)
    setIncomplete(true)
  }

  function resetSearch() {
    setOrderNumber('')
    setCustomer('')
    setManufacturer('')
    setReference('')
  }

  /**
   * Search Functions
   */
  const [dateRange, setDateRange] = useState({
    selection: {
      startDate: addDays(new Date(), -13),
      endDate: new Date(),
      key: 'selection',
    },
  })
  const [orderNumber, setOrderNumber] = useState('')
  const [customer, setCustomer] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [reference, setReference] = useState('')

  async function dateSearch() {
    resetFilters()
    resetSearch()

    const fr = dateFormat(dateRange.selection.startDate, 'yy-m-d')
    const to = dateFormat(dateRange.selection.endDate, 'yy-m-d')

    setOrdersURL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?limit=999&from=${fr}&to=${to}`
    )
  }

  async function poSearch() {
    resetFilters()

    setOrdersURL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?limit=999&po=${orderNumber}`
    )
  }

  async function customerSearch() {
    resetFilters()

    setOrdersURL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?limit=999&customer=${customer}`
    )
  }

  async function manufacturerSearch() {
    resetFilters()

    setOrdersURL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?limit=999&manufacturer=${manufacturer}`
    )
  }

  async function refSearch() {
    resetFilters()

    setOrdersURL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?limit=999&ref=${reference}`
    )
  }

  return (
    <Layout title='Order Manager'>
      <div className='w-full px-8 py-8'>
        <Filter
          status={status}
          setStatus={setStatus}
          order={order}
          setOrder={setOrder}
          sample={sample}
          setSample={setSample}
          ordersample={ordersample}
          setOrdersample={setOrdersample}
          complete={complete}
          setComplete={setComplete}
          incomplete={incomplete}
          setIncomplete={setIncomplete}
          dateRange={dateRange}
          setDateRange={setDateRange}
          orderNumber={orderNumber}
          setOrderNumber={setOrderNumber}
          customer={customer}
          setCustomer={setCustomer}
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
          reference={reference}
          setReference={setReference}
          dateSearch={dateSearch}
          poSearch={poSearch}
          customerSearch={customerSearch}
          manufacturerSearch={manufacturerSearch}
          refSearch={refSearch}
        />
      </div>

      <div className='min-h-full w-full px-8 py-8'>
        <div className={styles.root}>
          {loading ? (
            <Loading></Loading>
          ) : (
            <>
              {filteredOrders?.length > 0 ? (
                <table className='w-full table-auto border-collapse border'>
                  <thead className='sticky top-0 shadow bg-blue-100'>
                    <tr>
                      <th>PO #</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Customer</th>
                      <th>Order Total</th>
                      <th>Manufacturer</th>
                      <th>SpShip</th>
                      <th>Ref #</th>
                      <th>Note</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.shopifyOrderId}>
                        <td>
                          <a
                            href={`/order/?id=${order.shopifyOrderId}`}
                            target='_blank'
                            rel='noreferrer'
                            className='font-bold underline'
                          >
                            {order.orderNumber}
                          </a>
                        </td>

                        <td
                          className={classNames(
                            order.status === 'New'
                              ? 'bg-blue-600 text-white'
                              : order.status.includes('Processed')
                              ? 'bg-purple-600 text-white'
                              : order.status === 'Stock OK'
                              ? 'bg-gray-200'
                              : order.status.includes('Cancel') ||
                                order.status.includes('Hold')
                              ? 'bg-yellow-800 text-white'
                              : order.status.includes('Refund') ||
                                order.status.includes('Return')
                              ? 'bg-red-500 text-white'
                              : order.status.includes('Approval')
                              ? 'bg-lime-700 text-white'
                              : order.status.includes('Discontinued')
                              ? 'bg-gray-500 text-white'
                              : order.status.includes('EDI')
                              ? 'bg-sky-600 text-white font-medium'
                              : 'bg-white'
                          )}
                        >
                          <p>{order.status}</p>
                        </td>
                        <td>{dateFormat(order.orderDate, 'mm/dd/yy')}</td>
                        <td>{order.orderType}</td>
                        <td>
                          <p>
                            {order.shippingFirstName} {order.shippingLastName}
                          </p>
                          <a href={`mailto:${order.email}`} className='text-sm'>
                            {order.email}
                          </a>
                        </td>
                        <td>${order.orderTotal?.toFixed(2)}</td>
                        <td>{order.manufacturerList}</td>
                        <td>{order.specialShipping}</td>
                        <td>
                          <p className='whitespace-pre-line'>
                            {order.referenceNumber?.replace(/,/g, '\n')?.trim()}
                          </p>
                        </td>
                        <td>{order.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='p-4'>
                  <p className='text-red-800 font-medium text-center'>
                    No orders found matching with your filter
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
