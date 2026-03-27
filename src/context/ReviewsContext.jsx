import { createContext, useContext, useState } from 'react'

const ReviewsContext = createContext(null)
const STORAGE_KEY = 'capp-reviews'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function ReviewsProvider({ children }) {
  const [reviewMap, setReviewMap] = useState(load)

  function addReview(campId, review) {
    setReviewMap((prev) => {
      // One review per user email per camp — replace if already exists
      const existing = prev[campId] ?? []
      const filtered = existing.filter((r) => r.userEmail !== review.userEmail)
      const updated = { ...prev, [campId]: [review, ...filtered] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function getUserReview(campId, userEmail) {
    return (reviewMap[campId] ?? []).find((r) => r.userEmail === userEmail) ?? null
  }

  function getUserReviews(campId) {
    return reviewMap[campId] ?? []
  }

  return (
    <ReviewsContext.Provider value={{ addReview, getUserReview, getUserReviews }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export const useReviews = () => useContext(ReviewsContext)
