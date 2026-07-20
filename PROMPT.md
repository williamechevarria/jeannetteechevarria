# Reproduction Prompt — jeannetteechevarria.com rebuild

Paste the prompt below into a fresh Claude Code session (in an empty project folder) to reproduce this website. No API keys are required — all imagery is recovered from the Wayback Machine or downloaded from Unsplash.

---

## Prompt

Build a single-page static website (plain `index.html` + `css/styles.css` + `js/main.js` + `assets/`, zero build step, zero dependencies) that is an improved rebuild of the defunct realtor site jeannetteechevarria.com. Serve it locally with `python3 -m http.server 4173`.

### Source content (from the Wayback capture at
`https://web.archive.org/web/20250327224851/https://www.jeannetteechevarria.com/`)

- **Realtor:** Jeannette Echevarria, founder/owner of **JME Elite** at **LPT Realty**. Career began in Virginia at "some of Virginia's finest real estate firms," then extended to Florida. **She is now based in Tampa**, serving Tampa Bay, Central and South Florida, and Northern Virginia. Client-first mentality; expertise, tenacity, and love for negotiating.
- **Contact:** phone `407.962.6932`, email `jeannette@jmeelite.com`. Socials: Facebook, Instagram, LinkedIn, YouTube.
- **Stats:** Top 5% in the nation · $100M sales in a single year · producer in both Virginia & Miami markets · 25+ years combined team experience.
- **Accolades:** Relocation Certified · Icon Award Agent · Certified Luxury Listing Specialist · Expansion Team Owner · Certified Military Relocation Specialist · Success Coach.
- **Team:** Jeannette Echevarria (JME Elite Owner, jeannette@jmeelite.com) and William Echevarria (Strategic Partner, echevarria.will@gmail.com).
- **Featured properties:** 2000 South Ocean Dr, Hallandale Beach FL 33009 (Minotti-furnished half-floor residence); 18 Grassland St, Stafford VA 22554 (5BR in Widewater Village); 36 Somerset Ln (2,184 sqft on 2.2 acres, 3BR/2BA); 3325 Russie Run Rd, Locust Grove VA 22508 (Cape Cod, 4BR/3BA); 807 Twin Brook Ln (renovated brick-front townhouse near Quantico).
- **Testimonials (Jeannette-specific ones only):** rtbetsy ("helped us every step of the way…"), the short-sale client ("never seen a realtor work so hard… two mortgage companies… record time"), bmac1231 ("forever home in Woodbridge… townhouse in Burke"), lacek00 ("Jeannette and Melinda are the best… negotiated late into the night").
- **LPT Realty recruiting section:** cloud-based brokerage, 100% commission ($500/file, $5,000 cap, $11k+ tech, stock grants), RevShare Partner (80/20, $15k cap, 7 levels), Real Estate Team tools, Your Own Brokerage, Retirement Wealth. Headline: "Real Estate Reimagined / Join the Movement."
- **Footer:** accessibility statement (contact jeannette@jmeelite.com about accessibility issues) + "© <year> Jeannette Echevarria. All rights reserved."

### Design system — "Two Coastlines, One Standard"

The signature concept: Jeannette's Virginia→Florida story is encoded as **latitude coordinates** used as structural eyebrows throughout (27.95° N · Tampa Bay / 38.65° N · Northern Virginia), including giant watermark coordinates in Italiana at ~4.5% ink opacity behind the About and Contact sections, and per-property geo lines like "38.42° N · Virginia" on portfolio cards.

- **Palette:** ink teal `#0e2a30` (dark sections), raised teal `#14454c`, aqua `#3fa79b`, bright aqua `#5ecfc0` (accents on dark), warm shell paper `#f6f2ea`, sand `#e8e0cf` (borders), white `#fdfcf9`, body text `#21373c`, muted `#5c7076`.
- **Type (Google Fonts):** `Italiana` for all display headings/numbers (Deco-Miami hairline elegance), `Figtree` for body/UI, `Lora` italic for testimonial quotes. Eyebrows: 12px, 0.32em letter-spacing, uppercase.
- **Buttons:** pill-shaped (999px), uppercase 13.5px letter-spaced; solid aqua w/ aqua glow shadow, ghost (light border) on dark, solid ink on light.
- **Cards:** 18px radius; dark cards are `#14454c` with `rgba(94,207,192,.16)` borders that brighten on hover; hover = translateY(-8px) + deep shadow + image scale(1.07).

