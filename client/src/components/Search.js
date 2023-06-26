import { useState, useEffect, useRef } from "react";
import { getProfiles } from "../utils/requests";
import { Link } from "react-router-dom";
import Spinner from './Spinner';

// 검색창 부분
export default function Search() {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(true);
	const [profiles, setProfiles] = useState([]);
	// HTML의 엘리먼트에 접근할 수 있다
	const inputEl = useRef(null);

	console.log(profiles)

	// input 업데이트 관리
	async function handleChange(e) {
		try {
			const username = e.target.value;

			// 검색어가 없을 경우 리스트를 비운다
			if (!username) {
				return setProfiles([]);
			}

			// 에러 초기화
			setError(null);
			// 서버에 요청하기 전 대기상태를 보여준다
			setIsLoaded(false);

			// 서버 요청
			const { profiles } = await getProfiles(username);

			// profiles 업데이트
			setProfiles(profiles);
			
			// 대기 상태를 해제한다
			setIsLoaded(true);

		} catch (error) {
			setError(error)
		}
	};

	// 페이지 접속 시 검색창에 자동으로 포커스가 되도록 한다
	useEffect(() => { // 비동기적으로 작동한다
		// inputEl.current : input 엘리먼트(실제)

		//console.log(inputEl); // currnet 라는 1개의 속성을 가지고 있다
		inputEl.current.focus();
	})

	//console.log(inputEl) // 동기적으로 접근할 경우 current는 null이다

	return (
		<div className="px-4">
			<h3 className="text-lg font-semibold my-4">Explore</h3>
			<label className="block mb-4">
				<input 
					type="text"
					className="border px-2 py-1 rounded w-full"
					onChange={handleChange}
					placeholder="Search"
					ref={inputEl}
				/>
			</label>

			<Result
				error={error}
				isLoaded={isLoaded}
				profiles={profiles}
			/>
		</div>
	)
}

// 검색 결과
function Result({ error, isLoaded, profiles }) {
	if (error) {
	  return <p className="text-red-500">{error.message}</p>
	}
	
	if (!isLoaded) {
	  return <Spinner />
	}

	const profileList = profiles.map(profile => (
		<li key={profile.username} className="flex items-center justify-between my-2">
		  <Link
			to={`/profiles/${profile.username}`}
			className="flex items-center"
		>
			<img
			  src={`${process.env.REACT_APP_SERVER}/files/profiles/${profile.avatar}`}
			  className="w-10 h-10 object-cover rounded-full"
			/>
			<div className="ml-2">
			  <span className="block font-semibold">
				{profile.username}
			  </span>
			  <span className="block text-gray-400 text-sm">
				{profile.fullName}
			  </span>
			</div>
		  </Link>

			{/* 팔로잉 중일 경우 */}
			{profile.isFollowing && (
			<div className="ml-2 text-sm text-blue-500 font-semibold">팔로우</div>
			)}
		</li>
	))

	return (
		<ul>
			{profileList}
		</ul>
	)
};