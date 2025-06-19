import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 10.707V17.5a1 1 0 01-1 1H4a1 1 0 01-1-1V10.707a1 1 0 01.293-.707l7-7zM16 9.293L10 3.293 4 9.293V17.5h12V9.293z" clipRule="evenodd" />
    <path d="M9 13a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
    <path d="M9 13a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 13a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zM11 13a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z" />
 </svg>
);

export default HomeIcon;
