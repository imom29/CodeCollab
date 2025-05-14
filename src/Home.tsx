import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import logo from "./assets/logo.png"; // Adjust path as needed

export default function LandingPage() {
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoomId = crypto.randomUUID().slice(0, 8);
    window.location.href = `/room/${newRoomId}`;
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      window.location.href = `/room/${roomId}`;
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "#1e293b",
          color: "white",
          boxShadow: 6,
          borderRadius: 3,
        }}
      >
        <CardContent>
        <Box textAlign="center">
        <img
          src={logo}
          alt="CodeCollab Logo"
          style={{
            width: 120,
            height: "auto",
            margin: "0 auto",
            filter: "drop-shadow(0 0 4px #0899ddaa)",
          }}
        />
      </Box>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Join a Coding Room
          </Typography>

          <Stack spacing={2} mt={3}>
            <Button
              variant="contained"
              onClick={createRoom}
              sx={{
                bgcolor: "#0899dd",
                "&:hover": { bgcolor: "#066699" },
                textTransform: "none",
              }}
            >
              Create New Room
            </Button>

            <h1>Or Join an existing room:</h1>

            <TextField
              variant="filled"
              label="Room ID"
              fullWidth
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              InputProps={{
                sx: {
                  color: "white",
                  backgroundColor: "#334155",
                },
              }}
              InputLabelProps={{
                sx: { color: "#94a3b8" },
              }}
            />

            <Button
              variant="outlined"
              onClick={joinRoom}
              sx={{
                borderColor: "#0899dd",
                color: "#0899dd",
                "&:hover": {
                  borderColor: "#066699",
                  backgroundColor: "#0899dd22",
                },
                textTransform: "none",
              }}
            >
              Join Room
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
