# Design System Specification: The Kinetic Fleet

## 1. Overview & Creative North Star
### The Creative North Star: "Precision Motion"
For a Car Rental Management platform, the UI must mirror the products it manages: high-performance, meticulously maintained, and effortlessly fluid. We are moving away from the static, "boxy" nature of traditional SaaS. Our North Star, **Precision Motion**, dictates a UI that feels like a head-up display (HUD) in a luxury grand tourer. 

We achieve this through **Editorial Asymmetry**—where data isn't just dumped into a grid, but curated with intentional white space—and **Tonal Depth**, using layers of midnight blues and indigos to create an environment that feels expensive, focused, and authoritative.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep-sea indigo (`#0b1326`), providing a high-contrast canvas for vibrant functional accents.

### The "No-Line" Rule
**Borders are a legacy constraint.** In this system, 1px solid borders for sectioning are strictly prohibited. We define boundaries through background shifts. 
*   **Example:** A `surface-container-low` sidebar sitting against a `surface` main content area. The eye perceives the edge through the shift in luminance, not a mechanical line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-polished obsidian layers.
*   **Base Layer:** `surface` (#0b1326) - The global background.
*   **Secondary Level:** `surface-container-low` (#131b2e) - For large layout sections like sidebars.
*   **Tertiary Level:** `surface-container` (#171f33) - For primary content areas or inactive card states.
*   **Interactive Level:** `surface-container-high` (#222a3d) - For hovered states or active modal elements.

### The "Glass & Gradient" Rule
To inject "soul" into the data, use Glassmorphism for floating overlays (e.g., dropdowns, tooltips). Use `surface-container-highest` at 60% opacity with a `blur-xl` (24px) backdrop filter. main CTAs should utilize a linear gradient from `primary` (#c3c0ff) to `primary_container` (#493fdf) at a 135-degree angle to simulate the sheen of automotive paint.

---

## 3. Typography: The Editorial Engine
We utilize a dual-typeface system to balance technical precision with high-end editorial flair.

*   **Display & Headlines (Manrope):** Used for KPIs, vehicle names, and page titles. Manrope’s geometric curves feel modern and engineered. 
    *   *Headline-LG (2rem)*: Use for "Fleet Overview" or "Revenue" headers.
*   **Body & Labels (Inter):** The workhorse for data tables, form labels, and small metadata. 
    *   *Body-MD (0.875rem)*: The standard for all dashboard content to ensure high information density without clutter.

**Visual Identity Tip:** Use `label-sm` in `on_surface_variant` with `tracking-widest` (all caps) for section headers in the sidebar to create an "architectural" feel.

---

## 4. Elevation & Depth
We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** To lift a "Vehicle Status" card, place it as `surface-container-lowest` (#060e20) on a `surface-container` (#171f33) background. This creates a "recessed" look that feels more integrated than a shadow.
*   **Ambient Shadows:** For floating elements (Modals), use a shadow color of `primary_fixed` (#e2dfff) at 5% opacity with a 40px blur. This creates a soft, colored glow that feels like neon under-lighting rather than a grey shadow.
*   **The Ghost Border:** If high-contrast accessibility is required, use `outline_variant` (#454652) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Sidebar Navigation
*   **Structure:** No vertical divider. Use a width of `16` (4rem) collapsed and `64` (16rem) expanded.
*   **Active State:** Use a "Pill" indicator in `primary` (#c3c0ff) positioned 4px from the left edge, with a subtle `surface-container-highest` background for the item itself.

### Data Cards (KPIs)
*   **Style:** `Rounded-md` (0.75rem). No borders. 
*   **Content:** Large `display-sm` numbers for the primary metric. Use `tertiary` (#ffb784) for warning metrics (e.g., "Overdue Returns") to provide a sophisticated warm-vs-cool contrast.

### Clean Data Tables
*   **Rule:** Forbid divider lines between rows. 
*   **Implementation:** Use a `py-3` (0.75rem) vertical padding. On hover, change the row background to `surface-container-low`.
*   **Headers:** Use `label-md` with 50% opacity of `on_surface`.

### Multi-Step Forms
*   **Progress:** Use a "Stepper" with thick `4px` horizontal bars. Completed steps use the `primary` to `primary_container` gradient; upcoming steps use `surface-container-highest`.
*   **Inputs:** `surface-container-low` background with an `outline` that only becomes visible (using `primary`) on focus.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use `gap-8` (2rem) between major dashboard widgets to let the data "breathe."
*   **DO** use `surface-bright` for hover states on dark components to create a subtle "glint" effect.
*   **DO** utilize the `tertiary` (#ffb784) accent for "Action Required" items—it cuts through the blue/indigo theme perfectly.

### Don’t
*   **DON’T** use pure black (#000000) or pure white (#FFFFFF). Always use the themed neutrals to maintain the "high-end" tonal atmosphere.
*   **DON’T** use standard 1px borders to separate table columns. Use horizontal spacing (`px-6`) instead.
*   **DON’T** use sharp corners. Every interactive element must adhere to the `md` (0.75rem) or `lg` (1rem) rounding scale to maintain the organic, premium feel.

---

## 7. Motion & Interaction
*   **Transition:** Use `cubic-bezier(0.4, 0, 0.2, 1)` for all hover states.
*   **The "Lift":** When hovering over a vehicle card, the background should shift from `surface-container` to `surface-container-high` and translate -2px on the Y-axis. No shadows—just a subtle physical lift.