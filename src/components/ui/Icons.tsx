import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const ArrowRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 12h15M14 7l5 5-5 5" /></svg>
);

export const ArrowDown = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 4v15M7 14l5 5 5-5" /></svg>
);

export const Instagram = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const XLogo = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 4l16 16M20 4L4 20" /></svg>
);

export const Telegram = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 4L3 11l6 2.5M21 4l-3 16-9-6.5M21 4L9 13.5V19l3-3.5" /></svg>
);

export const WhatsApp = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a3.5 3.5 0 0 1-1.8-1.8l.8-1-1-2L9 9.5z" />
  </svg>
);

export const Mail = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3.5 6l8.5 7 8.5-7" />
  </svg>
);

export const OnlyFans = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="13" r="6" />
    <circle cx="9" cy="13" r="2.2" />
    <path d="M13 7.5h8c-.6 2.6-2.6 4.5-5.5 4.8" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);

export const Close = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 5l14 14M19 5L5 19" /></svg>
);

export const Plane = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 3L3 10.5l7 2.5 2.5 7L21 3zM10 13l4-4" /></svg>
);
