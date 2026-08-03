import { useQuery } from '@tanstack/react-query'
import { fetchSummary } from '@/lib/api'

export function useSummary(rangeDays: number) {
  return useQuery({
    queryKey: ['summary', rangeDays],
    queryFn: () => fetchSummary(rangeDays),
  })
}
