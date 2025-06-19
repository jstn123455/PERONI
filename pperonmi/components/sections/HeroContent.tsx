
import React from 'react';
import { ContentComponentProps } from '../../types'; 

const HeroContent: React.FC<ContentComponentProps> = ({ openWindow }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
        Justin Terzoni
      </h1>
      <h2 className="text-xl sm:text-2xl text-sky-400 mt-2">
        16-year-old Full Stack Developer
      </h2>
      <p className="mt-6 text-md sm:text-lg text-slate-300 max-w-xl mx-auto">
        Welcome to my digital desktop! Explore my journey, skills, and how I craft innovative digital experiences.
      </p>
      <p className="mt-4 text-sm text-slate-400">
        Use the Start Menu or Terminal (try "help") to navigate.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3 w-full max-w-xs sm:max-w-md">
        <button 
          onClick={() => openWindow?.('experience')}
          className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 transition-transform transform hover:scale-105 shadow-md"
        >
          Explore My Journey
        </button>
        <button 
          onClick={() => openWindow?.('contact')}
          className="w-full sm:w-auto px-6 py-2 border border-sky-500 text-sm font-medium rounded-md text-sky-400 bg-transparent hover:bg-sky-500 hover:text-slate-900 transition-transform transform hover:scale-105 shadow-md"
        >
          Get In Touch
        </button>
      </div>
       <div className="mt-6">
        <svg className="w-6 h-6 text-slate-500 animate-bounce-gentle" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroContent;
