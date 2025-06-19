import React from 'react';

const RestoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V3.75H3.75v12.75H8.25m8.25-12.75H20.25v12.75H12V8.25m4.5-4.5L8.25 12" />
  </svg>
);

export default RestoreIcon;
