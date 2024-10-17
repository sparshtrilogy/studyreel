This file should include very concise summaries of issues faced for future context. Write the issues as a point and in simple english that can be resused as a prompt.

1. Import statements in non-module scripts cause syntax errors.
   - Lesson: When using ES6 import statements, ensure the script is loaded as a module or use global objects provided by externally loaded scripts.

2. Module specifier resolution fails for external libraries in module scripts.
   - Lesson: Load external libraries as regular scripts and use their global objects in module scripts.

3. SDK structure may differ from assumptions, causing undefined errors.
   - Lesson: Inspect the structure of imported objects (e.g., using console.log) to understand how to correctly access their properties and methods.

4. Asynchronous operations in initialization functions can lead to timing issues.
   - Lesson: Use async/await consistently in functions that depend on asynchronous operations, including event listeners that call these functions.

5. SDK documentation may not always reflect the exact structure of the provided objects.
   - Lesson: Be prepared to adapt your code based on the actual structure of SDK objects, which may require runtime inspection and flexible coding approaches.
