import Layout from '@/components/common/Layout'
import { useEffect, useState } from 'react'
import dateFormat from 'dateformat'
import styles from '@/styles/modules/orders.module.scss'
import Loading from '@/components/atoms/Loading'
import classNames from 'classnames'
import Filter from '@/components/organisms/Filter'
import { addDays } from 'date-fns'
import { getData } from '@/functions/fetch'

export default function Page() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function fetchData() {
      const fr = dateFormat(addDays(new Date(), -13), 'yy-m-d')
      const to = dateFormat(new Date(), 'yy-m-d')

      const ordersData = await getData(`limit=9999&from=${fr}&to=${to}`)
      setOrders(ordersData?.results || [])
    }
    fetchData()
  }, [])

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

  console.log(orders)

  useEffect(() => {
    setFilteredOrders(
      orders?.filter((o) => {
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
    setOrders([])

    const fr = dateFormat(dateRange.selection.startDate, 'yy-m-d')
    const to = dateFormat(dateRange.selection.endDate, 'yy-m-d')

    const ordersData = await getData(`limit=9999&from=${fr}&to=${to}`)
    setOrders(ordersData?.results || [])
  }

  async function poSearch() {
    setOrders([])

    const ordersData = await getData(`limit=9999&po=${orderNumber}`)
    setOrders(ordersData?.results || [])
  }

  async function customerSearch() {
    setOrders([])

    const ordersData = await getData(`limit=9999&customer=${customer}`)
    setOrders(ordersData?.results || [])
  }

  async function manufacturerSearch() {
    setOrders([])

    const ordersData = await getData(`limit=9999&manufacturer=${manufacturer}`)
    setOrders(ordersData?.results || [])
  }

  async function refSearch() {
    setOrders([])

    const ordersData = await getData(`limit=9999&ref=${reference}`)
    setOrders(ordersData?.results || [])
  }

  return (
    <Layout>
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
                    <td>{order.orderNumber}</td>
                    <td
                      className={classNames(
                        order.status === 'New'
                          ? 'bg-blue-600 text-white'
                          : order.status === 'Processed'
                          ? 'bg-purple-600 text-white'
                          : order.status === 'Stock OK'
                          ? 'bg-gray-200'
                          : order.status.includes('Cancel')
                          ? 'bg-yellow-800 text-white'
                          : order.status.includes('Refund')
                          ? 'bg-red-500 text-white'
                          : order.status.includes('Approval')
                          ? 'bg-lime-700 text-white'
                          : 'bg-white'
                      )}
                    >
                      <p>{order.status}</p>
                    </td>
                    <td>{dateFormat(order.orderDate, 'mm/dd/yy')}</td>
                    <td>{order.orderType}</td>
                    <td>
                      <p>
                        {order.billingFirstName} {order.billingLastName}
                      </p>
                      <a href={`mailto:${order.email}`} className='text-xs'>
                        {order.email}
                      </a>
                    </td>
                    <td>${order.orderTotal?.toFixed(2)}</td>
                    <td>{order.manufacturerList}</td>
                    <td>{order.specialShipping}</td>
                    <td>{order.referenceNumber}</td>
                    <td>{order.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </Layout>
  )
}
