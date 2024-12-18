import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import "./index.css";

const theme = createTheme({
  typography: {
    fontFamily: "system-ui",
  },
  palette: {
    primary: {
      main: "#343434",
    },
    secondary: {
      main: "#f0f3f4",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
