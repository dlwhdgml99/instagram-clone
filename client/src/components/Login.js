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
	async function handleSubmit(e) {
		try {
			e.preventDefault();

			// 에러 초기화
			setError(null);

			console.log(email, password);

			// 응답 객체를 user 변수에 담는다
			const { user } = await signIn(email, password);

			// 클라이언트의 user를 응답객체로 갱신한다
			setUser(user)
			//console.log(user);

			// 로그인에 성공한 이메일을 로컬스토리지에 저장한다
			localStorage.setItem("email", email);

			// 피드 페이지로 이동한다
			setTimeout(() => {
				navigate("/")
			}, 200);

		} catch (error) {
			setError(error)
		}
	}

	// 타이틀 업데이트
	useEffect(() => {
		document.title = 'Login - Instagram'
	}, []);

	return (
		<form onSubmit={handleSubmit} className="max-w-xs p-4 mt-16 mx-auto">
			{/* 로고 이미지 */}
			<div className="mt-4 mb-4 flex justify-center">
				<img src="/images/logo.png" className="w-36"></img>
			</div>

			{/* 이메일 입력란 */}
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

			{/* 비밀번호 입력란 */}
			<div className="mb-2">
				<label className="block relative">
					<input 
						type={showPassword ? "text" : "password"}
						className="border px-2 py-1 w-full rounded"
						value={password}
						placeholder="password"
						autoComplete="new-password"
						onChange={({ target }) => setPassword(target.value)} 
						/>
						{/* 비밀번호를 입력한 경우에 토글버튼을 보인다 */}
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

			{/* 제출버튼 */}
			<button
				type="submit"
				className="bg-blue-500 text-sm text-white font-semibold rounded-lg px-4 py-2 w-full disabled:opacity-[0.5]"
				disabled={!email.trim() || password.trim().length < 5}
			>
				Login
			</button>

			{/* 에러메시지 */}
			{error && <p className="my-4 text-center text-red-500">{error.message}</p>}

			{/* 가입링크 */}
			<p className="text-center my-4">
				계정이 없으신가요? {" "}
				<Link to="/accounts/signup" className="text-blue-500 font-semibold">가입하기</Link>
			</p>
		</form>
	)
}