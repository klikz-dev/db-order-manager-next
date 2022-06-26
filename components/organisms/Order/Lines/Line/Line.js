import Button from '@/components/atoms/Button'
import Image from '@/components/atoms/Image'
import { getData } from '@/functions/fetch'
import { putData } from '@/functions/put'
import { UploadIcon } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Line({
  productId,
  variantId,
  orderedProductUnitPrice,
  quantity,
}) {
  const { data: session } = useSession()

  const { data: productData } = getData(
    productId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/?id=${productId}`
      : undefined,
    session?.accessToken
  )
  const product = productData?.results?.[0]

  const { data: variantData } = getData(
    variantId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/variants/?id=${variantId}`
      : undefined,
    session?.accessToken
  )
  const variant = variantData?.results?.[0]

  const { data: imageData } = getData(
    productId
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/?product=${productId}`
      : undefined,
    session?.accessToken
  )
  const image = imageData?.results?.[0]

  const [BackOrderDate, setBackOrderDate] = useState('')
  useEffect(() => {
    setBackOrderDate(variant?.BackOrderDate)
  }, [variant])

  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  async function updateVariant(data) {
    const res = await putData(
      variant
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/variants/${variant?.id}/`
        : undefined,
      session?.accessToken,
      data
    )

    return res
  }

  async function handleSave() {
    const res = await updateVariant({
      BackOrderDate: BackOrderDate,
      BODateStatus: 1,
    })

    if (res.status) {
      setUpdateSuccess('Successfully updated.')
    } else {
      setUpdateError('Server Error. Update Failed')
    }
  }

  return (
    <tr className='text-center border'>
      <td className='w-24 h-24 border'>
        <Image src={image?.imageURL} fill={true} />
      </td>

      <td className='border'>{product?.sku}</td>

      <td className='border'>{variant?.name}</td>

      <td className='border'>
        ${variant?.cost?.toFixed(2)} {variant?.pricing}
      </td>

      <td className='border'>${orderedProductUnitPrice?.toFixed(2)}</td>

      <td className='border'>{quantity}</td>

      <td className='border'>
        <label className='block'>
          <input
            type='date'
            value={BackOrderDate}
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
    </tr>
  )
}
