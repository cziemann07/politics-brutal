// components/BrutalBlock.tsx
import React from 'react';

interface BrutalBlockProps {
  title: string;
  // Temas baseados nas cores da paleta brutalista ou do Tailwind
  theme: 'red' | 'blue' | 'orange' | 'yellow' | 'black';
  children: React.ReactNode;
}

const themeStyles = {
  // Cores de Borda e Fundo
  red: 'border-red-600 bg-white text-red-600',
  blue: 'border-brutal-blue bg-white text-brutal-blue',
  orange: 'border-orange-500 bg-orange-50 text-orange-600',
  black: 'border-black bg-white text-black',
  yellow: 'border-black bg-brutal-yellow text-black'
};

export default function BrutalBlock({ title, theme, children }: BrutalBlockProps) {
  const baseStyles = themeStyles[theme] || themeStyles['black'];
  
  // Extrai as classes de cor de texto para aplicá-las apenas ao título e subtítulos
  const titleColorClass = baseStyles.split(' ').find(c => c.startsWith('text-'));
  
  // Remove as classes de cor de texto do contêiner principal para que o texto do corpo seja preto
  const containerClasses = baseStyles.split(' ').filter(c => !c.startsWith('text-')).join(' ');

  return (
    <section className={`border-4 shadow-hard p-6 flex flex-col gap-4 ${containerClasses}`}>
      {/* Título com a cor de destaque */}
      <h2 className={`font-black text-3xl uppercase leading-none ${titleColorClass || 'text-black'}`}>
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-black">
        {children}
      </div>
    </section>
  );
}