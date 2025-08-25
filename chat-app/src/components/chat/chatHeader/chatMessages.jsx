import { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck } from "lucide-react";

function ChatMessages({ chatMessagesProps }) {
  const bottomRef = useRef(null); //THIS BOTTOMREF IS A REFERENCE OBJECT WITH PROPERTY CURRENT


  // CHECK FIRST U HAVE MESSAGES
  console.log(chatMessagesProps.messages , "🚑🚑🚑🚑")

  // SEEN FEATURE
  const uniqueMessages = useMemo(() => {
    if (!chatMessagesProps.messages) {
      //HERE I WILL GET MY ALL MESSAGES
      return [];
    }

    const seen = new Set();
    return chatMessagesProps.messages?.filter((message) => {
      if (seen.has(message._id)) {
        //THE MSG IS NOT LATEST
        return false;
      }
      seen.add(message._id); //THIS MSG IS LATEST MARK AS SEEN IN THE SET
      return true;
    });
  }, [chatMessagesProps.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    console.log(uniqueMessages , chatMessagesProps?.loggedInUser, "🛹🛹🛹🛹🛹")
    
  }, [chatMessagesProps.selectedUser, uniqueMessages]);

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-h-[calc(100vh-215px] overflow-y-auto p-2 space-y-2 custom-scroll">
          {!chatMessagesProps.selectedUser ? (
            <p className="text-gray-400 text-center mt-20">
              PLEASE SELECT USER TO START CHATTING 📩
            </p>
          ) : (
            <>
              {uniqueMessages?.map((e, i) => { //e IS THE ELEMENT
                const isSentByMe = e.sender === chatMessagesProps.loggedInUser?.user._id;
                <div className="text-green-500">{isSentByMe}</div>
                
                const uniqueKey = `${e._id}-${i}`;

                return (
                  <div
                  key={uniqueKey}
                    className={`flex flex-col gap-1 mt-2 ${
                      isSentByMe ? "items-end" : "items-start"
                    } `}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-sm ${
                        isSentByMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white"
                      } `}
                    >
                      {e.messageType === "image" && e.image && (
                        <div className="relative group">
                          <img
                            src={e.image.url}
                            alt="SHARED IMAGE"
                            className="max-w-full h-auto rounded-lg"
                          ></img>
                        </div>
                      )}

                      {e.text && <p className="mt-1"> {e.text}</p>}
                    </div>

                    <div
                      className={`flex items-center gap-1 text-xs text-gray-400 ${
                        isSentByMe ? "pr-4 flex-row-reverse" : "pl-2"
                      }`}
                    >
                      <span>
                        {moment(e.createdAt).format("hh-mm A . MMM D")}
                      </span>
                      {isSentByMe && (
                        <div className="flex items-center ml-1">
                          {e.seen ? (
                            <div className="flex items-center gap-1 text-blue-400">
                              <CheckCheck className="w-3 h-2 "></CheckCheck>
                              {e.seenAt  && (
                                <span>
                                  {moment(e.seenAt).format("hh:mm A")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Check className="w-3 h-3 text-gray-500"></Check>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}/>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default ChatMessages;
