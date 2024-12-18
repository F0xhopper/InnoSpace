import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";

import "./App.css";

function App() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        InnoSpace
      </Typography>
      <Box
        sx={{
          border: "2px solid #000",
          width: "100%",
          height: "500px",
          position: "relative",
          backgroundColor: "#fff",
        }}
      >
        <canvas
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </Box>{" "}
      <Box mb={2}>
        <Button variant="contained" color="primary">
          Clear Board
        </Button>
      </Box>
    </Container>
  );
}

export default App;
