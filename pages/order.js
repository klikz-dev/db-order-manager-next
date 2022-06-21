import { useRouter } from 'next/router'

export default function Order() {
  const router = useRouter()
  const { po } = router?.query || {}

  console.log(po)

  return <></>
}
