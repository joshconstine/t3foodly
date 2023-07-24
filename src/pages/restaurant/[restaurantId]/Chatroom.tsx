import React from "react";
import { io } from "socket.io-client";
import { env } from "../../../env/client.mjs";
import { api } from "../../../utils/api";
const socket = io(env.NEXT_PUBLIC_WEBSOCKET_SERVER);
interface IMessege {
  email?: string;
  text?: string;
}

const ChatRoom = ({ restaurantId }: { restaurantId: string }) => {
  const user = api.user.getUser.useQuery();
  const [isTyping, setIsTyping] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<IMessege[]>([]);

  function sendMessage(message: IMessege) {
    socket.emit("sendMessege", message);
  }
  socket.on("recMessege", (message: IMessege) => {
    setMessages([...messages, message]);
  });
  socket.on("recIsTyping", (typingEmail: string) => {
    setIsTyping(`${typingEmail} is typing...`);
  });

  function sendIsTypingMessesge(email: string) {
    socket.emit("isTyping", email);
  }
  return (
    <div className="min-h-96 min-w-48 h-96 w-96 rounded-lg border-2 border-secondary p-8">
      <h1>Chat Room</h1>
      <div className="container flex h-full flex-col justify-between">
        <div>
          <div className="">
            <ul id="data-container">
              {messages.map((message, index) => (
                <li key={index}>
                  <span className="text-primary">{message.email}</span>:
                  {message.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span id="isTyping">{isTyping}</span>
          </div>
        </div>

        <div className="">
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className="form-control border-2  "
            id="exampleFormControlTextarea1"
            placeholder="Say something..."
          />
          <button
            onClick={() => {
              sendMessage({ email: user?.data?.username || "", text: message });
              setMessage("");
            }}
            className="rounded-lg border-2 border-secondary px-2 py-1 text-secondary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
