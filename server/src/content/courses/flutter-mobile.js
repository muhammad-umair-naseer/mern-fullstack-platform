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
        `,
        [
          q('Given final courses = <String>[]; which line is a compile error?', [
            'courses.add("Dart")',
            'courses.first',
            'courses = <String>[]',
            'courses.length',
          ], 2, 'final locks the binding, not the contents, so the list can be mutated but never reassigned.'),
          q('What must be true of a class before it can have a const constructor?', [
            'Every field is final',
            'It has no named constructors',
            'It extends StatelessWidget',
            'All of its fields are nullable',
          ], 0, 'A const instance is baked into the binary at compile time, which is only sound if none of its fields can ever change.'),
          q('What does the cascade operator .. evaluate to?', [
            'The value returned by the method it calls',
            'null',
            'A Future of the object',
            'The object itself, so calls can be chained on it',
          ], 3, 'Discarding the method return value and yielding the receiver is exactly what lets you construct and configure in one expression.'),
        ]
      ),
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
        `,
        [
          q('A screen needs two independent API calls, each taking about a second, before it can render. Fastest correct approach?', [
            'await the first, then await the second',
            'await Future.wait([fetchUser(), fetchCourses()])',
            'Wrap both in compute()',
            'Convert both to Streams and listen',
          ], 1, 'Future.wait starts both immediately and completes when the slower one finishes, so the total is one second rather than two.'),
          q('Why does every mobile network request need a .timeout()?', [
            'The http package throws without one',
            'It retries the request automatically',
            'It reduces data usage',
            'A request that never resolves leaves the loading spinner turning forever',
          ], 3, 'On mobile the common failure is a connection that silently stalls, and only a timeout converts that into an error you can show.'),
          q('When is compute() the right tool?', [
            'A CPU-heavy job such as parsing a very large JSON payload',
            'Any network request, to keep it off the UI thread',
            'Reading a value from shared_preferences',
            'Any function that is marked async',
          ], 0, 'await already yields for I/O; only a tight CPU loop needs to be moved to a separate isolate to stop it dropping frames.'),
        ]
      ),
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
        `,
        [
          q('When build runs again, what makes Flutter update the existing element instead of tearing it down?', [
            'The new widget has the same runtimeType and key as the old one',
            'The widget is const',
            'The widget is a StatefulWidget',
            'The build method returned in under 16ms',
          ], 0, 'Matching runtimeType and key is the diffing rule that lets the persistent element and render object be reused in place.'),
          q('Which of these belongs inside build()?', [
            'Kicking off the first network request',
            'Describing the UI from the current fields and nothing else',
            'Creating an AnimationController',
            'Calling setState when data looks stale',
          ], 1, 'build can run many times a second, so it must be pure and cheap — side effects and object creation belong in initState.'),
          q('You change the value of a top-level const and hot reload shows no difference. What do you do?', [
            'Hot reload a second time',
            'Call setState on the root widget',
            'Delete the build folder',
            'Hot restart, which throws state away and re-runs main',
          ], 3, 'Const values, enums and global initialisers are resolved when main runs, so only a restart picks the new value up.'),
        ]
      ),
        lesson('Records, Patterns, and Switch Expressions', 12, `
Dart 3 added two features you now meet in every modern Flutter codebase: **records**, which let a function return more than one value without a class, and **patterns**, which destructure and match in a single step.

### A record is a tuple that has a type

\`\`\`dart
(int, int) minMax(List<int> xs) => (xs.reduce(min), xs.reduce(max));

final (low, high) = minMax([8, 3, 12]);   // destructured on the way out
\`\`\`

Named fields read better as soon as two values share a type:

\`\`\`dart
({int done, int total}) progress(Course c) =>
    (done: c.completedLessons, total: c.lessonCount);

final p = progress(course);
print('\${p.done} of \${p.total}');
\`\`\`

Records have structural value equality for free — \`(1, 'a') == (1, 'a')\` is \`true\` — which a class only gets once you write \`==\` and \`hashCode\` or generate them.

The line worth holding: a record has no name, so it documents nothing. Use one for a local return that dies within a few lines. The moment a shape crosses a boundary — an API response, a model a widget takes — write the class. A widget whose constructor takes \`({String title, int weeks, bool enrolled})\` is a class that lost its name, and the next person cannot search for it.

### Destructuring

Patterns work anywhere a variable is declared.

\`\`\`dart
final [first, second, ...rest] = courses;                   // list pattern
final {'id': id, 'title': title} = json;                    // map pattern
for (final MapEntry(:key, :value) in prices.entries) { }    // object pattern
\`\`\`

\`:key\` is shorthand for \`key: key\` — bind the field to a variable of the same name.

### if-case: test and bind in one move

This is where patterns earn their keep against untyped JSON.

\`\`\`dart
if (message.data case {'type': 'course', 'id': final String id}) {
  router.go('/course/$id');
}
\`\`\`

Read it as a question: *does this map have a \`type\` of exactly \`course\`, and an \`id\` that is a String?* If any part of the pattern fails, the whole thing fails and the body is skipped — no exception, no null check, no cast. The version without patterns is three nested \`if\`s and an \`as String\` that throws the day the backend starts sending the id as a number.

### switch expressions

A switch that **produces a value** instead of running statements:

\`\`\`dart
final label = switch (status) {
  EnrolStatus.active => 'In progress',
  EnrolStatus.done => 'Completed',
  EnrolStatus.none => 'Not enrolled',
};
\`\`\`

No \`case\`, no \`break\`, no \`return\` — commas and arrows. Because it is an expression it drops straight into a widget tree, where the old statement switch needed a helper method:

\`\`\`dart
Chip(label: Text(switch (course.level) {
  Level.beginner => 'Beginner',
  Level.intermediate => 'Intermediate',
  Level.advanced => 'Advanced',
}))
\`\`\`

Over an enum or a sealed type the compiler checks **exhaustiveness**. Add a fourth \`EnrolStatus\` and every switch that does not handle it fails to compile, with the file and the line. That is the real reason to prefer it over a chain of \`if\`s: the compiler performs the audit you would otherwise do by hand and forget on the third screen.

Guards refine a case with \`when\`:

\`\`\`dart
final tier = switch (weeks) {
  <= 2 => 'Short',
  int w when w <= 8 => 'Standard',
  _ => 'Extended',
};
\`\`\`

\`_\` is the wildcard, and it is also what silently switches exhaustiveness checking off. Writing \`_ => 'Unknown'\` over an enum buys you nothing and costs you the compile error you actually wanted. Use it over open types like \`int\`, where the cases genuinely cannot be listed — never over your own enums.
        `,
        [
          q('When is a record the wrong tool for the job?', [
            'Returning the min and max from a private helper',
            'As the shape passed between your API layer and a screen',
            'Destructuring a MapEntry inside a for loop',
            'Returning two values that are consumed on the next line',
          ], 1, 'A record is anonymous, so a shape that travels between layers loses its name and its documentation — that case wants a real class.'),
          q('data is {"type": "course", "id": 42} and you write if (data case {"type": "course", "id": final String id}). What happens?', [
            'A TypeError is thrown at the cast',
            'id is bound to null',
            'The number is coerced to the string "42"',
            'The pattern fails and the body is simply skipped',
          ], 3, 'A pattern that does not match is a false test, not an error, so the mismatched type quietly skips the block instead of crashing.'),
          q('Why avoid a _ => wildcard case in a switch expression over an enum?', [
            'It disables exhaustiveness checking, so a new enum value compiles silently instead of failing the build',
            'Wildcards are not allowed over enums',
            'It forces the switch back into statement form',
            'It makes the switch slower at runtime',
          ], 0, 'Exhaustiveness is the whole benefit of switching over an enum, and a wildcard catch-all removes the compile error that would have found every unhandled case.'),
        ]
      ),
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
        `,
        [
          q('In a stateful pair, what lives on the widget and what lives on the State?', [
            'Immutable configuration on the widget, mutable data on the State',
            'Everything on the widget; the State only holds build',
            'Everything on the State; the widget is only a marker',
            'Configuration on the State, data on the widget',
          ], 0, 'The widget is recreated on every parent rebuild so it can only hold final config, while the State survives those rebuilds and owns the data.'),
          q('Calling Theme.of(context) in initState throws. Where does that read belong?', [
            'In the constructor',
            'In createState',
            'In didChangeDependencies or build',
            'In dispose',
          ], 2, 'Those are the callbacks the framework re-runs when an inherited widget changes, which is also what keeps the value correct after a theme or size change.'),
          q('Navigating from course A to course B reuses the same widget type and still shows A data. What is missing?', [
            'A call to setState inside build',
            'A didUpdateWidget that reloads when widget.courseId has changed',
            'A dispose that clears the old data',
            'A const constructor on the screen',
          ], 1, 'The State is reused when the parent rebuilds with new configuration, so only didUpdateWidget can notice the id changed and refetch.'),
        ]
      ),
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
        `,
        [
          q('In a Row, which axis does crossAxisAlignment control?', [
            'The horizontal axis, the direction children are laid out',
            'Whichever axis has the most free space',
            'It controls the spacing between children',
            'The vertical axis, perpendicular to the layout direction',
          ], 3, 'Main is the direction of layout — horizontal in a Row — so cross is the other one, and swapping the two is the usual reason alignment looks wrong.'),
          q('What is the difference between Expanded and Flexible?', [
            'Flexible must fill its share; Expanded may be smaller',
            'Expanded must fill its share of the free space; Flexible may use less',
            'They are identical aliases',
            'Expanded works only in a Column, Flexible only in a Row',
          ], 1, 'Expanded forces the child to occupy its whole share, while Flexible caps the child without padding it out to fill.'),
          q('A Column inside a dialog stretches to the full height of the screen. What fixes it?', [
            'mainAxisSize: MainAxisSize.min',
            'crossAxisAlignment: CrossAxisAlignment.stretch',
            'Wrapping the Column in Expanded',
            'Wrapping each child in Flexible',
          ], 0, 'A Column takes all the height offered by default, and MainAxisSize.min makes it hug its children instead.'),
        ]
      ),
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
        `,
        [
          q('Container(width: 300) inside a Column with CrossAxisAlignment.stretch renders full width. Why?', [
            'Container ignores width when it has a color',
            'width is only respected inside a Row',
            'The parent passed a tight constraint, which leaves the child no choice of size',
            'The Container needs a key to keep its size',
          ], 2, 'Constraints go down and sizes come up, so when min and max width are equal the child cannot pick anything else.'),
          q('Every child of a Stack is wrapped in Positioned. What size does the Stack take?', [
            'Zero, because nothing occupies space',
            'The size of the largest positioned child',
            'It throws a layout assertion',
            'The largest size its parent allows, because no unpositioned child measures it',
          ], 3, 'Only unpositioned children size a Stack, so with none of them it simply expands to fill whatever it was offered.'),
          q('A card must show one column on a phone and two inside a tablet side panel. Which measurement is correct?', [
            'MediaQuery.sizeOf(context).width, because it is the real screen size',
            'LayoutBuilder constraints, because they describe the space this widget was given',
            'The device pixel ratio',
            'The orientation reported by MediaQuery',
          ], 1, 'MediaQuery describes the whole window, so a component inside a split view or dialog only gets the right answer from its own constraints.'),
        ]
      ),
        lesson('Scrolling Lists, Grids, and Slivers', 14, `
\`ListView.builder\` covers most screens. The rest of the scrolling API is worth learning properly, because every alternative to it is a specific failure you will otherwise ship.

### Separators and grids

\`\`\`dart
ListView.separated(
  itemCount: courses.length,
  separatorBuilder: (_, __) => const Divider(height: 1),
  itemBuilder: (_, i) => CourseTile(course: courses[i]),
)
\`\`\`

\`separated\` is still lazy — it is \`builder\` with a divider between items, and it saves you from a \`Column\` of alternating rows and dividers.

\`\`\`dart
GridView.builder(
  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
    maxCrossAxisExtent: 220,        // as many columns as fit, not a fixed count
    childAspectRatio: 3 / 4,
    mainAxisSpacing: 12,
    crossAxisSpacing: 12,
  ),
  itemCount: courses.length,
  itemBuilder: (_, i) => CourseCard(course: courses[i]),
)
\`\`\`

Prefer \`maxCrossAxisExtent\` to \`crossAxisCount: 2\`. A fixed count looks right on the phone you develop on, shows two enormous cards on a tablet, and squashes both on a small handset in landscape. An extent adapts by itself.

### Keys make state follow the item

Flutter matches children by position. In a list that is only ever appended to, that is fine. In one that is filtered, sorted, or has items removed, a stateful row keeps the state of whatever *used* to be at that index — the wrong checkbox stays ticked, the wrong tile stays expanded.

\`\`\`dart
itemBuilder: (_, i) => CourseTile(key: ValueKey(courses[i].id), course: courses[i]),
\`\`\`

Use a stable id, never the index — a key of \`ValueKey(i)\` is exactly the positional matching you were trying to escape.

### Pull to refresh

\`\`\`dart
RefreshIndicator(
  onRefresh: () => context.read<CourseController>().refresh(),
  child: ListView.builder(
    physics: const AlwaysScrollableScrollPhysics(),   // gesture exists even when short
    itemCount: courses.length,
    itemBuilder: (_, i) => CourseTile(course: courses[i]),
  ),
)
\`\`\`

The spinner runs until the Future you return completes, so \`onRefresh: () async => controller.refresh()\` without an \`await\` inside makes the indicator vanish instantly while the data is still loading. Return the Future that finishes when the new data is in.

### Infinite scroll without a fetch storm

\`\`\`dart
final _scroll = ScrollController();
bool _loading = false;
bool _end = false;

void _onScroll() {
  if (_loading || _end) return;
  final p = _scroll.position;
  if (p.pixels < p.maxScrollExtent - 400) return;   // start early, not at the bottom
  _loadNextPage();
}

@override
void dispose() {
  _scroll.removeListener(_onScroll);
  _scroll.dispose();
  super.dispose();
}
\`\`\`

That listener fires on every scroll frame. Without the \`_loading\` guard, a single flick sends the same page request twenty times and the list fills with duplicated rows; without \`_end\`, you keep asking for page 12 of an 11-page result forever. Set \`_loading\` **before** the await and clear it in a \`finally\`.

### Slivers: one scroll, several kinds of content

\`\`\`dart
CustomScrollView(
  slivers: [
    SliverAppBar(
      expandedHeight: 220,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(title: Text(course.title)),
    ),
    const SliverToBoxAdapter(child: CourseHeader()),
    SliverPadding(
      padding: const EdgeInsets.all(16),
      sliver: SliverList.builder(
        itemCount: lessons.length,
        itemBuilder: (_, i) => LessonRow(lesson: lessons[i]),
      ),
    ),
  ],
)
\`\`\`

Every direct child of \`slivers:\` must itself be a sliver. Drop a \`Padding\` or a \`Column\` in there and layout throws *"A RenderViewport expected a child of type RenderSliver but received a child of type RenderBox"*. Wrap ordinary widgets in \`SliverToBoxAdapter\`, and note that \`SliverPadding\` takes its child under the name \`sliver:\`.

Reach for a \`CustomScrollView\` the moment a screen needs a header that scrolls away with the list. The \`Column\` with a header plus \`Expanded(child: ListView(...))\` from the last lesson gives you a header that stays nailed to the top, which is a different design — pick the one you meant.
        `,
        [
          q('Why does a ScrollController pagination listener need a _loading flag?', [
            'ScrollController requires it before dispose',
            'It stops the list from rebuilding while scrolling',
            'The listener fires on every scroll frame, so without it the same page is requested repeatedly and rows duplicate',
            'It keeps the scroll position after a rebuild',
          ], 2, 'Scroll notifications arrive many times per second near the threshold, so an unguarded handler fires the same request over and over.'),
          q('You place a Padding widget directly in a CustomScrollView slivers list. What happens?', [
            'A layout error — every child of slivers must be a sliver, so it needs SliverToBoxAdapter',
            'It renders but the padding is ignored',
            'It scrolls independently of the other slivers',
            'Nothing; Padding is already a sliver',
          ], 0, 'A viewport can only lay out RenderSliver children, so a box widget has to be adapted before it can sit in the slivers list.'),
          q('RefreshIndicator onRefresh returns a Future. What does that Future control?', [
            'Whether the list rebuilds',
            'How long the spinner stays visible before it retracts',
            'The scroll physics of the child',
            'Retry behaviour on a network failure',
          ], 1, 'The indicator retracts as soon as that Future completes, so returning one that finishes early hides the spinner while data is still loading.'),
        ]
      ),
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
        `,
        [
          q('After a successful login, which call stops the back button returning to the login form?', [
            'Navigator.push with a MaterialPageRoute',
            'Navigator.pushReplacement',
            'Navigator.pop',
            'Navigator.pushNamed',
          ], 1, 'pushReplacement swaps the login route off the stack for the home route, so there is nothing behind to go back to.'),
          q('Why is go_router redirect better than an auth check in each screen initState?', [
            'One rule covers every route, including a cold start from a deep link',
            'redirect runs on a background isolate',
            'initState cannot read any context',
            'It removes the need for a login screen',
          ], 0, 'Auth gating in one callback cannot be forgotten on a screen, which is exactly what happens when the check is copied into every initState.'),
          q('Navigator.of(context) throws "No Navigator in context". What went wrong?', [
            'The route table was not registered',
            'The app uses go_router instead of routes',
            'The context came from the widget that built MaterialApp, so no Navigator is above it',
            'The screen is a StatelessWidget',
          ], 2, 'Navigator.of walks up from the given context, and the widget that creates MaterialApp sits above the Navigator rather than inside it.'),
        ]
      ),
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
        `,
        [
          q('Which of these is ephemeral state that setState handles completely?', [
            'Whether the password field is currently masked',
            'The signed-in user',
            'The shopping cart',
            'The cached list of courses',
          ], 0, 'It is used by exactly one widget and nothing else needs to read it, which is the definition of ephemeral state.'),
          q('Two sibling widgets need the same filter value. What is the correct first move?', [
            'Store it in a global variable',
            'Add a state management package',
            'Give each sibling its own copy and keep them in sync',
            'Lift it into their nearest common parent and pass a callback down',
          ], 3, 'Lifting gives the value exactly one owner, with data flowing down as arguments and events flowing up as callbacks.'),
          q('What is Provider actually built on?', [
            'A global singleton registry',
            'A separate isolate holding app state',
            'InheritedWidget, the same mechanism behind Theme.of and MediaQuery.of',
            'Code generation over your model classes',
          ], 2, 'Provider is a thin wrapper over an inherited lookup plus change notification, which is why it rebuilds only the widgets that read the value.'),
        ]
      ),
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
        `,
        [
          q('What happens if you call context.watch<CartModel>() inside an onPressed callback?', [
            'It throws — watch is only valid while a widget is building',
            'It works, but the value never updates',
            'It rebuilds the whole application',
            'It returns null outside build',
          ], 0, 'watch registers a dependency for the widget currently being built, and there is no build in progress inside a callback.'),
          q('A large widget rebuilds whenever any field of the model changes, but it only displays count. Cheapest fix?', [
            'Convert it to a StatefulWidget',
            'Use context.read instead of context.watch',
            'Move the provider higher in the tree',
            'context.select<CartModel, int>((m) => m.count)',
          ], 3, 'select subscribes to one derived value, so the widget rebuilds only when that value actually changes.'),
          q('Which structural weakness of Provider does Riverpod remove?', [
            'Providers are top-level variables read through a ref, so no BuildContext and no runtime type lookup are involved',
            'It renders the widget tree on a second thread',
            'It removes the need for immutable state',
            'It persists state to disk automatically',
          ], 0, 'Type-based lookup through the tree is what produces ProviderNotFoundException and blocks reads from plain Dart code, and Riverpod replaces both.'),
        ]
      ),
        lesson('Tabs, Bottom Navigation, and Nested Navigators', 13, `
