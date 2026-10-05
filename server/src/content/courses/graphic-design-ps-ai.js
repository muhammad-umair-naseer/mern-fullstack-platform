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
        `,
        [
          q('A supplier emails an .ai file for the client logo, but the printer replies that they still have no vector artwork. What is the fastest way to confirm what you were actually sent?', [
            'Check that the file opens in Illustrator rather than in Photoshop',
            'Check that the document colour mode is CMYK rather than RGB',
            'Try to select an anchor point on the mark with the Direct Selection tool',
            'Check the file size, since real vector logos stay under 100 KB',
          ], 2, 'An .ai file is only a container, so a placed JPEG inside it is still raster; if the Direct Selection tool cannot grab an anchor point on the mark, there is no vector geometry to scale.'),
          q('A logo drawn entirely with paths in Illustrator prints with a visibly chunky, stair-stepped drop shadow, even though every edge of the mark itself is razor sharp. What explains it?', [
            'Drop Shadow is a raster effect, and the document was rendering it at 72 ppi',
            'The shadow colour fell outside the CMYK gamut and was clipped by the RIP',
            'The paths were simplified, so the shadow followed a lower anchor count',
            'The stroke was aligned to the centre of the path instead of to the inside',
          ], 0, 'Drop Shadow, Feather and Gaussian Blur are rendered as pixels at whatever Document Raster Effects Settings says, so a file started from a web preset outputs soft edges at 72 ppi.'),
          q('Which of these jobs must be built in Illustrator, even when the designer is far more fluent in Photoshop?', [
            'A poster where a single full-bleed photograph fills the whole page',
            'A painterly illustration that depends on visible brush texture',
            'A composite of three photographs shot on the same afternoon',
            'A mark that gets embroidered on polo shirts and cut in sign vinyl',
          ], 3, 'Embroidery machines and vinyl cutters follow paths rather than pixels, so anything destined for them has to exist as scalable vector geometry from the start.'),
        ]
      ),
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
        `,
        [
          q('A client asks whether the 3000 x 2000 px photograph they just sent counts as high resolution. What is the only honest answer?', [
            'Yes, because 3000 px is comfortably above the 300 ppi standard',
            'It depends entirely on how large the image is going to be printed',
            'No, unless the file metadata has already been set to 300 ppi',
            'Yes for print, but it has to be resampled before any screen use',
          ], 1, 'Resolution is a ratio between pixel count and physical size, so the same 3000 px file is generous at 10 inches wide and useless at 40 inches wide.'),
          q('You open Image Size on a 72 ppi photograph, untick Resample, and type 300 into the resolution field. What actually changes in the file?', [
            'Photoshop interpolates roughly seventeen times more pixels into the image',
            'The image is cropped so that the printed dimensions stay the same',
            'Pixels are discarded until the file matches the new printed size',
            'Only the metadata: the printed size shrinks and the pixel count is untouched',
          ], 3, 'With Resample off the pixel grid is locked, so changing ppi just rewrites how big those existing pixels claim to be on paper.'),
          q('Why is a 14 x 48 ft billboard supplied at around 20 ppi rather than at 300 ppi?', [
            'Viewing distance is about 50 m, so extra pixels buy nothing and 300 ppi would run to billions of them',
            'Large format printers refuse any file above roughly 100 ppi',
            'Billboard vinyl absorbs ink and blurs out fine detail anyway',
            'The finished file has to stay under 26 GB to reach the RIP',
          ], 0, 'Target resolution follows viewing distance, and detail nobody can resolve from 50 m away only costs storage and processing time.'),
        ]
      ),
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
        `,
        [
          q('You are soft proofing a photograph where a large area of sky and a bright jacket both fall outside the press gamut. Which rendering intent usually holds the picture together best?', [
            'Saturation, because it keeps the out-of-gamut colours vivid',
            'Absolute Colorimetric, because it preserves the paper white point',
            'Perceptual, because it compresses the whole range so relationships survive',
            'Relative Colorimetric, because it clips each colour to the nearest printable one',
          ], 2, 'Perceptual shifts everything a little so the differences between neighbouring colours are preserved, which matters more than absolute accuracy when large photographic areas are unprintable.'),
          q('A JPEG exported from a document in Adobe RGB looks flat and desaturated once it is on the website. What fixes it?', [
            'Convert the document to CMYK before running Export As',
            'Convert to sRGB on export and keep the profile embedded',
            'Raise the JPEG quality setting from 8 to the maximum of 12',
            'Turn Proof Colors on before choosing Export As from the menu',
          ], 1, 'Browsers assume sRGB unless told otherwise, so wide-gamut numbers get displayed as if they were sRGB numbers and every saturated colour lands short.'),
          q('A brand green looks electric on screen but comes back as a flat garden green from three different printers. What is going on?', [
            'The artwork was exported below the resolution the press needed',
            'The rendering intent was left on Relative Colorimetric by mistake',
            'The green was accidentally built as a rich black mixture',
            'The colour sits outside the CMYK gamut, so no ink mix can reach it',
          ], 3, 'Cyan, magenta, yellow and black inks cannot physically produce the most saturated greens, so the only route to that colour on press is a pre-mixed spot ink.'),
        ]
      ),
            lesson('Choosing Colour: HSB, Harmony, and Contrast You Can Prove', 13, `
A fintech client signed off a palette from a slide deck: bright orange buttons, white labels, very confident. Six weeks later the accessibility audit failed every primary button in the product on one number. White text on that orange measures 2.9:1. The requirement for normal text is 4.5:1. Nothing about the palette was ugly. It was simply never measured.

### Think in HSB, not in hex

RGB and CMYK describe how a device manufactures a colour. **HSB** describes how a person perceives one: hue (0 to 360 around the wheel), saturation (0 to 100, how pure), brightness (0 to 100, how much light). Both Photoshop and Illustrator put HSB fields in the colour picker, and it is the only set of numbers where the instruction "make it a bit darker" is one slider.

| Role | Hex | RGB | HSB |
|---|---|---|---|
| Brand orange | #FF6A00 | 255, 106, 0 | 25, 100, 100 |
| Pressed state | #B34A00 | 179, 74, 0 | 25, 100, 70 |
| Disabled tint | #F5C199 | 245, 193, 153 | 26, 38, 96 |

One hue across all three rows. Only S and B moved. That is what makes a palette read as a family rather than three colours that happened to meet.

### Build a ramp, do not collect swatches

Pick one hue, then step brightness down in a predictable ladder and give every step a number you can name in a spec:

\`\`\`text
50   #FFF1E6    H25  S10   B100    page tint
100  #FFD9BF    H25  S25   B100    hover fill
300  #FFA766    H25  S60   B100    illustration
500  #FF6A00    H25  S100  B100    brand colour
700  #B34A00    H25  S100  B70     text on white, pressed states
900  #5C2600    H25  S100  B36     headings, dark UI
\`\`\`

Six values, one decision. Repeat for a neutral grey and one accent hue and the whole identity is nine swatches, which is roughly the point where a design stops arguing with itself.

### Harmony schemes, and the ratio that saves them

Analogous (neighbouring hues, 25 and 45 and 5) is calm and low risk. Complementary (25 and 205) is loud and needs a referee. Split complementary (25 with 185 and 225) keeps the energy while dropping the vibration you get from true opposites at full saturation.

Whatever scheme you choose, apply **60/30/10**: 60 percent of the area is the quiet dominant, 30 percent is the secondary, 10 percent is the accent that carries the call to action. Palettes fail on proportion far more often than on choice of hue.

### Contrast is arithmetic

Contrast ratio compares relative luminance, and you can compute it rather than argue about it:

\`\`\`js
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };

ratio([255, 106, 0], [255, 255, 255]); // 2.87  white on brand orange: fails
ratio([255, 106, 0], [26, 26, 26]);    // 6.06  near black on brand orange: passes
ratio([179, 74, 0], [255, 255, 255]);  // 5.39  white on the 700 shade: passes
\`\`\`

The thresholds worth memorising: **4.5:1** for body text, **3:1** for text at 24 px or 19 px bold, **3:1** for icons and the edges of interactive controls. Note what the numbers say about the failing button. You do not have to abandon the orange. You put near black text on it, or you use the 700 shade when white text is non-negotiable.

### The classic mistake

Judging a palette on a calibrated 27 inch display, in a dark room, at full screen. The same palette then ships to a phone held outdoors at 40 percent brightness, and every subtle tint collapses into the one next to it. Check the palette small, check it in greyscale (\`Image > Adjustments > Black & White\`), and check that any two swatches carrying meaning still differ once the colour is gone. Around 8 percent of men have some form of colour deficiency, which is a large slice of any audience to lose to a red and green status badge.
      `,
        [
          q('A button uses #FF6A00 with white labels and fails the 4.5:1 requirement at 2.87:1. Which change keeps the brand orange as the button fill?', [
            'Set the label to near black, which measures about 6:1 on that orange',
            'Add a 1 px white stroke around each letter of the label',
            'Reduce the saturation of the orange until the ratio rises',
            'Increase the label size so the 3:1 threshold applies to it',
          ], 0, 'Contrast is a relationship between two colours, so swapping the text to a dark value lifts the ratio above 4.5:1 while the fill colour stays exactly as the brand specifies.'),
          q('Why does stepping one hue through a ramp of brightness and saturation values produce a more coherent palette than picking six colours you like?', [
            'Ramps compress better in exported files and load faster',
            'Only ramped colours can be converted safely into CMYK',
            'Every step shares a hue, so the swatches read as one family',
            'Brightness steps guarantee a contrast ratio above 4.5:1',
          ], 2, 'Holding hue constant while moving only saturation and brightness is what makes the tints and shades look related instead of like separate colour decisions.'),
          q('A dashboard marks success in green and failure in red, at similar brightness. What does the greyscale check reveal?', [
            'That the greens will shift when the file is converted to CMYK',
            'That both states collapse to nearly the same grey, so colour is the only signal',
            'That the accent colour occupies more than 10 percent of the layout',
            'That the two hues sit too close together on the colour wheel',
          ], 1, 'Two hues at matching brightness become indistinguishable without colour, so viewers with a colour deficiency get no cue at all unless an icon or label carries the meaning too.'),
        ]
      ),
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
        `,
        [
          q('You paint a soft black pool on a layer beneath a product to ground it, and it reads as grey paint sitting on top of the table texture instead of as a shadow. What is missing?', [
            'The layer opacity needs raising so the shadow reads as properly dark',
            'The layer blend mode should be Multiply so the surface shows through',
            'The shadow layer belongs above the product layer rather than below it',
            'The brush flow should be 100 percent so the shadow edge stays crisp',
          ], 1, 'Multiply darkens whatever is underneath instead of covering it, so the wood grain or fabric weave still reads through the shadow the way real shadows behave.'),
          q('You have a smoke plume shot against a black studio backdrop and need it over a street scene. Which blend mode family does the work?', [
            'Darken family, using Multiply, because smoke behaves like a shadow',
            'Component family, using Color, so only the hue of the smoke carries over',
            'Contrast family, using Soft Light, because 50 percent grey stays neutral',
            'Lighten family, using Screen, because black drops out and becomes invisible',
          ], 3, 'Screen is the inverse of Multiply, so pure black contributes nothing and only the lighter smoke survives, which is exactly how flares, fire and smoke plates are composited.'),
          q('What does a clipping mask give you that a layer mask does not?', [
            'It borrows the shape of the layer below and updates when that shape changes',
            'It stores visibility as grey values that you can paint by hand',
            'It hides the layer styles while leaving the pixels fully visible',
            'It affects every layer below it in the stack at the same time',
          ], 0, 'A clipping mask is defined by the visible pixels of the layer underneath, so editing that shape automatically reshapes what the clipped layer reveals.'),
        ]
      ),
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
        `,
        [
          q('A subject cut from a bright sky shows a pale outline once it is placed on a dark background. Which fix rebuilds those edge pixels using the subject\'s own colour?', [
            'Layer > Matting > Defringe at a radius of 1 px',
            'Filter > Other > Minimum at 1 px applied to the mask',
            'Decontaminate Colors inside the Select and Mask workspace',
            'Shift Edge pushed to plus 10 percent in Select and Mask',
          ], 2, 'Decontaminate Colors replaces the contaminated semi-transparent edge pixels with colour sampled from inside the subject, rather than simply trimming them away.'),
          q('Why does setting Shift Edge to around minus 10 percent help a cutout sit convincingly on a new background?', [
            'It pulls the mask slightly inside the subject, which kills the old background halo',
            'It softens the mask so the transition reads as shallow depth of field',
            'It expands the mask so that no subject detail is lost at the boundary',
            'It raises mask contrast so semi-transparent pixels become fully solid',
          ], 0, 'The contaminated pixels live in the last row or two at the boundary, so choking the mask inward by a small percentage removes them before they can show as a fringe.'),
          q('Backlit hair against a bright sky defeats Select and Mask completely. What does the Channels approach do differently?', [
            'It rebuilds the missing hair with Content-Aware Fill from nearby pixels',
            'It converts the layer to a Smart Object so the mask stays re-editable',
            'It samples the sky with Color Range and then inverts the resulting selection',
            'It takes the channel with the most subject to sky contrast and forces it with Levels',
          ], 3, 'One of the red, green or blue channels always separates the subject from the background better than the composite, and pushing that channel with Levels turns it into a usable mask.'),
        ]
      ),
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
        `,
        [
          q('You add a strong S curve for contrast and the reds in the shot immediately look oversaturated. What do you change on the Curves layer?', [
            'Clip it to the layer directly beneath it in the stack',
            'Set its blend mode to Luminosity',
            'Reduce its Fill slider to about 60 percent',
            'Paint the mask black over the areas that shifted',
          ], 1, 'Luminosity mode lets the curve change brightness only and discards its effect on hue and saturation, which is why contrast stops dragging colour along with it.'),
          q('You hold Alt while dragging a Blend If slider and the handle splits into two halves. What has that bought you?', [
            'The setting now applies to the layer below instead of the current one',
            'The blend is converted into a permanent layer mask you can paint on',
            'A ramp between hidden and visible, so the blend has no jagged edge',
            'The effect is restricted to one channel rather than the composite grey',
          ], 2, 'An unsplit handle switches pixels on and off at a single value, which produces a crunchy edge, while the split pair fades between the two values for an invisible transition.'),
          q('Why do the brush, clone and healing tools refuse to paint directly on a Smart Object?', [
            'Its pixels are sealed inside a container, so the painting goes on a layer above',
            'Smart Objects hold vector data, and vector cannot accept brush strokes',
            'The Smart Filters already occupy the one editable slot on that layer',
            'The layer stays locked until you have run Replace Contents at least once',
          ], 0, 'The whole point of the container is that the source pixels are never altered, so Photoshop blocks any tool that would write into them and pushes the work onto a separate layer.'),
        ]
      ),
            lesson('Layer Styles and Shape Layers: Vector Inside Photoshop', 13, `
A designer builds an app store badge at 512 px with a 6 px stroke and a soft drop shadow, then scales the layer to 25 percent for a favicon test. The artwork shrinks. The stroke does not. What was a tidy 6 px outline is now a fat ring swallowing the icon, and the shadow looks like it belongs to a different file. Layer styles do not scale with Free Transform, and that single fact catches people for years.

### A style is a rule, not pixels

Double-click a layer and you open the Layer Style dialog. Everything in it is stored as parameters attached to the layer, recalculated live from whatever pixels the layer currently holds. Change the text, and the stroke redraws around the new letterforms by itself.

| Effect | Real use | Watch for |
|---|---|---|
| Stroke | Outline type, badge rims, ghost buttons | Position Inside keeps corners tight; Outside rounds them |
| Color Overlay | Recolour an icon without touching its pixels | It covers the layer's own colour completely |
| Gradient Overlay | Metal, glass, subtle depth on a flat shape | Tick Dither or 8-bit gradients band |
| Inner Shadow | Inset fields, pressed states, stamped type | Size above about 8 px reads as fake bevel |
| Drop Shadow | Lift a card off the page | Distance 0 with a large Size is usually the honest look |

The order in the dialog is fixed, and it is a stacking order: Stroke sits over Gradient Overlay, which sits over Color Overlay. If a gradient will not show, an overlay above it is winning.

### Global Light moves every shadow at once

Drop Shadow, Inner Shadow and Bevel all offer a **Use Global Light** checkbox, ticked by default. Change the angle on one layer with it ticked and every other layer using Global Light rotates with it. That is the feature working correctly, and it is also why a file where one card's shadow was nudged suddenly has thirty shadows pointing the wrong way. Untick it on the one layer that genuinely needs a different angle.

### Shape layers are real vector

Draw with the Rectangle or Custom Shape tool with the mode dropdown set to **Shape** rather than Pixels, and you get a vector path with a fill and a stroke, editable with the Direct Selection tool exactly as in Illustrator.

\`\`\`text
Shape mode gives you:
  live corner radius in the Properties panel (per corner, typed in px)
  a stroke with Align, Cap, Join and a dashed-line editor
  path operations: Combine, Subtract, Intersect, Exclude
  crisp edges at any scale, because it renders from geometry
\`\`\`

Use it for every UI element, badge, arrow and container. A 24 px rounded rectangle drawn as a shape layer survives being pushed to 240 px for a presentation. The same shape painted with a filled selection does not.

### The fix for the scaling problem

Three ways out, in order of how much you should like them:

\`\`\`text
1. Convert to Smart Object first, then transform.
   Styles live inside the container and scale with everything else.
2. Layer > Layer Style > Scale Effects, and type the same percentage
   you used on the transform (25% here). Fast, but manual and easy to forget.
3. Rebuild the style at the new size. Reliable, slow, occasionally the
   only option on inherited files where the styles are already wrong.
\`\`\`

### Reuse the stack, do not rebuild it

Right-click a styled layer and choose **Copy Layer Style**, then select six other layers and Paste Layer Style onto all of them at once. Save the combination into the **Styles** panel and it becomes a one-click preset for the rest of the project. Alt-drag the small fx icon between layers to copy a style, and plain drag to move it.

### The classic mistake

Handing over a PSD where a style is doing something nobody can reproduce, then flattening it under deadline pressure. When another tool has to receive the artwork, use \`Layer > Layer Style > Create Layers\`, which explodes the effects into ordinary layers and clipping groups you can inspect. Do it on a duplicate. That conversion is one way, and the moment it runs, the live parameters are gone.
      `,
        [
          q('You scale a styled badge layer from 512 px to 25 percent with Free Transform and the stroke stays enormous. Which approach prevents this before the transform?', [
            'Set the stroke position to Inside rather than Outside',
            'Reduce the layer Fill to 25 percent along with the scale',
            'Rasterise the layer style so it behaves like pixels',
            'Convert the layer to a Smart Object, so the style scales inside it',
          ], 3, 'Transforming a Smart Object scales its entire contents, styles included, whereas transforming a normal layer only resamples pixels and leaves style parameters at their original values.'),
          q('You rotate the Drop Shadow angle on one card and every other shadow in the document turns with it. What caused that?', [
            'The shadows were pasted from the same layer style preset',
            'Use Global Light was ticked, so those layers share one angle',
            'The layers sit in one group, and groups share blending options',
            'The document was set to a single light source in Colour Settings',
          ], 1, 'Global Light is a document-wide angle shared by every effect that opts into it, which keeps a design consistent but propagates any change you make on one layer.'),
          q('Why draw a UI container as a Shape layer rather than filling a rectangular selection with colour?', [
            'Shape layers accept layer styles, and pixel layers do not',
            'Pixel layers cannot be grouped or clipped in the Layers panel',
            'It renders from geometry, so it stays crisp and keeps live corner radii',
            'Shape layers export to PNG at a higher bit depth than pixel layers',
          ], 2, 'A Shape layer stores a path rather than a grid of pixels, so it can be rescaled without interpolation and its corner radius, stroke and dashes stay adjustable by number.'),
        ]
      ),
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
        `,
        [
          q('You remove a small mark that sits right beside a dark hairline, and the repair leaves a smeared dark trail running out of the edge. What happened, and what fixes it?', [
            'The Healing Brush blended across the edge, so clone parallel to it instead',
            'The brush hardness was too high, so lower it and heal the area again',
            'Sample was not set to All Layers, so the tool had nothing to sample from',
            'Content-Aware Fill needs a wider lasso margin around the area being repaired',
          ], 0, 'Healing tools average tone from the surrounding pixels, so anywhere near a strong boundary they drag dark values into light ones, which is exactly what the Clone Stamp avoids.'),
          q('Why build dodge and burn on a 50 percent grey layer set to Soft Light rather than using the Dodge and Burn tools on the image?', [
            'The tools are only available on 8-bit documents',
            'The grey layer sharpens edges at the same time as it lightens them',
            'The tools burn into the pixels themselves and shift saturation as they work',
            'The grey layer applies its change to every layer below it in the stack',
          ], 2, 'The tools rewrite the underlying pixels permanently and pull colour as they lighten or darken, while a neutral grey layer keeps the whole tonal map separate and reversible.'),
          q('In a frequency separation setup on an 8-bit file, what is the low layer used for?', [
            'Cloning pore texture across the face without altering colour',
            'Sharpening the edges once the composite has been finished',
            'Holding the Linear Light blend that recombines the two halves',
            'Fixing uneven colour and tone while the texture above stays untouched',
          ], 3, 'The blurred low layer carries colour and tone only, so painting on it evens out blotchy skin while every pore and hair remains intact on the high layer above.'),
        ]
      ),
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
        `,
        [
          q('The background plate was shot at ISO 3200 and your cut-out subject came from a clean studio file. What has to happen for the composite to read as one photograph?', [
            'Denoise the background until it matches the clean subject edges',
            'Add matching grain to the subject and a touch of blur to its edges',
            'Raise the subject contrast so the background noise reads as texture',
            'Rebuild the mask using a larger Radius in the Select and Mask workspace',
          ], 1, 'A single camera produces one noise level and one focus falloff across the frame, so the added element has to inherit the grain and softness of the plate rather than the other way round.'),
          q('What makes a contact shadow believable rather than obviously painted?', [
            'One even grey pool spread at low opacity across the whole base',
            'A hard black edge traced precisely along the subject\'s mask outline',
            'A cast shadow distorted along the ground and blurred by an even amount',
            'A tight dark pool where the object touches, fading wider and lighter outward',
          ], 3, 'Real shadows are darkest and sharpest at the point of contact and lose density and definition with distance, so a uniform blob is the detail that gives a composite away.'),
          q('The background is clearly lit from the right. How do you relight a subject that was shot flat, in about ninety seconds?', [
            'Clip a Curves layer that darkens, then paint its mask black down the lit side',
            'Lower the subject layer opacity until its light level matches the plate',
            'Apply Color Balance to the whole stack from the top of the document',
            'Use Blend If on the background so its highlights punch through the subject',
          ], 0, 'Darkening the whole subject and then masking that darkening away from the side facing the light source creates directional shading that agrees with the background.'),
        ]
      ),
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
        `,
        [
          q('A screenshot of flat UI colour has to be enlarged for a presentation slide. Which resample method suits it?', [
            'Bicubic Sharper, because it protects edges during resampling',
            'Preserve Details 2.0 with the Reduce Noise slider at about 20',
            'Nearest Neighbor, because it keeps hard edges without smearing them',
            'Automatic, which will select Bicubic Smoother for the enlargement',
          ], 2, 'Flat colour and hard boundaries have no continuous tone to interpolate, so the method that simply repeats pixels keeps the edges square instead of blurring them.'),
          q('Why are print sharpening amounts set higher than web sharpening amounts for the very same photograph?', [
            'Ink spreads into the paper fibres, so screen-crisp files print slightly soft',
            'Print files are 16-bit and need more contrast before detail becomes visible',
            'A 300 ppi file has more pixels, so each edge needs a larger Amount value',
            'Converting to CMYK removes the local contrast that sharpening then restores',
          ], 0, 'Dot gain physically widens each ink dot on paper, softening edges, so the file has to leave your machine looking slightly over-sharpened on screen.'),
          q('Why must sharpening be judged at 100 percent zoom rather than at whatever zoom fits the window?', [
            'Because 100 percent is the size at which the file will be printed',
            'Any zoom below 100 percent is itself a resample, so the preview misleads you',
            'Smart Sharpen only renders its preview correctly at 100 percent',
            'Halos appear only once the document has been flattened at full size',
          ], 1, 'Screen zoom below 100 percent interpolates the display, hiding or inventing edge detail, which is why people routinely over-sharpen while judging at 33 percent.'),
        ]
      ),
            lesson('Cropping, Straightening, and Fixing Converging Verticals', 13, `
A client rejected a shop front photograph with the note "it looks cheap". They could not say why. The building was leaning backwards by four degrees because the camera had been tilted up to fit the sign in, and the horizon ran downhill by one degree. Nothing was blurred, nothing was badly exposed. Geometry was the whole problem, and geometry is fixed before any retouching starts.

### Crop without burning the pixels

The Crop tool has a checkbox in the options bar called **Delete Cropped Pixels**. Untick it. The crop then becomes a non-destructive boundary: the pixels outside are still in the file, and dragging the crop back out recovers them a week later. Tick it and the file gets smaller and the decision becomes permanent.

Two more controls in the same bar earn their place:

