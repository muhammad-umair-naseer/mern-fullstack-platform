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
        `,
        [
          q('A helper is declared discount(float $price, int $percent) and the file has no declare(strict_types=1). A form submits price as the string \'100\'. What happens?', [
            'A TypeError is thrown before the body runs',
            'The string is coerced to 100.0 and the call succeeds',
            '$price arrives as the string \'100\' unchanged',
            '$price is set to null and a warning is logged',
          ], 1, 'Without strict types PHP coerces numeric strings at the parameter boundary, so plausible looking input passes silently and only a wholly non-numeric value is refused.'),
          q('Why does match() surface bugs that switch() lets through unnoticed?', [
            'match compares loosely, so fewer values slip past it',
            'match evaluates all of its arms before returning',
            'match compares with === and throws when nothing matches',
            'match forbids default arms, so gaps become obvious',
          ], 2, 'There is no fall through and no silent null: an unmatched value raises UnhandledMatchError, so a case you forgot fails loudly instead of returning nothing.'),
          q('A CSV import calls Status::from(\'publised\') on a row where somebody mistyped the status. What is the result?', [
            'A ValueError is thrown on that row',
            'null comes back and the row is skipped',
            'Status::Draft is returned as the fallback',
            'The typo is stored as the enum\'s value',
          ], 0, 'from() refuses any value outside the declared cases and throws, which is why tryFrom() exists for the times you want null instead of an exception.'),
        ]
      ),
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
        `,
        [
          q('A model resolves fine on your Mac and throws Class "App\\Models\\post" not found on the Linux server. What went wrong?', [
            'The filename case does not match the class name',
            'Composer builds its autoload map only in production',
            'PSR-4 requires the class to be required manually',
            'The namespace has to be lowercase on Linux hosts',
          ], 0, 'PSR-4 resolves a class to an exact file path, and Linux filesystems are case sensitive where macOS and Windows are not, so the mismatch only appears on the server.'),
          q('You fix a bug by editing a file inside vendor/ and the application starts working. What happens next?', [
            'Composer refuses to install until you revert it',
            'The edit is copied into your app/ folder on install',
            'The lock file pins the file, so the fix persists',
            'The next composer install overwrites your change',
          ], 3, 'vendor/ is generated from the lock file and git ignored, so any edit there disappears on the next install; the supported routes are a fork or a patch file.'),
          q('A server has its document root pointed at the project folder rather than public/. Why does that matter?', [
            'Blade templates are served as plain text files',
            'Routes defined in routes/web.php stop resolving',
            'Artisan can no longer write into storage/',
            'Anyone can fetch .env and read the database password',
          ], 3, 'Only public/ is meant to be reachable over HTTP, so a document root one level up exposes .env, storage/ and everything else to whoever guesses the URL.'),
        ]
      ),
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
        `,
        [
          q('Cache::put(\'key\', \'value\', 60) looks like a static call. Why is it still straightforward to fake in a test?', [
            'The facade resolves an instance from the container',
            'PHPUnit is able to override static methods directly',
            'Laravel recompiles facades in the testing environment',
            'Static calls are skipped whenever APP_ENV is testing',
          ], 0, 'A facade is a thin proxy that looks the service up in the container and calls the method on that object, so a test can bind a mock in its place.'),
          q('A request arrives for a URL that matches no route at all. Which of these has already run by the time the 404 is produced?', [
            'The web middleware group for that route',
            'The constructor of the matching controller',
            'Global middleware, such as the maintenance mode check',
            'Nothing, because routing happens before any middleware',
          ], 2, 'Global middleware wraps every request before the router tries to match it, so those layers run even when no route is found.'),
          q('A controller returns a view and never touches cookies, yet the response carries a session cookie. Why?', [
            'public/index.php appends cookies to every response',
            'The response passes back out through the middleware in reverse',
            'Blade attaches the cookie while it renders the template',
            'The router copies any cookie found on the request',
          ], 1, 'Middleware wraps the action on the way in and on the way out, so the session layer sees the finished response and attaches the cookie on its way back.'),
        ]
      ),
            lesson('Traits, Interfaces, and Composition in PHP', 13, `
One line, three words, and every query your application will ever run changes shape:

\`\`\`php
class Post extends Model
{
    use SoftDeletes;
}
\`\`\`

You called nothing. You overrode nothing. Yet \`Post::all()\` now quietly appends \`where deleted_at is null\` to its SQL. Working out how that happens is working out traits, and Laravel is built out of them.

### A trait is copy and paste the compiler does for you

\`\`\`php
trait Sluggable
{
    public function slug(): string
    {
        return Str::slug($this->title);
    }
}

class Post extends Model
{
    use Sluggable;   // slug() is now literally part of Post
}
\`\`\`

PHP flattens the trait into the class at compile time, as if you had typed the method there yourself. Two consequences follow, and both catch people out.

A method defined directly in the class wins over the trait version, with no warning. So if \`Post\` already has its own \`slug()\`, adding \`use Sluggable\` does nothing at all and the file looks correct.

And two traits offering the same method name is a fatal error, not a merge:

\`\`\`php
class Report
{
    use ExportsCsv, ExportsPdf;   // both define export(): PHP Fatal error
}
\`\`\`

You resolve it by hand, which is also how you keep both:

\`\`\`php
class Report
{
    use ExportsCsv, ExportsPdf {
        ExportsCsv::export insteadof ExportsPdf;
        ExportsPdf::export as exportPdf;
    }
}
\`\`\`

### How SoftDeletes actually hooks in

Eloquent's boot process walks every trait the model uses and calls a static method named \`boot\` plus the trait name, if one exists:

\`\`\`php
trait SoftDeletes
{
    public static function bootSoftDeletes(): void
    {
        static::addGlobalScope(new SoftDeletingScope);
    }
}
\`\`\`

That convention is the whole mechanism, and it is available to you:

\`\`\`php
trait TracksLastEditor
{
    public static function bootTracksLastEditor(): void
    {
        static::saving(fn ($model) => $model->last_editor_id = auth()->id());
    }
}
\`\`\`

Misspell it as \`bootTrackLastEditor\` and you get no error, no warning, and no behaviour. The method is just an ordinary unused method on the class. Every hour lost to that bug ends with someone counting the letters in the trait name character by character.

### Interfaces are types, traits are code

An interface carries no bodies. What it buys you is a name the type system recognises:

\`\`\`php
interface Payable
{
    public function amountDue(): int;
}

class Invoice extends Model implements Payable
{
    public function amountDue(): int
    {
        return $this->total_cents;
    }
}
\`\`\`

| Question | Trait | Interface |
|---|---|---|
| Supplies working code | Yes | No |
| Passes \`instanceof\` | No | Yes |
| Several per class | Yes | Yes |
| Name clash between two | Fatal until resolved | Fine, signatures must agree |

Laravel leans on both at once. \`ShouldQueue\` is an interface with zero methods: the framework only ever asks \`$job instanceof ShouldQueue\` to decide whether to run something now or push it. The code that makes queueing work arrives separately, from a trait. Contract for the decision, trait for the implementation.

That split is why you type-hint \`Payable\` in a method signature and never \`Invoice\`. A \`Subscription\` that implements \`Payable\` then slots in without touching the method.

### Make a trait state its demands

\`\`\`php
trait ChargesTax
{
    abstract public function taxRate(): float;

    public function withTax(int $cents): int
    {
        return (int) round($cents * (1 + $this->taxRate()));
    }
}
\`\`\`

Any class using \`ChargesTax\` must define \`taxRate()\` or PHP refuses to compile it. Compare that with a trait that reaches for \`$this->tax_rate\` and hopes the property exists: the first version fails when you save the file, the second fails on a Tuesday in production.

One last trap. A static property declared in a trait is created fresh for each class that uses it, so \`Post\` and \`Comment\` get separate copies rather than a shared one. That is usually what you want for a per-model cache, and a genuine shock the day you try to use it as a global counter.
      `,
        [
          q('A Report class uses two traits, ExportsCsv and ExportsPdf, and both declare an export() method. What does PHP do?', [
            'The first trait in the use list wins the name',
            'Compilation fails unless insteadof resolves the clash',
            'Both methods run in the order the traits are listed',
            'The last trait silently overrides the earlier one',
          ], 1, 'Traits are flattened into the class, so two identical method names collide as a fatal error until you pick one with insteadof and optionally alias the other.'),
          q('You add a static bootTrackLastEditor() method to a trait named TracksLastEditor and no saving hook ever fires. Why?', [
            'Eloquent throws a missing hook error while booting',
            'The hook fires anyway, since matching ignores case',
            'The hook registers only after php artisan optimize runs',
            'The name must be boot plus the exact trait name',
          ], 3, 'Eloquent looks for a method called boot followed by the literal trait name, so a single wrong letter leaves an ordinary unused method that nothing ever calls.'),
          q('ShouldQueue declares no methods whatsoever. Why is it an interface rather than a trait?', [
            'Interfaces are resolved faster than traits at runtime',
            'Traits cannot legally be applied to job classes',
            'The framework only needs an instanceof check to decide',
            'It allows the queue to call handle() statically',
          ], 2, 'The framework only has to ask whether the object is of that type before deciding to push it, and the code that does the queueing arrives separately from a trait.'),
        ]
      ),
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
        `,
        [
          q('A route declares /posts/{post}/comments/{comment} and a request for /posts/1/comments/999 loads a comment belonging to a different post. What fixes it?', [
            'Add ->scopeBindings() so the child resolves via the parent',
            'Constrain both segments with whereNumber() on the route',
            'Rename the second segment to {post_comment} in the URI',
            'Bind the comment by its slug rather than its primary key',
          ], 0, 'Nested implicit binding looks each model up independently by default, and scopeBindings makes Laravel resolve the comment through the post\'s own relationship.'),
          q('php artisan route:cache fails on your deploy server but a teammate insists it works for them. What is the most likely cause?', [
            'A route file was edited after the cache was built',
            'One route points at a closure, which cannot be serialised',
            'Two routes were given the same name in a group',
            'The api routes are missing their /api prefix',
          ], 1, 'Route caching serialises the route table, and a closure has no serialisable form, so every route has to point at a controller class for caching to work.'),
          q('/posts/{post} is constrained with whereNumber(\'post\') and /posts/create is registered after it. What does a request for /posts/create do?', [
            'Returns a 500, because create is not an integer',
            'Matches the first route and passes $post as null',
            'Falls through to /posts/create, since the constraint failed',
            'Returns 404, because the first route claimed that URI',
          ], 2, 'A failed constraint means the route simply does not match, so the router carries on down the list and the literal route gets its chance.'),
        ]
      ),
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
        `,
        [
          q('Users report that search is broken: page one is filtered correctly and page two shows every record. What is missing from the controller?', [
            'The filter should live in a model scope instead',
            'The query builder has to be rebuilt for each page',
            'The form ought to submit with POST rather than GET',
            'The paginator is missing a call to withQueryString()',
          ], 3, 'Pagination links only carry the page number by default, so the ?q= parameter is dropped on page two until withQueryString() reattaches the current query string.'),
          q('A JSON API action deletes a record and has nothing meaningful to send back. Which response is the right one?', [
            'response()->json([\'ok\' => true], 200)',
            'response()->noContent()',
            'redirect()->route(\'posts.index\')',
            'response()->json([], 201)',
          ], 1, 'noContent() returns a 204, which is the status that means the request succeeded and there is deliberately no body to read.'),
          q('An action calls abort_if($post->user_id !== $request->user()->id, 403) and a mobile client sent Accept: application/json. What does the client receive?', [
            'An HTML error page, whatever the Accept header says',
            'A 500, because abort cannot be used inside an action',
            'A JSON body with a 403 status, matching the request',
            'A redirect to the login route carrying a flash message',
          ], 2, 'abort() throws an HTTP exception that Laravel\'s handler renders in the format the request asked for, so the same line serves browsers and API clients.'),
        ]
      ),
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
        `,
        [
          q('A template writes <x-post-card post="$post" /> and the card renders the literal text $post. What went wrong?', [
            'The component has to declare post inside @props',
            'The attribute value needs {{ }} braces around it',
            'The colon prefix is missing, so a string was passed',
            'Components accept arrays only, never model instances',
          ], 2, 'Without the colon the attribute is a literal string, and :post="$post" is what tells Blade to evaluate the value as a PHP expression.'),
          q('A button component declares no class prop, yet <x-button class="btn-danger">Delete</x-button> renders class="btn btn-danger". How?', [
            'Blade concatenates duplicate class attributes on its own',
            'Anything undeclared arrives in $attributes and is merged',
            '@props copies unknown attributes onto the root element',
            'The slot carries the attribute list into the component',
          ], 1, 'Attributes that are not named in @props collect in the $attributes bag, and $attributes->merge() combines them with the component\'s own defaults.'),
          q('A long form fails validation on its last field, and the six answers the user already typed are still there when the page reloads. What is responsible?', [
            'The web middleware group replays the original request',
            '@error puts each field\'s previous value back in place',
            'The browser restores the form from its own cache',
            'old() reads the input the failed validation flashed',
          ], 3, 'A failed validation redirects back with the submitted input flashed to the session, and old() is what reads those values into the inputs again.'),
        ]
      ),
            lesson('File Uploads and the Storage Disks', 13, `
A user attaches a 12 MB photo straight from their phone. Your rule says \`max:2048\`, so you expect a tidy validation message. What comes back is **419 Page Expired**, with nothing in the log and nothing wrong with your code. Uploads have three layers of limits, and only the last one belongs to Laravel.

### The form has to announce itself

\`\`\`blade
<form method="POST" action="{{ route('posts.store') }}" enctype="multipart/form-data">
    @csrf
    <input type="file" name="cover" accept="image/*">
    <x-button>Upload</x-button>
</form>
\`\`\`

Drop \`enctype\` and the browser posts the *filename* as an ordinary text field. \`$request->file('cover')\` then returns null and \`$request->hasFile('cover')\` is false, while the user swears they picked a file. It is the first thing to check, every time.

### Validate before you touch it

\`\`\`php
$request->validate([
    'cover' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
]);
\`\`\`

\`max:2048\` means 2048 **kilobytes**, so 2 MB. Reading it as bytes is a rite of passage that produces a rule nothing on earth can satisfy. The \`mimes\` rule inspects the file's actual content type rather than the extension, so \`payload.php\` renamed to \`photo.jpg\` does not slip through.

### The 419 explained

If the request body is larger than PHP's \`post_max_size\` (8M by default), PHP throws the whole body away before Laravel ever runs. No fields, no file, and no CSRF token, so the token check fails and answers 419. That is why an oversized upload reports a session problem instead of a size problem.

\`\`\`bash
php -i | grep -E 'post_max_size|upload_max_filesize'
\`\`\`

Keep them in order: your validation \`max\` below \`upload_max_filesize\`, which sits below \`post_max_size\`. Nginx adds a fourth limit, \`client_max_body_size\`, which returns 413 without PHP being involved at all.

### Store on a disk, not a path

\`\`\`php
$path = $request->file('cover')->store('covers', 'public');
// "covers/9dKz1m4Qq0.webp", relative to storage/app/public

$post->update(['cover_path' => $path]);
\`\`\`

\`store()\` invents a random unique filename, keeps the extension, and hands back a relative path. Save that string. An absolute path in the database is a migration you will pay for the day the files move to S3 or a second web server appears.

| Disk | Root | Reachable over HTTP |
|---|---|---|
| \`local\` | \`storage/app/private\` | No |
| \`public\` | \`storage/app/public\` | Through the symlink |
| \`s3\` | Your bucket | Yes, or via signed URLs |

\`\`\`bash
php artisan storage:link   # public/storage -> storage/app/public
\`\`\`

Skip that command in the deploy script and every image 404s in production while working perfectly on your machine. Render the URL through the disk so the answer stays right when the disk changes:

\`\`\`blade
<img src="{{ Storage::disk('public')->url($post->cover_path) }}" alt="{{ $post->title }}">
\`\`\`

Never write uploads into \`public/\` yourself. That folder is served, and on some configurations executed, by the web server: a user controlled filename in an executable directory is how a photo gallery becomes somebody else's shell.

### Private files go through a controller

\`\`\`php
public function download(Invoice $invoice)
{
    $this->authorize('view', $invoice);

    return Storage::disk('local')->download($invoice->pdf_path, "invoice-{$invoice->number}.pdf");
}
\`\`\`

Private disk, policy check, then stream. Put invoices on the public disk instead and a guessable filename is the only thing between one customer and another customer's numbers.

### Clean up after yourself

\`\`\`php
Storage::disk('public')->delete($post->getOriginal('cover_path'));
\`\`\`

Replacing an image leaves the old file behind, and deleting a row leaves all of them. Nobody files a bug about orphaned uploads. You find out from the storage bill, eighteen months later, when the bucket holds four times what the database can account for.
      `,
        [
          q('A form posts successfully, every text field arrives, and $request->file(\'cover\') is null. What is the usual cause?', [
            'The route is registered for GET rather than POST',
            'The file input needs a name ending in square brackets',
            'The form is missing enctype="multipart/form-data"',
            'The public disk was never linked with storage:link',
          ], 2, 'Without that encoding the browser sends the filename as ordinary text instead of the file itself, so Laravel has no uploaded file to hand back.'),
          q('A 30 MB upload returns 419 Page Expired rather than the message from the max:2048 rule. Why does the size limit look like a session problem?', [
            'PHP discarded the oversized body, so the CSRF token never arrived',
            'The max rule counts bytes, so the limit was set far too low',
            'The session expired while the browser streamed the upload',
            'The image rule rejected the file before the token was checked',
          ], 0, 'Exceeding post_max_size makes PHP drop the entire request body before Laravel runs, and a missing token is what the CSRF middleware reports as 419.'),
          q('Why put uploads on the public disk and symlink it instead of writing them straight into public/uploads?', [
            'The public folder is emptied on every deployment',
            'Storage::url() refuses to work outside a symlink',
            'Files under public/ are skipped by artisan backups',
            'A user named file in an executed folder can run as code',
          ], 3, 'The web root is served and in some configurations executed, so an attacker controlled filename landing there turns an upload form into remote code execution.'),
        ]
      ),
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
        `,
        [
          q('A migration adds $table->string(\'country\') with no nullable() and no default() to a MySQL posts table already holding 40,000 rows. What happens?', [
            'The migration fails and the whole batch rolls back',
            'MySQL accepts it and backfills every existing row with \'\'',
            'Existing rows receive NULL and later reads throw',
            'The column is created but stays hidden from selects',
          ], 1, 'MySQL quietly invents a value for the existing rows while PostgreSQL and SQLite refuse the migration outright, so nullable() or a default() is the portable choice.'),
          q('Your signup flow checks whether the email already exists and then inserts. Duplicate accounts still appear a few times a week. Why?', [
            'Two requests can both pass the check before either inserts',
            'Eloquent caches that select for the rest of the request',
            'The exists rule ignores rows created in the last second',
            'MySQL runs the insert before the select has finished',
          ], 0, 'The check and the insert are two separate statements, so concurrent requests interleave between them and only a unique index can refuse the second row.'),
          q('A migration writes $table->foreignId(\'author_id\')->constrained() and the migration fails saying the referenced table does not exist. Why?', [
            'constrained() requires the parent key to be named id',
            'The parent table has to be created in the same file',
            'constrained() infers an authors table from the column name',
            'foreignId() cannot be combined with a nullable column',
          ], 2, 'The table name is guessed from the column, so author_id points at authors; pass the real table as constrained(\'users\') when the names differ.'),
        ]
      ),
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
        `,
        [
          q('Post::where(\'status\', \'draft\')->update([\'status\' => \'archived\']) archives 4,000 rows and the updating observer never fires once. Why?', [
            'Observers are registered only for the web middleware group',
            'The bulk update is one SQL statement and hydrates no models',
            'Mass assignment protection suppresses the model events',
            'Events are queued and dropped when too many arrive at once',
          ], 1, 'A query builder update runs straight against the table without instantiating models, so there is nothing for Eloquent to fire events, mutators or observers on.'),
          q('published_at has no entry in $casts and $post->published_at->diffForHumans() throws a fatal error. What is going on?', [
            'The column is null for the row being rendered',
            'diffForHumans belongs to the builder, not the model',
            'Carbon has to be imported at the top of the model',
            'The attribute is a plain string, so it has no methods',
          ], 3, 'Without a datetime cast Eloquent hands back the raw column value as a string, and calling a Carbon method on a string is a fatal error rather than a bad date.'),
          q('A user soft deletes their account, then cannot sign up again with the same email because it is already taken. Why does the rule see a row nobody can?', [
            'The unique rule queries the table directly, trashed rows included',
            'Soft deleted users are restored automatically during signup',
            'The users table carries a unique index over deleted_at',
            'Validation runs before the global scope has been registered',
          ], 0, 'The unique rule counts rows with the query builder rather than the model, so the soft delete scope never applies and the tombstone still blocks the address.'),
        ]
      ),
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
        `,
        [
          q('A Post model defines author() as $this->belongsTo(User::class) with no second argument. Which foreign key does Eloquent look for?', [
            'user_id, taken from the name of the related model',
            'author_id, derived from the name of the method',
            'posts_user_id, built from both of the table names',
            'id, because belongsTo always joins on the key',
          ], 1, 'Eloquent builds the foreign key from the relationship method name, so author() looks for author_id and the column has to be passed explicitly when it is user_id.'),
          q('What is the difference between $post->comments and $post->comments() in a controller?', [
            'The property gives a Collection, the method a query builder',
            'The method gives a Collection, the property a single model',
            'They are identical, since the parentheses are optional',
            'The property runs a count, the method loads the rows',
          ], 0, 'Accessing it as a property resolves the relation to loaded models, while calling it returns the underlying query so you can keep adding constraints.'),
          q('Model::preventLazyLoading(! app()->isProduction()) sits in a service provider\'s boot(). What does a developer see when a Blade loop touches an unloaded relation?', [
            'The page renders with that relation left empty',
            'The query is logged and the page renders normally',
            'An exception naming the model and the relation',
            'Nothing locally, since it only applies in production',
          ], 2, 'Lazy loading throws a LazyLoadingViolationException outside production, which turns an N+1 you would never notice into a failure you cannot ignore.'),
        ]
      ),
            lesson('Transactions, Locking, and Concurrent Writes', 14, `
Two people click Buy on the last seat forty milliseconds apart. Both get a confirmation email. You have sold 101 tickets to a 100 seat room, and the code that did it reads perfectly:

