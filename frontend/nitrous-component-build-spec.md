# NITROUS COMPONENT — Build Specification v1.0

**Project:** Nitrous Component — UK electronics components e-commerce site **Prepared by:** Antigravity **Date:** July 2026 **Status:** Ready for build

---

## 1\. Brand Foundation

**Concept:** Performance-parts energy applied to electronics retail. The brand voice of an aftermarket tuning shop, the inventory discipline of a components distributor. Every visual decision should answer to one word: *pressure*.

**Audience:** Hobbyists, makers, repair technicians, small-batch hardware engineers (UK-first).

**Tone of voice:** Fast, confident, spec-driven. Short sentences. Numbers over adjectives. Example microcopy:

- Hero: "Components at full pressure."  
- CTA: "Boost your build"  
- Stock badge: "PRESSURISED" (in stock) / "VENTING" (low stock) / "DEPLETED" (out of stock)  
- Newsletter: "Get the purge list. New stock, price drops, no filler."

---

## 2\. Design Tokens

### 2.1 Color palette

| Token | Hex | Usage |
| :---- | :---- | :---- |
| `--carbon-900` | `#0B0E14` | Page background |
| `--carbon-800` | `#131824` | Card / section surfaces |
| `--carbon-700` | `#1D2536` | Elevated surfaces, input backgrounds, borders on hover |
| `--nitro-blue` | `#2FB7FF` | Primary accent — links, active states, glow effects, gauge needles |
| `--nitro-deep` | `#0E6FB8` | Pressed/hover states of blue, gradient stops |
| `--purge-volt` | `#D8F633` | Primary CTA fill, sale flashes, stock badges. Use sparingly — one purge per viewport. |
| `--white` | `#F2F5F9` | Primary text (never pure \#FFF — slightly cool white) |
| `--steel-400` | `#8A94A8` | Secondary text, labels, spec table keys |
| `--danger` | `#FF4D5E` | Errors, "DEPLETED" stock state |

**Rules:**

- Product photography sits on **light tiles** (`#F2F5F9` background, 12px radius) inside the dark UI. Components photograph badly on dark; never place raw product images on carbon.  
- `--purge-volt` is the loudest element on any page. Maximum one volt-filled element per viewport (usually the primary CTA). Everything else uses blue.  
- Glow effect (signature): `box-shadow: 0 0 24px rgba(47,183,255,0.35)` on hover for cards and primary buttons. Respect `prefers-reduced-motion` — glow appears without transition.

### 2.2 Typography

| Role | Font | Weights | Usage |
| :---- | :---- | :---- | :---- |
| Display | **Chakra Petch** | 600, 700 | H1–H3, buttons, badges, nav. Always uppercase for H1/H2 and badges, `letter-spacing: 0.04em`. |
| Body | **Inter** | 400, 500, 600 | Paragraphs, product descriptions, forms. |
| Data | **JetBrains Mono** | 400, 500 | Spec tables, part numbers, prices, SKUs, tolerances. Part numbers and prices are *always* mono — this is a brand rule, not a nicety. |

Google Fonts import:

\<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700\&family=Inter:wght@400;500;600\&family=JetBrains+Mono:wght@400;500\&display=swap" rel="stylesheet"\>

**Type scale (desktop / mobile):**

| Token | Size | Line height | Face |
| :---- | :---- | :---- | :---- |
| `--text-hero` | 64px / 40px | 1.05 | Chakra Petch 700 |
| `--text-h2` | 40px / 28px | 1.1 | Chakra Petch 700 |
| `--text-h3` | 24px / 20px | 1.2 | Chakra Petch 600 |
| `--text-body` | 16px | 1.6 | Inter 400 |
| `--text-small` | 14px | 1.5 | Inter 400 |
| `--text-label` | 12px | 1.3 | Chakra Petch 600, uppercase, 0.08em tracking |
| `--text-price` | 20px | 1.2 | JetBrains Mono 500 |

### 2.3 Spacing & layout

- Base unit: **4px**. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96\.  
- Max content width: **1280px**, gutter 24px (16px mobile).  
- Grid: 12-col desktop, 6-col tablet, 4-col mobile.  
- Breakpoints: `1280` / `1024` / `768` / `480`.  
- Section vertical padding: 96px desktop, 48px mobile.  
- Border radius: **12px** cards, **8px** inputs, **6px** buttons and badges. Never fully rounded (pill shapes read soft; this brand is angular).  
- Signature structural device: **the pressure rule** — a 2px horizontal divider that fades from `--nitro-blue` to transparent, used to open each major section instead of generic full-width hairlines.

### 2.4 Buttons

| Variant | Style |
| :---- | :---- |
| Primary | `--purge-volt` fill, `--carbon-900` text, Chakra Petch 600 uppercase, 6px radius, glow on hover (`0 0 24px rgba(216,246,51,0.4)`) |
| Secondary | Transparent, 1.5px `--nitro-blue` border, blue text; fills blue with carbon text on hover |
| Ghost | `--steel-400` text, underline on hover. Footer/tertiary links only |
| Destructive | `--danger` outline, fills on hover |

Sizing: 48px height desktop, 44px minimum touch target mobile, 16/24px horizontal padding.

### 2.5 Badges (stock states)

Chakra Petch 600, 12px uppercase, 6px radius, 4/10px padding:

- **PRESSURISED** — volt background, carbon text (in stock)  
- **VENTING** — blue outline, blue text (low stock, show remaining count in mono: `VENTING · 7 LEFT`)  
- **DEPLETED** — danger outline, danger text, product card at 60% opacity

---

## 3\. Site Map

/                       Home

/shop                   All products (filterable grid)

/shop/\<category\>        Category pages

/product/\<slug\>         Product detail

/about                  About

/contact                Contact

/faqs                   FAQs

/delivery-returns       Delivery & Returns

/terms                  Terms & Conditions

/privacy                Privacy Policy

/cart                   Cart

/checkout               Checkout

/account                My Account / Orders

**Launch categories:** Semiconductors · Passives · Connectors · Boards & Modules · Power · Tools & Consumables

---

## 4\. Component Inventory

Build these as reusable components before assembling pages:

1. **Header** — Sticky, carbon-900 with 1px carbon-700 bottom border. Logo left, nav center (Shop / About / Contact), right cluster: search icon, account, cart with count bubble (volt). Mobile: hamburger → full-screen carbon overlay menu, Chakra Petch nav items.  
2. **Announcement bar** — Above header, blue gradient (`--nitro-deep → --nitro-blue`), 36px, mono text: "FREE UK DELIVERY OVER £40 · DISPATCH BY 3PM".  
3. **Hero** — Full-width, carbon-900, subtle diagonal speed-line texture (CSS gradient, 3% opacity). H1 \+ subline \+ primary CTA \+ secondary CTA. Signature element: an **animated pressure gauge** (SVG, needle sweeps once on load, static thereafter; skipped under reduced-motion).  
4. **Trust bar** — 4 items with blue line icons: delivery / dispatch / secure payment / genuine parts. Opens with the pressure rule.  
5. **Category tile** — carbon-800 card, light product-image tile, Chakra Petch label, blue glow hover.  
6. **Product card** — Light image tile top, then: part number (mono, steel), name (Inter 500, white), price (mono, 20px), stock badge, quick-add button appearing on hover (always visible on mobile).  
7. **Spec table** — Two-column, keys in steel Chakra Petch labels, values in mono white. Zebra rows using carbon-800/900.  
8. **USP card** — Icon, H3, two lines of body. Used in "Why Nitrous" 3-up.  
9. **Newsletter block** — carbon-800 panel, single email input \+ volt button inline.  
10. **Footer** — 4 columns (Shop / Help / Company / Legal), payment method icons, registered company details block. carbon-900 with pressure rule on top.  
11. **Filter panel** — Category checkboxes, price range, stock toggle, attribute filters. Sidebar ≥1024px, slide-over drawer below.  
12. **Toast / notification** — carbon-700, blue left border, mono confirmation text ("ADDED TO CART · NE555P ×2").

---

## 5\. Page Specifications

### 5.1 Home

Order: Announcement bar → Header → Hero → Trust bar → Featured categories (6 tiles, 3×2) → Best sellers (4-up product card row \+ "View all" secondary button) → Why Nitrous (3 USP cards: Genuine stock / Same-day dispatch / Real datasheets) → Newsletter → Footer. One purge-volt element per viewport: hero CTA, then quick-add hovers, then newsletter button.

### 5.2 Shop / Category

Filter panel \+ product grid (4-col desktop, 2-col mobile). Sort dropdown (price, newest, popularity). Results count in mono ("142 COMPONENTS"). Pagination, not infinite scroll (better for SEO and datasheet-hunting users). Empty state: "No matches at this pressure. Loosen a filter." \+ reset button.

### 5.3 Product detail

Two-column ≥768px: gallery left (light tiles, thumbnails below), buy panel right: part number (mono) → H1 name → price (mono, large) → stock badge → quantity stepper \+ volt Add-to-Cart → delivery line ("Order by 3pm, ships today" in blue) → payment icons. Below: tabs — Description / **Specifications** (spec table; must support: package type, value/rating, tolerance, voltage, quantity per pack, manufacturer, datasheet PDF link) / Delivery / Reviews. Then 4-up related products.

### 5.4 About

Short-form: hero statement, brand story (2–3 paragraphs), sourcing/quality assurance section, CTA into shop. No team photos needed at launch.

### 5.5 Contact

Form (name, email, order number optional, message) \+ direct email \+ response-time promise ("Replies within 1 working day") \+ **registered company name and physical address**. Non-negotiable at launch: required for UK distance selling regs and referenced by the privacy policy. Do not ship without it.

### 5.6 Policy pages

Adapt the Component Warehouse HTML policy set: restyle to the token system above, swap trading name/address, update platform references. Shared layout: narrow 720px column, H2s with pressure rules, steel body text at 16/1.7.

### 5.7 Cart & Checkout

Cart: line items with light image tiles, mono prices, quantity steppers, order summary panel (carbon-800) with volt "Checkout" button. Checkout: single-column, minimal chrome (strip nav to logo only), trust icons near payment step. Keep the dark theme but raise input contrast — inputs on carbon-700 with white text and blue focus rings (2px, visible keyboard focus everywhere).

---

## 6\. Data Model (product attributes)

Define before importing a single product — filtering depends on it:

| Attribute | Type | Example |
| :---- | :---- | :---- |
| `part_number` | string, unique, indexed | `NE555P` |
| `category` | taxonomy | Semiconductors |
| `manufacturer` | taxonomy | Texas Instruments |
| `package_type` | taxonomy | DIP-8, SOT-23, 0805 |
| `value_rating` | string | 10kΩ, 100µF, 5V |
| `tolerance` | string | ±1% |
| `pack_qty` | integer | 10 |
| `stock_qty` | integer | drives badge states (VENTING threshold ≤ 10\) |
| `datasheet_url` | URL | PDF link |
| `price_gbp` | decimal | 0.42 |

---

## 7\. Technical & Quality Floor

- **Performance targets:** LCP \< 2.5s, CLS \< 0.1. Self-host fonts post-launch if Google Fonts becomes the bottleneck. Lazy-load below-fold images; product images in WebP with white background baked in.  
- **Accessibility:** WCAG AA contrast (steel-400 on carbon-900 passes for 14px+; verify anything smaller), visible focus rings, reduced-motion respected (gauge animation, glows, carousel).  
- **SEO:** Product schema markup (Product \+ Offer JSON-LD with price, availability, SKU), category pages indexable with unique intro copy, mono part numbers in H1s (people search by part number).  
- **Payments:** Card gateway \+ PayPal. If Paytriot: sandbox → live credential separation, 3DS2 enabled, webhook endpoint for order status (existing debugging playbook applies).  
- **Legal at launch:** Registered address on Contact \+ footer \+ Privacy Policy; cookie consent; VAT-inclusive pricing displayed; distance selling cancellation rights in T\&Cs.

---

## 8\. Build Order

1. Token system → CSS variables / global styles file  
2. Header, footer, announcement bar  
3. Home  
4. Product card \+ shop grid \+ filters  
5. Product detail template  
6. Cart / checkout  
7. Data model \+ first product import  
8. Policy pages (adapted from Component Warehouse set)  
9. Payment integration \+ end-to-end test orders  
10. About, Contact, FAQs  
11. SEO pass, performance pass, mobile QA, launch

---

*Spec ends. Any deviation from tokens in §2 should be deliberate and documented.*  
