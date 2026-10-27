# MimiPets motion plan

How the site moves, and why. One system for every page: CSS for small
interactions, GSAP + ScrollTrigger only where motion is tied to scrolling
(loaded on demand, home page only). Native scrolling throughout — nothing
hijacks the wheel or delays the page. Everything below is switched off for
visitors who ask their device for reduced motion.

## Reference study (bbrose.com, inspected in a browser)

What we adapted, in our own look (ivory, espresso, champagne gold):

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
- Desktop cursor: a small gold ring follows the mouse and grows with a
  label over product photos ("View") and rails ("Drag").
- Buttons: press-in on tap, gold sheen on hover. Cards lift on hover.
- Cart: slides in over a blurred backdrop, lines arrive one after another,
  free-shipping bar fills and celebrates at €40; slides out on close.
- Scroll reveals: sections rise in; photos unveil top to bottom.

## Home

1. Hero (full screen): photo sequence with slow zoom; headline lines rise
   with a mask; gold underline draws; on scroll the photo scales and the
   text drifts up and fades (parallax layers).
2. The collection: Dogs / Cats / All switch (cards fade out and back in),
   draggable rail with arrows and a progress line.
3. Comfort story (pinned): three steps about the beds; the sticky photo
   cross-fades and zooms as each step becomes active.
4. After the walk (desktop: pinned horizontal scenes moved by scrolling;
   phones: swipe): how the paw washers work, from the product listings.
5. Featured product: the Silicone Paw Washer, colour dots swap the photo,
   size choice and add to cart right there.
6. See it in action: product video or before/after when uploaded in
   Shopify; until then, the three real steps of using the washer.
7. Brand story: words light up as you scroll past.
8. Quiz invitation, promises ticker, MimiPets Club band.

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
