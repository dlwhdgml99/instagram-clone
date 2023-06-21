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
	async function handleFavorite(id) {
		try {
			// 서버에 좋아요 요청
			await favorite(id)
	  
			// article 업데이트
			const updatedArticle = {
			  ...article,
			  isFavorite: true,
			  favoriteCount: article.favoriteCount + 1
			}
	  
			setArticle(updatedArticle);
	  
		  } catch (error) {
			alert(error)
		  }
		}
	

	// 좋아요 취소 처리
	async function handleUnfavorite(id) {
		try {
			// 서버에 좋아요 취소처리 요청
			await unfavorite(id);
	  
			// article 업데이트
			const updatedArticle = {
			  ...article,
			  isFavorite: false,
			  favoriteCount: article.favoriteCount - 1
			}
	  
			setArticle(updatedArticle);
		  
		  } catch (error) {
			alert(error)
		  }
	}

	console.log(handleUnfavorite);

	// 게시물 삭제 처리
	async function handleDelete(id) {
		try {
			// 서버에 게시물 삭제 요청
			await deleteArticle(id);
			
			// 피드로 이동
			navigate('/', { replace: true });
		  
		  } catch (error) {
			alert(error)
		  }
	}

	if (!article) {
		return <Spinner />
	}

	return (
		<ArticleTemplate 
			article={article}
			handleFavorite={handleFavorite}
			handleUnfavorite={handleUnfavorite}
			handleDelete={handleDelete}
		/>
	)
}