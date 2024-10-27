This file should include very concise summaries of issues faced for future context. Write the issues as a point and in simple english that can be resused as a prompt.

1. Always think step by step

2. Use Tailwind instead of custom CSS wherever possible

3. Import statements in non-module scripts cause syntax errors.
   - Lesson: When using ES6 import statements, ensure the script is loaded as a module or use global objects provided by externally loaded scripts.

4. Module specifier resolution fails for external libraries in module scripts.
   - Lesson: Load external libraries as regular scripts and use their global objects in module scripts.

5. SDK structure may differ from assumptions, causing undefined errors.
   - Lesson: Inspect the structure of imported objects (e.g., using console.log) to understand how to correctly access their properties and methods.

6. Asynchronous operations in initialization functions can lead to timing issues.
   - Lesson: Use async/await consistently in functions that depend on asynchronous operations, including event listeners that call these functions.

7. SDK documentation may not always reflect the exact structure of the provided objects.
   - Lesson: Be prepared to adapt your code based on the actual structure of SDK objects, which may require runtime inspection and flexible coding approaches.

8. Audio Stream Management: Always ensure to properly close media streams when stopping audio recording. This is crucial for releasing system resources and preventing unintended microphone access.

9. Web APIs in Desktop Environments: Using Web APIs (like the Web Audio API) in Electron can be powerful, but requires careful handling of the differences between browser and desktop environments.

10. Avoid using the components.js file. It caused lot of issues and complications in signup.