export default function Loading() {
  return (
    <div className='w-full max-w-2xl h-96 max-h-full p-6 my-12 mx-auto overflow-hidden'>
      <div className='animate-pulse'>
        <div className='space-y-3'>
          <div className='h-6 bg-gray-200 rounded'></div>
          <div className='h-6 bg-gray-200 rounded w-2/3'></div>
          <div className='h-6 bg-gray-200 rounded w-1/2'></div>
          <div className='h-8 bg-gray-200 rounded w-2/3'></div>
          <div className='h-6 bg-gray-200 rounded'></div>
          <div className='h-4 bg-gray-200 rounded w-1/3'></div>
          <div className='h-6 bg-gray-200 rounded w-4/5'></div>
        </div>
      </div>
    </div>
  )
}
