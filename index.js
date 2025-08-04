import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";

const PORT = process.env.PORT || 7000;
const app = express();
app.use(express.static(path.resolve("./public"))); // <-- Add this line
const httpServer = createServer(app);
const __dirname = path.resolve("./public");

// initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// when a client connects, log the connection.
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
  socket.on("message", (msg) => {
    // console.log("Message received: ", msg);
    io.emit("message", { msg, senderId: socket.id }); // Broadcast the message to all connected clients
  });
});

// Serve static files from the public directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
