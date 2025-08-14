'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { useAnswerPattern } from '@/hooks/useAnswerPattern';
import { useRecipeNames } from '@/hooks/useRecipeNames';
import type { Question } from '@/types/questions';

export default function SwipeCard() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const controls = useAnimation();
  
  // Récupérer les questions depuis Supabase
  const { data: cardsData, isLoading, isError } = useQuestions();

  // Générer le pattern numérique : 1 pour gauche, 2 pour droite
  const numericPattern: number[] = [];
  answers.forEach((answer: string, index: number) => {
    if (cardsData && cardsData[index]) {
      const originalCard = cardsData[index];
      const isLeftAnswer = answer === originalCard?.left_label;
      numericPattern.push(isLeftAnswer ? 1 : 2);
    }
  });

  // Utiliser le hook pour récupérer l'ID du pattern (seulement si on a des réponses)
  const { data: patternData, isLoading: patternLoading, isError: patternError } = useAnswerPattern(numericPattern, cardsData?.length || 0);

  // Utiliser le hook pour récupérer les noms de recettes basés sur le pattern_id
  const { data: recipeNames, isLoading: recipesLoading, isError: recipesError } = useRecipeNames(patternData?.id || null);

  const handleDragEnd = async (_: any, info: { velocity: { x: number }, offset: { x: number } }) => {
    if (!cardsData) return;
    
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    const currentCard = cardsData[currentCardIndex];

    if (velocity > 500 || offset > 150) {
      // Swipe right - Réponse droite
      console.log('Swipe Right - Réponse:', currentCard.right_label);
      setAnswers(prev => [...prev, currentCard.right_label]);
      await controls.start({ x: 500, rotate: 15, opacity: 0, transition: { duration: 0.3 } });
      setCurrentCardIndex(prev => prev + 1);
      controls.set({ x: 0, rotate: 0, opacity: 1 });
    } else if (velocity < -500 || offset < -150) {
      // Swipe left - Réponse gauche
      console.log('Swipe Left - Réponse:', currentCard.left_label);
      setAnswers(prev => [...prev, currentCard.left_label]);
      await controls.start({ x: -500, rotate: -15, opacity: 0, transition: { duration: 0.3 } });
      setCurrentCardIndex(prev => prev + 1);
      controls.set({ x: 0, rotate: 0, opacity: 1 });
    } else {
      // Reset position
      controls.start({ x: 0, rotate: 0, opacity: 1, transition: { duration: 0.3 } });
    }
  };

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="w-full max-w-sm h-screen bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b7d6b] mx-auto mb-4"></div>
          <p className="text-[#8b7d6b] font-light">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (isError || !cardsData) {
    return (
      <div className="w-full max-w-sm h-screen bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <p className="text-[#8b7d6b] font-light mb-4">Erreur lors du chargement</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#8b7d6b] text-white rounded-lg font-light"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cardsData[currentCardIndex];

  // Si plus de cartes, afficher les recettes basées sur le pattern
  if (!currentCard) {
    return (
      <div className="w-full max-w-sm h-screen bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full"
        >
          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-light text-[#2d2a24] mb-2 tracking-wide"
          >
            tes recettes
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-[#8b7d6b] mb-8"
          >
            basées sur tes choix
          </motion.p>

          {/* Affichage des recettes */}
          {patternData && recipeNames && recipeNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-4 mb-8"
            >
              {recipeNames.map((recipeName, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.8 + index * 0.15, 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="relative"
                >
                  <div className="bg-white/60 backdrop-blur-sm border border-[#e8e4d8] rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-[#8b7d6b]/30">
                    <p className="font-medium text-[#2d2a24] text-lg text-center">
                      {recipeName}
                    </p>
                  </div>
                  
                  {/* Indicateur de position */}
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#c04a3a] rounded-full opacity-60"></div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* États de chargement et d'erreur */}
          {patternData && recipesLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8b7d6b]"></div>
                <p className="text-sm text-[#8b7d6b]">Chargement des recettes...</p>
              </div>
            </motion.div>
          )}

          {patternData && recipesError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-8"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-600 text-center">Erreur lors du chargement des recettes</p>
              </div>
            </motion.div>
          )}

          {!patternData && !patternLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-8"
            >
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-sm text-amber-600 text-center">Pattern non trouvé dans la base</p>
              </div>
            </motion.div>
          )}
          
          {/* Bouton pour recommencer */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentCardIndex(0);
              setAnswers([]);
            }}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#8b7d6b] to-[#7a6d5a] text-white rounded-xl font-medium hover:from-[#7a6d5a] hover:to-[#6b5f4f] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            recommencer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
        whileDrag={{ scale: 1.02 }}
        className="w-full h-screen bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center relative touch-none select-none cursor-grab active:cursor-grabbing"
      >
        {/* Indicateurs de direction - style zen avec icônes */}
        <div className="absolute top-6 left-6 text-[#8b7d6b] text-sm font-light tracking-wide flex items-center gap-2">
          <span className="text-lg">{currentCard.left_icon}</span>
          <span>{currentCard.left_label}</span>
        </div>
        <div className="absolute top-6 right-6 text-[#c04a3a] text-sm font-light tracking-wide flex items-center gap-2">
          <span>{currentCard.right_label}</span>
          <span className="text-lg">{currentCard.right_icon}</span>
        </div>
        
        {/* Question centrale - typographie zen */}
        <div className="text-center px-8 max-w-xs">
          <p className="text-xl font-light text-[#2d2a24] leading-relaxed mb-6">
            {currentCard.question}
          </p>
          <p className="text-xs text-[#a8a095] font-light tracking-wide">
            glisse pour choisir
          </p>
        </div>
        
        {/* Indicateur de progression - minimaliste */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {cardsData.map((_: Question, index: number) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  index < currentCardIndex ? 'bg-[#8b7d6b]' : 
                  index === currentCardIndex ? 'bg-[#2d2a24]' : 'bg-[#e8e4d8]'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
