import useSWR from 'swr'

const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    redirect: 'follow',
  }).then((res) => res.json())

export function getData(url, token) {
  const { data, error } = useSWR(
    url && token ? [url, token] : undefined,
    fetcher
  )

  return {
    data: data,
    loading: !error && !data,
    error: error,
  }
}
