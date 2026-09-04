# Design Direction — Local PDF Image Tools

## Three stylistic approaches

### Theme Name: Paper Route
Very Brief Intro: A tactile editorial workspace inspired by print studios, crop marks, and quiet desk tools. Warm paper surfaces and confident ink colors make a technical utility feel calm, trustworthy, and crafted.
Probability: 0.07

### Theme Name: Utility Ledger
Very Brief Intro: A strict monochrome records-room interface with ruled lines, stamped metadata, and dense but legible information hierarchy. It feels precise, archival, and operational.
Probability: 0.04

### Theme Name: Signal Garden
Very Brief Intro: A bright, optimistic tool bench where file transformations are represented by simple botanical and geometric signals. It feels friendly and expressive, with a more playful rhythm.
Probability: 0.02

## Chosen Approach: Paper Route

### Design Movement
Contemporary Swiss editorial design translated into a tactile print-studio workspace, with Japanese stationery restraint and a small amount of utilitarian software structure.

### Core Principles
1. **Make processing feel private and calm.** The interface should reassure users that files stay on their machine, using plain language and visible local-only cues rather than technical theater.
2. **Use paper as a system, not a decoration.** Ivory surfaces, ruled dividers, crop marks, ink dots, and clipped corners should create a visual grammar across the entire product.
3. **Let typography do the heavy lifting.** Strong editorial headlines and small operational labels should create hierarchy without oversized hero spectacle.
4. **Keep the tool direct.** One prominent upload action, immediate page previews, and a clear export step should carry the main task.

### Color Philosophy
The palette is built from warm bone paper, deep ink, cobalt registration blue, terracotta folder red, and muted moss. Bone provides a soft working surface, ink carries trust and readability, cobalt signals actions and local flow, terracotta creates human warmth, and moss marks completion without feeling like a generic SaaS green. The signature brand color is **Registration Cobalt (#2456A6)**.

### Layout Paradigm
An asymmetric editorial workstation: a narrow left rail acts like a printed cover sheet and utility index, while the main canvas behaves like an open desk. The upload zone is deliberately offset rather than centered, with the selected file and export settings arranged as a staggered right-side workbench. On mobile, the rail becomes a compact masthead and the workbench stacks in task order.

### Signature Elements
- Clipped paper-corner geometry on cards and thumbnails.
- Crop marks and tiny registration dots as quiet wayfinding details.
- A cobalt arrow motif that travels from local file input toward export.

### Interaction Philosophy
Interactions should feel like handling paper: hover states lift a surface by a few pixels, buttons compress slightly on press, and selection changes use short ink-color transitions. File handling stays explicit. The interface never hides a state change behind a vague spinner; it shows readable steps such as “Reading locally,” “Rendering page 2,” and “Ready to export.”

### Animation
Use short 160–240ms transitions with a snappy ease-out. On first load, stagger the rail, title, and upload sheet by 50ms increments. When a PDF is selected, let the file sheet slide up 8px and settle, while the progress indicator fills left-to-right. Preview thumbnails may fade in one at a time, but do not animate high-frequency controls. Respect prefers-reduced-motion and remove non-essential transforms when it is enabled.

### Typography System
Use **DM Serif Display** for the primary product headline and key editorial numerals. Use **IBM Plex Sans** for navigation, body copy, buttons, metadata, and form controls. Use uppercase IBM Plex Sans with wide tracking for tiny labels. Headline scale: 56/0.96 desktop, 40/1 mobile. Body: 15/1.5. Metadata: 11/1.3 with 0.12em tracking.

### Brand Essence
A private, local-first file studio for people who need dependable document utilities without surrendering their files to a server. Personality: **quiet, precise, warm**.

### Brand Voice
Headlines are concise and tactile; CTAs are direct verbs; microcopy explains what is happening in human language. Avoid empty SaaS phrases and hype.

Example lines:
- “Your pages stay on this device.”
- “Drop a PDF. Choose a format. Take the images with you.”

### Wordmark & Logo
The mark is a folded paper sheet pierced by a cobalt outward arrow: a compact symbol for local input becoming an exported image. The wordmark uses a custom-feeling pairing of a serif “Paper” voice and a small uppercase sans “Route” label, but the logo asset itself remains symbol-only for strong favicon recognition.

### Signature Brand Color
**Registration Cobalt — #2456A6**

## Implementation reminder
All frontend CSS and page/component files should begin with a short comment naming the Paper Route direction and the specific role of that file. When choosing between two UI treatments, ask: “Does this reinforce or dilute our design philosophy?”
