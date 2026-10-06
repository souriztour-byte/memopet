/* Line icons from the prototype (24×24, currentColor). */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.6} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const BagIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.2} className={className}>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 016 0" />
  </svg>
);

export const TruckIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.2} className={className}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const ChatIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.2} className={className}>
    <path d="M21 12a9 9 0 01-13.5 7.8L3 21l1.3-4.4A9 9 0 1121 12z" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.2} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

export const ReturnIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.2} className={className}>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 010 11H11" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.2} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