\`\`\`text
Ratio field       type 3:2, 16:9, or exact values like 1080 px x 1350 px
Straighten        drag a line along anything that should be level
Content-Aware     fills the wedges that rotation leaves empty, instead of
                  cropping further in to avoid them
\`\`\`

Straighten is one drag along the shop counter, the roofline or the waterline. Photoshop calculates the angle and rotates the canvas for you. Do not use the horizon in a wide angle shot for this, because barrel distortion bends it.

### Converging verticals, and what they cost to fix

Point a camera upward and parallel lines converge. The correction is a perspective transform, and every perspective transform throws away part of the frame.

In Camera Raw, open the **Geometry** panel:

\`\`\`text
Upright: Auto        level plus a light perspective correction
Upright: Vertical    straightens verticals only, the safe default for buildings
Upright: Full        verticals and horizontals, aggressive, often overcooks
Manual sliders       Vertical, Horizontal, Rotate, Aspect, Scale
X and Y Offset       reposition the surviving frame before it gets cropped
\`\`\`

A 24 mm shot taken with the camera tilted up about five degrees loses roughly ten to twelve percent of its height once the verticals are pulled straight. That is why architectural photographers frame loose on purpose. If the file is already tight, the correction will cut into the subject, and the cheapest fix is back at the shoot, not in Photoshop.

The honest limit: pushing Vertical past about plus or minus 40 stretches the top of the frame so far that brickwork and faces start to look rubbery. Correct to roughly 80 percent of true and the eye accepts it happily. A perfectly corrected tall building can actually read as unnatural, because we expect a little convergence when looking up.

### Perspective Crop for flat copy work

Photographing a poster, a book page or a painting off-axis gives you a trapezoid. The **Perspective Crop tool** (nested under the Crop tool) solves it in one step: drag the four corner handles onto the four corners of the artwork, press Enter, and Photoshop remaps the trapezoid into a rectangle. Set the W, H and Resolution fields in the options bar first and the result comes out at the exact size you need.

### Symptom to fix

| What you see | Cause | Fix |
|---|---|---|
| Horizon runs downhill | Camera not level | Crop tool, Straighten drag |
| Building leans back | Camera tilted up | Camera Raw, Upright Vertical |
| Straight edges bow outward | Wide angle barrel distortion | Lens Corrections profile first |
| Face at the frame edge looks stretched | Wide angle volume anamorphosis | Recrop, or Adaptive Wide Angle |
| Product label curves off a bottle | Cylindrical surface | Warp, Cylinder preset |

Order matters inside that table. Run the lens profile correction before any manual perspective work, because straightening a bowed line with a perspective slider only trades one distortion for another.

### The classic mistake

Cropping to "whatever looks nice" and discovering later that the layout needs 4:5 for Instagram, 16:9 for the site header and 1:1 for the thumbnail. Crop from the master file once per destination, never crop a crop, and keep the uncropped original as a Smart Object so every version stays live. Recropping a JPEG that has already been cropped and saved twice is how a subject ends up with the top of their head missing.
      `,
        [
          q('Why untick Delete Cropped Pixels before cropping a photograph you may need to re-frame later?', [
            'It keeps the crop ratio locked to the values in the options bar',
            'It prevents the crop from resampling and softening the surviving pixels',
            'It lets Content-Aware Fill run automatically on the rotated corners',
            'The pixels outside the crop stay in the file, so the boundary can be dragged back out',
          ], 3, 'With the box unticked the crop is only a visible boundary, so the original frame is still available whenever a different aspect ratio or a wider composition is needed.'),
          q('A 24 mm shot of a shopfront was taken with the camera tilted up five degrees. What should you expect after applying Upright Vertical?', [
            'The file gains resolution, since the transform stretches the frame outward',
            'Barrel distortion in the roofline is corrected along with the verticals',
            'Roughly ten percent of the frame height is lost to the correction crop',
            'The exposure of the upper part of the frame shifts and needs rebalancing',
          ], 2, 'A perspective transform pushes part of the image outside the rectangle, so the corrected result has to be cropped back in, which is why architectural shots are framed loose.'),
          q('You photographed a poster slightly off-axis and it appears as a trapezoid. Which tool turns it into a true rectangle at a size you specify?', [
            'The Perspective Crop tool, with W, H and Resolution set in the options bar',
            'Free Transform with Skew applied to each side in turn',
            'Adaptive Wide Angle, using the Constraint tool on the poster edges',
            'The Straighten drag inside the ordinary Crop tool',
          ], 0, 'Perspective Crop maps the four corner handles you place onto the corners of a rectangle in one operation, and its size fields let you output the copy at exact dimensions.'),
        ]
      ),
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
        `,
        [
          q('A traced shape carries 180 anchor points and ripples visibly along what should be one clean arc. What is the right response?', [
            'Run Object > Path > Simplify and pull the slider until the count collapses',
            'Increase the stroke weight so that the small ripples stop being visible',
            'Convert every smooth point to a corner point by Alt-clicking each one',
            'Apply a slight Gaussian Blur effect to soften the outline of the shape',
          ], 0, 'Excess anchors are what cause the wobble, so removing them with Simplify usually improves the shape visibly as well as making it faster to edit and cleaner to cut.'),
          q('You draw a 100 mm square for a die line and give it a 4 pt stroke aligned to the centre. What does the finished artwork actually measure?', [
            '100 mm, because stroke weight is only a screen preview',
            'About 98.6 mm, because the stroke is drawn inside the path',
            'About 101.4 mm, because half of the 4 pt stroke sits outside the path',
            '104 mm, because the full stroke weight is added to each edge',
          ], 2, 'A centred stroke straddles the path, so 2 pt hangs outside on every edge, and 4 pt is about 1.41 mm, which is why dimension-critical work uses an inside-aligned stroke.'),
          q('You click on a curve to nudge its bulge and the entire object gets a bounding box instead. What went wrong?', [
            'The path has been locked on its layer',
            'You used the Selection tool rather than the Direct Selection tool',
            'The anchor was already retracted into a corner point',
            'The shape is part of a compound path and cannot be edited',
          ], 1, 'The black arrow selects whole objects, so any drag scales or moves the entire shape, while the white arrow is what grabs individual anchors and their handles.'),
        ]
      ),
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
        `,
        [
          q('A wordmark looks correct on white, but on a coloured background a white disc appears inside the letter O. What is wrong with the artwork?', [
            'The mark was exported in the wrong colour mode for that background',
            'The counter was drawn with a stroke where it needed a fill',
            'The shapes were united when they should have been trimmed',
            'The counter is a stacked white shape rather than a hole in a compound path',
          ], 3, 'A compound path makes the counter genuinely transparent, whereas a white circle sitting on top only looks right for as long as the background behind it stays white.'),
          q('You select three icons, click Align Left, and all three of them move. How do you make the alignment happen around one fixed icon?', [
            'Click that icon a second time to make it the key object, then align',
            'Group the three first so that alignment uses the group bounds',
            'Switch the Align panel dropdown to Align to Artboard and retry',
            'Lock the icon you want to keep still, then align the other two',
          ], 0, 'Without a key object Illustrator aligns to an averaged position, but clicking one selected object again promotes it and every other object moves to meet it.'),
          q('Why does a 1 px stroke centred on a whole-pixel coordinate render as a blurry grey line in a 24 px icon?', [
            'Because odd stroke weights get rounded up when the browser renders them',
            'Because the artboard itself was not aligned to the pixel grid',
            'Because the stroke straddles two pixel rows rather than filling one',
            'Because SVG draws all strokes before it draws any of the fills',
          ], 2, 'A centred 1 px stroke puts half a pixel into each neighbouring row, so the renderer paints two rows of 50 percent grey instead of one solid row.'),
        ]
      ),
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
        `,
        [
          q('On a circular badge, the text you place along the bottom of the ring runs upside down. What is the working fix?', [
            'Rotate that text object by 180 degrees using the Rotate tool',
            'Use a second copy of the circle and drag the centre bracket inside it',
            'Set Align to Path to Descender on the bottom line of text',
            'Reverse the direction of the path with Object > Path > Reverse',
          ], 1, 'Dragging the centre bracket across to the inside of the path flips the text so it runs left to right along the bottom, which is why badges are built from two stacked circles.'),
          q('A 60 pt headline sets two typefaces on the same line. Which character settings suit it?', [
            'Metrics kerning with tracking left at 0',
            'Metrics kerning with tracking opened up to plus 75',
            'Optical kerning with tracking opened up to plus 75',
            'Optical kerning with tracking tightened to about minus 15',
          ], 3, 'Metrics kerning uses pairs built into one font and cannot judge across two, while display sizes look loose at default spacing, so optical kerning plus slight negative tracking is the fix.'),
          q('Why supply a print job as PDF/X-4 with embedded fonts instead of outlining all the type first?', [
            'The text stays live, so a late copy change does not mean retyping and re-kerning',
            'Outlined type prints softer because it loses its hinting information',
            'PDF/X-4 compresses vector artwork more efficiently than outlines do',
            'Printers are unable to open files in which the type has been outlined',
          ], 0, 'Embedding gives the printer everything they need to render the type correctly while leaving the file editable, and Create Outlines is a one-way conversion.'),
        ]
      ),
            lesson('The Appearance Panel: Stacked Fills, Effects, and Graphic Styles', 14, `
Open a road sign, a retro badge or a striped headline built by someone who knows Illustrator and you will often find one path. Not fifteen stacked copies. One. Everything visible is coming from the Appearance panel, and that panel is the difference between artwork you can revise in ten seconds and artwork you have to rebuild.

### One object, many fills and strokes

Select a path and open \`Window > Appearance\`. The **Add New Fill** and **Add New Stroke** buttons at the bottom of the panel stack extra attributes onto the same object, drawn in the order shown, top of the list nearest the viewer.

A classic outlined headline, on a single live text object:

\`\`\`text
Stroke  8 pt  #1A1A1A   (bottom of the stack, so it reads as an outer keyline)
Stroke  4 pt  #FFFFFF
Fill          #FF6A00
Character     Bebas Neue 48 pt
\`\`\`

Edit the words and all three attributes redraw around the new letterforms. The alternative, three copies of the text pasted behind each other, needs three edits and drifts out of register the moment anyone nudges one of them.

### Effects are live, and the order in the list is the order they apply

Anything under the \`Effect\` menu attaches to whatever row is highlighted in the Appearance panel. That targeting is the part people miss.

| Highlighted row | Effect applies to |
|---|---|
| The object name at the top | Every fill and stroke together |
| A single Fill row | That fill only |
| A single Stroke row | That stroke only |

So a drop shadow on the bottom stroke of the headline above gives you a shadow behind the whole keyline, while the same effect applied to the fill row alone puts the shadow inside the letters. Drag rows up and down to reorder, and click the small \`fx\` beside any effect to reopen its dialog with the original values still in it.

Two effects worth knowing well:

\`\`\`text
Effect > Path > Offset Path        grow or shrink a copy of the outline live,
                                   ideal for a knockout ring around a mark
Effect > Distort & Transform >
         Transform                 move, rotate and set Copies in one dialog,
                                   so a 12-tick dial is one circle plus one effect
\`\`\`

A dial built with Transform (Rotate 30 degrees, Copies 11) stays a single object. Change the tick length once and all twelve update.

### Save the stack as a Graphic Style

With the object selected, click the new style button in \`Window > Graphic Styles\`. Every fill, stroke and effect is now a one-click preset. Apply it to a rectangle, a path or a text object and they all take it. Better still, redefine the style later by Alt-dragging an updated object onto its swatch, and every object using that style updates across the document.

### The gotcha that ruins a resize

Scale a logo built this way from 120 mm down to 30 mm and the strokes and effects can stay at full size, so an 8 pt keyline that framed the mark now swallows it.

\`\`\`text
Preferences > General > Scale Strokes & Effects   tick it, once, permanently
Transform panel flyout > Scale Strokes & Effects  the same switch, per session
Scale dialog (double-click Scale tool)            tick it there too
\`\`\`

All three read the same preference, and it is off in a fresh install. Check it before you scale anything, and check it first on any file that arrives from someone else.

### Expand Appearance before it leaves you

\`Object > Expand Appearance\` converts the live stack into real paths. Do it when a file is going to a vinyl cutter, an embroiderer, an SVG export or anyone whose software does not read Illustrator effects. Do it on a copy: expanded artwork is ordinary geometry, and the live parameters that made it easy to revise are gone. Keep the live version on a layer named \`build\`, expand the delivery version, and never confuse the two.

### The classic mistake

Applying an effect while the object row is highlighted, wondering why the shadow wraps the strokes as well, and then deleting the whole object and starting again. Read the Appearance panel top to bottom before you touch anything. It is a recipe, and it tells you exactly what the artwork is made of.
      `,
        [
          q('You add a Drop Shadow to a text object while the top row of the Appearance panel is highlighted, but you wanted the shadow only behind the letterform fill. What went wrong?', [
            'Drop Shadow can only be applied to a whole object, never to one attribute',
            'The text needed outlining before an effect could target a single row',
            'The top row targets the whole object, so the shadow wrapped the strokes as well',
            'The fill row sits above the strokes, so its shadow is hidden behind them',
          ], 2, 'Effects attach to whichever row is selected, so highlighting the object name applies them across every fill and stroke rather than to the single attribute you meant.'),
          q('A logo scaled from 120 mm to 30 mm comes back with a keyline that now looks four times too heavy. Which setting was off?', [
            'Align to Pixel Grid in the Transform panel',
            'Scale Strokes & Effects in Preferences and the Transform panel',
            'Align Stroke to Inside in the Stroke panel',
            'Preserve Object Proportions in the Scale dialog',
          ], 1, 'Without Scale Strokes & Effects the geometry shrinks while stroke weights and effect values keep their absolute size, so every outline reads as heavier at the smaller scale.'),
          q('Why build a 12-tick dial with the Transform effect set to Rotate 30 degrees and Copies 11, rather than duplicating and rotating a tick eleven times?', [
            'Copies made by an effect export as separate SVG elements',
            'Rotating manually loses precision after about six duplications',
            'The effect version can be edited later by simply ungrouping it',
            'It stays one object, so editing the source tick updates all twelve',
          ], 3, 'The copies are generated live from a single path, so any change to that path, its stroke weight or its length propagates through every repeat instantly.'),
        ]
      ),
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
        `,
        [
          q('A 48 px headline is set with the same 1.5 line spacing used for the body copy, and it looks like it has fallen apart. Why?', [
            'Large type needs extra leading, so 1.5 is actually too tight here',
            'Line spacing stops applying above 40 px, so the gap comes from the font',
            'Big type needs less relative leading, because the eye finds the next line easily',
            'The headline weight is too light to hold that much space around it',
          ], 2, 'Leading is relative to size, so at 48 px a ratio near 1.05 keeps the lines reading as one block, while 1.5 opens gaps the eye never needed help crossing.'),
          q('A typeface family ships in Regular only. Someone clicks the B button in the toolbar to bold a subhead. What actually happens?', [
            'The software smears the outlines to fake a heavier weight, and it shows',
            'The subhead falls back to a different family that does have a bold cut',
            'The weight is applied correctly but only survives export to PDF',
            'Nothing changes on screen, although the printed output will be bolder',
          ], 0, 'Faux bold thickens the drawn outlines mechanically instead of using a designed weight, so joints fill in and the letterforms distort at every size.'),
          q('A subhead has 32 px of space above it and 8 px below it. What does that spacing tell the reader?', [
            'That the subhead matters less than the paragraph sitting above it',
            'That the page is running on an 8 px baseline grid throughout',
            'That the subhead should be read after the paragraph beneath it',
            'That the subhead belongs to the paragraph beneath it, not the one above',
          ], 3, 'Proximity signals ownership, so a smaller gap below than above binds a subhead to the text it introduces without changing a single font property.'),
        ]
      ),
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
        `,
        [
          q('You shrink a poster to thumbnail size and everything blurs into one even grey texture. What does that tell you?', [
            'The image resolution is too low for the final printed size',
            'There is no dominant element, so the contrast in the layout is too flat',
            'The grid carries too many columns for the amount of content',
            'The margins are too wide and the content is fighting the edges',
          ], 1, 'The thumbnail test strips away detail and leaves only hierarchy, so an even grey field means nothing is winning the viewer\'s first look.'),
          q('Why does a six column grid give you more usable layout options than a four column grid?', [
            'Six columns are narrower, which suits body text measure better',
            'Four column grids cannot carry gutters, so their spacing is fixed',
            'Six is closer to the twelve used on the web, so it converts cleanly',
            'Six divides into halves, thirds and sixths, so more splits stay on grid',
          ], 3, 'Divisibility is the whole point of a column count: six supports two, three and six part splits, whereas four only offers halves and quarters.'),
          q('A logo is placed at the exact mathematical centre of a poster and looks like it is sinking. What fixes it?', [
            'Move it up so it sits about 5 to 10 per cent above the true centre',
            'Scale it up by about 5 per cent so it holds the space better',
            'Move it down slightly, since the eye reads from the top of the page',
            'Add more space at the foot of the page and leave the logo where it is',
          ], 0, 'The optical centre sits above the mathematical one, so anything centred by the ruler reads as low and has to be raised by a few per cent.'),
        ]
      ),
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
        `,
        [
          q('An image sits in a slot 400 px wide and looks soft on a modern phone. What do you export?', [
            'The same 400 px file saved at 300 ppi rather than 72 ppi',
            'A 400 px PNG-24, because PNG is lossless and stays sharp',
            'An 800 px version for the 2x slot, alongside the 400 px one',
            'A 400 px JPEG at quality 100 so no detail is thrown away',
          ], 2, 'High density screens map two device pixels to each CSS pixel, so a 400 px slot needs an 800 px file; ppi tags and higher JPEG quality add nothing.'),
          q('Your flyer already has 3 mm of bleed set correctly. Why must the text still sit 5 mm inside the trim line?', [
            'Text overlapping a bleed area is clipped away during export',
            'The cut can also land inside the trim, which would shave the text off',
            'Ink spreads on uncoated stock, so text near an edge fills in',
            'Trim marks print 5 mm inside the page and would overprint the text',
          ], 1, 'Bleed covers you when the guillotine cuts outside the trim line, and the safety margin covers you when it drifts the other way and cuts inside.'),
          q('A full width photographic header is exported as PNG-24. What is the consequence?', [
            'The photo loses colour accuracy, since PNG stores no colour profile',
            'The photo is reduced to 256 colours and shows visible banding',
            'Transparency is baked in as white, so the edges look hard',
            'The file is several times larger than a JPEG that looks identical',
          ], 3, 'PNG-24 is lossless, which is worth paying for on flat colour and transparency but wasteful on continuous tone, where JPEG or WebP looks the same at a fraction of the size.'),
        ]
      ),
            lesson('Accessible Contrast and Legible Type', 13, `
A client emailed to say she could not read the price on her own product page. It was set in #9E9E9E on white, a contrast ratio of 2.68 to 1. On a calibrated screen in a dim studio it looked refined. On a phone at a bus stop it was simply gone.

### Contrast is a ratio, not a taste

The ratio compares the relative luminance of two colours. It runs from 1 to 1, meaning identical, up to 21 to 1, which is pure black on pure white. The thresholds you design against:

| Content | Minimum ratio |
|---|---|
| Body text under 24 px (19 px if bold) | 4.5 to 1 |
| Large text, 24 px and above | 3 to 1 |
| Icons, chart keys, input borders, focus rings | 3 to 1 |
| The stricter enhanced level for body text | 7 to 1 |

Read the middle rows again: size buys you contrast. One grey can pass in a 48 px headline and fail in the 16 px caption underneath it, which is why audits find errors clustered in captions, placeholder text, disabled labels and footers.

### Where the greys actually land

Grey on white, measured:

\`\`\`text
#B3B3B3   2.10   fails everything
#999999   2.85   fails body and large text
#8A8A8A   3.45   large text only
#767676   4.54   the lightest grey that passes body text on white
#6B6B6B   5.33   comfortable
#595959   7.00   passes the enhanced level
\`\`\`

Memorise one value: **#767676**. Anything lighter than that on pure white is decoration, not text.

### The trap that catches everyone

That same #767676 passes on #FFFFFF and fails at 4.06 the moment you move it onto a #F2F2F2 card, the sort of faint panel every dashboard has. Contrast belongs to the pair, never to the foreground alone. Test against the colour the text really sits on, including the palest tint.

The second trap is brand colour on a button. Take the orange #FF6A00:

\`\`\`text
#FFFFFF label on #FF6A00   2.87   fails
#1A1A1A label on #FF6A00   6.06   passes comfortably
\`\`\`

White on a mid bright brand colour is the most common failure in real interfaces, and it is invisible to the person who chose it, because they already know what the button says.

### Colour is never allowed to be the only signal

Roughly 1 in 12 men has some form of colour vision deficiency. A form that marks invalid fields with a red border and valid ones with green tells those readers nothing whatsoever. Pair every colour signal with a second one: an icon, a word, a change of weight, an underline on links inside body copy.

### Broken, then fixed

> **Broken.** Product card: title 14 px #999999 on a #F7F7F7 panel, price 13 px #B3B3B3, sale badge in white on #FF6A00, out of stock indicated only by greying the whole card.

> **Fixed.** Title 16 px #1A1A1A, price 20 px #1A1A1A at 600 weight, badge in #1A1A1A on the same orange, and the words Out of stock set under the price. Nothing moved and nothing was redrawn. Four colour values changed.

### Check it, do not squint at it

\`\`\`js
const lum = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const rel = ([r, g, b]) => 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
const ratio = (fg, bg) => {
  const [hi, lo] = [rel(fg), rel(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
ratio([118, 118, 118], [255, 255, 255]); // 4.54
\`\`\`

Print has its own version of the rule. Text in 100% K on a 10% K tint is comfortable, on a 40% K panel it is not, and small reversed type dropped into a mid tone photograph is unreadable whatever a calculator says, because the background changes under every letter. Put a solid panel behind it, or move it somewhere it can be read.
      `,
        [
          q('Grey text at #767676 passes on a white page. Moved onto a #F2F2F2 card it fails. Why?', [
            'Contrast belongs to the pair, and the lighter card cuts the ratio',
            'Card backgrounds are exempt from the 4.5 to 1 body text threshold',
            'The text colour shifts when it is composited onto a tinted panel',
            'Panels under 5 per cent tint must meet the 7 to 1 enhanced level',
          ], 0, 'The ratio is computed between the foreground and the exact background behind it, so lifting that background from #FFFFFF to #F2F2F2 drops 4.54 to 4.06 and the text stops passing.'),
          q('A brand orange button (#FF6A00) carries a white label, and it measures 2.87 to 1. What fix keeps the brand colour?', [
            'Raise the label to 24 px so the 3 to 1 large text rule applies',
            'Add a soft white glow behind the label to lift it off the fill',
            'Set the label in near black on the orange, which measures 6.06 to 1',
            'Add a darker orange border so the whole control reads as one shape',
          ], 2, 'A mid bright fill sits closer in luminance to white than to black, so swapping the label to near black more than doubles the ratio while the brand fill is untouched.'),
          q('A form marks invalid fields with a red border and valid ones with green, and adds nothing else. Who does that fail?', [
            'Anyone whose monitor has not been calibrated to a D65 white point',
            'Readers with colour vision deficiency, roughly 1 in 12 men',
            'Only screen reader users, since borders are never announced at all',
            'Nobody, as long as both colours pass 3 to 1 against the field',
          ], 1, 'Colour on its own carries no information for someone who cannot separate those two hues, so every colour signal needs a second cue such as an icon or a word.'),
        ]
      ),
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
        `,
        [
          q('Two of your three concepts, put through a 6 px blur, become the same grey lozenge. What does that tell you?', [
            'Both concepts need more internal detail to survive at small sizes',
            'They are the same concept, so you have two routes to present, not three',
            'The blur radius is too high for marks of that size to be judged fairly',
            'Both silhouettes are strong, since they still read once detail is gone',
          ], 1, 'The blur test reduces a mark to its silhouette, so two concepts that blur identically differ only in detail nobody will see from across a room.'),
          q('Why draw a mark on a 100 unit grid with a 10 unit module and only three permitted corner radii?', [
            'It keeps the file small enough for embroidery software to read it',
            'It guarantees the mark scales with no drift in the anchor points',
            'It forces the mark into a square, which suits app icons and avatars',
            'Repeated, related geometry reads as designed; freehand reads as sketched',
          ], 3, 'Constraining dimensions, radii and angles makes the internal relationships consistent, and viewers register that consistency as intent even when they cannot name it.'),
          q('A client asks to see everything you have, so you present thirty options. What usually follows?', [
            'Design by committee, assembling one mark out of parts of several',
            'A faster sign off, since there is more chance of an early match',
            'A request for written rationale covering each of the thirty routes',
            'The client choosing whichever option sits closest to a competitor',
          ], 0, 'A long menu reads as an absence of opinion, so the client starts building a mark from fragments instead of choosing one considered route.'),
        ]
      ),
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
        `,
        [
          q('Why is a reversed logo not simply the primary artwork recoloured white?', [
            'White artwork needs a different colour profile to print on dark stock',
            'A reversed mark must drop the wordmark and use the icon on its own',
            'White on black looks fatter, so thin strokes and counters need tuning',
            'The reversed version carries a larger minimum size than the primary',
          ], 2, 'Light shapes on dark grounds bloom optically by a few per cent, so untuned strokes thicken and tight counters close up in reproduction.'),
          q('Why publish CMYK, Pantone and vinyl codes instead of letting each supplier convert your hex value?', [
            'Independent conversions give four different blues on four different items',
            'Hex values cannot be converted to CMYK without the original vector file',
            'Suppliers are not permitted to convert brand colours without a licence',
            'Pantone inks are mixed from hex codes, so that conversion must be exact',
          ], 0, 'Every conversion depends on the profile and rendering intent chosen, so specifying the colour once in each space is the only way the printed, screen and cut versions agree.'),
          q('A sign maker needs the mark at 9 mm wide, below your 18 mm minimum. What does the system tell them to do?', [
            'Scale the lockup to 9 mm and thicken its strokes to compensate',
            'Use the reversed variant, which holds together better when small',
            'Set the wordmark in the brand typeface and leave the icon out',
            'Switch to the icon only variant rather than shrinking the lockup',
          ], 3, 'Minimum size is the point where you change variant, because the icon is drawn to survive small reproduction while the full lockup is not.'),
        ]
      ),
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
        `,
        [
          q('Two of your SVG logos are inlined on one web page, and the second one renders solid black. What happened?', [
            'The second file was exported without its viewBox, so it cannot scale',
            'The second file kept live text instead of having its type outlined',
            'The browser cached the first file and served it into both slots',
            'Both files use id=a, so the second points at the first one\'s gradient',
          ], 3, 'IDs are global across a page, so duplicate short IDs from Illustrator make one file reference another file\'s gradient or clip path and the artwork collapses.'),
          q('You send an EPS to a vinyl cutter and your 2 pt rules are missing from the cut path. Why?', [
            'EPS cannot describe strokes, so only filled shapes survive the export',
            'A stroke is a path with no width until you run Outline Stroke on it',
            'The cutter needs 300 ppi artwork and the EPS was placed at 72 ppi',
            'Strokes aligned to the inside of a path are ignored by cutting software',
          ], 1, 'Cutting machines follow closed outlines, and an unexpanded stroke is only a centre line carrying a display width, so it has to become a real shape first.'),
          q('A developer places your SVG and the logo arrives tiny inside a large box of empty space. What was missed?', [
            'The file was exported with Responsive on, so it carries no dimensions',
            'Object IDs were left on Minimal rather than being set to Unique',
            'The artboard was never fitted to the artwork before exporting',
            'The type was outlined, which enlarged the bounding box of the file',
          ], 2, 'Illustrator writes the artboard bounds into the SVG, so an oversized artboard becomes empty padding that the layout then has to size around.'),
        ]
      ),
            lesson('Scope, Rounds, and Rights: The Paperwork Around the Mark', 13, `
