import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export function getData(url) {
  const { data, error } = useSWR(url, fetcher)

  return {
    data: data,
    loading: !error && !data,
    error: error,
  }
}
