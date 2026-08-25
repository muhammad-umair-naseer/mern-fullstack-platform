import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'cpp-development',
  title: 'C++ Development',
  category: 'Programming',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'sky',
  coverKey: 'cpp-development',
  summary:
    'Learn the ownership and lifetime model that separates C++ that works from C++ that crashes — RAII, smart pointers, move semantics, the STL, and CMake.',
  description:
    'You write modern C++17/20 by hand: classes that clean up after themselves, containers and algorithms instead of raw arrays and raw loops, templates that fail with readable errors, and a CMake project that builds and tests anywhere. Each chapter ends with you able to spot a specific class of real bug — double frees, dangling references, invalidated iterators, silent copies, and reference cycles that leak forever.',
  chapters: [
    chapter(
      'The C++ Mental Model',
      'Types, initialisation, references and functions — the machinery every later chapter is built on.',
      [
        lesson('Values, Types, and Initialisation', 12, `
C++ hands you direct control over memory layout, and charges you for it in precision. Every object has a **type** fixed at compile time, a **value**, and a **lifetime** tied to a region of storage. Getting initialisation right is where most beginner undefined behaviour is avoided.

### Fundamental types

\`\`\`cpp
#include <cstdint>

int          a = 42;               // at least 16 bits; 32 in practice
long long    big = 9'000'000'000;  // digit separators, C++14
std::int32_t exact = 42;           // exactly 32 bits - use when layout matters
double       ratio = 0.1;          // prefer double over float unless you measured
bool         ok = true;
char         c = 'x';              // signedness is implementation-defined
\`\`\`

\`int\` is not guaranteed to be 32 bits. The moment a value crosses a file, a socket, or a hardware register, reach for the fixed-width types in \`<cstdint>\`.

### Prefer braces

\`\`\`cpp
int a{42};        // brace initialisation
int b = 42;       // copy initialisation - fine for scalars
int c;            // INDETERMINATE - reading c is undefined behaviour
int d{};          // zero-initialised

int narrowed{3.14};   // compile error: narrowing conversion
int silent = 3.14;    // compiles; silently becomes 3
\`\`\`

Braces refuse narrowing conversions, so a truncation you did not intend becomes a build failure instead of a wrong number in production. An uninitialised local is the classic "works on my machine" bug: in a debug build the stack happens to be zeroed and everything looks fine; in release it holds whatever the previous call frame left there.

One place braces surprise people:

\`\`\`cpp
std::vector<int> a(3, 0);   // three elements, all 0
std::vector<int> b{3, 0};   // TWO elements: 3 and 0
\`\`\`

Whenever a type has an \`initializer_list\` constructor, braces prefer it. Use parentheses when you mean "this many elements", braces everywhere else.

### auto

\`\`\`cpp
auto n = 42;                       // int
auto x = 3.14;                     // double
auto name = "hello";               // const char*, NOT std::string
auto text = std::string{"hello"};  // std::string
const auto& row = table.at(3);     // reference - no copy
\`\`\`

\`auto\` strips references and \`const\` unless you write them yourself. That single rule causes the most common performance bug in real C++ codebases:

\`\`\`cpp
for (auto item : items)          // copies EVERY element
for (const auto& item : items)   // reads without copying
for (auto& item : items)         // modifies in place
\`\`\`

Over a million-element \`std::vector<std::string>\` the first loop constructs a million copies, one heap allocation for every string too long to fit in the small-string buffer. It survives code review every time because the line looks obviously correct.

### const and constexpr

\`\`\`cpp
const int maxUsers = 100;         // cannot be reassigned
constexpr int bufSize = 1024;     // known at compile time; usable as an array bound

constexpr int square(int n) { return n * n; }
static_assert(square(4) == 16);   // checked during compilation
\`\`\`

\`const\` says "this will not change". \`constexpr\` says "the compiler can compute this before the program runs". Prefer \`constexpr\` for genuine constants: it removes runtime work and lets \`static_assert\` catch mistakes at build time.

### The habit to build now

Default to \`const\`. Initialise every variable at the point of declaration. Declare variables as late as possible, where you actually have a value for them — a declaration far from its first use is how uninitialised reads get introduced during later edits.
        `,
        [
          q('int narrowed{3.14}; and int silent = 3.14; are both written in a file. What happens?',
            [
              'Both compile and both store 3',
              'The braced form is a compile error because it narrows; the = form silently stores 3',
              'Both are compile errors',
              'The braced form rounds the value to 3 and warns',
            ], 1, 'Brace initialisation rejects narrowing conversions outright, so a truncation you did not intend becomes a build failure.'),
          q('What type does auto name = "hello"; deduce?',
            [
              'std::string',
              'std::string_view',
              'char, because auto takes the first element',
              'const char*',
            ], 3, 'A string literal is an array of const char that decays to const char*; auto never invents a std::string for you.'),
          q('Why reach for std::int32_t from <cstdint> instead of int for a value written into a binary file format?',
            [
              'std::int32_t is faster than int on 64-bit CPUs',
              'int is guaranteed only to be at least 16 bits and its width varies by platform, so the layout is not portable',
              'int cannot be written to a file at all',
              'std::int32_t traps on overflow while int does not',
            ], 1, 'The fixed-width types pin the size down, which is exactly what you need the moment a value crosses a file, socket or register.'),
        ]
      ),
        lesson('References, Pointers, and Const Correctness', 13, `
A **reference** is another name for an existing object. A **pointer** is a variable holding an address. Choosing between them is a statement about whether the thing can be absent or replaced.

\`\`\`cpp
int x = 10;

int& r = x;      // r IS x. Must be initialised, can never be rebound, never null
r = 20;          // x is now 20

int* p = &x;     // p holds x's address
*p = 30;         // x is now 30
p = nullptr;     // pointers can be reseated and can be null
if (p) *p = 1;   // so they must be checked
\`\`\`

Use \`nullptr\`, never \`NULL\` or \`0\` — only \`nullptr\` has a pointer type, so it picks the right overload and cannot be mistaken for an integer.

### Choosing a parameter type

| Signature | Use when | Cost |
|---|---|---|
| \`void f(T v)\` | \`T\` is small and cheap to copy, or you need your own copy | one copy |
| \`void f(const T& v)\` | read-only access to something large | none |
| \`void f(T& v)\` | you will modify the caller's object | none |
| \`void f(T&& v)\` | you will take ownership (Chapter 4) | one move |

\`\`\`cpp
void log(const std::string& msg);   // no copy, cannot modify
void trim(std::string& s);          // modifies the caller's string in place
double area(double w, double h);    // doubles are cheap - pass by value
\`\`\`

Rule of thumb: pass by \`const&\` for anything bigger than two pointers, by value for built-in types.

### Dangling references cost weekends

\`\`\`cpp
const std::string& badName() {
    std::string s = "temporary";
    return s;          // s is destroyed at the closing brace
}                      // the returned reference names dead memory
\`\`\`

Compilers often warn, but they are not required to. Reading through that reference is undefined behaviour, and undefined behaviour is not a crash — it is *anything*. Typically it returns plausible-looking text in a debug build and garbage in release, which is why these bugs are discovered by users rather than tests.

The same trap arrives through a container:

\`\`\`cpp
std::vector<int> v{1, 2, 3};
int& first = v[0];
v.push_back(4);    // may reallocate the buffer
first = 99;        // undefined behaviour: first points into freed memory
\`\`\`

A reference is valid only while the object it names is alive **and has not moved**. Chapter 4 returns to this as iterator invalidation.

### const correctness

\`\`\`cpp
class Account {
public:
    double balance() const { return balance_; }        // does not modify *this
    void deposit(double amount) { balance_ += amount; }
private:
    double balance_{0.0};
};

const Account& a = lookup(id);
a.balance();      // fine
a.deposit(10);    // compile error - exactly what you want
\`\`\`

That \`const\` after the parameter list is what makes a \`const Account&\` useful at all. Miss it on an accessor and every caller holding a const reference is locked out; sooner or later somebody "fixes" it by deleting the \`const\` at the call site, and the guarantee is gone from the whole subsystem. Const correctness is nearly free on day one and miserable to retrofit.

### Two kinds of const pointer

\`\`\`cpp
const int* p;             // pointer to const int: *p read-only, p can be reseated
int* const q = &x;        // const pointer: q fixed, *q writable
const int* const r = &x;  // both
\`\`\`

Read the declaration right to left. If it takes you more than a second, it usually means a reference was the better tool.
        `,
        [
          q('const std::string& badName() { std::string s = "temporary"; return s; } — what is wrong?',
            [
              'It returns a reference to a local that is destroyed at the closing brace, so reading it is undefined behaviour',
              'It copies the string twice on the way out',
              'It fails to compile because s is not const',
              'Nothing — the compiler extends the lifetime of s for the caller',
            ], 0, 'The local dies at the end of the function, so the returned reference names memory that no longer holds an object.'),
          q('Why use nullptr rather than NULL or 0?',
            [
              'nullptr is a keyword so it is faster to compile',
              'NULL was removed from C++11',
              'Only nullptr has a pointer type, so it picks the pointer overload and cannot be mistaken for an integer',
              'nullptr initialises the pointed-to object to zero',
            ], 2, 'NULL and 0 are integers, so a call like f(NULL) can silently select an int overload.'),
          q('Given int x; which declaration lets you change what is pointed at but not the value through it?',
            [
              'int* const p = &x;',
              'const int* p = &x;',
              'int& r = x;',
              'const int* const p = &x;',
            ], 1, 'Read it right to left: pointer to const int, so *p is read-only while p itself can be reseated.'),
        ]
      ),
        lesson('Functions, Overloading, and Returning Values', 12, `
Functions in C++ are selected at compile time by their argument types. Understanding how that selection works removes a whole class of "why is it calling the wrong one?" confusion.

### Overloading

\`\`\`cpp
void draw(int n);
void draw(double d);

draw(5);      // draw(int)
draw(5.0);    // draw(double)
draw('a');    // draw(int)    - char promotes to int
draw(5.0f);   // draw(double) - float promotes to double
draw(5u);     // AMBIGUOUS: unsigned -> int and unsigned -> double rank equally
\`\`\`

The return type is **not** part of overload resolution. Two functions differing only in return type will not compile. Ambiguity errors are almost always solved by adding an exact-match overload or casting at the call site, not by adding more overloads.

### Default arguments

\`\`\`cpp
// Declared once, in the header
void connect(const std::string& host, int port = 8080, bool tls = true);

connect("api.example.com");            // port 8080, tls on
connect("api.example.com", 9000);      // tls on
\`\`\`

Defaults go on the declaration only, never repeated in the definition. They are resolved from the **static** type, which makes a default argument on a virtual function a genuine trap: the derived override runs but the base's default value is used.

### Return by value is cheap now

\`\`\`cpp
std::vector<int> makeRange(int n) {
    std::vector<int> out;
    out.reserve(n);                     // one allocation
    for (int i = 0; i < n; ++i) out.push_back(i);
    return out;                         // no copy: elision, or a move
}

auto v = makeRange(1'000'000);
\`\`\`

Since C++17 the compiler is required to elide the copy for a returned temporary, and named locals are elided in practice (NRVO) or moved. The old habit of taking an out-parameter — \`void makeRange(int n, std::vector<int>& out)\` — buys nothing and reads worse.

Do **not** write \`return std::move(out);\`. It looks like an optimisation and is the opposite: it turns the returned expression into something NRVO cannot elide, so you pay for a move that would otherwise have been free. This is the most common pessimisation dressed as a speed-up in real code.

### constexpr and inline

\`\`\`cpp
constexpr int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }

constexpr int f5 = factorial(5);   // computed during compilation
static_assert(f5 == 120);
int runtime = factorial(readNumber());   // same function, called normally
\`\`\`

A \`constexpr\` function is usable in both worlds. Meanwhile \`inline\` today means "this definition may legally appear in several translation units", not "please inline this" — whether code is actually inlined is the optimiser's decision. Free functions defined in a header need \`inline\`; member functions defined inside the class body get it automatically.

### Lambdas are functions that carry state

\`\`\`cpp
std::vector<int> nums{5, 2, 9, 1};

int threshold = 4;
auto over = [threshold](int n) { return n > threshold; };   // captured by value

std::sort(nums.begin(), nums.end(), [](int a, int b) { return a > b; });
auto count = std::count_if(nums.begin(), nums.end(), over);
\`\`\`

Capture by value by default. \`[&]\` is fine for a lambda consumed on the same line, but storing a \`[&]\` lambda in a member, a container, or a thread and letting the enclosing frame return is a dangling capture — the same bug as the dangling reference from the previous lesson, wearing a different hat.
        `,
        [
          q('With void draw(int); and void draw(double); declared, why is draw(5u) ambiguous?',
            [
              'Unsigned values cannot be converted to double at all',
              'Overload resolution ignores the argument when it is unsigned',
              'draw(int) is a better match but the compiler warns rather than choosing',
              'unsigned to int and unsigned to double are conversions of equal rank, so neither overload wins',
            ], 3, 'Neither candidate is an exact match and both need a standard conversion of the same rank, so the call is ambiguous.'),
          q('Can two functions differ only in return type and still overload?',
            [
              'Yes, the compiler picks based on how the result is used',
              'Yes, but only if one of them is constexpr',
              'No — the return type is not part of overload resolution, so they do not compile',
              'No, unless the return types are unrelated class types',
            ], 2, 'Selection is driven entirely by the arguments, so two declarations differing only in return type are a redeclaration conflict.'),
          q('A base class declares virtual void log(int level = 3); and a derived class overrides it with a default of 1. Called through a base reference, which default is used?',
            [
              'The derived default of 1, matching the override that runs',
              'The base default of 3, because defaults are resolved from the static type',
              'Neither — the call fails to compile',
              'Whichever default was declared last in the translation unit',
            ], 1, 'The derived body runs but the argument is filled in from the statically known base declaration, which is why defaults on virtuals are a trap.'),
        ]
      ),
        lesson('Headers, Namespaces, and the One Definition Rule', 13, `
Every \`.cpp\` file is compiled on its own, in complete ignorance of the others. That single fact explains include guards, \`inline\`, and every link error you will ever read.

### One translation unit per .cpp

\`\`\`text
math.hpp ─┐
          ├─► preprocessor ─► translation unit ─► compiler ─► math.o ─┐
math.cpp ─┘                                                          ├─► linker ─► app
main.cpp ────────────────────► translation unit ─► compiler ─► main.o ┘
\`\`\`

\`#include\` is textual: the preprocessor pastes the header in. The compiler then sees one long stream of text — the **translation unit** — and emits an object file holding the definitions it found, plus a list of names it used but could not define. The linker resolves that list against the other object files. Almost every build failure is one of those two stages complaining, and telling them apart is most of the fix.

### Declarations promise, definitions provide

\`\`\`cpp
// math.hpp
#pragma once                                // or an include guard

int add(int a, int b);                      // declaration: it exists somewhere
inline int twice(int n) { return n * 2; }   // definition in a header: needs inline
struct Vec2 { double x{}; double y{}; };    // class definition: repeats per TU, legally
inline constexpr double kPi = 3.14159265;   // C++17 inline variable
extern int callCount;                       // declared here, defined elsewhere
\`\`\`

\`\`\`cpp
// math.cpp
#include "math.hpp"
int add(int a, int b) { return a + b; }     // the one definition
int callCount = 0;                          // the one definition
\`\`\`

The **one definition rule** is the whole story. A function or variable you actually use needs exactly one definition in the entire program. Classes, templates and anything marked \`inline\` may be defined once *per translation unit*, provided every copy is identical — which is why templates live in headers (Chapter 5) and why \`inline\` today means "this definition may legally appear in several translation units", not "please inline this".

| Error | Cause | Fix |
|---|---|---|
| \`undefined reference to add(int, int)\` | declared but never defined, or the \`.cpp\` was never added to the target | define it, or add the file to \`add_library\` |
| \`multiple definition of twice(int)\` | a non-\`inline\` function defined in a header that two \`.cpp\` files include | mark it \`inline\`, or move the body to a \`.cpp\` |

Notice what \`#pragma once\` does **not** do. It stops a header being pasted twice into *one* translation unit. It says nothing about other translation units, so it cannot rescue a non-inline function definition sitting in a header — the classic reason a project links fine with one \`.cpp\` and breaks the moment a second one includes the same header.

### Namespaces keep names apart

\`\`\`cpp
namespace inv::storage {          // C++17 nested namespace shorthand
class Warehouse { /* ... */ };
}

inv::storage::Warehouse w;
namespace st = inv::storage;      // alias, for a long name used often
\`\`\`

For a helper that belongs to exactly one \`.cpp\`, put it in an **anonymous namespace**:

\`\`\`cpp
namespace {
int checksum(std::string_view s) {
    int sum = 0;
    for (char c : s) sum = (sum * 31 + c) & 0xffff;
    return sum;
}
}
\`\`\`

That gives it internal linkage: the name never reaches the linker, two files may each define their own \`checksum\` without colliding, and nothing outside can call it. It is the modern replacement for file-scope \`static\`.

One rule has no exceptions: **never write \`using namespace std;\` in a header.** You impose it on every file that includes you, and a name the committee adds later — \`std::data\`, \`std::size\`, \`std::byte\` — begins colliding with something of yours inside code nobody has touched for a year. Inside a \`.cpp\`, a targeted \`using std::string;\` is fine.

### Forward declare to break the include graph

\`\`\`cpp
class Texture;                     // incomplete type - no #include required

class Sprite {
public:
    void draw(const Texture& t);   // fine: only a reference
private:
    Texture* tex_;                 // fine: only a pointer
    // Texture copy_;              // NOT fine: a member by value needs the size
};
\`\`\`

A pointer, a reference or a function declaration needs only the name. A member by value, a member function call, \`sizeof\` and \`new\` need the complete definition. Every \`#include\` you turn into a forward declaration is a file that stops rebuilding when that header changes — and it is the same completeness rule that makes the pimpl destructor in Chapter 3 fail when you leave it implicit.

### The habits

Headers declare, \`.cpp\` files define. Include what you use instead of relying on another header to drag it in. Keep anything that must be unique out of headers unless it is \`inline\`, a template, or a class.
        `,
        [
          q('Why must a free function defined in a header be marked inline?',
            [
              'Otherwise the optimiser refuses to expand it at the call site',
              'Otherwise every translation unit that includes the header emits a definition and the linker reports a multiple definition',
              'Because headers may not contain function bodies at all',
              'Because inline is what makes the function visible outside its own file',
            ], 1, 'inline permits one identical definition per translation unit, which is exactly what a header-defined function produces.'),
          q('What does #pragma once actually prevent?',
            [
              'The header being compiled more than once in the whole project',
              'Two headers declaring the same function name',
              'The same header being pasted twice into one translation unit',
              'Circular includes between two headers',
            ], 2, 'It is a per-translation-unit guard, which is why it does nothing about a non-inline definition included by several .cpp files.'),
          q('With only class Texture; visible, which member declaration compiles?',
            [
              'Texture tex_; as a member by value',
              'std::array<Texture, 4> atlas_;',
              'A member function body that calls tex_.bind()',
              'Texture* tex_; and a parameter of type const Texture&',
            ], 3, 'An incomplete type is enough for pointers, references and declarations; anything needing the size or the members needs the definition.'),
        ]
      ),
      ],
      [
        q('Why prefer int d{}; over int d; for a local variable?', [
          'Brace initialisation is faster at runtime',
          'Braces allow narrowing conversions',
          'int d; leaves the value indeterminate, and reading it is undefined behaviour',
          'Braces make the variable const',
        ], 2, 'A default-initialised local scalar holds whatever was on the stack; braces zero-initialise it.'),
        q('What does std::vector<int> b{3, 0}; create?', [
          'A vector of two elements: 3 and 0',
          'A vector of three zeros',
          'An empty vector with capacity 3',
          'A compile error',
        ], 0, 'Braces prefer the initializer_list constructor, so the values are elements; use parentheses for (count, value).'),
        q('What is wrong with for (auto s : bigStrings)?', [
          'Nothing — auto deduces a reference automatically',
          's cannot be read inside the loop',
          'The loop skips the last element',
          'Every element is copied; use const auto& to read without copying',
        ], 3, 'auto strips references, so each iteration constructs a full copy of the element.'),
        q('Why is return std::move(out); at the end of a function a mistake?', [
          'It fails to compile for class types',
          'It blocks copy elision, forcing a move that would otherwise have been free',
          'It leaves out in an invalid state for the caller',
          'std::move cannot be applied to local variables',
        ], 1, 'Returning the named local directly lets the compiler construct it in place; wrapping it in std::move defeats that.'),
      ]
    ),
    chapter(
      'Classes, RAII, and Lifetime',
      'Building types that own something and clean up after themselves, whatever happens.',
      [
        lesson('Classes, Constructors, and Member Initialisation', 13, `
A class exists to protect an **invariant** — something that must stay true about its data. If any caller can break that truth, the class is not doing its job.

\`\`\`cpp
class Fraction {
public:
    Fraction(int num, int den) : num_{num}, den_{den} {
        if (den == 0) throw std::invalid_argument{"denominator is zero"};
        reduce();
    }
    double value() const { return static_cast<double>(num_) / den_; }
private:
    void reduce();
    int num_;
    int den_;
};
\`\`\`

The denominator can never be zero, because there is no way to construct a \`Fraction\` that skips the constructor. That is the whole argument for private data.

### The member initialiser list is not a style choice

\`\`\`cpp
class Config {
    std::string path_;
public:
    // Config(const std::string& p) { path_ = p; }  // 1: default-construct, then assign
    Config(const std::string& p) : path_{p} {}      // 2: construct once, directly
};
\`\`\`

The first version builds an empty \`std::string\`, then throws it away and copies over it. For \`const\` members and reference members it does not merely waste work — assignment is illegal, so the initialiser list is the only option.

### Initialisation order follows declaration order

\`\`\`cpp
class Buffer {
    std::size_t size_;            // declared first
    std::vector<char> data_;      // declared second
public:
    Buffer(std::size_t n) : size_{n}, data_(size_) {}   // fine
};
\`\`\`

Members are initialised in the order they are **declared in the class**, regardless of the order you write them in the initialiser list. Swap the two declarations above and \`data_(size_)\` reads \`size_\` before it exists — sizing the vector from garbage. Keep both orders identical and compile with \`-Wreorder\` so the compiler tells you when they drift apart.

### explicit stops silent conversions

\`\`\`cpp
class Seconds {
public:
    explicit Seconds(int s) : s_{s} {}
private:
    int s_;
};

void wait(Seconds);
wait(30);            // without explicit this compiles: 30 becomes Seconds(30)
wait(Seconds{30});   // with explicit, the caller has to mean it
\`\`\`

Mark every single-argument constructor \`explicit\` unless the implicit conversion is genuinely obvious and desirable. Accidental conversions are how a byte count ends up interpreted as a duration.

### Delegating constructors and default member initialisers

\`\`\`cpp
class Server {
public:
    Server() = default;
    explicit Server(std::string host) : Server(std::move(host), 8080) {}
    Server(std::string host, int port)
        : host_{std::move(host)}, port_{port} {}
private:
    std::string host_{"localhost"};   // default member initialisers
    int port_{8080};
    bool tls_{true};
};
\`\`\`

Default member initialisers state the defaults once, next to the members, so every constructor inherits them. Delegating keeps validation in a single place instead of copy-pasted across three constructors.

### struct or class?

The only language difference is the default access level: \`struct\` members are public, \`class\` members private. The convention that matters is intent — use \`struct\` for a plain bundle of data with no invariant to defend (a \`Point\`, a config record), and \`class\` when there is something to keep true.

\`\`\`cpp
struct Point { double x{}; double y{}; };   // no invariant, nothing to hide
Point p{1.5, 2.5};                          // aggregate initialisation
\`\`\`

### const member functions

Any member function that does not modify the object should be \`const\`. It is not documentation; it is what allows the object to be used through a \`const&\`, which is how you will pass it everywhere after Chapter 1. Write it as you write the function, not later.
        `,
        [
          q('Config(const std::string& p) { path_ = p; } instead of : path_{p} {} does what extra work?',
            [
              'Nothing — the compiler rewrites one into the other',
              'It copies p twice',
              'It default-constructs path_ first and then copy-assigns over it',
              'It leaves path_ uninitialised until the first use',
            ], 2, 'Members are already initialised by the time the constructor body runs, so assigning in the body builds an empty string and throws it away.'),
          q('Why mark a single-argument constructor explicit?',
            [
              'It stops the compiler from generating a copy constructor',
              'It makes the constructor usable in a constant expression',
              'It allows the constructor to throw',
              'It blocks implicit conversions, so wait(30) no longer silently becomes wait(Seconds{30})',
            ], 3, 'Without explicit, any int converts itself into a Seconds at a call site, which is how a byte count ends up read as a duration.'),
          q('What is the only language-level difference between struct and class?',
            [
              'The default access level: struct members are public, class members private',
              'struct cannot have member functions',
              'struct objects are always allocated on the stack',
              'class supports inheritance and struct does not',
            ], 0, 'Everything else is convention: use struct for a plain bundle of data and class when there is an invariant to defend.'),
        ]
      ),
        lesson('RAII: Resources Are Objects', 14, `
This is the idea that separates C++ that works from C++ that crashes: **every resource is owned by an object whose destructor releases it.** Memory, files, sockets, locks, database transactions — all the same pattern.

### The problem, first

\`\`\`cpp
void copyFile(const char* from, const char* to) {
    std::FILE* in = std::fopen(from, "rb");
    if (!in) return;
    std::FILE* out = std::fopen(to, "wb");
    if (!out) return;                    // LEAK: in is never closed

    if (!transfer(in, out))
        throw std::runtime_error{"transfer failed"};   // LEAK: both handles

    std::fclose(out);
    std::fclose(in);
}
\`\`\`

Every early return and every \`throw\` is another leak path, and there are more of them than you think — \`transfer\` may throw, an allocation inside it may throw, a destructor of something you did not write may run. C++ has no \`finally\` block, deliberately, because there is something better.

### The fix

\`\`\`cpp
class File {
public:
    File(const char* path, const char* mode) : f_{std::fopen(path, mode)} {
        if (!f_) throw std::runtime_error{std::string{"cannot open "} + path};
    }
    ~File() { if (f_) std::fclose(f_); }

    File(const File&) = delete;              // a handle has one owner
    File& operator=(const File&) = delete;

    std::FILE* get() const { return f_; }
private:
    std::FILE* f_;
};

void copyFile(const char* from, const char* to) {
    File in{from, "rb"};
    File out{to, "wb"};
    if (!transfer(in.get(), out.get()))
        throw std::runtime_error{"transfer failed"};
}   // both files closed here, on every exit path
\`\`\`

Destructors run when the scope exits — normal return, \`break\`, or an exception unwinding the stack. That guarantee is what makes the second version correct without a single cleanup statement.

### The standard library is RAII all the way down

| Resource | Owner |
|---|---|
| Heap memory | \`std::vector\`, \`std::string\`, \`std::unique_ptr\` |
| File handle | \`std::fstream\` |
| Mutex lock | \`std::scoped_lock\`, \`std::unique_lock\` |
| Thread | \`std::jthread\` (C++20) |

\`\`\`cpp
std::mutex m;
int counter = 0;

void increment() {
    std::scoped_lock lock{m};      // locks
    ++counter;
    if (counter > 100) return;     // unlocks
    log(counter);                  // even if this throws, it unlocks
}                                  // unlocks
\`\`\`

Hand-written \`m.lock(); ...; m.unlock();\` deadlocks the entire program the first time an exception passes through the middle, and that path is usually untested.

### Two rules destructors must obey

**1. Never let an exception escape a destructor.** Destructors are implicitly \`noexcept\`, so an exception that escapes one calls \`std::terminate\` — always, not only when another exception is already unwinding — and your process dies with no message worth reading.

\`\`\`cpp
~Session() {
    try { flush(); } catch (...) { logError(); }   // swallow, never rethrow
}
\`\`\`

**2. A base class used polymorphically needs a virtual destructor.**

\`\`\`cpp
struct Shape { virtual ~Shape() = default; };
struct Circle : Shape { std::vector<Point> cache; };

Shape* s = new Circle;
delete s;      // without virtual ~Shape: undefined behaviour, cache leaks
\`\`\`

Without \`virtual\`, only \`~Shape\` runs. The derived members are never destroyed and their memory is never returned.

### Scope becomes your control flow

\`\`\`cpp
{
    Transaction tx{db};     // BEGIN
    tx.insert(row);
    tx.insert(other);
    tx.commit();            // sets a committed_ flag
}                           // ~Transaction: ROLLBACK unless committed_
\`\`\`

If anything between \`BEGIN\` and \`commit()\` throws, the transaction rolls back — with no \`catch\` block anywhere in the function. That is what people mean when they say exception handling in C++ is mostly about destructors.
        `,
        [
          q('An exception escapes a destructor. What happens?',
            [
              'It propagates to the enclosing catch block as usual',
              'std::terminate is called, because destructors are implicitly noexcept',
              'It is ignored unless another exception is already in flight',
              'The object is leaked but the program continues',
            ], 1, 'A destructor is noexcept by default, so letting an exception out ends the process — catch and log inside the destructor instead.'),
          q('Why does the File class in this lesson delete its copy constructor and copy assignment?',
            [
              'Copying a class with a pointer member never compiles',
              'To keep the type small enough to pass in a register',
              'Because two File objects would each close the same FILE* in their destructors',
              'Because std::fopen cannot be called twice on the same path',
            ], 2, 'The handle has exactly one owner; a copy would give two objects the same resource and two calls to fclose.'),
          q('What goes wrong with m.lock(); work(); m.unlock(); if work() throws?',
            [
              'Nothing — the mutex is released during unwinding',
              'The exception is converted into a deadlock error',
              'The mutex is unlocked twice',
              'The unlock never runs, so the mutex stays locked and the next thread blocks forever',
            ], 3, 'Stack unwinding skips the rest of the function, which is why the lock must live in a scoped_lock whose destructor releases it.'),
        ]
      ),
        lesson('The Rule of Zero, Three, and Five', 14, `
Every class has five **special member functions**. The compiler will write them for you, and the ones it writes are correct only when your members already manage themselves.

\`\`\`cpp
~Widget();                              // destructor
Widget(const Widget&);                  // copy constructor
Widget& operator=(const Widget&);       // copy assignment
Widget(Widget&&) noexcept;              // move constructor
Widget& operator=(Widget&&) noexcept;   // move assignment
\`\`\`

### Why the rule exists: the double free

\`\`\`cpp
class Buffer {
public:
    explicit Buffer(std::size_t n) : data_{new int[n]}, n_{n} {}
    ~Buffer() { delete[] data_; }
    // no copy operations written
private:
    int* data_;
    std::size_t n_;
};

void boom() {
    Buffer a{10};
    Buffer b = a;    // compiler-generated copy: copies the POINTER
}                    // ~b frees data_, then ~a frees the SAME pointer
\`\`\`

The generated copy constructor copies each member. For a raw pointer that means both objects believe they own one allocation. The result is a double free: heap corruption now, a crash later, somewhere with no visible connection to \`boom()\`. This is the single most common source of memory corruption in hand-written C++ classes.

### Rule of three, then five

If you need a destructor, a copy constructor, or a copy assignment operator, you almost certainly need all three (**rule of three**). Since C++11 add the two move operations (**rule of five**):

\`\`\`cpp
class Buffer {
public:
    explicit Buffer(std::size_t n) : data_{new int[n]}, n_{n} {}
    ~Buffer() { delete[] data_; }

    Buffer(const Buffer& o) : data_{new int[o.n_]}, n_{o.n_} {
        std::copy(o.data_, o.data_ + n_, data_);
    }
    Buffer& operator=(const Buffer& o) {
        Buffer tmp{o};      // copy-and-swap
        swap(tmp);
        return *this;       // tmp destroys the old buffer
    }
    Buffer(Buffer&& o) noexcept : data_{o.data_}, n_{o.n_} {
        o.data_ = nullptr;  // leave the source safely destructible
        o.n_ = 0;
    }
    Buffer& operator=(Buffer&& o) noexcept { swap(o); return *this; }

    void swap(Buffer& o) noexcept {
        std::swap(data_, o.data_);
        std::swap(n_, o.n_);
    }
private:
    int* data_;
    std::size_t n_;
};
\`\`\`

Copy-and-swap is worth the extra line: it handles self-assignment for free (a naive \`delete[] data_; data_ = new int[o.n_];\` frees the source before reading it when you write \`a = a\`) and it gives the **strong exception guarantee** — if the allocation throws, \`*this\` is untouched.

\`noexcept\` on the move operations is not decoration. \`std::vector\` only moves its elements while reallocating if their move constructor is \`noexcept\`; otherwise it copies, because a throwing move could destroy data halfway through with no way back. Omit it and your growing vector silently deep-copies every element.

### Declaring one suppresses the others

| You declare | The compiler still generates |
|---|---|
| Nothing | All five |
| A destructor | Copies (deprecated), but **no** moves |
| A copy operation | No moves |
| A move operation | Copies are deleted |

Adding a destructor purely to log a message silently disables move for the entire class, and a \`std::vector<Widget>\` that used to move on growth starts deep-copying. If you want the defaults, say so explicitly: \`Widget(Widget&&) = default;\`.

### Rule of zero — the one to actually follow

\`\`\`cpp
class Buffer {
public:
    explicit Buffer(std::size_t n) : data_(n) {}
private:
    std::vector<int> data_;
};
\`\`\`

No destructor, no copy, no move — and it is copyable, movable, exception-safe and leak-free, because \`std::vector\` already implements all five correctly. Thirty lines became four.

**Write a resource-managing class only when no standard type fits.** Compose from \`std::vector\`, \`std::string\`, \`std::unique_ptr\` (Chapter 3) and declare none of the five. The classes that need the rule of five are the handful that wrap a C API; everything else should be following the rule of zero.
        `,
        [
          q('What does copy-and-swap buy you over freeing and reallocating in place?',
            [
              'It avoids the allocation entirely',
              'It makes the assignment operator noexcept',
              'It handles self-assignment and gives the strong exception guarantee, since *this is untouched if the copy throws',
              'It removes the need for a destructor',
            ], 2, 'The temporary is built first, so a throwing allocation leaves the target unchanged and a = a still works.'),
          q('A move constructor steals the source buffer. What must it leave the source in?',
            [
              'Exactly the state it had before, so both objects stay usable',
              'A valid state that is safe to destroy and assign to — typically null pointers and zero sizes',
              'A state where every member has been freed',
              'Anything at all, since a moved-from object is never touched again',
            ], 1, 'Moved-from objects still get destroyed, so leaving the raw pointer dangling in the source would free the buffer twice.'),
          q('Which class correctly follows the rule of zero?',
            [
              'One that declares all five special members as = default',
              'One that declares a destructor to log teardown and nothing else',
              'One holding a raw int* with a hand-written destructor and copy operations',
              'One whose members are std::vector, std::string and std::unique_ptr, declaring none of the five',
            ], 3, 'When every member already manages itself, the compiler-generated operations are correct, so writing them adds only risk.'),
        ]
      ),
        lesson('Inheritance, Virtual Functions, and Slicing', 14, `
Public inheritance makes exactly one promise: **a Derived can be used anywhere a Base is expected.** Every other reason people reach for it — sharing code, saving typing — is better served by composition.

### An interface is an abstract base

\`\`\`cpp
class Shape {
public:
    virtual ~Shape() = default;                  // polymorphic base, from the RAII lesson
    virtual double area() const = 0;             // pure virtual: no sensible default
    virtual std::string name() const { return "shape"; }   // virtual with a body
};

class Circle : public Shape {
public:
    explicit Circle(double r) : r_{r} {}
    double area() const override { return 3.141592653589793 * r_ * r_; }
    std::string name() const override { return "circle"; }
private:
    double r_;
};
\`\`\`

A class with a pure virtual function is **abstract**: it cannot be instantiated, only derived from. That is what you want from an interface, because there is no meaningful "generic shape" object to create.

### override is not decoration

\`\`\`cpp
class Base {
public:
    virtual void tick(int n) const;
};

class Derived : public Base {
public:
    void tick(int n);                  // NOT an override - the const is missing
    void tick(int n) const override;   // this one the compiler checks
};
\`\`\`

Without \`override\` that first line compiles happily and declares a *new*, unrelated function. Calls through a \`Base&\` keep running \`Base::tick\`, and the derived behaviour you carefully wrote is never reached. Put \`override\` on every override: it costs nothing and converts a silent behavioural bug into a compile error. Add \`final\` when a class or a virtual must not be extended further — it also lets the optimiser devirtualise the call.

### Slicing: the bug this lesson exists for

\`\`\`cpp
Circle c{2.0};
Shape s = c;         // copies only the Shape subobject; r_ is discarded
\`\`\`

Copying a derived object into a base **object** takes the base part and throws the rest away. The dynamic type becomes \`Shape\`, virtual dispatch stops finding \`Circle::area\`, and most configurations issue no warning at all. It arrives in bulk through containers and parameters:

\`\`\`cpp
std::vector<Shape> shapes;          // every element sliced on insertion
void draw(Shape s);                 // slices at every call site
void draw(const Shape& s);          // correct: no copy, dispatch preserved
\`\`\`

Store polymorphic objects behind a pointer, using the vocabulary from Chapter 3:

\`\`\`cpp
std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(2.0));
shapes.push_back(std::make_unique<Square>(1.5));

double total = 0;
for (const auto& s : shapes) total += s->area();   // dispatches correctly
\`\`\`

Slicing is the same failure as \`catch (std::exception e)\` in Chapter 5: a derived object copied into a base-sized box.

### Never call a virtual function from a constructor or destructor

\`\`\`cpp
struct Base {
    Base() { init(); }             // calls Base::init - always
    virtual void init();
};
struct Derived : Base {
    void init() override;          // never runs from the Base constructor
};
\`\`\`

While the base is being constructed the derived part does not exist yet, so the dynamic type genuinely *is* \`Base\`. The language is protecting you from dispatching into uninitialised members, but the result is code that reads as polymorphic and is not. Call the virtual after construction, or use a factory function that constructs the object and then initialises it.

### What it costs

A polymorphic object carries one hidden vtable pointer — 8 bytes on a 64-bit target — and every virtual call is an indirect jump the compiler usually cannot inline. For a \`draw()\` invoked a thousand times a frame that is irrelevant. For a comparison called inside a sort of ten million elements it is not. Virtual dispatch is a design-level tool, not a per-element one.

### When not to inherit

| You want | Use |
|---|---|
| Several implementations behind one interface | public inheritance from an abstract base |
| To reuse an implementation | a member (composition), not a base class |
| To vary one step of an algorithm | a callable parameter or \`std::function\` |
| Shared data with no polymorphism | a plain struct member |

If a \`Derived\` cannot stand in for its \`Base\` without surprising the caller — the classic \`Square : Rectangle\`, where \`setWidth\` has to secretly change the height — then the relationship is not "is-a", and no amount of overriding will stop it producing bugs.
        `,
        [
          q('Circle c{2.0}; Shape s = c; — what is the state of s?',
            [
              'It holds only the Shape subobject: the Circle data is discarded and s.area() no longer dispatches to Circle',
              'It is a full copy of the Circle, accessible through the Shape interface',
              'It is a reference to c, so both stay in sync',
              'It fails to compile because Shape is a base class',
            ], 0, 'Copying into a base-sized object slices off the derived part, which is why polymorphic objects are stored behind pointers or references.'),
          q('A derived class declares void tick(int) while the base declares virtual void tick(int) const. What happens without the override keyword?',
            [
              'The compiler treats the missing const as a typo and overrides anyway',
              'The program fails to link',
              'It compiles as a new unrelated function, so calls through a Base& still run Base::tick',
              'The base function becomes non-virtual',
            ], 2, 'A mismatched signature silently declares a different function; override makes the compiler reject it instead.'),
          q('A base constructor calls a virtual function that the derived class overrides. Which body runs?',
            [
              'The derived override, since the object being constructed is a Derived',
              'The base version, because during base construction the dynamic type is still Base',
              'Neither; the call is undefined behaviour',
              'Both, in base-then-derived order',
            ], 1, 'The derived members do not exist yet, so the language deliberately dispatches to the base version.'),
        ]
      ),
      ],
      [
        q('In what order are class members initialised?', [
          'In the order they appear in the constructor initialiser list',
          'In the order they are declared in the class',
          'Alphabetically by member name',
          'In an unspecified order chosen by the optimiser',
        ], 1, 'Declaration order wins, which is why an initialiser list in a different order can read a member that does not exist yet.'),
        q('Why does C++ have no finally block?', [
          'Exceptions are too rare to justify one',
          'It was removed in C++11',
          'Destructors cannot run during unwinding',
          'Destructors already run on every exit path, so cleanup belongs in an object',
        ], 3, 'RAII makes cleanup automatic and impossible to forget, which is strictly stronger than a block you must remember to write.'),
        q('A class holds a raw int* , defines a destructor that deletes it, and declares no copy operations. What happens on Buffer b = a;?', [
          'Both destructors free the same pointer — a double free',
          'The compiler performs a deep copy of the array',
          'The copy fails to compile',
          'The second delete is detected and ignored',
        ], 0, 'The generated copy constructor copies members, so the pointer is duplicated and freed twice.'),
        q('Why must a move constructor be marked noexcept for std::vector to use it when growing?', [
          'noexcept functions are inlined more aggressively',
          'The standard requires noexcept on all move constructors',
          'vector needs the strong guarantee, so a possibly-throwing move is replaced with a copy',
          'Without it the move constructor is never generated',
        ], 2, 'A throw halfway through reallocation would leave elements destroyed with no way back, so vector falls back to copying.'),
      ]
    ),
    chapter(
      'Memory and Ownership',
      'The free store, smart pointers, and answering "who owns this?" in the type system.',
      [
        lesson('The Free Store: new, delete, and Why You Stop Using Them', 12, `
Objects live in one of two places, and choosing correctly removes most memory bugs before they exist.

\`\`\`cpp
void f() {
    int a = 1;                     // stack: destroyed automatically at }
    std::array<double, 3> pts{};   // stack: size fixed at compile time
    int* p = new int{1};           // heap: lives until someone calls delete
    delete p;
}
\`\`\`

The **stack** is fast — allocation is bumping a pointer — with lifetime tied to scope, but it is small, typically 1–8 MB per thread, and every size must be known at compile time. The **heap** (free store) is sized at runtime, lives as long as you like, costs roughly a hundred times more per allocation, and must be released explicitly.

Use the stack unless the object must outlive its scope, is too large for it, or its size or concrete type is only known at runtime.

### The four ways manual memory goes wrong

\`\`\`cpp
// 1. Leak - memory never returned
void leak() { int* p = new int[1000]; }

// 2. Double free
delete p; delete p;

// 3. Use after free
int* p = new int{5};
delete p;
std::cout << *p;         // reads memory the allocator has reused

// 4. Mismatched form
int* arr = new int[10];
delete arr;              // must be delete[]
\`\`\`

None of these is guaranteed to fail where the mistake is. A use-after-free usually returns *plausible* data, because the allocator has already handed that block to something else — so the corruption appears in an unrelated module hours later, and the stack trace points at innocent code. That distance between cause and symptom is the entire reason C++ has its reputation.

### Exceptions make manual delete almost impossible

\`\`\`cpp
void process() {
    Widget* w = new Widget;
    configure(w);        // if this throws, delete never runs
    doWork(w);           // and so does this
    delete w;
}
\`\`\`

You could wrap it in try/catch. In every function. Around every early return. Forever. Or you can put ownership in the type, which is what the rest of this chapter does.

### The modern replacement table

| Instead of | Use |
|---|---|
| \`new T\` / \`delete\` | \`std::unique_ptr<T>\` via \`std::make_unique\` |
| \`new T[n]\` / \`delete[]\` | \`std::vector<T>\` |
| \`new char[n]\` for text | \`std::string\` |
| Genuinely shared ownership | \`std::shared_ptr<T>\` via \`std::make_shared\` |
| A pointer that owns nothing | \`T*\` or \`T&\` — and never \`delete\` it |

\`\`\`cpp
// Before
Widget* w = new Widget{cfg};
use(w);
delete w;

// After - exception safe, no delete anywhere
auto w = std::make_unique<Widget>(cfg);
use(*w);
\`\`\`

### Raw pointers are still fine — as observers

A raw pointer that only looks at something is perfectly modern C++:

\`\`\`cpp
void render(const Widget& w);   // must exist, does not own
void render(const Widget* w);   // may be null, does not own
\`\`\`

The rule this whole chapter turns on: **raw pointers observe, smart pointers own.** If you find a \`delete\` anywhere except inside a destructor or a custom deleter, someone has taken on a job the type system was ready to do for free.

### Turn on the tools

\`\`\`bash
g++ -std=c++20 -g -fsanitize=address,undefined main.cpp -o app
./app
\`\`\`

AddressSanitizer reports leaks, double frees and use-after-free **at the moment they happen**, with the allocation and deallocation stacks printed. It costs about 2x runtime, which is nothing during development, and it will immediately find bugs your test suite has been quietly passing over.
        `,
        [
          q('int* arr = new int[10]; delete arr; — what is wrong?',
            [
              'Nothing, delete and delete[] are interchangeable for scalar types',
              'The array form must be released with delete[]; mismatching the forms is undefined behaviour',
              'It leaks exactly nine of the ten ints',
              'delete cannot be applied to a pointer returned by new[] and fails to compile',
            ], 1, 'new[] and delete[] pair up; using the scalar delete on an array allocation is undefined, not merely wasteful.'),
          q('Why does a use-after-free usually not crash at the line that reads the freed memory?',
            [
              'The compiler inserts a check that silently returns zero',
              'Freed memory is always zeroed by the allocator',
              'The allocator has typically reused the block, so the read returns plausible data and the damage surfaces elsewhere later',
              'Reads of freed memory are well defined; only writes are a problem',
            ], 2, 'That distance between the mistake and the symptom is what makes manual memory management expensive to debug.'),
          q('What does an AddressSanitizer report give you that a bare crash does not?',
            [
              'A guaranteed fix suggestion for each report',
              'The exact optimisation the compiler applied',
              'A build with no runtime cost',
              'The allocation and deallocation stacks at the moment of the bad access, for roughly 2x runtime',
            ], 3, 'ASan reports the error where it happens and names both ends of the lifetime, which is precisely the link a crash is missing.'),
        ]
      ),
        lesson('unique_ptr: Single Ownership by Default', 13, `
\`std::unique_ptr\` is the default owning pointer. It holds exactly one object, deletes it when it goes out of scope, and cannot be copied — so the compiler enforces that there is exactly one owner.

\`\`\`cpp
#include <memory>

auto w = std::make_unique<Widget>(host, port);   // constructor args forwarded
w->connect();
Widget& ref = *w;
if (w) { /* non-null */ }
\`\`\`

It costs nothing: \`sizeof(std::unique_ptr<T>) == sizeof(T*)\` for the default deleter, and the destructor call is inlined. There is no runtime price for the safety.

### It moves, it does not copy

\`\`\`cpp
auto a = std::make_unique<Widget>();
// auto b = a;              // compile error - and that is the feature
auto b = std::move(a);      // ownership transferred; a is now nullptr
\`\`\`

The error is the design. Ownership transfer is visible at every call site.

### Signatures say who owns

\`\`\`cpp
void consume(std::unique_ptr<Widget> w);   // takes ownership
void inspect(const Widget& w);             // borrows; must exist
void inspect(const Widget* w);             // borrows; may be null
std::unique_ptr<Widget> make();            // hands ownership to the caller

consume(std::move(owner));   // explicit at the call site
inspect(*owner);             // ownership unchanged
\`\`\`

The common mistake is writing \`void inspect(const std::unique_ptr<Widget>&)\`. That signature forces every caller to have stored the object in a \`unique_ptr\`, even though the function only reads it — so it cannot be called with a stack object, a vector element, or a \`shared_ptr\`. A function that does not participate in ownership should not mention smart pointers at all.

### Factories

\`\`\`cpp
std::unique_ptr<Shape> makeShape(std::string_view kind) {
    if (kind == "circle") return std::make_unique<Circle>(1.0);
    if (kind == "square") return std::make_unique<Square>(2.0);
    return nullptr;
}

auto s = makeShape("circle");
s->draw();     // polymorphic, leak-free, exception-safe
\`\`\`

This is the standard way to return a polymorphic object. It requires \`virtual ~Shape() = default;\` from Chapter 2 — without it, deleting through the base pointer is undefined behaviour.

### make_unique over new

\`\`\`cpp
auto a = std::make_unique<Widget>(x);       // preferred
std::unique_ptr<Widget> b{new Widget{x}};   // works, but names the type twice
\`\`\`

\`make_unique\` writes the type once, never says \`new\`, and — before C++17 tightened argument evaluation order — closed a real leak, where a raw \`new\` in one argument could be stranded by another argument throwing. Reserve the \`new\` form for the cases \`make_unique\` cannot express, such as attaching a custom deleter.

### Custom deleters wrap any C API

\`\`\`cpp
struct FileCloser {
    void operator()(std::FILE* f) const noexcept { if (f) std::fclose(f); }
};
using FilePtr = std::unique_ptr<std::FILE, FileCloser>;

FilePtr f{std::fopen("data.bin", "rb")};
if (!f) throw std::runtime_error{"cannot open data.bin"};
std::fread(buf, 1, n, f.get());
\`\`\`

Three lines turn a C handle — a socket, an SQLite connection, an OpenSSL context — into an RAII type. Prefer a stateless functor over a function pointer: a function-pointer deleter has to be stored, which doubles the size of the pointer.

### get, reset, release

| Call | Meaning |
|---|---|
| \`get()\` | Raw pointer for passing to an API. Ownership unchanged — never \`delete\` it |
| \`reset(p)\` | Delete the current object and adopt \`p\` |
| \`release()\` | Give up ownership and return the raw pointer — **you** must now delete it |

\`release()\` is the only one that can leak, and you almost never need it.

### The pimpl idiom

\`\`\`cpp
// widget.hpp
class Widget {
public:
    Widget();
    ~Widget();                            // declared here, DEFINED in the .cpp
    Widget(Widget&&) noexcept;
    Widget& operator=(Widget&&) noexcept;
private:
    struct Impl;
    std::unique_ptr<Impl> impl_;
};
\`\`\`

Hiding the implementation behind a \`unique_ptr\` keeps heavy headers out of your public interface and stops rebuilds cascading. The gotcha catches everyone once: if you leave the destructor implicit, the compiler generates it in every translation unit that includes the header, where \`Impl\` is still incomplete, and you get "invalid application of sizeof to an incomplete type". Declare the destructor in the header, define it in the \`.cpp\` after \`Impl\` is complete.
        `,
        [
          q('Which unique_ptr member hands back the raw pointer and makes you responsible for deleting it?',
            [
              'release()',
              'get()',
              'reset()',
              'operator*()',
            ], 0, 'release() gives up ownership without deleting, which makes it the only one of these that can leak.'),
          q('What does sizeof(std::unique_ptr<T>) equal with the default deleter?',
            [
              'Twice the size of a raw pointer, for the pointer and a flag',
              'The same as sizeof(T*) — the safety costs nothing',
              'The size of T plus a control block',
              'It is implementation-defined and typically 24 bytes',
            ], 1, 'A stateless deleter takes no space, so the type is a raw pointer with a destructor attached.'),
          q('A pimpl class leaves its destructor implicit and the build fails with "invalid application of sizeof to an incomplete type". Why?',
            [
              'unique_ptr cannot hold a forward-declared type at all',
              'Impl must be declared before the class, not inside it',
              'The implicit destructor is generated in every translation unit that includes the header, where Impl is still incomplete',
              'The header is missing #include <memory>',
            ], 2, 'Declare the destructor in the header and define it in the .cpp after Impl is complete, so it is generated in one place that can see the full type.'),
        ]
      ),
        lesson('shared_ptr, weak_ptr, and Reference Cycles', 14, `
\`std::shared_ptr\` is for the cases where ownership genuinely is shared and the last owner cannot be predicted. It keeps a reference count and destroys the object when that count hits zero.

\`\`\`cpp
auto a = std::make_shared<Texture>("wall.png");
{
    auto b = a;                  // use_count() == 2
    render(*b);
}                                // b destroyed, use_count() == 1
// object freed when the last shared_ptr goes away
\`\`\`

### What it actually costs

A \`shared_ptr\` is two pointers: one to the object, one to a **control block** holding the strong count, the weak count and the deleter. Copying performs an atomic increment, which is cheap but not free — copying \`shared_ptr\` in a hot loop is measurable, and passing \`const shared_ptr<T>&\` or a plain \`const T&\` avoids it entirely.

\`make_shared\` allocates the object and the control block together: one allocation instead of two, and the two sit next to each other in memory. The one caveat is that the combined block is only released when the last **weak** reference dies too, so a very large object with long-lived observers is a reason to prefer \`std::shared_ptr<T>{new T}\`.

### Never build two control blocks

\`\`\`cpp
Widget* raw = new Widget;
std::shared_ptr<Widget> a{raw};
std::shared_ptr<Widget> b{raw};   // SECOND control block - double free
\`\`\`

Each control block counts to zero independently and each deletes the object. The rule: an object enters shared ownership exactly once, at construction, via \`make_shared\`. If a class needs to hand out a \`shared_ptr\` to itself, inherit \`std::enable_shared_from_this\` and call \`shared_from_this()\` — never \`std::shared_ptr<T>{this}\`, which is the same mistake with a different spelling.

\`\`\`cpp
class Session : public std::enable_shared_from_this<Session> {
public:
    void start() {
        auto self = shared_from_this();          // keeps this alive
        asyncRead([self](auto data) { self->handle(data); });
    }
};
\`\`\`

### Cycles leak, permanently

\`\`\`cpp
struct Node {
    std::shared_ptr<Node> next;
    std::shared_ptr<Node> prev;    // BUG
};

auto a = std::make_shared<Node>();
auto b = std::make_shared<Node>();
a->next = b;
b->prev = a;    // a and b each hold the other; neither count reaches zero
\`\`\`

Reference counting cannot collect a cycle. Both nodes leak for the lifetime of the process, and no sanitiser will call it a use-after-free because technically nothing is wrong — the objects are simply immortal. Parent-to-child links own; child-to-parent and observer links do not:

\`\`\`cpp
struct Node {
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;      // observes without extending the lifetime
};
\`\`\`

### Using a weak_ptr

\`\`\`cpp
std::weak_ptr<Session> weak = session;

if (auto s = weak.lock()) {    // lock() returns a shared_ptr, or nullptr
    s->send(msg);              // alive for as long as s exists
}
\`\`\`

Do not call \`expired()\` and then \`lock()\` — in threaded code the object can die between the two. Just \`lock()\` and test the result; that is atomic.

### The comparison

| Type | Owns | Copyable | Size |
|---|---|---|---|
| \`unique_ptr<T>\` | Yes, exclusively | No (movable) | 1 pointer |
| \`shared_ptr<T>\` | Yes, jointly | Yes (atomic refcount) | 2 pointers |
| \`weak_ptr<T>\` | No | Yes | 2 pointers |
| \`T*\` / \`T&\` | No | Yes | 1 pointer / none |

### Default to unique_ptr

\`shared_ptr\` is popular precisely because it never forces you to decide who owns what — and that is the problem. "Shared" means no single place is responsible for the lifetime, so working out *why* an object is still alive means auditing every copy in the codebase. Reach for it when ownership really is shared and its end really is unpredictable: caches, observer registries, async callbacks that may outlive their caller. Everything else is a \`unique_ptr\` plus references.
        `,
        [
          q('Why is if (!w.expired()) w.lock()->send(msg); wrong in threaded code?',
            [
              'expired() is only available on shared_ptr',
              'lock() invalidates the weak_ptr, so it can be called only once',
              'expired() takes the control block lock and deadlocks against lock()',
              'The object can be destroyed between the two calls; lock() once and test the returned shared_ptr',
            ], 3, 'Only lock() is atomic with respect to the last owner going away, so the check and the acquisition must be the same operation.'),
          q('What does std::make_shared do that std::shared_ptr<T>{new T} does not?',
            [
              'It allocates the object and the control block together, in one allocation',
              'It makes the pointee thread safe',
              'It avoids the atomic reference count',
              'It allows a custom deleter to be supplied',
            ], 0, 'One allocation instead of two, at the cost of the memory living until the last weak_ptr also goes away.'),
          q('A Session must pass a shared_ptr to itself into an async callback. What is correct?',
            [
              'Construct std::shared_ptr<Session>{this} inside the method',
              'Inherit std::enable_shared_from_this<Session> and call shared_from_this()',
              'Capture this by value in the lambda',
              'Store a weak_ptr member initialised from this in the constructor',
            ], 1, 'shared_ptr<Session>{this} creates a second control block and a second delete; shared_from_this joins the existing one.'),
        ]
      ),
        lesson('Non-Owning Views: string_view and span', 13, `
A view is a pointer and a length, nothing more. It borrows bytes somebody else owns, which makes it free to pass and dangerous to store — the same trade the whole chapter has been circling.

### string_view accepts everything and copies nothing

\`\`\`cpp
#include <string_view>

void greet(std::string_view name);   // one overload for every kind of text

greet("world");                  // literal: no allocation
greet(user.name());              // std::string: no copy
greet(std::string_view{buf, n}); // raw char buffer with a length
\`\`\`

The old alternative was two overloads — \`const std::string&\` and \`const char*\` — where the first silently allocated a whole \`std::string\` every time a caller passed a literal. A \`std::string_view\` parameter removes both the overload and the allocation. \`substr\`, \`remove_prefix\` and comparisons on a view are pure pointer arithmetic, so a parser built from views allocates nothing at all.

### It owns nothing, so it dangles

\`\`\`cpp
std::string_view bad() {
    std::string s = load();
    return s;                    // the string dies at the closing brace
}

std::string_view v = person.name() + "!";   // temporary destroyed at the semicolon
std::cout << v;                             // undefined behaviour
\`\`\`

This is Chapter 1's dangling reference wearing new clothes, and it is easier to hit because the view *looks* like a value type. The discipline is simple: **views are parameters and locals, not members and not return types.** A class that stores a \`string_view\` has tied its own lifetime to something it does not control, which is precisely the question this chapter exists to answer.

### A view is not null-terminated

\`\`\`cpp
void openIt(std::string_view path) {
    std::FILE* f = std::fopen(path.data(), "rb");   // BUG: data() may run on
    std::string p{path};
    std::FILE* g = std::fopen(p.c_str(), "rb");     // one copy, and correct
}
\`\`\`

\`data()\` returns the start of the borrowed bytes, with no promise of a terminator — a view over the middle of a larger buffer keeps reading into the rest of it. Any C API that expects a \`const char*\` string needs a real \`std::string\` (or a \`std::filesystem::path\`), so convert once at the boundary.

### span does the same job for arrays

\`\`\`cpp
#include <span>

double mean(std::span<const double> xs) {
    return std::accumulate(xs.begin(), xs.end(), 0.0) / xs.size();
}

std::vector<double> v{1, 2, 3, 4};
std::array<double, 3>  a{1, 2, 3};
double raw[2]{4, 5};

mean(v);                      // size deduced
mean(a);                      // size deduced
mean(raw);                    // size deduced - no separate length argument
mean(std::span{v}.subspan(1, 2));   // a window over part of it
\`\`\`

Compare that with \`double mean(const double* xs, std::size_t n)\`, where every call site has to compute \`n\` correctly and exactly one of them will not. \`std::span\` carries the length with the pointer, gives you \`begin()\` and \`end()\` so the standard algorithms work, and turns "pointer plus count" into a single argument the compiler checks.

### The ownership table, extended

| Type | Owns | Copies on pass | Valid while |
|---|---|---|---|
| \`std::string\` / \`std::vector<T>\` | yes | yes, deep | it is alive |
| \`std::unique_ptr<T>\` | yes, exclusively | not copyable | it is alive |
| \`std::string_view\` / \`std::span<T>\` | no | pointer and length only | the owner is alive **and has not reallocated** |
| \`const T&\` | no | none | the referent is alive |

That second condition on the last view row catches people: \`push_back\` on the vector a \`span\` was built from can reallocate the buffer, and the span is left pointing into freed memory exactly as an iterator would be (Chapter 4).

### Use them where they belong

Take \`std::string_view\` for read-only text parameters, \`std::span<const T>\` for read-only contiguous data, and \`std::span<T>\` when the function writes into a buffer the caller provides. Return owning types. Store owning types. When a view and its owner must live together in one struct, you have left the type system unable to answer who owns what — take the copy instead and revisit it only when a profile says the copy matters.
        `,
        [
          q('std::string_view name() const { return name_; } on a class whose name_ is a std::string is fine, but std::string_view fullName() { return first_ + " " + last_; } is not. Why?',
            [
              'The second one allocates, which a view forbids',
              'The second returns a view of a temporary that is destroyed at the end of the expression, so the caller reads freed memory',
              'operator+ is not defined for std::string_view',
              'The second needs to be marked const',
            ], 1, 'A view keeps no ownership, so anything it points at must outlive it — a temporary never does.'),
          q('Why is std::fopen(sv.data(), "rb") wrong for a std::string_view sv?',
            [
              'data() returns a non-const pointer that fopen rejects',
              'string_view stores UTF-16 internally',
              'data() is not null-terminated, so fopen reads past the end of the view',
              'fopen needs a std::filesystem::path in C++17 and later',
            ], 2, 'A view is a pointer and a length; converting to a std::string at the C boundary is the one copy worth paying for.'),
          q('What does std::span<const double> give a function that const double* xs, std::size_t n does not?',
            [
              'It copies the data so the caller cannot modify it during the call',
              'It guarantees the data outlives the call',
              'It allows the function to resize the range',
              'It carries the length with the pointer and provides begin/end, so callers cannot pass a wrong count and algorithms work directly',
            ], 3, 'The length travels with the data as one checked argument, which removes the classic off-by-one at the call site.'),
        ]
      ),
      ],
      [
        q('What replaces new int[n] / delete[] in modern C++?', [
          'std::unique_ptr<int>',
          'std::shared_ptr<int>',
          'A raw pointer with a comment documenting the owner',
          'std::vector<int>',
        ], 3, 'vector owns a dynamically sized array, resizes it, and frees it on every exit path including exceptions.'),
        q('Why is void inspect(const std::unique_ptr<Widget>&) a poor signature?', [
          'unique_ptr cannot be passed by const reference',
          'It forces callers to own via unique_ptr although the function only reads; take const Widget&',
          'It silently copies the pointer',
          'It transfers ownership without the caller noticing',
        ], 1, 'A function that does not participate in ownership should not constrain how the caller stores the object.'),
        q('Two shared_ptrs are constructed separately from the same raw pointer. What happens?', [
          'use_count() becomes 2 and the object is freed once',
          'The second shared_ptr is null',
          'Two independent control blocks are created and the object is deleted twice',
          'The code fails to compile',
        ], 2, 'Each shared_ptr starts its own reference count, so each one deletes the object when its count hits zero.'),
        q('Two Node objects each hold a shared_ptr to the other. What is the result?', [
          'Both nodes leak, because reference counting cannot break a cycle',
          'Nothing — the runtime detects and collects cycles',
          'A crash when the first node is destroyed',
          'A compile error about recursive types',
        ], 0, 'Each node keeps the other alive, so neither count ever reaches zero; one of the links must be a weak_ptr.'),
      ]
    ),
    chapter(
      'The STL and Move Semantics',
      'Containers, iterators, algorithms, and the language feature that makes returning big objects free.',
      [
        lesson('Containers: vector, map, and Choosing Correctly', 13, `
\`std::vector\` is the default container, and the bar the others have to clear. Its elements are contiguous, so iterating one is a straight walk through cache lines — which in practice beats a linked list or a tree even for workloads the textbook says favour them.

\`\`\`cpp
std::vector<int> v;
v.reserve(1000);                 // one allocation instead of about eleven
for (int i = 0; i < 1000; ++i) v.push_back(i);

v.emplace_back(42);              // constructs in place, no temporary
v.size();                        // how many elements exist
v.capacity();                    // how many fit before the next reallocation
\`\`\`

\`push_back\` is amortised O(1): when capacity runs out the vector allocates a bigger block (typically double), moves every element across, and frees the old one. \`reserve\` when you know the size — it is the cheapest performance win in the language.

### Iterator invalidation — the classic bug

\`\`\`cpp
std::vector<int> v{1, 2, 3};
int& first = v.front();
auto it = v.begin();

v.push_back(4);   // MAY reallocate

first = 0;        // undefined behaviour
*it = 0;          // undefined behaviour
\`\`\`

Any operation that can grow a vector invalidates every iterator, pointer and reference into it. What makes this bug so persistent is that it *works* until the day capacity happens to run out — so it passes every test with three elements and corrupts memory in production with four.

| Container | What insertion invalidates |
|---|---|
| \`vector\` | Everything, if it reallocates |
| \`deque\` | All iterators; references survive insertion at either end |
| \`list\` | Nothing |
| \`map\` / \`set\` | Nothing |
| \`unordered_map\` | Iterators on rehash; references never |

### map versus unordered_map

|  | \`std::map\` | \`std::unordered_map\` |
|---|---|---|
| Order | Sorted by key | Unspecified |
| Lookup | O(log n) | O(1) average |
| Requires | \`operator<\` | \`std::hash\` and \`operator==\` |
| Good for | Ordered iteration, range queries | Pure lookup |

Both allocate a node per element. For a small, mostly-static set of keys, a sorted \`std::vector\` with \`std::lower_bound\` usually wins on both memory and speed.

### operator[] inserts, and this surprises everyone

\`\`\`cpp
std::map<std::string, int> counts;

if (counts["missing"] > 0) { }    // just INSERTED "missing" -> 0
\`\`\`

The map now has an entry that was never counted, \`size()\` has grown, and a later iteration reports a key that does not exist in your data. On a \`const\` map \`operator[]\` does not even compile, which is a hint about what it really does. Read with \`find\`, \`at\`, or C++20's \`contains\`:

\`\`\`cpp
if (auto it = counts.find(key); it != counts.end()) use(it->second);
if (counts.contains(key)) { }
int n = counts.at(key);           // throws std::out_of_range if absent
\`\`\`

\`operator[]\` is exactly right when default insertion *is* what you want:

\`\`\`cpp
for (const auto& word : words) ++counts[word];   // idiomatic word count
\`\`\`

### Structured bindings

\`\`\`cpp
for (const auto& [word, n] : counts)
    std::cout << word << ": " << n << '\\n';
\`\`\`

Far clearer than \`pair.first\` and \`pair.second\`, and the \`const auto&\` avoids copying every key string.

### Choosing, in one list

- **Default**: \`vector\`.
- **Fixed size known at compile time**: \`std::array\` — no heap allocation at all.
- **Key to value, iterated in key order**: \`map\`.
- **Key to value, fastest lookup**: \`unordered_map\`.
- **Push and pop at both ends**: \`deque\`.
- **Stable references through insertion, or cheap splicing**: \`list\` — rarely the right answer.

When in doubt, start with \`vector\` and change only after measuring.
        `,
        [
          q('What does v.reserve(1000) before a thousand push_backs actually save?',
            [
              'Nothing measurable; push_back is O(1) either way',
              'It changes v.size() to 1000 so the loop can assign instead of push',
              'The repeated reallocate-and-move-everything steps as the capacity grows',
              'The construction of the thousand elements',
            ], 2, 'Growth reallocates a bigger block and moves every element across, so reserving turns about eleven allocations into one.'),
          q('Which container leaves existing iterators and references valid when you insert a new element?',
            [
              'std::vector, unless it reallocates',
              'std::unordered_map, always',
              'std::deque, for iterators',
              'std::map',
            ], 3, 'Node-based ordered containers link a new node in without touching the existing ones, so nothing already handed out moves.'),
          q('You need lookup by key and you also iterate the keys in sorted order for a report. Which container?',
            [
              'std::unordered_map, then sort the keys on each report',
              'std::map, which keeps the keys ordered for free',
              'std::vector<std::pair<K,V>> with linear search',
              'std::multiset of values',
            ], 1, 'unordered_map wins on raw lookup, but ordered iteration and range queries are exactly what the tree-based map is for.'),
        ]
      ),
        lesson('Iterators and Algorithms', 14, `
An iterator generalises a pointer. Every standard algorithm is written against iterators, which is why one \`std::sort\` works on a vector, a deque, a C array and your own container.

### Half-open ranges

Every range is \`[begin, end)\` — \`end\` is one **past** the last element. That convention makes \`end - begin == size\`, makes an empty range simply \`begin == end\`, and removes the off-by-one special cases that plague inclusive ranges.

\`\`\`cpp
for (auto it = v.begin(); it != v.end(); ++it) *it *= 2;
\`\`\`

Compare with \`!=\`, not \`<\` — only random-access iterators support \`<\`, so \`!=\` is the form that works for every container.

### The algorithms worth memorising

\`\`\`cpp
#include <algorithm>
#include <numeric>

std::sort(v.begin(), v.end());
std::sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
    return a.score > b.score;                       // descending
});

auto it = std::find(v.begin(), v.end(), 42);
if (it != v.end()) use(*it);                        // ALWAYS check against end()

bool any   = std::any_of(v.begin(), v.end(), isValid);
auto n     = std::count_if(v.begin(), v.end(), isValid);
int total  = std::accumulate(v.begin(), v.end(), 0);   // 0 sets the result type
auto pos   = std::lower_bound(sorted.begin(), sorted.end(), key);  // binary search

std::transform(src.begin(), src.end(), std::back_inserter(dst), toUpper);
\`\`\`

Note \`std::accumulate(v.begin(), v.end(), 0)\` over a vector of \`double\` returns an \`int\` — the initial value fixes the accumulator type. Write \`0.0\`.

### The erase-remove idiom

\`\`\`cpp
std::remove(v.begin(), v.end(), 0);    // removes NOTHING
\`\`\`

Algorithms receive iterators, not containers, so they cannot change a container's size. \`std::remove\` shifts the survivors to the front and returns an iterator to the new logical end; the tail still holds unspecified values and \`v.size()\` is unchanged. You have to erase:

\`\`\`cpp
v.erase(std::remove(v.begin(), v.end(), 0), v.end());   // C++17 and earlier
std::erase(v, 0);                                       // C++20 - prefer this
std::erase_if(v, [](int n) { return n < 0; });
\`\`\`

Calling \`remove\` and ignoring the return value is one of the most common STL bugs in real code, and it hides well: the container still contains something that looks like your data, so the failure shows up as duplicate rows much later.

### Erasing while iterating

\`\`\`cpp
for (auto it = m.begin(); it != m.end(); ) {
    if (it->second == 0) it = m.erase(it);   // erase returns the next iterator
    else ++it;
}
\`\`\`

Notice the empty increment in the \`for\` header. Writing \`m.erase(it); ++it;\` increments an iterator that has already been invalidated — undefined behaviour that frequently appears to work.

### Ranges (C++20)

\`\`\`cpp
#include <ranges>
namespace rv = std::views;

std::ranges::sort(v);                        // no .begin()/.end() pair

for (int n : v | rv::filter(isEven) | rv::transform(square))
    use(n);
\`\`\`

Views are **lazy and non-owning**: nothing is computed until you iterate, and no intermediate vector is allocated. The catch is lifetime — a view built over a temporary container dangles the moment the full expression ends, which is the ranges equivalent of the dangling reference from Chapter 1.

### Lambdas as predicates

\`\`\`cpp
double threshold = 4.5;
auto good = [threshold](const Course& c) { return c.rating >= threshold; };

std::vector<Course> best;
std::copy_if(all.begin(), all.end(), std::back_inserter(best), good);
\`\`\`

Capture by value unless you have a reason not to. \`[&]\` is safe for a lambda passed straight into an algorithm on the same line, and a dangling capture waiting to happen for anything stored in a member, a container, or a thread.
        `,
        [
          q('std::accumulate(v.begin(), v.end(), 0) is called on a std::vector<double>. What is the result?',
            [
              'A double sum, because the element type wins',
              'A compile error about mismatched types',
              'The sum accumulated in int, truncating every addition — pass 0.0 instead',
              'The correct sum, rounded only at the end',
            ], 2, 'The initial value fixes the accumulator type, so an int seed truncates on every step.'),
          q('Which loop erases matching entries from a std::map correctly?',
            [
              'for (auto it = m.begin(); it != m.end(); ++it) if (pred(it)) m.erase(it);',
              'for (auto& kv : m) if (pred(kv)) m.erase(kv.first);',
              'for (auto it = m.begin(); it != m.end(); ) { if (pred(it)) it = m.erase(it); else ++it; }',
              'for (auto it = m.begin(); it != m.end(); ++it) { m.erase(it); ++it; }',
            ], 2, 'erase returns the iterator following the removed element, and incrementing an already-erased iterator is undefined behaviour.'),
          q('Why do idiomatic iterator loops compare with != rather than < ?',
            [
              'Only random-access iterators support <, so != is the form that works for every container',
              '< performs an extra dereference',
              '!= is required for const iterators',
              'The standard forbids < on any iterator',
            ], 0, 'A list or map iterator has no ordering operator, so != is the comparison every iterator category provides.'),
        ]
      ),
        lesson('Move Semantics and Value Categories', 15, `
Copying a 100 MB vector in order to hand it to a function is pure waste when the source is about to be destroyed anyway. Move semantics is the language noticing that.

### lvalues and rvalues

\`\`\`cpp
std::string s = "hello";

s                  // lvalue: it has a name, you can take its address
std::string{"hi"}  // rvalue: a temporary nobody else can observe
s + "!"            // rvalue
std::move(s)       // an lvalue cast to an rvalue reference
\`\`\`

An **rvalue** is an expression whose value nobody will look at again. That is the licence to steal from it.

### What a move actually does

\`\`\`cpp
std::vector<int> a(1'000'000, 7);

std::vector<int> b = a;              // copy: allocates 1M ints and copies them
std::vector<int> c = std::move(a);   // move: steals the buffer, three pointer writes
// a is now valid but UNSPECIFIED - typically empty. Do not read its value.
\`\`\`

A move is not faster copying; it is a transfer of ownership of an internal resource. Afterwards the source must remain **destructible and assignable**, and you may assume nothing else. Reading a moved-from \`std::string\` and expecting its old contents is a genuine bug, and not one small-string optimisation rescues: every mainstream implementation empties the source whether the text sat in the small-string buffer or on the heap, and the standard promises only "valid but unspecified" either way.

### std::move moves nothing

It is a cast — \`static_cast<T&&>\` — and generates no instructions. The move happens inside whichever constructor or assignment operator gets selected *because* of that cast. If the type has no move operations, \`std::move\` silently gives you a copy.

\`\`\`cpp
void Store::add(std::string s) {          // take by value
    items_.push_back(std::move(s));       // then move in: never more than one copy
}

store.add(name);              // copy into s, then move into the vector
store.add(std::move(name));   // move into s, then move into the vector
\`\`\`

### Overloading on rvalue-ness

\`\`\`cpp
class Buffer {
public:
    void set(const std::vector<int>& v) { data_ = v; }              // copies
    void set(std::vector<int>&& v)      { data_ = std::move(v); }   // steals
private:
    std::vector<int> data_;
};
\`\`\`

Look closely at the second overload. Inside it, \`v\` **is an lvalue** — it has a name — even though its type is an rvalue reference. Leave out the inner \`std::move\` and you get a full copy despite the \`&&\` in the signature. This catches nearly everyone exactly once.

### Forwarding references

\`\`\`cpp
template <typename T>
void relay(T&& arg) {                  // deduced context: a FORWARDING reference
    process(std::forward<T>(arg));     // preserves lvalue-ness or rvalue-ness
}
\`\`\`

\`T&&\` on a deduced template parameter is not an rvalue reference; it binds to both. Use \`std::forward<T>\` there and \`std::move\` for a concrete \`T&&\`. Using \`std::move\` on a forwarding reference silently steals from a caller's lvalue.

### Two mistakes that look like optimisations

\`\`\`cpp
std::string build() {
    std::string s = compose();
    return std::move(s);     // WRONG: blocks elision, forces an unnecessary move
    // return s;             // RIGHT
}

const std::string cs = "x";
auto d = std::move(cs);      // silently COPIES - you cannot move from a const object
\`\`\`

Both compile, both read as performance work, and both are slower than doing nothing.

### Where you actually write move code

Almost nowhere, if you follow the rule of zero from Chapter 2. \`vector\`, \`string\` and \`unique_ptr\` already move correctly, so a class built from them gets correct moves generated for free. You write move constructors only when you own a raw resource — and when you do, mark them \`noexcept\`, or containers will quietly copy instead.
        `,
        [
          q('After std::vector<int> c = std::move(a); what may you assume about a?',
            [
              'It still holds its original elements',
              'It is valid but unspecified — you may destroy it or assign to it, nothing more',
              'It has been destroyed and touching it is undefined behaviour',
              'It is guaranteed to be empty by the standard',
            ], 1, 'Implementations usually leave it empty, but the only promise is that it can be destroyed and assigned to.'),
          q('const std::string cs = "x"; auto d = std::move(cs); — what happens?',
            [
              'A compile error, since std::move cannot take a const argument',
              'cs is emptied despite being const',
              'A copy: you cannot steal from a const object, so the copy constructor is selected',
              'A move, because std::move casts away const',
            ], 2, 'const std::string&& will not bind to the move constructor, so overload resolution quietly falls back to the copy.'),
          q('In template <typename T> void relay(T&& arg), which call is correct inside?',
            [
              'process(std::move(arg)), because arg is an rvalue reference',
              'process(arg), because forwarding is automatic in templates',
              'process(static_cast<T>(arg)), to strip the reference',
              'process(std::forward<T>(arg)), which preserves whether the caller passed an lvalue or an rvalue',
            ], 3, 'T&& in a deduced context binds to both categories, so std::move there would steal from a caller lvalue.'),
        ]
      ),
        lesson('Vocabulary Types: optional, variant, and tuple', 13, `
Three shapes of data turn up in every program: a value that might be absent, a value that is one of several types, and several values returned together. The standard has a type for each, and each replaces something worse.

### optional: a value that may not be there

\`\`\`cpp
#include <optional>

std::optional<int> parsePort(std::string_view s);

if (auto port = parsePort(text)) {   // contextually converts to bool
    connect(*port);                  // * and -> reach the value
}
int port = parsePort(text).value_or(8080);
\`\`\`

What it replaces is a magic \`-1\`, a \`bool ok\` out-parameter, or a pointer whose ownership nobody can name. It costs nothing to use: an \`optional<T>\` is a \`T\` and a bool stored inline, with no heap allocation and no indirection.

Two rules. \`*opt\` on a disengaged optional is **undefined behaviour** — call \`value()\` if you want a thrown \`std::bad_optional_access\`, or test it first, and never assume a moved-from optional is empty. And \`std::optional<T&>\` does not exist before C++26; when "maybe a reference" is what you mean, the idiomatic answer is a raw observing pointer (Chapter 3).

### variant: exactly one of a fixed set

\`\`\`cpp
#include <variant>

using Value = std::variant<std::monostate, long, double, std::string>;

Value v = 3.5;                              // holds a double
v = std::string{"hi"};                      // the double is destroyed first
v.index();                                  // 3
std::holds_alternative<std::string>(v);     // true
\`\`\`

\`std::monostate\` is the conventional empty alternative, and it makes the variant default-constructible when the first real alternative is not. The payload lives inside the variant — its size is the largest alternative plus a discriminator, and it never allocates.

\`\`\`cpp
double d = std::get<double>(v);                        // throws std::bad_variant_access
if (auto* s = std::get_if<std::string>(&v)) use(*s);   // returns nullptr instead
\`\`\`

The tool worth learning properly is \`std::visit\`, because it is exhaustive:

\`\`\`cpp
struct Render {
    std::string operator()(std::monostate) const        { return "null"; }
    std::string operator()(long n) const                { return std::to_string(n); }
    std::string operator()(double x) const              { return std::to_string(x); }
    std::string operator()(const std::string& s) const  { return "\\"" + s + "\\""; }
};

std::string text = std::visit(Render{}, v);
\`\`\`

Add a fifth alternative to \`Value\` and this stops compiling until you write a handler for it. A tag enum plus a \`switch\` gives you a silent runtime surprise in the one branch nobody updated; a variant plus \`visit\` gives you a build error in a file you already have open. A hand-written tagged union can additionally end up with the tag and the payload disagreeing, which a variant makes unrepresentable.

### tuple and pair: several values at once

\`\`\`cpp
std::tuple<bool, std::string, int> parseLine(std::string_view line);

auto [ok, name, count] = parseLine(line);   // structured bindings
\`\`\`

Easy to overuse. At an API boundary a \`std::pair<bool, int>\` forces every reader to remember what \`.first\` meant, and a three-field struct with real names costs three lines. Where tuples genuinely earn their place is comparison:

\`\`\`cpp
struct Row { std::string last, first; int id; };

bool operator<(const Row& a, const Row& b) {
    return std::tie(a.last, a.first, a.id) < std::tie(b.last, b.first, b.id);
}
\`\`\`

\`std::tie\` builds a tuple of references, so nothing is copied, and tuple comparison is already lexicographic — three fields sort correctly in one line instead of the nest of \`if\`s everyone gets wrong once.

### Choosing

| The shape of your data | The type |
|---|---|
| Might be absent | \`std::optional<T>\` |
| One of a closed set of types | \`std::variant<A, B, C>\` + \`std::visit\` |
| One of an open set, chosen at runtime | an interface and \`std::unique_ptr\` (Chapter 3) |
| Several values, no meaningful names | \`std::tuple\` |
| Several values with meaning | a named struct |
| A value or a reason it failed | \`std::expected<T, E>\` (C++23) or a small struct |

The common thread is that each one makes an illegal state impossible to write down. That is the same argument as the class invariant from Chapter 2, applied to the shape of a value rather than to the contents of an object.
        `,
        [
          q('A std::variant currently holds a std::string and the code calls std::get<double>(v). What happens?',
            [
              'It returns a default-constructed double',
              'It is undefined behaviour, like reading the wrong member of a union',
              'It throws std::bad_variant_access; std::get_if returns a null pointer instead of throwing',
              'It fails to compile, because the alternative is known statically',
            ], 2, 'A variant always knows which alternative it holds, so a wrong std::get is a checked runtime error rather than undefined behaviour.'),
          q('Why prefer std::visit over a switch on variant.index() or on a tag enum?',
            [
              'visit is faster, because it avoids the branch',
              'Adding a new alternative breaks the build until every handler exists, instead of silently falling through at run time',
              'switch cannot be used with variants at all',
              'visit copies the alternative, which makes it safer',
            ], 1, 'Exhaustiveness is checked at compile time, so the missing case is a build error in a file you have open rather than a production surprise.'),
          q('What does *opt do when the std::optional is empty?',
            [
              'It returns a value-initialised T',
              'It throws std::bad_optional_access',
              'It is undefined behaviour — value() is the checked accessor that throws',
              'It returns a null pointer',
            ], 2, 'operator* is the unchecked fast path, so test the optional or call value() when you want the exception.'),
        ]
      ),
      ],
      [
        q('What does std::remove(v.begin(), v.end(), 0); do on its own?', [
          'Removes every 0 and shrinks the vector',
          'Returns a new vector without the zeros',
          'Shifts survivors to the front and returns the new logical end; v.size() is unchanged',
          'Fails to compile without an erase call',
        ], 2, 'Algorithms only see iterators, so they cannot resize a container — you must erase the tail yourself.'),
        q('std::map<std::string,int> counts; if (counts["missing"] > 0) — what happened?', [
          'It returned 0 without touching the map',
          'It threw std::out_of_range',
          'It returned an end iterator',
          'It default-constructed and inserted an entry for "missing"',
        ], 3, 'operator[] inserts a value-initialised element when the key is absent, which is why it does not exist on const maps.'),
        q('Inside void set(std::vector<int>&& v) { data_ = v; }, what happens?', [
          'v is moved automatically because the parameter is an rvalue reference',
          'v has a name, so it is an lvalue and this performs a copy',
          'It fails to compile without std::forward',
          'The move already happened at the call site',
        ], 1, 'Value category is a property of the expression, not the declared type, so a named rvalue reference still needs std::move.'),
        q('int& first = v.front(); v.push_back(x); first = 1; — what is the risk?', [
          'Undefined behaviour if push_back reallocated the buffer',
          'None; references into a vector are always stable',
          'None; front() returns a copy',
          'A compile error, because front() returns const',
        ], 0, 'Growing a vector can move the elements to a new block, leaving every existing reference and iterator dangling.'),
      ]
    ),
    chapter(
      'Generic Code, Errors, and Builds',
      'Templates that fail readably, error handling that leaks nothing, and a CMake project that builds anywhere.',
      [
        lesson('Templates and Generic Programming', 14, `
A template is not a function or a class. It is a recipe the compiler uses to generate one, per set of type arguments you actually use.

\`\`\`cpp
template <typename T>
T maxOf(const T& a, const T& b) { return a < b ? b : a; }

maxOf(3, 7);                                  // T = int
maxOf(std::string{"a"}, std::string{"b"});    // T = std::string
maxOf(3, 7.5);                                // ERROR: T deduced as int and double
maxOf<double>(3, 7.5);                        // fine - stated explicitly
\`\`\`

Deduction never converts to make two arguments agree; it either finds one consistent \`T\` or it fails. State the argument yourself when the types differ legitimately.

### Class templates

\`\`\`cpp
template <typename T, std::size_t N>
class RingBuffer {
public:
    void push(T value) {
        data_[head_] = std::move(value);
        head_ = (head_ + 1) % N;
    }
    const T& operator[](std::size_t i) const { return data_[(head_ + i) % N]; }
    static constexpr std::size_t capacity() { return N; }
private:
    std::array<T, N> data_{};
    std::size_t head_{0};
};

RingBuffer<double, 8> recent;
\`\`\`

Non-type parameters like \`N\` are compile-time values, so \`std::array<T, N>\` needs no heap allocation at all. Since C++17, class template argument deduction removes most explicit arguments elsewhere: \`std::vector v{1, 2, 3};\` deduces \`std::vector<int>\`.

### Templates live in headers

Instantiating \`maxOf<Widget>\` requires the compiler to see the **definition**, not just a declaration. Put a template's body in a \`.cpp\` and every caller compiles happily and then fails at link time with "undefined reference" — the single most common template build error, and the one that sends people hunting for a missing library that was never missing. Define templates in the header, or in an \`.ipp\` included at the bottom of it.

### Constrain with concepts (C++20)

\`\`\`cpp
#include <concepts>

template <typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template <Numeric T>
T mean(const std::vector<T>& v) {
    return std::accumulate(v.begin(), v.end(), T{}) / static_cast<T>(v.size());
}

mean(std::vector<std::string>{});   // error: constraints not satisfied
\`\`\`

That last line now produces one line naming the unsatisfied requirement. Without the constraint, the same mistake produces several hundred lines of instantiation backtrace pointing inside \`<numeric>\`, because the error is only discovered deep inside code you did not write. Concepts move the error back to the call site, which is the real reason to use them.

### if constexpr

\`\`\`cpp
template <typename T>
std::string describe(const T& value) {
    if constexpr (std::is_pointer_v<T>)
        return value ? "pointer" : "null pointer";
    else if constexpr (std::is_integral_v<T>)
        return "integer: " + std::to_string(value);
    else
        return "object";
}
\`\`\`

The branches not taken are **discarded** rather than compiled, so they do not have to be valid for that \`T\`. A plain \`if\` would require \`std::to_string(value)\` to compile even when \`T\` is a \`Widget\`. This one feature replaced most of the tag-dispatch and SFINAE machinery older codebases are full of.

### Templates cost real code

Each instantiation is a separate copy of the machine code. \`std::vector<int>\` and \`std::vector<long>\` are unrelated types with two full sets of functions, and heavily templated headers are the main reason C++ builds get slow. Where the logic does not depend on \`T\`, factor it into an ordinary non-template helper and have the template call it.

### When not to write one

If a function only ever handles text, take a \`std::string_view\`. Generic code costs compile time, produces worse diagnostics, and is harder to step through in a debugger. Write a template when you have two real types today, not because a third might arrive one day.
        `,
        [
          q('maxOf(3, 7.5) with template <typename T> T maxOf(const T&, const T&) does what?',
            [
              'Deduces T = double and converts 3',
              'Deduces T = int and truncates 7.5',
              'Fails to compile, because T cannot be both int and double — write maxOf<double>(3, 7.5)',
              'Instantiates two functions and calls the wider one',
            ], 2, 'Deduction never converts arguments to make them agree; it either finds one consistent T or reports failure.'),
          q('What makes if constexpr different from a plain if inside a template?',
            [
              'The untaken branch is discarded rather than compiled, so it need not be valid for that T',
              'It is evaluated at runtime but without a branch instruction',
              'It only works on integral conditions',
              'It requires every branch to return the same type',
            ], 0, 'That is why std::to_string(value) in a discarded branch does not have to compile when T is a Widget.'),
          q('What does adding a concept such as Numeric to a template actually improve?',
            [
              'The generated machine code is smaller',
              'A bad call is reported at the call site naming the unsatisfied requirement, instead of a wall of instantiation errors inside library headers',
              'The template can then be defined in a .cpp file',
              'Instantiation happens at run time rather than compile time',
            ], 1, 'Constraints move the error back to where the mistake was made, which is the main practical reason to write them.'),
        ]
      ),
        lesson('Errors: Exceptions, RAII, and the Alternatives', 13, `
An exception is for a failure the current function cannot handle and cannot sensibly report through its return type — a missing file, a refused connection, a broken invariant.

\`\`\`cpp
#include <stdexcept>
#include <fstream>

Config load(const std::string& path) {
    std::ifstream in{path};
    if (!in) throw std::runtime_error{"cannot open " + path};
    return parse(in);
}

try {
    auto cfg = load("app.toml");
    run(cfg);
} catch (const std::exception& e) {          // by const reference, always
    std::cerr << "startup failed: " << e.what() << '\\n';
    return 1;
}
\`\`\`

### Throw by value, catch by const reference

\`\`\`cpp
catch (std::exception e)          // BUG: slices the object
catch (const std::exception& e)   // correct
\`\`\`

Catching by value copy-constructs a \`std::exception\` from whatever was thrown. A \`std::out_of_range\` caught that way loses its dynamic type and its message collapses to the base class's — the same **object slicing** that bites when you store derived objects in a \`vector<Base>\`. It compiles without a warning in most configurations, which is why it survives in real codebases for years.

Order handlers most-derived first. The first matching handler wins, so a \`catch (const std::exception&)\` placed above \`catch (const std::runtime_error&)\` makes the second one unreachable.

### The standard hierarchy

| Type | Throw it when |
|---|---|
| \`std::invalid_argument\` | The caller passed nonsense |
| \`std::out_of_range\` | An index or key does not exist |
| \`std::runtime_error\` | A failure only discoverable at runtime (I/O, network) |
| \`std::logic_error\` | The program itself is wrong |
| \`std::bad_alloc\` | Allocation failed — thrown for you |

Derive your own from \`std::runtime_error\` when callers need to distinguish your failures from everyone else's.

### Exceptions and RAII are one design

When an exception propagates, every fully-constructed local object between the \`throw\` and the \`catch\` is destroyed, in reverse order of construction. That is **stack unwinding**, and it is why RAII (Chapter 2) is not merely convenient — it is the only mechanism that makes exception-safe code writable at all. Code that allocates with \`new\` and frees with \`delete\` is not exception safe, and no amount of care makes it so.

Three guarantees are worth naming, because they are what you promise your callers:

- **Basic**: nothing leaks, the object is still usable, its exact state is unspecified.
- **Strong**: the operation either fully succeeds or leaves everything exactly as it was — copy-and-swap from Chapter 2.
- **noexcept**: cannot fail.

### noexcept is a promise, not a request

\`\`\`cpp
void swap(Buffer& a, Buffer& b) noexcept;
Buffer(Buffer&&) noexcept;
\`\`\`

If a \`noexcept\` function throws anyway, \`std::terminate\` runs immediately — no unwinding, no catch, no chance to log. Mark moves, swaps and destructors \`noexcept\` because the library changes its behaviour based on it; leave everything else alone.

### Not every failure is exceptional

A missing configuration file is exceptional. A user typing "abc" into a number field is completely ordinary, and using exceptions for it is both slow and misleading.

\`\`\`cpp
#include <optional>

std::optional<int> parseInt(std::string_view s);

if (auto n = parseInt(input)) use(*n);
else std::cout << "not a number\\n";
\`\`\`

Use \`std::optional\` when "absent" is the whole story, \`std::expected<T, E>\` (C++23) or a small result struct when the caller needs to know *why*, and \`std::from_chars\` in parsing hot loops — it never throws and never allocates.

### The rules

1. Throw by value, catch by \`const\` reference.
2. Never let an exception leave a destructor.
3. Never use exceptions for ordinary control flow; the throwing path is expensive.
4. Own every resource in an object, so unwinding cleans up without your help.
        `,
        [
          q('catch (const std::exception&) is written above catch (const std::runtime_error&). What happens?',
            [
              'The most derived handler still wins',
              'The runtime_error handler is unreachable, because the first matching handler wins',
              'The compiler reorders the handlers',
              'Both handlers run in turn',
            ], 1, 'Handlers are tried in order, so base-class handlers must come last.'),
          q('A user types "abc" into a numeric field. What is the right way to handle it?',
            [
              'Throw std::invalid_argument and catch it in the UI layer',
              'Return -1 and document the sentinel',
              'Return std::optional<int> (or use std::from_chars); invalid input is ordinary, not exceptional',
              'Call std::terminate after logging',
            ], 2, 'Exceptions are for failures the function cannot handle, and the throwing path is expensive; a rejected keystroke is expected behaviour.'),
          q('Which statement describes the strong exception guarantee?',
            [
              'The function never throws',
              'Nothing leaks, but the object may be left in an unspecified state',
              'Any exception is caught and converted to an error code',
              'The operation either fully succeeds or leaves everything exactly as it was',
            ], 3, 'That all-or-nothing behaviour is what copy-and-swap buys, and it is stronger than the basic guarantee of merely not leaking.'),
        ]
      ),
        lesson('Building Real Projects with CMake', 12, `
A single file compiles with \`g++ main.cpp -o app\`. A real project has headers, several targets, tests, dependencies and three platforms. CMake describes **what** to build; it generates the Makefiles, Ninja files or Visual Studio projects that do it.

\`\`\`cmake
cmake_minimum_required(VERSION 3.20)
project(inventory VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)          # -std=c++20, not -std=gnu++20

add_library(core
    src/item.cpp
    src/warehouse.cpp
)
target_include_directories(core PUBLIC include)
target_compile_options(core PRIVATE -Wall -Wextra -Wpedantic)

add_executable(inventory src/main.cpp)
target_link_libraries(inventory PRIVATE core)
\`\`\`

### Always build out of source

\`\`\`bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
./build/inventory
\`\`\`

Everything generated lives in \`build/\`, which you add to \`.gitignore\` and delete freely when something looks stale. Running \`cmake .\` in the source tree scatters caches and generated files among your sources, and the resulting mess is genuinely hard to clean up.

### PUBLIC, PRIVATE, INTERFACE

This is the one CMake concept worth learning properly, because everything else follows from it.

| Keyword | Applies to the target | Propagates to whatever links it |
|---|---|---|
| \`PRIVATE\` | Yes | No |
| \`PUBLIC\` | Yes | Yes |
| \`INTERFACE\` | No | Yes |

\`core\`'s \`include/\` directory is \`PUBLIC\` because anything linking \`core\` must be able to include its headers. The warning flags are \`PRIVATE\` because your team's warning preferences are nobody else's business. Marking everything \`PUBLIC\` is the classic mistake: implementation-only dependencies leak into every downstream target's compile command, builds slow down, and a library you were free to swap out becomes part of your public interface.

### Dependencies without a submodule

\`\`\`cmake
include(FetchContent)
FetchContent_Declare(fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG 10.2.1                       # pin a tag, never a branch
)
FetchContent_MakeAvailable(fmt)

target_link_libraries(inventory PRIVATE fmt::fmt)
\`\`\`

Pinning matters. A floating branch turns "it built yesterday" into an afternoon of bisecting somebody else's repository.

### Tests

\`\`\`cmake
enable_testing()
add_executable(core_tests tests/item_test.cpp)
target_link_libraries(core_tests PRIVATE core)
add_test(NAME core_tests COMMAND core_tests)
\`\`\`

\`ctest --test-dir build --output-on-failure\` runs the suite, and CI runs the same command you do.

### Build types

| Type | Typical flags | Use for |
|---|---|---|
| \`Debug\` | \`-g -O0\` | Stepping through code, live assertions |
| \`Release\` | \`-O3 -DNDEBUG\` | Shipping |
| \`RelWithDebInfo\` | \`-O2 -g\` | Profiling and production crash dumps |

Benchmarking a \`Debug\` build and concluding that C++ is slow is a rite of passage; the difference is routinely ten times.

### Sanitizers as a build option

\`\`\`cmake
option(ENABLE_ASAN "Build with AddressSanitizer and UBSan" OFF)
if(ENABLE_ASAN)
  target_compile_options(core PUBLIC -fsanitize=address,undefined -g)
  target_link_options(core PUBLIC -fsanitize=address,undefined)
endif()
\`\`\`

\`\`\`bash
cmake -S . -B build-asan -DENABLE_ASAN=ON && ctest --test-dir build-asan
\`\`\`

Run the test suite under sanitizers in CI. Combined with everything else in this course — RAII, \`unique_ptr\`, containers instead of raw arrays, the rule of zero — that is how a C++ codebase stops producing the crashes the language is famous for.
        `,
        [
          q('Why run cmake -S . -B build rather than cmake . in the source tree?',
            [
              'In-source builds are rejected by CMake 3.20 and later',
              'Only out-of-source builds can produce a Release configuration',
              'Every generated file lands in build/, which you gitignore and can delete whenever it looks stale',
              'It halves the compile time by enabling parallel builds',
            ], 2, 'An in-source build scatters caches and generated files among your sources and is genuinely hard to clean up afterwards.'),
          q('FetchContent_Declare is given GIT_TAG main instead of a version tag. What is the consequence?',
            [
              'CMake refuses to configure without a tag',
              'The dependency is fetched only once and then frozen anyway',
              'Only the download is slower',
              'The dependency can change under you, so a build that worked yesterday can fail today',
            ], 3, 'Pinning to a tag or commit is what makes the build reproducible for everyone and for CI.'),
          q('What does set(CMAKE_CXX_EXTENSIONS OFF) do?',
            [
              'Compiles with -std=c++20 instead of -std=gnu++20, so compiler-specific extensions are off',
              'Disables all optional CMake modules',
              'Turns off exceptions and RTTI',
              'Prevents targets from adding their own compile options',
            ], 0, 'Leaving it on lets code compile that quietly depends on GNU extensions and then fails on another compiler.'),
        ]
      ),
        lesson('Variadic Templates and Perfect Forwarding', 14, `
A **parameter pack** lets one template take any number of arguments of any types. It is how \`std::make_unique\`, \`emplace_back\` and every formatting helper you have used are written.

### Packs and fold expressions

\`\`\`cpp
template <typename... Ts>
void log(const Ts&... parts) {
    (std::cout << ... << parts) << '\\n';       // binary left fold over <<
}

log("user ", id, " connected in ", ms, "ms");
\`\`\`

\`typename... Ts\` declares the pack, \`const Ts&... parts\` expands it into the parameter list, and \`sizeof...(Ts)\` gives the count. A **fold expression** (C++17) applies one operator across the whole pack:

\`\`\`cpp
template <typename... Ts>
auto sum(const Ts&... xs) { return (xs + ... + 0); }   // right fold with an identity

template <typename... Ts>
bool allTrue(Ts... xs) { return (... && xs); }         // left fold

template <typename... Ts>
void refreshAll(Ts&... xs) { (xs.refresh(), ...); }    // comma fold: call on each

static_assert(sum(1, 2, 3) == 6);
\`\`\`

The identity element is not decoration. \`(xs + ...)\` is ill-formed for an empty pack, while \`(xs + ... + 0)\` correctly yields 0 — and an empty pack is exactly what a generic call site eventually produces. Before C++17 all of this was written as a recursive template with a one-argument base case, which is why older code carries pairs of overloads doing what one fold now does.

### Perfect forwarding

\`\`\`cpp
template <typename T, typename... Args>
std::unique_ptr<T> makeUnique(Args&&... args) {
    return std::unique_ptr<T>{new T(std::forward<Args>(args)...)};
}
\`\`\`

That is \`std::make_unique\` in three lines, and it is why \`make_unique<Widget>(host, 8080)\` works with whatever constructors \`Widget\` happens to have. \`Args&&...\` in a deduced context is a pack of **forwarding references** (Chapter 4), and \`std::forward<Args>(args)...\` expands to one \`std::forward\` per argument, preserving the value category of each one:

| Call | \`Args\` deduced as | After reference collapsing | \`Widget\` receives |
|---|---|---|---|
| \`makeUnique<W>(name)\`, \`name\` an lvalue | \`std::string&\` | \`std::string&\` | an lvalue, so it copies |
| \`makeUnique<W>(std::string{"x"})\` | \`std::string\` | \`std::string&&\` | an rvalue, so it moves |

Reference collapsing is the whole mechanism: \`& &&\` collapses to \`&\`, and only \`&& &&\` stays \`&&\`.

### Forward exactly once

\`\`\`cpp
template <typename T>
void relay(T&& x) {
    first(std::forward<T>(x));
    second(std::forward<T>(x));   // BUG: if x was an rvalue, first() already stole it
}
\`\`\`

\`std::forward\` is a conditional \`std::move\`, so forwarding an rvalue may leave the argument moved-from. Forward on the **last** use only and pass a plain \`x\` everywhere before it. The failure is silent: with an lvalue caller everything works, and the empty string only appears when somebody passes a temporary.

### The greedy constructor

\`\`\`cpp
class Person {
public:
    template <typename S>
    explicit Person(S&& name) : name_{std::forward<S>(name)} {}
    Person(const Person&) = default;
private:
    std::string name_;
};

Person a{"ada"};
Person b{a};        // the TEMPLATE wins, not the copy constructor
\`\`\`

\`a\` is a non-const lvalue, so the template deduces \`S = Person&\` and matches exactly, while the copy constructor would need a conversion to \`const Person&\`. The error surfaces deep inside \`std::string\`, complaining that it cannot be constructed from a \`Person\`. Constrain the template so it stops competing:

\`\`\`cpp
template <std::convertible_to<std::string> S>
explicit Person(S&& name) : name_{std::forward<S>(name)} {}
\`\`\`

An unconstrained perfect-forwarding constructor is one of the few constructs that is nearly always a bug waiting for its first non-const copy.

### Where you actually write this

Factories, wrappers that must not add a copy such as \`emplace_back\` or a task queue storing callables, and formatting helpers. Everywhere else an ordinary function with concrete parameter types compiles faster and produces errors a human can read — the same advice the templates lesson ended on.
        `,
        [
          q('relay(T&& x) calls first(std::forward<T>(x)) and then second(std::forward<T>(x)). What is the defect?',
            [
              'std::forward may only appear once per function by language rule',
              'The second call fails to compile for rvalue arguments',
              'If the caller passed an rvalue, first() may have moved from x, so second() receives a moved-from object',
              'Both calls receive lvalues, so no move ever happens',
            ], 2, 'std::forward is a conditional std::move, so it belongs on the last use of the argument and nowhere earlier.'),
          q('Why write the fold as (xs + ... + 0) rather than (xs + ...)?',
            [
              'The 0 forces the result type to int',
              'It makes the fold left-associative rather than right-associative',
              'Without it the fold is evaluated at run time',
              'An empty pack makes (xs + ...) ill-formed; the identity value gives it a defined result',
            ], 3, 'Generic call sites do produce empty packs, and only the binary fold form has an answer for them.'),
          q('A class has an unconstrained template <typename S> explicit Person(S&& name) plus a defaulted copy constructor. What does Person b{a}; select for a non-const Person a?',
            [
              'The constructor template, because S deduces to Person& and matches exactly',
              'The copy constructor, since it is a better match for a class type',
              'It is ambiguous and fails to compile at the call site',
              'The copy constructor, because templates are never considered for copies',
            ], 0, 'The copy constructor needs a conversion to const Person&, so the exact-match template wins and the error lands inside the member initialiser.'),
        ]
      ),
      ],
      [
        q('You put a function template definition in a .cpp file. What happens?', [
          'It compiles and links normally',
          'Callers get an undefined-reference link error, because the definition is not visible where it is instantiated',
          'The compiler instantiates it for every possible type',
          'Nothing — templates must live in .cpp files',
        ], 1, 'Instantiation needs the full definition at the point of use, so templates belong in headers.'),
        q('What is wrong with catch (std::exception e)?', [
          'It slices the exception, losing the derived type and its message',
          'It is the recommended modern form',
          'It cannot compile without a rethrow',
          'It catches only exceptions thrown by the standard library',
        ], 0, 'Catching by value copy-constructs the base subobject, discarding everything the derived exception carried.'),
        q('In CMake, warning flags such as -Wall should usually be attached with which keyword?', [
          'PUBLIC, so every consumer gets the same warnings',
          'INTERFACE, so only consumers get them',
          'It makes no difference which keyword you use',
          'PRIVATE, because your warning settings should not propagate to consumers',
        ], 3, 'PRIVATE properties are used to build the target itself and are never pushed onto anything that links it.'),
        q('A function marked noexcept throws anyway. What happens?', [
          'The exception propagates as usual',
          'It is converted into an error code',
          'std::terminate is called — no unwinding, no catch',
          'The program refuses to compile',
        ], 2, 'noexcept is a promise the runtime enforces by terminating rather than unwinding.'),
      ]
    ),
    chapter(
      'Concurrency Without Data Races',
      'Threads, locks, atomics and futures — running work in parallel without corrupting the data underneath it.',
      [
        lesson('Threads, Joins, and What a Data Race Really Is', 13, `
A thread is a second stack running your code at the same time as the first. Everything you learned about lifetime in Chapters 2 and 3 still holds, with one new hazard: a destructor may now run while another thread is halfway through reading the object.

### Starting and joining

\`\`\`cpp
#include <thread>
#include <vector>

void process(int id, std::string label);   // takes its own copy

int main() {
    std::vector<std::thread> pool;
    for (int i = 0; i < 4; ++i)
        pool.emplace_back(process, i, "batch");   // arguments are COPIED into the thread

    for (auto& t : pool) t.join();                // wait for each one to finish
}
\`\`\`

Constructor arguments are copied into the thread's own storage. To pass a reference you must say so with \`std::ref(obj)\` — and you then own the problem of keeping \`obj\` alive longer than the thread.

Every \`std::thread\` must be joined or detached before it is destroyed. A \`std::thread\` destructor that is still joinable calls \`std::terminate\` — not a leak, not a warning, an immediate death. Which makes this broken:

\`\`\`cpp
void run() {
    std::thread t{work};
    mightThrow();      // if this throws, ~thread runs while joinable -> terminate
    t.join();
}
\`\`\`

That is exactly the shape RAII solved in Chapter 2, and C++20 fixed it in the library:

\`\`\`cpp
std::jthread t{work};   // joins in its destructor, on every exit path
\`\`\`

Prefer \`std::jthread\`. It also carries a stop token for cooperative cancellation:

\`\`\`cpp
std::jthread t{[](std::stop_token stop) {
    while (!stop.stop_requested()) pollOnce();
}};
// ~jthread requests the stop, then joins
\`\`\`

\`detach()\` looks like the convenient option and almost never is: the thread keeps running with no handle, and if it touches anything owned by a scope that has since exited, you are reading freed memory in a run nobody can reproduce.

### A data race is undefined behaviour, not a wrong number

Two threads access the same memory location, at least one of them writes, and nothing orders the two accesses. That is a **data race**, and the standard says the entire program is undefined.

\`\`\`cpp
int counter = 0;
void bump() { for (int i = 0; i < 100'000; ++i) ++counter; }   // BUG
\`\`\`

\`++counter\` is a load, an add and a store. Two threads interleave, updates vanish, and the total comes out under 200,000. The lost updates are the mild part. The optimiser is entitled to assume no other thread touches \`counter\`, so it may hoist the load out of the loop and write once at the end — a race can produce answers no interleaving could.

The same assumption destroys the "it's only a flag" pattern:

\`\`\`cpp
bool done = false;                          // BUG: plain bool, no synchronisation
void waiter() { while (!done) {} run(); }   // may compile to while (true) {}
\`\`\`

The compiler proves \`done\` is not modified inside the loop, caches it in a register, and the loop never exits — in release only, on one machine, three weeks after the code was written. Make it a \`std::atomic<bool>\` (next lesson) or protect it with a mutex. There is no third option, and \`volatile\` is not one: it orders nothing between threads and exists for memory-mapped hardware.

### Data that is immutable or unshared cannot race

The cheapest fix is to have nothing to synchronise. Reading a \`const\` object from many threads is safe. Giving each thread its own slice of a buffer and letting it write only into that slice is safe, because those are different memory locations:

\`\`\`cpp
std::vector<double> out(n);
auto half = n / 2;
std::jthread a{[&]{ fill(out.data(),        half); }};
std::jthread b{[&]{ fill(out.data() + half, n - half); }};
\`\`\`

\`std::vector<bool>\` is the exception worth remembering — it packs elements into bits, so two threads writing "different" elements can collide inside one byte.

### Turn the detector on

\`\`\`bash
g++ -std=c++20 -g -fsanitize=thread main.cpp -o app && ./app
\`\`\`

ThreadSanitizer prints both stacks that raced, even on a run that happened to produce the right answer. Races are timing-dependent and will not reproduce on demand, so testing cannot find them; TSan can. It cannot be combined with AddressSanitizer, so keep two build directories.
        `,
        [
          q('std::thread t{work, buffer}; — how is buffer passed to work?',
            [
              'By reference, as the signature of work dictates',
              'It is copied into the thread storage; pass std::ref(buffer) if you truly want a reference',
              'By pointer, always',
              'It is moved out of the caller unconditionally',
            ], 1, 'Thread arguments are copied by default, and once you use std::ref you own the problem of outliving the thread.'),
          q('Why is detach() rarely the right call?',
            [
              'Detached threads run at a lower priority',
              'A detached thread cannot allocate memory',
              'detach() is deprecated in C++20',
              'You keep no handle, so a thread that outlives the scope owning its data reads freed memory in a run nobody can reproduce',
            ], 3, 'Without a join there is nothing that ties the thread lifetime to the data it touches.'),
          q('Two threads write to different elements of the same std::vector<bool>. Is that safe?',
            [
              'Yes, distinct elements are always distinct memory locations',
              'Yes, because vector<bool> is internally synchronised',
              'No — vector<bool> packs elements into bits, so two writes can collide inside one byte',
              'No, because any shared container access is a data race',
            ], 2, 'For every other container distinct elements are distinct memory locations; the bit-packed specialisation is the exception to remember.'),
        ]
      ),
        lesson('Mutexes, Deadlock, and Condition Variables', 14, `
A **mutex** grants one thread at a time access to the data it guards. Keep it next to that data, make it private, and never lock it by hand.

\`\`\`cpp
#include <mutex>

class Counter {
public:
    void bump() {
        std::scoped_lock lock{m_};    // locks
        ++n_;
    }                                 // unlocks, even if the body throws
    int value() const {
        std::scoped_lock lock{m_};
        return n_;
    }
private:
    mutable std::mutex m_;            // mutable so const members can lock it
    int n_{0};
};
\`\`\`

\`mutable\` on the mutex is not a loophole: locking does not change the observable value of the object, so a \`const\` accessor is still telling the truth.

| Type | Use it for |
|---|---|
| \`std::scoped_lock\` | the default — one or more mutexes, for a scope |
| \`std::unique_lock\` | when you must unlock early, or hand the lock to a condition variable |
| \`std::shared_lock\` + \`std::shared_mutex\` | many readers, rare writer |
| \`std::lock_guard\` | the C++11 ancestor of \`scoped_lock\`; no reason to write it today |

### Locks guard invariants, not single calls

\`\`\`cpp
if (!queue.empty()) {          // lock taken and released inside empty()
    auto item = queue.pop();   // another thread may have emptied it by now
}
\`\`\`

Two individually thread-safe calls do not compose into a thread-safe sequence. If a decision spans two operations, one lock must cover both — which is why a well-designed concurrent queue exposes \`try_pop(T&)\` instead of \`empty()\` plus \`pop()\`.

### Deadlock is an ordering bug

\`\`\`cpp
void transfer(Account& from, Account& to, double amount) {
    std::scoped_lock l1{from.m};
    std::scoped_lock l2{to.m};      // transfer(a,b) and transfer(b,a) at once: DEADLOCK
    from.debit(amount);
    to.credit(amount);
}
\`\`\`

Thread 1 holds \`a\` and waits for \`b\`; thread 2 holds \`b\` and waits for \`a\`. Nothing times out. The process simply stops, with no crash, no exception and no log line — which is why deadlocks are diagnosed by attaching a debugger to a live process rather than by reading a stack trace.

Two fixes, and the first is one line:

\`\`\`cpp
std::scoped_lock lock{from.m, to.m};   // all-or-nothing, deadlock-avoiding
\`\`\`

Given more than one mutex, \`std::scoped_lock\` acquires them with an algorithm that cannot deadlock against another \`scoped_lock\` over the same set. For locks taken in separate functions, the rule is **pick one global lock order and take them in that order everywhere** — ascending by account id, by address, by layer of the system, anything consistent.

And never call unknown code while holding a lock: a user callback, a virtual function, anything doing I/O. It may take a second lock and close the cycle behind your back.

### Condition variables: waiting without spinning

\`\`\`cpp
#include <condition_variable>
#include <queue>

std::mutex m;
std::condition_variable cv;
std::queue<Job> jobs;
bool stopping = false;

void submit(Job j) {
    {
        std::scoped_lock lock{m};
        jobs.push(std::move(j));     // change the state UNDER the lock
    }
    cv.notify_one();                 // notify after releasing it
}

void worker() {
    for (;;) {
        std::unique_lock lock{m};
        cv.wait(lock, []{ return !jobs.empty() || stopping; });   // predicate form
        if (stopping && jobs.empty()) return;
        Job j = std::move(jobs.front());
        jobs.pop();
        lock.unlock();               // run the job outside the lock
        j();
    }
}
\`\`\`

Three details in there are the whole lesson.

**Always use the predicate overload.** A bare \`cv.wait(lock)\` may return on a **spurious wakeup** — the standard permits \`wait\` to return with nothing having happened — so it has to be wrapped in a recheck loop regardless. The predicate form *is* that loop, written correctly, and it also handles the case where the condition was already true before you waited.

**Change the state while holding the mutex, then notify.** Setting \`stopping = true\` outside the lock is a data race, and it opens the **lost wakeup**: the waiter evaluates the predicate, sees nothing to do, and is about to sleep when your \`notify_one\` fires into an empty room. The waiter then sleeps forever. It needs precise timing, so it shows up once a month in production and never in a test.

**\`notify_one\` versus \`notify_all\`.** One job needs one worker: \`notify_one\`. But shutdown must be \`notify_all\` — setting \`stopping = true\` and calling \`notify_one\` wakes a single worker and leaves the other three asleep on a queue that will never fill again.
        `,
        [
          q('Why is the mutex member declared mutable std::mutex m_;?',
            [
              'So the compiler does not optimise the lock away',
              'So const member functions can lock it — locking does not change the observable value of the object',
              'Because std::mutex cannot be a class member otherwise',
              'To allow the mutex to be copied with the object',
            ], 1, 'A const accessor still has to take the lock, and mutable is exactly the right tool because the logical state is unchanged.'),
          q('Every method of a queue takes its own lock. Is if (!q.empty()) { auto x = q.pop(); } safe?',
            [
              'Yes, both calls are individually thread safe',
              'Yes, as long as only one thread ever pops',
              'No — the lock is released between the two calls, so another thread can empty the queue in between; one lock must cover the decision and the action',
              'No, because empty() is not thread safe on any container',
            ], 2, 'Thread-safe operations do not compose, which is why a concurrent queue exposes try_pop rather than empty plus pop.'),
          q('Shutdown sets stopping = true under the lock and calls cv.notify_one() with four workers waiting. What happens?',
            [
              'One worker wakes and exits; the other three stay asleep forever — shutdown needs notify_all',
              'All four wake, because the predicate is now true for everyone',
              'The waiters time out after the default interval',
              'notify_one wakes the longest-waiting worker and the rest exit on their own',
            ], 0, 'notify_one releases exactly one waiter, and nothing will ever fill the queue again to wake the others.'),
        ]
      ),
        lesson('Atomics, Futures, and Choosing the Right Tool', 13, `
\`std::atomic<T>\` makes one variable safe to touch from several threads without a mutex. A read-modify-write on it happens as a single indivisible step.

\`\`\`cpp
#include <atomic>

std::atomic<int> hits{0};

void onRequest() {
    hits.fetch_add(1, std::memory_order_relaxed);   // one instruction, no lock
}
int total() { return hits.load(); }                 // seq_cst by default
\`\`\`

Plain \`++hits\` works too and uses \`memory_order_seq_cst\`, the strongest ordering and the correct default. Reach for \`relaxed\` only when the value orders nothing else — a statistics counter like the one above. The moment a variable is used as a signal that *other* data is ready, it must keep the default ordering, or the compiler and the CPU are both free to move that other data across it.

\`std::atomic<T>\` for a large \`T\` compiles happily and quietly uses an internal lock. Check with \`std::atomic<T>::is_always_lock_free\`; anything wider than a machine word is usually a mutex in a costume.

### The flag from the last lesson, done properly

\`\`\`cpp
std::atomic<bool> done{false};

void waiter() {
    while (!done.load()) std::this_thread::yield();   // cannot be optimised away
    run();
}
void finish() { done = true; }
\`\`\`

If the wait may be long, C++20's \`done.wait(false)\` with \`done.notify_one()\` sleeps instead of burning a core.

### Futures carry results — and exceptions — across a thread boundary

\`\`\`cpp
#include <future>

std::future<int> f = std::async(std::launch::async, []{ return heavy(); });
doSomethingElse();
int result = f.get();     // blocks until ready; RETHROWS anything heavy() threw
\`\`\`

That rethrow is the main reason to prefer futures over raw threads for one-shot work. An exception that escapes a \`std::thread\` body calls \`std::terminate\`; \`std::async\` stores it and rethrows it inside \`get()\`, where you have a \`catch\` block and a stack that makes sense.

One trap, and it is famous:

\`\`\`cpp
std::async(std::launch::async, work);   // temporary future - its destructor BLOCKS
\`\`\`

The future returned by \`std::async\` waits for the task in its destructor, so discarding it turns a parallel call into a plain sequential function call. It reads as fire-and-forget and behaves as the opposite. Always name the future, and always pass \`std::launch::async\` — without a policy the implementation may pick \`deferred\`, which does not start the work until \`get()\`, so a loop that launches ten tasks and then collects them runs them one after another.

### What to reach for

| Problem | Tool |
|---|---|
| A counter or flag shared by threads | \`std::atomic\` |
| A data structure several threads mutate | \`std::mutex\` + \`std::scoped_lock\` |
| Waiting for a state change | \`std::condition_variable\` with a predicate |
| One result computed elsewhere | \`std::async\` + \`std::future\` |
| Many readers, rare writer | \`std::shared_mutex\` |
| Independent work over a range | \`std::sort(std::execution::par, v.begin(), v.end())\` |

Parallel algorithms are the cheapest parallelism the language offers: the same calls from Chapter 4 with an execution policy added, and no synchronisation for you to get wrong.

### shared_ptr is only half thread-safe

The control block from Chapter 3 is atomic, so copying and destroying \`shared_ptr\`s from many threads is safe and the object is destroyed exactly once. **The pointee is not protected at all** — and neither is a particular \`shared_ptr\` object: one thread reassigning \`p\` while another copies \`p\` is a data race on \`p\` itself. Give each thread its own copy of the handle, and guard what it points at like any other shared state.

### The rule that outranks everything above

Prefer designs with nothing shared. Hand each thread its own data, return results through a future or a queue, and join. Every lock you do not take is a deadlock you cannot have, and message passing is far easier to reason about — and to test — than a graph of mutexes.
        `,
        [
          q('When is std::memory_order_relaxed appropriate?',
            [
              'Whenever a single variable is involved, since atomics are always safe',
              'For a flag that tells another thread a buffer is ready',
              'Never; it is undefined behaviour outside the standard',
              'For a counter whose value orders nothing else, such as a statistics hit count',
            ], 3, 'Relaxed gives atomicity without ordering, so it is wrong the moment the variable signals that other data is now visible.'),
          q('An exception escapes the callable passed to std::thread, and another escapes one passed to std::async. What happens in each case?',
            [
              'Both are stored and rethrown when the thread is joined',
              'The thread calls std::terminate; the async task stores the exception and rethrows it inside get()',
              'Both terminate the process',
              'Both are silently swallowed and the thread just ends',
            ], 1, 'That rethrow at get() is the main reason to prefer a future over a raw thread for one-shot work.'),
          q('std::atomic<Matrix4x4> compiles. What should you check before relying on it?',
            [
              'That the type has a default constructor',
              'That the compiler supports C++20 atomics',
              'is_always_lock_free — anything wider than a machine word usually hides an internal lock',
              'That every member of the type is itself atomic',
            ], 2, 'Large atomics are a mutex in a costume, so the lock-free assumption you were making is quietly false.'),
        ]
      ),
        lesson('Latches, Barriers, Semaphores, and One-Time Init', 13, `
A mutex protects data. The primitives in this lesson do something different: they make a thread **wait for an event**, without you assembling a condition variable, a predicate and a bool of your own every time.

### latch: wait for N things to happen, once

\`\`\`cpp
#include <latch>

std::latch ready{4};
std::vector<std::jthread> loaders;

for (int i = 0; i < 4; ++i)
    loaders.emplace_back([&, i] {
        loadShard(i);
        ready.count_down();     // "my part is done"
        serveShard(i);          // and this thread keeps working
    });

ready.wait();                   // blocks until all four have counted down
acceptRequests();
\`\`\`

That replaces a mutex, a counter, a condition variable and a predicate — four things and one chance to get the predicate wrong — with a single object. It is also not the same as joining: the workers carry on after counting down, which is exactly the case \`join()\` cannot express. A thread that must both signal and wait calls \`arrive_and_wait()\`.

The limitation is in the name. A latch is **single use**: the counter only goes down and there is no reset. Putting one at the top of a loop is the standard mistake, and it is what barriers exist for.

### barrier: reusable phases, with a completion step

\`\`\`cpp
#include <barrier>

std::barrier sync{4, []() noexcept { swapBuffers(); }};   // completion function

auto worker = [&](std::stop_token stop) {
    while (!stop.stop_requested()) {
        computeTile();
        sync.arrive_and_wait();    // nobody proceeds until all four arrive
    }
};
\`\`\`

The completion function runs on exactly one thread, after the last arrival and before any thread is released, and then the barrier resets for the next phase. That is where you flip buffers, advance a frame counter or test a convergence criterion — with no lock at all, because nothing else is running at that instant. It has to be \`noexcept\`: an exception escaping it calls \`std::terminate\`.

### semaphore: a count of permits, with no owner

\`\`\`cpp
#include <semaphore>

std::counting_semaphore<8> slots{8};      // at most 8 uploads at a time

class Permit {                            // RAII, exactly as in Chapter 2
public:
    explicit Permit(std::counting_semaphore<8>& s) : s_{s} { s_.acquire(); }
    ~Permit() { s_.release(); }
private:
    std::counting_semaphore<8>& s_;
};

void upload(const Blob& b) {
    Permit p{slots};
    send(b);                // even if this throws, the permit comes back
}
\`\`\`

The difference from a mutex is that a semaphore has **no owning thread**: one thread may \`acquire\` and a completely different one \`release\`. That is what makes it a signalling tool — and what makes a lost permit possible, because an early return or an exception between acquire and release shrinks the pool permanently. Wrap it, the way you wrap every other resource.

\`std::binary_semaphore\` is a \`counting_semaphore<1>\` and the simplest hand-off there is:

\`\`\`cpp
std::binary_semaphore ready{0};
std::jthread producer{[&]{ prepare(); ready.release(); }};
ready.acquire();     // waits for the signal: no mutex, no predicate
\`\`\`

### Initialising exactly once

\`\`\`cpp
Registry& registry() {
    static Registry r;      // constructed once, thread-safely, on first call
    return r;
}
\`\`\`

Since C++11 the compiler emits a guard around a function-local static, so the double-checked locking that people still hand-write is both unnecessary and famously easy to get wrong. If the constructor throws, the static is not marked initialised and the next caller tries again.

When what you are initialising is not a variable — registering a handler, opening a log — use \`std::call_once\`:

\`\`\`cpp
std::once_flag flag;
void ensureLogging() { std::call_once(flag, []{ openLog("app.log"); }); }
\`\`\`

Ten threads calling that produce exactly one \`openLog\`, and the other nine **wait** for it rather than racing past a half-built object, which is precisely what a plain \`if (!inited)\` check fails to do.

### thread_local when nothing needs sharing

\`\`\`cpp
thread_local std::mt19937 rng{std::random_device{}()};
\`\`\`

One generator per thread: no lock, no contention, no shared state to get wrong. Do not hand a pointer to a \`thread_local\` object to another thread — it is destroyed when its own thread exits.

### Picking one

| You need | Use |
|---|---|
| To wait for N one-off events | \`std::latch\` |
| Repeated phases across a fixed set of threads | \`std::barrier\` |
| To cap concurrency at N | \`std::counting_semaphore\` |
| To hand off a single signal | \`std::binary_semaphore\` |
| To wait for an arbitrary condition | \`std::condition_variable\` with a predicate |
| To initialise something exactly once | a function-local static, or \`std::call_once\` |
        `,
        [
          q('A worker loop calls the same std::latch once per iteration. What goes wrong?',
            [
              'The latch deadlocks on the first iteration because count_down was never called',
              'Nothing, provided every thread arrives each round',
              'A latch is single use — its counter only decreases and cannot be reset, so every later round passes straight through; use std::barrier',
              'The latch resets automatically but loses the completion function',
            ], 2, 'Barriers are the reusable primitive; a latch counts down to zero once and stays there.'),
          q('What distinguishes a counting semaphore from a mutex?',
            [
              'A semaphore has no owning thread, so one thread may acquire a permit and another release it',
              'A semaphore cannot be used to protect shared data at all',
              'A semaphore releases automatically at the end of the enclosing scope',
              'A semaphore is always lock-free while a mutex never is',
            ], 0, 'That ownerless hand-off is what makes it a signalling tool, and also why a permit can be lost if acquire and release are not wrapped in RAII.'),
          q('Two threads call registry() for the first time simultaneously, where it returns a function-local static Registry. What happens?',
            [
              'Both construct their own Registry and one is leaked',
              'The behaviour is undefined unless you add double-checked locking',
              'The second thread sees a half-constructed object',
              'The compiler-emitted guard constructs it once and makes the second thread wait',
            ], 3, 'Function-local statics have been thread-safe since C++11, which makes hand-written double-checked locking both redundant and risky.'),
        ]
      ),
      ],
      [
        q('A std::thread object is destroyed while it is still joinable. What happens?', [
          'It is silently detached and keeps running',
          'The thread is cancelled and the destructor returns',
          'std::terminate is called immediately',
          'The stack leaks but the program continues',
        ], 2, 'The thread destructor terminates rather than guess between joining and detaching, which is why std::jthread exists.'),
        q('Why can while (!done) {} on a plain bool loop forever even though it only reads?', [
          'It is fine as long as only one thread writes done',
          'bool is too narrow to be written atomically on most CPUs',
          'The loop needs a yield to let the writer be scheduled',
          'It is a data race, so the compiler may hoist the load out of the loop',
        ], 3, 'Unsynchronised access is undefined behaviour, and the optimiser is allowed to assume no other thread writes the variable.'),
        q('Why must cv.wait be given a predicate?', [
          'The predicate is what wakes the other waiting threads',
          'wait may return spuriously, so the condition has to be rechecked in a loop',
          'Without it the mutex is never released while waiting',
          'It chooses between notify_one and notify_all',
        ], 1, 'The predicate overload is the recheck loop, and it also covers the case where the condition was already true before waiting.'),
        q('What does std::async(std::launch::async, work); with the result discarded actually do?', [
          'The temporary future blocks in its destructor, so the call runs to completion before the next statement',
          'It is fire-and-forget: work runs in the background',
          'Nothing runs, because nobody calls get()',
          'It fails to compile unless the future is stored',
        ], 0, 'The future returned by std::async waits for its task in its destructor, so an unnamed one makes the call sequential.'),
      ]
    ),
    chapter(
      'Debugging, Testing, and Performance',
      'Finding the bug the compiler could not, proving the fix with tests, and making it fast on evidence rather than folklore.',
      [
        lesson('Reading Crashes: Debuggers, Sanitizers, and UB', 14, `
A C++ crash rarely happens where the bug is. The whole job is shortening the distance between the two, and there is an order of operations that does it.

### Reproduce first, deterministically

A bug you can trigger on demand is nearly solved; one you cannot is a research project. Fix the random seed, pin the thread count to one, save the exact input that failed. Then shrink it: delete half the input, half the config, half the code path, and repeat until nothing more can be removed. Most bugs confess during shrinking.

If it worked last release, let git find the commit:

\`\`\`bash
git bisect start HEAD v1.4.0
git bisect run ./scripts/repro.sh    # exit 0 = good, non-zero = bad
\`\`\`

That tests about twelve commits to search four thousand.

### Build so the crash is legible

\`\`\`bash
cmake -S . -B build-dbg -DCMAKE_BUILD_TYPE=RelWithDebInfo
\`\`\`

\`RelWithDebInfo\` (Chapter 5) keeps the optimisations and adds symbols, so the stack trace describes the binary you actually ship. A \`Debug\` build steps more cleanly, but the bug may not survive the change in timing and stack layout — and that is itself a finding: **a bug that disappears in Debug is almost always undefined behaviour or a race**, not a mystery.

### The debugger, in six commands

\`\`\`text
gdb --args ./build-dbg/app config.toml
(gdb) run
(gdb) bt                 # where it died and how it got there
(gdb) frame 3            # step up into your own code
(gdb) print item         # inspect: print *ptr, print vec.size()
(gdb) watch counter      # break the instant this value changes
\`\`\`

\`watch\` is the underused one. When a value is wrong and you have no idea who wrote it, watch it and let the hardware tell you. lldb takes the same six ideas: \`bt\`, \`frame select 3\`, \`p\`, \`watchpoint set variable\`.

For a crash in the field, keep the corpse:

\`\`\`bash
ulimit -c unlimited      # then, after it dies:
gdb ./app core.12345
\`\`\`

### Sanitizers find what a debugger cannot

| Flag | Catches | Rough cost |
|---|---|---|
| \`-fsanitize=address\` | use-after-free, buffer overflow, double free, leaks | 2x |
| \`-fsanitize=undefined\` | signed overflow, bad shifts, null deref, misalignment | 1.2x |
| \`-fsanitize=thread\` | data races (Chapter 6) | 5-10x |
| \`-fsanitize=memory\` | reads of uninitialised memory (clang only) | 3x |

ASan and UBSan combine in one build; TSan and MSan each need their own. An ASan report gives you both stacks — where the memory was allocated and where it was freed — which is precisely the link a bare crash is missing:

\`\`\`text
==1==ERROR: AddressSanitizer: heap-use-after-free on address 0x60200000eff4
READ of size 4 at 0x60200000eff4 thread T0
    #0 Cache::get(int) cache.cpp:41
freed by thread T0 here:
    #0 Cache::evict()  cache.cpp:88
\`\`\`

Add \`-g -fno-omit-frame-pointer\` for readable traces, and run the suite under sanitizers in CI rather than only on the machine of whoever remembers.

### Release-only bugs are undefined behaviour

The optimiser assumes your program contains no UB, and it acts on that assumption:

\`\`\`cpp
int scale(int n) { return n * 2 / 2; }   // "returns n" - but signed overflow is UB,
                                         // so the compiler deletes the arithmetic

int len = p->size();
if (p != nullptr) use(p);                // p was already dereferenced, so the
                                         // compiler may delete this check as dead
\`\`\`

Both are harmless at \`-O0\` and change behaviour at \`-O2\`. UBSan catches the first at the moment it happens; \`-Wall -Wextra\` catches many of the second kind at compile time. Promote warnings to errors in CI with \`-Werror\` — the warning was always cheaper than the weekend.

### Assertions are debugging written in advance

\`\`\`cpp
#include <cassert>

Item& at(std::size_t i) {
    assert(i < size_ && "index out of range");   // the string prints with the failure
    return data_[i];
}
\`\`\`

\`assert\` compiles to nothing once \`NDEBUG\` is defined, which \`Release\` does for you. So assert loudly about invariants — and never put an expression with a side effect inside one, because it vanishes in exactly the build that matters.
        `,
        [
          q('git bisect run ./scripts/repro.sh over four thousand commits does what?',
            [
              'Runs the script on every commit and reports all failures',
              'Rewrites history to remove the bad commit',
              'Reverts the last known good commit automatically',
              'Binary-searches the range, testing about twelve commits, using the exit code to classify each one',
            ], 3, 'Zero means good and non-zero means bad, so each run halves the remaining range.'),
          q('You know a counter ends up wrong but not who writes it. Which debugger feature helps most?',
            [
              'watch on the variable, which stops execution the instant the value changes',
              'bt, to print the current call stack',
              'print, to inspect it after the fact',
              'Setting a breakpoint on every function that mentions the variable',
            ], 0, 'A watchpoint lets the hardware find the writer for you instead of guessing at breakpoints.'),
          q('Why must an assert never contain an expression with a side effect?',
            [
              'Asserts are evaluated twice for consistency',
              'assert compiles to nothing once NDEBUG is defined, so the side effect vanishes in the Release build',
              'The optimiser reorders asserts relative to surrounding code',
              'Side effects make the failure message unreadable',
            ], 1, 'The behaviour would then differ between Debug and the build you actually ship, which is the worst possible split.'),
        ]
      ),
        lesson('Testing C++ with GoogleTest and CTest', 13, `
Tests are how you learn whether last lesson's fix actually fixed anything, and whether it stays fixed. Wiring a framework in is a ten-line change to the CMake from Chapter 5.

\`\`\`cmake
include(FetchContent)
FetchContent_Declare(googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG v1.14.0                        # pinned to a tag, never a branch
)
FetchContent_MakeAvailable(googletest)

enable_testing()
add_executable(core_tests tests/warehouse_test.cpp)
target_link_libraries(core_tests PRIVATE core GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(core_tests)         # registers each TEST as its own ctest case
\`\`\`

\`\`\`bash
ctest --test-dir build --output-on-failure
\`\`\`

### The tests themselves

\`\`\`cpp
#include <gtest/gtest.h>
#include "warehouse.hpp"

TEST(Warehouse, RejectsNegativeQuantity) {
    Warehouse w;
    EXPECT_THROW(w.add("bolt", -1), std::invalid_argument);
}

TEST(Warehouse, AddAccumulates) {
    Warehouse w;
    w.add("bolt", 3);
    w.add("bolt", 4);
    EXPECT_EQ(w.count("bolt"), 7);
    EXPECT_TRUE(w.contains("bolt"));
    EXPECT_NEAR(w.weightKg(), 0.42, 1e-9);   // never EXPECT_EQ on floating point
}
\`\`\`

\`EXPECT_*\` records a failure and keeps going; \`ASSERT_*\` returns from the test immediately. Use \`ASSERT\` for the precondition whose failure would make the rest of the test crash — a null pointer, an empty container — and \`EXPECT\` for everything else, so one run tells you all five things that broke instead of the first.

\`EXPECT_EQ(0.1 + 0.2, 0.3)\` fails, correctly and unhelpfully. Compare doubles with \`EXPECT_NEAR\` and a tolerance you chose deliberately, or \`EXPECT_DOUBLE_EQ\` for "within four ULPs".

### Fixtures for shared setup

\`\`\`cpp
class WarehouseTest : public ::testing::Test {
protected:
    void SetUp() override { w.add("bolt", 10); }
    Warehouse w;                 // constructed fresh for EVERY test
};

TEST_F(WarehouseTest, RemoveReducesCount) {
    w.remove("bolt", 4);
    EXPECT_EQ(w.count("bolt"), 6);
}
\`\`\`

Each \`TEST_F\` builds its own fixture, so tests cannot leak state into one another. Anything that outlives a test — a static cache, a global logger, a file left on disk — eventually makes the suite order-dependent, and a suite that passes in only one order is not evidence of anything.

### Design so there is something to test

\`\`\`cpp
class Clock {                        // an interface, not a concrete dependency
public:
    virtual ~Clock() = default;      // Chapter 2: polymorphic base needs this
    virtual std::chrono::sys_seconds now() const = 0;
};

class Session {
public:
    explicit Session(std::shared_ptr<Clock> clock) : clock_{std::move(clock)} {}
    bool expired() const { return clock_->now() > deadline_; }
private:
    std::shared_ptr<Clock> clock_;
    std::chrono::sys_seconds deadline_;
};
\`\`\`

\`Session\` now tests in microseconds against a \`FakeClock\` instead of sleeping for twenty minutes. The general rule: a class that constructs its own dependencies — opens its own socket, reads its own config file, calls \`system_clock::now()\` inline — can only be tested with a real socket, a real file and a real wait. Inject them, using the ownership vocabulary from Chapter 3 to say who owns what, and the seam appears on its own. Everything else worth testing is usually a pure function once you separate it from the I/O.

### What to test, in order

- **The bug you just fixed.** Write the failing test first and watch it fail; a test you never saw fail is not known to catch anything.
- **Boundaries**: empty, one element, exactly capacity, one past capacity, the maximum value of the type.
- **Error paths**: an \`EXPECT_THROW\` for every documented throw.
- **Invariants after a sequence** of operations, not just after one.

### Run the suite the hard way in CI

\`\`\`bash
cmake -S . -B build-asan -DCMAKE_BUILD_TYPE=RelWithDebInfo -DENABLE_ASAN=ON
cmake --build build-asan -j && ctest --test-dir build-asan --output-on-failure
\`\`\`

A suite run under AddressSanitizer and UBSan is worth several times the same suite without them. Tests deliberately exercise the error and cleanup paths that your manual clicking never reaches, and those paths are exactly where the leaks and use-after-frees live.
        `,
        [
          q('Why is EXPECT_EQ(w.weightKg(), 0.42) a poor assertion?',
            [
              'EXPECT_EQ does not work on function return values',
              'Floating-point results rarely compare bit-equal, so use EXPECT_NEAR with a chosen tolerance or EXPECT_DOUBLE_EQ',
              'It should be ASSERT_EQ so the test stops on failure',
              'GoogleTest cannot print doubles in failure messages',
            ], 1, 'Rounding makes exact comparison fail correctly but unhelpfully, exactly as 0.1 + 0.2 == 0.3 does.'),
          q('What does the fixture in class WarehouseTest : public ::testing::Test guarantee?',
            [
              'Each TEST_F shares one fixture instance, so setup runs once',
              'SetUp runs only for the first test in the file',
              'A fresh fixture is constructed for every TEST_F, so tests cannot leak state into one another',
              'Tests in the fixture run in the order they are declared',
            ], 2, 'Per-test construction is what keeps the suite from becoming order-dependent.'),
          q('Session calls std::chrono::system_clock::now() directly inside expired(). Why is that a testing problem?',
            [
              'system_clock is not available in test binaries',
              'Only one clock may be used per process',
              'GoogleTest cannot link against <chrono>',
              'The only way to test expiry is to wait in real time; injecting a Clock interface lets a FakeClock answer instantly',
            ], 3, 'A class that constructs its own dependencies can only be tested with the real ones, so inject them and the seam appears.'),
        ]
      ),
        lesson('Performance: Measure, Then Fix', 14, `
Every performance claim in this course so far — \`reserve\`, \`const auto&\`, \`noexcept\` moves, contiguous containers — came with a cost you can name. Hold that standard: measure, find the one thing that dominates, fix it, measure again.

### Measure the right binary

\`\`\`bash
cmake -S . -B build-rel -DCMAKE_BUILD_TYPE=RelWithDebInfo   # -O2 plus symbols
perf record -g ./build-rel/app corpus.txt
perf report                        # hot functions, with call graphs
\`\`\`

Timing a \`Debug\` build tells you nothing — the difference is routinely tenfold (Chapter 5). \`RelWithDebInfo\` gives shipping-speed code the profiler can still attribute to source lines.

For a number inside the program:

\`\`\`cpp
#include <chrono>

auto t0 = std::chrono::steady_clock::now();      // steady_clock, never system_clock
work();
auto ms = std::chrono::duration<double, std::milli>(
              std::chrono::steady_clock::now() - t0).count();
\`\`\`

\`system_clock\` can step backwards when NTP corrects it, which is how negative durations end up in a log at 3 a.m.

### The numbers that decide your design

| Operation | Rough cost |
|---|---|
| L1 cache hit | 1 ns |
| Main memory read (cache miss) | 100 ns |
| Heap allocation | 50–100 ns |
| Uncontended mutex lock | 20 ns |
| Syscall | 1 µs |
| SSD read | 100 µs |

A cache miss costs roughly what a hundred arithmetic instructions cost. That one ratio explains why \`std::vector\` beats \`std::list\` at almost everything (Chapter 4), and it is why the three wins below are always in this order.

### 1. Complexity

A linear \`std::find\` over a vector, inside another loop over that vector, is O(n²). Swapping the inner search for an \`unordered_map\` lookup turns a 30-second run into 40 milliseconds. No amount of micro-optimisation reaches that, and no profiler is needed to see it once you look at the loop nesting.

### 2. Allocations

\`\`\`cpp
std::vector<std::string> out;
out.reserve(rows.size());               // one allocation, not a dozen reallocations

for (const auto& row : rows) {
    out.push_back(row.substr(0, 8));        // allocates a string per row
    std::string_view head{row.data(), 8};   // the same eight bytes, allocating nothing
    consume(head);
}
\`\`\`

\`std::string_view\` and \`std::span\` are non-owning views over bytes somebody else owns — ideal for parsing, and dangling the instant that owner dies, which is Chapter 1's rule wearing new clothes.

### 3. Layout

\`\`\`cpp
struct Particle { float x, y, z, vx, vy, vz; char name[64]; };  // 88 bytes each
std::vector<Particle> ps;
for (auto& p : ps) p.x += p.vx;         // 64-byte cache line, <1 useful particle

struct Particles { std::vector<float> x, vx; };   // structure of arrays
Particles soa;
for (std::size_t i = 0; i < n; ++i) soa.x[i] += soa.vx[i];  // 16 floats per line
\`\`\`

Identical arithmetic, an order of magnitude fewer cache misses, and the second loop vectorises. Store together the fields you iterate together.

### Benchmarks that are not lies

\`\`\`cpp
static void BM_Parse(benchmark::State& state) {
    const std::string input = makeInput(1024);
    for (auto _ : state) {
        auto result = parse(input);
        benchmark::DoNotOptimize(result);   // without this, the call is deleted
    }
}
BENCHMARK(BM_Parse);
\`\`\`

With no sink, the optimiser observes that nothing uses \`result\`, removes the call entirely, and reports 0.3 nanoseconds — a number people have shipped architecture decisions on. Run enough iterations to see the variance, and never compare timings from two different machines or two different power states.

### False sharing

\`\`\`cpp
struct Counters { std::atomic<int> a; std::atomic<int> b; };   // one cache line
\`\`\`

Two threads incrementing \`a\` and \`b\` never touch the same variable, yet they fight over the same 64-byte line and can run slower than a single thread doing both. Pad them apart:

\`\`\`cpp
struct alignas(64) Padded { std::atomic<int> v; };
\`\`\`

### The discipline

Guessing is the failure mode, not slow code. Profile before optimising, keep the tests from the last lesson green while you work, and stop when the profile goes flat — the readable version is worth more than the final 3%.
        `,
        [
          q('Why time work with std::chrono::steady_clock rather than system_clock?',
            [
              'steady_clock has nanosecond resolution and system_clock does not',
              'system_clock can jump backwards when NTP corrects it, producing negative durations',
              'system_clock cannot be subtracted',
              'steady_clock is measured per thread rather than per process',
            ], 1, 'A monotonic clock is the only sound basis for measuring an interval.'),
          q('A profile shows a std::find over a 50,000-element vector running inside a loop over the same vector. What do you fix first?',
            [
              'The quadratic complexity — replace the inner search with an unordered_map lookup',
              'The allocations inside the loop body',
              'The memory layout, by splitting the struct into arrays',
              'The compiler flags, by raising -O2 to -O3',
            ], 0, 'Complexity dominates everything below it; no amount of micro-optimisation rescues an O(n squared) loop.'),
          q('Two threads increment separate std::atomic<int> members of the same struct and the code runs slower than one thread doing both. Why?',
            [
              'Atomic increments serialise across all atomics in the program',
              'The compiler merged the two counters into one',
              'Both counters share a 64-byte cache line, so the cores fight over it — false sharing; pad them apart with alignas(64)',
              'The scheduler migrates the threads between cores on every increment',
            ], 2, 'The variables are distinct but the cache line is not, so every increment invalidates the other core copy.'),
        ]
      ),
        lesson('Fuzzing and Property-Based Tests', 13, `
Example-based tests check the inputs you thought of. Every crash a user reports is, by definition, one you did not. Fuzzing generates inputs faster than you can imagine them, and property tests assert something true of *every* input instead of one answer for one case.

### A fuzz target is one function

\`\`\`cpp
// fuzz/parse_fuzz.cpp
#include <cstdint>
#include <cstddef>
#include <string_view>
#include "config.hpp"

extern "C" int LLVMFuzzerTestOneInput(const std::uint8_t* data, std::size_t size) {
    std::string_view input{reinterpret_cast<const char*>(data), size};
    try {
        Config cfg   = parseConfig(input);
        Config again = parseConfig(serialise(cfg));
        if (!(cfg == again)) std::abort();     // round trip: the property under test
    } catch (const ParseError&) {
        // rejecting malformed input is correct behaviour, not a finding
    }
    return 0;
}
\`\`\`

\`\`\`bash
clang++ -std=c++20 -g -O1 -fsanitize=fuzzer,address,undefined \\
        fuzz/parse_fuzz.cpp src/config.cpp -o fuzz_parse
./fuzz_parse corpus/ -max_total_time=60
\`\`\`

libFuzzer mutates the inputs in \`corpus/\`, keeps whatever reaches new code paths, and writes the first input that fails to a file:

\`\`\`text
==2==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60300000f7d4
READ of size 1 at 0x60300000f7d4 thread T0
    #0 parseConfig(std::string_view) config.cpp:74
Test unit written to ./crash-2f8a9c1e...
\`\`\`

Replay it with \`./fuzz_parse crash-2f8a9c1e...\`, deterministically, as often as you like. Then paste those bytes into a GoogleTest case, so the bug cannot come back quietly once you fix it.

### The rules a fuzz target must obey

- **Build it with sanitizers.** Without ASan a read one byte past a buffer returns a stray byte and the parser carries on, so the fuzzer sees nothing to report. ASan is what turns silent corruption into a crash the fuzzer can find.
- **Do not rely on \`assert\`.** An optimised build defines \`NDEBUG\` and compiles it out, exactly as in the debugging lesson. Use \`std::abort()\`, or build the fuzz target without \`NDEBUG\`.
- **Be deterministic and fast.** No clock, no network, no files, no global state carried between calls. Identical bytes must produce an identical run or the crash will not reproduce.
- **Reject, do not crash.** Malformed input is the normal case. Only invariant violations, sanitizer reports and hangs are findings.
- **Seed the corpus.** A dozen real config files carry the fuzzer past the syntax checks in seconds rather than hours; commit them alongside the target.

### Properties are the other half

You do not need a fuzzer to test a property. A loop with a fixed seed does most of the work:

\`\`\`cpp
TEST(Sort, OrderedAndAPermutation) {
    std::mt19937 rng{12345};                  // fixed seed: failures reproduce
    for (int trial = 0; trial < 1000; ++trial) {
        auto v = randomVector(rng);
        auto original = v;
        mySort(v);
        ASSERT_TRUE(std::is_sorted(v.begin(), v.end())) << "trial " << trial;
        ASSERT_TRUE(std::is_permutation(v.begin(), v.end(),
                                        original.begin(), original.end()));
    }
}
\`\`\`

Two assertions, two different bugs. A sort that silently drops duplicates passes the first; a sort that does nothing at all passes the second. Neither is caught by the three hand-written examples above it in the file.

| Property | Shape | Catches |
|---|---|---|
| Round trip | \`decode(encode(x)) == x\` | dropped fields, encoding bugs |
| Oracle | \`fast(x) == obvious(x)\` | the optimised rewrite from the last lesson |
| Invariant | output sorted, size preserved, total unchanged | logic that quietly loses data |
| Idempotence | \`normalise(normalise(x)) == normalise(x)\` | transforms applied twice |

The oracle is worth the most on the day you replace a readable implementation with a fast one: keep the slow version in the test binary and compare the two on random input.

### In CI

Run each target for 60 seconds against the committed corpus on every pull request, and for hours nightly, saving the grown corpus as an artefact. Fuzzing exercises the error and cleanup paths from Chapters 2 and 5 — the ones manual testing never reaches, and where the leaks and use-after-frees live.
        `,
        [
          q('Why must a fuzz target be built with -fsanitize=address rather than plain -O2?',
            [
              'ASan makes libFuzzer mutate inputs more aggressively',
              'Without it an out-of-bounds read usually returns a stray byte and the run continues, so the fuzzer has no failure to record',
              'libFuzzer refuses to link without a sanitizer',
              'ASan is what supplies the corpus directory',
            ], 1, 'A fuzzer can only find failures it can observe, and ASan is what converts silent memory corruption into an immediate, reported crash.'),
          q('The fuzzer feeds a target bytes that are not valid input at all. What should the target do?',
            [
              'Call std::abort so the malformed case is recorded',
              'Return a non-zero value to tell libFuzzer to discard the input',
              'Catch the parse error and return 0 — rejecting bad input is correct behaviour, not a finding',
              'Write the input to the corpus directory for later inspection',
            ], 2, 'Only invariant violations, sanitizer reports and hangs are bugs; a parser that cleanly refuses garbage is working.'),
          q('mySort silently drops duplicate elements. Which property test catches it?',
            [
              'std::is_sorted on the result',
              'Comparing the result against a hand-written expected vector for one example',
              'Checking that the first element is the minimum',
              'std::is_permutation against the original input',
            ], 3, 'The output is still ordered, so only the permutation invariant notices that elements went missing.'),
        ]
      ),
      ],
      [
        q('Why is RelWithDebInfo the right build type for profiling and for most crash investigation?', [
          'It disables optimisations, so line numbers are exact',
          'It keeps release optimisations and adds symbols, so the profile reflects shipped code',
          'It is the only build type ctest can run',
          'It enables the sanitizers automatically',
        ], 1, 'Debug builds change speed and layout enough that their measurements and sometimes their bugs do not match the real binary.'),
        q('A microbenchmark loop calls parse(input) and reports 0.3 ns per iteration. What is the likely explanation?', [
          'The parser really is that fast on cached input',
          'The clock resolution is too coarse to measure it',
          'The input was too small to require an allocation',
          'The result is unused, so the optimiser removed the call — sink it with DoNotOptimize',
        ], 3, 'Dead-code elimination deletes work whose result nobody observes, so a benchmark must consume its output.'),
        q('A bug reproduces reliably in Release but never in Debug. What does that suggest?', [
          'The Debug build is simply too slow to reach the code',
          'Release builds are given less memory by the OS',
          'It is very likely undefined behaviour or a data race; build with UBSan or TSan rather than hunting it in Debug',
          'The optimiser introduced the bug, so it should be reported to the compiler vendor',
        ], 2, 'The optimiser assumes no UB and no races, so those are the two classes of bug whose symptoms depend on optimisation level.'),
        q('What is the difference between ASSERT_EQ and EXPECT_EQ in GoogleTest?', [
          'ASSERT_ aborts the current test immediately; EXPECT_ records the failure and continues',
          'EXPECT_ only runs in Debug builds',
          'ASSERT_ is compiled out when NDEBUG is defined',
          'They are identical; ASSERT_ is just the older spelling',
        ], 0, 'Reserve ASSERT for preconditions whose failure would crash the rest of the test, so one run reports every other failure.'),
      ]
    ),
      chapter(
      'Memory Layout and Custom Allocation',
      'Where objects actually sit in memory, and how arenas, pools and pmr turn an allocation bound program into a cache friendly one.',
      [
      lesson('Object Layout: Alignment, Padding, and Aliasing', 13, `
\`sizeof(Order)\` prints 24. Count the members: a \`bool\`, a \`double\`, a \`std::uint32_t\`. That is 13 bytes of data. You are paying 24, and in a vector of five million orders the difference is 55 MB of RAM holding nothing at all.

The compiler is not being wasteful. It is obeying alignment.

### Every type has an alignment, and it is not optional

A \`double\` must sit at an address divisible by 8. On x86 a misaligned load is merely slow; on some ARM cores it faults outright. So the compiler inserts padding until the next member lands on a legal address, then pads the tail as well, so that \`arr[1]\` starts legally too.

\`\`\`cpp
struct Order {
    bool          filled;   // offset 0, 1 byte, then 7 bytes of padding
    double        price;    // offset 8
    std::uint32_t id;       // offset 16, then 4 bytes of tail padding
};                          // sizeof 24, alignof 8
\`\`\`

Reorder widest first and the padding mostly evaporates:

\`\`\`cpp
struct Order {
    double        price;    // offset 0
    std::uint32_t id;       // offset 8
    bool          filled;   // offset 12, then 3 bytes of tail padding
};                          // sizeof 16, alignof 8
\`\`\`

Same fields, same code, 33% less memory and four orders per cache line instead of two. The rule is one line long: **declare members from widest alignment to narrowest.** The compiler will not do it for you, because members sharing an access specifier are required to sit in increasing address order.

Pin the result so nobody quietly undoes it:

\`\`\`cpp
static_assert(sizeof(Order) == 16, "Order grew, check member order");
static_assert(offsetof(Order, id) == 8);
\`\`\`

### Over-aligning on purpose

\`alignas\` goes the other way, forcing a type onto a wider boundary than it needs. Chapter 7 used \`alignas(64)\` to push two atomic counters onto separate cache lines; the portable spelling of that number is \`std::hardware_destructive_interference_size\`. The other common use is SIMD, where an AVX2 \`__m256\` load wants 32 byte alignment.

Watch the cost. \`sizeof\` must always be a multiple of \`alignof\` so array indexing works, so \`alignas(64)\` on a 16 byte struct makes every instance 64 bytes. An array of a million of those wastes three quarters of every line you touch. Over-align the one hot counter, never the element type of a large vector.

### Type punning, and the rule that deletes your code

You have a \`float\` and you want its bits.

\`\`\`cpp
float f = 1.5f;
std::uint32_t bits = *reinterpret_cast<std::uint32_t*>(&f);   // undefined behaviour
\`\`\`

That compiles, prints \`0x3fc00000\` at \`-O0\`, and is still wrong. The strict aliasing rule says an object may only be read through its own type, or through \`char\`, \`unsigned char\` or \`std::byte\`. The optimiser therefore assumes a \`float*\` and a \`std::uint32_t*\` never point at the same bytes, which frees it to reorder the store past the load or keep \`f\` in a register and read stale memory. Bugs of this shape show up only in release builds, which is the signature Chapter 7 taught you to recognise.

The fix costs literally nothing:

\`\`\`cpp
std::uint32_t bits = std::bit_cast<std::uint32_t>(f);   // C++20
std::memcpy(&bits, &f, sizeof bits);                    // any standard
\`\`\`

Both compile to a single \`movd\`. A \`memcpy\` of a small fixed size is not a function call; the compiler recognises the pattern and emits the load directly.

The same rule kills two other habits. Reading a union member you did not write is legal C and undefined C++. And casting a \`char*\` receive buffer straight to \`Packet*\` is wrong twice over: it aliases, and a byte buffer carries no guarantee that the address satisfies \`alignof(Packet)\`.

\`\`\`cpp
Packet p;
std::memcpy(&p, buf + 12, sizeof p);    // correct, and exactly as fast
\`\`\`

Layout is a design decision, not an implementation detail. Get the member order right once and every loop over that data gets faster for free, forever.
      `,
        [
          q('Reordering Order\'s members from bool, double, uint32_t to double, uint32_t, bool drops sizeof from 24 to 16. Why will the compiler not do this for you?', [
            'Reordering would change the type\'s own alignment requirement',
            'The optimiser only reorders data members at -O3 and above',
            'Members sharing an access specifier must sit in increasing address order',
            'It does reorder, but only for types that declare no constructors',
          ], 2, 'The standard fixes the relative addresses of members with the same access specifier, so packing them tightly is your decision and nobody else\'s.'),
          q('Reading a float\'s bits via *reinterpret_cast<std::uint32_t*>(&f) works at -O0 and misbehaves at -O2. What is going on?', [
            'Strict aliasing lets the optimiser assume the two pointers never overlap',
            'The cast rounds the float to an integer before the bits are stored',
            'reinterpret_cast is only defined between pointers of identical size',
            'The float lives in a register that -O0 happens to spill to the stack',
          ], 0, 'Because the compiler may assume a float and a uint32_t never alias, it is free to reorder or drop the store, so use std::bit_cast or std::memcpy instead.'),
          q('What does alignas(64) on a 16 byte element type cost you in a vector of a million elements?', [
            'Nothing, since alignas only affects the address of the first element',
            'Each element still occupies 16 bytes but starts on a line boundary',
            'The vector fails to compile because alignas exceeds max_align_t',
            'Each element grows to 64 bytes, so you fetch four times the memory',
          ], 3, 'sizeof must be a multiple of alignof for array indexing to work, so the type itself becomes 64 bytes and every cache line now carries one useful element.'),
        ]
      ),
      lesson('Arenas, Pools, and Stack Buffers', 13, `
A JSON parser reading a 40 MB export made 1.2 million calls to \`malloc\`. At roughly 80 nanoseconds each that is 96 milliseconds burned before a single field was parsed, against 140 ms for the parse itself. Two thirds of the run was the allocator.

Twenty lines of arena took the total to 51 ms.

### What a general allocator is doing for you

\`operator new\` has a hard job: any size, any order, any thread, memory reused forever without fragmenting. So it maintains size classes, free lists, per thread caches and a fallback lock. You pay for all of that on every single call, and the blocks it hands back are scattered across the heap, which charges you again on every traversal.

A parse needs none of it. Every node lives until the document is finished, then they all die together. That asymmetry is the whole opportunity.

### The arena: allocation is a pointer increment

\`\`\`cpp
class Arena {
public:
    explicit Arena(std::size_t bytes) : buf_(bytes), top_(buf_.data()) {}

    void* allocate(std::size_t n, std::size_t align) {
        void* p = top_;
        std::size_t space = static_cast<std::size_t>(buf_.data() + buf_.size() - top_);
        if (!std::align(align, n, p, space)) throw std::bad_alloc{};
        top_ = static_cast<std::byte*>(p) + n;
        return p;
    }

    void reset() noexcept { top_ = buf_.data(); }   // frees everything, O(1)

private:
    std::vector<std::byte> buf_;
    std::byte* top_;
};
\`\`\`

Allocation is an align and an add. Deallocation does not exist. \`reset()\` releases a million objects in one instruction, and because they were handed out in address order, iterating them walks memory forwards, which is exactly what the prefetcher in the next topic wants.

**The mistake that bites: an arena never runs destructors.** Bump allocate a \`std::string\` and the string's own heap buffer leaks the moment you reset. Arenas are for trivially destructible data: parse nodes, index entries, plain records. If a type owns something else, keep it out of the arena or track its destructor by hand.

### Pools: fixed size blocks, and real freeing

An arena cannot free one object. A pool can, provided every object is the same size. Carve the buffer into equal blocks and thread the free list through the blocks themselves, so the bookkeeping costs zero extra bytes:

\`\`\`cpp
void* Pool::allocate() {
    if (!free_) throw std::bad_alloc{};
    void* p = free_;
    free_ = *reinterpret_cast<void**>(free_);   // the link lives inside the free block
    return p;
}

void Pool::deallocate(void* p) noexcept {
    *reinterpret_cast<void**>(p) = free_;
    free_ = p;
}
\`\`\`

Two loads and two stores, no lock, and no fragmentation is even possible, because every hole fits every request. This is the right shape for connection objects, particles and graph nodes: many, identical, individually short lived.

### Stack buffers for the common case

Most vectors are small. Hand one a stack buffer and it may never touch the heap at all:

\`\`\`cpp
std::byte scratch[4096];
std::pmr::monotonic_buffer_resource res{scratch, sizeof scratch};
std::pmr::vector<int> ids{&res};      // the first thousand pushes allocate nothing
\`\`\`

That is the next topic compressed into three lines. Avoid \`alloca\` and variable length arrays here: neither has an overflow check, so a size derived from input turns into a smashed stack.

| Strategy | allocate | free one | free all | Good for |
|---|---|---|---|---|
| \`operator new\` | 50 to 100 ns | yes | no | general code |
| Arena | 2 to 5 ns | no | O(1) reset | per request, per frame |
| Pool | 5 to 10 ns | yes | O(1) reset | many objects of one size |
| Stack buffer | free | no | scope exit | small and short lived |

Pick the lifetime pattern first. The allocator falls straight out of it.
      `,
        [
          q('You bump allocate ten thousand std::string objects out of an arena and then call reset(). What happens?', [
            'reset() runs each destructor before it rewinds the top pointer',
            'Every string\'s heap buffer leaks, because reset() runs no destructor',
            'The strings stay valid until the arena\'s buffer is overwritten',
            'std::align rejects the request because string is not trivially copyable',
          ], 1, 'An arena rewinds a pointer and does nothing else, so any object owning memory elsewhere leaks that separate allocation every time.'),
          q('A pool allocator threads its free list through the free blocks themselves. What does that buy?', [
            'It lets blocks of several different sizes share one pool',
            'It removes any need for the blocks to be aligned at all',
            'It makes deallocate safe to call from several threads at once',
            'Bookkeeping costs zero extra bytes, since only free blocks hold links',
          ], 3, 'A block that is currently free holds no user data, so its first bytes are available to store the link to the next free block.'),
          q('Which workload is the wrong fit for a monotonic arena?', [
            'A long lived cache whose entries are inserted and evicted continuously',
            'Parsing one document into nodes that all die when the parse ends',
            'Per frame scratch data in a renderer, reset at the end of each frame',
            'Building a temporary index that is discarded once a request finishes',
          ], 0, 'An arena cannot release an individual object, so interleaved insert and evict traffic grows the buffer without bound while waiting for a reset that never comes.'),
        ]
      ),
      lesson('std::pmr: Swapping Allocators Without Rewriting Types', 13, `
The arena from the last topic works, and now nothing will accept it. Write it as a classic allocator and your container becomes \`std::vector<Order, ArenaAlloc<Order>>\`, a different type from \`std::vector<Order>\`, so it will not pass to a single function you already have. Every caller up the stack becomes a template. That tax is precisely what \`std::pmr\` was designed to remove.

### The allocator moves out of the type

A classic allocator is a template parameter, baked into the type. A \`std::pmr::polymorphic_allocator\` instead holds one runtime pointer to a \`std::memory_resource\` and dispatches through a virtual call. So \`std::pmr::vector<Order>\` is one single type whether its bytes come from the heap, from a stack array or from your arena.

\`\`\`cpp
class Arena : public std::pmr::memory_resource {
    void* do_allocate(std::size_t n, std::size_t align) override;
    void  do_deallocate(void*, std::size_t, std::size_t) override {}   // no-op
    bool  do_is_equal(const std::pmr::memory_resource& o) const noexcept override {
        return this == &o;
    }
};
\`\`\`

Three functions, and every pmr container in the standard library can now allocate from it. \`do_is_equal\` is the one people skip. It answers whether memory from another resource can be handed back to this one, and returning \`true\` when that is not so hands a block from arena A to arena B on the next container swap. Comparing addresses is the honest answer for a stateful resource, and it is what the standard pool resources do.

### The resources you get for free

| Resource | Behaviour |
|---|---|
| \`new_delete_resource()\` | plain \`operator new\`, the default |
| \`monotonic_buffer_resource\` | bump allocate, deallocate is a no-op, all released at destruction |
| \`unsynchronized_pool_resource\` | size classed pools, single thread only |
| \`synchronized_pool_resource\` | the same thing with a lock |
| \`null_memory_resource()\` | throws \`std::bad_alloc\` on any request |

\`null_memory_resource\` looks useless and is the most valuable of the five:

\`\`\`cpp
std::byte buf[8192];
std::pmr::monotonic_buffer_resource res{buf, sizeof buf, std::pmr::null_memory_resource()};
std::pmr::vector<int> v{&res};
\`\`\`

Overflowing the stack buffer now throws instead of quietly falling back to the heap. Without it, a benchmark that "never allocates" starts allocating at input size 1001 and the graph never says so.

### The two gotchas that cost people a day

**Element types have to be pmr aware too.** These are not the same thing:

\`\`\`cpp
std::pmr::vector<std::string>      a{&res};   // vector data in the arena, every string on the heap
std::pmr::vector<std::pmr::string> b{&res};   // both in the arena
\`\`\`

A pmr container passes its resource down to any element that will accept one, which is uses allocator construction. \`std::string\` accepts nothing, so it ignores your arena entirely. If the profile still shows a million \`malloc\` calls after the switch, this is why.

**The allocator does not travel on assignment.** \`propagate_on_container_move_assignment\` is false for a polymorphic allocator, so:

\`\`\`cpp
std::pmr::vector<int> a{&arena1};
std::pmr::vector<int> b{&arena2};
b = std::move(a);            // element by element copy, O(n), no pointer steal
\`\`\`

A move that is silently a copy. Move construction is fine, because the new object simply adopts the source's resource. Move assignment between two different resources cannot, so it copies. Keep one resource per scope and the trap never appears.

### At the boundary

\`std::pmr::vector<Order>\` still will not bind to \`const std::vector<Order>&\`. Take a \`std::span<const Order>\` (Chapter 3) in your interfaces and both container types work, with no template and no copy.

### What it costs

One indirect call per allocation, a couple of nanoseconds. Against a 60 ns \`malloc\` you are ahead the instant the resource is a bump pointer, and the win compounds, because arena allocated objects end up next to each other in memory. Measure it the way Chapter 7 insisted: swap the resource, leave the code alone, rerun the benchmark.
      `,
        [
          q('Your profile still shows a million malloc calls after moving to std::pmr::vector<std::string> backed by an arena. Why?', [
            'monotonic_buffer_resource falls back to the heap once its buffer fills',
            'polymorphic_allocator routes small allocations through operator new',
            'std::string takes no allocator argument, so each one allocates on the heap',
            'The vector copies each string into the arena and frees the original',
          ], 2, 'Uses allocator construction only hands the resource to elements that can accept one, and std::string is not pmr aware, so std::pmr::string is what you actually want.'),
          q('b = std::move(a) between two std::pmr::vector<int> holding different resources does what?', [
            'Copies element by element, because the allocator does not propagate',
            'Steals a\'s buffer and leaves it empty, as any normal move would',
            'Rebinds b to a\'s resource and then steals the buffer',
            'Throws, because the two resources compare unequal',
          ], 0, 'propagate_on_container_move_assignment is false for a polymorphic allocator, so b keeps its own resource and therefore has to copy every element into it.'),
          q('Why pass null_memory_resource() as the upstream of a monotonic_buffer_resource over a stack array?', [
            'It stops the resource from being shared between two threads',
            'Overflowing the stack buffer then throws instead of silently using the heap',
            'It halves the per allocation cost by removing the virtual dispatch',
            'It lets the resource reuse blocks that were individually deallocated',
          ], 1, 'Without a null upstream the fallback is invisible, so a benchmark can quietly start heap allocating at a slightly larger input and still look allocation free.'),
        ]
      ),
      lesson('Cache Lines, Prefetching, and Vectorised Loops', 14, `
Sum ten million \`int\` values held in a \`std::vector<int>\`: 3.1 ms. Sum the same ten million ints through a shuffled \`std::vector<int*>\` pointing at them: 210 ms. Identical additions, identical payload bytes, 68 times slower.

The arithmetic did not change. What changed is that the hardware could no longer guess what you would touch next.

### The prefetcher sees strides, never pointers

Every modern core watches your access pattern and fetches lines ahead of you. It locks onto constant strides, forwards or backwards, and typically gives up at a 4 KB page boundary. Give it \`v[i]\`, \`v[i+1]\`, \`v[i+2]\` and the data is in L1 before you ask for it. Give it \`node->next\` and it can do nothing at all, because that address does not exist until the previous load returns. Your loop is now serialised at one full memory latency, around 100 ns, per element.

This is the real reason Chapter 4 said \`vector\` beats \`list\`. It is also why \`std::vector<std::unique_ptr<Shape>>\` is slower than it looks: the pointers are contiguous, the objects are anywhere.

### Prefetch by hand only when you know the address early

Hash probing is the classic case, because the next bucket is computable long before you need it:

\`\`\`cpp
for (std::size_t i = 0; i < keys.size(); ++i) {
    if (i + 8 < keys.size())
        __builtin_prefetch(&table[hash(keys[i + 8]) & mask]);
    total += table[hash(keys[i]) & mask].value;
}
\`\`\`

Distance is everything. One iteration ahead and the line has not arrived; two hundred ahead and it is evicted before use. Tune the constant by measuring, usually somewhere between 4 and 16 iterations.

### What actually stops the vectoriser

At \`-O2\` and above the compiler will fold eight \`float\` operations into one AVX instruction, if it can prove that is safe. Usually it cannot, and the commonest reason is aliasing:

\`\`\`cpp
void scale(float* out, const float* in, std::size_t n, float k) {
    for (std::size_t i = 0; i < n; ++i) out[i] = in[i] * k;
}
\`\`\`

\`out\` and \`in\` might overlap, so the compiler either emits a runtime overlap check plus two copies of the loop, or gives up entirely. Promise that they do not:

\`\`\`cpp
void scale(float* __restrict out, const float* __restrict in, std::size_t n, float k) {
    for (std::size_t i = 0; i < n; ++i) out[i] = in[i] * k;
}
\`\`\`

Lie about that and you get silent corruption, so use it only where you own every caller.

| Blocker | Symptom | Fix |
|---|---|---|
| Possible aliasing | two loop versions, or plain scalar code | \`__restrict\`, or copy to a local |
| Loop carried dependency | \`a[i] = a[i-1] + x\` | restructure, or accept the scalar loop |
| Call in the body not inlined | scalar loop | mark \`inline\`, or hoist the call out |
| Strided or indexed access | gather instructions, no speedup | structure of arrays (Chapter 7) |
| \`float\` reduction | no fold at \`-O2\` | \`-ffast-math\`, knowing results change |

Stop guessing whether it vectorised. Ask the compiler:

\`\`\`bash
g++ -O3 -march=native -fopt-info-vec-missed hot.cpp
# hot.cpp:14:23: missed: couldn't vectorize loop
# hot.cpp:14:23: missed: possible alias between out and in
\`\`\`

clang reports the same through \`-Rpass-analysis=loop-vectorize\`.

### Two traps on the way out

\`-march=native\` builds for the machine that ran the compiler. Ship that binary to an older server and it dies with SIGILL on the first AVX-512 instruction it reaches. Build against a named baseline such as \`-mavx2\` and dispatch at runtime if you genuinely need more.

And check the ceiling before optimising. If a loop already streams at 12 GB/s on a machine whose memory tops out near 14, no amount of extra vector width helps. The only lever left is touching fewer bytes: \`float\` instead of \`double\`, \`std::uint16_t\` indices instead of \`int\`, and the layout discipline from Chapter 7.
      `,
        [
          q('Summing through a shuffled std::vector<int*> is dramatically slower than summing a std::vector<int>. What is the mechanism?', [
            'Each dereference adds an extra instruction to the critical path',
            'The optimiser cannot unroll a loop whose body holds a dereference',
            'Pointers are eight bytes, so twice as much data crosses the bus',
            'The next address is unknown until the current load returns, so nothing prefetches',
          ], 3, 'A dependent load chain gives the hardware prefetcher no stride to lock onto, so you pay a full memory latency per element instead of streaming.'),
          q('void scale(float* out, const float* in, std::size_t n) refuses to vectorise. The likeliest reason is:', [
            'std::size_t indices force the compiler into 64 bit address arithmetic',
            'out and in might overlap, so the compiler cannot prove the loop is safe',
            'float multiplication is not associative, which blocks the fold',
            'The loop bound n is not a compile time constant',
          ], 1, 'Two pointers to the same type are allowed to alias, so without __restrict the compiler must either version the loop or leave it entirely scalar.'),
          q('You build with -march=native in CI and the binary dies with SIGILL on a production host. Why?', [
            'The production host uses a different page size than the build machine',
            'Debug symbols were stripped, so the illegal instruction handler failed',
            'The build machine supports instructions the production CPU lacks',
            '-march=native disables the runtime CPU feature checks in libstdc++',
          ], 2, 'native targets exactly the machine that compiled the code, so any newer instruction it emits is illegal on an older CPU; build against a named baseline instead.'),
        ]
      ),
      ],
      [
      q('You allocate parse nodes from an arena and each node holds a std::pmr::string. What makes the string bytes come from that same arena?', [
        'Constructing the nodes with the arena\'s allocator, which propagates to the string',
        'Giving each string its own monotonic_buffer_resource at construction',
        'Using std::pmr::string with the default new_delete_resource',
        'Copying the strings into the arena once the parse has finished',
      ], 0, 'Uses allocator construction passes a container\'s resource down to any element that accepts one, so a pmr aware string allocates from the same arena as its owner.'),
      q('Which change is most likely to speed up a loop already streaming near the machine\'s memory bandwidth limit?', [
        'Adding __builtin_prefetch eight iterations ahead of each read',
        'Rebuilding with -march=native to unlock wider vector registers',
        'Moving the allocation from operator new to a monotonic arena',
        'Storing the field as float instead of double, halving the bytes read',
      ], 3, 'When bandwidth is the ceiling the only lever left is moving fewer bytes, so narrowing the element type buys real time where extra instructions buy none.'),
      q('Why does std::pmr::vector<Order> need no template change when you swap it from the heap to an arena?', [
        'The standard library specialises vector for polymorphic_allocator',
        'The resource is a runtime pointer, not part of the container\'s type',
        'polymorphic_allocator is stateless, so all instances compare equal',
        'pmr containers allocate through a global resource fixed at startup',
      ], 1, 'Moving the allocator choice out of a template parameter and into virtual dispatch through memory_resource is exactly what lets one type serve every resource.'),
      q('reinterpret_cast<Packet*>(recvBuffer + 12) is wrong for two independent reasons. Which pair?', [
        'The cast is not constexpr, and Packet may declare virtual functions',
        'recvBuffer may be freed, and Packet may not be copy constructible',
        'It violates strict aliasing, and the address may not satisfy Packet\'s alignment',
        'The offset may exceed the buffer, and the fields may need byte swapping',
      ], 2, 'Reading bytes through an unrelated type is undefined, and a byte buffer guarantees nothing about alignof(Packet), so memcpy into a real Packet is the correct fix.'),
      ]
    ),
    chapter(
      'Lock-Free Code and the Memory Model',
      'Atomics past the counter, the ordering guarantees the hardware really gives you, and the narrow set of cases where lock free beats a mutex.',
      [
      lesson('Acquire, Release, and What Happens Before What', 13, `
A message passing test runs a billion iterations on an Intel laptop without one failure, then breaks within four seconds on a Graviton3 server. Same source, same compiler flags, different hardware memory model. Acquire and release exist to close that gap.

### The bug that only shows up on ARM

\`\`\`cpp
#include <atomic>

std::atomic<bool> ready{false};
Frame* frame = nullptr;

void decoder() {
    frame = decodeNextFrame();                      // plain write
    ready.store(true, std::memory_order_relaxed);   // publishes nothing
}

void renderer() {
    while (!ready.load(std::memory_order_relaxed)) {}
    render(frame);                                  // may still see nullptr
}
\`\`\`

\`relaxed\` gives exactly one guarantee: the operation on \`ready\` is indivisible, and all threads agree on the order of operations to \`ready\` alone. It says nothing about \`frame\`. At \`-O2\` the compiler may sink the write to \`frame\` below the store to \`ready\`, because inside one function nothing forbids it. An ARM or POWER core may commit the two stores in either order regardless of what the compiler emitted.

### Release publishes, acquire subscribes

\`\`\`cpp
void decoder() {
    frame = decodeNextFrame();
    ready.store(true, std::memory_order_release);   // everything above is now sendable
}

void renderer() {
    while (!ready.load(std::memory_order_acquire)) {}
    render(frame);                                  // guaranteed to see the decoded frame
}
\`\`\`

A release store and an acquire load form a **synchronizes-with** edge only when they act on the same atomic object and the acquire load actually reads the value that release store wrote. Once that edge exists, everything sequenced before the store in the writer **happens-before** everything sequenced after the load in the reader. Happens-before is the only ordering the standard ever promises. There is no global clock and no "at the same moment".

Two ways people break the pairing without noticing:

- The acquire load reads \`false\`. It read the initial value, not the release store, so there is no edge. That is correct and expected; the loop keeps spinning.
- Someone later adds a reset path with \`ready.store(true, std::memory_order_relaxed)\`. Now the acquire load may read a value produced by that relaxed store, which carries nothing with it, and the payload is unordered again. Every store to a flag must be a release, not just the one you were thinking about.

### What the orderings actually cost

| Ordering | x86-64 emits | AArch64 emits | Buys you |
|---|---|---|---|
| relaxed load or store | \`mov\` | \`ldr\` / \`str\` | atomicity, per variable order |
| acquire load, release store | \`mov\` | \`ldar\` / \`stlr\` | a one way barrier that pairs |
| seq_cst store | locked \`xchg\` | \`stlr\` plus fence | one total order all threads agree on |

Read the x86 column again. An acquire load and a relaxed load compile to the identical instruction there, so \`relaxed\` buys you nothing on that machine and costs you correctness on every other one. Benchmarking memory orderings on an x86 box teaches you very little.

\`seq_cst\` is the default because it is the only ordering under which the intuitive "everyone sees one consistent story" reasoning holds. Keep it until a profile names the specific line, and even then reach for acquire and release before relaxed.

### Read-modify-write, fences, and volatile

An operation that both consumes and publishes takes \`memory_order_acq_rel\`. The canonical one is a reference count:

\`\`\`cpp
if (refs.fetch_sub(1, std::memory_order_acq_rel) == 1) delete ptr;
\`\`\`

The release half keeps every write made by the dying thread visible to whoever runs the destructor. The acquire half stops the destructor being hoisted above the decrement. Drop either and you get a use-after-free that reproduces once a week.

\`std::atomic_thread_fence(std::memory_order_release)\` orders everything before it against a matching acquire fence without attaching to one variable. Useful when you publish through several atomics at once, unnecessary otherwise.

\`volatile\` is none of this. It stops the compiler caching a value in a register and that is all: no atomicity, no ordering, no protection against a torn read. A \`volatile bool done\` spin loop is a data race, which is undefined behaviour, and ThreadSanitizer will say so.

\`memory_order_consume\` is in the standard, but no shipping compiler implements it; every one promotes it to acquire. Ignore it.
      `,
        [
          q('The renderer spins on an acquire load and reads false for its first hundred iterations. What ordering do those reads establish?', [
            'They synchronize with the flag\'s construction, so the payload is already visible',
            'None, because an acquire load only creates an edge when it reads a value a release store wrote',
            'They create a happens-before edge with the next release store made to that flag',
            'They are undefined behaviour, because a spin loop needs an explicit thread fence',
          ], 1, 'An acquire load that returns the initial value read nothing that any release store published, so no synchronizes-with edge exists and the loop correctly keeps spinning.'),
          q('Why does a relaxed message passing bug survive a billion iterations on x86 yet fail within seconds on AArch64?', [
            'x86 atomics are always sequentially consistent, so the relaxed tag is ignored there',
            'AArch64 has no store buffer, so its writes reach memory in a scrambled order',
            'The compiler only reorders stores when an explicit fence appears in the source',
            'x86 hardware preserves store to store order, while AArch64 lets the two stores land either way round',
          ], 3, 'The compiler can reorder on both targets, but x86 hardware keeps stores in program order, which shrinks the failure window to almost nothing and hides the missing release.'),
          q('A colleague swaps std::atomic<bool> done for volatile bool done to shave off overhead. What has actually changed?', [
            'Nothing useful, since volatile prevents register caching but adds no atomicity or ordering',
            'The loop is now sequentially consistent, but noticeably slower on ARM than the atomic was',
            'Reads stay atomic and only the acquire ordering has been dropped from the loop',
            'The compiler now emits a fence at every read, so the loop is correct but expensive',
          ], 0, 'volatile only stops the value being cached in a register, so the loop becomes a data race with no ordering guarantee at all, which is undefined behaviour.'),
        ]
      ),
      lesson('Compare and Swap: Writing a Lock-Free Queue', 14, `
An uncontended compare-and-swap costs roughly 20 cycles on a modern x86 core. Put sixteen threads on the same cache line and that same instruction can take a hundred times longer, because fifteen of them are failing and retrying. CAS is the primitive every lock-free structure is built from, and the price is set by how many threads aim at one address.

### CAS is a conditional store that hands back a fresh read

\`\`\`cpp
bool compare_exchange_weak(T& expected, T desired,
                           std::memory_order success,
                           std::memory_order failure);
\`\`\`

If the atomic currently holds \`expected\`, write \`desired\` and return true. Otherwise overwrite \`expected\` with the value the atomic really held, and return false. That second half is what people miss: a failed exchange already reloaded the variable for you.

Here is a Treiber stack push written the way the loop wants to be written:

\`\`\`cpp
struct Node { Payload value; Node* next; };
std::atomic<Node*> head{nullptr};

void push(Node* n) {
    n->next = head.load(std::memory_order_relaxed);
    while (!head.compare_exchange_weak(n->next, n,
                                       std::memory_order_release,
                                       std::memory_order_relaxed)) {
        // the failed exchange refreshed n->next; nothing to do but retry
    }
}
\`\`\`

The release on success publishes both \`n->value\` and \`n->next\` to whichever thread later acquires \`head\`. The failure order can be relaxed because a failed exchange publishes nothing. Two rules constrain that argument: the failure order may not be stronger than the success order, and it may never be \`release\` or \`acq_rel\`.

Adding an explicit \`n->next = head.load(...)\` inside the loop body is the common beginner version. It is not wrong, it is just a second load of a line you already own, doubling the coherence traffic in the hottest place in the function.

### weak or strong

On AArch64 and POWER, a CAS compiles to a load-exclusive / store-exclusive pair such as \`ldaxr\` and \`stlxr\`. The store half can fail for reasons unrelated to the value: an interrupt, a context switch, another core touching the same line. \`weak\` lets that failure reach you. \`strong\` hides it behind an inner retry loop.

So: inside a loop, use \`weak\`, since you are retrying anyway. Outside a loop, where a single failure means "I lost the race, take the other branch", use \`strong\`, or a spurious failure will be read as a lost race that never happened.

### The queue worth writing

An unbounded multi-producer multi-consumer lock-free queue is a research problem, for reasons the next topic explains. A bounded single producer, single consumer ring is thirty lines and covers most audio, network and telemetry paths.

\`\`\`cpp
template <class T, std::size_t N>              // N must be a power of two
class SpscRing {
    static constexpr std::size_t kMask = N - 1;
    alignas(64) std::atomic<std::size_t> head_{0};   // consumer writes
    alignas(64) std::atomic<std::size_t> tail_{0};   // producer writes
    alignas(64) std::array<T, N> slots_{};
public:
    bool push(const T& v) {
        const auto t = tail_.load(std::memory_order_relaxed);
        if (t - head_.load(std::memory_order_acquire) == N) return false;   // full
        slots_[t & kMask] = v;
        tail_.store(t + 1, std::memory_order_release);   // publishes the slot
        return true;
    }
    bool pop(T& out) {
        const auto h = head_.load(std::memory_order_relaxed);
        if (h == tail_.load(std::memory_order_acquire)) return false;       // empty
        out = slots_[h & kMask];
        head_.store(h + 1, std::memory_order_release);
        return true;
    }
};
\`\`\`

Not one CAS. Each index has exactly one writer, so a plain release store is enough, and the acquire load of the other index is the pairing from the previous topic. The indices count upward forever and the mask is applied only on access, so full and empty never look alike and no slot has to be wasted to tell them apart.

\`alignas(64)\` is not decoration. Share a cache line between \`head_\` and \`tail_\` and every producer store invalidates the consumer's copy of the line the consumer is spinning on. Padding a hot SPSC ring routinely multiplies throughput several times over on the same machine, which is Chapter 8's false sharing showing up in a data structure rather than a loop.

One more win: keep a plain, non-atomic copy of the opposite index in each side's own cache line and reload the shared one only when the cached value says you are full or empty. On a queue that is usually neither, cross-core traffic drops close to zero.
      `,
        [
          q('A call to compare_exchange_weak returns false. What state is the expected argument you passed in?', [
            'Unchanged, so you have to reload the atomic yourself before the next attempt',
            'Set to the desired value you tried to store, ready to be used on the retry',
            'Overwritten with the value the atomic actually held, so the retry needs no reload',
            'Left unspecified, which is the reason strong must be used inside retry loops',
          ], 2, 'A failed exchange writes the observed value back into expected, so the loop already has a fresh read and an extra explicit load only doubles the coherence traffic.'),
          q('Why is compare_exchange_weak the right choice inside a retry loop on AArch64?', [
            'It exposes spurious store-exclusive failures instead of paying for a hidden inner retry loop',
            'It uses a weaker memory ordering, so no barrier instruction is emitted on the success path',
            'It is the only form that refreshes the expected argument when the comparison fails',
            'It falls back to a mutex once the cache line is contended, which caps the retry storm',
          ], 0, 'A load-exclusive and store-exclusive pair can fail for reasons unrelated to the value, and strong hides that behind its own loop, which is pure waste when you are already looping.'),
          q('The SPSC ring publishes tail_ with a release store and never uses a CAS. Why is that safe?', [
            'Because the ring is bounded, and a bounded container cannot race by construction',
            'Because std::array members become implicitly atomic when the class holds atomic indices',
            'Because relaxed loads of the owned index make the whole pair sequentially consistent',
            'Because each index has exactly one writer, so there is no read modify write to make atomic',
          ], 3, 'Only the producer writes tail_ and only the consumer writes head_, so a plain release store is sufficient and the expensive read modify write is never needed.'),
        ]
      ),
      lesson('ABA and Safe Reclamation', 13, `
A pop succeeds, the compare matched, and the stack is now corrupt. Nothing was reordered and no ordering flag was wrong. The pointer simply came back.

### The four steps that break a Treiber stack

Thread A is running \`pop\`: read \`head\`, read \`head->next\`, then CAS \`head\` from the old node to that next pointer.

| Time | Thread A | Thread B | \`head\` holds |
|---|---|---|---|
| t0 | reads head = X, reads X->next = Y | | X |
| t1 | descheduled by the OS | pops X, pops Y | Z |
| t2 | still descheduled | frees Y, pushes X back | X |
| t3 | CAS(head, expected X, desired Y) succeeds | | Y |

At t3 the comparison passed because the pointer value matched. The structure it described did not survive: \`Y\` was freed at t2, so \`head\` now points into memory the allocator has handed to somebody else. The CAS answered "is this the same address" when the question you needed answered was "is this the same list".

That is ABA. It is also a symptom rather than the disease. The disease is **reclamation**: in a structure without locks, when is it safe to free a node another thread may be one instruction away from dereferencing? A mutex answers that question for you by construction. Take the mutex away and it becomes yours.

### Four ways out, cheapest first

**Stop using pointers.** A bounded ring indexed by monotonic 64 bit counters cannot have ABA, because a counter that never repeats a value can never compare equal to a stale one, and no node is ever freed. This is why the previous topic's SPSC ring needed no reclamation scheme at all.

**Tag the pointer.** Pack a version counter beside the pointer and swap both in one instruction.

\`\`\`cpp
struct TaggedHead { Node* ptr; std::uint64_t tag; };
std::atomic<TaggedHead> head;                  // 16 bytes
static_assert(std::atomic<TaggedHead>::is_always_lock_free);  // needs -mcx16
\`\`\`

On x86-64 this becomes \`cmpxchg16b\`. Every successful swap bumps the tag, so the A that returns is not the A you read. Check \`is_always_lock_free\` or you have silently bought a mutex, and remember a tag is probabilistic: it wraps, and there is no portable double-width CAS.

**Hazard pointers.** Before dereferencing, a thread stores the pointer in a per-thread slot, then re-checks the pointer is still reachable. A thread retiring a node scans every published slot and frees only what nobody claimed. Reader cost is a store plus a fence; memory is bounded by threads times slots, which is the property the next option lacks. \`std::hazard_pointer\` lands in C++26; before that use \`folly::hazptr\` or libcds.

**Epoch based reclamation, the RCU shape.** Readers announce an epoch on entry, writers retire nodes into a per-epoch bin, and a bin is freed once every thread has moved past it. Readers are almost free, which is why the Linux kernel is built on it.

| Scheme | Reader cost | Memory bound | Where it hurts |
|---|---|---|---|
| Indices, nothing freed | zero | fixed at construction | must be bounded |
| Tagged pointer | one wider CAS | none by itself | tag wrap, portability |
| Hazard pointers | store plus fence | threads times slots | scan cost per retire |
| Epoch or RCU | close to zero | unbounded | one stalled reader pins it |

That last cell is a real outage, not a footnote. A thread that blocks on a 200 ms network call inside a read section stops the epoch advancing, and the retire list grows for the whole 200 ms across every writer.

### What the tools will not tell you

AddressSanitizer catches the use-after-free only when the poisoned read actually lands in the window, so a genuine ABA bug shows up as one crash in ten thousand runs and gets closed as a flake. ThreadSanitizer models \`std::atomic\` and will flag missing ordering, but it has no idea whether your hazard pointer protocol is correct.

What works: a stress harness built with \`-fsanitize=address,undefined\`, run on a many core weakly ordered machine, plus a model checker such as CDSChecker or Relacy that enumerates the interleavings your test never reaches.

Before writing any of this, ask whether a bounded ring plus back pressure solves the actual problem. It usually does, and it costs an afternoon instead of a quarter.
      `,
        [
          q('In the ABA timeline, thread A\'s compare-and-swap on head succeeds. What has gone wrong?', [
            'The exchange compared a stale value, so it should have returned false but the tag was missing',
            'The pointer value matched again while the structure it described had been freed and rebuilt',
            'Thread B used relaxed ordering for its pushes, so A never observed the intervening pops',
            'The read of X->next was not atomic, so A picked up a torn pointer before the exchange',
          ], 1, 'The comparison only asks whether the address is the same, and the address came back while the node it pointed onward to had already been freed by another thread.'),
          q('A service uses epoch based reclamation and holds a read section open across a 200 ms network call. What is the consequence?', [
            'Other readers block until the epoch advances, so latency climbs across the whole pool',
            'The retire list is freed early, which turns into a use-after-free on that same thread',
            'The epoch cannot advance, so retired nodes pile up and memory grows without a bound',
            'The reclaimer switches to hazard pointers and frees the pending nodes regardless',
          ], 2, 'Epoch reclamation can only free a bin once every thread has left the epoch, so a single stalled reader pins the epoch and every writer keeps accumulating retired nodes.'),
          q('Why can a bounded ring indexed by monotonic 64 bit counters not suffer from ABA?', [
            'Because the counters never repeat a value, so a comparison cannot match a stale generation',
            'Because the slots get reused, and reuse of storage is what the ABA problem really requires',
            'Because every index update is a strong exchange, and strong is immune to spurious matches',
            'Because a bounded container falls back to a lock whenever the buffer is close to full',
          ], 0, 'ABA needs a value to come back after changing, and an index that only ever counts upward can never present the same value twice within the life of the program.'),
        ]
      ),
      lesson('When a Mutex Wins: Measuring Contention', 13, `
A team replaced a \`std::mutex\` guarded queue with a hand written lock-free MPMC queue. Throughput fell from 4.1 million to 2.8 million operations per second and the p99 got worse. The lock-free version was not buggy and it was not badly written. It answered a question the team did not have.

### What an uncontended mutex really costs

On Linux, \`std::mutex\` is a futex. Locking it when nobody else wants it is a compare-exchange on one word; unlocking is a store. Round trip is roughly 20 nanoseconds and there is no syscall. The kernel only appears when a thread actually has to sleep. "Mutexes are slow" is a claim about contention, not about locks.

Under contention both designs are doing the same physical thing: moving one cache line between cores. That transfer is the cost, and it does not care which synchronisation primitive requested it.

| Where the line currently lives | Typical latency to get it |
|---|---|
| This core, L1 | 1 to 4 ns |
| Another core, same socket | 20 to 50 ns |
| Another socket | 100 to 300 ns |

Now do the arithmetic that decides most of these arguments. A critical section of 100 ns caps the whole program at 10 million operations per second, no matter how many cores you buy, because that section is serial. A lock-free structure whose CAS targets a single cache line has the same ceiling. Serialisation moved; it did not disappear.

### What lock-free actually buys

A progress guarantee, not speed. Lock-free means the system as a whole keeps making progress even if any thread is preempted, descheduled or killed at an arbitrary instruction. Note the shape of that promise: **lock-free** says somebody progresses, **wait-free** says every thread finishes in a bounded number of steps. A CAS retry loop is lock-free and not wait-free, so under heavy contention one unlucky thread can retry for a long time.

That guarantee is worth paying for in a short list of places:

- A real time audio callback handling 256 frames at 48 kHz has 5.3 ms of wall clock and is not allowed to block. Take a lock there, let priority inversion happen once, and the user hears a click.
- A signal handler, where locking a mutex the interrupted code already holds is undefined.
- Shared memory across processes, where one process can die holding the lock and nobody can release it.
- Tail latency, where a lock holder descheduled mid-section adds a whole scheduler quantum to someone's p999.

If your case is not on that list, the honest comparison is against a mutex you have actually tuned.

### Measure the contention before rewriting anything

\`\`\`bash
perf lock record ./bench --threads 16 && perf lock report   # wait time per lock
perf c2c record ./bench && perf c2c report                  # which lines bounce, and why
perf stat -e cache-misses,LLC-load-misses ./bench
\`\`\`

A portable version that needs no tooling at all:

\`\`\`cpp
if (!m.try_lock()) {
    contended.fetch_add(1, std::memory_order_relaxed);
    m.lock();                       // now block, having counted the collision
}
\`\`\`

The ratio of \`contended\` to total acquisitions is the number that decides the argument. Below a few percent, the lock is not your bottleneck and replacing it will win nothing while costing you a structure nobody on the team can review.

### Cheaper moves, in the order to try them

| Move | Typical effect |
|---|---|
| Shrink the critical section: allocate, format and log outside it | often 2x to 10x |
| Shard the lock, one per bucket, hash the key | scales with shard count |
| Batch: lock once per 64 items instead of once per item | 64x fewer acquisitions |
| Per thread accumulator, merged at the end | removes the sharing entirely |
| \`std::shared_mutex\` for a read heavy map | helps only if reads dominate |

Work down that table with a profile in hand. Only after it runs out, and only when a measurement names the lock, reach for lock-free, and prefer the bounded SPSC ring shown earlier over anything whose correctness you would have to prove.

The rule to leave with: if you cannot state the progress guarantee you need and show the contention number that forces it, \`std::scoped_lock\` is the right answer. It is correct, it composes, and it is readable by whoever is on call at 3am.
      `,
        [
          q('A profile shows a 100 ns critical section and 32 worker threads hammering it. What ceiling does that set?', [
            'Around 320 million per second, because each thread runs its own copy of the section',
            'No ceiling at all, since threads only serialise when they happen to collide on the lock',
            'Around 10 million per second, but only until the lock is replaced by a lock-free design',
            'Around 10 million per second, whatever the core count and whatever the lock design is',
          ], 3, 'The section is serial, so its own duration sets the ceiling, and moving the same serialisation into a contended cache line does not raise it.'),
          q('What does a lock-free guarantee give you that a well tuned mutex does not?', [
            'That every thread completes its own operation within a bounded number of steps',
            'That the system keeps making progress even if a thread stalls mid-operation',
            'That throughput now scales linearly with the number of cores contending',
            'That no cache line has to be transferred between cores during an update',
          ], 1, 'Lock-free promises system wide progress under arbitrary preemption, which is why it matters for audio callbacks and cross process memory, while bounded steps per thread is wait-free.'),
          q('Your try_lock counter reports that 1.5 percent of acquisitions were contended. What should you conclude?', [
            'Shard the lock straight away, since any contention compounds badly above eight threads',
            'Move to std::shared_mutex, which removes the contention for readers and for writers',
            'The lock is not the bottleneck, so profile elsewhere before rewriting any of this code',
            'Replace it with a lock-free queue, because 1.5 percent of a hot path is significant',
          ], 2, 'At a few percent contention the lock is almost always uncontended and costs about 20 ns, so the time is being spent somewhere the profile has not been pointed at yet.'),
        ]
      ),
      ],
      [
      q('A producer fills a ring slot and then advances tail_ with a relaxed store, while the consumer loads tail_ with acquire. What is the defect?', [
        'The relaxed store creates no edge, so the consumer can read a slot that is not written yet',
        'The acquire load is too strong and will be promoted to seq_cst by every compiler',
        'Two stores land on the same index, so the counter itself can tear on a 32 bit build',
        'Nothing, because an acquire on either side of the pair already orders the slot write',
      ], 0, 'Synchronizes-with needs a release store on the publishing side, and a relaxed store carries none of the writes that came before it, so the slot contents remain unordered.'),
      q('Which situation genuinely needs a lock-free structure rather than a mutex you have tuned?', [
        'A REST handler appending to one shared log four thousand times every second',
        'A real time audio callback that must never block or wait on another thread',
        'A batch job whose worker threads each bump a shared counter once per row',
        'A cache read by many threads and rewritten once a minute by a refresh task',
      ], 1, 'The audio callback has a hard deadline and cannot afford priority inversion or a descheduled lock holder, so it needs a progress guarantee rather than merely good average throughput.'),
      q('You add a 16 bit version tag beside the pointer and swap both with cmpxchg16b. What has that achieved?', [
        'Reclamation is now safe, because no node can be freed while its tag is still live',
        'Readers are protected the way hazard pointers protect them, at a lower reader cost',
        'ABA becomes very unlikely, but the tag still wraps and nodes still need a safe free',
        'The structure becomes wait-free, since a tagged exchange cannot fail spuriously',
      ], 2, 'Tagging makes the stale comparison improbable rather than impossible, and it says nothing about when a retired node may actually be handed back to the allocator.'),
      q('Your lock-free queue passes a 24 hour stress test on an x86 build machine. What does that prove about its memory ordering?', [
        'It proves the acquire and release pairs are correct on every supported target',
        'It proves the code has no data races, since ThreadSanitizer runs in that build',
        'It proves nothing until the seq_cst defaults have been replaced with relaxed',
        'Very little, since x86 hides missing ordering that AArch64 exposes in seconds',
      ], 3, 'x86 preserves store order and gives acquire and release semantics for free, so a missing ordering flag has almost no window there and only shows up on a weakly ordered machine.'),
      ]
    ),
    chapter(
      'Coroutines and Asynchronous C++',
      'Code that suspends instead of blocking, from a lazy generator to an async service with cancellation you can actually reason about.',
      [
      lesson('What a Coroutine Compiles Into: Frames, Promises, and Awaiters', 14, `
Put a single \`co_await\` in a function body and the compiler stops treating it as a function. The body is chopped at every suspend point, every local that has to survive a suspension is moved off the stack into a heap allocated **coroutine frame**, and the caller gets back a handle to that frame instead of a return value.

Nothing in the syntax warns you. There is no \`async\` keyword to grep for.

### The three pieces

A coroutine needs a return type that names a \`promise_type\`. The promise is the control panel: it decides when the body starts, what \`co_return\` does, and what survives the end.

\`\`\`cpp
#include <coroutine>
#include <cstdio>

struct Lazy {
    struct promise_type {
        int value{};
        Lazy get_return_object() {
            return Lazy{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_value(int v) { value = v; }
        void unhandled_exception() { std::terminate(); }
    };

    std::coroutine_handle<promise_type> handle;
    ~Lazy() { if (handle) handle.destroy(); }

    int get() { handle.resume(); return handle.promise().value; }
};

Lazy loadPort() {
    std::puts("reading config");
    co_return 8080;
}
\`\`\`

Call \`loadPort()\` and nothing prints. The frame is allocated, the promise is constructed, \`initial_suspend()\` returns \`suspend_always\`, and control comes straight back to the caller before the first statement of the body runs. The text appears only when \`get()\` calls \`resume()\`. Change that one word to \`std::suspend_never\` and the body runs eagerly up to the first real suspend point instead. One line, completely different execution order.

### The awaiter protocol

\`co_await expr\` is not magic either. It calls three functions on whatever \`expr\` produces.

| Member | Returns | Job |
|---|---|---|
| \`await_ready()\` | \`bool\` | \`true\` means the value is already here, so skip the suspension |
| \`await_suspend(h)\` | \`void\`, \`bool\`, or a handle | the frame is saved; park \`h\` where something will resume it |
| \`await_resume()\` | anything | runs on resumption; its result is the value of the \`co_await\` |

\`await_ready\` is the fast path and it earns its keep. A socket read with bytes already buffered returns \`true\`, never suspends, and costs about what an ordinary call costs.

Returning a \`std::coroutine_handle\` from \`await_suspend\` is **symmetric transfer**: the compiler tail calls into that coroutine rather than returning to whoever resumed you. Without it, a chain of a thousand awaiting tasks unwinds a thousand frames deep and blows the stack.

### What a frame costs

Locals that live across a suspend point go in the frame. Locals that do not may stay in registers.

\`\`\`cpp
Task<void> handle(Socket& s) {
    std::array<char, 4096> buffer;   // crosses the await: 4 KB in EVERY frame
    co_await s.read(buffer);
    co_return;
}
\`\`\`

Ten thousand connections is 40 MB of buffers nobody budgeted for. Take the buffer from a pool (Chapter 8) and keep only a pointer in the frame.

The frame comes from \`operator new\` unless the compiler can prove the coroutine's lifetime is nested inside its caller and elides the allocation. That optimisation is real and it is fragile: it needs inlining, and it vanishes the moment the handle escapes the function. Confirm it with a heap profiler rather than assuming it happened.

### The mistake

\`handle.destroy()\` is never called for you. A wrapper that stores a handle and forgets to destroy it leaks the entire frame, promise and locals included, and ASan reports it as a plain \`operator new\` leak with the coroutine's name nowhere in the stack. Give every coroutine type a destructor that destroys the handle it owns, and delete its copy constructor so two owners can never both call \`destroy\`.
      `,
        [
          q('loadPort() is called but the puts inside its body prints nothing until get() runs. Which promise_type member is responsible?', [
            'initial_suspend, which returns suspend_always and parks the frame before the body runs',
            'final_suspend, which keeps the frame alive after co_return completes',
            'get_return_object, which builds the handle before the body can start',
            'unhandled_exception, which is only reached if the body throws',
          ], 0, 'initial_suspend runs before the first statement of the body, and returning suspend_always hands control straight back to the caller until someone calls resume.'),
          q('await_suspend returns a std::coroutine_handle instead of void. What does that buy you?', [
            'The awaiting coroutine is resumed twice, once for each return path',
            'The compiler skips await_resume and uses the handle as the result',
            'A tail call into that coroutine, so a long await chain does not grow the stack',
            'The frame moves onto the stack instead of coming from operator new',
          ], 2, 'That is symmetric transfer: control jumps directly into the named coroutine rather than returning through the resumer, so a thousand chained awaits do not nest a thousand frames deep.'),
          q('A handler declares std::array<char, 4096> buffer; just before its only co_await. Why does that matter at 10000 connections?', [
            'The array is zero initialised on each resume, costing 40 MB of writes',
            'operator new rejects allocations that large without an aligned overload',
            'Each resume copies the array back onto the stack, doubling the cost',
            'It lives across the suspend point, so every frame carries 4 KB, near 40 MB total',
          ], 3, 'Any local that must survive a suspension is stored in the coroutine frame, so a per connection frame grows by the full size of that buffer.'),
        ]
      ),
      lesson('Generators and Lazy Pipelines', 13, `
A 2.1 GB \`access.log\`, and the job is the first ten requests that returned 500. Read every line into a \`std::vector<std::string>\` and the process peaks near 2.5 GB of resident memory, then throws almost all of it away. Pull one line at a time and stop after the tenth match and it never gets past a few hundred kilobytes.

Same output. Different program.

### co_yield is co_await wearing a hat

\`co_yield x\` is rewritten as \`co_await promise.yield_value(x)\`. Give the promise a \`yield_value\` that stashes the value and suspends, and the coroutine becomes a sequence you pull from. C++23 ships that type as \`std::generator\`, and cppcoro or libcoro provide it for older toolchains.

\`\`\`cpp
#include <generator>
#include <fstream>
#include <string>

std::generator<std::string> lines(const char* path) {
    std::ifstream in{path};
    std::string line;
    while (std::getline(in, line)) co_yield line;
}

std::generator<std::string> failures(std::generator<std::string> src) {
    for (auto&& l : src)
        if (l.find(" 500 ") != std::string::npos) co_yield std::move(l);
}

int main() {
    int shown = 0;
    for (auto&& l : failures(lines("/var/log/nginx/access.log"))) {
        std::puts(l.c_str());
        if (++shown == 10) break;
    }
}
\`\`\`

The \`break\` is the interesting part. Control leaves the range loop, which destroys the \`failures\` generator, whose frame is suspended inside its own \`for\` loop; destroying that frame destroys the \`src\` generator it holds, which destroys the \`lines\` frame, which runs the \`ifstream\` destructor. The file is closed before \`main\` returns and the remaining two gigabytes were never touched.

### Where laziness stops paying

Every \`co_yield\` is a suspend and a resume: save the resume point, jump to the consumer, jump back. That is roughly 2 to 5 ns per element on a current x86 core, against under a nanosecond for an inlined \`std::views::filter\` step, because the optimiser cannot inline across a suspension.

| Sequence | Work per element | Reach for |
|---|---|---|
| 40 million ints | a comparison | \`std::views\`, not a generator |
| thousands of records | parsing, allocation, I/O | a generator; the suspend disappears in the noise |
| unknown or endless | anything | a generator; a view needs a finite range |

Endless is the case a container cannot express at all:

\`\`\`cpp
std::generator<std::uint64_t> fibonacci() {
    std::uint64_t a = 0, b = 1;
    while (true) { co_yield a; auto next = a + b; a = b; b = next; }
}
\`\`\`

### Recursion, and the trap inside it

The obvious recursive walk resumes through every level for every element:

\`\`\`cpp
std::generator<Node*> walk(Node* n) {          // O(depth) per element
    if (!n) co_return;
    co_yield n;
    for (auto* c : n->children)
        for (auto* d : walk(c)) co_yield d;
}
\`\`\`

On a tree 20 levels deep that is 20 resumes to deliver one node. \`std::generator\` has the fix built in:

\`\`\`cpp
for (auto* c : n->children)
    co_yield std::ranges::elements_of(walk(c));   // one resume per element
\`\`\`

\`elements_of\` splices the child generator into the same resume chain, so the consumer jumps directly to the deepest active frame instead of climbing the whole ladder.

### The one that bites

A generator is single pass and single consumer. Calling \`begin()\` on one twice is undefined behaviour, and handing the same generator to two functions that each iterate it gives you a half consumed sequence with no diagnostic at all. Treat it exactly like an input stream: pass it along with \`std::move\` and never touch your copy again.
      `,
        [
          q('The consumer breaks out of the range loop after ten matches. What closes the ifstream inside lines()?', [
            'The ifstream closes itself once getline reaches the end of the file',
            'Destroying the generator destroys its frame, which runs the ifstream destructor',
            'Nothing does, so the descriptor stays open until the process exits',
            'The break resumes the coroutine one more time so it can return',
          ], 1, 'Destroying a suspended coroutine frame runs the destructors of every local in scope, and the ifstream is one of those locals.'),
          q('You filter a 40 million element vector<int> with a generator rather than std::views::filter. What is the likely result?', [
            'It runs faster, because the generator avoids building an intermediate vector',
            'It fails to compile, because a generator cannot yield a fundamental type',
            'It uses far more memory, because each element is stored in the frame',
            'It gets noticeably slower, because a suspend per element cannot be inlined',
          ], 3, 'A view composes into one inlined loop, while a generator pays a suspend and a resume for every single element, which dominates when the per element work is a comparison.'),
          q('A recursive tree walk nests for (auto* d : walk(c)) co_yield d; on a tree 20 levels deep. What does co_yield std::ranges::elements_of(walk(c)) change?', [
            'Each element costs one resume instead of climbing back through 20 generators',
            'It removes the frame allocation that each recursive call would otherwise make',
            'It allows two consumers to iterate the same generator at the same time',
            'It converts the traversal from depth first order into breadth first order',
          ], 0, 'elements_of splices the child generator into the same resume chain, so the consumer resumes the deepest active frame directly instead of passing every element up through each nested level.'),
        ]
      ),
      lesson('Tasks, Executors, and Non-Blocking I/O', 14, `
Thread per connection at 5000 clients means 5000 stacks, 8 MB of address space reserved each, 40 GB of virtual memory, and a kernel scheduler doing real work to shuffle between them. The same service on coroutines is 5000 frames of roughly 200 bytes, about a megabyte in total, running on one or four OS threads.

That is the whole trade. A blocked thread costs a stack. A suspended coroutine costs a struct.

### A task that resumes its awaiter

A generator yields to whoever pulls it. A task is the mirror image: it runs, and when it finishes it must resume whoever awaited it. \`final_suspend\` is where that happens.

\`\`\`cpp
template <class T>
struct Task {
    struct promise_type {
        T result{};
        std::coroutine_handle<> continuation;
        std::exception_ptr error;

        Task get_return_object() {
            return Task{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() noexcept { return {}; }
        void return_value(T v) { result = std::move(v); }
        void unhandled_exception() { error = std::current_exception(); }

        struct Final {
            bool await_ready() noexcept { return false; }
            std::coroutine_handle<> await_suspend(std::coroutine_handle<promise_type> h) noexcept {
                auto c = h.promise().continuation;
                return c ? c : std::noop_coroutine();
            }
            void await_resume() noexcept {}
        };
        Final final_suspend() noexcept { return {}; }
    };

    std::coroutine_handle<promise_type> h;
    bool await_ready() const noexcept { return false; }
    std::coroutine_handle<> await_suspend(std::coroutine_handle<> awaiting) noexcept {
        h.promise().continuation = awaiting;
        return h;                       // start the child by symmetric transfer
    }
    T await_resume() {
        if (h.promise().error) std::rethrow_exception(h.promise().error);
        return std::move(h.promise().result);
    }
};
\`\`\`

Exceptions travel by \`exception_ptr\`: caught in \`unhandled_exception\`, rethrown in \`await_resume\`, so a \`try\` around a \`co_await\` behaves the way you expect.

### Who actually calls resume

Nothing in the standard library runs a coroutine. \`co_await\` on a socket registers the handle with an event loop and returns; the loop calls \`resume()\` once \`epoll_wait\` reports the descriptor ready.

\`\`\`cpp
struct ReadAwaiter {
    Loop& loop; int fd; std::span<char> buf; ssize_t n{};
    bool await_ready() {
        n = ::read(fd, buf.data(), buf.size());
        return n >= 0 || (errno != EAGAIN && errno != EWOULDBLOCK);
    }
    void await_suspend(std::coroutine_handle<> h) { loop.waitReadable(fd, h); }
    ssize_t await_resume() { return n; }
};
\`\`\`

Trying the read inside \`await_ready\` is not a micro optimisation. On a warm connection most reads succeed immediately, and skipping the epoll registration and the resume is a large part of the gap between a fast server and a slow one.

Boost.Asio spells the same loop as an \`io_context\` plus \`co_spawn\`, and stdexec spells it as a scheduler you await. The shape underneath does not change: something outside the coroutine owns the handle and decides when it runs again.

### Thread affinity is not preserved

| Held before the co_await | State after it resumes |
|---|---|
| the calling thread | whichever thread the loop resumed you on |
| a \`std::lock_guard\` | still locked, now unlocked by a different thread, which is UB |
| a \`thread_local\` scratch buffer | some other thread's buffer |

To move on purpose, await a scheduler:

\`\`\`cpp
Task<Report> build(Db& db) {
    auto rows = co_await db.query("SELECT id, total FROM orders WHERE day = '2026-08-24'");
    co_await pool.schedule();       // hop to a worker thread
    co_return crunch(rows);         // CPU bound work, off the I/O thread
}
\`\`\`

### The failure everybody hits once

One blocking call poisons the entire loop. A synchronous HTTP client, \`std::this_thread::sleep_for\`, a genuinely contended mutex: while any of those runs, every other connection on that thread is frozen. The signature is a p50 of 2 ms, a p99 near a second, and a CPU graph that looks almost idle. Audit your handlers for blocking APIs before you open a profiler.
      `,
        [
          q('A request handler calls a synchronous HTTP client while running on the event loop thread. What do the metrics look like?', [
            'CPU pinned near 100 percent while total throughput stays flat',
            'Frames leak, so resident memory climbs with every request served',
            'A p50 of a couple of milliseconds, a p99 near a second, and an idle CPU',
            'Requests start failing with EAGAIN once the socket buffer fills',
          ], 2, 'The thread is parked in a blocking call rather than doing work, so it burns no CPU while every other connection queued on that loop waits behind it.'),
          q('Why does ReadAwaiter attempt ::read inside await_ready rather than always suspending?', [
            'A read with bytes already buffered returns true and skips the epoll registration',
            'await_suspend is not allowed to call read on a non blocking descriptor',
            'Returning false from await_ready would destroy the coroutine frame',
            'epoll cannot report readability for a descriptor nobody has read yet',
          ], 0, 'Most reads on a warm connection succeed immediately, and taking the ready path avoids both the registration and the later resume, which is where much of the throughput advantage comes from.'),
          q('A coroutine takes a std::lock_guard on a mutex and then co_awaits a database query. What is wrong with it?', [
            'The lock_guard is a local, so it is destroyed at the suspend point and the mutex stays locked',
            'The coroutine can resume on another thread, so the mutex is unlocked by a thread that never locked it',
            'std::mutex cannot be used inside a coroutine because the frame is heap allocated',
            'Holding the lock stops the event loop from registering the query descriptor',
          ], 1, 'Locals survive the suspension inside the frame, so the guard unlocks wherever the coroutine happens to resume, and unlocking a std::mutex from a thread that does not own it is undefined behaviour.'),
        ]
      ),
      lesson('Cancellation, Dangling Captures, and Coroutine Lifetimes', 14, `
This compiles clean, survives review, and reads freed memory at runtime:

\`\`\`cpp
Task<int> countWords(const std::string& text) {
    co_await pool.schedule();
    co_return std::ranges::count(text, ' ') + 1;
}

int main() {
    auto t = countWords(loadFile("notes.txt"));   // the temporary dies here
    return syncWait(t);                           // reads a destroyed string
}
\`\`\`

\`text\` is a coroutine parameter, so it is copied into the frame. It is a reference, so what gets copied is the reference. The temporary string it binds to is destroyed at the end of the full expression that created the coroutine, which is the semicolon on the first line, and lifetime extension does not reach across a suspend point. ASan calls it a heap use after free inside \`std::ranges::count\`, thirty frames away from the actual mistake.

### The rule

Coroutine parameters are copied or moved into the frame. Referents are not, and neither the compiler nor most linters will say a word.

\`\`\`cpp
Task<int> countWords(std::string text);         // by value: safe
Task<int> countWords(std::string_view text);    // a reference in disguise: same bug
Task<int> countWords(const std::string& text);  // safe only if the caller outlives it
\`\`\`

Take parameters by value in any coroutine whose caller might not await it immediately. One extra \`std::string\` move is nothing next to the class of bug it deletes. Lambdas hide the same trap:

\`\`\`cpp
auto t = [&session]() -> Task<void> { co_await session.flush(); }();
\`\`\`

The closure object is a temporary too. It dies at that semicolon, taking the captured reference with it, while the coroutine that will read it is still suspended. Pass the state in as by value parameters rather than capturing it.

### Cancellation is cooperative

There is no \`task.kill()\`. Exactly two things can end a coroutine early.

1. \`handle.destroy()\` on a **suspended** frame. It runs the destructors of every local currently in scope and frees the frame. It is undefined behaviour on a running coroutine, and it quietly corrupts the loop if that handle is still registered with epoll.
2. The coroutine noticing it should stop and returning on its own.

Only the second is safe in general, and \`std::stop_token\` from Chapter 6 is the channel for it:

\`\`\`cpp
Task<void> mirror(std::stop_token st, Socket& in, Socket& out) {
    std::array<char, 8192> buf;
    while (!st.stop_requested()) {
        auto n = co_await in.read(buf, st);
        if (n <= 0) break;
        co_await out.write({buf.data(), std::size_t(n)}, st);
    }
}
\`\`\`

Checking between awaits covers the CPU bound half. The awaits themselves need a \`std::stop_callback\` that completes the pending operation with an error, otherwise a cancelled read waits on its socket forever and cancellation only appears to work in tests where the peer sends data anyway.

Budget for that early. A service that cancels cleanly needs a stop token threaded through every awaitable it owns, and retrofitting one later touches every signature in the call graph.

### Who owns the frame

| Owner | Frame is destroyed |
|---|---|
| the \`Task\` object | in its destructor, if the frame is suspended |
| an event loop registration | when the loop resumes it and it reaches \`final_suspend\` |
| nobody, after a detach | never, so the frame leaks |

Detached work is where all three failures meet: nothing owns the frame, nothing can cancel it, and it may resume after the objects it points at are gone. Keep the parent alive until every child completes. Shut down by requesting stop on each token, awaiting the children, and only then destroying the loop and the sockets they were reading.
      `,
        [
          q('countWords(const std::string& text) is handed a temporary and awaited on the next line. Why is that undefined behaviour?', [
            'Coroutine frames are allocated before arguments are evaluated, so text is uninitialised',
            'The temporary is moved into the frame, so the caller is left holding an empty string',
            'co_await copies the whole frame, and const references cannot survive that copy',
            'Only the reference is stored in the frame, and the temporary dies at the semicolon',
          ], 3, 'A reference parameter is copied as a reference, and no lifetime extension applies, so the string it refers to is already destroyed by the time the coroutine resumes.'),
          q('A lambda coroutine captures session by reference and is invoked immediately, as in [&session]() -> Task<void> { ... }(). What breaks?', [
            'The capture is copied into the frame, so writes land on a stale copy of session',
            'The closure object is a temporary that dies at the semicolon, so the capture dangles',
            'Lambdas cannot contain co_await unless the return type is written as auto',
            'The task starts eagerly, so session is used before it is fully constructed',
          ], 1, 'The closure is the coroutine\'s implicit object parameter and it is a temporary, so it is destroyed at the end of the full expression while the suspended coroutine still points into it.'),
          q('A pending read is registered with the event loop and you call handle.destroy() to cancel it. What happens?', [
            'destroy blocks until the loop has deregistered the descriptor for you',
            'The frame is freed cleanly, because destroy runs every local destructor',
            'The loop still holds that handle and resumes a freed frame when the fd fires',
            'Cancellation succeeds, but the read stop_callback is never invoked',
          ], 2, 'Destroying the frame does not remove the handle from the epoll registration, so the next readiness event resumes memory that has already been freed.'),
        ]
      ),
      ],
      [
      q('Which statement about calling a coroutine whose initial_suspend returns std::suspend_always is true?', [
        'The frame is allocated and the promise constructed, but no statement of the body has run',
        'The body runs to the first co_await and then control returns to the caller',
        'Nothing happens at all until the returned object is destroyed at end of scope',
        'The body runs to completion, since suspend_always applies only to co_yield',
      ], 0, 'The frame allocation and promise construction happen at the call, and suspend_always then parks the coroutine before its first statement executes.'),
      q('One function must supply a million parsed records to a caller that usually stops after the first few. Which shape fits best?', [
        'A Task<std::vector<Record>> awaited once, since the frame is heap allocated anyway',
        'A callback invoked per record, since a generator cannot be stopped part way',
        'A std::vector<Record> returned by value, relying on the move to avoid a copy',
        'A generator, since the caller breaking out destroys the frame and parsing stops',
      ], 3, 'Laziness means work is only done for records the consumer actually pulls, and abandoning the loop destroys the frame so the remaining input is never parsed.'),
      q('Which single change removes the largest class of dangling coroutine bugs for the least effort?', [
        'Allocate every coroutine frame from an arena so freed frames stay mapped',
        'Take coroutine parameters by value instead of by reference or string_view',
        'Mark every coroutine noexcept so unhandled_exception is never reached',
        'Use shared_ptr for every object a coroutine touches while it is suspended',
      ], 1, 'Reference parameters are stored as references in the frame with no lifetime extension, so copying the argument in makes the coroutine independent of what the caller does next.'),
      q('A service shuts down while several tasks are suspended on socket reads registered with its io context. What is the safe order?', [
        'Destroy the sockets first so that the pending reads complete with an error',
        'Call destroy on every registered handle, then delete the io context itself',
        'Request stop on each token, await the tasks, then destroy the loop and sockets',
        'Detach the tasks so the loop can be torn down without waiting on them',
      ], 2, 'Cooperative cancellation lets each coroutine unwind through its own destructors and deregister itself before anything it points at is destroyed.'),
      ]
    ),
    chapter(
      'Libraries, ABI, and Distribution',
      'Turning a project that builds on your machine into libraries other teams can link, install and upgrade without breaking.',
      [
      lesson('Compilers, Standard Libraries, and the Portable Subset', 13, `
Your CI has been green for eight months on Ubuntu with GCC 13. A partner team pulls \`inventory\` into their Windows build and opens a ticket with 214 compiler errors, most of them pointing at a header you have not touched in a year. Nothing is wrong with your code. You have only ever tested one third of the C++ you are actually writing.

### Compiler and standard library are separate choices

| Toolchain | Compiler | Standard library | Usual home |
|---|---|---|---|
| GCC | g++ | libstdc++ | Linux, embedded |
| Clang | clang++ | libc++ or libstdc++ | macOS, Android, Linux |
| MSVC | cl.exe | Microsoft STL | Windows |

Clang defaults to libc++ on macOS and libstdc++ on most Linux distributions, so "we support Clang" is at least two configurations, not one. They genuinely differ. On 64 bit, libstdc++ makes \`sizeof(std::string)\` 32 bytes with room for 15 characters inline; libc++ makes it 24 bytes with room for 22. Neither is wrong. Both bite the moment a \`std::string\` crosses a library boundary built by the other one.

### The macro that lies to you

\`\`\`cpp
#if __cplusplus >= 202002L
  #include <format>
#endif
\`\`\`

Build that with MSVC and \`/std:c++20\`, and the branch is skipped. MSVC reports \`__cplusplus\` as \`199711L\` for backward compatibility unless you also pass \`/Zc:__cplusplus\`. The guard quietly takes the fallback path on Windows, and you discover it when a feature you were certain was enabled is missing.

Ask about the feature, not the year:

\`\`\`cpp
#include <version>

#if defined(__cpp_lib_format) && __cpp_lib_format >= 201907L
  #include <format>
  const auto line = std::format("{} units of {}", qty, sku);
#else
  #include <fmt/format.h>
  const auto line = fmt::format("{} units of {}", qty, sku);
#endif
\`\`\`

\`<version>\` exists for exactly this. Every library feature carries a \`__cpp_lib_*\` macro that appears when an implementation actually ships the feature, which is often two years after the standard did.

### What the standard refuses to promise

| Thing | Reality across platforms |
|---|---|
| \`sizeof(long)\` | 8 on Linux and macOS, 4 on 64 bit Windows |
| \`char\` signedness | signed on x86, unsigned on ARM Linux |
| Argument evaluation order | unspecified, so \`move(pop(q), pop(q))\` can swap |
| \`filesystem::path::value_type\` | \`char\` on POSIX, \`wchar_t\` on Windows |
| \`#include "Warehouse.hpp"\` | finds \`warehouse.hpp\` on Windows, fails on Linux |

That last row costs more afternoons than the rest combined, because the developer who introduced it sees a clean build.

### Two flag sets that catch most of it

\`\`\`bash
# GCC and Clang
-Wall -Wextra -Wpedantic -Werror
# MSVC
/W4 /permissive- /WX
\`\`\`

\`/permissive-\` matters most. Without it, MSVC delays name lookup inside templates, so this compiles on Windows and is rejected everywhere else:

\`\`\`cpp
template <typename Range>
void dump(const Range& r) {
  Range::value_type first = *r.begin();   // needs typename
}
\`\`\`

GCC and Clang do two phase lookup and reject \`Range::value_type\` at definition time, because a dependent name is assumed to be a value unless you write \`typename\`. Developers who only build on MSVC write this pattern for years without knowing.

### Pick the baseline, then prove it every push

Put one line in the README: C++20, GCC 12 or newer, Clang 15 or newer, MSVC 19.36 or newer. Then build all three in CI on every pull request, not nightly and not weekly. A portability break caught three minutes after the push costs a rebase. The same break found three weeks later by a team on another continent costs a meeting, a revert, and a patch release.
      `,
        [
          q('A header guards a C++20 code path with #if __cplusplus >= 202002L. It works on GCC but the guarded code is skipped on MSVC even though /std:c++20 was passed. Why?', [
            'MSVC reports __cplusplus as 199711L unless /Zc:__cplusplus is also passed',
            'MSVC only defines __cplusplus inside .cpp files, never inside headers',
            'The /std:c++20 flag on MSVC enables the language but not the library',
            'MSVC evaluates preprocessor comparisons as strings, so the test fails',
          ], 0, 'MSVC keeps __cplusplus pinned at 199711L for backward compatibility with old code, and only reports the real value when you add /Zc:__cplusplus, so year based guards silently take the fallback branch on Windows.'),
          q('Inside a template, Range::value_type first = *r.begin(); compiles under MSVC in its default mode but is rejected by GCC and Clang. What is happening?', [
            'GCC and Clang require every template to be explicitly instantiated first',
            'MSVC silently adds a using declaration for value_type in template scope',
            'The begin() call returns a different type under each standard library',
            'It is a dependent name, so it needs typename, and MSVC delays the lookup',
          ], 3, 'Two phase lookup treats a dependent qualified name as a value unless you write typename, and MSVC without /permissive- postpones that check, which lets non portable template code build on Windows for years.'),
          q('Which of these differences is most likely to break a build that has only ever been compiled on 64 bit Linux?', [
            'sizeof(int) changes between Linux and Windows compilers',
            '#include "Warehouse.hpp" resolves case insensitively on Windows',
            'std::vector uses a different growth factor on each platform',
            'Anonymous namespaces have external linkage under MSVC',
          ], 1, 'Windows filesystems match include names without regard to case, so a mismatched filename compiles cleanly there and fails on a case sensitive Linux filesystem, while int is 32 bits on all three mainstream toolchains.'),
        ]
      ),
      lesson('Static and Shared Libraries, Symbols, and Visibility', 14, `
A colleague converts \`core\` from a static library to a shared one, and the CSV import feature stops working. No crash, no error, no warning. The registry that used to hold four readers now holds three. The code that registers the CSV reader was never deleted, and it is still in the binary. It just never ran.

### An archive is a bag the linker picks from

A \`.a\` is a container of \`.o\` files. The linker pulls an object out of it only when that object defines a symbol something already needs. Objects nobody references are dropped, along with their namespace scope initialisers.

\`\`\`cpp
// src/csv_reader.cpp
namespace {
  const bool registered = inv::Registry::add("csv", &makeCsvReader);
}
\`\`\`

Nothing in \`main.cpp\` calls anything in \`csv_reader.cpp\`. Linked from \`libreaders.a\`, that object never joins the link, so \`registered\` never gets initialised. Inside a shared library the whole image is loaded and every initialiser runs, which is why the same code behaves differently in the two forms.

\`\`\`cmake
target_link_libraries(inventory PRIVATE
  "$<LINK_LIBRARY:WHOLE_ARCHIVE,readers>")   # CMake 3.24+
\`\`\`

That works, and it also drags in every unreferenced object you own. The version that survives review is an explicit \`registerBuiltinReaders()\` that \`main\` calls, because it fails loudly when someone forgets a line.

### Static and shared, side by side

| | Static (.a, .lib) | Shared (.so, .dylib, .dll) |
|---|---|---|
| At link | code copied into each binary | only a reference recorded |
| Ship a fix | rebuild every consumer | replace one file |
| Startup cost | none | loader resolves symbols |
| Duplicate symbols | link error | silently resolves to the first |

### Hidden by default, exported on purpose

On ELF every non static function is exported by default. Windows is the opposite: nothing is exported unless you mark it. Match the stricter model everywhere.

\`\`\`cmake
add_library(core SHARED src/item.cpp src/warehouse.cpp)
set_target_properties(core PROPERTIES
  CXX_VISIBILITY_PRESET hidden
  VISIBILITY_INLINES_HIDDEN ON)

include(GenerateExportHeader)
generate_export_header(core BASE_NAME INVENTORY)
\`\`\`

\`\`\`cpp
#include "inventory_export.h"

namespace inv {
class INVENTORY_EXPORT Warehouse {   // exported
public:
  int stock(std::string_view sku) const;
};
int checksum(std::string_view s);    // internal, stays hidden
}
\`\`\`

The macro expands to \`__attribute__((visibility("default")))\` on ELF and to \`__declspec(dllexport)\` or \`__declspec(dllimport)\` on Windows depending on whether you are building the library or consuming it. Measure the result:

\`\`\`bash
nm -C -D --defined-only build/libcore.so | wc -l
# 4812 before, 96 after
\`\`\`

A smaller dynamic symbol table means faster loading, smaller binaries, and a linker free to inline and devirtualise across your own code because it can now prove nothing outside will call it. It also stops a private helper becoming a de facto part of your interface just because somebody found it with \`nm\`.

### Make missing symbols a link error

\`\`\`cmake
target_link_options(core PRIVATE
  "$<$<PLATFORM_ID:Linux>:LINKER:--no-undefined>")
\`\`\`

By default a Linux shared library may leave symbols unresolved, on the theory that the executable will supply them. In practice it means a typo in a source file list turns into \`undefined symbol\` at \`dlopen\` time, in production, at 2am. Windows and macOS already refuse. Make Linux refuse too.

### Read the mangled name, do not guess

When it does happen, the error is not noise. It encodes the exact signature the caller wanted:

\`\`\`bash
c++filt _ZNK3inv9Warehouse5stockEPKc
# inv::Warehouse::stock(char const*) const
\`\`\`

The namespace, the parameter types and the trailing \`const\` are all encoded. Compare that against \`nm -C -D libcore.so\` and nine times in ten the library defines a function differing by exactly one qualifier, which tells you the consumer compiled against a different version of your header.

### Where the loader looks

Shipping \`libcore.so.1\` next to your executable does not make it findable. The loader searches the run path recorded in the binary, \`LD_LIBRARY_PATH\`, and the system cache built by \`ldconfig\`. The current directory is nowhere on that list.

\`\`\`cmake
set_target_properties(inventory PROPERTIES
  INSTALL_RPATH "$ORIGIN/../lib"
  BUILD_WITH_INSTALL_RPATH FALSE)
\`\`\`

\`$ORIGIN\` is expanded by the loader to the directory of the binary itself, so an installation tree stays relocatable. Telling users to export \`LD_LIBRARY_PATH\` is the shortcut that ends up pasted into every deployment script you own.
      `,
        [
          q('A reader registers itself with a namespace scope const bool in csv_reader.cpp. It works when the code is a shared library and silently does nothing when the same code is a static archive. Why?', [
            'Static archives strip namespace scope variables during archiving',
            'Namespace scope initialisers only run for code marked with the export macro',
            'The linker pulls an object out of an archive only if something references it',
            'Static libraries defer all initialisers until the first function call',
          ], 2, 'An archive is a bag of object files and the linker takes only those that resolve a needed symbol, so an object nobody references never enters the link and its initialisers never run.'),
          q('What is the main benefit of setting CXX_VISIBILITY_PRESET hidden and marking your public classes with an export macro?', [
            'It makes the shared library loadable without the dynamic loader',
            'It converts the shared library into a static archive at install time',
            'It stops consumers from including your public headers by accident',
            'The dynamic symbol table shrinks, so loading is faster and helpers stay private',
          ], 3, 'Exporting only what you intend cuts the dynamic symbol table dramatically, which speeds up loading, shrinks the binary, lets the linker optimise across your own code, and stops private helpers becoming part of your interface.'),
          q('A Linux shared library links without complaint but fails at dlopen with an undefined symbol. Which build setting would have turned that into a link error?', [
            'Passing --no-undefined to the linker for the shared library target',
            'Adding VISIBILITY_INLINES_HIDDEN ON to the target properties',
            'Building the library with -Wall -Wextra -Werror enabled',
            'Setting SOVERSION so the loader can pick the right file',
          ], 0, 'Linux allows a shared library to leave symbols unresolved on the assumption the executable supplies them, and --no-undefined makes the linker demand every symbol be resolved at build time instead of at load time in production.'),
        ]
      ),
      lesson('ABI Breakage and Versioning a Public Header', 14, `
You add one private member to a class, tag it \`1.4.1\`, and push the shared library to the internal artifact repository as a patch release. Nothing recompiles downstream, because patch releases do not need a rebuild. Within a day two services are crashing in destructors and one is returning garbage stock counts. The header compiled fine. The library linked fine. \`sizeof(Warehouse)\` went from 40 to 48, and every caller built against 1.4.0 still reserves 40.

### API break versus ABI break

An API break stops the compile. You see it immediately, you fix it, nobody suffers. An ABI break compiles, links, loads, and then corrupts memory. It is the more dangerous of the two precisely because every tool in your pipeline says yes.

| Change to an exported class | Safe for ABI |
|---|---|
| Add or reorder a data member | No |
| Add a virtual function anywhere | No |
| Add a non virtual member function | Yes |
| Add a default argument | No, it is baked into every call site |
| Change a parameter to \`const\` | No, the mangled name changes |
| Edit the body of an inline function | No, callers already copied the old one |
| Add a whole new class | Yes |

The default argument row surprises everyone. \`int stock(std::string_view sku, bool includeReserved = false)\` compiles the \`false\` into the caller, not the library, so changing the default changes nothing for anyone who does not rebuild.

### Pimpl buys you room to grow

\`\`\`cpp
// include/inv/warehouse.hpp
namespace inv {
class INVENTORY_EXPORT Warehouse {
public:
  explicit Warehouse(std::string name);
  ~Warehouse();                              // declared here, defined in the .cpp
  Warehouse(Warehouse&&) noexcept;
  Warehouse& operator=(Warehouse&&) noexcept;
  int stock(std::string_view sku) const;
private:
  struct Impl;
  std::unique_ptr<Impl> impl_;
};
}
\`\`\`

Now the object is one pointer wide forever. Add fields to \`Impl\` in the \`.cpp\` and no consumer notices. The price is one heap allocation per object and one indirection per call, which is nothing for a warehouse and unacceptable for a 3D vector, so apply it to your handful of public types and nothing else.

One rule catches people every time: the destructor must be declared in the header and defined in the \`.cpp\`, after \`Impl\` is complete. Omit it and the compiler generates \`~Warehouse\` in the consumer's translation unit, where \`std::unique_ptr<Impl>\` must delete an incomplete type. The error mentions \`static_assert\` and \`sizeof\`, and points at a line you did not write.

### Version the file, not just the tag

\`\`\`cmake
set_target_properties(core PROPERTIES VERSION 1.4.0 SOVERSION 1)
\`\`\`

That produces \`libcore.so.1.4.0\` plus a \`libcore.so.1\` symlink. Consumers record \`libcore.so.1\` as their dependency, so a 2.0.0 build with a different SONAME can be installed alongside instead of replacing it. Bump SOVERSION on every ABI break, and treat the major version as an ABI number rather than a marketing number.

### Let a tool decide, not a reviewer

\`\`\`bash
abidiff --headers-dir1 baseline/include --headers-dir2 include \\
        baseline/libcore.so build/libcore.so
\`\`\`

Run that in CI against the last released artifact. It reads DWARF, compares layouts and vtables, and fails the build on exactly the changes the table above calls unsafe. Reviewers miss added members. \`abidiff\` does not.

If you ship binaries to teams on other toolchains, keep \`std::string\`, \`std::vector\` and every other standard library type out of the exported signatures. GCC 5 split \`std::string\` into two incompatible layouts behind \`_GLIBCXX_USE_CXX11_ABI\`, and codebases were still tripping over that mismatch years later.
      `,
        [
          q('A private std::chrono time point is added to an exported class and shipped as a patch release of the shared library. Consumers are not rebuilt. What happens?', [
            'The dynamic loader detects the size change and refuses to load the library',
            'Callers still use the old object size, so memory is corrupted at runtime',
            'Consumers get a link error naming the new member',
            'Nothing, because private members are never part of the compiled layout',
          ], 1, 'Adding a data member changes sizeof and every member offset, but callers compiled against the old header keep allocating and indexing with the old layout, which compiles and links cleanly and then corrupts memory.'),
          q('A pimpl class holds std::unique_ptr<Impl> and does not declare a destructor. What goes wrong?', [
            'The Impl allocation leaks because unique_ptr cannot see the deleter',
            'Move assignment is deleted, so the class cannot be returned from a factory',
            'The class becomes larger than one pointer, defeating the purpose',
            'The destructor is generated where Impl is incomplete, so the delete fails to compile',
          ], 3, 'Without a declared destructor the compiler emits one in the consumer\'s translation unit, where Impl is only forward declared, and unique_ptr refuses to delete an incomplete type.'),
          q('Why does changing a function\'s default argument from false to true count as an ABI break?', [
            'Default arguments are stored in the vtable and shift its layout',
            'Adding a default argument changes the mangled name of the function',
            'The default is compiled into every call site, so old callers keep the old value',
            'The compiler generates an extra overload that the old library does not export',
          ], 2, 'A default argument is substituted by the compiler at the call site rather than stored in the library, so code that is not rebuilt keeps passing the old value regardless of what the header now says.'),
        ]
      ),
      lesson('Packaging: install, export, and Cross Compiling', 13, `
A user runs \`find_package(Inventory REQUIRED)\` and CMake answers "Could not find a package configuration file". You fix that, they try again, and the configure now fails with an include path of \`/home/you/dev/inventory/include\`, a directory that exists on precisely one laptop. Installing is not \`install(FILES)\` plus hope. It is describing your target twice: once for the build tree, once for wherever it lands.

### Two answers to "where are your headers"

\`\`\`cmake
include(GNUInstallDirs)

target_include_directories(core PUBLIC
  $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/include>
  $<INSTALL_INTERFACE:\${CMAKE_INSTALL_INCLUDEDIR}>)
\`\`\`

The first line applies while you build inside this project. The second is what gets written into the exported package, relative to wherever the user installed it. Write a bare path instead and CMake records an absolute build tree path in the exported file, which is the failure above. \`GNUInstallDirs\` matters too: \`CMAKE_INSTALL_LIBDIR\` is \`lib\` on Debian and \`lib64\` on Fedora, and hardcoding either one breaks half your users.

### Install, export, configure

\`\`\`cmake
install(TARGETS core EXPORT InventoryTargets
        RUNTIME DESTINATION \${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
        ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR})
install(DIRECTORY include/ DESTINATION \${CMAKE_INSTALL_INCLUDEDIR})

install(EXPORT InventoryTargets
        NAMESPACE Inventory::
        DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/Inventory)

include(CMakePackageConfigHelpers)
write_basic_package_version_file(InventoryConfigVersion.cmake
        VERSION \${PROJECT_VERSION} COMPATIBILITY SameMajorVersion)
configure_package_config_file(cmake/InventoryConfig.cmake.in
        InventoryConfig.cmake
        INSTALL_DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/Inventory)
\`\`\`

\`\`\`cmake
# cmake/InventoryConfig.cmake.in
@PACKAGE_INIT@
include(CMakeFindDependencyMacro)
find_dependency(fmt 10)
include("\${CMAKE_CURRENT_LIST_DIR}/InventoryTargets.cmake")
check_required_components(Inventory)
\`\`\`

Drop the \`find_dependency\` line and everything works on your machine, because \`fmt\` is already a target in your build. A consumer who has never heard of \`fmt\` gets an error naming a target they did not ask for. Your package must find your own dependencies again on their side.

The \`Inventory::\` namespace is not decoration. A target name containing \`::\` must resolve to a real imported target, so a typo fails at configure time with a clear message. Without it, \`target_link_libraries(app PRIVATE Inventry)\` is treated as a raw library name and surfaces as \`cannot find -lInventry\` at link time.

### Cross compiling is a separate world, declared up front

\`\`\`cmake
# cmake/aarch64-linux.cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)
set(CMAKE_CXX_COMPILER aarch64-linux-gnu-g++)
set(CMAKE_SYSROOT /opt/sysroots/aarch64)
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
\`\`\`

Pass it as \`cmake -S . -B build-arm -DCMAKE_TOOLCHAIN_FILE=cmake/aarch64-linux.cmake\`. Setting \`CMAKE_SYSTEM_NAME\` is what flips CMake into cross compiling mode, which disables \`try_run\` checks that would need to execute an ARM binary on your x86 machine. The \`FIND_ROOT_PATH_MODE\` lines stop \`find_package\` from cheerfully handing you the host's \`/usr/lib/libssl.so\`, a mistake that shows up as an architecture mismatch deep in the link, long after the configure said everything was fine.

### The only test that catches package bugs

\`\`\`bash
cmake -S . -B build -DCMAKE_INSTALL_PREFIX=/tmp/stage
cmake --build build --target install
cmake -S examples/consumer -B build-consumer -DCMAKE_PREFIX_PATH=/tmp/stage
cmake --build build-consumer
\`\`\`

Four lines in CI, building a throwaway consumer against the staged install. Unit tests never touch the exported package, so this is the only thing standing between you and the bug report that says your library does not install.

Two details in that block earn their keep. \`COMPATIBILITY SameMajorVersion\` makes \`find_package(Inventory 1.4 REQUIRED)\` accept 1.6.2 and reject 2.0.0, which matches the SOVERSION rule from the previous topic. And a project that also builds a code generator has to build it twice when cross compiling, once for the host so it can actually run during the build, once for the target if it ships. A single build tree cannot do both, so the usual shape is a host build in \`build-host\` whose executable path is passed into the target configure.

Package managers sit on top of all of this rather than replacing it. Both vcpkg and Conan expect a project that installs a working CMake package, so the work above is what makes your library packageable at all.
      `,
        [
          q('An installed CMake package makes consumers fail with an include path pointing at the maintainer\'s home directory. What was omitted?', [
            'The GNUInstallDirs module, which normalises lib and lib64 paths',
            'The NAMESPACE argument on install(EXPORT), which rewrites paths',
            'The COMPATIBILITY setting on the generated version file',
            'BUILD_INTERFACE and INSTALL_INTERFACE around the include directories',
          ], 3, 'Without those generator expressions CMake records the source tree path in the exported target file, so the package describes a directory that exists only on the machine that built it.'),
          q('Your library links fmt privately in your own build, and your generated Config file does not call find_dependency(fmt). What does a consumer see?', [
            'An error about an fmt target they never asked for and cannot resolve',
            'Nothing, because a private dependency is fully absorbed at build time',
            'A warning that fmt was found in a different version than expected',
            'A configure failure saying the Inventory package version is incompatible',
          ], 0, 'The exported target file still names the fmt target it was linked against, so unless your Config file finds that dependency again on the consumer\'s machine, CMake reports an unresolved target they have no context for.'),
          q('In a cross compiling toolchain file, why set CMAKE_FIND_ROOT_PATH_MODE_LIBRARY to ONLY?', [
            'It forces static linking so the target device needs no shared libraries',
            'It restricts find_package to the sysroot instead of the host\'s own libraries',
            'It makes CMake skip library searches entirely and trust the compiler',
            'It tells the linker to search only directories listed in CMAKE_PREFIX_PATH',
          ], 1, 'Without it, find_package happily returns host libraries built for the wrong architecture, and the mismatch only surfaces as a confusing link failure long after configure reported success.'),
        ]
      ),
      ],
      [
      q('You must ship a prebuilt shared library to teams using several toolchains. Which interface choice most reduces the risk of a runtime mismatch?', [
        'Compile the library with -O2 so all consumers get the same optimisation',
        'Mark every exported function inline so callers get their own copy',
        'Keep std::string and std::vector out of exported signatures',
        'Ship a static archive alongside so consumers can pick either form',
      ], 2, 'Standard library types have different layouts across implementations and even across versions of one implementation, as the GCC 5 std::string split showed, so keeping them out of the exported interface removes the largest source of silent mismatch.'),
      q('A build works on Linux and Windows but a shared library on Linux fails at load, while the same missing symbol was caught at link time on Windows. Which difference explains it?', [
        'ELF allows unresolved symbols in a shared library by default',
        'Windows resolves all symbols lazily and reports them earlier',
        'MSVC statically links the standard library into every binary',
        'The Linux loader ignores the SONAME recorded in the executable',
      ], 0, 'A Linux shared library may leave symbols for the executable to supply, so undefined names survive until load, whereas Windows requires everything to resolve when the DLL is linked.'),
      q('Which change to a released library requires bumping SOVERSION rather than just the patch number?', [
        'Adding a new free function in the same namespace',
        'Adding a new class that no existing type references',
        'Fixing a loop bound inside an already compiled .cpp file',
        'Adding a virtual function to an exported base class',
      ], 3, 'A new virtual function changes the vtable layout, so any consumer or derived class compiled against the old header dispatches through the wrong slot, which is exactly the kind of break SOVERSION exists to signal.'),
      q('Which CI step is most likely to catch a broken installed package before a user does?', [
        'Running the unit test suite under AddressSanitizer on every push',
        'Installing to a staging prefix and building a small consumer against it',
        'Compiling the library on GCC, Clang and MSVC in the same job',
        'Running abidiff against the previously released shared library',
      ], 1, 'Unit tests build inside your own tree and never exercise the exported Config and Targets files, so only a throwaway consumer project configured against a staged install proves that find_package actually works.'),
      ]
    ),
    chapter(
      'Memory Safety, Hardening, and Legacy Code',
      'Making old C++ safe against untrusted input and hostile users, and modernising it incrementally while it stays in production.',
      [
      lesson('The Attack Surface: Untrusted Input and Exploitable UB', 13, `
A media service ran for three years before someone sent it a frame header claiming a payload of 4294967290 bytes. The parser trusted the number. Ninety seconds later the attacker had a shell on the box.

Nothing in that parser was exotic. It was four lines that any review would have waved through.

### Where your bytes stop being yours

Draw the trust boundary explicitly, in the code and on the whiteboard. Everything on one side is data your process produced. Everything on the other side was chosen by someone who wants your process: network frames, uploaded files, filenames, environment variables, the output of a subprocess, a cached blob written by an older version of yourself.

Here is the shape that keeps showing up:

\`\`\`cpp
struct Header { std::uint32_t magic; std::uint32_t len; };

std::vector<std::byte> body(std::span<const std::byte> in) {
    Header h{};
    std::memcpy(&h, in.data(), sizeof h);          // in may hold three bytes
    return {in.begin() + sizeof h,
            in.begin() + sizeof h + h.len};        // h.len is whatever they sent
}
\`\`\`

Two bugs. The \`memcpy\` reads eight bytes from a buffer that may be shorter than eight. The iterator arithmetic runs off the end, and where \`sizeof h + h.len\` is computed in 32 bits it wraps to a small number, so the length check somebody adds next month passes.

### Check by subtraction, never by addition

\`\`\`cpp
constexpr std::size_t kMaxFrame = 1u << 20;

std::optional<std::span<const std::byte>> body(std::span<const std::byte> in) {
    if (in.size() < sizeof(Header)) return std::nullopt;
    Header h{};
    std::memcpy(&h, in.data(), sizeof h);
    h.len = ntohl(h.len);
    if (h.len > kMaxFrame) return std::nullopt;                    // cap first
    if (h.len > in.size() - sizeof(Header)) return std::nullopt;   // cannot wrap
    return in.subspan(sizeof(Header), h.len);
}
\`\`\`

\`in.size() - sizeof(Header)\` is safe only because the first check already proved the buffer is at least that long. That ordering is the whole trick. \`offset + len > size\` is the shape to grep for and delete: rewrite every one as \`len > size - offset\` behind a proven \`offset <= size\`.

### Why undefined behaviour turns into a shell

A stack buffer overflow does not just corrupt a neighbour. It reaches the saved return address, and the attacker picks where the function returns. A heap use after free is better still from their side: they spray objects of the right size, land one where the freed object was, and the next virtual call reads a vtable pointer they control. Undefined behaviour is not "wrong answer". It is a promise you broke, and they get to choose the consequence.

| Input class | Classic bug | What stops it |
|---|---|---|
| Length prefixed frame | wrap in \`offset + len\` | cap, then compare by subtraction |
| Text field copied to a fixed array | stack buffer overflow | \`std::string\` sized from the checked length |
| Index supplied by the client | out of bounds \`operator[]\` | \`.at()\`, or an explicit range check |
| Struct cast over a raw buffer | padding, alignment, byte order | field by field deserialisation |
| Object reused on an error path | use after free | one owner, RAII release (Chapter 3) |

### The bug that hides from your tools

Signed overflow is undefined, and UBSan reports it. Unsigned overflow is fully defined, wraps quietly, and UBSan says nothing at all unless you ask:

\`\`\`bash
clang++ -fsanitize=undefined,unsigned-integer-overflow \\
        -fno-sanitize-recover=all -O1 -g src/frame.cpp
\`\`\`

Almost every wraparound bug in a parser lives in \`std::size_t\` or \`std::uint32_t\` arithmetic, which is exactly the case a default UBSan build ignores. Turn the check on for the parsing translation units, then silence the deliberate wrapping in hash and checksum code with \`__attribute__((no_sanitize("unsigned-integer-overflow")))\` rather than turning the check back off.

The other hiding place is the error path. It is reached by the fuzzers from Chapter 7 and by almost no hand written test, and it is where the double frees live.
      `,
        [
          q('A parser checks `if (offset + len > buffer.size()) return error;` where offset and len are 32 bit values read straight off the wire. Why can a hostile input pass this check?', [
            'buffer.size() returns a signed type, so the comparison is undefined',
            'The check runs before offset has been validated as an index',
            'The unsigned addition wraps past the maximum and yields a small sum',
            'Both sides are promoted to int, which truncates the larger value',
          ], 2, 'Unsigned addition wraps rather than overflowing, so a huge offset plus a huge len produces a tiny result that passes the test, and the copy that follows runs off the end of the buffer.'),
          q('You build the frame parser with -fsanitize=undefined and it reports nothing, yet a crafted 12 byte frame corrupts the heap. What is the most likely reason?', [
            'The arithmetic is unsigned, which wraps by definition, so UBSan stays silent unless unsigned-integer-overflow is enabled',
            'UBSan only instruments code compiled at -O0, and the parser was built at -O2',
            'UBSan cannot see through memcpy, so no buffer arithmetic is instrumented',
            'The corruption happens on a worker thread, and UBSan watches only the main thread',
          ], 0, 'Unsigned wraparound is well defined behaviour, so it is not part of the default UBSan check set even though it is the single most common cause of a length check failing to hold.'),
          q('What is the strongest reason to deserialise a wire header field by field instead of memcpy-ing it into a struct?', [
            'memcpy of a whole struct is slower than assigning each member',
            'The compiler is free to reorder the members of a standard layout struct',
            'AddressSanitizer cannot instrument a struct copy at all',
            'Padding, alignment and byte order need not match what is on the wire',
          ], 3, 'The wire format has a fixed layout that your compiler never promised the struct would match, so reading each field explicitly is the only portable and checkable way to interpret the bytes.'),
        ]
      ),
      lesson('Hardened Builds and Static Analysis at Scale', 13, `
Two binaries, same source file. One was built with \`-O2\` and nothing else, and a crafted 300 byte request overwrote a return address and ran attacker bytes. The other added six flags, cost 1.4% throughput, and answered the same request with \`*** stack smashing detected ***\` and an abort.

Hardening does not remove the bug. It changes who decides what happens next.

### The flags that pay for themselves

| Flag | What it turns into a crash | Typical cost |
|---|---|---|
| \`-fstack-protector-strong\` | overflow reaching a saved return address | under 1% |
| \`-D_FORTIFY_SOURCE=3\` | \`memcpy\` or \`sprintf\` past a known object size | under 1% |
| \`-fstack-clash-protection\` | a huge frame skipping the guard page | negligible |
| \`-fcf-protection=full\` | an indirect jump to a non entry address | 1% to 2% |
| \`-Wl,-z,relro,-z,now\` | a GOT overwrite after startup | slower start |
| \`-fPIE -pie\` | fixed addresses for the attacker to aim at | 0% to 3% |
| \`-D_GLIBCXX_ASSERTIONS\` | out of range \`operator[]\`, bad iterator pairs | 1% to 5% |

Put them in one interface target so nothing can be built without them by accident:

\`\`\`cmake
add_library(hardening INTERFACE)
target_compile_options(hardening INTERFACE
  -O2 -fstack-protector-strong -fstack-clash-protection -fcf-protection=full)
target_compile_definitions(hardening INTERFACE _FORTIFY_SOURCE=3 _GLIBCXX_ASSERTIONS)
target_link_options(hardening INTERFACE -Wl,-z,relro,-z,now -Wl,-z,noexecstack)
\`\`\`

Two traps live in that block.

**\`_FORTIFY_SOURCE\` does nothing at \`-O0\`.** It needs the optimiser's object size analysis to know how big the destination is. A team that ships a debug build to one customer ships an unfortified binary and is never warned. Verify the artefact rather than the flag list: \`checksec --file=build/app\` prints what actually landed in the ELF.

**\`_GLIBCXX_ASSERTIONS\` must be defined for every translation unit in the process, static libraries included.** It changes the definitions of inline container members, so a mixed build is an ODR violation (Chapter 1), and across a shared library boundary it is an ABI mismatch (Chapter 11). Define it everywhere or nowhere. libc++ spells it \`_LIBCPP_HARDENING_MODE=_LIBCPP_HARDENING_MODE_FAST\` and has the same rule.

Sanitizers are not hardening. AddressSanitizer roughly doubles cost, keeps a shadow map an attacker can aim at, and belongs in CI. Hardening is what you ship.

### Static analysis when the tree is 900k lines

Switch clang-tidy on across a mature codebase and you get 40,000 findings, and by Wednesday nobody opens the report. Analyse the diff instead:

\`\`\`bash
cmake -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
git diff -U0 origin/main | clang-tidy-diff.py -p1 -path build
\`\`\`

Four rules make it stick:

- Start with \`bugprone-*\`, \`cert-*\` and \`clang-analyzer-*\`. Leave \`readability-*\` off until the noise is under control, because a naming complaint sitting next to a use after free teaches people to skim both.
- Ratchet rather than sprint. New code must be clean, old code is frozen at today's count, and the count may only fall. A committed baseline makes that mechanical.
- Fail the build on the checks you have actually cleaned. A warning nobody can fail on is a comment.
- Generate \`compile_commands.json\` from CMake. Without the real flags the analyser sees a different program than the compiler does.

The highest ratio of real bugs to noise on legacy C++ comes from \`bugprone-use-after-move\`, \`bugprone-sizeof-expression\`, \`bugprone-signed-char-misuse\`, \`cppcoreguidelines-pro-type-member-init\` and \`clang-analyzer-core.NullDereference\`.

One number to stay honest about: the frame length bug from the previous topic passes every check listed above. Reading a length out of a buffer and believing it is legal C++ that means exactly what it says.
      `,
        [
          q('Your release pipeline compiles with -D_FORTIFY_SOURCE=3, but one customer build is produced at -O0. What actually changes?', [
            'The define is rejected and the compiler stops with a diagnostic',
            'Fortification is silently inactive, because it depends on the optimiser to size objects',
            'Fortification still runs but downgrades every overflow to a warning',
            'The define switches to slower runtime checks that are stricter than usual',
          ], 1, 'The object size builtins that fortification relies on are only computed when the optimiser runs, so an unoptimised build gets no checks and no warning that they are missing.'),
          q('A team defines _GLIBCXX_ASSERTIONS for the application but not for the shared library it links against. What is the real risk?', [
            'The library\'s containers stay unchecked, which is only a missed opportunity',
            'The linker reports duplicate symbols and the build stops early',
            'Assertions fire inside the application even where the indices are valid',
            'Inline container members now differ between the two, an ODR and ABI mismatch',
          ], 3, 'The macro changes the definitions of inline members, so two translation units disagree about the same function, which is undefined behaviour rather than a partially hardened build.'),
          q('Why run clang-tidy against the pull request diff rather than the whole repository on day one?', [
            'A mature tree yields tens of thousands of findings, and a report nobody reads gates nothing',
            'clang-tidy cannot analyse more than a few hundred files in a single run',
            'A whole repository run needs a compilation database, whereas a diff run does not',
            'Findings in files nobody touched are false positives by construction',
          ], 0, 'A gate only works if someone acts on it, so limiting the analysis to changed lines keeps the signal small enough to fix while the old count is ratcheted down separately.'),
        ]
      ),
      lesson('Modernising in Place: Seams, Strangling, and Standard Upgrades', 14, `
A billing engine: 380,000 lines, C++03 idioms throughout, a release every two weeks, and a test suite that covered the reporting module and nothing else. The team proposed an eighteen month rewrite. It was cancelled at month eleven, because the old system had shipped 340 changes in the meantime and the new one had absorbed none of them.

The approach that worked took about the same eighteen months and never stopped shipping.

### Move the compiler before you move the standard

Two separate steps, each releasable on its own.

1. Build the existing code with the new compiler at the old standard: \`g++-13 -std=c++03\`. Fix the new warnings. Ship it.
2. Raise the standard one step at a time, 03 to 11 to 14 to 17 to 20. Ship each step.

Do both at once and a behaviour change has two possible causes. \`git bisect\` (Chapter 7) can no longer tell you which half broke it.

Each step quietly removes something:

| Step | What changes under you |
|---|---|
| 03 to 11 | \`auto\` stops meaning storage class, \`>>\` closes two templates, braces reject narrowing |
| 11 to 14 | mostly additive, but \`gets\` is gone and a \`constexpr\` member is no longer implicitly \`const\` |
| 14 to 17 | \`auto_ptr\`, \`random_shuffle\`, \`bind1st\`, \`register\` and \`throw(T)\` are all removed |
| 17 to 20 | \`u8"x"\` becomes \`char8_t\`, and rewritten comparisons can make an existing \`operator==\` ambiguous |

### A seam is where you change behaviour without editing the code around it

C++ gives you three cheap ones: a virtual call, a template parameter, and the linker. Find a seam, put a test around the old behaviour, then change the inside.

\`\`\`cpp
class Session {
    Buffer* buf_;
public:
    Session() : buf_(new Buffer(4096)) {}
    ~Session() { delete buf_; }
    Session(const Session& o);            // 200 lines away, and subtly wrong
};
\`\`\`

\`\`\`cpp
class Session {
    std::unique_ptr<Buffer> buf_ = std::make_unique<Buffer>(4096);
public:
    Session() = default;                  // rule of zero, Chapter 2
};
\`\`\`

That second version is not a pure refactor, and pretending otherwise is how these changes go wrong. \`Session\` was copyable and is now move only, so every call site that copied one stops compiling. Good. The ones that copied by accident, through a \`std::vector<Session>\` reallocation, are the reason the hand written copy constructor existed and the reason it was wrong.

Before touching any of it, pin the current behaviour:

\`\`\`cpp
TEST(Invoice, MatchesLegacyOutput) {
    auto out = renderInvoice(loadFixture("fixtures/2019-06-legacy.json"));
    EXPECT_EQ(out, readFile("fixtures/2019-06-legacy.expected.txt"));
}
\`\`\`

A characterisation test asserts what the code does today, bugs included. It is not a specification, it is a tripwire. Generate the expected file from the current binary, read it once to confirm it is not obviously insane, and commit it.

### Strangle the old module, do not replace it

New work goes into a new target built at C++20 with \`-Wall -Wextra -Werror\` and the hardening interface from the previous topic. The old target keeps its old flags. One header declares the boundary between them, routes move across one at a time, and nothing is deleted until its replacement has carried real traffic for a full release.

Automate the mechanical half and keep it in its own commit:

\`\`\`bash
run-clang-tidy -p build -checks='-*,modernize-use-override,modernize-use-nullptr' \\
               -fix src/billing/
git commit -am "mechanical: clang-tidy override and nullptr across src/billing"
\`\`\`

The commit that kills these projects is the "while I am in here" commit: a loop converted to a range for, a \`new\` turned into \`make_unique\`, and one condition inverted because it looked wrong. Six weeks later a customer reports a wrong total, and nobody can say which of the three did it.
      `,
        [
          q('Why upgrade the compiler while staying on the old -std value, and only then raise the standard?', [
            'New compilers stop accepting an old standard flag once a newer one exists',
            'Raising the standard requires the newer compiler, so the order saves a build',
            'It splits two sources of behaviour change into separate, bisectable releases',
            'Warning levels are only stable within a single language standard',
          ], 2, 'If a regression appears after a combined jump you cannot tell whether the compiler or the language rules caused it, whereas two shipped steps leave git bisect able to name the culprit.'),
          q('A Session class holding a raw owning Buffer* is changed to hold a std::unique_ptr<Buffer>. What should you expect at the call sites?', [
            'Nothing, because unique_ptr is a drop in replacement for an owning raw pointer',
            'Code that copies a Session stops compiling, because the class is now move only',
            'Copies of Session start doing deep copies of the buffer rather than shallow ones',
            'Session becomes non movable too, so it can no longer be held in a vector',
          ], 1, 'unique_ptr deletes the copy operations, so every place that copied a Session now fails to build, which surfaces exactly the sharing the hand written copy constructor was papering over.'),
          q('What is a characterisation test for when you start modernising an untested legacy module?', [
            'Proving the new implementation matches the documented specification',
            'Measuring how long the legacy path takes before you optimise it',
            'Checking that the legacy module still compiles under the newer standard',
            'Pinning what the code does today, bugs included, so a refactor cannot change it',
          ], 3, 'You have no specification to test against, so the current output becomes the reference and any refactor that alters it has changed behaviour rather than structure.'),
        ]
      ),
      lesson('Living Beside Rust: Safe Boundaries and What to Rewrite', 13, `
Android's published vulnerability figures make an argument almost nobody predicted. Around three quarters of its severe vulnerabilities in 2019 were memory safety bugs. By 2024 that share had fallen below a quarter. The old C++ was not rewritten. It was largely left alone while new code went into Rust, and code that stops changing accumulates fewer new bugs every year.

So the strategy is not "rewrite it". It is: stop the bleeding at the new code, and rewrite only the old code that reads hostile bytes.

### Rank the candidates honestly

| Component | Untrusted input | Churn | Rewrite? |
|---|---|---|---|
| Container format parser | yes | high | first |
| TLS record framing | yes | medium | yes |
| Image decoder | yes | low | yes, and fuzz both versions |
| SIMD colour conversion kernel | no | low | no |
| Template heavy config layer | no | medium | no, the bridge costs more than the risk |

Parsers of attacker chosen bytes are where memory unsafety becomes an incident. A numerical kernel with no untrusted input gains nothing and loses its intrinsics, its tuning and its tests.

### The boundary is C, whatever the tools look like

\`extern "C"\` is the only ABI the two languages agree on (Chapter 11). No \`std::string\`, no \`std::vector\`, no templates, no exceptions cross it. You have two ways to build the bridge: \`bindgen\` and \`cbindgen\` generate raw declarations and leave the \`unsafe\` glue to you, or \`cxx\` takes one shared declaration and generates a checked bridge for both sides.

\`\`\`rust
// src/ffi.rs
#[cxx::bridge(namespace = "media")]
mod ffi {
    struct FrameInfo { width: u32, height: u32, keyframe: bool }
    extern "Rust" {
        fn parse_header(bytes: &[u8]) -> Result<FrameInfo>;
    }
}
\`\`\`

\`\`\`cpp
#include "media/src/ffi.rs.h"

std::optional<media::FrameInfo> header(std::span<const std::uint8_t> in) {
    try {
        return media::parse_header(rust::Slice<const std::uint8_t>{in.data(), in.size()});
    } catch (const rust::Error&) {        // a Rust Result arrives as an exception
        return std::nullopt;
    }
}
\`\`\`

A \`Result\` surfaces in C++ as a thrown \`rust::Error\`, so catch it at the boundary. A panic is a different animal: let one unwind into C++ frames and the behaviour is undefined, so build the crate with \`panic = "abort"\` and treat the abort as the crash it is.

### Four rules that stop the bridge becoming the bug

1. **Whoever allocates frees.** Hand C++ an opaque handle plus a matching \`release\` function. Never let Rust rebuild a \`Box\` from a pointer \`new\` produced, and never \`delete\` a pointer Rust allocated. A mismatched pair corrupts both heaps at once.
2. **A pointer never travels without its length.** \`slice::from_raw_parts(p, n)\` with the wrong \`n\` is undefined behaviour in Rust exactly as it is in C++. Safety is not inherited across the boundary.
3. **Keep it narrow.** Six functions carrying plain data are auditable in an afternoon. Sixty functions sharing mutable state are a new attack surface written in two languages.
4. **Nothing throws and nothing panics across.** Mark the C++ entry points \`noexcept\` and convert to an error code, or you unwind through a frame that has no idea how to clean itself up.

### What does not change

The C++ side still needs the length checks and the hardening flags from the earlier topics, because the Rust side trusts the slice you hand it. A length miscomputed in C++ produces a memory safety bug inside safe Rust, and the crash report will point at the wrong file.

Fuzz the pair, not the halves. The harness shape from Chapter 7 drives \`parse_header\` through the C++ entry point, so the target under test is the bridge as well as the parser, which is where the interesting bugs turn out to live.
      `,
        [
          q('A Rust crate reached through an FFI boundary panics inside a bridge function. What is the correct configuration and why?', [
            'Build with panic = abort, because unwinding a panic into C++ frames is undefined',
            'Catch the panic as a std::exception in C++ and convert it to an error code',
            'Return a Result from every bridge function so panics become recoverable',
            'Mark each C++ call site noexcept so the panic is turned into a return value',
          ], 0, 'The two languages do not share an unwinding contract, so a panic crossing into C++ frames is undefined behaviour, and aborting converts it into an immediate crash you can diagnose.'),
          q('Which component of a media service is the best first candidate for a Rust rewrite?', [
            'The SIMD colour conversion kernel, which dominates the CPU profile',
            'The templated configuration layer, which is the hardest C++ in the tree',
            'The container format parser, which reads bytes chosen by whoever uploads',
            'The logging subsystem, which every other module already depends on',
          ], 2, 'Memory safety bugs become incidents where attacker chosen bytes are interpreted, so a parser fed by uploads buys far more risk reduction per line rewritten than hot arithmetic does.'),
          q('C++ computes a length, then passes a pointer and that length into safe Rust via slice::from_raw_parts. The length is one element too large. What happens?', [
            'Rust bounds checks catch the extra element and the call returns an error',
            'The slice is already invalid, so even safe Rust reading it is undefined behaviour',
            'The extra element reads as zero, since Rust zero initialises slice memory',
            'The bridge rejects the call, because cxx validates every slice length it sees',
          ], 1, 'Constructing the slice is the unsafe step and its precondition was broken on the C++ side, so every later read is undefined even though the code performing it is written in safe Rust.'),
        ]
      ),
      ],
      [
      q('A service parses a length prefixed frame with `if (hdr.len + 8 > buf.size()) return error;`. Which change actually closes the hole?', [
        'Byte swap the length with ntohl before comparing it',
        'Add -fstack-protector-strong so the overflow aborts instead',
        'Wrap the copy in a try block and catch std::length_error',
        'Cap hdr.len, prove buf.size() >= 8, then compare by subtraction',
      ], 3, 'The addition can wrap to a small value and pass, so the fix is to bound the length first and then compare against a size already proven large enough to subtract from.'),
      q('Which statement correctly separates sanitizers from hardening flags?', [
        'Sanitizers are test tools with a large cost; hardening ships in the release binary',
        'Sanitizers belong in release, while hardening flags are for the debug build',
        'Both are test only, and neither belongs in a binary you distribute',
        'Both ship together, since ASan removes the need for a stack protector',
      ], 0, 'AddressSanitizer roughly doubles cost and adds exposure of its own, so it stays in CI, while the hardening flags are cheap enough to run in production, which is the only place they help.'),
      q('A 380,000 line C++03 codebase has to reach C++20 while continuing to ship. What sequencing keeps failures attributable?', [
        'Set -std=c++20 first, then upgrade the compiler once the code compiles again',
        'Upgrade the compiler at C++03, ship, then raise the standard one step per release',
        'Upgrade compiler and standard together, and hold one long stabilisation branch',
        'Rewrite the untested modules first, then upgrade everything in one release',
      ], 1, 'Each shipped step introduces exactly one source of behaviour change, so a regression can be bisected to the compiler or to a specific standard bump rather than to both at once.'),
      q('What does Android\'s memory safety data suggest about an existing C++ codebase?', [
        'Rewriting the largest modules first produced most of the reduction',
        'The reduction came from static analysis applied across the old code',
        'Writing new code in a safe language cut the share of memory bugs without a rewrite',
        'Memory bugs fell because the old code was deleted module by module',
      ], 2, 'The share of memory safety vulnerabilities fell while the old C++ was largely left in place, because new code moved to a safe language and code that stops changing gains fewer new bugs.'),
      ]
    ),
  ],
  final: [
    q('You add a destructor to a class purely to log on teardown. What silently changes?', [
      'Nothing observable',
      'Copy operations are deleted',
      'The compiler stops generating move operations, so the class copies where it used to move',
      'The class becomes abstract',
    ], 2, 'Declaring a destructor suppresses the implicit move constructor and move assignment, and copies are used instead.'),
    q('Which single rule best summarises modern C++ resource management?', [
      'Every resource is owned by an object whose destructor releases it',
      'Always pair each new with exactly one delete',
      'Allocate on the heap so lifetimes are flexible',
      'Use shared_ptr for everything to be safe',
    ], 0, 'RAII ties release to scope exit, which is the only approach that survives early returns and exceptions.'),
    q('makeShape() returns std::unique_ptr<Shape> holding a Circle. What must Shape declare for deletion to be correct?', [
      'A copy constructor',
      'A protected destructor',
      'An overloaded operator new',
      'A virtual destructor',
    ], 3, 'Deleting a derived object through a base pointer is undefined behaviour unless the base destructor is virtual.'),
    q('What does std::move do at runtime?', [
      'Transfers the object to the destination',
      'Nothing — it is a cast to an rvalue reference that selects a move overload',
      'Frees the source object',
      'Copies the object and then destroys the original',
    ], 1, 'std::move generates no code; the actual stealing happens in the move constructor or move assignment it enables.'),
    q('Why does removing elements need v.erase(std::remove(...), v.end()) rather than std::remove alone?', [
      'Algorithms operate on iterators and cannot change a container size',
      'std::remove is deprecated',
      'erase is faster than remove',
      'std::remove only works on sorted ranges',
    ], 0, 'remove just partitions the survivors to the front and returns the new end; the container must drop the tail itself.'),
    q('Two Node objects hold shared_ptrs to each other and then go out of scope. What happens?', [
      'Both are destroyed normally',
      'The program crashes during destruction',
      'Both leak, because reference counting cannot break a cycle',
      'The compiler rejects the recursive type',
    ], 2, 'Each node keeps the other alive, so one of the links must be a weak_ptr for the counts to reach zero.'),
    q('Which parameter type reads a large std::string without copying and requires the argument to exist?', [
      'std::string s',
      'const std::string& s',
      'std::string&& s',
      'const std::unique_ptr<std::string>& s',
    ], 1, 'A const lvalue reference binds without copying and, unlike a pointer, cannot be null.'),
    q('for (auto row : table) where table is a std::vector<std::string> is', [
      'the recommended form for reading elements',
      'required in order to modify each row',
      'faster than binding a reference',
      'copying every string; use const auto& unless you need a copy',
    ], 3, 'auto strips the reference, so each iteration heap-allocates a fresh copy of the element.'),
    q('counts[key] on a std::map<std::string,int> where key is absent', [
      'default-constructs and inserts an entry, changing the map',
      'throws std::out_of_range',
      'returns an end iterator',
      'is a compile error on a non-const map',
    ], 0, 'operator[] value-initialises and inserts missing keys, which is why read-only lookups should use find, at or contains.'),
    q('target_include_directories(core PUBLIC include) means', [
      'only core itself can include those headers',
      'the directory is added to every target in the project',
      'anything linking core also gets include/ on its include path',
      'the headers are copied into the build directory',
    ], 2, 'PUBLIC usage requirements are applied to the target and propagated to every consumer that links it.'),
    q('Which type joins its thread in its own destructor, making a threaded function exception-safe?', [
      'std::thread with detach() called on it',
      'std::future',
      'std::packaged_task',
      'std::jthread',
    ], 3, 'A joinable std::thread destructor calls std::terminate, so jthread is RAII applied to thread lifetime.'),
    q('transfer(a, b) locks a then b while transfer(b, a) locks b then a, and the program hangs. What fixes it?', [
      'Give every account a std::recursive_mutex',
      'Take both mutexes with one std::scoped_lock{a.m, b.m}, or define a single global lock order',
      'Call try_lock in a loop until it eventually succeeds',
      'Detach one of the two threads',
    ], 1, 'scoped_lock over several mutexes uses a deadlock-avoiding algorithm; otherwise every call site must acquire them in the same order.'),
    q('Two threads each hold a copy of the same std::shared_ptr and call methods on the object. What is guaranteed?', [
      'The reference count is atomic, but the pointed-to object is not protected — guard it like any shared data',
      'Both the control block and the object are thread safe',
      'Nothing: copying a shared_ptr from two threads is always a data race',
      'Each thread receives its own copy of the object, so there is nothing shared',
    ], 0, 'shared_ptr synchronises only its control block, so the pointee still needs a mutex of its own.'),
    q('The test suite is green but users report random crashes. What is the cheapest next step?', [
      'Add more logging around the reported crash site',
      'Rewrite the suspect module using shared_ptr throughout',
      'Rebuild the tests with -fsanitize=address,undefined and run them again',
      'Switch the build type to Debug and ship that instead',
    ], 2, 'Sanitizers report use-after-free and undefined behaviour at the moment it happens, on the error paths the suite already exercises.'),
      q('A server moves its hot parse path onto one long lived std::pmr::monotonic_buffer_resource and builds std::pmr::vector<std::pmr::string> rows from it. Throughput improves by a third, and resident memory climbs to 40 GB over a day of steady traffic. Which explanation fits both observations at once?', [
      'polymorphic_allocator costs one virtual call per allocation, so each row\'s bytes get rounded up to a whole page.',
      'std::pmr::string ignores the resource it is handed, so every row is still served by plain operator new underneath.',
      'Move assignment between pmr containers copies rather than steals, so each row ends up stored twice in the buffer.',
      'The resource bump allocates and its deallocate does nothing, so released rows are never reused and it only grows.',
    ], 3, 'A monotonic buffer resource is fast precisely because allocation is a pointer bump and do_deallocate is a no-op, which means memory comes back only when the resource itself is released or destroyed; keeping one alive for the lifetime of the process turns that speed into an unbounded leak, and the fix is a resource per request that is released when the request ends.'),
    q('A worker fills buf, then executes ready.store(true, std::memory_order_release), and only after that writes the plain int len = n. The reader spins until an acquire load of ready returns true and then reads both buf and len. What is the defect?', [
      'buf is published correctly, but len was written after the release store, so nothing orders it and reading it races.',
      'Both reads are safe, because the acquire load synchronises with the release store and covers every write that thread made.',
      'buf is the racy one, since a plain array cannot be published by an atomic flag, while a single int write is atomic anyway.',
      'Neither read is safe, because acquire and release order atomic variables against each other and never plain data.',
    ], 0, 'A release store orders everything the storing thread wrote before it, so the acquire load does establish that buf is visible, but len was written afterwards and therefore sits outside that happens-before edge, leaving a plain write racing with a plain read; moving the assignment to len above the release store closes it.'),
    q('A mirror coroutine loops on while (!st.stop_requested()) and awaits in.read(buf, st) on each pass. Stop is requested while it is parked inside a read on a socket whose peer has gone quiet, and the task never completes. What is missing?', [
      'The stop token has to be taken by value so it lives in the frame; a reference to it dies with the caller\'s expression.',
      'The awaitable needs a stop_callback that finishes the pending read with an error, as the loop check runs only between awaits.',
      'handle.destroy() is the only way to end a suspended coroutine, so a stop request can never reach one that is parked.',
      'The loop condition is evaluated once when the coroutine is first resumed, so a stop request made later is never observed.',
    ], 1, 'Cancellation in C++ coroutines is cooperative, so it can only take effect at a point where the coroutine actually runs, and a frame suspended on a read that nobody will complete never reaches the next stop_requested check; the awaitable itself has to register a std::stop_callback that completes the outstanding operation with an error so the coroutine resumes and can return.'),
    q('A patch release of libcore.so adds one private steady_clock::time_point to an exported class. Consumer headers compile, the link succeeds, the loader raises nothing, and two services then crash in destructors. Why did every stage say yes?', [
      'The mangled names of the exported functions changed with the new member, so the loader bound the calls to older symbols.',
      'The added member has a non trivial destructor, so two destructors were emitted and the loader picked between them at load.',
      'Consumers were never rebuilt, so they keep the old smaller layout, and no compile, link or load step compares object sizes.',
      'SOVERSION stayed at 1, so the loader mapped both versions of the library and mixed the two object layouts in one process.',
    ], 2, 'Adding a data member changes sizeof and shifts the offset of every member after it, yet the header, the mangled names and the SONAME are all unchanged, so nothing in the toolchain has anything to compare; callers built against the previous release still reserve the old size and read fields at the old offsets, which is exactly the silent breakage abidiff against the last released artifact is meant to catch in CI.'),
    q('A frame parser checks if (offset + len > buf.size()) return error; on 32 bit values read straight off the wire, then reads buf[offset + i] from a std::vector for every i below len. A crafted frame wraps that sum and the loop reads far past the end. Which build change turns the read into an abort?', [
      '-fsanitize=undefined, which reports the wrapped 32 bit addition the moment the parser computes it.',
      '-fstack-protector-strong, which notices the overrun before the parsing function returns to its caller.',
      '-D_FORTIFY_SOURCE=3, which compares the length of the copy against the known size of the destination.',
      '-D_GLIBCXX_ASSERTIONS, which turns the out of range operator[] on the vector into an immediate abort.',
    ], 3, 'Unsigned overflow is well defined wrap-around rather than undefined behaviour, so the undefined behaviour sanitizer has nothing to report here, while the stack protector only fires when a write reaches a saved return address and _FORTIFY_SOURCE only covers sized library calls such as memcpy; the checked read is the one thing _GLIBCXX_ASSERTIONS adds, because it puts a bounds assertion inside the container\'s operator[].'),
    q('Per worker statistics live in a std::vector<std::atomic<std::uint64_t>>, one element per thread, and no two threads ever touch the same element. Throughput still falls as threads are added, and a profile shows the increments dominating. What is happening?', [
      'The increments default to seq_cst, so every one of them drains the store buffer and serialises the whole vector.',
      'Neighbouring counters share a cache line, so each increment invalidates it on the other cores that hold a copy.',
      'std::atomic<std::uint64_t> is not lock free on 64 bit targets, so the library takes a shared lock per increment.',
      'The prefetcher loses the vector\'s stride once several cores read it, so each increment misses in the local L1.',
    ], 1, 'Coherence is tracked per cache line rather than per variable, so eight adjacent 8 byte counters occupy one 64 byte line and a write by any core invalidates the copy every other core holds, making each logically independent increment pay for a cross-core transfer; padding each counter to alignas(64) gives every thread its own line and the scaling returns.'),
  ],
});
