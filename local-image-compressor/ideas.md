# Image Compressor — Design Direction

## Three stylistic approaches

### Approach 1
**Theme Name:** Quiet Workshop

**Very Brief Intro:** A warm, editorial utility that feels like a carefully made desktop instrument rather than a generic upload form. Paper-like surfaces, measured typography, and small material cues make privacy and control feel tangible.

**Probability:** 0.07

### Approach 2
**Theme Name:** Signal Field

**Very Brief Intro:** A dark, high-contrast technical console with precise meters, electric accents, and waveform-like geometry. It frames compression as a fast, exact process for power users.

**Probability:** 0.03

### Approach 3
**Theme Name:** Bright Commons

**Very Brief Intro:** An airy, optimistic browser utility built around clean white space, sky-blue metadata panels, and friendly instructional copy. It emphasizes approachability for occasional users.

**Probability:** 0.09

## Selected direction: Quiet Workshop

### Design Movement
Contemporary Swiss editorial design softened by the tactile restraint of modern industrial software. The interface should feel like a small, dependable tool on a well-organized workbench: calm, exact, and quietly premium.

### Core Principles
1. **Local by construction:** Privacy is visible in the composition and microcopy, not hidden in a footer. The browser-only boundary is a first-class interface element.
2. **Measured utility:** Every panel, label, and control earns its place. Dense technical information is organized into readable layers rather than decorative cards.
3. **Tactile clarity:** Subtle paper grain, hairline rules, inset surfaces, and restrained shadows suggest physical craft without becoming skeuomorphic.
4. **Progress you can understand:** File state, original size, compressed size, savings, and output format remain legible throughout the workflow.

### Color Philosophy
Use a warm bone background as the work surface, graphite for primary information, and oxidized blue as the reliable action color. The palette should feel archival and grounded rather than trendy: compression is a practical act of reduction, so the colors stay quiet and let file previews and metrics carry emphasis. A single signature vermilion is reserved for important status markers and the brand mark, creating a small spark of confidence without turning the tool into a warning console.

### Layout Paradigm
Use an asymmetrical workbench layout: a narrow left rail establishes the tool identity and privacy promise, while the main workspace starts with a large drop zone and then opens into a two-column inspection area. On desktop, the preview and compression controls sit side by side; on mobile, they stack in the order a user needs to act. Avoid a centered marketing hero and avoid a uniform dashboard grid.

### Signature Elements
- **Workbench rail:** A persistent vertical rail with the brand mark, tool label, and a vertical “LOCAL PROCESSING” note.
- **Compression docket:** A slim, ledger-like status strip showing file count, total input size, output size, and savings.
- **Vermilion registration mark:** Small red registration dots, corner ticks, and the logo symbol tie the interface to print-workshop precision.

### Interaction Philosophy
Interactions should feel direct and reversible. Dropping a file visibly anchors it to the workbench; adjusting quality updates the estimate without hiding the original; removing a file is always obvious and non-destructive. Use plain language such as “Nothing leaves this browser” and “Download compressed files” instead of vague conversion jargon. Keyboard focus, drag states, and error states should be as clear as their visual counterparts.

### Animation
Use short, physical transitions: drop-zone borders tighten into place over 180ms, file rows enter with a 40ms stagger, and the savings meter fills with a 240ms ease-out. Buttons compress to 97% scale on press. Never animate layout dimensions; use opacity and transform only. A successful compression may briefly brighten the vermilion registration mark. Respect `prefers-reduced-motion` by removing non-essential entrance and meter animations.

### Typography System
Use **DM Sans** for interface copy and metrics, paired with **Space Mono** for file metadata, units, and technical labels. The page title uses DM Sans 700 at a large but compact scale; section labels use Space Mono 11px with generous tracking and uppercase treatment; body copy stays at 14–16px with a relaxed line height. Numeric metrics use Space Mono 600 so size comparisons read as deliberate measurements.

### Brand Essence
**Positioning:** A private, browser-native image compressor for people who want smaller files without handing their images to a server.

**Personality:** Exact, calm, considerate.

### Brand Voice
Headlines should be short and assured. CTAs should name the action and the object. Microcopy should answer the user’s next concern before they ask it, especially around privacy and output quality. Avoid hype, vague promises, and generic onboarding language.

**Example lines:**
- “Smaller files. Same workbench.”
- “Your images stay on this device.”

### Wordmark & Logo
Create a compact symbol from two offset crop-corner brackets enclosing a reduced square: an abstract image frame being tightened. The mark should work in vermilion on transparent background, with no text inside it. Pair it with a custom wordmark treatment using a slightly condensed, all-lowercase “shrinkroom” lockup; the logo symbol remains the recognizable favicon and rail anchor.

### Signature Brand Color
**Registration Vermilion — `#E4513E`**

It is warm enough to feel human and precise enough to behave like a registration mark. Use it sparingly for the brand symbol, primary action emphasis, and success confirmation so it remains ownable.

## Style Decisions

The user requested a simpler GUI, so the Quiet Workshop direction is intentionally reduced to its essential signals: a calm light surface, restrained blue accent, compact Shrinkroom mark, and clear local-processing note. The left rail, large editorial hero, decorative imagery, and dense ledger presentation are not used in this revision because they make the tool feel more complex than the requested utility. The interface hierarchy is now limited to choose images, adjust quality, compress, inspect results, and download.
