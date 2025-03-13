// A function should be made a utility function when it is generic, reusable, and
// not tied to a specific business logic or context. Here are some key indicators:

// Reusability – If a function is used across multiple parts of the codebase, it’s
//  a good candidate for a utility function.
// Example: Formatting dates, string manipulation, mathematical operations.

// Statelessness – A utility function should not depend on or modify any external
// state; it should be pure (given the same inputs, always return the same outputs).
// Example: capitalizeFirstLetter(str), isEven(num), sortArray(arr)

// General Purpose – If the function is not specific to a single feature or module
// but can be used in multiple places.
// Example: Converting temperature units, deep-cloning objects.

// Encapsulation of Common Logic – When multiple parts of the codebase need to
// perform the same logic, extracting it into a utility function avoids code duplication.
// Example: debounce(fn, delay), mergeObjects(obj1, obj2)

// Improves Readability & Maintainability – Utility functions help keep business
// logic clean and readable by abstracting away common operations.
// No Side Effects – Utility functions should generally avoid modifying global
// variables, databases, or other external states.
