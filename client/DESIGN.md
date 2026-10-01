# DESIGN.md — Silent Architect Inventory Management System

> **Source:** Stitch Project ID `13853986607354882735`
> **App Name:** Silent Architect (Inventory v2.4)
> **Design Theme:** Minimalist B2B SaaS — Professional, data-dense, precision-focused

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Layout System](#4-spacing--layout-system)
5. [Border Radius & Shape](#5-border-radius--shape)
6. [Shadow & Elevation](#6-shadow--elevation)
7. [Iconography](#7-iconography)
8. [Component Library](#8-component-library)
9. [Page-by-Page Design Breakdown](#9-page-by-page-design-breakdown)
10. [Design Patterns & Principles](#10-design-patterns--principles)

---

## 1. Brand Identity

### App Name & Tagline

- **Primary Name:** `Silent Architect`
- **Version Label:** `Inventory v2.4`
- **Sub-brand / Tagline (Landing Page):** _"The Silent Architect | Premium Inventory Management"_
- **Login Sub-brand:** _"Inventory HQ — Professional Management System"_
- **Register Sub-brand:** _"Enterprise Inventory Control Systems"_
- **Footer Copyright:** `© 2024 Silent Architect Inventory. All Rights Reserved.`

### Brand Personality

- **Tone:** Enterprise-grade, authoritative, silent precision
- **Aesthetic:** Clean, high-contrast, minimalist with surgical information hierarchy
- **Target User:** Operations managers, inventory teams, multi-tenant enterprises, architecture/construction businesses

### Logo Treatment

- Text-based wordmark: `SILENT ARCHITECT` (appears in all-caps in footer/branding)
- Used as a text logo in sidebar header area with version label beneath it
- No separate image icon — the wordmark IS the logo

---

## 2. Color Palette

### 2.1 Base / Background Colors

| Token Name            | Hex Value | Usage                                                          |
| --------------------- | --------- | -------------------------------------------------------------- |
| `--bg-page`           | `#F8F9FA` | Overall page background on all internal (dashboard) screens    |
| `--bg-surface`        | `#FFFFFF` | Main content cards, tables, forms, modal containers            |
| `--bg-sidebar`        | `#F1F3F5` | Left navigation sidebar background                             |
| `--bg-sidebar-hover`  | `#E9ECEF` | Sidebar nav item hover state                                   |
| `--bg-header`         | `#FFFFFF` | Top navigation/header bar background                           |
| `--bg-input`          | `#FFFFFF` | Default input/field background                                 |
| `--bg-input-focus`    | `#F8F9FA` | Input field background on focus (subtle tint)                  |
| `--bg-dark-hero`      | `#111111` | Hero/dark section background on Landing Page                   |
| `--bg-dark-secondary` | `#1A1A1A` | Secondary dark panels (dashboard dark preview on landing page) |

### 2.2 Text Colors

| Token Name           | Hex Value | Usage                                                          |
| -------------------- | --------- | -------------------------------------------------------------- |
| `--text-primary`     | `#212529` | Primary body text, table content, form labels                  |
| `--text-secondary`   | `#6C757D` | Muted/supporting text (subtitles, meta info, timestamps)       |
| `--text-placeholder` | `#ADB5BD` | Input placeholder text                                         |
| `--text-disabled`    | `#CED4DA` | Disabled text and inactive states                              |
| `--text-inverse`     | `#FFFFFF` | Text on dark/black backgrounds (hero, black buttons)           |
| `--text-link`        | `#212529` | Navigation links (default, without accent; underline on hover) |
| `--text-link-muted`  | `#6C757D` | Footer links, secondary navigation                             |

### 2.3 Primary / Action Colors

| Token Name              | Hex Value | Usage                                                                     |
| ----------------------- | --------- | ------------------------------------------------------------------------- |
| `--color-primary`       | `#0d5b96` | Primary CTA buttons, active sidebar item indicator, key headings          |
| `--color-primary-hover` | `#1A1A1A` | Primary button hover state                                                |
| `--color-accent`        | `#007BFF` | Chart fills (bar charts), ADMIN role badge background, data vizualization |
| `--color-accent-light`  | `#E7F1FF` | Badge backgrounds (ADMIN pill), chart area fills (low opacity)            |

### 2.4 Semantic / Status Colors

| Token Name              | Hex Value | Usage                                                      |
| ----------------------- | --------- | ---------------------------------------------------------- |
| `--color-success`       | `#28A745` | "IN STOCK" badge, active status dot, success states        |
| `--color-success-light` | `#D4EDDA` | "IN STOCK" badge background                                |
| `--color-danger`        | `#DC3545` | "OUT OF STOCK" badge, critical alerts, stockout warnings   |
| `--color-danger-light`  | `#F8D7DA` | "OUT OF STOCK" badge background, low stock card tint       |
| `--color-warning`       | `#FFC107` | "LOW STOCK" badge, pending/reorder-pending indicators      |
| `--color-warning-light` | `#FFF3CD` | "LOW STOCK" badge background                               |
| `--color-warning-dark`  | `#856404` | "LOW STOCK" badge text color (dark on light background)    |
| `--color-info`          | `#17A2B8` | Informational indicators, "Architect's Tip" callout accent |

### 2.5 Border Colors

| Token Name         | Hex Value | Usage                                                      |
| ------------------ | --------- | ---------------------------------------------------------- |
| `--border-default` | `#DEE2E6` | Default borders on cards, inputs, tables, dividers         |
| `--border-subtle`  | `#E9ECEF` | Subtle separators between list items                       |
| `--border-strong`  | `#CED4DA` | Input borders on active/focused state                      |
| `--border-black`   | `#0d5b96` | Active sidebar indicator (left bar), strong accent borders |

### 2.6 Landing Page Specific

| Token Name              | Hex Value                                        | Usage                                    |
| ----------------------- | ------------------------------------------------ | ---------------------------------------- |
| `--landing-hero-bg`     | `#0A0A0A`                                        | Hero section full-bleed dark background  |
| `--landing-hero-text`   | `#FFFFFF`                                        | Hero headline and CTA text               |
| `--landing-subtle-text` | `#9CA3AF`                                        | Hero section supporting text             |
| `--landing-card-bg`     | `#1F1F1F`                                        | Feature cards on dark hero section       |
| `--landing-card-border` | `#2D2D2D`                                        | Border on dark feature cards             |
| `--landing-gradient`    | `linear-gradient(135deg, #000 0%, #1A1A1A 100%)` | Gradient used on pricing header sections |

---

## 3. Typography

### 3.1 Font Family

| Role          | Font Family                    | Fallback Stack                                                      |
| ------------- | ------------------------------ | ------------------------------------------------------------------- |
| **Primary**   | `Inter`                        | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| **Monospace** | `'Roboto Mono'` or system mono | `'Courier New', Courier, monospace`                                 |

> **Recommendation:** Import `Inter` from Google Fonts with weights 300, 400, 500, 600, 700.
>
> ```html
> <link
>   href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
>   rel="stylesheet"
> />
> ```

### 3.2 Type Scale

| Token / Role           | Font Size | Line Height | Font Weight | Letter Spacing | Usage                                             |
| ---------------------- | --------- | ----------- | ----------- | -------------- | ------------------------------------------------- |
| `--text-hero-xl`       | `56px`    | `1.1`       | `700`       | `-0.02em`      | Landing page main hero headline                   |
| `--text-hero-lg`       | `40px`    | `1.15`      | `700`       | `-0.015em`     | Section headings on landing page                  |
| `--text-hero-md`       | `32px`    | `1.2`       | `600`       | `-0.01em`      | Sub-section titles (pricing, features)            |
| `--text-page-title`    | `24px`    | `1.3`       | `600`       | `-0.005em`     | Dashboard/internal page titles (e.g., "Products") |
| `--text-section-title` | `18px`    | `1.4`       | `600`       | `0`            | Card headings, section labels                     |
| `--text-body-lg`       | `16px`    | `1.6`       | `400`       | `0`            | Primary body text, table cells                    |
| `--text-body-md`       | `14px`    | `1.5`       | `400`       | `0`            | Secondary body, form labels, nav items            |
| `--text-body-sm`       | `13px`    | `1.5`       | `400`       | `0`            | Metadata, timestamps, breadcrumbs                 |
| `--text-caption`       | `12px`    | `1.4`       | `400`       | `0.01em`       | Helper text, captions, version labels             |
| `--text-label`         | `11px`    | `1.4`       | `500`       | `0.05em`       | Table column headers (all-caps style)             |
| `--text-badge`         | `11px`    | `1`         | `600`       | `0.04em`       | Status badges (IN STOCK, LOW STOCK, ADMIN, STAFF) |

### 3.3 Special Text Treatments

- **Sidebar logo:** `Silent Architect` — bold, ~16px, dark. Version label `Inventory v2.4` below, ~12px, muted gray.
- **Table headers:** Uppercase with letter-spacing (~0.05em), font-weight 500–600, 11–12px, color `--text-secondary`.
- **Status badges:** All uppercase, `font-size: 11px`, bold, tight letter spacing, pill shape.
- **Hero tagline (Landing):** Large and bold (56px+), with tight negative letter-spacing for premium feel.
- **Pricing amounts:** Large figure display, 24–32px, font-weight 700.

---

## 4. Spacing & Layout System

### 4.1 Base Spacing Scale

Uses a `4px` base unit:

| Token        | Value   | Usage                                       |
| ------------ | ------- | ------------------------------------------- |
| `--space-1`  | `4px`   | Micro gaps, icon padding                    |
| `--space-2`  | `8px`   | Tight spacing, compact list gaps            |
| `--space-3`  | `12px`  | Medium-small gaps, badge padding            |
| `--space-4`  | `16px`  | Default component padding                   |
| `--space-5`  | `20px`  | Card inner padding (compact)                |
| `--space-6`  | `24px`  | Card inner padding (standard)               |
| `--space-8`  | `32px`  | Main content area horizontal padding        |
| `--space-10` | `40px`  | Section vertical spacing                    |
| `--space-12` | `48px`  | Large section gaps                          |
| `--space-16` | `64px`  | Hero section spacing, landing page sections |
| `--space-24` | `96px`  | Feature sections on landing page            |
| `--space-32` | `128px` | Major landing page section separation       |

### 4.2 Layout Structure — Internal Pages (Dashboard, Products, etc.)

```
┌──────────────────────────────────────────────────────────────────┐
│  SIDEBAR (260px fixed)  │  MAIN CONTENT AREA (flex: 1)           │
│  ─────────────────────  │  ─────────────────────────────────────  │
│  Logo / Version         │  TOP HEADER BAR (48–60px height)        │
│  ─────────────────────  │    [Search]    [Notif]  [Avatar]        │
│  Nav Item (Dashboard)   │  ─────────────────────────────────────  │
│  Nav Item (Products)    │  PAGE CONTENT (padding: 32px)          │
│  Nav Item (Categories)  │    Page Title + Action Button           │
│  Nav Item (Users)       │    ─────────────────────               │
│  Nav Item (Subscription)│    STAT CARDS ROW (4 columns)          │
│  Nav Item (Settings)    │    ─────────────────────               │
│  ─────────────────────  │    DATA TABLE / CHARTS / FORMS         │
│  User Info (bottom)     │                                        │
└──────────────────────────────────────────────────────────────────┘
```

- **Sidebar width:** `260px` (fixed)
- **Main content padding:** `32px` horizontal, `24px` vertical
- **Top header height:** `~56px`
- **Sidebar nav item height:** `~44px`
- **Content max-width:** No explicit max-width; fills remaining viewport

### 4.3 Layout Structure — Auth Pages (Login, Register)

```
┌──────────────────────────────────────────────────────────────────┐
│  FULL-PAGE BACKGROUND (#F8F9FA)                                   │
│                                                                    │
│     ┌─────────────────────────────────┐                           │
│     │  BRANDING (Logo + Tagline)      │   (centered, top)        │
│     │  FORM CARD                      │   max-width: 440–480px   │
│     │    (white, rounded, shadowed)   │                           │
│     │    Form fields                  │                           │
│     │    CTA Button                   │                           │
│     └─────────────────────────────────┘                           │
│                                                                    │
│  Footer: Privacy | Support | Version                              │
└──────────────────────────────────────────────────────────────────┘
```

- **Form card max-width:** `440px–480px`
- **Form card padding:** `40px 48px`
- **Branding above card** with logo and descriptive tagline

### 4.4 Layout Structure — Landing Page

- Full-width sections, centered content with `max-width: 1200px` container
- **Hero Section:** 100vh or near, dark background, centered text + CTA
- **Features Grid:** 2–3 column CSS grid
- **Pricing Cards:** 3-column flex row
- **"How It Works" / Steps:** 4-step horizontal flow with numbered steps
- **CTA Section:** Full-width dark

---

## 5. Border Radius & Shape

| Token             | Value    | Usage                                                       |
| ----------------- | -------- | ----------------------------------------------------------- |
| `--radius-sm`     | `4px`    | Table row, small tags, list items                           |
| `--radius-md`     | `8px`    | Cards, input fields, buttons, badges (standard)             |
| `--radius-lg`     | `12px`   | Larger modals, pricing cards, form containers               |
| `--radius-xl`     | `16px`   | Auth page cards (login/register form containers)            |
| `--radius-full`   | `9999px` | Status badges (pill shape), avatar circles, toggle switches |
| `--radius-circle` | `50%`    | User avatar images                                          |

> **Rule:** The design uses **8px as the dominant border radius** for most interactive elements (buttons, inputs, cards). Badges use full-pill radius. Large modals/forms use 12–16px.

---

## 6. Shadow & Elevation

| Token           | CSS Value                                                             | Usage                                               |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| `--shadow-xs`   | `0 1px 2px rgba(0,0,0,0.05)`                                          | Subtle, flat elements, input fields                 |
| `--shadow-sm`   | `0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`              | Sidebar item active, small cards                    |
| `--shadow-md`   | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`     | Standard card elevation, stat cards, category cards |
| `--shadow-lg`   | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`   | Auth form cards, modals, dropdowns                  |
| `--shadow-xl`   | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` | Featured pricing card (Pro tier), prominent CTAs    |
| `--shadow-none` | `none`                                                                | Flat tables, list views                             |

> **Elevation Rule:** Auth card pages use `--shadow-lg`. Dashboard stat cards and content cards use `--shadow-md`. Tables and flat data views use `--shadow-none` or `--shadow-xs`.

---

## 7. Iconography

### 7.1 Icon Library

- **Source:** Google Material Symbols / Material Icons (Rounded style preferred)
- **Delivery:** Google Fonts CDN (`material-symbols-rounded`) or Material Icons font

### 7.2 Icon Set Used (by screen)

#### Sidebar Navigation Icons

| Icon Name    | Material Icon Code | Used For              |
| ------------ | ------------------ | --------------------- |
| Dashboard    | `dashboard`        | Dashboard nav item    |
| Products     | `inventory_2`      | Products nav item     |
| Categories   | `category`         | Categories nav item   |
| Users        | `group`            | Users nav item        |
| Subscription | `payments`         | Subscription nav item |
| Settings     | `settings`         | Settings nav item     |
| Analytics    | `monitoring`       | Analytics (admin)     |
| Reports      | `description`      | Reports nav item      |
| Support      | `help_outline`     | Support nav item      |
| Sign Out     | `logout`           | Sign Out nav item     |

#### Other Icons

| Icon Name    | Material Icon Code | Used For                               |
| ------------ | ------------------ | -------------------------------------- |
| Check circle | `check_circle`     | Feature checklist items (landing page) |
| Done         | `done`             | Pricing plan features list             |
| Receipt      | `receipt_long`     | Recent transactions section header     |

### 7.3 Icon Sizing

| Context            | Size      |
| ------------------ | --------- |
| Sidebar nav icons  | `20px`    |
| Inline body icons  | `16px`    |
| CTA / header icons | `24px`    |
| Large decorative   | `32–48px` |

### 7.4 Icon Color

- **Sidebar inactive:** `--text-secondary` (`#6C757D`)
- **Sidebar active:** `--color-primary` (`#0d5b96`)
- **Inline / semantic:** Matches the context color (success, danger, warning)

---

## 8. Component Library

### 8.1 Buttons

#### Primary Button (Black/Dark)

```
Background:  #0d5b96
Text:        #FFFFFF
Border:      none
Border Radius: 8px
Padding:     10px 20px (body) / 12px 24px (hero CTA)
Font:        14px, font-weight 600
Hover:       background: #1A1A1A, box-shadow: 0 4px 12px rgba(0,0,0,0.2)
Active:      background: #333333
Transition:  all 150ms ease
```

#### Secondary Button (Outlined)

```
Background:  transparent
Text:        #212529
Border:      1px solid #DEE2E6
Border Radius: 8px
Padding:     10px 20px
Font:        14px, font-weight 500
Hover:       background: #F8F9FA, border-color: #ADB5BD
```

#### Danger Button

```
Background:  #DC3545
Text:        #FFFFFF
Border:      none
Border Radius: 8px
Padding:     8px 16px
Font:        13px, font-weight 600
```

#### Ghost/Link Button

```
Background:  transparent
Text:        #6C757D
Border:      none
Hover:       Text: #212529, underline
```

### 8.2 Input Fields

```
Height:      44px
Background:  #FFFFFF
Border:      1px solid #DEE2E6
Border Radius: 8px
Padding:     10px 14px
Font-size:   14px
Color:       #212529
Placeholder: #ADB5BD

Focus:
  Border:    1px solid #0d5b96
  Box-Shadow: 0 0 0 3px rgba(0,0,0,0.08)
  Outline:   none

Error State:
  Border:    1px solid #DC3545
  Box-Shadow: 0 0 0 3px rgba(220,53,69,0.15)

With left icon:
  Padding-left: 40px
  Icon positioned at left: 12px, center vertically
```

#### Select Dropdown

- Same styling as text input
- Custom chevron icon (`▾`) replacing native arrow
- Custom dropdown menu: white background, `border-radius: 8px`, `box-shadow: --shadow-lg`

#### Textarea

- Same border/radius as inputs
- `min-height: 100px`, `resize: vertical`

### 8.3 Cards

#### Standard Content Card

```
Background:    #FFFFFF
Border:        1px solid #DEE2E6
Border Radius: 8px
Padding:       24px
Box-Shadow:    --shadow-md
```

#### Stat Card (Dashboard KPI)

```
Background:    #FFFFFF
Border:        1px solid #DEE2E6
Border Radius: 8px
Padding:       20px 24px
Box-Shadow:    --shadow-md

Contents:
  - Label text: 12px, uppercase, font-weight 500, #6C757D
  - Value: 24–28px, font-weight 700, #212529
  - Change indicator: colored (success/danger) with arrow icon
  - Bottom border-left accent (optional): 3px solid black/status color
```

#### Pricing Card

```
Background:    #FFFFFF
Border:        1px solid #DEE2E6
Border Radius: 12px
Padding:       32px

Featured/Pro tier:
  Box-Shadow:  --shadow-xl
  Border:      2px solid #0d5b96
  Transform:   scale(1.02) or elevated position
  Badge:       "Most Popular" pill on top corner
```

### 8.4 Status Badges

All badges use pill shape (`border-radius: 9999px`) with 4px vertical / 10px horizontal padding.

| Variant | Text Color | Background | Border              | Text                    |
| ------- | ---------- | ---------- | ------------------- | ----------------------- |
| Success | `#155724`  | `#D4EDDA`  | `1px solid #C3E6CB` | IN STOCK / Active       |
| Danger  | `#721C24`  | `#F8D7DA`  | `1px solid #F5C6CB` | OUT OF STOCK / Critical |
| Warning | `#856404`  | `#FFF3CD`  | `1px solid #FFEEBA` | LOW STOCK / Pending     |
| Primary | `#FFFFFF`  | `#0d5b96`  | `none`              | ADMIN                   |
| Info    | `#004085`  | `#E7F1FF`  | `1px solid #B8DAFF` | STAFF / Info            |

### 8.5 Data Table

```
Container:
  Background:    #FFFFFF
  Border:        1px solid #DEE2E6
  Border Radius: 8px
  Overflow:      hidden

Table Header Row:
  Background:    #F8F9FA
  Border-Bottom: 2px solid #DEE2E6
  Font:          11px, uppercase, font-weight 600, letter-spacing 0.05em, color #6C757D
  Padding:       12px 16px

Table Data Row:
  Background:    #FFFFFF (alternating: #FAFAFA on even rows optional)
  Border-Bottom: 1px solid #F1F3F5 (subtle separators)
  Font:          14px, font-weight 400, color #212529
  Padding:       14px 16px
  Hover:         Background: #F8F9FA (light), transition 100ms

Table Columns:
  - Thumbnail/Image: 40x40px, border-radius: 6px
  - Text / SKU: truncate with ellipsis if too long
  - Badge: right-aligned or inline
  - Actions (Edit/Delete): far right, revealed on hover via icon buttons
```

### 8.6 Sidebar Navigation

```
Sidebar:
  Width:         260px
  Background:    #F1F3F5
  Border-Right:  1px solid #DEE2E6
  Padding:       16px 12px

Sidebar Logo Area:
  Padding:       16px
  Border-Bottom: 1px solid #DEE2E6

Nav Item (Default):
  Height:        44px
  Padding:       0 12px
  Display:       flex, align-items: center, gap: 12px
  Border-Radius: 6px
  Color:         #6C757D
  Font-size:     14px, font-weight 500
  Hover:         Background: #E9ECEF, color: #212529

Nav Item (Active):
  Background:    #E9ECEF
  Color:         #0d5b96
  Font-weight:   600
  Border-Left:   3px solid #0d5b96 (active indicator)
  Padding-Left:  9px (compensate for border)

Sidebar Bottom (User Info):
  Position:      absolute, bottom: 0
  Padding:       16px
  Border-Top:    1px solid #DEE2E6
  User Avatar:   32px circle
  User Name:     14px, font-weight 600
  User Role:     12px, muted
```

### 8.7 Top Header Bar

```
Height:        56px
Background:    #FFFFFF
Border-Bottom: 1px solid #DEE2E6
Padding:       0 32px
Display:       flex, justify-content: space-between, align-items: center

Search Input:
  Width:       280–320px
  Background:  #F8F9FA
  Border:      1px solid #DEE2E6
  Border-Radius: 6px
  Padding:     8px 12px 8px 36px (left icon offset)
  Placeholder: "Search..."

Right Section:
  - Bell icon (notifications): 20px, gray, badge dot for unread
  - User avatar: 32px circle, border: 2px solid #DEE2E6
```

### 8.8 Alert / Info Callout Box

Used in Dashboard for "Architect's Tip":

```
Background:    #E7F1FF (light blue)
Border:        1px solid #B8DAFF
Border-Left:   4px solid #007BFF
Border-Radius: 8px
Padding:       16px
Font-size:     14px, color #212529
Icon:          info / lightbulb, 20px, #007BFF
```

### 8.9 Form Sections (Add Product)

Used to group form fields into logical sections:

```
Section Header:
  Font:        18px, font-weight 600, #212529
  Border-Bottom: 1px solid #DEE2E6
  Padding-Bottom: 12px
  Margin-Bottom: 24px

Form Grid:
  Display: grid
  grid-template-columns: 1fr 1fr (2 columns for side-by-side fields)
  Gap: 16px 24px
```

### 8.10 File / Image Upload Zone

```
Background:    #F8F9FA
Border:        2px dashed #CED4DA
Border-Radius: 8px
Padding:       40px
Text-Align:    center
Color:         #6C757D

Hover State:
  Border-Color: #0d5b96
  Background:   #F1F3F5

Icon:          upload / image, 32px, #ADB5BD
Caption:       "Upload Image — Recommended size 1200×1200px"
```

### 8.11 Subscription Plan Cards

Used on both the Register and Subscription pages for plan selection:

```
Card Layout:  3 columns (Basic, Pro, Business)
Card Width:   ~300px each

Basic:
  Border:   1px solid #DEE2E6
  Background: #FFFFFF

Pro (Featured):
  Border:   2px solid #0d5b96
  Box-Shadow: --shadow-xl
  Badge:    "Current" or "Most Popular" pill

Business:
  Border:   1px solid #DEE2E6
  Background: #FFFFFF

Plan Card Contents:
  - Plan name (18px, bold)
  - Plan description (14px, muted)
  - Price (28px, bold, "/mo")
  - Feature list (with done ✓ icons)
  - CTA button
```

### 8.12 Progress / Usage Bar

Used in Subscription page for plan capacity (e.g., "45/50 products used"):

```
Track:
  Height:      8px
  Background:  #E9ECEF
  Border-Radius: 9999px

Fill:
  Background:  #0d5b96 (or gradient to warning/danger if near limit)
  Border-Radius: 9999px

Label:
  Font-size:   14px
  Color:       #212529
  Format:      "45 / 50 products used"
```

### 8.13 Transaction History Row

```
Layout:       flex, space-between
Code:         Font-weight 600, font-family: monospace, 14px
Date + Status: Font-size 13px, color #6C757D
Amount:       Font-weight 600, right-aligned
Status pill:  "Paid" — success badge style
```

### 8.14 User Avatar System

```
Avatar Circle:
  Width / Height:  40px (table) / 32px (sidebar) / 48px (profile)
  Border-Radius:   50%
  Object-fit:      cover
  Border:          2px solid #DEE2E6

Status Indicator Dot:
  Width / Height:  10px
  Border-Radius:   50%
  Position:        absolute, bottom-right of avatar
  Active:          #28A745 (green dot)
  Inactive:        #6C757D (gray dot)
  Border:          2px solid #FFFFFF
```

### 8.15 Role Badges (Users Table)

```
ADMIN:
  Background: #0d5b96
  Color:      #FFFFFF
  Border:     none

STAFF:
  Background: #E7F1FF
  Color:      #004085
  Border:     1px solid #B8DAFF
```

---

## 9. Page-by-Page Design Breakdown

### 9.1 SaaS Landing Page

**Screen Dimensions:** 2560×10542px (full tall, desktop)  
**Theme:** Dark hero + light body alternating sections

#### Sections (Top to Bottom)

| #   | Section Name           | Background | Description                                                            |
| --- | ---------------------- | ---------- | ---------------------------------------------------------------------- |
| 1   | **Navigation Bar**     | `#0A0A0A`  | Sticky top bar — logo left, nav links centered, CTA right              |
| 2   | **Hero Section**       | `#0A0A0A`  | Centered headline (56px+), subtitle, dual CTAs, app preview            |
| 3   | **Features Grid**      | `#FFFFFF`  | 3-column grid, icon + title + description per feature card             |
| 4   | **How It Works**       | `#F8F9FA`  | 4-step numbered flow (Register → Add → Track → Monitor)                |
| 5   | **Benefits Checklist** | `#FFFFFF`  | Check-circle icon list with short summaries                            |
| 6   | **Built For Section**  | `#F8F9FA`  | 4-column audience cards (Small Biz, Retail, E-commerce, Multi-channel) |
| 7   | **Pricing Section**    | `#FFFFFF`  | 3-tier pricing (Basic / Pro / Business), Pro highlighted black         |
| 8   | **Final CTA Section**  | `#0A0A0A`  | Dark background, centered CTA: "Start Managing Today"                  |
| 9   | **Footer**             | `#111111`  | 3-column links — Features, Pricing, Contact + copyright                |

#### Nav Bar Details

- Logo: left, white text on dark background
- Links: `Features`, `Pricing`, `About` — white, 14px, center area
- CTA Button: white fill, black text, 8px radius, right side

#### Hero Details

- Headline: white, bold, 56–64px, negative letter-spacing
- Subtitle: ~16px, `#9CA3AF` (light gray muted)
- CTAs: Primary = white outlined pill, Secondary = text-only `→ See our plans`
- App Preview: dark card showing dashboard UI mockup (built-in design screenshot)

#### Pricing Card Layout

- 3 columns, vertically centered alignment
- Pro card: slightly elevated, black border, "Most Popular" or "Current" banner
- Price: large bold, `/month` in smaller muted text
- Feature list: `done` icon (Material Icons), list of 3–6 items

---

### 9.2 Register Page

**Screen Dimensions:** 2560×2048px  
**Theme:** Split or centered auth form, light gray background

#### Layout

- Centered card, light gray page background `#F8F9FA`
- Top branding: `Silent Architect` + `Enterprise Inventory Control Systems`
- Card: white, `border-radius: 16px`, `box-shadow: --shadow-lg`

#### Form Fields (in order)

1. Company Name (text input)
2. Email Address (email input)
3. Password (password input with eye icon)
4. Confirm Password
5. Plan Selector — 3 cards (Basic / Pro / Business) with select state
6. "Create Account" primary black button (full width)
7. "Already have an account? Log in" link below

#### Plan Selector Cards (Register Step)

- 3 mini cards in a row
- Selected state: black border + black dot indicator
- Shows plan name, short tagline, price

---

### 9.3 Login Page

**Screen Dimensions:** 2560×2048px  
**Theme:** Centered auth form, light gray background

#### Layout

- Same background + card style as Register
- Branding: `Silent Architect` + `Inventory HQ — Professional Management System`
- Subtitle: "Please enter your credentials to manage inventory."

#### Form Fields

1. Email Address — with `email` icon on left
2. Password / Security Key — with `lock` or `key` icon on left + "Forgot?" link right
3. "Access System" / "Sign In" — full-width black button
4. "New organization? Register Account" — link below

#### Footer (small, below card)

- `© 2024 Silent Architect v2.4.0` · Privacy · Support

---

### 9.4 Dashboard (Updated)

**Screen Dimensions:** 2560×2374px  
**Layout:** Sidebar + Main Content

#### Main Content Sections (top to bottom)

**Page Header:**

- Title: `Inventory Overview` (24px, bold)
- Subtitle: `Real-time status of your global architecture warehouse.`
- No action button on dashboard

**KPI Stat Cards Row (4 columns):**
| Card Label | Sample Value | Change Indicator |
|-------------------|-------------|-----------------|
| Total Products | — | Upward green |
| Total Stock Value | — | Upward green |
| Low Stock Items | — | Downward red |
| Recent Movement | 342 | Neutral |

**Inventory Trend Chart:**

- Heading: `Inventory Trend`
- Subtitle: `Stock levels and fulfillment rate over the last 6 months`
- Bar chart with blue fills (`#007BFF`), labeled months

**Inventory Health Feed:**

- Heading: `Inventory Health`
- Timeline list of events:
  - ✅ Bulk Arrival: Section A12 — `2 mins ago • +450 Units`
  - ⏳ Reorder Pending: SKU-902 — `45 mins ago • Waiting Approval`
  - ⚠️ Stockout Warning: Batch 04 — `2 hours ago • Action Required`
- "Architect's Tip" callout box — blue left border, optimization suggestion

**Low Stock Alerts Table:**

- Columns: Product Name | Category | Stock Level | Status Badge | Action
- Sample rows: Brutalist Column, Carrara Marble Slabs, Acoustic Foam Panels

---

### 9.5 Add Product (Updated)

**Screen Dimensions:** 2560×2858px  
**Layout:** Sidebar + Form Content (tall page, scrollable)

#### Page Header

- Title: `Add New Product`
- Subtitle: `Create a new entry in your architectural furniture catalog.`
- Breadcrumb: `Products › Add New`
- Action: `Cancel` (secondary) + `Save Product` (primary black)

#### Form Sections

**Section 1: Basic Information**
Fields: Product Name, SKU, Category (dropdown), Description (textarea)

**Section 2: Inventory & Pricing**
Fields: Stock Quantity, Reorder Threshold, Unit Price, Cost Price, Unit (dropdown)

**Section 3: Visual Assets**

- Drag-and-drop image upload zone
- Recommended size: 1200×1200px
- Dashed border, centered icon + text, upload button

---

### 9.6 Categories (Updated)

**Screen Dimensions:** 2560×2048px  
**Layout:** Sidebar + List/Table Content

#### Page Header

- Title: `Categories`
- Subtitle: `Manage product classification`
- Action: `+ Add Category` (primary black button)

#### Category List

Each category shown as a card or list row with:

- Icon (Material icon representing category type, e.g. bolt for Electronics)
- Category Name (bold)
- Product count (muted, e.g. "24 products")
- Sub-category indicator
- Edit / Delete action icons (right side)

**Example Categories:**

- Electronics (chip icon)
- HVAC (air icon)
- Lab Equipment (science icon)
- Structural Materials
- Surfacing / Flooring
- Acoustics

---

### 9.7 Subscription (Updated)

**Screen Dimensions:** 2592×2418px  
**Layout:** Sidebar + Billing Hub Content

#### Sidebar Identity

- Company: `Arch-Struct Inc.`
- Tier: `Premium Partner` (badge below name)

#### Page Header

- Title: `Subscription & Billing`
- Subtitle: `View and manage your current subscription plan and explore upgrade options.`

#### Current Plan Banner

```
┌──────────────────────────────────────────────────────┐
│ Pro Plan                        ○ Active             │
│ Next billing date: November 12, 2024                 │
│ Expiry Date: Oct 12, 2025                            │
│ [Manage Plan]   [Cancel Subscription]               │
└──────────────────────────────────────────────────────┘
```

**Usage Progress Bar:**

- "X / 50 products used" with progress bar
- Near-full bar turns warning/danger color

#### Plan Upgrade Options (3 cards)

- **Basic** — "For solo architects and hobbyists"
- **Pro** (current) — "Ideal for small architectural firms" (highlighted)
- **Business** — "For large-scale enterprise workflows"

#### Recent Transactions Table

- Header: `receipt_long` icon + "Recent Transactions"
- Columns: Transaction Code | Date | Status Badge
- Rows: `PRO_PLAN_OCT_24 · Oct 12, 2024 · Paid`, `PRO_PLAN_SEP_24 · Sep 12, 2024 · Paid`
- Transaction code: monospace font
- Pagination at bottom

---

### 9.8 Products (Updated)

**Screen Dimensions:** 2560×2174px  
**Layout:** Sidebar + Products Table + Summary Footer

#### Page Header

- Title: `Products`
- Subtitle: `Manage your architectural hardware and materials inventory.`
- Left: Showing count `Showing 1–12 of 482 products`
- Right: `+ Add Product` (primary black) + Filter / Search inputs

#### Summary Cards (above table)

3 mini stat cards in a row:
| Label | Value |
|--------------------|-------------|
| Inventory Value | $124,500.00 |
| Low Stock Alerts | 14 |
| Recent Movement | 342 |

#### Products Table

| Column       | Content                                             |
| ------------ | --------------------------------------------------- |
| Thumbnail    | 40x40px image, 6px radius                           |
| Product Name | Bold, with subtitle (material/specs)                |
| SKU          | Monospace code                                      |
| Category     | Text badge or muted text                            |
| Stock        | Numeric value                                       |
| Price        | Bold, `$` prefix                                    |
| Status       | Colored badge (IN STOCK / LOW STOCK / OUT OF STOCK) |
| Actions      | Edit pencil icon + Delete trash icon                |

**Sample Products:**

- Linear Steel Handle v4 — Brushed Finish, 120mm
- Matte Obsidian Tile — Ceramic, 600x600mm
- Focus Downlight Pro — Recessed LED, 3000K
- Master Blueprint Roll — A0 Translucent, 80gsm
- Nordic Oak Plank — Engineered Wood, 2200mm

---

### 9.9 Users Management

**Screen Dimensions:** 2560×2048px  
**Layout:** Sidebar (Admin) + Users Table

#### Sidebar (Admin Variant)

- Identity: `System Admin — Global Inventory`
- Nav items: Dashboard | Inventory | Users | Analytics | Reports | Support | Sign Out

#### Page Header

- Title: `Users`
- Subtitle: `Manage your team members and roles`
- Action: `+ Add Team Member` (primary button, opens slide-in panel)

#### Users Table

| Column  | Content                                  |
| ------- | ---------------------------------------- |
| Avatar  | Circle image, 40px with status dot       |
| Name    | Bold, e.g. "Elena Vance"                 |
| ID      | Muted monospace, e.g. "ID: ARCH-4022"    |
| Role    | ADMIN (black pill) or STAFF (blue pill)  |
| Status  | Active (green dot) / Inactive (gray dot) |
| Email   | Muted body text                          |
| Actions | Edit + Remove icons                      |

**Sample Users:**

- Elena Vance — ID: ARCH-4022
- Julian Aris — ID: ARCH-9921
- Sarah Moat — ID: ARCH-1155
- Rachel Thorne — ID: ARCH-7782

**Pagination:**

- `Showing 1–10 of 42 results`
- Previous / Page 1, 2, 3 / Next buttons row

#### Add Team Member Panel

- Slide-in right panel (or modal)
- Fields: Full Name, Email, Role (dropdown), Password
- CTA: `Add Member` (primary) + `Cancel` (secondary)

---

## 10. Design Patterns & Principles

### 10.1 Consistency Rules

1. **Black as Primary Action Color** — All primary CTAs and active states use solid black (`#0d5b96`). Never use a colored button for a primary action.
2. **8px Border Radius Everywhere** — All cards, inputs, and buttons consistently use 8px (exceptions: auth forms use 16px).
3. **Muted Typography Hierarchy** — Secondary text always uses `#6C757D`. Placeholders use `#ADB5BD`. Never use raw gray values directly.
4. **Badges are Always Pills** — All status badges (stock, roles, plan) use `border-radius: 9999px`.
5. **Table Rows Have Hover States** — Every data table row has a `background: #F8F9FA` hover, transition `100ms ease`.
6. **Icons Come From Material Symbols** — Do not mix icon libraries. Stick to `material-symbols-rounded` or `material-icons`.

### 10.2 Layout Principles

- **Sidebar is Fixed, Content Scrolls** — On internal pages, sidebar is always fixed; main content area is scrollable.
- **Page Titles Have Subtitles** — Every internal page title is paired with a muted subtitle below.
- **Action Buttons Top-Right** — Primary actions (Add Product, Add Category, Add Member) are always positioned at the top-right of the page header row.
- **Forms Use Two-Column Grid** — Add/Edit forms use a 2-column CSS grid for fields (except textarea and image upload which span full width).
- **Landing Page Uses Max-Width Container** — 1200px centered container for all landing page sections.

### 10.3 Animation & Interaction Principles

- **Hover Transitions:** `transition: all 150ms ease` on buttons, `100ms ease` on table rows.
- **Focus Rings:** Black focus ring (`box-shadow: 0 0 0 3px rgba(0,0,0,0.08)`) instead of browser default outline.
- **No Heavy Animations** — The design is functional and data-heavy; avoid distracting motion. Subtle hover states only.
- **Sidebar Items:** Smooth background color transition on hover/active.

### 10.4 Dark Mode Consideration

- The **landing page** uses a dark theme natively.
- Internal **dashboard** pages are **light mode only** per current design.
- CSS custom properties should be structured to facilitate easy dark mode addition in the future (use `--bg-surface`, `--text-primary` tokens, not hardcoded colors directly in components).

### 10.5 Responsive Breakpoints

Though the designs are desktop-first (2560px wide screenshots), the following structure is recommended:

| Breakpoint | Width         | Change                                       |
| ---------- | ------------- | -------------------------------------------- |
| Desktop XL | `≥ 1440px`    | Default design, sidebar fully visible        |
| Desktop    | `1024–1439px` | Sidebar 240px, content slightly compressed   |
| Tablet     | `768–1023px`  | Sidebar collapses to icon-only (60px)        |
| Mobile     | `< 768px`     | Sidebar becomes bottom nav or hamburger menu |

---

## Appendix: CSS Custom Properties Quick Reference

```css
:root {
  /* Colors — Base */
  --bg-page: #f8f9fa;
  --bg-surface: #ffffff;
  --bg-sidebar: #f1f3f5;
  --bg-sidebar-hover: #e9ecef;

  /* Colors — Text */
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-placeholder: #adb5bd;
  --text-inverse: #ffffff;

  /* Colors — Action */
  --color-primary: #0d5b96;
  --color-accent: #007bff;
  --color-accent-light: #e7f1ff;

  /* Colors — Status */
  --color-success: #28a745;
  --color-success-light: #d4edda;
  --color-danger: #dc3545;
  --color-danger-light: #f8d7da;
  --color-warning: #ffc107;
  --color-warning-light: #fff3cd;
  --color-warning-dark: #856404;

  /* Colors — Border */
  --border-default: #dee2e6;
  --border-subtle: #e9ecef;
  --border-strong: #ced4da;

  /* Typography */
  --font-family:
    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Roboto Mono", "Courier New", Courier, monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md:
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg:
    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl:
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Layout */
  --sidebar-width: 260px;
  --header-height: 56px;
  --content-padding: 32px;
  --content-max-width: 1200px;
}
```

---

_Document generated from Stitch design analysis of project `13853986607354882735` — Silent Architect Inventory Management System._
_All screen data reflects the Stitch-generated designs as of March 2026._