Round eleven. The quote said USD 1,200 for an identity and the drawing was finished in week two; the other nine weeks went to a marketing manager who kept remembering things her director had said in meetings you were not in. Nobody behaved badly. The word revisions was never defined, so it meant whatever the client needed it to mean that week.

### Define a round, in one sentence

A round is one consolidated set of written feedback from one named approver, returned inside five working days. Every clause in that sentence is load bearing.

| Clause | What it prevents |
|---|---|
| consolidated | Three emails on three days being counted as one round |
| written | Notes given on a call and remembered differently in week six |
| one named approver | You refereeing a disagreement between two stakeholders |
| five working days | A job stalling in week three and reopening in month four |

Two people sending contradicting notes separately is not a round. It is a request that you make a decision which is not yours to make. Send it back and ask them to agree first.

### Write the scope so a non designer can count it

\`\`\`text
Identity, Acme Coffee Roasters
Included   3 initial routes, 2 rounds of refinement on the chosen route
           Final mark in the variants named in the handoff schedule
           1 page guidelines PDF: clear space, minimum size, colour values
Extra      further round        USD 180
           additional route     USD 450
           stationery artwork   quoted separately
Dates      routes day 8, refinement day 15, files day 22
           each approval that slips a week moves delivery by a week
\`\`\`

Every line under Included is countable. A client who cannot count what they bought cannot tell when it has been delivered, and a job with no end gets worked as though it has none.

### The change order

A change is not an argument. It is a short note, sent the day the request arrives.

\`\`\`text
CO-02  Acme Coffee Roasters
Request   third route explored in a second colourway (email, 14 May)
Effect    +4 hours, +USD 180, delivery moves from 22 May to 25 May
Approve   reply yes to this email and it goes into the next round
\`\`\`

Send it before the work, never with the final invoice. A client who sees the cost first usually decides whether they actually want the thing. A client who sees it afterwards feels ambushed, and they are right to.

### Money and rights are the same clause

A common structure: 50 per cent on booking, 50 per cent on delivery, and copyright in the final mark transfers on receipt of the final payment. That last part is the whole point. Until then the client is holding files they cannot lawfully put on a shopfront, which collects more invoices than any amount of chasing.

What transfers is the chosen mark. Routes they did not pick stay yours, and you keep the right to show the work, which is worth writing down because a large company's standard contract usually assumes the opposite.

### Two things clients assume you did

- **Trademark clearance.** Drawing a mark is not checking that the name is free to use. Say plainly, before you start, that searching and registering is work for their lawyer or a trademark attorney. Clients assume this was covered right up until the letter arrives.
- **Third party assets.** A licensed photograph or illustration sitting inside a design is licensed for that project, and it does not travel to the next one on its own. List in the handoff what is licensed, for what use, and for how long.

### The classic mistake

Starting on a verbal yes with no deposit. It feels like momentum and it looks like goodwill, and the first payment was never really about cash flow anyway. It is the moment the project becomes real for the person who has to defend it internally. Jobs that begin unpaid are the jobs that drift, and they are the ones that quietly evaporate when a budget moves in another direction.
      `,
        [
          q('Two stakeholders send you contradicting notes on the same route, in separate emails. Under a properly defined round, what happens next?', [
            'You send it back and ask them to agree one consolidated response',
            'You apply both notes and present two versions at the next round',
            'You follow whichever note arrived first and log the other for later',
            'You count it as two rounds and invoice the second one immediately',
          ], 0, 'A round is one consolidated set of feedback from one named approver, so contradicting notes are a decision the client still owes you rather than work you can begin.'),
          q('Why does copyright in the mark transfer on final payment rather than on delivery of the files?', [
            'Copyright cannot legally transfer before an invoice has been raised',
            'It preserves the designer\'s right to show the work in a portfolio',
            'Until it transfers the client holds files they cannot lawfully use',
            'It delays any trademark filing until the artwork is genuinely final',
          ], 2, 'The clause is quiet leverage: an unpaid client owns nothing they can legally put on a shopfront, which settles more invoices than chasing emails ever does.'),
          q('A client launches, then receives a letter saying another company owns a similar mark. What should have happened at the start?', [
            'The mark should have been drawn only after the name was registered',
            'You should have said in writing that clearance is their lawyer\'s job',
            'You should have run a trademark search as part of the design brief',
            'The routes should have been checked against the competitor audit',
          ], 1, 'Clients assume the designer confirmed the name was free, so stating early and in writing that searching and registering is legal work sets the expectation before it costs anyone.'),
        ]
      ),
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
        `,
        [
          q('Your monitor is calibrated to 160 cd/m2 in a dim room. What does that do to the files you deliver?', [
            'Colours shift towards blue, since luminance and white point are linked',
            'Nothing, as long as the monitor profile is embedded in every export',
            'Files print lighter, because a bright screen makes you add exposure',
            'Files print too dark, because the bright screen hides how dark they are',
          ], 3, 'A screen at 160 cd/m2 shows shadow detail that paper cannot hold, so you stop lifting images that genuinely need it and the press reveals the shortfall; 100 to 120 cd/m2 matches print far better.'),
          q('Image > Mode > CMYK Color and Edit > Convert to Profile both convert a file. Why is Convert to Profile the professional habit?', [
            'A mode change works only on flattened files, while Convert keeps layers',
            'A mode change silently uses the working CMYK, not the press profile',
            'A mode change discards the embedded profile and leaves the file untagged',
            'A mode change always applies Perceptual intent, clipping saturated colour',
          ], 1, 'Convert to Profile forces you to name the destination profile, the engine and the rendering intent, whereas a mode change quietly applies whatever the working space happens to be set to.'),
          q('A brand orange gets chalkier at every reprint after the file has gone RGB to CMYK to RGB and back again. Why?', [
            'Each export resamples the artwork and softens the saturated edges',
            'The CMYK profile drifts as the printer updates its press conditions',
            'Every conversion clips out of gamut colour, and clipped colour never returns',
            '8-bit files lose one level of precision at each step in the chain',
          ], 2, 'A trip through a smaller gamut maps colour the destination cannot hold onto its boundary, and converting back only widens the numbers, never the colour that was already thrown away.'),
        ]
      ),
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
        `,
        [
          q('The Swatches panel holds PANTONE 2728 C, Pantone 2728 C and a swatch called Blue, all spot. What does the RIP see?', [
            'Seven plates on a job quoted as four, since each spot separates alone',
            'Three identical plates, which the RIP merges automatically at output',
            'Four plates, with the two Pantone entries treated as one named ink',
            'A profile mismatch warning, which stops the job before it reaches press',
          ], 0, 'Spot swatches separate by name, so near duplicate names each generate a plate of their own and the job carries three extra passes unless you merge them first.'),
          q('Body text at 7 pt shows a cyan fringe along the letters on the printed proof. What was done wrong?', [
            'The text was set in an RGB black and converted late in the process',
            'The text was outlined before export instead of staying live and embedded',
            'The text was set in a rich black, so fine type sits on four plates at once',
            'The text was overprinting the panel behind it rather than knocking out',
          ], 2, 'Presses cannot hold registration tightly enough for small type built from four inks, so the coloured plates show along the edges; small text should be 100% K only.'),
          q('Your exported PDF looks perfect in the system preview app but prints wrong. Why is that not a contradiction?', [
            'System previews render at 72 ppi, so print resolution is never visible',
            'The previewer ignores overprint, approximates spots and knows no ink limit',
            'The previewer opens the flattened proof copy embedded in a PDF/X file',
            'The previewer converts the page to sRGB, so CMYK values are never shown',
          ], 1, 'A desktop viewer shows a convenient approximation rather than a separation, so overprint behaviour, spot inks and total area coverage stay invisible until you open Output Preview.'),
        ]
      ),
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
        `,
        [
          q('A composite carries twenty embedded Smart Objects, each built from a 40 MB raw file, and the PSD is over 800 MB. What fixes it?', [
            'Run Edit > Purge > All, which frees the copies held by the undo buffer',
            'Use linked Smart Objects, so the sources stay outside the document',
            'Untick Maximize Compatibility, which drops the flattened composite',
            'Lower History States to 20, since each state stores the smart source',
          ], 1, 'An embedded Smart Object keeps a full copy of its source inside the PSD, while a linked one references the file on disk so the document stops carrying every raw file.'),
          q('Photoshop crashes in the middle of a job. What must you do first to get the autosaved recovery file?', [
            'Open the scratch disk folder and rename the temporary file to .psd',
            'Reopen the last saved version, then choose File > Revert to Recovered',
            'Restart the machine so Photoshop rebuilds its preferences and caches',
            'Reopen Photoshop before anything else, since it offers recovery on launch',
          ], 3, 'Recovery data is offered when the application starts and is discarded on a clean quit, so opening and closing it once for something else can lose the work for good.'),
          q('You untick Maximize Compatibility and your PSDs shrink by 40 per cent. What did you give up?', [
            'The flattened composite preview that other applications read',
            'The layer masks, which are merged into their layers on save',
            'Lossless layer compression, so pixel data is now stored lossy',
            '16-bit colour data, which is only written in compatibility mode',
          ], 0, 'That option writes a flattened copy alongside the layers purely so other software can show a preview, so removing it costs the preview and nothing in the layered data itself.'),
        ]
      ),
            lesson('Stock, Finishes, and Talking to Your Printer', 13, `
The same business card, printed twice from the same PDF. On 350 gsm uncoated it feels like a card. On 130 gsm silk it feels like a receipt. Nothing in the file changed. The stock did most of the work that everyone will credit to your design.

### Weight, and what gsm actually measures

gsm is grams per square metre: mass, not thickness. Two 350 gsm sheets can differ visibly in bulk, because uncoated fibres sit looser than the compressed surface of a coated sheet.

| Stock | Typical use |
|---|---|
| 80 to 100 gsm | Letterhead, internal documents, book text |
| 130 to 170 gsm | Flyers, folded leaflets, magazine pages |
| 250 to 300 gsm | Postcards, covers, menus |
| 350 to 400 gsm | Business cards, invitations, swing tags |
| 600 gsm and up | Duplexed cards, two sheets bonded, often a coloured core |

Ask your printer for a sample pack and keep it on the desk. Choosing paper from a website is choosing sound from a photograph of a speaker.

### Coated versus uncoated changes the colour, not the file

Uncoated paper absorbs ink and the halftone dot spreads. Dot gain around 20 per cent on uncoated against roughly 12 on coated means an identical CMYK build prints darker and less saturated. Nothing in the file fixes paper, so soft proof to the profile for the stock you chose, while the layout can still change.

### Digital or litho

