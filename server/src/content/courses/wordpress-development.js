import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'wordpress-development',
  title: 'WordPress Development',
  category: 'Web',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'indigo',
  coverKey: 'wordpress-development',
  summary:
    'Stop wrestling with page builders and learn to build WordPress the way it was designed — your own theme, your own plugin, your own content types and API endpoints.',
  description:
    'You set up a local stack, build a theme from an empty folder, then extend WordPress through hooks, custom post types, and REST endpoints you write yourself. The last two weeks are spent making it fast and locking it down with the escaping, nonce, and capability rules professional WordPress work is judged on.',
  chapters: [
    chapter(
      'How WordPress Actually Works',
      'The request lifecycle, the Loop that renders every page, and the template hierarchy that decides which file runs.',
      [
        lesson('Local Setup and the Request Lifecycle', 12, `
WordPress is a PHP application that answers one question on every request: *which posts does this URL mean, and which file should render them?* Everything you will learn is a variation on that.

### Get a local stack running

You need PHP 8.1+, MySQL or MariaDB, and a web server. Do not install these by hand — use a tool that gives you a disposable environment:

| Tool | Good for |
|---|---|
| **LocalWP** | Fastest start, GUI, no terminal needed |
| **DDEV** | Docker-based, config lives in the repo, matches production closely |
| **wp-env** | Official, minimal, great for plugin work |

With DDEV, a whole site is four commands:

\`\`\`bash
mkdir mysite && cd mysite
ddev config --project-type=wordpress --docroot=.
ddev start
ddev wp core download && ddev wp core install --url=https://mysite.ddev.site \\
  --title="My Site" --admin_user=admin --admin_password=secret --admin_email=me@example.com
\`\`\`

### Turn on the error messages

A blank white screen is WordPress hiding a fatal error from you. Fix that in \`wp-config.php\` **above** the "That's all, stop editing" line:

\`\`\`php
define( 'WP_DEBUG', true );      // report notices, warnings, fatals
define( 'WP_DEBUG_LOG', true );  // write them to wp-content/debug.log
define( 'WP_DEBUG_DISPLAY', false ); // keep them out of the page HTML
define( 'SCRIPT_DEBUG', true );  // load unminified core JS/CSS
\`\`\`

Logging rather than displaying matters: an error printed mid-page corrupts JSON responses and breaks redirects, which sends you hunting for a bug that is really just the error message itself.

### What happens on a request

Every front-end URL is rewritten to \`index.php\`. From there:

1. **\`wp-load.php\`** finds \`wp-config.php\`, connects to the database, and defines constants.
2. **\`wp-settings.php\`** loads core files, then **must-use plugins**, then **active plugins**, then the **theme's \`functions.php\`**. Order matters — a plugin cannot be overridden by code that loaded before it.
3. \`do_action( 'init' )\` fires. This is where post types, taxonomies, and rewrite rules must be registered.
4. **\`wp()\`** parses the URL into query variables and runs the **main query** — a \`WP_Query\` object stored in the global \`$wp_query\`.
5. **\`template-loader.php\`** looks at what the query found and picks a PHP file from your theme.

Two things follow from that sequence. First, **the query runs before the template is chosen**, which is why you change what a page shows by filtering the query, not by editing the template. Second, \`functions.php\` runs on *every* request, admin and front end alike, so heavy work there slows down the entire site.

### Never edit core

The \`wp-admin\` and \`wp-includes\` directories, and every file in the WordPress root except \`wp-config.php\`, are replaced wholesale by the next update. Any change you make there disappears silently — and because updates are the single most important security control (Chapter 5), the fix people reach for is to stop updating, which is how sites get compromised.

Your code belongs in exactly three places: \`wp-content/themes/\`, \`wp-content/plugins/\`, and \`wp-content/mu-plugins/\`. That constraint is not a limitation; the rest of this course is the set of tools WordPress gives you so you never need to touch core.
        `,
        [
          q('Why does the recommended debug configuration log errors to a file while WP_DEBUG_DISPLAY stays false?', [
            'Errors printed into the page body corrupt JSON responses and break redirects',
            'PHP records notices only once display output has been switched off',
            'Displaying errors makes PHP measurably slower on every single request',
            'WP_DEBUG_LOG refuses to write a file while display output is enabled',
          ], 0, 'An error message printed mid response becomes part of the output, which invalidates JSON and sends headers too late for a redirect, so the message itself looks like the bug.'),
          q('A theme adds an expensive API call at the top of functions.php. Why does the dashboard get slower too?', [
            'Admin screens are rendered through the active theme templates',
            'functions.php is loaded on every request, admin ones included',
            'The admin loads themes only after all plugins have finished',
            'WordPress caches functions.php for the front end but not admin',
          ], 1, 'wp-settings.php loads the theme functions file on every request the site handles, so top level work there is paid by admin pages, cron and REST calls as well.'),
          q('You patch a bug directly in a file under wp-includes on a production site. What is the real cost?', [
            'Core files are merged during updates, so the patch is kept',
            'WordPress blocks the site from updating until you revert it',
            'The next update replaces the file and the fix vanishes quietly',
            'The patch applies to the front end but never to admin screens',
          ], 2, 'Updates overwrite the core directories wholesale, so the change disappears without warning and the tempting workaround, refusing to update, removes the most important security control you have.'),
        ]
      ),
        lesson('The Loop and WP_Query', 14, `
**The Loop** is the block of code that walks the posts WordPress already found and prints them. It looks strange the first time because it uses globals rather than passing data around.

### The main query

Before your template runs, WordPress has already turned the URL into a query. \`/category/news/\` becomes roughly \`WP_Query( [ 'category_name' => 'news' ] )\`, and the results sit in the global \`$wp_query\`. The Loop just consumes them:

\`\`\`php
<?php if ( have_posts() ) : ?>
  <?php while ( have_posts() ) : the_post(); ?>
    <article <?php post_class(); ?>>
      <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
      <p class="meta"><?php echo esc_html( get_the_date() ); ?></p>
      <?php the_excerpt(); ?>
    </article>
  <?php endwhile; ?>
  <?php the_posts_pagination(); ?>
<?php else : ?>
  <p>Nothing found.</p>
<?php endif; ?>
\`\`\`

\`the_post()\` is the important call: it advances the pointer and sets up the global \`$post\`, which is what makes \`the_title()\` and every other template tag know which post they refer to. Outside the Loop those functions have no context.

### the_ prints, get_the_ returns

Almost every template tag comes in a pair:

\`\`\`php
the_title();               // echoes the filtered title — not escaped
$title = get_the_title();  // returns that same string
echo esc_html( get_the_title() );   // escape it yourself for an HTML context
\`\`\`

Use the \`get_\` form whenever you need to test, modify, or concatenate. Use the printing form when you just want it on the page.

Neither form escapes anything. Both run the value through the \`the_title\` filter and stop there, so markup stored in a title is printed as markup — which is why Chapter 5 wraps these calls in \`esc_html()\` and \`esc_attr()\`.

### A secondary query

Sometimes you need posts *in addition* to the main query — a "related posts" strip, a homepage highlight:

\`\`\`php
$featured = new WP_Query( [
  'post_type'      => 'post',
  'posts_per_page' => 3,
  'meta_key'       => 'featured',
  'meta_value'     => '1',
  'no_found_rows'  => true,   // skip the extra pagination count query when not paginating
] );

if ( $featured->have_posts() ) {
  while ( $featured->have_posts() ) {
    $featured->the_post();
    get_template_part( 'template-parts/card' );
  }
  wp_reset_postdata();   // restore the main query's global $post
}
\`\`\`

**Forgetting \`wp_reset_postdata()\` is the most common bug in real WordPress themes.** The secondary loop leaves the global \`$post\` pointing at its last result, so everything after it — the page title, the comments, the next widget — quietly renders the wrong post. The symptom is always "the title is right at the top of the file and wrong at the bottom".

### Do not use query_posts()

\`query_posts()\` looks convenient and *replaces* the main query. It throws away pagination, breaks conditional tags, and forces a second database query. It is deprecated in practice. To change what the main query returns, filter it before it runs:

\`\`\`php
add_action( 'pre_get_posts', function ( $query ) {
  // Only the main front-end query — never the admin, never a secondary loop.
  if ( is_admin() || ! $query->is_main_query() ) {
    return;
  }
  if ( $query->is_home() ) {
    $query->set( 'posts_per_page', 9 );
  }
} );
\`\`\`

Those two guards are mandatory. Without \`is_main_query()\` you also rewrite every widget and menu query on the page; without \`is_admin()\` you change what editors see in the post list.

### The setting that kills sites

\`'posts_per_page' => -1\` means "load every matching post into memory". It works fine on the twelve posts you tested with and takes the site down at ten thousand. Always set a real number, and paginate.
        `,
        [
          q('You need to check whether a title contains the word Workshop before printing it. Which call fits and why?', [
            'the_title(), because it returns the filtered string to the caller',
            'the_title() wrapped in ob_start, the only way to capture output',
            'get_the_title(), because it escapes the value ready for HTML',
            'get_the_title(), because it returns the string instead of echoing',
          ], 3, 'The get_ prefixed form returns the value so you can test, modify or concatenate it, while the printing form echoes immediately and returns nothing you can inspect.'),
          q('An archive template uses posts_per_page set to -1. It is fine on the twelve test posts. What happens later?', [
            'Every matching post is loaded into memory until PHP runs out',
            'WordPress quietly caps the query at one hundred results per page',
            'Pagination links are still printed but each of them returns a 404',
            'The result set is cached, so only the first request is ever slow',
          ], 0, 'A value of -1 means no limit, so the query hydrates every matching post object at once and the page dies on memory once the content grows.'),
          q('What does the_post() do that makes template tags such as the_title() work inside the Loop?', [
            'It runs the query, which is otherwise deferred until first use',
            'It advances the pointer and sets the global post the tags read',
            'It escapes each post field before the template tags print them',
            'It clones the main query so nested loops can share one pointer',
          ], 1, 'the_post() moves to the next result and populates the global $post, which is the context every template tag reads, which is why those tags return nothing outside a Loop.'),
        ]
      ),
        lesson('The Template Hierarchy', 13, `
Once the query has run, WordPress walks a list of filenames from most specific to least specific and uses the first one your theme actually contains. That list is the **template hierarchy**, and knowing it replaces most of the \`if ( is_page( 42 ) )\` code beginners write.

### The rules that cover 90% of work

| URL requested | Files WordPress tries, in order |
|---|---|
| Single blog post | \`single-post.php\` → \`single.php\` → \`singular.php\` → \`index.php\` |
| Page "About" (slug \`about\`, ID 12) | \`page-about.php\` → \`page-12.php\` → \`page.php\` → \`singular.php\` → \`index.php\` |
| Category "News" | \`category-news.php\` → \`category.php\` → \`archive.php\` → \`index.php\` |
| Custom post type \`event\`, single | \`single-event.php\` → \`single.php\` → \`singular.php\` → \`index.php\` |
| Custom post type \`event\`, archive | \`archive-event.php\` → \`archive.php\` → \`index.php\` |
| Search results | \`search.php\` → \`index.php\` |
| Nothing found | \`404.php\` → \`index.php\` |
| Front page | \`front-page.php\` → \`home.php\` (posts) or \`page.php\` (static) |

\`index.php\` is the backstop — it is the only file the hierarchy can never fall past, which is why it is one of the two required files in a theme.

### Use the hierarchy instead of conditionals

\`\`\`php
<?php
// Fragile: one file that grows a new branch every time the site does.
if ( is_singular( 'event' ) ) {
  // 60 lines of event markup
} elseif ( is_post_type_archive( 'event' ) ) {
  // 40 lines of listing markup
}
\`\`\`

Split that into \`single-event.php\` and \`archive-event.php\` and each file has one job. The hierarchy is your router; treating \`index.php\` as a giant switch statement is fighting it.

### front-page.php outranks everything

If \`front-page.php\` exists, it wins for the site's front page regardless of the Settings → Reading choice. That surprises people who set a static page and then wonder why their \`page-home.php\` is ignored. If you want the admin setting respected, do not create \`front-page.php\`.

### Confirm which file is running

Add this to \`functions.php\` while developing:

\`\`\`php
add_filter( 'template_include', function ( $template ) {
  if ( current_user_can( 'manage_options' ) ) {
    error_log( 'Template: ' . $template );   // appears in wp-content/debug.log
  }
  return $template;   // a filter must always return
} );
\`\`\`

### Child themes

Never edit a theme you did not write — the next update overwrites it. A **child theme** is a folder with a \`style.css\` naming its parent and a \`functions.php\`:

\`\`\`css
/*
Theme Name: Storefront Child
Template: storefront
*/
\`\`\`

\`\`\`php
<?php
add_action( 'wp_enqueue_scripts', function () {
  wp_enqueue_style( 'parent', get_template_directory_uri() . '/style.css' );
  wp_enqueue_style(
    'child',
    get_stylesheet_directory_uri() . '/style.css',
    [ 'parent' ]   // load after the parent so it can override
  );
} );
\`\`\`

Any template file you put in the child folder replaces the parent's version of the same name. The distinction to memorise: **\`get_template_directory()\` is always the parent, \`get_stylesheet_directory()\` is the active (child) theme.** Using the wrong one is why a child theme's CSS or images silently fail to load.
        `,
        [
          q('A theme has front-page.php and page-home.php. An admin sets the page Home as a static front page. Which file renders the root URL?', [
            'page-home.php, because a slug match is the more specific file',
            'home.php, which handles the front page of any WordPress site',
            'front-page.php, because it outranks the Reading setting entirely',
            'page.php, since a static page always falls through to that file',
          ], 2, 'front-page.php sits above everything else for the site root, so it wins whether the Reading setting points at posts or at a static page, and the only way to honour that setting is to not create the file.'),
          q('A snippet hooked to template_include logs the chosen file, and now every page on the site is blank. What is wrong?', [
            'template_include is an admin only hook and cannot run publicly',
            'error_log cannot be called while templates are being resolved',
            'The callback needs accepted_args raised to 2 to receive the path',
            'The callback never returns $template, so no file gets included',
          ], 3, 'template_include is a filter, so whatever the callback returns becomes the template path, and returning nothing hands WordPress null to include.'),
          q('A child theme adds category-news.php while its parent already ships category.php. Which file renders the News category archive?', [
            'The child theme copy, category-news.php, because it is more specific',
            'The parent copy, category.php, because parent files are loaded first',
            'index.php, because the child theme has no matching archive.php file',
            'Both files run in turn, with the parent output wrapping the child one',
          ], 0, 'WordPress walks the hierarchy from most specific to least, and at each step it checks the child theme folder before the parent, so a more specific child file always wins.'),
        ]
      ),
            lesson('Conditional Tags and the Queried Object', 13, `
A theme ships a promo banner that should show only on the blog index. It appears on the front page instead, and nowhere else. The template is right, the CSS is right, and \`is_home()\` looks like it is lying. It is not. It means something narrower than the name suggests, and that gap is behind a large share of "why is this showing here" bugs.

### The two that catch everyone

\`is_home()\` is the posts index. \`is_front_page()\` is whatever the site serves at the root. On a fresh install those are the same URL, so both return true and the bug stays hidden until someone sets a static front page under Settings, Reading.

| Reading setting | URL | is_front_page() | is_home() |
|---|---|---|---|
| Your latest posts | \`/\` | true | true |
| Static page Welcome, posts page \`/blog/\` | \`/\` | true | false |
| Static page Welcome, posts page \`/blog/\` | \`/blog/\` | false | true |

If you mean "the page that lists posts, wherever the client moves it", the answer is \`is_home()\`.

### The tags worth memorising

| Tag | True for |
|---|---|
| \`is_singular( 'event' )\` | one event, one post, or one page of that type |
| \`is_single()\` | one post or custom post type entry, never a page |
| \`is_page()\` | one page, never a post |
| \`is_post_type_archive( 'event' )\` | the \`/events/\` listing |
| \`is_tax( 'event_type', 'workshop' )\` | a term archive for a custom taxonomy |
| \`is_404()\` | the query found nothing |

\`is_single()\` excludes pages, \`is_page()\` excludes posts, \`is_singular()\` covers both. Most "my check skips pages" reports are that one line.

### They return false before the query runs

Broken:

\`\`\`php
add_action( 'init', function () {
  if ( is_page( 'contact' ) ) {          // always false at this point
    wp_enqueue_script( 'cortex-map', '/js/map.js', [], '1.0', true );
  }
} );
\`\`\`

\`init\` fires before \`wp()\` parses the URL, so there is no main query to interrogate. WordPress says so out loud: \`debug.log\` fills with \`Notice: is_page was called incorrectly. Conditional query tags do not work before the query is run. Before then, they always return false.\`

Fixed, on a hook that runs after the query:

\`\`\`php
add_action( 'wp_enqueue_scripts', function () {
  if ( is_page( 'contact' ) ) {
    wp_enqueue_script( 'cortex-map', get_stylesheet_directory_uri() . '/assets/js/map.js', [], '1.0', true );
  }
} );
\`\`\`

The earliest reliable hook is \`wp\`. Next is \`template_redirect\`, which is the right place to send a visitor somewhere else before a byte of HTML exists:

\`\`\`php
add_action( 'template_redirect', function () {
  if ( is_singular( 'event' ) && ! is_user_logged_in()
       && get_post_meta( get_queried_object_id(), 'members_only', true ) ) {
    wp_safe_redirect( home_url( '/membership/' ), 302 );
    exit;                       // always exit after a redirect
  }
} );
\`\`\`

### get_queried_object() answers the other half

Conditional tags tell you what kind of page this is. \`get_queried_object()\` tells you which thing it is about:

| Request | Returns |
|---|---|
| \`/events/spring-summit/\` | \`WP_Post\` |
| \`/event-type/workshop/\` | \`WP_Term\` |
| \`/author/amina/\` | \`WP_User\` |
| \`/events/\` | \`WP_Post_Type\` |

\`\`\`php
$term = get_queried_object();
if ( $term instanceof WP_Term ) {
  printf( '%s (%d)', esc_html( $term->name ), (int) $term->count );
}
\`\`\`

On an archive there is no global \`$post\` until the Loop starts, so \`get_the_ID()\` in \`header.php\` returns whatever the previous query left behind, which is usually the last post of the last widget. \`get_queried_object_id()\` is safe everywhere, including on archives and 404s.

### One more trap, inside filters

\`the_content\` runs for widgets, excerpts and page builder fields too, so a filter that appends a booking form will paste it into the sidebar as well:

\`\`\`php
add_filter( 'the_content', function ( $content ) {
  if ( is_singular( 'event' ) && in_the_loop() && is_main_query() ) {
    $content .= cortex_booking_form();
  }
  return $content;
} );
\`\`\`

\`in_the_loop()\` means "a Loop is running right now". \`is_main_query()\` means "and it is this page's own query". Together they say the visitor is genuinely reading this event, which is the only place that form belongs.
      `,
        [
          q('A callback on init uses is_page(\'contact\') to decide whether to enqueue a script, and the script never loads. Why?', [
            'is_page() matches on numeric IDs only, never on a page slug',
            'The main query has not run at init, so the tag returns false',
            'Assets enqueued during init are discarded before wp_head runs',
            'is_page() is usable only inside the Loop, not in a callback',
          ], 1, 'Conditional tags read the main query, and init fires before the URL has been parsed into one, so they all return false and WordPress logs a called incorrectly notice.'),
          q('A site shows a static page at the root and lists its posts at /blog/. Where does is_home() return true?', [
            'On the static front page, since that is the site home page',
            'On both the static front page and the /blog/ posts listing',
            'On /blog/ only, because that is the posts index of the site',
            'On every template that runs a Loop over the default post type',
          ], 2, 'is_home() is the posts index wherever it lives, while is_front_page() is the site root, and the two only coincide when the root itself lists posts.'),
          q('Your the_content filter appends a booking form, and the form also turns up inside a sidebar widget. Which guard fixes it?', [
            'Check is_admin() first so the filter is skipped in the dashboard',
            'Raise the filter priority to PHP_INT_MAX so it runs last of all',
            'Switch the hook from the_content to the_excerpt for single views',
            'Add in_the_loop() and is_main_query() alongside the page check',
          ], 3, 'the_content is applied to widget text and other secondary output as well, so the filter needs to confirm that a Loop is running and that it belongs to the page\'s own main query.'),
        ]
      ),
      ],
      [
        q('Why must post types be registered on the init hook rather than in functions.php directly?', [
          'init runs before plugins load',
          'Registration must happen after WordPress is fully loaded but before the URL is parsed into a query',
          'functions.php only runs in the admin',
          'init is the only hook that accepts arguments',
        ], 1, 'The main query is built after init, so anything registered later is invisible to routing and rewrite rules.'),
        q('A secondary WP_Query loop is followed by the wrong post title in the footer. What is missing?', [
          'rewind_posts()',
          'wp_reset_postdata() after the loop',
          'A call to have_posts() before the loop',
          'The no_found_rows argument',
        ], 1, 'The secondary loop leaves the global $post on its last result; wp_reset_postdata() restores the main query context.'),
        q('You want the blog index to show 9 posts instead of 10. What is the correct approach?', [
          'query_posts in index.php',
          'A new WP_Query in index.php',
          'pre_get_posts, guarded by is_admin() and is_main_query()',
          'Change posts_per_page in wp-config.php',
        ], 2, 'pre_get_posts modifies the main query before it runs, so pagination and conditional tags keep working.'),
        q('Your theme has page.php and single.php. A visitor opens a single custom post type entry with no single-event.php. Which file renders it?', [
          'page.php', 'single.php', 'index.php', '404.php',
        ], 1, 'The hierarchy falls from single-event.php to single.php before it ever reaches index.php; page.php is only for pages.'),
      ]
    ),
    chapter(
      'Building a Theme From Scratch',
      'Two files to a working theme, then assets, template parts, and menus done the WordPress way.',
      [
        lesson('A Theme From Two Files', 13, `
A valid WordPress theme is a folder in \`wp-content/themes/\` containing exactly two required files: \`style.css\` and \`index.php\`. Everything else is optional refinement.

### style.css carries the metadata

WordPress reads the theme's identity from a comment block at the top of \`style.css\`. Without it the theme does not appear in Appearance → Themes at all:

\`\`\`css
/*
Theme Name: Cortex
Theme URI: https://example.com/cortex
Author: Your Name
Description: A small, fast classic theme.
Version: 1.0.0
Requires at least: 6.0
Requires PHP: 8.0
License: GPLv2 or later
Text Domain: cortex
*/
\`\`\`

The **Text Domain** must match the folder name and the first argument of every translation call — \`__( 'Read more', 'cortex' )\`. Get it wrong and translations silently return the original string.

### index.php and the wrapper files

Split the page into three files so every template does not repeat the \`<head>\`:

\`\`\`php
<?php // header.php ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
  <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
    <?php bloginfo( 'name' ); ?>
  </a>
</header>
<main id="content">
\`\`\`

\`\`\`php
<?php // footer.php ?>
</main>
<footer class="site-footer">
  <p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></p>
</footer>
<?php wp_footer(); ?>
</body>
</html>
\`\`\`

\`\`\`php
<?php // index.php ?>
<?php get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
  <article <?php post_class(); ?>>
    <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
    <?php the_excerpt(); ?>
  </article>
<?php endwhile; else : ?>
  <p><?php esc_html_e( 'No posts yet.', 'cortex' ); ?></p>
<?php endif; ?>
<?php get_footer(); ?>
\`\`\`

### wp_head() and wp_footer() are not decoration

**Omitting \`wp_head()\` or \`wp_footer()\` is the classic broken-theme bug.** Those two calls are the hooks through which WordPress and every plugin inject their output: stylesheets, scripts, the admin bar, SEO meta tags, the REST API link, analytics. A theme without them looks fine until you install a plugin and nothing works, and the plugin gets blamed.

The same goes for \`body_class()\` and \`post_class()\`. They emit classes like \`single post-type-event logged-in\` that your CSS and other people's plugins rely on.

### functions.php declares what you support

\`\`\`php
<?php
add_action( 'after_setup_theme', function () {
  add_theme_support( 'title-tag' );          // WordPress writes <title>, not you
  add_theme_support( 'post-thumbnails' );    // enables featured images
  add_theme_support( 'html5', [ 'search-form', 'comment-form', 'gallery', 'caption', 'style', 'script' ] );
  add_theme_support( 'responsive-embeds' );
  add_theme_support( 'custom-logo', [ 'height' => 60, 'width' => 240 ] );

  register_nav_menus( [
    'primary' => __( 'Primary Menu', 'cortex' ),
    'footer'  => __( 'Footer Menu', 'cortex' ),
  ] );
} );
\`\`\`

Note there is no hardcoded \`<title>\` in \`header.php\` — \`add_theme_support( 'title-tag' )\` lets WordPress and SEO plugins generate it correctly for every archive, search page, and paginated view. Hardcoding it is a small mistake with a large SEO cost.

### A sanity checklist for any theme you write

- \`style.css\` header present, Text Domain matches the folder name.
- \`wp_head()\` immediately before \`</head>\`, \`wp_footer()\` immediately before \`</body>\`.
- \`body_class()\` on \`<body>\`, \`post_class()\` on each post wrapper.
- Every URL you print passes through \`esc_url()\`, every string through \`esc_html()\`.
- A \`screenshot.png\` at 1200×900 so the theme looks finished in the admin.
        `,
        [
          q('A theme lives in the folder cortex but every translation call passes the text domain cortex-theme. What is the result?', [
            'Translations are never found, so the English strings print',
            'WordPress falls back to the folder name and loads them anyway',
            'The theme triggers a fatal error the moment it is activated',
            'Each translated string prints with its text domain prefixed',
          ], 0, 'Translation files are looked up by text domain, so a domain that matches nothing simply returns the original string with no warning at all.'),
          q('Why does a well built header.php contain no hardcoded title element?', [
            'A title element inside header.php is invalid under HTML5',
            'add_theme_support(\'title-tag\') lets WordPress generate it per view',
            'wp_head() strips any title element it finds in the markup',
            'The block editor writes the title element at render time',
          ], 1, 'With title-tag support WordPress and any SEO plugin build the title for archives, search pages and paginated views, which a single hardcoded string cannot do.'),
          q('What is the minimum a folder in wp-content/themes needs so the theme shows up under Appearance, Themes?', [
            'index.php together with functions.php, in either order',
            'style.css plus header.php and a screenshot.png image',
            'style.css carrying the header comment, plus index.php',
            'functions.php that calls add_theme_support for the basics',
          ], 2, 'WordPress reads the theme identity from the comment block at the top of style.css and needs index.php as the hierarchy backstop, and nothing else is required.'),
        ]
      ),
        lesson('Enqueueing Assets Properly', 12, `
Never write a \`<link>\` or \`<script>\` tag into \`header.php\`. WordPress has a dependency-aware registry, and bypassing it is how sites end up loading jQuery three times.

### The enqueue hook

\`\`\`php
add_action( 'wp_enqueue_scripts', function () {
  $dir = get_stylesheet_directory();       // filesystem path
  $uri = get_stylesheet_directory_uri();   // public URL

  wp_enqueue_style(
    'cortex-main',                          // handle — must be unique site-wide
    $uri . '/assets/css/main.css',
    [],                                     // dependencies (other handles)
    filemtime( $dir . '/assets/css/main.css' )  // version
  );

  wp_enqueue_script(
    'cortex-nav',
    $uri . '/assets/js/nav.js',
    [],
    filemtime( $dir . '/assets/js/nav.js' ),
    true                                    // true = load in the footer
  );
} );
\`\`\`

Three details earn their place:

- **\`filemtime()\` as the version** appends the file's modification time as a query string, so browsers pick up your change the moment you save. Hardcoding \`'1.0'\` means users keep the stale file until you remember to bump it — the reason "it works on my machine after a hard refresh" is such a common complaint.
- **The dependency array** is the whole point of the registry. \`[ 'jquery' ]\` guarantees jQuery is printed first, and WordPress ships its own copy in no-conflict mode.
- **\`true\` for the footer** keeps scripts out of the critical rendering path.

### Loading only what a page needs

\`\`\`php
add_action( 'wp_enqueue_scripts', function () {
  // The map library is 90KB and only the contact page uses it.
  if ( is_page( 'contact' ) ) {
    wp_enqueue_script( 'cortex-map', get_stylesheet_directory_uri() . '/assets/js/map.js', [], '1.0', true );
  }
} );
\`\`\`

Conditional enqueueing is the cheapest performance win in a theme, and it is what most page-builder sites fail to do.

### Passing data from PHP to JavaScript

Do not print a \`<script>\` block full of PHP variables. Attach the data to the handle instead:

\`\`\`php
wp_localize_script( 'cortex-nav', 'cortexData', [
  'restUrl' => esc_url_raw( rest_url( 'cortex/v1/' ) ),
  'nonce'   => wp_create_nonce( 'wp_rest' ),
  'labels'  => [ 'loading' => __( 'Loading…', 'cortex' ) ],
] );
\`\`\`

\`\`\`js
// nav.js — cortexData is a global object WordPress printed before this file
fetch(cortexData.restUrl + 'events', {
  headers: { 'X-WP-Nonce': cortexData.nonce },
});
\`\`\`

That \`nonce\` is what proves a logged-in user's request is genuine — we use it properly in Chapters 4 and 5. For pure strings with no localisation, \`wp_add_inline_script()\` is the leaner modern option.

### Parent vs child paths, again

| Function | Returns |
|---|---|
| \`get_template_directory_uri()\` | The **parent** theme URL |
| \`get_stylesheet_directory_uri()\` | The **active** theme URL (child if there is one) |

In a standalone theme they are identical, which is exactly why the mistake goes unnoticed. The day someone makes a child theme, every asset referenced with \`get_template_directory_uri()\` keeps loading the parent's file and the child's overrides do nothing.

### Admin and login screens are separate

\`wp_enqueue_scripts\` fires on the front end only. Use \`admin_enqueue_scripts\` for the dashboard and \`login_enqueue_scripts\` for the login page. Loading your front-end CSS into the admin with the wrong hook is a fast way to break the editor.
        `,
        [
          q('A theme script throws Uncaught ReferenceError on jQuery even though jQuery is present in the page. What is the fix?', [
            'Move the script from the footer up into the document head',
            'Register the script under a handle nobody else has claimed',
            'Enqueue the script on init rather than wp_enqueue_scripts',
            'Name jquery in the dependency array so it prints first',
          ], 3, 'The dependency array is what orders the printed tags, so without it your file can be output before the library it needs.'),
          q('A REST URL and a nonce generated in PHP need to reach a theme JavaScript file. What is the right mechanism?', [
            'wp_localize_script() attached to the script handle',
            'A script block printed into header.php by the theme',
            'Data attributes written onto the body element by PHP',
            'A second request to /wp-json on every page load',
          ], 0, 'wp_localize_script prints the data as a JavaScript object immediately before the file that needs it, so the values are available without inline PHP in your templates.'),
          q('Front end styles are loading into the dashboard and breaking the editor layout. What did the code most likely do?', [
            'Passed the wrong path helper for the stylesheet URL',
            'Hooked the enqueue onto admin_enqueue_scripts by mistake',
            'Left out the dependency array on the stylesheet call',
            'Used a handle that another plugin had already taken',
          ], 1, 'wp_enqueue_scripts fires only on the front end, so admin styling arrives only when the callback was attached to the admin hook instead.'),
        ]
      ),
        lesson('Template Parts, Menus, and Reuse', 14, `
Once a theme has more than three templates you will notice the same markup repeated. WordPress has a specific mechanism for that, and it is not \`include\`.

### get_template_part()

\`\`\`php
// In index.php, inside the Loop:
get_template_part( 'template-parts/content', get_post_type() );
\`\`\`

That call looks for \`template-parts/content-event.php\`, then falls back to \`template-parts/content.php\`. The slug/name pair mirrors the template hierarchy, so adding support for a new post type means adding a file, not editing a conditional.

\`\`\`php
<?php // template-parts/content.php ?>
<article <?php post_class( 'card' ); ?>>
  <?php if ( has_post_thumbnail() ) : ?>
    <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'medium' ); ?></a>
  <?php endif; ?>
  <h2 class="card__title">
    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
  </h2>
  <?php the_excerpt(); ?>
</article>
\`\`\`

**Use \`get_template_part()\`, never \`include\` or \`require\`.** A hardcoded \`include( get_template_directory() . '/parts/card.php' )\` bypasses the child-theme lookup entirely, so a child theme can never override that fragment — and it skips the \`get_template_part\` hooks that plugins use.

### Passing arguments (WordPress 5.5+)

The third parameter hands variables to the part in an \`$args\` array:

\`\`\`php
get_template_part( 'template-parts/card', null, [
  'heading_level' => 'h3',
  'show_excerpt'  => false,
] );
\`\`\`

\`\`\`php
<?php // template-parts/card.php
$tag  = $args['heading_level'] ?? 'h2';
$show = $args['show_excerpt']  ?? true;
?>
<<?php echo esc_html( $tag ); ?> class="card__title"><?php the_title(); ?></<?php echo esc_html( $tag ); ?>>
<?php if ( $show ) { the_excerpt(); } ?>
\`\`\`

Before 5.5 people used \`set_query_var()\` for this; you will still see it in older themes.

### Handling the empty case

Give "no results" its own part so search, archives, and the blog index all present it identically:

\`\`\`php
<?php if ( have_posts() ) : ?>
  <?php while ( have_posts() ) : the_post(); ?>
    <?php get_template_part( 'template-parts/content', get_post_type() ); ?>
  <?php endwhile; ?>
<?php else : ?>
  <?php get_template_part( 'template-parts/content', 'none' ); ?>
<?php endif; ?>
\`\`\`

### Navigation menus

You registered the locations in \`functions.php\` last lesson. Render one:

\`\`\`php
wp_nav_menu( [
  'theme_location' => 'primary',
  'container'      => 'nav',
  'container_class' => 'site-nav',
  'menu_class'     => 'site-nav__list',
  'depth'          => 2,
  'fallback_cb'    => false,   // print nothing if no menu is assigned
] );
\`\`\`

\`fallback_cb\` defaults to \`wp_page_menu\`, which dumps a list of every page on the site when an admin has not yet assigned a menu. Setting it to \`false\` is almost always what you want — an empty header beats an accidental sitemap.

The markup \`wp_nav_menu\` produces already carries \`current-menu-item\` and \`menu-item-has-children\` classes. Style those rather than reimplementing the menu with a custom query.

### Widget areas

\`\`\`php
add_action( 'widgets_init', function () {
  register_sidebar( [
    'name'          => __( 'Footer', 'cortex' ),
    'id'            => 'footer-1',
    'before_widget' => '<section id="%1$s" class="widget %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h2 class="widget__title">',
    'after_title'   => '</h2>',
  ] );
} );

// In footer.php
if ( is_active_sidebar( 'footer-1' ) ) {
  dynamic_sidebar( 'footer-1' );
}
\`\`\`

The \`is_active_sidebar()\` guard stops you printing an empty wrapper \`<div>\` that your CSS then adds 4rem of padding to.
        `,
        [
          q('No menu has been assigned to the primary location yet, and the header prints a link to every page on the site. What causes that?', [
            'The location was registered too late, after the theme setup',
            'depth was left at 0, so child pages are being included too',
            'wp_nav_menu falls back to wp_page_menu unless you disable it',
            'Two menu locations were registered under the same label',
          ], 2, 'The fallback_cb argument defaults to wp_page_menu, which lists the site pages, so passing false is what prints nothing until an admin assigns a real menu.'),
          q('A Loop calls get_template_part(\'template-parts/content\', get_post_type()) on the event archive and content-event.php does not exist. What renders?', [
            'template-parts/content-post.php, the default post type part',
            'single-event.php taken from the root of the active theme',
            'Nothing at all, because the requested part cannot be resolved',
            'template-parts/content.php, the version without a name suffix',
          ], 3, 'The slug and name pair mirrors the template hierarchy, so a missing named part falls back to the plain slug file before giving up.'),
          q('Why wrap a dynamic_sidebar() call in is_active_sidebar() rather than calling it directly?', [
            'So an empty area does not print a wrapper the CSS still pads',
            'Because dynamic_sidebar raises a warning when the area is empty',
            'Because widgets are registered only after the footer has rendered',
            'Because register_sidebar takes effect on admin screens alone',
          ], 0, 'dynamic_sidebar prints nothing when no widgets are assigned, but your own surrounding markup still renders, leaving a padded empty block on the page.'),
        ]
      ),
            lesson('Theme Options with the Customizer', 13, `
The client calls at six on a Friday: the footer still says 2024 and the tagline has to change before Monday. You can edit a template, commit, deploy and hope, or the theme can already have a field for it. Twenty minutes of Customizer work when you build the theme buys the client every small text change for the life of the site.

### Section, setting, control

Three objects, registered on one hook. A **section** is where the field appears, a **setting** is what gets stored, a **control** is the input the client sees.

\`\`\`php
add_action( 'customize_register', function ( WP_Customize_Manager $wp_customize ) {
  $wp_customize->add_section( 'cortex_footer', [
    'title'    => __( 'Footer', 'cortex' ),
    'priority' => 130,
  ] );

  $wp_customize->add_setting( 'cortex_footer_note', [
    'default'           => 'Built in Lahore',
    'sanitize_callback' => 'sanitize_text_field',
    'transport'         => 'postMessage',
  ] );

  $wp_customize->add_control( 'cortex_footer_note', [
    'label'   => __( 'Footer note', 'cortex' ),
    'section' => 'cortex_footer',
    'type'    => 'text',
  ] );
} );
\`\`\`

Read it back in \`footer.php\`:

\`\`\`php
echo esc_html( get_theme_mod( 'cortex_footer_note', 'Built in Lahore' ) );
\`\`\`

Notice the default is written twice. If those two strings drift apart, the preview shows one value and the live site another, and you will spend an hour blaming caching.

### sanitize_callback is the boundary, not a nicety

Leave it out and WordPress stores exactly what the form posted. The Customizer is open to anyone with \`edit_theme_options\`, which on a real site often means an editor you have never met.

\`\`\`php
// Broken: whatever is typed goes into the database and back out into the page.
$wp_customize->add_setting( 'cortex_footer_note', [ 'default' => '' ] );

// Fixed: pick the callback that matches the data.
'sanitize_callback' => 'sanitize_text_field',   // plain text
'sanitize_callback' => 'esc_url_raw',           // a URL
'sanitize_callback' => 'absint',                // a positive integer
'sanitize_callback' => 'wp_kses_post',          // limited HTML
\`\`\`

For a select, write the callback yourself and treat the allowed list as the only truth:

\`\`\`php
'sanitize_callback' => function ( $value ) {
  return in_array( $value, [ 'left', 'center' ], true ) ? $value : 'left';
},
\`\`\`

### Theme mod or option

| Storage | Read with | Scope | Survives a theme switch |
|---|---|---|---|
| Theme mod | \`get_theme_mod( 'cortex_footer_note' )\` | one array per theme | no |
| Option | \`get_option( 'cortex_events_settings' )\` | site wide | yes |

The rule follows from that last column. Appearance belongs in theme mods, because a new theme should not inherit the old one's layout choices. Anything the business would be upset to lose, opening hours, an API key, a list of events, belongs in an option or a plugin.

### Live preview without the reload

The default \`transport\` is \`refresh\`, which reloads the whole preview iframe every time the client pauses typing. Correct, and slow on a heavy page. \`postMessage\` skips the reload, but then you owe WordPress an answer about what to update. Selective refresh is the cheap way to give it:

\`\`\`php
$wp_customize->selective_refresh->add_partial( 'cortex_footer_note', [
  'selector'        => '.site-footer__note',
  'render_callback' => function () {
    return get_theme_mod( 'cortex_footer_note', 'Built in Lahore' );
  },
] );
\`\`\`

Set \`postMessage\` with no partial and no preview JavaScript and the field appears to be broken: the client types, nothing moves, and the value only shows up after Publish. That is the single most reported Customizer bug, and it is self inflicted.

### Where this fits now

Activate a block theme and the Customizer link disappears from the menu unless a plugin still registers something in it, because the Site Editor covers the same ground. For classic themes it remains the standard place for theme options, and it is the only settings screen most clients will ever open without being asked twice.
      `,
        [
          q('A Customizer setting is registered with no sanitize_callback. What is the practical consequence?', [
            'The control renders but the value is never written to storage',
            'Whatever the form posts is stored raw and printed back out',
            'WordPress refuses to register the setting and logs a notice',
            'The value saves correctly but the preview stops refreshing',
          ], 1, 'Without a sanitize callback WordPress stores the submitted value untouched, so anyone holding edit_theme_options can push markup straight through the setting into the front end.'),
          q('A site switches from the cortex theme to cortex-two and every Customizer choice is suddenly gone. Why?', [
            'The Customizer discards its values when a theme is deleted',
            'Switching themes clears the autoloaded rows in wp_options',
            'Theme mods are stored per theme, so the new one starts empty',
            'Only options registered on init are carried between themes',
          ], 2, 'get_theme_mod reads an array keyed to the active theme, so a different theme reads a different array and falls back to the defaults you passed.'),
          q('A control uses transport postMessage and the preview no longer changes while the client types. What is missing?', [
            'A sanitize_callback on the setting it is bound to',
            'A default value passed to the get_theme_mod call',
            'A higher priority on the customize_register hook',
            'Preview JavaScript, or a selective refresh partial',
          ], 3, 'postMessage tells WordPress not to reload the preview, so nothing updates until you supply the code that repaints the affected markup.'),
        ]
      ),
      ],
      [
        q('A theme looks fine until plugins are installed, then none of their scripts or styles appear. What is the likely cause?', [
          'The theme is missing style.css metadata',
          'wp_head() and wp_footer() are not called in the templates',
          'functions.php is loaded too late',
          'The plugins need a child theme',
        ], 1, 'wp_head() and wp_footer() are the hooks WordPress and plugins use to inject their output; without them nothing gets printed.'),
        q('Why use filemtime() as the version argument in wp_enqueue_style?', [
          'It compresses the file',
          'It busts the browser cache automatically whenever the file changes',
          'It is required by WordPress',
          'It loads the file in the footer',
        ], 1, 'The modification time changes on every save, so the URL changes and browsers fetch the new file instead of a stale one.'),
        q('A child theme copies template-parts/card.php but the parent version still renders. What did the parent do wrong?', [
          'Used get_template_part()',
          'Used include() with a hardcoded parent path',
          'Registered the part on init',
          'Forgot post_class()',
        ], 1, 'include() with get_template_directory() always points at the parent; get_template_part() checks the child theme first.'),
        q('Which enqueue path is correct for an asset that must be overridable by a child theme?', [
          'get_template_directory_uri()',
          'get_stylesheet_directory_uri()',
          'plugins_url()',
          'site_url()',
        ], 1, 'get_stylesheet_directory_uri() resolves to the active theme, which is the child when one is in use.'),
      ]
    ),
    chapter(
      'Hooks and the Plugin API',
      'Actions, filters, and the packaging that turns a snippet into a real plugin.',
      [
        lesson('Actions: The WordPress Event System', 13, `
WordPress is extensible because core code stops at hundreds of named moments and asks "does anyone want to do something here?" Those moments are **hooks**, and there are two kinds. An **action** says *something just happened*. A **filter** says *here is a value, would you like to change it?*

### How an action works

Core calls \`do_action( 'save_post', $post_id, $post, $update )\`. Any function registered to that name runs, in priority order, receiving those arguments:

\`\`\`php
add_action( 'save_post', 'cortex_clear_event_cache', 10, 3 );

function cortex_clear_event_cache( $post_id, $post, $update ) {
  // Skip autosaves and revisions or this fires constantly while typing.
  if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
    return;
  }
  if ( 'event' !== $post->post_type ) {
    return;
  }
  delete_transient( 'cortex_upcoming_events' );
}
\`\`\`

An action returns nothing. Whatever you return is discarded.

### The four arguments to add_action

\`\`\`php
add_action( $hook_name, $callback, $priority = 10, $accepted_args = 1 );
\`\`\`

- **Priority** — lower runs earlier. Default 10. Use 5 to run before most plugins, 20 to run after them, \`PHP_INT_MAX\` to run last.
- **\`$accepted_args\`** — how many arguments your callback wants. **This is the number-one source of fatal errors in hook code.** Leave it at the default 1 while your function signature declares three parameters and PHP 8 throws \`ArgumentCountError: Too few arguments\`. If your callback takes three parameters, you must pass \`3\`.

### The hooks you will use constantly

| Hook | Fires when | Typical use |
|---|---|---|
| \`init\` | Core loaded, before the query | Register post types, taxonomies, shortcodes |
| \`after_setup_theme\` | Theme loading | \`add_theme_support\`, menus |
| \`wp_enqueue_scripts\` | Front-end asset time | Styles and scripts |
| \`admin_menu\` | Admin menu building | Add settings pages |
| \`save_post\` | A post is saved | Sync data, clear caches |
| \`wp_head\` / \`wp_footer\` | Template output | Inject markup |
| \`rest_api_init\` | REST routes registering | \`register_rest_route\` |

### Removing someone else's action

\`\`\`php
remove_action( 'wp_head', 'wp_generator' );   // stop printing the WP version
\`\`\`

Removal only works if you match the hook name, the exact callback, **and the priority it was added with**. If a plugin added its callback at priority 20 and you call \`remove_action\` with the default 10, nothing happens and you get no warning.

There is a harder case: **a callback added as an anonymous closure cannot be removed at all**, because you have no reference to it. This is why you should register your own hooks with named functions or class methods when other code might reasonably want to unhook them:

\`\`\`php
// Removable
add_action( 'wp_footer', 'cortex_print_banner' );

// Effectively permanent — nobody else can ever unhook this
add_action( 'wp_footer', function () { echo '<div class="banner"></div>'; } );
\`\`\`

Timing matters too: \`remove_action\` must run *after* the original \`add_action\` and *before* the hook fires. Wrapping it in an earlier hook such as \`init\` or \`wp_loaded\` is the reliable pattern.

### Publish your own hooks

If you write a plugin others will extend, fire your own actions:

\`\`\`php
function cortex_render_event_card( $post_id ) {
  do_action( 'cortex_before_event_card', $post_id );
  echo '<article class="event-card">…</article>';
  do_action( 'cortex_after_event_card', $post_id );
}
\`\`\`

That costs nothing when unused and means the next person customising your plugin does not have to fork it.
        `,
        [
          q('A plugin registers its footer banner with an anonymous closure. Why can no other code unhook it?', [
            'remove_action needs the exact callback reference, which nobody has',
            'Closures are always registered after the named callbacks have run',
            'remove_action cannot target output hooks such as wp_head or wp_footer',
            'A closure ignores the priority argument, so removal cannot match it',
          ], 0, 'Removal works by matching the same callback value that was added, and a closure created inline leaves no reference anyone else can pass in.'),
          q('Your markup must be printed after a plugin that hooks wp_head at priority 20. What do you register?', [
            'The same hook, with accepted_args raised so it receives context',
            'The same hook at priority 21 or higher so it runs afterwards',
            'The same hook at priority 5 so your value is set up first',
            'An earlier hook such as init, which always runs before wp_head',
          ], 1, 'Callbacks on one hook run in ascending priority order, so a number above the other registration is what puts your code last.'),
          q('A save_post callback fires every few seconds while an editor is typing and keeps clearing a cache. What is missing?', [
            'A check that the post status has actually changed to publish',
            'A lower priority so the callback runs before the autosave does',
            'Guards that return early on autosaves and on stored revisions',
            'The accepted_args value raised to 3 so the post object arrives',
          ], 2, 'The block editor autosaves continuously and each autosave writes a post row, so wp_is_post_autosave and wp_is_post_revision are what stop the callback running on them.'),
        ]
      ),
        lesson('Filters: Changing Data In Flight', 13, `
A filter hands you a value and expects a value back. Core calls \`apply_filters( 'the_content', $content )\` and uses whatever comes out. That single mechanism is how excerpt length, post content, admin columns, email headers, and query arguments are all customisable.

### The shape of every filter

\`\`\`php
add_filter( 'excerpt_length', function ( $length ) {
  return 25;   // words
}, 10 );

add_filter( 'excerpt_more', function ( $more ) {
  return ' … <a href="' . esc_url( get_permalink() ) . '">' . esc_html__( 'Read more', 'cortex' ) . '</a>';
} );
\`\`\`

### The mistake that blanks the page

**Forgetting to return the value is the single most common bug in WordPress filter code.** A filter callback that returns nothing returns \`null\`, and core happily uses \`null\`:

\`\`\`php
// Broken: every post body on the site becomes empty.
add_filter( 'the_content', function ( $content ) {
  if ( is_singular( 'event' ) ) {
    return $content . cortex_event_details();
  }
  // No return here — non-event posts lose all their content.
} );

// Correct: every path returns.
add_filter( 'the_content', function ( $content ) {
  if ( is_singular( 'event' ) ) {
    $content .= cortex_event_details();
  }
  return $content;
} );
\`\`\`

The symptom is confusing because it usually affects only *some* pages — the ones that took the branch with no return. Any time content mysteriously disappears, grep your filters for a missing \`return\`.

### Filters with extra context

Many filters pass more than one argument, and the same \`$accepted_args\` rule from the last lesson applies. Only the **first** argument is the value you return:

\`\`\`php
add_filter( 'wp_mail_from_name', 'cortex_mail_name', 10, 1 );

add_filter( 'body_class', function ( $classes, $css_class ) {
  if ( is_singular( 'event' ) && has_term( 'workshop', 'event_type' ) ) {
    $classes[] = 'is-workshop';
  }
  return $classes;   // return the modified array, not just your addition
}, 10, 2 );
\`\`\`

Returning only your own class instead of the whole array wipes out \`logged-in\`, \`single\`, and everything else the site's CSS depends on.

### Priority decides who wins

\`\`\`php
add_filter( 'the_title', 'cortex_prefix', 5 );    // runs first
add_filter( 'the_title', 'cortex_suffix', 50 );   // runs on the result
\`\`\`

When your change is being overwritten by a plugin, the fix is usually a higher priority number, not more code. If a plugin filters at 10, register yours at 11.

### Short-circuit filters

A common core pattern hands you \`false\` (or \`null\`) and uses your return value *instead of* doing the work:

\`\`\`php
add_filter( 'pre_option_blogname', function ( $pre ) {
  return 'Overridden Name';   // core never queries the database
} );
\`\`\`

Filters starting with \`pre_\` almost always work this way. Return the original value untouched to opt out.

### Finding the hook you need

Three techniques, in order of usefulness:

1. Search the core or plugin source for \`apply_filters(\` near the behaviour you want to change. The hook name is right there.
2. Install **Query Monitor** and look at its Hooks panel for the current request.
3. Dump everything temporarily:

\`\`\`php
add_action( 'all', function ( $hook ) {
  if ( current_user_can( 'manage_options' ) ) {
    error_log( $hook );
  }
} );
\`\`\`

The \`all\` hook fires for every action and filter on the request. It is a debugging tool only — remove it before you commit, because it is genuinely slow.
        `,
        [
          q('A body_class filter returns an array holding only is-workshop, and the site layout falls apart. Why?', [
            'body_class expects a space separated string rather than an array',
            'The class value has to be escaped before the filter returns it',
            'The filter ran before the core classes had been assembled at all',
            'The callback must return the whole array, so core classes are lost',
          ], 3, 'A filter replaces the value it was given, so returning a fresh array throws away logged-in, single and every other class the stylesheets depend on.'),
          q('What does a filter whose name begins with pre_, such as pre_option_blogname, typically let you do?', [
            'Return a value that replaces the lookup, so the work never runs',
            'Change the value after it has been read back from the database',
            'Run before every other callback registered on the same hook name',
            'Apply your change on admin screens only, never on the front end',
          ], 0, 'These short circuit filters hand you a placeholder and use anything other than that placeholder instead of doing the query, so returning the original value opts out.'),
          q('Why is add_action(\'all\', ...) described as a debugging tool that must not stay in committed code?', [
            'It reports only the hooks fired after template_redirect has run',
            'It fires for every action and filter on the request, so it is slow',
            'It silently unhooks other callbacks registered on the same hooks',
            'It writes nothing to the log unless WP_DEBUG_DISPLAY is enabled',
          ], 1, 'The all hook runs your callback hundreds or thousands of times per request, which is fine for a minute of tracing and unacceptable on a live site.'),
        ]
      ),
        lesson('Your First Plugin', 14, `
Theme code belongs to the *look* of a site. Content types, business logic, and integrations belong in a **plugin** — because a site owner will change themes one day, and losing their events when they do is not acceptable.

### The plugin header

A plugin is any PHP file in \`wp-content/plugins/\` with a header comment. Give it a folder from the start:

\`\`\`php
<?php
/**
 * Plugin Name: Cortex Events
 * Description: Custom event post type, taxonomy, and REST endpoints.
 * Version:     1.0.0
 * Author:      Your Name
 * License:     GPL-2.0-or-later
 * Text Domain: cortex-events
 * Requires PHP: 8.0
 */

// Block direct browser access to this file.
defined( 'ABSPATH' ) || exit;

define( 'CORTEX_EVENTS_VERSION', '1.0.0' );
define( 'CORTEX_EVENTS_PATH', plugin_dir_path( __FILE__ ) );
define( 'CORTEX_EVENTS_URL', plugin_dir_url( __FILE__ ) );

require_once CORTEX_EVENTS_PATH . 'includes/post-types.php';
require_once CORTEX_EVENTS_PATH . 'includes/rest.php';
\`\`\`

The \`defined( 'ABSPATH' ) || exit;\` line goes at the top of **every** PHP file you write. Without it, anyone can request \`/wp-content/plugins/cortex-events/includes/rest.php\` directly and run your file outside WordPress, with no user, no security checks, and often a fatal error that leaks your server paths.

### Prefix everything

PHP has one global function namespace and a site may run forty plugins. Every function, class, constant, option name, and hook name you define needs a prefix — \`cortex_events_\` here. A generic \`function get_events()\` will collide eventually, and the result is a fatal "cannot redeclare" error that takes the whole site down.

Namespaces or a static class work too:

\`\`\`php
namespace Cortex\\Events;

class Plugin {
  public static function init(): void {
    add_action( 'init', [ self::class, 'register_types' ] );
  }
  public static function register_types(): void { /* … */ }
}
Plugin::init();
\`\`\`

### Activation and deactivation

\`\`\`php
register_activation_hook( __FILE__, function () {
  cortex_events_register_post_type();  // must exist before flushing
  flush_rewrite_rules();
  add_option( 'cortex_events_settings', [ 'per_page' => 10 ], '', false );
} );

register_deactivation_hook( __FILE__, function () {
  flush_rewrite_rules();
} );
\`\`\`

**\`flush_rewrite_rules()\` belongs in the activation hook and nowhere else.** Calling it on \`init\` — which plenty of tutorials show — rewrites the rules option on every single request and is one of the slowest things you can do to a WordPress site. Register the post type first inside the activation callback, or the flush happens before WordPress knows the new URLs exist and you get 404s.

### Storing settings

The Options API stores name/value pairs in \`wp_options\`:

\`\`\`php
$settings = get_option( 'cortex_events_settings', [] );
update_option( 'cortex_events_settings', [ 'per_page' => 20 ] );
delete_option( 'cortex_events_settings' );
\`\`\`

Store **one array** rather than fifteen separate options, and pass \`false\` as the fourth argument to \`add_option\` for anything not needed on every request. Autoloaded options are all loaded into memory on every page load; bloated autoload data is a measurable performance problem on old sites.

### A settings page in one screen

\`\`\`php
add_action( 'admin_menu', function () {
  add_options_page(
    __( 'Cortex Events', 'cortex-events' ),  // page title
    __( 'Cortex Events', 'cortex-events' ),  // menu label
    'manage_options',                        // capability — not a role name
    'cortex-events',                         // menu slug
    'cortex_events_render_settings'          // callback
  );
} );

add_action( 'admin_init', function () {
  register_setting( 'cortex_events', 'cortex_events_settings', [
    'sanitize_callback' => 'cortex_events_sanitize_settings',
    'default'           => [ 'per_page' => 10 ],
  ] );
} );

function cortex_events_sanitize_settings( $input ) {
  return [ 'per_page' => max( 1, min( 100, absint( $input['per_page'] ?? 10 ) ) ) ];
}
\`\`\`

The capability string \`manage_options\` is the gate. Passing a role name like \`'administrator'\` there is wrong — capabilities are checked, roles are not, and a custom role with \`manage_options\` should be able to reach the page.

### Clean uninstall

Create \`uninstall.php\` in the plugin folder. WordPress runs it only when the user deletes the plugin:

\`\`\`php
<?php
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;
delete_option( 'cortex_events_settings' );
\`\`\`

Deactivation should be reversible; uninstall is where you clean up.
        `,
        [
          q('What does the line defined( \'ABSPATH\' ) || exit; at the top of every plugin file actually prevent?', [
            'A second copy of the same plugin being activated at once',
            'The plugin loading earlier than the must-use plugins folder',
            'The file being requested directly and executed outside WordPress',
            'Fatal errors caused by a constant being defined more than once',
          ], 2, 'Without the guard anyone can request the file by URL and run it with no core loaded, which means no user, no capability checks and error output that leaks server paths.'),
          q('Why pass false as the fourth argument to add_option for a setting that is read on one admin screen?', [
            'Non autoloaded options survive when the plugin is deactivated',
            'It keeps the option from being exposed through the REST API',
            'It allows the option to hold an array rather than a scalar value',
            'Autoloaded options are pulled into memory on every single request',
          ], 3, 'Every autoloaded row is fetched and unserialised on each page load, so options only needed occasionally should be left out of that set.'),
          q('add_options_page is passed \'administrator\' where the capability argument belongs. What happens?', [
            'The check is made against capabilities, so the page is unreachable',
            'The page still opens but its settings form is unable to save data',
            'The menu entry is moved under Tools instead of under Settings',
            'Only network administrators can open the page on a multisite install',
          ], 0, 'WordPress runs current_user_can against that string, and no user holds a capability named administrator, so even a real admin fails the check and a custom role granted manage_options is locked out for no reason.'),
        ]
      ),
            lesson('Shortcodes and Ajax Handlers', 13, `
A client pastes \`[cortex_events limit="3"]\` halfway down a page. The list renders at the very top, above the heading, above everything. The query is correct, the markup is correct, and the bug is one keyword: the callback echoes instead of returning.

### A shortcode returns a string

\`do_shortcode\` runs your callback while it is still assembling the content string. Anything you echo goes straight to the output buffer that is already open, which is why it lands before the paragraph it was written into.

\`\`\`php
// Broken: output escapes to the top of the page.
add_shortcode( 'cortex_events', function ( $atts ) {
  echo '<ul class="event-list">';
  // ...
} );
\`\`\`

Buffer it and hand back the string:

\`\`\`php
add_shortcode( 'cortex_events', 'cortex_events_shortcode' );

function cortex_events_shortcode( $atts ) {
  $atts  = shortcode_atts( [ 'limit' => 3, 'type' => 'workshop' ], $atts, 'cortex_events' );
  $query = new WP_Query( [
    'post_type'      => 'event',
    'posts_per_page' => min( 20, absint( $atts['limit'] ) ),
    'no_found_rows'  => true,
  ] );

  ob_start();
  echo '<ul class="event-list">';
  while ( $query->have_posts() ) {
    $query->the_post();
    printf( '<li><a href="%s">%s</a></li>', esc_url( get_permalink() ), esc_html( get_the_title() ) );
  }
  echo '</ul>';
  wp_reset_postdata();
  return ob_get_clean();
}
\`\`\`

Two habits in there earn their keep. \`shortcode_atts\` merges what the user typed over your defaults and discards keys you never declared, so \`[cortex_events limt="9"]\` quietly uses 3 rather than throwing. And every attribute arrives as a **string** with a **lowercased key**, so \`LIMIT="9"\` becomes \`limit\`, and \`absint()\` is what turns it into a number you can trust.

Enclosing shortcodes get the wrapped content as a second parameter:

\`\`\`php
add_shortcode( 'cortex_note', function ( $atts, $content = '' ) {
  return '<aside class="note">' . do_shortcode( wp_kses_post( $content ) ) . '</aside>';
} );
\`\`\`

Drop that inner \`do_shortcode\` and any shortcode nested inside the note prints as literal text.

### Ajax needs two hooks, not one

The other half of the plugin API is \`admin-ajax.php\`. Every request posts an \`action\` field, and WordPress turns it into a hook name:

\`\`\`php
add_action( 'wp_ajax_cortex_rsvp', 'cortex_handle_rsvp' );        // logged in
add_action( 'wp_ajax_nopriv_cortex_rsvp', 'cortex_handle_rsvp' ); // logged out

function cortex_handle_rsvp() {
  check_ajax_referer( 'cortex_rsvp', 'nonce' );

  $event_id = absint( $_POST['event_id'] ?? 0 );
  if ( ! $event_id || 'event' !== get_post_type( $event_id ) ) {
    wp_send_json_error( [ 'message' => 'Unknown event' ], 400 );
  }

  add_post_meta( $event_id, 'rsvp', get_current_user_id() ?: 0 );
  wp_send_json_success( [ 'seats' => cortex_seats_left( $event_id ) ] );
}
\`\`\`

\`wp_send_json_success\` and \`wp_send_json_error\` print the JSON envelope and exit for you. Returning a value instead leaves WordPress to append its own \`0\` to your response, which breaks \`JSON.parse\` on the client.

The browser side posts form encoded data to the URL you localised earlier with \`admin_url( 'admin-ajax.php' )\`:

\`\`\`js
const body = new URLSearchParams({
  action: 'cortex_rsvp',
  nonce: cortexData.nonce,
  event_id: 41,
});
const res = await fetch(cortexData.ajaxUrl, { method: 'POST', body });
const { success, data } = await res.json();
\`\`\`

### Read the response before you read the code

| Body | What it is telling you |
|---|---|
| \`0\` | No handler matched: the action is misspelled, or only the logged in hook was registered |
| \`-1\` | \`check_ajax_referer\` rejected the nonce, usually stale after a long session |
| \`{"success":false}\` | Your handler ran and refused the request on purpose |

That \`0\` is the classic support ticket. It works for you as an administrator and fails for every visitor, because \`wp_ajax_nopriv_cortex_rsvp\` was never registered.

### When to use it at all

Every admin-ajax request boots the full admin stack, hits one URL, and carries no route or method semantics. New work belongs on the REST API in the next chapter. Keep admin-ajax for older plugins you maintain and for handlers that already live inside the dashboard.
      `,
        [
          q('A shortcode callback builds its markup with echo instead of returning it. Where does that markup appear?', [
            'Nowhere, because do_shortcode discards anything the callback prints',
            'At the top of the page, ahead of the content it was written into',
            'Exactly where the shortcode sits, since echo and return both work',
            'Twice on the page, once at the top and once in the correct place',
          ], 1, 'The callback runs while the content string is still being assembled, so echoed output goes to the already open output buffer and is flushed before the finished content is printed.'),
          q('An Ajax call returns the body 0 for logged out visitors while it works for the administrator testing it. What is missing?', [
            'A nonce created with wp_create_nonce and sent with the request',
            'The admin-ajax URL passed to the script through wp_localize_script',
            'A handler registered on the wp_ajax_nopriv_ variant of the action',
            'The action field included in the body of the POST request itself',
          ], 2, 'WordPress dispatches logged out requests to the nopriv hook only, so registering just wp_ajax_ leaves no handler for visitors and the request falls through to the default 0 response.'),
          q('Why should shortcode attributes be run through shortcode_atts() rather than used straight from the array?', [
            'It escapes each attribute so the values are safe to print as HTML',
            'It casts numeric strings to integers before your callback sees them',
            'It caches the parsed attributes so repeated shortcodes stay cheap',
            'It merges what was typed over your defaults and drops unknown keys',
          ], 3, 'shortcode_atts guarantees every key you declared exists with a sensible fallback and strips anything you did not declare, so a mistyped attribute degrades to the default instead of causing an undefined index.'),
        ]
      ),
      ],
      [
        q('Your save_post callback declares three parameters and PHP throws ArgumentCountError. What is wrong?', [
          'save_post only passes one argument',
          'add_action was called without setting $accepted_args to 3',
          'The priority is too low',
          'The callback must be a closure',
        ], 1, 'WordPress passes only as many arguments as $accepted_args declares, which defaults to 1.'),
        q('Some posts render with completely empty content after adding a the_content filter. Most likely cause?', [
          'The filter priority is too high',
          'A code path in the callback returns nothing, so null replaces the content',
          'the_content cannot be filtered on singular pages',
          'The filter needs $accepted_args set to 2',
        ], 1, 'A filter must return a value on every branch; falling off the end returns null and core uses it.'),
        q('remove_action fails to remove a plugin callback even though the hook and function names are right. What is missing?', [
          'The plugin must be deactivated first',
          'The priority must match the one used in add_action',
          'remove_action only works in the admin',
          'You must call remove_filter instead',
        ], 1, 'Removal matches on hook name, callback, and priority together; a mismatched priority silently does nothing.'),
        q('Where should flush_rewrite_rules() be called?', [
          'On every init',
          'In the plugin activation hook, after registering the post type',
          'On wp_footer',
          'In wp-config.php',
        ], 1, 'It is expensive; run it once on activation, and only after the new URLs are registered so they get included.'),
      ]
    ),
    chapter(
      'Content Modelling and the REST API',
      'Custom post types, taxonomies, meta, and endpoints that other applications can consume.',
      [
        lesson('Custom Post Types', 14, `
Posts and pages are just two rows in the same \`wp_posts\` table with different \`post_type\` values. Registering your own is how you model events, courses, properties, or team members without abusing categories.

### Register on init, from a plugin

\`\`\`php
add_action( 'init', 'cortex_events_register_post_type' );

function cortex_events_register_post_type() {
  register_post_type( 'event', [
    'labels' => [
      'name'          => __( 'Events', 'cortex-events' ),
      'singular_name' => __( 'Event', 'cortex-events' ),
      'add_new_item'  => __( 'Add New Event', 'cortex-events' ),
      'edit_item'     => __( 'Edit Event', 'cortex-events' ),
      'not_found'     => __( 'No events found.', 'cortex-events' ),
    ],
    'public'        => true,        // visible on the front end and in search
    'has_archive'   => true,        // enables /events/
    'menu_icon'     => 'dashicons-calendar-alt',
    'menu_position' => 20,
    'supports'      => [ 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields' ],
    'rewrite'       => [ 'slug' => 'events', 'with_front' => false ],
    'show_in_rest'  => true,        // block editor + the REST route named by rest_base
    'rest_base'     => 'events',
    'capability_type' => 'post',
  ] );
}
\`\`\`

Three arguments deserve attention:

- **\`show_in_rest\`** does double duty: it turns on the block editor for this type *and* exposes it at \`/wp-json/wp/v2/events\`. Leave it false and editors get the old classic editor with no explanation.
- **\`supports\`** is not cosmetic. Omit \`'thumbnail'\` and \`has_post_thumbnail()\` returns false forever, no matter what you upload. Omit \`'revisions'\` and there is no undo.
- **\`'public' => true\`** is shorthand that sets \`publicly_queryable\`, \`show_ui\`, \`show_in_nav_menus\`, and \`exclude_from_search\`. Set those individually when you need something private but editable.

### The 404 everyone hits first

You register the type, click into an event, and get a 404 — even though the post clearly exists. WordPress caches URL rewrite rules in the database and does not know about \`/events/my-talk/\` yet.

The fix is the activation-hook flush from Chapter 3. In development, visiting **Settings → Permalinks** and pressing Save does the same thing. What you must *not* do is call \`flush_rewrite_rules()\` on \`init\` to make the problem go away permanently — that rewrites a large option on every request for the life of the site.

### Templates for your type

The hierarchy from Chapter 1 applies directly:

| View | Template file |
|---|---|
| One event | \`single-event.php\` |
| The \`/events/\` archive | \`archive-event.php\` |
| Taxonomy term archive | \`taxonomy-event_type.php\` |

A plugin can ship fallback templates through the \`template_include\` filter, but nothing enforces theme precedence for you: the filter hands the plugin the last word. A well-behaved plugin calls \`locate_template()\` first and returns \`$template\` untouched when the theme already has a file.

### Sort an archive properly

Events are useless in "newest first" order. Fix it with \`pre_get_posts\`, not a second query:

\`\`\`php
add_action( 'pre_get_posts', function ( $query ) {
  if ( is_admin() || ! $query->is_main_query() ) {
    return;
  }
  if ( $query->is_post_type_archive( 'event' ) ) {
    $query->set( 'meta_key', 'event_start' );
    $query->set( 'orderby', 'meta_value' );      // use meta_value_num for numbers
    $query->set( 'order', 'ASC' );
    $query->set( 'posts_per_page', 12 );
  }
} );
\`\`\`

Store dates as \`YYYY-MM-DD\` strings or Unix timestamps. \`meta_value\` compares character by character, so a human format puts \`1 December\` ahead of \`2 January\`, and a seat count of \`100\` ahead of \`9\`. \`YYYY-MM-DD\` is the one date format whose text order matches its chronological order; for plain numbers switch to \`'orderby' => 'meta_value_num'\`. Getting this wrong is the classic sorting bug in WordPress projects.

### When not to create a post type

Ask what the thing *is*. A **post type** is a piece of content with its own page. A **taxonomy** is a way of grouping content. "Event" is a post type; "Workshop / Conference / Meetup" is a taxonomy. Creating a separate post type per category leaves you unable to list them together, and unable to add a fourth category without writing code.
        `,
        [
          q('An event post type is registered without thumbnail in its supports array. What does has_post_thumbnail() return for an event?', [
            'False always, and the featured image panel never appears',
            'True as soon as an image is attached to that event post',
            'False, but the panel is shown so editors can still upload',
            'True, because thumbnail support defaults on for public types',
          ], 0, 'The supports array decides which features the type actually has, so leaving thumbnail out removes both the editor panel and the API that reads it, no matter what is in the media library.'),
          q('Editors complain that the events screen still uses the classic editor while pages use blocks. Which registration argument was left out?', [
            '\'capability_type\' => \'post\' in the registration array',
            '\'show_in_rest\' => true in the registration array',
            '\'has_archive\' => true in the registration array',
            '\'publicly_queryable\' => true in that same array',
          ], 1, 'The block editor is a REST client, so a post type that is not exposed to the REST API falls back to the classic editor and is also missing from wp-json.'),
          q('Event dates are stored as strings like 3 April 2026 and an archive ordered by meta_value comes out shuffled. Why?', [
            'orderby applies only to the built in columns of the posts table',
            'Meta values stay unsorted unless the meta key has been indexed',
            'Text is compared character by character, so 12 January leads 3 April',
            'meta_value skips any value that contains a space in the string',
          ], 2, 'meta_value is a string comparison, so 1 sorts before 3 and the order has nothing to do with the calendar, which is why dates belong in YYYY-MM-DD form or as timestamps sorted with meta_value_num.'),
        ]
      ),
        lesson('Taxonomies and Post Meta', 13, `
A post type answers *what is this?* Taxonomies and meta answer *how is it grouped?* and *what are its details?* Choosing the wrong one is the most expensive modelling mistake in WordPress.

### Register a taxonomy

\`\`\`php
add_action( 'init', function () {
  register_taxonomy( 'event_type', [ 'event' ], [
    'labels'            => [
      'name'          => __( 'Event Types', 'cortex-events' ),
      'singular_name' => __( 'Event Type', 'cortex-events' ),
    ],
    'public'            => true,
    'hierarchical'      => true,     // true = behaves like categories, false = like tags
    'show_admin_column' => true,     // adds a column to the events list table
    'show_in_rest'      => true,
    'rewrite'           => [ 'slug' => 'event-type' ],
  ] );
}, 9 );   // priority 9: register before the post type at 10
\`\`\`

When you name the post type inside \`register_taxonomy()\` as above, the order within \`init\` does not actually matter — the pairing is stored on the taxonomy object and read back long after \`init\` has finished. It matters in the *other* direction: \`register_post_type( 'event', [ 'taxonomies' => [ 'event_type' ] ] )\` calls \`register_taxonomy_for_object_type()\`, which returns \`false\` and silently drops the pairing when the taxonomy does not exist yet. Registering taxonomies at priority 9 makes both spellings safe, which is why it is the habit worth having.

**\`hierarchical\`** is the decision that matters. Hierarchical terms have parents and a checkbox UI; flat terms are a free-text tag box. Users will happily create 400 duplicate tags in a flat taxonomy, so use hierarchical for anything you intend to build navigation from.

### Querying by term

\`\`\`php
$workshops = new WP_Query( [
  'post_type'      => 'event',
  'posts_per_page' => 10,
  'tax_query'      => [
    [
      'taxonomy' => 'event_type',
      'field'    => 'slug',
      'terms'    => [ 'workshop', 'masterclass' ],
    ],
  ],
] );
\`\`\`

Taxonomy terms live in their own indexed tables, so this query is fast even with a hundred thousand posts.

### Post meta is for details, not for grouping

\`\`\`php
add_post_meta( $post_id, 'event_start', '2026-04-18', true );   // 4th arg is $unique: refuse a 2nd value for this key
update_post_meta( $post_id, 'event_start', '2026-04-19' );
$start = get_post_meta( $post_id, 'event_start', true );        // true = return a scalar
delete_post_meta( $post_id, 'event_start' );
\`\`\`

That third \`true\` argument on \`get_post_meta\` catches everyone: omit it and you get an *array* of values back, so \`echo\` prints "Array" and your date formatting throws.

**A \`meta_query\` is not an indexed lookup.** The \`wp_postmeta\` table indexes \`meta_key\` but not \`meta_value\`, so filtering thousands of posts by a meta value means scanning. If users will filter or browse by an attribute, model it as a taxonomy. Reserve meta for values you read *after* you already have the post — a start date, a price, a seat count.

### Register meta so it is safe and visible

Bare \`update_post_meta\` calls are invisible to the REST API and the block editor. Register them instead:

\`\`\`php
add_action( 'init', function () {
  register_post_meta( 'event', 'event_start', [
    'type'              => 'string',
    'single'            => true,
    'show_in_rest'      => true,
    'sanitize_callback' => 'sanitize_text_field',
    'auth_callback'     => function () {
      return current_user_can( 'edit_posts' );
    },
  ] );
} );
\`\`\`

The \`auth_callback\` is the security gate for writes through the REST API. Setting \`show_in_rest => true\` without one exposes the field for editing more widely than you intend — and any meta key starting with an underscore is protected and needs an explicit callback to be writable at all.

### A meta box for editors

\`\`\`php
add_action( 'add_meta_boxes', function () {
  add_meta_box( 'cortex-event-details', __( 'Event Details', 'cortex-events' ),
    'cortex_events_meta_box', 'event', 'side' );
} );

function cortex_events_meta_box( $post ) {
  wp_nonce_field( 'cortex_save_event', 'cortex_event_nonce' );
  $start = get_post_meta( $post->ID, 'event_start', true );
  printf(
    '<label>Start date<input type="date" name="event_start" value="%s"></label>',
    esc_attr( $start )
  );
}

add_action( 'save_post_event', function ( $post_id ) {
  if ( ! isset( $_POST['cortex_event_nonce'] )
    || ! wp_verify_nonce( $_POST['cortex_event_nonce'], 'cortex_save_event' ) ) {
    return;                                    // CSRF check
  }
  if ( ! current_user_can( 'edit_post', $post_id ) ) {
    return;                                    // permission check — separate and required
  }
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
    return;
  }
  update_post_meta( $post_id, 'event_start', sanitize_text_field( $_POST['event_start'] ?? '' ) );
} );
\`\`\`

Those first three guards appear in every save handler you will ever write. Chapter 5 explains why the nonce check alone is not enough.
        `,
        [
          q('A taxonomy gives editors a free text box and the site now has 400 near duplicate terms. Which registration choice would have prevented it?', [
            '\'show_admin_column\' => true, listing terms in the admin table',
            '\'show_in_rest\' => true, so the block editor manages the terms',
            '\'public\' => false, which hides the term archives from visitors',
            '\'hierarchical\' => true, so terms come from a checkbox list',
          ], 3, 'Hierarchical taxonomies present existing terms as checkboxes, so editors pick from what is there instead of typing a new variant of a term that already exists.'),
          q('A meta key named _internal_score is registered with show_in_rest, but REST writes to it are rejected. Why?', [
            'Keys starting with an underscore are protected and need an auth_callback',
            'REST cannot expose meta values registered with an integer type',
            'The key must also be listed in the post type supports array',
            'Protected keys are writable from the block editor interface only',
          ], 0, 'WordPress treats any meta key beginning with an underscore as protected and defaults its auth callback to refuse, so an explicit auth_callback is the only way to allow writes.'),
          q('Why does filtering tens of thousands of posts with a meta_query get slow while a tax_query on the same data stays fast?', [
            'Meta values are serialised and have to be unserialised row by row',
            'wp_postmeta indexes the key but not the value, so the match scans',
            'Every meta_query adds one extra JOIN for each post it returns',
            'Meta queries are excluded from the object cache on every request',
          ], 1, 'Without an index on meta_value the database has to examine the matching key rows one by one, whereas taxonomy terms live in their own indexed relationship tables.'),
        ]
      ),
        lesson('The WP REST API', 15, `
Every modern WordPress install ships a JSON API at \`/wp-json/\`. The block editor is built on it, and it is how a React front end, a mobile app, or another service reads your content.

### What you get for free

\`\`\`
GET  /wp-json/wp/v2/posts?per_page=5&_embed
GET  /wp-json/wp/v2/posts/42
GET  /wp-json/wp/v2/events?event_type=12&orderby=date
POST /wp-json/wp/v2/posts          (authenticated)
\`\`\`

\`_embed\` is the parameter worth remembering: it inlines the author, featured image, and terms in one response instead of the three follow-up requests you would otherwise make.

Custom post types appear here only when registered with \`'show_in_rest' => true\` — the same flag from the last two lessons.

### Your own endpoint

\`\`\`php
add_action( 'rest_api_init', function () {
  register_rest_route( 'cortex/v1', '/events/upcoming', [
    'methods'             => WP_REST_Server::READABLE,   // 'GET'
    'callback'            => 'cortex_get_upcoming_events',
    'permission_callback' => '__return_true',            // deliberately public
    'args'                => [
      'limit' => [
        'default'           => 5,
        'sanitize_callback' => 'absint',
        'validate_callback' => function ( $value ) {
          return $value >= 1 && $value <= 50;
        },
      ],
    ],
  ] );
} );

function cortex_get_upcoming_events( WP_REST_Request $request ) {
  $query = new WP_Query( [
    'post_type'      => 'event',
    'posts_per_page' => $request['limit'],
    'meta_key'       => 'event_start',
    'orderby'        => 'meta_value',
    'order'          => 'ASC',
    'meta_query'     => [
      [ 'key' => 'event_start', 'value' => gmdate( 'Y-m-d' ), 'compare' => '>=', 'type' => 'DATE' ],
    ],
    'no_found_rows'  => true,
  ] );

  $data = array_map( function ( $post ) {
    return [
      'id'    => $post->ID,
      'title' => get_the_title( $post ),
      'url'   => get_permalink( $post ),
      'start' => get_post_meta( $post->ID, 'event_start', true ),
    ];
  }, $query->posts );

  return rest_ensure_response( $data );
}
\`\`\`

Namespace your routes as \`vendor/v1\`. Versioning from day one means you can ship \`cortex/v2\` later without breaking whatever is already consuming \`v1\`.

### permission_callback is not optional

**Omitting \`permission_callback\` is the most serious mistake in REST API code.** Since WordPress 5.5 it logs a \`_doing_it_wrong\` notice, and before that it silently made the route completely public. Every route needs one, even if the answer is "anyone":

\`\`\`php
'permission_callback' => '__return_true',                       // public read
'permission_callback' => fn() => current_user_can( 'edit_posts' ),  // editors only
'permission_callback' => fn( $req ) => current_user_can( 'edit_post', (int) $req['id'] ),
\`\`\`

Note the last one checks the capability *for that specific post*. A blanket \`edit_posts\` check would let any contributor edit anyone's content — authorisation must be about the object, not just the action.

### Returning errors properly

\`\`\`php
if ( ! $event ) {
  return new WP_Error(
    'cortex_not_found',
    __( 'Event not found.', 'cortex-events' ),
    [ 'status' => 404 ]
  );
}
\`\`\`

Returning a \`WP_Error\` produces correct JSON with the right HTTP status. Returning a plain array with \`'error' => true\` sends a 200 and every client treats the failure as success.

### Calling it from the browser

Reads are simple:

\`\`\`js
const res = await fetch('/wp-json/cortex/v1/events/upcoming?limit=3');
if (!res.ok) throw new Error('Request failed: ' + res.status);
const events = await res.json();
\`\`\`

Writes from a logged-in user need the cookie **plus** a nonce, because the cookie alone would let any site forge the request:

\`\`\`js
await fetch(cortexData.restUrl + 'events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': cortexData.nonce,   // from wp_create_nonce('wp_rest')
  },
  body: JSON.stringify({ title: 'New event' }),
});
\`\`\`

For server-to-server calls there are no cookies. Use an **application password** (Users → Profile) with HTTP Basic auth over HTTPS:

\`\`\`bash
curl -u "editor:abcd EFGH ijkl MNOP" https://example.com/wp-json/wp/v2/posts
\`\`\`

Application passwords are revocable per-integration, which is why they beat sharing a real account password.
        `,
        [
          q('A custom endpoint returns the array [\'error\' => true] when it finds nothing. What does the calling client actually receive?', [
            'A 404 that the REST server generates from the empty result',
            'A 500, because the array is not a WP_REST_Response object',
            'A 200 with a body that every client reads as a success',
            'An empty body, since plain arrays are not serialised to JSON',
          ], 2, 'The REST server serialises whatever it is handed and sends 200 unless you return a WP_Error carrying a status, so failures silently look like successful responses.'),
          q('A logged in user\'s POST to a custom route fails with rest_cookie_invalid_nonce. What is missing from the request?', [
            'An application password sent using HTTP Basic authentication',
            'A permission_callback on the route that returns __return_true',
            'The _embed parameter appended to the request URL',
            'The X-WP-Nonce header built from wp_create_nonce(\'wp_rest\')',
          ], 3, 'Cookie authentication is only accepted alongside a valid wp_rest nonce, because the cookie alone would let any other site forge the request from the user\'s browser.'),
          q('Why does a route check current_user_can(\'edit_post\', $id) rather than current_user_can(\'edit_posts\')?', [
            'Otherwise a contributor could edit content belonging to other people',
            'Because the plural capability is only evaluated on admin screens',
            'Because the singular form is required for the nonce to validate',
            'Because edit_posts is not a real capability in a default install',
          ], 0, 'The plural capability only says the user may edit posts in general, while the object form asks whether they may edit this particular post, which is the question that actually protects other people\'s content.'),
        ]
      ),
            lesson('Shaping REST Responses for Clients', 14, `
A React front end asks for \`/wp-json/wp/v2/events?per_page=10&_embed\` to draw ten cards. The response is 340KB. Each card shows a title, a date and an image, so the client throws away roughly 96 percent of what it just downloaded on a phone connection. Core gives you three tools to fix that without writing a single new route.

### _fields, the cheapest win available

\`\`\`
GET /wp-json/wp/v2/events?per_page=10&_fields=id,link,title,event_start
\`\`\`

The same ten events now weigh about 6KB. \`_fields\` works on every core route and accepts nested paths, so \`_fields=id,title,_embedded\` keeps the embedded author and image while dropping \`content\`, \`guid\`, \`ping_status\` and the rest of the envelope. Reach for it before you reach for a custom endpoint, because a custom endpoint is a thing you now have to version, secure and maintain.

### register_rest_field for data that is computed

\`register_post_meta\` with \`show_in_rest\` is right for values you actually store. \`register_rest_field\` is for values you derive:

\`\`\`php
add_action( 'rest_api_init', function () {
  register_rest_field( 'event', 'seats_left', [
    'get_callback' => function ( array $post ) {
      $total = (int) get_post_meta( $post['id'], 'seats_total', true );
      return max( 0, $total - count( get_post_meta( $post['id'], 'rsvp' ) ) );
    },
    'update_callback' => null,
    'schema' => [
      'description' => 'Seats still available',
      'type'        => 'integer',
      'context'     => [ 'view', 'edit' ],
    ],
  ] );
} );
\`\`\`

Three things bite people here. The callback receives the prepared post as an **array**, not a \`WP_Post\`, so \`$post['id']\` is right and \`$post->ID\` is a fatal error. With \`update_callback\` left null the field is read only and a client that POSTs it gets no error at all, just silence. And the schema is not paperwork: without it the field never appears in the OPTIONS discovery document, so generated clients and \`_fields\` tooling cannot see that it exists.

The same hook is how you flatten an awkward shape:

\`\`\`php
'get_callback' => fn( $post ) => wp_get_attachment_image_url(
  get_post_thumbnail_id( $post['id'] ), 'large'
),
\`\`\`

One line, and every card stops making a second request for its own image.

### rest_prepare_{type} edits the finished response

\`\`\`php
add_filter( 'rest_prepare_event', function ( $response, $post, $request ) {
  $data = $response->get_data();
  unset( $data['guid'], $data['ping_status'] );
  $start = get_post_meta( $post->ID, 'event_start', true );
  $data['start_human'] = $start ? date_i18n( 'j M Y', strtotime( $start ) ) : '';
  $response->set_data( $data );
  return $response;                 // a filter always returns
}, 10, 3 );
\`\`\`

Remember what this filter is: it runs once per item. A collection of 100 events runs it 100 times, so anything expensive inside it is multiplied by the page size before you notice.

### Let core's collection take your parameter

The temptation is a new route for every listing. Extend the existing one instead:

\`\`\`php
add_filter( 'rest_event_collection_params', function ( $params ) {
  $params['upcoming'] = [
    'description' => 'Only events starting today or later',
    'type'        => 'boolean',
  ];
  return $params;
} );

add_filter( 'rest_event_query', function ( array $args, WP_REST_Request $request ) {
  if ( $request->get_param( 'upcoming' ) ) {
    $args['meta_key']   = 'event_start';
    $args['orderby']    = 'meta_value';
    $args['order']      = 'ASC';
    $args['meta_query'] = [ [
      'key' => 'event_start', 'value' => gmdate( 'Y-m-d' ),
      'compare' => '>=', 'type' => 'DATE',
    ] ];
  }
  return $args;
}, 10, 2 );
\`\`\`

\`/wp-json/wp/v2/events?upcoming=1&per_page=5\` now works, and it inherits everything core already built:

| You get for free | Because |
|---|---|
| \`X-WP-Total\` and \`X-WP-TotalPages\` headers | core counts the collection for you |
| \`page\`, \`search\`, \`order\`, \`_fields\`, \`_embed\` | they are registered on the same route |
| Permission and status filtering | the controller applies it before your filter |

Registering the parameter in \`rest_event_collection_params\` is what documents and validates it. Skip that step and the query filter still fires, but nothing type checks the value and no client can discover the option exists.
      `,
        [
          q('A front end lists 20 events and needs only the id, link and title of each. Which change cuts the payload the most?', [
            'Add _embed so the related data arrives in a single request',
            'Add _fields=id,link,title so core trims the response itself',
            'Raise per_page so the same data arrives in fewer requests',
            'Request the collection with gzip compression enabled',
          ], 1, '_fields tells the REST controller to build a smaller response, so the content, excerpt, guid and the rest of the envelope are never serialised or sent at all.'),
          q('A field added with register_rest_field defines a get_callback but no update_callback. What happens when a client sends a value for it?', [
            'The request is rejected with a 400 invalid parameter error',
            'The value is written to post meta under the same field name',
            'The value is ignored, since nothing is registered to store it',
            'The value is saved onto the post object as a custom column',
          ], 2, 'Writes are handled only by the update_callback, so a field without one is read only and discards incoming values without reporting anything to the client.'),
          q('You want /wp/v2/events to accept upcoming=1 and return only future events. What is the right approach?', [
            'Register a second route under the wp/v2/events namespace',
            'Pass the parameter to register_post_type as a public query var',
            'Add it to the args array of the register_rest_field call',
            'Filter rest_event_query and set the meta_query from the request',
          ], 3, 'The rest_{type}_query filter changes the WP_Query arguments the existing controller runs, so the parameter inherits core\'s pagination headers, permission checks and field selection instead of needing a new route.'),
        ]
      ),
      ],
      [
        q('A newly registered custom post type returns 404 on single entries. What fixes it?', [
          'Setting show_in_rest to true',
          'Flushing rewrite rules once, via the activation hook or by re-saving permalinks',
          'Adding has_archive to the arguments',
          'Registering the type on wp_loaded instead of init',
        ], 1, 'Rewrite rules are cached in the database and must be regenerated once after new URL structures are registered.'),
        q('Users will browse events by their type. How should the type be modelled?', [
          'Post meta queried with meta_query',
          'A separate post type per event type',
          'A registered taxonomy',
          'A category on the built-in post type',
        ], 2, 'Taxonomy terms are stored in indexed relationship tables, so grouping and filtering stay fast; meta_value is not indexed.'),
        q('get_post_meta($id, "event_start") prints "Array". What was omitted?', [
          'The sanitize_callback',
          'The third argument, true, which returns a single value',
          'show_in_rest on the meta registration',
          'A call to update_post_meta first',
        ], 1, 'Without the $single flag, get_post_meta returns an array of all values for that key.'),
        q('Why must every register_rest_route call include a permission_callback?', [
          'It sets the response content type',
          'Without it the route is effectively public and WordPress flags it as incorrect usage',
          'It is needed for the args array to validate',
          'It caches the response',
        ], 1, 'permission_callback is the only authorisation gate on a REST route; leaving it out exposes the endpoint to everyone.'),
      ]
    ),
    chapter(
      'Performance and Security',
      'Caching layers, image discipline, and the escaping, nonce, and capability rules that keep a site standing.',
      [
        lesson('Caching and Query Performance', 14, `
A slow WordPress site is almost never slow because "WordPress is slow". It is slow because of uncached database queries, an oversized plugin list, and images nobody resized. Measure before you optimise.

### Install Query Monitor first

Query Monitor adds a toolbar showing, for the current page: total queries, the slowest ones with their calling function, PHP memory used, hooks fired, and HTTP requests made during the render. A page doing 400 queries has a specific fixable cause, and this tells you which plugin it is.

Rules of thumb: under 50 queries and under 200ms of database time on a content page is healthy. Over 200 queries means something is looping.

### The caching layers

| Layer | What it stores | Typical tool |
|---|---|---|
| **Page cache** | The whole rendered HTML | Nginx FastCGI cache, WP Super Cache, host-level |
| **Object cache** | Query and API results between requests | Redis or Memcached + a drop-in |
| **Transients** | Your own expiring values | Core Transients API |
| **Opcode cache** | Compiled PHP | OPcache (server config) |
| **Browser / CDN** | Static assets | Cache-Control headers, Cloudflare |

Page caching gives the biggest win and is also the bluntest: it does nothing for logged-in users or anything personalised. Object caching is what speeds up the admin and a WooCommerce cart.

Without a persistent object cache installed, WordPress still caches within a single request only — so \`get_option\` called twenty times in one page load hits the database once. That per-request cache is why premature "optimisation" of repeated core calls is usually wasted effort.

### Transients: cache your own expensive work

\`\`\`php
function cortex_upcoming_events() {
  $events = get_transient( 'cortex_upcoming_events' );

  if ( false === $events ) {                  // false means miss, not empty
    $events = ( new WP_Query( [
      'post_type'      => 'event',
      'posts_per_page' => 5,
      'fields'         => 'ids',              // fetch IDs only when that is all you need
      'no_found_rows'  => true,
    ] ) )->posts;

    set_transient( 'cortex_upcoming_events', $events, HOUR_IN_SECONDS );
  }

  return $events;
}
\`\`\`

Two things people get wrong. First, **check against \`false\`, not \`empty()\`** — an expensive query that legitimately returns an empty array will otherwise re-run on every single request, which is the exact opposite of caching. Second, invalidate deliberately:

\`\`\`php
add_action( 'save_post_event', function () {
  delete_transient( 'cortex_upcoming_events' );
} );
\`\`\`

An expiry is a safety net, not an invalidation strategy. If editors publish an event and the site shows the old list for an hour, they will assume the site is broken.

### Query arguments that actually matter

\`\`\`php
$q = new WP_Query( [
  'post_type'              => 'event',
  'posts_per_page'         => 12,     // never -1
  'no_found_rows'          => true,   // skip the pagination COUNT when unpaginated
  'update_post_meta_cache' => false,  // skip meta priming when you will not read meta
  'update_post_term_cache' => false,  // skip term priming when you will not read terms
  'fields'                 => 'ids',
] );
\`\`\`

And two arguments to avoid: \`'orderby' => 'rand'\` cannot be cached and forces a full sort on every request; \`'s' => $term\` combined with \`meta_query\` on a large site generates a query no index can help.

### The N+1 problem

\`\`\`php
// Bad: one extra query per row, 50 rows, 50 queries.
foreach ( $events as $event ) {
  $venue = get_posts( [ 'p' => get_post_meta( $event->ID, 'venue_id', true ) ] );
}

// Better: one query for all of them.
$venue_ids = array_filter( array_map( fn( $e ) => (int) get_post_meta( $e->ID, 'venue_id', true ), $events ) );
$venues    = $venue_ids ? get_posts( [ 'post__in' => $venue_ids, 'posts_per_page' => count( $venue_ids ), 'post_type' => 'venue' ] ) : [];
\`\`\`

Any \`get_posts\`, \`wp_remote_get\`, or \`get_option\` inside a loop deserves suspicion. WordPress already primes post meta and terms for the main Loop in one query each, which is why \`get_post_meta()\` inside a normal Loop is cheap but \`get_posts()\` is not.

### Autoloaded options

\`\`\`sql
SELECT option_name, LENGTH(option_value) AS size
FROM wp_options WHERE autoload = 'yes'
ORDER BY size DESC LIMIT 20;
\`\`\`

Every autoloaded option is loaded into memory on every request, including admin-ajax and REST calls. Old plugins leave megabytes behind. Anything over about 800KB total is worth cleaning up.
        `,
        [
          q('Anonymous visitors get sub-second page loads but the admin dashboard and the logged-in cart are still slow. What explains that split?', [
            'The opcode cache only compiles front-end templates and skips wp-admin',
            'Transients are bypassed for any user who is logged in to the site',
            'Page caching is skipped for logged-in requests, so only an object cache helps there',
            'Browser caching handles the front end and cannot be applied to admin screens',
          ], 2, 'A full page cache can only serve identical HTML to everyone, so it is bypassed once a request is personalised, and speeding those requests up needs query results cached in Redis or Memcached instead.'),
          q('You add no_found_rows set to true to a WP_Query that feeds a paginated archive. What breaks?', [
            'Pagination, because the count that tells WordPress how many pages exist is skipped',
            'Post meta, because the priming query for meta values is skipped along with it',
            'Ordering, because the query can no longer sort by date without the row count',
            'Nothing, since WordPress recalculates the total from posts_per_page anyway',
          ], 0, 'no_found_rows tells WordPress not to run the found rows count, so max_num_pages is wrong and the pagination links vanish, which is why the argument is only safe on queries you never paginate.'),
          q('Why is get_post_meta inside the main Loop cheap while get_posts inside the same Loop is not?', [
            'get_posts is blocked by the object cache while meta reads are always served from it',
            'Meta values live in the posts table, so reading them adds no extra join at all',
            'get_posts always bypasses caching, whereas meta reads are cached for a full hour',
            'WordPress primes all the meta for the Loop in one query, but each get_posts is fresh',
          ], 3, 'The main query pre-loads post meta and terms for every post it returned in a single query each, so per-post meta reads hit that cache while a get_posts call inside the loop issues a brand new database query on every iteration.'),
        ]
      ),
        lesson('Images and Front-End Delivery', 12, `
On a typical content site, images are 60–70% of page weight. Fixing them is usually a bigger win than every PHP optimisation combined.

### WordPress already generates sizes

On upload, WordPress creates \`thumbnail\`, \`medium\`, \`medium_large\`, and \`large\` derivatives. Register your own for the dimensions your design actually uses:

\`\`\`php
add_action( 'after_setup_theme', function () {
  add_image_size( 'card', 640, 420, true );    // true = hard crop to exactly 640x420
  add_image_size( 'hero', 1600, 900, true );
} );

// Make custom sizes selectable in the editor's dropdown
add_filter( 'image_size_names_choose', function ( $sizes ) {
  return array_merge( $sizes, [ 'card' => __( 'Card', 'cortex' ) ] );
} );
\`\`\`

**\`add_image_size()\` only affects images uploaded after you add it.** This is the classic image bug: the designer adds a size, the homepage still looks wrong, and everyone assumes the code is broken. Existing uploads need regenerating — \`wp media regenerate\` under WP-CLI, or the Regenerate Thumbnails plugin.

### Let WordPress write the markup

\`\`\`php
// Good — emits srcset, sizes, width, height, loading, and alt from the media library
the_post_thumbnail( 'card', [ 'class' => 'card__img' ] );
echo wp_get_attachment_image( $id, 'hero', false, [ 'class' => 'hero__img' ] );

// Bad — one fixed source, no srcset, no dimensions, layout shift on load
echo '<img src="' . esc_url( wp_get_attachment_url( $id ) ) . '">';
\`\`\`

That second form serves a 3000px original into a 640px slot on a phone. The first serves the right derivative and lets the browser choose, and the \`width\`/\`height\` attributes reserve space so the page does not jump — which is most of your Cumulative Layout Shift score.

### Lazy loading, and the one image you must not lazy-load

WordPress adds \`loading="lazy"\` automatically. That is right for everything below the fold and **wrong for the hero image**, because the browser deprioritises the very image that determines your Largest Contentful Paint:

\`\`\`php
the_post_thumbnail( 'hero', [
  'loading'       => 'eager',
  'fetchpriority' => 'high',
] );
\`\`\`

Core skips lazy loading on the first image or two in content, but it cannot know your theme's layout — set it explicitly on anything above the fold.

### Compression and format

\`\`\`php
// Default is 82; 75-80 is visually indistinguishable on photos and noticeably smaller
add_filter( 'jpeg_quality', fn() => 78 );
add_filter( 'wp_editor_set_quality', fn() => 78 );
\`\`\`

WebP is 25–35% smaller than JPEG at equal quality and supported everywhere that matters. Modern WordPress can generate WebP derivatives, and plugins such as Imagify or ShortPixel will convert an existing library. Reserve PNG for screenshots and transparency; SVG for logos and icons — and only allow SVG uploads if you sanitise them, since an SVG is an XML document that can carry script.

### The rest of the front end

- **Audit plugins by page weight, not by count.** One slider plugin loading jQuery UI, three fonts, and 400KB of CSS on every page is worse than ten small ones.
- **Enqueue conditionally** (Chapter 2). Most sites load their contact-form assets on all 200 pages.
- **Self-host fonts**, subset them, and preload the one used above the fold. Third-party font CDNs add a DNS lookup and a connection before any text can paint.
- **Serve over HTTP/2 or HTTP/3** and stop concatenating files to work around HTTP/1 limits.
- **Measure with real tooling** — Lighthouse in incognito, or WebPageTest on a throttled connection. Testing on your own machine over office fibre tells you nothing about the phone your visitors actually use.
        `,
        [
          q('Your hero image is the Largest Contentful Paint element and the score got worse after you switched to the_post_thumbnail. What is the likely cause?', [
            'The hard crop resized it below the width the layout needs on desktop',
            'WordPress added loading set to lazy, so the browser deprioritised the hero',
            'srcset offered too many candidates and the browser downloaded several of them',
            'The width and height attributes forced a second layout pass before painting',
          ], 1, 'Core adds lazy loading by default and cannot know your layout, so the one image that decides LCP gets deferred unless you set loading to eager and fetchpriority to high yourself.'),
          q('What does hand-writing an img tag with wp_get_attachment_url cost you compared with wp_get_attachment_image?', [
            'The alt text only, which you can add back as an attribute yourself',
            'The ability to use a custom size registered with add_image_size',
            'Nothing on modern browsers, which infer dimensions from the file',
            'srcset, width and height, so phones fetch the full original and the page shifts',
          ], 3, 'Core builds responsive markup from the registered sizes and the stored dimensions, so writing the tag by hand serves one oversized file and drops the attributes that reserve space before the image loads.'),
          q('A client wants to upload SVG logos. Why does WordPress block that mime type by default?', [
            'An SVG is an XML document that can carry script, so it needs sanitising first',
            'SVG files cannot be resized into the derivative sizes the media library expects',
            'Browsers refuse to render SVG served from an uploads directory over HTTPS',
            'SVG has no width or height metadata, which would break every srcset attribute',
          ], 0, 'An uploaded SVG can contain script elements and event handlers that run in the visitor\'s browser, so allowing the type without a sanitiser hands anyone with upload rights a stored cross-site scripting hole.'),
        ]
      ),
        lesson('Security Hardening', 15, `
The overwhelming majority of compromised WordPress sites were not hit by a clever zero-day. They were running a plugin with a known vulnerability patched months earlier.

### Update, because it is the whole game

- Leave automatic minor core updates on, and update plugins and themes weekly from a staging copy.
- **Delete deactivated plugins and unused themes.** Their PHP files are still on disk and still reachable by URL; several serious breaches came through inactive plugins.
- Remove anything abandoned by its author. "Last updated 3 years ago" is a red flag.

### Sanitise input, escape output

These are two different jobs at two different times, and doing one does not cover the other.

| Direction | Situation | Function |
|---|---|---|
| In | Plain text, email, slug, integer | \`sanitize_text_field()\`, \`sanitize_email()\`, \`sanitize_key()\`, \`absint()\` |
| Out | Text into HTML | \`esc_html()\` |
| Out | Value into an attribute | \`esc_attr()\` |
| Out | Any URL | \`esc_url()\` |
| Out | Value into inline JS | \`wp_json_encode()\` |
| Out | Rich content with allowed tags | \`wp_kses_post()\` |

\`\`\`php
// Vulnerable: a saved title of <script>… executes for every visitor
echo '<h2>' . get_the_title() . '</h2>';

// Safe — each value escaped for the context it lands in
printf( '<a href="%s" title="%s">%s</a>',
  esc_url( get_permalink() ),
  esc_attr( get_the_title() ),
  esc_html( get_the_title() )
);
\`\`\`

**Escape late — at output, not at save.** Escaping on save leaves you unable to tell whether a stored value is already escaped, and you end up with \`&amp;amp;\` in titles. Sanitise going in, escape coming out, with no exceptions for "data I control".

### Nonces stop CSRF — and nothing else

A nonce proves *this request came from a form we rendered for this user*, defeating cross-site request forgery:

\`\`\`php
// In the form
wp_nonce_field( 'cortex_delete_event_' . $post_id, 'cortex_nonce' );

// In the handler
if ( ! isset( $_POST['cortex_nonce'] )
  || ! wp_verify_nonce( $_POST['cortex_nonce'], 'cortex_delete_event_' . $post_id ) ) {
  wp_die( esc_html__( 'Security check failed.', 'cortex-events' ) );
}

if ( ! current_user_can( 'delete_post', $post_id ) ) {
  wp_die( esc_html__( 'You are not allowed to do that.', 'cortex-events' ) );
}
\`\`\`

**Checking the nonce and stopping there is the most common security hole in custom WordPress code.** A nonce is valid for *any logged-in user who loaded the page* — including a subscriber. It answers "did this request come from our form?", never "is this person allowed?". You need both checks, always, and the capability check should name the specific object (\`delete_post, $post_id\`) rather than a blanket action.

### Least privilege

WordPress ships five roles. Editors do not need Administrator, and **nobody should be Administrator by default**:

Subscribers read, contributors draft, authors publish their own work, editors manage all content, administrators control everything. Grant the smallest role that does the job — then check capabilities, never roles:

\`\`\`php
if ( current_user_can( 'edit_others_posts' ) ) { /* … */ }   // right
if ( 'editor' === wp_get_current_user()->roles[0] ) { /* … */ }  // fragile and wrong
\`\`\`

Turn off dashboard file editing so a stolen admin session cannot inject PHP:

\`\`\`php
define( 'DISALLOW_FILE_EDIT', true );
\`\`\`

### Database queries

The \`$wpdb\` object is the only place you write SQL, and it always gets prepared statements:

\`\`\`php
global $wpdb;

// Catastrophic — SQL injection
$wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_title = '$title'" );

// Correct
$wpdb->get_results( $wpdb->prepare(
  "SELECT ID, post_title FROM {$wpdb->posts} WHERE post_title = %s AND post_status = %s",
  $title,
  'publish'
) );
\`\`\`

Use \`%s\`, \`%d\`, \`%f\`. Table names cannot be parameterised, which is why they come from \`$wpdb\` properties, never from user input.

### The rest of the checklist

- HTTPS everywhere, with \`FORCE_SSL_ADMIN\` set, and fresh salts from the official generator. Rotating salts logs everyone out — exactly what you want after an incident.
- Two-factor authentication on admin accounts; rate-limit \`wp-login.php\`.
- Block PHP execution in \`wp-content/uploads/\` at the server level. An executable uploaded \`.php\` file is game over.
- Automated off-site backups, restored at least once so you know they work.
- \`wp core verify-checksums\` compares your core files against the official release — the fastest first check when something feels wrong.
        `,
        [
          q('Why is current_user_can with edit_others_posts better than comparing the current user\'s first role to editor?', [
            'Role comparison is slower because it loads the whole user object from the database',
            'Capabilities are the real permission unit, and a user can hold several or a custom role',
            'current_user_can also verifies the nonce attached to the current request for you',
            'Roles are stored per site, so the comparison always fails on a single site install',
          ], 1, 'Plugins add, rename and combine roles freely and the roles array has no meaningful order, so checking for the specific capability is the only comparison that keeps working as a site grows.'),
          q('A plugin with a known vulnerability is deactivated but left installed. Why is that still a risk?', [
            'WordPress silently reactivates deactivated plugins during a core auto-update',
            'Its options rows stay autoloaded, so its code still executes on every request',
            'Its PHP files are still on disk and can be requested directly by URL',
            'The update checker keeps pulling the vulnerable version back from the directory',
          ], 2, 'Deactivation only stops WordPress including the plugin, it removes nothing from the server, so a vulnerable file that can be hit directly over HTTP stays an entry point until you delete the plugin.'),
          q('You need to query a table whose name comes from a variable. Why can it not be a prepare placeholder?', [
            'prepare only accepts placeholders in the WHERE clause of a SELECT statement',
            'The %s placeholder uppercases its input, which breaks lowercase table names',
            'prepare escapes only integers, so any string identifier must be cast first',
            'Placeholders are quoted as values, and a quoted identifier is not a valid table name',
          ], 3, 'prepare wraps every %s in quotes because it is building a value rather than an identifier, so a table name must come from a trusted source such as a $wpdb property and never from user input.'),
        ]
      ),
            lesson('Security Headers and the HTTP Layer', 13, `
One unescaped review field on a client site let a visitor store a script tag in a testimonial. The escaping rules from the last topic are what stop that being printed. Security headers decide how much damage it does when one slips through anyway: with a content security policy in place, the browser refuses to run the injected script at all.

### Where headers belong

Send them from the web server when you control it, because then they cover static files, uploads, and PHP errors alike. When you do not, WordPress fires \`send_headers\` before any output:

\`\`\`php
add_action( 'send_headers', function () {
  if ( is_admin() ) {
    return;                     // wp-admin needs looser rules, see below
  }
  header( 'X-Content-Type-Options: nosniff' );
  header( 'Referrer-Policy: strict-origin-when-cross-origin' );
  header( 'Permissions-Policy: geolocation=(), camera=(), microphone=()' );
  header( 'Strict-Transport-Security: max-age=300' );
} );
\`\`\`

Calling \`header()\` from a template file is the mistake people make instead. By then the theme has printed HTML, so PHP reports \`Cannot modify header information, headers already sent by\` and names the exact file and line that beat you to it. Read that line rather than the first one: it points at where output started, which is very often a stray blank line after a closing \`?>\`.

### What each header buys you

| Header | Stops |
|---|---|
| \`Content-Security-Policy\` | Injected and third party scripts executing |
| \`Strict-Transport-Security\` | The first plain HTTP request a network attacker can hijack |
| \`X-Content-Type-Options\` | An uploaded text file being guessed as JavaScript |
| \`Referrer-Policy\` | Full URLs carrying tokens leaking to other sites |
| \`Permissions-Policy\` | An embedded iframe asking for the camera |

\`X-Frame-Options\` is worth knowing about and worth skipping. The \`frame-ancestors\` directive inside your policy does the same job with more control, and every browser that matters honours it.

### HSTS remembers, so start small

\`max-age=31536000\` tells every browser that has visited to refuse plain HTTP to your domain for a year, and there is no way to reach those browsers and take it back. If the certificate then lapses, visitors get a warning page they cannot click through. Ship \`max-age=300\`, watch for a week, raise it to a month, then to a year. Add \`preload\` only once the site will never serve anything over HTTP again, because removal from the preload list takes months.

### CSP without breaking the editor

A strict \`script-src 'self'\` blanks out wp-admin immediately. The block editor emits inline script blocks in the page, so the toolbar never boots and the console fills with refusal messages. That is why the snippet above returns early for admin requests, and why an admin policy, if you write one at all, is a separate and looser one.

Roll a policy out in report-only mode first, so the browser reports violations and blocks nothing:

\`\`\`text
Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' data: https:;
  style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self';
  report-uri /csp-report
\`\`\`

Collect a week of reports, add the hosts your analytics and payment provider genuinely need, then drop the \`-Report-Only\` suffix. Going straight to enforcement on a site with fifteen plugins breaks something on a page nobody tests.

### Check what you actually shipped

\`\`\`bash
curl -sI https://example.com | grep -i 'content-security\\|strict-transport\\|x-content'
\`\`\`

Run that against production, and run it logged out. A full page cache stores response headers alongside the HTML, so a header change can look correct in your editor, look correct on your own logged-in request, and be completely absent for anonymous visitors until the cache is purged. That last version is the one everybody else gets.
      `,
        [
          q('Calling header() from inside a template file produces a headers already sent warning. Why?', [
            'Templates run before send_headers, so the header list has not been created yet',
            'WordPress strips any header that a theme file rather than a plugin sets',
            'The theme has already printed HTML, and the body cannot precede its own headers',
            'The header function is only available while the WP_Query object is still building',
          ], 2, 'Headers must be flushed before the first byte of the body, so once a template has echoed anything PHP can no longer change them, and the warning names the file and line where output began.'),
          q('Why ship Strict-Transport-Security with max-age set to 300 before raising it to a year?', [
            'Browsers remember the promise, so a long max-age cannot be withdrawn if TLS breaks',
            'A long max-age is ignored by browsers until the domain joins the preload list',
            'Short values let the CDN cache the header, which a year long value prevents',
            'The header is only honoured on the second visit, so a small value warms it up',
          ], 0, 'There is no way to reach browsers that already cached the policy, so a certificate lapse under a one year max-age locks visitors out with no way to click through, which is why the value is raised in stages.'),
          q('A strict script-src of self blanks out wp-admin while the front end is fine. What is going on?', [
            'The admin loads its scripts from a separate origin that self does not include',
            'The block editor emits inline scripts, which self does not permit to execute',
            'wp-admin sends its own policy, and two policies on one response cancel out',
            'Admin requests skip send_headers, so the policy arrives after the scripts do',
          ], 1, 'A source list of self allows only scripts fetched from your own origin as separate files, so the inline script blocks the editor prints are refused and the admin interface never finishes starting up.'),
        ]
      ),
      ],
      [
        q('A transient caching an expensive query re-runs on every request even though it is set. Likely cause?', [
          'The expiry is too long',
          'The code checks empty() instead of === false, so a legitimately empty result reads as a miss',
          'Transients require a persistent object cache',
          'set_transient was called before get_transient',
        ], 1, 'get_transient returns false only on a miss; an empty array is a valid cached value that empty() misreads.'),
        q('A newly registered image size is not applied to the homepage cards. What is needed?', [
          'Add it to image_size_names_choose',
          'Regenerate thumbnails for images uploaded before the size was registered',
          'Set hard crop to false',
          'Flush rewrite rules',
        ], 1, 'add_image_size only affects future uploads; existing attachments have no file at the new dimensions until regenerated.'),
        q('Which pair correctly describes sanitising and escaping?', [
          'Sanitise on output, escape on input',
          'Sanitise input before storing, escape output at the moment of printing',
          'Escaping replaces the need to sanitise',
          'Both should happen once, at save time',
        ], 1, 'They are separate jobs: clean data going in, make it safe for its output context coming out.'),
        q('A handler verifies the nonce and then deletes the post. What is still wrong?', [
          'Nothing — the nonce is sufficient',
          'It must also check current_user_can for that specific post',
          'The nonce should be verified after the delete',
          'It needs a second nonce for the redirect',
        ], 1, 'A nonce proves the request came from your form, not that the user has permission; authorisation is a separate check.'),
      ]
    ),
    chapter(
      'Blocks, Patterns, and theme.json',
      'Global styles, a custom block of your own, and the patterns and locked templates that make the editor safe to hand over.',
      [
        lesson('theme.json and Global Styles', 13, `
Chapters 1 and 2 built a classic theme where every style decision lived in your CSS. The block editor has its own opinion about colours, spacing, and layout, and **\`theme.json\`** is where you tell it what it is allowed to offer.

### One file, two halves

\`theme.json\` sits at the root of the theme beside \`style.css\`. \`settings\` decides what appears in the editor UI; \`styles\` sets the defaults applied to the site.

\`\`\`json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "appearanceTools": true,
    "layout": { "contentSize": "45rem", "wideSize": "72rem" },
    "color": {
      "custom": false,
      "defaultPalette": false,
      "palette": [
        { "slug": "ink",   "color": "#111827", "name": "Ink" },
        { "slug": "brand", "color": "#4f46e5", "name": "Brand" },
        { "slug": "paper", "color": "#f8fafc", "name": "Paper" }
      ]
    },
    "typography": {
      "fluid": true,
      "customFontSize": false,
      "fontSizes": [
        { "slug": "small", "size": "0.875rem", "name": "Small" },
        { "slug": "large", "size": "clamp(1.5rem, 3vw, 2.25rem)", "name": "Large" }
      ]
    },
    "blocks": {
      "core/button": { "color": { "custom": true } }
    }
  },
  "styles": {
    "color": { "background": "var(--wp--preset--color--paper)", "text": "var(--wp--preset--color--ink)" },
    "elements": { "link": { "color": { "text": "var(--wp--preset--color--brand)" } } },
    "blocks": { "core/quote": { "typography": { "fontStyle": "italic" } } }
  }
}
\`\`\`

### Presets become CSS you can use

Every preset you declare generates a custom property and a utility class on both sides of the editor:

| Declaration | What WordPress generates |
|---|---|
| \`color.palette\` slug \`brand\` | \`--wp--preset--color--brand\`, \`.has-brand-color\`, \`.has-brand-background-color\` |
| \`typography.fontSizes\` slug \`large\` | \`--wp--preset--font-size--large\`, \`.has-large-font-size\` |
| \`spacing.spacingSizes\` step 40 | \`--wp--preset--spacing--40\` |

Write your own stylesheet against those variables instead of hex codes. Then when a client changes the palette in the Site Editor, your components follow along instead of drifting out of sync.

### "custom": false is the whole point

\`"custom": false\` removes the free-form colour picker, and \`"defaultPalette": false\` removes WordPress's own colours. Together they mean an editor can pick your three brand colours and nothing else. A design system nobody can bypass is worth more than a style guide nobody reads.

### The cascade

Values resolve in exactly one order — **core defaults → your \`theme.json\` → the user's global styles → per-block user styles** — and the last one to speak wins. That is why a client's Site Editor tweak beats your file, and why the fix is to remove the control in \`settings\`, not to reach for \`!important\`.

The same rule retires the older API. Once \`theme.json\` exists, \`add_theme_support( 'editor-color-palette' )\` and its siblings are ignored entirely. Adding \`theme.json\` to an established theme and watching its palette silently stop responding is a genuinely confusing afternoon.

### Classic themes get this too

\`theme.json\` is not only for block themes. Drop it into the Chapter 2 theme and you immediately get the palette, the layout widths that make wide and full alignment work, and the preset variables. What it does **not** do is put your front-end CSS inside the editor canvas:

\`\`\`php
add_action( 'after_setup_theme', function () {
  add_theme_support( 'editor-styles' );
  add_editor_style( 'assets/css/editor.css' );  // path relative to the theme folder
  add_theme_support( 'wp-block-styles' );       // core's default block styling, front end
  add_theme_support( 'align-wide' );
} );
\`\`\`

**Skipping \`add_editor_style()\` is the classic block-editor complaint.** Someone composes a page that looks right while editing and wrong once published, and the editor gets blamed for a stylesheet the canvas never received. Keep the shared rules in one file that both sides load, and watch your selectors: the editor wraps content in \`.editor-styles-wrapper\`, so a rule written as \`body > .entry-content h2\` will only ever match on the front end.

To see what you actually shipped, load any page and find the \`<style id="global-styles-inline-css">\` element in the source. That is the resolved output of core, your file, and the user's choices merged together — the fastest way to prove which layer won.
        `,
        [
          q('You add theme.json to a classic theme and the palette it registered with add_theme_support stops appearing. Why?', [
            'Once theme.json exists it supersedes the older add_theme_support palette calls',
            'add_theme_support must now run on init rather than on after_setup_theme',
            'The palette moved into the styles section, and settings no longer holds colours',
            'Classic themes cannot use theme.json, so both sources are dropped from the editor',
          ], 0, 'theme.json is the newer configuration layer and core ignores the editor-color-palette family of theme supports as soon as the file is present, which is why an established theme\'s palette silently disappears.'),
          q('You declare a palette entry with the slug brand. What can you then reference from your own stylesheet?', [
            'A Sass variable named brand compiled into the theme\'s build output',
            'A custom property called --wp--preset--color--brand plus a has-brand-color class',
            'A shortcode that prints the hex value wherever the palette is referenced',
            'A PHP constant defined for you at the moment the theme.json file is parsed',
          ], 1, 'Every preset you declare is compiled into a CSS custom property and matching utility classes on both the front end and the editor, so writing rules against the variable keeps your CSS in step with palette changes.'),
          q('Editors compose a page in the block canvas and the published result looks different. Which fix addresses the cause?', [
            'Register a block style variation so both sides end up using the same class',
            'Move the front-end stylesheet from wp_enqueue_scripts into wp_head directly',
            'Set appearanceTools to true so the canvas inherits the theme layout widths',
            'Call add_theme_support with editor-styles and pass the file to add_editor_style',
          ], 3, 'The editor canvas is a separate document that receives no theme CSS unless you hand it a stylesheet, so declaring editor-styles support and registering the file is what makes the canvas match the front end.'),
        ]
      ),
        lesson('Building a Custom Block', 15, `
A block is a JavaScript module that describes an editing experience plus a definition file that PHP and JS both read. Scaffold one rather than assembling the toolchain by hand:

\`\`\`bash
npx @wordpress/create-block@latest event-card --namespace cortex --variant dynamic
cd event-card && npm start        # wp-scripts watch build; npm run build for production
\`\`\`

### block.json is the source of truth

Everything about the block — its name, attributes, supported features, and which files to load — lives in one file. PHP reads it, the editor reads it, and the block directory reads it.

\`\`\`json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "cortex/event-card",
  "title": "Event Card",
  "category": "widgets",
  "icon": "calendar-alt",
  "description": "Shows one event with its start date.",
  "textdomain": "cortex-events",
  "attributes": {
    "eventId":     { "type": "number",  "default": 0 },
    "showExcerpt": { "type": "boolean", "default": true }
  },
  "supports": { "html": false, "align": [ "wide" ], "color": { "background": true, "text": true } },
  "editorScript": "file:./index.js",
  "style": "file:./style-index.css",
  "render": "file:./render.php"
}
\`\`\`

\`"html": false\` removes the "Edit as HTML" option, which is the single cheapest way to stop editors breaking a block they do not understand.

Register it from the plugin you built in Chapter 3 — one line, pointed at the **build** directory, on \`init\` like everything else:

\`\`\`php
add_action( 'init', function () {
  register_block_type( CORTEX_EVENTS_PATH . 'build/event-card' );
} );
\`\`\`

### The edit component

\`edit.js\` is a React component. \`useBlockProps()\` returns the class names and styles the editor needs on your outer element — omit it and selection, alignment, and the toolbar all misbehave.

\`\`\`js
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
  const { eventId, showExcerpt } = attributes;
  const blockProps = useBlockProps( { className: 'event-card' } );

  // Reads through the REST API from Chapter 4 — cached and shared across blocks.
  const event = useSelect(
    ( select ) =>
      eventId ? select( 'core' ).getEntityRecord( 'postType', 'event', eventId ) : null,
    [ eventId ]
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title={ __( 'Card', 'cortex-events' ) }>
          <ToggleControl
            label={ __( 'Show excerpt', 'cortex-events' ) }
            checked={ showExcerpt }
            onChange={ ( value ) => setAttributes( { showExcerpt: value } ) }
          />
        </PanelBody>
      </InspectorControls>
      <div { ...blockProps }>
        { event ? event.title.rendered : __( 'Pick an event', 'cortex-events' ) }
      </div>
    </>
  );
}
\`\`\`

\`\`\`js
// index.js
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

registerBlockType( metadata.name, {
  edit: Edit,
  save: () => null,   // dynamic: PHP renders the front end, so nothing is stored
} );
\`\`\`

### Static, dynamic, and the error everyone hits

A **static** block runs \`save()\` and writes the resulting HTML into \`post_content\`. A **dynamic** block returns \`null\` from \`save()\` and renders in PHP on every request.

That distinction produces the classic block bug. On load, the editor re-runs \`save()\` and compares the result against the HTML stored in the post. Any difference at all — an added class, a changed wrapper element, a renamed attribute — and you get **"This block contains unexpected or invalid content"** on every existing post, with a recovery button that cheerfully discards the block.

There are exactly two honest fixes. Either register a \`deprecated\` entry describing the *old* save output and attributes, so the editor can recognise and migrate the stored markup, or make the block dynamic so there is no stored markup to disagree with. Editing \`save()\` on a shipped static block and hoping is not a third option.

For anything that reads live data — a post title, a price, a list of events — dynamic is the right default anyway. The markup is generated fresh, so the front end never shows a stale copy of content that changed elsewhere.
        `,
        [
          q('You leave useBlockProps out of the outer element returned by your edit component. What goes wrong?', [
            'The block fails to register and never appears in the inserter at all',
            'Attributes stop saving, so every value resets when the post is reloaded',
            'Selection, alignment and the block toolbar stop behaving correctly in the editor',
            'render.php receives an empty attributes array on every front-end request',
          ], 2, 'useBlockProps returns the class names, data attributes and styles the editor relies on to identify and decorate your block, so omitting them leaves the editor unable to wire up selection and the toolbar.'),
          q('register_block_type is pointed at the src directory instead of build. What is the consequence?', [
            'The compiled scripts and generated dependency list are missing, so it never loads',
            'The block registers twice, once from src and once again from the build folder',
            'Only the editor half loads, and the front end falls back to the raw save output',
            'Nothing, because wp-scripts writes its output back into src during a watch build',
          ], 0, 'wp-scripts compiles the JSX into build along with the asset file listing each script\'s dependencies and version, so registering from src points WordPress at a block.json whose referenced files do not exist in usable form.'),
          q('A static block has shipped and you must change its save() markup. Which approach avoids the invalid content error?', [
            'Bump the apiVersion in block.json and clear the object cache afterwards',
            'Move the changed markup into style-index.css and leave save() untouched',
            'Re-save every affected post through WP-CLI before deploying the new build',
            'Register a deprecated entry for the old output, or make the block dynamic',
          ], 3, 'A deprecation lets the editor recognise and migrate markup serialised by the previous version, and a dynamic block stores no markup at all, so there is nothing left for the validator to disagree with.'),
        ]
      ),
        lesson('Dynamic Rendering, Patterns, and Locked Templates', 14, `
The block from the last lesson has no front-end markup yet. \`render.php\` supplies it, and WordPress puts three variables in scope for you: \`$attributes\`, \`$content\`, and the \`$block\` instance.

\`\`\`php
<?php
// build/event-card/render.php
$event_id = (int) ( $attributes['eventId'] ?? 0 );
$event    = $event_id ? get_post( $event_id ) : null;

if ( ! $event || 'publish' !== $event->post_status ) {
  return;   // render nothing rather than a broken card
}

// Already-escaped string carrying the editor's classes, colours, and alignment.
$wrapper = get_block_wrapper_attributes( [ 'class' => 'event-card' ] );
?>
<div <?php echo $wrapper; ?>>
  <h3 class="event-card__title">
    <a href="<?php echo esc_url( get_permalink( $event ) ); ?>">
      <?php echo esc_html( get_the_title( $event ) ); ?>
    </a>
  </h3>
  <p class="event-card__date">
    <?php echo esc_html( get_post_meta( $event->ID, 'event_start', true ) ); ?>
  </p>
  <?php if ( ! empty( $attributes['showExcerpt'] ) ) : ?>
    <p><?php echo esc_html( get_the_excerpt( $event ) ); ?></p>
  <?php endif; ?>
</div>
\`\`\`

**\`get_block_wrapper_attributes()\` is not optional.** It is what prints \`has-brand-background-color\`, \`alignwide\`, the anchor, and any inline styles the editor recorded. Hand-writing \`<div class="event-card">\` instead is why the colour and alignment controls appear to work while editing and do nothing on the published page — the choices were saved correctly, your template just never printed them.

Everything else obeys Chapter 5: escape at output, in the context each value lands in. \`$wrapper\` is the one exception, because core built and escaped it.

Dynamic rendering runs on every uncached request, so treat it like any other template code. If it does something expensive, wrap it in a transient the way Chapter 5 did.

### Patterns: prebuilt layouts editors can insert

Any PHP file in a \`patterns/\` folder in the theme is registered automatically from its header:

\`\`\`php
<?php
/**
 * Title: Event grid
 * Slug: cortex/event-grid
 * Categories: featured
 * Block Types: core/query
 */
?>
<!-- wp:columns -->
<div class="wp-block-columns">
  <!-- wp:column --><div class="wp-block-column">
    <!-- wp:cortex/event-card {"showExcerpt":false} /-->
  </div><!-- /wp:column -->
</div>
<!-- /wp:columns -->
\`\`\`

Patterns are **copies**, not references. Inserting one drops its blocks into the post and they never update again. When you need one source of truth that updates everywhere, use a synced pattern (stored as a \`wp_block\` post) instead — the distinction catches people out when they "fix the pattern" and forty pages ignore it.

### Constrain the editing surface

For a post type with a required shape, seed and lock it at registration time:

\`\`\`php
register_post_type( 'event', [
  // …the arguments from Chapter 4…
  'template' => [
    [ 'core/heading',      [ 'level' => 2, 'placeholder' => 'Event name' ] ],
    [ 'cortex/event-card' ],
    [ 'core/paragraph',    [ 'placeholder' => 'Describe the event…' ] ],
  ],
  'template_lock' => 'all',   // 'insert' = no adding or removing; 'all' = also no reordering
] );
\`\`\`

The template seeds **new** posts only; existing events keep whatever they already contain. Narrow the inserter separately, and note the filter rule from Chapter 3 — return the original value on every branch you do not handle:

\`\`\`php
add_filter( 'allowed_block_types_all', function ( $allowed, $context ) {
  if ( ! empty( $context->post ) && 'event' === $context->post->post_type ) {
    return [ 'core/paragraph', 'core/heading', 'core/image', 'core/list', 'cortex/event-card' ];
  }
  return $allowed;
}, 10, 2 );
\`\`\`

### Style variations without new blocks

\`\`\`php
register_block_style( 'core/quote', [
  'name'  => 'boxed',                              // adds .is-style-boxed
  'label' => __( 'Boxed', 'cortex' ),
] );
\`\`\`

That gives editors a named choice in the sidebar and gives you a class to style. Reach for it before writing a whole block — most "we need a custom block" requests are really a core block with different padding.
        `,
        [
          q('You improve a block pattern and redeploy, but the forty pages already using it are unchanged. Why?', [
            'Pattern updates only apply once the rewrite rules have been flushed',
            'Inserting a pattern copies its blocks into the post, so there is no live link',
            'Patterns from the patterns folder are cached in a transient for a full day',
            'The pattern slug changed, so those pages now point at an orphaned version',
          ], 1, 'An unsynced pattern is a starting point copied into post_content on insert, so editing the source never touches existing posts, and a synced pattern stored as a wp_block post is what gives you one source of truth.'),
          q('Your allowed_block_types_all callback returns a fixed array for events and falls off the end otherwise. What breaks?', [
            'Event posts lose the blocks you listed because the context is empty on first load',
            'The filter runs before init, so your custom blocks are missing from the array',
            'Every other editing context receives null, stripping the inserter site wide',
            'The callback is dropped after one request because it declares two arguments',
          ], 2, 'A filter must return a value on every branch, so falling off the end hands back null for posts and pages that never matched, and the editor reads that as an empty list of permitted blocks.'),
          q('When is register_block_style the better answer than building a whole new block?', [
            'When editors need a named visual variant of a core block you can then style',
            'When the markup has to change structurally between the two presentations',
            'When the variant must read live data from a custom post type on render',
            'When the block should be unavailable outside one specific post type',
          ], 0, 'register_block_style adds a labelled choice in the sidebar and an is-style class on the existing block, which covers most of the requests that arrive described as needing a custom block.'),
        ]
      ),
            lesson('Block Themes and Full Site Editing', 14, `
The classic theme from Chapter 2 puts every header change behind a PHP edit, a pull request, and a deploy. A block theme puts it behind a client clicking Edit at eleven at night. Which of those you want is a business decision as much as a technical one, and it is worth making deliberately before you choose a starting point.

### Three files is a theme

A block theme needs \`style.css\` for its header comment, \`templates/index.html\`, and in practice a \`theme.json\`. Everything else is optional:

\`\`\`text
cortex-blocks/
  style.css
  theme.json
  templates/
    index.html
    single-event.html
    archive-event.html
    404.html
  parts/
    header.html
    footer.html
\`\`\`

Look at those file names. The hierarchy from Chapter 1 has not changed at all: WordPress still looks for \`single-event\`, then \`single\`, then \`singular\`, then \`index\`. Only the extension moved from \`.php\` to \`.html\`, and the contents are block markup instead of template tags.

### What moved where

| Classic theme | Block theme |
|---|---|
| \`header.php\` and \`footer.php\` | \`parts/header.html\` and \`parts/footer.html\` |
| \`index.php\` plus the PHP Loop | \`templates/index.html\` with a Query Loop block |
| \`wp_nav_menu()\` and the Menus screen | the Navigation block, saved as a \`wp_navigation\` post |
| Styling constants in \`functions.php\` | \`theme.json\` settings and styles |

That menu row catches migrations out. A block theme ignores the classic Appearance and Menus screens completely, so the navigation a client spent an hour arranging does not come across. It gets rebuilt inside the Navigation block, which stores its items as their own post type that you can inspect with \`wp post list --post_type=wp_navigation\`.

### A template is block comments

\`\`\`html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:query {"queryId":8,"query":{"perPage":10,"postType":"event","inherit":true}} -->
<div class="wp-block-query">
  <!-- wp:post-template -->
    <!-- wp:post-title {"isLink":true,"level":2} /-->
    <!-- wp:post-excerpt /-->
  <!-- /wp:post-template -->
  <!-- wp:query-pagination --><!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
\`\`\`

The Query Loop block replaces the PHP Loop and \`post-template\` is the part that repeats. That \`inherit\` flag is load bearing on any archive template: it tells the block to use the main query WordPress already ran for this URL. Set it to false and every category archive proudly shows the same ten latest posts, because the block built its own generic query and threw away the one the URL asked for.

### The gotcha that eats an afternoon

You edit \`templates/single-event.html\`, commit it, deploy it, reload the page, and nothing changes.

The moment anyone saves that template in the Site Editor, WordPress writes a copy into the database as a \`wp_template\` post, and from then on the copy wins over your file permanently. The deploy worked. It is just being shadowed.

\`\`\`bash
wp post list --post_type=wp_template --fields=ID,post_name,post_status
\`\`\`

The Site Editor marks those templates as Customized and offers Clear customizations, which deletes the database copy and hands control back to the file in your repository. Notice how this collides with the rule from Chapter 7 that content moves down: a production database pulled onto staging brings its customised templates with it, and quietly buries whatever design work you did in the staging Site Editor.

### Registering parts and going hybrid

Template parts want an area so the editor knows where each one belongs:

\`\`\`json
"templateParts": [
  { "name": "header", "title": "Header", "area": "header" },
  { "name": "footer", "title": "Footer", "area": "footer" }
]
\`\`\`

You do not have to go all in. A classic theme that adds \`add_theme_support( 'block-template-parts' )\` keeps its PHP templates while letting editors manage the header and footer as blocks. For a site carrying heavy custom PHP templates that nobody has budget to rewrite this quarter, that halfway position is usually the honest answer.
      `,
        [
          q('You edit templates/single-event.html, deploy it, and the live page is unchanged. What is the most likely reason?', [
            'Block templates are compiled at activation, so the theme has to be reactivated',
            'Someone saved that template in the Site Editor, and the database copy wins',
            'HTML templates are only read when no PHP template of the same name exists',
            'The template part slugs no longer resolve, so core falls back to index.html',
          ], 1, 'Saving a template in the Site Editor writes a wp_template post that permanently shadows the file, and clearing that customisation is what hands control back to the version in your repository.'),
          q('What is the minimum a folder needs before WordPress treats it as a block theme?', [
            'A functions.php calling add_theme_support with the block-templates flag',
            'A theme.json file plus a parts folder holding a header and a footer',
            'An index.php that loads the block renderer, plus a style.css header',
            'A style.css with the theme header and templates/index.html',
          ], 3, 'Core treats the presence of templates/index.html as the signal that a theme is block based, and style.css carries the header comment that makes the folder a theme at all.'),
          q('A Query Loop on archive-event.html shows the same ten posts on every category archive. What is wrong?', [
            'The post-template inner block is missing, so the loop renders one static result',
            'The queryId collides with another loop on the page and core dedupes the output',
            'The block defines its own query instead of inheriting the one for the URL',
            'Pagination is absent, so the block only ever renders the very first result set',
          ], 2, 'An archive template has to let the Query Loop inherit the main query WordPress already built from the URL, otherwise the block runs a generic query of its own and the archive ignores which term was requested.'),
        ]
      ),
      ],
      [
        q('Core, your theme.json, and a client\'s Site Editor global styles all set the body background. Which value renders?', [
          'The core default, because it loads first',
          'The theme.json value, because the theme owns the design',
          'The client\'s global styles, because user layers resolve last',
          'Whichever stylesheet is enqueued with the highest priority',
        ], 2, 'The cascade runs core defaults, then theme.json, then user global styles, and the last layer to set a value wins.'),
        q('You add a CSS class to a shipped static block\'s save() output and every existing post now shows "This block contains unexpected or invalid content". Why?', [
          'The editor re-runs save() and compares it to the HTML stored in post_content, and any mismatch is a validation failure',
          'The block.json apiVersion is out of date',
          'The editorScript handle no longer matches the build output',
          'Static blocks must declare a permission_callback',
        ], 0, 'Static blocks serialise their markup into the post, so changed save() output no longer matches what was stored unless a deprecation describes the old version.'),
        q('A dynamic block\'s colour and alignment controls work while editing but have no effect on the published page. What is missing from render.php?', [
          'A call to wp_reset_postdata()',
          'The style entry in block.json',
          'A save() function that returns markup',
          'get_block_wrapper_attributes() on the outer element',
        ], 3, 'Those choices are stored as classes and inline styles that only get_block_wrapper_attributes() prints onto the wrapper.'),
        q('Editors must build event pages from a fixed structure they cannot reorder or delete. Which approach does that?', [
          'A block pattern plus supports.html set to false',
          'A template array on register_post_type with template_lock set to all',
          'register_block_style plus appearanceTools in theme.json',
          'The allowed_block_types_all filter plus flush_rewrite_rules()',
        ], 1, 'template seeds the required blocks into new posts of that type and template_lock stops them being moved, added, or removed.'),
      ]
    ),
    chapter(
      'Shipping and Running It in Production',
      'WP-CLI for real work, environment-aware config and safe migrations, and a method for finding the cause when a live site breaks.',
      [
        lesson('WP-CLI for Real Work', 14, `
WP-CLI runs WordPress without a browser. Anything the dashboard does it can do, plus a few things the dashboard cannot — and it is the only sane way to touch a site over SSH.

\`\`\`bash
wp core version --extra          # version, database revision, and package language
wp plugin list --update=available
wp plugin update --all --dry-run # see what would change before it changes
wp user create ana ana@example.com --role=editor
wp user reset-password admin --skip-email
wp option get siteurl
wp transient delete --all        # invalidate everything from Chapter 5 at once
wp rewrite flush                 # the Chapter 4 permalink fix, without clicking Save
\`\`\`

### The command that saves migrations

Moving a site between domains means rewriting URLs everywhere in the database. **A raw \`UPDATE … REPLACE()\` in SQL corrupts the site**, and this is the migration bug that has cost more weekends than any other.

WordPress stores arrays and objects as PHP-serialised strings, and each string records its own byte length: \`s:23:"https://old.example.com"\`. Change the text without changing the number and PHP can no longer unserialise the value, so widget settings, theme mods, and plugin options come back empty with no error at all.

\`wp search-replace\` unserialises, replaces, and re-serialises, so the lengths stay correct:

\`\`\`bash
# Always look first. --dry-run reports the count per table and changes nothing.
wp search-replace 'https://old.example.com' 'https://staging.example.com' \\
  --all-tables-with-prefix --skip-columns=guid --dry-run

wp search-replace 'https://old.example.com' 'https://staging.example.com' \\
  --all-tables-with-prefix --skip-columns=guid --report-changed-only
\`\`\`

\`--skip-columns=guid\` matters: a post's GUID is a permanent identifier, not a URL to visit, and rewriting it makes feed readers re-deliver every old post as new.

### Backups and database work

\`\`\`bash
wp db export backup-\$(date +%F-%H%M).sql          # before every risky operation
wp db import backup-2026-08-20-0930.sql
wp db query "SELECT option_name, LENGTH(option_value) AS bytes
  FROM wp_options WHERE autoload IN ('yes','on','auto','auto-on') ORDER BY bytes DESC LIMIT 10;"
\`\`\`

### Cron you can actually inspect

\`\`\`bash
wp cron event list                 # every scheduled hook and its next run
wp cron event run --due-now
wp cron test                       # can this server reach its own loopback URL?
\`\`\`

### Your own command

Any plugin can add one. Guard it so the code never loads during a web request:

\`\`\`php
if ( defined( 'WP_CLI' ) && WP_CLI ) {
  WP_CLI::add_command( 'cortex events sync', function ( $args, $assoc_args ) {
    $limit   = (int) ( $assoc_args['limit'] ?? 100 );
    $dry_run = isset( $assoc_args['dry-run'] );

    $ids = get_posts( [
      'post_type'      => 'event',
      'post_status'    => 'any',
      'posts_per_page' => $limit,
      'fields'         => 'ids',
    ] );

    $progress = WP_CLI\\Utils\\make_progress_bar( 'Syncing events', count( $ids ) );
    foreach ( $ids as $id ) {
      if ( ! $dry_run ) {
        update_post_meta( $id, 'cortex_synced_at', time() );
      }
      $progress->tick();
    }
    $progress->finish();

    WP_CLI::success( sprintf( '%d events processed.', count( $ids ) ) );
  } );
}
\`\`\`

Run it with \`wp cortex events sync --limit=500 --dry-run\`. Use \`WP_CLI::warning()\` for recoverable problems and \`WP_CLI::error()\` to stop with a non-zero exit code, which is what makes the command usable from a deploy script.

### Long loops leak memory

A CLI script iterating fifty thousand posts will exhaust memory, because WordPress caches every post, term, and meta row it touches and nothing ever ends the request. Batch the work and stop the caches growing:

\`\`\`php
wp_suspend_cache_addition( true );   // stop filling the object cache
wp_defer_term_counting( true );      // recount terms once at the end, not per post
\`\`\`

Then process in pages of a few hundred, calling \`wp_cache_flush()\` between batches. "It worked on a thousand rows and died on the real database" is almost always this.
        `,
        [
          q('Why does a domain migration pass --skip-columns=guid to wp search-replace?', [
            'The guid column is indexed, and rewriting it locks the posts table for minutes',
            'GUIDs are serialised, so replacing inside them corrupts their recorded length',
            'A GUID is a permanent identifier, and changing it makes feeds redeliver old posts',
            'The column is regenerated on the next save, so a replacement there is discarded',
          ], 2, 'Feed readers treat the guid as the unique key for an entry rather than as an address to visit, so rewriting it during a move republishes the entire archive to every subscriber.'),
          q('Why is a custom WP_CLI command wrapped in a check for the WP_CLI constant?', [
            'So the registration code never runs during an ordinary web request',
            'So the command is registered before the init hook has finished firing',
            'So WP-CLI can discover the command without loading the plugin file',
            'So the callback receives the assoc_args array in the expected order',
          ], 0, 'WP_CLI::add_command only exists once the command line runtime has loaded, so calling it on a normal page request raises a fatal error and takes the whole site down.'),
          q('A CLI script handled a thousand posts fine and dies on the production database of fifty thousand. Why?', [
            'WP-CLI enforces a hard limit on how many posts a single command may touch',
            'The object cache keeps growing for the life of the process and exhausts memory',
            'MySQL closes the connection once a single command exceeds its wait timeout',
            'get_posts refuses to return more rows than the default posts_per_page setting',
          ], 1, 'Nothing ever ends the request under WP-CLI, so every post, term and meta row it touches stays cached in memory, which is why long jobs batch the work and flush the cache between batches.'),
        ]
      ),
        lesson('Environments, Config, and Migrations', 13, `
A site you can only change through the dashboard has no history, no review, and no way back. The fix is to decide what belongs in version control and to make configuration aware of where it is running.

### What goes in the repository

Your code. Not WordPress core, not uploads, not the database, and never real secrets.

\`\`\`
# .gitignore
/wp-admin/
/wp-includes/
/wp-config.php
wp-content/uploads/
wp-content/upgrade/
wp-content/plugins/*
!wp-content/plugins/cortex-events/
!wp-content/plugins/index.php
\`\`\`

Denying the whole plugins folder and allowing back the ones you wrote is the pattern worth copying. Third-party plugins are dependencies; pin them with Composer and \`wpackagist\` so a deploy installs known versions rather than whatever the dashboard happened to update to on a Tuesday.

The rule that keeps everyone sane: **code moves up, content moves down.** Themes and plugins deploy from local to staging to production; databases and uploads copy from production back down. The moment you start pushing databases upward you begin overwriting real customer data.

### Environment-aware configuration

\`\`\`php
// wp-config.php — the value comes from the server, not from the repository.
$cortex_env = getenv( 'WP_ENV' ) ?: 'production';
define( 'WP_ENVIRONMENT_TYPE', $cortex_env );   // local | development | staging | production

if ( 'production' === $cortex_env ) {
  define( 'WP_DEBUG', false );
  define( 'DISALLOW_FILE_EDIT', true );   // no PHP editor in the dashboard
  define( 'DISALLOW_FILE_MODS', true );   // no installs or updates outside the deploy
} else {
  define( 'WP_DEBUG', true );
  define( 'WP_DEBUG_LOG', true );
  define( 'WP_DEBUG_DISPLAY', false );    // log it, never print it (Chapter 1)
  define( 'SAVEQUERIES', true );
}
\`\`\`

In \`wp-config.php\` you must compare the variable directly — \`wp_get_environment_type()\` does not exist yet at that point. Everywhere else in themes and plugins, use the function:

\`\`\`php
if ( 'production' !== wp_get_environment_type() ) {
  add_filter( 'robots_txt', fn( $txt ) => "User-agent: *\\nDisallow: /\\n", 20 );
}
\`\`\`

### Stop staging from emailing your customers

The worst incident a junior developer causes is a staging copy that sends 4,000 real order confirmations. Kill it centrally with a must-use plugin, using the short-circuit filter pattern from Chapter 3:

\`\`\`php
// wp-content/mu-plugins/000-no-outbound-mail.php
add_filter( 'pre_wp_mail', function ( $short_circuit, $atts ) {
  if ( 'production' === wp_get_environment_type() ) {
    return $short_circuit;                 // null: let WordPress send normally
  }
  error_log( 'Mail suppressed to: ' . implode( ', ', (array) $atts['to'] ) );
  return true;                             // report success, send nothing
}, 10, 2 );
\`\`\`

Must-use plugins load before everything else and cannot be deactivated from the dashboard, which is exactly the guarantee you want here.

### A refresh runbook

Pulling production down to staging, in order:

1. \`wp db export pre-refresh.sql\` on staging — your undo.
2. Export production: \`wp db export prod.sql\`, and \`rsync\` \`wp-content/uploads/\`.
3. Import on staging, then \`wp search-replace\` the domain with \`--dry-run\` first.
4. \`wp option update blog_public 0\` so search engines never index the copy.
5. \`wp rewrite flush\` and \`wp transient delete --all\` — stale rewrite rules and cached URLs are the usual cause of "the refresh half worked".
6. Anonymise or truncate anything you are not entitled to hold: real customer records on a staging box are a data-protection incident waiting for a laptop to be stolen.

### Deploys

Deploy a directory, not individual files, and keep the previous release on disk. A release you can roll back to in ten seconds turns a bad Friday deploy into a shrug. After every deploy: \`wp core version\`, load the front page, load an admin screen, and check \`debug.log\` is not growing.
        `,
        [
          q('Why must wp-config.php compare the environment variable directly instead of calling wp_get_environment_type?', [
            'The function reads a filter that plugins are allowed to override later on',
            'The function returns the server host name rather than the environment string',
            'Constants defined after that call are ignored by the rest of the load',
            'wp-config.php runs before core loads, so the function does not exist yet',
          ], 3, 'wp-config.php is included by wp-load.php before wp-settings.php pulls in the core function files, so any core helper called there is undefined and the request fatals immediately.'),
          q('A must-use plugin hooks pre_wp_mail and returns true on staging. What does that achieve?', [
            'Mail is queued and delivered once the site is promoted to production',
            'WordPress reports a successful send and no message ever leaves the server',
            'Every recipient is rewritten to the site administrator\'s own address',
            'The mail call throws, so the calling plugin logs its own delivery failure',
          ], 1, 'pre_wp_mail is a short-circuit filter, so returning anything other than null skips delivery entirely while wp_mail still reports success, which stops the calling code treating the suppression as an error.'),
          q('What does the rule that code moves up and content moves down protect you from?', [
            'Deploying a theme that depends on plugins staging does not have installed',
            'Losing uploads when the previous release directory is pruned after a deploy',
            'Pushing a staging database upward and overwriting real customer records',
            'Committing wp-config.php with production credentials into the repository',
          ], 2, 'Themes and plugins are code that flows from local towards production, while the database and uploads are the live record that only ever gets copied downward, and reversing that direction destroys real data.'),
        ]
      ),
        lesson('Debugging a Live Site', 15, `
Production debugging is a method, not an instinct: reproduce it, read the log, bisect the cause, then fix. Guessing at plugins in the dashboard is how a five-minute outage becomes an hour.

### Read the logs, both of them

\`\`\`bash
tail -f wp-content/debug.log                 # WordPress notices, warnings, and fatals
tail -f /var/log/php-fpm/www-error.log       # parse errors, memory limits, timeouts
\`\`\`

The second file matters because the errors that take a site down hardest never reach \`debug.log\`. A syntax error, an exhausted memory limit, or a PHP-FPM timeout kills the process before WordPress's own handler runs.

**Never fix this by turning on \`WP_DEBUG_DISPLAY\` in production.** Printed notices leak absolute server paths, and worse, they inject text into responses that must be pure JSON or pure headers — so your REST endpoints from Chapter 4 start failing to parse and your redirects break. You end up debugging the debugger.

### The white screen

A blank page is a fatal error. Since WordPress 5.2 a fatal in a plugin or theme triggers **recovery mode**: the offending extension is paused, the site stays up, and an email goes to the admin address. If that address is a departed employee's, nobody ever finds out. Set it explicitly:

\`\`\`php
define( 'RECOVERY_MODE_EMAIL', 'devs@example.com' );

// Development only — see the raw fatal instead of the polite screen.
define( 'WP_DISABLE_FATAL_ERROR_HANDLER', true );
\`\`\`

### Bisect without the dashboard

When the site will not load, WP-CLI still will:

\`\`\`bash
wp plugin list --status=active --field=name > /tmp/active.txt   # write it down first
wp plugin deactivate --all
# site loads? then it is a plugin. Re-activate in halves, not one by one.
wp plugin activate woocommerce wordpress-seo
wp theme activate twentytwentyfour        # still broken with plugins off? blame the theme
\`\`\`

Halving gets you to the culprit among forty plugins in about six steps instead of forty. Restore the original list from the file when you are done.

### Symptoms worth recognising on sight

| Symptom | Usual cause | First check |
|---|---|---|
| Blank page or HTTP 500 | PHP fatal | \`debug.log\`, then the PHP error log |
| "Briefly unavailable for scheduled maintenance" | Update interrupted, stale \`.maintenance\` file | Delete the file in the site root |
| Redirect loop after a domain move | \`siteurl\`/\`home\` mismatch, or HTTPS terminated at a proxy | \`wp option get siteurl\`, then \`HTTP_X_FORWARDED_PROTO\` |
| Scheduled posts and emails never fire | WP-Cron is triggered by traffic | \`wp cron event list\`, \`wp cron test\` |
| Admin slow, front end fine | Page cache hides it; no object cache | Query Monitor on an admin screen |
| HTTP 502/504 | PHP timeout or memory exhaustion | \`WP_MEMORY_LIMIT\`, FPM timeout |

That cron row deserves its own note. WP-Cron runs on page loads, so a quiet site simply never reaches its due events. Fix it properly:

\`\`\`php
define( 'DISABLE_WP_CRON', true );   // stop the loopback attempt on every request
\`\`\`

\`\`\`bash
*/5 * * * * cd /var/www/site && wp cron event run --due-now --quiet
\`\`\`

Setting the constant and forgetting the crontab line is the failure mode — now nothing runs at all, and the symptom appears days later as "our subscription emails stopped".

### Find the slow query

With \`SAVEQUERIES\` on in a non-production environment, log anything over 50ms with its call stack:

\`\`\`php
add_action( 'shutdown', function () {
  if ( ! defined( 'SAVEQUERIES' ) || ! SAVEQUERIES ) {
    return;
  }
  global $wpdb;
  foreach ( $wpdb->queries as $query ) {
    // [0] SQL, [1] seconds, [2] the calling stack
    if ( $query[1] > 0.05 ) {
      error_log( sprintf( '%.3fs | %s | %s', $query[1], $query[2], $query[0] ) );
    }
  }
} );
\`\`\`

The third element names the function that issued it, which usually identifies the plugin in one line. \`SAVEQUERIES\` itself costs memory, so it never stays on.

Last: know your way back. A database export taken before the deploy and a previous release directory on disk mean the answer to "we cannot work out what broke" is a rollback in seconds, and a calm investigation afterwards.
        `,
        [
          q('The site returns a blank page and debug.log has no new entries at all. Where do you look next?', [
            'The PHP-FPM error log, since a parse error or memory limit kills the process first',
            'The access log, because a fatal error is recorded there with its status code',
            'The database slow query log, which captures anything over the default threshold',
            'The object cache statistics, which record every failed include on the request',
          ], 0, 'A syntax error, an exhausted memory limit or an FPM timeout stops PHP before WordPress installs its own error handler, so nothing can reach debug.log and only the server log holds the message.'),
          q('Recovery mode pauses a fatal plugin and emails the admin address. What is the usual failure mode?', [
            'The paused plugin reactivates itself on the next cron run and breaks the site',
            'The admin address belongs to someone who left, so nobody sees the notification',
            'Recovery mode only runs for logged-in administrators, so visitors get the fatal',
            'The email link expires in ten minutes, which is shorter than most response times',
          ], 1, 'The site stays up and quietly degraded, so that notification is the only signal anything is wrong, which is why RECOVERY_MODE_EMAIL should point at an address the team actually reads.'),
          q('With SAVEQUERIES on, what makes the third element of each entry in the queries array so useful?', [
            'It holds the number of rows the query returned before any filtering',
            'It records the index MySQL chose, which shows why the query was slow',
            'It carries the transient key that would have served the result from cache',
            'It is the call stack, which usually names the plugin that issued the query',
          ], 3, 'Knowing a query took 400ms is useless without knowing who ran it, and the stored stack points straight at the calling function and therefore at the plugin responsible.'),
        ]
      ),
            lesson('Code Standards and a CI Pipeline', 13, `
The escaping rules from Chapter 5 are worth exactly as much as the attention of whoever reviews the pull request at six on a Friday. A tired reviewer misses one \`esc_html()\` in nine hundred changed lines. PHP_CodeSniffer with the WordPress ruleset finds it in about four seconds, every time, and never gets bored.

### Install it as a development dependency

\`\`\`bash
composer require --dev squizlabs/php_codesniffer wp-coding-standards/wpcs \\
  phpcsstandards/phpcsutils phpcompatibility/phpcompatibility-wp \\
  dealerdirect/phpcodesniffer-composer-installer
composer exec -- phpcs -i     # confirm WordPress and PHPCompatibilityWP are registered
\`\`\`

Then one config file at the root of the plugin, committed alongside the code so every machine and every CI run agrees:

\`\`\`xml
<?xml version="1.0"?>
<ruleset name="Cortex Events">
  <file>.</file>
  <exclude-pattern>*/vendor/*</exclude-pattern>
  <exclude-pattern>*/node_modules/*</exclude-pattern>
  <exclude-pattern>*/build/*</exclude-pattern>

  <rule ref="WordPress-Extra"/>
  <rule ref="WordPress.WP.I18n">
    <properties>
      <property name="text_domain" type="array" value="cortex-events"/>
    </properties>
  </rule>

  <config name="testVersion" value="8.1-"/>
  <rule ref="PHPCompatibilityWP"/>
</ruleset>
\`\`\`

\`phpcs\` reports, \`phpcbf\` rewrites what it safely can. Spacing, alignment and Yoda conditions get fixed for you. A missing \`esc_html()\`, an unverified nonce and an unprepared query never will, because deciding what a value means is a human job.

### The sniffs that earn their keep

| Sniff | Catches |
|---|---|
| \`WordPress.Security.EscapeOutput\` | Anything echoed without an escaping function |
| \`WordPress.Security.NonceVerification\` | Reading \`$_POST\` before verifying a nonce |
| \`WordPress.DB.PreparedSQL\` | A \`$wpdb\` query built by string interpolation |
| \`WordPress.WP.I18n\` | A translation call carrying the wrong text domain |
| \`PHPCompatibilityWP\` | Syntax the target PHP version cannot parse |

### testVersion is not your PHP version

\`testVersion\` is the range PHPCompatibility checks against, and it has nothing whatsoever to do with the interpreter running the tool. Develop on PHP 8.3, leave that config line out, and an enum or a readonly property sails through review and fatals on a host still sitting on 8.1. Set it to the oldest version you support and write it as an open range, \`8.1-\`, so newer releases are checked too.

### False positives, handled honestly

\`\`\`php
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core escapes this.
echo get_block_wrapper_attributes( [ 'class' => 'event-card' ] );
\`\`\`

That is the right shape: one line, one named sniff, one stated reason. What quietly kills a codebase is the blanket \`<exclude name="WordPress.Security"/>\` somebody added at 5pm to get a release out. The rule is decoration from that moment on, and nobody notices for two years.

### The first run on an old codebase

Point this at a plugin nobody has ever linted and you get four thousand errors on screen. That is not a reason to skip it. Run \`phpcbf\` first, which typically clears sixty to eighty percent of them because most are whitespace, and commit that on its own as a formatting-only change so it never muddies a real diff. For whatever survives, lint only what the branch touched:

\`\`\`bash
git diff --name-only origin/main...HEAD -- '*.php' | xargs -r composer exec -- phpcs
\`\`\`

New code is held to the standard from the first commit, and the backlog shrinks on its own as old files get edited for other reasons.

### Make it a gate, not a suggestion

\`\`\`yaml
# .github/workflows/lint.yml
name: lint
on: [pull_request]
jobs:
  phpcs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.1' }
      - run: composer install --prefer-dist --no-progress
      - run: composer exec -- phpcs -q --report=checkstyle
\`\`\`

A local git hook gets skipped with \`--no-verify\` by whoever is in the biggest hurry, which is reliably the person whose commit most needed checking. Mark this job as a required check on the branch and the argument is over. Add \`wp plugin check\` beside it if you publish to the plugin directory, because it applies the repository's own submission rules, and those are stricter than yours.
      `,
        [
          q('phpcs is clean on your machine running PHP 8.3, yet the plugin fatals on a host running 8.1. What was missed?', [
            'phpcbf had not been run, so the auto-fixable syntax was left in place',
            'The vendor directory was excluded, hiding a dependency\'s incompatible code',
            'testVersion was never set, so PHPCompatibility checked nothing against 8.1',
            'WordPress-Extra covers style only and was the wrong ruleset to reference',
          ], 2, 'PHPCompatibility reports against the versions named in testVersion rather than against the interpreter running the scan, so without that config line nothing is ever compared to the oldest PHP you support.'),
          q('phpcs flags an echo of get_block_wrapper_attributes as unescaped output. What is the right response?', [
            'A one line phpcs:ignore naming that sniff, with a reason saying core escapes it',
            'Wrap the call in esc_attr so both the sniff and the output are satisfied',
            'Exclude WordPress.Security from the ruleset since the sniff misreads core calls',
            'Replace the call with a hand-written class attribute the sniff can verify',
          ], 0, 'Core has already escaped that string and escaping it again would mangle the markup, so the honest fix is a narrow suppression naming the sniff and the reason rather than a blanket exclusion that disarms the rule everywhere.'),
          q('Which of these violations will phpcbf not fix for you automatically?', [
            'Indentation that mixes tabs and spaces inside a function body',
            'A comparison written with the constant on the wrong side of the operator',
            'Missing spaces inside the parentheses of a function call',
            'A variable echoed into HTML without any escaping function around it',
          ], 3, 'Choosing between esc_html, esc_attr, esc_url and wp_kses_post depends on the context the value lands in, which is a judgement no automatic fixer can make, so escaping violations always come back to a person.'),
        ]
      ),
      ],
      [
        q('You move a site to a new domain with a SQL find-and-replace, and afterwards widget and theme settings are empty. What happened?', [
          'The export omitted the options table',
          'Rewrite rules were not flushed after the move',
          'The guid column was replaced along with the rest',
          'PHP-serialised values record their own byte length, so a raw text replace makes them unreadable',
        ], 3, 'wp search-replace unserialises each value, replaces inside it, and re-serialises so the recorded lengths stay correct.'),
        q('On a low-traffic site, scheduled posts stop publishing and the nightly digest email never goes out. What do you check first?', [
          'Whether WP-Cron is firing at all, since it runs on page loads unless a system cron replaces it',
          'The theme\'s functions.php for a missing return',
          'The size of the autoloaded options',
          'The nonce lifetime',
        ], 0, 'WP-Cron is triggered by incoming requests, so a quiet site — or DISABLE_WP_CRON without a real crontab entry — never reaches its due events.'),
        q('Why should WP_DEBUG_DISPLAY stay false on production even while you are actively diagnosing a bug?', [
          'Errors are not written to debug.log while it is true',
          'It disables the persistent object cache',
          'Printed notices leak server paths and corrupt responses that must be pure JSON or headers',
          'It prevents recovery mode from sending its email',
        ], 2, 'Displayed errors expose internals and inject text into REST and redirect responses, adding a second failure on top of the one you are chasing.'),
        q('Which constant pair belongs on a production site deployed from version control?', [
          'WP_DEBUG true and SCRIPT_DEBUG true',
          'DISALLOW_FILE_EDIT true and DISALLOW_FILE_MODS true',
          'SAVEQUERIES true and WP_DEBUG_DISPLAY true',
          'DISABLE_WP_CRON true and WP_DEBUG_LOG false',
        ], 1, 'Both stop code changing outside the deploy pipeline: no dashboard PHP editor, and no installs or updates the repository would silently overwrite.'),
      ]
    ),
      chapter(
      'Testing a WordPress Codebase',
      'The three layers of automated test that actually catch WordPress bugs, plus the static analysis and version matrix that stop a release breaking a host you never tried.',
      [
      lesson('Unit Tests Without a Database', 13, `
The Cortex Events integration suite spends 41 seconds booting WordPress before it reaches a single assertion. The unit suite runs 380 tests in 0.6 seconds. That gap decides how often anyone runs them, and a suite people only run before a release has already stopped protecting you.

A unit test loads no WordPress at all. No database, no \`wp-load.php\`, no plugins. Which sounds impossible for WordPress code, right up until you notice how much of your code is not really WordPress code.

### The function you cannot test

\`\`\`php
function cortex_event_badge( int $post_id ): string {
    $seats = (int) get_post_meta( $post_id, '_cortex_seats', true );
    $sold  = (int) get_post_meta( $post_id, '_cortex_sold', true );

    if ( $sold >= $seats ) {
        return __( 'Sold out', 'cortex-events' );
    }
    $left = $seats - $sold;
    return $left <= 10
        ? sprintf( __( 'Only %d left', 'cortex-events' ), $left )
        : __( 'Tickets available', 'cortex-events' );
}
\`\`\`

Three business rules live in there: sold out, urgency under ten seats, everything else. To exercise any of them you need a database, a post, two meta rows and a loaded translation layer. Call it with WordPress absent and PHP fatals on an undefined \`get_post_meta()\`.

The decision logic never wanted a post ID. It wanted two integers.

### Split the shell from the rule

\`\`\`php
final class Availability {
    public const URGENT_AT = 10;

    public static function label( int $seats, int $sold ): string {
        if ( $seats <= 0 || $sold >= $seats ) {
            return 'sold_out';
        }
        $left = $seats - $sold;
        return $left <= self::URGENT_AT ? 'urgent:' . $left : 'available';
    }
}

function cortex_event_badge( int $post_id ): string {
    return cortex_render_badge( Availability::label(
        (int) get_post_meta( $post_id, '_cortex_seats', true ),
        (int) get_post_meta( $post_id, '_cortex_sold', true )
    ) );
}
\`\`\`

The rule is now a pure function of two integers, and the WordPress function is a shell that fetches and delegates. Returning a token instead of a translated string keeps assertions stable when marketing rewords the copy.

\`\`\`php
final class AvailabilityTest extends PHPUnit\\Framework\\TestCase {
    public function test_last_seats_trigger_urgency(): void {
        $this->assertSame( 'urgent:3', Availability::label( 50, 47 ) );
        $this->assertSame( 'available', Availability::label( 50, 20 ) );
        $this->assertSame( 'sold_out', Availability::label( 50, 50 ) );
    }

    public function test_overbooking_reads_as_sold_out(): void {
        $this->assertSame( 'sold_out', Availability::label( 50, 61 ) );
    }
}
\`\`\`

That second test is the one that pays for the refactor. Two people checking out at once pushed \`sold\` past \`seats\`, \`$left\` went negative, and the original code printed "Only -11 left" on a live event page for six hours.

### When you genuinely must stub

Some code cannot be split: a callback filtering \`the_content\`, a sanitiser leaning on \`wp_kses_post\`. Brain Monkey fakes the function layer.

\`\`\`php
use Brain\\Monkey;
use Brain\\Monkey\\Functions;

protected function setUp(): void {
    parent::setUp();
    Monkey\\setUp();
    Functions\\stubs( [ 'esc_html' => null, '__' => null ] );
}

protected function tearDown(): void {
    Monkey\\tearDown();
    parent::tearDown();
}
\`\`\`

A \`null\` in \`stubs()\` means "return the first argument unchanged", which is exactly what escaping and translation do when nothing is configured.

Skip \`Monkey\\tearDown()\` and the failure will not surface in this file. The stubs stay registered, and some unrelated test three files later fails, or worse, passes for a reason you never intended. Alphabetical file order picks the victim, so it moves when somebody renames a test class.

### What this layer will never catch

| Question | Answered by a unit test? |
|---|---|
| Is the arithmetic right? | Yes |
| Is \`_cortex_seats\` the key the save handler writes? | No |
| Does the meta box render for an editor? | No |
| Did a core function change its signature? | No |

A stubbed \`get_post_meta()\` returns whatever you told it to, forever. Rename the real meta key in the save handler and every unit test stays green while the badge on the live site reads "Sold out" for an empty venue. That blind spot is the whole reason the next layer exists.
      `,
        [
          q('A unit test calls cortex_event_badge( 42 ) directly, with no WordPress bootstrapped. What happens?', [
            'PHP fatals on a call to the undefined function get_post_meta()',
            'It returns an empty string because no meta rows exist yet',
            'It returns \'Tickets available\' from a default seat count of zero',
            'PHPUnit marks the test risky and skips the remaining assertions',
          ], 0, 'Nothing defines get_post_meta() unless WordPress is loaded, so the call is a fatal error, which is exactly why the decision logic is extracted into a class that takes two plain integers.'),
          q('A test class stubs esc_html() with Brain Monkey but never calls Monkey\\tearDown(). What is the most likely symptom?', [
            'The stubbed test fails on its very first assertion about output',
            'PHPUnit reports the whole suite as passing with zero assertions',
            'An unrelated test in another file later fails or passes wrongly',
            'Composer autoloading throws a duplicate function declaration error',
          ], 2, 'The stub stays registered for the rest of the process, so the damage shows up in whichever test file runs next, which is why the failure appears to move when someone renames a class.'),
          q('Your unit suite stubs get_post_meta() to return \'50\'. Someone renames the meta key the save handler writes. What does the unit suite report?', [
            'A failure, because the stubbed key no longer matches the request',
            'Nothing at all, because it still passes without reading real meta',
            'A risky test warning about a stub that was never invoked',
            'A deprecation notice raised by the stubbing library itself',
          ], 1, 'Stubs return whatever you configured regardless of what the real code stores, so a renamed meta key is invisible to this layer and needs an integration test to catch it.'),
        ]
      ),
      lesson('Integration Tests With the WordPress Test Suite', 13, `
Someone renames \`_cortex_seats\` to \`_cortex_capacity\` in the save handler and misses the reader. All 380 unit tests pass, because they never touched a database. The site now shows every event as sold out. An integration test would have caught it in the second it takes to write and read one meta row.

Integration tests boot a real WordPress. Real hooks fire, real queries run, real capabilities apply.

### Installing the suite, carefully

\`\`\`bash
composer require --dev phpunit/phpunit:^9.6 wp-phpunit/wp-phpunit \\
  yoast/phpunit-polyfills
bash bin/install-wp-tests.sh cortex_tests root '' 127.0.0.1 6.5
\`\`\`

Read that command twice. The database you name there has every table dropped and rebuilt on the first run. People point it at the database behind their working dev site, lose six weeks of content, and there is nothing to restore from. Give it a name that could never be anything else, and use a MySQL user that cannot see your real schemas.

### Bootstrap in the right order

\`\`\`php
$tests_dir = getenv( 'WP_TESTS_DIR' ) ?: '/tmp/wordpress-tests-lib';
require_once $tests_dir . '/includes/functions.php';

tests_add_filter( 'muplugins_loaded', static function () {
    require dirname( __DIR__ ) . '/cortex-events.php';
} );

require $tests_dir . '/includes/bootstrap.php';
\`\`\`

Load the plugin after \`bootstrap.php\` instead and \`init\` has already fired, so \`register_post_type()\` never runs. Every query for \`cortex_event\` then returns nothing and the failures read like a broken database rather than a misordered require.

### Factories, and the rollback that hides things

\`\`\`php
class Test_Event_Meta extends WP_UnitTestCase {

    public function test_save_handler_persists_the_seat_count(): void {
        wp_set_current_user( self::factory()->user->create( [ 'role' => 'editor' ] ) );
        $id = self::factory()->post->create( [ 'post_type' => 'cortex_event' ] );

        $_POST['cortex_seats'] = '120';
        $_POST['cortex_nonce'] = wp_create_nonce( 'cortex_save_event' );

        do_action( 'save_post', $id, get_post( $id ), true );

        $this->assertSame( '120', get_post_meta( $id, '_cortex_seats', true ) );
    }
}
\`\`\`

\`WP_UnitTestCase\` wraps each test in a MySQL transaction and rolls it back at teardown, so the 400 posts one test creates are invisible to the next. Auto increment counters keep climbing regardless, so never assert on a literal post ID.

Three things do not roll back, and they cause the flakiest failures you will meet here:

| Leaks between tests | Why |
|---|---|
| Files written to \`wp-content/uploads\` | The filesystem is outside the transaction |
| Static properties on your own classes | PHP memory, not MySQL |
| Anything that issues an explicit \`COMMIT\` | It ends the wrapping transaction |

A settings singleton caching values in a static array will serve test one's configuration to test nine, and the fix is a \`reset()\` method your tests can call.

### Testing the parts only WordPress has

\`\`\`php
$request = new WP_REST_Request( 'GET', '/cortex/v1/events' );
$request->set_param( 'per_page', 2 );
$response = rest_do_request( $request );

$this->assertSame( 200, $response->get_status() );
$this->assertCount( 2, $response->get_data() );
\`\`\`

Then the version that matters more: log in a subscriber, fire the write route, assert a 403. One test proves your \`permission_callback\` is doing its job, which is worth more than a page of comments claiming it does.

Pretty permalinks are off in a fresh test install. Add \`$this->set_permalink_structure( '/%postname%/' );\` to \`setUp()\` or \`get_permalink()\` hands back \`/?post_type=cortex_event&p=41\` and your URL assertion fails for a reason that has nothing to do with your code.

Two helpers are worth knowing early. \`setExpectedIncorrectUsage( 'register_post_type' )\` lets a test pass while core complains on purpose, and \`setExpectedDeprecated()\` does the same for deprecated calls. Without them, any \`_doing_it_wrong()\` notice inside the code under test fails the test outright, which is exactly the behaviour you want as a default.

Keep this layer for anything that crosses a boundary: hooks firing in order, meta round trips, query arguments, capability checks, REST shapes. Arithmetic stays downstairs where it runs in microseconds.
      `,
        [
          q('install-wp-tests.sh is run with the database name of your working development site. What happens on the first test run?', [
            'The suite refuses to start and warns that the database is not empty',
            'The suite runs read only against a copy of the existing schema',
            'A second table prefix is created and your own data is left alone',
            'Every table is dropped and rebuilt, destroying the site content',
          ], 3, 'The WordPress test suite installs a fresh site into whatever database it is given, dropping the existing tables first, so it must only ever point at a dedicated test database.'),
          q('One test creates 400 posts with the factory and asserts a count. Why does the next test still see an empty site?', [
            'WP_UnitTestCase wraps each test in a transaction and rolls it back',
            'PHPUnit runs every test method in a separate isolated PHP process',
            'The factory writes into a temporary table that is dropped at teardown',
            'A wp_cache_flush() call at teardown removes the rows from the database',
          ], 0, 'Each test method runs inside a MySQL transaction that is rolled back after the method finishes, which is why database state does not leak but auto increment IDs keep climbing.'),
          q('A test registers cortex_event with a rewrite slug of \'events\', then asserts get_permalink() returns a pretty URL, but receives /?post_type=cortex_event&p=41. Why?', [
            'Rewrite rules must be flushed manually on every request during tests',
            'A fresh test install uses plain permalinks until you set a structure',
            'get_permalink() only resolves once the template loader has been run',
            'Custom post type slugs are ignored while WP_DEBUG is switched on',
          ], 1, 'The test install starts with the plain permalink structure, so calling set_permalink_structure() in setUp is required before any assertion about pretty URLs can pass.'),
        ]
      ),
      lesson('End-to-End Tests in a Real Browser', 13, `
Both earlier layers are green. An editor hits Update and the block editor says "Updating failed. The response is not a valid JSON response." What actually happened: a PHP notice from an unrelated plugin printed one line before the REST body, so the JSON is preceded by garbage. \`rest_do_request()\` never saw it, because that function returns an object and never touches output buffering. Only a browser reproduces this.

That class of bug is why the third layer exists, and why it is worth its cost despite being slow.

### wp-env plus Playwright

\`\`\`bash
npm install --save-dev @wordpress/env @wordpress/e2e-test-utils-playwright @playwright/test
npx wp-env start
npx playwright install chromium
\`\`\`

\`\`\`json
{
  "core": "WordPress/WordPress#6.5",
  "plugins": [ "." ],
  "config": { "WP_DEBUG": true, "WP_DEBUG_DISPLAY": false }
}
\`\`\`

\`\`\`js
// playwright.config.js
export default {
  testDir: './tests/e2e',
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:8889', trace: 'on-first-retry' },
};
\`\`\`

\`workers: 1\` is not timidity. Parallel workers share one WordPress database, so two tests deleting posts at once produce failures that never reproduce locally.

### One journey, end to end

\`\`\`js
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'event availability', () => {
  test.beforeEach( async ( { requestUtils } ) => {
    await requestUtils.deleteAllPosts();
  } );

  test( 'a nearly full event shows the urgency badge', async ( { admin, editor, page } ) => {
    await admin.createNewPost( { postType: 'cortex_event', title: 'Autumn Summit' } );
    await page.getByLabel( 'Total seats' ).fill( '50' );
    await page.getByLabel( 'Seats sold' ).fill( '47' );
    await editor.publishPost();

    await page.goto( '/?cortex_event=autumn-summit' );
    await expect( page.getByText( 'Only 3 left' ) ).toBeVisible();
  } );
} );
\`\`\`

One test just covered the meta box markup, the save handler, the nonce, the meta keys, the template, and the fact that no stray output corrupted the save request.

### Selectors that survive an update

\`\`\`js
await page.click( '.editor-post-publish-panel__toggle' );   // breaks on 6.6
\`\`\`

Gutenberg renames internal class names between releases. A suite pinned to them goes red on a WordPress update that broke nothing at all, and after the second time nobody believes the suite.

\`\`\`js
await page.getByRole( 'button', { name: 'Publish' } ).click();
\`\`\`

Roles and accessible names are part of the contract with screen readers, so they move far less. A test that cannot find "Publish" by name is telling you something true about your own markup as well.

### Never sleep

\`\`\`js
await page.waitForTimeout( 500 );
await expect( page.getByText( 'Post published' ) ).toBeVisible();
\`\`\`

Delete the first line. Playwright's \`expect\` retries the locator until it passes or the timeout expires, which adapts to a loaded CI runner; a fixed sleep does not. Do the arithmetic on why this matters: a sleep that flakes one run in twenty sounds harmless, but across 40 tests the chance of a fully green run is 0.95 to the power of 40, about 13 percent. Seven runs in eight go red for no reason, the team starts re-running the pipeline reflexively, and the day a real regression appears nobody looks.

### Isolation is your job here

Nothing rolls back. One install, one database, tests running in file order, each leaving its posts behind. \`requestUtils.deleteAllPosts()\` in a \`beforeEach\` is the minimum, and any test that changes a setting must put it back.

### Keep the layer small

| Layer | Tests | Runtime |
|---|---|---|
| Unit | 380 | 0.6s |
| Integration | 120 | 55s |
| Browser | 8 | 3m 40s |

Eight journeys, not two hundred: publish an event, book the last seat, confirm an expired event disappears from the archive, save the settings screen, load the front page with a console error listener attached. Everything else belongs one layer down, where it runs a hundred times faster and tells you exactly which function broke.
      `,
        [
          q('Which way of clicking the Publish button is most likely to still work after the next WordPress release?', [
            'page.locator( \'.editor-post-publish-panel__toggle\' ).click()',
            'page.getByRole( \'button\', { name: \'Publish\' } ).click()',
            'page.locator( \'#editor > div > div:nth-child(3) button\' ).click()',
            'page.locator( \'[class*="publish-panel"] button\' ).first().click()',
          ], 1, 'Roles and accessible names are part of the editor\'s contract with assistive technology and change rarely, while internal class names and DOM positions are renamed freely between releases.'),
          q('A test waits with page.waitForTimeout( 500 ) before asserting that a saved notice appeared. What does that cost you?', [
            'Playwright refuses to run any test that contains a fixed wait call',
            'The wait is ignored in headless mode, so the test can never pass',
            'It passes locally and fails at random on a loaded CI runner',
            'Each retry doubles the wait until the suite exceeds its time budget',
          ], 2, 'A fixed sleep is calibrated to your machine and gives no extra time to a slower runner, so the test becomes intermittently red and the whole suite loses credibility.'),
          q('Browser tests all run against one WordPress install. What follows for a suite where every test publishes a post?', [
            'State carries between tests, so each one has to clean up after itself',
            'Each test file gets a fresh database because wp-env resets between files',
            'Playwright rolls back the database transaction once a test finishes',
            'Posts created during a test stay as drafts invisible to later tests',
          ], 0, 'There is no transaction wrapping browser tests, so posts, options and uploads persist into every later test unless the suite deletes them explicitly.'),
        ]
      ),
      lesson('PHPStan, Stubs, and the Version Matrix', 13, `
PHPCS read \`$post = get_post( $id ); echo esc_html( $post->post_title );\` and had nothing to say. It checks style, escaping and patterns, and by those rules the line is perfect. It is also a fatal error waiting for the first trashed event, because \`get_post()\` returns \`null\` when the ID does not resolve. PHPStan knows that, because it reads the declared return type.

### Install and point it at core

\`\`\`bash
composer require --dev phpstan/phpstan szepeviktor/phpstan-wordpress \\
  php-stubs/wordpress-stubs
\`\`\`

\`\`\`neon
# phpstan.neon.dist
includes:
    - vendor/szepeviktor/phpstan-wordpress/extension.neon
parameters:
    level: 5
    paths:
        - src
        - cortex-events.php
    excludePaths:
        - tests/*
\`\`\`

Without the stubs package, PHPStan has never heard of \`get_post()\` or \`WP_Post\` and buries you in three thousand unknown symbol errors. The stubs are also where \`WP_Post::$post_title\` gets a type, which is what makes the null check above enforceable.

### The level ladder

| Level | What it starts reporting |
|---|---|
| 0 | Unknown functions, classes and methods |
| 2 | Unknown methods on any expression, wrong docblocks |
| 5 | Argument types at every call site |
| 6 | Missing parameter and return type hints |
| 8 | Method calls on a value that could be null |
| 9 | Strict treatment of \`mixed\` |

Level 5 on a real plugin surfaces roughly the same four findings every time: null from \`get_post()\`, \`mixed\` from \`get_option()\`, a filter callback that assumed a string and can receive an array, and a \`$wpdb->get_row()\` used without checking for null.

Fix the code, do not silence the tool:

\`\`\`php
$post = get_post( $id );
if ( ! $post instanceof WP_Post ) {
    return '';
}
echo esc_html( $post->post_title );
\`\`\`

### The baseline, and the one rule that keeps it honest

Run this on a plugin nobody has ever analysed and you get 2,100 errors. Nobody fixes 2,100 errors this sprint, so freeze them:

\`\`\`bash
composer exec -- phpstan analyse --generate-baseline
\`\`\`

Every existing error goes into \`phpstan-baseline.neon\` and CI turns green. The mechanism does the work from there: CI runs the analysis without regenerating, so any error your branch introduces is not in the baseline and fails the build. New code is held to level 5 from its first commit while the backlog sits still. The rule is simply that the baseline may shrink and may never grow, and a reviewer who sees added lines in that file should ask why.

Extending other people's code needs their types too. \`WC()->cart\` is an unknown function until you add \`php-stubs/woocommerce-stubs\`, and the same applies to ACF and Yoast.

### The version matrix

\`\`\`yaml
strategy:
  fail-fast: false
  matrix:
    php: [ '8.1', '8.2', '8.3' ]
    wp: [ '6.5', 'latest' ]
    include:
      - { php: '8.3', wp: 'trunk', experimental: true }
steps:
  - run: bash bin/install-wp-tests.sh cortex_tests root root 127.0.0.1 \${{ matrix.wp }}
  - run: composer exec -- phpunit
    continue-on-error: \${{ matrix.experimental == true }}
\`\`\`

The lowest PHP entry is the one that earns its keep. It is the version your least maintained customer host still runs, and it is the only job that catches an enum or a readonly property you typed without thinking on a machine running 8.3.

Watch the cost. Add \`multisite: [ 0, 1 ]\` and six jobs become twelve, each burning about 90 seconds installing WordPress before the first test runs. Keep pull requests on a three job fast lane, lowest PHP, latest WordPress, plus PHPStan, and schedule the full matrix nightly. Trunk stays on \`continue-on-error\` so a bug in an unreleased WordPress beta warns you without blocking a release you need to ship this afternoon.
      `,
        [
          q('PHPStan reports that a property is accessed on WP_Post|null for the line echo get_post( $id )->post_title. What is the right response?', [
            'Add the line to the baseline file so the build goes green again',
            'Cast the returned value to an object before reading the property',
            'Lower the configured analysis level until the message disappears',
            'Check the return value is a WP_Post before reading the property',
          ], 3, 'The message describes a real fatal error for a trashed or missing ID, so guarding the null case fixes the bug instead of hiding a warning that was correct.'),
          q('You analyse a plugin that calls WC() and PHPStan reports an unknown function. What does that actually mean?', [
            'WooCommerce itself has to be installed inside the vendor directory',
            'The WooCommerce stub package is missing from the analysis setup',
            'The configured level is too low to resolve functions from plugins',
            'The call needs wrapping in function_exists() before it will analyse',
          ], 1, 'PHPStan only knows the symbols it can see, so third party APIs need their own stub package the same way core functions need the WordPress stubs.'),
          q('Why mark the job that tests against WordPress trunk with continue-on-error: true?', [
            'Trunk installs are slower and the job would otherwise hit its timeout',
            'It frees the runner sooner so the other matrix jobs start in parallel',
            'A bug in an unreleased beta should warn you, not block your release',
            'GitHub Actions requires the flag on any entry added through include',
          ], 2, 'Trunk is unreleased code that can break for reasons outside your plugin, so you want the early signal without giving an upstream beta the power to stop your shipping.'),
        ]
      ),
      ],
      [
      q('An endpoint returns 200 with correct JSON in an integration test, yet the block editor shows "The response is not a valid JSON response" when an editor hits Update. Which layer catches that?', [
        'A unit test asserting on a stubbed WP_REST_Response object',
        'PHPStan raised to level 8 across the whole plugin source',
        'PHPCS with the WordPress-Extra ruleset applied to the branch',
        'An end to end test driving the editor in a real browser',
      ], 3, 'Stray output printed before the JSON body only corrupts a real HTTP response, and rest_do_request returns an object without going through output buffering, so only a browser reproduces the failure.'),
      q('A suite has 380 unit tests, 120 integration tests and 8 browser tests. A branch renames the meta key the save handler writes but not the key the reader uses. Which layer fails first and most cheaply?', [
        'The unit tests, because they run in well under a second',
        'The integration tests, because they write and read real meta',
        'The browser tests, because they load the rendered event page',
        'PHPStan, because the meta key is declared as a typed constant',
      ], 1, 'Unit tests stub the meta functions and never notice a key change, while integration tests round trip through the real database and fail in under a minute.'),
      q('A ten year old plugin produces 2,100 PHPStan errors on its first run. Which approach keeps the tool genuinely useful?', [
        'Generate a baseline, then fail the build if new errors appear',
        'Run the analysis only on the release branch once every month',
        'Drop the level to 0 until the existing backlog has been cleared',
        'Exclude the three directories responsible for most of the errors',
      ], 0, 'A baseline freezes the historical debt while every new error still fails CI, so fresh code is held to the full standard from its first commit.'),
      q('A plugin ships with a green test suite and a clean PHPCS run, then fatals on a customer host during activation. What was most likely missing from the pipeline?', [
        'A nonce verification step on the plugin\'s own settings form',
        'A persistent object cache configured in the test environment',
        'The oldest supported PHP version in the matrix and in testVersion',
        'Wider browser coverage of the plugin\'s admin configuration screens',
      ], 2, 'Syntax and functions introduced in a newer PHP release parse fine on a modern development machine, so only a job running the oldest supported version, backed by a matching testVersion range, catches them before a customer does.'),
      ]
    ),
    chapter(
      'Architecture, Dependencies, and Other People\'s Plugins',
      'Composer, namespaces, and dependency injection applied to a plugin that has outgrown one file, plus the rules for extending code you do not own without ever forking it.',
      [
      lesson('Composer, Namespaces, and Autoloading', 13, `
The main file of a plugin that has been alive for three years usually opens with forty \`require_once\` lines in an order nobody dares touch, because file 31 defines a class that file 12 extends. Add a class, edit two files. Rename one, and you get a fatal on production that never appeared locally.

Composer removes the whole category of problem by making the file path a function of the class name.

### One mapping, in composer.json

\`\`\`json
{
  "name": "cortex/events",
  "type": "wordpress-plugin",
  "require": { "php": ">=8.1" },
  "autoload": {
    "psr-4": { "Cortex\\\\Events\\\\": "src/" }
  }
}
\`\`\`

Run \`composer dump-autoload\` and the rule is mechanical from then on. \`Cortex\\Events\\Admin\\SettingsPage\` lives in \`src/Admin/SettingsPage.php\`. \`Cortex\\Events\\Rest\\EventsController\` lives in \`src/Rest/EventsController.php\`. Nothing is required by hand again.

Wire it once, at the top of the main plugin file:

\`\`\`php
<?php
/**
 * Plugin Name: Cortex Events
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

$autoload = __DIR__ . '/vendor/autoload.php';
if ( ! is_readable( $autoload ) ) { return; }
require_once $autoload;
\`\`\`

The guard is not decoration. Ship a zip whose build step failed to produce \`vendor/\`, and the \`require\` fatals before WordPress can render the admin, so the customer cannot even deactivate the plugin that is breaking their site. Returning early gives you a dead plugin instead of a dead site.

### The case bug that only bites on Linux

PSR-4 maps class name to path character for character. \`Cortex\\Events\\Rest\\EventsController\` needs \`src/Rest/EventsController.php\`, not \`src/REST/EventsController.php\`. macOS and Windows filesystems are case insensitive, so both spellings resolve on your laptop. Production runs ext4, which is not, and the class quietly fails to load with a "Class not found" that nobody can reproduce.

Catch it in CI:

\`\`\`bash
composer dump-autoload --strict-psr
\`\`\`

That exits non-zero on any file whose declared class does not match its path. Put it in the lint job next to \`phpcs\`.

### Callbacks are strings, and strings do not see your namespace

This is the mistake almost everyone makes on their first namespaced plugin:

\`\`\`php
namespace Cortex\\Events;

add_action( 'init', 'register_event_type' );   // broken
function register_event_type() { /* ... */ }
\`\`\`

PHP resolves *function calls* against the current namespace, but \`add_action\` is handed a plain string that WordPress later passes to \`call_user_func\`. It looks for a global function named \`register_event_type\`, finds nothing, and throws. The error surfaces during \`init\`, nowhere near the line that caused it.

Write the qualified name, or better, hand over something the parser can check:

\`\`\`php
add_action( 'init', __NAMESPACE__ . '\\\\register_event_type' );
add_action( 'init', [ Registrar::class, 'register' ] );
add_action( 'init', register_event_type( ... ) );  // PHP 8.1 first class callable
\`\`\`

The third form is the one to prefer. Rename the function and PHP tells you immediately, instead of a hook silently going quiet.

### Build for production, and decide about vendor

\`\`\`bash
composer install --no-dev --optimize-autoloader --classmap-authoritative
\`\`\`

\`--no-dev\` keeps PHPUnit and PHPCS out of the shipped artifact. \`--optimize-autoloader\` flattens the PSR-4 rules into a class-to-file array, removing a filesystem check per class on every request. \`--classmap-authoritative\` goes further: a class absent from the map is treated as nonexistent, which is only safe when the map is generated at build time.

| Question | Answer for a plugin you distribute |
|---|---|
| Commit \`vendor/\`? | No. Build it in CI, put it in the release zip. |
| Commit \`composer.lock\`? | Yes, always. It pins the exact versions you tested. |
| Run \`composer install\` on the server? | No. Its PHP version may resolve differently. |

A site repository is the one place the opposite is defensible: some teams commit \`vendor/\` so deployment is a file sync with no build step at all. Pick one convention per repository and write it in the README, because a half committed vendor directory produces merge conflicts that nobody can review honestly.
      `,
        [
          q('A file declares `namespace Cortex\\Events;` and calls `add_action( \'init\', \'register_event_type\' );` for a function defined below it. What happens?', [
            'The callback runs, because PHP resolves callback strings against the current namespace',
            'WordPress throws when init fires, because the string names a global function that does not exist',
            'Composer\'s autoloader loads the namespaced function before the init hook is reached',
            'The callback runs on admin requests only, where the namespace has already been imported',
          ], 1, 'PHP resolves function calls against the current namespace, but add_action stores a plain string that is later passed to call_user_func, which looks in the global namespace and finds nothing.'),
          q('Your plugin runs fine on your Mac, but on the Linux production server one class fails to load with a class not found error. Which cause fits best?', [
            'composer.lock was never committed, so the server installed different package versions',
            'vendor/autoload.php was left out of the release zip by the build script',
            'The optimised classmap was built with --no-dev and dropped the class',
            'A folder is named src/REST while the namespace segment is Rest, and ext4 is case sensitive',
          ], 3, 'PSR-4 matches the class name to the path character for character, and only a case sensitive filesystem such as ext4 exposes a spelling mismatch that a Mac silently tolerates.'),
          q('Why should the main plugin file check is_readable() on vendor/autoload.php and return early rather than requiring it unconditionally?', [
            'A missing autoloader would fatal on every request, so the customer cannot even reach the admin',
            'Composer regenerates the autoloader on each request unless the file is already present',
            'WordPress loads plugin bootstrap files twice, so the require would run a second time',
            'Reading the file first warms the opcache entry before any class is actually needed',
          ], 0, 'An unconditional require of a missing file is a fatal error that runs before WordPress renders anything, so returning early degrades to a dead plugin instead of a dead site.'),
        ]
      ),
      lesson('Objects, Dependency Injection, and a Testable Bootstrap', 13, `
Here is a pattern you will find in a very large share of plugins on wordpress.org:

\`\`\`php
class Cortex_Events {
	private static $instance;
	private $api_key;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		$this->api_key = get_option( 'cortex_api_key' );
		add_action( 'init', [ $this, 'register_post_type' ] );
	}
}
Cortex_Events::get_instance();
\`\`\`

It works in production and it is close to untestable, for one reason: the constructor reads the database and registers hooks. You cannot build the object without a live WordPress. Worse, the static property survives between test methods, so the second test inherits whatever the first one did to the instance.

### Construction and registration are separate jobs

A constructor takes what the object needs and stores it. Nothing else. A separate \`register()\` method attaches hooks.

\`\`\`php
namespace Cortex\\Events;

final class EventRegistrar {
	public function __construct(
		private readonly Settings $settings
	) {}

	public function register(): void {
		add_action( 'init', [ $this, 'register_post_type' ] );
		add_filter( 'the_content', [ $this, 'append_venue' ], 20 );
	}

	public function append_venue( string $content ): string {
		if ( ! $this->settings->show_venue() ) {
			return $content;
		}
		return $content . '<p class="venue">' . esc_html( $this->settings->venue() ) . '</p>';
	}
}
\`\`\`

\`append_venue\` is now a pure function of its argument and one injected object. A test writes \`new EventRegistrar( new FakeSettings( 'Hall B' ) )\`, calls the method, asserts on the returned string, and finishes in under a millisecond with no database in sight.

### A container is a factory with a memory

Skip the framework. Twenty lines covers most plugins:

\`\`\`php
final class Container {
	private array $factories = [];
	private array $made = [];

	public function set( string $id, callable $factory ): void {
		$this->factories[ $id ] = $factory;
	}

	public function get( string $id ): object {
		return $this->made[ $id ] ??= ( $this->factories[ $id ] )( $this );
	}
}
\`\`\`

The plugin file then does nothing but wiring:

\`\`\`php
$c = new Container();
$c->set( Settings::class, fn() => new Settings( 'cortex_events' ) );
$c->set( EventRegistrar::class, fn( $c ) => new EventRegistrar( $c->get( Settings::class ) ) );

add_action( 'plugins_loaded', fn() => $c->get( EventRegistrar::class )->register() );
\`\`\`

Two things fall out of that. Every dependency in the plugin is visible in one file rather than buried across twelve constructors. And because the factories are closures, nothing is built until something asks for it: a REST controller that only matters on \`/wp-json/\` requests is never constructed during a page view.

The laziness is worth real money. Instantiating thirty objects and reading eight options on every \`admin-ajax.php\` heartbeat, sixty times an hour for every open browser tab, is a measurable share of a busy site's PHP time and it does nothing.

### The closure trap

WordPress builds an internal id for each callback so it can be removed later. For \`[ $object, 'method' ]\` it derives that id from the object's \`spl_object_hash\`, so removal works as long as you can reach the same instance:

\`\`\`php
remove_filter(
	'the_content',
	[ $container->get( EventRegistrar::class ), 'append_venue' ],
	20
);
\`\`\`

A closure has no stable identity at all. Register a hook with an anonymous function and nobody, including you, can ever unhook it without surgery on the \`$wp_filter\` global that breaks at the next refactor. Use closures in the bootstrap, where you own both sides. Use \`[ $object, 'method' ]\` for anything a site specific plugin might one day need to remove.

### Static helpers are fine, static state is not

\`Dates::to_utc( $stamp )\` holds no properties and is really a namespaced function, so it tests fine. \`Cache::$items\` is global mutable state wearing a class as a disguise. One test leaves a value in it, an unrelated test file fails, and only when the suite happens to run in a particular order.
      `,
        [
          q('A plugin\'s private constructor calls get_option() and add_action(), and the object is cached in a static property. What does that cost you in tests?', [
            'Static properties reset between test methods, so the object is rebuilt more often than needed',
            'add_action cannot run twice in one request, so the second test silently does nothing',
            'Every test needs a live database, and the cached static instance leaks state into later tests',
            'PHPUnit cannot construct a class with a private constructor, so no test can be written',
          ], 2, 'Reading options in the constructor forces a real WordPress and database to exist, and a static instance is not torn down between test methods, so state written by one test is visible to the next.'),
          q('A site specific plugin needs to unhook a callback your plugin registered. Which registration makes that impossible?', [
            'add_action( \'the_content\', [ $registrar, \'append_venue\' ], 20 )',
            'add_action( \'the_content\', \'Cortex\\Events\\append_venue\', 20 )',
            'add_action( \'the_content\', [ Registrar::class, \'append_venue\' ], 20 )',
            'add_action( \'the_content\', function ( $c ) { return $c . \'<p>Hall B</p>\'; }, 20 )',
          ], 3, 'WordPress needs a reproducible identifier for the callback, and an anonymous function has none, so remove_action can never be given a matching value for a closure.'),
          q('What do you actually gain by moving the add_action() calls out of the constructor into a separate register() method?', [
            'Hooks can fire before plugins_loaded, which a constructor is not able to do',
            'A test can construct the object and call its methods without any hook being attached',
            'The container becomes unnecessary, because objects now register themselves on demand',
            'WordPress caches the object between requests once its hooks are declared separately',
          ], 1, 'Separating the two jobs means constructing the object has no side effects, so a test can build it with fake collaborators and assert on a method\'s return value in isolation.'),
        ]
      ),
      lesson('Extending a Plugin You Do Not Own', 13, `
A client's checkout lost its "Delivery notes" field overnight. Nobody had deployed anything. What happened was a WooCommerce auto update, which replaced \`plugins/woocommerce/templates/checkout/form-shipping.php\`, the file a contractor had edited eighteen months earlier and told nobody about.

Every plugin update is a full directory replacement. Anything you change inside somebody else's plugin folder is temporary by design.

### Find the seam before writing a line

Well built plugins are mostly seams. Before concluding there is no hook, go and count them:

\`\`\`bash
grep -rn "apply_filters(\\|do_action(" wp-content/plugins/woocommerce/includes | wc -l
# roughly 1,300 on a recent release

grep -rn "apply_filters( 'woocommerce_checkout" wp-content/plugins/woocommerce/includes
\`\`\`

Query Monitor's hooks panel does the same job at runtime and, more usefully, shows what is already attached and at which priority. That matters, because the fix is often a priority number rather than a new function.

### Unhooking, and why it fails the first time

\`\`\`php
// Broken: this runs while your plugin file is still loading.
remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
\`\`\`

Nothing changes. Plugins load in alphabetical order of their directory, so \`cortex-events\` runs before \`woocommerce\`, and you are removing a callback that has not been added yet. \`remove_action\` returns \`false\` and says nothing at all.

\`\`\`php
// Fixed: wait until every plugin has registered.
add_action( 'wp_loaded', function () {
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
} );
\`\`\`

Two further rules. The priority must match exactly: a callback added at 15 is untouched by a \`remove_action\` call that omits the argument and defaults to 10. And for an object method you need the identical instance, which is why plugins that expose theirs through \`WC()->cart\` are far easier to extend than ones hiding everything behind private statics.

### Templates get overridden, never edited

WooCommerce, Easy Digital Downloads and most mature plugins load templates through a locator that checks your theme first.

| Plugin file | Your override |
|---|---|
| \`woocommerce/templates/checkout/form-shipping.php\` | \`themes/cortex/woocommerce/checkout/form-shipping.php\` |
| \`woocommerce/templates/loop/price.php\` | \`themes/cortex/woocommerce/loop/price.php\` |

The path after \`templates/\` is preserved exactly. The cost is that your copy is frozen at the version you took it from, so check Site Health after upgrades: WooCommerce lists every overridden template that has fallen behind, with the version numbers.

### When there genuinely is no hook

In order of preference:

1. Open a pull request upstream adding the filter. It is usually a three line change and maintainers accept them more often than people expect.
2. Filter something adjacent. A \`pre_option_*\` filter changes a setting without touching the code that reads it.
3. Wrap the output. \`ob_start()\` around an action, then a targeted replacement on the buffer, is ugly but it survives updates.
4. Fork, last of all, and only with a written plan for getting back off the fork.

Editing in place is not on that list. Neither is disabling automatic updates so your edit survives, which swaps a maintenance problem for a security one.

### The check that fatals on the front end

\`\`\`php
if ( is_plugin_active( 'woocommerce/woocommerce.php' ) ) { /* ... */ }
\`\`\`

\`is_plugin_active()\` is defined in \`wp-admin/includes/plugin.php\`, which is not loaded on front end requests. This passes every admin screen you test and then takes the site down for logged out visitors with an undefined function error. Use \`class_exists( 'WooCommerce' )\`, or hang your code on the plugin's own ready signal:

\`\`\`php
add_action( 'woocommerce_loaded', [ $registrar, 'register' ] );
\`\`\`

\`file_exists()\` on the plugin folder is no better: the directory can be present while the plugin is deactivated, so the guard passes and the class still is not there.
      `,
        [
          q('Your plugin lives in cortex-events and calls remove_action() for a WooCommerce template callback at file load time. Why does the front end look unchanged?', [
            'remove_action is only honoured inside the admin, so front end output keeps the callback',
            'Plugins load alphabetically, so WooCommerce has not added that callback when you remove it',
            'WooCommerce re-adds all of its template hooks on wp_loaded, undoing your removal',
            'remove_action requires the priority argument to be omitted for plain function names',
          ], 1, 'Directory order puts cortex-events before woocommerce, so the removal runs against a hook list that does not yet contain the callback, and remove_action just returns false.'),
          q('Which way of checking that WooCommerce is present is safe to run on a front end request?', [
            'is_plugin_active( \'woocommerce/woocommerce.php\' ), which reads the active plugins option',
            'file_exists( WP_PLUGIN_DIR . \'/woocommerce/woocommerce.php\' ) at plugin load time',
            'in_array( \'woocommerce/woocommerce.php\', wp_get_active_network_plugins(), true )',
            'class_exists( \'WooCommerce\' ), or hooking onto the woocommerce_loaded action',
          ], 3, 'is_plugin_active lives in an admin only include and fatals on the front end, file_exists proves nothing about activation, and the network list misses single site activations, while class_exists tests what you actually care about.'),
          q('A contractor\'s edit to a WooCommerce product loop template vanished during an update. Where should that markup have been placed instead?', [
            'In plugins/woocommerce/templates/, with the change kept in a patch file',
            'In a mu-plugin that requires the edited template file directly at runtime',
            'In themes/cortex/woocommerce/, mirroring the path after templates/',
            'In wp-content/uploads/woocommerce-templates/, loaded from functions.php',
          ], 2, 'WooCommerce loads templates through a locator that checks the active theme first, so a copy under the theme\'s woocommerce folder at the same relative path wins and survives every plugin update.'),
        ]
      ),
      lesson('Bundled Dependencies and the Conflicts They Cause', 13, `
A client activates a booking plugin. The site returns a 500 and the log reads \`Call to undefined method GuzzleHttp\\Client::sendAsync()\`. Nothing about your plugin changed. Your plugin is the one that broke.

PHP keeps exactly one class table per request. \`GuzzleHttp\\Client\` can only mean one thing, and the winner is whichever autoloader resolved it first.

### Load order decides, and load order is alphabetical

Composer autoloaders register through \`spl_autoload_register\`, which appends to a queue. Plugins load alphabetically by directory, so \`booking-pro\` registers its autoloader before \`cortex-events\` registers yours. The first time any code touches \`GuzzleHttp\\Client\`, \`booking-pro/vendor/\` supplies it. Your code then runs against Guzzle 5 while expecting Guzzle 7.

The guard everyone reaches for does not help:

\`\`\`php
if ( ! class_exists( \\GuzzleHttp\\Client::class ) ) {
	require __DIR__ . '/vendor/autoload.php';   // useless
}
\`\`\`

\`class_exists\` returns \`true\`, and it is telling the truth. The class exists. It is simply the wrong one.

Find out whose copy won:

\`\`\`php
add_action( 'shutdown', function () {
	$r = new ReflectionClass( \\GuzzleHttp\\Client::class );
	error_log( 'Guzzle resolved from: ' . $r->getFileName() );
} );
\`\`\`

### Prefix what you ship

The fix is to stop calling your dependency by a name anybody else could use. PHP-Scoper and Strauss rewrite the namespace of everything under \`vendor/\` at build time:

\`\`\`json
{
  "extra": {
    "strauss": {
      "target_directory": "vendor-prefixed",
      "namespace_prefix": "Cortex\\\\Events\\\\Vendor\\\\",
      "classmap_prefix": "Cortex_Events_",
      "delete_vendor_files": true
    }
  }
}
\`\`\`

Your imports become \`Cortex\\Events\\Vendor\\GuzzleHttp\\Client\`, which nothing else on the site can collide with. Run it in CI, never commit the output, and keep the unprefixed \`vendor/\` for your development tools.

One exclusion matters. Do not prefix interfaces you expose in your own public API, such as \`Psr\\Log\\LoggerInterface\`, if you expect other plugins to hand you an implementation. Prefix it and their object no longer satisfies your type hint. Scoper's \`exclude-namespaces\` setting exists for that case.

### The cheaper answer is fewer dependencies

Most WordPress plugins never needed Guzzle in the first place.

| Package people bundle | What core already gives you |
|---|---|
| \`guzzlehttp/guzzle\` | \`wp_remote_get()\`, \`wp_remote_post()\` |
| \`ramsey/uuid\` | \`wp_generate_uuid4()\` |
| \`monolog/monolog\` for a file log | \`error_log()\` with \`WP_DEBUG_LOG\` |
| \`symfony/http-foundation\` | \`WP_REST_Request\`, \`WP_REST_Response\` |
| \`psr/simple-cache\` | \`wp_cache_get()\` and transients |

Every package you delete is a version conflict that can no longer happen, plus forty or so classes off the autoloader map.

### Even core's own libraries are not an API

WordPress bundles the Requests HTTP library. Version 6.2 moved it from Requests 1.x to 2.0, and \`Requests_Response\` became \`WpOrg\\Requests\\Response\`. Plugins that had reached past \`wp_remote_get()\` to the underlying class fatalled on upgrade across thousands of sites, and none of them had done anything wrong except trust an internal.

The rule generalises. Anything in \`wp-includes/\` that is not documented in the developer handbook can change in a point release. Use the wrapper functions, which are the contract.

Before adding any dependency, look at what it drags in behind it:

\`\`\`bash
composer show --tree | head -40
composer why-not php 8.4
\`\`\`

A logging package that pulls in three PSR interfaces and a polyfill is a very different proposition from the one file you could have written yourself in an afternoon.
      `,
        [
          q('Two active plugins each bundle their own copy of Guzzle at different versions. Which copy does GuzzleHttp\\Client resolve to?', [
            'Both, because Composer merges the two autoloaders into a single classmap at runtime',
            'The newer one, because Composer compares versions before registering the class',
            'Neither, because PHP refuses to load two packages declaring the same namespace',
            'Whichever autoloader was registered first, since PHP keeps one class per name',
          ], 3, 'PHP has a single class table per request, so the first autoloader to answer for that class name defines it for everyone, and plugin directory order decides who that is.'),
          q('Why does wrapping your require of vendor/autoload.php in `if ( ! class_exists( GuzzleHttp\\Client::class ) )` fail to protect you?', [
            'class_exists returns true for the other plugin\'s incompatible copy, so your code uses that',
            'class_exists skips autoloaders unless you pass true as its second argument',
            'The guard runs before plugins_loaded, when no autoloader has been registered yet',
            'class_exists is case sensitive for namespaced names, so the check never matches',
          ], 0, 'The guard only asks whether some class of that name exists, and one already does, so your autoloader never registers and your code runs against a version it was not written for.'),
          q('What does running PHP-Scoper or Strauss over your vendor directory actually change about the shipped code?', [
            'It strips packages that WordPress core already ships, shrinking the release zip',
            'It rewrites bundled classes into a namespace only your plugin uses, so nothing collides',
            'It pins every dependency to one shared version across all plugins on the site',
            'It delays loading of vendor classes until a hook that needs them actually fires',
          ], 1, 'Prefixing renames every bundled class into a namespace unique to your plugin, so no other plugin\'s copy can ever resolve to the same name and win the race.'),
        ]
      ),
      ],
      [
      q('Which single change does most to make a plugin class unit testable without a database?', [
        'Caching the instance in a static property so every test reuses one object',
        'Calling get_option() in the constructor and storing the result on the object',
        'Taking a Settings object as a constructor argument and hooking in a register() method',
        'Registering all of the class\'s hooks inside the constructor so none are forgotten',
      ], 2, 'Injecting collaborators lets a test pass in a fake, and keeping hook registration in a separate method means constructing the object has no side effects at all.'),
      q('Which command produces the vendor directory that belongs in a distributed plugin\'s release zip?', [
        'composer update --with-all-dependencies',
        'composer install --no-dev --optimize-autoloader',
        'composer dump-autoload --dev --strict-psr',
        'composer require --prefer-source --update-no-dev',
      ], 1, 'A release build installs the versions pinned in composer.lock, leaves development tools out, and flattens the PSR-4 rules into a classmap so no filesystem lookup happens per class.'),
      q('The plugin you need to modify has no hook at the exact point you care about. Which response is defensible?', [
        'Edit the plugin file and record the change in the deployment notes',
        'Copy the plugin into your own repository and maintain it as a fork',
        'Send a pull request adding the filter, and wrap the output meanwhile',
        'Turn off automatic updates for that plugin so your edit is not replaced',
      ], 2, 'Upstream filters are usually small additions that maintainers accept, and a buffer based wrapper is an ugly but update safe bridge until the release lands.'),
      q('Activating an unrelated plugin makes yours throw a fatal about a missing method on a vendor class. What is the likely cause?', [
        'The other plugin\'s autoloader resolved a shared vendor class name first',
        'Your composer.lock pinned a version the server\'s PHP cannot parse',
        'Both plugins registered the same hook name at the same priority',
        'Your optimised classmap has gone stale and points at deleted files',
      ], 0, 'Two plugins bundling the same unprefixed package share one class name, and the copy loaded first wins, so your code calls a method that version never had.'),
      ]
    ),
    chapter(
      'Data, Jobs, and the Object Cache',
      'What to do when post meta, WP-Cron, and the options table stop coping, from your own database tables to queued background work over millions of rows.',
      [
      lesson('Custom Tables and When Post Meta Runs Out', 13, `
A ticketing site stored 38,000 events as a custom post type, each carrying twelve meta keys. That is 456,000 rows in \`wp_postmeta\`. The archive page filtered on venue and start date and took 7.4 seconds to return twenty results. The fix was not a bigger server.

### What wp_postmeta actually is

Four columns, and only two of them are useful for finding anything:

| Column | Type | Indexed |
|---|---|---|
| \`meta_id\` | bigint | primary key |
| \`post_id\` | bigint | yes |
| \`meta_key\` | varchar(255) | yes, first 191 chars |
| \`meta_value\` | longtext | no |

\`meta_value\` is not indexed and cannot be, because LONGTEXT columns do not take a plain index. So every filter by value narrows on \`meta_key\` first and then compares values row by row. Each extra \`meta_query\` clause is another self join onto the same table.

\`\`\`php
$q = new WP_Query( [
    'post_type'  => 'event',
    'meta_key'   => 'start_ts',
    'orderby'    => 'meta_value_num',
    'meta_query' => [
        [ 'key' => 'venue_id', 'value' => 42 ],
        [ 'key' => 'start_ts', 'value' => time(), 'compare' => '>', 'type' => 'NUMERIC' ],
    ],
] );
\`\`\`

That is three joins onto \`wp_postmeta\`, two for the filters and one for the sort, and the NUMERIC comparison wraps the column in a CAST, which throws away even the key index. Run it through \`EXPLAIN\` and you will see \`Using temporary; Using filesort\` over a few hundred thousand rows.

### Where the line sits

| Pattern | Right home |
|---|---|
| Read every value for one known post | Post meta, cached in one query |
| Filter by a small set users browse | A taxonomy, not meta |
| Sort or range filter over 10,000+ posts | Custom table |
| Rows that are not content at all | Custom table, always |

The last row is where most damage happens. People model 400,000 ticket scans as a custom post type because that is the tool they know. Every scan then costs a row in \`wp_posts\`, several in \`wp_postmeta\`, a slot in the shared auto-increment, and a share of every query that touches the posts table.

### Creating the table

\`\`\`php
function cortex_events_install_schema() {
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $table   = $wpdb->prefix . 'cortex_ticket_scans';
    $charset = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        event_id bigint(20) unsigned NOT NULL,
        ticket_code varchar(32) NOT NULL,
        scanned_at datetime NOT NULL,
        gate varchar(20) NOT NULL DEFAULT '',
        PRIMARY KEY  (id),
        UNIQUE KEY ticket_code (ticket_code),
        KEY event_scanned (event_id,scanned_at)
    ) $charset;";

    dbDelta( $sql );
    update_option( 'cortex_events_db_version', 3, false );
}
\`\`\`

\`dbDelta\` is fussy in ways nothing warns you about: one field per line, two spaces between \`PRIMARY KEY\` and its bracket, \`KEY\` rather than \`INDEX\`, and a name on every index. Get one wrong and it silently does nothing, or drops and recreates the index on every single load.

### The upgrade nobody runs

\`register_activation_hook()\` fires when a plugin is activated. It does not fire when a plugin is updated in place. Ship a new column in version 1.4 and every existing install keeps the 1.3 table until somebody deactivates and reactivates by hand. Check a stored version instead:

\`\`\`php
add_action( 'plugins_loaded', function () {
    if ( (int) get_option( 'cortex_events_db_version' ) < 3 ) {
        cortex_events_install_schema();
    }
} );
\`\`\`

### What you give up

Own the table and you own everything WordPress was doing for free: no \`WP_Query\`, no automatic object caching of results, no \`pre_get_posts\`. Every read is yours to write and to prepare.

\`\`\`php
$rows = $wpdb->get_results( $wpdb->prepare(
    "SELECT ticket_code, scanned_at FROM {$wpdb->prefix}cortex_ticket_scans
     WHERE event_id = %d AND scanned_at > %s
     ORDER BY scanned_at DESC LIMIT 100",
    $event_id,
    $since
) );
\`\`\`

Interpolating \`$wpdb->prefix\` is safe because you control it. Interpolating \`$event_id\` from a request is not. Table and column names cannot be bound as parameters, which is exactly the frustration that leads people to give up and build the whole string by hand.

One more decision to make once and write down: on multisite \`$wpdb->prefix\` is per site while \`$wpdb->base_prefix\` is shared, so choose whether scans are network wide or per site before the first install runs.
      `,
        [
          q('A WP_Query filters events on two meta keys and orders by a third value with meta_value_num. Why does it slow down sharply as the post count grows?', [
            'meta_value is indexed, but only across its first 191 characters',
            'WordPress caches meta per post, so an archive always misses it',
            'Each clause joins wp_postmeta again and meta_value is unindexed',
            'The orderby triggers a second main query against the posts table',
          ], 2, 'Every meta_query clause and the meta sort each join wp_postmeta once more, and because meta_value is a LONGTEXT column with no index, MySQL compares the values row by row.'),
          q('You need to store 400,000 ticket scan records, each with a code, a timestamp and a gate name. Which model holds up in production?', [
            'A custom table with an index on (event_id, scanned_at)',
            'A custom post type with the scan data held in post meta',
            'One autoloaded option holding a serialized array of scans',
            'A taxonomy term per ticket code attached to the event post',
          ], 0, 'Scans are not editorial content, so they gain nothing from wp_posts, and a dedicated table with a composite index answers the per event, per time range question in a single pass.'),
          q('Version 1.4 of your plugin adds a column via dbDelta inside register_activation_hook. Sites updating from 1.3 report a missing column. Why?', [
            'dbDelta can only create whole tables, never alter existing ones',
            'The activation hook runs before $wpdb has resolved its prefix',
            'dbDelta requires upgrade.php to be included inside that hook',
            'Updating a plugin in place never fires the activation hook',
          ], 3, 'register_activation_hook only fires when a plugin is activated, not when it is updated, so schema changes need a stored version number checked on a hook that runs on ordinary requests.'),
        ]
      ),
      lesson('Transients, Autoloaded Options, and a Persistent Object Cache', 13, `
Run this against any WordPress site older than about two years:

\`\`\`sql
SELECT option_name, LENGTH(option_value) AS bytes
FROM wp_options WHERE autoload = 'yes'
ORDER BY bytes DESC LIMIT 20;
\`\`\`

On one site the top row was 4.1MB: a plugin's cached API response, stored with \`add_option()\` and left at the default. That blob was fetched and unserialized on every front end request, every admin screen, and every \`admin-ajax.php\` poll the editor made while somebody typed.

### The alloptions query

WordPress loads every autoloaded option in a single query at boot, unserializes the lot, and parks it in the \`alloptions\` cache group. After that \`get_option()\` is a memory lookup. The design is sound. It falls apart on volume, because the cost is paid once per request whether or not anything reads the value.

Keep the autoloaded total under roughly 800KB. WordPress 6.6 added a guard, refusing to autoload new options above 150,000 bytes and exposing \`wp_max_autoloaded_option_size\` to tune it, but that only applies at write time. It does not retro-fix the 4.1MB row already sitting there.

\`\`\`php
update_option( 'cortex_events_api_snapshot', $payload, false ); // never autoload
add_option( 'cortex_events_settings', $defaults, '', 'yes' );   // tiny, read constantly
\`\`\`

The third argument of \`update_option()\` is the autoload flag. Pass \`false\` for anything that most requests will not touch.

### Transients are options until they are not

With no persistent object cache installed, \`set_transient()\` writes two rows, \`_transient_cortex_feed\` and \`_transient_timeout_cortex_feed\`, both with autoload off. No boot cost. Now the part that catches people:

\`\`\`php
set_transient( 'cortex_feed', $items );                  // autoloaded, and never expires
set_transient( 'cortex_feed', $items, HOUR_IN_SECONDS ); // not autoloaded
\`\`\`

A transient with no expiry has no timeout row, so WordPress stores it autoloaded. Omit that third argument on a 300KB payload and you have quietly added 300KB to every request on the site, with no expiry to ever clear it.

Install an object cache drop-in at \`wp-content/object-cache.php\` (Redis or Memcached) and transients skip the database entirely. Same code, different storage. That also turns an expiry into a hint rather than a promise: under memory pressure with \`maxmemory-policy allkeys-lru\`, Redis will evict keys that had hours left, so your code must survive a miss at any moment.

| Store | Survives the request | Survives a deploy | Costs boot time |
|---|---|---|---|
| \`wp_cache_set\` with no drop-in | no | no | no |
| Autoloaded option | yes | yes | yes, always |
| Transient in the database | yes | yes | only with no expiry |
| Transient with Redis | yes | usually | no |

### False is a real value

\`wp_cache_set()\` and \`wp_cache_get()\` do nothing beyond the current request until that drop-in exists. Check honestly with \`wp_using_ext_object_cache()\`, and read results properly, because a cached \`0\` or \`false\` is indistinguishable from a miss otherwise:

\`\`\`php
$found = false;
$sold  = wp_cache_get( "event_{$id}_sold", 'cortex', false, $found );
if ( ! $found ) {
    $sold = cortex_count_sold( $id );
    wp_cache_set( "event_{$id}_sold", $sold, 'cortex', 300 );
}
\`\`\`

The broken version is \`if ( ! $sold )\`, which recomputes the count on every request for every event that has sold zero tickets, which is every event on the day it goes on sale.

### The stampede

A cached value that takes 3 seconds to rebuild expires mid traffic spike. Forty requests arrive inside those 3 seconds, all forty see a miss, all forty call the upstream API. You get forty times the load at the exact moment you can least afford it. Serve the stale copy while one worker refreshes:

\`\`\`php
$cache = get_transient( 'cortex_feed' ); // stored with a TTL longer than its freshness stamp
if ( $cache && $cache['fresh_until'] < time() && ! get_transient( 'cortex_feed_lock' ) ) {
    set_transient( 'cortex_feed_lock', 1, 60 );
    wp_schedule_single_event( time(), 'cortex_refresh_feed' );
}
return $cache ? $cache['items'] : cortex_fetch_feed();
\`\`\`

One request pays the lock, everyone else gets slightly old data instantly, and the rebuild happens off the critical path.
      `,
        [
          q('set_transient( \'cortex_feed\', $payload ) is called with a 300KB payload and no third argument. What is the effect on the site?', [
            'It is rejected outright, because transients require an expiry',
            'It is stored as an autoloaded option and loads on every request',
            'It expires after the twelve hour default and is then removed',
            'It goes only to the object cache and is lost on the next deploy',
          ], 1, 'A transient set with no expiry has no timeout row, so WordPress stores it with autoload on, meaning all 300KB is fetched and unserialized on every request until something deletes it.'),
          q('A cached count can legitimately be the integer 0. Which call lets you tell a genuine cache miss apart from a stored falsy value?', [
            'wp_cache_get with the group name given as the second argument',
            'wp_cache_get with $force set to true so it skips the local copy',
            'wp_cache_add, which returns false when that key already exists',
            'wp_cache_get with a $found variable passed by reference fourth',
          ], 3, 'The fourth parameter of wp_cache_get is set by reference to true on a hit and false on a miss, which is the only reliable way to separate a miss from a stored zero or false.'),
          q('A cached value takes 3 seconds to rebuild and expires during a traffic spike. Forty requests arrive in those 3 seconds with no lock in place. What happens?', [
            'All forty miss the cache and rebuild it, forty times the work',
            'The first request rebuilds while the others wait on a row lock',
            'WordPress serves the expired copy until the rebuild completes',
            'Only one rebuild runs, because get_transient blocks on the key',
          ], 0, 'get_transient neither locks nor serves stale data, so every concurrent request sees a miss and runs the expensive rebuild, which is why a short lock plus a stale value is worth building.'),
        ]
      ),
      lesson('Background Work: WP-Cron, Action Scheduler, and Queues', 13, `
A client's nightly invoice run had not fired for eleven days. No fatal error, no log entry, no failed job. The site simply had almost no overnight traffic, and WP-Cron only runs when somebody loads a page.

### WP-Cron is a queue with no worker

The \`cron\` option is a serialized array of timestamps mapped to hooks, and it is autoloaded. On \`init\`, WordPress compares that array to the current time. If anything is due it fires a non blocking loopback POST to \`/wp-cron.php\` on its own domain, and that second request is what actually runs your callbacks.

Three consequences follow, and every one of them has taken down a real job:

- No traffic means no jobs. A staging site or a low volume B2B site can go days.
- The loopback has to succeed. Behind HTTP basic auth, or a firewall that will not let the server call itself, \`wp_remote_post()\` fails silently and nothing has ever run.
- The \`doing_cron\` lock lasts 60 seconds. A job that takes 90 seconds can be started again by the next visitor while the first copy is still working.

Fix it properly on anything that matters:

\`\`\`php
// wp-config.php
define( 'DISABLE_WP_CRON', true );
\`\`\`

\`\`\`bash
# crontab -e, every minute
* * * * * cd /var/www/cortex && wp cron event run --due-now --quiet >/dev/null 2>&1
\`\`\`

### Scheduling without duplicates

\`\`\`php
add_action( 'init', function () {
    if ( ! wp_next_scheduled( 'cortex_send_reminders' ) ) {
        wp_schedule_event( time() + 300, 'hourly', 'cortex_send_reminders' );
    }
} );
add_action( 'cortex_send_reminders', 'cortex_send_reminders_handler' );
\`\`\`

The trap is arguments. WordPress keys each entry by an md5 of the serialized argument array, so \`wp_next_scheduled( 'cortex_sync', [ 42 ] )\` does not match a job scheduled with \`[ '42' ]\`. The check reports nothing scheduled, a duplicate is added, and the loop repeats on the next page load. A \`cron\` option that has grown to several megabytes this way is loaded and unserialized on every single request, which is how one scheduling bug becomes a whole site slowdown.

### Action Scheduler when jobs number in the thousands

WP-Cron holds everything in one option. Fine for six recurring jobs, hopeless for 20,000 individual emails. Action Scheduler, bundled with WooCommerce and installable on its own, moves actions into dedicated tables.

| | WP-Cron | Action Scheduler |
|---|---|---|
| Storage | one autoloaded option | its own tables |
| Per job status | none | pending, running, complete, failed |
| Retries | none | automatic, with backoff |
| Concurrency safety | one 60 second lock | row level claims |
| Visibility | none | Tools, Scheduled Actions |

\`\`\`php
as_enqueue_async_action( 'cortex_send_ticket', [ 'order_id' => 8814 ], 'cortex' );
as_schedule_recurring_action( strtotime( '03:00' ), DAY_IN_SECONDS, 'cortex_nightly_invoices', [], 'cortex' );

add_action( 'cortex_send_ticket', function ( $order_id ) {
    if ( ! cortex_deliver( $order_id ) ) {
        throw new RuntimeException( 'delivery failed' ); // marks the action failed, retry follows
    }
} );
\`\`\`

Two details worth knowing. Action Scheduler spreads the argument array across the callback parameters in order and drops the keys, so that handler receives \`8814\` no matter what the key was called. And it still needs a runner: its queue is dispatched from a recurring WordPress cron event, so \`DISABLE_WP_CRON\` plus a real system crontab keeps it working exactly as before.

### When you need an actual queue

Reach past both when any of these are true: a job must outlive the web request budget on shared infrastructure, ordering must hold across workers, another service in another language consumes the same work, or workers must scale independently of web traffic.

The shape is then simple. WordPress writes a job row to SQS, Redis or RabbitMQ, and a separate long lived worker calls back in through a WP-CLI command:

\`\`\`bash
wp cortex process-job 91024 --quiet
\`\`\`

Keep the message thin. Enqueue an ID and a job type, never a serialized object graph, because that payload will be read by code that has been deployed twice since it was written, and a class that changed shape in the meantime unserializes into \`__PHP_Incomplete_Class\` and takes the worker down with it.
      `,
        [
          q('A nightly job on a low traffic site has not run for eleven days and nothing has errored anywhere. What is the most likely explanation?', [
            'The cron option grew too large to unserialize during boot',
            'A plugin filtering cron_schedules removed the hourly interval',
            'The job threw a fatal that WP_DEBUG_LOG failed to record',
            'Nobody loaded a page overnight, so WP-Cron never spawned',
          ], 3, 'WP-Cron is checked on incoming requests rather than by a system timer, so a site with no overnight traffic never reaches the code that spawns due jobs in the first place.'),
          q('Every page load adds another copy of the same scheduled job to the cron option. What best explains that behaviour?', [
            'wp_schedule_event was called on init rather than on wp_loaded',
            'wp_next_scheduled was checked with args that differ from the scheduled ones',
            'The hook name holds a character that WordPress normalises on write',
            'wp_schedule_event was used where wp_schedule_single_event was needed',
          ], 1, 'Cron entries are keyed by a hash of the serialized argument array, so checking wp_next_scheduled with a different array always reports nothing scheduled and another duplicate gets added.'),
          q('You must send 20,000 individual reminder emails with retries and per job status. Why does Action Scheduler fit better than WP-Cron here?', [
            'It runs outside PHP, so the web request timeout cannot apply',
            'It bypasses the object cache, which WP-Cron depends on heavily',
            'It stores actions in its own tables with per action status and retries',
            'It guarantees delivery order, which WP-Cron randomises per batch',
          ], 2, 'Action Scheduler keeps each action as a claimable row in dedicated tables with its own status and retry handling, while WP-Cron packs everything into one autoloaded option with no per job state.'),
        ]
      ),
      lesson('Batch Processing Millions of Rows Without Timing Out', 13, `
The migration ran clean on staging: 5,000 posts in nine seconds. On production it processed roughly 180,000 of 1.2 million and then the SSH session dropped. Nobody could say which 180,000.

### Four limits, and the fourth is the sneaky one

\`max_execution_time\`, \`memory_limit\`, and the cost of the query itself are the three people plan for. The fourth is memory WordPress accumulates on its own: every post and meta row you load goes into the in process object cache, and inside a single long running command that cache only ever grows.

\`\`\`php
// The version that dies
$posts = get_posts( [ 'post_type' => 'event', 'posts_per_page' => -1 ] );
foreach ( $posts as $p ) {
    cortex_reindex( $p->ID );
}
\`\`\`

That asks for 1.2 million \`WP_Post\` objects plus their meta before the first row is touched. Memory is exhausted long before any timeout gets a chance.

### Keyset paging, not OFFSET

\`LIMIT 500 OFFSET 900000\` asks MySQL to produce and throw away 900,000 rows before it returns anything, so page 1,800 costs roughly 1,800 times what page one did. The worse failure is silent. If the loop changes whether a row still matches the WHERE clause, every remaining row shifts down and advancing the offset steps straight past a batch. No error, just a few percent of records never processed.

Page on the primary key and keep the cursor somewhere durable:

\`\`\`php
$last = (int) get_option( 'cortex_reindex_cursor', 0 );

while ( true ) {
    $ids = $wpdb->get_col( $wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts}
         WHERE post_type = 'event' AND ID > %d
         ORDER BY ID ASC LIMIT 500",
        $last
    ) );
    if ( ! $ids ) {
        break;
    }
    foreach ( $ids as $id ) {
        cortex_reindex( (int) $id );
    }
    $last = (int) end( $ids );
    update_option( 'cortex_reindex_cursor', $last, false );
    cortex_free_memory();
    usleep( 200000 ); // 200ms, keeps replica lag in check
}
\`\`\`

That stored cursor is what turns a dropped connection from a disaster into an inconvenience. Restart the command and it resumes at 180,001.

### Empty the caches every batch

\`\`\`php
function cortex_free_memory() {
    global $wpdb, $wp_object_cache;
    $wpdb->queries = [];
    if ( is_object( $wp_object_cache ) ) {
        $wp_object_cache->cache     = [];
        $wp_object_cache->group_ops = [];
        $wp_object_cache->stats     = [];
    }
}
\`\`\`

WP-CLI ships the same thing as \`WP_CLI\\Utils\\wp_clear_object_cache()\`, so use that inside a command. Keep \`SAVEQUERIES\` off while you are at it: with it on, \`$wpdb->queries\` grows by an array per query, and a run issuing two million queries will eat gigabytes on that alone.

### Turn off the bookkeeping

Bulk writes trigger per row work that only needs doing once at the end:

\`\`\`php
wp_defer_term_counting( true );
wp_defer_comment_counting( true );
wp_suspend_cache_invalidation( true );

// ... the loop ...

wp_suspend_cache_invalidation( false );
wp_defer_term_counting( false );    // recounts once, here
wp_defer_comment_counting( false );
wp_cache_flush();
\`\`\`

\`wp_suspend_cache_invalidation( true )\` is the one that bites back. It stops WordPress purging caches as you write, which is precisely the speedup you wanted, and it leaves a persistent object cache serving pre update data afterwards. The flush on the way out is not optional. On a shared Redis, \`wp_cache_flush()\` wipes everything for everyone, so prefer \`clean_post_cache()\` over the IDs you actually touched.

### Run it from WP-CLI

\`\`\`php
WP_CLI::add_command( 'cortex reindex', function ( $args, $assoc ) {
    $batch = (int) ( $assoc['batch'] ?? 500 );
    $dry   = isset( $assoc['dry-run'] );
    $bar   = \\WP_CLI\\Utils\\make_progress_bar( 'Reindexing', cortex_count_events() );
    // ... loop, $bar->tick() per row ...
    $bar->finish();
    WP_CLI::success( "Reindexed {$done} events from ID {$start}." );
} );
\`\`\`

No web timeout, real exit codes, and \`--dry-run\` costs four lines. Run it under \`nohup\` or inside tmux so a closed laptop lid does not end it. Finally, respect the database: the migration competes with live traffic on the same primary, and a loop with no pause between batches will saturate it and take the site down for far longer than the migration would ever have taken.
      `,
        [
          q('A loop pages with LIMIT 500 OFFSET n and marks each processed row so it no longer matches the WHERE clause. What goes wrong?', [
            'Rows shift below the offset, so whole batches get skipped',
            'MySQL rejects an OFFSET larger than the remaining row count',
            'The offset silently resets once the result set comes back empty',
            'Duplicate rows return because the sort order is not stable here',
          ], 0, 'Each pass removes matching rows from the front of the result set, so advancing the offset steps past records that have moved into positions the loop already walked over.'),
          q('Which change most reduces peak memory in a WP-CLI command looping over 1.2 million posts?', [
            'Raising memory_limit to -1 so PHP can allocate as it likes',
            'Wrapping each batch in a transaction and committing at the end',
            'Clearing the object cache and $wpdb->queries after every batch',
            'Sorting by post_date rather than ID to help the query planner',
          ], 2, 'WordPress keeps every post and meta row it loads in the in process object cache, which grows without bound in a long running command, so emptying it each batch is what actually caps memory.'),
          q('You wrapped a bulk update in wp_suspend_cache_invalidation( true ). What has to happen once the loop finishes?', [
            'Reindex the posts table so the primary key stays contiguous',
            'Switch it back off and flush or clean the caches left stale',
            'Delete the cursor option so the next run starts from the top',
            'Re-run the loop once to confirm every row was truly written',
          ], 1, 'Suspending invalidation means those writes never purged their cached copies, so a persistent object cache keeps serving pre update data until you turn it back on and flush or clean the affected entries.'),
        ]
      ),
      ],
      [
      q('A plugin stores a 4MB API response using add_option with the default autoload setting. Which symptom follows?', [
        'Only admin screens slow down, since the front end skips options',
        'Every request pays to fetch and unserialize it, read or not',
        'The option is silently truncated at the 150,000 byte threshold',
        'get_option returns false until the response has been refetched',
      ], 1, 'Autoloaded options are pulled in one boot query and unserialized on every request whether or not any code asks for them, so a 4MB blob taxes the entire site all day.'),
      q('DISABLE_WP_CRON is true and a system crontab runs wp cron event run --due-now every minute. What happens to Action Scheduler?', [
        'It stops entirely, since it schedules only through wp-cron.php',
        'It doubles up, running each action once per runner and per cron',
        'It falls back to running its queue on front end page loads only',
        'It keeps running, since its queue runner is itself a cron event',
      ], 3, 'Action Scheduler hooks its queue runner onto a recurring WordPress cron event, so a real system cron calling wp cron event run dispatches it exactly as the loopback used to.'),
      q('Which of these belongs in a custom table rather than in post meta or the options table?', [
        'Two million import log lines queried by date range',
        'Six settings a site owner edits on one admin screen',
        'A subtitle string shown on every single event page',
        'A featured flag read while rendering the event archive',
      ], 0, 'High volume rows that are filtered by range and are not editorial content belong in a schema you control and can index, while small per post values and a handful of settings are what meta and options exist for.'),
      q('A nightly reindex over 800,000 posts saturates the database and the live site starts timing out. Which fix addresses the actual cause?', [
        'Increase max_execution_time so batches are never cut short',
        'Load every ID up front so the query only has to run once',
        'Add a short pause between batches to hold database load down',
        'Move the job out of WP-CLI and back into an hourly cron event',
      ], 2, 'The migration competes with live traffic for the same database, so throttling it with a pause between batches keeps query and replication load inside what the site can absorb.'),
      ]
    ),
    chapter(
      'Serving Real Traffic',
      'Full-page and edge caching, an architecture that survives more than one server, and the instrumentation that tells you a site is failing before a customer does.',
      [
      lesson('Full-Page Caching and the Art of Invalidation', 13, `
A product page that costs PHP 340ms to render leaves nginx in 3ms once it is in the page cache. Same bytes, same HTML, same visitor. The difference is that one request woke up PHP and MySQL and the other never got past a file on disk.

Object caching makes your PHP faster. Full-page caching means your PHP does not run at all.

| Layer | Typical TTFB | What still executes |
|---|---|---|
| CDN edge hit | 8 ms | nothing of yours |
| Origin page cache hit | 3 ms | nginx only |
| Object cache warm, PHP runs | 180 ms | PHP, Redis, some MySQL |
| Cold render | 340 ms and up | everything |

### The cookie rule, and the bug hiding behind it

A page cache must never hand a personalised page to a stranger. WordPress marks a signed-in browser with \`wordpress_logged_in_<hash>\`, WooCommerce adds \`woocommerce_items_in_cart\` and \`wp_woocommerce_session_*\`. Bypass on those, cache the rest.

\`\`\`nginx
set $skip_cache 0;
if ($request_method != GET) { set $skip_cache 1; }
if ($request_uri ~* "/wp-admin/|wp-login.php|/wp-json/|/cart/|/checkout/|/my-account/") { set $skip_cache 1; }
if ($http_cookie ~* "wordpress_logged_in_|woocommerce_items_in_cart|comment_author_") { set $skip_cache 1; }

fastcgi_cache_bypass    $skip_cache;
fastcgi_no_cache        $skip_cache;
fastcgi_cache_key       "$scheme$request_method$host$request_uri";
fastcgi_cache_valid     200 301 302 10m;
fastcgi_cache_valid     404 1m;
fastcgi_cache_use_stale updating error timeout http_500 http_503;
fastcgi_cache_lock      on;
\`\`\`

The bug that actually bites is the other direction. A plugin calls \`setcookie()\` on a public product page, nginx stores the whole response including that \`Set-Cookie\` header, and now every anonymous visitor receives one person's session identifier. Never store a response that carries \`Set-Cookie\`.

Two of those directives are worth more than the rest combined. \`use_stale updating\` serves the expired copy while a single request rebuilds it. \`cache_lock on\` guarantees there is only one such request. Drop both and a popular URL expiring at noon sends every request arriving in the next 400ms straight into php-fpm at the same instant, which is how a cache reduces your capacity instead of adding to it.

### The cache key is where money leaks

\`$request_uri\` includes the query string, and Facebook appends \`?fbclid=\` with a value that is unique per click. A post that does well on social gets a fresh cache entry for every single visitor, hit ratio collapses toward zero, and the origin melts on the day you most wanted it to hold. Strip or normalise the marketing parameters before the key is computed. The same logic rules out varying on \`User-Agent\`: thousands of UA strings means thousands of copies of one page.

### Invalidation is a dependency graph, not a URL

Publishing one post changes the home page, the category archive, the author archive, the feed, the sitemap, the REST collection, and any recent-posts widget in the footer. Purge the permalink alone and the site looks stale everywhere else.

\`\`\`php
add_action( 'save_post', function ( $post_id, $post ) {
    if ( wp_is_post_revision( $post_id ) || 'publish' !== $post->post_status ) {
        return;
    }
    $urls = [ get_permalink( $post_id ), home_url( '/' ), get_post_type_archive_link( $post->post_type ) ];
    foreach ( get_the_category( $post_id ) as $cat ) {
        $urls[] = get_category_link( $cat->term_id );
    }
    foreach ( array_filter( $urls ) as $url ) {
        wp_remote_request( $url, [ 'method' => 'PURGE', 'blocking' => false, 'timeout' => 1 ] );
    }
}, 10, 2 );
\`\`\`

\`blocking => false\` matters: an editor should not wait on six HTTP calls to see "Post published".

The opposite failure is the one teams ship by accident. Purging the entire cache on every save looks safe, and on a 40,000 page site it means one typo fix empties everything. Thirty posts published on a Tuesday morning is thirty full cold rebuilds of the whole site, driven by the one team whose job is to publish. Prefer a short TTL plus stale-while-revalidate over a big hammer.

### What stays dynamic

The cart total, the "Hi Sara" in the header, the stock counter. Cache the page shell for everyone and fill those slots from the browser with one small request to a REST route that is explicitly excluded from the cache. One uncached JSON call of 40ms beats making the entire page uncacheable for the sake of nine characters of greeting.
      `,
        [
          q('Your nginx config bypasses the cache for wp-admin and for logged-in cookies, but it stores every other 200 response. A plugin calls setcookie() on the public product page. What goes wrong?', [
            'The product page is never cached at all, so PHP renders it on every request',
            'One visitor\'s Set-Cookie header is stored and replayed to everyone after them',
            'The cache key grows a cookie segment, roughly halving the overall hit ratio',
            'nginx strips the header on the way out and the plugin silently loses state',
          ], 1, 'nginx stores the entire response including its Set-Cookie header, so the first anonymous visitor\'s cookie is handed to every later visitor served from that entry, which is why a response carrying Set-Cookie must never be cached.'),
          q('A post goes viral on Facebook, which appends a ?fbclid= value that is unique to every click. Your cache key is $scheme$request_method$host$request_uri. What is the effect?', [
            'Every click creates a fresh cache entry, so almost all visitors get a cold render',
            'nginx returns 400 because that query string matches no WordPress rewrite rule',
            'Entries collide on the hash, so some visitors are served another post\'s HTML',
            'Nothing changes, because fastcgi_cache ignores query strings when hashing keys',
          ], 0, 'The request URI includes the query string, so a per click unique parameter makes the key unique per visitor, the hit ratio falls toward zero and every arrival is served by PHP.'),
          q('A busy archive page has a 10 minute TTL, the site takes 400 requests a second, and neither fastcgi_cache_lock nor use_stale is configured. What happens the instant that entry expires?', [
            'nginx answers 502 until the entry is rebuilt, because the cached file is missing',
            'The first request rebuilds it while the others wait on a lock, adding some latency',
            'Only one request reaches PHP and nginx replays that answer to the ones queued',
            'Every request arriving during the rebuild hits PHP at once and can exhaust php-fpm',
          ], 3, 'Without a lock there is nothing serialising the rebuild, so the whole burst of concurrent requests is passed to php-fpm simultaneously, which is the cache stampede that turns a popular page into an outage.'),
        ]
      ),
      lesson('One Site, Many Servers: Media Offload and the Ephemeral Filesystem', 13, `
You add a second web node behind a load balancer on Friday afternoon. On Monday the editors report that images uploaded that morning show a broken icon about half the time, then load fine on refresh, then break again. Nothing is corrupt. The upload landed on node A, the browser's request for it went to node B, and node B has never seen that file.

### WordPress assumes there is one disk

\`wp_upload_dir()\` returns a local path. The media library writes an original plus six resized files next to it, and \`_wp_attached_file\` stores a path relative to that directory. Plugin installs, \`debug.log\`, generated CSS, page cache files: all local, all silently per node.

| Approach | What you trade |
|---|---|
| Shared NFS or EFS mount | No code changes, but every \`file_exists()\` becomes a network round trip |
| Offload to S3 behind a CDN | Cheapest at scale, needs URL rewriting and breaks code that reads local paths |
| Sticky sessions on the balancer | Not a fix, just hides the problem until a node is replaced |

### The filesystem is temporary now

Container hosts rebuild nodes on deploy. Anything written to a node's disk goes with the node. So an editor who installs a plugin through the dashboard gets a plugin that works beautifully until the evening release, at which point the files vanish while \`active_plugins\` in the options table still lists it, and the next request fatals on a missing file.

\`\`\`php
define( 'DISALLOW_FILE_MODS', true );      // no installs, updates or file editing from wp-admin
define( 'AUTOMATIC_UPDATER_DISABLED', true );
\`\`\`

Code arrives through the build, never through the browser. Uploads are the only thing users are allowed to write, and those belong in object storage.

### The four things that quietly assume one server

**Scheduled work.** With three nodes and no \`DISABLE_WP_CRON\`, three schedulers race on every request. The \`doing_cron\` guard only holds if all three share an object cache, so on per node APCu the same daily digest goes out twice. Turn WP-Cron off in \`wp-config.php\` and drive it from one place with \`wp cron event run --due-now\`.

**The object cache.** APCu lives in one PHP process on one machine. Flush a transient on node A and node B keeps serving the old value until its own copy expires, which produces bugs that only reproduce on every other refresh. Use Redis or Memcached shared by all nodes, or accept no persistent cache at all.

**PHP sessions.** File based by default, therefore per node. Core does not use them, plenty of plugins do, and the symptom is a form that loses its state one submission in two.

**The protocol and the client IP.** With TLS terminated at the balancer, PHP sees a plain HTTP request, \`is_ssl()\` returns false, WordPress builds \`http://\` canonical URLs, the balancer redirects them to \`https://\`, and the browser gives up with a redirect loop. This is the classic "worked on one server, broke on two".

\`\`\`php
if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] )
     && 'https' === strtolower( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ) {
    $_SERVER['HTTPS'] = 'on';
}
\`\`\`

Do the same for \`REMOTE_ADDR\`, and take only the hop your own balancer appended to \`X-Forwarded-For\`. Trust the whole header and any visitor can forge an address, which defeats rate limiting, comment blocklists and login throttles in one line.

### Offloaded media changes what your code may assume

\`\`\`php
// Breaks the day local copies are removed.
$bytes = filesize( get_attached_file( $attachment_id ) );

// Survives, because the value was stored at upload time.
$meta  = wp_get_attachment_metadata( $attachment_id );
$bytes = $meta['filesize'] ?? 0;
\`\`\`

Anything calling \`getimagesize()\`, \`imagecreatefromjpeg()\` or a raw \`file_get_contents()\` on an upload path is on the same list. Audit for those before you delete the local files, not after.

### A check that takes ten seconds

\`\`\`bash
for i in 1 2 3 4 5 6; do
  curl -sI https://example.com/wp-content/uploads/2026/08/hero.webp | head -1
done
\`\`\`

Six requests, load balanced across your nodes. Six \`200 OK\` responses means the file is genuinely shared. A single \`404\` in the set means you found the bug before your editors did.
      `,
        [
          q('You move a site behind a load balancer that terminates TLS and forwards plain HTTP to two PHP nodes. Visitors immediately report that the browser reports too many redirects. What is the cause?', [
            'Uploads are written to only one node, so about half of all image requests 404',
            'is_ssl() returns false, WordPress emits http URLs and the balancer redirects back',
            'The session cookie is marked secure, so PHP discards it on every plain request',
            'The object cache is split per node, so a flushed transient reappears at random',
          ], 1, 'PHP never sees the TLS connection, so is_ssl() is false and WordPress canonicalises to http, the balancer sends the browser back to https, and the two disagree forever until X-Forwarded-Proto is honoured.'),
          q('Three web nodes run with DISABLE_WP_CRON unset, and each node has its own local APCu object cache rather than a shared one. What failure should you expect?', [
            'Scheduled events never run, because each node cancels the lock set by another',
            'wp-cron.php is refused by the load balancer health check and returns 504 errors',
            'The same scheduled job fires on more than one node, so subscribers get duplicates',
            'Cron runs only on whichever node currently holds the shared filesystem write lock',
          ], 2, 'The doing_cron guard is stored in the object cache, so with a per node cache each machine believes it is the only scheduler and the same due event is executed several times over.'),
          q('On a container host that rebuilds nodes at every deploy, an editor installs and activates a plugin from the dashboard. That evening a release goes out. What is the result?', [
            'The plugin is carried into the new image, because active plugins live in the database',
            'The deploy fails its checksum step, because wp-content no longer matches the repo',
            'The plugin keeps working, since wp-content is mounted outside the container by default',
            'The plugin files disappear with the old container while the database still marks it active',
          ], 3, 'Only the database survives the rebuild, so active_plugins still references files that no longer exist on disk, which is why DISALLOW_FILE_MODS belongs in wp-config on any ephemeral host.'),
        ]
      ),
      lesson('Observability: APM, Slow Queries, and Alerts', 13, `
Your uptime monitor has been green for six hours. Checkout has been failing for five of them. Both facts are true, because the monitor requests the home page, the home page is served from the page cache by nginx, and no PHP or MySQL code was involved in producing that \`200 OK\`. Green means the web server is alive. It means nothing else.

### Three signals, and what each one can tell you

| Signal | Tool | The question it answers |
|---|---|---|
| Real user monitoring | CrUX, a RUM script | What did actual visitors experience on their devices |
| Application traces | New Relic, Datadog, Blackfire | Which code and which query burned the time |
| Structured logs | Loki, CloudWatch, a file plus \`jq\` | What exactly happened during request \`a3f9c1\` |

Miss the first and you optimise a page that was already fast for everyone on fibre. Miss the second and you are guessing. Miss the third and you can see that something failed but never why.

### WordPress makes APM useless out of the box

Every front end URL is rewritten to \`index.php\`, so an unconfigured APM shows you one transaction called \`index.php\` with a p95 of 4.2 seconds and a latency spread three orders of magnitude wide. Useless. Name transactions yourself:

\`\`\`php
add_action( 'template_redirect', function () {
    if ( ! extension_loaded( 'newrelic' ) ) {
        return;
    }
    if ( is_singular( 'product' ) )              { $name = 'product/single'; }
    elseif ( is_post_type_archive( 'product' ) ) { $name = 'product/archive'; }
    elseif ( is_search() )                       { $name = 'search'; }
    elseif ( is_front_page() )                   { $name = 'front-page'; }
    else                                         { $name = 'other'; }
    newrelic_name_transaction( $name );
} );
\`\`\`

Do the same for cron hooks and REST routes. Until you do, one nightly catalogue import that takes 90 seconds sits in the same bucket as every page view, drags the site wide p95 upward, and sends you hunting for a front end problem that does not exist.

### Slow queries, ranked properly

\`\`\`ini
slow_query_log = 1
long_query_time = 0.5
log_queries_not_using_indexes = 1
\`\`\`

Then feed the log to \`pt-query-digest\`, which groups statements by fingerprint and sorts by total time rather than worst case. That ordering is the whole point. Query A takes 2.4 seconds and runs once a night. Query B takes 90ms and runs 40,000 times an hour, which is 3,600 seconds of database time consumed every hour. B is eating a full CPU core around the clock and A is a rounding error, yet A is the one that catches your eye in the raw log.

The usual winner on a WordPress site: a \`meta_query\` joining \`wp_postmeta\` twice against 380,000 posts, on a page nobody thought was expensive.

### Alert on what customers feel

| Alert | Condition | Response |
|---|---|---|
| 5xx rate | above 1% of requests for 5 minutes | page someone |
| p95 TTFB | above 1.5s for 10 minutes | page someone |
| Completed orders per hour | below 60% of the same hour last week | page someone |
| Page cache hit ratio | below 80% for 30 minutes | ticket |
| Failed background jobs | any spike above baseline | ticket |
| Disk usage, certificate expiry | 80% full, 14 days left | ticket |

CPU at 85% is not an alert, it is a fact about a machine doing its job. Alert on the symptom a customer would report, and every threshold gets a duration window so a two second blip does not wake anyone. The team that pages on everything ends up with a channel nobody reads, which is strictly worse than having no alerts, because it feels like coverage.

### Make the synthetic check do real work

Point one monitor at a path that cannot be cached and that exercises the database: log in, load \`/my-account/\`, assert a string that only renders for an authenticated user. Then correlate the failures with your traces by stamping every request with an id:

\`\`\`php
add_action( 'muplugins_loaded', function () {
    define( 'CORTEX_REQ_ID', $_SERVER['HTTP_X_REQUEST_ID'] ?? bin2hex( random_bytes( 8 ) ) );
} );
\`\`\`

Log that id on every line, return it in a response header, and a customer's screenshot of a broken page becomes a one command search instead of an afternoon.
      `,
        [
          q('An uptime check requests the home page every minute and has been green all day, yet checkout has been broken for five hours. What does that green status actually prove?', [
            'That MySQL is accepting connections, since the home page still runs a main query',
            'That php-fpm has free workers, because a cached page is still passed through PHP',
            'Only that nginx is serving a cached page, with no PHP or database code exercised',
            'That the origin is healthy, because the CDN forwards every cache miss to the origin',
          ], 2, 'A full page cache hit is answered by the web server from disk or memory, so the check never touches the application stack and cannot detect a failure anywhere inside it.'),
          q('Query A takes 2.4 seconds and runs once each night. Query B takes 90ms and runs 40,000 times an hour. Which should you fix first, and on what grounds?', [
            'Query A, because any statement over one second will fill the slow query log first',
            'Query B, because it consumes roughly an hour of database time in every clock hour',
            'Query A, because nightly jobs hold locks that block front end reads all night long',
            'Query B, because any statement slower than 100ms is by definition missing an index',
          ], 1, 'Ranking by total time rather than worst case shows that 90ms times 40,000 is 3,600 seconds of database work per hour, so B occupies a full core continuously while A is a rounding error.'),
          q('Your APM shows a single transaction called index.php with a p95 of 4.2 seconds, and nobody can say which pages are slow. What is the correct fix?', [
            'Raise the APM sample rate so that far more index.php traces are captured',
            'Enable SAVEQUERIES in production so every trace carries its own query list',
            'Split the latency alert per URL pattern inside the monitoring tool instead',
            'Name transactions by template context on template_redirect, plus cron and REST',
          ], 3, 'Every front end URL routes through index.php, so until you assign a meaningful transaction name per context the tool has nothing to group by and all pages average together into one useless bucket.'),
        ]
      ),
      lesson('Load Testing and Capacity Before the Campaign', 13, `
Marketing sends 180,000 emails at 09:00 on launch day. Nine percent click inside the first ten minutes. That is 16,200 sessions in 600 seconds, or 27 sessions a second, and most of them will walk straight past your page cache because the pages that matter are \`/cart/\` and \`/checkout/\`, which you correctly excluded from caching in the first topic of this chapter.

Now size the servers. Guessing is not a plan, and neither is "we doubled the instance".

### Little's Law turns a marketing number into a config value

Concurrency equals throughput multiplied by latency. If 27 dynamic requests a second reach PHP and each takes 400ms, then \`27 x 0.4 = 10.8\` workers are busy at any instant. Peak is spikier than the average, so size for two to three times that, call it 28 workers across the fleet.

\`\`\`ini
pm = static
pm.max_children = 28
pm.max_requests = 500
\`\`\`

Then check that number against memory, because this is where teams get it wrong in both directions.

| Setting | Node RAM | Worker RSS | Total PHP | Result |
|---|---|---|---|---|
| max_children 60 | 4 GB | 110 MB | 6.6 GB | swap, then the OOM killer takes MySQL |
| max_children 28 | 4 GB | 110 MB | 3.1 GB | tight but survivable with MySQL elsewhere |
| max_children 8 | 4 GB | 110 MB | 0.9 GB | requests queue, nginx returns 502 |

Both mistakes produce 502 errors under load and the fixes are opposite, which is exactly why you measure instead of arguing. Run the same arithmetic on database connections: nodes multiplied by \`max_children\`, plus your cron and queue workers, has to stay under MySQL's \`max_connections\`.

### A load test that tells you something true

\`\`\`javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 30 },
    { duration: '5m', target: 30 },
    { duration: '3m', target: 90 },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  group('browse', () => {
    const r = http.get('https://staging.example.com/shop/?page=' + (1 + Math.floor(Math.random() * 12)));
    check(r, { 'shop 200': (res) => res.status === 200 });
  });
  group('add to cart', () => {
    const r = http.post('https://staging.example.com/?wc-ajax=add_to_cart', { product_id: '4821', quantity: '1' });
    check(r, { 'cart 200': (res) => res.status === 200 });
  });
  sleep(2 + Math.random() * 5);
}
\`\`\`

Three details separate this from theatre. The catalogue page varies, so you are not testing one warm cache entry. There is an uncacheable POST in the mix, because that is what the campaign will actually generate. The \`sleep()\` models a human reading a page rather than a robot in a loop.

### Test against production shaped data

Staging with 200 posts and 12 products will pass anything. Production has 380,000 posts and MySQL will choose a completely different plan on that table. Load test against a sanitised clone of the real database or the result is fiction.

### Read p95 and error rate, never the mean

Ramp the load until error rate crosses 1% or p95 crosses your budget. That crossing point is the knee, and the requests per second you were pushing when you hit it is your real capacity number. An average response time of 300ms is perfectly compatible with one visitor in twenty waiting nine seconds.

### The bottleneck is rarely PHP CPU

| What you see | Usual cause |
|---|---|
| p95 climbs while CPU stays flat | Row lock contention on the options or session table |
| Everything degrades together | MySQL or Redis connection limit reached |
| Errors confined to checkout | Payment gateway sandbox rate limit, not your code |
| Fine for four minutes, then a cliff | Cache entries expiring with no stale-while-revalidate |

Book the test window, tell your payment provider before you point 90 virtual users at their sandbox, and never run a ramp against production during trading hours without written agreement. A capacity test that takes the site down is still useful data, just not the kind anyone wanted on launch morning.
      `,
        [
          q('A campaign drives 27 dynamic page views a second, and each one takes about 400ms of PHP time. Roughly how many php-fpm workers are busy at any instant, before you add headroom?', [
            'About 11 workers',
            'About 27 workers',
            'About 68 workers',
            'About 400 workers',
          ], 0, 'Little\'s Law gives concurrency as throughput multiplied by latency, so 27 requests per second times 0.4 seconds is about 10.8 workers occupied at once.'),
          q('A 4 GB node runs php-fpm alongside MySQL, each PHP worker settles at around 110 MB of resident memory, and pm.max_children is set to 60. What happens at peak load?', [
            'Requests queue in the fpm backlog and nginx answers 502 after its read timeout',
            'php-fpm refuses to start, since it validates max_children against available RAM',
            'Memory is oversubscribed, the node begins to swap, and the OOM killer takes MySQL',
            'Each worker is capped by memory_limit, so total usage stays safely inside the 4 GB',
          ], 2, 'Sixty workers at 110 MB is 6.6 GB of demand on a 4 GB machine, so the kernel swaps and eventually kills the largest process, which on a shared node is usually the database.'),
          q('A test hits the cached home page at 2,000 requests a second with zero errors, and the team declares the site campaign ready. What did that test really measure?', [
            'The database\'s ability to serve the main query under heavy concurrency',
            'nginx and the network, because a cache hit never reaches PHP or MySQL',
            'Full stack capacity, since a cached page still runs the whole plugin stack',
            'The CDN origin shield, which absorbs the load before nginx ever sees it',
          ], 1, 'A page cache hit is served by the web server without invoking the application, so the run proves the front door is fast and says nothing about the uncacheable paths a campaign actually drives.'),
        ]
      ),
      ],
      [
      q('A save_post handler purges the whole page cache on a 40,000 page site. Editors publish 30 posts across a Tuesday morning. What is the effect on the origin?', [
        'PHP load spikes 30 separate times, because every page rebuilds from cold again',
        'Nothing changes, since nginx rebuilds the flushed entries in a background worker',
        'Only the 30 permalinks rebuild, because nginx tracks per URL cache dependencies',
        'The hit ratio improves, as stale entries are cleared before they would expire',
      ], 0, 'A full flush discards every entry, so each publish forces the entire site to be regenerated by PHP from scratch, and the people whose job is publishing become the heaviest source of origin load.'),
      q('You are moving a working single server site onto a load balancer with two identical nodes. Which change is genuinely required for correct behaviour?', [
        'Raise pm.max_children on both nodes so either one can absorb the entire peak',
        'Disable the full page cache, because two caches will serve inconsistent HTML',
        'Enable sticky sessions so that a given visitor always lands on the same node',
        'Share uploads and the object cache, and run scheduled work from one place only',
      ], 3, 'Uploads, the object cache and cron all assume a single machine, so they must be centralised before a second node can serve the same site correctly.'),
      q('Which alert is most likely to catch a broken checkout before a customer emails you about it?', [
        'Web node CPU above 80 percent for five consecutive minutes',
        'A home page uptime check returning anything other than 200 OK',
        'Completed orders per hour falling below the usual weekly baseline',
        'Free disk space on the database server dropping under 20 percent',
      ], 2, 'Order volume is the symptom a customer would feel, while CPU, uptime and disk are facts about machines that can all look perfectly healthy while payment is failing.'),
      q('A load test on staging reports p95 at 320ms, but production sits at 2.1 seconds under an identical request rate on identical code. What is the most likely explanation?', [
        'Staging holds a fraction of production\'s rows, so MySQL picks a different plan',
        'The load generator ran in the same region as staging but not as production',
        'Staging is configured with more php-fpm workers than the production nodes',
        'p95 is not comparable between environments, so the two numbers mean nothing',
      ], 0, 'Query plans depend on table size and cardinality, so a small staging dataset can make an unindexed meta query look instant while the same statement scans hundreds of thousands of rows in production.'),
      ]
    ),
    chapter(
      'Legacy Sites, Incidents, and Code Other People Run',
      'Taking over a site nobody documented, moving it without losing a single URL, recovering one that has been compromised, and shipping releases to installs you can never log into.',
      [
      lesson('Auditing a Site You Just Inherited', 13, `
A client sends you SFTP credentials, a WordPress admin login, and one sentence: "it is slow and we are scared to update anything." Nobody who built it still works there. Your instinct is to start fixing. Resist that for two days. An audit you can hand back as a document is worth more than a fix, because it turns "we are scared" into a ranked list with prices next to each line.

### Copy first, touch nothing

Take a full snapshot before you run anything against production.

\`\`\`bash
wp db export ~/audit/prod-2026-08-24.sql --add-drop-table
rsync -az deploy@prod:/var/www/html/wp-content/ ~/audit/wp-content/
\`\`\`

Everything below runs against that copy. Inherited sites hide surprises: a plugin that fires a licence check on load, a cache that clears when you list plugins, a cron job that only runs when someone touches the admin. Find those on a copy, not on the client's checkout.

### Inventory, not impressions

\`\`\`bash
wp core verify-checksums
wp plugin list --fields=name,status,version,update,auto_update
wp theme list --fields=name,status,version,parent
\`\`\`

\`wp core verify-checksums\` is the command people skip and the one that pays. It hashes every core file against the official manifest for that exact version. Silence is the answer you want. A line such as \`File doesn't verify against checksum: wp-includes/rss.php\` means somebody edited core, and on a neglected site it means you may already be in the compromise topic rather than the audit topic.

Then go looking for the code no inventory command reports. Drop-ins load before plugins and never appear on the plugins screen.

| File in wp-content | What its presence tells you |
|---|---|
| \`object-cache.php\` | A persistent object cache backend is wired in, usually Redis or Memcached |
| \`advanced-cache.php\` | A full page cache loads before plugins, so front end edits may not show |
| \`db.php\` | The database layer is replaced, often HyperDB or a query logger |
| \`maintenance.php\` | A custom maintenance screen, easy to leave switched on by accident |
| \`sunrise.php\` | Multisite domain mapping, so this is a network whether anyone said so or not |

### Three numbers that predict the bill

\`\`\`sql
SELECT ROUND(SUM(LENGTH(option_value))/1048576, 2) AS autoload_mb
  FROM wp_options WHERE autoload = 'yes';
SELECT COUNT(*) FROM wp_postmeta;
SELECT COUNT(*) FROM wp_posts WHERE post_type = 'revision';
\`\`\`

Autoload above about 1 MB is the finding that explains a slow admin better than anything else, because that payload is fetched and unserialized on every single request, including each \`admin-ajax.php\` call from the editor. One agency site measured 11 MB, and 9 MB of it was a log written into an option by a form plugin that never trimmed it.

Millions of \`wp_postmeta\` rows tell you the content model is doing work that belongs in its own table. Tens of thousands of revisions tell you nobody ever set \`WP_POST_REVISIONS\`.

### Abandoned is not the same as outdated

The plugin list gives you a version and whether an update exists. It does not tell you that a plugin was closed on wordpress.org fourteen months ago. A closed plugin shows a banner on its directory page and will never receive another fix, so the next disclosed vulnerability in it is permanent. Open the directory page for every active plugin. Anything closed, or last updated more than two years ago, goes at the top of your report as an incident with a date not yet assigned.

Check premium plugins too. A commercial plugin whose licence key expired stops receiving updates in silence: the admin shows the current version as if all is well. Ask where the keys live and who pays for them, in writing.

### Deliver the audit as a document

Rank each finding by how likely it is to bite multiplied by what it takes down. Give every line an estimate and a recommendation. The client cannot approve "the site is messy". They can approve "replace the abandoned slider plugin, two days, removes an unpatched file upload path." That document is also your protection: when something breaks in month three, the question is whether it was on the list, not whether you should have known.
      `,
        [
          q('`wp core verify-checksums` on a site you have just inherited reports that wp-includes/rss.php does not verify. What is the most likely explanation?', [
            'The installed core version is older than the current WordPress release',
            'A caching plugin copied the file and its copy has since drifted',
            'Someone edited a core file directly, or something else wrote to it',
            'The checksum API was unreachable, so the report defaulted to failing',
          ], 2, 'Checksums are compared against the official manifest for the exact version installed, so a mismatch means the file on disk differs from what WordPress shipped, which points at a manual edit or at something writing into core.'),
          q('An inherited site carries 6 MB of options with autoload set to yes. Why does that slow down every request rather than only the pages that read those values?', [
            'WordPress fetches and unserializes all autoloaded options on every request, admin-ajax included',
            'MySQL excludes autoloaded rows from its buffer pool, so each one becomes a disk read',
            'Autoloaded options skip the object cache and are queried one row at a time',
            'Each autoloaded option registers a shutdown callback that runs before the response',
          ], 0, 'Autoload is a single bulk query whose result is unserialized into memory during bootstrap on every request, so the payload cost is paid even by requests that never touch those options.'),
          q('You find wp-content/advanced-cache.php on a site you are auditing. Which working assumption should change because of it?', [
            'Object caching is active, so transients are held in Redis instead of the database',
            'The site belongs to a multisite network that has domain mapping switched on',
            'The database layer has been replaced, so $wpdb queries are routed elsewhere',
            'A full page cache loads before plugins, so front end changes may not appear',
          ], 3, 'advanced-cache.php is the full page cache drop-in and it runs before plugins load, which is why an edit you make can look like it did nothing until the cache is purged.'),
        ]
      ),
      lesson('Replatforming: Content, Redirects, and Cutover', 13, `
Six weeks after a redesign went live, organic traffic is down 38 percent. The design is better, the writing is the same, and 2,300 old URLs return 404. The redirect map had been a ticket, and somebody closed it on cutover day because the homepage loaded fine.

### Build the URL inventory from reality

The old CMS knows which URLs it publishes. It does not know which URLs the world actually requests. Union four sources and dedupe:

\`\`\`bash
zcat /var/log/nginx/access.log-2026*.gz \\
  | awk '$6 ~ /GET/ && $9 == 200 {print $7}' \\
  | sed 's/?.*//' | sort | uniq -c | sort -rn > url-hits.txt
\`\`\`

Ninety days of access logs, the Search Console page export, the old XML sitemap, and a backlink export. Logs are the source that finds what nothing else lists: the PDF linked from a printed brochure, the RSS feed a partner polls hourly, the campaign landing page still sitting in an email signature. Sort by hits and you learn the useful truth, which is that about 200 URLs carry most of the value and deserve individual attention.

### Map, do not guess

Every old URL gets one of three verdicts.

| Verdict | Response | When |
|---|---|---|
| Moved | 301 to the new path | The same content exists somewhere |
| Merged | 301 to the closest real match | Three articles became one guide |
| Gone | 410 | Nothing on the new site answers it |

Blanket redirecting the unmatched remainder to the homepage is the mistake almost everyone makes. Search engines treat a redirect to an irrelevant page as a soft 404, so the ranking is lost exactly as it would have been, and a human who clicked a specific article now lands on a homepage and leaves. A 410 is honest and gets the URL dropped cleanly.

### Generate the rules, do not hand write them

Keep the map as a CSV in the repository, ordered by traffic, and build the server config from it.

\`\`\`bash
awk -F, 'NR > 1 {print "  " $1 " " $2 ";"}' redirects.csv > /etc/nginx/redirects.map
\`\`\`

\`\`\`nginx
map $request_uri $redirect_target {
    include /etc/nginx/redirects.map;
}
server {
    if ($redirect_target) { return 301 $redirect_target; }
}
\`\`\`

At 2,300 rules a PHP redirect plugin adds a database lookup to every miss on the site, including every bot hitting \`/wp-login.php\`. The nginx map is a hash lookup and its cost stays flat.

### Prove it before DNS moves

\`\`\`bash
while IFS=, read -r old new; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: example.com' "http://10.0.0.7$old")
  [ "$code" = "301" ] || echo "MISS $old returned $code"
done < redirects.csv
\`\`\`

Run that against staging on every deploy, then run it again after cutover against the live host. Watch for chains as well: old to new to newer costs an extra round trip and dilutes the signal, so collapse every chain to a single hop by rewriting the source map, never by adding another rule.

Content itself is the easier half. Serialized values are a solved problem with \`wp search-replace\`, which you already have. What is not solved automatically is attachment parents, author IDs, and canonical tags that still point at the old domain because they were stored as absolute strings in a meta field.

### Cutover, in order

| When | Step |
|---|---|
| T minus 48h | Drop DNS TTL to 300 seconds |
| T minus 24h | Content freeze, full sync, redirect test green |
| T minus 1h | Old site read only, final delta of posts and orders |
| T zero | Switch DNS, watch 404 rate and error rate live |
| T plus 14d | Old server still running, still collecting logs |

The TTL drop has to happen two days early because the previous long TTL, often 86400 seconds, must expire from resolver caches before the short one takes effect. Leaving the old server up for two weeks catches the thing nobody inventoried: a payment webhook or a partner form handler posting to the old IP address, which shows up in the old server's logs and nowhere else.
      `,
        [
          q('During a replatform, 1,900 old URLs have no matching page on the new site. What is wrong with redirecting all of them to the homepage?', [
            'Web servers cap the number of 301 rules, so most of those redirects never fire',
            'Search engines treat them as soft 404s, so the ranking is lost anyway',
            'The homepage stops being cacheable once it is a redirect target at volume',
            'Browsers refuse to follow more than one redirect to the same destination',
          ], 1, 'A redirect to a page that does not answer the original request is treated as a soft 404, so you keep none of the ranking and you also send a real visitor somewhere unrelated.'),
          q('Why does a replatform URL inventory pull ninety days of server access logs rather than relying on the old sitemap?', [
            'Sitemaps list only URLs that returned a 200 the last time a crawler visited',
            'Logs preserve the query strings that redirect rules have to match exactly',
            'Sitemap entries expire after thirty days and regenerate incomplete',
            'Logs reveal PDFs, feeds and campaign pages the CMS never listed',
          ], 3, 'Logs record what the world actually requested, which includes assets and old landing pages that the CMS never published in a sitemap but that people and partners still hit.'),
          q('Why is the DNS TTL dropped to 300 seconds two days before a cutover instead of on the morning of it?', [
            'The previous longer TTL has to expire from resolver caches before the short one applies',
            'Registrars queue TTL edits and apply them in an overnight batch job',
            'A TTL changed on the day forces a zone re-signature and a propagation delay',
            'Certificate validation reads the TTL and fails if it changed within the hour',
          ], 0, 'Resolvers hold the record for whatever TTL they were given last, so the old long value must age out of their caches before the short one can shorten a rollback.'),
        ]
      ),
      lesson('When a Site Is Compromised', 13, `
Search Console emails at 04:12 with "this site may be hacked". You look in the uploads directory and there is \`wp-content/uploads/2026/03/wp-cache-eaa1.php\`, 40 KB of base64. Deleting it takes four seconds and fixes nothing, because a file that arrived through a hole you have not found will arrive again by Thursday.

### Preserve before you clean

Snapshot everything, files and database and logs, to storage the web server cannot write to. That archive is your only record of what happened, and every cleaning step destroys evidence.

\`\`\`bash
tar czf ~/ir/files-2026-08-25.tgz /var/www/html
mysqldump --single-transaction wp_prod > ~/ir/db-2026-08-25.sql
cp /var/log/nginx/access.log* ~/ir/
\`\`\`

Then take the site down or put it behind a holding page. Investigating while it is live keeps serving malware to visitors, keeps the browser warning in place, and gives the attacker a live view of your progress.

### Find the entry, not the exit

The shell is the exit. You want the date it landed and the request that put it there.

\`\`\`bash
find /var/www/html -name '*.php' -newermt '2026-03-01' -printf '%TF %T@ %p\\n' | sort
grep -RlE 'eval\\(|base64_decode\\(|gzinflate\\(|str_rot13\\(' --include='*.php' /var/www/html/wp-content
wp core verify-checksums
grep 'wp-cache-eaa1.php' ~/ir/access.log | head
\`\`\`

Take the file's modification time, then read the access log for the ten minutes before it. You are looking for a POST to an upload endpoint, a request to a plugin path you can match against a published advisory, or a burst of login attempts that stops abruptly because one succeeded.

### Where backdoors actually sit

| Place | What to look for |
|---|---|
| \`wp_users\` and \`wp_usermeta\` | An administrator created at 03:00, or a subscriber whose \`wp_capabilities\` was rewritten |
| \`wp_options\` | Injected script in a theme option, a changed \`siteurl\`, extra entries in \`active_plugins\` |
| Cron | \`wp cron event list\` showing random hook names that rewrite files on a schedule |
| \`mu-plugins/\` | Loads unconditionally and never appears on the plugins screen |
| \`.htaccess\` or server config | Redirects that fire only for Googlebot or only for mobile user agents |
| \`~/.ssh/authorized_keys\` | Access that survives every WordPress fix you make |

The last two rows explain why "the security plugin scans clean" is not an all clear. A scanner reads PHP inside the WordPress tree. It cannot see a key in the account's home directory, and it will never trigger a cloaked redirect that fires only for a user agent it does not send.

### Rebuild, do not disinfect

Cleaning infected files one at a time is a losing game. Replace them wholesale from sources you trust, keeping only \`wp-config.php\`, the uploads directory after scanning it, and the database after inspecting it.

\`\`\`bash
wp core download --force --version=$(wp core version)
wp plugin install $(wp plugin list --status=active --field=name) --force
wp config shuffle-salts
wp user list --field=ID | xargs -n1 -I{} wp user reset-password {} --skip-email
\`\`\`

\`shuffle-salts\` rewrites the authentication keys in \`wp-config.php\`, which invalidates every login cookie in existence and ends the attacker's session along with everyone else's. Rotate the database password, SFTP and hosting panel credentials, and every API key stored in the options table, because all of them were readable for as long as the shell was there.

### The backup trap

"Restore last Tuesday" is the most common wrong answer in this whole topic. If the file timestamps say 3 March and today is 25 August, a 60 day backup rotation means every copy you hold already contains the backdoor. Establish the date first, then choose a restore point that predates it. When none is old enough, rebuild from clean sources and migrate only the content.

One more obligation. If the site stored customer names, addresses or orders, a compromise is a personal data breach, and most jurisdictions put a clock on notifying the regulator. Start that conversation on day one, not after the cleanup.
      `,
        [
          q('File timestamps put the backdoor on 3 March. It is now 25 August and your host keeps 60 days of backups. What follows from that?', [
            'Every backup you hold already contains the backdoor, so restoring one reinfects the site',
            'The oldest backup predates the incident, so restoring it is the fastest clean fix',
            'Backups capture only the database, so a PHP file cannot be inside one',
            'Restoring any backup is safe because file permissions are reset during restore',
          ], 0, 'A 60 day rotation only reaches back to late June, which is months after the file landed, so every retained copy includes it and the restore puts the attacker straight back in.'),
          q('A security plugin reports the site clean, yet the attacker regains access two days after the cleanup. Which persistence route best explains that?', [
            'An outdated plugin whose version still displays as current on the plugins screen',
            'A transient holding a session token that survived the cache being flushed',
            'An SSH key added to the account\'s authorized_keys file outside WordPress',
            'A revision row in wp_posts holding the original text of the theme footer',
          ], 2, 'Scanners inspect PHP inside the WordPress tree, so a key sitting in the account home directory is invisible to them while still granting full shell access after every WordPress level fix.'),
          q('After rebuilding a compromised site from clean sources, why run wp config shuffle-salts?', [
            'It regenerates the table prefix, which breaks any injected queries left behind',
            'It invalidates every existing login cookie, ending the attacker\'s sessions',
            'It re-signs plugin files so tampered copies fail their next checksum test',
            'It rotates the database password held in wp-config.php automatically',
          ], 1, 'Authentication cookies are signed with the salts, so replacing the salts makes every cookie in circulation invalid and forces a fresh login for everyone including whoever broke in.'),
        ]
      ),
      lesson('Releasing Code to Sites You Cannot Log Into', 13, `
You tag 1.4.0 on Tuesday afternoon. By Wednesday morning support has 300 threads reading "white screen after update". The cause is one \`readonly\` property, perfectly fine on your PHP 8.2 laptop and a parse error on the eleven percent of installs still running PHP 7.4. You cannot log into a single one of those sites. That asymmetry shapes every decision below.

### The guard has to survive parsing

Here is the version almost everyone writes first.

\`\`\`php
<?php
/** Plugin Name: Cortex Events */
namespace Cortex\\Events;

require __DIR__ . '/vendor/autoload.php';

if ( version_compare( PHP_VERSION, '8.1', '<' ) ) {
	return;
}
new Plugin();
\`\`\`

It fails on the hosts it was written to protect. PHP parses an entire file before executing its first statement, and the autoloader is pulled in before the check anyway. Any modern syntax inside those files is a fatal at parse time, long before \`version_compare\` gets a turn.

\`\`\`php
<?php
/**
 * Plugin Name: Cortex Events
 * Version:     1.4.1
 * Requires PHP: 8.1
 * Requires at least: 6.4
 * Update URI:  https://updates.cortex.dev/cortex-events
 */
if ( version_compare( PHP_VERSION, '8.1', '<' ) ) {
	add_action( 'admin_notices', function () {
		echo '<div class="notice notice-error"><p>Cortex Events requires PHP 8.1.</p></div>';
	} );
	return;
}
require __DIR__ . '/bootstrap.php';
\`\`\`

The entry file now contains nothing a very old parser would choke on. Everything modern lives behind that \`require\`, in files the parser never opens when the guard returns early.

| Header | What it actually does |
|---|---|
| \`Requires PHP\` | The updater hides the update from hosts below that version |
| \`Requires at least\` | Same protection for the WordPress version |
| \`Update URI\` | Stops wordpress.org serving a same named plugin over your private one |
| \`Stable tag\` in readme.txt | Decides which version the directory ships |

### Stable tag is the release switch

On wordpress.org SVN the readme.txt sitting in **trunk** is what the download server reads. Copy your code to \`/tags/1.4.0\` and forget to bump trunk's \`Stable tag\`, and nobody receives the release while every log says it published fine. Write \`Stable tag: trunk\` and every install downloads whatever you committed last, including the half finished refactor.

### Auto updates never call your activation hook

\`register_activation_hook\` fires when a plugin is activated, not when it is updated. An auto update writes the new files over the old ones and the plugin keeps running under the same activation. Any table or option your new code needs must be created by a versioned upgrade routine.

\`\`\`php
add_action( 'plugins_loaded', function () {
	$from = get_option( 'cortex_events_db_version', '0' );
	if ( version_compare( $from, CORTEX_EVENTS_DB_VERSION, '>=' ) ) {
		return;
	}
	cortex_events_migrate( $from );
	update_option( 'cortex_events_db_version', CORTEX_EVENTS_DB_VERSION, false );
} );
\`\`\`

That routine has to be idempotent and it has to cope with jumping from 1.0.2 straight to 1.4.1, because a site that has not updated in two years will install yours tomorrow.

### You cannot roll back, only roll forward

There is no percentage rollout on wordpress.org and no remote button that reverts twelve thousand installs. The only lever you own is how fast 1.4.1 ships, so optimise for that. Keep releases small enough that one release carries one meaningful change, which makes the cause of any regression obvious. Run the version matrix in CI against the oldest PHP and WordPress your headers claim, before tagging rather than after. Keep a changelog written for a support agent, not a compiler. And do not publish on a Friday, because the fix window is the part you cannot buy back.
      `,
        [
          q('Your main plugin file compares PHP_VERSION and returns early, yet sites on PHP 7.4 still show a white screen after updating. Why?', [
            'PHP_VERSION reports the CLI binary version rather than the one serving requests',
            'WordPress loads plugin files alphabetically, so yours runs after the others',
            'version_compare needs a third argument or it always evaluates as null',
            'The file is parsed in full before it runs, so modern syntax fatals first',
          ], 3, 'PHP compiles the whole file, and anything it requires, before executing any statement, so unsupported syntax raises a parse error while the guard is still waiting to run.'),
          q('You commit code to /tags/1.4.0 in the wordpress.org SVN repository but leave trunk\'s readme.txt reading Stable tag: 1.3.9. What do users receive?', [
            '1.4.0, because the newest tag directory always wins on the download server',
            '1.3.9, because the Stable tag in trunk decides what the directory serves',
            'Nothing, because the mismatch marks the plugin broken until it is corrected',
            'Both versions, offered side by side on the plugin update screen',
          ], 1, 'The directory reads the Stable tag line from trunk\'s readme.txt to decide which tag to package, so an untouched trunk readme leaves the previous release in place no matter what you tagged.'),
          q('A plugin creates its custom table inside register_activation_hook. Sites that auto update to 1.4.0 then hit a missing table error. What went wrong?', [
            'Auto updates run under a database user that lacks CREATE TABLE privileges',
            'The activation hook fires but its output is discarded during an auto update',
            'Activation hooks do not fire on update, only when a plugin is activated',
            'dbDelta refuses to run outside an admin request, which auto updates are not',
          ], 2, 'An update replaces files while the plugin stays active, so activation never happens again and any schema work must live in a versioned upgrade routine that runs on load.'),
        ]
      ),
      ],
      [
      q('An inherited site runs a plugin whose wordpress.org page shows a closed banner. Why is that more urgent than a plugin that is three versions behind?', [
        'No fix is coming, and closures often follow an unpatched security report',
        'Closed plugins stop functioning once the next major WordPress release lands',
        'The updater deletes closed plugins automatically at the next cron run',
        'Closed plugins lose their translation files, which breaks the admin screens',
      ], 0, 'A closed plugin has been removed from distribution and will never be patched again, and closures are frequently the result of a reported vulnerability, so the risk is permanent rather than pending.'),
      q('You keep the old server running for two weeks after a cutover. Which problem is that most likely to catch?', [
        'Search engines needing time to recrawl and index the new site\'s sitemap',
        'The new server\'s object cache warming up slowly under real traffic',
        'Editors who saved drafts on the old site during the content freeze',
        'A webhook or form handler still posting to the old server\'s address',
      ], 3, 'Integrations configured with a hardcoded address or IP keep calling the old host, and the only place that traffic shows up is in the old server\'s logs while it is still running.'),
      q('Which single action does the most to lock an attacker out of a site you have just rebuilt from clean sources?', [
        'Reinstalling the active theme from a fresh copy of the original zip file',
        'Rotating every credential and salt, then forcing all sessions to end',
        'Adding a firewall rule blocking the IP address seen in the access logs',
        'Setting DISALLOW_FILE_EDIT to true so the admin file editor disappears',
      ], 1, 'Everything stored on the server was readable while the shell was present, so replacing files alone leaves stolen passwords, API keys and live cookies working until they are rotated.'),
      q('Why does a plugin distributed to thousands of installs need smaller releases than a plugin you deploy to one site yourself?', [
        'The update server charges by the megabyte it delivers to installs each day',
        'WordPress rejects updates whose zip archive exceeds a fixed size threshold',
        'You cannot roll back a remote install, so shipping a fix is the only lever',
        'Larger diffs take longer to mirror across the download CDN worldwide',
      ], 2, 'There is no remote revert for installs you do not control, so recovery means publishing another version, and a small release makes the cause obvious and the fix fast.'),
      ]
    ),
  ],
  final: [
    q('When must custom post types and taxonomies be registered?', [
      'On after_setup_theme',
      'On the init hook',
      'On wp_head',
      'Directly in wp-config.php',
    ], 1, 'init runs after WordPress loads but before the URL is parsed into the main query, which routing and rewrite rules depend on.'),
    q('Which template does WordPress use for a single "event" post when single-event.php does not exist?', [
      'archive-event.php',
      'page.php',
      'single.php',
      '404.php',
    ], 2, 'The hierarchy falls from the most specific name to single.php, then singular.php, and only then index.php.'),
    q('Why is wp_reset_postdata() required after a secondary WP_Query loop?', [
      'It frees database connections held open by the secondary query\'s results',
      'It restores the global $post so later template tags use the right post',
      'It clears the object cache',
      'It re-runs the main query',
    ], 1, 'The secondary loop leaves the global $post on its last result, so everything after it silently renders that post.'),
    q('A filter callback returns nothing on one branch. What happens?', [
      'WordPress keeps the original value',
      'The next filter in the chain is skipped and the original value returned',
      'null replaces the value, so output disappears on that path',
      'A fatal error is thrown',
    ], 2, 'apply_filters uses whatever the callback returns, and a missing return means null.'),
    q('Which enqueue helper resolves to the child theme when one is active?', [
      'get_template_directory_uri()',
      'get_stylesheet_directory_uri()',
      'plugins_url()',
      'content_url()',
    ], 1, 'get_template_* always points at the parent; get_stylesheet_* points at the active theme.'),
    q('Why use get_template_part() rather than include() for a reusable fragment?', [
      'It is faster',
      'It lets a child theme override the file and fires related hooks',
      'It automatically escapes all output printed inside the template part',
      'include() does not work inside the Loop or in child themes',
    ], 1, 'get_template_part() runs the theme lookup, so child themes can replace the fragment; a hardcoded include cannot be overridden.'),
    q('You need to filter thousands of posts by an attribute users browse. Best model?', [
      'Post meta with a meta_query',
      'A registered taxonomy',
      'A separate post type for each value',
      'A serialised array in wp_options',
    ], 1, 'Term relationships are indexed and built for grouping; meta_value has no index and degrades as content grows.'),
    q('What does omitting permission_callback from register_rest_route cause?', [
      'The route returns a 404 until a permission_callback is registered later',
      'The route is effectively public and WordPress logs incorrect usage',
      'The args array is ignored',
      'The response is not cached',
    ], 1, 'permission_callback is the route\'s only authorisation gate, so leaving it out exposes the endpoint to anyone.'),
    q('Which WP_Query argument most often causes a production outage?', [
      'no_found_rows => true',
      'posts_per_page => -1',
      'fields => ids',
      'update_post_meta_cache => false',
    ], 1, 'It loads every matching post into memory — harmless on a test site, fatal at scale.'),
    q('A save handler verifies a nonce. What else is required before writing data?', [
      'A second nonce for the redirect',
      'A current_user_can check for the specific object',
      'Escaping the value with esc_html before saving',
      'Flushing rewrite rules',
    ], 1, 'A nonce proves the request origin; only a capability check proves the user is allowed to perform the action.'),
    q('Where does a static block\'s markup actually live?', [
      'In post_content, so changing save() invalidates every existing instance',
      'In wp_postmeta, keyed by the block name and the post ID of each page using it',
      'In the styles section of theme.json',
      'In the render file named by block.json',
    ], 0, 'Static blocks serialise their HTML into the post, so the editor compares a fresh save() against the stored markup and flags any difference.'),
    q('What does declaring a colour palette in theme.json give you that add_theme_support("editor-color-palette") does not?', [
      'Automatic regeneration of existing image sizes and thumbnails whenever the palette changes',
      'Support for the classic editor',
      'Preset CSS custom properties and utility classes in both editor and front end',
      'A REST endpoint returning the palette',
    ], 2, 'theme.json presets emit --wp--preset--color--* variables and has-*-color classes everywhere, and they supersede the older add_theme_support call entirely.'),
    q('You are copying a production database down to staging. Which step must not be skipped?', [
      'Regenerating thumbnails',
      'Deactivating every plugin and switching to a default theme before the copy',
      'Clearing the browser cache',
      'A serialisation-aware search-replace of the domain, then a rewrite flush',
    ], 3, 'URLs are stored throughout the database including inside serialised options, and only a serialisation-aware replace rewrites them without corrupting the values.'),
    q('A live site goes blank straight after a plugin update. What is the correct first move?', [
      'Reinstall WordPress core',
      'Read debug.log and the PHP error log, then bisect by deactivating plugins with WP-CLI',
      'Enable WP_DEBUG_DISPLAY on the live site so visitors can report the exact error message they see',
      'Increase posts_per_page on the affected archive',
    ], 1, 'A white screen is a hidden fatal error, and the logs name the exact file and line before any guessing starts.'),
    q('A team is converting slow integration tests into fast unit tests that stub get_post_meta() with Brain Monkey. Which of these tests loses essentially all of its value in that conversion?', [
      'One asserting that a sold count above the seat count still reads as sold out, not negative',
      'One asserting the save handler stores the seat count under the key the badge reads',
      'One asserting the urgency label appears once ten or fewer seats remain unsold',
      'One asserting the label reads as available while most of the seats are unsold',
    ], 1, 'A stubbed get_post_meta() returns whatever the test told it to, so the test can never disagree with the save handler about which meta key is written; only a test that writes through the real save path and reads back through the real reader catches a renamed key, which is exactly why the integration layer exists above the unit layer.'),
    q('Two active plugins each bundle their own Composer copy of GuzzleHttp\\Client, theirs on version 5 and yours on version 7, and your code now fatals on an undefined method. Which fix actually removes this class of problem?', [
      'Guard your vendor/autoload.php require with class_exists( GuzzleHttp\\Client::class ) so nothing loads twice',
      'Rename your plugin directory so it sorts first and your autoloader is registered before theirs is',
      'Rewrite the bundled dependency into a namespace only your plugin uses, as a step in your build',
      'Call spl_autoload_unregister on the other plugin\'s autoloader once the plugins_loaded hook has fired',
    ], 2, 'PHP keeps one class table per request, so a name like GuzzleHttp\\Client can only ever mean whichever copy an autoloader resolved first; prefixing your dependency at build time gives it a name nothing else on the site can claim, while the class_exists guard reports true and tells the truth about the wrong class, and winning the alphabetical race simply moves the fatal into the other plugin.'),
    q('A site gets measurably slower every week. wp_options holds a 300KB _transient_cortex_feed row with autoload set to yes, and the cron option has grown to several megabytes. Which pair of mistakes explains both rows?', [
      'A transient stored with no expiry, and reschedule checks whose arguments do not match the scheduled ones',
      'A missing object cache drop-in, which pushes both the transients and the cron entries into the options table',
      'A payload above wp_max_autoloaded_option_size, and DISABLE_WP_CRON left on so nothing due was ever cleared',
      'Transients written through add_option, and a recurring job registered again on every plugins_loaded hook',
    ], 0, 'A transient given no expiry has no timeout row, so WordPress stores it autoloaded and the whole payload is unserialized on every request, and wp_next_scheduled keys entries by an md5 of the serialized argument array, so checking with [ 42 ] against a job scheduled with [ \'42\' ] reports nothing scheduled and appends another duplicate on every page load.'),
    q('A campaign will push roughly 27 requests a second at /cart/ and /checkout/, each spending about 400ms in PHP, and your two nodes are configured with pm.max_children = 4. What should you expect at launch, and why?', [
      'Latency roughly doubles but nothing actually fails, because php-fpm queues requests instead of refusing them',
      'Little changes, since those two paths are excluded from the page cache and are therefore served by nginx',
      'Memory becomes the binding constraint first, so the OOM killer stops MySQL before any worker queue builds',
      'About eleven workers are busy at the average alone, so eight is short and nginx begins returning 502s',
    ], 3, 'Concurrency is throughput multiplied by latency, so 27 times 0.4 puts roughly 10.8 workers busy at the average and eight children across the fleet cannot even carry the mean, let alone the peak; because those paths are deliberately excluded from the page cache, every one of those requests reaches PHP and the worker count is the number that decides whether the campaign survives.'),
    q('A single-server site is moved onto three nodes behind a load balancer that terminates TLS, with no code changes at all. Which reported symptom is caused by the balancer itself rather than by there now being more than one node?', [
      'Newly uploaded images return 404 on about two requests in three, then load correctly after a refresh',
      'The nightly digest email is delivered two or three times over to every subscriber on the list',
      'Every visitor hits a redirect loop that the browser eventually refuses to follow any further',
      'A multi step form loses what was typed into it on roughly one submission in two, apparently at random',
    ], 2, 'With TLS terminated at the balancer, PHP sees a plain HTTP request, so is_ssl() returns false, WordPress builds http:// canonical URLs and the balancer redirects them straight back to https:// forever; the other three symptoms are all per node state, namely uploads written to one local disk, three schedulers racing on the same due job, and file based PHP sessions that only exist on the node that created them.'),
    q('During an audit, wp core verify-checksums reports that wp-includes/rss.php does not verify, and the file\'s modification time reads 3 March. It is now 25 August and the host keeps a rolling 60 days of backups. What follows from that?', [
      'Every backup still retained was taken after the file changed, so a restore brings the modification back',
      'The mismatch means a core update was interrupted, so restoring the newest backup will settle the difference',
      'The oldest retained backup safely predates the change, so restoring it is the cleanest way to recover',
      'Core\'s own integrity check has already isolated the file, so it is not being executed on live requests',
    ], 0, 'Sixty days back from 25 August only reaches late June, which is months after the file was altered on 3 March, so every copy in the rotation already contains the change; establishing the date something landed has to come before choosing a restore point, and when no retained backup is old enough the answer is to rebuild from clean sources and migrate only the content.'),
    q('A theme contains archive.php, category.php and index.php, but no category-news.php. Which file renders the archive for the News category?', [
      'archive.php',
      'category.php',
      'index.php',
      'single.php',
    ], 1, 'The hierarchy tries category-news.php, then category.php, then archive.php, then index.php, and uses the first file the theme actually has.'),
    q('Which conditional tag returns true on a single blog post, a single page and a single custom post type entry alike?', [
      'is_single()',
      'is_page()',
      'is_archive()',
      'is_singular()',
    ], 3, 'is_single() excludes pages and is_page() excludes posts, while is_singular() covers a single entry of any post type.'),
    q('A sidebar must show the five newest events from the event post type. Which WP_Query arguments fit?', [
      '[ \'post_type\' => \'event\', \'posts_per_page\' => 5 ]',
      '[ \'post_type\' => \'event\', \'limit\' => 5 ]',
      '[ \'type\' => \'event\', \'posts_per_page\' => 5 ]',
      '[ \'post_type\' => \'event\', \'nopaging\' => 5 ]',
    ], 0, 'posts_per_page caps the count and WP_Query orders by date, newest first, by default; limit and type are not WP_Query arguments, and nopaging returns every event.'),
    q('Which line in a child theme\'s style.css header tells WordPress which parent theme it extends?', [
      'Template: storefront',
      'Parent Theme: storefront',
      'Theme Name: storefront',
      'Extends: storefront',
    ], 0, 'The Template header holds the parent theme\'s folder name; Theme Name is the child\'s own display name, and the other headers are not recognised.'),
    q('What does passing true as the fifth argument to wp_enqueue_script() do?', [
      'Loads the script only on the WordPress admin screens',
      'Marks the script as a dependency for every other script',
      'Prints the script in the footer instead of the head',
      'Loads the script asynchronously from a public CDN',
    ], 2, 'The fifth argument is in_footer: true makes WordPress print the script tag from wp_footer(), near the closing body tag, instead of from wp_head().'),
    q('A theme registers a Customizer setting called cortex_footer_note. Which line prints its value safely in footer.php?', [
      'echo get_option( \'cortex_footer_note\', \'Built in Lahore\' );',
      'echo esc_html( get_theme_mod( \'cortex_footer_note\' ) );',
      'echo esc_html( get_post_meta( 0, \'cortex_footer_note\', true ) );',
      'echo esc_html( get_option( \'theme_mod_cortex_footer_note\' ) );',
    ], 1, 'Customizer values are theme mods, read with get_theme_mod() from one array stored per theme, and anything printed into HTML still goes through esc_html().'),
    q('Two callbacks are attached to the same action, one with priority 5 and one with the default priority. Which runs first?', [
      'The priority 5 callback, because lower numbers run earlier',
      'The default one, because priority 10 always runs first',
      'Whichever callback\'s file happened to be loaded first',
      'Both run at once, since actions execute in parallel',
    ], 0, 'Callbacks run in ascending priority order and the default priority is 10, so priority 5 runs first; callbacks with equal priority run in the order they were added.'),
    q('What makes a PHP file inside wp-content/plugins/cortex-events/ appear on the Plugins screen?', [
      'A matching entry added to wp-config.php',
      'A readme.txt file in the same plugin folder',
      'A header comment containing at least Plugin Name',
      'A class that extends WordPress\'s WP_Plugin class',
    ], 2, 'WordPress scans plugin files for a header comment, and a Plugin Name line is the minimum it needs to list the plugin.'),
    q('Your plugin builds a list of event statuses, and other developers should be able to change that list without editing your code. What should you add?', [
      'A global variable they can overwrite from functions.php',
      'A do_action( \'cortex_statuses\' ) call after the list is used',
      'A comment asking them to edit the array in your plugin file',
      '$statuses = apply_filters( \'cortex_event_statuses\', $statuses );',
    ], 3, 'A custom filter passes the value through any callbacks other code attaches and uses what comes back, which is how WordPress code offers safe extension points.'),
    q('A plugin calls `register_rest_route( \'cortex/v1\', \'/events/(?P<id>\\d+)\', $args )`. Which URL reaches it for event 42?', [
      '/wp-json/wp/v2/events/42',
      '/wp-json/cortex/v1/events/42',
      '/cortex/v1/events/42',
      '/wp-admin/admin-ajax.php?id=42',
    ], 1, 'Custom routes live under /wp-json/ followed by the namespace and the route, so cortex/v1 plus /events/42; wp/v2 is core\'s own namespace.'),
    q('An event post type is registered with `\'has_archive\' => true` and a rewrite slug of events. What does that give the site?', [
      'A download of every event as a single zip file',
      'A trash folder that keeps deleted events for 30 days',
      'A revision history for each event in the editor',
      'An archive page listing the events at /events/',
    ], 3, 'has_archive enables a post type archive at the rewrite slug, rendered by archive-event.php if the theme has it and archive.php otherwise.'),
    q('A save handler calls `add_post_meta( $id, \'venue\', $venue )` every time an event is saved. After three saves, what does the database hold?', [
      'Three venue rows for that event, one per save',
      'One venue row holding the latest value',
      'One venue row holding the first value only',
      'No venue rows, because the calls conflict',
    ], 0, 'add_post_meta adds a new row unless its unique argument is true, so repeated saves pile up duplicates; update_post_meta is the call that replaces the value.'),
    q('A user-supplied value is printed inside a title="..." attribute in a template. Which function should escape it at output?', [
      'esc_url()',
      'sanitize_text_field()',
      'esc_attr()',
      'esc_sql()',
    ], 2, 'Escaping depends on the output context, and esc_attr() is the one for HTML attribute values; sanitize_text_field() cleans input for storage and esc_sql() is for queries.'),
    q('A plugin runs `$wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_author = $author" )`, with $author taken straight from the request. What is the fix?', [
      'Wrap the whole query string in esc_html() before running it',
      'Use $wpdb->prepare() with a %d placeholder for the author',
      'Cast the query to an array before passing it to get_results()',
      'Switch to get_var() so only one value can come back',
    ], 1, 'Request data must reach SQL through $wpdb->prepare(), which binds the author as an integer with %d, instead of being interpolated into the query string.'),
    q('In a block plugin, which file is the single source of truth for the block\'s name, attributes and supported features?', [
      'index.php in the plugin root',
      'style.css in the theme folder',
      'package.json in the block folder',
      'block.json in the block folder',
    ], 3, 'block.json declares the block\'s name, attributes and supports, and both PHP and JavaScript read it, so it is the one definition both sides share.'),
    q('A block shows the three latest events and must update when new events are published, without anyone re-saving the pages that use it. How should it be built?', [
      'As a dynamic block whose render.php builds the markup on each request',
      'As a static block whose save() stores the three events in post content',
      'As a pattern copied into every page that needs the list',
      'As a block style variation registered on the core list block',
    ], 0, 'A static block\'s markup is frozen into post content when the page is saved, while a dynamic block renders on the server at request time and so always shows current events.'),
    q('In theme.json, what is the difference between the settings and styles sections?', [
      'settings holds PHP code, while styles holds plain CSS files',
      'settings applies to the admin area, and styles to the front end',
      'settings decides what the editor offers; styles sets site defaults',
      'settings is required in block themes, and styles in classic themes',
    ], 2, 'settings controls what appears in the editor UI, such as palettes and font sizes, while styles sets the default values applied across the site.'),
    q('With WP_DEBUG and WP_DEBUG_LOG both set to true, where are PHP errors written by default?', [
      'The browser console of whoever loads the page',
      'wp-content/debug.log',
      'The wp_options table under a debug_log row',
      'An email sent to the site\'s admin address',
    ], 1, 'WP_DEBUG_LOG set to true writes errors to wp-content/debug.log, which is why WP_DEBUG_DISPLAY can stay false on a live site.'),
    q('Which constant in wp-config.php sets the value that wp_get_environment_type() returns?', [
      'WP_DEBUG_ENVIRONMENT',
      'WP_ENVIRONMENT_NAME',
      'WP_SITE_ENVIRONMENT',
      'WP_ENVIRONMENT_TYPE',
    ], 3, 'WP_ENVIRONMENT_TYPE, set to local, development, staging or production, is what wp_get_environment_type() reports, so code can behave differently per environment.'),
    q('What does Brain Monkey let a WordPress unit test do?', [
      'Stub WordPress functions like get_post_meta without loading WordPress',
      'Run the test inside a real browser against a live WordPress install on staging',
      'Create posts in a real database and roll them back after each test',
      'Check that PHP files follow the WordPress coding standards',
    ], 0, 'Brain Monkey fakes WordPress functions and hooks so plain PHP logic can be tested in milliseconds without booting WordPress or a database.'),
    q('cortex_event_badge( $post_id ) reads two meta values and then decides which badge label to show. Which change makes the decision logic testable with plain PHPUnit?', [
      'Call the function from a browser test instead of a unit test',
      'Add a global flag that makes the function skip get_post_meta while tests run',
      'Move the decision into a function taking the two values as arguments',
      'Load WordPress inside every unit test so get_post_meta works',
    ], 2, 'Splitting the pure decision from the WordPress calls lets you test it with plain values and no WordPress at all, while the thin wrapper that reads meta is covered by integration tests.'),
    q('composer.json maps the namespace prefix Cortex\\Events\\ to the src/ folder under psr-4. Where must the class Cortex\\Events\\Admin\\SettingsPage live?', [
      'src/SettingsPage.php',
      'src/Admin/SettingsPage.php',
      'src/Cortex/Events/Admin/SettingsPage.php',
      'admin/settings-page.php',
    ], 1, 'PSR-4 strips the mapped prefix Cortex\\Events\\ and turns the rest of the namespace into folders under src/, so Admin\\SettingsPage becomes src/Admin/SettingsPage.php.'),
    q('Why should every function, class and hook name in a distributed plugin carry a unique namespace or prefix?', [
      'Prefixed names let WordPress translate the plugin\'s strings',
      'Prefixed names make PHP execute the plugin\'s code faster',
      'Namespaces are required before any hook will fire at all',
      'All plugins share one PHP runtime, so names can collide',
    ], 3, 'Every active plugin and theme runs in the same PHP process, so two functions or classes with the same name cause a fatal error; a unique prefix or namespace prevents that.'),
    q('A plugin names its custom table `$wpdb->prefix . \'cortex_ticket_scans\'` instead of hard-coding wp_cortex_ticket_scans. Why?', [
      'The prefix makes the table\'s queries run faster',
      'WordPress deletes any table that does not use it',
      'Sites can use a table prefix other than wp_',
      'It encrypts the table name against SQL injection',
    ], 2, 'The table prefix is configurable in wp-config.php and differs per site on multisite, so building names from $wpdb->prefix keeps the plugin working everywhere.'),
    q('No persistent object cache such as Redis is installed. What happens to a value stored with wp_cache_set() when the request ends?', [
      'It is discarded, since the default cache lasts one request',
      'It is saved to the wp_options table automatically',
      'It stays in memory until the server restarts',
      'It is written to a transient that expires in an hour',
    ], 0, 'Without a persistent backend, WordPress\'s object cache lives only for the current request; Redis or Memcached plus a drop-in is what makes it survive between requests.'),
    q('A fully cached product page must still greet the logged-in visitor by name and show their cart count. What does the course recommend?', [
      'Turn off page caching for the product page entirely',
      'Cache the shell and fill those slots from an uncached REST call',
      'Write the first visitor\'s name and cart count into the shared cached copy that everyone then receives',
      'Print the greeting from PHP and set a longer cache lifetime',
    ], 1, 'Caching the shared page for everyone and loading the few personal bits through one small uncached request keeps the page cacheable without leaking anyone\'s details.'),
    q('Behind your load balancer, why should the code trust only the X-Forwarded-For hop that your own balancer appended?', [
      'Earlier hops are always IPv6 addresses PHP cannot parse',
      'The header is removed by WordPress before plugins see it',
      'Only the last hop is available when TLS is terminated',
      'Visitors can forge the rest, defeating rate limits and blocks',
    ], 3, 'Anyone can send an X-Forwarded-For header, so only the value your balancer added is trustworthy; trusting the whole header lets visitors fake their IP and bypass throttles and blocklists.'),
    q('During a replatform, an old article now lives at a new URL with the same content. Which response should the old URL return?', [
      'A 404 page with a search box',
      'A 302 redirect to the homepage',
      'A 301 redirect to the new URL',
      'A 200 with a copy of the article',
    ], 2, 'A permanent 301 to the matching new URL sends visitors and search engines to the same content and carries its ranking across; a copy duplicates content and a homepage redirect loses it.'),
    q('You find and delete a backdoor file in wp-content/uploads on a hacked site. Why is that not enough?', [
      'The hole it came through, and any other backdoors, may remain',
      'Deleted PHP files are restored automatically by WordPress',
      'Uploads folders cannot be changed without a core reinstall',
      'Search engines keep serving the file from their own cache',
    ], 0, 'A dropped file is a symptom: the vulnerability, stolen credentials or other persistence remain, which is why a compromised site is rebuilt from clean sources with its secrets rotated.'),
    q('Your plugin\'s next release uses PHP 8.1 syntax. Which plugin header line stops WordPress offering the update to sites on older PHP?', [
      'Tested up to: 8.1',
      'Stable tag: 8.1',
      'Requires at least: 8.1',
      'Requires PHP: 8.1',
    ], 3, 'Requires PHP states the minimum PHP version, so sites below it are not offered the update; Requires at least and Tested up to refer to WordPress versions.'),
  ],
});
