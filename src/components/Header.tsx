import react from "react"
import { Clipboard, Download } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type HeaderProps = {
    roomId?: string,
    files: FileObject[]
}

const Header = (props: HeaderProps) => {
    const { roomId, files } = props

    const handleDownloadZip = async () => {
      const zip = new JSZip();
    
      files.forEach(({ fileName, code }) => {
        zip.file(fileName, code);
      });
    
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "code-files.zip");
    };
    

    return (
        <div
        style={{ background: "#222", color: "#fff" }}
        className="flex justify-between items-center"
      >
        <img src="/src/assets/logo.png" alt="" className="w-12" />
        
        <span style={{ marginLeft: 20, fontSize: 14 }} className="flex items-center">
          Share this link to collaborate: {window.location.href}
          <button
            className="px-1 text-xs text-zinc-300 hover:text-white cursor-pointer"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            title="Copy room link"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </span>

        <button
          onClick={handleDownloadZip}
          className="bg-brand-blue hover:bg-dark-blue text-white px-2 py-1 rounded-md text-sm cursor-pointer"
          title="Download as ZIP"
        >
          <Download />
        </button>

      </div>
    )
}

export default Header;