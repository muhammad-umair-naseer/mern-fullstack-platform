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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
        `),
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
  ],
});
