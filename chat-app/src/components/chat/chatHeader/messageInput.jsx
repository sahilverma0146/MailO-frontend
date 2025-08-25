import { Loader2, Paperclip, Send, X } from "lucide-react";
import { useState } from "react";

function MessageInput({
  selectedUser,
  message,
  setMessage,
  handleSendMessage,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) {
      return;
    }

    setIsUploading(true);
    await handleSendMessage(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  gap-2 border-t border-gray-700 pt-2"
    >
      {imageFile && (
        <div className="relative w-fit">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border border-gray-600"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-black rounded-full p-1"
            onClick={() => setImageFile(null)}
          >
            <X className="w-4 h-4 text-white"></X>
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor:pointer bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors">
          <Paperclip size={18} className="text-gray-300"></Paperclip>
          <input
            type="file"
            accept="image"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
        </label>

        <input
          type="text"
          className="flex bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-full "
          placeholder={imageFile ? "ADD CAPTION..." : "TYPE A MESSAGE..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>

        <button
          type="submit"
          disabled={(!imageFile && !message) || isUploading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin"></Loader2>
          ) : (
            <Send className="w-4 h-4"></Send>
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
