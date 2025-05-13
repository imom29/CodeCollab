import react from 'react'

type SidebarProps = {
    files: []
}

const Sidebar = (props: SidebarProps) => {
    const {files} = props;
    return (
        <div
          style={{
            width: "200px",
            background: "#1e1e1e",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            margin: "5px",
            flex: 0.5,
          }}
        >

          {/* New File Button */}
          <button
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#0899dd",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginBottom: "10px",
              cursor: "pointer",
              display: "flex",
              gap: "1rem"
            }}
            onClick={() => {
              const fileName = prompt("Enter new file name (e.g., newFile.js)");
              if (!fileName) return;
              if (files.find((file) => file.fileName === fileName)) {
                alert("File with this name already exists!!");
                return;
              }

              socketRef.current?.emit("create-file", { roomId, fileName });
            }}
          >
           <FilePlus2 /> Add File
          </button>

          <h3>Files</h3>

          {files.map((file) => (
            <div
              key={file.fileName}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px",
                background:
                  activeFile?.fileName === file.fileName
                    ? "#333"
                    : "transparent",
                borderRadius: "4px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <InsertDriveFileOutlinedIcon
                  sx={{ marginRight: "5px", color: "#0899dd" }}
                />
                {file.fileName}
              </div>
              <div>
                <DeleteOutlineIcon
                  fontSize="small"
                  style={{
                    color: "#0899dd",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const res = confirm(
                      "Are you sure you want to delete this file?"
                    );
                    if (!res) return;
                    const fileName = file.fileName;

                    socketRef.current?.emit("delete-file", {
                      roomId,
                      fileName,
                    });
                  }}
                >
                  Delete file
                </DeleteOutlineIcon>
              </div>
            </div>
          ))}
        </div>
    )
}