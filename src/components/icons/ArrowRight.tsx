import React from "react";

// eslint-disable-next-line react/require-default-props
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="11"
      height="18"
      viewBox="0 0 11 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 18C2.4608 18 2.9216 17.8243 3.27296 17.473L10.473 10.273C11.1757 9.57024 11.1757 8.43048 10.473 7.72704L3.27296 0.52704C2.57024 -0.17568 1.43048 -0.17568 0.727038 0.52704C0.0243187 1.22976 0.0243187 2.36952 0.727038 3.07296L6.65408 9L0.727038 14.927C0.0243187 15.6298 0.0243187 16.7695 0.727038 17.473C1.0784 17.8243 1.5392 18 2 18Z"
        fill="#A4A4A4"
      />
    </svg>
  );
}

export default ArrowRight;
