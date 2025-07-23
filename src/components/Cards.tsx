import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import SwipeCard from "./SwipeCard";

interface YumiamCardProps {
  title: string;
  subtitle: string;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
}


export default function Cards() {
  return (
    <div className="flex justify-center items-center min-h-screen h-[100dvh] w-full">
      <SwipeCard />
    </div>
  );
}
