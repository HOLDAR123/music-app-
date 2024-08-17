import React from "react";

// eslint-disable-next-line react/require-default-props
function ListArrowDown(props: React.SVGProps<SVGSVGElement>) {
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
          d="M0.580885 0.0970221C0.417144 0.0970221 0.254565 0.16577 0.13983 0.299782C-0.0689687 0.543187 -0.0406334 0.90992 0.202772 1.11849L5.62201 5.76362C5.83941 5.94989 6.16039 5.94989 6.37778 5.76362L11.797 1.11849C12.0404 0.909688 12.0688 0.543187 11.86 0.299782C11.6512 0.0563769 11.2847 0.0280418 11.0413 0.236841L5.9999 4.55797L0.958534 0.236841C0.849142 0.143009 0.714665 0.0970221 0.580885 0.0970221Z"
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

export default ListArrowDown;
