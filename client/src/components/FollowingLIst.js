import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFollowings, follow, unfollow } from '../utils/requests';
import Spinner from './Spinner';

export default function FollowingList() {
	const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);

  // 서버 요청
  useEffect(() => {
	getFollowings(username)
	.then(data => {
		setFollowingCount(data.profileCount);
		setFollowings([...followings, ...data.profiles]);
	})
	.catch(error => {
		setError(error);
	})
	.finally(() => setIsLoaded(true))
  }, [])

  console.log(followings)

  // 팔로우
  async function handleFollow(username) {
	try {
		await follow(username)

		const updatedFollowings = followings.map(following => {
			if (following.username === username) {
				return { ...following, isFollowing: true}
			}

			return following;
		})

		setFollowings(updatedFollowings);
	} catch (error) {
		alert(error)
	}
  }

  // 언팔로우
  async function handleUnfollow(username) {
	try {
		// 서버 요청
		await unfollow(username)

		const updatedFollowings = followings.map(following => {
			if (following.username === username) {
				return { ...following, isFollowing: false }
			}

			return following;
		})

		// followings 업데이트
		setFollowings(updatedFollowings);
	
	} catch (error) {
		alert(error)
	}
  }


  // 팔로잉 리스트
  const followingList = followings.map(following => (
	<div key={following.username} className='flex justify-between items-center mb-2'>
		{/* 유저 아바타 */}
		<Link
			to={`/profiles/${following.username}`}
			className="inline-flex items-center"
		>
			<img
			src={`${process.env.REACT_APP_SERVER}/files/profiles/${following.avatar}`}
			className="w-12 h-12 object-cover rounded-full border"
			/>
			<div className="ml-2">
			<span className="block font-semibold">
				{following.username}
			</span>
			<span className="block text-gray-400 text-sm">
				{following.fullName}
			</span>
			</div>
      </Link>

		{/* 팔로우 버튼 */}
		{following.isFollowing ? (
			<button
			className="ml-2 bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
			onClick={() => handleUnfollow(following.username)}
			>
			팔로잉
			</button>
		) : (
			<button
			className="ml-2 bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2 rounded-lg"
			onClick={() => handleFollow(following.username)}
			>
			팔로우
			</button>
		)}
	</div>
  ))

  return (
    <div className="px-2">
      <h3 className="text-lg my-4 font-semibold">{username}의 팔로잉</h3>
      <ul>
        {followingList}
      </ul>

      {!isLoaded && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}