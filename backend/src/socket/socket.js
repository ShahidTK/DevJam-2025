export const configureSocket = (io) => {
    io.on("connection", (socket) => {
      console.log(`User connected with socket ID: ${socket.id}`);
  
      // Join a room

      socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined room: ${room}`);
          socket.emit("error", "Username and room are required.");
          return;
        });
  
        socket.join(room);
        socket.username = username;
        socket.room = room;
  
        // Notify room that a user has joined
        io.to(room).emit("userJoined", `${username} has joined the room ${room}.`);
        console.log(`${username} joined room: ${room}`);
      });
  

   

// Server-side code (Socket.IO)
socket.on("sendMessage", ({ username, message, room }) => {
    if (!message || !room) {
      socket.emit("error", "Message and room are required.");
      return;
    }
  
    const messageData = {
      sender: username,
      text: message,
      timestamp: new Date().toISOString(),
    };
  
    // Broadcast the message to the room
    io.to(room).emit("receiveMessage", messageData);
    console.log(`Message sent to room ${room}:`, messageData);
  });

  socket.on("drawing", (data) => {
    // Broadcast drawing actions to all users in the room
    io.to(data.room).emit("drawing", data);
  });


      // Handle user disconnect
      socket.on("disconnect", () => {
        if (socket.username && socket.room) {
          io.to(socket.room).emit("userLeft", `${socket.username} has left the room.`);
          console.log(`${socket.username} left room: ${socket.room}`);
        }
        console.log(`User disconnected: ${socket.id}`);
      });
  
      // Error handling for Socket.IO events
      socket.on("error", (error) => {
        console.error("Socket error:", error);
        socket.emit("error", "An error occurred.");
      
    });
  };