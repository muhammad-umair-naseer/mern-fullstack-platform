import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'video-editing-short-form',
  title: 'Video Editing & Short-Form Content',
  category: 'Design Tools',
  level: 'Beginner → Intermediate',
  duration: '6 weeks',
  accent: 'fuchsia',
  coverKey: 'video-editing-short-form',
  summary:
    'Edit videos people watch to the end with CapCut, Premiere Pro and DaVinci Resolve: cutting, sound, colour, captions and motion, plus hooks, retention and the platform know-how behind Reels, TikTok and YouTube Shorts.',
  description:
    'You begin with how editing works: frame rates, aspect ratios, codecs and choosing the right editor. You plan and record better footage and audio on a phone, then learn CapCut, Premiere Pro and DaVinci Resolve hands-on. From there you master the craft: pacing, J-cuts and L-cuts, b-roll, clean dialogue, music and loudness, colour correction with scopes, captions, keyframes and green screen. You then learn what makes short-form content work, from hooks and retention editing to platform differences and repurposing, export and publish correctly, read analytics, and finish by building a showreel and earning as a video editor.',
  chapters: [
    chapter(
      'How Video Editing Works',
      'Understand what editors really do, master frame rates, resolution and aspect ratios, make sense of codecs and file formats, and choose between CapCut, Premiere Pro and DaVinci Resolve.',
      [
      lesson('What a Video Editor Actually Does', 12, `
Most people think editing means cutting out mistakes and adding music. That is part of it, but a good editor does something much more valuable: they decide what the audience sees, hears and feels, moment by moment. Two editors given the same raw footage can produce videos that feel completely different, one gripping and one boring.

### Editing is storytelling

Zara, a food creator in Lahore, films 40 minutes of footage at a new biryani spot: arriving, ordering, chatting with the owner, tasting, reacting, and a lot of waiting. Her editor turns this into a 45-second Reel. Every decision matters:

- Which moment opens the video, so viewers do not scroll away?
- Which parts of the conversation are interesting, and which can go?
- When does the first bite happen, and how long do we stay on the reaction?
- What music sets the mood, and where does it rise and fall?
- Where do captions help, and where do they distract?

The raw footage is the same. The editing creates the story.

### The editor's main jobs

| Job | What it involves |
|---|---|
| Selecting | Choosing the best takes and moments from all the footage |
| Structuring | Ordering moments so the video has a beginning, middle and end |
| Pacing | Deciding how long each shot lasts and how quickly things move |
| Sound | Cleaning dialogue, adding music and effects, balancing levels |
| Colour | Making shots look consistent and setting a mood |
| Graphics | Captions, titles, lower thirds and simple animation |
| Delivery | Exporting in the right format for each platform |

In large productions these jobs are split between editors, sound designers, colourists and motion designers. As a freelance or social media editor, you usually do all of them, which is why this course covers each one.

### Invisible editing

The best edits are rarely noticed. When cuts feel natural, viewers stay absorbed in the content. When a cut is jarring, audio jumps in volume or colours change between shots, viewers notice the editing instead of the story, and often leave. Much of this course is about the techniques that make editing feel invisible, and about when to break the rules on purpose for energy and style.

### The typical workflow

Almost every editing project follows the same stages:

\`\`\`text
1. Plan        Understand the goal, audience and platform
2. Organise    Import and name footage, audio and graphics
3. Assemble    Rough cut: put the best moments in order
4. Refine      Fine cut: tighten timing, fix pacing
5. Polish      Sound, colour, captions and graphics
6. Deliver     Export for each platform and review
\`\`\`

Beginners often jump to effects and transitions before the story works. Professionals get the structure right first, because no amount of polish saves a video with a weak structure.

### Why editing skills are in demand

Short-form video now drives much of social media. Brands, creators, coaches, restaurants, real estate agents and small businesses all need a steady flow of videos, and most of them do not have time to edit. That creates steady work for editors locally and remotely, from a few Reels a week for a Karachi bakery to long YouTube videos for international creators. Chapter 12 covers how to turn these skills into income.
      `,
        [
          q('What is the most valuable thing an editor does?', [
            'Adding as many effects as possible',
            'Deciding what the audience sees and feels, moment by moment',
            'Making the file size smaller',
            'Choosing the camera used for filming',
          ], 1, 'Editing shapes the story through selection, order and timing, which determines whether viewers stay engaged.'),
          q('What should an editor get right before adding effects and polish?', [
            'The export settings',
            'The thumbnail design',
            'The structure and story of the video',
            'The colour of the captions',
          ], 2, 'A strong structure is essential, since polish cannot rescue a video whose story does not work.'),
          q('What does "invisible editing" mean?', [
            'Removing all cuts from a video',
            'Hiding the editor\'s name from the credits',
            'Using transparent text for captions',
            'Cuts and sound feel natural, so viewers stay absorbed',
          ], 3, 'When edits are smooth, viewers focus on the content rather than noticing the editing itself.'),
        ]
      ),
      lesson('Frame Rates, Resolution and Aspect Ratios', 13, `
Before you edit anything, three settings shape every video: how many images per second it shows, how many pixels each image has, and the shape of the frame. Getting them wrong causes jerky motion, blurry exports or black bars, so it pays to understand them early.

### Frame rate

Video is a series of still images, called frames, shown quickly one after another. Frame rate is the number per second, written fps.

| Frame rate | Look and common use |
|---|---|
| 24 fps (23.976) | Cinematic; films and many YouTube creators |
| 25 fps | Standard in PAL regions, including Pakistan, for TV and general video |
| 30 fps (29.97) | Common for phones and social media, standard in NTSC regions |
| 50 or 60 fps | Smooth motion; gaming, sports, screen recordings |
| 120 fps and above | Slow motion when played back at 24, 25 or 30 fps |

### A tip for filming in Pakistan

Pakistan's mains electricity runs at 50 Hz, so many indoor lights flicker 100 times a second. Filming at 30 or 60 fps under such lights can cause visible flicker or banding. Filming at 25 or 50 fps usually avoids it. If your phone or camera allows manual settings, a shutter speed of 1/50 or 1/100 helps too.

### Keep frame rates consistent

Set your project or timeline to the frame rate most of your footage uses. Mixing 25 fps and 30 fps clips in one timeline causes slight stutter in some clips. Slow motion is the exception: footage filmed at 50 or 60 fps can be slowed to half speed on a 25 or 30 fps timeline, giving smooth slow motion.

### Resolution

Resolution is the number of pixels in each frame:

| Name | Pixels (landscape) | Notes |
|---|---|---|
| HD, 720p | 1280 x 720 | Low by today's standards |
| Full HD, 1080p | 1920 x 1080 | The standard for most online video |
| 4K UHD | 3840 x 2160 | Higher detail, larger files, heavier editing |

Filming in 4K and editing on a 1080p timeline gives you room to crop and zoom without losing quality, a popular technique for creating movement in talking-head videos. The cost is larger files and a heavier load on your computer.

### Aspect ratio

Aspect ratio is the shape of the frame, width to height:

\`\`\`text
16:9   landscape   1920 x 1080   YouTube, TV, websites
9:16   vertical    1080 x 1920   Reels, TikTok, YouTube Shorts, Stories
1:1    square      1080 x 1080   Some feed posts
4:5    portrait    1080 x 1350   Instagram and Facebook feed posts
\`\`\`

Decide the main platform before filming. If the video is mainly for Reels and TikTok, film vertically or frame horizontal shots with enough space to crop to 9:16 later.

### Safe zones

On vertical platforms, the app's buttons, captions and username cover parts of the screen, especially the bottom and right side. Keep important text and faces within a central safe area, away from the edges. Many editors use a safe-zone overlay image in their project to check this.

### Set the timeline correctly from the start

Before editing, check your sequence or project settings: resolution, aspect ratio and frame rate. Changing them after hours of editing can shift positions, scaling and timing. Two minutes of setup saves an hour of fixing later.
      `,
        [
          q('Why is 25 or 50 fps often better for filming under lights in Pakistan?', [
            'Phones cannot record 30 fps in Pakistan',
            'Mains power is 50 Hz, so these rates reduce flicker',
            'Social platforms reject 30 fps videos from Pakistan',
            'Higher frame rates always cause blur',
          ], 1, 'Lights powered by 50 Hz mains flicker in a pattern that matches 25 and 50 fps, avoiding visible flicker.'),
          q('What aspect ratio do Reels, TikTok and YouTube Shorts use?', [
            '16:9',
            '4:3',
            '1:1',
            '9:16',
          ], 3, 'Vertical short-form platforms use 9:16, usually at 1080 by 1920 pixels.'),
          q('Why keep important text inside the safe zone on vertical videos?', [
            'Text outside it is deleted when uploading',
            'Safe zones make videos load faster',
            'App buttons and captions cover the screen edges',
            'Platforms require all text in the centre',
          ], 2, 'Platform interface elements overlay the edges, so text near them may be hidden.'),
        ]
      ),
      lesson('Codecs, Containers and File Formats', 13, `
Every video file has two layers that confuse many beginners: the container, which is the file type you see, and the codec, which is how the video inside is compressed. Understanding the difference explains why some files play smoothly while others stutter, and why exports can be huge or blurry.

### Container versus codec

The container is like a box: \`.mp4\`, \`.mov\` or \`.mxf\`. It holds the video stream, the audio streams and extra information such as timecode. The codec is the method used to compress the video inside, such as H.264 or ProRes.

\`\`\`text
my-video.mp4
  container: MP4
  video codec: H.264
  audio codec: AAC
\`\`\`

Two \`.mov\` files can contain completely different codecs, which is why "it is a MOV file" does not tell you how it will behave.

### Delivery codecs

Delivery codecs compress heavily to keep files small for uploading and streaming:

| Codec | Also called | Notes |
|---|---|---|
| H.264 | AVC | The most compatible; the safe choice for uploads |
| H.265 | HEVC | Similar quality at smaller sizes; used by many phones; heavier to edit |
| AV1 | | Efficient, increasingly used by platforms for streaming |

H.264 and H.265 use long-GOP compression: they store full frames only occasionally and describe the frames in between as changes. That is efficient for storage but hard work for editing software, because it must reconstruct frames as you scrub the timeline.

### Editing codecs

Editing or intermediate codecs store each frame more completely, producing larger files that play smoothly while editing:

| Codec | Common in |
|---|---|
| Apple ProRes | Mac workflows, many cameras and recent iPhones |
| Avid DNxHD and DNxHR | Windows and cross-platform workflows |
| Cineform | Some GoPro workflows |

If your computer struggles with H.265 phone footage, converting to an editing codec or using proxies, covered in chapter 5, makes editing much smoother.

### Variable frame rate from phones

Phones often record variable frame rate, where the frame rate changes slightly during recording to save power. Editing software may then show audio drifting out of sync over long clips. Solutions include setting your phone to a fixed frame rate if it offers one, or converting clips to constant frame rate with a free tool such as HandBrake before editing.

### Bitrate

Bitrate is how much data per second the video uses, measured in megabits per second (Mbps). Higher bitrate generally means higher quality and larger files. When exporting, a bitrate that is too low causes blocky, smeared images, especially in fast motion. Chapter 11 gives practical export settings for each platform.

### Audio formats

Audio in delivery files is usually AAC. When working with separate audio recordings, WAV files are uncompressed and preferred for editing, while MP3 files are compressed and best avoided for professional work when a WAV is available.

### Image formats for graphics

| Format | Use |
|---|---|
| PNG | Logos and graphics with transparent backgrounds |
| JPG | Photos without transparency |
| MOV with alpha (for example ProRes 4444) | Animated graphics with transparency |

### A practical rule

Film with the best settings your device allows, edit in a format your computer handles smoothly, and export in a widely compatible delivery format such as H.264 in an MP4 container. Following that rule avoids most technical headaches.
      `,
        [
          q('What is the difference between a container and a codec?', [
            'The container holds the streams; the codec is how video is compressed',
            'They are two names for the same thing',
            'The codec is the file extension; the container is the resolution',
            'Containers are only used for audio files',
          ], 0, 'A container such as MP4 wraps video and audio streams, while a codec such as H.264 defines the compression.'),
          q('Why can H.265 phone footage feel slow to edit?', [
            'H.265 files cannot be imported into editors',
            'It records without any audio track',
            'Its resolution is always lower than H.264',
            'Long-GOP compression makes frames hard to reconstruct',
          ], 3, 'Frames between full keyframes must be calculated during playback, which demands heavy processing.'),
          q('Which is the safest widely compatible choice for uploading?', [
            'Uncompressed AVI',
            'H.264 in an MP4 container',
            'ProRes 4444 with alpha',
            'An MP3 file',
          ], 1, 'H.264 in MP4 is accepted almost everywhere and balances quality with file size.'),
        ]
      ),
      lesson('Choosing Your Editor: CapCut, Premiere Pro or DaVinci Resolve', 13, `
The three editors in this course cover almost every situation, from quick Reels on a phone to broadcast-quality work. Each has strengths, and many professional editors use more than one. Choosing well depends on your device, budget and the kind of work you want to do.

### CapCut

CapCut is available on phones, as a desktop app and in a web browser. It is extremely popular for short-form content because it is fast, simple, and full of social-friendly features such as auto captions, trending effects and templates.

- **Strengths**: easy to learn; excellent automatic captions; quick vertical editing; runs on a phone.
- **Limitations**: less precise for complex projects; some features and exports require a paid subscription; limited professional colour and audio tools compared with the others.

### Adobe Premiere Pro

Premiere Pro is an industry-standard editor used by YouTubers, agencies and broadcasters. It is available by subscription as part of Adobe Creative Cloud.

- **Strengths**: powerful editing tools; works closely with Photoshop, After Effects and Audition; widely requested by clients and employers; text-based editing and automatic captions.
- **Limitations**: ongoing subscription cost; needs a reasonably powerful computer.

### DaVinci Resolve

DaVinci Resolve, from Blackmagic Design, started as professional colour grading software and grew into a complete editor. It has a very capable free version and a paid Studio version sold as a one-time purchase.

- **Strengths**: the free version is remarkably complete; industry-leading colour tools; built-in audio (Fairlight) and effects (Fusion).
- **Limitations**: steeper learning curve; it relies heavily on the graphics card, so older laptops may struggle.

### Side by side

| | CapCut | Premiere Pro | DaVinci Resolve |
|---|---|---|---|
| Cost | Free with paid features | Subscription | Free, or one-time Studio licence |
| Platforms | Phone, desktop, web | Windows, macOS | Windows, macOS, Linux |
| Learning curve | Easy | Moderate | Moderate to steep |
| Best for | Fast short-form content | Professional editing, client work | Colour, free professional editing |
| Captions | Excellent automatic captions | Automatic captions and transcripts | Automatic captions, more fully in Studio |

Features and prices change, so check each product's current website before buying.

### Which should you learn first?

\`\`\`text
Only have a phone, want to post Reels now    -> start with CapCut
Want agency or YouTube client work           -> learn Premiere Pro
Want professional tools without subscription -> learn DaVinci Resolve
\`\`\`

The skills transfer. Cutting, pacing, sound and colour principles are the same everywhere; only the buttons differ. Many editors start in CapCut to learn short-form style, then move to Premiere Pro or Resolve for longer and more complex work.

### Hardware basics

For desktop editing, the most important components are:

- **RAM**: 16 GB is a comfortable minimum for 1080p editing; more helps with 4K.
- **Graphics card**: especially important for DaVinci Resolve and effects.
- **Storage**: a fast SSD for your projects and footage makes a big difference.
- **Power backup**: a UPS protects long renders from load-shedding.

You do not need the most expensive computer to start. Proxies and smart project settings, covered later, let modest machines edit smoothly.
      `,
        [
          q('Which editor is best if you only have a phone and want to post Reels quickly?', [
            'CapCut',
            'DaVinci Resolve Studio',
            'Premiere Pro',
            'Fairlight',
          ], 0, 'CapCut runs on phones and is designed for fast short-form editing with features like auto captions.'),
          q('What is a key advantage of DaVinci Resolve\'s free version?', [
            'It includes every Studio feature without limits',
            'It runs only on phones',
            'It is a remarkably complete professional editor at no cost',
            'It requires a monthly subscription',
          ], 2, 'Resolve\'s free version offers professional editing, colour, audio and effects without paying.'),
          q('Why is a UPS worth having for video editing in Pakistan?', [
            'It speeds up exports',
            'It improves colour accuracy',
            'It adds more RAM',
            'It protects long renders from power cuts',
          ], 3, 'Load-shedding can interrupt renders and corrupt projects, so backup power protects your work.'),
        ]
      ),
      ],
      [
      q('Which stage should come before polish like colour and captions?', [
        'Delivery',
        'Exporting thumbnails',
        'Assembling and refining the structure',
        'Uploading to social media',
      ], 2, 'Editors build a rough cut and refine it before polishing, so the story works before details are added.'),
      q('A vertical video for Reels should usually use which resolution?', [
        '1080 x 1920',
        '1920 x 1080',
        '1280 x 720',
        '3840 x 2160 landscape',
      ], 0, 'Vertical 9:16 video is typically produced at 1080 pixels wide and 1920 pixels tall.'),
      q('Phone footage drifts out of sync with audio on long clips. What is a likely cause?', [
        'The file uses the MP4 container',
        'The resolution is too high',
        'The audio is in AAC format',
        'Variable frame rate recording',
      ], 3, 'Variable frame rate can confuse editing software, so converting to constant frame rate often fixes the drift.'),
      q('Which statement about skills across editors is true?', [
        'Skills learned in CapCut cannot be used in Premiere Pro',
        'Each editor uses completely different editing principles',
        'Cutting, pacing, sound and colour principles transfer between editors',
        'Only Resolve teaches professional techniques',
      ], 2, 'The craft of editing is the same everywhere; only the interface and buttons differ.'),
      ]
    ),
    chapter(
      'Planning, Filming and Organising',
      'Turn an idea into a script and shot list, film sharp, well-lit footage on a phone, record clear audio, and organise every project so editing is fast and nothing gets lost.',
      [
      lesson('From Idea to Script and Shot List', 13, `
Editing starts before the camera rolls. A video planned with the edit in mind is faster to cut and far better to watch. Even a 30-second Reel benefits from five minutes of planning, and for client work a clear plan prevents the most common problem in video: footage that does not tell the story.

### Start with one clear goal

Every video should have one main purpose and one audience. Write it in a sentence:

\`\`\`text
Goal: Show Karachi office workers that Crumbs Bakery's lunch box is
      quick, filling and affordable, so they order on WhatsApp today.
\`\`\`

This sentence guides every later decision: what to film, what to cut and what text to show.

### A simple short-form script structure

Short videos work best with a tight structure:

| Part | Length | Purpose |
|---|---|---|
| Hook | 0 to 3 seconds | Stop the scroll with a question, surprise or bold claim |
| Setup | A few seconds | Make the viewer care: the problem or context |
| Value | Most of the video | Show, teach or entertain; the core content |
| Payoff | The end | The result, reveal or call to action |

A script for the bakery might read:

\`\`\`text
HOOK:    "Lunch for 450 rupees that actually fills you up?" (close-up of box opening)
SETUP:   Office worker at desk, checking time, stressed about lunch
VALUE:   Quick shots of the sandwich, salad, drink; price on screen
PAYOFF:  "Order on WhatsApp before 12, delivered by 1." Number on screen.
\`\`\`

Chapter 10 goes deeper into hooks and retention. For now, the point is to know the structure before filming.

### Write for speaking, not reading

If someone will speak to camera, write the way people talk: short sentences, simple words, no long lists. Read it aloud and cut anything that feels unnatural. A script that sounds natural makes the speaker more confident and the edit smoother.

### The shot list

A shot list names every shot you need, so nothing is missing when you sit down to edit:

| # | Shot | Type | Notes |
|---|---|---|---|
| 1 | Box opening, top-down | Close-up | Slow, clean table |
| 2 | Worker checking watch | Medium | Office background |
| 3 | Sandwich cut in half | Extreme close-up | Show filling |
| 4 | Presenter line to camera | Medium | Two or three takes |
| 5 | Delivery rider handing over box | Wide | Daylight |
| 6 | Extra details: logo, packaging, drink | Close-ups | B-roll |

### Always film extra b-roll

B-roll is supporting footage that plays over speech or fills gaps: close-ups, details, reactions, the location. Editors never complain about too much b-roll, but often about too little. Film several seconds of each detail, from more than one angle. Chapter 6 shows how to use it.

### Shooting for the edit

A few habits make editing dramatically easier:

- Start recording a second or two before the action and stop a second or two after, leaving room for cuts.
- Record several takes of important lines, and say "take two" out loud, so you can find them later.
- Vary shot sizes, wide, medium and close-up, so you can cut between them smoothly.
- Clap once in front of the camera at the start if recording audio separately, to sync later.

### Keep plans flexible

Plans help, but real shoots bring surprises: a great spontaneous moment, a location that does not work. Treat the script and shot list as a guide. The goal sentence from the beginning tells you which surprises are worth keeping.
      `,
        [
          q('What are the four parts of the short-form script structure?', [
            'Intro, credits, music and outro',
            'Hook, setup, value and payoff',
            'Title, logo, thumbnail and description',
            'Wide, medium, close-up and cutaway',
          ], 1, 'Short-form videos grab attention, create context, deliver the core content and end with a result or call to action.'),
          q('Why film plenty of b-roll?', [
            'Platforms require at least ten b-roll shots',
            'B-roll replaces the need for a script',
            'It gives the editor supporting shots to cover speech and gaps',
            'It makes the file size smaller',
          ], 2, 'B-roll provides options to show details, hide cuts and keep the video visually interesting.'),
          q('Why start recording a second or two before the action?', [
            'It leaves room for clean cuts in the edit',
            'Cameras need time to switch on their microphones',
            'It improves the video\'s colour',
            'Platforms trim the first two seconds automatically',
          ], 0, 'Extra handles at the start and end of each shot give the editor flexibility to cut at the right moment.'),
        ]
      ),
      lesson('Filming Good Footage on a Phone', 13, `
Modern phones can produce excellent video, good enough for most social media and plenty of client work. The difference between amateur and professional-looking phone footage rarely comes from the phone itself. It comes from light, stability, framing and a few settings.

### Light is the biggest factor

Cameras, especially small phone sensors, need plenty of light for clean, sharp images. In low light, footage becomes grainy and soft.

- Face a window with soft daylight falling on the subject, rather than having the window behind them.
- Avoid harsh midday sun directly on faces; shade or cloudy days give softer light.
- Indoors, turn off mixed coloured lights where possible, so skin tones stay natural.
- A simple LED panel or ring light, positioned slightly to one side of the camera, improves talking-head videos greatly.

### Keep it steady

Shaky footage looks amateur unless it is deliberate. Use a tripod or phone stand for static shots. For moving shots, hold the phone with both hands close to your body, or use a gimbal. Most phones also offer stabilisation modes; test them, because some crop the image.

### Use the main camera

Phones usually have several lenses. The main wide lens typically has the best quality and performs best in low light. The front selfie camera is often lower quality; for important talking-head videos, use the rear camera with a mirror or a second person to check framing.

### Framing basics

| Guideline | How to apply it |
|---|---|
| Rule of thirds | Place eyes roughly on the top third line of the frame |
| Headroom | Leave a little space above the head, not too much |
| Eye level | Keep the camera at the subject's eye height |
| Clean background | Remove clutter; add depth with distance from the wall |
| Vertical for short-form | Film 9:16 when the main platform is Reels or TikTok |

For vertical video, remember the safe zone from chapter 1: keep faces and key action in the centre area.

### Settings worth checking

\`\`\`text
Resolution and frame rate   1080p or 4K; 25, 30, 50 or 60 fps as planned
Exposure lock               Tap and hold to lock focus and exposure
Grid lines                  Turn on to help framing
HDR video                   Can look odd on some platforms; test before using
Storage                     Enough free space before a shoot
Airplane mode               Stops calls interrupting recording
\`\`\`

Locking focus and exposure prevents the brightness from pumping as people move, which is one of the most common problems in phone footage.

### Clean the lens

A fingerprint on the lens makes everything look hazy, especially around lights. Wipe it with a soft cloth before every shoot. It takes two seconds and fixes a surprising number of blurry videos.

### Variety for the edit

Film the same moment in different shot sizes: a wide shot to show the place, a medium shot for the person, close-ups for details like hands and food. Editors cut between these to create rhythm and hide small mistakes. Even moving the phone a little closer for a second take gives the editor a useful alternative angle.

### Review before you leave

Before leaving a location, play back a few clips at full size. Check focus, exposure and audio. It is far easier to reshoot a shot now than to explain to a client later why a key moment is blurry.
      `,
        [
          q('Where should a subject face relative to a window for flattering light?', [
            'With the window directly behind them',
            'Facing the window, so daylight falls on their face',
            'With no windows in the room',
            'Under a single bright ceiling bulb',
          ], 1, 'Facing soft window light illuminates the face evenly, while a window behind creates a dark silhouette.'),
          q('Why lock focus and exposure before recording?', [
            'It increases the frame rate',
            'It records better audio',
            'It changes the aspect ratio',
            'It stops brightness and focus shifting as people move',
          ], 3, 'Locking prevents the camera from constantly readjusting, which causes distracting changes in brightness and focus.'),
          q('Why film the same moment in several shot sizes?', [
            'Platforms require at least three angles',
            'It reduces the file size of each clip',
            'Editors can cut between them for rhythm and to hide mistakes',
            'It improves the colour of the footage',
          ], 2, 'Wide, medium and close shots give the editor options to vary pace and cover imperfections.'),
        ]
      ),
      lesson('Recording Clear Audio', 13, `
Viewers forgive average video far more easily than bad audio. If they cannot hear clearly, or the sound is echoey, noisy or distorted, they leave within seconds. The good news is that clear audio is cheap to achieve with the right microphone placement and a few habits.

### Distance matters most

The most important rule: get the microphone close to the speaker's mouth. A phone's built-in microphone a few metres away records mostly room echo and background noise. The same voice recorded with a microphone 20 centimetres away sounds clear and present.

### Microphone options

| Microphone | How it works | Good for |
|---|---|---|
| Wireless lavalier (clip-on) | Small mic clipped to clothing, transmitting to the phone or camera | Talking heads, interviews, moving around |
| Wired lavalier | Clip-on mic with a cable to the phone | Budget option for seated talking |
| Shotgun mic | Directional mic on the camera or a boom | Capturing what is in front of the camera |
| USB or podcast mic | Mic on a desk, connected to a computer | Voiceovers and screen recordings |

Affordable wireless lavalier kits are widely available in Pakistan and are the single best upgrade for most creators.

### Placement tips for lavalier mics

- Clip it on the chest, about a hand's width below the chin.
- Keep it clear of jewellery, dupattas and scarves that can rub against it.
- Hide the cable under clothing for a cleaner look, but avoid fabric rubbing directly on the mic.
- Use the foam or furry windscreen outdoors.

### Choose a quiet space

Background noise is hard to remove later. Before recording:

- Switch off fans and air conditioners if possible, or record between their cycles.
- Close windows facing busy roads, and pause for loud traffic, horns or the call to prayer.
- Move away from generators and UPS units, which hum.
- Tell others nearby that you are recording.

### Reduce echo

Empty rooms with hard walls and floors echo badly. Soft materials absorb sound: rugs, curtains, sofas, cushions and bookshelves. A bedroom with a bed and curtains often sounds better than a bare office. Some creators record voiceovers surrounded by blankets or inside a wardrobe of clothes, which works surprisingly well.

### Set levels to avoid distortion

If the recording level is too high, loud moments distort, a harsh crackle called clipping, which cannot be fixed later. If too low, you must boost it and the noise rises with it. Aim for normal speech peaking comfortably below the maximum:

\`\`\`text
Normal speech peaks     around -12 dB
Loud laughs or shouts   never touching 0 dB
\`\`\`

Many wireless kits offer a safety track recorded at a lower level, which rescues unexpected shouts.

### Record room tone

Before or after the main recording, record 10 to 20 seconds of silence in the same room, with everyone still. Editors use this room tone to fill gaps and to teach noise reduction tools what the background noise sounds like, which chapter 7 covers.

### Always monitor

Listen with headphones while recording, at least at the start. It reveals problems such as a loose cable, rustling clothing or a mic switched off, before you record a whole session with no usable sound.
      `,
        [
          q('What is the single most important rule for clear speech recording?', [
            'Get the microphone close to the speaker\'s mouth',
            'Record at the highest possible level',
            'Always use the phone\'s built-in microphone',
            'Record in an empty room with hard walls',
          ], 0, 'Close placement captures the voice strongly relative to echo and background noise.'),
          q('What is clipping in audio?', [
            'A clip-on microphone',
            'Cutting audio into short sections',
            'Distortion when the level exceeds the maximum',
            'Background noise from fans',
          ], 2, 'Clipping happens when the signal goes above the maximum level, causing harsh distortion that cannot be repaired.'),
          q('Why record 10 to 20 seconds of room tone?', [
            'Platforms require silence at the start of videos',
            'It improves the video\'s colour',
            'It makes the file smaller',
            'It helps fill gaps and train noise reduction',
          ], 3, 'Room tone captures the background sound, useful for smooth gaps and for noise reduction tools.'),
        ]
      ),
      lesson('Folders, Naming and Project Setup', 12, `
Professional editors spend a surprising amount of time organising, and it pays off enormously. A well-organised project is faster to edit, easy to hand over to someone else, and safe from the nightmare of missing media when you reopen it months later.

### One folder per project

Create a folder structure before importing anything, and use the same structure for every project:

\`\`\`text
2025-03_Crumbs-Bakery_Lunchbox-Reel/
  01_Footage/
     A-Cam/
     Phone/
  02_Audio/
     Voiceover/
     Music/
     SFX/
  03_Graphics/
     Logos/
     Fonts/
  04_Project/
  05_Exports/
     Drafts/
     Final/
  06_Documents/   (brief, script, shot list, feedback)
\`\`\`

Starting folder names with numbers keeps them in a logical order. Using the same structure every time means you always know where things are.

### Name files meaningfully

Camera files arrive with names like \`IMG_4821.MOV\` or \`C0012.MP4\`. Renaming important clips, or at least adding descriptive labels inside your editor, makes searching easy. For exports, include the project, version and date:

| Poor name | Better name |
|---|---|
| final.mp4 | CrumbsBakery_Lunchbox_9x16_v03_2025-03-14.mp4 |
| final-final-2.mp4 | CrumbsBakery_Lunchbox_9x16_v04_FINAL.mp4 |

Version numbers make it clear which file is the latest and let you return to earlier versions if a client changes their mind.

### Copy, do not just link

Editors link to media files where they are stored. If footage stays on a memory card or phone and you later remove it, the project shows "media offline". Always copy footage to your project folder on your computer or external drive before importing. Keep a second copy until the project is finished and delivered.

### Organise inside the editor

Mirror your folder structure inside the editor using bins (Premiere Pro and Resolve) or folders:

- A bin for each footage source or scene.
- Separate bins for music, sound effects and graphics.
- A bin for sequences or timelines, named with versions.

Use colour labels and markers to flag your best takes. Ten minutes spent marking the good moments while watching footage saves an hour of searching later.

### Backups: the 3-2-1 rule

Hard drives fail, laptops are stolen and files get deleted. Professionals follow the 3-2-1 rule:

\`\`\`text
3 copies of important files
2 different types of storage (for example a laptop SSD and an external drive)
1 copy off-site (for example cloud storage or a drive kept at another location)
\`\`\`

For client work, losing footage can mean losing the client. External drives are affordable compared with the cost of a reshoot.

### Archive finished projects

When a project is delivered and approved, move the whole folder to an archive drive. Many editors also keep the final exports and project file in cloud storage. Clients often come back months later asking for a small change or a new version for another platform, and a tidy archive makes that a quick, paid job instead of a panic.
      `,
        [
          q('Why start project folder names with numbers like 01 and 02?', [
            'It keeps folders in a logical order',
            'Editing software requires numbered folders',
            'It reduces file sizes',
            'It hides folders from other users',
          ], 0, 'Numbered prefixes sort folders in a consistent, predictable order across every project.'),
          q('What causes "media offline" in a project?', [
            'Exporting at too high a resolution',
            'Using too many colour labels',
            'Removing the files the project links to, like a memory card',
            'Naming files with version numbers',
          ], 2, 'Editors link to media locations, so moving or removing source files breaks those links.'),
          q('What does the 3-2-1 backup rule recommend?', [
            'Three exports, two thumbnails, one project file',
            'Three editors, two computers, one client',
            'Three drafts sent, two revisions, one final file',
            'Three copies, two storage types, one copy off-site',
          ], 3, 'Multiple copies on different media and locations protect against drive failure, theft and accidental deletion.'),
        ]
      ),
      ],
      [
      q('What should a video\'s one-sentence goal include?', [
        'The editing software used',
        'The purpose, the audience and the desired action',
        'The file format and resolution',
        'The number of cuts planned',
      ], 1, 'A clear goal naming purpose, audience and action guides decisions throughout filming and editing.'),
      q('A presenter is recorded with a phone three metres away and sounds echoey. What helps most?', [
        'Using a lavalier microphone close to the speaker',
        'Raising the recording level to maximum',
        'Filming at a higher frame rate',
        'Adding more lights',
      ], 0, 'Moving the microphone close captures clear speech and reduces room echo dramatically.'),
      q('Which habit prevents distracting brightness changes in phone footage?', [
        'Turning on HDR for every shot',
        'Using the front selfie camera',
        'Filming only at night',
        'Locking focus and exposure',
      ], 3, 'Locked exposure and focus keep the image stable as subjects move or lighting changes slightly.'),
      q('Why include version numbers in export file names?', [
        'Platforms reject files without them',
        'They make exports render faster',
        'They show which file is latest and allow returning to earlier versions',
        'They improve video quality',
      ], 2, 'Clear version naming prevents confusion over the latest file and keeps earlier versions available.'),
      ]
    ),
    chapter(
      'CapCut Essentials',
      'Find your way around CapCut on phone and desktop, cut and arrange clips quickly, add auto captions, text and stickers, and use effects, templates and export settings without looking amateur.',
      [
      lesson('The CapCut Interface on Phone and Desktop', 12, `
CapCut is where many editors start, and where many professionals still produce quick short-form content. It exists as a phone app, a desktop app and a web version, with a similar layout in each. CapCut updates its interface frequently, so button names and positions may differ slightly from this lesson, but the structure stays the same.

### Starting a project

On the phone app, tap New project, select your clips in the order you want them, and tap Add. On desktop, click Create project, then import media by dragging files into the media panel or using the Import button.

Set the aspect ratio early. On mobile it is usually under a Ratio or Format option in the bottom toolbar when nothing is selected; on desktop it is in the player's ratio settings. Choose 9:16 for Reels, TikTok and Shorts.

### The phone layout

| Area | What it does |
|---|---|
| Preview (top) | Plays the video; tap to play or pause |
| Timeline (middle) | Your clips in order, with the playhead as a white vertical line |
| Toolbar (bottom) | Edit, Audio, Text, Stickers, Overlay, Effects, Filters, Adjust and more |

Pinch the timeline to zoom in and out. Drag the timeline under the playhead to move through the video. Tapping a clip selects it and changes the bottom toolbar to show tools for that clip, such as Split, Speed, Volume and Delete.

### The desktop layout

\`\`\`text
+------------------+---------------------+------------------+
| Media, audio,    |      Player         |  Properties of   |
| text, effects    |    (preview)        |  selected item   |
| libraries        |                     |                  |
+------------------+---------------------+------------------+
|                     Timeline                               |
+------------------------------------------------------------+
\`\`\`

The desktop version is much faster for longer or more detailed edits: a larger timeline, precise mouse control and keyboard shortcuts. Many editors plan and caption on desktop and use the phone app for quick fixes on the move.

### Main track and layers

CapCut's timeline has a main video track and layers above it:

- **Main track**: the base video. Clips here close gaps automatically when you delete or move something, like a magnet.
- **Overlay layers**: video or images placed above the main track, used for b-roll, picture-in-picture and logos.
- **Text, sticker and effect tracks**: appear above the video.
- **Audio tracks**: music, voiceovers and sound effects appear below.

Understanding which track something is on explains most confusing behaviour, such as why deleting a clip moved everything else.

### Undo and project safety

The undo and redo arrows sit near the preview. CapCut saves projects automatically, but projects live on the device or in CapCut's own storage and cloud space. For client work, keep your original footage in your organised project folder from chapter 2, not only inside CapCut.

### Remove the default ending

On mobile, CapCut may add a short branded ending clip to new projects. Many editors turn this off in the app's settings, or delete the ending clip from the timeline before exporting. Client videos should not end with an unexpected logo.

### Free and paid features

CapCut is free to use, but some effects, templates, AI features and export options require a paid subscription. Items marked as Pro may add a watermark or block export if you do not subscribe. Check before building a client edit around a paid effect, so there are no surprises at export time.
      `,
        [
          q('When should you set the aspect ratio in CapCut?', [
            'At the start of the project',
            'Only when exporting the final video',
            'After adding all captions and effects',
            'It cannot be changed in CapCut',
          ], 0, 'Setting the ratio first ensures captions, framing and effects are positioned for the final shape.'),
          q('What happens when you delete a clip on CapCut\'s main track?', [
            'A black gap is left in its place',
            'The whole project is deleted',
            'The following clips move to close the gap',
            'The clip moves to an overlay layer',
          ], 2, 'The main track behaves magnetically, closing gaps automatically when clips are removed.'),
          q('What is an overlay layer used for?', [
            'Changing the export resolution',
            'Recording a voiceover',
            'Deleting the default ending',
            'Placing b-roll, picture-in-picture or logos above the main video',
          ], 3, 'Overlays sit above the main track, letting you show additional video or images on top of it.'),
        ]
      ),
      lesson('Cutting, Splitting and Arranging Clips', 13, `
The heart of editing in any software is the same: remove what does not serve the video and put the rest in the best order. CapCut makes this fast, and a few techniques make it faster still.

### Split and delete

The core action in CapCut is Split. Move the playhead to where you want to cut, select the clip and tap Split. The clip becomes two pieces. Select the unwanted piece and delete it.

On desktop, the shortcut Ctrl+B (Cmd+B on a Mac) splits at the playhead. Use the space bar to play and pause, and zoom the timeline so you can cut precisely between words.

### Trimming with handles

Select a clip and drag the white handles at either end to shorten or extend it. This is often quicker than splitting for small adjustments, such as removing a breath at the start of a sentence. Trimming only reveals footage that exists in the original clip; you cannot extend beyond it.

### Rearranging

Press and hold a clip on mobile, or drag on desktop, to move it to a new position. On the main track, other clips shift to make room. To place a clip on top of another rather than in sequence, add it as an overlay instead.

### Cutting a talking-head video efficiently

For a person speaking to camera, a fast method is:

\`\`\`text
1. Watch the whole clip once without cutting, noting the best takes.
2. Remove false starts, long pauses, repeated lines and "umm" moments.
3. Keep the best take of each line.
4. Tighten the gaps so each sentence follows naturally.
5. Watch again at normal speed and adjust anything that feels abrupt.
\`\`\`

Some CapCut versions offer automatic tools to remove silences or filler words. They save time, but always review the result; automatic cuts can clip the start of words or remove pauses that were there for effect.

### Speed changes

Select a clip and use Speed:

| Option | Use |
|---|---|
| Normal speed | Speed up boring actions (2x) or slow down highlights (0.5x) |
| Curve | Speed ramps: fast, then slow at a key moment, then fast again |

Slow motion looks smooth only if the clip was filmed at a high frame rate, such as 50 or 60 fps, as chapter 1 explained. Slowing 25 fps footage causes stuttering unless you use frame interpolation, which some versions offer as an option.

### Freeze frames and reverse

Freeze creates a still image from the current frame, useful for pausing on a reaction or adding text over a moment. Reverse plays a clip backwards, occasionally useful for creative effects.

### Replacing clips

Replace lets you swap a clip for another while keeping its position, length and applied effects. It is useful when you have built a template-like structure and want to try a different shot, or when a client sends a better take.

### Detach audio

To keep the sound of one clip under a different image, use the extract audio option to separate the audio into its own track. Then you can cut the video to b-roll while the speech continues, the basis of the J-cuts and L-cuts in chapter 6.

### Watch at full speed

Always review your cut at normal speed without stopping, ideally on a phone, the way viewers will see it. Rhythm problems that are invisible when scrubbing frame by frame become obvious when you watch straight through.
      `,
        [
          q('What does Ctrl+B do in CapCut desktop?', [
            'Adds a caption at the playhead',
            'Exports the project',
            'Splits the clip at the playhead',
            'Opens the effects library',
          ], 2, 'Ctrl+B, or Cmd+B on Mac, splits the selected clip at the playhead position.'),
          q('Why review automatic silence or filler word removal?', [
            'It can clip words or remove pauses that were intentional',
            'It always deletes the whole clip',
            'It changes the aspect ratio',
            'It adds a watermark to the video',
          ], 0, 'Automatic tools save time but make mistakes, so every cut should be checked by listening.'),
          q('Why does slow motion stutter on some clips?', [
            'The clip is on the main track',
            'The clip has captions',
            'The clip\'s audio was extracted',
            'The clip was filmed at a low frame rate',
          ], 3, 'Slowing footage needs extra frames; clips filmed at 25 or 30 fps lack them and appear jerky.'),
        ]
      ),
      lesson('Auto Captions, Text and Stickers', 13, `
Most people watch short-form video with the sound off, at least at first. Captions make your videos understandable in silence, more accessible to deaf and hard-of-hearing viewers, and easier to follow for everyone. CapCut's automatic captions are among its most popular features.

### Adding auto captions

Select Text, then Auto captions (the label may vary slightly), choose the spoken language and generate. CapCut transcribes the speech and creates timed caption clips on a text track.

Supported languages change over time, so check whether your language is available. For videos that mix Urdu and English, as many Pakistani creators do, automatic results can be patchy. Many editors generate English captions and then correct them by hand, or type Roman Urdu captions manually.

### Always proofread

Automatic captions make mistakes, especially with names, brands, technical terms and accents. A caption that says "Crumbs Bakery" as "Crumbs Brakery" looks careless to a client. Watch the whole video with captions on and fix each error. On desktop, editing caption text in the captions list is quickest.

### Styling captions for short-form

| Choice | Recommendation |
|---|---|
| Font | Bold, simple and readable; avoid thin or decorative fonts |
| Size | Large enough to read on a phone at arm's length |
| Words per caption | Short chunks, often 1 to 4 words for energetic content |
| Position | Centre or slightly below centre, inside the safe zone |
| Contrast | White text with a black outline or shadow, or a background box |
| Highlight | Colour or scale the key word in each line |

Once one caption looks right, apply the style to all captions using the option to apply to all or by saving a text preset.

### Manual text

For titles, labels and calls to action, add text with Text, then Add text. Keep on-screen text short: viewers have only a second or two to read it. Use text to add information the video does not say out loud, such as a price, an address or a step number.

Text animations, such as a quick pop or slide in, add energy, but keep them consistent. If every piece of text enters with a different animation, the video looks chaotic.

### Text-to-speech and voice effects

CapCut offers text-to-speech voices, popular for list-style content. Use them carefully: for many audiences, a real human voice builds more trust, and some brands prefer to avoid synthetic voices. If you use them, choose a voice that suits the brand and check pronunciation of local names.

### Stickers and emojis

Stickers, emojis and animated graphics can add humour and emphasis. Use them sparingly: one well-timed emoji reaction can be charming, while constant stickers distract from the message. For brand clients, check that stickers fit the brand's style; a serious clinic or law firm will usually want none at all.

### Captions and platform text

Most platforms also let you add captions when posting. Burned-in captions, which are part of the video image, look consistent everywhere and are standard for short-form. Separate caption files, covered in chapter 11, are more useful for longer videos on YouTube, where viewers can switch them on and off and platforms can index the words.

### Keep the safe zone in mind

Captions near the bottom can collide with the platform's own caption and username text. Place captions around the centre or slightly lower, and preview on your phone before exporting. A caption hidden behind the Like button helps nobody.
      `,
        [
          q('Why are captions so important for short-form video?', [
            'Platforms reject videos without captions',
            'Captions increase the video\'s resolution',
            'Many people watch with sound off, and captions aid accessibility',
            'Captions remove the need for audio',
          ], 2, 'Captions make videos understandable in silence and accessible to viewers who are deaf or hard of hearing.'),
          q('What should you always do after generating auto captions?', [
            'Proofread and correct every caption',
            'Export immediately to save time',
            'Delete the audio track',
            'Convert them to stickers',
          ], 0, 'Automatic transcription makes errors with names, terms and accents, so careful proofreading is essential.'),
          q('What is a good caption style for short-form content?', [
            'Thin decorative fonts in small sizes',
            'Long sentences across the full width',
            'Captions placed at the very bottom edge',
            'Bold readable text in short chunks with strong contrast',
          ], 3, 'Short, bold, high-contrast captions are easy to read quickly on a small screen.'),
        ]
      ),
      lesson('Effects, Templates and Exporting From CapCut', 13, `
CapCut's libraries of effects, filters, transitions and templates make it easy to create eye-catching videos quickly. They also make it easy to create videos that look exactly like everyone else's. Knowing when to use them, and how to export properly, separates polished work from amateur work.

### Effects and filters

CapCut offers video effects, such as shakes, glitches and flashes, and filters that change the colour and mood. Guidelines for using them well:

- Use effects to emphasise a moment, such as a beat drop or a reveal, not continuously.
- Choose one filter style for a video, and apply it consistently to all clips, perhaps using an adjustment layer.
- Reduce filter intensity; the default strength is often too heavy.
- For brand clients, subtle is almost always better.

### Adjust: basic colour correction

The Adjust panel lets you change brightness, contrast, saturation, temperature and more. Fix problems before adding style: if a clip is too dark or too blue, correct it first. Chapter 8 teaches colour correction in depth; the same principles apply in CapCut.

### Transitions

Tap the small icon between two clips to add a transition. Most good edits use simple cuts for the majority of transitions. Reserve flashy transitions for changes of scene or energy, and keep them short. Chapter 6 explains why.

### Templates

Templates let you drop your clips into a pre-made edit with music, timing and effects. They are useful for quick trend content, but have downsides:

| Advantage | Disadvantage |
|---|---|
| Very fast | Many other videos look identical |
| Follows current trends | Timing may not suit your footage |
| No editing skill needed | Music and assets may not be licensed for commercial use |

For personal trend videos, templates are fine. For client and brand work, build your own edits, perhaps inspired by a template's structure, so the result is original and properly licensed.

### Music and commercial use

CapCut includes a music library, but not every track is licensed for business or commercial use. Content made for a brand or client counts as commercial. Use tracks clearly marked as suitable for commercial use, music from a licensed library the client has rights to, or audio the client provides. Chapter 7 covers copyright in detail.

### Export settings

When you tap Export, check the settings:

| Setting | Recommendation for short-form |
|---|---|
| Resolution | 1080p for most uses; 4K only if the platform and footage support it |
| Frame rate | Match your footage, such as 25 or 30 fps |
| Bitrate (code rate) | Recommended or higher; avoid the lowest option |
| Format | MP4 |

Very high bitrates do not always help, because platforms recompress uploads. A good-quality 1080p export at a sensible bitrate usually looks best after upload.

### Review the export

Before sending to a client or posting, watch the exported file itself on your phone, from start to finish. Check that captions are correct, audio levels are consistent, there is no watermark or ending clip, and the first frame looks good. Occasionally something that looked fine in the editor appears differently in the export.

### When to move beyond CapCut

CapCut is excellent for fast short-form work. When projects become longer, involve many layers, need precise audio work or colour grading, or require collaboration with other editors, desktop editors like Premiere Pro and DaVinci Resolve are better tools. The next two chapters introduce them.
      `,
        [
          q('How should effects be used in a polished edit?', [
            'On every clip, continuously',
            'Always at full intensity',
            'Sparingly, to emphasise key moments',
            'Only on the first clip',
          ], 2, 'Effects work best as emphasis; constant effects become distracting and look amateur.'),
          q('Why might a CapCut template be a poor choice for client work?', [
            'Templates cannot be exported',
            'Templates only work on desktop',
            'Templates always use black and white filters',
            'Results look like others\' videos and assets may lack commercial licences',
          ], 3, 'Templates are common and may include music or assets not licensed for business use.'),
          q('What should you check when reviewing an exported file?', [
            'Captions, audio levels, watermarks and the first frame',
            'Only the file size',
            'Only the file name',
            'Nothing, if it looked fine in the editor',
          ], 0, 'Watching the actual export catches problems that were not visible in the editor preview.'),
        ]
      ),
      ],
      [
      q('On which CapCut track would you place b-roll that plays over a speaking presenter?', [
        'The audio track',
        'An overlay layer above the main track',
        'The text track',
        'The effects track',
      ], 1, 'Overlay layers sit above the main video, so b-roll can cover the presenter while their audio continues.'),
      q('A client\'s video ends with an unexpected CapCut logo clip. What should you have done?', [
        'Exported at a higher resolution',
        'Added more captions',
        'Used a template',
        'Turned off or deleted the default ending',
      ], 3, 'CapCut may add a branded ending on mobile, which should be removed before exporting client work.'),
      q('A video mixes Urdu and English speech. What is the sensible captioning approach?', [
        'Trust auto captions completely',
        'Skip captions because of the mixed language',
        'Generate captions, then correct or type them by hand',
        'Use only emojis instead of words',
      ], 2, 'Automatic results are often patchy for mixed-language speech, so manual correction keeps captions accurate.'),
      q('Which music is safe for a brand\'s CapCut video?', [
        'Any popular song from the charts',
        'Tracks licensed for commercial use',
        'Any track in CapCut\'s library',
        'Music from a template',
      ], 1, 'Brand content is commercial, so only music licensed for commercial use, or provided by the client with rights, is safe.'),
      ]
    ),
    chapter(
      'Premiere Pro Essentials',
      'Set up projects and sequences in Premiere Pro, use the precise trimming tools professionals rely on, edit at speed with keyboard shortcuts, and organise complex edits with nesting, adjustment layers and multicam.',
      [
      lesson('Projects, Sequences and the Premiere Interface', 13, `
Premiere Pro is one of the most widely used editors in agencies, YouTube channels and broadcast. It looks complex at first because it shows many panels at once, but those panels follow a logical flow: organise media, watch it, cut it, and see the result. Adobe updates Premiere regularly, so some panel names may differ slightly from this lesson.

### Projects and sequences

Two terms are central:

| Term | What it is |
|---|---|
| Project | The file (\`.prproj\`) that holds your bins, clips, sequences and settings |
| Sequence | A timeline inside the project, with its own resolution and frame rate |

A single project can contain many sequences, for example a 16:9 YouTube version and a 9:16 Reel from the same footage. The project file does not contain the media itself; it links to files on your drive, which is why the folder organisation from chapter 2 matters.

### Creating a sequence that matches your footage

The easiest way to get correct settings is to let Premiere copy them from a clip. Right-click a clip in the Project panel and choose New Sequence From Clip, or drag the clip onto the New Item icon. The sequence then matches that clip's resolution and frame rate.

For vertical content, create a sequence and set a custom frame size of 1080 by 1920, or duplicate a horizontal sequence and change its settings. Premiere's Auto Reframe can automatically reposition horizontal footage to keep the subject in a vertical frame, which is a big time saver when repurposing, though you should always check its choices.

### The main panels

\`\`\`text
+--------------------+--------------------+
|  Source Monitor    |  Program Monitor   |
|  (watch raw clips) |  (see the edit)    |
+--------------------+--------------------+
|  Project panel     |  Timeline          |
|  (bins and media)  |  (your sequence)   |
+--------------------+--------------------+
\`\`\`

- **Project panel**: all imported media, organised into bins.
- **Source Monitor**: double-click a clip to watch it here and mark the part you want.
- **Timeline**: where the sequence is built, with video tracks (V1, V2) above and audio tracks (A1, A2) below.
- **Program Monitor**: shows the sequence at the playhead position.
- **Tools panel**: selection, razor, ripple and other editing tools.
- **Effect Controls** and **Properties**: adjust the selected clip's position, scale, opacity and effects.

### Workspaces

Along the top, workspaces rearrange panels for different tasks: Editing, Color, Audio, Captions and Graphics, and Effects. Switching to the Color workspace, for example, opens the Lumetri Color panel for grading. If you accidentally close or rearrange panels, reset the workspace from the Window menu.

### Tracks and targeting

Video tracks stack like layers: V2 appears on top of V1. Audio tracks play together. On the left of each track are toggles to lock the track, hide it, mute it or target it. Source patching and track targeting decide which tracks receive clips when you insert them and which tracks are affected by cuts. When edits seem to affect the wrong track, check targeting first.

### Saving and auto-save

Save often with Ctrl+S (Cmd+S on a Mac). Premiere also auto-saves copies of your project at intervals, which you can adjust in preferences. For long client projects, save incremental versions such as \`Project_v01\`, \`Project_v02\` at key stages, so you can return to an earlier version if something goes wrong or a client changes direction.
      `,
        [
          q('What is the difference between a project and a sequence in Premiere Pro?', [
            'They are the same thing with different names',
            'A project holds bins and sequences; a sequence is one timeline',
            'A sequence contains many projects',
            'A project is only used for audio',
          ], 1, 'The project file organises everything, and each sequence is a timeline with its own settings.'),
          q('What is the easiest way to create a sequence with correct settings?', [
            'Guess the settings from memory',
            'Always choose the first preset in the list',
            'Export the clip first and reimport it',
            'Use New Sequence From Clip',
          ], 3, 'Creating a sequence from a clip copies its resolution and frame rate automatically.'),
          q('What does Auto Reframe help with?', [
            'Removing background noise',
            'Adding captions automatically',
            'Repositioning footage to keep the subject in a new aspect ratio',
            'Syncing multiple cameras',
          ], 2, 'Auto Reframe tracks the subject and reframes horizontal footage for vertical or square formats.'),
        ]
      ),
      lesson('Editing Tools: Ripple, Roll, Slip and Razor', 14, `
Beginners edit with just two tools: cut and drag. Professionals use a handful of specialised trimming tools that adjust edits precisely without breaking the rest of the timeline. Learning them feels slow for a day, then saves hours every week.

### The essential tools

| Tool | Shortcut | What it does |
|---|---|---|
| Selection | V | Select, move and trim clips |
| Razor | C | Cut a clip into two at the point you click |
| Ripple Edit | B | Trim a clip and move everything after it to close or open the gap |
| Rolling Edit | N | Move a cut point between two clips, shortening one and lengthening the other |
| Slip | Y | Change which part of a clip plays, without changing its position or length |
| Slide | U | Move a clip between its neighbours, adjusting them to compensate |
| Rate Stretch | R | Change a clip's speed by dragging its length |
| Type | T | Add text directly in the Program Monitor |

### Ripple Edit: trim without gaps

Using the Selection tool to trim the end of a clip leaves a gap in the timeline, which you then have to close. The Ripple Edit tool trims and pulls everything after the edit along, so there is never a gap. It is the tool you will use most when tightening a talking-head video.

Related actions: select a gap or clip and press Shift+Delete (on some keyboards, Shift+Forward Delete) to perform a ripple delete, removing it and closing the gap.

### Rolling Edit: adjust a cut point

Sometimes the timing between two clips is almost right, but the cut should happen a few frames later. The Rolling Edit tool moves the cut point itself. The first clip becomes longer and the second shorter by the same amount, so the overall sequence length stays the same.

### Slip: choose a better moment

You have a two-second b-roll shot in the right place, but the part playing is not the best moment. The Slip tool shifts the content inside the clip earlier or later while keeping its position and length. The Program Monitor shows the new first and last frames as you drag.

### Razor versus Add Edit

The Razor tool (C) cuts where you click. Faster in practice is the Add Edit command: position the playhead and press Ctrl+K (Cmd+K) to cut all targeted tracks at the playhead. Combined with moving the playhead by keyboard, this lets you cut without touching the mouse.

### Rate Stretch

Rate Stretch changes speed by dragging a clip's edge. Drag it shorter to speed it up, longer to slow it down. For precise values, right-click the clip and choose Speed/Duration, where you can type an exact percentage or enable Optical Flow interpolation for smoother slow motion.

### A trimming workflow for a talking head

\`\`\`text
1. Lay the full interview on V1.
2. Play through; press Ctrl+K at the start and end of each unwanted section.
3. Select each unwanted piece; press Shift+Delete to ripple delete.
4. Use the Rolling Edit tool to fine-tune cuts between sentences.
5. Place b-roll on V2 to cover jump cuts, using Slip to pick the best moment.
\`\`\`

### Switch back to Selection

The most common beginner frustration is forgetting which tool is active. After using a special tool, press V to return to Selection. With practice, your hand will do this automatically.

### Premiere's text-based editing

Recent versions of Premiere can transcribe a clip and let you edit by text: highlight words in the transcript and delete them, and the corresponding video is removed from the sequence. For interviews and podcasts, this makes the first rough cut much faster. Precise trimming tools are still needed afterwards to make the cuts feel natural.
      `,
        [
          q('Which tool trims a clip and closes the gap automatically?', [
            'Rolling Edit',
            'Slip',
            'Ripple Edit',
            'Rate Stretch',
          ], 2, 'Ripple Edit shortens or lengthens a clip and shifts later clips so no gap remains.'),
          q('What does the Slip tool change?', [
            'Which part of the clip plays, keeping its position and length',
            'The clip\'s speed',
            'The clip\'s position between its neighbours',
            'The track the clip is on',
          ], 0, 'Slipping shifts the source content inside a clip without moving it or changing its duration.'),
          q('What does Ctrl+K (Cmd+K) do in Premiere Pro?', [
            'Opens the keyboard shortcut editor',
            'Exports the sequence',
            'Deletes the selected clip',
            'Adds an edit at the playhead on targeted tracks',
          ], 3, 'Add Edit cuts targeted tracks at the playhead, enabling fast keyboard-driven cutting.'),
        ]
      ),
      lesson('Keyboard Shortcuts and a Fast Editing Workflow', 13, `
Watch an experienced editor and you will notice their mouse hand barely moves. They play, mark, cut and trim with the keyboard, because every trip to a menu costs a few seconds, and over a day those seconds become hours. Learning a core set of shortcuts is the fastest way to become a faster editor.

### Playback with J, K and L

The JKL keys control playback, and they are standard across most editors:

| Key | Action |
|---|---|
| L | Play forward; press again to play faster |
| J | Play backward; press again to play faster backward |
| K | Pause |
| K + L or K + J | Step forward or back slowly, frame by frame while held |
| Space | Play or pause |

Rest your right hand on J, K and L, and use them instead of clicking the play button.

### Marking and placing clips

In the Source Monitor, mark the part of a clip you want:

- **I** sets an In point, where the selection starts.
- **O** sets an Out point, where it ends.
- **Comma (,)** inserts the marked section into the timeline at the playhead, pushing later clips along.
- **Period (.)** overwrites the timeline at the playhead, replacing what was there.

This source-to-timeline workflow is how professionals assemble a rough cut quickly: watch, mark, insert, repeat.

### Navigation and trimming shortcuts

\`\`\`text
Up / Down arrow     Jump to previous / next edit point
Left / Right arrow  Move one frame
Shift + arrows      Move five frames
Q                   Ripple trim the start of the clip to the playhead
W                   Ripple trim the end of the clip to the playhead
Ctrl/Cmd + K        Add edit at the playhead
Shift + Delete      Ripple delete
+ / -               Zoom the timeline in and out
\\ (backslash)       Zoom to fit the whole sequence
F                   Match frame: open the source clip at the same frame
\`\`\`

Q and W are especially powerful. Put the playhead where a sentence starts and press Q: everything before it in that clip is removed and the gap closes. Put it where the sentence ends and press W. Many editors cut an entire talking-head video using only arrow keys, Q, W and J K L.

### Customise your shortcuts

Open the keyboard shortcuts editor (Ctrl+Alt+K on Windows, Cmd+Option+K on Mac). You can search for any command and assign a key. Useful additions include shortcuts for Nest, Speed/Duration and frequently used effects. Some editors map shortcuts to match another editor they know, to reduce switching time.

### A fast assembly workflow

\`\`\`text
1. Watch all footage once, marking good moments with markers (M).
2. For each moment, open it in the Source Monitor, set I and O.
3. Press comma to insert it into the timeline in story order.
4. Watch the rough cut through without stopping.
5. Tighten with Q, W and ripple deletes.
6. Only then add b-roll, music, captions and colour.
\`\`\`

### Practise deliberately

Pick five shortcuts a week and force yourself to use them instead of the mouse. Put a sticky note on your monitor if it helps. Within a month, the core set becomes automatic, and editing speed can increase noticeably, which matters directly to your earnings when you are paid per video.

### Mouse and keyboard together

Shortcuts do not replace the mouse entirely. Dragging clips, adjusting keyframes and fine-tuning graphics are often easier with the mouse. The goal is to use each for what it does best: keyboard for playback, marking and cutting, mouse for positioning and fine adjustments.
      `,
        [
          q('What do the J, K and L keys control?', [
            'Zoom, crop and scale',
            'Cut, copy and paste',
            'Playback: backward, pause and forward',
            'Colour, audio and text panels',
          ], 2, 'JKL is a standard playback control set, letting editors shuttle through footage without the mouse.'),
          q('In the Source Monitor, what does pressing comma do after marking I and O?', [
            'Deletes the marked section',
            'Inserts the marked section at the playhead, pushing later clips along',
            'Exports the marked section as a file',
            'Adds a marker at the playhead',
          ], 1, 'Insert adds the selection to the timeline without replacing anything, moving later clips forward.'),
          q('What does pressing W do with the playhead in the middle of a clip?', [
            'Adds a new video track',
            'Plays the clip at double speed',
            'Opens the Effect Controls panel',
            'Ripple trims the rest of the clip after the playhead',
          ], 3, 'W removes the part of the clip after the playhead and closes the gap, a fast way to trim endings.'),
        ]
      ),
      lesson('Nesting, Adjustment Layers and Multicam', 13, `
As projects grow, timelines become crowded: dozens of clips, several layers of b-roll, graphics and effects. Three features keep complex edits manageable and consistent: nesting, adjustment layers and multi-camera editing.

### Nesting: grouping clips into one

Nesting takes a group of clips and wraps them into a new sequence, which appears as a single clip in the original timeline. Select the clips, right-click and choose Nest.

Common uses:

| Situation | Why nest |
|---|---|
| A multi-layer title animation | Move or trim it as one clip |
| A picture-in-picture layout | Scale or position the whole group at once |
| Applying one effect to several clips | Apply it once to the nested clip |
| Reusing a section in several places | Edit it once, updates everywhere it appears |

Double-click a nested clip to open and edit its contents. Changes inside the nest appear wherever that nested sequence is used.

Nesting also has costs: it adds a layer of complexity, and too many levels of nesting can slow playback and confuse collaborators. Name nested sequences clearly, such as \`NEST_Intro_Title\`.

### Adjustment layers: one effect over many clips

An adjustment layer is a transparent clip that applies its effects to everything below it on the timeline. Create one from the Project panel's New Item menu, then drag it onto a track above your clips.

For example, apply a colour look to an adjustment layer on V3 across the entire timeline. Every clip below receives the look. To change the look, adjust one layer instead of forty clips. You can also use adjustment layers for:

- A consistent sharpening or film grain across the video.
- A zoom or shake effect on a section of several clips.
- Temporarily applying a look to test it, then disabling the layer.

Keep clip-specific corrections, such as fixing one shot's white balance, on the clip itself, and put shared looks on adjustment layers above. Chapter 8 returns to this structure for colour.

### Multicam: editing several cameras at once

Podcasts, interviews and events are often filmed with two or three cameras at the same time. Multi-camera editing lets you switch between them live, like a TV director.

\`\`\`text
1. Select the camera clips and the main audio in the Project panel.
2. Right-click, Create Multi-Camera Source Sequence.
3. Choose Audio as the sync method, so clips align by their sound.
4. Place the multicam sequence in a timeline.
5. Turn on the multi-camera view in the Program Monitor.
6. Play, and press 1, 2 or 3 (or click) to switch cameras as people speak.
\`\`\`

Premiere records a cut each time you switch. Afterwards, you can refine any switch point with the Rolling Edit tool or change which camera is used for a section.

### Syncing tips

Audio-based syncing works well when each camera recorded reference sound. A clap at the start of recording, as recommended in chapter 2, gives a sharp spike that makes syncing reliable. If syncing fails, check that each camera recorded audio and that clips overlap in time.

### Keeping complex projects tidy

As timelines grow:

- Use track names, such as V1 Main, V2 B-roll, V3 Graphics, V4 Adjustments.
- Colour-label clip types, such as green for interview, blue for b-roll.
- Lock tracks you are not working on to avoid accidental changes.
- Use markers with notes for client feedback points.

A tidy timeline is not only easier for you; it is essential when another editor has to take over your project or when a client asks for changes months later.
      `,
        [
          q('What does nesting do in Premiere Pro?', [
            'Wraps selected clips into a sequence that appears as one clip',
            'Deletes unused clips from the project',
            'Syncs clips by audio',
            'Converts clips to an editing codec',
          ], 0, 'Nesting groups clips into their own sequence, which can be moved, trimmed and affected as a single clip.'),
          q('What is the main benefit of an adjustment layer?', [
            'It makes clips play faster',
            'It records a voiceover',
            'One effect applies to every clip below it',
            'It removes the need for colour correction',
          ], 2, 'Adjustment layers apply effects to all clips beneath them, so a look can be changed in one place.'),
          q('Why clap at the start of a multi-camera recording?', [
            'It improves the video\'s colour balance',
            'It signals the audience to be quiet',
            'Premiere requires it to open the files',
            'It creates a sharp sound spike that makes audio syncing reliable',
          ], 3, 'A clap gives a clear, identical audio peak in every recording, helping software align the clips.'),
        ]
      ),
      ],
      [
      q('Your edits keep affecting the wrong track. What should you check first?', [
        'The export settings',
        'The workspace layout',
        'Track targeting and source patching',
        'The clip\'s colour label',
      ], 2, 'Targeting decides which tracks receive inserts and cuts, so wrong targeting affects the wrong tracks.'),
      q('You want to move the cut between two clips a few frames later without changing total length. Which tool?', [
        'Ripple Edit',
        'Rolling Edit',
        'Razor',
        'Rate Stretch',
      ], 1, 'Rolling Edit moves the cut point, lengthening one clip and shortening the other by the same amount.'),
      q('Which shortcut combination allows cutting a talking head almost entirely from the keyboard?', [
        'Ctrl+S and Ctrl+Z',
        'T and P',
        'F and M',
        'Arrow keys with Q, W and JKL',
      ], 3, 'Navigating edits with arrows, trimming with Q and W and playing with JKL covers most talking-head cutting.'),
      q('How can a podcast filmed on three cameras be edited efficiently?', [
        'Create a multi-camera source sequence and switch angles during playback',
        'Edit each camera separately and export three videos',
        'Use only one camera and delete the others',
        'Nest every clip individually',
      ], 0, 'Multicam editing syncs the cameras and lets you cut between them live, like a director.'),
      ]
    ),
    chapter(
      'DaVinci Resolve Essentials',
      'Navigate DaVinci Resolve\'s pages and understand the free and Studio versions, edit quickly on the Cut and Edit pages, get to know Fusion and Fairlight, and keep playback smooth with proxy and optimised media.',
      [
      lesson('The Resolve Pages and Free Versus Studio', 13, `
DaVinci Resolve is organised differently from most editors. Instead of one screen with many panels, it divides the workflow into pages, each designed for one stage of post-production. Once you understand the pages, Resolve becomes very logical.

### The pages

Along the bottom of the window is a row of page buttons:

| Page | Purpose |
|---|---|
| Media | Import, organise and inspect footage and audio |
| Cut | Fast editing, designed for quick turnaround and short-form |
| Edit | Traditional, detailed timeline editing |
| Fusion | Node-based visual effects and motion graphics |
| Color | Professional colour correction and grading |
| Fairlight | Audio editing, mixing and sound repair |
| Deliver | Export and render settings |

All pages work on the same project and timeline. You can edit on the Edit page, jump to Color to grade a shot, then to Fairlight to fix its audio, and back again, without exporting anything between applications.

### Projects and the database

Resolve stores projects in a database managed by the Project Manager, rather than as separate files in your folders. This surprises editors coming from Premiere. To back up or move a project, right-click it in the Project Manager and export it as a \`.drp\` file, and store that file in your project folder alongside the media. For bigger moves, Resolve can also export a project archive containing the media.

### Setting up a project

Before importing media, open Project Settings (the gear icon, usually at the bottom right) and set:

\`\`\`text
Timeline resolution   1920 x 1080 (or 1080 x 1920 for vertical)
Timeline frame rate   match your footage, e.g. 25 or 30
Playback frame rate   same as the timeline
\`\`\`

The timeline frame rate cannot be changed once media is added to a timeline, so set it first. For a vertical version later, you can create a new timeline with its own settings by turning off "Use project settings" when creating it.

### Free versus Studio

The free version of DaVinci Resolve is remarkably complete, and many professionals deliver paid work with it. The Studio version is a one-time purchase and adds features, including:

- Many AI-powered tools, such as some automatic masking, voice isolation and automatic subtitle generation, depending on the version.
- Advanced noise reduction for grainy footage.
- Higher resolutions and frame rates beyond the free version's limits, plus some HDR tools.
- Additional hardware acceleration and collaboration features.

The exact list changes with each release, so check Blackmagic Design's website for the current comparison. A practical approach: learn on the free version, and consider Studio when a specific feature becomes worth it for paid work.

### Hardware expectations

Resolve relies heavily on the graphics card (GPU). On older laptops with weak integrated graphics, playback may stutter and some effects may be slow. The proxy workflow in the final topic of this chapter helps a lot. Keep your graphics drivers updated, and check Blackmagic's system requirements before choosing hardware.

### Keyboard layouts

Resolve lets you choose keyboard mappings that imitate other editors, including Premiere Pro, under the keyboard customisation settings. If you already know Premiere's shortcuts, this can make switching easier, though learning Resolve's own defaults helps when following tutorials.
      `,
        [
          q('Which Resolve page is designed for professional colour correction and grading?', [
            'Fairlight',
            'Fusion',
            'Color',
            'Media',
          ], 2, 'The Color page provides Resolve\'s professional colour tools, the area it was originally famous for.'),
          q('How are DaVinci Resolve projects stored?', [
            'In a database managed by the Project Manager',
            'As separate .prproj files in each folder',
            'Only in the cloud',
            'Inside each video clip',
          ], 0, 'Resolve keeps projects in a database, so backups are made by exporting .drp files or archives.'),
          q('Why set the timeline frame rate before adding media?', [
            'It improves the colour of the footage',
            'It unlocks the Studio features',
            'Media cannot be imported until the export settings are chosen',
            'It cannot be changed once media is on a timeline',
          ], 3, 'Resolve locks the timeline frame rate after media is added, so it must be correct from the start.'),
        ]
      ),
      lesson('Editing on the Cut and Edit Pages', 13, `
Resolve offers two editing pages. The Cut page is built for speed, ideal for short-form content and fast turnarounds. The Edit page is a traditional, detailed editing environment. Both edit the same timeline, so you can start on one and finish on the other.

### The Cut page: built for speed

The Cut page has a simplified interface and some unique ideas:

- **Source tape**: view all clips in a bin as one long tape, and scroll through everything quickly to find moments.
- **Dual timeline**: the upper timeline shows the whole edit, the lower shows a zoomed-in view around the playhead, so you never have to zoom in and out manually.
- **Smart edit buttons**: Append, Smart Insert, Close Up, Place on Top and Ripple Overwrite place clips intelligently with one click.

Smart Insert, for example, places the clip at the nearest edit point to the playhead, so you do not need precise positioning. Close Up adds a punched-in version of the current shot on top, a quick way to vary talking-head framing.

For vertical content, create a timeline with a 1080 by 1920 resolution. Many short-form editors work almost entirely on the Cut page.

### The Edit page: precision and control

The Edit page looks like a traditional editor: a media pool, source and timeline viewers, and a multi-track timeline. It offers precise tools:

| Mode or action | Default shortcut | Purpose |
|---|---|---|
| Selection mode | A | Select and move clips |
| Trim edit mode | T | Ripple, roll, slip and slide depending on where you click |
| Blade edit mode | B | Click to cut clips |
| Split at playhead | Ctrl+B or Cmd+B | Cut clips at the playhead |
| Mark In and Out | I and O | Set a range in the source or timeline |
| Playback | J, K, L | Shuttle backward, pause, forward |

Trim edit mode is context-sensitive: clicking the edge of a clip performs a ripple trim, clicking the middle of the cut performs a roll, and clicking the middle of a clip slips it. The idea is the same as Premiere's separate tools from chapter 4, combined into one mode.

### Building a rough cut on the Edit page

\`\`\`text
1. Double-click a clip in the media pool to open it in the source viewer.
2. Mark In (I) and Out (O).
3. Drag to the timeline, or use Insert (F9) or Overwrite (F10)
   (on some keyboards these need the Fn key).
4. Repeat in story order.
5. Tighten with Trim edit mode and ripple deletes.
\`\`\`

### Useful Edit page features

- **Markers**: press M to add a marker; double-click it to add notes, useful for client feedback.
- **Flags and colours**: tag clips by type, such as interview or b-roll.
- **Compound clips**: similar to nesting in Premiere, combine clips into one.
- **Adjustment clips**: apply effects to every clip below, like adjustment layers.
- **Retime controls**: change speed with Ctrl+R (Cmd+R), including speed ramps.

### Text and titles

The Effects library includes titles. Text+ titles are built on Fusion and are more flexible, with animation options. For captions, Resolve supports subtitle tracks; automatic subtitle generation from speech has been available in the Studio version.

### Choosing between pages

Use the Cut page when speed matters and the edit is straightforward, such as social clips. Use the Edit page for longer projects, detailed trimming, many tracks and complex audio. Because both show the same timeline, switching costs nothing.
      `,
        [
          q('What does the Cut page\'s dual timeline show?', [
            'Two separate projects side by side',
            'Audio on one timeline and video on the other',
            'The whole edit above and a zoomed view around the playhead below',
            'The source clip and the export preview',
          ], 2, 'The upper timeline gives an overview while the lower one shows detail, removing the need to zoom manually.'),
          q('In Resolve\'s Trim edit mode, what happens when you click the middle of a clip?', [
            'It deletes the clip',
            'It slips the clip\'s content',
            'It rolls the cut point',
            'It adds a marker',
          ], 1, 'Trim mode is context-sensitive, and clicking a clip\'s middle performs a slip.'),
          q('What is Resolve\'s equivalent of nesting in Premiere Pro?', [
            'Source tape',
            'Smart Insert',
            'Trim edit mode',
            'Compound clips',
          ], 3, 'Compound clips combine several clips into one, much like nested sequences.'),
        ]
      ),
      lesson('Fusion and Fairlight at a Glance', 13, `
Two of Resolve's pages go far beyond most editors: Fusion for visual effects and motion graphics, and Fairlight for professional audio. You do not need to master either to edit well, but knowing what they can do lets you handle requests that would otherwise require separate software.

### Fusion: node-based effects

Fusion uses nodes rather than layers. Each node performs one operation, such as a text element, a blur, a mask or a colour change, and nodes connect in a chain that shows how the image is built:

\`\`\`text
MediaIn1 --> Blur --> Merge --> MediaOut1
                        ^
Text+ ------------------|
\`\`\`

In this example, the clip is blurred, then text is merged on top, and the result goes out to the timeline. Layers in other software hide their order in a stack; nodes show the flow clearly, which becomes an advantage in complex effects.

What editors commonly use Fusion for:

| Task | Example |
|---|---|
| Animated titles | Text that slides, scales and fades in with motion blur |
| Screen replacement | Placing a website recording inside a phone screen |
| Tracking | Attaching text or a blur to a moving object |
| Clean-up | Removing a small distraction with a patch |
| Templates | Reusable lower thirds and graphics |

To open a clip in Fusion, place the playhead on it and click the Fusion page. Start with simple tasks, such as animating a Text+ title, before tackling complex composites. Many free and paid Fusion templates exist, and using them is a good way to learn how node trees are built.

### Fairlight: audio in the same application

Fairlight is a complete digital audio workstation inside Resolve. It offers:

- A mixer with EQ and dynamics (compression, limiting) on every track.
- Noise reduction and, in some versions, voice isolation to separate speech from background noise.
- Precise audio editing, down to individual samples.
- Loudness meters for delivering to platform standards.
- Tools for recording voiceovers directly into the timeline.

A typical dialogue clean-up chain in Fairlight, which chapter 7 explains in detail:

\`\`\`text
Noise reduction  -> EQ (remove rumble, add clarity) -> Compressor -> Limiter
\`\`\`

Even without deep audio knowledge, applying a noise reduction effect and checking loudness meters on Fairlight improves most videos noticeably.

### The Edit page has quick audio tools too

You do not always need to visit Fairlight. On the Edit page, the Inspector lets you adjust volume and pan, and you can apply audio effects from the Effects library. For quick jobs, that is enough. Go to Fairlight when you need the mixer, detailed repair or accurate loudness measurement.

### Why this matters for short-form editors

Clients increasingly want polish: animated captions, a logo reveal, a clean voice without background traffic noise. Being able to deliver these without buying or learning another application is a real advantage. Many successful freelance editors use Resolve precisely because editing, colour, effects and audio are all in one place.

### Learn gradually

Fusion and Fairlight are deep enough to be careers on their own. Learn them task by task: when a project needs an animated title, learn that in Fusion; when a client's audio is noisy, learn noise reduction in Fairlight. Over a year of projects, the skills accumulate naturally.
      `,
        [
          q('What makes Fusion different from layer-based effects tools?', [
            'It only works with audio',
            'It cannot animate text',
            'It uses connected nodes that show how the image is built',
            'It requires a separate installation',
          ], 2, 'Fusion\'s nodes each perform an operation, and their connections make the flow of an effect explicit.'),
          q('Which Resolve page would you use to measure loudness and mix dialogue?', [
            'Fairlight',
            'Fusion',
            'Media',
            'Cut',
          ], 0, 'Fairlight provides the mixer, audio effects and loudness meters for professional sound work.'),
          q('What is a sensible way to learn Fusion and Fairlight?', [
            'Master both completely before editing anything',
            'Avoid them entirely',
            'Learn only from reading the manual',
            'Learn them task by task as projects require',
          ], 3, 'Learning features as real projects need them builds practical skill steadily without overwhelming you.'),
        ]
      ),
      lesson('Proxy Media and Smooth Playback', 13, `
Nothing kills editing momentum like a stuttering timeline. You press play and the video freezes, or the audio plays while the picture lags. This usually happens with 4K footage, H.265 phone clips or heavy effects on a modest computer. Proxies and related tools fix it, in Resolve and in other editors.

### What proxies are

A proxy is a lightweight copy of a clip, lower in resolution and in an easy-to-edit codec. You edit with the proxies, which play smoothly, and when you export, the software automatically uses the original full-quality files.

\`\`\`text
Original: 4K H.265 phone clip   heavy to decode, stutters
Proxy:    1080p or smaller in an editing codec   plays smoothly
Export:   uses the original 4K file   full quality
\`\`\`

### Creating proxies in Resolve

In the Media Pool, select clips, right-click and choose Generate Proxy Media. Resolve creates proxies in the background. Proxy format and resolution are set in Project Settings, under Master Settings, Optimized Media and Render Cache.

Then make sure Resolve uses them: in the Playback menu, set Proxy Handling to prefer proxies. You can switch back to originals to check fine detail, such as focus, at any time.

Resolve can also link proxies created by some cameras or created elsewhere, if they match the originals.

### Optimised media

Resolve also offers optimised media, created in a similar way with Generate Optimized Media. It serves the same purpose, a smoother editing format, but is stored and managed by Resolve internally. Many editors today prefer proxies because they are portable: they can be copied to another computer with the project so another editor can work smoothly too.

### Render cache

Effects, colour grades and Fusion compositions can slow playback even with light footage. Resolve's render cache pre-renders these in the background. Set Playback, Render Cache to Smart, and Resolve caches demanding sections automatically; a red line over the timeline turns blue when the section is cached.

### Timeline proxy resolution

For a quick improvement without generating files, Resolve can lower the playback resolution of the viewer: Playback, Timeline Proxy Resolution, then Half or Quarter. This reduces image quality in the viewer only, not in the export.

### Proxies in Premiere Pro and CapCut

The idea is universal. Premiere Pro can create proxies during ingest or by right-clicking clips, with a toggle button in the Program Monitor to switch between proxy and original. CapCut desktop also offers proxy options in some versions for smoother editing of large files. The workflow is the same: create light copies, edit with them, export from originals.

### Choosing what to do

| Problem | First thing to try |
|---|---|
| 4K or H.265 footage stutters | Generate proxies |
| Playback slows only where effects or grades are applied | Render cache set to Smart |
| Everything slightly slow on a weak laptop | Timeline proxy resolution at Half |
| Audio drifts from phone footage | Convert variable frame rate clips first, as in chapter 1 |

### Storage considerations

Proxies take space, though much less than originals. Store them on a fast drive, ideally an SSD, and keep them inside your project folder structure so they travel with the project. When the project is archived, proxies can be deleted and regenerated if ever needed.
      `,
        [
          q('What is a proxy?', [
            'A final export for social media',
            'A backup of the project database',
            'A lightweight copy of a clip used for smooth editing',
            'A type of transition effect',
          ], 2, 'Proxies are smaller, easy-to-decode copies used during editing, while exports use the original files.'),
          q('What does the render cache do in Resolve?', [
            'Deletes unused clips',
            'Pre-renders demanding effects and grades for smooth playback',
            'Exports the timeline automatically',
            'Syncs audio from multiple cameras',
          ], 1, 'The render cache processes heavy sections in the background, turning red timeline indicators blue when ready.'),
          q('Why do many editors prefer proxies over optimised media?', [
            'Proxies are portable and can move with the project to another computer',
            'Proxies have higher quality than originals',
            'Optimised media cannot be created in Resolve',
            'Proxies are required for exporting',
          ], 0, 'Proxies are ordinary files that can travel with the project, letting other editors work smoothly too.'),
        ]
      ),
      ],
      [
      q('Which page would you use to export a finished video in Resolve?', [
        'Media',
        'Color',
        'Fusion',
        'Deliver',
      ], 3, 'The Deliver page contains render settings and the render queue for exporting.'),
      q('How do you back up a Resolve project to your project folder?', [
        'Copy the render cache folder',
        'Export the project as a .drp file from the Project Manager',
        'Save a screenshot of the timeline',
        'Export the timeline as an MP4',
      ], 1, 'Because projects live in a database, exporting a .drp file creates a portable backup of the project.'),
      q('Which Cut page feature places a punched-in version of the current shot on top?', [
        'Source tape',
        'Append',
        'Close Up',
        'Ripple Overwrite',
      ], 2, 'Close Up adds a zoomed version of the current shot, a quick way to vary talking-head framing.'),
      q('4K H.265 phone footage stutters in the timeline. What should you try first?', [
        'Lowering the export resolution',
        'Deleting the audio tracks',
        'Adding an adjustment clip',
        'Generating proxy media',
      ], 3, 'Proxies replace heavy footage with light copies during editing, restoring smooth playback.'),
      ]
    ),
    chapter(
      'The Art of the Cut',
      'Control pacing and rhythm, use jump cuts, J-cuts and L-cuts with purpose, cover edits and add meaning with b-roll and cutaways, and choose transitions that serve the story rather than decorate it.',
      [
      lesson('Pacing and Rhythm', 13, `
Two edits of the same footage can contain identical shots in the same order, yet one feels exciting and the other drags. The difference is pacing: how long each shot stays on screen and how the rhythm changes through the video. Pacing is one of the most important skills in editing, and one of the hardest to teach, because it is felt as much as calculated.

### Shot length shapes energy

| Shot lengths | Feeling | Typical use |
|---|---|---|
| Very short (under 1 second) | Urgent, energetic, exciting | Trailers, action, montage to a beat |
| Short (1 to 3 seconds) | Lively, modern | Most short-form and product content |
| Medium (3 to 6 seconds) | Comfortable, conversational | Explanations, tutorials |
| Long (6 seconds and more) | Calm, emotional, reflective | Emotional moments, beautiful scenery, testimonials |

Short-form platforms reward a lively pace, but not constant speed. A video that is fast all the way through becomes tiring and flat, just as one that is slow all the way through becomes boring.

### Vary the rhythm

Good pacing changes. Build energy, then give a moment to breathe, then build again:

\`\`\`text
0-3s    Fast hook: three quick shots, bold caption
3-10s   Slightly slower: presenter explains the problem
10-20s  Faster montage: product in use, cut to the music
20-24s  Hold: the result, a satisfied reaction, 2 to 3 seconds
24-28s  Call to action, clear and steady
\`\`\`

The pause at 20 seconds lets the payoff land. Without it, the key moment rushes past before the viewer registers it.

### Cut on action

Cutting while something is moving hides the edit. If a person reaches for a cup in a wide shot, cut to the close-up while the hand is still moving. The viewer's eye follows the motion across the cut, and the transition feels seamless. Cutting on stillness, by contrast, often makes the edit noticeable.

### Cut to the beat, sometimes

When music drives the video, cutting on beats creates a satisfying rhythm. Mark the beats by tapping the marker key while the music plays, then snap cuts to the markers. But avoid cutting on every single beat for the whole video; it becomes mechanical. Mix cuts on strong beats with cuts on the off-beat or on phrases, and let some shots run across several beats.

### Remove the dead air

In talking-head and tutorial content, the biggest pacing improvement is usually removing pauses, filler words and repetition. A 90-second recording often becomes a stronger 50-second video. Keep natural breathing room, though: cutting every single breath makes the speaker sound robotic and exhausting.

### Emotional moments need time

The more emotional a moment, the longer it usually deserves. A customer's genuine smile after tasting, a parent watching their child graduate, a before-and-after reveal: let these breathe. Rushing them removes their impact.

### Pacing for the platform

Audiences on TikTok and Reels expect a faster pace than those watching a 20-minute YouTube tutorial. A long-form viewer has chosen to watch and wants clear, steady explanation. A short-form viewer can swipe away in a second. Adapt the same content: faster and tighter for short-form, more room to explain for long-form.

### Train your instinct

Watch videos you admire with the sound off and count seconds per shot. Notice where the rhythm speeds up and where it slows. Then watch your own edit at normal speed without stopping. If you feel your attention drift, that is exactly where the pacing needs work.
      `,
        [
          q('Why should pacing vary instead of staying fast throughout?', [
            'Platforms penalise fast videos',
            'Constant speed becomes tiring and flat; changes keep attention',
            'Short shots cannot contain captions',
            'Slow shots load faster on phones',
          ], 1, 'Changing rhythm creates contrast, letting key moments land and keeping viewers engaged.'),
          q('What does cutting on action achieve?', [
            'It makes the video shorter',
            'It removes the need for b-roll',
            'It increases the frame rate',
            'The movement carries the eye across the cut, hiding the edit',
          ], 3, 'When a cut happens during movement, viewers follow the action and barely notice the edit.'),
          q('How should emotional moments usually be paced?', [
            'Cut as quickly as possible',
            'Replaced with text on screen',
            'Given more time on screen so they can land',
            'Covered with fast transitions',
          ], 2, 'Emotional beats need time for the audience to feel them; rushing removes their impact.'),
        ]
      ),
      lesson('Jump Cuts, J-Cuts and L-Cuts', 13, `
Some of the most useful editing techniques are named after their shape on the timeline. Jump cuts define the look of modern online video, while J-cuts and L-cuts make conversations and scene changes flow naturally. Once you know them, you will notice them in almost everything you watch.

### Jump cuts

A jump cut is a cut between two shots of the same subject from the same angle, with part of the time removed. The subject appears to jump slightly. In traditional filmmaking this was considered a mistake. In online video it has become a style: YouTubers and short-form creators use jump cuts to remove pauses and keep energy high.

Jump cuts work well when:

- The video is casual and personal, such as vlogs and talking heads.
- The goal is speed, removing every pause and stumble.

They feel harsh when there are too many in quick succession, or when the subject's position changes dramatically between cuts.

### Softening jump cuts

A common technique is the punch-in: alternate between the original framing and a slightly zoomed version (around 110 to 130%) at each cut. The change in framing makes the cut feel intentional:

\`\`\`text
Cut 1: medium shot (100%)
Cut 2: punch-in (120%), centred on the face
Cut 3: back to medium (100%)
Cut 4: punch-in (120%)
\`\`\`

This is why filming in 4K for a 1080p edit is useful: the zoom does not lose sharpness. Covering some jump cuts with b-roll, as the next lesson shows, is another way to hide them.

### Split edits: J-cuts and L-cuts

In a standard cut, the video and audio change at the same moment. In a split edit, they change at different times. The shape the audio and video make on the timeline gives these edits their names.

| Edit | What happens | Timeline shape |
|---|---|---|
| J-cut | The next shot's audio starts before its picture | Audio extends left under the previous clip, like a J |
| L-cut | The current shot's audio continues after the picture changes | Audio extends right under the next clip, like an L |

### Why split edits feel natural

In real life, we often hear something before we look at it: a voice, a sound, a door. And when someone speaks in a conversation, we often look at the listener's reaction while the speaker continues. Split edits copy this natural experience.

Examples:

- **J-cut into a scene**: the sound of sizzling food begins over the end of the previous shot, then the picture cuts to the kitchen. The audience is pulled forward into the new scene.
- **L-cut in an interview**: the interviewee keeps talking while the picture cuts to b-roll of what they describe. The speech continues smoothly while the visuals illustrate it.

### Making split edits

In most editors, video and audio of a clip are linked. To create a split edit:

\`\`\`text
1. Temporarily unlink the clip, or hold the modifier key (often Alt or Option)
   while trimming to affect only the audio or only the video.
2. Extend the audio of one clip under its neighbour, or trim the video.
3. Relink afterwards if needed.
\`\`\`

In Premiere, the Rolling Edit tool with Alt pressed adjusts only one side of the cut. In Resolve, disabling linked selection allows the same.

### Use them everywhere

Once you practise, you will find split edits useful in almost every project: interviews, documentaries, vlogs and brand stories. They make edits feel smoother and more professional, often without the viewer consciously noticing why.
      `,
        [
          q('What is a jump cut?', [
            'A cut between two shots of the same subject and angle with time removed',
            'A cut that jumps to a different location',
            'A transition with a spinning effect',
            'A cut where audio starts before video',
          ], 0, 'A jump cut removes time while keeping the same framing, making the subject appear to jump.'),
          q('In a J-cut, what happens?', [
            'The picture changes after the audio ends',
            'The video fades to black',
            'The next shot\'s audio starts before its picture',
            'Two clips play at the same time side by side',
          ], 2, 'A J-cut lets the audience hear the next scene before seeing it, drawing them forward.'),
          q('How does a punch-in soften a jump cut?', [
            'It adds a sound effect',
            'It changes the frame rate',
            'It removes the audio',
            'The framing change makes the cut feel intentional',
          ], 3, 'Alternating between normal and zoomed framing disguises the jump and adds visual variety.'),
        ]
      ),
      lesson('B-Roll and Cutaways', 13, `
A talking head alone quickly becomes visually monotonous, and it forces you to show every jump cut. B-roll and cutaways solve both problems. They add visual information, hide edits and make videos feel richer and more professional.

### What b-roll does

A-roll is the main footage, usually a person speaking. B-roll is the supporting footage shown over or between it. B-roll has several jobs:

| Job | Example |
|---|---|
| Illustrate what is said | "We bake fresh every morning" over shots of dough being shaped |
| Hide edits | Cover a jump cut in the interview with a shot of the shop |
| Add pace | Quick b-roll shots energise a slow section |
| Provide context | A wide shot of the location establishes where we are |
| Show proof | Product close-ups, results, screen recordings |

### Show, do not just tell

The best b-roll matches the words closely. If the speaker says "our delivery arrives in 30 minutes", show a rider leaving and a customer receiving a box, not a random shot of the logo. When pictures and words reinforce each other, the message is stronger and easier to remember.

### Placing b-roll

B-roll usually sits on a track above the A-roll, with the A-roll's audio continuing underneath, which is an L-cut or J-cut in practice:

\`\`\`text
V2:   [bakery dough]   [oven]           [box close-up]
V1:   [presenter speaking continuously.................]
A1:   [presenter audio continuously....................]
\`\`\`

Viewers hear the presenter throughout while seeing the illustrations. Cutting back to the presenter at key moments, such as a strong statement or emotional point, keeps a human connection.

### How long should b-roll shots be?

For short-form content, b-roll shots are often one to three seconds. For slower, cinematic content they may be longer. Avoid holding a static b-roll shot so long that it becomes boring; if you need more coverage, cut between several b-roll shots rather than stretching one.

### Cutaways and reaction shots

A cutaway is a brief shot of something related but not the main action, such as a listener nodding, a hand gesture or a detail in the room. Reaction shots are especially powerful in interviews and reality-style content: the audience watches the listener's face to know how to feel.

### Sources of b-roll

- **Film it yourself**: always the best, since it matches the story exactly. Chapter 2's shot list should include it.
- **Client-provided**: product photos, previous footage, event recordings.
- **Screen recordings**: essential for tech tutorials and app demos.
- **Stock footage**: from licensed libraries, useful for general concepts. Check the licence, and prefer stock that looks consistent with your own footage.

### Photos as b-roll

Still photos can work as b-roll with gentle movement, such as a slow zoom or pan, often called the Ken Burns effect. This keeps the image alive on screen. Keep the movement subtle and consistent in speed.

### Avoid generic filler

Stock shots of people shaking hands, typing on keyboards or pointing at charts add little. Viewers have seen them thousands of times. Specific, real footage from the client's business, even if filmed on a phone, usually beats polished generic stock.
      `,
        [
          q('What is the difference between A-roll and B-roll?', [
            'A-roll is audio, B-roll is video',
            'A-roll is always filmed outdoors',
            'A-roll is the main footage; B-roll is supporting footage over or between it',
            'B-roll is only used in films, not social media',
          ], 2, 'A-roll carries the main content, while B-roll illustrates, hides edits and adds visual interest.'),
          q('What makes b-roll most effective?', [
            'Choosing the most beautiful stock shots',
            'Using the longest possible shots',
            'Showing the logo repeatedly',
            'Matching the pictures closely to what is being said',
          ], 3, 'When visuals reinforce the words, the message becomes clearer and more memorable.'),
          q('What is the Ken Burns effect?', [
            'Slow zooming or panning on a still photo',
            'A type of jump cut',
            'A colour grading look',
            'A sound effect for transitions',
          ], 0, 'Gentle movement on still images keeps them visually alive when used as b-roll.'),
        ]
      ),
      lesson('Transitions That Serve the Story', 12, `
Beginners often believe transitions are what make a video look professional, and fill every edit with spins, zooms and glitches. Professional editors use the plain cut for the vast majority of edits. Transitions are tools with specific meanings, and used carelessly they distract rather than impress.

### The cut is king

A straight cut is invisible when done well. It keeps the viewer focused on the content and maintains pace. In most professional videos, films and TV shows, almost every transition is a simple cut. That is not a lack of creativity; it is respect for the story.

### What common transitions communicate

| Transition | Meaning to viewers | Good use |
|---|---|---|
| Cut | Continuous story, no special meaning | Almost everything |
| Cross dissolve | Time passing, or a soft link between ideas | Montage of a day, emotional scenes |
| Fade to or from black | Beginning, ending or a major break | Start and end of a video, chapter breaks |
| Dip to white | Flashback, dream or a bright, energetic reset | Occasional stylistic use |
| Whip or zoom transition | Energy, travel, sudden change | Travel and lifestyle content, used sparingly |
| Match cut | A visual link between two shots | Creative storytelling |

### Match cuts: creative without effects

A match cut connects two shots through similar shapes, movements or actions. A spinning coffee cup cuts to a spinning washing machine; a hand closing a door cuts to a hand opening a different door in a new location. Match cuts feel clever and satisfying, and they need planning at the filming stage rather than effects in the editor.

### In-camera transitions

Many popular short-form transitions are created while filming: covering the lens with a hand and uncovering it in a new outfit or location, or a quick whip pan at the end of one shot and the start of the next. The editor simply cuts at the right frame. These feel dynamic and natural because the motion is real.

\`\`\`text
Shot A: camera whips quickly to the right at the end
Shot B: camera starts with a quick whip from the left
Edit:   cut in the middle of the blur, so the motion seems continuous
\`\`\`

### Rules of thumb

- Default to cuts; add a transition only when it means something.
- Keep transition styles consistent within a video.
- Keep them short: most dissolves are under a second in short-form.
- Avoid transitions on the most important moments, which deserve clean cuts.
- For brand clients, subtle choices age better than trendy effects.

### Sound makes transitions work

A transition is often more about sound than picture. A whoosh on a whip transition, a riser before a reveal, or music changing at a scene break makes the transition feel intentional. Conversely, a visual transition with abrupt audio still feels jarring. Chapter 7 covers sound effects in more detail.

### Judge by the story

Ask one question about every transition: does it help the viewer understand or feel the story better? If it does, keep it. If it only shows off an effect, replace it with a cut. The result will almost always look more professional.
      `,
        [
          q('Which transition do professional editors use for most edits?', [
            'Spin transitions',
            'Glitch effects',
            'Straight cuts',
            'Zoom transitions',
          ], 2, 'Plain cuts keep focus on the content and pace, so they make up the vast majority of professional edits.'),
          q('What does a cross dissolve usually suggest to viewers?', [
            'A flashback to a dream',
            'An error in the edit',
            'The end of the video',
            'Time passing or a soft link between ideas',
          ], 3, 'Dissolves blend shots gradually, signalling passing time or a gentle connection.'),
          q('What is a match cut?', [
            'A cut linking two shots through similar shapes or movements',
            'A cut that matches the audio volume',
            'A cut between two identical clips',
            'A transition built into CapCut templates',
          ], 0, 'Match cuts connect shots visually, creating a satisfying link that is planned during filming.'),
        ]
      ),
      ],
      [
      q('A payoff moment rushes past before viewers notice it. What should you change?', [
        'Add a spin transition',
        'Hold the moment longer after a faster section',
        'Remove the music',
        'Speed the clip up further',
      ], 1, 'Slowing the rhythm at the payoff gives the moment time to land after the build-up.'),
      q('An interviewee keeps talking while the picture cuts to what they describe. What is this?', [
        'A jump cut',
        'A match cut',
        'A cross dissolve',
        'An L-cut',
      ], 3, 'The speaker\'s audio continues after the picture changes, forming an L shape on the timeline.'),
      q('What is a good way to hide jump cuts in a talking-head video?', [
        'Add a glitch transition to each cut',
        'Lower the audio at each cut',
        'Cover them with relevant b-roll',
        'Slow the footage down',
      ], 2, 'B-roll placed over the cut hides the jump while the speech continues smoothly.'),
      q('Why do in-camera transitions like whip pans feel natural?', [
        'They use the most advanced effects',
        'They are added automatically by platforms',
        'The motion is real, and the editor cuts within it',
        'They remove the need for editing',
      ], 2, 'Real camera movement carries across the cut, making the transition feel dynamic and seamless.'),
      ]
    ),
    chapter(
      'Sound Design and Music',
      'Clean dialogue with noise reduction, EQ and compression, set levels and loudness for online platforms, choose music that fits and stays copyright safe, and use sound effects and ducking to make edits feel polished.',
      [
      lesson('Cleaning Dialogue: Noise, EQ and Compression', 14, `
Audio is half of every video, and dialogue is usually the most important part of it. Even with good recording habits from chapter 2, voices often need cleaning: background hum, fan noise, boomy rooms, or levels that jump between loud and quiet. Three tools solve most problems: noise reduction, EQ and compression.

### Work in the right order

A common dialogue chain applies processing in this order:

\`\`\`text
1. Noise reduction   remove steady background noise
2. EQ                shape the tone: remove rumble, add clarity
3. Compression       even out loud and quiet parts
4. Limiter           catch any peaks so nothing clips
\`\`\`

Changing the order changes the result. Compressing before removing noise, for example, raises the noise along with quiet speech.

### Noise reduction

Steady noises, such as fan hum, air conditioners, fridge buzz and UPS whine, can be reduced well. Most editors include tools:

| Editor | Tool examples |
|---|---|
| CapCut | Reduce noise, Enhance voice options on audio clips |
| Premiere Pro | Essential Sound panel with a Dialogue tag: Reduce noise, and Enhance Speech in recent versions |
| DaVinci Resolve | Noise reduction in Fairlight; voice isolation in some versions |

Use the room tone recorded in chapter 2 where a tool can learn the noise profile. Apply noise reduction gradually: too much makes voices sound watery, metallic or robotic. A little background noise is far less distracting than a damaged voice.

Unpredictable noises, such as horns, dogs or a door slam, are much harder to remove. It is often better to cut around them, cover them with music or re-record the line.

### EQ: shaping the voice

EQ, short for equalisation, raises or lowers particular frequency ranges:

| Frequency range | What it affects | Common adjustment |
|---|---|---|
| Below about 80 to 100 Hz | Rumble, traffic, handling noise | Cut with a high-pass filter |
| About 200 to 400 Hz | Boominess, muddiness in small rooms | Gentle cut if the voice sounds boxy |
| About 2 to 5 kHz | Presence and clarity | Gentle boost if the voice sounds dull |
| About 5 to 8 kHz | Harsh "s" sounds (sibilance) | Reduce with a de-esser if sharp |

A high-pass filter on dialogue is almost always helpful, removing low rumble that voices do not need. Make small adjustments of a few decibels and compare with the effect switched off, to be sure you are improving the sound rather than just changing it.

### Compression: even levels

People speak louder when excited and quieter at the end of sentences. A compressor reduces the difference by turning down loud parts, then makeup gain raises the whole voice. The result is speech that is consistently clear, which matters on phone speakers and in noisy environments.

Typical starting settings for speech: a ratio around 2:1 to 4:1, with a threshold set so the compressor reduces loud words by a few decibels. Over-compression makes the voice sound flat and squashed, and raises background noise.

### Automatic helpers

Premiere's Essential Sound panel, Resolve's dialogue tools and CapCut's voice enhancement apply sensible chains automatically. They are excellent starting points. Listen critically afterwards, preferably on both headphones and a phone speaker, and reduce any setting that makes the voice sound unnatural.

### Listen on real devices

Most viewers watch on phones. A voice that sounds great on studio headphones can sound thin or muddy on a phone speaker. Before delivering, check the mix on a phone, on cheap earphones and on a laptop. If the dialogue is clear on all three, it is ready.
      `,
        [
          q('What is a sensible order for a dialogue processing chain?', [
            'Limiter, compression, EQ, noise reduction',
            'Compression, limiter, noise reduction, EQ',
            'Noise reduction, EQ, compression, limiter',
            'EQ, limiter, noise reduction, compression',
          ], 2, 'Removing noise first prevents later compression from raising it, and the limiter catches final peaks.'),
          q('What does a high-pass filter on dialogue usually remove?', [
            'Low rumble such as traffic and handling noise',
            'Harsh "s" sounds',
            'The presence and clarity of the voice',
            'Music in the background',
          ], 0, 'A high-pass filter cuts low frequencies below the voice, removing rumble without harming speech.'),
          q('What happens when noise reduction is applied too strongly?', [
            'The voice becomes louder and clearer',
            'The file size increases',
            'The video\'s colours change',
            'The voice sounds watery, metallic or robotic',
          ], 3, 'Excessive noise reduction damages the voice itself, which is more distracting than mild background noise.'),
        ]
      ),
      lesson('Levels and Loudness for Online Platforms', 13, `
Viewers constantly adjust their volume. If your video is much quieter than the one before it, they may not hear the start; if it is much louder, they scroll away in irritation. Getting levels and loudness right makes your videos sound professional and consistent across every platform.

### Peak levels and meters

Audio meters in editors measure level in decibels relative to full scale (dBFS). 0 dBFS is the maximum; anything above clips and distorts. Levels are negative numbers below that.

Practical guides for a typical online video mix:

\`\`\`text
Dialogue peaks            around -10 to -6 dBFS
Music under dialogue      clearly lower than the voice
Sound effects             balanced so they support, not startle
Nothing                   above about -1 dBFS true peak
\`\`\`

These are starting points, not laws. The real test is whether speech is always clear and nothing jumps out unpleasantly.

### Loudness: what people actually hear

Peak level only measures the loudest instant. Loudness measures how loud the whole mix feels over time, in LUFS (loudness units relative to full scale). Two videos with identical peaks can feel very different in loudness.

Streaming platforms normalise loudness: they turn loud videos down and sometimes quiet ones up, so viewers get consistent volume. YouTube, for example, is widely reported to normalise around -14 LUFS. Common targets:

| Content | Common integrated loudness target |
|---|---|
| YouTube and most social video | Around -14 LUFS |
| Podcasts | Around -16 LUFS |
| Broadcast TV | Stricter standards, often around -23 or -24 LUFS depending on region |

Platforms do not all publish exact figures, and they change over time, so treat these as practical targets rather than rules.

### Why not just make it as loud as possible?

If you push a mix much louder than the platform target, it will be turned down, and heavy limiting will have squashed its dynamics for nothing. If your mix is far quieter than the target, it may sound weak next to other videos. Mixing close to around -14 LUFS for social platforms gives consistent, natural results.

### Measuring loudness

Most professional editors include loudness meters:

- **Premiere Pro**: the Loudness Radar effect, or loudness normalisation options in export settings.
- **DaVinci Resolve**: the loudness meter in Fairlight, and loudness normalisation options when rendering in newer versions.
- **CapCut**: fewer measurement tools; rely on consistent levels and checking against other videos on the platform.

Measure the whole finished mix, not one clip, since integrated loudness is an average over the programme.

### Consistency within a video

Loudness problems often occur between clips: one interview recorded quietly, another loud, music suddenly jumping in. Use clip gain or volume adjustments to match clips first, then apply compression and limiting on the overall mix. Listen specifically at every transition, where volume jumps are most noticeable.

### Mono and stereo

Dialogue recorded on one mic is usually mono. If it appears only in the left ear on headphones, the clip is set to play one channel on one side. Fix it by setting the channel to mono or duplicating it to both sides, so the voice sits in the centre. Music and ambience can remain stereo.

### Final check

Play the finished video on a phone at a comfortable volume, straight after a popular video in the same app. If yours sounds noticeably quieter, louder or harsher, adjust. Your ears, in the real listening situation, are the final meter.
      `,
        [
          q('What does LUFS measure?', [
            'The loudest single instant in a mix',
            'The file size of the audio',
            'Perceived loudness over time',
            'The number of audio tracks',
          ], 2, 'LUFS measures loudness as it is perceived across the programme, unlike peak meters.'),
          q('What is a common integrated loudness target for YouTube and social video?', [
            '0 LUFS',
            'Around -14 LUFS',
            'Around -40 LUFS',
            'Around +6 LUFS',
          ], 1, 'Around -14 LUFS is a widely used target that matches common platform normalisation.'),
          q('Dialogue plays only in the left ear on headphones. What is the fix?', [
            'Add more compression',
            'Increase the music volume',
            'Apply a high-pass filter',
            'Set the voice to mono so it plays in both ears',
          ], 3, 'A single-channel recording should be set to mono or duplicated so the voice sits in the centre.'),
        ]
      ),
      lesson('Choosing Music and Staying Copyright Safe', 13, `
Music sets the mood of a video faster than anything else. The same footage feels exciting, calm, funny or emotional depending on the track. Music is also the most common source of legal trouble for editors, because using a song you do not have rights to can get videos muted, blocked or removed, and can cause serious problems for clients.

### Choosing music that fits

Before searching, decide:

| Question | Example answer |
|---|---|
| What should viewers feel? | Energetic and hungry for a food Reel |
| What pace suits the edit? | Upbeat, around the tempo of quick cuts |
| Will someone speak over it? | Yes, so avoid tracks with busy vocals |
| What is the brand's personality? | Friendly and modern, not aggressive |

Instrumental tracks are usually best under speech, because lyrics compete with the speaker's words. Tracks with clear sections (intro, build, drop, outro) are easier to edit to, since you can align visual changes with musical changes.

### Editing music to length

Music rarely matches your video's length exactly. Rather than fading out abruptly, cut the track at the end of a musical phrase or bar, and join sections that share the same beat. Some editors offer automatic remixing: Premiere Pro's Remix feature can rearrange a track to a target duration, and some stock libraries provide versions of different lengths.

### Copyright basics

Almost all commercial songs are protected by copyright. That includes film songs, popular Pakistani, Indian and international music, and cover versions. Using them without a licence can lead to:

- **Automated claims**: YouTube's Content ID and similar systems detect music and may mute the video, block it in some countries, or send ad revenue to the rights holder.
- **Takedowns and strikes**: repeated infringement can put channels at risk.
- **Legal risk**: especially for advertising, where commercial use without permission is serious.

"I only used ten seconds", "I credited the artist" and "I found it on YouTube" do not make it legal.

### Safer sources of music

| Source | Notes |
|---|---|
| Platform libraries | YouTube Audio Library for YouTube videos; TikTok's Commercial Music Library for business accounts |
| Subscription music libraries | Paid services licensing music for creators and, depending on plan, for client work |
| Royalty-free purchases | Pay once per track, under a specific licence |
| Original music | Commissioned from a composer, with rights agreed in writing |

"Royalty-free" does not mean free of cost or free of rules. It means you do not pay ongoing royalties once licensed. Always read what the licence covers: platforms, commercial use, client work, and whether it stays valid after a subscription ends.

### Personal content versus client work

Personal Reels on Instagram and TikTok can often use songs from the app's own music library, because the platform has licences for that use. Those licences generally do not cover business advertising or content you export and upload elsewhere. For clients, use music licensed for commercial use and keep proof of the licence in the project folder.

### Keep a licence record

\`\`\`text
06_Documents/Music-Licences.txt
Track:      "Morning Drive"
Source:     [music library name]
Licence:    Commercial use, client project, all social platforms
Downloaded: 2025-03-12, licence ID XXXXX
Used in:    CrumbsBakery_Lunchbox_v04
\`\`\`

If a claim ever appears, this record resolves it quickly.
      `,
        [
          q('Why are instrumental tracks usually best under speech?', [
            'They are always free of copyright',
            'They are louder than vocal tracks',
            'Lyrics compete with the speaker\'s words',
            'Platforms reject videos with vocals',
          ], 2, 'Sung words distract from spoken words, so instrumentals keep speech clear and understandable.'),
          q('What does "royalty-free" mean?', [
            'The music costs nothing and has no rules',
            'You do not pay ongoing royalties once licensed',
            'Anyone can use it for any purpose without a licence',
            'It was composed by artificial intelligence',
          ], 1, 'Royalty-free music still requires a licence with terms; it simply avoids ongoing per-use royalties.'),
          q('Why keep a record of music licences for client projects?', [
            'Platforms require a text file with every upload',
            'It improves audio quality',
            'It reduces the file size',
            'It proves your right to use the track if a claim appears',
          ], 3, 'Documented licences resolve copyright claims quickly and protect both you and the client.'),
        ]
      ),
      lesson('Sound Effects and Audio Ducking', 13, `
Listen carefully to a well-made commercial or a popular creator's video and you will hear far more than speech and music: whooshes on transitions, clicks when text appears, room ambience, a subtle rise before a reveal. Sound design makes edits feel alive and polished, often without viewers consciously noticing.

### Types of sound effects

| Type | Examples | Use |
|---|---|---|
| Transitions | Whoosh, swipe, riser | Emphasise cuts and movements |
| UI and text | Click, pop, typing, ding | When text, icons or graphics appear |
| Hits and impacts | Boom, thud, bass drop | Reveals, emphasis, beat drops |
| Foley | Footsteps, cup on table, sizzling | Make real actions sound full and present |
| Ambience | Street noise, café chatter, birds | Set the location and fill silence |

Sound effect libraries are available from the same sources as music. The same licensing rules apply: check commercial use for client work.

### Subtlety wins

A common beginner mistake is adding loud effects to every cut. Sound effects should support the picture, not compete with it. A good test: remove all effects and play the video, then add them back. The version with effects should feel smoother and more energetic, but not noisy. If an effect makes you flinch, lower it or remove it.

### Ambience makes edits seamless

When you cut dialogue, the background noise changes at each cut, creating subtle jumps. Laying a continuous ambience track, room tone or location sound, under the whole scene smooths these jumps and makes the space feel real. This is why chapter 2 asked you to record room tone.

### Audio ducking

Ducking automatically lowers music when someone speaks, then raises it again in pauses. It keeps speech clear without manually adjusting the music throughout.

\`\`\`text
Music:    ████████▁▁▁▁▁▁▁▁▁▁▁▁████████▁▁▁▁▁▁████████
Speech:           ▆▆▆▆▆▆▆▆▆▆▆▆        ▆▆▆▆▆▆
\`\`\`

Ways to duck in each editor:

| Editor | Method |
|---|---|
| Premiere Pro | Essential Sound panel: tag music as Music, enable Ducking, and generate keyframes against dialogue |
| DaVinci Resolve | Fairlight: sidechain compression or ducking on the music track keyed to dialogue |
| CapCut | Some versions offer an auto-duck or auto volume option; otherwise adjust volume with keyframes |

### Manual keyframes for control

Automatic ducking is fast but sometimes pumps awkwardly, especially with short pauses. For important moments, use volume keyframes: add points before and after a line, and lower the music between them. Make fades gradual, over a quarter to half a second, so changes are smooth.

### Music hits and silence

Music can do more than sit underneath. Let it swell during a montage with no speech, stop suddenly just before a punchline, or hit exactly on a reveal. Silence is also a sound design tool: a sudden drop to near silence before a key moment draws attention powerfully.

### Build a personal library

Collect a small, organised folder of licensed effects you use often: a few whooshes, clicks, pops, risers and ambiences. Name them clearly, such as \`whoosh_soft_01.wav\`. Having your favourites ready saves searching time on every project and gives your edits a consistent sound.
      `,
        [
          q('What does audio ducking do?', [
            'Removes all music from a video',
            'Converts stereo audio to mono',
            'Automatically lowers music while someone speaks',
            'Adds reverb to dialogue',
          ], 2, 'Ducking reduces music under speech and raises it in pauses, keeping dialogue clear.'),
          q('Why lay a continuous ambience track under cut dialogue?', [
            'To make the voice louder',
            'To smooth background jumps at each cut',
            'To replace the need for music',
            'To reduce the file size',
          ], 1, 'Continuous ambience hides the changes in background noise between dialogue edits.'),
          q('How should sound effects generally be used?', [
            'As loud as possible on every cut',
            'Only in horror videos',
            'Never in short-form content',
            'Subtly, supporting the picture without competing',
          ], 3, 'Effects add polish when they reinforce the visuals quietly, but loud constant effects distract viewers.'),
        ]
      ),
      ],
      [
      q('A voice sounds dull and slightly muffled. Which EQ adjustment usually helps?', [
        'Cutting everything above 2 kHz',
        'Boosting frequencies below 80 Hz',
        'A gentle boost around 2 to 5 kHz',
        'Removing the high-pass filter',
      ], 2, 'The presence range around 2 to 5 kHz adds clarity when a voice sounds dull.'),
      q('Why not make a mix as loud as possible for YouTube?', [
        'Platforms turn loud mixes down anyway',
        'YouTube rejects any video louder than its target',
        'Loud mixes cannot contain music or effects',
        'Loudness only matters for podcasts and radio',
      ], 0, 'Normalisation turns overly loud mixes down, so extreme limiting only damages dynamics without benefit.'),
      q('A client wants a popular film song in their paid advert. What is the right response?', [
        'Use ten seconds, which is always allowed',
        'Credit the artist in the description',
        'Download it from YouTube and use it',
        'Explain it needs a commercial licence and suggest licensed alternatives',
      ], 3, 'Commercial use of copyrighted songs requires permission, so licensed music protects the client.'),
      q('Which is the best tool for keeping music quiet under speech throughout a video?', [
        'A high-pass filter on the music',
        'A fade to black',
        'A cross dissolve',
        'Ducking or volume keyframes on the music',
      ], 3, 'Ducking or keyframes lower the music whenever speech occurs, maintaining clarity.'),
      ]
    ),
    chapter(
      'Colour Correction and Grading',
      'Separate technical correction from creative grading, read waveforms, vectorscopes and histograms, fix white balance and skin tones, match shots, and use LUTs and log footage to build a consistent look.',
      [
      lesson('Correction Versus Grading', 13, `
Colour work has two stages that beginners often mix up. Colour correction fixes technical problems so footage looks natural and consistent. Colour grading adds a creative look that sets a mood. Correcting first and grading second is the single most important habit in colour work.

### Colour correction: making it right

Correction answers the question "Does this look accurate and consistent?" It fixes:

- Exposure: footage too dark or too bright.
- Contrast: images looking flat or harsh.
- White balance: a blue or orange colour cast.
- Saturation: colours dull or overly intense.
- Consistency: shots from different cameras or times that do not match.

Corrected footage looks natural, as if you were standing there.

### Colour grading: making it feel

Grading answers the question "What mood should this have?" It might make a food video warm and inviting, a tech video cool and clean, a travel video vibrant, or a drama moody and desaturated. Grading is a creative choice that supports the story and the brand.

| | Correction | Grading |
|---|---|---|
| Goal | Accurate, natural, consistent | Mood, style, brand identity |
| Applied to | Each shot individually | Usually the whole video, often on an adjustment layer |
| Decided by | Technical standards and scopes | Creative intent and the brief |
| Order | First | Second |

### Why the order matters

If you apply a stylised look to uncorrected footage, the look behaves differently on every shot. A warm grade on a shot that is already too orange becomes extreme; on a shot that is too blue it looks neutral. Correcting first gives every shot a consistent starting point, so the grade looks the same across the video.

### Where colour tools live

| Editor | Main colour tools |
|---|---|
| CapCut | Adjust panel: brightness, contrast, temperature, saturation and more; filters for looks |
| Premiere Pro | Lumetri Color panel: Basic Correction, Creative, Curves, Colour Wheels and Match, HSL Secondary |
| DaVinci Resolve | The Color page: primary wheels, curves, qualifiers, windows and node-based grading |

The concepts are the same everywhere. Resolve offers the most control, Premiere a very capable middle ground, and CapCut quick adjustments suited to short-form.

### A simple correction workflow

\`\`\`text
1. Set exposure: the image is neither too dark nor too bright.
2. Set contrast: blacks are dark, whites are bright, without clipping.
3. Fix white balance: whites and greys look neutral.
4. Adjust saturation: colours look natural.
5. Check skin tones: faces look healthy and natural.
\`\`\`

Do these in order for each shot, then compare shots side by side.

### Your monitor matters

Colour decisions depend on the screen. Laptop screens vary widely, and many are too blue, too bright or too saturated. You do not need an expensive reference monitor to start, but avoid extreme display settings such as night mode or vivid modes while grading, and check your work on a phone, since most viewers will watch there. As you take on more colour-critical work, a calibrated monitor becomes a worthwhile investment.

### Restraint

The most common beginner mistake is overdoing it: saturation pushed until skin looks orange, contrast so strong that detail disappears, or trendy teal-and-orange looks on everything. Subtle, consistent colour looks more professional and ages better than heavy effects.
      `,
        [
          q('What is the goal of colour correction?', [
            'Adding a dramatic creative mood',
            'Making footage look accurate, natural and consistent',
            'Converting footage to black and white',
            'Increasing the video\'s resolution',
          ], 1, 'Correction fixes technical issues like exposure and white balance so footage looks natural.'),
          q('Why should correction come before grading?', [
            'Grading tools do not work on uncorrected footage',
            'Correction is faster to render',
            'It gives every shot a consistent base, so the look behaves the same everywhere',
            'Platforms require corrected footage',
          ], 2, 'Starting from a consistent correction ensures a grade looks the same across different shots.'),
          q('Why check your colour work on a phone?', [
            'Phones have perfectly accurate screens',
            'Editors cannot display colour correctly',
            'Phones show the scopes more clearly',
            'Most viewers will watch on phones',
          ], 3, 'Checking on the devices your audience uses shows how the colour will actually be seen.'),
        ]
      ),
      lesson('Reading Scopes: Waveform, Vectorscope and Histogram', 14, `
Your eyes are easily fooled. After looking at a slightly blue image for a minute, it starts to look normal. Screens differ in brightness and colour. Scopes are graphs that measure the image objectively, showing brightness and colour as numbers and shapes. Professionals rely on them, and they are available in Premiere Pro (Lumetri Scopes), DaVinci Resolve (the Color page) and many other editors.

### The waveform: brightness across the frame

The waveform shows the brightness of the image from left to right. The horizontal position matches the image's horizontal position; the vertical position shows brightness, from black at the bottom to white at the top.

\`\`\`text
100 |          .:::.                 bright sky in top area of graph
    |      ..::::::::..
 50 |   .:::::::::::::::::.          midtones: faces, walls
    | .::::::::::::::::::::::.
  0 |::::::::::::::::::::::::::      shadows at the bottom
    +-----------------------------
      left of image    right of image
\`\`\`

The scale is often shown as 0 to 100 (IRE or percent) or, in Resolve, 0 to 1023 for 10-bit video.

What to look for:

| Waveform shows | Meaning |
|---|---|
| Trace flattened against the top | Highlights clipped: detail lost in bright areas |
| Trace squashed against the bottom | Shadows crushed: detail lost in dark areas |
| All trace in the middle band | Flat, low-contrast image |
| Trace spreading from near bottom to near top | Good contrast range |

For most footage, aim for a range that uses most of the scale without clipping important detail. Skin tones typically sit in the upper-middle part of the scale, depending on the person's complexion and the lighting.

### RGB parade: colour balance by channel

The RGB parade shows three separate waveforms side by side: red, green and blue. For a neutral white or grey object, the three channels should sit at similar heights. If the blue trace is higher than red and green in the highlights, the image has a blue cast in the bright areas. The parade makes white balance problems easy to see and fix.

### The vectorscope: colour and saturation

The vectorscope is a circle showing hue as direction and saturation as distance from the centre:

- A trace close to the centre means low saturation.
- A trace stretching far out means high saturation.
- The direction shows the colour: towards red, yellow, green, cyan, blue or magenta.

Most vectorscopes show a skin tone line, a diagonal line between red and yellow. Human skin of every complexion tends to fall near this line, because it shares a similar hue even though brightness varies. If a face sits well away from the line, towards green or magenta, the skin tone likely has a colour problem.

### The histogram

The histogram shows how many pixels exist at each brightness level, from dark on the left to bright on the right. A pile-up against the right edge suggests clipped highlights; against the left edge, crushed shadows. Many photographers already know histograms, and they give a quick overall check.

### Using scopes in practice

1. Adjust exposure and contrast while watching the waveform.
2. Neutralise white balance while watching the RGB parade on something white or grey.
3. Check saturation and skin tones on the vectorscope.
4. Then look at the image itself and trust your eye for the final creative decision.

Scopes guide technical accuracy; your eye decides whether it looks good.
      `,
        [
          q('What does a waveform trace flattened against the top indicate?', [
            'Clipped highlights with lost detail',
            'Crushed shadows',
            'Too little saturation',
            'A perfect exposure',
          ], 0, 'A trace pressed against the top means bright areas have reached maximum and lost detail.'),
          q('What does the RGB parade help you check?', [
            'Audio levels for each channel',
            'The video\'s frame rate',
            'The export bitrate',
            'Colour balance between the red, green and blue channels',
          ], 3, 'Comparing channel heights on neutral areas reveals colour casts, making white balance easier to fix.'),
          q('What is the skin tone line on a vectorscope?', [
            'A line showing the brightest point in the image',
            'A guide between red and yellow where most skin tones fall',
            'A marker for clipped shadows',
            'The boundary of legal saturation',
          ], 1, 'Skin of every complexion shares a similar hue, so faces normally sit near this line.'),
        ]
      ),
      lesson('White Balance, Skin Tones and Matching Shots', 13, `
Viewers forgive many imperfections, but they notice immediately when skin looks wrong or when shots in the same scene look like they came from different days. White balance, skin tones and shot matching are the core of practical colour correction.

### White balance: removing colour casts

Different light sources have different colours. Daylight is bluish, indoor bulbs are often orange, and some fluorescent and LED lights add a green or magenta tint. Cameras try to adjust automatically but often get it slightly wrong, especially with mixed light.

To correct white balance:

| Tool | How to use it |
|---|---|
| Temperature slider | Move towards blue or orange to cancel the cast |
| Tint slider | Move towards green or magenta to cancel a tint |
| Eyedropper or white balance picker | Click something that should be neutral white or grey |
| RGB parade | Adjust until the channels align on neutral areas |

The eyedropper is quickest: click a white wall, a white shirt or grey pavement, and the software neutralises the image. Avoid clicking areas that are actually coloured, such as a cream wall, which would introduce a cast.

### Skin tones

Skin should look natural and healthy across all complexions. Check faces on the vectorscope, where they should sit near the skin tone line, then judge by eye:

- Too orange or red: reduce temperature or saturation slightly.
- Too green: shift tint towards magenta.
- Too magenta or pink: shift tint towards green.
- Grey or lifeless: add a little saturation or warmth.

Grade skin carefully for all complexions. Avoid "lightening" skin to fit a beauty ideal; aim for accurate, flattering and respectful representation, which clients and audiences increasingly expect.

### Secondary corrections

Sometimes one colour needs changing without affecting everything else: a sky that is too pale, a product logo that must match its brand colour, or a green wall reflecting on a face. Secondary tools isolate a range of colours:

- **Premiere Pro**: HSL Secondary in Lumetri, selecting a colour range with key controls.
- **DaVinci Resolve**: qualifiers on the Color page, combined with power windows to limit the area.

For brand work, matching product colours accurately is often important: a food brand's red packaging should look like its real red.

### Matching shots

Within a scene, shots should look like they were filmed at the same time and place. Mismatches come from different cameras, changing sunlight or auto settings shifting between takes. A practical method:

\`\`\`text
1. Choose a hero shot and correct it carefully.
2. Place the next shot beside it using a split-screen or reference view.
3. Match exposure using the waveform.
4. Match white balance using the RGB parade.
5. Match saturation using the vectorscope.
6. Compare the faces; fine-tune by eye.
\`\`\`

Premiere's Colour Match and Resolve's Shot Match can do a first pass automatically. Check and refine the result, especially on skin.

### Consistency across a series

For clients who post regularly, consistency across videos matters as much as within one. Save your correction and grade settings as presets, or save stills of your hero shots for reference. When the next video arrives, match it to the reference so the client's feed looks cohesive.

### Get it right in camera

Good colour starts with good filming. Setting a fixed white balance on the camera or phone, rather than auto, and avoiding mixed light sources make correction much faster. Editing can fix a lot, but footage filmed well always grades better.
      `,
        [
          q('How do you use the white balance eyedropper correctly?', [
            'Click the most colourful object in the frame',
            'Click something that should be neutral white or grey',
            'Click a person\'s face',
            'Click the darkest shadow in the image',
          ], 1, 'The eyedropper neutralises the image based on the chosen area, so it must be truly neutral.'),
          q('A face looks slightly green. What adjustment helps?', [
            'Increase the temperature towards blue',
            'Add more contrast',
            'Reduce exposure',
            'Shift tint towards magenta',
          ], 3, 'Green and magenta are opposites on the tint axis, so shifting towards magenta cancels a green cast.'),
          q('What is the first step in matching shots within a scene?', [
            'Apply the same LUT to all shots without checking',
            'Increase saturation on every shot',
            'Choose and carefully correct a hero shot as the reference',
            'Export each shot separately',
          ], 2, 'Matching needs a well-corrected reference that other shots are compared and adjusted to.'),
        ]
      ),
      lesson('LUTs, Log Footage and Creating a Look', 12, `
Once footage is corrected and matched, grading gives the video its personality. Look-up tables, known as LUTs, are a popular tool for this, and they are also essential when working with log footage from cameras and some recent phones.

### What a LUT is

A LUT is a file, usually with a \`.cube\` extension, that maps input colours to output colours. Applying a LUT transforms the image in one step. There are two main kinds:

| Type | Purpose |
|---|---|
| Technical (conversion) LUT | Converts footage from one colour space to another, such as log to standard Rec.709 |
| Creative LUT | Applies a stylistic look, such as warm film, cool cinematic or faded vintage |

### Log footage

Many cameras, and some recent phones, can record in a log profile. Log footage looks flat, grey and washed out straight from the camera. That is deliberate: it preserves more detail in highlights and shadows, giving more flexibility in grading.

\`\`\`text
Standard footage: looks good immediately, less flexibility
Log footage:      looks flat, needs conversion, more flexibility
\`\`\`

Log footage must be converted to a standard colour space for viewing. Camera and phone manufacturers usually provide official conversion LUTs for their log profiles. DaVinci Resolve also offers Color Space Transform tools, and Premiere Pro can automatically interpret log footage from many cameras in recent versions.

### The right order

A reliable structure, used by many colourists:

\`\`\`text
1. Correction on each clip   exposure and white balance adjustments
2. Conversion                log to Rec.709, if the footage is log
3. Grade                     creative look, often on an adjustment layer
\`\`\`

In Resolve, this structure is built with nodes in series: a correction node, then a conversion node, then a look node. In Premiere, correct each clip in Lumetri, then apply a creative look on an adjustment layer above the whole timeline.

Applying a creative LUT directly to uncorrected log footage is a common mistake that gives extreme, unpredictable results.

### Using creative LUTs well

- Apply the LUT after correction, not instead of it.
- Reduce its strength. Many look best at 30 to 70% intensity; Premiere's Creative section has an intensity slider, and in Resolve you can reduce a node's key output.
- Test on several shots, especially faces, before committing.
- Avoid LUTs designed for different footage, such as a LUT made for a specific camera's log profile applied to standard phone video.

### Building your own look

You can create a look without LUTs using basic tools:

| Mood | Typical adjustments |
|---|---|
| Warm and inviting (food, family) | Slightly warmer temperature, gentle saturation, soft contrast |
| Clean and modern (tech, corporate) | Neutral to slightly cool, crisp contrast, controlled saturation |
| Cinematic | Slight teal in shadows, warm highlights, controlled saturation, gentle contrast curve |
| Nostalgic | Lifted blacks, reduced saturation, warm tint |

Save successful looks as presets or export them as your own LUTs, so you can apply a client's signature look to every new video in seconds.

### Keep the brand in mind

For client work, the look should match the brand. A children's clothing brand needs bright, friendly colour; a luxury real estate agency may want refined, warm tones; a hospital wants clean, trustworthy neutrals. Ask for examples of videos the client likes before choosing a look, and keep it consistent across their content.
      `,
        [
          q('Why does log footage look flat and grey from the camera?', [
            'It is designed to preserve more highlight and shadow detail for grading',
            'The camera recorded it incorrectly',
            'Log footage has no colour information',
            'It is a low-quality recording mode',
          ], 0, 'Log profiles compress the tonal range to keep detail, which must then be converted for normal viewing.'),
          q('What is a sensible order for grading log footage?', [
            'Creative LUT, then conversion, then correction',
            'Only a creative LUT, with no other steps',
            'Grade first, correct afterwards',
            'Correction, then conversion to Rec.709, then the creative look',
          ], 3, 'Correcting and converting first gives a standard, consistent image for the creative grade to work on.'),
          q('Why reduce the intensity of a creative LUT?', [
            'LUTs cannot be applied at full strength',
            'It makes exports render faster',
            'Many looks are too strong at full intensity and look better blended',
            'Platforms reject videos with strong LUTs',
          ], 2, 'Full-strength creative LUTs are often heavy-handed, so blending them keeps the look natural.'),
        ]
      ),
      ],
      [
      q('Which task belongs to colour grading rather than correction?', [
        'Fixing an orange colour cast',
        'Recovering an underexposed shot',
        'Matching two cameras',
        'Creating a warm, nostalgic mood for a brand',
      ], 3, 'Grading is the creative step that sets mood and style after technical correction.'),
      q('Which scope best shows whether a face has a healthy hue?', [
        'The histogram of pixel brightness',
        'The waveform showing brightness left to right',
        'The vectorscope',
        'The audio loudness meter',
      ], 2, 'The vectorscope shows hue and saturation, and faces should sit near its skin tone line.'),
      q('Two shots of the same scene look different in brightness and colour. What helps match them?', [
        'Comparing them side by side using the waveform, parade and vectorscope',
        'Applying heavy saturation to both',
        'Adding a transition between them',
        'Exporting them at different resolutions',
      ], 0, 'Scopes show objective differences in exposure and colour, which you adjust until the shots match.'),
      q('What does a technical conversion LUT do?', [
        'Adds a faded vintage film look to every shot',
        'Removes background noise from the dialogue',
        'Changes the frame rate of the timeline',
        'Converts log footage to Rec.709',
      ], 3, 'Conversion LUTs transform footage into a standard colour space for correct display.'),
      ]
    ),
    chapter(
      'Text, Graphics and Motion',
      'Design readable text and captions, animate with keyframes and easing, build lower thirds and reusable motion graphics templates, and use green screen, masks and tracking for effects clients ask for.',
      [
      lesson('Typography and Captions That Get Read', 13, `
Text on screen has a harder job than text on paper. It appears for a second or two, often over moving images, on a small phone screen, while the viewer may be half paying attention. Good typography makes text readable instantly; poor typography means the message is missed.

### Choose fonts for screens

| Choice | Why |
|---|---|
| Sans-serif fonts for most text | Clean shapes read well at small sizes and low resolutions |
| Bold or semi-bold weights | Thin strokes disappear on busy backgrounds and phone screens |
| At most two font families | One for headings, one for body text; more looks messy |
| Consistent sizes and styles | Viewers learn what each style means |

Decorative, script or very thin fonts can work for a short title, but not for captions or information viewers must read quickly.

### Urdu and bilingual text

Many Pakistani clients want Urdu text or a mix of Urdu and English. Urdu is traditionally written in Nastaliq script, which needs fonts designed for it, such as Jameel Noori Nastaleeq, and editing software that supports right-to-left text and proper letter joining. Test Urdu text carefully in your editor: some tools display letters disconnected or in the wrong order. When support is poor, create the Urdu text in a design tool that handles it well and import it as a transparent PNG.

Many audiences also use Roman Urdu, Urdu written in English letters, especially in captions. Follow the client's preference and keep spelling consistent.

### Font licences

Fonts are software with licences. Fonts installed on your computer may not be licensed for commercial video. Google Fonts are distributed under open licences that generally allow commercial use, which makes them a safe default. For premium fonts, check the licence covers video and client work, just as with music.

### Hierarchy

When several pieces of text appear together, their visual importance should match their actual importance:

\`\`\`text
BIG, BOLD:     "Eid Sale: 30% Off"           main message
Medium:        "All kurtas and shalwar suits"  supporting detail
Small:         "Until 15 April, while stocks last"  fine print
\`\`\`

Size, weight and colour create hierarchy. If everything is big and bold, nothing stands out.

### Contrast and backgrounds

Text must stand out from the video behind it, which changes constantly. Reliable techniques:

- An outline or stroke around the letters.
- A soft drop shadow.
- A semi-transparent box behind the text.
- Placing text over plain areas of the frame, such as a wall or sky.

Check readability on the busiest part of the shot, not just the calm part.

### Reading time

Viewers need time to read. A rough guide: allow at least a second and a half for a short phrase, and longer for sentences, then add time for important information like prices and phone numbers. If there is too much text to read comfortably, cut words rather than speeding them up.

### Captions versus on-screen text

Captions transcribe speech and should follow it closely. On-screen text adds information: key points, labels, numbers and calls to action. Keep their styles visually distinct, for example captions in white with an outline at the lower middle, and key point text in the brand colour near the top, so viewers understand the difference instantly.

### Brand consistency

For clients, build a small text style guide: fonts, colours, sizes and positions for titles, captions, lower thirds and calls to action. Save them as presets or templates in your editor. Every video then looks like part of the same brand, and producing new videos becomes faster.
      `,
        [
          q('Why are thin decorative fonts poor choices for captions?', [
            'They are never licensed for video',
            'They are hard to read quickly on small, busy screens',
            'Editors cannot display them',
            'They make the file size larger',
          ], 1, 'Captions must be read instantly, so bold, clean fonts work better than thin or decorative ones.'),
          q('What is a practical solution when an editor displays Urdu letters disconnected?', [
            'Switch the text to all capitals and a thicker weight',
            'Remove all Urdu from the video and use English only',
            'Design it elsewhere and import it as a PNG',
            'Reduce the font size until the letters touch',
          ], 2, 'Designing Urdu text where Nastaliq renders correctly and importing it as an image preserves proper letter joining.'),
          q('How is hierarchy created in on-screen text?', [
            'By making every line the same size',
            'By using as many fonts as possible',
            'By animating each word differently',
            'By varying size, weight and colour to match importance',
          ], 3, 'Visual differences guide the viewer to the main message first and details afterwards.'),
        ]
      ),
      lesson('Keyframes and Basic Animation', 13, `
Almost all motion in video editing, a title sliding in, a slow zoom on a photo, a logo fading out, is built with keyframes. A keyframe records a property's value at a point in time. Place two keyframes with different values, and the software animates smoothly between them.

### The idea

\`\`\`text
Time:      0s            1s
Position:  off-screen    centre
Result:    the text slides from off-screen to the centre over one second
\`\`\`

Any property with a value can usually be keyframed: position, scale, rotation, opacity, crop, volume, colour settings and effect parameters.

### Where keyframes live

| Editor | How to keyframe |
|---|---|
| CapCut | Select a clip, move the playhead, tap the keyframe (diamond) button, change a property, move and repeat |
| Premiere Pro | Effect Controls panel: click the stopwatch next to a property to start keyframing, then change values at other times |
| DaVinci Resolve | Inspector: click the diamond next to a property; the keyframe editor shows them on the timeline |

The process is the same everywhere: set a starting value and keyframe, move in time, set an ending value.

### Common animations

- **Slide in**: position from off-screen to the final place.
- **Scale pop**: scale from 80% to 105% to 100% for a lively entrance.
- **Fade**: opacity from 0% to 100%.
- **Slow push-in**: scale a shot from 100% to 110% over several seconds for subtle movement.
- **Pan on a photo**: position from one side to the other, the Ken Burns effect from chapter 6.

### Easing makes motion natural

By default, keyframes often create linear motion: constant speed, starting and stopping abruptly. Real objects accelerate and decelerate. Easing adds that behaviour:

| Easing | Effect | Good for |
|---|---|---|
| Linear | Constant speed, abrupt start and stop | Mechanical movement, continuous scrolling |
| Ease out | Starts fast, slows into place | Elements arriving on screen |
| Ease in | Starts slowly, speeds up | Elements leaving the screen |
| Ease in and out | Slow, fast, slow | Camera-like moves, smooth transitions |

In Premiere, right-click a keyframe and choose Ease In or Ease Out, or adjust the speed graph. In Resolve, keyframes can be set to ease in the keyframe editor or curve editor. CapCut offers easing presets on some animations and keyframes. The difference between linear and eased motion is one of the biggest steps from amateur to professional-looking animation.

### Timing guidelines

Most interface-style animations in short-form video are quick:

\`\`\`text
Text entering        0.2 to 0.5 seconds
Small pops           0.15 to 0.3 seconds
Slow push-in         3 to 10 seconds
Logo reveal          1 to 2 seconds
\`\`\`

Animations that are too slow feel sluggish; too fast and viewers miss them. Match timing to the music and pace of the edit.

### Motion blur

Fast-moving elements look smoother with motion blur, which mimics how cameras capture movement. Many editors and Fusion or After Effects can add motion blur to animated graphics. A little blur on a fast slide-in makes it feel filmed rather than digital.

### Keep motion purposeful

Every animation draws the eye. Animate what you want viewers to notice, such as a key number or a call to action, and keep everything else still. When too many things move at once, viewers do not know where to look.
      `,
        [
          q('What does a keyframe record?', [
            'A property\'s value at a specific point in time',
            'The file name of a clip',
            'The export settings',
            'The audio sample rate',
          ], 0, 'Keyframes store values at moments in time, and the software animates between them.'),
          q('Which easing suits text arriving and settling on screen?', [
            'Linear',
            'Ease in',
            'Ease out',
            'No easing at all',
          ], 2, 'Ease out starts fast and slows into place, like an object naturally coming to rest.'),
          q('Why keep animations limited to key elements?', [
            'Editors cannot animate more than three elements',
            'Animation increases the file size too much',
            'Platforms remove animated text',
            'Too much movement leaves viewers unsure where to look',
          ], 3, 'Motion attracts attention, so animating only what matters directs the viewer\'s eye.'),
        ]
      ),
      lesson('Lower Thirds and Motion Graphics Templates', 13, `
Lower thirds are the name-and-title graphics that appear in the lower part of the screen when someone is introduced. Together with title cards, calls to action and branded end screens, they make videos feel professional and consistent. Templates turn these graphics into reusable building blocks, saving hours across a series.

### What makes a good lower third

| Element | Guideline |
|---|---|
| Content | Name on the first line, role or organisation on the second |
| Position | Lower left or lower centre, inside the safe zone |
| Duration | Around three to five seconds, enough to read twice |
| Animation | A simple, quick entrance and exit |
| Style | Brand fonts and colours, consistent across videos |

\`\`\`text
DR. SADIA AHMED
Dermatologist, Islamabad Skin Clinic
\`\`\`

For vertical short-form video, remember that the lower part of the screen is covered by platform captions and buttons. Place lower thirds higher than you would in a horizontal video, around the lower middle of the safe area.

### Other common graphics

- **Title cards**: the video title or episode name, often at the start.
- **Key point callouts**: a highlighted number or phrase that summarises what the speaker said.
- **Calls to action**: "Order on WhatsApp", "Follow for part 2", with an arrow or icon.
- **Logo bugs**: a small, semi-transparent logo in a corner.
- **End screens**: a closing frame with the logo, contact details or links to other videos.

### Templates in Premiere Pro

Premiere uses Motion Graphics Templates, \`.mogrt\` files, through the Essential Graphics panel (or Properties panel in newer versions). A template can expose only the controls an editor needs, such as the name, title and colour, while protecting the design and animation. Premiere includes free templates, and many more are available from template marketplaces; check the licence. You can also create your own templates in Premiere, or in After Effects for more complex animation, and share them with other editors on a team.

### Templates in DaVinci Resolve

Resolve's titles include Fusion-based Text+ titles. You can build a lower third in Fusion, save it as a macro or template, and it then appears in your Effects library. Many creators sell or share Resolve title packs as well.

### Templates in CapCut

CapCut offers text templates and animated text presets. Save a styled text as a preset or favourite so you can reuse it. For brand clients, create a set of saved styles for their titles, captions and calls to action.

### Build a brand kit for each regular client

\`\`\`text
Client: Crumbs Bakery
Fonts:        Montserrat Bold (titles), Inter SemiBold (captions)
Colours:      #5A2D0C chocolate, #F6C177 caramel, #FFFFFF
Logo:         logo-white.png, logo-dark.png (transparent)
Lower third:  CrumbsLowerThird.mogrt
CTA:          "Order on WhatsApp 03XX-XXXXXXX", caramel box
End screen:   5 seconds, logo and WhatsApp number
\`\`\`

With a kit like this, every new video starts with branding already solved, and anyone on the team can produce on-brand content.

### Keep graphics readable and timely

Graphics should appear when they are relevant: a lower third when the person is first introduced, not a minute later; a price exactly when it is mentioned. Check that all names and titles are spelt correctly and approved by the client, since a misspelt name on a doctor's or executive's lower third is an embarrassing, easily avoided error.
      `,
        [
          q('Why should lower thirds sit higher in vertical short-form videos?', [
            'Vertical videos cannot show text at the bottom',
            'It makes the text larger automatically',
            'Platform captions and buttons cover the lower part of the screen',
            'Lower thirds must always be centred vertically',
          ], 2, 'Interface elements overlay the bottom of vertical videos, so graphics need to sit higher to stay visible.'),
          q('What is an advantage of a Motion Graphics Template (.mogrt)?', [
            'Editors change text and colours while the design stays protected',
            'It removes the need for fonts',
            'It exports the video automatically',
            'It only works in CapCut',
          ], 0, 'Templates expose only the needed controls, keeping designs consistent and quick to reuse.'),
          q('What should you check before delivering lower thirds?', [
            'That each uses a different font',
            'That they stay on screen for the whole video',
            'That they appear before the person is introduced',
            'That names and titles are spelt correctly and approved',
          ], 3, 'Correct, approved names prevent embarrassing errors, especially for professionals and executives.'),
        ]
      ),
      lesson('Green Screen, Masks and Tracking', 13, `
Some client requests go beyond cutting and captions: replacing a background, blurring a face or number plate, placing text behind a person, or putting a screen recording inside a phone. Keying, masking and tracking make these effects possible in all three editors.

### Green screen keying

Chroma keying removes a solid colour, usually green or blue, from the background so another image can be placed behind the subject.

| Editor | Keying tool |
|---|---|
| CapCut | Chroma key; also AI background removal |
| Premiere Pro | Ultra Key effect |
| DaVinci Resolve | 3D Keyer on the Color page, keyers in Fusion |

The workflow: apply the keyer, pick the background colour with an eyedropper, then refine settings until the background disappears cleanly while hair and edges stay intact.

### Good keys start while filming

Most keying problems are filming problems:

- Light the green screen evenly, with no wrinkles or shadows.
- Keep the subject a metre or two away from the screen to reduce green reflecting on them, called spill.
- Light the subject separately from the background.
- Avoid green clothing, which would disappear with the background.
- Use a higher-quality recording setting; heavy compression makes edges blocky.

Spill suppression tools reduce the green tinge on hair and edges. Afterwards, colour-correct the subject to match the new background's lighting, so they look like they belong there.

### AI background removal

CapCut and other tools can remove backgrounds without a green screen using AI. Results are impressive for talking heads with clear outlines, but struggle with fine hair, fast motion and similar colours between subject and background. Check edges frame by frame on important shots.

### Masks

A mask limits an effect or a layer to part of the frame. Common uses:

- **Blur a face or logo**: apply a blur only inside a mask.
- **Text behind a person**: duplicate the clip on a higher track, mask around the person, and place text between the two tracks.
- **Selective colour correction**: brighten one face without brightening the whole image.
- **Split-screen layouts**: show two clips side by side.

Premiere adds masks to effects and opacity; Resolve uses power windows on the Color page and masks in Fusion; CapCut offers mask shapes on clips.

### Tracking

When the subject moves, a static mask stays behind. Tracking analyses the movement of an area and makes the mask or graphic follow it:

\`\`\`text
1. Draw a mask around the face or object.
2. Run the tracker forward (and backward) through the clip.
3. Check the result; fix frames where tracking slipped.
4. Apply the effect, such as blur, inside the tracked mask.
\`\`\`

Premiere tracks masks directly in Effect Controls, Resolve's tracker follows power windows on the Color page and Fusion offers advanced planar tracking, and CapCut offers tracking for some effects and text.

### Privacy and ethics

Blurring is often needed for legal and ethical reasons: faces of people who did not consent, children, number plates, addresses, screens showing private information and customers' details in shops. Ask clients about consent for everyone identifiable in their footage, and blur when in doubt. Tracking makes this quick enough to do properly.
      `,
        [
          q('What causes green spill on a subject?', [
            'Wearing black clothing',
            'Filming at a high frame rate',
            'Standing too close to the green screen, which reflects onto them',
            'Using a blue screen instead of green',
          ], 2, 'Light bouncing off a nearby green screen tints the subject, which distance and spill suppression reduce.'),
          q('How do you place text behind a person in a shot?', [
            'Lower the text\'s opacity to zero on the top track',
            'Mask the person on a duplicate clip above the text',
            'Apply a chroma key to the text layer itself',
            'Put the text on the audio track below the clip',
          ], 1, 'The masked copy of the person sits above the text, so the text appears behind them.'),
          q('Why use tracking when blurring a face?', [
            'Tracking makes the blur stronger',
            'Faces cannot be blurred without tracking software',
            'Tracking removes the need for a mask',
            'It makes the mask follow the moving face through the clip',
          ], 3, 'Tracking analyses motion so the mask and blur stay on the face as it moves.'),
        ]
      ),
      ],
      [
      q('Which font source is generally safe for commercial video?', [
        'Google Fonts under their open licences',
        'Any font found on a website',
        'Fonts copied from another computer',
        'Fonts from a competitor\'s logo',
      ], 0, 'Google Fonts use open licences that generally permit commercial use, unlike many downloaded fonts.'),
      q('What makes eased animation look more professional than linear animation?', [
        'It is always faster',
        'It removes motion blur',
        'It works only on text',
        'It mimics natural acceleration and deceleration',
      ], 3, 'Real objects speed up and slow down, so eased motion feels natural while linear motion feels mechanical.'),
      q('What should a client brand kit include?', [
        'Only the client\'s phone number',
        'Fonts, colours, logos, templates and standard calls to action',
        'The client\'s passwords',
        'A list of competitors\' videos',
      ], 1, 'A brand kit captures all visual elements needed to produce consistent, on-brand videos quickly.'),
      q('A shop video shows customers who did not agree to appear. What should the editor do?', [
        'Publish it unchanged',
        'Add a caption apologising',
        'Blur identifiable faces using masks and tracking',
        'Increase the saturation',
      ], 2, 'Blurring people without consent protects their privacy and reduces legal and ethical risk.'),
      ]
    ),
    chapter(
      'Short-Form Content That Performs',
      'Write and edit hooks that stop the scroll, apply retention editing techniques that keep viewers watching, understand the differences between TikTok, Reels and YouTube Shorts, and repurpose long videos into strong shorts.',
      [
      lesson('Hooks in the First Three Seconds', 13, `
On short-form platforms, viewers decide within moments whether to keep watching or swipe away. The opening seconds, the hook, therefore matter more than any other part of the video. A brilliant video with a weak opening is rarely seen to the end; an average video with a strong hook often performs surprisingly well.

### What a hook must do

A hook gives the viewer a reason to keep watching. It usually works through one of these:

| Hook type | Example |
|---|---|
| Curiosity | "Nobody tells you this about starting a bakery..." |
| Bold claim | "This 450-rupee lunch beats every food court in Karachi." |
| Problem | "Your phone videos look blurry? Fix it in 10 seconds." |
| Visual surprise | The final dish revealed first, then "here is how" |
| Relatable moment | Someone checking the time at 12:55, starving, no lunch plan |
| Direct question | "Which is better for freelancers: Upwork or Fiverr?" |

The best hooks are specific. "Here are some tips" is weak; "3 mistakes that make your Reels look cheap" is strong.

### Hooks are visual, audio and text together

Many viewers see the first second with sound off. A strong opening combines:

\`\`\`text
Visual:  something moving or intriguing in frame 1, no slow fade-in
Text:    a short, bold on-screen line stating the hook
Audio:   the spoken hook starts immediately, with no "hi guys" intro
\`\`\`

The first frame matters because it is also what appears while the video loads and, often, in grids and previews.

### Remove everything before the hook

Editors can transform a video simply by cutting its opening. Common things to remove from the start:

- Greetings and introductions: "Hi everyone, welcome back to my channel..."
- Setup shots: walking in, sitting down, adjusting the camera.
- Logos and intros longer than a split second.
- Silence before speaking.

If the speaker's strongest line comes 20 seconds in, consider moving it to the start and then continuing from the beginning, as long as it still makes sense.

### Start with the payoff

A powerful technique is showing the result first: the finished makeover, the plated dish, the renovated room, the final score. Then the video explains how it happened. Viewers stay to see the process behind a result they already find appealing.

### Keep the promise

A hook creates an expectation. If the video does not deliver it, viewers feel misled, leave early, and may be less likely to watch the creator again. Misleading hooks can raise views once but damage trust and long-term performance. Promise what the video actually delivers, then deliver it early enough to keep viewers satisfied.

### Test different hooks

Creators and brands often film several versions of the opening line, then post variations or compare past videos to learn what works. When editing, keep alternative hook takes in the project. If a video underperforms, re-editing with a different hook is often the quickest improvement.

### A hook checklist

Before exporting, watch only the first three seconds, with sound off and then with sound on. Ask: would a stranger scrolling quickly stop here? Is it clear what the video is about? Is there a reason to keep watching? If not, rework the opening before touching anything else.
      `,
        [
          q('Which is the strongest hook?', [
            '"Hi everyone, welcome back to my channel"',
            '"Here are some tips for you today"',
            '"3 mistakes that make your Reels look cheap"',
            'A five-second logo animation',
          ], 2, 'Specific hooks promise clear value, while greetings and vague lines give viewers no reason to stay.'),
          q('Why does the first frame matter so much?', [
            'Many viewers decide immediately, and it often appears as the preview',
            'Platforms delete videos with poor first frames',
            'The first frame sets the export resolution',
            'It determines the music licence',
          ], 0, 'The opening frame is seen first while scrolling and loading, so it must grab attention immediately.'),
          q('Why should a hook keep its promise?', [
            'Platforms check hooks for accuracy before posting',
            'Misleading hooks cannot use captions',
            'Hooks must always be questions',
            'Misleading viewers causes early exits and damages trust',
          ], 3, 'Unfulfilled promises make viewers leave and trust the creator less, hurting long-term performance.'),
        ]
      ),
      lesson('Retention Editing Techniques', 14, `
Getting viewers past the hook is only the first battle. Retention editing keeps them watching until the end, which matters because platforms generally favour videos that people watch fully and rewatch. Retention editing is not about constant chaos; it is about removing every reason to leave.

### Cut ruthlessly

The simplest retention technique is removing anything that does not add value:

- Pauses, filler words and repeated points.
- Explanations that take ten seconds when three would do.
- Tangents, however interesting to the creator.
- Endings that trail off after the payoff.

A good exercise is to set a target: if the draft is 60 seconds, try to make the same point in 40. You will usually find the shorter version is better.

### Pattern interrupts

Viewers' attention drops when nothing changes on screen. A pattern interrupt is a change that re-engages them:

| Technique | Example |
|---|---|
| Punch-in or zoom | Alternate framing on a talking head, as in chapter 6 |
| B-roll | Cut to the thing being discussed |
| On-screen text | A key number or phrase appears |
| Sound effect | A subtle whoosh or pop with a visual change |
| Angle change | A second camera or a different position |
| Graphic or meme | A relevant reaction image, used sparingly |

A common rhythm in energetic short-form is a visual change every few seconds. Calmer content needs fewer changes but still benefits from variety.

### Open loops

An open loop raises a question and delays the answer, giving viewers a reason to keep watching:

\`\`\`text
"The third tip saved me the most money, but first..."
"Wait until you see how it looks at the end."
"Most people get step two wrong."
\`\`\`

Close the loop by delivering the promised answer; leaving it open frustrates viewers.

### Structure with steps

Numbered structures help retention because viewers know where they are and how much remains: "3 ways to...", "Step 1, Step 2, Step 3". Show the number on screen as each point starts. Viewers who want the final step keep watching.

### Captions and visual focus

Captions keep sound-off viewers engaged, and highlighting key words guides attention. Keep the main subject and captions in the centre of the safe zone, so the viewer's eye does not have to search.

### Loops and rewatches

Some short videos are edited to loop seamlessly: the last frame flows naturally into the first, so viewers watch again without noticing where it restarts. Loops work well for satisfying processes, visual transformations and short jokes. Rewatches can count as additional watch time on many platforms.

### Endings that do not leak viewers

Many videos lose viewers at the end, when they sense the content is over. Keep the ending tight: deliver the payoff, give a quick call to action, and stop. Long outros, repeated goodbyes and slow fades invite viewers to swipe before the video finishes.

### Balance energy with clarity

Retention editing can be overdone: constant zooms, sound effects on every word and flashing text become exhausting, and some audiences, such as professional or older viewers, find it off-putting. Match the intensity to the audience and brand. A law firm's educational short needs clarity and a steady pace; a gaming creator's clip can be much more energetic.

### Use the data

Chapter 11 explains retention graphs. They show exactly where viewers leave. When you see a drop, go to that moment in the edit and ask what caused it: a slow section, a confusing point or a promise already fulfilled. Retention editing improves most quickly when guided by real viewer behaviour.
      `,
        [
          q('What is a pattern interrupt?', [
            'An error that stops the video from playing',
            'A long pause for dramatic effect',
            'A visual or audio change that re-engages attention',
            'A transition to black between scenes',
          ], 2, 'Changes like punch-ins, b-roll or text refresh the viewer\'s attention before it drifts.'),
          q('What is an open loop?', [
            'A video that restarts automatically',
            'A question raised early and answered later in the video',
            'A transition that repeats the same clip',
            'A soundtrack that plays on repeat',
          ], 1, 'Open loops create anticipation that keeps viewers watching until the answer arrives.'),
          q('Why can heavy retention editing backfire?', [
            'Constant effects can exhaust or put off some audiences',
            'Platforms ban videos with many cuts',
            'It always increases the file size too much',
            'Captions stop working with many cuts',
          ], 0, 'Intensity should suit the audience and brand; too much stimulation drives some viewers away.'),
        ]
      ),
      lesson('TikTok, Reels and YouTube Shorts Compared', 13, `
TikTok, Instagram Reels and YouTube Shorts all show vertical short videos, and many creators post the same video on all three. But the platforms differ in audience, culture and features, and a little adaptation often improves results. Platform rules and features change frequently, so check current details in each app.

### Similarities

All three:

- Use vertical 9:16 video at 1080 by 1920 as the standard.
- Recommend videos to people who do not follow the creator, based on how viewers respond.
- Reward videos that people watch fully, rewatch, share and comment on.
- Have interface elements covering parts of the screen, requiring safe zones.
- Offer built-in music libraries for personal use, with restrictions for business accounts.

### Differences

| | TikTok | Instagram Reels | YouTube Shorts |
|---|---|---|---|
| Culture | Trends, sounds, humour, community | Lifestyle, visual polish, brands, creators' existing followers | Search and channel growth, links to long-form content |
| Discovery | Strongly driven by the For You feed | Reels tab, Explore and followers' feeds | Shorts feed, plus YouTube search and channel pages |
| Strength for business | Reaching new audiences quickly | Connecting with existing followers and local customers | Building a channel with long-lasting discoverability |
| Links to longer content | Limited | Profile and Stories | Shorts can link to related long videos on the channel |

Maximum lengths have increased over time on all three platforms, with longer uploads now possible, but the most effective short-form videos are usually far shorter than the maximum.

### Remove other platforms' watermarks

Downloading a TikTok and reposting it to Reels with the TikTok watermark is a common mistake. Platforms have said they favour original content, and watermarked reposts may be shown to fewer people. Always export a clean version from your editor for each platform.

### Adapting for each platform

A practical approach many editors use:

\`\`\`text
Master edit:  9:16, clean export without watermarks or platform text
TikTok:       add trending sound only if it suits; native text styles optional
Reels:        choose a strong cover frame; check the grid crop
Shorts:       title with searchable words; link to a related long video
\`\`\`

The core edit stays the same; small adjustments respect each platform's culture.

### Covers and grids

Instagram shows Reels in profile grids with a cropped preview, and YouTube and TikTok also show cover frames on profiles. Choose or design a cover frame with the subject centred and short text, so profiles look tidy and the video is clear at a glance. Chapter 11 covers covers and thumbnails in more detail.

### Posting and consistency

Regular posting generally helps creators and brands learn faster, because each video provides new feedback. For clients, a realistic, consistent schedule, such as three Reels a week, usually beats bursts of daily posting followed by silence. As an editor, agreeing a steady schedule also makes your workload predictable.

### Business accounts and music

Business and brand accounts often have access only to commercial-use music libraries on these platforms. That is another reason to use properly licensed music, as chapter 7 explained, and to avoid building brand edits around trending songs that the client cannot legally use.
      `,
        [
          q('What do TikTok, Reels and Shorts have in common?', [
            'Identical audiences and culture',
            'No restrictions on music for businesses',
            'No interface elements over the video',
            'Vertical 9:16 video and recommendations based on viewer response',
          ], 3, 'All three show vertical video and recommend content based on how viewers engage with it.'),
          q('Why avoid reposting a TikTok to Reels with its watermark?', [
            'Watermarks lower the resolution to 480p',
            'Platforms favour original content and may limit reach of watermarked reposts',
            'Instagram cannot play TikTok files',
            'Watermarks remove the audio',
          ], 1, 'Clean, original exports perform better, since platforms may show watermarked reposts to fewer people.'),
          q('Which platform\'s shorts can link viewers to a related long video on the channel?', [
            'TikTok',
            'Instagram Reels',
            'YouTube Shorts',
            'Facebook Stories',
          ], 2, 'YouTube Shorts can point viewers to related long-form videos, supporting channel growth.'),
        ]
      ),
      lesson('Repurposing Long Videos Into Shorts', 13, `
Many creators and businesses already have long content: podcasts, webinars, interviews, YouTube videos, event recordings. Repurposing turns one long video into many shorts, multiplying its reach without new filming. It is also one of the most requested services from freelance editors.

### Finding the best moments

Not every part of a long video works as a short. Look for moments that stand alone:

| Strong candidate | Why it works |
|---|---|
| A clear, surprising opinion | Creates a natural hook |
| A short story with a punchline or lesson | Complete in under a minute |
| A practical tip or step-by-step answer | Delivers value quickly |
| An emotional or funny moment | Easy to share |
| A strong answer to a common question | Searchable and useful |

Weak candidates are moments that depend on earlier context ("as I said before...") or that take several minutes to reach the point.

### Using transcripts to find clips

Reading is faster than watching. Generate a transcript, using the transcription features in Premiere Pro, DaVinci Resolve Studio or other tools, and scan it for strong lines. Highlight candidate sections, note their timecodes, and then watch only those sections. Some AI tools suggest clips automatically; treat their suggestions as a starting list, since they often miss context or choose weak moments.

### Reframing for vertical

Long videos are usually 16:9. For vertical shorts:

\`\`\`text
1. Create a 1080 x 1920 sequence or timeline.
2. Place the horizontal clip and scale it up to fill the height.
3. Reposition so the speaker's face stays in the safe area.
4. For two-person podcasts, cut between speakers, or stack them top and bottom.
5. Use auto reframe tools where available, then check every shot.
\`\`\`

Filming the original in 4K makes vertical crops much sharper.

### Rebuild the edit for short-form

A repurposed clip is not just a cut-out section. Treat it as a new edit:

- Start with the strongest line as the hook, even if it came later in the answer.
- Tighten pauses and filler words far more than in the long version.
- Add captions, on-screen text and b-roll for pattern interrupts.
- End cleanly on the payoff, with a call to watch the full episode if appropriate.

### A repurposing workflow for clients

\`\`\`text
Input:   one 60-minute podcast episode
Output:  6 to 10 vertical shorts, 20 to 60 seconds each
Steps:   transcript -> shortlist 15 moments -> client picks 8 ->
         edit, caption, brand -> export clean per platform -> schedule
\`\`\`

Agree the number of clips, style, captions and turnaround time up front. Many freelancers price repurposing per clip or as a monthly package, which chapter 12 covers.

### Keep a consistent series look

For a podcast or show, use the same caption style, colours, fonts and layout on every clip, and perhaps a small show logo. Viewers begin to recognise the series in their feeds, which builds the brand and makes each new clip easier to produce from your templates.

### Respect rights and permissions

If the long video includes guests, music or clips from other sources, check that the client has permission to reuse them in shorts. A guest who agreed to a podcast may also need to agree to being featured in promotional clips; most will, but asking avoids problems later.
      `,
        [
          q('Which moment makes a strong candidate for a short?', [
            'A section starting with "as I said before..."',
            'A five-minute explanation that builds slowly',
            'The introduction where the host welcomes listeners',
            'A complete story with a clear lesson under a minute',
          ], 3, 'Standalone moments with a clear point work as shorts without needing the rest of the video.'),
          q('Why use a transcript when repurposing?', [
            'Scanning text finds strong lines faster than watching everything',
            'Platforms require transcripts for shorts',
            'Transcripts improve the video quality',
            'It removes the need for captions',
          ], 0, 'Reading a transcript quickly reveals quotable moments, which can then be reviewed in the video.'),
          q('How should a repurposed clip be treated in the edit?', [
            'Exported exactly as it appears in the long video',
            'Slowed down to match the original pace',
            'As a new edit with its own hook, tighter pacing and captions',
            'Only with the original horizontal framing',
          ], 2, 'Shorts need short-form editing: a strong opening, tight pacing and captions, not just a copied section.'),
        ]
      ),
      ],
      [
      q('A video starts with a 5-second logo and a greeting. What is the most effective change?', [
        'Add louder music under the greeting',
        'Cut straight to the hook in the first second',
        'Make the logo animation longer',
        'Add a fade-in from black',
      ], 1, 'Removing slow openings puts the hook first, giving viewers a reason to stay immediately.'),
      q('What does a retention graph help an editor do?', [
        'Choose export settings',
        'Select fonts for captions',
        'Find exactly where viewers leave and fix those moments',
        'Measure audio loudness',
      ], 2, 'Retention data shows drop-off points, guiding precise improvements to the edit.'),
      q('A brand wants to post the same video on TikTok, Reels and Shorts. What is the best practice?', [
        'Download from TikTok with its watermark and repost',
        'Post only on one platform',
        'Use different aspect ratios for each',
        'Export a clean master and adapt small details per platform',
      ], 3, 'A clean master avoids watermarks, and small platform-specific tweaks respect each audience.'),
      q('How can a two-person podcast be reframed for vertical shorts?', [
        'Cut between speakers or stack them top and bottom',
        'Leave the horizontal frame with black bars',
        'Show only the host throughout',
        'Rotate the video by 90 degrees',
      ], 0, 'Cutting between or stacking speakers keeps both visible and fills the vertical frame.'),
      ]
    ),
    chapter(
      'Exporting, Publishing and Analytics',
      'Export with settings that survive platform compression, design thumbnails and cover frames that earn clicks, prepare caption files, titles and descriptions, and use retention analytics to make every next video better.',
      [
      lesson('Export Settings for Every Platform', 13, `
All the care you put into an edit can be undone by poor export settings: blurry text, blocky shadows, out-of-sync audio or the wrong shape. Platforms recompress every upload, so the goal is to give them a clean, high-quality file in a format they handle well.

### The universal safe choice

For almost every online platform, these settings work reliably:

| Setting | Recommended |
|---|---|
| Container | MP4 |
| Video codec | H.264 (H.265 where supported and needed) |
| Resolution | Match your timeline, typically 1920 x 1080 or 1080 x 1920 |
| Frame rate | Same as the timeline, never converted at export |
| Bitrate | High enough for quality; see below |
| Audio | AAC, 48 kHz, stereo, around 320 kbps |

### Bitrate guidance

YouTube publishes recommended upload bitrates on its help pages. For 1080p at standard frame rates (24, 25 or 30 fps), its guidance has been around 8 Mbps, and higher for 50 or 60 fps and for 4K. Many editors export somewhat above the recommendation, because platforms recompress anyway and a cleaner source survives better.

For short-form platforms, a 1080 by 1920 export in the range of roughly 10 to 20 Mbps is a common, safe choice. Extremely high bitrates create large files and slow uploads without visible benefit after recompression.

### Presets in each editor

- **CapCut**: choose 1080p, match frame rate, and a recommended or higher bitrate setting.
- **Premiere Pro**: the Export mode offers presets for YouTube, TikTok, Instagram and more, or choose H.264 with a "Match Source" preset and adjust bitrate.
- **DaVinci Resolve**: the Deliver page offers YouTube, Vimeo, TikTok and other presets; set format to MP4 and codec to H.264 or H.265.

Presets are good starting points; always check the resolution, frame rate and bitrate before rendering.

### Exporting for 4K on YouTube

Some creators upload 1080p projects as 4K exports because YouTube tends to apply higher-quality compression to higher-resolution uploads. It increases file size and render time. For important long-form videos where quality matters, it can be worth testing; for most short-form work, 1080p is sufficient.

### Name and organise exports

Use the naming convention from chapter 2, including the platform and aspect ratio:

\`\`\`text
CrumbsBakery_Lunchbox_9x16_Reels_v04.mp4
CrumbsBakery_Lunchbox_9x16_TikTok_v04.mp4
CrumbsBakery_Lunchbox_16x9_YouTube_v04.mp4
\`\`\`

Keep final exports in \`05_Exports/Final\`, and drafts in \`05_Exports/Drafts\`.

### Draft exports for client review

For client feedback, export smaller files: 720p or 1080p at a moderate bitrate, sometimes with a small "DRAFT" watermark or timecode burned in so the client can reference exact moments. Final, clean versions are sent after approval and payment according to your agreement.

### Quality check every export

Before delivering, watch the exported file, not the timeline:

\`\`\`text
[ ] Correct aspect ratio and resolution
[ ] No black frames at the start or end
[ ] Audio in sync throughout, especially near the end
[ ] Text sharp and readable on a phone
[ ] No missing media, offline frames or watermarks
[ ] Loudness consistent with chapter 7 targets
[ ] Captions correct, with no typos
\`\`\`

This two-minute check prevents the most embarrassing mistakes, such as a missing clip replaced by a red "media offline" frame in a client's advert.

### Upload directly when possible

Sending files through messaging apps often recompresses them heavily before they reach the platform or client. Share finals through cloud storage links or upload directly from your computer to the platform to preserve quality.
      `,
        [
          q('What is the safest general export format for online platforms?', [
            'MP4 with H.264 video and AAC audio',
            'Uncompressed AVI with PCM audio',
            'ProRes 4444 in a MOV container',
            'A GIF animation',
          ], 0, 'MP4 with H.264 and AAC is widely supported and balances quality with manageable file size.'),
          q('Why should the export frame rate match the timeline?', [
            'Platforms reject all other frame rates',
            'It reduces the audio bitrate',
            'Converting at export can cause stutter and sync issues',
            'It changes the aspect ratio',
          ], 2, 'Keeping the same frame rate avoids conversion artefacts like jerky motion and drifting audio.'),
          q('Why avoid sending final videos through messaging apps?', [
            'They remove the audio track',
            'They change the aspect ratio to square',
            'They add a watermark',
            'They often recompress files heavily, reducing quality',
          ], 3, 'Messaging apps compress media, so cloud links or direct uploads preserve the quality you exported.'),
        ]
      ),
      lesson('Thumbnails and Cover Frames', 13, `
For long-form YouTube videos, the thumbnail is often the biggest factor in whether someone clicks. For short-form, the cover frame shapes how profiles look and whether visitors explore more videos. Designing these well is part of the editor's job on many projects.

### What a thumbnail must do

A thumbnail competes with many others on a small screen. It needs to communicate the video's promise in a split second:

| Principle | How to apply it |
|---|---|
| One clear subject | A face, a product or a result; not a busy collage |
| Emotion | Expressive faces attract attention, but keep them genuine |
| Few words | Three to five large words at most, or none |
| High contrast | Bright subject against a simpler, contrasting background |
| Readable when tiny | Check at the size it appears on a phone |
| Consistency | A recognisable style across a channel's thumbnails |

### Title and thumbnail work together

The thumbnail and title should complement, not repeat, each other. If the title is "I Tried Every Biryani in Karachi", the thumbnail might show a close-up of a plate with the text "Winner?" The two together create curiosity; repeating the same words wastes space.

### Technical specifications

YouTube's recommended thumbnail size has been 1280 by 720 pixels, a 16:9 image, in JPG or PNG under the platform's file size limit. Custom thumbnails may require account verification. Check YouTube's help pages for the current requirements.

Design at the full size, but constantly preview at small sizes. Text that looks bold on a large monitor can become unreadable in the mobile feed.

### Creating thumbnails

- Take a still from your footage, ideally a sharp, expressive frame, or shoot a dedicated photo during filming.
- Use a design tool such as Photoshop, Canva or Photopea to remove or simplify the background, add text and adjust colour.
- Keep brand colours and fonts consistent with the video's graphics.

Avoid adding YouTube's own interface elements, such as fake play buttons or progress bars, and avoid misleading images, which can break platform policies and damage trust.

### Cover frames for short-form

On Reels, TikTok and Shorts, a cover frame appears on your profile grid:

\`\`\`text
Good cover frame:
- Subject centred, since profile grids crop the edges
- A short title in large text, inside the central area
- Consistent style so the grid looks organised
\`\`\`

Instagram shows Reels in the profile grid with a cropped preview, so check how your cover looks both full screen and cropped. You can select a frame from the video or upload a custom image in most apps.

### Test and learn

YouTube offers tools for testing different thumbnails and titles on some channels, showing which performs better. Even without formal testing, you can compare click-through rates across similar videos. If a strong video underperforms, a new thumbnail and title are often the quickest fix, and they can be changed after publishing.

### Honesty sells long-term

Clickbait thumbnails that promise something the video does not deliver may raise clicks briefly, but viewers leave early and learn to distrust the channel. The best thumbnails are intriguing and accurate: they show the real highlight of the video in its most appealing form.
      `,
        [
          q('What makes a thumbnail effective on a phone screen?', [
            'A busy collage of many images',
            'One clear subject, few large words and high contrast',
            'Long sentences explaining the video',
            'Small detailed text in the corners',
          ], 1, 'Thumbnails appear tiny, so a single clear subject with bold, minimal text reads instantly.'),
          q('How should the title and thumbnail relate?', [
            'They should use exactly the same words',
            'The thumbnail should contain the full title',
            'They should describe different videos',
            'They should complement each other to create curiosity',
          ], 3, 'Repeating text wastes space, while complementary title and image together build a stronger promise.'),
          q('Why keep the subject centred in a short-form cover frame?', [
            'Platforms reject off-centre covers',
            'Centred subjects export faster',
            'Profile grids crop the edges of the cover',
            'It improves the video\'s audio',
          ], 2, 'Grid previews crop the frame, so centred subjects and text stay visible on the profile.'),
        ]
      ),
      lesson('Caption Files, Titles and Descriptions', 13, `
Once the video is exported, the words around it help people find it and understand it: caption files, titles, descriptions and hashtags. On YouTube in particular, these elements affect search and suggested videos, making them part of a professional delivery.

### Burned-in captions versus caption files

| Type | What it is | Best for |
|---|---|---|
| Burned-in (open) captions | Text drawn into the video image | Short-form, where style and sound-off viewing matter |
| Caption files (closed captions) | A separate text file viewers can switch on or off | YouTube long-form, accessibility, multiple languages |

Many long-form YouTube videos have no burned-in captions but include a caption file. Short-form videos usually use burned-in captions, sometimes with a caption file as well.

### The SRT format

The most common caption file format is SRT, a simple text file:

\`\`\`text
1
00:00:01,000 --> 00:00:03,200
Lunch for 450 rupees that actually fills you up?

2
00:00:03,400 --> 00:00:06,000
We tested Crumbs Bakery's new lunch box.
\`\`\`

Each caption has a number, a start and end time, and the text. Premiere Pro and DaVinci Resolve can export captions as SRT from their caption tracks, and YouTube accepts SRT uploads. YouTube also generates automatic captions, but uploading corrected captions is more accurate, especially for names and mixed-language speech.

### Captions in more than one language

For audiences in Pakistan and abroad, offering captions in both English and Urdu can widen reach. YouTube allows multiple caption tracks per video. Translate carefully, preferably with a fluent speaker checking, since automatic translation often gets context wrong.

### Writing titles

Good titles are clear, specific and include words people search for:

| Weak title | Stronger title |
|---|---|
| "Vlog 23" | "Trying Karachi's Viral 450 Rupee Lunch Box" |
| "Editing tips" | "5 CapCut Tricks That Make Reels Look Professional" |
| "Our new product!!!" | "How We Make Our Chocolate Brownies Fresh Every Morning" |

Put the most important words near the start, since long titles are cut off on phones. Avoid misleading claims and excessive capital letters.

### Descriptions

On YouTube, the description helps viewers and search:

\`\`\`text
First 1 to 2 lines:  a clear summary with key search terms (shown before "more")
Then:               details, links, products mentioned, credits
Chapters:           timestamps like 00:00 Intro, 01:15 Taste test
Hashtags:           a few relevant ones
Music credits:      if the licence requires attribution
\`\`\`

Timestamps starting at 00:00 create chapters in the video player, helping viewers navigate long videos.

### Short-form captions and hashtags

On Instagram and TikTok, the post caption adds context and can include keywords people search for, since both platforms increasingly work as search engines. Use a few relevant hashtags rather than a long list of generic ones. Write the first line to be interesting on its own, because the rest is often hidden.

### Deliver a publishing pack

When delivering to clients, many editors include a small text file with suggested titles, descriptions, hashtags and the SRT caption file. It saves the client time, shows professionalism and makes it more likely the video is published well, which reflects on your work.
      `,
        [
          q('What is the difference between burned-in captions and caption files?', [
            'Burned-in captions are part of the image; caption files can be switched on or off',
            'Caption files are always more stylish',
            'Burned-in captions can be translated automatically by viewers',
            'There is no difference between them',
          ], 0, 'Open captions are drawn into the video, while closed caption files are separate and toggleable.'),
          q('What does each entry in an SRT file contain?', [
            'Only the caption text',
            'A font name and colour',
            'The video\'s resolution',
            'A number, start and end time, and the text',
          ], 3, 'SRT entries pair each numbered caption with timing and text, making them simple to create and edit.'),
          q('Why put the most important words near the start of a title?', [
            'Platforms only index the first word',
            'It changes the thumbnail automatically',
            'Long titles are cut off on phones',
            'It improves the video\'s audio',
          ], 2, 'Mobile displays truncate long titles, so key words at the start remain visible.'),
        ]
      ),
      lesson('Reading Retention Analytics and Improving', 13, `
Publishing is not the end of the process. Every video generates data about how people watched it, and that data is the most reliable guide to improving your editing. Editors who study analytics get better much faster than those who rely on guesswork.

### Key metrics

| Metric | What it tells you |
|---|---|
| Views | How many times the video was played |
| Impressions and click-through rate | How often the thumbnail was shown and how often people clicked (mainly long-form) |
| Average view duration | How long viewers watched on average |
| Average percentage viewed | The share of the video watched on average |
| Audience retention graph | How many viewers remained at each moment |
| Viewed versus swiped away | For shorts, how many chose to keep watching rather than swipe (YouTube Shorts) |
| Shares, saves, comments | How much viewers valued the content |

Each platform names and presents metrics slightly differently. YouTube Studio, Instagram Insights and TikTok Analytics all provide retention information in some form.

### Reading a retention graph

The retention graph shows the percentage of viewers still watching at each point:

\`\`\`text
100% |\\
     | \\___
     |     \\______          ___ spike: rewatched or skipped to
     |            \\____/\\__/   \\____
     |                              \\____ end
  0% +------------------------------------
     0s                               60s
\`\`\`

Patterns to look for:

- **A steep drop in the first seconds**: the hook did not work, or the opening did not match the thumbnail or title.
- **A gradual slope**: normal, but a gentler slope means better retention.
- **A sudden dip**: something at that moment made people leave, such as a slow section or confusing jump.
- **A spike**: viewers rewatched or skipped to this part, suggesting something especially interesting.
- **A drop before the end**: viewers sensed the video was finishing; the ending may be too long.

### From data to editing decisions

| Observation | Editing response next time |
|---|---|
| Heavy drop at 0 to 3 seconds | Stronger hook, remove intro, better first frame |
| Dip at a long explanation | Tighten it, add b-roll or split it into steps |
| Spike at a reveal | Move a teaser of the reveal to the start |
| Drop at the call to action | Shorten it or place it earlier |

Compare videos with each other rather than obsessing over one. Patterns across several videos are more reliable than a single result.

### Other factors beyond editing

Performance also depends on topic, timing, audience interest, trends and the creator's existing following. A great edit of a topic nobody cares about may still get few views. Analytics help separate editing problems, such as a weak hook, from content or strategy problems, such as an uninteresting topic.

### Share insights with clients

Clients value editors who help their content improve, not just editors who deliver files. A short monthly summary showing which videos performed best, where viewers dropped off and what you recommend next makes you a partner rather than a supplier, and partners keep their clients for years.

### Build your own knowledge base

Keep notes of what worked: hooks that performed well, lengths that suited the audience, styles that viewers responded to. Over time, this becomes your personal playbook, and it is one of the most valuable things you can bring to each new client.
      `,
        [
          q('A retention graph shows a steep drop in the first three seconds. What is the likely problem?', [
            'The ending is too long',
            'The export bitrate was too low',
            'The hook or opening did not hold attention',
            'The captions were too large',
          ], 2, 'Early drop-off points to the opening, so the hook, first frame or promise needs improving.'),
          q('What does a spike in a retention graph suggest?', [
            'Many viewers left the video at that moment',
            'The audio was too loud for most listeners',
            'The video was accidentally uploaded twice',
            'Viewers rewatched or skipped to that part',
          ], 3, 'Spikes indicate moments viewers returned to, which can be used as teasers or hooks.'),
          q('Why share analytics insights with clients?', [
            'It positions you as a partner who improves their results',
            'Clients are required to receive monthly reports',
            'It replaces the need to edit videos',
            'Platforms reward editors who send reports',
          ], 0, 'Helping clients understand performance and improve content builds long-term, valuable relationships.'),
        ]
      ),
      ],
      [
      q('What is a typical safe export resolution for a Reel?', [
        '1280 x 720 landscape',
        '3840 x 2160 landscape',
        '640 x 480',
        '1080 x 1920 vertical',
      ], 3, 'Reels and other short-form platforms use vertical 9:16 video at 1080 by 1920.'),
      q('Which is a sign of a misleading thumbnail?', [
        'It shows the real highlight of the video',
        'It uses bold, readable text',
        'It promises something the video does not deliver',
        'It matches the channel\'s style',
      ], 2, 'Thumbnails should be intriguing and accurate; misleading ones cause early exits and damage trust.'),
      q('What does YouTube create from timestamps like 00:00 Intro in a description?', [
        'Automatic captions',
        'A custom thumbnail',
        'Chapters in the video player',
        'A playlist',
      ], 2, 'Timestamps beginning at 00:00 create chapters that help viewers navigate the video.'),
      q('A video has a sharp dip during a long explanation. What should the next edit try?', [
        'Tightening the explanation and adding b-roll or steps',
        'Making the explanation longer',
        'Removing captions',
        'Lowering the export resolution',
      ], 0, 'Dips show where interest fell, so shortening and adding visual variety addresses the cause.'),
      ]
    ),
    chapter(
      'Earning as a Video Editor',
      'Build a showreel and portfolio that win work, price editing jobs by video, package or retainer, run client briefs, feedback rounds and revisions smoothly, and grow from solo editor to a small video business.',
      [
      lesson('Building a Showreel and Portfolio', 13, `
Clients hire editors by watching their work. A strong showreel and a focused portfolio do more for your income than any certificate. The goal is simple: show clients, within seconds, that you can make the kind of videos they need.

### Showreel versus portfolio

| | Showreel | Portfolio |
|---|---|---|
| What it is | A short montage of your best moments | A collection of complete videos |
| Length | Around 30 to 90 seconds | Several full pieces |
| Purpose | Grab attention and show range and quality | Prove you can finish whole projects well |
| Where it goes | Top of your profile, LinkedIn, website | Portfolio section, Drive or Behance, platform portfolios |

Most clients watch the showreel first, then open one or two full pieces that match their needs.

### A showreel that works

- Open with your strongest five seconds: a hook, just like chapter 10 taught.
- Keep it short; quality beats quantity. Cut anything that is only average.
- Match the music and pacing to your style, whether energetic short-form or cinematic.
- Show variety within your niche: captions, colour, motion graphics, sound design.
- End with your name, specialty and contact or profile link.

For short-form specialists, a vertical showreel is often more convincing than a horizontal one, because it shows exactly what clients will receive.

### Choose a niche

Clients prefer specialists. "Video editor" is broad; "short-form editor for restaurants and cafés" or "podcast repurposing editor" is memorable and easier to hire. Common niches include:

\`\`\`text
- Short-form for food, fashion or real estate brands
- YouTube long-form for educational creators
- Podcast clips and repurposing
- Corporate and event highlight videos
- Wedding and event highlights (very popular locally)
- Course and tutorial editing
\`\`\`

You can take other work too, but lead with one niche in your showreel and profiles.

### Getting portfolio pieces without clients

- **Re-edit practice footage**: some creators and sites share raw footage for practice; check the terms before sharing your result publicly.
- **Create your own content**: film and edit short videos for a local café, a friend's business or your own channel.
- **Spec edits with permission**: offer to edit a sample for a small business in exchange for permission to show it.
- **Before-and-after comparisons**: show raw footage beside your edit, which demonstrates your contribution clearly.

Always be honest about what is personal or practice work, as the freelancing principles of honesty apply here too.

### Present context, not just videos

Under each portfolio piece, write two or three lines: the goal, what you did, and a result if available. For example: "Reel for a Lahore clothing brand's Eid launch. Edited from 40 minutes of footage, added captions and colour. Became the brand's most-viewed Reel that month, according to the owner." Context turns a nice video into evidence of business value.

### Keep it fresh

Update your showreel every few months as your skills improve. Remove older work that no longer represents your best. A current, focused reel signals that you are active and improving, which clients notice.
      `,
        [
          q('What is the main purpose of a showreel?', [
            'To show every project you have ever edited',
            'To grab attention and show your best quality quickly',
            'To replace your portfolio completely',
            'To display your editing software licences',
          ], 1, 'A short showreel of your best moments convinces clients to look further at complete projects.'),
          q('Why choose a niche as a video editor?', [
            'Platforms only allow one type of video per editor',
            'Niches remove the need for a portfolio',
            'Clients prefer specialists and find them easier to hire',
            'It makes editing software cheaper',
          ], 2, 'A clear specialty makes you memorable and matches clients looking for specific expertise.'),
          q('What should accompany each portfolio video?', [
            'Only the file name',
            'The raw footage in full',
            'A list of every effect used',
            'A short note on the goal, what you did and any result',
          ], 3, 'Context shows the business value of your work, not only how it looks.'),
        ]
      ),
      lesson('Pricing Video Editing Work', 13, `
Pricing is one of the hardest questions for new editors. Charge too little and you work endlessly for little money; charge unclearly and projects grow while payment stays the same. Clear pricing models, based on how long work really takes, solve most problems.

### Common pricing models

| Model | How it works | Best for |
|---|---|---|
| Per video | A fixed price for each finished video | Short-form content, clear deliverables |
| Per finished minute | Price based on the final video's length | Long-form YouTube, corporate videos |
| Hourly | Paid for time spent | Unclear projects, fixes, consulting |
| Monthly package or retainer | A set number of videos per month for a fixed fee | Ongoing clients, social media content |
| Per clip (repurposing) | A price per short made from long content | Podcasts, webinars |

Per-minute pricing needs care: a 10-minute video with heavy graphics can take much longer than a 10-minute talking head. Adjust for complexity.

### Know your time

Before pricing, track how long your typical projects actually take, including every stage:

\`\`\`text
Example: one 45-second branded Reel
Reviewing footage and brief        30 min
Rough cut                          60 min
Captions and graphics              45 min
Sound and music                    30 min
Colour                             20 min
Export and upload                  15 min
Client revisions (one round)       40 min
Total                              about 4 hours
\`\`\`

Beginners often estimate only the cutting time and forget everything else. Your price must cover the whole process.

### Build a price from your time

Use the minimum rate approach from freelancing: calculate what you need per hour to cover your living costs, equipment, software subscriptions, electricity backup and taxes, then multiply by realistic hours. If the Reel above takes four hours and your minimum rate is PKR 1,500 per hour, the minimum price is PKR 6,000 per Reel. Market rates vary widely, so compare your number with what similar editors charge, and set your price accordingly, never below your minimum.

### Define what is included

A price means nothing without a scope. Write it clearly:

| Included | Not included unless agreed |
|---|---|
| Editing up to 60 seconds | Filming or scriptwriting |
| Captions in English | Additional languages |
| Licensed music from my library | Premium tracks the client requests |
| Colour correction | Complex motion graphics or VFX |
| Two rounds of revisions | Extra revision rounds |
| 1080p exports for two platforms | Additional formats |
| Delivery within three working days | Rush delivery within 24 hours |

Extras like rush delivery, extra revisions and additional formats become add-ons with their own prices.

### Packages for social media clients

Many clients prefer predictable monthly costs:

\`\`\`text
Starter:  8 Reels per month, captions, 2 revision rounds each
Growth:   12 Reels + 2 YouTube Shorts from long content
Premium:  20 short videos + monthly performance summary
\`\`\`

Monthly packages give you stable income and give the client consistent content. Request payment at the start of each month, or through funded platform milestones, so you are never editing unpaid work.

### Raise rates as your skills grow

As your speed, quality and results improve, raise prices, starting with new clients. A faster editor charging the same per video already earns more per hour; raising prices when your results justify it grows your income further.
      `,
        [
          q('Why can per-minute pricing be risky?', [
            'Complex videos can take much longer than simple ones of the same length',
            'Clients never accept per-minute pricing',
            'It is not allowed on freelance platforms',
            'Short videos cannot be priced per minute',
          ], 0, 'Complexity varies greatly, so per-minute rates need adjusting for graphics, effects and footage volume.'),
          q('What do beginners often forget when estimating editing time?', [
            'The time spent cutting the clips together',
            'The resolution of the final export file',
            'The time needed to learn the client\'s name',
            'Every stage beyond the cutting itself',
          ], 3, 'The whole process takes far longer than cutting alone, so every stage must be counted in the price.'),
          q('What is a benefit of monthly packages for social media clients?', [
            'They remove the need to define a scope',
            'They allow unlimited revisions',
            'Stable income for you and consistent content for the client',
            'They mean you never have to raise prices',
          ], 2, 'Packages create predictable income and a reliable content flow, benefiting both editor and client.'),
        ]
      ),
      lesson('Client Briefs, Feedback and Revisions', 13, `
Most frustrations in client video work come from unclear expectations: the client imagined one style, the editor delivered another, and revision rounds multiply. A clear brief at the start and a structured feedback process prevent almost all of these problems.

### A video brief template

Before editing, collect the answers to these questions, in writing:

\`\`\`text
Goal:           What should this video achieve?
Audience:       Who is it for?
Platform:       Where will it be posted? (Aspect ratio follows)
Length:         Target duration
Style:          2 or 3 reference videos the client likes, and why
Must include:   Key messages, products, logo, contact details
Must avoid:     Anything the brand does not want
Captions:       Language, style
Music:          Mood, and who provides or licenses it
Deadline:       Draft and final dates
Approver:       Who gives final approval?
\`\`\`

Reference videos are especially valuable. "Energetic" means different things to different people; a link to an example removes the guesswork.

### Share a draft early

For new clients or unusual projects, share a short rough cut or the first 15 seconds early. It confirms the style and pacing before you polish the whole video. Discovering a mismatch after five hours of work is far more costly than after one.

### Collecting feedback with timecodes

Vague feedback such as "make it better" or "something feels off" is hard to act on. Ask clients to give timecoded comments:

| Vague | Actionable |
|---|---|
| "The middle is slow" | "0:18 to 0:25 feels slow, can we shorten it?" |
| "Change the text" | "0:04 caption: change 'Rs 450' to 'PKR 450'" |
| "Music is wrong" | "Music feels too dramatic; something lighter and cheerful" |

Review tools such as Frame.io let clients click on a frame and leave comments at the exact moment. Simpler options include sharing a draft on a cloud drive and asking for a list with timecodes, or burning a timecode into draft exports, as chapter 11 suggested.

### Managing revision rounds

Define in your agreement how many revision rounds are included, and what counts as one:

- One round is a single list of changes, sent together, not a stream of messages over several days.
- Revisions change the agreed edit; new footage, new concepts or a new video are additional work.
- Consolidate feedback from all decision-makers before sending it to you, to avoid conflicting requests.

When a client requests changes beyond the agreed rounds, reply politely with the price for an additional round, as with any scope change.

### Handling difficult feedback

Sometimes a client asks for something you believe hurts the video, such as a long logo intro. Explain briefly why, perhaps showing retention data or examples, and offer an alternative. If they still prefer their version, deliver it professionally; it is their brand. Keep your own preferred version for your portfolio, where appropriate and permitted.

### Final delivery

Deliver the final files with clear names, a publishing pack of titles, captions and hashtags if agreed, and a short note. Confirm what you will keep and for how long, such as project files for three months, so the client knows whether future changes are possible. A smooth handover often turns a one-off project into a regular client.
      `,
        [
          q('Why ask clients for reference videos in the brief?', [
            'To copy them exactly',
            'They make style words like "energetic" concrete and remove guesswork',
            'Platforms require references for every upload',
            'To avoid writing a brief',
          ], 1, 'Examples show what the client means by style and pacing far more clearly than descriptions.'),
          q('What makes feedback actionable?', [
            'General comments like "make it better"',
            'Feedback spread over many days in separate messages',
            'Requests from people who are not approvers',
            'Specific, timecoded comments about exact moments',
          ], 3, 'Timecoded, specific notes show exactly what to change and where, saving time on both sides.'),
          q('What counts as one revision round?', [
            'One consolidated list of changes sent together',
            'Each individual message the client sends',
            'Every change of mind during a phone call',
            'A request for a completely new video',
          ], 0, 'Defining a round as one consolidated list keeps revisions manageable and fairly priced.'),
        ]
      ),
      lesson('Growing a Video Editing Business', 12, `
Many editors start alone, editing a few videos a week. With good systems and reliable clients, that can grow into a small video business: steady retainers, a team of editors, and services that go beyond editing. Growth is not required, but understanding the path helps you choose deliberately.

### Systems before growth

Before taking on more work, make your own process efficient:

| System | Benefit |
|---|---|
| Project folder templates | Every project starts organised |
| Editor templates and presets | Captions, lower thirds and looks ready instantly |
| Client brand kits | On-brand videos without searching for assets |
| Checklists for each video type | Consistent quality, fewer mistakes |
| A delivery and invoicing routine | Faster payment, less admin |

These systems also become training material when you bring others in.

### Expanding services

Editors often grow by adding services that clients already need:

- **Content strategy**: suggesting topics, hooks and posting schedules.
- **Scriptwriting**: writing hooks and scripts for short-form content.
- **Filming**: shooting simple content for local clients, especially restaurants, shops and real estate.
- **Thumbnail and cover design**: often requested with YouTube editing.
- **Posting and scheduling**: uploading, writing captions and managing the calendar.

Each service increases the value of a client relationship and can turn a per-video client into a full monthly package.

### Working with other editors

When you have more work than time, bring in help carefully:

\`\`\`text
1. Start with a paid test edit using your templates and brief.
2. Give clear instructions: style references, checklists, deadlines.
3. Review everything before it reaches the client.
4. Share project files through organised cloud folders.
5. Pay reliably and on time.
\`\`\`

You remain responsible to the client for quality and deadlines. Tools such as shared cloud drives, Frame.io and team features in editing software make remote collaboration practical, whether your team is in the same city or across Pakistan.

### Protecting the business

- Use contracts or clear written agreements for every client.
- Back up client projects following the 3-2-1 rule from chapter 2.
- Keep licences for music, fonts and templates organised.
- Respect client confidentiality, especially for unreleased products and campaigns.
- Keep reliable power and internet backup, since deadlines do not move for load-shedding.

### Keep learning

Video trends and tools change quickly. New AI features for captions, clipping, audio clean-up and reframing appear constantly. Learn them, because they save time, but remember that clients pay for judgement: choosing the right moments, the right pace and the right story. Those skills, built through the chapters of this course, remain the core of an editor's value.

### Choose your path

Some editors love editing and choose to stay solo, focusing on premium clients and craft. Others enjoy managing and build agencies. Both are valid. Decide based on what you enjoy, then build systems and relationships that support that choice.
      `,
        [
          q('Why build systems before taking on more work?', [
            'Systems are required by freelance platforms',
            'They remove the need to review work',
            'They make you efficient and become training material for helpers',
            'They guarantee more clients',
          ], 2, 'Templates, kits and checklists raise efficiency and quality, and help others work the same way.'),
          q('When you subcontract an edit, who is responsible to the client?', [
            'The subcontractor alone',
            'The editing software company',
            'Nobody, once the work is shared',
            'You, so you review everything before delivery',
          ], 3, 'The client hired you, so quality and deadlines remain your responsibility.'),
          q('What do clients ultimately pay editors for, even as AI tools improve?', [
            'Knowing every software shortcut',
            'Owning the most expensive computer',
            'Judgement about moments, pacing and story',
            'Using the newest AI features',
          ], 2, 'Tools speed up tasks, but choosing what to show and how to tell the story is the editor\'s core value.'),
        ]
      ),
      ],
      [
      q('Which showreel opening is strongest?', [
        'A slow fade-in with the editor\'s logo',
        'A list of software the editor uses',
        'The editor\'s best five seconds of work',
        'A long introduction about the editor\'s background',
      ], 2, 'Showreels follow the same hook principle as short-form videos: lead with the strongest moment.'),
      q('A 45-second Reel takes four hours and your minimum rate is PKR 1,500 per hour. What is your minimum price?', [
        'PKR 1,500',
        'PKR 3,000',
        'PKR 6,000',
        'PKR 45,000',
      ], 2, 'Four hours at PKR 1,500 per hour gives a minimum of PKR 6,000 to cover the full process.'),
      q('What is the best way to avoid endless revision rounds?', [
        'Refuse all feedback after the first draft',
        'Agree the rounds and ask for timecoded notes',
        'Deliver the final without showing any drafts',
        'Accept every requested change for free',
      ], 1, 'Clear limits and structured feedback keep revisions focused and fairly compensated.'),
      q('Which added service can turn a per-video client into a monthly package?', [
        'Content strategy, scripting or posting management',
        'Deleting project files after delivery',
        'Charging only per hour',
        'Removing captions from videos',
      ], 0, 'Additional services clients already need increase the value of the relationship and support monthly packages.'),
      ]
    ),
  ],
  final: [
    q('What should an editor get right before adding effects, colour and polish?', [
      'The thumbnail design',
      'The export bitrate',
      'The structure and story',
      'The font licence',
    ], 2, 'No amount of polish rescues a weak structure, so the story must work first.'),
    q('Why is 25 or 50 fps often chosen when filming under lights in Pakistan?', [
      'It avoids flicker from 50 Hz mains lighting',
      'Phones in Pakistan cannot record 30 fps',
      'Platforms reject 30 fps uploads',
      'It doubles the video resolution',
    ], 0, 'Lights on 50 Hz mains flicker in step with 25 and 50 fps, preventing visible flicker.'),
    q('What is the difference between a container and a codec?', [
      'They are the same thing',
      'The codec is the file extension',
      'Containers only hold audio',
      'The container wraps streams; the codec compresses the video',
    ], 3, 'MP4 or MOV are containers, while H.264 or ProRes are codecs describing the compression.'),
    q('What is the most important rule for recording clear speech?', [
      'Record at the maximum level',
      'Keep the microphone close to the speaker',
      'Use the phone\'s built-in microphone',
      'Record in an empty room with hard walls',
    ], 1, 'A close microphone captures the voice strongly relative to echo and background noise.'),
    q('What does the 3-2-1 backup rule recommend?', [
      'Three exports, two drafts and one final',
      'Three copies, two storage types, one off-site',
      'Three editors reviewing two versions once',
      'Three folders, two bins, one timeline',
    ], 1, 'Multiple copies across different media and locations protect footage from loss.'),
    q('Why must auto captions always be proofread?', [
      'Platforms reject unedited captions',
      'Captions change the video\'s colour',
      'Auto captions are always in the wrong language',
      'They make mistakes with names, terms and accents',
    ], 3, 'Automatic transcription errors look careless, so every caption should be checked.'),
    q('Which Premiere Pro tool trims a clip and closes the gap automatically?', [
      'Ripple Edit',
      'Slip',
      'Rate Stretch',
      'Type',
    ], 0, 'Ripple Edit adjusts the clip and shifts later clips so no gap remains.'),
    q('What is the purpose of proxy media?', [
      'Final delivery to social platforms',
      'Backing up the project database',
      'Smooth editing with lightweight copies of heavy footage',
      'Adding motion blur to graphics',
    ], 2, 'Proxies play smoothly while editing, and exports use the full-quality originals.'),
    q('In an L-cut, what happens?', [
      'The next shot\'s audio starts before its picture',
      'The video fades to black',
      'Two cameras play side by side',
      'The current audio continues after the picture changes',
    ], 3, 'An L-cut lets audio carry over into the next shot, a natural way to use b-roll and reactions.'),
    q('What do professional editors use for most transitions?', [
      'Spin effects',
      'Straight cuts',
      'Glitch transitions',
      'Dip to white',
    ], 1, 'Plain cuts keep focus on the content, so they make up most professional edits.'),
    q('What is a sensible order for processing dialogue?', [
      'Noise reduction, EQ, compression, limiter',
      'Limiter, EQ, noise reduction, compression',
      'Compression, noise reduction, limiter, EQ',
      'EQ, limiter, compression, noise reduction',
    ], 0, 'Removing noise first prevents compression from raising it, and the limiter catches final peaks.'),
    q('What is a common loudness target for YouTube and social video?', [
      '0 LUFS',
      'Around -40 LUFS',
      'Around -14 LUFS',
      'Around +6 LUFS',
    ], 2, 'Around -14 LUFS matches common platform normalisation and sounds consistent.'),
    q('A client wants a popular film song in their paid advert. What is correct?', [
      'Ten seconds of any song is always allowed',
      'Crediting the artist makes it legal',
      'A commercial licence is needed; suggest licensed alternatives',
      'Songs found on YouTube are free to use',
    ], 2, 'Commercial use of copyrighted music requires permission, so licensed tracks protect the client.'),
    q('Why should correction come before creative grading?', [
      'Grading cannot be applied to corrected footage',
      'Correction exports faster',
      'Platforms require corrected footage',
      'A consistent base makes the look behave the same on every shot',
    ], 3, 'Correcting first means the creative grade produces consistent results across shots.'),
    q('Where do skin tones of all complexions tend to fall on a vectorscope?', [
      'At the very centre of the circle',
      'Near the skin tone line between red and yellow',
      'Towards the green edge',
      'Towards the blue edge',
    ], 1, 'Skin shares a similar hue regardless of brightness, so faces sit near the skin tone line.'),
    q('Which easing makes text settle naturally as it arrives on screen?', [
      'Ease out',
      'Linear',
      'Ease in',
      'No keyframes at all',
    ], 0, 'Ease out starts fast and slows into place, like a real object coming to rest.'),
    q('What should the first three seconds of a short-form video contain?', [
      'A logo animation and a greeting',
      'Silence before the speaker begins',
      'A slow fade-in from black',
      'A clear hook in visuals, text and audio',
    ], 3, 'Viewers decide almost instantly, so the hook must start immediately across picture, text and sound.'),
    q('Why export clean versions instead of reposting with another platform\'s watermark?', [
      'Platforms favour original content and may limit watermarked reposts',
      'Watermarks double the file size',
      'Watermarked videos have no audio',
      'Platforms cannot play other apps\' files',
    ], 0, 'Clean, original uploads avoid reduced reach that watermarked reposts can suffer.'),
    q('A retention graph drops steeply in the first seconds. What should change next time?', [
      'The ending',
      'The hook and opening',
      'The export bitrate',
      'The music licence',
    ], 1, 'Early drop-off points directly to the opening, so the hook and first frame need work.'),
    q('What helps keep client revisions under control?', [
      'Refusing all feedback',
      'Unlimited free changes',
      'Agreed rounds with consolidated, timecoded feedback',
      'Skipping drafts entirely',
    ], 2, 'Clear limits and structured feedback keep revisions focused and fairly paid.'),
    q('Most of a project\'s footage was filmed at 25 fps, but the timeline was created at 30 fps and several clips stutter. What is the best fix?', [
      'Raise the export bitrate so the motion looks smoother',
      'Add a short cross dissolve between every pair of clips',
      'Set the timeline to 25 fps to match most of the footage',
      'Export the finished video at 60 fps instead of the original 30 fps',
    ], 2, 'The timeline should use the frame rate most of the footage uses; mixing 25 fps clips into a 30 fps timeline causes stutter that export settings cannot fix.'),
    q('You want a shot to play at 25% speed on a 25 fps timeline and look smooth without frame interpolation. What frame rate should you film it at?', [
      '50 fps',
      '100 fps',
      '60 fps',
      '30 fps',
    ], 1, 'At quarter speed a 25 fps timeline needs 4 × 25 = 100 real frames per second of footage, so every timeline frame shows a unique captured frame.'),
    q('Your laptop struggles to scrub long H.265 phone clips, so you convert them to ProRes before editing. What trade-off are you accepting?', [
      'Lower image quality in return for much smaller files saved to disk',
      'Losing the audio track in return for faster scrubbing',
      'A frame rate that can no longer be changed in the edit',
      'Much larger files in return for smoother playback while editing',
    ], 3, 'Editing codecs store each frame more completely, so they decode easily and play smoothly but take far more storage than delivery codecs like H.265.'),
    q('You are setting the recording level for a presenter. Where should normal speech peak?', [
      'Right at 0 dB, so the recording is as loud as it can be',
      'Around -40 dB, so that nothing could possibly ever clip',
      'Anywhere at all, since the level can be fixed in the edit',
      'Around -12 dB, with loud moments never reaching 0 dB',
    ], 3, 'Peaks around -12 dB leave headroom for laughs and shouts, while too high a level clips permanently and too low a level raises noise when boosted.'),
    q('You are filming an important talking-head video on a phone. Which camera usually gives the best result?', [
      'The front selfie camera, so you can watch your own framing',
      'The rear main camera, with someone or a mirror to check framing',
      'The ultra-wide lens, so that more of the whole room fits into the shot',
      'Whichever lens has the most digital zoom available on it',
    ], 1, 'The main rear lens typically has the best sensor and low-light performance, while the selfie camera is usually lower quality.'),
    q('In CapCut you want a clip to run fast, slow down right at the key moment, then speed up again. Which option does that?', [
      'Normal speed set to 0.5x throughout',
      'A speed curve that ramps the speed',
      'A freeze frame at the key moment',
      'Reverse applied to the middle section',
    ], 1, 'A speed curve varies speed across a single clip, which is how speed ramps are built; normal speed applies one fixed rate to the whole clip.'),
    q('In CapCut you want to remove a main-track clip\'s picture but keep its speech playing under different shots. What do you do first?', [
      'Mute the clip and record the speech again',
      'Add a freeze frame at the end of the clip',
      'Split the clip and reverse the second part',
      'Extract the audio onto its own track',
    ], 3, 'Separating the audio lets you cut the picture independently while the speech continues, which is the basis of J-cuts and L-cuts.'),
    q('In Premiere Pro you want to move a b-roll clip a little later while the clips on either side adjust to compensate, keeping the total length the same. Which tool?', [
      'Slip (Y)',
      'Rolling Edit (N)',
      'Slide (U)',
      'Ripple Edit (B)',
    ], 2, 'Slide moves a clip between its neighbours and trims them to fill, while Slip changes which part of a clip plays and Rolling Edit moves one cut point.'),
    q('In Premiere Pro you need a 25 fps clip at exactly 40% speed with the smoothest possible motion. What should you do?', [
      'Open Speed/Duration, type 40% and choose Optical Flow',
      'Drag the clip longer with the Slip tool until it looks right',
      'Nest the clip and set the nested sequence to 10 fps',
      'Duplicate the clip on a second track and set it to 40% opacity',
    ], 0, 'Speed/Duration sets an exact percentage, and Optical Flow interpolates new frames so slowed footage looks smoother than simple frame repetition.'),
    q('Premiere Pro has transcribed an hour-long interview. What is the fastest way to build the first rough cut?', [
      'Razor the clip every ten seconds and then review each piece in turn',
      'Delete unwanted words in the transcript, then refine the cuts',
      'Scrub the full hour with J, K and L before marking anything',
      'Nest the interview and trim the nested clip from its start',
    ], 1, 'Text-based editing removes the matching video when you delete words from the transcript, and trim tools then make the cuts feel natural.'),
    q('A client\'s night footage is very grainy and you need DaVinci Resolve\'s advanced noise reduction. What does that tell you?', [
      'It is a Studio feature, so consider buying Studio for this work',
      'Fusion includes every Studio feature, so use it for free instead',
      'Generating proxies will remove the grain from the final export',
      'The render cache applies noise reduction automatically on export',
    ], 0, 'Advanced noise reduction is one of the features the paid Studio version adds; the practical approach is to upgrade when a feature pays for itself on real work.'),
    q('In DaVinci Resolve you need smoother playback right away without generating any new files. Which setting helps?', [
      'Generate Optimized Media for every clip in the bin',
      'Timeline Proxy Resolution set to Half or Quarter',
      'Generate Proxy Media for the whole timeline first',
      'Export a flattened copy and edit that file instead',
    ], 1, 'Timeline proxy resolution lowers only the viewer\'s playback resolution, with no new files and no effect on the export.'),
    q('A 90-second talking-head recording is full of long pauses, filler words and repeated sentences. What usually improves its pacing most?', [
      'Speed the whole recording up to 1.5x so it plays more quickly',
      'Place b-roll over every pause so the gaps are hidden from view',
      'Cut every single breath so the speaker never stops for a moment',
      'Cut the pauses, fillers and repeats, but keep natural breaths',
    ], 3, 'Removing dead air often turns 90 seconds into a stronger 50, while cutting every breath makes the speaker sound robotic and exhausting.'),
    q('A short-form video needs eight seconds of b-roll over narration, and you have one static shot. What works better than holding that shot for eight seconds?', [
      'Slowing the one shot down to half speed so it fills the whole gap',
      'Adding a spinning transition halfway through the shot',
      'Cutting between several b-roll shots of one to three seconds',
      'Leaving the presenter on screen with a zoom instead',
    ], 2, 'Short-form b-roll shots usually last one to three seconds, and cutting between several keeps the coverage from becoming boring.'),
    q('A whip-pan transition looks right on screen but still feels abrupt when played. What usually helps most?', [
      'Making the whip pan itself twice as long on the timeline',
      'Adding a whoosh or other sound that bridges the cut',
      'Replacing it with a slow cross dissolve instead',
      'Adding a colour flash on the frame of the cut',
    ], 1, 'Transitions are often more about sound than picture; a sound effect that carries across the cut makes it feel intentional.'),
    q('Dialogue swings between loud, excited words and quiet sentence endings. Which tool evens that out?', [
      'A high-pass EQ filter that removes the low rumble',
      'A compressor at roughly 2:1 to 4:1, with makeup gain',
      'Strong noise reduction applied evenly across the whole clip',
      'A reverb effect that blends the words together',
    ], 1, 'A compressor turns down the loudest parts and makeup gain lifts the whole voice, giving consistently clear speech.'),
    q('A music track runs twenty seconds longer than your video. What is the cleanest way to make it fit?', [
      'Cut at the end of a musical phrase and join sections on the beat',
      'Fade the music out quickly at whatever point the video ends',
      'Speed the whole track up by about ten percent so that it fits exactly',
      'Loop the opening five seconds of the track until the video ends',
    ], 0, 'Editing on phrase and bar boundaries keeps the music sounding intentional, whereas an abrupt fade or a speed change is obvious to listeners.'),
    q('In a typical online video mix, what is a sensible ceiling for true peak level?', [
      'Exactly 0 dBFS',
      'About +3 dBFS',
      'About -1 dBFS',
      'About -24 dBFS',
    ], 2, 'Keeping true peaks around -1 dBFS leaves a margin so platform encoding does not push the loudest moments into distortion.'),
    q('After correction, a client\'s red packaging looks slightly orange while everything else looks right. What fixes only the red?', [
      'A stronger creative LUT applied over the whole of the shot',
      'Moving the white balance of the whole shot a little towards blue',
      'Raising the saturation of the entire image by about 20%',
      'A secondary correction, such as HSL Secondary or a qualifier',
    ], 3, 'Secondary tools isolate a range of colours so one hue can be adjusted, which matters when brand colours must match the real product.'),
    q('On a vectorscope, the trace of a plain white wall sits pulled out towards orange instead of near the centre. What does that indicate?', [
      'Healthy skin tones sitting right along the skin tone line',
      'Clipped highlights that can no longer be recovered',
      'A warm colour cast that white balance should remove',
      'Low saturation that needs a creative LUT to fix',
    ], 2, 'Distance from the centre shows saturation and direction shows hue, so a neutral surface pulled towards orange reveals a warm cast.'),
    q('A title slides in, holds on screen, then slides out. What is the minimum number of position keyframes?', [
      'Two',
      'Three',
      'Six',
      'Four',
    ], 3, 'The slide in needs a start and end keyframe, and the slide out needs its own start and end, with the hold between the second and third.'),
    q('A caption shows a price and a phone number for one second, and viewers keep missing them. What should change?', [
      'Hold it longer, since key details need more than 1.5 seconds',
      'Animate the text in faster so it catches the eye',
      'Use a thinner font so that the numbers fit onto a single line',
      'Speed up the voiceover so it ends with the caption',
    ], 0, 'A short phrase needs at least a second and a half, and important details such as prices and numbers need longer; if it still does not fit, cut words.'),
    q('A green screen shot keys badly because the screen is wrinkled and unevenly lit. Where is the real fix?', [
      'In the edit: raise the keyer\'s tolerance until all the patches go',
      'While filming: light the screen evenly and remove the wrinkles',
      'In the edit: add a heavy blur to the whole foreground subject',
      'In the export: raise the bitrate so the key has more detail',
    ], 1, 'Most keying problems are filming problems, and an evenly lit, smooth screen gives the keyer one clean colour to remove.'),
    q('Why do some short-form editors make the last frame flow seamlessly into the first?', [
      'Viewers rewatch without noticing, which can add watch time',
      'Platforms require a seamless loop before recommending any video',
      'It hides the watermark that platforms add on export',
      'Looped videos are exempt from music copyright claims',
    ], 0, 'A seamless loop invites repeat viewing, and rewatches count as additional watch time on many platforms.'),
    q('A Reel ends with a slow fade, a repeated goodbye and a six-second outro, and viewers leave before the end. What should change?', [
      'Make the outro even longer so that the call to action sinks in',
      'Move the goodbye to the start so the end is quieter',
      'Deliver the payoff, give a quick call to action, and stop',
      'Add a longer fade so that the ending feels gentler',
    ], 2, 'Viewers swipe once they sense the content is over, so a tight ending keeps them to the last frame.'),
    q('A brand\'s TikTok business account wants its next video built around a trending hit song. What is the issue?', [
      'Business accounts usually only get commercial-use music',
      'Trending songs are free to use once they go viral',
      'Business accounts can use any song under 30 seconds',
      'Crediting the artist in the caption grants the licence',
    ], 0, 'Business accounts are generally limited to commercial music libraries, so building brand edits around a popular song the client cannot license is a legal risk.'),
    q('What should you send a client for the first review round of an edit?', [
      'A smaller 720p or 1080p file with DRAFT or timecode burned in',
      'The clean final 4K master, so they judge the full quality',
      'The raw project file, so the client can make their edits directly',
      'A link to the published post, so they see it in context',
    ], 0, 'A lighter draft with a watermark or timecode lets the client give precise feedback, while clean finals go out after approval and payment.'),
    q('A 1080 × 1920 Reel export looks blocky during fast motion. Which export bitrate range is a sensible target?', [
      'Roughly 1 to 2 Mbps',
      'Roughly 0.3 to 0.5 Mbps',
      'Roughly 10 to 20 Mbps',
      'Roughly 300 to 500 Mbps',
    ], 2, 'Too low a bitrate smears fast motion, and a vertical 1080p export in the 10 to 20 Mbps range survives platform recompression without wasteful file sizes.'),
    q('After approving the final cut, a client asks for an extra 16:9 version and captions in a second language. How should you treat it?', [
      'As part of the included revision rounds, so no extra charge',
      'As a reason to refund the project and start over again',
      'As normal feedback that must be done before any payment',
      'As extra work outside the agreed scope, priced as add-ons',
    ], 3, 'Additional formats and languages sit outside the agreed scope, so they become add-ons with their own price, like any scope change.'),
    q('A client\'s campaign for an unreleased product would be the strongest piece in your showreel. When can you use it?', [
      'After the launch, and only with the client\'s permission',
      'Straight away, since you edited it and so you own the work',
      'Straight away, if you blur the product\'s logo first',
      'Never, because client work can never be shown publicly',
    ], 0, 'Client confidentiality comes first, especially for unreleased products, so wait for the launch and get permission before showing the work.'),
  ],
});
