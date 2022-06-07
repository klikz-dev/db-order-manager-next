export default function Input(props) {
  if (props.type === 'submit') {
    return (
      <input
        className='text-sm bg-blue-600 hover:bg-blue-800 text-white py-2 px-12 rounded cursor-pointer'
        {...props}
      />
    )
  }

  return (
    <input
      className='text-sm rounded w-full py-2 px-4 focus:bg-gray-100'
      {...props}
    />
  )
}