\`\`\`php
$event = Event::find($id);

if ($event->seats_left > 0) {                                  // both read 1
    $event->update(['seats_left' => $event->seats_left - 1]);  // both write 0
    Ticket::create(['event_id' => $event->id, 'user_id' => auth()->id()]);
}
\`\`\`

Read, decide, write. Between the read and the write there is a gap measured in milliseconds, and under real traffic something always gets into it.

### A transaction is all or nothing

\`\`\`php
use Illuminate\\Support\\Facades\\DB;

DB::transaction(function () use ($event, $user) {
    $ticket = Ticket::create(['event_id' => $event->id, 'user_id' => $user->id]);
    $event->decrement('seats_left');
    Payment::create(['ticket_id' => $ticket->id, 'cents' => 4500]);
});
\`\`\`

Any exception thrown inside rolls every statement back and then keeps travelling up the stack. There is no cleanup branch for you to forget, which is the whole point: half a booking is worse than no booking.

Now the uncomfortable part. That transaction does **not** fix the oversell. Atomicity is not isolation, and both requests still read a seat count of 1.

### Two ways to close the gap

The first is to never read at all. \`decrement()\` compiles to \`update events set seats_left = seats_left - 1\`, which the database applies to whatever the current value is:

\`\`\`php
$rows = Event::where('id', $event->id)
    ->where('seats_left', '>', 0)
    ->decrement('seats_left');

if ($rows === 0) {
    abort(409, 'Sold out.');
}
\`\`\`

One statement decides and writes, and the affected row count tells you whether you won. This is the cheapest correct answer whenever the decision fits into a \`where\` clause.

The second is to lock the row while you think:

\`\`\`php
DB::transaction(function () use ($id) {
    $event = Event::where('id', $id)->lockForUpdate()->first();   // select ... for update

    abort_if($event->seats_left < 1, 409, 'Sold out.');
    $event->decrement('seats_left');
});
\`\`\`

The second request now blocks on that \`select\` until the first transaction commits, then reads the real number. Note the shape: \`lockForUpdate()\` outside a transaction is nearly useless, because the lock is released the moment the statement finishes.

Neither helps for inserts. Two signups can both find no matching email and both insert, so a \`unique\` index remains the only thing that can actually refuse the duplicate.

### Deadlocks are ordinary, not exotic

Two transactions that touch the same rows in opposite orders will eventually wait on each other, and the database picks one to kill:

\`\`\`text
SQLSTATE[40001]: Serialization failure: 1213 Deadlock found when trying to get lock
\`\`\`

That is a retryable error, and Laravel takes the attempt count as a second argument:

\`\`\`php
DB::transaction(fn () => $this->settle($invoice), 3);
\`\`\`

It retries on deadlock only, and it runs your closure again from the top. So anything inside that is not a database write happens twice: a second charge, a second email, a duplicate log line.

### Keep them short and keep them local

| Inside a transaction | Why it hurts |
|---|---|
| A call to the Stripe API | Locks held for the whole round trip |
| Sending mail | Cannot be rolled back, and may be sent twice |
| Reading an uploaded file | Slow work while other requests queue |
| Another \`DB::transaction\` | Becomes a savepoint, not a new transaction |

That last row surprises people. Nesting does not give you an inner transaction you can commit on its own: only the outermost commit writes anything, so an inner block that "succeeded" still vanishes if the outer one throws. Open the transaction as late as you can, do the writes, commit, and do the talking to the outside world afterwards.
      `,
        [
          q('The third statement inside a DB::transaction() closure throws an exception. What is the state of the database afterwards?', [
            'The first two statements remain and the third is skipped',
            'Everything is rolled back and the exception keeps travelling',
            'The closure is retried once and then committed anyway',
            'Whatever succeeded before the error is committed as usual',
          ], 1, 'The closure form rolls the transaction back on any exception and rethrows it, so the request fails with the database left exactly as it started.'),
          q('Two requests both read seats_left as 1, both subtract one, and both write 0. Which change actually prevents the oversell?', [
            'Wrap the existing read and write in DB::transaction()',
            'Cache the seat count for a second between the reads',
            'Add a database index on the seats_left column',
            'Read the row with lockForUpdate() inside the transaction',
          ], 3, 'A transaction alone still lets both requests read the same stale number, whereas the lock makes the second request wait until the first has committed its write.'),
          q('DB::transaction($callback, 3) retries the closure after a deadlock. What do you have to watch for inside it?', [
            'The attempts share one connection from the pool',
            'Only the final attempt is written, so counters drift',
            'Anything that is not a database write happens again',
            'Rollbacks are skipped between attempts, doubling rows',
          ], 2, 'A retry runs the whole closure from the top, so a charge, an email or an API call sitting inside it is repeated once per attempt while the writes are not.'),
        ]
      ),
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
        `,
        [
          q('A controller calls $request->validate([...]) and then passes Post::create($request->all()) on the next line. What has that achieved?', [
            'The rules run, but the mass assignment hole is still open',
            'all() returns only the validated keys once validate() has run',
            'create() re-applies the same rules to the array it is given',
            'Keys that were never validated throw an exception on create',
          ], 0, 'validate() returns the safe subset, but all() still contains every field the client sent, so any extra column named in the request is written straight through.'),
          q('An optional published_at field is submitted empty, arrives as null, and fails the [\'date\', \'after_or_equal:today\'] rules. What is missing?', [
            'The date rule has to be moved to the end of the list',
            'The rules belong in a form request rather than inline',
            'The nullable rule, without which null fails date',
            'The sometimes rule in place of the date rule',
          ], 2, 'A null value is not a valid date, so the validator rejects it unless nullable is present to say that null is an acceptable answer for this field.'),
          q('StorePostRequest::authorize() returns false for the current user. What does the client receive, and at what point?', [
            '422 with an errors object, after the rules have run',
            '403, before a single validation rule is evaluated',
            'A redirect back to the form with the old input intact',
            '500, because authorize() has to return a response',
          ], 1, 'A form request authorises first and validates second, so a false return aborts with 403 and the rules and the controller action never execute.'),
        ]
      ),
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
        `,
        [
          q('$this->authorize(\'update\', $post) in a controller on a fresh Laravel 12 app dies with Call to undefined method. What is wrong?', [
            'The policy was never registered inside a service provider',
            'authorize() is available on form requests only these days',
            'The generated base Controller is empty, so the trait is absent',
            'The model is missing the trait that enables policy checks',
          ], 2, 'From Laravel 11 the base controller ships with nothing on it, so AuthorizesRequests has to be pulled into the class before that helper exists.'),
          q('A guest requests /invoices/88, gets bounced to the login form, signs in, and lands back on /invoices/88 instead of the dashboard. What did that?', [
            'redirect()->intended(), replaying the URL the middleware stored',
            'The browser resubmitting the request it made originally',
            'The auth middleware retrying the request after login',
            'A flash value written by the login form on submit',
          ], 0, 'The auth middleware stashes the URL it blocked, and intended() sends the user there after login instead of to the default destination.'),
          q('Why should a login form answer with the same message for an unknown email and for a wrong password?', [
            'It avoids one database query on the failing branch',
            'Different messages let an attacker enumerate your users',
            'Breeze has no way to tell those two failures apart',
            'The throttle middleware requires the messages to match',
          ], 1, 'Distinct messages confirm which addresses have accounts, which turns a login form into a tool for building a list of real users to attack.'),
        ]
      ),
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
        `,
        [
          q('A middleware needs to attach an X-Duration-Ms header measuring how long the request took. Where does that code belong?', [
            'Before $next($request), reading the response from the request',
            'In the constructor, so that it runs earliest of all',
            'After $next($request), which hands back the response',
            'In terminate(), which runs once the response is sent',
          ], 2, 'Everything before $next runs on the way in, when no response exists yet; the response only becomes available once $next returns from the rest of the pipeline.'),
          q('A route is declared with ->middleware(\'role:admin,manager\'). How do those two values reach the middleware?', [
            'As one comma separated string attached to the request',
            'From the defaults array configured on that route',
            'They are role names the router verifies on its own',
            'As extra arguments after $next in the handle() method',
          ], 3, 'Anything after the colon is split on commas and passed as further parameters to handle(), which is why a variadic argument can collect them.'),
          q('A Laravel 12 JSON API is being hammered by one client and no throttling ever kicks in. Why was there no limit in place?', [
            'The api group applies its throttle in production only',
            'Rate limiting is opt in, through throttleApi() in bootstrap/app.php',
            'install:api strips the throttle middleware from the group',
            'Sanctum swaps the throttle middleware for one of its own',
          ], 1, 'The api middleware group no longer includes a limiter by default, so the throttle has to be added deliberately or every endpoint stays wide open.'),
        ]
      ),
            lesson('Sessions, Cookies, and Flash Data', 12, `
You add a second web server behind the load balancer on a Friday. By Monday support has forty tickets saying the site logs people out at random. There is nothing in the logs, nothing in Sentry, and it never reproduces locally. The bug is one line of \`.env\`:

\`\`\`ini
SESSION_DRIVER=file
\`\`\`

The cookie in the browser holds an id and nothing else. The data behind that id sits in \`storage/framework/sessions\` on whichever machine created it. Roughly half the requests now land on the other box, which finds no such session and starts a fresh empty one. The user was never logged out. They are talking to a server that has never met them.

### Pick a driver that matches your deployment

| Driver | Where the data lives | Reach for it when |
|---|---|---|
| \`file\` | Disk on that one machine | Local development |
| \`database\` | A \`sessions\` table | Two or more servers, no Redis |
| \`redis\` | Redis | Two or more servers, busy site |
| \`cookie\` | Encrypted inside the cookie | Rarely: 4 KB is the hard ceiling |
| \`array\` | Memory, thrown away | Tests |

Moving to the database driver takes two commands, \`php artisan make:session-table\` and \`php artisan migrate\`, and removes an entire class of ghost bug.

### The cookie attributes are the security model

\`\`\`php
// config/session.php
'lifetime'  => 120,                              // minutes of inactivity
'secure'    => env('SESSION_SECURE_COOKIE'),     // HTTPS only
'http_only' => true,                             // JavaScript cannot read it
'same_site' => 'lax',
'domain'    => env('SESSION_DOMAIN'),            // ".acme.com" shares subdomains
\`\`\`

\`http_only\` is what stops a cross site scripting bug from turning into a stolen account, because \`document.cookie\` never sees the value. Set \`secure\` in production and the cookie stops travelling over plain HTTP.

\`same_site\` is the one that bites. With \`lax\`, browsers send the cookie on ordinary navigation but **not** on a cross site POST. So when a payment provider finishes by POSTing the customer back to \`/checkout/callback\`, your application sees a guest at the precise moment it needs to know who paid. The fix is a signed URL carrying the order id, not loosening the attribute to \`none\`.

### Keep what you store small

\`\`\`php
$request->session()->put('cart.currency', 'PKR');
session('cart.currency', 'USD');        // read, with a fallback
$request->session()->forget('cart');
\`\`\`

Ids, flags, a currency code. Put a whole Eloquent model in there and you serialise the entire row into storage on every request, then serve it to the user long after somebody edited it.

### Flash data lives for exactly one request

\`\`\`php
return redirect()->route('posts.show', $post)->with('status', 'Post created.');
\`\`\`

Here is the failure people chase for an afternoon. Your action redirects to \`/dashboard\`, and \`/dashboard\` redirects again to \`/dashboard/overview\`. The first hop read the flashed value, which marks it for deletion, so the page that finally renders has nothing to show. Nothing is broken and no error is raised, the message simply evaporated one redirect early. \`session()->reflash()\` carries everything forward another request, and \`session()->keep(['status'])\` carries the keys you name.

### Two requests, one session, last write wins

Laravel loads the whole session at the start of a request and writes the whole thing back at the end. It does not lock by default. Fire three parallel fetch calls that each add an item to a session cart and you may keep only one of them, because each request wrote back the state it read before the others existed.

\`\`\`php
Route::post('/cart/add', AddToCartController::class)->block(10, 10);
\`\`\`

\`block()\` takes an atomic lock for that route, holding it for up to ten seconds and waiting up to ten to acquire it. It needs a cache driver that supports locks, so Redis, DynamoDB or the database, and it is worth applying only to the handful of routes that genuinely race.
      `,
        [
          q('An app runs on two web servers with SESSION_DRIVER=file, and users report being logged out at random. What is happening?', [
            'Session data sits on one box, so the other finds nothing',
            'The load balancer strips the cookie on alternate requests',
            'File sessions expire on the first request that reads them',
            'The file driver keeps the data in the cookie, which overflows',
          ], 0, 'The cookie carries only an id, and the file driver stores the matching data on local disk, so a request served by the other machine starts an empty session.'),
          q('A store action redirects to /dashboard, which itself redirects to /dashboard/overview. The success message never appears. Why?', [
            'The second redirect clears every value in the session',
            'with() writes to the query string, which the hop loses',
            'Flash values can only be read by redirect()->back()',
            'Flash data lasts one request, and the first hop consumed it',
          ], 3, 'Reading a flashed value marks it for deletion at the end of that request, so an extra redirect in between eats the message before any page renders it.'),
          q('A payment provider finishes by POSTing the customer back to /checkout/callback, and your application treats them as a guest. What explains it?', [
            'The callback route was registered in routes/api.php',
            'SameSite=lax withholds the cookie on a cross site POST',
            'The session lifetime elapsed during the redirect chain',
            'Cookies marked http_only are not sent on POST requests',
          ], 1, 'Lax cookies ride ordinary navigation but not a POST originating on another site, so the request arrives with no session cookie and therefore no user.'),
        ]
      ),
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
        `,
        [
          q('apiResource registers five routes where resource registers seven. Why are create and edit missing?', [
            'They only rendered HTML forms, which an API client builds itself',
            'They need session state, which the api middleware group removes',
            'They are registered separately when you run php artisan install:api',
            'They collide with the show route once the /api prefix is applied',
          ], 0, 'The create and edit actions exist purely to return a blank or prefilled HTML form, so a JSON API has nothing to put in them and apiResource leaves them out.'),
          q('A mobile client posts invalid JSON without an Accept header and receives a full HTML error page it cannot parse. What fixes this for every API route at once?', [
            'Set APP_DEBUG=false so the HTML error page is never rendered',
            'Return response()->json() from the form request failedValidation',
            'Call shouldRenderJsonWhen(fn ($request) => $request->is(\'api/*\')) in bootstrap/app.php',
            'Move the routes into routes/web.php so the web group applies',
          ], 2, 'Laravel picks between an HTML page and a JSON body by inspecting the request, so declaring that anything under api/* renders JSON makes the error shape reliable whatever headers the client sends.'),
          q('Route::apiResource(\'posts.comments\', CommentController::class)->shallow() is registered. Which URI updates comment 91?', [
            'PUT /api/posts/3/comments/91',
            'PUT /api/comments/91',
            'PATCH /api/posts/3/comments',
            'PUT /api/comments/91/posts/3',
          ], 1, 'shallow() keeps the parent segment only where it is needed to scope a listing or a create, so any action that already carries a comment id drops the post from the URI.'),
        ]
      ),
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
        `,
        [
          q('A controller does return $post; and a migration later adds an internal_notes column. What happens?', [
            'The response shape holds until you clear the config cache',
            'Eloquent omits any column added after the model was generated',
            'The API returns a 500 until the model $fillable array is updated',
            'The new column is published to every client the moment it exists',
          ], 3, 'Returning a model serialises whatever columns the row happens to have, so a schema change leaks straight into the public contract unless a resource class decides the shape.'),
          q('An index endpoint is slow at page 8,000 with paginate(15). Why does cursorPaginate() help, and what do you give up?', [
            'It caches each page, so pages already visited stop hitting the database',
            'It seeks on an indexed key instead of counting and skipping, but page numbers go',
            'It returns fewer columns per row, but relations can no longer be eager loaded',
            'It runs the count query on a replica, but the total becomes approximate',
          ], 1, 'A cursor carries a where clause on the ordered key, so the database never counts the whole set or walks past 120,000 rows, and the cost is that a client can only move forward and back rather than jump to a page.'),
          q('A resource serialises published_at with format(\'Y-m-d H:i:s\'). What kind of bug does that create?', [
            'Clients in other time zones render the wrong instant, since no offset is sent',
            'The value overflows the JSON number type on 32 bit clients',
            'Laravel refuses to serialise a Carbon instance once it has been formatted',
            'The field is dropped from the response whenever the column is null',
          ], 0, 'A string with no offset states a wall clock reading rather than a moment in time, so every client has to guess the zone and only users outside the server\'s zone ever see the error.'),
        ]
      ),
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
        `,
        [
          q('Your Vue front end is served from the same top level domain as the API. Why prefer Sanctum\'s cookie mode over issuing a bearer token?', [
            'Cookie sessions skip the database on every authenticated request',
            'Token auth cannot be combined with route model binding or policies',
            'No credential sits in localStorage where an XSS could read it',
            'CSRF protection becomes unnecessary once cookies are in use',
          ], 2, 'Stateful mode reuses the ordinary HttpOnly session cookie, which JavaScript cannot read, so a script injected into your page finds no token to send anywhere.'),
          q('Of the three API tests written, why does the one asserting another user gets 403 matter most?', [
            'It is the only test that exercises route model binding',
            'Validation rules are already covered by the framework suite',
            'Policies are the only code that RefreshDatabase can reach',
            'A missing authorisation check fails silently, while validation bugs get reported fast',
          ], 3, 'A broken validation rule annoys the next person who hits it and lands in your inbox that day, but a missing policy check works perfectly for everyone until somebody exploits it.'),
          q('You add ->middleware(\'abilities:posts:write\') to a route and the request fails with an unresolvable middleware error. Why?', [
            'Abilities only work in Sanctum\'s stateful cookie mode',
            'Sanctum ships the middleware but registers no alias, so you name it in bootstrap/app.php',
            'The token must be created with no abilities for the check to apply',
            'auth:sanctum has to be listed after the abilities middleware',
          ], 1, 'The CheckAbilities class exists in the package but nothing maps the short name to it, so you register that alias yourself before any route can reference it.'),
        ]
      ),
            lesson('CORS, Preflight, and the Browser Boundary', 13, `
Your API returns 200 in the terminal. \`curl -i http://localhost:8000/api/posts\` prints the JSON exactly as designed. The React app on http://localhost:5173 prints this instead:

\`\`\`text
Access to fetch at 'http://localhost:8000/api/posts' from origin
'http://localhost:5173' has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource.
\`\`\`

Nothing is wrong with your route. The request reached Laravel, ran the controller, and came back with your JSON. The browser then refused to hand that response to your JavaScript, because the response never said this origin was welcome.

### Only browsers enforce this

Same origin policy is a browser rule. curl, Postman, a mobile app and your own PHP HTTP client ignore CORS entirely, which is why "it works in Postman" is never evidence of anything. Your Laravel log shows a clean 200 for a request the user experienced as a failure. Read the Network tab, not the console.

### The preflight nobody asked for

Some requests are sent twice. Before a request the browser does not consider simple, it sends an OPTIONS probe and waits for permission:

\`\`\`http
OPTIONS /api/posts HTTP/1.1
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization,content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Headers: authorization,content-type
Access-Control-Max-Age: 86400
\`\`\`

| Request | Preflight sent? |
|---|---|
| GET with no custom headers | No |
| POST with application/x-www-form-urlencoded | No |
| POST with Content-Type: application/json | Yes |
| Anything carrying Authorization: Bearer | Yes |

So every authenticated JSON write in your app costs two round trips. On a 180 ms mobile connection that is 180 ms of pure waiting added to each POST. \`Access-Control-Max-Age\` is the answer: it tells the browser how long to remember the permission. Laravel ships \`'max_age' => 0\`, which means remember nothing. Set 86400 and the browser applies its own ceiling (Chrome caps at 7200 seconds).

The preflight never reaches your controller. Laravel's \`HandleCors\` middleware answers it near the top of the global stack, before \`auth:sanctum\` gets a chance to reject a probe that carries no token yet.

### config/cors.php

\`\`\`bash
php artisan config:publish cors
\`\`\`

\`\`\`php
return [
    'paths'               => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'     => ['*'],
    'allowed_origins'     => ['https://app.example.com', 'http://localhost:5173'],
    'allowed_headers'     => ['*'],
    'exposed_headers'     => ['X-RateLimit-Remaining'],
    'max_age'             => 86400,
    'supports_credentials' => false,
];
\`\`\`

\`exposed_headers\` matters more than it looks. JavaScript can read only a handful of response headers by default, so the pagination or rate limit header you carefully set in a middleware stays invisible to the client until you list it here.

### The combination the browser rejects outright

Wildcard origins and credentials cannot be used together:

\`\`\`php
'allowed_origins'      => ['*'],
'supports_credentials' => true,   // the browser discards the response
\`\`\`

This is the bug that arrives on the day you switch to Sanctum's cookie mode. The wildcard worked for months with bearer tokens, then cookies go on and every request fails at once. Name the origins explicitly, set \`SANCTUM_STATEFUL_DOMAINS\` and \`SESSION_DOMAIN\`, and send \`credentials: 'include'\` from the client. Three settings, and all three have to agree.

### A 500 looks like a CORS error

When an unhandled exception escapes before the CORS headers are attached, the response comes back without \`Access-Control-Allow-Origin\`, and the browser reports it as blocked. Developers then spend an afternoon editing cors.php while the real problem is a null in a controller. If the Network tab shows status 500, it is not a CORS problem.
      `,
        [
          q('curl returns the JSON happily and the browser reports the same request as blocked. What is actually true?', [
            'The response arrived, and the browser withheld it from JavaScript for lacking a CORS header',
            'Laravel rejected the browser request before it reached the router',
            'The browser requested a different route than curl did, so it got a 404',
            'curl skipped the auth middleware, so it was never the same request',
          ], 0, 'Same origin policy is enforced by the browser after the response comes back, which is why your server log shows a clean 200 for a request the user saw fail.'),
          q('Which of these requests makes the browser send an OPTIONS preflight first?', [
            'A GET for /api/posts carrying no custom headers at all',
            'An image loaded through an img tag from the API host',
            'A POST with Content-Type: application/x-www-form-urlencoded',
            'A POST with Content-Type: application/json',
          ], 3, 'A JSON content type falls outside the small set of values the specification counts as simple, so the browser asks permission before it sends the body.'),
          q('allowed_origins is [\'*\'] and supports_credentials is switched on for cookie auth. What happens?', [
            'Only the preflight fails, so plain GET requests keep working',
            'Laravel swaps the wildcard for the request\'s own Origin header',
            'The browser discards the response, since a wildcard cannot carry credentials',
            'Cookies are sent but the session is silently started fresh each time',
          ], 2, 'A wildcard origin combined with credentialed requests is an illegal pairing, so origins have to be listed one by one the moment cookies enter the picture.'),
        ]
      ),
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
        `,
        [
          q('A job takes a User in its constructor. Between the dispatch and the worker picking it up, that user changes their email. Which email does the job see?', [
            'The one captured at dispatch, since the object was serialised whole',
            'Neither, because a queued job cannot accept an Eloquent model',
            'The new one, since only the class and key are stored and the row is refetched',
            'The new one, but only when the queue driver is redis rather than database',
          ], 2, 'SerializesModels writes the class name and primary key into the payload, so handle() runs a fresh query and always works with the row exactly as it stands at that moment.'),
          q('Your .env still says QUEUE_CONNECTION=sync, copied from an older project. Which bugs can never appear on your machine?', [
            'A missing worker, serialisation failures and the uncommitted transaction race',
            'Validation errors raised inside the job\'s handle method',
            'A job whose constructor throws before it is ever queued',
            'Anything caught and logged by the job\'s failed() callback',
          ], 0, 'sync executes the job inline inside the same request and process, so every failure mode that depends on a separate worker holding its own database connection simply cannot happen locally.'),
          q('A ChargeCard job charges the card, then times out before it can write the receipt. $tries is 3. What follows?', [
            'The failed() hook runs immediately and the job stops there',
            'The worker rolls back the charge before it retries the job',
            'Laravel skips retries for any job that timed out mid work',
            'It runs again and charges twice unless the job is idempotent',
          ], 3, 'A timeout counts as a failed attempt like any other, so the job is queued again from the top, which is why real jobs carry an idempotency key or a status check before they touch anything.'),
        ]
      ),
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
        `,
        [
          q('When is dispatching an event a better choice than calling the method directly from the controller?', [
            'Whenever the work is slow enough to belong on a queue',
            'When several unrelated systems must react to one fact',
            'When the side effect has to finish before the response',
            'When exactly one action follows and it must never be skipped',
          ], 1, 'Events buy decoupling at the price of hiding control flow, so they pay off when several subscribers care about the same fact and cost you clarity when a single mandatory step is involved.'),
          q('Why set MAIL_MAILER=log on your own machine rather than pointing it at a real SMTP account?', [
            'Queued mail is dropped entirely unless the log mailer is active',
            'The mail channel of a notification requires it during development',
            'Markdown mailables can only be previewed through the log driver',
            'A seeder full of realistic fake users would mail real strangers',
          ], 3, 'Factory data usually carries plausible looking addresses, so one run of a seeder or a test that sends notifications can post real email to people who never signed up for anything.'),
          q('You add app/Listeners/SendShipmentNotification.php in Laravel 11 and register it nowhere. What happens when the event is dispatched?', [
            'It runs, because listeners are discovered from a type hinted handle method',
            'It is ignored until you add it to the EventServiceProvider array',
            'It runs only when the listener also implements ShouldQueue',
            'Laravel throws, because every listener needs an explicit binding',
          ], 0, 'Laravel 11 and 12 scan the listener directory and read the type hint on handle(), so the event to listener mapping comes from the signature instead of a registration array you can forget.'),
        ]
      ),
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
        `,
        [
          q('A task marked ->onOneServer() runs on all four app servers every hour. The cache driver is file. Why?', [
            'onOneServer only applies to tasks scheduled with Schedule::job',
            'Each server needs a unique APP_NAME before the lock can work',
            'The lock lives in the cache, and a file cache is local to one machine',
            'The lock is released the moment the command starts running',
          ], 2, 'onOneServer coordinates through an atomic cache lock, so unless every host shares one Redis or Memcached store each machine takes its own local lock and believes it won the race.'),
          q('Supervisor is left at stopwaitsecs=10 and a deploy restarts the workers mid job. What is the damage?', [
            'The job is retried immediately, before the new code is live',
            'SIGKILL lands ten seconds in, so failed() never runs',
            'Supervisor refuses to restart until the job has finished',
            'The job moves to failed_jobs with its exception recorded',
          ], 1, 'Supervisor waits only stopwaitsecs for a graceful exit before killing the process outright, so a job longer than that dies halfway through with none of your failure handling given a chance to run.'),
          q('An hourly report grows to seventy minutes. Without withoutOverlapping(), what does the symptom look like?', [
            'The scheduler skips the next run and logs a warning',
            'schedule:run refuses to start a command already running',
            'The second run fails instantly with a lock exception',
            'Two copies overlap for ten minutes and output is duplicated',
          ], 3, 'Nothing errors, because two perfectly valid processes are simply reading and writing the same rows at the same time, so what you notice is duplicated output rather than a stack trace.'),
        ]
      ),
            lesson('Batching and Chaining Jobs', 13, `
