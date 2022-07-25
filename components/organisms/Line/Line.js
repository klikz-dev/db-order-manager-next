import Button from '@/components/atoms/Button'
import Image from '@/components/atoms/Image'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { MailIcon, UploadIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import sendKlaviyoEmail from '@/functions/klaviyo'

export default function Line({
  orderNumber,
  email,
  variant,
  orderedProductSKU,
  orderedProductTitle,
  orderedProductUnitPrice,
  quantity,
}) {
  const { data: session } = useSession()

  const { product } = variant ?? {}

  const { data: imageData } = getData(
    product?.productId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/?product=${product?.productId}`
      : undefined,
    session?.accessToken
  )
  const image = imageData?.results?.[0]

  const [backOrderDate, setBackOrderDate] = useState('')
  useEffect(() => {
    setBackOrderDate(variant?.backOrderDate)
  }, [variant])

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function updateVariant(data) {
    const res = await putData(
      variant
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/variants/${variant?.variantId}/`
        : undefined,
      session?.accessToken,
      data
    )

    return res
  }

  async function handleSave() {
    const res = await updateVariant({
      backOrderDate: backOrderDate,
      BODateStatus: 1,
    })

    if (res.status) {
      setUpdateSuccess('Successfully updated.')
    } else {
      setUpdateError('Server Error. Update Failed')
    }
  }

  const [discoSent, setDiscoSent] = useState(false)
  const [backoSent, setBackoSent] = useState(false)

  const discontinuedEmail = (e) => {
    e.preventDefault()

    sendKlaviyoEmail(
      process.env.NEXT_PUBLIC_KLAVIYO_DISCO_TMP,
      `Important Information About Your Order PO #${orderNumber} ${product?.title}`,
      {
        dp: {
          actual_oid: orderNumber,
          t: product?.title,
          img: image?.imageURL,
          u: `https://decoratorsbest.com/products/${product?.handle}/?utm_source=discontinued&amp;utm_medium=email&amp;utm_campaign=Discontinued Email`,
        },
      },
      email
    )

    setDiscoSent(true)
  }

  const backorderEmail = (e) => {
    e.preventDefault()

    sendKlaviyoEmail(
      variant?.name?.includes('Sample - ')
        ? process.env.NEXT_PUBLIC_KLAVIYO_BO_SAMPLE_TMP
        : process.env.NEXT_PUBLIC_KLAVIYO_BO_ORDER_TMP,
      `Important Information About Your Order PO #${orderNumber} ${product?.title}`,
      {
        dp: {
          actual_oid: orderNumber,
          t: product?.title,
          orderedtitle: variant?.name,
          img: image?.imageURL,
          u: `https://decoratorsbest.com/products/${product?.handle}/?utm_source=backordered&amp;utm_medium=email&amp;utm_campaign=Backordered Email`,
          backdate: backOrderDate,
        },
      },
      email
    )

    setBackoSent(true)
  }

  return (
    <tr className='text-center border'>
      <td className='w-24 h-24 border'>
        <Image src={image?.imageURL} fill={true} />
      </td>

      <td className='border text-center'>
        <a
          href={`https://decoratorsbest.myshopify.com/admin/products/${
            product?.productId ?? ''
          }`}
          target='_blank'
          rel='noreferrer'
          className='font-bold underline'
        >
          {orderedProductSKU}
        </a>
      </td>

      <td className='border'>{orderedProductTitle}</td>

      <td className='border'>
        ${variant?.cost?.toFixed(2)} {variant?.pricing}
      </td>

      <td className='border'>${orderedProductUnitPrice?.toFixed(2)}</td>

      <td className='border'>{quantity}</td>

      <td className='border'>
        <label className='block'>
          <input
            type='date'
            value={backOrderDate}
            onChange={(e) => setBackOrderDate(e.target.value)}
            className='py-1 rounded text-base'
          />
        </label>

        <Button
          type='secondary'
          size='sm'
          className='mt-1'
          onClick={handleSave}
        >
          <div className='flex items-center'>
            <UploadIcon width={16} height={16} />
            <span className='leading-4 ml-1'>Save</span>
          </div>
        </Button>

        {updateSuccess && (
          <p className='text-blue-700 text-sm mt-1'>{updateSuccess}</p>
        )}

        {updateError && (
          <p className='text-red-700 text-sm mt-1'>{updateError}</p>
        )}
      </td>

      <td className='p-1'>
        <div className='block mb-0.5'>
          <Button
            type='primary'
            size='sm'
            className=''
            onClick={discontinuedEmail}
            disabled={discoSent}
          >
            <div className='flex items-center'>
              <MailIcon width={16} height={16} />
              <span className='leading-4 ml-1'>
                {discoSent ? 'Sent' : 'Discontinued'}
              </span>
            </div>
          </Button>
        </div>

        <div className='block mb-0.5'>
          <Button
            type='primary'
            size='sm'
            className=''
            onClick={backorderEmail}
            disabled={backoSent || backOrderDate === '0000-00-00'}
          >
            <div className='flex items-center'>
              <MailIcon width={16} height={16} />
              <span className='leading-4 ml-1'>
                {backoSent ? 'Sent' : 'Backorder'}
              </span>
            </div>
          </Button>
        </div>
      </td>
    </tr>
  )
}
