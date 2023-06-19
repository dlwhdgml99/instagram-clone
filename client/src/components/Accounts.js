import { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { updateUser } from "../utils/requests";
import AuthContext from "./AuthContext";

export default function Accounts() {
	// 로그인 유저
	const { user, setUser } = useContext(AuthContext);
	// 업데이트 할 유저의 정보를 저장한다
	const [updatedUser, setUpdatedUser] = useState({});

	// 폼 제출 처리
	async function handleSubmit(e) {
		try {
		  e.preventDefault();
	
		  const formData = new FormData();
	
		  Object.keys(updatedUser).forEach(prop => {
			//formData.append(key, value)
			formData.append(prop, updatedUser[prop]);
		  })
	
		  // 서버에 폼 데이터를 전송한다
		  const data = await updateUser(formData);
	
		  // 유저를 업데이트 한다
		  setUser(data.user);
	
		  // 변경사항을 초기화한다
		  setUpdatedUser({});
		  alert("변경사항이 저장되었습니다");
	
		} catch (error) {
		  alert(error)
		}
	  }

	// 파일 처리
	function handleFile(e) {
		const file = e.target.files[0];

		if (file) {
			// avatar의 속성값으로 파일을 추가한다
			setUpdatedUser({ ...updatedUser, avatar: file });
		}
	}

	// 인풋 데이터 처리
	function handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;

		// 수정이 취소된 속성을 제거한다
		if (user[name] === value) { // user["bio"]
			const{ [name]: value, ...rest } = updateUser;
			return setUpdatedUser(rest);
		}

		setUpdatedUser({ ...updatedUser, [name]: value });
	}

	// 타이틀 업데이트
	useEffect(() => {
		document.title = "정보 수정 - Instagram"
	}, [])

	return (
		<div className="mt-8 px-4">
			{/* 변경사항을 알려주는 메시지 */}
			{Object.keys(updatedUser).length > 0 && (
				<p className="mb-4 bg-blue-500 text-white px-2 py-1">
					변경사항을 저장하시려면 제출을 클릭하세요
				</p>
			)}

			{/* 프로필 사진 */}
			<div className="flex mb-4">
				<img 
					src={updatedUser.avatar ? URL.createObjectURL(updatedUser.avatar) : `${process.env.REACT_APP_SERVER}/files/profiles/${user.avatar}`}
					className="w-16 h-16 object-cover rounded-full border"
				/>
				<div className="flex flex-col grow items-start ml-4">
					<h3>{user.username}</h3>
					<label className="text-sm font-semibold text-blue-500 cursor-pointer">
						<input
							type="file"
							className="hidden"
							onChange={handleFile}
							accept="image/png, img/jpg, image/jpeg"
						/>
						사진 업로드
					</label>
				</div>
			</div>

			{/* 폼 */}
			<form onSubmit={handleSubmit}>
				<div className="mb-2">
					<label htmlFor="fullName" className="block font-semibold">이름</label>
					<input 
						type="text"
						id="fullName"
						name="fullName"
						className="border px-2 py-1 rounded w-full"
						defaultValue={user.fullName}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="username" className="block font-semibold">아이디</label>
					<input 
						type="text"
						id="username"
						name="username"
						className="border px-2 py-1 rounded w-full"
						defaultValue={user.username}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="email" className="block font-semibold">이메일</label>
					<input 
						type="text"
						id="email"
						name="email"
						className="border px-2 py-1 rounded w-full"
						defaultValue={user.email}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-2">
					<label htmlFor="bio" className="block font-semibold">자기소개</label>
					<textarea
						id="bio"
						rows="3"
						name="bio"
						className="border px-2 pu-1 rounded w-full"
						defaultValue={user.bio}
						onChange={handleChange}
					/>
				</div>
				<div className="flex">
					<button
						type="submit"
						className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 disabled:opacity-[0.2]"
						disabled={Object.keys(updatedUser).length < 1}
					>
						저장
					</button>
					<Link to={`/profiles/${user.username}`}
					className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 ml-2"
					>
						취소
					</Link>
				</div>
			</form>
		</div>
	)
}