A customer uploads a 40,000 row CSV. Your import job reads it, loops, and inserts. Eleven minutes later the worker kills it at the 60 second timeout, \`$tries = 3\` sends it back twice more, and by the end the first 6,000 rows exist three times over while the customer has watched a spinner for a quarter of an hour.

One job was the wrong shape. Eighty jobs, dispatched together and tracked as a unit, is the right one.

### Chains run in order and stop on failure

\`\`\`php
Bus::chain([
    new ImportRows($import),
    new RebuildSearchIndex($import),
    new NotifyOwner($import),
])->catch(fn (Throwable $e) => Log::error('Import chain broke', ['import' => $import->id]))
  ->dispatch();
\`\`\`

Each link is queued only once the previous one succeeds. If \`ImportRows\` throws, the index is never rebuilt and nobody is emailed about an import that did not happen. Dispatch those three separately and you get three jobs racing, with the congratulations arriving before the data.

### Batches run together and report progress

\`\`\`php
use Illuminate\\Bus\\Batch;

$batch = Bus::batch(
    $rows->chunk(500)->map(fn ($chunk) => new ImportRows($import->id, $chunk->all()))
)->name("Import {$import->id}")
 ->allowFailures()
 ->onQueue('imports')
 ->then(fn (Batch $b) => $import->update(['status' => 'complete']))
 ->catch(fn (Batch $b, Throwable $e) => Log::error('First failure', ['batch' => $b->id]))
 ->finally(fn (Batch $b) => $import->update(['finished_at' => now(), 'failures' => $b->failedJobs]))
 ->dispatch();
\`\`\`

The job class needs the \`Batchable\` trait. Store \`$batch->id\` on the import row and a polling endpoint can read \`$batch->progress()\` for a real percentage, plus \`processedJobs()\` and \`failedJobs()\` for the detail.

Laravel 11 and 12 create \`job_batches\` in the same default migration as \`jobs\`. On a project carried forward from Laravel 10, run \`php artisan queue:batches-table\` first or the dispatch throws about a missing table.

### The default that catches people

Without \`allowFailures()\`, the first failed job cancels the batch. What cancelling does not do is remove the other jobs from the queue. They still reach a worker, and they still run, unless each one asks:

\`\`\`php
public function handle(): void
{
    if ($this->batch()?->cancelled()) {
        return;
    }

    // ...
}
\`\`\`

Leave that check out and a cancelled batch keeps importing for another nine minutes while your dashboard says it stopped.

### then, catch and finally are not interchangeable

| Callback | Fires |
|---|---|
| \`then\` | Only when every job succeeded |
| \`catch\` | On the first failure, once |
| \`finally\` | Always, after the last job, failures or not |

Marking an import complete inside \`then\` while using \`allowFailures()\` is a slow bug. Seventy nine chunks land, one fails, \`then\` never runs, and the record sits at \`processing\` forever with a spinner nobody can clear. Cleanup belongs in \`finally\`.

### Chunk size is a real decision

| Chunk | Jobs | Time per job | Cost of one retry |
|---|---|---|---|
| 40,000 | 1 | 11 min | Reimports everything |
| 500 | 80 | 8 s | Reimports 500 rows |
| 10 | 4,000 | 0.2 s | Queue overhead dominates |

Pick the size where a single job finishes comfortably inside its \`$timeout\` and a retry is cheap. Roughly 500 database rows, or one external API call, per job is a sane starting point. Then make the job idempotent anyway: an \`upsert()\` keyed on the source row id turns a retry into a no-op instead of a duplicate, which matters because at 80 jobs the odds that none of them ever retries are not on your side.
      `,
        [
          q('You dispatch a batch without allowFailures(). Job 3 of 80 throws. What happens to jobs 4 through 80?', [
            'They still reach a worker, so each must check $this->batch()?->cancelled()',
            'The queue driver removes them from the list automatically',
            'They are moved into failed_jobs alongside the failing one',
            'They run to completion, because a batch never cancels itself',
          ], 0, 'Cancelling a batch flips a flag on the batch record, it does not reach into the queue and delete pending payloads, so the check at the top of handle is what actually stops the work.'),
          q('An import uses allowFailures() and marks itself complete in ->then(). One chunk out of eighty fails. What does the user see?', [
            'The import is marked complete, with the failed chunk logged',
            'The batch is retried from the start and then marked complete',
            'The record sits at processing forever, since then never fires',
            'The catch callback marks it complete on the first failure instead',
          ], 2, 'then() only runs when every job in the batch succeeded, so any cleanup that must happen either way belongs in finally(), which a partially failed batch still reaches.'),
          q('Three steps must run in strict order and the later ones are pointless if the first fails. Batch or chain?', [
            'A batch, because progress() reports how far the work has got',
            'A chain, because each job is queued only after the last succeeds',
            'A batch with allowFailures(), which preserves dispatch order',
            'Three separate dispatches, since workers respect queue order',
          ], 1, 'A chain queues the next link only once the previous one has finished successfully, whereas a batch deliberately spreads its jobs across workers in parallel with no ordering guarantee at all.'),
        ]
      ),
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
        `,
        [
          q('Your query filters on status and orders by created_at. Why does index([\'created_at\', \'status\']) fail to help it?', [
            'Composite indexes only work when both columns are in the same table',
            'The database seeks on the leftmost column, and nothing filters on created_at',
            'A column used in ORDER BY can never be part of a usable index',
            'MySQL ignores composite indexes as soon as a LIMIT clause appears',
          ], 1, 'A B-tree is ordered by its first column and only then by the second, so an index starting with created_at gives the engine no prefix it can use to jump to the published rows.'),
          q('A hot cache key with a ten minute TTL expires during peak traffic, and database load spikes higher than it ever was without a cache. What happened?', [
            'Cache::remember stored a null, so every later read misses',
            'The driver evicted neighbouring keys to make room for the value',
            'A file cache cannot be written by two processes at the same time',
            'Every in flight request missed at once and rebuilt the value in parallel',
          ], 3, 'Expiry is a single instant shared by every request in flight, so they all miss together and run the expensive query simultaneously, which is why the rebuild belongs behind a Cache::lock.'),
          q('A user has 12,000 orders and the dashboard needs their lifetime total. Which line is the problem, and why?', [
            '$user->orders->sum(\'total\'), because it hydrates every order into memory',
            'Order::where(\'user_id\', $id)->sum(\'total\'), since aggregates skip indexes',
            '$user->orders()->sum(\'total\'), because a relation cannot be aggregated',
            'Order::whereBelongsTo($user)->sum(\'total\'), which loads the user twice',
          ], 0, 'Reading the collection property loads all 12,000 rows as model objects before PHP adds them up, while the query builder asks the database for one number and hydrates nothing.'),
        ]
      ),
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
        `,
        [
          q('The suite is green on in memory SQLite and then the deploy fails on that same migration. What is the fix?', [
            'Run the suite without --parallel so migrations apply in order',
            'Replace RefreshDatabase with DatabaseTransactions inside CI',
            'Run the same suite against MySQL or PostgreSQL in CI too',
            'Move the schema change into a seeder that CI executes first',
          ], 2, 'SQLite differs from your production engine on JSON columns, strict mode and unique index behaviour, so only a run against the real engine can catch a migration that engine will reject.'),
          q('A subscription expires thirty days after it starts. How do you test the expiry without waiting?', [
            'Call sleep() in the test with the TTL lowered to one second',
            '$this->freezeTime() and $this->travelTo(now()->addDays(31))',
            'Insert the row with its created_at column left as null',
            'Mock the Subscription model so that expired() returns true',
          ], 1, 'Laravel lets you move the application clock, so the model\'s own logic runs against a later now() and you end up testing the real expiry rule rather than a stub that agrees with you.'),
          q('Every endpoint test signs in with actingAs($owner). Which class of bug survives that green suite?', [
            'Validation rules that quietly accept an empty string',
            'Migrations that only run on the developer\'s machine',
            'Queued jobs that are never actually dispatched at all',
            'Missing policy checks, since nobody else ever calls the route',
          ], 3, 'An owner is permitted to do everything, so a route with no authorisation check passes every test until a different user calls it in production and it works for them too.'),
        ]
      ),
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
        `,
        [
          q('Why is Log::info("Order {$order->id} placed") worse than passing the id as array context?', [
            'The id is welded into the message, so nothing can filter on it',
            'Interpolation is evaluated even when that log level is disabled',
            'Lines longer than 120 characters are truncated by the driver',
            'Only the array form is ever written to the daily channel',
          ], 0, 'Structured context stays a separate field that a log tool can index and query, while an interpolated sentence leaves you grepping free text for something that should have been a filter.'),
          q('The app sits behind a load balancer that terminates TLS. Generated URLs come out as http:// and the HTTPS redirect loops. What is missing?', [
            'APP_URL needs to be set with an https scheme',
            'A forceScheme call in every controller response',
            'Trusting the proxy, so the forwarded protocol header is believed',
            'The secure flag on the session cookie configuration',
          ], 2, 'Laravel only reads X-Forwarded-Proto from proxies it has been told to trust, so until trustProxies is configured every request still looks like plain HTTP and the redirect fires forever.'),
          q('A thumbnail upload to S3 fails, but the order must still be saved and a 200 returned. Which call fits?', [
            'throw $e, and catch it again in the exception handler',
            'report($e), which logs it and lets the request carry on',
            'abort(500), so that monitoring records the failure',
            'dontReport(), which swallows the exception at the boundary',
          ], 1, 'report() hands the exception to your logger and reporting service without interrupting the response, which is exactly right for a side effect that failed but must not fail the request.'),
        ]
      ),
            lesson('Load Testing and Sizing PHP-FPM', 13, `
Staging serves 400 requests a second. Production, on the same instance type, gives up at 60 while the CPU sits 30 percent idle. No code changed between them. What changed is how many PHP processes are allowed to exist at once, and what all of them end up queueing behind.

### Measure with a number you can defend

