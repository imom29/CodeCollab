type CodeObjectType = {
    fileName: 
    {
        defaultCode: string;
        currentLanguage: string;
    }
}
interface FileObject {
    fileName: string;
    code: string;
    language: string;
  }

  interface User {
    socketId: string;
    name: string;
  }