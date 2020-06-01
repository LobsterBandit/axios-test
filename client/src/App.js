import React from 'react'
import { useItems } from './api'

console.log(process.env.API_PORT)

export const App = () => {
  const [{ data, loading, error }, refetch] = useItems()

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>
  }

  return (
    <div>
      <button onClick={refetch}>Refetch</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