A bottom bar is not navigation in the \`Navigator\` sense — nothing is pushed and nothing pops. You are swapping the body of one screen, and every interesting question is about what happens to the tabs you are not looking at.

### The shell

\`\`\`dart
class _ShellState extends State<Shell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) => Scaffold(
        body: IndexedStack(
          index: _index,
          children: const [CoursesTab(), SearchTab(), ProfileTab()],
        ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: _index,
          onDestinationSelected: (i) => setState(() => _index = i),
          destinations: const [
            NavigationDestination(icon: Icon(Icons.school), label: 'Courses'),
            NavigationDestination(icon: Icon(Icons.search), label: 'Search'),
            NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      );
}
\`\`\`

The obvious version — \`body: _pages[_index]\` — destroys the tab you leave. Scroll position, half-typed search text, and any in-flight request go with it, and the user notices on the very first switch back. \`IndexedStack\` builds all three and keeps them mounted, painting one.

That is not free. Three subtrees stay in memory and all three \`initState\` methods run at startup, so a tab that fires a heavy request on open should not be in the stack from the first frame. Either lazily insert it on first selection, or accept the rebuild for that one tab.

| Approach | Tab state | Cost |
|---|---|---|
| \`_pages[_index]\` | Lost on every switch | Cheapest, and almost always wrong |
| \`IndexedStack\` | Kept | Every tab built and retained |
| Navigator per tab | Kept, with its own push stack | Most code, best behaviour |

### Tabs inside a tab

\`\`\`dart
DefaultTabController(
  length: 2,                                  // must equal the children count
  child: Column(
    children: [
      const TabBar(tabs: [Tab(text: 'Lessons'), Tab(text: 'Notes')]),
      Expanded(child: TabBarView(children: [LessonList(), NotesList()])),
    ],
  ),
)
\`\`\`

A \`length\` that disagrees with the number of children fails an assertion the moment you swipe. \`TabBarView\` also disposes pages you swipe away from, so a tab keeps its scroll offset only if its State asks to be kept:

\`\`\`dart
class _NotesListState extends State<NotesList> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);      // required by the mixin — omitting it is the bug
    return ListView(children: notes);
  }
}
\`\`\`

Forgetting that \`super.build(context)\` call is the whole failure: no error, no warning, and the state is still thrown away.

### A stack per tab

Pushing a course detail from the Courses tab should keep the bottom bar visible and return into that tab. That needs a \`Navigator\` per branch:

\`\`\`dart
final _tabKeys = List.generate(3, (_) => GlobalKey<NavigatorState>());

Navigator(
  key: _tabKeys[i],
  onGenerateRoute: (_) => MaterialPageRoute(builder: (_) => const CoursesTab()),
)
\`\`\`

Now the Android back button has to be told about it, or the system pops the *root* navigator and closes the app while the user expected to step back one detail screen:

\`\`\`dart
PopScope(
  canPop: false,
  onPopInvokedWithResult: (didPop, _) {
    if (didPop) return;
    final nav = _tabKeys[_index].currentState!;
    if (nav.canPop()) return nav.pop();          // inside the tab
    if (_index != 0) return setState(() => _index = 0);  // back to the first tab
    SystemNavigator.pop();                       // really leave the app
  },
  child: shell,
)
\`\`\`

\`PopScope\` replaced \`WillPopScope\`; the inversion to \`canPop: false\` plus an explicit handler is what makes predictive back work on Android 14.

### go_router already does this

If the app uses \`go_router\` from the first lesson of this chapter, use \`StatefulShellRoute.indexedStack\`: each branch gets its own navigator and its own stack, and a deep link lands inside the correct branch with a working back stack. What you must not do is run a hand-rolled shell *and* go_router in the same app — two navigators disagreeing about the stack is a bug class nobody enjoys.
        `,
        [
          q('Why use IndexedStack for the body of a bottom navigation shell?', [
            'It animates between tabs automatically',
            'NavigationBar requires it',
            'It keeps every tab mounted, so scroll position and typed text survive a switch',
            'It builds tabs lazily, so startup is faster',
          ], 2, 'IndexedStack paints one child while keeping them all in the tree, which is exactly what preserves each tab state.'),
          q('You mix in AutomaticKeepAliveClientMixin and return true from wantKeepAlive, but state is still lost. What is missing?', [
            'The call to super.build(context) at the top of build',
            'A GlobalKey on the tab',
            'wantKeepAlive must be a field, not a getter',
            'The TabBarView needs a ScrollController',
          ], 0, 'The mixin does its registration inside super.build, so skipping that call leaves the keep-alive silently inactive.'),
          q('On Android, back closes the app instead of popping a detail screen inside the Courses tab. What is missing?', [
            'A Navigator.pop call in each detail screen',
            'A PopScope that pops the active tab nested navigator before allowing the app to close',
            'onGenerateRoute on the root Navigator',
            'A larger IndexedStack children list',
          ], 1, 'The system back gesture reaches the root navigator, so the shell has to intercept it and forward the pop to the nested navigator of the current tab.'),
        ]
      ),
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
        `,
        [
          q('Why parse a count as (json["weeks"] as num?)?.toInt() rather than json["weeks"] as int?', [
            'It is measurably faster',
            'The http package returns all numbers as num',
            'JSON has a single number type, so a value serialised as 8.0 arrives as a double and a direct int cast throws',
            'It converts null into zero automatically',
          ], 2, 'The cast only fails once the backend emits the value with a decimal point, which is why this crash usually appears long after the code was written.'),
          q('Which four states must a data-backed screen be able to render?', [
            'Loading, error, empty, and data',
            'Loading and data',
            'Success and failure',
            'Cached, fresh, stale, and expired',
          ], 0, 'Shipping only the data branch is what produces the blank screen users report as the app being broken.'),
          q('Why build request URLs with Uri.https instead of string concatenation?', [
            'http.get refuses plain strings',
            'It is shorter to write',
            'It caches the parsed host',
            'It percent-encodes query values, so a search for "c++ & dart" is not a malformed request',
          ], 3, 'Encoding query parameters correctly is the whole job of Uri, and hand-built strings break on the first ampersand or space.'),
        ]
      ),
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
        `,
        [
          q('Where must the GlobalKey<FormState> be created?', [
            'Inside build, so it always matches the latest fields',
            'As a field on the State object, created once',
            'In dispose',
            'On the StatefulWidget itself',
          ], 1, 'A new key on every rebuild means a new form state, so validate() quietly does nothing and error messages disappear as the user types.'),
          q('What does AutovalidateMode.onUserInteraction do that always does not?', [
            'It validates only when submit is pressed',
            'It skips validators for optional fields',
            'It waits until a field has been touched before showing errors, instead of marking an untouched empty form as wrong',
            'It disables validation on password fields',
          ], 2, 'Errors after interaction give fast feedback without telling the user off for a form they have not filled in yet.'),
          q('Why disable the submit button while _submitting is true?', [
            'A double tap would send the request twice and create two accounts',
            'It saves battery on slow networks',
            'Validators cannot run while a request is in flight',
            'It is required before calling Navigator.pushReplacement',
          ], 0, 'The flag is the only thing between an impatient double tap and two identical POSTs.'),
        ]
      ),
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
        `,
        [
          q('What is true of every shared_preferences getter?', [
            'It throws when the key is unset',
            'It returns an empty string when unset',
            'It blocks the UI thread',
            'It can return null, so a default with ?? is always needed',
          ], 3, 'The key may simply not exist yet on a first launch, and the getter reports that as null rather than a stored value.'),
          q('You add a column in schema version 2 but only inside onUpgrade, not in the CREATE TABLE. Who breaks?', [
            'Existing users, on the next launch',
            'Every new install, on the first insert',
            'Nobody; SQLite adds missing columns',
            'Only users who clear app data',
          ], 1, 'onCreate runs only on a fresh install, so a column added solely in the migration is missing from every newly created database.'),
          q('What does the cache-then-network pattern buy you?', [
            'Guaranteed fresh data on every screen',
            'Lower server costs and nothing else',
            'Content on screen immediately at cold start, refreshed quietly behind it',
            'The ability to skip error handling',
          ], 2, 'Showing the cached copy first removes the launch spinner, which is the biggest perceived-performance win available to a mobile app.'),
        ]
      ),
        lesson('Authenticated Requests and Token Refresh', 14, `
Every screen after login needs the same header, the same 401 handling, and the same logout. Written at each call site that is fifty copies of one bug. It belongs in the client.

### One client, configured once

\`\`\`dart
final dio = Dio(BaseOptions(
  baseUrl: apiUrl,
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 15),
  headers: {'Accept': 'application/json'},
));
\`\`\`

The \`http\` package is fine for a handful of calls. The moment you need interceptors — and auth is that moment — \`dio\` earns its place.

### Attaching the token

\`\`\`dart
class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokens);
  final TokenStore _tokens;

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler h) async {
    if (options.extra['skipAuth'] != true) {
      final access = await _tokens.access();
      if (access != null) options.headers['Authorization'] = 'Bearer $access';
    }
    h.next(options);
  }
}
\`\`\`

That \`skipAuth\` flag matters more than it looks. Login and refresh must **not** carry the expired access token: a server that rejects the whole request on a bad Authorization header will fail your refresh with the very 401 you are trying to fix.

The access token can live in memory and be re-read at startup; the refresh token goes in \`flutter_secure_storage\` and nowhere else, by the rule from earlier in this chapter.

### Refreshing exactly once

\`\`\`dart
Completer<String?>? _refreshing;

Future<String?> _refresh() {
  final inFlight = _refreshing;
  if (inFlight != null) return inFlight.future;   // join the one already running

  final completer = Completer<String?>();
  _refreshing = completer;
  _callRefreshEndpoint()
      .then(completer.complete)
      .catchError((_) => completer.complete(null))
      .whenComplete(() => _refreshing = null);
  return completer.future;
}

@override
Future<void> onError(DioException e, ErrorInterceptorHandler h) async {
  final req = e.requestOptions;
  if (e.response?.statusCode != 401 || req.extra['retried'] == true) {
    return h.next(e);
  }

  final token = await _refresh();
  if (token == null) {
    await _tokens.clear();
    onSessionExpired();               // one place decides to show the login screen
    return h.next(e);
  }

  req.extra['retried'] = true;        // one retry, ever
  req.headers['Authorization'] = 'Bearer $token';
  h.resolve(await dio.fetch(req));
}
\`\`\`

Two guards, two production bugs avoided.

**The refresh storm.** A screen fires five requests, the access token expired an hour ago, and all five return 401 within the same 200 milliseconds. Without the shared \`Completer\` you send five refresh calls. Most backends rotate the refresh token on use, so four of them present a token that was invalidated microseconds earlier, the server reads that as a replay, and the user is signed out for the crime of opening a screen. This never reproduces by hand, because a human taps one thing at a time.

**The infinite loop.** The \`retried\` flag means a 401 on the replayed request falls through to the caller instead of triggering another refresh, another retry, and a spinner that never stops.

### Logging out is a checklist

- Clear access and refresh tokens from secure storage.
- Drop any in-memory copy — a static field survives a route change.
- Delete cached data. The next user on that device must not see the previous one's course list.
- Deregister the push token with your server, or their notifications keep arriving.
- \`pushAndRemoveUntil\` to login, so back cannot reach an authenticated screen.

### Test the part you cannot click

\`\`\`dart
test('two concurrent 401s trigger exactly one refresh', () async {
  final api = FakeApi(refreshCalls: 0);
  await Future.wait([client.get('/a'), client.get('/b')]);
  expect(api.refreshCalls, 1);
});
\`\`\`

One test, five lines, and it covers the failure mode that concurrency makes invisible in manual testing.
        `,
        [
          q('Five requests return 401 at the same moment. What does a shared Completer around the refresh prevent?', [
            'Retrying requests that are not idempotent',
            'A receive timeout on the slowest request',
            'The access token being written to secure storage twice',
            'Five parallel refresh calls, four of which present a rotated-away token and sign the user out',
          ], 3, 'Backends that rotate refresh tokens invalidate the old one immediately, so only the first of five concurrent refreshes can succeed unless they all share one call.'),
          q('Why mark a request as retried before replaying it with the new token?', [
            'So the analytics layer can count retries',
            'So a 401 on the replay falls through instead of triggering another refresh forever',
            'Because dio rejects a request object that is sent twice',
            'To skip the auth interceptor on the second attempt',
          ], 1, 'Without the flag the replayed request re-enters the same error handler, producing an endless refresh-and-retry loop.'),
          q('Which request must bypass the Authorization header the interceptor adds?', [
            'Every GET request',
            'Any request that returns a list',
            'The refresh and login calls themselves',
            'File uploads',
          ], 2, 'Sending the expired access token on the refresh call invites the server to reject the request with the very 401 the refresh exists to resolve.'),
        ]
      ),
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
        `,
        [
          q('Why does the confirm-delete helper end with ?? false?', [
            'showDialog returns null when the user dismisses it by tapping outside, and treating that as a yes deletes data they never agreed to lose',
            'Dart requires a default on every await',
            'CupertinoAlertDialog cannot return a value',
            'It converts the Future into a synchronous bool',
          ], 0, 'A barrier dismissal completes the future with null, so the fallback is what stops an accidental tap being read as confirmation.'),
          q('Which omission will get an iOS build rejected outright?', [
            'Using Material widgets instead of Cupertino ones',
            'Shipping Roboto rather than SF Pro',
            'Requesting a permission with no usage-description string in Info.plist',
            'Not supporting landscape orientation',
          ], 2, 'Apple requires a plain-English reason for every permission the app asks for, and its absence is an automatic rejection.'),
          q('Which of these does Flutter already adapt per platform without you branching?', [
            'Runtime permission prompts',
            'Page transitions, scroll physics, and the default font',
            'Secure storage backends',
            'Deep link configuration',
          ], 1, 'MaterialApp and MaterialPageRoute swap the transition, the overscroll behaviour, and the typeface for you.'),
        ]
      ),
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
        `,
        [
          q('Why must performance measurements come from profile mode?', [
            'DevTools does not attach in debug mode',
            'const optimisations only apply in profile mode',
            'Release builds strip the timeline',
            'Debug builds are far slower by design, so timings taken there mean nothing',
          ], 3, 'Debug mode trades speed for assertions and hot reload, so any conclusion drawn from its frame times is about the build, not your code.'),
          q('The timeline shows a short UI bar and a very tall raster bar. What should you look at?', [
            'Your build methods and widget count',
            'Expensive clipping, shadows, or opacity that the GPU has to composite',
            'JSON parsing in the repository',
            'The number of items in the list',
          ], 1, 'The raster bar is GPU work, so the cost is in what you asked it to paint rather than in the Dart that described it.'),
          q('Which widget-test assertion is worth writing?', [
            'That a Padding widget has exactly 16 pixels',
            'That the tree is no more than eight widgets deep',
            'That the error view and its Retry button appear when the API fails',
            'That every child in a list is const',
          ], 2, 'Behaviour assertions survive design changes and catch real regressions, while assertions about padding break on every tweak and catch nothing.'),
        ]
      ),
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
        `,
        [
          q('Why does Play prefer an app bundle over a universal APK?', [
            'Bundles are signed automatically by Gradle',
            'Only bundles can be obfuscated',
            'Google generates per-device APKs from it, so each user downloads only the architecture, density and languages they need',
            'APK uploads are no longer accepted for testing tracks',
          ], 2, 'Splitting by device commonly cuts 15 to 20 percent off the download compared with one universal APK.'),
          q('Is String.fromEnvironment a safe place for a secret API key?', [
            'Yes, the value is encrypted in the binary',
            'No — it is compiled into the binary, which anyone can unpack and read',
            'Yes, provided the build is obfuscated',
            'Only on iOS, where the binary is encrypted by the store',
          ], 1, 'Compile-time constants are just bytes in the app, so anything that must stay secret has to live on your server.'),
          q('Which of these can never be changed once the app is published?', [
            'The app display name',
            'The app icon',
            'The version name shown to users',
            'The package name and bundle identifier',
          ], 3, 'The identifier is the identity of the listing itself, so getting it wrong means publishing a second, unrelated app.'),
        ]
      ),
        lesson('Accessibility and Localisation', 13, `
One of these decides whether a portion of your users can use the app at all; the other decides which markets you can sell in. Both are cheap now and miserable to retrofit.

### What a screen reader actually sees

Flutter builds a semantics tree alongside the widget tree, and TalkBack and VoiceOver read that, not your pixels. Material widgets populate it — \`Text\` announces its string, \`ElevatedButton\` announces "button". Icon-only controls announce nothing useful:

\`\`\`dart
IconButton(
  icon: const Icon(Icons.bookmark_border),
  tooltip: 'Save course',            // also becomes the semantics label
  onPressed: _save,
)

Semantics(
  label: 'Course progress, 4 of 12 lessons complete',
  excludeSemantics: true,            // hide the decorative children underneath
  child: const ProgressRing(done: 4, total: 12),
)
\`\`\`

A user swiping through an app bar that says "button, button, button" cannot use it. Two more that come up constantly: wrap a label-and-value pair in \`MergeSemantics\` so it is read as one item rather than two, and give a tappable \`Container\` \`Semantics(button: true)\` so it is announced as something you can activate.

Switch TalkBack on and complete your own signup flow with the screen off. It takes five minutes and finds everything.

### Text that grows

Users can push text to 200%. Anything with a fixed height around text clips it:

\`\`\`dart
SizedBox(height: 48, child: Text(title))    // clips at large text sizes
ConstrainedBox(
  constraints: const BoxConstraints(minHeight: 48),
  child: Text(title),
)
\`\`\`

The fix is a minimum, not a fixed size — let the box grow. What you must not do is silence the problem with \`TextScaler.noScaling\`; that repairs your layout by breaking someone's eyesight. While you are there: 48x48 logical pixels is the minimum tap target, and body text needs 4.5:1 contrast. The \`onSurface\` and \`onPrimary\` colours from your \`ColorScheme\` already clear it — the grey you picked by eye usually does not.

### Localisation, wired properly

\`\`\`yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: any
flutter:
  generate: true
\`\`\`

\`\`\`json
// lib/l10n/app_en.arb
{
  "enrolled": "{count, plural, =0{No courses} =1{1 course} other{{count} courses}}",
  "@enrolled": { "placeholders": { "count": { "type": "int" } } }
}
\`\`\`

\`\`\`dart
MaterialApp(
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
);

Text(AppLocalizations.of(context)!.enrolled(courses.length));
\`\`\`

The plural syntax exists because \`'$n courses'\` is already wrong in English at n = 1, and wrong in a different way in Polish, which has three plural forms. The same reasoning kills string concatenation: \`greeting + user.name\` cannot be translated into a language that puts the name first, so pass a placeholder and let the translator move it.

### Right to left

\`\`\`dart
padding: const EdgeInsetsDirectional.only(start: 16, end: 8),
alignment: AlignmentDirectional.centerStart,
\`\`\`

Use the directional variants everywhere. \`EdgeInsets.only(left: 16)\` is still on the left in Arabic, so your layout mirrors and one stubborn padding does not. Preview it without changing device language:

\`\`\`dart
Directionality(textDirection: TextDirection.rtl, child: MyScreen())
\`\`\`

### Dates and numbers belong to the locale

\`\`\`dart
DateFormat.yMMMd(locale).format(course.startsAt);
NumberFormat.currency(locale: locale, symbol: 'Rs ').format(price);
\`\`\`

Hardcoding \`'MM/dd/yyyy'\` produces \`03/04\`, which is 4 March to most of the world and 3 April to the United States. Nobody reports this bug; they just book the wrong day.
        `,
        [
          q('Your app bar is three IconButtons with no tooltip. What does a screen reader announce?', [
            'The name of each icon asset',
            'Just "button" for each one, which is why they need a tooltip or Semantics label',
            'Nothing at all, because icons are decorative',
            'The onPressed handler name',
          ], 1, 'An icon carries no text, so the semantics node has a role but no label until you supply one through tooltip or Semantics.'),
          q('A title clips inside SizedBox(height: 48) once the user raises text size. Best fix?', [
            'Wrap the Text in FittedBox and shrink it',
            'Set textScaler: TextScaler.noScaling on that subtree',
            'Add maxLines: 1 with an ellipsis',
            'Replace the fixed height with a minHeight constraint so the box grows',
          ], 3, 'A minimum keeps the tap target while letting the row expand, whereas the other options preserve the layout by hiding or shrinking the user requested text.'),
          q('Why express a count with an ICU plural in the ARB file instead of writing "$n courses"?', [
            'It renders faster than interpolation',
            'ARB files cannot contain interpolation',
            'Plural rules differ by language — Polish has three forms — so one concatenated string cannot be translated correctly',
            'It avoids a null check on n',
          ], 2, 'The plural message lets each translation supply its own forms, which no amount of string concatenation in Dart can do.'),
        ]
      ),
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
        `,
        [
          q('What does an AnimatedContainer need in order to animate?', [
            'An AnimationController',
            'A TickerProvider mixin on the State',
            'Nothing but a duration and different values on the next build',
            'A Tween and a CurvedAnimation',
          ], 2, 'Implicit widgets remember their previous values and interpolate to the new ones, so an ordinary setState becomes the animation.'),
          q('What does "_PulseState was disposed with an active Ticker" tell you?', [
            'vsync was set to the wrong provider',
            'The AnimationController was never disposed in dispose()',
            'The animation duration exceeds one second',
            'The widget was rebuilt during an animation',
          ], 1, 'A controller bound to a ticker keeps consuming frames until it is disposed, and the framework asserts when its State goes away first.'),
          q('A list screen throws "There are multiple heroes that share the same tag". What is the fix?', [
            'Remove the Hero from the detail screen',
            'Wrap each card in a GlobalKey',
            'Give each Hero a unique key',
            'Fold the item id into the tag, such as cover-42',
          ], 3, 'Hero matching is by tag, so every card claiming the same literal tag makes the pairing ambiguous — unique tags per item resolve it.'),
        ]
      ),
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
        `,
        [
          q('Which values can cross a MethodChannel?', [
            'Any Dart object that implements toString',
            'Strings only',
            'The standard types — null, bool, int, double, String, byte lists, List and Map — so your own class must be encoded as a map',
            'Anything annotated with @pragma("vm:entry-point")',
          ], 2, 'The standard message codec understands a fixed set of types, which is why the toJson from the data chapter is reused here.'),
          q('When is writing your own platform channel the right call?', [
            'Whenever you need any native capability',
            'When the capability is proprietary, or the only published plugin is unmaintained',
            'When the plugin you found has fewer than a thousand likes',
            'Whenever the app targets both Android and iOS',
          ], 1, 'A published plugin already handles devices you cannot test on, so writing native code is worth it only when nothing usable exists.'),
          q('You need a continuous feed of sensor readings from native code. Which mechanism?', [
            'A MethodChannel polled on a Timer',
            'A BasicMessageChannel with a JSON codec',
            'A platform view',
            'An EventChannel, which arrives in Dart as a Stream',
          ], 3, 'A MethodChannel is one request and one reply, while an EventChannel is designed for a sequence of values over time.'),
        ]
      ),
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
        `,
        [
          q('Why must the background message handler be a top-level or static function?', [
            'Dart requires it for any async function',
            'It is only a lint rule',
            'So the obfuscator can rename it safely',
            'It runs in its own isolate, which shares no memory with your app — no providers, no singletons, no BuildContext',
          ], 3, 'A fresh isolate starts from an entry point rather than from your running app, so it cannot capture anything from it.'),
          q('Where should the id that a notification tap opens come from?', [
            'Parsed out of the notification title',
            'The data payload, alongside an explicit type field',
            'The badge count',
            'The FCM registration token',
          ], 1, 'Display text is written by whoever composes the campaign and will change, while the data payload is a contract you control.'),
          q('An Android App Link opens Chrome instead of your app. Most likely cause?', [
            'The assetlinks.json fingerprint does not match the certificate that signed the installed build',
            'The intent filter uses https rather than http',
            'The app is missing the INTERNET permission',
            'go_router has no route for that path',
          ], 0, 'Verification fails silently and falls back to the browser, and a mismatch between the upload key and the Play signing key is the usual reason.'),
        ]
      ),
        lesson('Gestures and Custom Painting', 13, `