\`\`\`text
Digital (toner or inkjet)   no plates, almost no setup cost
                            economical to roughly 500 copies
                            variable data, short runs, next day turnaround
Litho (offset plates)       four plates to make, then very cheap per sheet
                            wins above about 500 to 1000 copies
                            Pantone inks, big sheets, best solid coverage
\`\`\`

The counter intuitive part is the price curve. Setup dominates, so 500 and 1000 litho copies often land within 10 to 15 per cent of each other. Ask for both quantities on every quote and decide with the numbers in front of you.

### Finishes, and the artwork each one needs

| Finish | What it does | What you supply |
|---|---|---|
| Matt or gloss lamination | Protects, changes the surface feel | Nothing extra |
| Spot UV | Gloss varnish on chosen areas only | A separate spot plate |
| Foil block | Metallic or pigment, pressed with heat | A separate spot plate |
| Emboss or deboss | Relief with no ink at all | A separate spot plate |
| Die cut | Custom shape, window or rounded corner | A cutter path, in vector |

For every one of those last four: draw the finish on its own layer, fill it with a spot swatch named exactly what your printer asks for, and set it to overprint so it does not knock a hole in the artwork beneath.

\`\`\`text
Layer  finishes   (topmost, nothing else on it)
  Swatch   SpotUV   Spot colour, 100%, Attributes > Overprint Fill ON
  Content  the shapes to be varnished, in register over the artwork
\`\`\`

A grey box drawn on the design layer to show where the foil goes is not artwork. It is a suggestion, and it prints as a grey box.

### Fold and cut before you commit

Anything above roughly 170 gsm has to be creased before folding, or the coating cracks along the fold and shows a white line. Folds also change panel widths: on a roll fold the panel that tucks inside must be 2 to 3 mm narrower than the others, or the piece will not close flat.

### The quote request

\`\`\`text
Quantity    500 and 1000, priced separately
Flat size   210 x 297 mm, folded to 105 x 297 mm
Stock       170 gsm uncoated, or nearest house stock, please advise
Colours     4/4 process, no spot
Finish      matt lamination outside, creased and folded
Proof       wet proof on the actual stock
Delivery    14 June, one address
\`\`\`

Send that and a comparable quote comes back in an hour. Ask what some leaflets cost and you get a phone call and a lost afternoon.

### The classic mistake

Choosing the stock last. The design assumed bright white gloss, the budget landed it on cream uncoated, and the hairline rules and pale grey type that looked elegant on screen turned to fluff on the sheet. Pick the paper in week one and design for that paper.
      `,
        [
          q('The same CMYK photograph is printed on gloss coated stock and on uncoated. Why does the uncoated version look darker and duller?', [
            'Uncoated stock reflects less light, so the ink film appears thinner',
            'Uncoated sheets run at a lower total ink limit, which weakens the build',
            'The paper absorbs ink and the dot spreads, so tones fill in and flatten',
            'Uncoated stock needs litho, which lays down less ink than digital does',
          ], 2, 'Dot gain on uncoated paper runs near 20 per cent against roughly 12 on coated, so every halftone dot prints larger, midtones darken and saturation drops.'),
          q('A litho quote for 500 copies and one for 1000 copies differ by only about 12 per cent. Why?', [
            'Plate making and make ready dominate, so extra sheets cost very little',
            'Printers discount the second 500 in order to fill idle press capacity',
            'Paper is bought in fixed 1000 sheet units, so a 500 run wastes half',
            'The quote assumes digital printing, where quantity changes nothing',
          ], 0, 'Litho cost sits mostly in making plates and getting colour right on press, so once the press is running the marginal cost of another 500 sheets is small.'),
          q('You want a foil logo on a cover, so you draw the logo in light grey on the design layer and mention foil in the email. What arrives?', [
            'The foil is applied, but the printer charges for an extra plate',
            'The file comes back rejected, since foil needs a 300 ppi raster mask',
            'The foil lands out of register, because grey carries no trap value',
            'A grey logo printed in ink, because there is no spot plate to foil from',
          ], 3, 'Finishes are separated by a named spot swatch on its own layer set to overprint, so anything drawn in process colours is simply printed as process colours.'),
        ]
      ),
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
      chapter(
      'Advanced Photoshop: Channels, Luminosity, and Colour Grading',
      'The raster techniques that separate a clean edit from a convincing one, working through channels, luminosity and grade rather than on the pixels themselves.',
      [
      lesson('Channels as Masks: Cutting Hair, Glass, and Smoke', 13, `
Select Subject cuts a person out in two seconds. Zoom to 200 per cent on the hair and you find a helmet: every flyaway strand gone, the outline traced as if the model were wearing a swimming cap. That is not a bug in the algorithm. It is what happens when a tool that thinks in shapes meets a subject that is mostly partial transparency.

Channels solve it, because the mask you need is already sitting in the file.

### Every RGB image is three greyscale images

Open the Channels panel and click Red, Green, Blue one at a time. Each is a greyscale map, 0 to 255, describing how much of that primary every pixel holds. Nothing in a channel says "hair" or "sky". But one of the three almost always shows the widest tonal gap between subject and background, and that gap is a ready made mask.

Blonde hair against a blue sky is the textbook case. In the blue channel the sky sits near 250 and the hair near 60. That is 190 levels of separation, free, before you touch a tool.

| Subject against background | Best channel | Why |
|---|---|---|
| Dark hair, bright sky | Blue | Sky peaks, hair sits low |
| Blonde hair, blue backdrop | Blue | Same gap, subject reversed |
| Green foliage, grey sky | Red | Leaves go dark in red |
| Red product, white sweep | Green | The red object drops to near black |
| Skin, dark studio wall | Red | Skin is brightest in red |

### The recipe

\`\`\`text
1  Channels panel. Click R, G, B. Pick the widest gap.
2  Drag that channel onto the New Channel icon. You now have "Blue copy".
3  Image > Adjustments > Levels, on the COPY only.
   Black input to about 40, white input to about 210.
4  Brush pure black over the solid interior of the subject.
   Brush pure white over background clutter you want gone.
5  Cmd/Ctrl click the copy thumbnail to load it as a selection.
6  Click RGB, return to Layers, Add Layer Mask. Invert if needed.
\`\`\`

Step 3 is where people ruin it. Push the black and white points until the mask looks clean and crisp, and the hair turns into a comb: the soft greys that described a half covered pixel have been forced to 0 or 255. Those greys are the entire point. A strand a third of a pixel wide belongs at roughly 170, not 255.

### Glass and smoke are luminance, not shape

There is no outline to trace on smoke. Its opacity IS its brightness. Shoot smoke against black and the image is already its own mask: drop it on its own layer, set the blend mode to Screen, and black falls away while the bright grey stays. For finer control, \`Image > Apply Image\` lets you push that relationship with Multiply or Add before you commit.

Glass runs the same logic in reverse. A wine glass on white keeps its highlights and its cast shadow, so cut the outer silhouette conventionally and let the interior come through on a Multiply layer.

### The fringe nobody warns you about

Your mask is perfect and the composite still looks wrong: the blonde hair now reads blue grey against a warm new background. Semi transparent pixels are physically mixed with the old background colour, and no mask can unmix them.

Fix it on colour, not on the mask. Clip a Hue/Saturation layer to the cutout, target the Blues range, drop Saturation to about minus 60 and lift Lightness slightly. \`Layer > Matting > Defringe\` at 1 or 2 px handles hairline cases; anything wider eats the strands. For heavy fringing, paint the new background colour onto an empty clipped layer set to Color blend mode at 30 per cent opacity.

### When one channel is not enough

\`Image > Calculations\` blends any two channels into a new alpha. Blue against Red set to Subtract often separates a subject that no single channel can. Same idea, one step further: build the greyscale that already knows where the subject is, then let the mask fall out of it.
      `,
        [
          q('You cut blonde hair from a blue sky with a channel mask. The mask is accurate, yet the hair reads blue grey over the new warm background. What causes it?', [
            'The mask clipped the grey values in the strands to pure white',
            'Semi transparent pixels physically contain the old sky colour',
            'The layer mask was applied at less than full mask density',
            'The channel was duplicated before the Levels move, not after',
          ], 1, 'A pixel only partly covered by a hair strand is a physical blend of hair and sky, so hiding the sky through a mask cannot remove the sky colour already baked into that pixel; you correct it with a clipped Hue/Saturation or Color blend layer.'),
          q('You push Levels hard on the duplicated channel until the mask looks clean and crisp. What have you broken?', [
            'The document loses its embedded profile on that channel',
            'The selection loads inverted and hides the subject instead',
            'The alpha is forced to 16 bit and the file size doubles',
            'Partial coverage greys clip to 0 or 255, so strands go solid',
          ], 3, 'The mid grey values in a channel mask are what describe partially covered pixels, so crushing them to pure black or pure white turns soft hair into a hard comb shaped edge.'),
          q('You need smoke photographed against a black backdrop composited onto a dark blue scene. What is the fastest correct approach?', [
            'Run Select Subject on the smoke, then smooth the edge by 3 px',
            'Trace the smoke silhouette with the Pen tool and feather it',
            'Set the smoke layer to Screen, since brightness equals opacity',
            'Duplicate the red channel and raise its black input point to 90',
          ], 2, 'Smoke has no outline to trace: how bright a pixel is already states how opaque that smoke is, so Screen blending drops the black backdrop and keeps the smoke at its true density.'),
        ]
      ),
      lesson('Frequency Separation and Commercial Skin Retouching', 13, `
The revision note said "she looks like a mannequin". You had spent three hours on that face. Every blemish was gone, the skin was smooth, and that was precisely the problem: the pores went with the spots, and a face without pores reads as plastic at any size above a thumbnail.

Frequency separation exists so you can stop doing that.

### The model: texture riding on tone

Split a photograph into two layers that add back to the original exactly:

- Low frequency: broad colour and tone. Shading, blotches, the fall from cheek to jaw.
- High frequency: fine detail. Pores, stubble, fabric weave, eyelashes.

Most of what people call bad skin is a low frequency problem: uneven redness, a patch of shadow, a green cast under the eye. Most of what people call character is high frequency. Edit them separately and you fix the first without destroying the second.

### Building the split

\`\`\`text
1  Duplicate your retouched layer twice. Name them low (bottom) and high (top).
2  Hide high, select low.
   Filter > Blur > Gaussian Blur.
   Raise the radius until blemishes vanish but the face keeps its shape.
   4000 px wide portrait: usually 6 to 10 px. Note the number.
3  Select high. Image > Apply Image.
     8 bit  : Layer low, Blending Subtract, Scale 2, Offset 128
     16 bit : Layer low, Blending Add, Invert ticked, Scale 2, Offset 0
4  Set high to Linear Light.
\`\`\`

Step 3 trips everybody. Use the 8 bit settings on a 16 bit file and you get a flat grey slab or a blown white one. Check \`Image > Mode\` before you open Apply Image, every single time.

Done correctly the stack looks identical to the original. Toggle the group off and on. If anything shifts, your Apply Image settings were wrong, and no amount of careful brushwork afterwards will rescue it.

### Which problem goes on which layer

| Problem | Layer | Tool |
|---|---|---|
| Blotchy redness across a cheek | low | Lasso at 20 px feather, then blur |
| Uneven shading under the eye | low | Mixer Brush or a small blur |
| Spot with visible texture | high | Healing Brush, Sample: Current Layer |
| Stray hair over the forehead | high | Clone Stamp, Sample: Current Layer |
| Shiny highlight on the nose | low | It is tone, not texture |

Sampling Current Layer is not optional. Leave the tool on All Layers and it pulls the flattened composite back in, reintroducing the very frequencies you just separated.

### The edge trap

Heal a blemish on the high layer near the jawline and the Healing Brush reaches across into the dark background, then blends what it found. You get a grey smear worse than the spot you started with. Draw a rough lasso inside the face first so the tool physically cannot cross the boundary. The same rule applies at the hairline, the lip line and the edge of a nostril.

### Do less than you think

The professional habit is not more frequency separation. It is less.

Even the shading with dodge and burn on a 50 per cent grey layer set to Soft Light, which respects texture by nature. Save frequency separation for the jobs it is uniquely good at: a colour patch no dodge can lift, a blemish whose texture must go while its shading stays.

Check at 100 per cent, then check at final output size. A retouch that survives 100 per cent and looks overcooked on the printed page is overcooked.

One discipline worth keeping: after an hour, hide every retouch layer, look at the original for ten seconds, then bring them back. If the person changed identity, you went too far. Blur the low layer at 25 px and every face becomes the same face.
      `,
        [
          q('You build a frequency separation on a 16 bit file but run Apply Image with Subtract, Scale 2, Offset 128. What do you get?', [
            'A flat grey high layer, and the stack no longer matches the original',
            'A correct split, because Photoshop adapts the settings to bit depth',
            'An inverted high layer, showing the texture as a negative image',
            'Sharp texture, but the low layer loses its Gaussian Blur radius',
          ], 0, 'The 8 bit and 16 bit Apply Image recipes are different, so using the 8 bit settings on a 16 bit file produces a high layer that does not reconstruct the original, which you can confirm by toggling the group off and on.'),
          q('Why must the Healing Brush be set to Sample: Current Layer while you work on the high frequency layer?', [
            'Because the high layer sits above the low layer in the stack',
            'Because Linear Light blending doubles every sampled pixel value',
            'Because sampling All Layers pulls the composite back into the fix',
            'Because the healing algorithm needs a feathered lasso to work',
          ], 2, 'Sampling All Layers reads the flattened result, which reintroduces the low frequency tone you deliberately separated out, so the repair carries shading it should not have.'),
          q('A portrait has a hot shiny highlight on the nose. Which layer should you work on, and why?', [
            'high, because a specular highlight is a fine detail edge',
            'low, because a specular highlight is tone rather than texture',
            'high, then drop that layer\'s opacity to about 40 per cent',
            'low, using the Clone Stamp sampling from the high layer',
          ], 1, 'A shine is a broad brightness change with no fine detail of its own, so it belongs to the low frequency layer where you can even the tone without touching pore texture.'),
        ]
      ),
      lesson('Luminosity Masks and Grading a Set to a Single Look', 13, `
Twenty four frames from a one day shoot. Morning light in the first eight, a flat overcast hour in the middle, tungsten practicals by the end. The client wants them running as one spread in a lookbook, and they have to read as one afternoon.

Brushing masks frame by frame will not get you there. Two things will: masks built from the image's own brightness, and a single grade applied identically to all twenty four.

### A mask with no edge

Hold Cmd (Ctrl on Windows) and click the RGB composite thumbnail in the Channels panel. Photoshop loads a selection whose strength at every pixel equals that pixel's luminance. A pixel at 230 is 90 per cent selected. A pixel at 30 is 12 per cent selected.

Nothing was traced, so there is no edge to go wrong. Add a Curves layer with that selection live and it pulls the bright sky down hard, the mid tone building a little, and the shadowed doorway almost not at all, with a transition as smooth as the original gradient. A hand brushed mask over the same sky leaves a pale halo along the roofline. Everyone has seen that halo. This is where it comes from.

### Narrowing the range

One selection covers everything bright. Narrow it by intersecting it with itself.

\`\`\`text
Lights 1   Cmd/Ctrl click the RGB thumbnail
Lights 2   then Cmd+Shift+Alt click RGB again    (intersect, narrower)
Lights 3   repeat once more                      (near specular only)
Darks 1    load Lights 1, then Select > Inverse
Midtones   Select > All, subtract Lights 2, subtract Darks 2
\`\`\`

Each intersection multiplies the mask by itself. A pixel at 200 (78 per cent) becomes 61 per cent, then 48. The mask darkens and the affected range tightens. Lights 3 is what you reach for to recover a blown window without touching the room around it.

Save each one as an alpha channel. Naming them \`L1\`, \`L2\`, \`D1\` costs ten seconds and saves you rebuilding them at midnight.

### Turning one grade into twenty four

Grade a hero frame properly, then move the grade, not the work.

| Method | Portable | Editable later | Use when |
|---|---|---|---|
| Copy the layer group | yes | yes | Under ten frames, similar exposure |
| Camera Raw preset | yes | yes | Raw originals, whole shoot |
| Exported 3D LUT (.cube) | yes | no | Handing a look to video or another studio |
| Colour Lookup layer | yes | opacity only | Applying a bought or exported look |

Export your own with \`File > Export > Color Lookup Tables\`, then apply it anywhere through a Colour Lookup adjustment layer.

Order matters more than method. Normalise first, grade second. Match white balance across the set to within roughly 150 K and exposure to within a third of a stop before any look goes on top. A grade is a fixed transform: feed it a frame half a stop dark and it hands back crushed shadows, not a slightly darker version of the look.

### A grade you can describe in an email

Split toning through Curves, with real numbers:

\`\`\`text
Blue channel     black point output 0 -> 8      cool shadows
Red channel      input 255 -> output 249        warm, softly rolled highlights
RGB composite    input 24 -> output 16          contrast in the low end
Hue/Saturation   -8 master, +6 on Reds only     skin holds, the rest settles
\`\`\`

Four moves, reproducible, and they survive being handed to a second retoucher.

### What goes wrong

A LUT is baked. You cannot dial it back to 40 per cent strength, only fade the layer, which mixes the graded and ungraded image rather than applying a weaker grade. Highlights that clip inside the LUT stay clipped, and no later curve recovers them. Build the look with live adjustment layers while it is still being approved, and export the LUT only once it is signed off.
      `,
        [
          q('You darken a bright sky by brushing a mask on a Curves layer and get a pale halo along the roofline. Why does a luminosity mask avoid that?', [
            'It feathers the brush edge automatically to a 60 px radius',
            'It selects by hue, so the roof and the sky separate cleanly',
            'Its strength follows pixel brightness, so no edge is traced',
            'It applies the curve in 16 bit, which prevents banding there',
          ], 2, 'A luminosity selection sets each pixel\'s strength from that pixel\'s own brightness, so there is no drawn boundary anywhere near the roofline for a halo to form along.'),
          q('Why must exposure and white balance be matched across a set before a shared LUT goes on?', [
            'A LUT is a fixed transform, so a dark frame returns crushed shadows',
            'A LUT only reads the red channel unless the file is 16 bit',
            'Colour Lookup layers cannot be masked, so errors cannot be hidden',
            'Photoshop resamples the LUT to match the document colour profile',
          ], 0, 'A LUT maps each input value to one fixed output value, so an underexposed frame gets its already dark tones mapped further down and clips, instead of receiving a slightly darker version of the same look.'),
          q('You Cmd click the RGB composite thumbnail, then Cmd+Shift+Alt click it a second time. What changed?', [
            'It now covers shadows rather than highlights, because of Alt',
            'It was saved as an alpha channel called Alpha 1 automatically',
            'It inverted, so the mid tones are now fully selected instead',
            'It intersected with itself, so only the brightest tones stay strong',
          ], 3, 'Intersecting the luminosity selection with itself multiplies the mask by its own values, which darkens every mid tone and leaves only the brightest range meaningfully selected.'),
        ]
      ),
      lesson('Generative Fill and AI Retouching: What It Fixes and What It Breaks', 13, `
You extend a 6000 px wide campaign banner by 1800 px with Generative Fill. Fitted to the window it is seamless. The printed proof comes back with a visibly soft band down the right hand third, as though someone breathed on that part of the lens. Nothing in your file is wrong. Those pixels were simply never that big.

### Generated content has its own resolution

Generative Fill renders the selected region at its own native size, around a thousand pixels across, then scales the result to fill your selection. Select 1800 px inside a 6000 px document and Photoshop is upscaling roughly 1.8 times before anything lands in your file. Select 600 px and it downsamples, which costs you nothing.

The working rule: keep any single generation to about 1024 px of final output, and build a large extension from several overlapping tiles instead of one heroic selection.

\`\`\`text
Bad   one selection, 1800 x 2400 px, one prompt, one result
Good  three selections, roughly 900 px each, overlapping by 150 px
      generate each, then blend the seams with a soft layer mask
\`\`\`

### It is a layer, not a commitment

Each generation arrives as a Generative Layer with its own mask and three variations in the Properties panel. Your original pixels are untouched, the variations stay live, and you can mask the result by hand. Treat it as a proposal you finish, not an answer.

The counter intuitive part is the prompt. For removal, leave it empty. An empty prompt tells Photoshop to reconstruct from surrounding content. Typing "clean wall" biases it toward inventing something matching those words, which is how people end up with a second, smaller wall inside their wall.

### Where it earns its place, and where it costs you

| Task | Verdict | Why |
|---|---|---|
| Extending sky, wall, road, sand | Good | No structure to get wrong |
| Removing a bin, cable, exit sign | Good | Surrounding content defines the fix |
| Filling behind a moved element | Good | Small region, low detail |
| Rough comps for client sign off | Good | Speed matters, fidelity does not yet |
| Anything with legible text | Bad | Letterforms come back garbled |
| Hands, teeth, jewellery, logos | Bad | Learned averages, not this object |
| Straight architectural lines across a seam | Bad | Perspective drifts a degree or two |
| The client's actual product | Bad | You are inventing the thing being sold |

That last row is the one to memorise: fix the environment, never the product. A generated fold in a shirt is a shirt the client does not sell.

### The two tells

Grain. Generated pixels are clean. Your plate carries sensor noise, softening toward the corners and a grain structure from the ISO it was shot at, so at 100 per cent the patch looks glassy next to it. Add a layer filled with 50 per cent grey, set it to Overlay, run \`Filter > Noise > Add Noise\` at 2 to 4 per cent, Gaussian and Monochromatic, and clip it to the generative layer.

Colour mode. Generative Fill needs an RGB document and sits greyed out in CMYK. Inherited packaging files are usually CMYK, so you convert to RGB, generate, convert back with the correct profile and re proof. That round trip is not free, which is one more reason to do generative work early rather than at the end.

### Provenance travels with the file

Photoshop writes Content Credentials (C2PA metadata) into files touched by generative features. Regulated categories, pharmaceutical, financial services, food and automotive, frequently prohibit synthetic content in product imagery, and some ad platforms read that metadata directly. Ask before generating on anything being sold, and keep a note in the job folder of which layers were generated. Discovering the problem at legal sign off costs a reshoot.
      `,
        [
          q('You run Generative Fill on a 2800 px wide strip of a 6000 px banner and the result prints noticeably soft. What explains it?', [
            'The banner was in CMYK, so the fill rendered at 72 ppi instead',
            'Generated content has its own native size and was upscaled to fit',
            'Generative layers are always rasterised at half the document size',
            'The prompt was left empty, so a low quality content fill was used',
          ], 1, 'Generative Fill renders at roughly a thousand pixels across regardless of your document size, so a selection far wider than that is scaled up before it lands, losing detail the surrounding photograph still has.'),
          q('Generative Fill is greyed out on a packaging file you inherited from another studio. What is the most likely cause?', [
            'The layer is a Smart Object and must be rasterised to generate',
            'The selection is below the 1024 px minimum needed for a fill',
            'Content Credentials have been switched off in the preferences',
            'The document is in CMYK, and the feature requires RGB to run',
          ], 3, 'Generative Fill only operates on RGB documents, so a CMYK packaging file has to be converted to RGB for the generation and converted back with the correct profile afterwards.'),
          q('A bin removed with Generative Fill looks glassy at 100 per cent against the rest of the plate. What is the correct fix?', [
            'Match the grain by adding noise over the generated region',
            'Regenerate it with a longer and more descriptive text prompt',
            'Convert the generative layer to a Smart Object and sharpen it',
            'Raise the generative layer\'s opacity back up to 100 per cent',
          ], 0, 'Generated pixels come back free of sensor noise, so they sit visibly cleaner than the photograph around them until you add matching grain over the patch.'),
        ]
      ),
      ],
      [
      q('You must darken only the brightest tones of a frame with no halo along a hard skyline. Which approach fits?', [
        'Brush a black to white gradient onto a Curves mask by hand',
        'Duplicate the blue channel and raise its Levels black point',
        'Set the Curves layer to Linear Light and lower its opacity',
        'Curves masked by a twice intersected luminosity selection',
      ], 3, 'Intersecting a luminosity selection twice restricts the adjustment to the brightest range, and because the mask is derived from brightness rather than drawn, there is no boundary along the skyline for a halo to appear on.'),
      q('Which of these is the wrong use of frequency separation on a portrait?', [
        'Removing a spot whose texture must go but whose shading stays',
        'Blurring the whole low layer at 25 px to smooth all the skin',
        'Evening a green cast under the eye with a feathered lasso',
        'Cloning a stray hair off the forehead on the high layer',
      ], 1, 'Blurring the entire low layer is just skin blurring with extra steps, and it flattens the natural shading of the face into the plastic look that clients reject.'),
      q('Which statement about a mask built from a duplicated colour channel is correct?', [
        'Its grey values carry partial transparency for hair and smoke',
        'It must be painted pure black or white before it will load',
        'It lives inside the layer, so deleting the layer removes it',
        'It only works on images that have been converted to 16 bit',
      ], 0, 'The mid greys in a channel mask describe pixels that are only partly covered by the subject, which is exactly what makes the technique work on hair, glass and smoke.'),
      q('A pharmaceutical client\'s hero pack shot needs a scuffed box edge cleaned and the background extended. What is the defensible split of work?', [
        'Generate both, then flatten so Content Credentials are stripped',
        'Generate the box edge, retouch the background for correct grain',
        'Retouch the box by hand, generate only the background extension',
        'Refuse both and reshoot, since the metadata cannot be removed',
      ], 2, 'Generative tools invent plausible detail rather than reproducing this object, so the product itself must be retouched by hand while the surrounding environment is safe to generate, which also keeps the claim about the product honest.'),
      ]
    ),
    chapter(
      'Production at Volume: Templates, Actions, and Data',
      'Producing four hundred assets without doing the same job four hundred times, using templates, actions and data instead of patience.',
      [
      lesson('Linked Smart Objects and Templates That Update Everywhere', 13, `
Thursday afternoon. The client signs off the whole campaign, then asks for the logo lockup to sit 4 mm higher and the strapline to lose its full stop. There are 42 banners. If the logo was embedded in each one, that is 42 files opened, edited, saved and re-exported, and 42 chances to miss one. If it was linked, it is one file saved.

### Embedded and linked are two different bargains

\`File > Place Embedded\` copies the entire source into your document. \`File > Place Linked\` writes a file path and a preview, and reads the real artwork off disk every time the document opens.

The cost difference is not subtle. A 120 MB layered packshot embedded into 18 layouts is 2.1 GB of duplicated pixels on your drive, in your backups, and in every upload to the client portal. Linked, it is 120 MB once.

| Method | Where the pixels live | Updates everywhere | Travels alone |
|---|---|---|---|
| Place Embedded | Inside each document | No | Yes |
| Place Linked | One file on disk | Yes | No, needs the source |
| CC Library asset | Adobe's cloud | Yes, across machines | Yes, if the recipient has access |

Embedded is right for a one-off composite that will never be reused. Linked is right for anything that appears more than once: logos, packshots, straplines, legal small print, pricing panels.

### The link is a path, and paths break

Move the source and the layer thumbnail gets a warning badge. Edit the source while a layout is closed and it gets a modified badge instead, cleared with \`Layer > Smart Objects > Update All Modified Content\`. Photoshop will not silently pull in changes you have not looked at.

So keep the links where the documents can find them:

\`\`\`text
campaign-fenwick-aw26/
  _links/
    logo-lockup-primary.ai
    packshot-750ml.psd
    strapline-en-gb.psd
  banners/
    fenwick-300x250.psd
    fenwick-728x90.psd
    fenwick-1080x1350.psd
\`\`\`

Before anything leaves your machine, run \`File > Package\`. It copies the document plus every linked source into a fresh folder with a Links subfolder, and repoints the links at it. Sending a linked PSD without packaging is sending a document full of question marks.

### Replace Contents is the move that saves the week

A mockup template works because the transform belongs to the layer, not to the artwork inside it. Warp a smart object into a shop window, add a shadow layer above and a reflection below, and the geometry is now permanent scaffolding. \`Layer > Smart Objects > Replace Contents\` swaps the pixels underneath and keeps every transform, mask, layer style and smart filter exactly as they were.

That is what makes 30 product mockups a 20 minute job rather than a day.

### Scaling is not resolution

Here is the one that catches people who trust the badge. A 480 px wide cutout linked into a 3000 px banner and scaled up to fill half the width is still 480 px of real detail. Non destructive means you can undo the scale, not that Photoshop found extra information. The layer looks official, the smart object badge sits there reassuringly, and the export is soft.

Check the source dimensions, not the layer bounds. Every time.

### The classic mistake

Renaming source files. \`logo-final-v3.ai\` becomes \`logo-approved.ai\` during a tidy up, and 42 documents go yellow at once. Photoshop relinks one layer at a time, so that tidy up costs an afternoon.

Fix the filenames on day one and never touch them again. Version inside the file with dated layer comps or a \`_archive\` folder, never in the name of something 42 documents depend on.
      `,
        [
          q('A packshot PSD is placed into 18 layouts with Place Embedded. The retoucher then fixes a dust mark in the original source file. What happens to the 18 layouts?', [
            'They update as soon as each layout is next opened in Photoshop',
            'They show a modified badge and update on Update All Modified Content',
            'Nothing changes, because each layout holds its own copy of the pixels',
            'They break and show a missing file warning on the packshot layer',
          ], 2, 'Place Embedded copies the entire source into each document, so the 18 layouts no longer have any relationship with the original file and the dust mark stays in all of them.'),
          q('Why does File > Package matter before you send a link-heavy PSD to another studio?', [
            'It copies every linked source into a Links folder beside the document',
            'It converts each linked smart object back into embedded pixel data',
            'It flattens the smart objects so the other studio cannot edit them',
            'It repoints the links at your Creative Cloud account for sharing',
          ], 0, 'Package gathers the document and every file it links to into one folder and rewrites the links to point there, so the recipient opens a complete job instead of a page of warning badges.'),
          q('A 480 px wide product cutout is linked into a 3000 px banner and scaled up to fill half the width. Why does it still look soft?', [
            'The link holds only a low resolution preview until content is updated',
            'Linked smart objects render in the document profile, not the source one',
            'Scaling a smart object rasterises its contents at the current layer size',
            'Non destructive scaling still reuses the 480 px of detail it started with',
          ], 3, 'Non destructive means the scale can be undone, not that Photoshop found extra detail, so the layer is still built from 480 px of real information no matter how large the frame is.'),
        ]
      ),
      lesson('Actions, Droplets, and the Image Processor', 13, `
Three hundred and eighty product shots come back from a studio day. Each one needs the same four moves: convert to sRGB, resize the long edge to 2000 px, sharpen, save a JPEG at quality 9. Forty seconds each by hand is over four hours of clicking. Recorded once and batched, it is eleven minutes and you are not in the room for any of it.

### An action is a list of commands, not a screen recording

Photoshop records menu items, dialog values and layer operations. It does not record what you paint. Brush strokes, clone stamp passes and dodge and burn work are invisible to the recorder, because they are judgement, and judgement does not repeat.

\`\`\`text
Action: web-2000
  Convert to Profile   sRGB IEC61966-2.1, Relative Colorimetric
  Image Size           Long edge 2000 px, Bicubic Sharper
  Unsharp Mask         Amount 80%, Radius 0.6 px, Threshold 2
  Save As              JPEG, Quality 9, Embed Colour Profile ON
  Close                Save: No
\`\`\`

Two toggles sit to the left of every step. The checkbox includes or skips it. The dialog icon makes it modal: off means the step runs silently with the recorded values, on means Photoshop stops and shows you the dialog. Turn the dialog on for Image Size when a batch mixes portrait and landscape and you want eyes on each one.

For commands that refuse to record, use \`Insert Menu Item\`. For a step a human has to do, use \`Insert Stop\` with a message and Allow Continue ticked.

### Batch, and the save trap that catches everyone once

\`File > Automate > Batch\` points an action at a folder. The trap is the Save As step you recorded, because it baked in the folder you happened to be saving to that day. Run it over 380 new files and 380 JPEGs land in a job folder from 2019, while your Destination folder stays empty.

Tick **Override Action "Save As" Commands**. Photoshop then keeps the format and quality settings from the action but writes to the Destination folder, using the File Naming rules you set there. Note the other half of that rule: if the action has no Save As step at all, Photoshop saves each file in its original format, which is rarely what you wanted either.

### Droplets and the Image Processor

\`File > Automate > Create Droplet\` writes a small application holding the action plus its batch settings. Drag a folder of images onto it and Photoshop launches and runs. Two things bite. A droplet built on macOS will not run on Windows, and a droplet stores the path to the exact Photoshop version that made it, so a major update orphans it. Rebuild droplets after every upgrade.

\`File > Scripts > Image Processor\` handles the common case with nothing recorded at all. Point it at a folder, tick JPEG, PSD and TIFF together, set a fit-within width and height, and optionally run an action as part of the same pass. It creates the subfolders itself. Its resize is fit within, not crop, so a 3000 x 2000 and a 2000 x 3000 both come out inside the box you set.

| Job | Reach for |
|---|---|
| Same edits, one folder, one output format | Batch plus an action |
| Three formats and sizes in one pass | Image Processor |
| A drop folder a colleague uses | Droplet |
| Anything needing a decision per image | Your hands |

### The classic mistake

Recording an action while a layer called \`Curves 1\` was selected. Actions record layer selection by name. On the next file that layer is \`Curves 2\`, the action stops dead with an error about an object that is not currently available, and the batch halts on file three of 380.

Record actions that create the layers they need rather than selecting layers that already exist. Then the action does not care what came before it.
      `,
        [
          q('Your action ends with Save As JPEG into a 2019 job folder. You run Batch over 380 new files and do not tick Override Action Save As Commands. What happens?', [
            'Batch refuses to run and warns that the recorded folder is missing',
            'All 380 JPEGs land in the 2019 folder and your Destination stays empty',
            'Each file saves beside its own source, because Batch settings always win',
            'The action skips its save step and every file closes without changing',
          ], 1, 'A recorded Save As step carries the folder path it was recorded with, so without the override Photoshop obeys the action rather than the Destination you set in Batch.'),
          q('Which of these cannot be captured by recording a Photoshop action?', [
            'An Image Size step resizing the long edge of the file to 2000 pixels',
            'A Convert to Profile step targeting sRGB with a chosen rendering intent',
            'An Unsharp Mask carrying set amount, radius and threshold values',
            'Twelve clone stamp passes taking a cable off a textured brick wall',
          ], 3, 'Actions record commands and their parameters rather than painting, so brush, clone and dodge and burn work is invisible to the recorder because it depends on judgement that does not repeat.'),
          q('You need a 2000 px JPEG and a full size TIFF from each of 300 raw conversions. What is the shortest route?', [
            'Image Processor, ticking JPEG and TIFF together and setting a fit size',
            'Two separate recorded actions and two Batch runs over the same folder',
            'One droplet per format, dragged across the source folder one at a time',
            'A single action holding two Save As steps with Override ticked in Batch',
          ], 0, 'The Image Processor writes several formats and sizes in one pass and builds the output subfolders itself, so it needs no recording and no second run over the folder.'),
        ]
      ),
      lesson('Data-Driven Graphics: Variables, CSV, and Five Hundred Versions', 13, `
Five hundred and twelve conference badges, due Monday. Name, job title, company and a headshot on each one. Three minutes a badge by hand is 25 hours, which is not a weekend, it is a resignation. The same job through Variables is roughly 40 minutes of setup and six minutes of export.

### Three kinds of variable, bound by layer name

\`Image > Variables > Define\` lets you attach one of three behaviours to a chosen layer:

- **Text Replacement** swaps the string inside a type layer
- **Pixel Replacement** swaps the contents of a layer with an image file from disk
- **Visibility** shows or hides the layer per record

The binding is by layer name, so name the layers before you bind anything: \`var_name\`, \`var_title\`, \`var_company\`, \`var_headshot\`, \`var_vip_stripe\`.

### The data set is a spreadsheet with rules

\`Image > Variables > Data Sets > Import\` takes a comma or tab delimited text file saved as UTF-8. The header row must match your variable names character for character.

\`\`\`csv
DataSet,var_name,var_title,var_company,var_headshot,var_vip_stripe
0421,Amara Okafor,Head of Design,Northbank Studio,headshots/0421.jpg,TRUE
0422,Wei Zhang,Principal Engineer,Halden Rail,headshots/0422.jpg,FALSE
0423,Fatima Al-Rashid,Director of Brand,Vellum Group,headshots/0423.jpg,TRUE
\`\`\`

Tick Use First Column For Data Set Names and each record is called 0421, 0422 and so on, so the exported files carry the badge number. Visibility variables take TRUE and FALSE. Pixel replacement takes a path relative to the data file.

A trailing space in a header is the most common failure on this whole workflow, and Photoshop reports it as absolutely nothing. The column is simply ignored, the variable stays unbound, and every badge keeps whatever the template said.

### Pixel replacement has a method, and the default will bite

Each pixel variable carries a replacement method and a nine point alignment.

| Method | Behaviour |
|---|---|
| Conform | Stretches the image to the bounding box, ignoring aspect ratio |
| Fit | Scales to fit inside, leaving gaps on one axis |
| Fill | Scales to cover, crops the overflow, keeps proportions |
| As Is | Places at native size, no scaling |

Conform is how you end up with 512 badges of wide, squashed faces. Use Fill, aligned top centre, so cropping takes chin rather than forehead.

### Export, then convert

\`File > Export > Data Sets as Files\` writes PSD only, one per record, and it is fast. So the pipeline that actually ships is two stages:

\`\`\`text
1  Export Data Sets as Files   ->  /out/psd/0421.psd ... 0512.psd
2  Image Processor over /out/psd
     -> /out/tiff  300 ppi print files
     -> /out/jpg   1200 px versions for the event app
\`\`\`

Split the labour that way and each half stays simple: variables generate the records, actions and the Image Processor convert them.

### Overset text is what ruins the run

Photoshop will not shrink type to fit. "Wei Zhang" and "Fatima Al-Rashid" go into the same box, and a 31 character job title on a 60 mm badge either runs off the edge or wraps to three lines and collides with the logo.

Before exporting 512 files, sort the spreadsheet by string length and preview the longest name, the longest title and the longest company as data sets. Fix the layout for those three and the other 509 look after themselves. Paragraph type in a fixed box at least wraps. Point type just keeps going into the bleed.

### Illustrator and InDesign do this differently

Illustrator's Variables panel binds text, visibility, linked files and graph data, and loads CSV directly rather than only XML. InDesign's Data Merge is the better tool when the record is long and paginated, because it flows text across frames and can place several records on one sheet.

### The classic mistake

Renaming a bound layer after defining its variable. The binding silently detaches, no warning appears, and you export 512 badges that all say the same name.
      `,
        [
          q('Your CSV header column reads var_title followed by a stray space, while the variable itself is named var_title. What do you see after export?', [
            'Every badge keeps the placeholder job title that is in the template',
            'Photoshop halts the import and names the header column at fault',
            'The titles import correctly but land against the wrong data set names',
            'The bound layer unbinds and vanishes from all of the exported files',
          ], 0, 'Header names must match variable names character for character, and a mismatch is ignored silently rather than reported, so that column never reaches the layer and the template text survives.'),
          q('Portrait headshots are coming out wide and squashed inside a square photo frame on every record. Which setting is wrong?', [
            'The data set file is tab delimited when it should be comma delimited',
            'The headshot layer was bound as Visibility instead of Pixel Replacement',
            'The pixel replacement method is set to Conform rather than to Fill',
            'The headshot paths are absolute rather than relative to the data file',
          ], 2, 'Conform stretches each image to the bounding box and ignores aspect ratio, so a tall headshot is distorted sideways, while Fill scales to cover and crops the overflow instead.'),
          q('Export Data Sets as Files has produced 512 PSDs from your badge template. Why is the job not finished?', [
            'The PSDs still carry live variables, so they must be flattened first',
            'Print and the event app need PDF and JPEG, so a batch pass follows',
            'PSD does not reliably preserve layers created by pixel replacement',
            'The files are named by row number and all need renaming by hand',
          ], 1, 'The export writes PSD only, so a second stage using the Image Processor or a batched action is what turns those records into the print and screen formats the job actually delivers.'),
        ]
      ),
      lesson('Artboards and Export Pipelines: Shipping Every Size at Once', 13, `
One campaign, and this list arrives from the media plan: 1080 x 1080, 1080 x 1350, 1080 x 1920, 1200 x 628, 728 x 90, 300 x 250, 160 x 600. Seven sizes, three language variants, two colourways. That is 42 exports. Building 42 documents is how a Friday disappears.

### An artboard is a frame with a name, and the name becomes the filename

In Photoshop, select your layers and choose \`Layer > New Artboard from Layers\`, or grab the Artboard tool nested under the Move tool. Each artboard is a group with a defined frame. Artwork that strays outside is hidden on export but not destroyed, so a photograph can hang off the edge and still be repositioned later.

The naming is not cosmetic. Compare what lands in the folder:

\`\`\`text
Artboard 1.png
Artboard 1 copy.png
Artboard 1 copy 2.png
Artboard 2.png
\`\`\`

against:

\`\`\`text
fenwick-aw26_en-gb_1080x1350.png
fenwick-aw26_en-gb_1200x628.png
fenwick-aw26_de-de_1080x1350.png
\`\`\`

Rename the artboards, never the exports. Media buyers, ad servers and every review spreadsheet sort by filename, and the first list costs somebody an hour of guessing.

### Export for Screens does the scales in one pass

Illustrator: \`File > Export > Export for Screens\`. Choose artboards, add a row per scale, set a suffix and a format per row, export once.

| Row | Scale | Suffix | Format |
|---|---|---|---|
| 1 | 1x | none | PNG |
| 2 | 2x | @2x | PNG |
| 3 | 3x | @3x | PNG |
| 4 | 1x | none | SVG |

Photoshop's \`File > Export > Export As\` does the same job with less ceremony: select the artboards in the Layers panel, right click, Export As, and add size rows there.

### Generator writes files while you work

Turn on \`File > Generate > Image Assets\` in Photoshop and layer names become build instructions. Save the document and the files appear:

\`\`\`text
hero-bg.jpg80
200% [email protected], logo-mark.png
banner-300x250.png24
\`\`\`

A comma separates multiple assets generated from one layer, a percentage or a pixel dimension prefix scales it, and a number after \`jpg\` or \`png\` sets quality or bit depth. Useful when a developer is watching a folder while you are still moving things.

### Scale factors are a resolution decision you make on day one

Export for Screens will cheerfully hand you a 3x PNG from a 1x master. The vector redraws perfectly. Every placed photograph gets upscaled 300 per cent and turns to porridge.

Build raster content at the largest size you will ever ship, then scale down. Down is free. Up is invented.

### The overlap trap, and it differs between the two apps

Photoshop artboards clip. An artboard exports its own child layers and nothing else, so a neighbour cannot leak in.

Illustrator artboards do not clip. They are rectangles drawn over one shared canvas, and export renders whatever falls inside the rectangle regardless of which board you think it belongs to. Put two boards 4 mm apart with a full bleed photograph on the left one, and a strip of that photograph appears down the edge of the right one. Space artboards generously, and park stray artwork well off the boards rather than just outside them.

### The classic mistake

Exporting the whole campaign, then finding the platform crops your 1080 x 1920 story into feed at 1080 x 1350 and the strapline now sits under the profile chrome.

Build the artboard set from the media plan before the design starts, and put each platform's safe area on a locked guide layer inside its own artboard. Then the inevitable resize round is a re-export, not a redesign.
      `,
        [
          q('Two Illustrator artboards sit 4 mm apart and the left one carries a full bleed photograph. What appears in the right artboard\'s export?', [
            'Nothing extra, because each artboard exports only its own child art',
            'A warning that artwork crosses an artboard edge, blocking the export',
            'The photograph, but only when both boards sit on the same named layer',
            'A strip of the photograph, because artboards are only view rectangles',
          ], 3, 'Illustrator artboards do not clip and do not own artwork, so the export renders everything falling inside the rectangle including a neighbouring board\'s bleed.'),
          q('Why is renaming artboards worth doing before you run Export for Screens?', [
            'Unnamed artboards export at 1x only and quietly ignore extra scale rows',
            'The artboard name becomes the filename that every later tool sorts by',
            'Illustrator refuses to export two artboards that carry duplicate names',
            'Artboard names decide which boards are included in the export selection',
          ], 1, 'The exporter writes each file using its artboard name, so meaningful names give ad servers, review sheets and developers a folder they can sort and read without guessing.'),
          q('Your master is built at 1x and contains placed photography. You add a 3x row to Export for Screens. What comes out?', [
            'The export fails, because raster content cannot be scaled by export rows',
            'Everything stays crisp, since Export for Screens re-renders every source',
            'Vector artwork stays sharp while the placed photographs are upscaled',
            'Illustrator substitutes each linked original at its own native resolution',
          ], 2, 'Vector geometry is redrawn at any size, but placed photographs only hold the pixels they already had, so a 3x row enlarges them by three hundred per cent and softens them.'),
        ]
      ),
      ],
      [
      q('A client wants 500 personalised gift vouchers, each carrying a different name and code, printed on 350 gsm card. Which route fits the job?', [
        'Variables and data sets driving one template, then a batch pass to PDF',
        'One action recorded on the first voucher and then run over the folder',
        'A droplet holding the voucher layout, with the spreadsheet dropped onto it',
        'Export for Screens across 500 artboards each named by its voucher code',
      ], 0, 'Per record text changes are exactly what variables and data sets exist for, and the PSDs they produce are then converted in a second automated pass for the printer.'),
      q('Halfway through a 400 asset run the client changes the strapline wording. Which build turns that into a five minute fix?', [
        'Each asset carries the strapline as live editable type on its own layer',
        'The strapline was flattened into each background before any exporting',
        'Every asset embeds its own copy of the same strapline smart object file',
        'One linked strapline file that all 400 assets point at on the same disk',
      ], 3, 'A linked smart object stores a path rather than a copy, so editing the single source and updating modified content pushes the new wording through every document that references it.'),
      q('After a colleague tidies the server, a folder of layouts opens with warning badges on many layers. What most likely happened?', [
        'The layouts were saved by a Photoshop version older than the linked files',
        'The links were embedded, so the original source files became read only',
        'Source files were renamed or moved, so the stored paths no longer resolve',
        'The document colour profile changed and invalidated the stored previews',
      ], 2, 'A linked smart object remembers a file path, so renaming or moving the source leaves the document pointing at somewhere that no longer holds that file.'),
      q('Which of these jobs is the wrong fit for a recorded action?', [
        'Converting 200 studio shots to sRGB and resizing the long edge to 2000 px',
        'Deciding which of 200 studio shots need a cable removed by hand and where',
        'Adding a 5 mm white border and saving a proof JPEG from a folder of stills',
        'Applying one saved Curves preset across a folder of evenly lit still frames',
      ], 1, 'Actions replay fixed commands and cannot make a decision per image, so anything that requires looking at a picture and judging what it needs has to stay with a person.'),
      ]
    ),
    chapter(
      'Vector for Screen: Icons, SVG, and Developer Handoff',
      'Making vector artwork that a browser renders crisply and an engineer can drop straight into a build without redrawing a single path.',
      [
      lesson('The Pixel Grid: Icons That Stay Crisp at 16 Pixels', 13, `
A 24 by 24 search icon, drawn with the pen tool, curves checked at 800 per cent. It ships in the navigation bar. On your Retina display it is perfect. On the finance team's 1080p monitor the magnifier's handle is a soft grey smear two pixels wide instead of one crisp black line. Nothing is wrong with the drawing. The path sits at x = 10 when it needed to sit at x = 10.5.

### How a browser turns geometry into pixels

A renderer asks one question per pixel: how much of this shape covers me? Full coverage paints full colour. Half coverage paints half strength. That is antialiasing, and on curves it is exactly what you want. On a vertical hairline it is a disaster.

A 1 px vertical stroke centred on x = 10 spans 9.5 to 10.5. That is the right half of pixel 9 and the left half of pixel 10. Each gets 50 per cent coverage, so the renderer paints two mid grey columns. Move the path to x = 10.5 and the stroke spans 10.0 to 11.0, one whole pixel, one solid line.

Even weights invert the rule. A 2 px stroke centred on x = 10 spans 9 to 11: two full pixels, crisp. Centre it on 10.5 and you get three columns, the outer two at half strength.

| Stroke weight | Centre the path on | Example X |
|---|---|---|
| 1 px | a half value | 6.5 |
| 2 px | a whole value | 6 |
| 3 px | a half value | 6.5 |
| 4 px | a whole value | 6 |

Fills are simpler: every edge of a filled shape lands on a whole number, whatever its size.

Here is the same three line menu icon, broken then fixed.

\`\`\`svg
<!-- fuzzy: 1px strokes centred on whole coordinates -->
<path d="M4 6 H20 M4 12 H20 M4 18 H20" stroke="#111" stroke-width="1"/>

<!-- crisp: identical lines, shifted half a pixel down -->
<path d="M4 6.5 H20 M4 12.5 H20 M4 18.5 H20" stroke="#111" stroke-width="1"/>
\`\`\`

### Set Illustrator up so it mostly does this for you

Start from the Web document profile so one unit equals one pixel. Turn on Pixel Preview (Cmd or Ctrl + Alt + Y) and stop trusting the vector view. Enable View > Snap to Pixel and Align New Objects to Pixel Grid.

Then check the numbers anyway. Read X, Y, W and H in the Transform panel. If any of them says 13.4271, the icon is off grid whatever the snapping promised. Snap to Pixel aligns a bounding box, and for an open stroked path that box includes half the stroke on each side, which is exactly the case where snapping puts you in the wrong place.

### Drawing at one size and shipping at another

Scaling 24 down to 16 is a factor of 0.6667. Your 2 px stroke becomes 1.333 px. Your 2 px corner radius becomes 1.333 px. Every coordinate goes fractional at once, and the whole set turns soft.

Sizes that divide cleanly are worth planning around: 16 and 32, 24 and 48. Across those pairs, 24 to 16 is the one that does not work, and it is the pair everyone needs.

So draw a separate 16 px master. Every serious set does: Material ships 20 and 24 grids as distinct drawings, and SF Symbols ships nine weights rather than scaling one.

The 16 px master is not the 24 px icon shrunk. It is redrawn with a smaller detail budget. A document icon with three text lines becomes two lines with 3 px gaps. The folded corner goes. The 2 px outer radius rounds to 1.

### The classic mistake

Select all, scale 66.67 per cent, export. If Scale Strokes and Effects was on, every stroke is now 1.333 px and blurred. If it was off, a 2 px stroke now sits on a 16 px canvas and the icon reads as a black blob. Either way, coordinates are fractional throughout.

The reason this reaches production is that you are looking at a 2x display, where a half pixel offset lands on a whole device pixel and looks fine. Zoom the browser to 100 per cent on a 1x monitor before you call an icon done.
      `,
        [
          q('A 1 px vertical stroke in a 24 px icon is centred on x = 8. Rendered at 1x, it looks like two soft grey lines. Why?', [
            'It spans half of pixel 7 and half of pixel 8, so both get 50 per cent coverage',
            'The file has no viewBox, so the browser scales the path by a fractional factor',
            'The stroke colour is being blended with the page background by the alpha channel',
            'The path was drawn on a 24 grid and the browser resamples it down to 16 first',
          ], 0, 'An odd stroke weight centred on a whole coordinate straddles the boundary between two pixels, giving each 50 per cent coverage, so the renderer paints two half strength columns instead of one solid line.'),
          q('You have a 24 px icon set with 2 px strokes and need a 16 px version. What happens if you simply scale the artboard to 66.67 per cent?', [
            'Illustrator refuses to scale strokes below 1 px, so the weight stays at a solid 2 px',
            'Every coordinate turns fractional and the strokes land at 1.333 px, entirely off grid',
            'The viewBox stays at 24, so the icon keeps rendering at its original size in a browser',
            'Corner radii scale but stroke caps do not, so every terminal becomes square and hard',
          ], 1, 'Scaling by a non integer factor pushes coordinates, stroke weights and corner radii onto fractional values at once, which is exactly the off grid condition that makes an icon look soft.'),
          q('Why does a pixel grid problem so often survive design review and reach production?', [
            'SVG files hide the problem until they are converted to PNG for the test suite',
            'Antialiasing is switched off on the Illustrator canvas, so all strokes preview crisp',
            'Designers work on 2x displays, where a half pixel offset covers a whole device pixel',
            'Browsers snap paths to the nearest whole pixel, and only older ones fail to do it',
          ], 2, 'On a 2x display a half pixel of artwork maps to one full device pixel, so the misalignment disappears for the person reviewing it and only shows up on a 1x monitor.'),
        ]
      ),
      lesson('SVG Anatomy: What Illustrator Writes and What to Strip', 13, `
Export a three shape icon from Illustrator with default settings. The file is 4.7 KB. The same icon written by hand is 287 bytes. Multiply by the sixty icons inlined into your page and you have shipped a quarter of a megabyte of generator comments.

File size is the boring problem. The interesting one turns your icons the wrong colour.

### What Illustrator actually writes

\`\`\`svg
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 28.0.0, SVG Export Plug-In -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
   x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"
   style="enable-background:new 0 0 24 24;" xml:space="preserve">
<style type="text/css">
  .st0{fill:#1B7F5A;}
</style>
<path class="st0" d="M12 2L22 20H2L12 2z"/>
</svg>
\`\`\`

Now inline two of these on the same page. Both declare \`.st0\`. CSS is global, so the second declaration wins for both files, and your green warning triangle turns whatever colour the other icon was. Each file is correct on its own, which is why this bug survives review and costs someone an afternoon.

Ids collide the same way. Gradients and clip paths come out as \`id="SVGID_1_"\` in every single export, and \`<use>\` references resolve to the first match in the document.

### What to keep and what to strip

| Attribute | Verdict | Why |
|---|---|---|
| \`viewBox\` | Keep always | The coordinate system. Without it, nothing scales |
| \`width\` / \`height\` | Strip | Let CSS decide the rendered size |
| \`id="Layer_1"\` | Strip | Panel name, meaningless in a build |
| \`xml:space="preserve"\` | Strip | Only affects text nodes you do not have |
| \`enable-background\` | Strip | No browser has ever implemented it |
| \`fill="#1B7F5A"\` | Change | Use \`currentColor\` so colour inherits |

Deleting \`viewBox\` is the one edit that genuinely breaks things. Without it the browser has no internal coordinate system, so the icon renders at its literal path size or collapses to nothing inside a flex container.

### currentColor is the whole trick

\`\`\`svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 12h16M14 6l6 6-6 6"/>
</svg>
\`\`\`

\`\`\`css
.btn .icon        { color: #3F4A45; }
.btn:hover .icon  { color: #1B7F5A; }
.btn[disabled] .icon { color: #B4BDB8; }
\`\`\`

No extra classes, no second file for the hover state, and the icon follows the text it sits next to.

### Export settings that get you most of the way

\`\`\`text
File > Export > Export As > SVG
  Styling      Presentation Attributes   (no <style> block, no .st0)
  Font         Convert To Outline
  Images       Embed
  Object IDs   Minimal
  Decimal      2
  Minify       on
  Responsive   on                        (drops width and height)
\`\`\`

Decimal is worth understanding. At 5 places a corner reads \`11.99999\`, at 2 it reads \`12\`. Across a sixty icon sprite that is thirty to forty per cent of the file, and no human can see the difference.

### Then run it through SVGO

\`\`\`bash
npx svgo --multipass --folder ./icons --output ./icons-min
\`\`\`

One trap: several SVGO presets enable \`removeViewBox\`, which does exactly what its name says and destroys every icon in the folder. Pin a config.

\`\`\`js
// svgo.config.js
module.exports = {
  multipass: true,
  plugins: [
    { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
    { name: 'prefixIds' },
  ],
};
\`\`\`

\`prefixIds\` rewrites \`SVGID_1_\` to something unique per file, which kills the gradient collision permanently.

### Strokes: keep them or outline them

A live stroke can be recoloured, re thickened from CSS, and animated with \`stroke-dasharray\` for a draw on effect. Outlining it (Object > Path > Outline Stroke) turns it into a filled shape that renders identically everywhere and can never be changed again.

For an icon set that a design system will tune, keep the stroke. For a logo going into a build where nobody should touch it, outline it.
      `,
        [
          q('Two icons exported from Illustrator with default settings are inlined into the same HTML page, and one renders in the wrong colour. What is the cause?', [
            'The second icon is missing its viewBox, so it inherits the geometry of the first',
            'Presentation attributes are ignored when an svg element is inlined rather than linked',
            'Inline SVG cannot use hex colours, so the browser falls back to the nearest named one',
            'Both files carry a style block defining .st0, and the second definition overrides the first',
          ], 3, 'Illustrator\'s default Internal CSS styling writes a global class such as .st0 into every file, and because CSS in a page shares one namespace the last declaration wins for every icon using that class name.'),
          q('Which attribute must never be stripped from an icon SVG, and why?', [
            'viewBox, because it defines the internal coordinate system the paths are drawn in',
            'width, because without it the svg element collapses to zero pixels across the page',
            'xml:space, because it preserves the whitespace inside the path data command strings',
            'enable-background, because it tells the renderer how to composite filter effects',
          ], 0, 'The viewBox establishes the internal coordinate system that lets an SVG scale to any rendered size, so removing it leaves the browser with no way to map the paths onto the box it is given.'),
          q('You outline the strokes of an icon before handing it to the engineering team. What does that decision rule out later?', [
            'Recolouring the icon from CSS by setting a colour on its parent element',
            'Animating a draw on effect, which needs a live stroke to run a dash offset',
            'Scaling the icon to any size without the shape losing its original proportions',
            'Optimising the file with SVGO, which only processes stroked path data',
          ], 1, 'Draw on animation works by animating stroke-dasharray and stroke-dashoffset, or Lottie trim paths, and all of those require a live stroke, which an outlined shape no longer has.'),
        ]
      ),
      lesson('Icon Systems: Grid, Weight, and Consistency Across a Set', 13, `
Forty icons. Every one drawn cleanly, every one on the pixel grid. Line them up in a toolbar and the set still looks wrong: the trash can towers over the magnifier, the calendar reads heavier than the clock next to it. Nobody can say why, and the client calls it "a bit unpolished".

The icons are fine. The bounding boxes were left to chance.

### The keyline grid

Take a 24 by 24 canvas, keep 2 px clear on every side, and you have a 20 by 20 live area. Inside it, four keyline shapes define how big anything is allowed to be.

| Keyline | Size on a 24 grid | Icons that use it |
|---|---|---|
| Square | 18 x 18 | Calendar, image, grid, tag |
| Circle | 20 diameter | Clock, user, info, globe |
| Portrait rectangle | 16 x 20 | Document, phone, book |
| Landscape rectangle | 20 x 16 | Card, video, wallet |

The circle is bigger than the square, and that is not a typo. A 20 px circle has an area of about 314 square pixels. An 18 px square has 324. Match the areas and the shapes read as the same size. Match the bounding boxes instead and the circle looks visibly small.

### One weight, everywhere

Pick a stroke weight as a fraction of the canvas and hold it. Two pixels on a 24 grid is roughly one twelfth of the width, so the same ratio gives you a coherent family.

| Grid | Stroke | Outer radius | Inner radius |
|---|---|---|---|
| 16 | 1.5 px | 1 px | 0 |
| 20 | 1.5 px | 2 px | 0 |
| 24 | 2 px | 2 px | 0 |
| 48 | 4 px | 4 px | 1 px |

Inner corners take a smaller radius than outer ones, or none at all. The inside of a stroked corner is already curving, so giving it the same radius as the outside makes the joint look swollen.

Then commit to terminals. Round caps with round joins, or butt caps with miter joins. Mixing them is the single most common reason a set feels assembled rather than designed, and it is invisible until you put two icons side by side.

### Optical centring beats mathematical centring

A play triangle centred by its bounding box looks pushed to the left, because its visual mass sits against the flat left edge while the right side tapers to a point.

\`\`\`text
bbox centred        M8 5  L19 12 L8 19  Z     reads left heavy
optically centred   M9 5  L20 12 L9 19  Z     reads centred
\`\`\`

One pixel. That is the whole correction, and it applies to every asymmetric mark you draw: send arrows, magnifiers, bookmarks, anything with a point on one end.

### The detail budget

An icon is a word, not a picture. At 16 px you get roughly five to seven strokes before it turns to porridge. The test is simple: whatever still reads at 16 is an icon, and anything that only works at 48 is an illustration that wandered into the wrong folder.

### The audit that finds everything

\`\`\`text
1. Paste the whole set into one artboard, in a row, at 24 px.
2. Duplicate the row, scale it to 16 px, turn on Pixel Preview.
3. Flatten every icon to one flat colour. Colour hides weight problems.
4. Blur the artboard by 2 px, or just squint. Uneven grey means uneven weight.
5. Measure each icon's optical width. Everything should land within 2 px of 20.
\`\`\`

Step three catches more than the other four combined.

### The classic mistake

Half the set comes from a free icon pack, half you drew yourself. The pack was built on a 20 grid at 1.5 px with butt caps. Yours is 24 at 2 px with round caps. Users cannot name the problem, so they say the product feels cheap.

There is no blending the two. Either redraw the pack's icons on your grid, or adopt the pack's grid completely and redraw yours. And keep one metaphor per concept: if a pencil means edit, a pencil never also means draw.
      `,
        [
          q('On a 24 by 24 keyline grid, why is the circle keyline 20 px across while the square keyline is only 18?', [
            'A circle needs the extra room because its antialiased edge spreads over two pixels',
            'The square is reduced to 18 so its corner radius can be applied without any clipping',
            'A 20 px circle and an 18 px square have almost the same area, so they read as equals',
            'Circles are drawn outward from their centre, so the grid measures them differently',
          ], 2, 'Optical size follows area rather than bounding box, and a 20 px circle covers about 314 square pixels against 324 for an 18 px square, which is why matching those two makes the shapes look the same size.'),
          q('A play triangle is centred by its bounding box at 12,12 on a 24 grid. What is wrong with it?', [
            'The bounding box of a triangle excludes its stroke, so the shape ends up sitting too high',
            'Three anchor points cannot be centred on an even grid without a fractional coordinate',
            'Rotating a triangle by 90 degrees moves its bounding box off the pixel grid entirely',
            'Its mass sits against the flat edge, so it reads left heavy and needs shifting right',
          ], 3, 'Visual weight follows where the area actually sits, and because a triangle tapers to a point on one side its mass gathers at the flat edge, so a bounding box centre reads as off centre until you nudge it toward the point.'),
          q('Half your set came from a free pack drawn on a 20 grid at 1.5 px with butt caps, and half is yours on a 24 grid at 2 px with round caps. What fixes it?', [
            'Redraw one half on the other half\'s grid so weight, caps and live area all match',
            'Scale the pack\'s icons up by 20 per cent so that both halves share a 24 px canvas',
            'Set both halves to a single flat colour, since colour is what unifies an icon set',
            'Keep both and use the pack\'s icons only at small sizes, where the weight matches',
          ], 0, 'Grid, stroke weight and terminal style are what make a set read as one family, so the only real fix is to bring every icon onto one set of those rules by redrawing, since scaling changes weight along with size.'),
        ]
      ),
      lesson('Handing Vector to Engineers: Specs, Tokens, and Motion-Ready Files', 13, `
Third time this sprint an engineer has asked what colour the icon goes on hover. Everyone treats it as a communication problem and adds another Slack thread. It is not. The handoff shipped shapes and no specification, so the answer lives only in your head.

Fix the package, not the conversation.

### Pick one delivery format and commit to it

| Format | Good for | The cost |
|---|---|---|
| Individual SVG files | Small sets, pipelines that inline at build | One request each if not inlined |
| SVG sprite with \`symbol\` | Thirty icons or more, plain HTML | Regenerate the sprite on every change |
| Framework components | React or Vue apps | Needs a build step you do not own |
| Icon font | Nothing, in 2026 | Fails badly, see below |

Icon fonts put glyphs in the Unicode Private Use Area. When the font fails to load, and it will, every icon becomes an empty box or a random CJK character, and a screen reader reads the codepoint aloud. That failure mode alone ends the argument.

### Naming is an API, not a filing decision

Engineers turn your filenames into variable names. Kebab case, lowercase, size suffix last, and name the shape rather than the job.

\`\`\`text
good   icon-arrow-right-16.svg   icon-trash-24.svg   icon-user-24.svg
bad    Arrow Right Final v2.svg  delete.svg          Profile Icon.svg
\`\`\`

Why \`arrow-right\` and not \`next\`: the same arrow is also forward, expand, submit and continue. Name it by use and you will ship four byte identical files with four different names, then update three of them.

### Ship tokens, not screenshots

\`\`\`json
{
  "icon": {
    "size":   { "sm": 16, "md": 24, "lg": 32 },
    "color":  { "default": "#3F4A45", "hover": "#1B7F5A", "disabled": "#B4BDB8" },
    "stroke": { "width": 2, "linecap": "round" }
  }
}
\`\`\`

One file, imported by the build. Nobody types a hex code by hand, and when the hover green shifts you edit one line instead of auditing forty components. Pair it with \`currentColor\` in the SVGs and the colour question never comes back.

### Accessibility is your job, not theirs

\`\`\`html
<!-- decorative: the button already has a visible label -->
<button class="btn"><svg aria-hidden="true" focusable="false">...</svg> Delete</button>

<!-- the icon is the only label -->
<button class="btn" aria-label="Delete">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>
\`\`\`

\`focusable="false"\` because some browsers put inline SVGs into the tab order, giving keyboard users an invisible stop on every icon in the page.

### Motion ready files

If an icon will ever animate, three rules decide whether the animator can use your file or has to redraw it.

1. Do not flatten. Pathfinder and Merge destroy the groups the animation depends on. Keep each moving part as a named group: \`lid\`, \`can\`, \`lines\`.
2. Do not outline strokes. A draw on animation runs on \`stroke-dasharray\` and \`stroke-dashoffset\` in CSS, or trim paths in Lottie. Both need a live stroke. Outline it and the effect becomes impossible.
3. Avoid clipping masks and gradient strokes. Lottie's web renderer handles them poorly, and a mask that previews perfectly in After Effects can arrive in the browser as a black rectangle.

### The folder you actually send

\`\`\`text
icons/
  svg/       optimised, currentColor, viewBox only, no width or height
  sprite/    icons.svg, one symbol per icon, ids prefixed
  source/    icons.ai, 24 grid, keylines on a locked layer
  motion/    trash-open.ai, named groups, live strokes
  tokens.json
  README.md  grid, stroke weight, sizes, and how to add a new icon
\`\`\`

The last line of that README matters more than everything above it. Without instructions for adding an icon, number forty one gets drawn by whoever needed it that Friday, on whatever grid they happened to have open, and the drift starts there.
      `,
        [
          q('Why is an icon font a poor delivery format for a product icon set today?', [
            'It cannot be recoloured from CSS, so every colour needs its own separate font file',
            'If the font fails to load, Private Use Area glyphs render as boxes or random characters',
            'A font file cannot hold more than 64 glyphs, so a large set has to be split in two',
            'Glyphs rasterise when the page loads, so the icons blur on any display above 1x',
          ], 1, 'Icon font glyphs live in the Unicode Private Use Area, so when the font is blocked or slow every icon degrades into a fallback box or an unrelated character and screen readers announce the raw codepoint.'),
          q('An animator asks for the trash can icon as a motion ready file. Which version do you send?', [
            'A single flattened path, so the animator has one clean closed outline to work from',
            'A PNG sequence exported at 3x, so the animator can match the rendered pixels exactly',
            'Named groups for lid and can, strokes left live, and no Pathfinder merges applied',
            'An SVG with the lid inside a clipping mask so that it can be revealed as it opens',
          ], 2, 'An animator needs separately addressable parts to move and live strokes to run trim paths or dash offsets, and flattening or merging the artwork destroys both of those before the file ever arrives.'),
          q('Why name a file icon-arrow-right-24.svg instead of icon-next-24.svg?', [
            'Engineers cannot use direction words inside variable names without escaping them',
            'The build pipeline sorts files by shape name, so directions must precede the noun',
            'Screen readers announce the filename aloud, so it has to describe the destination',
            'The same arrow is also forward, expand and submit, so a use name duplicates files',
          ], 3, 'Naming an icon after one of its uses hides the fact that the same shape serves several purposes, so the set ends up with multiple identical files that then drift apart as only some get updated.'),
        ]
      ),
      ],
      [
      q('You inline sixty Illustrator exported icons into one page and colours start swapping unpredictably. Which export change fixes it at source?', [
        'Set Styling to Presentation Attributes so fills are written onto the paths themselves',
        'Set Decimal to 2 so that coordinates stop colliding between neighbouring icon files',
        'Turn on Responsive so that width and height are dropped from every exported file',
        'Set Font to Convert To Outline so no shared font reference survives in the icon set',
      ], 0, 'Presentation Attributes writes the fill directly onto each path and emits no style block at all, which removes the shared class names that were colliding across the inlined files.'),
      q('A 24 px icon with 1 px hairlines looks crisp on the design machine and fuzzy on the client\'s laptop. What is the most likely cause?', [
        'The client\'s laptop runs an older browser that does not antialias SVG strokes at all',
        'The hairlines sit on whole coordinates, which splits each one across two pixels',
        'The file was exported with Decimal set to 5, so the path data is too precise to render',
        'The icon was saved as SVG 1.1 rather than SVG 2, which older engines render differently',
      ], 1, 'Odd stroke weights need to sit on half coordinates to cover a single pixel, and the fault is invisible on a 2x design display because the half pixel offset lands on a real device pixel there.'),
      q('What belongs in the tokens.json you ship alongside an icon set?', [
        'The path data for every icon, so that engineers never need to open the SVG files',
        'A screenshot of each icon at 16, 24 and 32 px to serve as a visual reference',
        'Icon sizes, colours and stroke width as named values the build can import',
        'The Illustrator source layer names, so the keyline grid can be rebuilt later',
      ], 2, 'Tokens exist so that spec values live in one machine readable place the build imports, which means a colour or size change is a single edit rather than a hunt through every component.'),
      q('An engineer needs every icon to change colour on hover without editing the SVG files. What must those files already do?', [
        'Declare a CSS class on each path that matches the class on the parent component',
        'Carry explicit width and height attributes so that CSS is able to override both',
        'Include an inline style block that sets the fill with an important flag on it',
        'Set fill or stroke to currentColor so the parent element\'s colour is inherited',
      ], 3, 'currentColor makes an SVG resolve its fill or stroke from the inherited CSS color property, so any hover, disabled or theme rule on an ancestor recolours the icon with no change to the file.'),
      ]
    ),
    chapter(
      'Dimensional Work: Dielines, Packaging, and Large Format',
      'Artwork that has to fold, wrap or be read from thirty metres away, where the geometry matters as much as the design does.',
      [
      lesson('Reading and Building a Dieline: Cut, Crease, and Bleed in Three Dimensions', 13, `
Ten thousand folding cartons come off the pallet with a thin magenta outline printed around every panel and dashed magenta lines running down each fold. The dieline printed. The whole run is scrap, and the invoice has your name on it.

### A dieline is a manufacturing drawing, not artwork

It tells a steel rule die where to sever the board, where to crease it so it bends without cracking the coating, and where to perforate a tear strip. Prepress strips it out before plating, but only if you hand it over labelled the way their system expects.

| Line | Drawn as | What the machine does |
|---|---|---|
| Cut | Solid | Blade severs the board |
| Crease or fold | Dashed | Blunt rule presses a channel, board bends |
| Perforation | Dotted | Alternating cut and land, tear open feature |
| Reverse crease | Dash dot | Folds the opposite way, for tucks and gussets |
| Glue area | Flat tint | Adhesive lands here, keep ink and varnish off |
| Bleed | Solid, own layer | Where artwork must reach, never a die |

### Build the file so prepress can strip it in one click

\`\`\`text
Layer  DIELINE     topmost, locked, Print checkbox OFF
  Swatch  Dieline   Spot colour, 100M, Overprint Stroke ON
  Strokes only, 0.25 pt, zero fills anywhere on this layer
Layer  ARTWORK     everything you designed
Layer  BLEED       non printing guide, cut path offset outward 3 mm
\`\`\`

Two rules that never bend. Never redraw a dieline by tracing the PDF the converter sent, because your trace lands 0.4 mm out and the window will not sit over the film. Never scale one either, not even to 99.8 per cent to make a headline fit, because the die already exists in steel.

### Bleed wraps around corners, not just off the edge

On a flat sheet, bleed means 3 mm past the trim. On a carton it also means running colour past every crease that carries artwork onto the next panel. Board wanders a little as it travels through the folder gluer, so a solid navy panel that stops exactly on the crease shows a white hairline down the finished edge on maybe one carton in forty.

### Caliper eats millimetres

A dieline is drawn flat, but the finished product has thickness. 350 micron folding boxboard means every wall takes up 0.35 mm, so the panel that tucks inside must be narrower than the one it tucks into or the lid bows and never sits flush. The converter has already built that into the CAD file, which is precisely why you must not adjust panel widths yourself.

A straight tuck end carton for a 90 x 55 x 20 mm product:

\`\`\`text
Front 90.0   Side 20.0   Back 90.0   Side 20.0   Glue flap 6.0
Blank width   226.0 mm
Dust flaps    18.0 mm each, they sit inside the tuck
Tuck panel    19.4 mm, cut 0.6 mm short of the 20 mm side
\`\`\`

That 0.6 mm looks like a rounding error until you hold the carton. It is board thickness plus clearance, and it is the difference between a lid that snaps shut and one that springs open on the shelf.

### Fold a paper one before you send anything

Print the blank at exactly 100 per cent on a laser printer, score the creases with an empty ballpoint against a steel rule, cut it out, assemble it. Five minutes. It catches back panels that read upside down, artwork that runs sideways once the carton stands up, and copy sitting 2 mm from a crease that the fold radius then swallows.

### The classic mistake

Designing to the flat outline instead of the folded object. The front panel looks beautifully balanced on screen because you centred everything inside the rectangle. Assembled, the top 3 mm curls over the crease and the product name sits visibly low. Hold live copy 5 mm clear of every crease and 4 mm clear of every cut, then check it on the paper mock rather than on the artboard.
      `,
        [
          q('A carton has a solid navy back panel, and the artwork stops exactly on the crease between the back and the side. What turns up on the finished run?', [
            'The crease cracks the coating and navy ink flakes along the fold',
            'The die cuts through the navy rather than creasing it at that point',
            'A white hairline down the folded edge on part of the run, from board shift',
            'The navy prints darker on the side panel because ink builds at the fold',
          ], 2, 'Board wanders slightly as it travels through the folder gluer, so colour that stops on the crease leaves an unprinted sliver visible along the folded edge; artwork has to run over the crease and onto the neighbouring panel.'),
          q('The converter\'s dieline leaves your headline 1.5 mm too wide for the front panel. What is the correct response?', [
            'Reset the headline smaller, because the die already exists in steel',
            'Scale the dieline to 99.8 per cent so the panel gains the millimetre',
            'Trace a fresh dieline in Illustrator with that panel widened to fit',
            'Push the headline 1.5 mm over the crease onto the side panel instead',
          ], 0, 'The cutting die is a physical tool that has already been made, so the artwork is the only thing that can move; scaling or redrawing the dieline guarantees the cut will no longer match the file.'),
          q('Why should the dieline layer use a named spot swatch with overprint stroke switched on, instead of a 100 per cent magenta process build?', [
            'A process magenta build separates over four plates and prints faint',
            'Overprinting keeps the dieline from appearing on the contract proof',
            'Only spot swatches can hold a stroke weight as fine as 0.25 pt',
            'Prepress removes the named plate, and overprint stops it knocking out artwork',
          ], 3, 'Prepress isolates the die by its swatch name and drops that plate before platemaking, and overprinting means the dieline never punches a white hole through the artwork sitting underneath it.'),
        ]
      ),
      lesson('Packaging Artwork: Panel Hierarchy, Barcodes, and Mandatory Information', 13, `
A supermarket depot turned away a delivery of 8,000 units. The design was signed off, the print was flawless, the colour matched the contract proof. The barcode was printed in the brand's deep red on white, and the till scanner, which reads with a 660 nm red laser, saw white bars on a white field. Nothing to read.

### The barcode has rules and none of them are aesthetic

An EAN-13 at nominal size measures 37.29 x 25.93 mm including its quiet zones. Magnification between 80 and 200 per cent of that is acceptable. Below 80 per cent, failure rates climb hard.

| Requirement | Value | Reason |
|---|---|---|
| Magnification | 80 to 200 per cent | Below 80, bar edges blur together |
| Quiet zone | 2.31 mm left, 1.65 mm right | Scanner needs blank space to find the start |
| Bar colour | Black, dark blue, dark green | Red light has to be absorbed |
| Background | White, cream, pale yellow | Red light has to reflect |
| Bar height | Full, never truncated | Truncation defeats angled scans |

Never gold, never metallic, never a photograph behind the bars. Two further traps live on the press itself.

\`\`\`text
Flexo on corrugated  ask prepress for the bar width reduction figure
                     typically 0.02 to 0.05 mm, applied in the generator
                     never fake it by scaling the barcode art
Print direction      bars parallel to the web wherever possible
                     bars across the web smear as the plate stretches
\`\`\`

### Panels have jobs

| Panel | Carries |
|---|---|
| Front | Brand block, variant, net quantity, one claim at most |
| Back | Ingredients, nutrition, storage, address, barcode |
| Sides | Recycling marks, certifications, secondary claim |
| Top or tuck | Variant colour, shelf ready identification |
| Base | Batch code and best before, coded inline by the filler |

That last row costs designers jobs. The filling line jets a batch code onto the base with an inkjet head, so leave a clean unvarnished area roughly 40 x 12 mm. Print your pattern across it and the code lands illegible on every unit.

### Mandatory information is a size, not a suggestion

EU regulation 1169/2011 sets a minimum x-height of 1.2 mm, dropping to 0.9 mm where the largest surface is under 80 square centimetres. Note that it is x-height, not point size. A humanist sans with a generous x-height clears 1.2 mm around 6.5 pt, while a face with a small x-height needs 8 pt to hit the same measurement. Allergens must be visually distinguished from the rest of the ingredient list, normally by weight.

### The dead zones

Seal jaws on a flow wrapper crush and gloss 8 to 10 mm of film at each end. Glue flaps take no varnish and no critical copy. Crease radii swallow around 2 mm each side. On a 60 mm back panel with two creases and a sealed end, the column you can actually set into is closer to 44 mm.

### Reverse printing on film

Clear and metallised films are printed on the inside, so the whole layout is mirrored and a white ink layer sits behind anything that should read as opaque. That white is a separate spot, usually choked about 0.2 mm so it cannot peep out from behind the colour. Establish whether you are supplying flood white, spot white or none before you lay out a single element.

### The classic mistake

Setting the legal panel last, at whatever size is left over. Ingredient lists grow through sign off, the legal team adds a line, and the type gets squeezed to 5 pt to fit. Block the legal panel out first, at the legal minimum, in the real typeface, using the longest ingredient list anyone can imagine. Design the rest of the pack around what survives.
      `,
        [
          q('A drinks brand wants its EAN-13 printed in brand gold on a dark navy panel. What happens at the checkout?', [
            'It scans, but only if the magnification is raised above 150 per cent',
            'It fails, because scanners need dark bars absorbing red light on a light field',
            'It fails, because metallic ink corrupts the check digit calculation',
            'It scans, provided the quiet zones are doubled to offset the contrast',
          ], 1, 'A till scanner reads reflected red light, so it needs bars that absorb it against a background that reflects it; gold on navy gives the sensor almost no contrast to resolve, whatever the magnification.'),
          q('A flow wrapped bar has a 60 mm back panel with a crease near each edge and a sealed jaw at each end. Why is the usable column for ingredient copy well under 60 mm?', [
            'Flow wrap film shrinks around 10 per cent passing through the heat tunnel',
            'Barcode quiet zones reserve 12 mm at each side of any printed panel',
            'Reverse printed film needs a 6 mm white ink margin around every text block',
            'Crease radii and the crushed, glossed seal areas each take several millimetres',
          ], 3, 'The seal jaws crush and gloss 8 to 10 mm of film at each end and every crease radius eats roughly 2 mm on each side, so the flat area you can actually set legible type into is much narrower than the panel.'),
          q('Food labelling rules set the minimum for mandatory information as a 1.2 mm x-height. Why is restating that as a point size unreliable?', [
            'x-height varies by typeface, so one point size can pass or fail the rule',
            'Point size measures printed cap height, which regulators do not recognise',
            'Point sizes shift when artwork is converted from RGB into CMYK for press',
            'The rule is written in millimetres, and points cannot be converted to them',
          ], 0, 'Point size describes the em, not the letters, and the ratio of x-height to em differs widely between typefaces, so 7 pt can clear 1.2 mm in one face and fall short in another.'),
        ]
      ),
      lesson('Large Format: Viewing Distance, Scale Factors, and Tiled Panels', 13, `
A 6 x 3 m billboard at 300 ppi would be 70,866 x 35,433 pixels, about 9.3 GB flattened as 8 bit CMYK. No RIP wants it. Standing on the pavement in front of the hoarding, you could not tell it apart from a file one twentieth the size.

### Resolution is a function of distance, not of the word "print"

The eye resolves roughly one arcminute of angle. At 30 m that arcminute covers about 8.7 mm, so a roadside board could technically survive on 3 ppi. Practical minimums sit higher because dithering, moire and the RIP's own smoothing all need something to chew on.

| Closest viewing | ppi at full size | 6 x 3 m pixel count |
|---|---|---|
| Handled, 300 mm | 200 to 300 | not sane at this size |
| 1 m, exhibition panel | 150 | 35,433 x 17,716 |
| 2 to 3 m, retail banner | 100 | 23,622 x 11,811 |
| 5 m, building banner | 72 | 17,008 x 8,504 |
| 30 m, roadside | 20 to 25 | 4,724 x 2,362 |

### Work at a scale factor, and do the arithmetic once

\`\`\`text
effective ppi at 1:1 = document ppi x scale factor

1:10 at 300 ppi  =  30 ppi full size   roadside board, fine
1:4  at 300 ppi  =  75 ppi full size   5 m banner, fine
1:10 at 600 ppi  =  60 ppi full size   5 m banner, fine, double the file
\`\`\`

Then say it out loud in the file name: \`westgate-hoarding_6000x3000mm_1to10_300ppi.pdf\`. A printer who has to guess the scale will guess wrong at some point, and it will be your job.

### What breaks when you scale

Strokes and type, because both are measured in points and points do not care about your intentions. Watch the broken version first.

\`\`\`text
Broken   1:10 hoarding, headline set at 18 pt because it looked right on screen
         at 1:1 that is 180 pt, cap height near 44 mm, readable from 5 m
         the phone number got 9 pt, so 22 mm caps, unreadable from the road
Fixed    work backwards from distance
         allow roughly 8 mm of cap height per metre of viewing distance
         read at 4 m needs 32 mm caps, at 1:10 that is 3.2 mm, about 13 pt
         read at 25 m needs 200 mm caps, at 1:10 that is 20 mm, about 80 pt
\`\`\`

The same trap catches rules. A 0.25 pt hairline at 1:10 prints at 2.5 pt, nearly a millimetre wide, a heavy band where you drew a whisker. Check that Scale Strokes and Effects is on before you resize anything, and check every inherited file for what happened when it was off.

### Tiled panels

Wide format printers stop at 1.6 m, 3.2 m or 5 m of roll width. Anything wider arrives as tiles, and where the seams fall is a design decision, not a production detail.

\`\`\`text
Panel 1 of 3   0    to 2015 mm   15 mm overlap on the right
Panel 2 of 3   2000 to 4015 mm   15 mm overlap on both sides
Panel 3 of 3   4000 to 6000 mm   15 mm overlap on the left
\`\`\`

Equal thirds are a habit, not a rule. Move the seam so it misses faces, words and logos, even if the panels end up 1.8 m, 2.4 m and 1.8 m. Long gradients across a seam are the other hazard: two panels can print an hour apart with different head temperatures, so a smooth sweep of sky arrives as a visible step.

Hems, pole pockets and eyelets take their own bite. A 100 mm pole pocket folds 100 mm of your artwork out of sight, so hold live content 60 mm inside the finished edge and let background run out.

### The classic mistake

Sending one 1:1 PDF with 400 MB of linked images and letting the printer work out the tiling. They will split it into equal panels, because that is the default, and the seam will land through the model's eye.
      `,
        [
          q('You build a 6 x 3 m roadside hoarding at 1:10 inside a 300 ppi document. What resolution does the finished piece have at full size?', [
            '30 ppi, which is ample for a board read from around 30 metres',
            '300 ppi, because the RIP resamples the file as it scales it up',
            '3000 ppi, since enlarging the artwork multiplies its resolution',
            '150 ppi, as wide format RIPs halve input resolution by default',
          ], 0, 'Effective resolution at final size is the document resolution multiplied by the scale factor, so 300 ppi at one tenth size delivers 30 ppi at 1:1, which is comfortably enough for roadside viewing.'),
          q('A 0.25 pt hairline rule looks exactly right inside a 1:10 hoarding file. What does it do at full size?', [
            'It holds at 0.25 pt, because stroke weights are absolute inside a PDF',
            'It disappears, because the RIP drops sub pixel strokes at low resolution',
            'It prints at 2.5 pt, nearly a millimetre wide, reading as a heavy band',
            'It doubles to 0.5 pt, since scaling affects only fills and placed images',
          ], 2, 'Stroke weights scale with the artwork, so a tenth size hairline becomes ten times heavier at full size, which turns a delicate 0.25 pt rule into a 2.5 pt band roughly 0.9 mm thick.'),
          q('A 6 m banner will be printed as three tiled panels. Where should the seams be placed?', [
            'At exactly 2 m and 4 m, so all three panels come out the same width',
            'Wherever they miss faces, words and logos, even if panel widths differ',
            'Through the smoothest gradient, where a step between panels hides best',
            'At the edge of the darkest area, since dark ink conceals the overlap',
          ], 1, 'Seam position is a design decision, so it should be moved off anything the eye reads closely, and long smooth gradients are the worst place for it because panels printed apart can differ enough to show a step.'),
        ]
      ),
      lesson('Signage and Wraps: Substrates, Seams, and Install-Ready Files', 13, `
The van came back from the wrappers with the managing director's face split down the sliding door gap and a handle recess punched through the phone number. Everyone had approved the artwork from a flat rectangle on screen. A van is not a flat rectangle.

### Vehicle templates are drawn from measurements, not photographs

Buy the outline for the exact model, year and wheelbase, then read its layers before you draw anything. A good template marks panel gaps where the vinyl is cut and tucked, recesses for handles, fuel flaps and rubbing strips, corrugations on the rear doors, glass, and a safe area.

The rule that saves the job: nothing anyone needs to read crosses a gap, a recess or a rivet line. Faces, logos, phone numbers, web addresses. Add 50 to 100 mm of bleed around every panel, because film gets wrapped into door edges and around corners rather than stopping at them.

Compound curves stretch cast film 10 to 20 per cent. Put a circular roundel on the rear corner of a Sprinter and it arrives as an ellipse. Move it onto a flat panel or accept the distortion, but decide before print.

### Substrate decides what is possible

| Material | Suited to | Life |
|---|---|---|
| Cast vinyl, 50 micron | Compound curves, full wraps, rivets | 7 to 10 years |
| Polymeric calendered, 75 micron | Gentle curves, flat panels, long term | 5 to 7 years |
| Monomeric calendered, 100 micron | Flat only, short campaigns | 1 to 3 years |
| One way vision perforated | Windows, 50/50 or 60/40 open area | 2 to 3 years |
| Aluminium composite, 3 mm | Rigid signs, fascias, totems | 10 years plus |

Monomeric film on a curved panel is the cheap quote that fails. It shrinks as the plasticiser migrates, lifts at the edges, and shows grey adhesive lines within a season.

Perforated window film has its own catch. Half the surface is holes, and behind those holes sits a dark shop interior, so the print reads 40 to 50 per cent duller from the street than it does on your monitor. Lift the midtones, push saturation, and throw out hairline rules and small type before they turn to mush.

### The cut path is a spot colour, not a stroke you drew

\`\`\`text
Layer  CutContour        topmost, nothing else on it
  Swatch  CutContour     Spot colour, name exactly as the RIP expects
  Stroke only, no fill, 0.25 pt, Overprint Stroke ON
  One closed path per piece, no open paths, no stray anchors
Artwork bleeds 3 mm outside the cut path on every side
\`\`\`

Swatch names differ by cutter, so ask: CutContour, Thru-cut and Regmark all appear in the wild, and a path the RIP does not recognise gets printed as a magenta line instead of cut.

Plain cut vinyl with no print has one more constraint: weeding. An installer picks the waste film away by hand, and the counters of letters like a, e and o are loose islands that fall out. Below roughly 25 mm cap height, hairline serifs snap during weeding. Pick a grotesque with even stroke weight for anything cut.

### The install ready handover

\`\`\`text
File per panel   westgate_transit_nearside-door_1to20.pdf
Scale            in the file name and as a non printing note on the art
Live area        marked, 60 mm inside every hem, eyelet and fixing
Cut path         CutContour spot, own layer, overprinting
Type             outlined, or fonts supplied and embedded
Images           linked at working scale, packaged with the file
Colour           brand spots named, not converted to nearest CMYK
\`\`\`

### The classic mistake

Approving a wrap from a flat proof. Send the installer your artwork on the template and ask for a marked up photograph of the actual vehicle with the graphics overlaid, taken from the side and the three quarter view. Ten minutes of somebody's afternoon against a full set of vinyl and a second install.
      `,
        [
          q('A cheaper quote comes back proposing monomeric calendered vinyl for a Transit, corrugated rear doors included. What goes wrong?', [
            'The print heads cannot lay enough ink density onto calendered film',
            'Monomeric film cures too slowly and the overlaminate lifts within a week',
            'Colour shifts warm, because calendered film carries a yellow base tint',
            'It shrinks and lifts off the corrugations, showing adhesive lines in months',
          ], 3, 'Monomeric film is made for flat, short term work and its plasticiser migrates over time, so on curved or corrugated panels it shrinks back, lifts at the edges and exposes grey adhesive lines.'),
          q('Artwork printed on 60/40 one way vision film reads washed out and murky from the pavement. What step was skipped?', [
            'The film needed an optically clear overlaminate to restore its contrast',
            'The art was not lifted to offset the perforations and the dark interior',
            'The file was supplied in CMYK rather than the printer\'s RGB workflow',
            'The perforation pattern should have been drawn into the art as a mask',
          ], 1, 'Around 40 per cent of the surface is open holes backed by a dark shop interior, so the print loses a large slice of apparent brightness and the artwork has to be pushed in midtones and saturation before print.'),
          q('Why is a contour cut path supplied as a stroked spot colour on its own layer, rather than as a shape filled with magenta?', [
            'A filled shape would push total ink coverage past the substrate limit',
            'Spot colours cut faster, because the RIP skips halftone processing',
            'The RIP finds the path by swatch name and sends it to the blade, not the heads',
            'Stroke weight carries the blade pressure setting through to the cutter',
          ], 2, 'The cutter driver looks for a specific named spot swatch and routes those paths to the knife instead of the print heads, so a shape filled with process magenta simply gets printed as magenta artwork.'),
        ]
      ),
      ],
      [
      q('A client sends what they call a dieline, but it is a flattened PDF screenshot of the converter\'s drawing. What is the right move?', [
        'Ask the converter for the original vector CAD file and wait for it',
        'Trace it with the Pen tool at high zoom and work on the traced paths',
        'Auto trace it with Image Trace, then clean up the surplus anchor points',
        'Design to it anyway and let prepress redraw the die to match your file',
      ], 0, 'The steel die is cut from the converter\'s own geometry, so any traced or auto traced version will be fractionally out and the cut will not match the artwork; only the original vector file guarantees registration.'),
      q('One job is a 90 mm carton panel, the next is a 6 m hoarding. Which statement holds true for both?', [
        'Both need artwork at 300 ppi at final size to satisfy a modern RIP',
        'Both should be supplied at 1:1 with every image embedded in the PDF',
        'Both need bleed of exactly 3 mm on each outer edge of the artwork',
        'Both need live copy held clear of a physical edge, crease, seam or hem',
      ], 3, 'Dimensional work always has geometry that consumes artwork, whether it is a crease radius, a tucked panel, a tiled overlap or a folded hem, so live copy has to be inset from those features on every job.'),
      q('Why should a barcode never be positioned across a carton crease or on a glue flap?', [
        'Ink density drops on glue flaps, which weakens the contrast of the bars',
        'A bent or glued surface distorts the bar widths and defeats the scanner',
        'Labelling rules require the barcode within 20 mm of the ingredient list',
        'Creases print from a separate plate that the barcode cannot be part of',
      ], 1, 'Scanners measure the relative widths of bars and spaces, so a fold or an adhesive ripple running through the symbol changes those widths optically and the code stops decoding reliably.'),
      q('A 1:10 hoarding file and a 1:20 vehicle template both leave your studio. What must go with each one so nobody has to guess?', [
        'A flattened RGB preview showing how the finished piece should look',
        'A note confirming all effects were rendered at 300 ppi before export',
        'The scale, stated in the file name and as a non printing note on the art',
        'A colour bar and registration marks placed outside the trim on every edge',
      ], 2, 'A scaled file looks identical to a full size one once it is opened, so the scale factor has to travel with it in writing, otherwise the printer or installer outputs it at the wrong dimensions.'),
      ]
    ),
    chapter(
      'Brand Systems at Scale: Governance, Drift, and Rebrand',
      'Keeping one identity coherent across many hands, many channels and several years, then moving it cleanly when it finally has to change.',
      [
      lesson('From Guidelines Document to a Living Brand System', 13, `
A brand guidelines PDF ran to 96 pages, took eleven weeks to produce, and was downloaded 31 times in eighteen months. Over the same period the design inbox took 612 requests for assets that were already specified inside it. The document was not wrong. It was unreachable, and an unreachable rule is not a rule.

### A rule nobody enforces is a suggestion

Split what you produce into two piles. **Rules** describe intent: minimum size, tone of voice, when the single colour mark is used instead of the full one. **Artefacts** carry that intent whether or not anyone reads anything: the template with the margins already set, the swatch library containing only approved colours, the font sitting on the right machine under the right licence. Every rule you push down into an artefact stops needing enforcement.

The test is blunt. Take a rule and ask what a rushed marketing coordinator at 6pm would do to break it. If the answer is "drag the logo smaller", the rule lives only in the document. If the answer is "unlock a locked layer, delete a linked smart object and place a JPEG in its slot", the rule lives in the artefact and will mostly hold.

### The layers of a living system

| Layer | What lives here | Changes how often |
|---|---|---|
| Primitives | Colour values, type scale, spacing units, grid | Rarely, and never quietly |
| Assets | Logo files, icon set, photography, illustration | Quarterly |
| Components | Ad templates, deck master, social kit, letterhead | Monthly |
| Patterns | Worked examples, edge cases, what good looks like | Continuously |
| Rationale | Why the mark is built this way, what it must never become | Once per identity |

Most guidelines documents describe only the top row and the bottom row. The middle three are where the actual work happens, and they are the rows a PDF cannot hold.

### Define colour once, machine readable

Colour drifts faster than anything else because it gets retyped from memory. Publish it as data, then generate every downstream form from that one file.

\`\`\`json
{
  "version": "2.3.0",
  "colour": {
    "ink":    { "hex": "#101820", "cmyk": [80, 64, 52, 55], "pantone": "Black 6 C" },
    "signal": { "hex": "#E0533D", "cmyk": [0, 78, 76, 0],   "pantone": "179 C" },
    "paper":  { "hex": "#F6F3EE", "cmyk": [2, 3, 6, 0],     "pantone": "Warm Gray 1 C" }
  },
  "type": { "display": "Soehne Kraftig", "text": "Soehne Buch", "fallback": "Georgia, serif" }
}
\`\`\`

That one file feeds the ASE swatch library, the CSS custom properties, the Keynote theme and the print spec sheet. Nobody types \`#E0533D\` by hand, so nobody ships \`#E0543D\`.

### Version the brand like software

Give the system a version number and a changelog. Semantic versioning translates cleanly: a patch adds a worked example or corrects an error, a minor release adds a template or a new photographic direction, a major release changes something that invalidates work already in the wild.

\`\`\`text
2.3.0  added vertical lockup for app store listing
2.2.1  corrected CMYK build of Signal, was printing pink on uncoated
2.2.0  new social kit, 4:5 and 9:16 masters
2.0.0  type system moved from Founders Grotesk to Soehne
\`\`\`

A supplier can now tell you which version they built against, which lets you answer "is this artwork old, or is it wrong". Two different problems, two different fixes.

### The escape hatch

Every system eventually meets a case it did not anticipate: a co-branded lockup, a sponsorship board with a fixed aspect ratio. Write the exception route into the system itself. Name who decides, state the turnaround, say where the resulting artefact gets filed. Systems without an escape hatch do not stay pure. They get broken quietly by somebody who had a deadline and no answer.

### The classic mistake

Shipping the guidelines as a showcase. It photographs beautifully, it wins the pitch, and it fails the only test that matters: can somebody who has never met you find the correct LinkedIn banner, at the right size, in under a minute, without asking a human? Time that journey with a stopwatch. If it takes six minutes, the brand will drift regardless of how good the rules on page 44 are.
      `,
        [
          q('A guideline states the logo must never appear below 24 px. Which change most reliably stops that from happening?', [
            'Repeat the rule in bold on the first page of the PDF',
            'Email the rule to the marketing team every quarter',
            'Ship a social template with the logo locked at size',
            'Add a diagram showing minimum size at actual scale',
          ], 2, 'A rule that stays in a document depends on somebody reading and obeying it, while a locked template carries the rule inside the file, so breaking it now takes deliberate effort rather than one careless drag.'),
          q('Why publish brand colour as a single machine readable file instead of a page of values in the guidelines?', [
            'Every downstream form is generated from one value, so nobody retypes it',
            'JSON reproduces more accurately on a printed page than a swatch chart',
            'Designers generally find code easier to read than a colour swatch grid',
            'It reduces the file size of the guidelines document quite considerably',
          ], 0, 'Retyped hex values are the main source of colour drift, so generating the swatch library, the CSS variables and the print spec from one file removes the step where a digit quietly changes.'),
          q('A partner asks for a co-branded lockup that the brand system does not cover. What does a well built system do about it?', [
            'Refuses it, because anything outside the system weakens the brand',
            'Lets the partner build the lockup and reviews it once it goes live',
            'Adds thirty pages of new rules before anybody can be given a file',
            'Names a decider and a turnaround, then files the resulting artefact',
          ], 3, 'A documented exception route means the second person who asks is answered from the library instead of inventing a private version off to one side, which is exactly how a system breaks quietly.'),
        ]
      ),
      lesson('Many Hands: Source Files, Reviews, and Art Direction', 13, `
Three suppliers built the same campaign in one week. The headline came back set in Soehne, in Inter, and in Helvetica Neue. Nobody rebelled. Two of them had never been given the typeface, so they substituted the nearest thing on the machine and carried on. The brand did not break at the design stage. It broke weeks earlier, in a licence nobody checked.

### Fonts are the most common point of failure

A desktop licence is sold per seat. Five seats do not cover the freelance retoucher, the printer who opens your INDD to relink an image, or the agency in another country. Web use is licensed separately, usually by monthly pageviews. Apps are licensed separately again.

| Use | Licence type | Who needs a seat |
|---|---|---|
| Print and comp artwork | Desktop, per seat | Studio, retoucher, sometimes the printer |
| Website and email | Webfont, by pageviews | Front end team, email platform |
| Native app | App licence, per app | Mobile engineers |
| Video and broadcast | Often an extra grant | Motion studio |
| Outsourced production | Never covered by yours | Buy them a seat, or outline it |

The tempting fix is to email the supplier the font file. That breaches almost every licence written and foundries do audit. Two legitimate routes exist: put a seat for them on the purchase order, or supply artwork with the type already converted to outlines when they only need to place it and never edit it.

### What a shareable source file looks like

A master file leaves your machine packaged, not attached. Links stay linked, so a corrected photograph updates everywhere instead of hiding inside three embedded copies.

\`\`\`text
2026-Q3-launch_KV_master_v04.ai
  Links/          every placed image, relative paths, nothing embedded
  Document fonts/ only if the licence permits, otherwise a note
  README.txt      owner, brand system version 2.3.0, do-not-edit list
\`\`\`

Two habits do most of the work. Lock the base layer carrying the grid and the logo, so it cannot be nudged by a stray drag. Name layers for what they are: \`logo-lockup-primary\`, not \`Layer 12 copy 3 final\`. The next person opening your file at 11pm is deciding what is safe to touch, and layer names are the only instructions they will read.

### Reviewing other people's work

Feedback is a reaction. Art direction is a decision with a reason attached. Run any review in three passes and keep them separate, because mixing them is why reviews turn into taste arguments.

| Pass | Question | Who runs it |
|---|---|---|
| System | Does it obey the brand system? | Anyone, from a checklist |
| Strategy | Is this the right idea for the brief? | Art director |
| Craft | Is it well made at production size? | Art director or senior designer |

A layout can pass system and fail strategy: perfect colours, correct grid, wrong idea. A layout can pass strategy and fail craft: the right idea with a headline that breaks awkwardly and a subject cropped through the eyes. Say which pass a comment belongs to and the argument stops.

### Translate the vague comment before you act on it

| What you hear | What to ask |
|---|---|
| Make it pop | What should the eye land on first? |
| It feels cheap | Is it the crop, the type weight, or the spacing? |
| Can we try it in blue | Is colour the problem, or hierarchy? |
| Not quite premium | Which reference feels right, and why? |

Acting on the literal words produces a bigger logo and a brighter red. Acting on the answer produces a fix.

### Review the source, not a screenshot

Approving a flattened JPEG comp approves a picture of the work. Substituted fonts, RGB images in a CMYK document, a 72 ppi logo scaled up, spot colours that quietly became process: none of them show. Ask for the packaged file and preflight it before you sign anything.

### The classic mistake

Reviewing only at the end. Three suppliers spend a fortnight running in three directions, then get corrected in one bruising meeting, and every fix is a patch over a decision that was wrong at the start. Direct at the sketch, at the first layout, and at the production file. The cost of an intervention roughly doubles at each of those stages you skip.
      `,
        [
          q('A production supplier does not hold a licence for your brand typeface. Which response is legitimate and still keeps the artwork correct?', [
            'Send them the OTF file, since it covers only this one job',
            'Buy them a seat, or supply the artwork with type outlined',
            'Ask them to match the letterforms with a close substitute',
            'Swap the campaign to a free typeface for this supplier only',
          ], 1, 'Passing the font file around breaches almost every desktop licence, so the two safe routes are paying for a seat or converting type to outlines when the supplier only needs to place the artwork.'),
          q('A layout uses the correct colours, grid and typeface but does not answer the brief. Which review pass should catch it?', [
            'The system pass, run from the brand checklist',
            'The craft pass, judged at final production size',
            'The strategy pass, run by the art director',
            'Preflight, run just before the file is sent out',
          ], 2, 'The system pass only asks whether the work obeys the brand rules, which this layout does, so the failure belongs to the strategy pass that asks whether it is the right idea for the brief.'),
          q('Why approve a packaged source file rather than a flattened JPEG comp?', [
            'Substituted fonts and low resolution links stay invisible in a flat comp',
            'JPEG compression makes the brand colours look duller than they truly are',
            'Clients tend to respond faster to files they can open in their software',
            'Flat comps cannot be annotated, so the feedback arrives as loose email',
          ], 0, 'A flattened image shows only the picture, so problems living in the file structure such as a substituted typeface or a 72 ppi placed logo survive review and surface at the printer instead.'),
        ]
      ),
      lesson('Auditing Drift: Finding Where the Brand Quietly Broke', 13, `
A retail client asked for a "quick check" on brand consistency. A sample of 140 live touchpoints turned up nine different logo files, six blues, three typefaces and a tagline that had quietly lost its comma. Nobody had gone rogue. Every one of those nine logos was a reasonable local decision made by somebody who could not find the right file in the ninety seconds they had.

### Drift has mechanisms, not villains

| Mechanism | What it looks like on the asset |
|---|---|
| Re-saved JPEG passed between teams | Halo and blocking around the mark |
| Colour typed from memory | \`#0A5FCC\` where the brand is \`#0A5AC8\` |
| Screenshot of a screenshot | Soft edges, wrong crop, baked-in background |
| Vendor "brand kit" rebuilt by the vendor | Redrawn logo, slightly wrong curves |
| Old template still on a laptop | Last year's strapline, last year's spacing |
| Font not licensed at the supplier | Nearest substitute, wrong weight |

Read that column again. Every row names a missing artefact, not a bad attitude. That framing decides whether your audit produces fixes or resentment.

### Sample, do not boil the ocean

Auditing everything takes a quarter and finds the same six problems the first fifty assets found. Take a stratified sample: roughly 20 assets per major channel across web, social, retail, packaging, email, sales collateral and physical estate, weighted so the highest reach surfaces are definitely in there. Capture each one as it exists in the wild, not as it exists in your library. That distinction is the whole exercise.

### Measure colour, do not squint at it

"Close enough" is not a finding anyone can act on. Sample the actual pixel with the eyedropper, convert to Lab, and compute Delta E 2000 against the canonical value. Below about 1.0 nobody can see it. Around 2 a trained eye spots it side by side. Above 5 a customer sees two different colours.

| Surface | Sampled | Canonical | dE00 | Verdict |
|---|---|---|---|---|
| Website header | \`#0A5AC8\` | \`#0A5AC8\` | 0.0 | Correct |
| Email banner | \`#0A5FCC\` | \`#0A5AC8\` | 1.6 | Tolerable, log it |
| Store window vinyl | \`#1C6FD6\` | \`#0A5AC8\` | 6.4 | Fails, reprint |
| Partner microsite | \`#2B7BE0\` | \`#0A5AC8\` | 9.1 | Fails, wrong file |

Now the conversation with the print supplier is about a number, not about whether their blue feels right.

### Score, then rank by reach

Score each asset 0, 1 or 2 on logo, colour, type, imagery and copy. Then multiply the failure by how many people see it, because a wrong logo on the homepage and a wrong logo in an internal template are not the same problem.

\`\`\`csv
asset,channel,monthly_reach,logo,colour,type,imagery,copy,root_cause
homepage-hero,web,410000,2,2,2,2,2,none
window-vinyl-manchester,retail,88000,1,0,2,1,2,supplier rebuilt logo from JPEG
sales-deck-q2,sales,1200,0,1,1,0,2,2024 template still on shared drive
invoice-pdf,finance,26000,0,0,1,2,1,generated by billing system, never updated
\`\`\`

That last row is the one people miss. The invoice reaches 26,000 customers a month and no designer has ever opened it, because it is produced by a system nobody thinks of as a brand surface.

### Fix the source, not the symptom

Fourteen decks carrying an old logo is one problem, not fourteen. Replace the template they were all built from, publish it where the old one lived, and the next fourteen come out right on their own. Correcting the fourteen files instead buys you a clean quarter and the identical audit next year.

### The classic mistake

Presenting the audit as a slide deck of shame. Forty screenshots with red circles, a room full of people who feel accused, and no backlog. An audit that does not end with a ranked list of missing artefacts, each with an owner and a date, has cost a fortnight and changed nothing. Ship the fix list, not the evidence.
      `,
        [
          q('Two sampled blues score dE00 of 1.6 and 6.4 against the canonical brand value. What is the correct call?', [
            'Both fail, because any measurable difference is a brand failure',
            'Log the 1.6 and fix the 6.4, which a customer can plainly see',
            'Both pass, because dE00 only matters above roughly 10 in print',
            'Neither can be judged, because dE00 does not apply to screens',
          ], 1, 'A dE00 near 1.6 is barely perceptible even side by side, while anything above about 5 reads as a different colour to an ordinary viewer, so only the second sample justifies the cost of a reprint.'),
          q('An audit finds fourteen sales decks built from the same 2024 template, all carrying the old logo. What is the highest value fix?', [
            'Correct all fourteen decks and return them to their owners',
            'Send the sales team the guidelines and ask them to check',
            'Stop the sales team making decks without design approval',
            'Replace the shared template, published where the old sat',
          ], 3, 'Fixing the fourteen files leaves the source intact so the next batch repeats the error, whereas replacing the template that produced them makes every future deck correct without anyone remembering a rule.'),
          q('Why record a root cause beside every violation found in a brand audit?', [
            'It shows management which teams most need extra brand training',
            'It lets you rank the finished report by which channel is worst',
            'Each violation usually names an artefact that was missing',
            'It proves the audit sample was large enough to be trusted',
          ], 2, 'Drift is almost always caused by somebody who could not find the right file in the time available, so the root cause column turns the audit into a list of artefacts to build rather than people to blame.'),
        ]
      ),
      lesson('Rebrand Rollout: Sequencing, Legacy Assets, and the Cutover', 13, `
A bank launched its new identity in the app on a Tuesday. The ATM screens were rebranded the following March. For four months customers withdrawing cash saw one brand on the machine and a different one on the phone in their hand, and the support line filled up with people asking whether they were being scammed. The design was fine. The sequencing was the failure.

### The inventory comes before the schedule

You cannot sequence what you have not listed. Walk every surface, including the ones no designer has ever opened, and record the lead time and the owner. Lead time, not importance, decides the running order.

| Surface | Lead time | Owner | Cutover mode |
|---|---|---|---|
| Website, app, social avatars | 1 day | Digital | Overnight, all at once |
| Email signatures, decks, letterhead | 1 week | Internal comms | Overnight, template swap |
| Business cards, stationery | 2 weeks | Office manager | Reprint on demand |
| Vehicle livery, 40 vans | 6 weeks | Fleet | Rolling, as they come in |
| Exterior signage, 22 sites | 10 weeks | Property | Phased by region |
| Printed packaging | 16 weeks | Supply chain | Sell through existing stock |

### Work backwards from the longest pole

Cutover is 1 June. Packaging plates take 16 weeks, so new artwork has to be approved by roughly the second week of February. That same date is when you stop ordering old brand cartons, because anything ordered after it arrives to be thrown away.

\`\`\`text
T-20 weeks  inventory complete, every surface has an owner and a lead time
T-16 weeks  packaging artwork approved, plates ordered, last old stock order placed
T-12 weeks  brand system v3.0.0 published, templates rebuilt, fonts licensed
T-10 weeks  signage surveys and manufacture begin
T-6  weeks  suppliers briefed, freeze on producing any new old brand asset
T-2  weeks  digital assets staged but unpublished, day one checklist rehearsed
T-0         cutover: web, app, social, email, all inside one working day
T+1  week   sweep: search for surviving old assets, fix or retire each one
T+6  months rolling estate complete, legacy archive locked
\`\`\`

The freeze at T minus 6 weeks is the item people forget. Without it a team commissions a new brochure in the old identity three weeks before launch, and it arrives from the printer the week after.

### Do not pulp the warehouse

Forty thousand cartons already printed are not a branding problem, they are forty thousand pounds. Sell them through. Customers accept old packaging on a shelf for a season because packaging visibly turns over. What they do not accept is the same brand looking like two companies on the same screen at the same moment. Physical estate can be slow and honest. Digital surfaces have to move together.

### Legacy assets: archive, do not scatter

Deleting the old logo everywhere is impossible, because it lives in downloads folders, in supplier archives and in a PowerPoint on a laptop in another country. What you can control is which file is easiest to reach.

\`\`\`text
/brand/current/        v3.0.0, the only path anyone is ever sent
/brand/_retired-2026-06-01-do-not-use/   old marks, read only, watermarked preview
\`\`\`

Put a dated, obvious label on the retired folder, keep exactly one copy for legal and archival use, and make the new asset faster to find than the old one. Convenience beats policy every single time.

### The day one checklist nobody writes

Favicon. Open Graph images. App icon and store screenshots. Email signature generator. Invoice and quote templates. On-hold music and voicemail greetings. Trade show booth graphics. Uniform embroidery. The PDF letterhead inside the CRM. YouTube channel art. Careers site. The sponsored stand at a conference in October that was booked last year with the old logo.

### The classic mistake

Treating the website as the rebrand. It is the loudest surface and the cheapest to change, so it goes first and everything else drifts behind it for a year. Judge the rollout by the slowest surface a real customer touches, not the fastest one your team controls.
      `,
        [
          q('Cutover is 1 June and printed packaging needs 16 weeks from artwork approval. What does that fix in the schedule?', [
            'New packaging artwork is approved by around mid February',
            'Packaging changes last, some months after the June cutover',
            'Cutover moves back so the packaging has time to be made',
            'Remaining cartons are pulped so new stock can be shelved',
          ], 0, 'The longest lead time sets the earliest deadline, so counting back sixteen weeks from 1 June puts packaging approval in February, and that same date is when old brand cartons stop being ordered.'),
          q('For four months customers saw the new brand in the app and the old brand on the ATM. Why does that matter beyond looking untidy?', [
            'Search engines penalise a site whose logo differs from signage',
            'Two live identities double the cost of every asset in production',
            'It makes the design team look slow to the executive sponsor',
            'A mismatch on a payment surface reads as fraud, so trust drops',
          ], 3, 'Customers treat visual consistency as a security signal on financial surfaces, so two identities inside one journey raise suspicion of a scam rather than being read as a rollout still in progress.'),
          q('What most reliably keeps the retired logo out of new decks two years after cutover?', [
            'Deleting every copy of the old files from all company systems',
            'Making the new asset faster to find than the old one ever was',
            'A company wide email announcing that the old mark is retired',
            'Adding a clause about the retired mark to supplier contracts',
          ], 1, 'Old files survive in downloads folders and supplier archives well beyond your reach, so the only durable control is convenience, which means the current asset must be the quickest one to hand.'),
        ]
      ),
      ],
      [
      q('Across a full year, which single change does most to reduce brand drift?', [
        'Publishing a longer and far more detailed guidelines document',
        'Running a brand audit each quarter and circulating the results',
        'Moving rules into the templates and libraries people already use',
        'Requiring design sign off on every asset before it can go live',
      ], 2, 'Drift comes from people improvising when the correct artefact is out of reach, so building the rules into templates and libraries already in daily use prevents the improvisation rather than detecting or policing it later.'),
      q('A campaign comes back from three suppliers set in three different typefaces. Where does the real failure sit?', [
        'Licensed seats were never arranged for the suppliers involved',
        'The guidelines did not name the brand typeface clearly enough',
        'The suppliers were briefed too late in the production schedule',
        'The art director gave feedback verbally rather than in writing',
      ], 0, 'Two of the three suppliers had no access to the licensed font and substituted the nearest match on their machine, so the fault sits in procurement rather than in the brief or the designers doing the work.'),
      q('Given limited time, which audit finding should be fixed first?', [
        'A wrong tint of brand blue on an internal HR intranet page',
        'An old logo on the system generated invoice sent to customers',
        'Inconsistent photography across last year\'s trade stand panels',
        'A tagline missing its comma inside the 2024 sales deck master',
      ], 1, 'Ranking by reach puts the invoice first, because it goes to every customer every month and no designer owns it, which makes it both the highest impact error and the one least likely to be spotted by anyone else.'),
      q('Why does a rebrand plan start with an inventory of surfaces and lead times rather than with a launch date?', [
        'Because finance needs a total cost before approving any date',
        'Because the website must be rebuilt before anything else moves',
        'Because suppliers quote faster when sent the full list at once',
        'Because the slowest surface decides where every other date falls',
      ], 3, 'Sequencing runs backwards from the longest lead time, so until you know that signage takes ten weeks and packaging sixteen, any launch date chosen is a guess that will strand some surfaces on the old identity.'),
      ]
    ),
  ],
  final: [
    q('A client needs their logo embroidered on uniforms and cut from vinyl for a shopfront. What must you supply?', [
      'A 300 ppi PNG with a transparent background',
      'Vector artwork, as both machines follow paths, not pixels',
      'A layered PSD saved at the largest size required, with every layer and effect kept editable',
      'A CMYK JPEG at 600 ppi',
    ], 1, 'Embroidery and vinyl cutters trace geometry, so only true vector outlines can drive them at any size.'),
    q('You are setting up an A4 flyer for offset print with 3 mm bleed at 300 ppi. What canvas size do you create in Photoshop?', [
      '210 x 297 mm at 300 ppi, adding bleed on export',
      '2480 x 3508 px, which is A4 at 300 ppi',
      '210 x 297 mm at 72 ppi, raising the resolution afterwards to 300 ppi once the layout is approved',
      '216 x 303 mm (2551 x 3579 px at 300 ppi) with trim guides',
    ], 3, 'Photoshop has no bleed field, so the canvas itself must include 3 mm on every edge and guides mark where the trim will fall.'),
    q('Your brand green looks electric on screen and dull on the printed proof. What explains it?', [
      'The green lies outside the CMYK gamut, so the press maps it to the nearest printable colour',
      'The image resolution was too low to hold saturated colour, so the press screened the green coarsely',
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
      'Gaussian Blur is unavailable on ordinary pixel layers, so the layer has to be a Smart Object first',
      'It converts the layer to 16-bit automatically',
    ], 0, 'Filters on a Smart Object are stored as re-editable instructions rather than being baked into the pixels.'),
    q('A composite has a perfect cutout but still reads as fake. Which pair of problems is most likely?', [
      'The document is RGB and the file is 8-bit',
      'The mask feather is 0 px and the layer is not grouped',
      'The subject layer sits above the background layer in Normal blend mode, so the two do not mix',
      'No contact shadow, and the subject\'s sharpness or grain does not match the background',
    ], 3, 'Believability comes from light and camera character; a missing shadow and mismatched sharpness or noise betray the edit regardless of mask quality.'),
    q('Where should anchor points and their handles be placed when drawing a smooth curve?', [
      'Evenly spaced along the whole path for consistency',
      'At every change in the outline, adding more points wherever the curve looks lumpy until it looks smooth',
      'At the extremes of the form, with handles perpendicular to the shape and as few anchors as possible',
      'Only at corners, letting Illustrator infer the curves',
    ], 2, 'Extreme placement with perpendicular handles produces true arcs, while extra anchors introduce wobble and slow every later edit.'),
    q('You are setting a small all-caps label under a large headline. What tracking treatment does each want?', [
      'Open the all-caps by roughly +50 to +100 and tighten the headline by roughly -10 to -25',
      'Tighten both, since tight tracking always looks more modern',
      'Open both up equally to keep the page consistent',
      'Leave both at zero, because manual tracking adjustments tend to break the font\'s built-in spacing',
    ], 0, 'Capitals at small sizes crowd and need extra space, while large display type has too much built-in spacing and needs tightening.'),
    q('Which export settings are correct for a commercial print job on a modern RIP?', [
      'JPEG at maximum quality, RGB, 300 ppi',
      'PNG-24 with transparency at 300 ppi',
      'PDF exported from a web preset with sRGB colour, downsampled images, no bleed and no trim marks',
      'PDF/X-4 with fonts embedded, 3 mm bleed, trim marks offset 3 mm and the press CMYK profile',
    ], 3, 'PDF/X-4 carries embedded fonts, bleed, marks and a defined output intent, which is exactly what a press needs to reproduce the file predictably.'),
    q('A brand guidelines page specifies clear space around the logo as 10 mm on all sides. What is wrong with that rule?', [
      'Clear space is only needed on the left and right of a horizontal lockup',
      '10 mm is smaller than any printer can hold to',
      'Clear space must scale with the mark, so express it in units from the artwork, such as 1x the cap height',
      'Clear space is unnecessary at print sizes because the printer adds a matching margin when the sheet is trimmed',
    ], 2, 'A fixed millimetre value is huge on a card and invisible on a billboard, whereas a zone defined in units taken from the artwork itself stays correct at every reproduction size.'),
    q('The client administration team needs the logo for Word and PowerPoint. Which deliverable is correct?', [
      'A transparent PNG at 2x, plus a white-background JPEG as a fallback',
      'The layered .ai master file, since Office can open Illustrator files natively',
      'An EPS, since it is the standard print format',
      'A PDF/X-4 export with bleed and trim marks',
    ], 0, 'Office refuses AI and has blocked EPS since 2018, and a PDF/X-4 press file is the wrong artefact entirely, so a raster file with an alpha channel is the deliverable that works in every version of Word and PowerPoint.'),
    q('A soft drop shadow over a spot-coloured panel came back from the printer as a grid of stitched rectangular patches. What caused it?', [
      'The shadow was built at 72 ppi instead of 300 ppi, so the printer rasterised it in coarse blocks',
      'The spot colour was set to overprint',
      'Total ink coverage exceeded 300% under the shadow',
      'Transparency was flattened on export, as happens with PDF/X-1a but not PDF/X-4',
    ], 3, 'PDF/X-1a has no live transparency, so the RIP receives the shadow chopped into opaque atomic regions; PDF/X-4 keeps the transparency intact.'),
    q('You have a finished RGB master and need both a web JPEG and a CMYK press PDF. What is the safe workflow?', [
      'Convert the master to CMYK first, then convert that file back to RGB for the web version',
      'Keep the RGB master as the one source and make each output from it with one conversion',
      'Work in CMYK throughout and let the browser handle the difference',
      'Export both from the same CMYK file, since CMYK is the more restrictive space',
    ], 1, 'Every conversion clips out-of-gamut colour permanently, so each deliverable should be one conversion away from a single untouched RGB master.'),
    q('You grade one hero frame with live Curves and Hue/Saturation layers, export it as a .cube LUT, then apply that LUT through a Colour Lookup layer to the other 23 frames from the shoot. Several of those frames were shot a third of a stop darker and one has a window that clips. What is the predictable result?', [
      'The Colour Lookup layer reads each frame\'s histogram before it applies, so the darker frames quietly receive a proportionally gentler version of the same grade.',
      'The grade lands identically on every frame, so the only visible difference is that the darker frames carry a little more sensor noise once the look lifts them.',
      'The darker frames come back with crushed shadows rather than a slightly darker look, and the clipped window stays clipped, so the set needs normalising first.',
      'The LUT refuses to load on the darker frames, because a .cube file stores absolute values and Photoshop will not apply one outside the range it was built from.',
    ], 2, 'A LUT is a baked transform: it maps every input value to one fixed output value whatever frame it lands on, so a frame arriving a third of a stop under is pushed further down instead of receiving a weaker version of the look, and highlights that clip inside the LUT cannot be recovered by any later curve. Match white balance to within roughly 150 K and exposure to within a third of a stop across the set before any grade goes on top.'),
    q('An action ends with Save As JPEG at quality 9. Run through File > Automate > Batch it wrote 380 files into a job folder from 2019 rather than the Destination folder, so a colleague deletes the Save As step from the action and sets the Batch Destination again. What happens on the next run?', [
      'Each image lands in the destination in its original format, because the format and quality came from the action\'s Save As step and nothing now supplies them.',
      'Nothing is written anywhere, and Batch halts on the first file with an error about a save step that the action no longer contains.',
      'The images land in the destination as JPEGs at maximum quality, because Batch supplies its own save settings whenever the action provides none.',
      'The originals are overwritten where they sit, because with no Save As step Batch writes each result back over the file it opened.',
    ], 0, 'Deleting the Save As step removes the only thing that specified JPEG at quality 9, so Photoshop falls back to saving each file in the format it came in, which is rarely what the job wanted. The real fix is to keep the recorded Save As step and tick Override Action Save As Commands in the Batch dialog, which keeps the format and quality from the action but redirects the output to the Destination folder using the File Naming rules set there.'),
    q('Forty icons exported from Illustrator with default SVG settings are inlined into one page. A green warning triangle renders in the blue of an icon further down the markup, and two icons that use different gradients both draw the same gradient. What explains both faults at once?', [
      'Inlined SVGs share one rendering context, so fills and gradients are resolved once per page and the browser reuses the first result it cached.',
      'The files were exported without viewBox, so no coordinate system exists and each icon inherits the paint of the nearest preceding sibling SVG.',
      'Presentation attributes carry lower specificity than the page stylesheet, so any page level rule silently overrides the fills and gradient stops in the files.',
      'Every export writes the same class names and the same generated ids, and CSS rules and id references are document wide, so a later class and the first id win.',
    ], 3, 'Illustrator\'s default styling writes a style block using generic class names such as .st0 and gradient or clip path ids such as SVGID_1_, and both are identical in every file it exports. Once several of those files sit inside one document the names collide, because CSS and id lookups are scoped to the document rather than to the file, so the last .st0 declaration restyles earlier icons and a paint reference resolves to the first matching id. Export with Presentation Attributes and run SVGO with prefixIds.'),
    q('A 6 x 3 m hoarding is built at 1:10 and 300 ppi. Judging both on screen at that working size, the designer sets the phone number at 9 pt and divides the panels with a 0.25 pt rule. The board is read from about 25 m. What arrives on site?', [
      'Both hold as drawn, because the RIP reads point sizes against the finished size, so the number and the rule enlarge in proportion with the artwork around them.',
      'The number prints with caps near 22 mm, unreadable from the road, and the hairline prints almost a millimetre wide, a heavy band instead of a whisker.',
      'The number reads from the road, but the rule disappears, because a stroke that thin at output size falls below the smallest ink drop a wide format head can lay.',
      'The type enlarges and the rule does not, since stroke weights are absolute points that survive a scale factor untouched, so the rule still prints at 0.25 pt.',
    ], 1, 'At 1:10 everything in the file is multiplied by ten at output, so 9 pt becomes 90 pt, which is roughly 22 mm of cap height, while the rough guide of 8 mm of cap height per metre of viewing distance says a board read from 25 m needs caps near 200 mm. The same multiplication turns the 0.25 pt hairline into 2.5 pt. Work type and stroke weights backwards from the viewing distance, then divide by the scale factor before you draw them.'),
    q('The headline on a folding carton overhangs the front panel by about a millimetre, so a designer scales the converter\'s dieline and all the artwork together to 99.7 per cent until everything sits inside. Why is that carton scrap?', [
      'The dieline is a spot colour on a non printing layer, and scaling it clears the overprint setting, so the magenta cut and crease rules now print with the artwork.',
      'Scaling below 100 per cent drops the effective resolution of every placed image under 300 ppi, so the panels print visibly soft once the board comes off the press.',
      'The 3 mm bleed shrinks along with everything else, so colour stops fractionally short of the trim and a white hairline shows down the outside edge of the pack.',
      'The die already exists as steel rule at the original size, so cuts and creases land in the wrong place and the tuck clearance for the lid is gone.',
    ], 3, 'A dieline is a manufacturing drawing of tooling that has already been made, so it is fixed before the artwork starts and nothing about it is negotiable, not even a fraction of a per cent. Shrink a 226 mm blank by 0.3 per cent and the blade and creasing rules land off the panels they were drawn for, and the clearances the converter built in for board caliper, such as a tuck panel cut 0.6 mm short of the side it slots into, no longer hold. Move the headline and keep live copy 5 mm clear of every crease instead.'),
    q('A brand audit of 140 live assets finds fourteen sales decks carrying last year\'s logo, every one built from a template still sitting on the shared drive, plus an invoice PDF generated by the billing system that reaches 26,000 customers a month with the wrong blue. What should the fix list say?', [
      'Replace the shared drive template so the next decks come out correct on their own, and give the invoice an owner, because reach ranks it above the decks.',
      'Correct the fourteen decks first, since they are the larger count and the visible failure, then raise the invoice with the finance team once that backlog clears.',
      'Rebuild the fourteen decks and the invoice from the current master files, then reissue the guidelines PDF with a page showing which logo file is the correct one.',
      'Log both for the next major version of the brand system, since neither breaches the identity badly enough to justify reissuing work that is already in the wild.',
    ], 0, 'Drift is caused by missing artefacts rather than by people ignoring rules, so fourteen wrong decks are one problem and not fourteen: replace the template they were all built from, publish it where the old one lived, and the next fourteen are right without anyone being told. Ranking findings by reach then puts the invoice, a surface no designer has ever opened, above internal collateral, because 26,000 customers see it every month.'),
    q('A photo measures 2400 x 3600 px. What is the largest size it can print at 300 ppi without resampling?', [
      '6 x 9 inches',
      '8 x 12 inches',
      '24 x 36 inches',
      '33 x 50 inches',
    ], 1, 'Print size is pixels divided by ppi: 2400 / 300 = 8 inches and 3600 / 300 = 12 inches.'),
    q('You need a darker version of the brand orange for a button\'s hover state that still reads as the same colour. Which change in the HSB fields does that?', [
      'Shift Hue by 20 degrees toward red',
      'Raise Saturation to 100 and keep Brightness',
      'Retype the colour as CMYK values instead',
      'Lower Brightness and keep Hue unchanged',
    ], 3, 'HSB separates hue from brightness, so lowering B darkens the colour while the unchanged H keeps it recognisably the same orange.'),
    q('Why can a logo drawn as paths in Illustrator be used on a business card and on a billboard from the same file?', [
      'Paths are maths, so they are redrawn sharply at any size',
      'Illustrator saves every file at a fixed 300 ppi',
      'Vector files store several pixel sizes inside them',
      'Print shops upscale vector files with special software before sending them to the press',
    ], 0, 'Vector artwork is described as anchor points and curves rather than a pixel grid, so it is recalculated crisply at whatever size it is output.'),
    q('A signature scanned as black ink on white paper must sit over a textured background, with the white paper disappearing. Which blend mode does that?', [
      'Screen',
      'Difference',
      'Multiply',
      'Normal at 50% opacity',
    ], 2, 'Multiply makes white invisible and keeps darker values, which is why it suits scanned line art on white.'),
    q('A Black & White adjustment layer sits directly above a photo, and a coloured logo layer sits above the adjustment layer. What turns grey?', [
      'Only the photo; the logo above the adjustment keeps its colour',
      'Both, because an adjustment layer affects the whole file',
      'Only the logo, because adjustments affect the layer above',
      'Nothing until the adjustment layer is merged down',
    ], 0, 'An adjustment layer changes the layers beneath it in the stack, so anything above it is untouched.'),
    q('You want a photo to fade gradually into the background from left to right, and to be able to change the fade later. What do you do?', [
      'Erase the left side with a large soft Eraser brush, then lower the layer opacity to blend',
      'Lower the photo layer\'s Opacity to 50 percent',
      'Select the left half, feather it and press Delete',
      'Draw a black-to-white gradient on the photo\'s layer mask',
    ], 3, 'On a mask black conceals and white reveals, so a gradient gives a smooth fade that you can redraw at any time without losing pixels.'),
    q('You are compositing a person into a street scene. How should you judge how big the person should be?', [
      'So the person fills about a third of the canvas height',
      'Against a known object in the scene, such as a door about 2 m tall',
      'By matching the pixel dimensions of the two source photos',
      'By eye, at the zoom level that fits the whole window',
    ], 1, 'Scale is judged against objects of known size in the background plate, not against the canvas or the source files.'),
    q('Content-Aware Fill keeps copying pieces of a person\'s face into the area where you are removing a sign. What fixes it?', [
      'Run Content-Aware Fill again until a better result appears',
      'Raise the Colour Adaptation setting as high as it goes',
      'Subtract the face from the green sampling area in the workspace',
      'Flatten the image first so the fill samples one layer',
    ], 2, 'The green overlay in the Content-Aware Fill workspace defines the donor area, so removing the face from it stops the face being copied.'),
    q('With the Pen tool, what does clicking and dragging create, compared with a single click?', [
      'A smooth point with direction handles, not a corner point',
      'A corner point, rather than a smooth point with handles',
      'A closed shape, rather than an open path',
      'A new separate path, rather than extending the current one',
    ], 0, 'A single click places a corner point; dragging pulls out direction handles and makes a smooth point that defines a curve.'),
    q('You overlap two circles and want a crescent: the front circle\'s area cut out of the circle behind it. Which Pathfinder panel button does that?', [
      'Minus Back',
      'Intersect',
      'Exclude',
      'Minus Front',
    ], 3, 'Minus Front subtracts the frontmost shape from the shape behind it, leaving the crescent.'),
    q('You need body copy that wraps inside a fixed-width column in Illustrator. How should you create it?', [
      'Click once with the Type tool and press Enter at each line end',
      'Click and drag a box with the Type tool to make area type',
      'Make point type and drag its bounding box to the column width',
      'Use Type on a Path along a straight vertical line',
    ], 1, 'Dragging a box creates area type, which wraps inside its container; point type never wraps, and dragging its box distorts the letters.'),
    q('A poster\'s headline and its main photo are equally large and bold, and test viewers say they do not know where to look. What is the fix?', [
      'Make both bigger and bolder so the poster feels more energetic and fills the space',
      'Add a third bold element to balance the two',
      'Make one clearly dominant and let the other support it',
      'Centre both on the exact middle of the poster',
    ], 2, 'Two equally loud elements cancel each other out; a layout needs one focal point and a path from it.'),
    q('A logo must sit on several differently coloured web backgrounds. Which export format cannot do this cleanly?', [
      'JPEG',
      'SVG',
      'PNG-24',
      'WebP',
    ], 0, 'JPEG has no transparency, so the logo arrives inside a solid rectangle; SVG, PNG-24 and WebP all support transparent backgrounds.'),
    q('A hero photograph exported as a JPEG at quality 100 weighs 2.4 MB. Which is the sensible web setting?', [
      'PNG-24, because it is lossless',
      'GIF, to keep the file small',
      'JPEG at quality 100 with metadata removed',
      'JPEG at a quality between 60 and 80',
    ], 3, 'Above about 85 the JPEG file grows quickly with no visible gain, while PNG-24 is the wrong choice for photographs.'),
    q('A partner needs your logo in a wide 4:1 banner slot, but they have only been given the stacked lockup. What should the logo system supply?', [
      'The stacked lockup stretched to fill the width of the slot, so it matches the banner',
      'The horizontal primary lockup, built for wide spaces',
      'The icon alone, scaled to the banner\'s full height',
      'The stacked lockup with extra clear space added',
    ], 1, 'A logo system ships a family of lockups so each space gets the variant built for it, rather than a stretched or mismatched version.'),
    q('Which logo files should the client\'s web developer receive?', [
      'The layered .ai master file and an EPS',
      'A CMYK PDF/X-4 with bleed and trim marks, so the developer can place it at any size',
      'SVG plus a favicon set at 16, 32, 180 and 512 px',
      'A single 300 ppi CMYK TIFF of the lockup',
    ], 2, 'Web developers need SVG for sharp scaling and a favicon set, not print or source formats they cannot use.'),
    q('How should the folder you hand over for a new logo be organised?', [
      'By who receives the files, such as web, print and office',
      'By file format, with every AI, EPS, PNG and SVG together',
      'By the date on which each file was last saved',
      'As one flat folder so that nothing is hard to find',
    ], 0, 'A handoff is sorted by recipient, so each person can open their folder and find only the formats they can use.'),
    q('Before sending a photo to press, you want to see on screen roughly how it will look on the printer\'s stock. What do you do?', [
      'Convert the file to CMYK and back to RGB twice',
      'Turn the monitor\'s brightness down to match the paper and view the file at 100 percent',
      'Export a JPEG and check it on a phone screen',
      'Use View > Proof Setup with the printer\'s press profile',
    ], 3, 'Soft proofing simulates the press profile on screen, so out-of-gamut and dulled colours show up before the job is printed.'),
    q('You are about to convert all the type in your only copy of a layout to outlines. What should you do first?', [
      'Rename the file final so everyone knows it is finished',
      'Save a new version number, such as poster_v04, before outlining',
      'Nothing, since Undo can always restore the live type later',
      'Turn off autosave so the outlines are not saved by accident',
    ], 1, 'Saving a new version before every irreversible step keeps a live-type copy to return to, which Undo does not guarantee once the file is closed.'),
    q('The printer\'s proof shows Courier where your headline typeface should be. What is the cause?', [
      'The PDF was exported at too low an image resolution, so the headline rasterised and fell back',
      'The headline colour was set to overprint',
      'The font was not embedded, or its licence forbids embedding',
      'The document was left in RGB instead of CMYK',
    ], 2, 'When a font is missing from the PDF the output device substitutes a default such as Courier; embed a licensed font or outline it.'),
    q('You are building a channel mask to cut dark hair from a bright blue sky. Which channel usually gives the widest starting contrast?', [
      'Blue',
      'Red',
      'Green',
      'The RGB composite',
    ], 0, 'In the blue channel the sky sits near white while dark hair stays low, giving the widest tonal gap to turn into a mask.'),
    q('You select a rubbish bin to remove with Generative Fill. What should you type in the prompt box?', [
      '"Remove the bin", to state the task clearly',
      'A negative prompt such as "no bin, no rubbish, no objects" so the fill avoids adding anything',
      'The bin\'s colour, so it knows what to take out',
      'Nothing; an empty prompt rebuilds from the surroundings',
    ], 3, 'For removal an empty prompt tells Photoshop to reconstruct from the surrounding content; typed words bias it toward inventing new objects.'),
    q('A droplet that processed product shots for months stops working after a major Photoshop update. Why?', [
      'Droplets expire after a fixed number of runs',
      'It stores the path to the Photoshop version that made it',
      'The update deleted every action in the Actions panel',
      'Droplets only run when Photoshop is already open',
    ], 1, 'A droplet records the exact Photoshop it was built with, so a major update orphans it and it must be rebuilt.'),
    q('An action recorded while a layer named Curves 1 was selected halts on the third file of a batch, saying the object is not available. Why?', [
      'Batch can only process two files before it needs a restart',
      'The action ran out of History States on the third file',
      'It recorded selecting that layer by name, which this file lacks',
      'Curves layers cannot be used inside recorded actions',
    ], 2, 'Actions record layer selection by name, so a file whose layer is named differently stops the action; record actions that create the layers they need.'),
    q('Why strip the width and height attributes from an icon SVG but keep its viewBox?', [
      'So CSS sets the size while viewBox keeps the coordinates',
      'So the icon always renders at exactly 24 px everywhere',
      'Because browsers ignore viewBox whenever a width attribute is present on the element',
      'So that the stroke width scales down to one pixel',
    ], 0, 'Without fixed width and height the icon takes its size from CSS, and the viewBox supplies the coordinate system it needs to scale.'),
    q('In a stroked icon set, the corners look swollen where lines meet on the inside. What is the usual fix?', [
      'Give inner corners the same radius as the outer corners, so the offset stays even',
      'Increase the stroke weight from 2 px to 3 px',
      'Switch every icon from round caps to butt caps',
      'Give inner corners a smaller radius than outer ones, or none',
    ], 3, 'The inside of a stroked corner already curves, so matching the outer radius makes the joint look swollen.'),
    q('On a van wrap, where must a phone number, logo or face never be placed?', [
      'On the flattest and largest side panel',
      'Across a panel gap, handle recess or rivet line',
      'Inside the template\'s marked safe area',
      'More than 100 mm from any panel edge',
    ], 1, 'Gaps, recesses and rivet lines are cut or distorted during installation, so anything that must be read has to avoid them.'),
    q('To save space, a designer runs a coloured border tight against the outer bars of an EAN-13 barcode. What is the risk?', [
      'The barcode prints in the wrong colour on press',
      'The digits under the bars become too small to read once the border crowds them',
      'The quiet zone is lost, so scanners may fail to read it',
      'Nothing, because only the bars themselves are scanned',
    ], 2, 'Barcodes need clear quiet zones on either side of the bars; filling them causes scan failures at the till.'),
    q('A brand system is at version 2.3.0, and its type system moves to a new typeface, which makes artwork already in use out of date. Which version comes next?', [
      '2.4.0',
      '2.3.1',
      '2.3.0 with a changelog note',
      '3.0.0',
    ], 3, 'A change that invalidates work already in the wild is a major release, so the major number increases.'),
    q('What is the most telling test of whether a brand system works for the people who use it?', [
      'Time how long a newcomer takes to find the right asset unaided',
      'Count the pages in the brand guidelines document',
      'Check whether the guidelines photograph well in a pitch deck and look polished on screen',
      'Ask the original designers whether every rule is covered',
    ], 0, 'A system succeeds only if someone who has never met the designers can find the correct asset quickly without asking a human.'),
  ],
});
