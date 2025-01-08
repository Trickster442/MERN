import React, { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import Socket.IO client library
import "../styles/message.css";

const Message = () => {
  const [messages, setMessages] = useState([]); // State to store messages
  const [input, setInput] = useState(""); // State to store the input field value
  const [socket, setSocket] = useState(null); // State to hold the socket instance

  useEffect(() => {
    // Initialize the Socket.IO connection
    const newSocket = io("http://localhost:3000"); // Replace with your server URL
    setSocket(newSocket);

    // Listen for messages from the server
    newSocket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup on component unmount
    return () => newSocket.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Emit the message to the server
      socket.emit("message", input);
      setInput(""); // Clear the input field
    }
  };

  return (
    <div className="message-container">
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li> // Render each message
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update the input field value
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Message;
