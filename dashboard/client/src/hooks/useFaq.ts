import { useQuery } from '@tanstack/react-query'
import { fetchFaq } from '@/lib/api'

export function useFaq(limit = 10) {
  return useQuery({
    queryKey: ['faq', limit],
    queryFn: () => fetchFaq(limit),
  })
}
