import Button from '@/components/atoms/Button'
import { addDays } from 'date-fns'
import React from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import styles from './Filter.module.css'
import { FilterIcon, SearchIcon } from '@heroicons/react/solid'

export default function index({
  status,
  setStatus,
  order,
  setOrder,
  sample,
  setSample,
  ordersample,
  setOrdersample,
  complete,
  setComplete,
  incomplete,
  setIncomplete,
  dateRange,
  setDateRange,
  orderNumber,
  setOrderNumber,
  customer,
  setCustomer,
  manufacturer,
  setManufacturer,
  reference,
  setReference,
  dateSearch,
  poSearch,
  customerSearch,
  manufacturerSearch,
  refSearch,
}) {
  return (
    <div className='relative bg-blue-50 shadow-lg'>
      <div className='w-full shadow px-4 py-8'>
        <div className='grid grid-cols-5 gap-5'>
          <div className='col-span-2 border-r border-blue-300'>
            <div className='overflow-auto'>
              <DateRangePicker
                onChange={(item) => setDateRange({ ...dateRange, ...item })}
                months={1}
                maxDate={addDays(new Date(), 0)}
                direction='vertical'
                ranges={[dateRange.selection]}
                showDateDisplay={false}
              />
            </div>

            <div className='mt-4'>
              <Button onClick={() => dateSearch()}>
                <FilterIcon width={15} height={15} className='mr-2' />
                Filter orders
              </Button>
            </div>
          </div>

          <div className='border-r border-blue-300'>
            <div>
              <label className='block mb-1 text-base'>Status:</label>
              <select
                className='w-56 py-1.5 rounded text-base'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value='All'>All</option>
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
            </div>
          </div>

          <div className='border-r border-blue-300'>
            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setOrder(!order)}
                checked={order}
              />
              <span className='ml-2'>Order</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setSample(!sample)}
                checked={sample}
              />
              <span className='ml-2'>Sample</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setOrdersample(!ordersample)}
                checked={ordersample}
              />
              <span className='ml-2'>Order/Sample</span>
            </label>

            <hr className='my-3 w-1/2' />

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setComplete(!complete)}
                checked={complete}
              />
              <span className='ml-2'>Complete</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setIncomplete(!incomplete)}
                checked={incomplete}
              />
              <span className='ml-2'>Incomplete</span>
            </label>
          </div>

          <div>
            <label className='block mb-1 text-base'>Order Number</label>
            <div className='relative flex items-center'>
              <input
                type='text'
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className='py-1 text-base rounded mr-2'
              />

              <Button type='primary' size='sm' onClick={() => poSearch()}>
                <SearchIcon width={15} height={15} />
              </Button>
            </div>

            <hr className='my-3 w-2/3' />

            <label className='block mb-1 text-base'>Customer</label>
            <div className='relative flex items-center'>
              <input
                type='text'
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className='py-1 text-base rounded mr-2'
              />

              <Button type='primary' size='sm' onClick={() => customerSearch()}>
                <SearchIcon width={15} height={15} />
              </Button>
            </div>

            <hr className='my-3 w-2/3' />

            <label className='block mb-1 text-base'>Manufacturer</label>
            <div className='relative flex items-center'>
              <input
                type='text'
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className='py-1 text-base rounded mr-2'
              />

              <Button
                type='primary'
                size='sm'
                onClick={() => manufacturerSearch()}
              >
                <SearchIcon width={15} height={15} />
              </Button>
            </div>

            <hr className='my-3 w-2/3' />

            <label className='block mb-1 text-base'>Ref #</label>
            <div className='relative flex items-center'>
              <input
                type='text'
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className='py-1 text-base rounded mr-2'
              />

              <Button type='primary' size='sm' onClick={() => refSearch()}>
                <SearchIcon width={15} height={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
