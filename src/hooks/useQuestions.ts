import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types/questions'

export const useQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async (): Promise<Question[]> => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('order', { ascending: true })

      if (error) {
        throw new Error(`Erreur lors de la récupération des questions: ${error.message}`)
      }

      return data || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
} 