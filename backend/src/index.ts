import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let drawingData: { event: string; payload: any }[] = [];

app.use(express.static("public"));

wss.on("connection", (ws: WebSocket) => {
  console.log("A user connected");
  ws.send(JSON.stringify({ type: "draw-line", drawingData: drawingData }));

  ws.on("message", (message: string) => {
    try {
      const { event, payload } = JSON.parse(message);

      if (event === "draw-line") {
        drawingData.push(payload);

        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "draw-line", drawingData: drawingData })
            );
          }
        });
      }
      if (event === "clear-space") {
        drawingData = [];

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "clear-space" }));
          }
        });
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("A user disconnected");
  });

  ws.on("error", (err: Error) => {
    console.error("WebSocket error:", err);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