### Page structure (in order)

1. **Fixed nav** — starts transparent with white text over hero; after 40px scroll gains cream translucent blur background and ink text (`.is-scrolled`). Left: circular "JE" monogram + "Jeannette Echevarria" in Italiana. Center links (About, Portfolio, Search MLS, Areas, Testimonials, Team, Join LPT) with animated underline + scroll-spy active state; pill "Work With Me" CTA; phone number right. Mobile ≤900px: hamburger (must set `color: inherit` on the button) opening a dark slide-down panel. Plus a 3px scroll-progress bar fixed at the very top (aqua gradient).
2. **Hero** — full-viewport aerial Florida-coastline photo with slow Ken Burns zoom (24s alternate), teal gradient scrim, centered: latitude eyebrow "27.95° N · Tampa Bay — 38.65° N · Northern Virginia" (shell-white with text-shadow), two-line name in huge Italiana (clamp(56px, 11vw, 152px)) with rise-up mask reveal animation ("Jeannette" white, "Echevarria" bright aqua, 0.18s stagger, text-shadow for contrast), subline "Two coastlines. One standard. Top-producing real estate across Florida — from Tampa Bay to Miami — and Northern Virginia, led by tenacity, negotiation, and a client-first heart.", two pill CTAs, animated scroll-hint line at bottom.
3. **Neighborhood ticker** — ink band, infinitely scrolling marquee (CSS keyframes, duplicated list, pause on hover) of service areas in Italiana caps separated by tiny aqua diamonds: Tampa, St. Petersburg, Clearwater, Sarasota, Orlando, Miami, Hallandale Beach, Fort Lauderdale, Stafford, Woodbridge, Alexandria, Arlington.
4. **Stats band** — ink background, 4 columns with thin aqua dividers, IntersectionObserver-triggered count-up numbers in Italiana bright aqua (Top 5% / $100M / 2 states — producer in Florida & Virginia / 25+) with uppercase letter-spaced labels.
5. **About** — shell background, giant `27.95° N` watermark; left: Jeannette's cut-out portrait inside an arch-topped frame (border-radius `260px 260px 18px 18px`) filled with an aqua→teal gradient, plus a floating circular "JME · Elite Founder" ink badge (gentle 5s bob animation); right: eyebrow "38.65° N — Where it began", heading "From Virginia's finest firms to the Miami skyline" (no hard line-breaks), the two bio paragraphs, accolade pill chips with aqua ✦ and hover lift, "Start a Conversation" button + "Meet the team →" arrow link.
6. **Portfolio** — dark section "A portfolio spanning two coastlines", 3-column grid where the Hallandale condo card spans 2 rows (tall), each card: image w/ hover zoom, geo-latitude eyebrow, Italiana address heading, location line, description. All five properties above.
7. **MLS Search** (`id="search"`, raised-teal dark section with a radial aqua glow) — heading "Your next address starts here", then a glassy search bar card: location text input, Type/Beds/Max-price selects (custom aqua chevron via inline SVG data-URI), "Search Homes" button. A comment marks `<div id="idxSlot">` as the IDX-provider embed slot (IDX Broker / iHomefinder / Chime). Until IDX is connected, submit prefills the contact-form message with the criteria, selects "I'm buying", and smooth-scrolls to contact, updating a note line: "finish sending your criteria below…".
8. **Areas — interactive market map** (the crown feature). A dark ink "mapboard" card (dotted-grid background, 22px radius) with a two-column layout:
   - **Left:** market list grouped Florida / Northern Virginia. FL: Tampa (Home base · Bay-front & urban core), St. Petersburg, Sarasota, Orlando, Miami & South Florida. VA: Arlington & Alexandria, Woodbridge, Stafford (Military relocation · Quantico). Items and groups highlight in sync with the map; a hint line explains the interaction.
   - **Right:** two `<figure>` panels ("Virginia · 38.65° N" on top, "Florida · 27.95° N" below, each with a small-caps caption). Each contains an SVG with that state's outline path taken from Wikimedia Commons' public-domain "Blank US Map (states only).svg" (extract the `class="fl"` and `class="va"` path `d` attributes). **JS auto-fits each viewBox from `path.getBBox()`** (+6% x / +10% y padding, +22% width on the right for labels) so each state fills its panel large. States: translucent aqua fill, aqua stroke; hover/highlight swaps to an aqua→teal `linearGradient` fill + `drop-shadow` glow (state hover also highlights its list group and vice versa).
   - **Pins** are placed by JS as fractions of each state's bbox — FL: Tampa (.56,.50, gold "home" pin), St. Petersburg (.50,.60, label left), Sarasota (.57,.66), Orlando (.68,.42), Miami (.87,.82); VA: Arlington (.815,.12), Woodbridge (.79,.26, label left), Stafford (.775,.40). Each pin `<g tabindex=0>` = invisible r=10 hit circle + animated expanding halo ring + 4px core (grows white on hover) + 8px label with dark stroke halo. Hovering shows a light cursor-following tooltip (name, blurb, pill tag) and syncs the list.
   - **Selecting any pin or list item opens the Market Explorer dialog** (`#marketModal`): shell-colored panel (rise-in animation, backdrop blur, Esc/backdrop/× close, body scroll lock), market name in Italiana + tag + blurb, then a two-button intent choice — **"I'm buying here / See available inventory"** and **"I'm selling here / Schedule a listing appointment"** (picked state inverts to ink). Buying renders listing cards from a `LISTINGS` map keyed by market (Miami → 2000 South Ocean Dr; Stafford → 18 Grassland, 36 Somerset, 807 Twin Brook; Woodbridge → 3325 Russie Run) with thumbnail/address/desc linking to #portfolio, or an honest empty state ("No public listings in X this week…") — either way followed by a full-width CTA ("Get every X listing" / "Get first access in X") that prefills the contact form (side=Buying + message) and scrolls to it. Selling renders a listing-appointment pitch + "Schedule my listing appointment" CTA that prefills side=Selling with a market-specific message.
   Below the mapboard: **three photo area cards** (Tampa Bay "27.95° N · Home Base" with palm-lined bay skyline photo; South Florida with Ocean Drive Art Deco night shot; Northern Virginia with Washington Monument cherry blossoms) with bottom gradient overlays, latitude labels, hover lift + subtle 3D mouse-tilt (max ~4°, only when `hover: hover` and no reduced motion). Then the ink "Wondering what your home is worth?" valuation CTA bar.
