import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";

interface Position {
  x: number;
  y: number;
}
interface DrawingDataPayload {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<Position>({ x: 0, y: 0 });
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const {
        type,
        drawingData,
      }: { type: string; drawingData: DrawingDataPayload[] } = JSON.parse(
        event.data
      );
      if (type === "clear-space") {
        clearCanvas();
      }
      if (type === "draw-line") {
        drawingData.forEach((element) => {
          const { startX, startY, endX, endY } = element;

          if (context) {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
            context.stroke();
          }
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
      }
    }

    return () => {
      ws.close();
    };
  }, [context]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !socket) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = lastPosition;

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(offsetX, offsetY);
    context.stroke();

    setLastPosition({ x: offsetX, y: offsetY });

    socket.send(
      JSON.stringify({
        event: "draw-line",
        payload: {
          startX: x,
          startY: y,
          endX: offsetX,
          endY: offsetY,
        },
      })
    );
  };
  const handleClearBoard = () => {
    if (socket) {
      socket.send(JSON.stringify({ event: "clear-space" }));
    }
    clearCanvas();
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        <img width={250} src="InnoSpace-Logo.png"></img>
      </Box>

      <Box
        sx={{
          position: "relative",
          border: "2px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: 1,
        }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={{
            backgroundColor: "#ffffff",
            display: "block",
            borderRadius: "8px",
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
        />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ marginTop: 1 }}
      >
        <Button variant="contained" color="primary" onClick={handleClearBoard}>
          Clear Board
        </Button>
      </Stack>
    </Box>
  );
};

export default App;
