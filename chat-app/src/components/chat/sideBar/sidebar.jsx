import {
  MessageCircle,
  X,
  Plus,
  Search,
  UserCircle,
  CornerUpLeft,
  CornerDownRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAppData } from "../../../context/isAuthContext";
import { useNavigate } from "react-router-dom";

function SideBar({ sideBarStatus, onlineUsers }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { fetcehedUsers, user, fetchedChats, logoutUser, isAuth } =
    useAppData();
  console.log(fetchedChats , "😡😡😡😡😡")
  const navigate = useNavigate();

  if (!isAuth) {
    navigate("/");
  }
  return (
    <>
      <aside
        className={`fixed sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform
        ${sideBarStatus.sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 transition-transform duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="sm:hidden flex justify-end mb-0">
            <button
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => sideBarStatus.setSideBarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-300"></X>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 justify-between">
                <MessageCircle className="w-5 h-5 text-white"></MessageCircle>
              </div>
              <h2 className="text-xl text-white font-bold">
                {sideBarStatus.showAllUser ? "New Chat" : "Messages"}
              </h2>
            </div>

            <button
              className={`p-2.5 rounded-lg transition-colors ${
                sideBarStatus.showAllUser
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={() => sideBarStatus.setShowAllUsers((prev) => !prev)} ///HAVE A LOOK HERE ***** COPIEED
            >
              {sideBarStatus.showAllUser ? (
                <X className="w-4 h-4"></X>
              ) : (
                <Plus className="h-4 w-4"></Plus>
              )}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden px-4 py-2">
          {sideBarStatus.showAllUser ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="SEARCH USER..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto space-y-2 pb-4">
                {fetcehedUsers?.length > 1 &&
                  fetcehedUsers
                    .filter(
                      (otherUser) =>
                        otherUser._id !== user.user._id &&
                        otherUser.name
                          .toLowerCase()
                          .includes(searchQuery.toLocaleLowerCase())
                    )
                    .map((u) => (
                      <button
                        key={u._id}
                        onClick={() => sideBarStatus.createChat(u)}
                        className=" w-full text-left p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3 ">
                          <div className="relative">
                            <UserCircle className="w-6 h-6 text-gray-300"></UserCircle>
                            {/* SHOW ONLINE SYMBOL */}

                            {onlineUsers?.includes(String(u._id)) && (
                              <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-white ">
                              {u.name}
                            </span>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {/* {SHOW ONLINE AND OFFLINE TEXT} */}
                              {onlineUsers.includes?.(u._id)
                                ? "ONLINE"
                                : "OFFLINE"}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
              </div>
            </div>
          ) : fetchedChats && fetchedChats.length > 0 ? (
            <div className="space-y-2 overflow-y-auto h-full pb-4">
              
              {fetchedChats?.map((chat) => {
                const latestMessage = chat.chat.latestMessage;
                const isSelected = sideBarStatus.selectedUser === chat.chat._id;
                const isSentByMe = latestMessage?.sender === sideBarStatus.loggedInUser?._id;
                const unseenCount = chat.chat.unSeenCount;
                console.log(unseenCount , "💪💪💪💪")

                return (
                  <button
                    key={chat.chat._id}
                    onClick={() => {
                      sideBarStatus.setSelectedUser(chat.chat._id);
                      sideBarStatus.setSideBarOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-600 border border-blue-500"
                        : "border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <UserCircle className="w-7 h-7 text-gray-300" />

                          {/* ONLINE USER WORK */}
                        </div>
                        {onlineUsers.includes(String(chat.user?._id)) && (
                          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
                        )}
                      </div>

                      {/* Name + Latest Message */}
                      <div className="flex-1 min-w-0">
                        {/* Top Row: Name + Unseen Count */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold truncate ${
                              isSelected ? "text-white" : "text-gray-200"
                            }`}
                          >
                            {chat.user?.name}
                          </span>
                          {unseenCount >= 0 && (
                            <div className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center">
                              {unseenCount > 99 ? "99+" : unseenCount}
                            </div>
                          )}
                        </div>

                        {/* Bottom Row: Latest Message */}
                        <div className="flex items-center gap-1">
                          {latestMessage &&
                            (isSentByMe ? (
                              <CornerUpLeft
                                size={14}
                                className="text-blue-400 shrink-0"
                              />
                            ) : (
                              <CornerDownRight
                                size={14}
                                className="text-green-400 shrink-0"
                              />
                            ))}
                          <span className="text-sm text-gray-400 truncate">
                            {latestMessage?.text || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-gray-800 rounded-full">
                <MessageCircle className="w-8 h-8 text-gray-400"></MessageCircle>
              </div>
              <p className="text-gray-400 font-medium">NP CONVERSATIONS YET</p>
              <p className="text-gray-500 text-sm mt-1">
                START NEW CHAT TO BEGIN MESSAGING
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <div
            className="flex items-center gap-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => navigate("/profile")}
          >
            <div className="p-1.5 bg-gray-700 rounded-lg ">
              <UserCircle className="w-4 h-4 text-gray-300"></UserCircle>
            </div>
            <span className="font-medium text-gray-300  ">PROFILE</span>
          </div>

          <button
            onClick={() => logoutUser()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-red-500 hover:text-white "
          >
            <div className="p-1.5 bg-red-600 rounded-lg">
              <LogOut className="w-4 h-4 text-gray-300"></LogOut>
            </div>
            <span className="font-medium">LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
