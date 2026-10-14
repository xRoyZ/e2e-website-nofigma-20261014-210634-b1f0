# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Warm minimalist café identity — cream paper background, coffee-brown text and a terracotta accent, serif headings over a system sans body, calm and inviting like a well-set printed menu but structured as clearly as Stripe.

## Colors

- `--color-bg`: **#FBF6EF**
- `--color-surface`: **#FFFFFF**
- `--color-surface-alt`: **#F3EADD**
- `--color-fg`: **#2B2320**
- `--color-fg-muted`: **#7A6A5D**
- `--color-border`: **#E4D9CB**
- `--color-accent`: **#B4552A**
- `--color-accent-hover`: **#9A4620**
- `--color-accent-subtle`: **#F6E6DC**
- `--color-open`: **#2E7D52**
- `--color-open-subtle`: **#E3F1E8**
- `--color-closed`: **#B23A2E**
- `--color-closed-subtle`: **#F7E5E2**
- `--color-focus`: **#B4552A**

## Typography

- `font_family`: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `heading_family`: Georgia, 'Iowan Old Style', 'Times New Roman', serif
- `heading_weight`: 600
- `body_weight`: 400
- `size_scale`: 12px caption / 14px small / 16px body / 20px subheading / 28px section heading / 40px page title (mobile: 32px page title)
- `line_height`: 1.6 body, 1.25 headings

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 16px
- `--space-3`: 24px
- `--space-4`: 32px
- `--space-5`: 48px
- `--space-6`: 64px

## Border-Radii

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button (primary)

Used for the form submit ('Nachricht prüfen' / 'Absenden'). Padding 12px 24px, radius md (8px), bg=accent #B4552A, text=#FFFFFF, font-body 16px weight 600, min-height 44px. Hover: bg=accent-hover #9A4620, transition 150ms ease. Active: bg=#833A1B with transform translateY(1px). Disabled: bg=#E4D9CB, text=#7A6A5D, cursor not-allowed, opacity 1 (color already muted). Focus-visible: 2px solid focus #B4552A offset 2px.

### Button (secondary / map link)

Used for the outbound 'Karte öffnen' link. Rendered as an <a> styled as a button: padding 12px 24px, radius md, bg=surface #FFFFFF, 1px solid border #E4D9CB, text=accent #B4552A, weight 600, min-height 44px. Hover: bg=accent-subtle #F6E6DC, border-color=accent. Active: bg=#EFD9CB. Opens in a new tab (target=_blank rel='noopener noreferrer'). Focus-visible ring as primary.

### Link (inline, text)

Terracotta #B4552A, no underline at rest, underline on hover, focus-visible 2px accent ring. Used inside the footer and the privacy/imprint notices. Never relies on colour alone — hover/focus always adds the underline.

### Navigation link

Top anchor nav. Padding 8px 12px, radius sm, text=fg #2B2320 weight 500, min tap height 44px. Hover: bg=surface-alt #F3EADD. Active/current section: text=accent, bottom border 2px accent. Focus-visible: 2px accent ring. On ≤480px the nav wraps to a single compact row with 8px gaps and no horizontal overflow.

### Input / Textarea field

Label above field, 14px weight 600, margin-bottom 8px. Field: width 100%, padding 12px 16px, radius md, bg=surface #FFFFFF, 1px solid border #E4D9CB, text=fg 16px, min-height 44px. Placeholder not used as label. Focus: border-color=accent, 2px accent ring. Error state: border-color=closed #B23A2E, 1px solid. Disabled: bg=surface-alt, text=fg-muted. Textarea min-height 120px, resize vertical.

### Validation message

Appears below the field only after blur-with-change or submit (AC-09). 14px, colour closed #B23A2E, margin-top 4px, prefix a short inline warning glyph. aria-describedby links it to the field; field gets aria-invalid=true. Never shown for untouched fields. Success message styled as a badge with open-subtle bg and open text, radius md, padding 12px 16px.

### Status badge (open / closed)

Pill, radius pill, padding 8px 16px, weight 600, 16px. Open: bg=open-subtle #E3F1E8, text=open #2E7D52, a 8px dot in open colour before the label. Closed: bg=closed-subtle #F7E5E2, text=closed #B23A2E, 8px dot. Labels shown verbatim: 'jetzt geöffnet' and 'geschlossen'. Both states differ in colour AND in the label text, never colour alone. Sits next to the 'Öffnungszeiten' heading.