9. **Testimonials** — dark section with a giant ghost `"` glyph, cross-fading quote carousel (Lora italic, ~6.5s autoplay, prev/next circle buttons, clickable dots, pointer-swipe support), the 4 Jeannette testimonials.
10. **Team** — shell background "JME Elite", two centered cards (Jeannette, William) with circular aqua-ringed photos, Italiana names, role eyebrows, mailto links, hover lift.
10.5 (between Team and Join LPT). **Social feed** (`id="social"`, shell background) — centered head "Follow Along / @jeannetteechevarria". An edge-to-edge auto-scrolling marquee (same keyframes as the ticker, 52s, pause on hover, soft fade mask at both edges) of 4:5 social cards: photo cards reusing site assets with a gradient caption bar (network eyebrow in aqua caps + one-line caption, e.g. "Golden hour on the Bay — new Tampa listing drops Friday", "JUST SOLD — Cape Cod charm in Locust Grove") and ink "quote" cards in Lora italic (market takes, a Quantico VA-loan reel, a 100th-closing milestone). Cards link to the social profiles; JS clones the track children once (aria-hidden) for a seamless loop. A comment marks `<div id="socialSlot">` as the slot for a real feed widget (Behold / Elfsight / LightWidget). Below: "Follow on Instagram" button.
11. **Join LPT** — dark section with Miami-skyline-at-dusk photo at ~22% opacity behind a teal gradient; heading "Real estate, reimagined — join the movement", lede about LPT Realty, 3×2 grid of glass (blurred translucent) model cards: 100% Commission, RevShare Partner, Real Estate Team, Your Own Brokerage, Retirement Wealth, and a "Ready?" card with "Sign Me Up" button.
12. **Contact** — shell, `38.65° N` watermark; left column: "Let's talk about your next move", contact list (phone / email / brokerage in large Italiana), circular social buttons (Fb Ig In Yt); right: white form card with a buying/selling/joining-the-team radio pill toggle, floating-label inputs (first/last name, email, message), submit builds a `mailto:jeannette@jmeelite.com` link with the form contents and shows a status note; inline validation message when required fields are empty.
13. **Footer** — ink; brand, anchor links, the full accessibility statement, copyright line with JS-updated year + Unsplash photo credit.
14. **Back-to-top** floating circle button appearing after 700px scroll.

