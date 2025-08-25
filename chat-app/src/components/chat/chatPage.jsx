import { data, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// IMPORTS
import { chat_Service, useAppData } from "../../context/isAuthContext";
import { useSocket } from "../../context/SocketContext";

import LoadingPage from "../login/LoadingPage";
import SideBar from "./sideBar/sidebar";
import toast from "react-hot-toast";
import ChatHeader from "./chatHeader/chatHeader";
import ChatMessages from "./chatHeader/chatMessages";
import MessageInput from "./chatHeader/messageInput";

function ChatPage() {
  const {
    loading,
    isAuth,
    logoutUser,
    user: loggedInUser,
    fetchedChats,
    setFetchedChats,
    fetchChats,
  } = useAppData();

  const { onlineUsers, socket } = useSocket();
  console.log(onlineUsers, "ONLINE USERS ARE SEEING AT CHATPAGE");
  const [chats, setChats] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState(""); //MSG WE ARE TRYING TO SEND TO SOMEONE

  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [messages, setMessages] = useState([]); //FETCH THE CHATS MESSAGES

  const [user, setUser] = useState(null); //JISSE HM CHAT KRENEGE
  // console.log(user, "the user you are chatting");

  const [showAllUser, setShowAllUsers] = useState(false);

  const [typing, setTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth && !loading) {
      navigate("/");
    }
  }, [isAuth, loading, navigate]);

  const handleLoggout = () => {
    logoutUser();
  };

  const fetchParticularUserChats = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        `${chat_Service}/api/v1/message/${selectedUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      setMessages(data.messages);
      setUser(data.user);

      await fetchChats();
    } catch (error) {
      console.log(error);
      toast.error("FAILED TO LOAD MESSAGES");
    }
  };

//   // LATEST MESSAGE AS MOVE TO TOP
// const moveChatToTop = (chatId, newMessage, updatedUnseenCount = true) => {
//   setChats((prev) => {
//     if (!prev) return [];

//     const updatedChats = [...prev];
//     const chatIndex = updatedChats.findIndex(c => c.chat._id === chatId);

//     if (chatIndex !== -1) {
//       // remove chat from old position
//       const [movedChat] = updatedChats.splice(chatIndex, 1);

//       // update its latest message & unseenCount
//       const updatedChat = {
//         ...movedChat,
//         chat: {
//           ...movedChat.chat,
//           latestMessage: {
//             text: newMessage.text,
//             sender: newMessage.sender,
//           },
//           updatedAt: new Date().toString(),
//           unseenCount:
//             updatedUnseenCount && newMessage.sender !== loggedInUser?._id
//               ? (movedChat.chat.unseenCount || 0) + 1
//               : movedChat.chat.unseenCount || 0,
//         },
//       };

//       // put it at the top
//       updatedChats.unshift(updatedChat);
//     }

//     return updatedChats;
//   });
// };


const moveChatToTop = (chatId, newMessage, updatedUnseenCount = true) => {
  setFetchedChats((prev) => {
    if (!prev) return [];

    const updatedChats = [...prev];
    const chatIndex = updatedChats.findIndex(c => c.chat._id === chatId);

    if (chatIndex !== -1) {
      const [movedChat] = updatedChats.splice(chatIndex, 1);

      const updatedChat = {
        ...movedChat,
        chat: {
          ...movedChat.chat,
          latestMessage: {
            text: newMessage.text,
            sender: newMessage.sender,
          },
          updatedAt: new Date().toString(),
          unSeenCount:
            updatedUnseenCount && newMessage.sender !== loggedInUser?._id
              ? (movedChat.chat.unSeenCount || 0) + 1
              : movedChat.chat.unSeenCount || 0,
        },
      };

      updatedChats.unshift(updatedChat);
    }

    return updatedChats;
  });
};



  const resetUnseenCount = (chatId) => {
    setFetchedChats((prev) => {
      if (!prev) return null;

      console.log(prev  , "🚖🏍🏍🏍🏍")
      return prev.map((chat) => {
        if (chat?.chat._id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unSeenCount: 0,
            },
          };
        }
        return chat;
      });
    });
  };

  const createChat = async (user) => {
    try {
      console.log(user, "THE USER FROM ONcLICKIG ");
      const token = Cookies.get("token");
      if (!token) {
        toast.error("PLEASE LOGIN!!");
      }

      // CHAGGE THE ENDPOINT
      const response = await fetch(`${chat_Service}/api/v1/createchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId: user?._id }),
      });

      const data = await response.json();
      setSelectedUser(data.chatId);
      setShowAllUsers(false);

      await fetchChats();
    } catch (error) {
      toast.error("FAILED TO START CHAT");
    }
  };

  const handleTyping = (value) => {
    setMessage(value);

    console.log(selectedUser, socket, "😋", loggedInUser);
    if (!selectedUser || !socket) {
      console.log("THERE IS NO OTHER USER AND  NO SOCKET CRETEED");
      return;
    }
    // SOCKET SETUP
    console.log("GETTING IN N😋");

    if (value.trim()) {
      setTyping(true);
      socket.emit("typing", {
        chatId: selectedUser,
        userId: loggedInUser?.user._id,
      });
    }

    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }

    // After 2 seconds of no typing, send "stopTyping"
    const timeout = setTimeout(() => {
      setTyping(false);

      socket.emit("stopTyping", {
        chatId: selectedUser,
        userId: loggedInUser?.user._id,
      });
    }, 2000);

    setTypingTimeOut(timeout);
  };

  const handleSendMessage = async (e, imageFile) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) {
      return;
    }

    if (!selectedUser) return;

    //****** */ SOCKET 1 --> *****

    // CLEAR THE TIME OUT FIRST BEFORE SENDING
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null);
    }

    socket?.emit("stopTyping", {
      chatId: selectedUser,
      userId: loggedInUser?.user._id,
    });

    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      formData.append("chatId", selectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const resposne1 = await fetch(`${chat_Service}/api/v1/message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await resposne1.json();
      console.log(data);

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some((msg) => {
          msg._id === data.message._id;
        });

        if (!messageExists) {
          return [...currentMessages, data.message];
        }

        return currentMessages;
      });

      setMessage("");

      const displayText = imageFile ? "📷 image" : message;
      moveChatToTop(
        selectedUser,
        {
          text: displayText,
          sender: data.sender,
        },
        false
      );
    } catch (error) {
      toast.error(error);
    }
  };

  // THIS IS FOR SHOWING THE OTHER USER IS STYPING OR NOT
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      console.log("RECEIVED NEW MESSAGE🚎", message);

      if (selectedUser && message.chatId === selectedUser) {
        setMessages((prev) => {
          const currentMessages = prev || [];

          const messageExists = currentMessages.some(
            (msg) => msg._id === message._id
          );

          if (!messageExists) {
            return [...currentMessages, message];
          }

          return currentMessages;
        });
        moveChatToTop(message.chatId, message, false)
      } else {
        moveChatToTop(message.chatId, message, true); 
      }
    });

    if (!socket) return;

    // LISTEN
    socket?.on("messagesSeen", (data) => {
      console.log("MESSAGE SEENBY 🚁🚁🚁", data);

      if (selectedUser === data.chatId) {
        setMessages((prev) => {
          if (!prev) return null;

          return prev.map((msg) => {

            console.log(msg , "🏳‍🌈🏳‍🌈🏳‍🌈🏳‍🌈🏳‍🌈🏳‍🌈"); // seen : false
            console.log(loggedInUser  , "🚩🚩🚩🚩")
            if (
              msg.sender === loggedInUser?.user._id &&
              data.messageIds &&
              data.messageIds.includes(msg._id)
            ) {
              console.log("WE ARRE IN ❤❤❤❤❤❤💪")
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            } else if (msg.sender === loggedInUser?._id && !data.messageIds) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            }
            return msg;
          });
        });
      }
    });

    socket.on("userTyping", (data) => {
      console.log("User is typing 🚚:", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setTyping(true);
      }
    });

    socket.on("userStoppedTyping", (data) => {
      console.log("User stopped typing:", data);
      setTyping(false);
    });

    //CLEANUP FUNCTION
    return () => {
      socket.off("userTyping");
      socket.off("messagesSeen");
      socket.off("userStoppedTyping");
      socket.off("newMessage");
    };
  }, [socket, selectedUser, setChats, loggedInUser?._id]);

  useEffect(() => {
    if (selectedUser) {
      fetchParticularUserChats();
      setTyping(false);
    }

    resetUnseenCount(selectedUser);

    socket?.emit("joinChat", selectedUser);

    return () => {
      socket?.emit("leaveChat", selectedUser);
      setMessages(null);
    };
  }, [selectedUser, socket]);

  useEffect(() => {
    return () => {
      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
    };
  }, [typingTimeOut]);

  if (loading) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <>
      {/* THIS IS FOR THE SIDEBAR */}
      <div className=" min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
        <SideBar
          sideBarStatus={{
            showAllUser,
            setShowAllUsers,
            sidebarOpen,
            setSideBarOpen,
            loggedInUser,
            selectedUser,
            setSelectedUser,
            handleLoggout,
            createChat,
          }}
          onlineUsers={onlineUsers}
        />

        {/* backdrop-blur-xl */}
        <div className="flex-1 flex flex-col justify-between p-4  bg-white/5 border-1 border-white/10">
          <ChatHeader
            sideBarStatus={{ sidebarOpen, setSideBarOpen, user }}
            onlineUsers={onlineUsers}
            typing={typing}
          />
          <ChatMessages
            chatMessagesProps={{ selectedUser, messages, loggedInUser }}
          ></ChatMessages>

          <MessageInput
            selectedUser={selectedUser}
            message={message}
            setMessage={handleTyping}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
}

export default ChatPage;
