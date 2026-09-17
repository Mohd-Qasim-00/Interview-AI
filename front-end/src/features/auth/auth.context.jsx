import { createContext, useEffect, useState } from "react"
import { clearAuthToken, getAuthToken } from "../../config/authToken"
import { getMe } from "./services/auth.api"


export const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
   
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!getAuthToken()) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          clearAuthToken();
        } else {
          console.error("Error fetching user data:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  

return (
    <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
        {children}
    </AuthContext.Provider>
)



}
