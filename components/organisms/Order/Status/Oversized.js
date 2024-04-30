import { useMemo } from 'react'

export default function Oversized({ lineItem }) {
  const { sku, tags } = lineItem.product

  // Use useMemo to calculate the isOversized value once, based on the tags.
  const isOversized = useMemo(() => {
    return tags.some((tag) => tag.name === 'White Glove')
  }, [tags])

  return (
    <p>
      {sku}
      {': '}
      <strong>{isOversized ? 'Yes' : 'No'}</strong>
    </p>
  )
}
