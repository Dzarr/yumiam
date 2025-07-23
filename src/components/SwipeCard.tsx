'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import type { Question } from '@/types/questions';
import { cn } from '../lib/utils';

export default function SwipeCard() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const controls = useAnimation();
  
  // Récupérer les questions depuis Supabase
  const { data: cardsData, isLoading, isError } = useQuestions();

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
      <div className="w-full max-w-sm min-h-[24rem] h-[80vh] max-h-96 bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b7d6b] mx-auto mb-4"></div>
          <p className="text-[#8b7d6b] font-light">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (isError || !cardsData) {
    return (
      <div className="w-full max-w-sm min-h-[24rem] h-[80vh] max-h-96 bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center p-8">
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

  // Si plus de cartes, afficher les réponses
  if (!currentCard) {
    return (
      <div className="w-full max-w-sm min-h-[24rem] h-[80vh] max-h-96 bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center p-8">
        <h2 className="text-lg font-light text-[#2d2a24] mb-8 tracking-wide">tes choix</h2>
        <div className="space-y-6 w-full">
          {answers.map((answer: string, index: number) => {
            const originalCard = cardsData[index];
            const isLeftAnswer = answer === originalCard?.left_label;
            const icon = isLeftAnswer ? originalCard?.left_icon : originalCard?.right_icon;
            
            return (
              <div key={index} className="text-center">
                <span className="text-xs text-[#a8a095] font-light tracking-wide block mb-1">
                  {originalCard?.question}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <p className="font-light text-[#2d2a24] text-lg">{answer}</p>
                </div>
              </div>
            );
          })}
        </div>
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
        className="w-full min-h-[24rem] h-[80vh] max-h-96 bg-[#fefcf8] border border-[#e8e4d8] rounded-2xl flex flex-col items-center justify-center relative touch-none select-none cursor-grab active:cursor-grabbing"
      >
        {/* Indicateurs de direction - style zen avec icônes */}
        <div className="absolute top-6 left-6 text-[#8b7d6b] text-sm font-light tracking-wide flex items-center gap-2">
          <span className="text-lg">{currentCard.left_icon}</span>
          <span>{currentCard.left_label}</span>
        </div>
        <div className="absolute top-6 right-6 text-[#8b7d6b] text-sm font-light tracking-wide flex items-center gap-2">
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
