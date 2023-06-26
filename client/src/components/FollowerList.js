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
}