# MimiPets motion plan

How the site moves, and why. One system for every page: CSS for small
interactions, GSAP + ScrollTrigger only where motion is tied to scrolling
(loaded on demand, home page only). On computers the page glides to where
the wheel sends it (Lenis, `SmoothScroll.tsx`, at the shop owner's request);
it still moves the browser's own scroll position, so sticky sections, anchors
and scroll animations behave as before, and nothing delays the page. Phones
keep their own touch scrolling. Back, Forward and reload return to where the
reader was (`ScrollMemory.tsx`). Everything below is switched off for
visitors who ask their device for reduced motion.

## Reference study (bbrose.com, inspected in a browser)

What we first adapted, in an earlier look (the home page has since been rebuilt as "One good day", see Home below):

| bbrose | MimiPets |
| --- | --- |
| Floating pill header over a full-screen photo, centred logo | Floating ivory pill header, paw-heart logo |
| Hover mega-menu with round thumbnails and arrows | "Shop" dropdown with round product photos and the two categories |
| Hero: slow photo/video sequence, serif headline rising line by line, coloured italic word with a shine, drawn underline, ticker strip | Hero: cross-fading pet photos with slow zoom, headline rising line by line, gold italic line with a sheen, drawn gold underline, ticker of our real promises |
| Product row with tabs (Hair / Skin), card lifts on hover | Product rail with a Dogs / Cats / All switch, draggable, cards lift on hover |
| Split image + text sections | Pinned "comfort" story: the photo changes as each step scrolls by |
| Card carousels with arrows | Horizontal "after the walk" scenes, moved by scrolling (desktop) or swiping |
| Big centred philosophy line over a faint watermark | Brand story: words light up as you scroll, over a faint MIMIPETS watermark |
| Dark newsletter band with giant watermark | Espresso MimiPets Club band with a gold watermark |
| Footer with giant faded logo | Footer with giant faded wordmark |

Not taken: their imagery, assistant chatbot, community/review walls (we have
no reviews yet and don't invent any).

## Motion tokens (globals.css)

- Easing: `--ease-out` cubic-bezier(0.22, 1, 0.36, 1) for things arriving,
  `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1) for things moving across.
- Durations: `--dur-fast` 180 ms (hovers, presses), `--dur-base` 450 ms
  (menus, panels, photo swaps), `--dur-slow` 900 ms (reveals, hero).
- Distances: reveals rise 24 px; page transitions 14 px.
- Only `transform`, `opacity`, `clip-path` and `filter` are animated.

## Every page

- Page change: old page fades, new one rises (View Transitions); a product
  photo glides from its card to the product page.
- Header: floating pill; nav underline grows from the left on hover; it
  slims after scrolling. "Shop" opens a dropdown (hover, focus or tap).
- Search: full-screen overlay (header icon, phone tab bar), instant
  results with photos, Esc or tap outside to close.
- Phones: menu slides in as a panel with links rising one by one; tab bar
  stays put during page changes.
- Desktop cursor: the normal pointer (the gold ring that followed it was
  removed at the shop owner's request).
- Buttons: press-in on tap, gold sheen on hover. Cards lift on hover.
- Cart: slides in over a blurred backdrop, lines arrive one after another,
  free-shipping bar fills and celebrates at €40; slides out on close.
- Scroll reveals: sections rise in; photos unveil top to bottom.

## Home: "One good day"

The home page is a pet's day, from sunrise to lights out. Each chapter has
its own light, and each product sits in its moment, ready to buy.

1. 07:30 Good morning: the sun comes up behind an arched window with the
   first product; the headline counts the products ("four things for it");
   the day's line-up links to each product's place in the story.
2. 08:15 The walk: muddy paw prints.
3. 08:45 Clean paws: the paw washers as white plates. Colour dots change the
   photo, sizes are one tap, Add to cart works there. A video or
   before/after appears when uploaded in Shopify.
4. 14:00 The nap and 22:30 Lights out: the beds, each beside a large photo;
   the sky turns from gold to dusk to night, with stars.
5. "Tomorrow, again": the three offers and the quiz link, then the Club band
   and footer, all in the night colours.

Down the side runs the trail: the sun (a moon at night) with the time,
which stays in view while its chapter scrolls, and paw prints that land as
they scroll into view: muddy before the wash, clean outlines after. On
phones the time is a small floating chip. The header and the phone tab bar
take on the colour of the chapter under them (`html[data-moment]`, set by
`HomeMotion.tsx`). Scrolling the day:

- The day dial: a sun travels along a line as the page scrolls and becomes a
  moon at night. On computers it is on the right edge, with a dot per
  chapter to jump there (times slide out on hover or keyboard focus); on
  smaller screens it is a thin line across the top.
- Photos drift a little inside their frames (more on phones, gently on
  computers), the sun behind the first photo keeps rising, and the muddy
  prints of the walk appear one after another.
- On phones, five paw prints walk across at the end of each chapter.
- "Back to the morning" at the end glides to the top.

Products are placed by `dayLineup` in
`src/lib/content/day.ts`; the same number and moment show on each product
page. With reduced motion everything is simply in place.

## Shop and collections

Dogs / Cats / All switch with cards fading out and back in; cards with
swatches, hover photo, quick add.

## Product page

Photo glides in from the card; zoom under the mouse; swipe on phones;
colour dots and size buttons animate their selection; Add to cart ticks
and sends the photo to the cart; sticky bar on phones.

## Accessibility and performance

- `prefers-reduced-motion: reduce` turns every animation off; content is
  visible without JavaScript.
- Menus, search and cart are keyboard-operable with visible focus; rails
  scroll with the keyboard and have buttons.
- GSAP loads only on the home page, after the page is interactive.
