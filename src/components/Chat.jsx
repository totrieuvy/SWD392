import { useEffect, useState } from "react";
import { db, ref, push, onValue, serverTimestamp, set } from "../config/firebase";
import { useSelector } from "react-redux";
import "./ChatRoom.scss";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const user = useSelector((state) => state?.user);

  // Lắng nghe tin nhắn và trạng thái typing
  useEffect(() => {
    const chatRef = ref(db, "chats/admin_manager");
    const typingRef = ref(db, "typing/admin_manager");

    // Lắng nghe tin nhắn
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setMessages(messagesArray);
    });

    // Lắng nghe trạng thái typing
    onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const typingArray = Object.keys(data)
          .filter((key) => data[key].isTyping && key !== user?.userName) // Loại bỏ chính mình
          .map((key) => data[key].userName);
        setTypingUsers(typingArray);
      } else {
        setTypingUsers([]);
      }
    });

    // Cleanup khi component unmount
    return () => {
      // Không cần off listeners vì onValue tự động cleanup trong React 18+
    };
  }, [user?.userName]);

  // Cập nhật trạng thái typing khi nhập
  const handleTyping = (e) => {
    setText(e.target.value);
    const typingRef = ref(db, `typing/admin_manager/${user?.userName}`);
    set(typingRef, {
      userName: user?.userName,
      isTyping: e.target.value.length > 0,
      timestamp: serverTimestamp(),
    });
  };

  const sendMessage = async () => {
    if (text.trim()) {
      await push(ref(db, "chats/admin_manager"), {
        sender: user?.userName || "Unknown",
        role: user?.roleName,
        text,
        timestamp: serverTimestamp(),
      });
      // Xóa trạng thái typing sau khi gửi
      const typingRef = ref(db, `typing/admin_manager/${user?.userName}`);
      await set(typingRef, null);
      setText("");
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-room">
      <h2>Chat giữa Admin & Manager</h2>
      <div className="messages-container">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender === user?.userName;
          return (
            <div key={msg.id} className={`message-wrapper ${isCurrentUser ? "current-user" : "other-user"}`}>
              <div className="message">
                <p>
                  <strong className={msg.role === "admin" ? "admin" : "manager"}>
                    {msg.sender} ({msg.role}):
                  </strong>{" "}
                  {msg.text}
                </p>
                <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {typingUsers.length > 0 && <div className="typing-indicator">{typingUsers.join(", ")} is typing...</div>}
      <div className="input-container">
        <input type="text" value={text} onChange={handleTyping} placeholder="Nhập tin nhắn..." />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatRoom;
