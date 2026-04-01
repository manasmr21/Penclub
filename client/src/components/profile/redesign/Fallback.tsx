import React from 'react';

interface FallbackProps {
  comp: string;
}

const Fallback = ({ comp }: FallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 w-full">
      <p className="text-on-surface-variant/60 font-serif italic text-lg tracking-wide text-center">
        No {comp.toLowerCase()} found
      </p>
    </div>
  );
};

export default Fallback;
