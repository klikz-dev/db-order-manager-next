import Button from '@/components/atoms/Button'
import {
  LocationMarkerIcon,
  PencilAltIcon,
  UploadIcon,
  XIcon,
} from '@heroicons/react/solid'
import { useState } from 'react'

export default function Address({ order }) {
  const [edit, setEdit] = useState(false)

  const [shippingFirstName, setShippingFirstName] = useState(
    order.shippingFirstName
  )
  const [shippingLastName, setShippingLastName] = useState(
    order.shippingLastName
  )
  const [shippingAddress1, setShippingAddress1] = useState(
    order.shippingAddress1
  )
  const [shippingAddress2, setShippingAddress2] = useState(
    order.shippingAddress2
  )
  const [shippingCity, setShippingCity] = useState(order.shippingCity)
  const [shippingCompany, setShippingCompany] = useState(order.shippingCompany)
  const [shippingPhone, setShippingPhone] = useState(order.shippingPhone)
  const [shippingState, setShippingState] = useState(order.shippingState)
  const [shippingZip, setShippingZip] = useState(order.shippingZip)
  const [shippingCountry, setShippingCountry] = useState(order.shippingCountry)
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod)

  function updateAddress() {
    setEdit(false)
  }

  return (
    <>
      <div className='shadow-lg border rounded px-8 py-4'>
        <h3 className='mb-4 flex items-center'>
          <LocationMarkerIcon width={24} height={24} />
          <span className='ml-2 uppercase'>Address</span>
        </h3>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold mb-1'>Billing Address: </p>
            <p>
              {order.billingFirstName} {order.billingLastName}
            </p>
            <p>
              {order.billingAddress1} {order.billingAddress2},
            </p>
            <p>
              {order.billingCity}, {order.billingState} {order.billingZip},
            </p>
            <p>{order.billingCountry}</p>
            <p>{order.billingCompany}</p>
            <p>{order.billingPhone}</p>
          </div>

          <div>
            <p className='font-semibold mb-1'>Shipping Address: </p>
            <p>
              {shippingFirstName} {shippingLastName}
            </p>
            <p>
              {shippingAddress1} {shippingAddress2},
            </p>
            <p>
              {shippingCity}, {shippingState} {shippingZip},
            </p>
            <p>{shippingCountry}</p>
            <p>{shippingCompany}</p>
            <p>{shippingPhone}</p>
            <p className='mt-2 text-red-700'>{shippingMethod}</p>

            <Button
              type='secondary'
              className='mt-5'
              onClick={() => setEdit(true)}
            >
              <div className='flex items-center'>
                <PencilAltIcon width={16} height={16} />
                <span className='leading-4 ml-1'>Edit</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {edit && (
        <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-zinc-700 bg-opacity-20'>
          <div className='bg-white shadow-lg p-6 rounded'>
            <p className='font-semibold mb-4'>Shipping Address: </p>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-bold'>First Name</label>
                <input
                  type='text'
                  value={shippingFirstName}
                  onChange={(e) => setShippingFirstName(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>

              <div>
                <label className='block text-sm font-bold'>Last Name</label>
                <input
                  type='text'
                  value={shippingLastName}
                  onChange={(e) => setShippingLastName(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-bold'>Address 1</label>
                <input
                  type='text'
                  value={shippingAddress1}
                  onChange={(e) => setShippingAddress1(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>

              <div>
                <label className='block text-sm font-bold'>Address 2</label>
                <input
                  type='text'
                  value={shippingAddress2}
                  onChange={(e) => setShippingAddress2(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-bold'>City</label>
                <input
                  type='text'
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>

              <div>
                <label className='block text-sm font-bold'>State</label>
                <input
                  type='text'
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-bold'>Zip</label>
                <input
                  type='text'
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>

              <div>
                <label className='block text-sm font-bold'>Country</label>
                <input
                  type='text'
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-bold'>
                  Shipping Company
                </label>
                <input
                  type='text'
                  value={shippingCompany}
                  onChange={(e) => setShippingCompany(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>

              <div>
                <label className='block text-sm font-bold'>Phone</label>
                <input
                  type='text'
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className='bg-blue-100 text-base py-1 mb-2'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-bold'>Shipping Method</label>
              <input
                type='text'
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                className='bg-blue-100 text-base py-1 mb-2 w-full'
              />
            </div>

            <Button
              type='secondary'
              className='block mt-5'
              onClick={() => setEdit(true)}
            >
              <div className='flex items-center'>
                <UploadIcon width={16} height={16} />
                <span className='leading-4 ml-1'>Save</span>
              </div>
            </Button>

            <Button
              type='tertiary'
              className='block mt-5 ml-2'
              onClick={updateAddress}
            >
              <div className='flex items-center'>
                <XIcon width={16} height={16} />
                <span className='leading-4 ml-1'>Dismiss</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}