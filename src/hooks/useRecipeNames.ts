import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useRecipeNames = (patternId: string | null) => {
  return useQuery({
    queryKey: ['recipe-names', patternId],
    queryFn: async (): Promise<string[]> => {
      if (!patternId) return []

      const { data, error } = await supabase
        .from('recipe_names')
        .select('name')
        .eq('pattern_id', patternId)
        .limit(5)

      if (error) {
        throw new Error(`Erreur lors de la récupération des recettes: ${error.message}`)
      }

      // Extraire les noms des recettes
      return data?.map(recipe => recipe.name) || []
    },
    // Ne lancer la requête que si on a un pattern_id
    enabled: !!patternId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}