Everything you have tapped so far was a Material widget handling the gesture for you. Underneath sits a blunt pair of APIs: a detector that reports raw pointer events, and a canvas.

### InkWell before GestureDetector

\`\`\`dart
Material(
  color: Theme.of(context).colorScheme.surface,
  child: InkWell(
    onTap: _open,
    borderRadius: BorderRadius.circular(12),
    child: Padding(padding: const EdgeInsets.all(16), child: CourseRow(course: course)),
  ),
)
\`\`\`

\`InkWell\` gives you the platform ripple, keyboard focus, and hover states; \`GestureDetector\` gives you a silent tap. Use the detector only when there is genuinely no feedback to give, or when you need a gesture InkWell has no callback for.

The ripple paints onto the nearest \`Material\` ancestor, so wrapping your row in a \`Container(decoration: BoxDecoration(color: ...))\` hides it — the ink is drawn underneath the opaque decoration. Put the colour on the \`Material\`, or draw the decoration with \`Ink(decoration: ...)\`.

### The tap that does nothing

\`\`\`dart
GestureDetector(
  behavior: HitTestBehavior.opaque,     // without this the empty area is not tappable
  onTap: _open,
  child: SizedBox(
    height: 64,
    width: double.infinity,
    child: Align(alignment: Alignment.centerLeft, child: Text(course.title)),
  ),
)
\`\`\`

A detector only receives pointers that land on something its child painted. Transparent space around a short label is not hit-testable, so taps near the edge do nothing at all — this is the real cause of most "the button only works sometimes" reports. \`HitTestBehavior.opaque\` claims the whole box.

### Drag, then hand off to physics

\`\`\`dart
GestureDetector(
  onHorizontalDragUpdate: (d) {
    _controller.value -= d.primaryDelta! / context.size!.width;   // 0..1
  },
  onHorizontalDragEnd: (d) {
    final v = d.primaryVelocity ?? 0;
    if (v.abs() > 300) {
      _controller.fling(velocity: v > 0 ? -2 : 2);        // let it complete
    } else {
      _controller.value > 0.5 ? _controller.forward() : _controller.reverse();
    }
  },
  child: const SheetBody(),
)
\`\`\`

The drag writes directly to the controller value, so the sheet tracks the finger exactly; on release, velocity decides whether it completes or snaps back. That handover is the difference between a panel that feels native and one that is animated *at* you.

Competing gestures are resolved in the gesture arena, and one rule keeps you out of it: one direction per widget. A horizontal drag inside a vertical list is fine because they claim different axes; two widgets both wanting vertical drags means one of them silently loses.

### Swipe to delete

\`\`\`dart
Dismissible(
  key: ValueKey(course.id),                     // unique and stable
  background: Container(color: Colors.red),
  confirmDismiss: (_) => confirmDelete(context),
  onDismissed: (_) => setState(() => courses.remove(course)),
  child: CourseTile(course: course),
)
\`\`\`

If \`onDismissed\` does not remove the item from the underlying list, Flutter throws *"A dismissed Dismissible widget is still part of the tree"*: the row animated away, the data still says it exists, and the next build puts it straight back.

### CustomPainter

\`\`\`dart
class RingPainter extends CustomPainter {
  RingPainter(this.progress);
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round
      ..color = Colors.cyan;
    canvas.drawArc((Offset.zero & size).deflate(4), -pi / 2, 2 * pi * progress, false, paint);
  }

  @override
  bool shouldRepaint(RingPainter old) => old.progress != progress;
}

CustomPaint(size: const Size.square(72), painter: RingPainter(0.35));
\`\`\`

\`shouldRepaint\` returning \`true\` unconditionally is the standard copy-paste mistake: the arc is repainted on every frame of every unrelated animation on the screen. Compare the fields that actually change. And put a \`RepaintBoundary\` around a painter that animates continuously, so it does not drag the rest of the layer into each repaint.
        `,
        [
          q('Taps near the edge of a GestureDetector wrapping a tall, mostly empty box do nothing. What fixes it?', [
            'behavior: HitTestBehavior.opaque, so the whole box accepts pointers',
            'Replacing the SizedBox with a Column',
            'Giving the detector a ValueKey',
            'Moving the onTap to the child widget',
          ], 0, 'A detector only receives pointers that hit painted content, so transparent space is ignored until the detector claims the whole box.'),
          q('You get "A dismissed Dismissible widget is still part of the tree". Why?', [
            'The Dismissible has no key',
            'confirmDismiss returned false',
            'onDismissed did not remove the item from the list the builder reads',
            'The background widget was omitted',
          ], 2, 'The widget animates out but the next build re-creates it from unchanged data, so the state of the list and the tree disagree.'),
          q('What happens when a CustomPainter returns true from shouldRepaint unconditionally?', [
            'The painter is never repainted',
            'It repaints on every frame that touches its layer, even when nothing it draws has changed',
            'The paint method is skipped in release builds',
            'Flutter throws an assertion in debug mode',
          ], 1, 'shouldRepaint is the only signal that lets Flutter skip the paint, so always returning true forfeits that optimisation.'),
        ]
      ),
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
        `,
        [
          q('What is the dependency rule in a feature-first, layered codebase?', [
            'Data depends on presentation, which depends on domain',
            'Every layer may import core, and core may import every layer',
            'Presentation and data depend on domain, and domain depends on nothing',
            'Features may import each other freely as long as folders match',
          ], 2, 'Keeping domain free of Flutter and of the outer layers is what makes models testable and lets data sources be replaced.'),
          q('Why must nothing above the repository ever see an http.Response?', [
            'So the backend, the cache, or a fake can be swapped without touching UI code',
            'Because http.Response cannot be const',
            'Because it holds a socket that leaks memory',
            'Because the analyzer forbids importing http outside data/',
          ], 0, 'The repository is the seam, and it only stays a seam while status codes and raw maps stop there.'),
          q('Why does the value equality that freezed generates matter in a Flutter app?', [
            'It allows the models to be const',
            'It makes the JSON payload smaller',
            'Riverpod refuses to hold classes without it',
            'Without it two identical Course objects compare unequal, so lists rebuild when nothing actually changed',
          ], 3, 'Identity comparison treats every freshly parsed object as new data, which defeats the rebuild checks further up the tree.'),
        ]
      ),
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
        `,
        [
          q('Why must the symbol upload run in the same CI job that produced the release build?', [
            'The store validates symbols before accepting the bundle',
            'The symbols must match that exact build, and a copy on somebody laptop is not available when a crash arrives',
            'Crashlytics deletes symbols older than a day',
            'Obfuscation only runs when symbols are uploaded',
          ], 1, 'Each build produces its own symbol set, so anything less than an automated upload leaves some releases undecodable.'),
          q('You push and pop one screen ten times and the memory snapshot shows ten live State instances. What does that mean?', [
            'Normal behaviour — Flutter caches recent screens',
            'The garbage collector has not run yet, so it can be ignored',
            'Something is retaining them: an undisposed controller, an uncancelled subscription, or a listener never removed',
            'The screen needs a const constructor',
          ], 2, 'A disposed State should be collectable, so surviving instances mean a live reference is still pointing at each one.'),
          q('Which of these is appropriate to attach to a crash report?', [
            'The course id being viewed and the build flavor',
            'The signed-in user email address',
            'The auth token, to reproduce the request',
            'The contents of the password field',
          ], 0, 'Breadcrumbs should describe what the app was doing, and a crash reporter is a third-party database that must never receive credentials or personal data.'),
        ]
      ),
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
        `,
        [
          q('What problem does --build-number=${{ github.run_number }} solve?', [
            'It sets the version name users see in the store listing',
            'It supplies the ever-increasing build number without anyone having to remember to bump it',
            'It selects the correct signing key for the flavor',
            'It tags the git commit for the release',
          ], 1, 'The run number rises on its own with every pipeline run, which retires the duplicate-build-number rejection for good.'),
          q('Where should the upload keystore live for a CI build?', [
            'Committed under android/ so every runner can reach it',
            'Only in the Play Console, downloaded during the job',
            'Baked into a private Docker image',
            'Base64-encoded in a secret, decoded to disk for the length of the job',
          ], 3, 'The key never belongs in version control, and writing it out per job keeps it out of the repository and off the runner afterwards.'),
          q('Why promote a release to a 5 to 10 percent staged rollout rather than straight to everyone?', [
            'Staged rollouts skip store review',
            'The stores charge less for partial rollouts',
            'A rollout can only be halted while it is below 100 percent, so a bad build reaches a fraction of users',
            'Crash reports are only collected during a staged rollout',
          ], 2, 'Halting is the recovery mechanism, and it stops being available the moment the release is at full distribution.'),
        ]
      ),
        lesson('Analytics and Product Instrumentation', 13, `
Crash reporting tells you what broke. Analytics tells you what people did before they gave up — a different question, and the one your next roadmap argument will be about.

### Instrument a funnel, not everything

Write the question first, then the events that answer it. For a course app: of the people who open a course, how many start lesson one, and how many finish it?

