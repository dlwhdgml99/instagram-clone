import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
	// 로컬 스토리지에서 유저의 초기값을 가져온다
	const initialUser = JSON.parse(localStorage.getItem("user"));
	// 유저 객체 관리
	const  [user, setUser] = useState(initialUser);

	// 유저 상태 감시자 (user state listener)
	useEffect(()=> {
		if (user) { // 로그인, 정보수정
			localStorage.setItem('user', JSON.stringify(user));
		} else { // 로그아웃
			localStorage.removeItem('user');
		}
	}, [user])

	const value = { user, setUser }; // 자식 컴포넌트에 전달한다

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}