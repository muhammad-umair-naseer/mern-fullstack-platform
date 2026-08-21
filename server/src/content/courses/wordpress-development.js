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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
  ],
  final: [
    q('When must custom post types and taxonomies be registered?', [
      'On after_setup_theme',
      'On the init hook',
      'On wp_head',
      'Directly in wp-config.php',
    ], 1, 'init runs after WordPress loads but before the URL is parsed into the main query, which routing and rewrite rules depend on.'),
    q('Which template does WordPress use for a single "event" post when single-event.php does not exist?', [
      'archive-event.php', 'page.php', 'single.php', '404.php',
    ], 2, 'The hierarchy falls from the most specific name to single.php, then singular.php, and only then index.php.'),
    q('Why is wp_reset_postdata() required after a secondary WP_Query loop?', [
      'It frees database connections',
      'It restores the global $post so later template tags describe the right post',
      'It clears the object cache',
      'It re-runs the main query',
    ], 1, 'The secondary loop leaves the global $post on its last result, so everything after it silently renders that post.'),
    q('A filter callback returns nothing on one branch. What happens?', [
      'WordPress keeps the original value',
      'The next filter in the chain is skipped',
      'null replaces the value, so the output disappears on that path',
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
      'It lets a child theme override the file and fires the associated hooks',
      'It automatically escapes output',
      'include() does not work inside the Loop',
    ], 1, 'get_template_part() runs the theme lookup, so child themes can replace the fragment; a hardcoded include cannot be overridden.'),
    q('You need to filter thousands of posts by an attribute users browse. Best model?', [
      'Post meta with a meta_query',
      'A registered taxonomy',
      'A separate post type for each value',
      'A serialised array in wp_options',
    ], 1, 'Term relationships are indexed and built for grouping; meta_value has no index and degrades as content grows.'),
    q('What does omitting permission_callback from register_rest_route cause?', [
      'The route returns a 404',
      'The route is effectively public and WordPress reports incorrect usage',
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
      'In post_content, which is why changing save() invalidates every existing instance',
      'In wp_postmeta, keyed by the block name',
      'In the styles section of theme.json',
      'In the render file named by block.json',
    ], 0, 'Static blocks serialise their HTML into the post, so the editor compares a fresh save() against the stored markup and flags any difference.'),
    q('What does declaring a colour palette in theme.json give you that add_theme_support("editor-color-palette") does not?', [
      'Automatic regeneration of existing image sizes',
      'Support for the classic editor',
      'Preset CSS custom properties and utility classes applied in both the editor and the front end',
      'A REST endpoint returning the palette',
    ], 2, 'theme.json presets emit --wp--preset--color--* variables and has-*-color classes everywhere, and they supersede the older add_theme_support call entirely.'),
    q('You are copying a production database down to staging. Which step must not be skipped?', [
      'Regenerating thumbnails',
      'Deactivating every plugin',
      'Clearing the browser cache',
      'A serialisation-aware search-replace of the domain, followed by a rewrite flush',
    ], 3, 'URLs are stored throughout the database including inside serialised options, and only a serialisation-aware replace rewrites them without corrupting the values.'),
    q('A live site goes blank straight after a plugin update. What is the correct first move?', [
      'Reinstall WordPress core',
      'Read debug.log and the PHP error log, then bisect by deactivating plugins with WP-CLI',
      'Enable WP_DEBUG_DISPLAY so visitors can report the message',
      'Increase posts_per_page on the affected archive',
    ], 1, 'A white screen is a hidden fatal error, and the logs name the exact file and line before any guessing starts.'),
  ],
});
