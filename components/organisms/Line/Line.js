import Button from '@/components/atoms/Button'
import Image from '@/components/atoms/Image'
import { putData } from '@/functions/put'
import { MailIcon, UploadIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import sendKlaviyoEmail from '@/functions/klaviyo'

export default function Line({
  po,
  email,
  id,
  product,
  variant,
  orderPrice,
  quantity,
  backorder,
}) {
  const { data: session } = useSession()

  const image = product.images?.sort((a, b) => a.position - b.position)?.[0]

  const [backOrderDate, setBackOrderDate] = useState(backorder)

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function updateLine(data) {
    const res = await putData(
      id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/line-items/${id}/`
        : undefined,
      session?.accessToken,
      data
    )

    return res
  }

  async function handleSave() {
    const res = await updateLine({
      backorder: backOrderDate,
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
      `Important Information About Your Order PO #${po} ${product?.title}`,
      {
        dp: {
          actual_oid: po,
          t: product?.title,
          img: image?.url,
          u: `https://decoratorsbest.com/products/${product?.shopifyHandle}/?utm_source=discontinued&amp;utm_medium=email&amp;utm_campaign=Discontinued Email`,
        },
      },
      email
    )

    setDiscoSent(true)
  }

  const backorderEmail = (e) => {
    e.preventDefault()

    sendKlaviyoEmail(
      variant?.includes('Sample')
        ? process.env.NEXT_PUBLIC_KLAVIYO_BO_SAMPLE_TMP
        : process.env.NEXT_PUBLIC_KLAVIYO_BO_ORDER_TMP,
      `Important Information About Your Order PO #${po} ${product?.title}`,
      {
        dp: {
          actual_oid: po,
          t: product?.title,
          orderedtitle: `${variant} ${product.title}`,
          img: image?.url,
          u: `https://decoratorsbest.com/products/${product?.shopifyHandle}/?utm_source=backordered&amp;utm_medium=email&amp;utm_campaign=Backordered Email`,
          backdate: backOrderDate,
        },
      },
      email
    )

    setBackoSent(true)
  }

  return (
    <tr className='text-center border'>
      <td className='w-24 h-24 border relative'>
        <Image src={image?.url} styles={{ objectOver: 'contain' }} />
      </td>

      <td className='border text-center'>
        <a
          href={`https://decoratorsbest.com/products/${
            product?.shopifyHandle ?? ''
          }`}
          target='_blank'
          rel='noreferrer'
          className='font-bold underline'
        >
          {product.sku}
        </a>
      </td>

      <td className='border'>{product.title}</td>

      <td className='border'>
        ${product?.cost} / {product?.uom}
      </td>

      <td className='border'>${orderPrice}</td>

      <td className='border'>
        $
        {variant === 'Consumer'
          ? product?.consumer
          : variant === 'Trade'
          ? product?.trade
          : variant === 'Sample'
          ? product?.sample
          : 0}
      </td>

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
