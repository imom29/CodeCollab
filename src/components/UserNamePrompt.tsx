// components/UserNamePrompt.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { getUsername, setUsername } from "../utils/localStorage";

export default function UserNamePrompt() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = getUsername();
    if (!stored) {
      setOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (name.trim()) {
      setUsername(name.trim())
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      className="p-5"
    >
      <DialogTitle>Welcome!</DialogTitle>
      <DialogContent className="mt-2">
        <TextField
          placeholder="Please enter your name"
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoFocus
          focused
          variant="outlined"
          sx={{
            input: { color: "black" },
            label: { color: "gray" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              border: "0px"
            },
          }}
          
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: "#0899dd" }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
