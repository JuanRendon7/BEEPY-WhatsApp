import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchConversations } from '@/lib/api'

export function useConversations(page: number, pageSize = 20) {
  return useQuery({
    queryKey: ['conversations', page, pageSize],
    queryFn: () => fetchConversations(page, pageSize),
    placeholderData: keepPreviousData,
  })
}
