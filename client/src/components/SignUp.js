import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../utils/requests";

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 제출을 처리하는 함수
  async function handleSubmit(e) {
	try {
		e.preventDefault();

		const newUser = { email, fullName, username, password };

		// 클라이언트에서 입력데이터 유효성 검사
		const _error = {};

		if (email.indexOf("@") === -1) {
			_error.email = "이메일이 올바르지 않습니다";
		}

		if (username.match(/[^a-z0-9_]/)) {
			_error.username = "아이디는 영어 소문자와 언더스코어, 숫자만 사용 가능합니다"
		}

		// 유효성 검사 실패
		if (Object.keys(_error).length > 0) {
			throw _error;
		}

		// 유저 생성 요청
		await createUser(newUser);

		// 가입 완료 메세지
		alert("가입이 완료되었습니다");

		// 로그인 페이지로 이동
		navigate("/");

		//console.log(newUser);
	} catch (error) {
		setError(error)
	}
  }

	// 타이틀 업데이트
	useEffect(() => {
		document.title = "회원가입 - Instagram";
	}, []);
	
	return (
		<form onSubmit={handleSubmit} className="max-w-xs mx-auto p-4 mt-16">
			{/* 로고이미지 */}
			<div className="mt-4 mb-4 flex justify-center">
				<img src="/images/logo.png" className="w-36" />
			</div>

			{/* 이메일 입력란 */}
			<div className="mb-2">
				<label className="block">
					<input 
						type="text"
						name="email"
						className="border px-2 py-1 rounded w-full"
						onChange={({ target }) => setEmail(target.value)}
						placeholder="이메일"
					/>
				</label>
				{error && <p className="text-red-500">{error.email}</p>}
			</div>

			{/* 이름 입력란 */}
			<div className="mb-2">
				<label className="block">
					<input 
						type="text"
						name="fullName"
						className="border px-2 py-1 rounded w-full"
						onChange={({ target }) => setFullName(target.value)}
						placeholder="이름"
					/>
				</label>
			</div>

			{/* 유저 이름 */}
			<div className="mb-2">
				<label className="block">
					<input
						type="text"
						name="username"
						className="border px-2 py-1 rounded w-full"
						onChange={({ target }) => setUsername(target.value)}
						placeholder="아이디"
					/>
				</label>
				{error && <p className="text-red-500">{error.username}</p>}
			</div>

			{/* 비밀번호 */}
			<div className="mb-2">
				<label className="block">
					<input
						type="password"
						name="password"
						className="border px-2 py-1 rounded w-full"
						onChange={({ target }) => setPassword(target.value)}
						placeholder="비밀번호"
						autoComplete="new-password"
					/>
				</label>
			</div>

			{/* 제출버튼 */}
			<div className="mb-2">
				<button
					type="submit"
					className="bg-blue-500 rounded-lg text-sm font-semibold px-4 py-2 text-white w-full disabled:opacity-[0.5]"
					disabled={email.trim().length < 5 || username.trim().length < 5 || password.trim().length < 5}
				>가입
			</button>
			{error && <p className="text-red-500">{error.username}</p>}
			</div>

			{/* 로그인 링크 */}
			<p className="text-center mt-4">
				계정이 있으신가요? {" "}
				<Link to="/accounts/login" className="text-blue-500 font-semibold">
				로그인
				</Link>			
			</p>
		</form>
	)
}