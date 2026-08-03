import { useQuery } from '@tanstack/react-query'
import { fetchTrend } from '@/lib/api'

export function useTrend(rangeDays: number) {
  return useQuery({
    queryKey: ['trend', rangeDays],
    queryFn: () => fetchTrend(rangeDays),
  })
}
