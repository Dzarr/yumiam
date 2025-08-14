import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useAnswerPattern = (answers: number[], totalQuestions: number) => {
  return useQuery({
    queryKey: ['answer-pattern', answers],
    queryFn: async (): Promise<{ id: string; answers: number[] } | null> => {
      // Ne lancer la requête que si toutes les questions sont répondues
      if (answers.length === 0 || answers.length < totalQuestions) {
        return null
      }

      const { data, error } = await supabase
        .from('answer_patterns')
        .select('id, answers')
        .eq('answers', JSON.stringify(answers))
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun pattern trouvé
          return null
        }
        throw new Error(`Erreur lors de la récupération du pattern: ${error.message}`)
      }

      return data
    },
    // Ne lancer la requête que si on a toutes les réponses
    enabled: answers.length > 0 && answers.length === totalQuestions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}
