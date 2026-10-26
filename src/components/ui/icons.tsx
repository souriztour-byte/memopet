/* Thin line icons (24×24, currentColor). */

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
  <svg {...base} strokeWidth={1.5} className={className}>
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.6} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.5} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const BagIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 016 0" />
  </svg>
);

export const TruckIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

export const ReturnIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 010 11H11" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <path d="M4 9h16M4 15h11" />
  </svg>
);

export const GiftIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <path d="M20 12v8H4v-8M2 7h20v5H2zM12 21V7" />
    <path d="M12 7H8a2.5 2.5 0 010-5c3 0 4 5 4 5zM12 7h4a2.5 2.5 0 000-5c-3 0-4 5-4 5z" />
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);

export const HomeIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <path d="M4 11l8-6.5 8 6.5V20h-5.5v-5.5h-5V20H4z" />
  </svg>
);

export const GridIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <rect x="4" y="4" width="6.5" height="6.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={1.4} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);

/** Filled paw print (the logo's toes and pad), for small decorations. */
export const PawIcon = ({ className }: IconProps) => (
  <svg viewBox="20 12 160 180" fill="currentColor" aria-hidden focusable={false} className={className}>
    <ellipse cx="46" cy="84" rx="17" ry="22" transform="rotate(-25 46 84)" />
    <ellipse cx="80" cy="46" rx="18" ry="24" transform="rotate(-8 80 46)" />
    <ellipse cx="120" cy="46" rx="18" ry="24" transform="rotate(8 120 46)" />
    <ellipse cx="154" cy="84" rx="17" ry="22" transform="rotate(25 154 84)" />
    <path d="M100 184 C54 156 38 132 44 108 C50 84 84 78 100 102 C116 78 150 84 156 108 C162 132 146 156 100 184 Z" />
  </svg>
);
