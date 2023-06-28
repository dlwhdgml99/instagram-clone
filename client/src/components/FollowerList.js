import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFollowers, follow, unfollow } from "../utils/requests";
import Spinner from "./Spinner";

export default function FollowerList() {
	const { username } = useParams();
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [followers, setFollowers] = useState([]);
	const [followerCount, setFollowerCount] = useState(0);

	// 서버 요청
	useEffect(() => {

		getFollowers(username)
		.then(data => {
			setFollowers([...followers, ...data.profiles]);
		})
		.catch(error => {
			setError(error)
		})
		.finally(() => setIsLoaded(true));
	}, [])

	console.log(followers)

	// 팔로우 처리
	async function handleFollow(username) {
		try {
			await follow(username)

			const updeatedFollowers = followers.map(follower => {
				if (follower.username === username) {
					return { ...follower, isFollowing: true }
				}

				return follower;
			})

			setFollowers(updeatedFollowers);

		} catch (error) {
			alert(error)
		}
	};

	// 언팔로우 처리
	async function handleUnfollow(username) {
		try {
			await unfollow(username)

			const updatedFollowers = followers.map(follower => {
				if (follower.username === username) {
					return { ...follower, isFollowing: false}
				}

				return follower;
			})

			setFollowers(updatedFollowers);

		} catch (error) {
			alert(error)
		}
	};

	// 팔로워 리스트
	const followerList = followers.map(follower => (
		<div key={follower.username} className="flex justify-between items-center mb-2">
			{/* 아바타 이미지 */}
			<Link
				to={`/profiles/${follower.username}`}
				className="inline-flex items-center"
			>
				<img 
					src={`${process.env.REACT_APP_SERVER}/files/profiles/${follower.avatar}`}
					className="w-12 h-12 object-cover rounded-full border"
				/>
				<div className="ml-2">
					<span className="block font-semibold">
						{follower.username}
					</span>
					<span className="block text-gray-400 text-sm">
						{follower.fullName}
					</span>
				</div>
			</Link>

			{/* 팔로우 버튼 */}
			{follower.isFollowing ? (
				<button
					className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
					onClick={() => handleUnfollow(follower.username)}
				>
					팔로잉
				</button>
			) : (
				<button
					className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
					onClick={() => handleFollow(follower.username)}
				>
					팔로우
				</button>
			)}
		</div>
	))

	return (
		<div className="px-2">
			<h3 className="text-lg my-4 font-semibold">{username}의 팔로워</h3>
			<ul>
				{followerList}
			</ul>

			{!isLoaded && <Spinner />}
			{error && <p className="text-red-500">{error.message}</p>}
		</div>
	)
}