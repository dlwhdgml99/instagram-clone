import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const initialUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(initialUser);

  // user state listener
  useEffect(() => {
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

  }, [user])

  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}