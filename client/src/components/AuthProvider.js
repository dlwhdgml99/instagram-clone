import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  // 로컬스토리지에서 유저의 초기값을 가져온다
  const initialUser = JSON.parse(localStorage.getItem('user'));
  // 유저 객체 관리
  const [user, setUser] = useState(initialUser);

  // 유저상태 감시자
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