export const findLanguage = (fileName) => {
  const ext = fileName.split(".").pop();
  switch (ext) {
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
      return "plaintext";
  }
};
