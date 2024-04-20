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
  price100,
  setPrice100,
  price100to200,
  setPrice100to200,
  price200to500,
  setPrice200to500,
  price500to1000,
  setPrice500to1000,
  price1000,
  setPrice1000,
  dateRange,
  setDateRange,
  po,
  setPO,
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

                <option value='Processed'>Processed</option>

                <option value='BackOrder'>BackOrder</option>

                <option value='Refund'>Refund</option>

                <option value='Return'>Return</option>

                <option value='Cancel'>Cancel</option>

                <option value='Hold'>Hold</option>
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

            <hr className='my-3 w-1/2' />

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setPrice100(!price100)}
                checked={price100}
              />
              <span className='ml-2'>{'< $100'}</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setPrice100to200(!price100to200)}
                checked={price100to200}
              />
              <span className='ml-2'>$100 - $200</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setPrice200to500(!price200to500)}
                checked={price200to500}
              />
              <span className='ml-2'>$200 - $500</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setPrice500to1000(!price500to1000)}
                checked={price500to1000}
              />
              <span className='ml-2'>$500 - $1,000</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type='checkbox'
                onChange={() => setPrice1000(!price1000)}
                checked={price1000}
              />
              <span className='ml-2'>{'$1,000 <'}</span>
            </label>
          </div>

          <div>
            <label className='block mb-1 text-base'>Order Number</label>
            <div className='relative flex items-center'>
              <input
                type='text'
                value={po}
                onChange={(e) => setPO(e.target.value)}
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
