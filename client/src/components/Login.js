import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { signIn } from "../utils/requests";

export default function Login() {
	// 유저를 업데이트하는 메서드
	const { setUser } = useContext(AuthContext);
	// 페이지 이동
	const navigate = useNavigate();
	// 에러메세지 처리
	const [error, setError] = useState(null);
	// 로컬스토리지에 이메일이 저장되어있으면 가져온다
	const [email, setEmail] = useState(localStorage.getItem("email") || "");
	// 비밀번호
	const [password, setPassword] = useState("");
	// 비밀번호 보기/가리기 기능
	const [showPassword, setShowPassword] = useState(false);

	// 로그인 처리
	async function handleSubmit(e) {}

	// 타이틀 업데이트
	useEffect(() => {
		document.title = 'Login - Instagram'
	}, []);

	return (
		<form onSubmit={handleSubmit} className="max-w-xs p-4 mt-16 mx-auto">
			<div className="mt-4 mb-4 flex justify-center">
				<img src="/images/logo.png" className="w-36"></img>
			</div>

			<div className="mb-2">
				<label className="block">
					<input 
						type="text"
						className="border px-2 py-1 w-full rounded"
						value={email}
						placeholder="E-mail"
						onChange={({ target }) => setEmail(target.value)} 
						/>
				</label>
			</div>

			<div className="mb-2">
				<label className="block relative">
					<input 
						type={showPassword ? "text" : "password"}
						className="border px-2 py-1 w-full rounded"
						value={password}
						placeholder="password"
						onChange={({ target }) => setPassword(target.value)} 
						/>
						{password.trim().length > 0 && (
							<button
								type="button"
								className="absolute right-0 h-full px-4 py-2 text-sm font-semibold"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
							</button>
						)}
				</label>
			</div>
		</form>
	)
}