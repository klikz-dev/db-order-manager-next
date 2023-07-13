import { getData } from '@/functions/fetch'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Oversized({ line_item }) {
  const { data: session } = useSession()
  const { orderedProductSKU } = line_item ?? {}

  const [isOversized, setIsOversized] = useState(false)

  /**
   * Get Tags
   */
  const { data: tags } = getData(
    orderedProductSKU
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tags/?sku=${orderedProductSKU}`
      : undefined,
    session?.accessToken
  )

  useEffect(() => {
    if (Array.isArray(tags?.results)) {
      tags.results.forEach((tag) => {
        if (parseInt(tag?.tagId) === 280) {
          setIsOversized(true)
        }
      })
    }
  }, [tags])

  return (
    <p>
      {orderedProductSKU}
      {': '}
      <strong>{isOversized ? 'Yes' : 'No'}</strong>
    </p>
  )
}
