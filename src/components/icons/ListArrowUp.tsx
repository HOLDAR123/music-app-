import React from "react";

// eslint-disable-next-line react/require-default-props
function ListArrowUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_820_1906)">
        <path
          d="M11.4191 5.90298C11.5829 5.90298 11.7454 5.83423 11.8602 5.70022C12.069 5.45681 12.0406 5.09008 11.7972 4.88151L6.37799 0.236382C6.16059 0.0501122 5.83961 0.0501122 5.62222 0.236382L0.202981 4.88151C-0.0404243 5.09031 -0.0687609 5.45681 0.140038 5.70022C0.348837 5.94362 0.715338 5.97196 0.958743 5.76316L6.0001 1.44203L11.0415 5.76316C11.1509 5.85699 11.2853 5.90298 11.4191 5.90298Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_820_1906">
          <rect
            width="12"
            height="5.80641"
            fill="white"
            transform="matrix(1 0 0 -1 0 5.90332)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ListArrowUp;
