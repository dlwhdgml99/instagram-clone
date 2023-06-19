import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import { getArticle, deleteArticle, favorite, unfavorite } from "../utils/requests";
import Spinner from "./Spinner";

export default function ArticleView() {

	// 게시물의 id
	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const navigate = useNavigate();

	// 게시물 가져오기
	useEffect(() => {
		getArticle(id)
		.then(data => {
			setArticle(data.article)
		})
		.catch(error => {
			navigate("/notfound", { replace: true });
		})
	}, [])

	console.log(article);

	// 좋아요 처리
	async function handleFavorite(id) {}

	// 좋아요 취소 처리
	async function handleUnFavorite(id) {}

	// 게시물 삭제 처리
	async function handleDelete(id) {}

	if (!article) {
		return <Spinner />
	}

	return (
		<ArticleTemplate 
			article={article}
			handleFavorite={handleFavorite}
			handleUnFavorite={handleUnFavorite}
			handleDelete={handleDelete}
		/>
	)
}