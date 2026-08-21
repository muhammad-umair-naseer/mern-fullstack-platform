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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
  ],
  final: [
    q("Text rendered directly inside a <View> causes what?", [
      "It renders normally",
      "A crash — text must be inside <Text>",
      "It renders invisibly",
      "A console warning only",
    ], 1, "Native views cannot render characters, so React Native throws rather than silently failing."),
    q("Which component should render a 5,000-row list?", [
      "ScrollView",
      "FlatList",
      "View with map()",
      "SafeAreaView",
    ], 1, "FlatList virtualises, rendering only near-viewport rows; ScrollView would mount all 5,000 at once."),
    q("What is the default flexDirection?", [
      "row",
      "column",
      "row-reverse",
      "inherit",
    ], 1, "React Native defaults to column, matching the tall shape of phone screens."),
    q("A remote image does not appear. Most likely cause?", [
      "Missing resizeMode",
      "No explicit width and height",
      "Wrong source syntax",
      "Missing alt text",
    ], 1, "Remote images have no intrinsic size in RN, so without dimensions they render at zero."),
    q("Why pass an id rather than a full object in navigation params?", [
      "Objects are forbidden",
      "Params are serialised; a copied object bloats state and goes stale",
      "It renders faster",
      "Params must be primitives",
    ], 1, "The snapshot will not reflect later data changes, and large params bloat persisted navigation state."),
    q("A card shows a shadow on iOS but is flat on Android. Why?", [
      "Android needs elevation, not shadowOpacity/shadowRadius",
      "Android has no shadow support",
      "The border is missing",
      "Shadows need useNativeDriver",
    ], 0, "The platforms expose different shadow APIs; Android uses a single elevation value."),
    q("Where should a session token be stored?", [
      "AsyncStorage",
      "SecureStore",
      "Navigation params",
      "A global variable",
    ], 1, "AsyncStorage is unencrypted; SecureStore uses the iOS Keychain and Android Keystore."),
    q("fetch receives a 500 response. What happens to the promise?", [
      "It rejects",
      "It resolves with res.ok === false",
      "It retries",
      "It throws a TypeError",
    ], 1, "fetch rejects only on network failure, so HTTP error statuses must be checked via res.ok."),
    q("Why must buildNumber/versionCode increase on every upload?", [
      "To trigger OTA updates",
      "The stores reject duplicate build numbers",
      "It resets crash reports",
      "It controls the version users see",
    ], 1, "Both stores require a strictly increasing build identifier, even when re-uploading the same user-facing version."),
    q("Which change can ship as an over-the-air update?", [
      "Adding a new native module",
      "A JavaScript-only bug fix",
      "Adding a camera permission",
      "Upgrading the Expo SDK",
    ], 1, "OTA updates replace the JS bundle only; anything touching native code or permissions needs a new build."),
    q("Android users report that notifications arrive but are silent and easy to miss. What was skipped?", [
      "The foreground notification handler",
      "Sending the push token to the server",
      "Requesting notification permission",
      "Creating an Android notification channel",
    ], 3, "Android 8+ puts sound and heads-up behaviour under the notification channel; with none of your own an unconfigured fallback channel decides, and it does neither."),
    q("Returning to a stack screen shows stale data because its useEffect never re-runs. Correct fix?", [
      "Use useFocusEffect so the work runs each time the screen is focused",
      "Add the data to the dependency array",
      "Call navigation.push instead of navigate",
      "Move the fetch into a Context provider",
    ], 0, "A pushed screen leaves the previous one mounted, so returning fires focus rather than a fresh mount."),
    q("Six requests fail with 401 at once. Why should the refresh be single-flight?", [
      "SecureStore blocks concurrent reads",
      "The OS rate-limits background requests",
      "Concurrent refreshes rotate the token, so all but the first fail and sign the user out",
      "It reduces the bundle size",
    ], 2, "Only the first rotation is valid; letting each 401 refresh independently invalidates the rest and forces a needless logout."),
    q("A production stack trace reads \"t.a is not a function at index.android.bundle:1:284915\". What is missing?", [
      "An error boundary",
      "Uploaded source maps for that release",
      "A release tag in Sentry.init",
      "Breadcrumbs",
    ], 1, "Release bundles are minified, so only uploaded source maps can map the frame back to real file names and lines."),
  ],
});
