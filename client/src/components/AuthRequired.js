// 인증 상태 관리(검사)
import { useContext} from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";


export default function AuthRequired({ children }) {

	// user 객체에 접근할 수 있다
	const { user } = useContext(AuthContext);

	if (!user) { // 인증 실패 : 로그인 페이지로 이동한다
		return <Navigate to="/accounts/login" replace={true} />
	}

	return children;
}