### Behavior & quality bar

- All animation via CSS + one vanilla JS IIFE: scroll progress, nav state, scroll-spy, IntersectionObserver reveal-on-scroll (`.reveal` translateY fade with 90ms stagger inside grids), counters, carousel, tilt, form, year. No libraries.
- Respect `prefers-reduced-motion` everywhere (skip reveals/counters/autoplay/tilt/Ken Burns).
- Visible `:focus-visible` outlines, aria-labels on icon buttons, `role="status"` on the form note.
- Responsive breakpoints at 1080px (2-col portfolio/join, stats 2×2), 900px (hamburger nav, stacked about/contact/areas), 640px (single column everything, hide brand text).
- Smooth anchor scrolling with `scroll-padding-top` matching the 76px nav.

### Assets (download into `assets/`)

Real photos recovered from the Wayback Machine (append the original URL to `https://web.archive.org/web/<timestamp>im_/`):

- `jeannette-cutout.png` — timestamp `20250327224851`, original `https://www.jeannetteechevarria.com/wp-content/themes/jechevarria_pending.com/images/banner-photo.png` (transparent cut-out of Jeannette on a stool)
- `jeannette-team.png` — timestamp `20230225201937`, original `https://www.jeannetteechevarria.com/wp-content/uploads/2022/10/Jeanetter-Echevarria.png`
- `william.jpg` — timestamp `20230225201937`, original `https://www.jeannetteechevarria.com/wp-content/uploads/2022/10/William-Echevarria.jpg`

Unsplash photos (`https://images.unsplash.com/photo-<id>?w=1600&q=80&fm=jpg`):

- `hero-aerial.jpg` — `1501509497947-782640bc1412` (aerial Miami Beach coastline)
- `skyline-dusk.jpg` — `1535498730771-e735b998cd64` (Miami skyline at dusk)
- `deco-night.jpg` — `1533106497176-45ae19e68ba2` (Ocean Drive Art Deco at night)
- `dc-monument.jpg` — `1617581629397-a72507c3de9e` (Washington Monument, cherry blossoms)
- `prop-hallandale.jpg` — `1600607687939-ce8a6c25118c` (modern luxury interior)
- `prop-stafford.jpg` — `1605276374104-dee2a0ed3cd6` (stone-front suburban home)
- `prop-somerset.jpg` — `1600585154340-be6161a56a0c` (modern home at dusk under tree)
- `prop-russie.jpg` — `1570129477492-45c003edd2be` (Cape Cod home with porch)
- `prop-twinbrook.jpg` — `1600047509807-ba8f99d2cdde` (contemporary townhome)
- `tampa-bay.jpg` — `1605723517503-3cadb5818a0c` (palm trees along a bay with skyline at dusk)

State outlines (public domain): download `https://upload.wikimedia.org/wikipedia/commons/1/1a/Blank_US_Map_%28states_only%29.svg` and copy the `d` attributes of `<path class="fl">` and `<path class="va">` into the two map SVGs.

### Verification

After building, load the site in a browser at desktop, tablet (768px), and mobile (375px) widths and visually verify: the hero name never clips, the About heading wraps without an orphan word, hero text stays readable over the bright water (scrim + text-shadow), the hamburger icon is visible over the hero (buttons don't inherit `color` — set it), the nav fits on one line with all 8 links (nowrap links, hide phone ≤1180px, hide brand text 901–1024px), the carousel auto-advances and responds to buttons/dots/swipe, counters animate once, and both form paths (valid → mailto note, empty → validation message) work. For the map: both states fill their panels large (auto-fit viewBox), pins are physically clickable (the invisible r=10 hit circle is required — the 4px core alone is too small), hovering pins/list items/states cross-highlights and shows the tooltip, and selecting a market opens the dialog where Buy shows listing cards (Stafford has 3) or the empty state, Sell shows the appointment pitch, and both CTAs prefill the contact form (correct Buying/Selling radio + market-specific message) and scroll to it. On mobile the maps stack above the list and the dialog fits the screen. Fix anything that falls short before calling it done.

---

*End of prompt.*
