import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"

interface Content {
  userId: number,
  id: number,
  title: string,
  body: string,
}

export const Pagination = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const fetchJsonPlaceholder = async (page = 1, limit = 10) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`)
    const data: Content[] = await response.json()
    return data;
  }

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData
  } = useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => fetchJsonPlaceholder(page, limit),
    placeholderData: keepPreviousData,
  })

  const styles = {
    card: {
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
    },
  }


  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.map((content) => (
            <div key={content.id} style={styles.card} >
              <h2>{content.id}</h2>
              <h2>{content.title}</h2>
              <p>{content.body}</p>
            </div>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData) {
            setPage((old) => old + 1)
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}
      <select onChange={(e) => setLimit(Number(e.target.value))}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
    </div>
  )
}