| Event | Parameters | Answers |
|---|---|---|
| \`course_viewed\` | \`course_id\`, \`source\` | Which entry points actually work |
| \`enrol_started\` | \`course_id\` | Interest versus intent |
| \`enrol_completed\` | \`course_id\`, \`price\` | Where the drop-off sits |
| \`lesson_completed\` | \`course_id\`, \`index\` | Whether the content holds attention |
| \`payment_failed\` | \`reason\` | Revenue you are losing silently |

Five events you read beat forty you do not. Instrument the failures too — a funnel that records only successes cannot tell "nobody tried" apart from "everybody tried and it broke".

### The event name is a schema

\`\`\`dart
await FirebaseAnalytics.instance.logEvent(
  name: 'course_viewed',                  // fixed, snake_case, low cardinality
  parameters: {'course_id': course.id, 'source': 'search'},
);
\`\`\`

One rule is expensive to undo: **the name is a fixed label and the varying part is a parameter.** \`logEvent(name: 'course_viewed_42')\` creates one event type per course, exhausts the 500-distinct-event budget in a week, and cannot be grouped back together afterwards. Renaming an event later does not backfill either — you get a gap and two half-series that nobody can join.

### Screen views without touching every screen

\`\`\`dart
class AnalyticsObserver extends NavigatorObserver {
  void _send(Route<dynamic>? route) {
    final name = route?.settings.name;
    if (name == null) return;
    FirebaseAnalytics.instance.logScreenView(screenName: name);
  }

  @override
  void didPush(Route route, Route? previous) => _send(route);

  @override
  void didPop(Route route, Route? previous) => _send(previous);
}

MaterialApp(navigatorObservers: [AnalyticsObserver()], home: const Shell());
\`\`\`

\`didPop\` reports \`previous\` deliberately: after a pop the user is looking at the route underneath, and that is the screen view. Routes with no \`settings.name\` report nothing, so name them when you push — and if you use \`go_router\`, pass the observer through its \`observers:\` list instead.

### Measure the number the user feels

\`\`\`dart
final trace = FirebasePerformance.instance.newTrace('course_list_load');
await trace.start();
final courses = await repo.courses();
trace.setMetric('count', courses.length);
await trace.stop();
\`\`\`

That answers "how long from tap to content, on a mid-range handset on a real network" — a number your simulator on office wifi will never show you. Trace the two or three journeys that decide whether the app feels fast: cold start to first content, search to results, checkout.

### Consent, build mode, and PII

\`\`\`dart
await FirebaseAnalytics.instance.setAnalyticsCollectionEnabled(kReleaseMode && consent);
\`\`\`

Debug and test-device traffic pollutes every metric you will later argue from, so gate it on \`kReleaseMode\`. On iOS, tracking that follows a user across apps needs App Tracking Transparency and an \`NSUserTrackingUsageDescription\` string — a large share of users decline, so nothing important may depend on it. In the EU, consent comes *before* collection, not after.

Never send an email address, a phone number, or raw free text. The user identifier must be the same pseudonymous id you used for crash reports, and search terms are personal data you did not mean to store.

### Then actually look at it

An event nobody reads is a liability: it costs code, review time, and privacy exposure for nothing. Put the funnel on one dashboard, read it weekly, and delete any event that has not answered a question in three months.
        `,
        [
          q('Why is logEvent(name: "course_viewed_42") the wrong shape?', [
            'It creates one event type per course, exhausts the distinct-event limit, and cannot be grouped afterwards',
            'Event names may not contain digits',
            'Parameters are cheaper to send than names',
            'The name must match the screen name exactly',
          ], 0, 'Cardinality belongs in parameters — a name that varies per entity fragments the data into series that can never be recombined.'),
          q('In a NavigatorObserver, why does didPop log the previous route rather than the popped one?', [
            'The popped route has already been disposed',
            'previous is always the root route',
            'After a pop the user is looking at the route underneath, so that is the screen now being viewed',
            'didPop does not receive the popped route',
          ], 2, 'A screen view records what is on screen, and after a pop that is the route the popped one was covering.'),
          q('Which of these is acceptable to send to an analytics service as a user property?', [
            'The signed-in email address',
            'The text the user typed into search',
            'The phone number used at signup',
            'A pseudonymous user id, the same one used for crash reports',
          ], 3, 'Analytics is a third-party database, so identifiers must be pseudonymous and free text or contact details must never leave the device.'),
        ]
      ),
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
      chapter(
      'Testing Beyond the Happy Path',
      'The tests worth writing for a Flutter app, from injected fakes and controllable time to golden images and runs on real hardware.',
      [
      lesson('Fakes, Mocks, and Controllable Time', 13, `
A suite of 140 tests that takes four minutes has already stopped being run before every push. Look at where those minutes go and it is almost never computation. It is a retry policy sleeping for real seconds, a token that expires in real hours, and a \`Future.delayed\` somebody added so an animation would finish.

### Fake, mock, stub: three different jobs

A fake is a working implementation with a shortcut. An in-memory \`CourseLocalStore\` backed by a \`Map\` really stores and returns data, it just never opens a file. A mock records calls so you can assert on them. Reach for one when the interaction *is* the behaviour, for example that a card is charged exactly once.

\`\`\`dart
class MockAnalytics extends Mock implements Analytics {}

test('enrolling logs exactly one event', () async {
  final analytics = MockAnalytics();
  await EnrolController(FakeCourseRepo(), analytics).enrol('course-42');

  verify(() => analytics.log('enrol_started', {'id': 'course-42'})).called(1);
});
\`\`\`

Use fakes for the data layer and mocks for the two or three places where the call itself is the thing you promise. A suite where every collaborator is a mock ends up asserting on the \`when\` stubs you wrote rather than on your app, and it keeps passing after you delete the production method it was meant to protect.

Two mocktail failures that cost people an afternoon each:

| Message | Cause |
|---|---|
| \`type Null is not a subtype of Future<List<Course>>\` | \`thenReturn\` on an async method, which needs \`thenAnswer\` |
| \`Bad state: A test tried to use any()\` | That argument type was never handed to \`registerFallbackValue\` |

One boundary rule: do not mock what you do not own. Rather than a mock \`http.Client\` whose behaviour you invented, use \`MockClient\` from \`package:http/testing\`, a real client with a function where the socket would be.

\`\`\`dart
final client = MockClient((request) async {
  expect(request.headers['Authorization'], 'Bearer stale-token');
  return http.Response('{"error":"expired"}', 401);
});
\`\`\`

### Time is a dependency, so inject it

The token refresh from Chapter 4 compares \`DateTime.now()\` to \`expiresAt\`. Written that way it cannot be tested, and the usual workaround is worse than the gap it covers.

\`\`\`dart
// Broken: adds 61 real seconds to the suite and still proves nothing
final auth = AuthStore(expiresAt: DateTime.now().add(const Duration(seconds: 60)));
await Future.delayed(const Duration(seconds: 61));
expect(await auth.token(), 'refreshed');
\`\`\`

\`package:clock\` replaces the global reader. Production code calls \`clock.now()\`, and the test pins what that returns.

\`\`\`dart
test('refreshes a token that expired while the app was backgrounded', () async {
  await withClock(Clock.fixed(DateTime.utc(2026, 3, 1, 9, 0)), () async {
    final auth = AuthStore(expiresAt: DateTime.utc(2026, 3, 1, 8, 59));
    expect(await auth.token(), 'refreshed');
  });
});
\`\`\`

Timers need \`package:fake_async\`, which runs a zone where the clock moves only when you move it.

\`\`\`dart
test('backs off 1s, 2s, 4s and then gives up', () {
  fakeAsync((async) {
    retry(failingCall, attempts: 4);
    async.elapse(const Duration(seconds: 7));
    expect(async.pendingTimers, isEmpty);
  });
});
\`\`\`

Seven simulated seconds, about two milliseconds of wall clock. The surprise is what that last assertion catches. A \`Timer.periodic\` nobody cancels leaves \`pendingTimers\` non-empty at the end of the test, and that is the same leak that quietly drains a battery in production while every manual check looks fine.

Inside \`testWidgets\` you already have a fake clock: \`tester.pump(const Duration(minutes: 5))\` jumps five minutes forward instantly, so debounce, polling and session timeout logic all become cheap to cover. Code that reads \`DateTime.now()\` directly ignores every one of these tools, which is why the injection matters more than which package you pick.
      `,
        [
          q('You stub a repository with when(() => api.fetchCourses()).thenReturn([]) and the call fails with type Null is not a subtype of Future<List<Course>>. What went wrong?', [
            'The stubbed list has to be growable rather than a const literal',
            'registerFallbackValue was never called for the List<Course> type',
            'An async method needs thenAnswer, because thenReturn hands back a raw value',
            'The class must extend Fake instead of Mock to stub a Future',
          ], 2, 'fetchCourses returns a Future, so the stub has to supply one via thenAnswer; thenReturn gives the caller the list itself and the awaited result comes back null.'),
          q('Why does a suite in which every collaborator is a mock give you weak protection against regressions?', [
            'It asserts on the stub responses you wrote, so it can stay green after the real code is gone',
            'Mocks run slower than fakes because every call has to be recorded',
            'Mocked classes cannot be const, which forces extra widget rebuilds',
            'Mocking libraries refuse to stub more than a handful of methods',
          ], 0, 'A mock returns whatever you told it to return, so the test proves your stubbing is consistent rather than proving the production implementation still behaves.'),
          q('A retry helper waits one, two and four seconds between attempts. What does running it inside fakeAsync change?', [
            'It skips all pending timers, so only the first attempt ever runs',
            'It moves the retries onto a background isolate to keep the suite quick',
            'It swaps the http client out so the requests never leave the machine',
            'The clock only moves when you call elapse, so seven seconds cost milliseconds',
          ], 3, 'fakeAsync installs a zone whose timers fire only as you advance the simulated clock, which is why the test runs instantly and can also assert that no timer was left pending.'),
        ]
      ),
      lesson('Widget Tests for Async and Failure States', 13, `
One test in the \`CourseListScreen\` suite fails about once in twenty CI runs with \`pumpAndSettle timed out\`. Nobody can reproduce it locally, so it gets marked \`skip: true\` and the screen stops being covered. The cause is not flaky hardware. It is a misunderstanding of what the three pump methods do.

### The pump model

\`pump()\` builds and renders exactly one frame. \`pump(duration)\` advances the test clock by that much, then renders one frame. \`pumpAndSettle()\` keeps pumping frames until the scheduler has nothing left queued, and gives up with a timeout after ten minutes of simulated time.

That last one is the trap. A \`CircularProgressIndicator\` schedules a frame forever. If the screen sits in its loading state because your fake never completes, \`pumpAndSettle\` spins until it dies. Use it for finite animations such as a route transition. For anything indeterminate, pump explicit durations.

### Hold the future open on purpose

Chapter 5 asserted the error state after \`pumpAndSettle\`, which skips straight past the loading state. A \`Completer\` lets you stop time in the middle of it.

\`\`\`dart
testWidgets('spinner first, list second', (tester) async {
  final gate = Completer<List<Course>>();
  await tester.pumpWidget(MaterialApp(home: CourseListScreen(repo: FakeRepo(gate.future))));

  await tester.pump();                                   // one frame, still loading
  expect(find.byType(CircularProgressIndicator), findsOneWidget);

  gate.complete([Course(id: '42', title: 'Flutter Layout')]);
  await tester.pump();                                   // future resolves
  await tester.pump();                                   // rebuilt frame is painted

  expect(find.text('Flutter Layout'), findsOneWidget);
  expect(find.byType(CircularProgressIndicator), findsNothing);
});
\`\`\`

The second \`pump\` is the one people forget. Resolving a future schedules a rebuild, it does not perform one. A test that finds nothing straight after \`complete\` or after \`tap\` is nearly always one frame short.

### Failure states are what users actually meet

\`\`\`dart
testWidgets('500 shows retry, and retry issues a second request', (tester) async {
  final repo = FlakyRepo(failuresBeforeSuccess: 1);
  await tester.pumpWidget(MaterialApp(home: CourseListScreen(repo: repo)));
  await tester.pump(const Duration(milliseconds: 50));

  expect(find.text('Server error (500).'), findsOneWidget);

  await tester.tap(find.text('Retry'));
  await tester.pump(const Duration(milliseconds: 50));

  expect(repo.calls, 2);
  expect(find.text('Flutter Layout'), findsOneWidget);
});
\`\`\`

Assert the call count, not just the pixels. A retry button that renders the right thing while firing three requests is a real bug that a text-only assertion waves through.

When the widget is *supposed* to throw, \`tester.takeException()\` claims the error so the test does not fail on it:

\`\`\`dart
expect(tester.takeException(), isA<FormatException>());
\`\`\`

### Errors the harness invents

Two failures come from the test environment rather than your code.

| Symptom | Real cause |
|---|---|
| \`HTTP request failed, statusCode: 400\` | The test \`HttpClient\` answers every request with 400, so \`Image.network\` always fails |
| \`RenderFlex overflowed by 84 pixels\` | The default surface is 800x600 logical pixels, nothing like a phone |

Fix the first by injecting an \`ImageProvider\` or wrapping the body in \`mockNetworkImagesFor\`. Fix the second by sizing the surface to a real device and putting it back afterwards:

\`\`\`dart
tester.view.physicalSize = const Size(1170, 2532);   // iPhone 13
tester.view.devicePixelRatio = 3;
addTearDown(tester.view.reset);
\`\`\`

Skip the teardown and the next test in the file inherits your dimensions, which produces the worst kind of failure: one that depends on file ordering.

One more worth writing deliberately. Pump the screen, pop it, then let the future resolve. If the code lacks a \`mounted\` check, you reproduce \`setState() called after dispose()\` in a test instead of in a crash report.

Then run the whole suite with \`flutter test --test-randomize-ordering-seed=random\` once a week. Order dependence hides in shared setup state, and meeting it on a quiet Tuesday beats meeting it on release morning.
      `,
        [
          q('A widget test on a screen whose fake never completes its future dies with pumpAndSettle timed out. What is actually happening?', [
            'The 800x600 test surface is too small for layout to ever finish',
            'The spinner keeps scheduling frames, so the scheduler never runs dry',
            'pumpAndSettle cannot be used after a call to tester.tap',
            'An exception was thrown and takeException has not collected it yet',
          ], 1, 'pumpAndSettle only returns once no further frame is queued, and an indeterminate progress indicator queues one forever, so it pumps until its timeout expires.'),
          q('Why hand a fake a Completer\'s future instead of letting it return a ready value?', [
            'A ready value would make the first pumpAndSettle call throw',
            'A Completer is the only way for a fake to deliver an error',
            'It stops the fake being garbage collected part way through',
            'The loading state exists only until the future resolves, so it is otherwise unobservable',
          ], 3, 'Holding the future open freezes the widget in its loading branch, which is the only moment the spinner is in the tree and therefore the only moment you can assert on it.'),
          q('A card that uses Image.network renders fine on device but the widget test fails with statusCode 400. Why?', [
            'The test HttpClient answers every request with 400, so real image loads always fail',
            'Widget tests provide no Directionality ancestor above an image widget',
            'Image.network requires pumpAndSettle rather than a single pump call',
            'The default surface is too small for the image to be laid out at all',
          ], 0, 'The test binding installs an HttpClient that refuses every request so suites never touch the network, which means any real image load has to be faked or injected.'),
        ]
      ),
      lesson('Golden Files and Visual Regression', 13, `
A one line change to a \`Padding\` slid the price label underneath the "Enrolled" badge on three screens. Two hundred widget tests stayed green, because not one of them asserts anything about what the screen looks like. Behaviour tests answer "did the right thing happen". They are blind to "does it look like garbage".

### A golden is a committed screenshot

\`\`\`dart
testWidgets('course card, enrolled state', (tester) async {
  await tester.pumpWidget(wrap(const CourseCard(course: sampleCourse, enrolled: true)));

  await expectLater(
    find.byType(CourseCard),
    matchesGoldenFile('goldens/course_card_enrolled.png'),
  );
});
\`\`\`

\`flutter test --update-goldens\` writes the PNG, you commit it, and every run afterwards compares pixel by pixel. On a mismatch Flutter drops four files into \`test/failures/\`: \`_masterImage\` (what was committed), \`_testImage\` (what rendered), \`_isolatedDiff\` (the changed pixels alone) and \`_maskedDiff\` (the changes drawn over the original). Open \`_maskedDiff\` first, it answers the question fastest.

### The default font is a row of boxes

The test environment ships without your fonts. Text renders in Ahem, where every glyph is a filled rectangle, so a golden catches layout and catches nothing about typography. \`loadAppFonts()\` from \`golden_toolkit\` registers the real ones.

Which buys you the counter-intuitive cost. Once genuine fonts are rasterised, output depends on the rasteriser, and macOS and the Linux container in CI do not agree to the last pixel. Identical code, different bytes, red build. Generate goldens in the same environment that verifies them:

\`\`\`yaml
- run: flutter test --exclude-tags golden                       # every push, fast
- run: docker run --rm -v "$PWD":/app ghcr.io/acme/flutter:3.24 \\
         flutter test --tags golden --update-goldens=false      # pinned image only
\`\`\`

Put \`@Tags(['golden'])\` at the top of each golden file and the split costs you one line.

### Determinism is the whole game

Anything that varies between runs turns a golden into a random number generator.

| Source of drift | Fix |
|---|---|
| Animation caught mid flight | \`pump\` a fixed duration, never settle a looping one |
| A "2 hours ago" label | \`withClock(Clock.fixed(...))\` around the pump |
| Network images | inject a fake \`ImageProvider\` or precache a local asset |
| Device metrics | set \`tester.view.physicalSize\` explicitly per golden |
| Antialiasing noise | a comparator with a small pixel tolerance |

That last row needs a custom \`LocalFileComparator\` that allows, say, 0.2% of pixels to differ. Set it too high and a shifted label passes; leave it at zero and one driver update floods you with failures.

### Golden components, not screens

A golden of the whole home screen fails when marketing changes a heading. A golden of \`PrimaryButton\` in default, loading, disabled and pressed states fails only when the button changes, which is exactly when you want to look.

| Good candidate | Poor candidate |
|---|---|
| Design system components in every state | A screen fed by live API data |
| Empty, error and skeleton states | Anything showing today's date |
| A card in three locales including Arabic | A list whose order comes from remote config |

### The habit that destroys all of it

A golden fails. Someone runs \`flutter test --update-goldens\`, sees green, commits. Do that twice and the suite has learned to accept every regression as the new truth. A golden diff is a code change and belongs in review as an image, so if your review tool cannot show the PNG side by side, add a CI step that uploads \`test/failures/\` as a build artefact. Goldens nobody looks at are worse than no goldens, because they cost time and buy a false sense of coverage.
      `,
        [
          q('Goldens generated on a developer laptop running macOS fail in the Linux CI container even though the code is identical. Why?', [
            'Linux runners default to a different device pixel ratio for tests',
            'Git line ending conversion corrupts the PNG files during checkout',
            'flutter test disables the golden comparator on headless machines',
            'Font rasterisation differs between the platforms, so the pixels differ',
          ], 3, 'Once real fonts are loaded the output depends on the platform rasteriser, so goldens must be produced and verified in the same pinned environment.'),
          q('Why is reaching for flutter test --update-goldens every time a golden goes red a bad habit?', [
            'The command rewrites the test source as well as the committed image',
            'It only works when every golden in the suite is failing at once',
            'It accepts the regression as the new truth with nobody having looked',
            'Updated images are ignored until the comparator cache is cleared',
          ], 2, 'The value of a golden is the human review of the diff, so blindly regenerating it turns a regression detector into a rubber stamp.'),
          q('Which of these is the better candidate for a golden test?', [
            'The home screen rendered with data pulled from the staging API',
            'A design system button in its default, loading and disabled states',
            'A settings list whose rows arrive from remote config at runtime',
            'A checkout screen showing a live total and today\'s date',
          ], 1, 'A component with fixed inputs only changes when the component changes, while anything fed by live data or the clock produces failures that mean nothing.'),
        ]
      ),
      lesson('Integration Tests on Real Devices', 13, `
Sign in was broken on Android 13 for four days and the whole suite stayed green. The notification permission dialog was appearing on top of the sign in button, so real thumbs hit a system sheet instead. No widget test could ever see it: they run headless, with plugins replaced by stubs and no system UI in the tree at all.

### What changes when the test runs on hardware

\`\`\`dart
// integration_test/enrol_flow_test.dart
import 'package:integration_test/integration_test.dart';
import 'package:courses/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('sign in, open a course, enrol', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('email')), 'qa+ci@example.com');
    await tester.enterText(find.byKey(const Key('password')), 'staging-only');
    await tester.tap(find.byKey(const Key('signIn')));

    await waitFor(tester, find.text('My courses'));
  });
}
\`\`\`

\`\`\`bash
flutter test integration_test/enrol_flow_test.dart -d SM_A536B
\`\`\`

Same API as a widget test, entirely different failure modes. Real plugins, real platform channels, real secure storage, a real network, and a real device that may decide to run an OS update mid test.

Notice every finder above uses \`find.byKey\`. Give anything the test touches a stable key. Finders that match visible text break the first time a copy change ships or a second locale is added, and a device farm failure that turns out to be a renamed button burns an afternoon before anyone reads the video.

### pumpAndSettle is where the flake lives

\`pumpAndSettle\` returns when the scheduler runs dry, which on a device happens the instant the spinner is removed or before your response has even arrived.

\`\`\`dart
// Broken: green on the office wifi, red on the CI network
await tester.tap(find.text('Sign in'));
await tester.pumpAndSettle();
expect(find.text('My courses'), findsOneWidget);
\`\`\`

\`\`\`dart
// Fixed: bounded polling, fails with a useful message
Future<void> waitFor(WidgetTester tester, Finder finder,
    {Duration timeout = const Duration(seconds: 20)}) async {
  final deadline = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(deadline)) {
    await tester.pump(const Duration(milliseconds: 100));
    if (finder.evaluate().isNotEmpty) return;
  }
  fail('Timed out after \${timeout.inSeconds}s waiting for $finder');
}
\`\`\`

Never insert a fixed sleep. It is too short on a cold device and pure waste on a fast one, and a suite built from sleeps grows a minute every time somebody bumps one.

### Native surfaces need a native driver

\`integration_test\` drives your Flutter tree only. A permission sheet, the system share dialog and a Google sign in web view all sit outside it. Either pre-grant what you need before the run:

\`\`\`bash
adb shell pm grant com.example.courses android.permission.POST_NOTIFICATIONS
\`\`\`

or use \`patrol\`, which extends the binding with native control such as \`$.native.grantPermissionWhenInUse()\`. Pre-granting is simpler; it also means you never test the deny path, so cover that one deliberately.

### Running on phones you do not own

\`\`\`bash
./gradlew app:assembleDebug -Ptarget=integration_test/enrol_flow_test.dart
./gradlew app:assembleAndroidTest
gcloud firebase test android run --type instrumentation \\
  --app build/app/outputs/apk/debug/app-debug.apk \\
  --test build/app/outputs/apk/androidTest/debug/app-debug-androidTest.apk \\
  --device model=redfin,version=30 --device model=a51,version=31
\`\`\`

Two devices, several minutes each, billed per device minute. That economics sets the scope for you: three to five flows whose breakage costs money or trust (sign in, purchase, enrol, upload), on merge to main and nightly, never on every push. The pyramid from the rest of this chapter is not dogma, it is arithmetic.

Point the run at a seeded staging backend with disposable accounts and a reset endpoint called in \`setUp\`. Aiming a device farm at production is how an analytics dashboard acquires four thousand fake enrolments in a weekend. And a run that only passes when the previous run left the right rows behind is the classic cause of a nightly that is red every second night.
      `,
        [
          q('Why can no widget test catch a permission dialog that covers the sign in button?', [
            'They run headless with plugins stubbed, so no system UI is ever in the tree',
            'They use an 800x600 surface, so the dialog lands off the visible area',
            'They stub pumpAndSettle, which quietly skips any modal route',
            'They run in release mode, where the platform suppresses permission prompts',
          ], 0, 'A widget test renders only your Dart widget tree in a headless binding, so anything drawn by the operating system simply does not exist there.'),
          q('An integration test taps Sign in, calls pumpAndSettle, then asserts the dashboard, and it fails on a slow network. What is the proper fix?', [
            'Insert a five second sleep before making the assertion',
            'Poll with short pumps until the finder matches or a timeout expires',
            'Call pumpAndSettle three times in a row before asserting',
            'Raise the pumpAndSettle timeout argument to two minutes',
          ], 1, 'Settling only means no frame is queued right now, so the test has to keep pumping and re-evaluating the finder until the response actually arrives or a deadline passes.'),
          q('Why keep an integration suite down to roughly three to five flows?', [
            'The integration_test package refuses to register more than eight cases',
            'Every extra flow adds weight to the release bundle you ship to users',
            'Each run burns real device minutes, so breadth is paid for in time and money',
            'Device farms only report results for the first few tests in a suite',
          ], 2, 'Device farm runs are billed and measured per device minute, so the suite has to be limited to the flows whose breakage would genuinely cost money or trust.'),
        ]
      ),
      ],
      [
      q('You need to prove that a session expiring at 09:00 triggers a refresh when the app resumes at 09:01. Which approach holds up?', [
        'Set the expiry one second out and await a Future.delayed of two seconds',
        'Mock the AuthStore so that token() simply returns the refreshed value',
        'Schedule the CI job so the suite always runs at a fixed hour of the day',
        'Read the clock through package:clock and pin it with withClock in the test',
      ], 3, 'Injecting the clock lets the test state the exact instant it cares about, which keeps the suite fast and makes the assertion independent of when it runs.'),
      q('A padding change hid a price label behind a badge and nothing failed. Which kind of test would have caught it?', [
        'A golden for the card, since no behaviour assertion ever looks at pixels',
        'A unit test on the price formatter covering several currency inputs',
        'A mock verifying that the badge widget got constructed exactly once',
        'An integration test tapping through checkout on a real handset',
      ], 0, 'Finders and expectations confirm that widgets exist, not where they sit or what covers them, so only a pixel comparison notices an overlap.'),
      q('What is the practical division of labour between widget tests and integration tests?', [
        'Widget tests cover plugins, and integration tests cover pure Dart logic',
        'Widget tests run in release mode, and integration tests run in debug mode',
        'Widget tests cover states and branches cheaply, integration tests prove a few real flows',
        'Widget tests replace goldens, and integration tests replace unit tests entirely',
      ], 2, 'Widget tests are fast and headless so they can cover every branch, while integration tests are slow and billed so they are spent only on the flows that must never break.'),
      q('A nightly integration run passes on its first attempt and fails when it is immediately run again. Which cause fits best?', [
        'The app bundle was rebuilt overnight with a fresh build number',
        'The first run left data behind, so the second started from a dirty state',
        'The device farm rotated to a handset with a different screen density',
        'Obfuscation stripped the widget keys that the finders depend on',
      ], 1, 'A flow that enrols or creates a record changes the backend, so without a reset step the second run meets state the first one produced and takes a different path.'),
      ]
    ),
    chapter(
      'Offline-First Data and Background Work',
      'Building for a phone that loses the network halfway through a write and comes back an hour later with changes of its own.',
      [
      lesson('A Local Database as the Source of Truth', 13, `
Chapter 4 showed cache-then-network: read the cache, show it, refresh quietly behind it. That pattern has a ceiling, and you hit it the first time a sync writes a row while a screen is open. A \`Future<List<Lesson>>\` is one answer at one moment. The row changed; the screen did not.

Offline-first turns the arrow around. The UI never talks to the network. It subscribes to a query against the local database, and the network's only job is to write into that database.

### One direction of data flow

| Cache then network | Offline first |
|---|---|
| The screen awaits a repository call | The screen subscribes to a query |
| A network failure becomes a UI error | A network failure is invisible |
| Refresh means fetch, then rebuild | Refresh means a row changed |
| Two sources of truth to reconcile | One table, one answer |

### The four columns that are not about your feature

\`\`\`dart
class Lessons extends Table {
  TextColumn get id => text()();
  TextColumn get courseId => text()();
  TextColumn get title => text()();
  IntColumn get position => integer()();
  BoolColumn get completed => boolean().withDefault(const Constant(false))();

  IntColumn get updatedAt => integer()();                    // when this device touched it
  IntColumn get serverVersion => integer().withDefault(const Constant(0))();
  BoolColumn get dirty => boolean().withDefault(const Constant(false))();
  DateTimeColumn get deletedAt => dateTime().nullable()();   // tombstone, not DELETE

  @override
  Set<Column> get primaryKey => {id};
}

Stream<List<Lesson>> watchCourse(String courseId) => (select(lessons)
      ..where((l) => l.courseId.equals(courseId) & l.deletedAt.isNull())
      ..orderBy([(l) => OrderingTerm(expression: l.position)]))
    .watch();
\`\`\`

\`updatedAt\`, \`serverVersion\`, \`dirty\` and \`deletedAt\` carry no product meaning at all. They exist so the device can answer three questions with the radio off: what have I changed, what did the server last tell me, and what did I delete. Rows are never removed with \`DELETE\`, because a row that vanishes leaves nothing to report to the server or to a second device.

\`.watch()\` re-runs the query whenever a table it reads is written. That is the entire reactive story: no listeners to register, no cache to invalidate by hand.

### The 500 rebuild sync

\`\`\`dart
for (final row in changes) {        // 500 lessons arrive in one delta pull
  await into(lessons).insertOnConflictUpdate(row);
}
\`\`\`

Every iteration commits, every commit fires the stream, and a visible list rebuilds five hundred times in about a second. On a mid-range Android handset that is a frozen scroll and a hot phone, and it looks so much like a slow network that teams spend a day profiling the wrong layer.

\`\`\`dart
await transaction(() async {
  await batch((b) => b.insertAllOnConflictUpdate(lessons, changes));
});
\`\`\`

One commit, one emission, one rebuild.

### Empty and loading are different answers

\`\`\`dart
if (!snap.hasData) return const LessonSkeleton();
final rows = snap.data!;
if (rows.isEmpty) {
  return meta.lastSyncAt == null
      ? const LessonSkeleton()      // never synced, so we do not know yet
      : const NoLessonsYet();       // synced, and there genuinely are none
}
\`\`\`

A fresh install has an empty table and no recorded sync, which means loading. A user who really has nothing enrolled has an empty table and a sync timestamp. Collapse those two states and every first launch greets a new user with "Nothing here", which is the single fastest way to lose one.

One rule holds the whole design together: never gate a read on connectivity. A \`connectivity_plus\` check in front of a screen builds an online app wearing an offline banner.
      `,
        [
          q('Your sync writes 500 lessons one insert at a time into a table a screen is watching. What does the user see?', [
            'One rebuild at the end, since streams emit only on commit',
            'A single rebuild, because drift coalesces writes for you',
            'Hundreds of rebuilds, because every insert re-fires the query',
            'An exception, because a table cannot be written while watched',
          ], 2, 'A watched query re-runs on every write to the tables it reads, so five hundred separate commits produce five hundred emissions and a frozen list.'),
          q('Why does an offline-first table keep a deletedAt column instead of deleting the row outright?', [
            'A row that vanishes leaves nothing to report to the server or another device',
            'SQLite cannot delete rows while a stream is watching the table',
            'It keeps the primary key reserved for the next insert',
            'Deletes are slower than updates in a write ahead log',
          ], 0, 'The delete is itself a change that has to be synced, so it needs a record on the device until the server and every other device have seen it.'),
          q('A watched query emits an empty list on a fresh install. What should the screen render, and why?', [
            'An error state, because an empty result means the sync failed',
            'The empty state, because the query has already answered',
            'A retry button, because emptiness implies the network is down',
            'A skeleton until a first sync is recorded, then the empty state',
          ], 3, 'An empty table with no recorded sync means the answer is unknown rather than none, so the last sync timestamp is what separates loading from genuinely empty.'),
        ]
      ),
      lesson('Optimistic Writes and an Outbox Queue', 13, `
Third floor of a car park, no signal. The user taps "Mark complete", the request hangs for thirty seconds, a snackbar says "Could not save", and the checkbox flips back. They tap again. None of that is the user's fault, and all of it comes from one line of code.

\`\`\`dart
Future<void> toggle(Lesson l) async {
  try {
    await api.setCompleted(l.id, !l.completed);   // thirty seconds of nothing
    await db.markCompleted(l.id, !l.completed);
  } catch (_) {
    showSnackBar('Could not save');               // the work is simply gone
  }
}
\`\`\`

The optimistic version writes locally first and records the intent, then returns. The stream from Topic 1 repaints the checkbox in about five milliseconds, offline or not.

\`\`\`dart
Future<void> toggle(Lesson l) => db.transaction(() async {
  final now = DateTime.now().millisecondsSinceEpoch;

  await db.update(db.lessons).replace(
      l.copyWith(completed: !l.completed, updatedAt: now, dirty: true));

  await db.into(db.outbox).insert(OutboxCompanion.insert(
      opId: const Uuid().v4(),        // also the idempotency key
      entity: 'lesson',
      entityId: l.id,
      op: 'set_completed',
      payload: jsonEncode({'completed': !l.completed}),
      createdAt: now));
});
\`\`\`

### Both writes or neither

The transaction is not decoration. Kill the process between those two statements and you get a lie in one direction or the other: a lesson the user sees as complete that the server will never hear about, or a queued operation for a change the UI never made. Android kills a backgrounded app in seconds under memory pressure, so this is a weekly event, not a thought experiment.

That is also why the queue is a table and not a \`retry(3)\` wrapper around the HTTP call. A retry loop lives in RAM. The outbox survives process death, a reboot, and five days in flight mode.

### One opId, or four enrolments

The server creates the enrolment, then the 201 dies on a dropped LTE handover. Your client sees a timeout and retries. Now there are two enrolments, and after a flaky lift ride, four.

Send the \`opId\` as an \`Idempotency-Key\` header and keep it identical across every retry of that operation. The server stores the key with the result and replays the original response instead of doing the work twice. Generate the key when the user taps, never inside the retry loop.

### Draining in order

\`\`\`dart
Future<void> drain() async {
  final ops = await (select(db.outbox)
        ..orderBy([(o) => OrderingTerm(expression: o.createdAt)])
        ..limit(25))
      .get();

  for (final op in ops) {
    try {
      await api.send(op);
      await (delete(db.outbox)..where((o) => o.id.equals(op.id))).go();
    } on ApiException catch (e) {
      if (e.status >= 400 && e.status < 500 && e.status != 429) {
        await park(op, e.message);   // a 422 will fail identically forever
      } else {
        await bump(op, e.message);
        break;                       // stop at the first blocked op
      }
    }
  }
}
\`\`\`

That \`break\` is load bearing. Operations on one entity are ordered, so skipping a failed create and sending the update behind it hands the server an edit for a row it has never seen. Parking is just as important: without it, one permanently rejected operation sits at the head of the queue and nothing else on the device ever syncs again.

### Backoff, and the herd

| Attempt | Delay | Reason |
|---|---|---|
| 1 | immediate | most failures are one dropped packet |
| 3 | 8 seconds | the radio may still be reconnecting |
| 6 | 2 minutes | something upstream is actually down |
| 8 | park it | a human needs to look |

Multiply each delay by a random factor between 0.5 and 1.5. Skip the jitter and every device that lost your API during a five minute outage retries on the same second it recovers, which is how a recovered backend goes straight back down.

Coalescing is the cheap win. Six toggles of the same switch while waiting for a lift become six rows and six requests. Delete any pending op with the same \`entityId\` and \`op\` before inserting a new one, and six become one. Do not coalesce appends or increments, where every event carries its own meaning.
      `,
        [
          q('Why write the row change and the outbox entry inside a single transaction?', [
            'It makes the local write faster than two separate statements',
            'A crash between them leaves the UI and the queue disagreeing',
            'Transactions are required before a drift stream will emit',
            'It lets the server receive both writes as one request',
          ], 1, 'Without atomicity the process can die holding a completed lesson the server never hears about, or a queued operation for a change the user never made.'),
          q('A POST succeeds but its response is lost and the client retries. What prevents a duplicate enrolment?', [
            'Retrying only when the status code is 5xx',
            'Deleting the outbox row before sending the request',
            'Setting a much shorter HTTP timeout on the client',
            'Reusing the same operation id as an idempotency key',
          ], 3, 'A stable key lets the server recognise the second request as the same operation and replay the original response rather than doing the work again.'),
          q('The drain loop hits a network error on the oldest queued op. Why break instead of trying the next one?', [
            'Later ops can depend on it, so an update could reach a row the server has not created',
            'drift locks the outbox table until the failing row is removed',
            'Continuing would reset the attempt counter on every row',
            'The HTTP client cannot open a second request after a failure',
          ], 0, 'Operations against one entity are ordered, so sending an edit past a create that has not landed produces a server error for a row that does not exist.'),
        ]
      ),
      lesson('Sync, Conflicts, and Last Write Wins', 13, `
09:12, on a train, a user renames a note on their phone. 09:20, at a desk, they rename the same note on the web. 10:05 the phone reconnects and pushes. If your rule is last write wins on the device clock, the 09:12 edit destroys the 09:20 one and nobody is ever told.

Sync is three separate problems: knowing what changed, deciding who wins, and remembering what was deleted. Most teams solve the first, guess at the second, and forget the third entirely.

### Ask for changes by cursor, not by time

\`\`\`json
GET /v1/changes?since=8842

{
  "cursor": 8931,
  "changes": [
    {"id": "lsn_41", "version": 7, "completed": true, "updatedAt": 1723451102000},
    {"id": "lsn_58", "version": 3, "deleted": true}
  ]
}
\`\`\`

A server issued cursor is a position in the change log. A timestamp is a guess about two clocks that disagree, and it silently drops any row committed inside the window between your query and the client's idea of now. Store the cursor next to \`lastSyncAt\` and send it back untouched.

Push before you pull. Local dirty rows go up first and come back with fresh version numbers; pull first and the server's copy overwrites edits you have not yet sent.

### Detect the conflict instead of guessing

Send the version you based your edit on, as \`If-Match: 7\`. A 409 comes back carrying the server's current record, and only then do you have both sides and a real decision to make.

| Strategy | Fits | Costs |
|---|---|---|
| Last write wins | toggles, counters owned by one device | the other edit, silently |
| Server wins | catalogue data your app never authors | every offline edit |
| Field level merge | records whose fields move independently | a version per field |
| Ask the user | note bodies, anything typed | a dialog nobody enjoys |

\`\`\`dart
Lesson resolve(Lesson local, RemoteLesson remote) {
  if (!local.dirty) return Lesson.fromRemote(remote);        // no local edit, take theirs
  if (remote.version == local.serverVersion) return local;   // nobody else touched it

  if (local.updatedAt >= remote.updatedAt) {
    return local.copyWith(serverVersion: remote.version);    // keep ours, push again
  }
  analytics.log('conflict_discarded', {'id': local.id});     // this is data loss
  return Lesson.fromRemote(remote);
}
\`\`\`

That analytics line matters more than the algorithm. Last write wins is not a resolution, it is a policy of losing one side quietly, and the counter tells you when a field has outgrown it.

### Whose clock

Never stamp \`updatedAt\` from \`DateTime.now()\` alone. Read a \`Date\` header on any response, compute \`offset = serverMillis - deviceMillis\` once per session, and stamp with the corrected value. Users move their device date forward to dodge trial expiry more often than you would believe, and a phone two days in the future wins every comparison against every other device, forever, until someone notices the support tickets.

### The resurrection bug

Phone A deletes lesson 58 and syncs. Phone B, whose cursor is older, never learns about it, because a deleted row is not in any list the server returns. B then edits something unrelated on that lesson, marks it dirty, and pushes. Lesson 58 is back on both devices, and it will come back again next week.

Tombstones fix it: the server returns \`{"id": "lsn_58", "deleted": true}\` in the change feed, and the client sets \`deletedAt\` rather than removing the row. Every query filters on \`deletedAt IS NULL\`, and a purge job drops tombstones older than your retention window, typically thirty days, which is the point past which a device that has been offline that long should do a full resync instead.
      `,
        [
          q('Why should a sync push local dirty rows before pulling server changes?', [
            'Pulling first costs more bandwidth on a metered connection',
            'The server rejects a push that follows a pull in one session',
            'A pull can overwrite local edits that were never sent',
            'Cursors are only issued in response to a push',
          ], 2, 'Applying the server copy over a row that still holds unsent edits destroys them before they ever reach the server.'),
          q('A device has its clock set two days ahead. What does that break under last write wins?', [
            'Its uploads are rejected because the timestamp is in the future',
            'Its edits beat every other device on every shared record',
            'Its cursor advances twice as fast as the server issues them',
            'Its tombstones expire before the retention window closes',
          ], 1, 'The comparison is just a number, so a device stamping times in the future always looks like the most recent writer until someone corrects the clock.'),
          q('A deleted lesson keeps reappearing on a second device. What is the most likely cause?', [
            'The second device holds a stale cursor that never advances',
            'Both devices resolved the conflict as server wins',
            'The delete was pushed without an idempotency key',
            'Deletes are missing from the change feed, so the other device re-uploads the row',
          ], 3, 'A device that never hears about the delete still holds the row, and its next push puts that row back on the server.'),
        ]
      ),
      lesson('Background Tasks and Battery Budgets', 13, `
Register a fifteen minute periodic sync, then watch a real device for a day. On an Android handset with battery saver on it runs perhaps four times. On an iPhone whose owner swipes the app away every night it runs never. Background execution is not a schedule you set, it is a request the OS grants when it feels like it.

| Mechanism | Platform | Budget | What actually happens |
|---|---|---|---|
| WorkManager periodic | Android | minutes | 15 minute floor, batched into Doze windows |
| BGAppRefreshTask | iOS | about 30 s | opportunistic, learned from usage habits |
| BGProcessingTask | iOS | minutes | in practice, charging and on wifi |
| Silent push | both | seconds | iOS throttles it and may drop it entirely |
| Foreground service | Android | long | needs a visible notification and a declared type |

### The entry point runs in a bare isolate

\`\`\`dart
@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, _) async {
    final db = await AppDatabase.open();     // nothing from your app exists here
    final drained = await SyncEngine(db).runBounded(
      maxOps: 25,
      deadline: const Duration(seconds: 20),
    );
    await db.close();
    return drained;                          // false asks the OS to try again later
  });
}

void main() {
  Workmanager().initialize(callbackDispatcher);
  Workmanager().registerPeriodicTask('sync', 'sync',
      frequency: const Duration(minutes: 15),
      constraints: Constraints(
        networkType: NetworkType.connected,
        requiresBatteryNotLow: true,
      ));
}
\`\`\`

The isolate rules from Chapter 6 apply unchanged: no providers, no \`BuildContext\`, no singletons your app configured. Open your own database handle and close it before returning.

### Bounded work beats thorough work

Note the twenty second deadline against a thirty second iOS budget. Draining four thousand queued operations feels responsible and is exactly wrong: overrun the budget and the system kills the task, then schedules you less often afterwards. A greedy task makes the next task less likely to run at all. Take twenty five operations, return true, and let the next window take the next twenty five.

### The radio is the battery, not the CPU

The surprising part of mobile power. After a transmit, a cellular radio does not drop straight back to idle; it holds a high power state for roughly ten to twenty seconds waiting for more traffic. Twenty small requests spaced across ten minutes keep that tail alive again and again. The same bytes in one batched request pay the tail once.

So batch. Sync the outbox and the delta pull in one wake up rather than one request per screen, add \`requiresCharging: true\` to anything heavy such as prefetching lesson images, and prefer \`NetworkType.unmetered\` for payloads a user would resent on a data plan.

### Treat it as an optimization, never as the mechanism

Correctness cannot depend on a callback the OS may never call. Trigger a sync on three events you control, and let the background task be the fourth:

\`\`\`dart
WidgetsBinding.instance.addObserver(this);      // on resume
Connectivity().onConnectivityChanged.listen(...); // on reconnect
outbox.onEnqueue(syncSoon);                       // right after any user write
\`\`\`

On iOS, a force quit from the app switcher stops background refresh completely until the user opens the app again. Your QA tester force quits before every test.

### Make it observable

\`\`\`bash
adb shell cmd jobscheduler run -f com.cortexis.app 0
\`\`\`

Log the last run time, duration, operations drained and result into a table, and put them on a hidden debug screen. Background work is invisible by definition, and without that screen every report of "my progress did not save" is unanswerable.
      `,
        [
          q('Why should a background sync drain twenty five operations and return rather than finish the queue?', [
            'Overrunning the budget gets the task killed and scheduled less often afterwards',
            'A drift transaction cannot hold more than about thirty writes',
            'The OS bills the app for each network request made in the background',
            'A long task is not allowed to open a database in a background isolate',
          ], 0, 'The system measures how well a task behaves inside its budget, so a greedy run is terminated and reduces the chance the next run happens at all.'),
          q('Twenty small requests spread over ten minutes drain far more battery than one batched request. Why?', [
            'Each request re-runs the TLS handshake on a cold CPU core',
            'The OS spawns a fresh isolate for every outgoing HTTP call',
            'Each transmit holds the radio in a high power state for seconds afterwards',
            'Small payloads compress far less efficiently on the server',
          ], 2, 'The radio does not return to idle immediately after sending, so repeated small transmits pay that tail again and again while one batch pays it once.'),
          q('What is the safest role for a periodic background task in an offline-first app?', [
            'The only place the outbox is permitted to drain',
            'An optimization, with resume and reconnect syncs as the real path',
            'A replacement for retrying failed requests inside the app',
            'The mechanism that guarantees data becomes eventually correct',
          ], 1, 'The OS may never run the callback on a given device, so correctness has to rest on triggers the app controls and the background run just keeps things fresh.'),
        ]
      ),
      ],
      [
      q('A screen awaits a Future from the repository while a sync writes new rows behind it. What is the offline-first fix?', [
        'Call setState after every network response completes',
        'Poll the repository every few seconds while the screen is open',
        'Re-fetch the Future whenever connectivity changes',
        'Have the screen watch a database query so writes push updates to it',
      ], 3, 'A watched query makes the database the single source of truth, so any writer, sync included, updates the screen without the screen knowing about it.'),
      q('Which pair of columns does an offline-first table need that an online-only one does not?', [
        'A dirty flag and a tombstone timestamp',
        'A created-by id and a display order',
        'A cached-at time and an etag string',
        'A retry counter and a request timeout',
      ], 0, 'The device has to know which rows hold unsent edits and which rows were deleted locally, and neither question can be answered without those two columns.'),
      q('Sixty operations are queued and the oldest keeps returning 422. What happens with no parking rule?', [
        'The queue drains around it and only that one operation is lost',
        'Nothing else ever syncs, because the head of the queue never clears',
        'The server merges the remaining operations on the next pull',
        'The app retries it twice and then discards the whole outbox',
      ], 1, 'Ordered draining stops at the first blocked operation, so a permanently rejected one at the head blocks every later change on that device.'),
      q('A user edits offline while a colleague edits the same record on the web. Under last write wins, what must you measure?', [
        'The bandwidth spent re-uploading the contested record',
        'The delay between the edit and the next sync window',
        'Silent data loss, so the discarded edits need counting',
        'The number of tombstones held past their retention',
      ], 2, 'Last write wins throws one side away without telling anyone, so a counter on discarded edits is the only signal that a field has outgrown the rule.'),
      ]
    ),
    chapter(
      'Performance Engineering on Real Devices',
      'Finding and fixing the jank, the slow launch, and the memory and size problems that only appear on the hardware your users actually own.',
      [
      lesson('Hunting Jank Frame by Frame', 13, `
A tester writes "the course list stutters on my phone". You scroll the same list on your Pixel 8 Pro and it is glass. Nothing is wrong with your eyes. Their handset drives a 60Hz panel with a mid-range GPU, and your review device hides the mistake behind hardware they will never own.

Jank is not a feeling. It is a frame that missed a deadline, and you can count them.

### The budget is per frame, and both threads share it

| Panel | Budget | What has to fit |
|---|---|---|
| 60Hz | 16.6ms | build, layout, paint, then raster |
| 90Hz | 11.1ms | the same work, two thirds of the time |
| 120Hz | 8.3ms | one 9ms sort and you are already late |

Flutter splits that work across two threads. The **UI thread** runs your Dart: \`build\`, layout, paint, and it produces a layer tree. The **raster thread** turns that tree into GPU commands. A frame is on time only when both finish inside the budget, so a screen can jank with build methods that are entirely innocent.

### Measure before you guess

\`SchedulerBinding\` hands you the real timings of every frame the device produced, in profile and release builds alike:

\`\`\`dart
void watchFrames() {
  SchedulerBinding.instance.addTimingsCallback((List<FrameTiming> frames) {
    for (final f in frames) {
      final build = f.buildDuration.inMicroseconds / 1000;
      final raster = f.rasterDuration.inMicroseconds / 1000;
      final total = f.totalSpan.inMicroseconds / 1000;
      if (total > 16.6) {
        debugPrint('slow frame total=$total build=$build raster=$raster');
      }
    }
  });
}
\`\`\`

Ship that behind a flag and log the ratio of late frames per screen. Averages lie about jank: a screen averaging 9ms per frame with one 90ms spike feels broken, and the average never says so. Track the 99th percentile, or just the count of frames over budget per thousand.

Real output from a course grid on a Redmi Note 11 tells you where to look immediately:

\`\`\`text
slow frame total=71.4 build=4.1 raster=66.9
slow frame total=68.2 build=3.8 raster=63.1
\`\`\`

Build is fine. The GPU is drowning.

### Reading the split

| Symptom | Usually |
|---|---|
| Tall build, flat raster | Work inside \`build\`, or too much of the tree rebuilding |
| Flat build, tall raster | Saved layers: opacity, clips with anti-aliasing, big blurs, shadows |
| Both tall, first launch only | Shader compilation on the old Skia backend |
| One 300ms spike, then smooth | A synchronous decode, a file read, or a parse on the UI thread |

Chapter 5 covered \`const\`, \`ListView.builder\`, and keeping \`build\` cheap. Those fix the first row. The second row is different work entirely. \`Opacity\` around a large subtree, \`ClipRRect\` with \`Clip.antiAliasWithSaveLayer\`, and stacked \`BoxShadow\` all force the rasteriser to allocate an offscreen buffer, draw into it, then composite it back. On a Mali GPU that is where your 66ms went.

The fix is usually to say the same thing more cheaply:

\`\`\`dart
// Slow: a full save layer for a rounded thumbnail, every frame it repaints
ClipRRect(
  borderRadius: BorderRadius.circular(12),
  clipBehavior: Clip.antiAliasWithSaveLayer,
  child: Image.network(course.coverUrl),
)

// Fast: the rounding becomes part of the paint, no offscreen buffer
DecoratedBox(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(12),
    image: DecorationImage(image: NetworkImage(course.coverUrl), fit: BoxFit.cover),
  ),
)
\`\`\`

### Turn on enhanced tracing before you profile

In DevTools, the Performance page has toggles for "Track widget builds", "Track layouts", and "Track paints". Off by default, because they cost time themselves. On, a janky frame expands into a flame chart naming the widget that took the milliseconds, which beats reading your own code and hoping.

One counter-intuitive result to expect: the first run of a complex animation or page transition on Android used to cost 200ms or more while shaders compiled. Impeller, the default rendering backend on modern Flutter, compiles its shaders ahead of time and removes that class of jank entirely. If you are on an older engine and see a spike only on the first play of an effect, that is what you are looking at, and no amount of \`const\` will touch it.
      `,
        [
          q('A frame log shows build=3.8ms and raster=63.1ms on a scrolling grid. Where is the problem?', [
            'Too many widgets are rebuilding on each scroll offset',
            'The list is not using ListView.builder so items build eagerly',
            'Painting cost such as save layers, blurs, or shadows on the GPU',
            'JSON parsing running inside the repository during scroll',
          ], 2, 'The raster thread turns the layer tree into GPU commands, so a tall raster number points at what you asked the device to paint rather than at the Dart that described it.'),
          q('Why is an average frame time of 9ms a poor way to report jank?', [
            'It hides the occasional long frame that a user actually perceives as a stutter',
            'It is measured on the raster thread only, so build cost is excluded',
            'Averages are computed in debug mode, where all timings are inflated',
            'It counts frames the compositor dropped before they reached the GPU',
          ], 0, 'Users notice the spikes, not the mean, so a screen that averages comfortably under budget can still stutter badly and a percentile or an over budget count is what exposes it.'),
          q('What does wrapping a large subtree in ClipRRect with Clip.antiAliasWithSaveLayer cost at raster time?', [
            'An extra layout pass over every child in the subtree',
            'A rebuild of the subtree on each scroll offset change',
            'Recompilation of the shader used to draw the border',
            'An offscreen buffer that is drawn into and then composited back',
          ], 3, 'A save layer forces the rasteriser to allocate and fill a separate buffer before compositing it, which is expensive on mid-range GPUs and shows up purely in the raster timing.'),
        ]
      ),
      lesson('Cold Start and Time to First Frame', 13, `
Play Console flags your app one morning: 9.2% of cold starts exceed 5 seconds, above the bad behaviour threshold, and slow starts are now part of how the store ranks you. Your own launch on a cabled Pixel takes 1.1 seconds. Both numbers are true.

A cold start is not one thing. It is a chain, and your Dart code owns only the last two links.

| Stage | Owner | Typical on a mid-range Android |
|---|---|---|
| Process fork and Android app record | OS | 60ms to 200ms |
| Engine and Dart VM boot, AOT snapshot load | Flutter | 100ms to 400ms |
| \`main()\` up to \`runApp\` | you | 5ms to 3000ms |
| First frame built and rasterised | you | 40ms to 300ms |

The third row is where the disasters live, because it is the only one with a network call in it.

### Measure the thing the store measures

\`\`\`bash
flutter run --profile --trace-startup
\`\`\`

That writes \`build/start_up_info.json\`:

\`\`\`json
{
  "engineEnterTimestampMicros": 3405477,
  "timeToFrameworkInitMicros": 428133,
  "timeToFirstFrameMicros": 861219,
  "timeToFirstFrameRasterizedMicros": 892411
}
\`\`\`

For the number Android actually reports, drive it from the platform side:

\`\`\`bash
adb shell am start -W -n com.cortexis.courses/.MainActivity
\`\`\`

\`TotalTime\` in that output is what Play Vitals aggregates. Measure a release or profile build only. A debug start is several times slower and tells you nothing.

### The mistake everyone ships

\`\`\`dart
// Broken: the OS splash stays up until every one of these resolves
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await FirebaseRemoteConfig.instance.fetchAndActivate();  // a network round trip
  await AppDatabase.open();                                // schema migration on upgrade
  final prefs = await SharedPreferences.getInstance();
  runApp(MyApp(prefs: prefs));
}
\`\`\`

On office wifi that costs 300ms. On a congested 3G cell it costs eight seconds, and the user stares at a static splash the whole time because no Flutter frame has been produced yet. Remote config has a default fetch timeout of a minute, so the worst case is far uglier than anything you will reproduce at your desk.

Only two questions matter for each line in \`main\`: does the first frame genuinely depend on this, and can it fail?

\`\`\`dart
// Fixed: paint something in the first frame, finish booting behind it
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CortexisApp());
}

class _BootState extends State<Boot> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await Firebase.initializeApp();
      await context.read<ConfigService>().refresh();   // no await blocking the UI
      FlutterNativeSplash.remove();
    });
  }
}
\`\`\`

Anything the very first screen truly needs (a stored auth token, the selected locale) can stay, provided it is a local read measured in single milliseconds. Everything else moves behind the first frame.

### The trap in the metric itself

Android stops the clock at the first frame *drawn*. A first frame that is only a spinner scores beautifully and still feels slow to a human, who is waiting for content. This is why the cached-first pattern from Chapter 4 matters more than any micro-optimisation: read the local database, paint real rows, then refresh quietly. A 400ms start showing yesterday's courses beats a 400ms start showing a spinner that spins for three more seconds.

### Two more that are worth real milliseconds

Do not construct every tab at launch. The nested navigator stack from Chapter 3 keeps three subtrees alive, and all three \`initState\` methods run before the first frame. Insert the heavy tab lazily on first selection.

Deferred plugin registration and giant const asset maps also land in this window. If \`timeToFrameworkInitMicros\` is large and your \`main\` is already thin, look at how much your app does at import time: a top level \`final\` with an expensive initialiser runs on first access, and a static registry touched by \`main\` drags all of it in before anything is painted.
      `,
        [
          q('Why does awaiting a remote config fetch before runApp hurt so much more in production than in testing?', [
            'Remote config is disabled in profile builds so the call is skipped locally',
            'On a slow or congested network the fetch can take seconds while no frame has been produced',
            'The fetch runs on the raster thread, which is idle on a developer machine',
            'Play Vitals starts its timer only after the first network response arrives',
          ], 1, 'Nothing is painted until runApp produces a frame, so a network call placed before it turns straight into splash screen time whose length is set by the user network rather than by your code.'),
          q('You want the number Play Vitals aggregates for cold start. Which measurement matches it?', [
            'timeToFrameworkInitMicros from a debug trace file',
            'The stopwatch around your runApp call in main',
            'The first FrameTiming reported by addTimingsCallback',
            'TotalTime from adb shell am start -W on a release build',
          ], 3, 'Play measures from process start to the first frame drawn, which is exactly what the platform side am start report gives you, and it must be taken on a release or profile build because debug starts are far slower.'),
          q('A screen reaches its first frame in 400ms but users still call the app slow to open. Most likely cause?', [
            'That first frame is a spinner, so real content appears seconds later',
            'The raster thread is compiling shaders during the first frame',
            'The AOT snapshot is being loaded lazily after the first frame',
            'Play Vitals is measuring warm starts and reporting them as cold',
          ], 0, 'The platform metric stops at the first frame drawn regardless of what that frame contains, so painting cached content instead of a spinner is what actually changes the perceived start.'),
        ]
      ),
      lesson('Isolates and Work Off the UI Thread', 13, `
Your sync pulls a 3.2MB JSON payload of enrolments. \`jsonDecode\` plus model mapping takes 240ms on a Redmi Note 11. At 60Hz that is fourteen frames dropped in a row, and the scroll physics freeze mid gesture. Adding \`await\` in front of it changes nothing, because \`await\` yields for input and output, and this is pure CPU.

### One isolate, one thread, no shared memory

A Dart isolate owns its own heap and its own event loop. Two isolates never see each other's objects, so there are no locks and no data races, and the price is that everything crossing between them is copied. That single fact decides when an isolate is worth it.

\`\`\`dart
// Dart 3 and later: spawn, run, return, shut down
final enrolments = await Isolate.run(() => parseEnrolments(body));

// The older wrapper, still fine, top level or static function only
final enrolments = await compute(parseEnrolments, body);
\`\`\`

Spawning costs a few milliseconds plus the copy in each direction. So the rule is the opposite of what people assume: move a job off the UI thread when it is **big**, not when it is merely awkward.

| Work | Where |
|---|---|
| An HTTP call | Stay on the UI thread, \`await\` already yields |
| Parsing 3MB of JSON into 8000 models | Isolate |
| Sorting 40 items | UI thread, an isolate would be slower |
| Resizing and encoding a camera photo | Isolate |
| Reading two values from SharedPreferences | UI thread |

### Copy what is small, not what is large

The naive version parses on the isolate and sends back 8000 objects. Every one of them is deep copied across the boundary, and on a mid-range device that copy can cost more than the parse did.

\`\`\`dart
// Better: do the reduction inside the isolate, return a small result
Future<SyncSummary> syncSummary(String body) => Isolate.run(() {
  final rows = (jsonDecode(body) as List).cast<Map<String, dynamic>>();
  var overdue = 0;
  for (final r in rows) {
    if (DateTime.parse(r['due_at'] as String).isBefore(DateTime.now())) overdue++;
  }
  return SyncSummary(total: rows.length, overdue: overdue);
});
\`\`\`

For raw bytes, \`TransferableTypedData\` moves ownership rather than copying, which turns a 4MB image buffer transfer from milliseconds into microseconds.

### The two errors that will bite you

The first is sending something that cannot be sent. Isolate messages accept primitives, lists, maps, and instances of ordinary classes, but not an open database handle, a socket, a \`BuildContext\`, or a closure that captures one. The runtime is blunt about it: \`Invalid argument(s): Illegal argument in isolate message\`. Watch what your closure captures, because \`Isolate.run(() => _repo.parse(body))\` quietly drags \`_repo\` and everything it references across.

The second is plugins. A fresh isolate has no binary messenger, so \`getApplicationDocumentsDirectory()\` inside one throws until you hand it a token from the root isolate:

\`\`\`dart
final token = RootIsolateToken.instance!;
await Isolate.run(() async {
  BackgroundIsolateBinaryMessenger.ensureInitialized(token);
  final dir = await getApplicationDocumentsDirectory();
  await File('\${dir.path}/cache.json').writeAsString(payload);
});
\`\`\`

That token must be read on the main isolate and captured. Reading \`RootIsolateToken.instance\` inside the worker returns null, and the \`!\` turns it into a crash your testers will find before you do.

### Long-lived workers

\`Isolate.run\` spawns and tears down each call. For repeated work, such as decoding frames from a scanner, keep one worker alive with \`Isolate.spawn\` and a pair of ports:

\`\`\`dart
final receive = ReceivePort();
await Isolate.spawn(_worker, receive.sendPort);
final send = await receive.first as SendPort;
send.send(frameBytes);         // no spawn cost per job
\`\`\`

Remember to \`Isolate.kill\` it when the screen is disposed. A forgotten worker keeps a whole heap alive and shows up in the memory snapshot as a leak nobody can explain from the widget tree.
      `,
        [
          q('Why does putting await in front of a 240ms JSON parse fail to stop the jank?', [
            'The parse runs on the raster thread, which await cannot reschedule',
            'Await only yields once, and the parse needs to yield repeatedly',
            'Await yields for input and output, but a CPU bound loop still holds the isolate',
            'The Dart scheduler gives parsing a higher priority than frame production',
          ], 2, 'An isolate runs one thing at a time, so a synchronous CPU loop occupies it until it finishes and no amount of awaiting hands the frame pipeline a slot to run in.'),
          q('You parse 8000 models inside an isolate and return the full list, and it is barely faster. Why?', [
            'Isolate.run silently falls back to the main isolate for large results',
            'Every returned object is copied across the boundary, which can cost as much as the parse',
            'The models lose their const constructors when they cross an isolate boundary',
            'jsonDecode is single threaded, so the isolate runs it at the same speed',
          ], 1, 'Isolates share no memory, so results are deep copied on the way back and returning a large object graph can undo the benefit unless you reduce it to a small result inside the worker.'),
          q('getApplicationDocumentsDirectory throws inside an isolate you spawned. What is the fix?', [
            'Mark the isolate entry point as a top level function so plugins register',
            'Call WidgetsFlutterBinding.ensureInitialized at the start of the worker',
            'Move the path lookup into a Future that the main isolate awaits first',
            'Capture RootIsolateToken.instance on the main isolate and initialise the background messenger',
          ], 3, 'A spawned isolate has no binary messenger of its own, so plugin channels only work after BackgroundIsolateBinaryMessenger.ensureInitialized is given a token that was read on the root isolate.'),
        ]
      ),
      lesson('Memory Pressure and App Size', 13, `
Users report that the app restarts whenever they come back from the camera. No crash reports, no stack traces, nothing in Crashlytics. That is because there is no crash. Android's low memory killer chose your process, and a killed process leaves no trace in your reporter.

Two numbers decide whether that happens to you: how much memory you hold, and how much of it is images.

### The image cache is bigger than you think

Flutter keeps decoded images in \`PaintingBinding.instance.imageCache\`. The defaults are 1000 entries and 100MiB of decoded bytes. Decoded, not downloaded. A 2000 by 1500 JPEG that weighs 240KB on the wire occupies 2000 by 1500 by 4 bytes, which is 12MB in RAM. Nine of those and the cache alone is over 100MB while your download total is barely 2MB.

\`\`\`dart
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  PaintingBinding.instance.imageCache
    ..maximumSizeBytes = 48 << 20   // 48MB is plenty for a course catalogue
    ..maximumSize = 200;
  runApp(const CortexisApp());
}
\`\`\`

Then decode at the size you paint, with \`cacheWidth\` from Chapter 5 or \`ResizeImage\`, and let go when the system asks:

\`\`\`dart
class _AppState extends State<App> with WidgetsBindingObserver {
  @override
  void didHaveMemoryPressure() {
    PaintingBinding.instance.imageCache.clear();
    PaintingBinding.instance.imageCache.clearLiveImages();
  }
}
\`\`\`

Responding to that callback is the difference between dropping some cached thumbnails and being killed outright. Most apps never implement it.

### Read the size, do not guess it

\`\`\`bash
flutter build appbundle --release --analyze-size --target-platform android-arm64
\`\`\`

That prints a tree and writes a JSON snapshot you open in the DevTools App Size tool, which shows both the Dart code by package and the assets by file. A real breakdown for a modest app:

| Part | Size |
|---|---|
| Flutter engine, one ABI | 6.4MB |
| Dart AOT snapshot | 5.1MB |
| Fonts, four weights of two families | 3.2MB |
| Images shipped as PNG | 4.7MB |
| ICU data | 1.4MB |

Two lines in that table are usually free money. Convert those PNGs to WebP and the 4.7MB becomes roughly 900KB with no visible difference. Ship the two font weights you actually use and the 3.2MB becomes 800KB.

### Ship one ABI per device

An APK built the default way carries arm64, armeabi-v7a, and x86_64 engines, and every user downloads all three. An app bundle, or \`--split-per-abi\`, delivers one:

\`\`\`bash
flutter build appbundle --release        # Play splits per device
flutter build apk --split-per-abi        # for direct distribution
\`\`\`

That is around 7MB off the download for nothing.

### The icon tree shaker, and how people disable it by accident

Flutter strips unused glyphs from icon fonts, which usually cuts MaterialIcons from 1.6MB to a few kilobytes. It only works when every \`IconData\` is a compile time constant. Build one from a stored code point and the whole optimisation switches off:

\`\`\`dart
// Disables icon tree shaking for the entire build
Icon(IconData(codePoint, fontFamily: 'MaterialIcons'))

// Keeps it, and is safer anyway
const iconsByKey = {'share': Icons.share, 'edit': Icons.edit};
Icon(iconsByKey[key] ?? Icons.help_outline)
\`\`\`

The build prints a warning about non constant IconData and then succeeds, so nobody reads it. The bundle just quietly grows by a megabyte and a half.

For genuinely large optional features, Android supports deferred components: mark the library \`deferred as\` and call \`loadLibrary()\` before use, and its code ships as a separate module downloaded on demand. Worth it for a video editor, not for a settings screen.
      `,
        [
          q('Why can nine catalogue photos exhaust a 100MiB image cache when the downloads total 2MB?', [
            'The cache stores decoded pixels, so a 2000 by 1500 image holds about 12MB',
            'Each cached image keeps its original bytes plus a thumbnail copy',
            'Flutter caches every image at three densities to support all screens',
            'The cache counts entries rather than bytes, so nine large files overflow it',
          ], 0, 'Cache accounting is in decoded bytes at four bytes per pixel, which is why compression ratio on the wire says nothing about what an image costs in RAM.'),
          q('Your app disappears from the background with no crash report. Best explanation?', [
            'An uncaught async error escaped the zone guard installed in main',
            'A background isolate was killed and took the main isolate with it',
            'The OS reclaimed the process under memory pressure, which produces no crash',
            'The engine tore down after the first frame was rasterised',
          ], 2, 'A low memory kill terminates the process without an exception, so nothing reaches the crash reporter and the only defences are holding less memory and releasing caches when the memory pressure callback fires.'),
          q('Which change silently disables icon tree shaking and adds well over a megabyte?', [
            'Adding a second icon font alongside MaterialIcons',
            'Constructing IconData from a code point stored in your data',
            'Using Icon inside a widget that is not marked const',
            'Referencing the same icon from more than one screen',
          ], 1, 'The shaker can only keep the glyphs it can see at compile time, so any dynamically built IconData forces the whole font to ship and the build prints only a warning.'),
        ]
      ),
      ],
      [
      q('A profile run shows build times under 4ms and raster times over 60ms while scrolling. Which change is most likely to help?', [
        'Move JSON parsing into an isolate',
        'Replace setState with a Consumer around the list',
        'Add const constructors to the list item widgets',
        'Remove save layers such as anti aliased clips and stacked shadows',
      ], 3, 'Raster time is GPU work, so the fix lies in what is being painted rather than in how the widget tree was built or where the data came from.'),
      q('Which line genuinely belongs before runApp rather than after the first frame?', [
        'A remote config fetch that decides which experiment to show',
        'A synchronous read of the stored locale used by the first screen',
        'Opening the local database and running pending migrations',
        'Initialising the analytics SDK so the first screen view is recorded',
      ], 1, 'Only work the very first frame depends on and that completes in single milliseconds locally is worth blocking on, while anything touching the network or disk migration belongs behind a post frame callback.'),
      q('Sorting a list of 40 courses takes about 1ms. Why is moving it to an isolate a bad idea?', [
        'Spawning and copying across the boundary costs more than the sort itself',
        'Comparators cannot be sent to an isolate because they are closures',
        'The sorted list would arrive after the next frame has already been built',
        'Isolates run at a lower thread priority than the UI isolate',
      ], 0, 'An isolate costs a few milliseconds to spawn plus a copy in each direction, so offloading small work makes the operation slower rather than faster.'),
      q('Which pair of changes gives the largest download size reduction for the least effort?', [
        'Enabling obfuscation and splitting out debug symbols',
        'Deferring a rarely used feature and lazy loading its screens',
        'Shipping an app bundle and converting PNG assets to WebP',
        'Reducing the image cache limit and clearing it on memory pressure',
      ], 2, 'A bundle delivers a single engine ABI instead of three and WebP typically cuts image assets by around eighty percent, while cache limits affect runtime memory rather than download size.'),
      ]
    ),
    chapter(
      'Security, Privacy, and Platform Trust',
      'Hardening an app that ships to devices you do not control, against attackers holding your binary and stores auditing what you collect.',
      [
      lesson('What an Attacker Gets From Your Binary', 13, `
An \`.apk\` is a zip file. Rename it, unzip it, and about forty seconds later you are reading the insides of an app that took your team six months to build.

\`\`\`bash
unzip -l app-release.apk
#  AndroidManifest.xml           every permission, exported activity and deep link
#  classes.dex                   the thin Java shim around the engine
#  lib/arm64-v8a/libflutter.so   the engine itself
#  lib/arm64-v8a/libapp.so       your compiled Dart
#  assets/flutter_assets/        every file listed under assets: in pubspec.yaml
\`\`\`

### Obfuscation renames symbols, it does not hide strings

Chapter 5 shipped the release with \`--obfuscate --split-debug-info=build/symbols\`, which rewrites Dart class and method names into short meaningless ones. It leaves string literals exactly as you typed them, because the running program still has to compare and send them.

\`\`\`bash
strings lib/arm64-v8a/libapp.so | grep -E 'AIza|sk_live|https://api'
# AIzaSyD8h2Kq...
# https://api.cortexis.io/v1
# sk_live_51Nq8...
\`\`\`

A \`--dart-define=STRIPE_KEY=sk_live_...\` is a compile time constant, which means it is a byte sequence with a searchable prefix. Nobody decompiles to find these. They grep, and the whole search takes one command.

### The assets folder ships exactly as you wrote it

\`assets/config/staging.json\` holding a service account, \`assets/seed.db\` built from a production dump on the day someone was in a hurry, a private key someone dropped in \`assets/certs/\`: all copied verbatim into \`flutter_assets/\` and readable with \`unzip -p\`. Run \`unzip -l\` on your own release artifact and read the asset list line by line before every launch. Two minutes, and it has caught real incidents.

### iOS is not meaningfully harder

An \`.ipa\` is a zip too, and the Dart snapshot sits in \`Payload/Runner.app/Frameworks/App.framework/App\`. Apple encrypts the main binary for store downloads, but dumping the decrypted image out of a running process on a jailbroken phone is an off the shelf tool, not a research project.

### Anything the app decides about itself can be inverted

\`apktool d\`, patch the check, rebuild, sign with the attacker's own key, install. A guard like \`if (!signatureMatches()) exit(0)\` is one branch, and a branch is one byte.

| What shipped | What it costs to read or defeat |
|---|---|
| Strings in \`libapp.so\` | Seconds, with \`grep\` |
| Bundled assets | Seconds, with \`unzip -p\` |
| Obfuscated program logic | Hours, with Frida and patience |
| A client side integrity check | One hook, once |
| Authorization done on your server | As hard as your server is |

The last row is the entire lesson. The device is not somewhere you can keep a secret or enforce a rule. It is somewhere you render a UI and hold a short lived credential.

### The habits that follow

Keep credentials that matter on your backend and proxy the vendor API through it, so a phone carries a token scoped to one user instead of a key that works for every user. Keep tokens short lived and refreshable, as the auth client in Chapter 4 does. Then make CI grep the built artifact, so a new hardcoded key fails the build rather than shipping:

\`\`\`bash
flutter build apk --release --obfuscate --split-debug-info=build/symbols
unzip -p build/app/outputs/flutter-apk/app-release.apk 'lib/*/libapp.so' \\
  | strings | grep -Eq 'sk_live_|AKIA[0-9A-Z]{16}' && exit 1
\`\`\`

Archive \`build/symbols\` per release somewhere private. It is the map from obfuscated names back to yours, which is what makes a user's stack trace readable and also what an attacker would most like to have. It belongs in your artifact store, never in the app bundle and never in the repository.

One more rule: never publish a debug or profile build. Both carry a kernel snapshot instead of compiled machine code, so the Dart source structure is right there, and both open the VM service, which is a debugger port on a stranger's phone.
      `,
        [
          q('You build with --obfuscate and pass your payment key through --dart-define. What does an attacker have to do to read that key?', [
            'Decompile the obfuscated Dart, which takes specialist tooling',
            'Run strings over libapp.so and grep for the key prefix',
            'Break the FairPlay encryption on the store binary',
            'Attach a debugger while the payment screen is open',
          ], 1, 'Obfuscation only renames Dart symbols, so string literals including compile time constants stay in the binary as searchable plain text.'),
          q('Why is unzip -l on your own release artifact worth doing before every launch?', [
            'It proves the app bundle was signed with the upload key',
            'It reports the compressed download size the stores will show',
            'It verifies that obfuscation was actually applied to the build',
            'Everything under assets: ships verbatim, so a stray config or dump is visible',
          ], 3, 'Files declared in pubspec.yaml are copied into flutter_assets unchanged, so a bundled service account or seed database can be read straight out of the package.'),
          q('Your app refuses to run if its own signature does not match. Why is that not a security boundary?', [
            'The check is a branch in a binary the attacker can patch and re-sign',
            'Signature APIs are unavailable in release builds on both platforms',
            'Flutter runs Dart code before the native signature check happens',
            'Play App Signing changes the signature after every upload anyway',
          ], 0, 'Any decision the app makes about itself runs on hardware the attacker controls, so the guard can be inverted and the app repacked with their own key.'),
        ]
      ),
      lesson('Transport Security and Certificate Pinning', 13, `
A tester installs the Charles root certificate on a rooted Pixel, opens your app, and watches the login WebView's traffic in full while the API calls beside it show up as nothing at all. Nobody wrote a line of pinning code.

The reason is that \`dart:io\`'s \`HttpClient\`, which \`http\`, \`dio\` and most plugins sit on, has historically validated chains against root certificates compiled into the Dart runtime rather than the Android system trust store. Your \`network_security_config.xml\` governs the WebView and the native side. It does not govern Dart. Behaviour here has shifted between engine versions, so point a proxy at your own build and confirm which world you are in before you design around it.

### Start from the floor

Cleartext HTTP is already refused by default: Android 9 and later block it unless a network security config opts the domain in, and iOS App Transport Security blocks it unless you add an exception that App Review will ask you to justify. When someone asks for \`usesCleartextTraffic="true"\` to unblock a sprint, what they are asking for is every user's session token readable on hotel wifi.

### Pinning is a promise you keep for years

Pinning means refusing a chain that is otherwise perfectly valid because it does not end in a key you chose. The version that gets written first is not pinning at all:

\`\`\`dart
// Broken: accepts any certificate, including the proxy in the coffee shop.
dio.httpClientAdapter = IOHttpClientAdapter(
  createHttpClient: () => HttpClient()
    ..badCertificateCallback = (cert, host, port) => true,
);
\`\`\`

That line enters the codebase to make a self signed staging server work, usually behind a flag, and the flag gets flipped by a build config six weeks later. Grep for \`badCertificateCallback\` before every release.

Trusting only your own issuer takes a few lines and does not lie about what it does:

\`\`\`dart
final pem = await rootBundle.load('assets/certs/api-issuer.pem');

dio.httpClientAdapter = IOHttpClientAdapter(createHttpClient: () {
  final ctx = SecurityContext(withTrustedRoots: false)
    ..setTrustedCertificatesBytes(pem.buffer.asUint8List());
  return HttpClient(context: ctx);
});
\`\`\`

### The failure nobody rehearses

Pin the leaf certificate of an API served by Let's Encrypt and you have handed your app a 90 day fuse. Renewal day arrives, every installed copy starts refusing its own backend, and the remote kill switch you built for exactly this moment is delivered over the connection that just died. There is no fix that does not involve both stores and several days.

So pin the issuing CA or the public key, never the leaf. Ship at least two pins, the key in use and the successor you generated early and keep offline. Give the pin set an expiry date in code, after which the app falls back to ordinary system validation, so an install nobody has updated in a year degrades to as safe as everyone else instead of dead.

| Threat | Does pinning help |
|---|---|
| Fake certificate on hotel wifi | Yes |
| A misissued certificate from a public CA | Yes |
| A corporate MDM proxy | Yes, and expect support tickets |
| Frida running on the user's own phone | No |
| A leaked key inside your binary | No |

Those last two rows are why pinning is not a security programme on its own. It raises the cost for an attacker sitting on the network and for casual scrapers of your API. It does nothing at all about an attacker holding the device.

If you want a per key check in pure Dart rather than a native pinning package, hash the certificate you were actually served and compare it after the response headers arrive:

\`\`\`dart
final der = response.certificate!.der;
final pin = base64.encode(sha256.convert(der).bytes);
if (!allowedPins.contains(pin)) throw const PinMismatch();
\`\`\`

Be honest about what that buys. The handshake already completed and the request already left, so this catches a hostile endpoint before you read or trust the body, not before you speak. Native pinning packages abort during the handshake instead, which is why they exist.
      `,
        [
          q('A tester adds a proxy CA to the Android system trust store and sees WebView traffic but no API traffic. What explains the split?', [
            'Dio compresses request bodies, so the proxy cannot decode them',
            'The API calls are running on a background isolate the proxy misses',
            'dart:io validates against roots built into the Dart runtime, not the Android store',
            'Android blocks proxying for any request that carries an auth header',
          ], 2, 'Dart\'s own HTTP stack has carried its own root certificate list, so a user installed CA and network security config affect the WebView while leaving Dart traffic untouched.'),
          q('An app pins the leaf certificate of an API that renews every 90 days. What happens on renewal day?', [
            'Every installed copy refuses its own backend and cannot be fixed remotely',
            'Requests fall back to system validation and the app carries on',
            'Only devices that have not opened the app for 90 days are affected',
            'The TLS handshake succeeds but response bodies fail to decode',
          ], 0, 'A pin to a rotating leaf key stops matching the moment the certificate is replaced, and the remote config that would disable it travels over the same broken connection.'),
          q('Which threat does certificate pinning do nothing about?', [
            'A misissued certificate from a public certificate authority',
            'A fake certificate presented on an untrusted public network',
            'An attacker intercepting traffic with a proxy on the same wifi',
            'An attacker hooking your app with Frida on their own device',
          ], 3, 'Pinning constrains which keys the network layer accepts, but someone who controls the device can patch the check out of the running process entirely.'),
        ]
      ),
      lesson('Device Integrity and Biometric Gates', 13, `
\`if (await isDeviceRooted()) exit(0);\` looks like a security control. It is a Frida one liner: hook the method, return false, move on. What it reliably achieves is a one star review from a developer running LineageOS who paid for your app and cannot open it.

Every check that runs on the device is a signal, not a gate. A signal is only worth anything once a server has looked at it and decided something.

### Attestation is a conversation with your backend

Play Integrity on Android and App Attest on iOS both work the same shape. The app asks the platform for a token, sends that token along with the request, and your server verifies it with Google or Apple and reads the verdict. Android returns \`appRecognitionVerdict\` (\`PLAY_RECOGNIZED\` means the binary is the one Play signed, so a repacked copy fails) and \`deviceRecognitionVerdict\` (\`MEETS_DEVICE_INTEGRITY\` for a stock, unrooted device).

\`\`\`dart
final nonce = await api.startWithdrawal(amount: 25000);   // server issues it
final token = await IntegrityManager.requestToken(nonce: nonce);
await api.confirmWithdrawal(nonce: nonce, integrityToken: token);
\`\`\`

The nonce has to come from your server and be bound to that specific request. Skip it and an attacker captures one token from a clean device and replays it forever from an emulator farm.

Decide your policy per action, because these calls cost latency and sit under a quota. Reading a course list should not block on attestation. Moving money should, and should fail closed when the verdict is missing.

### A boolean is not a lock

\`\`\`dart
// Broken: the secret was readable the whole time.
if (await auth.authenticate(localizedReason: 'Unlock your wallet')) {
  final session = await storage.read(key: 'session');
  showBalance(session);
}
\`\`\`

\`local_auth\` returns a bool, and on a device the attacker controls, a bool is the easiest thing in the world to change. The prompt decided whether you would ask for the token. It never protected the token.

The fix is to make authentication the condition on which the key material is released, so failing the prompt leaves you with ciphertext. That is \`setUserAuthenticationRequired(true)\` on an Android Keystore key and a \`SecAccessControl\` with \`.biometryCurrentSet\` on iOS, exposed by packages such as \`biometric_storage\`.

### Where your secure storage actually lives

\`flutter_secure_storage\` gives you a different and equally important dial, the Keychain accessibility class:

| Accessibility | Readable when | Leaves this phone |
|---|---|---|
| \`unlocked\` | Device unlocked | Yes, via encrypted backup |
| \`first_unlock\` | After first unlock, including background | Yes, via encrypted backup |
| \`first_unlock_this_device\` | After first unlock | No, hardware bound |

Ship a session token under the default and a user who restores an iCloud backup onto a second phone arrives already logged in as themselves. That is convenient right up to the moment the second phone belongs to someone else. Use the device bound variant for anything that authenticates a person.

\`\`\`dart
const storage = FlutterSecureStorage(
  iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock_this_device),
  aOptions: AndroidOptions(encryptedSharedPreferences: true),
);
\`\`\`

Also invalidate on enrollment change. If the key survives a new fingerprint being added, then anyone who knows the device passcode can enroll their own finger and become the user. \`.biometryCurrentSet\` on iOS and \`setInvalidatedByBiometricEnrollment(true)\` on Android make the key vanish instead, and your app treats that as a re-login.

### The small things that leak

Handle the real \`local_auth\` error codes rather than treating everything as a denial: \`NotEnrolled\`, \`LockedOut\`, \`PermanentlyLockedOut\` and \`NotAvailable\` need different messages, and \`stickyAuth: true\` stops a backgrounded prompt cancelling itself. Decide deliberately whether device passcode fallback is allowed, since \`biometricOnly: true\` locks out users who cannot use biometrics at all.

Then cover the window. Android needs \`FLAG_SECURE\` to keep the balance screen out of the app switcher thumbnail and out of screenshots. iOS needs you to paint an opaque overlay when the lifecycle state goes inactive, because the system snapshots your screen on the way to the background and stores it on disk.
      `,
        [
          q('Where does a Play Integrity or App Attest verdict have to be evaluated to be worth anything?', [
            'In the app, before the request is built, so bad devices never call out',
            'On your server, which verifies the token with Google or Apple',
            'In the platform channel, which signs the result before Dart sees it',
            'In the store console, which blocks installs on failing devices',
          ], 1, 'The token is only meaningful once a party the attacker does not control verifies it, so the decision to refuse the action belongs to your backend.'),
          q('Why is gating a screen on the bool that local_auth returns weak protection?', [
            'The prompt can be dismissed by rotating the device mid authentication',
            'Biometric matching happens in Dart, so the comparison is visible',
            'The secret was already decryptable, and the branch is trivially patched',
            'The result is cached for the session, so later reads skip the prompt',
          ], 2, 'A boolean only decides whether you choose to read the secret, so binding key release to authentication in the Keystore or Keychain is what actually protects it.'),
          q('A session token is stored with the default Keychain accessibility. What does that allow?', [
            'An encrypted backup restored onto another phone arrives already signed in',
            'Any app in the same vendor group can read the token directly',
            'The token becomes readable while the device is locked in the background',
            'The token is dropped whenever the user changes their passcode',
          ], 0, 'Items that are not marked device bound travel in encrypted backups, so a restore onto different hardware carries a working session with it.'),
        ]
      ),
      lesson('Permissions, Privacy Manifests, and Data Safety', 13, `
Two hours after uploading build 41, an automated email arrives: \`ITMS-91053: Missing API declaration\`, naming \`NSPrivacyAccessedAPICategoryUserDefaults\`. No human rejected you and no review queue is involved. Nothing in your Dart code touches user defaults either. \`shared_preferences\` does.

### The manifest you ship is not the manifest you wrote

Every plugin contributes to \`AndroidManifest.xml\` and \`Info.plist\`, and the merged result is what the store reads. Look at it:

\`\`\`bash
flutter build apk --release
grep -o 'android.permission.[A-Z_]*' \\
  build/app/intermediates/merged_manifests/release/AndroidManifest.xml | sort -u
\`\`\`

Teams find \`READ_CONTACTS\` from an abandoned share plugin, \`QUERY_ALL_PACKAGES\` from a payments SDK, and \`AD_ID\` pulled in transitively by Play Services. Each one has a cost: \`AD_ID\` alone drags you into the advertising identifier section of the Data safety form, and background location triggers a declaration form and a demo video. Remove what you do not use:

\`\`\`xml
<manifest xmlns:tools="http://schemas.android.com/tools">
  <uses-permission android:name="android.permission.READ_CONTACTS" tools:node="remove" />
  <uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove" />
\`\`\`

### Privacy manifests are mechanical, and that is good news

Apple requires a \`PrivacyInfo.xcprivacy\` declaring a reason code for each required reason API you touch, plus a signed manifest from each third party SDK on their list. The ones a normal Flutter app trips are predictable:

| API category | Pulled in by | Usual reason code |
|---|---|---|
| \`UserDefaults\` | \`shared_preferences\` | \`CA92.1\` |
| \`FileTimestamp\` | \`path_provider\`, image caches | \`C617.1\` |
| \`DiskSpace\` | download and export features | \`E174.1\` |
| \`SystemBootTime\` | analytics and performance SDKs | \`35F9.1\` |

If a plugin on Apple's list has not shipped its own \`.xcprivacy\`, you cannot fix that from your app target. Upgrade the plugin or replace it, and check with \`find ios -name '*.xcprivacy'\` after \`pod install\` so you learn it at your desk instead of from an upload rejection.

### Declare what your SDKs do, not what you intended

The Play Data safety form and Apple's nutrition labels ask what leaves the device, and reviewers compare your answers against observed traffic. Your code may never read a device identifier while Crashlytics collects one, your ad SDK collects the advertising ID, and your analytics SDK ships an IP address that counts as approximate location. Answer for the whole binary. A mismatch is an app removal, not a warning email.

Three more that catch teams late:

- \`POST_NOTIFICATIONS\` is a runtime permission from Android 13, so an app that used to just show notifications now has to ask and to handle a no.
- Touching the IDFA needs \`NSUserTrackingUsageDescription\` and an App Tracking Transparency prompt shown first, every time.
- If you offer account creation you must offer in app account deletion plus a public URL, under Apple guideline 5.1.1(v) and Play's data deletion policy.

### Make the machine notice

Permission creep arrives through a dependency bump, so catch it where dependency bumps happen:

\`\`\`bash
grep -o 'android.permission.[A-Z_]*' \\
  build/app/intermediates/merged_manifests/release/AndroidManifest.xml \\
  | sort -u > /tmp/actual.txt
diff /tmp/actual.txt tool/allowed-permissions.txt || {
  echo 'New permission added by a dependency. Justify it or remove it.'; exit 1; }
\`\`\`

Ten lines in CI, and the day someone upgrades a plugin that wants the camera, the pipeline says so. Without it, the first person to notice is a reviewer, and by then you are explaining a permission you did not know you had, on the release day you promised marketing.
      `,
        [
          q('The Play console lists a permission your team never declared. What is the most likely source?', [
            'Gradle adds common permissions when shrinking is enabled',
            'Debug manifests are merged into release builds by default',
            'The store adds permissions implied by your Data safety answers',
            'A plugin\'s manifest was merged into yours during the build',
          ], 3, 'Plugins contribute manifest entries that merge into the final package, so the shipped permission set is the merged output rather than the file you edited.'),
          q('Your upload is rejected for a missing required reason API declaration, but your Dart code never calls it. Why?', [
            'Apple scans for the API in the engine, which always links it',
            'A dependency such as shared_preferences uses it on your behalf',
            'Any app storing data on disk must declare the whole category list',
            'The reason code expires and has to be renewed for each release',
          ], 1, 'Required reason APIs are detected in the binary you ship, so a plugin touching user defaults or file timestamps obliges you to declare it.'),
          q('What should the Play Data safety form describe?', [
            'Only the fields your own code sends to your own backend',
            'Only data the user can see inside the app\'s account screen',
            'Everything the shipped binary collects, third party SDKs included',
            'Whatever your privacy policy already says, copied across',
          ], 2, 'Reviewers compare the declaration against observed traffic, so identifiers gathered by crash, ad and analytics SDKs count as collection by your app.'),
        ]
      ),
      ],
      [
      q('Which single principle connects binary inspection, repacking, root detection and pinning bypass?', [
        'Any rule enforced on the device is advisory, so authorization lives on the server',
        'Release builds must always be obfuscated before they reach a store',
        'Encryption at rest is what determines whether an app is secure',
        'Third party SDKs are the origin of nearly all mobile vulnerabilities',
      ], 0, 'The attacker owns the hardware your checks run on, so only a party they do not control can decide whether an action is allowed.'),
      q('Your app pins its API certificate and obfuscates its release build. What have you not addressed?', [
        'Interception by a proxy on a shared wifi network',
        'A certificate misissued to your domain by a public CA',
        'Traffic being downgraded to cleartext by an attacker',
        'A vendor key compiled into the binary and greppable',
      ], 3, 'Pinning secures the channel and obfuscation renames symbols, while a hardcoded key stays readable as plain text inside libapp.so.'),
      q('Where does a rooted device get caught in a well built app?', [
        'In a startup check that exits the app when root is detected',
        'On the server, when it verifies an attestation token bound to a nonce',
        'In the Keychain, which refuses to return items on rooted hardware',
        'At install time, since stores block rooted devices from downloading',
      ], 1, 'Attestation is signed by the platform and checked by your backend, so the verdict cannot be flipped by patching the app the way a local check can.'),
      q('Which pair of mistakes is most likely to surface only after upload rather than during development?', [
        'An unhandled biometric error and a missing SafeArea',
        'A leaked API key and a permanently denied permission',
        'A merged plugin permission and a missing privacy manifest reason',
        'A pinned leaf certificate and an oversized app bundle',
      ], 2, 'Both are properties of the merged, built artifact rather than of code you run locally, so the store pipeline is usually the first thing to complain.'),
      ]
    ),
    chapter(
      'Life After Release: Versions, Migrations, and Upgrades',
      'Keeping an app healthy when dozens of versions are live at once and not one of them can be recalled.',
      [
      lesson('Migrating Local Schemas and Stored State', 13, `
Build 3.1 went out on a Tuesday. By Thursday the one star reviews all said the same sentence: "opened it and everything I had downloaded is gone". The migration had not crashed. It ran exactly as written.

\`\`\`dart
// drift, and a support queue waiting to happen
@override
MigrationStrategy get migration => MigrationStrategy(
  onUpgrade: (m, from, to) async {
    await m.deleteTable('lessons');
    await m.createAll();          // fresh, empty, and the outbox went with it
  },
);
\`\`\`

Wiping and rebuilding is defensible while the database is only a cache. The moment Chapter 9 made it the source of truth, that file also holds the outbox, so a wipe destroys writes the server has never seen. There is no way to get them back.

### Users arrive from anywhere, not from the previous build

Your store console will show installs from builds you forgot existed. Someone opens the app after eight months, the store updates it in one hop, and your migration is handed \`from: 2, to: 6\`. Write steps that chain, each guarded by the version that introduced it.

\`\`\`dart
onUpgrade: (m, from, to) async {
  if (from < 3) await m.addColumn(lessons, lessons.downloadedAt);
  if (from < 4) await m.createTable(outbox);
  if (from < 5) await m.createIndex(Index('idx_outbox_created', 'CREATE INDEX ...'));
  if (from < 6) await m.alterTable(TableMigration(lessons));
},
\`\`\`

A \`switch (from)\` with one case per version is the version of this that ships broken, because a jump from 2 to 6 executes a single case and skips four. Guarded \`if\` steps run every step the device has missed, in order.

SQLite only stamps the new \`user_version\` when the surrounding transaction commits. Kill the app halfway and the next launch re-runs the whole migration from the stored version, which is the behaviour you want, and it is also why every step must be safe to run against a database that has never seen it.

### Do not use your generated classes inside an old migration

This is the drift bug people hit twice before they learn it.

\`\`\`dart
// step for schema 4, written against today's model
await m.createTable(outbox);      // outbox as it looks in build 12, not build 6
\`\`\`

The generated table classes always describe the newest schema. Add a column to \`outbox\` a year later and this line quietly starts creating a different table for anyone upgrading from build 5. Migrations are history, so write them against a frozen snapshot (\`drift_dev schema dump\`) or in raw SQL that spells out the columns as they were.

### The cost nobody measures

\`ALTER TABLE ADD COLUMN\` is effectively free in SQLite. A table rebuild is not: copying 40,000 lesson rows into a new shape took roughly 2.4 seconds on a Moto G7, on the thread that draws the first frame. Android's ANR watchdog fires at 5 seconds and your slowest users are exactly the ones with the most rows. Run heavy migrations behind a progress screen, or in a background isolate, and log how long each step took.

### SQLite is not your only store

| Store | Version hook | What bites |
|---|---|---|
| drift or sqflite | schemaVersion and onUpgrade | destructive fallbacks, skipped steps |
| shared_preferences | none, you own it | \`getInt\` on a key you used to store as String returns null |
| flutter_secure_storage | none | restored Android backups arrive without the keystore key, so reads fail |
| files in app support | none | absolute paths persisted last release no longer resolve |

Give preferences their own integer key, \`prefs_schema\`, and migrate them with the same chained steps. For secure storage, treat a decrypt failure as "log the user out", never as a crash.

Finally, decide what happens on downgrade. A tester sideloads last month's APK, \`from\` is greater than \`to\`, and sqflite throws by default. Clearing derived caches while preserving the outbox is usually right. Whatever you choose, prove it: keep a real v2 database file as a test fixture, open it in CI with the current code, and assert the row counts survive.
      `,
        [
          q('A phone updates in one hop from build 12 (schema 2) to build 40 (schema 6). Which onUpgrade shape survives that jump?', [
            'A switch on `from` with one case per schema version',
            'A chain of `if (from < n)` steps that all run in order',
            'Deleting every table and calling createAll for the new shape',
            'Running `to - from` generic rebuild passes over the file',
          ], 1, 'Guarded if steps execute every version the device missed, while a switch runs a single case and silently skips the four migrations in between.'),
          q('Why is it a bug to build a schema 4 migration out of your current generated drift table classes?', [
            'Generated classes cannot be used before runApp has been called',
            'The migration runs outside a transaction, so the write is lost',
            'Companions insert rows, and a migration may only alter columns',
            'Those classes track today\'s schema, so the old step changes meaning later',
          ], 3, 'A migration is history and must describe the table as it was, so add a column a year later and the step quietly creates a different shape for anyone still upgrading from build 5.'),
          q('Once the local database is the source of truth, what does a wipe and rebuild migration actually destroy?', [
            'Queued outbox writes the server has never received',
            'The signing identity the app uses to talk to the API',
            'The user\'s session token and their saved biometric gate',
            'The compiled defaults the app falls back to when offline',
          ], 0, 'The outbox lives in the same file, so dropping tables throws away intent the user created offline and no retry can recover it.'),
        ]
      ),
      lesson('API Contracts for Clients You Cannot Recall', 13, `
Ninety days after 4.0 shipped, 11% of daily sessions still came from a 3.x build and 0.9% from something released two years earlier. Those users are not stubborn. Some have auto update off, some are on a phone the new build no longer supports, and some simply never open the store. You cannot recall a single one of them, so every server change is a change against clients that are already frozen.

The backend renamed \`cover_url\` to \`coverImageUrl\` in one deploy. Nothing crashed. Nothing alerted. Every build older than 4.0 just drew grey rectangles where the course covers used to be, for a week.

### Three time bombs in one constructor

\`\`\`dart
factory Course.fromJson(Map<String, dynamic> j) => Course(
  id: j['id'] as String,
  title: j['title'] as String,                      // throws once title is nullable
  level: Level.values.byName(j['level'] as String), // throws on a new value
  weeks: j['weeks'] as int,                         // throws when the server sends 8.0
);
\`\`\`

Every one of those lines is a promise about a payload you do not control. The tolerant version keeps the promise only where the screen genuinely cannot render without the field.

\`\`\`dart
factory Course.fromJson(Map<String, dynamic> j) => Course(
  id: j['id'] as String,                                   // no id, no row, fair enough
  title: (j['title'] as String?) ?? 'Untitled',
  level: Level.values.asNameMap()[j['level']] ?? Level.unknown,
  weeks: (j['weeks'] as num?)?.toInt() ?? 8,
);
\`\`\`

Ship the \`unknown\` enum member on day one, before you need it, and make the UI degrade around it: hide the badge, do not throw. An enum is the field servers extend most often and the field clients handle worst.

### What is actually safe to change

| Server change | What an old client does | Safe |
|---|---|---|
| Add an optional field | ignores the key | yes |
| Add an enum value | fine only if clients already fall back | conditional |
| Make a required field nullable | non-null cast throws | no |
| Rename a field | silent nulls, blank UI, no alert | no |
| Narrow a type, string id to int | cast throws on parse | no |
| Delete an endpoint | dead screen for anyone left on it | not until they drain |

The renaming row is the dangerous one because it fails silently. Additive evolution is the whole discipline: add \`coverImageUrl\`, keep writing \`cover_url\` alongside it, and remove the old key only when telemetry says nobody reads it.

### One bad row must not empty the screen

\`\`\`dart
final courses = <Course>[];
for (final raw in payload['items'] as List) {
  try {
    courses.add(Course.fromJson(raw as Map<String, dynamic>));
  } catch (e, s) {
    Sentry.captureException(e, stackTrace: s);   // tagged with the app build
    continue;
  }
}
\`\`\`

Parsing the list as one unit means a single malformed course blanks the catalogue. Parsing per item costs you one missing tile and gives you a stack trace instead of a review.

### Measure who is left before you break anything

Send \`X-App-Build: 412\` on every request and record it. Then "can we drop the v1 catalogue response" stops being an argument and becomes a query: v1 is 0.3% of sessions over the last 14 days, and every one of those builds is below the forced upgrade floor in Topic 3, so they will be walled anyway. Announce a sunset date in a response header, watch the number fall, then delete.

URL versioning (\`/v2/courses\`) is not free. Each live version is a code path someone has to test on every deploy. Prefer one endpoint that only grows, and reserve a new version for the change you truly cannot make additively.
      `,
        [
          q('The server starts sending a new level value, `expert`. Which client line keeps rendering the catalogue?', [
            '`Level.values.byName(j[\'level\'] as String)`',
            '`Level.values.firstWhere((e) => e.name == j[\'level\'])`',
            '`Level.values.asNameMap()[j[\'level\']] ?? Level.unknown`',
            '`Level.values[int.parse(j[\'level\'] as String)]`',
          ], 2, 'Looking the name up in a map and falling back to an unknown member turns an unrecognised value into a degraded badge rather than a thrown exception.'),
          q('Which server side change is safe to make while old builds are still in the wild?', [
            'Renaming cover_url to coverImageUrl in the response',
            'Making a field that was always present nullable',
            'Narrowing an id from a string to an integer',
            'Adding an optional field that older builds ignore',
          ], 3, 'An added key is simply not read by a frozen client, whereas renames, loosened nullability and narrowed types all break parsing or blank the UI on builds you cannot recall.'),
          q('Why parse a list of courses item by item inside a try/catch rather than as one unit?', [
            'Per item parsing avoids holding the whole payload in memory',
            'One malformed row costs a tile instead of blanking the screen',
            'It lets the parser run off the UI isolate without extra code',
            'The catch block is what attaches the app build to the request',
          ], 1, 'Isolating the failure keeps the rest of the catalogue on screen and turns a contract break into a stack trace you receive rather than a review you read.'),
        ]
      ),
      lesson('Remote Config, Kill Switches, and Forced Upgrades', 13, `
The new checkout went live at 09:40. By 09:58 crash free sessions had fallen from 99.7% to 94%. Halting the staged rollout stops new installs and does nothing for the users who already have the build. A fix through review is hours away on Android and can be a day on iOS. The only lever that works in minutes is a value your app already reads at launch.

\`\`\`dart
final remote = FirebaseRemoteConfig.instance;

await remote.setDefaults(const {
  'checkout_v2_enabled': false,     // compiled in, so a first launch offline is sane
  'min_supported_build_android': 0,
  'sync_batch_size': 25,
});

await remote.setConfigSettings(RemoteConfigSettings(
  fetchTimeout: const Duration(seconds: 5),
  minimumFetchInterval: const Duration(hours: 6),
));

unawaited(remote.fetchAndActivate());   // never block the first frame on this
\`\`\`

Two details carry most of the value. Compiled defaults mean a device that has never reached your config service still behaves, and roughly one launch in two hundred is exactly that device. The five second timeout means a slow config server costs you stale values, not a white screen.

Setting \`minimumFetchInterval\` to zero because you want changes instantly is the classic own goal: the service starts throttling the client, and the thing that stops working is your kill switch.

### Fetching is not activating

Values that swing in mid session leave half the widget tree on the old config and half on the new. Fetch during the session, activate on the next cold start, and make one exception: a kill switch should take effect the moment it lands, because the whole point is not waiting.

Host the emergency flags somewhere that cannot fall over with the API. A static JSON file on a CDN with a 60 second cache, plus the last known good values written to disk, means a kill switch that still works during the outage it exists for.

### The upgrade wall, and how it bricks people

\`\`\`dart
final min = remote.getInt(Platform.isIOS
    ? 'min_supported_build_ios'
    : 'min_supported_build_android');

if (currentBuild < min) {
  runApp(const UpgradeWall());   // no other route is reachable
  return;
}
\`\`\`

Three things go wrong here in practice.

Comparing version strings instead of build numbers: \`'3.10.0'.compareTo('3.9.0')\` is negative, so 3.10 is treated as older than 3.9 and your newest users get walled. Compare integers.

Using one floor for both platforms: iOS and Android build numbers are separate counters, and a shared key walls a whole platform the day they drift apart.

Walling users who cannot comply: if the current release needs iOS 16 and the device is on 14, the store has nothing to offer them and the wall is permanent. Read the minimum OS you actually ship, and for those devices show a read only mode or a plain message instead of a dead end.

### Flags are not all the same thing

| Flag | Safe default | Lifetime |
|---|---|---|
| \`checkout_v2_enabled\` kill switch | false | delete once the fix ships |
| \`new_home_enabled\` release gate | false | delete at 100% |
| \`sync_batch_size\` ops dial | conservative value | permanent |
| \`min_supported_build_*\` floor | 0 | permanent |

A gate that has sat at 100% for six months is dead code with two branches, one of which nobody tests any more. Keep a list with a name, an owner, and a remove by date, and treat deleting a flag as part of shipping the feature rather than a chore for later.

Every read needs a default that keeps the app usable when config never arrives. Write the flag so that the safe path is the one you get when the network is silent.
      `,
        [
          q('What happens if you set minimumFetchInterval to zero in a production build so flags apply instantly?', [
            'Values activate mid session and the widget tree rebuilds',
            'Compiled defaults are ignored, so an offline launch fails',
            'The service throttles the client, so the kill switch stops working',
            'Fetches move to the platform thread and slow the first frame',
          ], 2, 'Remote config backends rate limit clients that poll constantly, and the flag you lose access to is exactly the one you need during an incident.'),
          q('A forced upgrade gate compares version strings and walls users on 3.10.0 while letting 3.9.0 through. What is the fix?', [
            'Compare an integer build number, held per platform',
            'Compare the strings after padding each part to two digits',
            'Read the installed version from the store listing instead',
            'Move the check after the config fetch has been activated',
          ], 0, 'String ordering puts 3.10.0 before 3.9.0, and build numbers are monotonic integers that already differ per platform, so comparing them removes the ambiguity entirely.'),
          q('Why should emergency flags be served from a static file on a CDN rather than your main API?', [
            'A CDN returns config faster, so the first frame is not delayed',
            'Flags read from the API cannot carry compiled in defaults',
            'Store policy requires kill switches to be hosted separately',
            'The kill switch must survive the outage it exists to handle',
          ], 3, 'If the flags live behind the service that is failing, the lever is unreachable exactly when you reach for it, so independent hosting plus cached last known good values is the point.'),
        ]
      ),
      lesson('Upgrading Flutter and the Dependency Tree', 13, `
One team sat on Flutter 3.3 for fourteen months because nobody could justify the time. The eventual jump to 3.24 took nine working days: a dead plugin with no maintained fork, a Gradle version that needed a newer Java, and 300 golden files that all shifted. A team doing one minor at a time spends an afternoon per upgrade and never has that week.

### Read pub outdated properly

\`\`\`text
$ flutter pub outdated
Package Name    Current  Upgradable  Resolvable  Latest
intl            0.17.0   0.17.0      0.18.1      0.19.0
firebase_core   2.4.1    2.24.2      2.24.2      3.6.0
image_picker    0.8.5    0.8.9       0.8.9       1.1.2
\`\`\`

Upgradable is what your own constraints already allow. Resolvable is what you could reach by loosening them. When Resolvable sits below Latest, as \`intl\` does here, something else in the tree is holding the ceiling down, and guessing which package is a waste of an hour:

\`\`\`bash
flutter pub deps --style=compact | grep intl
\`\`\`

Fix the blocker or accept the older version, but know which you are doing.

### Pin the SDK, not just the packages

An app commits \`pubspec.lock\`, a published package does not. That lock file is what makes your build reproducible, and it is worth nothing if the Flutter SDK floats. A CI job pinned to \`stable\` builds a different SDK than your laptop the day after a release, and you get an afternoon of "works on my machine" with no commit to blame. Pin the version in both places, with FVM locally and the same string in the workflow:

\`\`\`yaml
- uses: subosito/flutter-action@v2
  with: { flutter-version: '3.24.0', cache: true }
\`\`\`

\`dependency_overrides\` deserves suspicion. It silences the solver, not the incompatibility: the package still has to actually work with the version you forced. One override with a dated comment and an issue link is a bridge. Five of them is a build that will fail on someone else's machine for reasons nobody can explain.

### An upgrade that stays boring

1. One minor version per branch, with nothing else in it, so a bisect has something to find.
2. \`dart fix --apply\` first, which clears most of the mechanical deprecations for free.
3. Expect goldens to fail. Text shaping and rendering change between releases, so a one pixel shift across every file is normal. Look at the diff images, then regenerate with \`--update-goldens\`. Regenerating without looking turns your visual regression suite into a rubber stamp.
4. Build both platforms. Flutter upgrades drag their toolchain along: a new Android Gradle Plugin, a Kotlin bump, a higher \`platform :ios\` line in the Podfile.
5. Smoke test on the slowest real device you own before merging.

### The two costs that surprise people

| Signal | Where to check | What it costs |
|---|---|---|
| Plugin last published 18+ months ago | the pub.dev page | a fork you now maintain |
| Plugin raises \`minSdkVersion\` | its build.gradle | Android devices dropped from your install base |
| Renderer or engine change | the release notes | new jank on old hardware |
| Xcode minimum raised | the release notes | a macOS runner upgrade in CI |

The minSdk one is measurable before you merge: a Firebase bump that moves you from 21 to 23 is a rounding error for some apps and 4% of the install base for others. Your Play Console knows which you are.

Treat the first release after an SDK upgrade as risky even when the diff looks empty. Staged rollout at 5%, then watch crash free sessions grouped by OS version for a day, because the failures an engine change produces land on old hardware you do not have on your desk.
      `,
        [
          q('In flutter pub outdated, intl shows Resolvable 0.18.1 but Latest 0.19.0. What does that gap mean?', [
            'Version 0.19.0 has been retracted by its publisher',
            'Another package in the tree caps how far intl can move',
            'Your own pubspec constraint is pinning intl to 0.18.1',
            'The SDK you build with is too old for 0.19.0',
          ], 1, 'Resolvable is the best the solver can do after loosening your constraints, so anything short of Latest is a ceiling imposed by some other dependency you have to find first.'),
          q('Why is a dependency_overrides entry risky even when the build turns green immediately?', [
            'It silences the solver without making the package compatible',
            'Overrides are ignored in release mode, so CI and store differ',
            'Adding one stops pubspec.lock from being written at all',
            'Overridden packages are excluded from the analyzer\'s checks',
          ], 0, 'The constraint was a claim about compatibility, and forcing past it leaves the actual incompatibility in place to surface at runtime on a user\'s device.'),
          q('Every golden test fails by a pixel after a Flutter minor upgrade. What is the right response?', [
            'Pin the old SDK until the rendering difference is reverted',
            'Raise the golden comparison tolerance and keep the files',
            'Review the diff images, then regenerate with --update-goldens',
            'Delete the goldens and rewrite them as widget assertions',
          ], 2, 'Shaping and rendering do change between releases, so a deliberate look at the diffs before regenerating is what keeps the suite from becoming a rubber stamp.'),
        ]
      ),
      ],
      [
      q('Which pair of habits keeps a local schema migration trustworthy across skipped versions?', [
        'Rebuild tables each launch and keep the outbox in memory',
        'Bump schemaVersion per release and wipe on any mismatch',
        'Run migrations lazily on first read and skip old versions',
        'Chain guarded steps and test them against a real old file',
      ], 3, 'Steps guarded by the stored version replay everything a device missed, and running them against a saved v2 fixture in CI is the only proof that they still do.'),
      q('Why does sending an X-App-Build header on every request change how you retire an API version?', [
        'It lets the server return a payload shaped for that build',
        'It turns a removal argument into a measurement of who is left',
        'It stops old clients from reaching the deprecated endpoint',
        'It is what the store requires before a version can be sunset',
      ], 1, 'Knowing that v1 is 0.3% of sessions over 14 days replaces guessing with a threshold, and pairs with the forced upgrade floor that will move those builds anyway.'),
      q('Your next release requires iOS 16 and you raise the forced upgrade floor to it. What breaks for a user on iOS 14?', [
        'Their config fetch times out and falls back to defaults',
        'They keep the old build because the wall never activates',
        'The store offers nothing to install, so the wall is permanent',
        'Their local database downgrades and clears its cached rows',
      ], 2, 'A wall only works when the user can actually comply, so devices below your minimum OS need a read only mode or an explanation rather than a screen they can never pass.'),
      q('Why does the first release after a Flutter SDK upgrade deserve a slower staged rollout than a normal feature release?', [
        'Engine changes surface as new failures on old hardware',
        'Store review is stricter for builds made on a new SDK',
        'The lock file is rewritten, so dependencies are unverified',
        'Crash symbols take longer to upload for a fresh toolchain',
      ], 0, 'Renderer and toolchain changes ship with the SDK and their regressions land on devices you do not own, so a 5% rollout watched by OS version is how you find them cheaply.'),
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
    q('Your release build ships an API key in a Dart string. What does an attacker need to read it?', [
      'A jailbroken or rooted device and a debugger attached at runtime',
      'Nothing beyond the shipped binary, because strings survive compilation and are trivially dumped',
      'The signing key the bundle was published with',
      'A man in the middle proxy and a device that trusts a custom certificate',
    ], 1, 'A compiled binary is a distribution format, not a safe: anyone can pull the file and run strings over it, which is why a secret that ships is a secret that has leaked.'),
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
      q('A golden test of a lesson card passes on a laptop and fails in the nightly CI run, and the masked diff shows that only the "2 hours ago" label changed. Which fix removes the failure without weakening the test?', [
      'Raise the comparator tolerance until the label stops tripping it',
      'Call pumpAndSettle before expectLater so the text has settled',
      'Regenerate the golden with --update-goldens on every CI run',
      'Wrap the pump in withClock(Clock.fixed(...)) so the label is fixed',
    ], 3, 'The label is computed from the current time, so the render is non-deterministic until the clock is injected and pinned; widening the tolerance or regenerating on every run teaches the suite to accept genuine layout regressions as well.'),
    q('An outbox drain generates a fresh UUID for the Idempotency-Key on each retry of a queued enrolment. The first attempt reaches the server but its 201 response is lost on a network handover. What happens?', [
      'The op is parked as a permanent 4xx and never retried again',
      'The server creates a second enrolment, because the key it stored does not match',
      'The retry is refused as a duplicate and the queued row is dropped',
      'The drain breaks at that op and nothing else on the device syncs',
    ], 1, 'An idempotency key only suppresses duplicate work when it stays identical across every attempt, so it must be generated once when the user taps and stored on the outbox row rather than minted inside the retry loop.'),
    q('A scrolling grid logs build=3.6ms and raster=62ms per frame. The team adds const constructors, moves to ListView.builder and strips work out of build, and the timings do not move. Why?', [
      'Those changes cut UI-thread work, while the cost sits in offscreen save layers on the raster thread',
      'Frame timings only mean something in a debug build, not in a profile one',
      'const widgets stop being reused once the list has started scrolling',
      'A 120Hz panel makes the 8.3ms budget unreachable on that hardware',
    ], 0, 'Build and raster run on separate threads, so a flat build time with a tall raster time points at opacity layers, antialiased clips and stacked shadows that force the rasteriser to allocate and composite offscreen buffers, which no amount of cheaper build methods will fix.'),
    q('A wallet screen shows the balance only when local_auth.authenticate() returns true, then reads the session token out of secure storage. Why is that weak against someone holding the device?', [
      'authenticate() has to be called with stickyAuth: true before it can be trusted',
      'Biometrics must be re-checked on every read of the balance value',
      'The token was decryptable anyway, so patching the returned bool exposes it',
      'The token should sit under the default Keychain accessibility class',
    ], 2, 'The prompt only decided whether the app would go and ask for the token, so hooking that boolean hands the attacker the plaintext; binding key release to authentication with setUserAuthenticationRequired on Android or biometryCurrentSet on iOS leaves a bypassed check holding ciphertext.'),
    q('A migration rebuilds a 40,000 row table and the OS kills the app three seconds in. What does the next launch do, and what does that demand of every step you write?', [
      'It resumes at the interrupted step, so later steps may assume the earlier ones ran',
      'It skips ahead to the new schema version, so the rebuild needs re-triggering by hand',
      'It falls back to a fresh empty database, so the outbox has to be backed up first',
      'It re-runs the migration from the stored version, so every step must be repeatable',
    ], 3, 'SQLite stamps the new user_version only when the surrounding transaction commits, so an upgrade killed halfway leaves the old version on disk and the whole chain runs again on the next launch, which is safe only if each guarded step tolerates being applied a second time.'),
    q('A routine plugin bump quietly merges com.google.android.gms.permission.AD_ID into your release manifest. What is the real consequence, and where is it caught cheaply?', [
      'Nothing changes for the store, though a lint rule in the app module would flag it',
      'It pulls you into the advertising ID part of Data safety, and a CI diff of the merged manifest flags it',
      'The upload fails outright, and flutter pub outdated would have listed the permission',
      'It only affects the iOS privacy manifest, and pod install would have surfaced it',
    ], 1, 'Permissions arrive through dependencies rather than through your own code, and the store forms must describe the whole binary rather than your intentions, so diffing the merged manifest against an allow list in CI is what catches the change before a reviewer does.'),
  ],
});
