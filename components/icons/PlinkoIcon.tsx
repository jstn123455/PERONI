import React from 'react';

const PlinkoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
    {/* Small dot in the center */}
    <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.7)" /> 
  </svg>
);

export default PlinkoIcon;