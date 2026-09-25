import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'unity-game-dev',
  title: 'Game Development with Unity',
  category: 'Game Development',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'cyan',
  coverKey: 'unity-game-dev',
  summary:
    'Build and publish real 2D and 3D games with Unity and C#: scripting, physics, input, prefabs, animation, UI, AI enemies, saving, performance for mobile, and publishing to Google Play and the web.',
  description:
    'You start by installing Unity, touring the editor and building your first scene from GameObjects and components. You learn C# scripting for games, then move things with transforms, input and physics. You build a complete 2D platformer with sprites, tilemaps and a camera that follows the player, and structure games with prefabs, ScriptableObjects and events. You add game feel with animation, particles and sound, create menus and HUDs that work on phones, and build a 3D game with a character controller, lighting and enemies that navigate the level. Finally you add game states, saving and progression, profile and optimise for mobile, publish to Google Play and the web, and plan a portfolio and career in game development.',
  chapters: [
    chapter(
      'Getting Started With Unity',
      'Understand what Unity is and what kinds of games it builds, install Unity Hub and the editor with the right modules, find your way around the editor\'s windows, and build a first scene from GameObjects and components.',
      [
      lesson('What Unity Is and What You Can Build', 12, `
Unity is a game engine: software that provides everything a game needs to run, rendering graphics, simulating physics, playing sound, reading input, and packaging the result for phones, computers, consoles and the web. Instead of writing all of that yourself, you build your game on top of it and focus on what makes your game unique.

### Why Unity is so widely used

| Strength | What it means for you |
|---|---|
| Cross-platform | One project can target Android, iOS, Windows, macOS, the web and consoles |
| Beginner-friendly | A visual editor, huge documentation and countless tutorials |
| C# scripting | A modern, well-structured language that is widely used beyond games |
| Asset Store | Ready-made models, sounds, tools and templates |
| Strong for mobile | A large share of mobile games are built with Unity |
| Community | Forums, videos and local developer groups everywhere |

### What people build with Unity

- **Mobile games**: puzzle games, casual games, runners, strategy games.
- **2D games**: platformers, top-down adventures, card games.
- **3D games**: action games, simulations, racing games.
- **Virtual and augmented reality**: training simulations, experiences.
- **Beyond games**: architectural walkthroughs, product configurators, training simulators and interactive education.

Pakistani studios have used Unity to ship mobile games played by millions of people worldwide, which makes it a practical skill for local jobs and international freelancing.

### Unity and other engines

| Engine | Typical strengths |
|---|---|
| Unity | Mobile, 2D and 3D, cross-platform, large community |
| Unreal Engine | High-end 3D graphics, large console and PC titles |
| Godot | Free and open source, lightweight, growing community |
| GameMaker | Focused 2D development |

There is no single best engine. Unity is an excellent first engine because it balances ease of learning with professional capability, and the concepts transfer to others.

### How a Unity game is organised

\`\`\`text
Project
  Scenes           levels or screens: MainMenu, Level1, Level2
    GameObjects    everything in the scene: player, enemies, lights, camera
      Components   behaviour and data: Transform, Sprite Renderer, Rigidbody, your scripts
  Assets           images, sounds, models, scripts, prefabs
\`\`\`

Every chapter of this course builds on this structure.

### What you will build

Over the course, you will create a complete 2D platformer and a 3D game with enemies, learn the systems every game needs, such as menus, saving and progression, and publish a game to Google Play and the web. By the end you will have finished games for your portfolio, which matter far more to employers than certificates.

### Licensing in brief

Unity offers a free Personal plan for individuals and small companies below a revenue threshold, with paid plans above it. Terms have changed in recent years, so check Unity's current plans and conditions before you start earning from a game.
      `,
        [
          q('What does a game engine like Unity provide?', [
            'Only a paint program for game art',
            'Rendering, physics, sound, input and building for platforms',
            'A marketplace for selling phones',
            'A replacement for C# programming',
          ], 1, 'Engines handle the common systems every game needs, so developers focus on the game itself.'),
          q('Why is Unity a strong choice for mobile games?', [
            'It builds for Android and iOS and is widely used for mobile',
            'It only runs on phones',
            'It requires no programming at all',
            'It has no 3D features',
          ], 0, 'Cross-platform builds and a large mobile ecosystem make Unity popular for mobile development.'),
          q('In Unity, what are components?', [
            'Separate game projects',
            'Types of scenes',
            'Behaviour and data attached to GameObjects',
            'Files you download from the Asset Store only',
          ], 2, 'Components such as Transform, Rigidbody and scripts give GameObjects their properties and behaviour.'),
        ]
      ),
      lesson('Installing Unity Hub and the Editor', 13, `
Unity is installed through Unity Hub, a small launcher that manages editor versions, projects and platform modules. Setting it up correctly from the start avoids common problems, especially when you later build for Android.

### Step 1: Unity Hub and an account

Download Unity Hub from Unity's official website, install it and sign in with a Unity account. The Hub then activates your licence, typically the free Personal licence for learners.

### Step 2: choose an editor version

Unity releases editor versions regularly. For learning and real projects, choose a version marked for long-term support (LTS) or the version the Hub recommends. Stable versions have fewer bugs and match most tutorials.

\`\`\`text
Rule of thumb: pick one stable version and keep using it for a project.
Upgrading an existing project to a new editor version can require fixes,
so do it deliberately and with a backup.
\`\`\`

### Step 3: add modules

During installation, Unity Hub lets you add modules for target platforms:

| Module | Needed for |
|---|---|
| Android Build Support (with SDK, NDK and OpenJDK) | Building Android games |
| iOS Build Support | Building for iPhone (final builds require a Mac with Xcode) |
| Web Build Support | Games that run in a browser |
| Windows or Mac build support | Desktop builds for other platforms |
| Documentation | Offline help |

Add Android Build Support now if you want to publish mobile games; installing it through the Hub, with its bundled SDK and tools, avoids most setup errors.

### Step 4: a code editor

Unity scripts are written in C#. Popular editors:

- **Visual Studio** (Windows), with its Unity workload.
- **Visual Studio Code**, with Unity and C# extensions.
- **JetBrains Rider**, a powerful paid IDE with strong Unity support.

In Unity, set your editor under Edit, Preferences, External Tools, so double-clicking a script opens it there with autocomplete working.

### Step 5: create a project

In the Hub, choose New project and pick a template:

| Template | Use |
|---|---|
| Universal 2D | 2D games with the Universal Render Pipeline |
| Universal 3D | 3D games that run well on mobile and desktop |
| High Definition 3D | High-end PC and console graphics |

For this course, the Universal templates are ideal: they run well on phones and support modern lighting and effects.

### Hardware expectations

Unity runs on most modern laptops, but a smooth experience needs a reasonable processor, at least 8 GB of RAM (16 GB is comfortable), an SSD and a graphics card or capable integrated graphics. Android builds also need several gigabytes of free disk space for the SDK and build files.

### Common installation problems

| Problem | Likely fix |
|---|---|
| Licence errors | Sign out and back into Unity Hub; check the internet connection |
| Android build fails on first try | Reinstall Android modules through the Hub rather than manually |
| Scripts open in Notepad | Set the external script editor in Preferences |
| Editor very slow | Close other heavy programs; check disk space and power settings |

### Version control from day one

Use Git with a Unity-specific \`.gitignore\` (which excludes the Library folder and other generated files) from your first project. It lets you undo mistakes, experiment safely and share projects with teammates.
      `,
        [
          q('What does Unity Hub manage?', [
            'Only your game\'s sound files',
            'Your phone\'s operating system',
            'Editor versions, projects and platform modules',
            'Your Google Play account',
          ], 2, 'The Hub installs editors, adds modules and opens projects.'),
          q('Why install Android Build Support through Unity Hub?', [
            'Its bundled SDK and tools avoid most setup errors',
            'Android builds are impossible otherwise',
            'It makes games run faster on phones',
            'It removes the need for a Unity account',
          ], 0, 'Hub-managed Android modules come preconfigured, preventing many build problems.'),
          q('What should a Unity project\'s .gitignore exclude?', [
            'Every C# script in the project',
            'All the scene files you saved',
            'The whole Assets folder',
            'The generated Library folder',
          ], 3, 'Generated folders can be rebuilt by Unity and should not be committed.'),
        ]
      ),
      lesson('A Tour of the Unity Editor', 13, `
The Unity editor has several windows that work together. Learning what each one does, and how to move around the scene quickly, makes everything else in the course faster. You will use these windows every day.

### The main windows

\`\`\`text
+-----------------+--------------------------+----------------+
| Hierarchy       | Scene view / Game view   | Inspector      |
| (objects in the |                          | (details of the|
|  current scene) |                          |  selected      |
|                 |                          |  object)       |
+-----------------+--------------------------+----------------+
| Project (assets)        | Console (messages and errors)      |
+-------------------------+------------------------------------+
\`\`\`

| Window | Purpose |
|---|---|
| Hierarchy | Lists every GameObject in the open scene, with parent-child nesting |
| Scene view | Where you build: move, rotate and arrange objects |
| Game view | What the player sees through the camera when the game runs |
| Inspector | Shows and edits the components of the selected object |
| Project | All files in your project: scripts, images, sounds, prefabs |
| Console | Log messages, warnings and errors from your scripts |

You can drag windows to rearrange the layout, and reset it from the Layout menu if it becomes messy.

### Navigating the Scene view

| Action | Control |
|---|---|
| Orbit around | Hold right mouse button and move (3D), or Alt plus left drag |
| Pan | Hold middle mouse button and drag |
| Zoom | Mouse scroll wheel |
| Fly through (3D) | Hold right mouse button and use W, A, S, D |
| Focus on selected object | Press F |

Pressing F to frame the selected object is one of the most useful shortcuts in Unity.

### Transform tools

The toolbar tools change what dragging does:

\`\`\`text
Q  Hand tool   pan the view
W  Move        drag arrows to move objects
E  Rotate      drag circles to rotate
R  Scale       drag handles to resize
T  Rect        2D and UI resizing
\`\`\`

Holding Ctrl (Cmd on Mac) while moving snaps objects in fixed steps, useful for neat level layouts.

### Play mode

The Play button at the top runs your game inside the editor. Important warning: changes you make to objects during Play mode are lost when you stop. Unity tints the editor during play to remind you. Make changes in edit mode, or copy component values during play and paste them after stopping.

### The Inspector in depth

Selecting a GameObject shows its components in the Inspector: always a Transform, plus whatever else is attached. You can:

- Edit values directly, such as position or colour.
- Add components with the Add Component button.
- Enable or disable components with their checkbox.
- Reset or copy values from the component's menu.

### The Project window and folders

Keep assets organised from the start:

\`\`\`text
Assets/
  Scenes/
  Scripts/
  Sprites/
  Audio/
  Prefabs/
  Materials/
\`\`\`

A tidy project saves time finding files and makes collaboration easier. Rename and move assets inside Unity, not in your file explorer, so Unity keeps track of references between them.

### The Console

Red errors in the Console stop scripts from compiling; fix them first. Yellow warnings deserve attention but do not stop the game. Double-clicking a message usually opens the script at the line that caused it. Chapter 2 covers debugging in depth.
      `,
        [
          q('Which window shows the components of a selected GameObject?', [
            'The Inspector',
            'The Hierarchy',
            'The Console',
            'The Game view',
          ], 0, 'The Inspector displays and edits the selected object\'s components.'),
          q('What happens to changes made to objects during Play mode?', [
            'They are saved automatically',
            'They are uploaded to the Asset Store',
            'They are copied to every scene',
            'They are lost when Play mode stops',
          ], 3, 'Edits in Play mode are temporary, so make lasting changes in edit mode.'),
          q('Why should you move and rename assets inside Unity rather than in the file explorer?', [
            'The file explorer cannot see Unity folders',
            'Unity keeps references between assets intact',
            'It makes the game run faster',
            'Unity deletes files moved outside it',
          ], 1, 'Unity tracks asset references, which can break if files are moved outside the editor.'),
        ]
      ),
      lesson('Your First Scene: GameObjects and Components', 14, `
Everything in a Unity scene is a GameObject: the player, the ground, a coin, a light, the camera. On their own, GameObjects do nothing. Components give them appearance, physics and behaviour. Understanding this idea, objects built from components, is the key to thinking in Unity.

### GameObjects are containers

A GameObject is an empty container with a name and a Transform, the component that stores position, rotation and scale. Everything else comes from adding components:

| Component | What it adds |
|---|---|
| Sprite Renderer | Draws a 2D image |
| Mesh Renderer and Mesh Filter | Draw a 3D model |
| Rigidbody or Rigidbody 2D | Makes the object follow physics, such as gravity |
| Collider | Gives the object a shape for collisions |
| Audio Source | Plays sounds |
| Light | Illuminates the scene |
| Camera | Renders the view the player sees |
| Your scripts | Custom behaviour you write in C# |

A player might combine a Sprite Renderer, a Rigidbody 2D, a Collider 2D and a movement script. A coin might have a Sprite Renderer, a trigger collider and a script that adds to the score.

### Build a simple 3D scene

\`\`\`text
1. GameObject > 3D Object > Plane             -> the ground
2. GameObject > 3D Object > Cube              -> set position to (0, 3, 0)
3. Select the cube, Add Component > Rigidbody -> it now has physics
4. Press Play                                  -> the cube falls and lands on the plane
\`\`\`

The plane already has a collider, and so does the cube. Adding the Rigidbody makes the cube respond to gravity and collisions. No code needed.

### Parent and child objects

Dragging one GameObject onto another in the Hierarchy makes it a child. Children move, rotate and scale with their parent:

\`\`\`text
Player
  Model        (visual)
  WeaponHolder
    Sword
  GroundCheck  (an empty object used to detect the floor)
\`\`\`

Grouping objects this way keeps scenes organised and makes complex characters possible.

### Materials and colour

In 3D, a material defines how a surface looks. Create one in the Project window (Create, Material), set its colour, and drag it onto the cube. In 2D, you change a sprite's colour directly in its Sprite Renderer.

### Empty GameObjects

Empty GameObjects with only a Transform are very useful:

- As folders to organise the Hierarchy ("Environment", "Enemies").
- As spawn points marking where objects appear.
- As managers holding scripts that control the game.

### Saving scenes

Save scenes with Ctrl+S (Cmd+S). A project usually contains several scenes, such as a main menu and levels, stored in the Scenes folder. An asterisk next to the scene name in the Hierarchy means unsaved changes.

### Thinking in components

Instead of asking "what class should this object be?", Unity developers ask "what components does this object need?". Need an enemy that also plays sounds? Add an Audio Source. Need a coin that spins? Add a small rotation script. This composition approach makes it easy to reuse behaviour across many different objects, and it is the foundation for everything that follows in this course.

### Practice task

Build a small scene with a ground plane, three cubes stacked at different heights with Rigidbodies, a light and the camera positioned to watch them fall. Change their materials and masses, press Play and observe. Experimenting like this builds intuition faster than any reading.
      `,
        [
          q('What must you add to a cube to make it fall under gravity?', [
            'A Light component',
            'A Rigidbody component',
            'An Audio Source',
            'A Camera component',
          ], 1, 'A Rigidbody makes an object simulated by the physics engine, including gravity.'),
          q('What happens to child objects when their parent moves?', [
            'They stay where they were',
            'They are deleted',
            'They move with the parent',
            'They become separate scenes',
          ], 2, 'Children inherit their parent\'s transform changes.'),
          q('What is a common use of an empty GameObject?', [
            'Drawing a 3D model',
            'Playing background music automatically',
            'Replacing the camera',
            'Organising the Hierarchy or marking spawn points',
          ], 3, 'Empty objects serve as folders, markers and holders for manager scripts.'),
        ]
      ),
      ],
      [
      q('Which engine is often described as strongest for high-end 3D console and PC graphics?', [
        'GameMaker',
        'Unity',
        'Unreal Engine',
        'Scratch',
      ], 2, 'Unreal is known for high-end 3D, while Unity is strong for mobile and cross-platform work.'),
      q('Which template suits a 2D mobile game?', [
        'Universal 2D',
        'High Definition 3D',
        'An empty text file',
        'The Documentation module',
      ], 0, 'Universal 2D uses the Universal Render Pipeline, which suits 2D and mobile games.'),
      q('Which shortcut frames the selected object in the Scene view?', [
        'Ctrl+S',
        'Q',
        'R',
        'F',
      ], 3, 'Pressing F focuses the Scene view on the selected object.'),
      q('What is the core idea of building objects in Unity?', [
        'Every object needs its own programming language',
        'Combining components to give objects behaviour',
        'Objects must be written entirely in code',
        'Each scene can hold only one object',
      ], 1, 'Unity uses composition: objects gain abilities from the components attached to them.'),
      ]
    ),
    chapter(
      'C# Scripting Foundations',
      'Learn the C# essentials used in Unity scripts, understand MonoBehaviour and the order in which Unity calls its methods, expose values in the Inspector safely, and debug scripts with the Console and breakpoints.',
      [
      lesson('C# Basics for Game Developers', 13, `
Scripts give your game its rules: how the player moves, when enemies attack, how points are scored. Unity scripts are written in C#, a clear, strongly typed language. You do not need to master all of C# before making games; a core set of concepts covers most gameplay code.

### Variables and types

\`\`\`csharp
int lives = 3;              // whole numbers
float speed = 5.5f;         // decimals (note the f)
bool isGrounded = false;    // true or false
string playerName = "Ali";  // text
Vector3 spawnPoint = new Vector3(0f, 2f, 0f); // a position in 3D
\`\`\`

Unity uses \`float\` for most measurements, such as speed, time and positions. Forgetting the \`f\` on decimal numbers is a classic beginner error.

### Conditions

\`\`\`csharp
if (health <= 0)
{
    Die();
}
else if (health < 30)
{
    ShowLowHealthWarning();
}
\`\`\`

### Loops

\`\`\`csharp
for (int i = 0; i < 5; i++)
{
    SpawnEnemy();
}

foreach (Enemy enemy in enemies)
{
    enemy.Freeze();
}
\`\`\`

### Methods

Methods group code under a name and can take inputs and return values:

\`\`\`csharp
void TakeDamage(int amount)
{
    health -= amount;
    if (health <= 0)
    {
        Die();
    }
}

int CalculateScore(int coins, float timeLeft)
{
    return coins * 10 + Mathf.RoundToInt(timeLeft);
}
\`\`\`

Clear method names, such as \`TakeDamage\`, \`Jump\` or \`CollectCoin\`, make scripts easy to read.

### Classes and objects

Each Unity script defines a class. When you attach the script to a GameObject, Unity creates an instance of that class for that object. Three enemies with the same script each have their own copy of the variables, such as their own health.

### Lists and arrays

\`\`\`csharp
using System.Collections.Generic;

List<GameObject> collectedItems = new List<GameObject>();
collectedItems.Add(coin);
int count = collectedItems.Count;
\`\`\`

Lists grow and shrink; arrays have a fixed size. Lists are usually more convenient for game objects that come and go.

### Useful Unity types

| Type | Used for |
|---|---|
| Vector2, Vector3 | Positions, directions and velocities |
| Quaternion | Rotations |
| GameObject | Objects in the scene |
| Transform | Position, rotation and scale of an object |
| Color | Colours of sprites, lights and UI |
| Mathf | Maths helpers: Clamp, Lerp, Abs, Round |

### Naming conventions

Unity and C# code commonly uses PascalCase for classes and methods (\`PlayerController\`, \`TakeDamage\`) and camelCase for variables (\`moveSpeed\`, \`isGrounded\`). The script file name must match the class name exactly, or Unity cannot attach it.

### Learning C# alongside Unity

You will learn C# fastest by using it in small gameplay tasks: make a cube move, count coins, flash a colour when hit. If you want a deeper foundation, Cortexis's programming courses cover general programming concepts that apply directly to C#.
      `,
        [
          q('Why do decimal values in Unity C# often end with f, as in 5.5f?', [
            'It marks the value as a fixed constant',
            'It makes the number a float, which Unity uses for most measurements',
            'It converts the number into a string',
            'It rounds the number up',
          ], 1, 'Decimal literals are doubles by default, and the f suffix makes them floats.'),
          q('What must match exactly for Unity to attach a script?', [
            'The script file name and the class name',
            'The script name and the scene name',
            'The class name and the folder name',
            'The variable names and the method names',
          ], 0, 'Unity requires the file name to match the MonoBehaviour class name.'),
          q('Three enemies share the same script. How many health variables exist?', [
            'One shared variable for all enemies',
            'None, until the game starts',
            'Three, one for each enemy instance',
            'Only the first enemy has one',
          ], 2, 'Each attached script is its own instance with its own variables.'),
        ]
      ),
      lesson('MonoBehaviour and the Script Lifecycle', 14, `
Most Unity scripts inherit from MonoBehaviour, the base class that lets a script be attached to a GameObject. Unity then calls special methods on your script at particular moments: when it is created, every frame, when physics updates, when it is destroyed. Knowing when each method runs prevents many subtle bugs.

### A basic script

\`\`\`csharp
using UnityEngine;

public class Spinner : MonoBehaviour
{
    public float degreesPerSecond = 90f;

    void Update()
    {
        transform.Rotate(0f, degreesPerSecond * Time.deltaTime, 0f);
    }
}
\`\`\`

Attach this to any object and it spins. \`transform\` is a shortcut to the object's own Transform component.

### The main lifecycle methods

| Method | When Unity calls it | Typical use |
|---|---|---|
| \`Awake\` | Once, when the object is created, even if the script is disabled | Get references to own components |
| \`OnEnable\` | Each time the object or script becomes enabled | Subscribe to events |
| \`Start\` | Once, before the first frame the script is enabled | Setup that depends on other objects |
| \`Update\` | Every frame | Input, timers, non-physics movement |
| \`FixedUpdate\` | At fixed intervals, in step with physics | Applying physics forces |
| \`LateUpdate\` | Every frame, after all \`Update\` calls | Camera following |
| \`OnDisable\` | When disabled | Unsubscribe from events |
| \`OnDestroy\` | When destroyed | Final cleanup |

### Frame rate independence

Frames happen at different rates on different devices: 30 per second on a budget phone, 144 on a gaming PC. Moving something a fixed amount per frame makes it faster on fast devices. Multiply by \`Time.deltaTime\`, the time since the last frame, to move per second instead:

\`\`\`csharp
// Wrong: speed depends on frame rate
transform.position += Vector3.right * 0.1f;

// Right: 5 units per second on every device
transform.position += Vector3.right * 5f * Time.deltaTime;
\`\`\`

### Update versus FixedUpdate

Physics runs at a fixed rate, independent of the frame rate. Apply physics forces and velocity changes in \`FixedUpdate\`, so they stay consistent. Read input in \`Update\`, because input happens per frame and presses can be missed in \`FixedUpdate\`:

\`\`\`csharp
bool jumpPressed;

void Update()
{
    if (/* jump button pressed this frame */) jumpPressed = true;
}

void FixedUpdate()
{
    if (jumpPressed)
    {
        rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
        jumpPressed = false;
    }
}
\`\`\`

### Getting other components

\`\`\`csharp
Rigidbody2D rb;

void Awake()
{
    rb = GetComponent<Rigidbody2D>();
}
\`\`\`

Call \`GetComponent\` once in \`Awake\` and store the result. Calling it every frame in \`Update\` wastes performance.

### Awake before Start

All \`Awake\` methods run before any \`Start\` method. So a common pattern is: each object sets up itself in \`Awake\`, then looks up other objects in \`Start\`, when everything is guaranteed to exist.

### Enabling and disabling

Unchecking a script in the Inspector stops \`Update\` from being called but keeps the object alive. Deactivating the whole GameObject stops all its components. Understanding this helps when pausing enemies, hiding menus or switching between game states.
      `,
        [
          q('Why multiply movement by Time.deltaTime?', [
            'To make objects move faster on every device',
            'To convert movement into physics forces',
            'To pause the game when needed',
            'To move per second rather than per frame',
          ], 3, 'Frame times differ across devices, and deltaTime makes movement consistent.'),
          q('Where should physics forces usually be applied?', [
            'In FixedUpdate',
            'In Awake',
            'In OnDestroy',
            'In LateUpdate',
          ], 0, 'FixedUpdate runs in step with the physics simulation, keeping forces consistent.'),
          q('Why store a GetComponent result in Awake instead of calling it every frame?', [
            'GetComponent only works in Awake',
            'Repeated calls waste performance',
            'Unity forbids GetComponent in Update',
            'Stored references are more accurate',
          ], 1, 'Caching the reference once avoids a repeated lookup every frame.'),
        ]
      ),
      lesson('Variables, the Inspector and SerializeField', 13, `
One of Unity's most useful features is that script variables can appear in the Inspector, where you can adjust them without changing code. Designers tweak jump height, enemy speed or spawn rates while the game runs, finding what feels right. Using this feature well, while keeping code safe, is an important habit.

### Public fields

\`\`\`csharp
public class PlayerMovement : MonoBehaviour
{
    public float moveSpeed = 6f;
    public float jumpForce = 12f;
}
\`\`\`

Public fields appear in the Inspector and can be edited. The value in the Inspector overrides the default in code once the component exists.

### SerializeField: Inspector without public

Making fields public also lets any other script change them, which can cause bugs. The better practice is to keep fields private and expose them to the Inspector with \`[SerializeField]\`:

\`\`\`csharp
public class PlayerMovement : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 6f;
    [SerializeField] private float jumpForce = 12f;
    [SerializeField] private Transform groundCheck;
}
\`\`\`

The Inspector shows them, but other scripts cannot change them accidentally. This combination, private plus SerializeField, is standard in professional Unity code.

### Referencing other objects

Fields can hold references to other GameObjects and components. Drag an object from the Hierarchy into the slot in the Inspector:

\`\`\`csharp
[SerializeField] private AudioSource jumpSound;
[SerializeField] private GameObject bulletPrefab;
\`\`\`

This is simpler and faster than searching for objects by name in code. An empty slot, shown as "None", is a common cause of \`NullReferenceException\` errors.

### Making the Inspector friendlier

| Attribute | Effect |
|---|---|
| \`[Header("Movement")]\` | Adds a heading above fields |
| \`[Tooltip("Units per second")]\` | Shows help when hovering |
| \`[Range(0f, 20f)]\` | Displays a slider with limits |
| \`[Space]\` | Adds spacing between groups |

\`\`\`csharp
[Header("Movement")]
[Tooltip("Horizontal speed in units per second")]
[Range(1f, 15f)]
[SerializeField] private float moveSpeed = 6f;
\`\`\`

Clear labels and sensible ranges make scripts easier for teammates, and your future self, to tune.

### Tuning during Play mode

You can change Inspector values while the game runs to test different settings instantly. Remember that these changes are lost when you stop Play mode. When you find good values, note them down, then enter them after stopping, or copy the component's values and paste them in edit mode.

### Properties for controlled access

When other scripts need to read a value but not change it, use a property:

\`\`\`csharp
[SerializeField] private int maxHealth = 100;
private int currentHealth;

public int CurrentHealth => currentHealth;
\`\`\`

Other scripts can read \`CurrentHealth\`, but only this script changes it, through methods like \`TakeDamage\`. Controlled access prevents hard-to-find bugs where one script unexpectedly changes another's data.

### Default values and resets

The value in code is used when the component is first added. After that, the Inspector value is saved with the scene or prefab. If you change the default in code later, existing objects keep their Inspector values. Use the component's Reset option to return to code defaults when needed.
      `,
        [
          q('Why use private fields with [SerializeField] instead of public fields?', [
            'Private fields cannot be shown in the Inspector otherwise',
            'The Inspector can edit them, but other scripts cannot change them accidentally',
            'SerializeField makes the game run faster',
            'Public fields are not allowed in Unity',
          ], 1, 'SerializeField exposes private fields to the Inspector while protecting them from other scripts.'),
          q('A reference slot shows "None" and the game throws a NullReferenceException. What is wrong?', [
            'The script file name is incorrect',
            'The scene has too many objects',
            'The reference was never assigned in the Inspector',
            'The Console is closed',
          ], 2, 'An unassigned reference is null, and using it causes the exception.'),
          q('What happens to Inspector changes made during Play mode?', [
            'They are lost when Play mode stops',
            'They are saved to the script file',
            'They become the new code defaults',
            'They apply to every scene',
          ], 0, 'Play mode edits are temporary, so note good values and apply them afterwards.'),
        ]
      ),
      lesson('Debugging With the Console and Breakpoints', 12, `
Every game has bugs: the player falls through the floor, the score adds twice, an enemy never dies. Finding them quickly is a core skill. Unity offers simple logging for quick checks and a full debugger for stepping through code, and knowing when to use each saves hours.

### Logging messages

\`\`\`csharp
Debug.Log("Player jumped");
Debug.Log($"Health is now {currentHealth}");
Debug.LogWarning("Spawn point not set; using default");
Debug.LogError("Save file is corrupted");
\`\`\`

Messages appear in the Console. Click a message to see the stack trace, showing which method called which. Passing an object as a second argument, \`Debug.Log("Hit", gameObject)\`, highlights that object in the Hierarchy when you click the message.

### Reading common errors

| Error | Meaning | Usual fix |
|---|---|---|
| \`NullReferenceException\` | Using a reference that is empty | Assign it in the Inspector or check it exists first |
| \`MissingReferenceException\` | Using an object that was destroyed | Check the object still exists before using it |
| \`IndexOutOfRangeException\` | Accessing a position beyond a list or array | Check the index against the length |
| Compiler error (red, with a line number) | Syntax or type mistake | Fix the code; the game will not run until then |
| The type or namespace could not be found | Missing \`using\` statement or package | Add the \`using\` line or install the package |

Double-click an error to open the script at the problem line.

### Breakpoints and the debugger

For complex bugs, attach your code editor's debugger to Unity:

\`\`\`text
1. In Visual Studio, VS Code or Rider, choose Attach to Unity.
2. Click in the margin next to a line to set a breakpoint.
3. Press Play in Unity. When that line runs, the game pauses.
4. Inspect variable values, step line by line, and watch what changes.
\`\`\`

Breakpoints show exactly what is happening, rather than guessing from logs. They are especially useful for logic bugs, such as a score calculated wrongly or a condition that never becomes true.

### Visual debugging

Some bugs are easier to see than to read:

\`\`\`csharp
void OnDrawGizmos()
{
    Gizmos.color = Color.yellow;
    Gizmos.DrawWireSphere(transform.position, detectionRadius);
}
\`\`\`

Gizmos draw shapes in the Scene view, such as an enemy's detection range. \`Debug.DrawRay\` draws lines, useful for checking raycasts (chapter 8).

### A debugging method

\`\`\`text
1. Reproduce the bug reliably.
2. Read the exact error message and line.
3. Form a guess about the cause.
4. Test the guess with a log, breakpoint or gizmo.
5. Fix, then confirm the bug is gone and nothing else broke.
\`\`\`

Changing code randomly until the bug disappears often creates new bugs. A methodical approach is faster.

### Clean up logs

Many \`Debug.Log\` calls every frame slow the game down and flood the Console. Remove temporary logs after fixing a bug, and avoid logging inside \`Update\` unless necessary. Use the Console's Collapse option to group repeated messages while investigating.

### Ask for help effectively

When asking a teacher, forum or AI assistant for help, include the exact error message, the relevant code, what you expected and what actually happened. Clear questions get useful answers quickly.
      `,
        [
          q('What does a NullReferenceException usually mean?', [
            'The game ran out of memory',
            'The scene is not saved',
            'Code used a reference that is empty',
            'A file name contains spaces',
          ], 2, 'Accessing a null reference, often an unassigned Inspector slot, causes this error.'),
          q('When is a breakpoint more useful than Debug.Log?', [
            'For stepping through complex logic and inspecting values',
            'For printing a single message once',
            'For changing the colour of the Console',
            'For building the game for Android',
          ], 0, 'Breakpoints pause execution so you can examine exactly what the code is doing.'),
          q('Why remove Debug.Log calls from Update after fixing a bug?', [
            'Logs change the game\'s physics',
            'Unity limits scripts to ten logs',
            'Logs are only allowed in Start',
            'Logging every frame slows the game and floods the Console',
          ], 3, 'Frequent logging has a performance cost and hides important messages.'),
        ]
      ),
      ],
      [
      q('Which type does Unity use for most measurements like speed and time?', [
        'int',
        'string',
        'float',
        'bool',
      ], 2, 'Floats represent decimal values such as speeds, positions and times.'),
      q('In which method should camera-following code usually run?', [
        'Awake',
        'FixedUpdate',
        'OnDestroy',
        'LateUpdate',
      ], 3, 'LateUpdate runs after all Update calls, so the camera follows the player\'s final position each frame.'),
      q('Which attribute adds a slider with limits in the Inspector?', [
        '[Range(0f, 20f)]',
        '[Header("Movement")]',
        '[Space]',
        '[Tooltip("Speed")]',
      ], 0, 'Range displays a slider constrained between the given values.'),
      q('What is the first step in a methodical debugging approach?', [
        'Rewrite the whole script',
        'Reproduce the bug reliably',
        'Delete recent changes randomly',
        'Ask for help before reading the error',
      ], 1, 'A reliable reproduction makes testing guesses and confirming fixes possible.'),
      ]
    ),
    chapter(
      'Movement, Input and Physics',
      'Move and rotate objects with transforms and vectors, read player input with Unity\'s Input System, simulate movement with rigidbodies and colliders, and respond to collisions and triggers to build gameplay.',
      [
      lesson('Transforms, Vectors and Rotation', 13, `
Every object in a Unity scene has a Transform describing where it is, how it is rotated and how large it is. Moving characters, aiming weapons and positioning cameras all come down to working with transforms and the vectors that describe positions and directions.

### Position, rotation and scale

\`\`\`csharp
transform.position = new Vector3(0f, 1f, 0f);   // where the object is
transform.rotation = Quaternion.identity;      // no rotation
transform.localScale = new Vector3(2f, 2f, 2f); // twice the size
\`\`\`

\`position\` is the world position. \`localPosition\` is relative to the parent, which matters for child objects such as a weapon held by a character.

### Vectors

A vector has a direction and a length. Unity uses \`Vector2\` for 2D and \`Vector3\` for 3D:

| Useful value | Meaning |
|---|---|
| \`Vector3.up\`, \`Vector3.right\`, \`Vector3.forward\` | Unit directions along the world axes |
| \`transform.forward\`, \`transform.right\` | The object's own facing directions |
| \`vector.magnitude\` | The length of a vector |
| \`vector.normalized\` | The same direction with length 1 |
| \`Vector3.Distance(a, b)\` | Distance between two points |

### Moving an object

\`\`\`csharp
[SerializeField] private float speed = 5f;

void Update()
{
    Vector3 direction = new Vector3(1f, 0f, 0f);
    transform.Translate(direction * speed * Time.deltaTime);
}
\`\`\`

\`Translate\` moves relative to the object's own orientation by default. Multiplying by \`Time.deltaTime\` keeps the speed consistent across devices, as chapter 2 explained.

### Diagonal movement

If a player presses right and up together, the direction vector (1, 1) has a length of about 1.41, making diagonal movement faster. Normalise it:

\`\`\`csharp
Vector2 input = new Vector2(1f, 1f);
Vector2 direction = input.normalized;   // length 1, same direction
\`\`\`

### Moving towards a target

\`\`\`csharp
transform.position = Vector3.MoveTowards(
    transform.position, target.position, speed * Time.deltaTime);
\`\`\`

\`MoveTowards\` moves at a constant speed and stops exactly at the target, handy for enemies, platforms and collectibles that fly to the player.

### Smooth movement with Lerp

\`\`\`csharp
transform.position = Vector3.Lerp(transform.position, target.position, 5f * Time.deltaTime);
\`\`\`

Lerp moves a fraction of the remaining distance each frame, giving a smooth ease-out feel, often used for cameras and UI.

### Rotation

Unity stores rotations as quaternions, which avoid problems that simple angles have. You rarely edit quaternions directly; use helpers:

\`\`\`csharp
transform.Rotate(0f, 90f * Time.deltaTime, 0f);                       // spin
transform.rotation = Quaternion.Euler(0f, 45f, 0f);                    // set angles
transform.rotation = Quaternion.LookRotation(target.position - transform.position); // face a target
\`\`\`

In 2D, rotation is usually around the Z axis:

\`\`\`csharp
float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
transform.rotation = Quaternion.Euler(0f, 0f, angle);
\`\`\`

This rotates a 2D turret or arrow to point in a direction.

### Flipping 2D sprites

To face left or right in 2D, flip the sprite rather than rotating the whole object:

\`\`\`csharp
spriteRenderer.flipX = direction.x < 0f;
\`\`\`

### Transform or physics?

Moving with the transform directly is simple and fine for objects without physics, such as moving platforms driven by code, UI or decorations. For objects that must collide realistically, such as players and projectiles, move them through a Rigidbody instead, covered in the third lesson of this chapter.
      `,
        [
          q('Why normalise a diagonal input vector?', [
            'To make movement slower in all directions',
            'To rotate the player by 45 degrees',
            'So diagonal movement is not faster than straight movement',
            'To convert the vector into a float',
          ], 2, 'Normalising keeps length 1, so diagonal speed matches straight-line speed.'),
          q('What does Vector3.MoveTowards do?', [
            'Moves at a constant speed and stops exactly at the target',
            'Teleports the object to the target instantly',
            'Rotates the object to face the target',
            'Moves a fraction of the distance each frame',
          ], 0, 'MoveTowards advances a fixed step per call without overshooting the target.'),
          q('How are 2D characters usually turned to face left or right?', [
            'By scaling them to zero',
            'By rotating the camera',
            'By deleting and respawning them',
            'By flipping the sprite on the X axis',
          ], 3, 'Setting flipX mirrors the sprite without rotating the whole object.'),
        ]
      ),
      lesson('Player Input With the Input System', 13, `
A game is only as good as its controls. Unity's Input System package, the recommended approach for new projects, maps keyboard, mouse, gamepad and touch controls to named actions such as Move, Jump and Fire. Your code responds to actions, not specific keys, so the same game works across devices.

### Why actions instead of keys

| Old approach | Input System approach |
|---|---|
| Check \`Input.GetKeyDown(KeyCode.Space)\` in code | Define a "Jump" action bound to Space, gamepad button and touch button |
| Adding gamepad support means changing code | Add a binding in the actions asset; code stays the same |
| Rebinding keys is complex | Rebinding is supported by the system |

Many older tutorials use the legacy \`Input\` class. It still works when enabled in project settings, but new projects should use the Input System.

### Setting up actions

\`\`\`text
1. Make sure the Input System package is installed (Package Manager).
2. Create an Input Actions asset (Create > Input Actions) or use the
   default one included in new project templates.
3. Add an action map, for example "Player".
4. Add actions: Move (Value, Vector2), Jump (Button), Fire (Button).
5. Add bindings: Move to WASD and the gamepad left stick;
   Jump to Space and the gamepad south button.
\`\`\`

### Reading actions in a script

One common approach is to reference actions directly:

\`\`\`csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerInputReader : MonoBehaviour
{
    [SerializeField] private InputActionReference moveAction;
    [SerializeField] private InputActionReference jumpAction;

    public Vector2 Move { get; private set; }
    public bool JumpPressedThisFrame { get; private set; }

    void OnEnable()
    {
        moveAction.action.Enable();
        jumpAction.action.Enable();
    }

    void OnDisable()
    {
        moveAction.action.Disable();
        jumpAction.action.Disable();
    }

    void Update()
    {
        Move = moveAction.action.ReadValue<Vector2>();
        JumpPressedThisFrame = jumpAction.action.WasPressedThisFrame();
    }
}
\`\`\`

Drag the actions from your Input Actions asset into the Inspector slots. Other scripts, such as the movement controller, read \`Move\` and \`JumpPressedThisFrame\`. The Player Input component offers another approach, sending messages or events to your scripts when actions happen.

### Touch controls for mobile

For phones, the Input System works with on-screen controls:

- **On-Screen Stick** creates a virtual joystick that feeds the Move action.
- **On-Screen Button** feeds actions like Jump.

Because they drive the same actions, your gameplay code does not change between keyboard and touch. Chapter 7 covers designing touch UI that fits all screen sizes.

### Separating input from movement

Keeping input reading in one script and movement in another, as above, makes both easier to test and change. The movement code does not care whether input came from a keyboard, gamepad, touch screen or an AI controlling an enemy.

### Input feel

Good controls feel responsive. Common techniques include:

| Technique | Purpose |
|---|---|
| Dead zones | Ignore tiny stick movements |
| Input buffering | Remember a jump pressed slightly before landing |
| Coyote time | Allow jumping briefly after leaving a ledge |
| Acceleration and deceleration | Smooth starts and stops |

Chapter 4's platformer controller uses buffering and coyote time, which players rarely notice consciously but always feel.

### Testing input

Test on every target device early: keyboard on PC, gamepad if supported, and real phones for touch. The Input Debugger window (Window, Analysis, Input Debugger) shows connected devices and live action values, which helps when controls do not respond as expected.
      `,
        [
          q('What is the main advantage of input actions over checking specific keys?', [
            'Actions make the game use less memory',
            'Code responds to named actions, so new devices need only new bindings',
            'Actions only work on keyboards',
            'Keys cannot be read in Unity 6',
          ], 1, 'Action-based input separates gameplay code from specific devices and keys.'),
          q('How does an On-Screen Stick work with gameplay code?', [
            'It feeds the same Move action, so the code does not change',
            'It requires a separate movement script for phones',
            'It replaces the Input System entirely',
            'It only works in the editor',
          ], 0, 'On-screen controls drive existing actions, keeping gameplay code device-independent.'),
          q('What does input buffering do?', [
            'Slows down all player input',
            'Records input for replays only',
            'Disables input during animations',
            'Remembers a press made slightly before it can be used',
          ], 3, 'Buffering makes controls forgiving, for example a jump pressed just before landing.'),
        ]
      ),
      lesson('Rigidbodies and Colliders', 14, `
Physics makes games feel alive: objects fall, bounce, slide and push each other. Unity's physics engine simulates this for you when objects have Rigidbodies and Colliders. Understanding how they work, and how to move physics objects correctly, prevents the jittering, tunnelling and sticking that plague beginner games.

### Colliders: shapes for physics

A collider defines an object's physical shape. It is invisible in the game but drawn in the Scene view:

| 2D colliders | 3D colliders |
|---|---|
| Box Collider 2D | Box Collider |
| Circle Collider 2D | Sphere Collider |
| Capsule Collider 2D | Capsule Collider |
| Polygon Collider 2D | Mesh Collider |
| Composite Collider 2D (for tilemaps) | Terrain Collider |

Simple shapes, boxes, circles and capsules, are much faster than detailed mesh or polygon colliders. Characters usually use capsules; crates use boxes.

### Rigidbodies: objects that move with physics

A Rigidbody (or Rigidbody 2D) makes an object respond to gravity, forces and collisions:

| Setting | Effect |
|---|---|
| Mass | How heavy it is when pushed or colliding |
| Gravity Scale (2D) or Use Gravity (3D) | Whether and how strongly gravity pulls it |
| Drag | Slows movement over time |
| Constraints | Freeze position or rotation on chosen axes |
| Interpolate | Smooths visual movement between physics steps |
| Collision Detection | Continuous mode prevents fast objects passing through walls |

For platformer characters, freeze rotation so the player does not tip over when bumping into things.

### Body types

| Type | Behaviour | Example |
|---|---|---|
| Dynamic | Fully simulated: gravity, forces, collisions | Player, crates, balls |
| Kinematic | Moved by code; pushes dynamic bodies but is not pushed | Moving platforms, elevators |
| Static (no Rigidbody) | Never moves | Ground, walls |

### Moving physics objects correctly

Do not move a Rigidbody by changing \`transform.position\` directly; that teleports it and bypasses physics, causing objects to pass through walls. Instead:

\`\`\`csharp
Rigidbody2D rb;

void FixedUpdate()
{
    // Set velocity directly: responsive, common for player movement
    rb.linearVelocity = new Vector2(input.x * moveSpeed, rb.linearVelocity.y);
}

void Jump()
{
    // Apply an instant force
    rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
}
\`\`\`

In recent Unity versions, the velocity property is named \`linearVelocity\`; older versions and tutorials use \`velocity\`. Kinematic bodies are moved with \`MovePosition\` in \`FixedUpdate\`.

### Physics materials

Physics materials control friction and bounciness. A character with friction sticks to walls when pressed against them in a platformer; a frictionless physics material on the player collider fixes this. A bouncy material makes balls bounce.

### Layers and collision matrix

Put objects on layers, such as Player, Enemies, Ground and Projectiles, and use the collision matrix in Project Settings (Physics or Physics 2D) to choose which layers collide. For example, enemy bullets can ignore other enemies. This prevents unwanted collisions and improves performance.

### Tunnelling

A small, fast object, such as a bullet, may move so far in one physics step that it skips over a thin wall entirely. Continuous collision detection on the fast object, thicker colliders or raycasts for bullets (chapter 8) solve this.

### 2D and 3D physics are separate

Unity has separate 2D and 3D physics systems. A Rigidbody 2D only interacts with 2D colliders, and a 3D Rigidbody only with 3D colliders. Mixing them is a common mistake: nothing collides, and no error appears.
      `,
        [
          q('Why should a Rigidbody not be moved by setting transform.position?', [
            'Transforms cannot be changed at runtime',
            'It makes the object invisible',
            'It bypasses physics, letting objects pass through walls',
            'Unity deletes the Rigidbody',
          ], 2, 'Teleporting ignores collisions; physics objects should move with velocity, forces or MovePosition.'),
          q('Which body type suits a moving platform controlled by code?', [
            'Dynamic',
            'Kinematic',
            'Static without a Rigidbody',
            'A physics material',
          ], 1, 'Kinematic bodies move by code and push dynamic bodies without being pushed themselves.'),
          q('A 2D player collides with nothing. What is a likely cause?', [
            'It has a 3D collider while the ground uses 2D colliders',
            'The player sprite is too colourful',
            'The scene was not saved',
            'The camera is too far away',
          ], 0, '2D and 3D physics are separate, so mixed colliders never interact.'),
        ]
      ),
      lesson('Collisions and Triggers', 13, `
Collisions are where gameplay happens: the player lands on a platform, a bullet hits an enemy, a coin is collected, a door opens when the player walks close. Unity reports these events to your scripts, and choosing between solid collisions and triggers is a basic design decision.

### Solid collisions

When two colliders touch and at least one has a Rigidbody, Unity calls collision methods:

\`\`\`csharp
void OnCollisionEnter2D(Collision2D collision)
{
    if (collision.gameObject.CompareTag("Enemy"))
    {
        TakeDamage(10);
    }
}
\`\`\`

| Method (2D shown) | Called when |
|---|---|
| \`OnCollisionEnter2D\` | Contact begins |
| \`OnCollisionStay2D\` | Every physics step while touching |
| \`OnCollisionExit2D\` | Contact ends |

The 3D versions are named without "2D": \`OnCollisionEnter(Collision collision)\`.

### Triggers

A trigger is a collider with Is Trigger ticked. It detects overlap but does not block movement:

\`\`\`csharp
void OnTriggerEnter2D(Collider2D other)
{
    if (other.CompareTag("Player"))
    {
        ScoreManager.AddPoints(10);
        Destroy(gameObject);
    }
}
\`\`\`

| Use a trigger for | Use a solid collision for |
|---|---|
| Collectibles such as coins and power-ups | Ground, walls and platforms |
| Zones: checkpoints, finish lines, damage areas | Objects that push or bounce |
| Detection ranges for enemies | Physical impacts |
| Doors that open when approached | Stacking crates |

### Requirements for events

For collision or trigger events to fire:

- Both objects need colliders.
- At least one object needs a Rigidbody.
- In 2D, both must use 2D components; in 3D, 3D components.
- Their layers must be allowed to interact in the collision matrix.

When events do not fire, check this list first.

### Tags and layers for identification

Use tags to identify what was hit:

\`\`\`csharp
if (other.CompareTag("Coin")) { /* collect */ }
\`\`\`

\`CompareTag\` is faster and safer than comparing \`other.tag == "Coin"\`. Set tags on objects in the Inspector. For more complex games, checking for a component is often better:

\`\`\`csharp
if (other.TryGetComponent(out Health health))
{
    health.TakeDamage(damage);
}
\`\`\`

This works for anything with a Health component, player or enemy, without caring about tags.

### Contact information

Collisions provide details such as contact points and the impact's relative velocity:

\`\`\`csharp
void OnCollisionEnter2D(Collision2D collision)
{
    float impact = collision.relativeVelocity.magnitude;
    if (impact > 8f)
    {
        PlayBigThud();
    }
}
\`\`\`

Useful for sounds and damage that depend on how hard objects hit.

### Ground detection

Knowing whether a player is standing on the ground is essential for jumping. Instead of relying only on collision events, many controllers check a small area under the feet each physics step:

\`\`\`csharp
bool isGrounded = Physics2D.OverlapCircle(groundCheck.position, 0.1f, groundLayer);
\`\`\`

This is reliable and precise. Chapter 4 uses it in the platformer controller.

### A small gameplay loop

With triggers and collisions, you can already build a complete mini-game: a player that moves and jumps, coins to collect with a trigger, spikes that reset the player with a trigger, and a finish flag that ends the level. Build it; it is the foundation of the 2D game in the next chapter.
      `,
        [
          q('When should a collider be set as a trigger?', [
            'For the ground the player stands on',
            'For walls that block movement',
            'For crates that should stack',
            'For a coin the player collects by touching',
          ], 3, 'Triggers detect overlap without blocking, ideal for collectibles and zones.'),
          q('What is required for trigger or collision events to fire?', [
            'Colliders on both objects and a Rigidbody on at least one',
            'A camera pointing at both objects',
            'Both objects must be static',
            'An Audio Source on each object',
          ], 0, 'Physics events need colliders and at least one Rigidbody, with compatible layers.'),
          q('Why use TryGetComponent to find a Health component on the hit object?', [
            'It is required for triggers to work',
            'It changes the object\'s tag',
            'It works for any object with Health, without relying on tags',
            'It makes collisions faster',
          ], 2, 'Checking for a component makes damage code reusable across players, enemies and objects.'),
        ]
      ),
      ],
      [
      q('Which property gives an object\'s position relative to its parent?', [
        'position',
        'localPosition',
        'rotation',
        'localScale',
      ], 1, 'localPosition is relative to the parent, while position is in world space.'),
      q('Where are input bindings for keyboard, gamepad and touch defined?', [
        'In each movement script separately',
        'In the Console window',
        'In the scene\'s lighting settings',
        'In an Input Actions asset',
      ], 3, 'The Input Actions asset maps devices to named actions used by code.'),
      q('Which setting prevents a fast bullet from passing through a thin wall?', [
        'Continuous collision detection',
        'A higher Gravity Scale',
        'A bouncy physics material',
        'Freezing rotation',
      ], 0, 'Continuous detection checks the path between physics steps, preventing tunnelling.'),
      q('Which method runs when a 3D solid collision begins?', [
        'OnTriggerEnter2D',
        'OnCollisionExit',
        'OnCollisionEnter',
        'OnTriggerStay2D',
      ], 2, 'OnCollisionEnter fires when two 3D colliders start touching.'),
      ]
    ),
    chapter(
      'Building a 2D Game',
      'Import and organise sprites with sorting layers, design levels quickly with tilemaps, write a platformer controller that feels good to play, and make the camera follow the player smoothly with Cinemachine.',
      [
      lesson('Sprites, Sorting and 2D Setup', 13, `
Sprites are the 2D images that make up your game: characters, platforms, backgrounds, coins. Getting their import settings and drawing order right from the start gives you crisp visuals and avoids the confusing situation where the player disappears behind the background.

### Importing sprites

Drag images (PNG is the usual choice because it supports transparency) into the Assets folder. Select one and check its import settings in the Inspector:

| Setting | Recommended value | Why |
|---|---|---|
| Texture Type | Sprite (2D and UI) | Makes the image usable as a sprite |
| Sprite Mode | Single, or Multiple for sprite sheets | Multiple lets you slice one image into many sprites |
| Pixels Per Unit | Match your art, for example 16 or 32 for pixel art | Controls how large the sprite appears in world units |
| Filter Mode | Point (no filter) for pixel art | Keeps pixels sharp instead of blurry |
| Compression | None or high quality for pixel art | Avoids colour artefacts |

Pixels Per Unit matters more than beginners expect. If a 32-pixel character uses 32 pixels per unit, it is one unit tall, which keeps physics and movement values sensible. Use the same value across your art so everything is in proportion.

### Sprite sheets and slicing

Characters and tiles often come as sprite sheets: one image containing many frames. Set Sprite Mode to Multiple, open the Sprite Editor and use Slice, either automatic or grid by cell size, to cut the sheet into individual sprites. These frames later become animations (chapter 6).

### Drawing order

In 2D, the order in which sprites are drawn decides what appears in front. Unity uses:

| Control | How it works |
|---|---|
| Sorting Layer | Named layers drawn in order, such as Background, Environment, Characters, Foreground |
| Order in Layer | A number within a sorting layer; higher draws on top |

\`\`\`text
Sorting layers (drawn first to last):
  Background   -> sky, distant mountains
  Environment  -> tiles, platforms
  Items        -> coins, pickups
  Characters   -> player, enemies
  Foreground   -> grass or fog in front of the player
\`\`\`

Create sorting layers under Project Settings, Tags and Layers, then set each Sprite Renderer's layer. Relying on Z position alone for 2D ordering is fragile; sorting layers are clearer.

### Top-down games

In top-down games, characters further down the screen should appear in front of those above. Setting the Transparency Sort Axis in the renderer settings to sort by the Y axis handles this automatically, so a player walking behind a tree is hidden by it.

### Parallax backgrounds

Layered backgrounds that move at different speeds as the camera moves create depth. A simple script moves each background layer by a fraction of the camera's movement: distant mountains move slowly, nearer hills faster. It is a cheap effect that makes 2D games feel much richer.

### Sprite atlases

Many separate sprite images mean more work for the graphics hardware. A Sprite Atlas packs sprites into one larger texture so Unity can draw many of them together, improving performance, especially on mobile. Create one (Create, 2D, Sprite Atlas) and add your sprite folders to it. Chapter 10 covers performance in more depth.

### Finding art

If you are not an artist, use free or paid asset packs from sources such as the Unity Asset Store or itch.io, checking each licence for commercial use. Consistent art style matters more than detail: a game with simple, matching shapes looks better than one mixing styles from many packs.
      `,
        [
          q('Which filter mode keeps pixel art sharp?', [
            'Bilinear',
            'Point (no filter)',
            'Trilinear',
            'Anisotropic',
          ], 1, 'Point filtering avoids blurring between pixels, which suits pixel art.'),
          q('What decides which sprite appears in front in 2D?', [
            'Sorting layers and order in layer',
            'The sprite\'s file size',
            'Alphabetical order of names',
            'The order sprites were imported',
          ], 0, 'Sorting layers and order values control the 2D drawing order.'),
          q('Why use a Sprite Atlas?', [
            'To make sprites larger on screen',
            'To convert sprites into 3D models',
            'To pack sprites together so they draw faster',
            'To add animations automatically',
          ], 2, 'Atlases reduce texture switches, which improves rendering performance.'),
        ]
      ),
      lesson('Tilemaps for Level Design', 14, `
Placing hundreds of individual sprites to build a level is slow and hard to change. Unity's Tilemap system lets you paint levels with tiles, like drawing on a grid, and generates collision automatically. Level design becomes fast and fun, and changing a layout takes minutes.

### Setting up a tilemap

\`\`\`text
1. GameObject > 2D Object > Tilemap > Rectangular
   -> creates a Grid with a Tilemap child
2. Window > 2D > Tile Palette
3. Create a new palette, then drag your sliced tile sprites into it
   -> Unity creates tile assets
4. Select a tile and paint in the Scene view
\`\`\`

### Tile Palette tools

| Tool | Use |
|---|---|
| Brush | Paint single tiles |
| Box fill | Fill a rectangle |
| Picker | Pick a tile from the scene |
| Eraser | Remove tiles |
| Flood fill | Fill a connected area |

### Multiple tilemaps as layers

Use separate tilemaps under the same Grid for different purposes:

| Tilemap | Contents | Collision |
|---|---|---|
| Background | Decorative back walls, windows | None |
| Ground | Platforms and walls the player stands on | Yes |
| Hazards | Spikes, lava | Trigger |
| Foreground | Grass and details in front of the player | None |

Each tilemap's renderer can have its own sorting layer, so decorations appear correctly in front of or behind the player.

### Collision for tilemaps

Add a Tilemap Collider 2D to the Ground tilemap to give every tile a collider. On its own, this creates many small colliders, and the seams between them can snag a sliding character. Merge them into one smooth shape:

\`\`\`text
Ground tilemap components:
  Tilemap Collider 2D  -> set Composite Operation to Merge
  Composite Collider 2D
  Rigidbody 2D         -> Body Type: Static
\`\`\`

The composite collider combines tiles into continuous outlines, which is smoother for movement and faster for physics. Older Unity versions use a "Used By Composite" checkbox instead of the Composite Operation setting.

### Rule tiles

Painting every edge and corner tile by hand is tedious. Rule Tiles, from the 2D Tilemap Extras package, choose the correct sprite automatically based on neighbouring tiles. Paint a rough shape and the edges, corners and inner tiles appear correctly. This speeds up level building enormously.

### Animated tiles

Animated tiles cycle through sprites for water, torches or conveyor belts, adding life without extra scripts.

### Level design principles

Tools make levels quick to build, but good levels need design:

- **Teach, then test.** Introduce a mechanic safely, such as a small gap, before combining it with danger.
- **Pacing.** Alternate intense sections with calm ones.
- **Signposting.** Use visual cues, such as coins leading upwards, to guide players.
- **Checkpoints.** Place them before difficult sections so failure is not too punishing.
- **Playtest.** Watch others play; places where they struggle or get lost show what to fix.

### Sketch first

Sketch levels on paper or in a simple drawing before building. Decide where the challenges, rewards and checkpoints go. It is much faster to change a sketch than a finished level, and a clear plan avoids aimless levels that feel random.

### Practice task

Build a short level with three sections: a safe start that teaches jumping, a middle with gaps and hazards, and an end with a flag. Use separate tilemaps for background, ground and hazards, and give the hazards a trigger collider that resets the player.
      `,
        [
          q('How do you create a tilemap in a 2D scene?', [
            'Import a 3D model and flatten it',
            'Add a Rigidbody to each sprite',
            'Write a script that places each tile',
            'Create a Grid with a Tilemap and paint from a Tile Palette',
          ], 3, 'Tilemaps live under a Grid, and tiles are painted from the Tile Palette window.'),
          q('Why add a Composite Collider 2D to a ground tilemap?', [
            'To merge tile colliders into smooth outlines',
            'To make tiles animated',
            'To change the tile colours',
            'To add sound to each tile',
          ], 0, 'Merged outlines remove seams that snag characters and reduce physics work.'),
          q('What do Rule Tiles do?', [
            'Enforce game rules for players',
            'Limit how many tiles a level can use',
            'Pick the right edge and corner sprites automatically',
            'Convert tiles into enemies',
          ], 2, 'Rule Tiles choose sprites based on neighbouring tiles, speeding up level painting.'),
        ]
      ),
      lesson('A 2D Platformer Controller', 15, `
The player controller is the heart of a platformer. Players forgive simple graphics but not controls that feel sluggish or unfair. This lesson builds a controller with responsive movement, reliable ground detection and the small forgiveness tricks that make jumping feel great.

### The controller

\`\`\`csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class PlatformerController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float moveSpeed = 8f;
    [SerializeField] private float jumpVelocity = 14f;

    [Header("Ground check")]
    [SerializeField] private Transform groundCheck;
    [SerializeField] private float groundRadius = 0.15f;
    [SerializeField] private LayerMask groundLayer;

    [Header("Forgiveness")]
    [SerializeField] private float coyoteTime = 0.1f;
    [SerializeField] private float jumpBufferTime = 0.1f;

    [Header("Gravity")]
    [SerializeField] private float normalGravity = 3f;
    [SerializeField] private float fallGravity = 6f;

    [SerializeField] private PlayerInputReader input;

    private Rigidbody2D rb;
    private float coyoteTimer;
    private float jumpBufferTimer;

    void Awake() => rb = GetComponent<Rigidbody2D>();

    void Update()
    {
        bool grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, groundLayer);
        coyoteTimer = grounded ? coyoteTime : coyoteTimer - Time.deltaTime;
        jumpBufferTimer = input.JumpPressedThisFrame ? jumpBufferTime : jumpBufferTimer - Time.deltaTime;
    }

    void FixedUpdate()
    {
        rb.linearVelocity = new Vector2(input.Move.x * moveSpeed, rb.linearVelocity.y);

        if (jumpBufferTimer > 0f && coyoteTimer > 0f)
        {
            rb.linearVelocity = new Vector2(rb.linearVelocity.x, jumpVelocity);
            jumpBufferTimer = 0f;
            coyoteTimer = 0f;
        }

        bool rising = rb.linearVelocity.y > 0f;
        rb.gravityScale = (rising && input.JumpHeld) ? normalGravity : fallGravity;
    }
}
\`\`\`

Add a \`JumpHeld\` property to the input reader from chapter 3, set with \`jumpAction.action.IsPressed()\`. \`RequireComponent\` makes Unity add a Rigidbody 2D automatically if one is missing.

### Setting it up

\`\`\`text
Player
  Sprite Renderer, Rigidbody 2D (freeze Z rotation, Interpolate on),
  Capsule Collider 2D (frictionless physics material),
  PlayerInputReader, PlatformerController
  GroundCheck   -> empty child placed at the player's feet
\`\`\`

Put ground tilemaps on a "Ground" layer and select it in the controller's Ground Layer field.

### How each part helps

| Feature | What it does | Why players care |
|---|---|---|
| Velocity-based movement | Sets horizontal speed directly | Instant, responsive control |
| Ground check circle | Detects ground under the feet | Reliable jumping, no double jumps from walls |
| Coyote time | Allows jumping briefly after leaving a ledge | Jumps near edges do not fail unfairly |
| Jump buffer | Remembers a jump pressed just before landing | Presses are never "eaten" |
| Variable jump height | Stronger gravity when jump is released | Tap for small hops, hold for high jumps |
| Faster falling | Stronger gravity on the way down | Jumps feel weighty rather than floaty |

### Tuning

Values like speed, jump velocity and gravity decide how the game feels. Tune them in Play mode using the Inspector, then write down what works. Test with levels that use the jump: if gaps are designed for a particular jump height, changing the jump later breaks the levels, so settle movement early.

### Adding acceleration

Instant speed changes suit tight platformers. For a heavier feel, accelerate towards the target speed:

\`\`\`csharp
float target = input.Move.x * moveSpeed;
float newX = Mathf.MoveTowards(rb.linearVelocity.x, target, acceleration * Time.fixedDeltaTime);
rb.linearVelocity = new Vector2(newX, rb.linearVelocity.y);
\`\`\`

### Common bugs

| Symptom | Likely cause |
|---|---|
| Player sticks to walls | Friction on the collider; use a frictionless material |
| Cannot jump at all | Ground layer not set, or GroundCheck too high |
| Jumps in mid-air | Ground check radius too large or detecting the player's own collider |
| Jittery movement | Interpolate off, or moving the transform instead of the Rigidbody |

### Extending the controller

Once basics feel good, add double jumps, wall slides, dashes or ladders. Add them one at a time and test each, because every new ability interacts with the others and with your level designs.
      `,
        [
          q('What does coyote time allow?', [
            'Double jumping anywhere in the air',
            'Running faster near ledges',
            'Skipping levels after failing',
            'Jumping briefly after leaving a ledge',
          ], 3, 'Coyote time forgives jumps pressed just after walking off an edge.'),
          q('A player sticks to walls when pushing into them. What is the likely fix?', [
            'Increase the gravity scale',
            'Give the collider a frictionless physics material',
            'Remove the Rigidbody 2D',
            'Turn off the Sprite Renderer',
          ], 1, 'Friction between player and wall holds the player; a frictionless material prevents it.'),
          q('How does the controller create variable jump height?', [
            'Stronger gravity when jump is released while rising',
            'A random jump force for every jump',
            'A slower animation for high jumps',
            'Moving the ground lower each time',
          ], 0, 'Releasing jump early switches to higher gravity, cutting the jump short.'),
        ]
      ),
      lesson('Camera Follow With Cinemachine', 13, `
A camera that snaps rigidly to the player feels harsh, and one that lags too much loses the player. Cinemachine, Unity's camera package, gives you smooth following, dead zones, level boundaries and effects like screen shake without writing camera code.

### Why not a simple script?

A basic follow script copies the player's position every frame:

\`\`\`csharp
void LateUpdate()
{
    transform.position = new Vector3(player.position.x, player.position.y, -10f);
}
\`\`\`

It works but feels stiff. Adding smoothing, look-ahead, dead zones and boundaries by hand takes a lot of code. Cinemachine provides all of these as settings.

### Setting up Cinemachine

\`\`\`text
1. Install Cinemachine from the Package Manager.
2. Add a Cinemachine camera to the scene
   (GameObject > Cinemachine; choose a 2D or follow camera).
3. Unity adds a Cinemachine Brain to your Main Camera automatically.
4. Set the Cinemachine camera's Tracking Target (Follow) to the player.
\`\`\`

The Cinemachine camera is not a real camera; it tells the Main Camera, through the Brain, where to be. You can have several and switch between them, for example a wider view for a boss room. In Cinemachine 3, used with Unity 6, the component is called CinemachineCamera; older tutorials call it a Virtual Camera and use slightly different setting names.

### Key settings for 2D

| Setting | Effect |
|---|---|
| Position Composer (Framing Transposer in older versions) | Positions the camera relative to the target in screen space |
| Damping | How smoothly the camera catches up; higher is smoother |
| Dead zone | An area in which the player can move without the camera moving |
| Lookahead | Shifts the camera in the direction of movement, showing what is ahead |
| Orthographic size (lens) | How much of the world is visible; larger shows more |

A small dead zone stops the camera from jiggling with every small movement, and a little lookahead helps players see obstacles coming.

### Keeping the camera inside the level

Without limits, the camera shows empty space beyond the level edges. The Cinemachine Confiner 2D extension fixes this:

\`\`\`text
1. Create an empty object "CameraBounds" with a Polygon Collider 2D
   (set Is Trigger) around the playable area.
2. Add a Cinemachine Confiner 2D extension to the Cinemachine camera.
3. Assign the CameraBounds collider as its bounding shape.
\`\`\`

Put the bounds collider on a layer that does not collide with the player, so it does not interfere with gameplay.

### Pixel-perfect cameras

Pixel art can shimmer when the camera moves by fractions of a pixel. The Pixel Perfect Camera component, which works with URP and Cinemachine, snaps rendering to whole pixels so art stays crisp. Use it for pixel-art games and set its reference resolution to match your art.

### Switching cameras

Cinemachine blends smoothly between cameras when you change which one is active, or raise one's priority. Uses include:

- Zooming out for a boss fight.
- Focusing on a door that opens when a switch is pressed.
- A cutscene camera that pans across the level.

### Screen shake

The Cinemachine Impulse system provides screen shake: an Impulse Source on the object that causes the shake, such as an explosion, and an Impulse Listener on the camera. Chapter 6 uses it for game feel.

### Common camera mistakes

| Mistake | Fix |
|---|---|
| Camera jitters with physics movement | Enable Interpolate on the player's Rigidbody |
| Camera shows outside the level | Add a Confiner with a bounds shape |
| Player too close to the screen edge | Adjust screen position, dead zone or lookahead |
| Camera moves the wrong way in 2D | Check the camera is orthographic and at a negative Z |

Test the camera on the smallest screen you support: what looks comfortable on a monitor can feel cramped on a phone.
      `,
        [
          q('What does the Cinemachine Brain on the Main Camera do?', [
            'It records gameplay videos',
            'It replaces the physics engine',
            'It moves the real camera based on active Cinemachine cameras',
            'It draws the level\'s tilemaps',
          ], 2, 'Cinemachine cameras describe shots, and the Brain drives the real camera to match.'),
          q('What does a dead zone do?', [
            'Lets the player move a little without moving the camera',
            'Kills the player when they enter it',
            'Hides objects behind the camera',
            'Stops all input for a moment',
          ], 0, 'Dead zones prevent the camera from reacting to every small movement.'),
          q('Which extension keeps a 2D camera inside the level boundaries?', [
            'Pixel Perfect Camera',
            'Impulse Listener',
            'Cinemachine Brain',
            'Cinemachine Confiner 2D',
          ], 3, 'The Confiner limits the camera to a bounding shape around the level.'),
        ]
      ),
      ],
      [
      q('Why keep the same Pixels Per Unit across a game\'s art?', [
        'So sprites stay in proportion with each other',
        'So the game downloads faster',
        'So sprites animate automatically',
        'So the camera zooms correctly',
      ], 0, 'A consistent Pixels Per Unit keeps sprite sizes and world units consistent.'),
      q('Which tilemap in a level should usually have a trigger collider?', [
        'The background tilemap',
        'The foreground tilemap',
        'The hazards tilemap',
        'The decorative tilemap',
      ], 2, 'Hazards detect the player through triggers rather than blocking movement.'),
      q('What does a jump buffer prevent?', [
        'Players jumping too high',
        'The camera moving during jumps',
        'Enemies jumping on the player',
        'Jump presses being ignored just before landing',
      ], 3, 'Buffering stores a slightly early press and performs the jump on landing.'),
      q('What is the component called in Cinemachine 3 that older tutorials call a Virtual Camera?', [
        'Cinemachine Brain',
        'CinemachineCamera',
        'Impulse Source',
        'Framing Transposer',
      ], 1, 'Cinemachine 3 renamed the Virtual Camera component to CinemachineCamera.'),
      ]
    ),
    chapter(
      'Prefabs and Game Architecture',
      'Turn objects into reusable prefabs and variants, spawn and destroy them at runtime, store game data in ScriptableObjects, and connect systems with events so that code stays organised as a game grows.',
      [
      lesson('Prefabs and Prefab Variants', 13, `
A prefab is a saved, reusable GameObject: a template you can place many times. Every coin, enemy and bullet in a game is usually an instance of a prefab. Change the prefab once and every instance updates. Prefabs are how Unity games stay manageable as they grow from one level to fifty.

### Creating a prefab

\`\`\`text
1. Build the object in the scene: sprite, collider, scripts.
2. Drag it from the Hierarchy into a Prefabs folder in the Project window.
3. The object turns blue in the Hierarchy: it is now a prefab instance.
\`\`\`

Drag the prefab from the Project window into scenes to create more instances.

### Editing prefabs

Double-click a prefab to open it in Prefab Mode, an isolated editing view. Changes saved there apply to every instance in every scene. This is the main benefit: fix a bug in the enemy prefab once, and all enemies in all levels are fixed.

### Overrides

Each instance can override values, such as giving one coin a higher value. Overridden values show in bold in the Inspector with a blue line in the margin.

| Action | Effect |
|---|---|
| Apply override | Pushes the instance's change into the prefab, affecting all instances |
| Revert | Discards the instance's change, returning to the prefab's value |

The Overrides dropdown at the top of the Inspector lists all changes on an instance. Review it before applying, because applying to the prefab affects everything.

### Nested prefabs

Prefabs can contain other prefabs. A "House" prefab might include "Door" and "Window" prefabs. Updating the Door prefab updates every house. Nesting keeps large structures modular.

### Prefab variants

A variant inherits from a base prefab and changes some things:

\`\`\`text
Enemy (base prefab)
  Enemy_Fast   (variant: higher speed, red tint)
  Enemy_Tank   (variant: more health, larger scale)
  Enemy_Flying (variant: no gravity, different sprite)
\`\`\`

Change the base, for example adding a hit sound, and all variants get it, while keeping their own differences. This avoids copying the same enemy several times and fixing bugs in each copy.

### Prefabs versus copies

| Duplicating objects in the scene | Using prefabs |
|---|---|
| Each copy is independent | Instances share one source |
| Fixing a bug means fixing every copy | Fix the prefab once |
| Only exists in that scene | Reused across scenes |
| Cannot be spawned from code easily | Spawned with Instantiate |

As a rule, anything that appears more than once, or is created during gameplay, should be a prefab.

### Unpacking

Unpacking a prefab instance turns it back into a normal object, disconnected from the prefab. Occasionally useful for one-off modifications, but usually a mistake, because that object no longer receives prefab updates.

### Organising prefabs

Keep prefabs in clear folders, such as Prefabs/Enemies, Prefabs/Pickups and Prefabs/UI, and name them consistently. A game with hundreds of prefabs becomes painful to work in without organisation.

### Practice task

Turn your coin, spike and enemy from earlier chapters into prefabs. Create two enemy variants with different speeds and colours. Place several of each in your level, then change the base enemy prefab and confirm every instance and variant updates.
      `,
        [
          q('What is the main benefit of editing a prefab in Prefab Mode?', [
            'It makes the prefab load faster',
            'Changes apply to every instance in every scene',
            'It creates a separate copy for each scene',
            'It converts the prefab into a script',
          ], 1, 'Prefab edits propagate to all instances, so fixes happen once.'),
          q('What does a prefab variant do?', [
            'Copies the prefab with no connection to it',
            'Deletes the base prefab',
            'Converts a 2D prefab into 3D',
            'Inherits from a base prefab while changing some values',
          ], 3, 'Variants share the base\'s structure and receive its updates while keeping their own changes.'),
          q('What happens when you apply an override from an instance?', [
            'The change goes into the prefab and affects all instances',
            'Only that instance keeps the change',
            'The instance is unpacked',
            'The change is lost after saving',
          ], 0, 'Applying pushes the change into the prefab, so every instance receives it.'),
        ]
      ),
      lesson('Spawning and Destroying Objects', 13, `
Games constantly create and remove objects: bullets fired, enemies spawning in waves, coins appearing when a crate breaks, explosions after a hit. Unity's \`Instantiate\` and \`Destroy\` methods do this, and using them well, with spawners, lifetimes and cleanup, keeps gameplay dynamic and bug-free.

### Instantiate

\`\`\`csharp
[SerializeField] private GameObject bulletPrefab;
[SerializeField] private Transform firePoint;

void Fire()
{
    Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
}
\`\`\`

\`Instantiate\` creates a new instance of a prefab at a position and rotation. It returns the new object, so you can configure it:

\`\`\`csharp
GameObject bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
bullet.GetComponent<Bullet>().SetDamage(damage);
\`\`\`

A cleaner approach is to reference the prefab by its script type, which returns that component directly:

\`\`\`csharp
[SerializeField] private Bullet bulletPrefab;

void Fire()
{
    Bullet bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
    bullet.SetDamage(damage);
}
\`\`\`

### Destroy

\`\`\`csharp
Destroy(gameObject);          // destroy this object
Destroy(gameObject, 3f);      // destroy after 3 seconds
Destroy(enemy);               // destroy another object
\`\`\`

Destruction happens at the end of the current frame, not instantly. Code after \`Destroy\` in the same method still runs.

### Giving objects a lifetime

Bullets that miss must not fly forever, wasting memory and processing:

\`\`\`csharp
public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 15f;
    [SerializeField] private float lifetime = 2f;

    void Start()
    {
        GetComponent<Rigidbody2D>().linearVelocity = transform.right * speed;
        Destroy(gameObject, lifetime);
    }
}
\`\`\`

### An enemy spawner

\`\`\`csharp
public class EnemySpawner : MonoBehaviour
{
    [SerializeField] private Enemy enemyPrefab;
    [SerializeField] private Transform[] spawnPoints;
    [SerializeField] private float interval = 3f;

    private float timer;

    void Update()
    {
        timer += Time.deltaTime;
        if (timer >= interval)
        {
            timer = 0f;
            Transform point = spawnPoints[Random.Range(0, spawnPoints.Length)];
            Instantiate(enemyPrefab, point.position, Quaternion.identity);
        }
    }
}
\`\`\`

\`Random.Range\` with integers excludes the maximum, so \`Random.Range(0, spawnPoints.Length)\` returns a valid index. Chapter 9 turns this into waves with increasing difficulty.

### Parenting spawned objects

Spawned objects clutter the root of the Hierarchy. Passing a parent keeps things tidy:

\`\`\`csharp
Instantiate(enemyPrefab, point.position, Quaternion.identity, enemiesContainer);
\`\`\`

### Destroyed object pitfalls

| Problem | Cause | Fix |
|---|---|---|
| MissingReferenceException | Using a reference to a destroyed object | Check \`if (target != null)\` before use |
| Destroying the prefab asset | Calling Destroy on the prefab reference instead of the instance | Destroy the instance returned by Instantiate |
| Objects never cleaned up | No lifetime or off-screen cleanup | Add lifetimes or destroy when out of bounds |
| Frame drops when spawning many objects | Frequent Instantiate and Destroy | Use object pooling (chapter 10) |

Unity overrides the null check for destroyed objects, so \`target != null\` correctly returns false once an object has been destroyed.

### Spawning effects

When an enemy dies, spawn an explosion effect and a coin at its position before destroying it. Small touches like this make actions feel satisfying and are covered in the next chapter.

### Performance note

Creating and destroying objects frequently, for example hundreds of bullets per second, causes memory churn and garbage collection pauses, especially on phones. For frequently spawned objects, pooling reuses existing objects instead. Start with Instantiate and Destroy while learning, and switch to pooling when profiling shows a need.
      `,
        [
          q('Why give bullets a lifetime with Destroy(gameObject, 2f)?', [
            'To make bullets move faster',
            'To change the bullet\'s colour over time',
            'So missed bullets do not fly forever wasting resources',
            'To stop bullets from colliding',
          ], 2, 'Timed destruction cleans up objects that would otherwise persist indefinitely.'),
          q('What does Random.Range(0, spawnPoints.Length) return with integers?', [
            'A valid index, since the maximum is excluded',
            'A float between 0 and the length',
            'Always the last index',
            'An index that can be out of range',
          ], 0, 'The integer version excludes the maximum, so the result is a valid array index.'),
          q('How should code check whether a referenced object has been destroyed?', [
            'Compare its name to an empty string',
            'Check whether its position is zero',
            'Call Destroy on it again',
            'Test whether the reference is null',
          ], 3, 'Unity makes destroyed objects compare equal to null.'),
        ]
      ),
      lesson('ScriptableObjects for Game Data', 14, `
Games contain lots of data: weapon damage, enemy health, item prices, level settings. Hard-coding it in scripts or spreading it across prefab instances makes balancing painful. ScriptableObjects are data assets that live in the Project window, shared by any object that needs them. They are one of Unity's most useful tools for organised game design.

### Defining a ScriptableObject

\`\`\`csharp
using UnityEngine;

[CreateAssetMenu(fileName = "NewWeapon", menuName = "Game/Weapon Data")]
public class WeaponData : ScriptableObject
{
    public string weaponName;
    public int damage;
    public float fireRate;
    public Sprite icon;
    public AudioClip fireSound;
}
\`\`\`

\`CreateAssetMenu\` adds an entry to the Create menu. Right-click in the Project window, choose Create, Game, Weapon Data, and fill in values in the Inspector: "Pistol", "Shotgun", "Laser".

### Using the data

\`\`\`csharp
public class Weapon : MonoBehaviour
{
    [SerializeField] private WeaponData data;

    public void Fire()
    {
        // use data.damage, data.fireRate, data.fireSound
    }
}
\`\`\`

Assign different WeaponData assets to switch weapons. The Weapon script stays the same; only the data changes.

### Why ScriptableObjects help

| Without them | With them |
|---|---|
| Values scattered across prefabs and scripts | Data in named assets, easy to find |
| Balancing means opening many prefabs | Change one asset to rebalance |
| Each instance stores its own copy of data | Many objects share one asset, saving memory |
| Designers must edit code | Designers edit assets in the Inspector |

A game designer can balance twenty enemy types by editing twenty small data assets, without touching code or prefabs.

### Common uses

- Enemy stats, weapon stats, item definitions.
- Level configurations: enemy waves, time limits, music.
- Dialogue lines and quest definitions.
- Game settings such as difficulty presets.
- Lists of all items in a shop.

### A shop example

\`\`\`csharp
[CreateAssetMenu(menuName = "Game/Item")]
public class ItemData : ScriptableObject
{
    public string displayName;
    public int price;
    public Sprite icon;
    [TextArea] public string description;
}

[CreateAssetMenu(menuName = "Game/Shop Catalogue")]
public class ShopCatalogue : ScriptableObject
{
    public ItemData[] items;
}
\`\`\`

The shop UI reads the catalogue and builds buttons for each item. Adding an item means creating an asset and adding it to the list, with no code changes.

### An important warning

Changes made to a ScriptableObject during Play mode in the editor persist after stopping, unlike changes to scene objects. In a built game, changes do not persist between sessions. So:

- Treat ScriptableObjects as read-only data during gameplay.
- Store changing values, such as current health or coins, in normal scripts.
- Save progress with a save system (chapter 9), not by modifying ScriptableObjects.

Modifying a shared asset at runtime also affects every object using it: if one enemy reduces the shared health value, all enemies are affected. Copy values into the object at startup instead:

\`\`\`csharp
private int currentHealth;

void Awake()
{
    currentHealth = data.maxHealth;
}
\`\`\`

### Organising data

Keep data assets in folders such as Data/Weapons and Data/Enemies. Consistent naming, like Weapon_Pistol and Enemy_Slime, makes them easy to find. As a game grows, well-organised data assets become the main place designers work.
      `,
        [
          q('What does [CreateAssetMenu] do on a ScriptableObject class?', [
            'Adds it to the Create menu so assets can be made',
            'Creates a new scene for the data',
            'Converts it into a prefab',
            'Makes it run every frame',
          ], 0, 'The attribute lets you create data assets from the Project window\'s Create menu.'),
          q('Why store enemy stats in ScriptableObjects?', [
            'They make enemies move faster',
            'They are required for enemies to have colliders',
            'Designers can rebalance by editing shared data assets',
            'They remove the need for prefabs',
          ], 2, 'Centralised data assets make balancing quick and avoid scattered values.'),
          q('Why copy maxHealth from a ScriptableObject into a private field at startup?', [
            'ScriptableObjects cannot be read after Awake',
            'Private fields are faster to display',
            'Unity deletes ScriptableObjects at runtime',
            'Changing the shared asset would affect every enemy',
          ], 3, 'Shared assets are used by many objects, so runtime state belongs in each instance.'),
        ]
      ),
      lesson('Events and Decoupled Code', 13, `
As a game grows, scripts start referencing each other everywhere: the player tells the UI, the audio, the score manager and the achievements system every time it takes damage. Change one and several break. Events let scripts announce that something happened, while others choose to listen, keeping systems independent.

### The problem with direct references

\`\`\`csharp
// Player knows about everything: tightly coupled
void TakeDamage(int amount)
{
    health -= amount;
    healthBar.UpdateBar(health);
    audioManager.PlayHurtSound();
    cameraShake.Shake();
    achievementSystem.CheckDamageAchievements();
}
\`\`\`

If you remove the achievements system or reuse the player in another project, this code breaks. The player should only care about its own health.

### C# events

\`\`\`csharp
using System;
using UnityEngine;

public class Health : MonoBehaviour
{
    [SerializeField] private int maxHealth = 100;
    private int current;

    public event Action<int, int> HealthChanged;   // current, max
    public event Action Died;

    void Awake() => current = maxHealth;

    public void TakeDamage(int amount)
    {
        current = Mathf.Max(current - amount, 0);
        HealthChanged?.Invoke(current, maxHealth);
        if (current == 0) Died?.Invoke();
    }
}
\`\`\`

Listeners subscribe and unsubscribe:

\`\`\`csharp
public class HealthBar : MonoBehaviour
{
    [SerializeField] private Health health;

    void OnEnable() => health.HealthChanged += UpdateBar;
    void OnDisable() => health.HealthChanged -= UpdateBar;

    void UpdateBar(int current, int max)
    {
        // set fill amount to (float)current / max
    }
}
\`\`\`

\`Health\` no longer knows about the health bar. Add a sound player or camera shake by adding listeners, without changing \`Health\`.

### Always unsubscribe

Subscribing in \`OnEnable\` and unsubscribing in \`OnDisable\` is essential. Forgetting to unsubscribe leaves destroyed objects listening, which causes errors and memory leaks. The \`?.Invoke\` pattern safely does nothing when there are no listeners.

### UnityEvents: events in the Inspector

\`\`\`csharp
using UnityEngine.Events;

public class PressurePlate : MonoBehaviour
{
    [SerializeField] private UnityEvent onPressed;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player")) onPressed.Invoke();
    }
}
\`\`\`

In the Inspector, you connect \`onPressed\` to actions such as opening a door, playing a sound or starting an animation, without code. Designers can build interactions by wiring events.

| C# events | UnityEvents |
|---|---|
| Connected in code | Connected in the Inspector |
| Slightly faster | Very convenient for designers |
| Good for system-to-system messages | Good for level interactions and UI |

UI buttons use UnityEvents: their On Click list is a UnityEvent.

### Game-wide events

Some events matter across the whole game, such as "game over", "level completed" or "coin collected". A common pattern is a ScriptableObject event channel: an asset that systems raise and listen to without referencing each other at all. The coin raises "CoinCollected"; the score, sound and UI listen to the same asset. It builds on the previous lesson and scales well in larger projects.

### Avoid overusing singletons

Singletons, a single globally accessible instance such as \`GameManager.Instance\`, are convenient and fine for a few core managers. Relying on them for everything recreates the tight coupling that events solve. Chapter 9 discusses managers in more detail.

### How to decide

Ask: does this object need to know who reacts? If not, raise an event. The player should not know a health bar exists; it should announce that health changed. This single habit keeps growing games maintainable.
      `,
        [
          q('Why is a Player script that directly calls the UI, audio and achievements a problem?', [
            'It is tightly coupled, so changing one system breaks others',
            'It makes the game run on fewer platforms',
            'Unity does not allow scripts to call each other',
            'It prevents the player from taking damage',
          ], 0, 'Direct references to many systems make code fragile and hard to reuse.'),
          q('Where should a script subscribe and unsubscribe from events?', [
            'Subscribe in Update and never unsubscribe',
            'Subscribe in OnDestroy and unsubscribe in Start',
            'Subscribe in OnEnable and unsubscribe in OnDisable',
            'Subscribe in FixedUpdate each physics step',
          ], 2, 'Pairing OnEnable and OnDisable keeps subscriptions matched and prevents leaks.'),
          q('What is a key advantage of UnityEvents?', [
            'They run faster than any other code',
            'They replace the need for colliders',
            'They only work with UI elements',
            'Responses can be connected in the Inspector without code',
          ], 3, 'UnityEvents let designers wire interactions visually.'),
        ]
      ),
      ],
      [
      q('You have five similar enemies with small differences. What is the best setup?', [
        'Five unrelated prefabs copied from each other',
        'One base prefab with variants',
        'One scene object duplicated five times',
        'Five scripts with different names',
      ], 1, 'Variants share the base while keeping their differences, avoiding repeated fixes.'),
      q('Why does referencing a prefab by its script type help when instantiating?', [
        'It makes the prefab smaller on disk',
        'It prevents the prefab from being destroyed',
        'It removes the need for a position',
        'Instantiate returns that component directly',
      ], 3, 'Typed prefab references return the component, avoiding an extra GetComponent call.'),
      q('What happens to ScriptableObject changes made during Play mode in the editor?', [
        'They persist after stopping Play mode',
        'They are always lost when stopping',
        'They are uploaded to the cloud',
        'They only affect the first object',
      ], 0, 'Asset changes persist in the editor, which is why runtime state belongs elsewhere.'),
      q('What does raising an event let a script do?', [
        'Control every other script directly',
        'Skip the MonoBehaviour lifecycle',
        'Announce something happened without knowing who reacts',
        'Create new scenes automatically',
      ], 2, 'Events decouple the announcer from the listeners.'),
      ]
    ),
    chapter(
      'Game Feel and Feedback',
      'Animate characters with the Animator, add particles and visual effects, bring the game to life with sound and music, and apply the small touches of polish, such as screen shake and hit pauses, that make actions feel satisfying.',
      [
      lesson('Animation With the Animator', 14, `
Animation brings characters to life: running, jumping, attacking, idling. Unity's animation system has two parts: animation clips, which store the frames or movements, and the Animator Controller, a state machine that decides which clip plays based on what the character is doing.

### Creating 2D animation clips

For sprite-based characters:

\`\`\`text
1. Slice the character's sprite sheet (chapter 4).
2. Select the frames of one action, for example the run frames.
3. Drag them into the Scene or onto the character.
   -> Unity creates an animation clip and an Animator Controller.
4. Adjust the clip's sample rate (frames per second) in the Animation window.
\`\`\`

Repeat for idle, run, jump and fall. Name clips clearly, such as Player_Idle and Player_Run.

### The Animator Controller

Open it in the Animator window. It contains:

| Element | Purpose |
|---|---|
| States | Each plays a clip: Idle, Run, Jump, Fall |
| Transitions | Arrows between states, with conditions |
| Parameters | Values your script sets: Speed (float), IsGrounded (bool), Attack (trigger) |
| Layers | Separate state machines, for example upper body attacks while legs run |

### Driving the Animator from code

\`\`\`csharp
private Animator animator;
private static readonly int SpeedHash = Animator.StringToHash("Speed");
private static readonly int GroundedHash = Animator.StringToHash("IsGrounded");
private static readonly int VerticalHash = Animator.StringToHash("VerticalVelocity");

void Awake() => animator = GetComponent<Animator>();

void Update()
{
    animator.SetFloat(SpeedHash, Mathf.Abs(rb.linearVelocity.x));
    animator.SetBool(GroundedHash, isGrounded);
    animator.SetFloat(VerticalHash, rb.linearVelocity.y);
}
\`\`\`

Hashing parameter names once is slightly faster than passing strings every frame and avoids typos.

### Setting up transitions

\`\`\`text
Idle -> Run       condition: Speed > 0.1
Run  -> Idle      condition: Speed < 0.1
Any State -> Jump condition: IsGrounded false and VerticalVelocity > 0
Jump -> Fall      condition: VerticalVelocity < 0
Fall -> Idle      condition: IsGrounded true
\`\`\`

For snappy 2D games, untick Has Exit Time and set transition duration to zero on most transitions, so animations switch immediately when conditions change. Exit time makes a clip finish before transitioning, useful for attacks but frustrating for movement.

### Triggers for one-off actions

Triggers are parameters that reset after use, ideal for attacks, hurt reactions and death:

\`\`\`csharp
animator.SetTrigger("Attack");
\`\`\`

### Animation events

Animation events call a method at a specific frame, for example dealing damage exactly when a sword swing lands, or playing a footstep sound when a foot touches the ground. Add them in the Animation window's timeline and select the method to call.

### Animating other properties

Clips can animate almost any property: position, scale, colour, enabled components. Record mode in the Animation window captures changes you make. Use this for doors opening, platforms bobbing, flashing pickups and UI animations.

### Blend trees

In 3D and top-down games, blend trees blend between clips based on parameters, for example blending walk and run based on speed, or eight-direction movement based on input. Chapter 8 uses them for a 3D character.

### Keep the state machine readable

Animator Controllers can become tangled webs of arrows. Keep them readable with sub-state machines for groups of states, clear parameter names and Any State transitions for interruptions such as hurt or death. A tidy controller is much easier to debug when an animation does not play.

### Common animation problems

| Problem | Likely cause |
|---|---|
| Animation never changes | Parameter name misspelled or not set in code |
| Delay before switching | Has Exit Time enabled or long transition duration |
| Character slides while idle | Speed threshold too low or animation missing |
| Animation plays once then freezes | Loop Time unticked on the clip |
      `,
        [
          q('What does an Animator Controller do?', [
            'Stores the individual sprite frames',
            'Decides which animation plays using states and conditions',
            'Applies physics to animated characters',
            'Compresses animation files for mobile',
          ], 1, 'The controller is a state machine that switches clips based on parameters.'),
          q('Why untick Has Exit Time for movement transitions in a 2D game?', [
            'So animations switch immediately when conditions change',
            'So animations play in slow motion',
            'So clips loop forever',
            'So the Animator stops using parameters',
          ], 0, 'Exit time waits for the clip to finish, which feels unresponsive for movement.'),
          q('What is an animation event useful for?', [
            'Changing the scene\'s lighting',
            'Saving the game automatically',
            'Downloading new animations',
            'Calling a method at an exact frame, such as dealing damage',
          ], 3, 'Animation events sync gameplay actions with specific animation frames.'),
        ]
      ),
      lesson('Particles and Visual Effects', 13, `
Particles create effects that would be impossible to animate by hand: dust when landing, sparks when hitting, smoke from a chimney, magic swirling around a pickup. Unity's Particle System emits many small images that move, fade and change over time, adding life and clear feedback to every action.

### Creating a particle system

GameObject, Effects, Particle System adds one to the scene. It emits particles immediately. Its behaviour is controlled by modules in the Inspector:

| Module | Controls |
|---|---|
| Main | Duration, looping, lifetime, speed, size, colour, gravity |
| Emission | How many particles appear, continuously or in bursts |
| Shape | Where particles come from: cone, sphere, circle, edge |
| Color over Lifetime | Fading or changing colour as particles age |
| Size over Lifetime | Growing or shrinking over time |
| Velocity over Lifetime | Movement changes, such as drifting upwards |
| Renderer | The material or sprite used, and sorting for 2D |

### A landing dust puff

\`\`\`text
Main:      Duration 0.3, Looping off, Start Lifetime 0.4,
           Start Speed 2, Start Size 0.2 to 0.4, Gravity Modifier 0.5
Emission:  Rate over Time 0, one Burst of 8 particles at time 0
Shape:     Edge or a flat cone pointing upwards
Color over Lifetime: white to transparent
Size over Lifetime:  shrink towards zero
\`\`\`

Save it as a prefab and spawn it at the player's feet on landing:

\`\`\`csharp
[SerializeField] private ParticleSystem landDustPrefab;

void OnLanded()
{
    ParticleSystem dust = Instantiate(landDustPrefab, groundCheck.position, Quaternion.identity);
    Destroy(dust.gameObject, 1f);
}
\`\`\`

Alternatively, keep one dust system on the player and call \`dust.Play()\`, avoiding spawning every time.

### Sorting particles in 2D

In 2D games, set the particle Renderer's sorting layer and order, just like sprites, or particles may appear behind the background.

### Common effects and when to use them

| Effect | Moment |
|---|---|
| Dust puff | Landing, starting to run, sliding |
| Sparks or hit flash | Weapon hits an enemy or wall |
| Explosion burst | Enemy dies, crate breaks |
| Sparkles | Collecting coins or power-ups |
| Trail | Fast movement, dashes, projectiles |
| Ambient particles | Floating dust, falling leaves, rain |

Particles are feedback: they tell the player something happened. A coin collected with sparkles feels far better than one that simply disappears.

### Trail and line renderers

A Trail Renderer leaves a fading line behind a moving object, great for dashes and projectiles. A Line Renderer draws lines between points, useful for lasers and aiming guides.

### VFX Graph

The Visual Effect Graph is a node-based tool for very large, GPU-driven effects with thousands or millions of particles. It needs graphics hardware support that not all mobile devices provide, so for most mobile and 2D games, the standard Particle System is the practical choice. Consider VFX Graph for PC and console projects with heavy effects.

### Performance

Particles are cheap individually but add up:

- Keep particle counts reasonable, especially on phones.
- Use small textures for particles.
- Avoid many overlapping transparent particles covering the screen, which is expensive on mobile graphics chips.
- Turn off effects that are far off-screen.

### Style consistency

Effects should match your art style. Pixel-art games need pixelated particles; smooth cartoon games need soft round particles. Mismatched effects look out of place, however impressive they are individually.

### Practice task

Add a dust puff on landing, sparkles when collecting a coin, and an explosion when an enemy is defeated. Play the level before and after: the difference in how the game feels is usually striking.
      `,
        [
          q('Which module controls sending out a single burst of particles?', [
            'Shape',
            'Renderer',
            'Emission',
            'Size over Lifetime',
          ], 2, 'The Emission module sets continuous rates and timed bursts.'),
          q('Particles appear behind the background in a 2D game. What should you check?', [
            'The particle renderer\'s sorting layer and order',
            'The particle lifetime',
            'The number of particles emitted',
            'The particle system\'s duration',
          ], 0, 'Particles need correct 2D sorting, just like sprites.'),
          q('Why is the standard Particle System usually preferred for mobile games?', [
            'VFX Graph only works in 2D projects',
            'The Particle System supports more particles',
            'VFX Graph cannot use colours',
            'VFX Graph needs GPU support many phones lack',
          ], 3, 'VFX Graph relies on compute features that not all mobile devices provide.'),
        ]
      ),
      lesson('Sound Effects and Music', 13, `
Sound is half of a game's feel. A jump without a sound feels weightless; a coin with a bright chime feels rewarding; music sets the mood of every level. Unity's audio system plays sounds through Audio Sources, heard by an Audio Listener, and mixes them through an Audio Mixer.

### The basic pieces

| Component or asset | Role |
|---|---|
| Audio Clip | The sound file: WAV, OGG or MP3 |
| Audio Source | Plays clips from a GameObject |
| Audio Listener | The "ears", usually on the Main Camera; only one per scene |
| Audio Mixer | Groups and controls volumes for music, effects and more |

### Playing sound effects

\`\`\`csharp
[SerializeField] private AudioSource sfxSource;
[SerializeField] private AudioClip jumpClip;
[SerializeField] private AudioClip coinClip;

void Jump()
{
    sfxSource.PlayOneShot(jumpClip);
}
\`\`\`

\`PlayOneShot\` plays a clip without interrupting other sounds on the same source, ideal for effects that may overlap, such as rapid coin pickups.

### Avoiding repetitive sounds

Hearing exactly the same sound fifty times becomes irritating. Add small random variation:

\`\`\`csharp
void PlayWithVariation(AudioClip clip)
{
    sfxSource.pitch = Random.Range(0.95f, 1.05f);
    sfxSource.PlayOneShot(clip);
}
\`\`\`

Or keep several versions of a sound, such as three footsteps, and pick one randomly.

### Music

Use a separate Audio Source for music with Loop ticked. Music often continues between scenes; a music manager that is not destroyed on scene load (chapter 9) keeps it playing. Fading music in and out rather than cutting it feels much more polished.

### The Audio Mixer

Create an Audio Mixer with groups such as Master, Music and SFX. Route each Audio Source's output to the right group. Then:

- Players can adjust music and effects volume separately in a settings menu.
- You can apply effects, such as reducing music volume slightly when dialogue plays.

Expose a group's volume parameter and set it from a settings slider:

\`\`\`csharp
using UnityEngine.Audio;   // at the top of the file

[SerializeField] private AudioMixer mixer;

public void SetMusicVolume(float sliderValue)   // slider from 0.0001 to 1
{
    mixer.SetFloat("MusicVolume", Mathf.Log10(sliderValue) * 20f);
}
\`\`\`

The mixer works in decibels, so converting the slider value logarithmically makes the slider feel natural.

### 2D and 3D sound

The Spatial Blend setting on an Audio Source chooses between 2D sound, same volume everywhere (UI, music), and 3D sound, which gets quieter with distance and pans left or right. 3D games use spatial sound for enemies and environment; 2D games usually use mostly 2D sound.

### Import settings for mobile

| Sound type | Suggested load type |
|---|---|
| Short, frequent effects | Decompress On Load, for instant playback |
| Music and long ambience | Streaming, to save memory |

Compressed formats such as Vorbis reduce build size. Test on real phones: audio settings affect memory and loading time.

### Finding sounds

Free and paid sound libraries exist; always check licences for commercial use. You can also create simple retro effects with sound generator tools, or record your own. Consistent sound style, like consistent art style, makes a game feel professional.

### Respect the player

Always include volume controls and a mute option. Many people play mobile games in public places with the sound off, so important information should never rely on sound alone; pair sounds with visual feedback.
      `,
        [
          q('Why use PlayOneShot for sound effects?', [
            'It plays without interrupting other sounds on the source',
            'It loops the sound forever',
            'It streams the sound from the internet',
            'It converts the sound to 3D',
          ], 0, 'PlayOneShot allows overlapping effects on the same Audio Source.'),
          q('How can you stop a frequently played sound becoming repetitive?', [
            'Play it louder each time',
            'Remove the Audio Listener',
            'Add slight random pitch variation or alternate versions',
            'Only play it once per level',
          ], 2, 'Small variations make repeated sounds feel natural.'),
          q('Which load type suits long background music on mobile?', [
            'Decompress On Load',
            'Streaming',
            'Preload in every scene',
            'Uncompressed in memory',
          ], 1, 'Streaming reads music gradually, saving memory compared to decompressing it all.'),
        ]
      ),
      lesson('Juice: Screen Shake, Timing and Polish', 13, `
Two games can have identical mechanics, yet one feels flat while the other feels incredible. The difference is often "juice": small feedback effects layered on every action. Screen shake, hit pauses, squash and stretch, flashes and sounds together make actions feel powerful. This polish is cheap to add and hugely improves how players experience a game.

### Screen shake

With Cinemachine (chapter 4), add a Cinemachine Impulse Listener to your Cinemachine camera and an Impulse Source to objects that cause shakes:

\`\`\`csharp
using Unity.Cinemachine;   // Cinemachine 3; older versions use the Cinemachine namespace

[SerializeField] private CinemachineImpulseSource impulse;

void Explode()
{
    impulse.GenerateImpulse(0.5f);
}
\`\`\`

Keep shakes short and proportional: a small shake for hits, a larger one for explosions. Constant heavy shaking tires players, and some find it uncomfortable, so include an option to reduce it.

### Hit stop

Freezing the game for a few hundredths of a second when a hit lands makes impacts feel heavy. It is used in many action games:

\`\`\`csharp
using System.Collections;

public class HitStop : MonoBehaviour
{
    public void Stop(float duration)
    {
        StartCoroutine(StopRoutine(duration));
    }

    private IEnumerator StopRoutine(float duration)
    {
        Time.timeScale = 0f;
        yield return new WaitForSecondsRealtime(duration);
        Time.timeScale = 1f;
    }
}
\`\`\`

\`WaitForSecondsRealtime\` is used because normal waits stop when the time scale is zero. Durations around 0.03 to 0.1 seconds work well. Coroutines are explained in chapter 9.

### Hit flash

Flashing an enemy white or red when hit clearly shows the hit landed:

\`\`\`csharp
private IEnumerator Flash(SpriteRenderer sprite)
{
    Color original = sprite.color;
    sprite.color = Color.red;
    yield return new WaitForSeconds(0.1f);
    sprite.color = original;
}
\`\`\`

Pure white flashes usually need a simple shader or material swap, because tinting a sprite white does not brighten it.

### Squash and stretch

Stretching a character slightly when jumping and squashing it on landing adds a lively, cartoon feel. Animate the scale of the visual child object rather than the root, so colliders and physics are unaffected.

### Layering feedback

A single action should trigger several small effects together:

| Action | Layered feedback |
|---|---|
| Enemy hit | Hit flash, hit stop, small shake, spark particles, impact sound, knockback |
| Coin collected | Sparkle particles, chime with pitch variation, coin counter pops |
| Player lands | Dust puff, squash, soft thud sound |
| Level complete | Fanfare, confetti particles, slow motion, results screen animates in |

Each alone is subtle; together they transform the experience.

### Easing and tweening

Motion that starts and ends smoothly feels natural. Easing curves, such as ease-out for UI popping in, are available through animation curves or tweening libraries from the Asset Store. A score number that scales up briefly when it changes draws attention far better than a plain update.

### Knowing when to stop

Juice should clarify, not overwhelm. Too much shake, flashing and particles make the game hard to read and can cause discomfort. Add effects, playtest, and remove anything that distracts from gameplay. Offer settings to reduce shake and flashing effects for accessibility.

### Practice task

Pick one action in your game, such as defeating an enemy. Add hit flash, a short hit stop, a small screen shake, particles and a sound, one at a time, testing after each. Then ask someone to play and describe how it feels. You will rarely find a cheaper way to improve a game.
      `,
        [
          q('Why does the hit stop coroutine use WaitForSecondsRealtime?', [
            'It is more accurate on phones',
            'Normal waits pause when Time.timeScale is zero',
            'It uses less battery than other waits',
            'Coroutines cannot use other waits',
          ], 1, 'Scaled waits never finish while the time scale is zero, so real time is needed.'),
          q('Why animate squash and stretch on the visual child instead of the root?', [
            'So colliders and physics are unaffected',
            'So the animation plays faster',
            'So the sprite changes colour',
            'So the camera ignores the character',
          ], 0, 'Scaling the root would also change the collider and physics behaviour.'),
          q('What is a good accessibility practice for screen shake and flashing?', [
            'Make them stronger on every action',
            'Hide them in advanced settings only',
            'Remove all sound when shaking',
            'Offer settings to reduce them',
          ], 3, 'Some players find shake and flashing uncomfortable, so options help.'),
        ]
      ),
      ],
      [
      q('Which Animator parameter type suits a one-off attack?', [
        'Float',
        'Bool',
        'Trigger',
        'Int',
      ], 2, 'Triggers reset after firing, ideal for single actions.'),
      q('What is the role of a Trail Renderer?', [
        'Drawing a path finder for enemies',
        'Recording player movement for replays',
        'Rendering the level\'s tilemap',
        'Leaving a fading line behind a moving object',
      ], 3, 'Trails show motion, useful for dashes and projectiles.'),
      q('How many Audio Listeners should a scene normally have?', [
        'One',
        'One per Audio Source',
        'None',
        'One per enemy',
      ], 0, 'A single listener, usually on the camera, acts as the player\'s ears.'),
      q('What does layering feedback mean?', [
        'Playing the same sound twice',
        'Combining several small effects on one action',
        'Putting effects on separate sorting layers',
        'Delaying effects until the level ends',
      ], 1, 'Several subtle effects together make actions feel satisfying.'),
      ]
    ),
    chapter(
      'User Interface',
      'Build interfaces with the Canvas, TextMeshPro and layout groups, create menus that move between scenes, design HUDs for health, score and time, and make the UI fit every phone screen, including notches and different aspect ratios.',
      [
      lesson('Canvas, TextMeshPro and Layout', 13, `
Every game needs an interface: menus, scores, health bars, buttons, dialogue boxes. Unity's main runtime UI system, often called uGUI, is built from GameObjects on a Canvas. Learning how the Canvas, text and layout tools work lets you build clean interfaces that stay tidy as content changes.

### The Canvas

All UI elements live under a Canvas. Adding any UI element, such as a button, creates a Canvas and an EventSystem automatically if they do not exist.

| Canvas render mode | Behaviour | Typical use |
|---|---|---|
| Screen Space - Overlay | Drawn on top of everything, sized to the screen | Menus and HUDs |
| Screen Space - Camera | Drawn in front of a chosen camera | UI that needs camera effects |
| World Space | A panel placed in the world | Health bars above enemies, in-game screens |

The EventSystem handles clicks and touches. If buttons stop responding, a missing EventSystem is a common cause; with the Input System, it uses the Input System UI Input Module.

### Basic UI elements

| Element | Use |
|---|---|
| Image | Backgrounds, icons, bars |
| Text (TextMeshPro) | All text |
| Button | Clickable actions |
| Slider | Volume and settings |
| Toggle | On and off options |
| Scroll View | Long lists, such as level selection or shops |
| Input Field (TextMeshPro) | Typing names |

### TextMeshPro

TextMeshPro (TMP) renders sharp text at any size, with outlines, shadows and rich formatting. Use TMP for all text; the older legacy Text component looks blurry when scaled. The first time you add TMP text, Unity may prompt you to import TMP Essentials; accept it.

\`\`\`csharp
using TMPro;

[SerializeField] private TMP_Text scoreText;

void UpdateScore(int score)
{
    scoreText.text = $"Score: {score}";
}
\`\`\`

For Urdu or other scripts, you need a font asset that contains those characters. Right-to-left text and connected Urdu letter forms need extra support, so test carefully or use a plugin designed for it.

### RectTransform and anchors

UI elements use a RectTransform instead of a normal Transform. Its anchors decide how the element behaves when the screen size changes:

\`\`\`text
Anchor to top-left      -> stays in the top-left corner (a pause button)
Anchor to top-centre    -> stays centred at the top (a score)
Anchor stretched        -> grows and shrinks with the screen (a background)
\`\`\`

Use the anchor presets (the square icon in the RectTransform), holding Alt to also set the position, and Shift to set the pivot. Wrong anchors are the main reason UI looks fine in the editor but breaks on phones.

### Layout groups

Layout components arrange children automatically:

| Component | Arranges children |
|---|---|
| Horizontal Layout Group | In a row |
| Vertical Layout Group | In a column |
| Grid Layout Group | In a grid, such as level buttons |
| Content Size Fitter | Resizes an element to fit its content |

A vertical layout group for a main menu keeps buttons evenly spaced even when you add or remove one.

### Sprites for UI

UI images often use nine-sliced sprites: set borders in the Sprite Editor so corners stay sharp while the middle stretches. One small rounded rectangle can then make buttons and panels of any size.

### UI Toolkit

Unity also offers UI Toolkit, a newer system with web-like layouts and style sheets. It is used for editor tools and increasingly for runtime UI. This chapter uses uGUI because it is widely used in games and tutorials, but the design principles apply to both.

### Keep UI organised

Group UI into panels, such as MainMenuPanel, SettingsPanel and HUD, each an object you can show or hide. Clear names and a consistent structure make menus much easier to manage as the game grows.
      `,
        [
          q('Buttons in your menu stop responding to clicks. What is a common cause?', [
            'The Canvas uses World Space',
            'The scene has no EventSystem',
            'The buttons use TextMeshPro',
            'The camera is orthographic',
          ], 1, 'The EventSystem processes input for UI, so without it nothing responds.'),
          q('Why use TextMeshPro instead of the legacy Text component?', [
            'It stays sharp at any size and supports rich styling',
            'It is the only text that supports numbers',
            'It does not need a Canvas',
            'It translates text automatically',
          ], 0, 'TMP renders crisp text with outlines, shadows and formatting.'),
          q('What do anchors on a RectTransform control?', [
            'The colour of the UI element',
            'The order of button clicks',
            'How the element positions and resizes as screens change',
            'The font used by text',
          ], 2, 'Anchors decide how elements respond to different screen sizes.'),
        ]
      ),
      lesson('Menus, Buttons and Scene Flow', 13, `
Menus are the first thing players see and how they move through the game: main menu, level selection, pause, settings, game over. Well-built menus feel smooth and never leave players stuck. This lesson connects buttons to code and moves between scenes cleanly.

### Connecting buttons

A Button's On Click list is a UnityEvent (chapter 5). Drag an object with a script into the slot and choose a public method:

\`\`\`csharp
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenu : MonoBehaviour
{
    public void Play()
    {
        SceneManager.LoadScene("Level1");
    }

    public void Quit()
    {
        Application.Quit();
    }
}
\`\`\`

\`Application.Quit\` does nothing in the editor, and on some platforms, such as iOS, apps are not expected to quit themselves, so hide the Quit button there.

### Adding scenes to the build

Scenes must be listed in the build before \`LoadScene\` can load them. In Unity 6, open File, Build Profiles and add scenes to the Scene List; older versions use File, Build Settings. The first scene in the list opens when the game starts, usually the main menu or a splash screen.

### Loading with a loading screen

Large scenes take time to load. Loading asynchronously keeps the game responsive and lets you show progress:

\`\`\`csharp
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class SceneLoader : MonoBehaviour
{
    [SerializeField] private GameObject loadingPanel;
    [SerializeField] private Slider progressBar;

    public void Load(string sceneName)
    {
        StartCoroutine(LoadRoutine(sceneName));
    }

    private IEnumerator LoadRoutine(string sceneName)
    {
        loadingPanel.SetActive(true);
        AsyncOperation op = SceneManager.LoadSceneAsync(sceneName);
        while (!op.isDone)
        {
            progressBar.value = Mathf.Clamp01(op.progress / 0.9f);
            yield return null;
        }
    }
}
\`\`\`

Loading progress reaches 0.9 before the scene activates, which is why the value is divided by 0.9.

### A pause menu

\`\`\`csharp
public class PauseMenu : MonoBehaviour
{
    [SerializeField] private GameObject pausePanel;
    private bool paused;

    public void TogglePause()
    {
        paused = !paused;
        pausePanel.SetActive(paused);
        Time.timeScale = paused ? 0f : 1f;
    }

    public void QuitToMenu()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("MainMenu");
    }
}
\`\`\`

Setting \`Time.timeScale\` to zero stops physics and anything using \`Time.deltaTime\`. Always reset it to 1 before leaving, or the next scene starts frozen, a very common bug. UI animations that must run while paused should use unscaled time.

### Menu flow

\`\`\`text
Splash -> Main Menu -> Level Select -> Level
                    -> Settings
                    -> Credits
Level -> Pause -> Resume / Restart / Main Menu
Level -> Win screen -> Next level / Level Select
Level -> Game Over -> Retry / Main Menu
\`\`\`

Sketch this flow before building. Every screen needs a clear way back, and players should never have to restart the app to escape a menu.

### Button feedback

Buttons should respond visibly and audibly: colour changes on press (the Button's Transition settings), a small scale animation and a click sound. Make touch targets large, at least the size of a fingertip, and space them so players do not press the wrong one.

### Mobile back button

On Android, players expect the back gesture or button to close menus or pause the game. Map a Cancel or Back action in the Input System and handle it, so the game behaves as players expect.

### Settings menus

Common settings include music volume, effects volume (via the Audio Mixer in chapter 6), vibration, graphics quality and language. Save them with PlayerPrefs (chapter 9) so they persist between sessions.
      `,
        [
          q('Why must scenes be added to the scene list in Build Profiles?', [
            'To make them load faster in the editor',
            'To give them a background colour',
            'To add them to the Asset Store',
            'So SceneManager can load them in the build',
          ], 3, 'Only scenes included in the build\'s scene list can be loaded.'),
          q('A game starts frozen after quitting from the pause menu. What was missed?', [
            'Resetting Time.timeScale to 1 before loading',
            'Adding an EventSystem',
            'Saving the scene',
            'Using TextMeshPro',
          ], 0, 'A zero time scale carries over, so it must be restored before leaving.'),
          q('What is the benefit of LoadSceneAsync?', [
            'It loads scenes without adding them to the build',
            'The game stays responsive and can show progress',
            'It makes scenes smaller',
            'It skips the Awake methods',
          ], 1, 'Asynchronous loading lets you display a loading screen while the scene loads.'),
        ]
      ),
      lesson('HUDs: Health Bars, Scores and Timers', 13, `
The HUD, or heads-up display, shows what players need during play: health, score, time, ammunition, objectives. A good HUD is clear at a glance and stays out of the way. This lesson builds the common HUD elements and connects them to gameplay through events.

### A health bar

Use an Image with Image Type set to Filled, and change its fill amount:

\`\`\`csharp
using UnityEngine;
using UnityEngine.UI;

public class HealthBar : MonoBehaviour
{
    [SerializeField] private Health health;
    [SerializeField] private Image fill;

    void OnEnable() => health.HealthChanged += OnHealthChanged;
    void OnDisable() => health.HealthChanged -= OnHealthChanged;

    private void OnHealthChanged(int current, int max)
    {
        fill.fillAmount = (float)current / max;
    }
}
\`\`\`

This uses the Health events from chapter 5. The cast to float matters: dividing two integers gives zero for any value below the maximum.

### Smooth and delayed bars

A bar that drops instantly is functional; a bar that animates down, with a second lighter bar that follows slowly, shows how much damage was just taken. Many action games use this "trailing" bar. Animate the fill using \`Mathf.MoveTowards\` in Update.

### Enemy health bars

For enemies, use a World Space Canvas as a child of the enemy, positioned above its head. Make it face the camera in 3D games, and hide it when the enemy is at full health to reduce clutter.

### Score display

\`\`\`csharp
using TMPro;

public class ScoreDisplay : MonoBehaviour
{
    [SerializeField] private TMP_Text text;

    public void Show(int score)
    {
        text.text = score.ToString("N0");   // 12,500 with thousands separators
    }
}
\`\`\`

Updating text only when the score changes, rather than every frame, avoids needless work and memory allocation.

### Timers

\`\`\`csharp
[SerializeField] private TMP_Text timerText;
private float remaining = 90f;

void Update()
{
    remaining = Mathf.Max(remaining - Time.deltaTime, 0f);
    int minutes = Mathf.FloorToInt(remaining / 60f);
    int seconds = Mathf.FloorToInt(remaining % 60f);
    timerText.text = $"{minutes:00}:{seconds:00}";
}
\`\`\`

Updating the text only when the displayed second changes is more efficient, because rebuilding text every frame creates garbage on mobile.

### HUD design principles

| Principle | Practice |
|---|---|
| Glanceable | Large, high-contrast numbers and icons |
| Positioned predictably | Health in a corner, score at the top, controls at the bottom |
| Minimal | Show only what matters now; hide the rest |
| Feedback | Animate changes: pulse the score, flash the health bar when hit |
| Readable on phones | Test at real phone size, not just in the editor |

### Showing changes clearly

Floating numbers ("+10") at the position of a collected coin or damaged enemy help players understand what happened. Spawn a small text object that moves up and fades out. Combined with the score pulsing, it makes progress feel rewarding.

### Objectives and prompts

Short prompts, such as "Collect 3 keys" or "Press E to open", guide players. Show interaction prompts only when relevant, near the object, and hide them once the player has learned the action.

### Performance tip

Every change to a UI element marks its Canvas for rebuilding. If a timer updates constantly on the same Canvas as a complex menu, the whole Canvas rebuilds. Place frequently changing elements on a separate child Canvas, so only that part rebuilds. This matters most on phones.
      `,
        [
          q('Why cast to float in (float)current / max for a health bar?', [
            'Integer division would give zero below the maximum',
            'Fill amounts must be negative',
            'Floats display in larger text',
            'Unity cannot divide integers',
          ], 0, 'Dividing two ints truncates, so the fill would be 0 until health is full.'),
          q('What is a good way to show enemy health bars?', [
            'A Screen Space Overlay bar for every enemy in the corner',
            'Text in the Console window',
            'A World Space Canvas above each enemy',
            'A separate scene for each enemy',
          ], 2, 'World Space bars sit above enemies and move with them.'),
          q('Why put a constantly updating timer on its own child Canvas?', [
            'Timers only work on separate Canvases',
            'It makes the text sharper',
            'It stops the timer from pausing',
            'Only that small Canvas rebuilds when the text changes',
          ], 3, 'Splitting canvases limits rebuilding to the elements that change.'),
        ]
      ),
      lesson('UI That Works on Every Phone', 14, `
Phones come in many shapes: tall and narrow, wide tablets, screens with notches, punch-hole cameras and rounded corners. A UI that looks perfect in the editor can end up cut off, stretched or unreadable on a real device. Planning for different screens from the start avoids painful fixes later.

### The Canvas Scaler

Set the Canvas Scaler component on every Canvas:

| Setting | Recommended value |
|---|---|
| UI Scale Mode | Scale With Screen Size |
| Reference Resolution | Your design resolution, for example 1080 by 1920 for a portrait game |
| Screen Match Mode | Match Width Or Height |
| Match | Around 0.5 to start, then tune; portrait games often favour width |

With Scale With Screen Size, the UI scales proportionally on every device, so text and buttons stay readable. Constant Pixel Size, the default, makes UI tiny on high-resolution phones.

### Anchors do the rest

Scaling handles size; anchors handle position. A pause button anchored to the top-right corner stays there on every screen, while one positioned relative to the centre drifts off-screen on narrow phones. Check every element's anchor.

### Safe areas

Notches, punch-hole cameras and rounded corners can hide UI placed at the edges. Unity reports the usable area through \`Screen.safeArea\`:

\`\`\`csharp
[RequireComponent(typeof(RectTransform))]
public class SafeArea : MonoBehaviour
{
    void Start()
    {
        RectTransform panel = GetComponent<RectTransform>();
        Rect safe = Screen.safeArea;

        Vector2 min = safe.position;
        Vector2 max = safe.position + safe.size;
        min.x /= Screen.width;  min.y /= Screen.height;
        max.x /= Screen.width;  max.y /= Screen.height;

        panel.anchorMin = min;
        panel.anchorMax = max;
    }
}
\`\`\`

Put this on a full-screen panel and place important HUD elements inside it. Backgrounds can still extend to the edges, while buttons and text stay in the visible area. If your game supports rotation, apply the safe area again when the orientation changes.

### Testing without many phones

The Device Simulator window (Window, General, Device Simulator) shows your game on the shapes and safe areas of many real phone models, including notches. Use it constantly, but also test on at least one real low-end phone and one with a notch, because touch size and performance can only be judged on hardware.

### Aspect ratios

| Screen | Common ratios | What to check |
|---|---|---|
| Modern phones | 19.5:9 to 20:9 | Top and bottom notches, very tall layouts |
| Older phones | 16:9 | Less vertical space |
| Tablets | 4:3, 3:2 | Much wider; UI may look sparse or too big |

Decide how gameplay handles extra width or height: show more of the level, add borders, or scale the camera. Cinemachine and camera settings can keep the important play area visible.

### Touch-friendly design

- Buttons at least roughly fingertip size, with spacing between them.
- Primary controls within reach of thumbs, near the bottom corners.
- Avoid placing important buttons where hands cover the screen during play.
- Text large enough to read at arm's length on a small phone.

### Orientation

Choose portrait or landscape deliberately and lock it in Player Settings unless the game supports both. Casual and one-handed games often use portrait; action games with virtual joysticks usually use landscape.

### Localisation readiness

Text length changes between languages. Leave room in buttons and use layout groups and content size fitters, so translated text fits. Unity's Localization package helps manage translations if you publish in several languages, such as English and Urdu.

### A checklist before release

Test every screen on a small phone, a tall phone with a notch and a tablet. Check that nothing is hidden, cut off or too small, that every button is reachable, and that text is readable. A few minutes with the Device Simulator saves many negative reviews.
      `,
        [
          q('Which Canvas Scaler mode keeps UI proportional across devices?', [
            'Constant Pixel Size',
            'Scale With Screen Size',
            'Constant Physical Size',
            'World Space scaling',
          ], 1, 'Scale With Screen Size scales the UI relative to a reference resolution.'),
          q('What does Screen.safeArea provide?', [
            'The screen area not covered by notches or rounded corners',
            'The part of the level safe from enemies',
            'The memory available to the game',
            'The resolution the game was designed for',
          ], 0, 'The safe area lets you keep important UI in the visible part of the screen.'),
          q('Why test on real phones as well as the Device Simulator?', [
            'The simulator cannot show notches',
            'The simulator only supports tablets',
            'Touch size and performance need real hardware',
            'Real phones show a different Canvas',
          ], 2, 'The simulator shows layout, but touch comfort and performance need devices.'),
        ]
      ),
      ],
      [
      q('Which Canvas render mode suits a health bar floating above an enemy?', [
        'Screen Space - Overlay',
        'Screen Space - Camera',
        'Constant Pixel Size',
        'World Space',
      ], 3, 'World Space canvases exist in the scene and can follow objects.'),
      q('What does Time.timeScale = 0 do?', [
        'Stops physics and anything using scaled time',
        'Closes the application',
        'Reloads the current scene',
        'Mutes all audio sources',
      ], 0, 'A zero time scale pauses scaled time, which is how pause menus work.'),
      q('Why update score text only when the score changes?', [
        'Text cannot change more than once a second',
        'It avoids needless work and allocations every frame',
        'TextMeshPro requires it',
        'Scores must update in FixedUpdate',
      ], 1, 'Changing text rebuilds meshes and allocates memory, so do it only when needed.'),
      q('What is a nine-sliced sprite used for?', [
        'Animating characters in nine frames',
        'Splitting the screen into nine sections',
        'Panels that stretch while corners stay sharp',
        'Storing nine sounds in one file',
      ], 2, 'Nine-slicing keeps borders crisp while the middle stretches.'),
      ]
    ),
    chapter(
      '3D Game Development',
      'Build 3D scenes with lighting, materials and post-processing, create a third-person character with a following camera, give enemies navigation with NavMesh, and use raycasts for shooting, aiming and interaction.',
      [
      lesson('3D Scenes, Lighting and Materials', 14, `
3D games add depth, lighting and perspective. The same GameObject and component ideas apply, but how a scene looks depends heavily on lighting and materials. With the Universal Render Pipeline (URP), you can build attractive 3D scenes that also run on phones.

### Building the environment

- **Primitives** such as cubes and planes are perfect for blocking out levels quickly, often called greyboxing.
- **ProBuilder**, a Unity package, lets you model simple buildings and levels inside the editor.
- **Terrain** creates large outdoor landscapes with sculpted hills, painted textures, trees and grass.
- **Imported models** from tools like Blender, or from the Asset Store, provide detailed assets. FBX is the common format.

Greybox first: build the level with simple shapes, test that it plays well, and only then replace shapes with detailed art.

### Materials in URP

A material defines how a surface responds to light. URP's Lit shader uses physically based rendering (PBR):

| Property | Controls |
|---|---|
| Base Map | The main colour or texture |
| Metallic | Whether the surface behaves like metal |
| Smoothness | How shiny or rough it is |
| Normal Map | Fine surface detail, such as bricks, without extra geometry |
| Emission | Glow, such as screens and lamps |

A rough painted wall has low smoothness and zero metallic; polished steel has high values for both. For stylised or mobile games, simpler shaders such as Simple Lit or Unlit can look great and run faster.

### Light types

| Light | Behaves like | Use |
|---|---|---|
| Directional | The sun: parallel rays everywhere | Outdoor main light |
| Point | A bulb: shines in all directions | Lamps, torches, explosions |
| Spot | A torch: a cone of light | Flashlights, stage lights |
| Area | A glowing panel (baked only in URP) | Soft window light |

### Realtime and baked lighting

| Realtime | Baked |
|---|---|
| Calculated every frame | Pre-calculated into lightmaps |
| Handles moving lights and objects | Only for static lights and objects |
| More expensive, especially shadows | Very cheap at runtime, high quality |

Mark non-moving scenery as Static and bake lighting for rich, soft lighting at low cost, which is ideal for mobile. Moving characters receive baked lighting through light probes placed around the level. Many games mix both: baked environment plus one realtime directional light for character shadows.

### Environment lighting and skybox

The skybox surrounds the scene and contributes ambient light. Lighting settings (Window, Rendering, Lighting) control the skybox, ambient colour and fog. Fog adds atmosphere and hides distant objects, which also helps performance.

### Post-processing

URP post-processing is added with a Volume component and a profile containing effects:

| Effect | Result |
|---|---|
| Bloom | Bright areas glow |
| Color Adjustments | Contrast, saturation, colour filter |
| Vignette | Darkened edges, focusing attention |
| Tonemapping | Better handling of bright and dark ranges |
| Depth of Field | Blurs near or far objects |

Enable Post Processing on the camera for effects to appear. Use them lightly on phones; bloom and depth of field cost performance.

### Art direction

A consistent look matters more than realism. Choose a colour palette and lighting mood for each level, such as warm afternoon light for a village and cold blue for a cave. Low-poly and stylised art is quicker to make, runs better on phones and ages better than attempts at realism with limited resources.

### Practice task

Greybox a small 3D arena with a floor, walls, ramps and a few platforms. Add a directional light, mark the arena Static and bake the lighting. Add a Volume with subtle bloom and colour adjustments, then compare the scene before and after.
      `,
        [
          q('What is greyboxing?', [
            'Building a level with simple shapes to test gameplay first',
            'Converting a game to black and white',
            'Baking lighting into grey textures',
            'Compressing textures for mobile devices',
          ], 0, 'Greyboxing tests layout and gameplay before investing in detailed art.'),
          q('Why bake lighting for static scenery on mobile?', [
            'Baked lights can move during gameplay',
            'Baking adds realtime shadows to everything',
            'It gives high-quality lighting at very low runtime cost',
            'It removes the need for materials',
          ], 2, 'Pre-calculated lightmaps look good and are cheap to render.'),
          q('Which light type behaves like the sun?', [
            'Point',
            'Spot',
            'Area',
            'Directional',
          ], 3, 'Directional lights have parallel rays, like sunlight.'),
        ]
      ),
      lesson('A Third-Person Character Controller', 14, `
A third-person game shows the character from behind, with the camera orbiting around them. Movement should be relative to the camera: pushing forward moves the character away from the camera, whichever way it faces. Getting this right is the foundation of most 3D action and adventure games.

### CharacterController or Rigidbody?

| CharacterController component | Rigidbody |
|---|---|
| Moved directly by code with Move | Moved by forces and velocity |
| Precise, predictable movement | Physically realistic interactions |
| Handles slopes and steps | Needs extra work for slopes and steps |
| No automatic gravity; you add it | Gravity built in |

Many third-person games use the CharacterController for precise control. Unity's free Starter Assets also include a ready-made third-person controller you can study and adapt.

### Camera-relative movement

\`\`\`csharp
using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class ThirdPersonMovement : MonoBehaviour
{
    [SerializeField] private Transform cameraTransform;
    [SerializeField] private PlayerInputReader input;
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float turnSpeed = 720f;
    [SerializeField] private float gravity = -20f;

    private CharacterController controller;
    private float verticalVelocity;

    void Awake() => controller = GetComponent<CharacterController>();

    void Update()
    {
        Vector3 forward = cameraTransform.forward;
        Vector3 right = cameraTransform.right;
        forward.y = 0f; right.y = 0f;
        forward.Normalize(); right.Normalize();

        Vector3 move = forward * input.Move.y + right * input.Move.x;
        if (move.sqrMagnitude > 1f) move.Normalize();

        if (move.sqrMagnitude > 0.01f)
        {
            Quaternion target = Quaternion.LookRotation(move);
            transform.rotation = Quaternion.RotateTowards(transform.rotation, target, turnSpeed * Time.deltaTime);
        }

        if (controller.isGrounded && verticalVelocity < 0f) verticalVelocity = -2f;
        verticalVelocity += gravity * Time.deltaTime;

        Vector3 velocity = move * moveSpeed + Vector3.up * verticalVelocity;
        controller.Move(velocity * Time.deltaTime);
    }
}
\`\`\`

Flattening the camera's forward and right vectors keeps movement on the ground even when the camera looks down. The small negative vertical velocity while grounded keeps the character pressed to the floor, so \`isGrounded\` stays reliable.

### The camera

Cinemachine makes an orbiting third-person camera easy. In Cinemachine 3, a CinemachineCamera with an Orbital Follow and a Rotation Composer orbits the player using mouse or right-stick input; older versions used a FreeLook camera. Add a Cinemachine Deoccluder (called Collider in older versions) so the camera moves in front of walls instead of clipping through them.

For mobile, dragging on the right half of the screen usually controls the camera, with a virtual joystick on the left for movement.

### Animation with blend trees

A 1D blend tree blends idle, walk and run clips based on a Speed parameter:

\`\`\`csharp
animator.SetFloat("Speed", move.magnitude * moveSpeed, 0.1f, Time.deltaTime);
\`\`\`

The extra arguments smooth the value, so animations blend rather than snap. Humanoid models can use animations from libraries through Unity's humanoid retargeting, so one animation set works on many characters.

### Root motion

Some animations move the character themselves, called root motion, which gives realistic foot placement. It is common in realistic games; code-driven movement, as above, is simpler and more responsive for most arcade and mobile games.

### Common problems

| Problem | Likely cause |
|---|---|
| Forward moves the wrong way | Using world directions instead of the camera's |
| Character floats down slopes | Gravity or grounded handling missing |
| Character slides with feet not moving | Animation speed not matched to movement speed |
| Camera clips through walls | No deoccluder or collider extension |

### Build it up gradually

Start with camera-relative movement and gravity, then add jumping, sprinting, animation and camera polish, testing each step. Movement feel matters as much in 3D as in 2D, so tune values in Play mode until controls feel natural.
      `,
        [
          q('Why flatten the camera\'s forward vector before moving?', [
            'To make the character jump higher',
            'To rotate the camera around the player',
            'So movement stays on the ground when the camera looks down',
            'To convert movement into 2D',
          ], 2, 'Removing the vertical part keeps the direction horizontal.'),
          q('What prevents a third-person camera from clipping through walls?', [
            'A Cinemachine Deoccluder or collider extension',
            'A higher field of view',
            'Baked lighting',
            'A Rigidbody on the camera',
          ], 0, 'The deoccluder moves the camera in front of obstacles.'),
          q('What does a 1D blend tree with a Speed parameter do?', [
            'Plays one clip at a fixed speed',
            'Blends idle, walk and run based on speed',
            'Moves the character using root motion only',
            'Switches scenes when speed changes',
          ], 1, 'Blend trees mix clips smoothly according to a parameter.'),
        ]
      ),
      lesson('Enemies That Navigate With NavMesh', 14, `
Enemies that walk into walls or get stuck on corners break the illusion immediately. Unity's navigation system calculates walkable areas, a NavMesh, and moves agents along paths around obstacles. Combined with a simple state machine, it creates enemies that patrol, chase and attack convincingly.

### Setting up navigation

Navigation comes from the AI Navigation package:

\`\`\`text
1. Install AI Navigation from the Package Manager.
2. Create an empty object and add a NavMesh Surface component.
3. Click Bake. A blue overlay shows the walkable area.
4. Add a NavMesh Agent component to the enemy.
\`\`\`

The agent's radius and height settings decide which gaps it can fit through. Re-bake whenever you change the level layout.

### Moving an agent

\`\`\`csharp
using UnityEngine;
using UnityEngine.AI;

public class EnemyChase : MonoBehaviour
{
    [SerializeField] private Transform player;
    private NavMeshAgent agent;

    void Awake() => agent = GetComponent<NavMeshAgent>();

    void Update()
    {
        agent.SetDestination(player.position);
    }
}
\`\`\`

The agent calculates a path and walks it, avoiding walls. Calling \`SetDestination\` every frame for many enemies costs performance; updating a few times per second is usually enough.

### A patrol, chase, attack state machine

\`\`\`csharp
public class EnemyAI : MonoBehaviour
{
    private enum State { Patrol, Chase, Attack }

    [SerializeField] private Transform player;
    [SerializeField] private Transform[] waypoints;
    [SerializeField] private float sightRange = 10f;
    [SerializeField] private float attackRange = 2f;

    private NavMeshAgent agent;
    private State state = State.Patrol;
    private int waypointIndex;

    void Awake() => agent = GetComponent<NavMeshAgent>();

    void Update()
    {
        float distance = Vector3.Distance(transform.position, player.position);

        state = distance <= attackRange ? State.Attack
              : distance <= sightRange ? State.Chase
              : State.Patrol;

        switch (state)
        {
            case State.Patrol:
                if (!agent.pathPending && agent.remainingDistance < 0.5f)
                {
                    waypointIndex = (waypointIndex + 1) % waypoints.Length;
                    agent.SetDestination(waypoints[waypointIndex].position);
                }
                break;
            case State.Chase:
                agent.SetDestination(player.position);
                break;
            case State.Attack:
                agent.ResetPath();
                transform.LookAt(new Vector3(player.position.x, transform.position.y, player.position.z));
                // trigger the attack animation and deal damage on its animation event
                break;
        }
    }
}
\`\`\`

The enum makes behaviour explicit: each state has clear rules for what to do and when to switch.

### Line of sight

Distance alone lets enemies "see" through walls. Add a raycast (next lesson) from the enemy's eyes to the player, and only chase if nothing blocks the view. A field-of-view angle check makes enemies unable to see behind themselves, enabling stealth gameplay.

### Obstacles and moving objects

| Component | Use |
|---|---|
| NavMesh Obstacle with Carve | Moving or temporary obstacles, such as crates and doors, cut holes in the NavMesh |
| NavMesh Link | Connects separate areas, for jumps or ladders |
| Area types and costs | Make agents prefer roads over mud |

### Agent settings

Speed, angular speed, acceleration and stopping distance shape behaviour. A heavy brute moves slowly and turns slowly; a small creature is fast and agile. Avoidance priority stops groups of enemies from pushing each other awkwardly.

### Fairness

Enemies that instantly see and perfectly track players feel unfair. Add reaction delays, limited vision and telegraphed attacks, such as a wind-up animation before striking, so players can respond. Good enemy AI is about being fun to fight, not about being unbeatable.

### Debugging navigation

Select an agent in Play mode to see its path in the Scene view. If agents do not move, check that the NavMesh is baked, the agent is placed on it, and the destination is reachable.
      `,
        [
          q('What must you do after changing a level\'s layout?', [
            'Reinstall the AI Navigation package',
            'Delete every NavMesh Agent',
            'Restart the Unity editor',
            'Re-bake the NavMesh Surface',
          ], 3, 'The NavMesh reflects the layout at bake time, so changes need a new bake.'),
          q('How can an enemy be prevented from seeing the player through walls?', [
            'Check line of sight with a raycast',
            'Increase its sight range',
            'Remove its NavMesh Agent',
            'Bake the lighting again',
          ], 0, 'A raycast confirms nothing blocks the view before the enemy reacts.'),
          q('Which component lets a moving crate cut a hole in the NavMesh?', [
            'NavMesh Link',
            'NavMesh Surface',
            'NavMesh Obstacle with Carve',
            'Character Controller',
          ], 2, 'Carving obstacles update walkable areas as they move.'),
        ]
      ),
      lesson('Raycasts, Shooting and Interaction', 13, `
A raycast fires an invisible line from a point in a direction and reports what it hits. Raycasts power instant-hit weapons, aiming, line-of-sight checks, clicking on objects and "press E to interact" systems. They are one of the most useful tools in 3D game development.

### A basic raycast

\`\`\`csharp
if (Physics.Raycast(origin, direction, out RaycastHit hit, maxDistance, hitLayers))
{
    Debug.Log($"Hit {hit.collider.name} at {hit.point}");
}
\`\`\`

| RaycastHit property | Gives |
|---|---|
| \`hit.collider\` | The collider that was hit |
| \`hit.point\` | The exact position of the hit |
| \`hit.normal\` | The surface direction at that point, useful for effects |
| \`hit.distance\` | How far away it was |

The layer mask limits which layers can be hit, so the ray ignores the player's own collider, triggers or decorative objects.

### Hitscan shooting

\`\`\`csharp
using UnityEngine;

public class HitscanGun : MonoBehaviour
{
    [SerializeField] private Camera cam;
    [SerializeField] private float range = 100f;
    [SerializeField] private int damage = 20;
    [SerializeField] private LayerMask hitLayers;
    [SerializeField] private ParticleSystem impactEffect;

    public void Fire()
    {
        Ray ray = cam.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0f));   // centre of screen
        if (Physics.Raycast(ray, out RaycastHit hit, range, hitLayers))
        {
            if (hit.collider.TryGetComponent(out Health health))
            {
                health.TakeDamage(damage);
            }
            Instantiate(impactEffect, hit.point, Quaternion.LookRotation(hit.normal));
        }
    }
}
\`\`\`

Hitscan weapons hit instantly, suitable for guns and lasers. Slower weapons, such as rockets or arrows, are better as projectiles with Rigidbodies.

| Hitscan | Projectile |
|---|---|
| Instant hit along a ray | A physical object that travels |
| Cheap and precise | Can be dodged and affected by gravity |
| Guns, lasers | Rockets, arrows, grenades, magic orbs |

### Clicking or tapping on objects

\`\`\`csharp
Ray ray = cam.ScreenPointToRay(pointerPosition);
if (Physics.Raycast(ray, out RaycastHit hit, 100f, groundLayer))
{
    agent.SetDestination(hit.point);   // click to move, as in strategy games
}
\`\`\`

Get the pointer position from the Input System, for example a Point action bound to the mouse and touch position.

### Interaction systems

\`\`\`csharp
public interface IInteractable
{
    string Prompt { get; }
    void Interact();
}

public class PlayerInteractor : MonoBehaviour
{
    [SerializeField] private Camera cam;
    [SerializeField] private float reach = 3f;
    [SerializeField] private LayerMask interactLayers;

    public IInteractable Current { get; private set; }

    void Update()
    {
        Ray ray = new Ray(cam.transform.position, cam.transform.forward);
        Current = Physics.Raycast(ray, out RaycastHit hit, reach, interactLayers)
            ? hit.collider.GetComponent<IInteractable>()
            : null;
    }
}
\`\`\`

Doors, chests, levers and characters implement \`IInteractable\`. The HUD shows \`Current.Prompt\`, such as "Open chest", and the Interact button calls \`Current.Interact()\`. The interface means the interactor works with any interactable object without knowing its type.

### Other casts

| Method | Shape |
|---|---|
| \`Physics.SphereCast\` | A thick ray, forgiving for aiming or checking space |
| \`Physics.OverlapSphere\` | Everything inside a sphere, for explosions |
| \`Physics2D.Raycast\` | The 2D equivalent for 2D games |

### Debugging rays

Visualise rays in the Scene view:

\`\`\`csharp
Debug.DrawRay(ray.origin, ray.direction * range, Color.red, 1f);
\`\`\`

If a ray hits nothing unexpectedly, check the layer mask, the range and whether the target has a collider. If it hits the wrong thing, such as the player's own body, adjust the layer mask.

### Aim assist on mobile

Aiming precisely on a touch screen is hard. Mobile shooters often add aim assist, such as slightly snapping to nearby targets or using a sphere cast for a wider hit area, which makes games fairer on phones.
      `,
        [
          q('What does the layer mask argument in a raycast do?', [
            'Sets the colour of the debug ray',
            'Limits which layers the ray can hit',
            'Changes the ray\'s length',
            'Makes the ray visible in the game',
          ], 1, 'Layer masks let rays ignore irrelevant colliders, such as the player\'s own.'),
          q('When is a projectile better than a hitscan weapon?', [
            'For slow weapons like rockets that can be dodged',
            'For instant lasers',
            'When precision matters most',
            'When the weapon should never miss',
          ], 0, 'Projectiles travel physically, so players can see and avoid them.'),
          q('Why use an IInteractable interface for doors, chests and levers?', [
            'Interfaces make objects render faster',
            'Unity requires interfaces for raycasts',
            'It stops objects from being destroyed',
            'The interactor can work with any object without knowing its type',
          ], 3, 'The interface decouples the interactor from each interactable object\'s class.'),
        ]
      ),
      ],
      [
      q('Which URP material property controls how shiny a surface is?', [
        'Base Map',
        'Smoothness',
        'Emission',
        'Normal Map',
      ], 1, 'Smoothness decides whether reflections are sharp and shiny or rough.'),
      q('Why keep a small negative vertical velocity while grounded?', [
        'To make the character jump automatically',
        'To slow the character\'s movement',
        'So the controller stays pressed to the floor and isGrounded is reliable',
        'To rotate the character towards the camera',
      ], 2, 'A slight downward push keeps ground detection stable, especially on slopes.'),
      q('Why use an enum for enemy states?', [
        'Enums make enemies move faster',
        'Unity requires enums for NavMesh',
        'Enums store animation clips',
        'It makes each behaviour and transition explicit',
      ], 3, 'A state enum clarifies what the enemy is doing and when it changes.'),
      q('Which method finds all colliders within an explosion radius?', [
        'Physics.OverlapSphere',
        'Physics.Raycast',
        'Physics2D.Raycast',
        'Debug.DrawRay',
      ], 0, 'OverlapSphere returns every collider inside a sphere.'),
      ]
    ),
    chapter(
      'Game Systems',
      'Organise the game with states and managers, save and load progress reliably, design levels, difficulty and progression that keep players engaged, and use coroutines to handle timing and sequences.',
      [
      lesson('Game States and Managers', 13, `
As a game grows beyond one level, it needs structure: is the game in the menu, playing, paused, or showing the game-over screen? Which system tracks the score across levels? Game states and manager objects answer these questions and prevent the chaos of every script checking everything.

### Game states

\`\`\`csharp
public enum GameState { MainMenu, Playing, Paused, LevelComplete, GameOver }
\`\`\`

A game manager holds the current state and announces changes:

\`\`\`csharp
using System;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public GameState State { get; private set; }
    public event Action<GameState> StateChanged;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void SetState(GameState newState)
    {
        if (newState == State) return;
        State = newState;
        Time.timeScale = newState == GameState.Paused ? 0f : 1f;
        StateChanged?.Invoke(newState);
    }
}
\`\`\`

The UI shows the pause menu when the state becomes Paused, the player controller ignores input when not Playing, and the music changes on GameOver, each by listening to \`StateChanged\`.

### The singleton pattern

\`GameManager.Instance\` is a singleton: one global instance anyone can reach. The Awake code destroys duplicates, which appear when you return to the scene that created the manager. \`DontDestroyOnLoad\` keeps it alive across scene loads.

Singletons are convenient for a few truly global systems. Overused, they create hidden dependencies that make code hard to test and change. A reasonable approach:

| Good singleton candidates | Better as normal objects or events |
|---|---|
| GameManager (state) | Individual enemies and pickups |
| AudioManager (music across scenes) | Level-specific logic |
| SaveManager | UI panels in one scene |

### A bootstrap scene

Placing managers in the first scene loaded, a bootstrap scene, ensures they exist before anything else and are never duplicated. The bootstrap scene creates managers, then loads the main menu. It also means you must start Play mode from the bootstrap scene, or add a small editor helper that loads it automatically.

### Manager responsibilities

| Manager | Responsibility |
|---|---|
| GameManager | Current state, pausing, restarting |
| LevelManager | Loading levels, tracking level completion |
| ScoreManager | Score and high scores for the session |
| AudioManager | Music and global sound settings |
| SaveManager | Reading and writing progress |

Keep each manager focused. A single enormous GameManager that does everything becomes impossible to maintain, the same problem as a player script that knows about everything.

### Level flow with states

\`\`\`text
Playing --(player dies)--> GameOver --(retry)--> Playing
Playing --(reaches goal)--> LevelComplete --(next)--> Playing (next level)
Playing --(pause button)--> Paused --(resume)--> Playing
\`\`\`

Drawing the state diagram before coding reveals missing transitions, such as what happens if the player pauses during the level-complete animation.

### Restarting cleanly

Reloading the current scene is the simplest restart:

\`\`\`csharp
SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
\`\`\`

Remember that objects marked \`DontDestroyOnLoad\` survive, so reset their per-level data, such as the level score, when a new level starts.

### Keep managers testable

Where possible, keep game rules in plain C# classes that do not depend on MonoBehaviour, with managers simply calling them. Rules such as "calculate stars from time and coins" can then be tested with Unity's Test Framework (chapter 10) without running a scene.
      `,
        [
          q('Why does the GameManager destroy duplicates in Awake?', [
            'To reset the score every frame',
            'To save memory on every scene load',
            'Returning to its scene would create a second instance',
            'Unity forbids two MonoBehaviours with the same name',
          ], 2, 'The duplicate check keeps exactly one persistent manager.'),
          q('What does DontDestroyOnLoad do?', [
            'Keeps the object alive when a new scene loads',
            'Prevents the object from being deleted in the editor',
            'Makes the object invisible in the Hierarchy',
            'Saves the object to disk',
          ], 0, 'Objects marked this way persist across scene changes.'),
          q('What is a risk of overusing singletons?', [
            'They make scenes load slower',
            'They cannot hold variables',
            'They only work in 2D games',
            'Hidden dependencies make code hard to change and test',
          ], 3, 'Global access everywhere recreates the tight coupling that good architecture avoids.'),
        ]
      ),
      lesson('Saving and Loading Progress', 14, `
Players expect their progress to survive closing the game: unlocked levels, coins, high scores, settings. Losing progress is one of the fastest ways to earn negative reviews. Unity offers simple storage for small values and file-based saving for complete progress.

### PlayerPrefs for simple values

\`\`\`csharp
PlayerPrefs.SetInt("HighScore", 12500);
PlayerPrefs.SetFloat("MusicVolume", 0.8f);
PlayerPrefs.SetString("PlayerName", "Ayesha");
PlayerPrefs.Save();

int highScore = PlayerPrefs.GetInt("HighScore", 0);   // 0 if not saved yet
\`\`\`

PlayerPrefs suits settings and small values. It is not designed for large or complex data, and it is easy for players to edit, so do not rely on it for anything valuable, such as purchased currency.

### JSON files for game progress

For structured progress, save a data class as JSON:

\`\`\`csharp
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

[Serializable]
public class SaveData
{
    public int coins;
    public int highestLevelUnlocked = 1;
    public List<int> starsPerLevel = new List<int>();
}

public class SaveManager : MonoBehaviour
{
    private string SavePath => Path.Combine(Application.persistentDataPath, "save.json");

    public void Save(SaveData data)
    {
        string json = JsonUtility.ToJson(data, true);
        string temp = SavePath + ".tmp";
        File.WriteAllText(temp, json);
        if (File.Exists(SavePath)) File.Delete(SavePath);
        File.Move(temp, SavePath);
    }

    public SaveData Load()
    {
        if (!File.Exists(SavePath)) return new SaveData();
        try
        {
            return JsonUtility.FromJson<SaveData>(File.ReadAllText(SavePath));
        }
        catch (Exception e)
        {
            Debug.LogWarning($"Save file could not be read: {e.Message}");
            return new SaveData();
        }
    }
}
\`\`\`

\`Application.persistentDataPath\` points to a folder that survives updates on every platform. Writing to a temporary file first and then replacing the old save reduces the chance of a corrupted save if the app closes mid-write.

### What JsonUtility can and cannot do

\`JsonUtility\` is fast and built in, but it only serialises fields Unity can serialise: public fields or \`[SerializeField]\` fields, lists and nested serialisable classes. It does not handle dictionaries or properties. For more complex data, the Newtonsoft JSON package for Unity is a popular alternative.

### When to save

| Moment | Why |
|---|---|
| Level completed | Progress milestone |
| Purchase or reward received | Players must never lose these |
| Settings changed | Preferences should persist immediately |
| App paused or sent to background | Mobile apps can be closed by the system without warning |

\`\`\`csharp
void OnApplicationPause(bool paused)
{
    if (paused) Save(currentData);
}
\`\`\`

On phones, the operating system may close a background app at any time, so saving in \`OnApplicationPause\` is important. Relying only on \`OnApplicationQuit\` loses progress on mobile.

### Versioning save data

Future updates may add fields. Include a version number in the save data, and when loading older versions, fill new fields with sensible defaults. Otherwise an update can break existing players' saves, which is especially damaging for popular games.

### Cloud saves

Players who change phones expect progress to follow them. Cloud saving services, such as Unity's cloud save offerings or platform services like Google Play Games, can sync progress. They add complexity, so start with reliable local saving and add cloud sync when the game needs it.

### Protecting valuable data

Anything saved on the device can be modified by determined players. For single-player games, that is often acceptable. For purchases, competitive leaderboards and multiplayer economies, the authoritative data must be verified on a server, not trusted from the device.

### Test saving thoroughly

Test first launch with no save, loading an old save, closing the app mid-level, low storage and updating the game. Clear saved data during development through a debug menu option, so testing fresh starts is quick.
      `,
        [
          q('What is PlayerPrefs best suited for?', [
            'Settings and small simple values',
            'Large inventories and complex progress',
            'Securely storing purchased currency',
            'Sharing saves between players',
          ], 0, 'PlayerPrefs is simple storage for small values, not for complex or valuable data.'),
          q('Why save in OnApplicationPause on mobile?', [
            'It is the only method that can write files',
            'It makes saving faster than elsewhere',
            'PlayerPrefs only works during pauses',
            'The system may close background apps without warning',
          ], 3, 'Saving when the app goes to the background protects progress.'),
          q('Why write the save to a temporary file before replacing the old one?', [
            'Temporary files load faster',
            'It reduces the risk of corruption if the app closes mid-write',
            'JsonUtility requires a temporary file',
            'It makes saves smaller',
          ], 1, 'The old save stays intact until the new one is completely written.'),
        ]
      ),
      lesson('Levels, Difficulty and Progression', 13, `
Players keep playing when they feel they are improving and have something to work towards. Well-designed levels, a smooth difficulty curve and a sense of progression turn a set of mechanics into a game people return to. This lesson covers the design and the data behind it.

### Level structure

| Structure | Examples | Good for |
|---|---|---|
| Handcrafted levels | Platformers, puzzle games | Tightly designed experiences |
| Endless or procedural | Runners, survival waves | Replayability with less content |
| Hub and levels | Adventure games | Exploration plus focused challenges |

Handcrafted levels take more work per minute of play but allow precise teaching and pacing.

### The difficulty curve

Difficulty should rise overall, with dips that let players breathe and feel powerful:

\`\`\`text
Difficulty
   ^                                /\\    boss
   |                     /\\        /  \\
   |          /\\        /  \\  /\\  /
   |   /\\    /  \\  /\\  /    \\/  \\/
   |  /  \\  /    \\/  \\/
   | /    \\/
   +------------------------------------> Levels
     teach   combine   master   test
\`\`\`

A common pattern for each new mechanic: introduce it safely, practise it, combine it with earlier mechanics, then test mastery. Players who meet a new enemy in a quiet room before facing it in a crowd learn without frustration.

### Data-driven levels and waves

Store level settings in ScriptableObjects (chapter 5), so designers can adjust difficulty without code:

\`\`\`csharp
[CreateAssetMenu(menuName = "Game/Wave Set")]
public class WaveSet : ScriptableObject
{
    [System.Serializable]
    public class Wave
    {
        public Enemy enemyPrefab;
        public int count;
        public float spawnInterval;
    }

    public Wave[] waves;
}
\`\`\`

A spawner reads the waves in order. Balancing becomes a matter of editing assets and playtesting.

### Dynamic difficulty

Some games adjust difficulty based on performance: after several failures, an enemy has slightly less health or a checkpoint appears earlier. Done subtly, this keeps struggling players engaged. Be careful in competitive games, where players expect fair, fixed rules.

### Progression systems

| System | Keeps players motivated by |
|---|---|
| Unlocking levels | A clear path forward |
| Stars or ratings per level | Replaying for better results |
| Currency and upgrades | Visible growth in power |
| New abilities | Fresh mechanics that change how levels play |
| Achievements | Extra goals for dedicated players |
| Daily rewards | Returning regularly (common in mobile) |

Progression works best when it is tied to skill and play, not only to time spent. Unlocking a double jump that opens new routes feels far better than a small percentage stat increase.

### Rewarding the player

Rewards should feel earned and be clearly presented: a results screen with stars filling in, coins counting up and new unlocks revealed. The game feel techniques from chapter 6 apply here too.

### Measuring difficulty

You are the worst judge of your own game's difficulty, because you know every trick. Watch new players:

- Where do they fail repeatedly?
- Where do they stop playing?
- Which levels do they finish much faster than expected?

Analytics in published games show the same patterns at scale, such as the level where many players quit. That level usually needs rebalancing.

### Avoid unfair difficulty

Difficulty should come from challenge, not unfairness. Unclear hazards, enemies appearing without warning, long replays after failure and random instant deaths frustrate players. Clear telegraphing, frequent checkpoints and quick restarts keep hard games enjoyable.
      `,
        [
          q('What is a good pattern for introducing a new mechanic?', [
            'Introduce it in the hardest level first',
            'Explain it only in a written manual',
            'Teach it safely, practise, combine, then test mastery',
            'Introduce several new mechanics together',
          ], 2, 'Gradual introduction lets players learn without frustration.'),
          q('Why store waves in ScriptableObjects?', [
            'Designers can rebalance without changing code',
            'Waves run faster from assets',
            'Enemies cannot spawn otherwise',
            'It removes the need to playtest',
          ], 0, 'Data assets make balancing quick and safe.'),
          q('Why are you a poor judge of your own game\'s difficulty?', [
            'Developers cannot play their own builds',
            'Difficulty only exists on phones',
            'You already know every trick and layout',
            'Unity hides difficulty settings from developers',
          ], 2, 'Familiarity makes a game feel easier than it is for newcomers.'),
        ]
      ),
      lesson('Coroutines and Timing', 13, `
Games are full of sequences and delays: flash for 0.1 seconds, wait 3 seconds then spawn the next wave, fade the screen out and load the next level, count down "3, 2, 1, Go!". Coroutines let you write these as readable step-by-step code instead of juggling timers in Update.

### What a coroutine is

A coroutine is a method that can pause and continue later, spread across frames:

\`\`\`csharp
using System.Collections;
using UnityEngine;

public class Countdown : MonoBehaviour
{
    void Start()
    {
        StartCoroutine(CountdownRoutine());
    }

    private IEnumerator CountdownRoutine()
    {
        for (int i = 3; i > 0; i--)
        {
            Debug.Log(i);
            yield return new WaitForSeconds(1f);
        }
        Debug.Log("Go!");
    }
}
\`\`\`

The method returns \`IEnumerator\` and uses \`yield return\` to pause.

### Common yield instructions

| Yield | Waits for |
|---|---|
| \`yield return null\` | The next frame |
| \`yield return new WaitForSeconds(t)\` | t seconds of scaled game time |
| \`yield return new WaitForSecondsRealtime(t)\` | t real seconds, even when paused |
| \`yield return new WaitForFixedUpdate()\` | The next physics step |
| \`yield return new WaitUntil(() => condition)\` | A condition to become true |
| \`yield return StartCoroutine(Other())\` | Another coroutine to finish |

### Sequences

\`\`\`csharp
private IEnumerator LevelCompleteSequence()
{
    GameManager.Instance.SetState(GameState.LevelComplete);
    yield return new WaitForSeconds(0.5f);
    resultsPanel.SetActive(true);
    yield return StartCoroutine(CountUpCoins());
    yield return new WaitForSeconds(1f);
    nextButton.SetActive(true);
}
\`\`\`

Reading the sequence top to bottom shows exactly what happens and when. Writing the same logic with timers in Update would need several flags and variables.

### Fading

\`\`\`csharp
private IEnumerator Fade(CanvasGroup group, float target, float duration)
{
    float start = group.alpha;
    float t = 0f;
    while (t < duration)
    {
        t += Time.unscaledDeltaTime;
        group.alpha = Mathf.Lerp(start, target, t / duration);
        yield return null;
    }
    group.alpha = target;
}
\`\`\`

A CanvasGroup controls the transparency of a whole panel. Using unscaled time lets the fade run even when the game is paused.

### Stopping coroutines

\`\`\`csharp
private Coroutine flashRoutine;

public void Flash()
{
    if (flashRoutine != null) StopCoroutine(flashRoutine);
    flashRoutine = StartCoroutine(FlashRoutine());
}
\`\`\`

Store the returned Coroutine to stop it later. Starting a new flash while one is running, without stopping the old one, causes flickering bugs. Coroutines also stop automatically when their GameObject is deactivated or destroyed, which can leave things half-finished, such as a colour that never resets.

### Caching wait objects

\`new WaitForSeconds(1f)\` allocates memory each time. In frequently repeated coroutines, create it once and reuse it:

\`\`\`csharp
private readonly WaitForSeconds oneSecond = new WaitForSeconds(1f);
\`\`\`

### Coroutines, Update or async?

| Tool | Best for |
|---|---|
| Update with timers | Continuous checks every frame |
| Coroutines | Sequences and delays tied to a GameObject |
| async and await (including Unity's Awaitable in Unity 6) | Loading, web requests and longer asynchronous work |

Coroutines run on the main thread; they do not make heavy work faster, they simply spread work across frames. For heavy calculations, split them into chunks per frame or look into Unity's Job System.

### Common mistakes

- Calling the coroutine method directly instead of with \`StartCoroutine\`: nothing happens.
- Forgetting \`yield return\` inside a loop: the loop runs all at once, freezing the game.
- Waiting with \`WaitForSeconds\` while the time scale is zero: it never finishes.
      `,
        [
          q('What happens if you call a coroutine method without StartCoroutine?', [
            'It runs twice as fast',
            'It runs on a separate thread',
            'Unity starts it on the next frame',
            'Nothing useful happens; it does not run as a coroutine',
          ], 3, 'Coroutines must be started with StartCoroutine to execute.'),
          q('Why use Time.unscaledDeltaTime in a menu fade?', [
            'So the fade works while the game is paused',
            'So the fade is always exactly one second',
            'Because CanvasGroup requires it',
            'To make the fade use less memory',
          ], 0, 'Unscaled time keeps running when Time.timeScale is zero.'),
          q('Why store the Coroutine returned by StartCoroutine?', [
            'It makes the coroutine run faster',
            'So you can stop it before starting another',
            'Unity deletes unstored coroutines',
            'It is needed to use yield return',
          ], 1, 'Keeping the reference allows StopCoroutine, avoiding overlapping sequences.'),
        ]
      ),
      ],
      [
      q('What is a bootstrap scene used for?', [
        'Storing all level art',
        'Testing physics settings',
        'Creating managers once before loading the menu',
        'Building the game for Android',
      ], 2, 'Loading managers first guarantees they exist and are not duplicated.'),
      q('Where should persistent save files be written?', [
        'The Assets folder',
        'The Library folder',
        'The Scenes folder',
        'Application.persistentDataPath',
      ], 3, 'persistentDataPath survives app updates on every platform.'),
      q('Why should valuable data, like purchases, be verified on a server?', [
        'Data on the device can be modified by players',
        'Servers make games run faster',
        'JsonUtility cannot save numbers',
        'PlayerPrefs deletes data weekly',
      ], 0, 'Anything stored locally can be edited, so authority must lie on a server.'),
      q('Which yield waits until a condition becomes true?', [
        'WaitForFixedUpdate',
        'WaitUntil',
        'WaitForSecondsRealtime',
        'yield return null',
      ], 1, 'WaitUntil pauses the coroutine until its condition returns true.'),
      ]
    ),
    chapter(
      'Performance and Testing',
      'Measure performance with the Profiler instead of guessing, optimise rendering, memory and physics for phones, reuse objects with pooling to avoid garbage collection spikes, and test with automated tests and real players.',
      [
      lesson('Profiling a Game', 14, `
A game that stutters or drains the battery gets uninstalled, however good it is. But guessing what is slow wastes time: developers often optimise the wrong thing. The Unity Profiler measures exactly where each frame's time goes, so you fix what actually matters.

### Frame budgets

A frame must finish within a time budget to hit a target frame rate:

| Target | Time per frame |
|---|---|
| 30 frames per second | About 33.3 milliseconds |
| 60 frames per second | About 16.7 milliseconds |
| 120 frames per second | About 8.3 milliseconds |

On phones, aim to use well under the budget, because devices heat up and slow down under sustained load, called thermal throttling. A game that barely hits 60 at first may drop after ten minutes of play.

Mobile platforms default to 30 frames per second in Unity unless you set \`Application.targetFrameRate\`. Choose 60 for fast action games that can sustain it; 30 saves battery for slower games.

### Opening the Profiler

Window, Analysis, Profiler. Press record and play the game. The Profiler shows a timeline of frames with modules:

| Module | Shows |
|---|---|
| CPU Usage | Time spent in scripts, physics, rendering preparation, UI and more |
| GPU Usage | Time the graphics hardware spends (where supported) |
| Rendering | Draw calls, batches, triangles |
| Memory | Memory used and garbage allocated |
| Physics | Active bodies and contacts |
| Audio | Playing sources and audio memory |

Click a spike in the timeline to inspect that frame. The Hierarchy view lists which functions took the most time, including your own scripts' Update methods.

### Profile on the real device

Profiling in the editor includes the editor's own overhead and uses your powerful computer. Always profile on target devices:

\`\`\`text
1. In Build Profiles, enable Development Build and Autoconnect Profiler.
2. Build and run on the phone (connected by USB or on the same network).
3. The Profiler receives data from the phone.
\`\`\`

A game running at 200 frames per second in the editor may run at 25 on a budget Android phone. Test on the kind of phone your players actually own, which in Pakistan and many markets often means mid-range and budget Android devices.

### CPU-bound or GPU-bound?

| Symptom in the Profiler | Likely bottleneck | Where to look |
|---|---|---|
| Scripts, physics or animation take most time | CPU | Your code, physics settings, number of objects |
| CPU waits for the GPU | GPU | Overdraw, shaders, post-processing, resolution |
| Regular spikes with GC.Alloc | Garbage collection | Allocations in frequently called code |

Knowing which side is slow tells you which optimisations will help. Reducing triangles does nothing for a CPU-bound game.

### Other tools

- **Frame Debugger** (Window, Analysis) steps through every draw call in a frame, showing why objects were not batched together.
- **Memory Profiler package** captures detailed memory snapshots to find large textures and leaks.
- **Profiler markers** label your own code sections so they show clearly in the Profiler.

\`\`\`csharp
using Unity.Profiling;

static readonly ProfilerMarker PathMarker = new ProfilerMarker("Enemy.Pathfinding");

void UpdatePath()
{
    using (PathMarker.Auto())
    {
        // pathfinding work
    }
}
\`\`\`

### A profiling workflow

\`\`\`text
1. Define the target: for example, 60 fps on a mid-range phone.
2. Profile on the device during demanding gameplay.
3. Find the biggest cost.
4. Fix that one thing.
5. Profile again to confirm the improvement.
\`\`\`

Fix the biggest problem first and measure after every change. Optimisations that do not show up in measurements add complexity for nothing.
      `,
        [
          q('About how long can a frame take at 60 frames per second?', [
            'About 33.3 milliseconds',
            'About 16.7 milliseconds',
            'About 8.3 milliseconds',
            'About 60 milliseconds',
          ], 1, 'One second divided by 60 frames is roughly 16.7 milliseconds.'),
          q('Why profile on a real phone instead of only in the editor?', [
            'The editor adds overhead and runs on a far faster machine',
            'The Profiler does not work in the editor',
            'Phones show more detailed graphs',
            'Editor profiling deletes build settings',
          ], 0, 'Only device profiling shows the performance players will experience.'),
          q('The Profiler shows the CPU waiting for the GPU. What should you look at?', [
            'Script Update methods only',
            'The number of audio sources',
            'Overdraw, shaders and post-processing',
            'The save system',
          ], 2, 'A GPU-bound game needs rendering optimisations, not script changes.'),
        ]
      ),
      lesson('Optimising for Mobile Devices', 14, `
Phones have limited processing power, memory, battery and heat tolerance compared with computers, and there is enormous variety among them. Optimising for mobile means doing less work per frame where players will not notice. These are the techniques that make the biggest difference in typical Unity mobile games.

### Rendering

| Technique | Why it helps |
|---|---|
| Fewer draw calls through batching | Each draw call has CPU cost; URP's SRP Batcher, static batching and GPU instancing combine work |
| Sprite atlases (2D) | Sprites sharing an atlas can be drawn together |
| Reduce overdraw | Many overlapping transparent layers are very expensive on mobile GPUs |
| Simple shaders | Unlit or Simple Lit shaders cost less than full Lit |
| Limit realtime lights and shadows | Each light and shadow adds rendering work |
| Bake lighting | Pre-calculated lighting is almost free at runtime |
| Light post-processing | Bloom and depth of field are costly on phones |

### Textures and meshes

- **Texture compression**: use ASTC for modern Android and iOS devices; uncompressed textures use far more memory.
- **Maximum sizes**: a small icon does not need a 2048 pixel texture. Set Max Size appropriately per texture.
- **Mipmaps**: enable for 3D textures seen at distances; disable for UI and 2D sprites that are always the same size.
- **Level of detail (LOD)**: LOD Groups swap in simpler models for distant objects.
- **Occlusion culling**: skip rendering objects hidden behind walls in enclosed 3D levels.

### Resolution scaling

Modern phones have very high resolutions. Rendering at a slightly lower resolution, using URP's Render Scale setting, can greatly reduce GPU cost with little visible difference on small screens. Many successful mobile games render below native resolution.

### Scripts and physics

| Issue | Fix |
|---|---|
| Heavy work in Update on many objects | Update less often, or only for nearby objects |
| Frequent GetComponent or Find calls | Cache references in Awake |
| Many physics bodies and complex colliders | Use simple colliders, fewer active bodies, layer-based collision filtering |
| Too frequent physics steps | Consider a less frequent Fixed Timestep if gameplay allows |
| Allocations every frame | Reduce garbage (next lesson) |

### UI

Split frequently changing UI onto separate canvases (chapter 7), disable Raycast Target on images and text that do not need clicks, and avoid layout groups on elements that change every frame.

### Build size

Players on limited mobile data are less likely to download large games. Reduce size by compressing textures and audio, removing unused assets, stripping unused engine code and loading optional content later with Addressables. Check the Build Report in the Console after building (or the editor log) to see which assets take the most space.

### Quality settings

Offer quality levels, or detect device capability and choose automatically: lower resolution, fewer effects and no shadows on low-end phones, more on flagship devices. Unity's Quality settings and URP assets let you define several tiers.

### Battery and heat

Running at 60 frames per second in a menu wastes battery. Lower the frame rate in menus and paused states, and avoid unnecessary work when nothing changes. Players notice when a game makes their phone hot.

### Test on low-end hardware

Keep one budget Android phone for testing throughout development. If the game runs well there, it will run well almost everywhere. Discovering performance problems a week before launch is far more painful than catching them early.

### Optimise with evidence

Every technique here has a cost in complexity or visual quality. Apply them where the Profiler shows a problem, measure the result and keep only changes that help. Premature optimisation of code that is not slow wastes time better spent making the game fun.
      `,
        [
          q('Why is overdraw a particular problem on mobile?', [
            'It increases the build size',
            'It breaks physics collisions',
            'It disables texture compression',
            'Overlapping transparent layers are expensive for mobile GPUs',
          ], 3, 'Drawing many transparent layers on the same pixels costs a lot of GPU time on phones.'),
          q('What does lowering URP\'s Render Scale do?', [
            'Renders at a lower resolution to reduce GPU cost',
            'Makes UI elements smaller',
            'Reduces the number of scripts',
            'Compresses audio files',
          ], 0, 'Rendering fewer pixels saves GPU work with little visible difference on small screens.'),
          q('Why keep a budget Android phone for testing?', [
            'Budget phones run Unity faster',
            'Google Play requires it',
            'If the game runs well there, it runs well almost everywhere',
            'The Profiler only connects to budget phones',
          ], 2, 'Testing on low-end hardware catches performance problems early.'),
        ]
      ),
      lesson('Object Pooling and Garbage Collection', 13, `
Creating and destroying objects, and allocating memory in code that runs every frame, produces garbage: memory the garbage collector must later clean up. Collection takes time, causing stutters that players feel as sudden hitches, especially on phones. Pooling and allocation-aware code keep gameplay smooth.

### What causes garbage

| Common source | Better approach |
|---|---|
| Instantiate and Destroy for bullets and effects | Object pooling |
| String concatenation every frame, such as \`"Score: " + score\` | Update text only when values change |
| Creating new lists or arrays in Update | Reuse a list and clear it |
| LINQ queries in frequently called code | Plain loops |
| \`new WaitForSeconds\` in repeated coroutines | Cache the wait object |
| Physics queries that return new arrays | Non-allocating versions that fill a reusable buffer |

The Profiler's GC.Alloc column shows which functions allocate memory each frame. Aim for zero allocations per frame during gameplay.

### Object pooling

Instead of destroying objects, deactivate them and reuse them later. Unity includes a built-in pool:

\`\`\`csharp
using UnityEngine;
using UnityEngine.Pool;

public class BulletPool : MonoBehaviour
{
    [SerializeField] private Bullet bulletPrefab;
    private ObjectPool<Bullet> pool;

    void Awake()
    {
        pool = new ObjectPool<Bullet>(
            createFunc: () =>
            {
                Bullet b = Instantiate(bulletPrefab);
                b.SetPool(pool);
                return b;
            },
            actionOnGet: b => b.gameObject.SetActive(true),
            actionOnRelease: b => b.gameObject.SetActive(false),
            actionOnDestroy: b => Destroy(b.gameObject),
            collectionCheck: false,
            defaultCapacity: 20,
            maxSize: 100);
    }

    public Bullet Get(Vector3 position, Quaternion rotation)
    {
        Bullet b = pool.Get();
        b.transform.SetPositionAndRotation(position, rotation);
        return b;
    }
}
\`\`\`

The bullet returns itself instead of being destroyed:

\`\`\`csharp
public class Bullet : MonoBehaviour
{
    private IObjectPool<Bullet> pool;
    private float timer;

    public void SetPool(IObjectPool<Bullet> owner) => pool = owner;

    void OnEnable() => timer = 2f;

    void Update()
    {
        timer -= Time.deltaTime;
        if (timer <= 0f) pool.Release(this);
    }
}
\`\`\`

### Resetting pooled objects

A reused object keeps its old state: velocity, health, colour, active particles. Reset everything in \`OnEnable\` or in the pool's get action. Forgetting this causes strange bugs, such as a bullet that starts with the previous bullet's velocity, or an enemy spawning with zero health.

### What to pool

Pool objects that are created and destroyed frequently: bullets, hit effects, floating damage numbers, enemies in wave games, collectible coins. Objects created once per level do not need pooling.

### Pre-warming

Creating many objects at the start of a busy moment causes a spike. Pre-warm the pool during loading, creating objects in advance and releasing them immediately, so gameplay never needs to instantiate.

### Incremental garbage collection

Unity uses incremental garbage collection by default, spreading collection work over several frames to reduce spikes. It helps, but it does not remove the cost; reducing allocations is still the most reliable fix.

### Other memory issues

- **Large textures and audio** consume most memory in many games. Compress them and unload what is not needed.
- **Leaked event subscriptions** keep objects alive (chapter 5); always unsubscribe.
- **Static lists** that keep growing hold references forever; clear them when levels end.

### Measure first, again

Pooling adds complexity. If you spawn a few objects per minute, Instantiate and Destroy are fine. Use the Profiler to confirm allocation spikes before adding pools, then confirm afterwards that the spikes are gone.
      `,
        [
          q('What causes the stutters linked to garbage collection?', [
            'The collector pausing to clean up allocated memory',
            'Too many lights in a scene',
            'Textures that are compressed',
            'Using FixedUpdate for physics',
          ], 0, 'Collection work takes time, and frequent allocations make it happen more.'),
          q('What must you do when reusing a pooled enemy?', [
            'Destroy it and create a new one',
            'Rename the prefab',
            'Reset its state, such as health and velocity',
            'Rebake the NavMesh',
          ], 2, 'Pooled objects keep old state, so they must be reset when reused.'),
          q('Which Profiler column shows memory allocated by functions each frame?', [
            'Self ms',
            'GC.Alloc',
            'Calls',
            'Total',
          ], 1, 'GC.Alloc reveals which code creates garbage each frame.'),
        ]
      ),
      lesson('Testing and Playtesting', 13, `
Testing has two sides. Technical testing checks that the game works: no crashes, broken saves or buttons that do nothing. Playtesting checks that the game is fun: clear, fair and engaging. Both are needed, and both are cheapest when done early and often.

### Automated tests with the Unity Test Framework

Open Window, General, Test Runner. Unity supports two kinds of tests:

| Edit Mode tests | Play Mode tests |
|---|---|
| Run without entering Play mode | Run the game loop, over several frames |
| Fast | Slower |
| Test plain logic: score rules, damage calculations, save data | Test behaviour: a player falls, a door opens |

\`\`\`csharp
using NUnit.Framework;

public class ScoreRulesTests
{
    [Test]
    public void ThreeStars_WhenFastAndAllCoins()
    {
        int stars = ScoreRules.CalculateStars(timeTaken: 40f, coinsCollected: 30, totalCoins: 30);
        Assert.AreEqual(3, stars);
    }
}
\`\`\`

This is why chapter 9 recommended keeping rules in plain C# classes: they are easy to test.

A Play Mode test can wait for frames:

\`\`\`csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class PhysicsTests
{
    [UnityTest]
    public IEnumerator Crate_FallsUnderGravity()
    {
        var crate = new GameObject("Crate");
        crate.AddComponent<Rigidbody>();
        float startY = crate.transform.position.y;

        yield return new WaitForSeconds(0.5f);

        Assert.Less(crate.transform.position.y, startY);
        Object.Destroy(crate);
    }
}
\`\`\`

Test assemblies need an Assembly Definition referencing your game code; the Test Runner can create the test folder and assembly for you.

### A manual test checklist

| Area | Check |
|---|---|
| Flow | Every menu opens, closes and returns correctly |
| Saving | Progress survives quitting, updating and restarting |
| Interruptions | Calls, notifications and switching apps pause and resume correctly |
| Devices | Small phones, tall phones with notches, tablets, low-end hardware |
| Offline | The game handles no internet gracefully |
| Settings | Volume, quality and language persist |
| Edge cases | Pausing during a cutscene, dying while finishing a level |

### Writing good bug reports

\`\`\`text
Title:    Coins not saved after completing level 3
Build:    0.4.2 (Android)
Device:   Budget Android phone, Android 13
Steps:    1. Start level 3  2. Collect 20 coins  3. Finish  4. Restart app
Expected: Coin total includes the 20 coins
Actual:   Coin total is unchanged
\`\`\`

Clear steps let anyone reproduce the bug, which is the first step to fixing it.

### Playtesting

Watch people play without helping them:

- Give minimal instructions, as a real player would have.
- Stay silent and observe where they hesitate, get lost or fail.
- Ask them to think aloud, describing what they are trying to do.
- Afterwards, ask open questions: What was confusing? What was most fun? When did you want to stop?

Players' suggestions for solutions are less reliable than their reactions. If three players miss the same door, the signposting is the problem, even if nobody says so.

### Beta testing

Before launch, distribute test builds to a wider group through Google Play's testing tracks (chapter 11) or TestFlight on iOS. Crash reporting, through Unity Cloud Diagnostics or similar services, reveals problems on devices you do not own.

### Test continuously

Test after every significant change rather than saving it for the end. A bug found the day it was introduced takes minutes to fix; the same bug found months later, buried under other changes, can take days.
      `,
        [
          q('What suits an Edit Mode test?', [
            'A score calculation in a plain C# class',
            'A crate falling under gravity',
            'A door opening when the player approaches',
            'A character walking along a NavMesh path',
          ], 0, 'Edit Mode tests run fast without the game loop, ideal for pure logic.'),
          q('During playtesting, three players miss the same door. What does it suggest?', [
            'The players were careless',
            'The door needs a longer animation',
            'The level should be deleted',
            'The signposting needs to improve',
          ], 3, 'Repeated player behaviour reveals design problems, even when nobody reports them.'),
          q('What makes a bug report useful?', [
            'A long description of how annoying it was',
            'Clear steps, expected and actual results, device and build',
            'Only a screenshot with no text',
            'A suggestion to rewrite the whole game',
          ], 1, 'Reproducible details let developers find and fix the bug.'),
        ]
      ),
      ],
      [
      q('What is thermal throttling?', [
        'A setting that caps the frame rate in menus',
        'A Unity tool for heating effects',
        'Phones slowing down as they heat up under load',
        'A compression method for textures',
      ], 2, 'Sustained load heats phones, which then reduce performance to cool down.'),
      q('Which texture compression suits modern Android and iOS devices?', [
        'ASTC',
        'Uncompressed RGBA',
        'BMP',
        'TIFF',
      ], 0, 'ASTC is widely supported on modern mobile GPUs and offers good quality for its size.'),
      q('What does pre-warming a pool mean?', [
        'Heating the device before playing',
        'Deleting pooled objects before a level',
        'Doubling the pool size each frame',
        'Creating pooled objects in advance during loading',
      ], 3, 'Pre-creating objects avoids instantiation spikes during gameplay.'),
      q('What should players\' suggestions in playtests be treated as?', [
        'Final design decisions to implement exactly',
        'Less reliable than their observed reactions',
        'Irrelevant to game design',
        'Only useful for bug reports',
      ], 1, 'Watching what players do reveals problems more reliably than their proposed fixes.'),
      ]
    ),
    chapter(
      'Publishing Your Game',
      'Configure builds for each platform, publish an Android game on Google Play, release web and PC builds on itch.io and beyond, and choose a monetisation model with ads and in-app purchases that respects players.',
      [
      lesson('Build Profiles and Target Platforms', 13, `
Finishing a game inside the editor is only half the journey; players need a build they can install or open. Unity 6 manages this through Build Profiles, which store platform-specific settings. Setting up builds correctly early avoids last-minute surprises, such as a game that runs in the editor but fails on the phone.

### Build Profiles

Open File, Build Profiles (older versions call it Build Settings):

| Area | Purpose |
|---|---|
| Platform list | Windows, Mac, Linux, Android, iOS, Web and more (modules must be installed) |
| Scene List | Which scenes are included, in order |
| Development Build | Enables debugging and profiling |
| Player Settings | Company name, product name, icon, version and platform options |

You can create several profiles, for example a development Android profile with debugging and a release Android profile, and switch between them.

### Player Settings to set early

| Setting | Notes |
|---|---|
| Company and Product Name | Shown to players and used in default identifiers |
| Version | Visible version, such as 1.0.3 |
| Package Name (Android) or Bundle Identifier (iOS) | A unique reverse-domain ID, such as com.yourstudio.skyhopper; very hard to change after publishing |
| Icons and splash screen | App icons in required sizes; splash options depend on your Unity plan |
| Default orientation | Portrait, landscape or auto-rotation |

### Android settings

| Setting | Recommended |
|---|---|
| Scripting Backend | IL2CPP (compiles to native code; required for 64-bit) |
| Target Architectures | ARM64 (Google Play requires 64-bit support) |
| Minimum API Level | Low enough to reach your players' devices |
| Target API Level | As required by Google Play's current policy |
| Build format | Android App Bundle (AAB) for Google Play |

Google Play periodically raises the required target API level, so check current requirements before each release and update the editor if needed.

### Signing

Android apps are signed with a keystore. Create one in Publishing Settings under Player Settings, and keep it and its passwords backed up securely. With Play App Signing, Google holds the app signing key and your keystore acts as an upload key that can be reset through support if lost, but losing it still causes delays.

### iOS in brief

iOS builds produce an Xcode project that must be built and signed on a Mac, with an Apple Developer Program membership to publish. The concepts are similar to Android: identifiers, icons, signing and testing through TestFlight.

### Development builds

Development builds enable the Profiler, debugging and on-screen error logs. They are slower and larger, so never upload one to a store. A separate release profile avoids accidentally publishing a development build.

### Versioning

Keep two numbers: a visible version (1.2.0) and an internal version code that increases with every upload (Android's Bundle Version Code). Stores reject uploads that reuse an old version code.

### Automating builds

Building by hand every time is slow and error-prone. Unity Build Automation (a cloud service) or a build script with a continuous integration system can build every platform automatically when you push code. Even for solo developers, a script that builds with the right settings saves mistakes.

### Test the build, not the editor

Some problems only appear in builds: platform-specific code paths, missing scenes, stripped code, file paths, shader differences and performance. Install builds on real devices regularly throughout development, not only at the end.

### Release checklist

\`\`\`text
[ ] Correct profile (release, not development)
[ ] Version and version code increased
[ ] All scenes in the Scene List
[ ] Icons, name and orientation correct
[ ] Tested on a low-end and a high-end device
[ ] Keystore backed up
\`\`\`
      `,
        [
          q('Why choose the Package Name carefully before publishing?', [
            'It changes the game\'s colour scheme',
            'It is very hard to change after publishing',
            'It sets the game\'s frame rate',
            'It decides the game\'s price',
          ], 1, 'The package name identifies the app permanently on the store.'),
          q('Which scripting backend is needed for 64-bit Android builds?', [
            'IL2CPP',
            'Mono only',
            'JavaScript',
            'WebAssembly',
          ], 0, 'IL2CPP supports ARM64, which Google Play requires.'),
          q('Why keep a separate release build profile?', [
            'Release profiles build twice as fast',
            'Unity requires two profiles for Android',
            'Release profiles include the Profiler',
            'It avoids accidentally publishing a development build',
          ], 3, 'Separating profiles prevents shipping slow, debug-enabled builds.'),
        ]
      ),
      lesson('Publishing on Google Play', 14, `
Google Play reaches billions of Android devices worldwide, including most phones in Pakistan. Publishing there involves a developer account, a store listing, policy declarations and testing tracks. The process is straightforward once you know the steps, and Google's requirements change over time, so always check the current Play Console guidance.

### The developer account

Register for a Google Play Console developer account. There is a one-time registration fee (check the current amount on Google's site), and identity verification is required. Personal and organisation accounts have different requirements; organisation accounts need business details.

At the time of writing, new personal developer accounts must run a closed test with a minimum number of testers for a minimum period before they can publish to production. Plan for this: recruit testers from friends, classmates and communities before you finish the game.

### Creating the app

In Play Console, create an app, then complete the required sections:

| Section | What you provide |
|---|---|
| Store listing | Title, short and full description, icon, feature graphic, screenshots, optional video |
| Content rating | A questionnaire that produces age ratings |
| Target audience | The age groups the game is for; games for children have extra policies |
| Data safety | What data the game and its SDKs (ads, analytics) collect and share |
| Privacy policy | A public web page describing data handling |
| Ads declaration | Whether the game shows ads |

The data safety form must include data collected by third-party SDKs such as ad networks. Read each SDK's documentation to answer accurately.

### Testing tracks

| Track | Audience |
|---|---|
| Internal testing | Up to a small group of trusted testers, available quickly |
| Closed testing | Invited testers, by email list or groups |
| Open testing | Anyone can join from the store listing |
| Production | Everyone |

Upload your AAB to internal testing first, install it through the Play Store link, and confirm everything works on real devices. Then move through closed testing to production.

### The store listing sells the game

Most players decide within seconds based on the icon, the first screenshots and the title:

- **Icon**: simple, bold and recognisable at small size.
- **Screenshots**: show real gameplay with short captions explaining the fun.
- **Short description**: one clear sentence about what makes the game appealing.
- **Video**: the first few seconds must show exciting gameplay.

Research similar successful games and study their listings. Test different icons and screenshots with Play Console's store listing experiments once you have traffic.

### Staged rollouts

When releasing updates, roll out to a percentage of users first, monitor crashes and reviews, then increase. Play Console's Android vitals shows crash and ANR (app not responding) rates, which also affect how visible your game is on the store.

### After launch

- Respond politely to reviews, especially bug reports.
- Fix crashes reported in Android vitals quickly.
- Update regularly with fixes and content.
- Keep the target API level current to remain available to new users.

### Policy compliance

Apps are reviewed, and policy violations can lead to rejection or removal. Common problems include misleading store listings, ads that interrupt unexpectedly, missing privacy policies and inaccurate data safety answers. Reading the policies before building ads and data features saves painful rework.

### Receiving payments

To sell games or in-app purchases, you set up a payments profile and a way to receive payouts. Payment options, fees and tax requirements vary by country and change over time, so check Google's current documentation for Pakistan and seek local tax advice for your earnings.
      `,
        [
          q('What must the Data safety form include?', [
            'Only data your own code collects',
            'Your personal bank details',
            'Data collected by the game and its third-party SDKs',
            'A list of every tester\'s name',
          ], 2, 'Ad and analytics SDKs collect data too, and must be declared.'),
          q('Which testing track should you use first for a new build?', [
            'Internal testing',
            'Production',
            'Open testing',
            'Staged rollout to everyone',
          ], 0, 'Internal testing lets a small trusted group verify the build quickly.'),
          q('What is the purpose of a staged rollout?', [
            'To hide the game from search results',
            'To charge users in stages',
            'To test the game on computers first',
            'To release to a percentage first and watch for problems',
          ], 3, 'Gradual releases limit the impact of bugs in new updates.'),
        ]
      ),
      lesson('Web Builds, PC and itch.io', 13, `
Not every game belongs on a mobile store. Web builds let anyone play instantly in a browser, which is perfect for portfolios, game jams and demos. PC builds reach players on Windows, macOS and Linux through storefronts such as itch.io and Steam. Each platform has its own strengths and setup.

### Web builds

Unity's Web platform (called WebGL in older versions) exports the game to run in modern browsers using WebAssembly.

| Strength | Limitation |
|---|---|
| Play instantly with a link | Larger download before the game starts |
| Perfect for portfolios and jams | Less performance than native builds |
| No installation | Some features, such as threads and certain plugins, are limited |
| Works on many devices | Mobile browser support is improving but needs testing |

Tips for web builds:

- Keep the build small: compress textures and audio, and avoid huge scenes.
- Choose a compression format (Brotli gives smaller files, Gzip is widely supported). If your host does not serve the right headers, enable Decompression Fallback.
- Test in several browsers, and on phones if you expect mobile players.
- Provide a loading bar; players leave if a blank screen appears for long.

### Publishing on itch.io

itch.io is a popular open marketplace for independent games:

\`\`\`text
1. Create an itch.io account and a new project.
2. Kind of project: HTML for web builds, or Downloadable for PC builds.
3. Zip the web build folder (index.html at the root of the zip) and upload.
4. Tick "This file will be played in the browser" and set the viewport size.
5. Add a description, screenshots, a cover image and tags.
6. Choose pricing: free, paid, or "pay what you want".
\`\`\`

itch.io is excellent for portfolios, prototypes, jam entries and small commercial games. Its revenue share is set by the developer, which is unusual among stores.

### PC builds

Windows builds produce an executable plus data folders; zip the whole folder, not just the executable. For macOS, builds need signing and notarisation to avoid security warnings, which requires an Apple Developer account. Linux builds are simple to produce and appreciated by a smaller audience.

### Steam

Steam is the largest PC storefront. Publishing requires a Steamworks account, a per-game fee (check the current Steam Direct terms) and store page preparation. Steam success depends heavily on wishlists gathered before launch through a store page, trailers, demos and festivals. It is a big step, best taken once you have a polished game and some audience.

### Input differences

PC players expect keyboard and mouse, often with gamepad support; web players may use either a keyboard or a touch screen. The Input System's action bindings (chapter 3) make supporting all of these straightforward. Show the right button prompts for the device being used.

### Resolution and windows

PC players have monitors of every size and expect settings for resolution, fullscreen or windowed mode and graphics quality. Test at several resolutions and aspect ratios, including ultrawide monitors if possible.

### Choosing where to publish first

| Goal | Good first platform |
|---|---|
| Portfolio pieces | itch.io web builds, playable instantly |
| Mobile casual game | Google Play, then iOS |
| Game jam entries | itch.io |
| Commercial PC game | itch.io for early feedback, Steam for launch |

For your first games, release quickly and publicly on itch.io. Real players, even a few, teach more than any amount of solo development.
      `,
        [
          q('What is a major strength of web builds?', [
            'Anyone can play instantly with a link',
            'They always outperform native builds',
            'They have no download size',
            'They support every plugin',
          ], 0, 'Browser play removes installation, ideal for portfolios and jams.'),
          q('When uploading a web build to itch.io, what must the zip contain?', [
            'Only the Unity project\'s Assets folder',
            'The editor\'s Library folder',
            'The build with index.html at the root of the zip',
            'A single executable file',
          ], 2, 'itch.io serves index.html from the root of the uploaded zip.'),
          q('What drives success on Steam before launch?', [
            'Uploading a development build',
            'Wishlists built through a store page, trailers and demos',
            'A low version number',
            'Removing gamepad support',
          ], 1, 'Wishlists gathered before release strongly influence launch visibility.'),
        ]
      ),
      lesson('Monetisation: Ads and In-App Purchases', 14, `
Making money from a game requires choosing a model that fits the game and its players. Most mobile games are free to download and earn through ads, in-app purchases or both. Done well, monetisation funds further development; done badly, it drives players away. The key is aligning revenue with what players value.

### Monetisation models

| Model | How it earns | Suits |
|---|---|---|
| Premium | Players pay upfront | PC, console, niche mobile games |
| Ads | Advertisers pay per view or click | Casual and hyper-casual mobile games |
| In-app purchases (IAP) | Players buy items, currency or features | Games with long-term engagement |
| Hybrid | Ads plus IAP, such as paying to remove ads | Many modern mobile games |
| Subscriptions or passes | Recurring payments or season passes | Games with regular content |

### Ad formats

| Format | Experience | Player reaction |
|---|---|---|
| Rewarded video | Player chooses to watch for a reward | Usually positive, because it is optional |
| Interstitial | Full-screen ad between levels | Tolerated if not too frequent |
| Banner | Small strip on screen | Low revenue, can clutter the UI |

Rewarded ads, such as "watch an ad to double your coins" or "continue after dying", often earn well and respect players because they are a choice. Interstitials should appear at natural breaks, never during gameplay, and not too often.

### Ad SDKs

Common options include Unity LevelPlay (Unity's ad mediation platform) and Google AdMob, which offers a Unity plugin. Mediation platforms fill each ad slot from several networks to improve revenue. Each SDK adds data collection that must be declared in store data safety forms, and consent requirements apply in many regions. Check each provider's current documentation, and follow policies for games aimed at children, which restrict ad types and data collection.

### In-app purchases

Unity's In-App Purchasing package connects to Google Play Billing and the Apple App Store. Typical products:

| Product type | Example |
|---|---|
| Consumable | Coins, gems, extra lives |
| Non-consumable | Remove ads, unlock a level pack |
| Subscription | VIP membership with daily rewards |

Stores require their own billing systems for digital goods inside apps. Always test purchases with test accounts before release, and restore non-consumable purchases when players reinstall or change phones, which stores require.

### Protecting purchases

Receipts can be faked on modified devices. For valuable purchases, validate receipts on a server. For small single-player games, local validation may be acceptable, but understand the risk.

### Ethical monetisation

Players, and increasingly regulators, react against manipulative design. Build trust:

- Make prices and what players get completely clear.
- Avoid pay-to-win systems that make the game unfair for free players.
- Be careful with random reward purchases, such as loot boxes, which are restricted in some countries and require disclosure of odds on major stores.
- Never design purchases that target children.
- Offer a fair experience to players who never pay.

### Measuring results

Analytics show retention (how many players return after one, seven and thirty days), average revenue per user and where players quit. Retention matters most: a game players abandon after one day earns little however it is monetised. Improve the game first, then tune monetisation.

### Realistic expectations

Most games earn little, and success usually comes after several releases, each better than the last. Treat early games as learning and portfolio pieces, and keep costs low. Publishers and studios value developers who have shipped games, whatever they earned.
      `,
        [
          q('Why do rewarded video ads usually respect players?', [
            'They play automatically during gameplay',
            'They are always shorter than other ads',
            'Players choose to watch in exchange for a reward',
            'They collect no data at all',
          ], 2, 'Optional ads with clear rewards feel like a fair exchange.'),
          q('What must a game do with non-consumable purchases like "remove ads"?', [
            'Charge again after each reinstall',
            'Restore them on reinstall or a new phone',
            'Expire them after a month',
            'Store them only in PlayerPrefs without checks',
          ], 1, 'Players expect, and stores require, restoration of permanent purchases.'),
          q('Which metric matters most before tuning monetisation?', [
            'Retention, how many players return',
            'The number of ad networks installed',
            'The size of the app icon',
            'How many banners are shown',
          ], 0, 'Without retention, no monetisation model earns much.'),
        ]
      ),
      ],
      [
      q('Which build format does Google Play require for new apps?', [
        'APK only',
        'ZIP archive',
        'EXE installer',
        'Android App Bundle (AAB)',
      ], 3, 'Google Play uses AABs to generate optimised downloads for each device.'),
      q('Why must the internal version code increase with every upload?', [
        'It sets the game\'s price',
        'Stores reject uploads that reuse an old version code',
        'It changes the app icon',
        'It is shown in the game\'s title',
      ], 1, 'Each upload needs a higher version code than the last.'),
      q('Where should interstitial ads appear?', [
        'At natural breaks, such as between levels',
        'During intense gameplay moments',
        'Every few seconds',
        'Before every button press',
      ], 0, 'Showing interstitials at breaks avoids interrupting play.'),
      q('What is a good first platform for portfolio games?', [
        'A paid Steam release',
        'A console storefront',
        'itch.io web builds',
        'A private folder on your laptop',
      ], 2, 'Web builds on itch.io are free to publish and instantly playable.'),
      ]
    ),
    chapter(
      'Careers in Game Development',
      'Design games around a clear core loop and scope, build a portfolio that proves you can ship, understand the game industry in Pakistan and internationally, and grow through game jams, communities and continued learning.',
      [
      lesson('Designing Games People Want to Play', 13, `
Technical skill makes a game work; design makes it worth playing. Many first games fail not because of bugs but because they are too big, unfocused or unclear. Learning to design small, focused games with a strong core loop is the fastest route to finished games people enjoy.

### The core loop

The core loop is the set of actions players repeat most:

\`\`\`text
Platformer:     run -> jump -> avoid danger -> collect -> reach goal
Match-3:        swap -> match -> clear -> score -> new board
Tower defence:  build -> defend -> earn -> upgrade -> next wave
Runner:         dodge -> collect -> speed up -> fail -> retry
\`\`\`

If the core loop is not fun on its own, with placeholder art, no amount of graphics, levels or features will fix it. Prototype the loop first and play it for a while before building anything else.

### Scope: the biggest trap

Beginners often plan an open-world game with online multiplayer. Those take large teams years. A realistic first project fits into a few weeks:

| Too big for a first game | Achievable first game |
|---|---|
| Open-world RPG | A short dungeon with three rooms and a boss |
| Online multiplayer shooter | A single-player arena with waves |
| Story game with hours of content | A ten-minute puzzle adventure |

Finishing small games teaches everything: building, polishing, publishing and marketing. Unfinished big games teach far less.

### A one-page design document

\`\`\`text
Title:        Sky Hopper
Pitch:        Hop between floating islands in Lahore's monsoon clouds.
Core loop:    Jump, collect kites, avoid lightning, reach the next island.
Controls:     Tap to jump, hold for higher jump.
Platform:     Android, portrait.
Scope:        20 levels, 3 hazards, 1 boss.
Target time:  6 weeks.
Out of scope: Multiplayer, story cutscenes, character customisation.
\`\`\`

Listing what is out of scope is as important as listing features. It protects you from adding "just one more thing" forever.

### Prototype and find the fun

Build the roughest possible version: cubes and circles, no menus. Play it. Is the core action satisfying? Try variations quickly: different speeds, gravity, controls. Throw away prototypes that are not fun; it is far cheaper than finishing a game nobody enjoys.

### Clarity

Players must understand what to do, what is dangerous and what they achieved. Use consistent visual language: hazards are always red and spiky, collectibles glow, interactive objects highlight. Teach through play rather than long text tutorials.

### Player motivation

Different players enjoy different things: mastery and challenge, exploration and discovery, creativity, social connection, collecting and completion. Decide which motivations your game serves and design around them, rather than trying to please everyone.

### Learn from existing games

Play games in your genre critically. Ask: what is the core loop? How do they teach new mechanics? How do they reward players? What would I change? Keep notes. Analysing games is how designers build intuition.

### Iterate with feedback

Design is iterative: build, playtest (chapter 10), learn, change. Expect your first ideas to change significantly. The best designers are not those with the best first ideas, but those who test and improve most effectively.

### Culture and originality

Games set in places players rarely see, such as Pakistani cities, festivals, food and folklore, can stand out in crowded stores. Authentic local themes, done respectfully, give your games a distinct identity that international players find fresh.
      `,
        [
          q('What should you do before building levels, menus and art?', [
            'Design the full store listing',
            'Prototype the core loop and check it is fun',
            'Buy expensive art assets',
            'Plan online multiplayer features',
          ], 1, 'If the core loop is not fun, polish and content will not save the game.'),
          q('Why list what is out of scope in a design document?', [
            'It stops endless feature additions that prevent finishing',
            'Stores require it for publishing',
            'It makes the game run faster',
            'It replaces the need for playtesting',
          ], 0, 'Explicit limits protect the project from scope creep.'),
          q('Why are small first games recommended?', [
            'Small games earn more money',
            'Stores reject large games',
            'Unity limits beginners to small scenes',
            'Finishing teaches the full process of shipping',
          ], 3, 'Completing small games builds all the skills needed to ship larger ones.'),
        ]
      ),
      lesson('Building a Game Development Portfolio', 13, `
In game development, what you have built matters far more than certificates. Studios and clients want evidence that you can make things work, finish projects and write sensible code. A focused portfolio of small, polished, playable games opens more doors than a long list of unfinished experiments.

### What to include

| Item | Why it matters |
|---|---|
| Two or three finished, polished games | Proof you can ship |
| Playable web builds | Recruiters can play in seconds without installing |
| Short gameplay videos or GIFs | Many people will not click "play" |
| Clear descriptions of your role | Especially for team projects and jam games |
| Code samples on GitHub | Shows code quality to technical interviewers |
| A short development log | Shows how you think and solve problems |

Quality beats quantity. Three polished small games impress more than ten rough prototypes.

### Tailor to the role

| Role | Portfolio emphasis |
|---|---|
| Unity developer or gameplay programmer | Clean code, systems like save, AI, UI; performance work |
| Game designer | Level design, mechanics, design documents, playtest changes |
| Technical artist | Shaders, effects, lighting, optimised art pipelines |
| 3D or 2D artist | Art in engine, consistent style, animations |
| QA tester | Test plans, bug reports, attention to detail |

A gameplay programmer's portfolio might include a platformer with a well-structured controller, a 3D game with NavMesh enemies and a save system, and a README explaining the architecture.

### Presenting a project

For each game, include:

\`\`\`text
Title and one-line pitch
Screenshots and a 30 to 60 second video
Play link (web build) and download links
Your role and the team size
Tools used: Unity 6, C#, URP, Cinemachine, Input System
Challenges solved: for example, "reduced frame drops on budget phones
by pooling projectiles and baking lighting"
Link to code, if you can share it
\`\`\`

Specific challenges show real experience; generic descriptions do not.

### Code quality matters

Interviewers read code. Show clear names, small focused scripts, events instead of tangled references, ScriptableObjects for data, and sensible folder structure. Remove dead code and commented-out experiments. A short README in each repository explaining how to open and play the project helps reviewers.

### Where to host

- **itch.io** for playable games.
- **GitHub** for code (use Unity's .gitignore; large binary files may need Git LFS).
- **A simple personal website** linking everything together, with your contact details.
- **LinkedIn** with projects listed, and short posts about progress.
- **Video platforms** for gameplay trailers and devlogs.

### Show progress publicly

Posting short clips of work in progress on social platforms and developer communities builds an audience and a network. People who have seen your progress are more likely to recommend you or play your game on release.

### Freelancing work as portfolio

Freelance Unity projects, such as prototypes, AR experiences, educational games or bug fixing, build experience and income. Cortexis's freelancing course covers finding clients on Upwork, Fiverr and LinkedIn. Ask clients whether you may show the work; if not, describe it in general terms.

### Keep it current

Update your portfolio when you finish something better, and remove weaker work. Your portfolio should always represent your current level.
      `,
        [
          q('Why include playable web builds in a portfolio?', [
            'Web builds are required by all studios',
            'They replace the need for videos',
            'Recruiters can play in seconds without installing',
            'They hide your code from reviewers',
          ], 2, 'Instant play removes friction for busy reviewers.'),
          q('Which description of a project shows real experience best?', [
            '"I made a cool game in Unity"',
            'Reduced frame drops by pooling projectiles and baking lighting',
            '"I worked very hard on this project"',
            '"This game has many features"',
          ], 1, 'Specific problems and solutions show practical skill.'),
          q('What should a gameplay programmer\'s portfolio emphasise?', [
            'Clean code and working systems like saving and AI',
            'Only concept art and sketches',
            'A long list of unfinished prototypes',
            'Certificates without projects',
          ], 0, 'Programmers are judged on the systems they build and the quality of their code.'),
        ]
      ),
      lesson('The Game Industry in Pakistan and Beyond', 14, `
Game development is a global industry, and developers in Pakistan can work for local studios, international companies remotely, publishers, or on their own games. Understanding the kinds of companies, roles and business models helps you choose a path and prepare for it.

### The local industry

Pakistan has a growing game development community, with studios in cities such as Lahore, Karachi and Islamabad. Much of the work focuses on mobile games for international markets, from casual and hyper-casual titles to larger free-to-play games. Studios range from small independent teams to larger companies working with international publishers. Universities and training programmes increasingly offer game development courses, and developer communities organise meetups and jams.

Because studios and opportunities change quickly, research current companies through LinkedIn, job boards and community groups rather than relying on any fixed list.

### Types of companies

| Company type | What they do |
|---|---|
| Independent studios | Build and publish their own games |
| Work-for-hire or outsourcing studios | Build games and features for other companies |
| Publisher-partnered studios | Build prototypes and games for publishers who handle marketing |
| Non-game companies using Unity | AR, VR, simulations, education, architecture visualisation |
| Solo developers and small teams | Build games independently, often part-time at first |

### Common roles

| Role | Focus |
|---|---|
| Unity developer or gameplay programmer | Mechanics, systems, tools, performance |
| Game designer | Mechanics, levels, balance, player experience |
| Level designer | Building and pacing levels |
| 2D and 3D artists, animators | Characters, environments, animation |
| Technical artist | Shaders, effects, art pipelines |
| QA tester | Finding and reporting bugs, testing on devices |
| Producer or project manager | Schedules, coordination, communication |
| Live operations and analytics | Updates, events, metrics for live games |

Many developers start in QA or junior programming roles and move into specialised positions.

### The publisher model

In mobile gaming, publishers fund, test and market games made by studios. Studios submit prototypes; publishers test them with small paid marketing campaigns and measure metrics such as cost per install and early retention. Only prototypes with strong numbers move forward. Understanding this model helps small studios in Pakistan work with international publishers.

### Remote and international work

Many international companies hire remotely. Strong English communication, reliable internet, a professional portfolio and experience with collaboration tools (Git, task trackers, video calls) are essential. Time zone overlap and clear written updates build trust with remote teams.

### What employers look for

- Finished projects that demonstrate relevant skills.
- Solid C# and Unity fundamentals: lifecycle, physics, UI, prefabs, architecture.
- Problem-solving: explaining how you fixed a difficult bug.
- Teamwork: version control, clear communication, accepting feedback.
- Knowledge of mobile performance for mobile-focused studios.

### Interviews

Expect questions on C# (classes, interfaces, events, collections), Unity specifics (Update versus FixedUpdate, prefabs, ScriptableObjects, garbage collection, pooling), and practical tasks, such as building a small feature in a few hours. Practise explaining your portfolio projects: what you built, what went wrong and what you would do differently.

### Unity certifications

Unity offers certifications at different levels. They can complement a portfolio, especially for early-career developers, but rarely replace one. Check Unity's current certification programme for details and costs.

### Building a sustainable career

The industry rewards continuous learning, reliable delivery and good relationships. Many opportunities come through people you have worked with or met in communities, so be helpful, professional and visible.
      `,
        [
          q('How do mobile game publishers decide which prototypes move forward?', [
            'By the size of the development team',
            'By the number of features planned',
            'By testing metrics like cost per install and retention',
            'By the price of the game engine used',
          ], 2, 'Publishers use early marketing tests to measure a prototype\'s potential.'),
          q('Why research current studios instead of relying on a fixed list?', [
            'Companies and opportunities change quickly',
            'Studios never post jobs online',
            'Lists are illegal to publish',
            'Only universities know studio names',
          ], 0, 'The industry changes fast, so current research gives accurate information.'),
          q('What is essential for remote international game work?', [
            'A local office in the client\'s country',
            'A certificate instead of a portfolio',
            'Working only without version control',
            'Clear communication, a portfolio and collaboration tools',
          ], 3, 'Remote teams rely on clear updates, visible work and shared tools.'),
        ]
      ),
      lesson('Game Jams, Communities and Next Steps', 13, `
Game jams, communities and continuous practice turn course knowledge into real skill. A jam forces you to finish a game in a weekend; a community gives feedback, collaborators and job leads. This final lesson shows how to keep growing after the course and plans your next steps.

### Game jams

A game jam is an event where people make a game in a short time, often 48 to 72 hours, usually around a theme announced at the start.

| Jam | Notes |
|---|---|
| Global Game Jam | Annual, with physical sites in many countries and online participation |
| Ludum Dare | Long-running online jam with solo and team formats |
| GMTK Game Jam | Very popular online jam hosted on itch.io |
| itch.io jams | Hundreds of smaller jams on many themes, all year |

Dates, formats and rules change, so check each jam's official page.

### Why jams help

- **You finish games.** The deadline forces decisions and scope control.
- **Portfolio pieces.** Jam games are small, complete and playable.
- **Feedback.** Other participants play and rate your game.
- **Teamwork.** You work with artists, designers and musicians, practising collaboration.
- **Networking.** Many teams and friendships, and some studios, started at jams.

### Jam tips

\`\`\`text
Hour 0-2:    Brainstorm around the theme, pick the simplest strong idea.
Day 1:       Build the core loop with placeholder art. Make it playable.
Day 2:       Art, sound, one or two polish effects, a simple menu.
Final hours: Build, upload, test the build, write the page. No new features.
\`\`\`

Upload early; last-minute build problems are the most common way jam entries fail.

### Communities

- Local game developer meetups and university clubs.
- Online communities: Discord servers, forums and Reddit groups for Unity and game development.
- Unity Discussions (official forums) for technical questions.
- Social platforms where developers share progress with hashtags such as screenshot and devlog tags.

Contribute, not just ask: answer beginner questions, share what you learned and give constructive feedback on others' games.

### Continued learning

| Area | Next steps |
|---|---|
| Unity depth | Unity Learn tutorials, official documentation, sample projects |
| C# and architecture | Design patterns, clean code, testing |
| Specialisation | Shaders and graphics, AI, multiplayer, VR and AR, tools programming |
| Design | Game design books, analysing games, level design practice |
| Business | Marketing, publishing, analytics, monetisation |

Multiplayer (with Netcode for GameObjects or third-party services), shader graphs and the Data-Oriented Technology Stack are natural advanced topics once the fundamentals in this course feel comfortable.

### A 90-day plan

\`\`\`text
Days 1-30:  Finish and polish the 2D platformer from this course.
            Publish it on itch.io with a web build.
Days 31-60: Join an online game jam. Build a new small game in 3D.
            Share progress weekly on social media.
Days 61-90: Publish a small mobile game on Google Play (start closed testing early).
            Build a portfolio page. Apply for jobs or freelance projects.
\`\`\`

### Keep finishing

The difference between people who become game developers and those who do not is rarely talent. It is finishing: small games, then slightly larger ones, again and again, each teaching something new. You now have the skills to build, polish and publish complete games. Pick a small idea, and start today.
      `,
        [
          q('What is the main benefit of a game jam\'s short deadline?', [
            'It forces scope control so you finish a game',
            'It guarantees a commercial release',
            'It removes the need for testing',
            'It lets you skip the core loop',
          ], 0, 'Tight deadlines teach prioritisation and produce finished games.'),
          q('What is a common way jam entries fail at the end?', [
            'Too many players rate the game',
            'The theme changes after submission',
            'Last-minute build and upload problems',
            'Unity blocks uploads during jams',
          ], 2, 'Building and uploading early avoids missing the deadline because of technical issues.'),
          q('According to the lesson, what most separates people who become game developers?', [
            'Owning the most expensive computer',
            'Knowing every Unity feature before starting',
            'Avoiding game jams and communities',
            'Repeatedly finishing games, from small to larger',
          ], 3, 'Consistent finishing builds skill, portfolios and confidence.'),
        ]
      ),
      ],
      [
      q('What is a core loop?', [
        'The main while loop in every script',
        'The set of actions players repeat most',
        'A loop of background music',
        'The order scenes load in',
      ], 1, 'The core loop is the central repeated experience of the game.'),
      q('What should each portfolio project description include?', [
        'Only the game\'s title',
        'A list of every Unity menu used',
        'Your role, tools and challenges solved',
        'The number of hours spent',
      ], 2, 'Roles, tools and solved problems show what you can actually do.'),
      q('Which role focuses on shaders, effects and art pipelines?', [
        'Technical artist',
        'QA tester',
        'Producer',
        'Level designer',
      ], 0, 'Technical artists bridge art and programming, handling shaders and effects.'),
      q('What is a good first-month goal after the course?', [
        'Start an open-world multiplayer game',
        'Wait until you know every Unity feature',
        'Only read more tutorials',
        'Polish and publish the 2D platformer on itch.io',
      ], 3, 'Finishing and publishing a small game builds momentum and a portfolio.'),
      ]
    ),
  ],
  final: [
    q('What gives GameObjects their appearance, physics and behaviour?', [
      'Scenes',
      'Components',
      'Build Profiles',
      'Sorting layers',
    ], 1, 'GameObjects are containers, and components add everything they do.'),
    q('Where should physics forces usually be applied in a script?', [
      'Awake',
      'LateUpdate',
      'OnDestroy',
      'FixedUpdate',
    ], 3, 'FixedUpdate runs in step with physics, keeping forces consistent.'),
    q('Why use private fields with [SerializeField]?', [
      'The Inspector can edit them while other scripts cannot',
      'They load faster than public fields',
      'They are required for prefabs',
      'They automatically save to disk',
    ], 0, 'SerializeField exposes values to designers while protecting them from other code.'),
    q('How should a Rigidbody-based player be moved?', [
      'By setting transform.position each frame',
      'By scaling the collider',
      'Through velocity, forces or MovePosition',
      'By rotating the camera',
    ], 2, 'Moving through the physics system keeps collisions reliable.'),
    q('Which collider setting suits a collectible coin?', [
      'A static collider with high friction',
      'A Mesh Collider with a bouncy material',
      'A trigger collider',
      'No collider at all',
    ], 2, 'Triggers detect overlap without blocking the player.'),
    q('What does a Composite Collider 2D do for a tilemap?', [
      'Merges tile colliders into smooth outlines',
      'Animates the tiles',
      'Sorts tiles into layers',
      'Converts tiles into prefabs',
    ], 0, 'Merged outlines remove seams and reduce physics work.'),
    q('Which Cinemachine extension keeps the camera inside the level?', [
      'Impulse Listener',
      'Deoccluder',
      'Cinemachine Brain',
      'Confiner 2D',
    ], 3, 'The Confiner limits the camera to a bounding shape.'),
    q('What is the main benefit of prefabs?', [
      'They make scenes load without a camera',
      'Editing the prefab updates every instance',
      'They remove the need for components',
      'They compress textures automatically',
    ], 1, 'Prefabs let one change apply everywhere they are used.'),
    q('What are ScriptableObjects best used for?', [
      'Shared game data such as enemy and weapon stats',
      'Storing each player\'s live health',
      'Replacing every MonoBehaviour',
      'Rendering UI text',
    ], 0, 'ScriptableObjects hold shared data assets, not changing runtime state.'),
    q('Why raise an event instead of calling other systems directly?', [
      'Events make physics more accurate',
      'Events are required for animation',
      'The announcer does not need to know who reacts',
      'Events run before Awake',
    ], 2, 'Events decouple systems, keeping code easier to change.'),
    q('Why untick Has Exit Time on movement transitions?', [
      'To make clips loop',
      'So animations switch immediately',
      'So clips play backwards',
      'To disable the Animator',
    ], 1, 'Exit time waits for a clip to finish, which feels unresponsive for movement.'),
    q('Which Canvas Scaler mode keeps UI proportional across phones?', [
      'Constant Pixel Size',
      'Constant Physical Size',
      'World Space',
      'Scale With Screen Size',
    ], 3, 'Scaling relative to a reference resolution keeps UI consistent.'),
    q('What must you do before leaving a paused scene?', [
      'Reset Time.timeScale to 1',
      'Delete the EventSystem',
      'Rebake the lighting',
      'Disable the Audio Listener',
    ], 0, 'A zero time scale carries into the next scene unless reset.'),
    q('Which package provides NavMesh Surface for enemy navigation?', [
      'Cinemachine',
      'AI Navigation',
      'Input System',
      'TextMeshPro',
    ], 1, 'The AI Navigation package bakes NavMeshes and moves agents.'),
    q('Where should save files be written?', [
      'The Assets folder',
      'The Library folder',
      'Application.persistentDataPath',
      'The build output folder',
    ], 2, 'persistentDataPath survives updates on every platform.'),
    q('Why save progress in OnApplicationPause on mobile?', [
      'The system may close background apps without warning',
      'It is the only method that can write files',
      'It runs before Awake',
      'Stores require it for approval',
    ], 0, 'Saving when the app goes to the background protects progress.'),
    q('What should you do first when a game runs slowly?', [
      'Rewrite every script',
      'Remove all particles',
      'Lower the resolution to minimum',
      'Profile on the target device',
    ], 3, 'Profiling finds the real bottleneck before you change anything.'),
    q('What does object pooling avoid?', [
      'Garbage and spikes from constant Instantiate and Destroy',
      'The need for prefabs',
      'Physics collisions between objects',
      'Loading scenes asynchronously',
    ], 0, 'Reusing objects avoids repeated allocation and collection.'),
    q('Which build format does Google Play require for new apps?', [
      'EXE installer',
      'ZIP archive',
      'Android App Bundle (AAB)',
      'APK only',
    ], 2, 'Google Play uses AABs to generate optimised downloads.'),
    q('What should a first game project prioritise?', [
      'A large open world',
      'Online multiplayer',
      'Hours of story content',
      'A small scope and a fun core loop',
    ], 3, 'Small, focused games are finishable and teach the whole process.'),
  ],
});
