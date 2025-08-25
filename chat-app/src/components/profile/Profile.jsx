import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { ArrowLeft, Save, User, UserCircle } from "lucide-react";
import { useAppData, user_Service } from "../../context/isAuthContext";
import LoadingPage from "../login/LoadingPage";

function Profile() {
  const navigate = useNavigate();
  const { user, isAuth, loading, setUser } = useAppData();

  console.log(user, "🚂🚂🚂🚂🚡🚡🚡🚠");

  const [userName, setName] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const editHandler = () => {
    setIsEdit(!isEdit);

    // Pre-fill the input with the current user name when editing
    if (!loading && user) {
      setName(user?.user?.name || "");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");
    try {
      const res = await fetch(`${user_Service}/api/v1/update/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userName }),
      });

      const response = await res.json();
      // console.log(response, s"🛴🛴🛴🚲🚲🚲🛹🛹🛹");

      // ✅ Save new token if provided
      if (response.token) {
        Cookies.set("token", response.token, {
          expires: 15, // days
          secure: false,
          path: "/",
        });
      }

      // ✅ Update user context
      setUser(response?.FetchUser);

      toast.success(response.message || "Profile updated successfully!");
      setIsEdit(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    // console.log(user , "🚠🚠🚠🚠🚠")
    if (!isAuth && !loading) {
      navigate("/");
    }
  }, [isAuth, loading, navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/chat")}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Profile Settings
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage your account information
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          {/* Top Profile Section */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-8 border-b border-gray-600">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center ring-4 ring-gray-800">
                  <UserCircle className="w-12 h-12 text-gray-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 shadow-md" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">
                  {user?.user.name}
                </h2>
                <p className="text-gray-400 text-sm tracking-wide">
                  Active Now
                </p>
              </div>
            </div>
          </div>

          {/* Form / Name Section */}
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Display Name
              </label>

              {isEdit ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter your name"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                      onClick={() => setIsEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-700 rounded-lg border border-gray-600">
                  <span className="text-white font-medium text-lg">
                    {user?.user?.name}
                  </span>
                  <button
                    onClick={editHandler}
                    className="px-4 py-2 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-600 transition"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