\`\`\`bash
ab -n 2000 -c 50 https://staging.example.com/posts   # a quick read
k6 run --vus 50 --duration 2m load.js                # scriptable and realistic
\`\`\`

Report p95, not the mean. A mean of 90 ms with a p95 of 2.4 seconds means one request in twenty is unusable, and the mean will keep insisting the site is fast while support fills up. Watch the error rate beside it: throughput that climbs while 12 percent of requests return 502 is not throughput, it is a queue overflowing.

Two rules keep the numbers honest. Test against production sized data, because a run over a seeder holding 40 posts measures your seeder. And test signed in, on the endpoints people actually hit, not the marketing page that is already cached.

### Sizing the pool

\`\`\`ini
; /etc/php/8.3/fpm/pool.d/www.conf
pm = dynamic
pm.max_children = 24
pm.start_servers = 6
pm.min_spare_servers = 4
pm.max_spare_servers = 12
pm.max_requests = 500
\`\`\`

\`pm.max_children\` is the hard ceiling on concurrent requests. Size it from memory, not from optimism:

\`\`\`bash
ps -ylC php-fpm8.3 --sort:rss | awk '{s+=$8; n++} END {print s/n/1024, "MB average"}'
\`\`\`

If the average process is 62 MB and 3 GB is left after MySQL and Redis have taken theirs, the arithmetic gives about 48. Round down and leave headroom.

**The counter-intuitive part:** raising \`max_children\` from 24 to 200 usually makes p95 worse. MySQL still allows 151 connections, so 200 PHP processes now sit waiting for one, each holding its memory, and the box starts swapping. A short queue that rejects quickly beats a long queue that times out slowly. When 24 workers are saturated the real fix is a faster page, more machines, or a connection pooler, never a bigger number in one config file.

\`pm.max_requests = 500\` recycles each child after 500 requests, bounding leaks the same way \`--max-time\` does for queue workers.

### Find where the time goes before buying hardware

A trace of one slow page:

| Layer | Time |
|---|---|
| Database | 940 ms |
| PHP execution | 180 ms |
| View rendering | 60 ms |
| Network | 20 ms |

Seventy eight percent of that is one query. Doubling the number of app servers doubles the pressure on the same database and changes nothing a user can feel.

### opcache, and the deploy that does nothing

\`\`\`ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0   ; production only
\`\`\`

Without opcache, every request recompiles every PHP file it touches, and a Laravel request touches several hundred. Setting \`validate_timestamps=0\` stops PHP checking file modification times, which is faster again and carries a trap: you deploy, the site keeps serving the old code, and nothing in the logs hints at why. The compiled bytecode is cached until the process reloads. Put \`sudo systemctl reload php8.3-fpm\` in the deploy script, right next to \`queue:restart\`.

One last habit. Load test the writes, not only the reads. Reads get faster with a cache; a checkout path serialises on row locks, and that is the one that falls over at 9am on the day the campaign email goes out.
      `,
        [
          q('A load test reports a mean of 90 ms and a p95 of 2.4 seconds. What should you conclude?', [
            'The result is healthy, since the mean is well under a second',
            'The run was too short for the numbers to have settled down',
            'The p95 is inflated by the first few uncached requests only',
            'One request in twenty is unusable and the mean is hiding it',
          ], 3, 'An average is dragged down by the many fast responses, so it stays reassuring while a whole slice of real users waits seconds, which is precisely what the p95 exposes.'),
          q('p95 is poor, so pm.max_children goes from 24 to 200. Latency gets worse instead of better. Why?', [
            'The extra processes queue for database connections and for RAM',
            'PHP-FPM ignores any value above the number of CPU cores',
            'Dynamic mode caps children at max_spare_servers regardless',
            'Each new child rebuilds opcache, slowing its first requests',
          ], 0, 'Concurrency is limited by whatever is scarcest, so 200 workers competing for 151 MySQL connections and finite memory simply move the waiting inside your server and add swapping to it.'),
          q('opcache.validate_timestamps=0 is set. You deploy, and the site keeps serving yesterday\'s code. Why?', [
            'Composer\'s autoloader map was not regenerated during the deploy',
            'The config cache is still holding the previous file paths',
            'PHP stopped checking mtimes, so only a reload clears the bytecode',
            'opcache.memory_consumption was too small for the new files',
          ], 2, 'With timestamp validation switched off PHP never asks whether a file has changed, so the compiled bytecode from the previous release keeps serving until php-fpm is reloaded.'),
        ]
      ),
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
      chapter(
      'The Service Container, Providers, and Architecture',
      'How Laravel builds and shares your objects, where to register your own, and how to stop a growing application collapsing into fat models and helper files.',
      [
      lesson('Binding, Resolution, and Contextual Injection', 13, `
\`Target [App\\Contracts\\SmsGateway] is not instantiable while building [App\\Http\\Controllers\\DispatchController]\`.

That exception is the container being precise. It read the controller's constructor with reflection, found a type-hint it could not turn into an object, and stopped. Concrete classes it builds on sight. An interface it cannot, because nothing has said which implementation you meant.

### Zero configuration resolution

\`\`\`php
final class ShipmentPlanner
{
    public function __construct(
        private RouteOptimiser $optimiser,
        private DistanceCache $cache,
    ) {}
}

$planner = app(ShipmentPlanner::class);
\`\`\`

Nothing was registered anywhere. The container reflected on \`ShipmentPlanner\`, saw two class type-hints, resolved each of those the same way, and handed back a finished object. That recursion is the whole trick, and it is why most classes in your application never need a binding at all.

You register only when reflection cannot decide: an interface, a primitive, or an object that needs configuration before it is useful.

### Four lifetimes, one registry

| Call | What resolution returns | Lives for |
|---|---|---|
| \`bind\` | the factory runs again every time | nothing, fresh each call |
| \`singleton\` | the factory runs once | the life of the container |
| \`scoped\` | the factory runs once, then is flushed | one request or one job |
| \`instance\` | an object you built yourself | the life of the container |

\`\`\`php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    $this->app->bind(SmsGateway::class, TwilioSmsGateway::class);

    $this->app->singleton(TwilioSmsGateway::class, fn () => new TwilioSmsGateway(
        sid:     config('services.twilio.sid'),
        token:   config('services.twilio.token'),
        timeout: 3,
    ));
}
\`\`\`

Two bindings doing two different jobs. The first says which class satisfies the interface. The second says how that class is built, once, from \`config()\` rather than \`env()\` (Chapter 1 covered why that distinction survives \`config:cache\`).

Here is the mistake that costs an afternoon. Register a request counter with \`bind\` instead of \`singleton\`, resolve it in a middleware and again in a controller, and each one starts counting from zero. Nothing throws. No log line appears. The limit is simply never reached, and the bug looks like a broken rate limit rather than a wrong verb in a provider.

### Contextual injection

Most of an application wants one implementation of a contract. One class wants a different one.

\`\`\`php
$this->app->when(InvoiceMailer::class)
    ->needs(Filesystem::class)
    ->give(fn () => Storage::disk('s3'));

$this->app->when(ImportProductsCommand::class)
    ->needs('$batchSize')
    ->give(2000);
\`\`\`

\`needs('$batchSize')\` is how a primitive gets filled. Reflection can build a class from a type-hint, but no amount of reflection invents the number 2000.

The catch people hit: the rule matches the class doing the asking, not everything beneath it. If \`InvoiceMailer\` builds a \`PdfWriter\` that also type-hints \`Filesystem\`, \`PdfWriter\` receives the default disk and writes the PDF to local storage. Contextual bindings are one level deep on purpose, so name every class you actually mean.

### Tagging and runtime arguments

\`\`\`php
$this->app->tag([CsvExporter::class, XlsxExporter::class], 'exporters');

foreach ($this->app->tagged('exporters') as $exporter) {
    $exporter->export($report);
}

app()->makeWith(ReportRunner::class, ['month' => '2026-07']);
\`\`\`

Tagging is how you resolve a family of implementations without a hand-maintained array. \`makeWith\` deserves suspicion: a class that needs a runtime value in its constructor usually wants that value as a method argument instead.

### Resolve at the edge

\`\`\`php
// hides the dependency
public function handle(): void
{
    $gateway = app(SmsGateway::class);
}

// declares it
public function __construct(private SmsGateway $gateway) {}
\`\`\`

Both run. Only the second tells the next reader, and the test, what this class needs. An \`app()\` call buried in a method turns the container into a service locator and hides the very graph you just learned to read.
      `,
        [
          q('You register a request counter with $this->app->bind(), then type-hint it in a middleware and in a controller during the same request. Each one counts from zero. Why?', [
            'Type-hinted dependencies are cloned before they are injected',
            'The container only caches classes that implement an interface',
            'bind runs its factory again on every resolution, so each gets its own',
            'Two resolutions in one request use two separate containers',
          ], 2, 'A bind registration is a factory that is invoked on every resolution, so the middleware and the controller receive distinct objects with distinct state, which is what singleton exists to prevent.'),
          q('A contextual binding gives InvoiceMailer the s3 disk for Filesystem. InvoiceMailer constructs a PdfWriter that also type-hints Filesystem. Which disk does PdfWriter receive?', [
            'The default disk, because the rule names InvoiceMailer only',
            'The s3 disk, since contextual rules apply down the whole graph',
            'Neither, because a nested contextual rule throws on resolution',
            'The s3 disk, but only while PdfWriter is bound as a singleton',
          ], 0, 'Contextual bindings match the exact class whose constructor is being filled, so a dependency resolved one level deeper falls back to the ordinary binding and gets the default disk.'),
          q('A class constructor is declared as (private ReportBuilder $builder, private int $retries) and resolving it from the container fails. What is the container objecting to?', [
            'ReportBuilder must implement an interface before it will resolve',
            'Constructor property promotion is unsupported by the container',
            'Primitives default to zero, so the real failure is elsewhere',
            'Nothing tells the container what value int $retries should hold',
          ], 3, 'Reflection can build a class from a class type-hint but cannot invent a scalar, so the int parameter needs a contextual binding such as when(...)->needs(\'$retries\')->give(3).'),
        ]
      ),
      lesson('Service Providers, Deferred Loading, and Boot Order', 13, `
A stock Laravel 11 application registers roughly thirty service providers before it looks at your route file. Add one that opens a Twilio client inside \`register()\`, and every request pays for it: the health check, the CSS file that missed the CDN, the dashboard that never sends a message. Four milliseconds, on everything.

Deferred providers exist to delete that cost.

### The two phases, in order

1. \`bootstrap/app.php\` builds the container.
2. Every provider's \`register()\` runs, in the order they are listed.
3. Every provider's \`boot()\` runs, in the same order, with the container fully populated.

That ordering is the rule worth memorising. The \`boot()\` of the first provider can safely use a binding declared by the last one, because all registration finished before any booting started. The \`register()\` of the first provider cannot use anything, and the failure depends on list order, which is why it survives local testing and dies in staging.

| Belongs in \`register()\` | Belongs in \`boot()\` |
|---|---|
| \`bind\`, \`singleton\`, \`scoped\`, \`instance\` | routes, policies, event listeners |
| \`mergeConfigFrom\` | Blade directives, view composers |
| \`tag\` | validation rules, model observers |
| nothing that resolves a service | \`publishes()\`, macros |

Need to run after everything, including other packages? \`$this->app->booted(fn () => ...)\` queues a callback for the far side of the whole sequence.

### Deferring a provider

\`\`\`php
// app/Providers/SmsServiceProvider.php
namespace App\\Providers;

use Illuminate\\Contracts\\Support\\DeferrableProvider;
use Illuminate\\Support\\ServiceProvider;

class SmsServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../../config/sms.php', 'sms');

        $this->app->singleton(SmsGateway::class, fn () => new TwilioSmsGateway(
            config('sms.sid'), config('sms.token'),
        ));
    }

    public function provides(): array
    {
        return [SmsGateway::class];
    }
}
\`\`\`

\`provides()\` is a promise: nothing in this provider matters until somebody resolves one of these keys. Laravel writes the promise into \`bootstrap/cache/services.php\` as a map from binding to provider, so the framework can skip the class entirely and still load it the instant \`SmsGateway\` is asked for.

**The trap.** A deferred provider's \`boot()\` does not run until something triggers resolution. Register a route, a listener, a view composer or a Blade directive in there and it silently disappears. No error, no warning, just a route that 404s in production and works locally because your local run happened to send an SMS first. Defer providers that bind services and do nothing else.

**The second trap.** That manifest is cached. Add a key to \`provides()\`, deploy without clearing, and production keeps the old map and throws a binding resolution exception for a binding that is right there in your code. \`php artisan optimize:clear\` on deploy, next to the caches from Chapter 7.

### Registration and package discovery

Laravel 11 lists your providers in \`bootstrap/providers.php\`, and \`php artisan make:provider\` appends to it for you. Packages register themselves through composer metadata:

\`\`\`json
{
  "extra": {
    "laravel": {
      "providers": ["Vendor\\\\Reports\\\\ReportsServiceProvider"]
    }
  }
}
\`\`\`

\`composer install\` runs \`package:discover\` and builds \`bootstrap/cache/packages.php\` from that. To keep a package out of the cycle, list it under \`extra.laravel.dont-discover\` and register it yourself.

### Publishing config, and the shallow merge

\`\`\`php
public function boot(): void
{
    $this->publishes([
        __DIR__.'/../../config/sms.php' => config_path('sms.php'),
    ], 'sms-config');
}
\`\`\`

\`mergeConfigFrom\` merges only the top level of the array. Publish \`config/sms.php\`, then upgrade the package and gain a new \`sms.retry.backoff\` key, and your published file wins the whole \`retry\` sub-array. The new default is never seen. Read the upgrade notes before assuming a package broke.
      `,
        [
          q('You add DeferrableProvider and provides() to a provider whose boot() registers an event listener. The listener stops firing in production. What happened?', [
            'Deferred providers may only run boot() during console commands',
            'Nothing resolved its bindings, so the provider never loaded at all',
            'Event listeners must be registered in register() and never in boot()',
            'The cached manifest stores listeners and is serving a stale copy',
          ], 1, 'A deferred provider is skipped until one of the keys in provides() is resolved, so its boot method never runs on requests that do not touch that service and the listener is never attached.'),
          q('You add a new binding to a deferred provider\'s provides() list and deploy. Production still throws a binding resolution error for it. What is missing from the deploy?', [
            'composer dump-autoload, so the provider class is found again',
            'Re-adding the provider to the bootstrap/providers.php list',
            'queue:restart, because providers are booted inside the worker',
            'optimize:clear, so the cached service manifest is rebuilt',
          ], 3, 'The binding to provider map is cached in bootstrap/cache/services.php, so until that file is regenerated the container has no record that the new key belongs to your deferred provider.'),
          q('Provider A\'s boot() resolves a binding registered by Provider B, which is listed after A in bootstrap/providers.php. Does it work?', [
            'Yes, because every provider registers before any provider boots',
            'No, providers are registered and booted one at a time in order',
            'Only if Provider A is deferred so that it loads later than B',
            'Only when both providers sit below the framework\'s own entries',
          ], 0, 'Laravel runs the whole registration pass first and only then runs the boot pass, so by the time any boot method executes every binding from every provider is already available.'),
        ]
      ),
      lesson('Actions, DTOs, and Models That Stop Growing', 13, `
\`app/Models/Order.php\`, 1,412 lines, 38 public methods. The test that asserts an order total has to fake Stripe, fake the mailer and stub a warehouse API, because \`Order::place()\` does all three before it returns. Nobody planned that file. It grew one reasonable method at a time.

### What a model is for

An Eloquent model describes one table and the shape of the data in it. Relationships, casts, scopes, an accessor that formats a column. That is the job.

| Stays in the model | Moves to an action or a DTO |
|---|---|
| relationships, casts, enums | writes that touch several tables |
| query scopes | calls to systems you do not own |
| accessors over one column | anything a controller and a command both need |
| an observer for a derived column | ordering, retries, transaction boundaries |

The broken version:

\`\`\`php
class Order extends Model
{
    public function place(array $data): void
    {
        $this->fill($data)->save();

        (new StripeClient(config('services.stripe.key')))
            ->paymentIntents->create(['amount' => $data['total']]);

        Mail::to($this->customer_email)->send(new OrderPlaced($this));
        Http::post(config('services.warehouse.url').'/picks', ['order' => $this->id]);
    }
}
\`\`\`

Three external systems, one array of unknown shape, and no transaction. A checkout test now boots half the internet.

### An action owns one job

\`\`\`php
namespace App\\Actions\\Orders;

final class PlaceOrder
{
    public function __construct(private PaymentGateway $payments) {}

    public function handle(PlaceOrderData $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = Order::create($data->toAttributes());

            $this->payments->charge($order->reference(), $data->total);
            OrderPlaced::dispatch($order);

            return $order;
        });
    }
}
\`\`\`

One public method, a verb for a name, dependencies declared in the constructor so the container fills them (Topic 1). The controller resolves it, the console command resolves it, the queued retry resolves it, and all three run identical code. Mail and the warehouse call moved behind \`OrderPlaced\`, so a slow SMTP server no longer holds a customer on the payment page. Chapter 6 explains why that dispatch must be \`afterCommit\` aware.

### DTOs stop shape drift

\`\`\`php
final readonly class PlaceOrderData
{
    public function __construct(
        public string $customerEmail,
        public Money $total,
        public string $shippingMethod,
    ) {}

    public static function fromRequest(PlaceOrderRequest $request): self
    {
        return new self(
            customerEmail:  $request->validated('email'),
            total:          Money::fromMinor($request->validated('total_minor')),
            shippingMethod: $request->validated('shipping'),
        );
    }
}
\`\`\`

Rename \`shipping\` to \`shipping_method\` in the form and the array version fails 200 lines later with \`Undefined array key\`, somewhere inside a job, next Tuesday. The typed version fails at construction, in the controller, naming the property. \`Money\` carries integer minor units rather than a float, for the reason Chapter 3 gave about binary fractions and drifting totals.

### The failure mode of the pattern itself

Actions calling actions calling actions is the old tangle in a new folder. Two rules keep it honest.

One action owns the transaction. The ones it calls never open their own, because a nested \`DB::transaction\` in MySQL is a savepoint: rolling back the inner block leaves the outer one alive and committing, and half your write lands.

Second, an action that takes no dependencies and wraps a single \`->update()\` is a method you moved for no reason. \`$order->markShipped()\` is better placed on the model.

Watch for one more smell: \`OrderService\` with fourteen methods is the fat model wearing a different name. If two of its methods share no dependencies, they were never one class.

### The payoff is the test

\`\`\`php
public function test_a_declined_card_leaves_no_order(): void
{
    $this->mock(PaymentGateway::class)
        ->shouldReceive('charge')->andThrow(new CardDeclined());

    try {
        app(PlaceOrder::class)->handle($this->orderData());
    } catch (CardDeclined) {}

    $this->assertDatabaseCount('orders', 0);
}
\`\`\`

No HTTP request, no route, no session. The container swaps one dependency, the action runs, and the assertion is about the thing you actually care about: a declined card leaves nothing behind. That test is impossible to write cleanly against the 1,412 line model, which is the real argument for moving the code.
      `,
        [
          q('Order::place() saves the row, charges Stripe, sends mail and posts to a warehouse API. Which consequence bites the team first?', [
            'Eloquent rejects methods that are not relationships or scopes',
            'Mass assignment protection blocks the write the method performs',
            'The method cannot be called from a queued job or a command',
            'Every test that touches Order must fake three external systems',
          ], 3, 'Because the orchestration lives on the model, any test that creates or asserts on an order drags in payments, mail and HTTP, which makes the suite slow and brittle long before anything breaks in production.'),
          q('Why does a readonly PlaceOrderData object beat handing $request->validated() straight into the action?', [
            'Arrays cannot be passed through a queue without custom serialisation',
            'A typed object makes a renamed or missing key fail at construction',
            'Validation rules can only be enforced against objects, not arrays',
            'Readonly objects are cached by the container between two requests',
          ], 1, 'An array carries no contract, so a renamed form field surfaces as an undefined key deep inside the flow, whereas a constructor with typed properties rejects the wrong shape immediately at the boundary.'),
          q('Which of these belongs on the Order model rather than in an action class?', [
            'Charging the card and rolling the write back when it is declined',
            'Deciding which warehouse should receive the picking request',
            'A scope restricting a query to orders placed in the last week',
            'Emailing the customer once the shipment leaves the warehouse',
          ], 2, 'A scope is a reusable fragment of a query against the model\'s own table, which is exactly the model\'s job, while the other three coordinate external systems or multiple records.'),
        ]
      ),
      lesson('Singletons, Shared State, and the Long-Lived Container', 13, `
Two weeks after enabling Octane, a support ticket arrives: one customer's invoice PDF carries another customer's billing address. Nothing in the invoice code changed that month. The provider did not change either. What changed is how long the container stays alive.

### How long is a singleton

| Runtime | The container lives for | So \`singleton\` means |
|---|---|---|
| PHP-FPM request | one request | once per request |
| \`queue:work\` | until the worker exits | thousands of jobs |
| Octane worker | until \`octane:reload\` | every request that worker serves |
| Artisan command | one invocation | once |

Under FPM the container is built, used and thrown away inside a few hundred milliseconds, which forgives a great deal. Octane boots the application once and answers requests from memory, so anything you cached in a singleton is now shared with strangers.

The bug, exactly:

\`\`\`php
$this->app->singleton(InvoiceRenderer::class, fn ($app) => new InvoiceRenderer(
    $app['request']->user(),
));
\`\`\`

The first request to reach that worker pins its user into the instance. Every later request on the same worker renders with it. Under FPM this code was correct for years.

### Two fixes

\`\`\`php
// 1. the object holds no request state
$this->app->singleton(InvoiceRenderer::class, fn () => new InvoiceRenderer());
$renderer->for($request->user())->render($invoice);

// 2. the state is per request, so bind it that way
$this->app->scoped(TenantContext::class, fn () => new TenantContext());
\`\`\`

\`scoped\` is the underused one. Octane flushes scoped bindings between requests and a queue worker flushes them between jobs, while under FPM it behaves exactly like \`singleton\`. That makes it the correct default for anything holding the current user, the current tenant, or a per request cache, whether or not you run Octane today.

### Static properties survive everything

\`\`\`php
final class TenantResolver
{
    private static ?Tenant $current = null;   // nothing ever clears this
}
\`\`\`

A static has no owner and no lifecycle, so no runtime can reset it for you. Config written at runtime behaves the same way: \`config(['services.stripe.key' => $tenant->key])\` looks like a scoped override and is actually a permanent change to that worker until the next reload.

Octane gives you a list for the stubborn cases:

\`\`\`php
// config/octane.php
'flush' => [
    App\\Support\\TenantResolver::class,
],
\`\`\`

### Memory is a leak detector

A worker starting at 90 MB and reaching 400 MB over two hours is telling you something is accumulating. Usually a static array, a logger collecting every line, or a collection appended to inside a loop across jobs. Bound the damage while you find it:

\`\`\`bash
php artisan queue:work --memory=256 --max-jobs=1000 --max-time=3600
php artisan octane:reload   # every deploy, for the reason queue:restart exists
\`\`\`

\`--memory\` makes the worker exit cleanly before the OOM killer removes it mid job. \`--max-jobs\` and \`--max-time\` recycle the process on a schedule, which turns a slow leak into a non event rather than a 3am page.

Octane is not the only long-lived runtime you run. Every \`queue:work\` process already boots the container once and keeps it, which means a singleton holding the tenant from job number one is already wrong today, on a stack with no Octane anywhere in it. The reason nobody noticed is that queued jobs rarely display anything to a user, so the wrong value corrupts a row instead of a page.

### The test that catches it early

\`\`\`php
public function test_renderer_does_not_hold_a_user(): void
{
    $this->actingAs($alice)->get('/invoices/1');
    $this->actingAs($bob)->get('/invoices/2')->assertSee('Bob Reyes');
}
\`\`\`

Two requests in one test share a container, which is precisely the Octane condition. A singleton that captured Alice fails here, on your laptop, months before it reaches a customer.
      `,
        [
          q('Under Octane, a singleton built from $app[\'request\']->user() starts showing one customer another customer\'s details. What is the mechanism?', [
            'The instance outlives the request that supplied the user to it',
            'Octane shares one session store across its concurrent workers',
            'auth() returns a shared static that Octane never reassigns',
            'Singletons are rebuilt per worker, so the user is always stale',
          ], 0, 'Octane keeps the booted container in memory, so the first request to reach a worker pins its user inside the singleton and every later request on that worker reuses the same object.'),
          q('What does $this->app->scoped() give you that singleton() does not?', [
            'It limits the binding to classes within the same namespace',
            'It delays construction until the first method call is made',
            'It is flushed between requests and jobs on a long-lived worker',
            'It rebuilds the instance whenever the underlying config changes',
          ], 2, 'A scoped binding resolves once and is then discarded at the end of the request or job, which is why it holds per request state safely on Octane while behaving like a singleton under PHP-FPM.'),
          q('A queue worker climbs from 90 MB to 400 MB over two hours and is killed by the operating system. Which explanation fits best?', [
            'Each job opens a new container that the previous job still holds',
            'A static property on a helper keeps every job\'s rows in memory',
            'The worker caches every model it loads until it is restarted',
            'Failed jobs are held in memory until the whole queue drains',
          ], 1, 'A static has no lifecycle and nothing resets it between jobs, so anything appended to it accumulates for as long as the process runs, which is the classic long-lived worker leak.'),
        ]
      ),
      ],
      [
      q('A provider\'s register() reads config(\'services.stripe.key\') and then calls Storage::disk(\'s3\'). Which line is the real risk?', [
        'config(), because the config repository boots after providers do',
        'Neither, since register() runs once the framework is fully ready',
        'Both, because register() may only contain bind and singleton calls',
        'Storage, because the filesystem provider may not have registered',
      ], 3, 'Registration runs before any provider boots and in list order, so resolving another package\'s service there depends on ordering you do not control, while config is available from the start.'),
      q('A controller type-hints ReportExporter, an interface with three implementations in app/. Nothing is bound anywhere. What happens on that route?', [
        'Laravel selects the first implementation it discovers under app/',
        'The parameter arrives as null and fails on its first method call',
        'Resolution throws, because an interface cannot be instantiated',
        'The route returns 404 since the action signature cannot be matched',
      ], 2, 'Reflection can build concrete classes automatically but has no way to choose between implementations of an interface, so the container raises a binding resolution exception instead of guessing.'),
      q('PlaceOrder::handle() writes an order, adjusts stock and records a payment. Where does the database transaction belong?', [
        'In the action that owns the write, wrapping the whole flow once',
        'In each smaller action, so that every step can roll back alone',
        'In the controller, opened before the action is resolved and run',
        'In the model\'s saving event, which fires closest to the write',
      ], 0, 'One action owns the boundary so that all three writes commit or vanish together, and nesting transactions inside the callees only creates savepoints whose rollback leaves the outer transaction committing.'),
      q('Which habit is harmless under PHP-FPM but dangerous the day the application moves to Octane?', [
        'Binding an interface to a concrete implementation in register()',
        'Caching the current tenant on a static property of a helper class',
        'Building a DTO from the request and passing it into an action',
        'Deferring a provider whose only job is binding a reporting client',
      ], 1, 'A static survives for the life of the process, so on a worker that answers many requests the tenant from the first request leaks into every request after it, whereas FPM discards the process each time.'),
      ]
    ),
    chapter(
      'Advanced Eloquent and Big Tables',
      'The relationships, casts, and query shapes that only appear once the schema is real and the tables hold millions of rows.',
      [
      lesson('Polymorphic Relations and hasManyThrough', 13, `
You ship comments on posts. Six weeks later the product team adds video lessons and wants comments there too, so you copy the table: \`video_comments\`, a second model, a second controller, a second policy. Then invoices need comments. Now you maintain three of everything, and every bug gets fixed three times.

One table, one model:

\`\`\`php
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->morphs('commentable');   // commentable_id, commentable_type, and an index over the pair
    $table->text('body');
    $table->timestamps();
});
\`\`\`

\`\`\`php
class Comment extends Model
{
    public function commentable(): MorphTo { return $this->morphTo(); }
}

class Post extends Model
{
    public function comments(): MorphMany { return $this->morphMany(Comment::class, 'commentable'); }
}
\`\`\`

A row now reads \`commentable_type = 'App\\Models\\Post'\`, \`commentable_id = 412\`.

### The class name in that column is a liability

You just stored a fully qualified PHP class name in the database. Move \`Post\` into \`App\\Models\\Blog\`, or rename it \`Article\`, and 2.3 million rows point at a class that no longer exists. \`$comment->commentable\` returns null on every one of them, and nothing throws. The data is fine, the pointer is not.

\`\`\`php
// AppServiceProvider::boot()
Relation::enforceMorphMap([
    'post'    => \\App\\Models\\Post::class,
    'video'   => \\App\\Models\\Video::class,
    'invoice' => \\App\\Models\\Invoice::class,
]);
\`\`\`

Rows now store \`post\`, four bytes with no opinion about your namespaces. Use \`enforceMorphMap\` rather than \`morphMap\`: the enforcing version throws the moment a model outside the map is saved, so nobody quietly reintroduces class names next sprint. Do this on day one. Retrofitting it means an UPDATE across every polymorphic table you own, run while writes are still arriving.

### What you give up

No foreign key constraint is possible, because the table \`commentable_id\` refers to depends on a value in another column. The database will not stop you orphaning rows, so delete them yourself:

\`\`\`php
protected static function booted(): void
{
    static::deleting(fn (Post $post) => $post->comments()->delete());
}
\`\`\`

Eager loading still works, with a twist worth knowing:

\`\`\`php
Comment::with('commentable')->latest()->take(50)->get();
// 1 query for comments, then 1 more per distinct type present
\`\`\`

Fifty comments spanning posts, videos and invoices cost four queries, not fifty one. To constrain each branch separately, use \`morphWith\`:

\`\`\`php
Comment::with(['commentable' => fn (MorphTo $m) => $m->morphWith([
    Post::class  => ['author'],
    Video::class => ['course'],
])])->get();
\`\`\`

### hasManyThrough skips the middle model

An organisation has many users, and each user has many posts. You want the organisation's posts without loading a single user.

\`\`\`php
class Organisation extends Model
{
    public function posts(): HasManyThrough
    {
        return $this->hasManyThrough(Post::class, User::class);
        // posts.user_id -> users.id, users.organisation_id -> organisations.id
    }
}

$acme->posts()->where('status', 'published')->count();   // one query, one join
\`\`\`

Argument order trips everyone: the far model comes first, the intermediate second. Reverse them and the error names a column you never wrote.

| You want | Reach for |
| --- | --- |
| Comments on several parent types | \`morphMany\` with \`morphTo\` |
| Tags shared across parent types | \`morphToMany\` with \`morphedByMany\` |
| Grandchildren through one hop | \`hasManyThrough\` |
| Only the most recent child | \`hasOne\` plus \`latestOfMany\` |

That last row is the one people reimplement badly, usually by loading every order and sorting in PHP:

\`\`\`php
public function latestOrder(): HasOne
{
    return $this->hasOne(Order::class)->latestOfMany();
}

User::with('latestOrder')->paginate(50);   // one extra query for the whole page
\`\`\`

### The query that gets slow

\`whereHasMorph\` is convenient and expensive:

\`\`\`php
Comment::whereHasMorph('commentable', [Post::class],
    fn ($q) => $q->where('status', 'published'))->get();
\`\`\`

It compiles to one \`EXISTS\` subquery per listed type, each hitting a table with no foreign key to help the planner. Before blaming Eloquent, confirm \`(commentable_type, commentable_id)\` is actually indexed. \`morphs()\` creates that index; hand rolled \`string\` plus \`unsignedBigInteger\` columns do not, and that omission is invisible until the table passes a million rows.
      `,
        [
          q('After two years of comments you move the Post model into a different namespace. The commentable_type column on 2.3 million rows still holds the old fully qualified name. What happens next?', [
            'Eloquent falls back to the table name and still resolves them',
            'Every read of those comments throws a class not found error',
            'The commentable relation resolves to null and nothing warns you',
            'Those rows vanish from any query against the comments table',
          ], 2, 'The type column stores a class name as plain text, so once that class no longer exists Eloquent cannot instantiate a parent and hands back null without raising anything.'),
          q('Why can a polymorphic comments table not carry a foreign key constraint on commentable_id?', [
            'The table it points at changes per row, chosen by another column',
            'Foreign keys are not supported on any composite index in MySQL',
            'Laravel strips constraints from columns the morphs helper builds',
            'The column is nullable, and constraints reject nullable columns',
          ], 0, 'A foreign key names one target table at schema definition time, and a polymorphic column points at whichever table the type column names for that particular row.'),
          q('You write hasManyThrough(User::class, Post::class) on Organisation and the error mentions a column on the users table you never created. What is wrong?', [
            'Post has to declare a belongsToMany back to Organisation first',
            'hasManyThrough requires both foreign keys to be passed explicitly',
            'The intermediate model must be reached through a pivot table',
            'The arguments are reversed, since the far model comes first',
          ], 3, 'The first argument is the model you finally want and the second is the hop in between, so swapping them makes Eloquent look for keys on the wrong pair of tables.'),
        ]
      ),
      lesson('Custom Casts, Value Objects, and JSON Columns', 13, `
Finance sends a spreadsheet. Across 41,882 orders the ledger is out by 63 pence. The culprit is \`decimal(10,2)\`: MySQL hands it back as the string \`"49.90"\`, PHP casts it to a float, tax multiplies it, and rounding scatters half pennies in a direction nobody chose. Floats are wrong for money in every language, and Eloquent will happily give you one.

Store integer pence. Then stop paying for that decision in every template.

### A cast turns columns into an object

\`\`\`php
// app/Support/Money.php
final class Money
{
    public function __construct(
        public readonly int $pence,
        public readonly string $currency = 'GBP',
    ) {}

    public function plus(Money $other): self
    {
        return new self($this->pence + $other->pence, $this->currency);
    }

    public function format(): string
    {
        return number_format($this->pence / 100, 2);
    }
}
\`\`\`

\`\`\`php
// app/Casts/AsMoney.php
class AsMoney implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes): ?Money
    {
        return isset($attributes['total_pence'])
            ? new Money((int) $attributes['total_pence'], $attributes['currency'])
            : null;
    }

    public function set($model, string $key, $value, array $attributes): array
    {
        if (! $value instanceof Money) {
            throw new InvalidArgumentException('total must be a Money instance');
        }

        return ['total_pence' => $value->pence, 'currency' => $value->currency];
    }
}
\`\`\`

\`\`\`php
protected function casts(): array
{
    return ['total' => AsMoney::class];
}

$order->total = new Money(4990, 'GBP');
$order->total->plus(new Money(500))->format();   // 54.90
\`\`\`

There is no \`total\` column. \`set\` returning an array writes several real columns from one property assignment, which is how a value object stays whole in PHP and normalised in SQL.

### The gotcha that eats an afternoon

Eloquent caches the object your cast built and only writes when the property is assigned. Mutating in place changes nothing:

\`\`\`php
$order->total->pence = 5000;   // readonly here, and pointless even if it were not
$order->save();                // isDirty('total') is false, no UPDATE runs
\`\`\`

Assign a fresh instance instead. The same trap has a friendlier version with plain arrays:

\`\`\`php
protected $casts = ['meta' => 'array'];

$post->meta['views'] = 5;   // PHP notice, and the column never changes
\`\`\`

The \`array\` cast decodes into a temporary value, so the write lands on a copy. Swap it for \`AsArrayObject::class\` or \`AsCollection::class\` and in-place writes are tracked and saved.

### JSON columns and the index that is not there

\`\`\`php
Post::where('meta->featured', true)->get();
Post::whereJsonContains('meta->tags', 'laravel')->get();
Post::whereJsonLength('meta->tags', '>', 3)->get();
\`\`\`

Readable, and on 2.1 million posts each one reads every row. MySQL cannot index a JSON column, so there is no shortcut for the planner to take. The fix is a stored generated column carrying the extracted value, which you can index like anything else:

\`\`\`php
DB::statement("ALTER TABLE posts
    ADD COLUMN is_featured TINYINT(1)
    GENERATED ALWAYS AS (JSON_EXTRACT(meta, '$.featured')) STORED");

Schema::table('posts', fn (Blueprint $t) => $t->index('is_featured'));
\`\`\`

Queries keep filtering on \`is_featured\`, writes keep going to \`meta\`, and the database maintains the link.

### Choosing where a value lives

| Shape of the data | Store it as |
| --- | --- |
| Filtered, sorted or joined on | A real column with an index |
| Sparse per-integration settings | A JSON column |
| Many rows per parent | A child table |
| One value with rules attached | Two columns plus a custom cast |

For anything simpler than a value object, an accessor is enough and needs no cast class:

\`\`\`php
protected function initials(): Attribute
{
    return Attribute::make(
        get: fn () => collect(explode(' ', $this->name))->map(fn ($p) => $p[0])->join(''),
    )->shouldCache();
}
\`\`\`

One last variant worth knowing: \`CastsInboundAttributes\` runs only on write. That is what you want for a value you hash or encrypt going in and never reverse coming out, because a two way cast would try to decode a bcrypt digest and fail in a confusing place.
      `,
        [
          q('The meta column uses the array cast. You run $post->meta[\'views\'] = 5 then save, and the column is unchanged. Why?', [
            'The meta column is missing from the fillable allow list',
            'The cast decodes into a copy, so the write never reaches the model',
            'Array casts are read only unless the column type is JSON',
            'Saving skips any attribute whose cast returned an object',
          ], 1, 'The array cast rebuilds a fresh PHP array each time you read the attribute, so an offset written on that temporary value is discarded and the model is never marked dirty.'),
          q('Your AsMoney cast returns an array of total_pence and currency from its set method. What does assigning $order->total = new Money(4990, \'USD\') actually do?', [
            'Serialises the whole Money object into a single total column',
            'Stores the pence value and silently discards the currency',
            'Stages nothing until each underlying column is saved by hand',
            'Fills both underlying columns from that one property assignment',
          ], 3, 'When a cast returns an array from set, Eloquent treats the keys as attribute names, so one assignment writes every column the value object spans.'),
          q('A filter written as where(\'meta->featured\', true) reads all 2.1 million posts even though the meta column is JSON. What fixes it properly?', [
            'A stored generated column holding the value, with an index on it',
            'Casting meta with AsArrayObject so the flag compares as a boolean',
            'Switching to whereJsonContains, which can use the JSON index',
            'Storing meta as text and indexing the first hundred characters',
          ], 0, 'MySQL cannot build an index over a JSON document, so the value has to be materialised into a generated column that a normal B-tree index can cover.'),
        ]
      ),
      lesson('Subquery Selects, Aggregates, and Reporting Queries', 14, `
The admin customers screen lists 50 users with their order count, lifetime spend and last order date. It fires 151 queries and takes 2.4 seconds. The instinct is to replace it with one big join. The join is faster and the numbers are wrong.

### The join that invents revenue

\`\`\`sql
select users.id,
       sum(orders.total_pence) as spend,
       count(refunds.id)       as refunds
from users
join orders  on orders.user_id  = users.id
join refunds on refunds.user_id = users.id
group by users.id;
\`\`\`

A customer with 6 orders and 2 refunds produces 12 rows before grouping, so every order total is summed twice and the refund count is multiplied by six. The page looks plausible. Spend is exactly double, which is the worst kind of wrong, because it stays wrong quietly until someone reconciles against the payment provider.

Two hasMany relations in one join always multiply. There is no \`group by\` clause that undoes it.

### Correlated aggregates cannot multiply

\`\`\`php
User::withCount('orders')
    ->withSum('orders as spend_pence', 'total_pence')
    ->withMax('orders as last_order_at', 'created_at')
    ->withCount('refunds')
    ->paginate(50);
\`\`\`

Each helper becomes its own subquery inside the SELECT list, evaluated per user row. No row explosion is possible because no rows are joined. Two queries serve the page, down from 151.

The trap: \`withSum\` on a relation with no rows returns \`null\`, not \`0\`. A dashboard doing \`$user->spend_pence / 100\` works for months and then divides null the first time a customer signs up without ordering. Coalesce it in the query or default it on the model.

### addSelect for everything else

\`\`\`php
User::addSelect(['last_order_ref' => Order::select('reference')
        ->whereColumn('orders.user_id', 'users.id')
        ->latest()->limit(1),
    ])
    ->orderByDesc(Order::select('created_at')
        ->whereColumn('orders.user_id', 'users.id')
        ->latest()->limit(1))
    ->paginate(50);
\`\`\`

\`whereColumn\` is what correlates the subquery to the outer row, and \`limit(1)\` is mandatory: a subquery in a SELECT list that returns two rows is a SQL error, not a Laravel one, so the message arrives from the driver with no hint about which relation caused it.

### Grouping by day, and the two traps in it

\`\`\`php
Order::selectRaw('DATE(created_at) as day, count(*) as orders, sum(total_pence) as pence')
    ->where('created_at', '>=', now()->subDays(30))
    ->groupBy('day')
    ->orderBy('day')
    ->get();
\`\`\`

First trap: \`DATE(created_at)\` wraps the column in a function, so it cannot use an index. Keep the plain \`where\` on \`created_at\` as well, exactly as written above, and the index narrows the scan to 30 days before the grouping runs.

Second trap: your timestamps are UTC. A shop in Karachi sees Monday start at 5am, and the daily chart is quietly offset for every customer outside London. Convert inside SQL, or store a \`local_day\` column at write time:

\`\`\`sql
DATE(CONVERT_TZ(created_at, '+00:00', '+05:00')) as day
\`\`\`

Also remember \`where\` filters rows and \`having\` filters groups. Filtering on \`count(*)\` in a \`where\` clause is an error every reporting query gets wrong once.

### Reports should not hydrate models

\`\`\`php
Order::selectRaw('DATE(created_at) as day, sum(total_pence) as pence')
    ->groupBy('day')->toBase()->get();          // plain stdClass rows

DB::table('orders')->where('status', 'paid')->lazy(2000)
    ->each(fn ($row) => fputcsv($handle, (array) $row));   // streams, constant memory
\`\`\`

Building 200,000 Eloquent objects to add up one column is where an export runs out of memory even though the SQL returned in 300ms. \`toBase()\` keeps the query builder and drops the hydration; \`lazy()\` keeps memory flat while you write a file. Neither changes a single character of your SQL.

### When the query itself is the problem

Past a few million rows no amount of subquery cleverness saves a report that scans a year of orders on every page load. Precompute it. A scheduled command (Chapter 6) writes one row per day into \`order_daily_stats\`, and the dashboard reads 365 tiny rows instead of aggregating 4 million:

\`\`\`php
DB::table('order_daily_stats')->upsert(
    $rows,                        // ['day' => '2026-08-24', 'orders' => 812, 'pence' => 4_119_050]
    ['day'],                      // unique by
    ['orders', 'pence'],          // columns to update on conflict
);
\`\`\`

\`upsert\` makes the job safe to rerun, which matters the morning you discover yesterday's numbers were computed while a batch of payments was still settling.
      `,
        [
          q('You join users to orders and to refunds, group by user id, and sum order totals. A customer with 6 orders and 2 refunds shows exactly twice their real spend. What went wrong?', [
            'Refund rows carry negative totals that the sum has inverted',
            'MySQL evaluates the sum before the second join is applied',
            'The group by clause is missing the refunds id column',
            'The two joins multiply, so each order row appears twice',
          ], 3, 'Joining two separate hasMany relations produces the cross product of their rows, so every order is repeated once per matching refund and the sum counts it that many times.'),
          q('A dashboard divides spend_pence by 100 for every row returned by withSum. It runs fine for months, then fails when a customer who has never ordered appears. What is that column?', [
            'Zero, because SQL aggregates always default to zero',
            'Null, because the correlated subquery matched no rows',
            'An empty string produced by the missing relation',
            'Absent, since the column is dropped for that row',
          ], 1, 'A sum over an empty result set is null rather than zero, so the value has to be coalesced in the query or defaulted on the model before arithmetic touches it.'),
          q('A CSV export of 200,000 orders exhausts memory although the SQL itself returns in under a second. Which change addresses the actual cause?', [
            'Wrapping the whole export inside one database transaction',
            'Adding a composite index over the two columns being sorted',
            'Calling toBase so the rows arrive without model hydration',
            'Raising the PHP memory limit on the queue worker process',
          ], 2, 'The memory goes on building 200,000 Eloquent objects rather than on the query, so dropping down to the base builder removes the hydration that never had a purpose here.'),
        ]
      ),
      lesson('Ten Million Rows: Archiving, Partitions, and Read Replicas', 14, `
\`activity_log\` holds 9.4 million rows and 31 GB. \`select count(*)\` takes 14 seconds. The nightly backup went from 8 minutes to 3 hours, and nobody has read a row older than 30 days since launch. The table is not slow because your queries are bad. It is slow because it is enormous, and every technique below is about making it smaller or making the reads avoid it.

### Deleting is the dangerous part

\`\`\`php
ActivityLog::where('created_at', '<', now()->subDays(90))->delete();
\`\`\`

That is one statement wrapping 8.1 million row deletions in one transaction. The undo log grows for the whole run, replicas fall 20 minutes behind, other writers queue behind locks, and if it hits the 40 minute timeout the entire thing rolls back. Forty minutes of load, zero rows deleted, and it looks exactly like nothing happened.

Batch it instead:

\`\`\`php
do {
    $deleted = DB::table('activity_log')
        ->where('created_at', '<', now()->subDays(90))
        ->limit(5000)
        ->delete();

    usleep(200_000);   // let replicas breathe
} while ($deleted > 0);
\`\`\`

Short transactions, interruptible at any point, replication lag stays flat. One surprise remains: InnoDB does not hand the space back to the filesystem. The 31 GB file stays 31 GB, reused internally for new rows, until you rebuild the table.

### Partitions turn deletion into a metadata change

\`\`\`sql
ALTER TABLE activity_log
PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p2026_06 VALUES LESS THAN (TO_DAYS('2026-07-01')),
    PARTITION p2026_07 VALUES LESS THAN (TO_DAYS('2026-08-01')),
    PARTITION pmax     VALUES LESS THAN MAXVALUE
);

ALTER TABLE activity_log DROP PARTITION p2026_06;   -- milliseconds, space returned
\`\`\`

The rule that catches everyone: every unique key, primary key included, must contain the partitioning column. So the key becomes \`(id, created_at)\`, and any foreign key pointing into the table has to go, because InnoDB will not partition a table involved in one. Run all of this through \`DB::statement()\` in a migration; the schema builder has no vocabulary for partitions.

### Pagination breaks before the table does

\`paginate(25)\` on page 4,000 issues \`limit 25 offset 99975\`. The database reads and discards 99,975 rows, then runs a separate \`count(*)\` over the whole table for the page links. Both costs grow every day.

\`\`\`php
ActivityLog::orderBy('id')->cursorPaginate(25);
// select * from activity_log where id > 4318221 order by id limit 26
\`\`\`

Constant time at any depth, and no count query at all. The price: no jump-to-page-500 links, and the sort column must be unique or rows near a boundary get skipped or repeated.

### Read replicas, and the 404 that only happens in production

\`\`\`php
'mysql' => [
    'read'   => ['host' => ['10.0.1.22', '10.0.1.23']],
    'write'  => ['host' => ['10.0.1.10']],
    'sticky' => true,
],
\`\`\`

Laravel routes every SELECT to a replica and everything else to the writer. Here is the bug that follows within a week: you create an order, redirect to its show page, and \`findOrFail\` throws a 404 because the replica is 40ms behind. It reproduces roughly once in 300 requests, never locally, and never in a test suite that runs on one connection.

\`sticky => true\` pins reads to the writer for the remainder of any request that has written. It does not help a queued job, which runs in a different process:

\`\`\`php
ProcessOrder::dispatch($order)->afterCommit();

// inside the job, when correctness beats load
$order = Order::on('mysql::write')->findOrFail($this->orderId);
\`\`\`

| Symptom | First thing to reach for |
| --- | --- |
| Backups and DDL crawling | Archive or partition old rows |
| Deep pages timing out | \`cursorPaginate\` |
| Read load saturating one box | Replicas with \`sticky\` |
| Job cannot find a row it was given | \`afterCommit\` and the write connection |
      `,
        [
          q('A single delete statement removing 8.1 million rows times out after 40 minutes. What state is the table left in?', [
            'Unchanged, because the rollback restored every deleted row',
            'Roughly half emptied, as far as the statement had reached',
            'Fully emptied, since the delete committed before timing out',
            'Locked for reads until the database server is restarted',
          ], 0, 'The delete ran inside one transaction, so a timeout rolls the whole thing back and forty minutes of load leaves the table exactly as it was.'),
          q('Page 4,000 of a paginated log viewer takes 9 seconds while page 1 is instant. Why does cursorPaginate remove the problem?', [
            'It caches each page once the first visitor has requested it',
            'It shrinks the page size automatically as the depth grows',
            'It seeks with a where clause rather than skipping rows',
            'It drops the ordering, so no sort work has to happen',
          ], 2, 'Offset pagination makes the database read and throw away every earlier row, while a cursor jumps straight to the key it was given and reads only the page it needs.'),
          q('After creating an order you redirect to its show page, which returns a 404 for roughly one request in 300, only in production. What is the most likely cause?', [
            'The insert is queued and the job has not run yet',
            'The read went to a replica that has not caught up',
            'Route model binding cached the missing id briefly',
            'The generated order id collided with an existing row',
          ], 1, 'Reads are routed to a replica that lags the writer by a few milliseconds, so a lookup issued immediately after the insert can arrive before the row has replicated.'),
        ]
      ),
      ],
      [
      q('Why is Relation::enforceMorphMap the better default for an application that keeps adding polymorphic types?', [
        'It rewrites existing rows to the short alias when the app boots',
        'It throws as soon as a model outside the map is being stored',
        'It adds the composite index that the morphs helper leaves out',
        'It lets one alias resolve to two different model classes',
      ], 1, 'The enforcing version fails loudly when an unmapped model is used, which stops a new type from quietly writing class names into the type column again.'),
      q('You mutate the Money object returned by $order->total and then call save, but the row does not change. What is the fix?', [
        'Add total to the fillable array declared on the Order model',
        'Call refresh on the model before touching the value object',
        'Assign a new Money instance to the property, then save',
        'Declare the cast class as an inbound only cast instead',
      ], 2, 'Eloquent only marks an attribute dirty when it is assigned, so a value object has to be replaced rather than edited in place for the change to be written.'),
      q('Which way of fetching an order count and a lifetime spend on one page is safe from row multiplication?', [
        'A join to orders plus a join to refunds, grouped by user',
        'A sum over order totals joined to the shipments table',
        'A count from one join added to a sum from a second join',
        'withCount and withSum, each compiled as its own subquery',
      ], 3, 'The relation aggregate helpers run as correlated subqueries in the select list, so no extra rows are ever joined onto the outer query and nothing can be double counted.'),
      q('You partition activity_log monthly by range on created_at. Which schema change does that force?', [
        'Every unique key must include the created_at column itself',
        'The primary key has to be replaced by a uuid column',
        'The model must stop maintaining timestamps on that table',
        'The created_at column has to be converted to an integer',
      ], 0, 'MySQL can only guarantee uniqueness within a partition, so it requires the partitioning column to appear in every unique key including the primary key.'),
      ]
    ),
    chapter(
      'External Services, Webhooks, and Payments',
      'Calling systems you do not control, accepting calls you did not initiate, and moving money without ever charging anyone twice.',
      [
      lesson('The HTTP Client: Timeouts, Retries, and Backoff', 13, `
A shipping provider's API slowed from 180ms to 40 seconds one Tuesday morning. Nothing in the application changed, and the provider never returned a single error. Within four minutes every PHP-FPM worker was parked inside an open socket, the health check could not get a worker of its own, and the load balancer pulled the whole site out of rotation. Twenty workers holding a 30 second call means a throughput of 0.66 requests per second. That is what an unbounded outbound call does: it turns somebody else's latency into your outage.

### Two timeouts, and they measure different things

\`\`\`php
$response = Http::connectTimeout(2)
    ->timeout(5)
    ->get('https://api.shippo.com/shipments/sh_9f21');
\`\`\`

| What the provider does | connectTimeout(2) | timeout(5) |
|---|---|---|
| Host unreachable, no SYN back | Fires at 2s | Never reached |
| Accepts the connection, sends nothing | Does not fire | Fires at 5s |
| Streams a huge response slowly | Does not fire | Fires at 5s, mid body |

Laravel gives the client a 30 second request timeout and a 10 second connect timeout by default. Raw Guzzle gives you neither: its default is no timeout at all, which is why a legacy service class built on \`new Client()\` can hang past \`max_execution_time\`. On Linux that setting does not count time spent blocked in a socket read, so the request runs until something upstream kills it.

Pick numbers from the provider's own p99, not from hope. A 4 second timeout on an API that answers in 200ms is generous; a 30 second one is a hostage note.

### Retries spend a budget you have to count

\`\`\`php
Http::timeout(4)
    ->retry(3, 200, throw: false)
    ->withHeaders(['Idempotency-Key' => $order->uuid])
    ->post('https://api.stripe.com/v1/payment_intents', $payload);
\`\`\`

\`retry(3, 200)\` means three attempts in total, not three extras. Against a provider that hangs on every attempt the caller waits 3 x 4s plus 2 x 200ms, so roughly 12.4 seconds. If your own request budget is 3 seconds, that config is a slower failure, not a recovery.

Back off instead of hammering, and retry only what is worth retrying:

\`\`\`php
use Illuminate\\Http\\Client\\ConnectionException;
use Illuminate\\Http\\Client\\RequestException;

Http::retry(3, fn (int $attempt) => $attempt * 250, function (Throwable $e) {
    return $e instanceof ConnectionException
        || ($e instanceof RequestException && $e->response->status() >= 500)
        || ($e instanceof RequestException && $e->response->status() === 429);
})->get('https://api.shippo.com/rates');
\`\`\`

A 422 will be a 422 again in 250ms. Retrying it wastes the budget and hides the real bug, which is the payload you sent.

**The mistake that costs money:** wrapping a create call in \`retry()\` with no idempotency key. A timeout is not proof the request failed to arrive. The provider may have created the charge, then lost the response on the way back, and your second attempt creates a second charge. The key makes the retry a read of the first result instead of a new write.

### Failures are not exceptions unless you ask

The client does not throw on 4xx or 5xx. \`$response->failed()\` is true, \`$response->status()\` tells you which, and \`$response->json()\` still holds the provider's error body, which is usually the only useful diagnostic. \`retry()\` is the exception to that rule: after the final attempt it throws a \`RequestException\` unless you pass \`throw: false\`.

### Configure the provider once, not at every call site

\`\`\`php
// AppServiceProvider::boot()
Http::macro('shipping', fn () => Http::baseUrl('https://api.shippo.com')
    ->timeout(4)
    ->connectTimeout(2)
    ->retry(2, 250)
    ->withToken(config('services.shippo.token')));
\`\`\`

Every call becomes \`Http::shipping()->get('/shipments/sh_9f21')\`. When the provider gets slow you change one file, and \`Http::fake()\` in tests intercepts all of it.

The safest outbound call is still the one nobody is waiting on. Move it into a queued job from Chapter 6 and a timeout costs you a retry rather than a request.
      `,
        [
          q('Your client sets connectTimeout(2) and timeout(5). The provider accepts the TCP connection instantly, then sends no bytes at all. What happens?', [
            'The connect timeout fires two seconds into the call',
            'Guzzle hands control back once max_execution_time hits',
            'The call returns a failed response after two seconds',
            'The request timeout ends the call after five seconds',
          ], 3, 'connectTimeout only covers getting a connection established, and that part already succeeded, so the overall request timeout is the limit that eventually ends the call.'),
          q('You are adding retry(3) to four different calls. Which one is dangerous without an idempotency key?', [
            'POST /v1/payment_intents, which creates a charge',
            'GET /v1/customers/cus_9f21, which reads one record',
            'GET /v1/prices, which lists your published plans',
            'HEAD /v1/files/file_88, which checks a file size',
          ], 0, 'A timeout is not proof the request failed to arrive, so a create call may already have taken effect and the retry produces a second charge unless the key lets the provider recognise it.'),
          q('Http::timeout(4)->retry(3, 200) runs against a provider that hangs on every attempt. Roughly how long does the caller wait?', [
            'About 4 seconds, since the timeout caps the whole call',
            'About 12 seconds, three attempts plus two backoff waits',
            'About 16 seconds, four attempts plus three backoff waits',
            'About 600 milliseconds, since the backoff dominates it',
          ], 1, 'retry(3) counts three attempts in total rather than three extras, so the wait is three four second timeouts with two 200ms sleeps between them.'),
        ]
      ),
      lesson('Circuit Breakers and Degrading Without Dying', 13, `
Retries make an outage worse. A recommendations API started returning 500s at 09:14 while the site was serving 200 requests a second. \`retry(3)\` turned that into 600 requests a second aimed at a service that was already falling over, so its own autoscaler never caught up. Meanwhile every page paid three timeouts before it rendered and p95 went from 240ms to 12 seconds. The provider was broken for twenty minutes. The site was broken for twenty minutes and change, for a feature that shows five product thumbnails.

A circuit breaker fixes the second half of that: stop calling something you already know is down.

### Three states, one counter

| State | Behaviour | Leaves when |
|---|---|---|
| Closed | Calls go out, failures counted | Failures hit the threshold |
| Open | Calls fail instantly, nothing leaves the box | Cooldown expires |
| Half open | Exactly one probe is allowed through | Probe succeeds or fails |

Laravel ships no breaker, but the cache is enough:

\`\`\`php
namespace App\\Support;

use Illuminate\\Support\\Facades\\Cache;

class Breaker
{
    public function __construct(
        private string $name,
        private int $threshold = 5,
        private int $cooldown = 30,
    ) {}

    public function allows(): bool
    {
        if (! Cache::has("cb:{$this->name}:open")) {
            return true;
        }
        return Cache::lock("cb:{$this->name}:probe", 5)->get();   // half open
    }

    public function succeeded(): void
    {
        Cache::forget("cb:{$this->name}:fails");
        Cache::forget("cb:{$this->name}:open");
    }

    public function failed(): void
    {
        Cache::add("cb:{$this->name}:fails", 0, 60);              // seed with a TTL
        if (Cache::increment("cb:{$this->name}:fails") >= $this->threshold) {
            Cache::put("cb:{$this->name}:open", 1, $this->cooldown);
        }
    }
}
\`\`\`

**The line people delete because it looks redundant** is the \`Cache::add\`. On Redis, \`increment\` on a missing key creates it with no expiry at all. Without the seed, five unrelated blips spread across three weeks add up to a threshold, the breaker opens, and thirty seconds later it opens again, forever, while the provider sits there perfectly healthy. The seed makes the count a rolling window instead of a lifetime total.

Second trap: \`file\` and \`array\` cache drivers do not increment atomically across processes. Under real concurrency the count is wrong in the direction that matters. Put breaker state in Redis or Memcached.

### A breaker is only as fast as your timeout

Threshold 5, timeout 30 seconds, one call per request. You burn 150 worker-seconds before the breaker learns anything, and during that time the queue of waiting requests is what actually takes the site down. Short timeouts feed the breaker its evidence quickly, which is why they come first.

### Degrading is a product decision, not a technical one

| Dependency down | Wrong answer | Right answer |
|---|---|---|
| Recommendations | 500 page | Hide the shelf |
| Address autocomplete | Block checkout | Plain text field, verify by job |
| Avatar service | Broken image icons | Initials placeholder |
| Card payment | Silent retry loop | Refuse clearly, take no order |

Decoration degrades. Anything that moves money refuses loudly, because a half-finished payment is more expensive than a rejected one.

\`\`\`php
$recs = $breaker->allows()
    ? rescue(fn () => Http::recs()->timeout(2)->get("/for/{$user->id}")->json(), null)
    : null;

if ($recs === null) {
    $breaker->failed();
}

return view('home', ['recs' => $recs ?? Cache::get('recs:last_good', [])]);
\`\`\`

\`rescue()\` swallows the exception, reports it to your error tracker, and hands back the fallback. A cached last known good response beats an empty shelf, and an empty shelf beats an error page.

### Make it visible

Log a warning with the service name when the breaker opens, and emit a metric. A breaker that trips silently has not shortened your outage, it has only made it quieter and harder to explain the next morning when someone asks why conversions dipped for an hour.
      `,
        [
          q('A breaker counts failures with Cache::increment on Redis and never seeds the key first. What goes wrong weeks later?', [
            'The counter resets on each deploy, so it never opens',
            'Redis refuses the increment once it passes the threshold',
            'The key never expires, so ancient failures still count',
            'It opens correctly but can never reach the half open state',
          ], 2, 'Incrementing a key that does not exist creates it with no expiry, so unrelated blips accumulate for as long as Redis keeps the key and eventually trip a breaker on a healthy service.'),
          q('Why does a circuit breaker help far more when your HTTP timeout is 3 seconds than when it is 30?', [
            'A short timeout makes the failing provider recover sooner',
            'The client only reports failures on calls under five seconds',
            'Half open probes are skipped entirely on long timeouts',
            'It learns about the failures before your workers all fill up',
          ], 3, 'The breaker needs several failures before it opens, and with a long timeout those failures take so long to accumulate that the pile of waiting requests has already taken the site down.'),
          q('The recommendations API is down and the breaker is open. What should the product page do?', [
            'Render the page with the recommendation shelf hidden',
            'Return a 503 so the visitor knows something is broken',
            'Queue the page render and email it once the API returns',
            'Retry inline until the cooldown expires, then render it',
          ], 0, 'Recommendations are decoration rather than something the purchase depends on, so the page should drop that section and still sell the product instead of failing the whole request.'),
        ]
      ),
      lesson('Receiving Webhooks: Signatures, Replay, and Idempotency', 13, `
Here is a complete attack against an endpoint that many applications ship:

\`\`\`bash
curl -X POST https://app.example.com/webhooks/acme \\
  -H 'Content-Type: application/json' \\
  -d '{"type":"invoice.payment_succeeded","data":{"id":"in_1P9k"}}'
\`\`\`

If the handler reads \`$request->input('type')\` and marks that invoice paid, anyone with curl and a plausible id gets the product for free. The access log entry is indistinguishable from a real delivery. A webhook route is a public, unauthenticated POST endpoint that writes to your database, so treat it like one.

### Three things every webhook route needs

CSRF exemption, a signature check, and a fast response. Miss the first and Laravel answers 419, the provider retries for days, and someone eventually declares the integration broken. In Laravel 11 and 12:

\`\`\`php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: ['webhooks/*']);
})
\`\`\`

Routes registered in \`routes/api.php\` skip the web group entirely and need no exemption.

### Verify against the raw bytes

\`\`\`php
public function handle(Request $request)
{
    $payload   = $request->getContent();   // the exact bytes that arrived
    $timestamp = (int) $request->header('X-Acme-Timestamp');
    $expected  = hash_hmac('sha256', "{$timestamp}.{$payload}", config('services.acme.secret'));

    if (! hash_equals($expected, (string) $request->header('X-Acme-Signature'))) {
        return response('bad signature', 400);
    }

    if (abs(time() - $timestamp) > 300) {
        return response('stale', 400);       // a captured request stops working
    }
    // ...
}
\`\`\`

**The bug that costs an afternoon:** signing \`json_encode($request->all())\` instead of \`$request->getContent()\`. An HMAC is computed over bytes, and the round trip through PHP changes them: spacing disappears, \`é\` becomes a literal e-acute or the reverse, and \`1.0\` comes back as \`1\`. Every signature fails, and the only log line you get says invalid signature, which points at the secret rather than the encoding. Read the raw body.

Two smaller details in that snippet earn their place. \`hash_equals\` compares in constant time, so an attacker cannot narrow down a signature by measuring how fast you reject it. And the timestamp inside the signed string is what stops replay: without it, one captured valid request stays valid forever.

### Deliveries repeat, so make them harmless

Providers retry on timeouts and 5xx, and occasionally send the same event twice with nothing wrong at all. Design for at least once delivery by writing the provider's event id under a unique index before you do anything else:

\`\`\`php
$inserted = WebhookEvent::insertOrIgnore([
    'id'          => $event['id'],        // evt_1P9kX2, the primary key
    'type'        => $event['type'],
    'received_at' => now(),
]);

if ($inserted === 0) {
    return response()->noContent();       // already handled, say nothing more
}

ProcessAcmeEvent::dispatch($event['id'])->afterCommit();

return response()->noContent();
\`\`\`

The database is doing the deduplication, atomically, even when two deliveries land on two web servers in the same millisecond. A \`WebhookEvent::where('id', ...)->exists()\` check followed by a create does not survive that race.

### Answer in milliseconds, do the work later

Stripe allows about 20 seconds; some providers allow 5. A handler that renders a PDF inline for 25 seconds gets timed out and redelivered, so one payment produces three receipts. Verify, store, dispatch, return 204. Nothing else.

| You return | The provider does |
|---|---|
| 2xx | Marks it delivered and stops |
| 4xx | Usually gives up, event lost for good |
| 5xx or timeout | Retries with backoff, often for days |

That table is why \`return response('ok', 200)\` inside a \`catch\` block is dangerous: you have just told the provider to forget an event you failed to process. Let it 500 and take the retry.

Last thing, and it surprises people: events arrive out of order. \`invoice.paid\` can land before \`customer.subscription.created\`. Treat each event as a signal that something changed, then read current state from the API rather than replaying a sequence nobody promised you.
      `,
        [
          q('A handler computes its HMAC over json_encode($request->all()) and every signature fails. Why?', [
            'all() drops the fields the provider signs, such as the id',
            'The signature covers the exact bytes sent, not a re-encoding',
            'json_encode sorts keys, and the provider signs them unsorted',
            'Laravel strips the signature header before the handler runs',
          ], 1, 'An HMAC is computed over the raw payload byte for byte, and decoding then re-encoding the JSON changes whitespace, unicode escaping and number formatting, so the digest can never match.'),
          q('Your webhook handler renders a PDF inline and takes 25 seconds. What does the provider do?', [
            'It waits for your 2xx, because webhooks have no deadline',
            'It marks the event failed and drops it without retrying',
            'It times out and redelivers, so the work runs a second time',
            'It splits the event into several smaller deliveries for you',
          ], 2, 'Providers give a handler somewhere between five and twenty seconds, and anything slower counts as a failed delivery that gets retried, which is how one payment produces three receipts.'),
          q('Deliveries can repeat even when nothing failed. Which design makes a repeat harmless?', [
            'Wrap the whole handler body in a database transaction',
            'Compare the event timestamp against the last one you saw',
            'Return 400 whenever the payload looks like one seen before',
            'Store the provider event id under a unique index first',
          ], 3, 'The unique index makes the database itself reject the second copy atomically, so two simultaneous deliveries on two web servers still result in exactly one piece of work.'),
        ]
      ),
      lesson('Subscriptions, Invoices, and Reconciling With Cashier', 13, `
A customer cancelled in Stripe's billing portal in March. The \`users.plan\` column still said \`pro\` in November, because that column was written once at checkout and nothing ever wrote it again. Eight months of a paid product given away by a boolean nobody was maintaining. The same column is why a customer whose card expired kept full access, and why a refunded account still counted in the monthly revenue chart.

### One rule prevents most billing bugs

Stripe owns billing state. Your database holds a mirror of it. Webhooks keep the mirror fresh, and nothing in the application ever decides subscription state on its own.

Cashier is that mirror, already written:

\`\`\`bash
composer require laravel/cashier
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
\`\`\`

The \`Billable\` trait on \`User\` adds \`stripe_id\`, and the migrations add \`subscriptions\` and \`subscription_items\` tables carrying \`stripe_status\`, \`trial_ends_at\` and \`ends_at\`. Starting a subscription is one chain:

\`\`\`php
return $user->newSubscription('default', 'price_1P9kX2GrowthMonthly')
    ->trialDays(14)
    ->checkout([
        'success_url' => route('billing.done'),
        'cancel_url'  => route('billing'),
    ]);
\`\`\`

Hosted Checkout keeps card numbers off your servers entirely, which keeps you in the cheapest PCI tier rather than the one with the audit.

### Gate on Cashier, never on a column you wrote

\`\`\`php
// broken: written at checkout, never updated again
if ($user->plan === 'pro') {
    return $this->grantAccess();
}

// correct: reads the mirrored stripe_status and ends_at
if ($user->subscribed('default')) {
    return $this->grantAccess();
}
\`\`\`

Two defaults surprise nearly everyone:

| Behaviour | What it actually means |
|---|---|
| \`cancel()\` keeps access to period end | \`subscribed()\` stays true, \`onGracePeriod()\` true, \`canceled()\` true |
| \`past_due\` still counts as subscribed | A failed card keeps full access until you change it |

Call \`Cashier::deactivatePastDue()\` in \`AppServiceProvider::boot()\` if a failed payment should close the door partway through dunning rather than never. And use \`cancelNow()\` only when you really mean it, because it throws away time the customer already paid for.

### Wire the webhook or none of the above is true

Cashier registers \`POST /stripe/webhook\` for you. Set \`STRIPE_WEBHOOK_SECRET\`, exempt the path from CSRF as in the previous topic, and create the endpoint with \`php artisan cashier:webhook\`. Subscribe at minimum to \`customer.subscription.updated\`, \`customer.subscription.deleted\`, \`invoice.payment_succeeded\` and \`invoice.payment_failed\`. Those four events are the only reason your mirror ever changes after checkout.

**Never treat \`success_url\` as proof of payment.** It is a browser redirect: a curious user can type it, a mobile browser can fire it twice, and a payment that needs 3D Secure can settle minutes after the redirect. Grant access when the webhook says the subscription is active, and show a friendly "setting up your account" state in between.

### Reconcile, because webhooks get lost

An endpoint that 500s for an hour, a rotated secret, a deploy that renamed the route: each one silently desynchronises the mirror, and nothing in the application notices. A nightly command catches drift while it is still one customer instead of forty.

\`\`\`php
Subscription::where('stripe_status', 'active')->chunkById(200, function ($subs) {
    foreach ($subs as $sub) {
        $remote = Cashier::stripe()->subscriptions->retrieve($sub->stripe_id);

        if ($remote->status !== $sub->stripe_status) {
            Log::warning('billing drift', [
                'subscription' => $sub->stripe_id,
                'local'        => $sub->stripe_status,
                'stripe'       => $remote->status,
            ]);
            $sub->update(['stripe_status' => $remote->status]);
        }
    }
});
\`\`\`

Log the drift as well as correcting it. A count of zero every night is your only evidence that webhooks are actually arriving.

Plan changes deserve the same deliberateness: \`swap()\` prorates on the next invoice, \`swapAndInvoice()\` charges the difference immediately, \`noProrate()\` waits for the cycle to turn. Test all of it against Stripe test clocks and \`stripe listen --forward-to localhost:8000/stripe/webhook\`, never against a live key.
      `,
        [
          q('A customer cancels inside Stripe\'s billing portal. What stops your app serving them for months afterwards?', [
            'Reading the plan column that checkout wrote once',
            'The subscription webhook updating the mirrored status',
            'A daily job emailing cancellations through to support',
            'Checking the success_url redirect on their next login',
          ], 1, 'Cashier updates stripe_status and ends_at when the customer.subscription.updated event arrives, which is the only signal the application gets about a change made outside it.'),
          q('A card fails and Stripe moves the subscription to past_due. What does subscribed(\'default\') return by default?', [
            'True, until you call Cashier::deactivatePastDue()',
            'False, because a failed payment ends a subscription',
            'True, but only while the grace period has not expired',
            'False, unless that customer is still inside their trial',
          ], 0, 'Cashier keeps past due subscriptions valid so customers are not locked out mid dunning, so you have to opt in explicitly if a failed payment should remove access.'),
          q('Why is a visitor landing on success_url not proof that their subscription is paid?', [
            'Cashier writes that row only during the nightly reconcile',
            'Stripe encrypts the session id, so it cannot be read yet',
            'It is a browser redirect, and 3D Secure can settle later',
            'The redirect fires before the customer has entered a card',
          ], 2, 'Anyone can request that URL directly and a payment requiring extra authentication can confirm minutes after the browser comes back, so only the webhook confirms the money moved.'),
        ]
      ),
      ],
      [
      q('A payment provider slows to 40 seconds per response and your app sets no outbound timeouts. What fails first?', [
        'The database pool, whose connections the calls hold open',
        'The queue workers, which stop reading jobs out of Redis',
        'The provider, whose rate limiter rejects all your retries',
        'Your web workers, all parked waiting on the same provider',
      ], 3, 'Each waiting call occupies a PHP-FPM worker for its full duration, so the pool is exhausted within minutes and requests that never touch the provider start failing too.'),
      q('Which pair belongs on every inbound webhook route you expose?', [
        'A CSRF token field and a rate limiter keyed on client ip',
        'Basic auth on the path and a JSON schema validation rule',
        'A CSRF exemption and an HMAC check over the raw body',
        'A session guard and a signed URL generated during signup',
      ], 2, 'The provider has no session or CSRF token to send, so the exemption stops endless 419 retries while the signature over the raw payload is what actually proves the caller is genuine.'),
      q('Your charge request times out and you cannot tell whether the money moved. What makes the retry safe?', [
        'Sending the same idempotency key on every attempt',
        'Waiting a full sixty seconds before the second attempt',
        'Switching the request from POST to PUT before retrying',
        'Wrapping the whole call inside a database transaction',
      ], 0, 'The provider recognises the repeated key and returns the result of the original operation rather than performing it again, which turns an ambiguous timeout into a safe read.'),
      q('Webhook deliveries were dropped for an hour during an outage. What catches the billing drift that follows?', [
        'Raising the retry count on your outbound HTTP client',
        'A nightly job comparing local rows against the provider',
        'Opening the circuit breaker on the billing integration',
        'Reading the plan column on every authenticated request',
      ], 1, 'Missed events leave the local mirror permanently stale with nothing to signal it, so only a scheduled comparison against the provider\'s own records surfaces the difference.'),
      ]
    ),
    chapter(
      'Security Hardening and Tenant Isolation',
      'The vulnerabilities that survive a correct login form, and the isolation that stops one customer ever seeing another customer\'s data.',
      [
      lesson('Roles, Permissions, and Broken Object-Level Access', 13, `
\`GET /api/invoices/8814\` comes back 200 with somebody else's invoice. The user was logged in, the Sanctum token was valid, the route carried \`auth:sanctum\`, and the controller ran \`Invoice::findOrFail($id)\`. Every check passed. That failure has a name, Broken Object Level Authorization, and it sits at number one on the OWASP API Security list precisely because scanners cannot see it: the response is an ordinary, well formed 200.

### Roles are not permissions

A \`role\` column on \`users\` survives about three customer conversations. The fourth asks for somebody who can issue refunds but not delete orders, and now \`if ($user->role === 'admin' || $user->role === 'finance')\` is copied into nine controllers.

Model it once instead:

\`\`\`php
Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();      // 'invoice.refund', 'order.delete'
});

Schema::create('permission_role', function (Blueprint $table) {
    $table->foreignId('role_id')->constrained()->cascadeOnDelete();
    $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
    $table->primary(['role_id', 'permission_id']);
});
\`\`\`

Then turn every permission row into a gate once, at boot:

\`\`\`php
// app/Providers/AppServiceProvider.php, boot()
foreach (Cache::rememberForever('permission.names', fn () => Permission::pluck('name')) as $name) {
    Gate::define($name, fn (User $user) => $user->hasPermission($name));
}

Gate::before(fn (User $user) => $user->is_super_admin ? true : null);
\`\`\`

That \`null\` is load bearing. Return \`false\` instead and you have not denied one check, you have denied every gate and every policy in the application for every non super admin, because any non null return from \`before\` short circuits the whole stack. It looks fine in staging, where you test as an admin.

### The object level gap

Permissions answer "may this user refund invoices". They never answer "may this user refund **this** invoice". Two lines, one of them safe:

\`\`\`php
// Broken: the permission is checked, the ownership is not
$invoice = Invoice::findOrFail($id);
$this->authorize('refund', Invoice::class);

// Safe: the row is only reachable through a relationship the user owns
$invoice = $request->user()->currentTeam->invoices()->findOrFail($id);
\`\`\`

Scoping the query beats checking the model afterwards, and it fails better. A policy denial returns 403, which confirms the record exists. A scoped query returns 404, which tells someone walking ids nothing at all.

The same hole appears one level down. \`POST /teams/12/invoices\` carrying \`"team_id": 3\` in the body writes an invoice into team 3 if \`team_id\` is fillable, so mass assignment (Chapter 3) and object level access turn out to be one bug wearing two hats. Take the parent from the route, never from the payload, and keep foreign keys out of \`$fillable\` on any model a customer can post to.

### Where index actions leak

\`authorizeResource(Invoice::class, 'invoice')\` in a controller constructor maps \`show\` to \`view\`, \`update\` to \`update\`, and \`index\` to \`viewAny\`. Read that last mapping twice.

| Action | Policy method | Gets the model | Guards rows |
|---|---|---|---|
| \`show\` | \`view\` | yes | yes |
| \`update\` | \`update\` | yes | yes |
| \`destroy\` | \`delete\` | yes | yes |
| \`index\` | \`viewAny\` | no | no |

\`viewAny\` receives no model, so it can only answer "may this user see invoices at all", and then \`index\` happily returns the entire table. Collection endpoints are guarded by the query, never by a policy: \`Invoice::where('team_id', $user->current_team_id)->paginate(25)\` is the actual control.

### Do not hit the database per check

A page rendering twenty \`@can\` directives runs twenty permission lookups unless you cache the answer:

\`\`\`php
public function hasPermission(string $name): bool
{
    $names = Cache::remember(
        "user:{$this->id}:permissions",
        now()->addMinutes(15),
        fn () => $this->roles()->with('permissions')->get()
            ->flatMap->permissions->pluck('name')->unique()->all()
    );

    return in_array($name, $names, true);
}
\`\`\`

Now the revocation problem. If an administrator strips someone's \`invoice.refund\` role, that person keeps refunding for up to fifteen minutes. Access that outlives its revocation is a finding on its own, so \`Cache::forget("user:{$user->id}:permissions")\` belongs inside the same transaction that changes the role, not in a nightly cleanup.
      `,
        [
          q('A developer adds Gate::before(fn (User $user) => $user->is_super_admin) so super admins bypass every check. Ordinary users now hit 403 on pages they are entitled to. Why?', [
            'A closure given to Gate::before has to return a Response instance',
            'Returning false denies every gate outright, policies included',
            'Gate::before only runs for users who hold at least one role row',
            'Policies defined after before() overwrite whatever the closure said',
          ], 1, 'Any non null return from Gate::before short circuits the whole gate stack, so a plain false for non super admins denies every check in the application rather than deferring to the policy.'),
          q('Invoice 8814 belongs to another team. Why is $request->user()->currentTeam->invoices()->findOrFail(8814) better than loading the invoice and then calling authorize?', [
            'It runs a single query, so the endpoint responds measurably faster',
            'Policies cannot be applied to models loaded through a relationship',
            'It answers 404, so someone walking ids learns nothing about what exists',
            'findOrFail bypasses the global scopes an authorize call would apply',
          ], 2, 'A policy denial returns 403, which confirms that record 8814 exists, while a query scoped to the user reports 404 and leaks no information about which ids are real.'),
          q('A controller calls authorizeResource(Invoice::class, \'invoice\') and the policy allows viewAny for anyone holding invoice.read. What does GET /invoices return to a user of team 4?', [
            'Every invoice in the table, because viewAny is given no model to test',
            'Only team 4 invoices, since authorizeResource scopes the query by owner',
            'A 403 response, because viewAny cannot pass without a model instance',
            'An empty collection until a view policy is written for each invoice',
          ], 0, 'The index action maps to viewAny, which receives no model and therefore can only decide whether invoices are visible in general, so the query itself has to carry the team filter.'),
        ]
      ),
      lesson('Injection, Untrusted Files, and Security Headers', 13, `
\`/orders?sort=total\` works. So does \`/orders?sort=(case when (select count(*) from users where email like 'a%') > 0 then total else id end)\`, and the row order it returns tells an attacker whether that subquery was true. That is blind SQL injection through an \`orderBy\`, in an application where every other query goes through Eloquent and is genuinely safe.

### Bindings protect values, not identifiers

Eloquent parameterises anything you pass as a value, which is why \`where('email', $request->email)\` cannot be injected no matter what that string holds. Interpolate into raw SQL and you are on your own:

\`\`\`php
// Broken: $from lands inside the SQL text
Order::whereRaw("created_at > '{$request->from}'")->get();

// Fixed: the value travels as a binding
Order::whereRaw('created_at > ?', [$request->from])->get();
\`\`\`

Column and table names cannot be bound at all. No database accepts a placeholder where an identifier belongs, so \`orderBy($request->sort)\` has no parameterised version to reach for. The only defence is an allowlist:

\`\`\`php
$sortable = ['created_at', 'total', 'status'];

$sort = in_array($request->query('sort'), $sortable, true)
    ? $request->query('sort')
    : 'created_at';

Order::orderBy($sort, $request->query('dir') === 'asc' ? 'asc' : 'desc')->paginate(25);
\`\`\`

The direction is allowlisted too. \`orderBy($sort, $request->dir)\` is the same hole one argument to the right.

There is a third injection surface people forget, and it is not SQL. \`Process::run("convert {$path} -resize 800x thumb.jpg")\` hands that string to a shell, so a stored filename of \`a.jpg; rm -rf storage/app\` does precisely what it reads as. Pass an array, \`Process::run(['convert', $path, '-resize', '800x', 'thumb.jpg'])\`, and no shell parses anything.

### Uploads are attacker input that happens to be a file

\`\`\`php
// Broken twice over
$name = $request->file('avatar')->getClientOriginalName();
$request->file('avatar')->move(public_path('avatars'), $name);
\`\`\`

\`getClientOriginalName()\` is a string the browser sent. Nothing stops it being \`shell.php\` or \`../../../.env\`, and \`public_path()\` drops the result exactly where the web server is willing to execute it. The fixed version keeps the file out of the document root and lets Laravel name it:

\`\`\`php
$request->validate([
    'avatar' => ['required', 'file', 'mimetypes:image/jpeg,image/png', 'max:2048'],
]);

$path = $request->file('avatar')->store('avatars', 'private');   // avatars/9f2c8b....jpg
\`\`\`

\`mimes:jpg,png\` compares the extension against a guessed type. \`mimetypes:\` checks what the bytes actually sniff as, which is the rule you want. Two traps remain. An SVG is an XML document that can carry \`<script>\`, so an SVG avatar served from your own origin is stored XSS with a friendly icon on it: exclude it, or serve uploads from a separate domain. And \`max:2048\` means kilobytes, and it only runs after PHP has accepted the whole body, so \`upload_max_filesize\` still has to be sane (Chapter 2).

### Headers the browser enforces on your behalf

Chapter 4 built the middleware. This is what belongs inside it:

| Header | Value | Stops |
|---|---|---|
| \`Content-Security-Policy\` | \`default-src 'self'\` | Injected script from running |
| \`Strict-Transport-Security\` | \`max-age=31536000\` | The first plaintext request |
| \`X-Content-Type-Options\` | \`nosniff\` | An upload being re-read as HTML |
| \`Referrer-Policy\` | \`strict-origin-when-cross-origin\` | Leaking URLs that carry tokens |
| \`X-Frame-Options\` | \`DENY\` | Clickjacking, as does \`frame-ancestors\` |

CSP is the one that pays and the one that hurts. \`default-src 'self'\` blocks every inline \`<script>\` and every inline style on the page, including what Vite injects during development. Add \`'unsafe-inline'\` to make the errors stop and the header becomes decoration: it now permits exactly the injected script it existed to block. Emit a nonce instead:

\`\`\`php
$nonce = base64_encode(random_bytes(16));
View::share('cspNonce', $nonce);

return $response->header(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'nonce-{$nonce}'"
);
\`\`\`

Then \`<script nonce="{{ $cspNonce }}">\` in Blade. Ship it as \`Content-Security-Policy-Report-Only\` for a week first and read the violation reports, because a policy rolled out blind takes the checkout page down on a Friday afternoon.
      `,
        [
          q('Why does Order::orderBy($request->query(\'sort\'))->get() stay injectable when whereRaw with a ? placeholder does not?', [
            'orderBy is compiled before the builder attaches any of its bindings',
            'Column names cannot be sent as placeholders, so the string joins the SQL',
            'The builder escapes bindings on writes only, and this is a read query',
            'orderBy accepts arrays, and array bindings are passed through unquoted',
          ], 1, 'A database will accept a placeholder where a value belongs but never where an identifier belongs, so a column name has to be checked against an allowlist instead of bound.'),
          q('An upload handler calls move(public_path(\'avatars\'), $request->file(\'avatar\')->getClientOriginalName()). Which upload does the most damage?', [
            'A 40 MB JPEG, which fills the disk before validation has a chance to run',
            'A file whose EXIF block Laravel cannot parse, throwing during the move',
            'A zero byte file, which creates an entry the thumbnail job then chokes on',
            'A file named shell.php, which lands where the web server will execute it',
          ], 3, 'The client supplied name is never sanitised and public_path points inside the document root, so an attacker chooses both the extension and the location and gets remote code execution.'),
          q('A team ships Content-Security-Policy: default-src \'self\' \'unsafe-inline\' so their existing inline scripts keep working. What have they actually deployed?', [
            'A policy that blocks inline script while still allowing remote script',
            'A header browsers ignore completely unless HSTS is sent alongside it',
            'A policy that permits exactly the injected script it was added to stop',
            'A policy covering stylesheets only, because script-src was left out',
          ], 2, 'Injected script arrives inline in the page, so allowing unsafe-inline permits the precise attack CSP exists to block and leaves the header as decoration.'),
        ]
      ),
      lesson('Secrets, Key Rotation, and Encrypted Attributes', 13, `
Someone runs \`php artisan key:generate\` on production to clear a warning in a log file. Nothing crashes. Twenty minutes later every signed in user has been logged out, and the page showing a customer's bank details is throwing \`DecryptException: The MAC is invalid or the payload has been tampered with\`. \`APP_KEY\` was not just signing cookies. It was the only key that could read four years of encrypted columns, and it has been overwritten.

### What that one value touches

Thirty two bytes, base64 encoded in \`.env\`, drive AES-256 across the whole framework:

| Depends on APP_KEY | Recoverable after a rotation |
|---|---|
| Session and encrypted cookies | Yes, everyone signs in again |
| Signed URLs from \`URL::signed\` | Yes, reissue the links |
| \`Crypt::encryptString\` payloads | Only with the old key |
| Columns using the \`encrypted\` cast | Only with the old key |
| Password hashes in \`users.password\` | Not affected at all |

That last row is the important one. Hashing is not encryption, and the difference decides your schema. Anything you only ever need to **compare** gets hashed: passwords, API tokens, webhook secrets. Anything you need to **read back** gets encrypted: a bank account number, a national id, an OAuth refresh token you have to replay next month.

### Encrypted casts, and the two surprises

\`\`\`php
class Customer extends Model
{
    protected function casts(): array
    {
        return [
            'iban'      => 'encrypted',
            'kyc_notes' => 'encrypted:array',
        ];
    }
}
\`\`\`

Reads and writes stay ordinary: assign \`$customer->iban = 'PK36SCBL0000001123456702'\` and the row holds ciphertext.

Surprise one is the column width. The stored payload is a JSON envelope of iv, value and mac, base64 encoded, so a 24 character IBAN lands near 250 characters. A \`string(255)\` column truncates or throws on the first save. Use \`text\`.

Surprise two ruins a sprint:

\`\`\`php
Customer::where('iban', 'PK36SCBL0000001123456702')->first();   // always null
\`\`\`

Every encryption generates a fresh random IV, so the same plaintext produces different ciphertext each time it is written. There is nothing to match on. When you need lookup, store a deterministic blind index beside the encrypted column:

\`\`\`php
$customer->iban       = $iban;                                    // encrypted, unsearchable
$customer->iban_index = hash_hmac('sha256', $iban, config('services.blind_index_key'));
\`\`\`

Search on \`iban_index\`, read from \`iban\`. Index the hash column and accept that it leaks equality: two customers sharing an IBAN become visibly the same. That is usually a fine trade.

### Rotating a key without an outage

Laravel 11 and 12 read \`APP_PREVIOUS_KEYS\`, which is what makes rotation survivable:

\`\`\`bash
APP_KEY=base64:NEW_KEY_HERE=
APP_PREVIOUS_KEYS=base64:OLD_KEY_HERE=
\`\`\`

Deploy that first. New writes use the new key while old ciphertext still decrypts through the old one. Then walk the tables and re-save each row, with \`chunkById\` from Chapter 7 so a million row backfill cannot skip a page. Only when the backfill is verified do you drop \`APP_PREVIOUS_KEYS\`. Skip that variable and you get the outage in the opening paragraph.

### The secrets you leak by accident

\`.env\` never enters git, and \`config:cache\` makes \`env()\` outside \`config/\` return null anyway (Chapter 1). Two leaks are far more common than a stolen file:

\`\`\`php
Log::info('Charge attempt', $request->all());                    // card number, plaintext, on disk
Log::info('Charge attempt', $request->except(['card_number', 'cvv']));
\`\`\`

For a team without a secret manager yet, \`php artisan env:encrypt\` commits an \`.env.encrypted\` file and keeps the passphrase in CI, which beats a shared note in a password manager and loses to Vault or AWS Secrets Manager. Whichever you land on, rotate any credential the moment it appears in a chat message. Treat anything pasted as already public.

And \`APP_DEBUG=true\` in production. Trigger any exception and the error page renders the stack trace plus the surrounding environment, \`APP_KEY\` and database password included, to whoever caused it. It is the most expensive single line of configuration in the framework.
      `,
        [
          q('A customers table stores iban with the encrypted cast. Customer::where(\'iban\', $value)->first() returns null for a customer you can plainly see in the admin panel. Why?', [
            'Each write uses a fresh IV, so one value produces different ciphertext',
            'The cast decrypts on read only, so the write stored the plaintext as is',
            'Where clauses run before casts apply, so the column reads back as null',
            'Encrypted columns are skipped by queries unless withEncrypted is called',
          ], 0, 'Laravel generates a random initialisation vector for every encryption, so the stored ciphertext differs each time the same IBAN is written and there is no value for a where clause to match.'),
          q('A runbook says to set the new APP_KEY, deploy, then re-encrypt the customers table overnight. What breaks between the deploy and the backfill?', [
            'New writes fail, since the cast rejects a key it has not seen before',
            'Nothing, because the framework keeps the previous key in the cache store',
            'Only session cookies, which Laravel silently reissues on the next read',
            'Every read of an old row throws, unless the old key is in APP_PREVIOUS_KEYS',
          ], 3, 'Rows written under the old key can only be decrypted by that key, so it has to stay readable through APP_PREVIOUS_KEYS until the backfill has re-encrypted every one of them.'),
          q('You need to store an OAuth refresh token that your app must replay against Google next month. Hash it or encrypt it?', [
            'Hash it, because a token is a credential and credentials are always hashed',
            'Encrypt it, because replaying the token needs the original value back',
            'Hash it, then keep the salt in a column so the value can be rebuilt later',
            'Encrypt it under a per row random key stored in the neighbouring column',
          ], 1, 'Hashing is one way, so a hashed refresh token could never be sent to Google again, which makes encryption the only option for a secret you have to read back.'),
        ]
      ),
      lesson('Multi-Tenancy Without Cross-Tenant Leaks', 14, `
The ticket reads "another company's projects are in my CSV export". You open the export controller and there it is: one \`DB::table('projects')\` written eighteen months ago, when there was exactly one customer, to make a report faster. Every other query in the application is tenant scoped. That one is not, and one is enough.

### Pick the isolation you can actually staff

| Model | Isolation | What it costs |
|---|---|---|
| Database per tenant | Strongest, a wrong query cannot cross | Migrations times N, connection switching |
| Schema per tenant | Strong on PostgreSQL | Same migration fan out, one connection |
| Shared tables, \`tenant_id\` column | Only as strong as your code | One schema, one migration, cheap |

Most SaaS applications start on the third row and stay there for years. It is the right default and it is the one that leaks, so the rest of this is how to stop it leaking.

### One scope, applied by a trait

\`\`\`php
class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where($model->getTable().'.tenant_id', app(Tenancy::class)->id());
    }
}

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function (Model $model) {
            $model->tenant_id ??= app(Tenancy::class)->id();
        });
    }
}
\`\`\`

The \`creating\` hook is not garnish. A global scope rewrites SELECT, UPDATE and DELETE. It does nothing whatsoever to INSERT. Without that hook the first \`Project::create([...])\` stores \`tenant_id = null\`, the row is invisible to the tenant who made it, and support spends an afternoon proving the save button is broken.

### The four places it still leaks

**Raw queries.** \`DB::table('projects')\`, \`whereRaw\`, \`DB::select\`, anything hand written: no model, therefore no scope. Grep for \`DB::table(\` in a tenanted codebase and treat every hit as a finding until proven otherwise.

**Queued jobs.** The tenant is resolved from the subdomain during a request and cached in a singleton. A worker has no request, so \`handle()\` runs with a null tenant and the scope matches nothing, or everything, depending on how you wrote it. On a laptop still running \`QUEUE_CONNECTION=sync\` (Chapter 6) the job executes inside the request and looks perfect. Carry the id explicitly:

\`\`\`php
class ExportProjects implements ShouldQueue
{
    public function __construct(public int $tenantId) {}

    public function handle(Tenancy $tenancy): void
    {
        $tenancy->setId($this->tenantId);   // every query below is scoped again
    }
}
\`\`\`

**Cache and rate limiter keys.** \`Cache::remember('dashboard:stats', ...)\` is one key for the entire platform, so tenant 12 opens their dashboard and reads tenant 3's revenue. Prefix every key with the tenant id in one helper, never at four hundred call sites.

**Unique constraints.** \`$table->unique('email')\` means the second tenant cannot invite a person the first tenant already has. Both the index and the validation rule need the tenant in them:

\`\`\`php
$table->unique(['tenant_id', 'email']);

Rule::unique('users', 'email')->where(fn ($q) => $q->where('tenant_id', $tenantId));
\`\`\`

One thing the shared column model hands you free: route model binding resolves through the model, so the scope applies. \`Route::get('/projects/{project}')\` answers 404 for another tenant's id with no controller code at all. That guarantee evaporates the moment somebody writes \`Project::withoutGlobalScopes()->find($id)\` for an internal admin screen and leaves the route reachable by anyone who knows the URL.

### Prove it, once per resource

\`\`\`php
it('cannot read another tenant project', function () {
    $theirs = Project::factory()->for($tenantB)->create();

    actingAs($userOfTenantA)
        ->get("/projects/{$theirs->id}")
        ->assertNotFound();      // 404, not 403: existence stays unconfirmed
});
\`\`\`

Four lines, boring to write, and the only thing that catches the next \`DB::table\` somebody adds at 6pm. Pair it with a second test asserting the index endpoint returns tenant A's count and not the table count, because that is the leak nobody notices until a customer does.
      `,
        [
          q('A model applies a global scope on tenant_id but has no creating hook. What happens to a row saved through Project::create() during a normal request?', [
            'The insert is rejected, because the scope adds a where it cannot satisfy',
            'It inherits the tenant of whichever record was loaded most recently',
            'It is stored with a null tenant_id, so its own tenant cannot see it',
            'It is written twice, once per connection the tenancy resolver opened',
          ], 2, 'A global scope only rewrites select, update and delete statements, so an insert receives no tenant_id at all and the resulting row falls outside the scope that would have found it.'),
          q('An export job dispatched from a tenant subdomain writes an empty CSV in production but works perfectly on a developer laptop. What is the likeliest cause?', [
            'The worker has no request, so the tenancy singleton resolved no tenant',
            'The job serialised its models, and serialisation drops the tenant column',
            'Queued jobs run outside the container, so global scopes never boot at all',
            'The redis driver refuses a job payload bigger than the CSV header row',
          ], 0, 'The laptop still runs the sync driver, which executes the job inside the request where the tenant is known, while a real worker starts with no subdomain and scopes every query to a null tenant.'),
          q('Tenant B tries to invite maria@example.com and validation reports the email is taken, though tenant B has no such user. Which change fixes it?', [
            'Drop the unique index and let the form request rule do the checking',
            'Move the check into a global scope so the lookup becomes tenant aware',
            'Add ignore($user->id) so the rule skips the row that already exists',
            'Make the index and the rule composite on tenant_id plus email',
          ], 3, 'Uniqueness in a shared table is per tenant rather than global, so both the database index and the validation rule have to include tenant_id for the same address to exist twice.'),
        ]
      ),
      ],
      [
      q('A review finds a controller behind auth:sanctum that checks an invoice.refund gate and then runs Order::findOrFail($id). What is still missing?', [
        'Any check tying that particular order to the authenticated user',
        'A rate limiter, without which the gate itself can be brute forced',
        'A CSRF token, since api routes verify one on every write request',
        'A policy registration, or findOrFail cannot resolve the model at all',
      ], 0, 'The gate answers whether this user may refund invoices in general and never whether they may touch order 8814, which is exactly the object level gap that produces a valid looking 200.'),
      q('Which piece of user supplied input cannot be made safe by passing it as a query binding?', [
        'An email address compared in a where clause on the users table',
        'A column name handed to orderBy on a paginated listing endpoint',
        'A date string compared against created_at inside a whereRaw call',
        'An array of integer ids passed to whereIn on the invoices table',
      ], 1, 'Placeholders stand in for values only, so identifiers such as column and table names have to be validated against an allowlist before they are concatenated into the SQL.'),
      q('Production renders a full stack trace including database credentials to anyone who triggers a 500. Which setting is responsible?', [
        'APP_ENV left on local, which switches the query log on for every request',
        'LOG_LEVEL set to debug, which appends the log context to the response',
        'APP_DEBUG left true, which renders the environment inside the error page',
        'APP_KEY missing, so the exception handler falls back to plain text output',
      ], 2, 'With debug mode on, the error page prints the stack trace together with the surrounding environment variables, which is how APP_KEY and the database password reach whoever caused the exception.'),
      q('You are auditing a shared table multi tenant application. Which line is most likely to leak rows across tenants?', [
        'Project::where(\'status\', \'active\')->paginate(25) inside a controller',
        '$user->projects()->latest()->get() called from a dashboard view',
        'Project::withTrashed()->find($id) inside an admin only action',
        'DB::table(\'projects\')->select(\'name\')->get() inside a CSV export',
      ], 3, 'The query builder never touches the model, so the global tenant scope is never applied, while the Eloquent calls above it all resolve through the model and keep their tenant filter.'),
      ]
    ),
    chapter(
      'Evolving a Live Laravel Application',
      'Changing a running application, its schema, and its framework version without downtime, and without stranding the team in a rewrite that never ships.',
      [
      lesson('Expand and Contract: Schema Changes With No Downtime', 13, `
A rename shipped on a Tuesday. One migration, six seconds of thought: \`$table->renameColumn('name', 'full_name')\`. The deploy ran migrations first, then rolled new code across four web servers over ninety seconds. For those ninety seconds three servers were still running code that wrote to \`users.name\`, a column that no longer existed. About 2,000 requests returned 500. The migration was correct. The deploy was not atomic.

### Two versions of your code always overlap

Nothing in a deploy happens at one instant. Migrations run once, new code arrives server by server, and queue workers hold the old application in memory until \`queue:restart\` lands. Plan for a window where the previous release and the next one both talk to the same database. Any schema change that only one of them survives is an outage with your name on it.

Expand and contract splits a destructive change into three releases, each of which works with the release on either side of it.

| Release | Schema change | Application code |
|---|---|---|
| 1, expand | add \`full_name\`, nullable | write both, read \`name\` |
| 2, migrate | backfill runs to completion | write both, read \`full_name\` |
| 3, contract | drop \`name\` | write \`full_name\` only |

### The migrations, and the backfill that is not one

\`\`\`php
// database/migrations/2026_03_02_090000_add_full_name_to_users.php
Schema::table('users', function (Blueprint $table) {
    $table->string('full_name')->nullable()->after('name');
});
\`\`\`

\`\`\`php
// app/Models/User.php, releases 1 and 2 only
public function setFullNameAttribute($value): void
{
    $this->attributes['full_name'] = $value;
    $this->attributes['name']      = $value;   // keep the old column alive
}
\`\`\`

Backfill in a job, never inside the migration. A single \`UPDATE users SET full_name = name\` across 12 million rows holds locks for minutes and blocks exactly the writes you were trying to protect.

\`\`\`php
// app/Jobs/BackfillFullName.php
User::whereNull('full_name')->chunkById(1000, function ($users) {
    foreach ($users as $user) {
        User::whereKey($user->id)->update(['full_name' => $user->name]);
    }
    usleep(50_000);   // give replicas room to catch up
});
\`\`\`

### Which operations are actually safe

| Operation | MySQL 8 | PostgreSQL 14 |
|---|---|---|
| Add nullable column | online | instant |
| Add column with a default | online | instant since PG 11 |
| Add NOT NULL to an existing column | table rebuild | rebuild, unless added NOT VALID then validated |
| Add an index | online with ALGORITHM=INPLACE | blocks writes unless CONCURRENTLY |
| Rename or drop a column | fast, and breaks running code | fast, and breaks running code |

Laravel's \`$table->index()\` emits a plain \`CREATE INDEX\`, which on PostgreSQL blocks every write to the table until it finishes. On a table with 40 million rows that is not a pause, it is an incident. Reach for the concurrent form, which refuses to run inside a transaction:

\`\`\`php
class AddStatusIndexToOrders extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        DB::statement('CREATE INDEX CONCURRENTLY orders_status_idx ON orders (status)');
    }
}
\`\`\`

### The parts people get wrong

- MySQL commits DDL implicitly. A migration that adds two columns and fails on the second leaves the first behind, with the migrations table saying nothing ran. PostgreSQL rolls the whole file back. Keep one logical change per file and stop relying on the difference.
- \`down()\` is theatre in production. Recovery is a new forward migration, because rolling back a drop destroys every row written since the deploy.
- Two web servers running \`php artisan migrate --force\` in the same deploy will race. \`php artisan migrate --isolated --force\` takes a cache lock, so the first host migrates and the rest exit cleanly with status 0.
- Before Laravel 11, \`->change()\` needed \`doctrine/dbal\` and quietly discarded attributes it could not introspect, so a column could lose its default or its unsigned flag. Laravel 11 emits native DDL, but you still restate every attribute you want to keep, because \`change()\` describes the finished column, not the delta.
      `,
        [
          q('A migration renames users.name to full_name, and the deploy runs migrations before the new code has reached every web server. What do the servers still on the old release do?', [
            'Queue their writes until the new column appears',
            'Fall through to the renamed column automatically',
            'Fail on every write to a column that no longer exists',
            'Keep serving reads because Eloquent remaps the name',
          ], 2, 'The old code still names the old column in its SQL, so every insert and update against it errors until that release is fully replaced, which is why the rename has to be split across releases.'),
          q('Why should the backfill of full_name run as a job rather than as a statement inside the expand migration?', [
            'One large UPDATE locks the table for minutes and blocks live writes',
            'Eloquent mutators are skipped inside migrations, so values arrive raw',
            'MySQL rejects an UPDATE that reads another column of the same row',
            'The migrations table would record the file twice and re-run it',
          ], 0, 'A single UPDATE across millions of rows holds locks for the length of the statement, which stalls exactly the production traffic the expand and contract sequence exists to protect.'),
          q('Two web servers both execute php artisan migrate --force in the same deploy. Which option stops them racing?', [
            '--pretend, which prints the SQL instead of running it',
            '--step, which records each migration file separately',
            '--seed, which serialises the run behind the seeder',
            '--isolated, which takes a cache lock so one host wins',
          ], 3, 'The isolated flag acquires an atomic cache lock before migrating, so the first host runs the migrations and every other host exits successfully without touching the schema.'),
        ]
      ),
      lesson('Feature Flags, Dark Launches, and Safe Rollback', 13, `
The new checkout was live for 41 minutes before anyone noticed that Apple Pay orders were saving a total of zero. Rolling back the deploy would have taken nine minutes and reverted four unrelated fixes that shipped in the same release. Instead somebody ran one command, and the flag was off in eleven seconds. Nothing was redeployed.

### A flag is a branch that lives in production

Every flag is an \`if\` statement your customers run. Two paths, two behaviours, and 2^n combinations across n flags. That cost is worth paying only when you name what a flag is for and when it dies.

| Kind | Lifetime | Who flips it | Example |
|---|---|---|---|
| Release | days to weeks | you, rolling out | \`new-checkout\` |
| Kill switch | permanent | whoever is on call | \`recommendations-enabled\` |
| Permission | permanent | the plan or role | \`bulk-export\` |
| Experiment | one experiment | analytics | \`pricing-page-b\` |

Mix the kinds and you get sixty flags nobody is allowed to delete.

### Pennant, and the gotcha inside it

\`\`\`php
// app/Providers/AppServiceProvider.php
use Laravel\\Pennant\\Feature;
use Illuminate\\Support\\Lottery;

Feature::define('new-checkout', fn (User $user) => match (true) {
    $user->isStaff()      => true,
    $user->team->isBeta() => true,
    default               => Lottery::odds(5, 100),
});
\`\`\`

\`\`\`php
// app/Http/Controllers/CheckoutController.php
return Feature::active('new-checkout')
    ? $this->newCheckout($request)
    : $this->legacyCheckout($request);
\`\`\`

Blade has \`@feature('new-checkout') ... @endfeature\`. With the \`database\` driver, each resolved value is stored per user, so the same person keeps the same experience across requests instead of re-rolling the lottery on every page load.

That storage is the trap. Editing the closure does not touch anyone already resolved: a user who landed on \`false\` last week stays \`false\` forever. Widening a rollout from 5 percent to 50 percent needs \`php artisan pennant:purge new-checkout\`, and forgetting it looks precisely like a rollout that stalled.

### Dark launch before you flip

Run the new path against real traffic, compare, then throw its answer away.

\`\`\`php
$legacy = $this->legacyTotal($cart);

if (Feature::active('shadow-totals')) {
    rescue(function () use ($cart, $legacy) {
        $new = $this->newTotal($cart);
        if ($new->cents !== $legacy->cents) {
            Log::warning('total mismatch', [
                'cart' => $cart->id, 'old' => $legacy->cents, 'new' => $new->cents,
            ]);
        }
    });
}

return $legacy;
\`\`\`

Two days of that log found the Apple Pay case before a customer did. The \`rescue()\` wrapper is not optional: a shadow path that throws must never fail the request it was only observing.

### Rollback is a schema question

Code rolls back in seconds. Data does not. If release 12 dropped a column, release 11 no longer boots, and your rollback plan has quietly become a restore from backup that loses everything written since. Expand and contract is what makes rollback real: while both schemas coexist, the previous release is still deployable, and that is the only definition of rollback that survives production.

Three rules that cost nothing and save weekends:

- Put the kill switch somewhere the failure cannot reach. A flag read from Redis is unreadable during a Redis incident, which is the exact moment you want it. Give the driver a safe default and make that default the boring path.
- Default an unknown flag to off for anything that spends money, sends mail, or writes to a third party.
- Add the removal ticket in the same pull request that adds the flag. A release flag with no owner and no date is not a flag any more, it is configuration nobody understands.
      `,
        [
          q('A Pennant rollout is widened from 5 percent to 50 percent by editing the closure, but the share of users on the new path barely moves. Why?', [
            'Pennant re-reads definitions only after the config cache is rebuilt',
            'Resolved values are stored per user, so the flag needs purging',
            'Lottery odds are fixed at whatever value was registered first',
            'The database driver ignores definitions that use a match block',
          ], 1, 'The database driver persists each user\'s resolved value, so anyone already evaluated keeps their old answer until pennant:purge clears the stored results and the closure runs again.'),
          q('What makes a kill switch read from Redis dangerous during a Redis incident?', [
            'Redis keys expire faster when the server is under memory pressure',
            'Pennant writes flag values synchronously and slows every request',
            'The value is cached for the request, so it can be one page stale',
            'The switch becomes unreadable at the exact moment you need it',
          ], 3, 'A kill switch is used during failures, so storing it behind a component that can fail means the control you reach for is unavailable precisely when the incident starts.'),
          q('A shadow comparison of a new total calculator throws an exception on a malformed cart. What should the request do?', [
            'Carry on and return the old total, with the error logged',
            'Return a 500 so that the mismatch cannot be ignored',
            'Retry the shadow calculation until it finally succeeds',
            'Turn the flag off automatically for every other user',
          ], 0, 'The shadow path exists only to gather evidence, so wrapping it in rescue() keeps its failures out of the response and preserves the behaviour customers already had.'),
        ]
      ),
      lesson('Upgrading Laravel and Auditing the Dependency Tree', 13, `
Someone ran \`composer update\` to fix one bug in one package. The lock file moved 47 packages. The application booted, the suite passed, and eleven days later a Stripe webhook started rejecting signatures because a transitive HTTP library had changed how it exposed the raw request body. The blame landed on webhook code that had not been touched in a year.

### The constraint is a promise, the lock is the truth

\`composer.json\` says what you accept. \`composer.lock\` says what actually runs. Commit the lock, install from it, and never let a deploy resolve versions for itself.

| Constraint | Accepts | Rejects |
|---|---|---|
| \`^11.5\` | 11.5 up to, not including, 12.0 | 12.0.0 |
| \`~11.5\` | 11.5 up to, not including, 11.6 | 11.6.0 |
| \`11.*\` | any 11.x release | 12.0.0 |
| \`11.5.2\` | exactly that build | everything else |

\`\`\`bash
composer install                                   # deploys: lock file only, no resolution
composer update laravel/framework --with-dependencies
composer outdated --direct                         # what you own, not the whole tree
composer audit                                     # known CVEs in the current lock
composer why-not laravel/framework 12.0
\`\`\`

\`why-not\` is the most useful command in any upgrade. It prints the packages whose constraints forbid the version you want, and that list is the actual project. The framework upgrade is usually a page of the upgrade guide. The blockers are three packages whose last release was in 2023.

### Upgrade in this order

1. PHP itself, on the version the target framework requires. Run the suite under it before anything else moves.
2. Blocking third-party packages, one at a time, each in its own commit so a bisect means something.
3. \`laravel/framework\`, following the upgrade guide's high impact sections.
4. First-party packages that track the framework: Sanctum, Horizon, Telescope, Cashier.
5. The skeleton diff.

Step 5 is the one that gets skipped. Composer never edits \`config/\`, \`bootstrap/app.php\`, or \`public/index.php\`, because those files belong to you. Every major version changes them. Diff your project against the \`laravel/laravel\` skeleton at both the old and the new tag and apply the differences by hand, or you end up running a current framework with a middleware stack from two versions ago and wondering why a documented default does nothing.

### Make deprecations loud, early

\`\`\`php
// config/logging.php
'deprecations' => ['channel' => 'stack', 'trace' => true],
\`\`\`

\`\`\`php
// tests/TestCase.php
protected function setUp(): void
{
    parent::setUp();
    $this->withoutDeprecationHandling();   // a deprecation now fails the test
}
\`\`\`

A deprecation today is a fatal error in the next major. Turning them red six months before the upgrade converts a one-week migration into a series of ten-minute fixes nobody had to schedule.

### Before you add a dependency

| Signal | Where to look | Bad sign |
|---|---|---|
| Maintenance | date of the last release | eighteen months of silence |
| Abandonment | \`composer show --latest\` | the abandoned marker |
| Weight | the package's own require block | it drags in a second HTTP client |
| Replaceability | how many of your files import it | it appears in 40 of them |

Two traps worth naming out loud. A package sitting in \`require-dev\` but used by application code works on every laptop and dies on the first \`composer install --no-dev\` deploy, in production, at the worst moment. And Laravel gives each major release bug fixes for 18 months and security fixes for two years, so an application parked past that window is not stable, it is unpatched.
      `,
        [
          q('Composer refuses to install Laravel 12 in your project. Which command tells you which packages are blocking it?', [
            'composer outdated --direct',
            'composer audit --format=json',
            'composer why-not laravel/framework 12.0',
            'composer show --latest --strict',
          ], 2, 'why-not resolves the request and prints every installed package whose constraint forbids the target version, which turns a vague failure into a named list of packages to upgrade or replace.'),
          q('An upgraded application boots and passes its tests, yet still runs a middleware stack from two major versions ago. What step was skipped?', [
            'Running composer dump-autoload after the framework moved',
            'The skeleton diff, because composer never edits your own files',
            'Clearing the compiled caches with optimize:clear on deploy',
            'Republishing the vendor assets that the new version ships',
          ], 1, 'Composer only replaces files under vendor, so bootstrap and config files stay exactly as they were until you diff them against the new laravel/laravel skeleton and port the changes yourself.'),
          q('Why is a bare composer update a poor way to perform an upgrade?', [
            'It downgrades any package that has no upper bound set',
            'It installs development dependencies onto production hosts',
            'It rewrites the constraints in composer.json as it resolves',
            'It moves every package at once, so a later break has no owner',
          ], 3, 'Updating everything in one step means dozens of packages change together, and when something misbehaves days later there is no single change to attribute it to or revert.'),
        ]
      ),
      lesson('Strangling a Legacy Application Module by Module', 13, `
The rewrite was eighteen months old and had shipped nothing. The plan had been to rebuild a 190,000 line legacy application in Laravel and switch over on one weekend. Meanwhile the old app kept receiving features, so the target moved faster than the rewrite could chase it. The team deleted the branch and started again with one rule: every week some real traffic moves, or the plan is wrong.

### The new application owns the front door

Strangling works because routing, not code, decides what is new. Move a module by changing one line of routing, with no legacy deploy at all.

\`\`\`nginx
# /etc/nginx/sites-enabled/shop
location /billing { proxy_pass http://laravel:9000; }
location /reports { proxy_pass http://laravel:9000; }
location /        { proxy_pass http://legacy:8080; }
\`\`\`

If you would rather keep the decision in code, Laravel's fallback route forwards anything it does not yet own:

\`\`\`php
// routes/web.php
Route::fallback(function (Request $request) {
    $response = Http::timeout(10)
        ->withHeaders(['X-Forwarded-User' => (string) auth()->id()])
        ->send($request->method(), config('legacy.base').$request->getRequestUri(), [
            'body' => $request->getContent(),
        ]);

    return response($response->body(), $response->status(), $response->headers());
});
\`\`\`

Every proxied request now carries your timeout policy, and the share of requests that never reach the fallback is the one migration metric worth reporting weekly.

### Sessions are the hard part

Two applications, one login. Choose an approach and write it down, because a half answer produces users who are signed in on \`/billing\` and anonymous on \`/orders\`.

| Approach | Works when | Cost |
|---|---|---|
| Shared Redis session store | both apps serialize sessions identically | almost never true across frameworks |
| Laravel as identity provider | legacy can verify a signed token | one integration, written once |
| Signed handoff on every hop | traffic crosses the boundary rarely | breaks the moment it crosses often |

The middle row is usually right. Legacy validates a short lived signed token on each request and keeps its own session for nothing that matters.

### Pick the seam, not the easy module

Rank candidates by how often they change multiplied by how much they hurt, then divide by how many tables they share with everything else. The reporting module nobody has edited since 2022 is a poor first target even though it looks easy, because finishing it teaches you nothing and changes no one's week. Billing, edited weekly and owning four tables nothing else writes, is a good one.

Keep both systems on one database at first. Put a mapper at the boundary so the legacy schema's \`usr_flg_2\` never becomes a property on your new domain model:

\`\`\`php
// app/Legacy/CustomerMapper.php
public function toCustomer(object $row): Customer
{
    return new Customer(
        id:       $row->cust_id,
        email:    $row->eml,
        isActive: $row->usr_flg_2 === 'Y',
    );
}
\`\`\`

That mapper is the entire anti-corruption layer, and it is what lets you rename the column later without touching a line of business logic.

### The rule that makes it finish

Freeze the legacy module the day work starts on its replacement: bug fixes only, no new features. Without that rule the old module keeps growing and the strangler never closes.

Then delete as you go. A module is not migrated when the new one works, it is migrated when the old code is gone from the repository and its routes return 404. Skip that step and you run two systems, two pipelines and two on-call rotations forever, which costs more than either system did alone.
      `,
        [
          q('Why does the new application sit in front of the legacy one rather than beside it?', [
            'Routing can move one module at a time with no legacy deploy',
            'It removes the need for the two systems to share a session',
            'Proxied requests execute faster than direct legacy requests',
            'It lets both applications resolve one shared composer.lock',
          ], 0, 'When the new system owns the front door, migrating a module is a routing change, so each move is small, reversible, and does not require touching the legacy codebase at all.'),
          q('Two candidates for the first module: reports, edited twice a year, and billing, edited weekly and owning four tables nothing else writes. Which goes first?', [
            'Reports, because low traffic makes an early mistake cheap',
            'Neither, until the whole schema has been redesigned first',
            'Billing, because frequent change is where the payoff lands',
            'Reports, because fewer tables means a much smaller mapper',
          ], 2, 'Value comes from moving the code that people change often, so a module edited weekly repays the migration immediately while a dormant one leaves the team\'s day unchanged.'),
          q('A module\'s replacement has been live for months, but the old implementation is still in the repository and still routed. What does that cost?', [
            'Composer resolves the legacy namespace ahead of the new one',
            'You keep running, deploying and staffing two systems at once',
            'The fallback route stops matching any newly added URL paths',
            'Legacy sessions start expiring earlier than the new ones do',
          ], 1, 'A migration only pays off once the old path is deleted, because until then both systems need deploys, monitoring and people who understand them, which is more work than either alone.'),
        ]
      ),
      ],
      [
      q('Which sequence leaves release 11 still deployable after release 12 has shipped?', [
        'Rename the column and add a down() that renames it back',
        'Drop the old column and restore from backup if it is needed',
        'Change the column type in place inside a single transaction',
        'Add the new column, write to both, drop the old one later',
      ], 3, 'While both columns exist and both are written, the previous release finds everything it expects, so rolling the code back is a deploy rather than a database restore.'),
      q('A feature flag guards a new pricing engine and the flag store becomes unreachable. What should the default resolve to?', [
        'The new engine, since it is the path being rolled out',
        'The old engine, because unknown should mean the safe path',
        'An error page, so that nobody is charged the wrong amount',
        'A random choice, to keep the two sample sizes balanced',
      ], 1, 'A failed lookup carries no information about whether the new path is safe, so falling back to the behaviour that has been serving customers for months limits the damage of a storage outage.'),
      q('Which pair of facts most reliably predicts a painful Laravel major upgrade?', [
        'Unmaintained direct dependencies and unhandled deprecations',
        'A large migration history and a database of several terabytes',
        'Heavy use of Blade components and of route model binding',
        'Running PHP-FPM behind nginx rather than on Laravel Octane',
      ], 0, 'Abandoned packages block the framework version outright and ignored deprecation warnings become fatal errors in the next major, so both defer work until the moment it is most expensive.'),
      q('A strangler migration has run for a year and the legacy application is still gaining new features. What went wrong?', [
        'The proxy layer is adding latency to every legacy request',
        'The two applications shared a single database for too long',
        'The legacy modules were never frozen, so the target moves',
        'Seams were chosen by data ownership instead of by traffic',
      ], 2, 'If the old system keeps growing, replacement work never catches up, which is why freezing a module to bug fixes only is what allows the migration to converge.'),
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
      'Nothing; the rule is enforced only in PHP, so child rows stay as they are',
      'That user\'s rows in the child table are deleted too',
    ], 3, 'cascadeOnDelete tells the database to remove dependent rows, so no orphans remain.'),
    q('A Blade loop prints $post->author->name for 100 posts. What appears in the query log?', [
      '1 query',
      '2 queries',
      '101 queries — the N+1 pattern',
      '100 queries, plus one join to load every author',
    ], 2, 'One query fetches the posts and each iteration lazy-loads its author; with(\'author\') reduces it to two.'),
    q('Which Blade output is safe for user-submitted text?', [
      '{{ $comment->body }}',
      '{!! $comment->body !!}',
      '@php echo $comment->body @endphp',
      '<?= $comment->body ?>',
    ], 0, 'Double braces run the value through htmlspecialchars; the other three emit raw markup.'),
    q('What does session()->regenerate() immediately after a successful login prevent?', [
      'Duplicate form submission when the user double-clicks the login button',
      'CSRF token mismatch errors',
      'Cookie size overflow',
      'Session fixation — a pre-planted session id surviving the login',
    ], 3, 'A new session id at login means any id an attacker planted beforehand is worthless.'),
    q('Route::apiResource registers how many routes, and which does it drop versus Route::resource?', [
      '7; it drops store and update, the two routes that accept a request body',
      '5; it drops create and edit, which only rendered HTML forms',
      '6; it drops edit and destroy',
      '5; it drops index and show',
    ], 1, 'An API has no form pages, so the two GET routes that existed to render forms are unnecessary.'),
    q('A middleware performs its check and returns nothing when the check passes. Symptom?', [
      '419 Page Expired',
      '403 Forbidden',
      'An empty response, because $next($request) was never returned',
      'The middleware runs twice per request, once before and once after the controller',
    ], 2, 'The pipeline needs the response returned back up through it; returning null yields an empty body.'),
    q('You need to change a column defined in a migration that already ran in production. What do you do?', [
      'Run migrate:fresh on production',
      'Run migrate:rollback then migrate',
      'Nothing; Laravel re-runs any migration file whose contents have changed since',
      'Write a new migration; already-run migrations are immutable',
    ], 3, 'Laravel tracks migrations by filename, so an executed file is never re-run — the change must be a new file.'),
    q('Why does storing money in a float column eventually corrupt totals?', [
      'Floats cannot represent decimal fractions exactly, so rounding errors accumulate',
      'Eloquent converts float columns to integers when it saves a model, so the cents are dropped',
      'Eloquent casts floats to strings on save',
      'Float columns cannot be indexed',
    ], 0, 'Values like 0.1 have no exact binary representation, so repeated arithmetic drifts; decimal or integer minor units do not.'),
    q('A job dispatched inside DB::transaction() intermittently fails with ModelNotFoundException. The fix?', [
      'Add $deleteWhenMissingModels = true to the job',
      'Move the queue connection to Redis so that workers pick the job up sooner',
      'Dispatch after the commit — ChargeCard::dispatch($order)->afterCommit()',
      'Pass an array of attributes instead of the model',
    ], 2, 'The worker has its own connection and cannot see uncommitted rows, so the dispatch must wait for the transaction to land.'),
    q('Your deploy ships a bug fix, but queued jobs keep executing the old code. What is missing?', [
      'php artisan queue:restart at the end of the deploy',
      'php artisan migrate --force',
      'A larger $tries value on every job class, so failed jobs retry on fresh code',
      'php artisan event:cache',
    ], 0, 'queue:work holds the booted application in memory, so workers keep running the code they started with until they are told to exit.'),
    q('A job filters on processed=false, sets it to true, and pages with chunk(500). Half the rows are silently skipped. Why?', [
      'The callback returned false after the first chunk and stopped the loop early',
      'Model events re-queued the rows',
      'chunk() loads every row into memory and runs out',
      'chunk() pages with OFFSET, so rows leaving the result set shift later pages',
    ], 3, 'Each processed page drops out of the filtered set, so the next offset lands past unprocessed rows; chunkById() keys on the primary key instead.'),
    q('Twelve tasks are registered in the Laravel scheduler. How many crontab entries does the server need?', [
      'Twelve, one per task',
      'One — * * * * * php artisan schedule:run',
      'One per command that uses onOneServer()',
      'None, because the scheduler runs inside the web process',
    ], 1, 'schedule:run wakes every minute and decides what is due, which keeps the timetable in your repository rather than in crontab.'),
    q('A provider binds TenantContext with singleton, and the object holds the tenant resolved at the start of each request. The code is correct under PHP-FPM, but once the same work runs through queue:work, jobs start writing rows against the wrong tenant. What is happening, and which binding fixes it?', [
      'The worker keeps one container alive across jobs, so the first job\'s tenant persists; bind it with scoped.',
      'The worker serialises the container between jobs, so the tenant is stale after each restart; bind it with instance.',
      'Jobs resolve bindings before providers boot, so the tenant is null and falls back to the first one; use bind instead.',
      'The queue connection builds a fresh container per job, so the binding never runs; move it to a deferred provider.',
    ], 0, 'Under FPM the container is thrown away after a few hundred milliseconds, which hides the bug, but queue:work boots the container once and keeps it for the life of the worker, so a singleton pins job number one\'s tenant into every job after it; scoped is flushed between jobs and between Octane requests while behaving exactly like singleton under FPM.'),
    q('An admin report joins users to orders and to refunds in one query, then groups by user and sums order totals. Customers with several refunds show a lifetime spend that is far too high. Why, and what fixes it without going back to one query per row?', [
      'having filters groups after aggregation, so refunded rows escape it; move the condition into a where clause instead.',
      'The refunds join multiplies the order rows before grouping, so each total is summed once per refund; use withSum.',
      'sum() ignores nulls produced by the left join, so refunded orders count twice; coalesce the column before grouping.',
      'Eloquent hydrates duplicate models from the join, so the collection sums twice; call distinct() on the query first.',
    ], 1, 'Joining two hasMany relations in one query produces a row for every order and refund pair, so six orders and two refunds become twelve rows and every total is counted twice before grouping runs; withSum and withCount compile to correlated subqueries evaluated per user row, and because nothing is joined there are no duplicate rows to multiply.'),
    q('A payment create call is wrapped in Http::timeout(4)->retry(3, 200) with no Idempotency-Key header, and the provider occasionally takes six seconds to answer a request it has already processed. What is the realistic worst outcome?', [
      'Laravel returns the first response body once the retries finish, so the customer is shown a stale payment status.',
      'The retry helper stops at the first non-2xx, so a slow but successful charge is reported to the caller as failed.',
      'Each attempt times out first, so the provider creates several charges while the caller sees a failure.',
      'Guzzle reuses one connection for the retries, so the provider rejects attempts two and three as duplicate posts.',
    ], 2, 'A timeout is not proof the request failed to arrive: the provider can create the charge and simply lose the response on the way back, so every retried POST creates another charge and the caller still ends up with an exception; an idempotency key turns the second and third attempts into a read of the first result instead of a new write.'),
    q('A controller calls authorizeResource(Invoice::class, \'invoice\') and the InvoicePolicy checks the invoice\'s team in every method. show, update and destroy are correctly locked down, yet customers still see each other\'s invoices on the list endpoint. Which explanation fits?', [
      'authorizeResource skips index unless the policy declares it, so the list endpoint runs with no gate at all.',
      'Policies run after the controller returns on collection routes, so the denial arrives too late to filter the results.',
      'Route model binding is not applied to index, so the policy receives an empty Invoice whose team check passes.',
      'viewAny gets no model, so index can only ask if the user may list invoices; the query must scope rows.',
    ], 3, 'authorizeResource maps index to viewAny, and viewAny receives no model because there is no single record to check, so it can only answer whether this user may see invoices in general before the controller returns the whole table; a collection endpoint is guarded by scoping the query itself, for example Invoice::where(\'team_id\', $user->current_team_id)->paginate(25).'),
    q('A release renames users.name to users.full_name in one migration, and the deploy runs migrations first and then rolls the new code across four web servers over about ninety seconds. Roughly two thousand requests return 500 during that window. What broke, and what would have prevented it?', [
      'Migrations only run after the last server updates, so early requests read a column that is not there yet; run them first.',
      'Old code on the servers not yet updated writes to a column the migration already removed; add the new one and write both.',
      'renameColumn rebuilds the table and holds a lock for the whole deploy, so every server times out; build indexes concurrently.',
      'Queue workers hold the old code in memory until restarted, so only jobs fail; run queue:restart at the end of the deploy.',
    ], 1, 'Nothing in a deploy happens at one instant, so for those ninety seconds the previous release is still writing to users.name, a column the migration has already deleted; expand and contract avoids that by shipping full_name as a nullable column first, writing both columns while a backfill job runs, and only dropping name in a later release once no running code touches it.'),
    q('A team adds the \'encrypted\' cast to customers.iban and widens the column to text. Writes and reads work fine, but Customer::where(\'iban\', $iban)->first() returns null even for a row saved seconds earlier. What is going on, and what is the standard fix?', [
      'The cast decrypts only on read, so the comparison runs against a truncated column; widen it from string to text and retry.',
      'config:cache hides APP_KEY from the query builder, so decryption fails silently and nothing matches; clear the config cache.',
      'Each write uses a fresh random IV, so one IBAN stores different ciphertext; search an HMAC blind index column instead.',
      'The where clause runs before the cast, so it compares against the raw envelope; use whereEncrypted so each row is decrypted.',
    ], 2, 'Laravel generates a new random initialisation vector on every encryption, so the same plaintext produces different ciphertext each time it is written and there is nothing for SQL to match on; the usual answer is a deterministic blind index, a hash_hmac of the value stored and indexed in a second column, which you search while the real value stays encrypted.'),
    q('Which Composer files belong in a Laravel application\'s Git repository?', [
      'composer.json only, since the lock file is regenerated',
      'vendor/ only, so servers can skip installing packages',
      'composer.json and composer.lock, but not vendor/',
      'composer.lock only, since it already lists every version',
    ], 2, 'composer.json records the constraints you asked for and composer.lock pins the exact versions so every machine installs the same set; vendor/ is rebuilt by composer install.'),
    q('A CSV import should skip rows with an unknown status instead of crashing. Given a backed `enum Status: string`, which call fits?', [
      'Status::tryFrom($value), which returns null for unknown values',
      'Status::from($value), which returns null for unknown values',
      'Status::cases($value), which filters out unknown values',
      'new Status($value), which falls back to the first case',
    ], 0, 'tryFrom() returns null for a value outside the declared cases, while from() throws a ValueError; enums cannot be instantiated with new.'),
    q('Which file does the web server hand every Laravel request to first?', [
      'routes/web.php',
      'bootstrap/app.php',
      'app/Http/Controllers/Controller.php',
      'public/index.php',
    ], 3, 'The web server\'s rewrite rule sends every URL to public/index.php, which boots the application and passes the request through middleware to the router.'),
    q('A route is declared as `Route::get(\'/posts/{post:slug}\', [PostController::class, \'show\'])` and the action is `show(Post $post)`. What does a request for /posts/hello-world do?', [
      'Loads the post whose id equals \'hello-world\', or throws a type error',
      'Loads the post whose slug is \'hello-world\', or returns 404 if none',
      'Passes the plain string \'hello-world\' into show() as $post',
      'Loads every post and filters by slug inside the controller',
    ], 1, 'The :slug suffix tells route model binding to query the slug column instead of the primary key, and a missing row produces a 404 automatically.'),
    q('A Blade edit form must send a PUT request to a route in routes/web.php. What should the form contain?', [
      'A POST form with @csrf and @method(\'PUT\') inside',
      'A form with method PUT and @csrf inside it',
      'A GET form with @method(\'PUT\') and no token',
      'A POST form with @method(\'PUT\') but no @csrf',
    ], 0, 'Browsers only send GET and POST, so the form posts with a hidden _method field from @method(\'PUT\'), and web routes also require the @csrf token.'),
    q('An avatar saved with `$request->file(\'avatar\')->store(\'avatars\', \'public\')` returns 404 when its URL is opened in the browser. What is usually missing?', [
      'A max:2048 validation rule on the file',
      'The enctype attribute on the upload form',
      'The storage:link symlink into public/',
      'A route that serves files from storage/app/public',
    ], 2, 'The public disk writes to storage/app/public, which the web server cannot reach until php artisan storage:link creates the public/storage symlink.'),
    q('Post and Tag are related with belongsToMany and no table name is passed. Which pivot table does Eloquent expect?', [
      'posts_tags',
      'tag_post',
      'post_tags',
      'post_tag',
    ], 3, 'The default pivot name is both model names in singular snake case, in alphabetical order: post_tag.'),
    q('You ran `php artisan migrate` twice today: once for two migrations, and later for one more. What does a single `php artisan migrate:rollback` undo?', [
      'All three migrations, since they ran on the same day',
      'Only the last batch, the single later migration',
      'Only the first migration ever run in the project',
      'Every migration, leaving an empty database',
    ], 1, 'Each migrate run is recorded as a batch, and migrate:rollback calls down() for the migrations in the most recent batch only.'),
    q('A StorePostRequest has rules for title and body only. A tampered form also posts is_admin=1. What does `$request->validated()` return?', [
      'Only title and body, the fields that have rules',
      'Every submitted field, including is_admin',
      'true, because all of the rules passed',
      'The rules array defined in the form request',
    ], 0, 'validated() returns only the data for fields that have validation rules, which keeps unexpected fields such as is_admin out of create().'),
    q('A registration form\'s password field has the rule `confirmed`. What does that rule require?', [
      'That the user confirms by clicking a link in an email',
      'That the password has already been hashed with bcrypt',
      'A matching password_confirmation field in the request',
      'That the password is not found in a breach database',
    ], 2, 'The confirmed rule checks that a field named password_confirmation is present and equal to password.'),
    q('A route group uses `->middleware(\'throttle:60,1\')`. What does that allow?', [
      '60 requests per second across all clients combined',
      '60 requests per minute for each client',
      '1 request every 60 seconds for each client',
      '60 failed logins before the account is locked',
    ], 1, 'throttle:60,1 allows at most 60 requests per 1 minute, counted per client by user or IP, after which Laravel responds with 429.'),
    q('A store action in a JSON API creates a post successfully. Which status code best signals that a new resource was created?', [
      '200 OK',
      '204 No Content',
      '302 Found',
      '201 Created',
    ], 3, '201 Created signals that a new resource now exists; 204 suits a delete with nothing to return, and 302 is a browser redirect.'),
    q('An API client sends `Accept: application/json`, and its POST fails a form request\'s rules. What does Laravel send back?', [
      '422 with a JSON errors object keyed by field',
      '302 redirect back to the previous page',
      '500 with the validation exception trace',
      '200 with success set to false in the body',
    ], 0, 'When the request expects JSON, a validation failure returns 422 with the messages grouped by field, instead of the redirect a browser form receives.'),
    q('An index action returns `PostResource::collection(Post::latest()->paginate(15))`. Which top-level keys does the JSON contain?', [
      'posts, page and total',
      'data only, as a plain array of posts',
      'data, links and meta',
      'items, next and previous',
    ], 2, 'Passing a paginator through a resource collection wraps the items in data and adds links for navigation and meta with the page numbers and total.'),
    q('QUEUE_CONNECTION is set to database, and a controller dispatches a job, but no `queue:work` process is running. What happens?', [
      'The job runs immediately inside the request instead',
      'The job waits in the jobs table until a worker starts',
      'The job is discarded and logged as failed at once',
      'Laravel throws an exception and the request fails',
    ], 1, 'Dispatching only stores the job; with the database driver it waits in the jobs table until a worker process picks it up.'),
    q('A job with `$tries = 3` throws on every attempt. What happens after the third failure?', [
      'It is retried forever with a growing delay',
      'It is deleted with no record of the error',
      'It runs synchronously in the next web request',
      'It moves to failed_jobs for a later queue:retry',
    ], 3, 'Once its attempts are exhausted the job is recorded in failed_jobs with its exception, and php artisan queue:retry can push it back onto the queue.'),
    q('In a new Laravel 12 application, where do you define scheduled tasks such as `Schedule::command(\'reports:send\')->daily()`?', [
      'routes/console.php',
      'app/Console/Kernel.php',
      'config/schedule.php',
      'The server\'s crontab file',
    ], 0, 'Since Laravel 11 the schedule lives in routes/console.php, and the server needs only one cron entry that runs schedule:run every minute.'),
    q('What does the RefreshDatabase trait do for a feature test class?', [
      'Deletes the database file after the whole suite finishes',
      'Seeds production data into the test database before each test',
      'Migrates once and rolls back each test\'s changes afterwards',
      'Caches query results so repeated tests run faster',
    ], 2, 'RefreshDatabase migrates the test database and wraps each test in a transaction that is rolled back, so no test sees another test\'s data.'),
    q('What does `Cache::remember(\'stats\', 600, fn () => Stats::compute())` do?', [
      'Runs the closure on every call and stores the newest result',
      'Returns the cached value, or computes and caches it for 600s',
      'Stores the closure itself so it can run again in 600 seconds',
      'Computes the stats once and caches them until a restart',
    ], 1, 'remember() returns the stored value on a hit; on a miss it runs the closure, stores the result for the given number of seconds and returns it.'),
    q('After MySQL and Redis, a server has about 3 GB of memory left for PHP-FPM, and each worker averages 60 MB. Roughly where should pm.max_children be capped?', [
      'About 500, to accept as many requests as possible',
      'About 200, since more workers always cut latency',
      'About 12, one per CPU core with room to spare',
      'About 50, the free memory divided by worker size',
    ], 3, 'max_children should be sized from memory: 3 GB ÷ 60 MB is about 51, so a cap near 50 with headroom avoids swapping.'),
    q('A controller\'s constructor type-hints App\\Services\\PdfBuilder, a concrete class whose own constructor takes no arguments. Nothing is bound in any provider. What happens when the route runs?', [
      'The container builds PdfBuilder automatically through reflection',
      'Laravel throws \'Target is not instantiable\' for the class',
      'The controller receives null for the missing binding',
      'Laravel reports that a provider must bind PdfBuilder first',
    ], 0, 'The container resolves concrete classes on sight by reading their constructors; only interfaces and unresolvable values such as primitives need an explicit binding.'),
    q('A service provider needs to call `Post::observe(PostObserver::class)`. Which method should hold that call?', [
      'register(), because it runs before any provider has loaded',
      'The provider\'s constructor, so it runs as early as possible',
      'boot(), because it runs after every provider has registered',
      'provides(), because it lists what the provider sets up',
    ], 2, 'register() should only declare bindings; boot() runs once all providers are registered, so it is the place to use framework services such as observers and events.'),
    q('A comments table must attach comments to posts, videos and invoices. What does `$table->morphs(\'commentable\')` add to it?', [
      'A commentable table linking comments to each parent table',
      'commentable_id and commentable_type columns with an index',
      'Three foreign keys: post_id, video_id and invoice_id',
      'A JSON column that stores the parent model\'s attributes for each comment row',
    ], 1, 'morphs() adds the id and type pair a polymorphic relation needs, plus an index over the pair; no foreign key is possible because the parent table varies.'),
    q('A Country has many Users, and each User has many Posts. Which relation on Country returns all posts written by its users?', [
      '$this->hasMany(Post::class, \'country_id\')',
      '$this->belongsToMany(Post::class, \'country_post\')',
      '$this->hasManyThrough(User::class, Post::class)',
      '$this->hasManyThrough(Post::class, User::class)',
    ], 3, 'hasManyThrough takes the final model first and the intermediate model second, so Country reaches Post through User.'),
    q('`$response = Http::get($url)` receives a 503 from the provider. What does Laravel\'s HTTP client do by default?', [
      'Returns the response, with failed() true, without throwing',
      'Throws a RequestException before the next line runs',
      'Retries the call three times before returning',
      'Returns null so the caller knows the call failed',
    ], 0, 'The client does not throw on 4xx or 5xx by default; you check $response->failed() or status(), or call ->throw() to turn error responses into exceptions.'),
    q('A circuit breaker around a recommendations API has opened after repeated failures. What does it do next?', [
      'Retries every call three times so users still get results',
      'Keeps sending all traffic, but logs each failure as an error',
      'Fails fast without calling it, then allows one probe later',
      'Disables the API permanently until a developer resets it',
    ], 2, 'An open breaker skips calls so workers are not tied up and the service can recover; after a cooldown it goes half open and lets one probe decide whether to close.'),
    q('How should user passwords be stored in a Laravel application?', [
      'Encrypted with Crypt::encryptString so admins can recover them',
      'Hashed one-way with Hash::make, and checked with Hash::check',
      'In plain text inside a column that uses the encrypted cast',
      'Encoded with base64 so they are not readable at a glance',
    ], 1, 'Passwords must be hashed one-way, for example with bcrypt, so nobody including the application can reverse them; encryption and encoding are reversible.'),
    q('Someone replaces APP_KEY on production and does not set APP_PREVIOUS_KEYS. Which data can no longer be read?', [
      'Passwords hashed with bcrypt in the users table, which need the old key to verify',
      'Rows in tables that have no encrypted columns',
      'Files stored on the public disk under avatars/',
      'Encrypted-cast columns and existing session cookies',
    ], 3, 'APP_KEY encrypts cookies and encrypted attributes, so old ciphertext fails to decrypt and users are logged out; bcrypt hashes do not use APP_KEY and keep working.'),
    q('In an expand and contract rename of users.name to full_name, when is it safe to drop the old name column?', [
      'In a later release, once no deployed code reads or writes name',
      'In the same migration that adds the new full_name column, to keep one schema step',
      'As soon as the backfill job has started running',
      'Before deploying the code that writes to full_name',
    ], 0, 'The contract step comes last, after the backfill has finished and every running release uses only full_name, so no server still depends on the old column.'),
    q('A new checkout ships behind a feature flag and starts saving wrong totals. Why is switching the flag off better than rolling back the deploy?', [
      'Rolling back is impossible once a deploy has finished',
      'The flag also repairs the orders saved with wrong totals while it is switched off',
      'It disables the feature in seconds without reverting other fixes',
      'Feature flags make every database migration reversible',
    ], 2, 'A flag turns off just the faulty path immediately, while a rollback takes longer and also reverts unrelated fixes that shipped in the same release.'),
  ],
});
