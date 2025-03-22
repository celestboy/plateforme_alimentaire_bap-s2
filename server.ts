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
				// Diffuser à tous les autres membres de la salle
				socket.to(data.room).emit("message", data);
			} else {
				console.log("Invalid message data:", data);
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
