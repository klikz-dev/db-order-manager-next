import Button from '@/components/atoms/Button'
import Layout from '@/components/common/Layout'
import CombinedOrderProcessor from '@/components/organisms/OrderProcessor/CombinedOrderProcessor'
import CombinedOrderProcessorIncludingCost from '@/components/organisms/OrderProcessor/CombinedOrderProcessorIncludingCost'
import SeparateOrderProcessor from '@/components/organisms/OrderProcessor/SeparateOrderProcessor'
import CSVOrderProcessor from '@/components/organisms/OrderProcessor/CSVOrderProcessor'
import { putData } from '@/functions/put'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Process() {
  const { data: session } = useSession()

  const [selectedBrand, setSelectedBrand] = useState('Brewster')

  const ediBrands = ['Brewster', 'Schumacher', 'York', 'Kravet']
  const nonEdiBrands = [
    'Covington',
    'Couture',
    'Dana Gibson',
    'Elaine Smith',
    'Exquisite Rugs',
    'Galerie',
    'Hubbardton Forge',
    'Jaipur Living',
    'Jamie Young',
    'JF Fabrics',
    'Kasmir',
    'Kravet Decor',
    'Materialworks',
    'Maxwell',
    'MindTheGap',
    'NOIR',
    'Olivia & Quinn',
    'Peninsula Home',
    'Phillip Jeffries',
    'Pindler',
    'Poppy',
    'Port 68',
    'Premier Prints',
    'P/Kaufmann',
    'Seabrook',
    'Stout',
    'Surya',
    'Tempaper',
    'Walls Republic',
    'Zoffany',
  ]

  /**
   * Update Order
   */
  async function updateOrder(shopifyOrderId, data) {
    const res = await putData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${shopifyOrderId}/`,
      session?.accessToken,
      data
    )

    return res
  }

  return (
    <Layout title='Order Processor'>
      <div className='flex py-12'>
        <div className='w-80 px-10 flex-shrink-0 border-r'>
          <p className='text-blue-800 font-bold text-lg mb-4'>EDI Brands</p>

          {ediBrands.map((brand, index) => (
            <div key={index} className='block mb-2'>
              <Button
                type={selectedBrand === brand ? 'primary' : 'secondary'}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </Button>
            </div>
          ))}

          <hr className='my-12' />

          <p className='text-red-800 font-bold text-lg mb-4'>Non EDI Brands</p>

          {nonEdiBrands.map((brand, index) => (
            <div key={index} className='block mb-2'>
              <Button
                type={selectedBrand === brand ? 'primary' : 'secondary'}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </Button>
            </div>
          ))}
        </div>

        <div className='w-full p-12'>
          {ediBrands.includes(selectedBrand) ? (
            <p className='text-xl'>
              {selectedBrand} orders are automatically processed by{' '}
              <strong>{selectedBrand} EDI.</strong>
            </p>
          ) : (
            <>
              {selectedBrand === 'Phillip Jeffries' ||
              selectedBrand === 'NOIR' ||
              selectedBrand === 'Port 68' ? (
                <SeparateOrderProcessor
                  brand={selectedBrand}
                  updateOrder={updateOrder}
                />
              ) : selectedBrand === 'Jamie Young' ? (
                <CSVOrderProcessor
                  brand={selectedBrand}
                  updateOrder={updateOrder}
                />
              ) : selectedBrand === 'Exquisite Rugs' ? (
                <CombinedOrderProcessorIncludingCost
                  brand={selectedBrand}
                  updateOrder={updateOrder}
                />
              ) : (
                <CombinedOrderProcessor
                  brand={selectedBrand}
                  updateOrder={updateOrder}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
