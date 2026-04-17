"use client";

import React from "react";

const Page = React.forwardRef(({ src }, ref) => {
  return (
    <div className="page" ref={ref}>
      <img src={src} alt="page" className="page-image" />
    </div>
  );
});

export default Page;