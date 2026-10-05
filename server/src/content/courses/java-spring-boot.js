import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'java-spring-boot',
  title: 'Java & Spring Boot',
  category: 'Programming',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'orange',
  coverKey: 'java-spring-boot',
  summary:
    'Learn modern Java from the ground up, then build production-ready REST APIs with Spring Boot: JPA and PostgreSQL, validation, Spring Security with JWT, testing with JUnit and Testcontainers, and Docker deployment.',
  description:
    'You start with modern Java: the JDK, types, control flow, methods and strings, then object-oriented design with classes, records, inheritance and interfaces. You master collections, generics, lambdas and streams, and write robust code with exceptions, Optional, Maven and JUnit 5. Then you move to Spring Boot: dependency injection, configuration and profiles, REST controllers with validation and clean error handling, Spring Data JPA with relationships, paging, transactions and Flyway migrations. You structure applications in layers, add Actuator, caching and async work, secure APIs with Spring Security and JWT, test with MockMvc and Testcontainers, and ship with Docker. The course ends with a complete project, microservice trade-offs and interview preparation.',
  chapters: [
    chapter(
      'Java Foundations',
      'Understand why Java powers so many enterprise systems, install a JDK and an IDE, write, compile and run your first program, and work with Java\'s types, variables and operators.',
      [
      lesson('Why Java Still Runs the Enterprise', 12, `
Java was released in 1995, and it remains one of the most widely used programming languages in the world. Banks, telecom companies, airlines, government systems, e-commerce platforms and countless back-end services run on Java. Learning it opens doors to stable, well-paid work, locally and internationally.

### Write once, run anywhere

Java code is not compiled directly into machine code for one operating system. Instead:

\`\`\`text
Hello.java  --(javac compiler)-->  Hello.class (bytecode)
Hello.class --(Java Virtual Machine)-->  runs on Windows, macOS, Linux
\`\`\`

The Java Virtual Machine (JVM) runs the same bytecode on any platform. This portability, combined with strong performance from the JVM's just-in-time compiler, is a major reason businesses trust Java for long-lived systems.

### What makes Java attractive to businesses

| Strength | Why it matters |
|---|---|
| Stability | Code written years ago usually still runs on modern JVMs |
| Performance | The JVM optimises running code, handling heavy workloads well |
| Automatic memory management | The garbage collector frees unused memory, reducing certain bugs |
| Strong typing | Many errors are caught at compile time, before code reaches users |
| Huge ecosystem | Mature libraries and frameworks for almost every need |
| Tooling | Excellent IDEs, debuggers, profilers and build tools |
| Talent pool | Many developers know Java, which reduces hiring risk |

### Where Java is used

- **Enterprise back ends**: banking systems, insurance, logistics, telecom billing.
- **Web APIs and microservices**: largely with Spring Boot, the focus of the second half of this course.
- **Big data and streaming**: tools like Apache Kafka, Hadoop and much of the Spark ecosystem run on the JVM.
- **Android**: Kotlin is now preferred for new Android apps, but Java remains widely used and understood.
- **Financial trading, search engines and large-scale platforms**.

In Pakistan, banks, telecom operators, fintech companies and software houses serving international clients regularly hire Java and Spring Boot developers.

### Modern Java is not old Java

Java has changed a lot. New versions arrive every six months, and every few years one is designated a long-term support (LTS) release that companies standardise on. Recent LTS versions include Java 17, Java 21 and Java 25. Modern Java includes features that make code shorter and clearer:

\`\`\`java
// Records: concise data classes
record Book(String title, String author, int year) {}

// var: local type inference
var books = new ArrayList<Book>();

// Switch expressions
String size = switch (pages / 100) {
    case 0, 1 -> "short";
    case 2, 3 -> "medium";
    default -> "long";
};
\`\`\`

This course uses modern Java throughout, targeting Java 21 or newer.

### Java and Spring Boot together

Java is the language; Spring Boot is a framework built on it for creating applications, especially web APIs, quickly and reliably. The first five chapters build solid Java skills. Chapters 6 to 12 use those skills to build real Spring Boot applications with databases, security, tests and deployment. Strong Java fundamentals make Spring Boot far easier, because Spring relies heavily on classes, interfaces, annotations and collections.
      `,
        [
          q('What does the Java Virtual Machine do?', [
            'Converts Java into Python',
            'Runs compiled bytecode on any supported platform',
            'Designs user interfaces',
            'Stores data in a database',
          ], 1, 'The JVM executes platform-independent bytecode, which is how Java runs on many operating systems.'),
          q('What is a long-term support (LTS) Java release?', [
            'A version that is never updated',
            'A version only for Android',
            'A release that companies can standardise on for years',
            'A beta version for testing features',
          ], 2, 'LTS releases receive long-term updates, so organisations use them as stable platforms.'),
          q('What is the relationship between Java and Spring Boot?', [
            'Spring Boot is a replacement language for Java',
            'They are unrelated technologies',
            'Java runs inside Spring Boot\'s own virtual machine',
            'Spring Boot is a framework built on Java for building applications',
          ], 3, 'Spring Boot uses Java to make building applications, especially web APIs, faster and more reliable.'),
        ]
      ),
      lesson('Installing the JDK and an IDE', 13, `
To write and run Java, you need two things: a Java Development Kit (JDK), which includes the compiler and runtime, and a good editor or IDE (integrated development environment). Setting them up properly at the start saves hours of confusion later.

### JDK distributions

Java is open source through the OpenJDK project, and several organisations publish builds of it:

| Distribution | Notes |
|---|---|
| Eclipse Temurin (Adoptium) | Popular, free, well-tested builds |
| Oracle JDK | Oracle's build; check the current licence terms for your use |
| Amazon Corretto | Free builds with long-term support from Amazon |
| Microsoft Build of OpenJDK | Free builds from Microsoft |

For learning and most projects, Eclipse Temurin or another free OpenJDK build works well. Install a current LTS version, Java 21 or newer.

### Installing

- **Windows**: download the installer (MSI) from the distribution's website and run it; choose the option to set \`JAVA_HOME\` and add Java to the PATH if offered.
- **macOS**: use the installer package, or a package manager such as Homebrew.
- **Linux**: use your distribution's package manager, or a tool like SDKMAN.

SDKMAN (on macOS and Linux) makes it easy to install and switch between several JDK versions, which is useful when different projects need different versions.

### Checking the installation

Open a terminal or command prompt and run:

\`\`\`bash
java -version
javac -version
\`\`\`

Both should print the version you installed. If the command is not found, the JDK's \`bin\` folder is not on your PATH. Also check the \`JAVA_HOME\` environment variable, which many tools, including Maven and Gradle, use to find the JDK.

### Choosing an IDE

| IDE | Strengths |
|---|---|
| IntelliJ IDEA | Widely considered the leading Java IDE; excellent Spring support in its paid tier, with a capable free edition |
| Visual Studio Code | Lightweight; add the Java extension pack and Spring Boot extensions |
| Eclipse | Free, long-established, used in many companies |

Any of these works for this course. IntelliJ IDEA is especially popular in professional Java and Spring teams, and its code completion, refactoring and debugging tools teach good habits.

### Features to learn early

- **Code completion**: suggestions as you type, reducing typos.
- **Quick fixes**: the IDE suggests fixes for errors, such as missing imports.
- **Run and debug buttons**: run programs and step through them line by line.
- **Refactoring**: rename a class or method safely everywhere it is used.
- **Reformat code**: consistent indentation and style with one shortcut.

Learning to use the debugger early is one of the best investments a Java learner can make. Setting a breakpoint and stepping through code shows exactly what your program is doing, which is much faster than guessing.

### Project folder habits

Keep all your practice code in one folder, such as \`~/java-course\`, with a subfolder per chapter or project. Later, when you use build tools and Spring Boot, each project will have its own standard structure, and version control with Git will keep a history of your work.
      `,
        [
          q('What does the JDK include?', [
            'The compiler and runtime needed to build and run Java programs',
            'Only a text editor',
            'A database for storing Java code',
            'A web browser plugin',
          ], 0, 'The Java Development Kit provides tools like javac and the runtime to execute programs.'),
          q('The command javac is not found after installing the JDK. What is the likely cause?', [
            'Java programs cannot be compiled from a terminal',
            'The IDE is not installed yet',
            'The computer needs more RAM',
            'The JDK\'s bin folder is not on the PATH',
          ], 3, 'The terminal finds javac through the PATH, so the JDK\'s bin folder must be included.'),
          q('Why learn the debugger early?', [
            'It makes programs run faster in production',
            'It is required to compile Java',
            'Stepping through code shows exactly what the program does',
            'It automatically writes tests',
          ], 2, 'Breakpoints and stepping reveal program behaviour directly, making bugs much easier to find.'),
        ]
      ),
      lesson('Your First Program: Classes, main and Compilation', 13, `
Every Java program begins with a class and a method called \`main\`. Writing, compiling and running a small program by hand teaches you what IDEs and build tools do behind the scenes, which makes later errors much easier to understand.

### Hello, Java

Create a file named \`Hello.java\`:

\`\`\`java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Assalam-o-Alaikum, Java!");
    }
}
\`\`\`

Each part has a purpose:

| Part | Meaning |
|---|---|
| \`public class Hello\` | Declares a class named Hello, visible everywhere |
| \`public static void main(String[] args)\` | The entry point the JVM calls to start the program |
| \`static\` | The method belongs to the class, so no object is needed to call it |
| \`void\` | The method returns nothing |
| \`String[] args\` | Command-line arguments passed to the program |
| \`System.out.println\` | Prints a line of text to the console |

The file name must match the public class name exactly, including capitalisation: \`Hello.java\` for class \`Hello\`.

### Compile and run

\`\`\`bash
javac Hello.java      # produces Hello.class (bytecode)
java Hello            # runs the class on the JVM
\`\`\`

For single-file programs, modern Java can also compile and run in one step:

\`\`\`bash
java Hello.java
\`\`\`

Recent Java versions also support simplified entry points for small learning programs. This course uses the classic form shown above, because it is what you will see in real projects and in Spring Boot applications.

### Reading compiler errors

Compiler errors tell you the file, line number and problem:

\`\`\`text
Hello.java:3: error: ';' expected
        System.out.println("Assalam-o-Alaikum, Java!")
                                                      ^
1 error
\`\`\`

Read the first error first; later errors are often caused by it. Common beginner errors:

- Missing semicolons at the end of statements.
- Mismatched braces \`{ }\`.
- Wrong capitalisation: \`system.out.println\` instead of \`System.out.println\`.
- File name not matching the class name.

### Using command-line arguments

\`\`\`java
public class Greet {
    public static void main(String[] args) {
        String name = args.length > 0 ? args[0] : "friend";
        System.out.println("Hello, " + name + "!");
    }
}
\`\`\`

\`\`\`bash
java Greet.java Ayesha
# Hello, Ayesha!
\`\`\`

\`args\` is an array of strings. Checking \`args.length\` before accessing \`args[0]\` avoids an error when no argument is given.

### Packages

Real projects organise classes into packages, which are like folders with names:

\`\`\`java
package pk.cortexis.library;

public class App {
    public static void main(String[] args) {
        System.out.println("Library app started");
    }
}
\`\`\`

The file lives in the folder \`pk/cortexis/library/App.java\`. Package names usually start with a reversed domain name, such as \`pk.cortexis\` or \`com.example\`, to keep them unique. Spring Boot projects use packages extensively.

### Comments

\`\`\`java
// A single-line comment
/* A multi-line
   comment */
/** A Javadoc comment, used to generate documentation */
\`\`\`

Use comments to explain why code does something, not what it obviously does.
      `,
        [
          q('What must the file name be for a public class named Invoice?', [
            'InvoiceClass.java',
            'Invoice.class',
            'App.java',
            'Invoice.java',
          ], 3, 'A public class must be in a file with exactly the same name, including capitalisation, plus .java.'),
          q('What does javac produce from Hello.java?', [
            'Hello.class containing bytecode',
            'Hello.exe for Windows only',
            'A running web server',
            'A new Java file with comments removed',
          ], 0, 'The compiler turns source code into bytecode in a .class file, which the JVM runs.'),
          q('When several compiler errors appear, which should you fix first?', [
            'The last one',
            'The longest message',
            'The first one, since later errors may be caused by it',
            'None, just run the program anyway',
          ], 2, 'One early mistake can confuse the compiler and produce many follow-on errors.'),
        ]
      ),
      lesson('Variables, Types and Operators', 14, `
Java is a statically typed language: every variable has a type known at compile time, and the compiler checks that you use it correctly. This catches many mistakes before the program runs, and it is one reason Java is trusted for large systems.

### Primitive types

Java has eight primitive types, which store simple values directly:

| Type | Size | Example | Use |
|---|---|---|---|
| \`byte\` | 8-bit | \`byte b = 100;\` | Raw data, rarely used directly |
| \`short\` | 16-bit | \`short s = 30000;\` | Rarely used |
| \`int\` | 32-bit | \`int pages = 320;\` | Most whole numbers |
| \`long\` | 64-bit | \`long views = 9_000_000_000L;\` | Very large whole numbers |
| \`float\` | 32-bit | \`float f = 3.5f;\` | Rarely used |
| \`double\` | 64-bit | \`double rating = 4.7;\` | Decimal numbers |
| \`char\` | 16-bit | \`char grade = 'A';\` | A single character |
| \`boolean\` | true/false | \`boolean available = true;\` | Conditions |

Underscores in numbers, like \`9_000_000_000L\`, improve readability. The \`L\` suffix marks a long literal.

### Reference types

Everything else, such as \`String\`, arrays and your own classes, is a reference type. A reference variable holds a reference to an object, not the object itself:

\`\`\`java
String title = "Aag Ka Darya";
int[] ratings = {5, 4, 5, 3};
\`\`\`

Reference variables can be \`null\`, meaning they refer to nothing. Using a null reference causes a \`NullPointerException\`, one of the most common Java errors; chapter 5 shows how to avoid it.

### Declaring variables

\`\`\`java
int copies = 3;            // explicit type
var price = 1250.0;        // type inferred as double
final int MAX_LOANS = 5;   // cannot be reassigned
\`\`\`

\`var\` works for local variables when the type is obvious from the right-hand side. \`final\` prevents reassignment, and constants are conventionally named in capitals.

### Operators

| Category | Operators |
|---|---|
| Arithmetic | \`+ - * / %\` |
| Comparison | \`== != < > <= >=\` |
| Logical | \`&& \\|\\| !\` |
| Assignment | \`= += -= *= /=\` |
| Increment | \`++ --\` |

### Integer division and remainders

Dividing two integers produces an integer, discarding the fraction:

\`\`\`java
int total = 7;
int people = 2;
System.out.println(total / people);        // 3, not 3.5
System.out.println(total % people);        // 1, the remainder
System.out.println((double) total / people); // 3.5
\`\`\`

Casting one value to \`double\` gives a decimal result. This catches many beginners out, for example when calculating averages.

### Money and precision

\`double\` cannot represent some decimal values exactly:

\`\`\`java
System.out.println(0.1 + 0.2);   // 0.30000000000000004
\`\`\`

For money, use \`BigDecimal\`, or store amounts as whole units such as paisa or cents in a \`long\`. Financial applications in banks and fintech companies are careful about this, and interviewers often ask about it.

### Comparing values

For primitives, \`==\` compares values. For objects such as strings, \`==\` compares whether two references point to the same object, which is usually not what you want. Use \`.equals()\` to compare content:

\`\`\`java
String a = "lahore";
String b = new String("lahore");
System.out.println(a == b);        // false: different objects
System.out.println(a.equals(b));   // true: same content
\`\`\`

Understanding this difference prevents a classic class of bugs.
      `,
        [
          q('What does 7 / 2 evaluate to when both values are int?', [
            '3.5',
            '3',
            '4',
            '1',
          ], 1, 'Integer division discards the fractional part, so 7 divided by 2 gives 3.'),
          q('Why should money usually not be stored in a double?', [
            'Doubles cannot hold numbers above 1,000',
            'Doubles are slower than strings',
            'Java forbids doubles for currency',
            'Doubles cannot represent some decimals exactly',
          ], 3, 'Floating-point rounding errors can creep into money calculations, so BigDecimal or whole units are used.'),
          q('How should the contents of two String objects be compared?', [
            'With ==',
            'With =',
            'With .equals()',
            'With >',
          ], 2, 'The equals method compares text content, while == compares object references.'),
        ]
      ),
      ],
      [
      q('Why is Java code portable across operating systems?', [
        'It is interpreted by each web browser',
        'It is compiled separately for every computer by hand',
        'Bytecode runs on the JVM available for each platform',
        'It only runs on Linux servers',
      ], 2, 'Compiling to bytecode and running on a JVM lets the same code run on many systems.'),
      q('Which command checks the installed Java compiler version?', [
        'java --compile',
        'jdk -check',
        'javac run',
        'javac -version',
      ], 3, 'javac -version prints the compiler version, confirming the JDK is installed and on the PATH.'),
      q('What is the role of the main method?', [
        'It is the entry point the JVM calls to start the program',
        'It stores the program\'s data permanently',
        'It compiles the other classes',
        'It defines the program\'s package name',
      ], 0, 'The JVM begins execution at public static void main(String[] args).'),
      q('What happens when a method is called on a null reference?', [
        'It returns zero',
        'It returns an empty string',
        'A NullPointerException is thrown',
        'The compiler fixes it automatically',
      ], 2, 'Calling a method on null has no object to act on, causing a NullPointerException at runtime.'),
      ]
    ),
    chapter(
      'Control Flow, Methods and Strings',
      'Make decisions with if statements and modern switch expressions, repeat work with loops, organise logic into methods, and handle text efficiently with String, StringBuilder and text blocks.',
      [
      lesson('Conditions and Switch Expressions', 13, `
Programs make decisions constantly: is the book available, is the user an admin, is the fine overdue? Java gives you \`if\` statements for general conditions and switch expressions for choosing between many values. Modern switch syntax is much cleaner than the old style, and you will see it in current codebases.

### if, else if, else

\`\`\`java
int daysLate = 12;
double fine;

if (daysLate <= 0) {
    fine = 0;
} else if (daysLate <= 7) {
    fine = daysLate * 10;
} else {
    fine = 70 + (daysLate - 7) * 20;
}
\`\`\`

Conditions are checked from top to bottom; the first true branch runs. Always use braces, even for single lines, to avoid bugs when code is added later.

### Combining conditions

\`\`\`java
boolean isMember = true;
int booksBorrowed = 3;

if (isMember && booksBorrowed < 5) {
    System.out.println("You can borrow another book.");
}
\`\`\`

\`&&\` and \`||\` short-circuit: in \`a && b\`, if \`a\` is false, \`b\` is not evaluated. This lets you write safe checks such as \`user != null && user.isActive()\`.

### The ternary operator

For simple choices between two values:

\`\`\`java
String status = daysLate > 0 ? "Overdue" : "On time";
\`\`\`

Use it for short expressions; for anything complex, an \`if\` statement is clearer.

### Switch expressions

Modern Java's switch expressions return a value and use arrows, with no fall-through:

\`\`\`java
String dayType = switch (day) {
    case SATURDAY, SUNDAY -> "Weekend";
    case FRIDAY -> "Short day";
    default -> "Weekday";
};
\`\`\`

Compare this with the older statement style, which needed \`break\` in every case and was a frequent source of bugs:

\`\`\`java
switch (day) {
    case SATURDAY:
    case SUNDAY:
        dayType = "Weekend";
        break;
    default:
        dayType = "Weekday";
}
\`\`\`

For multi-line cases, use a block with \`yield\`:

\`\`\`java
int loanDays = switch (memberType) {
    case "STUDENT" -> 14;
    case "STAFF" -> {
        System.out.println("Staff loan period applied");
        yield 30;
    }
    default -> 7;
};
\`\`\`

### Pattern matching

Modern Java can also test an object's type and extract it in one step:

\`\`\`java
Object value = 42;
if (value instanceof Integer number && number > 10) {
    System.out.println("Large number: " + number);
}
\`\`\`

Switch supports patterns too, which becomes powerful with records and sealed types in chapter 3:

\`\`\`java
String describe(Object o) {
    return switch (o) {
        case Integer i when i > 100 -> "big integer";
        case Integer i -> "integer " + i;
        case String s -> "text of length " + s.length();
        default -> "something else";
    };
}
\`\`\`

### Choosing the right tool

| Situation | Best choice |
|---|---|
| Ranges or complex conditions | if / else if |
| One variable compared against many constant values | switch expression |
| Choosing between two simple values | ternary operator |
| Behaviour depending on an object's type | pattern matching |

### Keep conditions readable

Deeply nested conditions are hard to follow. Return early or extract conditions into well-named methods:

\`\`\`java
boolean canBorrow = isMember && !hasUnpaidFines && booksBorrowed < MAX_LOANS;
if (canBorrow) { ... }
\`\`\`

A well-named boolean turns a complicated rule into readable code, which matters in business applications where rules change often.
      `,
        [
          q('What is an advantage of switch expressions with arrows?', [
            'They require a break after every case',
            'They return a value and have no fall-through',
            'They only work with numbers',
            'They run faster than any if statement',
          ], 1, 'Arrow cases do not fall through and can produce a value directly, avoiding a common class of bugs.'),
          q('In the expression user != null && user.isActive(), why is it safe?', [
            'Java ignores null values automatically',
            'isActive always returns false for null',
            'If user is null, the second part is not evaluated',
            'The && operator converts null to false',
          ], 2, 'Short-circuit evaluation skips the method call when the first condition is false.'),
          q('What does yield do inside a switch expression block?', [
            'Stops the whole program',
            'Skips to the default case',
            'Prints a value to the console',
            'Returns the value for that case',
          ], 3, 'In a block case, yield provides the value that the switch expression produces.'),
        ]
      ),
      lesson('Loops and Iteration', 12, `
Loops repeat work: processing every book in a list, retrying a network call, reading lines from a file. Java has several loop forms, and choosing the right one makes code clearer and less error-prone.

### The for loop

Use a classic \`for\` loop when you need a counter:

\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println("Shelf " + i);
}
\`\`\`

The three parts are initialisation (\`int i = 1\`), condition (\`i <= 5\`) and update (\`i++\`).

### The enhanced for loop

To visit every element of an array or collection, the enhanced for loop is simpler and safer:

\`\`\`java
String[] titles = {"Raja Gidh", "Udas Naslain", "Peer-e-Kamil"};

for (String title : titles) {
    System.out.println(title);
}
\`\`\`

No index means no chance of an off-by-one error. Prefer it whenever you do not need the index.

### while and do-while

\`while\` repeats while a condition is true, checking before each run:

\`\`\`java
int attempts = 0;
boolean connected = false;

while (!connected && attempts < 3) {
    connected = tryConnect();
    attempts++;
}
\`\`\`

\`do-while\` checks after each run, so the body always runs at least once:

\`\`\`java
String input;
do {
    input = readUserInput();
} while (input.isBlank());
\`\`\`

### break and continue

\`\`\`java
for (String title : titles) {
    if (title.isBlank()) {
        continue;          // skip this one, go to the next
    }
    if (title.equals("STOP")) {
        break;             // leave the loop entirely
    }
    System.out.println(title);
}
\`\`\`

Use them sparingly; loops with many jumps are harder to read.

### Common loop mistakes

| Mistake | Example | Fix |
|---|---|---|
| Off-by-one | \`i <= array.length\` | Use \`i < array.length\` |
| Infinite loop | Forgetting to update the condition | Make sure the loop variable changes |
| Modifying a list while looping | Removing items inside a for-each | Use an iterator's remove, or \`removeIf\` |
| Heavy work inside loops | Database call per iteration | Load data once, then loop |

The last mistake matters greatly in Spring applications: calling the database inside a loop over hundreds of items is a common cause of slow APIs, which chapter 8 revisits.

### Nested loops

\`\`\`java
for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 3; col++) {
        System.out.print(row * col + "\\t");
    }
    System.out.println();
}
\`\`\`

Nested loops multiply work: two loops of 1,000 iterations run a million times. For large data, look for approaches that avoid nested loops, such as using a map for lookups, covered in chapter 4.

### Loops versus streams

Modern Java also offers streams, which express operations like filtering and summing without explicit loops:

\`\`\`java
int total = prices.stream().mapToInt(Integer::intValue).sum();
\`\`\`

Chapter 4 covers streams properly. Both styles are valid; loops remain clearer for step-by-step logic with side effects, while streams shine for transforming collections.
      `,
        [
          q('When is the enhanced for loop the best choice?', [
            'When visiting every element without needing the index',
            'When the loop must run at least once',
            'When counting backwards by twos',
            'When the number of iterations is unknown',
          ], 0, 'The enhanced for loop is simpler and avoids index errors when you only need each element.'),
          q('What is the difference between while and do-while?', [
            'do-while cannot use conditions',
            'while always runs at least once',
            'They are identical in behaviour',
            'do-while always runs its body at least once',
          ], 3, 'do-while checks its condition after the body, guaranteeing one execution.'),
          q('Why avoid calling a database inside a loop over many items?', [
            'Java does not allow database calls in loops',
            'Loops cannot contain method calls',
            'Repeated calls make APIs slow',
            'Databases reject more than ten queries',
          ], 2, 'Each call adds network and processing time, so loading data once is far more efficient.'),
        ]
      ),
      lesson('Methods, Parameters and Return Values', 13, `
Methods package a piece of logic under a name, so it can be reused, tested and understood in isolation. Well-designed methods are the building blocks of readable programs, and in Spring Boot applications almost all business logic lives in methods of service classes.

### Defining a method

\`\`\`java
public static double calculateFine(int daysLate) {
    if (daysLate <= 0) {
        return 0;
    }
    return daysLate * 10.0;
}
\`\`\`

| Part | Meaning |
|---|---|
| \`public\` | Access modifier: who can call it |
| \`static\` | Belongs to the class, not an object (for now; chapter 3 introduces instance methods) |
| \`double\` | Return type |
| \`calculateFine\` | Method name, in camelCase, usually a verb |
| \`int daysLate\` | Parameter with its type |
| \`return\` | Sends a value back to the caller |

Calling it:

\`\`\`java
double fine = calculateFine(5);   // 50.0
\`\`\`

### void methods

Methods that perform an action without returning a value use \`void\`:

\`\`\`java
public static void printReceipt(String member, double amount) {
    System.out.printf("Member: %s, Amount: PKR %.2f%n", member, amount);
}
\`\`\`

### Pass by value

Java always passes arguments by value. For primitives, the method receives a copy, so changing it inside the method does not affect the caller. For objects, the method receives a copy of the reference, so it can change the object's contents, but cannot make the caller's variable point to a different object.

\`\`\`java
static void addBook(List<String> books) {
    books.add("New Title");   // changes the caller's list
}
\`\`\`

Understanding this explains many surprising behaviours when working with collections.

### Overloading

Several methods can share a name if their parameter lists differ:

\`\`\`java
static double calculateFine(int daysLate) { ... }
static double calculateFine(int daysLate, double dailyRate) { ... }
\`\`\`

Java chooses the version based on the arguments. Overloading suits variations of the same operation, but too many overloads become confusing.

### Varargs

A method can accept a variable number of arguments:

\`\`\`java
static int total(int... values) {
    int sum = 0;
    for (int v : values) sum += v;
    return sum;
}

total(1, 2, 3);   // 6
\`\`\`

### Designing good methods

\`\`\`text
Do one thing, and name it clearly:   calculateFine, sendReminder
Keep them short:                      if it scrolls, consider splitting
Few parameters:                       more than three or four suggests an object
Avoid hidden side effects:            a "get" method should not change data
Return values instead of printing:   easier to test and reuse
\`\`\`

A method that calculates and returns a value can be tested easily with JUnit (chapter 5). A method that calculates and prints can only be checked by reading the console.

### Recursion

A method can call itself, which suits problems that divide naturally into smaller versions:

\`\`\`java
static long factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}
\`\`\`

Every recursive method needs a base case, or it will run until the stack overflows. In everyday business code, loops are usually clearer, but recursion appears in tree structures and interview questions.
      `,
        [
          q('What does the return type void mean?', [
            'The method returns null',
            'The method cannot have parameters',
            'The method does not return a value',
            'The method is private',
          ], 2, 'void methods perform actions without sending a value back to the caller.'),
          q('A method adds an item to a List passed as an argument. What happens to the caller\'s list?', [
            'It contains the new item, since the reference points to the same list',
            'It is unchanged, because Java copies the whole list',
            'It becomes null',
            'The program fails to compile',
          ], 0, 'The method receives a copy of the reference, so it modifies the same list object the caller holds.'),
          q('Why prefer methods that return values over methods that print?', [
            'Printing is not allowed in Java',
            'Returned values use less memory',
            'Printing methods cannot have parameters',
            'Returned values are easier to test and reuse',
          ], 3, 'Returning results lets other code and tests use them, while printing only shows them on screen.'),
        ]
      ),
      lesson('Strings, StringBuilder and Text Blocks', 13, `
Text is everywhere in applications: names, messages, JSON, SQL, email templates, log lines. Java's \`String\` class is powerful but has one crucial property, immutability, that affects performance and correctness. Knowing when to use \`String\`, \`StringBuilder\` and text blocks is basic professional knowledge.

### Strings are immutable

Once created, a \`String\` never changes. Methods that seem to modify it return a new string:

\`\`\`java
String city = "karachi";
city.toUpperCase();               // returns "KARACHI", but city is unchanged
String upper = city.toUpperCase(); // store the result to use it
\`\`\`

Immutability makes strings safe to share between threads and reliable as map keys.

### Common String methods

| Method | Example | Result |
|---|---|---|
| \`length()\` | \`"Lahore".length()\` | 6 |
| \`toUpperCase()\` / \`toLowerCase()\` | \`"Lahore".toLowerCase()\` | "lahore" |
| \`trim()\` / \`strip()\` | \`"  hi  ".strip()\` | "hi" |
| \`isBlank()\` | \`"   ".isBlank()\` | true |
| \`contains()\` | \`"Spring Boot".contains("Boot")\` | true |
| \`startsWith()\` / \`endsWith()\` | \`"file.pdf".endsWith(".pdf")\` | true |
| \`replace()\` | \`"a-b-c".replace("-", "/")\` | "a/b/c" |
| \`split()\` | \`"a,b,c".split(",")\` | ["a", "b", "c"] |
| \`substring()\` | \`"Islamabad".substring(0, 5)\` | "Islam" |
| \`equalsIgnoreCase()\` | \`"PK".equalsIgnoreCase("pk")\` | true |

\`strip()\` handles Unicode whitespace better than the older \`trim()\`.

### Building strings in loops

Because strings are immutable, concatenating in a loop creates many temporary objects:

\`\`\`java
String report = "";
for (String title : titles) {
    report += title + "\\n";      // creates a new String each time
}
\`\`\`

For many additions, use \`StringBuilder\`, which is mutable:

\`\`\`java
StringBuilder report = new StringBuilder();
for (String title : titles) {
    report.append(title).append('\\n');
}
String result = report.toString();
\`\`\`

For simply joining values, \`String.join\` is even cleaner:

\`\`\`java
String csv = String.join(", ", titles);
\`\`\`

### Formatting

\`\`\`java
String line = String.format("%-20s PKR %,10.2f", "Monthly fee", 1500.0);
// "Monthly fee          PKR   1,500.00"

String msg = "Hello %s, you have %d books due".formatted(name, count);
\`\`\`

Format specifiers: \`%s\` for strings, \`%d\` for integers, \`%f\` for decimals (\`%.2f\` for two decimal places), \`%,\` adds thousands separators.

### Text blocks

Multi-line strings used to be messy with \`\\n\` and \`+\`. Text blocks, introduced in modern Java, keep them readable:

\`\`\`java
String json = """
    {
      "title": "Aangan",
      "author": "Khadija Mastoor",
      "available": true
    }
    """;
\`\`\`

Text blocks are ideal for JSON in tests, SQL queries and templates. Indentation common to all lines is removed automatically.

### Text and encoding

Java strings are Unicode, so Urdu, Arabic and other scripts work naturally in memory:

\`\`\`java
String greeting = "خوش آمدید";
System.out.println(greeting.length());
\`\`\`

Problems usually appear at the edges: reading files or databases with the wrong encoding. Always use UTF-8 for source files, files and database connections, a habit that saves Pakistani developers many garbled-text headaches.
      `,
        [
          q('What does city.toUpperCase() do to the variable city?', [
            'Changes it to upper case permanently',
            'Deletes the original string',
            'Converts it to a StringBuilder',
            'Nothing; it returns a new string',
          ], 3, 'Strings are immutable, so the method returns a new value that must be stored to be used.'),
          q('When should StringBuilder be used?', [
            'For comparing two strings',
            'For storing a single constant',
            'When building a string through many additions, such as in a loop',
            'For converting numbers to text',
          ], 2, 'StringBuilder is mutable, avoiding the many temporary objects created by repeated concatenation.'),
          q('What are text blocks especially useful for?', [
            'Readable multi-line text like JSON or SQL',
            'Storing numbers efficiently',
            'Encrypting passwords',
            'Replacing all String methods',
          ], 0, 'Text blocks keep multi-line strings readable without escape characters and concatenation.'),
        ]
      ),
      ],
      [
      q('Which is the best choice for mapping a day to "Weekend" or "Weekday"?', [
        'A while loop',
        'A recursive method',
        'A switch expression',
        'A StringBuilder',
      ], 2, 'Comparing one value against constants and producing a result is exactly what switch expressions do.'),
      q('What is a classic off-by-one bug in a for loop over an array?', [
        'Using i < array.length',
        'Using i <= array.length',
        'Starting from i = 0',
        'Using an enhanced for loop',
      ], 1, 'Arrays are indexed from zero to length minus one, so <= accesses an index that does not exist.'),
      q('Why should methods have clear names and do one thing?', [
        'Java limits methods to ten lines',
        'Long methods cannot be compiled',
        'The JVM runs short methods only',
        'They are easier to read, test and reuse',
      ], 3, 'Focused, well-named methods make code understandable and testable.'),
      q('Which approach avoids garbled Urdu text when reading files and databases?', [
        'Using double instead of String',
        'Converting all text to upper case',
        'Using UTF-8 consistently for files and connections',
        'Avoiding text blocks',
      ], 2, 'Encoding mismatches cause garbled characters, so UTF-8 everywhere keeps Unicode text intact.'),
      ]
    ),
    chapter(
      'Object-Oriented Java',
      'Model real things with classes, objects and constructors, protect data with encapsulation and records, reuse behaviour through inheritance and polymorphism, and design flexible code with interfaces, abstract classes and sealed types.',
      [
      lesson('Classes, Objects and Constructors', 13, `
Java is an object-oriented language. Programs are built from objects that combine data (fields) and behaviour (methods). A class is the blueprint; an object is a specific thing built from that blueprint. Spring Boot applications are made of many such classes: entities, services, controllers and more.

### A first class

\`\`\`java
public class Book {
    String title;
    String author;
    int copiesAvailable;

    void borrow() {
        if (copiesAvailable > 0) {
            copiesAvailable--;
        }
    }
}
\`\`\`

Creating and using objects:

\`\`\`java
Book book = new Book();
book.title = "Aag Ka Darya";
book.author = "Qurratulain Hyder";
book.copiesAvailable = 2;

book.borrow();
System.out.println(book.copiesAvailable);   // 1
\`\`\`

Each \`new Book()\` creates a separate object with its own copy of the fields.

### Constructors

Setting fields one by one is error-prone; it is easy to forget one. A constructor initialises an object when it is created:

\`\`\`java
public class Book {
    private final String title;
    private final String author;
    private int copiesAvailable;

    public Book(String title, String author, int copiesAvailable) {
        this.title = title;
        this.author = author;
        this.copiesAvailable = copiesAvailable;
    }
}
\`\`\`

\`\`\`java
Book book = new Book("Aag Ka Darya", "Qurratulain Hyder", 2);
\`\`\`

\`this.title\` refers to the field, while \`title\` alone refers to the parameter. A class can have several constructors with different parameters, and one can call another with \`this(...)\`.

### Instance and static members

| Kind | Belongs to | Example |
|---|---|---|
| Instance field | Each object | \`copiesAvailable\`, different per book |
| Instance method | Each object | \`borrow()\`, acts on one book |
| Static field | The class, shared by all objects | \`MAX_LOANS\`, the same for every member |
| Static method | The class | \`Book.fromCsv(line)\`, a factory helper |

\`\`\`java
public class Library {
    public static final int MAX_LOANS = 5;
}
\`\`\`

Use static for constants and utilities that do not depend on an object's state. Overusing static fields for changing data creates shared state that is hard to test and unsafe with multiple threads, a real concern in web applications.

### Object identity and equality

Two objects with the same field values are still different objects:

\`\`\`java
Book a = new Book("Aangan", "Khadija Mastoor", 1);
Book b = new Book("Aangan", "Khadija Mastoor", 1);
System.out.println(a == b);        // false
System.out.println(a.equals(b));   // false, unless equals is overridden
\`\`\`

To compare by content, a class must override \`equals\` and \`hashCode\` consistently. Records, in the next lesson, do this automatically.

### toString

Printing an object shows something like \`Book@1b6d3586\` unless \`toString\` is overridden:

\`\`\`java
@Override
public String toString() {
    return "Book{title='" + title + "', copies=" + copiesAvailable + "}";
}
\`\`\`

A good \`toString\` makes logs and debugging much easier.

### Objects in memory

Object variables hold references. Assigning one variable to another copies the reference, not the object:

\`\`\`java
Book first = new Book("Aangan", "Khadija Mastoor", 1);
Book second = first;
second.borrow();
// first and second refer to the same book; both show 0 copies
\`\`\`

When no references to an object remain, the garbage collector eventually frees its memory, one of Java's conveniences compared with languages where memory is managed manually.

### Designing classes

Good classes represent one clear concept, keep their data and behaviour together, and have names that are nouns from the problem domain: \`Book\`, \`Member\`, \`Loan\`, \`Fine\`. When you design Spring Boot applications, these domain classes become the heart of the system.
      `,
        [
          q('What is the difference between a class and an object?', [
            'They are the same thing',
            'A class is a blueprint; an object is an instance built from it',
            'An object is a blueprint; a class is an instance',
            'Classes store data, objects store methods only',
          ], 1, 'A class defines structure and behaviour, and each object is a concrete instance with its own field values.'),
          q('What does this.title = title do inside a constructor?', [
            'Compares the field and parameter',
            'Creates a new class',
            'Deletes the parameter',
            'Assigns the parameter\'s value to the object\'s field',
          ], 3, 'this.title refers to the field, so the parameter\'s value is stored in the object.'),
          q('Why can overusing static fields for changing data cause problems?', [
            'Static fields cannot be read',
            'Static fields are deleted after each method call',
            'They create shared state that is hard to test and unsafe across threads',
            'They make classes impossible to compile',
          ], 2, 'Shared mutable state affects every user of the class, causing bugs in tests and concurrent web applications.'),
        ]
      ),
      lesson('Encapsulation and Records', 13, `
Encapsulation means keeping an object's data private and allowing changes only through methods that enforce the rules. It prevents other code from putting objects into invalid states. Records, a modern Java feature, make simple data classes short and safe.

### Why encapsulate?

If fields are public, any code can set them to anything:

\`\`\`java
book.copiesAvailable = -5;   // nonsense, but allowed with a public field
\`\`\`

Encapsulation hides fields and exposes behaviour:

\`\`\`java
public class Book {
    private final String title;
    private int copiesAvailable;

    public Book(String title, int copiesAvailable) {
        if (copiesAvailable < 0) {
            throw new IllegalArgumentException("Copies cannot be negative");
        }
        this.title = title;
        this.copiesAvailable = copiesAvailable;
    }

    public String getTitle() {
        return title;
    }

    public int getCopiesAvailable() {
        return copiesAvailable;
    }

    public void borrow() {
        if (copiesAvailable == 0) {
            throw new IllegalStateException("No copies available");
        }
        copiesAvailable--;
    }

    public void returnCopy() {
        copiesAvailable++;
    }
}
\`\`\`

Now the only ways to change copies are \`borrow\` and \`returnCopy\`, which enforce the rules. The class protects its own invariants.

### Access modifiers

| Modifier | Visible to |
|---|---|
| \`private\` | The same class only |
| (none) package-private | Classes in the same package |
| \`protected\` | The same package and subclasses |
| \`public\` | Everywhere |

A good default: fields private, methods as restrictive as possible, public only for what other code genuinely needs.

### Getters, setters and immutability

Getters expose values; setters allow changes. Avoid generating setters for every field by habit, because that undoes encapsulation. Prefer meaningful methods like \`borrow()\` over \`setCopiesAvailable(...)\`.

Better still, make objects immutable where possible: all fields \`final\`, no setters, and a new object created for any change. Immutable objects are simpler to reason about and safe to share between threads.

### Records

Many classes just carry data: a request body, a response, a value like a date range. Writing constructors, getters, \`equals\`, \`hashCode\` and \`toString\` for each is repetitive. A record does it in one line:

\`\`\`java
public record BookSummary(String title, String author, int year) {}
\`\`\`

The compiler generates:

- A constructor with all components.
- Accessor methods: \`title()\`, \`author()\`, \`year()\` (note: no "get" prefix).
- \`equals\` and \`hashCode\` based on all components.
- A readable \`toString\`.

Record fields are final, so records are immutable.

### Validation in records

A compact constructor can validate values:

\`\`\`java
public record Money(long paisa) {
    public Money {
        if (paisa < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
    }

    public Money add(Money other) {
        return new Money(paisa + other.paisa);
    }
}
\`\`\`

### When to use which

| Situation | Choose |
|---|---|
| Data carriers: DTOs, API requests and responses, value objects | Record |
| Objects with behaviour and changing state | Regular class with encapsulation |
| JPA entities (chapter 8) | Regular class, since JPA needs mutable objects and a no-argument constructor |

Records are used heavily in modern Spring Boot applications for request and response bodies, which chapter 7 demonstrates.
      `,
        [
          q('What problem does encapsulation solve?', [
            'It makes programs compile faster',
            'It prevents other code putting objects into invalid states',
            'It removes the need for constructors',
            'It allows fields to be changed from anywhere',
          ], 1, 'Private fields changed only through rule-enforcing methods keep objects valid.'),
          q('What accessor method does a record component named title generate?', [
            'getTitle()',
            'setTitle()',
            'fetchTitle()',
            'title()',
          ], 3, 'Records generate accessors named after the components, without a get prefix.'),
          q('Why are records usually not used for JPA entities?', [
            'JPA needs mutable objects and a no-argument constructor',
            'Records cannot have fields',
            'Records cannot be saved in any database',
            'Records are slower than classes',
          ], 0, 'Records are immutable and lack a no-argument constructor, which conflicts with how JPA manages entities.'),
        ]
      ),
      lesson('Inheritance and Polymorphism', 14, `
Inheritance lets one class build on another, reusing its fields and methods. Polymorphism lets code work with a general type while each object behaves according to its specific type. Together they allow flexible designs, although modern practice uses inheritance more cautiously than older textbooks suggest.

### Extending a class

\`\`\`java
public class LibraryItem {
    protected final String id;
    protected final String title;

    public LibraryItem(String id, String title) {
        this.id = id;
        this.title = title;
    }

    public int loanDays() {
        return 14;
    }
}

public class Magazine extends LibraryItem {
    public Magazine(String id, String title) {
        super(id, title);
    }

    @Override
    public int loanDays() {
        return 7;
    }
}
\`\`\`

\`Magazine\` inherits \`id\`, \`title\` and \`loanDays\`, and overrides \`loanDays\` with its own rule. \`super(...)\` calls the parent constructor, which must happen first.

### The @Override annotation

\`@Override\` tells the compiler you intend to override a parent method. If the signature does not match, for example a typo in the name, compilation fails. Always use it; it prevents silent bugs.

### Polymorphism

A variable of a parent type can hold any subclass object, and the correct method runs at runtime:

\`\`\`java
List<LibraryItem> items = List.of(
    new Book("B1", "Aangan"),
    new Magazine("M1", "Science Monthly"),
    new Dvd("D1", "Documentary")
);

for (LibraryItem item : items) {
    System.out.println(item.title + ": " + item.loanDays() + " days");
}
\`\`\`

Each item uses its own \`loanDays\` implementation. The loop does not need to know which type each item is. Adding a new type later, such as \`AudioBook\`, does not require changing the loop.

### Casting and instanceof

Sometimes you need subclass-specific behaviour:

\`\`\`java
if (item instanceof Magazine magazine) {
    System.out.println("Issue: " + magazine.getIssueNumber());
}
\`\`\`

Pattern matching with \`instanceof\` checks the type and casts in one step. Frequent type checks, though, often signal that behaviour should be a polymorphic method instead.

### The Object class

Every class ultimately extends \`java.lang.Object\`, which provides \`equals\`, \`hashCode\`, \`toString\` and a few other methods. That is why every object can be printed or compared, and why overriding these methods is so common.

### Composition over inheritance

Inheritance creates tight coupling: changes in a parent affect every child. Deep hierarchies become hard to understand. Many experienced developers prefer composition, where an object contains other objects that provide behaviour:

\`\`\`text
Inheritance:   PremiumMember extends Member extends Person
Composition:   Member has a MembershipPlan (Standard, Premium, Student)
\`\`\`

With composition, changing a member's plan means swapping one object, not changing their class. Spring Boot applications rely mostly on composition: services contain repositories and other services, injected by the framework, as chapter 6 explains.

### When inheritance fits

| Good fit | Poor fit |
|---|---|
| A true "is a" relationship with shared behaviour | Reusing code between unrelated concepts |
| Shallow hierarchies, one or two levels | Deep chains of subclasses |
| Framework base classes designed for extension | Classes not designed to be extended |

The \`final\` keyword on a class prevents extension, a sensible default for classes not designed for inheritance.
      `,
        [
          q('What does @Override help prevent?', [
            'Silent bugs when a method signature does not match the parent',
            'Methods being called at runtime',
            'Objects being created',
            'Classes from being compiled',
          ], 0, 'The compiler reports an error if a method marked @Override does not actually override a parent method.'),
          q('What is polymorphism in the loop over LibraryItem objects?', [
            'Every item uses the parent\'s loanDays method',
            'The loop must check each item\'s type first',
            'Items are converted to strings before use',
            'Each object runs its own overridden loanDays implementation',
          ], 3, 'At runtime, the actual object\'s method runs, so each type applies its own rule.'),
          q('Why do many developers prefer composition over inheritance?', [
            'Composition is required by the Java compiler',
            'Inheritance is not supported in modern Java',
            'It avoids tight coupling and deep hierarchies',
            'Composition makes objects immutable automatically',
          ], 2, 'Composing objects keeps designs flexible, while deep inheritance couples classes tightly.'),
        ]
      ),
      lesson('Interfaces, Abstract Classes and Sealed Types', 13, `
Interfaces define what an object can do without saying how. They are central to flexible design in Java, and Spring Boot uses them everywhere: repositories are interfaces, services are often defined by interfaces, and dependency injection works through them. Abstract classes and sealed types complete the picture.

### Interfaces

\`\`\`java
public interface NotificationSender {
    void send(String to, String message);
}

public class EmailSender implements NotificationSender {
    @Override
    public void send(String to, String message) {
        System.out.println("Email to " + to + ": " + message);
    }
}

public class SmsSender implements NotificationSender {
    @Override
    public void send(String to, String message) {
        System.out.println("SMS to " + to + ": " + message);
    }
}
\`\`\`

Code that needs to send notifications depends on the interface, not a specific class:

\`\`\`java
public class ReminderService {
    private final NotificationSender sender;

    public ReminderService(NotificationSender sender) {
        this.sender = sender;
    }

    public void remindOverdue(String member) {
        sender.send(member, "Your book is overdue.");
    }
}
\`\`\`

Switching from email to SMS, or using a fake sender in tests, requires no change to \`ReminderService\`. This pattern, depending on abstractions and receiving implementations through the constructor, is exactly how Spring Boot applications are built.

### Default and static methods

Interfaces can include default methods with implementations, useful for adding behaviour without breaking existing implementations:

\`\`\`java
public interface NotificationSender {
    void send(String to, String message);

    default void sendAll(List<String> recipients, String message) {
        recipients.forEach(r -> send(r, message));
    }
}
\`\`\`

### Abstract classes

An abstract class cannot be instantiated and may contain both implemented and abstract methods:

\`\`\`java
public abstract class Report {
    public final String generate() {
        return header() + body() + footer();
    }

    protected String header() { return "Mehran Library Report\\n"; }
    protected abstract String body();
    protected String footer() { return "\\nGenerated automatically"; }
}
\`\`\`

| | Interface | Abstract class |
|---|---|---|
| Multiple inheritance | A class can implement many | A class can extend only one |
| State (fields) | Constants only | Can have instance fields |
| Constructors | No | Yes |
| Typical use | Capabilities and contracts | Shared base implementation for closely related classes |

Prefer interfaces for contracts; use abstract classes when related classes genuinely share state and implementation.

### Sealed types

Sealed interfaces and classes restrict which types can implement or extend them:

\`\`\`java
public sealed interface PaymentResult permits Success, Failure {}
public record Success(String transactionId) implements PaymentResult {}
public record Failure(String reason) implements PaymentResult {}
\`\`\`

The compiler knows every possible type, so a switch can handle them exhaustively without a default case:

\`\`\`java
String message = switch (result) {
    case Success s -> "Paid: " + s.transactionId();
    case Failure f -> "Failed: " + f.reason();
};
\`\`\`

If a new result type is added later, the compiler flags every switch that does not handle it. Sealed types with records model business outcomes clearly and safely.

### Designing with contracts

Start with what the rest of the system needs, define it as an interface, and implement it. This keeps code testable, replaceable and aligned with how Spring expects applications to be structured.
      `,
        [
          q('Why should ReminderService depend on the NotificationSender interface?', [
            'Interfaces run faster than classes',
            'Classes cannot be passed to constructors',
            'Implementations can be swapped or faked without changing the service',
            'Interfaces store more data',
          ], 2, 'Depending on an abstraction lets different senders, including test fakes, be used without code changes.'),
          q('How many interfaces can a class implement?', [
            'Only one',
            'None, if it extends a class',
            'Exactly two',
            'Many',
          ], 3, 'Java allows a class to implement multiple interfaces but extend only one class.'),
          q('What is a benefit of a sealed interface with records?', [
            'Records become mutable',
            'The compiler can check that a switch handles every permitted type',
            'Any class anywhere can implement it',
            'It removes the need for constructors',
          ], 1, 'Knowing all permitted types lets switches be exhaustive and flags missing cases when types are added.'),
        ]
      ),
      ],
      [
      q('Which is the best use of a record?', [
        'A JPA entity with changing state',
        'A service with complex behaviour',
        'An immutable API response carrying data',
        'A class designed for deep inheritance',
      ], 2, 'Records are concise, immutable data carriers, ideal for DTOs and responses.'),
      q('What should a well-encapsulated Book class expose for borrowing?', [
        'A public copiesAvailable field',
        'A setter for every field',
        'A static counter shared by all books',
        'A borrow method that enforces the rules',
      ], 3, 'Behaviour methods protect invariants, unlike public fields or unrestricted setters.'),
      q('What does super(id, title) do in a subclass constructor?', [
        'Calls the parent class constructor',
        'Creates a new parent object separately',
        'Overrides the parent\'s fields',
        'Calls the subclass\'s toString method',
      ], 0, 'super(...) runs the parent constructor to initialise inherited fields, and it must come first.'),
      q('Which design pattern does Spring Boot rely on heavily?', [
        'Deep inheritance hierarchies between services',
        'Public mutable fields on every component',
        'Static global state shared by all classes',
        'Constructor injection of interface implementations',
      ], 3, 'Spring injects implementations into constructors, keeping components loosely coupled and testable.'),
      ]
    ),
    chapter(
      'Collections, Generics and Streams',
      'Store and look up data with lists, sets and maps, write type-safe code with generics, pass behaviour around with lambdas and method references, and transform collections with the Stream API.',
      [
      lesson('Lists, Sets and Maps', 13, `
Almost every program works with groups of things: books in a catalogue, members of a library, loans by member. Java's Collections Framework provides ready-made data structures for these, and choosing the right one affects both correctness and speed.

### The three main interfaces

| Interface | Stores | Duplicates | Typical implementations |
|---|---|---|---|
| \`List\` | Ordered elements, accessed by index | Allowed | \`ArrayList\`, \`LinkedList\` |
| \`Set\` | Unique elements | Not allowed | \`HashSet\`, \`LinkedHashSet\`, \`TreeSet\` |
| \`Map\` | Key-value pairs | Keys unique | \`HashMap\`, \`LinkedHashMap\`, \`TreeMap\` |

Declare variables using the interface and choose the implementation on the right:

\`\`\`java
List<String> titles = new ArrayList<>();
Set<String> genres = new HashSet<>();
Map<String, Integer> copiesByIsbn = new HashMap<>();
\`\`\`

This makes it easy to change implementations later, and it matches how Spring Boot code is written.

### Lists

\`\`\`java
List<String> titles = new ArrayList<>();
titles.add("Aangan");
titles.add("Raja Gidh");
titles.add("Aangan");            // duplicates allowed

titles.get(0);                   // "Aangan"
titles.size();                   // 3
titles.contains("Raja Gidh");    // true
titles.remove("Aangan");         // removes the first match
\`\`\`

\`ArrayList\` is the default choice for most lists: fast access by index and fast adding at the end.

### Sets

\`\`\`java
Set<String> genres = new HashSet<>();
genres.add("Fiction");
genres.add("History");
genres.add("Fiction");           // ignored, already present
genres.size();                   // 2
\`\`\`

Use a \`Set\` when uniqueness matters, such as tags or member IDs already processed. \`HashSet\` has no guaranteed order; \`LinkedHashSet\` keeps insertion order; \`TreeSet\` keeps elements sorted.

### Maps

\`\`\`java
Map<String, Integer> copies = new HashMap<>();
copies.put("978-969-0-00001", 3);
copies.put("978-969-0-00002", 1);

copies.get("978-969-0-00001");               // 3
copies.getOrDefault("unknown", 0);           // 0
copies.merge("978-969-0-00002", 1, Integer::sum);   // now 2
copies.containsKey("978-969-0-00001");       // true
\`\`\`

Maps turn slow searches into fast lookups. Finding a book by ISBN in a list of 100,000 books means checking each one; in a \`HashMap\`, it is a single fast lookup.

### Iterating maps

\`\`\`java
for (Map.Entry<String, Integer> entry : copies.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}
\`\`\`

### Immutable collections

\`\`\`java
List<String> cities = List.of("Karachi", "Lahore", "Islamabad");
Map<String, Integer> codes = Map.of("KHI", 21, "LHE", 42);
\`\`\`

These cannot be modified; calling \`add\` throws an exception. Immutable collections are safer to share and signal intent clearly. Returning an immutable list from a method prevents callers accidentally changing internal data.

### Choosing quickly

| Need | Choose |
|---|---|
| Ordered items, duplicates allowed | \`ArrayList\` |
| Unique items, fast "contains" | \`HashSet\` |
| Unique items, sorted | \`TreeSet\` |
| Look up values by key | \`HashMap\` |
| Keys in insertion order | \`LinkedHashMap\` |
| Keys sorted | \`TreeMap\` |

### equals and hashCode matter

\`HashSet\` and \`HashMap\` rely on \`equals\` and \`hashCode\` to find elements. If you put your own objects in them, those methods must be implemented consistently. Records do this automatically, which is another reason they suit value objects used as keys.
      `,
        [
          q('Which collection should store unique genre names?', [
            'ArrayList',
            'LinkedList',
            'HashSet',
            'An array of fixed size',
          ], 2, 'Sets reject duplicates, making them ideal for unique values like genres.'),
          q('Why use a HashMap to find books by ISBN?', [
            'Lookups by key are fast instead of checking every book',
            'Maps keep books in alphabetical order',
            'Maps allow duplicate keys',
            'HashMap uses less memory than any list',
          ], 0, 'A map finds a value directly by key, avoiding a slow scan through a large list.'),
          q('What happens when you call add on a list created with List.of?', [
            'The item is added at the end',
            'The item replaces the first element',
            'Nothing happens silently',
            'An exception is thrown',
          ], 3, 'List.of creates an immutable list, so modification attempts throw an exception.'),
        ]
      ),
      lesson('Generics Without Fear', 12, `
Generics let classes and methods work with different types while keeping type safety. The angle brackets in \`List<String>\` are generics at work. They catch type errors at compile time, remove the need for casts, and appear throughout Spring Boot, for example in \`JpaRepository<Book, Long>\`.

### Why generics exist

Before generics, collections held plain \`Object\` values:

\`\`\`java
List titles = new ArrayList();
titles.add("Aangan");
titles.add(42);                      // allowed, but a mistake
String t = (String) titles.get(1);   // crashes at runtime
\`\`\`

With generics, the compiler prevents the mistake:

\`\`\`java
List<String> titles = new ArrayList<>();
titles.add(42);                      // compile error
String t = titles.get(0);            // no cast needed
\`\`\`

Errors found at compile time are far cheaper than errors found by users.

### Writing a generic class

\`\`\`java
public class Page<T> {
    private final List<T> items;
    private final int pageNumber;
    private final long totalItems;

    public Page(List<T> items, int pageNumber, long totalItems) {
        this.items = items;
        this.pageNumber = pageNumber;
        this.totalItems = totalItems;
    }

    public List<T> getItems() {
        return items;
    }
}
\`\`\`

\`T\` is a type parameter. The same class works for any type:

\`\`\`java
Page<Book> bookPage = new Page<>(books, 0, 250);
Page<Member> memberPage = new Page<>(members, 2, 80);
\`\`\`

Spring Data has its own \`Page<T>\` type that works just like this, as chapter 8 shows.

### Generic methods

\`\`\`java
public static <T> T firstOrDefault(List<T> list, T fallback) {
    return list.isEmpty() ? fallback : list.get(0);
}

String title = firstOrDefault(titles, "No books");
\`\`\`

The \`<T>\` before the return type declares the method's type parameter. Java infers \`T\` from the arguments.

### Bounded types

Sometimes a type parameter must have certain abilities:

\`\`\`java
public static <T extends Comparable<T>> T max(List<T> list) {
    T best = list.get(0);
    for (T item : list) {
        if (item.compareTo(best) > 0) {
            best = item;
        }
    }
    return best;
}
\`\`\`

\`T extends Comparable<T>\` means T must be comparable, so \`compareTo\` can be called.

### Wildcards

Wildcards make methods more flexible:

| Wildcard | Meaning | Typical use |
|---|---|---|
| \`List<?>\` | A list of some unknown type | Reading as Object, such as printing size |
| \`List<? extends Number>\` | A list of Number or any subtype | Reading numbers, for example summing |
| \`List<? super Integer>\` | A list of Integer or any supertype | Adding integers into it |

A memory aid often taught is "producer extends, consumer super": use \`extends\` when the collection produces values you read, and \`super\` when it consumes values you add.

### Type erasure

At runtime, generic type information is mostly erased: a \`List<String>\` and a \`List<Integer>\` are both just \`List\`. That is why you cannot write \`new T()\` or check \`instanceof List<String>\`. For everyday coding this rarely matters, but it explains some compiler messages.

### Reading generic signatures

Generics look intimidating in documentation, such as \`<R> Stream<R> map(Function<? super T, ? extends R> mapper)\`. Read them slowly: it takes a function from T to R, and returns a stream of R. With practice, these signatures become informative rather than scary, and they tell you exactly what a method accepts and returns.
      `,
        [
          q('What is the main benefit of generics?', [
            'Programs run without a JVM',
            'Collections become immutable',
            'Type errors are caught at compile time without casts',
            'Classes can extend several parents',
          ], 2, 'Generics let the compiler check types, removing casts and preventing runtime ClassCastExceptions.'),
          q('What does <T extends Comparable<T>> require?', [
            'T must be a String',
            'T must be comparable, so compareTo can be called',
            'T must extend the List class',
            'T must be a primitive type',
          ], 1, 'The bound guarantees T has a compareTo method, allowing comparisons inside the method.'),
          q('Why can you not write new T() in a generic class?', [
            'T is always null',
            'Generic classes cannot have constructors',
            'Java forbids the new keyword in generic code',
            'Generic type information is erased at runtime',
          ], 3, 'Type erasure removes T at runtime, so the JVM does not know which class to instantiate.'),
        ]
      ),
      lesson('Lambdas and Functional Interfaces', 13, `
Lambdas let you pass behaviour as a value: "sort by this", "keep items that match this", "do this for each one". They made Java far more expressive, and they are used constantly in modern Java, streams and Spring Boot configuration.

### From anonymous classes to lambdas

Sorting books by year used to require a verbose anonymous class:

\`\`\`java
books.sort(new Comparator<Book>() {
    @Override
    public int compare(Book a, Book b) {
        return Integer.compare(a.year(), b.year());
    }
});
\`\`\`

With a lambda:

\`\`\`java
books.sort((a, b) -> Integer.compare(a.year(), b.year()));
\`\`\`

And with a comparator helper and a method reference:

\`\`\`java
books.sort(Comparator.comparing(Book::year));
\`\`\`

### Lambda syntax

\`\`\`java
(parameters) -> expression
(parameters) -> { statements; return value; }

x -> x * 2
(a, b) -> a + b
book -> book.year() > 2000
() -> System.out.println("Done")
\`\`\`

Parameter types are usually inferred. Braces and \`return\` are needed only for multi-line bodies.

### Functional interfaces

A lambda implements a functional interface: an interface with exactly one abstract method. Java provides common ones in \`java.util.function\`:

| Interface | Method | Takes | Returns | Example use |
|---|---|---|---|---|
| \`Predicate<T>\` | \`test\` | T | boolean | Filter available books |
| \`Function<T, R>\` | \`apply\` | T | R | Convert a book to its title |
| \`Consumer<T>\` | \`accept\` | T | nothing | Print or save each item |
| \`Supplier<T>\` | \`get\` | nothing | T | Create a default value lazily |
| \`BiFunction<T, U, R>\` | \`apply\` | T and U | R | Combine two values |

\`\`\`java
Predicate<Book> isRecent = book -> book.year() >= 2015;
Function<Book, String> toTitle = Book::title;
Consumer<String> printer = System.out::println;
Supplier<List<Book>> emptyList = ArrayList::new;
\`\`\`

The \`@FunctionalInterface\` annotation marks your own interfaces intended for lambdas and makes the compiler enforce the single-method rule.

### Method references

Method references are shorthand for lambdas that just call an existing method:

| Lambda | Method reference |
|---|---|
| \`book -> book.title()\` | \`Book::title\` |
| \`s -> System.out.println(s)\` | \`System.out::println\` |
| \`s -> Integer.parseInt(s)\` | \`Integer::parseInt\` |
| \`() -> new ArrayList<>()\` | \`ArrayList::new\` |

### Combining behaviour

Many functional interfaces support composition:

\`\`\`java
Predicate<Book> isRecent = b -> b.year() >= 2015;
Predicate<Book> isUrdu = b -> b.language().equals("Urdu");

List<Book> recentUrdu = books.stream()
        .filter(isRecent.and(isUrdu))
        .toList();

books.sort(Comparator.comparing(Book::author)
        .thenComparing(Book::year, Comparator.reverseOrder()));
\`\`\`

### Effectively final variables

Lambdas can use local variables from the surrounding method only if those variables are effectively final, meaning they are never reassigned:

\`\`\`java
int minYear = 2010;
books.removeIf(b -> b.year() < minYear);   // fine
\`\`\`

This rule prevents confusing bugs, especially with concurrent code.

### Where you will see lambdas in Spring

Spring Security configuration, covered in chapter 10, uses lambdas extensively:

\`\`\`java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/public/**").permitAll()
        .anyRequest().authenticated());
\`\`\`

Being comfortable with lambdas now makes that configuration easy to read later.
      `,
        [
          q('Which functional interface takes a value and returns a boolean?', [
            'Supplier',
            'Consumer',
            'Function',
            'Predicate',
          ], 3, 'Predicate tests a value and returns true or false, which is ideal for filtering.'),
          q('What is Book::title equivalent to?', [
            '() -> new Book()',
            'book -> book.title()',
            'title -> new Book(title)',
            'book -> System.out.println(book)',
          ], 1, 'A method reference to an instance method calls that method on the lambda\'s parameter.'),
          q('Why must local variables used in lambdas be effectively final?', [
            'Lambdas cannot read variables at all',
            'It makes lambdas compile faster',
            'It prevents confusing bugs from values changing unexpectedly',
            'Final variables use less memory',
          ], 2, 'Capturing only unchanging variables keeps lambda behaviour predictable, including across threads.'),
        ]
      ),
      lesson('The Stream API', 14, `
Streams let you describe what you want to do with a collection, such as filter, transform, group or summarise, rather than writing loops step by step. They make data processing code shorter and often clearer, and they appear throughout service layers in Spring Boot applications.

### A first stream

\`\`\`java
List<String> recentTitles = books.stream()
        .filter(book -> book.year() >= 2015)
        .map(Book::title)
        .sorted()
        .toList();
\`\`\`

Read it as a pipeline: take the books, keep recent ones, turn each into its title, sort them, and collect into a list.

### Intermediate and terminal operations

| Type | Examples | Behaviour |
|---|---|---|
| Intermediate | \`filter\`, \`map\`, \`sorted\`, \`distinct\`, \`limit\`, \`flatMap\` | Return a new stream; lazy |
| Terminal | \`toList\`, \`collect\`, \`count\`, \`forEach\`, \`findFirst\`, \`anyMatch\`, \`reduce\` | Produce a result and end the stream |

Streams are lazy: intermediate operations do nothing until a terminal operation runs. A stream can be consumed only once; create a new one to process the data again.

### Common patterns

\`\`\`java
// Count available books
long available = books.stream()
        .filter(Book::isAvailable)
        .count();

// Total fines in paisa
long totalFines = loans.stream()
        .mapToLong(Loan::finePaisa)
        .sum();

// Does any member have more than 5 loans?
boolean overLimit = members.stream()
        .anyMatch(m -> m.loanCount() > 5);

// First overdue loan, if any
Optional<Loan> firstOverdue = loans.stream()
        .filter(Loan::isOverdue)
        .findFirst();
\`\`\`

\`findFirst\` returns an \`Optional\`, because there may be no match. Chapter 5 explains how to use \`Optional\` well.

### Grouping and collecting

Collectors turn streams into maps, sets and summaries:

\`\`\`java
Map<String, List<Book>> byAuthor = books.stream()
        .collect(Collectors.groupingBy(Book::author));

Map<String, Long> countByGenre = books.stream()
        .collect(Collectors.groupingBy(Book::genre, Collectors.counting()));

String titles = books.stream()
        .map(Book::title)
        .collect(Collectors.joining(", "));
\`\`\`

Grouping replaces many lines of manual map-building code.

### flatMap

\`flatMap\` flattens nested collections:

\`\`\`java
List<String> allTags = books.stream()
        .flatMap(book -> book.tags().stream())
        .distinct()
        .toList();
\`\`\`

Each book has a list of tags; \`flatMap\` combines them into one stream.

### Streams versus loops

| Use a stream when | Use a loop when |
|---|---|
| Filtering, mapping, grouping or summarising | Complex step-by-step logic with many conditions |
| The pipeline reads naturally | You need to break out early in complicated ways |
| Transforming one collection into another | Performing side effects like saving each item with error handling |

Readability should decide. A long, clever stream that nobody can follow is worse than a clear loop.

### Common mistakes

- Using \`forEach\` to add items to an external list, instead of collecting.
- Calling \`.get()\` on the result of \`findFirst\` without checking it.
- Modifying the source collection while streaming it.
- Using \`parallelStream\` without measurement; parallel streams add overhead and can cause bugs with shared state. In web applications, requests already run in parallel, so parallel streams rarely help.

### Primitive streams

\`mapToInt\`, \`mapToLong\` and \`mapToDouble\` produce primitive streams with methods like \`sum\`, \`average\` and \`max\`, avoiding the cost of boxing numbers into objects. Use them for numeric calculations.
      `,
        [
          q('What happens when a stream has intermediate operations but no terminal operation?', [
            'It processes all elements immediately',
            'It throws a compile error',
            'It modifies the original collection',
            'Nothing runs, because streams are lazy',
          ], 3, 'Intermediate operations only execute when a terminal operation triggers the pipeline.'),
          q('Which collector counts books per genre?', [
            'Collectors.joining(", ") on the genre names',
            'Collectors.toSet() on the genre names',
            'groupingBy(Book::genre, counting())',
            'Collectors.toList() followed by size()',
          ], 2, 'groupingBy with counting builds a map from each genre to the number of books.'),
          q('Why are parallel streams rarely helpful in web applications?', [
            'Requests already run in parallel, and parallel streams add overhead and risk',
            'Parallel streams are not available in modern Java',
            'Web applications cannot use streams',
            'They always produce wrong results',
          ], 0, 'Concurrency already comes from handling many requests, so parallel streams often cost more than they gain.'),
        ]
      ),
      ],
      [
      q('How should a List variable usually be declared?', [
        'ArrayList<String> titles = new List<>();',
        'Object titles = new ArrayList<>();',
        'List<String> titles = new ArrayList<>();',
        'String[] titles = new ArrayList<>();',
      ], 2, 'Declaring the interface type keeps code flexible while choosing the implementation on the right.'),
      q('What does JpaRepository<Book, Long> use to stay type-safe?', [
        'Reflection only',
        'Static fields',
        'Anonymous classes',
        'Generics',
      ], 3, 'The type parameters tell the repository which entity and ID type it manages.'),
      q('Which is the shortest correct way to sort books by year?', [
        'books.sort(Book.year)',
        'books.sort(Comparator.comparing(Book::year))',
        'books.sort(year -> Book)',
        'Collections.sort(Book::year)',
      ], 1, 'Comparator.comparing with a method reference builds a comparator from the year accessor.'),
      q('Why does findFirst return an Optional?', [
        'Streams cannot return plain objects',
        'Optional is faster than any object',
        'findFirst always finds a value',
        'There may be no matching element',
      ], 3, 'Optional makes the possibility of no result explicit, prompting safe handling.'),
      ]
    ),
    chapter(
      'Robust Java',
      'Handle errors with checked and unchecked exceptions, avoid null problems with Optional, build projects with Maven and Gradle, and prove your code works with JUnit 5 unit tests.',
      [
      lesson('Exceptions and Error Handling', 13, `
Things go wrong in every real program: a file is missing, a network call times out, a user requests a book that does not exist. Exceptions are Java's way of signalling and handling these problems. Handling them well is the difference between an application that fails gracefully and one that crashes or silently corrupts data.

### Throwing and catching

\`\`\`java
public Book findBook(String isbn) {
    Book book = catalogue.get(isbn);
    if (book == null) {
        throw new BookNotFoundException(isbn);
    }
    return book;
}
\`\`\`

\`\`\`java
try {
    Book book = library.findBook("978-969-0-00009");
    System.out.println(book.title());
} catch (BookNotFoundException e) {
    System.out.println("Sorry, that book is not in our catalogue.");
}
\`\`\`

When an exception is thrown, normal execution stops and Java looks for a matching \`catch\` block up the call stack. If none is found, the thread ends with a stack trace.

### Checked and unchecked exceptions

| Type | Extends | Must be declared or caught? | Examples |
|---|---|---|---|
| Checked | \`Exception\` | Yes | \`IOException\`, \`SQLException\` |
| Unchecked | \`RuntimeException\` | No | \`IllegalArgumentException\`, \`NullPointerException\` |
| Errors | \`Error\` | No, and usually not caught | \`OutOfMemoryError\` |

Checked exceptions force callers to deal with them:

\`\`\`java
public String readConfig(Path path) throws IOException {
    return Files.readString(path);
}
\`\`\`

Modern Java and Spring code mostly uses unchecked exceptions for application errors, because forcing every layer to declare them adds noise without much benefit. Spring itself converts many checked database exceptions into unchecked ones.

### Custom exceptions

Domain-specific exceptions make code and error handling clearer:

\`\`\`java
public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(String isbn) {
        super("Book not found: " + isbn);
    }
}
\`\`\`

In Spring Boot, chapter 7 maps exceptions like this to proper HTTP responses, such as 404 Not Found.

### finally and try-with-resources

\`finally\` runs whether or not an exception occurs, useful for cleanup. For resources such as files and connections, try-with-resources closes them automatically:

\`\`\`java
try (BufferedReader reader = Files.newBufferedReader(path)) {
    return reader.readLine();
}   // reader is closed here, even if an exception occurs
\`\`\`

Any object implementing \`AutoCloseable\` works this way. Forgetting to close resources leaks connections, a real problem in long-running servers.

### Handling exceptions well

| Good practice | Bad practice |
|---|---|
| Catch specific exceptions you can handle | Catching \`Exception\` everywhere |
| Add context when rethrowing | Losing the original cause |
| Log once, at the right level | Logging the same error at every layer |
| Fail fast on invalid input | Continuing with bad data |
| Let unexpected errors reach a central handler | Swallowing errors with an empty catch |

The worst pattern is an empty catch block:

\`\`\`java
try {
    processPayment();
} catch (Exception e) {
    // ignored
}
\`\`\`

The payment failed, nobody knows, and the data is now inconsistent. If you catch an exception, handle it meaningfully, or rethrow it with context:

\`\`\`java
} catch (IOException e) {
    throw new ReportGenerationException("Could not write report " + name, e);
}
\`\`\`

Passing \`e\` as the cause preserves the original stack trace, which is invaluable when debugging production problems.

### Validate early

Many exceptions can be avoided by validating input at the boundaries of the system, such as API requests, before it reaches business logic. \`IllegalArgumentException\` is the standard choice for invalid arguments. Spring Boot's validation, covered in chapter 7, does much of this automatically for API requests.
      `,
        [
          q('What is the difference between checked and unchecked exceptions?', [
            'Unchecked exceptions cannot be caught',
            'Checked exceptions must be declared or caught; unchecked ones need not be',
            'Checked exceptions only occur at compile time',
            'There is no difference in modern Java',
          ], 1, 'The compiler enforces handling of checked exceptions, while RuntimeException subclasses are optional to handle.'),
          q('What does try-with-resources guarantee?', [
            'The code inside never throws exceptions',
            'Resources are shared between threads',
            'The program never crashes',
            'Resources are closed automatically, even when exceptions occur',
          ], 3, 'Resources declared in the try header are closed when the block ends, preventing leaks.'),
          q('Why is an empty catch block dangerous?', [
            'It makes the code run slower',
            'It is not allowed by the compiler',
            'Failures are hidden, leaving data inconsistent without anyone knowing',
            'It deletes the stack trace from memory',
          ], 2, 'Swallowed exceptions hide real problems, so failures go unnoticed until they cause bigger damage.'),
        ]
      ),
      lesson('Optional and Null Safety', 12, `
The \`NullPointerException\` is the most common runtime error in Java. It happens when code calls a method on a reference that points to nothing. \`Optional\` and a few disciplined habits make the possibility of "no value" explicit, so it is handled deliberately rather than discovered by crashing.

### The problem with null

\`\`\`java
Member member = memberRepository.findByEmail(email);
String city = member.getAddress().getCity();   // crashes if member is null
\`\`\`

Nothing in the method signature says \`findByEmail\` might return null. The caller forgets to check, and the application fails at runtime, often only for certain users.

### Optional makes absence explicit

\`\`\`java
public Optional<Member> findByEmail(String email) { ... }
\`\`\`

The return type tells every caller: there might be no member. Spring Data repositories use exactly this pattern, returning \`Optional\` from methods like \`findById\`.

### Using Optional well

\`\`\`java
Optional<Member> member = repository.findByEmail(email);

// Provide a default
String name = member.map(Member::name).orElse("Guest");

// Throw a meaningful exception if absent
Member m = repository.findById(id)
        .orElseThrow(() -> new MemberNotFoundException(id));

// Do something only if present
member.ifPresent(m -> sendWelcomeEmail(m));

// Chain transformations safely
String city = member
        .map(Member::address)
        .map(Address::city)
        .orElse("Unknown");
\`\`\`

\`orElseThrow\` is one of the most common lines in Spring Boot services: find the entity, or throw a not-found exception that becomes a 404 response.

### Methods to avoid or use carefully

| Method | Guidance |
|---|---|
| \`get()\` | Avoid; throws if empty, which defeats the purpose |
| \`isPresent()\` followed by \`get()\` | Usually replaceable with \`map\`, \`orElse\` or \`ifPresent\` |
| \`orElse(expensiveCall())\` | The argument is always evaluated; use \`orElseGet(() -> expensiveCall())\` for costly defaults |

### Where not to use Optional

Optional is designed mainly for return values. Guidelines widely followed in the Java community:

- Do not use Optional for fields in entities or DTOs.
- Do not use it for method parameters; overload the method or accept a nullable value with validation instead.
- Do not wrap collections in Optional; return an empty collection instead of null or \`Optional<List<T>>\`.

\`\`\`java
// Good: empty list means "no loans"
public List<Loan> findLoans(Member member) {
    return loans.getOrDefault(member.id(), List.of());
}
\`\`\`

### Other null-safety habits

- Initialise fields in constructors so objects are never half-built.
- Use \`Objects.requireNonNull(value, "message")\` to fail fast when a required value is missing.
- Prefer empty strings and collections over null where it makes sense.
- Use \`Objects.equals(a, b)\`, which handles nulls safely.
- Read the "helpful NullPointerException" messages in modern Java, which tell you exactly which reference was null.

### Annotations

Some teams use nullability annotations, such as \`@Nullable\` and \`@NonNull\` from various libraries or Spring's own, so IDEs can warn about possible null problems. They are a useful extra layer, but the habits above matter more.
      `,
        [
          q('What does returning Optional<Member> communicate to callers?', [
            'The method always returns a member',
            'The method throws an exception if no member exists',
            'There might be no member, so absence must be handled',
            'The member is stored in a cache',
          ], 2, 'Optional in the return type makes the possibility of no value explicit.'),
          q('What does repository.findById(id).orElseThrow(...) do when the entity is missing?', [
            'Returns null to the calling method',
            'Returns a new, empty entity object',
            'Retries the database query until it succeeds',
            'Throws the exception you supplied',
          ], 3, 'orElseThrow unwraps the value if present or throws the provided exception if absent.'),
          q('What should a method return when there are no loans?', [
            'An empty list',
            'null',
            'Optional<List<Loan>>',
            'A list containing a null element',
          ], 0, 'Empty collections represent "none" clearly without null checks or wrapping collections in Optional.'),
        ]
      ),
      lesson('Maven and Gradle Builds', 13, `
Real Java projects depend on many libraries and must be compiled, tested and packaged consistently on every developer's machine and in CI pipelines. Build tools handle this. Maven and Gradle are the two standards, and every Spring Boot project uses one of them.

### What a build tool does

| Job | Example |
|---|---|
| Dependency management | Download Spring Boot, database drivers and test libraries, with correct versions |
| Compilation | Compile source code consistently |
| Testing | Run unit and integration tests |
| Packaging | Produce a runnable JAR file |
| Standard structure | Every project follows the same layout |

### The standard project layout

Both Maven and Gradle use the same conventional structure:

\`\`\`text
library-api/
  pom.xml or build.gradle(.kts)
  src/
    main/
      java/pk/cortexis/library/...     application code
      resources/                       configuration, templates, SQL
    test/
      java/pk/cortexis/library/...     test code
\`\`\`

Following this layout means any Java developer can open your project and immediately know where things are.

### Maven

Maven uses an XML file, \`pom.xml\`:

\`\`\`xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>pk.cortexis</groupId>
  <artifactId>library-api</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <properties>
    <java.version>21</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
\`\`\`

Dependencies are identified by group, artifact and version. The \`test\` scope means the library is only used for tests. Common commands:

\`\`\`bash
./mvnw clean test       # compile and run tests
./mvnw package          # build the JAR in target/
./mvnw dependency:tree  # show all dependencies, including transitive ones
\`\`\`

### Gradle

Gradle uses a Groovy or Kotlin script, \`build.gradle\` or \`build.gradle.kts\`:

\`\`\`groovy
plugins {
    id 'java'
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}
\`\`\`

\`\`\`bash
./gradlew test
./gradlew build          # build output goes to build/libs/
\`\`\`

Gradle is often faster for large projects because of incremental builds and caching; Maven is simpler and very widely used in enterprises. Both work well with Spring Boot. In practice, use whichever your team already uses. This course's examples use Maven, because its XML is explicit and easy for beginners to read.

### Wrappers

The \`mvnw\` and \`gradlew\` scripts are wrappers. They download the correct build tool version automatically, so everyone, including CI servers, uses the same version without installing it. Always commit the wrapper files and use them instead of a globally installed tool.

### Transitive dependencies and versions

Libraries depend on other libraries. Adding one dependency can bring in dozens of others. Spring Boot simplifies this with dependency management: you declare starters without versions, and Spring Boot chooses tested, compatible versions, which chapter 6 explains. Avoid overriding managed versions unless you have a specific reason.

### Security of dependencies

Dependencies can contain vulnerabilities. Keep them updated, use tools that scan for known vulnerabilities in your pipeline, and remove libraries you do not use. Fewer dependencies mean fewer risks and faster builds.
      `,
        [
          q('Where does application code go in the standard layout?', [
            'src/test/java',
            'target/classes',
            'The project root folder',
            'src/main/java',
          ], 3, 'Maven and Gradle expect production code in src/main/java and tests in src/test/java.'),
          q('Why use the mvnw or gradlew wrapper scripts?', [
            'Everyone uses the same build tool version automatically',
            'They make Java code run faster',
            'They replace the need for a JDK',
            'They remove all dependencies',
          ], 0, 'Wrappers download and use a fixed tool version, ensuring consistent builds on every machine.'),
          q('What does the test scope on a dependency mean?', [
            'It is included in production only',
            'It is downloaded but never used',
            'It is available only for compiling and running tests',
            'It must be tested before being used',
          ], 2, 'Test-scoped libraries, like JUnit, are not packaged into the production application.'),
        ]
      ),
      lesson('Unit Testing With JUnit 5', 14, `
Tests are code that checks your code. They catch bugs before users do, let you change code confidently, and document how code is meant to behave. Professional Java developers write tests as a normal part of their work, and employers expect it. JUnit 5 is the standard testing framework.

### A first test

Code to test:

\`\`\`java
public class FineCalculator {
    public long calculatePaisa(int daysLate) {
        if (daysLate < 0) {
            throw new IllegalArgumentException("Days late cannot be negative");
        }
        if (daysLate <= 7) {
            return daysLate * 1_000L;
        }
        return 7_000L + (daysLate - 7) * 2_000L;
    }
}
\`\`\`

The test, in \`src/test/java\`:

\`\`\`java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FineCalculatorTest {

    private final FineCalculator calculator = new FineCalculator();

    @Test
    void noFineWhenReturnedOnTime() {
        assertEquals(0, calculator.calculatePaisa(0));
    }

    @Test
    void standardRateForFirstWeek() {
        assertEquals(5_000, calculator.calculatePaisa(5));
    }

    @Test
    void higherRateAfterFirstWeek() {
        assertEquals(13_000, calculator.calculatePaisa(10));
    }

    @Test
    void rejectsNegativeDays() {
        assertThrows(IllegalArgumentException.class,
                () -> calculator.calculatePaisa(-1));
    }
}
\`\`\`

Run tests from the IDE or with \`./mvnw test\` or \`./gradlew test\`.

### Anatomy of a good test

A common structure is Arrange, Act, Assert:

\`\`\`java
@Test
void borrowingReducesAvailableCopies() {
    // Arrange
    Book book = new Book("Aangan", 2);
    // Act
    book.borrow();
    // Assert
    assertEquals(1, book.getCopiesAvailable());
}
\`\`\`

Good tests are small, fast, independent of each other, and named so that a failure explains itself: \`rejectsNegativeDays\` is clearer than \`test3\`.

### Useful JUnit features

| Feature | Purpose |
|---|---|
| \`@BeforeEach\` | Run setup before every test |
| \`@DisplayName\` | A readable test name in reports |
| \`@ParameterizedTest\` with \`@CsvSource\` | Run one test with many inputs |
| \`@Disabled\` | Temporarily skip a test, with a reason |
| \`assertAll\` | Check several assertions and report all failures |

Parameterized tests are excellent for business rules:

\`\`\`java
@ParameterizedTest
@CsvSource({"0, 0", "1, 1000", "7, 7000", "8, 9000", "10, 13000"})
void calculatesFines(int days, long expectedPaisa) {
    assertEquals(expectedPaisa, calculator.calculatePaisa(days));
}
\`\`\`

### Testing boundaries

Bugs cluster at boundaries. For the fine rule, test 0, 7 and 8 days, not just random values. Also test invalid input and empty collections. Thinking about boundaries is one of the most valuable testing skills.

### Mocking dependencies

When a class depends on others, such as a repository or email sender, tests often replace those dependencies with mocks using Mockito:

\`\`\`java
NotificationSender sender = mock(NotificationSender.class);
ReminderService service = new ReminderService(sender);

service.remindOverdue("ayesha@example.com");

verify(sender).send("ayesha@example.com", "Your book is overdue.");
\`\`\`

This is why constructor injection, from chapter 3, matters: it makes dependencies easy to replace in tests.

### Tests as a safety net

With good tests, you can refactor, upgrade libraries and add features while confident that existing behaviour still works. Without them, every change risks breaking something unnoticed. Chapters 7 and 11 extend testing to Spring controllers and real databases.
      `,
        [
          q('What does assertThrows check?', [
            'That a method returns null',
            'That a test runs quickly',
            'That no exception occurs',
            'That the code throws the expected exception type',
          ], 3, 'assertThrows passes only if the supplied code throws the specified exception.'),
          q('For a rule that changes after 7 days, which inputs are most important to test?', [
            'Only 100 days',
            'Random values chosen each run',
            'Boundaries such as 0, 7 and 8 days, plus invalid input',
            'Only the value 5',
          ], 2, 'Bugs often appear at boundaries, so values around the rule\'s edges deserve tests.'),
          q('Why does constructor injection make testing easier?', [
            'Dependencies can be replaced with mocks when creating the object',
            'It removes the need for assertions',
            'Mockito only works with static methods',
            'Tests cannot create objects without Spring',
          ], 0, 'Passing dependencies into constructors lets tests supply mocks or fakes directly.'),
        ]
      ),
      ],
      [
      q('What is the best way to handle an IOException you cannot fix locally?', [
        'Catch it and do nothing',
        'Print it and continue with bad data',
        'Rethrow it with context and the original cause',
        'Convert it to a null return value silently',
      ], 2, 'Rethrowing with context preserves the cause while explaining what the code was trying to do.'),
      q('Which Optional method is best for a costly default value?', [
        'get()',
        'orElse(expensiveCall())',
        'isPresent()',
        'orElseGet(() -> expensiveCall())',
      ], 3, 'orElseGet evaluates the supplier only when needed, unlike orElse, which always evaluates its argument.'),
      q('What does Spring Boot\'s dependency management provide?', [
        'Automatic test writing',
        'Tested, compatible versions for its starter dependencies',
        'A replacement for the JDK',
        'Free hosting for applications',
      ], 1, 'Spring Boot manages versions of many libraries so they work together reliably.'),
      q('What makes a unit test name useful?', [
        'Numbering tests as test1, test2',
        'Using the developer\'s name',
        'Keeping names as short as possible',
        'Describing the expected behaviour, like rejectsNegativeDays',
      ], 3, 'Descriptive names explain failures immediately and document the rule being tested.'),
      ]
    ),
    chapter(
      'Spring Boot Fundamentals',
      'Understand what Spring and Spring Boot do for you, generate and run a project with Spring Initializr, master dependency injection and beans, and configure applications with properties, YAML and profiles.',
      [
      lesson('What Spring Boot Solves', 13, `
Building a web application from scratch in plain Java means writing a lot of plumbing: starting a web server, parsing HTTP requests, converting JSON, managing database connections, wiring objects together and handling configuration. Spring and Spring Boot provide all of this, tested and battle-hardened, so you can focus on the business logic.

### Spring and Spring Boot

| | Spring Framework | Spring Boot |
|---|---|---|
| What it is | A large framework for building Java applications | A layer on top of Spring that makes it quick to start and configure |
| Main idea | Dependency injection, plus modules for web, data, security and more | Sensible defaults, auto-configuration and starter dependencies |
| Setup | Historically needed a lot of configuration | Minimal configuration; runs as a standalone application |

Spring Boot does not replace Spring; it makes using Spring much easier.

### What Spring Boot gives you

- **Starters**: single dependencies that bring in everything needed for a feature, such as \`spring-boot-starter-web\` for REST APIs.
- **Auto-configuration**: Spring Boot looks at your dependencies and configures sensible defaults. Add a PostgreSQL driver and datasource settings, and a connection pool is configured automatically.
- **Embedded server**: the application includes a web server, Tomcat by default, so it runs with \`java -jar app.jar\`. No separate server installation.
- **Production features**: health checks, metrics and externalised configuration through Actuator and the configuration system.
- **Dependency management**: compatible versions of many libraries, chosen and tested together.

### Before and after

\`\`\`text
Without Spring Boot:
  Install and configure an application server
  Write XML or Java configuration for every component
  Choose compatible versions of dozens of libraries by hand
  Deploy a WAR file to the server

With Spring Boot:
  Generate a project, add starters
  Write your controllers and services
  Run: ./mvnw spring-boot:run   or   java -jar target/app.jar
\`\`\`

### Inversion of control

The central idea of Spring is inversion of control. Instead of your code creating the objects it needs, Spring creates them and provides them. You describe components; Spring assembles the application:

\`\`\`java
@Service
public class LoanService {
    private final BookRepository books;
    private final NotificationSender sender;

    public LoanService(BookRepository books, NotificationSender sender) {
        this.books = books;
        this.sender = sender;
    }
}
\`\`\`

\`LoanService\` never calls \`new BookRepository()\`. Spring sees the constructor, finds suitable objects and passes them in. This is dependency injection, explained fully in the third lesson.

### Why companies choose Spring Boot

- It is mature, well-documented and widely known, reducing hiring and onboarding risk.
- It integrates with nearly every database, message broker and cloud platform.
- Its conventions make large codebases consistent across teams.
- Security, testing and monitoring are first-class concerns.

Banks, telecom companies, fintechs and software houses in Pakistan use Spring Boot heavily for back-end APIs, and it appears in a large share of Java job advertisements.

### The magic is not magic

Auto-configuration can feel magical. Behind it are ordinary Java classes that create beans when certain conditions are met, for example "if a DataSource class is on the classpath and no DataSource bean exists, create one". You can always override defaults with your own configuration. When something behaves unexpectedly, the application's startup logs and debug output explain which configurations were applied.
      `,
        [
          q('What does Spring Boot\'s auto-configuration do?', [
            'Writes business logic automatically',
            'Configures sensible defaults based on your dependencies',
            'Converts Java code to JavaScript',
            'Removes the need for any code',
          ], 1, 'Auto-configuration detects libraries on the classpath and sets up matching components with defaults.'),
          q('Why can a Spring Boot application run with java -jar?', [
            'It is compiled to native machine code only',
            'It runs inside the IDE permanently',
            'It uses the browser as a server',
            'It includes an embedded web server',
          ], 3, 'The embedded server, Tomcat by default, starts inside the application itself.'),
          q('What is inversion of control in Spring?', [
            'Controllers call the database directly',
            'Objects create all their own dependencies',
            'Spring creates objects and provides their dependencies',
            'The user controls the order of method calls',
          ], 2, 'Spring takes responsibility for creating and wiring objects, rather than each class creating its own.'),
        ]
      ),
      lesson('Creating a Project With Spring Initializr', 13, `
Spring Initializr generates a ready-to-run Spring Boot project with the build tool, Java version and starters you choose. It is available at start.spring.io and built into IntelliJ IDEA and VS Code. Every new Spring Boot project should start here.

### Choosing the options

| Option | Choice for this course |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot version | The latest stable (non-snapshot) version |
| Group | \`pk.cortexis\` |
| Artifact | \`library-api\` |
| Packaging | Jar |
| Java | 21 or newer LTS |

### Choosing dependencies

For a REST API with a database, typical starters are:

| Dependency | Provides |
|---|---|
| Spring Web | REST controllers, embedded Tomcat, JSON with Jackson |
| Validation | Bean Validation annotations such as \`@NotBlank\` |
| Spring Data JPA | Repositories and Hibernate for relational databases |
| PostgreSQL Driver | Connection to PostgreSQL |
| Flyway Migration | Versioned database migrations |
| Spring Boot Actuator | Health checks and metrics |
| Spring Boot DevTools | Automatic restart during development |

You can add more later, such as Spring Security in chapter 10. Start with what you need.

### The generated project

\`\`\`text
library-api/
  mvnw, mvnw.cmd, .mvn/          Maven wrapper
  pom.xml                        build file with starters
  src/main/java/pk/cortexis/libraryapi/
      LibraryApiApplication.java main class
  src/main/resources/
      application.properties     configuration
  src/test/java/pk/cortexis/libraryapi/
      LibraryApiApplicationTests.java
\`\`\`

### The main class

\`\`\`java
package pk.cortexis.libraryapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LibraryApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibraryApiApplication.class, args);
    }
}
\`\`\`

\`@SpringBootApplication\` combines three annotations: it marks a configuration class, enables auto-configuration, and turns on component scanning of this package and its sub-packages. Always keep your other classes in sub-packages of the main class's package, or Spring will not find them.

### Running the application

\`\`\`bash
./mvnw spring-boot:run
\`\`\`

Startup logs show the Spring Boot version, active profiles, and a line such as \`Tomcat started on port 8080\`. If you added JPA and a database driver without configuring a database, startup fails with a datasource error; configure it as shown in the final lesson of this chapter, or temporarily remove the JPA dependency while experimenting.

### A first endpoint

\`\`\`java
package pk.cortexis.libraryapi.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Library API is running";
    }
}
\`\`\`

Restart and visit \`http://localhost:8080/api/hello\`. You have a working REST endpoint in a few lines. Chapter 7 builds real endpoints with JSON, validation and error handling.

### Package structure

Organise code by feature or layer from the start:

\`\`\`text
pk.cortexis.libraryapi
  book/        Book entity, repository, service, controller, DTOs
  member/      Member-related classes
  loan/        Loan-related classes
  config/      Configuration classes
  common/      Shared utilities, error handling
\`\`\`

Grouping by feature keeps related classes together, which helps as the application grows. Chapter 9 discusses architecture in more depth.
      `,
        [
          q('What does @SpringBootApplication enable?', [
            'Only the embedded web server',
            'Database migrations',
            'Configuration, auto-configuration and component scanning',
            'Spring Security with default passwords',
          ], 2, 'It combines configuration, auto-configuration and scanning of the main package and sub-packages.'),
          q('Why must classes live in sub-packages of the main application class\'s package?', [
            'Component scanning starts from the main class\'s package',
            'Java requires all classes in one package',
            'Maven only compiles sub-packages',
            'It makes the JAR smaller',
          ], 0, 'Spring scans the main package and its sub-packages, so classes elsewhere are not found automatically.'),
          q('Which starter provides REST controllers and embedded Tomcat?', [
            'Spring Data JPA',
            'Flyway Migration',
            'Spring Boot Actuator',
            'Spring Web',
          ], 3, 'spring-boot-starter-web includes Spring MVC, Jackson for JSON and embedded Tomcat.'),
        ]
      ),
      lesson('Dependency Injection and Beans', 14, `
Dependency injection is the heart of Spring. Understanding beans, how they are created and how they are injected explains almost everything Spring does, and it makes errors like "No qualifying bean found" easy to fix.

### Beans and the application context

A bean is an object managed by Spring. When the application starts, Spring creates an application context: a container holding all beans, created once and wired together. By default, beans are singletons, one shared instance for the whole application.

### Declaring beans

The most common way is to annotate classes, so component scanning finds them:

| Annotation | Used for |
|---|---|
| \`@Component\` | A general Spring-managed class |
| \`@Service\` | Business logic |
| \`@Repository\` | Data access; also translates database exceptions |
| \`@RestController\` | REST API controllers |
| \`@Configuration\` | Classes that define beans with \`@Bean\` methods |

For classes you do not own, such as a library's client, declare beans in a configuration class:

\`\`\`java
@Configuration
public class AppConfig {

    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
\`\`\`

### Constructor injection

The recommended way to receive dependencies is through the constructor:

\`\`\`java
@Service
public class LoanService {
    private final BookRepository bookRepository;
    private final Clock clock;

    public LoanService(BookRepository bookRepository, Clock clock) {
        this.bookRepository = bookRepository;
        this.clock = clock;
    }
}
\`\`\`

With a single constructor, Spring uses it automatically; no \`@Autowired\` annotation is needed. Constructor injection has important advantages:

- Dependencies are \`final\`, so they cannot change after construction.
- The class cannot be created without its dependencies.
- Tests can create the class with mocks, as chapter 5 showed.

Field injection, with \`@Autowired\` on private fields, still appears in older code but hides dependencies and makes testing harder. Prefer constructors.

### When several beans match

If two beans implement the same interface, Spring cannot choose:

\`\`\`text
No qualifying bean of type 'NotificationSender' available:
expected single matching bean but found 2: emailSender, smsSender
\`\`\`

Solutions:

\`\`\`java
@Component
@Primary
public class EmailSender implements NotificationSender { ... }
\`\`\`

\`@Primary\` marks the default choice. Or choose explicitly with a qualifier:

\`\`\`java
public ReminderService(@Qualifier("smsSender") NotificationSender sender) { ... }
\`\`\`

You can also inject all implementations as a \`List<NotificationSender>\` when you want to use every one of them.

### Why the Clock bean?

Injecting a \`Clock\` instead of calling \`LocalDate.now()\` directly makes time-based logic testable. In tests, you provide a fixed clock, such as 15 March 2025, and can reliably check overdue calculations. This small habit shows how dependency injection improves design beyond just wiring objects.

### Bean scopes

| Scope | Instances |
|---|---|
| Singleton (default) | One per application context |
| Prototype | A new instance each time it is requested |
| Request, session | One per HTTP request or session, in web applications |

Because singletons are shared across all requests, they must not store request-specific data in fields. A service that saves "the current user" in a field would mix up users under concurrent requests, a serious bug. Keep services stateless and pass request data as method parameters.

### Common startup errors

| Error | Usual cause |
|---|---|
| No qualifying bean of type X | Class not annotated, or outside scanned packages |
| Expected single matching bean but found 2 | Missing \`@Primary\` or \`@Qualifier\` |
| Circular dependency | Two beans require each other; redesign responsibilities |
      `,
        [
          q('What is the default scope of a Spring bean?', [
            'Prototype',
            'Request',
            'Singleton',
            'Session',
          ], 2, 'By default, Spring creates one shared instance of each bean per application context.'),
          q('Why is constructor injection recommended over field injection?', [
            'Field injection does not work in Spring',
            'Constructors run faster than fields',
            'It removes the need for annotations on classes',
            'Dependencies are explicit, final and easy to replace in tests',
          ], 3, 'Constructor injection makes required dependencies clear and supports immutable fields and simple testing.'),
          q('Why must singleton services not store request-specific data in fields?', [
            'One instance serves all requests, so data would mix between users',
            'Fields are deleted after each request',
            'Spring forbids fields in services',
            'It makes startup slower',
          ], 0, 'Shared singletons handle concurrent requests, so per-request state belongs in method parameters.'),
        ]
      ),
      lesson('Configuration, Profiles and application.yml', 13, `
Applications need settings: database URLs, API keys, feature flags, limits. These differ between a developer's laptop, a test server and production. Spring Boot's configuration system keeps settings outside the code and lets each environment provide its own values.

### Properties and YAML

Configuration lives in \`src/main/resources/application.properties\` or \`application.yml\`. The same settings in both formats:

\`\`\`properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/library
spring.datasource.username=library
spring.datasource.password=secret
library.loan.max-days=14
\`\`\`

\`\`\`yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library
    username: library
    password: secret
library:
  loan:
    max-days: 14
\`\`\`

YAML is easier to read for nested settings; indentation must be consistent, using spaces. Use one format per project.

### Reading your own settings

For a single value, \`@Value\` works:

\`\`\`java
@Value("\${library.loan.max-days}")
private int maxLoanDays;
\`\`\`

For groups of settings, type-safe configuration properties are cleaner and can be validated:

\`\`\`java
@ConfigurationProperties(prefix = "library.loan")
public record LoanProperties(int maxDays, int maxBooks) {}
\`\`\`

Enable it on the main class or a configuration class with \`@EnableConfigurationProperties(LoanProperties.class)\` or \`@ConfigurationPropertiesScan\`, then inject \`LoanProperties\` like any bean. Note that \`max-days\` in YAML maps to \`maxDays\` in Java automatically.

### Validate settings at startup

A missing or wrong setting should stop the application at startup, not cause a strange failure hours later. Add \`@Validated\` to a properties record and use validation annotations:

\`\`\`java
@Validated
@ConfigurationProperties(prefix = "library.loan")
public record LoanProperties(@Min(1) @Max(60) int maxDays,
                             @Min(1) int maxBooks) {}
\`\`\`

If \`max-days\` is set to 0 or left out, startup fails with a clear message naming the property. Failing fast at startup is far easier to diagnose than a bug discovered by users in production.

### Profiles

Profiles let different environments use different settings:

\`\`\`text
application.yml          shared defaults
application-dev.yml      local development
application-test.yml     automated tests
application-prod.yml     production
\`\`\`

Activate a profile with a property or environment variable:

\`\`\`bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
java -jar app.jar --spring.profiles.active=prod
\`\`\`

Profile-specific files override the shared defaults. Beans can also be limited to a profile with \`@Profile("dev")\`, for example a fake email sender for development. The startup log always prints which profiles are active, so check it first when an environment seems to be using the wrong settings.

### Environment variables override files

Spring Boot reads configuration from many sources in a defined order. Environment variables and command-line arguments override values in files. Relaxed binding maps names automatically:

\`\`\`text
spring.datasource.url    <->   SPRING_DATASOURCE_URL
library.loan.max-days    <->   LIBRARY_LOAN_MAXDAYS
\`\`\`

This is how production settings are supplied in containers and cloud platforms, as chapter 11 shows.

### Never commit secrets

Passwords, API keys and JWT signing secrets must not be committed to Git. Use placeholders with environment variables:

\`\`\`yaml
spring:
  datasource:
    password: \${DB_PASSWORD}
\`\`\`

For local development, a developer can set variables in their IDE run configuration or use a local profile file that is excluded from version control. Leaked credentials in public repositories are a common and serious security incident.

### Development conveniences

Spring Boot DevTools restarts the application automatically when code changes, speeding up development. It is disabled automatically when running a packaged JAR, so it does not affect production. Combined with profiles, it gives a fast, safe development setup.
      `,
        [
          q('What does a profile such as application-prod.yml provide?', [
            'Settings that override defaults when the prod profile is active',
            'A backup of the development database',
            'Production-only Java classes',
            'Faster compilation',
          ], 0, 'Profile-specific files supply environment-specific values on top of shared defaults.'),
          q('How does SPRING_DATASOURCE_URL relate to spring.datasource.url?', [
            'They are unrelated settings',
            'The environment variable is ignored if a file exists',
            'It only works on Windows',
            'Relaxed binding maps the environment variable to that property',
          ], 3, 'Spring Boot maps environment variables to property names, and they override file values.'),
          q('Where should a production database password come from?', [
            'Hard-coded in a Java class',
            'Committed in application.yml',
            'An environment variable or secret store',
            'A comment in the README',
          ], 2, 'Secrets belong outside version control, supplied by the environment at runtime.'),
        ]
      ),
      ],
      [
      q('What does a Spring Boot starter provide?', [
        'A complete finished application',
        'A free cloud server',
        'A single dependency bringing everything needed for a feature',
        'A replacement for the JDK',
      ], 2, 'Starters bundle compatible libraries for a feature, such as web or JPA, in one dependency.'),
      q('Where is Spring Initializr available?', [
        'Only inside Eclipse',
        'At start.spring.io and inside popular IDEs',
        'Only through paid subscriptions',
        'Only on Linux servers',
      ], 1, 'Initializr is a free web tool, also integrated into IntelliJ IDEA and VS Code.'),
      q('Spring reports two NotificationSender beans and cannot choose. What fixes it?', [
        'Removing the interface',
        'Making both beans prototype-scoped',
        'Renaming the main class',
        'Marking one @Primary or using @Qualifier',
      ], 3, '@Primary sets a default, while @Qualifier chooses a specific bean at the injection point.'),
      q('Why inject a Clock bean instead of calling LocalDate.now() directly?', [
        'Tests can supply a fixed time for reliable results',
        'LocalDate.now() is not allowed in Spring',
        'Clock beans make the application start faster',
        'It changes the server\'s time zone',
      ], 0, 'An injected Clock lets tests control time, making date logic predictable to test.'),
      ]
    ),
    chapter(
      'Building REST APIs',
      'Build REST controllers with request mappings, path variables and query parameters, validate input with DTOs and return clean error responses, design APIs that clients love, and test controllers with MockMvc.',
      [
      lesson('Controllers and Request Mapping', 14, `
A REST API lets other programs, such as a React front end, a mobile app or another service, work with your application over HTTP. In Spring Boot, controllers receive HTTP requests, call the right business logic and return responses, usually as JSON. They are the front door of your application.

### A book controller

\`\`\`java
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<BookResponse> list() {
        return bookService.findAll();
    }

    @GetMapping("/{id}")
    public BookResponse get(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse create(@Valid @RequestBody CreateBookRequest request) {
        return bookService.create(request);
    }

    @PutMapping("/{id}")
    public BookResponse update(@PathVariable Long id,
                               @Valid @RequestBody UpdateBookRequest request) {
        return bookService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookService.delete(id);
    }
}
\`\`\`

### The key annotations

| Annotation | Purpose |
|---|---|
| \`@RestController\` | A controller whose return values are written as the response body, usually JSON |
| \`@RequestMapping("/api/books")\` | Base path for all methods in the class |
| \`@GetMapping\`, \`@PostMapping\`, \`@PutMapping\`, \`@PatchMapping\`, \`@DeleteMapping\` | Map HTTP methods to Java methods |
| \`@PathVariable\` | Read a value from the URL path, like \`/api/books/42\` |
| \`@RequestParam\` | Read a query parameter, like \`?author=Hyder\` |
| \`@RequestBody\` | Convert the JSON body into a Java object |
| \`@ResponseStatus\` | Set the HTTP status for a successful response |

### Query parameters

\`\`\`java
@GetMapping("/search")
public List<BookResponse> search(@RequestParam String q,
                                 @RequestParam(defaultValue = "false") boolean availableOnly) {
    return bookService.search(q, availableOnly);
}
\`\`\`

A request to \`/api/books/search?q=aangan&availableOnly=true\` fills both parameters. Optional parameters use \`required = false\` or a default value.

### JSON conversion

Spring Boot uses Jackson to convert between Java objects and JSON automatically. A record like:

\`\`\`java
public record BookResponse(Long id, String title, String author, int copiesAvailable) {}
\`\`\`

becomes:

\`\`\`json
{ "id": 1, "title": "Aangan", "author": "Khadija Mastoor", "copiesAvailable": 2 }
\`\`\`

### ResponseEntity for full control

When you need to control headers or choose the status dynamically, return \`ResponseEntity\`:

\`\`\`java
@PostMapping
public ResponseEntity<BookResponse> create(@Valid @RequestBody CreateBookRequest request) {
    BookResponse created = bookService.create(request);
    URI location = URI.create("/api/books/" + created.id());
    return ResponseEntity.created(location).body(created);
}
\`\`\`

This returns 201 Created with a \`Location\` header pointing to the new resource, a REST convention clients appreciate.

### Keep controllers thin

Controllers should translate HTTP to method calls and back: read input, call a service, return a response. Business rules, such as "a member cannot borrow more than five books", belong in the service layer. Thin controllers are easier to test and change, and chapter 9 explains the layered structure in detail.

### Trying the API

Test endpoints with tools like curl, Postman, the IntelliJ HTTP client or Bruno:

\`\`\`http
POST http://localhost:8080/api/books
Content-Type: application/json

{ "title": "Aangan", "author": "Khadija Mastoor", "copies": 2 }
\`\`\`

Checking the status code and response body for each endpoint, including error cases, is part of building an API, not an afterthought.
      `,
        [
          q('What does @PathVariable read?', [
            'The JSON request body',
            'A query parameter after the question mark',
            'A value from the URL path, such as the id in /api/books/42',
            'An HTTP header',
          ], 2, 'Path variables extract segments of the URL path defined in the mapping template.'),
          q('What status and header does ResponseEntity.created(location) send?', [
            '200 OK with no headers',
            '201 Created with a Location header',
            '204 No Content with a Location header',
            '404 Not Found',
          ], 1, 'created() returns 201 and sets Location to the URI of the new resource.'),
          q('Where should the rule "members cannot borrow more than five books" live?', [
            'In the controller method',
            'In the JSON response',
            'In the application.yml file',
            'In the service layer',
          ], 3, 'Business rules belong in services, keeping controllers thin and focused on HTTP.'),
        ]
      ),
      lesson('DTOs, Validation and Error Responses', 14, `
APIs receive input from the outside world, which may be incomplete, malformed or malicious. Validating input at the boundary and returning clear, consistent errors makes an API safe and pleasant to use. Data transfer objects (DTOs) and Spring's validation support do most of the work.

### Why DTOs?

A DTO is a simple object shaped for the API, separate from the database entity:

\`\`\`java
public record CreateBookRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank String author,
        @Min(0) @Max(1000) int copies,
        @Pattern(regexp = "\\\\d{13}") String isbn
) {}
\`\`\`

Separating DTOs from entities means:

- Clients cannot set fields they should not, such as an internal \`id\` or \`createdAt\`.
- The database structure can change without breaking the API.
- Sensitive fields, like a member's password hash, are never accidentally returned.
- Validation rules sit exactly where input arrives.

### Common validation annotations

| Annotation | Checks |
|---|---|
| \`@NotNull\` | Value is not null |
| \`@NotBlank\` | String is not null and contains non-whitespace |
| \`@Size(min, max)\` | Length of a string or size of a collection |
| \`@Min\`, \`@Max\` | Numeric range |
| \`@Email\` | Valid email format |
| \`@Pattern\` | Matches a regular expression |
| \`@Past\`, \`@Future\` | Date is in the past or future |
| \`@Valid\` | Validate a nested object |

Validation annotations come from Jakarta Bean Validation, included with the Validation starter. \`@Valid\` on the controller parameter triggers validation; without it, annotations are ignored.

### What happens on invalid input

When validation fails, Spring throws \`MethodArgumentNotValidException\` and returns 400 Bad Request. The default response is not very friendly, so most APIs customise it.

### Consistent errors with ProblemDetail

Modern Spring supports the Problem Details standard for HTTP APIs, a JSON format for errors. A global exception handler maps exceptions to responses:

\`\`\`java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(BookNotFoundException.class)
    public ProblemDetail handleNotFound(BookNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Book not found");
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation failed");
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        problem.setProperty("errors", errors);
        return problem;
    }
}
\`\`\`

A client sending an empty title now receives:

\`\`\`json
{
  "type": "about:blank",
  "title": "Validation failed",
  "status": 400,
  "instance": "/api/books",
  "errors": { "title": "must not be blank" }
}
\`\`\`

A front-end developer can show each message next to the right form field.

### Mapping exceptions to status codes

| Exception | Status |
|---|---|
| Validation failure | 400 Bad Request |
| Not authenticated | 401 Unauthorized |
| Not allowed | 403 Forbidden |
| Resource not found | 404 Not Found |
| Business rule conflict, such as no copies available | 409 Conflict |
| Unexpected error | 500 Internal Server Error |

### Never leak internals

Unexpected exceptions should produce a generic 500 response, while the full stack trace goes to the server logs. Returning stack traces or SQL errors to clients reveals internal details attackers can use. Spring Boot's defaults hide stack traces; keep it that way in production.
      `,
        [
          q('Why use DTOs instead of exposing entities directly?', [
            'Entities can never be converted to JSON by Jackson',
            'DTOs make database queries run noticeably faster',
            'They control what clients send and see',
            'Spring refuses to start without a DTO for every class',
          ], 2, 'DTOs shape the API independently of entities, protecting internal and sensitive fields.'),
          q('What triggers validation of a @RequestBody parameter?', [
            'The @NotBlank annotation alone',
            'The @RestController annotation',
            'Adding the class to application.yml',
            'The @Valid annotation on the parameter',
          ], 3, 'Without @Valid, Spring does not validate the request body, and constraint annotations are ignored.'),
          q('Which status code fits "no copies available to borrow"?', [
            '200 OK',
            '401 Unauthorized',
            '409 Conflict',
            '500 Internal Server Error',
          ], 2, 'A conflict with the current state of a resource, such as a business rule violation, suits 409.'),
        ]
      ),
      lesson('Designing a Clean REST API', 13, `
A well-designed API is predictable: once developers learn one endpoint, they can guess the others. Poor design leads to confusion, bugs and support requests from every team that uses your API. A few widely accepted conventions make a big difference.

### Resources, not actions

REST APIs are organised around resources, named with plural nouns, and HTTP methods express the action:

| Action | Method and path |
|---|---|
| List books | \`GET /api/books\` |
| Get one book | \`GET /api/books/42\` |
| Create a book | \`POST /api/books\` |
| Replace a book | \`PUT /api/books/42\` |
| Partially update | \`PATCH /api/books/42\` |
| Delete a book | \`DELETE /api/books/42\` |
| A member's loans | \`GET /api/members/7/loans\` |

Avoid verbs in paths such as \`/api/getBooks\` or \`/api/deleteBook?id=42\`. Operations that do not fit neatly, such as borrowing, can be modelled as creating a resource: \`POST /api/loans\` with the book and member in the body.

### HTTP methods and their meaning

- **GET** only reads; it must not change data. Browsers, caches and crawlers assume this.
- **POST** creates, or triggers processing.
- **PUT** replaces a resource entirely and is idempotent: sending it twice has the same effect as once.
- **PATCH** changes part of a resource.
- **DELETE** removes a resource and is idempotent.

### Status codes

Use them correctly and consistently:

\`\`\`text
200 OK            successful GET, PUT, PATCH
201 Created       successful POST that created something
204 No Content    successful DELETE, or update with no body
400 Bad Request   invalid input
404 Not Found     resource does not exist
409 Conflict      business rule or state conflict
\`\`\`

Returning 200 with \`{"error": "not found"}\` in the body forces every client to parse bodies to detect errors. Use the status code.

### Pagination, filtering and sorting

Never return unlimited lists; a table with 100,000 rows would overwhelm the server and client. Use query parameters:

\`\`\`text
GET /api/books?page=0&size=20&sort=title,asc
GET /api/books?author=Hyder&available=true
\`\`\`

Spring Data supports this pattern directly, as chapter 8 shows, returning page metadata such as total elements and total pages.

### Consistent naming and formats

- Use one naming style for JSON fields, typically camelCase in Java APIs.
- Use ISO 8601 for dates and times: \`2025-03-15\` and \`2025-03-15T10:30:00Z\`.
- Represent money carefully, for example as an amount in minor units plus a currency code.
- Keep response shapes consistent across endpoints.

### Versioning

APIs evolve, and existing clients must not break. Common approaches:

\`\`\`text
Path version:     /api/v1/books
Header version:   Accept: application/vnd.library.v1+json
\`\`\`

Path versioning is simple and widely used. Add new fields freely, since clients should ignore unknown fields, but treat removing or renaming fields as breaking changes requiring a new version.

### Document the API

The springdoc-openapi library generates OpenAPI documentation and a Swagger UI page from your controllers and DTOs. Front-end and mobile developers can explore and try endpoints in the browser. Good documentation reduces questions and speeds up every team that integrates with your API.
      `,
        [
          q('Which path follows REST conventions for listing books?', [
            'GET /api/getBooks',
            'POST /api/books/list',
            'GET /api/books',
            'GET /api/book-listing-action',
          ], 2, 'REST uses plural nouns for resources and the HTTP method to express the action.'),
          q('Why must GET requests not change data?', [
            'GET requests cannot reach the server',
            'Spring blocks database writes in GET methods',
            'Browsers, caches and crawlers assume GET is safe to repeat',
            'GET requests have no URL',
          ], 2, 'Clients and infrastructure may repeat or prefetch GET requests, so they must only read.'),
          q('Why paginate list endpoints?', [
            'Pagination is required by JSON',
            'Clients cannot read more than ten items',
            'It removes the need for sorting',
            'Unlimited lists can overwhelm the server and clients',
          ], 3, 'Returning data in pages keeps responses fast and memory use predictable.'),
        ]
      ),
      lesson('Testing Controllers With MockMvc', 12, `
Controller tests check the HTTP layer: correct paths, status codes, JSON shapes, validation and error responses. Spring's MockMvc lets you test controllers without starting a real server, making these tests fast enough to run on every build.

### A slice test with @WebMvcTest

\`@WebMvcTest\` starts only the web layer for the chosen controller, not the whole application. Services are replaced with mocks:

\`\`\`java
@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @Test
    void returnsBookById() throws Exception {
        when(bookService.findById(1L))
            .thenReturn(new BookResponse(1L, "Aangan", "Khadija Mastoor", 2));

        mockMvc.perform(get("/api/books/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.title").value("Aangan"))
               .andExpect(jsonPath("$.copiesAvailable").value(2));
    }
}
\`\`\`

\`@MockitoBean\` replaces the real \`BookService\` bean with a Mockito mock. Older Spring Boot versions use \`@MockBean\` for the same purpose.

### Testing validation

\`\`\`java
@Test
void rejectsBlankTitle() throws Exception {
    String body = """
        { "title": "", "author": "Khadija Mastoor", "copies": 1,
          "isbn": "9789690000011" }
        """;

    mockMvc.perform(post("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.errors.title").exists());

    verifyNoInteractions(bookService);
}
\`\`\`

The test proves that invalid input is rejected before reaching the service. Text blocks from chapter 2 keep the JSON readable.

### Testing error handling

\`\`\`java
@Test
void returns404WhenBookMissing() throws Exception {
    when(bookService.findById(99L)).thenThrow(new BookNotFoundException("99"));

    mockMvc.perform(get("/api/books/99"))
           .andExpect(status().isNotFound())
           .andExpect(jsonPath("$.title").value("Book not found"));
}
\`\`\`

This also confirms that the global exception handler from the DTO and validation lesson is wired correctly.

### What to test at each level

| Test type | Checks | Speed |
|---|---|---|
| Unit tests (services) | Business rules | Very fast |
| Web slice tests (MockMvc) | Paths, status codes, JSON, validation, errors | Fast |
| Integration tests (chapter 11) | Full application with a real database | Slower |

A healthy project has many unit tests, a good set of web tests and fewer, focused integration tests.

### Useful MockMvc checks

\`\`\`text
status().isOk(), isCreated(), isNoContent(), isBadRequest(), isNotFound()
jsonPath("$.field").value(...)
jsonPath("$.length()").value(3)
header().string("Location", "/api/books/1")
content().contentType(MediaType.APPLICATION_JSON)
\`\`\`

Recent Spring versions also offer \`MockMvcTester\`, with a fluent AssertJ style; both approaches are valid.

### Common mistakes in controller tests

A few mistakes make controller tests fragile or misleading:

- **Testing business logic here**: rules like loan limits belong in service unit tests; controller tests should mock the service and focus on HTTP behaviour.
- **Only testing the happy path**: most API bugs appear in error cases, so test invalid input, missing resources and conflicts too.
- **Asserting on entire JSON strings**: small, harmless changes such as field order break them. Check the specific fields that matter with \`jsonPath\`.
- **Forgetting the content type**: a POST without \`contentType(MediaType.APPLICATION_JSON)\` returns 415 Unsupported Media Type, which can confuse beginners into thinking validation failed.

Keeping each test focused on one behaviour makes failures easy to understand and fix.

### Tests as documentation

Well-named controller tests describe the API's behaviour: \`returnsBookById\`, \`rejectsBlankTitle\`, \`returns404WhenBookMissing\`. New team members can read them to understand exactly how the API responds, including error cases that documentation often forgets.
      `,
        [
          q('What does @WebMvcTest start?', [
            'The entire application with a real database',
            'Only the web layer for the chosen controller',
            'A production server on port 80',
            'Only the database layer',
          ], 1, 'Slice tests load just the MVC components needed, keeping controller tests fast.'),
          q('What does @MockitoBean do in a controller test?', [
            'Deletes the service from the project',
            'Starts a real database for the service',
            'Replaces the real bean with a Mockito mock',
            'Generates the controller automatically',
          ], 2, 'It swaps the bean in the test context for a mock whose behaviour the test controls.'),
          q('Why check verifyNoInteractions(bookService) in a validation test?', [
            'To make the test run faster',
            'Because services cannot be mocked',
            'To test the database connection',
            'To prove invalid input never reached the service',
          ], 3, 'Confirming the service was not called shows validation stopped the bad request at the boundary.'),
        ]
      ),
      ],
      [
      q('Which annotation converts a JSON request body into a Java object?', [
        '@PathVariable',
        '@RequestParam',
        '@RequestBody',
        '@ResponseStatus',
      ], 2, '@RequestBody tells Spring to deserialise the body, usually JSON, into the parameter type.'),
      q('What does @RestControllerAdvice provide?', [
        'Central exception handling across all controllers',
        'Automatic API versioning',
        'Database connection pooling',
        'Security for every endpoint',
      ], 0, 'It lets one class map exceptions to consistent error responses for the whole API.'),
      q('What is the correct response for a successful DELETE with no body?', [
        '200 with an error message',
        '201 Created',
        '404 Not Found',
        '204 No Content',
      ], 3, '204 signals success without a response body, which suits deletions.'),
      q('Which layer of tests checks paths, status codes and JSON without a real server?', [
        'Manual browser testing',
        'MockMvc web slice tests',
        'Load testing',
        'Database migration tests',
      ], 1, 'MockMvc exercises the HTTP layer in memory, verifying controllers quickly.'),
      ]
    ),
    chapter(
      'Data With Spring Data JPA',
      'Map Java classes to database tables with JPA entities, work with data through Spring Data repositories, model relationships without performance traps, query with paging and sorting, and manage transactions and schema changes with Flyway.',
      [
      lesson('Entities and Repositories', 14, `
Most applications store data in a relational database such as PostgreSQL or MySQL. JPA (Jakarta Persistence) maps Java objects to database tables, and Hibernate is the implementation Spring Boot uses by default. Spring Data JPA adds repositories that provide common database operations without writing SQL for each one.

### An entity

\`\`\`java
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 120)
    private String author;

    @Column(nullable = false, unique = true, length = 13)
    private String isbn;

    @Column(name = "copies_available", nullable = false)
    private int copiesAvailable;

    protected Book() {
        // required by JPA
    }

    public Book(String title, String author, String isbn, int copies) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.copiesAvailable = copies;
    }

    public void borrow() {
        if (copiesAvailable == 0) {
            throw new NoCopiesAvailableException(isbn);
        }
        copiesAvailable--;
    }

    // getters omitted
}
\`\`\`

| Annotation | Meaning |
|---|---|
| \`@Entity\` | This class maps to a table |
| \`@Table(name = "books")\` | The table name |
| \`@Id\` | The primary key |
| \`@GeneratedValue(IDENTITY)\` | The database generates IDs, for example with an identity column |
| \`@Column\` | Column details such as name, length, nullability and uniqueness |

JPA requires a no-argument constructor, which can be \`protected\` to discourage use in your own code. Entities keep behaviour such as \`borrow()\`, following the encapsulation principles from chapter 3.

### A repository

\`\`\`java
public interface BookRepository extends JpaRepository<Book, Long> {
}
\`\`\`

That single line gives you, without any implementation:

\`\`\`text
save(book)           insert or update
findById(id)         returns Optional<Book>
findAll()            all books (avoid on large tables)
existsById(id)       true or false
count()              number of rows
deleteById(id)       delete one
\`\`\`

Spring Data creates the implementation at runtime. The generic types, \`Book\` and \`Long\`, come from chapter 4's generics lesson.

### Derived query methods

Spring Data can build queries from method names:

\`\`\`java
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    boolean existsByIsbn(String isbn);
    List<Book> findByCopiesAvailableGreaterThan(int copies);
}
\`\`\`

\`findByAuthorContainingIgnoreCase("hyder")\` becomes a SQL query with a case-insensitive \`LIKE\`. Keep derived names readable; for complex queries, use \`@Query\` as shown in the third lesson.

### Connecting to PostgreSQL

\`\`\`yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library
    username: library
    password: \${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
\`\`\`

\`ddl-auto: validate\` makes Hibernate check that entities match the tables, without changing the schema; schema changes are handled by Flyway in the final lesson. Setting \`open-in-view\` to false avoids database access during view rendering, a setting many teams recommend for APIs.

### Using the repository in a service

\`\`\`java
@Service
public class BookService {
    private final BookRepository books;

    public BookService(BookRepository books) {
        this.books = books;
    }

    public BookResponse findById(Long id) {
        Book book = books.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id.toString()));
        return BookResponse.from(book);
    }
}
\`\`\`

This is the pattern you will write most often: find, or throw a not-found exception that the global handler turns into a 404.
      `,
        [
          q('What does extending JpaRepository<Book, Long> provide?', [
            'Common database operations without writing implementations',
            'A new database server',
            'Automatic REST endpoints for every entity',
            'Database migrations',
          ], 0, 'Spring Data generates implementations for save, find, count, delete and more at runtime.'),
          q('Why does a JPA entity need a no-argument constructor?', [
            'Java requires it for every class',
            'It makes entities immutable',
            'It generates the table automatically',
            'JPA uses it to create objects when loading data',
          ], 3, 'Hibernate instantiates entities through the no-argument constructor before filling their fields.'),
          q('What does ddl-auto: validate do?', [
            'Deletes and recreates tables on every start',
            'Creates missing tables automatically',
            'Checks that entities match the existing schema without changing it',
            'Disables the database connection',
          ], 2, 'Validation catches mismatches between code and schema while leaving schema changes to migrations.'),
        ]
      ),
      lesson('Relationships Between Entities', 14, `
Real data is connected: members borrow books, loans belong to members, books have many authors. JPA maps these relationships between entities, but relationships are also where most JPA performance problems start. Understanding both the mapping and the traps is essential.

### Many-to-one and one-to-many

A loan belongs to one member and one book; a member has many loans:

\`\`\`java
@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    private LocalDate returnedOn;

    protected Loan() {}
}
\`\`\`

\`\`\`java
@Entity
@Table(name = "members")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "member")
    private List<Loan> loans = new ArrayList<>();
}
\`\`\`

The \`loans\` table has a \`member_id\` foreign key. The \`@ManyToOne\` side owns the relationship; \`mappedBy = "member"\` on the other side says "this is mapped by the member field in Loan".

### Fetch types

| Fetch type | Behaviour | Default for |
|---|---|---|
| Eager | Loads the related entity immediately | \`@ManyToOne\`, \`@OneToOne\` |
| Lazy | Loads it only when accessed | \`@OneToMany\`, \`@ManyToMany\` |

A widely recommended practice is to make \`@ManyToOne\` relationships lazy explicitly, as above, and load related data deliberately when needed. Eager loading everywhere quickly loads far more data than a request requires.

### The N+1 query problem

This innocent-looking code:

\`\`\`java
List<Loan> loans = loanRepository.findAll();          // 1 query
for (Loan loan : loans) {
    System.out.println(loan.getBook().getTitle());   // 1 query per loan
}
\`\`\`

With 500 loans, it runs 501 queries. Pages that feel slow in production often suffer from exactly this. Solutions:

\`\`\`java
// Fetch join in JPQL
@Query("select l from Loan l join fetch l.book where l.returnedOn is null")
List<Loan> findActiveLoansWithBooks();

// Or an entity graph
@EntityGraph(attributePaths = {"book", "member"})
List<Loan> findByReturnedOnIsNull();
\`\`\`

Both load loans and their books in one query. Turn on SQL logging in development (\`spring.jpa.show-sql\` or, better, a logging level for Hibernate SQL) to spot N+1 patterns early.

### Many-to-many

Books can have several categories, and categories contain many books:

\`\`\`java
@ManyToMany
@JoinTable(name = "book_categories",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id"))
private Set<Category> categories = new HashSet<>();
\`\`\`

When the link itself needs data, such as the date a book was added to a reading list, model the join table as its own entity with two \`@ManyToOne\` relationships instead.

### Do not return entities with relationships as JSON

Serialising entities with bidirectional relationships can cause infinite loops (member to loans to member) and lazy-loading errors. This is another reason to return DTOs, as chapter 7 recommended, mapping only the fields the client needs.
      `,
        [
          q('Which side owns a one-to-many relationship between Member and Loan?', [
            'The Member side with @OneToMany',
            'The Loan side with @ManyToOne and the foreign key',
            'Neither side',
            'The database decides at runtime',
          ], 1, 'The many side holds the foreign key column, so it owns the relationship; mappedBy marks the inverse side.'),
          q('What is the N+1 query problem?', [
            'A query that returns one extra row',
            'A database with N plus one tables',
            'A method that needs N+1 parameters',
            'One query for a list, then one more query per item',
          ], 3, 'Accessing lazy relationships in a loop triggers a query per item, multiplying database calls.'),
          q('How can loans and their books be loaded in one query?', [
            'Making every relationship eager everywhere',
            'Calling findAll twice',
            'Using a fetch join or an entity graph',
            'Removing the relationship',
          ], 2, 'Fetch joins and entity graphs load the needed associations together in a single query.'),
        ]
      ),
      lesson('Queries, Paging and Sorting', 13, `
Derived method names cover simple queries, but real applications need searches, filters, reports and large lists split into pages. Spring Data JPA provides \`@Query\` for custom queries and built-in support for paging and sorting.

### Custom queries with @Query

JPQL queries use entity and field names, not table and column names:

\`\`\`java
public interface LoanRepository extends JpaRepository<Loan, Long> {

    @Query("""
        select l from Loan l
        where l.returnedOn is null
          and l.dueDate < :today
        """)
    List<Loan> findOverdue(@Param("today") LocalDate today);

    @Query("select count(l) from Loan l where l.member.id = :memberId and l.returnedOn is null")
    long countActiveLoans(@Param("memberId") Long memberId);
}
\`\`\`

Named parameters like \`:today\` are bound safely, which prevents SQL injection. Never build queries by concatenating user input into strings.

For database-specific features, native SQL is possible with \`nativeQuery = true\`, at the cost of portability.

### Projections

Loading full entities for a list screen wastes memory. Projections select only needed fields:

\`\`\`java
public record BookSummary(Long id, String title, String author) {}

@Query("select new pk.cortexis.libraryapi.book.BookSummary(b.id, b.title, b.author) from Book b")
List<BookSummary> findSummaries();
\`\`\`

Interface-based projections are another option: declare an interface with getters for the fields you want, and use it as the return type.

### Paging

Every list endpoint that could grow should be paged. Spring Data repositories accept a \`Pageable\` and return a \`Page\`:

\`\`\`java
Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
\`\`\`

\`\`\`java
Pageable pageable = PageRequest.of(0, 20, Sort.by("title").ascending());
Page<Book> page = bookRepository.findByAuthorContainingIgnoreCase("hyder", pageable);

page.getContent();        // the 20 books on this page
page.getTotalElements();  // total matching books
page.getTotalPages();     // number of pages
page.hasNext();           // whether another page exists
\`\`\`

\`Page\` runs an extra count query to compute totals. For very large tables where totals are not needed, \`Slice\` avoids that count.

### Paging in controllers

Spring MVC can build the \`Pageable\` from query parameters:

\`\`\`java
@GetMapping
public Page<BookResponse> list(@PageableDefault(size = 20, sort = "title") Pageable pageable) {
    return bookService.list(pageable);
}
\`\`\`

\`\`\`text
GET /api/books?page=2&size=10&sort=author,desc
\`\`\`

Always set a sensible default size and consider limiting the maximum size, so a client cannot request a million rows in one page. Spring Data's web support has a configurable maximum page size for this purpose.

### Sorting safely

Sorting by user-supplied field names is convenient, but only allow sorting by fields you expect, especially when combined with custom queries. Validate or map sort parameters to known fields.

### Indexes matter

Queries are only fast if the database can find rows efficiently. Columns used in \`where\`, \`join\` and \`order by\` clauses, such as \`isbn\`, \`author\`, \`due_date\` and foreign keys, usually need indexes. Indexes are created in migrations, covered in the next lesson. When a query is slow, check the database's execution plan, for example with \`EXPLAIN\` in PostgreSQL.

### Keep queries in repositories

Put queries in repository interfaces, not scattered through services. This keeps data access in one place, makes queries easy to find and test, and matches the layered architecture described in chapter 9.
      `,
        [
          q('Why are named parameters like :today safer than concatenating strings into queries?', [
            'They are bound safely, preventing SQL injection',
            'They make queries run twice as fast',
            'JPQL does not allow string concatenation',
            'They remove the need for indexes',
          ], 0, 'Parameter binding separates data from query structure, so malicious input cannot change the query.'),
          q('What does Page provide beyond the current page\'s items?', [
            'The database password',
            'A list of every row in the table',
            'Totals such as total elements and total pages',
            'Automatic caching of all pages',
          ], 2, 'Page includes metadata like total elements, total pages and whether more pages exist.'),
          q('Why limit the maximum page size?', [
            'Spring requires sizes under ten',
            'Larger pages cannot be sorted',
            'It improves password security',
            'To stop clients requesting huge pages that overload the server',
          ], 3, 'A maximum size protects the application from expensive requests for enormous result sets.'),
        ]
      ),
      lesson('Transactions and Flyway Migrations', 13, `
Two topics make data handling trustworthy in production: transactions, which ensure related changes succeed or fail together, and database migrations, which change the schema in a controlled, repeatable way. Both are expected knowledge for any Spring Boot developer.

### Why transactions matter

Borrowing a book involves several changes: reduce available copies and create a loan record. If the second step fails after the first succeeds, the database is inconsistent: a copy is missing but no loan exists. A transaction groups the steps, so either all succeed or all are rolled back.

### @Transactional

\`\`\`java
@Service
public class LoanService {

    private final BookRepository books;
    private final MemberRepository members;
    private final LoanRepository loans;
    private final Clock clock;

    // constructor omitted

    @Transactional
    public LoanResponse borrow(Long bookId, Long memberId) {
        Book book = books.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId.toString()));
        Member member = members.getReferenceById(memberId);
        book.borrow();   // changes the entity
        Loan loan = loans.save(new Loan(member, book, LocalDate.now(clock).plusDays(14)));
        return LoanResponse.from(loan);
    }
}
\`\`\`

Inside a transaction, Hibernate tracks loaded entities. Changes like \`book.borrow()\` are saved automatically when the transaction commits, a feature called dirty checking, so no explicit \`save(book)\` is needed.

### Transaction rules to know

| Rule | Detail |
|---|---|
| Place it on service methods | The service defines the unit of work, not the controller or repository |
| Rollback behaviour | By default, rollback happens for unchecked exceptions, not checked ones |
| Read-only queries | \`@Transactional(readOnly = true)\` can optimise read operations |
| Self-invocation | Calling a \`@Transactional\` method from another method in the same class bypasses the transaction proxy |
| Keep them short | Avoid slow network calls, like sending email, inside transactions |

The self-invocation rule surprises many developers: Spring applies transactions through a proxy around the bean, so internal calls do not pass through it.

### Why migrations instead of ddl-auto

Hibernate can create tables automatically with \`ddl-auto: update\`, which is convenient for experiments but risky in production: it cannot handle every change safely, gives no history, and may behave differently across environments. Migrations give full control.

### Flyway

Flyway runs versioned SQL scripts in order. Place them in \`src/main/resources/db/migration\`:

\`\`\`text
V1__create_books.sql
V2__create_members_and_loans.sql
V3__add_index_on_loans_due_date.sql
\`\`\`

\`\`\`sql
-- V1__create_books.sql
CREATE TABLE books (
    id               BIGSERIAL PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    author           VARCHAR(120) NOT NULL,
    isbn             VARCHAR(13)  NOT NULL UNIQUE,
    copies_available INT          NOT NULL CHECK (copies_available >= 0)
);
\`\`\`

On startup, Flyway checks its history table, \`flyway_schema_history\`, and applies any new scripts. Every environment, from a laptop to production, ends up with the same schema, built the same way.

### Migration rules

- Never edit a migration that has already been applied; Flyway detects the change and refuses to start. Add a new migration instead.
- Keep each migration focused on one change.
- Test migrations against a copy of real data before production, especially for large tables.
- Combine with \`ddl-auto: validate\`, so the application fails fast if entities and schema drift apart.

Database constraints, such as \`NOT NULL\`, \`UNIQUE\` and \`CHECK\`, protect data even if application code has a bug. Validation in the API and constraints in the database work together.
      `,
        [
          q('What does @Transactional guarantee for the borrow method?', [
            'The method runs faster',
            'The method can never throw exceptions',
            'All changes succeed together or are rolled back together',
            'The book is cached permanently',
          ], 2, 'A transaction makes related database changes atomic, preventing inconsistent states.'),
          q('Why might calling a @Transactional method from another method in the same class not start a transaction?', [
            'The call bypasses the proxy Spring uses to apply transactions',
            'Transactions only work in controllers',
            'Java forbids calling methods in the same class',
            'The database rejects nested method calls',
          ], 0, 'Spring applies transactions through a proxy, and internal calls do not pass through it.'),
          q('What should you do when a schema change is needed after V2 has been applied?', [
            'Edit V2 and restart the application',
            'Delete the flyway_schema_history table',
            'Switch to ddl-auto: create',
            'Add a new migration such as V3',
          ], 3, 'Applied migrations must not change; new changes go in new, higher-versioned scripts.'),
        ]
      ),
      ],
      [
      q('Which repository method name finds books by author ignoring case and partial matches?', [
        'findAllAuthors',
        'searchAuthorLike',
        'findByAuthorContainingIgnoreCase',
        'getByAuthorMaybe',
      ], 2, 'Spring Data derives a case-insensitive LIKE query from the Containing and IgnoreCase keywords.'),
      q('Why return DTOs rather than entities with relationships from controllers?', [
        'Entities cannot contain relationships',
        'Serialising bidirectional relationships can loop or trigger lazy-loading errors',
        'DTOs are required by PostgreSQL',
        'Entities are always slower to create',
      ], 1, 'DTOs expose only intended fields and avoid serialisation problems with entity graphs.'),
      q('A list page is slow and logs show hundreds of similar queries. What is the likely cause?', [
        'Missing Flyway migrations',
        'Too few controllers',
        'Records instead of classes',
        'The N+1 query problem',
      ], 3, 'Many near-identical queries usually mean lazy relationships are being loaded one item at a time.'),
      q('Why use Flyway migrations in production instead of ddl-auto: update?', [
        'Hibernate cannot connect to PostgreSQL',
        'Migrations make queries faster',
        'Migrations give controlled, repeatable, versioned schema changes',
        'ddl-auto only works with MySQL',
      ], 2, 'Versioned scripts produce identical schemas everywhere, with history and full control over changes.'),
      ]
    ),
    chapter(
      'Application Architecture',
      'Structure Spring Boot applications into clear layers, map between entities and DTOs cleanly, log and monitor applications with SLF4J and Actuator, and improve performance with caching, scheduled jobs and asynchronous work.',
      [
      lesson('Layered Architecture: Controller, Service, Repository', 13, `
As an application grows from five classes to five hundred, structure becomes the difference between a codebase that is pleasant to change and one everyone fears. Most Spring Boot applications use a layered architecture, where each layer has a clear responsibility and depends only on the layer below.

### The three layers

\`\`\`text
HTTP request
    |
Controller   web layer: HTTP, JSON, validation, status codes
    |
Service      business layer: rules, transactions, orchestration
    |
Repository   data layer: database access
    |
Database
\`\`\`

| Layer | Responsibilities | Should not |
|---|---|---|
| Controller | Parse requests, validate DTOs, call services, return responses | Contain business rules or database queries |
| Service | Apply business rules, manage transactions, coordinate repositories and other services | Know about HTTP requests or JSON |
| Repository | Load and save data | Contain business rules |

### An example flow: borrowing a book

\`\`\`java
@RestController
@RequestMapping("/api/loans")
class LoanController {
    private final LoanService loanService;

    LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    LoanResponse borrow(@Valid @RequestBody BorrowRequest request) {
        return loanService.borrow(request.bookId(), request.memberId());
    }
}
\`\`\`

The controller does not check whether copies are available or whether the member has reached their limit. The service does:

\`\`\`java
@Transactional
public LoanResponse borrow(Long bookId, Long memberId) {
    Member member = members.findById(memberId)
            .orElseThrow(() -> new MemberNotFoundException(memberId));
    if (loans.countActiveLoans(memberId) >= properties.maxBooks()) {
        throw new LoanLimitReachedException(memberId);
    }
    Book book = books.findById(bookId)
            .orElseThrow(() -> new BookNotFoundException(bookId.toString()));
    book.borrow();
    Loan loan = loans.save(new Loan(member, book, dueDate()));
    return LoanResponse.from(loan);
}
\`\`\`

Because the rule lives in the service, it applies whether a loan is created from the API, an admin tool or a scheduled job.

### Package by feature

Two common ways to organise packages:

\`\`\`text
By layer:                       By feature:
  controller/                     book/
    BookController                  BookController, BookService,
    LoanController                  BookRepository, Book, BookResponse
  service/                        loan/
    BookService                     LoanController, LoanService, ...
    LoanService                   member/
  repository/                       ...
\`\`\`

Package by feature keeps everything about one concept together, so changes usually touch one package. Many teams find it scales better, and Java's package-private visibility can hide classes that should not be used outside the feature.

### Dependencies point inward

Controllers depend on services; services depend on repositories. Services should not depend on controllers, and repositories should not call services. When two features need each other, one service calls another service's public methods rather than reaching into its repository directly. Clear dependency directions prevent tangled code.

### Beyond layers

Larger systems sometimes adopt patterns like hexagonal architecture, which separates the core domain from technical details such as the web and database even more strictly. The principles are the same: keep business rules independent of frameworks and infrastructure. For most applications, clean layers and packages by feature are enough.

### Why this matters in teams

Consistent structure lets any developer on the team find code quickly, review changes easily and add features without breaking unrelated parts. When new developers join, a predictable architecture shortens their learning time from weeks to days.
      `,
        [
          q('Which layer should enforce the rule that members cannot exceed their loan limit?', [
            'The controller',
            'The repository',
            'The service',
            'The JSON response',
          ], 2, 'Business rules belong in services so they apply no matter how the operation is triggered.'),
          q('What is an advantage of packaging by feature?', [
            'Everything about one concept lives together, so changes stay local',
            'It removes the need for services',
            'It makes classes run faster',
            'Spring requires it for component scanning',
          ], 0, 'Grouping related classes by feature keeps changes contained and supports package-private encapsulation.'),
          q('Which dependency direction is healthy?', [
            'Repositories calling controllers',
            'Services depending on controllers',
            'Controllers querying the database directly',
            'Controllers depending on services, services on repositories',
          ], 3, 'Dependencies flow inward from web to business to data, keeping layers independent.'),
        ]
      ),
      lesson('Mapping Between Entities and DTOs', 12, `
Because controllers exchange DTOs and repositories work with entities, applications constantly convert between the two. Mapping code is simple but repetitive, and where it lives and how it is written affects readability and correctness.

### Manual mapping with factory methods

The simplest approach puts a static factory method on the DTO:

\`\`\`java
public record BookResponse(Long id, String title, String author, int copiesAvailable) {

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCopiesAvailable());
    }
}
\`\`\`

And for creating entities from requests, a constructor or factory on the entity:

\`\`\`java
Book book = new Book(request.title(), request.author(), request.isbn(), request.copies());
\`\`\`

Manual mapping is explicit and easy to debug. For small and medium applications, it is often the best choice. When a field is added to the entity, the compiler does not force you to update the DTO, so review mappings whenever entities change, and cover them with a quick unit test for important responses.

### Mapping lists and pages

\`\`\`java
List<BookResponse> responses = books.stream()
        .map(BookResponse::from)
        .toList();

Page<BookResponse> page = bookRepository.findAll(pageable)
        .map(BookResponse::from);
\`\`\`

\`Page\` has its own \`map\` method that converts the content while keeping paging metadata.

### MapStruct for larger projects

When there are many DTOs with many fields, mapping by hand becomes tedious. MapStruct generates mapping code at compile time from an interface:

\`\`\`java
@Mapper(componentModel = "spring")
public interface BookMapper {
    BookResponse toResponse(Book book);
    List<BookResponse> toResponses(List<Book> books);
}
\`\`\`

MapStruct maps fields with matching names automatically and reports unmapped fields as compile-time warnings, catching mistakes early. Because the generated code is plain Java, it is fast and easy to inspect. Avoid reflection-based mappers that copy fields at runtime, as they hide errors until the application runs.

### Where mapping happens

| Option | Notes |
|---|---|
| In the service | Services return DTOs; controllers stay thin. A common, simple choice |
| In the controller | Services return entities; controllers map. Keeps services reusable internally, but risks lazy-loading issues outside transactions |
| Dedicated mapper classes | Clean separation for large projects |

Many teams have services return DTOs, because mapping inside the transaction avoids lazy-loading errors when accessing related entities.

### Updating entities from requests

For updates, avoid blindly copying every field from the request onto the entity. Use meaningful methods that enforce rules:

\`\`\`java
@Transactional
public BookResponse update(Long id, UpdateBookRequest request) {
    Book book = books.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id.toString()));
    book.rename(request.title());
    book.changeAuthor(request.author());
    return BookResponse.from(book);
}
\`\`\`

Thanks to dirty checking from chapter 8, the changes are saved when the transaction commits.

### Sensitive data

Mapping is where you decide what leaves the system. A \`MemberResponse\` should never include the password hash, internal flags or other members' data. Review response DTOs with security in mind; a single extra field can leak information to every client of the API.
      `,
        [
          q('What does Page.map(BookResponse::from) do?', [
            'Loads every page at once',
            'Converts the content while keeping paging metadata',
            'Deletes the original entities',
            'Sorts the page by title',
          ], 1, 'Page.map transforms each element and preserves totals and page information.'),
          q('What is an advantage of MapStruct over reflection-based mappers?', [
            'It works without any annotations',
            'It maps data at runtime using reflection',
            'It generates plain code at compile time and warns about unmapped fields',
            'It removes the need for DTOs',
          ], 2, 'Compile-time generation is fast, inspectable and catches mapping mistakes early.'),
          q('Why review response DTOs with security in mind?', [
            'DTOs are stored in the database',
            'DTOs control database indexes',
            'DTOs are only used in tests',
            'Extra fields, like password hashes, could leak to every client',
          ], 3, 'Response DTOs define exactly what the API reveals, so sensitive fields must be excluded.'),
        ]
      ),
      lesson('Logging and Monitoring With Actuator', 14, `
Once an application runs in production, you cannot attach a debugger. Logs and monitoring are how you understand what it is doing, detect problems early and investigate incidents. Spring Boot includes solid defaults for logging and a production-ready monitoring module, Actuator.

### Logging with SLF4J

Spring Boot uses SLF4J as the logging API with Logback as the default implementation:

\`\`\`java
@Service
public class LoanService {
    private static final Logger log = LoggerFactory.getLogger(LoanService.class);

    public LoanResponse borrow(Long bookId, Long memberId) {
        log.info("Borrow requested: book={} member={}", bookId, memberId);
        // ...
        log.debug("Active loans for member {}: {}", memberId, count);
        // ...
    }
}
\`\`\`

Use placeholders \`{}\` rather than string concatenation; the message is only built if that level is enabled.

### Log levels

| Level | Use for |
|---|---|
| ERROR | Failures needing attention: a payment failed, a job crashed |
| WARN | Unexpected but handled situations: a retry succeeded, a deprecated call |
| INFO | Important business events: application started, loan created |
| DEBUG | Detailed information for diagnosing problems |
| TRACE | Very detailed, rarely enabled |

Configure levels per package:

\`\`\`yaml
logging:
  level:
    root: INFO
    pk.cortexis: DEBUG
    org.hibernate.SQL: DEBUG   # show SQL in development only
\`\`\`

### What not to log

Never log passwords, tokens, full card numbers or other secrets, and be careful with personal data such as phone numbers and CNIC numbers. Logs are often stored for a long time and read by many people and tools.

### Structured logs and request IDs

In production, logs are usually shipped to a central system for searching. Structured logs, in JSON format, make searching reliable; recent Spring Boot versions can produce structured logs through configuration. Including a request or trace ID in every log line lets you follow a single request across all its log messages, which is essential when many requests run at once.

### Spring Boot Actuator

Adding \`spring-boot-starter-actuator\` exposes operational endpoints:

| Endpoint | Shows |
|---|---|
| \`/actuator/health\` | Whether the application and its dependencies, like the database, are healthy |
| \`/actuator/info\` | Build and version information |
| \`/actuator/metrics\` | Metrics such as request counts, response times, memory and database pool usage |
| \`/actuator/prometheus\` | Metrics in Prometheus format, with the Micrometer Prometheus registry |

Only \`health\` is exposed over HTTP by default. Expose others deliberately:

\`\`\`yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      probes:
        enabled: true
\`\`\`

Health probes provide liveness and readiness endpoints that container platforms such as Kubernetes use to restart unhealthy instances and route traffic only to ready ones.

### Secure the endpoints

Actuator endpoints can reveal sensitive details about your system. Expose only what you need, protect them with Spring Security, or serve them on a separate management port reachable only from the internal network. Never expose every endpoint publicly.

### Metrics and dashboards

Micrometer, built into Spring Boot, records metrics that tools like Prometheus collect and Grafana displays as dashboards. Watching request rates, error rates and response times lets teams spot problems before users report them. You can also record custom business metrics, such as loans created per hour.
      `,
        [
          q('Why use placeholders like {} in log messages?', [
            'They encrypt the log output',
            'The message is only built if the level is enabled',
            'Logback cannot print concatenated strings',
            'They make logs smaller on disk',
          ], 1, 'Parameterised logging avoids the cost of building messages that will not be written.'),
          q('Which Actuator endpoint is exposed over HTTP by default?', [
            '/actuator/metrics',
            '/actuator/env',
            '/actuator/prometheus',
            '/actuator/health',
          ], 3, 'Only health is exposed by default; other endpoints must be enabled deliberately.'),
          q('What should never appear in logs?', [
            'Application start messages',
            'Loan IDs for business events',
            'Passwords, tokens and full card numbers',
            'Warning messages about retries',
          ], 2, 'Logs are stored and widely read, so secrets and sensitive data must be excluded.'),
        ]
      ),
      lesson('Caching and Asynchronous Work', 13, `
Two techniques help applications stay fast under load: caching results that are expensive to compute or fetch, and moving slow work, such as sending emails, out of the request so users get quick responses. Spring makes both straightforward, but each has trade-offs worth understanding.

### Caching with Spring's cache abstraction

Enable caching and annotate methods:

\`\`\`java
@Configuration
@EnableCaching
public class CacheConfig {}
\`\`\`

\`\`\`java
@Service
public class CatalogueService {

    @Cacheable(cacheNames = "bookDetails", key = "#isbn")
    public BookDetails findDetails(String isbn) {
        return externalCatalogueClient.fetch(isbn);   // slow external API
    }

    @CacheEvict(cacheNames = "bookDetails", key = "#isbn")
    public void refreshDetails(String isbn) {
    }
}
\`\`\`

The first call fetches from the external API and stores the result; later calls with the same ISBN return the cached value instantly. \`@CacheEvict\` removes an entry when it must be refreshed.

### Choosing a cache provider

| Provider | Scope | Good for |
|---|---|---|
| Simple in-memory map (default) | Single instance | Learning, tests |
| Caffeine | Single instance, with size limits and expiry | Fast local caching |
| Redis | Shared across instances | Applications running several instances |

With several application instances behind a load balancer, local caches can hold different values on each instance. A shared cache such as Redis keeps them consistent.

### What to cache, and what not to

Cache data that is read often, changes rarely and is expensive to obtain: reference data, external API results, computed reports. Avoid caching data that must always be current, such as available copies during borrowing, or user-specific data without careful keys. Always set expiry times; a cache without expiry eventually serves stale data or grows without limit.

### Asynchronous methods

Some work does not need to finish before responding. Sending a confirmation email after a loan is one example:

\`\`\`java
@Configuration
@EnableAsync
public class AsyncConfig {}
\`\`\`

\`\`\`java
@Service
public class NotificationService {

    @Async
    public void sendLoanConfirmation(String email, String title) {
        emailClient.send(email, "Loan confirmed", "You borrowed " + title);
    }
}
\`\`\`

The caller continues immediately while the email is sent on another thread. As with transactions, \`@Async\` works through a proxy, so it does not apply when called from within the same class.

### Scheduled jobs

Recurring tasks, such as daily overdue reminders, use scheduling:

\`\`\`java
@Configuration
@EnableScheduling
public class SchedulingConfig {}
\`\`\`

\`\`\`java
@Scheduled(cron = "0 0 9 * * *", zone = "Asia/Karachi")
public void sendOverdueReminders() {
    loanService.findOverdue().forEach(reminderService::remind);
}
\`\`\`

This runs every day at 9 a.m. Pakistan time. With several application instances, every instance would run the job; tools such as ShedLock ensure only one does.

### Virtual threads

Java 21 introduced virtual threads, lightweight threads that make blocking operations, such as database and HTTP calls, much cheaper. Recent Spring Boot versions can use them for request handling with a single property, \`spring.threads.virtual.enabled=true\`, which can improve throughput for I/O-heavy applications. Test under realistic load before relying on it.

### Reliability for important work

For work that must not be lost, such as payment notifications, a simple \`@Async\` method is not enough: if the application restarts, queued tasks disappear. Use a durable message queue or an outbox table, so work survives restarts and can be retried.
      `,
        [
          q('What does @Cacheable do on a method?', [
            'Runs the method on another thread',
            'Deletes the method\'s results',
            'Returns stored results for repeated calls with the same key',
            'Schedules the method to run daily',
          ], 2, 'Cacheable stores results by key and serves them on later calls, skipping the expensive work.'),
          q('Why might a shared cache like Redis be needed?', [
            'Several instances need consistent cached data',
            'Local caches cannot store strings',
            'Spring only supports Redis',
            'Redis removes the need for a database',
          ], 0, 'With multiple instances, a shared cache prevents each instance holding different values.'),
          q('Why is @Async not enough for work that must never be lost?', [
            '@Async methods cannot send emails',
            'It only works on weekends',
            'It makes requests slower',
            'Queued tasks disappear if the application restarts',
          ], 3, 'In-memory async tasks are lost on restart, so critical work needs durable queues or outbox tables.'),
        ]
      ),
      ],
      [
      q('Which layer should know about HTTP status codes and JSON?', [
        'The repository',
        'The entity',
        'The controller',
        'The database',
      ], 2, 'Controllers handle HTTP concerns, leaving services and repositories independent of the web.'),
      q('Where is mapping entities to DTOs often done to avoid lazy-loading errors?', [
        'In the database',
        'Inside the service, within the transaction',
        'In the JSON serializer only',
        'In the Flyway migration',
      ], 1, 'Mapping inside the transaction lets related entities load safely before the DTO leaves the service.'),
      q('What do Actuator health probes help container platforms do?', [
        'Write and apply database migrations',
        'Encrypt passwords stored in the database',
        'Generate OpenAPI documentation for clients',
        'Restart unhealthy instances and route traffic',
      ], 3, 'Liveness and readiness endpoints tell the platform when to restart or send traffic.'),
      q('What problem appears when a @Scheduled job runs on several instances?', [
        'The job never runs',
        'The job runs only once per week',
        'Every instance runs it, unless a lock like ShedLock is used',
        'Spring deletes the extra instances',
      ], 2, 'Each instance schedules the job independently, so distributed locking ensures a single run.'),
      ]
    ),
    chapter(
      'Security With Spring Security',
      'Understand Spring Security\'s filter chain and configuration, store passwords safely and register users, protect APIs with JSON Web Tokens, and control access with roles, request rules and method security.',
      [
      lesson('How Spring Security Works', 13, `
Security is not optional for real applications. A library API must ensure that only members can borrow books, only librarians can add them, and nobody can see another member's data. Spring Security is the standard way to secure Spring applications. It is powerful and, once its core ideas are clear, logical.

### What happens when you add it

Adding \`spring-boot-starter-security\` immediately secures every endpoint. Spring Boot generates a default user with a random password printed in the startup log, and requests without credentials receive 401 Unauthorized. This "secure by default" behaviour is deliberate; you then open up and configure what you need.

### Authentication and authorisation

| Concept | Question | Example |
|---|---|---|
| Authentication | Who are you? | Checking a username and password, or a token |
| Authorisation | What are you allowed to do? | Only librarians may delete books |

The two HTTP responses map to these:

- **401 Unauthorized**: not authenticated, or credentials invalid.
- **403 Forbidden**: authenticated, but not allowed to do this.

### The filter chain

Spring Security works as a chain of servlet filters that every request passes through before reaching your controllers:

\`\`\`text
Request
  -> filters that read credentials (form login, basic auth, bearer token)
  -> filter that stores the authenticated user in the SecurityContext
  -> authorisation filter that checks the rules for this URL
  -> your controller (only if allowed)
\`\`\`

The authenticated user is held in the \`SecurityContext\` for the duration of the request, available to controllers and services.

### Configuring with a SecurityFilterChain bean

Modern Spring Security is configured by defining a \`SecurityFilterChain\` bean using a lambda-based style:

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                .anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}
\`\`\`

Older tutorials extend a class called \`WebSecurityConfigurerAdapter\`; that approach was removed in current versions. If you see it, the tutorial is outdated.

### Rules are checked in order

Request matchers are evaluated top to bottom, and the first match wins. Put specific rules before general ones, and end with a catch-all such as \`anyRequest().authenticated()\`. A broad rule placed first can accidentally open or block everything after it.

### CSRF and stateless APIs

Cross-site request forgery (CSRF) protection defends browser applications that use session cookies. Stateless REST APIs that authenticate every request with a token in the \`Authorization\` header are not vulnerable in the same way, so CSRF protection is commonly disabled for them, as above. If your API uses cookies for authentication, keep CSRF protection enabled.

### CORS

When a React front end on \`http://localhost:3000\` calls an API on \`http://localhost:8080\`, the browser enforces cross-origin rules. Configure CORS explicitly to allow only your trusted front-end origins, using \`http.cors(...)\` with a \`CorsConfigurationSource\` bean. Avoid allowing all origins in production.

### Security is layered

Spring Security protects the entry points, but it is one layer among several: input validation, parameterised queries, secrets management, HTTPS, dependency updates and careful logging all contribute. Treat security as part of every feature, not a final step.
      `,
        [
          q('What is the difference between 401 and 403?', [
            'They mean the same thing',
            '401 means not authenticated; 403 means authenticated but not allowed',
            '401 is for servers; 403 is for databases',
            '403 means the page does not exist',
          ], 1, 'Authentication failures return 401, while authorisation failures for a known user return 403.'),
          q('Why must specific request rules come before general ones?', [
            'Spring sorts rules alphabetically anyway',
            'General rules are ignored if they come first',
            'Only the last rule is evaluated',
            'Rules are checked in order and the first match wins',
          ], 3, 'A broad rule placed early matches first, overriding more specific rules below it.'),
          q('When is it reasonable to disable CSRF protection?', [
            'In every application, always',
            'Whenever the application uses cookies',
            'For stateless APIs authenticating with tokens in headers',
            'Only for admin endpoints',
          ], 2, 'CSRF targets cookie-based sessions, so stateless token-authenticated APIs commonly disable it.'),
        ]
      ),
      lesson('Password Hashing and User Registration', 13, `
Storing passwords safely is one of the most important responsibilities of any application with user accounts. Data breaches happen, and when they do, properly hashed passwords protect users; plain-text or weakly hashed passwords expose them, and often their accounts on other sites too.

### Never store plain passwords

A password must never be stored as-is, and never encrypted in a way that can be reversed. Instead, it is hashed with a slow, salted algorithm designed for passwords:

| Approach | Safe? |
|---|---|
| Plain text | No |
| Reversible encryption | No |
| Fast hashes like MD5 or SHA-256 alone | No, too fast to resist guessing |
| BCrypt, SCrypt or Argon2 | Yes, designed to be slow and salted |

A salt is random data added to each password before hashing, so identical passwords produce different hashes and precomputed attacks fail.

### PasswordEncoder

Spring Security provides a \`PasswordEncoder\` interface. A common setup delegates to BCrypt and records the algorithm in the stored value, which allows upgrading algorithms later:

\`\`\`java
@Bean
PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}
\`\`\`

Stored hashes then look like \`{bcrypt}$2a$10$...\`. The prefix tells Spring which algorithm was used.

### A member entity and registration

\`\`\`java
@Entity
@Table(name = "members")
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;   // e.g. MEMBER or LIBRARIAN

    protected Member() {}

    public Member(String email, String passwordHash, String role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}
\`\`\`

\`\`\`java
@Transactional
public MemberResponse register(RegisterRequest request) {
    if (members.existsByEmail(request.email())) {
        throw new EmailAlreadyRegisteredException(request.email());
    }
    String hash = passwordEncoder.encode(request.password());
    Member member = members.save(new Member(request.email(), hash, "MEMBER"));
    return MemberResponse.from(member);
}
\`\`\`

New users always receive the lowest role. Never let a registration request choose its own role; otherwise anyone could register as a librarian or admin.

### Loading users for authentication

Spring Security finds users through a \`UserDetailsService\`:

\`\`\`java
@Bean
UserDetailsService userDetailsService(MemberRepository members) {
    return email -> members.findByEmail(email)
            .map(m -> User.withUsername(m.getEmail())
                    .password(m.getPasswordHash())
                    .roles(m.getRole())
                    .build())
            .orElseThrow(() -> new UsernameNotFoundException(email));
}
\`\`\`

During login, Spring loads the user, hashes the submitted password with the same algorithm and compares the result. Your code never compares passwords manually.

### Password policy

Validate passwords at registration with sensible rules: a minimum length, such as at least 8 to 12 characters, and rejection of very common passwords. Length matters more than complex character rules. Also:

- Never log passwords or include them in responses.
- Rate-limit login attempts to slow down guessing attacks.
- Return the same message for "unknown email" and "wrong password", so attackers cannot discover which emails are registered.

### Password resets

Reset flows should use single-use, time-limited random tokens sent by email, stored hashed like passwords. Never email passwords to users, and never allow a reset without verifying control of the account's email.
      `,
        [
          q('Which is a safe way to store passwords?', [
            'Plain text in a protected table',
            'Reversible encryption with a secret key',
            'A single fast SHA-256 hash',
            'A slow, salted algorithm such as BCrypt',
          ], 3, 'Password hashing algorithms like BCrypt are deliberately slow and salted to resist guessing attacks.'),
          q('Why should new users always receive the lowest role at registration?', [
            'Otherwise anyone could register as an admin',
            'Roles cannot be changed after registration',
            'Spring Security only supports one role',
            'Higher roles slow down login',
          ], 0, 'Letting requests choose roles would allow privilege escalation by any new user.'),
          q('Why return the same error for unknown email and wrong password?', [
            'It makes login faster',
            'Spring Security requires identical messages',
            'Attackers cannot discover which emails are registered',
            'It removes the need for password hashing',
          ], 2, 'Different messages leak whether an account exists, helping attackers target real users.'),
        ]
      ),
      lesson('JWT Authentication for APIs', 14, `
Browsers and mobile apps calling a REST API need a way to prove who they are on every request. A common approach is a JSON Web Token (JWT): after logging in once, the client receives a signed token and sends it with each request. The server verifies the signature and knows who the user is, without storing session state.

### What a JWT contains

A JWT has three parts separated by dots: header, payload and signature, each Base64URL-encoded.

\`\`\`text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJheWVzaGFAZXhhbXBsZS5jb20iLCJzY29wZSI6Ik1FTUJFUiJ9.signature
\`\`\`

The payload holds claims such as:

\`\`\`json
{
  "sub": "ayesha@example.com",
  "scope": "MEMBER",
  "iat": 1741939200,
  "exp": 1741942800
}
\`\`\`

The payload is encoded, not encrypted: anyone can read it. Never put secrets or sensitive personal data in a JWT. The signature ensures it cannot be altered without detection.

### Using Spring's resource server support

Rather than writing your own token parsing filter, use Spring Security's OAuth2 resource server support, which validates JWTs for you. Add \`spring-boot-starter-oauth2-resource-server\`, then configure:

\`\`\`java
http.oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));
\`\`\`

For an application that issues its own tokens with a shared secret, define an encoder and decoder:

\`\`\`java
@Bean
JwtDecoder jwtDecoder(@Value("\${jwt.secret}") String secret) {
    SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    return NimbusJwtDecoder.withSecretKey(key).build();
}

@Bean
JwtEncoder jwtEncoder(@Value("\${jwt.secret}") String secret) {
    SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    return new NimbusJwtEncoder(new ImmutableSecret<>(key));
}
\`\`\`

The secret must be long and random, supplied through an environment variable, never committed to Git.

### Issuing a token at login

\`\`\`java
@PostMapping("/api/auth/login")
public TokenResponse login(@Valid @RequestBody LoginRequest request) {
    Authentication auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));

    Instant now = Instant.now();
    String scope = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(" "));

    JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("library-api")
            .issuedAt(now)
            .expiresAt(now.plus(1, ChronoUnit.HOURS))
            .subject(auth.getName())
            .claim("scope", scope)
            .build();

    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    return new TokenResponse(token);
}
\`\`\`

The client then sends the token on each request:

\`\`\`http
GET /api/loans/mine
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
\`\`\`

Spring validates the signature and expiry automatically and populates the security context.

### Token lifetimes and refresh

Short-lived access tokens, such as 15 minutes to an hour, limit the damage if one is stolen. Longer sessions typically use refresh tokens, stored securely and rotated on use, to obtain new access tokens. Because JWTs are stateless, revoking one before it expires requires extra design, such as short lifetimes or a deny list.

### Storing tokens on the client

In browsers, storing tokens in \`localStorage\` exposes them to any injected script. Many teams prefer secure, HTTP-only cookies for browser clients, combined with CSRF protection, while mobile apps use the platform's secure storage. Choose deliberately, based on the client type.

### Consider an identity provider

For larger systems, a dedicated identity provider, such as Keycloak or a cloud service, issues tokens, handles logins, password resets and multi-factor authentication. Your Spring Boot API then acts only as a resource server, validating tokens with the provider's public keys, which reduces the security code you must maintain.
      `,
        [
          q('Why should sensitive data never be placed in a JWT payload?', [
            'The payload is only encoded and can be read by anyone',
            'JWTs cannot hold more than two claims',
            'The payload is deleted after one request',
            'Spring rejects tokens with personal data',
          ], 0, 'JWT payloads are Base64URL-encoded, not encrypted, so their contents are readable.'),
          q('How does a client send a JWT with each API request?', [
            'As a query parameter named password',
            'Inside the JSON response body',
            'In the Authorization header as a Bearer token',
            'In the URL path',
          ], 2, 'Clients include Authorization: Bearer followed by the token on each request.'),
          q('Why keep access tokens short-lived?', [
            'Short tokens are faster to encode',
            'Spring cannot validate long tokens',
            'Browsers delete tokens after an hour',
            'A stolen token is useful only briefly',
          ], 3, 'Short expiry limits the damage of token theft, since stateless tokens are hard to revoke early.'),
        ]
      ),
      lesson('Authorisation, Roles and Method Security', 12, `
Once users are authenticated, the application must decide what each one may do. Spring Security supports rules at the URL level and at the method level, and real applications also need ownership checks: a member may view their own loans, but not someone else's.

### Roles and authorities

Spring Security represents permissions as authorities, strings such as \`ROLE_LIBRARIAN\` or \`SCOPE_MEMBER\`. Roles are authorities with the \`ROLE_\` prefix, and \`hasRole("LIBRARIAN")\` checks for \`ROLE_LIBRARIAN\`. With JWT resource server defaults, values from the \`scope\` claim become authorities with a \`SCOPE_\` prefix, so rules use \`hasAuthority("SCOPE_LIBRARIAN")\`, or you customise the converter to map claims to roles.

### URL-based rules

\`\`\`java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
    .requestMatchers(HttpMethod.POST, "/api/books/**").hasAuthority("SCOPE_LIBRARIAN")
    .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasAuthority("SCOPE_LIBRARIAN")
    .requestMatchers("/actuator/**").hasAuthority("SCOPE_ADMIN")
    .anyRequest().authenticated())
\`\`\`

URL rules give a clear overview of access in one place.

### Method security

For finer control, enable method security and annotate service methods:

\`\`\`java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {}
\`\`\`

\`\`\`java
@Service
public class BookService {

    @PreAuthorize("hasAuthority('SCOPE_LIBRARIAN')")
    public BookResponse create(CreateBookRequest request) { ... }
}
\`\`\`

Method security protects the operation no matter how it is called, which is useful when the same service is used by several controllers or scheduled jobs. Like transactions, method security works through proxies, so calling an annotated method from another method in the same class skips the check. Keep secured operations as public methods called from other beans.

### Ownership checks

Roles are not enough for data that belongs to specific users. A member requesting \`/api/members/7/loans\` must be member 7, or a librarian. Implement this deliberately:

\`\`\`java
@GetMapping("/api/loans/mine")
public List<LoanResponse> myLoans(@AuthenticationPrincipal Jwt jwt) {
    return loanService.findActiveLoansFor(jwt.getSubject());
}
\`\`\`

Using the identity from the token, rather than an ID supplied by the client, prevents members from reading other members' data by changing a number in the URL. This class of bug, often called insecure direct object reference, is one of the most common and serious API vulnerabilities.

### Testing security rules

Security rules are code and need tests. Spring Security's test support lets you simulate users:

\`\`\`java
@Test
void membersCannotCreateBooks() throws Exception {
    mockMvc.perform(post("/api/books")
                .with(jwt().authorities(new SimpleGrantedAuthority("SCOPE_MEMBER")))
                .contentType(MediaType.APPLICATION_JSON)
                .content(validBookJson))
           .andExpect(status().isForbidden());
}
\`\`\`

Test both what should be allowed and what should be denied. A missing rule that accidentally opens an endpoint is exactly the kind of mistake tests catch.

### Principle of least privilege

| Practice | Why |
|---|---|
| Deny by default, allow explicitly | New endpoints are protected automatically |
| Give users the lowest role they need | Limits damage from compromised accounts |
| Separate admin endpoints clearly | Easier to audit and protect |
| Review access rules when adding features | Prevents accidental exposure |

Security reviews should check every new endpoint: who can call it, and can they access only their own data?
      `,
        [
          q('What does hasRole("LIBRARIAN") check for?', [
            'The authority LIBRARIAN_ROLE',
            'The username LIBRARIAN',
            'The authority ROLE_LIBRARIAN',
            'The scope claim only',
          ], 2, 'hasRole adds the ROLE_ prefix and checks for that authority.'),
          q('Why use the identity from the token rather than a client-supplied member ID?', [
            'Tokens contain the member\'s full loan history',
            'Client IDs cannot be parsed',
            'It makes responses smaller',
            'It stops users viewing other members\' data by changing the ID',
          ], 3, 'Trusting client-supplied IDs allows insecure direct object reference attacks.'),
          q('Why write tests for security rules?', [
            'Spring Security requires tests to start',
            'A missing or wrong rule can silently expose endpoints',
            'Tests make tokens expire faster',
            'Security rules cannot be read in code',
          ], 1, 'Tests verify both allowed and denied access, catching accidental openings before release.'),
        ]
      ),
      ],
      [
      q('What does adding spring-boot-starter-security do immediately?', [
        'Nothing until configured',
        'Opens every endpoint publicly',
        'Secures all endpoints by default',
        'Deletes existing users',
      ], 2, 'Spring Security is secure by default, requiring authentication until you configure access.'),
      q('Which modern configuration style replaces WebSecurityConfigurerAdapter?', [
        'XML configuration files',
        'A SecurityFilterChain bean using HttpSecurity',
        'Annotations on every controller method only',
        'A security.properties file',
      ], 1, 'Current Spring Security configures security through SecurityFilterChain beans with a lambda style.'),
      q('What does the delegating password encoder\'s {bcrypt} prefix allow?', [
        'Storing plain passwords',
        'Skipping password checks',
        'Sharing passwords between users',
        'Identifying the algorithm and upgrading it later',
      ], 3, 'The prefix records the hashing algorithm, so stored hashes can be migrated to stronger ones.'),
      q('Which approach reduces security code an API must maintain in larger systems?', [
        'Using an identity provider and acting as a resource server',
        'Writing a custom token parser for each endpoint',
        'Storing passwords in the JWT',
        'Disabling authentication in production',
      ], 0, 'An identity provider handles logins and token issuing, leaving the API to validate tokens only.'),
      ]
    ),
    chapter(
      'Testing, Packaging and Deployment',
      'Write integration tests against a real PostgreSQL database with Testcontainers, package applications as runnable JARs, build efficient Docker images, and configure Spring Boot safely for production.',
      [
      lesson('Integration Tests With Testcontainers', 14, `
Unit tests check logic in isolation, and MockMvc tests check the web layer. But some bugs only appear when everything runs together: a query that works in your head but fails on PostgreSQL, a migration with a typo, a transaction that does not roll back. Integration tests catch these, and Testcontainers makes it practical to run them against a real database.

### Why not an in-memory database?

Many tutorials use H2, an in-memory database, for tests. It is fast, but it is not PostgreSQL. SQL dialects, constraint behaviour, JSON columns and functions differ, so tests can pass on H2 and the application can still fail in production. Testing against the same database you run in production removes this gap.

### Testcontainers

Testcontainers starts real services, such as PostgreSQL, Redis or Kafka, in Docker containers during tests, and removes them afterwards. It requires Docker to be available on the machine or CI runner.

Add the dependencies for Spring Boot's Testcontainers support and the PostgreSQL module, then:

\`\`\`java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class LoanFlowIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    TestRestTemplate rest;

    @Autowired
    BookRepository books;

    @Test
    void borrowingReducesAvailableCopies() {
        Book book = books.save(new Book("Aangan", "Khadija Mastoor", "9789690000011", 2));

        ResponseEntity<String> response = rest.postForEntity(
                "/api/loans",
                new BorrowRequest(book.getId(), 1L),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(books.findById(book.getId()).orElseThrow().getCopiesAvailable())
                .isEqualTo(1);
    }
}
\`\`\`

\`@ServiceConnection\` tells Spring Boot to connect to the container automatically, without writing datasource properties. Flyway runs your migrations against the container, so the test also proves the migrations work.

In a secured application, the test would also send a valid token or use Spring Security's test support; the example is simplified to focus on Testcontainers.

### Repository tests

For focused repository tests, \`@DataJpaTest\` loads only the JPA layer. Combined with Testcontainers, it tests custom queries against real PostgreSQL:

\`\`\`java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class LoanRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    LoanRepository loans;

    @Test
    void findsOnlyOverdueUnreturnedLoans() {
        // arrange loans with different due dates and return dates, then:
        // assertThat(loans.findOverdue(LocalDate.of(2025, 3, 15))).hasSize(1);
    }
}
\`\`\`

\`Replace.NONE\` stops Spring from swapping in an embedded database.

### Keeping integration tests fast

| Technique | Benefit |
|---|---|
| Reuse one container per test class (static field) | Avoid starting a database for every test |
| Share containers across classes with a base class | Fewer container starts per build |
| Clean data between tests | Tests stay independent |
| Keep the number of full integration tests focused | Most logic is covered by faster unit tests |

### Integration tests in CI

In a CI pipeline, such as GitHub Actions, Docker is usually available on standard Linux runners, so Testcontainers works there too. Running integration tests on every pull request catches database and wiring problems before they reach production, which is far cheaper than finding them after deployment.
      `,
        [
          q('Why test against PostgreSQL instead of H2?', [
            'H2 cannot store any data',
            'Differences between databases can hide bugs that appear in production',
            'PostgreSQL tests never need Docker',
            'Spring Boot does not support H2',
          ], 1, 'Testing with the production database engine catches dialect and behaviour differences.'),
          q('What does @ServiceConnection do for a Testcontainers PostgreSQL container?', [
            'Deletes the container after each test method',
            'Runs the container on a remote server',
            'Writes Flyway migrations automatically',
            'Connects Spring Boot to the container without manual properties',
          ], 3, 'It supplies connection details from the container to Spring Boot automatically.'),
          q('What does Testcontainers require on the machine running tests?', [
            'A production database',
            'A cloud account',
            'Docker',
            'A Windows operating system',
          ], 2, 'Testcontainers starts services in Docker containers, so Docker must be available.'),
        ]
      ),
      lesson('Packaging a Runnable JAR', 12, `
Spring Boot applications are usually packaged as a single executable JAR containing your code, all dependencies and the embedded web server. That one file runs anywhere with a compatible Java runtime, which makes deployment simple and consistent.

### Building the JAR

\`\`\`bash
./mvnw clean package
\`\`\`

Maven compiles the code, runs the tests and produces:

\`\`\`text
target/library-api-0.0.1-SNAPSHOT.jar
\`\`\`

With Gradle, the equivalent is \`./gradlew bootJar\`, producing a JAR in \`build/libs/\`.

The Spring Boot Maven plugin, included by Spring Initializr, repackages the normal JAR into an executable "fat" JAR with dependencies nested inside.

### Running it

\`\`\`bash
java -jar target/library-api-0.0.1-SNAPSHOT.jar
java -jar app.jar --spring.profiles.active=prod
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
\`\`\`

Configuration can be passed as command-line arguments or environment variables, as chapter 6 explained. The same JAR runs in every environment; only the configuration changes.

### Skipping tests carefully

\`\`\`bash
./mvnw package -DskipTests
\`\`\`

Skipping tests is sometimes useful in a Docker build when tests already ran earlier in the pipeline. Never skip them as a habit to "save time"; tests that do not run protect nothing.

### Check the JAR before shipping

Before deploying a new build, run the JAR locally with a production-like profile and confirm three things: it starts without errors, \`/actuator/health\` reports UP, and one or two key endpoints respond correctly. This five-minute check catches missing configuration, broken migrations and packaging mistakes before they reach users.

### JVM memory settings

The JVM decides how much memory to use based on the machine or container limits. Common options:

| Option | Purpose |
|---|---|
| \`-Xmx512m\` | Fixed maximum heap size |
| \`-XX:MaxRAMPercentage=75\` | Heap as a percentage of available memory, useful in containers |
| \`-XX:+UseG1GC\` | G1 garbage collector, the default in modern JVMs |

In containers, percentage-based settings adapt when memory limits change, leaving room for non-heap memory such as threads and metaspace.

### Build information

Adding the \`build-info\` goal to the Spring Boot plugin records the version and build time, which Actuator's \`/actuator/info\` endpoint then shows. When investigating an incident, knowing exactly which version is running is invaluable.

\`\`\`xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <executions>
    <execution>
      <goals>
        <goal>build-info</goal>
      </goals>
    </execution>
  </executions>
</plugin>
\`\`\`

### Versioning releases

Replace \`0.0.1-SNAPSHOT\` with meaningful versions for releases, such as \`1.4.0\`, following semantic versioning: increase the major number for breaking changes, the minor number for new features and the patch number for fixes. Tag releases in Git so any deployed version can be traced back to its exact source code.

### Startup time

Spring Boot applications typically start in seconds. For faster startup and lower memory, advanced options such as class data sharing, and GraalVM native images, exist. Native images start very quickly but take longer to build and have limitations. For most APIs, a standard JAR on a modern JVM is the right default.
      `,
        [
          q('What does a Spring Boot executable JAR contain?', [
            'Only your compiled classes',
            'Only the dependencies',
            'Your code, dependencies and the embedded server',
            'A copy of the database',
          ], 2, 'The fat JAR packages everything needed to run the application with java -jar.'),
          q('Why is -XX:MaxRAMPercentage useful in containers?', [
            'It disables garbage collection',
            'It makes the JAR smaller',
            'It sets the application\'s port',
            'The heap adapts to the container\'s memory limit',
          ], 3, 'Percentage-based heap settings scale with container limits while leaving room for other memory.'),
          q('Why record build information in the JAR?', [
            'To know exactly which version is running during incidents',
            'To make the application start faster',
            'To encrypt the configuration',
            'Spring Boot refuses to run without it',
          ], 0, 'Build info exposed through Actuator identifies the deployed version quickly.'),
        ]
      ),
      lesson('Docker Images for Spring Boot', 13, `
Containers package the application together with its Java runtime and operating system libraries, so it runs identically on a laptop, a test server and production. Docker images are now a standard way to deploy Spring Boot applications, whether on a single server, a cloud platform or Kubernetes.

### A multi-stage Dockerfile

\`\`\`dockerfile
# Stage 1: build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -q dependency:go-offline
COPY src src
RUN ./mvnw -q package -DskipTests

# Stage 2: run
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 1001 spring
COPY --from=build /workspace/target/*.jar app.jar
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
\`\`\`

### Why this structure

| Choice | Benefit |
|---|---|
| Multi-stage build | The final image contains only the JRE and the JAR, not Maven or source code |
| Copy \`pom.xml\` before \`src\` | Dependencies are cached; code changes do not re-download them |
| JRE base image | Smaller than a full JDK |
| Non-root user | Limits damage if the application is compromised |
| \`MaxRAMPercentage\` | Heap adapts to the container's memory limit |

Tests are skipped inside the Docker build here because the CI pipeline should run them in an earlier step.

### Building and running

\`\`\`bash
docker build -t library-api:1.0.0 .
docker run -p 8080:8080 \\
  -e SPRING_PROFILES_ACTIVE=prod \\
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/library \\
  -e SPRING_DATASOURCE_USERNAME=library \\
  -e DB_PASSWORD=change-me \\
  library-api:1.0.0
\`\`\`

Configuration comes from environment variables, so the same image runs in every environment.

### Buildpacks: images without a Dockerfile

Spring Boot can build an optimised image using Cloud Native Buildpacks:

\`\`\`bash
./mvnw spring-boot:build-image
\`\`\`

Buildpacks choose a suitable JRE, layer the application for efficient caching and apply sensible memory settings. Many teams use this instead of maintaining a Dockerfile.

### Layered JARs

Spring Boot can split a JAR into layers, dependencies, Spring Boot loader, snapshot dependencies and application code, so that Docker caches rarely changing layers. When only your code changes, only a small layer needs rebuilding and pushing. Buildpacks use this automatically; hand-written Dockerfiles can use it too.

### Docker Compose for local development

\`\`\`yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: library
      POSTGRES_USER: library
      POSTGRES_PASSWORD: library
    ports:
      - "5432:5432"
  api:
    build: .
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/library
      SPRING_DATASOURCE_USERNAME: library
      DB_PASSWORD: library
    ports:
      - "8080:8080"
\`\`\`

\`docker compose up\` starts the database and the API together. Recent Spring Boot versions also include Docker Compose support that can start services from a \`compose.yaml\` file automatically during development.

### Image hygiene

- Tag images with versions, not only \`latest\`.
- Scan images for known vulnerabilities in CI.
- Rebuild regularly to pick up security updates in base images.
- Keep secrets out of images; pass them at runtime.
      `,
        [
          q('Why use a multi-stage Dockerfile?', [
            'To run two applications in one container',
            'To avoid needing a Java runtime',
            'The final image excludes build tools and source code',
            'To make tests run inside production',
          ], 2, 'The build stage compiles the app, and only the JAR and JRE are copied into the final image.'),
          q('Why copy pom.xml before the source code in the Dockerfile?', [
            'Dependency downloads are cached when only code changes',
            'Maven requires pom.xml to be copied last',
            'It makes the JAR smaller',
            'Docker cannot copy folders first',
          ], 0, 'Docker caches the dependency layer, so code changes do not trigger re-downloading dependencies.'),
          q('Why run the application as a non-root user in the container?', [
            'Root users cannot run Java',
            'It makes the image smaller',
            'It is required to expose port 8080',
            'It limits damage if the application is compromised',
          ], 3, 'Least privilege inside the container reduces what an attacker could do after a breach.'),
        ]
      ),
      lesson('Configuring for Production', 13, `
An application that works on a laptop is not automatically ready for production. Production brings real users, real data, failures, attackers and the need to change things without downtime. A handful of configuration practices make Spring Boot applications reliable and secure in production.

### A production checklist

| Area | Practice |
|---|---|
| Configuration | Externalised through environment variables and the \`prod\` profile |
| Secrets | From a secret store or environment, never in Git or images |
| Database | Flyway migrations, \`ddl-auto: validate\`, backups tested regularly |
| Connection pool | HikariCP sized sensibly for the database and instance count |
| HTTPS | Terminated at a reverse proxy or load balancer |
| Health checks | Actuator liveness and readiness probes |
| Logging | Structured logs to standard output, collected centrally |
| Metrics | Micrometer metrics scraped by a monitoring system |
| Shutdown | Graceful shutdown so in-flight requests complete |
| Errors | No stack traces or internal details returned to clients |

### Connection pool sizing

Spring Boot uses HikariCP for database connections. More connections are not always better: the database has limits, and every application instance has its own pool.

\`\`\`yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      connection-timeout: 5000
\`\`\`

With four instances of the API, a pool size of 10 means up to 40 connections to the database. Check that the database's connection limit allows this, with room for migrations and administrative access.

### Graceful shutdown

When deploying a new version, old instances should stop accepting new requests but finish the ones in progress. Recent Spring Boot versions enable graceful shutdown by default; you can configure the grace period:

\`\`\`yaml
spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s
\`\`\`

Combined with readiness probes, this allows deployments without dropping requests.

### Reverse proxy and HTTPS

Applications usually run behind a reverse proxy or load balancer, such as Nginx, a cloud load balancer or an ingress controller, which handles HTTPS certificates. Configure Spring Boot to trust forwarded headers so it knows the original scheme and client address:

\`\`\`yaml
server:
  forward-headers-strategy: framework
\`\`\`

### Database migrations without downtime

When several instances run during a deployment, old and new versions briefly use the same database. Migrations should be backward compatible: add a new column in one release and remove the old one in a later release, rather than renaming in one step. This expand-and-contract approach avoids errors during rollouts.

### Security headers and dependencies

Spring Security adds sensible security headers by default. Keep dependencies up to date, since Spring Boot patch releases often include security fixes, and scan dependencies and images in CI.

### Observability in practice

When something goes wrong at 2 a.m., you need answers quickly: Is the application healthy? Which requests are failing? Did error rates rise after the last deployment? Health endpoints, metrics dashboards, alerts on error rates and searchable structured logs with request IDs answer these questions. Set them up before launch, not after the first incident.

### Deployment options

Spring Boot runs anywhere Java or containers run: a virtual private server with Docker Compose, managed container services on major cloud providers, Platform-as-a-Service offerings, or Kubernetes clusters. The practices above apply to all of them, and a CI/CD pipeline that builds, tests and deploys automatically ties everything together.
      `,
        [
          q('Four API instances each have a connection pool of 10. How many database connections might be used?', [
            '10',
            '14',
            'Up to 40',
            'Exactly 4',
          ], 2, 'Each instance has its own pool, so total connections multiply by the number of instances.'),
          q('What does graceful shutdown allow during deployments?', [
            'In-flight requests finish before the old instance stops',
            'The database is deleted and recreated',
            'Tests are skipped automatically',
            'New code is compiled on the server',
          ], 0, 'Graceful shutdown stops new traffic but lets current requests complete, avoiding dropped requests.'),
          q('How should a column rename be handled with rolling deployments?', [
            'Rename it in one migration and deploy all instances at once',
            'Use ddl-auto: update in production',
            'Rename it manually in the database during peak hours',
            'Add the new column first and remove the old one in a later release',
          ], 3, 'Expand-and-contract migrations keep old and new versions compatible during rollouts.'),
        ]
      ),
      ],
      [
      q('Which annotation loads only the JPA layer for repository tests?', [
        '@WebMvcTest',
        '@SpringBootApplication',
        '@DataJpaTest',
        '@EnableCaching',
      ], 2, '@DataJpaTest is a slice test for repositories and JPA configuration.'),
      q('Which command packages a Maven Spring Boot project into an executable JAR?', [
        './mvnw spring-boot:run',
        './mvnw clean package',
        'java -jar pom.xml',
        'docker compose up',
      ], 1, 'The package phase compiles, tests and produces the executable JAR in target/.'),
      q('What does ./mvnw spring-boot:build-image do?', [
        'Runs the application locally',
        'Creates a Flyway migration',
        'Deploys to Kubernetes directly',
        'Builds an optimised container image with buildpacks',
      ], 3, 'Buildpacks produce a layered, optimised image without a hand-written Dockerfile.'),
      q('Where should HTTPS usually be terminated for a Spring Boot API?', [
        'Inside every controller method',
        'In the database',
        'At a reverse proxy or load balancer',
        'In the Flyway configuration',
      ], 2, 'A reverse proxy or load balancer typically handles certificates and forwards requests to the app.'),
      ]
    ),
    chapter(
      'Projects and Careers',
      'Bring everything together in a complete library API project, judge when microservices help and when they hurt, prepare for Java and Spring Boot interviews, and plan a career as a Java developer.',
      [
      lesson('Building a Complete Library API', 14, `
The best way to consolidate what you have learned is to build one complete, well-structured project and put it in your portfolio. A library management API exercises nearly every skill in this course and is easy for interviewers to understand quickly.

### Features to build

| Feature | Skills practised |
|---|---|
| Register and log in members, with JWT | Spring Security, password hashing, tokens |
| Librarians add, update and remove books | REST controllers, validation, roles |
| Search books with paging and sorting | Spring Data queries, Pageable |
| Borrow and return books | Transactions, business rules, 409 conflicts |
| Members see their own loans | Ownership checks, DTOs |
| Daily overdue reminders | Scheduling, async notifications |
| Fines for late returns | Domain logic, money handling, unit tests |
| Health, metrics, structured logs | Actuator, logging |

### Suggested structure

\`\`\`text
library-api/
  src/main/java/pk/cortexis/libraryapi/
    auth/        AuthController, TokenService, SecurityConfig
    book/        Book, BookRepository, BookService, BookController, DTOs
    member/      Member, MemberRepository, MemberService
    loan/        Loan, LoanRepository, LoanService, LoanController, FineCalculator
    notification/ NotificationService, ReminderJob
    common/      ApiExceptionHandler, exceptions, configuration properties
  src/main/resources/
    application.yml, application-dev.yml, application-prod.yml
    db/migration/V1__..., V2__...
  src/test/java/...  unit, web slice and Testcontainers tests
  Dockerfile, compose.yaml, README.md
  .github/workflows/ci.yml
\`\`\`

### Build it in stages

\`\`\`text
Week 1: Books CRUD with validation, errors and Flyway (no security)
Week 2: Members, registration, login and JWT; role rules
Week 3: Loans with transactions, limits, fines and ownership checks
Week 4: Scheduled reminders, Actuator, Docker, CI pipeline, README
\`\`\`

Commit to Git after each small step with clear messages. A clean commit history shows employers how you work, not just what you built.

### Tests that prove it works

Aim for meaningful coverage rather than a percentage:

- Unit tests for \`FineCalculator\` and loan rules, including boundaries.
- MockMvc tests for validation errors, 404s and security rules.
- A Testcontainers test for the full borrow and return flow.

### A CI pipeline

A simple GitHub Actions workflow that runs \`./mvnw verify\` on every push shows professional practice:

\`\`\`yaml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: maven
      - run: ./mvnw -B verify
\`\`\`

Testcontainers works on GitHub's Linux runners because Docker is available there.

### Write a strong README

The README is often the only part of a project a recruiter reads. Include:

- What the API does, in two or three sentences.
- The technology stack.
- How to run it with one command, such as \`docker compose up\`.
- Example requests, or a link to the Swagger UI.
- Design decisions: why JWT, how loans are kept consistent, how fines are calculated.
- What you would improve next.

### Make it your own

Adapt the idea to a domain you know: a clinic appointment system, a school fee tracker, a courier booking API or a restaurant ordering service. The same architecture applies, and a domain you understand makes your design decisions easier to explain in interviews.
      `,
        [
          q('Why build the project in stages?', [
            'Spring Boot requires staged development',
            'Each stage delivers working features and keeps complexity manageable',
            'Git only accepts small projects',
            'It avoids the need for tests',
          ], 1, 'Incremental stages keep the project working at each step and make problems easier to isolate.'),
          q('What should a portfolio project README include?', [
            'Only the project name',
            'Database passwords for testing',
            'The full source code pasted in',
            'What it does, how to run it, example requests and design decisions',
          ], 3, 'A clear README helps recruiters understand and run the project quickly.'),
          q('Why is a clean commit history valuable in a portfolio project?', [
            'It makes the JAR smaller',
            'GitHub rejects messy histories',
            'It shows employers how you work step by step',
            'It replaces the need for tests',
          ], 2, 'Small, well-described commits demonstrate professional habits and thinking.'),
        ]
      ),
      lesson('Microservices: When and When Not', 13, `
Microservices are one of the most discussed topics in back-end development and appear in many job descriptions. They split an application into small, independently deployable services. They solve real problems at scale, but they also add significant complexity. Knowing when they help, and when they hurt, is a sign of maturity.

### Monolith and microservices

| | Modular monolith | Microservices |
|---|---|---|
| Deployment | One application | Many independently deployed services |
| Data | One database, possibly separated by module | Each service owns its data |
| Communication | Method calls | Network calls, HTTP or messaging |
| Complexity | Lower | Much higher: networking, monitoring, consistency |
| Team scaling | Harder with very large teams | Teams own services independently |
| Best for | Most new products and small to medium teams | Large organisations with clear domain boundaries |

### What microservices really cost

Moving from method calls to network calls introduces problems that did not exist before:

- **Network failures**: services can be slow or unavailable, requiring timeouts, retries and circuit breakers.
- **Data consistency**: a single transaction across services is not possible; you need patterns like sagas and eventual consistency.
- **Observability**: tracing one request across many services requires distributed tracing.
- **Operations**: many deployments, pipelines, configurations and versions to manage.
- **Testing**: verifying that services work together requires contract or end-to-end tests.

### Start with a modular monolith

Most successful systems start as a well-structured monolith. The package-by-feature approach from chapter 9 creates clear modules with defined boundaries. If a module later needs to scale independently, or a separate team needs to own it, it can be extracted into a service with far less pain, because its boundaries are already clean.

\`\`\`text
library-api (monolith)
  book module  <-- clear interface -->  loan module  <-->  notification module

Later, if needed:
  notification module  -->  separate notification service, fed by events
\`\`\`

### When microservices make sense

- Different parts of the system have very different scaling needs.
- Several teams need to deploy independently without coordinating every release.
- Parts of the system need different technologies or release cycles.
- Clear domain boundaries are already well understood.

### Spring tools for distributed systems

If you do build microservices, the Spring ecosystem helps:

| Need | Tools |
|---|---|
| HTTP calls between services | \`RestClient\`, declarative HTTP interfaces |
| Messaging and events | Spring for Apache Kafka, Spring AMQP for RabbitMQ |
| Resilience | Resilience4j for retries, timeouts and circuit breakers |
| Configuration | Spring Cloud Config, or platform configuration |
| Tracing | Micrometer Tracing with OpenTelemetry |

### Events for loose coupling

Rather than services calling each other directly for everything, services can publish events, such as \`LoanCreated\`, that other services consume. This reduces coupling: the loan service does not need to know who sends notifications. Even inside a monolith, Spring's application events offer a lightweight version of this idea.

### In interviews

When asked about microservices, show balanced judgement: explain the benefits, name the costs, and describe when you would choose a modular monolith instead. Interviewers are often more impressed by thoughtful trade-offs than by enthusiasm for the latest architecture.
      `,
        [
          q('What is a major cost of moving from a monolith to microservices?', [
            'Java stops working across services',
            'Databases can no longer be used',
            'Network failures, data consistency and operational complexity',
            'Services cannot be tested at all',
          ], 2, 'Network calls, distributed data and many deployments add complexity that monoliths avoid.'),
          q('Why start many systems as a modular monolith?', [
            'Clean module boundaries make later extraction easier, with less early complexity',
            'Monoliths cannot be split later',
            'Microservices are not supported by Spring',
            'Monoliths never need tests',
          ], 0, 'A well-structured monolith is simpler to build and can be split along existing boundaries if needed.'),
          q('What do events like LoanCreated help achieve?', [
            'Faster database queries',
            'Stronger password hashing',
            'Smaller Docker images',
            'Looser coupling between parts of the system',
          ], 3, 'Publishing events lets consumers react without the publisher knowing about them.'),
        ]
      ),
      lesson('Preparing for Java Interviews', 13, `
Java and Spring Boot interviews typically combine core Java questions, Spring questions, problem solving and a discussion of your projects. Preparing systematically, rather than memorising answers, gives you confidence and shows genuine understanding.

### Core Java topics interviewers ask about

| Topic | Typical questions |
|---|---|
| OOP | Encapsulation, inheritance versus composition, interfaces versus abstract classes |
| Strings | Immutability, \`==\` versus \`equals\`, \`StringBuilder\` |
| Collections | \`ArrayList\` versus \`LinkedList\`, how \`HashMap\` works, \`equals\` and \`hashCode\` |
| Exceptions | Checked versus unchecked, try-with-resources |
| Java 8 and later | Lambdas, streams, \`Optional\`, records |
| Concurrency | Threads, \`synchronized\`, \`ExecutorService\`, virtual threads |
| Memory | Heap and stack, garbage collection basics |

### Spring Boot topics

| Topic | Typical questions |
|---|---|
| Core | What is dependency injection? Bean scopes? Constructor versus field injection? |
| Boot | What does auto-configuration do? What is a starter? How do profiles work? |
| Web | How do you handle validation and errors? Status codes for common cases? |
| Data | JPA relationships, N+1 problem, \`@Transactional\` behaviour and pitfalls |
| Security | Authentication versus authorisation, JWT, password storage |
| Testing | Unit versus slice versus integration tests, Testcontainers |

### Explain, do not recite

Compare two answers to "What does @Transactional do?":

\`\`\`text
Weak:   "It makes a method transactional."

Strong: "It wraps the method in a transaction through a Spring proxy, so
         all database changes commit together or roll back together. By
         default it rolls back on unchecked exceptions. Because it works
         through a proxy, calling the method from inside the same class
         bypasses it. In my library project, borrowing a book updates
         copies and creates a loan in one transaction."
\`\`\`

The strong answer shows understanding, knows a pitfall and connects to real experience.

### Coding questions

Many interviews include problems solved in Java: string manipulation, collections, simple algorithms and sometimes data structures. Practise writing clean Java without an IDE's help:

- Reverse words in a sentence.
- Find duplicates in a list.
- Count word frequencies with a \`HashMap\` or streams.
- Group objects by a field.
- Validate balanced brackets with a stack.

Talk through your approach before coding, consider edge cases such as empty input, and test your solution with a small example.

### Project discussion

Be ready to explain your portfolio project in depth:

- Why you structured it the way you did.
- How you handled security, transactions and errors.
- A bug you found and how you fixed it.
- What you would improve with more time.

Interviewers use this discussion to judge whether you truly built and understood the project.

### Practical preparation plan

\`\`\`text
Week 1: Core Java revision with small coding exercises daily
Week 2: Spring Boot concepts; rebuild parts of your project from memory
Week 3: Mock interviews with a friend; explain concepts aloud
Week 4: Company research; tailor your CV; review your project README
\`\`\`

### After the interview

Note the questions you found difficult and study them. Every interview, successful or not, improves the next one.
      `,
        [
          q('What makes an interview answer about @Transactional strong?', [
            'Repeating the annotation name',
            'Giving the shortest possible answer',
            'Explaining how it works, a pitfall and a real project example',
            'Saying it is not important',
          ], 2, 'Depth, awareness of pitfalls and practical experience show real understanding.'),
          q('What should you do before writing code in a coding interview?', [
            'Talk through your approach and consider edge cases',
            'Start typing immediately without explanation',
            'Ask the interviewer to write it for you',
            'Skip testing the solution',
          ], 0, 'Explaining your approach and edge cases shows structured thinking and avoids mistakes.'),
          q('Why do interviewers ask detailed questions about your project?', [
            'To copy your code for their company',
            'To test your typing speed',
            'Because they have no other questions',
            'To judge whether you truly built and understood it',
          ], 3, 'Deep discussion reveals genuine understanding of decisions, problems and trade-offs.'),
        ]
      ),
      lesson('Careers for Java Developers', 12, `
Java skills lead to a wide range of careers, from enterprise back-end development to fintech, cloud platforms and data engineering. The demand for experienced Java and Spring Boot developers has remained strong for years, both in Pakistan and in international remote roles.

### Where Java developers work

| Sector | Typical work |
|---|---|
| Banking and fintech | Payment systems, core banking integrations, digital wallets |
| Telecom | Billing, customer management, network services |
| Software houses | Back-end services for international clients |
| E-commerce and logistics | Order processing, inventory, delivery tracking |
| Government and enterprise | Large internal systems and integrations |
| Product companies | SaaS platforms and APIs |

In Pakistan, banks, telecom operators, fintech startups and large software houses in Karachi, Lahore and Islamabad regularly hire Java and Spring Boot developers. Remote roles with international companies are also common for developers with strong skills and good English communication.

### Career progression

\`\`\`text
Junior developer     Implements features with guidance; learns the codebase
Mid-level developer  Owns features end to end; reviews code; mentors juniors
Senior developer     Designs systems; makes architectural decisions; leads quality
Lead or architect    Shapes technical direction across teams and systems
\`\`\`

Progression depends less on years and more on the scope of problems you can own: from a single endpoint, to a feature, to a system, to a platform.

### Skills that grow your career

- **SQL and databases**: understanding queries, indexes and transactions deeply.
- **Cloud and containers**: Docker, Kubernetes and at least one cloud provider.
- **Messaging**: Kafka or RabbitMQ for event-driven systems.
- **Observability**: logs, metrics and tracing in production.
- **Security**: authentication, authorisation and secure coding.
- **Communication**: explaining designs, writing clear documentation and working with non-technical colleagues.

### Getting the first job

- Build one or two strong projects, like the library API, and publish them with good READMEs.
- Contribute small fixes to open source projects or help classmates.
- Tailor your CV to each role, highlighting relevant Spring Boot, database and testing experience.
- Apply for internships and graduate programmes at banks and software houses; many train juniors in Java.
- Practise interviews, as the previous lesson described.

### Freelancing and remote work

Some Java developers freelance, building APIs or maintaining Spring Boot applications for international clients. Enterprise Java work tends to favour longer-term contracts and full-time remote roles over small one-off gigs. Strong English, reliable communication across time zones and a professional GitHub profile make a significant difference.

### Keep learning, deliberately

Java evolves every six months, and Spring Boot releases regularly. Follow the release notes for new LTS versions and major Spring releases, try new features in small experiments, and keep upgrading your projects. Developers who keep their skills current, and who can explain why a new feature matters, stay valuable throughout their careers.
      `,
        [
          q('What mainly drives career progression for developers?', [
            'Only the number of years worked',
            'Knowing the most programming languages',
            'The scope of problems they can own, from features to systems',
            'The size of their monitor',
          ], 2, 'Growth comes from owning increasingly large and complex problems, not time alone.'),
          q('Which skill complements Java strongly for back-end roles?', [
            'Video editing',
            'SQL and database understanding',
            'Graphic design',
            'Mobile photography',
          ], 1, 'Back-end systems depend heavily on databases, so deep SQL knowledge is highly valued.'),
          q('What helps most when applying for a first Java job?', [
            'Listing every technology you have heard of',
            'Avoiding interviews until you feel perfect',
            'Using the same CV for every application',
            'Strong published projects and a CV tailored to each role',
          ], 3, 'Demonstrable projects and targeted applications show employers relevant ability.'),
        ]
      ),
      ],
      [
      q('Which feature of the library API best practises transactions and business rules?', [
        'Listing books with paging',
        'Exposing the health endpoint',
        'Borrowing and returning books',
        'Writing the README',
      ], 2, 'Borrowing changes several records under rules like limits and availability, requiring transactions.'),
      q('When do microservices make most sense?', [
        'For every new small project',
        'When a team has one developer',
        'When parts need independent scaling and teams need independent deployment',
        'Whenever a project uses Spring Boot',
      ], 2, 'Microservices pay off with clear boundaries, differing scaling needs and multiple independent teams.'),
      q('Which is a common core Java interview question?', [
        'How does HashMap work, and why do equals and hashCode matter?',
        'Which colour theme does your IDE use?',
        'How many monitors do you use?',
        'What is your favourite keyboard?',
      ], 0, 'HashMap internals and the equals/hashCode contract are classic questions testing core understanding.'),
      q('What keeps Java developers valuable over a long career?', [
        'Avoiding new Java versions',
        'Learning only one framework version',
        'Never changing projects',
        'Keeping skills current and understanding why new features matter',
      ], 3, 'Continuous, deliberate learning keeps skills relevant as Java and Spring evolve.'),
      ]
    ),
  ],
  final: [
    q('What makes Java code portable across operating systems?', [
      'Bytecode runs on a JVM available for each platform',
      'It is compiled separately by hand for every computer',
      'It only runs inside web browsers',
      'It is interpreted by the database',
    ], 0, 'javac produces bytecode that any compatible JVM can run.'),
    q('How should the text of two String objects be compared?', [
      'With ==',
      'With the = operator',
      'With equals()',
      'With compareTo() only',
    ], 2, 'equals compares content, while == compares object references.'),
    q('What is the main benefit of encapsulation?', [
      'Faster compilation',
      'Objects protect their own valid state',
      'Fields become public automatically so other classes can read them',
      'Classes no longer need constructors',
    ], 1, 'Private fields changed only through rule-enforcing methods keep objects valid.'),
    q('When is a record the right choice?', [
      'For a JPA entity with changing state',
      'For a service with dependencies',
      'For a class meant for deep inheritance with several subclasses beneath it',
      'For an immutable data carrier such as an API response',
    ], 3, 'Records are concise, immutable data classes, ideal for DTOs and value objects.'),
    q('Which collection gives fast lookups of books by ISBN?', [
      'ArrayList',
      'LinkedList',
      'An array',
      'HashMap',
    ], 3, 'A HashMap retrieves values directly by key without scanning every element.'),
    q('What does a stream do if it has no terminal operation?', [
      'Processes every element immediately',
      'Nothing, because streams are lazy',
      'Modifies the source collection',
      'Throws a compile-time error',
    ], 1, 'Intermediate operations run only when a terminal operation triggers the pipeline.'),
    q('Why is an empty catch block dangerous?', [
      'Failures are hidden and data can become inconsistent',
      'The compiler rejects it',
      'It slows the program down',
      'It deletes the stack trace from disk and from the log files',
    ], 0, 'Swallowed exceptions hide real problems until they cause larger damage.'),
    q('What does findById(id).orElseThrow(...) do when the entity is missing?', [
      'Returns null',
      'Returns an empty entity',
      'Throws the supplied exception',
      'Retries the query',
    ], 2, 'orElseThrow unwraps the value or throws the given exception if it is absent.'),
    q('What is Spring\'s inversion of control?', [
      'Classes create all their own dependencies',
      'Controllers call the database directly',
      'Spring creates objects and supplies their dependencies',
      'The user decides the order of method calls through the application\'s menus',
    ], 2, 'Spring manages object creation and wiring, injecting dependencies into constructors.'),
    q('Why is constructor injection preferred?', [
      'Dependencies are explicit, final and easy to mock',
      'Field injection is not supported',
      'Constructors run faster',
      'It removes the need for annotations anywhere in the application',
    ], 0, 'Constructor injection makes required dependencies clear and supports simple testing.'),
    q('Where should a production database password come from?', [
      'A hard-coded constant',
      'application.yml committed to Git',
      'A comment in the code',
      'An environment variable or secret store',
    ], 3, 'Secrets belong outside version control and are supplied at runtime.'),
    q('What triggers validation of a @RequestBody DTO?', [
      '@RestController',
      '@Valid on the parameter',
      '@Transactional',
      '@Service',
    ], 1, 'Without @Valid, constraint annotations on the DTO are not checked.'),
    q('Which status code suits a business rule conflict like "no copies available"?', [
      '200 OK',
      '409 Conflict',
      '401 Unauthorized',
      '500 Internal Server Error',
    ], 1, '409 signals a conflict with the current state of the resource.'),
    q('What is the N+1 query problem?', [
      'One extra column in each table, added for every foreign key relation',
      'A query with N+1 parameters',
      'N+1 database servers',
      'One query for a list plus one per item for related data',
    ], 3, 'Accessing lazy relationships in a loop multiplies queries, slowing requests.'),
    q('What does @Transactional guarantee?', [
      'Related changes commit together or roll back together',
      'The method never throws exceptions, because Spring catches them all',
      'Results are cached permanently',
      'The method runs asynchronously',
    ], 0, 'Transactions make grouped database changes atomic.'),
    q('Why add new Flyway migrations instead of editing applied ones?', [
      'Flyway only reads the newest file',
      'Editing files deletes data',
      'Flyway detects edits to applied migrations and refuses to start',
      'Migrations cannot be edited on Windows, because the files are locked',
    ], 2, 'Applied migrations are checksummed, so changes must go in new versioned scripts.'),
    q('What is the difference between 401 and 403?', [
      'They mean exactly the same thing',
      '403 means the resource was not found',
      '401 is only used for database errors',
      '401 is unauthenticated; 403 is not allowed',
    ], 3, 'Authentication failures return 401, authorisation failures return 403.'),
    q('How should passwords be stored?', [
      'In plain text',
      'With reversible encryption, using a key kept in the application',
      'With a slow, salted hash such as BCrypt',
      'With a single SHA-256 hash',
    ], 2, 'Password hashing algorithms like BCrypt resist guessing attacks.'),
    q('Why test against PostgreSQL with Testcontainers rather than H2?', [
      'Database differences can hide bugs that appear in production',
      'H2 cannot store data',
      'Testcontainers needs no Docker, because it embeds its own database engine',
      'Spring does not support H2',
    ], 0, 'Testing with the real database engine catches dialect and behaviour differences.'),
    q('Why use a multi-stage Dockerfile?', [
      'To run two apps in one container, one for building and one for serving',
      'The final image excludes build tools and source code',
      'To skip the Java runtime',
      'To run tests in production',
    ], 1, 'Only the JAR and runtime reach the final image, keeping it small and safer.'),
    q('Which Java expression evaluates to 3.5?', [
      '`7 / 2`',
      '`7 / 2.0`',
      '`(double) (7 / 2)`',
      '`(int) 7.5 / 2`',
    ], 1, 'With one double operand the division is done in floating point; the other forms divide two ints first, which truncates to 3 before any conversion.'),
    q('A method declares `var count = 10;` and a later line assigns `count = 2.5;`. What happens?', [
      'A compile error, because count was inferred as int',
      'count becomes 2.5, because var is dynamically typed',
      'count becomes 2, because the value is truncated to fit',
      'A ClassCastException is thrown when that line runs',
    ], 0, 'var infers a fixed static type from the initialiser, so count is an int and assigning a double to it is rejected by the compiler.'),
    q('In an old-style switch statement using `case X:` labels, one matching case has no `break`. What happens when it runs?', [
      'The compiler rejects the switch statement until a break is added',
      'Execution falls through into the next case\'s statements',
      'The switch exits automatically after that case finishes',
      'The default branch runs next, skipping the other cases',
    ], 1, 'Colon-style cases fall through until a break or the end of the switch, which is exactly the bug that arrow-style cases remove.'),
    q('A method receives a Book parameter and runs `book = new Book("New title");`. After it returns, what does the caller\'s variable refer to?', [
      'The new Book, because Java always passes objects by reference',
      'The original Book, because the reference was passed by value',
      'null, because the parameter was reassigned inside the method',
      'A copy of the new Book that is made when the method returns',
    ], 1, 'Java copies the reference into the parameter, so reassigning the parameter changes only the local copy; mutating the object would have been visible to the caller.'),
    q('A switch expression over a four-constant enum handles only three constants with arrow cases and has no default. What happens?', [
      'It compiles and returns null for the missing constant',
      'It fails to compile, because the switch is not exhaustive',
      'It compiles and silently skips the missing constant',
      'It compiles, then throws only if the fourth constant appears',
    ], 1, 'A switch expression must produce a value for every input, so the compiler rejects one that does not cover every enum constant or supply a default.'),
    q('A Book class overrides `equals` to compare ISBNs but does not override `hashCode`. Two books with the same ISBN are added to a HashSet. What is the likely result?', [
      'Only one is kept, because equals reports a match',
      'The second add throws an IllegalStateException',
      'Both are kept, because their hash codes differ',
      'The code fails to compile without hashCode',
    ], 2, 'HashSet first uses hashCode to choose a bucket, so objects that are equal but hash differently are never compared and both are stored.'),
    q('Given `record Isbn(String value) {}`, what does `new Isbn("123").equals(new Isbn("123"))` return?', [
      'true, because records compare their component values',
      'false, because they are two separate objects in memory',
      'It does not compile unless equals is written by hand',
      'true only when both strings come from string literals',
    ], 0, 'The compiler generates equals and hashCode for a record from its components, so two records with equal values are equal.'),
    q('Given `sealed interface Payment permits Card, Cash {}`, a developer adds `final class Voucher implements Payment` without changing the permits clause. What happens?', [
      'It compiles, and Voucher is added to the permitted list automatically',
      'It compiles, but Voucher objects throw when used as a Payment',
      'It compiles only if Voucher lives in the same package as Payment',
      'Compilation fails, because Voucher is not a permitted subtype',
    ], 3, 'A sealed type lists every allowed implementation, and the compiler rejects any other class that tries to implement it.'),
    q('Code removes overdue books from an ArrayList inside `for (Book b : books)` by calling `books.remove(b)`. What usually happens, and what is the fix?', [
      'It works, because for-each iterates over a copy of the list',
      'A compile error, because the list is modified inside the loop',
      'A ConcurrentModificationException; use books.removeIf(...)',
      'Every element is removed, so filter into a new list instead',
    ], 2, 'The for-each iterator detects that the list changed underneath it and throws; removeIf or Iterator.remove modifies the list safely.'),
    q('A `Stream<Book>` is stored in a variable. The code calls `count()` on it and then `toList()` on the same stream. What happens?', [
      'The second call throws an IllegalStateException',
      'toList() returns an empty list after the count',
      'toList() returns every book, as the stream resets',
      'The code fails to compile at the second call',
    ], 0, 'A stream can be consumed by only one terminal operation; create a new stream from the collection for each pipeline.'),
    q('A team makes `BookNotFoundException` extend Exception rather than RuntimeException. What must a method that calls `findBook()`, which throws it, now do?', [
      'Nothing extra, because the compiler never checks this exception',
      'Catch the exception or declare it with throws',
      'Wrap the call in a try-with-resources block',
      'Return an Optional instead of the Book result',
    ], 1, 'A subclass of Exception that is not a RuntimeException is checked, so the compiler forces callers to handle it or declare it.'),
    q('You run `./mvnw package` on a project where two unit tests fail. What is the result?', [
      'The JAR is produced, and the failures are logged as warnings',
      'Only the classes with passing tests are packaged into the JAR',
      'The build stops at the test phase and no JAR is produced',
      'The failing tests are retried until they pass, then it packages',
    ], 2, 'Maven runs every earlier lifecycle phase before package, and a failing test phase fails the build before packaging happens.'),
    q('A fine rule must be checked at 0, 1, 7, 8 and 10 days late. Which JUnit 5 feature fits best?', [
      'Five copies of one test with different names',
      'A single test with a loop and one assertion',
      'A @RepeatedTest that runs the same input five times',
      'A @ParameterizedTest fed by @CsvSource rows',
    ], 3, 'A parameterized test runs one test body for each input row and reports each case separately, which suits boundary values for a rule.'),
    q('Startup fails with "No qualifying bean of type BookService". The class sits in a sub-package of the main application class. What is the most likely cause?', [
      'BookService is missing @Service or another stereotype annotation',
      'BookService needs a public no-argument constructor to be injected',
      'Spring can only inject interfaces, never concrete service classes',
      'The main class must list BookService in @SpringBootApplication',
    ], 0, 'Component scanning only registers classes carrying a stereotype such as @Service, so an unannotated class never becomes a bean.'),
    q('Several services need `library.loan.max-days` and `library.loan.max-books`. What is the cleanest way to read them?', [
      'A @Value field for each setting in every service that needs it',
      'System.getenv calls inside each method that reads a limit',
      'A @ConfigurationProperties record with prefix "library.loan"',
      'Constants copied from application.yml into a shared class',
    ], 2, 'Type-safe configuration properties group related settings in one validated bean, and max-days maps to maxDays automatically.'),
    q('A handler declares `@RequestParam int page` with no default, and a client calls `/api/books` without a page parameter. What does the client receive?', [
      '400 Bad Request',
      '200 OK with page set to 0',
      '404 Not Found',
      '500 Internal Server Error',
    ], 0, '@RequestParam is required by default, so a missing value is rejected as a bad request; use defaultValue or required = false for optional parameters.'),
    q('A client wants to change only a book\'s title and leave its other fields untouched. Which request follows REST conventions?', [
      '`PATCH /api/books/42` with only the title',
      '`PUT /api/books/42` with only the title',
      '`POST /api/books/42/updateTitle`',
      '`GET /api/books/42?title=New`',
    ], 0, 'PATCH is the partial update; PUT replaces the whole resource, verbs do not belong in paths, and GET must never change data.'),
    q('CreateMemberRequest holds a nested AddressRequest whose fields carry @NotBlank. The controller uses `@Valid @RequestBody`, yet blank address fields pass. What is missing?', [
      '@Validated on the AddressRequest class declaration itself',
      '@NotNull on the controller method\'s return type',
      'A second @RequestBody parameter for the address',
      '@Valid on the address field inside CreateMemberRequest',
    ], 3, 'Bean Validation only cascades into a nested object when that field is marked @Valid, so the address constraints are otherwise skipped.'),
    q('A @Transactional service method saves a loan and then throws a checked exception. With default settings, what happens to the saved loan?', [
      'It is rolled back, because any exception at all undoes the whole transaction',
      'It is rolled back, but only if the exception is logged beforehand',
      'It is committed, since default rollback covers only unchecked exceptions',
      'It is left pending until the next transaction commits or rolls back',
    ], 2, 'Spring rolls back by default on RuntimeException and Error only; a checked exception needs rollbackFor to trigger a rollback.'),
    q('Inside a @Transactional method, a loaded Book is changed with `book.rename("New")`, and `save` is never called. What happens at commit?', [
      'Nothing is written, because save was never called on the book repository',
      'The change is written, because Hibernate dirty-checks managed entities',
      'The change is written only if the entity class is marked @Modifying',
      'An exception is thrown for modifying an entity outside the repository',
    ], 1, 'Entities loaded inside a transaction are managed, and Hibernate flushes any changes to them automatically when the transaction commits.'),
    q('A repository is called with `PageRequest.of(1, 20, Sort.by("title"))`. Which books does it return?', [
      'Books 1 to 20 in title order',
      'Books 20 to 40 in title order',
      'Books 1 to 20, then sorted',
      'Books 21 to 40 in title order',
    ], 3, 'Page numbers are zero-based, so page 1 with size 20 is the second page, rows 21 to 40 of the sorted result.'),
    q('findDetails(isbn) is marked @Cacheable. After a librarian edits a book, users keep seeing the old details. What is missing?', [
      'A longer time-to-live on the cache holding the book details',
      'Marking findDetails as @Async so it refreshes in the background',
      'Moving the @Cacheable annotation onto the controller method',
      'A @CacheEvict or @CachePut for that ISBN on the update path',
    ], 3, 'A cache returns its stored value until told otherwise, so any write must evict or refresh the affected entry.'),
    q('A public API sets `management.endpoints.web.exposure.include=*`. What is the main risk?', [
      'Endpoints like env and heapdump can leak secrets and internals',
      'The health endpoint stops responding to the container platform\'s probes',
      'Every request is slowed by collecting extra metrics data',
      'Actuator disables Spring Security for the whole application',
    ], 0, 'Only health is exposed by default for good reason; exposing everything publishes configuration, memory dumps and internals unless locked down.'),
    q('Two members choose the same password, yet their stored BCrypt hashes are different. Why?', [
      'BCrypt encrypts with the member\'s id',
      'The hashes differ only by creation time',
      'Each hash includes its own random salt',
      'One of the two hashes must be corrupted',
    ], 2, 'BCrypt generates a random salt for every hash and stores it inside the result, so equal passwords produce different hashes and precomputed tables are useless.'),
    q('A service method carries `@PreAuthorize("hasAuthority(\'SCOPE_LIBRARIAN\')")`, yet any authenticated member can call it. What is the likely cause?', [
      '@PreAuthorize only works on controller methods, not on services',
      'The annotation must be repeated on every method of the repository',
      'Authorities are checked only when CSRF protection is switched on',
      'Method security was never enabled with @EnableMethodSecurity',
    ], 3, 'Method-level annotations are enforced by proxies that exist only after @EnableMethodSecurity is declared on a configuration class.'),
    q('A user decodes their JWT, edits the payload to grant themselves a librarian scope, and sends it back. What happens?', [
      'The new scope is accepted, because the payload itself is trusted',
      'The server re-signs the token with the edited scope',
      'The signature no longer matches, so the token is rejected',
      'The request succeeds once, until the token expires',
    ], 2, 'The signature covers the header and payload, so any edit invalidates it and the server rejects the token as unauthenticated.'),
    q('With docker compose, the API container connects to `jdbc:postgresql://localhost:5432/library` and cannot reach the `db` service. Why?', [
      'PostgreSQL refuses every connection that arrives from a container',
      'Inside a container, localhost is that container; use the service name db',
      'Port 5432 is reserved on Docker bridge networks and must be changed first',
      'The JDBC driver cannot resolve any hostname while running in Docker',
    ], 1, 'Each container has its own network namespace, so localhost points at the API container itself; compose services reach each other by service name.'),
    q('Which setup exercises the real HTTP server, the security filters and PostgreSQL together in a single test?', [
      '@WebMvcTest with every service bean replaced by @MockitoBean',
      '@SpringBootTest on RANDOM_PORT with a Testcontainers PostgreSQL',
      '@DataJpaTest running against an in-memory H2 database',
      'A plain JUnit test that constructs the controller with new',
    ], 1, 'A full @SpringBootTest on a random port starts the real server and filter chain, and a Testcontainers PostgreSQL gives it the production database engine.'),
    q('Two microservices read and write the same database tables. What is the main problem?', [
      'They are coupled through the schema, so neither can change independently',
      'Two services cannot hold database connections open at the same time',
      'Shared tables make every query run twice, doubling the database load',
      'Each service needs its own JDBC driver, and the two conflict on one database',
    ], 0, 'In microservices each service owns its data; sharing tables ties their deployments and schema changes together and loses the main benefit of splitting.'),
    q('Borrowing a book must update the Loan service and the Inventory service, each with its own database. Why can one @Transactional not cover both?', [
      'It does cover both, provided that both services run exactly the same Spring Boot version',
      'It only fails because the two services are written in different packages',
      'It works once both methods are marked @Async so they run together',
      'It covers only one database, so cross-service steps need events and compensation',
    ], 3, 'A local transaction spans one database connection in one process; keeping two services consistent needs messaging, such as events with an outbox, and compensating steps.'),
  ],
});
