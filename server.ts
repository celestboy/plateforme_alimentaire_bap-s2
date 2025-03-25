import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", ({ room, username }) => {
      socket.join(room);
      console.log(`User ${username} joined room ${room}`);
    });

    socket.on("message", async (data) => {
      console.log("Message reçu sur le serveur:", data);
      if (data?.room && data?.message && data?.sender) {
        console.log(
          `Message from ${data.sender} (ID: ${data.senderID}) in room ${data.room}: ${data.message}`
        );
        socket.to(data.room).emit("message", data);
      } else {
        console.log("Invalid message data:", data);
      }
    });

    socket.on("status_update", (data) => {
      console.log("Status update received:", data);
      if (data?.room && data?.status) {
        // Broadcast status update to everyone in the room
        io.to(data.room).emit("status_update", data);
      }
    });

    socket.on("local-system-message", (data) => {
      console.log("Local system message received:", data);
      // This is a special case where we want to emit only to the sender
      // (not using socket.to() which would emit to everyone else)
      socket.emit("local-system-message", data);
    });

    socket.on("new_chat_created", (data) => {
      console.log("New chat created:", data);

      // Broadcast to both users involved in the chat
      if (data.donneur_id && data.receveur_id) {
        // Using a special room name format for user-specific notifications
        socket.to(`user_${data.donneur_id}`).emit("new_chat", data);
        socket.to(`user_${data.receveur_id}`).emit("new_chat", data);
      }
    });

    // Add this event handler for users joining their personal notification room
    socket.on("join_user_room", (userId) => {
      if (userId) {
        const userRoom = `user_${userId}`;
        socket.join(userRoom);
        console.log(
          `User ${userId} joined personal notification room ${userRoom}`
        );
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on("leave-room", ({ room, userId }) => {
      socket.leave(room);
      console.log(`User ${userId} left room ${room}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
