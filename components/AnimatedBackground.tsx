
import React from 'react';

const AnimatedBackground: React.FC = () => {
  const shapes = [
    { id: 1, size: 'w-32 h-32 md:w-48 md:h-48', color: 'bg-sky-500/10', position: 'top-1/4 left-1/4', animation: 'animate-pulse-slow', blur: 'blur-2xl' },
    { id: 2, size: 'w-24 h-24 md:w-36 md:h-36', color: 'bg-purple-500/10', position: 'top-1/2 right-1/4', animation: 'animate-bounce-gentle', blur: 'blur-xl' },
    { id: 3, size: 'w-20 h-20 md:w-28 md:h-28', color: 'bg-teal-500/10', position: 'bottom-1/4 left-1/3', animation: 'animate-pulse-slow animation-delay-1000', blur: 'blur-2xl' },
    { id: 4, size: 'w-16 h-16 md:w-20 md:h-20', color: 'bg-pink-500/5', position: 'bottom-1/3 right-1/3', animation: 'animate-bounce-gentle animation-delay-500', blur: 'blur-xl' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {shapes.map(shape => (
        <div
          key={shape.id}
          className={`absolute ${shape.size} ${shape.color} rounded-full ${shape.position} ${shape.animation} ${shape.blur} opacity-50`}
          style={{ animationDelay: shape.animation.includes('delay') ? shape.animation.split('animation-delay-')[1] + 'ms' : undefined }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
