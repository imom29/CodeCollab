
export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
};

export const findExtension = (language: string) => {
  switch (language.toLowerCase()) {
    case "javascript":
      return "js";
    case "python":
      return "py";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "html":
      return "html";
    default:
      return "txt";
  }
};

export const findLanguage = (ext: string) => {
  switch (ext.toLowerCase()) {
    case "js":
      return "javascript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "html":
      return "html";
    default:
      return "txt";
  }
};

export const DEFAULT_CODE = {
  javascript: `console.log('Hello, world!')`,
  python: `def greet():\n    print("Hello!")`,
  html: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello!</h1>\n  </body>\n</html>`,
  java: `public class Main {\npublic static void main(String[] args) {\nSystem.out.println("Hello, world!");\n// You can call other methods here\ngreetUser("Alice");\n}\n\npublic static void greetUser(String name) {\nSystem.out.println("Hello, " + name + "!");\n}\n}`,
};

// export const fileIcons = (language: string) => {
//   switch(language){
//     case "javascript": return <i class="fa-brands fa-js"></i>;
//     case "python": return 
//   }
// };
