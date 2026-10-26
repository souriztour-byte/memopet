/**
 * Sends a copy of the product photo flying into the cart icon after an add.
 * The target is the last visible element marked `data-cart-target` (the phone
 * tab bar's cart when it shows, otherwise the header cart). Skipped for
 * people who ask their device for reduced motion.
 */
export function flyToCart(source: Element | null) {
  if (!source || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const photo = source.querySelector("img");
  const target = [...document.querySelectorAll<HTMLElement>("[data-cart-target]")]
    .filter((el) => el.getClientRects().length > 0)
    .at(-1);
  if (!photo || !target) return;

  const from = photo.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = Math.min(from.width, from.height);
  const ghost = photo.cloneNode() as HTMLImageElement;
  ghost.removeAttribute("srcset");
  ghost.src = photo.currentSrc || photo.src;
  ghost.alt = "";
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left + (from.width - size) / 2}px`,
    top: `${from.top + (from.height - size) / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "50%",
    zIndex: "70",
    pointerEvents: "none",
    boxShadow: "0 12px 30px rgba(48, 40, 32, 0.3)",
  });
  document.body.append(ghost);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const scale = 28 / size;
  ghost
    .animate(
      [
        { transform: "translate(0, 0) scale(0.9)", opacity: 1 },
        { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 60}px) scale(${scale * 3})`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.2 },
      ],
      { duration: 750, easing: "cubic-bezier(0.5, 0, 0.2, 1)" },
    )
    .finished.finally(() => ghost.remove());
}
