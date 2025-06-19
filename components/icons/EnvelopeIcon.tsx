import React from 'react';

const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3 4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3zm13.707 1.707a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293A1 1 0 004.293 5.707L10 11.414l5.707-5.707z" />
  </svg>
);

export default EnvelopeIcon;
