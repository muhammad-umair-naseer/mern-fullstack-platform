import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'graphic-design-ps-ai',
  title: 'Graphic Designing (Photoshop + Illustrator)',
  category: 'Design Tools',
  level: 'Beginner',
  duration: '8 weeks',
  accent: 'orange',
  coverKey: 'graphic-design-ps-ai',
  summary:
    'Learn Photoshop and Illustrator the way working designers use them — non-destructively, in the right colour space, and exported so the printer and the browser both get exactly what you intended.',
  description:
    'You retouch and composite in Photoshop with masks, adjustment layers and smart objects, then draw logos and marks in Illustrator with the pen tool, pathfinder and type on a path. Every chapter ends with a delivery skill: correct resolution, correct colour mode, correct file, correct bleed.',
  chapters: [
    chapter(
      'Pixels, Vectors, and Colour',
      'What you are actually editing, how big it needs to be, and why the screen and the press disagree about colour.',
      [
        lesson('Raster and Vector: What You Are Actually Editing', 12, `
Photoshop and Illustrator are not "the photo one" and "the drawing one". They edit two fundamentally different kinds of artwork, and choosing the wrong one costs you the job — usually the day before a deadline.

### A raster image is a grid of coloured squares

A **raster** (bitmap) file stores a fixed grid of pixels. A 3000 × 2000 photo is 6,000,000 little colour values and nothing more. The file does not know there is a face in it or a letter A — it knows that pixel 1847,903 is \`#C8A07B\`.

That has one enormous consequence: **enlarge a raster and it has to invent pixels it never had.** Photoshop guesses by interpolation, and every guess is a small blur.

Worked example. A client hands you a 1200 × 1200 px logo and asks for a 4 m vehicle wrap. Four metres is about 157 inches; even at a forgiving 60 ppi for something viewed from three metres away, you need roughly **9,400 px** across. You have 1200. Enlarging 7.8× gives soft edges and stair-stepped diagonals visible from the far side of a car park. No filter fixes this.

### A vector image is a set of instructions

A **vector** file stores geometry: anchor points, the curves between them, and how to fill and stroke the result. "Start at 0,0, curve to 40,80 with these handles, fill \`#FF6A00\`." The renderer draws it fresh at whatever size is requested, so the same 40 KB file produces a 12 mm favicon and a 12 m billboard with identical crispness.

The trade-off: vector cannot describe a photograph. Continuous tone, skin, smoke and shallow depth of field all need pixels.

### Which program, and when

| Job | Build it in | Why |
|---|---|---|
| Logo, wordmark, icon set | Illustrator | Must scale, must survive one-colour reproduction |
| Photo retouching, composites | Photoshop | Continuous tone is raster by nature |
| Signage, vinyl cut, embroidery, screen print | Illustrator | The machine follows paths, not pixels |
| Poster or flyer with big photos | Photoshop or InDesign | Raster content, controlled output size |
| Textured or painterly illustration | Photoshop | Brush texture is pixels |

### File formats follow the same split

| Raster | Vector |
|---|---|
| JPEG, PNG, TIFF, PSD, WebP | AI, SVG, EPS |
| — | PDF is a container: it can hold either or both |

Read that last row carefully. **An .ai or .pdf that contains a placed photograph is not vector art.** Dropping a JPEG logo into Illustrator and saving as .ai produces a vector wrapper around raster content, and printers receive this every week from people who believe they have supplied vector files. If you can select an anchor point with the Direct Selection tool (A), it is vector. If you cannot, it is not.

### The classic mistake

Building a logo in Photoshop because Photoshop is the program you already know. It works right up until someone needs the mark two metres wide, embroidered on a polo shirt, or as a single-colour foil stamp — and then it must be redrawn from nothing. **Anything that will ever be resized starts in Illustrator.** That single habit is worth more than any technique in this course.

### Effects that quietly rasterise

Even inside Illustrator, some effects are secretly pixels. Drop Shadow, Feather, Inner Glow and Gaussian Blur are **raster effects**, rendered at whatever is set in \`Effect > Document Raster Effects Settings\`. A document started from a web preset renders them at 72 ppi, so a beautifully drawn logo with a soft shadow prints with a visibly chunky shadow. Set it to 300 ppi before you print anything soft-edged, and check it on inherited files.
        `),
        lesson('Resolution, Document Setup, and the 300 DPI Myth', 13, `
"Make it 300 DPI" is repeated so often that people treat resolution as a property of an image. It is not. **Resolution is a ratio between pixels and physical size**, and it only means something once you name the size.

### The only formula you need

\`\`\`text
pixels = physical size (inches) x ppi
inches = pixels / ppi
\`\`\`

One 3000 × 2000 px photo, three truthful descriptions:

| Output at | Width in inches | Effective ppi |
|---|---|---|
| 300 ppi | 10 in | 300 |
| 150 ppi | 20 in | 150 |
| 72 ppi | 41.7 in | 72 |

Nothing about the file changed between those rows. The pixels are the same pixels. So when someone asks whether an image is "high resolution", the honest answer is a question: **how big is it being printed?**

### What each destination actually needs

| Destination | Target ppi at final size | Note |
|---|---|---|
| Screen / web | Irrelevant — pixel dimensions are what matter | Ship 2× for high-density displays |
| Magazine, brochure, business card | 300 ppi | Held at 30 cm |
| A1 poster on a wall | 150 ppi | Viewed at 1–2 m |
| Exhibition banner | 100 ppi | Viewed at 2–3 m |
| Billboard | 15–25 ppi | Viewed at 50 m |
| Line art / pure black and white scan | 1200 ppi | No greys to smooth the edge |

Viewing distance is doing all the work here. A 14 x 48 ft billboard at 300 ppi would be 8.7 billion pixels — about 26 GB flat in 8-bit RGB — and nobody could ever see the benefit of it.

### Setting up a print document properly

A4 flyer, 210 × 297 mm, printed offset, 3 mm bleed:

\`\`\`text
Trim size    210 x 297 mm      ->  2480 x 3508 px at 300 ppi
With bleed   216 x 303 mm      ->  2551 x 3579 px at 300 ppi
Safety zone  keep text 5 mm inside the trim on every edge
Colour mode  CMYK, 8-bit
\`\`\`

Illustrator and InDesign have a **Bleed** field in the New Document dialog — use it. Photoshop does not, so create the canvas at the bleed size (216 × 303 mm) and place guides at 3 mm from each edge to mark the trim, plus guides at 8 mm for the safety zone. Chapter 5 covers what happens at the guillotine if you skip this.

### The Image Size dialog, and the checkbox that matters

Open \`Image > Image Size\` and look for **Resample**. It changes what the dialog does entirely.

- **Resample OFF** — pixel count is locked. Changing 72 ppi to 300 ppi just rewrites the metadata and shrinks the printed size. Nothing is added or lost. This is almost always what you want.
- **Resample ON** — Photoshop adds or discards actual pixels to hit the numbers you typed.

### The classic mistake

Someone designs a flyer at 72 ppi, notices the printer wants 300, opens Image Size with Resample ticked and types 300. The file gets roughly 17× bigger, everything looks identical on screen, and it prints as a soft, mushy mess. **Interpolation cannot recover detail that was never captured.** Enlarging invents; it does not restore.

The fix is prevention: set the resolution when you create the document, and never build print artwork in a document made from a web preset. If you inherit a low-resolution file, say so early — "this will print soft at A3" is a five-minute conversation now and a reprint bill later.

### Downsampling is safe, upsampling is not

Going down throws away information you had, which is fine. Going up manufactures information you never had. If you must enlarge, \`Preserve Details 2.0\` in the Resample dropdown is the best of the options, and 2× is roughly the honest limit for anything with fine detail.
        `),
        lesson('RGB, CMYK, and Colour That Survives the Printer', 14, `
The screen makes colour by adding light. The press makes colour by subtracting it with ink. They are different physical processes with different limits, and the gap between them is where "it looked amazing on my monitor" comes from.

### Additive versus subtractive

**RGB** — red, green and blue light added together. All three at full gives white; none gives black. Monitors, phones, projectors, cameras.

**CMYK** — cyan, magenta, yellow and black inks laid on white paper, each absorbing part of the light that hits it. More ink means darker. Offset presses, digital printers, packaging.

CMYK has a **smaller gamut** — the range of colours it can physically reproduce. The colours that fall outside it are exactly the ones designers love: electric blues, neon greens, hot oranges, pure saturated reds.

\`\`\`text
RGB 0,255,0     ->  CMYK roughly 63,0,100,0   a flat garden green, not neon
RGB 0,0,255     ->  prints noticeably purple and dull
RGB 255,102,0   ->  loses its glow; the orange goes chalky
\`\`\`

### Work in the mode that matches the destination

For screen work, stay in **RGB / sRGB** end to end. For print, either build in CMYK from the start, or work in RGB and convert once at the end — but never keep flip-flopping, because every conversion is lossy and repeated round trips slowly desaturate the file.

### Soft proofing: see the disappointment before the client does

In Photoshop:

\`\`\`text
View > Proof Setup > Custom...
  Device to Simulate:   your press profile (US Web Coated SWOP, or FOGRA39 in Europe)
  Rendering Intent:     Relative Colorimetric
  Black Point Compensation: on
View > Proof Colors            (Cmd/Ctrl+Y)  toggle the simulation
View > Gamut Warning           (Shift+Cmd/Ctrl+Y)  flags unprintable pixels in grey
\`\`\`

Turn Gamut Warning on and half your logo lights up grey? Pull the saturation down yourself, deliberately, while you still control how it looks. If you leave it, the RIP makes that decision for you and it will not choose the same compromise.

**Rendering intent** decides how out-of-gamut colours get mapped:

- **Relative Colorimetric** — keeps in-gamut colours exact, clips the rest to the nearest printable colour. Default for logos, flat colour and most commercial work.
- **Perceptual** — compresses the whole range so relationships between colours survive. Better for photographs with a lot of out-of-gamut area, at the cost of shifting colours that were already fine.

### Black is not one colour

This catches everyone once.

| Use | Build | Why |
|---|---|---|
| Small text, thin rules | **100% K only** | One ink plate, so misregistration cannot show colour fringes |
| Large solid black areas | **Rich black**, e.g. C60 M40 Y40 K100 | 100K alone prints as a washed-out dark grey over a big area |

Set body copy in a four-colour "registration" black and the slightest press misalignment gives every letter a cyan shadow. It is one of the most common and most obvious amateur errors on a printed piece. Ask the printer for their preferred rich black recipe; also respect the **total ink limit**, usually around 300% on coated stock and lower on newsprint.

### Spot colours

A **Pantone spot** is a pre-mixed ink, not a CMYK simulation. Use one when a brand colour must be exact, when it is outside CMYK, or when a job is only two colours and mixing them is cheaper than a full four-colour run. Anything metallic or fluorescent is spot by necessity — CMYK cannot make gold.

### The web-side version of the same mistake

Export a JPEG from a document in Adobe RGB or ProPhoto without converting to sRGB and the browser shows it desaturated and flat. In \`Export As\`, tick **Convert to sRGB** and keep **Embed Color Profile** on. Set your Photoshop working space to sRGB for anything screen-bound and this problem disappears permanently.
        `),
      ],
      [
        q('A client wants the logo you built in Photoshop at 1200 x 1200 px reproduced 4 m wide on a vehicle wrap. What is the actual problem?', [
          'The file is in RGB and needs converting to CMYK',
          'The resolution is set to 72 ppi and needs to be changed to 300',
          'The artwork is raster, so it has no scalable outlines and must be redrawn as vector',
          'The PSD is too large to send to the printer',
        ], 2, 'Raster artwork has a fixed pixel count; only vector geometry can be rendered at any size, so the mark has to be rebuilt in Illustrator.'),
        q('You open a 3000 x 2000 px photo and change 72 ppi to 300 ppi in Image Size with Resample ticked. What happens?', [
          'Photoshop invents millions of new pixels by interpolation, so the file balloons and the image gets softer',
          'Only the metadata changes; the pixels are untouched',
          'The image is cropped to keep the same physical size',
          'The colour profile is converted to CMYK',
        ], 0, 'With Resample on, Photoshop must manufacture the extra pixels, and interpolated pixels are guesses — they add size, not detail.'),
        q('How should 9 pt body copy be built for offset printing?', [
          'Registration black: C100 M100 Y100 K100',
          'Rich black: C60 M40 Y40 K100',
          'RGB 0,0,0 and let the RIP decide',
          '100% K only',
        ], 3, 'Single-plate black cannot misregister, so small text stays crisp; multi-ink blacks show coloured fringes if the press shifts slightly.'),
        q('Gamut Warning lights up the brand green across your whole poster. What is the professional response?', [
          'Ignore it — the printer will correct it automatically',
          'Desaturate that green yourself to a printable value you have approved',
          'Increase the resolution to 600 ppi so the ink covers better',
          'Switch the document to Lab colour',
        ], 1, 'Out-of-gamut colour will be changed by someone; doing it deliberately in soft proof means you choose the compromise rather than the RIP.'),
      ]
    ),
    chapter(
      'Photoshop: The Non-Destructive Stack',
      'Layers, masks, adjustment layers and smart objects — the four things that let you change your mind on day nine.',
      [
        lesson('Layers, Blend Modes, and Fill vs Opacity', 13, `
A Photoshop document is a stack of transparent sheets viewed from above. Everything else — masks, adjustments, effects — is a rule about how one sheet interacts with the sheets below it.

### Order and hygiene

The layer at the top of the panel is nearest the viewer. That is the whole model, and it is why a shadow layer must sit *below* the object and a colour grade must sit *above* everything it grades.

Real files get to sixty or eighty layers. Discipline is not optional:

- Rename as you create. \`Layer 14 copy 3\` is how a file becomes unusable to the person who opens it next — including you in a month.
- Group with \`Cmd/Ctrl+G\` by region: \`BG\`, \`Product\`, \`Type\`, \`Grade\`.
- Colour-label the layers you will keep returning to.
- Keep a **Grade** group pinned at the very top so global adjustments never get buried mid-stack.

### Blend modes in four families

Ignore the list of twenty-seven and learn the families:

| Family | Key mode | What it does | Reach for it when |
|---|---|---|---|
| Darken | **Multiply** | Multiplies values; white becomes invisible | Shadows, scanned line art on white, texture overlays |
| Lighten | **Screen** | Inverse of Multiply; black becomes invisible | Flares, smoke, fire, light leaks shot on black |
| Contrast | **Soft Light / Overlay** | 50% grey is neutral; darker darkens, lighter lightens | Dodge and burn, colour tints, contrast punch |
| Component | **Color / Luminosity** | Splits hue+saturation from brightness | Recolouring an object, sharpening without colour fringes |

Worked example — a believable drop shadow in four steps:

\`\`\`text
1. New empty layer, dragged BELOW the object layer
2. Soft round brush, black, Flow 15%, Opacity 100%
3. Paint a soft pool where the object meets the surface
4. Set the layer to Multiply, then pull layer Opacity to about 40%
\`\`\`

Multiply matters here because it lets whatever is underneath show through the shadow instead of covering it with grey paint.

### Fill is not Opacity

Two sliders in the same panel that look interchangeable and are not.

- **Opacity** fades the layer *and* its layer styles.
- **Fill** fades only the layer's own pixels and leaves the styles at full strength.

Worked example: a text layer with a 3 px Stroke style. Drop **Opacity** to 0 and the whole thing disappears. Drop **Fill** to 0 and you get a perfect hollow outlined letterform with the fill knocked out. That is the standard way to build outline type, ghost buttons and knockout badges — and it is the single most useful thing most people never notice about the Layers panel.

### Clipping masks

\`Alt/Option\`-click the line between two layers, or press \`Cmd/Ctrl+Alt+G\`. The upper layer is now confined to the visible pixels of the layer directly below it, and the panel shows it indented with a small arrow.

Use it to put a photo inside a shape, a texture inside a letterform, or a colour tint on one object only. It is different from a layer mask: a **layer mask** describes visibility with grey values you paint; a **clipping mask** borrows the shape of the layer underneath and updates automatically when that layer changes.

### Shortcuts that pay for themselves

\`\`\`text
Cmd/Ctrl + J          duplicate layer
Cmd/Ctrl + Alt + Shift + E   stamp everything visible into a new merged layer
Cmd/Ctrl + click thumbnail   load that layer's pixels as a selection
Alt + click eye icon         solo a layer (see it alone)
[ and ]                      brush size down / up
Shift + [ or ]               brush hardness down / up
\`\`\`

### The classic mistake

Working directly on the Background layer, then discovering forty minutes later that the crop was wrong and History no longer reaches back that far. The first action in every Photoshop session is \`Cmd/Ctrl+J\` to duplicate, or better, converting the base image to a Smart Object. Flatten is a delivery step, never an editing step — and \`Merge Down\` used to "tidy up" is the same mistake wearing a hat.
        `),
        lesson('Selections and Masks: Never Press Delete', 14, `
Cutting something out is the most common task in Photoshop and the one where the destructive habit does the most damage. The rule is absolute: **you make a selection, then you turn it into a mask. You never press Delete.**

### Black conceals, white reveals

A layer mask is a greyscale image attached to a layer. Where the mask is white the layer shows; where it is black the layer is hidden; grey is partial transparency. Nothing is destroyed — paint the mask white again and the pixels come straight back.

\`\`\`text
Selection active  ->  click the Add Layer Mask button   = selection becomes visible area
Alt-click the button                                     = selection becomes hidden area
Alt-click the mask thumbnail                             = view the mask itself, full screen
\\ (backslash)                                            = view the mask as a red overlay
Cmd/Ctrl + I on the mask                                 = invert it
Shift-click the mask thumbnail                           = disable it temporarily
\`\`\`

### Pick the selection tool that matches the edge

| Subject | Tool | Why |
|---|---|---|
| Product on a plain backdrop | Object Selection / Select Subject | The AI models are genuinely good at hard edges now |
| Geometric object, straight lines | Pen tool, then load path as selection | Perfect vector edge, re-editable |
| Sky, or a colour that stands apart | \`Select > Color Range\`, Fuzziness ~40 | Selects by value, not by boundary |
| Hair, fur, foliage | Select and Mask workspace | Radius and Refine Edge Brush handle semi-transparency |

### Select and Mask, in the order that works

\`\`\`text
1. Rough selection first (Quick Selection or Select Subject)
2. Select > Select and Mask   (or Cmd/Ctrl+Alt+R)
3. View mode: On Layers, or Overlay, so you judge against the real background
4. Global Refinements: Smooth 2, Feather 0.3 px, Contrast 10, Shift Edge -10%
5. Refine Edge Brush: paint ONLY over hair and fuzzy edges, never over clean ones
6. Tick Decontaminate Colors, around 40%
7. Output To: New Layer with Layer Mask
\`\`\`

Shift Edge at -10% pulls the mask a hair inside the subject. That is what kills the background halo, and it is why a cutout made this way sits on a new background convincingly.

### The classic mistake: the white fringe

You cut a person out of a bright sky, drop them on a dark background, and a pale outline traces the whole silhouette. Those are semi-transparent edge pixels that still carry the old background's colour. Three fixes, in order of preference:

1. **Decontaminate Colors** in Select and Mask — rebuilds edge pixels from the subject's colour.
2. \`Layer > Matting > Defringe\`, 1 px.
3. Select the mask, then \`Filter > Other > Minimum\`, Radius 1 px, Preserve Roundness — this chokes the mask inward by exactly one pixel.

If you had pressed Delete instead of masking, none of these are available, because the edge pixels are gone.

### Refining a mask by painting

Masks are just greyscale, so every painting tool works on them. Press \`D\` to reset to black/white, \`X\` to swap. A soft brush at 30% flow blends an edge; the Gradient tool drawn on a mask creates a fade; \`Cmd/Ctrl+L\` (Levels) applied to the mask tightens a soft edge into a crisp one by dragging the black and white input sliders toward the middle.

### Channels for genuinely hard hair

When Select and Mask struggles, go to the Channels panel and click through Red, Green and Blue to find the one with the greatest contrast between subject and background. Duplicate that channel, run Levels hard to push background to pure white and subject to pure black, paint the interior solid black, then \`Cmd/Ctrl\`-click the channel thumbnail to load it as a selection. It takes four minutes and beats every automatic tool on backlit hair against a bright sky.
        `),
        lesson('Adjustment Layers and Smart Objects', 14, `
\`Image > Adjustments > Curves\` bakes a change into pixels permanently. The identical control in the Adjustments panel creates a **live layer** you can reopen, re-tune, mask, reorder or throw away three days later. There is no situation where the destructive menu version is the better choice.

### An adjustment layer is three things at once

It is the adjustment, **plus a layer mask**, **plus a blend mode**. That combination is what makes it powerful.

\`\`\`text
Curves + mask painted black over the sky   = brightening everything except the sky
Curves + blend mode set to Luminosity      = contrast with no saturation shift
Hue/Saturation + mask                      = recolour one shirt, not the whole frame
\`\`\`

### The order that fixes a flat photo

\`\`\`text
1. Levels    drag the black input slider right until it touches the first real
             pixels in the histogram; do the same with the white slider from the
             right. This alone restores contrast on 90% of dull images.
2. Curves    a gentle S: pull a point at 25% input down slightly, a point at 75%
             up slightly. Set the layer to Luminosity so colours do not oversaturate.
3. Hue/Sat   use the on-image target tool: click the colour you want to change and
             drag left or right. Photoshop selects the hue band for you.
4. Colour    a Color Balance or Photo Filter layer at low strength to set mood.
\`\`\`

Hold \`Alt/Option\` while dragging the Levels black slider and Photoshop shows a clipping preview — the moment pixels turn pure black, you have gone too far.

### Clipping an adjustment to one layer

By default an adjustment layer affects **everything below it in the stack**. Nine times out of ten you wanted it on one layer only.

Press \`Cmd/Ctrl+Alt+G\`, or Alt-click the boundary line, or click the small clipping icon at the bottom of the Properties panel. The layer indents and now touches only the layer directly beneath.

**This is the most common mistake in real PSDs.** Someone colour-corrects a product, hands the file over, and every other element in the composition has quietly shifted warm because the Curves layer was never clipped. If a background suddenly changes when you nudge an adjustment, an unclipped layer is why.

### Blend If: masking by brightness, with no painting

Double-click a layer to open Blending Options and find the **Blend If** sliders at the bottom. Drag the "Underlying Layer" white slider left and the bright parts of the layer below punch through the current layer.

Hold \`Alt/Option\` and drag a slider and it **splits in two**, creating a soft ramp instead of a hard cutoff. Splitting the handles is the difference between a crunchy jagged edge and an invisible blend. It is the fastest way to drop a texture onto shadows only, or to make a sky replacement respect the highlights already in the shot.

### Smart Objects

Right-click a layer and choose **Convert to Smart Object**. The original pixels are now stored intact inside a container, and everything you do to the container is a set of instructions rather than an edit.

What you gain:

- **Non-destructive transform.** Scale to 20%, save, come back, scale to 100% — pin sharp, because the source pixels were never resampled. Do that to a normal raster layer and the detail is gone forever.
- **Smart Filters.** Any filter applied to a Smart Object stays editable: double-click to change the Gaussian Blur radius, or paint on the automatic filter mask to apply it selectively.
- **Camera Raw as a live filter.** \`Filter > Camera Raw Filter\` on a Smart Object gives you re-editable exposure, white balance and lens correction.
- **Replace Contents.** A mockup built with Smart Objects updates to a new design in one click.
- **Linked Smart Objects** share one source file across several documents — change the logo once, twenty banners update.

What it costs: bigger files, and the brush, clone and healing tools refuse to paint directly on a Smart Object. That refusal is a feature; do the painting on an empty layer above it, as Chapter 3 shows.
        `),
      ],
      [
        q('Why mask a cutout instead of selecting the background and pressing Delete?', [
          'Masking is faster to execute',
          'The pixels survive, so the edge stays editable and fringe fixes still work',
          'Delete does not work on layers with transparency',
          'Masks compress smaller in the saved PSD',
        ], 1, 'A mask only hides pixels; delete destroys them along with the semi-transparent edge data that Defringe and Decontaminate need.'),
        q('You want a text layer to appear as a hollow outline: its 3 px Stroke style visible, its letterform fill gone. What do you set to 0?', [
          'Layer Opacity',
          'The blend mode to Screen',
          'The stroke position to Inside',
          'Fill',
        ], 3, 'Fill fades only the pixels a layer owns and leaves layer styles at full strength, while Opacity would fade the stroke too.'),
        q('A Curves layer meant to warm the product has warmed the entire composition. What was skipped?', [
          'Clipping the adjustment to the product layer with Cmd/Ctrl+Alt+G',
          'Setting the layer blend mode to Luminosity',
          'Converting the product to a Smart Object first',
          'Applying Curves from Image > Adjustments instead',
        ], 0, 'An unclipped adjustment layer affects every layer below it; clipping confines it to the single layer directly beneath.'),
        q('You scale a layer down to 20%, save, reopen, and scale it back to 100%. It is now soft and mushy. What would have prevented it?', [
          'Increasing the document resolution to 300 ppi',
          'Using Bicubic Sharper on the way down',
          'Converting the layer to a Smart Object before transforming',
          'Duplicating the layer before scaling',
        ], 2, 'A Smart Object keeps the original pixels and reapplies the transform as an instruction, so scaling back up returns to full sharpness.'),
      ]
    ),
    chapter(
      'Photoshop in Practice: Retouching and Compositing',
      'Cleaning up an image without destroying it, making two photographs belong together, and finishing at the right size.',
      [
        lesson('Retouching: Healing, Cloning, and Dodge and Burn', 14, `
Retouching is subtraction. You remove what distracts and leave everything that makes the subject look like a real object photographed by a real camera.

### Set up so every stroke is reversible

Before touching anything, add an empty layer above the image and name it \`Clean\`. In the options bar for the Spot Healing Brush, Healing Brush and Clone Stamp, set **Sample: All Layers** — the Healing Brush and Clone Stamp both offer it in a *Sample* dropdown, alongside *Current Layer* and *Current & Below*, while the Spot Healing Brush has it as a *Sample All Layers* checkbox. Every repair now lands on the empty layer, so you can erase a bad stroke, drop the layer opacity, or hide the whole thing to compare.

### The four repair tools and what each is for

| Tool | How it samples | Use it for | Fails at |
|---|---|---|---|
| **Spot Healing Brush** (J) | Guesses from surrounding pixels | Isolated blemishes, dust, stray hairs | Anywhere near a strong edge |
| **Healing Brush** (J) | Alt-click a source, then blends texture from source with tone of target | Skin, walls, gradients | Edges — it smears colour across them |
| **Clone Stamp** (S) | Copies the source exactly, no blending | Next to hard edges, straight lines, repeating patterns | Smooth gradients, where it leaves visible patches |
| **Patch tool** (J) | Lasso an area, drag it onto clean pixels | Larger blobs, creases, background objects | Areas without a clean donor nearby |

The decision rule: **healing near an edge smears, cloning on a gradient patches.** If a repair leaves a dark comet trail, you healed too close to a boundary — undo, switch to Clone Stamp at 100% opacity with a hard-ish brush, and sample parallel to the edge.

### Removing a whole object

\`\`\`text
1. Lasso loosely around the object, 10-20 px of margin
2. Edit > Content-Aware Fill
3. In the workspace, paint GREEN over areas that are good donors and
   subtract green from anything you do not want copied (faces, logos, the horizon)
4. Colour Adaptation: High.  Output To: New Layer
5. Clean up the leftover seams with Clone Stamp on a fresh empty layer
\`\`\`

Steps 3 and 5 are what separate a usable result from the obvious smear that a single click produces.

### Dodge and burn without wrecking the pixels

Never use the Dodge and Burn *tools* on the image itself — they are destructive and they shift saturation as they work. Build a grey layer instead:

\`\`\`text
1. New layer > Mode: Soft Light > tick "Fill with Soft-Light-neutral colour (50% gray)"
2. Soft round brush, Flow 2-4%, Opacity 100%
3. Paint WHITE to lighten, BLACK to darken. Build it up in many light passes.
4. Alt-click the layer thumbnail to see your grey map and check for blotches
\`\`\`

This is how retouchers even out skin without blurring it: you are correcting the *tone* of a shadow while leaving all the pore texture untouched.

### Frequency separation, used sparingly

The technique splits an image into a low-frequency layer (colour and tone) and a high-frequency layer (texture and detail), so you can smooth blotchy colour without erasing skin.

\`\`\`text
Duplicate the layer twice. Name them "low" and "high".
On "low":   Filter > Blur > Gaussian Blur, radius 4-8 px on a 3000 px file
            (just enough that blemishes vanish but the face shape survives)
On "high":  Image > Apply Image
              8-bit  ->  Layer: low, Blending: Subtract, Scale: 2, Offset: 128
              16-bit ->  Layer: low, Blending: Add, Scale: 2, Offset: 0, Invert ON
            then set the layer blend mode to Linear Light
Now: paint or Mixer-Brush on "low" to fix uneven colour.
     Clone Stamp on "high" to fix texture only.
\`\`\`

### The classic mistake

The plastic face. It comes from blurring the whole surface, or running frequency separation until every pore is gone. Skin has texture at every age; remove it and the brain reads the result as a mannequin, even when the viewer cannot say why.

The professional standard is **reduce, do not erase**. A spot that will be gone next week goes; a mole, a scar, a laugh line and freckles stay unless the subject asks. When in doubt, do the work at full strength on its own layer, then pull that layer to 60–70% opacity — the fastest and most reliable way to make retouching invisible.
        `),
        lesson('Compositing: Making Two Photographs Belong Together', 14, `
A composite fails for one of five reasons, and none of them is the quality of your cutout. The eye is checking **perspective, scale, light direction, colour, and edge and grain**. Match all five and a mediocre mask passes; miss one and a perfect mask still looks pasted.

### Check the five before you start cutting

\`\`\`text
Perspective  Is the camera at the same height? A product shot from above
             cannot sit on a table photographed from eye level.
Scale        Find a known object in the background - a door is ~2 m, a mug ~9 cm -
             and size the subject against it, not against the canvas.
Light        Where are the existing shadows pointing? Everything you add must
             agree. If the background is lit from the right, the subject is too.
Colour       Warm afternoon light versus cool overcast light. Whichever the
             background has, the subject must adopt.
Edge/grain   Background shot at ISO 3200 plus a razor-sharp cutout equals fake.
\`\`\`

### The order of operations that works

\`\`\`text
1. Place the subject as a Smart Object, scale and position it
2. Mask it (Chapter 2 technique), Shift Edge -10%, Decontaminate Colors
3. Contact shadow  - the single most important step, see below
4. Cast shadow
5. Clipped Curves on the subject to match brightness and direction of light
6. Clipped Hue/Saturation or Color Balance to match colour temperature
7. Match grain and focus
8. One unclipped grade layer at the very top over everything
\`\`\`

### The contact shadow does the heavy lifting

An object without a contact shadow floats, no matter how good the mask is. On a new layer directly beneath the subject, blend mode **Multiply**:

\`\`\`text
Soft black brush, Flow 10%, size roughly the width of the contact area.
Paint a tight, DARK pool exactly where the object touches the surface.
Then a much wider, lighter pool spreading outward.
\`\`\`

Shadows are darkest and sharpest where the object meets the ground and get lighter and softer with distance. Painting one even grey blob is the giveaway.

For a **cast shadow**: \`Cmd/Ctrl\`-click the subject mask to load its silhouette, fill a new layer with black, \`Cmd/Ctrl+T\` then right-click for Distort to lay it along the ground away from the light, apply Gaussian Blur, and add a mask with a gradient so the far end fades and softens.

### Matching light with a clipped Curves layer

Add a Curves adjustment clipped to the subject (\`Cmd/Ctrl+Alt+G\`), pull the whole curve down to darken, then **paint on its mask in black over the side facing the light source**. Now one side is dark and the other is not: you have relit the subject to agree with the background in about ninety seconds.

### Grain and focus are the last tells

- **Grain.** Zoom to 100% and compare noise. If the background is grainy, add matching grain to the subject: \`Filter > Camera Raw Filter > Effects > Grain\`, or \`Filter > Noise > Add Noise\` at 1–3%, Uniform, Monochromatic.
- **Focus.** A background at f/2 has soft edges everywhere. A pin-sharp subject dropped into it reads as a sticker. Add 0.3–0.8 px of Gaussian Blur to the subject, or use \`Filter > Blur Gallery > Field Blur\` to fake a matching depth of field.

### Unify with one grade on top

At the very top of the stack, add a **Solid Color** fill layer in the background's dominant colour, set to **Soft Light** at 8–15% opacity. Everything in the frame now shares one colour cast, which is exactly what a single camera and a single light source would have produced.

### The classic mistake

Spending an hour perfecting the hair mask and five seconds on the shadow. Viewers do not consciously inspect edges; they read light. A slightly rough cutout with a correct contact shadow and matched colour looks real, and an immaculate cutout floating half a centimetre above the table never will.
        `),
        lesson('Camera Raw, Resizing, and Sharpening in the Right Order', 12, `
Finishing has an order. Get it wrong and you sharpen detail that you are about to throw away, or you resize an image that has already been sharpened and turn crisp edges into halos.

\`\`\`text
Correct order:  raw/global tone  ->  retouch  ->  composite  ->  resize to final
                ->  convert colour space  ->  sharpen for output  ->  export
\`\`\`

### Camera Raw as a live filter

Convert the layer to a Smart Object first, then \`Filter > Camera Raw Filter\`. Everything stays re-editable — double-click the Smart Filter later and every slider is where you left it.

Work top to bottom in the Basic panel, because each control changes what the next one should be:

\`\`\`text
White Balance   fix the cast first; everything else is judged against it
Exposure        set overall brightness
Highlights -    recover blown skies
Shadows +       open dark areas (watch for noise appearing)
Whites / Blacks hold Alt while dragging to see exactly where clipping starts
Texture         mid-frequency detail; kinder to skin than Clarity
Clarity         local contrast; heavy-handed above about +20
Dehaze          use sparingly, it saturates aggressively
\`\`\`

### Resampling: pick the method for the direction

| Situation | Resample method |
|---|---|
| Reducing size | **Bicubic Sharper**, or Automatic |
| Enlarging photographs | **Preserve Details 2.0** with the Reduce Noise slider around 20 |
| Enlarging flat colour, screenshots, pixel art | **Nearest Neighbor** (hard edges, no smearing) |

Downsampling discards information you had, which is safe. Upsampling manufactures information you never had. Roughly 2× is the honest ceiling for anything with fine detail — beyond that the result looks illustrated rather than photographed.

### Sharpen last, at final size, at 100% zoom

Sharpening is not detail recovery; it is local contrast added at edges so the eye reads them as crisper. It is size-specific, which is why it comes last.

**Smart Sharpen** for most work:

\`\`\`text
Web image, ~1500 px wide:   Amount 90-130%,  Radius 0.8-1.0 px, Reduce Noise 15%
Print at 300 ppi:           Amount 110-150%, Radius 1.2-1.8 px, Reduce Noise 10%
Remove: Lens Blur (better edge handling than Gaussian Blur)
\`\`\`

Print numbers are higher on purpose: ink spreads slightly into paper fibres, so a file that looks perfectly sharp on screen prints slightly soft.

**High Pass** when you want control over where the sharpening lands:

\`\`\`text
1. Cmd/Ctrl+Alt+Shift+E to stamp a merged copy
2. Convert to Smart Object
3. Filter > Other > High Pass, Radius 1.0-2.0 px
4. Blend mode: Overlay (strong) or Soft Light (gentle)
5. Add a mask and paint black over skin, sky and out-of-focus areas
\`\`\`

Masking sharpening away from smooth areas is what stops noise being amplified in the sky while the eyelashes get crisp.

### The classic mistake

Sharpening at 33% zoom because that is how the image happens to be displayed. Screen zoom below 100% is itself a resample, so the preview lies in both directions — you either under-sharpen or, far more often, over-sharpen badly. **Always judge sharpening at 100%**, and look specifically for bright halos along high-contrast edges. Once a halo is visible at 100%, it will be obvious in print.

### Bit depth

Edit in **16-bit** whenever the source allows it: heavy Curves moves on an 8-bit file tear smooth gradients into visible bands, most obviously in skies and soft backgrounds. Convert to 8-bit as the last step before export, since JPEG is an 8-bit format and web PNGs are delivered at 8 bits per channel anyway, and the file halves in size.
        `),
      ],
      [
        q('Why set Sample to All Layers and heal onto an empty layer above the photo?', [
          'It makes the Healing Brush sample colour more accurately',
          'It is required for Content-Aware Fill to work',
          'It halves the file size compared with healing on a duplicate',
          'Every repair stays separate, so it can be erased, faded or hidden without touching the original pixels',
        ], 3, 'Repairs on their own layer remain fully reversible and can be dialled back with layer opacity, which healing directly on the image cannot offer.'),
        q('Your cutout has a flawless hair mask but still looks pasted onto the new background. What is the most likely cause?', [
          'The mask needs another pass of Refine Edge',
          'There is no contact shadow, so the object appears to float',
          'The subject layer is not a Smart Object',
          'The document is in 8-bit rather than 16-bit',
        ], 1, 'The eye reads light before edges, and a dark, tight contact shadow where object meets surface is what makes an element sit in a scene.'),
        q('You need a 4000 px photo delivered at 1200 px wide and sharp. What is the correct order?', [
          'Sharpen at 4000 px, then resize to 1200 px',
          'Sharpen at 4000 px, resize, then sharpen again',
          'Resize to 1200 px first, then sharpen and judge it at 100% zoom',
          'Resize to 1200 px, sharpen, then resize back up to check',
        ], 2, 'Sharpening is size-specific, so it must be applied at the final pixel dimensions and evaluated at 100% where the preview is honest.'),
        q('A retouched portrait looks like a mannequin. What went wrong?', [
          'The skin texture was blurred or smoothed away, and skin without pores reads as artificial',
          'The file was saved as JPEG instead of TIFF',
          'Dodge and burn was done on a 50% grey Soft Light layer',
          'The Healing Brush was used instead of the Patch tool',
        ], 0, 'Believable skin keeps its high-frequency texture; removing pores entirely is what produces the plastic look regardless of how clean the colour is.'),
      ]
    ),
    chapter(
      'Illustrator: Paths, Shapes, and Type',
      'Drawing with anchor points, building marks from primitives, and setting type that survives handoff.',
      [
        lesson('Anchor Points, Handles, and the Pen Tool', 15, `
Every vector shape is anchor points joined by segments. The pen tool feels hostile for about two hours and then becomes the fastest drawing instrument you own — but only if you learn the rules rather than clicking hopefully.

### Two kinds of anchor

- **Corner point** — the path changes direction abruptly. Created by a single click.
- **Smooth point** — the path flows through. Created by click-and-drag, which pulls out two **direction handles** that stay in a straight line through the anchor.

A handle controls the curve leaving that anchor: **its direction sets the tangent, its length sets how far the curve is pulled that way.** A useful starting length is about one third of the distance to the next anchor.

### The two rules that make curves look professional

**1. Put anchors at the extremes.** On a circle, that is 12, 3, 6 and 9 o'clock. On a leaf, the tip and the widest point. Anchors placed halfway along a curve create wobble because you are now steering with two half-controls instead of one whole one.

**2. Keep handles perpendicular to the shape at those extremes.** Horizontal handles at the top and bottom of a form, vertical handles at the left and right. Hold \`Shift\` while dragging to lock them exactly. Curves drawn this way have no flat spots and no kinks.

### Pen tool controls worth memorising

\`\`\`text
Click                        corner point
Click + drag                 smooth point with handles
Alt/Option + drag a handle   break the pair, so the next segment leaves at a new angle
Alt/Option + click an anchor retract the handle, converting smooth to corner
Cmd/Ctrl (held)              temporarily switch to the last selection tool
Hover over the first anchor  small circle appears = clicking closes the path
Hover over a segment         plus sign = add an anchor
Hover over an anchor         minus sign = delete it (and keep the curve flowing)
\`\`\`

### Worked example: draw a leaf with two anchors

\`\`\`text
1. Pen tool. Click once at the stem tip (a corner point).
2. Click at the leaf tip and DRAG upward about 40 px.
   Release. One side of the leaf is now a smooth arc.
3. Alt-click that tip anchor to retract the forward handle, making it a corner.
4. Click back on the stem anchor and drag DOWNWARD as you close the path.
\`\`\`

Two anchors, one closed shape, a crisp point at each end. Attempting the same leaf with eight anchors gives a lumpy outline that no amount of nudging repairs.

### Selection tool versus Direct Selection

- **V (Selection, black arrow)** moves the whole object.
- **A (Direct Selection, white arrow)** selects individual anchors and handles.

Every beginner tries to fix a curve with the black arrow and scales the entire shape instead. If you clicked and the whole thing has a bounding box, you have the wrong tool.

### The classic mistake: too many anchor points

**Image Trace** and hopeful clicking both generate four to ten times more anchors than a shape needs. A path with hundreds of anchors ripples along what should be a clean arc, cuts badly on a vinyl plotter, and slows every subsequent edit. Open \`Object > Path > Simplify\`, drag the slider down until the point count collapses, and watch the shape: it usually improves visibly.

The professional habit is to draw with the **fewest anchors that describe the form**, then refine handles. Nine points around a circle is wrong; four is right.

### Strokes are also geometry

In the Stroke panel, **Align Stroke** matters more than people expect. A 4 pt centred stroke sits 2 pt outside the path on every edge, and 4 pt is 1.41 mm, so a 100 mm square drawn to size actually measures about 101.4 mm across. For anything cut, die-lined or dimension-critical, align the stroke **inside**. When the shape is final, \`Object > Path > Outline Stroke\` converts the stroke into a filled shape that scales with the artwork instead of staying at a fixed weight.
        `),
        lesson('Shapes, Pathfinder, and Building a Mark', 13, `
Most professional logos are not drawn freehand. They are assembled from circles, rectangles and triangles that get combined, subtracted and trimmed until the mark appears. Working this way gives you geometry that is mathematically consistent, and consistent geometry is what makes a mark look designed rather than sketched.

### Drawing primitives precisely

\`\`\`text
Shift while drawing          constrain to square / circle / 45-degree
Alt/Option while drawing     draw from the centre outward
Spacebar while drawing       reposition before releasing the mouse
Up / Down arrows (Polygon)   add or remove sides mid-drag
Click once with the tool     type exact dimensions in a dialog
\`\`\`

Illustrator shapes are **live**: a rectangle keeps corner-radius widgets you can drag, and the Transform panel keeps editing width, height and corner radius numerically until you expand it.

### Pathfinder, honestly explained

The panel has two rows and they behave differently.

**Top row (Shape Modes)** — Unite, Minus Front, Intersect, Exclude. Clicking applies immediately. **Alt-clicking** creates a live *compound shape* whose components stay editable until you hit Expand.

**Bottom row (Pathfinders)** — Divide, Trim, Merge, Crop, Outline, Minus Back. These cut artwork into separate pieces and always expand immediately.

| I want to | Use |
|---|---|
| Weld overlapping shapes into one | Unite |
| Punch a hole with the top shape | Minus Front |
| Keep only the overlap | Intersect |
| Slice everything along every intersection | Divide |
| Remove hidden parts of stacked shapes | Trim |

### Worked example: a location pin in five steps

\`\`\`text
1. Ellipse tool: 60 x 60 px circle.
2. Rectangle: 42.4 x 42.4 px square. Rotate 45 degrees.
3. Align both to the same vertical axis; slide the diamond down so its top
   half is buried inside the circle and its bottom point sits below.
4. Select both > Pathfinder > Unite. The teardrop appears.
5. Draw a 24 px circle centred in the head, select both, Minus Front.
\`\`\`

Five steps, all geometry, no freehand. Every curve is a true circular arc, which is exactly why it looks resolved.

### Shape Builder is usually faster

Select the overlapping shapes and press **Shift+M**. Drag across regions to merge them; hold **Alt/Option** and click a region to delete it. For anything with more than three overlaps, Shape Builder beats Pathfinder because you can see each region before committing.

### Compound paths versus groups

A **group** (\`Cmd/Ctrl+G\`) keeps objects together for selection. A **compound path** (\`Cmd/Ctrl+8\`) makes several paths behave as a single shape with genuine holes — this is how the counter in a letter O stays transparent instead of being a white disc that fails the moment the logo sits on a coloured background.

Testing for this takes one second: drag the mark onto a bright rectangle. If a white blob appears inside it, you needed a compound path.

### Alignment, and the key-object trick

Select several objects, then **click one of them again** with the Selection tool. It gets a thicker highlight and becomes the **key object**; everything aligns to it rather than to an averaged position. Without this, aligning three objects moves all three and you lose the one you wanted to keep still.

Check the Align panel dropdown too — **Align to Artboard** and **Align to Selection** produce completely different results, and forgetting which is set is a daily source of confusion.

### Pixel-perfect icons

For UI icons, set the artboard to the icon size (24 × 24 px), keep shape edges on whole-pixel coordinates, use whole-number stroke weights (2 px, not 1.5 px), and turn on **Align to Pixel Grid**. What decides crispness is where the stroke's own edges land: an even 2 px stroke is sharp centred on a whole pixel, while an odd 1 px stroke has to sit on a half-pixel to fill exactly one row. Centre that 1 px stroke on a whole-pixel coordinate instead and it straddles two rows and renders as a blurry 2 px grey smear in the browser.

### The classic mistake

Running Pathfinder on the only copy of your shapes. Unite and Minus Front are destructive — the components are gone, and three revisions later the client asks to move the hole 2 px. Work on a duplicate (\`Cmd/Ctrl+C\`, \`Cmd/Ctrl+F\` pastes in front), or Alt-click the shape mode to keep the compound shape live, and keep an unflattened construction copy on a hidden layer named \`build\`.
        `),
        lesson('Type in Illustrator: Point Type, Paths, and Outlines', 13, `
Type in Illustrator behaves differently from type in Photoshop, and two of those differences cause most of the problems people hit on real jobs.

### Point type versus area type

**Click once** with the Type tool and you get **point type**: a single line that grows outward and never wraps. **Click and drag a box** and you get **area type**: text that flows and wraps inside a container.

The difference matters at the moment you resize. Drag the corner of point type with the Selection tool and you scale the letterforms — 12 pt Helvetica Regular becomes a distorted 19.4 pt at 87% horizontal scale, which is a **fake condensed font**, and it looks wrong beside anything set properly.

\`\`\`text
Wrong:  select with V, drag the bounding box corner
Right:  select the text, change the size in the Character panel
Right:  for area type, drag the box to change the column, not the letterforms
\`\`\`

If you inherit a file where this has happened, the Character panel shows horizontal scale at something other than 100%. Set it back to 100% and re-set the size honestly.

### Type on a path

\`\`\`text
1. Draw the path (a circle, an arc, a wave) with any drawing tool
2. Type on a Path tool (hidden under the Type tool), click on the path
3. The path loses its stroke and fill and becomes a baseline
\`\`\`

Three bracket handles appear: **start**, **end**, and a **centre** bracket. Drag start and end to set the run of text. Drag the **centre bracket across the path** to flip the text to the other side — the single most useful and least discovered control in Illustrator.

\`Type > Type on a Path > Type on a Path Options\` gives you the effects — Rainbow (default), Skew, 3D Ribbon, Stair Step, Gravity — plus **Align to Path**, which decides whether the Baseline, Ascender, Descender or Centre of the letters touches the path.

### Worked example: a circular badge

Text along the top of a circle reads correctly, but the same text at the bottom appears upside down. The fix is two paths, not one:

\`\`\`text
1. Circle A: Type on a Path tool, type the top text.
   Paragraph panel > Align Center. Drag the centre bracket to 12 o'clock.
2. Copy the circle and Paste in Front (Cmd/Ctrl+F). Make it circle B.
3. On circle B, type the bottom text, centre it, and drag the centre bracket
   INSIDE the circle so the text flips to run left-to-right along the bottom.
4. Set Align to Path: Ascender on the bottom text so it hangs at the same
   optical distance from the ring as the top text.
5. Nudge with Baseline Shift in the Character panel until the two arcs
   sit an equal distance from the circle.
\`\`\`

### Kerning and tracking

**Kerning** is the space between two specific letters; **tracking** is space applied across a run. Both are measured in thousandths of an em.

\`\`\`text
Alt/Option + Left or Right arrow   adjust with the cursor between two letters
Metrics kerning     uses the pairs the type designer built in - default for text
Optical kerning     Illustrator judges by shape - use for display sizes, all-caps
                    settings, and any line mixing two typefaces
\`\`\`

Large display type almost always needs tightening (tracking around -10 to -25); small all-caps almost always needs opening up (+50 to +100).

### Create Outlines, and when not to

\`Type > Create Outlines\` (\`Shift+Cmd/Ctrl+O\`) converts letters into vector shapes. The printer no longer needs your font, nothing can reflow, and the artwork is identical everywhere.

**It is also permanent.** Once outlined the text is not text: no spellcheck, no font swap, no correcting the client name. Outlining early and then being asked for a copy change is the classic mistake, and it means retyping and re-kerning from scratch.

The professional workflow: keep a live-text master file, then \`Save As\` a separate outlined copy for delivery — or skip outlining altogether and supply **PDF/X-4** with fonts embedded, which is what Chapter 5 recommends. Also remember \`File > Package\`, which collects the document, its linked images and its fonts into one folder, and takes about four seconds.
        `),
      ],
      [
        q('Where should anchor points sit on a smooth curve, and in what quantity?', [
          'At the extremes of the form, using as few anchors as possible with handles perpendicular to the shape',
          'Evenly spaced every 20 px so the curve stays mathematically regular',
          'At every visible change in the outline, with more points giving a smoother result',
          'Wherever the pen happens to click, since handles can correct any placement afterwards',
        ], 0, 'Extreme-point placement with perpendicular handles produces clean arcs, and each unnecessary anchor introduces a new place for the curve to wobble.'),
        q('You need to punch a circular hole through a shape but keep the ability to move the hole later. What do you do?', [
          'Select both and click Minus Front normally',
          'Fill the top circle with white and place it above',
          'Alt-click Minus Front to build a live compound shape, expanding only when the design is final',
          'Group the two shapes with Cmd/Ctrl+G',
        ], 2, 'Alt-clicking a shape mode keeps the components editable inside a compound shape, whereas a plain click flattens them immediately.'),
        q('A designer drags the corner of point type with the Selection tool to make a headline bigger. What is wrong with the result?', [
          'Nothing, this is the standard way to resize type',
          'The letterforms are distorted into a fake condensed or extended face rather than a real font size',
          'The text converts to outlines automatically',
          'The kerning pairs are discarded',
        ], 1, 'Scaling the bounding box changes horizontal and vertical scale rather than point size, so the result no longer matches the typeface as drawn.'),
        q('Why keep a live-text master file rather than outlining type as soon as the layout is approved?', [
          'Outlined type prints at lower resolution',
          'Outlined type cannot be filled with colour',
          'Outlining increases file size beyond what printers accept',
          'Outlining is permanent, so any later copy change means retyping and re-kerning from scratch',
        ], 3, 'Create Outlines destroys the editable text, and copy changes after approval are common enough that the master file must stay live.'),
      ]
    ),
    chapter(
      'Typography, Layout, and Delivery',
      'Setting type that reads, arranging a page that guides the eye, and exporting files the browser and the press both accept.',
      [
        lesson('Typography Fundamentals', 14, `
Most amateur design is identifiable from across a room, and typography is why. The fixes are specific and numeric.

### The measurements that decide whether text reads

| Setting | Body copy | Headlines |
|---|---|---|
| **Measure** (line length) | 45–75 characters, 66 ideal | Anything, but break lines by meaning |
| **Leading** (line spacing) | 1.4–1.6 × the type size | 0.9–1.1 × — big type needs *less* relative space |
| **Tracking** (letter spacing) | 0 for lowercase | −10 to −25 for large display; +50 to +100 for small all-caps |
| **Size** | 16 px on screen, 9–11 pt in print | Whatever the hierarchy demands |

Concrete: 16 px body type wants a column of roughly 500–600 px and 26 px of line height. Write that as **16/26**. A 48 px headline wants around **48/52** — a headline set at 1.5 line spacing looks like it has fallen apart, because the eye does not need help finding the next line when the line is enormous.

Measure is the one people get wrong most. Body text stretched across a full 1400 px browser window gives 180 characters per line; the eye loses its place returning to the left margin, and the reader simply stops. Cap the column, no matter how much empty space that leaves.

### Build a scale instead of picking sizes

Choose a ratio and multiply. At 1.25 from a 16 px base:

\`\`\`text
16  ->  20  ->  25  ->  31  ->  39  ->  49  ->  61
\`\`\`

Round to 16 / 20 / 25 / 31 / 39 / 49. Now every size on the page is related to every other one, and the reason a page "feels designed" is usually this and nothing more.

### Pairing typefaces

Two families is the working limit; one family with several weights is often better. Pair for **contrast in form, agreement in mood** — a high-contrast serif display face with a neutral grotesque for text works because they differ in structure but share an era and a voice. Two similar sans faces just look like a mistake.

Before adding a second family, try solving the problem with weight, size, colour or case in the family you already have. Ninety per cent of the time it works.

### Hierarchy is mostly space

Rank information, then express the ranking. Size, weight, colour and case all work, but **space is the cheapest and most underused signal**: put 32 px above a subhead and 8 px below it and the reader instantly understands that it belongs to the paragraph beneath, without you changing a single font property. Proximity communicates ownership.

### The mistakes that mark a piece as amateur

- **Faux bold and faux italic.** Clicking a B button on a family with no bold weight makes the software smear the outlines. Use real weights.
- **Centring long paragraphs.** Both edges ragged means no anchor for the returning eye. Centre headlines, set body flush left.
- **Justified narrow columns.** Forcing both edges in a 40-character column opens rivers of white space. Justify only in wide columns, with hyphenation on.
- **Straight quotes.** " and ' are typewriter marks. Use “ ” and ’ — and an en dash for ranges, an em dash for interruption.
- **Widows and orphans.** A widow is a single word or short line left alone at the end of a paragraph, or a paragraph's last line stranded at the top of the next column; an orphan is a paragraph's opening line left alone at the foot of a column. Fix either with a manual break or a small tracking change of −5 on the paragraph.

### Before and after, with numbers

> **Before.** Headline 28 pt bold, subhead 24 pt bold, body 22 pt, all centred, all in the same font, 10 pt of space between every block.

Nothing is dominant, so nothing reads first. Three near-identical sizes register as an accident rather than a hierarchy.

> **After.** Headline 60/62 with tracking −15, subhead 24/32 in the regular weight at 70% black, body 16/26 flush left on a 65-character measure. Space: 40 px above the subhead, 12 px below it, 24 px between paragraphs.

Same words, same typeface, one obvious entry point, and a clear reading order. The change was **contrast and space**, not decoration — a rule that scales from a business card to a website.
        `),
        lesson('Composition, Grids, and Layout', 14, `
Layout is the arrangement of attention. Someone gives your poster three seconds; composition decides what they take from it.

### One focal point, then a path

Decide before you place anything what the single most important element is. Everything else supports it. If two elements are equally loud they cancel, and a viewer with no obvious entry point looks away.

Test it: shrink the design to thumbnail size, or squint at it. Whatever is still legible is your real hierarchy. If everything blurs into one grey texture, contrast is too flat.

### Grids make decisions for you

A grid is margins, columns and gutters. Its value is not tidiness — it is that you stop re-deciding where things go.

\`\`\`text
A4 poster, 210 x 297 mm
  Margins   15 mm all round (18 mm foot to balance optically)
  Columns   6, gutter 6 mm  ->  each column is 25 mm
  Baseline  every 6 mm, and all text sits on it
Elements span whole columns: 2 for a caption, 4 for an image, 6 for the headline.
\`\`\`

Six columns is more flexible than four because it divides into halves, thirds and sixths. Twelve is the web standard for the same reason.

### Alignment: everything relates to something

Every edge should line up with another edge somewhere on the page. A strong left alignment reads as deliberate; five slightly different left edges read as carelessness even when a viewer cannot name what is wrong. Centred layouts are harder, not easier — a centred axis must be *exactly* centred and every element must respect it.

### Proximity carries meaning

Gaps say what belongs together. A caption 6 px under its image and 24 px from the next block is unambiguous. Set both gaps to 15 px and the reader has to work out the relationship, which is work you were supposed to do for them.

### Optical adjustments beat mathematical ones

The eye does not agree with the ruler.

- **Optical centre** sits about 5–10% above the mathematical centre. Centre a logo perfectly on a page and it looks like it is sinking.
- **Round shapes overshoot.** A circle must be drawn slightly larger than a square to look the same size — roughly 2–5%. Typefaces do this: the O in almost every font extends past the cap height.
- **Optical margin alignment.** A quotation mark or a capital A at the start of a line makes the left edge look ragged. Hang the punctuation slightly outside.

Trust your eye over the numbers. The numbers are a starting point.

### White space is structure

Empty area is not wasted area — it is what gives the focal point somewhere to be loud. The instinct to fill every corner comes from thinking of the page as area to be paid for. Increase your margins by 50% on a layout that feels cluttered and it will almost always improve.

### Repetition and a spacing system

Pick a spacing unit — 8 px on screen, 4 or 6 mm in print — and use only multiples of it. Two elements 14 px apart and two others 17 px apart is invisible individually and reads as sloppiness collectively. A system removes a hundred tiny decisions and makes the result look coherent.

### Before and after, with numbers

> **Before.** An A4 event flyer: 8 mm margins, headline centred at the top, three photos of different widths, body text filling the remaining space, logo squeezed into a corner. Nine gaps, all different.

> **After.** Margins to 15 mm. Headline moved to the upper-left on a 6-column grid, spanning 4 columns at 60 pt. One hero photo spanning all 6 columns; the other two dropped. Details set in two 3-column blocks with a shared baseline. All vertical gaps snapped to 6 mm multiples. Logo bottom-right at 20 mm wide, aligned to the right margin.

Less content, more space, one clear focal point, everything on a grid. The "after" reads in the three seconds it is going to get.
        `),
        lesson('Exporting Correctly: Web Versus Print', 13, `
The last ten minutes of a project is where good work most often gets damaged. Screen and press want opposite things, and the checklists are short enough to memorise.

### Web export

\`\`\`text
Photoshop:    File > Export > Export As...    (Save for Web is legacy)
Illustrator:  File > Export > Export for Screens...  (multiple scales at once)
Always: Convert to sRGB ON.  Metadata: None.  Embed Color Profile ON.
\`\`\`

| Format | Use it for | Notes |
|---|---|---|
| **JPEG** | Photographs | Quality 60–80. Above 85 the file grows fast for no visible gain |
| **PNG-24** | Transparency, flat UI, screenshots | Lossless and large; wrong choice for a photo |
| **WebP** | Anything, if you control the site | 25–35% smaller than JPEG at matching quality |
| **SVG** | Logos, icons, illustrations | Vector, tiny, sharp at every density |
| **GIF** | Nothing, in 2020s work | Superseded by WebP and video |

Export **@1x and @2x** for raster assets so high-density screens stay sharp: a 400 px-wide slot needs an 800 px image.

SVG settings from Illustrator that matter: Styling **Presentation Attributes**, Font **Convert To Outlines** for logos, Decimal **2**, Object IDs **Minimal**, Responsive **off** so width and height are written into the file.

### Print export

\`\`\`text
File > Save As / Export > Adobe PDF
  Preset:     [PDF/X-4:2008]  - modern RIPs; keeps live transparency
              [PDF/X-1a:2001] - older presses; flattens transparency, CMYK only
  Marks:      Trim Marks ON, Offset 3 mm
  Bleeds:     Use Document Bleed Settings (3 mm), or type 3 mm on all four
  Output:     Convert to Destination (Preserve Numbers), profile = the press profile
  Fonts:      embedded (PDF/X requires it)
\`\`\`

### Bleed, trim and safety, in one paragraph

Guillotines are accurate to about ±1 mm, and paper shifts as it feeds. **Bleed** means any element intended to touch the edge must extend 3 mm past the trim line, so a slightly early cut still lands in artwork. **Safety** means keeping text and logos at least 5 mm inside the trim, so a slightly late cut does not shave them. Skip the bleed and you get a thin white sliver down one edge of the finished job — the most common and most expensive print mistake there is, because it is only discovered after the run.

### The effective resolution trap

The Links panel in Illustrator and InDesign shows a **Scale** percentage. A 300 ppi photo placed at 200% is printing at **150 ppi**, and nothing on screen tells you unless you look.

\`\`\`text
effective ppi = original ppi / (scale percent / 100)

300 ppi at 200%  ->  150 ppi   soft
300 ppi at 100%  ->  300 ppi   correct
600 ppi at 50%   ->  1200 ppi  fine, just a bigger file than needed
\`\`\`

### Pre-flight checklist for print

- Document is **CMYK**; no stray RGB images in the Links panel
- Every placed image at **300 ppi effective** at its final scale
- **Bleed 3 mm** on every edge that touches artwork, safety margin respected
- Small text and rules are **100% K only**; large solids use the rich black your printer specifies
- Fonts embedded or outlined; no missing fonts and no missing links
- Spot colours either intentional and named correctly, or converted to process
- Total ink coverage within the printer's limit, typically about 300%
- Open the exported PDF and view it in **Overprint Preview** before sending

### The classic mistake

Exporting a print PDF from a document that was set up for screen: RGB, 72 ppi, no bleed. It opens perfectly on the designer's machine, which is why it gets sent. The printer either rejects it or prints it, and both outcomes cost days. **The output decision belongs at the New Document dialog**, which is where Chapter 1 started — set the colour mode, resolution and bleed before you draw the first shape, and this last ten minutes becomes a formality.
        `),
      ],
      [
        q('Body copy on a wide landing page runs the full 1400 px width. Why is that a problem?', [
          'Wide lines force the browser to re-render text more often',
          'Long lines require a larger font size to stay legible',
          'At roughly 180 characters per line the eye loses its place returning to the left margin, so people stop reading',
          'Search engines penalise text blocks wider than 1000 px',
        ], 2, 'Comfortable reading sits at 45 to 75 characters per line because the return sweep to the next line needs a short, predictable distance.'),
        q('A business card design has a full-bleed photo background but no bleed set. What will the finished card look like?', [
          'The photo will print at the wrong resolution',
          'The photo will be automatically scaled up by the RIP',
          'The colours will shift toward magenta at the edges',
          'A thin white sliver will appear on one or more edges wherever the cut lands slightly inside the artwork',
        ], 3, 'Cutting tolerance is about a millimetre, so artwork that stops exactly at the trim line leaves unprinted paper when the guillotine drifts.'),
        q('A 300 ppi image is placed in a print layout and scaled to 200%. What is its effective resolution?', [
          '150 ppi, which will print visibly soft',
          '300 ppi, because the file itself has not changed',
          '600 ppi, because scaling multiplies the pixel density',
          'It depends on the export preset used',
        ], 0, 'Scaling up spreads the same pixels over twice the physical distance, halving the effective resolution to 150 ppi.'),
        q('A layout uses 28 pt, 24 pt and 22 pt for headline, subhead and body. Why does it look unresolved?', [
          'Those sizes are too small for print',
          'The size steps are too close to read as a deliberate hierarchy, so nothing dominates',
          'Three type sizes is always one too many',
          'The leading has not been set to auto',
        ], 1, 'Hierarchy needs visible contrast; near-identical sizes read as an accident rather than a ranking, which is why a type scale uses a consistent ratio.'),
      ]
    ),
    chapter(
      'Logo Systems and Client Handoff',
      'Running an identity job end to end — construction, the family of variants, and the folder you actually hand over.',
      [
        lesson('From Brief to Mark: How an Identity Job Runs', 14, `
An identity job almost never fails at the drawing stage. It fails because nobody agreed in advance what the mark had to survive, and the drawing was quietly optimised for the one size it happened to be designed at.

### Six questions before the first sketch

| Question | What it changes about the drawing |
|---|---|
| Where does this appear **smallest**? | A 16 px favicon destroys any mark with three internal details |
| Will it ever be **one colour**? | Embroidery, foil, laser etching, a rubber stamp, a car park sign |
| What sits **next to** it? | Audit five competitors; if four use a blue circle, do not draw a fifth |
| Who **signs it off**? | Four stakeholders means three rounds — budget them now |
| Is there existing **equity**? | A colour or shape customers already recognise is an asset, not a limit |
| When does it hit **print**? | A vehicle wrap booked for the 12th is your real deadline |

Write the answers down and send them back for confirmation. Most of the argument in round three is about something that was never agreed in round zero.

### Sketch on paper, and sketch badly

Twenty thumbnails at roughly 3 cm each, forty seconds per idea, pen rather than pencil so you cannot tidy up. The point is not quality — it is that paper is about ten times faster than Illustrator at the stage where you are still deciding what the idea *is*. Open a vector file too early and you start refining, and refining a weak idea only produces a well-made weak idea.

Carry three to five thumbnails forward. Only then open Illustrator.

### Build on a construction grid

Freehand geometry looks approximate even when a viewer cannot say why. Constrain yourself before drawing anything:

\`\`\`text
Artboard        100 x 100 units (relative; scale at the end)
Module          10 units - every dimension is a multiple of it
Radii           choose three: 10, 20, 40.  No others.
Angles          0, 30, 45, 60, 90 only
Stroke weights  choose two: 10 and 20 units, aligned INSIDE (Chapter 4)
\`\`\`

Then use the Chapter 4 toolkit: primitives, Shape Builder, and the fewest anchors that describe the form. A mark assembled from true circular arcs on a 10-unit grid reads as *designed*. The same shape drawn by eye reads as *sketched*, however much you polish it afterwards.

### Black first, colour last

Draw in flat black on white until the form is resolved. Colour is the easiest thing to change and the most seductive thing to hide behind — a weak silhouette wrapped in a nice gradient still collapses on the day it is stitched in one thread. Resolve the shape, then decide the palette.

### The test sheet

Before showing anyone anything, build one artboard that abuses the mark:

\`\`\`text
120 mm wide        is the internal detail earning its place at large size?
18 mm wide         business-card scale - PRINT it, do not judge on screen
32 px and 16 px    app icon and favicon
Gaussian Blur 6 px silhouette test: still recognisable as a blob?
Inverted, white on black      do the counters fill in and close up?
100% K, no gradient           the one-colour test
Photocopied once              the cruellest and most honest test there is
\`\`\`

The blur test is the squint test from Chapter 5 applied to a mark. If two of your concepts blur into the same grey lozenge, they are the same concept and you have two routes, not three.

### Present three, not thirty

Three genuinely different routes, each shown in context — on a sign, a card, an app icon, a shirt — each with one sentence of reasoning. Thirty options tell the client you had no opinion, and they invite design by committee: "the third one, with the colour from the seventh, and the icon from number nineteen."

### The classic mistake

Designing at 400 mm on a 27-inch screen and never once looking at the mark at 18 mm. Every hairline you love at full screen turns to mud at card size, and you find out after the cards are printed. Keep an 18 mm copy parked on the artboard from the first hour and glance at it every time you change something.
        `),
        lesson('The Logo System: Lockups, Clear Space, and Minimum Size', 13, `
One logo file is not a deliverable. A mark that exists in a single lockup breaks the first time somebody needs it in a 4:1 banner slot, a square avatar, or a one-colour stamp — and what they do at that moment is stretch it.

### The family you actually ship

| Variant | What it is | Where it goes |
|---|---|---|
| **Primary lockup** | Icon plus wordmark, usually horizontal | Website header, letterhead, default use |
| **Stacked** | Icon above wordmark | Narrow columns, square spaces, tote bags |
| **Wordmark only** | Type alone | When the icon already appears nearby |
| **Icon only** | The mark alone | App icon, favicon, social avatar, cap embroidery |
| **One-colour black / white** | Flattened, no gradients, no tints | Stamps, foil, engraving, single-ink print |
| **Reversed** | Tuned for dark backgrounds | Photography, dark UI, apparel |

Reversed is not simply the primary recoloured white. Optically, white shapes on black look about 3–5% fatter than black on white, so thin strokes need trimming and tight counters need opening slightly or they close up on press.

### Clear space must be defined in the mark's own units

Never write "leave 10 mm around the logo". Ten millimetres is enormous on a business card and invisible on a van. Define the exclusion zone as a measurement taken **from the artwork**, so it scales automatically:

\`\`\`text
Let x = the cap height of the wordmark (or the width of the icon's stem)
Clear space = 1x on all four sides, minimum
Constrained layouts may use 0.5x - say so explicitly, or nobody will
\`\`\`

On the guidelines page, draw this as a shaded band with x labelled on the diagram, and put no millimetre figure anywhere near it.

### Minimum size is tested, not guessed

\`\`\`text
Print, primary lockup    18 mm wide   (proof on paper before you commit)
Print, icon only          8 mm wide
Screen, primary lockup   120 px wide
Screen, icon only         32 px, plus a hand-tuned 16 px version
\`\`\`

Below the minimum you **switch variant** rather than shrink: the icon replaces the lockup. The 16 px favicon is nearly always redrawn by hand — snapped to whole pixels, one detail deleted, strokes thickened — because automatic downscaling turns a 2 px stroke into a 0.6 px grey smear for exactly the reason Chapter 4 gave about the pixel grid.

### Colour, specified in every space that will be used

| Space | Value | Used by |
|---|---|---|
| HEX | #1F4FD8 | Web, email signatures |
| RGB | 31, 79, 216 | Screen, video |
| CMYK coated | 88, 66, 0, 0 | Offset and digital print |
| Pantone | 2728 C | Spot ink, merchandise |
| Vinyl | 3M 3630-157 | Signage and vehicle graphics |

Convert once from the master RGB using the soft-proof process in Chapter 1, then publish those numbers as the single truth. Let each supplier convert for themselves and you get four different blues on four different items, all of which the client will see side by side on the same day.

### The small print everyone forgets

- The **™ or ®** symbol has one correct size and position — typically the wordmark cap height divided by three, aligned to the cap line — and it is drawn once into the artwork, not typed by whoever is building the ad.
- **Taglines live in a separate lockup.** Taglines change; wordmarks do not.
- Every delivered variant is outlined (Chapter 4), while the live-text master stays in your archive.

### The misuse page

Show the wrong versions with a cross through them: stretched, rotated, recoloured, drop-shadowed, dropped on a busy photo, re-typed in a lookalike font, icon and wordmark rearranged. This is the page non-designers actually read, and it prevents more damage than anything else in the document.

### The classic mistake

Clear space and minimum size written in absolute millimetres, and no icon-only variant in the kit. Six months later a sign maker scales the whole lockup to 9 mm because it was the only file in the folder, the tagline becomes a grey smudge, and everyone blames the printer. **The system is the deliverable, not the drawing.**
        `),
        lesson('Packaging the Handoff: Formats, Naming, and Mockups', 13, `
The client cannot open your .ai file, and their web developer does not want it. A handoff is a set of files sorted by **who receives them**, not by what you happen to have on disk.

### Who gets what

| Recipient | Give them | Never |
|---|---|---|
| Web developer | SVG plus a favicon set (16, 32, 180, 512 px) | AI or EPS |
| Printer, sign maker | PDF/X-4 or EPS, CMYK, outlined, with bleed | PNG |
| Office staff in Word and PowerPoint | Transparent PNG at 2x, plus a white-background JPEG | AI or EPS |
| Embroiderer, vinyl cutter | EPS or AI, one colour, outlined, strokes expanded | Anything raster |
| Social media manager | Square PNG at 1024 px, plus a safe-area guide | The full horizontal lockup |

Strokes matter for the cutter: run \`Object > Path > Outline Stroke\` (Chapter 4) before delivering, or a 2 pt line arrives as a zero-width path that the machine cannot follow.

### A folder the client can navigate without you

\`\`\`text
acme-brand-kit/
  01-logo-vector/       acme-logo-primary.svg .eps .pdf
                        acme-logo-stacked.svg .eps .pdf
                        acme-icon.svg .eps .pdf
  02-logo-web-png/      acme-logo-primary@1x.png @2x.png @3x.png
                        acme-icon-32.png  acme-icon-512.png  favicon.ico
  03-logo-onecolour/    acme-logo-black.eps  acme-logo-white.eps
  04-colour-and-type/   acme-palette.pdf  font-licence-links.txt
  05-guidelines/        acme-brand-guidelines.pdf
  06-source-editable/   acme-logo-master.ai   (live text, build layer intact)
\`\`\`

Names are lowercase, hyphenated, no spaces, no version numbers, no dates. \`acme-logo-primary.svg\` survives being emailed around a company for five years; \`Logo FINAL v3 (2).ai\` does not survive a fortnight.

### SVG that survives being pasted into a page

Chapter 5 covered the export settings. These are the things that break afterwards:

- **Fit the artboard to the art** first (\`Object > Artboards > Fit to Artwork Bounds\`). Otherwise Illustrator writes a clip path around the old artboard and the logo arrives in the layout as a huge box of mostly empty space.
- **Keep the viewBox.** Without it, CSS cannot scale the file.
- **ID collisions.** Two SVGs inlined on one page both containing \`id="a"\` means the second one references the first one's gradient, and a logo turns black. Export with Object IDs set to **Unique** rather than Minimal whenever two files may share a page, and give each file a unique prefix.
- **currentColor.** Hand-edit a one-colour icon so its fill reads \`currentColor\`, and it inherits the surrounding text colour instead of needing a new file per theme.
- **Outline the type**, or the SVG renders in whatever font the visitor happens to have.

### Mockups that sell without lying

Build presentation mockups with Smart Objects and **Replace Contents** (Chapter 2), so the whole board updates in one click when the client asks to see it without the tagline. Two or three contexts is plenty: a sign at the size it will really be, a card at 85 × 55 mm, an app icon at 120 px. A logo rendered 400 mm wide on a business card mockup is not a presentation, it is a promise you cannot keep.

### Fonts are licensed to you, not to them

Your desktop licence covers your machine. Sending the .otf file to a client is redistribution, and it is the most common licence breach in the industry. Two honest options:

1. Send the exact foundry link and the number of seats they need to buy, so it becomes a purchase order rather than a favour.
2. Specify an open-licence family — Inter, Source Sans 3, Libre Franklin — as the internal-documents fallback, and state clearly which family is used where.

Outlining the logo files removes the problem for the logo itself. It does nothing for the letters, decks and posters they will make next month.

### The classic mistake

Sending one \`logo.jpg\` on a white background. JPEG has no transparency, and its compression fuzzes exactly the kind of hard flat-colour edge a logo is made of. Someone puts it on a coloured slide, a white rectangle appears behind the mark, and the office manager forwards that same file to a printer. Ship vector plus transparent PNG, every time, and the question never comes up.
        `),
      ],
      [
        q('Brand guidelines state: leave 10 mm of clear space around the logo. Why is that specification broken?', [
          'Clear space should always be exactly one third of the logo width',
          'Clear space must scale with the mark, so it has to be defined in units taken from the artwork itself',
          '10 mm is too small for any application',
          'Clear space rules only apply to print, not to screen',
        ], 1, 'A fixed millimetre value is enormous on a business card and invisible on a van, whereas a zone defined as 1x the cap height stays correct at every size.'),
        q('A 16 px favicon made by scaling the full lockup down looks like a grey smudge. What is the professional fix?', [
          'Export it as JPEG at maximum quality instead of PNG',
          'Increase the export resolution to 300 ppi',
          'Add a drop shadow so the edges separate from the background',
          'Redraw a dedicated 16 px icon-only version, snapped to whole pixels with thicker strokes',
        ], 3, 'At 16 px a 2 px stroke lands on a fraction of a pixel, so a favicon has to be hand-built on the pixel grid rather than downscaled.'),
        q('The client administration team needs the logo for Word documents and PowerPoint decks. What do you send them?', [
          'The layered .ai master so they can adjust it themselves',
          'An EPS, since it is the most universal print format',
          'A transparent PNG at 2x, plus a white-background JPEG for anyone who needs one',
          'The SVG alone, since vector is always the better choice',
        ], 2, 'Office refuses AI outright and has blocked EPS since 2018, and while current builds do place SVG, the files get forwarded to people on older versions, Google Slides and email clients; a transparent PNG plus a white-background JPEG works everywhere without explanation.'),
        q('Why draw a new mark in flat black on white before choosing any colour?', [
          'If the silhouette does not work, no palette can rescue it, and the mark must survive one-colour reproduction anyway',
          'Black artwork exports faster from Illustrator',
          'Colour cannot be added to vector shapes after the paths are closed',
          'Printers charge less for artwork that was designed in black',
        ], 0, 'Colour is the easiest variable to change and the easiest to hide behind, so resolving the form in one flat value tests the idea where it is weakest.'),
      ]
    ),
    chapter(
      'Production Reality: Colour, Preflight, and Speed',
      'Why the same file looks different on three machines, how to diagnose a job that printed wrong, and how to keep heavy documents fast and recoverable.',
      [
        lesson('Colour Management: Profiles, Assign versus Convert, and Proofs That Match', 14, `
Two files can hold identical RGB numbers and be different colours. The numbers mean nothing on their own; they only acquire a meaning when a **profile** says which red 237 refers to. Colour management is the discipline of making sure that profile travels with the file and is honoured at every step.

### Three profiles are in play at once

- **Document profile** — embedded in the file. It defines what the numbers mean.
- **Working space** — the application default, used for new documents and for untagged files.
- **Monitor profile** — produced by calibrating your screen. It describes your display, not your file.

Change the monitor profile and the file is unchanged; change the document profile and the file itself now means something different. Confusing those two is where most colour arguments start.

### Assign versus Convert

| Command | The numbers | The appearance |
|---|---|---|
| \`Edit > Assign Profile\` | Unchanged | **Changes** |
| \`Edit > Convert to Profile\` | **Changed** | Preserved as closely as the destination allows |

Worked example. A postbox red in sRGB is R237 G28 B36.

\`\`\`text
Assign Adobe RGB (1998)     numbers stay 237, 28, 36
                            interpreted in a wider space -> displays MORE saturated
Convert to Adobe RGB (1998) numbers become roughly 204, 34, 40
                            still looks like the same postbox red
\`\`\`

Use **Assign** only to repair a file that arrived untagged or tagged wrongly. Use **Convert** for everything else. Assigning when you meant to convert is what turns a whole folder of images muddy or garish in one action.

### Colour Settings, set once and synchronised

\`\`\`text
Edit > Color Settings        (Shift+Cmd/Ctrl+K)
  Settings          Europe Prepress 3   /   North America Prepress 2
  RGB working       sRGB IEC61966-2.1 for screen work
                    Adobe RGB (1998) only if the whole pipeline supports it
  CMYK working      the press profile: ISO Coated v2, FOGRA39, or US Web Coated SWOP
  Policies          Preserve Embedded Profiles (all three)
  Tick              Ask When Opening - both Profile Mismatch and Missing Profile
\`\`\`

Then open Bridge and use \`Edit > Color Settings\` there to synchronise Photoshop, Illustrator and InDesign. Three applications disagreeing about the working space is a silent, recurring source of colour drift between a logo and the photograph next to it.

### Calibrate, or stop guessing

Eyeball adjustment changes the monitor; it does not build a profile, so nothing else on the machine knows what you did. A hardware calibrator costs about the same as one reprint:

\`\`\`text
White point   D65 (6500 K)
Luminance     100-120 cd/m2 in a dim room; 160 is far too bright and you
              will consistently deliver files that print too dark
Gamma         2.2
Recalibrate   monthly - panels drift
\`\`\`

### Converting a job to CMYK, once

\`\`\`text
1. Finish all editing in RGB, 16-bit (Chapter 3)
2. Duplicate and flatten a copy - keep the layered master untouched
3. Edit > Convert to Profile
     Destination  the printer's profile, named explicitly
     Engine       Adobe (ACE)
     Intent       Relative Colorimetric + Black Point Compensation
                  (Perceptual for photograph-heavy work, Chapter 1)
4. Soft proof and check the darkest areas for total ink
5. Convert to 8-bit, then export the delivery file
\`\`\`

\`Image > Mode > CMYK Color\` silently uses whatever the working CMYK space happens to be, which may not be the press profile at all. \`Convert to Profile\` makes you name the destination out loud, which is why it is the professional habit.

### The classic mistake

Converting twice. RGB to CMYK for a proof, that CMYK back to RGB for the website, then to CMYK again for the reprint. Every round trip clips out-of-gamut colour and none of it returns, so the brand orange arrives progressively chalkier at each stage. **Keep one RGB master. Every CMYK file is a derivative, never a source.**
        `),
        lesson('Preflight Forensics: Diagnosing a File That Printed Wrong', 14, `
The proof comes back with a white box around the logo, or the body text has a cyan halo, or an element is simply missing. Each of those symptoms has a small number of causes, and all of them are visible before the job goes to press if you look with the right tool.

### The microscope: Output Preview

\`\`\`text
Acrobat Pro > Print Production > Output Preview
  Simulation Profile      the press profile the job will run on
  Simulate Overprinting   ON  (nothing below is meaningful without it)
  Separations             click each plate off to see what actually sits on it
  Total Area Coverage     set 300% - anything over the limit highlights
\`\`\`

Inside Illustrator the equivalent is \`Window > Separations Preview\`, and in InDesign \`Window > Output > Separations Preview\`. Preview, Chrome and the Windows PDF viewer honour none of this, which is precisely why a file that looks perfect on your desktop can print wrong.

### Symptom, cause, fix

| Symptom on the proof | Cause | Fix |
|---|---|---|
| Small text has a cyan or magenta fringe | Rich or registration black used on fine type (Chapter 1) | Restate to **100% K only** |
| An element vanished completely | A **white object set to overprint** — overprinted white prints nothing | Attributes panel, untick Overprint Fill |
| Pale grey panel behind the artwork | A stray white-filled box, or transparency flattened against a spot colour | Delete the box; re-export as PDF/X-4 |
| Soft shadow broke into stitched rectangles | Transparency flattening in PDF/X-1a | Export **PDF/X-4**, which keeps live transparency |
| Thin rules missing or broken | Stroke below about 0.25 pt | 0.25 pt minimum, 0.5 pt if it is a tint |
| A placed image is soft | Effective ppi below 300 at final scale (Chapter 5) | Replace the image or reduce the scale |
| Courier appears where your font was | Font not embedded, or licence forbids embedding | Outline it, or use a font licensed for embedding |
| Colour shifted after export | Wrong output intent, or the file went out untagged | Re-export naming the correct destination profile |
| A soft-edged logo prints chunky | Document Raster Effects still at 72 ppi (Chapter 1) | Set 300 ppi, then re-render the effect |

### The spot colour audit

Open the Swatches panel and look for near-duplicates. A job carrying \`PANTONE 2728 C\`, \`Pantone 2728 C\` and \`Blue\` is a seven-plate print, and the quote was for four. Merge them: select the duplicates, use the Swatches panel menu to merge into one, and confirm in Separations Preview that only the plates you intend are listed.

### Ink limits

\`\`\`text
Registration black  C100 M100 Y100 K100  =  400%  never use it as a fill
Rich black          C60  M40  Y40  K100  =  240%  safe on coated stock
Coated limit        300-330%
Uncoated            270-300%
Newsprint           240%
\`\`\`

Over the limit the sheet cannot dry: ink transfers onto the back of the next sheet coming off the press, the stack blocks together, and the job is scrapped. Registration black is a mark colour for crop marks, not a design colour.

### The five-minute preflight ritual

1. \`File > Package\` — it reports missing links and missing fonts instantly, and it is faster than checking by hand.
2. Links panel: nothing missing, nothing modified, every effective ppi at or above 300.
3. Swatches: no unused spots, no RGB swatches left in a CMYK document.
4. Bleed 3 mm on every edge that carries artwork; text 5 mm inside the trim (Chapter 5).
5. Export, then **reopen the exported PDF** and inspect it in Output Preview at 400% zoom.
6. Print one page on the office laser at 100% scale and read it on paper. Errors you have looked past for three days become obvious in ten seconds.

### The classic mistake

Trusting the exported PDF because it opened correctly in the system previewer. That previewer ignores overprint, approximates spot colours and knows nothing about ink limits, so it shows you a file that does not exist. **Approve nothing you have not seen in Overprint Preview.**
        `),
        lesson('Speed, Versioning, and Getting Your Work Back', 13, `
Large documents are not slow by nature. They are slow because of four or five specific, fixable causes — and the same file hygiene that keeps them fast is what lets you recover them when something goes wrong.

### Why Photoshop crawls

- **Scratch disk.** Photoshop writes a temporary working file to disk and needs roughly three to four times the document size free. "Scratch disks are full" is a message about **disk space, not RAM**. In \`Preferences > Scratch Disks\` put the first scratch on your fastest internal drive and keep 20% of it free.
- **History States.** The default is fine for small files; on a 2 GB composite each state is expensive. Drop to **20** in \`Preferences > Performance\` and set Cache Levels to 6 for large documents, 2 for small web work.
- **Bit depth.** 16-bit doubles memory and scratch traffic. Keep the retouch in 16-bit, convert to 8-bit before you build a hundred-layer composite on top of it.
- **Embedded Smart Objects.** Each one stores a full copy of its source, so twenty embedded 40 MB raw files is an 800 MB PSD. Use **linked** Smart Objects for anything reused.
- **Maximize Compatibility.** Untick it in \`Preferences > File Handling\` and PSDs shrink 30–50%, because Photoshop stops writing a flattened composite alongside the layers. The cost is that older apps and some placement workflows can no longer read a preview, so leave it on for files you hand to InDesign.
- \`Edit > Purge > All\` frees the undo and clipboard buffers immediately, and it cannot be undone.

### Why Illustrator crawls

- **Document Raster Effects at 300 ppi on a two-metre artboard.** Every drop shadow is rendering an enormous bitmap on each redraw (Chapter 1). Work at 72 ppi and raise it just before export if the artboard is huge.
- **Anchor point count.** Image Trace output routinely carries thousands of points; \`Object > Path > Simplify\` (Chapter 4) often removes 80% of them and improves the shape.
- **Embedded images.** Link instead of embedding, and the .ai file stops carrying every photograph inside it.
- **Gradient meshes and long blends.** Reduce blend step counts and expand meshes only when final.
- \`View > Outline\` (\`Cmd/Ctrl+Y\`) draws paths as wireframes and makes an unusable document usable while you work.
- Clear unused assets: each of the Swatches, Brushes and Symbols panel menus has a **Select All Unused** command.

### Versioning that survives a client

\`\`\`text
acme-poster_v01.ai
acme-poster_v02.ai
acme-poster_v03_client-approved.ai
acme-poster_v04_print.ai
\`\`\`

Never "final", "final2", "FINAL-USE-THIS". Save a **new version number before every irreversible step**: flattening, Create Outlines, running Pathfinder on the only copy of your shapes, converting to CMYK. That habit costs two seconds and has saved every designer at least one all-nighter.

### Autosave and recovery

- **Photoshop.** \`Preferences > File Handling > Automatically Save Recovery Information\`, set to 5 minutes. Recovery files are discarded on a clean quit, so after a crash reopen Photoshop **before** doing anything else — it offers the recovered document on launch and only on launch.
- **Illustrator.** \`Preferences > File Handling > Data Recovery\`, every 2 minutes, and untick "Turn off data recovery for complex documents" — complex documents are exactly the ones you cannot afford to lose.
- **History snapshots.** Click the camera icon in the History panel before any destructive step. Snapshots let you jump back past the 20-state limit, but none of it survives closing the file.

### The classic mistake

Working live on a big PSD inside a synced cloud folder. The sync client grabs the file mid-write, you get "conflicted copy" duplicates, and eventually a PSD that will not open at all. Work on a local drive, and let the sync happen when you save a milestone version. The same applies to a network share: Adobe supports neither for live editing, and the corruption always arrives on the day of the deadline.
        `),
      ],
      [
        q('A photograph tagged sRGB looks correct. You choose Edit > Assign Profile and pick Adobe RGB (1998). What happens?', [
          'The pixel values are recalculated so the image looks the same as before',
          'Nothing changes until the file is exported',
          'The pixel values stay identical but are now interpreted in a wider space, so the image displays more saturated',
          'The document is converted to CMYK using the working space',
        ], 2, 'Assign changes the meaning of the numbers without altering them, so appearance shifts; only Convert recalculates values to preserve appearance.'),
        q('A white logo sitting on a coloured panel disappeared entirely on the printed proof. What is the most likely cause?', [
          'The white object was set to overprint, and overprinted white lays down no ink at all',
          'The logo was placed as an RGB image in a CMYK document',
          'The effective resolution of the logo fell below 300 ppi',
          'The PDF was exported without trim marks',
        ], 0, 'Overprint tells the RIP to print the object on top of what is beneath instead of knocking out, and since white is the absence of ink the object simply vanishes.'),
        q('Photoshop reports "Scratch disks are full" while you still have plenty of RAM free. What does it actually mean?', [
          'The History States value is set too high',
          'The document exceeds the 2 GB PSD limit and needs saving as PSB',
          'Too many Smart Objects are embedded in the file',
          'The drive Photoshop uses for its temporary working file has run out of space',
        ], 3, 'The scratch disk is disk storage, not memory, and Photoshop needs roughly three to four times the document size free on it regardless of how much RAM is available.'),
        q('A designer fills a large background panel with C100 M100 Y100 K100. What goes wrong on press?', [
          'The panel prints as a washed-out dark grey',
          'Total ink coverage hits 400%, so the sheet cannot dry and ink offsets onto the next sheet',
          'The panel separates onto a spot plate and adds a fifth colour',
          'The black knocks out any text placed on top of it',
        ], 1, 'Registration black is four full plates of ink well beyond the 300% limit of coated stock, which causes set-off and blocking rather than a richer black.'),
      ]
    ),
  ],
  final: [
    q('A client needs their logo embroidered on uniforms and cut from vinyl for a shopfront. What must you supply?', [
      'A 300 ppi PNG with a transparent background',
      'Vector artwork, because both machines follow paths rather than pixels',
      'A layered PSD at the largest size required',
      'A CMYK JPEG at 600 ppi',
    ], 1, 'Embroidery and vinyl cutters trace geometry, so only true vector outlines can drive them at any size.'),
    q('You are setting up an A4 flyer for offset print with 3 mm bleed at 300 ppi. What canvas size do you create in Photoshop?', [
      '210 x 297 mm at 300 ppi, adding bleed on export',
      '2480 x 3508 px, which is A4 at 300 ppi',
      '210 x 297 mm at 72 ppi, raising the resolution afterwards',
      '216 x 303 mm, which is 2551 x 3579 px at 300 ppi, with guides marking the trim',
    ], 3, 'Photoshop has no bleed field, so the canvas itself must include 3 mm on every edge and guides mark where the trim will fall.'),
    q('Your brand green looks electric on screen and dull on the printed proof. What explains it?', [
      'The green sits outside the smaller CMYK gamut, so the press maps it to the nearest printable colour',
      'The image resolution was too low for saturated colour',
      'The PDF was exported without trim marks',
      'The monitor is displaying in 8-bit rather than 16-bit',
    ], 0, 'CMYK inks cannot reproduce the most saturated RGB colours, so out-of-gamut values are compressed or clipped at conversion.'),
    q('Which approach lets you change the strength of a colour correction two weeks later?', [
      'Image > Adjustments > Curves applied to the flattened image',
      'Duplicating the layer, correcting it, then merging down',
      'A Curves adjustment layer, clipped and masked as needed',
      'Saving separate JPEG versions at each stage',
    ], 2, 'An adjustment layer stores the correction as live settings with its own mask, so it stays editable indefinitely.'),
    q('You paint mid-grey onto a layer mask. What happens to that part of the layer?', [
      'It is deleted permanently',
      'It becomes partially transparent',
      'It is fully hidden',
      'Its blend mode changes to Multiply',
    ], 1, 'Mask values map directly to opacity: white shows, black hides, and every grey between produces partial transparency.'),
    q('Why convert a layer to a Smart Object before applying Gaussian Blur?', [
      'The blur becomes a Smart Filter with editable settings and its own mask',
      'Smart Objects render filters faster',
      'Gaussian Blur cannot be applied to ordinary layers',
      'It converts the layer to 16-bit automatically',
    ], 0, 'Filters on a Smart Object are stored as re-editable instructions rather than being baked into the pixels.'),
    q('A composite has a perfect cutout but still reads as fake. Which pair of problems is most likely?', [
      'The document is RGB and the file is 8-bit',
      'The mask feather is 0 px and the layer is not grouped',
      'The subject layer sits above the background and uses Normal blend mode',
      'There is no contact shadow and the subject sharpness or grain does not match the background',
    ], 3, 'Believability comes from light and camera character; a missing shadow and mismatched sharpness or noise betray the edit regardless of mask quality.'),
    q('Where should anchor points and their handles be placed when drawing a smooth curve?', [
      'Evenly spaced along the whole path for consistency',
      'At every change in the outline, adding points until it looks smooth',
      'At the extremes of the form, with handles perpendicular to the shape and as few anchors as possible',
      'Only at corners, letting Illustrator infer the curves',
    ], 2, 'Extreme placement with perpendicular handles produces true arcs, while extra anchors introduce wobble and slow every later edit.'),
    q('You are setting a small all-caps label under a large headline. What tracking treatment does each want?', [
      'Open the all-caps up by roughly +50 to +100 and tighten the headline by roughly -10 to -25',
      'Tighten both, since tight tracking always looks more modern',
      'Open both up equally to keep the page consistent',
      'Leave both at zero, because tracking should never be adjusted manually',
    ], 0, 'Capitals at small sizes crowd and need extra space, while large display type has too much built-in spacing and needs tightening.'),
    q('Which export settings are correct for a commercial print job on a modern RIP?', [
      'JPEG at maximum quality, RGB, 300 ppi',
      'PNG-24 with transparency at 300 ppi',
      'PDF exported from a web preset with sRGB and no marks',
      'PDF/X-4 with fonts embedded, 3 mm bleed, trim marks offset 3 mm, converted to the press CMYK profile',
    ], 3, 'PDF/X-4 carries embedded fonts, bleed, marks and a defined output intent, which is exactly what a press needs to reproduce the file predictably.'),
    q('A brand guidelines page specifies clear space around the logo as 10 mm on all sides. What is wrong with that rule?', [
      'Clear space is only needed on the left and right of a horizontal lockup',
      '10 mm is smaller than any printer can hold to',
      'Clear space has to scale with the mark, so it must be expressed in units taken from the artwork such as 1x the cap height',
      'Clear space should be measured from the bounding box rather than the artwork',
    ], 2, 'A fixed millimetre value is huge on a card and invisible on a billboard, whereas a zone defined in units taken from the artwork itself stays correct at every reproduction size.'),
    q('The client administration team needs the logo for Word and PowerPoint. Which deliverable is correct?', [
      'A transparent PNG at 2x, plus a white-background JPEG for anyone who needs one',
      'The layered .ai master file',
      'An EPS, since it is the standard print format',
      'A PDF/X-4 export with bleed and trim marks',
    ], 0, 'Office refuses AI and has blocked EPS since 2018, and a PDF/X-4 press file is the wrong artefact entirely, so a raster file with an alpha channel is the deliverable that works in every version of Word and PowerPoint.'),
    q('A soft drop shadow over a spot-coloured panel came back from the printer as a grid of stitched rectangular patches. What caused it?', [
      'The shadow was built at 72 ppi instead of 300 ppi',
      'The spot colour was set to overprint',
      'Total ink coverage exceeded 300% under the shadow',
      'Transparency was flattened on export, which happens with PDF/X-1a but not with PDF/X-4',
    ], 3, 'PDF/X-1a has no live transparency, so the RIP receives the shadow chopped into opaque atomic regions; PDF/X-4 keeps the transparency intact.'),
    q('You have a finished RGB master and need both a web JPEG and a CMYK press PDF. What is the safe workflow?', [
      'Convert the master to CMYK first, then convert that file back to RGB for the web version',
      'Keep the RGB master as the single source and derive each output from it with one conversion',
      'Work in CMYK throughout and let the browser handle the difference',
      'Export both from the same CMYK file, since CMYK is the more restrictive space',
    ], 1, 'Every conversion clips out-of-gamut colour permanently, so each deliverable should be one conversion away from a single untouched RGB master.'),
  ],
});
