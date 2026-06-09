# SectionScrollBar

> **Related files**
> - `SectionScrollBar.js` — the component itself
> - `ScrollReveal.js` — element-level reveal used inside sections (separate concern, keep it)
> - `SectionReveal.js` — **deleted**. Was a GSAP section wrapper, replaced by plain HTML elements with `data-section` attributes.


A fixed right-side scroll indicator that draws itself as the user scrolls. Each section gets its own segment on the bar, sized proportionally to that section's height on the page. The bar inverts its color automatically based on whether the current section has a dark or light background.

---

## How it works

### 1. Measuring sections

On mount (and on resize), the component queries every `[data-section="id"]` element and calculates each one's height as a fraction of the total document scroll height. These fractions are normalised to sum to 1 so they fill the track exactly.

```
segHeight[i] = el.offsetHeight / document.scrollHeight
normalised   = segHeight[i] / sum(all segHeights)
```

### 2. Tracking scroll progress

A `scroll` listener (throttled via `requestAnimationFrame`) computes two things on every frame:

- **`progress`** — a 0–1 value across the entire scrollable page: `scrollY / (scrollHeight - innerHeight)`
- **`active`** — the index of the section whose `offsetTop` is closest to the viewport midpoint (`scrollY + innerHeight / 2`)

### 3. Per-segment fill

Each segment has its own 0–1 fill computed from `progress`:

```
segStart = sum of proportions before this segment
segFill  = clamp((progress - segStart) / segProportion, 0, 1)
```

This means segment `i` starts filling only once the previous segments are complete, and finishes exactly when the next one begins. The fill height in px is `segFill * segHeightPx`.

### 4. Color inversion

Each segment has a theme (`dark` or `light`) defined in the `SECTION_THEME` map. This controls:

| Theme | Track ghost | Fill color | Title color (active) |
|-------|-------------|------------|----------------------|
| dark  | white 18%   | `#ffffff`  | `#ffffff`            |
| light | navy 15%    | `#0a1628`  | `#0a1628`            |

The active section's theme is read from `sections[active].id`. All color transitions are `0.4s ease`.

### 5. Title scaling

The label at the top of each segment scales up when active:

- Inactive: `font-size: 0.52rem`, `opacity: 0.5`, `scale(0.95)`
- Active: `font-size: 0.68rem`, `opacity: 1.0`, `scale(1)`

All transitions are CSS (`0.3s`), no JS involved.

### 6. Click navigation

Clicking any segment calls `scrollIntoView({ behavior: 'smooth' })` on the corresponding `[data-section]` element.

---

## Implementation on a new page

### Step 1 — Import the component

```js
import SectionScrollBar from '@/components/layout/SectionScrollBar';
```

### Step 2 — Define your sections array

```js
const SECTIONS = [
  { id: 'intro',    label: 'Intro' },
  { id: 'services', label: 'Services' },
  { id: 'team',     label: 'Équipe' },
  { id: 'contact',  label: 'Contact' },
];
```

Each entry needs:
- `id` — must match the `data-section` attribute on the DOM element
- `label` — short text shown on the scrollbar (keep it under ~12 chars)

### Step 3 — Add `data-section` to each section element

```jsx
<section data-section="intro">...</section>
<section data-section="services">...</section>
<div data-section="team">...</div>
<section data-section="contact">...</section>
```

Works on any HTML element — `section`, `div`, `article`, etc.

### Step 4 — Register the theme for each section

In `SectionScrollBar.js`, add your section IDs to the `SECTION_THEME` map at the top of the file:

```js
const SECTION_THEME = {
  // existing entries...
  intro:    'dark',   // white bar on dark background
  services: 'light',  // dark bar on white/light background
  team:     'light',
  contact:  'dark',
};
```

Use `'dark'` when the section background is dark (navy, black, deep color).  
Use `'light'` when the section background is white, grey, or any light color.

### Step 5 — Render the component

Place it anywhere inside the page — it is `position: fixed` so its location in the JSX tree doesn't affect layout:

```jsx
export default function MyPage() {
  return (
    <>
      <SectionScrollBar sections={SECTIONS} />

      <section data-section="intro">...</section>
      <section data-section="services">...</section>
      <div data-section="team">...</div>
      <section data-section="contact">...</section>
    </>
  );
}
```

---

## Configuration reference

| Constant / prop | Location | Default | Description |
|----------------|----------|---------|-------------|
| `GAP_PX` | top of file | `10` | Pixel gap between segments on the track |
| `SECTION_THEME` | top of file | see map | Maps section IDs to `'dark'` or `'light'` |
| `sections` | prop | required | Array of `{ id, label }` objects |
| Track height | CSS `.ssb` | `80vh` | Change in the `<style>` block |
| Position | CSS `.ssb` | `right: 5px` | Change to reposition the bar |
| Hidden below | CSS media query | `860px` | Bar is `display:none` on mobile |

---

## Notes

- The component is `'use client'` — it cannot be used in React Server Components directly. Wrap in a client boundary if needed.
- `data-section` IDs must be unique per page. Using the same ID twice will cause the first match to be used.
- The bar hides automatically on screens `≤ 860px`. Adjust the media query breakpoint in the `<style>` block if needed.
- If a section element is not found in the DOM (wrong ID), that segment falls back to an equal share of the track height.
