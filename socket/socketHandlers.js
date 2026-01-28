import ChatRepository from "../repositories/chatRepository.js";

const registerSocketHandlers = (io, socket) => {
  console.log(`User ${socket.user.id} connected`);

  socket.join(`user_${socket.user.id}`);

  socket.on("join-chat", async (chatId) => {
    try {
      if (!chatId) {
        socket.emit("error", { event: "join-chat", message: "Chat ID is required" });
        return;
      }

      const chat = await ChatRepository.findChatById(chatId);
      if (!chat) {
        socket.emit("error", { event: "join-chat", message: "Chat not found" });
        return;
      }

      const isParticipant = await ChatRepository.isUserParticipant(chatId, socket.user.id);
      if (!isParticipant) {
        socket.emit("error", { event: "join-chat", message: "You are not a participant of this chat" });
        return;
      }

      socket.join(`chat_${chatId}`);
      socket.emit("joined-chat", { chatId, message: "Successfully joined chat" });
    } catch (err) {
      socket.emit("error", { event: "join-chat", message: "Failed to join chat" });
    }
  });

  socket.on("leave-chat", (chatId) => {
    if (!chatId) {
      socket.emit("error", { event: "leave-chat", message: "Chat ID is required" });
      return;
    }

    socket.leave(`chat_${chatId}`);
    socket.emit("left-chat", { chatId, message: "Successfully left chat" });
  });

  socket.on("send-message", async (data) => {
    try {
      if (!data || !data.chatId || !data.content) {
        socket.emit("error", { event: "send-message", message: "Chat ID and content are required" });
        return;
      }

      const { chatId, content } = data;

      if (typeof content !== "string" || content.trim().length === 0) {
        socket.emit("error", { event: "send-message", message: "Message content cannot be empty" });
        return;
      }

      if (content.length > 1000) {
        socket.emit("error", { event: "send-message", message: "Message content must be at most 1000 characters" });
        return;
      }

      const chat = await ChatRepository.findChatById(chatId);
      if (!chat) {
        socket.emit("error", { event: "send-message", message: "Chat not found" });
        return;
      }

      const isParticipant = await ChatRepository.isUserParticipant(chatId, socket.user.id);
      if (!isParticipant) {
        socket.emit("error", { event: "send-message", message: "You are not a participant of this chat" });
        return;
      }

      const message = await ChatRepository.createMessage({
        chatId,
        senderId: socket.user.id,
        content: content.trim()
      });

      const fullMessage = await ChatRepository.findMessageById(message.id);

      io.to(`chat_${chatId}`).emit("new-message", fullMessage);
    } catch (err) {
      socket.emit("error", { event: "send-message", message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
};

export default registerSocketHandlers;