### Menu category group

Heading 20px, heading_family, weight 600, colour fg, with a 2px accent underline over ~40px width. Margin-bottom 16px. Items stacked with 12px gap, separated by a 1px border-bottom #E4D9CB. On ≥1024px categories flow in a 2-column grid with 32px gap.

### Menu item row

Name: 16px weight 600, colour fg, heading_family optional. Description: 14px, colour fg-muted, margin-top 4px. Price: right-aligned, 16px weight 600, colour accent, tabular-nums, format '8,50 €' (German, comma decimal, non-breaking space before €). Row uses flex with space-between; on ≤480px the price may drop below the name. Never truncate the description with ellipsis on one line.

### Opening-hours row (today highlighted)

One row per weekday, Monday→Sunday. Day label 16px, time range 16px tabular-nums, colour fg-muted. Today's row: bg=accent-subtle #F6E6DC, radius md, padding 8px 12px, text weight 600 colour fg, plus a left 3px accent bar and the marker '(heute)'. Times format 24h '07:30–18:00' with en-dash; closed days read 'geschlossen'.

### Section container

Max-width 1120px, centred, horizontal padding 16px (mobile) / 32px (desktop). Vertical padding 48px mobile, 80px desktop. Section heading 28px heading_family weight 600, margin-bottom 24px, with a thin accent divider. Section ids: speisekarte, oeffnungszeiten, anfahrt, kontakt.

### Card

Used for the contact form block and the approaching/directions block. bg=surface #FFFFFF, 1px solid border #E4D9CB, radius lg 16px, padding 24px, subtle shadow 0 1px 2px rgba(43,35,32,0.06). On the cream bg this lifts the form content without heavy elevation.

### Menu error state

Shown when data/menu.json fails to load (AC-04). Text-only, inserted via textContent: heading 20px 'Speisekarte derzeit nicht verfügbar' plus 16px body line suggesting a reload. bg=closed-subtle #F7E5E2, 1px solid closed border, radius md, padding 16px, text colour closed #B23A2E. Fills the same space the menu would occupy so the section never collapses to an empty area.

### Footer

bg=surface-alt #F3EADD, top border 1px #E4D9CB, padding 32px 16px. Content: café address, phone, example contact address, plus links to 'Impressum' and 'Datenschutz'. Text 14px, colour fg-muted, links colour accent. Stacked on mobile, single row of columns on ≥1024px.

### Skip link

Visually hidden until focused, then fixed top-left with bg=accent, text white, padding 12px 16px, radius md, min-height 44px, 2px accent ring. Target: main content.

## Layout Principles

- Container: max-width 1120px, centred; horizontal padding 16px on mobile, 32px from 1024px. Content never wider than the container.
- Breakpoints: 320–480px single column, full-width, no horizontal scroll; 481–1023px single column with a 720px content max-width; ≥1024px centred and multi-column — menu categories in a 2-column grid, opening hours beside the contact form.
- Vertical rhythm: 48px between sections on mobile, 80px on desktop; section heading to first element 24px; card-internal spacing uses the 8/16/24px steps.
- ONE format for every value the product shows — amounts: Euro in German convention, comma as decimal separator, non-breaking space before the sign, always two decimals ('8,50 €', '3,00 €'); times: 24-hour '07:30'; ranges: en-dash with no spaces '07:30–18:00'; weekday names: 'Montag' … 'Sonntag'; closed days literally 'geschlossen'. Never mix in English month or day names, never use 'AM/PM'.
- Every interactive element (nav links, form fields, submit button, map link) has a minimum height of 44px and a visible focus state: 2px solid #B4552A with 2px offset.
- Transitions: 150–200ms ease on hover/focus/active only; shortcut the lot inside a prefers-reduced-motion: reduce media query.
- Colour is never the sole carrier of meaning — open/closed also differs in text, error fields also carry a message plus aria-invalid, today's hours row carries an accent bar and the '(heute)' marker.
- Contrast: fg #2B2320 on bg #FBF6EF and surface #FFFFFF passes AA for body text; accent #B4552A is only used for large text, buttons and links, and link text is underlined on hover/focus so it never relies on colour alone.
