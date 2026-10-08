import type { Illustration as IllustrationName } from "@/lib/commerce/types";

/* Hand-drawn product art from the prototype, used whenever a product or
   category has no photo yet. Colours are fixed brand colours, as in the
   prototype. */

/** Lowercase "z" drawn as a path: share images can't render SVG text. */
const z = (x: number, y: number, size: number) => {
  const w = size * 0.5;
  const h = size * 0.55;
  return (
    <path
      key={`${x}-${y}`}
      d={`M${x} ${y - h} h${w} l${-w} ${h} h${w}`}
      fill="none"
      stroke="#6C4AB6"
      strokeWidth={size * 0.16}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

const ART: Record<IllustrationName, React.ReactNode> = {
  care: (
    <g>
<ellipse cx="160" cy="182" rx="130" ry="9" fill="#000" opacity=".07"/>
<rect x="104" y="30" width="16" height="22" rx="3" fill="#2B2240"/><rect x="104" y="30" width="40" height="9" rx="4" fill="#2B2240"/>
<rect x="96" y="50" width="32" height="22" rx="5" fill="#B82A5B"/>
<rect x="76" y="68" width="72" height="110" rx="18" fill="#D4336A"/>
<rect x="88" y="98" width="48" height="52" rx="10" fill="#FFFFFF"/><g transform="translate(112 126) scale(0.8)" fill="#6C4AB6"><ellipse cx="-14" cy="-6" rx="5" ry="6.5" transform="rotate(-25 -14 -6)"/><ellipse cx="-5" cy="-15" rx="5" ry="7"/><ellipse cx="5" cy="-15" rx="5" ry="7"/><ellipse cx="14" cy="-6" rx="5" ry="6.5" transform="rotate(25 14 -6)"/><path d="M0 16 C-12 9 -16 3 -14 -2 C-12 -7 -4 -8 0 -2 C4 -8 12 -7 14 -2 C16 3 12 9 0 16 Z"/></g>
<g className="art-wiggle"><g transform="rotate(-30 232 128)"><rect x="222" y="128" width="20" height="62" rx="10" fill="#6C4AB6"/>
<rect x="198" y="84" width="68" height="48" rx="14" fill="#5A3AA3"/>
<g stroke="#FFF4E0" strokeWidth="4" strokeLinecap="round"><path d="M208 84 v-12 M220 84 v-12 M232 84 v-12 M244 84 v-12 M256 84 v-12"/></g></g></g>
<g className="art-bubbles" fill="#FFFFFF" stroke="#D8CBF3" strokeWidth="3"><circle cx="170" cy="56" r="12"/><circle cx="190" cy="36" r="8"/><circle cx="60" cy="70" r="10"/><circle cx="48" cy="48" r="6"/></g>
    </g>
  ),
  beds: (
    <g>

<ellipse cx="160" cy="184" rx="130" ry="8" fill="#000" opacity=".07"/>
<ellipse cx="160" cy="146" rx="128" ry="40" fill="#6C4AB6"/>
<ellipse cx="160" cy="136" rx="102" ry="26" fill="#D8CBF3"/>
<g className="art-breathe">
<path d="M214 134 C236 150 190 160 150 150" fill="none" stroke="#F2A65A" strokeWidth="13" strokeLinecap="round"/>
<ellipse cx="170" cy="124" rx="58" ry="24" fill="#F2A65A"/>
<path d="M150 104 C160 110 176 110 186 104 M200 108 C206 114 212 118 218 118" fill="none" stroke="#D98A3D" strokeWidth="4" strokeLinecap="round"/>
<path d="M96 108 L100 76 L120 94 Z M136 104 L138 74 L118 92 Z" fill="#F2A65A" stroke="#F2A65A" strokeWidth="4" strokeLinejoin="round"/>
<path d="M102 100 L104 84 L114 94 Z M130 98 L131 84 L121 92 Z" fill="#F8C8D8"/>
<circle cx="118" cy="116" r="24" fill="#F2A65A"/>
<path d="M104 116 q5 5 10 0 M122 116 q5 5 10 0" fill="none" stroke="#2B2240" strokeWidth="3" strokeLinecap="round"/>
<path d="M115 124 h6 l-3 3 z" fill="#D4336A"/>
<ellipse cx="146" cy="136" rx="10" ry="6" fill="#FFF4E0"/>
</g>
<g className="art-z">{z(214, 70, 22)}{z(236, 52, 16)}{z(252, 38, 12)}</g>
    </g>
  ),
  sofa: (
    <g>
<ellipse cx="160" cy="184" rx="130" ry="8" fill="#000" opacity=".07"/>
<rect x="70" y="160" width="12" height="22" rx="4" fill="#4A2E8A"/><rect x="238" y="160" width="12" height="22" rx="4" fill="#4A2E8A"/>
<rect x="60" y="58" width="200" height="86" rx="32" fill="#5A3AA3"/>
<g fill="#D8CBF3" opacity=".55"><circle cx="112" cy="88" r="4"/><circle cx="160" cy="84" r="4"/><circle cx="208" cy="88" r="4"/></g>
<rect x="48" y="116" width="224" height="52" rx="22" fill="#6C4AB6"/>
<rect x="80" y="106" width="160" height="30" rx="15" fill="#D8CBF3"/>
<rect x="34" y="94" width="48" height="76" rx="24" fill="#6C4AB6"/><rect x="238" y="94" width="48" height="76" rx="24" fill="#6C4AB6"/>
<rect x="42" y="100" width="32" height="14" rx="7" fill="#FFFFFF" opacity=".18"/><rect x="246" y="100" width="32" height="14" rx="7" fill="#FFFFFF" opacity=".18"/>
<g className="art-breathe"><g transform="translate(14 -26)">
<path d="M214 134 C236 150 190 160 150 150" fill="none" stroke="#F2A65A" strokeWidth="13" strokeLinecap="round"/>
<ellipse cx="170" cy="124" rx="58" ry="24" fill="#F2A65A"/>
<path d="M150 104 C160 110 176 110 186 104 M200 108 C206 114 212 118 218 118" fill="none" stroke="#D98A3D" strokeWidth="4" strokeLinecap="round"/>
<path d="M96 108 L100 76 L120 94 Z M136 104 L138 74 L118 92 Z" fill="#F2A65A" stroke="#F2A65A" strokeWidth="4" strokeLinejoin="round"/>
<path d="M102 100 L104 84 L114 94 Z M130 98 L131 84 L121 92 Z" fill="#F8C8D8"/>
<circle cx="118" cy="116" r="24" fill="#F2A65A"/>
<path d="M104 116 q5 5 10 0 M122 116 q5 5 10 0" fill="none" stroke="#2B2240" strokeWidth="3" strokeLinecap="round"/>
<path d="M115 124 h6 l-3 3 z" fill="#D4336A"/>
<ellipse cx="146" cy="136" rx="10" ry="6" fill="#FFF4E0"/>
</g></g>
<g className="art-heart"><path transform="translate(270 40) scale(1.1)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#D4336A"/></g>
<g className="art-heart" style={{ animationDelay: "-0.9s" }}><path transform="translate(292 22) scale(.7)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#6C4AB6"/></g>
    </g>
  ),
  "sleeping-bag": (
    <g>
<ellipse cx="160" cy="184" rx="130" ry="8" fill="#000" opacity=".07"/>
<path d="M58 150 C50 110 92 94 150 98 L250 104 C286 108 296 160 262 170 C220 182 110 184 78 176 C64 172 60 162 58 150 Z" fill="#D4336A"/>
<ellipse cx="104" cy="132" rx="52" ry="30" fill="#FFF4E0"/>
<g className="art-nod">
<ellipse cx="80" cy="118" rx="12" ry="26" transform="rotate(20 80 118)" fill="#9C6440"/>
<ellipse cx="128" cy="118" rx="12" ry="26" transform="rotate(-20 128 118)" fill="#9C6440"/>
<circle cx="104" cy="114" r="28" fill="#E9B27A"/>
<ellipse cx="104" cy="126" rx="16" ry="11" fill="#FFF4E0"/>
<ellipse cx="104" cy="120" rx="6" ry="4.5" fill="#2B2240"/>
<path d="M89 108 q5 5 10 0 M109 108 q5 5 10 0" fill="none" stroke="#2B2240" strokeWidth="3" strokeLinecap="round"/>
<path d="M100 130 q4 4 8 0" fill="none" stroke="#2B2240" strokeWidth="2.5" strokeLinecap="round"/>
</g>
<path d="M132 104 C150 126 152 150 136 176 L262 170 C296 160 286 108 250 104 Z" fill="#B82A5B"/>
<path d="M132 104 C150 126 152 150 136 176" fill="none" stroke="#F8C8D8" strokeWidth="7" strokeLinecap="round"/>
<g fill="none" stroke="#F8C8D8" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" opacity=".8"><path d="M182 108 C192 128 192 152 180 174"/><path d="M226 106 C236 128 236 152 224 172"/></g>
<g fill="#FFF4E0"><ellipse cx="128" cy="158" rx="10" ry="7"/><ellipse cx="114" cy="162" rx="9" ry="6"/></g>
<g className="art-z">{z(150, 70, 22)}{z(172, 52, 16)}{z(188, 38, 12)}</g>
    </g>
  ),
  toys: (
    <g>
<ellipse cx="160" cy="182" rx="130" ry="9" fill="#000" opacity=".07"/>
<circle cx="112" cy="116" r="54" fill="#FFC857"/>
<path d="M66 88 C96 104 128 104 158 88" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
<path d="M66 144 C96 128 128 128 158 144" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
<circle cx="92" cy="96" r="10" fill="#FFFFFF" opacity=".35"/>
<path d="M198 150 C214 108 250 150 268 104" fill="none" stroke="#D4336A" strokeWidth="18" strokeLinecap="round"/>
<path d="M198 150 C214 108 250 150 268 104" fill="none" stroke="#FFFFFF" strokeWidth="18" strokeDasharray="6 14" strokeLinecap="butt" opacity=".45"/>
<circle cx="196" cy="156" r="16" fill="#6C4AB6"/><circle cx="270" cy="98" r="16" fill="#6C4AB6"/>
<g stroke="#6C4AB6" strokeWidth="5" strokeLinecap="round"><path d="M186 170 l-8 10 M196 172 v12 M206 168 l8 10"/><path d="M280 88 l8 -10 M270 82 v-12 M260 86 l-8 -10"/></g>
    </g>
  ),
  collars: (
    <g>
<ellipse cx="160" cy="182" rx="130" ry="9" fill="#000" opacity=".07"/>
<ellipse cx="150" cy="92" rx="86" ry="40" fill="none" stroke="#B82A5B" strokeWidth="20"/>
<path d="M64 92 A86 40 0 0 0 236 92" fill="none" stroke="#D4336A" strokeWidth="20"/>
<g fill="#FFFFFF"><circle cx="86" cy="112" r="4"/><circle cx="114" cy="124" r="4"/><circle cx="186" cy="124" r="4"/><circle cx="214" cy="112" r="4"/></g>
<rect x="136" y="118" width="28" height="24" rx="5" fill="none" stroke="#E8A93A" strokeWidth="6"/>
<circle cx="150" cy="148" r="7" fill="none" stroke="#E8A93A" strokeWidth="4"/>
<path transform="translate(150 170) scale(1.9)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#FFC857" stroke="#E8A93A" strokeWidth="1.5"/>
<path d="M258 60 C296 70 292 120 262 132 C240 140 238 170 272 176" fill="none" stroke="#6C4AB6" strokeWidth="8" strokeLinecap="round"/>
<circle cx="258" cy="60" r="9" fill="none" stroke="#6C4AB6" strokeWidth="5"/>
    </g>
  ),
};

type ArtProps = { className?: string; width?: number; height?: number };

export function Illustration({ name, className, width, height }: ArtProps & { name: IllustrationName }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 320 200" aria-hidden="true" focusable="false">
      {ART[name]}
    </svg>
  );
}

export function HeroIllustration({ className, width, height }: ArtProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="30 30 340 340" aria-hidden="true" focusable="false">

<ellipse cx="200" cy="366" rx="150" ry="12" fill="#000" opacity=".08"/>
<g className="art-tail"><path d="M186 336 C214 318 206 270 230 252" fill="none" stroke="#F2A65A" strokeWidth="16" strokeLinecap="round"/></g>
<ellipse cx="135" cy="290" rx="58" ry="70" fill="#F2A65A"/>
<ellipse cx="135" cy="282" rx="26" ry="42" fill="#FFF4E0"/>
<ellipse cx="113" cy="356" rx="18" ry="10" fill="#FFF4E0"/><ellipse cx="157" cy="356" rx="18" ry="10" fill="#FFF4E0"/>
<path d="M92 176 L90 120 L130 150 Z M178 176 L180 120 L140 150 Z" fill="#F2A65A" stroke="#F2A65A" strokeWidth="8" strokeLinejoin="round"/>
<path d="M99 160 L98 134 L118 150 Z M171 160 L172 134 L152 150 Z" fill="#F8C8D8"/>
<circle cx="135" cy="196" r="52" fill="#F2A65A"/>
<path d="M118 152 q4 10 0 18 M135 148 v16 M152 152 q-4 10 0 18" stroke="#D98A3D" strokeWidth="5" fill="none" strokeLinecap="round"/>
<ellipse cx="135" cy="214" rx="22" ry="15" fill="#FFF4E0"/>
<g className="art-blink"><ellipse cx="115" cy="194" rx="7" ry="8" fill="#2B2240"/><ellipse cx="155" cy="194" rx="7" ry="8" fill="#2B2240"/>
<circle cx="117" cy="191" r="2.5" fill="#FFFFFF"/><circle cx="157" cy="191" r="2.5" fill="#FFFFFF"/></g>
<path d="M130 206 h10 l-5 6 z" fill="#D4336A"/>
<path d="M127 218 q4 5 8 0 q4 5 8 0" fill="none" stroke="#2B2240" strokeWidth="2.5" strokeLinecap="round"/>
<g stroke="#D98A3D" strokeWidth="2.5" strokeLinecap="round"><path d="M98 212 l-22 -4 M98 220 l-22 4 M172 212 l22 -4 M172 220 l22 4"/></g>
<ellipse cx="270" cy="292" rx="66" ry="72" fill="#E9B27A"/>
<ellipse cx="270" cy="290" rx="30" ry="46" fill="#FFF4E0"/>
<ellipse cx="244" cy="358" rx="20" ry="11" fill="#FFF4E0"/><ellipse cx="296" cy="358" rx="20" ry="11" fill="#FFF4E0"/>
<g className="art-tilt">
<circle cx="270" cy="186" r="58" fill="#E9B27A"/>
<ellipse cx="218" cy="190" rx="20" ry="46" transform="rotate(18 218 190)" fill="#9C6440"/>
<ellipse cx="322" cy="190" rx="20" ry="46" transform="rotate(-18 322 190)" fill="#9C6440"/>
<ellipse cx="270" cy="214" rx="30" ry="22" fill="#FFF4E0"/>
<ellipse cx="270" cy="202" rx="11" ry="8" fill="#2B2240"/>
<path d="M262 228 q8 14 16 0" fill="#D4336A"/>
<circle cx="248" cy="178" r="7" fill="#2B2240"/><circle cx="292" cy="178" r="7" fill="#2B2240"/>
<circle cx="250" cy="175" r="2.5" fill="#FFFFFF"/><circle cx="294" cy="175" r="2.5" fill="#FFFFFF"/>
</g>
<path d="M224 244 Q270 264 316 244" fill="none" stroke="#D4336A" strokeWidth="11" strokeLinecap="round"/>
<path transform="translate(270 262) scale(1.1)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#FFC857" stroke="#E8A93A" strokeWidth="1.5"/>
<g className="art-heart"><path transform="translate(204 92) scale(2.6)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#D4336A"/></g><g className="art-heart" style={{ animationDelay: "-0.6s" }}><path transform="translate(160 66) scale(1.1)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#6C4AB6"/></g><g className="art-heart" style={{ animationDelay: "-1.2s" }}><path transform="translate(250 58) scale(0.9)" d="M0 12 C-10 5 -13 0 -12 -4 C-11 -9 -3 -10 0 -4 C3 -10 11 -9 12 -4 C13 0 10 5 0 12 Z" fill="#D4336A"/></g>
    </svg>
  );
}
