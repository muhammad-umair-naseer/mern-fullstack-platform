import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'laravel-fundamentals',
  title: 'Laravel Fundamentals',
  category: 'Web',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'rose',
  coverKey: 'laravel-fundamentals',
  summary:
    'Build a real Laravel application end to end — routing, Blade, migrations, Eloquent relationships, validation, Breeze authentication, and a versioned REST API you would actually ship.',
  description:
    'You start from plain PHP and Composer and finish with a working blog plus its JSON API: schema designed in migrations, models wired together with relationships, forms guarded by form requests and policies, and endpoints protected by Sanctum. Each chapter leaves you able to diagnose a specific production failure — the env() call that returns null after config caching, the N+1 query hiding in a Blade loop, the unique rule that locks users out of their own profile, and the API resource that quietly leaks a column.',
  chapters: [
    chapter(
      'PHP, Composer, and the Laravel Lifecycle',
      'The language features Laravel assumes, how Composer loads your classes, and exactly where a request goes.',
      [
        lesson('PHP That Laravel Expects', 12, `
Laravel is ordinary PHP with strong conventions layered on top. The features below appear on almost every line of a Laravel project, so getting them exact now saves hours of confused debugging later.

### Types, and why strict mode matters

\`\`\`php
<?php
declare(strict_types=1);   // first line of every PHP file you write

function discount(float $price, int $percent): float
{
    return round($price * (1 - $percent / 100), 2);
}

discount(100.0, 10);   // 90.0
discount('abc', 10);   // TypeError — caught immediately
\`\`\`

PHP 8 refuses a wholly non-numeric string like \`'abc'\` at a \`float\` parameter whether or not strict mode is on. What \`declare(strict_types=1)\` adds is refusing the *plausible-looking* conversions: without it \`discount('100', 10)\`, \`discount('100.50', 10)\` and even \`discount(true, 10)\` all sail through, with \`$price\` silently becoming \`100.0\`, \`100.5\` and \`1.0\`. That is how an unvalidated query-string value or a stray checkbox becomes a number nobody checked. Turn it on and let the language complain at the boundary instead of the balance sheet.

### Classes, promoted constructors, and namespaces

\`\`\`php
<?php
namespace App\\Services;   // must mirror the folder: app/Services

final class PriceCalculator
{
    // Constructor property promotion: declare and assign in one place
    public function __construct(
        private readonly float $taxRate = 0.17,
    ) {}

    public function withTax(float $amount): float
    {
        return round($amount * (1 + $this->taxRate), 2);
    }
}
\`\`\`

\`$this->\` reaches instance members; \`self::\` or the class name reaches static ones. \`readonly\` blocks reassignment after construction, which is what you want for a value object nothing should mutate halfway through a request.

### Arrays are the workhorse

PHP arrays are ordered maps, so one type serves as both list and dictionary:

\`\`\`php
$user = ['name' => 'Ayesha', 'roles' => ['admin', 'editor']];

$user['email'] ?? 'unknown';    // null coalescing — no warning if the key is missing
$profile?->bio;                 // nullsafe operator — null instead of a fatal

$names  = array_map(fn ($u) => $u['name'], $users);
$admins = array_filter($users, fn ($u) => in_array('admin', $u['roles'], true));
\`\`\`

**The classic bug:** \`array_filter\` preserves the original keys. Filter out element 0 of a list and you are left with keys \`1, 2, 3\` — which \`json_encode\` serialises as a JSON *object*, not an array. The front end then crashes on \`.map()\` and the stack trace points nowhere near the filter. Wrap it: \`array_values(array_filter(...))\`. Laravel's collections (Chapter 3) solve this with \`->values()\`.

### Comparison, match, and enums

\`\`\`php
'1' == '01';    // true — loose comparison still surprises people
'1' === '01';   // false — always prefer ===

$label = match (true) {          // match compares with === and returns a value
    $score >= 90 => 'excellent',
    $score >= 70 => 'good',
    default      => 'needs work',
};
\`\`\`

\`match\` has no fall-through and throws when nothing matches, so a forgotten case fails loudly instead of silently returning null the way \`switch\` would.

Enums replace magic strings for fixed sets:

\`\`\`php
enum Status: string
{
    case Draft     = 'draft';
    case Published = 'published';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}

Status::from('draft');     // Status::Draft — throws on an unknown value
Status::tryFrom('nope');   // null
\`\`\`

Eloquent can cast a column straight to an enum, so a typo like \`'publised'\` becomes an exception at the boundary rather than a row nobody can find.

### Strings

\`\`\`php
$greeting = "Hello, {$user['name']}";   // double quotes interpolate
$literal  = 'Hello, {$name}';           // single quotes do not
\`\`\`

Interpolate with braces — \`"{$obj->prop}"\` — and you will never guess wrong about where the expression ends.
        `),
        lesson('Composer, Autoloading, and the Project Layout', 12, `
Composer is PHP's dependency manager and, just as importantly, its class loader. Laravel is a Composer package that happens to ship an application skeleton with it.

### Creating an app

\`\`\`bash
composer create-project laravel/laravel blog   # new app in ./blog
cd blog
cp .env.example .env
php artisan key:generate
php artisan serve                              # http://127.0.0.1:8000
\`\`\`

Two files control dependencies:

| File | Contains | Commit it? |
|---|---|---|
| \`composer.json\` | The versions you *asked for*, e.g. \`"laravel/framework": "^12.0"\` | Yes |
| \`composer.lock\` | The exact versions actually resolved, down to the commit | Yes |

\`composer install\` reads the lock file and reproduces that exact dependency tree. \`composer update\` ignores the lock, resolves fresh versions, and rewrites it.

**The classic mistake:** running \`composer update\` on the production server. You then deploy a dependency set nobody has ever tested, and a patch release of some transitive package becomes your outage. Deploy scripts run \`composer install --no-dev --optimize-autoloader\`; \`update\` happens on a developer machine and the resulting lock file is committed and reviewed like any other change.

### Autoloading is PSR-4

You never \`require\` a class file in Laravel. \`composer.json\` maps a namespace prefix to a directory:

\`\`\`json
"autoload": {
    "psr-4": {
        "App\\\\": "app/",
        "Database\\\\Factories\\\\": "database/factories/"
    }
}
\`\`\`

So \`App\\Models\\Post\` must live in \`app/Models/Post.php\`, the file must declare \`namespace App\\Models;\`, and the class must be named \`Post\`. Get the folder, the namespace, the filename, or the *capitalisation* out of sync and you get \`Class "App\\Models\\post" not found\`. Capitalisation is the cruel one: macOS and Windows filesystems are case-insensitive, Linux is not, so the error appears for the first time on the server. After adding a brand-new top-level directory, run \`composer dump-autoload\`.

\`vendor/\` is generated, git-ignored, and must never be edited. A fix you make there vanishes on the next install; the supported routes are a fork or a patch file.

### The directories that matter

| Path | What lives there |
|---|---|
| \`app/Models\` | Eloquent models |
| \`app/Http/Controllers\` | Controllers |
| \`routes/web.php\` | Browser routes — sessions and CSRF |
| \`routes/api.php\` | Stateless API routes (Chapter 5) |
| \`resources/views\` | Blade templates |
| \`database/migrations\` | Schema history |
| \`config/\` | Configuration arrays |
| \`public/\` | The only web-exposed folder; \`index.php\` lives here |
| \`storage/\` | Logs, caches, uploads — must be writable |

Point your web server's document root at \`public/\`, never at the project root. One level up exposes \`.env\` — and your database password — to anyone who guesses the URL.

### .env, config, and the caching trap

\`\`\`php
// config/services.php
return [
    'stripe' => ['key' => env('STRIPE_KEY')],   // env() is fine HERE
];
\`\`\`

\`\`\`php
// Anywhere else — controllers, models, jobs, middleware
config('services.stripe.key');   // correct
env('STRIPE_KEY');               // a bug waiting for your first deploy
\`\`\`

\`php artisan config:cache\`, which every real deployment runs, compiles all config files into one array and stops loading \`.env\` entirely. Any \`env()\` call outside \`config/\` then returns \`null\` — in production only, never on your machine. This is the single most common "works locally, breaks on the server" bug in Laravel. Read env vars in config files; read config everywhere else.

### Artisan

\`\`\`bash
php artisan list                  # every command
php artisan make:model Post -mfc  # model + migration + factory + controller
php artisan tinker                # a REPL with your whole app booted
php artisan about                 # environment, drivers, and cache status
\`\`\`

Build the \`tinker\` habit early: you can run \`Post::first()->comments\` against real data without writing a route or a view.
        `),
        lesson('MVC and the Request Lifecycle', 13, `
Knowing exactly where a request travels turns Laravel from magic into machinery. Every HTTP request follows the same path.

### The path a request takes

1. The web server hands **every** URL to \`public/index.php\` — an \`.htaccess\` rule or an nginx \`try_files\` directive does the rewriting.
2. \`index.php\` loads Composer's autoloader and \`bootstrap/app.php\`, which builds the **application container**.
3. The HTTP kernel runs **global middleware**: trim strings, convert empty strings to null, check maintenance mode.
4. The **router** matches method plus URI to a route, then runs that route's **middleware group** (\`web\` or \`api\`) followed by any route-specific middleware.
5. The **controller** action runs. Its dependencies are resolved from the container; it does the work and returns a response.
6. The response travels back **out** through the same middleware in reverse order — which is how the session cookie and CSRF token get attached.

Two facts follow. Middleware order is real order, not decoration. And anything a controller can do, middleware can do — which is why cross-cutting concerns (auth, locale, logging, headers) belong there rather than copy-pasted into twenty actions.

### MVC in Laravel terms

- **Model** — an Eloquent class plus the rules that belong to that data (\`app/Models\`).
- **View** — a Blade template. It formats; it does not decide (\`resources/views\`).
- **Controller** — accepts a request, delegates, returns a response.

The controller is a *coordinator*, not a residence. A 300-line controller action is the most common structural problem in Laravel codebases. Push query logic into scopes or the model, push multi-step workflows into a service class, and the action stays readable:

\`\`\`php
public function store(StoreOrderRequest $request, PriceCalculator $prices)
{
    $order = $request->user()->orders()->create([
        'total' => $prices->withTax($request->validated('subtotal')),
    ]);

    return redirect()->route('orders.show', $order)
        ->with('status', 'Order placed.');
}
\`\`\`

### The service container

The container is a registry that knows how to build objects. Type-hint a class and Laravel constructs it for you — **dependency injection**:

\`\`\`php
use App\\Services\\PriceCalculator;

class CheckoutController
{
    public function __construct(private PriceCalculator $prices) {}
}
\`\`\`

You never wrote \`new PriceCalculator()\`. That matters because the container can be told to build something else — a fake in tests, a different driver in production:

\`\`\`php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    // Bind an interface to a concrete implementation
    $this->app->bind(PaymentGateway::class, StripeGateway::class);
}

public function boot(): void
{
    // Runs after EVERY provider has registered — safe to use other services here
    Model::preventLazyLoading(! app()->isProduction());
}
\`\`\`

\`register()\` only binds things. Calling another service inside \`register()\` is a genuine bug: it may not have been registered yet, and the failure depends on provider order. That is what \`boot()\` exists for.

### Facades are the container in disguise

\`\`\`php
use Illuminate\\Support\\Facades\\Cache;

Cache::put('key', 'value', 60);   // looks static...
// ...actually resolves 'cache' from the container and calls put() on that instance
\`\`\`

So \`Cache::\` is not an untestable static class. \`Cache::shouldReceive('put')\` swaps the underlying instance for a mock in a test. The helper functions \`cache()\`, \`auth()\`, \`request()\` and \`config()\` perform the same container lookup with less ceremony.

### Seeing it for yourself

\`\`\`bash
php artisan route:list --except-vendor   # every route, its middleware, its action
\`\`\`

The middleware column of that output *is* step 4 above. When a request behaves in a way you cannot explain, read that table before you read your controller.
        `),
      ],
      [
        q('env(\'STRIPE_KEY\') inside a controller works locally and returns null in production. Why?', [
          'The production server is missing the variable',
          'env() only works in classes that extend Controller',
          'config:cache stops .env being loaded, so env() outside config/ returns null',
          'Laravel encrypts .env in production',
        ], 2, 'Cached config replaces .env entirely, so only config files may call env() — everything else must call config().'),
        q('What does composer install do that composer update does not?', [
          'Installs the exact versions recorded in composer.lock',
          'Resolves the newest versions composer.json permits',
          'Rewrites composer.json with pinned versions',
          'Regenerates only the PSR-4 autoload map',
        ], 0, 'install reproduces the reviewed, tested dependency tree from the lock file; update resolves new versions and rewrites it.'),
        q('array_filter drops the first item of a list and the JSON response breaks the front end. Why?', [
          'array_filter returns null when nothing matches',
          'json_encode cannot serialise filtered arrays',
          'The callback mutated the original array',
          'array_filter preserves keys, so the array serialises as a JSON object',
        ], 3, 'Keys 1,2,3 are no longer sequential from zero, so json_encode emits an object; array_values() restores a list.'),
        q('Where does binding an interface to a concrete class belong?', [
          'boot() on the service provider',
          'register() on the service provider',
          'The controller constructor',
          'public/index.php',
        ], 1, 'register() only declares bindings; boot() runs after all providers are registered and is where you may use other services.'),
      ]
    ),
    chapter(
      'Routing, Controllers, and Blade',
      'Mapping URLs to actions, keeping controllers thin, and rendering HTML that cannot be exploited.',
      [
        lesson('Routing and Route Model Binding', 12, `
Routes are the map from a URL to the code that answers it. \`routes/web.php\` gets sessions, cookies and CSRF protection; \`routes/api.php\` is stateless and prefixed with \`/api\`.

### The verbs

\`\`\`php
use App\\Http\\Controllers\\PostController;

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);
\`\`\`

Browsers only send GET and POST, so a Blade form spoofs the rest with \`@method('PUT')\` — a hidden \`_method\` field the router reads before dispatching.

### Parameters and constraints

\`\`\`php
Route::get('/posts/{post}', ...);            // required
Route::get('/posts/{post}/{tab?}', ...);     // optional — give the argument a default
Route::get('/posts/{post}', ...)->whereNumber('post');
Route::get('/u/{username}', ...)->where('username', '[A-Za-z0-9_]+');
\`\`\`

A failed constraint produces a 404, not a 500: the route simply does not match and the next one gets its chance. That is how \`/posts/create\` and \`/posts/{post}\` coexist.

### Name every route

\`\`\`php
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');

route('posts.edit', $post);                       // /posts/14/edit
// In Blade: <a href="{{ route('posts.edit', $post) }}">Edit</a>
\`\`\`

Hardcoding \`/posts/14/edit\` across twelve templates means twelve edits when the URL structure changes, and one of them will be missed. With names you change a single route line.

### Groups keep it tidy

\`\`\`php
Route::middleware('auth')
    ->prefix('admin')
    ->name('admin.')
    ->controller(PostController::class)
    ->group(function () {
        Route::get('/posts', 'index')->name('posts.index');   // => admin.posts.index
        Route::get('/posts/{post}', 'show')->name('posts.show');
    });
\`\`\`

### Resource routes

\`\`\`php
Route::resource('posts', PostController::class);
\`\`\`

One line, seven routes:

| Method | URI | Action | Name |
|---|---|---|---|
| GET | /posts | index | posts.index |
| GET | /posts/create | create | posts.create |
| POST | /posts | store | posts.store |
| GET | /posts/{post} | show | posts.show |
| GET | /posts/{post}/edit | edit | posts.edit |
| PUT/PATCH | /posts/{post} | update | posts.update |
| DELETE | /posts/{post} | destroy | posts.destroy |

Trim with \`->only(['index', 'show'])\` or \`->except(['destroy'])\`. Memorising those seven names pays off constantly — every Laravel developer reads them instantly, and every tutorial assumes them.

### Route model binding

\`\`\`php
// Instead of: $post = Post::findOrFail($id);
public function show(Post $post)   // the {post} segment is resolved and 404s for you
{
    return view('posts.show', compact('post'));
}
\`\`\`

**The classic mistake:** the URI parameter name and the variable name must match. \`{post}\` binds to \`$post\`. Write \`show(Post $article)\` and Laravel cannot connect them, so you receive a brand-new empty model with no error at all — a genuinely baffling ten minutes.

Bind by something other than the primary key:

\`\`\`php
Route::get('/posts/{post:slug}', [PostController::class, 'show']);

// Or globally, on the model:
public function getRouteKeyName(): string { return 'slug'; }
\`\`\`

Nested parameters do **not** verify the relationship by default — \`/posts/1/comments/999\` will happily load a comment belonging to a different post. Add \`->scopeBindings()\` to the route or group and Laravel resolves the child *through* the parent's relationship.

### Caching

\`\`\`bash
php artisan route:cache     # production; a real speedup on large route files
php artisan route:clear
\`\`\`

\`route:cache\` fails outright if any route uses a closure, because closures cannot be serialised. Point every route at a controller class and caching stays available to you.
        `),
        lesson('Controllers, Requests, and Responses', 12, `
A controller accepts a request, delegates, and returns a response. Holding to those three verbs is most of what separates a maintainable Laravel app from a pile of glue.

### Making them

\`\`\`bash
php artisan make:controller PostController --resource --model=Post
php artisan make:controller PublishPostController --invokable
php artisan make:controller Api/PostController --api    # no create/edit actions
\`\`\`

\`--resource\` stubs the seven actions from the previous lesson. \`--invokable\` produces a single \`__invoke()\` method, which is the right shape for a one-off action:

\`\`\`php
Route::post('/posts/{post}/publish', PublishPostController::class);
\`\`\`

### Reading input

\`\`\`php
public function store(Request $request)
{
    $request->input('title');           // body or query, dot notation for nested keys
    $request->query('page', 1);         // query string only, with a default
    $request->boolean('is_featured');   // "1", "true", "on", "yes" => true
    $request->only(['title', 'body']);  // an explicit subset
    $request->file('cover');            // an UploadedFile instance
    $request->user();                   // the authenticated user, or null
}
\`\`\`

Never trust \`$request->all()\`. Handing it to \`create()\` is the mass-assignment hole covered in Chapter 3; the fix is validation (Chapter 4), which returns only the fields you declared.

### Returning responses

\`\`\`php
return view('posts.index', ['posts' => $posts]);

return redirect()->route('posts.show', $post)
    ->with('status', 'Post created.');   // flash data: survives exactly one request

return back()->withInput();              // back to the form with the fields intact

return response()->json(['data' => $post], 201);
return response()->noContent();          // 204, the right answer to a delete

abort(404);
abort_if($post->user_id !== $request->user()->id, 403);
\`\`\`

\`abort()\` throws an exception Laravel converts into the correct error page — or into a JSON body when the request asked for JSON. You do not assemble error responses by hand.

### Post / Redirect / Get

\`\`\`php
public function store(StorePostRequest $request)
{
    $post = Post::create($request->validated());

    return redirect()->route('posts.show', $post)   // redirect — do NOT return a view
        ->with('status', 'Post created.');
}
\`\`\`

**The classic mistake:** returning \`view(...)\` at the end of a POST action. The URL still points at the POST endpoint, so a refresh offers to resubmit and the user creates a duplicate order. Always answer a successful write with a redirect. The flash message rides along:

\`\`\`blade
@if (session('status'))
    <div class="alert">{{ session('status') }}</div>
@endif
\`\`\`

### Keep actions thin

\`\`\`php
// Doing far too much
public function index(Request $request)
{
    $query = Post::query();
    if ($request->filled('q'))   { $query->where('title', 'like', '%' . $request->q . '%'); }
    if ($request->filled('tag')) { $query->whereHas('tags', fn ($t) => $t->where('slug', $request->tag)); }
    // ...thirty more lines of the same
}

// Better: named scopes on the model (Chapter 3)
public function index(Request $request)
{
    $posts = Post::published()
        ->search($request->query('q'))
        ->latest()
        ->paginate(15)
        ->withQueryString();   // keeps ?q=... attached to the pagination links

    return view('posts.index', compact('posts'));
}
\`\`\`

\`withQueryString()\` is the fix for the bug where page 2 of a filtered list silently forgets the filter — reported as "search is broken" and almost never traced to pagination.

### Injecting dependencies

Type-hint anything the container knows about, in any order, alongside route parameters:

\`\`\`php
public function update(UpdatePostRequest $request, Post $post, Slugger $slugger) { ... }
\`\`\`

Route parameters are matched by name; everything else is resolved from the container described in Chapter 1.
        `),
        lesson('Blade Templating, Layouts, and Components', 13, `
Blade compiles to plain PHP and caches the result, so it costs nothing at runtime. Its real value is escaping by default and a component model that keeps markup out of your controllers.

### Echoing safely

\`\`\`blade
{{ $post->title }}         {{-- escaped: htmlspecialchars is applied --}}
{!! $post->body_html !!}   {{-- raw: NOT escaped --}}
\`\`\`

**The classic mistake:** reaching for \`{!! !!}\` because "the apostrophes look wrong". If that value came from a user and contains a \`<script>\` tag, the raw form executes it in every visitor's browser — stored XSS, and it typically ships because the change looks cosmetic. Use \`{!! !!}\` only for HTML you generated yourself or that has been through a sanitiser such as HTMLPurifier.

### Control structures

\`\`\`blade
@if ($post->published_at)
    <span>Published {{ $post->published_at->diffForHumans() }}</span>
@elseif ($post->scheduled_at)
    <span>Scheduled</span>
@else
    <span>Draft</span>
@endif

@forelse ($posts as $post)
    <x-post-card :post="$post" />
@empty
    <p>No posts yet.</p>
@endforelse

@foreach ($comments as $comment)
    <li @class(['comment', 'comment--first' => $loop->first])>
        {{ $loop->iteration }}. {{ $comment->body }}
    </li>
@endforeach
\`\`\`

\`@forelse\` gives you an empty state for free — the alternative is a wrapping \`@if\` that half your team forgets. \`$loop\` exposes \`first\`, \`last\`, \`index\`, \`iteration\`, \`count\` and \`parent\`.

### Layouts with components

The older \`@extends\` / \`@section\` / \`@yield\` style still works, but components are the modern default:

\`\`\`blade
{{-- resources/views/components/layout.blade.php --}}
@props(['title' => 'My Blog'])

<!doctype html>
<html lang="en">
<head><title>{{ $title }}</title></head>
<body>
    <x-nav />
    <main>{{ $slot }}</main>
    @isset($footer)
        <footer>{{ $footer }}</footer>
    @endisset
</body>
</html>
\`\`\`

\`\`\`blade
{{-- resources/views/posts/index.blade.php --}}
<x-layout title="All posts">
    @foreach ($posts as $post)
        <x-post-card :post="$post" />
    @endforeach

    <x-slot:footer>{{ $posts->links() }}</x-slot:footer>
</x-layout>
\`\`\`

\`{{ $slot }}\` is everything nested inside the tag. \`@props\` declares the attributes a component accepts, with defaults. The colon prefix in \`:post="$post"\` passes a PHP expression; without it you pass the literal string.

Anything you did not declare in \`@props\` lands in \`$attributes\`, which is what keeps a component stylable from outside:

\`\`\`blade
{{-- components/button.blade.php --}}
<button {{ $attributes->merge(['class' => 'btn', 'type' => 'submit']) }}>
    {{ $slot }}
</button>

{{-- <x-button class="btn-danger">Delete</x-button> renders class="btn btn-danger" --}}
\`\`\`

### Forms

\`\`\`blade
<form method="POST" action="{{ route('posts.update', $post) }}">
    @csrf
    @method('PUT')

    <label for="title">Title</label>
    <input id="title" name="title" value="{{ old('title', $post->title) }}">

    @error('title')
        <p class="error">{{ $message }}</p>
    @enderror

    <x-button>Save</x-button>
</form>
\`\`\`

Omit \`@csrf\` and every POST returns **419 Page Expired** — the most common Blade error there is, and the message never mentions the missing directive. \`old('title', $post->title)\` repopulates the field after a failed validation redirect and falls back to the stored value on first load.

### Keep queries out of views

\`\`\`blade
{{-- One extra query per post: the N+1 problem of Chapter 3 --}}
@foreach ($posts as $post)
    <p>{{ $post->author->name }}</p>
@endforeach
\`\`\`

The template looks innocent. The damage was done in the controller that fetched \`$posts\` without \`->with('author')\`. Views read data; they never fetch it — which is exactly why the next chapter starts at the database.
        `),
      ],
      [
        q('A Blade form POSTs to a web route and receives 419 Page Expired. What is missing?', [
          '@method(\'POST\')',
          '@csrf',
          'The route is not registered in routes/web.php',
          'enctype="multipart/form-data"',
        ], 1, 'The web middleware group verifies a CSRF token, and @csrf is what renders the hidden field carrying it.'),
        q('A route defines /posts/{post} and the controller signature is show(Post $article). What happens?', [
          'Laravel matches by type hint and injects the post',
          'A 404 is returned',
          'A TypeError is thrown at runtime',
          'An empty Post model is injected, because binding matches on parameter name',
        ], 3, 'Implicit binding pairs the URI segment name with the variable name; a mismatch silently resolves a fresh, empty model.'),
        q('Why redirect after a successful POST instead of returning a view?', [
          'Refreshing the resulting page would otherwise resubmit the form',
          'Views cannot be returned from POST actions',
          'Redirects render faster than views',
          'Flash messages only work with redirects to the same route',
        ], 0, 'Post/Redirect/Get leaves the browser on a GET URL, so a refresh re-reads instead of re-submitting.'),
        q('A comment body is rendered with {!! $comment->body !!}. What is the risk?', [
          'HTML entities appear as literal text',
          'Blade throws on unescaped output',
          'Stored XSS — a submitted <script> tag runs for every visitor',
          'The page loses its CSRF token',
        ], 2, 'Raw output skips escaping, so user-supplied markup executes; {{ }} applies htmlspecialchars and is the safe default.'),
      ]
    ),
    chapter(
      'Databases: Migrations and Eloquent',
      'Schema you can rebuild from code, models that are safe to mass assign, and relationships that do not melt the database.',
      [
        lesson('Migrations and Schema Design', 13, `
A migration is version control for your database. The schema lives in code, gets reviewed in pull requests, and can be rebuilt from nothing on any machine.

### Creating and running

\`\`\`bash
php artisan make:migration create_posts_table
php artisan migrate                 # run everything pending
php artisan migrate:rollback        # undo the last batch
php artisan migrate:fresh --seed    # drop everything and rebuild — local only
\`\`\`

\`\`\`php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();                                   // BIGINT unsigned, auto-increment
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('title');                        // VARCHAR(255)
        $table->string('slug')->unique();
        $table->text('body');
        $table->timestamp('published_at')->nullable();
        $table->unsignedInteger('views')->default(0);
        $table->timestamps();                           // created_at + updated_at
    });
}

public function down(): void
{
    Schema::dropIfExists('posts');
}
\`\`\`

\`foreignId('user_id')->constrained()\` infers the \`users\` table from the column name and adds a real foreign key. \`cascadeOnDelete()\` removes a user's posts along with the user; \`nullOnDelete()\` keeps them and blanks the owner. Choose deliberately — the default behaviour blocks the delete and surfaces much later as an opaque SQL error during an unrelated feature.

### Column types worth knowing

| Method | SQL | Use for |
|---|---|---|
| \`string('x', 100)\` | VARCHAR(100) | Names, titles, emails |
| \`text\` / \`longText\` | TEXT | Long content |
| \`boolean\` | TINYINT(1) | Flags |
| \`decimal('price', 10, 2)\` | DECIMAL | **Money** |
| \`float\` / \`double\` | FLOAT | Measurements only |
| \`json\` | JSON | Loose structured blobs |
| \`timestamp\` | TIMESTAMP | Dates and times |

Never store money in a \`float\`. Binary floating point cannot represent \`0.1\` exactly, so after a few thousand invoices your totals drift by amounts an accountant will find and you cannot explain. Use \`decimal(10, 2)\`, or store integer minor units.

### Index what you filter on

\`\`\`php
$table->index('published_at');
$table->unique(['user_id', 'slug']);      // composite: unique per author
$table->index(['status', 'created_at']);  // order matters — the leftmost prefix wins
\`\`\`

A \`unique\` index is also your only real defence against a race. Two simultaneous signups both pass an application-level "does this email exist?" check; only the database constraint stops the duplicate row.

### Changing an existing table

\`\`\`bash
php artisan make:migration add_excerpt_to_posts_table --table=posts
\`\`\`

\`\`\`php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->string('excerpt', 300)->nullable()->after('title');
    });
}

public function down(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropColumn('excerpt');
    });
}
\`\`\`

**The classic mistake:** editing a migration that has already run somewhere else. Your local \`migrate:fresh\` picks up the change, so it looks correct; production never will, because the row in the \`migrations\` table already marks that file as done. Once a migration is merged, treat it as immutable — every subsequent change is a new migration.

Two more rules that save real pain:

- A new **non-nullable** column with no default breaks a populated table: PostgreSQL and SQLite reject the migration outright, while MySQL accepts it and quietly backfills every existing row with \`''\` or \`0\`. Add it \`nullable()\`, or give it a \`default()\`.
- Always write \`down()\`. A rollback you cannot run is a deploy you cannot undo.

### Factories and seeders

\`\`\`php
// database/factories/PostFactory.php
public function definition(): array
{
    return [
        'user_id'      => User::factory(),
        'title'        => fake()->sentence(),
        'slug'         => fake()->unique()->slug(),
        'body'         => fake()->paragraphs(3, true),
        'published_at' => fake()->boolean(70) ? now() : null,
    ];
}
\`\`\`

\`\`\`php
Post::factory()->count(50)->create();
Post::factory()->for($user)->has(Comment::factory()->count(3))->create();
\`\`\`

Factories give you realistic local data and, more importantly, the fixtures for the tests in Chapter 5.
        `),
        lesson('Eloquent Models, Queries, and Mass Assignment', 13, `
Eloquent maps a class to a table and an instance to a row. It leans hard on convention: \`App\\Models\\Post\` uses the \`posts\` table, a primary key named \`id\`, and \`created_at\`/\`updated_at\` columns.

### A model with its conventions made explicit

\`\`\`php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Post extends Model
{
    protected $fillable = ['title', 'slug', 'body', 'published_at'];

    protected $casts = [
        'published_at' => 'datetime',
        'meta'         => 'array',        // JSON column <-> PHP array
        'status'       => Status::class,  // the enum from Chapter 1
    ];

    protected $hidden = ['internal_notes'];   // never appears in JSON
}
\`\`\`

Casts are not cosmetic. Without \`'published_at' => 'datetime'\` the attribute is a plain string and \`$post->published_at->diffForHumans()\` throws a fatal error. With it you get a Carbon instance and every date helper works.

### Mass assignment is a security feature

\`\`\`php
Post::create($request->all());   // dangerous the moment $fillable is loosened
\`\`\`

If the table has an \`is_featured\` or \`user_id\` column, a caller can append \`is_featured=1\` to the form body and grant it to themselves. \`$fillable\` is an allow-list: anything not named is silently dropped. \`$guarded = []\` disables the protection entirely — defensible only when you exclusively pass validated data, and still a habit that eventually bites.

Fields the user must never choose are assigned explicitly, through the relationship:

\`\`\`php
$post = $request->user()->posts()->create($request->validated());
\`\`\`

### Reading

\`\`\`php
Post::all();                    // every row — never do this on a real table
Post::find(1);                  // null when missing
Post::findOrFail(1);            // throws ModelNotFoundException => a 404
Post::where('status', 'published')->latest()->take(5)->get();
Post::whereBetween('created_at', [$from, $to])->count();
Post::pluck('title', 'id');     // [1 => 'Hello', 2 => 'World']
\`\`\`

\`get()\` returns a **Collection**, not an array, so \`->map()\`, \`->filter()\`, \`->groupBy()\`, \`->sum('views')\` and \`->values()\` are all available and none of them mutate the source.

**Know when the query actually runs.** \`Post::where(...)\` returns a builder; nothing touches the database until \`get()\`, \`first()\`, \`count()\`, \`paginate()\`, or a \`foreach\`. That is what lets you assemble a query conditionally:

\`\`\`php
$posts = Post::query()
    ->when($request->filled('q'), fn ($qb) => $qb->where('title', 'like', "%{$request->q}%"))
    ->when($request->filled('tag'), fn ($qb) => $qb->where('tag_id', $request->tag))
    ->paginate(15);
\`\`\`

### Scopes name your intent

\`\`\`php
// On the model
public function scopePublished(Builder $query): void
{
    $query->whereNotNull('published_at')->where('published_at', '<=', now());
}

// Anywhere
Post::published()->latest()->get();
\`\`\`

The definition of "published" now lives in exactly one place. Six months later, when it must also exclude posts by suspended authors, you change one method instead of hunting \`whereNotNull('published_at')\` across forty files and missing three.

### Writing

\`\`\`php
$post = Post::create([...]);                 // INSERT
$post->update(['title' => 'New title']);     // fill + save
$post->increment('views');                   // one atomic UPDATE, no race

Post::where('status', 'draft')->update(['status' => 'archived']);   // bulk
\`\`\`

That last line is a single SQL statement. It does **not** load models, so it fires no Eloquent events, runs no observers and applies no mutators. That is exactly what you want for a bulk archive, and exactly what surprises you when an \`updating\` observer mysteriously never runs.

### Soft deletes

\`\`\`php
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;   // requires $table->softDeletes() in a migration
}
\`\`\`

\`\`\`php
$post->delete();                // sets deleted_at
Post::withTrashed()->find(1);   // include soft-deleted rows
Post::onlyTrashed()->get();
$post->restore();
$post->forceDelete();           // actually gone
\`\`\`

Every ordinary Eloquent query then excludes trashed rows automatically. The \`unique\` validation rule does **not** — it runs a plain query-builder count straight against the table, so soft-deleted rows still register as duplicates. That is why a "restore account" feature and a "this email is already taken" error collide in ways that look impossible: the row blocking the signup is the one the user can no longer see. Scope past the tombstone when you need to: \`Rule::unique('users')->whereNull('deleted_at')\`.
        `),
        lesson('Relationships and the N+1 Problem', 14, `
Relationships are the reason to use Eloquent at all. Declare them once and the joins, foreign keys and pivot tables mostly disappear from your day.

### Defining the three you need most

\`\`\`php
class Post extends Model
{
    public function author(): BelongsTo         // posts.user_id -> users.id
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments(): HasMany         // comments.post_id -> posts.id
    {
        return $this->hasMany(Comment::class);
    }

    public function tags(): BelongsToMany       // through a post_tag pivot table
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }
}
\`\`\`

The side that holds the foreign key gets \`belongsTo\`. Laravel guesses the column from the method name, so \`user()\` implies \`user_id\` automatically — but the method above is called \`author()\`, which would imply \`author_id\`, so the column is passed explicitly. That mismatch is a frequent five-minute bug with an unhelpful "column not found" message.

For many-to-many the pivot table name is the two model names, singular, alphabetical, snake case: \`post_tag\`. Create it with a migration holding two \`foreignId\` columns and a \`unique(['post_id', 'tag_id'])\`.

### Using them

\`\`\`php
$post->comments;               // Collection — lazy loads on first access
$post->comments()->count();    // a COUNT query; builds no models
$post->comments()->create(['body' => 'Nice']);   // post_id is filled in for you

$post->tags()->attach($tagId);   // add one pivot row
$post->tags()->detach($tagId);   // remove one
$post->tags()->sync([1, 2, 3]);  // make the set exactly this
\`\`\`

Note the difference: \`$post->comments\` (property) is the loaded collection; \`$post->comments()\` (method) is a query builder you can keep constraining.

### The N+1 problem

\`\`\`php
$posts = Post::latest()->take(50)->get();   // 1 query

foreach ($posts as $post) {
    echo $post->author->name;               // 1 query EACH — 50 more
}
\`\`\`

Fifty-one queries to render one page. With five seed rows locally it is invisible. In production it is the page that takes four seconds and nobody can explain. **This is the most common performance bug in Laravel codebases**, and it usually hides in a Blade template rather than in the controller you are staring at.

Eager loading fixes it:

\`\`\`php
$posts = Post::with('author')->latest()->take(50)->get();
// Two queries total:
//   select * from posts order by created_at desc limit 50
//   select * from users where id in (1, 7, 12, ...)
\`\`\`

The rest of the family:

\`\`\`php
Post::with(['author', 'comments.author'])->get();   // nested
Post::withCount('comments')->get();                 // $post->comments_count, no rows loaded
Post::with(['comments' => fn ($q) => $q->latest()->limit(3)])->get();   // constrained
$posts->load('tags');                               // eager load AFTER fetching
Post::has('comments')->get();                       // only posts that have comments
Post::whereHas('comments', fn ($q) => $q->where('spam', false))->get();
\`\`\`

Use \`withCount\` whenever you only need a number. Hydrating 4,000 comment models to call \`count()\` on them is the second most common version of this bug, and it is worse than the first because the query log looks fine.

### Make it impossible to miss

\`\`\`php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
}
\`\`\`

Any lazy load now throws \`LazyLoadingViolationException\` in development, naming the model and the relation. You find every N+1 the first time you open the page instead of the first week after launch.

### Verify with numbers, not vibes

Install Laravel Debugbar or Telescope in development and watch the query counter as you navigate. A healthy list page issues a small constant number of queries — two to five — whether it renders 10 rows or 100. If the count grows with the row count, you have an N+1.

Beware the opposite mistake too: do not eager load what you never render. \`with('comments')\` on an index page that shows no comments pulls thousands of rows and megabytes of memory for nothing.
        `),
      ],
      [
        q('A page issues 1 query for 50 posts and 50 more for their authors. The fix?', [
          'Add a database index on posts.user_id',
          'Call ->get() later in the request',
          'Cache the rendered view',
          'Post::with(\'author\') — eager load the relation',
        ], 3, 'Eager loading replaces the per-row lookups with a single whereIn query for all the authors at once.'),
        q('Why does Post::create($request->all()) risk privilege escalation?', [
          'all() includes the CSRF token, which corrupts the row',
          'Any column the caller names is written unless $fillable limits it',
          'create() skips the model\'s validation rules',
          'all() returns strings, so booleans are stored incorrectly',
        ], 1, 'Mass assignment writes whatever keys arrive, so an extra is_admin=1 field lands in the database unless an allow-list blocks it.'),
        q('You edit a migration that already ran in production, then redeploy. What happens?', [
          'The column is altered on the next deploy',
          'Laravel detects the change and re-runs the file',
          'Nothing — the migrations table marks it as run, so production never receives the change',
          'The deploy fails with a checksum error',
        ], 2, 'Laravel tracks migrations by filename, not content, so an already-run file is skipped forever; write a new migration instead.'),
        q('An index page needs only the number of comments per post. Best call?', [
          'Post::withCount(\'comments\')',
          'Post::with(\'comments\') then count() in Blade',
          'Post::has(\'comments\')',
          '$post->comments->count() inside the loop',
        ], 0, 'withCount adds a subquery returning comments_count without hydrating a single comment model.'),
      ]
    ),
    chapter(
      'Validation, Authentication, and Middleware',
      'Guarding the boundary: form requests, Breeze auth with policies, and the middleware pipeline.',
      [
        lesson('Validation and Form Requests', 13, `
Validation is the boundary between untrusted input and your database. Laravel gives you two places to do it, and the second one scales.

### Inline, for small actions

\`\`\`php
public function store(Request $request)
{
    $validated = $request->validate([
        'title'        => ['required', 'string', 'max:255'],
        'slug'         => ['required', 'alpha_dash', 'unique:posts,slug'],
        'body'         => ['required', 'string', 'min:50'],
        'published_at' => ['nullable', 'date', 'after_or_equal:today'],
        'tags'         => ['array', 'max:5'],
        'tags.*'       => ['integer', 'exists:tags,id'],
    ]);

    $post = $request->user()->posts()->create($validated);
    // ...
}
\`\`\`

On failure Laravel throws, redirects back, flashes the errors and the old input, and your method body never runs — there is no \`if ($validator->fails())\` to forget. For a request that wants JSON it returns **422** with a structured body instead. Same rules, two behaviours, no branching.

**Use \`$validated\`, not \`$request->all()\`.** \`validate()\` returns exactly the keys you declared, and that return value is what makes mass assignment safe. Validating and then passing \`all()\` to \`create()\` is a real pattern in real code, and it re-opens the hole from Chapter 3 while looking thoroughly responsible.

### Form requests, for anything real

\`\`\`bash
php artisan make:request StorePostRequest
\`\`\`

\`\`\`php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);   // false => 403
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body'  => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return ['body.required' => 'A post needs some content.'];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['slug' => Str::slug($this->title)]);   // runs BEFORE the rules
    }
}
\`\`\`

\`\`\`php
public function store(StorePostRequest $request)   // type-hint it and you are done
{
    $post = Post::create($request->validated());
}
\`\`\`

Type-hinting the form request runs authorisation and then validation before the action executes. The controller shrinks to the thing it always should have been.

### The unique-on-update trap

\`\`\`php
// StoreUserRequest — correct
'email' => ['required', 'email', 'unique:users,email'],

// UpdateUserRequest — the same rule now rejects the user's OWN email
'email' => ['required', 'email', Rule::unique('users')->ignore($this->user)],
\`\`\`

**The classic mistake:** copying the store rules into the update request. Every user then fails to save their profile unless they also change their email, and the message — "email has already been taken" — points at the wrong culprit, so the bug reports read like nonsense. \`ignore()\` excludes the record being edited.

### Rules worth memorising

| Rule | Meaning |
|---|---|
| \`required\` / \`present\` / \`filled\` | must exist and not be empty / must be a key / if present, not empty |
| \`nullable\` | null is allowed — without it, \`null\` fails \`date\`, \`integer\`, and friends |
| \`confirmed\` | requires a matching \`password_confirmation\` field |
| \`exists:tags,id\` | the value must be a real row |
| \`unique:users,email\` | no duplicate |
| \`sometimes\` | only validate when the key is present — built for PATCH |
| \`image\`, \`mimes:pdf\`, \`max:2048\` | uploads — \`max\` is in **kilobytes**, not bytes |

\`nullable\` is position-independent — the validator scans the whole rule list for it, so \`['nullable', 'date']\` and \`['date', 'nullable']\` behave identically. What matters is that it is *there at all*: omit it and a null \`published_at\` fails the \`date\` rule.

### Showing errors

\`\`\`blade
<input name="title" value="{{ old('title') }}">
@error('title') <p class="error">{{ $message }}</p> @enderror
\`\`\`

Without \`old()\`, a user who trips a rule on field seven loses the six fields they already typed — and abandons the form. Validation that punishes the user is a conversion bug as well as a UX one.

### Custom rules

\`\`\`php
'slug' => ['required', function ($attribute, $value, $fail) {
    if (str_contains($value, '--')) {
        $fail('The slug cannot contain a double dash.');
    }
}],
\`\`\`

For anything reused, \`php artisan make:rule NoDoubleDash\` gives you a class you can unit test on its own.
        `),
        lesson('Authentication with Breeze', 12, `
Do not hand-build authentication. Laravel Breeze installs a reviewed, tested implementation of registration, login, password reset, password confirmation and email verification — as editable code inside your app, not a package you must fight.

### Installing

\`\`\`bash
composer require laravel/breeze --dev
php artisan breeze:install blade    # or: livewire, react, vue, api
php artisan migrate
npm install && npm run dev
\`\`\`

You now have working screens at \`/register\`, \`/login\`, \`/forgot-password\` and \`/dashboard\`. Everything Breeze generated is *yours*: controllers in \`app/Http/Controllers/Auth\`, views in \`resources/views/auth\`, routes in \`routes/auth.php\`. Edit them freely.

### What the login controller actually does

\`\`\`php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();            // Auth::attempt() plus rate limiting
    $request->session()->regenerate();   // <-- do not delete this line
    return redirect()->intended(route('dashboard'));
}
\`\`\`

Three details there are worth understanding, because one day you will re-implement them:

- **\`Auth::attempt(['email' => ..., 'password' => ...])\`** looks the user up, runs \`Hash::check()\` against the stored bcrypt hash, and starts the session. You never compare passwords yourself and you never store one — the \`password\` column holds a hash, and the \`hashed\` cast on the User model hashes on assignment.
- **\`session()->regenerate()\`** issues a fresh session id at the moment of login. Without it, an attacker who planted a known session id in a victim's browser still owns that session afterwards — **session fixation**. Breeze includes the line; hand-rolled login code very often does not.
- **\`redirect()->intended()\`** returns the user to the page they originally requested, which the \`auth\` middleware stashed before bouncing them to the login form.

### Protecting routes

\`\`\`php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
});

Route::middleware('password.confirm')->delete('/account', ...);
\`\`\`

\`auth\` requires a logged-in user, \`verified\` requires a confirmed email address, \`password.confirm\` re-prompts for the password before something destructive.

### Using the user

\`\`\`php
$request->user();   // preferred inside controllers — explicit and mockable
auth()->id();
Auth::check();
\`\`\`

\`\`\`blade
@auth
    <span>{{ auth()->user()->name }}</span>
    <form method="POST" action="{{ route('logout') }}">@csrf
        <button>Log out</button>
    </form>
@endauth

@guest
    <a href="{{ route('login') }}">Log in</a>
@endguest
\`\`\`

### Authentication is not authorisation

Being logged in establishes *who*, never *what they may do*. Policies handle the second question:

\`\`\`bash
php artisan make:policy PostPolicy --model=Post
\`\`\`

\`\`\`php
public function update(User $user, Post $post): bool
{
    return $user->id === $post->user_id;
}
\`\`\`

\`\`\`php
use Illuminate\\Foundation\\Auth\\Access\\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;   // Laravel 11+ ships an empty base controller

    public function edit(Post $post)
    {
        $this->authorize('update', $post);   // 403 when denied
    }
}
\`\`\`

That \`use AuthorizesRequests\` line is not optional. Laravel 10 and earlier put the trait on the base \`Controller\`; from Laravel 11 the generated base class is empty, so \`$this->authorize()\` on a fresh app fails with \`Call to undefined method\` until you add it yourself.

\`\`\`blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan
\`\`\`

**The classic mistake:** hiding the Edit button with \`@can\` and never calling \`authorize()\` in the controller. The button disappears; the route does not. Anyone who types \`/posts/9/edit\` edits somebody else's post, and no log line records anything unusual. Hide the UI *and* guard the action — the guard is the security control, the hidden button is only a courtesy.

### The rest of the checklist

Never log, email, or store a plain password. Return the same message for a wrong email and a wrong password, so nobody can enumerate your users. Rate-limit login and password reset — Breeze does, via the \`throttle\` middleware in the next lesson. Serve everything over HTTPS, because a session cookie on an unencrypted connection is a password in transit.
        `),
        lesson('Middleware, CSRF, and Rate Limiting', 12, `
Middleware wraps every request. It is the right home for anything that applies across many routes: authentication, locale, logging, security headers, rate limits.

### Writing one

\`\`\`bash
php artisan make:middleware EnsureUserIsSubscribed
\`\`\`

\`\`\`php
public function handle(Request $request, Closure $next): Response
{
    if (! $request->user()?->subscribed()) {
        return redirect()->route('billing');   // short-circuit: $next never runs
    }

    return $next($request);                    // pass it down the pipeline
}
\`\`\`

**The classic mistake:** forgetting \`return $next($request)\`. The method returns \`null\`, Laravel receives no response, and you spend twenty minutes staring at a blank white page with nothing in the log and nothing in the network tab but a 200 with an empty body.

Work placed before \`$next(...)\` happens on the way in; work after it happens on the way out, when a response already exists:

\`\`\`php
public function handle(Request $request, Closure $next): Response
{
    $start    = microtime(true);
    $response = $next($request);   // the router, controller and view all run here

    return $response->header('X-Duration-Ms', round((microtime(true) - $start) * 1000));
}
\`\`\`

### Registering it

Laravel 11 and 12 configure middleware in \`bootstrap/app.php\`; older versions used \`app/Http/Kernel.php\` with the same concepts:

\`\`\`php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'subscribed' => EnsureUserIsSubscribed::class,
    ]);

    $middleware->append(AddSecurityHeaders::class);   // every request
    $middleware->web(append: [SetLocale::class]);     // the web group only
})
\`\`\`

\`\`\`php
Route::get('/premium', ...)->middleware('subscribed');
Route::get('/admin', ...)->middleware(['auth', 'can:admin']);
\`\`\`

### Parameters

\`\`\`php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    abort_unless(in_array($request->user()->role, $roles, true), 403);

    return $next($request);
}
\`\`\`

\`\`\`php
Route::get('/reports', ...)->middleware('role:admin,manager');
\`\`\`

Everything after the colon is passed as arguments, comma separated.

### The two default groups

| Group | Applied to | Includes |
|---|---|---|
| \`web\` | \`routes/web.php\` | Session, cookies, CSRF verification, shared error bag |
| \`api\` | \`routes/api.php\` | Stateless — no session, no CSRF; route model binding only |

That single difference explains a great deal of confusion. An API route has no session, so \`auth()->user()\` is empty unless a token middleware put it there (Chapter 5). And an API route runs no CSRF check — which is correct, not an oversight. One thing the group does *not* give you in Laravel 11 and 12 is rate limiting: it is opt-in, via \`$middleware->throttleApi()\` in \`bootstrap/app.php\`. Neither \`install:api\` nor the default group adds it for you.

### CSRF, concretely

A cross-site request forgery works like this. You are logged into \`bank.com\`. You visit \`evil.com\`, whose hidden form POSTs to \`bank.com/transfer\`. The browser attaches your session cookie automatically, because that is what browsers do with cookies. The transfer succeeds and you never saw a thing.

Laravel's defence is a per-session token that \`evil.com\` cannot read, thanks to the same-origin policy. \`@csrf\` renders it as a hidden field, the middleware compares it, and a mismatch returns **419**. A token-authenticated API is immune by construction: nothing attaches an \`Authorization\` header on a third party's behalf.

For a JavaScript front end on your own domain, read the \`XSRF-TOKEN\` cookie and send it back as the \`X-XSRF-TOKEN\` header — Axios does this automatically.

### Rate limiting

\`\`\`php
Route::middleware('throttle:60,1')->group(...);   // 60 requests per minute
\`\`\`

\`\`\`php
// A named limiter, keyed per user rather than per IP
RateLimiter::for('uploads', fn (Request $r) =>
    Limit::perMinute(10)->by($r->user()?->id ?: $r->ip())
);
\`\`\`

Rate limiting matters most on login, registration, password reset, and anything that sends an email or costs money. Without it your login form is a credential-stuffing endpoint and your forgot-password form is a free email cannon pointed at whoever an attacker dislikes.
        `),
      ],
      [
        q('A middleware runs its check, passes, and returns nothing. The page is blank. Why?', [
          'It never returns $next($request), so no response is produced',
          'It was registered in the api group instead of web',
          'handle() must be named process()',
          'A blank page always means a 419 token mismatch',
        ], 0, 'Middleware must return the result of $next($request); returning null hands Laravel an empty response.'),
        q('UpdateUserRequest copies unique:users,email from the store request. Users can no longer save their profile. Fix?', [
          'Remove the unique rule entirely',
          'Put nullable before unique',
          'Rule::unique(\'users\')->ignore($this->user)',
          'Validate the email in the controller instead',
        ], 2, 'ignore() excludes the record being edited, so a user\'s own unchanged email no longer counts as a duplicate.'),
        q('You hide the Edit link with @can(\'update\', $post). Is the post protected?', [
          'Yes — @can also blocks the route',
          'No — the route still runs, so the controller must call authorize() as well',
          'Yes, provided a policy class exists',
          'Only when the route uses model binding',
        ], 1, 'Blade directives control display only; the security boundary is the server-side authorisation check in the action.'),
        q('Why do routes in routes/api.php skip CSRF verification?', [
          'APIs are trusted by default',
          'CSRF only applies to GET requests',
          'The token cannot be generated outside Blade',
          'They are stateless — no cookie is attached automatically, so there is nothing to forge',
        ], 3, 'CSRF exists because browsers auto-send cookies; token auth requires an explicit header a third-party site cannot set.'),
      ]
    ),
    chapter(
      'Building a REST API',
      'Resource controllers, JSON you control, token authentication with Sanctum, and tests that catch the dangerous bugs.',
      [
        lesson('API Routes and Resource Controllers', 13, `
An API is the same router, controllers and Eloquent you have used for four chapters — with JSON instead of Blade, and no session.

### Turning the API on

In Laravel 11 and 12, \`routes/api.php\` is not installed by default:

\`\`\`bash
php artisan install:api   # creates routes/api.php and installs Sanctum
\`\`\`

Routes there are automatically prefixed with \`/api\` and receive the stateless \`api\` middleware group from Chapter 4.

### apiResource

\`\`\`php
use App\\Http\\Controllers\\Api\\PostController;

Route::apiResource('posts', PostController::class);
\`\`\`

Five routes, not seven — \`create\` and \`edit\` existed only to render HTML forms:

| Method | URI | Action | Success status |
|---|---|---|---|
| GET | /api/posts | index | 200 |
| POST | /api/posts | store | 201 |
| GET | /api/posts/{post} | show | 200 |
| PUT/PATCH | /api/posts/{post} | update | 200 |
| DELETE | /api/posts/{post} | destroy | 204 |

Nest them only where the relationship is real:

\`\`\`php
Route::apiResource('posts.comments', CommentController::class)->shallow();
// index + store:            /api/posts/{post}/comments
// show, update, destroy:    /api/comments/{comment}
\`\`\`

\`shallow()\` avoids the pointless \`/api/posts/3/comments/91\` — once you hold a comment id, the parent adds nothing but a chance to mismatch them.

### The controller

\`\`\`php
class PostController extends Controller
{
    use AuthorizesRequests;   // Laravel 11+: not inherited from the base controller

    public function index(Request $request)
    {
        return PostResource::collection(
            Post::published()->with('author')->withCount('comments')->latest()->paginate(15)
        );
    }

    public function store(StorePostRequest $request)
    {
        $post = $request->user()->posts()->create($request->validated());

        return (new PostResource($post))->response()->setStatusCode(201);
    }

    public function show(Post $post)          // route model binding still applies
    {
        return new PostResource($post->load('author'));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);    // policies still apply
        $post->update($request->validated());

        return new PostResource($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();

        return response()->noContent();       // 204
    }
}
\`\`\`

Notice what did **not** change: form requests, policies, model binding and eager loading behave exactly as they did on web routes. An API is a different presentation, not a different application.

### Status codes are the contract

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created — return the new resource |
| 204 | Done, nothing to send back |
| 401 | Not authenticated |
| 403 | Authenticated, not allowed |
| 404 | No such resource |
| 422 | Validation failed — Laravel's default for APIs |
| 429 | Rate limited |

**The classic mistake:** returning \`200 OK\` with \`{"success": false}\` in the body. Every HTTP client, cache, retry policy, load balancer and monitoring tool reads the status code and nothing else; burying the failure in the body means none of them can react, your error dashboards stay green during an outage, and callers must parse prose to learn what happened.

### Make errors JSON, always

Laravel chooses between an HTML error page and a JSON body by inspecting the request. A client that forgets \`Accept: application/json\` receives a full HTML error page from an API endpoint and then fails to parse it — reported as "the API returns garbage". Force the behaviour for the whole group:

\`\`\`php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->shouldRenderJsonWhen(fn ($request) => $request->is('api/*'));
})
\`\`\`

A validation failure then always arrives in the shape every Laravel client already expects:

\`\`\`json
{
  "message": "The title field is required.",
  "errors": { "title": ["The title field is required."] }
}
\`\`\`
        `),
        lesson('API Resources, Pagination, and Shaping JSON', 13, `
Returning a model straight from a controller works right up until it does not. \`return $post;\` serialises whatever columns happen to exist, so adding an \`internal_notes\` column silently publishes it and renaming one breaks every client at once.

An **API resource** is an explicit translation layer between your table and your JSON.

### Defining one

\`\`\`bash
php artisan make:resource PostResource
\`\`\`

\`\`\`php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'slug'          => $this->slug,
            'excerpt'       => Str::limit(strip_tags($this->body), 160),
            'published_at'  => $this->published_at?->toIso8601String(),
            'comment_count' => $this->whenCounted('comments'),
            'author'        => new UserResource($this->whenLoaded('author')),
            'links'         => ['self' => route('posts.show', $this->resource)],
        ];
    }
}
\`\`\`

The JSON shape is now a deliberate decision recorded in one file. A column rename is a one-line change here and completely invisible to clients.

### whenLoaded is not a nicety

\`\`\`php
'author' => new UserResource($this->whenLoaded('author')),   // correct
'author' => new UserResource($this->author),                 // an N+1 in waiting
\`\`\`

The second version lazy-loads the author for every item in the collection — the Chapter 3 bug, reintroduced at the serialisation layer where nobody thinks to look for it, because the controller's \`with()\` call is right there and looks correct. \`whenLoaded\` omits the key entirely unless the relation was eager loaded, so the resource can never trigger a query on its own. \`whenCounted('comments')\` pairs the same way with \`withCount('comments')\`.

Conditional fields follow the same pattern:

\`\`\`php
'email' => $this->when($request->user()?->isAdmin(), $this->email),
\`\`\`

### Collections and pagination

\`\`\`php
return PostResource::collection(
    Post::with('author')->latest()->paginate(15)
);
\`\`\`

Passing a paginator through \`::collection()\` produces the envelope automatically:

\`\`\`json
{
  "data": [ { "id": 1, "title": "Hello" } ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": { "current_page": 1, "per_page": 15, "total": 91, "last_page": 7 }
}
\`\`\`

Never return an unbounded \`Post::all()\` from an index endpoint. It is fine against the 40 rows in your seeder and falls over at 400,000 — this is the most common way a Laravel API dies in production, and it dies at exactly the moment the product succeeds. Paginate from the first version, and cap the page size so a caller cannot ask for everything anyway:

\`\`\`php
$perPage = min((int) $request->query('per_page', 15), 100);
\`\`\`

For very large offsets, \`cursorPaginate()\` is dramatically faster than \`paginate()\`, because the database never counts the full set or skips rows. The trade-off is that you lose page numbers.

### The data wrapper

A single resource is wrapped too:

\`\`\`json
{ "data": { "id": 1, "title": "Hello" } }
\`\`\`

Keep it. Consistency between single and collection responses is worth more than the saved keystrokes, and it leaves room to add \`meta\` later without a breaking change. If you must remove it, do it once and globally:

\`\`\`php
JsonResource::withoutWrapping();   // in AppServiceProvider::boot()
\`\`\`

Toggling it per endpoint is how a client ends up maintaining two parsers.

### Response-level metadata

\`\`\`php
return PostResource::collection($posts)->additional([
    'meta' => ['filters_applied' => $request->only('tag', 'q')],
]);
\`\`\`

### Dates and the contract

Serialise dates as ISO 8601 in UTC (\`toIso8601String()\`), never as \`Y-m-d H:i:s\` in the server's local zone. The client formats for its user; the API states an unambiguous instant. Get this wrong and the bugs appear only for users in other time zones, months after launch, and reproduce on nobody's machine.
        `),
        lesson('API Authentication, Tests, and Deployment', 14, `
\`install:api\` already added **Sanctum**, which covers both kinds of API authentication you are likely to need.

### Tokens for mobile apps and third parties

\`\`\`php
// app/Models/User.php
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
}
\`\`\`

\`\`\`php
public function store(Request $request)
{
    $credentials = $request->validate([
        'email'    => ['required', 'email'],
        'password' => ['required'],
        'device'   => ['required', 'string'],
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        // One message for both failures: never reveal which accounts exist
        throw ValidationException::withMessages([
            'email' => ['These credentials do not match our records.'],
        ]);
    }

    return response()->json([
        'token' => $user->createToken($credentials['device'], ['posts:write'])->plainTextToken,
    ], 201);
}
\`\`\`

\`plainTextToken\` is the **only** moment you ever see the token — the database stores a hash of it, exactly like a password. Clients then send \`Authorization: Bearer <token>\` on every request.

\`\`\`php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});
\`\`\`

Abilities scope a token to part of your API, so a token issued for a reporting script cannot delete anything:

Sanctum ships the middleware but registers no alias for it, so name it once in \`bootstrap/app.php\` first:

\`\`\`php
$middleware->alias([
    'abilities' => \\Laravel\\Sanctum\\Http\\Middleware\\CheckAbilities::class,
    'ability'   => \\Laravel\\Sanctum\\Http\\Middleware\\CheckForAnyAbility::class,
]);
\`\`\`

\`\`\`php
Route::post('/posts', ...)->middleware(['auth:sanctum', 'abilities:posts:write']);
\`\`\`

Revocation is a delete: \`$user->tokens()->delete()\` signs out every device.

### Cookies for your own SPA

If your React or Vue front end is served from the same top-level domain, skip tokens entirely: Sanctum's stateful mode uses the ordinary session cookie. The client requests \`/sanctum/csrf-cookie\` once, then logs in normally. Nothing sits in \`localStorage\` for an XSS to steal, which is the strongest argument for this mode.

### Version from day one

\`\`\`php
Route::middleware(['auth:sanctum', 'throttle:120,1'])
    ->prefix('v1')
    ->group(base_path('routes/api_v1.php'));
\`\`\`

Adding a field is backwards compatible; renaming or removing one is not. Without \`/v1\` your only option is to break every client simultaneously.

### Test the contract, not the implementation

\`\`\`bash
php artisan make:test PostApiTest
\`\`\`

\`\`\`php
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;   // a fresh migrated database, rolled back after each test

    public function test_it_lists_only_published_posts(): void
    {
        Post::factory()->count(3)->create(['published_at' => now()]);
        Post::factory()->create(['published_at' => null]);

        $this->getJson('/api/posts')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure(['data' => [['id', 'title', 'slug']], 'meta']);
    }

    public function test_it_rejects_an_invalid_post(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson('/api/posts', ['title' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_a_user_cannot_edit_someone_elses_post(): void
    {
        $post = Post::factory()->create();

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->putJson("/api/posts/{$post->id}", ['title' => 'Hijacked'])
            ->assertForbidden();   // 403, from the policy in Chapter 4
    }
}
\`\`\`

That third test is the one that matters most. Validation bugs are loud and get reported within a day; a missing authorisation check is silent and gets exploited. Write an "other user" test for every endpoint that mutates something a person owns.

### Deploying

\`\`\`bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force   # --force skips the interactive confirmation
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
\`\`\`

Set \`APP_ENV=production\` and \`APP_DEBUG=false\`. Leaving debug on publishes a full stack trace, your loaded environment variables and your database credentials to anyone who can trigger an error — one line of configuration, and it is the most damaging misconfiguration in the entire framework. And remember from Chapter 1: once \`config:cache\` has run, every \`env()\` call outside \`config/\` returns null.
        `),
      ],
      [
        q('A PostResource does new UserResource($this->author) and the index endpoint issues 51 queries. Fix?', [
          'Return the model directly instead of a resource',
          'Add a database index on posts.user_id',
          'Use $this->whenLoaded(\'author\') and eager load in the controller',
          'Cache the JSON response',
        ], 2, 'whenLoaded refuses to trigger a query, so the relation is only serialised when the controller actually eager loaded it.'),
        q('An endpoint returns 200 with {"success": false} when a record is missing. Why is that a problem?', [
          'Laravel cannot generate that response body',
          'It roughly doubles the response size',
          '422 is required for every error',
          'Clients, caches and monitoring read the status code, so the failure is invisible to all of them',
        ], 3, 'HTTP semantics live in the status line; a 200 tells every intermediary the request succeeded.'),
        q('createToken() returns a token object. Which part goes to the client, and when?', [
          'plainTextToken, once — only a hash is stored server-side',
          'The token id, on every request',
          'The whole model, serialised as JSON',
          'plainTextToken, retrievable from the database at any time',
        ], 0, 'Sanctum stores a hash like a password, so the plaintext value exists only in that one response.'),
        q('An index endpoint returns Post::all(); it is fine in staging and times out in production. The fix?', [
          'Add ->with() eager loading',
          'paginate() with a capped per_page',
          'Raise PHP\'s memory limit',
          'Move the route into routes/web.php',
        ], 1, 'Unbounded result sets scale with your data; pagination bounds both the query and the memory used to hydrate it.'),
      ]
    ),
    chapter(
      'Queues, Events, and Scheduled Work',
      'Moving slow work off the request, decoupling with events, and running things on a clock without breaking a deploy.',
      [
        lesson('Queues, Jobs, and Workers', 13, `
A request that sends an email, resizes an image, or calls Stripe makes the user wait for work that has nothing to do with the page they asked for. Queues move that work into a separate process, and the response comes back immediately.

### The driver decides what you actually see

| Driver | What it does | Use it for |
|---|---|---|
| \`sync\` | Runs the job inline, in the request | Nothing — it hides every queue bug |
| \`database\` | A row in a \`jobs\` table | Local development and small single-server apps |
| \`redis\` | A Redis list, with Horizon on top | Production |

**The classic mistake:** leaving \`QUEUE_CONNECTION=sync\` on your machine — it was the framework default before Laravel 11, and it still arrives in every \`.env\` copied from an older project. Every dispatch executes inline, so serialisation problems, a missing worker, and the transaction bug below simply cannot happen locally. They all happen at once on the first deploy. Laravel 11 and 12 default to \`database\` and already ship the \`jobs\` table migration, so \`php artisan migrate\` is all you need — check that your \`.env\` really says \`database\` on day one.

### A job

\`\`\`bash
php artisan make:job SendWelcomeEmail
php artisan queue:work --queue=high,default   # in a second terminal
\`\`\`

\`\`\`php
namespace App\\Jobs;

use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Queue\\Queueable;

class SendWelcomeEmail implements ShouldQueue
{
    use Queueable;              // Laravel 11+: bundles SerializesModels and InteractsWithQueue

    public int $tries     = 3;               // attempts before it is marked failed
    public int $timeout   = 30;              // seconds before the worker kills it
    public array $backoff = [10, 60, 300];   // seconds to wait between attempts

    public function __construct(public User $user) {}

    public function handle(WelcomeMailer $mailer): void   // container injection, Chapter 1
    {
        $mailer->send($this->user);
    }

    public function failed(?Throwable $e): void   // runs after the LAST attempt fails
    {
        Log::error('Welcome email gave up', ['user_id' => $this->user->id]);
    }
}
\`\`\`

\`\`\`php
SendWelcomeEmail::dispatch($user);
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));
SendWelcomeEmail::dispatch($user)->onQueue('high');
\`\`\`

A worker reading \`--queue=high,default\` drains \`high\` completely before it looks at \`default\`, which is how a password-reset email jumps ahead of ten thousand nightly digests.

### Models are not serialised — their ids are

\`Queueable\` pulls in \`SerializesModels\`, which stores the class name and primary key and re-queries the row when the worker picks the job up. So the job always sees the **current** row, not a stale snapshot — and if the row was deleted in the meantime it throws \`ModelNotFoundException\`. Set \`public bool $deleteWhenMissingModels = true;\` when that is a normal outcome rather than an error.

### The classic bug: dispatching inside a transaction

\`\`\`php
DB::transaction(function () use ($request) {
    $order = Order::create($request->validated());
    ChargeCard::dispatch($order);            // the worker may run this BEFORE the commit
});
\`\`\`

The worker is a different OS process with its own database connection. It can pull the job milliseconds later, query for that order id, and find nothing — because the transaction has not committed yet. The failure is intermittent, appears only under load, and is invisible on a \`sync\` connection. The fix is one word:

\`\`\`php
ChargeCard::dispatch($order)->afterCommit();
// or set 'after_commit' => true on the connection in config/queue.php
\`\`\`

### The other classic: the worker is running last week's code

\`queue:work\` boots the framework once and keeps it in memory for speed. Deploying new code changes nothing until the process restarts, so your bug fix is live on the web and absent from the queue. Every deploy script must end with \`php artisan queue:restart\`, which asks workers to exit gracefully after their current job and lets the supervisor start them again on the new code. \`queue:listen\` reboots per job and is for local use only.

### When jobs fail

\`\`\`bash
php artisan queue:failed
php artisan queue:retry all
php artisan queue:forget 9
\`\`\`

Because a timed-out job is retried, **every job must be idempotent**. A charge that ran but timed out before recording itself will run again. Guard with an idempotency key, a \`ShouldBeUnique\` job, or a status check at the top of \`handle()\` — never with the hope that a retry will not happen.
        `),
        lesson('Events, Listeners, and Notifications', 12, `
Events separate *this happened* from *these five things should now occur*. The controller announces a fact; whatever cares subscribes.

### Event and listener

\`\`\`bash
php artisan make:event OrderShipped
php artisan make:listener SendShipmentNotification --event=OrderShipped
\`\`\`

\`\`\`php
class OrderShipped
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order) {}   // an event is just data
}

class SendShipmentNotification implements ShouldQueue    // queued, per the last lesson
{
    public function handle(OrderShipped $event): void
    {
        $event->order->user->notify(new ShipmentDispatched($event->order));
    }
}
\`\`\`

\`\`\`php
OrderShipped::dispatch($order);
\`\`\`

Laravel 11 and 12 discover listeners automatically by scanning \`app/Listeners\` for a type-hinted \`handle()\`, so there is no registration array to forget. \`ShouldQueue\` on the listener pushes it onto the queue, which means every rule from the previous lesson applies — including \`afterCommit\`, since an event dispatched inside a transaction hands its listener the same uncommitted row.

### Model events and observers

\`\`\`bash
php artisan make:observer PostObserver --model=Post
\`\`\`

\`\`\`php
#[ObservedBy(PostObserver::class)]      // Laravel 11+; older versions register in a provider
class Post extends Model { }

class PostObserver
{
    public function saving(Post $post): void
    {
        $post->slug ??= Str::slug($post->title);
    }

    public function updated(Post $post): void
    {
        Cache::forget("post:{$post->id}:rendered");
    }
}
\`\`\`

**The classic mistake:** assuming an observer always runs. Chapter 3 showed that \`Post::where('status', 'draft')->update([...])\` is a single SQL statement that loads no models — so it fires no model events, and neither does a query-builder \`delete()\`, \`insert()\`, or \`increment()\`. A cache that is invalidated in an observer will be stale forever after one bulk update, and nothing in the code looks wrong. If a side effect is genuinely mandatory, enforce it in the database or in an explicit service method rather than in a hook that half the write paths bypass.

### Notifications

\`\`\`bash
php artisan make:notification ShipmentDispatched
\`\`\`

\`\`\`php
class ShipmentDispatched extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];      // one notification, several channels
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your order is on its way')
            ->line("Order #{$this->order->id} shipped today.")
            ->action('Track it', route('orders.show', $this->order));
    }

    public function toArray(object $notifiable): array
    {
        return ['order_id' => $this->order->id];
    }
}
\`\`\`

\`\`\`php
$user->notify(new ShipmentDispatched($order));
Notification::send($admins, new ShipmentDispatched($order));
\`\`\`

The \`database\` channel writes to a \`notifications\` table (\`php artisan make:notifications-table\`), which is where an in-app bell icon gets \`$user->unreadNotifications\` from.

### Mail

\`\`\`bash
php artisan make:mail WelcomeMail --markdown=mail.welcome
\`\`\`

Set \`MAIL_MAILER=log\` locally and read \`storage/logs/laravel.log\` instead of wiring a real SMTP account — and set it deliberately, because a seeder that mails two hundred fake users at real addresses is a mistake you make exactly once.

### Do not turn everything into an event

Events make control flow invisible: nothing in the controller says an email goes out, and a new developer cannot find it by reading the action. Reach for them when several unrelated subsystems must react to one fact, or when an optional side effect must not be able to break the main path. A single always-required step is clearer as a direct method call.
        `),
        lesson('The Scheduler and Long-Running Processes', 12, `
Cron is a fine trigger and a terrible place to keep a schedule. Laravel gives the operating system one entry and keeps the actual timetable in your repository, where it is reviewed and deployed like everything else.

### Defining the schedule

\`\`\`php
// routes/console.php in Laravel 11+; older versions use app/Console/Kernel.php
use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('reports:daily')->dailyAt('02:15')->timezone('Asia/Karachi');
Schedule::job(new PruneOldDrafts)->hourly();
Schedule::call(fn () => Cache::forget('home:stats'))->everyFifteenMinutes();
Schedule::command('backup:run')->weeklyOn(1, '03:00')->emailOutputOnFailure('ops@example.com');
\`\`\`

The operating system gets exactly one line, forever:

\`\`\`
* * * * * cd /var/www/blog && php artisan schedule:run >> /dev/null 2>&1
\`\`\`

\`schedule:run\` wakes every minute, decides what is due, and runs it. **The classic mistake** is adding a crontab entry per task: the schedule file starts lying, the timings drift away from the repository, nobody knows which host owns which job, and the timezone becomes whatever that server happens to think it is. Always set \`->timezone(...)\` explicitly if your business day is not UTC.

### Overlap, and more than one server

\`\`\`php
Schedule::command('reports:daily')
    ->hourly()
    ->withoutOverlapping(120)   // skip if the previous run is still going; lock expires in 120 min
    ->onOneServer()             // only one host in the cluster runs it
    ->runInBackground();
\`\`\`

A report that grows to seventy minutes on an hourly schedule ends up with two copies fighting over the same rows for ten minutes out of every hour, all night, and the symptom is duplicated output, not an error. \`withoutOverlapping()\` prevents that on one host; \`onOneServer()\` prevents it across a cluster — and it requires a **shared** cache driver such as Redis or Memcached, because \`file\` and \`array\` locks are local to one machine and silently let every server run the task.

### Seeing it without waiting

\`\`\`bash
php artisan schedule:list    # every task, its expression, and the next due time
php artisan schedule:run     # run whatever is due right now
php artisan schedule:work    # a foreground loop for local development
\`\`\`

### Keeping the worker alive

\`queue:work\` is a normal process: it exits on a fatal error, on \`queue:restart\`, and on the limits you give it. Something must start it again. On a plain server that is Supervisor:

\`\`\`ini
[program:blog-worker]
command=php /var/www/blog/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
numprocs=2
user=www-data
stopwaitsecs=3600
\`\`\`

Two settings there are not decoration. \`--max-time=3600\` recycles the process every hour, because a long-lived PHP process never quite gives all its memory back. And \`stopwaitsecs\` must exceed your longest job: set it to the default 10 and Supervisor sends SIGKILL ten seconds into a restart, killing a job mid-charge with no \`failed()\` handler ever running.

For Redis queues, **Horizon** replaces most of this — a dashboard, per-queue metrics, auto-balancing and failed-job retries from the browser. On deploy it wants \`php artisan horizon:terminate\` rather than \`queue:restart\`.

### Deploy order

Run migrations, then \`config:cache\`, then restart the workers **last**. Restarting first gives you workers booted on the old code talking to the new schema — a short window in which the queue fails in ways the web requests do not, which is the hardest kind of deploy bug to reproduce afterwards.
        `),
      ],
      [
        q('A job dispatched inside DB::transaction() intermittently throws ModelNotFoundException in production only. Why?', [
          'SerializesModels cannot serialise unsaved models',
          'The transaction rolls back whenever a job is dispatched',
          'The worker is a separate process and can pick the job up before the transaction commits',
          'Queued jobs cannot receive Eloquent models as constructor arguments',
        ], 2, 'The row is invisible to the worker\'s connection until the commit lands, so ->afterCommit() (or after_commit in config) is the fix.'),
        q('You deploy a fix, but queued jobs keep running the previous version of the code. What is missing?', [
          'php artisan queue:restart in the deploy script',
          'php artisan config:clear on the worker host',
          'A higher value for $tries on the job',
          'The job class was not re-registered in a service provider',
        ], 0, 'queue:work keeps the booted application in memory, so workers only pick up new code once they are told to exit and restart.'),
        q('Post::where(\'status\', \'draft\')->update([...]) runs, but PostObserver::updated never fires. Why?', [
          'Observers only fire on create and delete',
          'The observer was registered in register() instead of boot()',
          'update() on a relation fires events but update() on the model itself does not',
          'A bulk builder update is one SQL statement that loads no models, so no model events fire',
        ], 3, 'Model events need hydrated models; a query-builder update bypasses them entirely, which is why observers make unreliable invalidation hooks.'),
        q('How many crontab entries does the Laravel scheduler need for twelve scheduled tasks?', [
          'Twelve — one per task',
          'One — schedule:run every minute decides what is due',
          'One per queue connection',
          'None — the scheduler runs inside the web process',
        ], 1, 'The single schedule:run line is the only OS-level trigger; the timetable itself lives in your repository.'),
      ]
    ),
    chapter(
      'Performance, Testing, and Production Debugging',
      'Making it fast under real data, proving it works before you ship, and finding out what actually broke when it does.',
      [
        lesson('Caching and Query Performance at Scale', 13, `
The N+1 problem from Chapter 3 is only one of the three ways a Laravel page gets slow. The other two are queries the database cannot answer with an index, and work done in PHP that SQL should have done.

### Measure before you change anything

\`\`\`php
// app/Providers/AppServiceProvider.php, boot() — local only
DB::listen(fn ($query) => Log::debug($query->sql, [
    'bindings' => $query->bindings,
    'ms'       => $query->time,
]));
\`\`\`

Now every request leaves a query log with timings. Two numbers matter: **how many** queries a page runs (it should be a constant, not a number that grows with the rows) and **which single query** dominates the total. Optimising anything else is decoration.

For the slow one, ask the database directly:

\`\`\`sql
EXPLAIN SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC LIMIT 15;
\`\`\`

\`type: ALL\` means a full table scan, and \`Using filesort\` means the sort happened in memory after that scan. A composite index fixes both:

\`\`\`php
$table->index(['status', 'created_at']);
\`\`\`

Column order is the whole point, as Chapter 3 noted: this index also serves a query that filters on \`status\` alone, but an index on \`['created_at', 'status']\` serves neither, because the leftmost column is the one the database can seek on.

**The classic mistake:** expecting an index to rescue \`where('title', 'like', '%laravel%')\`. A leading wildcard means the engine cannot know where in the B-tree to start, so it reads every row no matter how many indexes you add. Use a full-text index (\`$table->fullText('title')\` plus \`whereFullText\`) or a real search engine such as Scout with Meilisearch.

### Do not hydrate what you will not use

\`\`\`php
Post::select(['id', 'title', 'slug'])->get();       // three columns, not a TEXT body each

Order::where('user_id', $id)->sum('total');         // one row comes back
$user->orders->sum('total');                        // hydrates every order into memory
\`\`\`

For long-running jobs (Chapter 6), never load the whole table:

\`\`\`php
Post::where('processed', false)->chunkById(500, function ($posts) {
    foreach ($posts as $post) {
        $post->update(['processed' => true]);
    }
});
\`\`\`

**The classic bug** here is \`chunk()\` instead of \`chunkById()\` when the loop modifies the column being filtered on. \`chunk()\` pages with \`OFFSET\`: page one processes rows 1-500, those rows leave the result set, and page two asks for offset 500 of a set that has shifted 500 places — so it skips the next 500 rows entirely. The job reports success having quietly processed half the data. \`chunkById()\` pages on the primary key with \`where id > ?\`, so it cannot skip anything.

### Cache

\`\`\`php
$stats = Cache::remember('home:stats', now()->addMinutes(10), fn () => [
    'posts'   => Post::published()->count(),
    'authors' => User::has('posts')->count(),
]);

Cache::forget('home:stats');
\`\`\`

\`remember\` is get-or-compute-and-store in one call. The driver matters as much as it does for queues: \`file\` and \`database\` work but are slow under concurrency and support no tags; \`redis\` or \`memcached\` are the real answers, and \`array\` is what your tests should use.

**Cache invalidation is where this goes wrong.** Cache things that are expensive *and* tolerant of being a few minutes stale. Put the identity and a version in the key — \`"post:{$post->id}:rendered:v2"\` — so a shape change cannot serve a stale payload to a new parser. And prefer a short TTL you can reason about over a perfect invalidation scheme you will get wrong the first time someone adds a bulk update (Chapter 6, lesson 2).

One more failure mode worth naming: when a hot key expires under load, every in-flight request recomputes it simultaneously — a **cache stampede** that hits the database harder than having no cache at all. Wrap the rebuild in \`Cache::lock('home:stats:build', 10)\` so only one request does the work.

### The caches Laravel ships

\`\`\`bash
php artisan optimize        # config + routes + views + events, in one command
php artisan optimize:clear
\`\`\`

These are free and enormous compared to anything you will hand-tune, which is why Chapter 5's deploy script runs them — and why, per Chapter 1, \`env()\` outside \`config/\` stops working the moment they do.
        `),
        lesson('Testing What Actually Breaks', 14, `
Chapter 5 wrote three API tests. This is how you grow that into a suite you still trust in six months.

### Aim where the value is

Feature tests that drive a real HTTP request through routing, middleware, validation, policies and the database buy more confidence per line than anything else in Laravel. Unit tests are for logic with branches and no I/O — the \`PriceCalculator\` from Chapter 1, a custom validation rule, a tax table. What you do not test is the framework: nobody needs a test proving \`create()\` writes a row.

### Setup

\`\`\`php
class PostTest extends TestCase
{
    use RefreshDatabase;   // migrate once, wrap each test in a transaction, roll it back
}
\`\`\`

An in-memory SQLite database makes the suite fast, and \`--parallel\` free, but it is **not** the database you deploy on. JSON columns, strict mode, and unique-index behaviour all differ. Run the same suite against MySQL or PostgreSQL in CI, or you will ship a migration that only your laptop accepts.

### The assertions you will use constantly

\`\`\`php
public function test_an_author_can_publish_a_post(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('posts.store'), [
            'title' => 'Hello',
            'body'  => str_repeat('a ', 40),
        ])
        ->assertRedirect()
        ->assertSessionHas('status');

    $this->assertDatabaseHas('posts', ['title' => 'Hello', 'user_id' => $user->id]);
    $this->assertDatabaseCount('posts', 1);
}
\`\`\`

\`assertSessionHasErrors(['title'])\`, \`assertModelMissing($post)\`, \`assertGuest()\` and \`assertForbidden()\` cover most of the rest. Note \`actingAs()\` — testing an endpoint only as its owner is how authorisation holes survive a green suite.

### Fake the outside world

\`\`\`php
Queue::fake();
Mail::fake();
Http::fake(['api.stripe.com/*' => Http::response(['id' => 'ch_1'], 200)]);
Storage::fake('public');

$this->post(route('orders.store'), $payload);

Queue::assertPushed(ChargeCard::class, fn ($job) => $job->order->is($order));
Mail::assertQueued(ReceiptMail::class);
Storage::disk('public')->assertExists('receipts/1.pdf');
\`\`\`

A test suite must never reach a real third-party API: it is slow, it fails when their staging is down, and one day it charges a live card.

**The classic mistake:** calling \`Queue::fake()\` and then asserting the *effect* of the job. The fake stops the job from running, so the charge never happens and the assertion fails in a way that reads like a bug in your code. Split it in two — assert here that the job was pushed with the right payload, and test the work itself directly:

\`\`\`php
(new ChargeCard($order))->handle($gateway);   // no queue involved at all
\`\`\`

### Control time

\`\`\`php
$this->freezeTime();
$this->travelTo(now()->addDays(31));
$this->assertTrue($subscription->fresh()->expired());
\`\`\`

Anything that waits, expires, or throttles is untestable until you can move the clock. Never \`sleep()\` in a test.

### What to write first

1. The authorisation test for every endpoint that mutates something someone owns — the "other user gets 403" case from Chapter 5.
2. The validation boundary: the shortest input that must be rejected.
3. Anything involving money or permissions.
4. A regression test for every bug you fix. Reproduce it in a failing test *before* touching the code, so you know the test can actually detect it.

### Running them

\`\`\`bash
php artisan test --filter=PostTest
php artisan test --parallel
\`\`\`

Wire \`php artisan test\` into CI on every pull request. A suite that only runs when someone remembers is a suite that is already red.
        `),
        lesson('Logging, Debugging, and the Production Checklist', 13, `
When something breaks in production you cannot add a \`dd()\` and refresh. What you can do is read a log that was written to be read.

### Log with context, not with prose

\`\`\`php
Log::info('Order placed', ['order_id' => $order->id, 'user_id' => $user->id, 'total' => $order->total]);

Log::withContext(['request_id' => (string) Str::uuid()]);   // attaches to every later line
\`\`\`

An interpolated sentence such as \`Log::info("Order {$order->id} placed")\` is unsearchable; the array form is filterable by any log tool you later adopt. Never log passwords, tokens, session ids, or full card numbers — a log file is a database with no access control, and it gets copied to laptops.

### Channels

| Channel | Behaviour | Use for |
|---|---|---|
| \`single\` | One file, forever | Nothing in production |
| \`daily\` | One file per day, pruned after \`LOG_DAILY_DAYS\` | Traditional servers |
| \`stderr\` | Writes to standard error | Containers, where the platform collects it |
| \`slack\` / \`sentry\` | Pushes somewhere people look | \`critical\` and above |

**The classic mistake:** shipping with the \`single\` driver. \`storage/logs/laravel.log\` grows without limit until the disk fills, and then the whole application returns 500s for a reason that has nothing to do with the code you last deployed. Set \`LOG_LEVEL=info\` too — \`debug\` in production is noise you pay to store and then cannot search.

### Exceptions

\`\`\`php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->dontReport([OutOfStockException::class]);     // expected, not an incident

    $exceptions->render(function (ThrottleRequestsException $e, $request) {
        return $request->is('api/*')
            ? response()->json(['message' => 'Slow down.'], 429)
            : null;                                            // null = fall through to default
    });
})
\`\`\`

\`report($e)\` logs an exception and carries on, which is the right call for a side effect that failed but must not fail the request. Point the reporter at Sentry or Bugsnag: a log file nobody opens is not monitoring, and the first person who should learn about a 500 is you, not a customer.

### Tools, in the order you should reach for them

- \`php artisan about\` — environment, drivers, and which caches are active. Answers "is this even the configuration I think it is?"
- \`php artisan route:list --except-vendor\` and \`php artisan schedule:list\` — the map, from Chapters 1 and 6.
- **Telescope** on local and staging: every request, query, job and exception with its payload. Never leave it open in production; it stores request bodies.
- \`php artisan tinker\` against a copy of the data — reproduce the query in isolation.
- \`dd()\` and \`dump()\` for the fast case; Xdebug when the interesting state is three frames up the stack.
- \`php artisan queue:failed\` before you assume the queue ran at all (Chapter 6).

### The production checklist

\`\`\`bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
php artisan queue:restart      # or horizon:terminate — always LAST
\`\`\`

And the settings around it:

- \`APP_ENV=production\`, \`APP_DEBUG=false\`. Chapter 5 called this the most damaging misconfiguration in the framework; verify it on *every* environment, not just the one you deployed most recently.
- Document root on \`public/\`, and \`storage/\` plus \`bootstrap/cache\` writable by the web user (Chapter 1).
- Behind a load balancer, trust the proxy (\`$middleware->trustProxies(at: '*')\`) or every generated URL comes out \`http://\` and your HTTPS redirect becomes a loop.
- Exactly one host runs the scheduler cron entry; \`onOneServer()\` guards the rest (Chapter 6).
- \`php artisan down --secret=...\` for a maintenance window you can still browse yourself.
- Backups that have been **restored** at least once. An untested backup is a belief, not a backup.
        `),
      ],
      [
        q('A nightly job filters on processed=false and sets it to true, using chunk(500). It finishes early having handled half the rows. Why?', [
          'chunk() stops as soon as a callback returns null',
          'chunk() pages with OFFSET, so rows leaving the result set shift every later page',
          'The update fires model events that re-run the query',
          '500 exceeds the default query result limit',
        ], 1, 'Rows dropping out of the filtered set move everything left, so each OFFSET skips a page — chunkById() pages on the primary key and cannot.'),
        q('A title search using like \'%laravel%\' is slow, and adding an index on title changes nothing. Why?', [
          'LIKE queries are always executed in PHP',
          'The index was created after the rows already existed',
          'Eloquent ignores indexes on string columns',
          'A leading wildcard gives the B-tree no prefix to seek on, so every row is read',
        ], 3, 'B-tree indexes are ordered by prefix; without a known starting prefix the engine must scan, which is why full-text indexes and search engines exist.'),
        q('A test calls Queue::fake(), posts an order, then asserts the card was charged. It fails. Why?', [
          'Queue::fake() rolls back the database transaction',
          'actingAs() must be called before Queue::fake()',
          'The fake records the dispatch instead of running the job, so its effects never happen',
          'Fakes only work on the sync connection',
        ], 2, 'A queue fake intercepts dispatches, so you assert the push here and call the job\'s handle() directly in its own test.'),
        q('Production returns 500s across the whole app and the disk is full. The most likely logging cause?', [
          'The single channel wrote one laravel.log file that never rotates',
          'LOG_LEVEL was set to error instead of debug',
          'Log::withContext() duplicated every line',
          'The stderr channel is unsupported on Linux',
        ], 0, 'The single driver appends forever, so the log grows until the volume fills and unrelated writes start failing; daily or stderr bounds it.'),
      ]
    ),
  ],
  final: [
    q('A deployed app gets null from env(\'MAIL_KEY\') inside a mailer class, but it works locally. Cause?', [
      '.env is missing from the server',
      'config:cache stops .env from loading — read config() outside config files',
      'The mailer runs before service providers boot',
      'env() requires strict_types',
    ], 1, 'Cached configuration replaces .env at runtime, so env() is only valid inside config/ files.'),
    q('Which line makes a store action safe from mass assignment?', [
      'Post::create($request->validated())',
      'Post::create($request->all())',
      'Post::create($request->input())',
      'Post::forceCreate($request->all())',
    ], 0, 'validated() returns only the keys the rules declared, so no unexpected column can be written.'),
    q('foreignId(\'user_id\')->constrained()->cascadeOnDelete() — what happens when that user is deleted?', [
      'The delete is blocked by the constraint',
      'user_id is set to null',
      'Nothing; the rule is enforced only in PHP',
      'That user\'s rows in the child table are deleted too',
    ], 3, 'cascadeOnDelete tells the database to remove dependent rows, so no orphans remain.'),
    q('A Blade loop prints $post->author->name for 100 posts. What appears in the query log?', [
      '1 query',
      '2 queries',
      '101 queries — the N+1 pattern',
      '100 queries plus a join',
    ], 2, 'One query fetches the posts and each iteration lazy-loads its author; with(\'author\') reduces it to two.'),
    q('Which Blade output is safe for user-submitted text?', [
      '{{ $comment->body }}',
      '{!! $comment->body !!}',
      '@php echo $comment->body @endphp',
      '<?= $comment->body ?>',
    ], 0, 'Double braces run the value through htmlspecialchars; the other three emit raw markup.'),
    q('What does session()->regenerate() immediately after a successful login prevent?', [
      'Duplicate form submission',
      'CSRF token mismatch errors',
      'Cookie size overflow',
      'Session fixation — a pre-planted session id surviving the login',
    ], 3, 'A new session id at login means any id an attacker planted beforehand is worthless.'),
    q('Route::apiResource registers how many routes, and which does it drop versus Route::resource?', [
      '7; it drops store and update',
      '5; it drops create and edit, which only rendered HTML forms',
      '6; it drops edit and destroy',
      '5; it drops index and show',
    ], 1, 'An API has no form pages, so the two GET routes that existed to render forms are unnecessary.'),
    q('A middleware performs its check and returns nothing when the check passes. Symptom?', [
      '419 Page Expired',
      '403 Forbidden',
      'An empty response, because $next($request) was never returned',
      'The middleware runs twice per request',
    ], 2, 'The pipeline needs the response returned back up through it; returning null yields an empty body.'),
    q('You need to change a column defined in a migration that already ran in production. What do you do?', [
      'Run migrate:fresh on production',
      'Run migrate:rollback then migrate',
      'Nothing — Laravel re-runs files whose contents changed',
      'Write a new migration; already-run migrations are immutable',
    ], 3, 'Laravel tracks migrations by filename, so an executed file is never re-run — the change must be a new file.'),
    q('Why does storing money in a float column eventually corrupt totals?', [
      'Binary floating point cannot represent decimal fractions exactly, so rounding errors accumulate',
      'MySQL floats are limited to six digits overall',
      'Eloquent casts floats to strings on save',
      'Float columns cannot be indexed',
    ], 0, 'Values like 0.1 have no exact binary representation, so repeated arithmetic drifts; decimal or integer minor units do not.'),
    q('A job dispatched inside DB::transaction() intermittently fails with ModelNotFoundException. The fix?', [
      'Add $deleteWhenMissingModels = true to the job',
      'Increase $tries so a retry eventually finds the row',
      'Dispatch after the commit — ChargeCard::dispatch($order)->afterCommit()',
      'Pass an array of attributes instead of the model',
    ], 2, 'The worker has its own connection and cannot see uncommitted rows, so the dispatch must wait for the transaction to land.'),
    q('Your deploy ships a bug fix, but queued jobs keep executing the old code. What is missing?', [
      'php artisan queue:restart at the end of the deploy',
      'php artisan migrate --force',
      'A larger $tries value on every job class',
      'php artisan event:cache',
    ], 0, 'queue:work holds the booted application in memory, so workers keep running the code they started with until they are told to exit.'),
    q('A job filters on processed=false, sets it to true, and pages with chunk(500). Half the rows are silently skipped. Why?', [
      'The callback returned false and stopped the loop',
      'Model events re-queued the rows',
      'chunk() loads every row into memory and runs out',
      'chunk() pages with OFFSET, and rows leaving the result set shift every later page',
    ], 3, 'Each processed page drops out of the filtered set, so the next offset lands past unprocessed rows; chunkById() keys on the primary key instead.'),
    q('Twelve tasks are registered in the Laravel scheduler. How many crontab entries does the server need?', [
      'Twelve, one per task',
      'One — * * * * * php artisan schedule:run',
      'One per command that uses onOneServer()',
      'None, because the scheduler runs inside the web process',
    ], 1, 'schedule:run wakes every minute and decides what is due, which keeps the timetable in your repository rather than in crontab.'),
  ],
});
