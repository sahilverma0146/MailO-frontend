import Cookies from "js-cookie";
import { createContext, useState, useContext, useEffect } from "react";

// IMPORTS
import toast, { Toaster } from "react-hot-toast";

export const user_Service = import.meta.env.VITE_USER_URL;
export const chat_Service = import.meta.env.VITE_CHAT_URL;

export const isAuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchedChats, setFetchedChats] = useState([]);
  const [fetcehedUsers, setFetchedUsers] = useState([]);

  // FETCH LOGGED IN USER DETAILES
  async function fetchUser() {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        setIsAuth(false);
        setLoading(false);
        return;
      }

      const fetchUserData = await fetch(`${user_Service}/api/v1/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await fetchUserData.json();
      console.log(data);
      if (!data) {
        setUser(null);
        setIsAuth(false);
        setLoading(false);
        return;
      }
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log("THE ERROR IS", error);
      setIsAuth(false);
      setLoading(false);
    }
  }
  // LOGOUT
  const logoutUser = async () => {
    Cookies.remove("token");
    setIsAuth(false);
    setUser(null);
    toast.success("USER LOGOUT SUCCESSFULLY");
  };

  // FETCH CHAT
  const fetchChats = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("UNABLE TO GET TOKEN");
        return;
      }
      const response = await fetch(`${chat_Service}/api/v1/chat/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log(data.chats, "THE FETCHED CHATS ARE");
      setFetchedChats(data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH ALL USERS
  const fetcehedUsersDetails = async () => {
    const token = Cookies.get("token");
    if(!token){
      toast.error("PLEASE LOGIN TO YOUR ACCOUNT");
      return;

    }
    try {
      const response = await fetch(`${user_Service}/api/v1/allusers`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // console.log(data)
      setFetchedUsers(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchChats();
    fetcehedUsersDetails();
  }, []);

  return (
    <isAuthContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
        logoutUser,
        fetchChats,
        fetchedChats,
        fetcehedUsersDetails,
        fetcehedUsers,
        setFetchedChats,
        setFetchedUsers,
      }}
    >
      {children}
      <Toaster></Toaster>
    </isAuthContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(isAuthContext);
  if (!context) {
    throw new Error("useAppData must be used within an AuthProvider");
  }
  return context;
};
