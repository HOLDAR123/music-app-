import React from "react";

// eslint-disable-next-line react/require-default-props
function PlayMusicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.0007 36.6663C29.2053 36.6663 36.6673 29.2043 36.6673 19.9997C36.6673 10.7949 29.2053 3.33301 20.0007 3.33301C10.7959 3.33301 3.33398 10.7949 3.33398 19.9997C3.33398 29.2043 10.7959 36.6663 20.0007 36.6663Z"
        fill="url(#paint0_linear_836_5028)"
      />
      <path
        d="M25.6895 21.7647L17.8225 26.4093C16.5562 27.157 15 26.1838 15 24.6443V15.3549C15 13.8155 16.5562 12.8424 17.8225 13.59L25.6895 18.2347C26.9923 19.004 26.9923 20.9953 25.6895 21.7647Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_836_5028"
          x1="3.71277"
          y1="45.4164"
          x2="47.7335"
          y2="42.4847"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0AD1CE" />
          <stop offset="1" stopColor="#14C156" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default PlayMusicIcon;
