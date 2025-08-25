import { Menu, UserCircle } from "lucide-react";

import { useAppData } from "../../../context/isAuthContext";

function ChatHeader({ sideBarStatus, onlineUsers , typing }) {
  // console.log(sideBarStatus?.user, "THE OTHER USER");
  console.log(typing , "😎😎😎😍😎😎😎😎😎😎😎😎😍😎😎😋")

  const theOtherLoggedInUser = sideBarStatus?.user;
  console.log(theOtherLoggedInUser?._id, "😅");
  const isOnlineUser =
    theOtherLoggedInUser &&
    onlineUsers?.includes(String(theOtherLoggedInUser?._id));
  console.log(isOnlineUser);

  // console.log("onlineUsers:", onlineUsers);

  return (
    <>
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => {
            console.log(sideBarStatus.sidebarOpen);
            sideBarStatus.setSideBarOpen((prev) => !prev);
          }}
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-200" />
        </button>
      </div>

      <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center gap-4">
          {sideBarStatus.user ? (
            <>
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-gray-300"></UserCircle>
                </div>
                {/* show online user or not */}
                {isOnlineUser && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-800">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center  gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-white truncate">
                    {sideBarStatus.user?.name}
                  </h2>
                </div>
                {/* SHOW TYPING STATUS */}

                <div className="flex items-center gap-2">
                  {typing ? (
                    <div className="flex items-center text-sm gap-2 ">
                      <div className="flex gap-1">
                        <div className="w-1 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animation: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1.5 bg-blue-500 rounded-full animate-bounce"
                          style={{ animation: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-blue-500 font-medium"> TYPING</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full  ${
                          isOnlineUser ? "bg-green-500" : "bg-gray-500"
                        }`}
                      ></div>
                      <span className={`text-sm font-medium ${isOnlineUser ? "text-greem-500" :"text-gray-400"} `}>
                        {
                          isOnlineUser ? "ONLINE" :"OFFLINE"
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-14 rounded-full vf-gray-700 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-gray-700 "></UserCircle>
                </div>
                <div>
                  <h2 className="text-2xl font-blod text-gray-400 ">
                    SELECT A CONVERSATIONS...
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose A Chat from the Sidebar To start Messaging
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatHeader;
