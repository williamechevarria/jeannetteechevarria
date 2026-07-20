# jeannetteechevarria.com

Personal real estate site for **Jeannette Echevarria** — JME Elite at LPT Realty.
Based in Tampa, serving Tampa Bay, Central and South Florida, and Northern Virginia.

Static site: plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## Structure

| Path | What it holds |
|---|---|
| `index.html` | Every section of the single-page site |
| `css/styles.css` | Design system and all layout/animation |
| `js/main.js` | Nav, reveals, counters, carousel, market map, forms |
| `assets/` | Photography and team portraits |
| `vercel.json` | Caching, security headers, clean URLs |
| `PROMPT.md` | Prompt to regenerate this site from scratch |

## Turnkey slots — what to wire up before launch

Three things are intentionally left as drop-in points:

1. **IDX / MLS listings** — `<div id="idxSlot">` in the Search MLS section. Paste the
   embed from IDX Broker, iHomefinder, or Chime in place of the placeholder form.
   Until then, searches route into the contact form as a curated request.
2. **Social feed** — `<div id="socialSlot">` in the Follow Along section. Drop in a
   Behold, Elfsight, or LightWidget embed and delete the `.social-scroller` placeholder.
3. **Social profile links** — currently point at platform homepages. Search for
   `instagram.com`, `facebook.com`, `linkedin.com`, and `youtube.com` in `index.html`
   and swap in the real profile URLs.

The contact form hands off via `mailto:` to `jeannette@jmeelite.com`. To capture leads
server-side instead, point the form at Formspree, Basin, or a Vercel Function.

## Market map

The Areas section renders Florida and Virginia from public-domain state outlines
(Wikimedia Commons, *Blank US Map (states only)*). Markets are defined in the
`MARKETS` array in `js/main.js` — each entry positions its pin as a fraction of that
state's bounding box, so adding a market is one object.

Selecting a market opens a dialog that routes buyers to inventory (from the `LISTINGS`
map in `js/main.js`) and sellers to a listing-appointment request.

## Deployment

Hosted on Vercel, connected to this repository. Pushes to `main` deploy to production;
pull requests get preview URLs. No environment variables are required.
