import { useInfiniteQuery } from "react-query"
import { fetchUsers } from "../services/users"
import { User } from "../lib/types"

export const useUsers = () => {
  const { 
    isLoading, 
    isError, 
    data, 
    fetchNextPage, 
    hasNextPage 
  } = useInfiniteQuery<{users: User[], nextPage?: number}>(
    ['users'],
    fetchUsers,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage
    }
  )

  return {
    isLoading,
    isError,
    users: data?.pages?.flatMap(page => page.users) ?? [],
    fetchNextPage,
    hasNextPage
  }
}