import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/config";

/* Shared layout for the generated share images (Open Graph): the picture that
   WhatsApp, Instagram, Facebook and others show when a link is shared.
   Satori renders it, so only inline styles and flexbox are available, and
   colours are the brand tokens from globals.css written out. */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export const ogColors = {
  ink: "#221A33",
  muted: "#5E5570",
  pink: "#D4336A",
  purple: "#6C4AB6",
  lilac: "#EFE8FB",
  pinkSoft: "#FCE4EC",
  cream: "#FFF1DC",
};

/** Product tile class → background colour, as in globals.css (.t1/.t2/.t3). */
export const ogTile = { t1: ogColors.lilac, t2: ogColors.pinkSoft, t3: ogColors.cream } as const;

export async function ogFonts() {
  const [semiBold, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Poppins-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Poppins-Bold.ttf")),
  ]);
  return [
    { name: "Poppins", data: semiBold, weight: 600 as const, style: "normal" as const },
    { name: "Poppins", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

const host = () => {
  try {
    return new URL(siteConfig.url).host;
  } catch {
    return siteConfig.name;
  }
};

export function OgFrame({
  eyebrow,
  title,
  accent,
  detail,
  detailTone = "pink",
  art,
}: {
  eyebrow?: string | null;
  title: string;
  /** Second title line in pink, as in the home page hero. */
  accent?: string;
  detail?: string | null;
  /** Pink for prices, muted for a tagline. */
  detailTone?: "pink" | "muted";
  art: React.ReactNode;
}) {
  // Long headlines (e.g. in Spanish) get a smaller size so they stay on three lines.
  const longest = Math.max(title.length, accent?.length ?? 0);
  const titleSize = longest > 16 ? 54 : accent ? 68 : 62;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 56,
        padding: "56px 64px",
        background: "#FFFFFF",
        fontFamily: "Poppins",
        color: ogColors.ink,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
        <Logo colors={{ a: ogColors.purple, b: ogColors.pink }} width={284} height={80} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {eyebrow ? (
            <div
              style={{
                color: ogColors.pink,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {title}
          </div>
          {accent ? (
            <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, color: ogColors.pink }}>
              {accent}
            </div>
          ) : null}
          {detail ? (
            <div
              style={
                detailTone === "pink"
                  ? { marginTop: 22, fontSize: 40, fontWeight: 700, color: ogColors.pink }
                  : { marginTop: 22, fontSize: 28, fontWeight: 600, color: ogColors.muted }
              }
            >
              {detail}
            </div>
          ) : null}
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, color: ogColors.purple }}>{host()}</div>
      </div>
      {art}
    </div>
  );
}
