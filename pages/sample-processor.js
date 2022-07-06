import Button from '@/components/atoms/Button'
import Layout from '@/components/common/Layout'
import SampleProcessor from '@/components/organisms/SampleProcessor'
import { useState } from 'react'

export default function Process() {
  const [selectedBrand, setSelectedBrand] = useState('Brewster')

  const ediBrands = ['Brewster', 'Schumacher', 'York', 'Kravet']
  const nonEdiBrands = [
    'Covington',
    'JF Fabrics',
    'Kasmir',
    'Madcap Cottage',
    'Materialwork',
    'Maxwell',
    'Phillip Jeffries',
    'Pindler',
    'Premier Prints',
    'Ralph Lauren',
    'Scalamandre',
    'Seabrook',
    'Stout',
    'Zoffany',
  ]

  return (
    <Layout title='Sample Processor'>
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
              {selectedBrand} samples are automatically processed by{' '}
              <strong>{selectedBrand} EDI.</strong>
            </p>
          ) : (
            <>
              <SampleProcessor brand={selectedBrand} />
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
