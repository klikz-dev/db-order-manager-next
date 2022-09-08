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
import { putData } from '@/functions/put'
import { PencilAltIcon, UploadIcon, XCircleIcon } from '@heroicons/react/solid'
import Button from '@/components/atoms/Button'

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

  const [price100, setPrice100] = useState(true)
  const [price100to200, setPrice100to200] = useState(true)
  const [price200to500, setPrice200to500] = useState(true)
  const [price500to1000, setPrice500to1000] = useState(true)
  const [price1000, setPrice1000] = useState(true)

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
        if (!price100 && parseFloat(o.orderTotal) < 100) {
          return false
        }
        if (
          !price100to200 &&
          parseFloat(o.orderTotal) >= 100 &&
          parseFloat(o.orderTotal) < 200
        ) {
          return false
        }
        if (
          !price200to500 &&
          parseFloat(o.orderTotal) >= 200 &&
          parseFloat(o.orderTotal) < 500
        ) {
          return false
        }
        if (
          !price500to1000 &&
          parseFloat(o.orderTotal) >= 500 &&
          parseFloat(o.orderTotal) < 1000
        ) {
          return false
        }
        if (!price1000 && parseFloat(o.orderTotal) >= 1000) {
          return false
        }
        return true
      })
    )
  }, [
    orders,
    status,
    order,
    sample,
    ordersample,
    complete,
    incomplete,
    price100,
    price100to200,
    price200to500,
    price500to1000,
    price1000,
  ])

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

  const [bulkEdit, setBulkEdit] = useState(false)
  const [newStatus, setNewStatus] = useState('New')
  const [selectedOrders, setSelectedOrders] = useState([])
  const [processing, setProcessing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [updateError, setUpdateError] = useState('')

  function selectOrder(id) {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  /**
   * Update Order
   */
  async function updateOrder() {
    if (selectedOrders.length < 1) {
      setUpdateError('Select at least 1 order')
    } else {
      setProcessing(true)
      for (let i = 0; i < selectedOrders.length; i++) {
        const orderId = selectedOrders[i]

        await putData(
          order
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}/`
            : undefined,
          session?.accessToken,
          { status: newStatus }
        )
      }
      setProcessing(false)
      setUpdateSuccess('Order statuses have been updated successfully')
      setBulkEdit(false)
    }
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
          price100={price100}
          setPrice100={setPrice100}
          price100to200={price100to200}
          setPrice100to200={setPrice100to200}
          price200to500={price200to500}
          setPrice200to500={setPrice200to500}
          price500to1000={price500to1000}
          setPrice500to1000={setPrice500to1000}
          price1000={price1000}
          setPrice1000={setPrice1000}
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
        <div className='shadow-lg rounded p-4 mb-8 bg-gray-200'>
          {bulkEdit ? (
            <div className='flex gap-4'>
              <select
                className='w-56 py-1.5 rounded text-base'
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value='New'>New</option>
                <option value='Reference# Needed'>Reference# Needed</option>
                <option value='BackOrder Reference# Needed'>
                  BackOrder Reference# Needed
                </option>
                <option value='Reference# Needed - Manually'>
                  Reference# Needed - Manually
                </option>
                <option value='Stock OK'>Stock OK</option>
                <option value='Hold'>Hold</option>
                <option value='Back Order'>Back Order</option>
                <option value='Cancel'>Cancel</option>
                <option value='Cancel Pending'>Cancel Pending</option>
                <option value='Client OK'>Client OK</option>
                <option value='Pay Manufacturer'>Pay Manufacturer</option>
                <option value='CFA Cut For Approval'>
                  CFA Cut For Approval
                </option>
                <option value='Discontinued'>Discontinued</option>
                <option value='Call Client'>Call Client</option>
                <option value='Call Manufacturer'>Call Manufacturer</option>
                <option value='Overnight Shipping'>Overnight Shipping</option>
                <option value='2nd Day Shipping'>2nd Day Shipping</option>
                <option value='Return'>Return</option>
                <option value='Processed Back Order'>
                  Processed Back Order
                </option>
                <option value='Processed Refund'>Processed Refund</option>
                <option value='Processed Cancel'>Processed Cancel</option>
                <option value='Processed Return'>Processed Return</option>
                <option value='Processed'>Processed</option>
              </select>

              <Button onClick={updateOrder} disabled={processing}>
                <UploadIcon width={16} height={16} />
                <span className='text-base ml-2'>Update</span>
              </Button>

              <Button
                type='secondary'
                onClick={() => setBulkEdit(false)}
                disabled={processing}
              >
                <XCircleIcon width={16} height={16} />
                <span className='text-base ml-2'>Dismiss</span>
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={() => {
                  setBulkEdit(true)
                  setUpdateSuccess('')
                  setUpdateError('')
                }}
              >
                <PencilAltIcon width={16} height={16} />
                <span className='text-base ml-2'>
                  {'Update multiple order status'}
                </span>
              </Button>
            </>
          )}

          {updateSuccess && (
            <p className='text-blue-700 mt-2'>{updateSuccess}</p>
          )}
          {updateError && <p className='text-red-700 mt-2'>{updateError}</p>}
        </div>

        <div className={styles.root}>
          {loading ? (
            <Loading></Loading>
          ) : (
            <>
              {filteredOrders?.length > 0 ? (
                <table className='w-full table-auto border-collapse border'>
                  <thead className='sticky top-0 shadow bg-blue-100'>
                    <tr>
                      {bulkEdit && <th></th>}
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
                        {bulkEdit && (
                          <td>
                            <input
                              type='checkbox'
                              checked={selectedOrders.includes(
                                order.shopifyOrderId
                              )}
                              onChange={() => selectOrder(order.shopifyOrderId)}
                            />
                          </td>
                        )}

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
