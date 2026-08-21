import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'flutter-mobile',
  title: 'Mobile App Development with Flutter',
  category: 'Mobile',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'cyan',
  coverKey: 'flutter-mobile',
  summary:
    'Write one Dart codebase and ship a real app to both Android and iOS — screens, navigation, live data, and a signed release build.',
  description:
    'You learn Dart, then build UI out of widgets: layouts that survive real screen sizes, routes that pass data, state that lives in the right place, and a network layer that parses JSON and stores it locally. The course finishes where a real project does — forms validated, platform quirks handled, and a signed build uploaded to the stores.',
  chapters: [
    chapter(
      'Dart and the Widget Mindset',
      'The language Flutter is written in, and the one idea the entire framework is built on.',
      [
        lesson('Dart Essentials', 13, `
Dart is a small language and you can hold most of it in your head in an afternoon. What makes it feel different from JavaScript or Python is **sound null safety** and a strong cultural preference for \`final\`.

### Variables and type inference

\`\`\`dart
var title = 'Flutter';        // inferred as String, still reassignable
final courses = <String>[];   // the binding is set once
const maxItems = 20;          // compile-time constant, baked into the binary
\`\`\`

Default to \`final\`. Flutter widgets declare their fields \`final\` because a widget is a *description* that gets rebuilt, not an object you edit in place. \`const\` is stronger — the value must be fully known at compile time — and Flutter exploits that to skip rebuilding entire subtrees, which we use in Lesson 3.

Note the same distinction as most languages: \`final\` locks the binding, not the contents. \`courses.add('Dart')\` is legal; \`courses = []\` is not.

### Null safety is enforced by the compiler

\`\`\`dart
String name = 'Ayesha';
name = null;                      // compile error — String can never be null

String? nickname;                 // the ? admits null
print(nickname?.length);          // null instead of a crash
print(nickname ?? 'no nickname'); // fallback
print(nickname!.length);          // "trust me" — throws if it really is null
\`\`\`

\`!\` is the null assertion operator and it is the most abused symbol in beginner Flutter code. Every \`!\` is a promise to the compiler. Writing one to silence a red squiggle rather than because you *know* the value is present just relocates a compile error into a runtime crash. Same suspicion applies to \`late\`:

\`\`\`dart
late final Database db;   // "I will assign this before anything reads it"
\`\`\`

Legitimate for something you initialise in \`initState\`; a bug when it is used to dodge thinking about the null case.

### Functions and named parameters

\`\`\`dart
int twice(int n) => n * 2;                       // expression body

// Named, with required and defaults — the Flutter house style
String label({required String title, String? subtitle, int level = 1}) {
  return subtitle == null ? title : '$title — $subtitle';
}

label(title: 'Dart Basics', level: 2);
\`\`\`

Named parameters are why Flutter call sites read the way they do. \`required\` is checked at compile time, so a missing argument never survives to runtime.

### Classes

\`\`\`dart
class Course {
  final String slug;
  final String title;
  final int weeks;

  const Course({required this.slug, required this.title, this.weeks = 8});

  Course.empty() : slug = '', title = '', weeks = 0;   // named constructor

  bool get isLong => weeks > 6;                        // computed, no storage
}
\`\`\`

\`this.slug\` inside the parameter list is an **initialising formal**: it declares the parameter and assigns the field in one move. A \`const\` constructor is what lets callers write \`const Course(...)\`, and it requires every field to be \`final\`.

### Collections you will use every day

\`\`\`dart
final levels = <String>['Beginner', 'Intermediate'];
final prices = <String, int>{'basic': 0, 'pro': 4999};
final tags   = <String>{'dart', 'mobile'};    // a Set — no duplicates

final actions = [
  const Icon(Icons.share),
  if (canEdit) const Icon(Icons.edit),          // collection-if
  for (final t in tags) Chip(label: Text(t)),   // collection-for
  ...extraActions,                              // spread
];
\`\`\`

Those three forms replace the \`.map().toList()\` gymnastics you would write elsewhere, and they work directly inside a widget's \`children:\` list — which is where you will actually meet them.

### The cascade operator

\`\`\`dart
final controller = ScrollController()
  ..addListener(onScroll)
  ..jumpTo(0);
\`\`\`

\`..\` evaluates to the object rather than the method's return value, so you can construct and configure in a single expression.
        `),
        lesson('Futures, async/await, and Streams', 12, `
Dart runs your code on a single thread with an event loop. Anything slow — a network call, reading a file, a database query — must be asynchronous, or the UI stops painting and the app appears frozen.

### A Future is a value that has not arrived

\`\`\`dart
Future<String> loadTitle() async {
  await Future.delayed(const Duration(seconds: 1));
  return 'Flutter';   // an async function returns Future<String>, always
}

final title = await loadTitle();
\`\`\`

Two rules: \`await\` is only legal inside an \`async\` function, and an \`async\` function *always* returns a Future even when you return a plain value.

### Handle failure where it happens

\`\`\`dart
Future<List<Course>> fetchCourses() async {
  try {
    final res = await http
        .get(Uri.parse('https://api.example.com/courses'))
        .timeout(const Duration(seconds: 10));
    if (res.statusCode != 200) {
      throw HttpException('Server returned \${res.statusCode}');
    }
    return parseCourses(res.body);
  } on TimeoutException {
    throw Exception('The request took too long. Check your connection.');
  }
}
\`\`\`

Always set a \`timeout\`. On mobile the interesting failure is not "the server said no", it is "the train went into a tunnel and the request never resolves". Without a timeout your loading spinner turns forever.

### Run independent work in parallel

\`\`\`dart
// Sequential — 2 seconds
final user = await fetchUser();
final courses = await fetchCourses();

// Parallel — 1 second
final results = await Future.wait([fetchUser(), fetchCourses()]);
\`\`\`

If any of them fails, the whole call fails with that error — usually what you want on a screen that needs all of its data. Mind the default, though: \`Future.wait\` still waits for every future to settle before it reports that error, so a fast failure alongside a slow request is only surfaced once the slow one finishes. Pass \`eagerError: true\` when you want to give up the moment the first one fails.

### The mistake that crashes production apps

\`\`\`dart
Future<void> _load() async {
  final data = await api.fetch();
  if (!mounted) return;     // the user may have left this screen already
  setState(() => _data = data);
}
\`\`\`

If the user taps back while the request is in flight, the State object is disposed but your \`await\` still resumes. Calling \`setState\` then throws *"setState() called after dispose()"*. This is the single most common async bug in real Flutter codebases, and the \`mounted\` guard is the whole fix. Check it after **every** await that is followed by \`setState\`.

### Streams: many values over time

A Future delivers one value. A **Stream** delivers a sequence — location updates, a websocket feed, a Firestore query, text field changes.

\`\`\`dart
Stream<int> ticker() async* {
  var i = 0;
  while (true) {
    await Future.delayed(const Duration(seconds: 1));
    yield i++;         // async* + yield = a Stream
  }
}

final sub = ticker().listen((tick) => print(tick));
await sub.cancel();    // subscriptions leak if you never cancel them
\`\`\`

In widgets you rarely call \`listen\` yourself — \`StreamBuilder\` subscribes and unsubscribes for you as the widget mounts and unmounts, which is exactly the kind of bookkeeping you want the framework to own.

### Heavy CPU work does not belong on the UI thread

\`await\` yields for *I/O*. It does nothing for a tight loop — a 200ms JSON parse of a huge payload still drops twelve frames.

\`\`\`dart
final parsed = await compute(parseCourses, responseBody);
\`\`\`

\`compute\` moves the function to a background **isolate** with its own memory. Isolates do not share state; they pass messages. Reach for it when profiling shows a jank spike in your own code, not before.
        `),
        lesson('Everything Is a Widget', 12, `
Flutter has one structural idea: your UI is a tree of **widgets**, and a widget is an immutable description of what should appear. You never mutate the screen. You describe what it should look like now, and the framework works out the difference.

### The smallest complete app

\`\`\`dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Courses',
      theme: ThemeData(colorSchemeSeed: Colors.cyan, useMaterial3: true),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Courses')),
      body: const Center(child: Text('Hello')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}
\`\`\`

\`MaterialApp\` supplies theming, routing, and localisation. \`Scaffold\` supplies the standard page furniture — app bar, body, FAB, drawer, bottom bar. Almost every screen you write starts with a \`Scaffold\`.

### Three trees, not one

| Tree | What it is | Lifetime |
|---|---|---|
| Widget | Immutable config you write in \`build\` | Thrown away and recreated constantly |
| Element | The framework's bookkeeping node | Persists across rebuilds |
| RenderObject | Does layout and painting | Persists, expensive to create |

This is why rebuilding is cheap. When \`build\` runs again, Flutter compares the new widget to the old one at each position; if the **runtimeType and key match**, it updates the existing element and render object in place rather than tearing anything down. Creating widget objects is allocating small, short-lived Dart objects — the expensive machinery underneath is reused.

### build must be cheap and pure

\`build\` can be called many times a second — on every animation frame, on rotation, on keyboard show. So:

- No network calls, no file I/O, no \`setState\` inside \`build\`.
- No object creation you would regret doing 60 times a second (controllers, timers, random seeds).
- Same inputs, same output. If \`build\` reads a mutable global, you will get a UI that disagrees with itself.

### const is a real optimisation

\`\`\`dart
const Text('Courses')   // built once, reused forever
Text('Courses')         // a fresh object on every build
\`\`\`

A \`const\` widget is canonicalised at compile time, so on rebuild Flutter sees the *identical instance* and skips that subtree entirely. Turn on the \`prefer_const_constructors\` lint and let the analyser find them for you — it is free performance across the whole app.

### Composition, not configuration

There is no \`padding\` property on \`Text\`. You wrap:

\`\`\`dart
Padding(
  padding: const EdgeInsets.all(16),
  child: Align(
    alignment: Alignment.centerLeft,
    child: Text('Courses', style: Theme.of(context).textTheme.titleLarge),
  ),
)
\`\`\`

Flutter prefers many small single-purpose widgets over one widget with forty properties. That is why the tree gets deep — deep trees are normal and fast here.

### Extract widgets, not helper methods

\`\`\`dart
// Common but weaker: a method — cannot be const, rebuilds with the whole parent
Widget _buildHeader() => Container(...);

// Better: a real widget class — can be const, and rebuilds independently
class _Header extends StatelessWidget { const _Header(); ... }
\`\`\`

A \`_build...\` method is just inlined code as far as the framework is concerned. A widget class gets its own element, its own rebuild boundary, and can be \`const\`. When a screen starts feeling slow, this refactor is usually the first thing that helps.

### Hot reload versus hot restart

Hot reload (\`r\`) injects new code and rebuilds the tree, keeping your current state — you stay on screen four with your form half-filled. Hot restart (\`R\`) throws state away and runs \`main\` again. If a change to a \`const\`, an enum, or a global initialiser does not seem to apply, you need a restart, not a reload.
        `),
      ],
      [
        q('What is the real risk of writing value! to satisfy the analyser?', [
          'It converts a compile-time error into a runtime crash',
          'It makes the variable final',
          'It disables null safety for the whole file',
          'It slows down compilation',
        ], 0, 'The ! operator asserts non-null without proving it, so an incorrect assertion fails only when that line actually executes.'),
        q('Why can Flutter rebuild widgets constantly without it being slow?', [
          'Flutter renders on a background thread',
          'Widgets are cached in a global map',
          'Widgets are cheap objects; the persistent elements and render objects are reused',
          'build only runs when the app is idle',
        ], 2, 'Rebuilding allocates small immutable descriptions, then Flutter diffs them and updates the existing element and render tree in place.'),
        q('An async method awaits an API call, then calls setState. What guard is required?', [
          'await Future.delayed(Duration.zero)',
          'Wrapping the call in compute()',
          'try/catch around setState',
          'if (!mounted) return; before setState',
        ], 3, 'If the user navigates away mid-request the State is disposed, and setState after dispose throws — the mounted check prevents it.'),
        q('Why prefer a small widget class over a _buildSection() helper method?', [
          'Methods cannot return widgets',
          'A widget class gets its own rebuild boundary and can be const',
          'Methods are slower to compile',
          'Helper methods break hot reload',
        ], 1, 'A helper method rebuilds with its whole parent, while a widget class is an independent element that Flutter can skip when nothing changed.'),
      ]
    ),
    chapter(
      'Stateful Widgets and Layout',
      'Widgets that change over time, and the layout system that decides where everything goes.',
      [
        lesson('StatelessWidget vs StatefulWidget', 13, `
A **StatelessWidget** is a pure function of its constructor arguments. Give it the same inputs and it draws the same thing, forever. A **StatefulWidget** owns mutable data that outlives any single build.

\`\`\`dart
class CourseCard extends StatelessWidget {
  const CourseCard({super.key, required this.title, required this.weeks});

  final String title;
  final int weeks;

  @override
  Widget build(BuildContext context) => ListTile(
        title: Text(title),
        subtitle: Text('$weeks weeks'),
      );
}
\`\`\`

Nothing in there can change. If the parent passes a new title, the parent rebuilds and a new \`CourseCard\` is created. That is the correct model for the large majority of your widgets — start stateless and convert only when you must.

### The stateful pair

\`\`\`dart
class Counter extends StatefulWidget {
  const Counter({super.key, required this.step});
  final int step;                     // config lives on the widget, and is final

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;                     // mutable data lives on the State

  void _increment() {
    setState(() => _count += widget.step);   // reach config via widget.
  }

  @override
  Widget build(BuildContext context) => TextButton(
        onPressed: _increment,
        child: Text('Count: $_count'),
      );
}
\`\`\`

Two objects, two jobs. The **widget** is recreated on every parent rebuild and holds immutable configuration. The **State** survives those rebuilds and holds the data. That split is the reason a stateful widget can keep its scroll offset or text while its parent re-renders around it.

\`setState\` does exactly two things: it runs your callback, then marks this element dirty so \`build\` runs before the next frame. Mutating \`_count\` *without* \`setState\` genuinely changes the value — and nothing repaints. The UI silently goes stale, which is far more confusing than a crash and is one of the most common bugs beginners hit.

### The lifecycle you need

| Method | When | Use it for |
|---|---|---|
| \`initState\` | Once, before first build | Create controllers, kick off first load, subscribe |
| \`didChangeDependencies\` | After initState and whenever an inherited widget changes | Work that needs \`Theme.of\` or \`MediaQuery.of\` |
| \`build\` | Every frame that needs repainting | Describe UI, nothing else |
| \`didUpdateWidget\` | Parent rebuilt with new config | React to a changed \`widget.\` field |
| \`dispose\` | Once, on removal | Cancel timers, close streams, dispose controllers |

The State is already mounted when \`initState\` runs, but the framework will not let you register a dependency on an inherited widget that early — calling \`Theme.of(context)\` or \`MediaQuery.of(context)\` there throws. Read those in \`didChangeDependencies\` or \`build\`, which is where you want them anyway, because that is what makes them re-read when the theme or the window size changes.

### Controllers are created once and disposed

\`\`\`dart
class _SearchBarState extends State<SearchBar> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();      // never skip this
    super.dispose();
  }
  ...
}
\`\`\`

Creating a \`TextEditingController\`, \`AnimationController\`, or \`ScrollController\` inside \`build\` is the classic leak: a new one every frame, the old ones never released, and text that resets as you type. Create in \`initState\`, release in \`dispose\`, and always call \`super.dispose()\` last.

### Reacting to changed configuration

\`\`\`dart
@override
void didUpdateWidget(covariant CourseScreen old) {
  super.didUpdateWidget(old);
  if (old.courseId != widget.courseId) {
    _load();                    // the parent pointed us at a different course
  }
}
\`\`\`

Without this, navigating from course A to course B while reusing the same widget type shows A's data under B's title — a real bug that only appears once your app has more than one of something.
        `),
        lesson('Row, Column, and Flex', 14, `
\`Row\` and \`Column\` are the same widget with a different axis, and together they build most of a screen. Learn their four properties properly and layout stops being guesswork.

\`\`\`dart
Column(
  mainAxisAlignment: MainAxisAlignment.start,      // vertical for a Column
  crossAxisAlignment: CrossAxisAlignment.stretch,  // horizontal for a Column
  mainAxisSize: MainAxisSize.max,                  // take all available height
  children: const [Text('Dart'), Text('Widgets'), Text('Ship')],
)
\`\`\`

The axes swap in a \`Row\`: main is horizontal, cross is vertical. Nearly every "why is it not centred?" question is someone setting the wrong one.

### Sharing leftover space

\`\`\`dart
Row(
  children: [
    const Icon(Icons.school),
    const SizedBox(width: 12),
    Expanded(child: Text(course.title, overflow: TextOverflow.ellipsis)),
    const Icon(Icons.chevron_right),
  ],
)
\`\`\`

The icons take their natural width; \`Expanded\` gives the title everything that is left. Two \`Expanded\` children split it evenly, and \`flex:\` weights the split — \`flex: 2\` next to \`flex: 1\` means two thirds and one third.

| Widget | Behaviour |
|---|---|
| \`Expanded\` | Must fill its share of the free space |
| \`Flexible\` | May use up to its share, but can be smaller |
| \`Spacer\` | Empty \`Expanded\` — pushes siblings apart |
| \`SizedBox\` | A fixed gap or a fixed-size box |

Use \`Expanded\` when you want a text field or card to grow. Use \`Flexible\` when a chip should shrink to fit but never be padded out to fill.

### The yellow-and-black stripes

\`RenderFlex overflowed by 47 pixels\` means the children asked for more space than the Row or Column had. It is a layout error, not a warning, and it will look identical on a reviewer's phone.

Three real fixes, in order of preference:

1. Wrap the greedy child in \`Expanded\` and give the text \`overflow: TextOverflow.ellipsis\`. Long titles are the usual culprit.
2. Swap \`Row\` for \`Wrap\`, which flows onto a second line instead of overflowing — ideal for tag chips.
3. Make the whole thing scrollable with \`SingleChildScrollView\`, which is the right answer for a form on a short screen with the keyboard open.

Reducing the font size until it fits is not a fix. It will overflow again in German, or at the user's larger accessibility text size, and you will not be watching.

### Alignment cheatsheet

\`\`\`dart
// Centre a single child both ways
Center(child: Text('Empty'))

// Push the last item to the far end of a Row
Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [a, b])

// Equal gaps around every child
Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [a, b, c])

// Column that hugs its children instead of filling the screen
Column(mainAxisSize: MainAxisSize.min, children: [a, b])
\`\`\`

\`mainAxisSize: MainAxisSize.min\` is the fix for a \`Column\` inside a dialog or a card that stretches absurdly tall — by default a Column takes all the height it is offered.

### Lists are not Columns

A \`Column\` builds every child immediately. For anything longer than a screen, use \`ListView.builder\`:

\`\`\`dart
ListView.builder(
  itemCount: courses.length,
  itemBuilder: (context, i) => CourseCard(course: courses[i]),
)
\`\`\`

\`itemBuilder\` runs only for the items near the viewport, so a 10,000-row list costs about the same as a 10-row one. Putting 10,000 children in a \`Column\` inside a \`SingleChildScrollView\` builds all 10,000 up front and will visibly hang the app.
        `),
        lesson('Constraints, Stack, and Sizing', 14, `
Flutter layout runs on one sentence, and it is worth memorising: **constraints go down, sizes go up, the parent sets the position.**

A parent hands each child a \`BoxConstraints\` — min/max width and height. The child picks a size within those limits and reports back. The parent then places it. That is the entire algorithm, one pass, no negotiation. It is why layout is fast and why a child can never simply declare "I am 300 pixels wide" if its parent said "you may be at most 100".

### Why your width was ignored

\`\`\`dart
// Inside a Center, this works — Center passes loose constraints
Center(child: Container(width: 300, height: 100, color: Colors.cyan))

// Inside a Column with stretch, the width is overruled
Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [Container(width: 300, height: 100, color: Colors.cyan)],
)
\`\`\`

In the second case the parent sends a **tight** constraint (min width = max width = full width), and a tight constraint leaves the child no choice. Nothing is broken; you are arguing with the parent, not the child.

### The unbounded-height error

This is the error every Flutter developer hits in their first week:

\`\`\`
Vertical viewport was given unbounded height.
\`\`\`

It happens when you put a \`ListView\` inside a \`Column\`. The Column offers infinite height (it is scroll-agnostic and happy to be any height), and the ListView says "I will take all of it" — infinity is not a size. Three correct fixes:

\`\`\`dart
// 1. Give the list a bounded share of the Column — usually what you want
Column(children: [const Header(), Expanded(child: ListView(children: items))])

// 2. Let the list size itself to its content — only for short lists
ListView(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), children: items)

// 3. Use a CustomScrollView with slivers — the right answer for mixed content
CustomScrollView(slivers: [SliverAppBar(...), SliverList(...)])
\`\`\`

\`shrinkWrap: true\` is the tempting one, and it is a trap at scale: it forces the list to build *every* child to measure itself, throwing away the laziness that made \`ListView.builder\` worth using.

### Stack: layers instead of rows

\`Stack\` paints children on top of each other, first child at the back.

\`\`\`dart
Stack(
  children: [
    Image.network(course.cover, fit: BoxFit.cover),
    Positioned(
      left: 16, right: 16, bottom: 16,
      child: Text(course.title, style: const TextStyle(color: Colors.white)),
    ),
    const Positioned(top: 8, right: 8, child: Icon(Icons.bookmark)),
  ],
)
\`\`\`

Children wrapped in \`Positioned\` are placed by their offsets; unpositioned children are aligned by the Stack's \`alignment\` (top-left by default) and are what determine the Stack's size. If *every* child is \`Positioned\`, the Stack has nothing to measure itself against and takes the largest size its parent allows — so it quietly swallows the whole screen instead of hugging your layers. Keep the background image unpositioned so it defines the bounds, and everything on top is placed relative to it.

Use \`Align\` or \`Positioned.fill\` for gradient scrims, \`IndexedStack\` when you want to keep several tabs alive but show one.

### Sizing against the screen

\`\`\`dart
final width = MediaQuery.sizeOf(context).width;
final isWide = width >= 600;

LayoutBuilder(
  builder: (context, constraints) =>
      constraints.maxWidth >= 600 ? const TwoPane() : const SinglePane(),
)
\`\`\`

Prefer \`LayoutBuilder\`: it reports the space *this widget* was given, so the component still behaves correctly inside a split view, a dialog, or a tablet side panel. \`MediaQuery\` describes the whole window and quietly gives the wrong answer in those cases.

Wrap screen content in \`SafeArea\` so it clears the notch, the status bar, and the home indicator. It costs one widget and fixes a class of bug you cannot see on a simulator you never rotate.
        `),
      ],
      [
        q('You update a field on a State object directly, without setState. What happens?', [
          'The widget rebuilds on the next frame anyway',
          'A compile error',
          'The value changes but the UI is never rebuilt',
          'The change is silently discarded',
        ], 2, 'setState is what marks the element dirty; without it the data is updated but nothing schedules a repaint, so the UI goes stale.'),
        q('A Row shows the yellow-and-black overflow stripes because a title is too long. Best fix?', [
          'Wrap the title in Expanded and set overflow: TextOverflow.ellipsis',
          'Set mainAxisSize: MainAxisSize.min on the Row',
          'Replace the Row with a Stack',
          'Reduce the font size until it fits',
        ], 0, 'Expanded bounds the title to the leftover space and ellipsis truncates it, so any length of text and any font scale still fits.'),
        q('Where should a TextEditingController be created?', [
          'Inside build, so it always matches the latest props',
          'In initState, and disposed in dispose',
          'As a global variable',
          'In didUpdateWidget',
        ], 1, 'build runs many times per second, so creating it there leaks a controller every frame; initState runs once and dispose releases it.'),
        q('"Vertical viewport was given unbounded height" appears for a ListView inside a Column. Why?', [
          'ListView cannot be nested in any other widget',
          'The Column is missing a key',
          'The ListView has no itemCount',
          'The Column offers infinite height and the ListView tries to take all of it',
        ], 3, 'A Column passes unbounded height to its children, and a scrollable that wants all available height cannot resolve infinity into a size.'),
      ]
    ),
    chapter(
      'Navigation and State Management',
      'Moving between screens with data intact, and deciding where your app state should actually live.',
      [
        lesson('Navigation and Routing', 13, `
Flutter's navigator is a stack. Pushing a route puts a screen on top; popping removes it. The back button and the iOS swipe gesture both just pop.

### Imperative navigation

\`\`\`dart
// Go to a detail screen
Navigator.of(context).push(
  MaterialPageRoute(builder: (_) => CourseScreen(courseId: course.id)),
);

// Come back
Navigator.of(context).pop();
\`\`\`

\`MaterialPageRoute\` gives you the platform-correct transition for free: a slide-from-right with an interactive back swipe on iOS, a fade-through on Android.

### Passing data forward and back

Forward: constructor arguments. That is it — a route builder is a closure, so pass the object.

Backward is the part people miss. \`push\` returns a \`Future\` that completes when the route pops:

\`\`\`dart
final result = await Navigator.of(context).push<bool>(
  MaterialPageRoute(builder: (_) => const EnrollScreen()),
);
if (!mounted) return;                  // an await crossed a screen boundary
if (result == true) _refresh();
\`\`\`

\`\`\`dart
// On the EnrollScreen, when the user confirms
Navigator.of(context).pop(true);
\`\`\`

Note the \`mounted\` check from Chapter 1 — awaiting a push is one of the longest awaits in your app, and the screen underneath can be gone by the time it resolves.

### Named routes

\`\`\`dart
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (_) => const HomeScreen(),
    '/settings': (_) => const SettingsScreen(),
  },
);

Navigator.pushNamed(context, '/settings');
\`\`\`

Named routes centralise the map, but they push you toward passing arguments as \`Object?\` and casting them on arrival — which is exactly the type safety Dart just gave you, thrown away. They are fine for a handful of argument-free screens.

### Route-stack operations worth knowing

\`\`\`dart
// Replace the current screen — after login, so back does not return to it
Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const Home()));

// Clear the whole stack down to the root
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (_) => const Home()),
  (route) => false,
);
\`\`\`

Leaving the login screen on the stack after a successful login is the classic navigation bug: the user presses back and is staring at a login form while logged in.

### Declarative routing with go_router

Once you need deep links, web URLs, or redirect-on-auth, hand-managing the stack stops scaling. \`go_router\` describes routes as data:

\`\`\`dart
final router = GoRouter(
  redirect: (context, state) => auth.isLoggedIn ? null : '/login',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(
      path: '/course/:id',                      // typed path parameter
      builder: (_, state) => CourseScreen(id: state.pathParameters['id']!),
    ),
  ],
);

MaterialApp.router(routerConfig: router);

context.go('/course/42');    // replaces the stack
context.push('/course/42');  // pushes on top
\`\`\`

The \`redirect\` callback is the real prize: auth gating lives in one place and applies to every route, including a cold start from a notification link. Doing that with imperative pushes means an auth check scattered across every screen's \`initState\`, and one of them will be missing.

Two details keep that snippet honest. \`/login\` has to be a declared route itself — redirect to a path you never registered and the user lands on go_router's error screen, not your login form. And redirecting to the location you are already at is treated as "no redirect", which is what stops \`/login\` from redirecting to itself forever.

### The BuildContext trap

\`Navigator.of(context)\` walks *up* from the given context looking for a Navigator. If you pass the context from the widget that built the \`MaterialApp\`, there is no Navigator above it yet and you get "No Navigator in context". Use the context of a widget *inside* the app — in practice, the context in your screen's \`build\` — or a \`Builder\` to create a child context.
        `),
        lesson('setState, Lifting State, and Its Limits', 12, `
Not all state is the same, and choosing where each piece lives is most of what "state management" means.

- **Ephemeral state** belongs to one widget: whether a password is masked, the current tab, an animation's progress. \`setState\` is the correct and complete answer.
- **App state** is shared: the signed-in user, the cart, cached courses, the theme. That is what Provider and Riverpod exist for.

Reaching for a state management package to hold a checkbox is over-engineering. Holding the entire user session in one screen's \`setState\` is under-engineering. Most bugs come from misclassifying a piece of data.

### Lifting state up

When two siblings need the same value, move it to their nearest common parent and pass it down with a callback for changes.

\`\`\`dart
class FilterScreen extends StatefulWidget {
  const FilterScreen({super.key});
  @override
  State<FilterScreen> createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen> {
  String _level = 'All';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        LevelPicker(                                  // writes
          value: _level,
          onChanged: (v) => setState(() => _level = v),
        ),
        Expanded(child: CourseList(level: _level)),    // reads
      ],
    );
  }
}
\`\`\`

Data flows **down** as constructor arguments; events flow **up** as callbacks. Both children stay stateless and independently testable, and there is exactly one place the value can change.

### Where it stops working

Lifting has a real cost, and you feel it in two ways.

**Prop drilling.** The signed-in user is needed by the app bar avatar, six screens deep. Every intermediate widget now takes a \`user\` parameter it does not use, and adding a field means editing eight files.

**Over-rebuilding.** \`setState\` marks the *whole* subtree of that State dirty. If the value lives at the top of a screen and only one badge needs it, you rebuild the entire screen to update a badge. Ten times a second, that is dropped frames.

### The escape hatch under everything

Flutter already solves this internally with \`InheritedWidget\` — the mechanism behind \`Theme.of(context)\` and \`MediaQuery.of(context)\`. It lets a widget read a value from an ancestor without anyone in between passing it along, and it rebuilds only the widgets that actually read it.

Writing \`InheritedWidget\` by hand is verbose and easy to get subtly wrong, so nobody does. **Provider is a thin, well-tested wrapper around exactly this**, and Riverpod is a redesign of the same idea without the \`BuildContext\` dependency. Understanding that they are not magic — just a well-packaged inherited lookup plus a change notification — makes the next lesson considerably less mysterious.

### A rule that holds up

Start with \`setState\`. Move a value outward only when a second widget genuinely needs it, or when a profile shows you are rebuilding far more than you should. Premature global state is harder to unwind than a late refactor, because once anything can write to it from anywhere, you have lost the ability to reason locally about why a value changed.
        `),
        lesson('Provider and an Introduction to Riverpod', 15, `
Provider puts a value above your widgets in the tree and lets any descendant read it. It is the standard answer for shared app state in a Flutter codebase.

### A ChangeNotifier model

\`\`\`dart
class CartModel extends ChangeNotifier {
  final List<Course> _items = [];

  List<Course> get items => List.unmodifiable(_items);
  int get count => _items.length;

  void add(Course c) {
    _items.add(c);
    notifyListeners();      // forget this and the UI never updates
  }
}
\`\`\`

The model is plain Dart with no Flutter imports beyond \`ChangeNotifier\` — which means it is unit-testable without pumping a single widget. Returning \`List.unmodifiable\` stops a widget mutating the list behind the model's back and skipping the notification.

### Providing and consuming

\`\`\`dart
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CartModel(),
      child: const MyApp(),
    ),
  );
}

// Deep inside the tree — no props passed down
class CartBadge extends StatelessWidget {
  const CartBadge({super.key});

  @override
  Widget build(BuildContext context) {
    final count = context.watch<CartModel>().count;   // rebuilds on change
    return Badge(label: Text('$count'));
  }
}

// In a button handler — read, do not watch
onPressed: () => context.read<CartModel>().add(course),
\`\`\`

### watch, read, select — the distinction that matters

| Call | Subscribes? | Use in |
|---|---|---|
| \`context.watch<T>()\` | Yes, rebuilds on every notify | \`build\` |
| \`context.read<T>()\` | No | Callbacks, \`initState\` |
| \`context.select<T, R>()\` | Only when the selected field changes | \`build\`, for narrow reads |

Calling \`watch\` inside an \`onPressed\` throws, and calling \`read\` in \`build\` gives you a value that never updates — a widget that shows the right number once and then lies. Those two mistakes account for most Provider confusion.

\`select\` is the performance tool:

\`\`\`dart
// Rebuilds only when count changes, not when any other field does
final count = context.select<CartModel, int>((m) => m.count);
\`\`\`

Use \`Consumer\` to keep the rebuild scope tight when only a small part of a big widget depends on the model:

\`\`\`dart
Consumer<CartModel>(
  builder: (context, cart, child) => Row(children: [child!, Text('\${cart.count}')]),
  child: const ExpensiveStaticHeader(),   // built once, never rebuilt
)
\`\`\`

### Riverpod: the same idea, without BuildContext

Riverpod fixes Provider's two structural weaknesses: providers are looked up by *type* at runtime, so a missing one is a runtime \`ProviderNotFoundException\`, and everything requires a \`BuildContext\`, so you cannot read state from plain Dart code.

\`\`\`dart
// Declared as a top-level variable — the compiler knows it exists
final cartProvider = NotifierProvider<CartNotifier, List<Course>>(CartNotifier.new);

class CartNotifier extends Notifier<List<Course>> {
  @override
  List<Course> build() => [];

  void add(Course c) => state = [...state, c];   // new list, not a mutation
}

void main() => runApp(const ProviderScope(child: MyApp()));

class CartBadge extends ConsumerWidget {
  const CartBadge({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(cartProvider).length;
    return Badge(label: Text('$count'));
  }
}

// In a handler
ref.read(cartProvider.notifier).add(course);
\`\`\`

Note \`state = [...state, c]\` rather than \`state.add(c)\`. Riverpod compares by identity, so mutating the existing list produces no notification — the same reference trap Provider avoids only because \`notifyListeners\` is manual.

Async state gets first-class treatment, which is where Riverpod really pays for itself:

\`\`\`dart
final coursesProvider = FutureProvider<List<Course>>((ref) => api.fetchCourses());

ref.watch(coursesProvider).when(
  loading: () => const CircularProgressIndicator(),
  error: (e, _) => Text('Failed: $e'),
  data: (courses) => CourseList(courses: courses),
);
\`\`\`

Loading, error, and data are all handled — the compiler will not let you forget the error case, which is exactly the branch every hand-rolled loader quietly omits.

Provider is the safer default on an existing codebase; Riverpod is the better default on a new one. Pick one per project and stay with it.
        `),
      ],
      [
        q('How does a screen return a value to the screen that pushed it?', [
          'By writing to a global variable',
          'Routes cannot return values',
          'By calling setState on the previous screen',
          'The pushed route calls pop(value), and the caller awaits the Future returned by push',
        ], 3, 'Navigator.push returns a Future that completes with whatever the pushed route passes to pop.'),
        q('Why is context.read<CartModel>() wrong inside build?', [
          'It throws an exception in build',
          'It does not subscribe, so the widget shows a value that never updates',
          'It rebuilds the entire app',
          'read only works with StatefulWidget',
        ], 1, 'read is a one-off lookup with no subscription — watch is what registers the widget for rebuilds.'),
        q('A ChangeNotifier updates its list but the UI never changes. Most likely cause?', [
          'notifyListeners() was not called',
          'The provider was created too high in the tree',
          'The list needs a key',
          'The widget is a StatelessWidget',
        ], 0, 'ChangeNotifier notifies nobody automatically — the mutation is invisible until notifyListeners fires.'),
        q('In a Riverpod Notifier, why write state = [...state, item] instead of state.add(item)?', [
          'state is immutable at compile time',
          'add is deprecated in Riverpod',
          'Riverpod compares by identity, so mutating in place produces no update',
          'Spread syntax is faster',
        ], 2, 'Assigning a new list changes the reference, which is what Riverpod detects; mutating the existing one leaves the reference identical.'),
      ]
    ),
    chapter(
      'Data: Networking, Forms, and Storage',
      'Talking to an API, turning JSON into real objects, collecting input safely, and keeping data on the device.',
      [
        lesson('HTTP and JSON Parsing', 14, `
An app that shows only what you hardcoded is a mockup. Everything real starts with an HTTP call and a pile of JSON.

### Making the request

\`\`\`dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<http.Response> getCourses() {
  return http
      .get(
        Uri.parse('https://api.example.com/courses'),
        headers: {'Accept': 'application/json', 'Authorization': 'Bearer $token'},
      )
      .timeout(const Duration(seconds: 15));
}
\`\`\`

Build URLs with \`Uri\`, never string concatenation — \`Uri.https('api.example.com', '/search', {'q': query})\` percent-encodes the query for you, so a search for "c++ & dart" does not silently become a malformed request.

### Give JSON a class

\`jsonDecode\` returns \`dynamic\`. Passing \`dynamic\` around your app disables every type check Dart offers, and the failure shows up three screens later as \`type 'Null' is not a subtype of type 'String'\`. Convert once, at the boundary:

\`\`\`dart
class Course {
  final String id;
  final String title;
  final int weeks;
  final String? coverUrl;

  const Course({required this.id, required this.title, required this.weeks, this.coverUrl});

  factory Course.fromJson(Map<String, dynamic> json) => Course(
        id: json['id'] as String,
        title: json['title'] as String? ?? 'Untitled',   // survive a missing field
        weeks: (json['weeks'] as num?)?.toInt() ?? 0,
        coverUrl: json['coverUrl'] as String?,
      );

  Map<String, dynamic> toJson() =>
      {'id': id, 'title': title, 'weeks': weeks, 'coverUrl': coverUrl};
}
\`\`\`

The \`as num?\` then \`.toInt()\` is deliberate. JSON has one number type, so a value written as \`8\` may arrive as \`int\` and \`8.0\` as \`double\`; casting straight to \`int\` throws on the second. This is the single most common JSON crash in Flutter apps, and it usually appears only after the backend team changes one serializer.

### Parsing a list

\`\`\`dart
List<Course> parseCourses(String body) {
  final decoded = jsonDecode(body) as Map<String, dynamic>;
  final items = decoded['data'] as List<dynamic>;         // note: List<dynamic>
  return items
      .map((e) => Course.fromJson(e as Map<String, dynamic>))
      .toList();
}
\`\`\`

Casting directly to \`List<Map<String, dynamic>>\` fails at runtime even when every element *is* a map — \`jsonDecode\` genuinely produced a \`List<dynamic>\`, and Dart's generics are checked. Cast each element instead, as above.

### A repository that returns typed results

\`\`\`dart
class CourseApi {
  Future<List<Course>> fetchCourses() async {
    late final http.Response res;
    try {
      res = await getCourses();
    } on SocketException {
      throw ApiException('No internet connection.');
    } on TimeoutException {
      throw ApiException('The server took too long to respond.');
    }

    if (res.statusCode == 401) throw ApiException('Please sign in again.');
    if (res.statusCode >= 400) throw ApiException('Server error (\${res.statusCode}).');

    return parseCourses(res.body);
  }
}
\`\`\`

Keep this layer free of widgets. Networking code that imports \`material.dart\` cannot be unit-tested and ends up duplicated on every screen.

### Rendering the three states

\`\`\`dart
FutureBuilder<List<Course>>(
  future: _future,                    // created in initState, NOT in build
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator());
    }
    if (snapshot.hasError) {
      return ErrorView(message: '\${snapshot.error}', onRetry: _reload);
    }
    final courses = snapshot.data ?? const [];
    if (courses.isEmpty) return const EmptyView();
    return CourseList(courses: courses);
  },
)
\`\`\`

Calling \`fetchCourses()\` inline in the \`future:\` argument re-fires the request on every rebuild — including every keystroke in a search box above it. Create the Future once in \`initState\` and store it. That is the FutureBuilder bug that shows up as a mysteriously expensive API bill.

Four states, always: loading, error, empty, and data. Shipping only the data branch is how you get the blank white screen users report as "the app is broken".
        `),
        lesson('Forms and Validation', 13, `
Flutter's \`Form\` coordinates a group of fields: one call validates them all, one call resets them, and one \`GlobalKey\` gives you the handle.

\`\`\`dart
class SignupForm extends StatefulWidget {
  const SignupForm({super.key});
  @override
  State<SignupForm> createState() => _SignupFormState();
}

class _SignupFormState extends State<SignupForm> {
  final _formKey = GlobalKey<FormState>();          // created once — never in build
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _submitting = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }
  ...
}
\`\`\`

Creating the \`GlobalKey\` inside \`build\` is the classic form bug: a new key every rebuild means a new form state, so \`validate()\` silently does nothing and error messages vanish as you type. Declare it as a field.

### Fields validate themselves

\`\`\`dart
Form(
  key: _formKey,
  autovalidateMode: AutovalidateMode.onUserInteraction,
  child: Column(
    children: [
      TextFormField(
        controller: _email,
        keyboardType: TextInputType.emailAddress,
        textInputAction: TextInputAction.next,
        autofillHints: const [AutofillHints.email],
        decoration: const InputDecoration(labelText: 'Email'),
        validator: (value) {
          final v = value?.trim() ?? '';
          if (v.isEmpty) return 'Email is required';
          if (!v.contains('@') || !v.contains('.')) return 'Enter a valid email';
          return null;                    // null means valid
        },
      ),
      TextFormField(
        controller: _password,
        obscureText: true,
        decoration: const InputDecoration(labelText: 'Password'),
        validator: (v) =>
            (v == null || v.length < 8) ? 'At least 8 characters' : null,
      ),
    ],
  ),
)
\`\`\`

A validator returns the **error string when invalid and \`null\` when valid**. It reads backwards the first time and it is worth saying out loud, because returning \`'ok'\` for a valid field marks every field permanently broken.

\`AutovalidateMode.onUserInteraction\` is the humane default: no red text before the user has typed anything, immediate feedback afterwards. \`always\` shows errors on an untouched empty form, which feels like being told off for arriving.

### Small details that make a form feel native

- \`keyboardType\` — \`emailAddress\` adds an @ key, \`number\` gives a numeric pad.
- \`textInputAction: TextInputAction.next\` — turns Return into a "next field" key.
- \`autofillHints\` — lets the OS password manager fill and save credentials.
- \`obscureText\` on passwords, and never log the value.

### Submitting

\`\`\`dart
Future<void> _submit() async {
  if (!_formKey.currentState!.validate()) return;   // stops if any validator failed
  FocusScope.of(context).unfocus();                 // dismiss the keyboard
  setState(() => _submitting = true);

  try {
    await api.signup(_email.text.trim(), _password.text);
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  } on ApiException catch (e) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
  } finally {
    if (mounted) setState(() => _submitting = false);
  }
}
\`\`\`

The \`_submitting\` flag drives a disabled button with a spinner, and it is what stops a double-tap creating two accounts:

\`\`\`dart
FilledButton(
  onPressed: _submitting ? null : _submit,   // null disables the button
  child: _submitting
      ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
      : const Text('Create account'),
)
\`\`\`

### Client validation is a courtesy, not a defence

Every rule here can be bypassed with \`curl\`. Validation on the device exists to give fast, kind feedback; the server must re-check everything, because the server is the only part of the system an attacker does not control.

Finally, wrap tall forms in \`SingleChildScrollView\` and always \`.trim()\` text before sending. A trailing space in an email address produces a support ticket that takes an hour to diagnose.
        `),
        lesson('Local Persistence', 13, `
Apps get closed, phones go into tunnels, and users expect their data to still be there. Pick storage by what you are storing, not by what you used last time.

| Need | Use | Notes |
|---|---|---|
| A few flags and settings | \`shared_preferences\` | Key/value, plaintext, tiny |
| Tokens, keys, anything secret | \`flutter_secure_storage\` | Keychain on iOS, Keystore on Android |
| Structured, queryable records | \`sqflite\` or \`drift\` | Real SQL, indexes, migrations |
| Fast local objects, no SQL | Hive / Isar | Good for caches and offline copies |
| Images, PDFs, exports | \`path_provider\` + \`dart:io\` | Files on disk |

### Key/value with shared_preferences

\`\`\`dart
final prefs = await SharedPreferences.getInstance();

await prefs.setBool('darkMode', true);
await prefs.setString('lastCourseId', course.id);

final darkMode = prefs.getBool('darkMode') ?? false;   // getters return null if unset
\`\`\`

Every getter can return null, so always supply a default with \`??\`. Load preferences once during startup and hand them to your state layer rather than calling \`getInstance()\` from a dozen widgets.

**Never put an auth token here.** On a rooted or jailbroken device — and on any device via a plain \`adb\` backup on older Android — the backing file is readable. Tokens go in secure storage:

\`\`\`dart
const storage = FlutterSecureStorage();
await storage.write(key: 'token', value: jwt);
final jwt = await storage.read(key: 'token');
\`\`\`

This is the security mistake reviewers find most often in Flutter apps, and it is a one-line fix.

### Structured data with SQLite

\`\`\`dart
final db = await openDatabase(
  join(await getDatabasesPath(), 'courses.db'),
  version: 2,
  onCreate: (db, version) => db.execute('''
    CREATE TABLE courses(
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      weeks INTEGER NOT NULL,
      coverUrl TEXT,
      savedAt INTEGER NOT NULL
    )
  '''),
  onUpgrade: (db, oldVersion, newVersion) async {
    if (oldVersion < 2) {
      await db.execute('ALTER TABLE courses ADD COLUMN coverUrl TEXT');
    }
  },
);

await db.insert('courses', course.toJson()..['savedAt'] = now,
    conflictAlgorithm: ConflictAlgorithm.replace);

final rows = await db.query('courses', orderBy: 'savedAt DESC', limit: 50);
final saved = rows.map(Course.fromJson).toList();
\`\`\`

\`onUpgrade\` is not optional. Ship version 1, then add a column in version 2 without an upgrade path, and every existing user's app crashes on launch while every new install works perfectly — so you will not see it in testing.

The mirror image is just as easy to get wrong. \`onCreate\` runs *only* on a fresh install and \`onUpgrade\` runs *only* on an existing one, so both have to arrive at the same schema. Add \`coverUrl\` in the migration but forget it in \`CREATE TABLE\` and you flip the bug over: upgraded users are fine, while every new install dies on the first insert with *table courses has no column named coverUrl*. Bump \`version\` and update both paths in the same commit, every time.

\`ConflictAlgorithm.replace\` gives you an upsert, which is what a cache almost always wants.

### A cache-then-network pattern

\`\`\`dart
Future<List<Course>> load({bool forceRefresh = false}) async {
  final cached = await _local.readCourses();
  if (cached.isNotEmpty && !forceRefresh) {
    unawaited(_refreshInBackground());   // show instantly, update quietly
    return cached;
  }
  final fresh = await _api.fetchCourses();
  await _local.writeCourses(fresh);
  return fresh;
}
\`\`\`

The user sees content immediately on a cold start and the list updates a moment later. Compared with a spinner on every launch, this is the single biggest perceived-performance win available to a mobile app.

### Two rules

Storage is **asynchronous** — every call returns a Future, so initialise it before \`runApp\` or behind a loading state, never with a synchronous read in \`build\`. And storage is **not backup**: on iOS, app data is deleted with the app. Anything the user would be upset to lose belongs on your server too.
        `),
      ],
      [
        q('jsonDecode gives you a list of maps. Why does casting it to List<Map<String, dynamic>> throw?', [
          'jsonDecode returns a String',
          'The runtime type is List<dynamic>; you must cast each element instead',
          'Maps cannot have dynamic values',
          'The list must be converted with toList() first',
        ], 1, 'Dart generics are checked at runtime, and the decoded object really is a List<dynamic> regardless of what its elements are.'),
        q('What must a TextFormField validator return when the input is valid?', [
          'An empty string',
          'The trimmed value',
          'true',
          'null',
        ], 3, 'null signals valid; any returned string is displayed as the error message under the field.'),
        q('Where should a JWT be stored on the device?', [
          'A global Dart variable',
          'shared_preferences',
          'flutter_secure_storage, which uses Keychain and Keystore',
          'A file in the documents directory',
        ], 2, 'shared_preferences is plaintext on disk, while secure storage delegates to the platform keystore that is designed for secrets.'),
        q('Why is calling fetchCourses() directly in the future: argument of FutureBuilder a bug?', [
          'It restarts the request on every rebuild',
          'The result is never typed',
          'It blocks the UI thread',
          'FutureBuilder cannot accept a function call',
        ], 0, 'build can run many times, and each run creates a new Future — so the request refires constantly; create it once in initState.'),
      ]
    ),
    chapter(
      'Platform, Performance, and Release',
      'The differences between Android, iOS, and web — then getting a signed build into the stores.',
      [
        lesson('Platform Differences and Adaptive UI', 12, `
One codebase does not mean one experience. Users notice when an Android app behaves like an iOS app, and some differences are not cosmetic at all.

### Detecting the platform correctly

\`\`\`dart
import 'package:flutter/foundation.dart' show kIsWeb, defaultTargetPlatform;
import 'dart:io' show Platform;

if (kIsWeb) { ... }                                        // check this FIRST
else if (Platform.isIOS) { ... }
\`\`\`

\`dart:io\` does not exist on the web, so \`Platform.isIOS\` throws there — and because it fails at *runtime*, a web build compiles happily and then breaks in the browser. Always test \`kIsWeb\` first, or use \`defaultTargetPlatform\`, which is safe everywhere and respects \`debugDefaultTargetPlatformOverride\` so you can preview iOS behaviour from a Linux machine.

### What actually differs

| Area | Android | iOS |
|---|---|---|
| Back navigation | Hardware/gesture back button | Swipe from the left edge |
| Page transition | Fade through | Slide from the right |
| Scroll physics | Glow at the edge | Rubber-band bounce |
| Dialogs | Material \`AlertDialog\` | \`CupertinoAlertDialog\` |
| Fonts | Roboto | SF Pro |
| Permissions | Requested at first use, revocable | Requires a usage string in Info.plist |

Most of this you get for free by using \`MaterialApp\`, \`Scaffold\`, and \`MaterialPageRoute\` — Flutter already swaps transitions, physics, and fonts per platform. Reach for explicit branching only where the difference is genuinely user-visible.

### Adapting deliberately

\`\`\`dart
Future<bool> confirmDelete(BuildContext context) async {
  final isCupertino = !kIsWeb && Platform.isIOS;
  return await showDialog<bool>(
        context: context,
        builder: (ctx) => isCupertino
            ? CupertinoAlertDialog(
                title: const Text('Delete course?'),
                actions: [
                  CupertinoDialogAction(
                      onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                  CupertinoDialogAction(
                      isDestructiveAction: true,
                      onPressed: () => Navigator.pop(ctx, true),
                      child: const Text('Delete')),
                ],
              )
            : AlertDialog(
                title: const Text('Delete course?'),
                actions: [
                  TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                  TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
                ],
              ),
      ) ??
      false;
}
\`\`\`

Note the \`?? false\`: \`showDialog\` returns null when the user dismisses by tapping outside, and treating null as "confirmed" deletes data the user did not agree to delete.

### Permissions are the real platform work

Both stores reject apps that ask for capabilities they never declare. iOS needs a plain-English reason string in \`Info.plist\`:

\`\`\`xml
<key>NSCameraUsageDescription</key>
<string>Used to scan the QR code on your enrolment card.</string>
\`\`\`

Android declares in \`AndroidManifest.xml\` and asks at runtime from API 23 onward. Either way, handle the denial path: a user who says no must still be able to use the rest of the app, and "permanently denied" needs a button that opens system settings, because you cannot ask again.

### Screen furniture

\`\`\`dart
Scaffold(
  body: SafeArea(child: content),                    // clears notch and home bar
  resizeToAvoidBottomInset: true,                    // keyboard does not cover fields
)
\`\`\`

Test with the largest accessibility text size on the smallest phone you support, in both orientations. That combination finds every overflow you have, and it takes two minutes.

### Web and desktop caveats

The web build has no \`dart:io\`, real URLs the user can bookmark and refresh, a much larger initial download, and a mouse instead of a thumb. If web is a target, decide it before you build — retrofitting URL-aware routing and hover states into a finished phone app is a rewrite of your navigation layer.
        `),
        lesson('Performance and Testing', 13, `
Flutter is fast by default, and almost all jank is caused by the same handful of habits. Fix those and profile only what is left.

### Rebuild less

\`\`\`dart
// Every rebuild of this screen rebuilds the whole header
Column(children: [ExpensiveHeader(), CourseList(courses: courses)])

// const means the header is skipped entirely
Column(children: [const ExpensiveHeader(), CourseList(courses: courses)])
\`\`\`

Then keep the dirty region small. A \`setState\` at the top of a screen rebuilds everything beneath it, so push state down into the smallest widget that owns it, or wrap just the reactive part in a \`Consumer\`/\`ValueListenableBuilder\`. In Chapter 3 this was a correctness argument; here it is a frame-budget one — at 60fps you have 16 milliseconds per frame for everything.

### Build lazily

- \`ListView.builder\` and \`GridView.builder\` for anything longer than a screen — they build only what is visible.
- Give list items a stable \`key\` when the list is reordered or filtered, so element state follows the right item.
- \`cacheExtent\` tunes how far ahead the list builds; the default is usually right.

### Keep build cheap

No sorting, no JSON parsing, no regex compilation, no \`DateFormat\` construction inside \`build\`. Compute once and store it, or move it into the model. A 4ms sort is invisible in a unit test and drops a quarter of your frames when it runs on every rebuild.

For images, size them:

\`\`\`dart
Image.network(url, cacheWidth: 320, fit: BoxFit.cover)
\`\`\`

Decoding a 4000px photo into a 120px avatar costs tens of megabytes of memory and real decode time. \`cacheWidth\` decodes at the size you will actually paint.

### Profile properly

Always profile in **profile mode** — \`flutter run --profile\`. Debug mode is significantly slower by design, and performance conclusions drawn from it are worthless. Open DevTools, record the timeline, and read the two bars: UI (your Dart) and Raster (the GPU). A tall UI bar means your build or layout is slow; a tall raster bar usually means expensive clipping, shadows, or opacity, and \`RepaintBoundary\` around a busy animating subtree is the common fix.

### Test the things that break

\`\`\`dart
// Unit test — pure Dart, milliseconds, no Flutter needed
test('parseCourses reads a payload with a missing title', () {
  final courses = parseCourses('{"data":[{"id":"1","weeks":8}]}');
  expect(courses.single.title, 'Untitled');
});

// Widget test — renders in a headless environment
testWidgets('shows an error and retries', (tester) async {
  await tester.pumpWidget(MaterialApp(home: CourseScreen(api: FailingApi())));
  await tester.pumpAndSettle();

  expect(find.text('Server error (500).'), findsOneWidget);

  await tester.tap(find.text('Retry'));
  await tester.pump();
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
});
\`\`\`

\`pump\` advances one frame; \`pumpAndSettle\` runs frames until no animation is pending. A test that finds nothing after a \`tap\` is nearly always missing a \`pump\`.

Test your parsing and business logic exhaustively — they are pure functions and cost nothing to test. Test widgets at the level of behaviour: does the error state appear, does the button submit once, does the empty list show the empty view. Do not assert on padding values; those tests break on every design tweak and catch nothing.

Add \`integration_test\` for the two or three flows that would be catastrophic to break — sign in, pay, submit — and run them on a real device in CI.
        `),
        lesson('Building and Releasing', 14, `
A debug build is unsigned, unoptimised, and roughly ten times slower to start. Everything below is about producing the artefact the stores will actually accept.

### Version and build number

\`\`\`yaml
# pubspec.yaml
version: 1.4.0+37
\`\`\`

The part before \`+\` is the **version name** users see. The part after is the **build number**, which must increase with every single upload — both stores reject a build number they have seen before, and this is the most common failed upload of a release day. Bump it even for a one-line hotfix.

### Configuration per environment

\`\`\`bash
flutter build apk --release \\
  --dart-define=API_URL=https://api.example.com \\
  --dart-define=ENV=prod
\`\`\`

\`\`\`dart
const apiUrl = String.fromEnvironment('API_URL', defaultValue: 'http://localhost:5000');
\`\`\`

\`String.fromEnvironment\` is resolved at compile time, so the value is a real constant with no runtime lookup. This is not a secret store — anything compiled into the binary can be extracted, so API keys that matter stay on your server.

### Android

Create a keystore once and guard it with your life:

\`\`\`bash
keytool -genkey -v -keystore ~/upload-keystore.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
\`\`\`

Reference it from \`android/key.properties\` (git-ignored), wire the \`signingConfigs\` block in \`android/app/build.gradle\`, then build:

\`\`\`bash
flutter build appbundle --release      # .aab — what Play Store wants
flutter build apk --release            # .apk — for direct install and testing
\`\`\`

Ship the **app bundle**. Google generates per-device APKs from it, so a user downloads only the architecture, screen density, and languages their phone actually needs — commonly 15–20% off the size of a universal APK. Losing the upload keystore historically meant you could never update the app again; Play App Signing makes recovery possible but slow — back it up somewhere you would still have after a laptop theft.

Set \`minSdkVersion\` honestly and enable shrinking for release, which strips unused code and resources.

### iOS

\`\`\`bash
flutter build ipa --release
\`\`\`

Requires a Mac, an Apple Developer account, and a bundle identifier registered in the developer portal. Xcode manages signing certificates and provisioning profiles; let it do so automatically until you have a reason not to. Upload through Xcode or \`xcrun altool\`, then distribute via TestFlight before production.

Apple's review will reject an app that requests a permission without a usage string, crashes on launch, shows placeholder content, or offers digital purchases outside their payment system. Read the guidelines *before* the build, not after the rejection.

### Obfuscation and symbols

\`\`\`bash
flutter build appbundle --release \\
  --obfuscate --split-debug-info=build/symbols
\`\`\`

Obfuscation renames Dart symbols, making decompiled code much harder to read. The trade-off is unreadable crash reports — so **keep the \`build/symbols\` directory for every release you ship**. Without the symbols from that exact build, a stack trace from a real user is meaningless noise.

### Release checklist

- App icon and splash screen set for both platforms (\`flutter_launcher_icons\` handles the sizes).
- App display name, bundle id, and package name final — the package name can never be changed after publishing.
- Version name and build number bumped.
- Release build tested on a **physical** device, not just a simulator.
- All \`print\` and debug logging removed; no debug banner.
- Privacy policy URL, and a completed data-safety / privacy-nutrition declaration.
- Store listing: screenshots at every required size, description, and a content rating.
- Crash reporting wired up and verified with a deliberate test crash.

### After launch

Watch crash-free session rate and ANR rate for the first 48 hours; that is when a device-specific bug will surface. Ship staged rollouts — 10% first — so a bad release reaches a tenth of your users instead of all of them. Then keep going: automated tests you trust, CI that builds every merge, and a release process boring enough that you are willing to do it weekly.
        `),
      ],
      [
        q('Why must you check kIsWeb before Platform.isIOS?', [
          'dart:io does not exist on the web, so Platform.isIOS throws there at runtime',
          'Platform.isIOS is deprecated',
          'The web always reports isIOS as true',
          'kIsWeb is faster to evaluate',
        ], 0, 'A web build compiles fine and then fails in the browser, because dart:io is unavailable — kIsWeb is the safe first branch.'),
        q('A screen janks while scrolling a long list built with a Column inside SingleChildScrollView. Best fix?', [
          'Reduce the image quality',
          'Add RepaintBoundary around the Column',
          'Replace it with ListView.builder so only visible items are built',
          'Wrap each row in const',
        ], 2, 'A Column builds every child up front; ListView.builder builds lazily, so cost scales with the viewport rather than the data.'),
        q('Your Play Store upload is rejected as a duplicate. What did you forget?', [
          'To sign the bundle',
          'To increment the build number after the + in pubspec version',
          'To run flutter clean',
          'To set minSdkVersion',
        ], 1, 'Both stores require a strictly increasing build number, so every upload — including a hotfix — needs the value after the + bumped.'),
        q('Why keep the --split-debug-info symbols directory after an obfuscated release?', [
          'It is needed to build the next version',
          'It contains the signing key',
          'The store requires uploading it',
          'Without those exact symbols, crash reports from users cannot be de-obfuscated',
        ], 3, 'Obfuscation renames symbols, so stack traces are unreadable unless you retain the symbol files produced by that specific build.'),
      ]
    ),
    chapter(
      'Animation and Native Integration',
      'Motion the framework interpolates for you, and the code paths that only the native platform can reach.',
      [
        lesson('Animation That Feels Native', 13, `
Flutter has two animation systems, and reaching for the wrong one is why animation code turns into a mess. Start implicit; escalate only when the timeline is genuinely yours to drive.

### Implicit: change a value, get a transition

\`\`\`dart
AnimatedContainer(
  duration: const Duration(milliseconds: 220),
  curve: Curves.easeOutCubic,
  height: _expanded ? 240 : 96,                 // just flip this inside setState
  padding: EdgeInsets.all(_expanded ? 20 : 12),
  decoration: BoxDecoration(
    color: _expanded ? Colors.cyan.shade50 : Colors.white,
    borderRadius: BorderRadius.circular(_expanded ? 20 : 8),
  ),
  child: const CourseSummary(),
)
\`\`\`

No controller, no ticker, no \`dispose\`. The widget remembers its previous values, sees new ones arrive on rebuild, and interpolates between them. A \`setState\` you already had becomes an animation for the price of one wrapper.

| Widget | Animates |
|---|---|
| \`AnimatedContainer\` | size, colour, padding, border radius, alignment |
| \`AnimatedOpacity\` | fades, including all the way out |
| \`AnimatedAlign\`, \`AnimatedPositioned\` | movement inside a parent or a \`Stack\` |
| \`AnimatedSwitcher\` | replacing one child with another |
| \`TweenAnimationBuilder\` | any single value, on first build and again whenever the target changes |

### The AnimatedSwitcher trap

\`\`\`dart
AnimatedSwitcher(
  duration: const Duration(milliseconds: 200),
  child: Text('$_count', key: ValueKey(_count)),   // the key is what makes it animate
)
\`\`\`

Drop that key and nothing moves. Both children are \`Text\` widgets of the same runtime type, so by the diffing rules from Chapter 1 Flutter updates the existing element in place — there is no outgoing child to cross-fade. The key is the only thing telling the framework that these are two different children rather than one continuing one.

### Explicit: when you own the timeline

\`\`\`dart
class _PulseState extends State<Pulse> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  )..repeat(reverse: true);

  late final Animation<double> _scale = Tween(begin: 1.0, end: 1.08)
      .animate(CurvedAnimation(parent: _c, curve: Curves.easeInOut));

  @override
  void dispose() {
    _c.dispose();               // a live ticker never stops on its own
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _scale,
        child: const EnrolButton(),       // built once, not sixty times a second
        builder: (_, child) => Transform.scale(scale: _scale.value, child: child),
      );
}
\`\`\`

Three details carry that snippet.

**\`vsync: this\`** requires \`SingleTickerProviderStateMixin\`, or \`TickerProviderStateMixin\` when a State owns more than one controller. It binds the animation to this screen's frame callbacks, so it stops consuming frames the moment the route is covered.

**\`dispose\`** is the same discipline as the controllers in Chapter 2. Skip it and Flutter tells you at the worst possible moment — *"_PulseState was disposed with an active Ticker"* — usually as a red screen during a hot reload, or as a widget test that refuses to finish.

**The \`child:\` argument.** \`builder\` runs on every frame; whatever you pass as \`child\` is built once and handed straight through. Putting the real subtree inside \`builder\` rebuilds it sixty times a second, which is how a smooth animation becomes the jank you then go hunting for in DevTools.

### Shared-element transitions

\`\`\`dart
Hero(tag: 'cover-\${course.id}', child: Image.network(course.coverUrl))
\`\`\`

Put the same tag on a widget in both routes and Flutter flies it between them during the push. The classic failure is a hardcoded tag such as \`'cover'\` on a list screen: every card claims it and you get *"There are multiple heroes that share the same tag"*. Fold the item id into the tag, always.

### Motion budget

Interface animation lives between 150 and 300 milliseconds. Below that it reads as a glitch; past 400 it feels like waiting. Use \`Curves.easeOutCubic\` for things arriving and \`Curves.easeIn\` for things leaving, and never loop an animation inside a list — thirty pulsing cards is thirty tickers competing for the same 16ms frame budget.

Then respect the user. \`MediaQuery.of(context).disableAnimations\` is true when someone has switched on reduce-motion, and honouring it costs one expression: \`duration: reduceMotion ? Duration.zero : const Duration(milliseconds: 220)\`. For a user who gets motion sickness from a parallax header, that line is the difference between an app they can use and one they delete.
        `),
        lesson('Platform Channels and Plugins', 14, `
Dart cannot call the Bluetooth stack, the health store, or a vendor SDK shipped as an \`.aar\`. When you need something only the platform can do, you send a message across a **platform channel**.

### First, do not write one

Search pub.dev before you open Xcode. A published plugin has been tested on devices you do not own, already handles the permission dance, and usually ships a no-op for web and desktop. Check the *Platforms* row on the package page and the date of the last release — an abandoned plugin is worse than none, because you inherit its native code without its author.

Write a channel yourself when the capability is proprietary, when the only plugin available is unmaintained, or when you are wrapping your own company SDK.

### A MethodChannel, end to end

\`\`\`dart
// lib/platform/battery.dart
import 'package:flutter/services.dart';

class Battery {
  static const _channel = MethodChannel('com.example.courses/battery');

  static Future<int> level() async {
    try {
      final result = await _channel.invokeMethod<int>('getLevel');
      return result ?? -1;
    } on PlatformException catch (e) {
      throw Exception('Battery unavailable: \${e.code}');
    } on MissingPluginException {
      return -1;                  // web, desktop, or the native side is not wired
    }
  }
}
\`\`\`

The channel name is a namespaced string and it must match **byte for byte** on both sides. Use reverse-domain plus a suffix so two plugins can never collide.

\`\`\`kotlin
// android/app/src/main/kotlin/.../MainActivity.kt
class MainActivity : FlutterActivity() {
  override fun configureFlutterEngine(engine: FlutterEngine) {
    super.configureFlutterEngine(engine)
    MethodChannel(engine.dartExecutor.binaryMessenger, "com.example.courses/battery")
      .setMethodCallHandler { call, result ->
        when (call.method) {
          "getLevel" -> {
            val bm = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            result.success(bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY))
          }
          else -> result.notImplemented()   // arrives in Dart as MissingPluginException
        }
      }
  }
}
\`\`\`

\`\`\`swift
// ios/Runner/AppDelegate.swift
let channel = FlutterMethodChannel(name: "com.example.courses/battery",
                                   binaryMessenger: controller.binaryMessenger)
channel.setMethodCallHandler { call, result in
  guard call.method == "getLevel" else { return result(FlutterMethodNotImplemented) }
  UIDevice.current.isBatteryMonitoringEnabled = true
  result(Int(UIDevice.current.batteryLevel * 100))
}
\`\`\`

Everything crossing the boundary is asynchronous, and only the standard types survive: null, bool, int, double, String, byte lists, \`List\`, and \`Map\`. Your own class does not — encode it as a map, which is exactly the \`toJson\` you already wrote in Chapter 4.

### The error you will hit within ten minutes

\`MissingPluginException(No implementation found for method getLevel)\` after adding a plugin or a channel almost never means your Dart is wrong. Native code is not injected by hot reload, and not by hot restart either — it has to be compiled into the app. **Stop the app and run \`flutter run\` again.** Do the same after any \`pubspec.yaml\` change that adds a platform dependency, and run \`flutter clean\` if the build has been sitting on the device across a plugin upgrade.

On the native side, call \`result.error("UNAVAILABLE", "Battery API missing", null)\` for real failures. That surfaces in Dart as a \`PlatformException\` carrying your code, which is far more actionable than a bare throw.

### Streams across the boundary

A \`MethodChannel\` is one request and one reply. For continuous data — sensors, scan results, a location feed — use an \`EventChannel\`, which appears in Dart as the Stream you already know how to consume with \`StreamBuilder\` from Chapter 1.

\`\`\`dart
static const _events = EventChannel('com.example.courses/battery/stream');
Stream<int> get levels => _events.receiveBroadcastStream().cast<int>();
\`\`\`

### Permissions are half the job

\`\`\`dart
var status = await Permission.camera.status;
if (status.isDenied) status = await Permission.camera.request();

if (status.isPermanentlyDenied) {
  // You cannot ask again — the only route left is the system settings screen
  await openAppSettings();
  return;
}
if (!status.isGranted) {
  showBanner('Scanning needs camera access.');
  return;
}
\`\`\`

Handle \`permanentlyDenied\` as its own branch or your app calls \`request()\`, the OS silently declines to show anything, and the scan button appears to do nothing at all. And declare the usage strings from Chapter 5 before you test: on iOS an undeclared permission does not prompt, it terminates the app.
        `),
        lesson('Push Notifications and Deep Links', 13, `
A notification is the only part of your app that runs when your app does not. That is exactly what makes it the feature teams get wrong.

### Three app states, three different callbacks

\`\`\`dart
Future<void> initMessaging() async {
  final fcm = FirebaseMessaging.instance;

  // iOS, and Android 13+, deliver nothing until the user agrees
  await fcm.requestPermission(alert: true, badge: true, sound: true);
  final token = await fcm.getToken();
  await api.registerDevice(token);                    // your server needs this
  fcm.onTokenRefresh.listen(api.registerDevice);      // tokens rotate

  // 1. App open and visible
  FirebaseMessaging.onMessage.listen(showInAppBanner);

  // 2. App backgrounded, user taps the notification
  FirebaseMessaging.onMessageOpenedApp.listen(_route);

  // 3. App was fully terminated — the one everybody forgets
  final initial = await fcm.getInitialMessage();
  if (initial != null) _route(initial);
}
\`\`\`

Ship only \`onMessage\` and the feature looks perfect in testing, because your app is always open while you test it. In production most taps arrive at an app that was not running, and they land nowhere. \`getInitialMessage\` returns the notification that launched the process; it returns null on an ordinary cold start, so calling it every time is safe.

One more asymmetry: on Android a message received in the **foreground** does not draw a system notification, because the OS assumes you will handle it yourself. Either show your own banner or hand it to \`flutter_local_notifications\`.

### The background isolate

\`\`\`dart
@pragma('vm:entry-point')                  // survives tree shaking in release
Future<void> _bgHandler(RemoteMessage message) async {
  await Firebase.initializeApp();          // a fresh isolate — nothing is set up yet
  await LocalStore.markUnread(message.data['courseId']);
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();          // the main isolate needs it too
  FirebaseMessaging.onBackgroundMessage(_bgHandler);
  runApp(const MyApp());
}
\`\`\`

This must be a **top-level or static function**. It runs in its own isolate, and by the isolate rules from Chapter 1 it shares no memory with your app: your providers, your singletons, and any \`BuildContext\` simply do not exist there. Touch plugins and storage only, and finish in a couple of seconds — the OS will kill it.

### Routing a tap without a BuildContext

On a cold start the handler fires before your first frame, so \`Navigator.of(context)\` has nothing to walk up to. Use a global key, or the router from Chapter 3.

\`\`\`dart
final navigatorKey = GlobalKey<NavigatorState>();

void _route(RemoteMessage m) {
  final id = m.data['courseId'];
  if (id == null) return;
  navigatorKey.currentState?.pushNamed('/course/\${id}');   // null-safe if not mounted yet
}

MaterialApp(navigatorKey: navigatorKey, ...);
\`\`\`

Put routing information in the \`data\` payload, never parsed out of the display text — the title is written by a marketer and will change. Send an explicit type as well, \`{"type": "course", "id": "42"}\`, so a notification kind you invent next year does not require an app update to be understood.

### Deep links are the same problem from a URL

\`go_router\` already parses an incoming link against your route table, so the Dart side is nearly free. The work is platform configuration, and it fails quietly.

**Android App Links** need an intent filter with \`android:autoVerify="true"\` and an \`assetlinks.json\` served from \`https://yourdomain.com/.well-known/assetlinks.json\`, containing your package name and the SHA-256 fingerprint of the **signing** certificate. Use the upload key fingerprint for local testing and the Play App Signing fingerprint for production; mismatching those two is the usual reason links open Chrome instead of your app.

**iOS Universal Links** need the Associated Domains capability (\`applinks:yourdomain.com\`) plus an \`apple-app-site-association\` file over HTTPS with no redirect and no file extension.

Neither platform reports the failure. It just opens the browser — which is identical to what a user without the app installed sees, so you cannot tell the two apart by looking. Test on a physical device with the file already deployed.

### Before you ship

Send yourself a notification in all three states on a real handset: open, backgrounded, and force-quit. Check that the badge clears, that the token is deleted from your server on logout, and that a user who declined permission still gets a completely working app.
        `),
      ],
      [
        q('An AnimatedSwitcher swaps between two Text widgets but nothing ever animates. Why?', [
          'AnimatedSwitcher only animates images and icons',
          'The duration is too short to be visible',
          'Both children share a runtime type and have no key, so Flutter updates the element in place',
          'It needs a TickerProvider from the State',
        ], 2, 'Without a differing key the framework sees one continuing child rather than an outgoing and an incoming one, so there is no transition to run.'),
        q('Why pass the animated subtree to the child: argument of AnimatedBuilder instead of building it inside builder:?', [
          'child is built once, while builder runs on every frame of the animation',
          'builder cannot return widgets that hold state',
          'child is automatically wrapped in const',
          'Only child participates in the transform',
        ], 0, 'The builder callback fires once per frame, so anything constructed inside it is rebuilt sixty times a second while child is built once and handed through.'),
        q('You add a plugin, hot reload, and every call throws MissingPluginException. What is wrong?', [
          'The method name must be marked async',
          'The plugin has to be registered inside main()',
          'The channel needs a unique GlobalKey',
          'Native code is not injected by hot reload, so the app must be stopped and rebuilt',
        ], 3, 'Hot reload and hot restart only replace Dart code, so newly added native plugin code is absent until a full rebuild and reinstall.'),
        q('Notifications work while the app is open, but tapping one that launched the app from a force-quit state does nothing. What is missing?', [
          'A second FirebaseMessaging.onMessage listener',
          'A getInitialMessage() call during startup',
          'requestPermission on Android',
          'A foreground service declaration',
        ], 1, 'The notification that started the process is never delivered to the stream handlers, and getInitialMessage is the only way to retrieve it.'),
      ]
    ),
    chapter(
      'Architecture, Observability, and CI/CD',
      'Laying out a codebase that survives its second year, diagnosing crashes you cannot reproduce, and making a machine do the release.',
      [
        lesson('Structuring an App That Grows', 14, `
The folder layout that fits four screens collapses at forty. The fix is not more folders — it is a rule about which direction code is allowed to point.

### Feature-first, layered inside

\`\`\`
lib/
  core/               theme, router, http client, failures, shared widgets
  features/
    courses/
      data/           CourseApi, CourseLocalStore, CourseRepository
      domain/         Course, Enrolment — plain Dart, no Flutter imports
      presentation/   CourseListScreen, CourseCard, CourseController
    auth/
      data/ domain/ presentation/
  main_dev.dart  main_staging.dart  main_prod.dart
\`\`\`

Grouping by layer at the top level — \`screens/\`, \`models/\`, \`services/\` — smears every feature across the tree, so one change touches four distant folders and nobody can tell what is safe to delete. Grouping by feature keeps a change local, and removing a feature becomes removing a directory.

The dependency rule fits on one line: **presentation depends on domain, data depends on domain, and domain depends on nothing.** The moment \`domain/course.dart\` imports \`material.dart\`, the layering has already failed and your models are no longer testable without a widget binding.

### The repository is the seam

\`\`\`dart
// features/courses/data/course_repository.dart
class CourseRepository {
  CourseRepository(this._api, this._local);      // injected, never constructed inside
  final CourseApi _api;
  final CourseLocalStore _local;

  Future<List<Course>> courses({bool refresh = false}) async {
    if (!refresh) {
      final cached = await _local.read();
      if (cached.isNotEmpty) return cached;
    }
    final fresh = await _api.fetchCourses();
    await _local.write(fresh);
    return fresh;
  }
}
\`\`\`

Chapter 4 built the API client; the repository sits above it and owns the cache-or-network decision. Nothing further up the stack ever sees an \`http.Response\`, a status code, or a raw \`Map\`. That single constraint is what lets you swap the backend, add offline support, or fake the entire layer in a test without opening a widget file.

Look at the constructor again. Because the dependencies arrive as parameters, a widget test can pass a \`FakeCourseApi\` and run in milliseconds with no network. A repository that calls \`CourseApi()\` internally is untestable, and no amount of folder structure rescues it.

### Wiring it up

\`\`\`dart
final getIt = GetIt.instance;

void configureDependencies() {
  getIt.registerLazySingleton(() => http.Client());
  getIt.registerLazySingleton(() => CourseApi(getIt()));
  getIt.registerLazySingleton(() => CourseRepository(getIt(), getIt()));
}
\`\`\`

Or, if you chose Riverpod back in Chapter 3, use it as the container and skip the second tool entirely:

\`\`\`dart
final courseRepoProvider = Provider(
  (ref) => CourseRepository(ref.watch(courseApiProvider), ref.watch(localStoreProvider)),
);
\`\`\`

Either is fine. Two service locators in one app is not — you will end up with two instances of the same repository and a cache that disagrees with itself.

### Stop hand-writing fromJson

The \`fromJson\` in Chapter 4 was written by hand so you could see the null and number handling for yourself. At thirty models that is thirty chances to mistype a key.

\`\`\`dart
@freezed
class Course with _$Course {
  const factory Course({
    required String id,
    @Default('Untitled') String title,
    @JsonKey(name: 'cover_url') String? coverUrl,
  }) = _Course;

  factory Course.fromJson(Map<String, dynamic> json) => _$CourseFromJson(json);
}
\`\`\`

\`dart run build_runner watch --delete-conflicting-outputs\` generates the serialisation plus \`copyWith\` and value equality. That equality matters more than it looks: without it two identical \`Course\` objects are unequal under \`==\`, so a list rebuilds even when the data did not change.

**Never edit a generated file.** They are overwritten on the next build, and the mistake is easy because your editor will happily jump you into \`course.g.dart\` on a ctrl-click. Commit them or gitignore them — either works, but decide once, because half-committed generated files produce merge conflicts nobody can resolve.

### Errors as values, not as surprises

\`\`\`dart
sealed class Failure {}
class NetworkFailure extends Failure {}
class AuthFailure extends Failure {}

switch (failure) {                 // Dart 3 rejects this if a case is missing
  case NetworkFailure(): showRetry();
  case AuthFailure(): goToLogin();
}
\`\`\`

A \`sealed\` class makes the compiler fail the build when you add a third failure and forget one screen. Exceptions thrown across three layers give you no such guarantee, and the branch you forget is always the one your users find first.
        `),
        lesson('Debugging What You Cannot Reproduce', 13, `
The bug that matters is on a mid-range Android handset in another country, on a network you cannot simulate. Everything below exists to make that bug arrive on your desk with enough context to fix it.

### Catch every error, not just the Flutter ones

\`\`\`dart
void main() {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    await Firebase.initializeApp();

    // 1. Errors raised inside build, layout and paint
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;

    // 2. Errors from the engine and from platform callbacks
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };

    runApp(const MyApp());
  }, (error, stack) {
    // 3. Anything that escaped across an async gap
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
  });
}
\`\`\`

Wiring only \`FlutterError.onError\` is the usual half-job. It covers the framework and nothing else. An unawaited Future that throws — a background sync, a fire-and-forget analytics call, the \`unawaited(_refreshInBackground())\` from Chapter 4 — never reaches it, so your crash-free rate reads 100% while support tickets pile up. Install all three, in every project.

### Reports are noise without symbols

Chapter 5 shipped the release with \`--obfuscate --split-debug-info=build/symbols\`. Those symbols have to be uploaded for that exact build, or every frame in the stack trace is a hex offset:

\`\`\`bash
firebase crashlytics:symbols:upload --app=1:1234:android:abcd build/symbols
\`\`\`

Do it in the same CI job that produced the bundle. A symbol directory on the laptop of someone who is on holiday is the same as no symbols at all.

### Log context, not print statements

\`\`\`dart
FirebaseCrashlytics.instance.setUserIdentifier(user.id);          // an id, never an email
FirebaseCrashlytics.instance.setCustomKey('flavor', kFlavor);
FirebaseCrashlytics.instance.log('open course id=\${course.id}');
\`\`\`

Those breadcrumbs ride along with the next crash and turn *"Null check operator used on a null value"* into *"…after opening course 42 while offline"*. Record handled failures too, with \`recordError(e, s, fatal: false)\` — a caught exception that leaves the user stuck is still a bug, it just does not crash.

Never log tokens, emails, phone numbers, or form contents. A crash reporter is a third-party database, and \`print\` output on Android is readable through logcat by anything with the right permission.

### DevTools, used properly

| Tab | Finds |
|---|---|
| Inspector | Layout mysteries — select a widget and read the constraints it was handed |
| Performance | Which frames blew the 16ms budget, and whether it was UI or raster |
| CPU profiler | The Dart function eating those milliseconds |
| Memory | Objects that should have been collected and were not |
| Network | Duplicate requests and payloads far bigger than you expected |

The memory tab is where you catch the leaks from Chapters 2 and 6. Push and pop the same screen ten times, take a snapshot, and filter for your State class. Ten live instances means something is retaining them: an undisposed controller, a stream subscription never cancelled, or a listener added in \`initState\` and never removed.

\`\`\`dart
debugRepaintRainbowEnabled = true;      // flashing borders mark repainting layers
debugPrintRebuildDirtyWidgets = true;   // logs every widget rebuilt, every frame
\`\`\`

Turn the second one on when a screen feels heavy. Watching your entire list get logged on every keystroke is a faster diagnosis than any amount of code reading.

### Decoding the classics

| Message | Almost always |
|---|---|
| \`setState() called after dispose()\` | A missing \`mounted\` check after an await |
| \`RenderFlex overflowed by N pixels\` | An unbounded child in a Row — wrap it in \`Expanded\` |
| \`No Navigator in context\` | Using the context that built \`MaterialApp\` |
| \`MissingPluginException\` | Native code added without a full rebuild |
| \`type Null is not a subtype of type String\` | A JSON field that was absent or null |
| \`was disposed with an active Ticker\` | An \`AnimationController\` that was never disposed |

Every one of those has appeared earlier in this course. That is the point: production Flutter bugs are a short list, repeated at scale.
        `),
        lesson('Flavors and a Release Pipeline', 14, `
Chapter 5 produced a signed build by hand. Doing that on release day, from a laptop, with a manually bumped version, is how a staging build ends up on the store. Automate it, and make the environments impossible to confuse.

### Flavors: three apps on one phone

\`\`\`gradle
// android/app/build.gradle
flavorDimensions "env"
productFlavors {
    dev     { dimension "env"; applicationIdSuffix ".dev";     resValue "string", "app_name", "Courses Dev" }
    staging { dimension "env"; applicationIdSuffix ".staging"; resValue "string", "app_name", "Courses Stg" }
    prod    { dimension "env";                                 resValue "string", "app_name", "Courses" }
}
\`\`\`

The distinct application id is the whole point: dev, staging, and production install side by side with different names and icons, so a tester can never file a bug against a build they only think they are running. On iOS the equivalent is a scheme plus a build configuration per environment, with the bundle identifier set per configuration.

Give each environment an entrypoint rather than a runtime \`if\`:

\`\`\`dart
// lib/main_prod.dart
void main() => bootstrap(env: Env.prod);
\`\`\`

\`\`\`bash
flutter run --flavor dev -t lib/main_dev.dart --dart-define-from-file=config/dev.json
\`\`\`

\`--dart-define-from-file\` loads a JSON file of key/values into the \`String.fromEnvironment\` constants from Chapter 5. Commit \`config/dev.json\`, git-ignore \`config/prod.json\`, and keep genuine secrets on the server — anything defined here is compiled into a binary that anyone can unzip.

### A pipeline that does the boring part

\`\`\`yaml
name: release
on:
  push:
    tags: ['v*']

jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { flutter-version: '3.24.0', cache: true }

      - run: flutter pub get
      - run: dart analyze --fatal-infos      # fail here, not in code review
      - run: flutter test

      - name: Restore signing key
        run: |
          echo "\${{ secrets.KEYSTORE_B64 }}" | base64 --decode > android/upload.jks
          printf 'storeFile=upload.jks\\nstorePassword=%s\\nkeyAlias=upload\\nkeyPassword=%s\\n' \\
            "\${{ secrets.STORE_PASSWORD }}" "\${{ secrets.KEY_PASSWORD }}" > android/key.properties

      - name: Build bundle
        run: |
          flutter build appbundle --release --flavor prod -t lib/main_prod.dart \\
            --build-number=\${{ github.run_number }} \\
            --dart-define-from-file=config/prod.json \\
            --obfuscate --split-debug-info=build/symbols

      - uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: \${{ secrets.PLAY_SERVICE_ACCOUNT }}
          packageName: com.example.courses
          releaseFiles: build/app/outputs/bundle/prodRelease/app-prod-release.aab
          track: internal
\`\`\`

\`github.run_number\` retires the build-number problem from Chapter 5 for good: it increases by itself and cannot be forgotten at 11pm. The keystore never enters the repository — store it base64-encoded as a secret and write it to disk only for the length of the job.

### The failure that actually ships

Plenty of Gradle files are written like this:

\`\`\`gradle
buildTypes {
    release {
        // "so local builds still work without the keystore"
        signingConfig signingConfigs.findByName(\"release\") ?: signingConfigs.debug
    }
}
\`\`\`

If \`key.properties\` is missing — a mistyped secret name, a fork with no access to it — the build **succeeds** and hands you a debug-signed artefact. The store rejecting it is the lucky outcome; the unlucky one is a build distributed to testers with debugging enabled. Make the absence fatal instead: \`throw new GradleException("key.properties not found")\`. A pipeline that fails loudly is worth more than one that always goes green.

### iOS in CI

\`flutter build ipa\` needs a macOS runner, an App Store Connect API key (a \`.p8\` file held as a secret, never an Apple ID password), and certificates managed by \`fastlane match\` in a private repository so the machine can fetch them unattended. Budget a full day for the first working iOS pipeline; it is the least forgiving part of this entire course.

### Roll out expecting to be wrong

Publish to the internal track first, promote to a **staged rollout** at 5–10%, and watch crash-free sessions and the ANR rate for 24 hours before going further. Both stores let you halt a rollout, which only helps while you are still below 100%.

Keep a server-side kill switch for anything risky — a remote config flag read at launch — so disabling a broken feature takes a minute rather than a store review.
        `),
      ],
      [
        q('Why should a repository receive its API client as a constructor parameter instead of creating one internally?', [
          'It makes the app binary smaller',
          'A test can pass a fake client, so the layer is testable without a network',
          'Constructors execute faster than factories',
          'Dart forbids creating objects inside a class body',
        ], 1, 'Injected dependencies can be substituted, which is what lets the repository and everything above it be tested without a real server.'),
        q('You wire FlutterError.onError to your crash reporter, yet errors from an unawaited Future never appear. What is missing?', [
          'setUserIdentifier on every session',
          'A symbol upload step in CI',
          'A try/catch inside each widget build',
          'PlatformDispatcher.instance.onError plus a runZonedGuarded wrapper around runApp',
        ], 3, 'FlutterError.onError only receives framework errors, so anything escaping across an async gap needs the zone and platform dispatcher handlers too.'),
        q('What is the danger of a Gradle release signingConfig that falls back to the debug config when key.properties is absent?', [
          'The build quietly succeeds and produces a debug-signed artefact instead of failing',
          'Gradle refuses to run without a network connection',
          'The version name is reset to 1.0.0',
          'Obfuscation is silently disabled',
        ], 0, 'A silent fallback turns a missing secret into a shipped artefact signed with the wrong key rather than an obvious build failure.'),
        q('Why give each build flavor a different application id?', [
          'Flavors will not compile without one',
          'It reduces the download size for each environment',
          'Dev, staging, and production install side by side, so a build can never be mistaken for another',
          'The stores require one id per distribution track',
        ], 2, 'Distinct ids make the environments separate installs with their own names and data, so testers always know which build produced a bug.'),
      ]
    ),
  ],
  final: [
    q('Why are widget fields declared final?', [
      'Dart requires it for all classes',
      'To make them private',
      'A widget is an immutable description that is rebuilt rather than edited',
      'final fields render faster',
    ], 2, 'Widgets are throwaway configuration; mutable state lives on the State object, not on the widget.'),
    q('An async method awaits an API call and then calls setState. The app crashes with "setState() called after dispose()". Fix?', [
      'Return early if !mounted after the await',
      'Move the call into build',
      'Use a StatelessWidget instead',
      'Wrap setState in a try/catch',
    ], 0, 'The mounted flag tells you the State is still in the tree; checking it after every await prevents updating a disposed widget.'),
    q('A Row overflows on a narrow phone because one title is long. Which fix survives translation and large text settings?', [
      'A fixed-width SizedBox around the title',
      'Setting mainAxisAlignment to center',
      'A smaller font size',
      'Expanded plus TextOverflow.ellipsis on the text',
    ], 3, 'Expanded bounds the child to whatever space remains and ellipsis handles any excess, so no string length or text scale can overflow.'),
    q('Which fix for "Vertical viewport was given unbounded height" keeps a long list lazy?', [
      'shrinkWrap: true',
      'Wrapping the ListView in Expanded',
      'Wrapping the Column in SingleChildScrollView',
      'Setting a fixed height with MediaQuery',
    ], 1, 'Expanded gives the list a bounded height while it still builds only visible items; shrinkWrap forces every child to be built.'),
    q('How does a pushed screen send a result back to the screen that opened it?', [
      'By calling setState on the caller',
      'It calls pop(value), and the caller awaits the Future from push',
      'Through a global variable',
      'By rebuilding the caller with new props',
    ], 1, 'Navigator.push returns a Future that completes with the value passed to pop.'),
    q('In Provider, which call belongs inside an onPressed handler?', [
      'Consumer<T>',
      'context.watch<T>()',
      'context.read<T>()',
      'context.select<T, R>()',
    ], 2, 'read performs a one-off lookup with no subscription, which is exactly right in a callback; watch is only legal during build.'),
    q('Casting jsonDecode output straight to List<Map<String, dynamic>> throws. Why?', [
      'The runtime type is List<dynamic>, so each element must be cast individually',
      'Dart cannot cast generics at all',
      'jsonDecode returns a String',
      'The JSON was malformed',
    ], 0, 'Generic types are checked at runtime and the decoder really produced a List<dynamic>, regardless of what the elements are.'),
    q('A TextFormField validator should return which value when the input is acceptable?', [
      '"valid"',
      'The field value',
      'true',
      'null',
    ], 3, 'null means no error; any returned string is shown as the error message beneath the field.'),
    q('Where should an authentication token be stored on device?', [
      'A local SQLite table',
      'A const in the source code',
      'shared_preferences',
      'flutter_secure_storage',
    ], 3, 'Secure storage delegates to Keychain and Keystore, while shared_preferences is a plaintext file and source constants ship to every user.'),
    q('Why does creating a TextEditingController inside build cause bugs?', [
      'A new controller every frame leaks memory and resets the field',
      'Controllers must be const',
      'It disables validation',
      'build cannot create objects',
    ], 0, 'build runs constantly, so each rebuild discards the old controller and its text; create it in initState and dispose it in dispose.'),
    q('A list screen throws "There are multiple heroes that share the same tag". What is the fix?', [
      'Wrap every Hero in a RepaintBoundary',
      'Replace Hero with AnimatedSwitcher',
      'Make the tag unique per item by folding the item id into it',
      'Move the Hero outside the ListView',
    ], 2, 'Hero matches source and destination by tag, so every simultaneously visible item needs its own tag for the framework to know which pair to fly.'),
    q('A push notification tapped from a terminated app opens the home screen instead of the linked course. What was omitted?', [
      'Reading FirebaseMessaging.instance.getInitialMessage() during startup',
      'A second call to requestPermission',
      'Registering the FCM token with your server',
      'A foreground notification channel',
    ], 0, 'The message that started the process is never delivered to the stream listeners, so getInitialMessage is the only way to read it.'),
    q('Why is a build number taken from the CI run number better than bumping it by hand?', [
      'It shortens the build time',
      'It is required for obfuscation to work',
      'It sets the version name users see in the store',
      'It always increases, so an upload can never be rejected as a duplicate',
    ], 3, 'Stores require a strictly increasing build number, and generating it in the pipeline removes the manual step that gets skipped on a hotfix.'),
    q('Your crash-free rate reads 100% but users keep reporting failures. Which hook is most likely missing?', [
      'FlutterError.onError',
      'runZonedGuarded plus PlatformDispatcher.instance.onError, which catch errors outside the framework',
      'setCustomKey breadcrumbs on each screen',
      'A debug symbol upload step',
    ], 1, 'Errors thrown across an async gap or from platform callbacks bypass FlutterError.onError entirely, so they go unreported until the zone and dispatcher handlers are installed.'),
  ],
});
