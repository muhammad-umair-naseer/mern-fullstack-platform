import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: "react-native",
  title: "React Native Mobile Development",
  category: "Mobile",
  level: "Intermediate",
  duration: "8 weeks",
  accent: "cyan",
  coverKey: "react-native",
  summary:
    "Take the React you already know and ship a real app to both the App Store and Google Play from one codebase.",
  description:
    "You build screens with native components, wire up navigation and real data, and handle the mobile-specific problems web React never prepared you for. By the end you have a signed release build on both platforms.",
  chapters: [
    chapter(
      "From React to React Native",
      "What carries over from web React, what does not, and how to get a project running.",
      [
        lesson("The Same React, a Different Renderer", 12, `
If you know React, you already know most of React Native. Components, props, state, hooks, and the render cycle are **identical** — it is the same React library. What changes is what your components render *to*.

On the web, React renders to the DOM: \`div\`, \`span\`, \`p\`. In React Native, React renders to **actual native views** — a \`UIView\` on iOS, an \`android.view.View\` on Android. There is no DOM and no browser.

### The component swap

Every HTML element you reach for has a native equivalent:

| Web | React Native | Notes |
|---|---|---|
| \`<div>\` | \`<View>\` | The generic container |
| \`<p>\`, \`<span>\`, \`<h1>\` | \`<Text>\` | **All** text must be inside \`<Text>\` |
| \`<img>\` | \`<Image>\` | Needs explicit dimensions |
| \`<input>\` | \`<TextInput>\` | |
| \`<button>\` | \`<Pressable>\` | |
| scrolling \`<div>\` | \`<ScrollView>\` / \`<FlatList>\` | |

\`\`\`jsx
import { View, Text } from 'react-native';

export default function Greeting({ name }) {
  return (
    <View>
      <Text>Hello, {name}</Text>
    </View>
  );
}
\`\`\`

### The rule that catches everyone

**Bare text outside a \`<Text>\` component crashes the app.** This is the single most common first-day error:

\`\`\`jsx
<View>Hello</View>              {/* Error: Text strings must be rendered within a <Text> */}
<View><Text>Hello</Text></View> {/* Correct */}
\`\`\`

On the web, a stray string just renders. Here it throws, because a native \`View\` genuinely cannot display characters — only a text view can.

### What does not exist

- **No CSS files, no class names.** Styling is JavaScript objects. No cascade, no inheritance (except text styles to nested \`Text\`).
- **No \`document\`, no DOM.** \`window\` does exist, but only as an alias for the JS global — nothing that queries or walks a document works.
- **No hover.** There is no cursor. Design for touch: press states, not hover states.
- **No \`localStorage\`.** Use \`AsyncStorage\` instead.

### Touch targets

A mouse pointer is one pixel; a fingertip covers roughly 10mm of glass. Apple's guidelines specify a **minimum 44x44 point** touch target; Google's Material guidelines specify **48x48 dp**. Design for the larger of the two. A 20px icon button that works fine with a mouse is genuinely difficult to tap. Give small controls padding rather than shrinking the tappable area — this is the most common accessibility failure in shipped mobile apps.
        `,
        [
          q('You port a web card that reveals a tooltip on onMouseEnter. What happens once it runs on a phone?', [
            'The tooltip shows whenever the card is on screen',
            'React Native maps hover events onto a long press',
            'Nothing reveals it, because a touch screen has no cursor',
            'The app crashes the first time the card renders',
          ], 2, 'There is no pointer on a touch device, so a hover event never fires; press states are the mobile equivalent and you wire the behaviour to press handlers instead.'),
          q('A 20px icon button is hard to tap. Which change follows the platform guidelines?', [
            'Keep the icon at 20px and add padding until the target reaches 48dp',
            'Scale the icon itself up to 48px so it matches Material sizing',
            'Leave it, since the guidelines only apply to text buttons and links',
            'Wrap it in a View, which makes the whole row tappable by default',
          ], 0, 'Apple asks for 44 by 44 points and Google for 48 by 48 dp, and padding grows the tappable area without changing how the icon looks on screen.'),
          q('Your web code reads saved settings from localStorage at startup. What replaces it here?', [
            'window.localStorage, which React Native polyfills for you',
            'document.cookie, the only storage the runtime still exposes',
            'sessionStorage, since nothing persistent exists on device',
            'AsyncStorage, read through a promise rather than synchronously',
          ], 3, 'There is no DOM and no localStorage in React Native, so AsyncStorage takes its place and every read returns a promise rather than a value.'),
        ]
      ),
        lesson("Expo or Bare: Choosing a Workflow", 11, `
Your first real decision is how the project is built and run. There are two paths, and picking the wrong one costs you weeks.

### Expo

Expo is a managed toolchain around React Native. You write JavaScript; Expo handles the native build.

\`\`\`bash
npx create-expo-app@latest my-app
cd my-app
npx expo start
\`\`\`

Scan the QR code with the Expo Go app and your project runs on a real phone in seconds — **no Xcode, no Android Studio**.

What you get:
- Instant setup, no native toolchain
- Over-the-air updates: ship JS fixes without an app-store review
- A large library of vetted native modules (camera, location, notifications)
- Builds in the cloud via EAS, so you can produce an iOS build without a Mac

### Bare React Native

\`\`\`bash
npx @react-native-community/cli init MyApp
\`\`\`

You get the \`ios/\` and \`android/\` native project folders and full control — any native module, any custom native code.

The cost: you maintain the native build yourself. Xcode and Android Studio become required, and upgrading React Native versions means reconciling changes across native files.

### Which to pick

| Situation | Choose |
|---|---|
| Learning, prototyping, most apps | **Expo** |
| No Mac available but need iOS builds | **Expo** (EAS builds) |
| Need a native SDK Expo does not support | Bare |
| Existing native app adding RN screens | Bare |

Start with Expo. The old advice that "real apps outgrow Expo" is largely obsolete — the config-plugin system and development builds let you add custom native code while keeping the managed workflow. And if you genuinely must leave, \`npx expo prebuild\` generates the native folders for you.

Choosing bare "to be safe" is the classic mistake: you pay the maintenance cost immediately for flexibility you probably never need.

### Running on a device

Test on **real hardware early**, not just the simulator. Simulators lie about performance, they have no real network variability, and they cannot show you how the app behaves with a notch, a small screen, or a slow processor.
        `,
        [
          q('A team starts a new app and picks bare React Native to be safe. What do they pay on day one?', [
            'A slower JavaScript runtime than the managed workflow uses',
            'Ownership of the native build, including upgrades across ios and android',
            'A licence fee once the app is published to either store',
            'The loss of hot reloading, which only the managed workflow offers',
          ], 1, 'Bare hands you the native projects and all the maintenance that comes with them, so the upgrade cost starts immediately in exchange for flexibility the team may never use.'),
          q('You built on Expo and now need a native SDK that Expo does not wrap. What comes first?', [
            'Rewrite the app in bare React Native from scratch',
            'Ship the feature inside a web view rather than natively',
            'Wait until Expo adds official support for that SDK',
            'Use a config plugin or development build, and prebuild if you must leave',
          ], 3, 'Config plugins and development builds let you add custom native code while staying managed, and expo prebuild generates the native folders if you genuinely have to move off.'),
          q('Why is a simulator alone a poor way to judge whether the app is ready to ship?', [
            'It hides slow hardware, network variability and awkward screen shapes',
            'It cannot execute JavaScript, so only native screens render correctly',
            'It refuses to install any package that contains native code',
            'It draws iOS layouts using the Android view system instead',
          ], 0, 'Simulators run on desktop hardware over a desktop connection, so performance problems, flaky networks and notch or small screen issues stay invisible until real devices run the build.'),
        ]
      ),
        lesson("Styling with StyleSheet and Flexbox", 13, `
Styling is plain JavaScript objects. No stylesheets, no selectors, no cascade.

\`\`\`jsx
import { StyleSheet, View, Text } from 'react-native';

export default function Card({ title }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
\`\`\`

Property names are camelCase (\`backgroundColor\`, not \`background-color\`), and numeric values are **density-independent points**, not pixels — no \`'px'\` suffix.

### Flexbox, with two differences

Layout is Flexbox, but not quite the web's:

1. **\`flexDirection\` defaults to \`'column'\`**, not \`'row'\`. Phones are tall; this default is deliberate.
2. **Every \`View\` is already \`display: flex\`.** There is no \`display: block\` to opt out of.

\`\`\`jsx
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
\`\`\`

\`justifyContent\` works along \`flexDirection\`; \`alignItems\` works across it. Getting these backwards is the usual reason a layout "does nothing".

### Combining and conditional styles

The \`style\` prop accepts an array, and falsy entries are ignored:

\`\`\`jsx
<View style={[styles.card, isActive && styles.cardActive]} />
\`\`\`

Later entries win, so this is how you layer a variant over a base.

### Text does not inherit

\`\`\`jsx
{/* The color does NOT reach the Text */}
<View style={{ color: 'red' }}><Text>Hello</Text></View>

{/* Correct — style the Text itself */}
<View><Text style={{ color: 'red' }}>Hello</Text></View>
\`\`\`

Style inheritance does not exist between a \`View\` and its children. The one exception is nested \`Text\`, which does inherit from a parent \`Text\`.

### Screens are not all the same

\`\`\`jsx
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const columns = width > 600 ? 3 : 2;
\`\`\`

Use \`useWindowDimensions\` rather than the older \`Dimensions.get()\` — it re-renders on rotation and split-screen, where the static call returns a stale value.

Finally, keep content clear of notches, status bars, and home indicators. Use \`SafeAreaView\` from \`react-native-safe-area-context\` — React Native's own \`SafeAreaView\` has no effect on Android.
        `,
        [
          q('You write a View with style color red wrapping a Text that reads Total. What colour is Total?', [
            'Red, because View styles cascade down to every child',
            'Red on iOS and the default colour on Android',
            'The default colour, since a View passes no styles down',
            'Nothing renders, because color is invalid on a View',
          ], 2, 'Style inheritance does not exist between a View and its children, so the colour has to sit on the Text itself; only a nested Text inherits from a parent Text.'),
          q('The array style [styles.card, isActive && styles.cardActive] runs with isActive false. What happens?', [
            'It throws, because style arrays reject non objects',
            'The falsy entry is ignored and styles.card applies alone',
            'Every property that cardActive would set is reset to zero',
            'cardActive applies anyway, since arrays are merged blindly',
          ], 1, 'Falsy entries in a style array are skipped, which is exactly why the pattern works as a conditional variant, and later entries win whenever they are present.'),
          q('Why import SafeAreaView from react-native-safe-area-context instead of from react-native?', [
            'The built in version is deprecated and logs a warning on iOS',
            'The library version supports flexbox and the built in one does not',
            'Only the library version can be styled by StyleSheet.create',
            'The built in SafeAreaView has no effect at all on Android',
          ], 3, 'React Native\'s own component only applies insets on iOS, so on Android your content still slides under the status bar unless you use the community package.'),
        ]
      ),
            lesson('Two Threads and the Bridge Between Them', 13, `
A \`for\` loop that runs for 400ms in a click handler barely registers in a desktop browser. Put the same loop in a React Native screen and the list under the user's thumb keeps gliding while the rows arrive blank. Nothing crashed. Two threads simply disagreed about how busy they were.

### What runs where

| Thread | Runs | Owned by |
|---|---|---|
| JS | your components, hooks, handlers, \`JSON.parse\`, fetch callbacks | Hermes, the JavaScript engine |
| UI (main) | native layout, drawing, touch delivery, native driven animation | UIKit on iOS, the Android view system |
| Background pool | image decoding, sockets, disk reads | the platform |

At 60fps each frame gets 16.6ms. The UI thread usually meets that on its own, because scrolling a native list is native work. The JS thread is where your code lives, and it is single threaded, so anything expensive there blocks everything else your app wants to do in JavaScript: state updates, list rows, timers, your own gesture callbacks.

That is the whole explanation for the blank rows. The scroll never stalled. React simply could not produce the next cells while the parse held the thread.

### Hermes runs the bundle

Release builds ship precompiled bytecode rather than JavaScript source. Hermes loads that file and begins executing, skipping the parse and compile step that used to cost hundreds of milliseconds at launch on cheap Android hardware. It is the default engine, and it is a large part of why startup on a low end device is tolerable.

The trade is that Hermes optimises for startup and memory rather than peak throughput on long running numeric loops. Crunching numbers in JavaScript on device is slower than the same code in a desktop browser, sometimes by several times.

### The boundary is asynchronous

Web habits break here. This never works:

\`\`\`jsx
function Tab({ label }) {
  const ref = useRef(null);
  const width = ref.current?.offsetWidth;   // undefined, always
  return <View ref={ref}><Text>{label}</Text></View>;
}
\`\`\`

There is no DOM, so there is no \`offsetWidth\`, and the real measurement is computed on the other thread. You ask, and the answer arrives later:

\`\`\`jsx
function Tab({ label, onMeasured }) {
  return (
    <View onLayout={(e) => onMeasured(e.nativeEvent.layout.width)}>
      <Text>{label}</Text>
    </View>
  );
}
\`\`\`

The original architecture serialised every native call to JSON and flushed it in batches once per frame, which is where the word bridge comes from. The new architecture (JSI, Fabric and TurboModules) removes that serialisation and lets some calls run synchronously. The thread split stays either way, so code written against \`onLayout\` and callbacks keeps working, while code that assumes an instant answer does not.

### Budget the JS thread

Concrete numbers help. Parsing a 3MB JSON response takes roughly 300 to 500ms on a mid range Android phone. At 16.6ms per frame, that is 18 to 30 frames the user watches vanish.

\`\`\`jsx
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    setIndex(buildSearchIndex(courses));   // heavy, but the transition finished first
  });
  return () => task.cancel();
}, [courses]);
\`\`\`

Three habits keep the thread free. Page the API so no single response is enormous. Defer heavy transforms until navigation animations have finished. Keep \`console.log\` out of anything that runs per row, because serialising a large object for the debugger is real work on every single call.

One last surprise: a development build is slower than a release build, and not uniformly slower. Judge smoothness on a release build, on the cheapest phone you intend to support.
      `,
        [
          q('A FlatList shows blank rows for half a second while a large JSON payload is parsed. Why?', [
            'The JS thread is busy parsing, so it cannot render rows scrolling into view',
            'The UI thread is blocked, so the scroll gesture itself stops moving',
            'Hermes evicts mounted rows from memory whenever a parse runs',
            'FlatList pauses rendering until every network request has settled',
          ], 0, 'Row content is produced by your JavaScript, so while the JS thread is occupied the native scroll keeps moving but arrives at cells React has not been able to fill in.'),
          q('What does shipping Hermes bytecode instead of plain JavaScript source actually buy you?', [
            'Smaller downloads, because bytecode compresses better than text does',
            'Access to native modules without writing any bridging code at all',
            'Faster startup, because the engine skips parsing and compiling at launch',
            'Automatic multithreading for any component that renders a long list',
          ], 2, 'The bundle is compiled ahead of time, so at launch Hermes loads bytecode directly rather than parsing and compiling JavaScript source on the device itself.'),
          q('Why can a component not read a view\'s measured width the instant it renders?', [
            'Widths are only known once the next fetch call has resolved',
            'Layout is computed off the JS thread and comes back through onLayout',
            'StyleSheet.create freezes dimensions until the screen is focused',
            'Measurements stay unavailable unless the view sets collapsable false',
          ], 1, 'Layout happens on the native side and crosses the boundary asynchronously, so you wait for the onLayout callback rather than reading a value during render.'),
        ]
      ),
      ],
      [
        q("Why does <View>Hello</View> crash a React Native app?", [
          "View cannot have children",
          "A native view cannot render characters — text needs a <Text> component",
          "Strings must be wrapped in braces",
          "View requires a style prop",
        ], 1, "Native views have no text-rendering capability; only a text view does, so bare strings must sit inside <Text>."),
        q("What is flexDirection's default value in React Native?", [
          "'column'",
          "'row'",
          "'inherit'",
          "There is no default",
        ], 0, "It defaults to 'column' because phone screens are tall — the opposite of the web's 'row' default."),
        q("You have no Mac but need an iOS build. Best option?", [
          "Bare React Native",
          "Expo with EAS cloud builds",
          "Write it in Swift",
          "Ship Android only",
        ], 1, "Expo's EAS builds compile in the cloud, so an iOS binary does not require local Xcode."),
        q("Why prefer useWindowDimensions over Dimensions.get('window')?", [
          "It is faster",
          "It re-renders on rotation and split-screen instead of returning a stale value",
          "It returns pixels rather than points",
          "It works outside components",
        ], 1, "The static call is read once and never updates; the hook re-renders when dimensions actually change."),
      ]
    ),
    chapter(
      "Core Components and Lists",
      "The building blocks, and why long lists need a different component entirely.",
      [
        lesson("View, Text, Image, and Pressable", 12, `
Four components cover most of what you build.

### View

The generic container — a \`div\` equivalent. It handles layout, background, borders, and shadows.

\`\`\`jsx
<View style={{ padding: 16, borderRadius: 8, backgroundColor: '#f1f5f9' }}>
  {children}
</View>
\`\`\`

### Text

Everything readable. It supports nesting, and nested \`Text\` **does** inherit:

\`\`\`jsx
<Text style={{ fontSize: 16 }}>
  Total: <Text style={{ fontWeight: '700' }}>$42.00</Text>
</Text>

<Text numberOfLines={2} ellipsizeMode="tail">
  A long description that will be truncated after two lines...
</Text>
\`\`\`

\`numberOfLines\` is how you keep variable-length content from destroying a card layout.

### Image

Unlike the web, **an Image needs explicit dimensions** — there is no natural sizing to fall back on for remote images:

\`\`\`jsx
{/* Bundled asset: dimensions are known, size is optional */}
<Image source={require('./logo.png')} />

{/* Remote: width and height are REQUIRED or nothing appears */}
<Image
  source={{ uri: 'https://example.com/photo.jpg' }}
  style={{ width: '100%', height: 200 }}
  resizeMode="cover"
/>
\`\`\`

A remote image with no style is the classic "my image is invisible" bug. It rendered fine — at zero by zero.

\`resizeMode\` mirrors CSS \`object-fit\`: \`cover\` fills and crops, \`contain\` fits entirely, \`stretch\` distorts.

### Pressable

The modern touch handler, replacing the older \`TouchableOpacity\`:

\`\`\`jsx
<Pressable
  onPress={handlePress}
  hitSlop={8}
  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
  accessibilityRole="button"
  accessibilityLabel="Save changes"
>
  <Text style={styles.buttonText}>Save</Text>
</Pressable>
\`\`\`

Three things worth noting:
- \`style\` can be a **function** receiving \`{ pressed }\`, so press feedback needs no state.
- \`hitSlop\` expands the touchable area *beyond* the visual bounds — the correct way to make a small icon meet the 44pt target without making it look bigger.
- \`accessibilityLabel\` is what a screen reader announces. An icon-only button without one is announced as nothing at all.

### Give every press feedback

On a touch screen there is no hover, so a tap with no visual response feels broken. Users tap again, and you get duplicate submissions. Always change opacity, colour, or scale on press.
        `,
        [
          q('A 24pt icon button matches the design spec but users keep missing it. Which fix keeps the icon that size?', [
            'Wrap the icon in a ScrollView so its touch area grows',
            'Give the Pressable hitSlop so the touch area extends past it',
            'Set resizeMode to cover so the icon fills the whole button',
            'Add an accessibilityLabel, which enlarges the target for touch',
          ], 1, 'hitSlop expands the touchable region beyond the visual bounds, so the control can stay visually small while the tap target reaches the 44 point minimum.'),
          q('Your Save button fires a network call but shows no press feedback at all. What do users do?', [
            'They report the label as unreadable on dark backgrounds',
            'They wait patiently, since a header spinner is enough',
            'They swipe back, which cancels the request automatically',
            'They tap again, and you receive duplicate submissions',
          ], 3, 'Without a visible press state a tap feels like nothing happened, so people press repeatedly and the same request reaches your server more than once.'),
          q('A 16 by 9 photo sits in a square tile with resizeMode set to contain. What do you see?', [
            'The whole photo scaled down, with empty space above and below',
            'The photo cropped to a square, filling the tile edge to edge',
            'The photo stretched into a square, so faces look distorted',
            'Nothing at all, because contain requires a fixed pixel height',
          ], 0, 'contain fits the entire image inside the box while keeping its aspect ratio, so the leftover space stays empty; cover is the mode that crops to fill.'),
        ]
      ),
        lesson("ScrollView vs FlatList", 13, `
This is the single most consequential performance decision in a React Native app.

### ScrollView renders everything

\`\`\`jsx
<ScrollView>
  {items.map(item => <Row key={item.id} item={item} />)}
</ScrollView>
\`\`\`

Every child mounts immediately, whether visible or not. With 20 items that is fine. With 1,000 it means 1,000 native views built before the first frame — several seconds of frozen UI, and memory that may crash the app on a low-end device.

Use \`ScrollView\` **only** for a bounded amount of content: a settings screen, a form, an article.

### FlatList virtualises

\`\`\`jsx
<FlatList
  data={courses}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CourseCard course={item} />}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
  ListEmptyComponent={<Text>No courses yet</Text>}
/>
\`\`\`

\`FlatList\` renders only what is near the viewport and unmounts rows once they scroll far enough away — it destroys and recreates them rather than recycling them the way \`FlashList\` does. Memory stays flat whether the list holds 100 rows or 100,000.

### Built-in features you would otherwise rebuild

\`\`\`jsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(i) => String(i.id)}
  refreshing={isRefreshing}
  onRefresh={handleRefresh}        // pull-to-refresh
  onEndReached={loadMore}          // infinite scroll
  onEndReachedThreshold={0.5}
  ListHeaderComponent={<Header />}
  ListFooterComponent={isLoading ? <Spinner /> : null}
/>
\`\`\`

### Keep renderItem cheap

\`renderItem\` runs constantly during scrolling. Two rules:

\`\`\`jsx
// Define the row OUTSIDE, and memoise it
const CourseCard = React.memo(({ course }) => (
  <View style={styles.card}><Text>{course.title}</Text></View>
));

// Stable reference, not an inline arrow
const renderItem = useCallback(({ item }) => <CourseCard course={item} />, []);
\`\`\`

Defining the row component *inside* the parent recreates it every render, so React unmounts and remounts every visible row — the most common cause of janky scrolling.

### Fixed-height rows deserve getItemLayout

If every row is the same height, tell the list:

\`\`\`jsx
getItemLayout={(data, index) => ({ length: 72, offset: 72 * index, index })}
\`\`\`

This lets \`FlatList\` skip measurement entirely and jump directly to any offset, which makes \`scrollToIndex\` instant.

### The rule

If the list length is driven by data rather than by you, use \`FlatList\`. "It is only ten items for now" is how a scroll performance bug ships.
        `,
        [
          q('You render 1,000 rows inside a ScrollView. What actually happens on the first paint?', [
            'Only visible rows mount, and the rest mount as you scroll',
            'The bundler warns at build time and drops the extra rows',
            'All 1,000 native views are built before anything appears',
            'The list appears instantly but scroll events stop firing',
          ], 2, 'ScrollView mounts every child immediately, so a thousand rows means a thousand native views constructed before the first frame, freezing the UI and risking memory pressure.'),
          q('Which pair of FlatList props gives you pull to refresh behaviour?', [
            'refreshing and onRefresh',
            'onEndReached and onEndReachedThreshold',
            'ListHeaderComponent and ListFooterComponent',
            'getItemLayout and keyExtractor',
          ], 0, 'refreshing drives the spinner state while onRefresh fires when the user drags down; the onEndReached pair is what powers infinite scroll instead.'),
          q('Every row in your list is exactly 72 points tall. What does adding getItemLayout buy you?', [
            'It memoises renderItem so rows stop re-rendering on scroll',
            'The list skips measuring and can jump straight to any offset',
            'It recycles row views instead of unmounting them off screen',
            'It caches row data so scrolling keeps working while offline',
          ], 1, 'Telling the list each row\'s height in advance removes the measurement pass, which is what lets scrollToIndex land immediately instead of hunting for the row.'),
        ]
      ),
        lesson("Forms, Input, and the Keyboard", 12, `
Text entry on mobile has problems the web simply does not have — chiefly a keyboard that covers half the screen.

### Controlled input

\`\`\`jsx
const [email, setEmail] = useState('');

<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
  style={styles.input}
/>
\`\`\`

Note **\`onChangeText\`**, not \`onChange\` — it hands you the string directly rather than an event object.

### Configure the keyboard

These props are the difference between a pleasant form and an infuriating one:

| Prop | Use |
|---|---|
| \`keyboardType="email-address"\` | Adds \`@\` to the keyboard |
| \`keyboardType="numeric"\` | Number pad for quantities |
| \`keyboardType="phone-pad"\` | Phone entry |
| \`autoCapitalize="none"\` | **Essential** for email and username |
| \`secureTextEntry\` | Masks passwords |
| \`autoComplete="email"\` | Enables OS autofill |

Leaving \`autoCapitalize\` at its default on an email field produces \`Ali@example.com\` and a login that mysteriously fails. Combined with a case-sensitive server comparison, this is a real bug that reaches production regularly.

### The keyboard covering the input

\`\`\`jsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* form fields */}
  </ScrollView>
</KeyboardAvoidingView>
\`\`\`

The \`behavior\` genuinely differs by platform — \`padding\` on iOS, \`height\` on Android. Using one value for both leaves one platform broken.

\`keyboardShouldPersistTaps="handled"\` fixes a subtle bug: without it, the first tap on a button merely dismisses the keyboard and the button never fires. Users experience this as "I have to tap twice".

### Moving between fields

\`\`\`jsx
const passwordRef = useRef(null);

<TextInput
  returnKeyType="next"
  onSubmitEditing={() => passwordRef.current?.focus()}
  blurOnSubmit={false}
/>
<TextInput ref={passwordRef} returnKeyType="done" secureTextEntry />
\`\`\`

\`blurOnSubmit={false}\` stops the keyboard flickering shut and open as focus moves.

### Validate on blur, not on every keystroke

Showing "invalid email" while someone is still typing the third character is hostile. Validate when the field loses focus, then re-validate live once it has been marked invalid.
        `,
        [
          q('Sign ups keep arriving as Ali@example.com and those logins then fail. What went wrong in the form?', [
            'keyboardType was left at its default, so the at sign is missing',
            'secureTextEntry masked the field and altered the stored value',
            'onChange was used, so state holds an event rather than a string',
            'autoCapitalize was left at its default on the email field',
          ], 3, 'Mobile keyboards capitalise the first letter unless autoCapitalize is set to none, and a case sensitive comparison on the server then rejects an otherwise correct address.'),
          q('You set KeyboardAvoidingView behavior to padding on both platforms. What is the result?', [
            'Both platforms behave the same, since behavior is only a hint',
            'iOS ignores the value while Android shifts the screen upward',
            'iOS behaves correctly while Android is left with a broken layout',
            'The keyboard stays hidden until the field is tapped a second time',
          ], 2, 'padding is the value that works on iOS while Android needs height, so a single hardcoded value leaves one platform with the keyboard sitting over the input.'),
          q('Why pass blurOnSubmit false on a field that focuses the next input on submit?', [
            'It stops the keyboard closing and reopening as focus moves',
            'It prevents validation running before the field has been filled',
            'It keeps the return key labelled next rather than reading done',
            'It stops autofill overwriting what the user has already typed',
          ], 0, 'Submitting normally blurs the field, which dismisses the keyboard a moment before the next field focuses, so you see a flicker unless that blur is disabled.'),
        ]
      ),
            lesson('SectionList, Grids, and Sticky Headers', 13, `
A catalogue of 240 courses grouped into Beginner, Intermediate and Advanced. You could flatten it into one array with fake header rows and feed it to \`FlatList\`. People do. Then the header has to stick while its group scrolls, \`scrollToIndex\` has to account for the fake rows, and the empty group case grows an if statement. \`SectionList\` exists for exactly this shape.

### Sections are data, not markup

\`\`\`jsx
const sections = useMemo(() => ([
  { title: 'Beginner', data: courses.filter(c => c.level === 'Beginner') },
  { title: 'Intermediate', data: courses.filter(c => c.level === 'Intermediate') },
  { title: 'Advanced', data: courses.filter(c => c.level === 'Advanced') },
]), [courses]);

<SectionList
  sections={sections}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CourseRow course={item} />}
  renderSectionHeader={({ section }) => (
    <Text style={styles.header}>{section.title} ({section.data.length})</Text>
  )}
  stickySectionHeadersEnabled
  ListEmptyComponent={<Text>No courses match that filter</Text>}
/>
\`\`\`

\`SectionList\` virtualises the same way \`FlatList\` does, so 240 rows and 24,000 rows cost about the same in memory.

The \`useMemo\` is not decoration. Build that array inline in the component body and every render hands the list a new reference for every section, so it treats the whole catalogue as changed and pushes each visible row back through \`renderItem\`.

### The sticky default differs by platform

\`stickySectionHeadersEnabled\` defaults to \`true\` on iOS and \`false\` on Android. A design signed off on an iPhone quietly loses its pinned headers on the other half of your users' devices. Set the prop explicitly and the surprise goes away.

### Grids are a FlatList with numColumns

\`\`\`jsx
<FlatList
  data={padded}
  numColumns={columns}
  key={\`grid-\${columns}\`}
  columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
  contentContainerStyle={{ gap: 12 }}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    item.spacer ? <View style={{ flex: 1 }} /> : <CourseTile course={item} />
  )}
/>
\`\`\`

Two things bite here.

First, \`numColumns\` cannot change on a mounted list. Rotate the device, move \`columns\` from 2 to 3, and the layout stays exactly where it was. Changing the \`key\` forces a remount, which is the accepted fix.

Second, tiles built with \`flex: 1\` split their row evenly, so a final row holding one tile stretches to the full screen width and looks broken next to the grid above it. Pad the data instead:

\`\`\`jsx
const padded = [...courses];
while (padded.length % columns !== 0) {
  padded.push({ id: \`spacer-\${padded.length}\`, spacer: true });
}
\`\`\`

### Sticky headers in a plain ScrollView

For a bounded screen that is not list shaped, \`ScrollView\` takes \`stickyHeaderIndices\`:

\`\`\`jsx
<ScrollView stickyHeaderIndices={[1]}>
  <Hero />
  <FilterBar />
  <Details />
</ScrollView>
\`\`\`

Those indices count direct children, so wrapping the hero in an extra \`View\` later moves the pin onto the wrong element with no warning.

### Choosing

| Shape | Component |
|---|---|
| Bounded mixed blocks, a settings or detail screen | ScrollView |
| One long flat list driven by data | FlatList |
| Grid of tiles | FlatList with numColumns |
| Rows grouped under headers | SectionList |

One rule cuts across all of them: never nest a virtualised list inside a \`ScrollView\` that scrolls the same direction. The outer view gives the inner list unbounded height, so virtualisation switches off and every row mounts at once. React Native warns about it in the console, and that warning is a genuine performance bug rather than noise. When you need a list with a big header, use \`ListHeaderComponent\` and keep the list on the outside.
      `,
        [
          q('You move numColumns from 2 to 3 when the device rotates and the grid refuses to relayout. Why?', [
            'columnWrapperStyle overrides the column count once it is set',
            'numColumns is fixed for a list instance, so the key must change',
            'FlatList supports a single column whenever data is virtualised',
            'Rotation does not re-render a list unless you call forceUpdate',
          ], 1, 'The column count is baked into the list when it mounts, so you give the FlatList a key that includes numColumns and let React remount it with the new layout.'),
          q('Section headers pin to the top on your iPhone but scroll away on Android. What explains that?', [
            'Android renders section headers as ordinary rows by design',
            'The header component lacks a key, so it is recreated each time',
            'stickySectionHeadersEnabled defaults differently per platform',
            'SectionList only supports sticky headers inside a ScrollView',
          ], 2, 'The prop defaults to true on iOS and false on Android, so you set stickySectionHeadersEnabled explicitly when both platforms should behave the same way.'),
          q('You build the sections array inline in the component body rather than in a useMemo. What does that cost?', [
            'Nothing, because SectionList copies the array once on mount',
            'Sections render in a random order after every state change',
            'keyExtractor stops running, so React falls back to array indexes',
            'A new array identity each render, so every visible row re-renders',
          ], 3, 'A freshly built array is a different reference on every render, which defeats the comparisons the list relies on and pushes unchanged rows back through renderItem.'),
        ]
      ),
      ],
      [
        q("A remote <Image> renders nothing. Most likely cause?", [
          "The URL is wrong",
          "No width/height in style, so it sized to zero",
          "resizeMode is missing",
          "Images need require()",
        ], 1, "Remote images have no intrinsic dimensions in RN, so without explicit width and height they render at zero size."),
        q("When should you use ScrollView instead of FlatList?", [
          "For any vertical scrolling",
          "For bounded content like a settings screen or form",
          "For lists over 100 items",
          "Never",
        ], 1, "ScrollView mounts every child immediately, so it suits fixed, bounded content — not data-driven lists."),
        q("Why define the row component outside the parent rather than inline?", [
          "Inline components cannot use hooks",
          "An inline definition is a new component type each render, forcing remounts",
          "It reduces bundle size",
          "FlatList rejects inline components",
        ], 1, "A component recreated every render is treated as a different type, so React unmounts and remounts every visible row."),
        q("What does keyboardShouldPersistTaps=\"handled\" fix?", [
          "Keyboard covering the input",
          "The first tap only dismissing the keyboard instead of pressing the button",
          "Autocorrect on passwords",
          "Keyboard type on Android",
        ], 1, "Without it the initial tap is consumed dismissing the keyboard, so users must tap twice."),
      ]
    ),
    chapter(
      "Navigation",
      "Moving between screens, passing data, and the patterns users expect on each platform.",
      [
        lesson("Stack Navigation", 12, `
Mobile navigation is a **stack**: screens push on top of each other, and going back pops the top one off. This models how users think — each screen sits over the last, and back returns to what they came from.

### Setup

\`\`\`bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
\`\`\`

\`\`\`jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Courses">
        <Stack.Screen name="Courses" component={CoursesScreen} options={{ title: 'All Courses' }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

Use the **native** stack (\`native-stack\`) rather than the older JS stack. It uses each platform's real navigation primitives, so transitions and the iOS swipe-back gesture feel correct rather than approximated.

### Moving and passing data

\`\`\`jsx
function CoursesScreen({ navigation }) {
  return (
    <Pressable onPress={() => navigation.navigate('CourseDetail', { slug: 'react-native' })}>
      <Text>React Native</Text>
    </Pressable>
  );
}

function CourseDetailScreen({ route, navigation }) {
  const { slug } = route.params;
  // ...
}
\`\`\`

Screen components receive \`navigation\` and \`route\` as props automatically. From a nested component, use the \`useNavigation()\` and \`useRoute()\` hooks instead of threading props down.

### Pass ids, not objects

\`\`\`jsx
// Fragile — a stale snapshot that will not reflect later updates
navigation.navigate('CourseDetail', { course });

// Better — pass the identifier and read fresh data on the detail screen
navigation.navigate('CourseDetail', { slug: course.slug });
\`\`\`

Params are serialised into navigation state. Passing a whole object bloats that state, and the copy goes stale the moment the underlying data changes.

### navigate vs push

- \`navigate('Detail')\` — if that screen is already in the stack, it goes *back* to it.
- \`push('Detail')\` — always adds a new copy. Correct for drilling deeper through similar screens.
- \`goBack()\` — pop one.
- \`popToTop()\` — back to the first screen.

Using \`navigate\` where you meant \`push\` produces the confusing bug where tapping a related item appears to do nothing, because you were already on that screen type.

### Header configuration

\`\`\`jsx
useLayoutEffect(() => {
  navigation.setOptions({
    title: course?.title ?? 'Loading…',
    headerRight: () => <Pressable onPress={share}><Text>Share</Text></Pressable>,
  });
}, [navigation, course]);
\`\`\`
        `,
        [
          q('On CourseDetail a user taps a related course and you call navigate with the same route name. What happens?', [
            'A second CourseDetail is pushed and back returns to the first',
            'The stack resets to its first screen before showing the course',
            'You stay on the existing screen, so it looks like nothing happened',
            'React Navigation throws, because that route is already active',
          ], 2, 'navigate reuses a screen already present in the stack instead of adding another copy, so drilling into a second item of the same type needs push.'),
          q('A button three components deep inside a screen needs to open another route. Best approach?', [
            'Call the useNavigation hook inside that component',
            'Pass the navigation prop down through every layer',
            'Import the navigator module and call navigate on it',
            'Keep the navigation object in a module level variable',
          ], 0, 'useNavigation reads the navigator from context, so nested components get the same object the screen received without threading a prop through intermediate layers.'),
          q('The header title should show a course name that arrives from a fetch. Where do you set it?', [
            'In the Stack.Screen options object, read from route.params',
            'With navigation.setOptions once the data has arrived',
            'By re-registering the screen with a new title string',
            'Inside renderItem on the list screen that navigated here',
          ], 1, 'Static options are evaluated before the request finishes, so the screen updates its own header by calling setOptions when the fetched course lands.'),
        ]
      ),
        lesson("Tabs, Nesting, and Deep Links", 12, `
Most apps combine navigators: tabs at the root, a stack inside each tab.

\`\`\`jsx
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CoursesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CourseList" component={CourseListScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Learn" component={CoursesStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

\`headerShown: false\` on the tabs matters — otherwise you get **two stacked headers**, one from the tab navigator and one from the inner stack. This is the most common nesting mistake.

Each tab keeps its own independent stack, so switching tabs and returning preserves where the user was. That is exactly what users expect.

### Navigating across navigators

\`\`\`jsx
navigation.navigate('Learn', { screen: 'CourseDetail', params: { slug } });
\`\`\`

Name the navigator, then the screen inside it.

### Deep linking

Deep links let a URL open a specific screen — essential for notifications, emails, and sharing:

\`\`\`jsx
const linking = {
  prefixes: ['cortexis://', 'https://cortexis.example.com'],
  config: {
    screens: {
      Learn: {
        screens: {
          CourseDetail: 'course/:slug',
        },
      },
    },
  },
};

<NavigationContainer linking={linking}>
\`\`\`

Now \`cortexis://course/react-native\` opens that course directly, with \`slug\` populated in \`route.params\`.

### Guarding authenticated screens

Do not push a login screen on top. Render a **different navigator** based on auth state:

\`\`\`jsx
function Root() {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
\`\`\`

Because the whole tree swaps, there is no back gesture that sneaks a signed-out user into the app — a real security hole when login is merely pushed on top of the stack.

### Android's hardware back button

React Navigation maps it to \`goBack()\` automatically. If you override it, always return \`true\` only when you actually handled it, or you will trap users in a screen they cannot leave.
        `,
        [
          q('Your app pushes a Login screen on top of the tabs when a session expires. What is the flaw?', [
            'Tabs cannot render while a modal screen sits on the stack',
            'Deep links stop resolving until the user has signed in again',
            'The login form loses its state whenever a tab is switched',
            'Back takes a signed out user straight back into the app',
          ], 3, 'The authenticated screens are still mounted underneath, so a back gesture reveals them; rendering a different navigator based on auth state removes them from the tree entirely.'),
          q('From the Profile tab you need to open CourseDetail, which lives inside the Learn tab\'s stack. How?', [
            'navigate(\'Learn\', { screen: \'CourseDetail\', params: { slug } })',
            'navigate(\'CourseDetail\', { navigator: \'Learn\', slug })',
            'push(\'Learn/CourseDetail\', { slug })',
            'navigate(\'CourseDetail\', { slug }) from inside the tab navigator',
          ], 0, 'Crossing navigators means naming the outer route first and passing the inner screen and its params inside it, so React Navigation knows which stack to target.'),
          q('You override the Android back button and always return true. What do users experience?', [
            'The back gesture closes the app instead of the current screen',
            'Nothing changes, because React Navigation handles back first',
            'They are stuck, because nothing else ever handles the event',
            'The header back arrow disappears until the handler is removed',
          ], 2, 'Returning true claims the event as handled, so the default behaviour never runs and there is no way off the screen unless you return true only when you truly handled it.'),
        ]
      ),
        lesson("Platform Differences", 11, `
"Write once, run anywhere" is not the goal. The goal is **one codebase, correct behaviour on each platform**. Users notice when an app ignores their platform's conventions.

### Branching on platform

\`\`\`jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    ...Platform.select({
      ios: { shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },
});
\`\`\`

Shadows are the classic example: iOS uses \`shadowColor\`/\`shadowOpacity\`/\`shadowRadius\`, Android uses a single \`elevation\` number. Setting only the iOS properties gives you a flat card on Android — a bug that never appears if you only test on a simulator you happen to prefer.

### Platform-specific files

For larger divergence, the bundler picks the right file automatically:

\`\`\`
Header.ios.js
Header.android.js
Header.js        // fallback
\`\`\`

\`\`\`jsx
import Header from './Header';   // resolves per platform
\`\`\`

### Conventions that genuinely differ

| | iOS | Android |
|---|---|---|
| Back | Swipe from left edge | Hardware/gesture back button |
| Tabs | Bottom | Bottom (Material) or top |
| Sharing | Share sheet | Intent chooser |
| Fonts | San Francisco | Roboto |
| Confirmation | Action sheet | Dialog |

An iOS app with no left-edge swipe-back feels broken to iPhone users, even though every button works.

### Safe areas

\`\`\`jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} />
\`\`\`

Notches, dynamic islands, status bars, and home indicators all vary by device. Never hardcode \`paddingTop: 44\` — it will be wrong on most hardware.

### Test on both, early

The most expensive mobile bugs are the ones found the week before release, because the whole layout was built against one platform's quirks. Run both simulators from day one, and put the app on at least one cheap physical Android device — that is where performance problems surface first.
        `,
        [
          q('You add Header.ios.js and Header.android.js beside Header.js. What does importing ./Header resolve to?', [
            'The fallback Header.js, unless you import the file directly',
            'The file matching the platform the bundle is built for',
            'All three, merged, with the fallback applied last of all',
            'An error, because the module name is now ambiguous',
          ], 1, 'The bundler resolves platform extensions ahead of the plain file, so each build picks up its own implementation while the shared name stays in your imports.'),
          q('Why is hardcoding paddingTop to 44 a poor way to clear the status bar?', [
            'Points are ignored on Android, which measures in raw pixels',
            'The status bar is always exactly 20 points tall on every iPhone',
            'Inset height varies by device, so it is wrong on most hardware',
            'Padding has no effect on layout inside a SafeAreaView',
          ], 2, 'Notches, dynamic islands and status bars differ across devices, so a fixed number is only correct on the one you tested; useSafeAreaInsets reports the real value.'),
          q('An iPhone user says the app feels broken even though every button works. Likely cause?', [
            'The left edge swipe back gesture does not work',
            'Text renders in Roboto rather than San Francisco',
            'Shadows use elevation instead of shadowRadius values',
            'The tab bar sits at the bottom rather than the top',
          ], 0, 'iPhone users navigate back by swiping in from the left edge, so an app that ignores that convention feels wrong even when every control is functional.'),
        ]
      ),
            lesson('Modal Screens and Unsaved Changes', 12, `
Someone fills in six fields of a feedback form presented as a modal, brushes the sheet downward by accident, and the whole thing is gone. No confirmation, no draft, no error. That downward swipe is standard iOS behaviour and users perform it without thinking, which makes it your problem rather than theirs.

### Presenting a screen as a modal

Group the routes rather than configuring each one:

\`\`\`jsx
<Stack.Navigator>
  <Stack.Group>
    <Stack.Screen name="CourseList" component={CourseListScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
  </Stack.Group>

  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Feedback" component={FeedbackScreen} />
    <Stack.Screen name="Filters" component={FiltersScreen} />
  </Stack.Group>
</Stack.Navigator>
\`\`\`

| presentation | Behaviour |
|---|---|
| \`card\` | the default push, slides in from the right on iOS |
| \`modal\` | slides up, the previous screen scales back, swipe down dismisses |
| \`formSheet\` | a sheet with detents on recent iOS versions |
| \`transparentModal\` | draws over the screen below, which stays visible |

Reach for \`transparentModal\` when you want a dimmed confirmation sheet. The screen underneath stays mounted and on screen, so the overlay reads as an overlay instead of a page change.

### Blocking the exit is the wrong instinct

\`\`\`jsx
<Stack.Screen
  name="Feedback"
  component={FeedbackScreen}
  options={{ gestureEnabled: false }}
/>
\`\`\`

That does stop the swipe. It also stops it when there is nothing to lose, and it does nothing about the header close button or the Android back button, so you have closed one exit out of three and made the app feel stiff in exchange.

### Intercept the departure instead

\`\`\`jsx
useEffect(() => {
  if (!isDirty) return;

  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    e.preventDefault();
    Alert.alert('Discard feedback?', 'Your answers will not be saved.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.dispatch(e.data.action),
      },
    ]);
  });

  return unsubscribe;
}, [navigation, isDirty]);
\`\`\`

\`beforeRemove\` fires for every way out: the swipe down, the header button, the Android hardware back button and a programmatic \`goBack\`. One listener covers all of them.

\`e.preventDefault()\` cancels the navigation that was about to happen and discards the action, which is why \`e.data.action\` exists. Confirm, then dispatch it. Forget that dispatch and the Discard button does nothing at all, which is the bug people ship after copying half of this pattern from a blog post.

Guarding on \`isDirty\` matters just as much. A listener that always prompts trains users to tap through the dialog without reading it, and then the one time it mattered they tapped Discard on reflex.

### What beforeRemove does not catch

It runs when the screen is removed from its navigator. It does not run when:

- the whole navigator is swapped out, which is what signing out does
- the operating system kills the app while it is in the background
- the user force quits from the app switcher

A long form still needs its draft written to storage as it changes. Treat the dialog as a courtesy and the saved draft as the actual safety net.

### Android is not the same screen

\`gestureEnabled\` and the swipe down are iOS concepts. On Android the modal presentation looks different, there is no dismiss gesture, and the exit is the system back button. The \`beforeRemove\` listener still catches it, which is the main argument for building the guard at the navigation layer rather than wiring up \`BackHandler\` yourself. Test the confirmation on both platforms, because a dialog that only appears on one of them is the same bug with better odds.
      `,
        [
          q('A user swipes down on your modal form and loses six fields of input. Which fix keeps the gesture?', [
            'Set gestureEnabled to false so the modal cannot be swiped',
            'Present the form as a card screen instead of as a modal',
            'Reset the form state whenever the screen loses focus',
            'Listen for beforeRemove and confirm the discard first',
          ], 3, 'beforeRemove fires for the swipe, the back button and the header button alike, so you can call preventDefault, ask once, and leave the natural gesture in place.'),
          q('Inside a beforeRemove handler you call preventDefault and the user then confirms they want to discard. What next?', [
            'Call navigation.goBack, which now runs unblocked',
            'Dispatch e.data.action to replay the blocked navigation',
            'Remove the listener and wait for a second swipe down',
            'Set a state flag and let the screen unmount itself',
          ], 1, 'preventDefault throws the original navigation action away, so the only reliable way to finish the departure the user asked for is to dispatch the action stored on the event.'),
          q('You want a confirmation sheet that leaves the screen underneath visible. Which presentation value fits?', [
            'modal, with a translucent background colour applied',
            'card, which never fully covers the previous screen',
            'formSheet, with the header hidden on both platforms',
            'transparentModal, which draws over the screen below',
          ], 3, 'transparentModal keeps the screen beneath mounted and visible behind your overlay, which is what a dimmed confirmation sheet needs; a plain modal covers it completely.'),
        ]
      ),
      ],
      [
        q("Why prefer native-stack over the JS stack navigator?", [
          "It supports more screens",
          "It uses each platform's real navigation primitives, so gestures and transitions feel native",
          "It is required for tabs",
          "It allows deep linking",
        ], 1, "Native stack delegates to platform navigation, giving correct iOS swipe-back and native transition performance."),
        q("Why pass an id rather than a whole object as a navigation param?", [
          "Objects are not allowed",
          "Params are serialised into navigation state; an object bloats it and goes stale",
          "It is faster to type",
          "navigate() only accepts strings",
        ], 1, "The copied object will not reflect later updates, and large params bloat persisted navigation state."),
        q("You nest a stack inside a tab and see two headers. Fix?", [
          "Remove the inner stack",
          "Set headerShown: false on the tab navigator",
          "Use navigate instead of push",
          "Move tabs to the top",
        ], 1, "Both navigators render a header by default; disable it on the outer one."),
        q("A card has a shadow on iOS but looks flat on Android. Why?", [
          "Android does not support shadows",
          "Android uses elevation, not shadowOpacity/shadowRadius",
          "The colour is wrong",
          "Shadows need a border",
        ], 1, "The two platforms use different shadow APIs; Platform.select should supply elevation for Android."),
      ]
    ),
    chapter(
      "Data, State, and Storage",
      "Fetching over unreliable networks, storing data on device, and keeping state manageable.",
      [
        lesson("Fetching Data on a Mobile Network", 13, `
\`fetch\` works exactly as it does on the web. What differs is that mobile networks are **genuinely unreliable** — users go through tunnels, lose signal, and switch from wifi to cellular mid-request. Code that assumes a working connection breaks constantly.

### The three states, plus one

\`\`\`jsx
function useCourses() {
  const [state, setState] = useState({ status: 'loading', data: [], error: null });

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch('https://api.example.com/courses', { signal: controller.signal });
        if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
        const json = await res.json();
        setState({ status: 'ready', data: json.data, error: null });
      } catch (err) {
        if (err.name === 'AbortError') return;   // unmounted, not a failure
        setState({ status: 'error', data: [], error: err.message });
      }
    })();

    return () => controller.abort();
  }, []);

  return state;
}
\`\`\`

The \`AbortController\` matters more here than on the web. Users navigate away from screens constantly, and without it a slow response resolves into an unmounted component.

Remember \`fetch\` **does not reject on 404 or 500** — only on network failure. Always check \`res.ok\`.

### Always add a timeout

A mobile request can hang indefinitely on a dying connection. The default has no timeout:

\`\`\`jsx
const timeout = setTimeout(() => controller.abort(), 15000);
// ...clearTimeout(timeout) when it settles
\`\`\`

Without this, a user in a lift sees a spinner forever.

### Detect connectivity

\`\`\`jsx
import NetInfo from '@react-native-community/netinfo';

const [online, setOnline] = useState(true);
useEffect(() => NetInfo.addEventListener(s => setOnline(Boolean(s.isConnected))), []);
\`\`\`

Telling someone "You are offline" is far better than a generic failure. Note \`isConnected\` means attached to a network, not that the internet is reachable — captive-portal wifi reports connected while nothing loads. Use \`isInternetReachable\` when the distinction matters.

### Make retry easy

Every error state needs a retry button. On mobile, failure is frequently transient — the same request often succeeds seconds later. An error screen with no way forward except force-quitting the app is a genuinely common design failure.

### Consider a data library

For anything beyond a couple of screens, TanStack Query handles caching, retries, background refetch, and stale-while-revalidate. Reimplementing that correctly by hand is a large amount of subtle work.
        `,
        [
          q('Your request comes back with a 500 and the code carries straight on to res.json(). Why?', [
            'The status was cached from an earlier successful response',
            'fetch only rejects on network failure, not on HTTP errors',
            'await swallows the rejection when there is no catch block',
            'React Native strips status codes above 499 from responses',
          ], 1, 'fetch resolves for any completed HTTP exchange regardless of status, so you have to check res.ok yourself or you will parse an error body as if it were data.'),
          q('NetInfo reports isConnected true on cafe wifi, yet every request fails. What is going on?', [
            'The listener fired before the connection had finished setting up',
            'isConnected is only accurate on cellular, never on wifi networks',
            'The device is attached to the network but requests need a timeout',
            'A captive portal is intercepting traffic, so check isInternetReachable',
          ], 3, 'isConnected only means the device joined a network; a portal that has not been signed into reports connected while nothing loads, which isInternetReachable exposes.'),
          q('A user in a lift stares at a spinner that never resolves. Which omission caused it?', [
            'No timeout, so a hanging request is never aborted',
            'No retry button, so the error state cannot be cleared',
            'No AbortController, so the screen unmounted mid request',
            'No error boundary, so the failure was swallowed silently',
          ], 0, 'fetch has no default timeout, so a dying connection can leave a request pending indefinitely unless you abort it after a fixed period such as fifteen seconds.'),
        ]
      ),
        lesson("Local Storage and Offline", 12, `
There is no \`localStorage\`. The standard key-value store is \`AsyncStorage\`, and it is **asynchronous** — every read and write returns a promise.

\`\`\`bash
npx expo install @react-native-async-storage/async-storage
\`\`\`

\`\`\`jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Everything is a string, so JSON-encode structured values
await AsyncStorage.setItem('settings', JSON.stringify({ theme: 'dark' }));

const raw = await AsyncStorage.getItem('settings');
const settings = raw ? JSON.parse(raw) : { theme: 'light' };

await AsyncStorage.removeItem('settings');
\`\`\`

\`getItem\` returns \`null\` for a missing key, so always guard before parsing — \`JSON.parse(null)\` returns \`null\` rather than throwing, which quietly produces bugs downstream.

### Never put secrets in AsyncStorage

It is **not encrypted**. On a rooted or jailbroken device it is readable, and it can be swept up in device backups.

\`\`\`jsx
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('authToken', token);   // Keychain / Keystore
const token = await SecureStore.getItemAsync('authToken');
\`\`\`

Auth tokens, API keys, and anything personal belong in \`SecureStore\`, which uses the iOS Keychain and Android Keystore. Storing a session token in AsyncStorage is one of the most common real security mistakes in shipped React Native apps.

### A cache that survives going offline

\`\`\`jsx
const CACHE_KEY = 'courses.v1';

async function loadCourses() {
  try {
    const res = await fetch(API + '/courses');
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: json.data }));
    return { data: json.data, stale: false };
  } catch {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) throw new Error('No connection and nothing cached');
    return { data: JSON.parse(cached).data, stale: true };
  }
}
\`\`\`

Show cached content with a quiet "Showing saved data" note rather than an error page. An app that displays *something* offline feels dramatically more reliable than one that shows a blank failure.

Version your cache keys (\`courses.v1\`). When the shape of stored data changes, bumping the version avoids crashing on data written by an older build — a genuinely nasty class of bug because it only affects users who upgrade.

### Larger data

For substantial structured data, use SQLite (\`expo-sqlite\`) or MMKV. AsyncStorage is a key-value store, not a database; querying it means loading and parsing everything.
        `,
        [
          q('On a first launch you run JSON.parse on the result of AsyncStorage.getItem for a missing key. What happens?', [
            'It throws a SyntaxError you can catch and handle there',
            'getItem rejects, so the await never resolves at all',
            'You get null back, and the bug surfaces somewhere later',
            'AsyncStorage returns an empty object for any missing key',
          ], 2, 'getItem resolves with null for a missing key and JSON.parse of null returns null rather than throwing, so nothing fails until code downstream reads a property off it.'),
          q('You keep a 40,000 row catalogue in AsyncStorage and want rows for one category. What is the problem?', [
            'It is a key value store, so you load and parse everything',
            'AsyncStorage rejects any value larger than a single megabyte',
            'Reads are synchronous, so the query blocks the whole UI',
            'Stored values expire, so the catalogue may already be gone',
          ], 0, 'There is no query layer, so filtering means reading and parsing the entire blob into memory; SQLite or MMKV is the right tool once data gets that large.'),
          q('The fetch fails but a cached copy of the course list exists. What should the screen show?', [
            'A full error page, since the data on hand is not trustworthy',
            'An empty list, so nobody mistakes old data for fresh data',
            'A blocking retry dialog until the network comes back up',
            'The cached list, with a quiet note that it is saved data',
          ], 3, 'Showing something is far better than a blank failure, and marking it as saved data keeps the user honest about freshness without hiding the content they came for.'),
        ]
      ),
        lesson("Managing State Across Screens", 11, `
Local \`useState\` covers most of a screen. The question is what to do when several screens need the same data.

### Start with Context

For auth, theme, and other genuinely app-wide values, Context is enough:

\`\`\`jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) setUser(await fetchMe(token));
      setLoading(false);
    })();
  }, []);

  const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
\`\`\`

\`useMemo\` around the value is not optional. Without it, a new object is created every render and **every consumer re-renders**, which on mobile shows up as visible jank far sooner than on desktop.

### Separate server data from UI state

The most useful distinction:

- **Server state** — courses, profile, anything fetched. It is cached, can go stale, and needs loading/error handling. Use TanStack Query.
- **Client state** — the selected tab, whether a modal is open, form values. Use \`useState\` or a small store like Zustand.

Most "state management is complicated" pain comes from forcing fetched data through a client-state tool, which then has to reimplement caching and refetching badly.

### Do not reach for Redux by default

A tab index and a cached list do not need a global store. Add one when you have a genuine, demonstrated problem: deeply shared mutable state, or prop drilling through many layers.

### Persisting across app restarts

Mobile apps are killed by the OS routinely. State a user would be annoyed to lose — a half-finished form, a draft — should be written to storage as it changes, debounced:

\`\`\`jsx
useEffect(() => {
  const id = setTimeout(() => AsyncStorage.setItem('draft', JSON.stringify(form)), 500);
  return () => clearTimeout(id);
}, [form]);
\`\`\`

Writing on every keystroke without the debounce causes noticeable typing lag on cheaper Android devices.
        `,
        [
          q('Your AuthProvider passes a fresh object as its context value on every render. What breaks?', [
            'The provider stops re-rendering when the user object changes',
            'Every consumer re-renders each time, which shows up as jank',
            'useContext returns the previous value one render behind',
            'The context is recreated, so consumers read undefined',
          ], 1, 'Context compares the value by identity, so a new object each render invalidates every consumer in the tree and the wasted work is visible as dropped frames on mobile.'),
          q('A team pushes every fetched course list through their global client store. What does that cost them?', [
            'Fetched data can no longer be read from more than one screen',
            'The store rejects async values, so requests must be synchronous',
            'They rebuild caching, refetching and staleness by hand, badly',
            'Server responses stop persisting between launches of the app',
          ], 2, 'Server state has its own lifecycle of caching, staleness and background refetch, and a client state container has none of that, so the team reimplements it poorly.'),
          q('You persist a draft form to AsyncStorage on every keystroke. What do users on cheap Android phones notice?', [
            'Typing lags, because a disk write runs on every character',
            'The draft is lost, because writes overwrite one another',
            'The keyboard closes each time the write promise resolves',
            'Autocorrect stops working while a write is in flight',
          ], 0, 'Each keystroke triggers a serialise and a disk write, and on slower hardware that work is enough to show up as visible input lag, which is why the write is debounced.'),
        ]
      ),
            lesson('Optimistic Updates and the Offline Write Queue', 13, `
A learner finishes a lesson on the underground, taps Mark complete, watches a spinner for fifteen seconds and gets an error. So they tap again. When the train reaches daylight, the server records the same completion twice and the progress bar reads 104 percent.

Two separate bugs, both living in the write path. Reads get all the attention because a failed read is visible. A failed write is silent until the numbers are wrong.

### Apply first, confirm after

\`\`\`jsx
async function markComplete(lessonId) {
  const previous = progress;                        // keep the snapshot
  setProgress({ ...progress, [lessonId]: true });   // paint immediately

  try {
    await api.post('/progress', { lessonId, done: true });
  } catch (err) {
    setProgress(previous);                          // put it back exactly
    await enqueue({ lessonId, done: true });
    toast('Saved on this device, we will sync when you are back online');
  }
}
\`\`\`

The snapshot is the part people skip. Rolling back by setting the flag to \`false\` looks identical until the lesson was already complete before the tap, at which point your rollback has invented a state the user never chose.

### Make retries safe

A retry that the server cannot recognise as a repeat is how one tap becomes two rows. Generate an idempotency key once per user action, then send the same key on every attempt:

\`\`\`jsx
const action = {
  id: Crypto.randomUUID(),         // generated once, reused on every retry
  path: '/progress',
  payload: { lessonId, done: true },
};

await api.post(action.path, action.payload, {
  headers: { 'Idempotency-Key': action.id },
});
\`\`\`

The server stores the key with the result and replays that result for any repeat. Without it, a request that actually succeeded but timed out on the way back gets sent again, and the second one is indistinguishable from a genuine second tap.

### Queue what failed

\`\`\`jsx
async function flush() {
  const queue = await readQueue();

  while (queue.length) {
    const next = queue[0];
    try {
      await send(next);
      queue.shift();
    } catch (err) {
      if (err.status >= 400 && err.status < 500) {
        queue.shift();        // the server will never accept this one
        report(next, err);
      } else {
        break;                // offline or server trouble, keep the rest
      }
    }
  }

  await writeQueue(queue);
}
\`\`\`

Call \`flush\` when connectivity returns, using the NetInfo listener you already have.

| Failure | What to do |
|---|---|
| No network | keep it queued, flush on reconnect |
| 401 | refresh the session, then retry once |
| 400 validation | drop it and surface the error to the user |
| 500 | keep it, back off before retrying |

That 400 row is the one that hurts. A malformed request retried on every reconnect never succeeds and never leaves the front of the queue, so every write behind it is stuck forever and the user has no idea. Drop it, log it, tell them.

Flush sequentially, one at a time. Fire the queue in parallel and a rename can land after the delete that was supposed to follow it.

### Reconcile against the server

Optimistic state is a guess, and guesses drift. Once a real fetch succeeds, take the server response as truth rather than merging it into local state:

\`\`\`jsx
const fresh = await api.get('/progress');
setProgress(fresh.data);        // replace, do not merge
\`\`\`

Merge instead, and a rollback that missed one field leaves a badge count permanently two too high with no user action able to clear it. Replacement means every successful sync is also a repair.
      `,
        [
          q('A write succeeds on the server but the response times out, so your queue sends it again. What prevents a duplicate?', [
            'Sending the queue in parallel so ordering no longer matters',
            'Rolling the optimistic update back before the second attempt',
            'Checking res.ok, which reveals that the first call succeeded',
            'An idempotency key generated once and reused on every retry',
          ], 3, 'The server stores the key with the first result and replays that result for any repeat, so a retried request cannot be mistaken for a second user action.'),
          q('Why capture the previous state before an optimistic update instead of just flipping the flag back on failure?', [
            'Flipping back invents a state when the value was already set',
            'The flag is read only until the network request has settled',
            'React batches updates, so a second setState is ignored here',
            'Rollback needs the previous value to compute the next key',
          ], 0, 'If the lesson was already complete before the tap, setting the flag to false on failure leaves the user in a state they never chose, while restoring the snapshot cannot.'),
          q('A queued write keeps returning 400 for a malformed payload. What happens if you leave it queued?', [
            'The server eventually accepts it once the session is refreshed',
            'It is retried forever at the front, blocking every write behind it',
            'The queue skips it automatically after three failed attempts',
            'Only that write is lost, and the rest sync as normal on reconnect',
          ], 1, 'A validation failure will never succeed on retry, so a sequential queue stalls on it permanently, which is why 4xx responses are dropped and reported rather than retried.'),
        ]
      ),
      ],
      [
        q("Why does an AbortController matter more in React Native than on the web?", [
          "Requests are slower",
          "Users navigate away constantly, so responses often resolve into unmounted screens",
          "fetch is unsupported",
          "It prevents 404s",
        ], 1, "Screen changes are frequent on mobile; aborting stops setState on an unmounted component and wasted work."),
        q("Where should an auth token be stored?", [
          "AsyncStorage",
          "SecureStore (Keychain/Keystore)",
          "A module-level variable",
          "In navigation params",
        ], 1, "AsyncStorage is unencrypted and readable on compromised devices; SecureStore uses platform secure storage."),
        q("Why version a cache key like 'courses.v1'?", [
          "It improves lookup speed",
          "So a changed data shape does not crash users upgrading with old cached data",
          "AsyncStorage requires it",
          "To allow multiple users",
        ], 1, "Data written by an older build can break new parsing code; bumping the version sidesteps it cleanly."),
        q("Why wrap a Context value in useMemo?", [
          "To avoid recreating the object each render, which re-renders every consumer",
          "Context requires it",
          "It enables persistence",
          "It prevents stale closures",
        ], 0, "A new value object every render invalidates all consumers, producing visible jank on mobile."),
      ]
    ),
    chapter(
      "Performance and Release",
      "Making it fast, using native device features, and getting a signed build into the stores.",
      [
        lesson("Performance in Practice", 12, `
Mobile hardware varies enormously. An app that is smooth on a recent iPhone can be unusable on a three-year-old budget Android — and that device is what a large share of your users have.

### Render less

\`\`\`jsx
const CourseCard = React.memo(function CourseCard({ course, onPress }) {
  return (
    <Pressable onPress={() => onPress(course.id)}>
      <Text>{course.title}</Text>
    </Pressable>
  );
});
\`\`\`

\`React.memo\` only helps if props are **referentially stable**. Passing a fresh inline arrow every render defeats it entirely:

\`\`\`jsx
// Defeats memo — new function identity each render
<CourseCard course={c} onPress={(id) => open(id)} />

// Works — stable identity
const handlePress = useCallback((id) => open(id), [open]);
<CourseCard course={c} onPress={handlePress} />
\`\`\`

This pairing is the most common reason \`React.memo\` "does nothing".

### Images are usually the problem

Images dominate memory. A 4000x3000 photo displayed in a 100pt thumbnail still decodes at full size:

- Serve appropriately sized images from your backend; do not downscale a huge file on device.
- Use \`expo-image\` for better caching and decoding than the built-in component.
- Always set explicit dimensions so layout does not thrash as images load.

### Keep the JS thread free

Animations driven from JavaScript stutter whenever the JS thread is busy. Use the native driver:

\`\`\`jsx
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,     // runs on the UI thread
}).start();
\`\`\`

\`useNativeDriver\` works for \`opacity\` and \`transform\`, but not layout properties such as \`width\` or \`top\` — animating those forces JS involvement on every frame. For anything complex, \`react-native-reanimated\` runs the whole animation off the JS thread.

### Measure, do not guess

Enable the performance monitor in the dev menu and watch two numbers: **UI FPS** and **JS FPS**. If JS FPS drops during scrolling, your \`renderItem\` is too expensive. If UI FPS drops, you are likely over-drawing — too many nested views, shadows, or transparency.

Profile on the **slowest device you support**, in a **release build**. Development builds run unoptimised JavaScript and will mislead you in both directions.
        `,
        [
          q('A 4000x3000 product photo is displayed in a 100pt square thumbnail and memory still spikes. Why?', [
            'The image is decoded at its full source size no matter how small the display box is',
            'React Native re-downloads the image on every re-render of the row',
            'Thumbnails skip the cache, so each one holds its own copy',
            'Explicit width and height force a second decode pass',
          ], 0, 'Decoding happens at the source resolution, so a 12 megapixel file occupies the memory of 12 megapixels regardless of the box you draw it in; resize it on the server instead.'),
          q('While scrolling a long list the performance monitor shows UI FPS holding at 60 and JS FPS collapsing to 20. What does that point at?', [
            'Over-drawing from nested views, shadows and transparency',
            'An expensive renderItem doing too much work on the JS thread',
            'Animations that were handed useNativeDriver: true',
            'Images being served at a higher resolution than needed',
          ], 1, 'The two numbers separate the threads, so a healthy UI FPS with a collapsed JS FPS means the JavaScript thread is saturated, which during a scroll is almost always renderItem.'),
          q('Why is profiling a debug build on the newest iPhone a misleading way to judge performance?', [
            'Debug JavaScript is unoptimised, and fast hardware hides what a budget device pays',
            'The performance monitor only reports honest numbers on Android',
            'Hermes is switched off in debug, so every measurement is doubled',
            'The dev menu throttles the UI thread while it is open',
          ], 0, 'Development builds run unoptimised code and top-end hardware absorbs the cost, so you can be misled in both directions; profile a release build on the slowest device you support.'),
        ]
      ),
        lesson("Camera, Permissions, and Native APIs", 12, `
Native capabilities are where mobile earns its place. In Expo most are one install away.

\`\`\`bash
npx expo install expo-image-picker expo-location
\`\`\`

### Always request, never assume

\`\`\`jsx
import * as ImagePicker from 'expo-image-picker';

async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission needed',
      'Enable photo access in Settings to upload a picture.',
      [{ text: 'Cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: true,
  });

  if (!result.canceled) setPhoto(result.assets[0].uri);
}
\`\`\`

Three things this gets right:

1. **Handles denial gracefully.** A permission prompt can be refused, and on iOS asking again does nothing — the OS will not re-prompt. Offering \`Linking.openSettings()\` is the only real path forward.
2. **\`quality: 0.7\`.** Full-resolution phone photos are several megabytes; uploading them raw is slow and expensive on cellular data.
3. **Checks \`canceled\`.** Users back out constantly.

### Ask at the right moment

Request permission when the user takes an action that needs it, not on app launch. A permissions wall on first open produces far higher denial rates, and once denied, recovery requires a trip to Settings that most users never make.

Explain *why* before the system prompt appears. "To attach a photo to your profile" converts much better than an unexplained dialog.

### Permissions are revocable

A permission granted last week can be revoked at any time. Check status before each use rather than caching a "granted" flag.

### Location

\`\`\`jsx
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') return;

const { coords } = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
\`\`\`

\`Accuracy.Balanced\` is usually right. \`Highest\` engages GPS continuously and drains the battery noticeably — users uninstall apps that flatten their phone.

**Background** location requires separate permission and serious justification; both stores reject apps that request it without a clear user-facing reason.

### Declare purpose strings

iOS requires a usage description for every sensitive permission. Missing one does not warn you at build time — the app **crashes the moment that API is called**, and App Store review rejects the build.
        `,
        [
          q('An iOS user tapped Don\'t Allow on the photo permission. Your code calls requestMediaLibraryPermissionsAsync again the next time they try to upload. What happens?', [
            'The system prompt appears a second time',
            'The call throws and must be wrapped in try/catch',
            'The prompt reappears only after the app is relaunched',
            'It returns denied straight away with no prompt shown, so Settings is the only way back',
          ], 3, 'iOS shows that prompt once per app, so a second request resolves as denied without any UI, which is why offering Linking.openSettings() is the only real recovery path.'),
          q('A build runs fine in Expo Go but the App Store build closes instantly the moment the user taps Choose photo. What is the most likely cause?', [
            'The iOS usage description for photo access is missing from the config',
            'The picker was called before the screen had finished mounting',
            'quality was left above 0.7 for a very large photo',
            'expo-image-picker was added with npm rather than expo install',
          ], 0, 'iOS terminates the process when a sensitive API is called without a purpose string, and because it is a native abort there is no red screen or JavaScript stack to read.'),
          q('You only need a rough position to list nearby study centres. Why is Location.Accuracy.Highest the wrong setting?', [
            'It needs the separate background location permission from both stores',
            'It engages GPS continuously and flattens the battery for precision you never use',
            'It returns a promise that never resolves while the user is indoors',
            'It rounds coordinates to the nearest kilometre by design',
          ], 1, 'Highest keeps the GPS radio running, and battery drain is one of the fastest routes to an uninstall, so Balanced is the right default when city level accuracy is enough.'),
        ]
      ),
        lesson("Building and Shipping", 12, `
Getting from working code to an app users can install is a distinct skill.

### Configure the app

\`\`\`json
{
  "expo": {
    "name": "Cortexis Learn",
    "slug": "cortexis-learn",
    "version": "1.2.0",
    "ios": { "bundleIdentifier": "com.cortexis.learn", "buildNumber": "14" },
    "android": { "package": "com.cortexis.learn", "versionCode": 14 }
  }
}
\`\`\`

- \`version\` is what users see (\`1.2.0\`).
- \`buildNumber\` / \`versionCode\` must **increase with every upload**, even for a re-upload of the same version. The stores reject duplicates.
- The bundle id and package name are **permanent**. Changing them creates a different app that existing users will not receive as an update. Choose carefully.

### Build

\`\`\`bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview     # installable APK for testers
eas build --platform all --profile production      # store-ready binaries
eas submit --platform ios
\`\`\`

EAS builds in the cloud, so an iOS build needs no Mac.

### Keep secrets out of the bundle

**Anything in your JavaScript is readable.** The bundle ships to the device and can be extracted.

\`\`\`jsx
// Wrong — this key is now public
const API_KEY = 'sk_live_abc123';
\`\`\`

There is no such thing as a secret in a mobile client. Private keys belong on your server, with the app calling your backend. Use \`expo-secure-store\` for per-user tokens obtained at runtime, and EAS environment variables for build-time configuration that is not sensitive.

### Over-the-air updates

\`\`\`bash
eas update --branch production --message "Fix quiz scoring"
\`\`\`

JavaScript-only fixes reach users without a review cycle. Native changes — a new native module, a permission, an SDK upgrade — still require a full build. Knowing which of the two you have made is the difference between a five-minute fix and a two-day wait.

### Before you submit

- Test a **release** build on real devices, both platforms. Debug builds hide crashes that only occur when optimised.
- Handle the offline case on every screen.
- Add crash reporting (Sentry) before launch, not after. Without it, a crash affecting 5% of users is invisible.
- Privacy policy URL — both stores require one.
- Complete the data-collection disclosures accurately; misdeclaring is a common rejection reason.
- Check the app icon and splash screen on a notched device and a tablet.

### After launch

Watch crash-free session rate and store reviews. The most valuable early signal is the one-star review describing a crash you cannot reproduce — it usually names a device or OS version you never tested.
        `,
        [
          q('You upload version 1.2.0 build 14, spot a typo, fix the JavaScript and upload again with the same numbers. What does the store do?', [
            'It replaces the earlier binary silently',
            'It accepts the upload and increments the build number for you',
            'It rejects the upload, because the build number has to increase every single time',
            'It accepts it, but testers keep the cached older binary',
          ], 2, 'Both stores key uploads on buildNumber and versionCode, so a duplicate is refused even when the user-facing version string is unchanged.'),
          q('Which of these changes cannot reach users through eas update and needs a fresh store build?', [
            'A wording fix inside a Text component',
            'A new screen plus its route, written entirely in JavaScript',
            'Adding expo-camera, which brings native code and a new permission',
            'A corrected scoring calculation in the quiz reducer',
          ], 2, 'Over-the-air updates replace only the JavaScript bundle, so anything that changes the native binary, such as a new native module or permission, requires a rebuild and submission.'),
          q('Why is the bundle identifier a decision you cannot walk back later?', [
            'EAS caches it in the build profile and will not rebuild with another one',
            'Over-the-air updates are keyed to it and stop being delivered',
            'It is written into the signing certificate, which cannot be reissued',
            'The stores treat a different identifier as a different app, so existing users never get it as an update',
          ], 3, 'Store listings, reviews and installed apps are all bound to that identifier, so changing it publishes a second app instead of updating the one people already have.'),
        ]
      ),
            lesson('App Size and the Installs It Costs', 13, `
Google Play's own install data put a number on it: conversion falls by roughly one percent for every extra 6MB of download. Apple makes the user confirm before a cellular download over 200MB. Size is the last gate between someone tapping Install and someone using your app, and React Native apps arrive at that gate heavier than most.

### Measure the number the user sees

\`\`\`bash
eas build --platform android --profile production
\`\`\`

That produces an \`.aab\`. Open it in the Play Console bundle explorer and read **estimated download size** per device configuration. On iOS, App Store Connect reports the App Store file size once the build finishes processing.

Never quote the debug number. A debug build carries unminified JavaScript, the dev client, and every CPU architecture at once. A 91MB debug APK routinely ships as a 23MB download.

### The bundle splits itself

An Android App Bundle is not one binary. Play generates slices per CPU architecture, screen density, and language, then sends each device only its own slice.

| Artifact | Contains | Typical |
|---|---|---|
| Universal APK | every ABI and density | 70MB and up |
| AAB slice, as delivered | one ABI, one density | 20MB to 30MB |

So when a tester sideloads the universal APK and reports a frightening number, that number was never going to reach a real user. Compare like with like.

### Find what is actually big

It is almost never your own code.

\`\`\`bash
npx expo-atlas     # treemap of the JS bundle, module by module
\`\`\`

An audit on a real app: \`moment\` plus every locale at 230KB, replaced with three \`date-fns\` imports at 12KB. A whole \`lodash\` import at 71KB, replaced with \`lodash.debounce\`. Two lines of work each.

Icon fonts are the quiet one. Importing \`Ionicons\` from \`@expo/vector-icons\` to draw three chevrons ships the entire font file. Three inline SVGs weigh a few hundred bytes.

### Anything you require sits inside the download

\`\`\`jsx
const intro = require('./assets/intro.mp4');   // 22MB in every install
\`\`\`

Assets reached through \`require\` are packaged into the binary, so every user pays for them, including the ones who tap Skip. Serve heavy media from your CDN and cache it after first play. The same goes for a twelve image onboarding carousel exported at 3x, which is easily 8MB of screens people swipe past in four seconds.

### Hermes and R8

Hermes compiles your JavaScript to bytecode at build time, which is smaller than shipping source and starts faster. On Android, R8 then strips unused Java classes and resources:

\`\`\`properties
# android/gradle.properties
hermesEnabled=true
android.enableR8.fullMode=true
\`\`\`

Here is where it bites. R8 removes classes it cannot see referenced, and native libraries that resolve classes by reflection are exactly that. The build succeeds. The app then crashes on the one screen using that library, in release only, with a \`ClassNotFoundException\` in logcat and nothing at all in your JavaScript logs. Keep a \`proguard-rules.pro\` entry for any library whose docs ask for one, and test the release build on a device before celebrating the smaller number.

### Give it a budget

Read the estimated download on every release and treat a jump as a defect to explain rather than a fact to accept. Size creeps in one dependency at a time, and the day you finally notice is the day someone asks why installs are down.
      `,
        [
          q('A tester sideloads the universal APK and reports the app is 78MB, while the Play Console shows a 24MB download. Which explanation is right?', [
            'The Play Console reports the compressed size while the APK is measured uncompressed',
            'The universal APK carries every ABI and density, while Play delivers only the matching slice',
            'The sideloaded APK still contains the debug JavaScript bundle',
            'Play strips the Hermes bytecode and regenerates it on the device',
          ], 1, 'An app bundle is split by architecture, density and language before delivery, so the universal APK is a superset that no real device ever downloads.'),
          q('Your onboarding video is loaded with require(\'./assets/intro.mp4\') and weighs 22MB. What does that decision actually cost?', [
            'Nothing, because bundled assets are streamed from the store on first play',
            '22MB added to every install, paid for by users who skip onboarding too',
            '22MB of resident memory held for as long as the session lasts',
            'A slower JavaScript bundle parse on every single cold start',
          ], 2, 'Anything reached through require is packaged into the binary, so the download grows for every user regardless of whether they ever watch the video.'),
          q('Why is the size of your debug APK a useless number to report to anyone?', [
            'Debug builds compress assets with a faster but weaker algorithm',
            'Hermes bytecode is only produced for release builds',
            'The number excludes the compression the store applies afterwards',
            'It bundles unminified JavaScript, the dev client and every architecture, so it is several times release size',
          ], 3, 'A debug artifact is built for iteration rather than distribution, which is why a 91MB debug APK can ship as a 23MB download once it is built for release.'),
        ]
      ),
      ],
      [
        q("Why does React.memo often fail to prevent re-renders?", [
          "It only works on class components",
          "Inline arrow props create a new identity each render, so props are never equal",
          "It needs a key prop",
          "memo is deprecated",
        ], 1, "Referential stability is required; an inline function is a new value every render, so the memo comparison always fails."),
        q("useNativeDriver: true does NOT work for which property?", [
          "opacity",
          "transform",
          "width",
          "scale",
        ], 2, "The native driver handles opacity and transform; layout properties like width must be computed on the JS thread."),
        q("Why should permissions be requested at the point of use rather than on launch?", [
          "The OS forbids launch-time requests",
          "Denial rates are much higher without context, and iOS will not re-prompt after a refusal",
          "It is faster",
          "Permissions expire",
        ], 1, "Unexplained upfront prompts get denied more often, and recovering from a denial requires a Settings trip most users never make."),
        q("Where must an API secret live?", [
          "In app.json",
          "On your server — anything in the JS bundle is extractable",
          "In SecureStore at build time",
          "In an environment variable in the bundle",
        ], 1, "The bundle ships to the device and can be read, so no client-side location is secret."),
      ]
    ),
    chapter(
      "Notifications, Lifecycle, and Sessions",
      "Push notifications end to end, what happens when the app leaves the foreground, and a login that survives real use.",
      [
        lesson("Push Notifications End to End", 13, `
Push is the feature users judge instantly. One that arrives silently, arrives twice, or opens the wrong screen reads as a broken app.

### Register the device

\`\`\`bash
npx expo install expo-notifications expo-device
\`\`\`

\`\`\`jsx
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPush() {
  if (!Device.isDevice) return null;               // simulators never get a token

  if (Platform.OS === 'android') {
    // On Android 8+ the channel, not the payload, owns sound and heads-up behaviour
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,   // HIGH = sound + heads-up; DEFAULT is sound only
    });
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== 'granted') return null;           // respect the refusal (chapter 5)

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-eas-project-id',
  });
  return token;
}
\`\`\`

Three real failure modes are handled there. **Simulators cannot receive remote push** — an iOS simulator has no APNs registration, so testing push means a physical device. **A missing Android channel** drops everything into the fallback "Miscellaneous" channel you never configured, where notifications neither pop on screen nor read as urgent — which is reported as "Android never gets them". And **\`projectId\` is required** in a standalone build; omitting it works in the dev client and then fails in production.

Choose that importance carefully, because Android locks a channel's importance once the channel exists. Raising it in code afterwards changes nothing — you need a new channel id, or the user has to change it in Settings. \`HIGH\` is what makes a notification pop on screen; \`DEFAULT\` only plays a sound.

### Tokens are not permanent

Send the token to your backend on **every launch**, not once at signup. Tokens rotate when the app is reinstalled, when a device is restored from backup, and occasionally on OS upgrade. Store them per device — one user can have three — and delete the row on logout, or a signed-out phone keeps receiving another person's alerts.

### Foreground notifications are hidden by default

\`\`\`jsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,     // omit this and it flashes a banner but never reaches the tray
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
\`\`\`

Without a handler nothing is displayed while the app is open. This produces the classic bug report: "notifications only work when the app is closed." They were arriving the whole time; you simply never told the OS to draw them.

### Opening the right screen

Put identifiers in the \`data\` payload, then reuse the deep-link routes from chapter 3:

\`\`\`jsx
useEffect(() => {
  const sub = Notifications.addNotificationResponseReceivedListener((res) => {
    const { slug } = res.notification.request.content.data ?? {};
    if (slug) navigation.navigate('Learn', { screen: 'CourseDetail', params: { slug } });
  });
  return () => sub.remove();
}, [navigation]);
\`\`\`

That listener only fires while the app is running. If a tap **launched** the app from cold, the notification was delivered before your effect mounted:

\`\`\`jsx
useEffect(() => {
  Notifications.getLastNotificationResponseAsync().then((res) => {
    const slug = res?.notification.request.content.data?.slug;
    if (slug) navigation.navigate('Learn', { screen: 'CourseDetail', params: { slug } });
  });
}, [navigation]);
\`\`\`

Missing this is why deep links from push "work sometimes" — they work when the app was already warm.

### Sending

\`\`\`bash
curl -X POST https://exp.host/--/api/v2/push/send \\
  -H "Content-Type: application/json" \\
  -d '{"to":"ExponentPushToken[xxx]","title":"Quiz graded","body":"You scored 9/10","data":{"slug":"react-native"}}'
\`\`\`

The response reports per-token tickets. Poll the receipts: a \`DeviceNotRegistered\` error means that token is dead and must be deleted, or you will keep spending your 600-per-second project rate limit pushing into nothing.

### Not everything needs a server

A reminder tied to the user's own device is a **local notification** — no token, no backend, no network:

\`\`\`jsx
await Notifications.scheduleNotificationAsync({
  content: { title: 'Ready to continue?', body: 'Chapter 3 is waiting.', data: { slug: 'react-native' } },
  trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * 60 * 24 },
});
\`\`\`

Cancel it when the reason disappears — \`Notifications.cancelScheduledNotificationAsync(id)\` — or someone who already finished the chapter is nagged about it tomorrow anyway.

### Badges lie unless you clear them

The number on the app icon is set by you and never cleared by the OS:

\`\`\`jsx
await Notifications.setBadgeCountAsync(0);   // on foreground, once the user has seen the list
\`\`\`

A badge showing "3" over an app with nothing new in it is one of the fastest ways to get notifications switched off entirely.

### Restraint

Every notification is a request for attention you may not get back. Notify on things the user asked for — a reply, a graded quiz, an order shipping. Marketing blasts are the single biggest driver of both permission revocation and uninstalls, and unlike email there is no re-opt-in flow. Make the body worth reading on its own as well — \`You have a new update\` teaches people to swipe your notifications away without opening them.
        `,
        [
          q('Push works on your physical phone, but a tester running the app on the iOS simulator never receives anything. Why?', [
            'A simulator has no APNs registration, so no real push token can be issued for it',
            'The simulator needs its notification channel created before the first send',
            'Expo push tokens only work on the machine that produced the build',
            'The simulator drops the data payload and shows nothing without one',
          ], 0, 'Remote push is delivered through the platform push service, which only registers real hardware, which is why the registration code returns early when Device.isDevice is false.'),
          q('Users report that notifications only ever work when the app is closed. What is actually happening?', [
            'The OS suppresses duplicates while the app is already in the foreground',
            'With no notification handler set, nothing is drawn while the app is open',
            'Foreground delivery needs a second permission on both platforms',
            'The token rotates on launch, so the first push after opening is lost',
          ], 1, 'Foreground notifications arrive normally but are not displayed unless setNotificationHandler tells the OS to show them, so the messages were never missing.'),
          q('Why should the push token be sent to your backend on every launch instead of once at signup?', [
            'Signup happens before the permission prompt, so the token is null there',
            'Expo expires any token that has not been used for seven days',
            'Tokens rotate on reinstall, on restore from a backup and sometimes on an OS upgrade',
            'Each launch creates a new project id that the token is bound to',
          ], 2, 'A token is not a permanent identifier for a device, so a store-once approach quietly stops delivering to anyone who reinstalled or restored their phone.'),
        ]
      ),
        lesson("The App Lifecycle and Background Behaviour", 11, `
A web page is either open or gone. A mobile app spends most of its life somewhere in between — backgrounded, suspended, restored hours later with stale data on screen.

### AppState

\`\`\`jsx
import { AppState } from 'react-native';

useEffect(() => {
  const sub = AppState.addEventListener('change', (next) => {
    if (next === 'active') refetch();   // returning to the foreground
  });
  return () => sub.remove();
}, [refetch]);
\`\`\`

| State | Meaning |
|---|---|
| \`active\` | Foreground, receiving events |
| \`background\` | Not visible; JS will be suspended shortly |
| \`inactive\` | iOS only — transitioning, or the app switcher is open |

Refetching on \`active\` is the cheapest reliability win in a mobile app. Without it, someone reopens your app after lunch and reads prices from three hours ago.

### JavaScript stops running

Once backgrounded, your timers stop. A countdown built on \`setInterval\` will be minutes behind when the app returns.

\`\`\`jsx
// Fragile — assumes ticks kept happening
const [left, setLeft] = useState(300);
useEffect(() => {
  const id = setInterval(() => setLeft((n) => n - 1), 1000);
  return () => clearInterval(id);
}, []);

// Correct — the interval only triggers a re-render; the value comes from the clock
const [endsAt] = useState(() => Date.now() + 300_000);
const [now, setNow] = useState(() => Date.now());
useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(id);
}, []);
const left = Math.max(0, Math.round((endsAt - now) / 1000));
\`\`\`

Store the **deadline**, not the remaining count. The same rule applies to anything time-based: never trust that your interval ran.

### Screens stay mounted

This one bites everyone. In a stack navigator, pushing a new screen does **not** unmount the one underneath. Navigating back therefore does not re-run \`useEffect\`, and your list still shows the item the user just deleted.

\`\`\`jsx
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    loadCourses();
  }, [loadCourses])
);
\`\`\`

\`useFocusEffect\` runs on every focus and cleans up on blur. The \`useCallback\` is mandatory — an inline function makes it re-run on every render, giving you an infinite fetch loop.

### The app-switcher snapshot

iOS screenshots your app as it backgrounds, and that image appears in the multitasking switcher. If a banking balance or a message thread is on screen, it is now visible to anyone who double-taps the home button.

\`\`\`jsx
const [masked, setMasked] = useState(false);
useEffect(() => {
  const sub = AppState.addEventListener('change', (s) => setMasked(s !== 'active'));
  return () => sub.remove();
}, []);

return masked ? <PrivacyOverlay /> : <AccountBalance />;
\`\`\`

Mask on \`inactive\`, not on \`background\` — by the time the state reaches \`background\` the snapshot has already been taken.

### Background work is a request, not a promise

\`expo-background-task\` and its equivalents let you register periodic work, but the OS decides whether it runs. iOS learns usage patterns and may skip a device that rarely opens your app; both platforms enforce a minimum interval measured in minutes and a hard execution budget. Design for "this may not run for a day" — sync when the app opens as well, and never make a feature depend on background execution alone.

Test it honestly, too: Xcode's Debug menu can simulate a background fetch, and Android can trigger a job directly with \`adb shell cmd jobscheduler run -f <package> <jobId>\`. Waiting for the OS to schedule one naturally is not a development loop.

### Cold start is part of the lifecycle

Launching from nothing is the slowest path your app ever takes, and it is the one every new user meets first. Hold the splash screen until the state your first screen needs is genuinely ready:

\`\`\`jsx
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { loading } = useAuth();          // reads the token out of SecureStore

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;
  return <Root />;
}
\`\`\`

Hiding the splash before the session has been read gives already-signed-in users a visible flash of the login screen — a small detail that makes an app feel unfinished. Keep the work behind the splash to what the first frame truly requires; everything else belongs after it, or launch feels slow for everybody.

### Being killed is normal

The OS terminates backgrounded apps to reclaim memory, with no callback and no warning. Anything the user would resent losing must already be on disk — the debounced draft write from chapter 4 is the pattern.
        `,
        [
          q('A countdown built on setInterval decrements a state counter every second. The user backgrounds the app for three minutes, then returns. What do they see?', [
            'The correct time, because intervals are handled by the native layer',
            'Zero, because the OS delivers all the queued ticks at once on resume',
            'A crash, because the interval kept a reference to an unmounted screen',
            'A timer roughly three minutes behind, because JavaScript stopped running',
          ], 3, 'A backgrounded app has its JavaScript suspended, so no ticks fire while it is away, which is why the remaining time must be derived from a stored deadline and the clock.'),
          q('You render a privacy overlay when AppState is \'background\' rather than \'inactive\'. What goes wrong on iOS?', [
            'The app switcher snapshot is taken before that state arrives, so it captures the real screen',
            'The overlay never disappears again when the app becomes active',
            'Android never emits \'background\', so the overlay is skipped there',
            'The overlay draws underneath the keyboard and stays invisible',
          ], 0, 'iOS takes its multitasking screenshot during the transition, so masking has to happen on \'inactive\' if the image is to show the overlay rather than the balance.'),
          q('You register a periodic background sync, and on a tester\'s phone it does not run for a whole day. What is the right conclusion?', [
            'The handler must return a result value or the OS deregisters the task',
            'That is normal, because the OS decides whether registered work runs at all',
            'The minimum interval has to be set below fifteen minutes to be honoured',
            'Background work stops once the permission prompt has been dismissed',
          ], 1, 'Background execution is a request that the system schedules according to battery, usage patterns and its own budget, so any feature depending on it alone will fail for some users.'),
        ]
      ),
        lesson("Auth Sessions That Survive Real Use", 12, `
Chapter 4 established where a token lives: \`SecureStore\`, never \`AsyncStorage\`. What breaks in production is everything around it — expiry, refresh, and logout.

### Short access token, long refresh token

Issue an access token that lives 15 minutes and a refresh token that lives weeks. If the access token leaks, it is useless almost immediately; the refresh token, which is used rarely, sits in the Keychain.

\`\`\`jsx
import * as SecureStore from 'expo-secure-store';

const ACCESS = 'auth.access';
const REFRESH = 'auth.refresh';

export async function saveSession({ accessToken, refreshToken }) {
  await SecureStore.setItemAsync(ACCESS, accessToken);
  await SecureStore.setItemAsync(REFRESH, refreshToken);
}
\`\`\`

### Refresh exactly once

A list screen firing six requests on focus will get six 401s at the same moment. Naively refreshing per failure sends six refresh calls; with rotating refresh tokens, five of them are invalid and the user is thrown to the login screen for no reason. Keep the refresh **single-flight**:

\`\`\`jsx
let refreshing = null;   // module scope: one promise shared by all callers

async function getFreshToken() {
  if (!refreshing) {
    refreshing = (async () => {
      const rt = await SecureStore.getItemAsync(REFRESH);
      const res = await fetch(API + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (!res.ok) throw new Error('refresh-failed');
      const session = await res.json();
      await saveSession(session);
      return session.accessToken;
    })().finally(() => { refreshing = null; });
  }
  return refreshing;
}

export async function apiFetch(path, options = {}, retry = true) {
  const token = await SecureStore.getItemAsync(ACCESS);
  const res = await fetch(API + path, {
    ...options,
    headers: { ...options.headers, Authorization: \`Bearer \${token}\` },
  });

  if (res.status === 401 && retry) {
    try {
      await getFreshToken();
      return apiFetch(path, options, false);   // retry ONCE, then give up
    } catch {
      await signOut();
    }
  }
  return res;
}
\`\`\`

The \`retry\` flag is not decoration. Without it, a permanently rejected token produces infinite recursion — a request loop that flattens the battery and hammers your API.

### Refresh before you fail

Waiting for a 401 means every session opens with a wasted round trip. If your access token is a JWT, read its expiry and refresh ahead of time:

\`\`\`jsx
function expiresSoon(jwt, skewSeconds = 60) {
  const [, payload] = jwt.split('.');
  const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');   // base64url -> base64
  const { exp } = JSON.parse(atob(b64));                       // exp is seconds, not milliseconds
  return exp * 1000 - Date.now() < skewSeconds * 1000;
}
\`\`\`

That two-character swap is not optional. JWT segments are base64**url**, which uses \`-\` and \`_\` where base64 uses \`+\` and \`/\`, and \`atob\` rejects both with \`InvalidCharacterError\`. A pure-ASCII payload can go a long way without producing either character, which is exactly why this survives testing; put an emoji in a display name or a query string in the issuer URL and it starts throwing for that one account.

The skew window is not decoration either: device clocks drift, and a token that expires while the request is in flight fails just the same. Decoding a JWT on the client is fine for **timing** and never for trust — the payload is base64, not encryption, and anyone can rewrite it. The authorisation decision stays with the server, the only party that verified the signature.

### Logging out means erasing everything

\`\`\`jsx
export async function signOut() {
  await SecureStore.deleteItemAsync(ACCESS);
  await SecureStore.deleteItemAsync(REFRESH);
  await AsyncStorage.multiRemove(['courses.v1', 'draft']);   // cached personal data
  queryClient.clear();
  setUser(null);   // swaps the navigator, per chapter 3
}
\`\`\`

Forgetting the cache is a real privacy bug: the next person to sign in on a shared phone sees the previous user's cached list flash on screen before the fetch replaces it.

### Re-lock sensitive screens

\`\`\`jsx
import * as LocalAuthentication from 'expo-local-authentication';

const { success } = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Unlock your account',
});
\`\`\`

Combine with the \`AppState\` listener from the previous lesson: require biometrics again after the app has been backgrounded for more than a few minutes.

### Treat deep links as untrusted input

Any app or web page can open \`cortexis://course/<anything>\`. Validate the parameter before using it, and never accept a link that carries a token or performs a destructive action directly.

### Transport

Both platforms block plain HTTP by default — iOS through App Transport Security, Android through its cleartext policy. When your local API is not HTTPS, tunnel it rather than switching those protections off; a disabled ATS exception has a habit of surviving into the release build.

Certificate pinning raises the bar against a proxy on a hostile network, but it also breaks every install the day that certificate rotates. Adopt it only with a backup pin and a remote kill switch.

Finally: hiding a button is not authorization. The client is fully inspectable, so **every** rule must also be enforced on the server.
        `,
        [
          q('You delete the retry flag from apiFetch so every 401 refreshes and retries. The refresh token has been revoked server side. What happens?', [
            'The refresh promise is created twice, rotating the token out from under itself',
            'SecureStore hands back a stale access token from its own cache',
            'The same request retries itself endlessly, burning battery and hammering your API',
            'The user is signed out on the very first failed request instead',
          ], 2, 'Without a flag marking the second attempt, each retry produces another 401 which triggers another retry, so a permanently rejected token becomes infinite recursion.'),
          q('Decoding a JWT payload with atob works for almost every account and throws InvalidCharacterError for a handful. What explains the pattern?', [
            'atob refuses payloads longer than about a thousand characters',
            'Expired tokens are padded differently by the issuer',
            'The signature segment is binary and has to be stripped first',
            'JWT segments are base64url, so - and _ appear once the payload contains certain characters',
          ], 3, 'base64url swaps + and / for - and _, and a payload only produces those characters for some inputs, so an emoji in a display name breaks decoding for that user alone.'),
          q('Your signOut deletes both tokens but leaves the AsyncStorage cache in place. What does the next person to sign in on that phone see?', [
            'The previous user\'s cached list flashing on screen before the fetch replaces it',
            'A failed write, because the cache keys collide with their own data',
            'The old session restored, because the cache still holds a token',
            'An empty screen, because the cache is keyed to the deleted account',
          ], 0, 'Cached responses outlive the tokens that fetched them, so anything personal you cached has to be cleared at sign out or it leaks to the next account on a shared device.'),
        ]
      ),
            lesson('Social Sign In With Apple and Google', 13, `
Embed a WebView, point it at Google's consent screen, and Google answers \`403 disallowed_useragent\` before the user has typed a character. That refusal is deliberate. A WebView is owned by the app hosting it, so the app could read the password as it is typed, and no identity provider is willing to let you prove that you did not.

### Use the system browser

\`expo-auth-session\` opens the provider in \`ASWebAuthenticationSession\` on iOS and a Chrome Custom Tab on Android. Both show a real address bar and both share cookies with the user's own browser, so someone already signed in to Google taps once and never sees a password field.

\`\`\`jsx
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
const redirectUri = AuthSession.makeRedirectUri({ scheme: 'cortexis' });

const [request, response, promptAsync] = AuthSession.useAuthRequest(
  {
    clientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri,
    responseType: 'code',
    scopes: ['openid', 'profile', 'email'],
    usePKCE: true,
  },
  discovery
);
\`\`\`

### PKCE exists because your app cannot keep a secret

The server side OAuth flow trades the authorization code for tokens using a client secret. Your bundle ships to the device and can be unzipped, so that secret is public the moment you paste it in, and anyone who registers \`cortexis://\` on their own device can then redeem an intercepted code.

PKCE closes that hole. The app generates a random verifier, sends only its SHA256 hash when the flow starts, and presents the raw verifier at the exchange. An intercepted code without the verifier is worthless.

| Step | What travels | Who can use it |
|---|---|---|
| Authorize | code_challenge (a hash) | Nobody, it is one way |
| Redirect | authorization code | Only the holder of the verifier |
| Exchange | code plus code_verifier | Your app, once |

Then hand the provider's identity token to your own backend, verify the signature there, and mint the access and refresh pair from the previous lesson. Google's token is proof of who someone is. Your session is what says what they may do.

### The redirect has to match exactly

Register the scheme in \`app.json\` as \`"scheme": "cortexis"\` and register the identical URI with the provider. A trailing slash difference produces \`redirect_uri_mismatch\` and nothing else.

Google also needs a separate client id per platform, and the Android one is bound to the signing certificate's SHA-1 fingerprint. Your debug build works. The store build, signed by Play App Signing with a different certificate, fails for everybody on day one unless you also registered the fingerprint from the Play Console.

### Apple gives you the name once, and only once

App Store guideline 4.8 requires Sign in with Apple wherever you offer another third party login. It has a trap of its own:

\`\`\`jsx
import * as AppleAuthentication from 'expo-apple-authentication';

const credential = await AppleAuthentication.signInAsync({
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
});

await api.post('/auth/apple', {
  identityToken: credential.identityToken,   // the server verifies this
  fullName: credential.fullName,             // null on every later sign in
});
\`\`\`

\`fullName\` and \`email\` are returned in the **first** authorization for that Apple ID and app, and never again. Drop them there and no API call brings them back. Testing this is its own puzzle: to see a first authorization twice you must revoke the app under Settings, Apple ID, Sign in with Apple, Stop Using Apple ID.

### Link on a verified email

The same person signs in with Google on their phone and a password on the web. Match them on the email address, but only the one your server read out of a verified identity token. An email posted by the client is a request to take over an account, not a fact.
      `,
        [
          q('Google answers an embedded WebView with disallowed_useragent. What is the reasoning behind that block?', [
            'A WebView cannot persist the cookies the consent screen needs to set',
            'The hosting app can read whatever is typed into a WebView, so it cannot be trusted with a password',
            'Only a Custom Tab is able to deliver the redirect back into the app',
            'The WebView user agent fails Google\'s certificate pinning check',
          ], 1, 'The system browser is a separate process the app cannot inspect, and its address bar lets the user confirm the page is genuine, neither of which a WebView can offer.'),
          q('A mobile app cannot hold an OAuth client secret. What does PKCE put in its place?', [
            'A short lived secret fetched from your own server at launch',
            'A signature over the redirect URI produced by the device keystore',
            'A random verifier held in memory, with only its hash sent when the flow starts',
            'A one time code the user copies out of the browser by hand',
          ], 2, 'Because only the hash travels up front, an intercepted authorization code cannot be exchanged by anyone who does not already hold the original verifier.'),
          q('Your Apple handler ignored fullName on a user\'s first sign in. Every later sign in returns null for it. What now?', [
            'Request the FULL_NAME scope again on the next signInAsync call',
            'Read the name claim out of the identityToken, which always carries it',
            'Call getCredentialStateAsync to fetch the profile again',
            'Nothing in the API returns it: ask the user, and persist it on first authorization next time',
          ], 3, 'Apple releases the name and email only in the first authorization response for that Apple ID and app, so a missed one is unrecoverable without the user revoking access.'),
        ]
      ),
      ],
      [
        q("Push notifications arrive on Android but make no sound and are easy to miss. Likely cause?", [
          "The token was never sent to the server",
          "shouldPlaySound is false in the foreground handler",
          "No notification channel was created, so Android 8+ delivers them silently",
          "The payload is missing a title",
        ], 2, "Android 8 and later put sound and heads-up behaviour under the channel's control; with no channel of your own an unconfigured fallback channel decides, and it does neither."),
        q("A tap on a push notification opens the app to the home screen instead of the linked course, but only when the app was fully closed. What is missing?", [
          "getLastNotificationResponseAsync on startup",
          "A second response listener",
          "setNotificationHandler",
          "The projectId in getExpoPushTokenAsync",
        ], 0, "A cold launch delivers the response before the listener mounts, so the initial response must be read explicitly."),
        q("Navigating back to a list screen shows stale data because useEffect never re-runs. Why?", [
          "The effect dependency array is wrong",
          "The screen was never unmounted — a pushed screen stacks on top of it",
          "State was restored from AsyncStorage",
          "useEffect does not run in React Native",
        ], 1, "Stack navigators keep previous screens mounted, so returning to one triggers focus, not a fresh mount; useFocusEffect handles it."),
        q("Why must the token refresh be single-flight?", [
          "Refresh calls are rate-limited by the OS",
          "SecureStore cannot handle concurrent writes",
          "It makes the first request faster",
          "Several simultaneous 401s would each rotate the refresh token, invalidating the others and logging the user out",
        ], 3, "With rotating refresh tokens only the first concurrent refresh succeeds, so the rest fail and force an unnecessary sign-out."),
      ]
    ),
    chapter(
      "Debugging, Testing, and Release Health",
      "Finding the bug on a real device, proving behaviour with tests, and seeing the crashes your users actually hit.",
      [
        lesson("Debugging on a Real Device", 12, `
Most React Native bugs are ordinary JavaScript bugs. The hard ones are the bugs that only exist on a device, or only in a release build, and those need a different toolkit.

### The dev menu

Shake the device, or press \`Cmd+D\` (iOS simulator), \`Cmd+M\` (Android emulator), or \`j\` in the terminal running the bundler. From there you get **React Native DevTools** — a Chrome DevTools front end wired to Hermes, with a console, breakpoints, a network panel, and the React component tree and profiler.

Set breakpoints instead of sprinkling \`console.log\`. Logging is not free: a \`console.log\` of a large object serialises it across the bridge on every call, and left in a \`renderItem\` it becomes a measurable scroll stutter.

### Red screens versus silent death

| Symptom | Where to look |
|---|---|
| Red error screen with a JS stack | Your JavaScript — read the top frame |
| Yellow LogBox warning | A real defect most of the time; do not blanket-ignore them |
| App disappears with no screen | A **native** crash — JS logs will not show it |
| Blank white screen after launch | An error thrown during initial render, often in a provider |

When the app vanishes, the stack trace is in the native log:

\`\`\`bash
adb logcat --pid=$(adb shell pidof -s com.cortexis.learn)   # Android
npx react-native log-ios                                    # iOS, or use the Xcode console
\`\`\`

A missing purpose string (chapter 5) or an unlinked native module dies exactly this way — no red screen, just an app that closes.

### When the bundler is lying

After switching branches, changing \`babel.config.js\`, or installing a dependency, Metro's cache can serve stale JavaScript that no longer matches your files:

\`\`\`bash
npx expo start --clear
\`\`\`

If a change genuinely does not appear no matter what you edit, clear the cache before you doubt your own code.

### "It only breaks in release"

Development and release builds differ in ways that hide bugs:

- \`__DEV__\` is \`false\`, so dev-only code paths disappear.
- Minification renames functions, so anything relying on \`fn.name\` or class names breaks.
- The bundle is pre-compiled; a slow-loading asset in dev may load instantly, changing the ordering of a race condition.
- Yellow warnings you never read were the actual error, upgraded to a crash by stricter optimised behaviour.

Reproduce it properly rather than guessing:

\`\`\`bash
eas build --profile preview --platform android   # release-configured, installable APK
npx expo run:ios --configuration Release
\`\`\`

### Version mismatches masquerade as your bugs

A surprising share of "impossible" React Native problems are a dependency built against a different runtime version than the one you are running. The symptoms mislead: a native module that is \`undefined\`, a component that renders nothing at all, a build failing deep inside Gradle.

\`\`\`bash
npx expo-doctor            # flags mismatched and unsupported packages
npx expo install --check   # realigns dependencies with the installed SDK
\`\`\`

Run both before losing an afternoon to a bug you did not write. And when you add a library that ships native code, the JavaScript-only workflow ends there — Expo Go cannot load it, so you need a **development build** (\`eas build --profile development\`). What Expo Go shows instead is a red screen saying some method is not a function, which reads exactly like your own mistake.

### Isolate before you theorise

The reliable loop is mechanical: reproduce on the slowest device you support, comment out half the screen, and see if the symptom survives. Bisect the render tree, then bisect recent commits with \`git bisect\` if the tree does not narrow it. Guessing at a fix and rebuilding takes minutes per attempt on mobile — that cost is exactly why bisecting wins.

Record the exact device, OS version, and build number for every report you cannot reproduce. That triple is very often the reproduction.

### Network requests

The DevTools network panel does not capture everything, particularly requests made by native modules. When a request "works in Postman but not in the app", log the exact URL, method, and headers you are sending and compare them character by character. In practice the answer is nearly always a missing \`Authorization\` header, a trailing slash, or a base URL still pointing at \`localhost\` — which on a physical device means the phone itself, not your machine.
        `,
        [
          q('You switched branches, installed a dependency, and now no edit you make appears in the running app. What do you try before doubting your own code?', [
            'Restart with npx expo start --clear, because Metro can be serving a stale cached bundle',
            'Clean the native build folder in Xcode and rebuild the project',
            'Delete node_modules and reinstall every dependency',
            'Turn Fast Refresh off and back on in the developer menu',
          ], 0, 'Metro caches transformed modules, and a branch switch or a new dependency can leave that cache describing files that no longer exist, so the bundle stops matching your source.'),
          q('You add a charting library, and Expo Go shows a red screen saying a method is not a function. Nothing in your code touches that method. Most likely cause?', [
            'The package was added with npm instead of expo install, so it never registered',
            'The library ships native code, which Expo Go cannot load, so a development build is needed',
            'Metro needs its cache cleared before a newly added module resolves',
            'The module has to be pulled in with require rather than an import statement',
          ], 1, 'Expo Go contains a fixed set of native modules, so a library with its own native code has no implementation behind the JavaScript wrapper and its methods come back undefined.'),
          q('A helper keys its logs on component.constructor.name. It behaves all through development and reports meaningless labels in the store build. Why?', [
            'Hermes strips constructor names from every class it compiles',
            '__DEV__ is false, so the helper is stripped out of the release bundle',
            'Minification renames classes, so the name is a one or two letter symbol in release',
            'Release builds wrap components in a proxy that hides the constructor',
          ], 2, 'Release bundles are minified, which rewrites identifiers, so anything relying on a function or class name at runtime silently changes meaning between builds.'),
        ]
      ),
        lesson("Testing React Native Code", 13, `
Tests earn their place on mobile because the feedback loop is so slow: a rebuild and reinstall to check a two-line change costs minutes, and a test costs a second.

### Setup

\`\`\`bash
npx expo install jest-expo jest @testing-library/react-native
\`\`\`

\`\`\`json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["@testing-library/react-native/extend-expect"]
  }
}
\`\`\`

### Test behaviour, not implementation

\`\`\`jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import CourseCard from '../CourseCard';

test('calls onPress with the course id', () => {
  const onPress = jest.fn();
  render(<CourseCard course={{ id: 7, title: 'React Native' }} onPress={onPress} />);

  fireEvent.press(screen.getByText('React Native'));

  expect(onPress).toHaveBeenCalledWith(7);
});
\`\`\`

Query the way a user perceives the screen: \`getByText\`, \`getByRole\`, \`getByLabelText\`. Reaching for \`getByTestId\` everywhere produces tests that pass while the app is unusable — and accessible queries fail loudly when you forget the \`accessibilityLabel\` from chapter 2, which is a feature.

### Asynchronous state

\`\`\`jsx
test('shows an error when the request fails', async () => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error('offline'));

  render(<CoursesScreen />);

  expect(await screen.findByText(/could not load/i)).toBeVisible();
  expect(screen.queryByText('React Native')).toBeNull();
});
\`\`\`

Use \`findBy*\` (which retries until the element appears) or \`waitFor\` for anything that resolves later. The \`act\` warning almost always means a promise settled after the test finished — a missing \`await\`, not a bug in the library.

### Anything using navigation needs a navigator

A component calling \`useNavigation\` throws when rendered bare, so wrap it:

\`\`\`jsx
render(
  <NavigationContainer>
    <CourseCard course={course} />
  </NavigationContainer>
);
\`\`\`

Mocking \`@react-navigation/native\` instead is tempting and usually wrong: the mock drifts away from the real API and the test quietly stops proving anything.

For the debounced draft write from chapter 4, drive the clock yourself with \`jest.useFakeTimers()\` and \`jest.advanceTimersByTime(500)\`. A test that waits on real time is both slow and flaky.

### Mock the native layer

Jest runs in Node, where native modules do not exist. Mock them once in a setup file:

\`\`\`js
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => 'test-token'),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}));
\`\`\`

Never let tests reach the real network. Mock \`fetch\` and assert on the states that matter: loading, empty, error, and success — chapter 4's fetch states together with chapter 2's \`ListEmptyComponent\`, and the four users actually see.

### Hooks are testable on their own

\`\`\`jsx
import { renderHook, waitFor } from '@testing-library/react-native';
import { useCourses } from '../useCourses';

test('exposes an error state when the request fails', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

  const { result } = renderHook(() => useCourses());

  await waitFor(() => expect(result.current.status).toBe('error'));
  expect(result.current.data).toEqual([]);
});
\`\`\`

The fetching hook from chapter 4 is pure logic with no pixels, so exercising it directly is far cheaper than rendering an entire screen to reach the same branch.

### What deserves a test

| Worth testing | Skip |
|---|---|
| Reducers, validation, formatting | Styles and layout |
| Loading / empty / error states | Snapshot of an entire screen |
| Auth and refresh logic | Third-party library internals |
| Any bug you have fixed once | Trivial presentational wrappers |

Large snapshot tests are the classic waste: they fail on every intentional change, everyone regenerates them without reading the diff, and they catch nothing.

Write the regression test while the reproduction is still fresh, before the fix. An hour later the bug looks obvious and you will talk yourself out of covering it.

### End to end

\`\`\`yaml
# .maestro/login.yaml — runs against a real build on a device or emulator
appId: com.cortexis.learn
---
- launchApp
- tapOn: "Email"
- inputText: "test@example.com"
- tapOn: "Sign in"
- assertVisible: "All Courses"
\`\`\`

\`maestro test .maestro/login.yaml\` drives the built app the way a person would. Keep a handful of these for the flows that must never break — sign-in, checkout, the core task — and leave everything else to unit tests. E2E suites are slow and flaky in proportion to their size.

### Run them where it counts

\`\`\`bash
jest --ci --coverage --maxWorkers=2   # unit tests on every pull request
\`\`\`

Unit tests belong on every push; the Maestro flows belong on the build that is about to become a release, since they need a real binary. A suite nothing runs automatically decays within weeks, and the first thing to rot is always the mock of a native module whose API has since moved on.
        `,
        [
          q('Why prefer getByText and getByLabelText over getByTestId when querying elements in a test?', [
            'They run faster because test ids are not rendered in production builds',
            'Test ids are stripped from release bundles, so those tests cannot run at all',
            'They can query components that have not finished mounting yet',
            'They fail when a control has no accessible name, which is a real defect worth catching',
          ], 3, 'Querying the way a user perceives the screen means a missing accessibility label breaks the test, so the suite defends accessibility instead of quietly passing around it.'),
          q('You mock @react-navigation/native instead of wrapping the component in a NavigationContainer. What does that cost you?', [
            'The mock drifts from the real API, so the test keeps passing after the screen breaks',
            'Jest cannot mock modules that export a React context',
            'The mocked navigator renders every registered screen, making the test slow',
            'useNavigation throws as soon as the module has been mocked',
          ], 0, 'A hand written mock freezes the library\'s behaviour at the moment you wrote it, so upgrades and API changes stop being caught and the test proves nothing about real navigation.'),
          q('A test for a 500ms debounced draft save waits on a real timeout before asserting. What is wrong with that?', [
            'Real timers are disabled by the jest-expo preset',
            'It is slow and flaky, so drive the clock with fake timers and advance it yourself',
            'The debounce runs on the native thread and never fires under Node',
            'waitFor already advances timers, so the assertion runs twice',
          ], 1, 'Waiting on wall clock time makes every run cost real seconds and fails whenever a loaded machine is slightly late, while advancing fake timers is instant and deterministic.'),
        ]
      ),
        lesson("Crash Reporting and Release Health", 12, `
Once the app is on other people's phones, you cannot reproduce anything you cannot see. Crash reporting is not optional infrastructure — it is the only view you have.

### Wire up Sentry before launch

\`\`\`bash
npx expo install @sentry/react-native
\`\`\`

\`\`\`jsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  environment: __DEV__ ? 'development' : 'production',
  release: 'cortexis-learn@1.2.0',
  tracesSampleRate: 0.2,          // sample performance traces; 1.0 is expensive
});

export default Sentry.wrap(App);
\`\`\`

Tag the \`release\` with the same version string you set in \`app.json\` (chapter 5). Without it, every crash from every build merges into one unreadable pile and you cannot tell whether today's fix worked.

### Source maps are the whole point

A minified stack trace reads \`t.a is not a function at index.android.bundle:1:284915\` — useless. The Sentry Expo plugin uploads source maps during an EAS build automatically. **Verify this on your first release build**, because the failure mode is silent: crashes still arrive, they are simply unreadable, and you discover it during the incident when you least want to.

### Error boundaries catch render errors only

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) { Sentry.captureException(error, { extra: info }); }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={styles.center}>
        <Text>Something went wrong.</Text>
        <Pressable onPress={() => this.setState({ failed: false })}>
          <Text>Try again</Text>
        </Pressable>
      </View>
    );
  }
}
\`\`\`

A boundary catches errors thrown **during render**. It does not catch errors in event handlers, in \`setTimeout\`, in async code, or in native modules — those need their own \`try/catch\` and a \`Sentry.captureException\`. Wrap each screen rather than only the root, so one broken screen does not replace the entire app with an error page.

### Context, not personal data

\`\`\`jsx
Sentry.setUser({ id: user.id });                       // an id, never an email
Sentry.addBreadcrumb({ category: 'nav', message: 'CourseDetail', level: 'info' });
\`\`\`

Breadcrumbs are what turn "TypeError on line 40" into a reproducible sequence. Scrub tokens and request bodies before they leave the device — a crash report containing an \`Authorization\` header is a leak sitting in a third-party dashboard, and your store privacy disclosures must cover whatever you do send.

### The number that matters

**Crash-free session rate.** Below roughly 99.5% you have a problem worth stopping for; below 99% your reviews are already showing it. Track it per release and per OS version — a regression that only affects Android 10 disappears entirely in an aggregate figure.

Alert on that number rather than visiting a dashboard out of habit. The releases that hurt are the ones that go wrong at two in the morning on a Saturday.

### Log the failures that are not crashes

Most of the damage is done by errors the app survives: an upload swallowed by a \`catch\`, a payment that silently did nothing.

\`\`\`jsx
try {
  await uploadAvatar(uri);
} catch (err) {
  Sentry.captureException(err, { tags: { feature: 'avatar-upload' } });
  Alert.alert('Upload failed', 'Please try again.');
}
\`\`\`

Never write \`catch {}\`. An empty catch turns a reportable bug into a feature that quietly does nothing, and those become the support tickets you cannot act on — "it just does not work", with no trace anywhere.

Watch **adoption** too: the share of sessions running your newest release. A fix helps nobody until users actually have it, and on iOS a store update takes days to reach most devices. That gap is exactly where an over-the-air JavaScript fix earns its keep.

### Getting a fix out

| Fault | Response |
|---|---|
| JavaScript-only bug | \`eas update\` — minutes, no review |
| Native module, permission, SDK change | New build and store submission |
| A release going wrong mid-rollout | Halt the staged rollout, or republish the previous OTA update |

Use Google Play's staged rollout and the App Store's phased release for anything risky: ship to 5%, watch the crash-free rate for a day, then continue. Catching a crash at 5% instead of 100% is the difference between a quiet fix and a one-star review campaign.

Close the loop properly. Every crash you fix should end with the regression test from the previous lesson, so the same defect cannot reach a device twice.
        `,
        [
          q('Crashes arrive in your dashboard as t.a is not a function at index.android.bundle:1:284915. What is missing?', [
            'The release tag passed to Sentry.init',
            'An error boundary wrapped around the failing screen',
            'Source map upload during the build, which nobody verified on the first release',
            'A higher tracesSampleRate so more detail is captured',
          ], 2, 'Without matching source maps the reported frames point at minified bundle offsets, so reports keep arriving and remain unreadable until the upload is confirmed working.'),
          q('Your overall crash free session rate reads 99.6%, yet store reviews describe constant crashing. What should you look at?', [
            'The total session count, which may be too small to be meaningful',
            'Whether breadcrumbs are enabled on the screens people mention',
            'The performance trace sample rate, which is hiding some of the crashes',
            'The same rate split by release and by OS version, where one segment can be far worse',
          ], 3, 'An aggregate figure averages a broken segment away, so a build that fails for every user on one OS version can still look healthy across the whole install base.'),
          q('Why is wrapping an avatar upload in catch {} worse than letting the error propagate?', [
            'The failure never reaches your dashboard, so the support ticket arrives with no trace behind it',
            'An empty catch holds the promise alive and leaks memory over time',
            'Uncaught rejections are reported, but an empty catch downgrades them to warnings',
            'The nearest error boundary would otherwise have retried the upload',
          ], 0, 'Swallowing the error converts a reportable defect into a feature that quietly does nothing, which is exactly the class of bug you cannot act on afterwards.'),
        ]
      ),
            lesson('Analytics for the Failures That Never Crash', 12, `
Crash free sessions sit at 99.8%. Sentry is quiet. Avatar upload has been broken on Android 13 for nine days, because the request returns a 413 and a \`catch\` shows a toast nobody reports. Nothing crashed. Roughly four thousand people simply gave up on a feature, and the only place that fact existed was in the numbers nobody collected.

### Instrument the task, not the app

Track the steps of something a user is trying to finish. One row per step, counted for a week:

| Event | Count | Drop |
|---|---|---|
| \`avatar_upload_started\` | 4,120 | |
| \`avatar_permission_granted\` | 3,940 | 4% |
| \`avatar_picked\` | 3,180 | 19% |
| \`avatar_upload_succeeded\` | 1,050 | 67% |

That last row is the outage, and it is legible in seconds. With only the final event you would have known that few people have avatars, which sounds like a design problem and is not.

### Name events like a schema

Use \`snake_case\`, a past tense verb, and put the variable parts in properties:

\`\`\`jsx
analytics.track('quiz_submitted', {
  course: 'react-native',
  chapter: 3,
  score: 0.9,
});
\`\`\`

The failure mode is \`quiz_submitted_react_native_ch3\`. Encode values in the name and you get one event per course per chapter, hundreds of them within a month, and no way to ask a question that spans them. Names are a schema, so agree on them once and write them down.

Screen tracking comes free from the navigator you already have:

\`\`\`jsx
<NavigationContainer
  ref={navigationRef}
  onStateChange={() => {
    const route = navigationRef.getCurrentRoute();
    if (route) analytics.track('screen_view', { screen: route.name });
  }}
>
\`\`\`

### Events arrive late and out of order

Mobile SDKs batch events and queue them while the device is offline. Something fired on the underground can land four hours later, and a phone left in a drawer over the weekend delivers Friday's events on Monday.

Two consequences. Send a client timestamp with every event and report on that, or Monday absorbs Friday and every daily chart lies. And never treat live event volume as a health check, because a drop in it might be a broken release or might be a country asleep.

### Instrument the failure, not only the success

\`\`\`jsx
try {
  await uploadAvatar(uri);
  analytics.track('avatar_upload_succeeded', { bytes: file.size });
} catch (err) {
  analytics.track('avatar_upload_failed', {
    reason: err.status ?? 'network',
    bytes: file.size,
  });
  Sentry.captureException(err);
  throw err;
}
\`\`\`

One property turns an outage into a diagnosis. When 92% of \`avatar_upload_failed\` carries \`reason: 413\`, the bug is a body size limit on your server and not the picker, and you knew that before opening a single stack trace.

### What must never leave the device

No email addresses, no names, no free text the user typed, because search boxes collect card numbers and medical details from people who do not realise where they are typing. Send an identifier, and hash anything you need to join on later. Everything an analytics SDK collects, including an advertising identifier it gathers on its own, belongs in the store data disclosures from chapter 5.

### Keep the volume honest

Every event costs battery, cellular data the user paid for, and a line on a vendor bill priced per event. A \`scroll_position\` event fired per frame has shipped more than once, and it is a defect, not thoroughness.

Instrument what you will act on: the funnel that carries your revenue, the flows covered by your end to end tests, and every failure path you have already had to fix once.
      `,
        [
          q('Avatar upload fails for every Android 13 user for nine days, and the crash free session rate never moves. Why did crash reporting miss it?', [
            'Sentry samples events, so a failure on one OS version fell outside the sample',
            'The code caught the error and carried on, so there was never a crash to report',
            'Android reports handled errors to the system rather than to the SDK',
            'The error boundary reset the screen before any report could be sent',
          ], 1, 'A handled error leaves the app running, so nothing reaches a crash reporter unless you explicitly capture it, which is why funnel events are what expose silent breakage.'),
          q('Why is quiz_submitted_react_native_ch3 a damaging event name?', [
            'Most vendors enforce a limit of around 32 characters on event names',
            'Underscores are not accepted as separators by most analytics SDKs',
            'It multiplies into one event per course and chapter, so nothing can be compared',
            'Event names have to be past tense before they can appear in a funnel',
          ], 2, 'Encoding values in the name explodes the event list and makes cross-course questions impossible, whereas properties keep one event that can be filtered and grouped.'),
          q('Monday\'s numbers look different when you open the same dashboard on Wednesday. What is the most likely explanation?', [
            'The SDK deduplicates repeated events after a 48 hour window',
            'Sampling is recalculated once a full week of data has arrived',
            'Screen view events are only flushed when the app is terminated',
            'Events queued on offline devices arrived later and were counted by client timestamp',
          ], 3, 'Mobile SDKs batch and buffer while a device is offline, so a phone that reconnects days later backfills events into the day they actually happened.'),
        ]
      ),
      ],
      [
        q("The app closes instantly with no red screen and nothing in the JS console. Where is the cause?", [
          "In the Metro bundler cache",
          "In a native crash — check adb logcat or the Xcode console",
          "In an unhandled promise rejection",
          "In an error boundary that swallowed it",
        ], 1, "A native-level crash bypasses the JavaScript error screen entirely, so the trace only appears in the platform log."),
        q("A test warns about updates not wrapped in act(...). What does that usually mean?", [
          "A native module needs mocking",
          "The component uses too many hooks",
          "The jest-expo preset is missing",
          "A promise resolved after the test finished — something was not awaited",
        ], 3, "The warning marks state updates arriving outside the test's control, normally a missing await on findBy* or waitFor."),
        q("Why tag Sentry events with a release version?", [
          "Otherwise crashes from every build merge together and you cannot tell whether a fix worked",
          "Sentry rejects untagged events",
          "It enables source map upload",
          "It is required for breadcrumbs",
        ], 0, "Per-release grouping is what lets you compare crash-free rates before and after a change."),
        q("Which failure will an error boundary NOT catch?", [
          "A TypeError thrown while rendering a child",
          "An undefined property read in a child's render",
          "An error thrown inside an onPress handler",
          "A child component returning invalid markup",
        ], 2, "Error boundaries only intercept errors thrown during rendering; event-handler and async errors need their own try/catch."),
      ]
    ),
      chapter(
      'Startup, Memory, and Real Devices',
      'The slow launches, out of memory kills, and frozen frames that only appear on a mid range Android phone holding a real amount of data.',
      [
      lesson('Cold Start and Time to Interactive', 13, `
Tap to a usable screen on a Galaxy A14: 4.2 seconds. On the iPhone 15 Pro on your desk: 900ms. Same bundle, same commit, same afternoon. The A14 number is the one Google Play collects, and Android vitals flags a cold start slower than 5 seconds as excessive.

Cold start is three costs stacked on each other, and each one needs a different fix.

### The three phases

| Phase | What is running | Budget on a mid range Android |
|---|---|---|
| Native init | Process fork, Application.onCreate, Activity onCreate, React host setup | 250ms |
| Bundle load and eval | Hermes bytecode mapped in, every root module factory executed | 400ms |
| First render | React builds and commits the first screen | 300ms |
| Data to interactive | Cached data painted, taps actually do something | 500ms |

Hermes helps with phase two, but not the way people assume. It compiles to bytecode at build time, so there is no JavaScript parse on the device. Execution still costs. Every module reachable from the top of \`index.js\` runs its side effects before your first component exists.

### Measure the phases separately

A stopwatch gives you one number and no direction. Markers give you three.

\`\`\`js
// index.js, before anything else
import performance from 'react-native-performance';
import { AppRegistry } from 'react-native';
import App from './src/App';

performance.mark('bundleEvaluated');
AppRegistry.registerComponent('cortexisLearn', () => App);
\`\`\`

\`\`\`jsx
// CatalogueScreen.jsx, once real rows are painted
useEffect(() => {
  if (!courses.length) return;
  performance.measure('tti', 'nativeLaunchStart');
}, [courses.length]);
\`\`\`

That library exposes native entries you cannot get from JavaScript alone: \`nativeLaunchStart\`, \`runJsBundleStart\`, \`runJsBundleEnd\`. The gaps between them assign blame. If \`runJsBundleStart\` to \`runJsBundleEnd\` is 900ms, your import graph is the problem. If \`nativeLaunchStart\` to \`runJsBundleStart\` is 1.4 seconds, no amount of JavaScript tuning will help you.

### The import graph is the startup cost

Broken, and extremely common:

\`\`\`js
// src/analytics.js
import Analytics from '@segment/analytics-react-native';

export const analytics = Analytics.createClient({ writeKey: KEY }); // runs at import
\`\`\`

Anything that imports a screen that imports this file pays for the client at launch, on every launch, whether the user ever triggers an event or not. Make it lazy:

\`\`\`js
let client;
export const getAnalytics = () => {
  if (!client) client = Analytics.createClient({ writeKey: KEY });
  return client;
};
\`\`\`

Then let Metro do the same thing to everything else. Inline requires rewrite top level imports into a \`require\` at first use, which is the default in recent Expo SDKs and one config block in bare:

\`\`\`js
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: { inlineRequires: true },
    }),
  },
};
\`\`\`

The gotcha: inline requires change evaluation order. A module you imported purely for its side effect, an i18n setup or a polyfill, now runs when something first touches it, which may be after the code that depended on it. That failure appears as an undefined value at launch, usually only in a release build, and it looks nothing like a config change.

### The splash screen will lie to you

Holding the splash with \`SplashScreen.preventAutoHideAsync()\` and dropping it when the navigator mounts feels like the finish line. It is not. What you have measured is a skeleton. Time to interactive means the moment a tap does something real, so mark it where cached data is on screen, not where the first \`View\` appears.

One more number worth keeping. On that A14, three changes took 4.2 seconds to 1.8: dropping a moment locale bundle, moving Firebase off module scope, and turning on inline requires. Bundle size was the smallest of the three wins. Startup is dominated by what runs, not by what ships.
      `,
        [
          q('Hermes compiles your bundle to bytecode at build time, so there is no parse on device. Why can startup still spend 900ms on the bundle?', [
            'Module factories still execute, and top level side effects run before your first component',
            'Hermes expands the bytecode back into JavaScript before the first frame',
            'The bytecode is verified instruction by instruction on every launch',
            'Bytecode only applies to release, so the loader parses source in between',
          ], 0, 'Precompilation removes parsing but not execution, so every module reachable from index.js runs its side effects during startup whether the user needs it or not.'),
          q('You enable inline requires and a release build now throws an undefined value at launch, while debug is fine. Most likely cause?', [
            'Metro cannot inline requires in a bundle compiled by Hermes',
            'Inlining drops modules that are imported only for a side effect',
            'Evaluation order moved, so a setup module ran after its dependant',
            'The bytecode cache still holds the old graph and needs clearing',
          ], 2, 'Inline requires defer a module until first use, so anything imported purely to run early, such as a polyfill or an i18n setup, can now execute after the code that assumed it had already run.'),
          q('Your markers show nativeLaunchStart to runJsBundleStart taking 1.4 seconds. Where is the time worth spending?', [
            'Trimming the import graph so fewer module factories execute',
            'Turning on inline requires in the Metro transformer options',
            'Rendering a lighter first screen with fewer mounted components',
            'Native initialisation, because JavaScript has not started yet',
          ], 3, 'That interval ends before the bundle begins evaluating, so it is entirely native process and host setup and no JavaScript change can move it.'),
        ]
      ),
      lesson('Lists, Images, and Memory at Real Volume', 13, `
Your catalogue screen was built against 40 rows of seed data. A real user opens it holding 12,000 saved items with eight full resolution photos on screen, and Android kills the process somewhere around row 300. No red screen. No crash report. No Sentry event. The app simply closes, and to the user that reads as a crash.

Memory is the one budget with a hard wall behind it.

### The wall is lower than you think

Android sets a per process heap limit chosen by the device, commonly 192MB or 256MB, and the large heap flag buys only a little more. iOS publishes no number, but jetsam terminates a foreground app somewhere between a third and a half of physical RAM, which on an older 2GB device is not much. Neither platform warns you first, and neither gives you a stack trace.

### Images are almost always the cause

A decoded bitmap costs \`width * height * 4\` bytes. The file size on disk is irrelevant, because JPEG compression is undone the instant the pixels exist.

| Source | Decoded in memory | Eight on screen |
|---|---|---|
| 4032 x 3024, a 3MB phone photo | 48.8MB | 390MB |
| 1200 x 900 | 4.3MB | 34MB |
| 288 x 288 thumbnail | 331KB | 2.6MB |

Broken, and it looks perfectly reasonable:

\`\`\`jsx
<Image source={{ uri: photo.url }} style={styles.thumb} />  // 96pt box, 48MB of pixels
\`\`\`

Fixed, with a backend that can resize and a component that can recycle:

\`\`\`jsx
import { Image } from 'expo-image';

<Image
  source={{ uri: \`\${photo.url}?w=288&h=288&fit=cover\` }}
  recyclingKey={photo.id}
  cachePolicy="memory-disk"
  contentFit="cover"
  style={styles.thumb}
/>
\`\`\`

288 is 96 points at 3x. Ask for the pixels you draw, not the pixels that exist.

\`recyclingKey\` is the prop people skip. Without it, a recycled row shows the previous item's image for a beat while the new one loads, which reads as a rendering bug and gets debugged as one.

### Unmount versus recycle

FlatList destroys rows once they fall far enough outside the window and rebuilds them on the way back. FlashList keeps a pool and reuses the same components with new data. Recycling is faster and flatter, and it brings one bug class with it: local state inside a row survives into whatever item lands in that component next. A row holding \`expanded\` in \`useState\` will show the wrong item expanded after a fast fling. Lift that state into the list data or key it by item id.

The props that genuinely move memory:

| Prop | Default | Effect |
|---|---|---|
| windowSize | 21 | Rows kept mounted, measured in screens. 51 smooths flings and roughly doubles resident rows |
| initialNumToRender | 10 | Rows in the first commit, so this one lands on cold start too |
| maxToRenderPerBatch | 10 | Rows per scroll batch. Higher fills blank space faster and blocks JS longer |
| removeClippedSubviews | platform dependent | Detaches offscreen native views. Real savings on Android, occasional blank rows |

### The data is memory too

Twelve thousand course objects in a store, plus a filtered copy, plus a sorted copy, is not three times the objects: the copies share references. What it is instead is three arrays rebuilt on every keystroke, all of them garbage a moment later, which means constant GC pressure on the thread that also has to render. Normalise to \`{ byId, allIds }\`, page the API, and derive with \`useMemo\`.

### Watching it happen

\`\`\`bash
adb shell dumpsys meminfo com.cortexis.learn | head -20
\`\`\`

Scroll the list and watch \`TOTAL PSS\`. Flat is healthy. Rising and falling is normal pressure. Rising and never returning after you scroll back to the top is a leak, and the usual suspects are a \`Map\` of URIs that only ever grows, a listener added inside \`renderItem\` with no cleanup, or a navigator holding every screen you have visited still mounted.
      `,
        [
          q('A 4032 by 3024 photo is displayed in a 96 point thumbnail. Roughly how much memory does one decoded copy hold?', [
            'About 3MB, matching the compressed JPEG on disk',
            'About 48MB, since decoding costs width times height times 4',
            'About 12MB, one byte per pixel after downsampling',
            'About 331KB, the pixels the 96 point box draws',
          ], 1, 'A decoded bitmap holds four bytes per source pixel regardless of the box it is drawn into, so 12 megapixels occupies roughly 48MB until you ask the server for a smaller image.'),
          q('You raise windowSize from 21 to 51 to stop blank space during fast flings. What did that trade?', [
            'Smoother flings, and rows now recycle rather than unmount',
            'Smoother flings, and the list stops measuring row heights',
            'Smoother flings, and images decode at a lower resolution',
            'Smoother flings, and roughly twice as many rows resident',
          ], 3, 'windowSize is measured in screenfuls of mounted rows, so more than doubling it keeps far more rows and their images alive at once, which is exactly the budget that gets an app killed.'),
          q('You move a list from FlatList to FlashList and rows start showing the wrong expanded state after a fling. Why?', [
            'FlashList reuses row components, so local state lands on another item',
            'FlashList needs estimatedItemSize before it can track row identity',
            'FlashList batches its renders, so state updates arrive a frame late',
            'FlashList ignores keyExtractor and keys every row by its index',
          ], 0, 'Recycling reuses the same component instance with new data instead of unmounting it, so any useState held inside the row carries over to whichever item is placed there next.'),
        ]
      ),
      lesson('Frozen Frames, ANRs, and a Blocked Thread', 13, `
Play Console reports a user perceived ANR rate of 0.9 percent. The bad behaviour threshold is 0.47 percent, so the listing gets demoted in search and installs fall before anyone opens a bug. Meanwhile support tickets describe something else entirely: the app freezes for four or five seconds, the spinner keeps spinning, taps do nothing.

Those are two different faults on two different threads, and the fix for one does nothing for the other.

### Two threads, two failure modes

| Thread | Blocked by | What the user sees | What the platform does |
|---|---|---|---|
| Native main (UI) | A native module doing disk or network work, a heavy Application.onCreate, a synchronous module call | Nothing draws at all, not even a scroll | ANR dialog after 5 seconds of undelivered input |
| JavaScript | JSON.parse, sort, filter, a tight loop, a synchronous storage read | The screen is drawn but completely inert | Nothing. No dialog, no report, no metric |

That second row catches teams out for months. React Native runs your JavaScript off the main thread, so a JS thread blocked for eight seconds never trips the ANR watchdog and never appears in Play vitals. Worse, any animation you moved to the native driver keeps running perfectly through the freeze. The spinner spins, the app looks busy rather than broken, users read it as slow instead of stuck, and they wait, and then they uninstall.

### Slow frames and frozen frames

At 60Hz you get 16.67ms per frame, at 120Hz you get 8.33ms. Android vitals counts anything over budget as a slow frame and anything past 700ms as a frozen frame. One frozen frame is a stall a person can see.

### What actually blocks JavaScript

Measured on a Galaxy A14, release build, real payloads:

\`\`\`js
JSON.parse(body)                       // 4.1MB catalogue response: ~380ms
courses.sort(byTitle)                  // 12,000 items: ~140ms
courses.filter(matches(query))         // 12,000 items, per keystroke: ~55ms
new RegExp(userPattern).test(bigString) // catastrophic backtracking: unbounded
\`\`\`

Fifty five milliseconds sounds harmless. At a normal typing speed it is a full scan every 120ms on the same thread that has to render the results, and the text field falls half a second behind the finger.

Broken:

\`\`\`jsx
const onChangeText = (q) => {
  setQuery(q);
  setResults(courses.filter(c => c.title.toLowerCase().includes(q.toLowerCase())));
};
\`\`\`

Fixed by keeping the input instant and letting the expensive half fall behind:

\`\`\`jsx
const [query, setQuery] = useState('');
const deferred = useDeferredValue(query);

const index = useMemo(
  () => courses.map(c => ({ course: c, key: c.title.toLowerCase() })),
  [courses]
);

const results = useMemo(() => {
  const needle = deferred.toLowerCase();
  return index.filter(r => r.key.includes(needle)).slice(0, 50);
}, [index, deferred]);
\`\`\`

Two changes matter more than the hook: lowercasing 12,000 titles once instead of on every keystroke, and committing 50 rows instead of every match.

### setTimeout does not yield

\`\`\`js
setTimeout(() => { for (const row of rows) reindex(row); }, 0);
\`\`\`

That moves a 900ms block one tick later. It is still 900ms with no frame anywhere inside it. Yield against a budget instead:

\`\`\`js
async function chunked(items, work, budgetMs = 8) {
  let start = Date.now();
  for (const item of items) {
    work(item);
    if (Date.now() - start > budgetMs) {
      await new Promise(resolve => setTimeout(resolve, 0));
      start = Date.now();
    }
  }
}
\`\`\`

For work that only needs to happen after a screen transition, \`InteractionManager.runAfterInteractions\` waits until animations settle. For work that should never touch the JS thread at all, you need a worklet or a native module, which is where the next two chapters go.

### The best fix is usually not code

That 4.1MB response is the actual defect. Paginating the catalogue endpoint to 50 rows deletes the parse cost, the sort cost, and most of the memory pressure in a single change, on every device, forever. Check the payload before you open a profiler.
      `,
        [
          q('Your JavaScript thread is blocked for eight seconds parsing a large response. What do Android users actually experience?', [
            'An ANR dialog, because the five second input limit was crossed',
            'A crash report carrying the JavaScript stack of the blocked frame',
            'A frozen screen where native driver animations keep running',
            'Nothing unusual, because JavaScript never touches the UI thread',
          ], 2, 'The JS thread is not the native main thread, so the watchdog never fires, while animations already handed to the native driver keep playing and make a dead app look merely busy.'),
          q('Which of these actually produces an ANR rather than an unresponsive JavaScript thread?', [
            'A native module reading a file on the main thread in onCreate',
            'JSON.parse over a four megabyte catalogue response payload',
            'A sort across twelve thousand rows called inside a render',
            'An animation driven from JavaScript with useNativeDriver false',
          ], 0, 'An ANR is raised when the native main thread fails to handle input for five seconds, and only native work scheduled on that thread can hold it that long.'),
          q('You wrap a 900ms loop in setTimeout with a delay of 0 and the freeze is unchanged. Why?', [
            'Hermes clamps every timer to a minimum delay of four milliseconds',
            'The work still runs as one uninterrupted block, only one tick later',
            'Timers are dispatched on the main thread, so the block simply moved',
            'The JS thread cannot yield until every pending timer has drained',
          ], 1, 'Deferring work does not divide it, so the same uninterrupted 900ms of JavaScript runs with no frame inside it unless you yield repeatedly against a time budget.'),
        ]
      ),
      lesson('Native Traces with Perfetto and Instruments', 13, `
The Hermes sampling profiler says the JS thread is idle for 1.4 of the 2.0 seconds your profile screen takes to appear. The delay is real, users feel it, and it is not in your JavaScript. No JavaScript tool will ever show it to you.

Three profilers, three scopes. Choose by what you already know.

| Question you are asking | Tool | What you read |
|---|---|---|
| Which components re-render, and how often | React DevTools profiler | Commit flamegraph, render durations |
| Which JS functions burn the JS thread | Hermes sampling profiler | Sampled stacks, self and total time |
| Where did this frame actually go | Perfetto on Android, Instruments on iOS | Every thread: main, RenderThread, GC, binder |

### Android: Perfetto

Record on the device, pull the file, open it at ui.perfetto.dev.

\`\`\`bash
adb shell perfetto -o /data/misc/perfetto-traces/app.pftrace -t 10s \\
  sched gfx view input am wm binder_driver dalvik

adb pull /data/misc/perfetto-traces/app.pftrace ./app.pftrace
\`\`\`

Keep the category list short. Enabling everything on a busy device produces hundreds of megabytes for ten seconds, and the trace viewer will refuse to open it.

Find your process, then read three tracks:

- The **main thread**, where \`Choreographer#doFrame\` should finish inside 16ms. A long slice here is both your stutter and your ANR risk.
- **RenderThread**, which issues the GPU work. Long slices mean over drawing: stacked translucent layers, shadows, blurs, a background image under a background colour.
- **binder** transactions, which are calls into other processes. A 300ms binder slice during startup is usually a permission check, a content provider, or an SDK phoning home.

A real diagnosis from that list: a 900ms stall opening a profile screen appeared in Perfetto as one binder transaction to the media provider. An image picker library was resolving a content URI on the main thread. Nothing in JavaScript could have pointed at it, and the fix was moving one native call to a background executor.

Label your own work so it appears on the same timeline as the native slices:

\`\`\`js
import { Systrace } from 'react-native';

Systrace.beginEvent('buildCatalogueIndex');
const index = buildIndex(courses);
Systrace.endEvent();
\`\`\`

For JS stacks specifically, enable the sampling profiler in the dev menu, reproduce the slow path, stop it, then convert what lands on disk:

\`\`\`bash
npx react-native profile-hermes ./traces
\`\`\`

That gives you a \`.cpuprofile\` you open in Chrome DevTools.

### iOS: Instruments

Product then Profile in Xcode launches Instruments against a Release configuration, which is the only configuration worth a measurement.

| Template | What it answers |
|---|---|
| Time Profiler | Which frames own the CPU, broken down per thread |
| Allocations | Memory that grows and never comes back down |
| Leaks | Retain cycles in native code and bridged objects |
| Animation Hitches | Which frames missed, with the reason attached |

Xcode Organizer is the underrated one. It reports field metrics from real installs: launch time, hang rate, memory, disk writes, split by device class. That is a percentile across thousands of phones instead of one run on your desk, and it is the only place you will see what your slowest users actually experience.

### Every profiler distorts what it measures

Instrumentation is not free. Allocations can push a 240MB run to 410MB, atrace adds cost to every slice it records, and a debug build is a genuinely different program. Read profiler output as relative: this run against that run, this build against last week's. The absolute number belongs to the profiler, not to your app.

### A loop that converges

1. Reproduce on the slowest device you support, in a release build, with real data volume.
2. Look at the frame timeline before you look at any code, and decide which thread is late.
3. Only then pick the profiler that can see that thread.
4. Change one thing, record again, compare the same slice.

Skipping step two is how an afternoon disappears into optimising a \`renderItem\` that was never the problem.
      `,
        [
          q('The Hermes sampling profiler shows the JS thread idle for the 1.4 seconds a screen takes to appear. What does that tell you?', [
            'The profiler failed to attach, so the samples cannot be trusted',
            'React is rendering, but the profiler only samples native frames',
            'The time went to garbage collection, which sampling cannot see',
            'The cost sits on another thread, so you need a native trace',
          ], 3, 'An idle JS thread during a visible delay means the work belongs to the main thread, the render thread, or another process, and only a whole system trace can show those.'),
          q('You record twenty seconds of Perfetto with every category enabled and the trace will not open. What went wrong?', [
            'Traces must be converted with profile-hermes before the UI reads them',
            'Broad categories on a busy device produce a file too large to load',
            'Perfetto only records while the app is running in the foreground',
            'The device needs a release build before atrace will emit any slices',
          ], 1, 'Categories like sched emit an enormous number of events per second on a busy device, so a long recording with everything enabled easily exceeds what the viewer can load.'),
          q('Instruments Allocations reports your app at 410MB, while the same run without Instruments sits near 240MB. How should you read that?', [
            'Allocations is authoritative, so 410MB is the figure to fix',
            'The gap is the debug build, so repeat the run in release',
            'Instrumentation has a cost, so compare runs instead of absolutes',
            'Allocations includes the disk cache, so subtract the image cache',
          ], 2, 'Profilers add their own bookkeeping to every allocation they track, so the useful signal is the difference between two runs under the same tool rather than the raw number.'),
        ]
      ),
      ],
      [
      q('Cold start on a mid range Android is 4.2 seconds. Native launch to bundle start is 300ms, and bundle evaluation is 2.1 seconds. What do you attack first?', [
        'The import graph and the module side effects that run at startup',
        'The native initialisation happening inside Application.onCreate',
        'The number of components mounted by your very first screen',
        'Image decoding on the first list of rows that appears',
      ], 0, 'The measurement already places most of the delay inside bundle evaluation, which is dominated by which modules execute and what they do at import time.'),
      q('A gallery shows eight full resolution camera photos at once and the OS kills the app. Which change addresses the cause?', [
        'Raising windowSize so fewer rows are recreated while scrolling',
        'Switching the list from FlatList to ScrollView for stability',
        'Requesting server resized images sized for the box they render in',
        'Wrapping each row in React.memo with a stable press callback',
      ], 2, 'Decoded bitmaps are sized by the source image, not the layout box, so the only real fix is fetching pixels that match what you draw.'),
      q('Play Console shows a healthy ANR rate while support tickets describe an app that freezes for seconds at a time. What explains both?', [
        'Crashes, which the store counts under a separate metric entirely',
        'Frames dropped by over drawing on the Android render thread',
        'Native modules blocking during their own initialisation at launch',
        'A blocked JavaScript thread, which never trips the ANR watchdog',
      ], 3, 'Android only measures the native main thread, so JavaScript can stall for many seconds and produce a completely inert screen without registering anywhere in vitals.'),
      q('Scrolling stutters only on Android, and the JS thread stays under 30 percent busy throughout. Which tool answers it?', [
        'The Hermes sampling profiler, converted with profile-hermes',
        'A Perfetto trace, showing main and render threads per frame',
        'The React DevTools profiler, to find components re-rendering',
        'Instruments with the Animation Hitches template attached',
      ], 1, 'An idle JS thread rules out JavaScript tooling, and Perfetto is the Android trace that shows where each frame went across the main and render threads.'),
      ]
    ),
    chapter(
      'Motion, Gesture, and Native Feel',
      'Interactions driven by Reanimated worklets and Gesture Handler, so a finger on the glass never waits for JavaScript.',
      [
      lesson('Reanimated Worklets and the UI Thread', 13, `
A 250ms fade on a course card looks perfect in the simulator. On a Pixel 6a, opening that same screen while 400 courses parse out of a JSON response, the fade sticks at roughly 40% opacity for a third of a second and then jumps to full. The animation is not wrong. It is queued behind \`JSON.parse\` on the JavaScript thread.

React Native runs your code on the JS thread and composites frames on the UI thread. At 60Hz you have 16.7ms to produce a frame, at 120Hz you have 8.3ms. An animation whose next value is computed in JavaScript dies the instant the JS thread is busy, and chapter 8 showed exactly how busy a real screen gets.

### What a worklet actually is

Reanimated starts a second JavaScript runtime that lives on the UI thread. A function marked \`'worklet'\` is extracted by the Reanimated Babel plugin, serialised together with the variables it closes over, and installed into that runtime. When it runs it never touches your main JS runtime, so a blocked JS thread cannot stall it.

\`\`\`jsx
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function CourseCard({ course }) {
  const opacity = useSharedValue(0);

  const style = useAnimatedStyle(() => ({          // body is a worklet, runs on the UI thread
    opacity: opacity.value,
    transform: [{ scale: 0.96 + opacity.value * 0.04 }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 250 });
  }, []);

  return <Animated.View style={[styles.card, style]}>{/* ... */}</Animated.View>;
}
\`\`\`

\`useSharedValue\` returns a box both runtimes can read and write. \`useAnimatedStyle\` re-runs on the UI thread whenever a shared value it reads changes and hands the result straight to the native view, without a render, without a bridge hop, without your components knowing anything happened.

### The mistake everyone makes twice

A shared value is not state. Reading it during render gives you a number that will never cause a re-render:

\`\`\`jsx
// Broken: the label renders "0%" once and stays there forever
const progress = useSharedValue(0);
return <Text>{Math.round(progress.value * 100)}%</Text>;
\`\`\`

If a number has to reach React, it has to cross back deliberately, and you throttle it, because every crossing is scheduled work on the thread you are trying to keep free:

\`\`\`jsx
useAnimatedReaction(
  () => Math.round(progress.value * 100),
  (percent, previous) => {
    if (percent !== previous) runOnJS(setPercent)(percent);
  }
);
\`\`\`

Calling a plain function from a worklet without \`runOnJS\` throws \`Tried to synchronously call a non-worklet function on the UI thread\`. That is the most common Reanimated stack trace there is, and it always means the same thing: something that talks to React, navigation, or a native module got invoked from the wrong runtime.

### Timing versus spring

| | \`withTiming\` | \`withSpring\` |
|---|---|---|
| Driven by | duration and easing curve | damping, stiffness, mass |
| Honours release velocity | no | yes |
| Interrupted mid flight | restarts from the current value | absorbs the current velocity |
| Right for | fades, colour, progress bars | anything a finger just let go of |

\`withSpring(0, { damping: 18, stiffness: 220 })\` on a released card feels correct because the motion inherits the speed of the throw. A 300ms ease out on the same card feels rubbery: it ignores how hard you flung it. Keep durations for movement the user did not physically cause.

One cost that only appears at scale: every worklet closure is copied into the UI runtime. Close over a 400 item array inside \`useAnimatedStyle\` and you copy that array. Worklets should capture shared values and primitives, nothing else.
      `,
        [
          q('A fade freezes halfway whenever the screen parses a large API response. It uses Animated.timing with useNativeDriver left at false. Why does moving it to Reanimated fix the stutter?', [
            'Reanimated batches style updates so fewer of them cross per frame',
            'The animation runs in a second runtime on the UI thread, which a busy JS thread cannot stall',
            'Reanimated moves the JSON parsing to a worker, freeing the JS thread up',
            'Shared values bypass React, so the component stops re-rendering during the fade',
          ], 1, 'Worklets are installed into a separate JavaScript runtime that executes on the UI thread, so frame values keep being produced even while the main JS thread is blocked.'),
          q('A shared value drives a progress bar, and a Text label renders Math.round(progress.value * 100). The bar animates smoothly and the label never changes. What is happening?', [
            'The label needs its own shared value to subscribe to the same animation',
            'Text cannot sit inside Animated.View, so its animated props are ignored',
            'Reading .value during render returns a number but subscribes to nothing, so React never re-renders',
            'withTiming writes only on the UI runtime and never updates the JS side',
          ], 2, 'A shared value is a mutable box rather than React state, so reading it in the render body produces a one time snapshot and no update is ever scheduled.'),
          q('A spring completion callback calls onClose() to pop the screen, and the app crashes with "Tried to synchronously call a non-worklet function on the UI thread". What is the fix?', [
            'Wrap it as runOnJS(onClose)(), because onClose belongs to the React runtime',
            'Mark onClose with the \'worklet\' directive so it can execute on the UI thread',
            'Move the call into a useEffect that watches the shared value instead',
            'Use withTiming rather than withSpring, since it supports JS callbacks',
          ], 0, 'The callback executes inside the UI runtime, which has no access to React or navigation, so any function that touches them has to be scheduled back onto the JS thread with runOnJS.'),
        ]
      ),
      lesson('Gestures That Can Be Interrupted', 13, `
Drag a card halfway across the screen, let go, and grab it again before it settles. In a cheap app your thumb does nothing until the spring finishes. In a native one the card sticks to your finger the moment you touch it. That is not polish, it is the reason one app feels alive and the other feels like a website in a frame.

### The state machine you have to respect

A gesture in \`react-native-gesture-handler\` is a recogniser with states: \`BEGAN\`, then either \`ACTIVE\` and \`END\`, or \`FAILED\` and \`CANCELLED\`. The callbacks map straight onto it.

| Callback | Fires when |
|---|---|
| \`onBegin\` | a finger lands and the recogniser starts considering it |
| \`onStart\` | the recogniser activates |
| \`onUpdate\` | every frame while it is active |
| \`onEnd\` | the gesture finishes normally |
| \`onFinalize\` | always, including failure and cancellation |

Here is the bug that ships:

\`\`\`jsx
// Broken: resets only on a clean end
.onUpdate(e => { x.value = e.translationX; })
.onEnd(() => { x.value = withSpring(0); })
\`\`\`

Start swiping a row sideways, and the parent list decides the movement was really a scroll. Your gesture is cancelled, \`onEnd\` never runs, and the row stays parked at \`translationX: -80\` with its delete button showing. Nobody asked for that and nobody can get rid of it.

### Swipe to delete, done properly

\`\`\`jsx
const x = useSharedValue(0);
const startX = useSharedValue(0);
const dismissing = useSharedValue(false);

const pan = Gesture.Pan()
  .activeOffsetX([-15, 15])   // ignore movement until it is clearly horizontal
  .failOffsetY([-10, 10])     // give up entirely once it looks like a scroll
  .onBegin(() => { startX.value = x.value; })
  .onUpdate(e => { x.value = startX.value + e.translationX; })
  .onEnd(e => {
    const projected = x.value + e.velocityX * 0.15;
    if (projected < -120) {
      dismissing.value = true;
      x.value = withTiming(-SCREEN_WIDTH, { duration: 180 }, done => {
        if (done) runOnJS(onDelete)(course.id);
      });
    }
  })
  .onFinalize(() => {
    if (!dismissing.value) x.value = withSpring(0, { damping: 20, stiffness: 240 });
  });
\`\`\`

Three details carry the feel. \`activeOffsetX\` stops the row stealing vertical scrolls. \`onBegin\` copying the live \`x\` into \`startX\` is what makes the gesture interruptible: a second touch during the spring continues from wherever the card currently is instead of snapping back to zero. And the reset lives in \`onFinalize\`, guarded by a flag so it cannot fight the dismissal.

### Velocity beats distance

Compare two gestures on the same row: a 40px flick released at 1800px per second, and a 100px drag released at rest. Judged on distance alone you would have to drop the threshold to 40px to catch the flick, and then every accidental nudge deletes a course.

Project the release point forward instead, by roughly 150ms of the current velocity:

\`\`\`js
projected = -40 + (-1800 * 0.15) = -310   // flick, dismisses
projected = -100 + (0 * 0.15)   = -100   // slow drag, springs back
\`\`\`

One threshold, and both users got what they meant.

### Combining recognisers

| Combinator | Behaviour | Reach for it when |
|---|---|---|
| \`Gesture.Race\` | first to activate wins | pan versus long press on one card |
| \`Gesture.Simultaneous\` | both stay active | pinch and rotate on a photo |
| \`Gesture.Exclusive\` | strict priority order | a double tap must beat a single tap |

And the failure that costs an afternoon: gestures that do nothing at all on Android, silently, with no warning and no red screen. The app root is not wrapped in \`GestureHandlerRootView\`. Expo Router inserts it for you, a hand written \`App.js\` does not, and iOS is forgiving enough to hide the omission until you open the Android build.
      `,
        [
          q('A swipe to delete row resets its offset in onEnd. Users report rows that stay half open after they scroll the list. What went wrong?', [
            'activeOffsetX is too small, so the row activates during every scroll',
            'onEnd fires before the spring completes, so the reset gets overwritten',
            'The FlatList recycles the row and loses its shared value',
            'The scroll cancelled the gesture, and a cancelled gesture fires onFinalize but never onEnd',
          ], 3, 'Cancellation and failure skip onEnd entirely, so cleanup that only lives there never runs and the view is left stranded at its last dragged position.'),
          q('A fast 40px flick springs back while a slow 100px drag almost deletes, and both feel wrong to users. Which change fixes the judgement?', [
            'Decide on translation plus velocity times a time constant, not translation alone',
            'Lower the dismiss threshold from 120px to 40px for every swipe',
            'Swap withSpring for withTiming so the release speed stays constant',
            'Read velocityX in onUpdate and dismiss the moment it passes a limit',
          ], 0, 'Projecting the release point forward by roughly 150ms of velocity captures where the finger was heading, so a quick flick and a deliberate drag can share one sensible threshold.'),
          q('Why can a Reanimated pan gesture be grabbed again mid spring, while a version driven by useState cannot?', [
            'Springs cannot be interrupted once started, but timing animations can be',
            'onUpdate writes the shared value directly, so a new touch overwrites the running animation',
            'Gesture Handler suspends all animations while a finger is on the screen',
            'React batches state updates, so the second touch is discarded entirely',
          ], 1, 'Because the finger writes to the same shared value the animation is writing to, taking over is just the next assignment winning, with no render cycle to wait for.'),
        ]
      ),
      lesson('Layout and Screen Transitions', 12, `
Delete one course from a list of thirty and every row below it jumps up in a single frame. Nothing crashed and nothing is slow, but the user was just told that content teleports. The fix is three props, as long as you know which properties are free to animate and which quietly are not.

### Entering, exiting, and layout

\`\`\`jsx
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

{courses.map(course => (
  <Animated.View
    key={course.id}
    entering={FadeInDown.duration(180)}
    exiting={FadeOut.duration(140)}
    layout={LinearTransition.springify().damping(20)}
  >
    <CourseRow course={course} />
  </Animated.View>
))}
\`\`\`

\`layout\` is doing the real work. When a sibling disappears, every remaining view animates from its old frame to its new one instead of snapping. The key has to be tied to identity rather than the array index, or React reuses the wrong view and the animation plays on the wrong row.

### The FlatList surprise

Put \`entering\` on a virtualised row and it replays every time you scroll back to it. That is not a bug. Virtualisation genuinely unmounts offscreen rows, so scrolling up is a real mount and the animation is doing precisely what you asked. On a long list, drop \`entering\` and use \`itemLayoutAnimation\` on \`Animated.FlatList\`, which animates reordering without claiming every row is new.

### What a frame costs

| Animated property | Work per frame | Safe on a long list |
|---|---|---|
| \`opacity\` | composite only | yes |
| \`transform: translate / scale\` | composite only | yes |
| \`height\`, \`width\`, \`padding\` | layout pass over the subtree | no |
| \`backgroundColor\` | repaint of one view | usually |

An accordion animating \`height\` from 0 to 320 inside a forty row list falls into the mid twenties in frames per second on a Pixel 6a, because each frame re-lays out everything underneath it. And \`height: 'auto'\` cannot be animated at all: there is no number to interpolate towards.

Measure once, animate to a pixel value, and keep the animated subtree small:

\`\`\`jsx
const contentHeight = useSharedValue(0);
const open = useSharedValue(0);

const body = useAnimatedStyle(() => ({
  height: open.value * contentHeight.value,
  opacity: open.value,
}));

<View onLayout={e => { contentHeight.value = e.nativeEvent.layout.height; }}>
\`\`\`

### Screen transitions belong to native

With the native stack from chapter 3, the push animation is run by \`UINavigationController\` on iOS and a fragment transaction on Android, entirely outside your JavaScript. It holds 60fps even while the incoming screen mounts something expensive:

\`\`\`jsx
<Stack.Screen
  name="CourseDetail"
  component={CourseDetailScreen}
  options={{ animation: 'slide_from_right', presentation: 'card' }}
/>
<Stack.Screen
  name="Filters"
  component={FiltersScreen}
  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
/>
\`\`\`

Swap that stack for a JavaScript driven one and the same push interpolates styles on the JS thread, competing with the mount it is supposed to cover.

Shared element transitions are the one area to check before designing a screen around them: the API has shifted between Reanimated major versions, so confirm what your installed version supports rather than trusting a two year old blog post.

Finally, honour the system setting. \`AccessibilityInfo.isReduceMotionEnabled()\` reports when a user has asked for less movement, usually because motion makes them ill. The correct response is a cross fade instead of a slide, not the slide played anyway at the same speed.
      `,
        [
          q('Rows in a FlatList replay their entering animation every time the user scrolls back up to them. What explains it?', [
            'LinearTransition conflicts with entering and keeps restarting it',
            'keyExtractor returns the index, so the keys change while scrolling',
            'Virtualisation unmounts offscreen rows, so scrolling back is a genuine mount',
            'removeClippedSubviews hides the rows without ever unmounting them',
          ], 2, 'The entering animation is behaving correctly, because a virtualised list really does destroy and recreate rows as they leave and re-enter the window.'),
          q('An accordion animating height from 0 to 320 inside a forty row list drops to 24fps, while a scale and opacity version stays smooth. Why?', [
            'Scale runs on the UI thread while height is always computed in JavaScript',
            'Height changes force a layout pass over the subtree each frame, transforms only composite',
            'Reanimated cannot animate height, so it falls back to a JS driven loop',
            'The list re-runs keyExtractor for every row on each height change',
          ], 1, 'Layout properties resize the view and therefore reposition everything after it in the tree on every single frame, whereas transform and opacity only change how an already measured view is drawn.'),
          q('Why does a native stack push stay smooth while the incoming screen mounts a heavy chart, when a JavaScript driven stack animation stutters in the same place?', [
            'Native stack defers the screen\'s first render until the animation has ended',
            'react-native-screens renders the incoming screen on a background thread',
            'The JS stack recomputes shadow styles for both screens on every frame',
            'The push is driven by the platform navigator in native code, independent of the JS thread',
          ], 3, 'Native stack hands the transition to UINavigationController or a fragment transaction, so the frames keep coming from native code no matter how busy JavaScript is.'),
        ]
      ),
      lesson('Building a Bottom Sheet That Feels Native', 14, `
The filter sheet is the control people touch most in a catalogue app, and it is where a React Native build most often gives itself away. It lags a frame behind the thumb. It closes in a flat 300ms however hard you flung it. Scroll the list inside it and the whole sheet comes down with you.

Everything from the previous three topics lands here at once.

### Snap points are just numbers

\`\`\`jsx
const { height } = useWindowDimensions();
const SNAP = { full: height * 0.12, half: height * 0.55, closed: height };

const y = useSharedValue(SNAP.closed);   // translateY of the sheet
const startY = useSharedValue(0);
const scrollY = useSharedValue(0);
\`\`\`

The sheet is a single \`Animated.View\` pushed down the screen. Open means \`y\` is small, closed means \`y\` equals the screen height. Every visible property follows from that one number, the backdrop included:

\`\`\`jsx
const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

const backdropStyle = useAnimatedStyle(() => ({
  opacity: interpolate(y.value, [SNAP.half, SNAP.closed], [0.5, 0], Extrapolation.CLAMP),
  display: y.value >= SNAP.closed - 1 ? 'none' : 'flex',
}));
\`\`\`

Drop the clamp and dragging above the half snap keeps pushing opacity past 0.5 until the backdrop is solid black. Drop the \`display\` line and a fully transparent backdrop keeps eating taps on the screen behind it, which arrives as a bug report saying the app froze.

### Release with intent

\`\`\`jsx
const pan = Gesture.Pan()
  .onBegin(() => { startY.value = y.value; })
  .onUpdate(e => {
    if (scrollY.value > 0 && e.translationY > 0) return;   // the list is scrolled, let it scroll
    y.value = Math.max(SNAP.full, startY.value + e.translationY);
  })
  .onEnd(e => {
    const projected = y.value + e.velocityY * 0.2;
    const target = [SNAP.full, SNAP.half, SNAP.closed].reduce(
      (best, s) => (Math.abs(s - projected) < Math.abs(best - projected) ? s : best)
    );
    y.value = withSpring(target, { damping: 50, stiffness: 400 }, finished => {
      if (finished && target === SNAP.closed) runOnJS(onClose)();
    });
  });
\`\`\`

\`Math.max\` clamps the top edge so a hard fling cannot throw the sheet above the status bar and bounce back. The 0.2 second projection is what lets a short fast flick close the sheet while a long slow drag settles at the nearest snap.

### The part that is actually hard

A sheet containing a list has two recognisers competing for the same finger. The rule a native sheet follows: drag the sheet only when the list is already at the top and the finger is moving down.

\`\`\`jsx
const scrollHandler = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });
const nativeScroll = Gesture.Native();

<GestureDetector gesture={Gesture.Simultaneous(pan, nativeScroll)}>
  <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} bounces={false}>
\`\`\`

\`Gesture.Simultaneous\` keeps both recognisers alive, and the \`scrollY.value > 0\` guard decides which one wins per frame. Set \`bounces={false}\`, or the iOS rubber band drives \`contentOffset.y\` negative at the top and the guard flickers on every pull.

### Feel is two numbers

| damping | stiffness | how it reads |
|---|---|---|
| 50 | 400 | crisp, settles in about 250ms, no overshoot |
| 15 | 150 | bouncy and toy like, wrong for a modal |
| 120 | 400 | over damped, heavy, feels slow to arrive |

### Four ways it goes wrong

- Unmounting on \`visible === false\`. The view is gone before the spring starts, so the sheet vanishes rather than sliding out. Keep it mounted and unmount inside the spring callback.
- Calling \`onClose\` from that callback without \`runOnJS\`.
- No \`BackHandler\` on Android, so the hardware back button leaves the screen instead of closing the sheet.
- No bottom safe area inset, so the last row hides under the gesture bar on a modern phone.

\`@gorhom/bottom-sheet\` handles all of this and more, and reaching for it is usually the right call. Build one yourself once anyway. When its scroll coordination misbehaves on some specific Android build, you will know exactly which numbers to go and look at.
      `,
        [
          q('The sheet contains a scrollable list. Dragging up inside that list moves the whole sheet instead of scrolling the content. What is missing?', [
            'The list needs scrollEnabled bound to the sheet\'s current snap point',
            'The pan gesture should use Gesture.Race against the scroll view',
            'The pan must read the list\'s scroll offset and yield while it sits above zero',
            'The ScrollView has to be wrapped in its own GestureHandlerRootView',
          ], 2, 'Both recognisers stay active together, so the per frame decision has to come from the tracked scroll offset: the sheet may only move once the list is already at the top.'),
          q('Closing the sheet flips a visible flag to false, and instead of sliding out it disappears instantly. What causes that?', [
            'Unmounting removes the view before the spring runs, so nothing is left to animate',
            'withSpring cannot animate towards a value outside the screen bounds',
            'The exiting animation needs a layout prop as well as a transform',
            'The shared value resets to its initial value on every re-render',
          ], 0, 'React tears the view out of the tree in the same commit, so the closing animation has no view to move and should instead run first, unmounting from its completion callback.'),
          q('A modal sheet snaps closed with withSpring using damping 15 and stiffness 150, and testers say it feels cheap. Which change matches native modal behaviour?', [
            'Raise damping to 120 so the sheet takes noticeably longer to arrive',
            'Raise damping and stiffness so it settles quickly with no overshoot',
            'Switch to withTiming with a 600ms ease in curve',
            'Keep the spring and clamp translateY to the nearest snap point',
          ], 1, 'Low damping with low stiffness produces a slow bouncing overshoot that reads as a toy, while a stiff well damped spring arrives in about 250ms and stops dead, which is what the platform sheets do.'),
        ]
      ),
      ],
      [
      q('Which of these still animates at 60fps while the JS thread is blocked parsing a 2MB response?', [
        'Animated.timing on opacity with useNativeDriver left at false',
        'A setInterval that steps a state value roughly every 16ms',
        'requestAnimationFrame writing into a component\'s state',
        'A useAnimatedStyle transform driven by a Reanimated shared value',
      ], 3, 'Only the Reanimated path computes its frame values in the UI thread runtime, so the other three all wait behind the parse on the JavaScript thread.'),
      q('A gesture driven row is cancelled by the parent list mid drag. Which callback do you rely on to put the row back?', [
        'onFinalize, which runs on end, failure and cancellation alike',
        'onEnd, which fires whenever the finger leaves the glass',
        'onStart, checking the leftover translation on the next drag',
        'onUpdate, comparing the gesture state on every frame',
      ], 0, 'onFinalize is the only callback guaranteed to run for every terminal state, which makes it the correct home for cleanup that must not be skipped.'),
      q('A value computed on the UI thread has to appear inside a Text label. Which route is correct?', [
        'Read the shared value during render and let React pick the change up',
        'Store it in component state and assign to that state from onUpdate',
        'Wrap the Text in Animated.View so it inherits the shared value',
        'useAnimatedReaction plus runOnJS, throttled to changes worth rendering',
      ], 3, 'Crossing back into the React runtime has to be explicit and scheduled, and throttling it keeps a per frame animation from queueing a render sixty times a second.'),
      q('Which pair of properties is safe to animate on every frame on a mid range Android phone?', [
        'height and marginTop, because both are cheap integer writes',
        'width and padding, since layout results are cached between frames',
        'transform and opacity, because neither triggers a layout pass',
        'backgroundColor and height, which are both composited natively',
      ], 2, 'Transform and opacity only affect how an already measured view is composited, so they cost nothing in the layout stage no matter how deep the subtree is.'),
      ]
    ),
    chapter(
      'Local Databases, Sync, and Conflict',
      'An app that keeps accepting writes through a week without signal, then reconciles what changed on both sides without losing an edit.',
      [
      lesson('Choosing a Local Store: MMKV, SQLite, and Beyond', 13, `
A field survey app stored its whole catalogue under one AsyncStorage key: 12MB of JSON. Every cold start parsed it before the first screen could render. On a Galaxy A14 that parse cost 940ms of blocked JavaScript, and the splash screen sat there while the phone did nothing visible.

The fix was not a faster parser. It was the wrong store.

### Ask what the access pattern is, not how big the data is

Size is the obvious question and the least useful one. What decides the store is how you read: the whole value every time, or a slice you filter and sort.

| Store | Read style | Reach for it when |
|---|---|---|
| MMKV | whole key, synchronous | settings, flags, session, tiny caches |
| SQLite | queried, indexed, paged | anything you filter, sort or paginate |
| WatermelonDB | lazy and observable | large reactive lists on top of SQLite |
| Realm | live object graph | rich relations, built in device sync |

### MMKV is synchronous, and that changes the code

MMKV is a memory mapped key value store bound through JSI, so there is no bridge hop and no promise. A read is a function call that returns a value.

\`\`\`js
import { MMKV } from 'react-native-mmkv';

export const prefs = new MMKV({ id: 'prefs', encryptionKey: deviceKey });

prefs.set('unitSystem', 'metric');
const units = prefs.getString('unitSystem') ?? 'metric';   // no await
\`\`\`

That is why MMKV can be called during render, which removes the flash of default values on every settings screen. AsyncStorage forces a first paint with defaults, then a second paint once the promise resolves.

The cost shows up at scale. MMKV maps its file into memory, so a 40MB store is 40MB of resident memory on a device already close to the budget the OS will kill it at. Keep it to a few megabytes and put the rest in SQLite.

### SQLite once you filter

\`\`\`sql
CREATE TABLE readings (
  id       TEXT PRIMARY KEY,
  site_id  TEXT NOT NULL,
  taken_at INTEGER NOT NULL,
  value    REAL NOT NULL
);
CREATE INDEX readings_site_time ON readings(site_id, taken_at DESC);
\`\`\`

\`\`\`js
const rows = await db.getAllAsync(
  \`SELECT id, value, taken_at FROM readings
   WHERE site_id = ? ORDER BY taken_at DESC LIMIT 50\`,
  [siteId]
);
\`\`\`

Fifty rows come back in single digit milliseconds against 60,000 stored, because the index does the work and the other 59,950 rows are never touched. The same result from a JSON blob means parsing all 60,000 first, on the JavaScript thread, while the user waits.

Turn on write ahead logging once, at open:

\`\`\`js
await db.execAsync('PRAGMA journal_mode = WAL;');
\`\`\`

WAL lets a read run while a write is in flight, which is exactly what a background sync does to a list screen.

### What AsyncStorage actually is

On Android it is a single SQLite table holding your keys as rows and JSON strings as values, sent across the bridge and parsed in JavaScript. It is fine for a handful of small values. It is a poor database, and it never claimed to be one.

### Beyond raw storage

WatermelonDB sits on SQLite and adds observable queries plus a pull and push sync protocol. Realm gives you a live object graph with optional hosted sync. PowerSync and ElectricSQL keep a local SQLite replica of Postgres tables and own the wire format for you.

Adopting one of these is a bet on their sync and conflict model, not just their storage engine. Pick one when its rules match your domain, and write the layer yourself when they do not, because fighting someone else's merge semantics costs far more than the storage code you saved.
      `,
        [
          q('Your settings screen shows default values for one frame before the saved ones appear. Why does moving those values to MMKV remove the flash?', [
            'It caches the previous render output and replays it on mount',
            'It writes the values into the app bundle at build time instead',
            'Its reads are synchronous, so the first render already has them',
            'It preloads every key on a background thread before app start',
          ], 2, 'MMKV reads through JSI and returns the value from the call itself, so render has it immediately, while AsyncStorage resolves a promise and forces a second paint once it settles.'),
          q('You hold 60,000 readings and need the newest 50 for one site. Why is a JSON blob under an AsyncStorage key the wrong home for that?', [
            'Every query parses all 60,000 records before you can filter any',
            'AsyncStorage refuses to store a single value larger than 2MB',
            'Its reads run on the UI thread, so the list drops frames while scrolling',
            'Stored values expire after a period, so older readings quietly vanish',
          ], 0, 'A key value store has no index and no query layer, so narrowing to one site means loading and parsing the entire blob into memory, while an indexed SQLite query touches only the rows it returns.'),
          q('A team moves a 40MB offline catalogue out of SQLite and into MMKV to make reads faster. What goes wrong?', [
            'MMKV silently truncates any store larger than 16MB on Android',
            'Writes become asynchronous again once the store outgrows a page',
            'Encryption stops applying to values written after the file grows',
            'The file is memory mapped, so it costs 40MB of resident memory',
          ], 3, 'MMKV maps its whole file into memory, so a large store inflates the app\'s resident footprint on a device that may already be near the limit at which the OS starts killing processes.'),
        ]
      ),
      lesson('Optimistic Writes and a Durable Outbox', 13, `
iOS kills a backgrounded app when memory gets tight, and it does not ask first. A logistics app kept pending writes in a React state array and flushed them to AsyncStorage every thirty seconds. A driver scanned 14 parcels in a basement, backgrounded the app to take a call, and the process was reaped. All 14 scans were gone. Nobody was told, because the screen had already been updated optimistically and still showed them as delivered.

Optimistic UI without durable storage is a lie with a nice animation.

### One transaction, or none

The local row and the outbox entry describing it have to land together. Write them separately and a crash in the gap leaves one of two broken states: a parcel marked delivered that will never reach the server, or an outbox entry for a row your own database has no record of.

\`\`\`js
await db.withTransactionAsync(async () => {
  await db.runAsync(
    'UPDATE parcels SET status = ?, updated_at = ? WHERE id = ?',
    ['delivered', Date.now(), parcelId]
  );
  await db.runAsync(
    \`INSERT INTO outbox (id, entity_id, op, payload, idem_key, attempts, next_at)
     VALUES (?, ?, 'update', ?, ?, 0, 0)\`,
    [randomUUID(), parcelId, JSON.stringify({ status: 'delivered' }), randomUUID()]
  );
});
\`\`\`

Either both rows survive the kill or neither does.

### Mint the idempotency key at enqueue, not at flush

Here is the bug that ships. The key is created inside the send function:

\`\`\`js
async function send(entry) {
  const key = randomUUID();          // wrong: a new key on every attempt
  return api.post('/parcels', entry.payload, { 'Idempotency-Key': key });
}
\`\`\`

A request that succeeded but timed out on the way back gets a fresh key on retry, so the server sees a brand new action and the parcel is delivered twice. The key belongs in the outbox row, written once when the user acted, reused for the rest of that row's life across process restarts and app updates.

### Let the client mint ids too

If the server assigns the primary key, an offline create has nothing to return, and every later edit to that record has nothing to point at. You end up maintaining a temporary id to real id map and rewriting queued payloads as responses arrive.

Skip all of it. Generate a UUID on device and send it as the primary key. Use a v7 UUID if you want ids that sort by creation time, which keeps index inserts at the end of the B tree rather than scattered through it.

### The flush loop

\`\`\`js
const now = Date.now();
const batch = await db.getAllAsync(
  'SELECT * FROM outbox WHERE dead = 0 AND next_at <= ? ORDER BY rowid LIMIT 20',
  [now]
);

for (const entry of batch) {
  try {
    await send(entry);
    await db.runAsync('DELETE FROM outbox WHERE id = ?', [entry.id]);
  } catch (err) {
    if (err.status >= 400 && err.status < 500 && err.status !== 429) {
      await db.runAsync('UPDATE outbox SET dead = 1, error = ? WHERE id = ?',
        [err.message, entry.id]);
      continue;
    }
    const wait = Math.min(2 ** entry.attempts * 1000, 300000) * (0.5 + Math.random());
    await db.runAsync('UPDATE outbox SET attempts = attempts + 1, next_at = ? WHERE id = ?',
      [now + wait, entry.id]);
    break;
  }
}
\`\`\`

\`ORDER BY rowid\` preserves the order the driver acted in, so a status change cannot land before the scan that caused it. The jitter matters more than it looks: without that random factor, every device that lost signal in the same tunnel retries in the same second, and your API takes a synchronised spike the moment the train pulls in.

Dead rows are not deleted, they are surfaced. A driver with 3 scans stuck in a dead state needs a screen that says so and a button to retry or discard. A silent drop is the same failure you set out to fix, just further down the road.
      `,
        [
          q('A retry sends the same write again but with a freshly generated idempotency key. What does the server do with it?', [
            'Rejects it, because the key matches no request it has stored',
            'Treats it as a new action and performs the write a second time',
            'Matches it by payload hash and replays the earlier result',
            'Queues it behind the first request until that one times out',
          ], 1, 'Deduplication works by looking the key up, so a new key describes a new action and the server has no way to recognise the repeat, which is why the key must be written into the outbox row when the user acts.'),
          q('Why write the local row and its outbox entry inside one SQLite transaction rather than one after the other?', [
            'It lets the flush loop read both rows in a single query',
            'Transactions are the only way to obtain an autoincrement rowid',
            'It moves the write off the JavaScript thread during the commit',
            'A crash between them leaves a change that never syncs, or the reverse',
          ], 3, 'Atomicity is the whole point: a process killed between the two statements leaves either a local change with no outbox entry or an outbox entry for a row that does not exist, and a transaction makes both land or neither.'),
          q('Every device that lost signal in the same tunnel reconnects at once. What does random jitter on the backoff prevent?', [
            'All of them retrying in the same second and spiking your API',
            'Outbox rows being flushed out of the order the user made them',
            'A dead row being retried forever at the head of the queue',
            'The same write being accepted twice by an idempotent endpoint',
          ], 0, 'Deterministic backoff makes every client that failed at the same moment retry at the same moment, so multiplying the wait by a random factor spreads the reconnect load instead of concentrating it.'),
        ]
      ),
      lesson('Delta Sync and Conflict Resolution', 13, `
A full sync of one technician's 60,000 job records is 22MB and takes about 40 seconds on a weak cellular link. The delta for a single day of work is 14KB and lands in under a second. Same data, two orders of magnitude apart, and the only difference is that the client tells the server what it already holds.

### The cursor is the whole design

The client stores a watermark and asks for everything after it.

\`\`\`http
GET /sync?since=48210392&limit=500
\`\`\`

\`\`\`json
{
  "changes": [{ "id": "9f2c4e", "op": "upsert", "row": { "status": "on_site" } }],
  "cursor": 48210904,
  "hasMore": true
}
\`\`\`

Two rules decide whether this holds up.

**The server owns the clock.** Device clocks are wrong, sometimes by hours, and a user who winds the phone forward to skip a game timer will break sync permanently. Never send a device timestamp as the cursor.

**A bare \`updated_at\` is not a safe cursor.** Two rows can share a millisecond. A page ends on one of them, the next page asks for everything strictly after that timestamp, and the sibling is skipped for good. Use a composite \`(updated_at, id)\` cursor, or better, a single monotonic sequence assigned on write.

### The gap that only appears under load

Even a sequence can lose rows. A transaction that takes its number at 48,210,500 and commits four seconds later becomes visible after rows numbered higher. A client that synced during those four seconds has already moved its cursor past it, and that row is never sent again.

Serious systems apply two fixes together: assign the sequence at commit time from one source, and overlap the window by re-requesting the last 30 seconds on every sync. The overlap costs a handful of duplicate upserts, and upserts are idempotent, so duplicates cost nothing.

### Deletes need a body left behind

A deleted row cannot appear in a feed of changed rows, because there is no row. Keep tombstones:

\`\`\`sql
CREATE TABLE job_tombstones (
  job_id      TEXT PRIMARY KEY,
  deleted_seq INTEGER NOT NULL
);
\`\`\`

Purge them after a retention window, say 30 days, and treat any client whose cursor is older than that window as too far behind: return a \`resetRequired\` flag and make it do a full sync. Skip that check and a technician back from two months of leave keeps rows everyone else deleted.

### Conflicts are per field, not per record

The broken version, and the default in most hand written sync code:

\`\`\`js
if (remote.updated_at > local.updated_at) row = remote;   // whole record wins
\`\`\`

Dispatch moves the scheduled time at 09:14. The technician, offline, sets the status to \`on_site\` at 09:12 and syncs at 09:20. Whole record last write wins means one of those edits overwrites the other's untouched columns. A real edit vanishes, no error is raised, and neither person finds out until someone drives to the wrong address.

Merge by field, and take the rule from what the field means:

| Field kind | Merge rule |
|---|---|
| status, title, notes | last write wins, per field timestamp |
| parts used, photos | union of both sets |
| minutes logged | sum the deltas, never the totals |
| price, invoice line | server authoritative, client value dropped |

That last row is the one to reach for whenever a merge would be a guess. Money and anything with legal weight should not be reconciled by a rule your client invented. Send the intent, let the server decide, then show the user what it decided.
      `,
        [
          q('Your cursor is a bare updated_at timestamp, and a page happens to end on one of two rows written in the same millisecond. What happens to the other one?', [
            'It is sent again on the next page, so the row is duplicated',
            'The server errors, because the cursor is genuinely ambiguous',
            'It is skipped and never appears in any later page of the feed',
            'The client drops back to a full sync to resolve the overlap',
          ], 2, 'Asking for everything strictly after that timestamp excludes the row sharing it, so it falls between pages permanently, which is why the cursor needs a tie breaker such as the row id or a monotonic sequence.'),
          q('Dispatch edits a job\'s scheduled time while an offline technician edits its status. Whole record last write wins is in play. What is the outcome?', [
            'Both edits survive, since they touched different columns',
            'One edit is silently overwritten along with the untouched columns',
            'The sync is rejected and the job is flagged for manual review',
            'The client keeps both versions and prompts someone to choose',
          ], 1, 'Comparing timestamps across the entire record replaces every column of the losing version, so the edit to the other field disappears with no error raised and nobody is told it happened.'),
          q('Why re-request the last 30 seconds of changes on every sync instead of starting exactly at the stored cursor?', [
            'It gives the client a way to detect a server clock adjustment',
            'It keeps page sizes even, which makes the feed easier to cache',
            'It lets the server purge tombstones before the retention window',
            'A row committed late can land behind a cursor you already passed',
          ], 3, 'A long transaction becomes visible after rows carrying higher sequence numbers, so a client that advanced its cursor mid transaction would never see that row, and overlapping the window costs only a few idempotent duplicate upserts.'),
        ]
      ),
      lesson('Schema Migrations on Devices You Cannot Reach', 13, `
Version 4.2 of a retail stocktake app added one column. The migration ran outside a transaction, hit a constraint on roughly 3 percent of devices, and left the database half changed. The app crashed on launch. Crashed apps send no telemetry, accept no config flag, and cannot be fixed faster than review takes. The team watched a week of one star reviews arrive while the fix sat in the queue.

You cannot reach those devices. Every migration you ship is permanent.

### Numbered, forward only, wrapped

SQLite keeps an integer in the file header for exactly this: \`PRAGMA user_version\`.

\`\`\`js
const MIGRATIONS = [
  { v: 1, sql: 'CREATE TABLE counts (id TEXT PRIMARY KEY, sku TEXT, qty INTEGER)' },
  { v: 2, sql: 'CREATE INDEX counts_sku ON counts(sku)' },
  { v: 3, sql: 'ALTER TABLE counts ADD COLUMN location TEXT' },
];

export async function migrate(db) {
  const row = await db.getFirstAsync('PRAGMA user_version');
  const from = row.user_version;

  for (const m of MIGRATIONS.filter(m => m.v > from)) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(m.sql);
      await db.execAsync('PRAGMA user_version = ' + m.v);
    });
  }
}
\`\`\`

SQLite runs schema changes inside transactions, unlike some servers, so a failed \`ALTER TABLE\` rolls back cleanly and \`user_version\` stays where it was. The next launch retries from the same point instead of from a half applied state.

Three rules follow from that array being a chain rather than a description of the finished schema.

- **Never edit a shipped migration.** Devices that already ran version 3 will not run it again, so your edit reaches new installs only and the two populations drift apart.
- **Never delete an old one.** Someone opens the app after eleven months on version 2, and migrations 3 through 9 all have to run, in order.
- **Never renumber.** That integer is the only thing the file knows about itself.

### The downgrade nobody plans for

Play Store rollbacks, TestFlight builds, and a user restoring an old device backup all put a newer database in front of older code. That code reads \`user_version = 9\`, has migrations up to 7, and either crashes or quietly writes rows the newer build cannot read.

Check for it before anything queries:

\`\`\`js
if (from > MIGRATIONS.at(-1).v) {
  await drainOutbox();        // get unsent work off the device first
  await recreateDatabase();   // then rebuild the cache from the server
  return;
}
\`\`\`

### Keep the outbox where you can burn the rest

Deleting the database file and doing a full sync is the escape hatch that saves a release. It is only acceptable if it does not destroy work the user has not sent yet. Give the outbox its own database file with its own \`user_version\` and keep its schema deliberately boring, so wiping cached data leaves the queue untouched.

### Test the chain, not the tip

Commit a fixture database for every version you have shipped and run the whole chain against each one in CI.

| Fixture | Migrations run | Assertion |
|---|---|---|
| v1_empty.db | 1 to 9 | schema matches head |
| v4_realistic.db | 5 to 9 | all 8,000 rows survive |
| v7_future.db | none | falls back to a resync |

The realistic fixture is the one that earns its keep. A migration that passes against an empty table can violate a constraint or take 20 seconds against 8,000 real rows, and without that fixture the only place you find out is a customer's phone.
      `,
        [
          q('A user opens the app after eleven months, still on schema version 2, while the current build is at version 9. What must be true of your migration list?', [
            'Migrations 3 through 9 are all still present and run in order',
            'Only migration 9 runs, since it describes the finished schema',
            'The database is wiped, because the version gap exceeds three',
            'The runner picks the closest migration and skips the earlier ones',
          ], 0, 'user_version records only where a given device got to, so every step from that point forward has to still exist in the shipped build, which is why old migrations are never deleted or renumbered.'),
          q('A Play Store rollback puts a build carrying migrations up to 7 in front of a database whose user_version reads 9. What is the right handling?', [
            'Run migrations 8 and 9 in reverse to bring the file back down',
            'Reset user_version to 7 and let the app carry on as normal',
            'Drain the outbox, then delete the database and sync it again',
            'Open the database read only until the newer build returns',
          ], 2, 'Older code cannot interpret a newer schema and down migrations are not shipped, so the only safe path is to preserve the unsent writes and rebuild the cached data from the server.'),
          q('Why give the outbox its own database file instead of putting it beside the cached data?', [
            'Two files let SQLite run both writes on parallel connections',
            'So wiping the cache to recover does not destroy unsent work',
            'The outbox needs WAL mode, which the cache cannot also use',
            'Foreign keys would otherwise block deleting a synced record',
          ], 1, 'Deleting the database file is the recovery path when a migration fails on a device you cannot reach, and that recovery is only acceptable if the user\'s queued writes live somewhere it does not touch.'),
        ]
      ),
      ],
      [
      q('You need storage for a job list filtered by site and paged by date, plus a handful of user preferences read on first paint. What fits best?', [
        'Both in MMKV, so every read stays synchronous and fast',
        'Both in AsyncStorage, bumping the key version when shapes change',
        'Jobs in MMKV for read speed, preferences in SQLite for durability',
        'Jobs in SQLite with an index, preferences in MMKV',
      ], 3, 'Filtering and paging need an index and a query planner, while a few small values rendered on the first frame benefit from a synchronous read, so each store gets the access pattern it was actually built for.'),
      q('Which single change removes the need to map temporary client ids onto server ids after an offline create?', [
        'Flushing the outbox strictly in the order its rows were inserted',
        'Generating the record\'s primary key on the device as a UUID',
        'Holding creates back until the device has a live connection again',
        'Sending an idempotency key with every attempt of the request',
      ], 1, 'If the client mints the id, the record carries its final identity from the moment it is created offline, so later edits and references point at it without any payload rewriting when it reaches the server.'),
      q('A row deleted on the server never reaches a client that spent a week offline. What is missing from the design?', [
        'Tombstone rows, so the deletion can appear in the change feed',
        'A larger page limit, so the change feed is not truncated early',
        'A device side timestamp to compare against the server\'s own',
        'Field level merge rules covering the columns that were removed',
      ], 0, 'A delta feed can only carry rows that still exist, so a deletion has to leave a record behind with its own sequence number for clients to pick up and apply locally.'),
      q('Which of these would break an app that has already shipped to real devices?', [
        'Adding migration 10 to the end of the existing chain',
        'Bumping user_version inside the same transaction as the DDL',
        'Editing migration 5 to add a column it should have added',
        'Keeping a fixture database for every version you have shipped',
      ], 2, 'Devices that already ran migration 5 recorded user_version 5 and will never run it again, so the edit reaches only fresh installs and the two populations end up with different schemas.'),
      ]
    ),
    chapter(
      'Native Modules and the New Architecture',
      'Dropping below JavaScript when no library exists, and what Fabric and TurboModules changed about how that code is written and shipped.',
      [
      lesson('Config Plugins and Owning the Native Projects', 13, `
A teammate adds a \`<queries>\` block to \`android/app/src/main/AndroidManifest.xml\` so the app can hand off to the vendor's companion app. It works on their laptop. The same feature is dead in the QA build, and nobody can reproduce it locally.

The edit was never in that build. EAS checks out git, runs \`npx expo prebuild\` on a clean tree, and regenerates \`android/\` and \`ios/\` from your config. Anything typed by hand into those folders is thrown away without a warning.

### The native folders are output, not source

Under continuous native generation the native projects are derived files, the way \`dist/\` is derived. Your app config plus your plugin list is the source.

| Path | What it is | Commit it? |
|---|---|---|
| \`app.config.js\` | The real source of native config | Yes |
| \`plugins/*.js\` | Your native edits, expressed as code | Yes |
| \`android/\`, \`ios/\` | Regenerated by prebuild | No, under CNG |
| \`ios/Podfile.lock\` | Only meaningful in a bare project | Bare only |

A managed project that clones with no \`ios/\` folder at all is in the healthy state, not a broken one.

### A plugin is a function that edits parsed config

A config plugin receives the parsed manifest or plist as a JavaScript object, mutates it, and returns it. No string surgery, no regex over XML.

\`\`\`js
// plugins/withPuckSupport.js
const { withInfoPlist, withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

module.exports = function withPuckSupport(config) {
  config = withInfoPlist(config, (cfg) => {
    cfg.modResults.NSBluetoothAlwaysUsageDescription =
      'Cortexis connects to your study timer puck.';
    return cfg;
  });

  return withAndroidManifest(config, (cfg) => {
    AndroidConfig.Permissions.addPermission(
      cfg.modResults,
      'android.permission.BLUETOOTH_SCAN',
    );
    return cfg;
  });
};
\`\`\`

Register it beside any published plugins you need:

\`\`\`json
{
  "expo": {
    "plugins": [
      "./plugins/withPuckSupport",
      ["expo-build-properties", { "android": { "minSdkVersion": 26 } }]
    ]
  }
}
\`\`\`

\`expo-build-properties\` covers most of what people used to open \`build.gradle\` for: SDK versions, Kotlin version, iOS deployment target, packaging flags.

### The escape hatch that bites

\`withDangerousMod\` hands you the file system during prebuild, which is how a line reaches a \`Podfile\` or an \`.xcconfig\`. It earns the name: it writes raw text and it is not idempotent.

Broken:

\`\`\`js
fs.appendFileSync(podfilePath, "\\npod 'PuckSDK', '~> 3.2'\\n");
\`\`\`

Run prebuild twice without \`--clean\` and the pod is declared twice, then CocoaPods fails with an error pointing at the Podfile rather than at your plugin. Fixed: read the file, return early if the line is already present, write only otherwise. Better still, anything a typed mod can express (\`withInfoPlist\`, \`withAndroidManifest\`, \`withGradleProperties\`, \`withEntitlementsPlist\`) should never go through a dangerous mod at all.

### Prove it before CI does

Two commands settle most arguments:

\`\`\`bash
npx expo config --type prebuild    # your config after every plugin has run
npx expo prebuild --clean          # regenerate, then read the git diff
\`\`\`

If the purpose string is missing from the first command's output, it will be missing from the build. Reading the diff after the second is the fastest way to see exactly which lines your plugin owns, and which ones a library's plugin added behind your back.

### When you do own the folders

Bare projects commit \`android/\` and \`ios/\`, and then every React Native upgrade becomes a merge across native files. That is a real trade, not a failure. What is not viable is the middle ground: committing generated folders while still running prebuild occasionally, so two sources of truth drift apart until a release picks the wrong one.
      `,
        [
          q('A hand edit to android/app/src/main/AndroidManifest.xml works locally, but the same feature is missing from the EAS build. Why?', [
            'The manifest merger strips unknown blocks in release builds',
            'EAS runs prebuild on a clean checkout, so the edit never existed',
            'Release builds read permissions from app.json only',
            'The Gradle cache served an older copy of the manifest',
          ], 1, 'Under continuous native generation the native folders are regenerated from your config on every build, so anything typed into them by hand is discarded before compilation.'),
          q('Why is a withDangerousMod that appends a pod line to the Podfile risky?', [
            'It runs after the native build, so it never affects that build',
            'It only executes on Android and quietly no-ops on iOS',
            'It writes raw text, so a second prebuild can append the line twice',
            'It needs a bare project, since managed projects have no Podfile',
          ], 2, 'Dangerous mods edit files as text with no awareness of what is already there, so repeated prebuilds without --clean duplicate the line and CocoaPods then fails on the Podfile.'),
          q('In a managed project using continuous native generation, what belongs in git?', [
            'app.config.js and the plugins folder, with android and ios ignored',
            'The android and ios folders, since prebuild output is the real source',
            'Only ios, because CocoaPods state cannot be regenerated reliably',
            'Everything, because prebuild cannot reproduce Gradle files exactly',
          ], 0, 'The config and plugins are the authored source and the native folders are derived output, so committing the output creates a second source of truth that drifts.'),
        ]
      ),
      lesson('Writing a Module in Swift and Kotlin', 14, `
Lesson downloads stop arriving for a slice of Android users and the logs show nothing at all. The devices are in battery saver, which suspends the background job you queued. You want to detect that and say so in the UI, but nothing in the SDK or on npm exposes the flag. The fix is about twenty lines of native code per platform.

### Scaffold a local module

\`\`\`bash
npx create-expo-module@latest --local modules/power-status
\`\`\`

\`--local\` keeps the module inside your repo instead of creating a publishable package. You get \`modules/power-status/ios\`, \`modules/power-status/android\`, and an \`index.ts\`, already wired into both builds.

### iOS, in Swift

\`\`\`swift
// modules/power-status/ios/PowerStatusModule.swift
import ExpoModulesCore

public class PowerStatusModule: Module {
  public func definition() -> ModuleDefinition {
    Name("PowerStatus")

    Function("isSaving") { () -> Bool in
      ProcessInfo.processInfo.isLowPowerModeEnabled
    }

    AsyncFunction("batteryLevel") { () -> Double in
      UIDevice.current.isBatteryMonitoringEnabled = true
      return Double(UIDevice.current.batteryLevel)
    }
  }
}
\`\`\`

### Android, in Kotlin

\`\`\`kotlin
// modules/power-status/android/src/main/java/expo/modules/powerstatus/PowerStatusModule.kt
package expo.modules.powerstatus

import android.os.PowerManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class PowerStatusModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PowerStatus")

    Function("isSaving") {
      val pm = appContext.reactContext
        ?.getSystemService(PowerManager::class.java)
      pm?.isPowerSaveMode ?: false
    }
  }
}
\`\`\`

Then the JavaScript is ordinary:

\`\`\`ts
import PowerStatus from '../modules/power-status';

if (PowerStatus.isSaving()) {
  setBanner('Battery saver is on, so downloads will wait for power.');
}
\`\`\`

The definition DSL is doing the boring half of the work: argument conversion, promise wiring for \`AsyncFunction\`, and the type mapping that used to be hand written marshalling in two languages.

### Name is the contract

\`Name("PowerStatus")\` is the module's identity. Type \`Name("PowerStatusModule")\` on one platform only and no compiler complains anywhere: iOS works, Android hands back \`undefined\`, and you spend an evening reading Kotlin that was correct all along. The same trap applies to every function name. Copy the strings between files, do not retype them.

### Sync, async, and which thread

\`Function\` runs synchronously on the caller's thread, which is the JavaScript thread. \`AsyncFunction\` returns a promise and runs on the module's own queue.

| Work | Use |
|---|---|
| Reading a flag already in memory | \`Function\` |
| Disk, network, Bluetooth, camera | \`AsyncFunction\` |
| Touching a \`UIView\` or an Android \`View\` | \`AsyncFunction\` with a main thread dispatch |

A \`Function\` that reads a 40 ms preferences file looks harmless on its own. Call it from a scroll handler and it costs roughly two and a half frames every time, while the profiler points at your list component instead.

### Native code needs a native build

The most expensive mistake here is procedural, not technical. You add the module, save, press \`r\` in Metro, and the import is \`undefined\`. Metro ships JavaScript only. New native code needs a fresh development build:

\`\`\`bash
npx expo run:android
eas build --profile development --platform ios
\`\`\`

Everyone else on the team who pulls that branch needs the new build too, which is a good reason to announce native changes loudly rather than sliding them into a mixed pull request.

### The older style you will read in libraries

Open almost any library published before 2023 and you find \`RCTBridgeModule\` with \`RCT_EXPORT_METHOD\` on iOS, or a \`ReactContextBaseJavaModule\` with \`@ReactMethod\` on Android, plus a package class registered in \`MainApplication\`. That style still runs through the interop layer, and you need to recognise it when a stack trace lands in it. For code you write yourself, the Expo Modules API costs a fraction of the ceremony.
      `,
        [
          q('A module declares Name("PowerStatus") on iOS and Name("PowerStatusModule") on Android. What do you observe?', [
            'Both platforms throw a clear error the moment the module is imported',
            'Metro fails to resolve the module import on either platform',
            'Gradle refuses to compile the Kotlin module until the names agree',
            'iOS works normally while the method is undefined on Android',
          ], 3, 'The name string is the module identity looked up at runtime, so a mismatch on one platform produces no compiler error and simply leaves that platform without the module.'),
          q('A Kotlin definition exposes a preferences read that takes 40 ms. What does declaring it as Function rather than AsyncFunction cost?', [
            'It blocks the JavaScript thread for 40 ms, so frames get dropped',
            'It returns a promise that never resolves on older Android builds',
            'It runs the read on both threads, roughly doubling the total cost',
            'Nothing changes, because Expo queues both kinds the same way',
          ], 0, 'Function runs synchronously on the caller\'s thread, which is the JavaScript thread, so a slow read stalls rendering while AsyncFunction would move it to the module queue.'),
          q('You add a local module, save, and reload Metro. The import is undefined. What went wrong?', [
            'The module folder has to live inside node_modules to be resolved',
            'Metro reloads JavaScript only, so the development build is stale',
            'Local modules must be published to npm before they can be imported',
            'The module registry rejects any package name containing a hyphen',
          ], 1, 'New native code is compiled into the app binary, so a JavaScript reload cannot pick it up and you need a fresh development build first.'),
        ]
      ),
      lesson('JSI, TurboModules, and Fabric', 14, `
Swap AsyncStorage for MMKV on a settings screen and a read goes from roughly 3 ms and a promise to under 0.1 ms and a plain return value. The storage engines are different, but that is not where most of the gap comes from. One of them crossed a bridge.

### What the bridge actually did

The original architecture joined JavaScript and native with an asynchronous message queue. Every call was serialised to JSON, batched, and delivered on a later tick.

| | Bridge | JSI |
|---|---|---|
| Call shape | Async message, always | Direct call, sync or async |
| Payload | JSON strings both ways | Values and references in memory |
| Module startup | Every module initialises at launch | Loaded on first use |
| Shared memory | Impossible, copies only | Yes, through a \`HostObject\` |

Batching is what made a gesture emitting 60 events per second feel like a decision taken a moment ago. Nothing was slow in isolation. The queue simply arrived late.

### JSI

JSI is a small C++ interface that the JavaScript engine implements. Native code can install objects straight into the JS global scope, and JavaScript can hold a reference to native memory. A call becomes a C++ function call rather than a serialised message, which is how a library hands you a 20 MB image buffer without copying it through a JSON string first.

### TurboModules

A TurboModule is a native module exposed over JSI, loaded lazily, with a generated type contract. You write the spec in TypeScript:

\`\`\`ts
// specs/NativePowerStatus.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isSaving(): boolean;
  batteryLevel(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PowerStatus');
\`\`\`

Codegen turns that into C++, Java and Objective-C interfaces at build time, and your native class must implement them or the build fails. A type mismatch that used to surface as a crash in a user's hands is now a compile error on your machine.

\`getEnforcing\` matters more than it looks. It throws the instant the module is missing, naming it. The old \`NativeModules.PowerStatus\` quietly returned \`undefined\`, and you found out three screens later as "undefined is not an object".

Laziness pays at launch. An app with 30 native modules used to initialise all 30 before the first frame, whether or not anyone ever opened the camera.

### Fabric

Fabric is the renderer half. The shadow tree lives in C++ and is shared by both platforms, so layout is computed once in shared code instead of twice in two languages. Two consequences you can feel:

- Layout can be read synchronously, so a measurement no longer needs a round trip that lands after the frame it was meant for.
- React concurrent features behave properly, because the renderer can hold a tree it has not committed yet.

### The counter intuitive part

Synchronous is not automatically better. A sync JSI call runs on the JS thread and nothing else runs until it returns. Reading a cached flag out of MMKV takes microseconds, so it is fine anywhere. Parsing a 4 MB JSON file synchronously inside a scroll handler blocks every frame that scroll produces, and now you have a stutter no amount of \`useMemo\` will fix. The bridge was slow, but its asynchrony also protected you from your own blocking calls.

### What stops working

Some old habits were tied to the bridge and do not survive:

\`\`\`js
UIManager.dispatchViewManagerCommand(findNodeHandle(ref), 'scrollToIndex', [4]);
ref.current.setNativeProps({ style: { opacity: 0.5 } });
\`\`\`

Both assume a mutable native view tree addressed by integer tag. Under Fabric, commands go through the \`Commands\` object Codegen generates for that component, and direct prop mutation gives way to state or to a Reanimated shared value. A library still calling the first line renders an empty box and logs nothing useful, which is the most common blank screen during a migration.
      `,
        [
          q('Why did a gesture emitting 60 events per second feel laggy over the old bridge?', [
            'Gesture callbacks ran on the main thread and blocked layout',
            'Each native event forced a re-render of the whole component tree',
            'Every message was serialised to JSON and delivered asynchronously in batches',
            'The JavaScript context was recreated for each batch of events',
          ], 2, 'The bridge was an asynchronous batched queue with JSON on both sides, so individual events were cheap but arrived a frame or more after the finger moved.'),
          q('What happens when TurboModuleRegistry.getEnforcing(\'PowerStatus\') runs and the native side is missing?', [
            'It returns null so the caller can feature detect at runtime',
            'It silently falls back to the legacy NativeModules object',
            'It logs a warning and hands back an empty object instead',
            'It throws immediately, naming the module that was not found',
          ], 3, 'getEnforcing fails loudly at import time rather than deferring the problem to an undefined property access somewhere deeper in the app.'),
          q('Which use of a synchronous JSI call is a bad idea?', [
            'Reading a small cached flag out of MMKV during render',
            'Parsing a 4 MB JSON file from disk inside a scroll handler',
            'Reading the device low power flag once when a screen mounts',
            'Fetching a stored value that layout needs before first paint',
          ], 1, 'A synchronous call occupies the JavaScript thread until it returns, so heavy work on a per frame path turns a bridge free API into a guaranteed stutter.'),
        ]
      ),
      lesson('Migrating a Real App to Bridgeless', 13, `
The upgrade to React Native 0.76 looks small on paper. You bump the version, the app builds, and the analytics screen comes up as a white rectangle. No red screen, no JavaScript error, nothing in the console. The chart library is three versions behind and still drives its view through the legacy UIManager, and the New Architecture is now on by default.

### Audit before you flip

The migration is mostly a dependency problem. Native code is where breakage lives, so start by listing every package that ships some.

\`\`\`bash
npx expo-doctor          # flags packages known to be incompatible
npx expo install --check # aligns versions with your SDK
\`\`\`

Cross check the rest against the New Architecture column on reactnative.directory. For each package with native code, decide now: update it, replace it, or lean on the interop layer.

### The interop layers exist, and they are not free

You do not need every dependency rewritten. Legacy native modules run through the TurboModule interop and legacy view managers through the Fabric interop, which carries most of them unchanged. On iOS a stubborn legacy view can still need its view manager name registered with the interop list before it draws anything.

What interop cannot do is rescue code that calls removed APIs directly. That is your white rectangle.

| Symptom | Cause | Fix |
|---|---|---|
| One screen blank, no error | Library calls \`dispatchViewManagerCommand\` | Update the library or drop it |
| \`setNativeProps\` silently ignored | Direct prop mutation is gone | Move to state or Reanimated |
| Build fails inside Codegen | Spec and native signature disagree | Make the types match the spec |
| List or modal measures wrong | Layout timing changed under Fabric | Read size in \`onLayout\`, not on mount |
| Fine in dev, blank in release | Interop registration sits in a dev only path | Move it to shared setup code |

### Flip it deliberately

In a managed project, set \`newArchEnabled\` to \`true\` in \`app.json\` and regenerate:

\`\`\`bash
npx expo prebuild --clean

# bare Android, in android/gradle.properties
newArchEnabled=true

# bare iOS
RCT_NEW_ARCH_ENABLED=1 bundle exec pod install
\`\`\`

Then run both platforms on real hardware and walk the five screens that matter most. Fabric regressions are visual: nothing but a human eye or a screenshot test is going to find a chart that renders at zero height.

### The rollback flag is a shim, not a decision

Setting \`newArchEnabled=false\` exists to get you unstuck for a sprint. The legacy architecture is deprecated and the opt out is on a timer, so every release spent on the old renderer is borrowed against a larger jump later. Teams that treated the flag as a permanent answer found the bill when a critical library dropped legacy support and no version of it worked any more.

### A migration that finished

A workable order, from an app carrying about 40 native dependencies:

1. Upgrade React Native in a branch with the flag still off, and get that green first.
2. Update the eight packages the doctor flagged, and delete two with no maintained replacement.
3. Flip the flag locally and fix what breaks, in that app four screens, mostly measurement plus the chart.
4. Ship to internal testers for a week and compare crash free sessions with the previous release.
5. Release to a fraction of users, watch the same number, then widen.

The trap is doing steps 1 and 3 in one commit. When something breaks you cannot tell whether the version bump or the renderer caused it, so you revert both and lose the day.

### What survives

Afterwards your components are unchanged, your navigation is unchanged, and most of the codebase has no idea anything happened. This is a plumbing change with a long tail of small compatibility bugs, not a rewrite. Budget a sprint for the tail rather than a quarter for a rebuild.
      `,
        [
          q('After the upgrade one screen renders blank with no JavaScript error, and the library it uses calls dispatchViewManagerCommand. What is happening?', [
            'The bundle was compiled for the wrong Android ABI',
            'Hermes was switched off during the version bump',
            'The library still drives its view through the legacy UIManager',
            'Metro is serving a cached bundle from before the upgrade',
          ], 2, 'Fabric replaces tag based view manager commands with generated Commands objects, so a library using the old call renders nothing and reports nothing useful.'),
          q('Why should newArchEnabled=false be treated as a shim rather than a decision?', [
            'The legacy architecture is deprecated and the opt out is time limited',
            'Both app stores now reject builds made on the legacy renderer',
            'The flag also disables Hermes, which makes startup noticeably slower',
            'Managed Expo builds ignore the flag on Android in any case',
          ], 0, 'Every release spent on the deprecated renderer is borrowed time, and libraries dropping legacy support eventually leave no working version to pin to.'),
          q('What is the right first move before flipping the New Architecture flag on a large app?', [
            'Rewrite every in house native module against a TurboModule spec',
            'Audit dependencies for New Architecture support and update them',
            'Delete the android and ios folders and generate them from scratch',
            'Move all animations back onto the JavaScript animation driver',
          ], 1, 'Breakage concentrates in packages that ship native code, so knowing which ones need updating or replacing turns the migration from guesswork into a list.'),
        ]
      ),
      ],
      [
      q('An app\'s cold start improves after moving to the New Architecture. Which change explains that best?', [
        'Fabric renders on the JavaScript thread, removing one hop',
        'JSON serialisation was replaced by a faster JSON encoder',
        'The JavaScript bundle is compiled to machine code at install time',
        'TurboModules load on first use, so unused modules skip startup init',
      ], 3, 'The old architecture initialised every registered native module before the first frame, while TurboModules are instantiated lazily when JavaScript actually asks for them.'),
      q('Your Expo app needs a vendor SDK with no existing wrapper. What is the shortest correct path?', [
        'Write a local Expo module and config plugin, then rebuild the dev client',
        'Run expo prebuild once and commit android and ios to the repository',
        'Move the project to bare React Native and maintain both native projects',
        'Load the SDK\'s web version inside a WebView screen instead of natively',
      ], 0, 'A local module supplies the native code and a config plugin supplies the native configuration, which keeps continuous native generation intact instead of forcing a move to bare.'),
      q('What does Codegen produce from a spec file such as specs/NativePowerStatus.ts?', [
        'A JavaScript polyfill used whenever the native module is absent',
        'A Metro transform that inlines each native call at the call site',
        'C++, Java and Objective-C interfaces the native module must implement',
        'A Gradle task that downloads the matching module from the npm registry',
      ], 2, 'The spec is compiled into typed native interfaces at build time, so a signature mismatch becomes a compile error rather than a runtime crash on a user\'s phone.'),
      q('A third party view manager written for the old architecture is kept during a bridgeless migration. What makes it render?', [
        'Fabric recompiles legacy view managers into C++ components automatically',
        'The bridge is restored for that one component, at a small startup cost',
        'It renders as an empty View until the library ships a Fabric version',
        'The Fabric interop layer, once that component is opted into it',
      ], 3, 'React Native ships an interop layer that hosts legacy view managers inside the Fabric tree, which is why most untouched libraries keep working after the flag is flipped.'),
      ]
    ),
    chapter(
      'Pipelines, Rollouts, and Versions in the Field',
      'Automating the road to both stores, releasing to a fraction of users at a time, and living with every build that is still installed.',
      [
      lesson('A Release Pipeline That Runs Without You', 13, `
Release 2.4.0 took one engineer six hours. Bump the version by hand, remember \`versionCode\` as well, wait for the Android build, watch iOS fail because a provisioning profile expired on Tuesday, regenerate it on the only laptop holding the certificate, rebuild, upload, write the notes, forget the source maps. Then that engineer took two weeks off and 2.4.1 could not ship at all, because the upload keystore lived in their Downloads folder.

A pipeline is not really about saving six hours. It is about whether a release can happen while the person who knows the most about it is unreachable.

### What the pipeline has to own

| Step | The manual failure it removes |
|---|---|
| Version and build number | A duplicate build rejected after a 20 minute queue |
| Credentials | A certificate that exists on exactly one machine |
| Build both platforms | Android ships, iOS is forgotten for a week |
| Source map upload | Minified nonsense where a stack trace should be |
| Submit and tag | No way to answer which code is in 2.4.0 |

### Credentials belong to the org, not a laptop

Two facts worth internalising before automating anything.

On Android, Play App Signing means Google holds the app signing key and you hold an upload key. Lose the upload key and you can request a reset. Opt out, hold the signing key yourself, lose it, and nobody can ever update that listing again. Let Play and EAS hold the keys.

On iOS, never put an Apple ID in CI. A two factor prompt at 3am has nobody to answer it. Create an App Store Connect API key, download the \`.p8\` file (it is downloadable exactly once), and store it as a repository secret.

### A workflow that ships on a tag

\`\`\`yaml
name: release
on:
  push:
    tags: ['v*']
concurrency:
  group: release
  cancel-in-progress: false
jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test -- --ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --profile production --non-interactive --auto-submit
\`\`\`

Two lines carry more weight than they look. \`concurrency\` with \`cancel-in-progress: false\` stops two tags pushed ninety seconds apart from racing for the same auto incremented build number, which is exactly how you get an upload rejected as a duplicate. And \`--auto-submit\` hands the store upload to EAS the moment the binary is signed, so no human has to babysit a browser tab.

### The hotfix that reaches nobody

This one costs an afternoon the first time. An over the air update is delivered only to installed apps whose **runtime version** matches the update's runtime version. Under \`"runtimeVersion": { "policy": "appVersion" }\`, the runtime version is your app version string.

So you bump \`version\` from 2.4.0 to 2.5.0 in \`app.json\`, then publish a hotfix off \`main\`:

\`\`\`bash
eas update --branch production --message "Fix quiz scoring"
# Runtime version: 2.5.0    <- read this line, every time
\`\`\`

The command succeeds. The dashboard lists the update. Downloads sit at zero forever, because every phone in the field is running runtime 2.4.0 and your bundle is stamped 2.5.0. Publish hotfixes from the tag that produced the running binary, not from a branch that has already moved on.

### Make the artifact say what it is

\`\`\`bash
eas build --platform ios --profile production \\
  --message "$(git rev-parse --short HEAD)"
\`\`\`

Feed that same short SHA into your Sentry release name. A crash report then points at a commit instead of a version string shared by four different builds. A pipeline whose output cannot be traced back to source is only half automated, and the missing half is the one you need during an incident.
      `,
        [
          q('You push tags v2.4.0 and v2.4.1 ninety seconds apart, and the second build is rejected on upload as a duplicate. What was the workflow missing?', [
            'A separate eas.json profile for each of the two tags',
            'A lockfile cache keyed on the tag rather than on package.json',
            'A concurrency group, so the runs raced for one build number',
            'A test step, which would have delayed the second run enough',
          ], 2, 'Two jobs auto incrementing at the same time both read the same starting build number, so the second upload carries a number the store has already seen, and a concurrency group serialises them.'),
          q('You bump version from 2.4.0 to 2.5.0 in app.json, then publish a hotfix with eas update. It succeeds and no device downloads it. Why?', [
            'The update is stamped runtime 2.5.0 and installed apps are on 2.4.0',
            'The production branch must be republished after any version change',
            'Updates are refused while a store build of that version is processing',
            'The branch is mapped to a channel only the internal profile reads',
          ], 0, 'Under the appVersion runtime policy the update inherits the version from app.json, and an update is only delivered to binaries whose runtime version matches it exactly.'),
          q('Why does a CI pipeline authenticate to App Store Connect with a .p8 API key instead of an Apple ID and password?', [
            'Apple IDs cannot hold the App Manager role that uploading requires',
            'API keys skip the binary processing that an Apple ID upload triggers',
            'Apple ID passwords expire every 90 days on paid developer accounts',
            'Nobody is present in CI to answer the two factor prompt an Apple ID gets',
          ], 3, 'Interactive two factor authentication has no human at the keyboard during an automated run, whereas an API key authenticates non interactively and can be stored as a secret.'),
        ]
      ),
      lesson('Feature Flags, Kill Switches, and Staged Rollouts', 13, `
A 1% staged rollout on Play sounds harmless until you do the arithmetic on 900,000 installs. That is 9,000 people. Forty minutes in, crash free sessions drop to 96.2%, you halt the rollout, and here is the part that surprises everyone: those 9,000 phones keep the broken build. Halting stops further distribution. It does not reach back and take a version off a device.

Apple behaves the same way. A phased release steps through 1, 2, 5, 10, 20, 50 and 100 percent over seven days and can be paused, but anyone already updated stays updated, and anyone who taps Update on your product page gets the build regardless of which phase it is in.

### A rollout is not a rollback

The only store level fix is shipping a higher build number and waiting for it to propagate, which on iOS means a review queue. So every release needs a switch that lives outside the stores and answers in seconds.

### Four kinds of flag, four different defaults

| Kind | Lifetime | Default when config is missing |
|---|---|---|
| Release flag for a new feature | Days to weeks | Off |
| Kill switch for an existing path | Forever | On, the behaviour already shipped |
| Experiment variant | Weeks | Control |
| Entitlement or plan gate | Forever | Deny, then correct on fetch |

\`\`\`jsx
const DEFAULTS = { checkout_v2: false, uploads_enabled: true };

export async function loadFlags() {
  try {
    const res = await fetch('https://api.cortexis.app/v1/flags', {
      headers: { 'x-app-version': Application.nativeApplicationVersion },
    });
    const flags = await res.json();
    storage.set('flags', JSON.stringify(flags));
    return { ...DEFAULTS, ...flags };
  } catch {
    const cached = storage.getString('flags');
    return cached ? { ...DEFAULTS, ...JSON.parse(cached) } : DEFAULTS;
  }
}
\`\`\`

Read the ordering carefully. A cached value beats the compiled default, and the compiled default is whatever is safe to run. \`uploads_enabled: false\` as a default would mean one flaky airport wifi request disables uploads for every user on that network. The kill switch defaults to the feature being on.

### A switch that needs a relaunch is not a switch

Most people fetch flags once at cold start and stop there. Mobile sessions are short and cold starts are rare, so a kill switch flipped at 14:00 would reach a chunk of users the following morning. Refresh on foreground as well:

\`\`\`jsx
useEffect(() => {
  const sub = AppState.addEventListener('change', (s) => {
    if (s === 'active') loadFlags().then(setFlags);
  });
  return () => sub.remove();
}, []);
\`\`\`

That turns hours into minutes for anyone who backgrounds and returns, which is most of your active users.

### Bucket on something that does not move

The broken version calls \`Math.random()\` at launch and compares it to the rollout percentage. A user sees the new checkout on Monday, the old one on Tuesday, and files a bug nobody can reproduce. Hash a persistent install identifier instead:

\`\`\`jsx
const bucket = fnv1a(installId + ':checkout_v2') % 100;
const enabled = bucket < flags.checkout_v2_percent;
\`\`\`

Same phone, same bucket, forever, decided locally with no round trip. Salting with the flag name keeps a user who lost one coin flip from losing every one.

### The schedule

| Stage | Share | Hold | What halts it |
|---|---|---|---|
| 1 | 1% | 12 hours | Crash free sessions below the previous release |
| 2 | 10% | 24 hours | \`checkout_failed\` rate up more than 20% |
| 3 | 50% | 24 hours | Support tickets mentioning the new flow |
| 4 | 100% | | |

### Flags are debt with a due date

Twelve live flags means several thousand possible app states, and no test suite covers those. Reproducing a bug becomes an interrogation about which combination the reporter happened to be in. Give every flag an owner and an expiry date in its definition, then fail the build when one is sixty days past it. Deleting a flag is part of shipping the feature, not a chore for later.
      `,
        [
          q('A 10% Play staged rollout of 3.1.0 is halted forty minutes after a crash spike. What happens to the users who already installed 3.1.0?', [
            'Play reinstalls the previous version at their next update check',
            'They stay on 3.1.0 until you ship a higher build they can update to',
            'They are moved back to 3.0.4 once the halt propagates, within a day',
            'Their copy refuses to launch until a supported version is installed',
          ], 1, 'Halting a rollout only stops further distribution of that version, so the only route back for a device that already updated is a new build with a higher build number.'),
          q('The flag service is unreachable at cold start and the client falls back to its compiled defaults. Which default is the dangerous one?', [
            'A new checkout flow defaulting to off until the server enables it',
            'An experiment defaulting to the control variant everybody already had',
            'A cached value from the last good fetch beating the compiled default',
            'An uploads kill switch defaulting to off, so uploads stop for everyone',
          ], 3, 'A kill switch must default to the behaviour that is already shipped and working, otherwise a single failed network request turns a working feature off for every user on that connection.'),
          q('Why bucket a percentage rollout on a hashed install id rather than on Math.random() at launch?', [
            'A fresh random draw each launch reassigns the user, so the feature flickers',
            'Math.random is not uniform enough to split a population at ten percent',
            'Hashing is required before a flag value can be cached on the device',
            'A random draw cannot be seeded, so a test run is never reproducible',
          ], 0, 'A stable hash puts the same device in the same bucket on every launch, while a per launch random value flips users between variants and produces bug reports nobody can reproduce.'),
        ]
      ),
      lesson('Serving Clients You Cannot Recall', 13, `
Nine months after 3.0.0 shipped, 3.1% of daily active users are still on 1.4.0. On a base of 900,000 that is 27,000 phones. Some belong to a managed work device with updates disabled by policy. Some have 180MB free and cannot install anything at all. Some belong to people who have simply never opened the store. Your API is going to answer 1.4.0 for years, and no announcement will change that.

### Additive only, forever

The contract with an installed build is narrower than it looks. You may add a field. You may not remove one, rename one, or change its type. And the quiet one that catches people: you may not add a value to an enum without checking what old clients do when they meet it.

\`\`\`jsx
// Shipped in 1.4.0. Fine for eight months.
switch (order.status) {
  case 'pending':   return <Pending order={order} />;
  case 'shipped':   return <Shipped order={order} />;
  case 'delivered': return <Delivered order={order} />;
}
\`\`\`

The day the server starts returning \`partially_refunded\`, that switch falls through and the function returns \`undefined\`. React throws, the error boundary catches it, and 27,000 people see a blank order screen for a state that is perfectly normal. The fix is two lines in the client and one field on the server:

\`\`\`jsx
  default: return <Generic label={order.statusLabel ?? 'Processing'} />;
\`\`\`

Pair every machine readable value with a human readable one. \`status: 'partially_refunded'\` travels with \`statusLabel: 'Partially refunded'\`, so a build compiled before that state existed can still show the user something true.

### Know what is actually out there

| Version | Share of DAU | Decision |
|---|---|---|
| 3.2.1 | 71% | Current, receives updates |
| 3.1.0 | 18% | Supported |
| 2.9.4 | 7.8% | Supported, last build using \`/v1/upload\` |
| 1.4.0 | 3.1% | Force upgrade at the next release |

Take those numbers from the \`x-app-version\` header logged at your edge, or from the analytics you already send. Never from a guess. The cost of supporting an old build is real, but so is cutting off 3% of your customers on a Friday because a spreadsheet said 0.4%.

### A forced upgrade that does not brick the app

The server returns a minimum supported version, the client compares, and the client shows a wall. Here is the version that has genuinely shipped:

\`\`\`jsx
if (currentVersion < minimumVersion) showUpgradeWall();
// '1.10.0' < '1.9.0' evaluates to true
\`\`\`

String comparison is lexicographic, so \`1.10.0\` sorts before \`1.9.0\` and everyone on the newest build is locked out by the check meant to protect them. Compare the parts as numbers:

\`\`\`jsx
const parts = (v) => v.split('.').map(Number);

function isOlder(a, b) {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) {
    const [xi, yi] = [x[i] ?? 0, y[i] ?? 0];
    if (xi !== yi) return xi < yi;
  }
  return false;
}
\`\`\`

Two more rules. The minimum version must come from the server, because a bad constant baked into a binary can only be fixed by the very upgrade the wall is blocking. And put the wall behind a flag so you can retract it in seconds.

On Android, Play in app updates can run the whole download inside your app with the immediate flow, so the wall has a working button rather than a link. On iOS there is no equivalent, so send the user to the product page and accept that some will not come back.

### Deep links and push payloads are an API too

A notification payload carrying \`{ screen: 'CourseOutline', slug: 'react-native' }\` is parsed by every build ever installed. Rename that route in 3.2.0 and every tap from a 2.9.4 device opens nothing at all, silently, with no error anywhere. Treat route names and payload keys with the same additive discipline as your JSON: keep the old key working, accept both, and retire the old one only when the table above says you can.
      `,
        [
          q('The server begins returning a new order status value, and builds from nine months ago show a blank order screen. What in the old client caused that?', [
            'A response schema check rejected the unknown value and threw',
            'The status string failed a TypeScript narrowing check at runtime',
            'A switch on status had no default, so the render returned undefined',
            'The cached order object was merged with a mismatched newer shape',
          ], 2, 'A switch with no default branch falls through and the component returns undefined, which React treats as an error, so a state the old build never knew about blanks the screen.'),
          q('A forced upgrade check runs if (currentVersion < minimumVersion) on plain strings. Which pair locks out exactly the wrong people?', [
            'current 2.0.0 with minimum 1.9.0, which passes when it should not',
            'current 1.10.0 with minimum 1.9.0, which walls off the newest build',
            'current 1.9.0 with minimum 1.10.0, which lets an old build straight in',
            'current 1.9.1 with minimum 1.9.0, which fires on an equal version',
          ], 1, 'String comparison is lexicographic, so 1.10.0 sorts before 1.9.0 and the users on the most recent build are the ones shown the upgrade wall.'),
          q('Why should an API send a human readable label alongside every enum value it returns?', [
            'Labels save the client from translating the enum into the user locale',
            'It lets the server rename enum values without any client version bump',
            'Analytics tools group results on labels rather than on raw enum values',
            'An old build can then display a state it was never compiled to know',
          ], 3, 'A build that shipped before a state existed has no string for it, so a label travelling with the value lets that client show something accurate instead of falling through.'),
        ]
      ),
      lesson('Upgrading React Native Without Freezing the Roadmap', 13, `
The app runs on Expo SDK 49 and React Native 0.72. The last upgrade was fourteen months ago. Someone finally scopes the work honestly: three weeks, two engineers, no features shipped meanwhile. No product manager funds that, so it slips another quarter, and by then the estimate is five weeks. This is how a codebase quietly becomes unmaintainable while every individual decision looked reasonable.

The cost does not grow with the number of versions skipped. It grows faster, because every library in your graph also has to move, and their breaking changes stack on top of each other rather than sitting side by side.

| Lag | Typical cost | What dominates the time |
|---|---|---|
| 1 SDK behind | Half a day | Config diffs, a lint rule or two |
| 2 SDKs behind | Two days | One or two libraries needing replacement |
| 3 SDKs behind | A week | Native folder merges, Gradle and Xcode |
| 5 or more | Weeks | Abandoned dependencies with no successor |

### Upgrade on a cadence, not as a project

One SDK per release cycle, half a day budgeted, a named owner, done. The mechanics are short:

\`\`\`bash
npx expo install expo@^52.0.0
npx expo install --fix     # pin every dependency to the SDK's tested matrix
npx expo-doctor            # names packages known to be incompatible
\`\`\`

On a bare project, the React Native Upgrade Helper diff between your exact versions is the source of truth for the native files, and there is no substitute for reading it line by line.

### Committed native folders are the tax you pay

If \`ios/\` and \`android/\` are tracked in git, every upgrade becomes a three way merge over \`build.gradle\`, \`AppDelegate.mm\`, and an Xcode project file whose format is actively hostile to merging. Move to continuous native generation instead: gitignore both folders, express every native change as a config plugin, and regenerate.

\`\`\`bash
npx expo prebuild --clean
\`\`\`

The merge conflict stops existing. Of everything on this page, that single change cuts the most time off future upgrades.

### It is almost never React Native that breaks

It is the graph around it. Before starting, find out what you are carrying:

\`\`\`bash
npm ls react-native
npx npm-check-updates -t minor
\`\`\`

Any package whose last publish is more than eighteen months old is a decision waiting for you. Replace it now, on a quiet Tuesday, on your own schedule, or discover it during an upgrade you already promised would take a day. Keep that list somewhere visible.

### Metro is not the test

New Architecture is the default from 0.76, and the failures it produces are runtime failures. A library reaching for a native API that no longer exists builds cleanly, bundles cleanly, and crashes on a real phone. Chapter 11 covers what bridgeless actually changed about module code; the scheduling point here is simpler. Run a release build on a physical mid range Android and an older iPhone before any binary reaches a store, every time.

### Ship an upgrade like the risky release it is

An upgrade replaces native code for every user at once, which is a bigger blast radius than any feature you shipped this quarter. It earns the 1% first stage described earlier, not a straight push to 100%, and a full day of watching crash free sessions and ANR rate at each step.

Mind the runtime version too. A new SDK means a new binary and a new runtime, so users still on the previous build keep pulling over the air updates from their own runtime. Keep publishing hotfixes to both branches until the old build's share of daily actives is small enough to force.

### Keep the drift visible

\`\`\`yaml
on:
  schedule: [{ cron: '0 7 * * 1' }]
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx expo-doctor
\`\`\`

A red check on Monday morning is a fifteen minute conversation. Fourteen months of nobody looking is a three week project nobody will approve.
      `,
        [
          q('Why does upgrade cost grow faster than the number of SDK versions skipped?', [
            'Each skipped release stacks breaking changes across the dependency graph',
            'Expo removes the upgrade path for SDKs more than two releases old',
            'Metro cannot resolve a lockfile that spans more than two SDK versions',
            'Native folders are regenerated from scratch beyond a two version gap',
          ], 0, 'Every library in the graph has to move as well, and their breaking changes compound with each other rather than being handled one at a time.'),
          q('Keeping ios/ and android/ tracked in git makes every upgrade more expensive. What is the mechanism?', [
            'Prebuild refuses to run at all while those directories are tracked',
            'EAS regenerates them anyway, so the committed copies are always stale',
            'Upgrades turn into three way merges over Gradle and Xcode project files',
            'Config plugins cannot be applied once native code exists on disk',
          ], 2, 'Upgrading rewrites those generated files, so a tracked copy has to be merged by hand in formats that merge badly, which is work that disappears entirely under continuous native generation.'),
          q('An upgrade passes everything in Metro and then crashes on a tester Pixel 6a running a release build. What is the likeliest cause?', [
            'Source maps were missing, so the earlier failure went unreported',
            'A library called a native API the New Architecture no longer supports',
            'The release build stripped a package Metro resolved from its cache',
            'Hermes bytecode was compiled for a different CPU architecture',
          ], 1, 'New Architecture incompatibilities surface when the native code actually runs, so a clean bundle proves nothing and only a release build on a real device catches them.'),
        ]
      ),
      ],
      [
      q('Which of these can actually take a broken 3.1.0 off a phone that has already installed it?', [
        'Halting the staged rollout of 3.1.0 in the Play Console',
        'Pausing the App Store phased release for version 3.1.0',
        'Removing 3.1.0 from sale on both store listings at once',
        'A server driven kill switch that disables the broken path',
      ], 3, 'Store controls only govern who receives a version next, so the only thing that changes behaviour on a device that already updated is a switch the running app itself obeys.'),
      q('Analytics show 2.9.4 is 7.8% of daily actives and you plan to wall it off. What should happen before that ships?', [
        'The wall is hard coded in the client so nobody can turn it off later',
        'It goes out behind a flag on a staged rollout, watching support volume',
        'The old endpoints are retired first so the wall cannot be bypassed',
        'The minimum version is raised on every client at the same moment',
      ], 1, 'A forced upgrade is the most destructive change you can push, so it needs the same gradual exposure and retractable switch as any other risky release.'),
      q('A hotfix published over the air reports success and reaches zero devices. What do you check first?', [
        'The runtime version on the update against the one in the shipped binary',
        'Whether the production channel is still mapped to that update branch',
        'Whether the store build had finished processing before you published',
        'That the bundle was minified using the production build profile',
      ], 0, 'Updates are matched to binaries by runtime version, and a version bump made before publishing stamps the update for a runtime that no installed app is running.'),
      q('Twelve feature flags are live and none has ever been deleted. What is the practical cost?', [
        'The config payload grows past what a cold start can fetch in time',
        'Flag lookups become slow enough to delay the first render noticeably',
        'The app has thousands of possible states, so bugs stop reproducing',
        'Each flag adds a network round trip before its feature can render',
      ], 2, 'Independent flags multiply into a combinatorial number of configurations, so a reported bug depends on a combination that neither your tests nor your own device happen to be in.'),
      ]
    ),
  ],
  final: [
    q('Text rendered directly inside a <View> causes what?', [
      'It renders normally',
      'A crash — text must be inside <Text>',
      'It renders invisibly',
      'A yellow-box warning in development, with the text simply dropped',
    ], 1, 'Native views cannot render characters, so React Native throws rather than silently failing.'),
    q('Which component should render a 5,000-row list?', [
      'ScrollView',
      'FlatList',
      'View with map()',
      'SafeAreaView',
    ], 1, 'FlatList virtualises, rendering only near-viewport rows; ScrollView would mount all 5,000 at once.'),
    q('What is the default flexDirection?', [
      'row',
      'column',
      'row-reverse',
      'inherit',
    ], 1, 'React Native defaults to column, matching the tall shape of phone screens.'),
    q('A remote image does not appear. Most likely cause?', [
      'A resizeMode prop that was left unset on the Image component',
      'No explicit width and height',
      'Wrong source syntax',
      'Missing alt text',
    ], 1, 'Remote images have no intrinsic size in RN, so without dimensions they render at zero.'),
    q('Why pass an id rather than a full object in navigation params?', [
      'Objects are forbidden by React Navigation, which throws if a param is not a string',
      'Params are serialised; a copied object bloats state and goes stale',
      'It renders faster',
      'Params must be primitives',
    ], 1, 'The snapshot will not reflect later data changes, and large params bloat persisted navigation state.'),
    q('A card shows a shadow on iOS but is flat on Android. Why?', [
      'Android needs elevation, not shadowOpacity/shadowRadius',
      'Android ignores shadows entirely, so a gradient image has to be used instead',
      'The border is missing',
      'Shadows need useNativeDriver',
    ], 0, 'The platforms expose different shadow APIs; Android uses a single elevation value.'),
    q('Where should a session token be stored?', [
      'AsyncStorage',
      'SecureStore',
      'Navigation params',
      'A global variable',
    ], 1, 'AsyncStorage is unencrypted; SecureStore uses the iOS Keychain and Android Keystore.'),
    q('fetch receives a 500 response. What happens to the promise?', [
      'It rejects with an error that carries the status code',
      'It resolves with res.ok === false',
      'It retries',
      'It throws a TypeError',
    ], 1, 'fetch rejects only on network failure, so HTTP error statuses must be checked via res.ok.'),
    q('Why must buildNumber/versionCode increase on every upload?', [
      'To trigger OTA updates',
      'The stores reject duplicate build numbers',
      'It resets crash reports',
      'It is the version number shown to users in the store listing and settings',
    ], 1, 'Both stores require a strictly increasing build identifier, even when re-uploading the same user-facing version.'),
    q('Which change can ship as an over-the-air update?', [
      'Adding a new native module',
      'A JavaScript-only bug fix',
      'Adding a camera permission',
      'Upgrading the Expo SDK',
    ], 1, 'OTA updates replace the JS bundle only; anything touching native code or permissions needs a new build.'),
    q('Android users report that notifications arrive but are silent and easy to miss. What was skipped?', [
      'The foreground notification handler',
      'Sending the push token to the server after the user signs in',
      'Requesting notification permission',
      'Creating an Android notification channel',
    ], 3, 'Android 8+ puts sound and heads-up behaviour under the notification channel; with none of your own an unconfigured fallback channel decides, and it does neither.'),
    q('Returning to a stack screen shows stale data because its useEffect never re-runs. Correct fix?', [
      'Use useFocusEffect so the work runs each time the screen is focused',
      'Add the data to the dependency array',
      'Call navigation.push instead of navigate',
      'Move the fetch into a Context provider mounted above the navigator so it is shared',
    ], 0, 'A pushed screen leaves the previous one mounted, so returning fires focus rather than a fresh mount.'),
    q('Six requests fail with 401 at once. Why should the refresh be single-flight?', [
      'SecureStore blocks concurrent reads',
      'The OS rate-limits parallel background requests, so the extra refresh calls are dropped silently',
      'Concurrent refreshes rotate the token, so all but the first fail and sign the user out',
      'It reduces the bundle size',
    ], 2, 'Only the first rotation is valid; letting each 401 refresh independently invalidates the rest and forces a needless logout.'),
    q('A production stack trace reads "t.a is not a function at index.android.bundle:1:284915". What is missing?', [
      'An error boundary',
      'Uploaded source maps for that release',
      'The Hermes debugger attached to the release build on the device',
      'Breadcrumbs',
    ], 1, 'Release bundles are minified, so only uploaded source maps can map the frame back to real file names and lines.'),
    q('A catalogue screen blocks the JavaScript thread for about eight seconds parsing a large response. The team moves the loading spinner from Animated with the JS driver to a Reanimated worklet, and it now spins perfectly all the way through the stall. What has actually changed for the user?', [
      'Android now counts the stall as an ANR, so it finally shows up in vitals',
      'Nothing is faster; the app looks busy rather than stuck, so users wait longer',
      'The parse moves onto the UI thread with the worklet, so the stall gets shorter',
      'The spinner competes with the parse for the JS thread, so the stall gets longer',
    ], 1, 'A worklet runs in a second runtime on the UI thread, so it keeps drawing while the JS thread is blocked, but the screen is still completely inert and a blocked JS thread never trips the ANR watchdog, so the smooth spinner only hides the fault from users and from Play vitals.'),
    q('A hand built bottom sheet fades its backdrop opacity from 0.5 to 0 as it closes and never unmounts it. After closing the filters, users report the catalogue behind it is frozen: it will not scroll and taps do nothing, yet a header animation carries on smoothly. What is wrong?', [
      'A backdrop at opacity 0 is still laid out and still receives touches, so it needs display none',
      'The closing spring keeps the JS thread busy until it settles, so every touch is dropped during that time',
      'The sheet pan recogniser stays active after the close and swallows touches',
      'runOnJS was omitted around onClose, so the navigator never released the screen',
    ], 0, 'Opacity zero only stops a view being painted; it is still a hit testable layer covering the screen, so this is an invisible overlay rather than a blocked thread, which is why an unrelated animation keeps running. Pair the interpolated opacity with display none once the sheet reaches the closed snap point.'),
    q('Parcel rows live in SQLite, and a team moves the outbox into MMKV so a synchronous read can paint the pending badge on first frame. Which guarantee does that trade away?', [
      'MMKV cannot hold enough entries to cover a full day of offline scanning',
      'Idempotency keys stop surviving a process restart, so every retry duplicates',
      'The flush loop can no longer preserve the order the driver acted in',
      'The row update and its outbox entry can no longer commit in one transaction',
    ], 3, 'Two separate stores cannot share a transaction, so a process kill in the gap between the SQLite update and the MMKV write leaves a parcel shown as delivered with nothing queued to send, which is exactly the silent loss a durable outbox exists to prevent.'),
    q('After the New Architecture is enabled, a legacy component that dimmed itself with ref.current.setNativeProps({ style: { opacity: 0.4 } }) stays at full opacity and logs nothing. What explains it, and what replaces that call?', [
      'The ref resolves late under Fabric, so make the same call inside useLayoutEffect',
      'setNativeProps requires the native driver, so pass useNativeDriver on the animation',
      'Fabric has no mutable view tree addressed by tag, so drive opacity from state or a shared value',
      'Style objects are validated by Codegen now, so move the opacity into a StyleSheet entry',
    ], 2, 'Direct prop mutation assumed the old mutable native view tree reachable by a node handle, and Fabric commits its tree through the renderer instead, so the write is simply ignored. The change has to come from React state or from a Reanimated shared value feeding an animated style.'),
    q('Version 3.0.0 ships on a new Expo SDK and reaches 40 percent of installs while the rest are still on 2.9.4. A JavaScript bug affects both, so you publish one eas update to the production branch from main. Who receives that bundle?', [
      'Everyone on the production branch, because the branch is what devices subscribe to',
      'Only devices that already downloaded an earlier update from that same branch',
      'Nobody, because updates are refused while a staged rollout is still running',
      'Only devices whose runtime version matches the one this bundle was stamped with',
    ], 3, 'An update is delivered only to installs whose runtime version equals the update\'s, so a bundle published from main is stamped for the new SDK\'s runtime and skips every 2.9.4 phone. Covering both populations means publishing from the tag that built each binary until the old build\'s share is small enough to force off.'),
    q('Route names are renamed in 3.2.0 and the server is updated to send { screen: \'CourseOutline2\' } in its push payloads. Notifications now open nothing at all on the 7.8 percent of installs still running 2.9.4, silently and with no error anywhere. What is the underlying mistake?', [
      'Push tokens were not refreshed after the rename, so payloads route to a stale build',
      'Deep link payloads should be keyed by build number rather than by route name',
      'A payload key or route name is a contract with every installed build, so it is additive only',
      'The notification channel changed along with the rename, so old builds drop the payload',
    ], 2, 'Every build ever installed parses that payload, so renaming a route is a breaking API change for clients you cannot recall, and an unknown screen name simply resolves to nothing. Keep accepting the old name, or keep sending it, until that version\'s share of daily actives is small enough to force an upgrade.'),
    q('In a View with flexDirection: \'row\', two child Views have flex: 1 and flex: 2 and no fixed widths. How is the row\'s width shared?', [
      'Each gets half, since flex only switches growth on',
      'The first gets 1 point and the second 2 points',
      'The first gets one third and the second two thirds',
      'The second gets double its own content width',
    ], 2, 'flex values are proportions of the free space along the main axis, so 1 and 2 split it one third to two thirds.'),
    q('A Pressable has style={[styles.button, { backgroundColor: \'red\' }]}, and styles.button sets backgroundColor to \'blue\'. What colour is the button?', [
      'Red, because later entries in a style array win',
      'Blue, because StyleSheet styles take priority',
      'Purple, because the two colours are blended',
      'Blue, because inline objects are ignored in arrays',
    ], 0, 'Style arrays merge left to right, so a property in a later entry overrides the same property in an earlier one.'),
    q('A screen builds a heavy search index as soon as it mounts, and the push transition into it stutters. Which change keeps the transition smooth while still building the index?', [
      'Build it in a useMemo with an empty dependency list',
      'Build it directly in the render function so it finishes before the transition',
      'Wrap the screen component in React.memo',
      'Build it inside InteractionManager.runAfterInteractions',
    ], 3, 'runAfterInteractions waits until the navigation animation has finished, so the heavy work no longer competes with the transition for the JS thread.'),
    q('A FlatList\'s keyExtractor returns each item\'s array index. After a new item is inserted at the top, rows show the wrong checked state. What fixes it?', [
      'Switch the list from FlatList to a ScrollView so every row remounts cleanly',
      'Return a stable id from the item, such as String(item.id)',
      'Add getItemLayout with a fixed row height',
      'Wrap every row component in React.memo',
    ], 1, 'Index keys shift when items are inserted, so React reuses rows for the wrong data; a stable id keeps each row tied to its item.'),
    q('A FlatList loads the next page in onEndReached, and duplicate pages appear when users scroll fast. What is the usual fix?', [
      'Set onEndReachedThreshold to 0 so it never fires early',
      'Replace the FlatList with a ScrollView of all pages',
      'Skip the call while a page is loading or none remain',
      'Call loadMore from renderItem for the last row',
    ], 2, 'onEndReached can fire several times near the end, so the loader must ignore calls while a request is in flight or when there is nothing more to fetch.'),
    q('Long course titles wrap onto four lines and push the price off the bottom of a fixed-height card. Which change fixes it?', [
      'numberOfLines={2} on the title Text',
      'flexWrap: \'nowrap\' on the card View',
      'adjustsFontSizeToFit on the price Text',
      'overflow: \'hidden\' on the card View',
    ], 0, 'numberOfLines truncates variable-length text to a set number of lines, which keeps the card layout intact.'),
    q('cortexis://course/42 opens the app but lands on the home screen instead of the course. What is most likely missing?', [
      'A second app icon registered for the cortexis scheme',
      'A navigation.push call placed inside the home screen\'s render, to forward the URL',
      'The course id sent as a number rather than a string',
      'A \'course/:slug\' path mapped to that screen in the linking config',
    ], 3, 'The scheme opens the app, but React Navigation only routes to a screen when the linking config maps the URL path to it.'),
    q('After a three-step checkout pushed onto a stack, you want to return the user to the first screen of that stack. Which call does that?', [
      'navigation.goBack()',
      'navigation.popToTop()',
      'navigation.push(\'Home\')',
      'navigation.navigate(\'Payment\')',
    ], 1, 'popToTop pops every screen above the first one; goBack pops only one, and push adds yet another screen.'),
    q('A user drills three screens deep in the Learn tab, switches to the Profile tab, then taps Learn again. What should they see?', [
      'The third screen, because each tab keeps its own stack',
      'The Learn tab\'s first screen, because switching tabs resets that stack to the top',
      'A blank screen until the Learn stack remounts',
      'The Profile tab, since all tabs share one history',
    ], 0, 'Tabs stay mounted and each nested stack preserves its state, so returning to a tab shows where the user left off.'),
    q('A search screen fires a request on every keystroke and sometimes shows results for an older query. What is going on, and what fixes it?', [
      'fetch caches by URL; add a random query string',
      'State updates are batched; call setState twice',
      'An older response lands last; abort or ignore stale requests',
      'The keyboard delays input events on slower devices; use onChange instead of onChangeText',
    ], 2, 'Responses can arrive out of order on mobile networks, so the screen must cancel earlier requests or discard any response that is not for the latest query.'),
    q('A developer calls AsyncStorage.setItem(\'user\', { name: \'Ali\' }), and reading it back does not give the object. What is wrong?', [
      'AsyncStorage keys must be numbers rather than strings',
      'setItem is synchronous and must not be awaited',
      'Objects can only be stored in SecureStore, which accepts native types, not AsyncStorage',
      'AsyncStorage stores strings, so the object must be JSON.stringify\'d',
    ], 3, 'Every AsyncStorage value is a string, so structured data is encoded with JSON.stringify and decoded with JSON.parse.'),
    q('A course list screen shows a blank white area when the API returns an empty array. What should it render instead?', [
      'The loading spinner until at least one course arrives from the server',
      'An explicit empty state, for example with ListEmptyComponent',
      'An error message asking the user to try again',
      'Nothing, since an empty list needs no feedback',
    ], 1, 'Loading, error and empty are different states; an empty result deserves its own message rather than a blank screen or a misleading spinner.'),
    q('A list sets initialNumToRender to 60 "to avoid blank space", and the screen now takes much longer to appear. Why?', [
      'All 60 rows render in the first commit before anything shows',
      'FlatList stops virtualising once the value exceeds 50, so scrolling later janks',
      'Each extra row triggers its own network request',
      'The value also disables keyExtractor for the list',
    ], 0, 'initialNumToRender sets how many rows the first commit renders, so a large value delays first paint; roughly a screenful is enough.'),
    q('A user who denied photo access on iOS taps Upload again. What is the right response?', [
      'Call the permission request again until the user accepts',
      'Throw an error so the user knows something went wrong',
      'Explain why, and offer a button that calls Linking.openSettings()',
      'Open the picker anyway, since permission is optional',
    ], 2, 'After a denial iOS will not show the prompt again, so the only way forward is to explain and send the user to Settings.'),
    q('Why pass quality: 0.7 to the image picker before uploading a photo?', [
      'A quality of 1 is not supported on Android devices',
      'It stops the picker from asking for permission',
      'It keeps full quality but strips only the EXIF data',
      'Full-size phone photos are several MB, so compressing speeds uploads',
    ], 3, 'Raw phone photos are large and slow to send over cellular data, so compressing them first makes uploads faster and cheaper.'),
    q('A banking app shows balances from when it was last opened, and the user returns to it from another app hours later. What refreshes the data at the right moment?', [
      'A setInterval that refetches every second in the background',
      'Refetching when AppState changes to \'active\'',
      'Refetching only when the component first mounts',
      'Keeping the balances in SecureStore instead of state',
    ], 1, 'An AppState listener fires when the app returns to the foreground, which is exactly when stale data needs refreshing; background timers are suspended.'),
    q('Why issue a short-lived access token of about 15 minutes alongside a long-lived refresh token?', [
      'A leaked access token works briefly, and refresh can be revoked',
      'Short tokens make every API request noticeably faster',
      'Refresh tokens let the app skip HTTPS on most calls',
      'It makes it safe to keep the access token in AsyncStorage',
    ], 0, 'Short access tokens limit the damage if one leaks, while the refresh token stays in SecureStore and can be revoked on the server.'),
    q('A screen loads the user\'s name from a mocked fetch. The test calls getByText(\'Welcome, Ali\') straight after render and fails. What fixes it?', [
      'screen.getByTestId(\'welcome\') instead',
      'jest.useFakeTimers() before render, then advance them',
      'await screen.findByText(\'Welcome, Ali\')',
      'screen.queryByText(\'Welcome, Ali\')',
    ], 2, 'findBy queries retry until the element appears, which suits anything that renders after an asynchronous fetch; getBy checks only once.'),
    q('Code wrapped in if (__DEV__) { ... } adds extra logging. In which builds does it run?', [
      'Every build, since users set __DEV__ at runtime',
      'Only release builds, to help diagnose crashes',
      'Only on simulators, whatever the build type',
      'Only development builds; __DEV__ is false in release',
    ], 3, '__DEV__ is true in development and false in release builds, so dev-only code paths disappear in what users install.'),
    q('Inline requires are off. src/analytics.js calls Analytics.createClient() at the top level, and the home screen imports that file. What does this cost?', [
      'Nothing, since Hermes skips top-level code until the module\'s exports are actually used',
      'The client is created on every cold start, before the first screen',
      'A crash in release builds, where top-level code is removed',
      'Only bundle size; startup time is not affected',
    ], 1, 'Top-level code runs when the module is evaluated, so every launch pays for the client; creating it lazily on first use removes that cost.'),
    q('Memory climbs each time a user opens and closes a map screen that starts a location watcher in useEffect. What is the likely cause?', [
      'The effect never removes the subscription in its cleanup',
      'useEffect runs only once, so the watcher cannot leak',
      'Location data is cached in AsyncStorage on every update',
      'The screen renders a FlatList instead of a ScrollView',
    ], 0, 'Without a cleanup that removes the subscription, every visit leaves another watcher alive holding memory and callbacks.'),
    q('A horizontal swipe-to-delete row inside a vertical list keeps grabbing gestures that were meant to scroll the list. Which Pan gesture settings fix that?', [
      'minDistance(0), so the row claims each touch at once before the list can react',
      'numberOfPointers(2), so only two-finger swipes can delete',
      'activeOffsetX plus failOffsetY, so vertical moves go to the list',
      'enabled(false) permanently, with a delete button instead',
    ], 2, 'activeOffsetX waits until movement is clearly horizontal, and failOffsetY makes the gesture give up once it looks like a vertical scroll.'),
    q('Your onboarding uses large sliding parallax transitions, and AccessibilityInfo.isReduceMotionEnabled() returns true for a user. What should the app do?', [
      'Play the same slides at half their normal speed',
      'Play the slides but mute any accompanying sound',
      'Ignore it, since the setting only affects system screens',
      'Replace the sliding transitions with a simple cross fade',
    ], 3, 'Users enable Reduce Motion because movement can make them ill, so the right response is a calmer transition such as a cross fade.'),
    q('SQLite holds 60,000 readings, and a query filters by site_id and orders by taken_at to fetch the newest 50. It is slow. What helps most?', [
      'Moving the rows into one AsyncStorage JSON key',
      'A composite index on (site_id, taken_at)',
      'Reading every row and sorting in JavaScript',
      'An index on the value column only',
    ], 1, 'An index on site_id then taken_at lets SQLite jump to one site\'s rows already in date order and stop after 50.'),
    q('Why must each on-device schema migration run inside a transaction?', [
      'A failure rolls back fully instead of leaving a half-changed schema',
      'Transactions let SQLite skip migrations on older devices',
      'Without one, migrations run on the UI thread',
      'It lets the server roll the migration back remotely',
    ], 0, 'A migration that fails halfway outside a transaction leaves the database half changed, which can crash the app on every launch.'),
    q('A native module function has to update a native UIView or Android View. How should it be declared?', [
      'As a Function, so it runs synchronously on the JS thread',
      'As an AsyncFunction left on the module\'s background queue, since views accept updates from any thread',
      'As an AsyncFunction that dispatches its work to the main thread',
      'As a JavaScript-only helper, since views are off limits',
    ], 2, 'Native views may only be touched on the main thread, so the call is asynchronous and explicitly dispatched there.'),
    q('An Expo app that uses continuous native generation needs Android minSdkVersion raised to 26. Where does that change belong?', [
      'In android/app/build.gradle, edited by hand',
      'In package.json, under a new minSdk field',
      'In an environment variable set inside an eas.json build profile for Android',
      'In the expo-build-properties plugin settings in the app config',
    ], 3, 'Under continuous native generation the native folders are regenerated, so native settings are declared in the app config through plugins such as expo-build-properties.'),
    q('Play App Signing is enabled, and the team loses its Android upload key. What happens?', [
      'The listing can never receive another update',
      'You request an upload key reset, since Google holds the signing key',
      'Every user must uninstall and reinstall the app',
      'Google re-signs past builds with a new key automatically and notifies every installed user',
    ], 1, 'With Play App Signing, Google keeps the app signing key, so a lost upload key can be reset and updates continue.'),
    q('A kill switch is flipped at 14:00, yet many active users only see its effect the next morning. What explains it?', [
      'Flags are fetched only at cold start, and most users just resume',
      'The stores hold remote config changes until the next app review is approved',
      'Kill switches only apply to builds published afterwards',
      'The flag service accepts changes only once a day',
    ], 0, 'Cold starts are rare on mobile, so flags must also be refreshed when the app returns to the foreground for a switch to act within minutes.'),
    q('During an iOS phased release at the 5 percent step, a user outside that group opens your App Store page and taps Update. What happens?', [
      'They are told the update is not yet available to them, and the Update button stays disabled',
      'They receive the previous build again',
      'They join a waitlist for the next phase',
      'They get the new build, whatever phase the release is in',
    ], 3, 'A phased release only limits automatic updates; anyone who updates manually from the App Store gets the new version immediately.'),
  ],
});
