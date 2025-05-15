import React from 'react';

const LeftArrow = () => {
  return (
    <div className="absolute left-0 top-0 h-full overflow-hidden -z-10">
      <svg className="h-full" width="50" height="100%" viewBox="0 0 50 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 400L50 300V500L0 400Z" fill="#a5cd39"></path>
        <path d="M0 400L30 320V480L0 400Z" fill="#a5cd39"></path>
      </svg>
    </div>
  );
};

export default LeftArrow;
